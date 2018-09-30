export class QueryParams {

  constructor(
    public query: string = '',
    public isFavorite: boolean = false,
    public pageIndex: number = 0,
    public hitsPerPage: number = 10,
    public priceRange: string = ''
  ) {
    this.query = query;
    this.isFavorite = isFavorite;
    this.pageIndex = pageIndex;
    this.hitsPerPage = hitsPerPage;
    this.priceRange = priceRange;
  }

}
