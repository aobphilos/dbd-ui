import { Component, OnInit, Input } from '@angular/core';
import { StoreService } from '../../../../core/store.service';
import { ProductService } from '../../../../core/product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-member-retail',
  templateUrl: './member-retail.component.html',
  styleUrls: ['./member-retail.component.scss']
})
export class MemberRetailComponent implements OnInit {

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
