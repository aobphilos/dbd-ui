import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { map, combineLatest } from 'rxjs/operators';

import { ProductService } from '../../../../core/product.service';
import { ProductView } from '../../../../model/views/product-view';
import { QueryParams } from '../../../../model/queryParams';
import { SearchBarService } from '../../../search-bar/search-bar.service';
import { SearchType } from '../../../../enum/search-type';
import { ILocationSelected } from '../../../../model/interfaces/location-selected';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {

  private keyword = '';

  isFavorite = false;
  sortDirection = 'asc';
  categoryName = '';
  priceRange = 'none';
  locationSelected: ILocationSelected;

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

    this.locationSelected = {
      provinceSelected: null,
      districtSelected: null,
      subDistrictSelected: null,
      postalCodeSelected: null
    };
  }

  get productItems() {
    return of(this.products);
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
      10
    );
    qp.categoryName = this.categoryName;
    qp.priceRange = this.priceRange;
    qp.location = this.locationSelected;
    return qp;
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
