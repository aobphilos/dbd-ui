import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { map, combineLatest } from 'rxjs/operators';

import { PromotionService } from '../../../../core/promotion.service';
import { PromotionView } from '../../../../model/views/promotion-view';

@Component({
  selector: 'app-promotion-search',
  templateUrl: './promotion-search.component.html',
  styleUrls: ['./promotion-search.component.scss']
})
export class PromotionSearchComponent implements OnInit {

  private keyword = '';
  sortDirection = 'asc';

  currentPage: number;
  totalHits: number;

  private promotions: PromotionView[] = [];
  private keywordSource = new BehaviorSubject<string>('');

  constructor(
    private route: ActivatedRoute,
    private promotionService: PromotionService
  ) {
    this.currentPage = 1;
    this.totalHits = 0;
  }

  get promotionItems() {
    return of(this.promotions);
  }

  onSortDirectionChange() {

  }

  onPageChange() {
    this.goSearchNextPage(this.currentPage - 1);
  }

  private goSearchNextPage(pageIndex: number) {
    this.promotionService.searchItems(this.keyword, pageIndex)
      .then(
        result => {
          this.currentPage = result.currentPageIndex + 1;
          this.totalHits = result.totalHits;
          this.promotions.splice(0, this.promotions.length, ...result.hits);
        },
        err => console.log(err)
      );
  }

  private initSearchItems() {
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
      this.goSearchNextPage(0);
    });
  }
  ngOnInit() {
    this.initSearchItems();
  }

}
