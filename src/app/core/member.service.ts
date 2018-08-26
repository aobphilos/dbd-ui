import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Member, MemberType } from '../model/member';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RegisterType } from '../enum/register-type';
import { firestore } from 'firebase';

@Injectable()
export class MemberService {

  private dbPath = {
    retail: 'MemberType/C-RETAIL/Member',
    wholesale: 'MemberType/C-WHOLESALE/Member',
    dealer: 'MemberType/C-DEALER/Member'
  };

  private memberRetailCollection: AngularFirestoreCollection<Member>;
  public memberRetails: Observable<Member[]>;
  private memberRetailDoc: AngularFirestoreDocument<Member>;

  private memberWholesaleCollection: AngularFirestoreCollection<Member>;
  public memberWholesales: Observable<Member[]>;
  private memberWholesaleDoc: AngularFirestoreDocument<Member>;

  private memberDealerCollection: AngularFirestoreCollection<Member>;
  public memberDealers: Observable<Member[]>;
  private memberDealerDoc: AngularFirestoreDocument<Member>;

  private mapMember = (changes) => {
    return changes.map(
      a => {
        const data = a.payload.doc.data() as Member;
        data.id = a.payload.doc.id;
        return data;
      });
  }

  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {

    this.memberRetailCollection = this.db.collection<Member>(this.dbPath.retail, q => q.orderBy('firstName', 'asc'));
    this.memberRetails = this.memberRetailCollection
      .snapshotChanges()
      .pipe(map(this.mapMember));

    this.memberWholesaleCollection = this.db.collection<Member>(this.dbPath.wholesale, q => q.orderBy('firstName', 'asc'));
    this.memberWholesales = this.memberWholesaleCollection
      .snapshotChanges()
      .pipe(map((changes) => {
        return changes.map(
          a => {
            const data = a.payload.doc.data() as Member;
            data.id = a.payload.doc.id;
            return data;
          });
      }));

    this.memberDealerCollection = this.db.collection<Member>(this.dbPath.dealer, q => q.orderBy('firstName', 'asc'));
    this.memberDealers = this.memberDealerCollection
      .snapshotChanges()
      .pipe(map(this.mapMember));
  }

  add(member: Member, registerType: RegisterType) {
    return new Promise<any>((resolve, reject) => {

      let deferred: Promise<firestore.DocumentReference>;
      switch (registerType) {
        case RegisterType.RETAIL:
          deferred = this.memberRetailCollection.add({ ...member });
          break;
        case RegisterType.WHOLE_SALE:
          deferred = this.memberWholesaleCollection.add({ ...member });
          break;
        case RegisterType.DEALER:
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

  delete(member: Member, registerType: RegisterType) {
    return new Promise<any>((resolve, reject) => {

      let deferred: Promise<void>;
      switch (registerType) {
        case RegisterType.RETAIL:
          deferred = this.db.doc(`${this.dbPath.retail}/${member['id']}`).delete();
          break;
        case RegisterType.WHOLE_SALE:
          deferred = this.db.doc(`${this.dbPath.wholesale}/${member['id']}`).delete();
          break;
        case RegisterType.DEALER:
          deferred = this.db.doc(`${this.dbPath.dealer}/${member['id']}`).delete();
          break;
      }

      if (deferred) {
        deferred.then(() => resolve(), (err) => reject(err));
      } else {
        reject('Missing Register Type');
      }

    });
  }
}
