import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  @Input() @Output() isActive: boolean;
  @Output() changed = new EventEmitter<boolean>();

  constructor() { }

  toggleFavorite() {
    this.isActive = !this.isActive;
    this.changed.emit(this.isActive);
  }

  ngOnInit() {
  }

}
