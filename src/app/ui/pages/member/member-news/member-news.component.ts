import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { NewsService } from '../../../../core/news.service';



@Component({
  selector: 'app-member-news',
  templateUrl: './member-news.component.html',
  styleUrls: ['./member-news.component.scss']
})
export class MemberNewsComponent implements OnInit {

  @Input() ownerId: Observable<string>;

  constructor(
    private newsService: NewsService
  ) { }

  get newsItems() {
    return this.newsService.currentItems;
  }

  ngOnInit() {
    this.ownerId.subscribe(id => {
      if (id) {
        this.newsService.loadCurrentItems(id);
      }
    });
  }

}
