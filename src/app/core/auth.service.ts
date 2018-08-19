import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';
import { environment } from '../../environments/environment';
import { IndicatorService } from '../ui/indicator/indicator.service';

@Injectable()
export class AuthService {

  constructor(
    public afAuth: AngularFireAuth,
    private indicatorService: IndicatorService
  ) { }

  private showBusy = () => this.indicatorService.showBusy();
  private hideBusy = () => this.indicatorService.hideBusy();

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
      auth().createUserWithEmailAndPassword(value.email, environment.masterPassword)
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

  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      auth().signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err)
        );
    });
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (auth().currentUser) {
        this.afAuth.auth.signOut();
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
