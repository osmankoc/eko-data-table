import { Pipe, PipeTransform, Inject, forwardRef } from '@angular/core';
import { EkoDataTableParams } from '../types'
import { EkoDataTableComponent } from '../eko-data-table.component';


@Pipe({
  name: 'paging'
})
export class PagingPipe implements PipeTransform {

  constructor(@Inject(forwardRef(() => EkoDataTableComponent)) public dataTable: EkoDataTableComponent) {}


  transform(items: any[], params: EkoDataTableParams): any {


    if (params.filter){
  items =  items.filter(item => Object.keys(item).some(k => item[k] != null &&
    item[k].toString().toLowerCase()
      .includes(params.filter.toLowerCase())));
  }
  this.dataTable.itemCount = items.length;
    if (params.sortBy) {
        items.sort((a, b) => {
            if (typeof a[params.sortBy] === 'string') {
                return a[params.sortBy].localeCompare(b[params.sortBy]);
            } else {
                return a[params.sortBy] - b[params.sortBy];
            }
        });
        if (params.sortAsc === false) {
            items.reverse();
        }
    }

    

    if (params.page !== undefined) {
      let offset = (params.page - 1) * params.limit;
        if (params.limit === undefined) {
            items = items.slice(offset, items.length);
        } else {
            items = items.slice(offset, offset + params.limit);
        }
    }
    return items;

  }

}
