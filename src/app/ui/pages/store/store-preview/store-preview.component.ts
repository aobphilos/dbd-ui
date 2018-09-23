import { Component, OnInit, Input } from '@angular/core';
import { MemberStoreService } from '../../../../core/member-store.service';
import { Router } from '@angular/router';
import { StoreService } from '../../../../core/store.service';

@Component({
  selector: 'app-store-preview',
  templateUrl: './store-preview.component.html',
  styleUrls: ['./store-preview.component.scss']
})
export class StorePreviewComponent implements OnInit {

  @Input() ownerId: string;

  constructor(
    private router: Router,
    private memberStoreService: MemberStoreService,
    private storeService: StoreService
  ) {
  }

  get storeItems() {
    return (this.ownerId)
      ? this.storeService.currentItems
      : this.memberStoreService.previewItems;
  }

  get isPublishView() {
    return (this.ownerId);
  }

  goSearch() {
    this.router.navigate(['list/shop']);
  }

  ngOnInit() {
    if (this.ownerId) {
      this.storeService.loadCurrentItems(this.ownerId);
    } else {
      this.memberStoreService.loadPreviewItems();
    }
  }

}
