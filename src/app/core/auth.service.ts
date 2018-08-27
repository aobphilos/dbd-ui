import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';
import { IndicatorService } from '../ui/indicator/indicator.service';
import { Observable } from 'rxjs';
import { MemberService } from './member.service';

@Injectable()
export class AuthService {

  private authState: Observable<firebase.User>;
  private currentUser: firebase.User;
  private userVerified: boolean;

  constructor(
    public afAuth: AngularFireAuth,
    private indicatorService: IndicatorService,
    private memberService: MemberService
  ) {
    this.authState = this.afAuth.authState;
    this.authState
      .subscribe(user => {
        this.currentUser = user;
        this.userVerified = (user && user.emailVerified);
        if (this.userVerified) {
          this.memberService.loadCurrentMember(user.email);
        }
      });
  }

  private showBusy = () => this.indicatorService.showBusy();
  private hideBusy = () => this.indicatorService.hideBusy();

  get user() {
    return this.currentUser || {} as firebase.User;
  }

  get hasVerified() {
    return this.userVerified;
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
      this.showBusy();
      auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(res => {
          if (res) {
            res.user.sendEmailVerification()
              .then(() => {
                this.hideBusy();
                resolve();
              })
              .catch(() => {
                this.hideBusy();
                reject();
              });
          } else {
            console.log('failed to create user');
            this.hideBusy();
            reject();
          }
        }, err => {
          this.hideBusy();
          reject(err);
        });
    });
  }

  doVerifyEmail(code: string) {
    return new Promise<any>((resolve, reject) => {
      auth().applyActionCode(code)
        .then(
          res => resolve(res),
          err => reject(err)
        );
    });
  }

  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      this.showBusy();
      auth().signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => {
            this.hideBusy();
            resolve(res);
          },
          err => {
            this.hideBusy();
            reject(err);
          }
        );
    });
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (this.hasVerified) {
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

}
