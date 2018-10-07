import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { firestore } from 'firebase/app';

import * as algoliasearch from 'algoliasearch';
import { AlgoliaService } from './algolia.service';
import { MemberService } from './member.service';

import { Promotion } from '../model/promotion';
import { PromotionView } from '../model/views/promotion-view';
import { Pagination } from '../model/pagination';
import { QueryParams } from '../model/queryParams';
import { copyDataOnly } from './utils';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  currentItems: Observable<Promotion[]>;
  previewItems: Observable<PromotionView[]>;
  ownerItems: Observable<PromotionView[]>;

  private algoliaIndex: algoliasearch.Index;
  private ownerIdSource = new BehaviorSubject<string>('');

  private get dbPath() {
    return 'Promotion';
  }

  private getPromotionPath(id: string) {
    return `Promotion/${id}`;
  }

  private getOwnerPath(id: string) {
    return `Member/${id}`;
  }

  private mapItem = actions => actions.map(a => {
    const data = a.payload.doc.data();
    const id = a.payload.doc.id;
    return { id, ...data } as Promotion;
  })

  private mapItemView = actions => actions.docs.map(a => {
    const data = a.data();
    const id = a.id;
    const isFavorite = this.memberService.checkIsFavorite(data['followerIds']);
    return { id, isFavorite, ...data } as PromotionView;
  })

  private get currentMember() {
    return this.memberService.sessionMember;
  }

  constructor(
    algoliaService: AlgoliaService,
    private db: AngularFirestore,
    private memberService: MemberService
  ) {
    this.algoliaIndex = algoliaService.promotionIndex;

    this.initCurrentItems();
    this.loadPreviewItems();
  }

  upsert(item: Promotion) {
    return (item.id) ? this.update(item) : this.add(item);
  }

  add(item: Promotion) {
    return new Promise<any>((resolve, reject) => {
      if (!item) { reject('Missing Promotion Data'); return; }

      const itemId = this.db.createId();
      const memberId = item.ownerId;
      const promotionIds = this.currentMember.promotionIds.filter(p => p !== itemId);
      promotionIds.push(itemId);

      const itemRef = this.db.doc(`${this.dbPath}/${itemId}`).ref;
      const memberRef = this.db.doc(this.getOwnerPath(memberId)).ref;

      this.db.firestore.runTransaction(trans => {
        trans.update(memberRef, { promotionIds });
        trans.set(itemRef, { ...copyDataOnly(item) });
        return Promise.resolve(true);
      })
        .then(() => {
          // update current session
          this.updatePromotionIds(promotionIds);
          resolve();
        }, (error) => reject(error))
        .catch((error) => reject(error));

    });
  }

  update(item: Promotion) {
    return new Promise<any>(async (resolve, reject) => {
      if (!item) { reject('Missing Promotion Data'); return; }

      // found then update
      const itemRef = this.db.doc(`${this.dbPath}/${item.id}`);
      item.updatedDate = firestore.Timestamp.now();
      itemRef.update({ ...copyDataOnly(item) })
        .then(() => resolve(), (err) => reject(err));

    });
  }

  delete(id: string) {
    return new Promise<any>((resolve, reject) => {
      if (!id) { reject('Missing Promotion Id'); return; }

      const memberId = this.currentMember.id;
      const promotionIds = this.currentMember.promotionIds.filter(p => p !== id);

      const itemRef = this.db.doc(`${this.dbPath}/${id}`).ref;
      const memberRef = this.db.doc(this.getOwnerPath(memberId)).ref;

      this.db.firestore.runTransaction(trans => {

        return trans.get(itemRef).then((promotionSnap) => {
          if (!promotionSnap.exists) {
            throw new Error('Promotion does not exist!');
          }

          // remove follower
          const promotion = promotionSnap.data() as Promotion;
          promotion.followerIds.forEach(followerId => {
            const followerRef = this.db.doc(this.getOwnerPath(followerId)).ref;
            trans.update(followerRef, {
              promotionFollowingIds: firestore.FieldValue.arrayRemove(id)
            });
          });

          trans.update(memberRef, { promotionIds });
          trans.delete(itemRef);
        });

      })
        .then(() => {

          // update current session
          this.updatePromotionIds(promotionIds);

          resolve();
        }, (error) => reject(error))
        .catch((error) => reject(error));

    });

  }

  searchItems(qp: QueryParams) {
    return new Promise<Pagination<PromotionView>>(async (resolve, reject) => {

      const memberId = this.currentMember.id;
      const filters = ['isPublished = 1'];

      if (qp.isFavorite) {
        filters.push(`followerIds:${memberId}`);
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
                    return { id, isFavorite, ...item } as PromotionView;
                  });

              resolve(new Pagination<PromotionView>(items, response.nbHits, response.page));
            } else {
              resolve(new Pagination<PromotionView>());
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
    const previewCollection = this.db.collection<Promotion>(this.dbPath, q => q
      .where('isPublished', '==', true)
      .orderBy('updatedDate', 'desc')
      .limit(4));
    this.previewItems = previewCollection.get().pipe(map(this.mapItemView));
  }

  public loadItemByOwner(ownerId: string) {
    const ownerCollection = this.db.collection<Promotion>(this.dbPath, q => q
      .where('ownerId', '==', ownerId)
      .where('isPublished', '==', true)
      .orderBy('updatedDate', 'desc'));

    this.ownerItems = ownerCollection.get().pipe(map(this.mapItemView));
  }


  updateFavorite(item: PromotionView, flag: boolean) {

    return new Promise<any>((resolve, reject) => {
      if (!item) { reject('Missing Promotion'); return; }

      const promotionId = item.id;
      const memberId = this.currentMember.id;
      const promotionFollowingIds = this.currentMember.promotionFollowingIds.filter(p => p !== promotionId);
      const followerIds = item.followerIds.filter(f => f !== memberId);

      const memberRef = this.db.doc(this.getOwnerPath(memberId)).ref;
      const promotionRef = this.db.doc(this.getPromotionPath(promotionId)).ref;

      if (flag) {
        promotionFollowingIds.push(promotionId);
        followerIds.push(memberId);
      }

      this.db.firestore.runTransaction<boolean>(trans => {
        trans.update(memberRef, { promotionFollowingIds });
        trans.update(promotionRef, { followerIds });
        return Promise.resolve(true);
      })
        .then(() => {
          // update current session
          this.updateFollowingIds(promotionFollowingIds);

          resolve();
        }, (error) => reject(error))
        .catch((error) => reject(error));

    });
  }

  private updateFollowingIds(ids) {
    const member = this.currentMember;
    Object.assign(member, { promotionFollowingIds: ids });
    this.memberService.setCurrentMember(member);
  }

  private updatePromotionIds(ids) {
    const member = this.currentMember;
    Object.assign(member, { promotionIds: ids });
    this.memberService.setCurrentMember(member);
  }

  private initCurrentItems() {
    this.currentItems = this.ownerIdSource.pipe(
      switchMap(id =>
        this.db.collection<Promotion>(this.dbPath,
          ref => ref.where('ownerId', '==', id).orderBy('createdDate', 'asc')
        ).snapshotChanges()
      ),
      map(this.mapItem)
    );
  }

}
