import { Component, OnInit } from '@angular/core';
import { SearchBarService } from '../../search-bar/search-bar.service';
import { SearchType } from '../../../enum/search-type';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(
    private serchBarService: SearchBarService
  ) { }

  ngOnInit() {
    this.serchBarService.setCriteria(SearchType.SHOP, '', false);
  }

}
