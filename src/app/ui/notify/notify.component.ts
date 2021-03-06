import { Component, OnInit } from '@angular/core';
import { NotifyService } from './notify.service';
import { Notify } from '../../model/notify';
import { NotifyType } from '../../enum/notify-type';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent implements OnInit {

  notify: Notify;

  constructor(private notifyService: NotifyService) {
    this.notify = new Notify();
  }

  get notifyAnime() {
    return this.showNotify ? 'show' : 'hide';
  }

  get message() {
    return this.notify && this.notify.message ? this.notify.message : '';
  }

  get showNotify() {
    return this.notify && this.notify.message !== '';
  }

  get isInfo() {
    return this.notify && this.notify.type === NotifyType.INFO;
  }

  get isWarning() {
    return this.notify && this.notify.type === NotifyType.WARNING;
  }

  get isSuccess() {
    return this.notify && this.notify.type === NotifyType.SUCCESS;
  }

  onAlertDismiss() {
    this.notifyService.clear();
  }

  ngOnInit() {
    this.notifyService.message.subscribe(notify => this.notify = notify);
  }

}
