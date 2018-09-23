import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { firestore } from 'firebase/app';

import { MemberService } from './member.service';
import { MemberStoreService } from './member-store.service';
import { Store } from '../model/store';
import { StoreView } from '../model/views/store-view';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  currentItems: Observable<Store[]>;
  previewItems: Observable<StoreView[]>;

  private ownerIdSource = new BehaviorSubject<string>('');
  private previewCollection: AngularFirestoreCollection<Store>;

  private get dbPath() {
    return 'Store';
  }

  private getOwnerPath(id: string) {
    return `Member/${id}`;
  }

  private mapItem = actions => actions.map(a => {
    const data = a.payload.doc.data();
    const id = a.payload.doc.id;
    return { id, ...data } as Store;
  })

  private mapItemView = actions => actions.docs.map(a => {
    const data = a.data();
    const id = a.id;
    const isFavorite = this.memberService.checkIsFavorite(data['followerIds']);
    return { id, isFavorite, ...data } as StoreView;
  })

  private get currentMember() {
    return this.memberService.sessionMember;
  }

  constructor(
    private db: AngularFirestore,
    private memberService: MemberService,
    private memberStoreService: MemberStoreService
  ) {
    this.initCurrentItems();
    this.loadPreviewItems();
  }

  upsert(item: Store) {
    return (item.id) ? this.update(item) : this.add(item);
  }

  add(item: Store) {
    return new Promise<any>((resolve, reject) => {
      if (!item) { reject('Missing Store Data'); return; }

      const itemId = this.db.createId();
      const memberId = item.ownerId;
      const storeIds = this.currentMember.storeIds.filter(p => p !== itemId);
      storeIds.push(itemId);

      const itemRef = this.db.doc(`${this.dbPath}/${itemId}`).ref;
      const memberRef = this.db.doc(this.getOwnerPath(memberId)).ref;

      this.db.firestore
        .runTransaction(trans => {
          trans.update(memberRef, { storeIds });
          trans.set(itemRef, { ...item });
          return Promise.resolve(true);
        })
        .then(() => {
          this.memberStoreService.addByStore(item)
            .then(() => {
              // update current session
              this.updateStoreIds(storeIds);
              resolve();
            }, (error) => reject(error));
        }, (error) => reject(error))
        .catch((error) => reject(error));

    });
  }

  update(item: Store) {
    return new Promise<any>(async (resolve, reject) => {
      if (!item) { reject('Missing Store Data'); return; }

      // found then update
      const itemRef = this.db.doc(`${this.dbPath}/${item.id}`);
      item.updatedDate = firestore.Timestamp.now();
      const storeData = this.copyDataOnly(item);
      itemRef.update({ ...storeData })
        .then(() => {
          this.memberStoreService.updateByStore(storeData)
            .then(() => resolve(), (err) => reject(err));
        }, (err) => reject(err));

    });
  }

  delete(id: string) {
    return new Promise<any>((resolve, reject) => {
      if (!id) { reject('Missing Store Id'); return; }

      const memberId = this.currentMember.id;
      const storeIds = this.currentMember.storeIds.filter(p => p !== id);

      const itemRef = this.db.doc(`${this.dbPath}/${id}`).ref;
      const memberRef = this.db.doc(this.getOwnerPath(memberId)).ref;

      this.db.firestore
        .runTransaction(trans => {

          return trans.get(itemRef).then((storeSnap) => {
            if (!storeSnap.exists) {
              throw new Error('Store does not exist!');
            }

            trans.update(memberRef, { storeIds });
            trans.delete(itemRef);
          });

        })
        .then(() => {

          // update current session
          this.updateStoreIds(storeIds);

          resolve();
        }, (error) => reject(error))
        .catch((error) => reject(error));

    });

  }

  loadCurrentItems(ownerId: string) {
    this.ownerIdSource.next(ownerId);
  }


  private copyDataOnly(store: Store) {
    const data = Object.keys(store).reduce<any>((item, key) => {
      if (key !== 'id') {
        item[key] = store[key];
      }
      return item;
    }, {});
    return data;
  }

  public loadPreviewItems() {
    this.previewCollection = this.db.collection<Store>(this.dbPath, q => q
      .where('isPublished', '==', true)
      .orderBy('updatedDate', 'desc')
      .limit(4));
    this.previewItems = this.previewCollection.get().pipe(map(this.mapItemView));
  }

  private updateStoreIds(ids) {
    const member = this.currentMember;
    Object.assign(member, { storeIds: ids });
    this.memberService.setCurrentMember(member);
  }

  private initCurrentItems() {
    this.currentItems = this.ownerIdSource.pipe(
      switchMap(id =>
        this.db.collection<Store>(this.dbPath,
          ref => ref.where('ownerId', '==', id).orderBy('createdDate', 'asc')
        ).snapshotChanges()
      ),
      map(this.mapItem)
    );
  }

}
