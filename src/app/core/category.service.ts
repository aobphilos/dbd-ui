import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SessionType } from '../enum/session-type';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private configUrl = 'assets/data/category.json';
  private categories: string[];

  get currentItems() {
    if (this.categories && this.categories.length > 0) {
      return this.categories;
    }

    return JSON.parse(sessionStorage.getItem(SessionType.CATEGORY)) as string[];
  }

  private setCurrentItems(value: string[]) {
    sessionStorage.setItem(SessionType.CATEGORY, JSON.stringify(value));
    this.categories.splice(0, this.categories.length, ...value);
  }

  constructor(private http: HttpClient) {
    this.categories = [];
    this.initCategory();
  }

  private initCategory() {
    this.http.get(this.configUrl)
      .pipe(
        map(response => {
          if (response) {
            return response['data'] as string[];
          } else {
            return [];
          }
        })
      )
      .subscribe(cats => {
        this.setCurrentItems(cats);
      });
  }

}
