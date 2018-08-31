import { Component, OnInit, Input } from '@angular/core';
import { StoreService } from '../../../../core/store.service';
import { ProductService } from '../../../../core/product.service';
import { PromotionService } from '../../../../core/promotion.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-member-wholesale',
  templateUrl: './member-wholesale.component.html',
  styleUrls: ['./member-wholesale.component.scss']
})
export class MemberWholesaleComponent implements OnInit {

  @Input() ownerId: Observable<string>;

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
    return this.promotionService.currentItems;
  }

  ngOnInit() {
    this.ownerId.subscribe(id => {
      if (id) {
        this.storeService.loadCurrentItems(id);
        this.productService.loadCurrentItems(id);
        this.promotionService.loadCurrentItems(id);
      }
    });
  }

}
