import { Component, OnInit, Input } from '@angular/core';
import { Store } from '../../../model/store';
import { Product } from '../../../model/product';
import { Promotion } from '../../../model/promotion';
import { UploaderType } from '../../../enum/uploader-type';

type ImageUploadModel = Store | Product | Promotion;

@Component({
  selector: 'app-preview-item',
  templateUrl: './preview-item.component.html',
  styleUrls: ['./preview-item.component.scss']
})
export class PreviewItemComponent implements OnInit {

  @Input() uploaderType: UploaderType;
  @Input() item: ImageUploadModel;

  constructor() { }

  get modalTitle() {
    let title = '';
    switch (this.uploaderType) {
      case UploaderType.STORE: title = 'เพิ่มข้อมูลภาพถ่ายร้าน'; break;
      case UploaderType.PRODUCT: title = 'เพิ่มข้อมูลรายการสินค้า'; break;
      case UploaderType.PROMOTION: title = 'เพิ่มข้อมูลรายการส่งเสริมการตลาด'; break;
    }
    return title;
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

  ngOnInit() {
  }

}
