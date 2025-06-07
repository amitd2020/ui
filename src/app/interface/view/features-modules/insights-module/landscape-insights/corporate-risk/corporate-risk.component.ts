import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { UIChart } from 'primeng/chart';
import { MultiSelect } from 'primeng/multiselect';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
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
	selector: 'dg-corporate-risk',
	templateUrl: './corporate-risk.component.html',
	styleUrls: ['../../insights-component.scss', './corporate-risk.component.scss'],
	providers: [NumberSuffixPipe, AdminRecordListComponent]
})

export class CorporateRiskComponent implements OnInit {

	@ViewChild( 'LazyLeafletMapContainer', { read: ViewContainerRef } ) LazyLeafletMapContainer: ViewContainerRef;

    @ViewChild('insightsLineChart', { static: false }) public insightsLineChart: UIChart;
    @ViewChild('multiSelectIndustry', { static: false }) public multiSelectIndustry: MultiSelect;
    @ViewChild('multiSelectRegion', { static: false }) public multiSelectRegion: MultiSelect;
    @ViewChild('multiSelectZscore', { static: false }) public multiSelectZscore: MultiSelect;
    @ViewChild('multiSelectCompoundAnnualGrowth', { static: false }) public multiSelectCompoundAnnualGrowth: MultiSelect;

	subscribedPlanModal: any = subscribedPlan;

    title: any;
    description: any;
    checkEstimatedTurnover: string = "true";
    selectedTurnOver: any = { greaterThan: undefined, lessThan: undefined };
    companyAgeLessThanOrGreaterThan: string = 'less';
    nameOrNumberValue: number;
    selectedTagsName: any;
    selectedOrganizationName: any;
    selectedChargeStatus: any;
    appliedFilters: any;
    selectedYearOfCharge: any;
    chargeStatusDataCounts: Array<{ label: string, count: string }> = [
        { label: 'Outstanding', count: '' },
        { label: 'Part Satisfied', count: '' },
        { label: 'Fully Satisfied', count: '' }
    ];
    listOfTurnOver: Array< {label: string, value: Object} > = [
        { label: '< 1M', value: { greaterThan: undefined, lessThan: '1000000' } },
        { label: '1M - 5M', value: { greaterThan: '1000000', lessThan: '5000000' } },
        { label: '5M -10M', value: { greaterThan: '5000000', lessThan: '10000000' } },
        { label: '10M - 100M', value: { greaterThan: '10000000', lessThan: '100000000' } },
        { label: '100M - 500M', value: { greaterThan: '100000000', lessThan: '500000000'} },
        { label: '500M - 1BN', value: { greaterThan: '500000000', lessThan: '1000000000' } },
        { label: '1BN - 10BN', value: { greaterThan: '1000000000', lessThan: '10000000000' } },
        { label: '> 10BN', value: { greaterThan: '10000000000', lessThan: undefined } }
    ];

    hasCommentaryPositive: boolean = false;
    hasCommentaryNegative: boolean = false;
    hasLandCorporate: boolean = false;
    hasCharges: boolean = false;
    hasFurloughData: boolean = false;
    hasOutstandingCCJ: boolean = false;
    accountsOverdueByThreeMonths: boolean = false;

    listOfCommodityCodeOptions: Array<{ label: string, value: string }> = [];
    
    listOfCreditRiskBandOptions: Array<{ label: string, value: string }> = [];
    selectedCreditRiskBand: any;
    
    selectedSafeAlerts: any;
    
    selectedCommentary: any;

    industryListDropdownOptions: Array<object> = [
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

    zScoreListDropdownOptions: Array<{ label: string, value: string }> = [];

    compoundAnnualGrowthListDropdownOptions: Array<{ label: string, value: string }> = [];


    selectedIndustryList: any;
    selectedCompoundAnnualGrowthList: any;
    selectedRiskBandList: any;
    selectedZscoreList: any;
    thisPage: String;
    regionListDropdownOptions: Array<{ label: string, value: string }>;
    selectedRegionList: any;

    turnoverRangeValue: number = 0;

    haveEstimatedTurnoverCheck: boolean = false;
    corporateRiskInsightsMapData: any;

    lineOptions: any;
    insightsLineChartData: any;

    industryListColumns: Array<object> = [];
    industryListData: Array<object> = [
        { industryName: 'A - agriculture forestry and fishing', industrySicCodeValue: 'agriculture forestry and fishing' },
        { industryName: 'B - mining and quarrying', industrySicCodeValue: 'mining and quarrying' },
        { industryName: 'C - manufacturing', industrySicCodeValue: 'manufacturing' },
        { industryName: 'D - electricity, gas, steam and air conditioning supply', industrySicCodeValue: 'electricity, gas, steam and air conditioning supply' },
        { industryName: 'E - water supply, sewerage, waste management and remediation activities', industrySicCodeValue: 'water supply, sewerage, waste management and remediation activities' },
        { industryName: 'F - construction', industrySicCodeValue: 'construction' },
        { industryName: 'G - wholesale and retail trade; repair of motor vehicles and motorcycles', industrySicCodeValue: 'wholesale and retail trade; repair of motor vehicles and motorcycles' },
        { industryName: 'H - transportation and storage', industrySicCodeValue: 'transportation and storage' },
        { industryName: 'I - accommodation and food service activities', industrySicCodeValue: 'accommodation and food service activities' },
        { industryName: 'J - information and communication', industrySicCodeValue: 'information and communication' },
        { industryName: 'K - financial and insurance activities', industrySicCodeValue: 'financial and insurance activities' },
        { industryName: 'L - real estate activities', industrySicCodeValue: 'real estate activities' },
        { industryName: 'M - professional, scientific and technical activities', industrySicCodeValue: 'professional, scientific and technical activities' },
        { industryName: 'N - administrative and support service activities', industrySicCodeValue: 'administrative and support service activities' },
        { industryName: 'O - public administration and defence; compulsory social security', industrySicCodeValue: 'public administration and defence; compulsory social security' },
        { industryName: 'P - education', industrySicCodeValue: 'education' },
        { industryName: 'Q - human health and social work activities', industrySicCodeValue: 'human health and social work activities' },
        { industryName: 'R - arts, entertainment and recreation', industrySicCodeValue: 'arts, entertainment and recreation' },
        { industryName: 'S - other service activities', industrySicCodeValue: 'other service activities' },
        { industryName: 'T - activities of households as employers; undifferentiated goods- and services-producing activities of households for own use', industrySicCodeValue: 'activities of households as employers; undifferentiated goods- and services-producing activities of households for own use' },
        { industryName: 'U - activities of extraterritorial organisations and bodies', industrySicCodeValue: 'activities of extraterritorial organisations and bodies' }
    ];
    industryListMonthsTotal = {};

    msgLogs: Message[] = [];
    monthsEnum: any = Month;

    globalFilterDataObject: any = {
        filterData: [
            { chip_group: "Status", chip_values: ["live"] },
            { chip_group: "Preferences", chip_values: ["estimated turnover included"], preferenceOperator: [ { hasEstimatedTurnover: "true" } ] }
        ],
        pageSize: 25,
		startAfter: 0,
        filterSearchArray: [],
		sortOn: []
    };

    cagrMappingObject = {
        'Under Observation': 'under_observation',
        'Under Lens': 'under_lens',
        'Joining League': 'joining_league',
        'Gearing Up': 'gearing_up',
        'Under Radar': 'under_radar',
        'bud': 'bud',
        'dynamic': 'dynamic'
    };

    companiesColumnListForTable: Array<any> = [];
	companiesDataListForTable: Array<any> = [];
	searchTotalCount: number = 0;

    operatingTableElemnts: any;

    // For Company Deatils Side Panel
	showCompanySideDetails: boolean = false;
	companySideDetailsParams: any = { companyNumber: undefined, companyName: undefined };
	corporateSideOverviewData: object;
	overviewName: string;
    currentPlan: unknown;

    showInputFieldMessage: boolean = false;

	constructor(
		private userAuthService: UserAuthService,
        private toCurrencyPipe: CurrencyPipe,
        private seoService: SeoService,
        private router: Router,
        private searchFilterService: SearchFiltersService,
        private commonService: CommonServiceService,
        private titlecasePipe: TitleCasePipe,
        private adminRecordListComponent: AdminRecordListComponent,
		private componentFactoryResolver: ComponentFactoryResolver,
		private sharedLoaderService: SharedLoaderService,
        private globalServerCommunicate: ServerCommunicationService
    ) {

		this.currentPlan = this.userAuthService?.getUserInfo('planId');
        
        if ( !this.userAuthService.hasAddOnPermission('corporateRiskLandscape') && this.subscribedPlanModal['Valentine_Special'] !== this.currentPlan ) {
            this.router.navigate(['/']);
        }
        
        // this.breadcrumbService.setItems([
        //     { label: 'Corporate Risk', routerLink: ['/corporate-risk'] }
        // ]);

        this.title = "DataGardener Corporate Risk Insight - Automate your marketing workflows";
        this.description = "Get in-depth analytics of company CCJ, Charges, complaint registered against companies, dissolved and liquidation date.";
        this.seoService.setPageTitle(this.title);
        this.seoService.setMetaTitle(this.title);
        this.seoService.setDescription(this.description);
    }

	ngOnInit() {

        this.sharedLoaderService.showLoader();


        this.initBreadcrumbAndSeoMetaTags();
        // Map API Calling
        this.getCorporateRiskInsightsData( 'includeGlobalFilterParams' );
        // Map API Calling
        this.getDataForDropdownLists('creditRiskBand');
        this.getDataForDropdownLists('zScoreList');
        this.getDataForDropdownLists('cagrList');


		this.companiesColumnListForTable = [
            { field: 'businessName', header: 'Company Name', colunName: 'Company Name', minWidth: '360px', maxWidth: 'none', textAlign: 'left', value: true },
            { field: 'directorName', header: 'Director Name', colunName: 'Director Name', minWidth: '380px', maxWidth: '380px', textAlign: 'left', value: true },
            { field: 'companyRegistrationNumber', header: 'Company Number', colunName: 'Company Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left', value: true },
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
		// 	{ label: 'Corporate Risk Landscape' }
		// ]);

		this.title = "DataGardener Corporate Risk Insight - Automate your marketing workflows";
		this.description = "Get in-depth analytics of company CCJ, Charges, complaint registered against companies, dissolved and liquidation date.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setMetaTitle(this.title);
		this.seoService.setDescription(this.description);

	}
    getDataForDropdownLists( requestingDataFor ) {
        
        let aggrKey = '',
            otherRequiredKeys: any = [
                { chip_group: "Status", chip_values: ["live"] },
                { chip_group: "Preferences",chip_values: ["estimated turnover included"],  preferenceOperator: [ { hasEstimatedTurnover: "true" } ] }
            ];

        if (this.checkEstimatedTurnover == "true") {

            for (let data of otherRequiredKeys) {
                if (data.chip_group == 'Preferences') {
                    data.preferenceOperator = data.preferenceOperator.filter((obj) => !obj.hasEstimatedTurnover)
                    data.preferenceOperator.push(
                        {
                            "hasEstimatedTurnover": "true"
                        }
                    )
                }
            }

        }

        if (this.checkEstimatedTurnover == "false") {

            otherRequiredKeys.push(
                { chip_group: "Preferences", chip_values: ["estimated turnover not included"], preferenceOperator: [ { hasEstimatedTurnover: "false" } ] }
            );

        }

        if ( this.companyAgeLessThanOrGreaterThan == 'Greater Than' || this.companyAgeLessThanOrGreaterThan == 'Less Than' ) {

            if (this.companyAgeLessThanOrGreaterThan == 'Greater Than' && (this.nameOrNumberValue || this.nameOrNumberValue == 0 )) {
                // let chipVal = [this.companyAgeLessThanOrGreaterThan + " " + this.nameOrNumberValue];
                let chipVal = [ this.nameOrNumberValue, null ];
                otherRequiredKeys.push(
                    {
                        chip_group: "Company Age Filter",
                        chip_values: [chipVal],
                        // ageOperator: ["greater"]
                    }
                )
            } else if (this.companyAgeLessThanOrGreaterThan == 'Less Than' && (this.nameOrNumberValue || this.nameOrNumberValue == 0 )) {
                // let chipVal = [this.companyAgeLessThanOrGreaterThan + " " + this.nameOrNumberValue];
                let chipVal = [ null, this.nameOrNumberValue ];
                otherRequiredKeys.push(
                    {
                        chip_group: "Company Age Filter",
                        chip_values: [chipVal],
                        // ageOperator: ["less"]
                    }
                )
            }

        }

        if (this.selectedTurnOver && (this.selectedTurnOver['greaterThan'] > 0 && this.selectedTurnOver['lessThan'] == undefined)) {
            if (this.checkEstimatedTurnover == "true") {
                otherRequiredKeys.push(
                    {
                        chip_group: "Key Financials", chip_values: [
                            {
                                key: "turnover",
                                greater_than: this.selectedTurnOver['greaterThan'],
                                less_than: "",
                                financialBoolean: true,
                                selected_year: "true"
                            },
                            {
                                key: "estimated_turnover",
                                greater_than: this.selectedTurnOver['greaterThan'],
                                less_than: "",
                                financialBoolean: true,
                                selected_year: "true"
                            }
                        ]
                    }
                );
            } else {
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
            }
        } else if (this.selectedTurnOver && (this.selectedTurnOver['greaterThan'] == undefined && this.selectedTurnOver['lessThan'] > 0)) {
            if (this.checkEstimatedTurnover == "true") {
                otherRequiredKeys.push(
                    {
                        chip_group: "Key Financials", chip_values: [
                            {
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
                            }
                        ]
                    }
                );
            } else {
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
            }
        } else if (this.selectedTurnOver && (this.selectedTurnOver['greaterThan'] > 0 && this.selectedTurnOver['lessThan'] > 0)) {
            if (this.checkEstimatedTurnover == "true") {
                otherRequiredKeys.push(
                    {
                        chip_group: "Key Financials", chip_values: [
                            {
                                key: "turnover",
                                greater_than: this.selectedTurnOver['greaterThan'],
                                less_than: this.selectedTurnOver['lessThan'],
                                financialBoolean: true,
                                selected_year: "true"
                            },
                            {
                                key: "estimated_turnover",
                                greater_than: this.selectedTurnOver['greaterThan'],
                                less_than: this.selectedTurnOver['lessThan'],
                                financialBoolean: true,
                                selected_year: "true"
                            }
                        ]
                    }
                );
            } else {
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
        }


        if ( requestingDataFor == 'creditRiskBand' ) {
            
            aggrKey = 'internationalScoreDescription.keyword';

            if ( this.selectedZscoreList && this.selectedZscoreList.length > 0 ) {
                otherRequiredKeys.push({
                    chip_group: 'Z Score',
                    chip_values: [this.selectedZscoreList]
                });
            }
            
            if ( this.selectedCompoundAnnualGrowthList && this.selectedCompoundAnnualGrowthList.length > 0 ) {
                otherRequiredKeys.push({
                    chip_group: 'CAGR',
                    chip_values: [ this.cagrMappingObject[ this.selectedCompoundAnnualGrowthList ] ]
                });
            }
          
        } else if ( requestingDataFor == 'zScoreList' ) {

            aggrKey = 'zScore.zScoreDescription.keyword';

            if ( this.selectedCreditRiskBand && this.selectedCreditRiskBand.length > 0 ) {
                otherRequiredKeys.push({
                    chip_group: 'Bands',
                    chip_values: [this.selectedCreditRiskBand]
                });
            }
            if ( this.selectedCompoundAnnualGrowthList && this.selectedCompoundAnnualGrowthList.length > 0 ) {
                otherRequiredKeys.push({
                    chip_group: 'CAGR',
                    chip_values: [ this.cagrMappingObject[ this.selectedCompoundAnnualGrowthList ] ]
                });
            }

        } else if ( requestingDataFor == 'cagrList' ) {

            aggrKey = 'cagr.cagrRating.keyword';

            if ( this.selectedZscoreList && this.selectedZscoreList.length > 0 ) {
                otherRequiredKeys.push({
                    chip_group: 'Z Score',
                    chip_values: [this.selectedZscoreList]
                });
            }
            if ( this.selectedCreditRiskBand && this.selectedCreditRiskBand.length > 0 ) {
                otherRequiredKeys.push({
                    chip_group: 'Bands',
                    chip_values: [this.selectedCreditRiskBand]
                });
            }
        }

        if ( this.selectedIndustryList && this.selectedIndustryList.length > 0 ) {

            let selectedIndustryLabels: Array<any> = [];

            for( let industryLabel of this.industryListDropdownOptions ) {

                if ( this.selectedIndustryList.includes(industryLabel['value']) ) {
                    
                    selectedIndustryLabels.push(industryLabel['label']);
                }

            }
   
            otherRequiredKeys.push({
                chip_group: 'SIC Codes',
                chip_industry_sic_codes: this.selectedIndustryList,
                chip_values: selectedIndustryLabels
            });

        }

        if ( this.selectedRegionList && !this.selectedRegionList.filter(val => !val).length && this.selectedRegionList.length > 0 ) {

            otherRequiredKeys.push(
                {
                    chip_group: 'Region',
                    chip_values: this.selectedRegionList
                }
            );

        }

        if (this.hasCommentaryPositive == true) {
            for ( let data of otherRequiredKeys ) {
                if (data.chip_group == 'Preferences') {
                    data.chip_values.push("company must have positive commentary")
                    data.preferenceOperator.push(
                        {
                            "hasCommentaryPositive": "true"
                        }
                    )
                }
            }
        }

        if (this.hasCommentaryNegative == true) {
            for (let data of otherRequiredKeys) {
                if (data.chip_group == 'Preferences') {
                    data.chip_values.push("company must have negative commentary")
                    data.preferenceOperator.push(
                        {
                            "hasCommentaryNegative": "true"
                        }
                    )
                }
            }
        }

        if (this.hasCharges == true) {
            for (let data of otherRequiredKeys) {
                if (data.chip_group == 'Preferences') {
                    data.chip_values.push("Company must have charges details")
                    data.preferenceOperator.push(
                        {
                            "hasCharges": "true"
                        }
                    )
                }
            }
        }

        if (this.hasOutstandingCCJ == true) {
            for (let data of otherRequiredKeys) {
                if (data.chip_group == 'Preferences') {
                    data.chip_values.push("company must have outstanding ccj's")
                    data.preferenceOperator.push(
                        {
                            "hasOutstandingCCJ": "true"
                        }
                    )
                }
            }
        }

        if (this.hasLandCorporate == true) {
            for (let data of otherRequiredKeys) {
                if (data.chip_group == 'Preferences') {
                    data.chip_values.push("Company must have corporate land")
                    data.preferenceOperator.push(
                        {
                            "hasLandCorporate": "true"
                        }
                    )
                }
            }
        }

        if (this.hasFurloughData == true) {
            for (let data of otherRequiredKeys) {
                if (data.chip_group == 'Preferences') {
                    data.chip_values.push("Company must have furlough data")
                    data.preferenceOperator.push(
                        {
                            "hasFurloughData": "true"
                        }
                    )
                }
            }
        }

        if (this.accountsOverdueByThreeMonths == true) {
            otherRequiredKeys.push({
                chip_group: "Accounts Submission Overdue",
                chip_values: ["3 months"]
            })
        }

        this.searchFilterService.getAllFilterProps( otherRequiredKeys, 'aggregateBy', undefined, aggrKey, 'companySearch' ).then( res => {
			
            let temporaryDataArrayContainer = [];
            
            if ( requestingDataFor == 'cagrList' ) {
                if ( res.distinct_year.distinct_categories.buckets.length ) {
                    for ( let val of res.distinct_year.distinct_categories.buckets ) {
                        if (val.key == "under_observation") {
                            val.key = "Under Observation"
                        }
                        if (val.key == "under_lens") {
                            val.key = "Under Lens"
                        }
                        if (val.key == "joining_league") {
                            val.key = "Joining League"
                        }
                        if (val.key == "gearing_up") {
                            val.key = "Gearing Up"
                        }
                        if (val.key == "under_radar") {
                            val.key = "Under Radar"
                        }
                        if ( val?.doc_count && val?.doc_count > 0 ) {
                            temporaryDataArrayContainer.push( { label: val.key.replace( /(^|\s)\S/g, function (t) { return t.toUpperCase() } ) + ' (' + this.toCurrencyPipe.transform( val?.doc_count, '', '', '1.0-0' ) + ')', value: val.key } );
                            this.compoundAnnualGrowthListDropdownOptions = temporaryDataArrayContainer;
                        }
                    }
                } else {
                    this.compoundAnnualGrowthListDropdownOptions = [];
                }
            } else if ( requestingDataFor == 'creditRiskBand' ) {

                if ( res.distinct_categories.buckets.length ){
                    for ( let val of res.distinct_categories.buckets ) {
                        temporaryDataArrayContainer.push({ label: val.key.replace(/(^|\s)\S/g, function (t) { return t.toUpperCase() }) + ' (' + this.toCurrencyPipe.transform(val?.doc_count, '', '', '1.0-0') + ')', value: val.key });
                        this.listOfCreditRiskBandOptions = temporaryDataArrayContainer;
                    }
                } else {
                    this.listOfCreditRiskBandOptions = [];
                }
            } else {
                if ( res.distinct_categories.buckets.length ) {
                    for ( let val of res.distinct_categories.buckets ) {
                        if ( val?.doc_count && val?.doc_count > 0 ) {
                            temporaryDataArrayContainer.push( { label: val.key.replace( /(^|\s)\S/g, function (t) { return t.toUpperCase() } ) + ' (' + this.toCurrencyPipe.transform( val?.doc_count, '', '', '1.0-0' ) + ')', value: val.key } );
                            this.zScoreListDropdownOptions = temporaryDataArrayContainer;

                        }
                    }
                } else {
                    this.zScoreListDropdownOptions = [];
                }
            }

        });

    }

    getCorporateRiskInsightsData( includeGlobalFilterParams? ) {
        this.sharedLoaderService.showLoader();
		
        if (includeGlobalFilterParams == 'includeGlobalFilterParams') {

            this.globalFilterDataObject.filterData = [];

            if (this.checkEstimatedTurnover == "true") {

                this.globalFilterDataObject = {
                    filterData: [
                        { chip_group: "Status", chip_values: ["live"] },
                        { chip_group: "Preferences", chip_values: ['estimated turnover included'], preferenceOperator: [{ hasEstimatedTurnover: "true" }] }
                    ]
                };

            } else {

                this.globalFilterDataObject = {
                    filterData: [
                        { chip_group: "Status", chip_values: ["live"] },
                        { chip_group: "Preferences", chip_values: ["estimated turnover not included"], preferenceOperator: [{ hasEstimatedTurnover: "false" }] }
                    ]
                };

            }

            if (this.selectedTurnOver && (this.selectedTurnOver['greaterThan'] > 0 && this.selectedTurnOver['lessThan'] == undefined)) {
                if (this.checkEstimatedTurnover == "true") {
                    this.globalFilterDataObject.filterData.push(
                        {
                            chip_group: "Key Financials", chip_values: [
                                {
                                    key: "turnover",
                                    greater_than: this.selectedTurnOver['greaterThan'],
                                    less_than: "",
                                    financialBoolean: true,
                                    selected_year: "true"
                                },
                                {
                                    key: "estimated_turnover",
                                    greater_than: this.selectedTurnOver['greaterThan'],
                                    less_than: "",
                                    financialBoolean: true,
                                    selected_year: "true"
                                }
                            ]
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
                            chip_group: "Key Financials", chip_values: [
                                {
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
                                }
                            ]
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
                            chip_group: "Key Financials", chip_values: [
                                {
                                    key: "turnover",
                                    greater_than: this.selectedTurnOver['greaterThan'],
                                    less_than: this.selectedTurnOver['lessThan'],
                                    financialBoolean: true,
                                    selected_year: "true"
                                },
                                {
                                    key: "estimated_turnover",
                                    greater_than: this.selectedTurnOver['greaterThan'],
                                    less_than: this.selectedTurnOver['lessThan'],
                                    financialBoolean: true,
                                    selected_year: "true"
                                }
                            ]
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

            if (this.companyAgeLessThanOrGreaterThan == 'Greater Than' && (this.nameOrNumberValue || this.nameOrNumberValue == 0 )) {
                // let chipVal = [this.companyAgeLessThanOrGreaterThan + " " + this.nameOrNumberValue];
                let chipVal = [ this.nameOrNumberValue, null ];
                this.globalFilterDataObject.filterData.push(
                    {
                        chip_group: "Company Age Filter",
                        chip_values: [chipVal],
                        // ageOperator: ["greater"]
                    }
                )
            } else if (this.companyAgeLessThanOrGreaterThan == 'Less Than' && (this.nameOrNumberValue || this.nameOrNumberValue == 0 )) {
                let chipVal = [ null, this.nameOrNumberValue];
                this.globalFilterDataObject.filterData.push(
                    {
                        chip_group: "Company Age Filter",
                        chip_values: [chipVal],
                        // ageOperator: ["less"]
                    }
                )
            }


            if (this.selectedZscoreList && this.selectedZscoreList.length) {
                this.globalFilterDataObject.filterData.push(
                    {
                        chip_group: 'Z Score',
                        chip_values: [this.selectedZscoreList]
                    }
                );
            }

            if (this.selectedCompoundAnnualGrowthList && this.selectedCompoundAnnualGrowthList.length) {
                if (this.selectedCompoundAnnualGrowthList == "Under Observation") {
                    this.selectedCompoundAnnualGrowthList = "under_observation"
                }
                if (this.selectedCompoundAnnualGrowthList == "Under Lens") {
                    this.selectedCompoundAnnualGrowthList = "under_lens"
                }
                if (this.selectedCompoundAnnualGrowthList == "Joining League") {
                    this.selectedCompoundAnnualGrowthList = "joining_league"
                }
                if (this.selectedCompoundAnnualGrowthList == "Gearing Up") {
                    this.selectedCompoundAnnualGrowthList = "gearing_up"
                }
                if (this.selectedCompoundAnnualGrowthList == "Under Radar") {
                    this.selectedCompoundAnnualGrowthList = "under_radar"
                }
                this.globalFilterDataObject.filterData.push(
                    {
                        chip_group: 'CAGR',
                        chip_values: [this.selectedCompoundAnnualGrowthList]
                    }
                );
            }

            if (this.selectedCreditRiskBand && this.selectedCreditRiskBand.length) {
                this.globalFilterDataObject.filterData.push(
                    {
                        chip_group: 'Bands',
                        chip_values: [this.selectedCreditRiskBand]
                    }
                );
            }

            if (this.selectedIndustryList && this.selectedIndustryList.length > 0) {

                let selectedIndustryLabels: Array<any> = [];

                for (let industryLabel of this.industryListDropdownOptions) {

                    if (this.selectedIndustryList.includes(industryLabel['value'])) {

                        selectedIndustryLabels.push(industryLabel['label']);
                    }

                }

                this.globalFilterDataObject.filterData.push({
                    chip_group: 'SIC Codes',
                    chip_industry_sic_codes: this.selectedIndustryList,
                    chip_values: selectedIndustryLabels
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

            if (this.hasCommentaryPositive == true) {
                for (let data of this.globalFilterDataObject.filterData) {
                    if (data.chip_group == 'Preferences') {
                        data.chip_values.push("company must have positive commentary")
                        data.preferenceOperator.push(
                            {
                                "hasCommentaryPositive": "true"
                            }
                        )
                    }
                }
            }

            if (this.hasCommentaryNegative == true) {
                for (let data of this.globalFilterDataObject.filterData) {
                    if (data.chip_group == 'Preferences') {
                        data.chip_values.push("company must have negative commentary")
                        data.preferenceOperator.push(
                            {
                                "hasCommentaryNegative": "true"
                            }
                        )
                    }
                }
            }

            if (this.hasCharges == true) {
                for (let data of this.globalFilterDataObject.filterData) {
                    if (data.chip_group == 'Preferences') {
                        data.chip_values.push("Company must have charges details")
                        data.preferenceOperator.push(
                            {
                                "hasCharges": "true"
                            }
                        )
                    }
                }
            }

            if (this.hasOutstandingCCJ == true) {
                for (let data of this.globalFilterDataObject.filterData) {
                    if (data.chip_group == 'Preferences') {
                        data.chip_values.push("company must have outstanding ccj's")
                        data.preferenceOperator.push(
                            {
                                "hasOutstandingCCJ": "true"
                            }
                        )
                    }
                }
            }

            if (this.hasLandCorporate == true) {
                for (let data of this.globalFilterDataObject.filterData) {
                    if (data.chip_group == 'Preferences') {
                        data.chip_values.push("Company must have corporate land")
                        data.preferenceOperator.push(
                            {
                                "hasLandCorporate": "true"
                            }
                        )
                    }
                }
            }

            if (this.hasFurloughData == true) {
                for (let data of this.globalFilterDataObject.filterData) {
                    if (data.chip_group == 'Preferences') {
                        data.chip_values.push("Company must have furlough data")
                        data.preferenceOperator.push(
                            {
                                "hasFurloughData": "true"
                            }
                        )
                    }
                }
            }

            if (this.accountsOverdueByThreeMonths == true) {
                this.globalFilterDataObject.filterData.push({
                    chip_group: "Accounts Submission Overdue",
                    chip_values: ["3 months"]
                })
            }
        }
    
        this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_API', 'getCorporateRiskData', this.globalFilterDataObject).subscribe(res => {
            if ( res.body.status == 200 ) {

                if ( res.body.mapData ) {
                                    
                    this.corporateRiskInsightsMapData = res.body.mapData;

                    if ( ![ this.subscribedPlanModal['Valentine_Special'] ].includes( this.currentPlan ) ) {

                        this.initLeafletMapContainer( this.corporateRiskInsightsMapData );

                    }

                }

                if ( res.body.companiesData && res.body.companiesData.hits ) {

                    this.companiesDataListForTable = [];
                    this.searchTotalCount = res.body.companiesData.total.value;
                    
                    for ( let sourceData of res.body.companiesData.hits ) {
                        this.companiesDataListForTable.push( sourceData._source );
                    }

                    this.companiesDataListForTable = this.formatCompanyData( this.companiesDataListForTable );

                    setTimeout(() => {
                        this.sharedLoaderService.hideLoader();
                    }, 1000);
                    
                }

            }

        });

        if (this.selectedCompoundAnnualGrowthList == "under_observation") {
            this.selectedCompoundAnnualGrowthList = "Under Observation"
        }
        if (this.selectedCompoundAnnualGrowthList == "under_lens") {
            this.selectedCompoundAnnualGrowthList = "Under Lens"
        }
        if (this.selectedCompoundAnnualGrowthList == "joining_league") {
            this.selectedCompoundAnnualGrowthList = "Joining League"
        }
        if (this.selectedCompoundAnnualGrowthList == "gearing_up") {
            this.selectedCompoundAnnualGrowthList = "Gearing Up"
        }
        if (this.selectedCompoundAnnualGrowthList == "under_radar") {
            this.selectedCompoundAnnualGrowthList = "Under Radar"
        }

        this.appliedFilters = this.globalFilterDataObject;


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

    resetInsightCriteria() {
        this.checkEstimatedTurnover = "true";
        this.selectedIndustryList = undefined;
        this.selectedCompoundAnnualGrowthList = undefined;
        this.selectedRegionList = undefined;
        this.selectedZscoreList = undefined;
        this.selectedCreditRiskBand = undefined;
        this.selectedTurnOver = undefined;
        this.hasCommentaryPositive = undefined;
        this.hasCommentaryNegative = undefined;
        this.hasCommentaryPositive = undefined;
        this.hasCommentaryNegative = undefined;
        this.hasLandCorporate = undefined;
        this.hasCharges = undefined;
        this.hasFurloughData = undefined;
        this.hasOutstandingCCJ = undefined;
        this.accountsOverdueByThreeMonths = undefined;
        this.companyAgeLessThanOrGreaterThan = undefined;
        this.nameOrNumberValue = undefined;

        this.globalFilterDataObject['pageSize'] = 25;
        this.globalFilterDataObject['startAfter'] = 0;
        this.globalFilterDataObject['sortOn'] = [];
        this.globalFilterDataObject['filterSearchArray'] = [];

        this.getCorporateRiskInsightsData( 'includeGlobalFilterParams' );

        this.multiSelectIndustry.filterValue = null;
        this.multiSelectRegion.filterValue = null;

        this.getDataForDropdownLists('creditRiskBand');
        this.getDataForDropdownLists('zScoreList');
        this.getDataForDropdownLists('cagrList');

        this.resetTablePagination();
    }

    getOperatingTable( event ) {
		if ( event.requestFor === 'SidePanel' ) {
            this.showCompanySideDetailsPanel( event.compNumber, event.compName, event.rowData );
        } else {
            this.operatingTableElemnts = event;
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
    
	resetTablePagination() {

		this.adminRecordListComponent.resetFilters( this.operatingTableElemnts.adminRecordListTable );

		if (this.operatingTableElemnts.recordListPaginator) {
			this.operatingTableElemnts.recordListPaginator.rows = 25;
			this.operatingTableElemnts.recordListPaginator.first = 0;
		}

	}

    onChangeRegionSelection(event) {

        if ( event.itemValue != null && this.selectedRegionList && this.selectedRegionList.length > 1 ) {

            this.selectedRegionList = this.selectedRegionList.filter(val => val);

        }

        if ( event.itemValue == null && this.selectedRegionList.length > 0 && event.value.includes(event.itemValue) ) {
            event.value = [null];
            this.selectedRegionList = event.value;
        }

        this.getDataForDropdownLists('creditRiskBand');
        this.getDataForDropdownLists('zScoreList');
        this.getDataForDropdownLists('cagrList');
    }

    requestUpdateTableData( event ) {

		this.globalFilterDataObject['pageSize'] = event.pageSize ? event.pageSize : 25;
		this.globalFilterDataObject['startAfter'] = event.startAfter ? event.startAfter : 0;
		this.globalFilterDataObject['sortOn'] = event.sortOn ? event.sortOn : [];
		this.globalFilterDataObject['filterSearchArray'] = event.filterSearchArray ? event.filterSearchArray : []

		this.getCorporateRiskInsightsData();

	}

    getRegionsData( mapGeoJSON ) {

        this.regionListDropdownOptions = [];

        for ( let featureObj of mapGeoJSON.features ) {
            if ( !JSON.stringify( this.regionListDropdownOptions ).includes( featureObj.properties.name ) ) {
                this.regionListDropdownOptions.push( { label: featureObj.properties.name, value: featureObj.properties.name.toLowerCase() } );
            }
        }
        
        this.regionListDropdownOptions.sort( ( a, b ) =>  a.label.localeCompare( b.label ) );
        
        this.regionListDropdownOptions.unshift( { label: 'All', value: null } );

    }

    async initLeafletMapContainer( currentYearData ) {
		this.sharedLoaderService.showLoader();
        const { LazyLeafletMapComponent } = await import('../../../../shared-components/lazy-leaflet-map/lazy-leaflet-map.component');

        this.LazyLeafletMapContainer.clear();

        const { instance } = this.LazyLeafletMapContainer.createComponent( LazyLeafletMapComponent );
        instance.mapConfig.primaryMapId = `corporateRiskLandscapeMapContainer`;
        instance.mapData = { currentYearData: currentYearData };
        instance.requiredData = {
            thisPage: 'corporateRiskLandscape',
            selectedRegionList: this.selectedRegionList ? this.selectedRegionList : '',
            selectedChargeStatus: this.selectedChargeStatus ? this.selectedChargeStatus : '',
            globalFilterDataObject: this.globalFilterDataObject
        }

        instance.mapGeoJsonOutput.subscribe( res => {
            this.getRegionsData( res );
        });


	}

    validateInputField( inputValue ) {

		if ( inputValue > 999 ) {
			this.showInputFieldMessage = true;
		} else {
            this.showInputFieldMessage = false;
        }
		
	}
    
}