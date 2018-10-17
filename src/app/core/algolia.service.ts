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
  newsIndex: algoliasearch.Index;

  constructor() {
    this.algolia = algoliasearch(
      environment.algolia.app_id,
      environment.algolia.admin_key
    );

    this.initMemberIndex();
    this.initMemberStoreIndex();
    this.initProductIndex();
    this.initPromotionIndex();
    this.initNewsIndex();
  }

  private initMemberIndex() {
    this.memberIndex = this.algolia.initIndex('Member');
  }

  private initMemberStoreIndex() {
    this.memberStoreIndex = this.algolia.initIndex('MemberStore');
    this.memberStoreIndex.setSettings({
      attributesForFaceting: [
        'isPublished',
        'followerIds',
        'owner.memberType',
        'owner.province',
        'owner.district',
        'owner.subDistrict',
        'owner.postalCode'
      ],
      searchableAttributes: [
        'description',
        'owner.storeName',
        'owner.storeDescription',
        'owner.address'
      ]
    });
  }

  private initProductIndex() {
    this.productIndex = this.algolia.initIndex('Product');
    this.productIndex.setSettings({
      attributesForFaceting: [
        'isPublished',
        'followerIds',
        'categoryName',
        'price',
        'owner.province',
        'owner.district',
        'owner.subDistrict',
        'owner.postalCode'
      ],

      searchableAttributes: [
        'name',
        'description',
        'owner.storeName',
        'owner.storeDescription',
        'owner.address'
      ]
    });
  }

  private initPromotionIndex() {
    this.promotionIndex = this.algolia.initIndex('Promotion');
    this.promotionIndex.setSettings({
      attributesForFaceting: [
        'isPublished',
        'followerIds',
        'owner.province',
        'owner.district',
        'owner.subDistrict',
        'owner.postalCode'
      ],

      searchableAttributes: [
        'name',
        'description',
        'period',
        'owner.storeName',
        'owner.storeDescription',
        'owner.address'
      ]
    });
  }

  private initNewsIndex() {
    this.newsIndex = this.algolia.initIndex('News');
    this.newsIndex.setSettings({
      attributesForFaceting: ['followerIds'],
      searchableAttributes: [
        'isPublished',
        'followerIds',
        'topic',
        'description',
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
