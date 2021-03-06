import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notify } from '../../model/notify';
import { NotifyType } from '../../enum/notify-type';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  private notifyMessageSource = new BehaviorSubject<Notify>(new Notify());

  constructor() { }

  get message() {
    return this.notifyMessageSource.asObservable();
  }

  clear() {
    this.notifyMessageSource.next(new Notify());
  }

  setInfoMessage(message: string) {
    this.setMessage(message, NotifyType.INFO);
  }

  setWarningMessage(message: string) {
    this.setMessage(message, NotifyType.WARNING);
  }

  setSuccessMessage(message: string) {
    this.setMessage(message, NotifyType.SUCCESS);
  }

  private setMessage(message: string, type: NotifyType = NotifyType.INFO) {
    this.notifyMessageSource.next({ message: message, type: type });

    setTimeout(() => this.clear(), (type !== NotifyType.WARNING) ? 2500 : 4500);

  }
}
