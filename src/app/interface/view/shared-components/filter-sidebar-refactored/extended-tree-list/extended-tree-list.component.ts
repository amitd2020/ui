import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Tree } from 'primeng/tree';
import { SharedLoaderService } from '../../shared-loader/shared-loader.service';
import { FilterSecondBlockComponentFeatureTypes, FilterSecondBlockComponentOutputTypes } from '../filter-option-types';

@Component({
    selector: 'dg-extended-tree-list',
    templateUrl: './extended-tree-list.component.html',
    styleUrls: [ './extended-tree-list.component.scss' ]
})

export class ExtendedTreeListComponent implements OnInit, OnChanges {

    private _preSelectedValues: FilterSecondBlockComponentOutputTypes = {};

    @Input() treeListValues: TreeNode[] = [];

    @Input()
    set componentFeatures( featuresStrArr: FilterSecondBlockComponentFeatureTypes[] ) {
        this.treeListFeatures.excludeOptions = ( featuresStrArr && featuresStrArr.includes('exclude-selected') ) ? true : false;
    }

    @Input()
    set preSelectedValues( selectedValues: FilterSecondBlockComponentOutputTypes ) {
        this._preSelectedValues = selectedValues;
        this.handlePreSelectedValues( selectedValues );
    };
    get preSelectedValues(): FilterSecondBlockComponentOutputTypes {
        return this._preSelectedValues;
    };

    @Output() OutputEmitter = new EventEmitter<FilterSecondBlockComponentOutputTypes>();

    treeListFeatures = {
        excludeOptions: false
    }

    selectedTreeListItems: TreeNode[] = [];
    treeListFilterInputValue: string = '';

    treeListValuesOrg: TreeNode[] = [];
    treeListValuesFlattened: TreeNode[] = [];

    inputKeyupTimeoutContainer: any = null;
    excludeTimeoutContainer: any = null;
    excludeListOptions: boolean = false;
    selectAllList: boolean = false;
    errorMessage: string = '';

    constructor(
        private _sharedLoader: SharedLoaderService,
        private _changeDetectRef: ChangeDetectorRef
    ) { }

    ngOnInit() { }

    ngOnChanges( changes: SimpleChanges ) {
        const { treeListValues } = changes;

        if ( treeListValues && treeListValues?.currentValue ) {
            this.treeListValuesOrg = this.treeListValues;
            this.treeListValuesFlattened = this.flattenTreeListValues( this.treeListValues );

            this.handlePreSelectedValues();
        }
    }

	highlightMatchedWords( realStr: string, toFindStr: string ): string {
		toFindStr = toFindStr.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
		return realStr.replace(new RegExp(toFindStr, 'gi'), ( match ) => `<b class='c-green'>${ match }</b>`);
	}

    onFilterHandler() {

        if ( this.inputKeyupTimeoutContainer ) {
            clearTimeout( this.inputKeyupTimeoutContainer );
        }
        
        if ( this.treeListFilterInputValue.length <= 2 ) {
            this.treeListValues = this.treeListValuesOrg;
            this._sharedLoader.hideLoader();
            return;
        }
        
        let filteredResults = [];
        this._sharedLoader.showLoader();

        this.inputKeyupTimeoutContainer = setTimeout( () => {
            filteredResults = this.treeListValuesFlattened.filter( listItem => listItem.label.toLowerCase().includes( this.treeListFilterInputValue.toLowerCase() ) );
            filteredResults = filteredResults.slice( 0, 500 );
            this.treeListValues = filteredResults;

            this._sharedLoader.hideLoader();
            clearTimeout( this.inputKeyupTimeoutContainer );
        }, 1500);

    }

    excludeOptionsChangeHandler() {

        if ( this.excludeTimeoutContainer ) {
            clearTimeout( this.excludeTimeoutContainer );
        }
        
        if ( !( this.selectedTreeListItems.length ) ) {
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
        
        this.onNodeSelectHandler();

    }

    onNodeSelectHandler() {
        let outputValues = {
            chip_industry_sic_codes: [],
            chip_values: []
        }

        outputValues.chip_industry_sic_codes = this.selectedTreeListItems.map( listItem => listItem.data );
        outputValues.chip_values = this.selectedTreeListItems.map( listItem => listItem.label );

        if ( this.treeListFeatures.excludeOptions ) {
            outputValues['filter_exclude'] = this.excludeListOptions;
        }

        this.OutputEmitter.emit( outputValues );
    }

    selectAllTreeListItems() {
        this.selectedTreeListItems = this.treeListValues;
        this.selectAllList = true
        
    }

    treeListFilterReset() {
        if ( this.inputKeyupTimeoutContainer ) {
            clearTimeout( this.inputKeyupTimeoutContainer );
        }
        this.treeListFilterInputValue = '';
        this.treeListValues = this.treeListValuesOrg;
    }

    resetAll( treeListTemplate: Tree ) {
        if ( this.inputKeyupTimeoutContainer ) {
            clearTimeout( this.inputKeyupTimeoutContainer );
        }
        treeListTemplate.resetFilter();
        this.selectedTreeListItems = [];
        this.treeListFilterInputValue = '';
        this.treeListValues = this.treeListValuesOrg;
    }

    flattenTreeListValues( inputTreeNodes: TreeNode[] ): TreeNode[] {
        let modifiedArray: TreeNode[] = [];

        const ExtractChildNodes = ( inputArr: TreeNode[] ) => {

            for ( let treeNode of inputArr ) {
    
                modifiedArray.push( { ...treeNode, styleClass: 'p-treenode-leaf' } );
                
                if ( treeNode?.children && Array.isArray( treeNode.children ) ) {
                    ExtractChildNodes( treeNode.children );
                }
                
            }
        }

        ExtractChildNodes( inputTreeNodes );

        return modifiedArray;
    }
    
    private handlePreSelectedValues( selectedValues?: FilterSecondBlockComponentOutputTypes ) {
        selectedValues = selectedValues || this.preSelectedValues || {};
        const itemsFound = [];
        
        if ( this.treeListValuesFlattened.length && !Object.keys( selectedValues ).length ) {
            this.selectedTreeListItems = [];

            if ( this.treeListFeatures.excludeOptions ) {
                this.excludeListOptions = false;
            }
        }

        if ( this.treeListValuesFlattened.length && selectedValues?.chip_values?.length ) {
            for ( let chip of selectedValues.chip_values ) {
                itemsFound.push(
                    this.treeListValuesFlattened.find( item => item.label == chip )
                );
                if ( this.treeListFeatures.excludeOptions && selectedValues?.filter_exclude ) {
                    this.excludeListOptions = true;
                }
            }
            this.selectedTreeListItems = itemsFound;
        }
    }

}