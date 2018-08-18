import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {

  private toggleIndicatorSource = new BehaviorSubject<boolean>(false);

  constructor() {

  }

  get busyIndicator() {
    return this.toggleIndicatorSource.asObservable();
  }

  showBusy() {
    this.setIndicator(true);
  }

  hideBusy() {
    this.setIndicator(false);
  }

  private setIndicator(flag: boolean) {
    this.toggleIndicatorSource.next(flag);
  }

}
