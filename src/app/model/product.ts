import { ModelRelatedImageBase } from './model-base';

export class Product extends ModelRelatedImageBase {

  categoryName: string;
  price: number;

  constructor() {
    super();
    this.categoryName = '';
    this.price = 0;
  }
}
