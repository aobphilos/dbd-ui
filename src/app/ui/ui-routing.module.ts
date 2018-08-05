import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule } from '@angular/router';

import { FileNotFoundComponent } from './pages/file-not-found/file-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/medical-chain', pathMatch: 'full' },
  { path: '**', component: FileNotFoundComponent }
];

@NgModule({
  imports: [NgbModule.forRoot(), RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class UiRoutingModule { }
