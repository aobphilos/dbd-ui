import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MemberService } from '../../../../core/member.service';
import { IndicatorService } from '../../../indicator/indicator.service';
import { BehaviorSubject, of } from 'rxjs';
import { map, combineLatest } from 'rxjs/operators';
import { NotifyService } from '../../../notify/notify.service';
import { Member } from '../../../../model/member';
import { MemberType } from '../../../../enum/member-type';

@Component({
  selector: 'app-member-preview',
  templateUrl: './member-preview.component.html',
  styleUrls: ['./member-preview.component.scss']
})
export class MemberPreviewComponent implements OnInit {

  private shopId = '';
  private keywordSource = new BehaviorSubject<string>('');
  private currentStorePreview: Member;

  get currentStore() {
    return of(this.currentStorePreview);
  }

  get isFoundStore() {
    return (this.currentStorePreview);
  }

  get isWholesale() {
    return this.currentStore.pipe(
      map(
        member => (member && member.memberType === MemberType.WHOLE_SALE)
      )
    );
  }

  get shopTypName() {
    return this.currentStore.pipe(
      map(
        member => {
          let name = '';
          if (member) {
            switch (member.memberType) {
              case MemberType.RETAIL: name = 'ข้อมูลร้านค้าปลีก'; break;
              case MemberType.WHOLE_SALE: name = 'ข้อมูลร้านค้าส่ง ค้าปลีก'; break;
              case MemberType.DEALER: name = 'ข้อมูลผู้ผลิต ผู้จำหน่าย'; break;
            }
          }
          return name;
        })
    );
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private memberService: MemberService,
    private notifyService: NotifyService,
    private indicatorService: IndicatorService
  ) {

  }

  private showBusy = () => this.indicatorService.showBusy();
  private hideBusy = () => this.indicatorService.hideBusy();

  goBack(e: Event) {
    e.preventDefault();
    this.router.navigate(['/welcome']);
  }

  private notFoundStore() {
    this.notifyService.setWarningMessage('Not found store !');
    this.router.navigate(['/welcome']);
  }

  private goMyStore() {
    this.router.navigate(['/member/shop']);
  }

  private bindShopData() {
    this.showBusy();
    this.keywordSource.pipe(
      combineLatest(
        this.route.paramMap,
        this.route.queryParamMap
      ),
      map(
        (params) => {
          if (params[1].has('shopId')) {
            return params[1].get('shopId');
          } else if (params[2].has('shopId')) {
            return params[2].get('shopId');
          } else {
            return '';
          }
        }
      )
    ).subscribe((key) => {
      this.shopId = key;
      if (this.memberService.sessionMember.id === key) {
        this.goMyStore();
      } else {
        this.memberService.getMemberById(this.shopId)
          .then(
            member => {
              this.hideBusy();
              if (member) {
                this.currentStorePreview = member;
              } else {
                this.notFoundStore();
              }
            },
            () => this.notFoundStore()
          )
          .catch(err => {
            console.log(err);
            this.notFoundStore();
          });
      }
    });
  }

  ngOnInit() {
    this.bindShopData();
  }

}
