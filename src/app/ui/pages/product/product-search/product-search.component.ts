import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { map, combineLatest } from 'rxjs/operators';

import { ProductService } from '../../../../core/product.service';
import { ProductView } from '../../../../model/views/product-view';
import { QueryParams } from '../../../../model/queryParams';
import { SearchBarService } from '../../../search-bar/search-bar.service';
import { SearchType } from '../../../../enum/search-type';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {

  private keyword = '';

  isFavorite = false;
  sortDirection = 'asc';
  priceRange = 'none';

  currentPage: number;
  totalHits: number;

  private products: ProductView[] = [];
  private keywordSource = new BehaviorSubject<string>('');

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private serchBarService: SearchBarService
  ) {
    this.currentPage = 1;
    this.totalHits = 0;
  }

  get productItems() {
    return of(this.products);
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
      pageIndex,
      10,
      this.priceRange
    );
  }

  private goSearchNextPage(pageIndex: number) {

    this.productService.searchItems(this.getQueryParams(pageIndex))
      .then(
        result => {
          this.currentPage = result.currentPageIndex + 1;
          this.totalHits = result.totalHits;
          this.products.splice(0, this.products.length, ...result.hits);
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
      this.serchBarService.setCriteria(SearchType.PRODUCT, this.keyword, this.isFavorite);
      this.goSearchNextPage(0);
    });
  }

  ngOnInit() {
    this.initSearchItems();
  }

}
