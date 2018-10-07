import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import * as algoliasearch from 'algoliasearch';
import { AlgoliaService } from './algolia.service';
import { MemberService } from './member.service';

import { MemberStoreView } from '../model/views/member-store-view';
import { Store } from '../model/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pagination } from '../model/pagination';
import { QueryParams } from '../model/queryParams';
import { copyDataOnly } from './utils';
import { MemberType } from '../enum/member-type';

@Injectable({
  providedIn: 'root'
})
export class MemberStoreService {

  previewItems: Observable<MemberStoreView[]>;

  private algoliaIndex: algoliasearch.Index;
  private previewCollection: AngularFirestoreCollection<Store>;

  private get dbPath() {
    return 'MemberStore';
  }

  private getStorePath(id: string) {
    return `MemberStore/${id}`;
  }

  private getOwnerPath(id: string) {
    return `Member/${id}`;
  }

  private mapItemView = actions => actions.docs.map(a => {
    const data = a.data();
    const id = a.id;
    const isFavorite = this.memberService.checkIsFavorite(data['followerIds']);
    return { id, isFavorite, ...data } as MemberStoreView;
  })

  private get currentMember() {
    return this.memberService.sessionMember;
  }

  constructor(
    algoliaService: AlgoliaService,
    private db: AngularFirestore,
    private memberService: MemberService
  ) {
    this.algoliaIndex = algoliaService.memberStoreIndex;

    this.loadPreviewItems();
  }

  private getUpdateValueByStore(store: Store) {
    return {
      imageUrl: store.imageUrl,
      description: store.description,
      isPublished: store.isPublished,
      updatedDate: store.updatedDate
    };
  }

  addByStore(store: Store) {
    return new Promise<any>((resolve, reject) => {
      if (!store) { reject('Missing Store Data'); return; }

      const storeRef = this.db.doc(`${this.dbPath}/${store.ownerId}`).ref;
      storeRef.set({ ...copyDataOnly(store) })
        .then(() => resolve(), (err) => reject(err));
    });
  }

  updateByStore(store: Store) {
    return new Promise<any>(async (resolve, reject) => {
      if (!store) { reject('Missing Store Data'); return; }

      const storeRef = this.db.doc(`${this.dbPath}/${store.ownerId}`).ref;
      storeRef.get().then((storeDb) => {
        if (storeDb.exists) {

          const storeToUpdate = this.getUpdateValueByStore(store);
          storeRef.update({ ...storeToUpdate })
            .then(() => resolve(), (err) => reject(err));
        } else {
          resolve();
        }
      }, (err) => reject(err));

    });
  }

  deleteStore(id: string) {
    return new Promise<any>((resolve, reject) => {
      if (!id) { reject('Missing MemberStore Id'); return; }
      this.db.doc(`${this.dbPath}/${id}`).delete()
        .then(() => resolve(), (err) => reject(err));
    });
  }

  searchItems(qp: QueryParams) {
    return new Promise<Pagination<MemberStoreView>>(async (resolve, reject) => {

      const memberId = this.currentMember.id;
      const filters = ['isPublished = 1'];

      if (qp.isFavorite) {
        filters.push(`followerIds:${memberId}`);
      }

      if (qp.memberType && qp.memberType !== MemberType.NONE) {
        qp.query += ` ${qp.memberType}`;
      }

      if (qp.location) {
        if (qp.location.provinceSelected) { qp.query += ` ${qp.location.provinceSelected}`; }
        if (qp.location.districtSelected) { qp.query += ` ${qp.location.districtSelected}`; }
        if (qp.location.subDistrictSelected) { qp.query += ` ${qp.location.subDistrictSelected}`; }
        if (qp.location.postalCodeSelected) { qp.query += ` ${qp.location.postalCodeSelected}`; }
      }

      this.algoliaIndex.clearCache();
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
                    return { id, isFavorite, ...item } as MemberStoreView;
                  });

              resolve(new Pagination<MemberStoreView>(items, response.nbHits, response.page));
            } else {
              resolve(new Pagination<MemberStoreView>());
            }
          },
          err => reject(err)
        );
    });
  }

  updateFavorite(item: MemberStoreView, flag: boolean) {

    return new Promise<any>((resolve, reject) => {
      if (!item) { reject('Missing MemberStore'); return; }

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

  public loadPreviewItems() {
    this.previewCollection = this.db.collection<Store>(this.dbPath, q => q
      .where('isPublished', '==', true)
      .orderBy('updatedDate', 'desc')
      .limit(3));
    this.previewItems = this.previewCollection.get().pipe(map(this.mapItemView));
  }

  private updateFollowingIds(ids) {
    const member = this.currentMember;
    Object.assign(member, { storeFollowingIds: ids });
    this.memberService.setCurrentMember(member);
  }

}
