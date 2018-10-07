import { ModelBase } from './model-base';
import { MemberType } from '../enum/member-type';

export class MemberGroup {
  id: string;
  desc: string;
  members: Member[];
  constructor() {

  }
}

export class Member extends ModelBase {

  memberType: MemberType;
  storeName: string;
  storeDescription: string;
  ownerName: string;
  email: string;
  phone: string;
  lineId: string;
  facebookId: string;
  website: string;
  address: string;
  province: string;
  district: string;
  subDistrict: string;
  postalCode: string;

  // Owner
  storeIds: string[];
  productIds: string[];
  promotionIds: string[];
  newsIds: string[];

  // Following
  storeFollowingIds: string[];
  productFollowingIds: string[];
  promotionFollowingIds: string[];
  newsFollowingIds: string[];

  constructor() {
    super();
    this.memberType = MemberType.RETAIL;
    this.storeName = '';
    this.storeDescription = '';
    this.ownerName = '';
    this.email = '';
    this.phone = '';
    this.lineId = '';
    this.facebookId = '';
    this.website = '';
    this.address = '';
    this.province = '';
    this.district = '';
    this.subDistrict = '';
    this.postalCode = '';

    this.storeIds = [];
    this.productIds = [];
    this.promotionIds = [];
    this.newsIds = [];

    this.storeFollowingIds = [];
    this.productFollowingIds = [];
    this.promotionFollowingIds = [];
    this.newsFollowingIds = [];
  }

}
