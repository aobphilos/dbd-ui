import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../../environments/environment';

import { UiRoutingModule } from './ui-routing.module';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { FooterComponent } from './footer/footer.component';
import { FileNotFoundComponent } from './pages/file-not-found/file-not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthService } from '../core/auth.service';
import { LayoutService } from './layout/layout.service';
import { AuthGuard } from '../core/auth.guard';
import { UserService } from '../core/user.service';
import { NotifyComponent } from './notify/notify.component';
import { NotifyService } from './notify/notify.service';
import { IndicatorComponent } from './indicator/indicator.component';
import { IndicatorService } from './indicator/indicator.service';
import { UserInfoComponent } from './pages/user/user-info/user-info.component';
import { UserWholesaleComponent } from './pages/user/user-wholesale/user-wholesale.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserRetailComponent } from './pages/user/user-retail/user-retail.component';
import { UserDealerComponent } from './pages/user/user-dealer/user-dealer.component';

@NgModule({
  imports: [
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    CommonModule,
    UiRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    LayoutComponent, HeaderComponent, FooterComponent, FileNotFoundComponent,
    HomeComponent, RegisterComponent, NotifyComponent, IndicatorComponent,
    UserInfoComponent, UserWholesaleComponent, UserRetailComponent, UserDealerComponent
  ],
  providers: [
    AuthService, LayoutService, AuthGuard, UserService, NotifyService, IndicatorService
  ],
  exports: [LayoutComponent]
})
export class UiModule { }
