export class BeSubject<T> {
  isInit: boolean;
  source: T;

  constructor(item: T = null, init: boolean = false) {
    this.isInit = init;
    this.source = item;
  }

}
