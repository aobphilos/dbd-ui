import { SortDirection } from '../enum/sort-direction';

export class SearchCriteria {

  constructor(
    public keyword: string = '',
    public skip: number = 0,
    public take = 10,
    public sort: string = 'updatedDate',
    public direction: SortDirection = SortDirection.Ascending) {

  }

}
