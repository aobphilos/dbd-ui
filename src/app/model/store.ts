import { ModelRelatedImageBase } from './model-base';

export class Store extends ModelRelatedImageBase {

  storeDescription: string;

  constructor() {
    super();
    this.storeDescription = '';
  }

}
