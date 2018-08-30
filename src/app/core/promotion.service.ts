import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Promotion } from '../model/promotion';
import { Member } from '../model/member';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  private collection: AngularFirestoreCollection<Promotion>;

  private get dbPath() {
    return 'Promotion';
  }

  private getOwnerPath(id: string) {
    return `Member/${id}`;
  }

  constructor(
    private db: AngularFirestore
  ) {
    this.collection = this.db.collection<Promotion>(this.dbPath, q => q.orderBy('createdDate', 'asc'));
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
