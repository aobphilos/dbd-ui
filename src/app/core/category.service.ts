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

  get currentItems(): Observable<string[]> {
    const catJson = sessionStorage.getItem(SessionType.CATEGORY);
    if (catJson) {
      console.log('load cat from session');
      return of(JSON.parse(catJson) as string[]);
    }

    console.log('user cats from server');
    return this.categories;
  }

  constructor(private http: HttpClient) {
    const catJson = sessionStorage.getItem(SessionType.CATEGORY);
    if (!catJson) {
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

    this.categories.subscribe(cats => {
      console.log('save cat in session');
      this.setCurrentItems(cats);
    });
  }

  private setCurrentItems(cats: string[]) {
    sessionStorage.setItem(SessionType.CATEGORY, JSON.stringify(cats));
  }

}
