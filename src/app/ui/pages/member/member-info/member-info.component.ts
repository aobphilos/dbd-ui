import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../../register/register.service';
import { RegisterStep } from '../../../../enum/register-step';
import { AuthService } from '../../../../core/auth.service';
import { MemberService } from '../../../../core/member.service';
import { Member } from '../../../../model/member';
import { RegisterType } from '../../../../enum/register-type';

@Component({
  selector: 'app-member-info',
  templateUrl: './member-info.component.html',
  styleUrls: ['./member-info.component.scss']
})
export class MemberInfoComponent implements OnInit {

  model: Member;
  submitted = false;

  constructor(private router: Router,
    private registerService: RegisterService,
    private authService: AuthService,
    private memberService: MemberService) { }

  // convenience getter for easy access to form fields
  get registerForm() { return this.registerService.form; }

  goNext() {
    switch (this.registerForm.planId) {
      case RegisterType.RETAIL:
        this.registerService.setRegisterStep(RegisterStep.EDIT_RETAIL);
        break;
      case RegisterType.WHOLE_SALE:
        this.registerService.setRegisterStep(RegisterStep.EDIT_WHOLE_SALE);
        break;
      case RegisterType.DEALER:
        this.registerService.setRegisterStep(RegisterStep.EDIT_DEALER);
        break;
    }
  }

  goBack(e: Event) {
    e.preventDefault();
    this.registerService.setRegisterStep(RegisterStep.CHOOSE_PLAN);
  }

  private buildModel() {
    this.model = new Member();
    this.model.email = this.registerForm.username;
  }

  async tryUpdateMember() {
    this.submitted = true;
    console.log('model: ', this.model);
    await this.memberService.add(this.model, this.registerForm.planId);
    await this.authService.doVerifyEmail(this.registerForm.code);
    this.goNext();

  }

  ngOnInit() {
    this.buildModel();
  }

}
