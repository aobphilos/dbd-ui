import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private toggleMapSource = new BehaviorSubject<boolean>(true);
  private toggleMenuSource = new BehaviorSubject<boolean>(true);
  private collapseMenuSource = new BehaviorSubject<boolean>(true);
  private toggleSearchBarSource = new BehaviorSubject<boolean>(false);

  constructor() { }

  get showGoogleMap() {
    return this.toggleMapSource.asObservable();
  }

  get showMainMenu() {
    return this.toggleMenuSource.asObservable();
  }

  get collapseMainMenu() {
    return this.collapseMenuSource.asObservable();
  }

  get showSearchBar() {
    return this.toggleSearchBarSource.asObservable();
  }

  toggleMap(flag: boolean) {
    this.toggleMapSource.next(flag);
  }

  toggleMenu(flag: boolean) {
    this.toggleMenuSource.next(flag);
  }

  collapseMenu(flag: boolean) {
    this.collapseMenuSource.next(flag);
  }

  toggleSearchBar(flag: boolean) {
    this.toggleSearchBarSource.next(flag);
  }
}
