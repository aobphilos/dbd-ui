import { Component, OnInit } from '@angular/core';
import { IndicatorService } from './indicator.service';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss']
})
export class IndicatorComponent implements OnInit {

  constructor(private indicatorService: IndicatorService) {
  }

  get showBusy() {
    return this.indicatorService.busyIndicator;
  }

  ngOnInit() { }

}
