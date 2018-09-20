import { ModelRelatedImageBase } from './model-base';

export class Product extends ModelRelatedImageBase {

  categoryName: string;
  name: string;
  price: number;

  constructor() {
    super();
    this.categoryName = '';
    this.name = '';
    this.price = 0;
  }
}
