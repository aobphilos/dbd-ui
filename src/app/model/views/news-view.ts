import { News } from '../news';

export class NewsView extends News {

  isFavorite: boolean;

  constructor() {
    super();
    this.isFavorite = false;
  }
}
