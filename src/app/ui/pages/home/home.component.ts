import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { MemberService } from '../../../core/member.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private hasVerified: boolean;

  constructor(public authService: AuthService, private memberService: MemberService) { }

  get userVerified() {
    return of(this.hasVerified);
  }

  ngOnInit() { }

}
