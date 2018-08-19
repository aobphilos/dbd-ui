import { Component, OnInit } from '@angular/core';
import { RegisterService } from './register.service';
import { Router } from '@angular/router';
import { RegisterStep } from '../../../enum/register-step';
import { RegisterType } from '../../../enum/register-type';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  private currentStep: RegisterStep;


  constructor(private router: Router, private registerService: RegisterService) {
    this.currentStep = RegisterStep.CHOOSE_PLAN;
  }

  choosePlan(planId: number) {
    this.registerService.setPlanId(planId);
    this.changeStep(RegisterStep.EDIT_USER_INFO);
  }

  showPlan() {
    return this.currentStep === RegisterStep.CHOOSE_PLAN;
  }

  showUserInfo() {
    return this.currentStep === RegisterStep.EDIT_USER_INFO;
  }

  showRetail() {
    return this.currentStep === RegisterStep.EDIT_RETAIL;
  }

  showWholesale() {
    return this.currentStep === RegisterStep.EDIT_WHOLE_SALE;
  }

  showDealer() {
    return this.currentStep === RegisterStep.EDIT_DEALER;
  }

  private changeStep(step: RegisterStep) {
    this.currentStep = step;
  }

  ngOnInit() {
  }

}
