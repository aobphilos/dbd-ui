import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { NewsService } from '../../../../core/news.service';
import { NewsView } from '../../../../model/views/news-view';
import { QueryParams } from '../../../../model/queryParams';

@Component({
  selector: 'app-news-search',
  templateUrl: './news-search.component.html',
  styleUrls: ['./news-search.component.scss']
})
export class NewsSearchComponent implements OnInit {

  isFavorite = false;
  sortDirection = 'asc';
  priceRange = 'none';

  currentPage: number;
  totalHits: number;

  private news: NewsView[] = [];

  constructor(
    private newsService: NewsService
  ) {
    this.currentPage = 1;
    this.totalHits = 0;
  }

  get newsItems() {
    return of(this.news);
  }

  onPageChange() {
    this.goSearchNextPage(this.currentPage - 1);
  }

  doSearch() {
    this.goSearchNextPage(0);
  }

  private getQueryParams(pageIndex: number) {
    const qp = new QueryParams();
    qp.pageIndex = pageIndex;
    return qp;
  }

  private goSearchNextPage(pageIndex: number) {

    this.newsService.searchItems(this.getQueryParams(pageIndex))
      .then(
        result => {
          this.currentPage = result.currentPageIndex + 1;
          this.totalHits = result.totalHits;
          this.news.splice(0, this.news.length, ...result.hits);
        },
        err => console.log(err)
      );
  }

  ngOnInit() {
    this.goSearchNextPage(0);
  }

}
