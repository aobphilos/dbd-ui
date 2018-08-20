import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';
import { UserInfo } from '../model/user-info';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {

  private userCollection: AngularFirestoreCollection<UserInfo>;
  private users: Observable<UserInfo[]>;
  private userDoc: AngularFirestoreDocument<UserInfo>;

  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {
    this.userCollection = this.db.collection<UserInfo>('user-info', q => q.orderBy('firstName', 'asc'));
    this.users = this.userCollection.snapshotChanges().pipe(
      map(
        changes => {
          return changes.map(
            a => {
              const data = a.payload.doc.data() as UserInfo;
              data.id = a.payload.doc.id;
              return data;
            });
        }));
  }

  getUsers() {
    return this.users;
  }

  add(user: UserInfo) {
    return new Promise<any>((resolve, reject) => {
      this.userCollection.add(user)
        .then(() => resolve(), (err) => reject(err));
    });
  }

  delete(user: UserInfo) {
    return new Promise<any>((resolve, reject) => {
      const userDoc = this.db.doc(`user-info/${user.id}`);
      userDoc.delete().then(() => resolve(), (err) => reject(err));
    });
  }
}
