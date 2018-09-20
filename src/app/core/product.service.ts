import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { firestore } from 'firebase/app';

import * as algoliasearch from 'algoliasearch';
import { AlgoliaService } from './algolia.service';
import { MemberService } from './member.service';

import { Product } from '../model/product';
import { ProductView } from '../model/views/product-view';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  currentItems: Observable<Product[]>;
  previewItems: Observable<ProductView[]>;

  private algoliaIndex: algoliasearch.Index;
  private ownerIdSource = new BehaviorSubject<string>('');
  private previewCollection: AngularFirestoreCollection<Product>;

  private get dbPath() {
    return 'Product';
  }

  private getProductPath(id: string) {
    return `Product/${id}`;
  }

  private getOwnerPath(id: string) {
    return `Member/${id}`;
  }

  private mapItem = actions => actions.map(a => {
    const data = a.payload.doc.data();
    const id = a.payload.doc.id;
    return { id, ...data } as Product;
  })

  private mapItemView = actions => actions.map(a => {
    const data = a.payload.doc.data();
    const id = a.payload.doc.id;
    const isFavorite = this.memberService.checkIsFavorite(data['followerIds']);
    return { id, isFavorite, ...data } as ProductView;
  })

  private get currentMember() {
    return this.memberService.sessionMember;
  }

  constructor(
    algoliaService: AlgoliaService,
    private db: AngularFirestore,
    private memberService: MemberService
  ) {
    this.algoliaIndex = algoliaService.productIndex;

    this.initCurrentItems();
    this.loadPreviewItems();
  }

  upsert(item: Product) {
    return (item.id) ? this.update(item) : this.add(item);
  }

  add(item: Product) {
    return new Promise<any>((resolve, reject) => {
      if (!item) { reject('Missing Product Data'); return; }

      const itemId = this.db.createId();
      const memberId = item.ownerId;
      const productIds = this.currentMember.productIds.filter(p => p !== itemId);
      productIds.push(itemId);

      const itemRef = this.db.doc(`${this.dbPath}/${itemId}`).ref;
      const memberRef = this.db.doc(this.getOwnerPath(memberId)).ref;

      this.db.firestore.runTransaction(trans => {
        trans.update(memberRef, { productIds });
        trans.set(itemRef, { ...item });
        return Promise.resolve(true);
      })
        .then(() => {
          // update current session
          this.updateProducIds(productIds);
          resolve();
        }, (error) => reject(error))
        .catch((error) => reject(error));

    });
  }

  update(item: Product) {
    return new Promise<any>(async (resolve, reject) => {
      if (!item) { reject('Missing Product Data'); return; }

      // found then update
      const itemRef = this.db.doc(`${this.dbPath}/${item.id}`);

      delete item.id;

      item.updatedDate = firestore.Timestamp.now();

      itemRef.update({ ...item })
        .then(() => resolve(), (err) => reject(err));

    });
  }

  delete(id: string) {
    return new Promise<any>((resolve, reject) => {
      if (!id) { reject('Missing Product Id'); return; }

      const memberId = this.currentMember.id;
      const productIds = this.currentMember.productIds.filter(p => p !== id);

      const itemRef = this.db.doc(`${this.dbPath}/${id}`).ref;
      const memberRef = this.db.doc(this.getOwnerPath(memberId)).ref;

      this.db.firestore.runTransaction(trans => {

        return trans.get(itemRef).then((productSnap) => {
          if (!productSnap.exists) {
            throw new Error('Owner does not exist!');
          }

          // remove follower
          const product = productSnap.data() as Product;
          product.followerIds.forEach(followerId => {
            const followerRef = this.db.doc(this.getOwnerPath(followerId)).ref;
            trans.update(followerRef, { productFollowingIds: firestore.FieldValue.arrayRemove(id) });
          });

          trans.update(memberRef, { productIds });
          trans.delete(itemRef);
        });

      })
        .then(() => {

          // update current session
          this.updateProducIds(productIds);

          resolve();
        }, (error) => reject(error))
        .catch((error) => reject(error));

    });

  }

  searchItems(query: string) {
    return new Promise<ProductView[]>(async (resolve, reject) => {
      this.algoliaIndex.search({ query })
        .then(
          response => {
            const results = response.hits;
            if (results) {
              const items = results
                .filter(item => item['isPublished'] === true)
                .map(
                  item => {
                    const id = item['objectID'];
                    delete item['objectID'];
                    const isFavorite = this.memberService.checkIsFavorite(item['followerIds']);
                    return { id, isFavorite, ...item } as ProductView;
                  });
              resolve(items);
            } else {
              resolve([]);
            }
          },
          err => reject(err)
        );
    });
  }

  loadCurrentItems(ownerId: string) {
    this.ownerIdSource.next(ownerId);
  }

  private loadPreviewItems() {
    this.previewCollection = this.db.collection<Product>(this.dbPath, q => q
      .where('isPublished', '==', true)
      .orderBy('updatedDate', 'desc')
      .limit(4));
    this.previewItems = this.previewCollection.snapshotChanges().pipe(map(this.mapItemView));
  }

  updateFavorite(item: ProductView, flag: boolean) {

    return new Promise<any>((resolve, reject) => {
      if (!item) { reject('Missing Product'); return; }

      const productId = item.id;
      const memberId = this.currentMember.id;
      const productFollowingIds = this.currentMember.productFollowingIds.filter(p => p !== productId);
      const followerIds = item.followerIds.filter(f => f !== memberId);

      const memberRef = this.db.doc(this.getOwnerPath(memberId)).ref;
      const productRef = this.db.doc(this.getProductPath(productId)).ref;

      if (flag) {
        productFollowingIds.push(productId);
        followerIds.push(memberId);
      }

      this.db.firestore.runTransaction<boolean>(trans => {
        trans.update(memberRef, { productFollowingIds });
        trans.update(productRef, { followerIds });
        return Promise.resolve(true);
      })
        .then(() => {
          // update current session
          this.updateFollowingIds(productFollowingIds);

          resolve();
        }, (error) => reject(error))
        .catch((error) => reject(error));

    });
  }

  private updateFollowingIds(ids) {
    const member = this.currentMember;
    Object.assign(member, { productFollowingIds: ids });
    this.memberService.setCurrentMember(member);
  }

  private updateProducIds(ids) {
    const member = this.currentMember;
    Object.assign(member, { productIds: ids });
    this.memberService.setCurrentMember(member);
  }

  private initCurrentItems() {
    this.currentItems = this.ownerIdSource.pipe(
      switchMap(id =>
        this.db.collection<Product>(this.dbPath,
          ref => ref.where('ownerId', '==', id).orderBy('createdDate', 'asc')
        ).snapshotChanges()
      ),
      map(this.mapItem)
    );
  }

}
