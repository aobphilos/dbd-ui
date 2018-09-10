import { ModelRelatedImageBase } from './model-base';

export class Promotion extends ModelRelatedImageBase {

  urlLink: string;
  period: string;

  constructor() {
    super();
    this.urlLink = '';
    this.period = '';
  }

}
