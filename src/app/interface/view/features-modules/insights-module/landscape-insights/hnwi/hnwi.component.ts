import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { MultiSelect } from 'primeng/multiselect';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SearchFiltersService } from 'src/app/interface/service/search-filter.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { AdminRecordListComponent } from 'src/app/interface/view/shared-components/shared-tables/admin-record-list/admin-record-list.component';
import { subscribedPlan } from 'src/environments/environment';

export enum Month {
	undefined, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
}

@Component({
	selector: 'dg-hnwi',
	templateUrl: './hnwi.component.html',
	styleUrls: ['./hnwi.component.scss'],
	providers: [AdminRecordListComponent]
})

export class HnwiComponent implements OnInit {

	@ViewChild( 'LazyLeafletMapContainer', { read: ViewContainerRef } ) LazyLeafletMapContainer: ViewContainerRef;

	@ViewChild('multiSelectForSicCodeMultiSelectId', { static: false }) public multiSelectForSicCodeMultiSelectId: MultiSelect;
	@ViewChild('multiSelectForIndustryTags', { static: false }) public multiSelectForIndustryTags: MultiSelect;
	@ViewChild('multiSelectRegionMultiSelectId', { static: false }) public multiSelectRegionMultiSelectId: MultiSelect;

	subscribedPlanModal: any = subscribedPlan;
	currentPlan: unknown;

	industryTagOptions: Array<{ label: string, value: string }> = [];
	fullListOfIndustryTagsOptions: Array<{ label: string, value: string }> = [];
	selectedIndustryTags: any;

	investorCompanyNameOrNumber: string;

	companyAgeLessThanOrGreaterThan: string = 'less';
	companyAgeNumberValue: number;

	actualTurnoverGreaterThan: number;
	actualTurnoverLessThan: number;

    turnoverGreaterThan: number;
    turnoverLessThan: number;

	investorShareholdingsGreaterThanValue: number;
	investorShareholdingsLessThanValue: number;

	turnoverRangeDataValue: Number = 0;
	turnoverActualRangeDataValue: Number = 0;
	lineOptions: any;
	ablInsightsMapData: any;

	checkEstimatedTurnover: string = "true";

	regionListDropdownOptions: Array<{ label: string, value: string }>;
	selectedRegionList: any;

	investorSicCodeListOptions: Array<object> = [];
	fullListOfInvestorSicCodeListOptions: Array<object> = [];
	selectedInvestorSicCodeList: any;

	globalFilterDataObject: any = {
		filterData: [],
		pageSize: 25,
		startAfter: 0,
		filterSearchArray: [],
		sortOn: []
	};

	companiesColumnListForTable: Array<any> = [];
	companiesDataListForTable: Array<any> = [];
	searchTotalCount: number = 0;

	operatingTableElemnts: any;

	title: any;
	description: any;

	showInputFieldMessage: boolean = false;
	showInputFieldMessageForShareholdings: boolean = false;
	showInputFieldMessageForTurnover: boolean = false;

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

	// For Company Deatils Side Panel
	showCompanySideDetails: boolean = false;
	companySideDetailsParams: any = { companyNumber: undefined, companyName: undefined };
	corporateSideOverviewData: object;
	overviewName: string;
	selectedGlobalCurrency: string = 'GBP';
	constructor(
		private userAuthService: UserAuthService,
		private toCurrencyPipe: CurrencyPipe,
		private searchFilterService: SearchFiltersService,
		private adminRecordListComponent: AdminRecordListComponent,
		private seoService: SeoService,
		private componentFactoryResolver: ComponentFactoryResolver,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunicate: ServerCommunicationService
	) { }

	ngOnInit() {

		this.currentPlan = this.userAuthService?.getUserInfo('planId');
		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';
		
		this.sharedLoaderService.showLoader();

		this.initBreadcrumbAndSeoMetaTags();
		
		this.getDataForDropdownLists('investorSicCodeList');
		this.getDataForDropdownLists('industryTags');

		this.getSearchResults('includeGlobalFilterParams');

		this.companiesColumnListForTable = [
			{ field: 'investor_name', header: 'Investor Name', colunName: 'Investor Name', maxWidth: 'none', minWidth: '300px',textAlign: 'left', value: true },
			{ field: 'shareholdingInformation', header: 'Shareholdings Information', colunName: 'Shareholdings Information', maxWidth: '200px', minWidth: '200px',textAlign: 'center', value: true },
			{ field: 'industryArray', header: 'Industry', colunName: 'Industry', maxWidth: '420px',minWidth: '420px', textAlign: 'left', value: true },
			{ field: 'credibility', header: 'Matching Confidence', colunName: 'Matching Confidence', maxWidth: '200px', minWidth: '200px',textAlign: 'center', value: true },
		];

	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems([
		// 	{ label: 'HNWI Landscape', routerLink: ['insights/hnwi'] }
		// ]);

		this.title = "DataGardener HNWI Landscape - Automate your marketing workflows";
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

		this.globalFilterDataObject['pageSize'] = event.pageSize ? event.pageSize : 25;
		this.globalFilterDataObject['startAfter'] = event.startAfter ? event.startAfter : 0;
		this.globalFilterDataObject['sortOn'] = event.sortOn ? event.sortOn : [];
		this.globalFilterDataObject['filterSearchArray'] = event.filterSearchArray ? event.filterSearchArray : []

		this.getSearchResults();

	}

	getSearchResults(includeGlobalFilterParams?) {

		this.sharedLoaderService.showLoader();

		this.showInputFieldMessage = false;
		this.showInputFieldMessageForShareholdings = false;
		this.showInputFieldMessageForTurnover = false;

		if (includeGlobalFilterParams == 'includeGlobalFilterParams') {

			this.globalFilterDataObject.filterData = [];

			if (this.selectedIndustryTags && this.selectedIndustryTags.length > 0) {
				this.globalFilterDataObject.filterData.push(
					{ chip_group: "Investment Industry", chip_values: this.selectedIndustryTags }
				);
			}

			if (this.turnoverGreaterThan > 0 && !this.turnoverLessThan) {
                this.globalFilterDataObject.filterData.push(
                    {
                        chip_group: "Key Financials", chip_values: [{
                            key: "turnover",
                            greater_than: this.turnoverGreaterThan,
                            less_than: "",
                            financialBoolean: true,
                            selected_year: "true"
                        }, {
                            key: "estimated_turnover",
                            greater_than: this.turnoverGreaterThan,
                            less_than: "",
                            financialBoolean: true,
                            selected_year: "true"
                        }]
                    }
                );
			} else if (!this.turnoverGreaterThan && this.turnoverLessThan > 0) {
                this.globalFilterDataObject.filterData.push(
                    {
                        chip_group: "Key Financials", chip_values: [{
                            key: "turnover",
                            greater_than: "",
                            less_than: this.turnoverLessThan,
                            financialBoolean: true,
                            selected_year: "true"
                        }, {
                            key: "estimated_turnover",
                            greater_than: "",
                            less_than: this.turnoverLessThan,
                            financialBoolean: true,
                            selected_year: "true"
                        }]
                    }
                );
			} else if ( this.turnoverGreaterThan > 0 && this.turnoverLessThan > 0 ) {
                this.globalFilterDataObject.filterData.push(
                    {
                        chip_group: "Key Financials", chip_values: [{
                            key: "turnover",
                            greater_than: this.turnoverGreaterThan,
                            less_than: this.turnoverLessThan,
                            financialBoolean: true,
                            selected_year: "true"
                        }, {
                            key: "estimated_turnover",
                            greater_than: this.turnoverGreaterThan,
                            less_than: this.turnoverLessThan,
                            financialBoolean: true,
                            selected_year: "true"
                        }]
                    }
                );
			}

			if (this.investorShareholdingsGreaterThanValue || this.investorShareholdingsLessThanValue) {
				this.globalFilterDataObject.filterData.push(
					{
						chip_group: "Individual Shareholdings",
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
				this.globalFilterDataObject.filterData.push(
					{
						chip_group: "Company Age Filter",
						chip_values: [chipVal],
						// ageOperator: ["greater"]
					}
				)
			} else if (this.companyAgeLessThanOrGreaterThan == 'Less Than' && this.companyAgeNumberValue) {
				// let chipVal = [this.companyAgeLessThanOrGreaterThan + " " + this.companyAgeNumberValue];
				let chipVal = [ null, this.companyAgeNumberValue ];
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
					chip_group: "Individual Name",
					chip_values: [this.investorCompanyNameOrNumber.replace(/^[, ]+|[, ]+$|[, ]+/g, " ").trim()],
					investorCompanySearchAndOr: "and"
				});
			}

			if (this.selectedInvestorSicCodeList && this.selectedInvestorSicCodeList.length > 0) {

				this.globalFilterDataObject.filterData.push({
					chip_group: 'Investment Sic Code',
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

		}

		this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_API', 'hwiSearchResultsNew', this.globalFilterDataObject ).subscribe(res => {
			if (res.body.status == 200) {

				if (res.body.mapData) {

					this.ablInsightsMapData = res.body.mapData;
					if ( ![ this.subscribedPlanModal['Valentine_Special'] ].includes( this.currentPlan ) ) {

						this.initLeafletMapContainer( this.ablInsightsMapData );

					}

				}

				if (res.body.results) {

					this.companiesDataListForTable = [];
					this.searchTotalCount = res.body.totalCount;

					for (let sourceData of res.body.results) {
						this.companiesDataListForTable.push(sourceData);
					}

				}

			}

		});

		setTimeout(() => {
            this.sharedLoaderService.hideLoader();
        }, 2000);

	}

	async initLeafletMapContainer( currentYearData ) {

		const { LazyLeafletMapComponent } = await import('../../../../shared-components/lazy-leaflet-map/lazy-leaflet-map.component');

		this.LazyLeafletMapContainer.clear();

		const { instance } = this.LazyLeafletMapContainer.createComponent( LazyLeafletMapComponent );
        instance.mapConfig.primaryMapId = `hnwiLandscapeMapContainer`;
		instance.mapData = { currentYearData: currentYearData };
		instance.requiredData = {
			thisPage: 'hnwiLandscape',
			selectedRegionList: this.selectedRegionList ? this.selectedRegionList : '',
			globalFilterDataObject: this.globalFilterDataObject
		}

		instance.mapGeoJsonOutput.subscribe( res => {
			this.getRegionsData( res );
		});

	}

	getDataForDropdownLists(requestingDataFor) {

		let aggrKey = '',
			otherRequiredKeys: any = [];

		if (requestingDataFor == 'industryTags') {

			aggrKey = 'shareholdingInformation.industryTagList.keyword';

			if (this.selectedIndustryTags && this.selectedIndustryTags.length > 0) {
				otherRequiredKeys.push({
					chip_group: 'Investment Industry',
					chip_values: this.selectedIndustryTags
				});
			}

		}

		if (requestingDataFor == 'investorSicCodeList') {

			aggrKey = 'shareholdingInformation.sic_industry.keyword';

            if (this.selectedIndustryTags && this.selectedIndustryTags.length > 0) {
				otherRequiredKeys.push({
					chip_group: 'Investment Industry',
					chip_values: this.selectedIndustryTags
				});
			}

		}

		if (this.turnoverGreaterThan > 0 && !this.turnoverLessThan) {

			otherRequiredKeys.push(
				{
					chip_group: "Key Financials", chip_values: [{
						key: "turnover",
						greater_than: this.turnoverGreaterThan,
						less_than: "",
						financialBoolean: true,
						selected_year: "true"
					}]
				}
			);
		} else if (!this.turnoverGreaterThan && this.turnoverLessThan > 0) {

			otherRequiredKeys.push(
				{
					chip_group: "Key Financials", chip_values: [{
						key: "turnover",
						greater_than: "",
						less_than: this.turnoverLessThan,
						financialBoolean: true,
						selected_year: "true"
					}]
				}
			);
		} else if ( this.turnoverGreaterThan > 0 && this.turnoverLessThan > 0 ) {

			otherRequiredKeys.push(
				{
					chip_group: "Key Financials", chip_values: [{
						key: "turnover",
						greater_than: this.turnoverGreaterThan,
						less_than: this.turnoverLessThan,
						financialBoolean: true,
						selected_year: "true"
					}]
				}
			);
		}

		if (this.investorShareholdingsGreaterThanValue || this.investorShareholdingsLessThanValue) {
			otherRequiredKeys.push(
				{
					chip_group: "Individual Shareholdings",
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
					ageOperator: ["greater"]
				}
			)
		} else if (this.companyAgeLessThanOrGreaterThan == 'Less Than' && this.companyAgeNumberValue) {
			// let chipVal = [this.companyAgeLessThanOrGreaterThan + " " + this.companyAgeNumberValue];
			let chipVal = [ null, this.companyAgeNumberValue];

			otherRequiredKeys.push(
				{
					chip_group: "Company Age Filter",
					chip_values: [chipVal],
					ageOperator: ["less"]
				}
			)
		}

		if (this.investorCompanyNameOrNumber && this.investorCompanyNameOrNumber.length > 0) {

			otherRequiredKeys.push({
				chip_group: "Individual Name",
				chip_values: [this.investorCompanyNameOrNumber.replace(/^[, ]+|[, ]+$|[, ]+/g, " ").trim()],
				investorCompanySearchAndOr: "and"
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
				chip_group: 'Investment Sic Code',
				chip_values: this.selectedInvestorSicCodeList
			});
			
		} else {
		    otherRequiredKeys = otherRequiredKeys.filter((item) => item.chip_group != 'Investment Sic Code');
		}
		this.sharedLoaderService.showLoader();
		
		this.searchFilterService.getAllFilterPropsHNWI(otherRequiredKeys, 'aggregateBy', undefined, aggrKey, 'companySearch').then(res => {

			
		setTimeout(() => {
			this.sharedLoaderService.hideLoader();
		}, 800);
			
			let temporaryDataArrayContainer = [];

			if (res.distinct_categories) {

				res.distinct_categories.buckets = res.distinct_categories.buckets.sort((a, b) => b.parent_count.doc_count - a.parent_count.doc_count);

				for (let val of res.distinct_categories.buckets) {

					temporaryDataArrayContainer.push({ label: val.key.replace(/(^|\s)\S/g, function (t) { return t.toUpperCase() }) + ' (' + this.toCurrencyPipe.transform(val.parent_count.doc_count, '', '', '1.0-0') + ')', value: val.key });

				}

				if (requestingDataFor == 'industryTags') {

					this.fullListOfIndustryTagsOptions = temporaryDataArrayContainer;

				}

				if (requestingDataFor == 'investorSicCodeList') {

					this.fullListOfInvestorSicCodeListOptions = temporaryDataArrayContainer;

				}

			}

		});

	}

	showFullListOfIndustryTags(requestingDataFor) {

		this.showLessListOfIndustryTags(requestingDataFor);

		if (requestingDataFor == 'industryTags') {

			setTimeout(() => {
				this.industryTagOptions = this.fullListOfIndustryTagsOptions;
				this.selectedIndustryTags = this.industryTagOptions.length ? this.selectedIndustryTags : [];
			}, 1000);

		}

		if (requestingDataFor == 'investorSicCodeList') {

			setTimeout(() => {
				this.investorSicCodeListOptions = this.fullListOfInvestorSicCodeListOptions;
				this.selectedInvestorSicCodeList = this.investorSicCodeListOptions.length ? this.selectedInvestorSicCodeList : [];
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

	resetCriteria() {
        this.turnoverGreaterThan = undefined;
        this.turnoverLessThan = undefined;
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
		this.showInputFieldMessageForTurnover = false;

		this.multiSelectForSicCodeMultiSelectId.filterValue = null;
		this.multiSelectForIndustryTags.filterValue = null;
		this.multiSelectRegionMultiSelectId.filterValue = null;
		this.globalFilterDataObject['pageSize'] = 25;
		this.globalFilterDataObject['startAfter'] = 0;
		this.globalFilterDataObject['sortOn'] = [];
		this.globalFilterDataObject['filterSearchArray'] = []; 

		this.getDataForDropdownLists('industryTags');

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

	checkInputFieldForShareholdings( event, inputField, forField? ) {
		
		let inputValue = event.value;

		if ( inputField == 'investorShareholdingsGreaterThanValue' ) {
			this.investorShareholdingsGreaterThanValue = inputValue;
		}

		if ( inputField == 'investorShareholdingsLessThanValue' ) {
			this.investorShareholdingsLessThanValue = inputValue;
		}

		if ( inputField == 'turnoverGreaterThan' ) {
			this.turnoverGreaterThan = inputValue;
		}

		if ( inputField == 'turnoverLessThan' ) {
			this.turnoverLessThan = inputValue;

		}

		if ( forField == 'forturnoverData' ) {
			if ( this.turnoverLessThan && this.turnoverGreaterThan && ( this.turnoverLessThan <= this.turnoverGreaterThan ) ) {
				this.showInputFieldMessageForTurnover = true;
			} else if ( !this.turnoverLessThan && this.turnoverGreaterThan ) {
				this.showInputFieldMessageForTurnover = false;
			} else {
				this.showInputFieldMessageForTurnover = false;
			}
		} else {
			if ( this.investorShareholdingsLessThanValue && this.investorShareholdingsGreaterThanValue && ( this.investorShareholdingsLessThanValue <= this.investorShareholdingsGreaterThanValue ) ) {
				this.showInputFieldMessageForShareholdings = true;
			} else if ( !this.investorShareholdingsLessThanValue && this.investorShareholdingsGreaterThanValue ) {
				this.showInputFieldMessageForShareholdings = false;
			} else {
				this.showInputFieldMessageForShareholdings = false;
			}
		}
	
	}

	ngAfterViewInit(): void {
        setTimeout(() => {
            this.sharedLoaderService.hideLoader();
        }, 2000);
	}

}
