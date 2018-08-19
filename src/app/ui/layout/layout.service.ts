import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private toggleMapSource = new BehaviorSubject<boolean>(true);
  private toggleMenuSource = new BehaviorSubject<boolean>(true);

  constructor() { }

  get showGoogleMap() {
    return this.toggleMapSource.asObservable();
  }

  get showMainMenu() {
    return this.toggleMenuSource.asObservable();
  }

  toggleMap(flag: boolean) {
    this.toggleMapSource.next(flag);
  }

  toggleMenu(flag: boolean) {
    this.toggleMenuSource.next(flag);
  }

}
