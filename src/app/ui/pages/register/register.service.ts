import { Injectable } from '@angular/core';
import { RegisterForm } from '../../../model/register-form';
import { SessionType } from '../../../enum/session-type';
import { RegisterType } from '../../../enum/register-type';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private regisForm: RegisterForm;

  constructor() {
    const form: RegisterForm = JSON.parse(sessionStorage.getItem(SessionType.REGISTER));
    this.regisForm = form || new RegisterForm('');
  }

  setPlanId(id: number) {
    switch (id) {
      case 1: this.regisForm.planId = RegisterType.RETAIL; break;
      case 2: this.regisForm.planId = RegisterType.WHOLE_SALE; break;
      case 3: this.regisForm.planId = RegisterType.DEALER; break;
    }
    this.updateStorage();
  }

  setProfile(username: string, code: string) {
    this.regisForm.username = username;
    this.regisForm.code = code;
    this.updateStorage();
  }

  private updateStorage() {
    sessionStorage.setItem(SessionType.REGISTER, JSON.stringify(this.regisForm));
  }

}
