import { Component, OnInit } from '@angular/core';
import { RegisterService } from './register.service';
import { Router } from '@angular/router';
import { RegisterStep } from '../../../enum/register-step';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  private currentStep: RegisterStep;

  constructor(private router: Router,
    private registerService: RegisterService
  ) { }

  choosePlan(planId: number) {
    this.registerService.setPlanId(planId);
    this.registerService.setRegisterStep(RegisterStep.EDIT_MEMBER_INFO);
  }

  get showPlan() {
    return this.currentStep === RegisterStep.CHOOSE_PLAN;
  }

  get showInfo() {
    return this.currentStep === RegisterStep.EDIT_MEMBER_INFO;
  }

  get showRetail() {
    return this.currentStep === RegisterStep.EDIT_RETAIL;
  }

  get showWholesale() {
    return this.currentStep === RegisterStep.EDIT_WHOLE_SALE;
  }

  get showDealer() {
    return this.currentStep === RegisterStep.EDIT_DEALER;
  }

  get memberId() {
    return this.registerService.memberId;
  }

  goHome() {
    this.router.navigate(['/welcome']);
  }

  ngOnInit() {
    this.registerService.registerStep.subscribe(step => this.currentStep = step);
  }

}
