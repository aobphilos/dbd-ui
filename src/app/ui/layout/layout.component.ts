import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../core/layout.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  toggleMap: boolean;

  constructor(private layoutService: LayoutService) { }

  ngOnInit() {
    this.layoutService.showGoogleMap.subscribe(flag => this.toggleMap = flag);
  }

}
