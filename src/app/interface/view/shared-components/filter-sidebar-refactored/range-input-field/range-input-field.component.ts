import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from 'primeng/api';
import { FilterSecondBlockComponentOutputTypes } from '../filter-option-types';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { lastValueFrom } from 'rxjs';
import { InputRangeType } from './range-input-type';
import { TitleCasePipe } from '@angular/common';

@Component({
	selector: 'dg-range-input-field',
	templateUrl: './range-input-field.component.html',
	styles: [ `
	           :host ::ng-deep {
						.p-dropdown .p-dropdown-label.p-placeholder {
							color: rgb(0, 0, 0, .77);
						}
			   }
			`]                
})

export class RangeInputFieldComponent implements OnInit {

    @Input() dropdownData: Array<{ label: string, value: string, inactive?: boolean, canBeNegative?: boolean }> = [];
	@Input()
	set rangeInputField( inputFieldRange ) {

		this.intializeMaxMinFilter( inputFieldRange );
	};
	@Input() mandaDropdowndata = [];

    @Output() OutputEmitter = new EventEmitter<FilterSecondBlockComponentOutputTypes>();
	inputSwitch: boolean = false;

	private inputFields: InputRangeType = {
		minFractionDigits: 0,
		maxFractionDigits: 0,
		minValue: 0,
		maxValue: null,
		mode: 'decimal',
		currencyCode: 'GBP',
		prefix: undefined,
		minPlaceholder: 'Greater Than',
		maxPlaceholder: 'Less Than',
		greater_than: null,
		less_than: null,
		addRowButton: false,
		deleteRowButton: false,
		errorMessage: {
			empty: '',
			gtLtValueCheck: ''
		},
		canBeNegative: false,
		dropdown: false

	};

	formControlsContainer: Array<any> = [];
	formsControlErrorMessage: Message[] = [];

	financialDropdownData: Object = {};
	inputItem: InputRangeType = {};
	numOfInputfield: 'multi' | 'single' = 'multi';

	checkEstimatedTurnover: boolean = false;
	checkDirAge: boolean = false;

	constructor (
		private _globalServerCommunicate: ServerCommunicationService,
		private titlecasePipe: TitleCasePipe
	) { }

	async ngOnInit() {

		this.financialDropdownData[ this.inputItem['key'] ] = [];

		if ( this.inputItem?.['dropdown'] && this.inputItem?.['key'] && this.inputItem['key'] == 'financials' ) {

			const financialData = await lastValueFrom( this._globalServerCommunicate.globalServerRequestCall( 'get', 'DG_API', 'financialKeys' ) );

			if ( financialData.body.status == 200 ) {
				this.financialDropdownData[ this.inputItem['key'] ] = financialData.body.results;
				this.resetForm();
			}

		} else if ( this.inputItem?.['dropdown'] &&  this.inputItem?.['key'] && ( ( this.inputItem['key'].includes( 'Growth' ) ) || ( this.inputItem['key'] == 'financialRatios' ) ) ) {

			const financialGrowthData = await lastValueFrom( this._globalServerCommunicate.globalServerRequestCall( 'get', 'DG_API', 'financialGrowthKeys' ) );
	
			if( financialGrowthData.body.status == 200 ) {
				this.financialDropdownData[ this.inputItem['key'] ] = financialGrowthData.body.results;
				this.financialDropdownData[ 'financialRatios' ] = financialGrowthData.body.ratioKeyResults;                   
				this.resetForm();
			}

		} else if ( this.inputItem?.['dropdown'] &&  this.inputItem?.['key'] && ( ( this.inputItem['key'].includes( 'propensity_score' ) ) ) && this.mandaDropdowndata ) {
			
			for (let data of this.mandaDropdowndata) {
				data['value'] = this.titlecasePipe.transform(data.key ) + '  '  + '( ' + data.minValue + ' - ' + data.maxValue + ' )';
			} 
			this.financialDropdownData[ this.inputItem['key'] ] = this.mandaDropdowndata;
			this.financialDropdownData[ 'financialRatios' ] = this.mandaDropdowndata;
			
			this.resetForm();
		}

	}

	setDirAgeToggle( ) {

		let selectedObject = JSON.parse( JSON.stringify( this.inputItem ) );

		if ( this.checkDirAge ) {
			this.numOfInputfield = 'single';
			selectedObject[ 'minPlaceholder' ] = 'Enter Age';
		} else {
			this.numOfInputfield = 'multi';
			selectedObject[ 'minPlaceholder' ] = 'Greater Than';
		}
		this.intializeMaxMinFilter( [ selectedObject ] );
	}

	intializeMaxMinFilter( selectedItemArray ) {

		this.formControlsContainer = [];
		this.checkEstimatedTurnover = false;

		for ( let itemObj of selectedItemArray ) {
			if ( itemObj?.numOfFinacialField ) {
				for ( let val of itemObj.numOfFinacialField ) {
					let finalObj = { ...(JSON.parse(JSON.stringify(this.inputFields))), ...itemObj  }
					this.formControlsContainer.push( { ...finalObj, ...val } );
				}
			} else {	
				this.formControlsContainer.push({ ...this.inputFields, ...itemObj });
			}

			if ( !itemObj?.dirAgeToggle ) {
				this.numOfInputfield = itemObj?.componentFeatures && itemObj.componentFeatures.includes( 'single-input' ) ? 'single' : 'multi';
			}
			this.inputItem = itemObj;
		}

	}

	compareGtLtValue(event: any, controlsObj: any, comparisonKey: string): boolean {

		if (controlsObj.key && event.value) {
			controlsObj.errorMessage.empty = '';
		}

		switch (comparisonKey) {
			case 'less_than':

				if ( this.inputItem['key'] == 'propensity_score' && this.inputItem?.minValue && event.value && ( event.value < this.inputItem?.minValue ) ) {
					controlsObj.errorMessage.gtLtValueCheck = `value must be greater than ${ this.inputItem?.minValue }`;
					return false;
				}

				if ( this.inputItem?.maxValue && event.value && ( event.value > this.inputItem?.maxValue ) ) {
					controlsObj.errorMessage.gtLtValueCheck = `Count should not exceed ${ this.inputItem?.maxValue }`;
					return false;
				}

				if ((controlsObj.less_than && event.value) && (controlsObj.less_than <= event.value)) {
					controlsObj.errorMessage.gtLtValueCheck = `'${ controlsObj['maxPlaceholder'] }' field value must be greater than ${event.value}.`;
					return false;
				}

				controlsObj.errorMessage.gtLtValueCheck = '';
				return true;

			case 'greater_than':

				if ( this.inputItem?.maxValue && event.value && ( event.value > this.inputItem?.maxValue ) ) {
					controlsObj.errorMessage.gtLtValueCheck = `Count should not exceed ${ this.inputItem?.maxValue }`;
					return false;
				}

				if (controlsObj.canBeNegative == false) {
					if ((((controlsObj.greater_than >= 0 && event.value == 0) || (controlsObj.greater_than && event.value)) && (event.value <= controlsObj.greater_than))) {
						controlsObj.errorMessage.gtLtValueCheck = `'${ controlsObj['maxPlaceholder'] }' field value must be greater than ${controlsObj.greater_than}.`;
						return false;
					}
					controlsObj.errorMessage.gtLtValueCheck = '';
					return true;
				} else {
					if ((((controlsObj.greater_than && event.value) || (controlsObj.greater_than >= 0 && event.value == 0)) && (event.value <= controlsObj.greater_than)) || controlsObj.greater_than == 0 && event.value <= 0) {
						controlsObj.errorMessage.gtLtValueCheck = `'${ controlsObj['maxPlaceholder'] }' field value must be greater than ${controlsObj.greater_than}.`;
						return false;
					}
					controlsObj.errorMessage.gtLtValueCheck = '';
					return true;
				}
			default:
				return true;
		}

	}

	updateInactivityForFinancialKeyDropdown( selectedObject? ) {
		if( selectedObject ){
			selectedObject.greater_than = null
			selectedObject.less_than = null
			selectedObject.errorMessage.gtLtValueCheck = ''
		} 

		if ( (  [ 'Financials', 'Advanced Key Financials' ].includes( this.inputItem['label'] ) && selectedObject?.key ) ) {
			if ( ['numberOfEmployees', 'numShareHolder'].includes( selectedObject.key ) ) {
				selectedObject['mode'] = 'decimal';
			} 
			else {
				selectedObject['mode'] = 'currency';
			}
		}

		const selectedFinancialKeys = [];

		for ( let item of this.formControlsContainer ) {
			selectedFinancialKeys.push( item.key );

			if ( item.key && ( item.greater_than || item.less_than ) ) {
				item.errorMessage.empty = '';
			}

			if ( this.inputItem['key'] != 'propensity_score' ) {
				for( let financialData of this.financialDropdownData[ this.inputItem['key'] ] ) {
					if( item.key == financialData.value ) {
						item['label'] = financialData.label;
					}
				}
			}
		}

		for ( let item of this.financialDropdownData[ this.inputItem['key'] ] ) {
			if( this.inputItem['key'] == 'propensity_score'){
				if(item.key == selectedObject?.key){
					selectedObject['maxValue'] = item.maxValue;
					selectedObject['minValue'] = item.minValue;
					this.inputItem['maxValue'] = item.maxValue;
					this.inputItem['minValue'] = item.minValue;
				}
				selectedObject['addRowButton'] = false;
			}
			if ( selectedObject?.key == ( item.value ) ){
				selectedObject['canBeNegative'] = item.canBeNegative;
			}
			if ( selectedFinancialKeys.includes( item.value ) ) {
				setTimeout(() => {
					item.inactive = true;
				}, 100);
			} else {
				item.inactive = false;
			}
		}

	}

	isValidate( formControls: Array<any> ): boolean {

		let isValid = true, count = 0, financialCount = 0;

		for ( let control of formControls ) {

			if ( !( this.compareGtLtValue( { value: control.less_than }, control, 'greater_than' ) ) ) {
				isValid = false;
				count++;
				return isValid;
			}

			if ( !( control.key && ( control.greater_than || control.less_than ) ) ) {
				count++;
				financialCount++;

				if ( ( financialCount !== this.formControlsContainer.length ) && control?.byPass ) {
					isValid = true;
				} else {
					isValid = false;
				}

			}
			
		}
		
		return isValid;
	}

	async returnFormValues() {

		if ( !( this.isValidate( this.formControlsContainer ) ) ) {
			// this.updateInactivityForFinancialKeyDropdown();

			this.formsControlErrorMessage = [];
			this.formsControlErrorMessage = [
				{ severity: 'error', summary: 'Error', detail: 'Please enter valid criteria!' }
			];
			setTimeout(() => {
				this.formsControlErrorMessage = [];
			}, 2000);
	
			return;
		}

		let inputItemArray = await this.removeUnNecessaryinputItem( this.formControlsContainer );

		let outputObject = {};

		if ( ( this.formControlsContainer[0]?.numOfFinacialField ) || ( this.financialDropdownData[ this.inputItem['key'] ].length ) ) {
			outputObject['chip_values'] = inputItemArray;

		} else {

			if ( this.inputItem?.['dirAgeToggle'] ) {

				if ( this.checkDirAge ) {
					outputObject['chip_values'] = [ inputItemArray[0].greater_than ];
				} else {
					outputObject['chip_values'] = [ [ inputItemArray[0].greater_than, inputItemArray[0].less_than ] ];
				}
				outputObject['exactAge'] = this.checkDirAge;

			} else if ( this.inputItem?.['label'] == 'Accounts Submission Overdue' ) {
				let monthStr = inputItemArray[0].greater_than + ' months';
				outputObject['chip_values'] = [ monthStr ];

			} else {

				outputObject['chip_values'] = [ [ inputItemArray[0].greater_than, inputItemArray[0].less_than ] ];

			}
			
		}

		this.OutputEmitter.emit( outputObject );

		if ( this.financialDropdownData[ this.inputItem['key'] ].length ) {
			this.resetForm();
		} else {
			this.intializeMaxMinFilter( [ this.inputItem ] );
		}

		if ( this.formControlsContainer.hasOwnProperty('label') ) {
			delete this.formControlsContainer[0].label;
		}

	}

	removeUnNecessaryinputItem( inputItemArray: Array<any> ) {
		let finalArray = [];
		inputItemArray?.filter( ( res, indx ) => {
			if ( ( res.less_than || res.greater_than ) ) {

				if ( indx && this.inputItem['andOrInputSwitch'] ) {
					res[ 'condition' ] = this.inputSwitch ? 'or' : 'and';
				} else {
					res[ 'condition' ] = '';
				}

				const { key, greater_than, less_than, condition } = res;

				finalArray.push( { key, greater_than, less_than, condition } );

				if ( res?.[ 'estimatedToggle' ] && this.checkEstimatedTurnover ) {
					finalArray.push( { key: 'estimated_turnover', greater_than, less_than, condition } );
				}

			}
		} )

		return finalArray;
	}

	addRow() {

		this.formControlsContainer.map(( item ) => {
			item.addRowButton = false;
			item.deleteRowButton = true;
		});

		this.formControlsContainer = [
			...this.formControlsContainer,
			{
				...this.inputFields,
				addRowButton: true,
				deleteRowButton: true,
				errorMessage: {
					empty: '',
					gtLtValueCheck: ''
				}
			}
		];
	}

	deleteRow( index: number, selectedObj? ) {

		this.formControlsContainer.splice( index, 1 );

		if ( this.formControlsContainer.length === 1 ) {
			let obj = this.formControlsContainer[0];
			obj.deleteRowButton = false;
		}
		
		this.formControlsContainer[ this.formControlsContainer.length -1 ].addRowButton = true;
		this.updateInactivityForFinancialKeyDropdown(selectedObj);
	}

	resetForm() {
		this.inputSwitch = false;
		this.checkEstimatedTurnover = false;
		this.inputFields = {
			minFractionDigits: this.inputItem['minFractionDigits'] ?? null,
			maxFractionDigits: this.inputItem['maxFractionDigits'] ?? null,
			minValue: 0,
			maxValue: null,
			mode: this.inputItem['mode'] ?? 'decimal',
			currencyCode: 'GBP',
			prefix: this.inputItem['prefix'] ?? '',
			minPlaceholder: 'Greater Than',
			maxPlaceholder: 'Less Than',
			greater_than: null,
			less_than: null,
			addRowButton: this.inputItem['key'].includes( 'propensity_score' ) ? false : true,
			deleteRowButton: false,
			errorMessage: {
				empty: '',
				gtLtValueCheck: ''
			},
			canBeNegative: false
		};
		this.formControlsContainer = [ { ...this.inputFields, key: '' } ];
		this.resetInactivityForFinancialKeyDropdown();
	}

	resetInactivityForFinancialKeyDropdown() {
		for ( let item of this.financialDropdownData[ this.inputItem['key'] ] ) {
			item.inactive = false;
		}
	}

}

