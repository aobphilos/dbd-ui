import { Store } from '../store';

export class StoreView extends Store {

  isFavorite: boolean;

  constructor() {
    super();
    this.isFavorite = false;
  }

}
