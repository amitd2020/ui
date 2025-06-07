import { Component, EventEmitter, Input, OnInit, Output, createPlatform } from '@angular/core';
import { FilterSecondBlockComponentOutputTypes, PreferenceControllerParentType, PreferenceControllerType, PreferenceOptionItemType, PreferenceOptionsType } from '../filter-option-types';
// import { PreferencesOptionIndex } from './preference-options.const';

@Component({
    selector: 'dg-preference-options',
    templateUrl: './preference-options.component.html'
})

export class PreferenceOptionsComponent implements OnInit {

    private _preSelectedValues: FilterSecondBlockComponentOutputTypes;
    private _preferenceGroup: string;
    
    // @Input() selectedCountry: string = 'uk';
    @Input()
    set preferenceGroup( inputStr: string ) {
        this._preferenceGroup = inputStr;
        
        const listItems = this.optionListIndex.filter( item => item.parentHeader === inputStr );
        this.optionListItems = listItems?.[0]?.options || [];
        // this.optionListItems = this.optionListItems.filter( element => element?.countryAccess?.includes( this.selectedCountry ) )
        // for( let val of this.optionListItems ) {
        //     val.items = val.items.filter( element => element?.countryAccess.includes( this.selectedCountry ) );
        // }
        
    }
    get preferenceGroup(): string {
        return this._preferenceGroup;
    }

    @Input()
    set preSelectedValues( selectedValues: FilterSecondBlockComponentOutputTypes ) {
        this._preSelectedValues = selectedValues;

        if ( this.optionListItems.length ) {
            this.selectedOptionListItems = [];

            for ( let prefItem of this.optionListItems ) {
                for ( let item of prefItem.items ) {
                    for ( let control of item.controllers ) {
                        control.value = false;

                        if ( selectedValues?.chip_values?.includes( control.outputLabel ) ) {
                            control.value = true;
            
                            this.selectedOptionListItems.push({
                                itemName: ( item?.controlLabel || item.label ),
                                itemValue: {
                                    chip_values: [ control.outputLabel ],
                                    preferenceOperator: [ control.preferenceOperator ]
                                }
                            });
                        }

                    }
                }
            }
                            
            if ( this.preferenceGroup == 'Personnel Contact Information' ) {
                this.optionsDisabilityCheck( selectedValues?.chip_values );
            }
        }

    };
    get preSelectedValues(): FilterSecondBlockComponentOutputTypes {
        return this._preSelectedValues;
    };

    @Output() OutputEmitter = new EventEmitter< FilterSecondBlockComponentOutputTypes >();

    optionListIndex: PreferenceOptionsType[] = JSON.parse( localStorage.getItem('preferences') );
    optionListItems: PreferenceOptionItemType[] = [];
    selectedOptionListItems: { itemName: string, itemValue: FilterSecondBlockComponentOutputTypes }[] = [];
    disabledItems: Array<string> = [];

    constructor() { }

    ngOnInit() { }

    checkboxChangeHandler( controllerItem: PreferenceControllerType, controllerParent: PreferenceControllerParentType ) {
        
        let outputValues: FilterSecondBlockComponentOutputTypes = { chip_values: [] };
        let selectedParentLabel: string = ( controllerParent?.controlLabel || controllerParent.label );
        
        controllerParent.controllers.map( item => {
            if ( item !== controllerItem ) {
                item.value = false;
            }
        });

        this.selectedOptionListItems = this.selectedOptionListItems.filter( item => item.itemName !== selectedParentLabel );

        if ( controllerItem.value ) {
            
            this.selectedOptionListItems.push({
                itemName: selectedParentLabel,
                itemValue: {
                    chip_values: [ controllerItem.outputLabel ],
                    preferenceOperator: [ controllerItem.preferenceOperator ]
                }
            });

        }

        if ( this.selectedOptionListItems.length ) {
            outputValues = this.selectedOptionListItems.reduce( ( newData: FilterSecondBlockComponentOutputTypes, originalArray ) => {
                
                const { itemValue } = originalArray;
    
                // Assigning blank array if the keys doesn't exist.
                newData.chip_values = newData?.chip_values || [];
                newData.preferenceOperator = newData?.preferenceOperator || [];
                
                // Assigning the values into the created keys.
                newData.chip_values = [ ...newData.chip_values, ...itemValue.chip_values ];
                newData.preferenceOperator = [ ...newData.preferenceOperator, ...itemValue.preferenceOperator ];
    
                return newData; // output type: { chip_values: [...], preferenceOperator: [...{...}] }
    
            }, {});
        }

        if ( this.preSelectedValues?.chip_values?.length ) {
            outputValues.chip_values = outputValues?.chip_values || [];
            outputValues.preferenceOperator = outputValues?.preferenceOperator || [];

            this.preSelectedValues.chip_values = this.preSelectedValues.chip_values.filter( val => !outputValues.chip_values.includes( val ) );
            this.preSelectedValues.preferenceOperator = this.preSelectedValues.preferenceOperator.filter( val => !outputValues.preferenceOperator.includes( val ) );

            controllerParent.controllers.map( controller => {
               this.preSelectedValues.chip_values.map( ( val, index ) => {
                if ( val.toLowerCase() == controller.outputLabel.toLowerCase() ) {
                    this.preSelectedValues.chip_values.splice( index, 1 );
                    this.preSelectedValues.preferenceOperator.splice( index, 1 );
                }
               })
            });

            outputValues.chip_values = [ ...this.preSelectedValues.chip_values, ...outputValues?.chip_values ];
            outputValues.preferenceOperator = [ ...this.preSelectedValues.preferenceOperator, ...outputValues?.preferenceOperator ];
        }

        this.OutputEmitter.emit( outputValues );

        if ( controllerParent?.disabledCheck ) {
            this.optionsDisabilityCheck( outputValues.chip_values );
        }

    }

    optionsDisabilityCheck( finalValues: Array< string > ) {

        this.disabledItems = [];
        
        if ( finalValues?.length ) {

            for ( let chipValue of finalValues ) {
                if ( chipValue.includes( 'Employee Email' ) ) {
                    this.disabledItems.push('Director Email');
                    this.disabledItems.push('PSC Email');
                }
                if ( chipValue.includes( 'Employee LinkedIn' ) ) {
                    this.disabledItems.push('Director LinkedIn');
                    this.disabledItems.push('PSC LinkedIn');
                }
                if ( chipValue.includes( 'Director Email' ) || chipValue.includes( 'PSC Email' ) ) {
                    this.disabledItems.push('Employee Email');
                }
                if ( chipValue.includes( 'Director LinkedIn' ) || chipValue.includes( 'PSC LinkedIn' ) ) {
                    this.disabledItems.push('Employee LinkedIn');
                }
            }

        }

    }

}