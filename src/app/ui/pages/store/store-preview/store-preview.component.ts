import { Component, OnInit } from '@angular/core';
import { MemberStoreService } from '../../../../core/member-store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-preview',
  templateUrl: './store-preview.component.html',
  styleUrls: ['./store-preview.component.scss']
})
export class StorePreviewComponent implements OnInit {

  constructor(
    private router: Router,
    private memberStoreService: MemberStoreService
  ) { }

  get storeItems() {
    return this.memberStoreService.previewItems;
  }

  goSearch() {
    this.router.navigate(['list/shop']);
  }

  ngOnInit() { }

}
