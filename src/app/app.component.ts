import { Component } from '@angular/core';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dbd-ui';

  constructor(public authService: AuthService) {
  }

  get userVerified() {
    return this.authService.hasVerified;
  }

}
