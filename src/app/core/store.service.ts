import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { firestore } from 'firebase/app';

import * as algoliasearch from 'algoliasearch';
import { AlgoliaService } from './algolia.service';
import { MemberService } from './member.service';

import { Store } from '../model/store';
import { StoreView } from '../model/views/store-view';
import { Member } from '../model/member';


@Injectable({
    providedIn: 'root'
})
export class StoreService {

    currentItems: Observable<Store[]>;
    previewItems: Observable<StoreView[]>;

    private algoliaIndex: algoliasearch.Index;
    private ownerIdSource = new BehaviorSubject<string>('');
    private previewCollection: AngularFirestoreCollection<Store>;
    private memberStore: Member[];

    private get dbPath() {
        return 'Store';
    }

    private getStorePath(id: string) {
        return `Store/${id}`;
    }

    private getOwnerPath(id: string) {
        return `Member/${id}`;
    }

    private mapItem = actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data } as Store;
    })

    private mapItemView = actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        const isFavorite = this.memberService.checkIsFavorite(data['followerIds']);
        return { id, isFavorite, ...data } as StoreView;
    })

    private get currentMember() {
        return this.memberService.sessionMember;
    }

    constructor(
        algoliaService: AlgoliaService,
        private db: AngularFirestore,
        private memberService: MemberService
    ) {
        this.algoliaIndex = algoliaService.storeIndex;
        this.memberStore = [];

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
                    // update current session
                    this.updateStoreIds(storeIds);
                    resolve();
                }, (error) => reject(error))
                .catch((error) => reject(error));

        });
    }

    update(item: Store) {
        return new Promise<any>(async (resolve, reject) => {
            if (!item) { reject('Missing Store Data'); return; }

            // found then update
            const itemRef = this.db.doc(`${this.dbPath}/${item.id}`);

            delete item.id;

            item.updatedDate = firestore.Timestamp.now();

            itemRef.update({ ...item })
                .then(() => resolve(), (err) => reject(err));

        });
    }

    delete(id: string, ownerId: string) {
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

                        // remove follower
                        const store = storeSnap.data() as Store;
                        store.followerIds.forEach(followerId => {
                            const followerRef = this.db.doc(this.getOwnerPath(followerId)).ref;
                            trans.update(followerRef, {
                                storeFollowingIds: firestore.FieldValue.arrayRemove(id)
                            });
                        });

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

    searchItems(query: string) {
        return new Promise<StoreView[]>(async (resolve, reject) => {
            this.algoliaIndex.search({ query })
                .then(
                    response => {
                        const results = response.hits;
                        if (results) {
                            const items = results.map(
                                item => {
                                    const id = item['objectID'];
                                    delete item['objectID'];
                                    const isFavorite = this.memberService.checkIsFavorite(item['followerIds']);
                                    return { id, isFavorite, ...item } as StoreView;
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
        const memberId = this.currentMember.id;
        // load members
        const memberCollection = this.db.collection<Member>('Member', q => q
            .orderBy('updatedDate', 'desc')
            .limit(5)
        );

        const memberSnapshot = memberCollection.snapshotChanges().pipe(
            map(actions => actions
                .filter(member => member.payload.doc.id !== memberId)
                .map(member => {
                    const data = member.payload.doc.data();
                    const id = member.payload.doc.id;
                    return { id, ...data } as Member;
                })
            )
        );

        memberSnapshot.subscribe(members => {
            if (members) {
                this.memberStore.splice(0);
                members.forEach((m, i) => {
                    if (i < 4) {
                        this.memberStore.push(m);
                    }
                });
                console.log(...this.memberStore.map(m => m.storeName));
            }
        });

        this.previewCollection = this.db.collection<Store>(this.dbPath, q => q
            .where('isPublished', '==', true)
            .orderBy('updatedDate', 'desc')
            .limit(4));
        this.previewItems = this.previewCollection.snapshotChanges().pipe(map(this.mapItemView));
    }

    updateFavorite(item: StoreView, flag: boolean) {

        return new Promise<any>((resolve, reject) => {
            if (!item) { reject('Missing Store'); return; }

            const storeId = item.id;
            const memberId = this.currentMember.id;
            const storeFollowingIds = this.currentMember.storeFollowingIds.filter(p => p !== storeId);
            const followerIds = item.followerIds.filter(f => f !== memberId);

            const memberRef = this.db.doc(this.getOwnerPath(memberId)).ref;
            const storeRef = this.db.doc(this.getStorePath(storeId)).ref;

            if (flag) {
                storeFollowingIds.push(storeId);
                followerIds.push(memberId);
            }

            this.db.firestore
                .runTransaction<boolean>(trans => {
                    trans.update(memberRef, { storeFollowingIds });
                    trans.update(storeRef, { followerIds });
                    return Promise.resolve(true);
                })
                .then(() => {
                    // update current session
                    this.updateFollowingIds(storeFollowingIds);

                    resolve();
                }, (error) => reject(error))
                .catch((error) => reject(error));

        });
    }

    private updateFollowingIds(ids) {
        const member = this.currentMember;
        Object.assign(member, { storeFollowingIds: ids });
        this.memberService.setCurrentMember(member);
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
