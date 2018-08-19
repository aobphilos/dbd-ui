import { RegisterType } from '../enum/register-type';

export class RegisterForm {
  code: string;
  username: string;
  password: string;
  planId: RegisterType;

  constructor(code: string) {
    this.code = code;
    this.username = '';
    this.password = '';
    this.planId = RegisterType.RETAIL;
  }
}
