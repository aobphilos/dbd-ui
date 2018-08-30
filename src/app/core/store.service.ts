import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Store } from '../model/store';
import { Member } from '../model/member';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private collection: AngularFirestoreCollection<Store>;
  currentItems: Observable<Store[]>;
  private ownerId$ = new BehaviorSubject<string>('');

  private get dbPath() {
    return 'Store';
  }

  private getOwnerPath(id: string) {
    return `Member/${id}`;
  }

  constructor(
    private db: AngularFirestore
  ) {
    this.collection = this.db.collection<Store>(this.dbPath, q => q.orderBy('createdDate', 'asc'));
    this.currentItems = this.ownerId$.pipe(
      switchMap(id =>
        this.db.collection<Store>(this.dbPath,
          ref => ref.where('ownerId', '==', id).orderBy('createdDate', 'asc')
        ).snapshotChanges()
      ),
      map(items => items.map(
        a => {
          const id = a.payload.doc.id;
          const data = a.payload.doc.data();
          return { id, ...data } as Store;
        }
      ))
    );
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

  loadCurrentItems(ownerId: string) {
    this.ownerId$.next(ownerId);
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
