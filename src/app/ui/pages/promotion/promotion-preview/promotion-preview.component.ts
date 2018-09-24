import { Component, OnInit, Input } from '@angular/core';
import { PromotionService } from '../../../../core/promotion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-promotion-preview',
  templateUrl: './promotion-preview.component.html',
  styleUrls: ['./promotion-preview.component.scss']
})
export class PromotionPreviewComponent implements OnInit {

  @Input() ownerId: string;

  constructor(
    private router: Router,
    private promotionService: PromotionService
  ) { }

  get barTitle() {
    return this.isPublishView ? 'โปรโมชั่นทั้งหมด' : 'โปรโมชั่นล่าสุด';
  }

  get promotionItems() {
    return (this.ownerId)
      ? this.promotionService.ownerItems
      : this.promotionService.previewItems;
  }

  get isPublishView() {
    return (this.ownerId);
  }

  goSearch() {
    this.router.navigate(['list/promotion']);
  }

  ngOnInit() {
    if (this.ownerId) {
      this.promotionService.loadItemByOwner(this.ownerId);
    } else {
      this.promotionService.loadPreviewItems();
    }
  }

}
