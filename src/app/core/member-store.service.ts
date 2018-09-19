import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Member } from '../model/member';
import { Store } from '../model/store';

@Injectable({
  providedIn: 'root'
})
export class MemberStoreService {

  private get dbPath() {
    return 'MemberStore';
  }

  constructor(private db: AngularFirestore) { }

  private createStoreByMember(member: Member) {
    const store = new Store();
    store.ownerId = member.id;
    store.storeName = member.storeName;
    store.storeDescription = member.storeDescription;
    store.isPublished = true;
    return store;
  }

  private getUpdateValueByMember(member: Member) {
    return {
      storeName: member.storeName,
      storeDescription: member.storeDescription
    };
  }

  addByMember(member: Member) {
    return new Promise<any>((resolve, reject) => {
      if (!member) { reject('Missing Member Data'); return; }

      const storeRef = this.db.doc(`${this.dbPath}/${member.id}`).ref;

      const store = this.createStoreByMember(member);
      storeRef.set({ ...store })
        .then(() => resolve(), (err) => reject(err));
    });
  }

  addByStore(store: Store) {
    return new Promise<any>((resolve, reject) => {
      if (!store) { reject('Missing Store Data'); return; }

      const storeRef = this.db.doc(`${this.dbPath}/${store.ownerId}`).ref;
      delete store.id;
      storeRef.set({ ...store })
        .then(() => resolve(), (err) => reject(err));
    });
  }

  updateByMember(member: Member) {
    return new Promise<any>(async (resolve, reject) => {
      if (!member) { reject('Missing Member Data'); return; }

      const storeRef = this.db.doc(`${this.dbPath}/${member.id}`).ref;
      const storeUpdate = this.getUpdateValueByMember(member);
      storeRef.update({ ...storeUpdate })
        .then(() => resolve(), (err) => reject(err));

    });
  }

  updateByStore(store: Store) {
    return new Promise<any>(async (resolve, reject) => {
      if (!store) { reject('Missing Store Data'); return; }

      const storeRef = this.db.doc(`${this.dbPath}/${store.ownerId}`).ref;
      delete store.id;
      storeRef.update({ ...store })
        .then(() => resolve(), (err) => reject(err));
    });
  }

  deleteStore(id: string) {
    return new Promise<any>((resolve, reject) => {
      if (!id) { reject('Missing MemberStore Id'); return; }
      this.db.doc(`${this.dbPath}/${id}`).delete()
        .then(() => resolve(), (err) => reject(err));
    });
  }

}
