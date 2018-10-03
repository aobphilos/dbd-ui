import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService } from '../../../../core/member.service';
import { MemberType } from '../../../../enum/member-type';
import { IndicatorService } from '../../../indicator/indicator.service';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {

  private mode = 'info';
  private memberIdSource: Observable<string>;
  private showRetailSource: Observable<boolean>;
  private showWholesaleSource: Observable<boolean>;
  private showDealerSource: Observable<boolean>;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private memberService: MemberService,
    private indicatorService: IndicatorService
  ) {
  }

  private showBusy = () => this.indicatorService.showBusy();
  private hideBusy = () => this.indicatorService.hideBusy();

  get showInfo() {
    return this.mode === 'info';
  }

  get isShop() {
    return this.mode === 'shop';
  }

  get showRetail() {
    return this.showRetailSource;
  }

  get showWholesale() {
    return this.showWholesaleSource;
  }

  get showDealer() {
    return this.showDealerSource;
  }

  get memberId() {
    return this.memberIdSource;
  }

  ngOnInit() {
    this.showBusy();
    this.activatedRoute.url.subscribe(url => this.mode = (url && url.length === 2) ? url[1].path : 'info');
    this.memberService.currentMember.subscribe(member => {
      if (member) {
        this.memberIdSource = of(member.id);
        this.showRetailSource = of(this.isShop && member.memberType === MemberType.RETAIL);
        this.showWholesaleSource = of(this.isShop && member.memberType === MemberType.WHOLE_SALE);
        this.showDealerSource = of(this.isShop && member.memberType === MemberType.DEALER);
        this.hideBusy();
      }
    });
  }

}
