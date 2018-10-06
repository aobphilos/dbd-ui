import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SessionType } from '../enum/session-type';
import { Observable, of } from 'rxjs';
import { Province } from '../model/location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private configUrl = 'assets/data/location.json';
  private locations: Observable<Province[]>;

  private get sessionLocation() {
    return JSON.parse(sessionStorage.getItem(SessionType.LOCATION)) as Province[];
  }

  get currentItems(): Observable<Province[]> {
    const items = this.sessionLocation;
    return (items) ? of(items) : this.locations;
  }

  constructor(private http: HttpClient) {
    if (!this.sessionLocation) {
      this.initLocation();
    }
  }

  private initLocation() {
    this.locations = this.http.get(this.configUrl)
      .pipe(
        map(response => {
          if (response) {
            return response['data'] as Province[];
          } else {
            return [];
          }
        })
      );

    this.locations.subscribe(items => {
      if (items && items.length > 0) {
        this.setCurrentItems(items);
      }
    });
  }

  private setCurrentItems(items: Province[]) {
    sessionStorage.setItem(SessionType.LOCATION, JSON.stringify(items));
  }

}
