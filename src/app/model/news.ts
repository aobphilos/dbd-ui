import { ModelRelatedImageBase } from './model-base';

export class News extends ModelRelatedImageBase {

  topic: string;
  moreDetailUrl: string;

  constructor() {
    super();
    this.topic = '';
  }
}
