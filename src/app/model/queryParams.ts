import { MemberType } from '../enum/member-type';
import { ILocationSelected } from './interfaces/location-selected';

export class QueryParams {

  public categoryName = '';
  public priceRange = '';

  public memberType: MemberType = MemberType.NONE;
  public location: ILocationSelected;

  constructor(
    public query: string = '',
    public isFavorite: boolean = false,
    public pageIndex: number = 0,
    public hitsPerPage: number = 10
  ) {
    this.query = query;
    this.isFavorite = isFavorite;
    this.pageIndex = pageIndex;
    this.hitsPerPage = hitsPerPage;
  }

}
