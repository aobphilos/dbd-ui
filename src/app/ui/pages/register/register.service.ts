import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SessionType } from '../../../enum/session-type';
import { Register } from '../../../model/register';
import { MemberType } from '../../../enum/member-type';
import { RegisterStep } from '../../../enum/register-step';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private registerForm: Register;
  private registerStepSource = new BehaviorSubject<RegisterStep>(RegisterStep.CHOOSE_PLAN);

  constructor() {
    const form = JSON.parse(sessionStorage.getItem(SessionType.REGISTER)) as Register;
    this.registerForm = form || new Register('');
  }

  get registerStep() {
    return this.registerStepSource.asObservable();
  }

  get form() {
    return this.registerForm;
  }

  setPlanId(id: number) {
    switch (id) {
      case 1: this.registerForm.planId = MemberType.RETAIL; break;
      case 2: this.registerForm.planId = MemberType.WHOLE_SALE; break;
      case 3: this.registerForm.planId = MemberType.DEALER; break;
    }
    this.updateStorage();
  }

  setProfile(username: string, code: string) {
    this.registerForm.username = username;
    this.registerForm.code = code;
    this.updateStorage();
  }

  setMemberId(memberId: string) {
    this.registerForm.memberId = memberId;
    this.updateStorage();
  }

  private updateStorage() {
    sessionStorage.setItem(SessionType.REGISTER, JSON.stringify(this.registerForm));
  }

  setRegisterStep(step: RegisterStep) {
    this.registerStepSource.next(step);
  }

}
