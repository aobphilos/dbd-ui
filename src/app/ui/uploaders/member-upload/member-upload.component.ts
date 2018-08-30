import { Component, OnInit, Input } from '@angular/core';
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
export class MemberUploadComponent implements OnInit {

  @Input() uploaderType: UploaderType;

  private modalRef: NgbModalRef;
  model: ImageUploadType;

  showEditIcon: boolean;

  imageUrl: string;
  imageUrlSource: string;

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

  get isStoreType() {
    return this.uploaderType === UploaderType.STORE;
  }

  get isProduct() {
    return this.uploaderType === UploaderType.PRODUCT;
  }

  get isPromotion() {
    return this.uploaderType === UploaderType.PROMOTION;
  }

  toggleEditIcon(flag: boolean) {
    this.showEditIcon = flag;
  }

  constructor(private modalService: NgbModal, private notifyService: NotifyService) { }

  openModal(content) {

    this.modalRef = this.modalService
      .open(content, {
        windowClass: 'modal-upload'
      });
  }

  save(uploader: FileUploadComponent) {

    if (uploader.hasImage) {
      uploader.startUpload()
        .then(
          result => {
            result.subscribe(url => { this.model.imageUrl = url; console.log('url: ', url); });
            this.modalRef.close();
          },
          err => console.log(err)
        );
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

    this.imageUrlSource = '';
  }

}
