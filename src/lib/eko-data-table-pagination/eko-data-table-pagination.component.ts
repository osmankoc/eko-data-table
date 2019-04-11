import { Component, Inject, forwardRef } from '@angular/core';
import { EkoDataTableComponent } from '../eko-data-table.component';

@Component({
  selector: 'eko-data-table-pagination',
  templateUrl: './eko-data-table-pagination.component.html',
  styleUrls: ['./eko-data-table-pagination.component.css']
})
export class EkoDataTablePaginationComponent {

  constructor(@Inject(forwardRef(() => EkoDataTableComponent)) public dataTable: EkoDataTableComponent) {}

  pageBack() {
      //this.dataTable.offset -= Math.min(this.dataTable.limit, this.dataTable.offset);
      let pg = this.dataTable.page ;
      pg--;
      this.dataTable.page = pg <=0 ? 1 : pg;
  }

  pageForward() {
      //this.dataTable.offset += this.dataTable.limit;
      let pg = this.dataTable.page ;
      pg++;
      this.dataTable.page = pg >this.maxPage ? this.maxPage : pg;
  }

  pageFirst() {
      //this.dataTable.offset = 0;
      this.dataTable.page = 1;
  }

  pageLast() {
      //this.dataTable.offset = (this.maxPage - 1) * this.dataTable.limit;
      this.dataTable.page = this.maxPage;
  }

  get maxPage() {
      return Math.ceil(this.dataTable.itemCount / this.dataTable.limit);
  }

  get limit() {
      return this.dataTable.limit;
  }

  set limit(value) {
      
    this.dataTable.limit =  Number(<any>value); // TODO better way to handle that value of number <input> is string?
      if(this.page > this.maxPage)
      this.page = this.maxPage;
      
  }

  get page() {
      return this.dataTable.page;
  }

  set page(value) {
      this.dataTable.page = Number(<any>value);
  }
}
