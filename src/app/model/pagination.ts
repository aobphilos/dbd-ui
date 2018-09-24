export class Pagination<T> {
  totalHits: number;
  currentPageIndex: number;
  hits: T[];

  constructor(items: T[] = null, total: number = 0, pageIndex: number = 0) {
    this.currentPageIndex = pageIndex;
    this.totalHits = total;
    this.hits = items;
  }

}
