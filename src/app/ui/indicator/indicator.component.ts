import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IndicatorService } from './indicator.service';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss']
})
export class IndicatorComponent implements OnInit {
  private modalRef: NgbModalRef;

  @ViewChild('indicator') private indicatorTemplate: TemplateRef<any>;

  constructor(private modalService: NgbModal,
    private indicatorService: IndicatorService
  ) { }

  openModalCentered(content) {
    this.modalRef = this.modalService.open(content, {
      windowClass: 'modal-indicator',
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'sm'
    });
  }

  ngOnInit() {

    this.indicatorService.busyIndicator.subscribe(flag => {
      if (flag) {
        this.openModalCentered(this.indicatorTemplate);
      } else {
        if (this.modalRef) {
          this.modalRef.close();
        }
      }
    });
  }

}
