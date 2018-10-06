import { MemberType } from '../../enum/member-type';
import { Member } from '../member';

export class OwnerView {
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

  constructor() {
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
  }

  public static create(member: Member) {
    return {
      memberType: member.memberType,
      storeName: member.storeName,
      storeDescription: member.storeDescription,
      ownerName: member.ownerName,
      email: member.email,
      phone: member.phone,
      lineId: member.lineId,
      facebookId: member.facebookId,
      website: member.website,
      address: member.address,
      province: member.province,
      district: member.district,
      subDistrict: member.subDistrict,
      postalCode: member.postalCode
    };
  }

}
