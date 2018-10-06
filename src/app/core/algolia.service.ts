import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as algoliasearch from 'algoliasearch';

@Injectable({
  providedIn: 'root'
})
export class AlgoliaService {
  private algolia: algoliasearch.Client;

  memberIndex: algoliasearch.Index;
  memberStoreIndex: algoliasearch.Index;
  productIndex: algoliasearch.Index;
  promotionIndex: algoliasearch.Index;

  constructor() {
    this.algolia = algoliasearch(
      environment.algolia.app_id,
      environment.algolia.admin_key
    );

    this.initMemberIndex();
    this.initMemberStoreIndex();
    this.initProductIndex();
    this.initPromotionIndex();

  }

  private initMemberIndex() {
    this.memberIndex = this.algolia.initIndex('Member');
  }

  private initMemberStoreIndex() {
    this.memberStoreIndex = this.algolia.initIndex('MemberStore');
    this.memberStoreIndex.setSettings({
      attributesForFaceting: ['followerIds'],
      searchableAttributes: [
        'isPublished',
        'followerIds',
        'description',
        'owner.memberType',
        'owner.storeName',
        'owner.storeDescription',
        'owner.address',
        'owner.province',
        'owner.district',
        'owner.subDistrict',
        'owner.postalCode'
      ]
    });
  }

  private initProductIndex() {
    this.productIndex = this.algolia.initIndex('Product');
    this.productIndex.setSettings({
      attributesForFaceting: ['followerIds'],
      searchableAttributes: [
        'isPublished',
        'followerIds',
        'name',
        'categoryName',
        'description',
        'price',
        'owner.storeName',
        'owner.storeDescription',
        'owner.address',
        'owner.province',
        'owner.district',
        'owner.subDistrict',
        'owner.postalCode'
      ]
    });
  }

  private initPromotionIndex() {
    this.promotionIndex = this.algolia.initIndex('Promotion');
    this.promotionIndex.setSettings({
      attributesForFaceting: ['followerIds'],
      searchableAttributes: [
        'isPublished',
        'followerIds',
        'name',
        'description',
        'period',
        'urlLink',
        'owner.storeName',
        'owner.storeDescription',
        'owner.address',
        'owner.province',
        'owner.district',
        'owner.subDistrict',
        'owner.postalCode'
      ]
    });
  }

}
