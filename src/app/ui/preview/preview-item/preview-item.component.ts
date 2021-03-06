import { Component, OnInit, Input } from '@angular/core';
import { UploaderType } from '../../../enum/uploader-type';
import { MemberStoreView } from '../../../model/views/member-store-view';
import { ProductView } from '../../../model/views/product-view';
import { PromotionView } from '../../../model/views/promotion-view';
import { NewsView } from 'src/app/model/views/news-view';
import { MemberStoreService } from '../../../core/member-store.service';
import { ProductService } from '../../../core/product.service';
import { PromotionService } from '../../../core/promotion.service';
import { MemberService } from '../../../core/member.service';
import { Router } from '@angular/router';
import { Lightbox, IAlbum } from 'ngx-lightbox';

type ImageUploadModel = MemberStoreView | ProductView | PromotionView | NewsView;

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
    private memberService: MemberService,
    private lightbox: Lightbox
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

  openImage(imageUrl: string, caption: string) {
    const option: IAlbum = {
      src: imageUrl,
      caption: caption,
      thumb: ''
    };
    this.lightbox.open([option], 0);
  }

  close(): void {
    // close lightbox programmatically
    this.lightbox.close();
  }

  ngOnInit() {
    if (!this.item.imageUrl || this.item.imageUrl === '') {

      if (this.isProduct) {
        this.item.imageUrl = '/assets/uploaders/product.png';
      } else if (this.isPromotion) {
        this.item.imageUrl = '/assets/uploaders/product.png';
      } else if (this.isStore) {
        this.item.imageUrl = '/assets/uploaders/shop.png';
      }

    }
  }

}
