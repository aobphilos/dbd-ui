import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  Routes, RouterModule, Router, NavigationEnd, ActivatedRoute
} from '@angular/router';

import { filter, map } from 'rxjs/operators';
import { AuthGuard } from '../core/auth.guard';
import { RegisterGuard } from '../core/register.guard';
import { HomeComponent } from './pages/home/home.component';
import { LayoutService } from './layout/layout.service';
import { UrlPath } from '../enum/url-path';
import { FileNotFoundComponent } from './pages/file-not-found/file-not-found.component';
import { MemberEditComponent } from './pages/member/member-edit/member-edit.component';
import { RegisterComponent } from './pages/register/register.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';

import { StoreSearchComponent } from './pages/store/store-search/store-search.component';
import { ProductSearchComponent } from './pages/product/product-search/product-search.component';
import { PromotionSearchComponent } from './pages/promotion/promotion-search/promotion-search.component';
import { MemberPreviewComponent } from './pages/member/member-preview/member-preview.component';
import { NewsSearchComponent } from './pages/news/news-search/news-search.component';

const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'index', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard] },
  { path: 'shop/:shopId', component: MemberPreviewComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent, canActivate: [RegisterGuard] },
  { path: 'member', redirectTo: '/member/info', pathMatch: 'full' },
  { path: 'member/info', component: MemberEditComponent, canActivate: [AuthGuard] },
  { path: 'member/shop', component: MemberEditComponent, canActivate: [AuthGuard] },
  { path: 'list/shop/:keyword', component: StoreSearchComponent, canActivate: [AuthGuard] },
  { path: 'list/shop', component: StoreSearchComponent, canActivate: [AuthGuard] },
  { path: 'list/product/:keyword', component: ProductSearchComponent, canActivate: [AuthGuard] },
  { path: 'list/product', component: ProductSearchComponent, canActivate: [AuthGuard] },
  { path: 'list/promotion/:keyword', component: PromotionSearchComponent, canActivate: [AuthGuard] },
  { path: 'list/promotion', component: PromotionSearchComponent, canActivate: [AuthGuard] },
  { path: 'list/news', component: NewsSearchComponent, canActivate: [AuthGuard] },
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
        let path = '';
        if (event && event.snapshot && event.snapshot.routeConfig) {
          path = event.snapshot.routeConfig.path || '';
        }

        // hide google map when 'File not found'
        this.layoutService.toggleMap(path !== UrlPath.FILE_NOT_FOUND);

        // hide main menu when 'Register'
        this.layoutService.toggleMenu(path !== UrlPath.REGISTER);

        // show search bar when on welcome page
        this.layoutService.toggleSearchBar(this.filterSearchBarZone(path));

      });
  }

  private filterSearchBarZone(path: string) {

    const paths = [
      UrlPath.WELCOME,
      UrlPath.SHOP,
      UrlPath.LIST_SHOP,
      UrlPath.LIST_PRODUCT,
      UrlPath.LIST_PROMOTION,
      UrlPath.LIST_NEWS
    ];

    const regPath = `^(${paths.join('|')})`;

    const reg = new RegExp(regPath, 'i');
    return reg.test(path);
  }

}
