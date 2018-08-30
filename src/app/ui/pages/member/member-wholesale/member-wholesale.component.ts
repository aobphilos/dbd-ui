import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../../register/register.service';
import { RegisterStep } from '../../../../enum/register-step';
import { AuthService } from '../../../../core/auth.service';
import { MemberService } from '../../../../core/member.service';
import { IndicatorService } from '../../../indicator/indicator.service';

@Component({
  selector: 'app-member-wholesale',
  templateUrl: './member-wholesale.component.html',
  styleUrls: ['./member-wholesale.component.scss']
})
export class MemberWholesaleComponent implements OnInit {

  constructor(private registerService: RegisterService,
    private authService: AuthService,
    private memberService: MemberService,
    private indicatorService: IndicatorService) { }

  ngOnInit() {
  }

}
