import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';

@Component({
  selector: 'dg-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss']
})
export class TableViewComponent {

  @Input() tableColumn: Array<any> = [];
  @Input() tableData: Array<any> = [];
  @Input() selectedFilter: Array<any> = [];
  @Input() headerName: string = '';
  @Input() headerData: any;
  @Input() additionalAttributForTable: object = {
    scrollHeight: '32vh'
  };
  @Output() updateTableAfterPagination = new EventEmitter<any>();
  
  listId: string;
  inputPageName: string;
  listName: string;

  constructor(
    private toNumberSuffix: NumberSuffixPipe,
    private router: Router,
    public activeRoute: ActivatedRoute
  ) {}

  ngOnInit(){

    this.listId = this.activeRoute?.snapshot?.queryParams['cListId'] != undefined ? this.activeRoute?.snapshot?.queryParams['cListId'] : '';
		this.inputPageName = this.activeRoute?.snapshot?.queryParams['listPageName'] ? this.activeRoute?.snapshot?.queryParams['listPageName'] : '';
		this.listName = this.activeRoute?.snapshot?.queryParams['listName'] ? this.activeRoute?.snapshot?.queryParams['listName'] : '';

  }
  gotToSearchPage( rowData ){

    if( this.additionalAttributForTable['chipGroupName'] == 'Number of Employees' ) {

      this.selectedFilter = this.selectedFilter.filter(val => val.chip_group != this.additionalAttributForTable['chipGroupName'])

      let chipValues = rowData.value.rangeTo == 'not specified' ? [[ rowData.value.rangeTo ]] : [[ +rowData.value.rangeFrom, +rowData.value.rangeTo ]] 

      this.selectedFilter.push({chip_group: this.additionalAttributForTable['chipGroupName'], chip_values: chipValues})

    } else if( this.additionalAttributForTable['key'] == 'turnover' ) {

      this.selectedFilter = this.selectedFilter.filter(val => val.chip_group != this.additionalAttributForTable['chipGroupName'])

      let chipValues = [ { key: this.additionalAttributForTable['key'], greater_than: rowData.value.greaterThan ? rowData.value.greaterThan : undefined, less_than: rowData.value.lessThan ? rowData.value.lessThan : undefined, condition: '' }] 
     
      this.selectedFilter.push({chip_group: this.additionalAttributForTable['chipGroupName'], chip_values: chipValues})

    } else {

      this.selectedFilter = this.selectedFilter.filter(val => val.chip_group != this.additionalAttributForTable['chipGroupName'])

      this.selectedFilter.push({chip_group: this.additionalAttributForTable['chipGroupName'], chip_values: [rowData.label.toLowerCase()]})
      
    }
    let urlStr: string;

    urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(this.selectedFilter), cListId: this.listId, listPageName: this.inputPageName, listName: this.listName} }));

    window.open( urlStr, '_blank' );
  }

  tableClick(rowData, ){

    let clickValue = {
      value: rowData.key,
      key: this.headerName,
      data: rowData,
      header: this.headerName == 'top10Buyer' ? 'TOP 10 BUYERS' : this.headerData.header
    }
    this.updateTableAfterPagination.emit(clickValue);

  }
}
