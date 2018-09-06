import { Component, OnInit, Input } from '@angular/core';
import { UploaderType } from '../../../enum/uploader-type';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '../../../model/store';
import { Product } from '../../../model/product';
import { Promotion } from '../../../model/promotion';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { NotifyService } from '../../notify/notify.service';
import { StoreService } from '../../../core/store.service';
import { ProductService } from '../../../core/product.service';
import { PromotionService } from '../../../core/promotion.service';
import { IndicatorService } from '../../indicator/indicator.service';
import { MemberService } from '../../../core/member.service';
import { BehaviorSubject } from 'rxjs';

type ImageUploadModel = Store | Product | Promotion;

@Component({
  selector: 'app-member-upload',
  templateUrl: './member-upload.component.html',
  styleUrls: ['./member-upload.component.scss']
})
export class MemberUploadComponent implements OnInit {

  @Input() uploaderType: UploaderType;
  @Input() item: ImageUploadModel;

  private modalRef: NgbModalRef;
  model: ImageUploadModel;

  private imageUrlSubject: BehaviorSubject<string>;
  imageUrl: string;
  showEditIcon: boolean;
  // backup current owner id for local use.
  private ownerId: string;

  constructor(
    private modalService: NgbModal,
    private notifyService: NotifyService,
    private storeService: StoreService,
    private productService: ProductService,
    private promotionService: PromotionService,
    private indicatorService: IndicatorService,
    private memberService: MemberService
  ) {
    this.imageUrlSubject = new BehaviorSubject<string>('');
  }

  private showBusy = () => this.indicatorService.showBusy();
  private hideBusy = () => this.indicatorService.hideBusy();

  get modalTitle() {
    return this.getModalTitle(false);
  }

  get modalDeleteTitle() {
    return this.getModalTitle(true);
  }

  private getModalTitle(isDelete: boolean) {
    let title = isDelete ? 'ลบ' : ((this.hasItem) ? 'แก้ไข' : 'เพิ่ม');
    switch (this.uploaderType) {
      case UploaderType.STORE: title += 'ข้อมูลภาพถ่ายร้าน'; break;
      case UploaderType.PRODUCT: title += 'ข้อมูลรายการสินค้า'; break;
      case UploaderType.PROMOTION: title += 'ข้อมูลรายการส่งเสริมการตลาด'; break;
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

  private logError(err) {
    console.log(err);
    this.hideBusy();
  }

  toggleEditIcon(flag: boolean) {
    this.showEditIcon = flag;
  }

  openModal(content) {

    this.modalRef = this.modalService
      .open(content, {
        windowClass: 'modal-upload',
        centered: true
      });

    this.modalRef.result.then(
      (reason) => {
        this.buildModel();
        if (reason === 'delete') {
          this.removeItem();
        }
      },
      _err => {
        this.buildModel();
      }
    );
  }

  save(uploader: FileUploadComponent) {

    if (uploader.hasImage) {
      this.showBusy();
      if (uploader.userOldImage) {
        this.updateDb()
          .then(() => {
            this.modalRef.close(); this.hideBusy();
          }, err => this.logError(err));
      } else {

        uploader.startUpload()
          .then(
            result => {
              result.subscribe(url => {
                this.model.imageUrl = url;
                this.updateDb()
                  .then(() => {
                    this.modalRef.close(); this.hideBusy();
                  }, err => this.logError(err));
              });
            },
            err => this.logError(err));
      }

      return;
    }

    this.notifyService.setWarningMessage('Please choose an image');

  }

  removeItem() {
    return new Promise<any>((resolve, reject) => {

      let deferred: Promise<any>;
      if (this.isProduct) {
        deferred = this.productService.delete(this.model.id, this.model.ownerId);
      } else if (this.isPromotion) {
        deferred = this.promotionService.delete(this.model.id, this.model.ownerId);
      } else {
        deferred = this.storeService.delete(this.model.id, this.model.ownerId);
      }

      deferred.then(() => resolve(), err => reject(err));

    });
  }

  private updateDb() {
    return new Promise<any>((resolve, reject) => {

      let deferred: Promise<any>;
      if (this.isProduct) {
        deferred = this.productService.upsert(this.model as Product);
      } else if (this.isPromotion) {
        deferred = this.promotionService.upsert(this.model as Promotion);
      } else {
        deferred = this.storeService.upsert(this.model as Store);
      }

      deferred.then(() => resolve(), err => reject(err));

    });
  }
  private buildModel() {

    if (this.isProduct) {
      this.model = this.item || new Product();
    } else if (this.isPromotion) {
      this.model = this.item || new Promotion();
    } else {
      this.model = this.item || new Store();
    }

    if (!this.item) {
      this.model.ownerId = this.ownerId;
    }

    this.imageUrlSubject.next(this.model.imageUrl);
  }

  ngOnInit() {
    this.imageUrlSubject.subscribe(url => this.imageUrl = url);
    this.buildModel();
    this.memberService.currentMember.subscribe(member => {
      if (member) {
        this.ownerId = member.id;
        this.model.ownerId = member.id;
      }
    });
  }

}
