import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../../environments/environment';
import { EllipsisModule } from 'ngx-ellipsis';

import { FileSizePipe } from '../core/pipe/file-size.pipe';
import { FormatRemoveAtPipe } from '../core/pipe/format-remove-at.pipe';
import { AutofocusDirective } from '../core/directive/autofocus.directive';
import { DropZoneDirective } from '../core/directive/drop-zone.directive';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UiRoutingModule } from './ui-routing.module';

import { AuthGuard } from '../core/auth.guard';
import { AuthService } from '../core/auth.service';
import { LayoutService } from './layout/layout.service';
import { MemberService } from '../core/member.service';
import { NotifyService } from './notify/notify.service';
import { IndicatorService } from './indicator/indicator.service';
import { AlgoliaService } from '../core/algolia.service';
import { StoreService } from '../core/store.service';
import { ProductService } from '../core/product.service';
import { PromotionService } from '../core/promotion.service';
import { CategoryService } from '../core/category.service';
import { SearchBarService } from './search-bar/search-bar.service';

import { NotifyComponent } from './notify/notify.component';
import { IndicatorComponent } from './indicator/indicator.component';
import { FileUploadComponent } from './uploaders/file-upload/file-upload.component';
import { RegisterComponent } from './pages/register/register.component';

import { HomeComponent } from './pages/home/home.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { MemberInfoComponent } from './pages/member/member-info/member-info.component';
import { MemberRetailComponent } from './pages/member/member-retail/member-retail.component';
import { MemberDealerComponent } from './pages/member/member-dealer/member-dealer.component';
import { MemberWholesaleComponent } from './pages/member/member-wholesale/member-wholesale.component';
import { MemberUploadComponent } from './uploaders/member-upload/member-upload.component';
import { MemberEditComponent } from './pages/member/member-edit/member-edit.component';
import { FileNotFoundComponent } from './pages/file-not-found/file-not-found.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { EventCarouselComponent } from './pages/events/event-carousel/event-carousel.component';
import { PreviewItemComponent } from './preview/preview-item/preview-item.component';
import { StorePreviewComponent } from './pages/store/store-preview/store-preview.component';
import { StoreSearchComponent } from './pages/store/store-search/store-search.component';
import { ProductPreviewComponent } from './pages/product/product-preview/product-preview.component';
import { ProductSearchComponent } from './pages/product/product-search/product-search.component';
import { PromotionPreviewComponent } from './pages/promotion/promotion-preview/promotion-preview.component';
import { PromotionSearchComponent } from './pages/promotion/promotion-search/promotion-search.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { CategorySelectComponent } from './select/category-select/category-select.component';
import { MemberPreviewComponent } from './pages/member/member-preview/member-preview.component';
import { LibraryIcons } from './ui.icon.module';

@NgModule({
  imports: [
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFireStorageModule,
    CommonModule, UiRoutingModule, FormsModule, ReactiveFormsModule,
    HttpClientModule, NgSelectModule, FontAwesomeModule,
    EllipsisModule
  ],
  declarations: [
    LayoutComponent, HeaderComponent, FooterComponent, FileNotFoundComponent,
    HomeComponent, RegisterComponent, NotifyComponent, IndicatorComponent,
    MemberInfoComponent, MemberRetailComponent, MemberDealerComponent,
    MemberWholesaleComponent, FormatRemoveAtPipe, DropZoneDirective,
    FileUploadComponent, FileSizePipe, MemberUploadComponent, MemberEditComponent,
    WelcomeComponent, EventCarouselComponent, SearchBarComponent, PreviewItemComponent,
    StorePreviewComponent, StoreSearchComponent, ProductSearchComponent,
    ProductPreviewComponent, PromotionPreviewComponent, PromotionSearchComponent,
    AutofocusDirective, FavoriteComponent, CategorySelectComponent, MemberPreviewComponent
  ],
  providers: [
    AuthService, LayoutService, AuthGuard, NotifyService, AlgoliaService,
    MemberService, IndicatorService, StoreService, ProductService, PromotionService,
    CategoryService, SearchBarService
  ],
  exports: [LayoutComponent]
})
export class UiModule {
  constructor() {
    // tslint:disable-next-line:no-unused-expression
    new LibraryIcons();
  }
}
