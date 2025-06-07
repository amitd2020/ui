import { Component, Input, OnChanges, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FilterSecondBlockComponentOutputTypes } from '../../filter-sidebar-refactored/filter-option-types';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { MonthsEnum } from '../../../features-modules/search-company/search-company.constant';
import { InputRangeRecord } from '../../filter-sidebar-refactored/range-input-field/range-input.const';

@Component({
	selector: 'dg-display-filter-chip',
	templateUrl: './display-filter-chip.component.html'
})
export class DisplayFilterChipComponent implements OnInit, OnChanges {

	@Input() rawDataChips: FilterSecondBlockComponentOutputTypes[] = [];
	@Input() displayType: 'inline' | 'block' | 'styled' = 'styled';
	@Input() removableChips: boolean = false;

	@Output() OutputEmitter = new EventEmitter< { groupName: string, filterValues: FilterSecondBlockComponentOutputTypes[] } >();

	restructuredFilterItems: FilterSecondBlockComponentOutputTypes[] = [];
	MonthsEnum: any = MonthsEnum;
	selectedGlobalCurrency: string = 'GBP';

	constructor(
		private _commonService: CommonServiceService
	) { }

	ngOnInit() {
		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';
	}

	ngOnChanges( changes: SimpleChanges ) {
		const { rawDataChips } = changes;

		if ( rawDataChips && rawDataChips?.currentValue?.length ) {

			rawDataChips.currentValue = rawDataChips?.currentValue.filter( val => val );

			if ( rawDataChips?.currentValue.length ) {
				this.restructuredFilterItems = this.chipsReformatting( JSON.parse( JSON.stringify( this.rawDataChips ) ) );
			}
		}

	}

	chipsReformatting( inputArray: FilterSecondBlockComponentOutputTypes[] ) {

		for ( let filterDataValues of inputArray ) {
			let orgChipValues = JSON.parse( JSON.stringify( filterDataValues.chip_values ) );
			let modifiedChipValues = filterDataValues.chip_values;
			let itemConfig = InputRangeRecord[ filterDataValues.label == "M & A" ? filterDataValues.label : filterDataValues.chip_group ];
			let firstValue: number = null, secondValue: number = null, finalObject: Array< object > = [];
			let hasEstTurnover: boolean = false;

			if ( ( orgChipValues.length == 1 ) && !filterDataValues.chip_group.includes( 'Charge Month' ) && !filterDataValues.chip_group.includes( 'Charge Year' ) && ( typeof orgChipValues[0] == 'number' || filterDataValues.chip_group.includes( 'Month' ) || filterDataValues.chip_group.includes( 'Year' ) ) ) {
				filterDataValues[ 'chipValType' ] = 'number';
			}

			if ( orgChipValues.length && Array.isArray( orgChipValues[0] ) ) {
				orgChipValues = orgChipValues[0];
				modifiedChipValues = modifiedChipValues[0];
			}

			if ( ( typeof orgChipValues?.[2] == "string" ) && orgChipValues?.[2]?.includes( 'From' ) ) {
				modifiedChipValues = [ orgChipValues[2] ];
			}

			if ( ( orgChipValues.length == 2 ) && ( orgChipValues.some( item => item && typeof item == 'number' ) || filterDataValues.chip_group.includes( 'Month' ) || filterDataValues.chip_group.includes( 'Year' )  ) && ( filterDataValues.chip_group != 'Competition Year' ) && !filterDataValues.chip_group.includes( 'Charge Month' )  && !filterDataValues.chip_group.includes( 'Charge Year' ) ) {
				firstValue = +modifiedChipValues[0];
				secondValue = +modifiedChipValues[1];

				if ( firstValue && !( secondValue ) ) {
					finalObject = [ { firstValue } ];
				}
				if ( secondValue && !( firstValue ) ) {
					finalObject = [ { secondValue } ];
				}
				if ( firstValue && secondValue ) {
					finalObject = [ { firstValue, secondValue } ];
				}

				modifiedChipValues = finalObject;	
			}
			if( filterDataValues.chip_group.includes( 'Month' ) && filterDataValues.chip_group.includes( 'Charge Month' ) ) {
				let result = filterDataValues.chip_values.map(x => parseInt(x, 10));
				const months = result.map(val => MonthsEnum[val]);
				modifiedChipValues = months;
			}

			if(filterDataValues.chip_group.includes( 'Year' ) && filterDataValues.chip_group.includes( 'Charge Year' ) ) {
				modifiedChipValues = filterDataValues.chip_values;
			}

			if ( orgChipValues.length && ( orgChipValues.some( item => item && typeof item == 'object' ) ) ) {
				for ( let dataObj of orgChipValues ) {
					finalObject.push({
						key: dataObj['key'],
						dataLabel: this._commonService.camelCaseToTitleCaseStr( dataObj['key'] ),
						firstValue: dataObj['greater_than'],
						secondValue: dataObj['less_than'],
						condition: dataObj['condition']
					});
				}

				if ( itemConfig ) {
					finalObject = finalObject.map( finObj => {
						if ( (( ['Key Financials', 'Account Revenue'].includes( filterDataValues.chip_group ) ) && ( finObj['key'] == 'estimated_turnover' ))  || (filterDataValues.chip_group == "Turnover" && ( finObj['key'] == 'estimated_turnover' )) ) {
							finObj['dataLabel'] = 'Turnover (Including Estimated Turnover)';
							hasEstTurnover = true;
						}

						if ( finObj['key'] == 'numberOfEmployees' ) {
							return { ...finObj };
						}

						return { ...finObj, ...itemConfig };
					});
	
					if ( hasEstTurnover ) {
						finalObject = finalObject.filter( finObj => finObj['key'] !== 'turnover' );
					}
				}

				modifiedChipValues = finalObject;

			}			

			filterDataValues.chip_values = modifiedChipValues;

		}

		return inputArray;

	}

	removeFilterChipHandler( filterLabel: string, chipIndex?: number ) {
		if ( chipIndex || chipIndex == 0 ) {
			return this.removeFilterChipValue( filterLabel, chipIndex );
		} else {
			this.removeFilterChipGroup( filterLabel );
		}
	}

	removeFilterChipValue( chipGroupName: string, chipIndex: number ) {
		const filteredPropValues = this.rawDataChips.filter( item => item.chip_group == chipGroupName )[0];

		if ( filteredPropValues.chip_group == 'Key Financials' && filteredPropValues.chip_values?.[ chipIndex + 1 ]?.key == 'estimated_turnover' ) {
			filteredPropValues.chip_values.splice( ( chipIndex + 1 ), 1 );
		}
		
		filteredPropValues.chip_values.splice( chipIndex, 1 );

		if ( filteredPropValues?.preferenceOperator ) {
			filteredPropValues.preferenceOperator.splice( chipIndex, 1 );
		}

		if ( filteredPropValues?.chip_industry_sic_codes ) {
			filteredPropValues.chip_industry_sic_codes.splice( chipIndex, 1 );
		}

		this.rawDataChips = this.rawDataChips.filter( item => item.chip_values.length !== 0 );

		this.OutputEmitter.emit( { groupName: chipGroupName, filterValues: this.rawDataChips } );
	}

	removeFilterChipGroup( chipGroupName: string ) {
		this.rawDataChips = this.rawDataChips.filter( item => item.chip_group !== chipGroupName );
		this.rawDataChips = this.rawDataChips.filter( item => item.chip_values.length !== 0 );
		
		this.OutputEmitter.emit( { groupName: chipGroupName, filterValues: this.rawDataChips } );
	}

}
