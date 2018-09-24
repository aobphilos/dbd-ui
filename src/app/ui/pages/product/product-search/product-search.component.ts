import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { map, combineLatest } from 'rxjs/operators';

import { ProductService } from '../../../../core/product.service';
import { ProductView } from '../../../../model/views/product-view';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {

  private keyword = '';
  sortDirection = 'asc';

  currentPage: number;
  totalHits: number;

  private products: ProductView[] = [];
  private keywordSource = new BehaviorSubject<string>('');

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
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

  private goSearchNextPage(pageIndex: number) {
    this.productService.searchItems(this.keyword, pageIndex)
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
