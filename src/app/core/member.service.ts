import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Member } from '../model/member';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemberType } from '../enum/member-type';
import { firestore } from 'firebase';
import { SessionType } from '../enum/session-type';

@Injectable()
export class MemberService {

  private memberRetailCollection: AngularFirestoreCollection<Member>;
  public memberRetails: Observable<Member[]>;
  private memberRetailDoc: AngularFirestoreDocument<Member>;

  private memberWholesaleCollection: AngularFirestoreCollection<Member>;
  public memberWholesales: Observable<Member[]>;
  private memberWholesaleDoc: AngularFirestoreDocument<Member>;

  private memberDealerCollection: AngularFirestoreCollection<Member>;
  public memberDealers: Observable<Member[]>;
  private memberDealerDoc: AngularFirestoreDocument<Member>;

  CurrentMember: BehaviorSubject<Member>;

  private getDbPath(memberType: MemberType) {
    return `MemberGroup/${memberType}/Member`;
  }

  private get dbPath() {
    return {
      retail: this.getDbPath(MemberType.RETAIL),
      wholesale: this.getDbPath(MemberType.WHOLE_SALE),
      dealer: this.getDbPath(MemberType.DEALER)
    };
  }

  private mapMember = (changes): Member[] => {
    return changes.map(
      a => {
        const data = a.payload.doc.data() as Member;
        data.id = a.payload.doc.id;
        return data;
      });
  }

  private loadMemberFromSession() {
    const member = JSON.parse(sessionStorage.getItem(SessionType.MEMBER)) as Member;
    if (member) {
      this.CurrentMember.next(member);
    }
  }

  private setCurrentMember(member: Member) {
    this.CurrentMember.next(member);
    sessionStorage.setItem(SessionType.MEMBER, JSON.stringify(member));
  }

  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {
    this.memberRetailCollection = this.db.collection<Member>(
      this.dbPath.retail, q => q.orderBy('firstName', 'asc'));

    this.memberWholesaleCollection = this.db.collection<Member>(
      this.dbPath.wholesale, q => q.orderBy('firstName', 'asc'));

    this.memberDealerCollection = this.db.collection<Member>(
      this.dbPath.dealer, q => q.orderBy('firstName', 'asc'));

    this.CurrentMember = new BehaviorSubject<Member>(null);
    this.loadMemberFromSession();
  }

  add(member: Member, memberType: MemberType) {
    return new Promise<any>((resolve, reject) => {

      let deferred: Promise<firestore.DocumentReference>;
      switch (memberType) {
        case MemberType.RETAIL:
          deferred = this.memberRetailCollection.add({ ...member });
          break;
        case MemberType.WHOLE_SALE:
          deferred = this.memberWholesaleCollection.add({ ...member });
          break;
        case MemberType.DEALER:
          deferred = this.memberDealerCollection.add({ ...member });
          break;
      }

      if (deferred) {
        deferred.then(() => resolve(), (err) => reject(err));
      } else {
        reject('Missing Register Type');
      }

    });
  }

  delete(id: string, memberType: MemberType) {
    return new Promise<any>((resolve, reject) => {

      let deferred: Promise<void>;
      switch (memberType) {
        case MemberType.RETAIL:
          deferred = this.db.doc(`${this.dbPath.retail}/${id}`).delete();
          break;
        case MemberType.WHOLE_SALE:
          deferred = this.db.doc(`${this.dbPath.wholesale}/${id}`).delete();
          break;
        case MemberType.DEALER:
          deferred = this.db.doc(`${this.dbPath.dealer}/${id}`).delete();
          break;
      }

      if (deferred) {
        deferred.then(() => resolve(), (err) => reject(err));
      } else {
        reject('Missing Register Type');
      }

    });
  }

  loadCurrentMember(email: string) {
    const retail = this.db.collection<Member>(this.dbPath.retail, q => q.where('email', '==', email).limit(1));
    const wholesale = this.db.collection<Member>(this.dbPath.wholesale, q => q.where('email', '==', email).limit(1));
    const dealer = this.db.collection<Member>(this.dbPath.dealer, q => q.where('email', '==', email).limit(1));

    const retailResult = retail.snapshotChanges().pipe(map(this.mapMember));
    const wholeSaleReult = wholesale.snapshotChanges().pipe(map(this.mapMember));
    const dealerResult = dealer.snapshotChanges().pipe(map(this.mapMember));
    combineLatest(retailResult, wholeSaleReult, dealerResult)
      .pipe(
        map(([a, b, c]) => a.pop() || b.pop() || c.pop())
      ).subscribe(member => this.setCurrentMember(member));

  }

}
