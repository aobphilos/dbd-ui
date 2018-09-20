import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { map, combineLatest } from 'rxjs/operators';

import { MemberStoreService } from '../../../../core/member-store.service';
import { MemberStoreView } from '../../../../model/views/member-store-view';

@Component({
  selector: 'app-store-search',
  templateUrl: './store-search.component.html',
  styleUrls: ['./store-search.component.scss']
})
export class StoreSearchComponent implements OnInit {

  private keyword = '';
  sortDirection = 'asc';

  currentPage: number;

  private stores: MemberStoreView[] = [];
  private keywordSource = new BehaviorSubject<string>('');

  constructor(
    private route: ActivatedRoute,
    private memberStoreService: MemberStoreService
  ) {
    this.currentPage = 1;
  }

  get storeItems() {
    return of(this.stores);
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
      this.memberStoreService.searchItems(this.keyword)
        .then(
          result => {
            this.stores.splice(0, this.stores.length, ...result);
          },
          err => console.log(err)
        );
    });
  }
}
