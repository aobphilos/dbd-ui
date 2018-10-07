import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { firestore } from 'firebase/app';

import * as algoliasearch from 'algoliasearch';
import { AlgoliaService } from './algolia.service';
import { MemberService } from './member.service';

import { News } from '../model/news';
import { NewsView } from '../model/views/news-view';
import { Pagination } from '../model/pagination';
import { QueryParams } from '../model/queryParams';
import { copyDataOnly } from './utils';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  currentItems: Observable<News[]>;
  previewItems: Observable<NewsView[]>;
  ownerItems: Observable<NewsView[]>;

  private algoliaIndex: algoliasearch.Index;
  private ownerIdSource = new BehaviorSubject<string>('');

  private get dbPath() {
    return 'News';
  }

  private getNewsPath(id: string) {
    return `News/${id}`;
  }

  private getOwnerPath(id: string) {
    return `Member/${id}`;
  }

  private mapItem = actions => actions.map(a => {
    const data = a.payload.doc.data();
    const id = a.payload.doc.id;
    return { id, ...data } as News;
  })

  private mapItemView = actions => actions.docs.map(a => {
    const data = a.data();
    const id = a.id;
    const isFavorite = this.memberService.checkIsFavorite(data['followerIds']);
    return { id, isFavorite, ...data } as NewsView;
  })

  private get currentMember() {
    return this.memberService.sessionMember;
  }

  constructor(
    algoliaService: AlgoliaService,
    private db: AngularFirestore,
    private memberService: MemberService
  ) {
    this.algoliaIndex = algoliaService.newsIndex;

    this.initCurrentItems();
    this.loadPreviewItems();
  }

  upsert(item: News) {
    return (item.id) ? this.update(item) : this.add(item);
  }

  add(item: News) {
    return new Promise<any>((resolve, reject) => {
      if (!item) { reject('Missing News Data'); return; }

      const itemId = this.db.createId();
      const memberId = item.ownerId;
      const newsIds = this.currentMember.newsIds.filter(p => p !== itemId);
      newsIds.push(itemId);

      const itemRef = this.db.doc(`${this.dbPath}/${itemId}`).ref;
      const memberRef = this.db.doc(this.getOwnerPath(memberId)).ref;

      this.db.firestore.runTransaction(trans => {
        trans.update(memberRef, { newsIds });
        trans.set(itemRef, { ...copyDataOnly(item) });
        return Promise.resolve(true);
      })
        .then(() => {
          // update current session
          this.updateNewsIds(newsIds);
          resolve();
        }, (error) => reject(error))
        .catch((error) => reject(error));

    });
  }

  update(item: News) {
    return new Promise<any>(async (resolve, reject) => {
      if (!item) { reject('Missing News Data'); return; }

      // found then update
      const itemRef = this.db.doc(`${this.dbPath}/${item.id}`);
      item.updatedDate = firestore.Timestamp.now();
      itemRef.update({ ...copyDataOnly(item) })
        .then(() => resolve(), (err) => reject(err));

    });
  }

  delete(id: string) {
    return new Promise<any>((resolve, reject) => {
      if (!id) { reject('Missing News Id'); return; }

      const memberId = this.currentMember.id;
      const newsIds = this.currentMember.newsIds.filter(p => p !== id);

      const itemRef = this.db.doc(`${this.dbPath}/${id}`).ref;
      const memberRef = this.db.doc(this.getOwnerPath(memberId)).ref;

      this.db.firestore.runTransaction(trans => {

        return trans.get(itemRef).then((newsSnap) => {
          if (!newsSnap.exists) {
            throw new Error('Owner does not exist!');
          }

          // remove follower
          const news = newsSnap.data() as News;
          news.followerIds.forEach(followerId => {
            const followerRef = this.db.doc(this.getOwnerPath(followerId)).ref;
            trans.update(followerRef, { newsFollowingIds: firestore.FieldValue.arrayRemove(id) });
          });

          trans.update(memberRef, { newsIds });
          trans.delete(itemRef);
        });

      })
        .then(() => {

          // update current session
          this.updateNewsIds(newsIds);

          resolve();
        }, (error) => reject(error))
        .catch((error) => reject(error));

    });
  }

  searchItems(qp: QueryParams) {
    return new Promise<Pagination<NewsView>>(async (resolve, reject) => {

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
                    return { id, isFavorite, ...item } as NewsView;
                  });
              resolve(new Pagination<NewsView>(items, response.nbHits, response.page));
            } else {
              resolve(new Pagination<NewsView>());
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
    const previewCollection = this.db.collection<News>(this.dbPath, q => q
      .where('isPublished', '==', true)
      .orderBy('updatedDate', 'desc')
      .limit(8));
    this.previewItems = previewCollection.get().pipe(map(this.mapItemView));
  }

  public loadItemByOwner(ownerId: string) {
    const ownerCollection = this.db.collection<News>(this.dbPath, q => q
      .where('ownerId', '==', ownerId)
      .where('isPublished', '==', true)
      .orderBy('updatedDate', 'desc'));

    this.ownerItems = ownerCollection.get().pipe(map(this.mapItemView));
  }

  updateFavorite(item: NewsView, flag: boolean) {

    return new Promise<any>((resolve, reject) => {
      if (!item) { reject('Missing News'); return; }

      const newstId = item.id;
      const memberId = this.currentMember.id;
      const newstFollowingIds = this.currentMember.newsFollowingIds.filter(p => p !== newstId);
      const followerIds = item.followerIds.filter(f => f !== memberId);

      const memberRef = this.db.doc(this.getOwnerPath(memberId)).ref;
      const newstRef = this.db.doc(this.getNewsPath(newstId)).ref;

      if (flag) {
        newstFollowingIds.push(newstId);
        followerIds.push(memberId);
      }

      this.db.firestore.runTransaction<boolean>(trans => {
        trans.update(memberRef, { newstFollowingIds });
        trans.update(newstRef, { followerIds });
        return Promise.resolve(true);
      })
        .then(() => {
          // update current session
          this.updateFollowingIds(newstFollowingIds);

          resolve();
        }, (error) => reject(error))
        .catch((error) => reject(error));

    });
  }

  private updateFollowingIds(ids) {
    const member = this.currentMember;
    Object.assign(member, { newsFollowingIds: ids });
    this.memberService.setCurrentMember(member);
  }

  private updateNewsIds(ids) {
    const member = this.currentMember;
    Object.assign(member, { newsIds: ids });
    this.memberService.setCurrentMember(member);
  }

  private initCurrentItems() {
    this.currentItems = this.ownerIdSource.pipe(
      switchMap(id =>
        this.db.collection<News>(this.dbPath,
          ref => ref.where('ownerId', '==', id).orderBy('createdDate', 'asc')
        ).snapshotChanges()
      ),
      map(this.mapItem)
    );
  }

}
