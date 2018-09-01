import { ModelRelatedImageBase } from './model-base';

export class Promotion extends ModelRelatedImageBase {

  urlLink: string;

  constructor() {
    super();
    this.urlLink = '';
  }

}
