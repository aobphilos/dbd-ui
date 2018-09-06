import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PromotionService } from '../../../../core/promotion.service';
import { BehaviorSubject, of } from 'rxjs';
import { map, combineLatest } from 'rxjs/operators';
import { Promotion } from '../../../../model/promotion';

@Component({
  selector: 'app-promotion-search',
  templateUrl: './promotion-search.component.html',
  styleUrls: ['./promotion-search.component.scss']
})
export class PromotionSearchComponent implements OnInit {

  private keyword = '';
  sortDirection = 'asc';
  currentPage: number;

  private promotions: Promotion[] = [];
  private keywordSource = new BehaviorSubject<string>('');

  constructor(
    private route: ActivatedRoute,
    private promotionService: PromotionService
  ) {
    this.currentPage = 1;
  }

  get promotionItems() {
    return of(this.promotions);
  }

  onSortDirectionChange() {

  }

  onPageChange(event) {
    console.log(event);
  }

  ngOnInit() {
    this.keywordSource.pipe(
      combineLatest(
        this.route.paramMap,
        this.route.queryParamMap
      ),
      map(
        (params) => {
          if (params[1].has('keyword')) {
            return params[1].get('keyword');
          } else if (params[2].has('keyword')) {
            return params[2].get('keyword');
          } else {
            return '';
          }
        }
      )
    ).subscribe((key) => {
      this.keyword = key;
      this.promotionService.searchItems(this.keyword)
        .then(
          result => {
            this.promotions.splice(0, this.promotions.length, ...result);
          },
          err => console.log(err)
        );
    });
  }

}
