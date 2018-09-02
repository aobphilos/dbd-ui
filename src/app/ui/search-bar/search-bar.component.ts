import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../layout/layout.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  keyword = '';
  searchType = 'shop';

  private toggleSerchBarSource: boolean;
  get toogleSearchBar() {
    return this.toggleSerchBarSource;
  }

  constructor(private layoutService: LayoutService) { }

  doSearch() {
    console.log('key: ', this.keyword);
    console.log('type: ', this.searchType);
  }

  ngOnInit() {
    this.layoutService.showSearchBar.subscribe(flag => this.toggleSerchBarSource = flag);
  }

}
