import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterSecondBlockComponentOutputTypes, calenderDateRangeObject, calenderYearRangeObject } from '../filter-option-types';

@Component({
    selector: 'dg-date-range',
    templateUrl: 'date-range.component.html'
})

export class DateRangeComponent implements OnInit {

    private dateRangeSetter: calenderDateRangeObject = {
        fromMaxDate: null,
        fromMinDate: null,
        toMinDate: null,
        toMaxDate: null
    };

    @Input()
    set dateRange( inputDateRange: calenderDateRangeObject ) {
        this.dateRangeSetter.fromMaxDate = inputDateRange?.fromMaxDate ? new Date( inputDateRange?.fromMaxDate ) : null;
        this.dateRangeSetter.toMaxDate = inputDateRange?.toMaxDate ? new Date( inputDateRange?.toMaxDate ) : null;
        this.dateRangeSetter.fromMinDate = inputDateRange?.fromMinDate ? new Date( inputDateRange?.fromMinDate ) : null;
        this.dateRangeSetter.toMinDate = inputDateRange?.toMinDate ? new Date( inputDateRange?.toMinDate ) : null;
    }
    get dateRange(): calenderDateRangeObject {
        return this.dateRangeSetter;
    }

    @Input() yearRange: calenderYearRangeObject;
    @Output() OutputEmitter = new EventEmitter<FilterSecondBlockComponentOutputTypes>();

    selectionDaterange: { minDate: number | Date, maxDate: number | Date } = {
        minDate: null,
        maxDate: null
    }

	windowInnerHeight: number;
	touchUiBool: boolean = false;

    constructor() { }

    ngOnInit() { }

    setDateRange() {

        let chipVal = this.convertDate([ this.selectionDaterange.minDate, this.selectionDaterange.maxDate ]);
        let tempAray = [];
        tempAray = chipVal;
        let frmDate = chipVal[0];
        let todate = chipVal[1]
        let tempStr = 'From ' + frmDate.split('/').join('-') + ' to ' + todate.split('/').join('-');
        tempAray.push(tempStr);

        let outputObject = {};
        outputObject['chip_values'] = [ tempAray ];
        
        this.OutputEmitter.emit( outputObject );

        this.selectionDaterange = {
            minDate: null,
            maxDate: null
        }
    }

	convertDate(data) {
		let tempDate: Array<any> = [];
		for (let i = 0; i < data.length; i++) {
			var date = new Date(data[i]),
				mnth = ("0" + (date.getMonth() + 1)).slice(-2),
				day = ("0" + date.getDate()).slice(-2);

			tempDate.push([day, mnth, date.getFullYear()].join("/"));
		}
		return (tempDate);
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