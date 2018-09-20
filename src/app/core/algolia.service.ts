import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as algoliasearch from 'algoliasearch';

@Injectable({
  providedIn: 'root'
})
export class AlgoliaService {
  private algolia: algoliasearch.Client;

  constructor() {
    this.algolia = algoliasearch(
      environment.algolia.app_id,
      environment.algolia.search_key
    );
  }

  get memberIndex() {
    return this.algolia.initIndex('Member');
  }

  get memberStoreIndex() {
    return this.algolia.initIndex('MemberStore');
  }

  get productIndex() {
    return this.algolia.initIndex('Product');
  }

  get promotionIndex() {
    return this.algolia.initIndex('Promotion');
  }

}
