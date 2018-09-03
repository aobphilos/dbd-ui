import { Component, OnInit, Input } from '@angular/core';
import { StoreService } from '../../../../core/store.service';

@Component({
  selector: 'app-shop-preview',
  templateUrl: './shop-preview.component.html',
  styleUrls: ['./shop-preview.component.scss']
})
export class ShopPreviewComponent implements OnInit {

  constructor(private storeService: StoreService) { }

  get storeItems() {
    return this.storeService.latestItems;
  }

  ngOnInit() { }

}
