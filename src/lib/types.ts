import { EkoDataTableRowComponent } from './eko-data-table-row/eko-data-table-row.component';
import { EkoDataTableColumnDirective } from './directives/eko-data-table-column.directive';


export type RowCallback = (item: any, row: EkoDataTableRowComponent, index: number) => string;

export type CellCallback = (item: any, row: EkoDataTableRowComponent, column: EkoDataTableColumnDirective, index: number) => string;

// export type HeaderCallback = (column: EkoDataTableColumn) => string;


export interface EkoDataTableTranslations {
    indexColumn: string;
    selectColumn: string;
    expandColumn: string;
    paginationLimit: string;
    paginationRange: string;
}

export var defaultTranslations = <EkoDataTableTranslations>{
    indexColumn: 'İndex',
    selectColumn: 'Seç',
    expandColumn: 'Genişlet',
    paginationLimit: 'Limit',
    paginationRange: 'Sonuçlar'
};


export interface EkoDataTableParams {
    page?: number;
    //offset?: number;
    limit?: number;
    sortBy?: string;
    sortAsc?: boolean;
    filter?:string;
}
