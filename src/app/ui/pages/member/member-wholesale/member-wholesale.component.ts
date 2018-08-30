import { Component, OnInit, Input } from '@angular/core';
import { StoreService } from '../../../../core/store.service';
import { ProductService } from '../../../../core/product.service';
import { PromotionService } from '../../../../core/promotion.service';
import { Store } from '../../../../model/store';
import { Product } from '../../../../model/product';
import { Promotion } from '../../../../model/promotion';

@Component({
  selector: 'app-member-wholesale',
  templateUrl: './member-wholesale.component.html',
  styleUrls: ['./member-wholesale.component.scss']
})
export class MemberWholesaleComponent implements OnInit {

  @Input() ownerId: string;

  constructor(
    private storeService: StoreService,
    private productService: ProductService,
    private promotionService: PromotionService
  ) { }

  get storeItems() {
    return this.storeService.currentItems;
  }

  get productItems() {
    return this.productService.currentItems;
  }

  get promotionItems() {
    return this.productService.currentItems;
  }

  ngOnInit() {
    this.storeService.loadCurrentItems(this.ownerId);
    this.productService.loadCurrentItems(this.ownerId);
    this.promotionService.loadCurrentItems(this.ownerId);
  }

}
