import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../../../core/member.service';
import { Member } from '../../../../model/member';
import { MemberType } from '../../../../enum/member-type';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {

  private mode = 'info';
  private member: Member;

  constructor(private activatedRoute: ActivatedRoute,
    private memberService: MemberService) { }

  get showInfo() {
    return this.mode === 'info';
  }

  get showRetail() {
    return this.mode === 'shop' && this.memberType === MemberType.RETAIL;
  }

  get showWholesale() {
    return this.mode === 'shop' && this.memberType === MemberType.WHOLE_SALE;
  }

  get showDealer() {
    return this.mode === 'shop' && this.memberType === MemberType.DEALER;
  }

  get memberType() {
    return this.member.memberType;
  }

  get memberId() {
    return this.member.id;
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe(url => this.mode = (url && url.length === 2) ? url[1].path : 'info');
    this.memberService.currentMember.subscribe(member => this.member = member);
  }

}
