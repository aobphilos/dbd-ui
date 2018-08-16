import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  private notifyMessageSource = new BehaviorSubject<string>('');

  constructor() { }

  get notifyMessage() {
    return this.notifyMessageSource.asObservable();
  }

  setNotifyMessage(message: string) {
    this.notifyMessageSource.next(message);
  }
}
