import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SessionType } from '../../../enum/session-type';
import { RegisterForm } from '../../../model/register-form';
import { RegisterType } from '../../../enum/register-type';
import { RegisterStep } from '../../../enum/register-step';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private registerForm: RegisterForm;
  private registerStepSource = new BehaviorSubject<RegisterStep>(RegisterStep.CHOOSE_PLAN);

  constructor() {
    const form: RegisterForm = JSON.parse(sessionStorage.getItem(SessionType.REGISTER));
    this.registerForm = form || new RegisterForm('');
  }

  get registerStep() {
    return this.registerStepSource.asObservable();
  }

  get form() {
    return this.registerForm;
  }

  setPlanId(id: number) {
    switch (id) {
      case 1: this.registerForm.planId = RegisterType.RETAIL; break;
      case 2: this.registerForm.planId = RegisterType.WHOLE_SALE; break;
      case 3: this.registerForm.planId = RegisterType.DEALER; break;
    }
    this.updateStorage();
  }

  setProfile(username: string, code: string) {
    this.registerForm.username = username;
    this.registerForm.code = code;
    this.updateStorage();
  }

  private updateStorage() {
    sessionStorage.setItem(SessionType.REGISTER, JSON.stringify(this.registerForm));
  }

  setRegisterStep(step: RegisterStep) {
    this.registerStepSource.next(step);
  }

}
