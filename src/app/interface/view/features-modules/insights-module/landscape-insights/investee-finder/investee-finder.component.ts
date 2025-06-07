import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiSelect } from 'primeng/multiselect';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SearchFiltersService } from 'src/app/interface/service/search-filter.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { AdminRecordListComponent } from 'src/app/interface/view/shared-components/shared-tables/admin-record-list/admin-record-list.component';
import { subscribedPlan } from 'src/environments/environment';
import { Location } from '@angular/common';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { lastValueFrom } from 'rxjs';
import { SearchCompanyService } from '../../../search-company/search-company.service';

export enum Month {
	undefined, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
}

@Component({
	selector: 'dg-investee-finder',
	templateUrl: './investee-finder.component.html',
	styleUrls: ['./investee-finder.component.scss'],
	providers: [AdminRecordListComponent]
})

export class InvesteeFinderComponent implements OnInit {

	@ViewChild('LazyLeafletMapContainer', { read: ViewContainerRef }) LazyLeafletMapContainer: ViewContainerRef;
	@ViewChild('multiSelectForSicCodeMultiSelectId', { static: false }) public multiSelectForSicCodeMultiSelectId: MultiSelect;
	@ViewChild('multiSelectForIndustryTags', { static: false }) public multiSelectForIndustryTags: MultiSelect;
	@ViewChild('multiSelectRegionMultiSelectId', { static: false }) public multiSelectRegionMultiSelectId: MultiSelect;
	@ViewChild('saveInFilterForm', { static: false }) saveInFilterForm: NgForm;

	subscribedPlanModal: any = subscribedPlan;

	showUpgradePlanDialog: boolean = false;
	currentPlan: unknown;

	industryTagOptions: Array<{ label: string, value: string }> = [];
	fullListOfIndustryTagsOptions: Array<{ label: string, value: string }> = [];
	selectedIndustryTags: any;

	investorCompanyNameOrNumber: string;

	companyAgeLessThanOrGreaterThan: string = 'less';
	companyAgeNumberValue: number;

	actualTurnoverGreaterThan: number;
	actualTurnoverLessThan: number;

	investorShareholdingsGreaterThanValue: number;
	investorShareholdingsLessThanValue: number;

	msgs = [];

	turnoverRangeDataValue: Number = 0;
	turnoverActualRangeDataValue: Number = 0;
	lineOptions: any;
	ablInsightsMapData: any;
	investeeData: boolean = false;
	investeeFilterNameData: any;

	investeeDisplayModal: boolean;
	saveFilterData: boolean = false;
	checkEstimatedTurnover: string = "true";

	regionListDropdownOptions: Array<{ label: string, value: string }>;
	selectedRegionList: any;

	investorSicCodeListOptions: Array<object> = [];
	fullListOfInvestorSicCodeListOptions: Array<object> = [];
	selectedInvestorSicCodeList: any;
	payloadForChildApi;


	globalFilterDataObject: any = {
		filterData: [
			{ chip_group: "Status", chip_values: ["live"] },
		],
		pageSize: 25,
		startAfter: 0,
		filterSearchArray: [],
		sortOn: []
	};
	shareIdFilterData: any;
	companiesColumnListForTable: Array<any> = [];
	companiesDataListForTable: Array<any> = [];
	dataForNewEchart: Array<any> = [];
	searchTotalCount: number = 0;
	operatingTableElemnts: any;
	appliedFilters: any;

	title: any;
	description: any;

	listOfTurnOver: Array<{ label: string, value: Object }> = [
		{ label: '< 1M', value: { greaterThan: undefined, lessThan: '1000000' } },
		{ label: '1M - 5M', value: { greaterThan: '1000000', lessThan: '5000000' } },
		{ label: '5M -10M', value: { greaterThan: '5000000', lessThan: '10000000' } },
		{ label: '10M - 100M', value: { greaterThan: '10000000', lessThan: '100000000' } },
		{ label: '100M - 500M', value: { greaterThan: '100000000', lessThan: '500000000' } },
		{ label: '500M - 1BN', value: { greaterThan: '500000000', lessThan: '1000000000' } },
		{ label: '1BN - 10BN', value: { greaterThan: '1000000000', lessThan: '10000000000' } },
		{ label: '> 10BN', value: { greaterThan: '10000000000', lessThan: undefined } }
	];

	selectedTurnOver: any = { greaterThan: undefined, lessThan: undefined };

	showInputFieldMessage: boolean = false;
	showInputFieldMessageForShareholdings: boolean = false;

	// For Company Deatils Side Panel
	showCompanySideDetails: boolean = false;
	companySideDetailsParams: any = { companyNumber: undefined, companyName: undefined };
	corporateSideOverviewData: object;
	overviewName: string;
	saveFiltersName: any;
	saveFiltersId: any;
	selectedGlobalCurrency: string = 'GBP';
	listId: string;
	listPageName: string;
	listName: string;

	constructor(
		private userAuthService: UserAuthService,
		private router: Router,
		private toCurrencyPipe: CurrencyPipe,
		private titlecasePipe: TitleCasePipe,
		private searchFilterService: SearchFiltersService,
		private commonService: CommonServiceService,
		private adminRecordListComponent: AdminRecordListComponent,
		private seoService: SeoService,
		private activatedRoute: ActivatedRoute,
		private componentFactoryResolver: ComponentFactoryResolver,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunicate: ServerCommunicationService,
		private location: Location,
		private searchCompanyService: SearchCompanyService
	) {

		this.currentPlan = this.userAuthService?.getUserInfo('planId');

		if ( !this.userAuthService.hasAddOnPermission('investorInvesteeLandscape') && this.subscribedPlanModal['Valentine_Special'] !== this.currentPlan ) {
			this.router.navigate(['/']);
		}

	}

	async ngOnInit() {
		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';
		this.saveFiltersName = this.activatedRoute.snapshot.queryParams['saveFiltersName'];
		this.saveFiltersId = this.activatedRoute.snapshot.queryParams['saveFiltersId'];

		this.sharedLoaderService.showLoader();

		const { shareId, cListId, listPageName, listName } = this.activatedRoute.snapshot?.queryParams;
		this.listId = cListId;
		this.listPageName = listPageName;
		this.listName = listName;
		this.searchCompanyService.resetPayload();
        this.searchCompanyService.resetFilterData();
		this.searchCompanyService.updatePayload( { filterData: [{ chip_group: "Status", chip_values: ["live"] }] } );
		this.searchCompanyService.$apiPayloadBody.subscribe( res  => {
			this.payloadForChildApi = res;
		});
		
		if( shareId ){
			let param = [ 
				{ key:'shareId', value: shareId }
			];
			const CompanyDetailAPIResponse = await lastValueFrom(this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getSharedCriteriaInfo', undefined, undefined, param ) )

			if ( CompanyDetailAPIResponse.body.status = 200 ) {
				this.shareIdFilterData = CompanyDetailAPIResponse.body.result.criteria
				this.searchCompanyService.updatePayload( { filterData: CompanyDetailAPIResponse.body.result.criteria  } );
				this.searchCompanyService.updateFilterPanelApplyButtons();
			}
		}
		
		this.initBreadcrumbAndSeoMetaTags();
		
		// this.getDataForDropdownLists('investorSicCodeList');
		// this.getDataForDropdownLists('industryTags');
		this.getSearchResults('includeGlobalFilterParams');

		this.companiesColumnListForTable = [
			{ field: 'businessName', header: 'Company Name', colunName: 'Company Name', minWidth: '360px', maxWidth: 'none', textAlign: 'left', value: true },
			{ field: 'directorName', header: 'Director Name', colunName: 'Director Name', minWidth: '380px', maxWidth: '380px', textAlign: 'left', value: true },
			{ field: 'otherFeatures', header: 'Features', colunName: 'Features', minWidth: '130px', maxWidth: '130px', textAlign: 'left', value: true },
			{ field: 'companyRegistrationNumber', header: 'Company Number', colunName: 'Company Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left', value: true },
			{ field: 'numShareHolder', header: 'Total Shareholder', colunName: 'Total Shareholder', minWidth: '150px', maxWidth: '150px', textAlign: 'center', value: true },
			{ field: 'companyStatus', header: 'Company Status', colunName: 'Company Status', minWidth: '150px', maxWidth: '150px', textAlign: 'center', value: true },
			{ field: 'companyAge', header: 'Age', colunName: 'Age', minWidth: '80px', maxWidth: '80px', textAlign: 'right', value: true },
			{ field: 'companyRegistrationDate', header: 'Incorporation Date', colunName: 'Incorporation Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center', value: true },
			{ field: 'RegAddress', header: 'Registered Address', colunName: 'Registered Address', minWidth: '380px', maxWidth: '380px', textAlign: 'left', value: true },
			{ field: 'sicCode07', header: 'SIC Code', colunName: 'SIC Code', minWidth: '380px', maxWidth: '380px', textAlign: 'left', value: true },
			{ field: 'industryTag', header: 'Industry', colunName: 'Industry', minWidth: '380px', maxWidth: '380px', textAlign: 'left', value: true },
			{ field: 'active_directors_count', header: 'Active Directors Count', colunName: 'Active Directors Count', minWidth: '120px', maxWidth: '120px', textAlign: 'right', value: false },
			{ field: 'NumMortCharges', header: 'Mortgages Charge', colunName: 'Mortgages Charge', minWidth: '120px', maxWidth: '120px', textAlign: 'right', value: false },
			{ field: 'numberOfEmployees', header: 'No. of Employees', colunName: 'No. of Employees', minWidth: '120px', maxWidth: '120px', textAlign: 'right', value: false },
			{ field: 'turnover_latest', header: 'Turnover', colunName: 'Turnover', minWidth: '150px', maxWidth: '150px', textAlign: 'right', value: false },
			{ field: 'estimated_turnover', header: 'Turnover (Estimate+)', colunName: 'Turnover', minWidth: '150px', maxWidth: '150px', textAlign: 'right', value: false },
			{ field: 'totalAssets_latest', header: 'Total Assets', colunName: 'Total Assets', minWidth: '150px', maxWidth: '150px', textAlign: 'right', value: false },
			{ field: 'totalLiabilities_latest', header: 'Total Liabilities', colunName: 'Total Liabilities', minWidth: '150px', maxWidth: '150px', textAlign: 'right', value: false },
			{ field: 'netWorth_latest', header: 'Net Worth', colunName: 'Net Worth', minWidth: '150px', maxWidth: '150px', textAlign: 'right', value: false },
			{ field: 'grossProfit_latest', header: 'Gross Profit', colunName: 'Gross Profit', minWidth: '150px', maxWidth: '150px', textAlign: 'right', value: false }
		];

	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems([
		// 	{ label: 'Investee Finder', routerLink: ['/insights/investee-finder'] }
		// ]);

		this.title = "DataGardener Investee Finder - Automate your marketing workflows";
		this.description = "Get in-depth analytics of company CCJ, Charges, complaint registered against companies, dissolved and liquidation date.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setMetaTitle(this.title);
		this.seoService.setDescription(this.description);

	}

	getRegionsData( mapGeoJSON ) {

		this.regionListDropdownOptions = [];

		for (let featureObj of mapGeoJSON.features) {
			if (!JSON.stringify(this.regionListDropdownOptions).includes(featureObj.properties.name)) {
				this.regionListDropdownOptions.push({ label: featureObj.properties.name, value: featureObj.properties.name.toLowerCase() });
			}
		}

		this.regionListDropdownOptions.sort((a, b) => a.label.localeCompare(b.label));

		this.regionListDropdownOptions.unshift({ label: 'All', value: null });

	}

	async initLeafletMapContainer( currentYearData ) {

		const { LazyLeafletMapComponent } = await import('../../../../shared-components/lazy-leaflet-map/lazy-leaflet-map.component');

		this.LazyLeafletMapContainer.clear();
		
		const { instance } = this.LazyLeafletMapContainer.createComponent( LazyLeafletMapComponent );
        instance.mapConfig.primaryMapId = `investeeFinderMapContainer`;
		instance.mapData = { currentYearData: currentYearData };
		instance.requiredData = {
			thisPage: 'investeeFinderPage',
			selectedRegionList: this.selectedRegionList ? this.selectedRegionList : '',
			globalFilterDataObject: this.payloadForChildApi,
			listId: this.listId
		}

		instance.mapGeoJsonOutput.subscribe( res => {
			this.getRegionsData( res );
		});

	}

	onChangeRegionSelection(event: { itemValue: any; value: string | any[]; }) {

		if (event.itemValue != null && this.selectedRegionList && this.selectedRegionList.length > 1) {

			this.selectedRegionList = this.selectedRegionList.filter(val => val);

		}

		if (event.itemValue == null && this.selectedRegionList.length > 0 && event.value.includes(event.itemValue)) {
			event.value = [null];
			this.selectedRegionList = event.value;
		}

	}

	requestUpdateTableData(event) {

		this.payloadForChildApi['pageSize'] = event.pageSize ? event.pageSize : 25;
		this.payloadForChildApi['startAfter'] = event.startAfter ? event.startAfter : 0;
		this.payloadForChildApi['sortOn'] = event.sortOn ? event.sortOn : [];
		this.payloadForChildApi['filterSearchArray'] = event.filterSearchArray ? event.filterSearchArray : []

		this.getSearchResults();

	}

	getSearchResults(includeGlobalFilterParams?) {

		this.sharedLoaderService.showLoader();

		this.showInputFieldMessage = false;
		this.showInputFieldMessageForShareholdings = false;
		let endPoint = !this.listId ? 'investorSearchResults' : 'getCompaniesInListTableData';
		let apiRoute = !this.listId ? 'DG_API' : 'DG_LIST';

		if ( this.listId ) {
			this.payloadForChildApi.filterData.push( { chip_group: 'Saved Lists', chip_values: [this.listName] } );
			this.payloadForChildApi['listId'] = this.listId;
			this.payloadForChildApi['pageName'] = this.listPageName.split(' ').join('');
		}

		/*if (includeGlobalFilterParams == 'includeGlobalFilterParams') {

			this.payloadForChildApi.filterData = [];

			

			if (this.checkEstimatedTurnover == "true") {

				this.globalFilterDataObject.filterData.push(
					{ chip_group: "Status", chip_values: ["live"] },
					{ chip_group: "Preferences", chip_values: ["estimated turnover included"], preferenceOperator: [{ hasEstimatedTurnover: "true" }] }
				);

			} else {
				this.globalFilterDataObject.filterData.push(
					{ chip_group: "Status", chip_values: ["live"] },
					{ chip_group: "Preferences", chip_values: ["estimated turnover not included"], preferenceOperator: [{ hasEstimatedTurnover: "false" }] }
				);
			}

			if (this.selectedIndustryTags && this.selectedIndustryTags.length) {
				this.globalFilterDataObject.filterData.push(
					{ chip_group: "Industry", chip_values: this.selectedIndustryTags }
				);
			}

			if (this.selectedTurnOver && (this.selectedTurnOver['greaterThan'] > 0 && this.selectedTurnOver['lessThan'] == undefined)) {
				if (this.checkEstimatedTurnover == "true") {
					this.globalFilterDataObject.filterData.push(
						{
							chip_group: "Key Financials", chip_values: [{
								key: "turnover",
								greater_than: this.selectedTurnOver['greaterThan'],
								less_than: "",
								financialBoolean: true,
								selected_year: "true"
							}, {
								key: "estimated_turnover",
								greater_than: this.selectedTurnOver['greaterThan'],
								less_than: "",
								financialBoolean: true,
								selected_year: "true"
							}]
						}
					);
				} else {
					this.globalFilterDataObject.filterData.push(
						{
							chip_group: "Key Financials", chip_values: [{
								key: "turnover",
								greater_than: this.selectedTurnOver['greaterThan'],
								less_than: "",
								financialBoolean: true,
								selected_year: "true"
							}]
						}
					);
				}
			} else if (this.selectedTurnOver && (this.selectedTurnOver['greaterThan'] == undefined && this.selectedTurnOver['lessThan'] > 0)) {
				if (this.checkEstimatedTurnover == "true") {
					this.globalFilterDataObject.filterData.push(
						{
							chip_group: "Key Financials", chip_values: [{
								key: "turnover",
								greater_than: "",
								less_than: this.selectedTurnOver['lessThan'],
								financialBoolean: true,
								selected_year: "true"
							}, {
								key: "estimated_turnover",
								greater_than: "",
								less_than: this.selectedTurnOver['lessThan'],
								financialBoolean: true,
								selected_year: "true"
							}]
						}
					);
				} else {
					this.globalFilterDataObject.filterData.push(
						{
							chip_group: "Key Financials", chip_values: [{
								key: "turnover",
								greater_than: "",
								less_than: this.selectedTurnOver['lessThan'],
								financialBoolean: true,
								selected_year: "true"
							}]
						}
					);
				}
			} else if (this.selectedTurnOver && (this.selectedTurnOver['greaterThan'] > 0 && this.selectedTurnOver['lessThan'] > 0)) {
				if (this.checkEstimatedTurnover == "true") {
					this.globalFilterDataObject.filterData.push(
						{
							chip_group: "Key Financials", chip_values: [{
								key: "turnover",
								greater_than: this.selectedTurnOver['greaterThan'],
								less_than: this.selectedTurnOver['lessThan'],
								financialBoolean: true,
								selected_year: "true"
							}, {
								key: "estimated_turnover",
								greater_than: this.selectedTurnOver['greaterThan'],
								less_than: this.selectedTurnOver['lessThan'],
								financialBoolean: true,
								selected_year: "true"
							}]
						}
					);
				} else {
					this.globalFilterDataObject.filterData.push(
						{
							chip_group: "Key Financials", chip_values: [{
								key: "turnover",
								greater_than: this.selectedTurnOver['greaterThan'],
								less_than: this.selectedTurnOver['lessThan'],
								financialBoolean: true,
								selected_year: "true"
							}]
						}
					);
				}
			}

			if (this.investorShareholdingsGreaterThanValue || this.investorShareholdingsLessThanValue) {
				this.globalFilterDataObject.filterData.push(
					{
						chip_group: "Number of Shareholdings",
						chip_values: [[
							this.investorShareholdingsGreaterThanValue ? this.investorShareholdingsGreaterThanValue.toString() : '',
							this.investorShareholdingsLessThanValue ? this.investorShareholdingsLessThanValue.toString() : ''
						]]

					}
				);
			}

			if (this.companyAgeLessThanOrGreaterThan == 'Greater Than' && this.companyAgeNumberValue) {
				// let chipVal = [this.companyAgeLessThanOrGreaterThan + " " + this.companyAgeNumberValue];
				let chipVal = [ this.companyAgeNumberValue, null];
				this.globalFilterDataObject.filterData.push(
					{
						chip_group: "Company Age Filter",
						chip_values: [chipVal],
						// ageOperator: ["greater"]
					}
				)
			} else if (this.companyAgeLessThanOrGreaterThan == 'Less Than' && this.companyAgeNumberValue) {
				// let chipVal = [this.companyAgeLessThanOrGreaterThan + " " + this.companyAgeNumberValue];
				let chipVal = [ null, this.companyAgeNumberValue];
				this.globalFilterDataObject.filterData.push(
					{
						chip_group: "Company Age Filter",
						chip_values: [chipVal],
						// ageOperator: ["less"]
					}
				)
			}

			if (this.investorCompanyNameOrNumber) {
				this.globalFilterDataObject.filterData.push({
					chip_group: "Investor Company Name/Number",
					chip_values: [this.investorCompanyNameOrNumber],
					investorCompanySearchAndOr: "or"
				});
			}

			if (this.selectedInvestorSicCodeList && this.selectedInvestorSicCodeList.length > 0) {
				this.globalFilterDataObject.filterData.push({
					chip_group: 'Investor Sic Code',
					chip_values: this.selectedInvestorSicCodeList
				});

			}

			if (this.selectedRegionList && !this.selectedRegionList.filter(val => !val).length && this.selectedRegionList.length > 0) {
				this.globalFilterDataObject.filterData.push(
					{
						chip_group: 'Region',
						chip_values: this.selectedRegionList
					}
				);

			}

		}*/

		/*if ( this.activatedRoute.snapshot.queryParams['chipData'] || this.activatedRoute.snapshot?.queryParams?.shareId ) {
           if( this.activatedRoute.snapshot.queryParams['chipData'] ) {
			   this.globalFilterDataObject.filterData = JSON.parse(this.activatedRoute.snapshot.queryParams['chipData']);
		   } else {
				this.globalFilterDataObject.filterData = this.shareIdFilterData;
				this.globalFilterDataObject.filterData = [];
				this.globalFilterDataObject.filterData.push( ...this.shareIdFilterData );
		   }

			for (let filterValues of this.globalFilterDataObject.filterData) {

				if (filterValues.chip_group === "Region") {
					this.selectedRegionList = filterValues.chip_values;
				} else if (filterValues.chip_group === "Industry") {
					this.selectedIndustryTags = filterValues.chip_values;
				} else if (filterValues.chip_group === "Number of Shareholdings") {
					this.investorShareholdingsGreaterThanValue = filterValues.chip_values[0][0];
					this.investorShareholdingsLessThanValue = filterValues.chip_values[0][1];
				} else if (filterValues.chip_group === "Company Age Filter") {
					let values = filterValues?.chip_values;
					if (values?.[0][0] == null) {
						this.companyAgeLessThanOrGreaterThan = "Less Than";
						this.companyAgeNumberValue = values[0][1];
					} else if (values?.[0][1] == null) {
						this.companyAgeLessThanOrGreaterThan = "Greater Than";
						this.companyAgeNumberValue = values[0][0];
					};

				} else if (filterValues.chip_group === "Investor Company Name/Number") {
					this.investorCompanyNameOrNumber = filterValues.chip_values;
				} else if (filterValues.chip_group === "Investor Sic Code") {
					this.selectedInvestorSicCodeList = filterValues.chip_values;
				} else if (filterValues.chip_group === "Key Financials") {
					this.selectedTurnOver = {
						greaterThan: filterValues.chip_values[0].greater_than != '' ? filterValues.chip_values[0].greater_than : undefined,
						lessThan: filterValues.chip_values[0].less_than != '' ? filterValues.chip_values[0].less_than : undefined
					}
				} else if (filterValues.chip_group === "Preferences") {
					if ((filterValues.chip_values).includes('estimated turnover not included')) {
						this.checkEstimatedTurnover = 'false';
					} else if ((filterValues.chip_values).includes('estimated turnover included')) {
						this.checkEstimatedTurnover = 'true';
					}
				}
			}
		} else if ( this.activatedRoute.snapshot?.queryParams?.shareId ) {
			this.globalFilterDataObject.filterData = [];
			this.globalFilterDataObject.filterData.push( ...this.shareIdFilterData );
		}*/

		this.globalServerCommunicate.globalServerRequestCall( 'post', apiRoute, endPoint, this.payloadForChildApi ).subscribe(res => {

			if (res.body.status == 200 || res.status == 200) {

				if (res.body.mapData) {

					this.ablInsightsMapData = res.body.mapData;
					if ( ![ this.subscribedPlanModal['Valentine_Special'] ].includes( this.currentPlan ) ) {

						this.initLeafletMapContainer( this.ablInsightsMapData );

					}
					
				}

				if (res.body.companiesData && res.body.companiesData.hits) {

					this.companiesDataListForTable = [];
					this.searchTotalCount = res.body.companiesData.total.value;
					this.dataForNewEchart = res.body['mapData'];

					for (let sourceData of res.body.companiesData.hits) {
						this.companiesDataListForTable.push(sourceData._source);
					}

					this.companiesDataListForTable = this.formatCompanyData(this.companiesDataListForTable);


				} else if ( res.body.data && res.body.data.hits ) {
					this.companiesDataListForTable = [];
					this.searchTotalCount = res.body.data.total.value;

					for (let sourceData of res.body.data.hits) {
						this.companiesDataListForTable.push(sourceData._source);
					}

					this.companiesDataListForTable = this.formatCompanyData(this.companiesDataListForTable);
				}

				if ( this.activatedRoute.snapshot.queryParams['chipData'] || this.activatedRoute.snapshot?.queryParams?.shareId ) {
					// this.router.navigate( [], { queryParams: {} } );
					this.location.replaceState('/insights/investee-finder');
					this.activatedRoute.snapshot.queryParams = {};
				}

			}

		});

		this.appliedFilters = this.payloadForChildApi;

		setTimeout(() => {
			this.sharedLoaderService.hideLoader();
		}, 2000);


	}

	/*getDataForDropdownLists(requestingDataFor) {

		this.sharedLoaderService.showLoader()
		let aggrKey = '',
			otherRequiredKeys = [],
			payloadObj = {},
			paramType = '';
			otherRequiredKeys.push( { chip_group: "Status", chip_values: ["live"] } );

		if (requestingDataFor == 'industryTags') {

			aggrKey = 'industryTagList.keyword';

			if ( this.listId ) {
				otherRequiredKeys.unshift( { chip_group: 'Saved Lists', chip_values: [ this.listName ] } );
				paramType = 'Industry';
				payloadObj['listId'] = this.listId;
				payloadObj['pageName'] = this.listPageName.split(' ').join('');
			}

			// if (this.selectedIndustryTags && this.selectedIndustryTags.length > 0) {
			// 	otherRequiredKeys.push({
			// 		chip_group: 'Industry',
			// 		chip_values: this.selectedIndustryTags
			// 	});
			// }

		}

		if (requestingDataFor == 'investorSicCodeList') {

			aggrKey = 'investor_companies.sic_industry.keyword';

			if ( this.listId ) {
				otherRequiredKeys.unshift( { chip_group: 'Saved Lists', chip_values: [ this.listName ] } );
				paramType = 'Investor SicCode';
				payloadObj['listId'] = this.listId;
				payloadObj['pageName'] = this.listPageName.split(' ').join('');
			}

		}

		if (this.selectedTurnOver && (this.selectedTurnOver['greaterThan'] > 0 && this.selectedTurnOver['lessThan'] == undefined)) {

			otherRequiredKeys.push(
				{
					chip_group: "Key Financials", chip_values: [{
						key: "turnover",
						greater_than: this.selectedTurnOver['greaterThan'],
						less_than: "",
						financialBoolean: true,
						selected_year: "true"
					}]
				}
			);
		} else if (this.selectedTurnOver && (this.selectedTurnOver['greaterThan'] == undefined && this.selectedTurnOver['lessThan'] > 0)) {

			otherRequiredKeys.push(
				{
					chip_group: "Key Financials", chip_values: [{
						key: "turnover",
						greater_than: "",
						less_than: this.selectedTurnOver['lessThan'],
						financialBoolean: true,
						selected_year: "true"
					}]
				}
			);
		} else if (this.selectedTurnOver && (this.selectedTurnOver['greaterThan'] > 0 && this.selectedTurnOver['lessThan'] > 0)) {

			otherRequiredKeys.push(
				{
					chip_group: "Key Financials", chip_values: [{
						key: "turnover",
						greater_than: this.selectedTurnOver['greaterThan'],
						less_than: this.selectedTurnOver['lessThan'],
						financialBoolean: true,
						selected_year: "true"
					}]
				}
			);
		}

		if (this.investorShareholdingsGreaterThanValue || this.investorShareholdingsLessThanValue) {
			otherRequiredKeys.push(
				{
					chip_group: "Number of Shareholdings",
					chip_values: [[
						this.investorShareholdingsGreaterThanValue ? this.investorShareholdingsGreaterThanValue.toString() : '',
						this.investorShareholdingsLessThanValue ? this.investorShareholdingsLessThanValue.toString() : ''
					]]

				}
			);
		}

		if (this.companyAgeLessThanOrGreaterThan == 'Greater Than' && this.companyAgeNumberValue) {
			// let chipVal = [this.companyAgeLessThanOrGreaterThan + " " + this.companyAgeNumberValue];
			let chipVal = [ this.companyAgeNumberValue, null ];

			otherRequiredKeys.push(
				{
					chip_group: "Company Age Filter",
					chip_values: [chipVal],
					// ageOperator: ["greater"]
				}
			)
		} else if (this.companyAgeLessThanOrGreaterThan == 'Less Than' && this.companyAgeNumberValue) {
			// let chipVal = [this.companyAgeLessThanOrGreaterThan + " " + this.companyAgeNumberValue];
			let chipVal = [ null, this.companyAgeNumberValue];

			otherRequiredKeys.push(
				{
					chip_group: "Company Age Filter",
					chip_values: [chipVal],
					// ageOperator: ["less"]
				}
			)
		}

		if (this.investorCompanyNameOrNumber) {
			this.globalFilterDataObject.filterData.push({
				chip_group: "Investor Company Name/Number",
				chip_values: [this.investorCompanyNameOrNumber],
				investorCompanySearchAndOr: "or"
			});
		}

		if (this.selectedRegionList && !this.selectedRegionList.filter(val => !val).length && this.selectedRegionList.length > 0) {

			otherRequiredKeys.push(
				{
					chip_group: 'Region',
					chip_values: this.selectedRegionList
				}
			);

		}

		if (this.selectedInvestorSicCodeList && this.selectedInvestorSicCodeList.length > 0) {
			otherRequiredKeys.push({
				chip_group: 'Investor Sic Code',
				chip_values: this.selectedInvestorSicCodeList
			});

		}

		this.searchFilterService.getAllFilterProps(otherRequiredKeys, 'aggregateBy', paramType, aggrKey, 'companySearch', payloadObj).then(res => {

			let temporaryDataArrayContainer = [];

			if (res.distinct_categories) {

				res.distinct_categories.buckets = res.distinct_categories.buckets.sort((a, b) => b.doc_count - a.doc_count);

				for (let val of res.distinct_categories.buckets) {

					temporaryDataArrayContainer.push({ label: val.key.replace(/(^|\s)\S/g, function (t) { return t.toUpperCase() }) + ' (' + this.toCurrencyPipe.transform(val.doc_count, '', '', '1.0-0') + ')', value: val.key });

				}

				if (requestingDataFor == 'industryTags') {

					this.fullListOfIndustryTagsOptions = temporaryDataArrayContainer;

				}

				if (requestingDataFor == 'investorSicCodeList') {

					this.fullListOfInvestorSicCodeListOptions = temporaryDataArrayContainer;

				}

			}

		});
		setTimeout(() => {
			this.sharedLoaderService.hideLoader()
			
		}, 1000);
	}*/

	showFullListOfIndustryTags(requestingDataFor) {

		this.showLessListOfIndustryTags(requestingDataFor);

		if (requestingDataFor == 'industryTags') {

			setTimeout(() => {
				this.industryTagOptions = this.fullListOfIndustryTagsOptions;
			}, 1000);

		}

		if (requestingDataFor == 'investorSicCodeList') {

			setTimeout(() => {
				this.investorSicCodeListOptions = this.fullListOfInvestorSicCodeListOptions;
			}, 1000);

		}

	}

	showLessListOfIndustryTags(requestingDataFor) {

		if (requestingDataFor == 'industryTags') {

			this.industryTagOptions = [];

			for (let listOptObjKey in this.fullListOfIndustryTagsOptions) {
				if (+listOptObjKey < 100) {
					this.industryTagOptions.push(this.fullListOfIndustryTagsOptions[+listOptObjKey]);
				}
			}

		}

		if (requestingDataFor == 'investorSicCodeList') {

			this.investorSicCodeListOptions = [];

			for (let listOptObjKey in this.fullListOfInvestorSicCodeListOptions) {
				if (+listOptObjKey < 100) {
					this.investorSicCodeListOptions.push(this.fullListOfInvestorSicCodeListOptions[+listOptObjKey]);
				}
			}

		}

	}

	formatCompanyData(companyData) {

		let cmpNoArray = [];
		let companyContactCmpNoArr = [];

		for (let i = 0; i < companyData.length; i++) {

			/* START: Preparing object for show charges table, to be send to user-list table */

			let obj = {};

			obj["businessName"] = companyData[i].businessName;

			obj["companyDOIAgeForCharges"] = (this.commonService.calculateAge(companyData[i]['companyRegistrationDate']));

			obj["companyRegistrationNumber"] = companyData[i]['companyRegistrationNumber'] && companyData[i]['companyRegistrationNumber'] != "" ? companyData[i]['companyRegistrationNumber'] : "";

			obj["telephone"] = companyData[i]["RegAddress_Modified"] && companyData[i]["RegAddress_Modified"]["telephone"] && companyData[i]["RegAddress_Modified"]["telephone"] != "" ? companyData[i]["RegAddress_Modified"]["telephone"] : "";

			obj["website"] = companyData[i]["RegAddress_Modified"] && companyData[i]["RegAddress_Modified"]["website"] && companyData[i]["RegAddress_Modified"]["website"] != "" ? companyData[i]["RegAddress_Modified"]["website"] : "";

			obj["telephone"] = companyData[i]["RegAddress_Modified"] && companyData[i]["RegAddress_Modified"]["telephone"] && companyData[i]["RegAddress_Modified"]["telephone"] != "" ? companyData[i]["RegAddress_Modified"]["telephone"] : "";

			obj["ctps"] = companyData[i]["RegAddress_Modified"] && companyData[i]["RegAddress_Modified"]["ctps"] && companyData[i]["RegAddress_Modified"]["ctps"] != "" ? companyData[i]["RegAddress_Modified"]["ctps"] : "";

			obj["region"] = companyData[i]["RegAddress_Modified"] && this.titlecasePipe.transform(companyData[i]["RegAddress_Modified"]["region"]) && this.titlecasePipe.transform(companyData[i]["RegAddress_Modified"]["region"]) != "" ? this.titlecasePipe.transform(companyData[i]["RegAddress_Modified"]["region"]) : "";

			obj["sicCode07"] = companyData[i]["sicCode07"];

			obj['RegAddress'] = companyData[i]['RegAddress_Modified'] && this.commonService.formatCompanyAddress(companyData[i]['RegAddress_Modified']);

			obj['companyContactDetails'] = companyData[i]['companyContactDetails'];

			let outstandingCount = 0,
				fullySatisfiedCount = 0,
				tempCharge = {},
				monthArray = [],
				pscArray = [],
				directorNameArr = [],
				person_entiledArr = [],
				person_entiledArrForFs = [],
				person_entiledArrForPS = [],
				person_counts: string,
				person_countsfully: string,
				person_countspartial: string,
				mortgage_array = [],
				mortgageCount: string,
				person_array = [],
				person_array_fully = [],
				person_array_partial = [],
				replaceString = /Limited|limited|ltd|Ltd|[�]/g,
				newString: string,
				newStringForFS: string,
				newStringForPS: string,
				temchargeData = []


			if (companyData[i]["chargesData"]) {
				companyData[i]["chargesData"].forEach(elementCharges => {

					/* Outstanding count */
					if (["t", "u", "v", "w", "x", "y", "z", null, ""].includes(elementCharges['memorandumNature'])) {
						temchargeData.push(elementCharges)
						outstandingCount++;
					}

					/* Fully Satisfied count */
					if (["b", "f", "p", "r"].includes(elementCharges['memorandumNature'])) {
						fullySatisfiedCount++;
					}

					/* For Month name to count number (Only Outstanding) */
					if (["t", "u", "v", "w", "x", "y", "z", null, ""].includes(elementCharges['memorandumNature'])) {

						if (elementCharges['createdDate']) {
							let tempDate = elementCharges['createdDate'];
							monthArray.push(Month[parseInt(tempDate.split('/')[1])]);
						}
					}
					if (elementCharges["mortgageDetails"] && elementCharges["mortgageDetails"].length > 0) {
						elementCharges["mortgageDetails"].forEach(element => {

							if (element.recordType == "mortgage type") {
								tempCharge["classification"] = this.titlecasePipe.transform(element.description);
								mortgage_array.push(tempCharge["classification"]);
							}
							// person entitled ( outstanding )
							if (["t", "u", "v", "w", "x", "y", "z", null, ""].includes(elementCharges['memorandumNature'])) {
								if (element.recordType == "persons entitled") {

									newString = element.description.replace(replaceString, (_match) => {
										return "";
									});

									tempCharge["person_entile_outs"] = this.titlecasePipe.transform(newString);
									person_entiledArr.push(tempCharge["person_entile_outs"]);

								}
							}
							//person entitled ( fully satisfied )
							if (["b", "f", "p", "r"].includes(elementCharges['memorandumNature'])) {
								if (element.recordType == "persons entitled") {
									newStringForFS = element.description.replace(replaceString, (_match) => {
										return "";
									});
									tempCharge["person_entile_fully"] = this.titlecasePipe.transform(newStringForFS);
									person_entiledArrForFs.push(tempCharge["person_entile_fully"])
								}

							}
							//person entitled ( partial satisfied )
							if (["s"].includes(elementCharges['memorandumNature'])) {
								if (element.recordType == "persons entitled") {
									newStringForPS = element.description.replace(replaceString, (_match) => {
										return "";
									});
									tempCharge["person_entile_partial"] = this.titlecasePipe.transform(newStringForPS);
									person_entiledArrForPS.push(tempCharge["person_entile_partial"]);
								}
							}

							let countP = {};
							let countM = {};
							let countPFS = {};
							let countPPS = {};

							/* For Outstanding */
							for (let countPerson of person_entiledArr) {
								countP[countPerson] = 1 + (countP[countPerson] || 0)
							}
							person_counts = Object.keys(countP).map(function (key) {
								return " " + key + '(' + countP[key] + ')';

							}).join(",");

							/* For Fully Satisfied */
							for (let countPersonFuly of person_entiledArrForFs) {
								countPFS[countPersonFuly] = 1 + (countPFS[countPersonFuly] || 0)
							}
							person_countsfully = Object.keys(countPFS).map(function (key) {
								return " " + key + '(' + countPFS[key] + ')';
							}).join(",");

							/* For Partial Satisfied */
							for (let countPersonPartial of person_entiledArrForPS) {
								countPPS[countPersonPartial] = 1 + (countPPS[countPersonPartial] || 0)
							}
							person_countspartial = Object.keys(countPPS).map(function (key) {
								return " " + key + '(' + countPPS[key] + ')';
							}).join(",");


							for (let countmortage of mortgage_array) {
								countM[countmortage] = 1 + (countM[countmortage] || 0)
							}
							mortgageCount = Object.keys(countM).map(function (key) {
								return " " + key + '(' + countM[key] + ')';

							}).join(",");
						});
					}
				});
			}

			if (companyData[i]["pscName"]) {
				companyData[i]["pscName"].forEach(elemenPsc => {
					if (elemenPsc) {
						pscArray.push(this.titlecasePipe.transform(' ' + elemenPsc));
					}
				});
			}

			if (companyData[i]["personContactDetails"]) {
				for (let person of companyData[i]["personContactDetails"]) {
					let personFullName = "";
					if (person.middle_name) {
						personFullName = person.first_name + ' ' + person.middle_name + ' ' + person.last_name;
					} else {
						personFullName = person.first_name + ' ' + person.last_name;
					}
				}
			}

			if (companyData[i]["directorsData"]) {
				for (let director of companyData[i]["directorsData"]) {

					if (director["detailedInformation"] && director["detailedInformation"]["fullName"]) {

						directorNameArr.push(this.titlecasePipe.transform(director["detailedInformation"]["fullName"]));

					}

					if (director.directorJobRole && director.directorJobRole !== " ") {
						companyData[i]['occupation'] = this.titlecasePipe.transform(director.directorJobRole);
					} else {
						companyData[i]['occupation'] = "-"
					}
				}
			}

			obj["pscNameFd"] = pscArray;
			obj["outstandingCount"] = outstandingCount;
			obj["fullySatisfiedCount"] = fullySatisfiedCount;
			obj['chargesData'] = temchargeData;

			if (mortgageCount) {
				obj['classification'] = mortgageCount.split(",");
			}
			if (person_counts) {
				obj['person_entile_outs'] = person_counts.replace(/[\s;]+/g, " ").split(",");
			}
			if (person_countsfully) {
				obj['person_entile_fully'] = person_countsfully.replace(/[\s;]+/g, " ").split(",");
			}
			if (person_countspartial) {
				obj['person_entile_partial'] = person_countspartial.replace(/[\s;]+/g, " ").split(",");
			}

			person_array.push(obj['person_entile_outs']);
			obj['person_entile_outs'] = person_array[0];

			person_array_fully.push(obj['person_entile_fully']);
			obj['person_entile_fully'] = person_array_fully[0];

			person_array_partial.push(obj['person_entile_partial']);
			obj['person_entile_partial'] = person_array_partial[0];

			if (companyData[i].simplifiedAccounts) {

				if (companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].turnover && companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].turnover != "") {
					companyData[i]['turnover_latest'] = companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].turnover;
					obj["turnover"] = companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].turnover;
				} else {
					companyData[i]['turnover_latest'] = "-";
					obj["turnover"] = undefined;
				}
				if (companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].estimated_turnover && companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].estimated_turnover != "") {
					companyData[i]['estimated_turnover'] = companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].estimated_turnover;
					obj["estimated_turnover"] = companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].estimated_turnover;
				} else {
					companyData[i]['estimated_turnover'] = "-";
					obj["estimated_turnover"] = undefined;
				}
				if (companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].totalAssets && companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].totalAssets != "") {
					companyData[i]['totalAssets_latest'] = companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].totalAssets;
				} else {
					companyData[i]['totalAssets_latest'] = "-";
				}
				if (companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].totalLiabilities && companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].totalLiabilities != "") {
					companyData[i]['totalLiabilities_latest'] = companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].totalLiabilities;
				} else {
					companyData[i]['totalLiabilities_latest'] = "-";
				}
				if (companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].netWorth && companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].netWorth != "") {
					companyData[i]['netWorth_latest'] = companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].netWorth;
					obj["netWorth"] = companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].netWorth;
				} else {
					companyData[i]['netWorth_latest'] = "-";
					obj["netWorth"] = undefined;
				}
				if (companyData[i].statutoryAccounts) {
					if (companyData[i].statutoryAccounts[companyData[i].simplifiedAccounts.length - 1].grossProfit && companyData[i].statutoryAccounts[companyData[i].simplifiedAccounts.length - 1].grossProfit != "") {
						companyData[i]['grossProfit_latest'] = companyData[i].statutoryAccounts[companyData[i].simplifiedAccounts.length - 1].grossProfit;
					}
					else {
						companyData[i]['grossProfit_latest'] = '-';
					}
				} else {
					companyData[i]['grossProfit_latest'] = '-';
				}
				if (companyData[i].simplifiedAccounts[0].numberOfEmployees) {
					companyData[i]['numberOfEmployees'] = parseInt(companyData[i].simplifiedAccounts[0].numberOfEmployees);
				}

			}

			if (companyData[i].ccjDetails) {
				companyData[i]['CCJCount'] = companyData[i].ccjDetails.length;
				companyData[i]['ccjDetails'] = companyData[i].ccjDetails;
			} else {
				companyData[i]['CCJCount'] = '-';
			}

			if (companyData[i].RegAddress_Modified.district_code) {
				companyData[i].RegAddress_Modified.district_code = companyData[i].RegAddress_Modified.district_code.toUpperCase();
			}
			if (companyData[i].hasShareHolders) {
				cmpNoArray.push(companyData[i].companyRegistrationNumber.toLowerCase());
			}
			if (companyData[i].hasCompanyLinkedinUrl || companyData[i].hasCompanyWebsite || companyData[i].hasCompanyGenericMail) {
				companyContactCmpNoArr.push(companyData[i].companyRegistrationNumber.toUpperCase());
			}

			companyData[i]["total_directors_count"] = 0;
			companyData[i]["resigned_directors_count"] = 0;
			companyData[i]["active_directors_count"] = 0;
			companyData[i]["NumMortCharges"] = 0;

			if (companyData[i]["companyRegistrationDate"] !== undefined) {
				if (companyData[i]["companyRegistrationDate"] !== null) {
					companyData[i]["IncorporationDate"] = this.commonService.formatDate(companyData[i]["companyRegistrationDate"]);
				}
			}

			if (companyData[i]['RegAddress_Modified']) {
				companyData[i]['RegAddress'] = this.commonService.formatCompanyAddress(companyData[i]['RegAddress_Modified']);
			}

			if (companyData[i]["directorsData"] !== undefined) {
				if (companyData[i]["directorsData"] !== null) {
					companyData[i]["total_directors_count"] = companyData[i]["directorsData"].length;
					companyData[i]["active_directors_count"] = companyData[i]["activeDirectorsCount"];
					companyData[i]["resigned_directors_count"] = companyData[i]["resignedDirectorsCount"];
				}
			}

			if (companyData[i]["mortgagesObj"] !== undefined) {
				if (companyData[i]["mortgagesObj"] !== null) {
					companyData[i]["NumMortCharges"] = companyData[i]["mortgagesObj"].length;
				}
			}
			if (companyData[i]["accountsMadeUpDate"] !== undefined) {
				if (companyData[i]["accountsMadeUpDate"] !== null) {
					companyData[i]["accountsMadeUpDate"] = this.commonService.formatDate(companyData[i]["accountsMadeUpDate"])
				}
			}

		}

		return companyData;

	}

	resetCriteria() {
		this.selectedInvestorSicCodeList = [];
		this.selectedIndustryTags = [];
		this.selectedRegionList = undefined;
		this.checkEstimatedTurnover = "true";
		this.selectedTurnOver = undefined;
		this.investorShareholdingsGreaterThanValue = undefined;
		this.investorShareholdingsLessThanValue = undefined;
		this.companyAgeLessThanOrGreaterThan = undefined;
		this.companyAgeNumberValue = undefined;
		this.investorCompanyNameOrNumber = undefined;
		this.showInputFieldMessage = false;
		this.showInputFieldMessageForShareholdings = false;

		this.multiSelectForSicCodeMultiSelectId.filterValue = null;
		this.multiSelectForIndustryTags.filterValue = null;
		this.multiSelectRegionMultiSelectId.filterValue = null;

		this.payloadForChildApi['pageSize'] = 25;
		this.payloadForChildApi['startAfter'] = 0;
		this.payloadForChildApi['sortOn'] = [];
		this.payloadForChildApi['filterSearchArray'] = [];

		// this.getDataForDropdownLists('industryTags');

		this.getSearchResults('includeGlobalFilterParams');

		this.resetTablePagination();
	}

	getOperatingTable(event) {
		if ( event.requestFor === 'SidePanel' ) {
            this.showCompanySideDetailsPanel( event.compNumber, event.compName, event.rowData );
        } else {
            this.operatingTableElemnts = event;
        }
	}

	resetTablePagination() {

		this.adminRecordListComponent.resetFilters(this.operatingTableElemnts.adminRecordListTable);

		if (this.operatingTableElemnts.recordListPaginator) {
			this.operatingTableElemnts.recordListPaginator.rows = 25;
			this.operatingTableElemnts.recordListPaginator.first = 0;
			this.payloadForChildApi['pageSize'] = 25;
			this.payloadForChildApi['startAfter'] = 0;
			this.payloadForChildApi['sortOn'] = [];
			this.payloadForChildApi['filterSearchArray'] = [];
		}

	}
	
	showCompanySideDetailsPanel( compNumber, compName, rowData ) {

		this.showCompanySideDetails = true;

		if ( rowData == undefined ) {
			this.companySideDetailsParams.companyNumber = compNumber;
			this.companySideDetailsParams.companyName = compName;
			this.overviewName = "companyOverview";
		}
		else if ( rowData != undefined ) {
			this.corporateSideOverviewData = rowData;
			this.overviewName = "corporateOverview";
		}

	}

	getShowCompanySideDetailsOutputBoolValue($event) {
		this.showCompanySideDetails = $event;
	}

	showModalDialog() {
		this.investeeDisplayModal = true;

		if ( this.saveFiltersName ) {
			this.investeeFilterNameData = this.saveFiltersName;
		} else {
			this.investeeFilterNameData = "";
		}
	}

	investeeFinderCommunicator(event) {
		this.getSearchResults();
	}

	// saveInFilter(formData: NgForm, click) {
		
		
	// 	this.globalFilterDataObject.filterData =[];
		
	// 	if (this.checkEstimatedTurnover == "true") {

	// 		this.globalFilterDataObject.filterData.push(
	// 			{ chip_group: "Status", chip_values: ["live"] },
	// 			{ chip_group: "Preferences", chip_values: ["estimated turnover included"], preferenceOperator: [{ hasEstimatedTurnover: "true" }] }
	// 		);

	// 	} else {
	// 		this.globalFilterDataObject.filterData.push(
	// 			{ chip_group: "Status", chip_values: ["live"] },
	// 			{ chip_group: "Preferences", chip_values: ["estimated turnover not included"], preferenceOperator: [{ hasEstimatedTurnover: "false" }] }
	// 		);
	// 	}

	// 	if (this.selectedIndustryTags && this.selectedIndustryTags.length) {
	// 		this.globalFilterDataObject.filterData.push(
	// 			{ chip_group: "Industry", chip_values: this.selectedIndustryTags }
	// 		);
	// 	}

	// 	if (this.selectedTurnOver && (this.selectedTurnOver['greaterThan'] > 0 && this.selectedTurnOver['lessThan'] == undefined)) {
	// 		if (this.checkEstimatedTurnover == "true") {
	// 			this.globalFilterDataObject.filterData.push(
	// 				{
	// 					chip_group: "Key Financials", chip_values: [{
	// 						key: "turnover",
	// 						greater_than: this.selectedTurnOver['greaterThan'],
	// 						less_than: "",
	// 						financialBoolean: true,
	// 						selected_year: "true"
	// 					}, {
	// 						key: "estimated_turnover",
	// 						greater_than: this.selectedTurnOver['greaterThan'],
	// 						less_than: "",
	// 						financialBoolean: true,
	// 						selected_year: "true"
	// 					}]
	// 				}
	// 			);
	// 		} else {
	// 			this.globalFilterDataObject.filterData.push(
	// 				{
	// 					chip_group: "Key Financials", chip_values: [{
	// 						key: "turnover",
	// 						greater_than: this.selectedTurnOver['greaterThan'],
	// 						less_than: "",
	// 						financialBoolean: true,
	// 						selected_year: "true"
	// 					}]
	// 				}
	// 			);
	// 		}
	// 	} else if (this.selectedTurnOver && (this.selectedTurnOver['greaterThan'] == undefined && this.selectedTurnOver['lessThan'] > 0)) {
	// 		if (this.checkEstimatedTurnover == "true") {
	// 			this.globalFilterDataObject.filterData.push(
	// 				{
	// 					chip_group: "Key Financials", chip_values: [{
	// 						key: "turnover",
	// 						greater_than: "",
	// 						less_than: this.selectedTurnOver['lessThan'],
	// 						financialBoolean: true,
	// 						selected_year: "true"
	// 					}, {
	// 						key: "estimated_turnover",
	// 						greater_than: "",
	// 						less_than: this.selectedTurnOver['lessThan'],
	// 						financialBoolean: true,
	// 						selected_year: "true"
	// 					}]
	// 				}
	// 			);
	// 		} else {
	// 			this.globalFilterDataObject.filterData.push(
	// 				{
	// 					chip_group: "Key Financials", chip_values: [{
	// 						key: "turnover",
	// 						greater_than: "",
	// 						less_than: this.selectedTurnOver['lessThan'],
	// 						financialBoolean: true,
	// 						selected_year: "true"
	// 					}]
	// 				}
	// 			);
	// 		}
	// 	} else if (this.selectedTurnOver && (this.selectedTurnOver['greaterThan'] > 0 && this.selectedTurnOver['lessThan'] > 0)) {
	// 		if (this.checkEstimatedTurnover == "true") {
	// 			this.globalFilterDataObject.filterData.push(
	// 				{
	// 					chip_group: "Key Financials", chip_values: [{
	// 						key: "turnover",
	// 						greater_than: this.selectedTurnOver['greaterThan'],
	// 						less_than: this.selectedTurnOver['lessThan'],
	// 						financialBoolean: true,
	// 						selected_year: "true"
	// 					}, {
	// 						key: "estimated_turnover",
	// 						greater_than: this.selectedTurnOver['greaterThan'],
	// 						less_than: this.selectedTurnOver['lessThan'],
	// 						financialBoolean: true,
	// 						selected_year: "true"
	// 					}]
	// 				}
	// 			);
	// 		} else {
	// 			this.globalFilterDataObject.filterData.push(
	// 				{
	// 					chip_group: "Key Financials", chip_values: [{
	// 						key: "turnover",
	// 						greater_than: this.selectedTurnOver['greaterThan'],
	// 						less_than: this.selectedTurnOver['lessThan'],
	// 						financialBoolean: true,
	// 						selected_year: "true"
	// 					}]
	// 				}
	// 			);
	// 		}
	// 	}

	// 	if (this.investorShareholdingsGreaterThanValue || this.investorShareholdingsLessThanValue) {
	// 		this.globalFilterDataObject.filterData.push(
	// 			{
	// 				chip_group: "Number of Shareholdings",
	// 				chip_values: [[
	// 					this.investorShareholdingsGreaterThanValue ? this.investorShareholdingsGreaterThanValue.toString() : '',
	// 					this.investorShareholdingsLessThanValue ? this.investorShareholdingsLessThanValue.toString() : ''
	// 				]]

	// 			}
	// 		);
	// 	}

	// 	if (this.companyAgeLessThanOrGreaterThan == 'Greater Than' && this.companyAgeNumberValue) {
	// 		// let chipVal = [this.companyAgeLessThanOrGreaterThan + " " + this.companyAgeNumberValue];
	// 		let chipVal = [ this.companyAgeNumberValue, null ];
	// 		this.globalFilterDataObject.filterData.push(
	// 			{
	// 				chip_group: "Company Age Filter",
	// 				chip_values: [chipVal],
	// 				// ageOperator: ["greater"]
	// 			}
	// 		)
	// 	} else if (this.companyAgeLessThanOrGreaterThan == 'Less Than' && this.companyAgeNumberValue) {
	// 		// let chipVal = [this.companyAgeLessThanOrGreaterThan + " " + this.companyAgeNumberValue];
	// 		let chipVal = [ null, this.companyAgeNumberValue ];
	// 		this.globalFilterDataObject.filterData.push(
	// 			{
	// 				chip_group: "Company Age Filter",
	// 				chip_values: [chipVal],
	// 				// ageOperator: ["less"]
	// 			}
	// 		)
	// 	}

	// 	if (this.investorCompanyNameOrNumber) {
	// 		this.globalFilterDataObject.filterData.push({
	// 			chip_group: "Investor Company Name/Number",
	// 			chip_values: [this.investorCompanyNameOrNumber],
	// 			investorCompanySearchAndOr: "or"
	// 		});
	// 	}

	// 	if (this.selectedInvestorSicCodeList && this.selectedInvestorSicCodeList.length > 0) {
	// 		this.globalFilterDataObject.filterData.push({
	// 			chip_group: 'Investor Sic Code',
	// 			chip_values: this.selectedInvestorSicCodeList
	// 		});

	// 	}

	// 	if (this.selectedRegionList && !this.selectedRegionList.filter(val => !val).length && this.selectedRegionList.length > 0) {

	// 		this.globalFilterDataObject.filterData.push(
	// 			{
	// 				chip_group: 'Region',
	// 				chip_values: this.selectedRegionList
	// 			}
	// 		);

	// 	}
	// 	// if( this.selectedRegionList && this.selectedRegionList.length == 1 && this.selectedRegionList[0] == null ){
	// 	// 		this.selectedRegionList = this.regionListDropdownOptions.filter(val => val.label != 'All').map( item => item.value );
	// 	// 		this.globalFilterDataObject.filterData.push(
	// 	// 			{
	// 	// 				chip_group: 'Region',
	// 	// 				chip_values: this.selectedRegionList
	// 	// 			}
	// 	// 		);	

	// 	// }
		
	// 	this.investeeDisplayModal = true;

	// 	let data = {
	// 		userId: this.userAuthService?.getUserInfo('dbID'),
	// 		chipData: this.globalFilterDataObject.filterData,
	// 		saveFiltersName: formData.value.filtername,
	// 		searchType: 'Investee Finder'
	// 	};
	// 	if( click == 'Update Existing' ) {
	// 		data['saveFiltersID'] = this.saveFiltersId;
	// 	}
	// 	this.investeeFilterNameData = formData.value.filtername;
	// 	this.saveFilterData = true;

	// 	if (data.saveFiltersName !== "") {
	// 		this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_API', 'saveFilters', data ).subscribe(res => {
				
	// 			let data = res.body;
	// 			if (data.status === 200) {
	// 				this.msgs = [];
	// 				this.investeeDisplayModal = false;
	// 				this.msgs.push({ severity: 'info', summary: data.message });
	// 				setTimeout(() => {
	// 					this.msgs = [];
	// 				}, 3000);
	// 				this.investeeFilterNameData = '';
	// 				this.saveFilterData = false;
	// 				this.saveInFilterForm.reset();

	// 			} else if (data.status === 202) {
	// 				this.msgs = [];
	// 				this.investeeDisplayModal = false;
	// 				this.msgs.push({ severity: 'error', summary: data.message });
	// 				setTimeout(() => {
	// 					this.msgs = [];
	// 				}, 3000);
	// 			}
	// 		});
	// 	}

	// }

	validateInputField( event ) {

		let inputValue = event.value;

		if ( inputValue > 999 ) {
			this.showInputFieldMessage = true;
		} else {
            this.showInputFieldMessage = false;
        }
		
	}

	checkInputFieldForShareholdings( event, inputField ) {

		let inputValue = event.value;

		if ( inputField == 'investorShareholdingsGreaterThanValue' ) {
			this.investorShareholdingsGreaterThanValue = inputValue;
		}

		if ( inputField == 'investorShareholdingsLessThanValue' ) {
			this.investorShareholdingsLessThanValue = inputValue;
		}

		if ( this.investorShareholdingsLessThanValue && this.investorShareholdingsGreaterThanValue && ( this.investorShareholdingsLessThanValue <= this.investorShareholdingsGreaterThanValue ) ) {
			this.showInputFieldMessageForShareholdings = true;
		} else if ( !this.investorShareholdingsLessThanValue && this.investorShareholdingsGreaterThanValue ) {
			this.showInputFieldMessageForShareholdings = false;
		} else {
			this.showInputFieldMessageForShareholdings = false;
		}
		
	}

	ngAfterViewInit(): void {
        setTimeout(() => {
            this.sharedLoaderService.hideLoader();
        }, 2000);
	}
}
