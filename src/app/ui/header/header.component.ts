import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public isCollapsed = true;

  model: {
    username: string,
    password: string
    checkedDate: Date
  };

  constructor(
    private modalService: NgbModal) {
    this.resetModel();
  }
  private resetModel() {
    this.model = {
      username: '',
      password: '',
      checkedDate: new Date()
    };
  }
  setCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }

  openModal(content) {
    this.modalService
      .open(content, {
        windowClass: 'modal-signin',
        backdrop: 'static'
      })
      .result.then((result) => {
      }, (reason) => {
      });
  }

  ngOnInit() {
  }


}
