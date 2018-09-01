import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.authService.user) {
        return resolve(true);
      } else {
        this.router.navigate(['/home']);
        return resolve(false);
      }
    });
  }
}
