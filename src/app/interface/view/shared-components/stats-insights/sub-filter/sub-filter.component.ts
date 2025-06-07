import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { ActivatedRoute } from '@angular/router';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { SimilarCompanyService } from './similar-company.services';

@Component({
	selector: 'dg-sub-filter',
	templateUrl: './sub-filter.component.html',
	styleUrls: ['./sub-filter.component.scss']
})
export class SubFilterComponent implements OnInit, OnChanges {

	@Input() viewCompanyHandler = [];
	@Input() statsCriteriaValues;
	@Input() industryListData = [];
	@Input() regionListData = [];
	@Input() hitStatsAPI = true;
	@Output() outputPayload = new EventEmitter<any>();

	companyAge: Object = {
		greaterThan: undefined,
		LessThan: undefined
	}

	placeholder: Array<string> = [ 'Greater Than', 'Less Than'];
	timeout: any = null;

	selctionOfFiltersObj: object = {};
	payloadForSimilarCompaniesArray: Array<Object> = [];

	selectedIndustries: Array<{ label: string, value: string }> = [];
	selectedRegions: Array<string> = [];
	
	statsChartDataValue: any;
	queryParamChipData: FilterDataTypes[] = [];
	listId: string;
	listName: string;
	inputPageName: string = '';
	userId: string | unknown;

	constructor(
		public toNumberSuffix: NumberSuffixPipe,
		private globalServerCommunication: ServerCommunicationService,
		public activeRoute: ActivatedRoute,
        public userAuthService: UserAuthService,
		public similarCompanyService: SimilarCompanyService
	) { }

	ngOnChanges(changes: SimpleChanges) {
		this.viewCompanyHandler = this.viewCompanyHandler;
	}

	ngOnInit() {
		this.queryParamChipData = this.activeRoute?.snapshot?.queryParams?.['chipData'] ? JSON.parse( this.activeRoute?.snapshot?.queryParams?.['chipData'] ) : [];
		this.listId = this.activeRoute?.snapshot?.queryParams['cListId'] != undefined ? this.activeRoute?.snapshot?.queryParams['cListId'] : '';
		this.inputPageName = this.activeRoute?.snapshot?.queryParams['listPageName'] ? this.activeRoute?.snapshot?.queryParams['listPageName'] : '';
		this.listName = this.activeRoute?.snapshot?.queryParams['listName'] ? this.activeRoute?.snapshot?.queryParams['listName'] : '';
		this.userId = this.userAuthService?.getUserInfo('dbID')

		if ( this.hitStatsAPI ) {
			this.fetchStatstsetData();
		}
	}

	fetchStatstsetData( dissolvedIndex?: boolean, startPlan?: boolean, pageSize?: number, startAfter?: number, sortOn?: any[], filterSearchArray?: any[] ) {

		let obj = {
			
			'filterData': [ ...this.queryParamChipData ],
			'pageSize': pageSize ? pageSize : 25,
			'startAfter': startAfter ? startAfter : 0,
			'sortOn': sortOn ? sortOn : [],
			'filterSearchArray': filterSearchArray ? filterSearchArray : [],
			dissolvedIndex: dissolvedIndex ? dissolvedIndex : false,
			'startPlan': startPlan ? startPlan : false,
			'listId': this.listId,
			'pageName': this.inputPageName,
			'userId': this.userId != undefined ? this.userId : ""
		}

		this.globalServerCommunication.globalServerRequestCall('post', 'DG_CHART_API', 'getStatsData', obj ).subscribe(res => {
			if ( res.body.status == 200 ) {

				this.statsChartDataValue = res.body.result;

				/*..>>>>>>.Mentioned Keys --> Handle by backened code ..<<<<<<<.*/
				let estimatedTurnoversArrayData = this.statsChartDataValue?.financialTurnoversArrayData;
				let turnoverGrowth3Years = this.statsChartDataValue?.turnoverGrowth3YearsInfo;
				let netWorthGrowth3Years = this.statsChartDataValue?.netWorthGrowth3YearsInfo;
				let tradeDebtorsGrowth3Years = this.statsChartDataValue?.tradeDebtorsGrowth3YearsInfo;
				let employeesRangeArrayData = this.statsChartDataValue?.noOfEmployeesArray;
				let encorporationDate = this.statsChartDataValue?.companyIncorporationInfo;
				/*..>>>>>>END HERE..<<<<<<<.*/

				// let riskProfile = this.mappingTwoArrays( this.riskProfile, this.statsChartDataValue?.riskChartArray, 'field', 'riskProfile' );

				let regionListData = this.statsChartDataValue.region?.map( val => {
					val['label'] = val['month'];
					val['field'] = val['month'];
					return val;
				});
				

				this.viewCompanyHandler = [
					{ header: 'Region', items: regionListData, selectionMode: 'multi', ngModelChck: [], chipGrp: 'Region', styleClass: 'col-3', selectAll: false },
					// { header: 'SIC Codes', items: this.industryListData, selectionMode: 'multi', ngModelChck: [], chipGrp: 'SIC Codes', styleClass: 'col-3' },
					{ header: 'Industry Tags', items: this.statsChartDataValue.standard_industry_tag, selectionMode: 'multi', ngModelChck: [], chipGrp: 'Industry', styleClass: 'col-3', selectAll: false },
					{ header: 'Companies By Age', items: encorporationDate, selectionMode: 'single', ngModelChck: {}, chipGrp: 'Company Age Filter', styleClass: 'col-3', rangeInput: { rangeFrom: undefined, rangeTo: undefined }, rangeType: [ 'rangeFrom', 'rangeTo' ] },

					{ header: 'Number Of Employees', items: employeesRangeArrayData, selectionMode: 'single', ngModelChck: {}, chipGrp: 'Number of Employees', styleClass: 'col-3', rangeInput: { rangeFrom: undefined, rangeTo: undefined }, rangeType: [ 'rangeFrom', 'rangeTo' ] },

					// { header: 'Credit Risk Bands', items: this.riskProfile, selectionMode: 'multi', ngModelChck: [], chipGrp: 'Bands', styleClass: 'col-3' },
					
					{ header: 'Turnover (£)', items: estimatedTurnoversArrayData, selectionMode: 'single', ngModelChck: {}, chipGrp: 'Key Financials', styleClass: 'col-3', rangeInput: { greaterThan: undefined, lessThan: undefined }, rangeType: [ 'greaterThan', 'lessThan' ] },
					{ header: 'Turnover Growth 3 Years', items: turnoverGrowth3Years, selectionMode: 'single', ngModelChck: {}, chipGrp: '3 Years Growth', growthKey: 'turnover', styleClass: 'col-3', rangeInput: { greaterThan: undefined, lessThan: undefined }, rangeType: [ 'greaterThan', 'lessThan' ] },
					{ header: 'Net Worth Growth 3 Years', items: netWorthGrowth3Years, selectionMode: 'single', ngModelChck: {}, chipGrp: '3 Years Growth', growthKey: 'net_worth', styleClass: 'col-3', rangeInput: { greaterThan: undefined, lessThan: undefined }, rangeType: [ 'greaterThan', 'lessThan' ] },
					{ header: 'Trade Debtors Growth 3 Years', items: tradeDebtorsGrowth3Years, selectionMode: 'single', ngModelChck: {}, chipGrp: '3 Years Growth', growthKey: 'trade_debtors', styleClass: 'col-3', rangeInput: { greaterThan: undefined, lessThan: undefined }, rangeType: [ 'greaterThan', 'lessThan' ] }
				];

					// Sorting all of the the items on percentage for View Similar Companies.
					for ( let { items } of this.viewCompanyHandler ) {
						items = items?.sort( ( a, b ) => b?.count_percentage - a?.count_percentage );
					}
					// Sorting all of the the items on percentage....End.
			}

		} )

	}

	selectedRadioButton( chipGroup: string, selectValues:any, growthKey?: string, industryTag?: string, filterItem?: any, selectedGroupItem?: any ) {

		if (selectedGroupItem) {
			selectedGroupItem.selectAll = selectedGroupItem.items?.length === selectValues.length;
		}
		
		if ( growthKey ) {

			this.selctionOfFiltersObj[ chipGroup ] = this.selctionOfFiltersObj[ chipGroup ]?.filter( ( val: any ) => val.key !== growthKey ) || [];

			this.selctionOfFiltersObj[ chipGroup ].push({
				key: growthKey,
				greater_than: selectValues?.['greaterThan'] ? selectValues?.['greaterThan'] : undefined,
				less_than: selectValues?.['lessThan'] ? selectValues?.['lessThan'] : undefined,
				suffix: '%'
			});

		} else {

			// if ( chipGroup == 'Industry' ) {

			// 	if ( !selectValues.includes( industryTag ) || !( this.selctionOfFiltersObj.hasOwnProperty( chipGroup ) ) ) {
			// 		let removeSelectedItems = this.selctionOfFiltersObj[ chipGroup ]?.filter( val => ![ industryTag ].includes( val ) ) || [];

			// 		this.selctionOfFiltersObj[ chipGroup ] = this.selctionOfFiltersObj[ chipGroup ] ? removeSelectedItems : selectValues;
			// 	}

			// 	this.selctionOfFiltersObj[ chipGroup ] = [...new Set([ ...this.selctionOfFiltersObj[ chipGroup ], ...selectValues]) ];

			// } else {

				this.selctionOfFiltersObj[ chipGroup ] = selectValues;

			// }
		}

		if ( filterItem && filterItem?.['rangeInput'] ) {
			for ( let key in filterItem.rangeInput ) {
				filterItem.rangeInput[ key ] = undefined;
			}
		}

		this.payloadFormation();
	}

	payloadFormation() {
		this.payloadForSimilarCompaniesArray = [];
		let chipDataValueTo, chipDataValueFrom;

		for (let from in this.selctionOfFiltersObj ) {

			if ( Array.isArray( this.selctionOfFiltersObj[ from ] ) && !this.selctionOfFiltersObj[ from ].length ) {
				delete  this.selctionOfFiltersObj[ from ];
				continue;
			}

			chipDataValueTo = [ 'Company Age Filter', 'Number of Employees' ].includes( from ) ? this.selctionOfFiltersObj[ from ]?.[ 'rangeFrom' ] : this.selctionOfFiltersObj[ from ]?.[ 'greaterThan' ];
			chipDataValueFrom = [ 'Company Age Filter', 'Number of Employees' ].includes( from ) ? this.selctionOfFiltersObj[ from ]?.[ 'rangeTo' ] : this.selctionOfFiltersObj[ from ]?.[ 'lessThan' ];

			let outputValuesObjectStore = {
				Key_Financials: {
					chip_group: from,
					chip_values: [{
						key: 'turnover',
						greater_than: chipDataValueTo ? chipDataValueTo : undefined,
						less_than: chipDataValueFrom ? chipDataValueFrom : undefined,
						financialBoolean: true,
						selected_year: "true"
					}]
				},
				Years_Growth: {
					chip_group: from,
					chip_values: this.selctionOfFiltersObj[ from ]
				},
				Number_of_Employees: {
					chip_group: from,
					chip_values: chipDataValueFrom == "not specified" ? [[chipDataValueFrom]] : [[ +chipDataValueTo, +chipDataValueFrom ]],
				},
				Company_Age_Filter: {
					chip_group: from,
					chip_values: chipDataValueTo == "not specified" ? [[chipDataValueTo]] : [[ +chipDataValueTo, +chipDataValueFrom ]]
				}
			};

			let storeKey = from.replace(/[0-9]\s/g, '').replace(/\s/g, '_');

			storeKey = +from[0] <= 1 ? storeKey.replace('Year', 'Years') : storeKey;

			if ( Object.keys( outputValuesObjectStore ).includes( storeKey ) ) {
				this.payloadForSimilarCompaniesArray.push( outputValuesObjectStore[ storeKey ] );
			} else {

				let chipGrpAndValues = { chip_group: from, chip_values: this.selctionOfFiltersObj[ from ] };

				if ( from === 'SIC Codes' ) {
					chipGrpAndValues[ 'chip_industry_sic_codes' ] = this.selctionOfFiltersObj[ from ].map( val => val.value );
					chipGrpAndValues[ 'chip_values' ] = this.selctionOfFiltersObj[ from ].map( val => val.label );
				}
				
				this.payloadForSimilarCompaniesArray.push( chipGrpAndValues );
			}

		}

		this.outputPayload.emit( this.payloadForSimilarCompaniesArray );

	}

	removeChipOfFilter( removeFilterItem, selectedItem?: any ) {
		
		const { chipGrp, chipItem, index } = removeFilterItem;

		if ( selectedItem?.['selectAll'] ) {
			selectedItem['selectAll'] = false;
		}

		if ( chipGrp ) {

			if ( !Array.isArray( this.selctionOfFiltersObj[ chipGrp ] ) ) {
				
				for ( let optionItem of this.viewCompanyHandler ) {
					if ( optionItem.chipGrp == chipGrp ) {
						optionItem.ngModelChck = [];
						delete this.selctionOfFiltersObj[ chipGrp ];
						break;
					}
				}
	
			} else {

				if ( chipGrp == 'Region' ) {

					this.selctionOfFiltersObj[ chipGrp ].splice( index, 1 );
					this.selectedRegions = this.selctionOfFiltersObj[ chipGrp ];
					
				} else if ( chipGrp == 'SIC Codes' ) {

					this.selctionOfFiltersObj[ chipGrp ].splice( index, 1 );
					this.selectedIndustries.splice( index, 1 );

				} else {
					for ( let optionItem of this.viewCompanyHandler ) {
						if ( optionItem.chipGrp == chipGrp ) {
							optionItem.ngModelChck = [];
							this.selctionOfFiltersObj[ chipGrp ].splice( index, 1 );
							setTimeout(() => {
								optionItem.ngModelChck = this.selctionOfFiltersObj[ chipGrp ];
							}, 0);
							break;
						}
					}
				}
				
			}

		} else {

			for ( let optItem of this.viewCompanyHandler ) {

				if ( optItem.chipGrp == chipItem[ 'chip_group' ] && !optItem?.growthKey && ( chipItem[ 'chip_group' ] !== 'Industry' ) ) {

					optItem.ngModelChck = Array.isArray( optItem.ngModelChck ) ? [] : {};

				}

				if ( (optItem?.rangeInput) && optItem.header == chipItem['header'] ) {
					for ( let key in optItem.rangeInput ) {
						optItem.rangeInput[ key ] = undefined;
					}
				}

				if ( ( chipItem[ 'chip_group' ] == 'Industry' ) ) {

					if ( optItem.header == chipItem['header'] ) {
						if( this.selctionOfFiltersObj[ chipItem[ 'chip_group' ] ] ){
							this.selctionOfFiltersObj[ chipItem[ 'chip_group' ] ] = this.selctionOfFiltersObj[ chipItem[ 'chip_group' ] ].filter( val => !(optItem.ngModelChck).includes( val ) );
						}
						optItem.ngModelChck = Array.isArray( optItem.ngModelChck ) ? [] : {};
					}

					continue;

				}

				if ( optItem?.growthKey && optItem.growthKey == chipItem?.[ 'growthKey' ] ) {
					optItem.ngModelChck = {};
				}

			}

			if ( chipItem[ 'growthKey' ] && this.selctionOfFiltersObj[ chipItem[ 'chip_group' ] ] ) {
				this.selctionOfFiltersObj[ chipItem[ 'chip_group' ] ] = this.selctionOfFiltersObj[ chipItem[ 'chip_group' ] ].filter( val => val.key !== chipItem[ 'growthKey' ] );
				
				if ( !this.selctionOfFiltersObj[ chipItem[ 'chip_group' ] ]?.length ) {
					delete this.selctionOfFiltersObj[ chipItem[ 'chip_group' ] ];
				}

			} else {
				if ( chipItem[ 'chip_group' ] !== 'Industry' ) {
					delete this.selctionOfFiltersObj[ chipItem[ 'chip_group' ] ];
				}
			}

		}

		this.payloadFormation();
	}

	inputFieldEntry( event, subFilter, key ) {

		let rangeObj = JSON.parse(JSON.stringify( subFilter.rangeInput ));
		// let subFilterDuplct = JSON.parse(JSON.stringify( subFilter ));
		rangeObj[key] =  event.value;
		
		clearTimeout( this.timeout );
		
		this.timeout = setTimeout(() => {

			if ( ( typeof Object.values( rangeObj )[0] == 'number' ) || ( typeof Object.values( rangeObj )[1] == 'number' ) ) {
				
				subFilter.ngModelChck = {};
	
				this.selectedRadioButton( subFilter.chipGrp, rangeObj, subFilter?.growthKey  );
	
			} else {
				delete  this.selctionOfFiltersObj[ subFilter.chipGrp ];
				this.payloadFormation();
			}

		}, 300 )

	}

	returnZero() {
		return 0;
	}

	navigateToFilteredCompanySearch() {
		this.similarCompanyService.navigateToFilteredCompanySearch( this.payloadForSimilarCompaniesArray, this.queryParamChipData, this.inputPageName, this.listId, this.listName )
	}
	navigateToSimilarCompanySearch() {
		this.similarCompanyService.navigateToSimilarCompanySearch( this.payloadForSimilarCompaniesArray );
	}

	selectedAllButton( selectedItem ) {

		const { selectAll, items } = selectedItem;

		if ( selectAll ) {
			selectedItem['ngModelChck'] = [];

			for ( let chckBxObj of items ) {
				selectedItem['ngModelChck'].push( selectedItem.header == 'SIC Codes' ? chckBxObj : chckBxObj.field )
			}

			this.selectedRadioButton(  selectedItem.chipGrp, selectedItem.ngModelChck, undefined, undefined, undefined, selectedItem )
		} else {
			selectedItem['ngModelChck'] = [];
			this.selectedRadioButton(  selectedItem.chipGrp, selectedItem.ngModelChck, undefined, undefined, undefined, selectedItem )
		}
	}

}
