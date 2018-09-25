import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../layout/layout.service';
import { Router } from '@angular/router';
import { SearchBarService } from './search-bar.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  keyword = '';
  searchType = 'shop|1';

  private toggleSerchBarSource: boolean;
  get toogleSearchBar() {
    return this.toggleSerchBarSource;
  }

  constructor(
    private route: Router,
    private layoutService: LayoutService,
    private serchBarService: SearchBarService
  ) { }

  doSearch() {
    const segments = this.searchType.split('|');
    const fillByFavorite = segments[1] === '2'
      ? { isFavorite: true } : {};
    this.route.navigate([`/list/${segments[0]}/`],
      { queryParams: { keyword: this.keyword, ...fillByFavorite } });
  }

  onKeyDownSearch(event) {
    if (event.keyCode === 13) {
      this.doSearch();
    }
  }

  ngOnInit() {
    this.layoutService.showSearchBar.subscribe(flag => this.toggleSerchBarSource = flag);
    this.serchBarService.searchCriteria.subscribe(options => {
      if (options) {
        this.keyword = options.keyword;
        this.searchType = options.searchType;
      }
    });
  }

}
