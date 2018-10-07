import { Component, OnInit, Input } from '@angular/core';
import { UploaderType } from '../../../enum/uploader-type';
import { MemberStoreView } from '../../../model/views/member-store-view';
import { ProductView } from '../../../model/views/product-view';
import { PromotionView } from '../../../model/views/promotion-view';
import { MemberStoreService } from '../../../core/member-store.service';
import { ProductService } from '../../../core/product.service';
import { PromotionService } from '../../../core/promotion.service';
import { MemberService } from '../../../core/member.service';
import { Router } from '@angular/router';

type ImageUploadModel = MemberStoreView | ProductView | PromotionView;

@Component({
  selector: 'app-preview-item',
  templateUrl: './preview-item.component.html',
  styleUrls: ['./preview-item.component.scss']
})
export class PreviewItemComponent implements OnInit {

  @Input() uploaderType: UploaderType;
  @Input() item: ImageUploadModel;
  @Input() isStoreView: boolean;

  constructor(
    private router: Router,
    private memberStoreService: MemberStoreService,
    private productService: ProductService,
    private promotionService: PromotionService,
    private memberService: MemberService
  ) { }

  get showFavorite() {
    return this.item.ownerId !== this.memberService.sessionMember.id;
  }

  get hasItem() {
    return (this.item);
  }

  get isStore() {
    return this.uploaderType === UploaderType.STORE;
  }

  get isProduct() {
    return this.uploaderType === UploaderType.PRODUCT;
  }

  get isPromotion() {
    return this.uploaderType === UploaderType.PROMOTION;
  }

  get isNews() {
    return this.uploaderType === UploaderType.NEWS;
  }

  toggleFavorite(flag: boolean) {
    if (this.isProduct) {
      this.productService.updateFavorite(this.item as ProductView, flag);
    } else if (this.isPromotion) {
      this.promotionService.updateFavorite(this.item as PromotionView, flag);
    } else {
      this.memberStoreService.updateFavorite(this.item as MemberStoreView, flag);
    }
  }

  goStoreInfo(id: string) {
    this.router.navigate(['/shop', id]);
  }

  ngOnInit() { }

}
