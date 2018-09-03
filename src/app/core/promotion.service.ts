import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Promotion } from '../model/promotion';
import { Member } from '../model/member';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  private collection: AngularFirestoreCollection<Promotion>;
  currentItems: Observable<Promotion[]>;

  private latestCollection: AngularFirestoreCollection<Promotion>;
  latestItems: Observable<Promotion[]>;

  private ownerId$ = new BehaviorSubject<string>('');

  private get dbPath() {
    return 'Promotion';
  }

  private getOwnerPath(id: string) {
    return `Member/${id}`;
  }

  private mapStore = actions => actions.map(a => {
    const data = a.payload.doc.data();
    const id = a.payload.doc.id;
    return { id, ...data } as Promotion;
  })

  constructor(
    private db: AngularFirestore
  ) {
    this.collection = this.db.collection<Promotion>(this.dbPath, q => q.orderBy('createdDate', 'asc'));
    this.currentItems = this.ownerId$.pipe(
      switchMap(id =>
        this.db.collection<Promotion>(this.dbPath,
          ref => ref.where('ownerId', '==', id).orderBy('createdDate', 'asc')
        ).snapshotChanges()
      ),
      map(this.mapStore)
    );

    this.loadLatestItems();
  }

  upsert(item: Promotion) {
    return (item.id) ? this.update(item) : this.add(item);
  }

  add(item: Promotion) {
    return new Promise<any>((resolve, reject) => {
      if (!item) { reject('Missing Promotion Data'); return; }

      this.collection.add({ ...item })
        .then(result =>
          this.assignOwner(item.ownerId, result.id)
            .then(() => resolve(), (err) => reject(err))
          , (err) => reject(err));
    });
  }

  update(item: Promotion) {
    return new Promise<any>(async (resolve, reject) => {
      if (!item) { reject('Missing Promotion Data'); return; }

      // found then update
      const itemRef = this.db.doc(`${this.dbPath}/${item.id}`).ref;
      const original = await itemRef.get();
      if (original.exists) {
        delete item.id;

        item.updatedDate = firestore.Timestamp.now();
        itemRef.update({ ...item })
          .then(() => resolve(), (err) => reject(err));
      } else {
        reject('This promotion is not registered');
      }
    });
  }

  delete(id: string, ownerId: string) {
    return new Promise<any>((resolve, reject) => {
      if (!id) { reject('Missing Promotion Id'); return; }

      this.db.doc(`${this.dbPath}/${id}`).delete()
        .then(() =>
          this.removeOwner(ownerId, id)
            .then(() => resolve(), (err) => reject(err))
          , (err) => reject(err));

    });
  }

  getOrCreateItem(id: string) {
    return new Promise<Promotion>(async (resolve, reject) => {
      id = id || this.db.createId();
      const itemRef = this.collection.doc(id).ref;
      itemRef.get().then(
        result => resolve({ id: result.id, ...result.data() } as Promotion),
        err => reject(err)
      );
    });
  }

  loadCurrentItems(ownerId: string) {
    this.ownerId$.next(ownerId);
  }

  loadLatestItems() {
    this.latestCollection = this.db.collection<Promotion>(this.dbPath, q => q.orderBy('updatedDate', 'desc').limit(4));
    this.latestItems = this.latestCollection.snapshotChanges().pipe(map(this.mapStore));
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
          owner.promotionIds.push(itemId);
        } else {
          owner.promotionIds = owner.promotionIds.filter(id => itemId !== id);
        }
        ownerRef.update({ promotionIds: owner.promotionIds })
          .then(() => resolve(), (err) => reject(err));
      } else {
        reject('This owner is not registered');
      }
    });
  }

}
