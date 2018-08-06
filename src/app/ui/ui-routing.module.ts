import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule } from '@angular/router';

import { FileNotFoundComponent } from './pages/file-not-found/file-not-found.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'index', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', component: FileNotFoundComponent }
];

@NgModule({
  imports: [NgbModule.forRoot(), RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class UiRoutingModule { }
