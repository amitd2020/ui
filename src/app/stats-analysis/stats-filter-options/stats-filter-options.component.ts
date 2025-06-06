import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { dropdownMultiCheckboxArray, ukRegions } from '../map-analysis/map-constant.index';
import { GlobalServerComminicationService } from 'src/app/hubspot-ui/services/global-server-comminication.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { TitleCasePipe } from '@angular/common';

interface Country {
    name: string;
    code: string;
}

@Component({
    selector: 'dg-stats-filter-options',
    templateUrl: './stats-filter-options.component.html',
    styleUrls: ['./stats-filter-options.component.scss'],
})
export class StatsFilterOptionsComponent implements OnInit, OnChanges {

    dropdownCheckboxArray: any[] = JSON.parse(JSON.stringify(dropdownMultiCheckboxArray))
    
	@Input() totalRecords: number = 670;
    @Output() payloadHandler = new EventEmitter<any>()

    openSideBarPanel: boolean = false;

    payloadFormationObject = {};
    timeout: any = null;

    filterImageObj = {
        'SIC Codes': {  header: 'Industry' },
        'Region': { header: 'Region' },
        'Post Code': { header: 'Post Code' },
        'County': { header: 'County' },
        'District Council': { header: 'District Council' },
        'County Council': { header: 'County Council' },
        'Unitary Council': { header: 'Unitary Council' },
        'Metropolitan Council': { header: 'Metropolitan Council' },
        'London Boroughs Council': { header: 'London Boroughs Council' }
    }

    countries!: Country[];

    selectedCountries!: Country[];



    constructor(
        private globalServerComminicationService: GlobalServerComminicationService,
        private userAuthService: UserAuthService,
		private toTitleCasePipe: TitleCasePipe,
    ) {
        this.countries = [
            { name: 'Australia', code: 'AU' },
            { name: 'Brazil', code: 'BR' },
            { name: 'China', code: 'CN' },
            { name: 'Egypt', code: 'EG' },
            { name: 'France', code: 'FR' },
            { name: 'Germany', code: 'DE' },
            { name: 'India', code: 'IN' },
            { name: 'Japan', code: 'JP' },
            { name: 'Spain', code: 'ES' },
            { name: 'United States', code: 'US' }
        ];
    }

    ngOnChanges( changes: SimpleChanges ) {
        if ( changes && changes?.totalRecords && changes.totalRecords?.currentValue ) {
            this.totalRecords = changes.totalRecords?.currentValue;
        }
    }

    ngOnInit() {
        this.initializeData();
        
    }

    async initializeData() {

        this.payloadFormationObject = {
            "filterData": [
                {
                  "chip_group": "Status",
                  "chip_values": [
                    "live"
                  ]
                },
				{chip_group: "Region", chip_values: ["london"]}
              ]
        }

        this.globalServerComminicationService.getStatsSicCode( ).subscribe({
            next: ( data ) => {
                if (data.result && data.result.length > 0) {
                    this.dropdownCheckboxArray[0]['options'] = data.result;
                    // this.dropdownCheckboxArray[0]['ngModel'] = [{ 'label': 'C - manufacturing', data: 'manufacturing', key: 'manufacturing' }];
                }
            },
            error: ( err ) => {
                console.log( err )
            }
        })

        this.dropdownCheckboxArray.forEach( async item => {

            if ( item?.autoSelect ) {
                await this.getAggregatedData( item, true )
            }

        } )

    }

    async getAggregatedData( filterItem, autoselect: boolean = false ) {

        if ( filterItem?.label == 'Industry' ) return;

        // 64267b6b40a3b71a61967724

        let fnlPayload = {};
        fnlPayload['aggregateBy'] = filterItem.key;
        fnlPayload['userId'] = this.userAuthService?.getUserInfo('dbID');

        let fltrData = this.payloadFormationObject['filterData'].filter( item => {

            const { chip_group } = item;
            const selectedGrp = filterItem?.chipGroup || filterItem?.label;

            if ( chip_group != selectedGrp ) {
                return item;
            }

        } )

        fnlPayload[ 'filterData' ] = fltrData;

        this.globalServerComminicationService.getDataFromAggregateByParam(fnlPayload).subscribe({
            next: (data) => {
                if (data.distinct_categories && data.distinct_categories.buckets && data.distinct_categories.buckets.length > 0) {
                    filterItem['options'] = [];
                    let options = data.distinct_categories.buckets.map(item => ({
                        label: item.key.replace(/(^|\s)\S/g, t => t.toUpperCase()),
                        key: item.key,
                        count: item.doc_count
                    }));
                    filterItem['options'] = options;
                    let selectedOptions = filterItem['ngModel'].map(modelItem => modelItem?.label);
                    // let selectedOptions = JSON.parse(JSON.stringify( filterItem['ngModel'] ))
                    if (autoselect) {
                        filterItem['ngModel'] = [];
                        setTimeout(() => {
                            filterItem['ngModel'] = filterItem['options'].filter(option => filterItem['autoSelect'].includes(option.label));
                        }, 100);
                    } else {
                        filterItem['ngModel'] = [];

                        filterItem['options'].some(item => {
                            if (selectedOptions.includes(item?.label)) {
                                filterItem['ngModel'].push(item);
                                if (selectedOptions.length == filterItem['ngModel'].length) {
                                    return true;
                                }
                            }
                            return false;
                        });
                    }
                }
            },
            error: (err) => {
                console.log(err);
            }
        })

    }

    setPayloadData( selectedItem? ) {

        this.preparePayload( this.dropdownCheckboxArray, selectedItem )
    }

    preparePayload( data: any[], selectedItem? ) {


        const result = {
            filterData: [
                { chip_group: 'Status', chip_values: ['live'] }
            ]
        };
    

        data.forEach(item => {
            
            const chipGroup = item.chipGroup || item.label;

            if ( item.hasOwnProperty( 'disable' ) && selectedItem && selectedItem.hasOwnProperty( 'disable' ) ) {

                if ( !selectedItem?.disable && item.label !== selectedItem.label && selectedItem.ngModel.length ) {
                    item.disable = true;
                } else {
                    item.disable = false;

                }
            }

            const chipValues =  item.ngModel && item.ngModel.length > 0 ? item.ngModel.map( modelItem => modelItem.key ) : [];

            if (chipValues.length > 0) {
                const transformedItem = {
                    chip_group: chipGroup,
                    chip_values: chipValues
                };
        
                if (chipGroup === 'SIC Codes') {
                    transformedItem['label'] = item.label;
                    transformedItem['chip_industry_sic_codes'] = item.ngModel.map(modelItem => modelItem.key);
                    transformedItem['filter_exclude'] = false;
                }
        
                result.filterData.push(transformedItem);
            }
    
        });

        this.payloadFormationObject['filterData'] = result[ 'filterData' ]

        clearTimeout( this.timeout );

        this.timeout = setTimeout( () => {
            this.payloadHandler.emit( result );
        }, 1000)

    }

    removeChip( selectedItem, index ) {
        selectedItem['ngModel'].splice( index, 1 );
        this.setPayloadData( selectedItem );
    }

    async clearAll() {
        this.dropdownCheckboxArray = [...JSON.parse(JSON.stringify(dropdownMultiCheckboxArray))];
        await this.initializeData();
        setTimeout( () => {
            this.preparePayload( this.dropdownCheckboxArray )
        }, 2000 )
    }
}
