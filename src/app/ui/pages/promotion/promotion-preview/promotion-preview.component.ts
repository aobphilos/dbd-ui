import { Component, OnInit } from '@angular/core';
import { PromotionService } from '../../../../core/promotion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-promotion-preview',
  templateUrl: './promotion-preview.component.html',
  styleUrls: ['./promotion-preview.component.scss']
})
export class PromotionPreviewComponent implements OnInit {

  constructor(
    private router: Router,
    private promotionService: PromotionService
  ) { }

  get promotionItems() {
    return this.promotionService.previewItems;
  }

  goSearch() {
    this.router.navigate(['list/promotion']);
  }

  ngOnInit() {
  }

}
