import { Component, OnInit, Input, ContentChild, ContentChildren, QueryList, AfterViewInit } from '@angular/core';
import { UploaderType } from '../../../enum/uploader-type';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '../../../model/store';
import { Product } from '../../../model/product';
import { Promotion } from '../../../model/promotion';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { NotifyService } from '../../notify/notify.service';

type ImageUploadType = Store | Product | Promotion;

@Component({
  selector: 'app-member-upload',
  templateUrl: './member-upload.component.html',
  styleUrls: ['./member-upload.component.scss']
})
export class MemberUploadComponent implements OnInit, AfterViewInit {

  @Input() uploaderType: UploaderType;
  @ContentChild(FileUploadComponent) fileUploader: FileUploadComponent;

  private modalRef: NgbModalRef;
  model: ImageUploadType;

  get modalTitle() {
    let title = '';
    switch (this.uploaderType) {
      case UploaderType.STORE: title = 'เพิ่มภาพถ่ายร้าน'; break;
      case UploaderType.PRODUCT: title = 'เพิ่มรายการสินค้า'; break;
      case UploaderType.PROMOTION: title = 'เพิ่มรายการส่งเสริมการตลาด'; break;
    }
    return title;
  }

  get hasUploadId() {
    return false;
  }

  get imageURL() {
    return '';
  }

  get isStoreType() {
    return this.uploaderType === UploaderType.STORE;
  }

  get isProduct() {
    return this.uploaderType === UploaderType.PRODUCT;
  }

  get isPromotion() {
    return this.uploaderType === UploaderType.PROMOTION;
  }

  constructor(private modalService: NgbModal, private notifyService: NotifyService) { }

  openModal(content) {

    this.modalRef = this.modalService
      .open(content, {
        windowClass: 'modal-upload'
      });
  }

  save() {

    if (this.fileUploader && this.fileUploader.hasImage) {
      this.fileUploader.startUpload();
      this.modalRef.close();
      return;
    }

    this.notifyService.setWarningMessage('Please choose an image');

  }

  ngOnInit() {
    if (this.isProduct) {
      this.model = new Product();
    } else if (this.isPromotion) {
      this.model = new Promotion();
    } else {
      this.model = new Store();
    }
  }

  ngAfterViewInit() {
    console.log('uploader: ', this.fileUploader);
  }

}
