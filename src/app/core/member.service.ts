import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Member } from '../model/member';
import { BehaviorSubject } from 'rxjs';
import { SessionType } from '../enum/session-type';
import { BeSubject } from '../model/beSubject';
import { filter, map } from 'rxjs/operators';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private memberCollection: AngularFirestoreCollection<Member>;
  private model: BehaviorSubject<BeSubject<Member>>;

  get sessionMember() {
    return JSON.parse(sessionStorage.getItem(SessionType.MEMBER)) as Member;
  }

  get currentMember() {
    return this.model.asObservable().pipe(
      filter(subject => !subject.isInit),
      map(subject => {
        return { ...subject.source } as Member;
      })
    );
  }

  private get dbPath() {
    return 'Member';
  }

  constructor(
    private db: AngularFirestore
  ) {
    this.memberCollection = this.db.collection<Member>(this.dbPath, q => q.orderBy('storeName', 'asc'));
    this.model = new BehaviorSubject<BeSubject<Member>>(new BeSubject(null, true));
    this.loadMemberFromSession();
  }

  add(member: Member) {
    return new Promise<any>((resolve, reject) => {
      if (!member) { reject('Missing Member Data'); return; }

      this.memberCollection.add({ ...member })
        .then((m) => {
          this.setCurrentMember({ id: m.id, ...member } as Member);
          resolve(m.id);
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
            this.setCurrentMember({ id: id, ...member } as Member);
            resolve();
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

  private loadMemberFromSession() {
    const member = this.sessionMember;
    if (member) {
      this.model.next(new BeSubject(member));
    }
  }

  private setCurrentMember(member: Member) {
    this.model.next(new BeSubject(member));
    sessionStorage.setItem(SessionType.MEMBER, JSON.stringify(member));
  }

  async loadCurrentMember(email: string) {

    const members = await this.memberCollection.ref.where('email', '==', email).get();

    if (!members.empty) {
      const member = members.docs.pop();
      this.setCurrentMember({ id: member.id, ...member.data() } as Member);
    }

  }

}
