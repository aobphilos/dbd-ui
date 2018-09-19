import { ModelRelatedImageBase } from './model-base';

export class Promotion extends ModelRelatedImageBase {

  name: string;
  urlLink: string;
  period: string;

  constructor() {
    super();
    this.name = '';
    this.urlLink = '';
    this.period = '';
  }

}
