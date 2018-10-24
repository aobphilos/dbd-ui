import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { of } from 'rxjs';
import { DataService } from 'src/app/core/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private hasVerified: boolean;

  constructor(
    public authService: AuthService,
    private dataService: DataService) { }

  get userVerified() {
    return of(this.hasVerified);
  }

  upload() {
    this.dataService.upload();
  }

  ngOnInit() {
  }

}
