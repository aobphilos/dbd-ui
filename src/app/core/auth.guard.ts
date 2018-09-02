import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { MemberService } from './member.service';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private memberService: MemberService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      const pass = this.authService.getUserSignedState()
        .then(
          () => resolve(true),
          () => {
            this.router.navigate(['/home']);
            resolve(false);
          })
        .catch(() => {
          this.router.navigate(['/home']);
          resolve(false);
        });
    });
  }

}
