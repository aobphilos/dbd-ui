import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatRemoveAt'
})
export class FormatRemoveAtPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value ? value.substr(0, value.indexOf('@')) : '';
  }

}
