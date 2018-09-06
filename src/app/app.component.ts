import { Component } from '@angular/core';
import { AuthService } from './core/auth.service';
import { of } from 'rxjs';
import { LayoutService } from './ui/layout/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dbd-ui';

  private hasVerified: boolean;

  constructor(public authService: AuthService,
    private layoutService: LayoutService
  ) {
    this.authService.user.subscribe(user => {
      this.hasVerified = (user && user.emailVerified);
    });
  }

  get userVerified() {
    return of(this.hasVerified);
  }

  hideMainMenu(event) {
    const regClass = event.target.className;
    if (!regClass.match('navbar-toggler')
      && !regClass.match('dropdown')
    ) {
      this.layoutService.collapseMenu(true);
    }
  }
}
