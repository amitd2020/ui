import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FilterSecondBlockComponentFeatureTypes, FilterSecondBlockComponentOutputTypes } from '../filter-option-types.d';
import { Listbox, ListboxFilterOptions } from 'primeng/listbox';
import { SharedLoaderService } from '../../shared-loader/shared-loader.service';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { MonthsEnum } from '../../../features-modules/search-company/search-company.constant';

type ListOptionItemType = {
    label: string,
    value: string | number,
    doc_count?: number
};

@Component({
    selector: 'dg-extended-list-box',
    templateUrl: './extended-list-box.component.html',
    styleUrls: [ './extended-list-box.component.scss' ]
})

export class ExtendedListBoxComponent implements OnInit, OnChanges {

    private _preSelectedValues: FilterSecondBlockComponentOutputTypes = {};

    @Input() filterOptionLabel: string = '';
    @Input() listItemOptions: Array< ListOptionItemType > = [];
    @Input() selectedPropValues: Array<any>;
    @Input() postCodesSelectedRadius: any;

    @Input()
    set componentFeatures( featuresStrArr: FilterSecondBlockComponentFeatureTypes[] ) {
        this.listBoxFeatures.multiSelect = ( featuresStrArr && featuresStrArr.includes('multi') ) ? true : false;
        this.listBoxFeatures.rangeSelect = ( this.listBoxFeatures.multiSelect && featuresStrArr.includes('range-selection') ) ? true : false;
        this.listBoxFeatures.filter = ( featuresStrArr && ( featuresStrArr.includes('default-search') || featuresStrArr.includes('custom-search') ) ) ? true : false;
        this.listBoxFeatures.serverSideSearch = ( featuresStrArr && featuresStrArr.includes('custom-search') ) ? true : false;
        this.listBoxFeatures.excludeOptions = ( featuresStrArr && featuresStrArr.includes('exclude-selected') ) ? true : false;
        this.listBoxFeatures.textUppercase = ( featuresStrArr && featuresStrArr.includes( 'uppercase' ) ) ? true : false;
        this.listBoxFeatures.noFormat = ( featuresStrArr && featuresStrArr.includes('no-format') ? true : false );
        this.sortEnabled = ( featuresStrArr && featuresStrArr.includes('sort-by') ) || false;

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
        rangeSelect: false,
        filter: false,
        excludeOptions: false,
        serverSideSearch: false,
        textUppercase: false,
        noFormat: false
    }
    listItemOptionsSliced: Array< ListOptionItemType > = [];
    listItemOptionsLimit: number = 500;
    listBoxFilterValue: string = '';
    selectedListItem: ListOptionItemType | Array< ListOptionItemType > = null;
    inputKeyupTimeoutContainer: any = null;
    excludeTimeoutContainer: any = null;
    excludeListOptions: boolean = false;
    errorMessage: string = '';

    sortEnabled: boolean = false;
    sortBySelected: string = 'count';
    sortByOptions: { label: string, value: string }[] = [
        { label: 'Count', value: 'count' },
        { label: 'A-Z', value: 'a-z' },
        { label: 'Z-A', value: 'z-a' },
    ]
    selectedGlobalCountry: string = 'uk';
    disableList: boolean;

    constructor(
        private _sharedLoader: SharedLoaderService,
        private _commonService: CommonServiceService,
        private _changeDetectRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';
     }

    ngOnChanges( changes: SimpleChanges ) {
        const { listItemOptions } = changes;

        this.disableList = false;
        setTimeout(() => {
            for( let item of this.selectedPropValues ) {
                if ( item.chip_group.includes('Search By Position') && this.filterOptionLabel != item.chip_group && !['Academics Start Year', 'Academics End Year', 'Number of Employees'].includes( this.filterOptionLabel )) {
                    this.disableList = true;
                }
            }
        }, 0);


        if ( listItemOptions ) {
            
            if ( listItemOptions?.currentValue?.length ) {
    
                const labelLowerCase = this.filterOptionLabel.toLowerCase();
                const sortOnKey: boolean = labelLowerCase.includes('charge') && ( labelLowerCase.includes('month') || labelLowerCase.includes('year') );
                
                if ( sortOnKey ) {
                    this.listItemOptions = this.listItemOptions.sort( (a, b) => {
                        if ( a?.['key_as_string'] ) {
                            return b['key_as_string'].localeCompare( a['key_as_string'] );
                        } else {
                            return a['key'].localeCompare( b['key'] );
                        }
                    });
                }
    
                this.listItemOptions = this.listItemOptions.map( OptItem => {
                    let outputObject = {
                        label: OptItem['label'] || OptItem['listName'] || OptItem['key_as_string'] || ( labelLowerCase.includes('month') && OptItem['key'] != 'not specified' ? MonthsEnum[ +OptItem['key'] ] : OptItem['key'] ),
                        value: OptItem['value'] || OptItem['listName'] || OptItem['key_as_string'] || OptItem['key'],
                        doc_count: OptItem['companiesInList'] || OptItem?.['parent_count']?.['doc_count'] || OptItem['doc_count'] || 0,
                    }
    
                    if ( this.filterOptionLabel == 'Saved Lists' ) {
                        outputObject['pageName'] = ( OptItem?.['page'] && OptItem?.['page'] == 'companySearch' ) ? 'companyListPage' : ( OptItem?.['page'] || undefined );
                        outputObject['listId'] = OptItem?.['_id'];
                    }
    
                    if ( !OptItem.hasOwnProperty('doc_count') ) {
                        delete outputObject.doc_count;
                    }
    
                    return outputObject;
                });
                
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

    clientSideFilterHandler() {

        if ( this.inputKeyupTimeoutContainer ) {
            clearTimeout( this.inputKeyupTimeoutContainer );
        }

        setTimeout(() => {
            
            this.listItemOptionsSliced = this.listItemOptions.filter( listItem => listItem.label.toLowerCase().includes( this.listBoxFilterValue.toLowerCase() ) );
            
            if( this.listItemOptionsSliced.length > this.listItemOptionsLimit ) {
                this.listItemOptionsSliced = this.listItemOptionsSliced.slice( 0, this.listItemOptionsLimit );
            } else {
                this.listItemOptionsSliced = this.listItemOptionsSliced;
            }

            clearTimeout( this.inputKeyupTimeoutContainer );
        }, 1000);
    }

    selectAllListItems( listBoxTemplate: Listbox ) {
        // if ( listBoxTemplate?.optionsToRender?.length ) {
        //     this.selectedListItem = listBoxTemplate?.optionsToRender;
        // } else {
        //     this.selectedListItem = this.listItemOptionsSliced;
        // }
        this.selectedListItem = this.listItemOptionsSliced;

        if ( this.listBoxFeatures.rangeSelect && this.selectedListItem?.length ) {
            this.selectedListItem = this.selectedListItem.filter( selectedList => selectedList.label != 'not specified' );           
        }

        this.listBoxFeatures.addAllEnabled = true;
    }

    serverSideFilterHandler() {

        if ( this.inputKeyupTimeoutContainer ) {
            clearTimeout( this.inputKeyupTimeoutContainer );
        }

        if ( this.listBoxFilterValue.length <= 2 ) {
            if ( !this.listBoxFilterValue.length ) {
                this.OutputEmitter.emit({
                    filterInputKeywords: this.listBoxFilterValue
                });
            }
            return;
            
        }
        
        this.inputKeyupTimeoutContainer = setTimeout( () => {

            this.OutputEmitter.emit({
                filterInputKeywords: this.listBoxFilterValue
            });
            
            clearTimeout( this.inputKeyupTimeoutContainer );

        }, 1500);
    }

    listBoxFilterReset( filterTemplateOptions: ListboxFilterOptions ) {

        if ( this.inputKeyupTimeoutContainer ) {
            clearTimeout( this.inputKeyupTimeoutContainer );
        }

        filterTemplateOptions.reset();

        if ( this.listBoxFeatures.serverSideSearch ) {
            this.OutputEmitter.emit({
                filterInputKeywords: ''
            });
        }

        if ( this.listBoxFilterValue.length ) { 
            if ( this.listItemOptions.length > this.listItemOptionsLimit ) {
                this.listItemOptionsSliced = this.listItemOptions.slice( 0, this.listItemOptionsLimit );
            } else {
                this.listItemOptionsSliced = this.listItemOptions;
            }
        }

        this.listBoxFilterValue = '';
    }
    
    resetAll( listBoxTemplate: Listbox ) {

        if ( this.inputKeyupTimeoutContainer ) {
            clearTimeout( this.inputKeyupTimeoutContainer );
        }

        if ( this.excludeTimeoutContainer ) {
            clearTimeout( this.excludeTimeoutContainer );
        }

        listBoxTemplate.filterOptions.reset();

        if ( ( this.listBoxFeatures.serverSideSearch && this.listBoxFilterValue.length ) ) {
            this.OutputEmitter.emit({
                filterInputKeywords: ''
            });
        }

        if ( this.sortEnabled ) {
            this.sortBySelected = 'count';
            this.sortByKey();
        }

        if ( this.listBoxFilterValue.length ) {
            if ( this.listItemOptions.length > this.listItemOptionsLimit ) {
                this.listItemOptionsSliced = this.listItemOptions.slice( 0, this.listItemOptionsLimit );
            } else {
                this.listItemOptionsSliced = this.listItemOptions;
            }
        }

        this.errorMessage = '';
        this.listBoxFilterValue = '';
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

        if ( !( this.listBoxFeatures.multiSelect ) && this.selectedListItem.hasOwnProperty('value') ) {
            let extractedChipValues = this.selectedListItem['value'];

            if ( extractedChipValues.includes('-') &&  ![ 'Safe Alert', 'Property Type', 'Academics Start Year', 'Academics End Year', 'Account Size', 'Size' ].includes( this.filterOptionLabel )) {
                extractedChipValues = extractedChipValues.split('-').map( val => ( val == '' ) ? null : +val );
            } else if ( [ 'Account Size', 'Size' ].includes( this.filterOptionLabel )) {
                extractedChipValues = extractedChipValues;
            } else if ( extractedChipValues.includes('+') && !['Account Size', 'Size'].includes( this.filterOptionLabel ) ) {
                extractedChipValues = extractedChipValues.split('+').map( val => ( val == '' ) ? null : +val );
            }

            if ( Array.isArray( extractedChipValues ) && extractedChipValues.length > 2 ) {
                extractedChipValues = this.selectedListItem['value'];
            }

            if ( ['Number of Employees'].includes( this.filterOptionLabel ) && extractedChipValues == 'not specified' ) {
                extractedChipValues = [ extractedChipValues ];
            }

            outputValues.chip_values = [ extractedChipValues ];

            if ( this.selectedListItem?.['listId'] ) {
                outputValues['pageName'] = this.selectedListItem['pageName'];
                outputValues['listId'] = this.selectedListItem['listId'];
            }
        }

        if ( this.listBoxFeatures.multiSelect && Array.isArray( this.selectedListItem ) && this.selectedListItem?.['length'] ) {

            if ( this.listBoxFeatures.rangeSelect ) {
                let dataIndexRange = [];

                const findNotSpecified = this.selectedListItem.find( selectedList => selectedList.label == 'not specified' );

                if ( findNotSpecified ) {
                    this.selectedListItem = [ findNotSpecified ];
                    dataIndexRange.push( this.listItemOptionsSliced.indexOf( findNotSpecified ) );
                } else {
                    for ( let listItem of this.selectedListItem ) {
                        dataIndexRange.push( this.listItemOptionsSliced.indexOf( listItem ) );
                    }
                }

                
                if ( dataIndexRange.length > 1 ) {
                    dataIndexRange = dataIndexRange.sort( (a, b) => a - b );
                    const CreateRangeArr = ( start: number, stop: number, step: number = 1 ) => Array.from(
                        { length: ( stop - start ) / step + 1 },
                        ( v, i ) => ( start + i * step )
                    );

                    dataIndexRange = CreateRangeArr( dataIndexRange[0], dataIndexRange[ dataIndexRange.length - 1 ] );

                    this.selectedListItem = [];
                    
                    for ( let listIndex of dataIndexRange ) {
                        this.selectedListItem.push( this.listItemOptionsSliced[ listIndex ] );
                    }
                }

                outputValues.chip_values = this.selectedListItem.map( listItem => listItem.value );

                if ( outputValues.chip_values.length > 1 ) {
                    outputValues.chip_values = outputValues.chip_values.sort( (a, b) => ( +a - +b ) );
                    outputValues.chip_values = [ outputValues.chip_values[0], outputValues.chip_values[ outputValues.chip_values.length - 1 ] ];
                }

            } else {
                if ( [ 'SIC Codes', 'NACE Codes'].includes(this.filterOptionLabel) && this.selectedGlobalCountry != 'uk' ) {
                    outputValues.chip_values = this.selectedListItem.map( listItem => listItem.label );
                } else {
                    this.selectedListItem = this.selectedListItem.filter( val => val );
                    outputValues.chip_values = this.selectedListItem.map( listItem => listItem.value );
                }
            }

        }

        if ( this.listBoxFeatures.excludeOptions ) {
            outputValues['filter_exclude'] = this.excludeListOptions;
        }

        this.OutputEmitter.emit( outputValues );
        this.listBoxFeatures.addAllEnabled = false;

    }

	highlightMatchedWords( realStr: string, toFindStr: string ): string {
        
        if ( this.filterOptionLabel.toLowerCase().includes('code') ) {
            realStr = realStr.toUpperCase();
        } else if ( this.filterOptionLabel.toLowerCase().includes( 'academics' ) ) {
            realStr = realStr;
        } else {
            realStr = this._commonService.camelCaseToTitleCaseStr( realStr );
        }

        if ( !this.filterOptionLabel.toLowerCase().includes( 'academics' ) ) {
            toFindStr = toFindStr.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
        }
		return realStr.replace(new RegExp(toFindStr, 'gi'), ( match ) => `<b class='c-green'>${ match }</b>`);
	}

    sortByKey() {
        this._sharedLoader.showLoader();

        let listItemOptions_copy = JSON.parse( JSON.stringify( this.listItemOptions ) );
        this.listItemOptions = [];
        this.listItemOptionsSliced = [];
        
        setTimeout( () => {
            listItemOptions_copy = listItemOptions_copy.sort( ( a, b ) => {
                if ( this.sortBySelected === 'a-z' ) {
                    return a['label'].localeCompare( b['label'] );
                }
                if ( this.sortBySelected === 'z-a' ) {
                    return b['label'].localeCompare( a['label'] );
                }
                if ( this.sortBySelected === 'count' ) {
                    return b['doc_count'] - a['doc_count'];
                }
            });

            this.listItemOptions = JSON.parse( JSON.stringify( listItemOptions_copy ) );
            
            if ( this.listItemOptions.length > this.listItemOptionsLimit ) {
                this.listItemOptionsSliced = this.listItemOptions.slice( 0, this.listItemOptionsLimit );
            } else {
                this.listItemOptionsSliced = this.listItemOptions;
            }

            this._sharedLoader.hideLoader();
        }, 0);
    }

    private handlePreSelectedValues( selectedValues?: FilterSecondBlockComponentOutputTypes, action?: string ) {
        selectedValues = selectedValues || this.preSelectedValues || {};
        const itemsFound = [];
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
                let chipValWithMiles: Array< string > = chip.includes('Miles') ? chip.match( new RegExp( /([A-Z0-9])\w+/gi ) ) : [];
                let chipValueStr = chipValWithMiles.length ? chipValWithMiles[0].toLowerCase() : typeof chip == 'string' ? chip.toLowerCase() : chip;

                itemsFound.push(
                    this.listItemOptionsSliced.find( item => typeof item.value == 'string' ? (item.value).toLowerCase() == chipValueStr : item.value == chipValueStr )
                );
                if ( this.listBoxFeatures.excludeOptions && selectedValues?.filter_exclude ) {
                    this.excludeListOptions = true;
                }
            }
            this.selectedListItem = itemsFound;
        }
    }

}