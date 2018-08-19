import { Component, OnInit } from '@angular/core';
import { IndicatorService } from '../../../indicator/indicator.service';

@Component({
  selector: 'app-register-main',
  templateUrl: './register-main.component.html',
  styleUrls: ['./register-main.component.scss']
})
export class RegisterMainComponent implements OnInit {

  constructor(private indicatorService: IndicatorService) { }

  showBusy() {
    this.indicatorService.showBusy();
    // setTimeout(() => {
    //   this.indicatorService.hideBusy();
    // }, 2500);
  }

  ngOnInit() {
  }

}
