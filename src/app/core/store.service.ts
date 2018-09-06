import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Store } from '../model/store';
import { Member } from '../model/member';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { firestore } from 'firebase/app';

import { SearchCriteria } from '../model/searchCriteria';
import * as algoliasearch from 'algoliasearch';
import { AlgoliaService } from './algolia.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private collection: AngularFirestoreCollection<Store>;
  currentItems: Observable<Store[]>;

  private latestCollection: AngularFirestoreCollection<Store>;
  latestItems: Observable<Store[]>;

  private algoliaIndex: algoliasearch.Index;

  private ownerIdSource = new BehaviorSubject<string>('');
  private searchCriteriaSource = new BehaviorSubject<SearchCriteria>(new SearchCriteria());

  private get dbPath() {
    return 'Store';
  }

  private getOwnerPath(id: string) {
    return `Member/${id}`;
  }

  private mapStore = actions => actions.map(a => {
    const data = a.payload.doc.data();
    const id = a.payload.doc.id;
    return { id, ...data } as Store;
  })

  constructor(
    private db: AngularFirestore,
    algoliaService: AlgoliaService
  ) {
    this.collection = this.db.collection<Store>(this.dbPath, q => q.orderBy('updatedDate', 'desc'));
    this.algoliaIndex = algoliaService.storeIndex;

    this.initCurrentItems();
    this.loadLatestItems();
  }

  upsert(item: Store) {
    return (item.id) ? this.update(item) : this.add(item);
  }

  add(item: Store) {
    return new Promise<any>((resolve, reject) => {
      if (!item) { reject('Missing Store Data'); return; }

      this.collection.add({ ...item })
        .then(result =>
          this.assignOwner(item.ownerId, result.id)
            .then(() => resolve(), (err) => reject(err))
          , (err) => reject(err));
    });
  }

  update(item: Store) {
    return new Promise<any>(async (resolve, reject) => {
      if (!item) { reject('Missing Store Data'); return; }

      // found then update
      const itemRef = this.db.doc(`${this.dbPath}/${item.id}`).ref;
      const original = await itemRef.get();
      if (original.exists) {
        delete item.id;

        item.updatedDate = firestore.Timestamp.now();
        itemRef.update({ ...item })
          .then(() => resolve(), (err) => reject(err));
      } else {
        reject('This store is not registered');
      }
    });
  }

  delete(id: string, ownerId: string) {
    return new Promise<any>((resolve, reject) => {
      if (!id) { reject('Missing Store Id'); return; }

      this.db.doc(`${this.dbPath}/${id}`).delete()
        .then(() =>
          this.removeOwner(ownerId, id)
            .then(() => resolve(), (err) => reject(err))
          , (err) => reject(err));

    });
  }

  getOrCreateItem(id: string) {
    return new Promise<Store>(async (resolve, reject) => {
      id = id || this.db.createId();
      const itemRef = this.collection.doc(id).ref;
      itemRef.get().then(
        result => resolve({ id: result.id, ...result.data() } as Store),
        err => reject(err)
      );
    });
  }

  searchItems(query: string) {
    return new Promise<Store[]>(async (resolve, reject) => {
      this.algoliaIndex.search({ query })
        .then(
          response => {
            const results = response.hits;
            if (results) {
              const items = results.map(
                item => {
                  const id = item['objectID'];
                  delete item['objectID'];
                  return { id, ...item } as Store;
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

  loadLatestItems() {
    this.latestCollection = this.db.collection<Store>(this.dbPath, q => q.orderBy('updatedDate', 'desc').limit(4));
    this.latestItems = this.latestCollection.snapshotChanges().pipe(map(this.mapStore));
  }

  private initCurrentItems() {
    this.currentItems = this.ownerIdSource.pipe(
      switchMap(id =>
        this.db.collection<Store>(this.dbPath,
          ref => ref.where('ownerId', '==', id).orderBy('createdDate', 'asc')
        ).snapshotChanges()
      ),
      map(this.mapStore)
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
          owner.storeIds.push(itemId);
        } else {
          owner.storeIds = owner.storeIds.filter(id => itemId !== id);
        }
        ownerRef.update({ storeIds: owner.storeIds })
          .then(() => resolve(), (err) => reject(err));
      } else {
        reject('This owner is not registered');
      }
    });
  }

}
