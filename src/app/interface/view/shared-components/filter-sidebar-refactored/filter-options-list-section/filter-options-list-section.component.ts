import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ExtendedMenuItems, FilterOptionsListType } from '../filter-option-types';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

// import { FilterOptionsIndex } from './filter-options.index';
import { AccordionLightShades, AccordionDarkShades } from '../filter-option-types';

@Component({
    selector: 'dg-filter-options-list-section',
    templateUrl: './filter-options-list-section.component.html',
    styleUrls: ['./filter-options-list-section.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class FilterOptionsListSectionComponent implements OnInit, OnChanges {

    @Input() optionsListForPage: string = null;
    @Input() searchInFilterOptions: boolean = false;
    @Input() selectedCountry: string = 'uk';
    @Input() optionsListType: boolean = false;

	@Output() filterOptionsItemsOutput = new EventEmitter();
	
	_JSON = JSON;
	filterOptionsItems: { individual: Partial< ExtendedMenuItems[] >, grouped: Partial< ExtendedMenuItems[] > } = {
		individual: [],
		grouped: []
	};
	selectedGlobalCountry: string = 'uk';
	selectedFilterOptionItem: Partial< ExtendedMenuItems > = {};
	searchInFilterInputKeyword: string = '';
	filterItemsRawForSearch: Partial< ExtendedMenuItems[] > = [];
	formatArrayForColors: any = [];

    constructor( public userAuthService: UserAuthService, public el: ElementRef) {}

    ngOnInit() {}

    ngOnChanges( changes: SimpleChanges ) {
		this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';
        const { optionsListType, optionsListForPage } = changes;

        if (
            ( optionsListType && ( optionsListType?.currentValue || !optionsListType?.currentValue ) )
            || ( optionsListForPage && optionsListType?.currentValue )
        ) {
            // `optionsListType?.currentValue` - It should be either `true` or `false`
            this.getFilterOptionItems( this.optionsListForPage );
        }
    }

	getFilterOptionItems( forPage: string ) {
		// let allFilterItems = [],
        //     optionsType: FilterOptionsListType =( this.optionsListType || !this.filtersArray[ forPage ].hasOwnProperty( 'basic' )) ? 'advanced' : 'basic';
		// 	optionsType = ( this.selectedCountry != 'uk' ) ? 'advanced' : optionsType;
		// // Country wise filtering
		// allFilterItems = JSON.parse( JSON.stringify( FilterOptionsIndex[ forPage ][ optionsType ] ) );

		// allFilterItems = allFilterItems.filter( filterItem => {
		// 	if ( filterItem?.items ) {
		// 		filterItem.items = filterItem.items.filter( ( item: ExtendedMenuItems ) => item.countryAccess.includes( this.selectedCountry ) );
		// 	}
		// 	return filterItem.countryAccess.includes( this.selectedCountry );
		// });

		// if ( allFilterItems.length ) {

		// 	// Filtering options with Add-Ons and Feature access
		// 	allFilterItems = allFilterItems.filter( ( filterItem: ExtendedMenuItems ) => {
		// 		if ( filterItem.hasOwnProperty( 'forcedFeatureAccess' ) ) {
		// 			return filterItem.forcedFeatureAccess;
		// 		}

		// 		if ( filterItem.hasOwnProperty( 'rolesAccess' ) ) {
		// 			return this.userAuthService.hasRolePermission( filterItem.rolesAccess );
		// 		}

		// 		if ( filterItem.hasOwnProperty( 'addOnAccessKey' ) ) {
		// 			return this.userAuthService.hasAddOnPermission( filterItem.addOnAccessKey );
		// 		}

		// 		if ( filterItem?.items ) {
		// 			filterItem.items.map( ( item: ExtendedMenuItems ) => {
		// 				let featureAccessLabel = item?.featureAccessKey || item?.chipGroupLabel || item?.displayLabel || item?.label;
		// 				let featureAccessFilterGroup = item?.group || undefined;

		// 				if ( !( this.userAuthService.hasFeaturePermission( featureAccessLabel, featureAccessFilterGroup ) ) ) {
		// 					item.locked = true;
		// 				} else {
		// 					item.locked = false;
		// 				}

		// 				if ( item.hasOwnProperty('addOnAccessKey') ) {

		// 					if ( !( this.userAuthService.hasAddOnPermission( item.addOnAccessKey ) ) ) {
		// 						item.locked = true;
		// 					} else {
		// 						item.locked = false;
		// 					}

		// 				}

		// 				if ( item.hasOwnProperty( 'forcedFeatureAccess' ) && item.forcedFeatureAccess ) {
		// 					item.locked = false;
		// 				}
		// 			});
		// 		}

		// 		return true;
		// 	});


		// }

		// store color map
		// iterate through the array

		this.formatArrayForColors = JSON.parse(localStorage.getItem('filter')).map( item => {
			if ( item.key == 'companySearch' && this.selectedGlobalCountry == 'uk' ) {
				for(let result of item.items) {
					switch(result.label) {
						case "Company Profile":
							result['bgLight'] = AccordionLightShades['combine'];
							result['bgDark'] = AccordionDarkShades['combine'];
							break;
						case "Industry":
							result['bgLight'] = AccordionLightShades['combine'];
							result['bgDark'] = AccordionDarkShades['combine'];
							break;
						case "Registered Location":
							result['bgLight'] = AccordionLightShades['combine'];
							result['bgDark'] = AccordionDarkShades['combine'];
							break;
						case "Financial Profile":
							result['bgLight'] = AccordionLightShades['combine'];
							result['bgDark'] = AccordionDarkShades['combine'];
							break;
						case "County Court Judgement":
							result['bgLight'] = AccordionLightShades['combine'];
							result['bgDark'] = AccordionDarkShades['combine'];
							break;
						case "Filed Accounts":
							result['bgLight'] = AccordionLightShades['combine'];
							result['bgDark'] = AccordionDarkShades['combine'];
							break;
						case "Company Support Services":
							result['bgLight'] = AccordionLightShades['private'];
							result['bgDark'] = AccordionDarkShades['private'];
							break;
						case "Write-offs":
							result['bgLight'] = AccordionLightShades['private'];
							result['bgDark'] = AccordionDarkShades['private'];
							break;
						case "Directors":
							result['bgLight'] = AccordionLightShades['private'];
							result['bgDark'] = AccordionDarkShades['private'];
							break;
						case "Shareholdings":
							result['bgLight'] = AccordionLightShades['private'];
							result['bgDark'] = AccordionDarkShades['private'];
							break;
						case "Events":
							result['bgLight'] = AccordionLightShades['private'];
							result['bgDark'] = AccordionDarkShades['private'];
							break;
						case "Innovate UK":
							result['bgLight'] = AccordionLightShades['public'];
							result['bgDark'] = AccordionDarkShades['public'];
							break;
						case "Patent And Trade Marks":
							result['bgLight'] = AccordionLightShades['public'];
							result['bgDark'] = AccordionDarkShades['public'];
							break;
						case "Corporate Risk":
							result['bgLight'] = AccordionLightShades['addOn'];
							result['bgDark'] = AccordionDarkShades['addOn'];
							break;
						case "Lending":
							result['bgLight'] = AccordionLightShades['addOn'];
							result['bgDark'] = AccordionDarkShades['addOn'];
							break;
						case "Diversity":
							result['bgLight'] = AccordionLightShades['addOn'];
							result['bgDark'] = AccordionDarkShades['addOn'];
							break;
						case "International Trade":
							result['bgLight'] = AccordionLightShades['addOn'];
							result['bgDark'] = AccordionDarkShades['addOn'];
							break;
						case "Property Register":
							result['bgLight'] = AccordionLightShades['addOn'];
							result['bgDark'] = AccordionDarkShades['addOn'];
							break;
						case "Personnel Contact Information":
							result['bgLight'] = AccordionLightShades['addOn'];
							result['bgDark'] = AccordionDarkShades['addOn'];
							break;
						case "Company Contact Information":
							result['bgLight'] = AccordionLightShades['addOn'];
							result['bgDark'] = AccordionDarkShades['addOn'];
							break;
						case "Benchmarking":
							result['bgLight'] = AccordionLightShades['addOn'];
							result['bgDark'] = AccordionDarkShades['addOn'];
							break;
						case "Mergers and Acquisitions":
							result['bgLight'] = AccordionLightShades['addOn'];
							result['bgDark'] = AccordionDarkShades['addOn'];
							break;
						default:
							result['bgLight'] = AccordionLightShades['combine'];
							result['bgDark'] = AccordionDarkShades['combine'];
							break;
					}
				}
				return item;
			} else {
				return item;
			}
		} );

		
		
		let temp = [];
		this.formatArrayForColors.filter( ( item ) => {
			if ( [forPage].includes(item?.key) ) {
				temp = item['items'];
			}
		});

		// Assigning filter options
		this.filterOptionsItems.individual = temp.filter( ( item: ExtendedMenuItems ) => !item.hasOwnProperty('items') );
		this.filterOptionsItems.grouped = this.groupFilterItems(temp, forPage);
	}

	groupFilterItems(filterItem: any[], page: string) {
		let groupedItems = filterItem.filter( filter =>{
			if (filter.hasOwnProperty('items')) {
				if (page == 'companySearch' ) {
					setTimeout(() => {
						this.setAccordionBackgroundColor(filter.bgLight, filter.bgDark, filter.label);
					}, 0);
					return filter;
				} else {
					return filter;
				}
			} 
		});
		return groupedItems;
	}

	setAccordionBackgroundColor(lightShade: string, darkShade: string, label: string) {
		let anchorElement = this.el.nativeElement.querySelectorAll('p-accordionTab>.p-accordion-tab>.p-accordion-header>.p-accordion-header-link');
		for(let item of anchorElement) {
			if ( item ) {
				let labeltext = item.querySelector('.p-accordion-header-text');
				if ( labeltext.innerText == label ) {
					if ( item.parentNode.parentNode.classList.contains('p-accordion-tab-active') ) {
						item.style.backgroundColor = darkShade;
						break;
					} else {
						item.style.backgroundColor = lightShade;
						break;
					}
				}
			}
		}
	}

	activeDeactiveBgColor() {
		for(let colorItem of this.formatArrayForColors) {
			if ( this.optionsListForPage == colorItem.key ) {
				for(let key of colorItem.items) {
					setTimeout(() => {
						this.setAccordionBackgroundColor(key.bgLight, key.bgDark, key.label);
					}, 0);
				}
			} 
			return;
		}
	}

	searchInFiltersByKeywords( event: any ) {
		if ( event.target.value ) {
			this.filterItemsRawForSearch = this.prepareFlatArrayFromFilterOptions( this.filterOptionsItems.grouped, event.target.value );
		}
	}

	prepareFlatArrayFromFilterOptions( filterOptionsInputArray: Partial< ExtendedMenuItems[] >, queryString: string ): Partial< ExtendedMenuItems[] > {
		let modifiedFilterOptsArr: Partial< ExtendedMenuItems[] > = [];
		queryString = queryString.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

		modifiedFilterOptsArr = filterOptionsInputArray.reduce( ( modfdArr, currentData, dataIndx ) => {

			if ( currentData?.items ) {
				let modfdfilterItems = currentData?.items.map( ( { label, displayLabel }, indx ) => {
					let matchString = ( displayLabel && displayLabel.match( new RegExp( queryString, 'gi' ) ) ) || ( label.match( new RegExp( queryString, 'gi' ) ) );
					if ( !!matchString ) {
						return ({
							label,
							displayLabel,
							filterGroup: ( currentData?.displayLabel ) ? currentData?.displayLabel : currentData?.label,
							parentIndex: dataIndx,
							childIndex: indx,
						});
					}
					return {};
				});
	
				if ( modfdfilterItems?.length ) {
					modfdArr.push( ...modfdfilterItems.filter( item => !!Object.keys( item ).length ) );
				}
			}

			return modfdArr;
		}, []);

		return modifiedFilterOptsArr;
	}

	goToSelectedFilterItem( selectedItem?: { label: string, displayLabel: string, filterGroup: string, parentIndex: number, childIndex: number } ) {
		this.searchInFilterInputKeyword = '';
		this.filterItemsRawForSearch = [];
		
		const { parentIndex, childIndex } = selectedItem;

		this.filterOptionsItems.grouped.map( filterItem => { filterItem.selected = false });
		this.filterOptionsItems.grouped[ parentIndex ].selected = true;

		let selectedFilterChildByIndex = this.filterOptionsItems.grouped[ parentIndex ].items[ childIndex ];

		setTimeout(() => {
			// Getting the DOMs from the filter items
			const AccordionContainer = document.querySelector('.propsContainer.first');
			const selectedFilterOptionParent = document.querySelector('.propsContainer.first .p-accordion').children[ parentIndex ] as HTMLElement;
			const selectedFilterOptionElement = selectedFilterOptionParent.children[0].children[1].children[0].children[0].children[ childIndex ] as HTMLElement;
			
			// To move scroll porition to the selected filter item
			AccordionContainer.scrollTo({
				top: selectedFilterOptionElement.getBoundingClientRect().top - AccordionContainer.getBoundingClientRect().top - 30,
				behavior: 'smooth'
			});
		}, 300);

		// The below method should only be triggered after the above scoll event
		setTimeout(() => {
			this.filterItemClickHandler( selectedFilterChildByIndex );
		}, 100);
	}

	filterItemClickHandler( filterItem: ExtendedMenuItems, parentFilterItem?: ExtendedMenuItems ) {

		let outputValue = {};
		this.selectedFilterOptionItem = { ...filterItem };
		outputValue = JSON.parse( JSON.stringify( this.selectedFilterOptionItem ) );
		
		if ( parentFilterItem ) {
			outputValue = { ...outputValue, parentLabel: ( parentFilterItem?.displayLabel || parentFilterItem.label ) };
		}

		this.filterOptionsItemsOutput.emit( outputValue );

	}

	highlightMatchedWords(realStr, toFindStr) {
		toFindStr = toFindStr.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
		return realStr.replace(new RegExp(toFindStr, 'gi'), (match) => `<b class='c-green'>${match}</b>`);
	}

}