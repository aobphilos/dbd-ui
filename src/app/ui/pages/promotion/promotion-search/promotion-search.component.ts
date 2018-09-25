import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { combineLatest, map } from 'rxjs/operators';
import { PromotionService } from '../../../../core/promotion.service';
import { QueryParams } from '../../../../model/queryParams';
import { PromotionView } from '../../../../model/views/promotion-view';
import { SearchBarService } from '../../../search-bar/search-bar.service';
import { SearchType } from '../../../../enum/search-type';


@Component({
  selector: 'app-promotion-search',
  templateUrl: './promotion-search.component.html',
  styleUrls: ['./promotion-search.component.scss']
})
export class PromotionSearchComponent implements OnInit {

  private keyword = '';

  isFavorite = false;
  sortDirection = 'asc';

  currentPage: number;
  totalHits: number;

  private promotions: PromotionView[] = [];
  private keywordSource = new BehaviorSubject<string>('');

  constructor(
    private route: ActivatedRoute,
    private promotionService: PromotionService,
    private serchBarService: SearchBarService
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

  doSearch() {
    this.goSearchNextPage(0);
  }

  private getQueryParams(pageIndex: number) {
    return new QueryParams(
      this.keyword,
      this.isFavorite,
      pageIndex
    );
  }

  private goSearchNextPage(pageIndex: number) {
    this.promotionService.searchItems(this.getQueryParams(pageIndex))
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
            return { keyword: params[1].get('keyword'), isFavorite: (params[1].get('isFavorite') === 'true') };
          } else if (params[2].has('keyword')) {
            return { keyword: params[2].get('keyword'), isFavorite: (params[2].get('isFavorite') === 'true') };
          } else {
            return {};
          }
        }
      )
    ).subscribe((params) => {
      this.keyword = params.keyword;
      this.isFavorite = params.isFavorite;
      this.serchBarService.setCriteria(SearchType.PROMOTION, this.keyword, this.isFavorite);
      this.goSearchNextPage(0);
    });
  }

  ngOnInit() {
    this.initSearchItems();
  }

}
