import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../layout/layout.service';
import { Router } from '@angular/router';

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

  constructor(
    private route: Router,
    private layoutService: LayoutService
  ) { }

  doSearch() {
    this.route.navigate([`/list/${this.searchType}/`], { queryParams: { keyword: this.keyword } });
  }

  ngOnInit() {
    this.layoutService.showSearchBar.subscribe(flag => this.toggleSerchBarSource = flag);
  }

}
