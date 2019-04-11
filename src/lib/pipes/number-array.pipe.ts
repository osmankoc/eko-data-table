import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberarray'
})
export class NumberArrayPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let res: number[] = [];
    for (let i = 1; i <= value; i++) {
        res.push(i);
      }
      return res;
  }

}
