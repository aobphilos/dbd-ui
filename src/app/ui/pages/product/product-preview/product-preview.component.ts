import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from '../../../../core/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-preview',
  templateUrl: './product-preview.component.html',
  styleUrls: ['./product-preview.component.scss']
})
export class ProductPreviewComponent implements OnInit {

  @Input() ownerId: string;

  constructor(
    private router: Router,
    private productService: ProductService
  ) {
  }

  get barTitle() {
    return this.isPublishView ? 'สินค้าทั้งหมด' : 'สินค้าล่าสุด';
  }

  get productItems() {
    return (this.ownerId)
      ? this.productService.ownerItems
      : this.productService.previewItems;
  }

  get isPublishView() {
    return (this.ownerId);
  }

  goSearch() {
    this.router.navigate(['list/product']);
  }

  ngOnInit() {
    if (this.ownerId) {
      this.productService.loadItemByOwner(this.ownerId);
    } else {
      this.productService.loadPreviewItems();
    }
  }

}
