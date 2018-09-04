import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../core/product.service';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {

  private keyword: string;
  private sortDirection = 'asc';

  currentPage: number;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {

  }

  get productItems() {
    return this.productService.searchItems;
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      filter(r => r.has('keyword')),
      map(r => r.get('keyword'))
    ).subscribe(key => this.keyword = key);
  }

}
