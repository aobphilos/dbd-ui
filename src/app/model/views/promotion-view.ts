import { Promotion } from '../promotion';

export class PromotionView extends Promotion {

  isFavorite: boolean;

  constructor() {
    super();
    this.isFavorite = false;
  }

}
