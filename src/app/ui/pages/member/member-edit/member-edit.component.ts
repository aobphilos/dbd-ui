import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../../../core/member.service';
import { IndicatorService } from '../../../indicator/indicator.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {

  private mode = 'info';

  constructor(private activatedRoute: ActivatedRoute,
    private memberService: MemberService,
    private indicatorService: IndicatorService) { }

  get showInfo() {
    return this.mode === 'info';
  }

  get showRetail() {
    return this.mode === 'shop';
  }

  get showWholesale() {
    return this.mode === 'shop';
  }

  get showDealer() {
    return this.mode === 'shop';
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe(url => this.mode = (url && url.length === 2) ? url[1].path : 'info');
  }

}
