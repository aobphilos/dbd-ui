import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  Routes, RouterModule, Router, NavigationEnd, ActivatedRoute
} from '@angular/router';

import { filter, map } from 'rxjs/operators';

import { AuthGuard } from '../core/auth.guard';
import { RegisterGuard } from '../core/register.guard';

import { FileNotFoundComponent } from './pages/file-not-found/file-not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { LayoutService } from './layout/layout.service';
import { PathType } from '../enum/path-type';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'index', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent, canActivate: [RegisterGuard] },
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
    this.routeFilter();
  }

  private routeFilter() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) { route = route.firstChild; }
          return route;
        })
      )
      .subscribe((event) => {
        let cp = '';
        if (event && event.snapshot && event.snapshot.routeConfig) {
          cp = event.snapshot.routeConfig.path || '';
        }

        // hide google map when 'File not found'
        this.layoutService.toggleMap(cp !== PathType.FILE_NOT_FOUND);

        // hiee main menu when 'Register'
        this.layoutService.toggleMenu(cp !== PathType.REGISTER);
      });
  }

}
