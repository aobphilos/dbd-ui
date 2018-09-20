import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Member } from '../model/member';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SessionType } from '../enum/session-type';
import { BeSubject } from '../model/beSubject';
import { filter, map } from 'rxjs/operators';
import { firestore } from 'firebase/app';
import { Store } from '../model/store';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private memberCollection: AngularFirestoreCollection<Member>;
  private memberSubject: BehaviorSubject<BeSubject<Member>>;
  private memberObserve: Observable<Member>;

  private get dbPath() {
    return 'Member';
  }

  get sessionMember() {
    return JSON.parse(sessionStorage.getItem(SessionType.MEMBER)) as Member;
  }

  get currentMember() {
    const member = this.sessionMember;
    return (member) ? of(member) : this.memberObserve;
  }

  constructor(
    private db: AngularFirestore,
  ) {
    this.memberCollection = this.db.collection<Member>(this.dbPath, q => q.orderBy('storeName', 'asc'));
    this.memberSubject = new BehaviorSubject<BeSubject<Member>>(new BeSubject(null, true));
    this.memberObserve = this.memberSubject.pipe(
      filter(subject => !subject.isInit),
      map(subject => {
        return { ...subject.source } as Member;
      })
    );
    this.loadMemberFromSession();
  }

  add(member: Member) {
    return new Promise<any>((resolve, reject) => {
      if (!member) { reject('Missing Member Data'); return; }

      this.memberCollection.add({ ...member })
        .then((m) => {
          const updatedMember = { id: m.id, ...member } as Member;
          this.addStoreByMember(updatedMember)
            .then(() => {
              this.setCurrentMember(updatedMember);
              resolve(m.id);
            }, (err) => reject(err));
        }, (err) => reject(err));
    });
  }

  update(member: Member) {
    return new Promise<any>(async (resolve, reject) => {
      if (!member) { reject('Missing Member Data'); return; }

      // found then update
      const memberRef = this.db.doc(`${this.dbPath}/${member.id}`).ref;
      const oriMember = await memberRef.get();
      if (oriMember.exists) {
        const id = member.id;
        delete member.id;

        member.updatedDate = firestore.Timestamp.now();
        memberRef.update({ ...member })
          .then(() => {
            const updatedMember = { id: id, ...member } as Member;
            this.updateStoreByMember(updatedMember)
              .then(() => {
                this.setCurrentMember(updatedMember);
                resolve();
              }, (err) => reject(err));
          }, (err) => reject(err));
      } else {
        reject('This member is not registered');
      }
    });
  }

  delete(id: string) {
    return new Promise<any>((resolve, reject) => {
      if (!id) { reject('Missing Member Id'); return; }
      this.db.doc(`${this.dbPath}/${id}`).delete()
        .then(() => resolve(), (err) => reject(err));
    });
  }

  checkIsFavorite(followerIds: string[]) {
    if (followerIds && followerIds.length > 0) {
      const member = this.sessionMember;
      return (member) ? followerIds.some(id => member.id === id) : false;
    } else {
      return false;
    }
  }

  setCurrentMember(member: Member) {
    this.memberSubject.next(new BeSubject(member));
    sessionStorage.setItem(SessionType.MEMBER, JSON.stringify(member));
  }

  async loadCurrentMember(email: string) {
    const members = await this.memberCollection.ref.where('email', '==', email).get();
    if (!members.empty) {
      const member = members.docs.pop();
      this.setCurrentMember({ id: member.id, ...member.data() } as Member);
    }
  }

  private addStoreByMember(member: Member) {
    return new Promise<any>((resolve, reject) => {
      if (!member) { reject('Missing Member Data'); return; }

      const storeRef = this.db.doc(`${this.dbPath}/${member.id}`).ref;

      const store = this.getUpdateValueByMember(member);
      storeRef.set({ ...store })
        .then(() => resolve(), (err) => reject(err));
    });
  }

  private updateStoreByMember(member: Member) {
    return new Promise<any>(async (resolve, reject) => {
      if (!member) { reject('Missing Member Data'); return; }

      const storeRef = this.db.doc(`${this.dbPath}/${member.id}`).ref;
      const storeUpdate = this.getUpdateValueByMember(member, true);
      storeRef.get().then((storeDb) => {
        if (storeDb.exists) {
          storeRef.update({ ...storeUpdate })
            .then(() => resolve(), (err) => reject(err));
        } else {
          resolve();
        }
      }, (err) => reject(err));

    });
  }

  private loadMemberFromSession() {
    const member = this.sessionMember;
    if (member) {
      this.memberSubject.next(new BeSubject(member));
    }
  }

  private getUpdateValueByMember(member: Member, isUpdate: boolean = false) {
    if (isUpdate) {
      return {
        storeName: member.storeName,
        storeDescription: member.storeDescription,
        updatedDate: member.updatedDate
      };
    } else {
      const store = new Store();
      store.ownerId = member.id;
      store.storeName = member.storeName;
      store.storeDescription = member.storeDescription;
      store.isPublished = true;
      return store;
    }
  }

}
