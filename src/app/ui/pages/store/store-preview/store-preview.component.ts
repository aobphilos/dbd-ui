import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../../core/store.service';

@Component({
  selector: 'app-store-preview',
  templateUrl: './store-preview.component.html',
  styleUrls: ['./store-preview.component.scss']
})
export class StorePreviewComponent implements OnInit {

  constructor(private storeService: StoreService) { }

  get storeItems() {
    return this.storeService.previewItems;
  }

  ngOnInit() { }

}
