import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { EkoDataTableComponent } from '../eko-data-table.component';


@Component({
  selector: 'eko-data-table-header',
  templateUrl: './eko-data-table-header.component.html',
  styleUrls: ['./eko-data-table-header.component.css'],
  host: {
    '(document:click)': '_closeSelector()'
  }
})
export class EkoDataTableHeaderComponent implements OnInit {

  columnSelectorOpen = false;

  _closeSelector() {
      this.columnSelectorOpen = false;
  }

  constructor(@Inject(forwardRef(() => EkoDataTableComponent)) public dataTable: EkoDataTableComponent) {}

  
  filterChanged($event){
   this.dataTable.rowfilter =  $event;
  }

  toggle(){
    debugger;
    this.columnSelectorOpen = true;
  }

  ngOnInit() {
  }

}
