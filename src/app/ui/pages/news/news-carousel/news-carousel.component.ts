import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NewsService } from '../../../../core/news.service';

@Component({
  selector: 'app-news-carousel',
  templateUrl: './news-carousel.component.html',
  styleUrls: ['./news-carousel.component.scss']
})
export class NewsCarouselComponent implements OnInit {

  @ViewChild(NgbCarousel)
  carousel: NgbCarousel;

  constructor(
    config: NgbCarouselConfig,
    private newsService: NewsService
  ) {
    config.interval = 5000;
    config.showNavigationArrows = false;
  }

  get newsItems() {
    return this.newsService.previewItems;
  }

  ngOnInit() {
    this.newsService.loadPreviewItems();
  }

}
