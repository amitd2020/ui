import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiSelect } from 'primeng/multiselect';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SearchFiltersService } from 'src/app/interface/service/search-filter.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { AdminRecordListComponent } from 'src/app/interface/view/shared-components/shared-tables/admin-record-list/admin-record-list.component';
import { subscribedPlan } from 'src/environments/environment';
import { SearchCompanyService } from '../../../search-company/search-company.service';
import ChartDataLabels from "chartjs-plugin-datalabels";


export enum Month {
	undefined, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
}

@Component({
	selector: 'dg-investor-finder',
	templateUrl: './investor-finder.component.html',
	styleUrls: ['./investor-finder.component.scss'],
	providers: [AdminRecordListComponent]
})
export class InvestorFinderComponent implements OnInit {

	@ViewChild('LazyLeafletMapContainer', { read: ViewContainerRef }) LazyLeafletMapContainer: ViewContainerRef;
	@ViewChild('multiSelectForSicCodeMultiSelectId', { static: false }) public multiSelectForSicCodeMultiSelectId: MultiSelect;
	@ViewChild('multiSelectForIndustryTags', { static: false }) public multiSelectForIndustryTags: MultiSelect;
	@ViewChild('multiSelectRegionMultiSelectId', { static: false }) public multiSelectRegionMultiSelectId: MultiSelect;

	@ViewChild('multiSelectForInvestmentSicCodeMultiSelectId', { static: false }) public multiSelectForInvestmentSicCodeMultiSelectId: MultiSelect;
	@ViewChild('multiSelectForInvestmentIndustryTags', { static: false }) public multiSelectForInvestmentIndustryTags: MultiSelect;

	subscribedPlanModal: any = subscribedPlan;
	currentPlan: unknown;

	industryTagOptions: Array<{ label: string, value: string }> = [];
	fullListOfIndustryTagsOptions: Array<{ label: string, value: string }> = [];
	selectedIndustryTags: any;

	investmentIndustryTagOptions: Array<{ label: string, value: string }> = [];
	fullListOfInvestmentIndustryTagsOptions: Array<{ label: string, value: string }> = [];
	selectedInvestmentIndustryTags: any;

	companyAgeLessThanOrGreaterThan: string = 'less';
	companyAgeNumberValue: number;

	shareholdingsGreaterThanValue: number;
	shareholdingsLessThanValue: number;

	turnoverRangeDataValue: Number = 0;
	turnoverActualRangeDataValue: Number = 0;
	lineOptions: any;
	ablInsightsMapData: any;

	checkEstimatedTurnover: string = "true";

	regionListDropdownOptions: Array<{ label: string, value: string }>;
	selectedRegionList: any;
	appliedFilters: any;

	title: any;
	description: any;
	data: any;

    options: any;

	sicCodeListOptions: Array<object> = [
		{ label: 'A - agriculture forestry and fishing', value: 'agriculture forestry and fishing' },
		{ label: 'B - mining and quarrying', value: 'mining and quarrying' },
		{ label: 'C - manufacturing', value: 'manufacturing' },
		{ label: 'D - electricity, gas, steam and air conditioning supply', value: 'electricity, gas, steam and air conditioning supply' },
		{ label: 'E - water supply, sewerage, waste management and remediation activities', value: 'water supply, sewerage, waste management and remediation activities' },
		{ label: 'F - construction', value: 'construction' },
		{ label: 'G - wholesale and retail trade; repair of motor vehicles and motorcycles', value: 'wholesale and retail trade; repair of motor vehicles and motorcycles' },
		{ label: 'H - transportation and storage', value: 'transportation and storage' },
		{ label: 'I - accommodation and food service activities', value: 'accommodation and food service activities' },
		{ label: 'J - information and communication', value: 'information and communication' },
		{ label: 'K - financial and insurance activities', value: 'financial and insurance activities' },
		{ label: 'L - real estate activities', value: 'real estate activities' },
		{ label: 'M - professional, scientific and technical activities', value: 'professional, scientific and technical activities' },
		{ label: 'N - administrative and support service activities', value: 'administrative and support service activities' },
		{ label: 'O - public administration and defence; compulsory social security', value: 'public administration and defence; compulsory social security' },
		{ label: 'P - education', value: 'education' },
		{ label: 'Q - human health and social work activities', value: 'human health and social work activities' },
		{ label: 'R - arts, entertainment and recreation', value: 'arts, entertainment and recreation' },
		{ label: 'S - other service activities', value: 'other service activities' },
		{ label: 'T - activities of households as employers; undifferentiated goods- and services-producing activities of households for own use', value: 'activities of households as employers; undifferentiated goods- and services-producing activities of households for own use' },
		{ label: 'U - activities of extraterritorial organisations and bodies', value: 'activities of extraterritorial organisations and bodies' }
	];
	selectedSicCodeList: any;

	investmentSicCodeListOptions: Array<any> = [];
	fullListInvestmentSicCodeListOptions: Array<any> = [];
	selectedInvestmentSicCodeList: any;

	globalFilterDataObject: any = {
		filterData: [
			{ chip_group: "Status", chip_values: ["live"] },
		],
		pageSize: 25,
		startAfter: 0,
	};

	companiesColumnListForTable: Array<any> = [];
	companiesDataListForTable: Array<any> = [];
	searchTotalCount: number = 0;

	operatingTableElemnts: any;

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
	selectedGlobalCurrency: string = 'GBP';
	listId: string;
	listPageName: string;
	listName: string;
	payloadForChildApi;
	ChartDataLabelsPlugins = [ ChartDataLabels ];
	resetAppliedFiltersBoolean: boolean = false;

	
	constructor(
		private userAuthService: UserAuthService,
		private router: Router,
		private toCurrencyPipe: CurrencyPipe,
		private titlecasePipe: TitleCasePipe,
		private searchFilterService: SearchFiltersService,
		private commonService: CommonServiceService,
		private adminRecordListComponent: AdminRecordListComponent,
		private seoService: SeoService,
		private componentFactoryResolver: ComponentFactoryResolver,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService,
		public activatedRoute: ActivatedRoute,
		public searchCompanyService: SearchCompanyService
	) {

		this.currentPlan = this.userAuthService?.getUserInfo('planId');

		if ( !this.userAuthService.hasAddOnPermission('investorInvesteeLandscape') && this.subscribedPlanModal['Valentine_Special'] !== this.currentPlan ) {
            this.router.navigate(['/']);
        }
		
	}

	ngOnInit() {

		const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.data = {
            datasets: [
                {
                    data: [300, 50, 100],
                    backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')],
                }
            ]
        };


        this.options = {
            cutout: 50,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            }
        };

		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';
		const { cListId, listPageName, listName } = this.activatedRoute.snapshot.queryParams;

		this.listId = cListId;
		this.listPageName = listPageName;
		this.listName = listName;
		this.searchCompanyService.resetPayload();
        this.searchCompanyService.resetFilterData();
		this.searchCompanyService.updatePayload( { filterData: [{ chip_group: "Status", chip_values: ["live"] }] } );
		this.searchCompanyService.$apiPayloadBody.subscribe( res  => {
			this.payloadForChildApi = res;
		});

		this.sharedLoaderService.showLoader();

		this.initBreadcrumbAndSeoMetaTags();
		
		// this.getDataForDropdownLists('industryTags');

		this.getSearchResults( 'includeGlobalFilterParams', 'getInvestmentValues' );

		this.companiesColumnListForTable = [
            { field: 'businessName', header: 'Company Name', colunName: 'Company Name', minWidth: '360px', maxWidth: 'none', textAlign: 'left', value: true },
            { field: 'directorName', header: 'Director Name', colunName: 'Director Name', minWidth: '380px', maxWidth: '380px', textAlign: 'left', value: true },
            { field: 'otherFeatures', header: 'Features', colunName: 'Features', minWidth: '130px', maxWidth: '130px', textAlign: 'left', value: true },
            { field: 'companyRegistrationNumber', header: 'Company Number', colunName: 'Company Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left', value: true },
            { field: 'shareHoldingsCountLive', header: 'Total Shareholding', colunName: 'Total Shareholding', minWidth: '160px', maxWidth: '160px', textAlign: 'center', value: true },
            { field: 'companyStatus', header: 'Company Status', colunName: 'Company Status', minWidth: '150px', maxWidth: '150px', textAlign: 'center', value: true },
            { field: 'companyAge', header: 'Age', colunName: 'Age', minWidth: '80px', maxWidth: '80px', textAlign: 'right', value: true },
            { field: 'companyRegistrationDate', header: 'Incorporation Date', colunName: 'Incorporation Date', minWidth: '120px', maxWidth: 'no120pxne', textAlign: 'center', value: true },
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
		// 	{ label: 'Investor Finder', routerLink: ['/insights/investor-finder'] }
		// ]);

		this.title = "DataGardener Investor Finder - Automate your marketing workflows";
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
        instance.mapConfig.primaryMapId = `investorFinderMapContainer`;
		instance.mapData = { currentYearData: currentYearData };
		instance.requiredData = {
			thisPage: 'investorFinderPage',
			selectedRegionList: this.selectedRegionList ? this.selectedRegionList : '',
			globalFilterDataObject: this.payloadForChildApi,
			listId: this.listId
		}

		instance.mapGeoJsonOutput.subscribe( res => {

			this.getRegionsData( res );
		} );

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

	requestUpdateTableData( event ) {

		this.payloadForChildApi['pageSize'] = event.pageSize ? event.pageSize : 25;
		this.payloadForChildApi['startAfter'] = event.startAfter ? event.startAfter : 0;
		this.payloadForChildApi['sortOn'] = event.sortOn ? event.sortOn : [];
		this.payloadForChildApi['filterSearchArray'] = event.filterSearchArray ? event.filterSearchArray : [];
		this.getSearchResults();

	}

	investorFinderCommunicator(event) {
		this.getSearchResults();
	}

	getSearchResults( includeGlobalFilterParams?, investmentValueCheck? ) {

		this.sharedLoaderService.showLoader();

		this.showInputFieldMessage = false;
		this.showInputFieldMessageForShareholdings = false;
		let endPoint = !this.listId ? 'investeeSearchResults' : 'getCompaniesInListTableData';
		let route = !this.listId ? 'DG_API' : 'DG_LIST';

		// if ( includeGlobalFilterParams == 'includeGlobalFilterParams' ) {

		// 	this.globalFilterDataObject.filterData = [];

			if ( this.listId ) {
				this.payloadForChildApi.filterData.push( { chip_group: 'Saved Lists', chip_values: [this.listName] } );
				this.payloadForChildApi['listId'] = this.listId;
				this.payloadForChildApi['pageName'] = this.listPageName.split(' ').join('');
			} 
	
		// 	if ( this.checkEstimatedTurnover == "true" ) {
	
		// 		this.globalFilterDataObject.filterData.push(
		// 			{ chip_group: "Status", chip_values: ["live"] },
		// 			{ chip_group: "Preferences", chip_values: ["estimated turnover included"], preferenceOperator: [{ hasEstimatedTurnover: "true" }] }
		// 		);
	
		// 	} else {
		// 		this.globalFilterDataObject.filterData.push(
		// 			{ chip_group: "Status", chip_values: ["live"] },
		// 			{ chip_group: "Preferences",chip_values: ["estimated turnover not included"], preferenceOperator: [{ hasEstimatedTurnover: "false" }] }
		// 		);
		// 	}

		// 	if ( this.selectedIndustryTags && this.selectedIndustryTags.length ) {
		// 		this.globalFilterDataObject.filterData.push(
		// 			{ chip_group: "Industry", chip_values: this.selectedIndustryTags }
		// 		);
		// 	}
	
		// 	if ( this.selectedTurnOver && ( this.selectedTurnOver['greaterThan'] > 0 && this.selectedTurnOver['lessThan'] == undefined ) ) {
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
		// 	} else if ( this.selectedTurnOver && ( this.selectedTurnOver['greaterThan'] == undefined && this.selectedTurnOver['lessThan'] > 0 ) ) {
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
		// 	} else if ( this.selectedTurnOver && ( this.selectedTurnOver['greaterThan'] > 0 && this.selectedTurnOver['lessThan'] > 0 ) ) {
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
			
		// 	if ( this.shareholdingsGreaterThanValue > 0 && !this.shareholdingsLessThanValue ) {
		// 		this.globalFilterDataObject.filterData.push(
		// 			{
		// 				chip_group: "Number of Shareholdings", chip_values: [[this.shareholdingsGreaterThanValue.toString(), ""]]
	
		// 			}
		// 		);
		// 	} else if ( !this.shareholdingsGreaterThanValue && this.shareholdingsLessThanValue > 0 ) {
		// 		this.globalFilterDataObject.filterData.push(
		// 			{
		// 				chip_group: "Number of Shareholdings", chip_values: [["", this.shareholdingsLessThanValue.toString()]]
		// 			}
		// 		);
		// 	} else if ( this.shareholdingsGreaterThanValue > 0 && this.shareholdingsLessThanValue > 0 ) {
		// 		this.globalFilterDataObject.filterData.push(
		// 			{
		// 				chip_group: "Number of Shareholdings", chip_values: [[this.shareholdingsGreaterThanValue.toString(), this.shareholdingsLessThanValue.toString()]]
		// 			}
		// 		);
		// 	}  
	
		// 	if ( this.companyAgeLessThanOrGreaterThan == 'Greater Than' && this.companyAgeNumberValue) {
		// 		// let chipVal = [this.companyAgeLessThanOrGreaterThan + " " + this.companyAgeNumberValue];
		// 		let chipVal = [ this.companyAgeNumberValue, null ];
		// 		this.globalFilterDataObject.filterData.push(
		// 			{
		// 				chip_group: "Company Age Filter",
		// 				chip_values: [chipVal],
		// 				// ageOperator: ["greater"]
		// 			}
		// 		)
		// 	} else if ( this.companyAgeLessThanOrGreaterThan == 'Less Than' && this.companyAgeNumberValue ) {
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
	
		// 	if ( this.selectedSicCodeList && this.selectedSicCodeList.length > 0 ) {
	
		// 		let selectedSicCodeLabels: Array<any> = [];
	
		// 		for( let sicCodeLabel of this.sicCodeListOptions ) {
	
		// 			if ( this.selectedSicCodeList.includes(sicCodeLabel['value']) ) {
						
		// 				selectedSicCodeLabels.push(sicCodeLabel['label']);
		// 			}
	
		// 		}

		// 		// let sicCodesLabel = this.selectedSicCodeList.map(a => a.label)
		// 		// let sicCodesValue = this.selectedSicCodeList.map(a => a.value)
				
		// 		this.globalFilterDataObject.filterData.push({
		// 			chip_group: 'SIC Codes',
		// 			chip_industry_sic_codes: this.selectedSicCodeList,
		// 			chip_values: selectedSicCodeLabels
		// 		});
	
		// 	}
	
		// 	if ( this.selectedRegionList && !this.selectedRegionList.filter(val => !val).length && this.selectedRegionList.length > 0 ) {
		// 		this.globalFilterDataObject.filterData.push(
		// 			{
		// 				chip_group: 'Region',
		// 				chip_values: this.selectedRegionList
		// 			}
		// 		);
	
		// 	}
	
		// 	if ( this.selectedInvestmentSicCodeList && this.selectedInvestmentSicCodeList.length > 0 ) {
		// 		this.globalFilterDataObject.filterData.push({
		// 			chip_group: 'Invested Sic Code',
		// 			chip_values: this.selectedInvestmentSicCodeList
		// 		});
		// 	}
	
		// 	if ( this.selectedInvestmentIndustryTags && this.selectedInvestmentIndustryTags.length > 0 ) {
		// 		this.globalFilterDataObject.filterData.push({
		// 			chip_group: 'Invested Industry Tag',
		// 			chip_values: this.selectedInvestmentIndustryTags
		// 		});
		// 	}

		// }


		this.globalServerCommunication.globalServerRequestCall( 'post', route, endPoint, this.payloadForChildApi ).subscribe( res => {
			
			if ( res.body.status == 200 || res.status == 200 ) {

				if (res.body.mapData) {

					this.ablInsightsMapData = res.body.mapData;
					if ( ![ this.subscribedPlanModal['Valentine_Special'] ].includes( this.currentPlan ) ) {

						this.initLeafletMapContainer( this.ablInsightsMapData );

					}

				}

				if ( res.body.companiesData && res.body.companiesData.hits ) {

					this.companiesDataListForTable = [];
					this.searchTotalCount = res.body.companiesData.total.value;
					
					for ( let sourceData of res.body.companiesData.hits ) {
						this.companiesDataListForTable.push( sourceData._source );
					}

					this.companiesDataListForTable = this.formatCompanyData( this.companiesDataListForTable );
					
				} else if ( res.body.data && res.body.data.hits ) {

					this.companiesDataListForTable = [];
					this.searchTotalCount = res.body.data.total.value;
					
					for ( let sourceData of res.body.data.hits ) {
						this.companiesDataListForTable.push( sourceData._source );
					}

					this.companiesDataListForTable = this.formatCompanyData( this.companiesDataListForTable );
				}

				// if ( investmentValueCheck == 'getInvestmentValues' ) {

				// 	this.getDataForDropdownLists('investmentSicCode');
				// 	this.getDataForDropdownLists('investmentIndustryTags');

				// }

			}

		});

		this.appliedFilters = this.payloadForChildApi;

		setTimeout(() => {
			this.sharedLoaderService.hideLoader();
		}, 2000);	

	}

	// getDataForDropdownLists( requestingDataFor ) {
	// 	this.sharedLoaderService.showLoader()

    //     let aggrKey = '',
    //         otherRequiredKeys: any = [
    //             // { chip_group: "Status", chip_values: ["live"] }
    //         ],
	// 		payloadObj = {},
	// 		paramType = '';

	// 	if ( requestingDataFor == 'industryTags' ) {

	// 		aggrKey = 'industryTagList.keyword';

	// 		// if ( ( this.selectedRegionList && !this.selectedRegionList.filter(val => !val).length && this.selectedRegionList.length > 0 ) || ( this.selectedSicCodeList && this.selectedSicCodeList.length > 0 )) {
	// 			// this.selectedIndustryTags = [];
	// 			if(this.selectedIndustryTags?.length && !JSON.stringify( this.industryTagOptions).includes(this.selectedIndustryTags[0]) ){
	// 				this.selectedIndustryTags = [];
	// 			}	
	// 		// }

	// 		// if ( this.selectedIndustryTags) {
	// 		// 	otherRequiredKeys.push({
	// 		// 		chip_group: 'Industry',
	// 		// 		chip_values: this.selectedIndustryTags
	// 		// 	});
	// 		// }

	// 		if ( this.listId ) {
	// 			otherRequiredKeys.push(
	// 				{ chip_group: 'Saved Lists', chip_values: [this.listName] },
	// 			);
	// 			paramType = 'Industry';
	// 			payloadObj['listId'] = this.listId;
	// 			payloadObj['pageName'] = this.listPageName.split(' ').join('');
	// 		}
			
	// 		if ( this.checkEstimatedTurnover == "true" ) {
				
	// 			otherRequiredKeys.push(
	// 				{ chip_group: "Status", chip_values: ["live"] },
	// 				{ chip_group: "Preferences", chip_values: ["estimated turnover included"], preferenceOperator: [{ hasEstimatedTurnover: "true" }] }
	// 			);
				
	// 		} else {
	// 			otherRequiredKeys.push(
	// 				{ chip_group: "Status", chip_values: ["live"] },
	// 				{ chip_group: "Preferences",chip_values: ["estimated turnover not included"], preferenceOperator: [{ hasEstimatedTurnover: "false" }] }
	// 			);
	// 		}

	// 	}

	// 	if ( requestingDataFor == 'investmentSicCode' ) {

	// 		aggrKey = 'invested_companies.sic_industry.keyword';

	// 		// Payload for sending all the applied filter

	// 		if ( this.listId ) {
	// 			otherRequiredKeys.push(
	// 				{ chip_group: 'Saved Lists', chip_values: [this.listName] },
	// 			);
	// 			paramType = 'Investment SicCode';
	// 			payloadObj['listId'] = this.listId;
	// 			payloadObj['pageName'] = this.listPageName.split(' ').join('');
	// 		}

	// 		if ( this.checkEstimatedTurnover == "true" ) {
				
	// 			otherRequiredKeys.push(
	// 				{ chip_group: "Status", chip_values: ["live"] },
	// 				{ chip_group: "Preferences", chip_values: ["estimated turnover included"], preferenceOperator: [{ hasEstimatedTurnover: "true" }] }
	// 			);
				
	// 		} else {
	// 			otherRequiredKeys.push(
	// 				{ chip_group: "Status", chip_values: ["live"] },
	// 				{ chip_group: "Preferences",chip_values: ["estimated turnover not included"], preferenceOperator: [{ hasEstimatedTurnover: "false" }] }
	// 			);
	// 		}

	// 		if ( this.selectedIndustryTags && this.selectedIndustryTags.length > 0 ) {
	// 			otherRequiredKeys.push({
	// 				chip_group: 'Industry',
	// 				chip_values: this.selectedIndustryTags
	// 			});
	// 		}
			
	// 		if ( this.selectedInvestmentIndustryTags && this.selectedInvestmentIndustryTags.length > 0 ) {
	// 			otherRequiredKeys.push({
	// 				chip_group: 'Invested Industry Tag',
	// 				chip_values: this.selectedInvestmentIndustryTags
	// 			});
	// 		}
	// 	}

	// 	if ( requestingDataFor == 'investmentIndustryTags' ) {

	// 		aggrKey = 'invested_companies.industryTagList.keyword';

	// 		// Payload for sending all the applied filter

			
	// 		if ( this.listId ) {
	// 			otherRequiredKeys.push(
	// 				{ chip_group: 'Saved Lists', chip_values: [this.listName] },
	// 			);
	// 			paramType = 'Investment Industry Tags';
	// 			payloadObj['listId'] = this.listId;
	// 			payloadObj['pageName'] = this.listPageName.split(' ').join('');
	// 		}

	// 		if ( this.checkEstimatedTurnover == "true" ) {
				
	// 			otherRequiredKeys.push(
	// 				{ chip_group: "Status", chip_values: ["live"] },
	// 				{ chip_group: "Preferences", chip_values: ["estimated turnover included"], preferenceOperator: [{ hasEstimatedTurnover: "true" }] }
	// 			);
				
	// 		} else {
	// 			otherRequiredKeys.push(
	// 				{ chip_group: "Status", chip_values: ["live"] },
	// 				{ chip_group: "Preferences",chip_values: ["estimated turnover not included"], preferenceOperator: [{ hasEstimatedTurnover: "false" }] }
	// 			);
	// 		}
			
	// 		if ( this.selectedIndustryTags && this.selectedIndustryTags.length > 0 ) {
	// 			otherRequiredKeys.push({
	// 				chip_group: 'Industry',
	// 				chip_values: this.selectedIndustryTags
	// 			});
	// 		}
	

	// 	}

    //     if ( this.selectedTurnOver && ( this.selectedTurnOver['greaterThan'] > 0 && this.selectedTurnOver['lessThan'] == undefined ) ) {
            
	// 		otherRequiredKeys.push(
    //             {
    //                 chip_group: "Key Financials", chip_values: [{
    //                     key: "turnover",
    //                     greater_than: this.selectedTurnOver['greaterThan'],
    //                     less_than: "",
    //                     financialBoolean: true,
    //                     selected_year: "true"
    //                 }]
    //             }
    //         );
    //     } else if ( this.selectedTurnOver && ( this.selectedTurnOver['greaterThan'] == undefined && this.selectedTurnOver['lessThan'] > 0 ) ) {
            
	// 		otherRequiredKeys.push(
    //             {
    //                 chip_group: "Key Financials", chip_values: [{
    //                     key: "turnover",
    //                     greater_than: "",
    //                     less_than: this.selectedTurnOver['lessThan'],
    //                     financialBoolean: true,
    //                     selected_year: "true"
    //                 }]
    //             }
    //         );
    //     } else if ( this.selectedTurnOver && ( this.selectedTurnOver['greaterThan'] > 0 && this.selectedTurnOver['lessThan'] > 0 ) ) {
            
	// 		otherRequiredKeys.push(
    //             {
    //                 chip_group: "Key Financials", chip_values: [{
    //                     key: "turnover",
    //                     greater_than: this.selectedTurnOver['greaterThan'],
    //                     less_than: this.selectedTurnOver['lessThan'],
    //                     financialBoolean: true,
    //                     selected_year: "true"
    //                 }]
    //             }
    //         );
    //     }   
		
	// 	if ( this.shareholdingsGreaterThanValue > 0 && this.shareholdingsLessThanValue == undefined) {
            
	// 		otherRequiredKeys.push(
    //             {
	// 				chip_group: "Number of Shareholdings", chip_values: [[this.shareholdingsGreaterThanValue.toString(), ""]]

    //             }
    //         );
    //     } else if ( this.shareholdingsGreaterThanValue == undefined && this.shareholdingsLessThanValue > 0 ) {
            
	// 		otherRequiredKeys.push(
    //             {
    //                 chip_group: "Number of Shareholdings", chip_values: [["", this.shareholdingsLessThanValue.toString()]]
    //             }
    //         );
    //     } else if ( this.shareholdingsGreaterThanValue > 0 && this.shareholdingsLessThanValue > 0 ) {
            
	// 		otherRequiredKeys.push(
    //             {
    //                 chip_group: "Number of Shareholdings", chip_values: [[this.shareholdingsGreaterThanValue.toString(), this.shareholdingsLessThanValue.toString()]]
    //             }
    //         );
    //     }  

	// 	if ( this.companyAgeLessThanOrGreaterThan == 'Greater Than' && this.companyAgeNumberValue ) {
    //         // let chipVal = [this.companyAgeLessThanOrGreaterThan + " " + this.companyAgeNumberValue];
    //         let chipVal = [ this.companyAgeNumberValue, null ];
            
	// 		otherRequiredKeys.push(
    //             {
    //                 chip_group: "Company Age Filter",
    //                 chip_values: [chipVal],
    //                 // ageOperator: ["greater"]
    //             }
    //         )
    //     } else if ( this.companyAgeLessThanOrGreaterThan == 'Less Than' && this.companyAgeNumberValue ) {
    //         // let chipVal = [this.companyAgeLessThanOrGreaterThan + " " + this.companyAgeNumberValue];
    //         let chipVal = [ null, this.companyAgeNumberValue];
            
	// 		otherRequiredKeys.push(
    //             {
    //                 chip_group: "Company Age Filter",
    //                 chip_values: [chipVal],
    //                 // ageOperator: ["less"]
    //             }
    //         )
    //     }

	// 	if ( this.selectedRegionList && !this.selectedRegionList.filter(val => !val).length && this.selectedRegionList.length > 0 ) {
    //         otherRequiredKeys.push(
    //             {
    //                 chip_group: 'Region',
    //                 chip_values: this.selectedRegionList
    //             }
    //         );

    //     }

	// 	if ( this.selectedSicCodeList && this.selectedSicCodeList.length > 0 ) {

    //         let selectedSicCodeLabels: Array<any> = [];

    //         for( let industryLabel of this.sicCodeListOptions ) {

    //             if ( this.selectedSicCodeList.includes(industryLabel['value']) ) {
                    
    //                 selectedSicCodeLabels.push(industryLabel['label']);
    //             }

    //         }
	// 		// let sicCodesLabelChipGroup = this.selectedSicCodeList.map(a => a.label)
	// 		// let sicCodesValueChipGroup = this.selectedSicCodeList.map(a => a.value)

    //         otherRequiredKeys.push({
    //             chip_group: 'SIC Codes',
    //             chip_industry_sic_codes: this.selectedSicCodeList,
    //             chip_values: selectedSicCodeLabels
    //         });

    //     }

	// 	if ( this.selectedInvestmentSicCodeList && this.selectedInvestmentSicCodeList.length > 0 ) {
	// 		otherRequiredKeys.push({
	// 			chip_group: 'Invested Sic Code',
	// 			chip_values: this.selectedInvestmentSicCodeList
	// 		});
	// 	}

	// 	if ( this.selectedInvestmentIndustryTags && this.selectedInvestmentIndustryTags.length > 0 ) {
	// 		otherRequiredKeys.push({
	// 			chip_group: 'Invested Industry Tag',
	// 			chip_values: this.selectedInvestmentIndustryTags
	// 		});
	// 	}

    //     this.searchFilterService.getAllFilterProps( otherRequiredKeys, 'aggregateBy', paramType, aggrKey, 'companySearch', payloadObj).then( res => {

    //         let temporaryDataArrayContainer = [];

	// 		if ( res.distinct_categories ) {
	
	// 			res.distinct_categories.buckets = res.distinct_categories.buckets.sort( (a, b) => b.doc_count - a.doc_count );

	// 			for ( let val of res.distinct_categories.buckets ) {
	
	// 				temporaryDataArrayContainer.push( { label: val.key.replace( /(^|\s)\S/g, function (t) { return t.toUpperCase() } ) + ' (' + this.toCurrencyPipe.transform( val.doc_count, '', '', '1.0-0' ) + ')', value: val.key } );
	
	// 			}
	
	// 			if ( requestingDataFor == 'industryTags' ) {
	
	// 				this.fullListOfIndustryTagsOptions = temporaryDataArrayContainer;

	// 			}
	
	// 			if ( requestingDataFor == 'investmentSicCode' ) {
	
	// 				this.fullListInvestmentSicCodeListOptions = temporaryDataArrayContainer;
					
	// 			}
	
	// 			if ( requestingDataFor == 'investmentIndustryTags' ) {
	
	// 				this.fullListOfInvestmentIndustryTagsOptions = temporaryDataArrayContainer;
					
	// 			}

	// 		}


    //     });
	// 	setTimeout(() => {
	// 		this.sharedLoaderService.hideLoader()
			
	// 	}, 1000);
    // }

	showFullListOfIndustryTags( requestingDataFor ) {

        this.showLessListOfIndustryTags( requestingDataFor );

		if ( requestingDataFor == 'industryTags' ) {

			setTimeout(() => {
				this.industryTagOptions = this.fullListOfIndustryTagsOptions;
			}, 1000);
			
		}
		
		if ( requestingDataFor == 'investmentSicCode' ) {
			
			setTimeout(() => {
				this.investmentSicCodeListOptions = this.fullListInvestmentSicCodeListOptions;
			}, 1000);

		}
		
		if ( requestingDataFor == 'investmentIndustryTags' ) {
			
			setTimeout(() => {
				this.investmentIndustryTagOptions = this.fullListOfInvestmentIndustryTagsOptions;
			}, 1000);

		}
    }

	showLessListOfIndustryTags( requestingDataFor ) {

		if ( requestingDataFor == 'industryTags' ) {

			this.industryTagOptions = [];
			
			for ( let listOptObjKey in this.fullListOfIndustryTagsOptions ) {
				if ( +listOptObjKey < 100 ) {
					this.industryTagOptions.push( this.fullListOfIndustryTagsOptions[ +listOptObjKey ] );
				}
			}
			
		}
		
		if ( requestingDataFor == 'investmentSicCode' ) {
			
			this.investmentSicCodeListOptions = [];
			
			for ( let listOptObjKey in this.fullListInvestmentSicCodeListOptions ) {
				if ( +listOptObjKey < 100 ) {
					this.investmentSicCodeListOptions.push( this.fullListInvestmentSicCodeListOptions[ +listOptObjKey ] );
				}
			}

		}
		
		if ( requestingDataFor == 'investmentIndustryTags' ) {
			
			this.investmentIndustryTagOptions = [];
			
			for ( let listOptObjKey in this.fullListOfInvestmentIndustryTagsOptions ) {
				if ( +listOptObjKey < 100 ) {
					this.investmentIndustryTagOptions.push( this.fullListOfInvestmentIndustryTagsOptions[ +listOptObjKey ] );
				}
			}

		}

    }

	formatCompanyData( companyData ) {
		
        let cmpNoArray = [];
        let companyContactCmpNoArr = [];

        for (let i = 0; i < companyData.length; i++) {

			/* START: Preparing object for show charges table, to be send to user-list table */

			let obj = {};
			
			obj["businessName"] = companyData[i].businessName;

			obj["companyDOIAgeForCharges"] = (this.commonService.calculateAge(companyData[i]['companyRegistrationDate']));
			
			obj["companyRegistrationNumber"] = companyData[i]['companyRegistrationNumber'] && companyData[i]['companyRegistrationNumber'] != "" ? companyData[i]['companyRegistrationNumber'] : "" ;
			
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
			person_counts : string,
			person_countsfully : string,
			person_countspartial : string,
			mortgage_array =[],
			mortgageCount: string,
			person_array = [],
			person_array_fully = [],
			person_array_partial = [],
			replaceString = /Limited|limited|ltd|Ltd|[�]/g,
			newString : string,
			newStringForFS : string,
			newStringForPS : string,
			temchargeData = []


			if (companyData[i]["chargesData"]) {
				companyData[i]["chargesData"].forEach(elementCharges => {
					//  memorandumNatureArray.push(elementCharges['memorandumNature']);
					/* Outstanding count */
					if (["t", "u", "v", "w", "x", "y", "z", null, ""].includes(elementCharges['memorandumNature'])) {
						temchargeData.push(elementCharges)
						outstandingCount++;
					}
					/* Fully Satisfied count */

					if(["b","f","p","r"].includes(elementCharges['memorandumNature'])){
						fullySatisfiedCount++;
					}

					/* For Month name to count number (Only Outstanding) */
					if (["t", "u", "v", "w", "x", "y", "z", null, ""].includes(elementCharges['memorandumNature'])) {

						if (elementCharges['createdDate']) {
							let tempDate = elementCharges['createdDate'];
							monthArray.push(Month[parseInt(tempDate.split('/')[1])]);
						}
					}
					if (elementCharges["mortgageDetails"] && elementCharges["mortgageDetails"].length > 0 ) {
						elementCharges["mortgageDetails"].forEach(element => {
		
							if (element.recordType == "mortgage type") {
								tempCharge["classification"] = this.titlecasePipe.transform(element.description);
								mortgage_array.push(tempCharge["classification"]);
							}
							// person entitled ( outstanding )
							if (["t", "u", "v", "w", "x", "y", "z", null, ""].includes(elementCharges['memorandumNature'])) { 
								if( element.recordType == "persons entitled") {
	
									newString = element.description.replace(replaceString, (_match) => {
										return "";
									});
									
									tempCharge["person_entile_outs"] = this.titlecasePipe.transform(newString);
									person_entiledArr.push(tempCharge["person_entile_outs"]);
								
								}
							}
							//person entitled ( fully satisfied )
							if(["b","f","p","r"].includes(elementCharges['memorandumNature'])) {
								if( element.recordType == "persons entitled" ) {
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
							for(let countPerson of person_entiledArr){
								countP[countPerson] = 1 + ( countP[countPerson] || 0 )
							}
							person_counts = Object.keys(countP).map(function (key) {
								return " " + key +'('+ countP[key] + ')';
			
							}).join(",");
							/*  */

							/* For Fully Satisfied */
							for(let countPersonFuly of person_entiledArrForFs) {
								countPFS[countPersonFuly] = 1 + (countPFS[countPersonFuly] || 0 )
							}
							person_countsfully = Object.keys(countPFS).map(function (key) {
								return " " + key +'('+ countPFS[key] + ')';
							}).join(",");
							/*  */

							/* For Partial Satisfied */
							for(let countPersonPartial of person_entiledArrForPS) {
								countPPS[countPersonPartial] = 1 + (countPPS[countPersonPartial] || 0 )
							}
							person_countspartial = Object.keys(countPPS).map(function (key) {
								return " " + key +'('+ countPPS[key] + ')';
							}).join(",");
							/*  */


							for(let countmortage of mortgage_array){
								countM[countmortage] = 1 + ( countM[countmortage] || 0 )
							}
							mortgageCount = Object.keys(countM).map(function (key) {
								return " " + key +'('+ countM[key] + ')';
			
							}).join(",");
						});
					}
				});
			}    

			if(companyData[i]["pscName"]) {
				companyData[i]["pscName"].forEach(elemenPsc => {
					if(elemenPsc){
						pscArray.push(this.titlecasePipe.transform(' ' + elemenPsc));
					}
				});
			}

            if (companyData[i]["personContactDetails"]) {
                for (let person of companyData[i]["personContactDetails"]) {
                    let personFullName = "";
                    if (person.middle_name) {
                        personFullName = person.first_name + ' '+ person.middle_name + ' ' + person.last_name;
                    } else {
                        personFullName = person.first_name + ' ' + person.last_name;
                    }
                }
            }

            if (companyData[i]["directorsData"]) {
                for (let director of companyData[i]["directorsData"]) {

                    if(director["detailedInformation"] && director["detailedInformation"]["fullName"]){
                            
                        directorNameArr.push(this.titlecasePipe.transform(director["detailedInformation"]["fullName"]));
                        
                    }
                    
                    if (director.directorJobRole && director.directorJobRole !== " ") {
                        companyData[i]['occupation'] = this.titlecasePipe.transform(director.directorJobRole);
                    }else {
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
			if(person_countsfully){
				obj['person_entile_fully'] = person_countsfully.replace(/[\s;]+/g," ").split(",");
			}
			if(person_countspartial){
				obj['person_entile_partial'] = person_countspartial.replace(/[\s;]+/g," ").split(",");
			}
			
			person_array.push(obj['person_entile_outs']);  
			obj['person_entile_outs'] = person_array[0];

			person_array_fully.push(obj['person_entile_fully']);
			obj['person_entile_fully'] = person_array_fully[0];

			person_array_partial.push(obj['person_entile_partial']);
			obj['person_entile_partial'] = person_array_partial[0];
                
            if (companyData[i].simplifiedAccounts) {

                if(companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].turnover && companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].turnover != ""){
                    companyData[i]['turnover_latest'] = companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].turnover;
                    obj["turnover"] = companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].turnover;
                } else {
                    companyData[i]['turnover_latest'] = "-";
                    obj["turnover"] = undefined;
                }
                if(companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].estimated_turnover && companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].estimated_turnover != ""){
                    companyData[i]['estimated_turnover'] = companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].estimated_turnover;                    
                    obj["estimated_turnover"] = companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].estimated_turnover;
                } else {
                    companyData[i]['estimated_turnover'] = "-";
                    obj["estimated_turnover"] = undefined;
                }
                if(companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].totalAssets && companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].totalAssets != ""){
                    companyData[i]['totalAssets_latest'] = companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].totalAssets;
                } else {
                    companyData[i]['totalAssets_latest'] = "-";
                }
                if(companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].totalLiabilities && companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].totalLiabilities != ""){
                    companyData[i]['totalLiabilities_latest'] = companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].totalLiabilities;
                } else {
                    companyData[i]['totalLiabilities_latest'] = "-";
                }
                if(companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].netWorth && companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].netWorth != ""){
                    companyData[i]['netWorth_latest'] = companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].netWorth;
                    obj["netWorth"] = companyData[i].simplifiedAccounts[companyData[i].simplifiedAccounts.length - 1].netWorth;
                } else {
                    companyData[i]['netWorth_latest'] = "-";
                    obj["netWorth"] = undefined;
                } 
                if(companyData[i].statutoryAccounts){
                if(companyData[i].statutoryAccounts[companyData[i].simplifiedAccounts.length - 1].grossProfit && companyData[i].statutoryAccounts[companyData[i].simplifiedAccounts.length - 1].grossProfit != ""){
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
            if (companyData[i].hasCompanyLinkedinUrl || companyData[i].hasCompanyWebsite || companyData[i].hasCompanyGenericMail ) {
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
        this.selectedSicCodeList = [];
        this.selectedIndustryTags = [];
        this.selectedRegionList = undefined;
        this.checkEstimatedTurnover = "true";
        this.shareholdingsGreaterThanValue = undefined;
        this.shareholdingsLessThanValue = undefined;
        this.companyAgeLessThanOrGreaterThan = undefined;
        this.companyAgeNumberValue = undefined;
        this.selectedTurnOver = undefined;
		this.showInputFieldMessage = false;
		this.showInputFieldMessageForShareholdings = false;

		this.multiSelectForSicCodeMultiSelectId.filterValue = null;
		this.multiSelectForIndustryTags.filterValue = null;
		this.multiSelectRegionMultiSelectId.filterValue = null;

		this.payloadForChildApi['pageSize'] = 25;
		this.payloadForChildApi['startAfter'] = 0;
		this.payloadForChildApi['sortOn'] = [];
		this.payloadForChildApi['filterSearchArray'] = [];
		
		this.resetTablePagination();
        
        // this.getDataForDropdownLists('industryTags');
		this.getSearchResults( 'includeGlobalFilterParams', 'getInvestmentValues' );

    }

	resetInvestmentCriteria() {

		this.selectedInvestmentSicCodeList = [];
		this.selectedInvestmentIndustryTags = [];

		this.multiSelectForInvestmentSicCodeMultiSelectId.filterValue = null;
		this.multiSelectForInvestmentIndustryTags.filterValue = null;

		this.payloadForChildApi['pageSize'] = 25;
		this.payloadForChildApi['startAfter'] = 0;
		this.payloadForChildApi['sortOn'] = [];
		this.payloadForChildApi['filterSearchArray'] = [];
		
		this.resetTablePagination();
		
        this.getSearchResults( 'includeGlobalFilterParams', 'getInvestmentValues' );

    }

	getOperatingTable( event ) {
		if ( event.requestFor === 'SidePanel' ) {
            this.showCompanySideDetailsPanel( event.compNumber, event.compName, event.rowData );
        } else {
            this.operatingTableElemnts = event;
        }
	}

	resetTablePagination() {

		this.adminRecordListComponent.resetFilters( this.operatingTableElemnts.adminRecordListTable );

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

		if ( inputField == 'shareholdingsGreaterThanValue' ) {
			this.shareholdingsGreaterThanValue = inputValue
		}

		if ( inputField == 'shareholdingsLessThanValue' ) {
			this.shareholdingsLessThanValue = inputValue
		}

		if ( this.shareholdingsLessThanValue && this.shareholdingsGreaterThanValue && ( this.shareholdingsLessThanValue <= this.shareholdingsGreaterThanValue ) ) {
			this.showInputFieldMessageForShareholdings = true;
		} else if ( !this.shareholdingsLessThanValue && this.shareholdingsGreaterThanValue ) {
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
