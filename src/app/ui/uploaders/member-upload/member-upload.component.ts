import { Component, OnInit, Input } from '@angular/core';
import { UploaderType } from '../../../enum/uploader-type';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '../../../model/store';
import { Product } from '../../../model/product';
import { Promotion } from '../../../model/promotion';
import { News } from '../../../model/news';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { NotifyService } from '../../notify/notify.service';
import { StoreService } from '../../../core/store.service';
import { ProductService } from '../../../core/product.service';
import { PromotionService } from '../../../core/promotion.service';
import { NewsService } from '../../../core/news.service';
import { IndicatorService } from '../../indicator/indicator.service';
import { MemberService } from '../../../core/member.service';
import { BehaviorSubject } from 'rxjs';
import { Member } from '../../../model/member';
import { OwnerView } from '../../../model/views/owner-view';

type ImageUploadModel = Store | Product | Promotion | News;

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
  private owner: Member;

  constructor(
    private modalService: NgbModal,
    private notifyService: NotifyService,
    private storeService: StoreService,
    private productService: ProductService,
    private promotionService: PromotionService,
    private newsService: NewsService,
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
      case UploaderType.NEWS: title += 'ข้อมูลข่าวประชาสัมพันธ์'; break;
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

  get isNews() {
    return this.uploaderType === UploaderType.NEWS;
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
        this.updateDbWithImage(this.model.imageUrl);
      } else {
        uploader.startUpload()
          .then(
            result => {
              result.subscribe(url => {
                this.updateDbWithImage(url);
              });
            },
            err => this.logError(err));
      }

      return;
    }

    this.notifyService.setWarningMessage('Please choose an image');

  }

  private updateDbWithImage(imageUrl: string) {
    this.model.imageUrl = imageUrl;
    this.updateDb()
      .then(() => {
        this.modalRef.close(); this.hideBusy();
      }, err => this.logError(err));
  }

  private setDefaultImageUrl() {

    if (!this.model.imageUrl || this.model.imageUrl === '') {
      if (this.isProduct) {
        this.model.imageUrl = '/assets/uploaders/product.png';
      } else if (this.isPromotion) {
        this.model.imageUrl = '/assets/uploaders/product.png';
      } else if (this.isStore) {
        this.model.imageUrl = '/assets/uploaders/shop.png';
      }
    }

  }

  removeItem() {
    this.showBusy();
    return new Promise<any>((resolve, reject) => {

      let deferred: Promise<any>;
      if (this.isProduct) {
        deferred = this.productService.delete(this.model.id);
      } else if (this.isPromotion) {
        deferred = this.promotionService.delete(this.model.id);
      } else if (this.isNews) {
        deferred = this.newsService.delete(this.model.id);
      } else {
        deferred = this.storeService.delete(this.model.id);
      }

      deferred.then(() => {
        this.hideBusy();
        resolve();
      }, err => {
        this.hideBusy();
        reject(err);
      });

    });
  }

  private updateDb() {
    return new Promise<any>((resolve, reject) => {

      let deferred: Promise<any>;
      if (this.isProduct) {
        deferred = this.productService.upsert(this.model as Product);
      } else if (this.isPromotion) {
        deferred = this.promotionService.upsert(this.model as Promotion);
      } else if (this.isNews) {
        deferred = this.newsService.upsert(this.model as News);
      } else {
        deferred = this.storeService.upsert(this.model as Store);
      }

      deferred.then(() => resolve(), err => reject(err));

    });
  }
  private buildModel() {

    if (this.isProduct) {
      this.model = (this.item) ? { ...this.item } as Product : new Product();
    } else if (this.isPromotion) {
      this.model = (this.item) ? { ...this.item } as Promotion : new Promotion();
    } else if (this.isNews) {
      this.model = (this.item) ? { ...this.item } as News : new News();
    } else {
      this.model = (this.item) ? { ...this.item } as Store : new Store();
    }

    if (!this.item) {
      this.model.ownerId = this.owner.id;
      this.model.owner = OwnerView.create(this.owner);
    }

    this.setDefaultImageUrl();

    this.imageUrlSubject.next(this.model.imageUrl);
  }

  ngOnInit() {
    this.imageUrlSubject.subscribe(url => this.imageUrl = url);
    this.memberService.currentMember.subscribe(member => {
      if (member) {
        this.owner = member;
        this.buildModel();
      }
    });
  }

}
