import { Component, OnInit } from '@angular/core';
import { NotifyService } from './notify.service';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent implements OnInit {
  notifyMessage: string;

  constructor(private notifyService: NotifyService) {
    this.notifyMessage = '';
  }
  get showNotify() {
    return this.notifyMessage !== '';
  }

  onAlertDismiss() {
    this.notifyService.setNotifyMessage('');
  }

  ngOnInit() {

    this.notifyService.notifyMessage.subscribe(msg => this.notifyMessage = msg);
  }

}
