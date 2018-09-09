import { Component, OnInit } from '@angular/core';
import { RegisterService } from './register.service';
import { Router } from '@angular/router';
import { RegisterStep } from '../../../enum/register-step';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth.service';
import { IndicatorService } from '../../indicator/indicator.service';
import { NotifyService } from '../../notify/notify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  resetPasswordForm: FormGroup;
  private currentStep: RegisterStep;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
    private authService: AuthService,
    private notifyService: NotifyService,
    private indicatorService: IndicatorService
  ) {
    this.createForm();
  }

  private showBusy = () => this.indicatorService.showBusy();
  private hideBusy = () => this.indicatorService.hideBusy();

  choosePlan(planId: number) {
    this.registerService.setPlanId(planId);
    this.registerService.setRegisterStep(RegisterStep.EDIT_MEMBER_INFO);
  }

  get registerForm() { return this.registerService.form; }

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

  get showReset() {
    return this.currentStep === RegisterStep.RESET_PASSWORD;
  }

  get memberId() {
    return this.registerService.memberId;
  }

  createForm() {
    this.resetPasswordForm = this.fb.group({
      password: ['', Validators.required]
    });
  }

  tryResetPassword(value) {
    this.showBusy();
    this.authService.doUpdatePassword(this.registerForm.code, value.password)
      .then(res => {
        this.hideBusy();
        this.notifyService.setSuccessMessage('New password has been apply');
        this.router.navigate(['/welcome']);
      }, err => {
        this.hideBusy();
        this.notifyService.setWarningMessage(err.message);
      });
  }

  onKeyDownResetPassword(event) {
    if (event.keyCode === 13) {
      this.tryResetPassword(this.resetPasswordForm.value);
    }
  }

  goHome() {
    this.router.navigate(['/welcome']);
  }

  ngOnInit() {
    this.registerService.registerStep.subscribe(step => this.currentStep = step);
  }

}
