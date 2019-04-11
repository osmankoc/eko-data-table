import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'px'
})
export class PxPipe implements PipeTransform {

  transform(value: string | number): any {
    if (value === undefined) {
        return;
    }
    if (typeof value === 'string') {
        return value;
    }
    if (typeof value === 'number') {
        return value + 'px';
    }
  }

}
