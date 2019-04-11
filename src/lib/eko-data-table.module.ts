import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { EkoDataTableComponent } from './eko-data-table.component';
import { EkoDataTableColumnDirective } from './directives/eko-data-table-column.directive';
import { EkoDataTableRowComponent } from './eko-data-table-row/eko-data-table-row.component';
import { EkoDataTableHeaderComponent } from './eko-data-table-header/eko-data-table-header.component';
import { EkoDataTablePaginationComponent } from './eko-data-table-pagination/eko-data-table-pagination.component';


import { Hide } from './directives/hide.directive';
import { PxPipe } from './pipes/px.pipe';
import { MinPipe } from './pipes/min.pipe';
import { PagingPipe } from './pipes/paging.pipe';
import {NumberArrayPipe} from './pipes/number-array.pipe'



export * from './types';
export * from './tools/eko-data-table-resource';

export { EkoDataTableComponent, EkoDataTableColumnDirective, EkoDataTableRowComponent, EkoDataTablePaginationComponent, EkoDataTableHeaderComponent };
export const DATA_TABLE_DIRECTIVES = [ EkoDataTableComponent, EkoDataTableColumnDirective ];



@NgModule({
   declarations: [
      EkoDataTableComponent,
      EkoDataTableColumnDirective,
      EkoDataTableRowComponent,
      EkoDataTableHeaderComponent,
      EkoDataTablePaginationComponent,
      Hide, PxPipe, MinPipe, PagingPipe, NumberArrayPipe
   ],
   imports: [CommonModule, FormsModule, BrowserModule],
   exports: [
      EkoDataTableComponent, EkoDataTableColumnDirective
   ]
})
export class EkoDataTableModule { }
