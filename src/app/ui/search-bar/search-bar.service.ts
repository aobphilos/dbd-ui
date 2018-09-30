import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SearchType } from '../../enum/search-type';

@Injectable({
  providedIn: 'root'
})
export class SearchBarService {

  private searchCriteriaSource = new BehaviorSubject<any>(null);

  constructor() { }

  get searchCriteria() {
    return this.searchCriteriaSource.asObservable();
  }

  setCriteria(searchType: SearchType, keyword: string = '', isFavorite: boolean = false) {
    const options = {
      keyword,
      searchType: `${searchType}|${isFavorite ? '2' : '1'}`
    };
    this.searchCriteriaSource.next(options);
  }
}
