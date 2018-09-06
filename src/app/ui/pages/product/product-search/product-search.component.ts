import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../core/product.service';
import { BehaviorSubject, of } from 'rxjs';
import { map, combineLatest } from 'rxjs/operators';
import { Product } from '../../../../model/product';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {

  private keyword = '';
  sortDirection = 'asc';

  currentPage: number;

  private products: Product[] = [];
  private keywordSource = new BehaviorSubject<string>('');

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {
    this.currentPage = 1;
  }

  get productItems() {
    return of(this.products);
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
      this.productService.searchItems(this.keyword)
        .then(
          result => {
            this.products.splice(0, this.products.length, ...result);
          },
          err => console.log(err)
        );
    });
  }

}
