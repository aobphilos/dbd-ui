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
import { RegisterDealerComponent } from './pages/register/register-dealer/register-dealer.component';
import { RegisterMainComponent } from './pages/register/register-main/register-main.component';
import { RegisterRetailComponent } from './pages/register/register-retail/register-retail.component';
import { RegisterWholesaleComponent } from './pages/register/register-wholesale/register-wholesale.component';
import { LayoutService } from './layout/layout.service';
import { AuthGuard } from '../core/auth.guard';
import { UserService } from '../core/user.service';
import { NotifyComponent } from './notify/notify.component';
import { NotifyService } from './notify/notify.service';

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
    HomeComponent, RegisterDealerComponent, RegisterMainComponent,
    RegisterRetailComponent, RegisterWholesaleComponent, NotifyComponent
  ],
  providers: [AuthService, LayoutService, AuthGuard, UserService, NotifyService],
  exports: [LayoutComponent]
})
export class UiModule { }
