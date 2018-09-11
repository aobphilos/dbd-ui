import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Product } from '../model/product';
import { Member } from '../model/member';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { firestore } from 'firebase/app';

import { SearchCriteria } from '../model/searchCriteria';
import * as algoliasearch from 'algoliasearch';
import { AlgoliaService } from './algolia.service';
import { MemberService } from './member.service';
import { ProductView } from '../model/views/product-view';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private collection: AngularFirestoreCollection<Product>;
  currentItems: Observable<Product[]>;

  private previewCollection: AngularFirestoreCollection<Product>;
  previewItems: Observable<ProductView[]>;

  private algoliaIndex: algoliasearch.Index;

  private ownerIdSource = new BehaviorSubject<string>('');
  private searchCriteriaSource = new BehaviorSubject<SearchCriteria>(new SearchCriteria());

  private get dbPath() {
    return 'Product';
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

  constructor(
    algoliaService: AlgoliaService,
    private db: AngularFirestore,
    private memberService: MemberService
  ) {
    this.collection = this.db.collection<Product>(this.dbPath, q => q.orderBy('createdDate', 'asc'));
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

      this.collection.add({ ...item })
        .then(result =>
          this.assignOwner(item.ownerId, result.id)
            .then(() => resolve(), (err) => reject(err))
          , (err) => reject(err));
    });
  }

  update(item: Product) {
    return new Promise<any>(async (resolve, reject) => {
      if (!item) { reject('Missing Product Data'); return; }

      // found then update
      const itemRef = this.db.doc(`${this.dbPath}/${item.id}`).ref;
      const original = await itemRef.get();
      if (original.exists) {
        delete item.id;

        item.updatedDate = firestore.Timestamp.now();
        itemRef.update({ ...item })
          .then(() => resolve(), (err) => reject(err));
      } else {
        reject('This product is not registered');
      }
    });
  }

  delete(id: string, ownerId: string) {
    return new Promise<any>((resolve, reject) => {
      if (!id) { reject('Missing Product Id'); return; }

      this.db.doc(`${this.dbPath}/${id}`).delete()
        .then(() =>
          this.removeOwner(ownerId, id)
            .then(() => resolve(), (err) => reject(err))
          , (err) => reject(err));

    });
  }

  getOrCreateItem(id: string) {
    return new Promise<Product>(async (resolve, reject) => {
      id = id || this.db.createId();
      const itemRef = this.collection.doc(id).ref;
      itemRef.get().then(
        result => resolve({ id: result.id, ...result.data() } as Product),
        err => reject(err)
      );
    });
  }

  searchItems(query: string) {
    return new Promise<Product[]>(async (resolve, reject) => {
      this.algoliaIndex.search({ query })
        .then(
          response => {
            const results = response.hits;
            if (results) {
              const items = results.map(
                item => {
                  const id = item['objectID'];
                  delete item['objectID'];
                  return { id, ...item } as Product;
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

  loadPreviewItems() {
    this.previewCollection = this.db.collection<Product>(this.dbPath, q => q.orderBy('updatedDate', 'desc').limit(4));
    this.previewItems = this.previewCollection.snapshotChanges().pipe(map(this.mapItemView));
  }

  updateFavorite(item: ProductView, flag: boolean) {
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

  private assignOwner(ownerId: string, itemId: string) {
    return this.updateOwner(ownerId, itemId, true);
  }

  private removeOwner(ownerId: string, itemId: string) {
    return this.updateOwner(ownerId, itemId, false);
  }

  private updateOwner(ownerId: string, itemId: string, isAssign: boolean) {
    return new Promise<any>(async (resolve, reject) => {
      if (!ownerId) { reject('Missing Owner Id'); return; }
      if (!itemId) { reject('Missing Item Id'); return; }

      // found then update
      const ownerRef = this.db.doc(this.getOwnerPath(ownerId)).ref;
      const original = await ownerRef.get();
      if (original.exists) {
        const owner = original.data() as Member;
        if (isAssign) {
          owner.productIds.push(itemId);
        } else {
          owner.productIds = owner.productIds.filter(id => itemId !== id);
        }
        ownerRef.update({ productIds: owner.productIds })
          .then(() => resolve(), (err) => reject(err));
      } else {
        reject('This owner is not registered');
      }
    });
  }

}
