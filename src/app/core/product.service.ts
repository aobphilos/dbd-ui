import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { firestore } from 'firebase/app';

import * as algoliasearch from 'algoliasearch';
import { AlgoliaService } from './algolia.service';
import { MemberService } from './member.service';

import { Product } from '../model/product';
import { ProductView } from '../model/views/product-view';
import { Pagination } from '../model/pagination';
import { QueryParams } from '../model/queryParams';
import { copyDataOnly } from './utils';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  currentItems: Observable<Product[]>;
  previewItems: Observable<ProductView[]>;
  ownerItems: Observable<ProductView[]>;

  private algoliaIndex: algoliasearch.Index;
  private ownerIdSource = new BehaviorSubject<string>('');

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

  private mapItemView = actions => actions.docs.map(a => {
    const data = a.data();
    const id = a.id;
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
        trans.set(itemRef, { ...copyDataOnly(item) });
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
      item.updatedDate = firestore.Timestamp.now();
      itemRef.update({ ...copyDataOnly(item) })
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

  searchItems(qp: QueryParams) {
    return new Promise<Pagination<ProductView>>(async (resolve, reject) => {

      const memberId = this.currentMember.id;
      const filters = ['isPublished = 1'];

      if (qp.isFavorite) {
        filters.push(`followerIds:${memberId}`);
      }

      if (qp.priceRange && qp.priceRange !== 'none') {
        const prices = qp.priceRange.split('-');
        const segments = [];
        segments.push(`price >= ${prices[0]}`);
        if (prices[1] !== '') {
          segments.push(`price <= ${prices[1]}`);
        }
        filters.push(`( ${segments.join(' AND ')} )`);
      }

      if (qp.location) {
        if (qp.location.provinceSelected) { qp.query += ` ${qp.location.provinceSelected}`; }
        if (qp.location.districtSelected) { qp.query += ` ${qp.location.districtSelected}`; }
        if (qp.location.subDistrictSelected) { qp.query += ` ${qp.location.subDistrictSelected}`; }
        if (qp.location.postalCodeSelected) { qp.query += ` ${qp.location.postalCodeSelected}`; }
      }

      this.algoliaIndex.search({
        query: qp.query,
        page: qp.pageIndex,
        hitsPerPage: qp.hitsPerPage,
        filters: filters.join(' AND ')
      })
        .then(
          response => {
            const results = response.hits;
            if (results && results.length > 0) {
              const items = results
                .map(
                  item => {
                    const id = item['objectID'];
                    delete item['objectID'];
                    const isFavorite = this.memberService.checkIsFavorite(item['followerIds']);
                    return { id, isFavorite, ...item } as ProductView;
                  });
              resolve(new Pagination<ProductView>(items, response.nbHits, response.page));
            } else {
              resolve(new Pagination<ProductView>());
            }
          },
          err => reject(err)
        );
    });
  }

  loadCurrentItems(ownerId: string) {
    this.ownerIdSource.next(ownerId);
  }

  public loadPreviewItems() {
    const previewCollection = this.db.collection<Product>(this.dbPath, q => q
      .where('isPublished', '==', true)
      .orderBy('updatedDate', 'desc')
      .limit(4));
    this.previewItems = previewCollection.get().pipe(map(this.mapItemView));
  }

  public loadItemByOwner(ownerId: string) {
    const ownerCollection = this.db.collection<Product>(this.dbPath, q => q
      .where('ownerId', '==', ownerId)
      .where('isPublished', '==', true)
      .orderBy('updatedDate', 'desc'));

    this.ownerItems = ownerCollection.get().pipe(map(this.mapItemView));
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
