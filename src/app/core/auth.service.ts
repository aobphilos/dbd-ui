import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { MemberService } from './member.service';
import { tap } from 'rxjs/operators';
import { SessionType } from '../enum/session-type';

@Injectable()
export class AuthService {

  private authState: Observable<firebase.User>;
  private signedState: boolean;

  constructor(
    public afAuth: AngularFireAuth,
    private memberService: MemberService
  ) {
    this.authState = this.afAuth.authState.pipe(
      tap(user => {
        if (user) {
          this.signedState = true;
          this.memberService.loadCurrentMember(user.email);
        } else {
          this.signedState = false;
        }
      })
    );
  }

  get user() {
    return this.authState;
  }

  getUserSignedState() {
    return new Promise<any>((resolve, reject) => {
      if (this.signedState) {
        resolve();
      } else if (sessionStorage.getItem(SessionType.MEMBER)) {
        resolve();
      } else {
        const user = this.afAuth.auth.currentUser;
        if (user && user.emailVerified) {
          resolve();
        } else {
          reject();
        }
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
      auth().applyActionCode(code)
        .then(res => resolve(res), err => reject(err));
    });
  }

  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      auth().signInWithEmailAndPassword(value.email, value.password)
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
      auth().confirmPasswordReset(code, newPassword)
        .then(res => resolve(res), err => reject(err));
    });
  }

}
