import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Message } from 'primeng/api';
interface FinancialFormInterface {
    mode: string
    fractionDigits: number
    andOrInputSwitch: boolean
    dropDownData: Array<any>
	suffix: string
}
@Component({
    selector: 'dg-financial-type-form',
    templateUrl: './financial-type-form.component.html'
})

export class FinancialTypeFormComponent implements FinancialFormInterface, OnChanges {

	@Input() mode: "currency" | "decimal" = 'decimal';
	@Input() fractionDigits = 0;
    @Input() andOrInputSwitch = false;
    @Input() dropDownData: Array<{ label: string, value: string, inactive?: boolean, canBeNegative?: boolean }> = [];
	@Input() suffix = undefined;
	@Input() selectedPropGroup: string;

	@Output() returnValueForFinancialTypeForm = new EventEmitter<any>();

	inputSwitch: boolean = false;
	formsControlErrorMessage: Message[] = [];

	private formControlsObject = {
		key: '',
		mode: this.mode,
		greater_than: null,
		less_than: null,
		addRowButton: false,
		deleteRowButton: false,
		errorMessage: {
			empty: '',
			gtLtValueCheck: ''
		},
		canBeNegative: false
	};

	formControlsContainer: Array<any> = [
		{ ...this.formControlsObject, addRowButton: true }
	];

    constructor() { }	

    ngOnChanges( changes: SimpleChanges ) {
		this.formsControlErrorMessage = [];
		this.resetForm();
	}

	updateInactivityForFinancialKeyDropdown( selectedObject? ) {
		if( selectedObject ){
			selectedObject.greater_than = null
			selectedObject.less_than = null
			selectedObject.errorMessage.gtLtValueCheck = ''
		} 

		if ( ( this.selectedPropGroup == 'Advanced Key Financials' && selectedObject?.key ) ) {
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

		}

		for ( let item of this.dropDownData ) {
			if ( selectedObject?.key == ( item.value ) ){
				selectedObject['canBeNegative'] = item.canBeNegative;
			}
			if ( selectedFinancialKeys.includes( item.value ) ) {
				item.inactive = true;
			} else {
				item.inactive = false;
			}
		}

	}

	resetInactivityForFinancialKeyDropdown() {
		for ( let item of this.dropDownData ) {
			item.inactive = false;
		}
	}

	addRow() {

		this.formControlsContainer.map(( item ) => {
			item.addRowButton = false;
			item.deleteRowButton = true;
		});

		this.formControlsContainer = [
			...this.formControlsContainer,
			{
				...this.formControlsObject,
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
		this.formControlsObject = {
			key: '',
			mode: this.mode,
			greater_than: null,
			less_than: null,
			addRowButton: false,
			deleteRowButton: false,
			errorMessage: {
				empty: '',
				gtLtValueCheck: ''
			},
			canBeNegative: false
		};
		this.formControlsContainer = [ { ...this.formControlsObject, addRowButton: true } ];
		this.resetInactivityForFinancialKeyDropdown();
	}

	compareGtLtValue( event: any, controlsObj: any, comparisonKey: string ): boolean {

		if ( controlsObj.key && event.value ) {
			controlsObj.errorMessage.empty = '';
		}

		switch ( comparisonKey ) {
			case 'less_than':
		
				if ( ( controlsObj.less_than && event.value ) && ( controlsObj.less_than <= event.value ) ) {
					controlsObj.errorMessage.gtLtValueCheck = `'Less Than' field value must be greater than ${ event.value }.`;
					return false;
				}

				controlsObj.errorMessage.gtLtValueCheck = '';
				return true;

			case 'greater_than':
		
			if ( controlsObj.canBeNegative == false){
				if ( (( (controlsObj.greater_than >= 0 && event.value == 0) || (controlsObj.greater_than && event.value) ) && ( event.value <= controlsObj.greater_than ) ) ) {
					controlsObj.errorMessage.gtLtValueCheck = `'Less Than' field value must be greater than ${ controlsObj.greater_than }.`;
					return false;
				}
				controlsObj.errorMessage.gtLtValueCheck = '';
				return true;
			} else {
				if ( (( (controlsObj.greater_than && event.value) || (controlsObj.greater_than >= 0 && event.value == 0 )) && ( event.value <= controlsObj.greater_than )) || controlsObj.greater_than == 0 &&  event.value <= 0 ) {
					controlsObj.errorMessage.gtLtValueCheck = `'Less Than' field value must be greater than ${ controlsObj.greater_than }.`;
					return false;
				}
				controlsObj.errorMessage.gtLtValueCheck = '';
				return true;
			}
			default:
				return true;
		}

	}

	isValidate( formControls: Array<any> ): boolean {

		let isValid = true, count = 0;

		for ( let control of formControls ) {

			if ( !( this.compareGtLtValue( { value: control.less_than }, control, 'greater_than' ) ) ) {
				isValid = false;
				count++;
			}

			if ( !( control.key && ( control.greater_than || control.less_than ) ) ) {
				isValid = false;
				control.errorMessage.empty = 'Please enter all financial criteria!';
				count++;
			}

			if ( count == 0 ) {
				isValid = true;
				control.errorMessage.empty = ''
			}
			
		}
		
		return isValid;
	}

	returnFormValues() {

		if ( !( this.isValidate( this.formControlsContainer ) ) ) {
			this.updateInactivityForFinancialKeyDropdown();

			this.formsControlErrorMessage = [];
			this.formsControlErrorMessage = [
				{ severity: 'error', summary: 'Error', detail: 'Please enter all financial criteria!' }
			];
			setTimeout(() => {
				this.formsControlErrorMessage = [];
			}, 2000);
	
			return;
		}

		let chip_values = this.formControlsContainer;

		chip_values.map( ( item, index ) => {
			
			delete item.addRowButton;
			delete item.deleteRowButton;
			delete item.errorMessage;

			if( this.selectedPropGroup == 'Advanced Key Financials' ) {
				if ( ['numberOfEmployees', 'numShareHolder'].includes( item.key ) ) {
					item.mode = 'decimal';
				} else {
					item.mode = 'currency';
				}
			}

			item['fractionDigits'] = this.fractionDigits;

			if ( this.suffix ) {
				item['suffix'] = this.suffix;
			}

			if ( this.andOrInputSwitch ) {
				if ( index > 0 ) {
					item['condition'] = this.inputSwitch ? 'or' : 'and';
				} else {
					item['condition'] = '';
				}
			}
		})

		this.returnValueForFinancialTypeForm.emit( chip_values );

		this.resetForm();

	}

}