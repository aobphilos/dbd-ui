import { Component, OnInit } from '@angular/core';
import { LayoutService } from './layout.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  private toggleMapSource: boolean;
  get toggleMap() {
    return this.toggleMapSource;
  }

  constructor(private layoutService: LayoutService) { }

  ngOnInit() {
    this.layoutService.showGoogleMap.subscribe(flag => this.toggleMapSource = flag);
  }

}
