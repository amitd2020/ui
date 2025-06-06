import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'dg-employees-segments',
  templateUrl: './employees-segments.component.html',
  styleUrls: [ './employees-segments.component.scss' ]
})
export class EmployeesSegmentsComponent implements OnInit, OnChanges {
	
  @Input() employeesData: Array<any> = [];
  @Input() selectedFilter: Array<any> = [];

  tableAttribute: object = {
    scrollHeight: '25rem',
	chipGroupName: 'Number of Employees'
  }

  tableColumn: Array<any> = [];
  tableData: Array<any> = [];

  ngOnInit() {

	//? prepared column Array and column styles
	/** 
	 * ?showProgressBarWithPercentage ( true ) => show progress bar with the percentage count
	 * ?showProgressbar ( true ) => show only progress bar
	 * ?show count only don't need to send anything 
	 */

	this.tableColumn = [
		{ field: 'label', header: '', minWidth: '70px', maxWidth: 'none', textAlign: 'left', class: 'text-base' },
		{ field: 'count', header: "Company's Count", minWidth: '70px', maxWidth: '70px', textAlign: 'right', class: 'font-semibold' },
		{ field: 'count_percentage', header: 'Count %', minWidth: '90px', maxWidth: '90px', textAlign: 'right', showProgressBarWithPercentage: true, class: 'font-semibold' },
	]

	//? prepared data Array
	if ( this.employeesData && this.employeesData.length ) {
		this.preparedEmployeesData()
	}

  }

  ngOnChanges(changes: SimpleChanges) {
	if ( changes && changes?.employeesData && changes?.employeesData?.currentValue && changes?.employeesData?.currentValue.length ) {
		this.employeesData = changes.employeesData.currentValue;
		this.preparedEmployeesData();
	}
  }

  preparedEmployeesData() {
	this.tableData = this.employeesData.map( item => {
		item['count_percentage'] = item['count_percentage'].toFixed(1);
		return item;
	} )

	this.tableData = this.employeesData;

  }

}
