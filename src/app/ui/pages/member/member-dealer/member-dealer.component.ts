import { Component, OnInit, Input } from '@angular/core';
import { StoreService } from '../../../../core/store.service';
import { ProductService } from '../../../../core/product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-member-dealer',
  templateUrl: './member-dealer.component.html',
  styleUrls: ['./member-dealer.component.scss']
})
export class MemberDealerComponent implements OnInit {

  @Input() ownerId: Observable<string>;

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
    this.ownerId.subscribe(id => {
      if (id) {
        this.storeService.loadCurrentItems(id);
        this.productService.loadCurrentItems(id);
      }
    });
  }

}
