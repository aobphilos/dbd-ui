import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { VerifyType } from '../enum/verify-type';
import { RegisterService } from '../ui/pages/register/register.service';
import { RegisterStep } from '../enum/register-step';

@Injectable({
  providedIn: 'root'
})
export class RegisterGuard implements CanActivate {

  constructor(private afAuth: AngularFireAuth, private router: Router, private registerService: RegisterService) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const code = next.queryParamMap.get('oobCode');
    return new Promise<boolean>((resolve, reject) => {
      this.afAuth.auth.checkActionCode(code)
        .then(
          (res) => {
            if (res.operation === VerifyType.VERIFY_EMAIL) {
              this.registerService.setProfile(res.data.email, code);
              resolve(true);
            } else if (res.operation === VerifyType.PASSWORD_RESET) {
              this.registerService.setProfile(res.data.email, code);
              this.registerService.setRegisterStep(RegisterStep.RESET_PASSWORD);
              resolve(true);
            } else {
              this.router.navigate(['/home']);
              resolve(false);
            }
          },
          (err) => {
            this.router.navigate(['/home']);
            resolve(false);
          }
        );
    });
  }
}
