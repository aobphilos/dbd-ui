import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { BehaviorSubject } from 'rxjs';
import { MemberService } from './member.service';
import { tap, filter, map } from 'rxjs/operators';
import { SessionType } from '../enum/session-type';
import { BeSubject } from '../model/beSubject';

@Injectable()
export class AuthService {

  private authState: BehaviorSubject<BeSubject<firebase.User>>;
  private signedState: boolean;

  constructor(
    public afAuth: AngularFireAuth,
    private memberService: MemberService
  ) {
    this.authState = new BehaviorSubject<BeSubject<firebase.User>>(new BeSubject(null, true));
    this.afAuth.authState.pipe(
      tap(user => {
        if (user) {
          this.signedState = true;
          this.memberService.loadCurrentMember(user.email);
        } else {
          this.signedState = false;
        }
      })
    ).subscribe(user => this.authState.next(new BeSubject(user)));
  }

  get user() {
    return this.authState.pipe(
      filter(subject => !subject.isInit),
      map(subject => subject.source)
    );
  }

  getUserSignedState() {
    return new Promise<any>((resolve, reject) => {
      if (this.signedState) {
        const user = this.afAuth.auth.currentUser;
        if (user && user.emailVerified) {
          resolve();
        } else {
          reject();
        }
      } else if (sessionStorage.getItem(SessionType.MEMBER)) {
        this.user.subscribe(user => resolve());
      } else {
        reject();
      }
    });
  }

  doFacebookLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new auth.FacebookAuthProvider();
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        }, err => {
          console.log(err);
          reject(err);
        });
    });
  }

  doTwitterLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new auth.TwitterAuthProvider();
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        }, err => {
          console.log(err);
          reject(err);
        });
    });
  }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        }, err => {
          console.log(err);
          reject(err);
        });
    });
  }

  doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(res => {
          if (res) {
            res.user.sendEmailVerification()
              .then(() => resolve())
              .catch(() => reject());
          } else {
            console.log('failed to create user');
            reject();
          }
        }, err => reject(err));
    });
  }

  doVerifyEmail(code: string) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.applyActionCode(code)
        .then(res => {
          const user = this.afAuth.auth.currentUser;
          if (user) {
            user.reload()
              .then(() => {
                this.authState.next(new BeSubject(user));
                resolve(res);
              })
              .catch((err) => reject(err));
          } else {
            reject();
          }
        }
          , err => reject(err));
    });
  }

  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password)
        .then(res => resolve(res), err => reject(err));
    });
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (this.signedState) {
        this.afAuth.auth.signOut();
        sessionStorage.clear();
        resolve();
      } else {
        reject();
      }
    });
  }

  doResetPassword(email: string) {
    return new Promise<any>((resolve, reject) => {
      auth().sendPasswordResetEmail(email)
        .then(res => {
          console.log('sent Password Reset Email!');
          resolve(res);
        }, err => reject(err));
    });
  }

  doUpdatePassword(code: string, newPassword: string) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.confirmPasswordReset(code, newPassword)
        .then(res => resolve(res), err => reject(err));
    });
  }
}
