import { Store } from '../store';

export class MemberStoreView extends Store {

  isFavorite: boolean;

  constructor() {
    super();
    this.isFavorite = false;
  }

}
