import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SessionType } from '../enum/session-type';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private configUrl = 'assets/data/category.json';
  private categories: Observable<string[]>;

  private get sessionCategory() {
    return JSON.parse(sessionStorage.getItem(SessionType.CATEGORY)) as string[];
  }

  get currentItems(): Observable<string[]> {
    const items = this.sessionCategory;
    return (items) ? of(items) : this.categories;
  }

  constructor(private http: HttpClient) {
    if (!this.sessionCategory) {
      this.initCategory();
    }
  }

  private initCategory() {
    this.categories = this.http.get(this.configUrl)
      .pipe(
        map(response => {
          if (response) {
            return response['data'] as string[];
          } else {
            return [];
          }
        })
      );

    this.categories.subscribe(items => {
      this.setCurrentItems(items);
    });
  }

  private setCurrentItems(items: string[]) {
    sessionStorage.setItem(SessionType.CATEGORY, JSON.stringify(items));
  }

}
