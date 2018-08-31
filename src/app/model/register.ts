import { MemberType } from '../enum/member-type';

export class Register {
  code: string;
  username: string;
  password: string;
  planId: MemberType;
  memberId: string;

  constructor(code: string) {
    this.code = code;
    this.username = '';
    this.password = '';
    this.planId = MemberType.RETAIL;
    this.memberId = '';
  }
}
