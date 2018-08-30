import { Component, OnInit, Input } from '@angular/core';
import { StoreService } from '../../../../core/store.service';
import { ProductService } from '../../../../core/product.service';
import { Store } from '../../../../model/store';
import { Product } from '../../../../model/product';

@Component({
  selector: 'app-member-dealer',
  templateUrl: './member-dealer.component.html',
  styleUrls: ['./member-dealer.component.scss']
})
export class MemberDealerComponent implements OnInit {

  @Input() ownerId: string;

  constructor(
    private storeService: StoreService,
    private productService: ProductService
  ) { }

  get storeItems() {
    return this.storeService.currentItems;
  }

  get productItems() {
    return this.productService.currentItems;
  }

  ngOnInit() {
    this.storeService.loadCurrentItems(this.ownerId);
    this.productService.loadCurrentItems(this.ownerId);
  }

}
