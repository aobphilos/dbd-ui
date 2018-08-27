import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { UploaderType } from '../../../enum/uploader-type';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-member-upload',
  templateUrl: './member-upload.component.html',
  styleUrls: ['./member-upload.component.scss']
})
export class MemberUploadComponent implements OnInit {

  @Input() uploaderType: UploaderType;

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

  constructor(private modalService: NgbModal) { }

  openModal(content) {

    this.modalService
      .open(content, {
        windowClass: 'modal-upload'
      }).result.then(
        value => { },
        reason => { }
      );
  }

  ngOnInit() {
  }

}
