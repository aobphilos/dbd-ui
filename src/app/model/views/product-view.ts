import { Product } from '../product';

export class ProductView extends Product {

  isFavorite: boolean;

  constructor() {
    super();
    this.isFavorite = false;
  }
}
