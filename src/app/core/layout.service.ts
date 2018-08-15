import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private toggleMapSource = new BehaviorSubject<boolean>(true);

  constructor() { }

  get showGoogleMap() {
    return this.toggleMapSource.asObservable();
  }

  toggleMap(flag: boolean) {
    this.toggleMapSource.next(flag);
  }
}
