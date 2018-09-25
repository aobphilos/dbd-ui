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
    // this.memberIndex.setSettings({
    //   attributesForFaceting: [
    //     'storeIds',
    //     'productIds',
    //     'promotionIds',
    //     'storeFollowingIds',
    //     'productFollowingIds',
    //     'promotionFollowingIds'
    //   ]
    // });
  }

  private initMemberStoreIndex() {
    this.memberStoreIndex = this.algolia.initIndex('MemberStore');
    this.memberStoreIndex.setSettings({
      attributesForFaceting: ['followerIds'],
      searchableAttributes: [
        'isPublished',
        'followerIds',
        'storeName',
        'storeDescription',
        'description'
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
        'price'
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
        'storeName',
        'description',
        'period',
        'urlLink'
      ]
    });
  }

}
