import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NewsService } from '../../../../core/news.service';
import { Lightbox, IAlbum } from 'ngx-lightbox';

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
    private newsService: NewsService,
    private lightbox: Lightbox
  ) {
    config.interval = 5000;
    config.showNavigationArrows = false;
  }

  get newsItems() {
    return this.newsService.previewItems;
  }

  openImage(imageUrl: string, caption: string) {
    const option: IAlbum = {
      src: imageUrl,
      caption: caption,
      thumb: ''
    };
    this.lightbox.open([option], 0);
  }

  close(): void {
    // close lightbox programmatically
    this.lightbox.close();
  }

  ngOnInit() {
    this.newsService.loadPreviewItems();
  }

}
