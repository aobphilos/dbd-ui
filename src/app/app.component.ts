import { Component } from '@angular/core';
import { AuthService } from './core/auth.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dbd-ui';

  private hasVerified: boolean;

  constructor(public authService: AuthService) {
    this.authService.user.subscribe(user => {
      this.hasVerified = (user && user.emailVerified);
    });
  }

  get userVerified() {
    return of(this.hasVerified);
  }

}
