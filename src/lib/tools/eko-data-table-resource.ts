import { EkoDataTableParams } from '../types';

export class EkoDataTableResource<T> {

    constructor(private items: T[]) {}

    query(params: EkoDataTableParams, filter?: (item: T, index: number, items: T[]) => boolean): Promise<T[]> {

        let result: T[] = [];
        if (filter) {
            result = this.items.filter(filter);
        } else {
            if(params.filter){
                  //result = this.searchfiler.transform(this.items, params.filter);
                  if (!this.items)
                        result = [];
                        else
                            result = this.items.filter(item => Object.keys(item).some(k => item[k] != null &&
      item[k].toString().toLowerCase()
        .includes(params.filter.toLowerCase())));
            }else{
            result = this.items.slice(); // shallow copy to use for sorting instead of changing the original
            }
        }

        if (params.sortBy) {
            result.sort((a, b) => {
                if (typeof a[params.sortBy] === 'string') {
                    return a[params.sortBy].localeCompare(b[params.sortBy]);
                } else {
                    return a[params.sortBy] - b[params.sortBy];
                }
            });
            if (params.sortAsc === false) {
                result.reverse();
            }
        }
        if (params.page !== undefined) {
            let offset = (params.page - 1)*params.limit;
            if (params.limit === undefined) {
                result = result.slice(offset, result.length);
            } else {
                result = result.slice(offset, offset + params.limit);
            }
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(result));
        });
    }

    count(): Promise<number> {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(this.items.length));
        });

    }
}
