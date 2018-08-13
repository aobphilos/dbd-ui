import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  Routes, RouterModule, Router, NavigationEnd, ActivatedRoute
} from '@angular/router';

import { filter, map, mergeMap } from 'rxjs/operators';

import { AuthGuard } from '../core/auth.guard';

import { FileNotFoundComponent } from './pages/file-not-found/file-not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterMainComponent } from './pages/register/register-main/register-main.component';
import { LayoutService } from '../core/layout.service';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'index', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterMainComponent, canActivate: [AuthGuard] },
  { path: '**', component: FileNotFoundComponent }
];

@NgModule({
  imports: [NgbModule.forRoot(), RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class UiRoutingModule {
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService) {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      })
    ).subscribe((event) => {
      let cp = '';
      if (event && event['component']) {
        cp = event['component']['name'] || '';
      }
      this.layoutService.toggleMap(!/FileNotFoundComponent/i.test(cp));
    });
  }
}
