import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private toggleMapSource = new BehaviorSubject<boolean>(true);
  showGoogleMap = this.toggleMapSource.asObservable();


  constructor() { }
  toggleMap(flag: boolean) {
    this.toggleMapSource.next(flag);
  }
}
