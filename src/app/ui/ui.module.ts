import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
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
import { MemberService } from '../core/member.service';
import { NotifyComponent } from './notify/notify.component';
import { NotifyService } from './notify/notify.service';
import { IndicatorComponent } from './indicator/indicator.component';
import { IndicatorService } from './indicator/indicator.service';
import { RegisterComponent } from './pages/register/register.component';
import { FormatRemoveAtPipe } from '../core/pipe/format-remove-at.pipe';
import { DropZoneDirective } from '../core/directive/drop-zone.directive';
import { MemberInfoComponent } from './pages/member/member-info/member-info.component';
import { MemberRetailComponent } from './pages/member/member-retail/member-retail.component';
import { MemberDealerComponent } from './pages/member/member-dealer/member-dealer.component';
import { MemberWholesaleComponent } from './pages/member/member-wholesale/member-wholesale.component';
import { FileUploadComponent } from './uploaders/file-upload/file-upload.component';
import { FileSizePipe } from '../core/pipe/file-size.pipe';
import { MemberUploadComponent } from './uploaders/member-upload/member-upload.component';

@NgModule({
  imports: [
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFireStorageModule,
    CommonModule,
    UiRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    LayoutComponent, HeaderComponent, FooterComponent, FileNotFoundComponent,
    HomeComponent, RegisterComponent, NotifyComponent, IndicatorComponent,
    MemberInfoComponent, MemberRetailComponent, MemberDealerComponent, MemberWholesaleComponent,
    FormatRemoveAtPipe, DropZoneDirective, FileUploadComponent, FileSizePipe, MemberUploadComponent
  ],
  providers: [
    AuthService, LayoutService, AuthGuard, MemberService, NotifyService, IndicatorService
  ],
  exports: [LayoutComponent]
})
export class UiModule { }
