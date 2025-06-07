import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { FilterSecondBlockComponentOutputTypes } from '../../filter-sidebar-refactored/filter-option-types.d';
import { MonthsEnum } from '../../../features-modules/search-company/search-company.constant';

@Component({
	selector: 'dg-display-style-filter-chip',
	templateUrl: './display-style-filter-chip.component.html',
	styleUrls: ['./display-style-filter-chip.component.scss']
})
export class DisplayStyleFilterChipComponent implements OnInit {

	@Input() selectedPropValues: FilterSecondBlockComponentOutputTypes[] = [];
	@Input() tempSimplifiedFinancialChipArray: any;
	@Input() directorAgeCondition: any;
	@Input() thisPage: string;
	@Input() companyNameNumBool: false;
	@Input() excludeObj: any;

	@Output() OutputEmitter = new EventEmitter< { groupName: string, filterValues: FilterSecondBlockComponentOutputTypes[] } >();

	monthsEnum: any = MonthsEnum;
	selectedGlobalCurrency: string = 'GBP';

	constructor(
		private decimalPipe: DecimalPipe,
		private titlecase: TitleCasePipe,
		public commonService: CommonServiceService
	) { }

	ngOnInit() {
		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';
	}

	removeFilterChipValue( chipGroupName: string, chipValue: any ) {
		const filteredPropValues = this.selectedPropValues.filter( item => item.chip_group == chipGroupName )[0];
		const chipValueIndex = filteredPropValues.chip_values.indexOf( chipValue );

		filteredPropValues.chip_values = filteredPropValues.chip_values.filter( chip => chip !== chipValue );

		if ( filteredPropValues?.preferenceOperator ) {
			filteredPropValues.preferenceOperator.splice( chipValueIndex, 1 );
		}

		if ( filteredPropValues?.chip_industry_sic_codes ) {
			filteredPropValues.chip_industry_sic_codes.splice( chipValueIndex, 1 );
		}

		this.selectedPropValues = this.selectedPropValues.filter( item => item.chip_values.length !== 0 );

		this.OutputEmitter.emit( { groupName: chipGroupName, filterValues: this.selectedPropValues } );
	}

	removeFilterChipGroup( chipGroupName: string ) {
		this.selectedPropValues = this.selectedPropValues.filter( item => item.chip_group !== chipGroupName );
		this.selectedPropValues = this.selectedPropValues.filter( item => item.chip_values.length !== 0 );
		
		this.OutputEmitter.emit( { groupName: chipGroupName, filterValues: this.selectedPropValues } );
	}

	/*
	removeFilterItemFromFilterSideBar(chipItem, chipGrp, index?) {
		this.removeFilterItem.emit( { chipItem, chipGrp, index } );
	}
	*/

	furloughDataFormat(str){
        if (str) {
            let strArray = str.split(" ")
            strArray[0] = this.decimalPipe.transform( parseFloat(strArray[0]) )
            strArray[1] = this.titlecase.transform( strArray[1] )
            strArray[2] = this.decimalPipe.transform( parseFloat(strArray[2]) )
            str = strArray.join("  ")
            return str
        } else {
            return str
        }
    }

}
