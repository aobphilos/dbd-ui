import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { map, combineLatest } from 'rxjs/operators';

import { MemberStoreService } from '../../../../core/member-store.service';
import { MemberStoreView } from '../../../../model/views/member-store-view';
import { QueryParams } from '../../../../model/queryParams';
import { SearchBarService } from '../../../search-bar/search-bar.service';
import { SearchType } from '../../../../enum/search-type';
import { ILocationSelected } from '../../../../model/interfaces/location-selected';
import { MemberType } from '../../../../enum/member-type';

@Component({
  selector: 'app-store-search',
  templateUrl: './store-search.component.html',
  styleUrls: ['./store-search.component.scss']
})
export class StoreSearchComponent implements OnInit {

  private keyword = '';

  isFavorite = false;
  sortDirection = 'asc';
  memberType = MemberType.NONE;
  locationSelected: ILocationSelected;

  currentPage: number;
  totalHits: number;

  private stores: MemberStoreView[] = [];
  private keywordSource = new BehaviorSubject<string>('');

  constructor(
    private route: ActivatedRoute,
    private memberStoreService: MemberStoreService,
    private serchBarService: SearchBarService
  ) {
    this.currentPage = 1;
    this.totalHits = 0;

    this.locationSelected = {
      provinceSelected: null,
      districtSelected: null,
      subDistrictSelected: null,
      postalCodeSelected: null
    };
  }

  get storeItems() {
    return of(this.stores);
  }

  onPageChange() {
    this.goSearchNextPage(this.currentPage - 1);
  }

  doSearch() {
    this.goSearchNextPage(0);
  }

  private getQueryParams(pageIndex: number) {
    const qp = new QueryParams(
      this.keyword,
      this.isFavorite,
      pageIndex,
      9
    );
    qp.memberType = this.memberType;
    qp.location = this.locationSelected;
    return qp;
  }

  private goSearchNextPage(pageIndex: number) {

    this.memberStoreService.searchItems(this.getQueryParams(pageIndex))
      .then(
        result => {
          this.currentPage = result.currentPageIndex + 1;
          this.totalHits = result.totalHits;
          this.stores.splice(0, this.stores.length, ...result.hits);
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
      this.serchBarService.setCriteria(SearchType.SHOP, this.keyword, this.isFavorite);
      this.goSearchNextPage(0);
    });
  }

  ngOnInit() {
    this.initSearchItems();
  }
}
