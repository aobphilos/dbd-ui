import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../core/product.service';

@Component({
  selector: 'app-product-preview',
  templateUrl: './product-preview.component.html',
  styleUrls: ['./product-preview.component.scss']
})
export class ProductPreviewComponent implements OnInit {

  constructor(private productService: ProductService) { }

  get productItems() {
    return this.productService.latestItems;
  }

  ngOnInit() {
  }

}
