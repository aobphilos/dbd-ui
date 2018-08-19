import { Component, OnInit } from '@angular/core';
import { IndicatorService } from './indicator.service';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss']
})
export class IndicatorComponent implements OnInit {
  showBusy: boolean;

  constructor(private indicatorService: IndicatorService) {
    this.showBusy = false;
  }

  ngOnInit() {
    this.indicatorService.busyIndicator.subscribe(flag => this.showBusy = flag);
  }

}
