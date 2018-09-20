import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../core/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-preview',
  templateUrl: './product-preview.component.html',
  styleUrls: ['./product-preview.component.scss']
})
export class ProductPreviewComponent implements OnInit {

  constructor(
    private router: Router,
    private productService: ProductService
  ) {
  }

  get productItems() {
    return this.productService.previewItems;
  }

  goSearch() {
    this.router.navigate(['list/product']);
  }

  ngOnInit() { }

}
