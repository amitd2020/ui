import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FilterSecondBlockComponentFeatureTypes, FilterSecondBlockComponentOutputTypes } from '../filter-option-types';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'dg-string-search',
    templateUrl: 'string-search.component.html',
    styles: [`
        .disable-input-search {
            opacity: 0.35;
            background-image: none;
            cursor: auto !important;
            -webkit-pointer-events: none;
            pointer-events: none;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class StringSearchComponent implements OnInit, OnChanges {

    // @Input()
    // set matchCondition( inputStr: 'contains' | 'equals' ) {
    //     this.matchConditionSetter = inputStr ? inputStr : 'equals';
    // }
    @Input()
    set fieldType( inputStr: 'number' | 'string' ) {
        this.fieldTypeSetter = inputStr ? inputStr : 'string';
    }
    @Input() filterOptionChipGroupLabel;
    @Input()
    set componentFeatures( featuresStrArr: FilterSecondBlockComponentFeatureTypes[] ) {
        this.listBoxFeatures.excludeOptions = ( featuresStrArr && featuresStrArr.includes('exclude-selected') ) ? true : false;
        this.listBoxFeatures.contractPageNote = ( featuresStrArr && featuresStrArr.includes('contract-finder-note') ) ? true : false;
        this.listBoxFeatures.showCheckBox = ( featuresStrArr && featuresStrArr.includes('showCheckBox') ) ? true : false;
        this.matchConditionSetter = ( featuresStrArr && featuresStrArr.includes('multi') ? 'contains' : '' ) ? 'contains' : 'equals' ;
        this.searchExactValues = ( featuresStrArr && featuresStrArr.includes('exact-search') ? 'exactSearch' : '') ? true : false;
        this.radioButtonFunctionality = ( featuresStrArr && featuresStrArr.includes('radio_button') ) ? true : false;
    }

    @Input() enteredKeywords: string | number = null;
    @Input() selectedPropValues: Array<any>;

    @Output() OutputEmitter = new EventEmitter<FilterSecondBlockComponentOutputTypes>();

    matchConditionSetter: 'contains' | 'equals' = 'equals';
    fieldTypeSetter: 'number' | 'string' = 'string';
    radioChecked: string = 'current';
    excludeListOptions: boolean = false;
    searchExactValues: boolean;
    containsAndOr: boolean;
    disableInputSearch: boolean;
    radioButtonFunctionality: boolean;
    listBoxFeatures = {
        excludeOptions: false,
        contractPageNote: false,
        showCheckBox: false
    }
    checkBoxArray: any[]

    constructor(
        private activateRouter: ActivatedRoute,
    ) { }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges): void {

        if ( this.activateRouter.snapshot['_routerState'].url.includes( '/insights/people' ) ) {

            this.checkBoxArray = [
                { name: 'About Me', checked: true, key: 'isAboutMe' },
                { name: 'Position', checked: true, key: 'isPosition' },
                { name: 'Current Experience', checked: true, key: 'isCurrentExperience' },
                { name: 'Past Experience', checked: true, key: 'isPastexperience' },
            ];

        } else {
            this.checkBoxArray = [
                { name: 'About us/slogan', checked: true, key: 'isAboutUs' },
                { name: 'Specialties', checked: true, key: 'isSpecilities' },
                { name: 'Industry', checked: true, key: 'isIndustry' }
            ];
        }      

        this.disableInputSearch = false;
        for(let item of this.selectedPropValues) {
            if ( item.chip_group.includes('Person LinkedIn Position') && this.filterOptionChipGroupLabel != item.chip_group && !['Search By Keyword', 'Search By Institution Name'].includes( this.filterOptionChipGroupLabel ) ) { 
                this.disableInputSearch = true;
            }
        }
    }

    setOnInputEnteredKeywords( inputValue: { value?: string | number } ) {
        this.enteredKeywords = inputValue.value.toString();
    }

    setKeywordValues( type?: 'and' | 'or' ) {

        let outputObject: FilterSecondBlockComponentOutputTypes  = {};

        outputObject['chip_values'] = [ this.enteredKeywords ];
        outputObject['filter_exclude'] = this.excludeListOptions;

        if ( type ) {
            if ( this.filterOptionChipGroupLabel == 'Director Name' ) {
                outputObject['directorNameSearchAndOr'] = type;
            } else {
                outputObject['companySearchAndOr'] = type;
            }
            
        }

        if ( this.radioButtonFunctionality ) {
            outputObject['isAllPositions'] = this.radioChecked == 'current' ? false : true;
        }

        if ( this.listBoxFeatures?.showCheckBox ) {
            outputObject[ 'checkboxInChip' ] = []
            this.checkBoxArray.forEach( item => {
                if ( item?.checked ) {
                    const originalChecked = item.checked;
                    outputObject[ item.key ] =  originalChecked;
                    outputObject[ 'checkboxInChip' ] .push( item.name )
                    if ( !item?.defaultSelect) item.checked = item.checked;
                }
            } )
        }

        this.OutputEmitter.emit( outputObject );

        this.enteredKeywords = null;
        this.excludeListOptions = false;
        this.radioChecked = 'current';

    }

    searchString( event ) {
        const { target: { value } } = event;
        this.containsAndOr = value.toLowerCase().split(' ').includes('and') || value.toLowerCase().split(' ').includes('or');
    }
    
}