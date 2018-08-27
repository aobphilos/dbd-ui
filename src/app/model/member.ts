import { ModelBase } from './model-base';

export class MemberGroup {
  id: string;
  desc: string;
  members: Member[];
  constructor() {

  }
}

export class Member extends ModelBase {

  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  lineId: string;
  facebookId: string;
  website: string;
  address: string;

  // Owner
  storeIds: string[];
  productIds: string[];
  promotionIds: string[];

  // Following
  storeFollowingIds: string[];
  productFollowingIds: string[];
  promotionFollowingIds: string[];

  constructor() {
    super();
    this.storeName = '';
    this.ownerName = '';
    this.email = '';
    this.phone = '';
    this.lineId = '';
    this.facebookId = '';
    this.website = '';
    this.address = '';
    this.storeIds = [];
    this.productIds = [];
    this.promotionIds = [];
    this.storeFollowingIds = [];
    this.productFollowingIds = [];
    this.promotionFollowingIds = [];
  }

}
