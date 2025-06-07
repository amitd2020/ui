import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';

import { ConfirmationService, MenuItem } from 'primeng/api';

import { subscribedPlan } from 'src/environments/environment';

import { SearchFiltersService } from 'src/app/interface/service/search-filter.service';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SharedLoaderService } from '../shared-loader/shared-loader.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SearchCompanyService } from '../../features-modules/search-company/search-company.service';
import { ListPageName } from '../../features-modules/search-company/search-company.constant';
import { APIPathParamsType, ExtendedMenuItems, FilterSecondBlockComponentOutputTypes, RadiusPropTypes } from './filter-option-types';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';
import { lastValueFrom } from 'rxjs';
import { latLongModel } from 'src/app/interface/models/company-data-model';
import { InputRangeRecord } from './range-input-field/range-input.const';

@Component({
	selector: 'dg-filter-sidebar',
	templateUrl: './filter-sidebar.component.html',
	styleUrls: ['./filter-sidebar.component.scss'],
	providers: [SearchFiltersService]
})

export class FilterSidebarComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

	@ViewChild('saveInFilterForm', { static: false }) saveInFilterForm: NgForm;
	@ViewChild('filterSearchContainer', { static: false }) filterSearchContainer: ElementRef;

	@Input() currentView: string;
	@Input() resetSelectedFilter: any;
	@Input() thisPage: string;
	@Input() saveUpdateExisting: object = {};
	@Input() resetAppliedFiltersBoolean: boolean = false;
	@Input() defaultSearchData: boolean = false;
	
	@Output() searchResultsCommunicator = new EventEmitter<any>();
	@Output() totalFoundResultsCountCommunicator = new EventEmitter<any>();

	@Output() selectedIndustrySicCodeCommunicate = new EventEmitter<any>();
	@Output() communicateToTradeDataTable = new EventEmitter<any>();

	selectedFilterOptionItem: Partial< ExtendedMenuItems > = {};
	selectedFinanciallterOptionItem: Array<any> = [];
	selectedGlobalCountry: string = 'uk';

	aggregateListDataArray: Array<any> = [];
	postCodesRadiusProps: { postCode?: string, radius: number, location?: latLongModel } = {
		radius: 0
	};
	preSelectedFilterValues: FilterSecondBlockComponentOutputTypes = {};
	selectedSavedListParams: { listId?: string, pageName?: string } = { listId: '', pageName: '' };
	otherSearchTypeViewActiveButtons: Array< string > = [];
	otherSearchTypeViewButtons: MenuItem[] = [];

	searchType: String;
	userDetails: Partial< UserInfoType > = {};
	userFilterValue: any;
	filterNameData: string = '';
	exclude : boolean = false;
	subscribedPlanModal: any = subscribedPlan;

	saveInFilterModalDialog: boolean;
	saveFilterData: boolean = false;
	dissolvedIndex: boolean = false;
	showLoginDialog: boolean = false;
	filterExcludeBoolean: boolean = false;
	msgs = [];
	appliedFilters: any = [];
	tempLandCostValueChipObject: object = {}; // Marked for recheck and then remove
	payloadForChildApi;
	selectedPropValues: Array<any> = [];
	filteredResultsValues: Array<any> = []; // Marked for recheck and then remove
	totalFoundResultsCount: number = 0;
	companyNameNumberDashboard: any; // Marked for recheck and then remove
	directorNameDashboard: any; // Marked for recheck and then remove
	incorp_start: any = undefined;
	incorp_end: any = undefined;
	queryString = window.location.search;
	saveFiltersName: any;
	saveFiltersId: any;
	industryListDropdownOptions: Array<object> = [
		{ label: 'A - Agriculture forestry and fishing', value: 'agriculture forestry and fishing' },
		{ label: 'B - Mining and quarrying', value: 'mining and quarrying' },
		{ label: 'C - Manufacturing', value: 'manufacturing' },
		{ label: 'D - Electricity, gas, steam and air conditioning supply', value: 'electricity, gas, steam and air conditioning supply' },
		{ label: 'E - Water supply, sewerage, waste management and remediation activities', value: 'water supply, sewerage, waste management and remediation activities' },
		{ label: 'F - Construction', value: 'construction' },
		{ label: 'G - Wholesale and retail trade; repair of motor vehicles and motorcycles', value: 'wholesale and retail trade; repair of motor vehicles and motorcycles' },
		{ label: 'H - Transportation and storage', value: 'transportation and storage' },
		{ label: 'I - Accommodation and food service activities', value: 'accommodation and food service activities' },
		{ label: 'J - Information and communication', value: 'information and communication' },
		{ label: 'K - Financial and insurance activities', value: 'financial and insurance activities' },
		{ label: 'L - Real estate activities', value: 'real estate activities' },
		{ label: 'M - Professional, scientific and technical activities', value: 'professional, scientific and technical activities' },
		{ label: 'N - Administrative and support service activities', value: 'administrative and support service activities' },
		{ label: 'O - Public administration and defence; compulsory social security', value: 'public administration and defence; compulsory social security' },
		{ label: 'P - Education', value: 'education' },
		{ label: 'Q - Human health and social work activities', value: 'human health and social work activities' },
		{ label: 'R - Arts, entertainment and recreation', value: 'arts, entertainment and recreation' },
		{ label: 'S - Other service activities', value: 'other service activities' },
		{ label: 'T - Activities of households as employers; undifferentiated goods- and services-producing activities of households for own use', value: 'activities of households as employers; undifferentiated goods- and services-producing activities of households for own use' },
		{ label: 'U - Activities of extraterritorial organisations and bodies', value: 'activities of extraterritorial organisations and bodies' }
	];
	switchBasicAndAdvanceFilter: boolean = true;
	companyNameNumBool: boolean = false;
	visible: boolean = false;
	listId: string;

	constructor(
		private searchFiltersService: SearchFiltersService,
		private activeRoute: ActivatedRoute,
		public userAuthService: UserAuthService,
		private decimalPipe: DecimalPipe,
		private titlecase: TitleCasePipe,
		private location: Location,
		public commonService: CommonServiceService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunicate: ServerCommunicationService,
		private confirmationService: ConfirmationService,
		public searchCompanyService: SearchCompanyService,
		private router: Router,
	) { }

	ngOnInit() {

		this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';

		this.saveFiltersName = this.activeRoute.snapshot?.queryParams['saveFiltersName'] ? this.activeRoute.snapshot.queryParams['saveFiltersName'] : this.saveUpdateExisting?.['existingSaveFiltersName'];
		this.saveFiltersId = this.activeRoute.snapshot?.queryParams['saveFiltersId'] ? this.activeRoute.snapshot.queryParams['saveFiltersId'] : this.saveUpdateExisting?.['existingSaveFiltersId'];

		this.searchCompanyService.$templateView.subscribe( res => {
			this.currentView = res;
		});

		this.userDetails = this.userAuthService?.getUserInfo();

		const {  company: companyNameNumberParam, cListId, chipData, shareId } = JSON.parse(JSON.stringify( this.activeRoute.snapshot.queryParams ) );
		this.listId = cListId;

		if ( companyNameNumberParam ) {
			this.companyNameNumBool = true;
		} else {
			this.companyNameNumBool = false;
		}

		this.searchCompanyService.$apiPayloadBody.subscribe( res => {
			this.payloadForChildApi = res;
        });
		
		if( this.thisPage == 'contractFinderPage') {
		this.selectedPropValues = this.payloadForChildApi.filterData;
			// if ( chipData || shareId || cListId ) {
			// 	this.selectedPropValues = this.payloadForChildApi.filterData;
			// }else if( cListId  ) {
			// 	this.selectedPropValues.push(this.payloadForChildApi.filterData[0]);
			// 	this.selectedPropValues.push(this.payloadForChildApi.filterData[1]);
			// } else  {
			// 	this.selectedPropValues.push(this.payloadForChildApi.filterData[0]);
			// } 
		}
			
		if (this.thisPage == 'companySearch' || this.thisPage == 'landRegistry' || this.thisPage == 'landCorporate' || this.thisPage == 'esgIndex' || this.thisPage == 'accountSearch' || this.thisPage == 'companyDescription' || this.thisPage == 'chargesDescription' || this.thisPage == 'companyLinkedIn' || this.thisPage == 'personLinkedIn' || this.thisPage == 'investor-finder' || this.thisPage == 'investee-finder') {
 
            this.userFilterValue = undefined;
            this.userFilterValue = this.payloadForChildApi.filterData;

            if ( this.activeRoute.snapshot.queryParamMap.get("dgInsights")) {
                this.dissolvedIndex = true;
            }
           
            if ( this.userFilterValue ) {
				
				let tempSelectedPropValues = this.userFilterValue;

                tempSelectedPropValues.forEach((element, index) => {
					
					if (element.chip_group == "Bands") {
                        element.chip_values = element.chip_values[0]  == 'Not Scored /Very High Risk' ? ['not scored'] :  element.chip_values;
                        this.selectedPropValues.push(element);
                    } else {
						this.selectedPropValues.push(element);
					}
					
                });

				if ( this.thisPage == 'companySearch' ) {
					setTimeout( () => {
						this.updateOtherSearchTypeViewButtons();
					}, 1000);
				}
				
            }

            this.incorp_start = this.activeRoute.snapshot.queryParamMap.get("incorp_start");
            this.incorp_end = this.activeRoute.snapshot.queryParamMap.get("incorp_end");

            if (this.incorp_start && this.incorp_end) {
                var incorp_date_array = [];
                incorp_date_array.push(this.incorp_start);
                incorp_date_array.push(this.incorp_end);
                incorp_date_array.push("From " + this.incorp_start + " to " + this.incorp_end);
                this.selectedPropValues.push({ chip_group: 'Incorporation Date', chip_values: [incorp_date_array], "companySearchAndOr": 'and' });
            }

            if (this.thisPage === 'companySearch' && !this.incorp_start && !this.incorp_end && !this.userFilterValue && !this.companyNameNumberDashboard && !this.directorNameDashboard && !this.activeRoute.snapshot.queryParamMap.get("dgInsights") && !this.activeRoute.snapshot.queryParams['listPageName'] ) {
				this.selectedPropValues = this.selectedPropValues.filter( ({chip_group}) => chip_group != 'Status' );
                this.selectedPropValues.push({ "chip_group": "Status", "chip_values": ["live"] });
            }

			if ( this.filterSearchContainer != undefined ) {
				this.toggleSidebarFilters();
			}

			if ( this.userAuthService.hasFeaturePermission( 'Global Filter' ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {

				setTimeout(() => {
					if (this.filterSearchContainer.nativeElement.classList.contains('showFilters')) {
						document.body.classList.add('filterPanelOpen');
					}
				}, 0);
				
			}

        }

	}

	ngAfterViewInit(): void {
		
		setTimeout(() => {
			if ( !Object.keys( this.activeRoute.snapshot.queryParams ).length ) {
				this.openSidebar();
			}
		}, 500);

		if ( this.thisPage == 'companySearch' ) {
			this.otherSearchTypeViewButtons = [
				{ label: 'View Contacts', icon: 'ui-icon-email', state: { visibilityCheckKey: 'contact' }, command: () => { this.applyFilters( 'contact' ); } },
				{ label: 'Show Trade Info', icon: 'ui-icon-bar-chart', state: { visibilityCheckKey: 'trade' }, command: () => { this.applyFilters( 'trade' ); } },
				{ label: 'View Director', icon: 'ui-icon-person', state: { visibilityCheckKey: 'director' }, command: () => { this.applyFilters( 'director' ); } },
				{ label: 'Charge Dashboard', icon: 'ui-icon-dashboard', state: { visibilityCheckKey: 'chargesDashboard' }, command: () => { this.applyFilters( 'chargesDashboard' ); } },
				{ label: 'Show Charge Info', icon: 'ui-icon-account-balance', state: { visibilityCheckKey: 'charges' }, command: () => { this.applyFilters( 'charges' ); } }
			]
		}
	}

	async saveListName( pageSize?: number, startAfter?: number ) {
	
		this.sharedLoaderService.showLoader();
		let paramObj, queryParamsArray;

		if ( this.selectedFilterOptionItem['endPointForGetSavedList'] && this.selectedFilterOptionItem['endPointForGetSavedList']?.['pageName'] ) {
			queryParamsArray = [
				{ key: 'userId', value: this.userDetails?.dbID },
				{ key: 'pageName', value: this.selectedFilterOptionItem['endPointForGetSavedList']['pageName'] },
				{ key: 'limit', value: 100 },
				{ key: 'skip', value: 0 }
			]
		} else {
			paramObj = [ pageSize ? pageSize : 100, startAfter ? startAfter : 1 ]
		}


		const UserListsApiResponse = await lastValueFrom( this.globalServerCommunicate.globalServerRequestCall( 'get', this.selectedFilterOptionItem['endPointForGetSavedList']['route'],  this.selectedFilterOptionItem['endPointForGetSavedList']['endPoint'], paramObj, undefined, queryParamsArray ) );
		
		if ( UserListsApiResponse ) {

			UserListsApiResponse.body['results'].map ( val => {
				return val['listNameDisplay'] = `${ this.titlecase.transform( val.listName ) } (${ this.decimalPipe.transform( val.companiesInList, '1.0-0' ) })`;
			});

			this.aggregateListDataArray =  UserListsApiResponse.body['results'];
			// .filter( list => [ ListPageName.company.inputPage.replace(/\s/g, '').toLowerCase(), ListPageName.trade.inputPage.replace(/\s/g, '').toLowerCase() ].includes( ( list && list?.page ) ? list.page.replace(/\s/g, '').toLowerCase() : '' ) );

		}
	
		this.sharedLoaderService.hideLoader();

	}

	selectList( event: { pageName: string, listId: string, listName: string } ) {

		/**
		 * Confirmation Service will only be work if any filter criteria already added.
		 * `this.selectedPropValues.filter( val => val['chip_group'] != 'Saved Lists' )` - Removing save list if already added and then checking the length.
		*/

		if ( this.selectedPropValues.filter( val => val['chip_group'] != 'Saved Lists' ).length ) {

			return this.confirmationService.confirm({
				header: 'Confirmation',
				message: 'Selected criteria will be cleared and later you can choose any of the filter options according to the selected list. Are you sure?',
				icon: 'pi pi-warning-circle',
				key: 'ConfirmOnSavedListSelect',
				reject: () => {
					return;
				},
				accept: () => {
					return this.proceedSelectList( event );
				}
			});

		}
		
		return this.proceedSelectList( event );
	}

	proceedSelectList( event: { pageName: string, listId: string, listName: string } ) {

		const { pageName, listId, listName } = event;

		this.searchCompanyService.resetFilterPanelApplyButtons();
		this.searchCompanyService.updateListViewTemplate( true, listId, pageName );

		this.selectedPropValues = [];
		this.selectedPropValues.push( { chip_group: "Saved Lists", chip_values: [ listName ] } );

		this.selectedSavedListParams = {
			listId: listId,
			pageName: pageName
		}

		this.searchCompanyService.updatePayload( { listId: listId } );

	}

	ngOnChanges( changes: SimpleChanges ) {
		if( changes.resetAppliedFiltersBoolean?.currentValue == true ){
			if( this.resetSelectedFilter && this.thisPage == 'contractFinderPage')
			this.selectedPropValues = this.resetSelectedFilter
			this.preSelectedFilterValues = this.resetSelectedFilter
		}
		
	}

	ngOnDestroy() {
		document.body.classList.remove('filterPanelOpen');
	}

	toggleSidebarFilters() {
		if ( !this.filterSearchContainer.nativeElement.classList.contains('showFilters') ) {
			this.openSidebar();
		} else {
			this.closeSidebar();
		}
	}

	openSidebar() {
		this.filterSearchContainer.nativeElement.classList.add('showFilters');
		document.body.classList.add('filterPanelOpen');
	}

	closeSidebar() {
		this.filterSearchContainer.nativeElement.classList.remove('showFilters');
		document.body.classList.remove('filterPanelOpen');
	}

	closePropGrp() {
		this.selectedFilterOptionItem = {};
	}

	applyFilters( templateView: string = 'company' ) {
		let obj = {
			appliedFilters: this.selectedPropValues
		}
		this.searchCompanyService.resetPagination();

		if ( this.thisPage == 'companySearch' ) {
			
			switch ( templateView ) {
				case 'director':
					this.searchCompanyService.setDirectorView();
					break;
	
				case 'charges':
					this.searchCompanyService.setChargesView();
					break;

				case 'chargesDashboard':
					this.searchCompanyService.setChargesDashboardView();
					break;
	
				case 'trade':
					this.searchCompanyService.setTradeView();
					break;
	
				case 'contact':
					this.searchCompanyService.setContactView();
					break;
			
				default:
					this.searchCompanyService.setCompanyView();
					break;
			}

		};

		if ( !JSON.stringify( this.selectedPropValues ).includes( 'Saved Lists' ) ) {
			this.searchCompanyService.updateListViewTemplate( false );
		}
		
		this.searchCompanyService.showStatsButton = true;

		this.searchCompanyService.updatePayload( { filterData: JSON.parse(JSON.stringify(this.selectedPropValues)) } );

		// let selectedFinancialData;

		if ( Object.keys( this.activeRoute.snapshot.queryParams ).length ) {
			let selectedFinancialData = this.activeRoute.snapshot.queryParams?.chipData && JSON.parse(this.activeRoute.snapshot.queryParams?.chipData);
			this.location.replaceState('/company-search');
			this.activeRoute.snapshot.queryParams = {};
		}

		if ( this.filterSearchContainer != undefined ) {
			this.toggleSidebarFilters();
		}
		
		// if (this.authGuardService.isLoggedin()) {

			if ( !['buyersDashboard', 'contractFinderPage', 'lendingLandscapePage'].includes(this.thisPage)) {
				if(['accountSearch', 'companyDescription', 'chargesDescription', 'companyLinkedIn', 'personLinkedIn', 'investee-finder', 'investor-finder'].includes(this.thisPage)){
					this.searchResultsCommunicator.emit( obj );
				}else{
					this.searchResultsCommunicator.emit( templateView );
				}


				if ( this.thisPage == 'landRegistry' || this.thisPage == 'landCorporate' ) {
					return;
				}
			}

			this.getFilteredResults();

	}

	getFilteredResults() {

		let obj = {};
		obj['userId'] = this.userDetails?.dbID;

		if (this.selectedPropValues.length > 0) {
			this.sharedLoaderService.showLoader();
		}

		this.totalFoundResultsCount = 0;

		if (this.selectedPropValues.length) {

			if (this.thisPage == 'companySearch' || this.thisPage == 'lendingLandscapePage') {

				this.appliedFilters = JSON.parse( JSON.stringify( this.selectedPropValues ) );

				obj['filterSearch'] = this.appliedFilters;
				obj['filterSearchType'] = "Company Search";
				let sortOn = undefined;

				if (this.activeRoute.snapshot.queryParamMap.get("dgInsights")) {
					sortOn = [{ "Company Status": "desc" }];
				}

			}

			if (['buyersDashboard', 'suppliersDashboard', 'contractFinderPage', 'lendingLandscapePage', 'esgIndex'].includes(this.thisPage) ) {

				if ( this.userDetails?.isSubscriptionActive || this.userAuthService.hasAddOnPermission('governmentEnabler') ) {
					
					this.appliedFilters = [ ...this.selectedPropValues ];
						
					this.applySelectedFilters();
					
				}
				setTimeout(() => {						
					this.sharedLoaderService.hideLoader();
				}, 2000);
			}

			obj['companyNameNumber'] = this.companyNameNumberDashboard;

		}

		setTimeout(() => {						
			this.sharedLoaderService.hideLoader();
		}, 5000);

	}

	applySelectedFilters() {

		let obj = {
			searchResult: this.filteredResultsValues,
			dissolvedIndex: this.dissolvedIndex
		};

		obj['appliedFilters'] = this.appliedFilters;
		
		if(this.thisPage =='lendingLandscapePage') {
			
			let selectedChargeStatus = this.selectedPropValues.filter( (val) => val.chip_group == 'Charges Status' );  // Charges Status counts change condition
			obj['selectedChargeStatus'] = selectedChargeStatus;					// Industry List Table Disabled condition

			let selectedRegionList = this.selectedPropValues.filter( (val) => val.chip_group == 'Region' );  // Charges Region counts change condition
			obj['selectedRegionList'] = selectedRegionList;

		}

		if( ['suppliersDashboard'].includes( this.thisPage ) ) {
			obj['appliedFilters'].map( item => {
				item['chip_industry_supplierCpv_codes'] = item['chip_industry_sic_codes'];
				delete item['chip_industry_sic_codes'];
				return item;
			}); 
		}

		if( ['buyersDashboard'].includes( this.thisPage ) ) {
			obj['appliedFilters'].map( item => {
				item['chip_industry_buyerCpv_codes'] = item['chip_industry_sic_codes'];
				delete item['chip_industry_sic_codes'];
				return item;
			}); 
		}

		if( ['contractFinderPage'].includes( this.thisPage ) ) {
			obj['appliedFilters'].map( item => {
				
				if (item['chip_industry_sic_codes']) {
					item['chip_industry_cpv_codes'] = JSON.parse(JSON.stringify(item['chip_industry_sic_codes']));

					delete item['chip_industry_sic_codes'];

				} 
				return item;
			}); 
		}
		
		this.searchResultsCommunicator.emit(obj);
		this.totalFoundResultsCountCommunicator.emit(this.totalFoundResultsCount);
		
		this.dissolvedIndex = false;

		if(this.thisPage != "buyersDashboard"){
			
			setTimeout(() => {						
				this.sharedLoaderService.hideLoader();
			}, 2000);
		}
		
	}

	showModalDialog() {
		this.saveInFilterModalDialog = true;

		if ( this.saveFiltersName ) {
			this.filterNameData = this.saveFiltersName;
		} else {
			this.filterNameData = "";
		}
	}

	saveInFilter(formData: NgForm, click) {

		if (this.thisPage == 'companySearch') {
			let tempSelectedPropValues = [];
			this.selectedPropValues.forEach(filter => {

				if(filter.chip_group === 'Saved Lists'){
					let obj = {
						chip_group: filter.chip_group,
						chip_values: filter.chip_values,
						saveListData: this.selectedSavedListParams.listId,
					}
					tempSelectedPropValues.push(obj)
				} else if (filter.chip_group === "Post Code") {
					tempSelectedPropValues.push(filter);
				} else if (filter.chip_group == "CCJ Amount" || filter.chip_group == 'Price' || filter.chip_group == 'Write-off Amount') {
					tempSelectedPropValues.push(filter);
				} else if (["Charges Person Entitled", "Charges Person Entitled (Raw)", "Charges Tag", "Charges Status", "Charge Code", "Charges Classification", "Charges Registered Date", 'Select Lenders'].includes(filter.chip_group)) {
					tempSelectedPropValues.push(filter);
				} else if (filter.chip_group == 'Charges Month') {
					let obj = {
						chip_group: "chargesDataMonth",
						chip_values: filter.chip_values
					}
					tempSelectedPropValues.push(obj)
				}
				else {
					tempSelectedPropValues.push(filter);
				}
			});

			this.payloadForChildApi.filterData = [ ...tempSelectedPropValues ];

			if ( this.currentView == 'charges' ) {
				this.searchType = 'Charges Search';
			} else if ( this.currentView == 'trade' ) {
				this.searchType = 'Company Trade-list';
			} else {
				this.searchType = 'Company Search';
			}

		}
		else if ( ['accountSearch', 'companyDescription', 'chargesDescription' ].includes(this.thisPage)){
			let tempSelectedPropValues = [];

			for (let filter of this.selectedPropValues) {
				if (filter['chip_group'] === 'Price') {
					tempSelectedPropValues.push(this.tempLandCostValueChipObject[ filter.chip_group ]);
				} else {
					tempSelectedPropValues.push(filter);
				}
			}
			this.payloadForChildApi.filterData = [ ...tempSelectedPropValues ];
			this.searchType = this.thisPage == 'accountSearch' ? 'Account Search' : this.thisPage == 'companyDescription' ? 'Company Description' : this.thisPage == 'companyLinkedIn' ? 'company': this.thisPage == 'personLinkedIn' ? 'people' : 'Charges Description';
		}
		else if ( ['companyLinkedIn', 'personLinkedIn', 'investor-finder' ].includes(this.thisPage)){
			let tempSelectedPropValues = [];

			for (let filter of this.selectedPropValues) {
				if (filter['chip_group'] === 'Saved Lists') {
					this.searchCompanyService.updatePayload( { listId: this.listId } );
					
				}
				tempSelectedPropValues.push(filter);
			}
			this.payloadForChildApi.filterData = [ ...tempSelectedPropValues ];
			this.searchType = this.thisPage == 'companyLinkedIn' ? 'company': this.thisPage == 'personLinkedIn' ? 'people' : this.thisPage;
		}
		else if (this.thisPage == 'landRegistry') {
			let tempSelectedPropValues = [];

			for (let filter of this.selectedPropValues) {
				// if (filter['chip_group'] === 'Price') {
				// 	tempSelectedPropValues.push(this.tempLandCostValueChipObject[ filter.chip_group ]);
				// 	tempSelectedPropValues.push(filter);
				// } else {
					// tempSelectedPropValues.push(filter);
				// }
				tempSelectedPropValues.push(filter);
			}
			this.payloadForChildApi.filterData = [ ...tempSelectedPropValues ];
			this.searchType = 'Land Registry';
		}

		else if (this.thisPage == 'landCorporate') {

			let tempSelectedPropValues = [];

			for (let filter of this.selectedPropValues) {
				// if (filter['chip_group'] === 'Price') {
				// 	tempSelectedPropValues.push(this.tempLandCostValueChipObject[ filter.chip_group ]);
				// } else {
				// 	tempSelectedPropValues.push(filter);
				// }
				tempSelectedPropValues.push(filter);
			}

			this.payloadForChildApi.filterData = [ ...tempSelectedPropValues ];
			this.searchType = 'Property Register';

		}
		else if (this.thisPage == 'lendingLandscapePage') {

			let tempSelectedPropValues = [];

			tempSelectedPropValues.unshift({ chip_group: 'Status', chip_values: ['live'] }, { chip_group: "Preferences", chip_values: ['Company must have charges details'], preferenceOperator: [{ hasEstimatedTurnover: "true" }] });

			for (let filter of this.selectedPropValues) {

				tempSelectedPropValues.push(filter);
				
			}

			this.payloadForChildApi.filterData = [ ...tempSelectedPropValues ];
			this.searchType = 'Lending Landscape';
		}
		else if ( this.thisPage == 'esgIndex' ) {

			let tempSelectedPropValues = [];

			tempSelectedPropValues.unshift(
				{ chip_group: "Status", chip_values: ["live"] },
				{ chip_group: "Preferences", chip_values: ["Company must have esg details"], preferenceOperator: [{ hasEsgIndexScore: "true" } ] }
			);

			for ( let filter of this.selectedPropValues ) {

				if ( ![ 'Status', 'Preferences'].includes(filter.chip_group) ){
					tempSelectedPropValues.push(filter);
				}

			}

			this.payloadForChildApi.filterData = [ ...tempSelectedPropValues ];
			this.searchType = 'ESG Index';

		}
		else if ( this.thisPage == 'contractFinderPage' ) {

			let tempSelectedPropValues = [];

			for ( let filter of this.selectedPropValues ) {

				tempSelectedPropValues.push(filter);

			}

			this.payloadForChildApi.filterData = [ ...tempSelectedPropValues ];
			this.searchType = 'govermentProcurement';

		}

		let payloadForSavedFilter = {
			userId: this.userDetails?.dbID,
			chipData: this.payloadForChildApi.filterData,
			saveFiltersName: formData.value.filtername,
			searchType: this.searchType,
		};
		
		if( click == 'Update Existing' ) {
			payloadForSavedFilter['saveFiltersID'] = this.saveFiltersId;
		}
		if ( this.payloadForChildApi.hasOwnProperty('pageName') ) {
			payloadForSavedFilter['pageName'] = this.payloadForChildApi.pageName;
		}
		if ( this.payloadForChildApi.hasOwnProperty('listId') ) {
			payloadForSavedFilter['listId'] = this.payloadForChildApi.listId;
		}
		if ( JSON.stringify( this.payloadForChildApi.filterData ).includes( 'Saved Lists' ) ) {
			const listName = this.payloadForChildApi.filterData.filter( val => val.chip_group == 'Saved Lists' )[0].chip_values[0];
			payloadForSavedFilter['listName'] = listName;
		}
		let endPoint;
		if( ['companyLinkedIn', 'personLinkedIn'].includes(this.thisPage)) {
			endPoint = 'saveFiltersForConnectPlus';
		} else {
			endPoint = 'saveFilters';
		}

		this.filterNameData = formData.value.filtername;
		this.saveFilterData = true;

		if ( payloadForSavedFilter.saveFiltersName ) {

			this.globalServerCommunicate.globalServerRequestCall('post', 'DG_API', endPoint, payloadForSavedFilter ).subscribe(res => {

				let data = res.body;

				if (data.status === 200) {
					this.msgs = [];
					this.saveInFilterModalDialog = false;
					this.msgs.push({ severity: 'info', summary: data.message });
					setTimeout(() => {
						this.msgs = [];
					}, 3000);
					this.filterNameData = '';
					this.saveFilterData = false;
					this.saveInFilterForm.reset();

				} else if (data.status === 202) {
					this.msgs = [];
					this.saveInFilterModalDialog = false;
					this.msgs.push({ severity: 'error', summary: data.message });
					setTimeout(() => {
						this.msgs = [];
					}, 3000);
				}
			});

		}
	}

	goToStatsPage(chipData, screen){
		let routeLink = screen == 'growthAnaysis' ? '/stats-analysis/growth-analysis' : '/company-search/stats-insights'
		let payload = { chipData: JSON.stringify(chipData),
			cListId: this.activeRoute.snapshot.queryParams['cListId'] ? this.activeRoute.snapshot.queryParams['cListId'] : this.	payloadForChildApi.listId ? this.payloadForChildApi.listId : '',
			listPageName: this.activeRoute.snapshot.queryParams['listPageName'] ? this.activeRoute.snapshot.queryParams['listPageName'] : this.activeRoute.snapshot.queryParams['cListId'] ? 'companyListPage' : this.payloadForChildApi.pageName ? this.payloadForChildApi.pageName : this.payloadForChildApi.listId ? 'companyListPage' : ''}
		if( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasFeaturePermission('Company Stats')){
			let url = this.router.serializeUrl(
				this.router.createUrlTree([routeLink],{ queryParams: payload} )
			);
			window.open( url, "_blank");
		}
	}

	onToggleChange() {
		this.selectedFilterOptionItem = {};
	}

	/**
	 * Refactored Code Started From The Below.
	 */

	private async getFilterAggregateValues( apiPathParams: APIPathParamsType, inputKeywords?: string ) {

		this.sharedLoaderService.showLoader();

		let aggrFilterDataBody: PayloadFormationObj = null;
		
		if ( this.selectedPropValues.length ) {
			aggrFilterDataBody = { filterData: JSON.parse( JSON.stringify( this.selectedPropValues ) ) };
			aggrFilterDataBody.filterData = aggrFilterDataBody.filterData.filter( ( aggrFilterItem: FilterDataTypes ) => aggrFilterItem.chip_group !== this.selectedFilterOptionItem.chipGroupLabel );

			if ( this.thisPage == 'contractFinderPage' || this.thisPage == 'personLinkedIn' || this.thisPage == 'companyLinkedIn' ) {
				let savedListData = aggrFilterDataBody.filterData.filter( item => item.chip_group == 'Saved Lists' )[0];
				if ( savedListData ) { 
					this.payloadForChildApi.listId = this.listId; 
				} else if( !savedListData ) {
					this.payloadForChildApi.listId = '';
				}
			}

			if ( this.payloadForChildApi?.listId ) {
				aggrFilterDataBody = {
					...aggrFilterDataBody,
					listId: this.payloadForChildApi.listId,
					pageName: this.payloadForChildApi.pageName
				}
			}
		}

		const AggregateAPIResponse = await this.searchFiltersService.getAggregateValues(
			apiPathParams,
			this.selectedFilterOptionItem.key,
			aggrFilterDataBody,
			( inputKeywords || '' ), 
			this.thisPage
		);
	
		this.sharedLoaderService.hideLoader();

		return AggregateAPIResponse;
	}

	/** Click handler for the filter option items ( like - Company Name, Status, SIC Code, Industry Tags... ) in the first section */
	async filterItemClickHandler( filterItem: ExtendedMenuItems ) {

		if ( this.selectedFilterOptionItem && ( JSON.stringify( this.selectedFilterOptionItem ) == JSON.stringify( filterItem ) ) ) {
			return;
		}

		this.selectedFilterOptionItem.label = 'Loading...';
		this.aggregateListDataArray = [];

		delete this.selectedFilterOptionItem?.componentTypes;
		
		this.postCodesRadiusProps = {
			radius: 0,
			postCode: '',
			location: null
		}

		setTimeout( async () => {
			this.selectedFilterOptionItem = { ...filterItem };
		
			if ( this.selectedFilterOptionItem?.locked ) {
				this.selectedFilterOptionItem.componentTypes = [ 'upgrade-plan' ];
				return;
			}

			const { label, key, componentFeatures } = this.selectedFilterOptionItem;

			this.selectedFinanciallterOptionItem = [ { label, key, componentFeatures, ...InputRangeRecord?.[ label ] } ];
	
			if ( filterItem.label === 'Saved Lists' ) {
				this.saveListName();
				return;
			}
	
			if ( filterItem?.withAggregation ) {

				for( let selectedPropValue of this.selectedPropValues ) {
					if ( selectedPropValue.chip_group.includes('Search By Position') && this.selectedFilterOptionItem.chipGroupLabel == 'Person LinkedIn Position' ) {
						this.aggregateListDataArray = [];
						return;
					}
				}

				if ( this.selectedFilterOptionItem.chipGroupLabel == 'SIC Industry' ) {
					this.aggregateListDataArray = this.industryListDropdownOptions;
				} else if ( this.selectedFilterOptionItem.componentTypes.includes( 'tree-list' ) ) {
					this.sharedLoaderService.showLoader();
					this.aggregateListDataArray = await this.searchFiltersService.getAggregateIndustryCodeValues( this.selectedFilterOptionItem.withAggregation );
					this.sharedLoaderService.hideLoader();
				} else {
					this.aggregateListDataArray = await this.getFilterAggregateValues( this.selectedFilterOptionItem.withAggregation );
				}
				
				if ( this.selectedFilterOptionItem?.key && [ 'total_non_financial_score', 'financial_total', 'future_Growth_Score'].includes(this.selectedFilterOptionItem.key)  ) {
					const { maxValue, minValue } = this.aggregateListDataArray[0];
					this.selectedFinanciallterOptionItem[0]['maxValue'] = maxValue;
					this.selectedFinanciallterOptionItem[0]['minValue'] = minValue;
					this.selectedFilterOptionItem['additionalNote'] = `*Range between ${minValue} to ${ maxValue }`
				}

			}

			if ( this.selectedPropValues.length ) {
			
				const filterGroupLabel = ( this.selectedFilterOptionItem?.chipGroupLabel || this.selectedFilterOptionItem.label );
				const selectedFilterGroupValues = this.selectedPropValues.filter( filterValue => filterValue.chip_group == filterGroupLabel )[0];

				this.preSelectedFilterValues = selectedFilterGroupValues || {};
			}

		}, 5);


	}

	/** Output handler from the Components ( like - String Search, Checkbox-Options, List-Box, Date Range... ) in the second section */
	async secondBlockComponentsOutputHandler( outputValues: FilterSecondBlockComponentOutputTypes & RadiusPropTypes ) {

		const { chip_values, filterInputKeywords, pageName, listId } = outputValues;
		
		if ( filterInputKeywords || filterInputKeywords == '' ) {
			this.aggregateListDataArray = await this.getFilterAggregateValues( this.selectedFilterOptionItem.withAggregation, outputValues.filterInputKeywords );
		}

		if ( chip_values ) {

			const filterGroupLabel = ( this.selectedFilterOptionItem?.chipGroupLabel || this.selectedFilterOptionItem.label );
			const label = this.selectedFilterOptionItem.label;
	
			if ( this.selectedPropValues.length ) {
				this.selectedPropValues = this.selectedPropValues.filter( filterValue => filterValue.chip_group !== filterGroupLabel );
			}
	
			if ( chip_values.length ) {

				if ( filterGroupLabel == 'Saved Lists' && listId ) {
					this.selectList( { pageName, listId, listName: chip_values[0] } );
					return;
				}

				if ( filterGroupLabel.includes('Post Code') || filterGroupLabel.includes('PostCode') ) {

					let radiusMilesToBeAdded = '';

					if ( this.selectedFilterOptionItem.componentTypes.includes( 'radius-slider' ) ) {
						radiusMilesToBeAdded = ` ( ${ this.postCodesRadiusProps.radius } Miles )`;
					}

					if ( chip_values.length == 1 ) {
						this.postCodesRadiusProps.postCode = outputValues.chip_values[0];
						if(outputValues?.filter_exclude){
							this.postCodesRadiusProps.radius = 0;
							radiusMilesToBeAdded = ` ( ${ 0 } Miles )`;
							outputValues.chip_values = [ `${ this.postCodesRadiusProps.postCode.toUpperCase() }${ radiusMilesToBeAdded }` ];
						}else {
							outputValues.chip_values = [ `${ this.postCodesRadiusProps.postCode.toUpperCase() }${ radiusMilesToBeAdded }` ];
						}
						
						if ( this.postCodesRadiusProps.radius > 0 ) {
							
							let postCodeDoubleArray = JSON.parse( JSON.stringify( [ outputValues.chip_values ] ) );
							outputValues.chip_values = postCodeDoubleArray;
	
							this.selectedFilterOptionItem.componentFeatures = this.selectedFilterOptionItem.componentFeatures.filter( feature => feature !== 'multi' );
							this.selectedFilterOptionItem.componentFeatures.push('single');

							if ( JSON.stringify( this.aggregateListDataArray ).includes( "not specified" ) ) {
								this.aggregateListDataArray = this.aggregateListDataArray.filter( postCodeValues => postCodeValues.key !== 'not specified' );
							}
						}
					}
					this.filterExcludeBoolean = outputValues?.filter_exclude;
					
					if ( chip_values.length > 1 ) {
						
						this.postCodesRadiusProps.radius = 0;
						this.postCodesRadiusProps.postCode = '';
						outputValues.chip_values = outputValues.chip_values.map( postCodeVal => `${ postCodeVal.toUpperCase() }${ radiusMilesToBeAdded }` );
					}
					
				}

				this.selectedPropValues.push({
					chip_group: filterGroupLabel,
					label: label,
					...outputValues
				});
				
			}

			if ( this.thisPage == 'companySearch' && !listId ) {
				this.updateOtherSearchTypeViewButtons();
			}

		}

	}

	/** Output handler from the Component Displaying the chip values in the third section in case of removing the chip values */
	displayStyleFilterOutputHandler( outputValues: { groupName: string, filterValues: FilterSecondBlockComponentOutputTypes[] } ) {

		const { groupName, filterValues } = outputValues;

		this.selectedPropValues = filterValues;
	
		const filterGroupLabel = ( this.selectedFilterOptionItem?.chipGroupLabel || this.selectedFilterOptionItem.label );
		const matchedFilterValues = this.selectedPropValues.filter( item => item.chip_group == filterGroupLabel )[0];

		if ( groupName == 'Saved Lists' && !( matchedFilterValues ) ) {
			this.selectedSavedListParams = null;
		}

		if ( filterGroupLabel == groupName ) {
		
			this.preSelectedFilterValues = matchedFilterValues ? JSON.parse( JSON.stringify( matchedFilterValues ) ) : {};

			if ( this.selectedFilterOptionItem.label.includes('Post Code') || this.selectedFilterOptionItem.label.includes('PostCode') ) {
				
				if ( !Object.keys( this.preSelectedFilterValues ).length && this.postCodesRadiusProps.radius ) {
					this.postCodesRadiusProps.radius = 0;
				}
					
				if ( this.preSelectedFilterValues?.chip_values?.length == 1 ) {
					this.postCodesRadiusProps.postCode = this.preSelectedFilterValues.chip_values[0].match( new RegExp( /([A-Z0-9])\w+/gi ) )[0];
				}

				if ( this.selectedFilterOptionItem.componentFeatures.includes('single') ) {
					setTimeout( () => {
						this.selectedFilterOptionItem.componentFeatures = this.selectedFilterOptionItem.componentFeatures.filter( feature => feature !== 'single' );
						this.selectedFilterOptionItem.componentFeatures.push('multi');
					}, 500 );
				}

			}

		}

		if ( this.thisPage == 'companySearch' ) {
			this.updateOtherSearchTypeViewButtons();
		}

	}

	clearAllSelectedFilterValues() {
		this.selectedPropValues = [];
		this.preSelectedFilterValues = {};
		this.otherSearchTypeViewActiveButtons = [];
		this.postCodesRadiusProps = {
			radius: 0,
			postCode: '',
			location: null
		}

		if ( this.thisPage == 'companySearch' ) {
			// this.updateOtherSearchTypeViewButtons();
			this.searchCompanyService.resetPayload();
		}
	}

	updateOtherSearchTypeViewButtons() {

		this.searchCompanyService.updateFilterPanelApplyButtons( this.selectedPropValues, this.selectedGlobalCountry );
		this.otherSearchTypeViewActiveButtons = [];
		
		for ( let viewName in this.searchCompanyService.filterPanelApplyButtons ) {
			const viewButton = this.otherSearchTypeViewButtons.find( buttonItem => buttonItem.state.visibilityCheckKey == viewName );
			if ( viewButton ) {
				viewButton.visible = false;
			}
			
			if ( ( viewName !== 'company' ) && this.searchCompanyService.filterPanelApplyButtons[ viewName ] ) {
				this.otherSearchTypeViewActiveButtons.push( viewName );
				if ( viewButton ) {
					viewButton.visible = true;
				}
			}
		}

	}
	
}