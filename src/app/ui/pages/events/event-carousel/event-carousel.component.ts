import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgbCarousel, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-event-carousel',
  templateUrl: './event-carousel.component.html',
  styleUrls: ['./event-carousel.component.scss']
})
export class EventCarouselComponent implements OnInit {

  images = [1, 2, 3].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);

  @ViewChild(NgbCarousel)
  private carousel: NgbCarousel;

  constructor(config: NgbCarouselConfig) {
    config.interval = 5000;
    config.showNavigationArrows = false;
  }

  ngOnInit() {
  }

}
