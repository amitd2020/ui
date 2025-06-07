import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { take } from 'rxjs';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationService, TreeNode } from 'primeng/api';
import { TabView } from 'primeng/tabview';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { subscribedPlan } from 'src/environments/environment';
import * as ChartDataSets from 'chartjs-plugin-datalabels'
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedLoaderService } from '../shared-loader/shared-loader.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import CustomUtils from 'src/app/interface/custom-pipes/custom-utils/custom-utils.utils';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';

library.add(fas, fab);

export enum Month {
	undefined, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
}

export enum voAndRoeComments {
	'Within BOTTOM 25% of all UK companies by ',
	'Within BOTTOM 50% of all UK companies by ',
	'Within Top 25% of all UK companies by ',
	'Within Top 50% of all UK companies by '
}

declare var google: any;

@Component({
	selector: 'dg-details',
	templateUrl: './details.component.html',
	styleUrls: ['./details.component.scss'],
    providers: [ CurrencyPipe, NumberSuffixPipe ]
})


///This Component is not working anywhere in DG....  (COMMENTED FOR TESTING )


export class DetailsComponent implements OnInit {

	@ViewChild( 'companyDetailsTabViewGroup', { static: false } ) public companyDetailsTabViewGroup: TabView;
    @ViewChild( 'overviewTabView', { static: false } ) public overviewTabView: TabView;
    @ViewChild( 'riskProfileTabView', { static: false } ) public riskProfileTabView: TabView;
    @ViewChild( 'financialTabView', { static: false } ) public financialTabView: TabView;
    @ViewChild( 'directorShareholdersTabView', { static: false } ) public directorShareholdersTabView: TabView;

    title: string =  '';
    description: string =  '';
    keywords: string =  '';
    robots: string =  ''; // 'index, follow, noindex, nofollow'

    @Input() companyData: any;

    @Input() directorDetailData: any;

    @Input() directorContactsData: any;

    @Input() totalResultCount: number;

    @Input() directorshipsCounts: any;

    @Input() directorFailureData: any;

    @Input() directorShareholdingDataForPNR: any;

    @Input() directorContactData: any;

    @Input() directorInMonitor: boolean;

    companyDocuments: any;

    @Input() loader: boolean = true;

    @Input() thisPage: string;

    @Input() directorName: string;

    @Input() sidePanelView: any=false;

    @Input() shareholderName: any;
    
    @Input() possibleCompanies: any;

    @Input() nonExistingCompany: { companyNotExists: boolean, companyNumber: string, companyOriginalName: string } = { companyNotExists: false, companyNumber: '', companyOriginalName: '' };

    @Output() updateDirectorsMonitorBoolean = new EventEmitter<any>();

    @Output() updateTableDataListForDirector = new EventEmitter<any>();

	ChartDataLabelsPlugin = ChartDataSets;

	isLoggedIn: Boolean = false;
	userDetails: Partial< UserInfoType > = {};
    directorNationality: any;
    activeTabIndex: number = 0;

    hideAddNoteModalBool: boolean = false;
    showExportButton: boolean = true;
    callNewsFeeds: boolean = false;

    sampleLrmPdf: boolean = true;

    subscribedPlanModal: any = subscribedPlan;
    showUpgradePlanDialog: boolean = false;
    showLoginDialog: boolean = false;

    treeOrientation: any = 'horizontal';
    companyDetails: any = {};
    directorDataColumn: any[];
    directorData: any;
    disqualifiedDirectorsCount: number = 0;
    pscDataColumn: any[];
    pscStatementControlPersonDataColumn: any[];
    pscSuperSecurePersonDataColumn: any[];
    pscData: any;
    lastOneYearExports: any;
    lastFiveYearExports: any;
    lastExportMonthYear: any;
    lastOneYearImports: any;
    lastFiveYearImports: any;
    lastImportMonthYear: any;
    relatedCompaniesDataColumn: any[];
    relatedDirectorsDataColumn: any[];
    corporateLandDataColumn: any[];
    financialDataColumn = [];
    corporateLandData: any;
    chargesDataColumn: any[];
    tradingAddressDetailsColumn: any[];
    chargesData: any;
    documentDataColumn: any[];
    documentData: any;
    cities: any[];
    directorOverviewArray: Array<any> = undefined;
    lineData: any;
    selectData: any;
    dormantCompany: boolean = false;
    showLoader: boolean = false;
    dormantCompanyLabel: string = "";
    directorDetails: any = [];
    directorResignedCount: number = 0;
    directorActiveCount: number = 0;
    personWithSignificantControls: any = [];
    lat: number = 51.5074;
    lng: number = 0.1278;
    watchListStatus: boolean = false;
    latestFinancialYear: any;
    financialYears = [];
    financialKeys = [];
    options: any;
    overlays: any[];
    companyListForFavourite: any[];
    domain: any;
    director_email: any;    
    linkedin_profile: any;
    contact_number: any;
    email_address: string;
    showOrHideContactInfoModal: boolean = false;
    showOrHideDirectorContactInfoModal: boolean = false;
    companyNumber: string;
    favouritesListId: any;
    isFavourite: Boolean = false;
    userId: any;
    listName: any;
    msgs = [];
    rowGroupMetadata: any;
    financeData: any;
    financialsTabView: string;
    cash = {value:undefined, status:undefined, percentage:undefined};
    totalAssets = {value:undefined, status:undefined, percentage:undefined};
    turnover = {value:undefined, status:undefined, percentage:undefined};
    creditors = {value:undefined, status:undefined, percentage:undefined};
    cashArray: any;
    totalAssetsArray: any;
    turnoverArray: any;
    creditorsArray: any;
    financialData: any;
    cashData = [];
    creditorsData = [];
    turnoverData = [];
    totalAssetsData = [];
    showAddNoteModalBool: boolean = false;
    companyNoteValue: string = '';
    notesData: any = undefined;
    notesId: any = undefined;
    favouriteListStatus: boolean = false;
    notesTableCols: Array<any>;
    companyDetailsParams: any = { CompanyNumber: undefined, CompanyNameOriginal: undefined };
    errorMessage: any;
    countryCodemap = new Map();
    countryNameMap = new Map();
    isAdmin: string = 'false';
    queryString = window.location.search;
    relatedCompanies: Array<any>;
    relatedDirectors: Array<any>;
    relCompAPICount : number = 0;
    groupStructureCount: number = 0;
    exactCCJDataColumn: any[];
    exactCCJData: Array<any>;
    totalCCJValue: number = 0;
    possibleCCJDataColumn: any[];
    aquisitionMergerDataColumn: any[];
    possibleCCJData: Array<any>;
    shareHolderDataColumn: any[];
    shareHolderData: Array<any> = undefined;
    companyStatus: Array<any>;
    safeAlerts: Array<any> = undefined;
    safeAlertsColumn: Array<any>;
    companyStatusColumn: Array<any>;
    companyCommentryData: Array<any> = undefined;
    companyCommentaryColumn: Array<any>;
    tradingAddressDetails: Array<any> = undefined;
    similarCompaniesWithSameSiccodeDetails: Array<any>;
    similarCompaniesWithSameSiccodeDetailsColumn: Array<any>;
    var : any;
    data: any=undefined;
    landCorporateInfo:Array<any> = undefined;
    companyChargesData:Array<any> = undefined;

    companyValuationsRoeData: Array<any>;
    companyValuationsChartOptions: any;
    companyRoeChartOptions: any;
    allCompaniesValuationsChartData: any;
    allCompaniesRoeChartData: any;
    companiesValuationsTurnoverChartData: any;
    companiesValuationsNetAssetsChartData: any;
    voAndRoeComments: any = voAndRoeComments;

    financialDataObject : Object = undefined;
    zScoreData : any;
    CAGRdata : any;
    finstatutoryDataValues: any[];
    finstatutoryChartData : any;
    
    planDetails: any = {
        planid: undefined
    }
    chartOptions = {}
    chartOptions2 = {}
    aquisitionMergerData: Array<any>;

    finOverviewDataValues: Array<any>;
    finOverviewChartData: any;
    overviewTurnoverData = [];
    overviewTotalAssetsData = [];
    overviewTotalLiabilitiesData = [];
    overviewNetWorthData = [];
    overviewProfitBeforeTax = [];
    overviewEBITDA = [];
    overviewNoOfEmployeesData: number;
	totalNumOfRecords: number;

    finRatioDataValues: Array<any>;
    finRatioChartData: any;
    finRatioTabChartData: any = {
        chartData1: {},
        chartData2: {}
    };
    currentRatioChartData = [];
    totalDebtRatioChartData = [];
    equityRatioChartData = [];
    creditorDaysChartData = [];
    companyWebsites = [];
    commentry: any;
    financeDataSorted: any;
    
    groupStructureTableCols: Array<any> = [];
    similarCompaniesLive: Array<any> = [];
    groupStructureData: TreeNode[];
    groupStructureReportData: any;
    groupStructureDataUpdated: any;

    aquisitionMergersReportData: any;

    directorStatusCounts: any = {
        total: 0,
        active: 0,
        resigned: 0,
        inactive: 0
    };

    disqualifiedDeletedExceptionDirectors: Array<any> = [];
    directorStatusCountsPossibleCompanies: any = {
        total: 0,
        active: 0,
        resigned: 0,
        inactive: 0
    };

    shareholderCount: any;

    companydirectorStatusCounts: any = {
        total: 0,
        active: 0,
        resigned: 0,
        inactive: 0,
        activeSecretary: 0
    };

    shareHoldingData: any = {
        companyName: undefined,
        companyNumber: undefined,
        companyRegDate: undefined,
        companyStatus: undefined,
        companySicCode: undefined,
        companyType: undefined
    }

    directorsAllOccupations: Array<any> = [];
    directorsAllOccupationsPossibleCompanies: Array<any> = [];
    monthsEnum: any = Month;
    directorDetailsCompanySummaryColumns: Array<any> = [];
    // possibleDirectorDetailsShareholdingsSummaryColumns: Array<any> = [];
    directorDetailsCompanySummaryData: Array<any> = [];
    // possibleDirectorDetailsShareholdingsSummaryData: Array<any> = [];
    // directorDetailsShareholdingsSummaryColumns: Array<any> = [];
    directorDetailsShareholdingsSummaryData: Array<any> = [];
    possibleCompaniesSummaryData: Array<any> = [];
    shareHolderDetailsSummaryColumns: Array<any> = [];
    shareHolderDetailsSummaryColumnsData: Array<any> = [];
    relatedDirectorsAndCompaniesCount: Number = 0;
    relCompDirDataValueStatus: Boolean = false;
    infoWindow: any;

    tradingAddressflagVal = [
        { name: '*Registered Office' },
        { name: '*Head Office'},
        { name: '*Accountants Address' },
        { name: '*Solicitors Address' }
    ];

    activeTabText: string = 'Overview';
    showTabGroupAfterDelay: boolean = false;

    shareholdingsTab: boolean = false;
    shareholderLink: any;
    shareholderDetailData: any;
    selected: boolean = false;
    overviewSelected: boolean = false;
    isfeatureTradingAddress: boolean;
    isfeatureGroupStructure: boolean;
    isfeatureLifeline: boolean;
    isAuthCheckOnClick: boolean;
    checkForDisablingContent: boolean;

    hasFinancailRatios : boolean = false;

    companyEventsColumns : Array<any> = undefined;
    companyEventsData : Array<any> = undefined;

    patentTradeData : Array<any> = undefined;
    patentTradeColumns = [];

    innovateGrantColumns : Array<any> = undefined;
    innovateGrantData : Array<any> = undefined;
    showDirector: boolean = false;
    forTableView: boolean = false;

    companyImportData : Array<any> = undefined;
    companyExportData : Array<any> = undefined;
    companyImportExportColumns: any[];
    relatedPersonInfoData: Array<any>;
    relatedPersonInfoDataColumn: any[];
    companyRiskAssessmentAnalysisData: any;

    creditorsInfoDataColumn: Array<any>;
    creditorsInfoData: Array<any>;
    creditorsCount: number;
    creditorsTotalAmount: number;

    debtorsInfoDataColumn: Array<any>;
    debtorsInfoData: Array<any>;
    BadDebtsCount: number;
    BadDebtsTotalAmount: number;
    infoDialogModal:boolean = false;
    personalContactInfoColumns: any[];
    personalContactInfoData: Array<any>;
    monitorLimit: number;
    selectedGlobalCurrency: string = 'GBP';

    directorDataInfoObj: any = {
        userId: undefined,
        companyNumber: '',
        companyName: undefined,
        directorPNR: undefined,
        directorFirstName: undefined,
        directorLastName: undefined,
        directorEmail: undefined,
        directorJobTitle: undefined,
        directorTelephone: undefined,
        directorLinkedin: undefined,
    }

    directorCompaniesListByPNR: Array<{ label: string, value: string }> = [];
    estimatedTurnoverBoolean :Boolean = false;
    constantMessages: any = UserInteractionMessages;
    tabViewPanelName: any ;


	constructor(
        public userAuthService: UserAuthService,
        public commonService: CommonServiceService,
        private router: Router,
        public activeRoute: ActivatedRoute,
        private titlecasePipe: TitleCasePipe,
        private toCurrencyPipe: CurrencyPipe,
        private toNumberSuffix: NumberSuffixPipe,
        private confirmationService: ConfirmationService,
        private sharedLoaderService: SharedLoaderService,
        private globalServerCommunication: ServerCommunicationService
    ) {
		/*
			Do not enable the below code before discussing with Akmal.
			It reloads the `AppMainComponent`, which is the main
			layout container and parent for all of the Components/Modules.
			===============================================================
			this.router.routeReuseStrategy.shouldReuseRoute = () => false;
			===============================================================
		*/

        this.cities = [
            { name: 'Cash', code: 'NY' },
            { name: 'Cash Bank On Hand', code: 'RM' },
            { name: 'Current Assets', code: 'LDN' },
            { name: 'Debtors', code: 'IST' },
            { name: 'Fixed Assets', code: 'PRS' }
        ];

        if (this.activeRoute.snapshot.queryParams.compNum) {
            this.getCompanyDocuments(this.activeRoute.snapshot.queryParams.compNum);
        }
		
        this.sharedLoaderService.showLoader();

    }

	ngOnChanges(changes: SimpleChanges) { 

        if ( changes.directorDetailData && Object.keys( changes.directorDetailData.currentValue ).length && ( this.tabViewPanelName == 'Companies Summary' || this.tabViewPanelName == undefined ) ) {
              
            this.getCountryCode("ngOnChanges");
        }
    }

    ngOnInit() {
        this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';
        this.checkForDisablingContent = ( !this.isLoggedIn || !( this.userAuthService.hasFeaturePermission( 'Shareholders' ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) )
        this.isAuthCheckOnClick = ( this.userAuthService.hasAddOnPermission('contactInformation') || this.userAuthService.hasRolePermission( ['Super Admin'] ));
        this.isfeatureTradingAddress= !this.isLoggedIn || !( this.userAuthService.hasFeaturePermission( 'Trading Address' ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) );
        this.isfeatureGroupStructure= !this.isLoggedIn || !( this.userAuthService.hasFeaturePermission( 'Group Structure' ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) );
        this.isfeatureLifeline= !this.isLoggedIn || !( this.userAuthService.hasFeaturePermission( 'Lifeline' ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) );
		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => {

			this.isLoggedIn = loggedIn;

			if ( this.isLoggedIn ) {
				this.userDetails = this.userAuthService?.getUserInfo();
			}

		});

        // this.getCompanyPatentData();
        // this.seoService.setPageTitle (this.title);
        // this.seoService.setDescription( this.description );
        // this.seoService.setkeywords( this.keywords );
        // this.seoService.setRobots (this.robots );

        this.getCountryCode('ngOnInit');

        // if ( this.thisPage == 'company' ) {
            // setTimeout(() => {
            //     this.getFinancialOverviewDetails(this.companyData.CompanyNumber);
            //     // this.getFinancialRatioData(this.companyData.CompanyNumber);
            // }, 100);
        // }

        if ( this.companyData && Object.keys(this.companyData).length > 0 ) {
            if ( this.companyData.hasCCJInfo && this.isLoggedIn ) {
                this.getExactCCJData(this.companyData.ccjDetails);
            }
            if ( this.companyData.hasPossibleCCJInfo && this.isLoggedIn ) {
                this.getPossibleCCJData();
            }
            // if ( this.companyData.hasAcquiringCompany || this.companyData.hasAcquiredCompany) {
            //     this.getAquisitionMergersData();
            // }
            if ( this.companyData.hasSafeAlerts && this.isLoggedIn ) {
                for (let i = 0; i < this.companyData.safeAlerts.length; i++) {
                    if (this.companyData.safeAlerts[i].alertCodeTitle == 'multiple key changes') {
                        this.companyData.safeAlerts[i].alertCodeTitle = 'Multiple Indicators';
                    } 
                }
                this.getSafeAlertsData(this.companyData.safeAlerts);
            }
            // if ( this.companyData.hasShareHolders && this.authGuardService.isLoggedin() ) {
            //     this.getShareHolderData(this.companyData.shareDetails);
            // }
            if ( this.companyData.hasCompanyCommentary && this.isLoggedIn ) {
                this.getCompanyCommentaryData(this.companyData.companyCommentary);
            }
            // if ( this.companyData.hasTradingAddress && this.authGuardService.isLoggedin() ) {
            //     this.getTradingAddressDetails(this.companyData.tradingAddress);
            // }
            // if ( this.companyData.hasSimilarCompanies && this.authGuardService.isLoggedin() ) {
            //     this.getSimilarCompanies(this.companyData.similarCompanies);
            // }
            if (this.companyData.hasFinances && this.companyData.statutoryAccounts) {                
                let data = this.companyData.statutoryAccounts;
                let overviewFinancialObj = this.getFinancialOverviewDetails(data);
                this.finstatutoryDataValues = overviewFinancialObj.finOverviewDataValues;
                this.finstatutoryChartData = overviewFinancialObj.chartData;
                this.overviewTurnoverData = overviewFinancialObj.overviewTurnoverData;
                this.overviewTotalAssetsData = overviewFinancialObj.overviewTotalAssetsData;
                this.overviewTotalLiabilitiesData = overviewFinancialObj.overviewTotalLiabilitiesData;
                this.overviewNetWorthData = overviewFinancialObj.overviewNetWorthData;
                this.overviewProfitBeforeTax = overviewFinancialObj.overviewProfitBeforeTax;
                this.overviewNoOfEmployeesData = overviewFinancialObj.overviewNoOfEmployeesData;
                this.overviewEBITDA = overviewFinancialObj.overviewEBITDA;
                
                if (this.companyData.financialRatios && this.companyData.financialRatios.length > 0){
                    this.getFinancialRatioData(this.companyData.financialRatios);
                    this.finRatioDataValues = [ this.finRatioDataValues ];
                    this.hasFinancailRatios = true;
                } else {
                    this.finRatioDataValues = undefined;
                    this.hasFinancailRatios = false;
                }

                this.companiesValuationsNetAssetsChartData = {
                    labels: this.finstatutoryChartData['labels'],
                    datasets: [
                        {
                            type: 'line',
                            data: overviewFinancialObj.overviewNetAsstesData,
                            pointRadius: 4,
                            pointBackgroundColor: '#287EAD',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 1,
                            fill: false,
                            borderColor: 'rgba(0, 0, 0, 0)'
                        },
                        {
                            data: overviewFinancialObj.overviewNetAsstesData,
                            backgroundColor: '#1F4286'
                        },
                        {
                            type: 'line',
                            data: overviewFinancialObj.overviewNetAsstesData,
                            pointRadius: 0,
                            backgroundColor: 'rgba( 40, 126, 173, 0.2 )',
                            borderColor: 'rgba( 40, 126, 173, 0.0 )'
                        }
                    ]
                };
        
                this.companiesValuationsTurnoverChartData = {
                    labels: this.finstatutoryChartData['labels'],
                    datasets: [
                        {
                            type: 'line',
                            data: this.finstatutoryChartData['datasets'][0]['data'],
                            pointRadius: 4,
                            pointBackgroundColor: '#287EAD',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 1,
                            fill: false,
                            borderColor: 'rgba(0, 0, 0, 0)'
                        },
                        {
                            data: this.finstatutoryChartData['datasets'][0]['data'],
                            backgroundColor: '#1F4286'
                        },
                        {
                            type: 'line',
                            data: this.finstatutoryChartData['datasets'][0]['data'],
                            pointRadius: 0,
                            backgroundColor: 'rgba( 40, 126, 173, 0.2 )',
                            borderColor: 'rgba( 40, 126, 173, 0.0 )'
                        }
                    ]
                };

                this.companyValuationsChartOptions = {
                    legend: {
                        display: false
                    },
                    title: {
                        fontFamily: 'Roboto',
                    },
                    scales: {
                        x:{
                            ticks: {
                                fontFamily: 'Roboto',
                                padding: 8
                            }
                        },
                        y: {
                            ticks: {
                                fontFamily: 'Roboto',
                                padding: 8,
                                callback: (label, index, labels) => {
                                    return this.toNumberSuffix.transform( label, 0, 'GBP' );
                                }
                            }
                        }
                    },
                    tooltips: {
                        titleFontFamily: 'Roboto',
                        bodyFontFamily: 'Roboto',
                        callbacks: {
                            label: ( tooltipItem, dataset ) => {
                                return this.toCurrencyPipe.transform( tooltipItem.yLabel, 'GBP', 'symbol', '1.0-0' );
                            }
                        }
                    },
                    plugins: {
                        datalabels: {
                            display: false
                        }
                    }
                }

                this.financialDataObject = { 'finOverviewDataValues' : [ this.finstatutoryDataValues ], 'finRatioDataValues' : this.finRatioDataValues };
            }
            
            if (this.companyData.pin && this.companyData.pin !== null ) {
                
                if (this.companyData.pin.companyLocation !== undefined && this.companyData.pin !== null) {
                   
                    this.lat = this.companyData.pin.companyLocation.lat;
                    this.lng = this.companyData.pin.companyLocation.lon;
                    this.options = {
                        center: { lat: this.lat, lng: this.lng },
                        zoom: 8
                    };
                    this.infoWindow = new google.maps.InfoWindow();

                    let markerTitle = this.titlecasePipe.transform(this.companyData.businessName) + ' , ' + this.commonService.formatCompanyAddress(this.companyData.RegAddress_Modified);
                    this.overlays = [
                        new google.maps.Marker({ position: { lat: this.lat, lng: this.lng }, title: markerTitle }),
                    ];
                }
            }

            // this.getCompanyShareholdingsData();
        } else {
            this.sharedLoaderService.hideLoader();
        }

        if ( this.thisPage == 'company' ) {

            this.groupStructureTableCols = [
                { field: 'label', header: 'Name', width: '300px', textAlign: 'left' },
                { field: 'data', header: 'Company Number', width: '150px', textAlign: 'center' },
                { field: 'companyStatus', header: 'Company Status', width:'150px', textAlign: 'center' },
                { field: 'percentageShare', header: 'Share Percent', width:'240px', textAlign: 'left' },
                // { field: 'safeAlerts', header: 'Safe Alerts', width: '100px', textAlign: 'center' },
                { field: 'chargesCount', header: 'Number of Charges', width: '150px', textAlign: 'right' },
                { field: 'ccjCount', header: 'Number of CCJ', width: '150px', textAlign: 'right' },
                { field: 'numberOfEmployees', header: 'Number of Employees', width: '150px', textAlign: 'right' },
                { field: 'netWorth', header: 'Net Worth', width: '150px', textAlign: 'right' },
                { field: 'turnover', header: 'Turnover', width: '150px', textAlign: 'right' },
                { field: 'totalAssets', header: 'Total Assets', width: '150px', textAlign: 'right' },
                { field: 'totalLiabilities', header: 'Total Liabilities', width: '150px', textAlign: 'right' }
            ];

        }

        this.directorDetailsCompanySummaryColumns = [
            { field: 'CompanyNumber', header: 'Company Number', minWidth: '140px', maxWidth: '140px', textAlign: 'center' },
            { field: 'CompanyOriginalName', header: 'Name', minWidth: '450px', maxWidth: 'none', textAlign: 'left' },
            { field: 'CompanyStatus', header: 'Company Status', minWidth: '130px', maxWidth: '130px', textAlign: 'center' },
            { field: 'directorJobRole', header: 'Occupation', minWidth: '140px', maxWidth: '140px', textAlign: 'left' },
            { field: 'directorRole', header: 'Role', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
            { field: 'directorStatus', header: 'Director Status', minWidth: '180px', maxWidth: '180px', textAlign: 'center' },
            { field: 'person_entitled', header: 'Person Entitled', minWidth: '220px', maxWidth: '220px', textAlign: 'left' },
            { field: 'internationalScoreDescription', header: 'Risk Band', minWidth: '220px', maxWidth: '220px', textAlign: 'center' },
            { field: 'fromDate', header: 'Date Of Joining', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
            { field: 'toDate', header: 'Date Of Resigned', minWidth: '130px', maxWidth: '130px', textAlign: 'center' },
            { field: 'financeTurnoverData', header: 'Turnover', minWidth: '180px', maxWidth: '180px', textAlign: 'right' },
            { field: 'financeTotalAssetsData', header: 'Total Assets', minWidth: '180px', maxWidth: '180px', textAlign: 'right' },
            { field: 'financeTotalLiabilitiesData', header: 'Total Liabilities', minWidth: '180px', maxWidth: '180px', textAlign: 'right' },
            { field: 'financeNetWorthData', header: 'Net-Worth', minWidth: '180px', maxWidth: '180px', textAlign: 'right' },
            { field: 'directorQualifications', header: 'Qualification', minWidth: '120px', maxWidth: '120px', textAlign: 'left' }
        ];

        // this.directorDetailsShareholdingsSummaryColumns = [
        //     { field: 'shareHoldingCompanyName', header: 'Company Name', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
        //     { field: 'companyRegistrationNumber', header: 'Company Number', minWidth: '140px', maxWidth: '140px', textAlign: 'right' },
        //     { field: 'shareHoldingCompanyStatus', header: 'Company Status', minWidth: '150px', maxWidth: '150px', textAlign: 'center' },
        //     { field: 'shareType', header: 'Share Type', minWidth: '170px', maxWidth: '170px', textAlign: 'left' },
        //     { field: 'currency', header: 'Currency', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
        //     { field: 'person_entitled', header: 'Person Entitled', minWidth: '220px', maxWidth: '220px', textAlign: 'left' },
        //     { field: 'internationalScoreDesc', header: 'Risk Band', minWidth: '220px', maxWidth: '220px', textAlign: 'center' },
        //     { field: 'numberOfSharesIssued', header: 'Share Count', minWidth: '130px', maxWidth: '130px', textAlign: 'right' },
        //     { field: 'share_percent', header: '% of Total Share Count', minWidth: '150px', maxWidth: '150px', textAlign: 'right' },
        //     { field: 'value', header: 'Nominal Value', minWidth: '120px', maxWidth: '120px', textAlign: 'right' },
        //     { field: 'sic_code', header: 'Sic Code', minWidth: '500px', maxWidth: '500px', textAlign: 'left' },
        // ];

        //possible director table

        // this.possibleDirectorDetailsShareholdingsSummaryColumns = [
        //     { field: 'shareHoldingCompanyName', header: 'Company Name', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
        //     { field: 'companyRegistrationNumber', header: 'Company Number', minWidth: '140px', maxWidth: '140px', textAlign: 'right' },
        //     { field: 'shareHoldingCompanyStatus', header: 'Company Status', minWidth: '150px', maxWidth: '150px', textAlign: 'center' },
        //     { field: 'shareType', header: 'Share Type', minWidth: '170px', maxWidth: '170px', textAlign: 'left' },
        //     { field: 'currency', header: 'Currency', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
        //     { field: 'person_entitled', header: 'Person Entitled', minWidth: '220px', maxWidth: '220px', textAlign: 'left' },
        //     { field: 'internationalScoreDesc', header: 'Risk Band', minWidth: '220px', maxWidth: '220px', textAlign: 'center' },
        //     { field: 'numberOfSharesIssued', header: 'Share Count', minWidth: '130px', maxWidth: '130px', textAlign: 'right' },
        //     { field: 'share_percent', header: '% of Total Share Count', minWidth: '150px', maxWidth: '150px', textAlign: 'right' },
        //     { field: 'value', header: 'Nominal Value', minWidth: '120px', maxWidth: '120px', textAlign: 'right' },
        //     { field: 'sic_code', header: 'Sic Code', minWidth: '500px', maxWidth: '500px', textAlign: 'left' },
        // ];
    }

    ngDoCheck() {
        if (this.companyDocuments) {
            this.companyDetails.companyDocumentsSorted = this.companyDocuments;
        }
        if (this.relatedDirectors) {
            this.companyDetails.relatedDirectorsSorted = this.relatedDirectors;
        }
        if (this.relatedCompanies) {
            this.companyDetails.relatedCompaniesSorted = this.relatedCompanies;
        }
        if(this.commentry){
            this.companyDetails.commentryReportsData = this.commentry;
        }
        if(this.financeDataSorted){
            this.companyDetails.financialReportData = this.financeDataSorted;
        }
        if ( this.aquisitionMergersReportData) {
            this.companyDetails.aquisitionMergers = this.aquisitionMergersReportData;
        }
    }

    ngAfterViewInit() {

        setTimeout(() => {
            this.showTabGroupAfterDelay = true;
            this.sharedLoaderService.hideLoader();

            if ( this.activeRoute.snapshot.queryParams.type == 'shareholdings' ) {
                setTimeout(() => {
                    this.goToTab( 'Shareholdings', 2, this.financialTabView );
                }, 500);
            }

            if ( this.activeRoute.snapshot.queryParams.type == 'viewCharges' ) {
                setTimeout(() => {
                    this.goToTab( 'Charges', 1, this.riskProfileTabView );
                }, 500);
            }

            if ( this.activeRoute.snapshot.queryParams.type == 'viewNotes' ) {
                setTimeout(() => {
                    this.goToTab( 'Notes', 0, this.overviewTabView );
                }, 500);
            }

        }, 800);

    }

    // For Mobile Responsive Tab View
    toggleTabsView( event, targetElm: TabView ) {
        let tabNavElm = targetElm.el.nativeElement.children[0].children[0];

        if ( tabNavElm.classList.contains( 'ui-tabview-nav' ) ) {

            if ( !tabNavElm.classList.contains( 'expanded' ) ) {
                tabNavElm.classList.add( 'expanded' );
                event.target.classList.add( 'tabsMenuExpaned' );
            } else {
                tabNavElm.classList.remove( 'expanded' );
                event.target.classList.remove( 'tabsMenuExpaned' );
            }

        }
    }
    // For Mobile Responsive Tab View End

    getCountryCode(from) {
        this.globalServerCommunication.globalServerRequestCall('get', 'DG_API', 'countryName').subscribe( res => {
            let data = res;
            if (data.status === 200) {
              
                for (let i = 0; i < data['body']['result'].length; i++) {
                    this.countryCodemap.set(data['body']['result'][i].Nationality.toLowerCase(), data['body']['result'][i].Code.toLowerCase());
                    this.countryNameMap.set(data['body']['result'][i].Country.toLowerCase(), data['body']['result'][i].Code.toLowerCase());
                }

                if ( this.thisPage == 'company' ) {
                    this.getCompanyDetails();
                    
                    if ( this.isLoggedIn ) {
                        if(this.companyData.hasGroupStructure == true) {
                        }
                    }
                }

                if (this.thisPage == 'director') {
                    this.directorDetailFinanceData(from);
                    if ( from !== "ngOnChanges" ) {
                        this.directorDetailFinanceDataPossibleCompanies();
                    }
                }

            }
        })
    }

    checkSubscriptionAuth( conditionCheck: any, route: any[] ) {
		if ( this.isLoggedIn ) {
			if ( !conditionCheck ) {
				event.preventDefault();
				event.stopPropagation();
				this.showUpgradePlanDialog = true;
			} else {
				let routeUrl: any;
				if ( typeof route == 'string' ) {
					routeUrl = route;
					if ( routeUrl.includes('https://www.') ) {
						routeUrl = routeUrl.replace( 'https://www.', '' );
						routeUrl = 'https://www.' + routeUrl;
					} else if ( routeUrl.includes( 'https://www.in.' ) ) {
						routeUrl = routeUrl.replace( 'https://www.in.', '' );
						routeUrl = 'https://in.' + routeUrl;
					} else if ( routeUrl.includes( 'https://www.https://' ) ) {
						routeUrl = routeUrl.replace( 'https://www.https://', '' );
						routeUrl = 'https://' + routeUrl;
					} else if ( routeUrl.includes( 'https://uk.' ) ) {
						routeUrl = routeUrl.replace( 'https://uk.', '' );
						routeUrl = 'https://uk.' + routeUrl;
					} else if ( routeUrl.includes( 'https://' ) ) {
						routeUrl = routeUrl;
					} else {
						routeUrl = 'https://' + routeUrl;
					}
				} else {
					routeUrl = this.router.serializeUrl( this.router.createUrlTree( route ) );
				}
				window.open( routeUrl, '_blank' );
			}

		} else {
			event.preventDefault();
			event.stopPropagation();
			this.showLoginDialog = true;
		}

	}

    scroll(el: HTMLElement) {
        el.scrollIntoView();
    }

    getCompanyDetails() {
        if (this.companyData) {
            this.parseCompanyDetail(this.companyData, "Overview");
            
            if ( this.isLoggedIn ) {

                if(this.companyDetails.companyRegistrationNumber) {
                   this.fetchFavouritesData(this.companyDetails.companyRegistrationNumber.toString());
                }
                if (this.companyDetails.previousNames) {
                    this.companyDetails.previousNames = this.companyDetails.previousNames.sort((a, b): any => {
                        let prevDate: any = this.commonService.changeToDate(a.dateChanged),
                            newDate: any = this.commonService.changeToDate(b.dateChanged);
                        if (newDate < prevDate) return -1;
                        if (newDate > prevDate) return 1;
                    });
                }
                this.fetchWatchList();
                //this.getNotes();

            }

            this.patentTradeColumns = [
                { field: 'ApplicationNo', header: 'Application No', width: '100px', textAlign: 'left' },
                { field: 'CaseID', header: 'Case Id', width: '100px', textAlign: 'right' },
                { field: 'CaseStatus', header: 'Case Status', width: '100px', textAlign: 'left' },
                { field: 'CountryOfIncorporation', header: 'Incorporated Country', width: '150px', textAlign: 'left' },
                { field: 'DateFiled', header: 'Filed Date', width: '120px', textAlign: 'center' },
                { field: 'Title', header: 'Title', width: '250px', textAlign: 'left' }
            ]

            this.directorDataColumn = [
                { field: 'updateDirectorData', header: 'Action', width: '60px', textAlign: 'center', visible: true },
                { field: 'monitorBoolean', header: '', width: '40px', textAlign: 'center', visible: true },
                { field: 'dName', header: 'Name', width: '280px', textAlign: 'left', visible: true },
                { field: 'status', header: 'Status', width: '150px', textAlign: 'center', visible: true },
                { field: 'fromDate', header: 'Appointed On', width: '120px', textAlign: 'center', visible: true },
                { field: 'directorEmail', header: 'Email', width: '180px', textAlign: 'left', visible: ( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasAddOnPermission('contactInformation') ) },
                { field: 'jobTitle', header: 'Job Title', width: '180px', textAlign: 'left', visible: true },
                { field: 'directorJobRole', header: 'Occupation', width: '180px', textAlign: 'left', visible: true },
                { field: 'directorRole', header: 'Role', width: '140px', textAlign: 'left', visible: true },
                { field: 'nationality', header: 'Nationality', width: '160px', textAlign: 'left', visible: true },
                { field: 'country', header: 'Country', width: '140px', textAlign: 'left', visible: true },
                { field: 'address1', header: 'Address1', width: '500px', textAlign: 'left', visible: true },
                { field: 'address2', header: 'Address2', width: '500px', textAlign: 'left', visible: true },
                { field: 'date_of_birth', header: 'Date of Birth', width: '130px', textAlign: 'center', visible: true },
                { field: 'age', header: 'Age', width: '130px', textAlign: 'right', visible: true },
                { field: 'toDate', header: 'Resgined On', width: '120px', textAlign: 'center', visible: true },
                { field: 'deleteDate', header: 'Deleted On', width: '120px', textAlign: 'center', visible: true },
                { field: 'exceptionDirectors', header: 'Exceptions', width: '160px', textAlign: 'left', visible: true },
                { field: 'checkSanctions', header: 'PEP and Sanctions', width: '400px', textAlign: 'center', visible: true },
                { field: 'disqualifiedDirectors', header: 'Disqualification', width: '210px', textAlign: 'left', visible: true },
                { field: 'directorQualifications', header: 'Qualification', width: '120px', textAlign: 'left', visible: true }
            ];

            this.pscDataColumn = [
                { field: 'pscName', header: 'Name', width: '280px', textAlign: 'left' },
                { field: 'natures_of_control', header: 'Nature of Control', width: '200px', textAlign: 'left' },
                { field: 'stat', header: 'Status', width: '170px', textAlign: 'center' },
                { field: 'controlType', header: 'Kind', width: '300px', textAlign: 'left' },
                { field: 'nationality', header: 'Nationality', width: '170px', textAlign: 'left' },
                { field: 'dataOfBirth', header: 'Date of Birth', width: '120px', textAlign: 'center' },
                { field: 'countryOfResidence', header: 'Residence Country', width: '160px', textAlign: 'left    ' },
                { field: 'pscAddress', header: 'Address', width: '400px', textAlign: 'left' },
            ];

            this.pscStatementControlPersonDataColumn = [
                { field: 'description', header: 'Description', width: '280px', textAlign: 'left' },
                { field: 'controlType', header: 'Kind', width: '120px', textAlign: 'left' },
                { field: 'psc_statement_status', header: 'Status', width: '80px', textAlign: 'left' },
                { field: 'psc_statement_notified_date', header: 'Notified Date', width: '120px', textAlign: 'center' },
                { field: 'psc_statement_ceased_date', header: 'Ceased Date', width: '120px', textAlign: 'center' },
            ];

            this.pscSuperSecurePersonDataColumn = [
                { field: 'description', header: 'Description', width: '280px', textAlign: 'left' },
                { field: 'controlType', header: 'Kind', width: '120px', textAlign: 'left' },
                { field: 'psc_protected_status', header: 'Status', width: '80px', textAlign: 'left' },
            ];

            this.relatedCompaniesDataColumn = [
                { field: 'companyName', header: 'Company Name', width: '450px', textAlign: 'left' },
                { field: 'companyNumber', header: 'Company Number', width: '150px', textAlign: 'left' },
                { field: 'linkedDirector', header: 'Linked Director', width: '240px', textAlign: 'left' },
                { field: 'companyStatus', header: 'Status', width: '120px', textAlign: 'center' },
                { field: 'totalDirectors', header: 'No. of Directors', width: '130px', textAlign: 'right' },
                { field: 'appointedOn', header: 'Appointed on', width: '120px', textAlign: 'right' },
                { field: 'chargesCount', header: 'Charges', width: '100px', textAlign: 'right' },
                { field: 'incorporationDate', header: 'Incorporation', width: '130px', textAlign: 'right' },
                { field: 'category', header: 'Category', width: '350px', textAlign: 'left' },
                { field: 'sic_code', header: 'Sic Code', width: '500px', textAlign: 'left' },
                { field: 'address', header: 'Address', width: '500px', textAlign: 'left' }
            ];

            this.relatedDirectorsDataColumn = [
                { field: 'directorName', header: 'Director Name', width: '280px', textAlign: 'left' },
                { field: 'resignedStatus', header: 'Status', width: '100px', textAlign: 'center' },
                { field: 'appointmentDate', header: 'Appointed on', width: '120px', textAlign: 'center' },
                { field: 'linkedDirector', header: 'Linked Director', width: '280px', textAlign: 'left' },
                { field: 'companyName', header: 'Company Name', width: '250px', textAlign: 'left' },
                { field: 'role', header: 'Role', width: '150px', textAlign: 'left' },
                { field: 'nationality', header: 'Nationality', width: '120px', textAlign: 'left' },
                { field: 'dAddress', header: 'Address1', width: '450px', textAlign: 'left' },
                { field: 'dAddress2', header: 'Address2', width: '450px', textAlign: 'left' },
            ];

            this.documentDataColumn = [
                { field: 'description', header: 'Description', width: '300px', textAlign: 'left' },
                { field: 'category', header: 'Category', width: '100px', textAlign: 'left' },
                { field: 'date', header: 'Date', width: '100px', textAlign: 'center' },
                { field: 'pages', header: 'Pages', width: '90px', textAlign: 'right' },
                { field: 'download', header: 'Option', width: '130px', textAlign: 'center' }
            ];

            this.chargesDataColumn = [
                { field: 'charge_number', header: 'Charge No.', width: '130px', textAlign: 'right' },
                { field: 'chargeCode', header: 'Charge Code', width: '200px', textAlign: 'right' },
                { field: 'persons_entitled', header: 'Person Entitled', width: '300px', textAlign: 'left' },
                { field: 'classification', header: 'Charge-description', width: '300px', textAlign: 'left' },
                { field: 'status', header: 'Status', width: '140px', textAlign: 'center' },
                { field: 'registered_on', header: 'Registered On', width: '120px', textAlign: 'center' },
                { field: 'created_on', header: 'Created On', width: '120px', textAlign: 'center' },
                { field: 'delivered_on', header: 'Satisfied On', width: '120px', textAlign: 'center' },
                { field: 'secured_details', header: 'Amount-secured', width: '550px', textAlign: 'left' },
                { field: 'particulars', header: 'Short-particulars', width: '550px', textAlign: 'left' }
            ];

            this.corporateLandDataColumn = [
                { field: 'Proprietor_Name_1', header: 'Company Name', width: '280px', textAlign: 'left' },
                { field: 'Proprietor_Name_2', header: 'Company Name 2', width: '280px', textAlign: 'left' },
                { field: 'Title_Number', header: 'Title Number', width: '120px', textAlign: 'left' },
                { field: 'Property_Address', header: 'Address', width: '400px', textAlign: 'left' },
                { field: 'Postcode', header: 'Post Code', width: '180px', textAlign: 'left' },
                { field: 'Tenure', header: 'Tenure', width: '130px', textAlign: 'left' },
                { field: 'Price_Paid', header: 'Price Paid', width: '130px', textAlign: 'right' },
                { field: 'Date_Proprietor_Added', header: 'Proprietor Added Date', width: '180px', textAlign: 'center' }
            ];
            
            this.notesTableCols = [
                { field: 'notes', header: 'Note ', width: '350px', textAlign: 'left' },
                { field: 'createdOn', header: 'Created On', width: '100px', textAlign: 'center' },
                { field: 'updatedOn', header: 'Updated On', width: '100px', textAlign: 'center' }
            ];

            // Innovate Grant Table Data

            this.innovateGrantData = this.companyData['innovate_uk_funded_updated'] ? this.companyData['innovate_uk_funded_updated'] : [];

            if ( this.innovateGrantData ) {
                for ( let innovateGrantDataObj of this.innovateGrantData ) {
                    innovateGrantDataObj.projectStartDate = this.commonService.changeToDate( innovateGrantDataObj.projectStartDate );
                    innovateGrantDataObj.projectEndDate = this.commonService.changeToDate( innovateGrantDataObj.projectEndDate );
                }
            }

            this.innovateGrantColumns = [
                { field: 'competitionReference', header: 'Competition Reference', width: '180px', textAlign: 'left' },
                { field: 'competitionTitle', header: 'Competition Title', width: '220px', textAlign: 'left' },
                { field: 'programmeTitle', header: 'Programme Title', width: '220px', textAlign: 'left' },
                { field: 'sector', header: 'Sector', width: '180px', textAlign: 'left' },
                { field: 'applicationNumber', header: 'Application Number', width: '130px', textAlign: 'left' },
                { field: 'projectNumber', header: 'Project Number', width: '130px', textAlign: 'left' },
                { field: 'projectTitle', header: 'Project Title', width: '220px', textAlign: 'left' },
                { field: 'competitionYear', header: 'Competition Year', width: '100px', textAlign: 'center' },
                { field: 'innovateUKProductType', header: 'Product Type', width: '180px', textAlign: 'left' },
                { field: 'participantName', header: 'Participant Name', width: '200px', textAlign: 'left' },
                { field: 'isLeadParticipant', header: 'Is Lead Participant', width: '100px', textAlign: 'center' },
                { field: 'crn', header: 'CRN', width: '100px', textAlign: 'center' },
                { field: 'projectStartDate', header: 'Start Date', width: '100px', textAlign: 'center' },
                { field: 'projectEndDate', header: 'End Date', width: '100px', textAlign: 'center' },
                { field: 'grantOffered', header: 'Grant Offered', width: '120px', textAlign: 'right' },
                { field: 'totalCosts', header: 'Total Cost', width: '120px', textAlign: 'right' },
                { field: 'actualSpendtoDate', header: 'Actual Spend To Date', width: '120px', textAlign: 'right' },
                { field: 'participantWithdrawnFromProject', header: 'Participant Withdrawn From Project', width: '110px', textAlign: 'left' },
                { field: 'projectStatus', header: 'Project Status', width: '110px', textAlign: 'left' },
                { field: 'enterpriseSize', header: 'Enterprise Size', width: '120px', textAlign: 'left' },
                { field: 'postcode', header: 'Post Code', width: '110px', textAlign: 'left' },
                { field: 'addressRegion', header: 'Address Region', width: '110px', textAlign: 'left' },
                { field: 'addressLEP', header: 'Address LEP', width: '110px', textAlign: 'left' },
                { field: 'inMultipleLEPs', header: 'In Multiple LEPs', width: '110px', textAlign: 'left' },
                { field: 'industrialStrategyChallengeFund', header: 'Industrial Strategy Challenge Fund', width: '110px', textAlign: 'left' },
                { field: 'publicDescription', header: 'Public Description', width: '400px', textAlign: 'left' }
            ];

            // Innovate Grant Table Data End

            this.relatedPersonInfoDataColumn = [
                { field: 'dName', header: 'Person Name', width: '180px', textAlign: 'left' },
                { field: 'jobTitle', header: 'Job Title', width: '180px', textAlign: 'left' },
                { field: 'directorEmail', header: 'Email', width: '180px', textAlign: 'left' },
                { field: 'businessName', header: 'Company Name', width: '350px', textAlign: 'left' },
                // { field: 'companyRegistrationNumber', header: 'Company Number', width: '120px', textAlign: 'left' },
                { field: 'website', header: 'Website', width: '180px', textAlign: 'left' },
            ];

            this.companyDetailsParams.CompanyNumber = this.companyDetails.companyRegistrationNumber;
            this.companyDetailsParams.CompanyNameOriginal = this.companyDetails.businessName;
            // this.companyDetails.businessName =  this.companyDetailsParams.CompanyNameOriginal;     
            
            //Person Contact Info

            this.personalContactInfoColumns = [
                { field: 'dName', header: 'Person Name', width: '250px', textAlign: 'left' },
                { field: 'companyName', header: 'Company Name', width: '320px', textAlign: 'left' },
                { field: 'companyNumber', header: 'Company Number', width: '160px', textAlign: 'left' },
                { field: 'create_date', header: 'Created Date', width: '120px', textAlign: 'center' },
                { field: 'email_1', header: 'Email 1', width: '250px', textAlign: 'left' },
                { field: 'email_2', header: 'Email 2', width: '250px', textAlign: 'left' },
                { field: 'email_3', header: 'Email 3', width: '250px', textAlign: 'left' },
                { field: 'directorEmail', header: 'Email 4', width: '250px', textAlign: 'left' },
                { field: 'tel_1', header: 'Telephone', width: '180px', textAlign: 'left' },
                { field: 'title', header: 'Job Title', width: '180px', textAlign: 'left' },
            ];
        }

    }

    getPlanDetails(planId) {
        this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( res => {
            if(res.body.status == 200) {
                this.planDetails.planId = res.body['results']._id;
            }
        });
    }

    linkedInUrlForDirector(director_name, userUID) {
       
        if ( this.isLoggedIn ) {
            if ( this.userAuthService.hasAddOnPermission('contactInformation') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
                var FinalName = " ";
                let reqobj = [userUID];
                this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_API', 'relatedCompanyToDirector', reqobj ).subscribe( res => {
                    if (res.body.status === 200) {
                        let companiesarray = res.body['results'];
                        let length = (companiesarray.length > 5) ? 5 : companiesarray.length;
                        
                        for (let j = 0; j < length; j++) {
                            if (companiesarray[j].label !== undefined) {
                                var NewName = companiesarray[j].label.trim().split(" ");
                                // FinalName += NewName[0]
                                for (let i = 0; i < NewName.length; i++) {
                                    if (NewName[i] !== "LIMITED" && NewName[i] !== "LTD") {
                                        FinalName += NewName[i] + "%20";
                                    }
                                }
                            }
                            if (j !== length - 1) {
                                FinalName += "%20OR%20";
                            }
        
                            if (j == length - 1) {
                                let url = "https://www.linkedin.com/search/results/people/?firstName=" + this.firstName(director_name) + "&lastName=" + this.lastName(director_name) ;
                                window.open(url, "_blank").focus();
                            }
                        }
                    }
                })
            } else {
                event.preventDefault();
                event.stopPropagation();
                this.showUpgradePlanDialog = true;
            }
        } else {
            event.preventDefault();
            event.stopPropagation();
            this.showLoginDialog = true;
        }
    }

    socialURLforDirector(director_name) {
        let url = "https://www.linkedin.com/search/results/people/?firstName=" + this.firstName(director_name) + "&lastName=" + this.lastName(director_name);
        window.open(url, "_blank").focus();
    }

    firstName(director_name) {
        let firstName = "";
        if (director_name !== undefined) {
            let indexOfComma = director_name.indexOf(",");
            if (indexOfComma !== -1) {
                let firstName1 = director_name.substring(indexOfComma + 1).trim();
                if (firstName1.indexOf(' ') > -1)
                    firstName = firstName1.substr(0, firstName1.indexOf(' '));
                else
                    firstName = firstName1;
            } else if (director_name.indexOf(" ") !== -1) {
                firstName = director_name.substring(0, director_name.indexOf(" "));
            }
        }
        return firstName;
    }

    lastName(director_name) {
        let lastName = "";
        if (director_name !== undefined) {
            let indexOfComma = director_name.indexOf(",");
            if (indexOfComma !== -1) {
                lastName = director_name.substring(0, indexOfComma).trim();
            } else if (director_name.indexOf(" ") !== -1) {
                lastName = director_name.substring(director_name.lastIndexOf(" ") + 1);
            }
        }
        return lastName;
    }

    directorDetailFinanceData(from) {        
        for (let dirDetailData of this.directorDetailData) {
    
            if ( dirDetailData.directorData.directorJobRole && !this.directorsAllOccupations.includes( dirDetailData.directorData.directorJobRole ) ) {
                this.directorsAllOccupations.push( dirDetailData.directorData.directorJobRole );
            }
            
            if( dirDetailData.directorData.detailedInformation.nationality !== undefined ) {
                              
                if ( this.countryCodemap.has( dirDetailData.directorData.detailedInformation.nationality ) ) {
   
                    dirDetailData.directorData['countryCode'] = this.countryCodemap.get( dirDetailData.directorData.detailedInformation.nationality.toLowerCase() );

                    this.directorDetailData[0]['directorData']['detailedInformation']['nationality'] = dirDetailData.directorData.detailedInformation.nationality;
                    this.directorDetailData[0]['directorData']['detailedInformation']['countryCode'] = dirDetailData.directorData['countryCode'];
                }
            }

            if( dirDetailData.directorData.date_of_birth !== undefined ) {
                this.directorDetailData[0]['directorData']['date_of_birth'] = dirDetailData.directorData.date_of_birth;
            }

            if ( dirDetailData.hasFinances ) {
                let finOverviewChartYears = [];
                
                if (dirDetailData.financeData && dirDetailData.financeData.length == 1) {
                    const tempCloneArr = dirDetailData.financeData.map( a => { return { ...a } } );

                    for ( let tempArrKey in tempCloneArr[0] ) {
                        if ( tempArrKey == 'yearEndDate' ) {
                            let a = tempCloneArr[0][tempArrKey].split('/');

                            a[2] = (+a[2] - 1).toString();
                            
                            tempCloneArr[0][tempArrKey] = a.join('/');
                        } else {
                            tempCloneArr[0][tempArrKey] = null;
                        }
                    }

                    dirDetailData.financeData.push(tempCloneArr[0]);
                }
    
                if (dirDetailData.financeData) {
                    dirDetailData.financeData = dirDetailData.financeData.sort((a, b) => {
                        let prevDate: any = this.commonService.changeToDate(a.yearEndDate ? a.yearEndDate : 0),
                            newDate: any = this.commonService.changeToDate(b.yearEndDate ? b.yearEndDate : 0);

                        return prevDate - newDate;
                    });
                }
                
                dirDetailData['financeTurnoverData'] = [];
                dirDetailData['financeTotalAssetsData'] = [];
                dirDetailData['financeTotalLiabilitiesData'] = [];
                dirDetailData['financeNetWorthData'] = [];
                if (dirDetailData.financeData) {
                    for (let finOverData of dirDetailData.financeData) {
                        let finYear = new Date(this.commonService.changeToDate(finOverData.yearEndDate)).getFullYear();

                        finOverviewChartYears.push(finYear);

                        dirDetailData['financeTurnoverData'].push(finOverData.turnover ? finOverData.turnover : 0);
                        dirDetailData['financeTotalAssetsData'].push(finOverData.totalAssets ? finOverData.totalAssets : 0);
                        dirDetailData['financeTotalLiabilitiesData'].push(finOverData.totalLiabilities ? finOverData.totalLiabilities : 0);
                        dirDetailData['financeNetWorthData'].push(finOverData.netWorth ? finOverData.netWorth : 0);
                    }
                }

                this.chartOptions = {
                    tension: 0.4,
                    scales: {
                        x: {
                            ticks: {
                                font: {
                                    family: 'Roboto',
                                },
                                padding: 8
                            }
                        },
                        y:  {
                            ticks: {
                                font: {
                                    family: 'Roboto',
                                },
                                padding: 8,
                                callback: (label, index, labels) => {
                                    return this.toNumberSuffix.transform( label, 0, 'GBP' );
                                }
                            }
                        }
                    },
                    plugins: {
                        datalabels: {
                            display: false
                        },
                        legend: {
                            labels: {
                                fontFamily: 'Roboto',
                                padding: 15
                            }
                        },
                        title: {
                            fontFamily: 'Roboto',
                        },
                        tooltip: {
                            enabled: true,
                            titleFontFamily: 'Roboto',
                            bodyFontFamily: 'Roboto',
                            callbacks: {
                                label: ( tooltipItem, dataset ) => {
                                    return `${ dataset.datasets[ tooltipItem.datasetIndex ].label }: ${ this.toCurrencyPipe.transform( tooltipItem.yLabel, 'GBP', 'symbol', '1.0-0' ) }`;
                                }
                            }
                        },
                    }
                }

                dirDetailData.financeChartData = {
                    labels: finOverviewChartYears,
                    datasets: [
                        {
                            label: 'Turnover',
                            data: dirDetailData.financeTurnoverData,
                            fill: false,
                            borderColor: '#5b9bd5'
                        },
                        {
                            label: 'Total Assets',
                            data: dirDetailData.financeTotalAssetsData,
                            fill: false,
                            borderColor: '#ffc000'
                        },
                        {
                            label: 'Total Liabilities',
                            data: dirDetailData.financeTotalLiabilitiesData,
                            fill: false,
                            borderColor: '#ed7d31'
                        },
                        {
                            label: 'Net Worth',
                            data: dirDetailData.financeNetWorthData,
                            fill: false,
                            borderColor: '#60af60'
                        }
                    ]
    
                };
            }
            
        }

        if (from === 'ngOnInit') {
            let obj = {};
            if( this.directorShareholdingDataForPNR != undefined ) {
                
                if( this.directorShareholdingDataForPNR.shareholdings != undefined ) {
    
                    if ( this.directorShareholdingDataForPNR.shareholdings.length > 0 ) {
    
                        this.directorShareholdingDataForPNR = this.formatShareHoldingData(this.directorShareholdingDataForPNR);
    
                        for(let shareholdings of this.directorShareholdingDataForPNR.shareholdings) {
                                    let temp =  shareholdings.companyInformation[ 'person_entitled' ].reduce( (acc, val ) => {
                                        if(acc[val]){
                                            acc[val] = ++acc[val]
                                        } else {
                                            acc[val] = 1;
                                        }
                                        return acc;
                                    },{})
                                    shareholdings.companyInformation[ 'person_entitled' ] = Object.entries(temp);
                            
                            this.directorDetailsShareholdingsSummaryData.push(shareholdings);
    
                            if( shareholdings["companyInformation"]["businessName"] !== null || shareholdings["companyInformation"]["businessName"] !== undefined || shareholdings["companyInformation"]["companyStatus"] !== null || shareholdings["companyInformation"]["companyStatus"] !== undefined ) {
                                shareholdings['shareHoldingCompanyName'] = shareholdings["companyInformation"]["businessName"];
                                shareholdings['shareHoldingCompanyStatus'] = shareholdings["companyInformation"]["companyStatus"];
                            }
    
                        }
    
                    }
    
                }
    
            }
    
            // if( this.directorShareholdingDataForPNR != undefined ) {
    
            //     if( this.directorShareholdingDataForPNR.possibleShareholdings != undefined ) {
                    
            //         if ( this.directorShareholdingDataForPNR.possibleShareholdings.length > 0 ) {
    
            //             this.directorShareholdingDataForPNR = this.formatShareHoldingData( this.directorShareholdingDataForPNR );
    
            //             for( let possibleShareholdings of this.directorShareholdingDataForPNR.possibleShareholdings) {
            //                 let temp =  possibleShareholdings.companyInformation[ 'person_entitled' ].reduce( (acc, val ) => {
            //                     if(acc[val]){
            //                         acc[val] = ++acc[val]
            //                     } else {
            //                         acc[val] = 1;
            //                     }
            //                     return acc;
            //                 },{})
            //                 possibleShareholdings.companyInformation[ 'person_entitled' ] = Object.entries(temp);

            //                 this.possibleDirectorDetailsShareholdingsSummaryData.push( possibleShareholdings );
    
            //                 if( possibleShareholdings["companyInformation"]["businessName"] !== null || possibleShareholdings["companyInformation"]["businessName"] !== undefined || possibleShareholdings["companyInformation"]["companyStatus"] !== null || possibleShareholdings["companyInformation"]["companyStatus"] !== undefined ) {
            //                     possibleShareholdings['shareHoldingCompanyName'] = possibleShareholdings["companyInformation"]["businessName"];
            //                     possibleShareholdings['shareHoldingCompanyStatus'] = possibleShareholdings["companyInformation"]["companyStatus"];
            //                 }  
            //             }
            //         }
            //     }
            // }
        }
                
        this.directorDetailsCompanySummaryData = [];

        for (let dirDetailDataObj of this.directorDetailData) {

            let tempObj = {};

            for ( let dirDataHead of this.directorDetailsCompanySummaryColumns ) {

                for ( let compDataKey in dirDetailDataObj ) {
                    
                    if ( typeof dirDetailDataObj[ compDataKey ] == 'object' ) {

                        if ( ['financeTurnoverData', 'financeTotalAssetsData', 'financeTotalLiabilitiesData', 'financeNetWorthData'].includes( compDataKey ) ) {
    
                            if ( dirDataHead.field == compDataKey ) {

                                tempObj[ dirDataHead.field ] = dirDetailDataObj[ compDataKey ][ dirDetailDataObj[ compDataKey ].length - 1 ];

                            } 

                        } else if (['person_entitled'].includes( compDataKey )) {
    
                            if ( dirDataHead.field == compDataKey) {

                                let temp =  dirDetailDataObj[ compDataKey ].reduce( (acc, val ) => {
                                    if(acc[val]){
                                        acc[val] = ++acc[val]
                                    } else {
                                        acc[val] = 1;
                                    }
                                    return acc;
                                },{})
                                tempObj[dirDataHead.field] = Object.entries(temp);
                            } 

                        } else {

                            for ( let dirDataKey in dirDetailDataObj[ compDataKey ] ) {
    
                                if ( dirDataHead.field == dirDataKey ) {
    
                                    tempObj[ dirDataHead.field ] = dirDetailDataObj[ compDataKey ][ dirDataHead.field ];
    
                                }
    
                            }


                        }

                    } else {

                        if ( compDataKey == dirDataHead.field ) {

                            tempObj[ dirDataHead.field ] = dirDetailDataObj[ dirDataHead.field ];

                        }

                    }

                }
            }            

            tempObj['directorStatus'] = dirDetailDataObj['directorData']['status'];
            tempObj['IncorporationDate'] = dirDetailDataObj['IncorporationDate'];
            tempObj['ccjCount'] = dirDetailDataObj['ccjCount'];
            tempObj['shareHoldersCount'] = dirDetailDataObj['shareHoldersCount'];
            tempObj['companyCommentaryCount'] = dirDetailDataObj['companyCommentaryCount'];
            tempObj['hasSafeAlerts'] = dirDetailDataObj['hasSafeAlerts'];
            tempObj['total_count'] = dirDetailDataObj['total_count'];
            tempObj['directorIsPsc'] = dirDetailDataObj['directorIsPsc'];
            tempObj['logo_url'] = dirDetailDataObj['logo_url'];

            this.directorDetailsCompanySummaryData.push( tempObj );
            this.totalNumOfRecords = this.totalResultCount;

        }

    }


    createfinancialTable() {
        if (this.financeData) {
            let latestFinancialYear: any;
            for (let i = 0; i < this.financeData.length; i++) {
                for (let j = 0; j < this.financeData[i].values.length; j++) {
                    if (i == 1) {
                        latestFinancialYear = JSON.parse(JSON.stringify(this.financeData[i].values[j].year));
                        this.financialYears.push(JSON.parse(JSON.stringify(this.financeData[i].values[j].year)));
                    }
                    else if (i > 1) {
                        if (latestFinancialYear < Number(this.financeData[i].values[j].year)) {
                            latestFinancialYear = JSON.parse(JSON.stringify(this.financeData[i].values[j].year));
                        }
                        this.financialYears.push(JSON.parse(JSON.stringify(this.financeData[i].values[j].year)));
                    }
                }
                this.financialKeys.push(JSON.parse(JSON.stringify(this.financeData[i].key_name)));
            }

            
            for (let i = 0; i < this.financeData.length; i++) {
                let financeDataObj = []
                for (let j = this.financeData[i].values.length; j > 0; j--) {
                    financeDataObj[this.financeData[i].values.length - j] = JSON.parse(JSON.stringify(this.financeData[i].values[j - 1]));
                }
                this.financeData[i].values = JSON.parse(JSON.stringify(financeDataObj));
            }

            this.financialYears = this.financialYears.sort().filter(function (elem, index, self) {
                return index === self.indexOf(elem);
            })

            let tempYear = [];

            for (let i = this.financialYears.length; i > 0; i--) {
                tempYear[this.financialYears.length - i] = this.financialYears[i - 1];
            }
            this.financialYears = tempYear;


            this.latestFinancialYear = latestFinancialYear;

            let tempCashArray, tempTotalAssetsArray, tempTurnoverArray, tempCreditorsArray;

            for (let i = 0; i < this.financeData.length; i++) {
                if (this.financeData[i].key_name.includes('cash')) {
                    tempCashArray = JSON.parse(JSON.stringify(this.financeData[i]));
                    this.cashArray = JSON.parse(JSON.stringify(this.financeData[i]));
                }
                if (this.financeData[i].key_name.includes('totalassetsless')) {
                    tempTotalAssetsArray = JSON.parse(JSON.stringify(this.financeData[i]));
                    this.totalAssetsArray = JSON.parse(JSON.stringify(this.financeData[i]));
                }
                if (this.financeData[i].key_name.includes('turnover')) {
                    tempTurnoverArray = JSON.parse(JSON.stringify(this.financeData[i]));
                    this.turnoverArray = JSON.parse(JSON.stringify(this.financeData[i]));
                }
                if (this.financeData[i].key_name == 'creditors') {
                    tempCreditorsArray = JSON.parse(JSON.stringify(this.financeData[i]));
                    this.creditorsArray = JSON.parse(JSON.stringify(this.financeData[i]));
                }
            }

            let reversedFinancialYears = JSON.parse(JSON.stringify(this.financialYears));

            reversedFinancialYears = reversedFinancialYears.reverse();

            for (let i = 0; i < reversedFinancialYears.length; i++) {
                if (this.cashArray) {
                    this.cashArray.values[i] = { year: reversedFinancialYears[i], value: 0 };
                }

                if (this.totalAssetsArray) {
                    this.totalAssetsArray.values[i] = { year: reversedFinancialYears[i], value: 0 };
                }

                if (this.turnoverArray) {
                    this.turnoverArray.values[i] = { year: reversedFinancialYears[i], value: 0 };
                }

                if (this.creditorsArray) {
                    this.creditorsArray.values[i] = { year: reversedFinancialYears[i], value: 0 };
                }
            }

            for (let i = 0; i < reversedFinancialYears.length; i++) {

                if (tempCashArray) {
                    for (let j = 0; j < tempCashArray.values.length; j++) {
                        if (tempCashArray.values[j].year == reversedFinancialYears[i]) {
                            this.cashArray.values[i] = JSON.parse(JSON.stringify(tempCashArray.values[j]));
                        }
                    }
                }

                if (tempTotalAssetsArray) {
                    for (let j = 0; j < tempTotalAssetsArray.values.length; j++) {
                        if (tempTotalAssetsArray.values[j].year == reversedFinancialYears[i]) {
                            this.totalAssetsArray.values[i] = JSON.parse(JSON.stringify(tempTotalAssetsArray.values[j]));
                        }
                    }
                }

                if (tempTurnoverArray) {
                    for (let j = 0; j < tempTurnoverArray.values.length; j++) {
                        if (tempTurnoverArray.values[j].year == reversedFinancialYears[i]) {
                            this.turnoverArray.values[i] = JSON.parse(JSON.stringify(tempTurnoverArray.values[j]));
                        }
                    }
                }

                if (tempCreditorsArray) {
                    for (let j = 0; j < tempCreditorsArray.values.length; j++) {
                        if (tempCreditorsArray.values[j].year == reversedFinancialYears[i]) {
                            this.creditorsArray.values[i] = JSON.parse(JSON.stringify(tempCreditorsArray.values[j]));
                        }
                    }
                }

            }

            if (this.cashArray) {
                for (let i = 0; i < this.cashArray.values.length; i++) {
                    if (this.cashArray.values[i] != undefined) {

                        this.cashData[(this.cashArray.values.length - 1) - i] = this.cashArray.values[i].value;
                        if (this.cashArray.values[i].year == this.latestFinancialYear) {
                            this.cash["value"] = this.cashArray.values[i].value;
                            if (i < this.cashArray.values.length && this.cashArray.values[i - 1] && this.cashArray.values[i - 1].value != 0) {
                                if (this.cashArray.values[i].value >= this.cashArray.values[i - 1].value) {
                                    this.cash["status"] = 'increase';
                                    this.cash["percentage"] = ((this.cashArray.values[i].value - this.cashArray.values[i - 1].value) / this.cashArray.values[i - 1].value) * 100;
                                }
                                else {
                                    this.cash["status"] = 'decrease';
                                    this.cash["percentage"] = ((this.cashArray.values[i - 1].value - this.cashArray.values[i].value) / this.cashArray.values[i - 1].value) * 100;
                                }
                            }
                            else {
                                this.cash["status"] = 'nochange';
                            }
                        }
                    }
                }
            }

            if (this.totalAssetsArray) {
                for (let i = 0; i < this.totalAssetsArray.values.length; i++) {
                    if (this.totalAssetsArray.values[i] != undefined) {
                        this.totalAssetsData[(this.totalAssetsArray.values.length - 1) - i] = this.totalAssetsArray.values[i].value;
                        if (this.totalAssetsArray.values[i].year == this.latestFinancialYear) {
                            this.totalAssets["value"] = this.totalAssetsArray.values[i].value;

                            if (i < this.totalAssetsArray.values.length && this.totalAssetsArray.values[i - 1] && this.totalAssetsArray.values[i - 1].value != 0) {
                                if (this.totalAssetsArray.values[i].value >= this.totalAssetsArray.values[i - 1].value) {
                                    this.totalAssets["status"] = 'increase';
                                    this.totalAssets["percentage"] = ((this.totalAssetsArray.values[i].value - this.totalAssetsArray.values[i - 1].value) / this.totalAssetsArray.values[i - 1].value) * 100;
                                }
                                else {
                                    this.totalAssets["status"] = 'decrease';
                                    this.totalAssets["percentage"] = ((this.totalAssetsArray.values[i - 1].value - this.totalAssetsArray.values[i].value) / this.totalAssetsArray.values[i - 1].value) * 100;
                                }
                            }
                            else {
                                this.totalAssets["status"] = 'nochange';
                            }
                        }
                    }
                }
            }

            if (this.turnoverArray) {
                for (let i = 0; i < this.turnoverArray.values.length; i++) {
                    if (this.turnoverArray.values[i] != undefined) {
                        this.turnoverData[(this.turnoverArray.values.length - 1) - i] = this.turnoverArray.values[i].value;
                        if (this.turnoverArray.values[i].year == this.latestFinancialYear) {
                            this.turnover["value"] = this.turnoverArray.values[i].value;
                            if (i < this.turnoverArray.values.length && this.turnoverArray.values[i - 1] && this.turnoverArray.values[i - 1].value != 0) {
                                if (this.turnoverArray.values[i].value >= this.turnoverArray.values[i - 1].value) {
                                    this.turnover["status"] = 'increase';
                                    this.turnover["percentage"] = ((this.turnoverArray.values[i].value - this.turnoverArray.values[i - 1].value) / this.turnoverArray.values[i - 1].value) * 100;
                                }
                                else {
                                    this.turnover["status"] = 'decrease';
                                    this.turnover["percentage"] = ((this.turnoverArray.values[i - 1].value - this.turnoverArray.values[i].value) / this.turnoverArray.values[i - 1].value) * 100;
                                }
                            }
                            else {
                                this.turnover["status"] = 'nochange';
                            }
                        }
                    }
                }
            }

            if (this.creditorsArray) {
                for (let i = 0; i < this.creditorsArray.values.length; i++) {
                    if (this.creditorsArray.values[i] != undefined) {
                        this.creditorsData[(this.creditorsArray.values.length - 1) - i] = this.creditorsArray.values[i].value;
                        if (this.creditorsArray.values[i].year == this.latestFinancialYear) {
                            this.creditors["value"] = this.creditorsArray.values[i].value;
                            if (i < this.creditorsArray.values.length && this.creditorsArray.values[i - 1] && this.creditorsArray.values[i - 1].value != 0) {
                                if (this.creditorsArray.values[i].value >= this.creditorsArray.values[i - 1].value) {
                                    this.creditors["status"] = 'increase';
                                    this.creditors["percentage"] = ((this.creditorsArray.values[i].value - this.creditorsArray.values[i - 1].value) / this.creditorsArray.values[i - 1].value) * 100;
                                }
                                else {
                                    this.creditors["status"] = 'decrease';
                                    this.creditors["percentage"] = ((this.creditorsArray.values[i - 1].value - this.creditorsArray.values[i].value) / this.creditorsArray.values[i - 1].value) * 100;
                                }
                            }
                            else {
                                this.creditors["status"] = 'nochange';
                            }
                        }
                    }
                }
            }
            let reverseCashData = JSON.parse(JSON.stringify(this.cashData));
            let reverseTotalAssetsData = JSON.parse(JSON.stringify(this.totalAssetsData));
            let reverseTurnoverData = JSON.parse(JSON.stringify(this.turnoverData));
            let reverseCreditorsData = JSON.parse(JSON.stringify(this.creditorsData));

            reverseCashData = reverseCashData.reverse();
            reverseTotalAssetsData = reverseTotalAssetsData.reverse();
            reverseTurnoverData = reverseTurnoverData.reverse();
            reverseCreditorsData = reverseCreditorsData.reverse();

            this.lineData = {
                labels: reversedFinancialYears,
                datasets: [
                    {
                        label: 'Cash',
                        data: reverseCashData,
                        fill: false,
                        borderColor: '#5b9bd5'
                    },
                    {
                        label: 'Total Assets',
                        data: reverseTotalAssetsData,
                        fill: false,
                        borderColor: '#ffc000'
                    },
                    {
                        label: 'Turnover',
                        data: reverseTurnoverData,
                        fill: false,
                        borderColor: '#ed7d31'
                    },
                    {
                        label: 'Creditors',
                        data: reverseCreditorsData,
                        fill: false,
                        borderColor: '#60af60'
                    }
                ]

            };
        }
    }

    parseCompanyDetail(data, from): void {
        this.companyDetails = data;
        
        if (this.companyDetails.directorsData && ['Overview', 'director'].includes(from)) {
            if(this.companyDetails.companyStatus === 'dissolved') {
                this.companydirectorStatusCounts.total = this.companyDetails.totalDirectorsCount;
                this.companydirectorStatusCounts.active = 0;
                this.companydirectorStatusCounts.inactive = this.companyDetails.activeDirectorsCount;
                this.companydirectorStatusCounts.resigned = this.companyDetails.resignedDirectorsCount;
            } else {
                this.companydirectorStatusCounts.total = this.companyDetails.totalDirectorsCount;
                this.companydirectorStatusCounts.active = this.companyDetails.activeDirectorsCount;
                this.companydirectorStatusCounts.inactive = 0;
                this.companydirectorStatusCounts.resigned = this.companyDetails.resignedDirectorsCount;
            }
            this.directorDetails = this.companyDetails.directorsData;
            let directorAge: any;
            let DirectorResignedArray = [];
            let DirectorActiveArray = [];
            let DirectorInactiveArray = [];
            this.directorDetails = this.directorDetails.sort( (a, b): any => {
                let prevResignedDate: any = this.commonService.changeToDate(a.fromDate),
                newResignedDate: any = this.commonService.changeToDate(b.fromDate);
                if (prevResignedDate < newResignedDate) return -1;
                if (prevResignedDate > newResignedDate) return 1;
            });
            this.directorDetails = this.directorDetails.sort( (a, b): any => {
                let prevResignedDate: any = this.commonService.changeToDate(a.toDate),
                newResignedDate: any = this.commonService.changeToDate(b.toDate);
                if (prevResignedDate < newResignedDate) return -1;
                if (prevResignedDate > newResignedDate) return 1;
            });
            // let tempDataArr = data.results, sortByGroupArr = [], uniqFinancialKeys = [];

            for (let i = 0; i < this.directorDetails.length; i++) {
                this.directorDetails[i]['companyRegistrationNumber'] = this.companyDetails.companyRegistrationNumber;
                this.directorDetails[i]['businessName'] = this.companyDetails.businessName;
                if(this.directorDetails[i].detailedInformation.nationality !== undefined) {
                    if (this.countryCodemap.has(this.directorDetails[i].detailedInformation.nationality)) {
                        this.directorDetails[i]['countryCode'] = this.countryCodemap.get(this.directorDetails[i].detailedInformation.nationality.toLowerCase());
                    }
                }
                this.directorDetails[i]['nationality'] = this.directorDetails[i].detailedInformation.nationality;
                this.directorDetails[i]['country'] = this.directorDetails[i].detailedInformation.country;

                // sortByGroupArr = tempDataArr.sort( (a, b) => a.group !== b.group ? a.group < b.group ? -1 : 1 : 0 );
                this.directorDetails[i]["full_name"] = this.directorDetails[i].detailedInformation.fullName;
                let otherRelationsObj = {
                    name: this.directorDetails[i].full_name,
                    link: this.directorDetails[i].directorPnr,
                    role: this.directorDetails[i].directorRole,
                }

                this.directorDetails[i]['otherRelations'] = otherRelationsObj;

                let dNameObj = {
                    name: this.directorDetails[i].full_name,
                    link: this.directorDetails[i].directorPnr,
                }

                this.directorDetails[i]['dName'] = dNameObj;

                if(this.directorDetails[i].detailedInformation !== undefined && this.directorDetails[i].detailedInformation !== null) {
                    let data = this.directorDetails[i].detailedInformation;
                    let address1 = '';
                    if(data.addressLine1 !== undefined && data.addressLine1 !== null && data.addressLine1 !== '') {
                        address1 = this.titlecasePipe.transform(data.addressLine1);
                    }
                    if(data.addressLine2 !== undefined && data.addressLine2 !== null && data.addressLine2 !== '') {
                        address1 = address1 + ', ' + this.titlecasePipe.transform(data.addressLine2);
                    }
                    if(data.addressLine3 !== undefined && data.addressLine3 !== null && data.addressLine3 !== '') {
                        address1 = address1 + ', ' +  this.titlecasePipe.transform(data.addressLine3);
                    }
                    if(data.addressLine4 !== undefined && data.addressLine4 !== null && data.addressLine4 !== '') {
                        address1 = address1 + ', ' +  this.titlecasePipe.transform(data.addressLine4);
                    }
                    if(data.addressLine5 !== undefined && data.addressLine5 !== null && data.addressLine5 !== '') {
                        address1 = address1 + ', ' +  this.titlecasePipe.transform(data.addressLine5);
                    }
                    if(data.country !== undefined && data.country !== null && data.country !== '') {
                        address1 = address1 + ', ' +  this.titlecasePipe.transform(data.country);
                    }
                    if(data.postalCode !== undefined && data.postalCode !== null && data.postalCode !== '') {
                        address1 = address1 + ', ' +  data.postalCode.toString().toUpperCase();
                    }
                    this.directorDetails[i]['address1'] = address1;
                }

                let address2 = this.formatDirectorAddress(this.directorDetails[i].serviceAddress)
                this.directorDetails[i]['address2'] = address2;
                if (from == "Overview") {
                    this.directorDetails = this.directorDetails.filter( obj => (obj.appointment && obj.appointment!== "previous appointment"))
                }
                if (this.directorDetails[i].detailedInformation.birthdDate !== undefined && this.directorDetails[i].detailedInformation.birthdDate !== null) {
                    let date_of_birth_obj = {
                        date: this.directorDetails[i].detailedInformation.birthdDate.split('/')[0],
                        month: this.directorDetails[i].detailedInformation.birthdDate.split('/')[1],
                        year: this.directorDetails[i].detailedInformation.birthdDate.split('/')[2]
                    }

                    // this.directorDetailData[0]['directorData']['detailedInformation']['countryCode'] = dirDetailData.directorData['countryCode'];
                    
                    directorAge = this.directorsAge(date_of_birth_obj);
                    this.directorDetails[i]['date_of_birth'] = `${Month[parseInt(date_of_birth_obj.month)]}, ${date_of_birth_obj.year}`;
                    this.directorDetails[i]["age"] = directorAge;
                    
                }
                else{
                    this.directorDetails[i]["age"] = "";
                }
                if (this.directorDetails[i].toDate !== undefined && this.directorDetails[i].toDate !== null) {
                    let toDate = this.directorDetails[i].toDate.split("/");
                    this.directorDetails[i].toDate = new Date(toDate[2], parseInt(toDate[1]) - 1, toDate[0]);
                }
                if (this.directorDetails[i].fromDate !== undefined && this.directorDetails[i].fromDate !== null) {
                    let fromDate = this.directorDetails[i].fromDate.split("/");
                    this.directorDetails[i].fromDate = new Date(fromDate[2], parseInt(fromDate[1]) - 1, fromDate[0]);
                }
                if ((this.directorDetails[i].toDate === null || this.directorDetails[i].toDate === undefined || this.directorDetails[i].toDate === "") && this.companyDetails.companyStatus !== 'dissolved') {
                    this.directorDetails[i]["status"] = 'active';
                    DirectorActiveArray.push(this.directorDetails[i].toDate)
                } else if ((this.directorDetails[i].toDate === null || this.directorDetails[i].toDate === undefined || this.directorDetails[i].toDate === "") && this.companyDetails.companyStatus === 'dissolved') {
                    this.directorDetails[i]["status"] = 'inactive';
                    DirectorInactiveArray.push(this.directorDetails[i].toDate)
                } else {
                    if (this.directorDetails[i].appointment && this.directorDetails[i].appointment !== "previous appointment") {
                        if (this.companyDetails.companyStatus === 'dissolved') {
                            this.directorDetails[i]["status"] = 'inactive'
                        } else {
                            this.directorDetails[i]["status"] = 'active'
                        }
                        DirectorResignedArray.push(undefined)
                    } else {
                        this.directorDetails[i]["status"] = 'resigned';
                        DirectorResignedArray.push(this.directorDetails[i].toDate)
                    }
                }
                if ((this.directorDetails[i].directorPnr)){
                    this.disqualifiedDeletedExceptionDirectors.push(this.directorDetails[i].directorPnr);
                }

                let personalContactInformation = this.companyDetails.personalContactInformation ? this.companyDetails.personalContactInformation : [];
                /** Integrate Person Contact Info Data Start  */
                this.directorDetails[i]["directorEmail"] = "";
                this.directorDetails[i]["linkedin_url"] = "";
                this.directorDetails[i]["tel_1"] = "";
                this.directorDetails[i]["jobTitle"] = "";

                if (personalContactInformation.length > 0) {
                    for (let k = 0; k < personalContactInformation.length; k++) {
                        if (personalContactInformation[k].pnr && (!isNaN(personalContactInformation[k].pnr)) && parseInt(personalContactInformation[k].pnr) == parseInt(this.directorDetails[i].directorPnr)) {
                            if (!this.directorDetails[i]["linkedin_url"]) {
                                this.directorDetails[i]["linkedin_url"] = personalContactInformation[k].linkedin_url ? personalContactInformation[k].linkedin_url : "";
                            }
                            if (!this.directorDetails[i]["directorEmail"]) {
                                this.directorDetails[i]["directorEmail"] = personalContactInformation[k].email_gen1 ? personalContactInformation[k].email_gen1 : personalContactInformation[k].email_1 ? personalContactInformation[k].email_1 : "";
                            }
                            if (!this.directorDetails[i]["tel_1"]) {
                                this.directorDetails[i]["tel_1"] = personalContactInformation[k].tel_1 ? personalContactInformation[k].tel_1 : "";
                            }
                            if (!this.directorDetails[i]["jobTitle"]) {
                                this.directorDetails[i]["jobTitle"] = personalContactInformation[k].job_title ? personalContactInformation[k].job_title : "";
                            }
                            // break

                        } else if (this.directorDetails[i].detailedInformation && personalContactInformation[k].first_name) {
                            let personalContactInformation_first_name = personalContactInformation[k].first_name;
                            let personalContactInformation_last_name = personalContactInformation[k].last_name ? personalContactInformation[k].last_name : "";
                            let personalContactInformation_first_name_1 = personalContactInformation[k].first_name ? personalContactInformation[k].first_name.slice(0, 3) : "";
                            let personalContactInformation_full_name = (personalContactInformation_first_name + personalContactInformation_last_name).toLowerCase()
                            let personalContactInformation_full_name_1 = (personalContactInformation_first_name_1 + personalContactInformation_last_name).toLowerCase()

                            let detailedInformation_first_name = this.directorDetails[i].detailedInformation.forename ? this.directorDetails[i].detailedInformation.forename : "";
                            let detailedInformation_last_name = this.directorDetails[i].detailedInformation.surname ? this.directorDetails[i].detailedInformation.surname : "";
                            let detailedInformation_first_name_1 = this.directorDetails[i].detailedInformation.forename ? this.directorDetails[i].detailedInformation.forename.slice(0, 3) : "";
                            let detailedInformation__full_name = (detailedInformation_first_name + detailedInformation_last_name).toLowerCase()
                            let detailedInformation__full_name_1 = (detailedInformation_first_name_1 + detailedInformation_last_name).toLowerCase()
                            if (detailedInformation__full_name === personalContactInformation_full_name) {
                                if (!this.directorDetails[i]["linkedin_url"]) {
                                    this.directorDetails[i]["linkedin_url"] = personalContactInformation[k].linkedin_url ? personalContactInformation[k].linkedin_url : "";
                                }
                                if (!this.directorDetails[i]["directorEmail"]) {
                                    this.directorDetails[i]["directorEmail"] = personalContactInformation[k].email_gen1 ? personalContactInformation[k].email_gen1 : personalContactInformation[k].email_1 ? personalContactInformation[k].email_1 : "";
                                }
                                if (!this.directorDetails[i]["tel_1"]) {
                                    this.directorDetails[i]["tel_1"] = personalContactInformation[k].tel_1 ? personalContactInformation[k].tel_1 : "";
                                }
                                if (!this.directorDetails[i]["jobTitle"]) {
                                    this.directorDetails[i]["jobTitle"] = personalContactInformation[k].job_title ? personalContactInformation[k].job_title : "";
                                }
                                // break
                            } else if (detailedInformation__full_name_1 === personalContactInformation_full_name_1) {
                                if (!this.directorDetails[i]["linkedin_url"]) {
                                    this.directorDetails[i]["linkedin_url"] = personalContactInformation[k].linkedin_url ? personalContactInformation[k].linkedin_url : "";
                                }
                                if (!this.directorDetails[i]["directorEmail"]) {
                                    this.directorDetails[i]["directorEmail"] = personalContactInformation[k].email_gen1 ? personalContactInformation[k].email_gen1 : personalContactInformation[k].email_1 ? personalContactInformation[k].email_1 : "";
                                }
                                if (!this.directorDetails[i]["tel_1"]) {
                                    this.directorDetails[i]["tel_1"] = personalContactInformation[k].tel_1 ? personalContactInformation[k].tel_1 : "";
                                }
                                if (!this.directorDetails[i]["jobTitle"]) {
                                    this.directorDetails[i]["jobTitle"] = personalContactInformation[k].job_title ? personalContactInformation[k].job_title : "";
                                }
                            }

                        }
                    }
                }

                else {
                    this.directorDetails[i]["directorEmail"] = "";
                    this.directorDetails[i]["linkedin_url"] = "";
                    this.directorDetails[i]["tel_1"] = "";
                    this.directorDetails[i]["jobTitle"] = "";
                }
                 /** Integrate Person Contact Info Data End */ 
            }
            if ( this.isLoggedIn ) {
                this.disqualifiedDirectorDetails();
            }
            // this.deletedDirectorDetails();
            // this.exceptionDirectorDetails();
            
            // this.directorResignedCount = DirectorResignedArray.length;
            // this.directorActiveCount = DirectorActiveArray.length;

            this.directorOverviewArray = this.directorDetails.filter((obj) => obj.status == 'active')
            this.companyDetails.directorsData = this.directorDetails.sort((a,b) => (a.status > b.status) ? 1 : -1);
            // this.chargesDataColumn = [
            //     { field: 'charge_number', header: 'Charge No.', width: '110px', textAlign: 'right' },
            //     { field: 'persons_entitled', header: 'Person Entitled', width: '230px', textAlign: 'left' },
            //     { field: 'classification', header: 'Charge-description', width: '180px', textAlign: 'left' },
            //     { field: 'status', header: 'Status', width: '140px', textAlign: 'left' },
            //     { field: 'created_on', header: 'Created On', width: '120px', textAlign: 'center' },
            //     { field: 'delivered_on', header: 'Delivered On', width: '120px', textAlign: 'center' },
            //     { field: 'secured_details', header: 'Amount-secured', width: '250px', textAlign: 'left' },
            //     { field: 'particulars', header: 'Short-particulars', width: '250px', textAlign: 'left' }
            // ];

            if (from == "director") {
                return
            }
        }
        if (this.companyDetails.pscDetails) {
            let temppscDetails = this.companyDetails.pscDetails;
            this.companyDetails.pscDetails=[];
            this.companyDetails.pscStatementControlPersonDetails = [];
            this.companyDetails.pscSuperSecurePersonDetails = [];
            temppscDetails.forEach(element => {
                if(element.controlType && element.controlType == "persons-with-significant-control-statement") {
                    this.companyDetails.pscStatementControlPersonDetails.push(element)
                }
                if(element.controlType && element.controlType == "super-secure-person-with-significant-control") {
                    this.companyDetails.pscSuperSecurePersonDetails.push(element)
                }
                if (element.pscName && element.pscName!== null ){
                    this.companyDetails.pscDetails.push(element);
                }
            });
            for (let i = 0; i < this.companyDetails.pscDetails.length; i++) {
                if (this.companyDetails.pscDetails[i].pscName !== undefined || this.companyDetails.pscDetails[i].pscName !== null || this.companyDetails.pscDetails[i].pscName !== "") {

                    this.personWithSignificantControls[i] = this.companyDetails.pscDetails[i];
                }
            }
            for (var i = 0; i < this.personWithSignificantControls.length; i++) {
                
                if(this.personWithSignificantControls[i].nationality !== undefined && this.personWithSignificantControls[i].nationality !== null ) {
                    if(this.personWithSignificantControls[i].nationality == 'english'){
                        if (this.countryCodemap.has('british')) {
                            this.personWithSignificantControls[i]['countryCode'] = this.countryCodemap.get('british');
                        }
                    } else {
                        if (this.countryCodemap.has(this.personWithSignificantControls[i].nationality.toLowerCase())) {
                            this.personWithSignificantControls[i]['countryCode'] = this.countryCodemap.get(this.personWithSignificantControls[i].nationality.toLowerCase());
                        }
                    }
                }


                if (this.personWithSignificantControls[i].countryOfResidence !== undefined) {
                    if (this.personWithSignificantControls[i].countryOfResidence !== null) {
                        if (this.countryNameMap.has(this.personWithSignificantControls[i].countryOfResidence.toLowerCase())) {
                            this.personWithSignificantControls[i]['countryResidenceCode'] = this.countryNameMap.get(this.personWithSignificantControls[i].countryOfResidence.toLowerCase());
                        }
                    }
                }
                let natureofcontrols = [];
                natureofcontrols = this.companyDetails.pscDetails[i].natureOfControl.split(',');
                this.companyDetails.pscDetails[i]['natures_of_control'] = natureofcontrols;
                if (natureofcontrols !== undefined && natureofcontrols !== null) {
                    for (var j = 0; j < natureofcontrols.length; j++) {
                        if (
                            this.personWithSignificantControls[i].natures_of_control[
                                j
                            ].indexOf("percent") > -1
                        ) {
                            var ownership = this.personWithSignificantControls[i]
                                .natures_of_control[j];
                            ownership = ownership.replace(/-/g, " ");
                            let newOwnership =
                                ownership.substring(0, ownership.lastIndexOf(" ")) + " %";
                            let newowner1 = newOwnership.replace(/to/g, "-");
                            this.personWithSignificantControls[i].natures_of_control[
                                j
                            ] = newowner1;
                        } else {
                            var ownership = this.personWithSignificantControls[i]
                                .natures_of_control[j];
                            ownership = ownership.replace(/-/g, " ");
                            this.personWithSignificantControls[i].natures_of_control[
                                j
                            ] = ownership;
                        }
                    }
                }
                
                let tempDateOfBirth = this.companyDetails.pscDetails[i].dataOfBirth ;
                if (tempDateOfBirth !== undefined && tempDateOfBirth !== null && tempDateOfBirth !== "") {
                    if (typeof(tempDateOfBirth) == 'string'){
                        let date_of_birth = {
                            month: `${ Month[ parseInt(tempDateOfBirth.split('/')[0]) ] }`,
                            year: `${ tempDateOfBirth.split('/')[1] }`
                        }
                        // tempDateOfBirth = tempDateOfBirth.split("/");
                        // let date_of_birth = `${ Month[ parseInt(tempDateOfBirth[0]) ] }, ${ parseInt(tempDateOfBirth[1]) }`;
                        // date_of_birth['month'] = parseInt(tempDateOfBirth[0]);
                        // date_of_birth['year'] = parseInt(tempDateOfBirth[1]);
                        this.personWithSignificantControls[i].dataOfBirth = date_of_birth;
                    }
                }
                let address = this.pscAddress(this.personWithSignificantControls[i])
                this.personWithSignificantControls[i]['pscAddress'] = address
                // if ()

                let pscNameObj = {
                    name: this.personWithSignificantControls[i].pscName,
                    link: this.personWithSignificantControls[i].links,
                }

                this.personWithSignificantControls[i]['pscName'] = pscNameObj;
            }
            
            if(this.companyDetails.pscStatementControlPersonDetails.length > 0) {
                for (var i = 0; i < this.companyDetails.pscStatementControlPersonDetails.length; i++)  {
                    this.companyDetails.pscStatementControlPersonDetails[i]['description'] = 'The company knows or has reasonable cause to believe that there is a registrable person in relation to the company but it has not identified the registrable person.';
                    this.companyDetails.pscStatementControlPersonDetails[i]['psc_statement_notified_date'] = this.companyDetails.pscStatementControlPersonDetails[i].notifiedDate;
                    this.companyDetails.pscStatementControlPersonDetails[i]['psc_statement_status'] = this.companyDetails.pscStatementControlPersonDetails[i].stat;
                    if(this.companyDetails.pscStatementControlPersonDetails[i].stat == 'ceased') {
                        this.companyDetails.pscStatementControlPersonDetails[i]['psc_statement_ceased_date'] = this.companyDetails.pscStatementControlPersonDetails[i].ceasedDate;
                    } else {
                        this.companyDetails.pscStatementControlPersonDetails[i]['psc_statement_ceased_date'] = '-';
                    }
                }
            }
            if(this.companyDetails.pscSuperSecurePersonDetails.length > 0) {
                for (var i = 0; i < this.companyDetails.pscSuperSecurePersonDetails.length; i++)  {
                    this.companyDetails.pscSuperSecurePersonDetails[i]['description'] = "The person with significant control's details are not shown because restrictions on using or disclosing any of the individual’s particulars are in force under regulations under section 790ZG in relation to this company.";
                    // this.companyDetails.pscSuperSecurePersonDetails[i]['psc_protected_notified_date'] = this.companyDetails.pscSuperSecurePersonDetails[i].notifiedDate;
                    this.companyDetails.pscSuperSecurePersonDetails[i]['psc_protected_status'] = this.companyDetails.pscSuperSecurePersonDetails[i].stat;
                    // if(this.companyDetails.pscSuperSecurePersonDetails[i].stat == 'ceased') {
                    //     this.companyDetails.pscSuperSecurePersonDetails[i]['psc_protected_ceased_date'] = this.companyDetails.pscSuperSecurePersonDetails[i].ceasedDate;
                    // } else {
                    //     this.companyDetails.pscSuperSecurePersonDetails[i]['psc_protected_ceased_date'] = '-';
                    // }
                }
            }
        }
        if(this.companyDetails.personInfoRelated) {
            this.relatedPersonInfoData = this.companyDetails.personInfoRelated;
            for( let data of this.relatedPersonInfoData ) {
                let fullname = "";
                if(data.first_name && data.first_name != "null") {
                    fullname = data.first_name + " ";
                } if(data.middle_name && data.middle_name != "null") {
                    fullname += data.middle_name + " ";
                } if(data.last_name && data.last_name != "null") {
                    fullname += data.last_name.split(' ')[0];
                }
                data['dName'] = fullname;
                data['businessName'] = data.company_name;
                data['companyRegistrationNumber'] = data.company_reg;
                data['website'] = data.company_domain && data.company_domain !== "null" ? data.company_domain : "-";
                if(data.email_gen1 && data.email_gen1 !== " " && data.email_gen1 !== "null" ) {
                    data['directorEmail'] = data.email_gen1;
                } else if (data.email_1 && data.email_1 !== " " && data.email_1 !== "null") {
                    data['directorEmail'] = data.email_1;   
                } else {
                    data['directorEmail'] = "";
                }
                data["jobTitle"] = data.job_title && data.job_title != "null" ? data.job_title : "-" ;
            }
        }

        if (this.companyDetails.personalContactInformation) {

            this.personalContactInfoData = this.companyDetails.personalContactInformation;

            for (let personInfoDetail of this.personalContactInfoData) {

                if (personInfoDetail) {

                    let fullname = "";

                    if (personInfoDetail.first_name && personInfoDetail.first_name != "null") {
                        fullname = personInfoDetail.first_name + " ";

                    } if (personInfoDetail.middle_name && personInfoDetail.middle_name != "null") {
                        fullname += personInfoDetail.middle_name + " ";

                    } if (personInfoDetail.last_name && personInfoDetail.last_name != "null") {
                        fullname += personInfoDetail.last_name + " ";

                    }
                    if (personInfoDetail.email_gen1 && personInfoDetail.email_gen1 !== " " && personInfoDetail.email_gen1 !== "null") {
                        personInfoDetail['directorEmail'] = personInfoDetail.email_gen1;
                    }

                    if (personInfoDetail.linkedin_url && personInfoDetail.linkedin_url != " " && personInfoDetail.linkedin_url != "0" && personInfoDetail.linkedin_url !== "null") {
                       personInfoDetail["linkedin_url"] =  personInfoDetail.linkedin_url.replace('https://www.', '');
                       personInfoDetail["linkedin_url"] = 'https://www.' +personInfoDetail["linkedin_url"];
                    }
        
                    personInfoDetail['companyName'] = personInfoDetail.company_name;
                    personInfoDetail['companyNumber'] = personInfoDetail.company_reg;
                    personInfoDetail['dName'] = fullname && fullname ? fullname : '-';
                    personInfoDetail['jobTitle'] = personInfoDetail.job_title;
                    personInfoDetail['create_date'] = this.commonService.changeToDate(personInfoDetail.create_date);
                }

            }


        }
        // if (this.companyDetails.mortgagesObj) {
        //     let tempArr: Array<any> =  [];
        //     let sortingArray: Array<number> = [];
        //     let outstandingCount = 0;
        //     let partialSatisfiedCount = 0;
        //     let satifiedCount = 0;
        //     this.companyDetails.mortgagesObj.forEach(charge => {
        //         let tempCharge = {};
        //         for (let key in charge) {
        //             if (key == "mortgageNumber"){
        //                 sortingArray.push(charge[key]);
        //                 tempCharge["charge_number"] = charge[key];
        //             }
        //             else if (key == "regDate") {
        //                 if (charge[key] != null && charge[key] != undefined) {
        //                     let regDate = charge[key].split("/");
        //                     tempCharge["registered_on"] = new Date(regDate[2], parseInt(regDate[1]) - 1, regDate[0]);
        //                 }
        //             }
        //             else if (key == "createdDate") {
        //                 if (charge[key] != null && charge[key] != undefined) {
        //                     let createdDate = charge[key].split("/");
        //                     tempCharge["created_on"] = new Date(createdDate[2], parseInt(createdDate[1]) - 1, createdDate[0]);
        //                 }
        //             }
        //             else if (key == "satisfiedDate") {
        //                 if (charge[key] != null && charge[key] != undefined) {
        //                     let satisfiedDate = charge[key].split("/");
        //                     tempCharge["delivered_on"] = new Date(satisfiedDate[2], parseInt(satisfiedDate[1]) - 1, satisfiedDate[0]);
        //                 }
        //             }
        //             else if (key == "memorandumNature") {
        //                 if (["b","f","p","r"].includes(charge[key])){
        //                     tempCharge["status"] = "Fully Satisfied";
        //                     satifiedCount++;
        //                 }
        //                 if (charge[key] == 's'){
        //                     tempCharge["status"] = "Part Satisfied";
        //                     partialSatisfiedCount++;
        //                 }
        //                 if (["t","u","v","w","x","y","z",null,""].includes(charge[key])){
        //                     tempCharge["status"] = "Outstanding";
        //                     outstandingCount++;
        //                 }
        //             }
        //             else if (key == "mortgageDetails") {
        //                 charge[key].forEach((details: { recordType: string; description: string; }) => {
        //                     if (details.recordType == "persons entitled") {
        //                         tempCharge["persons_entitled"] = this.commonService.formatNameForPersonEntitled(details.description.split(";"));
        //                     }
        //                     if (details.recordType == "amount secured") {
        //                         tempCharge["secured_details"] = details.description.replace(/[!@#$%^&*()�,.?";:{}|<>]/g, " ");
        //                         // replace(/[^\w\s]/gi, '')
        //                     }
        //                     if (details.recordType == "mortgage type") {
        //                         tempCharge["classification"] = details.description;
        //                     }
        //                     if (details.recordType == "mortgage detail") {
        //                         tempCharge["particulars"] = details.description.replace(/[!@#$%^&*()�?";:{}|<>]/g, " ");
        //                     }
        //                 });

        //             }
        //             else {
        //                 tempCharge[key] = charge[key]
        //             }
        //         } 
        //         tempArr.push(tempCharge);
        //     });
        //     tempArr = this.sortCharges(tempArr)
        //     this.companyDetails.mortgagesObj = JSON.parse(JSON.stringify(tempArr));
        //     this.companyDetails['mortgagesOutstandingCount'] = outstandingCount;
        //     this.companyDetails['mortgagesPartialSatisfiedCount'] = partialSatisfiedCount;
        //     this.companyDetails['mortgagesSatifiedCount'] = satifiedCount;
        // }

        if ( this.companyDetails.RegAddress_Modified ) {
            
            this.companyDetails['companyAddress'] = this.commonService.formatCompanyAddress(this.companyDetails.RegAddress_Modified);
            if (this.companyDetails.RegAddress_Modified.website !== undefined && this.companyDetails.RegAddress_Modified.website !== null &&
                !(this.companyWebsites.includes(this.companyDetails.RegAddress_Modified.website.toLowerCase()))) {
                this.companyWebsites.push(this.companyDetails.RegAddress_Modified.website.toLowerCase());
            }

            this.companyDetails['companyWebsites'] = this.companyWebsites;

        }

        // if (this.companyDetails.Returns) {
        //     if (
        //         this.companyDetails.Returns.NextDueDate === undefined ||
        //         this.companyDetails.Returns.NextDueDate === null ||
        //         this.companyDetails.Returns.NextDueDate === ""
        //     ) {
        //         this.companyDetails.Returns.NextDueDate = "-";
        //     }
        // }

        // if (this.companyDetails.Returns) {
        //     if (
        //         this.companyDetails.Returns.LastMadeUpDate === undefined ||
        //         this.companyDetails.Returns.LastMadeUpDate === null ||
        //         this.companyDetails.Returns.LastMadeUpDate === ""
        //     ) {
        //         this.companyDetails.Returns.LastMadeUpDate = "-";
        //     }
        // }

        // if (this.companyDetails.pin && this.companyDetails.pin.compnay_location) {
        //     this.lat = this.companyDetails.pin.compnay_location.lat;
        //     this.lng = this.companyDetails.pin.compnay_location.lon;
        // }

        if (this.companyDetails.landCorporateInfo) {
            for (let i = 0; i < this.companyDetails.landCorporateInfo.length; i++) {
                this.companyDetails.landCorporateInfo[i] = Object.assign(this.companyDetails.landCorporateInfo[i], this.companyDetails.landCorporateInfo[i]._source);
                delete this.companyDetails.landCorporateInfo[i]._source;
            }
        }

        // if (this.companyDetails.pscData) {
        //     for (let i = 0; i < this.companyDetails.pscData.length; i++) {
        //         this.companyDetails.pscData[i]["pscAddress"] = this.companyDetails.pscData[i].address;
        //         if (!this.companyDetails.pscData[i].name) {
        //             this.companyDetails.pscData.splice(i, 1);
        //         }
        //     }
        // }

        // if (this.companyDetails.landCorporateInfo) {
        //     for (let i = 0; i < this.companyDetails.landCorporateInfo.length; i++) {
        //         if (this.companyDetails.landCorporateInfo[i].Date_Proprietor_Added && this.companyDetails.landCorporateInfo[i].Date_Proprietor_Added !== '')
        //             this.companyDetails.landCorporateInfo[i].Date_Proprietor_Added = this.companyDetails.landCorporateInfo[i].Date_Proprietor_Added;
        //     }
        // }

    }

    /**
     * @summary This method is for getting the company shareholding Data on the basis of company no./ companyRegistration No 
     *          which we getting by UrlParams or by companyData varible
     * Modified By: Deepak
     * Modified On: 09-11-2020 
     */
    getCompanyShareholdingsData() {

        this.shareHolderDetailsSummaryColumns = [
            { field: 'shareHoldingCompanyName', header: 'Company Name', width: '250px', textAlign: 'left' },
            { field: 'companyRegistrationNumber', header: 'Company Number', width: '140px', textAlign: 'right' },
            { field: 'shareHoldingCompanyStatus', header: 'Company Status', width: '150px', textAlign: 'center' },
            { field: 'shareType', header: 'Share Type', width: '170px', textAlign: 'left' },
            { field: 'currency', header: 'Currency', width: '150px', textAlign: 'left' },
            { field: 'numberOfSharesIssued', header: 'Share Count', width: '130px', textAlign: 'right' },
            { field: 'share_percent', header: '% of Total Share Count', width: '150px', textAlign: 'right' },
            { field: 'value', header: 'Nominal Value', width: '120px', textAlign: 'right' },
            { field: 'sic_code', header: 'Sic Code', width: '500px', textAlign: 'left' },

        ];
        const shareholdingUrlPrams = new URLSearchParams(this.queryString);
        if ( shareholdingUrlPrams.get('type') !== undefined &&  shareholdingUrlPrams.get('type') !== null ) {
            
            this.shareholderLink = this.activeRoute.snapshot.params['companyNo'];

        } else {
            this.shareholderLink = this.companyData.companyRegistrationNumber;
        }

        //this service used to get the Details of shares which is holding by company
        let reqobj = [ this.shareholderLink ]
        this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_COMPANY_DETAILS', 'companyShareHoldings', reqobj ).subscribe( res => {
            if (res.body['status'] == 200) {

                this.shareholderDetailData = JSON.parse(JSON.stringify(res.body['results']));
                this.shareholderDetailData = this.formatShareHoldingData(this.shareholderDetailData);
                // this.shareholderDetailData = this.shareholderDetailData;
                this.shareholdingsTab = true; //this boolean var responsible for showing tab in company details page
                this.sharedLoaderService.hideLoader();

            }
            if(this.shareholderDetailData.shareholdings && this.shareholderDetailData.shareholdings.length > 0 ) {

                for(let companyShareholdings of this.shareholderDetailData.shareholdings) {

                    this.shareHolderDetailsSummaryColumnsData.push(companyShareholdings);
                    
                    if( companyShareholdings["companyInformation"]["businessName"] !== null || companyShareholdings["companyInformation"]["businessName"] !== undefined || companyShareholdings["companyInformation"]["companyStatus"] !== null || companyShareholdings["companyInformation"]["companyStatus"] !== undefined ) {

                        companyShareholdings['shareHoldingCompanyName'] = companyShareholdings["companyInformation"]["businessName"];
                        companyShareholdings['shareHoldingCompanyStatus'] = companyShareholdings["companyInformation"]["companyStatus"];
                    }
                }
                
                this.shareHoldingData["companyName"] = this.shareholderDetailData["businessName"];
                this.shareHoldingData["companyNumber"] = this.shareholderDetailData["companyRegistrationNumber"];
                this.shareHoldingData["companyRegDate"] = this.shareholderDetailData["companyRegistrationDate"];
                this.shareHoldingData["companyStatus"] = this.shareholderDetailData["companyStatus"];
                this.shareHoldingData["companyType"] = this.shareholderDetailData["companyType"];
                this.shareHoldingData["companySicCode"] = this.shareholderDetailData["sicCode07"];
            }
        })
        
        
    }

    directorsAge(date_of_birth) {
        return this.commonService.directorsAge(date_of_birth);
    }

    pscAddress(data) {
        return this.commonService.pscAddress(data);
    }

    formatDirectorAddress(data) {
        return this.commonService.formatDirectorAddress(data);
    }

    calculateAge(dob) {
        return this.commonService.calculateAge(dob);
    }

    getSICCodeInArrayFormat(SICCode) {
        return this.commonService.getSICCodeInArrayFormat(SICCode);
    }

    formatDate(date) {
        return this.commonService.formatDate(date);
    }

    calculateAccountOverduePeriod( overdueDate ) {
        let todayDate = new Date(),
            dueDate = this.commonService.changeToDate( overdueDate );
        
        return todayDate > dueDate;
    }

    calculateDays( inputDate ) {
        let todayDate = new Date(),
            dueDate = this.commonService.changeToDate( inputDate ),
            diffInTime, diffInDays;

        if ( todayDate > dueDate ) {
            diffInTime = todayDate.getTime() - dueDate.getTime(),
            diffInDays = diffInTime / ( 1000 * 3600 * 24 );
        }

        return Math.round( diffInDays );
    }
    
    parseDate(date) {
        return this.commonService.parseDate(date);
    }

    formatDirectorName(name) {
        return this.commonService.formatDirectorName(name);
    }
  
    formatCompanyAddress(address) {
        if (address === undefined) {
            return address;
        } else if (address === null) {
            return address;
        } else {
            return this.commonService.formatCompanyAddress(address);
        }
    }

    fetchWatchList() {
        let obj = {
            userid: this.userDetails?.dbID,
            companyNumber: this.companyDetails.companyRegistrationNumber,
            companyName: this.companyDetails.businessName
        }
        this.globalServerCommunication.globalServerRequestCall('post', 'DG_LIST', 'checkCompanyInWatchList', obj ).subscribe( res => {
            let data = res.body;
                       if (data.status == 200) {
                if (data['results'] == true) {
                    this.watchListStatus = data['results'];
                                      
                }
            }
        })
    }

    removeFromWatchList() {
        let obj = {
            userid: this.userDetails?.dbID,
            companyNumber: this.companyDetails.companyRegistrationNumber,
            companyName: this.companyDetails.businessName
        }
        this.globalServerCommunication.globalServerRequestCall('post', 'DG_LIST', 'removeFromWatchList', obj ).subscribe( res => {
            let data = res.body;
            if (data.status == 200) {
                this.watchListStatus = false;
                this.msgs = [{ severity: 'success', detail: 'You just removed this company from your Company Monitor'}];
                setTimeout(() => {
                this.msgs = [];
            }, 2000);
            } 
        })
    }

    saveWatchList() {

        if ( this.isLoggedIn ) {

            if ( this.userAuthService.hasFeaturePermission( 'Company Monitor' ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {

                let obj = {
                    userid: this.userDetails?.dbID,
                    companyNumber: this.companyDetails.companyRegistrationNumber,
                    companyName: this.companyDetails.businessName
                }
                this.globalServerCommunication.globalServerRequestCall('get', 'DG_LIST', 'getUserExportLimit' ).subscribe( res => {
                    let userData = res.body.results[0];
                    if(userData && userData.companyMonitorLimit > 0) {
                        this.globalServerCommunication.globalServerRequestCall('post', 'DG_LIST', 'saveWatchListCompanies', obj ).subscribe( res => {
                            let data = res.body;
                            if(data.status == 200){
                                this.msgs.push({ severity: 'success', detail: 'Company added to your Company Monitor'});
                                setTimeout(() => {
                                    this.msgs = [];
                                }, 2000);
                            }
                        this.watchListStatus = true;
                        let companyMonitorLimit = userData.companyMonitorLimit - 1;
                        this.reduceExportLimit(companyMonitorLimit, "detailsPage");
                        });
                    } else {
                        this.msgs.push({ severity: 'info', detail: 'No available Limit to add company in monitor!!' });
                        setTimeout(() => {
                            this.msgs = [];
                        }, 2000);
                    }
                });

            } else {
                this.showUpgradePlanDialog = true;
            }

        } else {
            this.showLoginDialog = true;
        }

    }
   
    linkedinURLForCompany(companyName) {
        return this.commonService.linkedinURLForCompany(companyName);
    }

    GoogleURLCompanyURL(companyName) {
        return this.commonService.GoogleURLCompanyURL(companyName);
    }
    
    GoogleURLCompanyURLwithoutWordCompany(companyName) {
        return this.commonService.GoogleURLCompanyURLwithoutWordCompany(companyName);
    }

    onUpdateInfo() {
        this.showOrHideContactInfoModal = true;
        if (this.companyDetails.companyContactInformation && this.companyDetails.companyContactInformation.length > 0 && this.companyDetails.companyContactInformation[0].website) {
            this.domain = this.companyDetails.companyContactInformation[0].website;
        } else {
            this.domain = this.companyDetails.RegAddress_Modified && this.companyDetails.RegAddress_Modified.website ? this.companyDetails.RegAddress_Modified.website : "";
        }
        this.email_address = this.companyDetails.companyContactInformation[0].email_gen1 || "";
        this.linkedin_profile = this.companyDetails.companyContactInformation && this.companyDetails.companyContactInformation.length > 0 && this.companyDetails.companyContactInformation[0].linkedin_url ? this.companyDetails.companyContactInformation[0].linkedin_url : "";
        if(this.companyDetails.companyContactInformation && this.companyDetails.companyContactInformation.length > 0 &&  this.companyDetails.companyContactInformation[0].tel_1) {
            this.contact_number = this.companyDetails.companyContactInformation[0].tel_1;
        } else {
            this.contact_number = this.companyDetails.RegAddress_Modified && this.companyDetails.RegAddress_Modified.telephone ? this.companyDetails.RegAddress_Modified.telephone : ""; 
        }
    }

    onUpdateInformation() {
        let obj = {
            userid: this.userDetails?.dbID,
            companyNumber: this.companyDetails.companyRegistrationNumber,
            company_name: this.companyDetails.businessName,
            domain: this.domain,
            email_address: this.email_address,
            contact_number: this.contact_number,
            linkedin_profile: this.linkedin_profile
        }
        this.showOrHideContactInfoModal = false;
        this.globalServerCommunication.globalServerRequestCall('post', 'DG_HELPDESK', 'suggestRequest', obj ).subscribe( res => {
            let data = res.body;
            if (data) {
                if(data.status === 201) {
                    this.msgs.push({ severity: 'info', summary: 'Already a suggestion for this company is there.', detail: '' });    
                }
                else {
                    this.msgs.push({ severity: 'success', summary: 'Confirmed', detail: 'Your data sent to the Admin for verification.' });
                }
                setTimeout(() => {
                    this.msgs = [];
                    this.domain = undefined;
                    this.email_address = undefined;
                    this.contact_number = undefined;
                    this.linkedin_profile = undefined;
                }, 2000);
            }
        });
    }

    
    onDirectorUpdateInfo(dirDetailData) {

        if ( this.isLoggedIn ) {
            this.showOrHideDirectorContactInfoModal = true;
            this.directorDataInfoObj.companyNumber = dirDetailData.CompanyNumber;
            this.directorDataInfoObj.userId = this.userDetails?.dbID;
            this.directorDataInfoObj.companyName = dirDetailData.CompanyOriginalName;
            this.directorDataInfoObj.directorPNR = dirDetailData.directorData.directorPnr;
            this.directorDataInfoObj.directorEmail = dirDetailData.directorData.email && dirDetailData.directorData.email != "-" ? dirDetailData.directorData.email : "";
            this.directorDataInfoObj.directorJobTitle = dirDetailData.directorData.jobTitle && dirDetailData.directorData.jobTitle != "-" ? dirDetailData.directorData.jobTitle : "";
            this.directorDataInfoObj.directorTelephone = dirDetailData.directorData.tel_1 && dirDetailData.directorData.tel_1 != "-" ? dirDetailData.directorData.tel_1 : "";
            this.directorDataInfoObj.directorLinkedin = this.directorContactsData?.linkedin_url ? this.directorContactsData.linkedin_url : "";
            this.directorDataInfoObj.directorFirstName = dirDetailData.directorData.detailedInformation.forename ? dirDetailData.directorData.detailedInformation.forename : "";
            this.directorDataInfoObj.directorMiddleName = dirDetailData.directorData.detailedInformation.middleName ? dirDetailData.directorData.detailedInformation.middleName : "";
            this.directorDataInfoObj.directorLastName = dirDetailData.directorData.detailedInformation.surname ? dirDetailData.directorData.detailedInformation.surname : "";
        } else {
            this.showLoginDialog = true;
        }

    }
    
    onDirectorUpdateInformation() {        
        this.showOrHideDirectorContactInfoModal = false;   
        if ( this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
            this.directorDataInfoObj["isAdmin"] = true;
            
            this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_HELPDESK', 'updateDirectorContactInfoData', this.directorDataInfoObj ).subscribe( res => {
            
				if (res.body.status === 200) {
					this.msgs = [];
					this.msgs.push({ severity: 'success', summary: "Director contact information Updated!!" });
                    let reqobj = [ this.directorDataInfoObj.companyNumber ];
                    this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'indexCompany', reqobj ).subscribe( res => {
								if (res.status == "200 ") {
									this.msgs = [];
									this.msgs.push({ severity: 'success', summary: "Company Indexing Started" })
								} else {
									this.msgs = [];
									this.msgs.push({ severity: 'success', summary: "Could Not Start Company Indexing" })
								}
							},
							err => {
								this.msgs = [];
								this.msgs.push({ severity: 'success', summary: "Could Not Start Company Indexing" })
							})
                    setTimeout(() => {
                        this.msgs = [];
                    }, 3000);

                    setTimeout(() => {
                        const currentUrl = this.router.url;
                        /*
                            Do not enable the below code before discussing with Akmal.
                            It reloads the `AppMainComponent`, which is the main
                            layout container and parent for all of the Components/Modules.
                            ===============================================================
                            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                            ===============================================================
                        */
                        this.router.onSameUrlNavigation = 'reload';
                        this.router.navigate([currentUrl]);
                    }, 4000);

				} else {
					this.msgs = [];
					this.msgs.push({ severity: 'error', summary: "Director contact information not updated!!" });
					setTimeout(() => {
						this.msgs = [];
					}, 3000);
				}
			});

        } else {
            this.directorDataInfoObj["isAdmin"] = false;
            
            this.globalServerCommunication.globalServerRequestCall('post', 'DG_HELPDESK', 'directorSuggestRequest', this.directorDataInfoObj ).subscribe( res => {
                this.msgs = [];
                if (res.body) {
                    if(res.body.status === 201) {
                        this.msgs.push({ severity: 'info', summary: 'Already a suggestion for this director is there.', detail: '' });    
                    }
                    else {
                        this.msgs.push({ severity: 'success', summary: 'Confirmed', detail: 'Your data sent to the Admin for verification.' });
                    }
                    setTimeout(() => {
                        this.msgs = [];
                    }, 4000);
                }
            });
        }                 
    }

    addToFavouriteList() {

        if ( this.isLoggedIn ) {
            if (this.favouritesListId === undefined) {
                setTimeout(() => {
                    this.addToFavouriteList()
                }, 1000);
                return 
            }
            let obj = {
                companies: [{ "companyNumber": this.companyDetails.companyRegistrationNumber }],
                userId: this.userDetails?.dbID,
                _id: this.favouritesListId,
                listName: "Favourites"
            }
            this.favouriteListStatus = true;
            this.globalServerCommunication.globalServerRequestCall('post', 'DG_LIST', 'editListOrAddCompanies', obj ).subscribe( res => {
    
                this.msgs.push({ severity: 'success', detail: this.constantMessages['successMessage']['addedFavouriteSuccess'] });
                this.checkifFavouriteListIsOpenedOnBrowser();
                setTimeout(() => {
                    this.msgs = [];
                }, 2000);
    
            });

        } else {
            this.showLoginDialog = true;
        }
    }

    checkifFavouriteListIsOpenedOnBrowser() {
        const urlParams = new URLSearchParams(this.queryString);

        if(urlParams.get('cListId') !== undefined){

            if(urlParams.get('cListId') == this.favouritesListId) {

                let clistLength = +urlParams.get('cListLength') - 1;

                if ( !CustomUtils.isNullOrUndefined(urlParams.get('reload') ) ) {
                    this.router.navigate(['/company-search'], { queryParams: { cListId : this.favouritesListId, cListLength: clistLength  } });
                } else {
                    this.router.navigate(['/company-search'], { queryParams: { cListId : this.favouritesListId, cListLength: clistLength, reload : 'true'  } });
                }
            }

        }
        
    }

    fetchFavouritesData(cmpNo) {
        let obj = {
            userid: this.userDetails?.dbID,
            listName: "Favourites",
            companyNo: cmpNo
        }
        let reqobj = [ obj ];
        this.globalServerCommunication.globalServerRequestCall('get', 'DG_LIST', 'getUserFavouritesLists', reqobj ).subscribe( res => {

        let data = res.body;
            this.favouritesListId = data[0]._id;
            this.favouriteListStatus = data[0].companiesInList;
        });
    }

    goToTab( tabNameStr, parentIndx, targetTabView: TabView ) {
        let parentTabList = this.companyDetailsTabViewGroup.tabs,
            childTabList = [ ...this.overviewTabView.tabs, ...this.riskProfileTabView.tabs, ...this.financialTabView.tabs, ...this.directorShareholdersTabView.tabs ],
            tabExist = childTabList.filter( value => value['header'] == tabNameStr ),
            objToSetTab = { originalEvent: { target: { innerText: tabNameStr } } };

        if ( tabExist.length ) {
            
            for ( let parentTab of parentTabList ) {
                parentTab['selected'] = false;
            }
            
            parentTabList[ parentIndx ]['selected'] = true;

            for ( let tabs of targetTabView.tabs ) {
                tabs['selected'] = false;
            }

            for ( let tabs of targetTabView.tabs ) {
                if ( tabs['header'] == tabNameStr ) {
                    tabs['selected'] = true;
                }
            }

            this.setTabView( objToSetTab );

        }
        
        return;

    }

    async setTabView(event) {

        this.activeTabText = event.originalEvent.target.innerText;
            
        if ( (this.companyDocuments == undefined ) && ( this.activeTabText == "Documents" || this.activeTabText == "Lifeline" ) ) {
            // this.spinnerBoolean = true;
            this.sharedLoaderService.showLoader();
            this.getCompanyDocuments(this.companyData.companyRegistrationNumber);
        }
            
        if ( this.activeTabText == "News Feeds" ) {
            this.callNewsFeeds = true;
        }

        for ( let groupTabEl of this.companyDetailsTabViewGroup.tabs ) {

            if ( groupTabEl.selected ) {

                if ( groupTabEl.header == 'Overview' ) {
        
                    for ( let tabEl of this.overviewTabView.tabs ) {
            
                        if ( tabEl.selected ) {
                    
                            if ( (this.tradingAddressDetails == undefined) && tabEl.header == "Trading Address" ) {
                                this.sharedLoaderService.showLoader();
                                this.getTradingAddressDetails();
                            }
                    
                            if ( (this.groupStructureData == undefined ) && tabEl.header == "Group Structure" ) {
                                this.sharedLoaderService.showLoader();
                                this.getGroupStructure();
                            }
                    
                            if ( this.notesData == undefined && tabEl.header == "Notes" ) {
                                this.sharedLoaderService.showLoader();
                                this.getNotes();
                            }
                    
                            if ( tabEl.header == "Import and Export" && ( this.companyImportData == undefined || this.companyExportData == undefined ) ) {
                                this.sharedLoaderService.showLoader();
                                this.companyImportExportColumns = [
                                    { field: 'month', header: 'Month', width: '80px', textAlign: 'center' },
                                    { field: 'years_without_month', header: 'Year', width: '80px', textAlign: 'center' },
                                    { field: 'commodity_code', header: 'Commodity Code', width: '200px', textAlign: 'left' }
                                ]

                                let reqobj = [ this.companyData.companyRegistrationNumber ];
                                this.globalServerCommunication.globalServerRequestCall('get', 'DG_COMPANY_DETAILS', 'importExportData', reqobj ).subscribe( res => {
                                        let data = res.body;
                                        this.sharedLoaderService.hideLoader();
                                        if (data.status == 200) {
                                            this.companyExportData = data.companyExportData && data.companyExportData.length > 0 ? this.formatImportExportData(data.companyExportData) : undefined
                                            this.lastOneYearExports = data.companyExportData && data.companyExportData.length > 0 ? data.lastOneYearExports : "-"
                                            this.lastFiveYearExports = data.companyExportData && data.companyExportData.length > 0 ? data.lastFiveYearExports : "-"
                                            this.lastExportMonthYear = data.companyExportData && data.companyExportData.length > 0 ? data.lastExportMonthYear : "-"
                                            this.companyImportData = data.companyImportData && data.companyImportData.length > 0 ? this.formatImportExportData(data.companyImportData) : undefined
                                            this.lastOneYearImports = data.companyImportData && data.companyImportData.length > 0 ? data.lastOneYearImports : "-"
                                            this.lastFiveYearImports = data.companyImportData && data.companyImportData.length > 0 ? data.lastFiveYearImports : "-"
                                            this.lastImportMonthYear = data.companyImportData && data.companyImportData.length > 0 ? data.lastImportMonthYear : "-"
                                            this.formatImportExportData(this.companyExportData)
                                        }
                                    });
                            }
            
                            if ( ( this.similarCompaniesWithSameSiccodeDetails == undefined ) && tabEl.header == "Similar Companies" ) {
                                this.sharedLoaderService.showLoader();
                                this.getSimilarCompanies();
                            }
            
                        }
            
                    }
                    
                }
        
                if ( groupTabEl.header == 'Risk Profile' ) {
        
                    for ( let tabEl of this.riskProfileTabView.tabs ) {
            
                        if ( tabEl.selected ) {
                    
                            if ( tabEl.header == "Risk Summary" && this.companyRiskAssessmentAnalysisData == undefined ) {
                                if ( this.isLoggedIn ) {
                    
                                    if ( this.userAuthService.hasFeaturePermission('Risk Summary') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
                                        this.getRiskAssessmentAnalysisData();
                                    }
                                }
                            }
                    
                            if ( tabEl.header == "Company Events" && this.companyEventsData == undefined) {
                                this.companyEventsColumns = [
                                    { field: 'statusFiledDate', header: 'Event Filed Date', width: '120px', textAlign: 'center' },
                                    { field: 'registeredDate', header: 'Event Registered Date', width: '120px', textAlign: 'center' },
                                    { field: 'statusCodeDesc', header: 'Event Description', width: '200px', textAlign: 'left' }
                                ]
                                
                                this.sharedLoaderService.showLoader();
                                this.getCompanyEventsData();
                            }
                    
                            if ( tabEl.header == "Creditors" && this.creditorsInfoData == undefined ) {
                                if ( this.isLoggedIn ) {
                                    this.getCreditorsInfoData();
                                }
                            }
                            
                            if ( tabEl.header == "Bad Debts" && this.debtorsInfoData == undefined ) {
                                if ( this.isLoggedIn ) {
                                    this.getDebtorsInfoData();
                                }
                            }
                    
                            if ( (this.companyChargesData == undefined) && tabEl.header == "Charges") {
                                this.sharedLoaderService.showLoader();
                                this.getCompanyChargesData();
                            }
            
                        }
            
                    }
                    
                }
        
                if ( groupTabEl.header == 'Financial' ) {
        
                    for ( let tabEl of this.financialTabView.tabs ) {
            
                        if ( tabEl.selected ) {
                    
                            if ( [ 'Financial', 'Key Financials', 'Ratios', 'Z Score','CAGR' ].includes( tabEl.header ) ) {
                    
                                
                                for ( let finTab of this.financialTabView.tabs ) {
                                    if ( finTab.selected ) {
                                        this.financialsTabView = finTab.header;
                                    }
                                }
                            
                                if (this.financialsTabView == 'Z Score') {
                                    this.sharedLoaderService.showLoader();
                                    let reqobj = [ this.companyData.companyRegistrationNumber ]
                                    this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_RISK_ASSESMENT', 'debtorsDetailInfo', reqobj ).subscribe( res => {
                                        this.sharedLoaderService.hideLoader();
                                        this.zScoreData = res;
                                    })  
                                }

                                if (this.financialsTabView == 'CAGR') {
                                    this.sharedLoaderService.showLoader();
                                    let reqobj = [ this.companyData.companyRegistrationNumber ]
                                    this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_ISCORE', 'companyCagr', reqobj ).subscribe( res => {
                                        this.sharedLoaderService.hideLoader();
                                        this.CAGRdata = res;
                                    })  
                                }
                                
                                if ( this.financeData == undefined ) {
                                    this.sharedLoaderService.showLoader();
                    
                                    this.getFinancialData();
                                }
                            }
        
                            if ( (this.shareholderDetailData == undefined ) && tabEl.header == "Shareholdings") {
                                this.sharedLoaderService.showLoader();
                                this.getCompanyShareholdingsData();
                            }
                    
                            if ( (this.landCorporateInfo == undefined) && tabEl.header == "Corporate Land") {
                                this.sharedLoaderService.showLoader();
                                this.getLandCorporateData();
                            }
                    
                            if ( tabEl.header == "Business Valuation") {
                    
                                if ( this.isLoggedIn ) {
                                    this.sharedLoaderService.showLoader();
                                    this.getCompanyValuationsData();
                                }
                            }
                    
                            if ( (this.aquisitionMergerData == undefined) && tabEl.header == "Acquisition & Mergers") {
                                this.sharedLoaderService.showLoader();
                                this.getAquisitionMergersData();
                            }
                    
                            if ( tabEl.header == "Patent And Trade" && this.patentTradeData == undefined ) {
                                this.sharedLoaderService.showLoader();
                                this.getCompanyPatentData();
                            }
            
                        }
            
                    }
        
                }
        
                if ( groupTabEl.header == 'Directors/Shareholders' ) {
        
                    for ( let tabEl of this.directorShareholdersTabView.tabs ) {
            
                        if ( tabEl.selected ) {
                    
                            if ( this.directorData == undefined && [ "Directors" ].includes( tabEl.header ) && this.isLoggedIn ) {
                                this.getCompanyDirectorsData( this.companyData.companyRegistrationNumber );
                                // this.disqualifiedDirectorDetails();
                                this.deletedDirectorDetails();
                                this.exceptionDirectorDetails();
                            }
                    
                            if ( this.shareHolderData == undefined && tabEl.header == "Shareholders") {
                                this.sharedLoaderService.showLoader();
                                this.getShareHolderData();
                            }
                            
                            if ( tabEl.header == "Related Companies" || tabEl.header == "Related Directors" ) {
                                if (this.relCompAPICount == 0) {
                                    this.sharedLoaderService.showLoader();
                                    this.getRelatedCompaniesAndDirector( tabEl.header );
                                }
                            }
            
                        }
            
                    }
        
                }

            }

        }


        if ( window.innerWidth <= 1024 ) {

            let toggleButtonElm = document.querySelector('.tabsToggleButtonWrapper'),
                tabNavElm = document.querySelector('.ui-tabview-nav');

            if ( tabNavElm.classList.contains( 'expanded' ) ) {
                toggleButtonElm.classList.remove( 'tabsMenuExpaned' );
                tabNavElm.classList.remove( 'expanded' );
            }

        }
    }

    showDetails(label){
        if (label == 'Group Companies Insolvency') {
            // this.groupCompanyInsolvencyLoader = true;
            this.sharedLoaderService.showLoader();
            let reqobj = [ this.companyData.companyRegistrationNumber ]
            this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_RISK_ASSESMENT', 'riskAssesmentData', reqobj ).subscribe( res => {
                this.companyRiskAssessmentAnalysisData['groupcompaniesBankruptcyDetails'] = res.body.results;
            });
        }
        if (label == 'Related Companies Insolvency') {
            // this.relatedCompanyInsolvencyLoader = true;
            this.sharedLoaderService.showLoader();
            let reqobj = [ this.companyData.companyRegistrationNumber ]
            this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_RISK_ASSESMENT', 'riskAssesmentData', reqobj ).subscribe( res => {
                this.companyRiskAssessmentAnalysisData['relatedBankruptcyDetails'] = res.body.results;
            });
        }
        
    }

    getRiskAssessmentAnalysisData() {

        this.sharedLoaderService.showLoader();

        let reqobj = {
            planId:  this.companyData.companyRegistrationNumber 
        };
        this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_RISK_ASSESMENT', 'riskAssesmentData', reqobj ).subscribe( res => {
            if ( res['status'] == 200 ) {
                this.companyRiskAssessmentAnalysisData = res['result'];
            }
        });

    }

    modifyGridLayoutMasonry() {

        setTimeout(() => {
            
            // this.commonService.modifyGridLikeMasonry( Grid Selector, No of Cols on -xl screen, No of Cols on -lg screen, No of Cols on -md screen, No of Cols on -sm screen );
            this.commonService.modifyGridLikeMasonry( '.masonryGridContainer1', 4, 3, 2, 1 );
            this.commonService.modifyGridLikeMasonry( '.masonryGridContainer2', 2, 2, 1, 1 );
    
            this.sharedLoaderService.hideLoader();
            // this.groupCompanyInsolvencyLoader = false;
            this.sharedLoaderService.hideLoader();
            // this.relatedCompanyInsolvencyLoader = false;
            this.sharedLoaderService.hideLoader();
            
        }, 0);
        
    }

    showAddNoteModal(data) {

        if ( this.isLoggedIn ) {

            if ( this.userAuthService.hasFeaturePermission( 'Company Notes' ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {

                // if(this.currentPlan == this.freePlanId){
                //     this.hideAddNoteModalBool = true;
                // }else {
                    // this.hideAddNoteModalBool = false;
                        if (data !== undefined) {
                            this.companyNoteValue = data.notes;
                            this.notesId = data._id;
                            this.showAddNoteModalBool = true;
                        }
                        else {
                            this.showAddNoteModalBool = true;
                        }
                // }
            } else {
                this.showUpgradePlanDialog = true;
            }

        } else {
            this.showLoginDialog = true;
        }
        
    }

    addNotes() {

        if ( this.isLoggedIn ) {
            
            let obj = {
                userid: this.userDetails?.dbID,
                notes: this.companyNoteValue,
                companyNumber: this.companyDetails.companyRegistrationNumber,
                CompanyNameOriginal: this.companyDetails.businessName
            }
            if (this.notesId !== undefined) {
                obj['notesId'] = this.notesId;
                this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'updateNotesCompany', obj ).subscribe( res => {
                    if (res.body.status == 200) {
                        this.companyNoteValue = '';
                        this.notesId = undefined;
                        this.showAddNoteModalBool = false;
                        this.getNotes();
                    }
                });
            }
            else {
                obj["updatedOn"] = new Date().toISOString();
                this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'getNotes', obj ).subscribe( res => {
                    if (res.body.status == 200) {
                        this.companyNoteValue = '';
                        this.showAddNoteModalBool = false;
                        this.getNotes();
                    }
                });
            }

        } else {
            this.showLoginDialog = true;
        }

    }

    getNotes() {
        let obj = {
            userid: this.userDetails?.dbID,
            companyNumber: this.companyDetails.companyRegistrationNumber
        }
       
        this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'getNotes', obj).subscribe(res => {
            this.sharedLoaderService.hideLoader();
            if( res.body['status'] == 200) {
                this.notesData = res.body['results'];
            }     
        });
    }

    removeFromFavouriteList() {
        let obj = {
            CompanyNumber: this.companyDetails.companyRegistrationNumber,
            listId: this.favouritesListId,
        }
        this.favouriteListStatus = false;

        this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'deleteCompaniesFromList', obj ).subscribe( res => {
            if (res.body.status == 200) {
                this.isFavourite = false;
                this.msgs = [{ severity: 'success', detail: this.constantMessages['successMessage']['removeFavouriteSuccess'] }];
                this.checkifFavouriteListIsOpenedOnBrowser();
                setTimeout(() => {
                    this.msgs = [];
                }, 2000);
            }
        });
    }

    deleteNotes() {
        if (this.notesId !== undefined) {
            var notesID = this.notesId
        }
        let obj = {
            notesId: notesID
        }
        this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'deleteNotesCompany', obj ).subscribe( res => {
            if (res.body.status == 200) {
                this.companyNoteValue = '';
                this.showAddNoteModalBool = false;
                this.getNotes();
                this.notesId = undefined;
            }
        })

    }

    getFinancialData() {
        let reqobj = [ this.companyData.companyRegistrationNumber ]
        this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_COMPANY_DETAILS', 'statutoryAccountsNew', reqobj ).subscribe( res => {
            this.sharedLoaderService.hideLoader();
            if (res.body.status == 200) {
                this.financeData = JSON.parse(JSON.stringify(res.body['results']));
                let tempArr = this.financeData;
                
                this.financeDataSorted = tempArr.sort((a, b) => a.group < b.group ? -1 : a.group > b.group ? 1 : 0);
            }
        });
    }

    cancelNotes() {
        this.companyNoteValue = '';
    }

    formatCompanyNameForUrl(companyName) {
        return this.commonService.formatCompanyNameForUrl(companyName);
    }

    formatWebsite(websiteParam) {
        
        if(!CustomUtils.isNullOrUndefined(websiteParam)) {
            let website = websiteParam;
            website = website.replace('https://', '');
            website = website.replace('http://', '');
            website = website.replace('www.', '');
            return website.toLowerCase();
        }
        else return ""
    }

    formatDirectorNameForUrl(directorName) {
        return this.commonService.formatDirectorNameForUrl(directorName);
    }

    realTimeCompanyUpdate() {

        if ( this.isLoggedIn ) {

            if ( this.companyDetails !== undefined ) {
                if ( this.companyDetails.companyRegistrationNumber !== undefined ) {
                    let reqobj = [ this.companyDetails.companyRegistrationNumber.toString().toUpperCase() ];
                    this.globalServerCommunication.globalServerRequestCall('get', 'DG_REAL_TIME', 'realTimeCompany', reqobj ).subscribe( res => {
                        if(res.body['status'] == 200) {
                            this.ngOnInit();
                        }
                    });
                }
            }

        } else {
            this.showLoginDialog = true;
        }

    }

    getRelatedCompaniesAndDirector(tabName) {
        let pageName;
        if(tabName === "Related Companies") {
            pageName = "relatedCompanies"
        }
        if(tabName === "Related Directors") {
            pageName = "relatedDirectors"
        }
        
        this.relCompDirDataValueStatus = true;
        this.relatedDirectorsAndCompaniesCount = 0;

        let reqobj = {
            "cmpNo": this.companyData.companyRegistrationNumber,
            'pageName': pageName,
        }
        this.globalServerCommunication.globalServerRequestCall('post', 'DG_API', 'relatedCompaniesAndDirectorsByCmpNoTableData', reqobj ).subscribe( res => {
            let data = res.body;

            this.sharedLoaderService.hideLoader();
            if (data['status'] == 200) {

                this.showExportButton = false;
                this.sampleLrmPdf = false;
                this.relCompDirDataValueStatus = false;
                if(data['result'].relatedCompanies) {
                    this.relatedCompanies = data['result'].relatedCompanies;
                    this.relatedDirectors = [];
                }
                if(data['result'].relatedDirectors) {
                    this.relatedDirectors = data['result'].relatedDirectors;
                    this.relatedCompanies = [];
                } else  {
                    this.relCompDirDataValueStatus = false;
                }

                this.relatedDirectorsAndCompaniesCount = data['totalLength'];

                if (this.relatedDirectors === undefined) {
                    this.relatedDirectors = [];
                    this.showExportButton = true;
                    this.sampleLrmPdf = true;
                    this.relCompDirDataValueStatus = false;
                }
                if (this.relatedCompanies === undefined){
                    this.relatedCompanies = [];
                    this.showExportButton = true;
                    this.sampleLrmPdf = true;
                    this.relCompDirDataValueStatus = false;
                }
                
            }
            else if (data['status'] == 404){
                this.showExportButton = true;
                this.sampleLrmPdf = true;
                this.relatedCompanies = [];
                this.relatedDirectors = [];
                this.relCompDirDataValueStatus = false;
            }
        })
        // this.relCompAPICount = 1
    }

    onClickDownload(description, document_metadata) {

        if ( this.isLoggedIn ) {

            let document_name: string = description + this.companyDetails.companyRegistrationNumber + ".pdf";
    
            if ( ( ( [ this.subscribedPlanModal['Monthly_Expand'], this.subscribedPlanModal['Expand_Annual_One_Year'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Expand_Annual_Two_Year'], this.subscribedPlanModal['Expand_New_Monthly'], this.subscribedPlanModal['Monthly_Expand_Paid_Test'],this.subscribedPlanModal['Monthly_Expand_Trial'],this.subscribedPlanModal['Expand_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Expand'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Compliance_Plan'] ].includes( this.userDetails?.planId ) && this.userDetails?.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) ) {
    
                let obj = {
					metadata: document_metadata + '/content',
					doc_name: document_name
				};

				this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_API', 'getDocument', obj ).subscribe( res => {
                        if ( res.status === 200 ) {
                            if ( res.body["document_url"] ) {
                                let url: string = res.body["document_url"];
                                this.downloadDocument( url, document_name );
                            }
                        }
                    },
                    error => {
                        console.log( error );
                    }
                );
    
            } else {
                event.preventDefault();
                event.stopPropagation();
                this.showUpgradePlanDialog = true;
            }

        } else {
            this.showLoginDialog = true;
        }
        
    }

    downloadDocument(document_url, document_name) {
        var link = document.createElement('a');
        link.href = document_url;
        link.download = document_name;
        link.click();
    }

    getMessage(event) {

        if( event.status !== undefined && event.msgs !== undefined ) {

            this.msgs = [];

            this.msgs.push({ severity: event.status, summary: event.msgs });
            
            setTimeout(() => {
                this.msgs = [];
            }, 4000);

        }
        
    }
    
    getFinancialOverviewDetails(data) {
        let finOverviewDataValues = data;
        let chartData: any = undefined;
        let finOverviewChartYears = [];

        finOverviewDataValues = finOverviewDataValues.sort((a, b) => {
            let prevDate: any = this.commonService.changeToDate(a.yearEndDate),
                newDate: any = this.commonService.changeToDate(b.yearEndDate);
            return prevDate - newDate;
        });
        let overviewTurnoverData = [],
            overviewTotalAssetsData = [],
            overviewTotalLiabilitiesData = [],
            overviewNetWorthData = [],
            overviewNetAsstesData = [],
            overviewProfitBeforeTax = [],
            overviewEBITDA = [],
            overviewNoOfEmployeesData;

        for (let finOverData of finOverviewDataValues) {
            let finYear = new Date(this.commonService.changeToDate(finOverData.yearEndDate)).getFullYear();
            finOverviewChartYears.push(finYear);
            let EBITDA = 0;
            if(finOverData.turnover === 0 || finOverData.turnover === null) {
                this.estimatedTurnoverBoolean = true;
                overviewTurnoverData.push(finOverData.estimated_turnover ? finOverData.estimated_turnover : 0);
            } else {
                this.estimatedTurnoverBoolean = false;
                overviewTurnoverData.push(finOverData.turnover ? finOverData.turnover : 0);
            }
            overviewTotalAssetsData.push(finOverData.totalAssets ? finOverData.totalAssets : 0);
            overviewTotalLiabilitiesData.push(finOverData.totalLiabilities ? finOverData.totalLiabilities : 0);
            overviewNetWorthData.push(finOverData.netWorth ? finOverData.netWorth : 0);
            overviewNetAsstesData.push(finOverData.netAssets ? finOverData.netAssets : 0);
            overviewProfitBeforeTax.push(finOverData.profitBeforeTax ? finOverData.profitBeforeTax : 0);
            EBITDA = finOverData.EBITDA ? finOverData.EBITDA : 0 ;
            overviewEBITDA.push(EBITDA);
            overviewNoOfEmployeesData = finOverData.numberOfEmployees ? finOverData.numberOfEmployees : 0;
        }        
        chartData = {
            labels: finOverviewChartYears,
            datasets: [
                {
                    label:  this.estimatedTurnoverBoolean ? 'Turnover (Estimate +)' : 'Turnover',
                    data: overviewTurnoverData,
                    fill: false,
                    borderColor: '#5b9bd5'
                },
                {
                    label: 'Total Assets',
                    data: overviewTotalAssetsData,
                    fill: false,
                    borderColor: '#ffc000'
                },
                {
                    label: 'Total Liabilities',
                    data: overviewTotalLiabilitiesData,
                    fill: false,
                    borderColor: '#ed7d31'
                },
                {
                    label: 'Net Worth',
                    data: overviewNetWorthData,
                    fill: false,
                    borderColor: '#60af60'
                },
                {
                    label: 'Profit Before Tax',
                    data: overviewProfitBeforeTax,
                    fill: false,
                    borderColor: '#ff69B4'
                },
                {
                    label: 'EBITDA',
                    data: overviewEBITDA,
                    fill: false,
                    borderColor: '#87ff00'
                }
            ]

        };
        return {
            "chartData": chartData,
            "overviewTurnoverData": overviewTurnoverData,
            "overviewTotalAssetsData": overviewTotalAssetsData,
            "overviewTotalLiabilitiesData": overviewTotalLiabilitiesData,
            "overviewNetWorthData": overviewNetWorthData,
            "overviewNetAsstesData": overviewNetAsstesData,
            "overviewProfitBeforeTax": overviewProfitBeforeTax,
            "finOverviewDataValues": finOverviewDataValues,
            "overviewEBITDA": overviewEBITDA,
            "overviewNoOfEmployeesData": overviewNoOfEmployeesData
        };

    }

    // For Financial Ratio Table Data Start

    getFinancialRatioData(data) {
            this.finRatioDataValues = data;

            let finRatioChartYears = [];

            this.finRatioDataValues = this.finRatioDataValues.sort( (a, b) => {
                let prevDate: any = this.commonService.changeToDate(a.yearEndDate),
                    newDate: any = this.commonService.changeToDate(b.yearEndDate);
                    
                return prevDate - newDate;
            });

            for ( let finOverData of this.finRatioDataValues ) {
                let finYear = new Date(this.commonService.changeToDate(finOverData.yearEndDate)).getFullYear();

                finRatioChartYears.push( finYear );
                
                this.currentRatioChartData.push( finOverData.currentRatio ? finOverData.currentRatio : 0 );
                this.totalDebtRatioChartData.push( finOverData.totalDebtRatio ? finOverData.totalDebtRatio : 0 );
                this.equityRatioChartData.push( finOverData.equityInPercentage ? finOverData.equityInPercentage : 0 );
                this.creditorDaysChartData.push( finOverData.creditorDays ? finOverData.creditorDays : 0 );
            }

            this.finRatioChartData = {
                labels: finRatioChartYears,
                datasets: [
                    {
                        label: 'Current Ratio',
                        data: this.currentRatioChartData,
                        fill: false,
                        borderColor: '#ffc000'
                    },
                    {
                        label: 'Total Debt Ratio',
                        data: this.totalDebtRatioChartData,
                        fill: false,
                        borderColor: '#5b9bd5'
                    },
                    {
                        label: 'Creditor Days',
                        data: this.creditorDaysChartData,
                        fill: false,
                        borderColor: '#60af60'
                    },
                    {
                        label: 'Equity Ratio',
                        data: this.equityRatioChartData,
                        fill: false,
                        borderColor: '#ed7d31'
                    }
                ]

            };

            this.chartOptions2 = {
                legend: {
                    labels: {
                        fontFamily: 'Roboto',
                        padding: 15
                    }
                },
                title: {
                    fontFamily: 'Roboto',
                },
                tooltips: {
                    titleFontFamily: 'Roboto',
                    bodyFontFamily: 'Roboto'
                },
                scales: {
                    x: {
                        ticks: {
                            fontFamily: 'Roboto',
                            padding: 8
                        }
                    },
                    y: {
                        ticks: {
                            fontFamily: 'Roboto',
                            padding: 8,
                            beginAtZero: true,
                            callback: (label, index, labels) => {
                                // return Number( label );
                                return Intl.NumberFormat().format(label);
                            }
                        }
                    }
                },
                plugins: {
                    datalabels: {
                        display: false
                    }
                }
            }

            this.finRatioTabChartData.chartData1 = {
                labels: finRatioChartYears,
                datasets: [
                    {
                        label: 'Current Ratio',
                        data: this.currentRatioChartData,
                        fill: 'origin',
                        backgroundColor: 'rgba(255, 192, 0, 0.4)',
                        borderColor: '#ffc000'
                    },
                    {
                        label: 'Total Debt Ratio',
                        data: this.totalDebtRatioChartData,
                        fill: 'origin',
                        backgroundColor: 'rgba(91, 155, 213, 0.4)',
                        borderColor: '#5b9bd5'
                    }
                ]

            };

            this.finRatioTabChartData.chartData2 = {
                labels: finRatioChartYears,
                datasets: [
                    {
                        label: 'Creditor Days',
                        data: this.creditorDaysChartData,
                        fill: 'origin',
                        backgroundColor: 'rgba(96, 175, 96, 0.4)',
                        borderColor: '#60af60'
                    },
                    {
                        label: 'Equity Ratio',
                        data: this.equityRatioChartData,
                        fill: 'origin',
                        backgroundColor: 'rgba(237, 125, 49, 0.4)',
                        borderColor: '#ed7d31'
                    }
                ]

            };

            let tempfinRatioDataValues = [...this.finRatioDataValues]
            this.finRatioDataValues = []
            tempfinRatioDataValues.forEach(ratioData => {
                let {startDate,startMonth,startYear,endDate,endMonth,endYear, ...tempRatioData} = ratioData
                this.finRatioDataValues.push(tempRatioData)
            });
        // });
    }

    // For Financial Ratio Table Data End

    getExactCCJData(data) {
        this.exactCCJData = data;
        
        this.exactCCJData = this.exactCCJData.map((obj) => {
            obj.ccjDate = this.commonService.changeToDate(obj.ccjDate);
            return obj;
        });
        //date sorting
        this.exactCCJData = this.exactCCJData.sort((a, b): any => {
            let prevDate: any = a.ccjDate,
                newDate: any = b.ccjDate;
            if (prevDate < newDate) return 1;
            if (prevDate > newDate) return -1;
        });
        // 
        this.exactCCJDataColumn = [
            { field: 'ccjDate', header: 'Date', width: '120px', textAlign: 'center' },
            { field: 'court', header: 'Court', width: '250px', textAlign: 'left' },
            { field: 'ccjAmount', header: 'Amount', width: '110px', textAlign: 'right' },
            { field: 'ccjStatus', header: 'Status', width: '110px', textAlign: 'center' },
            { field: 'caseNumber', header: 'Case Number', width: '120px', textAlign: 'center' },
            { field: 'ccjPaidDate', header: 'Date Paid', width: '120px', textAlign: 'center' }
        ];

        if ( this.exactCCJData && this.exactCCJData.length > 1 ) {
            this.totalCCJValue = this.exactCCJData.reduce( ( value1, value2 ) => ( value1.ccjAmount ? value1.ccjAmount : value1 ) + value2.ccjAmount);
        } else if ( this.exactCCJData && this.exactCCJData.length == 1 ) {
            this.totalCCJValue = this.exactCCJData[0].ccjAmount;
        }
    }

    getPossibleCCJData() {
        if (this.companyData.possibleCCJDetails) {
            this.possibleCCJData = this.companyData.possibleCCJDetails;
            this.possibleCCJData = this.possibleCCJData.map((obj) => {
                obj.ccjDate = this.commonService.changeToDate(obj.ccjDate);
                return obj;
            })
            //date sorting
            this.possibleCCJData = this.possibleCCJData.sort((a, b): any => {
                let prevDate: any = a.ccjDate,
                    newDate: any = b.ccjDate;
                if (prevDate < newDate) return 1;
                if (prevDate > newDate) return -1;
            });
            this.possibleCCJDataColumn = [
                { field: 'ccjDate', header: 'Date', width: '120px', textAlign: 'center' },
                { field: 'court', header: 'Court', width: '280px', textAlign: 'left' },
                { field: 'ccjAmount', header: 'Amount', width: '110px', textAlign: 'right' },
                { field: 'ccjStatus', header: 'Status', width: '110px', textAlign: 'center' },
                { field: 'caseNumber', header: 'Case Number', width: '110px', textAlign: 'center' },
                { field: 'ccjPaidDate', header: 'Date Paid', width: '120px', textAlign: 'center' },
                { field: 'incomingRecordDetails', header: 'Registered CCJ Details', width: '280px', textAlign: 'left' }
            ];
        }
    }

    getShareHolderData() {
        let cmpNo = [ this.companyData.companyRegistrationNumber ];
        this.globalServerCommunication.globalServerRequestCall('get', 'DG_COMPANY_DETAILS', 'shareDetails', cmpNo ).subscribe( res => {
            this.sharedLoaderService.hideLoader();
            this.shareHolderData = res.body["results"];
            this.shareHolderDataColumn = [
                { field: 'shareHolderName', header: 'Name', width: '200px', textAlign: 'left' },
                { field: 'shareHolderAsCompanyStatus', header: 'Status', width: '100px', textAlign: 'center' },
                { field: 'shareType', header: 'Share Type', width: '130px', textAlign: 'left' },
                { field: 'currency', header: 'Currency', width: '150px', textAlign: 'left' },
                { field: 'numberOfSharesIssued', header: 'Share Count', width: '90px', textAlign: 'right' },
                { field: 'percentage_share', header: '% of Total Share Count', width: '140px', textAlign: 'right' },
                { field: 'value', header: 'Nominal Value', width: '90px', textAlign: 'right' }
            ];


            for(let shareHolder of this.shareHolderData) {

                let full_name = "";
                let shareholder_Address = "";

                if( shareHolder.share_holders_details.shareholderForename ) {

                    full_name = shareHolder.share_holders_details.shareholderForename;

                }
                if( shareHolder.share_holders_details.shareholderSurname ) {

                    full_name += ' ' + shareHolder.share_holders_details.shareholderSurname;
                    
                }
                if( shareHolder.share_holders_details.shareholderAddress1 ){
                    shareholder_Address += this.titlecasePipe.transform(shareHolder.share_holders_details.shareholderAddress1) + ', '
                }
                if( shareHolder.share_holders_details.shareholderAddress2 ){
                    shareholder_Address += this.titlecasePipe.transform(shareHolder.share_holders_details.shareholderAddress2)+ ', '
                }
                if( shareHolder.share_holders_details.shareholderAddress3 ){
                    shareholder_Address +=this.titlecasePipe.transform(shareHolder.share_holders_details.shareholderAddress3)+ ', '
                }
                if( shareHolder.share_holders_details.shareholderAddress4 ){
                    shareholder_Address +=this.titlecasePipe.transform(shareHolder.share_holders_details.shareholderAddress4)+ ', '
                }
                if( shareHolder.share_holders_details.shareholderAddress5 ){
                    shareholder_Address +=this.titlecasePipe.transform(shareHolder.share_holders_details.shareholderAddress5)+ ', '
                }
                if( shareHolder.share_holders_details.shareholderPostcode ){
                    shareholder_Address +=shareHolder.share_holders_details.shareholderPostcode.toUpperCase();
                }
                if (shareHolder["value"]) {
                    shareHolder["value"] = parseFloat(shareHolder["value"].toFixed(2));
                }

                shareHolder["full_name"] = full_name;
                shareHolder["shareholder_Address"] = shareholder_Address;
        
                let shareHolderNameObj = {
                    name: shareHolder.full_name,
                    link: shareHolder.share_holder_reg,
                }
        
                shareHolder['shareHolderName'] = shareHolderNameObj;
                shareHolder['shareHolderAsCompanyStatus'] = shareHolder['companyStatus'];
            }

        });
    }

    getCompanyCommentaryData(data){

        // let compNo = this.companyData.companyRegistrationNumber;
        // this.companyDetailsService.getCompanyCommentaryDetails(compNo).then(data => {

        this.companyCommentryData = data;
        this.commentry = this.companyCommentryData;
        this.companyCommentaryColumn = [
            { field: 'commentaryText', header: 'Commentary', width: '160px', textAlign: 'left' },
            { field: 'commentaryImpact', header: 'Impact', width: '40px', textAlign: 'center' },
            // { field: 'commentaryCode', header: 'Commentary Code', width: '50px', textAlign: 'center' },
            // { field: 'dateLogged', header: 'Logged Date', width: '50px', textAlign: 'center' }
        ];

        if ( this.companyCommentryData ) {

            for( let i= 0; i< this.companyCommentryData.length; i++ ) {
                if(this.companyCommentryData[i]["commentaryText"] !== null || this.companyCommentryData[i]["commentaryText"] !== "") {
                    this.companyCommentryData[i]['commentaryText'] = this.companyCommentryData[i]["commentaryText"].replace(/[!@#$%^&*()�,.?";:{}|<>]/g, "")
                }
            }
        }
    }

    getLandCorporateData() {
        let compNo = [ this.companyData.companyRegistrationNumber ];
        this.globalServerCommunication.globalServerRequestCall('get', 'DG_API', 'landCorporateData', compNo ).subscribe( res => {
            this.sharedLoaderService.hideLoader();

            if (res.body["status"] == 200) {
                this.landCorporateInfo = res.body['results'].map((obj) => obj._source);
            }
        });
    }

    getSafeAlertsData(data) {
        // let compno = this.companyData.CompanyNumber;
        // this.companyDetailsService.getSafeAlertsDetails(compno).then(data => {
        this.safeAlerts = data;
        this.safeAlertsColumn = [
            // { field: 'creditsafeGlobalId', header: 'Global ID', width: '120px', textAlign: 'center', verticalAlign: 'top' },
            { field: 'alertCode', header: 'Alert Code', width: '100px', textAlign: 'right', verticalAlign: 'top' },
            { field: 'alertCodeTitle', header: 'Alert Code Title', width: '140px', textAlign: 'left', verticalAlign: 'top' },
            { field: 'alertDate', header: 'Alert Date', width: '110px', textAlign: 'right', verticalAlign: 'center' },
            { field: 'safealertdescription', header: 'Description', width: '280px', textAlign: 'left' },
            // { field: 'alertDetail2', header: 'Detail 2', width: '120px', textAlign: 'center' },
            // { field: 'alertDetail3', header: 'Detail 3', width: '120px', textAlign: 'center' },
            // { field: 'alertDetail4', header: 'Detail 4', width: '120px', textAlign: 'center' },
            // { field: 'alertDetail5', header: 'Detail 5', width: '120px', textAlign: 'center' },
            // { field: 'alertDetail6', header: 'Detail 6', width: '120px', textAlign: 'center' },
            // { field: 'alertDetail7', header: 'Detail 7', width: '120px', textAlign: 'center' },
            // { field: 'alertDetail8', header: 'Detail 8', width: '120px', textAlign: 'center' },
            // { field: 'alertDetail9', header: 'Detail 9', width: '120px', textAlign: 'center' },
            // { field: 'alertDetail10', header: 'Detail 10', width: '120px', textAlign: 'center' },
            // { field: 'alertDetail11', header: 'Detail 11', width: '120px', textAlign: 'center' }  
        ];
        // })
    }

    getTradingAddressDetails(){

        let compNo = [ this.companyData.companyRegistrationNumber ];
        this.globalServerCommunication.globalServerRequestCall('get', 'DG_COMPANY_DETAILS', 'tradingAddressNew', compNo ).subscribe( res => {
        this.sharedLoaderService.hideLoader();
        
        this.tradingAddressDetails = res.body['results'];

            this.tradingAddressDetailsColumn = [
                // { field: 'addressNumber', header: 'Address Number', width: '60px', textAlign: 'left' },
                { field: 'tradingAddress1', header: 'Street', width: '200px', textAlign: 'left' },
                { field: 'tradingAddress2', header: 'Town or City', width: '190px', textAlign: 'left' },
                { field: 'tradingAddress3', header: 'County', width: '190px', textAlign: 'left' },
                { field: 'tradingAddress4', header: 'Secondary Name', width: '170px', textAlign: 'left' },
                { field: 'postalCode', header: 'Post Code', width: '140px', textAlign: 'left' },
                { field: 'tradingTelephone', header: 'Telephone Number', width: '130px', textAlign: 'right' },
                { field: 'tradingCTPSFlag', header: 'CTPS Registered', width: '130px', textAlign: 'center' },
                { field: 'tradingFlags', header: 'Additional Information', width: '140px', textAlign: 'left' }
            ];
    
            for(let tradingAddress of this.tradingAddressDetails ){
    
                if(tradingAddress["tradingSTDCode"] !== null || tradingAddress["telephone"] !== null) {
                    tradingAddress['tradingTelephone'] = tradingAddress["tradingSTDCode"] + ' ' + tradingAddress["telephone"];
                }
    
                let str = [];
    
                if(tradingAddress["registeredOfficeFlag"]) {
    
                    str.push(this.tradingAddressflagVal[0]["name"]);
    
                }
                if(tradingAddress["headOfficeFlag"]) {
    
                    str.push(this.tradingAddressflagVal[1]["name"]);
    
                }
                if(tradingAddress["accountantsAddressFlag"]) {
                    
                    str.push(this.tradingAddressflagVal[2]["name"]);
    
                }
                if(tradingAddress["solicitorsAddressFlag"]) {
                    
                    str.push(this.tradingAddressflagVal[3]["name"]);
    
                }
    
                tradingAddress["tradingFlags"] = str;
            }
        });
    }

    getSimilarCompanies() {

        let sicCode = [ this.companyData.primarySicCode07.code ];
        this.globalServerCommunication.globalServerRequestCall('get', 'DG_API', 'similarCompanies', sicCode ).subscribe( res => {
            let data = res.body;
            this.sharedLoaderService.hideLoader();
            if (data["results"] && data["results"].length > 0) {
                this.similarCompaniesWithSameSiccodeDetails = data['results'];

                this.similarCompaniesWithSameSiccodeDetails = this.similarCompaniesWithSameSiccodeDetails.sort((a, b): any => {
                    let prevDate: any = this.commonService.changeToDate(a.companyRegistrationDate),
                        newDate: any = this.commonService.changeToDate(b.companyRegistrationDate);
                    if (prevDate < newDate) return 1;
                    if (prevDate > newDate) return -1;
                });

                this.similarCompaniesWithSameSiccodeDetailsColumn = [
                    { field: 'businessName', header: 'Company Name', width: '350px', textAlign: 'left' },
                    { field: 'companyRegNumber', header: 'Company Number', width: '120px', textAlign: 'left' },
                    { field: 'similarCompanyStatus', header: 'Company Status', width: '130px', textAlign: 'center' },
                    // { field: 'companyType', header: 'Company Category', width: '200px', textAlign: 'left' },
                    { field: 'RegAddress', header: 'Registered Address', width: '500px', textAlign: 'left' },
                    { field: 'contactDetails', header: 'Website', width: '180px', textAlign: 'left' },
                    { field: 'netAssets', header: 'Net Assets', width: '140px', textAlign: 'right' },
                    { field: 'turnover_latest', header: 'Turnover', width: '140px', textAlign: 'right' }
                ];

                for (let val of this.similarCompaniesWithSameSiccodeDetails) {
                    if (val.statutoryAccounts) {

                        val.statutoryAccounts = val.statutoryAccounts.sort((a, b): any => {
                            let prevDate: any = this.commonService.changeToDate(a.yearEndDate),
                                newDate: any = this.commonService.changeToDate(b.yearEndDate);
                            if (prevDate < newDate) return -1;
                            if (prevDate > newDate) return 1;
                        });

                        if (val.statutoryAccounts[val.statutoryAccounts.length - 1].netAssets && val.statutoryAccounts[val.statutoryAccounts.length - 1].netAssets != "") {
                            val['netAssets'] = this.toCurrencyPipe.transform(val.statutoryAccounts[val.statutoryAccounts.length - 1].netAssets, 'GBP', 'symbol', '1.0-0');
                        } else {
                            val['netAssets'] = "-";
                        }

                        if (val.statutoryAccounts[val.statutoryAccounts.length - 1].turnover && val.statutoryAccounts[val.statutoryAccounts.length - 1].turnover != "") {
                            val['turnover_latest'] = this.toCurrencyPipe.transform(val.statutoryAccounts[val.statutoryAccounts.length - 1].turnover, 'GBP', 'symbol', '1.0-0');
                        } else {
                            val['turnover_latest'] = "-";
                        }

                    }

                    val['RegAddress'] = this.commonService.formatCompanyAddress(val['RegAddress_Modified'])

                    val['similarCompanyName'] = val['businessName']

                    val['companyRegNumber'] = val['companyRegistrationNumber']

                    val['similarCompanyStatus'] = val['companyStatus']

                    val['contactDetails'] = val.RegAddress_Modified['website']

                }

                this.similarCompaniesWithSameSiccodeDetails = this.similarCompaniesWithSameSiccodeDetails.sort((a, b): any => {
                    if (a.statutoryAccounts && b.statutoryAccounts) {
                        let prevNetAssets: any = a.statutoryAccounts[a.statutoryAccounts.length - 1].netAssets,
                            newNetAssets: any = b.statutoryAccounts[b.statutoryAccounts.length - 1].netAssets;
                        if (prevNetAssets < newNetAssets) return -1;
                        if (prevNetAssets > newNetAssets) return 1;
                    }
                });

            } else {
                this.similarCompaniesWithSameSiccodeDetails = []
            }
        },err => {
            this.similarCompaniesWithSameSiccodeDetails = []

        });
    }

    getCompanyDocuments(compNo) {

        let reqObj = [ compNo ]

        this.globalServerCommunication.globalServerRequestCall('get', 'DG_API', 'listOfCompanyDocuments', reqObj ).subscribe( res => {
            let data = res.body;
            this.sharedLoaderService.hideLoader();
            if (data['status'] == 200) {
                if (data['companyDocuments'].items) {
                    this.parseDocument(data['companyDocuments']);
                }
            }
        });
    }

    parseDocument(companyDocuments) {
		let download = {};
		let regexp = /-/g;

		for (let i = 0; i < companyDocuments["items"].length; i++) {
			if (companyDocuments["items"][i].links == undefined) {
				companyDocuments["items"][i].links = {
					document_metadata: undefined,
					self: undefined
				}
				// companyDocuments["items"][i]['links']["document_metadata"] = undefined;
				// companyDocuments["items"][i]['links']["self"] = undefined;
			}

			download = { companyNumber: this.companyNumber, description: companyDocuments["items"][i].description, metadata: companyDocuments["items"][i].links["document_metadata"] };
			companyDocuments["items"][i]['download'] = download;

			if (companyDocuments['items'][i].category === "confirmation-statement") {
				companyDocuments['items'][i].color = "#3dd177";
				companyDocuments['items'][i].icon = 'playlist_add_check';
			}
			else if (companyDocuments['items'][i].category === "accounts") {
				companyDocuments['items'][i].color = "#52a6ff";
				companyDocuments['items'][i].icon = "account_balance";
			}
			else if (companyDocuments['items'][i].category === "annual-return") {
				companyDocuments['items'][i].color = "#e66ecc";
				companyDocuments['items'][i].icon = "assignment";
			}
			else if (companyDocuments['items'][i].category === "officers") {
				companyDocuments['items'][i].color = "#ff5e52";
				companyDocuments['items'][i].icon = "people_outline";
			}
			else if (companyDocuments['items'][i].category === "incorporation") {
				companyDocuments['items'][i].color = "#0277bd";
				companyDocuments['items'][i].icon = "today";
			}
			else if (companyDocuments['items'][i].category === "persons-with-significant-control") {
				companyDocuments['items'][i].color = "#ff9800";
				companyDocuments['items'][i].icon = "people";
			}
			else if (companyDocuments['items'][i].category === "change-of-constitution") {
				companyDocuments['items'][i].color = "#2e7d32";
				companyDocuments['items'][i].icon = "description";
			}
			else if (companyDocuments['items'][i].category === "address") {
				companyDocuments['items'][i].color = "#00695c";
				companyDocuments['items'][i].icon = "location_on";
			}
			else if (companyDocuments['items'][i].category === "mortgage") {
				companyDocuments['items'][i].color = "#e91e63";
				companyDocuments['items'][i].icon = "business_center";
			}
			else if (companyDocuments['items'][i].category === "gazette") {
				companyDocuments['items'][i].color = "#92d417";
				companyDocuments['items'][i].icon = "insert_drive_file";
			}
			else if (companyDocuments['items'][i].category === "dissolution") {
				companyDocuments['items'][i].color = "#f92616";
				companyDocuments['items'][i].icon = "delete_forever";
			}
			else if (companyDocuments['items'][i].category === "capital") {
				companyDocuments['items'][i].color = "#0cab0f";
				companyDocuments['items'][i].icon = "work";
			}
			else if (companyDocuments['items'][i].category === "change-of-name") {
				companyDocuments['items'][i].color = "#ff9632";
				companyDocuments['items'][i].icon = "edit";
			}
			else if (companyDocuments['items'][i].category === "resolution") {
				companyDocuments['items'][i].color = "#c41155";
				companyDocuments['items'][i].icon = "folder_special";
			}
			else {
				companyDocuments['items'][i].color = "#92d417";
				companyDocuments['items'][i].icon = "folder_open";
			}

			companyDocuments['items'][i].category = companyDocuments['items'][i].category.toString().replace(regexp, " ");
			companyDocuments['items'][i].description = companyDocuments['items'][i].description.toString().replace(regexp, " ");
		}

		this.companyDocuments = companyDocuments;
    }
    
    getAquisitionMergersData() {
        let compno = [this.companyData.companyRegistrationNumber];

        this.globalServerCommunication.globalServerRequestCall('get', 'DG_COMPANY_DETAILS', 'acquisitonMergerInformation', compno ).subscribe( res => {

                if(res.body["status"] === 200) {
                    this.sharedLoaderService.hideLoader();
                    this.aquisitionMergerData = res.body["results"];
                    
                    this.aquisitionMergerData = this.aquisitionMergerData.sort( (a, b): any => {
                        let prevDate: any = this.commonService.changeToDate(a.acquiredDate),
                        newDate: any = this.commonService.changeToDate(b.acquiredDate);
                        if (prevDate < newDate) return 1;
                        if (prevDate > newDate) return -1;
                    });

                    this.aquisitionMergersReportData = this.aquisitionMergerData;

                    this.aquisitionMergerDataColumn = [
                        { field: 'acquiringCompanyRegistrationNumber', header: 'Acquiring Company Number', width: '100px', textAlign: 'left' },
                        { field: 'acquiringCompanyName', header: 'Acquiring Company', width: '220px', textAlign: 'left' },
                        { field: 'acquiredCompanyRegistrationNumber', header: 'Acquired Company Number', width: '100px', textAlign: 'left' },
                        { field: 'acquiredCompanyName', header: 'Acquired Company', width: '220px', textAlign: 'left' },
                        { field: 'acquiredDate', header: 'Acquired Date', width: '100px', textAlign: 'center' },
                        { field: 'considerationPart1', header: 'Consideration Part 1', width: '120px', textAlign: 'right' },
                        { field: 'considerationPart2', header: 'Consideration Part 2', width: '130px', textAlign: 'right' },
                        { field: 'enquiryContact1', header: 'Enquiry Contact 1', width: '150px', textAlign: 'left' },
                        { field: 'phoneContact1', header: 'Phone Contact 1', width: '130px', textAlign: 'center' },
                        { field: 'enquiryContact2', header: 'Enquiry Contact 2', width: '150px', textAlign: 'left' },
                        { field: 'phoneContact2', header: 'Phone Contact 2', width: '130px', textAlign: 'center' },
                        { field: 'freeFormatComment', header: 'Additional Details', width: '260px', textAlign: 'left' }
                    ];

                    for (let i = 0; i < this.aquisitionMergerData.length ; i++) {

                        if(this.aquisitionMergerData[i]["considerationPart1"] !== null ) {
                            this.aquisitionMergerData[i]["considerationPart1"] = this.aquisitionMergerData[i]["considerationPart1"].replace(/ /g, "").replace("million", "000000").replace("m", "000000").replace("billion", "000000000").replace(/,/g, "").replace(/us/gi, "");
                        } 
                        if(this.aquisitionMergerData[i]["considerationPart2"] !== null) {
                            this.aquisitionMergerData[i]["considerationPart2"] = this.aquisitionMergerData[i]["considerationPart2"].replace(/ /g, "").replace("million", "000000").replace("m", "000000").replace("billion", "000000000").replace(/,/g, "").replace(/us/gi, "");
                        }
                    }
                } else {
                    console.log("error, data not found");
                }
            }, err => {
            console.log(err)
            throw err;
        })
    }

    sortCharges(tempArr) {
        var len = tempArr.length,
            min;
        for (let i = 0; i < len; i++) {
            min = i;
            for (let j = i + 1; j < len; j++) {
                if (tempArr[j]["status"] < tempArr[min]["status"]) {
                    min = j;
                }
            }

            if (i != min) {
                this.swap(tempArr, i, min);
            }
        }
        return (tempArr.reverse())
    }

    swap(items, firstIndex, secondIndex){
        var temp = items[firstIndex];
        items[firstIndex] = items[secondIndex];
        items[secondIndex] = temp;
    }

    getGroupStructure() {
        let compNo = this.companyData.companyRegistrationNumber;
        this.globalServerCommunication.globalServerRequestCall('get', 'DG_COMPANY_DETAILS', 'companyGroupStructure', compNo ).subscribe( res => {

            this.sharedLoaderService.hideLoader();
            if(res.body['status'] == 200) {
                this.companyDetails['groupStructureData'] = res.body['results'];
                this.showLoader = false;
            } else {
                this.showLoader = false;
            }
        });
    }

    changeTreeOrientation() {
        if (this.treeOrientation == 'horizontal') {
            this.forTableView = true;
            this.treeOrientation = 'vertical';
        } else if (this.treeOrientation == 'vertical') {
            this.forTableView = false;
            this.treeOrientation = 'horizontal';
        }
    }

    expandTreeOnSelectingNode(event) {
        if(event.originalEvent.toElement.outerHTML.includes("span")){
            event.node.expanded = true;
            if (event.node.expanded !== undefined) {
                if (event.node.expanded == true) {
                    event.node.expanded = false;
                } else {
                    event.node.expanded = true;
                }
            } else {
                event.node.expanded = true;
            } 
        }
    }

    handleOverlayClick(event) {
        let isMarker = event.overlay.getTitle != undefined;

        if(isMarker) {
            let title = event.overlay.getTitle();
            this.infoWindow.setContent('' + title + '');
            this.infoWindow.open(event.map, event.overlay);
        }
    }

    typeOfData(val) {
        return this.commonService.typeOfData( val );
    }

    disqualifiedDirectorDetails() {
        let obj = { "pnr": this.disqualifiedDeletedExceptionDirectors }
        this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_DIRECTOR_DETAILS', 'disqualifiedDirectors', obj).subscribe(res => {
            let data = res.body;
            if (data.status == 200) {
                if (data.results.length > 0) {

                    this.disqualifiedDirectorsCount = data.results.length;

                    for (let dirDetail of this.directorDetails) {

                        for (let disqualifiedDirDetail of data.results) {
                            if (dirDetail.directorPnr == disqualifiedDirDetail.PNR) {
                                dirDetail['disqualifiedDirectors'] = disqualifiedDirDetail;
                            }
                        }
                    }
                }
            }
        })
    }

    deletedDirectorDetails() {
        let obj = { "pnr": this.disqualifiedDeletedExceptionDirectors }
        this.globalServerCommunication.globalServerRequestCall('get', 'DG_COMPANY_DETAILS', 'deletedDirectors', obj ).subscribe( res => {
            let data = res.body;
            if (data.status == 200) {
                if (data.results.length > 0) {

                    this.directorDetails.forEach(dirDetail => {

                        for (let deletedDirDetail of data.results) {
                            if (dirDetail.directorPnr == deletedDirDetail.PNR) {
                                for (let key in deletedDirDetail) {
                                    if (key != "PNR") {
                                        let newKey = key == "DDATE" ? "deleteDate" : key
                                        dirDetail[newKey] = deletedDirDetail[key]
                                    }
                                }
                            }
                        }
                    });
                }
            }
        })
    }

    exceptionDirectorDetails() {
        let obj = { "pnr": this.disqualifiedDeletedExceptionDirectors }
        this.globalServerCommunication.globalServerRequestCall('post', 'DG_DIRECTOR_DETAILS', 'directorsExceptions', obj ).subscribe( res => {
            let data = res.body;
            this.showDirector = true;
            if (data.status == 200) {
                if (data.results.length > 0) {

                    for (let dirDetail of this.directorDetails) {

                        for (let exceptionDirDetail of data.results) {
                            if (dirDetail.directorPnr == exceptionDirDetail.PNR) {
                                dirDetail['exceptionDirectors'] = exceptionDirDetail;
                            }
                        }
                    }
                }
            }
        })
    }
    
    directorDetailFinanceDataPossibleCompanies() {
        
        if ( this.possibleCompanies ) {

            for (let dirDetailData of this.possibleCompanies) {
    
                if ( dirDetailData.directorData.directorJobRole && !this.directorsAllOccupationsPossibleCompanies.includes( dirDetailData.directorData.directorJobRole ) ) {
                    this.directorsAllOccupationsPossibleCompanies.push( dirDetailData.directorData.directorJobRole );
                }
    
                if ( dirDetailData.directorData.status ) {
                   
                    this.directorStatusCountsPossibleCompanies.total++;
    
                    if ( dirDetailData.directorData.status == 'Active' ) {
                        this.directorStatusCountsPossibleCompanies.active++;
                    }
                    if ( dirDetailData.directorData.status == 'Resigned' ) {
                        this.directorStatusCountsPossibleCompanies.resigned++;
                    }
                    if ( dirDetailData.directorData.status == 'Inactive') {
                        this.directorStatusCountsPossibleCompanies.inactive++;
                    }
                }
    
    
                if( dirDetailData.directorData.detailedInformation.nationality !== undefined ) {
                    
                    if ( this.countryCodemap.has( dirDetailData.directorData.detailedInformation.nationality ) ) {
                        dirDetailData.directorData['countryCode'] = this.countryCodemap.get( dirDetailData.directorData.detailedInformation.nationality.toLowerCase() );
                    }
                }              
                if ( dirDetailData.hasFinances ) {
                    let finOverviewChartYears = [];

                    if ( dirDetailData.financeData ) {
                        const tempCloneArr = dirDetailData.financeData.map( a => { return { ...a } } );
    
                        for ( let tempArrKey in tempCloneArr[0] ) {
                            if ( tempArrKey == 'yearEndDate' ) {
                                let a = tempCloneArr[0][tempArrKey].split('/');
    
                                a[2] = (+a[2] - 1).toString();
                                
                                tempCloneArr[0][tempArrKey] = a.join('/');
                            } else {
                                tempCloneArr[0][tempArrKey] = null;
                            }
                        }
    
                        dirDetailData.financeData.push(tempCloneArr[0]);
                        // }
            
                        dirDetailData.financeData = dirDetailData.financeData.sort( (a, b) => {
                            let prevDate: any = this.commonService.changeToDate(a.yearEndDate ? a.yearEndDate : 0),
                                newDate: any = this.commonService.changeToDate(b.yearEndDate ? b.yearEndDate : 0);
                                
                            return prevDate - newDate;
                        });
                    }
                    
                    
                    dirDetailData['financeTurnoverData'] = [];
                    dirDetailData['financeTotalAssetsData'] = [];
                    dirDetailData['financeTotalLiabilitiesData'] = [];
                    dirDetailData['financeNetWorthData'] = [];
                    if ( dirDetailData.financeData ) {

                        for ( let finOverData of dirDetailData.financeData ) {
                            let finYear = new Date(this.commonService.changeToDate(finOverData.yearEndDate)).getFullYear();
        
                            finOverviewChartYears.push( finYear );
                            
                            dirDetailData['financeTurnoverData'].push( finOverData.turnover ? finOverData.turnover : 0 );
                            dirDetailData['financeTotalAssetsData'].push( finOverData.totalAssets ? finOverData.totalAssets : 0 );
                            dirDetailData['financeTotalLiabilitiesData'].push( finOverData.totalLiabilities ? finOverData.totalLiabilities : 0 );
                            dirDetailData['financeNetWorthData'].push( finOverData.netWorth ? finOverData.netWorth : 0 );
                        }
                    }

                    this.chartOptions = {
                        legend: {
                            labels: {
                                fontFamily: 'Roboto',
                                padding: 15
                            }
                        },
                        title: {
                            fontFamily: 'Roboto',
                        },
                        scales: {
                            x: {
                                ticks: {
                                    fontFamily: 'Roboto',
                                    padding: 8
                                }
                            },
                            y: {
                                ticks: {
                                    fontFamily: 'Roboto',
                                    padding: 8,
                                    callback: (label, index, labels) => {
                                        return this.toNumberSuffix.transform( label, 0, 'GBP' );
                                    }
                                }
                            }
                        },
                        tooltips: {
                            titleFontFamily: 'Roboto',
                            bodyFontFamily: 'Roboto',
                            callbacks: {
                                label: ( tooltipItem, dataset ) => {
                                    return `${ dataset.datasets[ tooltipItem.datasetIndex ].label }: ${ this.toCurrencyPipe.transform( tooltipItem.yLabel, 'GBP', 'symbol', '1.0-0' ) }`;
                                }
                            }
                        },
                        plugins: {
                            datalabels: {
                                display: false
                            }
                        }
                    }
    
                    dirDetailData.financeChartData = {
                        labels: finOverviewChartYears,
                        datasets: [
                            {
                                label: 'Turnover',
                                data: dirDetailData.financeTurnoverData,
                                fill: false,
                                borderColor: '#5b9bd5'
                            },
                            {
                                label: 'Total Assets',
                                data: dirDetailData.financeTotalAssetsData,
                                fill: false,
                                borderColor: '#ffc000'
                            },
                            {
                                label: 'Total Liabilities',
                                data: dirDetailData.financeTotalLiabilitiesData,
                                fill: false,
                                borderColor: '#ed7d31'
                            },
                            {
                                label: 'Net Worth',
                                data: dirDetailData.financeNetWorthData,
                                fill: false,
                                borderColor: '#60af60'
                            }
                        ]
        
                    };
                }
                
            }            
            
            for (let dirDetailDataObj of this.possibleCompanies) {
               
                
                let tempObj = {};
    
                for ( let dirDataHead of this.directorDetailsCompanySummaryColumns ) {
    
                    for ( let compDataKey in dirDetailDataObj ) {
                        
                        
                        if ( typeof dirDetailDataObj[ compDataKey ] == 'object' ) {
    
                            if ( ['financeTurnoverData', 'financeTotalAssetsData', 'financeTotalLiabilitiesData', 'financeNetWorthData'].includes( compDataKey ) ) {
                               
                                
                                if ( dirDataHead.field == compDataKey ) {
    
                                    tempObj[ dirDataHead.field ] = dirDetailDataObj[ compDataKey ][ dirDetailDataObj[ compDataKey ].length - 1 ];
    
                                }
    
                            }  else if (['person_entitled'].includes( compDataKey )) {
    
                                if ( dirDataHead.field == compDataKey) {
    
                                    let temp =  dirDetailDataObj[ compDataKey ].reduce( (acc, val ) => {
                                        if(acc[val]){
                                            acc[val] = ++acc[val]
                                        } else {
                                            acc[val] = 1;
                                        }
                                        return acc;
                                    },{})
                                    tempObj[dirDataHead.field] = Object.entries(temp);
                                } 
                            } else {
                               
                                
                                for ( let dirDataKey in dirDetailDataObj[ compDataKey ] ) {
        
                                    if ( dirDataHead.field == dirDataKey ) {
        
                                        tempObj[ dirDataHead.field ] = dirDetailDataObj[ compDataKey ][ dirDataHead.field ];
        
                                    }
        
                                }
    
    
                            }
    
                        } else {
    
                            if ( compDataKey == dirDataHead.field ) {
    
                                tempObj[ dirDataHead.field ] = dirDetailDataObj[ dirDataHead.field ];
    
                            }
    
                        }
    
    
                    }
    
                }
                
                tempObj['directorStatus'] = dirDetailDataObj['directorData']['status'];
                tempObj['IncorporationDate'] = dirDetailDataObj['IncorporationDate'];
                tempObj['ccjCount'] = dirDetailDataObj['ccjCount'];
                tempObj['shareHoldersCount'] = dirDetailDataObj['shareHoldersCount'];
                tempObj['companyCommentaryCount'] = dirDetailDataObj['companyCommentaryCount'];
                tempObj['hasSafeAlerts'] = dirDetailDataObj['hasSafeAlerts'];
                tempObj['total_count'] = dirDetailDataObj['total_count'];
                this.possibleCompaniesSummaryData.push( tempObj );
            }
            
        }

    }

    reduceExportLimit(newLimit, thisPage) {
        let obj = {
            userId: this.userDetails?.dbID,
            thisPage: thisPage,
            newLimit: newLimit
        }
        this.globalServerCommunication.reduceExportLimit(obj);
    }
    toggleCategories( targetElm ) {
		if ( !targetElm.classList.contains( 'collapsed' ) ) {
			targetElm.classList.add( 'collapsed' );
		} else {
			targetElm.classList.remove( 'collapsed' );
		}
	}

    formatShareHoldingData( dataArray ){
      dataArray.shareholdings.forEach(element => {
        if (element.totalShareCount !== undefined && element.totalShareCount !== null && element.totalShareCount > 0 ) {
            element["share_percent"] = ((element.numberOfSharesIssued * element.value) / element.totalShareCount ) * 100
            element["share_percent"] = parseFloat(element["share_percent"]).toFixed(2);
        } else {
          element["share_percent"] = ""
        }
        if(element.companyInformation && element.companyInformation.sicCode07) {
            element['sic_code'] = element.companyInformation.sicCode07;
        } 
      });
      return dataArray
    }

    getCompanyDirectorsData( compNum ) {
        let reqobj = [ compNum ];
        this.globalServerCommunication.globalServerRequestCall('get', 'DG_API', 'companyDirectorsData', reqobj ).subscribe( res => {
            if ( res.status == 200 ) {
                this.companyDetails.directorsData = res.results;
                this.parseCompanyDetail( this.companyDetails, "director" );
            }
        });
    }

    getCompanyChargesData() {
        let compNo = [ this.companyData.companyRegistrationNumber ];
        this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_API', 'companyChargesData', compNo ).subscribe( res => {
            this.sharedLoaderService.hideLoader();

            if (res.body["status"] == 200) {

                if (res.body.results) {
                    let tempArr: Array<any> =  [];
                    let sortingArray: Array<number> = [];
                    let outstandingCount = 0;
                    let partialSatisfiedCount = 0;
                    let satifiedCount = 0;
                    res.body.results.forEach(charge => {
                        let tempCharge = {};
                        for (let key in charge) {
                            if (key == "mortgageNumber"){
                                sortingArray.push(charge[key]);
                                tempCharge["charge_number"] = charge[key];
                            }
                            else if (key == "regDate") {
                                if (charge[key] != null && charge[key] != undefined) {
                                    let regDate = charge[key].split("/");
                                    tempCharge["registered_on"] = new Date(regDate[2], parseInt(regDate[1]) - 1, regDate[0]);
                                }
                            }
                            else if (key == "createdDate") {
                                if (charge[key] != null && charge[key] != undefined) {
                                    let createdDate = charge[key].split("/");
                                    tempCharge["created_on"] = new Date(createdDate[2], parseInt(createdDate[1]) - 1, createdDate[0]);
                                }
                            }
                            else if (key == "satisfiedDate") {
                                if (charge[key] != null && charge[key] != undefined) {
                                    let satisfiedDate = charge[key].split("/");
                                    tempCharge["delivered_on"] = new Date(satisfiedDate[2], parseInt(satisfiedDate[1]) - 1, satisfiedDate[0]);
                                }
                            }
                            else if (key == "memorandumNature") {
                                if (["b","f","p","r"].includes(charge[key])){
                                    tempCharge["status"] = "Fully Satisfied";
                                    satifiedCount++;
                                }
                                if (charge[key] == 's'){
                                    tempCharge["status"] = "Part Satisfied";
                                    partialSatisfiedCount++;
                                }
                                if (["t","u","v","w","x","y","z",null,""].includes(charge[key])){
                                    tempCharge["status"] = "Outstanding";
                                    outstandingCount++;
                                }
                            }
                            else if (key == "mortgageDetails") {
                                charge[key].forEach((details: { recordType: string; description: string; }) => {
                                    if (details.recordType == "persons entitled") {
                                        tempCharge["persons_entitled"] = this.commonService.formatNameForPersonEntitled(details.description.split(";"));
                                    }
                                    if (details.recordType == "amount secured") {
                                        tempCharge["secured_details"] = details.description.replace(/[!@#$%^&*()�,.?";:{}|<>]/g, " ");
                                        // replace(/[^\w\s]/gi, '')
                                    }
                                    if (details.recordType == "mortgage type") {
                                        tempCharge["classification"] = details.description;
                                    }
                                    if (details.recordType == "mortgage detail") {
                                        tempCharge["particulars"] = details.description.replace(/[!@#$%^&*()�?";:{}|<>]/g, " ");
                                    }
                                });
        
                            }
                            else {
                                tempCharge[key] = charge[key]
                            }
                        } 
                        tempArr.push(tempCharge);
                    });
                    tempArr = this.sortCharges(tempArr)
                    
                    this.companyChargesData = JSON.parse(JSON.stringify(tempArr));
                    this.companyDetails['mortgagesOutstandingCount'] = outstandingCount;
                    this.companyDetails['mortgagesPartialSatisfiedCount'] = partialSatisfiedCount;
                    this.companyDetails['mortgagesSatifiedCount'] = satifiedCount;
                }
            }
        });
    }

    getCompanyValuationsData() {

        let reqBodyObj = { companyNameNumber: this.companyData.companyRegistrationNumber };
        this.globalServerCommunication.globalServerRequestCall('post', 'DG_VALUATION', 'companyValuations', reqBodyObj ).subscribe( res => {
            if ( res.status == 200 ) {
                this.companyValuationsRoeData = res.results[0];

                this.getCompanyValuationsHistoryData();
            }
        });
    }

    getCompanyValuationsHistoryData() {
        let tempAllCompaniesValuationsChartDataArr = { voScoreLabels: [], voScoreData: [], roePercentLabels: [], roePercentData: [] };
        const minimumYearsCount = 5;

        let reqBodyObj =[ this.companyData.companyRegistrationNumber ];
        this.globalServerCommunication.globalServerRequestCall('get', 'DG_VALUATION', 'companyValuationsHistory', reqBodyObj ).subscribe( res => {

            if ( res.status == 200 && res.results.length ) {

                let VoScoreDataArray = res.results[0]['VoSCOREArray'],
                    hasVoScoreDataCheck = VoScoreDataArray.filter( value => value.yearArray.length);

                if ( hasVoScoreDataCheck && hasVoScoreDataCheck.length ) {

                    if ( VoScoreDataArray.length <= minimumYearsCount ) {
    
                        for ( let VoScoreDataObj of VoScoreDataArray ) {
    
                            if ( VoScoreDataArray.length == minimumYearsCount ) {
                                break;
                            } else {
    
                                VoScoreDataArray.sort( ( a, b ) => {
                                    let dateA: any = this.commonService.changeToDate( a['yearArray'][ a['yearArray'].length - 1 ] ),
                                        dateB: any = this.commonService.changeToDate( b['yearArray'][ b['yearArray'].length - 1 ] );
                
                                    return dateA - dateB;
                                });
    
                                let minYear = new Date( this.commonService.changeToDate( VoScoreDataArray[0]['yearArray'][ VoScoreDataArray[0]['yearArray'].length - 1 ] ) ).getFullYear() - 1;
    
                                VoScoreDataArray.push({
                                    VoSCORE: 0,
                                    ROE_PERCENT: 0,
                                    yearArray: [ `31/01/${ minYear }` ]
                                });
    
                            }
    
                        }
    
                    }
                    
                    const companyValuationChartData = VoScoreDataArray.sort( ( a, b ) => {
                        let dateA: any = this.commonService.changeToDate( a['yearArray'][ a['yearArray'].length - 1 ] ),
                            dateB: any = this.commonService.changeToDate( b['yearArray'][ b['yearArray'].length - 1 ] );
    
                        return dateA - dateB;
                    });
    
                    for ( let chartDataObj of companyValuationChartData ) {
    
                        let yearLabelStr = new Date( this.commonService.changeToDate( chartDataObj['yearArray'][ chartDataObj['yearArray'].length - 1 ] ) ).getFullYear();
    
                        tempAllCompaniesValuationsChartDataArr.voScoreLabels.push( yearLabelStr );
                        tempAllCompaniesValuationsChartDataArr.voScoreData.push( chartDataObj['VoSCORE'] );
                        tempAllCompaniesValuationsChartDataArr.roePercentLabels.push( yearLabelStr );
                        tempAllCompaniesValuationsChartDataArr.roePercentData.push( chartDataObj['ROE_PERCENT'] );
                    }

                    this.companyValuationsChartOptions = {
                        legend: {
                            display: false
                        },
                        title: {
                            fontFamily: 'Roboto',
                        },
                        scales: {
                            x:{
                                ticks: {
                                    fontFamily: 'Roboto',
                                    padding: 8
                                }
                            },
                            y: {
                                ticks: {
                                    fontFamily: 'Roboto',
                                    padding: 8,
                                    callback: (label, index, labels) => {
                                        return this.toNumberSuffix.transform( label, 0, 'GBP' );
                                    }
                                }
                            }
                        },
                        tooltips: {
                            titleFontFamily: 'Roboto',
                            bodyFontFamily: 'Roboto',
                            callbacks: {
                                label: ( tooltipItem, dataset ) => {
                                    return this.toCurrencyPipe.transform( tooltipItem.yLabel, 'GBP', 'symbol', '1.0-0' );
                                }
                            }
                        },
                        plugins: {
                            datalabels: {
                                display: false
                            }
                        }
                    }
    
                    this.allCompaniesValuationsChartData = {
                        labels: tempAllCompaniesValuationsChartDataArr.voScoreLabels,
                        datasets: [
                            {
                                type: 'line',
                                data: tempAllCompaniesValuationsChartDataArr.voScoreData,
                                pointRadius: 4,
                                pointBackgroundColor: '#287EAD',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 1,
                                fill: false,
                                borderColor: 'rgba(0, 0, 0, 0)'
                            },
                            {
                                data: tempAllCompaniesValuationsChartDataArr.voScoreData,
                                backgroundColor: '#1F4286'
                            },
                            {
                                type: 'line',
                                data: tempAllCompaniesValuationsChartDataArr.voScoreData,
                                pointRadius: 0,
                                backgroundColor: 'rgba( 40, 126, 173, 0.2 )',
                                borderColor: 'rgba( 40, 126, 173, 0.0 )'
                            }
                        ]
                    };         

                    this.companyRoeChartOptions = {
                        legend: this.companyValuationsChartOptions.legend,
                        title: this.companyValuationsChartOptions.title,
                        scales: {
                            ...this.companyValuationsChartOptions.scales.xAxes,
                            y:  {
                                ticks: {
                                    fontFamily: 'Roboto',
                                    padding: 8,
                                    callback: (label, index, labels) => {
                                        return `${ label }%`;
                                    }
                                }
                            }
                        },
                        tooltips: {
                            titleFontFamily: 'Roboto',
                            bodyFontFamily: 'Roboto',
                            callbacks: {
                                label: ( tooltipItem, dataset ) => {
                                    return `${ tooltipItem.yLabel.toFixed(2) }%`;
                                }
                            }
                        },
                        plugins: this.companyValuationsChartOptions.plugins
                    };
    
                    this.allCompaniesRoeChartData = {
                        labels: tempAllCompaniesValuationsChartDataArr.roePercentLabels,
                        datasets: [
                            {
                                type: 'line',
                                data: tempAllCompaniesValuationsChartDataArr.roePercentData,
                                pointRadius: 4,
                                pointBackgroundColor: '#287EAD',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 1,
                                fill: false,
                                borderColor: 'rgba(0, 0, 0, 0)'
                            },
                            {
                                data: tempAllCompaniesValuationsChartDataArr.roePercentData,
                                backgroundColor: '#1F4286'
                            },
                            {
                                type: 'line',
                                data: tempAllCompaniesValuationsChartDataArr.roePercentData,
                                pointRadius: 0,
                                backgroundColor: 'rgba( 40, 126, 173, 0.2 )',
                                borderColor: 'rgba( 40, 126, 173, 0.0 )'
                            }
                        ]
                    };

                }

                this.sharedLoaderService.hideLoader();
                
            } else {
                
                this.sharedLoaderService.hideLoader();
                
            }
        });

    }

    calculatePercentageForOverviewFinancials( previousYearValue, currentYearValue ) {
        let calculatedPercentageValue = '';

        if ( previousYearValue < currentYearValue ) {
            
            if ( ( previousYearValue === 0 && ( currentYearValue > 0 || currentYearValue < 0 ) ) ) {
                calculatedPercentageValue = '';
            } else if ( currentYearValue === 0 && previousYearValue > 0 ) {
                calculatedPercentageValue = '-100';
            } else if ( currentYearValue === 0 && previousYearValue < 0 ) {
                calculatedPercentageValue = '100';
            } else {
                let percentageChange: any = ( ( ( currentYearValue - previousYearValue ) / previousYearValue ) * 100 ).toFixed(1);
                if( ( previousYearValue < 0 && currentYearValue > 0 ) || ( previousYearValue < 0 && currentYearValue < 0 ) ) {
                    percentageChange = percentageChange * (-1);
                } 
                calculatedPercentageValue = percentageChange.toString();
            }

        } else if ( previousYearValue > currentYearValue ) {
            if ( ( previousYearValue === 0 && ( currentYearValue > 0 || currentYearValue < 0 ) ) ) {
                calculatedPercentageValue = '';
            } else if ( currentYearValue === 0 && previousYearValue > 0 ) {
                calculatedPercentageValue = '-100';
            } else if ( currentYearValue === 0 && previousYearValue < 0 ) {
                calculatedPercentageValue = '100';
            } else {
                let percentageChange: any = ( ( ( currentYearValue - previousYearValue ) / previousYearValue ) * 100 ).toFixed(1);
                if ( ( previousYearValue < 0 && currentYearValue > 0 ) || ( previousYearValue < 0 && currentYearValue < 0 ) ) {
                    percentageChange = percentageChange * (-1);
                }

                calculatedPercentageValue = percentageChange.toString();
            }
        }

        return  calculatedPercentageValue;

    }

    // addDirectorToWatchList( directorData ) {

    //     if ( this.isLoggedIn ) {

    //         if ( this.userAuthService.hasFeaturePermission( 'Director Monitor' ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {

    //             let requestObject = {
    //                 directorsList: [
    //                     {
    //                         directorPnr: directorData.directorPnr,
    //                         directorName: directorData.detailedInformation.fullName,
    //                         companyNumber: this.directorDetailData[0].CompanyNumber,
    //                     }
    //                 ],
    //                 userId: this.userDetails?.dbID
    //             };
    
    //             this.confirmationService.confirm({
    //                 message: this.constantMessages['confirmation']['addDirectorMonitorList'],
    //                 header: 'Confirmation',
    //                 icon: 'pi pi-exclaimation-triangle',
    //                 key: this.thisPage.toString(),
    //                 accept: () => {
    //                     let obj = {
    //                         userId: this.userDetails?.dbID
    //                     }
    //                     this.globalServerCommunication.globalServerRequestCall('post', 'DG_LIST', 'getUserExportLimit', obj ).subscribe( res => {
    //                         let userData = res.body.results[0];
    //                         if (userData && userData.directorMonitorLimit > 0) {
    //                             this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'saveWatchListDirectors', requestObject ).subscribe( res => {
    //                                 if (res.status == 200) {
    //                                     this.updateDirectorsMonitorBoolean.emit({ thisPage: this.thisPage, directorInMonitor: this.directorInMonitor });
    //                                     this.msgs = [];
    //                                     this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['directorMonitorSuccess'] });
    
    //                                     setTimeout(() => {
    //                                         this.msgs = [];
    //                                     }, 3000);
    //                                 } else if (res.status == 201) {
    //                                     if (res.message == 'Directors Already Exists') {
    //                                         this.msgs = [];
    //                                         this.msgs.push({ severity: 'info', summary: `Director has been already added to the monitoring list.` });
    
    //                                         setTimeout(() => {
    //                                             this.msgs = [];
    //                                             this.router.navigate([`/director/${this.formatDirectorNameForUrl(directorData.detailedInformation.fullName)}/${directorData.directorPnr}`]);
    //                                         }, 3000);
    //                                     }
    //                                 }
    //                             });
    //                             let directorMonitorLimit = userData.directorMonitorLimit - requestObject.directorsList.length;
    //                             this.reduceExportLimit(directorMonitorLimit, "directorMonitorLimit");
    //                         } else {
    //                             this.msgs = [];
    //                             this.msgs.push({ severity: 'info', detail: 'No available Limit to add director in monitor!!' });
    //                             setTimeout(() => {
    //                                 this.msgs = [];
    //                             }, 2000);
    //                         }
    //                     });
    
    //                 }
    //             });

    //         } else {
    //             event.preventDefault();
    //             event.stopPropagation();
    //             this.showUpgradePlanDialog = true;
    //         }


    //     } else {
    //         event.preventDefault();
    //         event.stopPropagation();
    //         this.showLoginDialog = true;
    //     }

    // }

    // removeDirectorFromWatchList( directorData ) {

    //     if ( this.isLoggedIn ) {

    //         let requestObject = {
    //             directorsList: [ directorData.directorPnr ],
    //             userId: this.userDetails?.dbID
    //         };

    //         this.confirmationService.confirm({
    //             message: this.constantMessages['confirmation']['removeDirectorMonitorList'],
    //             header: 'Confirmation',
    //             icon: 'pi pi-exclaimation-triangle',
    //             key: this.thisPage.toString(),
    //             accept: () => {

    //                 this.globalServerCommunication.globalServerRequestCall('post', 'DG_LIST', 'removeFromDirectorWatchList', requestObject ).subscribe( res => {
    //                     if ( res.status == 200 ) {
    //                         this.updateDirectorsMonitorBoolean.emit( { thisPage: this.thisPage, directorInMonitor: this.directorInMonitor } );

    //                         this.msgs = [];
    //                         this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['directorMonitorRemoved'] });
                            
    //                         setTimeout( () => {
    //                             this.msgs = [];
    //                         }, 3000);
    //                     } else if ( res.status == 201 ) {
    //                         if ( res.message == 'Directors Already removed' ) {
    //                             this.msgs = [];
    //                             this.msgs.push({ severity: 'info', summary: `Director has been already removed from the monitoring list.` });

    //                             setTimeout(() => {
    //                                 this.msgs = [];
    //                                 this.router.navigate([`/director/${ this.formatDirectorNameForUrl( directorData.detailedInformation.fullName ) }/${ directorData.directorPnr }`]);
    //                             }, 3000);
    //                         }
    //                     }
    //                 });

    //             }
    //         });

    //     } else {
    //         event.preventDefault();
    //         event.stopPropagation();
    //         this.showLoginDialog = true;
    //     }

    // }

    updateTableDataList( event ) {

        if ( event.thisPage == 'directors' ) {
            this.getCompanyDirectorsData( this.companyDetails.companyRegistrationNumber );
        }
        if (  event.thisPage == "directorDetails" ) {

            this.updateTableDataListForDirector.emit( event );

        }

    }

    // messageCommunicator( event ) {
    //     this.msgs = [];
    //     this.msgs.push({ severity: 'success', detail: event.msgs});
    //     setTimeout( () => {
    //         this.msgs = [];
    //     }, 3000);
    // }

    returnCommentAccordingToValue( valueToCheck, quartileData, valueFor ) {
        let commentIndex = 0;
        if ( valueToCheck > quartileData['Q3'] ) {
            commentIndex = 3;
        } else if ( valueToCheck > quartileData['Q2'] ) {
            commentIndex = 2;
        } else if ( valueToCheck > quartileData['Q1'] ) {
            commentIndex = 1;
        } else {
            commentIndex = 0;
        }

        return `${ this.voAndRoeComments[ commentIndex ] } ${ valueFor }`;
    }


    getCompanyEventsData() {

        let reqObj = [  this.companyData.companyRegistrationNumber ];
        this.globalServerCommunication.globalServerRequestCall('get', 'DG_COMPANY_DETAILS', 'companyStatus', reqObj ).subscribe( res => {
            if (res.status == 200) {
                this.companyEventsData = res.results;
                this.companyEventsData = this.companyEventsData.map( obj => { 
                    let newObj = {...obj};
                    delete newObj['id'];
                    delete newObj['companyRegistrationNumber'];
                    delete newObj['statusCode'];
                    newObj['statusFiledDate'] = this.commonService.changeToDate(newObj['statusFiledDate'])
                    newObj['registeredDate'] = this.commonService.changeToDate(newObj['registeredDate'])
                    return newObj;
                })
                this.companyEventsData.sort( (a,b) => b.registeredDate - a.registeredDate )
                this.sharedLoaderService.hideLoader();
            }
        });
    }

   

    getCompanyPatentData() {
		
        let cmpNo = [ this.companyNumber, this.companyData.companyRegistrationNumber ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_ESG_DETAILS', 'companyPatentData', cmpNo ).subscribe( res => {
            if (res.body.status == 200) {
                this.patentTradeData = res.result;
                this.sharedLoaderService.hideLoader();
            }
        })
    }


    formatImportExportData( dataArray ) {
        let commodityCodeArray = ["commodity_code1","commodity_code2","commodity_code3","commodity_code4","commodity_code5","commodity_code6","commodity_code7","commodity_code8","commodity_code9","commodity_code10","commodity_code11","commodity_code12","commodity_code13","commodity_code14","commodity_code15","commodity_code16","commodity_code17","commodity_code18","commodity_code19","commodity_code20","commodity_code21","commodity_code22","commodity_code23","commodity_code24","commodity_code25","commodity_code26","commodity_code27","commodity_code28","commodity_code29","commodity_code30","commodity_code31","commodity_code32","commodity_code33","commodity_code34","commodity_code35","commodity_code36","commodity_code37","commodity_code38","commodity_code39","commodity_code40","commodity_code41","commodity_code42","commodity_code43","commodity_code44","commodity_code45","commodity_code46","commodity_code47","commodity_code48","commodity_code49","commodity_code50"];
        let tempArray: Array<any>  = [];
        dataArray.forEach( (object) => {
            let tempObj = {};
            let commodityCodeDataArray = [];
            
            for (const key in object) {
                if ( key == "month") {
                    tempObj[key] = Month[parseInt(object[key])]
                } else if (commodityCodeArray.includes(key)) {
                    if (object[key] ) {
                        commodityCodeDataArray.push(object[key])
                    }
                } else if (key == "years_without_month" || key == "year") {
                    tempObj[key] = parseInt(object[key]);
                }

            }
            tempObj["commodity_code"] = commodityCodeDataArray;
            tempArray.push(tempObj);
        });
        tempArray.sort( (a,b) => b.year - a.year )
        return tempArray
    }

    showCompanyProfileShareOverlay(elmId, event) {

        if ( this.userAuthService.hasFeaturePermission( 'Company Profile Social Share' ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
            elmId.toggle(event);
        } else {
            this.showUpgradePlanDialog = true;
        }
    }

    getCreditorsInfoData() {
        this.creditorsInfoDataColumn = [
            { field: 'companyNumber', header: 'Company Number', width: '120px', textAlign: 'center' },
            { field: 'CompanyNameOriginal', header: 'Company Name', width: '320px', textAlign: 'left' },
            { field: 'AMT', header: 'Amount', width: '180px', textAlign: 'right' },
            { field: 'DATES', header: 'Date', width: '120px', textAlign: 'left' }
        ];

        let reqobj = [ this.companyDetails.companyRegistrationNumber ];
        this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_ESG_DETAILS', 'creditorsDetailInfo', reqobj ).subscribe( res => {
            if ( res.body['status'] == 200 ) {
                this.creditorsInfoData = res.body['results'];
                this.creditorsCount = this.creditorsInfoData.length;

                let tempNumber: number = 0;
                this.creditorsInfoData.forEach(element => {
                    tempNumber = tempNumber + element.AMT;
                });
                this.creditorsTotalAmount = tempNumber;
               
                this.sharedLoaderService.hideLoader();
            }
        });
    }

    getDebtorsInfoData() {
        this.debtorsInfoDataColumn = [
            { field: 'companyNumber', header: 'Company Number', width: '120px', textAlign: 'center' },
            { field: 'CompanyNameOriginal', header: 'Company Name', width: '320px', textAlign: 'left' },
            { field: 'AMT', header: 'Amount', width: '180px', textAlign: 'right' },
            { field: 'DATES', header: 'Date', width: '120px', textAlign: 'left' }
        ];

        let reqObj = [ this.companyDetails.companyRegistrationNumber ];
        this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_RISK_ASSESMENT', 'debtorsDetailInfo', reqObj ).subscribe( res => {
            if ( res.body['status'] == 200 ) {
                this.debtorsInfoData = res.body['results'];
                this.BadDebtsCount =  this.debtorsInfoData.length;

                let tempNumber: number = 0;
                this.debtorsInfoData.forEach(element => {
                    tempNumber = tempNumber + element.AMT;
                });
                this.BadDebtsTotalAmount = tempNumber;
                this.sharedLoaderService.hideLoader();
            }
        });
    }
	
    directorDataInfo(event) {
        this.showOrHideDirectorContactInfoModal = true;  
        let reqobj = [ event.directorPnr ];
        this.globalServerCommunication.globalServerRequestCall('get', 'DG_API', 'directorCompaniesByPNR', reqobj).subscribe( res => {
            let data = res.body;
            if(data.status === 200) {     
                if(data.results.length > 0) {
                    for ( let res of data.results ) {
                        this.directorCompaniesListByPNR.push( {label: this.titlecasePipe.transform(res.businessName), value: res.companyRegistrationNumber} );
                    }
                }           
            }                       
            this.directorDataInfoObj.companyNumber = event.companyNumber;
            this.directorDataInfoObj.userId = this.userDetails?.dbID;
            this.directorDataInfoObj.companyName = event.companyName;
            this.directorDataInfoObj.directorPNR = event.directorPnr;
            this.directorDataInfoObj.directorEmail = event.directorEmail && event.directorEmail != "-" ? event.directorEmail : "";        
            this.directorDataInfoObj.directorJobTitle = event.jobTitle && event.jobTitle != "-" ? event.jobTitle : ""; 
            this.directorDataInfoObj.directorTelephone = event.tel_1 && event.tel_1 != "-" ? event.tel_1 : "";
            this.directorDataInfoObj.directorLinkedin = event.linkedin_url ? event.linkedin_url : "";
            this.directorDataInfoObj.directorFirstName = event.firstName ? event.firstName : "";
            this.directorDataInfoObj.directorLastName = event.lastName ? event.lastName : "";
        });  
    }

    selectDropdownCompany(event) {
        this.directorDataInfoObj.companyName = event.originalEvent.target.innerText;
    }

    // possibleCompaniesSummary(event) {
        
    //     this.tabViewPanelName = event.originalEvent.srcElement.innerText;
        
    // }

}
