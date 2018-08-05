import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { FooterComponent } from './footer/footer.component';
import { FileNotFoundComponent } from './pages/file-not-found/file-not-found.component';
import { UiRoutingModule } from './ui-routing.module';

@NgModule({
  imports: [
    NgbModule.forRoot(),
    CommonModule,
    UiRoutingModule,
    FormsModule
  ],
  declarations: [
    LayoutComponent, HeaderComponent, FooterComponent, FileNotFoundComponent
  ],
  exports: [LayoutComponent]
})
export class UiModule { }
