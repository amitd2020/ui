import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FilterSecondBlockComponentFeatureTypes, FilterSecondBlockComponentOutputTypes } from '../filter-option-types.d';
import { Listbox } from 'primeng/listbox';

type ListOptionItemType = {
    label: string,
    value: string | number,
    doc_count?: number,
    items?: any[]
};

@Component({
  selector: 'dg-extended-group-list-box',
  templateUrl: './extended-group-list-box.component.html',
  styleUrls: ['./extended-group-list-box.component.scss']
})
export class ExtendedGroupListBoxComponent implements OnInit, OnChanges {

  private _preSelectedValues: FilterSecondBlockComponentOutputTypes = {};

    @Input() filterOptionLabel: string = '';
    @Input() listItemOptions: Array< ListOptionItemType > = [];
    @Input() selectedPropValues: Array<any>;
    @Input() postCodesSelectedRadius: any;

    @Input()
    set componentFeatures( featuresStrArr: FilterSecondBlockComponentFeatureTypes[] ) {
        this.listBoxFeatures.multiSelect = ( featuresStrArr && featuresStrArr.includes('multi') ) ? true : false;
        this.listBoxFeatures.noFormat = ( featuresStrArr && featuresStrArr.includes('no-format') ? true : false );
        this.listBoxFeatures.excludeOptions = ( featuresStrArr && featuresStrArr.includes('exclude-selected') ) ? true : false;

        if ( this.listBoxFeatures.multiSelect ) {
            if ( this.selectedListItem && !Array.isArray( this.selectedListItem ) ) {
                this.selectedListItem = [ this.selectedListItem ];
            } else if ( Array.isArray( this.selectedListItem ) ) {
                this.selectedListItem = this.selectedListItem.length ? this.selectedListItem : [];
            }
        }
        if ( !( this.listBoxFeatures.multiSelect ) ) {
            if ( Array.isArray( this.selectedListItem ) ) {
                this.selectedListItem = this.selectedListItem.length ? { ...this.selectedListItem[0] } : null;
            }
        }
    }

    @Input()
    set preSelectedValues( selectedValues: FilterSecondBlockComponentOutputTypes ) {
        this._preSelectedValues = selectedValues;
        this.handlePreSelectedValues( selectedValues, 'actionFromClearAll' );
    };
    get preSelectedValues(): FilterSecondBlockComponentOutputTypes {
        return this._preSelectedValues;
    };

    @Output() OutputEmitter = new EventEmitter<FilterSecondBlockComponentOutputTypes>();

    listBoxFeatures = {
        addAllEnabled: false,
        multiSelect: false,
        excludeOptions: false,
        noFormat: false
    }
    listItemOptionsSliced: Array< ListOptionItemType > = [];
    listItemOptionsLimit: number = 500;
    selectedListItem: any = null;
    excludeTimeoutContainer: any = null;
    excludeListOptions: boolean = false;
    errorMessage: string = '';
    selectedGlobalCountry: string = 'uk';

    constructor(
        private _changeDetectRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';
    }

    ngOnChanges( changes: SimpleChanges ) {
        const { listItemOptions } = changes;

        if ( listItemOptions ) {
            
            if ( listItemOptions?.currentValue?.length ) {
                
                if ( this.listItemOptions.length > this.listItemOptionsLimit ) {
                    this.listItemOptionsSliced = this.listItemOptions.slice( 0, this.listItemOptionsLimit );
                } else {
                    this.listItemOptionsSliced = this.listItemOptions;
                }
    
            }
            
            if ( !( listItemOptions?.currentValue?.length ) ) {
                this.listItemOptions = [];
                this.listItemOptionsSliced = [];
            }
    
            this.handlePreSelectedValues();

        }

    }

    selectAllListItems() {

        let nestedItems = [];
        this.selectedListItem = this.listItemOptionsSliced.reduce( ( acc, curr ) => {
            nestedItems.push( curr?.items );
            acc = nestedItems;
            return acc;
        }, [] );

        this.selectedListItem = this.selectedListItem.flat();

        this.listBoxFeatures.addAllEnabled = true;
    }
    
    resetAll( listBoxTemplate: Listbox ) {

        if ( this.excludeTimeoutContainer ) {
            clearTimeout( this.excludeTimeoutContainer );
        }

        listBoxTemplate.filterOptions.reset();

        this.errorMessage = '';
        this.selectedListItem = [];
        this.listBoxFeatures.addAllEnabled = false;
    }

    excludeOptionsChangeHandler() {

        if ( this.excludeTimeoutContainer ) {
            clearTimeout( this.excludeTimeoutContainer );
        }
        
        if ( Array.isArray( this.selectedListItem ) && !( this.selectedListItem?.['length'] ) ) {
            this.errorMessage = 'Please select at least one option from the list below.';

            this.excludeTimeoutContainer = setTimeout( () => {
                this.excludeListOptions = false;
                
                setTimeout( () => {
                    this.errorMessage = '';
                    clearTimeout( this.excludeTimeoutContainer );
                }, 3000);

            }, 500);

            this._changeDetectRef.detectChanges();
            return;
        }
        
        this.listBoxChangeHandler();

    }

    listBoxChangeHandler() {

        let outputValues = {
            chip_values: []
        }

        if ( this.listBoxFeatures.multiSelect && Array.isArray( this.selectedListItem ) && this.selectedListItem?.['length'] ) {

            this.selectedListItem = this.selectedListItem.filter( val => val );
            outputValues.chip_values = this.selectedListItem.map( listItem => listItem.value );

        }

        if ( this.listBoxFeatures.excludeOptions ) {
            outputValues['filter_exclude'] = this.excludeListOptions;
        }

        this.OutputEmitter.emit( outputValues );
        this.listBoxFeatures.addAllEnabled = false;

    }

    private handlePreSelectedValues( selectedValues?: FilterSecondBlockComponentOutputTypes, action?: string ) {
        selectedValues = selectedValues || this.preSelectedValues || {};
        const itemsFound: any = [];
        let tempArr = [];
        
        tempArr = JSON.parse( JSON.stringify( this.selectedListItem ) );
        this.selectedListItem = [];

        if ( !Object.keys( selectedValues ).length && action ) {
            tempArr = [];
        }
        
        if ( this.listItemOptionsSliced.length && !Object.keys( selectedValues ).length ) {
            this.selectedListItem = this.listBoxFeatures.multiSelect ? tempArr : null;

            if ( this.listBoxFeatures.excludeOptions ) {
                this.excludeListOptions = false;
            }
        }

        if ( this.listItemOptionsSliced.length && selectedValues?.chip_values?.length ) {
            for ( let chip of selectedValues.chip_values ) {

                let chipValueStr = typeof chip == 'string' ? chip.toLowerCase() : chip;

                this.listItemOptionsSliced.map( option => { 
                    if ( option?.items ) {
                        let findItem = option.items.find( val => (val.value).toLowerCase() == chipValueStr );
                        if ( findItem ) itemsFound.push( findItem );
                    }
                })

                if ( this.listBoxFeatures.excludeOptions && selectedValues?.filter_exclude ) {
                    this.excludeListOptions = true;
                }
            }

            this.selectedListItem = itemsFound;
        }
    }
}
