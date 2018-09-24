import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgbCarousel, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-event-carousel',
  templateUrl: './event-carousel.component.html',
  styleUrls: ['./event-carousel.component.scss']
})
export class EventCarouselComponent implements OnInit {

  // images = [1, 2, 3].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);

  images = [
    'https://firebasestorage.googleapis.com/v0/b/dbd-ui-blob/o/EVENTS%2Fbanner0.jpg?alt=media&token=f4111dbe-abf4-4577-b855-cb92743ad3e5',

    'https://firebasestorage.googleapis.com/v0/b/dbd-ui-blob/o/EVENTS%2Fbanner1.jpg?alt=media&token=4c7082f2-e3cd-4327-a0f3-1cbb18a8fdeb',

    'https://firebasestorage.googleapis.com/v0/b/dbd-ui-blob/o/EVENTS%2Fbanner2.jpg?alt=media&token=40443a34-cca5-4c3c-ada2-65f38fd7eb89',

    'https://firebasestorage.googleapis.com/v0/b/dbd-ui-blob/o/EVENTS%2Fbanner3.jpg?alt=media&token=cb4bc26a-dfbb-4895-b5fa-68c25f50d79f'
  ];

  @ViewChild(NgbCarousel)
  private carousel: NgbCarousel;

  constructor(config: NgbCarouselConfig) {
    config.interval = 5000;
    config.showNavigationArrows = false;
  }

  ngOnInit() {
  }

}
