import {  Component, Input, Output, EventEmitter, ContentChildren, QueryList,
  TemplateRef, ContentChild, ViewChildren, OnInit } from '@angular/core';

import { EkoDataTableColumnDirective } from './directives/eko-data-table-column.directive';
import { EkoDataTableRowComponent } from './eko-data-table-row/eko-data-table-row.component';
import { EkoDataTableParams, RowCallback, EkoDataTableTranslations, defaultTranslations } from './types';
import { drag } from './utils/drag';

@Component({
  selector: 'eko-data-table',
  template: `
  <div class="data-table-wrapper">
  <eko-data-table-header *ngIf="header"></eko-data-table-header>
  <div class="data-table-box">
      <table class="table table-condensed table-bordered data-table">
          <thead>
              <tr>
                  <th [ekohide]="!expandColumnVisible" class="expand-column-header">
                  <th [ekohide]="!indexColumnVisible" class="index-column-header">
                      <span [textContent]="indexColumnHeader"></span>
                  </th>
                  <th [ekohide]="!selectColumnVisible" class="select-column-header">
                      <input [ekohide]="!multiSelect" type="checkbox" [(ngModel)]="selectAllCheckbox"/>
                  </th>
                  <th *ngFor="let column of columns" #th [ekohide]="!column.visible" (click)="headerClicked(column, $event)"
                      [class.sortable]="column.sortable" [class.resizable]="column.resizable"
                      [ngClass]="column.styleClassObject" class="column-header" [style.width]="column.width | px">
                      <span *ngIf="!column.headerTemplate" [textContent]="column.header"></span>
                      <span *ngIf="column.headerTemplate" [ngTemplateOutlet]="column.headerTemplate" [ngTemplateOutletContext]="{column: column}"></span>
                      <span class="column-sort-icon" *ngIf="column.sortable">
                          <i class="fa fa-arrows-v column-sortable-icon" [ekohide]="column.property === sortBy"></i>
                          <span [ekohide]="column.property !== sortBy">
                              <i class="fa fa-caret-up" [ekohide]="sortAsc"></i>
                              <i class="fa fa-caret-down" [ekohide]="!sortAsc"></i>
                          </span>
                      </span>
                      <span *ngIf="column.resizable" class="column-resize-handle" (mousedown)="resizeColumnStart($event, column, th)"></span>
                  </th>
              </tr>
          </thead>
          <tbody *ngFor="let item of items | paging: _displayParams; let index=index" class="data-table-row-wrapper"
                 ekoDataTableRow #row [item]="item" [index]="index" (selectedChange)="onRowSelectChanged(row)">
          </tbody>
          <tbody class="substitute-rows" *ngIf="pagination && substituteRows">
              <tr *ngFor="let item of substituteItems, let index = index"
                  [class.row-odd]="(index + items.length) % 2 === 0"
                  [class.row-even]="(index + items.length) % 2 === 1"
                  >
                  <td [ekohide]="!expandColumnVisible"></td>
                  <td [ekohide]="!indexColumnVisible">&nbsp;</td>
                  <td [ekohide]="!selectColumnVisible"></td>
                  <td *ngFor="let column of columns" [ekohide]="!column.visible">
              </tr>
          </tbody>
      </table>
      <div class="loading-cover" *ngIf="showReloading && reloading"></div>
  </div>

  <eko-data-table-pagination *ngIf="pagination"></eko-data-table-pagination>
</div>
  `,
  styleUrls: ['./eko-data-table-component.css']
})
export class EkoDataTableComponent implements EkoDataTableParams, OnInit {

  private _items: any[] = [];

  @Input() get items() {
      return this._items;
  }

  set items(items: any[]) {
      this._items = items;
      this._onReloadFinished();
  }

  @Input() itemCount: number;

  // UI components:

  @ContentChildren(EkoDataTableColumnDirective) columns: QueryList<EkoDataTableColumnDirective>;
  @ViewChildren(EkoDataTableRowComponent) rows: QueryList<EkoDataTableRowComponent>;
  @ContentChild('dataTableExpand') expandTemplate: TemplateRef<any>;

  // One-time optional bindings with default values:

  @Input() headerTitle: string;
  @Input() header = true;
  @Input() pagination = true;
  @Input() indexColumn = false;
  @Input() indexColumnHeader = '';
  @Input() rowColors: RowCallback;
  @Input() rowTooltip: RowCallback;
  @Input() selectColumn = false;
  @Input() multiSelect = true;
  @Input() substituteRows = false;
  @Input() expandableRows = false;
  @Input() translations: EkoDataTableTranslations = defaultTranslations;
  @Input() selectOnRowClick = false;
  @Input() autoReload = true;
  @Input() showReloading = false;
  @Input() showReloadButton = false;
  @Input() showColumnSelector = false;
  

  // UI state without input:

  indexColumnVisible: boolean;
  selectColumnVisible: boolean;
  expandColumnVisible: boolean;


  // UI state: visible ge/set for the outside with @Input for one-time initial values

  private _sortBy: string;
  private _sortAsc = true;

  //private _offset = 0;
  private _page = 1;
  private _limit = 10;
  private _rowfilter="";

  @Input()
  get sortBy() {
      return this._sortBy;
  }

  set sortBy(value) {
      this._sortBy = value;
      this._triggerReload();
  }

  @Input()
  get sortAsc() {
      return this._sortAsc;
  }

  set sortAsc(value) {
      this._sortAsc = value;
      this._triggerReload();
  }
/*
  @Input()
  get offset() {
      return this._offset;
  }

  set offset(value) {
      this._offset = value;
      this._triggerReload();
  }
*/
  @Input()
  get limit() {
      return this._limit;
  }

  set limit(value) {
      this._limit = value;
      this._triggerReload();
  }

  @Input()
  get rowfilter() {
      return this._rowfilter;
  }

  set rowfilter(value) {
      this._rowfilter = value;
      this._triggerReload();
  }
  // calculated property:

  @Input()
  get page() {
      return this._page;
      //return Math.floor(this.offset / this.limit) + 1;
  }

  set page(value) {
      //this.offset = (value - 1) * this.limit;
      this._page = value;
      this._triggerReload();
  }

  get lastPage() {
      return Math.ceil(this.itemCount / this.limit);
  }

  get offset(){
      return (this.page - 1) * this.limit;
  }
  // setting multiple observable properties simultaneously

  sort(sortBy: string, asc: boolean) {
      this.sortBy = sortBy;
      this.sortAsc = asc;
  }

  // init

  ngOnInit() {
      this._initDefaultValues();
      this._initDefaultClickEvents();
      this._updateDisplayParams();

      if (this.autoReload && this._scheduledReload == null) {
          this.reloadItems();
      }
  }

  private _initDefaultValues() {
      this.indexColumnVisible = this.indexColumn;
      this.selectColumnVisible = this.selectColumn;
      this.expandColumnVisible = this.expandableRows;
  }

  private _initDefaultClickEvents() {
      this.headerClick.subscribe(tableEvent => this.sortColumn(tableEvent.column));
      if (this.selectOnRowClick) {
          this.rowClick.subscribe(tableEvent => tableEvent.row.selected = !tableEvent.row.selected);
      }
  }

  // Reloading:

  _reloading = false;

  get reloading() {
      return this._reloading;
  }

  @Output() reload = new EventEmitter();

  reloadItems() {
      this._reloading = true;
      this.reload.emit(this._getRemoteParameters());
  }

  private _onReloadFinished() {
      this._updateDisplayParams();

      this._selectAllCheckbox = false;
      this._reloading = false;
  }

  _displayParams = <EkoDataTableParams>{}; // params of the last finished reload

  get displayParams() {
      return this._displayParams;
  }

  _updateDisplayParams() {
      this._displayParams = {
          sortBy: this.sortBy,
          sortAsc: this.sortAsc,
          //offset: this.offset,
          page: this.page,
          limit: this.limit,
          filter: this.rowfilter
      };
  }

  _scheduledReload = null;

  // for avoiding cascading reloads if multiple params are set at once:
  _triggerReload() {
      this._updateDisplayParams();
      /*
      if (this._scheduledReload) {
          clearTimeout(this._scheduledReload);
      }
      this._scheduledReload = setTimeout(() => {
          this.reloadItems();
      });
      */
  }

  // event handlers:

  @Output() rowClick = new EventEmitter();
  @Output() rowDoubleClick = new EventEmitter();
  @Output() headerClick = new EventEmitter();
  @Output() cellClick = new EventEmitter();

  rowClicked(row: EkoDataTableRowComponent, event) {
      this.rowClick.emit({ row, event });
  }

  rowDoubleClicked(row: EkoDataTableRowComponent, event) {
      this.rowDoubleClick.emit({ row, event });
  }

  headerClicked(column: EkoDataTableColumnDirective, event: MouseEvent) {
      if (!this._resizeInProgress) {
          this.headerClick.emit({ column, event });
      } else {
          this._resizeInProgress = false; // this is because I can't prevent click from mousup of the drag end
      }
  }

  cellClicked(column: EkoDataTableColumnDirective, row: EkoDataTableRowComponent, event: MouseEvent) {
      this.cellClick.emit({ row, column, event });
  }

  // functions:

  private _getRemoteParameters(): EkoDataTableParams {
      let params = <EkoDataTableParams>{};
      if (this.sortBy) {
          params.sortBy = this.sortBy;
          params.sortAsc = this.sortAsc;
      }
      if (this.pagination) {
          //params.offset = this.offset;
          params.page = this.page;
          params.limit = this.limit;
      }
      return params;
  }

  private sortColumn(column: EkoDataTableColumnDirective) {
      if (column.sortable) {
          let ascending = this.sortBy === column.property ? !this.sortAsc : true;
          this.sort(column.property, ascending);
      }
  }

  get columnCount() {
      let count = 0;
      count += this.indexColumnVisible ? 1 : 0;
      count += this.selectColumnVisible ? 1 : 0;
      count += this.expandColumnVisible ? 1 : 0;
      this.columns.toArray().forEach(column => {
          count += column.visible ? 1 : 0;
      });
      return count;
  }

  getRowColor(item: any, index: number, row: EkoDataTableRowComponent) {
      if (this.rowColors !== undefined) {
          return (<RowCallback>this.rowColors)(item, row, index);
      }
  }

  // selection:

  selectedRow: EkoDataTableRowComponent;
  selectedRows: EkoDataTableRowComponent[] = [];

  private _selectAllCheckbox = false;

  get selectAllCheckbox() {
      return this._selectAllCheckbox;
  }

  set selectAllCheckbox(value) {
      this._selectAllCheckbox = value;
      this._onSelectAllChanged(value);
  }

  private _onSelectAllChanged(value: boolean) {
      this.rows.toArray().forEach(row => row.selected = value);
  }

  onRowSelectChanged(row: EkoDataTableRowComponent) {

      // maintain the selectedRow(s) view
      if (this.multiSelect) {
          let index = this.selectedRows.indexOf(row);
          if (row.selected && index < 0) {
              this.selectedRows.push(row);
          } else if (!row.selected && index >= 0) {
              this.selectedRows.splice(index, 1);
          }
      } else {
          if (row.selected) {
              this.selectedRow = row;
          } else if (this.selectedRow === row) {
              this.selectedRow = undefined;
          }
      }

      // unselect all other rows:
      if (row.selected && !this.multiSelect) {
          this.rows.toArray().filter(row_ => row_.selected).forEach(row_ => {
              if (row_ !== row) { // avoid endless loop
                  row_.selected = false;
              }
          });
      }
  }

  // other:

  get substituteItems() {
      return Array.from({ length: this.displayParams.limit - this.items.length });
  }

  // column resizing:

  private _resizeInProgress = false;

  public resizeColumnStart(event: MouseEvent, column: EkoDataTableColumnDirective, columnElement: HTMLElement) {
      this._resizeInProgress = true;

      drag(event, {
          move: (moveEvent: MouseEvent, dx: number) => {
              if (this._isResizeInLimit(columnElement, dx)) {
                  column.width = columnElement.offsetWidth + dx;
              }
          },
      });
  }

  resizeLimit = 30;

  private _isResizeInLimit(columnElement: HTMLElement, dx: number) {
      /* This is needed because CSS min-width didn't work on table-layout: fixed.
       Without the limits, resizing can make the next column disappear completely,
       and even increase the table width. The current implementation suffers from the fact,
       that offsetWidth sometimes contains out-of-date values. */
      if ((dx < 0 && (columnElement.offsetWidth + dx) <= this.resizeLimit) ||
          !columnElement.nextElementSibling || // resizing doesn't make sense for the last visible column
          (dx >= 0 && ((<HTMLElement> columnElement.nextElementSibling).offsetWidth + dx) <= this.resizeLimit)) {
          return false;
      }
      return true;
  }

}
