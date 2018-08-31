import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Member } from '../model/member';
import { BehaviorSubject } from 'rxjs';
import { SessionType } from '../enum/session-type';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private memberCollection: AngularFirestoreCollection<Member>;
  model: BehaviorSubject<Member>;

  get currentMember() {
    return this.model.asObservable();
  }

  private get dbPath() {
    return 'Member';
  }

  constructor(
    private db: AngularFirestore
  ) {
    this.memberCollection = this.db.collection<Member>(this.dbPath, q => q.orderBy('storeName', 'asc'));
    this.model = new BehaviorSubject<Member>(null);
    this.loadMemberFromSession();
  }

  add(member: Member) {
    return new Promise<any>((resolve, reject) => {
      if (!member) { reject('Missing Member Data'); return; }

      this.memberCollection.add({ ...member })
        .then((m) => resolve(m.id), (err) => reject(err));
    });
  }

  update(member: Member) {
    return new Promise<any>(async (resolve, reject) => {
      if (!member) { reject('Missing Member Data'); return; }

      // found then update
      const memberRef = this.db.doc(`${this.dbPath}/${member.id}`).ref;
      const oriMember = await memberRef.get();
      if (oriMember.exists) {
        delete member.id;
        memberRef.update({ ...member })
          .then(() => resolve(), (err) => reject(err));
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

  private loadMemberFromSession() {
    const member = JSON.parse(sessionStorage.getItem(SessionType.MEMBER)) as Member;
    if (member) {
      this.model.next(member);
    }
  }

  private setCurrentMember(member: Member) {
    this.model.next(member);
    sessionStorage.setItem(SessionType.MEMBER, JSON.stringify(member));
  }

  async loadCurrentMember(email: string) {

    const members = await this.memberCollection.ref.where('email', '==', email).get();

    if (!members.empty) {
      const member = members.docs.pop();
      this.setCurrentMember({ id: member.id, ...member.data() as Member } as Member);
    }

  }

}
