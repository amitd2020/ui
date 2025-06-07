import { Component, EventEmitter, Output } from '@angular/core';
import { FilterSecondBlockComponentOutputTypes, calenderYearRangeObject } from '../filter-option-types';

@Component({
  selector: 'dg-year-range',
  templateUrl: './year-range.component.html',
  styleUrls: ['./year-range.component.scss']
})
export class YearRangeComponent {
		
	windowInnerHeight: number;
	touchUiBool: boolean = false;
	maxSelectableDate: Date = new Date();
  
	yearRange: { minYear: Date, maxYear: Date } = {
		minYear: null,
		maxYear: null
	};
	
	@Output() OutputEmitter = new EventEmitter<FilterSecondBlockComponentOutputTypes>();

	selectYear() {
		let tempArray = this.modifyDate( this.yearRange.minYear, this.yearRange.maxYear );
		
		let outputObject = {};
		outputObject['chip_values'] = [ tempArray ];
		this.OutputEmitter.emit( outputObject );

		this.yearRange = {
			minYear: null,
			maxYear: null
		};
	}

	modifyDate( minYear, maxYear ) {
		return [ String( minYear.getFullYear() ), String( maxYear.getFullYear() ) ];
	}

	onResizeForCalender(){
		this.windowInnerHeight = window.innerHeight;

		if ( this.windowInnerHeight < 769 ) {
			this.touchUiBool = true;
		} else {
			this.touchUiBool = false;
		}
    }

}
