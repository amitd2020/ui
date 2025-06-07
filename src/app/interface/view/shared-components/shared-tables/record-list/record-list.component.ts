import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { AfterViewInit, Component, DoCheck, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { mkConfig, generateCsv, download } from "export-to-csv";
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Calendar } from 'primeng/calendar';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SearchFiltersService } from 'src/app/interface/service/search-filter.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { SalesForceConstant, subscribedPlan } from 'src/environments/environment';
import { SharedLoaderService } from '../../shared-loader/shared-loader.service';
import { FormatDataRecordListService } from '../../shared-exports/export-record-list/format-data-export-record-list.service';
import CustomUtils from 'src/app/interface/custom-pipes/custom-utils/custom-utils.utils';
import { DropdownOptionsType, RequiredConstant } from '../required-constants';
import { SearchCompanyService } from '../../../features-modules/search-company/search-company.service';
import { ListPageName } from '../../../features-modules/search-company/search-company.constant';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { filter, takeUntil } from 'rxjs';
import { UnsubscribeSubscription } from 'src/app/interface/service/unsubscribe.abstract';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';
import ChartDataLabels from "chartjs-plugin-datalabels";

type crmType = 'hubspot' | 'salesforce';

@Component({
	selector: 'dg-record-list',
	templateUrl: './record-list.component.html',
	styleUrls: ['./record-list.component.scss']
})
export class RecordListComponent extends UnsubscribeSubscription implements OnInit, DoCheck, OnChanges, AfterViewInit, OnDestroy {

	ChartDataLabelsPlugins = [ ChartDataLabels ];
	getCbilsEditableData: Array<any> = [];
	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'
	// iTagMessage = 'Estimated Turnover = 7.8 times Accounts receivable.'

	@ViewChild('companyQuickInfoPopover', { static: false }) private companyQuickInfoPopover: ElementRef;
	@ViewChild('SubscriptionStartDatePicker', { static: false }) private SubscriptionStartDatePicker: Calendar;
	@ViewChild('companyRegistrationDatePicker', { static: false }) private companyRegistrationDatePicker: Calendar;
	@ViewChild('SubscriptionEndDatePicker', { static: false }) private SubscriptionEndDatePicker: Calendar;
	@ViewChild('LastLoginDatePicker', { static: false }) private LastLoginDatePicker: Calendar;
	@ViewChild('recordListTable', { static: false }) public recordListTable: Table;
	@ViewChild('recordListPaginator', { static: false }) public recordListPaginator: Paginator;
	@ViewChild('createUserTemplateForm', { static: false }) createUserTemplateForm: NgForm;
	@ViewChild('resetPickListFields', { static: false }) resetPickListFields: ElementRef;

	@Input() listColumns: Array<any> = [];

	@Input() listDataValues: Array<any> = [];

	@Input() searchTotalCount: number = 0;

	@Input() pageSize: number = 0;

	@Input() pageNumber: number = 0;

	@Input() socialNetworkCounts: Array<any>;

	@Input() relatedDirectorsAndCompaniesCmpNo: string;

	@Input() columnToggleData: Array<any>;

	@Input() showFilterSearch: Boolean = false;

	@Input() showRecordCount: Boolean = true;

	@Input() showExportButton: Boolean = false;

	@Input() showCheckBox: Boolean = true;

	@Input() thisPage: string = '';

	@Input() personEntitled: Array<any> = [];

	@Input() personEntitledRaw: Array<any> = [];

	@Input() appliedFilters: Array<any> = [];

	@Input() firstPage: boolean = undefined;

	@Input() defaultSearchData: boolean = undefined;

	@Output() tableOutputValues = new EventEmitter<any>();

	@Output() operatingTable = new EventEmitter<any>();
	@Output() pageInput = new EventEmitter<any>();

	@Input() relCompDirDataValueStatus: Boolean = true;

	@Input() dissolvedIndex: boolean = false;

	@Input() sampleLrmPdf: Boolean = false;

	@Input() contactsCount: any;
	@Input() selectedSavedListDataObj: any;
	@Input() listId: string;

	isLoggedIn: boolean = false;
	selectedGlobalCountry: string = 'uk';
	selectedGlobalCurrency: string = 'GBP';
	listDataBool: boolean = true;
	hideExportButton: boolean = true;
	showDeleteButton: boolean = true;
	getCbilsData: Array<any> = [];
	selectedCompany: Array<any> = [];
	hideSocialLinks: boolean = false;
	userDetails: Partial< UserInfoType > = {};
	subscribedPlanModal: any = subscribedPlan;
	showUpgradePlanDialog: boolean = false;
	showUpgradePlanDialogForClientuser: boolean = false;
	selectedTradingAddressDataSelectAll: boolean = false;
	selectAll: boolean = false;
	showLoginDialog: boolean = false;
	featureCurrentPlan: string;
	firstLazyEventClone: any;
	totalNumOfRecords: number = 0;
	estimated_turnover_total: number;
	netWorth_total: number;
	turnover_total: number;
	checkCount: number = 0;
	companyId: string;
	displayModal: boolean;
	scoreDisplayModal: boolean;
	mAndADisplayModal: boolean;
	listArr = [];
	filterList: string = "";
	favList: any;
	ListArrayData: any;
	listArray = [];
	listboxReset: boolean = true;
	value: any;
	val: any;
	topPos: any;
	CompanyForAddList: any = [];
	scoreDashboardDataArray: Array<any> = [];
	doughnutChartDatasets : object = {};
	doughnutChartOptions : object = {};
	recordsAfterFilter: boolean = false;
	showCompanySideDetails: boolean = false;
	exportCompanyDataDialog: boolean = false;
	exportTemplateDialog: boolean = false;
	corporateSideOverviewData: object;
	overviewName: string;
	csvDialog: boolean = false;
	csvDialogCustom: boolean = false;
	customEmailOrNotdialog: boolean = false;
	customNameOrNotdialog: boolean = false;
	customEmail: boolean = false;
	showHideCustomNameField: boolean = false;
	thisPageExportTemplateBool: boolean = false;
	customName: boolean = false;
	toMail: string = '';
	chargesCSVMessage: string = '';
	exportData: any;
	exportCSVDialogMessage: string = undefined;
	limitUpgradeMessage: string = undefined;
	exportCondition: boolean = false;
	sendingMail: boolean = false;
	newLimit: number = undefined;
	titleRegisterHit: string = undefined;
	selectedCompanyData: Array<any> = [];
	appliedFiltersKeys: Array<any> = [];
	appliedFiltersDirectorsChipValuesArray: Array<any> = [];
	obj: any = [];
	msgs = [];
	templateMsgs = [];
	createTempmsgs = [];
	no_show_user_management: boolean = true;
	relatedStatsBoolean: boolean;
	exportListDynamicName: string;
	exportListDynamicNameCustom: string;
	companySideDetailsParams: any = { companyNumber: undefined, companyName: undefined };
	activeModel: string = '';
	newCreateListName: string = "";
	isDisabled: boolean;
	arrayNationality: any = [];
	rows: number = 25;
	first: number = 0;
	sortOn: Array<any> = [];
	userUpdateDialogBoolean = false;
	userManagementRowData: any = { username: undefined, email: undefined, postCode: undefined, landLimit: undefined, postalCode: undefined, companyReport: undefined, advancedLimit: undefined, corpLandLimit: undefined };
	subscriptionEndDate: any;
	tempsubscriptionEndDate: any;
	minYear: any;
	tempUserManagementRowData: Object = {};
	socialNetworkCount: Object = {};
	userUpdateSpinner: boolean = false;
	exportAll: string = "";
	customEmailId: string = "";
	customFileName: string = "";
	quickInfoData: any;
	newTableObj: any;
	SubscriptionStartDateValue: Date;
	SubscriptionEndDateValue: Date;
	LastLoginDateValue: Date;
	todayDate = new Date();
	maxYear = this.todayDate.getFullYear() + 50;
	userListTable: any = undefined;
	infoIconFeatures: any;
	userUpdateDialog: any = undefined;
	prepExportData: any;
	selectedFinancialData: string[] = [];
	companyNumberToGrowthInsights : any;
	activeModelForApiHit : string = '';

	selectedCompaniesData: string[] = ['companyName', 'companyNumber', 'incorporationDate', 'SICCodes', 'industryTag', 'status', 'address'];
	selectedCompaniesDataSelectAll: boolean = false;
	selectedDirectorsData: string[] = [];
	selectedContactInformationData: string[] = [];
	selectedDirectorsDataSelectAll: boolean = false;
	selectedConatctInformationDataSelectAll: boolean = false;
	selectedPSCsData: string[] = [];
	selectedPSCsDataSelectAll: boolean = false;
	selectedShareholdersData: string[] = [];
	selectedShareholdersDataSelectAll: boolean = false;
	showEstimateTotalBox: boolean = false;
	selectedChargesData: string[] = [];
	selectedTradingAddressData: string[] = [];
	selectedFinancialDataSelectAll: boolean = false;
	selectedChargesDataSelectAll: boolean = false;
	completeSelectAll: boolean = false;
	exportFilteredDataBool: boolean = false;
	customExportType: any;
	limitDisplayForCustomExport: any;
	toBeExportedCount: any;
	exportAllCondition: boolean = false;
	isFeatureAccessCompanyStatus: boolean;
	//Calender Models Var
	companyRegistrationDatePickValue: Date;
	dateProprietorAddedPickValue: Date;
	landRegistryDatePickValue: Date;
	//filters variables
	companyStatusArray: Array<DropdownOptionsType> = RequiredConstant.companyStatusOptions;
	PropertyTypeArray: Array<DropdownOptionsType> = RequiredConstant.PropertyTypeOptions;
	landTenureArray: Array<DropdownOptionsType> = RequiredConstant.landTenureOptions;
	buildTypeArray: Array<DropdownOptionsType> = RequiredConstant.buildTypeOptions;
	sortedFields: any;
	companyStatusModel: string[];
	listDataValuesBoolean: boolean = true;
	createTemplateBool: boolean = undefined;
	listDataValuesFilteredBoolean: boolean = true;
	inputFieldDisplay: boolean = false;
	dateForName: string;
	fileNameError: boolean = false;
	filterSearchArray: Array<any> = [];
	showSortingIcon: Boolean = false;
	newUpdatedColumns: Array<any> = [];
	showListButton: boolean = true;
	emailPattern = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$";
	emailValidateBool: boolean = false;
	exportCountCharges: any;
	crmExportMessage: string = "";
	cbfExportMessage: string = "";
	// checkDissolved: boolean = false;
	// checkLiquidation: boolean = false;
	userTemplateModel: boolean = false;
	directorsName: string;
	exportCSVDownload: any;

	titileRegisterDialog: boolean = false;
	hasTitleRegisterLimit: number;
	exportAllButton: boolean = false;
	templateJsonData: any[];
	templateName: any;
	timeout: any = null;
	showInputFieldMessage: boolean = false;
	tempField: string;
	salesForceConstant: any = SalesForceConstant;
	PropertyTypeModel: any;
	buildTypeModel: any;
	landTenureModel: any;
	templateJsonCols: Array<any> = [];
	csvDialogCustomForUserTemplate: boolean = false;
	userTemplateLimitUpgrade: boolean = false;
	templateJson: Array<any> = [];
	selectTemplateJson: {};

	constantMessages: any = UserInteractionMessages;
	JSON: any = JSON;
	companyName: string;
	companyNumber: string;

	tempSourceData: any[];
	selectedAvailableLists: any[];
	createTemplateBlock: boolean = false;
	fieldValidateForm: boolean = false;
	tempTemplalateJsonData: any;
	template_name: string;
	userDefinedCompanyName: string;
	pageNameFromStats: string;
	userDefinedCompanyNumber: string;
	msgs1: any[];
	sendObjForUserTemplate: object = {};
	showInptField: boolean;
	headerName: any;
	// appliedFiltersForSavedList: any[];
	statsListPageUrl: {};
	showHeaderObj: object = {};
	preparedPayloadBody: PayloadFormationObj = {};
	cListNameToWords: string = '';
	showDialog: boolean = false;
	// showDialogAfterImport: boolean = false;
	showDialogForListName: boolean = false;
	isAuthenticatedWithHubspot: boolean = false;
	// importCompanyCounts: number;
	listNameForHubSpot: string;
	moreButtonListItems: MenuItem[];
	userLimit: any;
	growthIndexColor = [ 'yellow', 'purple', 'orange', 'green' ];
	messageCountForTable: number = null; 
	dialogForBenchmarking: boolean = false;
	dialogForMAndA: boolean = false;
	
	constructor(
		private commonService: CommonServiceService,
		private searchFiltersService: SearchFiltersService,
		private router: Router,
		public activeRoute: ActivatedRoute,
		private titlecasePipe: TitleCasePipe,
		private userAuthService: UserAuthService,
		private confirmationService: ConfirmationService,
		private toCurrencyPipe: CurrencyPipe,
		private toNumberSuffix: NumberSuffixPipe,
		private formatDataForExport: FormatDataRecordListService,
		private sharedLoaderService:SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService,
		public searchCompanyService: SearchCompanyService
	) {
		super();
	}

	/*
        # For components used in workflow module have below page names:         
        -----------------------------------------------
           General Name  |   Name used in payloads
           
            Clients      >   Business Collaborators
            Suppliers    >   Procurement Partners
            Prospects    >   Potential Leads
            Accounts     >   Fiscal Holdings
    */

	ngOnInit() {
		const { compNum, cListId, listName, listPageName } = JSON.parse( JSON.stringify( this.activeRoute.snapshot.queryParams ) );

		this.showHeaderObj = {
			listId: cListId,
			listName: this.updatedListName( listName ),
			listPageName: this.changeCharacterFirstToUpperCase(listPageName)
		};

        this.userAuthService.isLoggedInSubject$.pipe( takeUntil( this.unsubscribe$ ) ).subscribe( ( loggedIn: boolean ) => {
			this.isLoggedIn = loggedIn;

			if ( this.isLoggedIn ) {
				this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';
				this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';
				this.userDetails = this.userAuthService?.getUserInfo();
				this.isFeatureAccessCompanyStatus = this.userAuthService.hasFeaturePermission('Company Stats');
				this.messageCountForTable = this.selectedGlobalCountry != 'uk' ? 1000 : 5000;
			}

		});

		
        this.searchCompanyService.$apiPayloadBody.subscribe( res => {
			this.preparedPayloadBody = res;
			
			if ( this.activeRoute.snapshot.queryParams['listPageName'] == 'otherRelatedCompanies' || this.activeRoute.snapshot.queryParams['showStatsButton'] == "true" ){
				this.statsListPageUrl = { ...this.statsListPageUrl, cListId: this.activeRoute.snapshot.queryParams['cListId'], listPageName: this.activeRoute.snapshot.queryParams['listPageName'], relatedStatsBoolean: true };
				
			} else if ( this.searchCompanyService.showStatsButton ) {
				this.statsListPageUrl = { chipData: JSON.stringify( this.preparedPayloadBody.filterData ) };
				let selectedSaveList = this.preparedPayloadBody.filterData.filter( item => item.chip_group == 'Saved Lists' )[0];
				
				if ( this.preparedPayloadBody.listId ) {
					this.statsListPageUrl = { ...this.statsListPageUrl, cListId: this.preparedPayloadBody.listId, listPageName: listPageName || ListPageName?.company?.inputPage, listName: listName || selectedSaveList?.chip_values?.[0] };
				}
			}

        });

		// If any column added or values updated manually
		if( this.columnToggleData ) this.newUpdatedColumns = [ ...this.columnToggleData ];
		// ./If any column added or values updated manually


		if (this.thisPage === 'user-management') {
			this.no_show_user_management = false;
		}

		if ( this.userDetails?.planId !== this.subscribedPlanModal['Start'] && [ 'related_Companies', 'related_Directors' ].includes( this.thisPage ) ) {
			this.showSortingIcon = true;
		}

		// Only for documents download
		if ( compNum && this.thisPage == 'companyDocumentsPage' ) {
			const params = { ...this.activeRoute.snapshot.queryParams };

			this.downloadDocumentIntoNextPage(params.desc, params.metadata, params.compNum);

			this.router.navigate([]);
		}

		if ( this.preparedPayloadBody.listId && this.thisPage == 'companySearch' ) {
			this.hideExportButton = false;
			this.showDeleteButton = true;
			this.showListButton = false;
			this.sharedLoaderService.showLoader();
		} else if ( this.thisPage == 'workflowListPage' ) {
			this.showDeleteButton = true;
		} else {
			this.showDeleteButton = false;
		}

		document.body.addEventListener('mouseover', (event: any) => {
			if (!event.currentTarget.classList.contains('infoName')) {
				this.hideCompanyQuickInfoPopover();
			}
		});


		this.templateJsonCols = [
			{ field: 'downloadTemplate', header: 'Action', width: '18px', textAlign: 'center' },
			{ field: 'templateName', header: 'Template Name', width: '60px', textAlign: 'left' },
			{ field: 'templateJson', header: 'Fields', width: '200px', textAlign: 'left' },
			{ field: 'deleteTemplate', header: 'Action', width: '50px', textAlign: 'center' },
		];

		if (this.thisPage == 'landCorporate') {
			this.exportListDynamicName = "DG_Property_Register_Export_" + new Date().getTime();
		} else if (this.thisPage == 'landRegistry') {
			this.exportListDynamicName = "DG_Land_Registry_Export_" + new Date().getTime();
		} else if( this.selectedGlobalCountry != 'uk') {
			this.exportListDynamicName = "DG_Company_Search_Export_Ireland_" + new Date().getTime();
		} else {
			this.exportListDynamicName = "DG_Company_Search_Export_" + new Date().getTime();
		}

		this.changeCharacterFirstToUpperCase(listPageName);

		this.moreButtonListItems = [
            { label: 'Push To Salesforce', icon: 'pi pi-cog', disabled: !this.isLoggedIn || this.userDetails?.isTrial, command: () => { this.syncDataToSalesforce() } },
            { label: 'Push To HubSpot', icon: 'pi pi-cog', disabled: !this.isLoggedIn || this.userDetails?.isTrial, command: () => { this.checkPlanStatus( 'hubspot' ) } },
            { label: 'Push to Leasepath', icon: 'pi pi-cog', disabled: !this.isLoggedIn || this.userDetails?.isTrial, command: () => { this.pushLeasepath() } },
        ];
		
	}

	updatedListName ( listNametoModifyForWorkflow ) {
		return listNametoModifyForWorkflow =='Business Collaborators' ? 'Clients List' : listNametoModifyForWorkflow=='Procurement Partners' ? 'Suppliers List' : listNametoModifyForWorkflow=='Potential Leads' ? 'Prospects List' : listNametoModifyForWorkflow=='Fiscal Holdings' ? 'Accounts List' : listNametoModifyForWorkflow;
	}

	changeCharacterFirstToUpperCase( inputString ) {
		if(inputString) {
			this.cListNameToWords = inputString.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1).join(' ').replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
		}

		if ( ['Company  Linked In'].includes( this.cListNameToWords ) ) {
			this.cListNameToWords = 'Company LinkedIn';
		}

		if ( ['Business Collaborators', 'Procurement Partners', 'Potential Leads', 'Fiscal Holdings'].includes( this.cListNameToWords ) ) {
			return this.cListNameToWords =='Business Collaborators' ? 'Clients List' : this.cListNameToWords=='Procurement Partners' ? 'Suppliers List' : this.cListNameToWords=='Potential Leads' ? 'Prospects List' : this.cListNameToWords=='Fiscal Holdings' ? 'Accounts List' : this.cListNameToWords;
		}

		return this.cListNameToWords;
	}

	ngDoCheck() {

		if (this.activeRoute.snapshot.queryParams['cListId'] && this.thisPage == 'companySearch') {
			this.showDeleteButton = true;
			this.showListButton = false;
		} else if ( this.thisPage == 'workflowListPage' ) {
			this.showDeleteButton = true;
		} else {
			this.showDeleteButton = false;
			this.showListButton = true;
		}

		if (this.recordListPaginator && this.recordListPaginator.alwaysShow !== undefined) {
			if ( [ this.subscribedPlanModal['Start'], this.subscribedPlanModal['Valentine_Special'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Premium_Trial_48_Hours'] ].includes(this.userDetails?.planId) ) {
				this.recordListPaginator.alwaysShow = false;
			} else {
				this.recordListPaginator.alwaysShow = true;
			}
		}

	}

	ngAfterViewInit() {
		let elementsToUse = { recordListTable: this.recordListTable, recordListPaginator: this.recordListPaginator }
		this.operatingTable.emit(elementsToUse);

		if (([this.subscribedPlanModal['Monthly_Expand'], this.subscribedPlanModal['Expand_Annual_One_Year'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Expand_Annual_Two_Year'], this.subscribedPlanModal['Expand_New_Monthly'], this.subscribedPlanModal['Monthly_Expand_Paid_Test'], this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Expand'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Annually_Expand_Trial'], this.subscribedPlanModal['Monthly_Expand_Trial'], this.subscribedPlanModal['Expand_Weekly_Trial'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Compliance_Plan']].includes(this.userDetails?.planId) && this.userAuthService?.getUserInfo()?.isSubscriptionActive) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {

			this.getColumnPreference();

		} else {

			this.createTableColumns();

		}
	}

	ngOnChanges( changes: SimpleChanges ) {

		// this.appliedFilters = this.preparedPayloadBody.filterData;
		if( this.activeRoute?.snapshot?.queryParams['listPageName'] ){
			this.searchCompanyService.updatePayload( { pageName: this.activeRoute.snapshot.queryParams['listPageName'] } );
		}

		const { searchTotalCount, appliedFilters, defaultSearchData, listDataValues } = changes;

		if ( listDataValues && listDataValues.currentValue ) {

			this.selectedCompany = this.selectedCompany.filter( val => !!( this.listDataValues.find( listRegNum => listRegNum.companyRegistrationNumber == val.companyRegistrationNumber ) ) );

			if ( this.selectedCompany.length ) {
				this.CompanyForAddList = this.selectedCompany.map( val => val.companyRegistrationNumber );
			} else {
				this.CompanyForAddList = [];
			}

		}

		if ( searchTotalCount && searchTotalCount.currentValue > 10000 ) {
			if ( ![ this.subscribedPlanModal['Start'], this.subscribedPlanModal['Valentine_Special'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Premium_Trial_48_Hours'] ].includes( this.userDetails?.planId ) ) {
				
				this.totalNumOfRecords = 10000;

			}
		} else if ( searchTotalCount ) {
			this.totalNumOfRecords = this.searchTotalCount
		}

		if ( ![ this.subscribedPlanModal['Start'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Premium_Trial_48_Hours'] ].includes( this.userDetails?.planId ) && defaultSearchData ) {
			if ( !defaultSearchData.currentValue ) {
				this.showSortingIcon = true;
			} else {
				this.showSortingIcon = false;
			}
		}

		if ( appliedFilters && appliedFilters.currentValue && appliedFilters.currentValue.length ) {

			if (([this.subscribedPlanModal['Monthly_Expand'], this.subscribedPlanModal['Expand_Annual_One_Year'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Expand_Annual_Two_Year'], this.subscribedPlanModal['Expand_New_Monthly'], this.subscribedPlanModal['Monthly_Expand_Paid_Test'], this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Expand'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Annually_Expand_Trial'], this.subscribedPlanModal['Monthly_Expand_Trial'], this.subscribedPlanModal['Expand_Weekly_Trial'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Valentine_Special'], this.subscribedPlanModal['Compliance_Plan']].includes(this.userDetails?.planId) && this.userAuthService?.getUserInfo()?.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] )) {

				this.getColumnPreference();

			} else {

				this.createTableColumns();
			}

			this.selectedCompany = [];
			this.companyStatusModel = [];

			if (this.filterSearchArray && this.filterSearchArray.length > 0) {
				this.filterSearchArray = [];
			}

			if (this.sortOn && this.sortOn.length > 0) {
				this.sortOn = [];
			}

		}

		if (this.thisPage === "related_Companies" || this.thisPage === "related_Directors") {

			if (changes['relCompDirDataValueStatus'] && changes['relCompDirDataValueStatus'].currentValue && this.recordListTable && this.recordListPaginator) {
				this.recordListTable.reset();
				this.recordListPaginator.first = 0;
			}

		}

		if( this.columnToggleData !== undefined ){
			this.columnToggleData = this.columnToggleData.filter(column => {
				if ( !['Phone', 'CTPS Registered'].includes(column.colunName)){
					return column;
				} else {
					if ( this.userAuthService.hasAddOnPermission('contactInformation') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
						return column;
	
					}
				}
			});
		}

		if( [ 'workflowListPage', 'relatedPartyIntel' ].includes( this.thisPage ) ){
			this.first = ( this.pageNumber || this.pageNumber == 0 ) ? this.pageNumber : 25;
			this.rows = this.pageSize ? this.pageSize : 0;
		} else {
			this.rows = this.preparedPayloadBody?.pageSize ? this.preparedPayloadBody?.pageSize : 25;
			this.first = this.preparedPayloadBody?.startAfter ? this.preparedPayloadBody?.startAfter : 0;
		}

		setTimeout(() => {
			for( let item of this.preparedPayloadBody?.filterData ) {
				if ( ( item?.chip_group != 'Saved Lists' && this.preparedPayloadBody?.filterData.length >= 2 ) || ( item?.chip_group == 'Saved Lists' ) ) {
					this.searchCompanyService.showStatsButton = true;
				} else {
					this.searchCompanyService.showStatsButton = false;
				}
			}
		}, 0);
	}

	override ngOnDestroy(): void {
        super.ngOnDestroy();
		
		// let toggleArray = JSON.parse(JSON.stringify(this.columnToggleData));
		// if ( (this.newUpdatedColumns.length == this.columnToggleData.length) && ( this.listColumns.length == this.newUpdatedColumns.length )) {

		// 	toggleArray.map( res => res.value = true );
		// }

		// if (  !this.listColumns.length ) {
		// 	toggleArray.map( res => res.value = false );
		// }
		
		// if ( !( this.columnsArraysAreSame( this.newUpdatedColumns, toggleArray ) ) ) {
		// 	this.saveColumnPreference( toggleArray );
		// }
	}

	MonitorForWorkflow( monitorData, action? ) {

		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['performAction'],
			header: action ==  true ? 'Monitor Company' : 'Demonitor Company',
			icon: 'pi pi-info-circle',
			key: 'crmConfirmationForRecordList',
			accept: () => {
				if ( monitorData.length ) {

					let filterArrayForCompanyNumber = monitorData.filter(  val => {
		
						if ( action && !val.isMonitored ) {
							return val.companyRegistrationNumber;
						}
		
						if ( !action && val.isMonitored ) {
							return val.companyRegistrationNumber;
						}
					} ).map( res => res.companyRegistrationNumber )
		
					let outputForMonitor = {
						companyNumbers: filterArrayForCompanyNumber,
						monitorBoolean: true,
						monitorActivation: action
					}
		
					if ( !filterArrayForCompanyNumber.length ) {
						this.msgs = [];
						let messagetask = action ? 'Companies are already on monitor' : 'Companies are already demonitored'
						this.msgs.push({ severity: 'warn', summary: messagetask });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					} else {
						this.tableOutputValues.emit( outputForMonitor );
					}
		
		
				} else {
					
					let outputForMonitor = {
						monitorBoolean: true,
						isAllMonitor: action
					}
		
					this.tableOutputValues.emit( outputForMonitor );
				}
		
				this.selectedCompany = [];
			}
		});

	}

	selectedCompanyMonitorForRow( monitorData, buttonClickFor? ) {

		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['performAction'],
			// header: buttonClickFor ==  'demonitoring' ? 'Monitor Company' : 'Demonitor Company',
			header: buttonClickFor == 'monitoring' ? 'Monitor Company' : 'Demonitor Company',
			icon: 'pi pi-info-circle',
			key: 'crmConfirmationForRecordList',
			accept: () => {
				let outputForMonitor = {
					companyNumbers: [ monitorData.companyRegistrationNumber ],
					monitorBoolean: true,
					monitorActivation: !monitorData.isMonitored
				}
				this.tableOutputValues.emit( outputForMonitor );
			}
		});

	}

	createTableColumns() {

		let directorFilterCheck: boolean = false, tempColumnArray = [];

		if (this.appliedFilters) {
			for (let filterObj of this.appliedFilters) {
				if (filterObj.chip_group == 'Director Name') {
					directorFilterCheck = true;
				}
			}

		}

		if (this.columnToggleData) {

			setTimeout(() => {

				tempColumnArray = this.columnToggleData.filter(column => {

					if ( column.colunName == ('Director Name') && directorFilterCheck ) {
						column.value = true;
					}

					return column.value;
				});


				this.listColumns = tempColumnArray;

				if ( this.listColumns.length ==  this.newUpdatedColumns.length ) {
					this.selectAll = true;
				} else {
					this.selectAll = false;

				}
				tempColumnArray = [];

			}, 0);

		}

	}

	changeColumnPreference( colList, selectedCols ) {
		
		// colList.map( item => item.value = false );

		// for (let col of selectedCols) {
		// 	for (let listCol of colList) {
		// 		if (listCol.colunName == col.colunName) {
		// 			col.value = true;
		// 		}
		// 	}
		// }

		if ( JSON.stringify( colList ).includes('sortOrder') ) {
			selectedCols.sort( (a, b) => a.sortOrder - b.sortOrder );
			colList.sort( (a, b) => a.sortOrder - b.sortOrder );
		}

		let setInterval;

		clearTimeout(setInterval);

		setInterval = setTimeout( () => {
			
			// let toggleArray = JSON.parse(JSON.stringify(this.columnToggleData));
			if ( (this.newUpdatedColumns.length == this.columnToggleData.length) && ( this.listColumns.length == this.newUpdatedColumns.length )) {
	
				this.listColumns.map( res => res.value = true );
				this.selectAll = true;
			} else {
				this.selectAll = false;
			}
	
			if (  !this.listColumns.length ) {
				this.listColumns = [];
			}
			
			this.saveColumnPreference( this.listColumns );

		}, 300 )

	}

	onSelectAllChange( event ) {
		// let toggleArray = JSON.parse(JSON.stringify(this.columnToggleData));
		if ( event.checked ) {
			this.columnToggleData.map( res => res.value = true );
			this.listColumns = [];
			this.listColumns = JSON.parse(JSON.stringify(this.columnToggleData))
			this.selectAll = true;
		} else {
			this.listColumns = [];
			this.columnToggleData.map( res => res.value = false );
			this.listColumns = this.columnToggleData.filter( column => column?.disabled );
			this.selectAll = false;
		}

		this.saveColumnPreference( this.listColumns );
	}

	private columnsObjectsAreSame( objA, objB ) {
		return typeof objA === 'object' && Object.keys( objA ).length > 0 ? Object.keys( objA ).length === Object.keys( objB ).length && Object.keys( objA ).every( key => this.columnsObjectsAreSame( objA[key], objB[key] ) ) : objA === objB;
	}

	columnsArraysAreSame( arrayA, arrayB ) {
		return ( arrayA && arrayA.length ) === ( arrayB && arrayB.length ) && arrayA.every( ( value, index ) => this.columnsObjectsAreSame( value, arrayB[ index ] ) );
	}

	getColumnPreference() {
		if ( ![ "related_Companies", "related_Directors", "otherRelatedCompanies", "workflowListPage", "relatedPartyIntel" ].includes( this.thisPage ) ) {

			let obj = [ this.thisPage ];

			this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_USER_API', 'getPreferences', obj ).subscribe( res => {

				if (res.body['status'] == 200) {

					this.columnToggleData = [];

					this.columnToggleData = res.body['results']['preferences'];

					if ( !( this.columnsArraysAreSame( this.newUpdatedColumns, this.columnToggleData ) ) && this.newUpdatedColumns ) {

						for (let newColumn of this.newUpdatedColumns) {

							if ( this.columnToggleData.length ) {
								let fieldArray = this.columnToggleData.map( res => res.field );
								if ( fieldArray.includes( newColumn.field ) ) {
									newColumn.value = true;
								} else {
									newColumn.value = false;
								}
							} else {
								newColumn.value = false;
							}

							// for (let column of this.columnToggleData) {

							// 	if (newColumn.colunName == column.colunName) {

							// 		newColumn.value = column.value;

							// 	}

							// }

						}

						this.columnToggleData = [ ...this.newUpdatedColumns ];

						// this.saveColumnPreference(this.columnToggleData);

					}

				}

				this.createTableColumns();

			}, err => {
				throw err;
			});
		}

	}

	saveColumnPreference(selectedCols) {

		let paramObj = {
			dbID: this.userDetails?.dbID,
			formName: this.thisPage,
			preferences: selectedCols
		};

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_USER_API', 'setPreferences', paramObj ).subscribe( res => {
			if (res.body['status'] == 200) {
				// this.getColumnPreference();
			}
		}, err => {
			throw err;
		});

	}

	checkSubscriptionAuth(conditionCheck, route) {

		if ( this.isLoggedIn ) {

			if (route) {
				if (!conditionCheck) {
					event.preventDefault();
					event.stopPropagation();
					if ( this.userAuthService.hasRolePermission( [ 'Client User' ] ) ) {
						this.showUpgradePlanDialogForClientuser = true;
					} else {
						this.showUpgradePlanDialog = true;
					}
				} else {
					let routeUrl: any;

					if (typeof route == 'string') {
						routeUrl = route;
					} else {
						routeUrl = this.router.serializeUrl(this.router.createUrlTree(route));
					}

					window.open(routeUrl, '_blank');
				}
			}
		} else {
			event.preventDefault();
			event.stopPropagation();
			this.showLoginDialog = true;
		}

	}

	calculateCompanyAge(dob) {
		return this.commonService.calculateAge(dob);
	}

	changeToDate(value: any): Date | null {
		if ((typeof value === 'string') && ((value.indexOf('-') > -1) || (value.indexOf('/') > -1))) {
			let str;

			if ((value.indexOf('-') > -1)) {
				str = value.split('-');
			} else if (value.indexOf('/') > -1) {
				str = value.split('/');
			}

			const year = Number(str[2]);
			const month = Number(str[1]) - 1;
			const date = Number(str[0]);

			return new Date(year, month, date);
		} else if ((typeof value === 'string') && value === '') {
			return new Date();
		}
		const timestamp = typeof value === 'number' ? value : Date.parse(value);
		return isNaN(timestamp) ? null : new Date(timestamp);
	}

	resetFilters(tableData) {

		if ( tableData ) {
			let tableDomElement = tableData.el.nativeElement.children[0],
				sortIcons = tableDomElement.querySelectorAll('.p-datatable-wrapper .p-sortable-column-icon'),
				filterSearchRowInputFields = tableDomElement.querySelectorAll('.p-datatable-wrapper .filterSearchRow input[type="text"]');

			if ( this.isLoggedIn ) {
				this.sortOn = [];

				tableData.reset();

				this.selectedCompany = [];
				this.showInputFieldMessage = false;

				// Date Pickers and Models
				this.dateProprietorAddedPickValue = null;
				this.landRegistryDatePickValue = null;
				this.companyRegistrationDatePickValue = undefined;
				this.LastLoginDateValue = undefined;
				this.SubscriptionStartDateValue = undefined;
				this.SubscriptionEndDateValue = undefined;
				this.landTenureModel = undefined;
				this.PropertyTypeModel = undefined;
				this.buildTypeModel = undefined;

				// Text Fields and Dropdown Models
				this.companyStatusModel = [];
				for (let icon of sortIcons) {
					icon.classList.value = 'p-sortable-column-icon pi pi-fw pi-sort-alt';
				}
				for (let inputField of filterSearchRowInputFields) {
					inputField.value = "";
				}

				let pageChangeEventObj = { page: 0, first: 0, rows: 25 };
				if (this.filterSearchArray && this.filterSearchArray.length > 0) {
					this.filterSearchArray = [];
				}
				if (this.sortOn && this.sortOn.length > 0) {
					this.sortOn = [];
				}
				this.pageChange(pageChangeEventObj);


			} else {
				event.preventDefault();
				event.stopPropagation();
				this.showLoginDialog = true;
			}
		}


	}

	childToParent(event) {
		this.getCbilsData = event;
	}

	formatDate(date) {
		return this.commonService.formatDate(date);
	}

	validateSearchField(event, field): any {

		let tempSpecialCharWithSpace = /[!@#$%^&*+/()]/g;
		let tempSpecialCharWithoutSpace = /[!@#$%^&*+/()\s]/g;
		let tempAlphabetValue = /[^a-zA-Z\s]+/g;

		this.tempField = field;
		const charCode = (event.which) ? event.which : event.keyCode;
		const specialChar = event.key;

		if (['active_directors_count', 'turnover_latest', 'NumMortCharges', 'CCJCount', 'numberOfEmployees', 'estimated_turnover', 'totalAssets_latest', 'totalLiabilities_latest', 'netWorth_latest', 'grossProfit_latest', 'Price_Paid', 'Cost'].includes(this.tempField)) {
			if (((charCode > 31 && charCode != 43 && charCode != 45) && (charCode < 48 || charCode > 57)) || specialChar.match(tempSpecialCharWithoutSpace)) {
				this.showInputFieldMessage = true;
				return false;
			}
			this.showInputFieldMessage = false;
			return true;
		} else if (['Tenure', 'directorName', 'companyType', 'Region', 'District', 'County', 'Town', 'County'].includes(this.tempField)) {
			if (specialChar.match(tempAlphabetValue)) {
				this.showInputFieldMessage = true;
				return false;
			}
			this.showInputFieldMessage = false;
			return true;
		} else if (['companyRegistrationNumber', 'PostCode', 'companyno_1'].includes(this.tempField)) {
			if (specialChar.match(tempSpecialCharWithoutSpace)) {
				this.showInputFieldMessage = true;
				return false;
			}
			this.showInputFieldMessage = false;
			return true;
		} else if (['transactionUniqueIdentifier', 'postcode', 'paon', 'saon', 'street', 'locality', 'Title_Number', 'Postcode', 'Building_Name_No', 'SecondaryName', 'Street', 'Locality'].includes(this.thisPage)) {
			if (specialChar.match(tempSpecialCharWithSpace)) {
				this.showInputFieldMessage = true;
				return false;
			}
			this.showInputFieldMessage = false;
			return true;
		}

	}

	applyFilter(event, tableData, field, matchMode, filterKey) {

		if (this.subscribedPlanModal['Valentine_Special'].includes(this.userDetails?.planId)) {

			this.showUpgradePlanDialog = true;

		} else {

			clearTimeout(this.timeout);
			let $this = this;
			let obj = {};

			if (filterKey !== undefined) {
				if ( [ 'companyRegistrationDate', 'Date', 'transferDate' ].includes(field) ) {
					obj['value'] = this.commonService.formatDateSlash(event);
				} else if (field === 'Date_Proprietor_Added') {
					obj['value'] = this.commonService.formatDate(event);
				} else if ( [ 'propertyType', 'duration', 'oldOrNew', 'companyStatus' ].includes(field)) {
					let selectLabel = event.map(a => a.label)
					obj['value'] = selectLabel;
				} else {
					obj['value'] = event && event != "-" ? event : '';
				}
			} else {
				if (event.target.value.length > 0) {
					obj['value'] = event.target.value && event.target.value != "-" ? event.target.value : "";
				}
			}

			this.filterSearchArray = this.filterSearchArray.filter( val => val.field != field );

			if ( obj.hasOwnProperty('value') && obj['value'].length ) {
				obj['field'] = field;
				this.filterSearchArray.push(obj);
			}

			this.timeout = setTimeout(function () {
				let pageChangeEventObj = { page: 0, first: 0, rows: $this.rows };
				$this.pageChange(pageChangeEventObj);
			}, 1000);

		}

	}

	fetchTableData(tableData) {
		this.newTableObj = tableData;
		this.userListTable = this.newTableObj;
	}

	getFilterTableData() {
		let tempArrPropertyTypeArray = [];
		let tempArrLandTenureArray = [];
		let tempArrBuildTypeArray = [];
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

	formatPscAddress(address) {
		if (address === undefined) {
			return address;
		} else if (address === null) {
			return address;
		} else {
			return this.commonService.formatPscAddress(address);
		}
	}

	formatDirectorAddress(address) {
		if (address === undefined) {
			return address;
		} else if (address === null) {
			return address;
		} else {
			return this.commonService.formatDirectorAddress(address);
		}
	}

	getSICCodeInArrayFormat(SICCode) {
		return this.commonService.getSICCodeInArrayFormat(SICCode);
	}

	downloadLrmSamplePdf() {

		if ( this.isLoggedIn ) {

			this.globalServerCommunication.getDataFromJSON( 'samplePdf.json' ).subscribe( res => {
				const linkSource = 'data:application/pdf;base64,' + res.pdf;
				const downloadLink = document.createElement("a");
				const fileName = "DG_SampleTitleRegister.pdf";

				downloadLink.href = linkSource;
				downloadLink.download = fileName;
				downloadLink.click();

			});

		} else {
			this.showLoginDialog = true;
		}
	}

	downloadDocumentIntoNextPage(description, document_metadata, CompanyNumber) {
		let document_name: string = description + CompanyNumber + ".pdf";

		let obj = {
            metadata: document_metadata + '/content',
            doc_name: document_name
        };
		this.globalServerCommunication.globalServerRequestCall('post', 'DG_API', 'getDocument', obj).subscribe(res => {
			if (res.status === 200) {
				if (res.body["document_url"]) {
					let url: string = res.body["document_url"];
					this.downloadDocument(url, document_name);
				}
			}
		},
			error => {
			}
		);
	}

	downloadDocument(document_url, document_name) {
		var link = document.createElement('a');
		link.href = document_url;
		link.download = document_name;
		link.click();
	}

	showCompanySideDetailsPanel(e: Event, compNumber, compName, rowData, tabRoute?, scrollToDivId?: string) {
		e.stopPropagation();
		e.preventDefault();
		localStorage.setItem( "scrollToDivId", scrollToDivId );
		this.operatingTable.emit({ requestFor: 'SidePanel', compNumber: compNumber, compName: compName, rowData: rowData, tabRoute: tabRoute });
	}

	showCompanyQuickInfoPopover(event, dataObj) {
		this.quickInfoData = dataObj;

		if (event.currentTarget.classList.contains('infoName')) {

			let targetElm = event.currentTarget,
				elmPositions = targetElm.getBoundingClientRect();

			setTimeout(() => {
				this.companyQuickInfoPopover.nativeElement.style.visibility = 'visible';

				let popoverElm = this.companyQuickInfoPopover.nativeElement;

				if ((elmPositions.top + elmPositions.height) > (window.innerHeight - (window.innerHeight / 4))) {

					// Assigning Top Position
					popoverElm.style.top = (elmPositions.top - popoverElm.scrollHeight + elmPositions.height) + 'px';

					// Assigning Left Position
					if (elmPositions.left > (window.innerWidth - (window.innerWidth / 3))) {
						popoverElm.style.left = (elmPositions.left - popoverElm.offsetWidth) + 'px';
					} else {
						popoverElm.style.left = (elmPositions.left + elmPositions.width + 5) + 'px';
					}

				} else if ((elmPositions.top + elmPositions.height) > (window.innerHeight - (window.innerHeight / 3))) {

					// Assigning Top Position
					popoverElm.style.top = (elmPositions.top - (popoverElm.scrollHeight / 2)) + 'px';

					// Assigning Left Position
					if (elmPositions.left > (window.innerWidth - (window.innerWidth / 3))) {
						popoverElm.style.left = (elmPositions.left - popoverElm.offsetWidth) + 'px';
					} else {
						popoverElm.style.left = (elmPositions.left + elmPositions.width + 5) + 'px';
					}

				} else {

					// Assigning Top Position
					popoverElm.style.top = (elmPositions.top + elmPositions.height + 5) + 'px';

					// Assigning Left Position
					if (elmPositions.left > (window.innerWidth - (window.innerWidth / 3))) {
						popoverElm.style.left = (elmPositions.left - popoverElm.offsetWidth) + 'px';
					} else {
						popoverElm.style.left = (elmPositions.left - 20) + 'px';
					}

				}

				setTimeout(() => {
					popoverElm.style.opacity = 1;
					popoverElm.style.maxHeight = 500 + 'px';
				}, 200);

			}, 100);

		}
	}

	hideCompanyQuickInfoPopover() {
		if (this.companyQuickInfoPopover) {
			this.companyQuickInfoPopover.nativeElement.removeAttribute('style');
		}
	}

	getShowCompanySideDetailsOutputBoolValue($event) {
		this.showCompanySideDetails = $event;
	}

	linkedinURLForCompany(companyName) {
		return this.commonService.linkedinURLForCompany(companyName);
	}

	linkedInUrlForDirector(director_name, userUID) {
		var FinalName = " ";
		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_API', 'relatedCompanyToDirector', userUID ).subscribe( res => {
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
						let url = "https://www.linkedin.com/search/results/people/?firstName=" + this.firstName(director_name) + "&lastName=" + this.lastName(director_name) + "&keywords=" + FinalName;
						window.open(url, "_blank").focus();
					}
				}
			}
		})
	}

	goToDirectorNameLinkedIn(rowData) {
		if (rowData) {

			if (rowData['searchedDirectorsData']) {
				for (let director of rowData['searchedDirectorsData']) {

					let directorName = director.detailedInformation.fullName;
					let data = directorName.trim().split(' ');

					let firstname = this.titlecasePipe.transform(data[0]);
					let lastname = this.titlecasePipe.transform(data[1]);

					let url = "https://www.linkedin.com/search/results/people/?firstName=" + firstname + "&lastName=" + lastname;
					window.open(url, "_blank").focus();
				}
			}
		}
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

	GoogleURLCompanyURL(companyName) {
		return this.commonService.GoogleURLCompanyURL(companyName);
	}

	GoogleURLCompanyURLwithoutWordCompany(companyName) {
		return this.commonService.GoogleURLCompanyURLwithoutWordCompany(companyName);
	}

	AddCompanyList() {

		if ( this.isLoggedIn ) {

			this.getList();

		} else {
			event.preventDefault();
			event.stopPropagation();
			this.showLoginDialog = true;
		}

	}

	getList(pageSize?, pageNumber?): void {

		let apiRoute, apiEndpoint, reqobj;
		if ( this.thisPage == 'companyListOfIServiceCategoryPage' || this.thisPage == 'iScorePortfolioListPage' ) {
			apiRoute = 'DG_ISCORE',
			apiEndpoint = 'iscorePortfolioUserLists'
			// reqobj = [ this.userDetails?.dbID ]
		} else if ( this.thisPage == 'showChargesTablePage' ) {
			apiRoute = 'DG_LIST',
			apiEndpoint = 'getAblChargesUserList'
			// reqobj = [ this.userDetails?.dbID ]
		} else if (['personContactInfo', 'showContactScreen'].includes( this.thisPage ) ) {
			apiRoute = 'DG_LIST',
			apiEndpoint = 'contactUserList',
			reqobj = [ pageSize ? pageSize : 25, pageNumber ? pageNumber : 1 ]
		}else {
			apiRoute = 'DG_LIST',
			apiEndpoint = 'getUserLists',
			reqobj = [ pageSize ? pageSize : 25, pageNumber ? pageNumber : 1 ]
		}
		this.globalServerCommunication.globalServerRequestCall( 'get', apiRoute, apiEndpoint, reqobj ).subscribe( res => {
			let data = res;
			if (data.status === 200) {
				if (data.hasOwnProperty("body")) {
					var Obj: any = data.body.results;
					if (Obj.length > 0) {
						this.listArr = [];
						for (var i = Obj.length; i > 0; i--) {
							let listName, id, created, lastUpdated = "", companiesInList = 0;

							if (Obj[i - 1].hasOwnProperty("listName")) {
								listName = Obj[i - 1]["listName"];
							} else {
								listName = "";
							}

							if (Obj[i - 1].hasOwnProperty("_id")) {
								id = Obj[i - 1]["_id"];
							} else {
								id = "";
							}

							if (Obj[i - 1].hasOwnProperty("created")) {
								created = Obj[i - 1]["created"];
							} else {
								created = "";
							}

							if (Obj[i - 1].hasOwnProperty("lastUpdated")) {
								lastUpdated = Obj[i - 1]["lastUpdated"];
							} else {
								lastUpdated = "";
							}

							if (Obj[i - 1].hasOwnProperty("companiesInList")) {
								companiesInList = Obj[i - 1]["companiesInList"];
							} else {
								companiesInList = 0;
							}

							this.listArr.push({
								listName: listName,
								id: id,
								created: created,
								lastUpdated: lastUpdated,
								companiesInList: companiesInList
							});

						}
						this.displayModal = true;
						this.ShowingListData();
					}
				}
			}
		}
		);
	}

	selectList(data) {

		this.ListArrayData = [];
		for (let i = 0; i < this.selectedCompany.length; i++) {
			this.CompanyForAddList.push(this.selectedCompany[i].companyRegistrationNumber);
		}
		var obj = {
			userId: this.userDetails?.dbID,
			listName: data.listName,
			_id: data.id,
			companies: this.CompanyForAddList
		};

		let apiRoute, apiEndpoint;
		if ( this.thisPage == 'I-Service Category' ) { 
			apiRoute = 'DG_ISCORE',
			apiEndpoint = 'iscoreCompaniesPortfolioList';
		} else if ( this.thisPage == ListPageName.charges.inputPage ) {
			apiRoute = 'DG_LIST',
			apiEndpoint = 'ablChargesUserList';
		} else if ( ['showContactScreen', 'personContactInfo'].includes( this.thisPage ) ) {
			apiRoute = 'DG_LIST',
			apiEndpoint = 'updateContactUserList';
		} else {
			apiRoute = 'DG_LIST',
			apiEndpoint = 'editListOrAddCompanies';
		}
	
		this.globalServerCommunication.globalServerRequestCall( 'post', apiRoute, apiEndpoint, obj ).subscribe(res => {
			let data = res;
			this.selectedCompany = [];
			this.CompanyForAddList = [];
			if (data.status === 200) {

				this.displayModal = false;
				if (data.body["nModified"] === 0) {
					this.msgs.push({ severity: 'success', summary: 'message', detail: 'Companies are already associated with this list' });
					setTimeout(() => {
						this.msgs = [];
					}, 3000);
				} else {
					this.msgs.push({ severity: 'success', detail: this.constantMessages['successMessage']['addToListMessage'] });
					setTimeout(() => {
						this.msgs = [];
					}, 3000);
				}
			} else if (data.status === 201) {

				this.displayModal = false;
				this.msgs.push({ severity: 'success', detail: this.constantMessages['errorMessage']['companyAlreadyExist'] });
				setTimeout(() => {
					this.msgs = [];
				}, 3000);
			}
		}, error => {
			this.msgs.push({ severity: 'success', summary: 'message', detail: 'Companies are not added!' });
			setTimeout(() => {
				this.msgs = [];
			}, 3000);
		}
		);
	}

	keyupSearch(event) {
		this.newCreateListName = event._filterValue
		for (let i = 0; i < this.listArray.length; i++) {
			let listName = this.listArray[i]["name"]
			if (listName.includes(this.newCreateListName)) {
				this.recordsAfterFilter = false;
				break;

			} else {
				this.recordsAfterFilter = true;
			}
		}
	}

	ShowingListData() {
		this.listArray = [];
		for (let i = 0; i < this.listArr.length; i++) {
			this.listArray.push({
				"name": this.listArr[i].listName + " (" + this.listArr[i].companiesInList + ")",
				"id": this.listArr[i].id, "listName": this.listArr[i].listName
			})
		}
		this.favList = this.listArray;
	}

	formatCompanyNameForUrl(companyName) {
		return this.commonService.formatCompanyNameForUrl(companyName);
	}

	formatDirectorNameForUrl(directorName) {
		return this.commonService.formatDirectorNameForUrl(directorName);
	}

	createNewList() {
		var userId = this.userDetails?.dbID;
		this.recordsAfterFilter = false;
		this.isDisabled = true;
		let obj = {
			listName: this.newCreateListName,
			userId: userId,
			page: this.thisPage
		};

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'addListForAUser', obj ).subscribe( res => {
			let data = res.body;
			if (data.status === 200) {
				this.listArr.unshift({
					listName: data['body']['listName'],
					id: data["body"]["_id"],
					created: data["body"]["created"],
					lastUpdated: data["body"]["lastUpdated"],
					companiesInList: data["body"]["companiesInList"].length,
				});

				let obj1 = {
					listName: data["body"]["listName"],
					id: data["body"]["_id"]
				};
				this.newCreateListName = "";

				this.selectList(obj1);


				this.listboxReset = false; setTimeout(() => (this.listboxReset = true), 0);
				this.displayModal = false;
				this.selectedCompany = [];
			}

		})
	}

	clearFilterField(event) {
		event._filterValue = ""
		this.recordsAfterFilter = true;
		this.displayModal = false;
	}

	checkKey(obj, key) {
		return obj.hasOwnProperty(key)
	}

	reduceExportLimit() {
		if (this.thisPage === "companySearch" || this.thisPage === "landRegistry" || this.thisPage === "landCorporate") {
			let obj = {
				userId: this.userDetails?.dbID,
				thisPage: this.thisPage,
				newLimit: this.newLimit,
				titleRegisterHit: this.titleRegisterHit
			}

			this.globalServerCommunication.reduceExportLimit(obj);

			this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getUserExportLimit' ).subscribe( res => {
				this.limitDisplayForCustomExport = res.body['advancedLimit'];
			});
		}

	}

	onTitleNumber(rowData) {
		// let obj = {
        //     // userId: this.userDetails?.dbID
        // }

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getUserExportLimit' ).subscribe( res => {

			const data = res.body.results[0];

			this.hasTitleRegisterLimit = data['titleRegisterHitLimit'];
			
			if ( this.hasTitleRegisterLimit == 0 || this.hasTitleRegisterLimit == null ) {
				this.titileRegisterDialog = true;
			} else {
				this.titileRegisterDialog = false;
				let titleNumber = rowData['Title_Number'];
				let propertyDescription = rowData['Property_Address'];
				let name = rowData['Proprietor_Name_1'];


				if (titleNumber != "" || titleNumber != null || titleNumber != undefined
					&& propertyDescription != "" || propertyDescription != null || propertyDescription != undefined
					&& name != "" || name != null || name != undefined) {

					this.newLimit = this.hasTitleRegisterLimit - 1;

					this.titleRegisterHit = "title_register_hit";

					let obj = {
						userID: this.userDetails?.dbID,
						titleNumber: titleNumber,
						propertyDescription: propertyDescription,
						name: name
					}

					this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LRM', 'officialCopyTitleKnown', obj ).subscribe( res => {
						const linkSource = 'data:application/pdf;base64,' + res.body.results;
						const downloadLink = document.createElement("a");
						const fileName = `${titleNumber}.pdf`;

						downloadLink.href = linkSource;
						downloadLink.download = fileName;
						downloadLink.click();
						this.msgs = [];
						this.msgs.push({ severity: 'info', summary: `PDF downloaded succesfully, You available limit is ${ this.hasTitleRegisterLimit - 1 }` });
						setTimeout(() => {
							this.msgs = [];
						}, 5000);
						this.reduceExportLimit();
					});
				}
				else {

					this.msgs = [];
					this.msgs.push({ severity: 'warn', summary: 'Error occurred while downloading' });
					setTimeout(() => {
						this.msgs = [];
					}, 5000);
				}
			}

		});
	}

	async chargesExportToCSV() {
		let tableData = this.exportData;
		let dataToExport: Array<any> = [];
		let companyNumberArray: Array<string> = [];
		let csv_array = [];
		if (tableData.selection.length > 0) {
			tableData.selection.forEach(selectedValue => {
				companyNumberArray.push(selectedValue.companyRegistrationNumber);
			});
		} else {
			tableData.value.forEach((companyData) => {
				companyNumberArray.push(companyData.companyRegistrationNumber);
			});
		}
		let obj = {
			"exportType": "charges",
			"cmpNoArray": companyNumberArray,
			"userId": this.userDetails?.dbID
		}
		this.globalServerCommunication.globalServerRequestCall('post', 'DG_API', 'exportData', obj ).subscribe(res => {
			let data = res.body;
			if (data.status == 200) {
				dataToExport = JSON.parse(JSON.stringify(data.results));
			}
			dataToExport = this.formatTableDataForChargesExport(dataToExport);
			for (let i = 0; i < dataToExport.length; i++) {
				let headers_present: any[] = [];
				let charges_obj: any, charges_temp_key: any;
				if (dataToExport[i]) {
					if (dataToExport[i].mortgagesObj !== undefined && dataToExport[i].mortgagesObj.length > 0) {
						charges_obj = this.returnChargesDataForCSV(dataToExport[i].mortgagesObj);
					}
				}
				for (var chargesData in charges_obj) {
					if (charges_obj.hasOwnProperty(chargesData)) {
						let obj = {};
						charges_temp_key = chargesData;
						obj["Company Number"] = dataToExport[i].companyRegistrationNumber.toString().toUpperCase();
						obj["Company Name"] = this.titlecasePipe.transform(dataToExport[i].businessName);
						obj["Person Entitled"] = this.returnValueForChargesinCsv(charges_obj[chargesData], chargesData, "persons_entitled");
						obj["Person Entitled (Raw)"] = this.returnValueForChargesinCsv(charges_obj[chargesData], chargesData, "persons_entitled_raw");
						obj["Charge Code"] = this.returnValueForChargesinCsv(charges_obj[chargesData], chargesData, "charge_code").toUpperCase();
						obj["Classification"] = this.returnValueForChargesinCsv(charges_obj[chargesData], chargesData, "classification");
						obj["Status"] = this.returnValueForChargesinCsv(charges_obj[chargesData], chargesData, "status");
						obj["Created On"] = this.returnValueForChargesinCsv(charges_obj[chargesData], chargesData, "created_on");
						obj["Satisfied On"] = this.returnValueForChargesinCsv(charges_obj[chargesData], chargesData, "delivered_on");
						obj["Registered On"] = this.returnValueForChargesinCsv(charges_obj[chargesData], chargesData, "registered_on");
						csv_array.push(obj);
					}
				}
			}
			const options = {
				fieldSeparator: ',',
				quoteStrings: true,
				decimalSeparator: '.',
				showLabels: true,
				filename: "Charges List",
				useTextFile: false,
				useBom: true,
				useKeysAsHeaders: true,
			};
			// const csvExporter = new ExportToCsv(options); //this method is depricated in new Version.
			const csvExporter = mkConfig(options);
			
			if (csv_array.length > 0) {

				// csvExporter.generateCsv(csv_array); //this method is depricated in new Version.
				const csv = generateCsv(  csvExporter )( csv_array )
				download( csvExporter )( csv )

				// let exportobj = {
				// 	userID: this.userDetails?.dbID,
				// 	pageName: "Charges_Data_Export",
				// 	data: csv_array,
				// 	exportCountCharges: this.exportCountCharges   //For Charges Export
				// };

				this.csvDialog = false;
				tableData.selection = []
				this.chargesCSVMessage = ""
				// this.personEntitled = []
				this.reduceExportLimit();
				this.msgs = [];
				this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['exportSuccess'] });
				setTimeout(() => {
					this.msgs = [];
					// this.uploadCsvToS3(exportobj, "charges");
				}, 5000);

			} else {
				this.csvDialog = false;
				this.chargesCSVMessage = "";
				this.msgs = [];
				this.msgs.push({ severity: 'warn', summary: 'No Selected Company Have Charges Details.' });
				setTimeout(() => {
					this.msgs = [];
				}, 5000);
			}
		});
		this.selectedCompany = [];
	}

	returnChargesDataForCSV(data) {
		if (this.personEntitled.length === 0 && this.personEntitledRaw.length === 0) {
			let charges = [];
			let obj: any = {};
			charges = data;
			charges.reverse();
			for (let i = 0; i < charges.length; i++) {
				let temp_array = [{
					charge_number: charges[i].charge_number !== undefined && charges[i].charge_number !== null ? charges[i].charge_number : "-",
					persons_entitled: this.person_entitled(charges[i].persons_entitled),
					persons_entitled_raw: this.person_entitled(charges[i].persons_entitled_raw),
					charge_code: charges[i].chargeCode !== undefined && charges[i].chargeCode !== null ? charges[i].chargeCode : "-",
					created_on: charges[i].created_on !== undefined && charges[i].created_on !== null ? charges[i].created_on : "",
					registered_on: charges[i].registered_on !== undefined && charges[i].registered_on !== null ? charges[i].registered_on : "",
					delivered_on: charges[i].delivered_on !== undefined && charges[i].delivered_on !== null ? charges[i].delivered_on : "",
					status: charges[i].status !== undefined && charges[i].status !== null ? this.titlecasePipe.transform(charges[i].status.replace(/-/g, " ")) : "-",
					classification: charges[i].classification !== undefined && charges[i].classification !== null ? this.titlecasePipe.transform(charges[i].classification) : "",
				}];
				if (obj.hasOwnProperty([charges[i].name])) {
					obj[charges[i].charge_number.push(temp_array[0])];
				} else {
					obj[charges[i].charge_number] = temp_array;
				}
			}
			return (obj);
		} else {
			let charges = [];
			let obj: any = {};
			charges = data;
			charges.reverse();
			for (let i = 0; i < charges.length; i++) {
				let objj = this.personEntitled.length !== 0 ? this.person_entitledCheck(this.personEntitled, this.person_entitled(charges[i].persons_entitled)) : undefined
				let objj_raw = this.personEntitledRaw.length !== 0 ? this.person_entitledCheck(this.personEntitledRaw, this.person_entitled(charges[i].persons_entitled_raw)) : undefined
				if (objj && objj.status) {
					let temp_array = [{
						charge_number: charges[i].charge_number !== undefined && charges[i].charge_number !== null ? charges[i].charge_number : "-",
						persons_entitled: objj['person_entitled'],
						persons_entitled_raw: charges[i].persons_entitled_raw !== undefined && charges[i].persons_entitled_raw !== null ? charges[i].persons_entitled_raw : "-",
						charge_code: charges[i].chargeCode !== undefined && charges[i].chargeCode !== null ? charges[i].chargeCode : "-",
						created_on: charges[i].created_on !== undefined && charges[i].created_on !== null ? charges[i].created_on : "-",
						registered_on: charges[i].registered_on !== undefined && charges[i].registered_on !== null ? charges[i].registered_on : "-",
						delivered_on: charges[i].delivered_on !== undefined && charges[i].delivered_on !== null ? charges[i].delivered_on : "-",
						status: charges[i].status !== undefined && charges[i].status !== null ? this.titlecasePipe.transform(charges[i].status.replace(/-/g, " ")) : "-",
						classification: charges[i].classification !== undefined && charges[i].classification !== null ? this.titlecasePipe.transform(charges[i].classification) : "-",
					}];
					if (obj.hasOwnProperty([charges[i].name])) {
						obj[charges[i].charge_number.push(temp_array[0])];
					} else {
						obj[charges[i].charge_number] = temp_array;
					}
				} else if (objj_raw && objj_raw.status) {
					let temp_array = [{
						charge_number: charges[i].charge_number !== undefined && charges[i].charge_number !== null ? charges[i].charge_number : "-",
						persons_entitled: charges[i].persons_entitled !== undefined && charges[i].persons_entitled !== null ? charges[i].persons_entitled : "-",
						persons_entitled_raw: objj_raw['person_entitled'],
						charge_code: charges[i].chargeCode !== undefined && charges[i].chargeCode !== null ? charges[i].chargeCode : "-",
						created_on: charges[i].created_on !== undefined && charges[i].created_on !== null ? charges[i].created_on : "-",
						registered_on: charges[i].registered_on !== undefined && charges[i].registered_on !== null ? charges[i].registered_on : "-",
						delivered_on: charges[i].delivered_on !== undefined && charges[i].delivered_on !== null ? charges[i].delivered_on : "-",
						status: charges[i].status !== undefined && charges[i].status !== null ? this.titlecasePipe.transform(charges[i].status.replace(/-/g, " ")) : "-",
						classification: charges[i].classification !== undefined && charges[i].classification !== null ? this.titlecasePipe.transform(charges[i].classification) : "-",
					}];
					if (obj.hasOwnProperty([charges[i].name])) {
						obj[charges[i].charge_number.push(temp_array[0])];
					} else {
						obj[charges[i].charge_number] = temp_array;
					}
				}
			}
			return (obj);
		}
	}

	person_entitled(array) {
		let person_entitled = "";
		if (array !== undefined) {
			array.forEach(name => {
				person_entitled = person_entitled + name + "\n";
			});
			person_entitled = person_entitled.substring(0, person_entitled.length - 1);
			return person_entitled;
		} else if (array === undefined) {
			return ("-");
		} else {
			return ''; 
		}
	}

	person_entitledCheck(appliedPersonEntitled, ChargePersonEntitled) {
		let ChargePersonEntitledArray = ChargePersonEntitled.split("\n")
		let newPersonApplied = ""
		let tempAppliedPersonEntitled = []
		appliedPersonEntitled.forEach(tempPersonEntitled => {
			tempAppliedPersonEntitled.push(tempPersonEntitled.replace(";", "").toLowerCase())
		});
		appliedPersonEntitled = [...tempAppliedPersonEntitled]
		ChargePersonEntitledArray.forEach(rowPE => {
			if (appliedPersonEntitled.includes(rowPE.toLowerCase())) {
				newPersonApplied = newPersonApplied + rowPE + "\n"
			}
		});
		newPersonApplied = newPersonApplied.substring(0, newPersonApplied.length - 1);
		if (newPersonApplied !== "") {
			let obj = {
				status: true,
				person_entitled: newPersonApplied.toString()
			}
			return obj
		} else {
			let obj = {
				status: false
			}
			return obj
		}
	}

	returnValueForChargesinCsv(array, charge_number, field_name) {
		for (let i = 0; i < array.length; i++) {
			if (array[i].charge_number == charge_number) {
				if (field_name === 'charge_code') {
					return array[i].charge_code;
				}
				if (field_name === 'persons_entitled') {
					return array[i].persons_entitled;
				}
				if (field_name === 'persons_entitled_raw') {
					return array[i].persons_entitled_raw;
				}
				if (field_name === 'status') {
					return array[i].status;
				}
				if (field_name === 'created_on') {
					return array[i].created_on;
				}
				if (field_name === 'registered_on') {
					return array[i].registered_on;
				}
				if (field_name === 'delivered_on') {
					return array[i].delivered_on;
				}
				if (field_name === 'classification') {
					return array[i].classification;
				}
			}
		}
	}

	async chargesLimitCheck(event, tableData) {

		if ( this.isLoggedIn ) {

			if (([this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Compliance_Plan']].includes(this.userDetails?.planId) && this.userAuthService?.getUserInfo()?.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] )) {
				if ( this.userAuthService.hasAddOnPermission('defaultExportFeature') ) {
					this.toMail = ""
					this.exportAll = ""
					this.chargesCSVMessage = ' CHARGES';
					let userData: any = await this.globalServerCommunication.getUserExportLimit();
					this.exportData = tableData;
					let data: Array<any> = [];
					let selectedCompanyIndexArray: Array<number> = [];
					let dataCount: number = 0;
					let message: string = undefined;

					if (tableData.selection.length > 0) {

						tableData.selection.forEach(selectedValue => {
							selectedCompanyIndexArray.push(tableData.value.indexOf(selectedValue));
						});
						selectedCompanyIndexArray.forEach(selectedIndex => {
							data.push(this.listDataValues[selectedIndex]);
						});

					} else {
						data = this.listDataValues;
					}

					data.forEach(company => {
						if (company.hasCharges) {
							dataCount += 1;
							this.exportCountCharges = dataCount;
						}
					});

					if (dataCount <= userData.advancedLimit) {
						this.exportCondition = true;
						this.newLimit = userData.advancedLimit - dataCount
					} else {
						this.exportCondition = false
					}

					if (this.exportCondition == true) {
						message = this.toCurrencyPipe.transform(dataCount, '', ' ', '1.0-0').toString() + this.constantMessages['successMessage']['exportSelectedMessage'];
						// this.exportDialog(event, message)
					} else if (this.exportCondition == false) {
						message = this.constantMessages['infoMessage']['noExportLimitMessage'];
						// this.exportDialog(event, message)
					}
				}
			} else {
				this.showUpgradePlanDialog = true;
			}

		} else {
			this.showLoginDialog = true;
		}

	}

	removeHyphen(str) {
		if (!(str == "null" || str == undefined || str == null)) {
			return str.replace(/-/g, " ")
		}
	}

	extractData(dataInit) {
		let dataArray: Array<any> = [];
		if (dataInit?.status == 200) {

			if (this.thisPage === "related_Companies") {
				this.listDataValues = dataInit['result'].relatedCompanies;
			} else if (this.thisPage === "related_Directors") {
				this.listDataValues = dataInit['result'].relatedDirectors;
			}
			else {
				for (let resultData of dataInit.results.hits) {
					dataArray.push(resultData._source);
				}

				if (dataArray.length == dataInit.results.hits.length) {

					this.listDataValues = this.formatDataForExport.formatData(dataArray, undefined, this.thisPage);
					this.getFilterTableData();
				}
			}
		} else {
			this.listDataValues = this.formatDataForExport.formatData(dataInit, undefined, this.thisPage);
		}

		return this.listDataValues;

	}

	/*
	// For Dissolved And Liquidation Toggle Button
	checkForDisslovedLiquidate(event, checkStatus) {

		if (event.checked && checkStatus == 'dissolved') {

			this.checkLiquidation = false;

			if (this.filterSearchArray.length) {
				this.filterSearchArray = [];
			}

			if (this.sortOn.length) {
				this.sortOn = [];
			}

		}

		if (event.checked && checkStatus == 'liquidation') {

			this.checkDissolved = false;

			if (this.filterSearchArray.length) {
				this.filterSearchArray = [];
			}
			if (this.sortOn.length) {
				this.sortOn = [];
			}

		}

		this.operatingTable.emit({ requestFor: checkStatus, [checkStatus]: event.checked });

	}
	*/

	pageChange(event?, tableData?) {

		this.pageInput = event;

		if (event.rows !== this.rows) {
			this.selectedCompany = [];
			this.rows = event.rows;
		}
		this.first = event.first;
		
		if ( this.thisPage == 'companySearch' ) {

			this.searchCompanyService.updatePayload({
				pageSize: event.rows,
				startAfter: event.first,
				sortOn: this.sortOn ? this.sortOn : [],
				filterSearchArray: this.filterSearchArray ? this.filterSearchArray : []
			});
			this.tableOutputValues.emit( 'company' );

		} else if ( this.thisPage == 'companySearchWithAI' ){

			this.searchCompanyService.updatePayload({
				pageSize: event.rows,
				startAfter: event.first,
				pageNumber: event.page + 1,
			});
			this.tableOutputValues.emit( event );

		} else if ( this.thisPage == 'landRegistry' ) {

			this.searchCompanyService.updatePayload({
				pageSize: event.rows,
				startAfter: event.first,
				sortOn: this.sortOn ? this.sortOn : [],
				filterSearchArray: this.filterSearchArray ? this.filterSearchArray : []
			});

			this.tableOutputValues.emit( this.thisPage );

			this.msgs = [];
			this.msgs.push({ severity: 'info', summary: this.constantMessages['infoMessage']['recordFetching'] });
			setTimeout(() => {
				this.msgs = [];
			}, 1000);

		} else if (this.thisPage == 'landCorporate') {
			this.searchCompanyService.updatePayload({
				pageSize: event.rows,
				startAfter: event.first,
				sortOn: this.sortOn ? this.sortOn : [],
				filterSearchArray: this.filterSearchArray ? this.filterSearchArray : []
			});

			this.tableOutputValues.emit( this.thisPage );

			this.msgs = [];
			this.msgs.push({ severity: 'info', summary: this.constantMessages['infoMessage']['recordFetching'] });
			setTimeout(() => {
				this.msgs = [];
			}, 1000);

		} else if (this.thisPage == 'related_Companies') {

			let obj = {
				"cmpNo": this.relatedDirectorsAndCompaniesCmpNo,
				'pageName': "relatedCompanies",
				'pageSize': event.rows,
				'pageNumber':event.page + 1,
				'sortOn': this.sortOn,
				'filterSearchArray': this.filterSearchArray ? this.filterSearchArray : []
			}
			this.globalServerCommunication.globalServerRequestCall('post', 'DG_API', 'relatedCompaniesAndDirectorsByCmpNoTableData', obj).subscribe({
				next: ( res ) => {
					this.extractData(res.body);
				},
				error: ( err ) => {
					throw err;
				}
			});

		} else if (this.thisPage == 'related_Directors') {

			let obj = {
				"cmpNo": this.relatedDirectorsAndCompaniesCmpNo,
				'pageName': "relatedDirectors",
				'pageSize': event.rows,
				'pageNumber':event.page + 1,
				'sortOn': this.sortOn,
				'filterSearchArray': this.filterSearchArray ? this.filterSearchArray : []
			}
			this.globalServerCommunication.globalServerRequestCall('post', 'DG_API', 'relatedCompaniesAndDirectorsByCmpNoTableData', obj).subscribe({
				next: ( res ) => {
					this.extractData(res.body);
				},
				error: ( err ) => {
					throw err;
				}
			});
		} else if ( this.thisPage == 'otherRelatedCompanies' ) {
			this.searchCompanyService.updatePayload({
				pageSize: event.rows,
				startAfter: event.first,
				pageNumber: event.page + 1,
			});
			this.tableOutputValues.emit( event );
		} else if ( [ 'workflowListPage', 'relatedPartyIntel' ].includes( this.thisPage ) ) {
			this.searchCompanyService.updatePayload({
				pageSize: event.rows,
				startAfter: event.first,
				pageNumber: event.page + 1,
			});
			this.tableOutputValues.emit( event );
		}

		// } else if ( this.thisPage == 'otherRelatedCompanies' ) {
		// 	this.sharedLoaderService.showLoader();
		// 	let paylodForOtherRelatedCompanies = {
		// 		pageName: "otherRelatedCompanies",
		// 		pageSize:  event.rows,
		// 		pageNumber: event.page + 1,
		// 		listId: this.activeRoute.snapshot.queryParams['cListId']
		// 	}

		// 	this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_API', 'otherRelatedCompaniesAPI', paylodForOtherRelatedCompanies ).subscribe({
		// 		next: ( res ) => {
		// 			this.extractData(res.body.result?.relatedCompanies);
		// 			setTimeout(() => {
		// 				this.sharedLoaderService.hideLoader();
		// 			}, 100);
	
		// 		},
		// 		error: ( err ) => {
		// 			setTimeout(() => {
		// 				this.sharedLoaderService.hideLoader();
		// 			}, 100);
		// 			console.log(err);
		// 		}
		// 	})
		// }

		// this.resetTableSortState( tableData );
	}

	resetTableSortState( tableData ) {
		
		tableData._sortField = null;
		tableData._sortOrder = 1;
		tableData._multiSortMeta = null;
		tableData.tableService.onSort(null);
		// tableData.value = this.initialData;
	}

	customSort(event: any, fieldName?: string) {

		if (this.subscribedPlanModal['Valentine_Special'].includes(this.userDetails?.planId)) {
			this.showUpgradePlanDialog = true;
		} else {

			let sortOrder: string = 'asc',
			tempObj: any = {};
	
			if (this.sortOn.length) {
				this.sortOn = [];
			}
			
			sortOrder = event.order == 1 ? 'asc' : 'desc';
			tempObj[event.field] = sortOrder;
			
			this.sortOn.push(tempObj);
			
			if (this.thisPage == 'companySearch') {
				
				let pageChangeEventObj = { page: 0, first: 0, rows: this.rows };
				this.pageChange( pageChangeEventObj );

			} else if (this.thisPage == 'landRegistry') {
				this.pageChange( {
					rows: this.rows,
					first: this.first,
				})

			} else if (this.thisPage == 'landCorporate') {
				this.pageChange( {
					rows: this.rows,
					first: this.first,
				})

			} else if (this.thisPage == 'related_Companies') {

				let reqobj = {
					"cmpNo": this.relatedDirectorsAndCompaniesCmpNo,
					'pageName': "relatedCompanies",
					'pageSize': event.rows ? event.rows : 25,
					'pageNumber':  event.page ? event.page + 1 : 1,
					'sortOn': this.sortOn,
					'filterSearchArray': this.filterSearchArray
				}
				this.globalServerCommunication.globalServerRequestCall('post', 'DG_API', 'relatedCompaniesAndDirectorsByCmpNoTableData', reqobj ).subscribe({
					next: ( res ) => {
						this.extractData(res.body);
					},
					error: (err ) => {
						throw err;
					}
				});
			} else if (this.thisPage == 'related_Directors') {
				let reqobj = {
					"cmpNo": this.relatedDirectorsAndCompaniesCmpNo,
					'pageName': "relatedDirectors",
					'pageSize': event.rows ? event.rows : 25,
					'pageNumber':  event.page ? event.page + 1 : 1,
					'sortOn': this.sortOn,
					'filterSearchArray': this.filterSearchArray
				}
				this.globalServerCommunication.globalServerRequestCall('post', 'DG_API', 'relatedCompaniesAndDirectorsByCmpNoTableData', reqobj ).subscribe({
					next: ( res ) => {
						this.extractData(res.body);
					},
					error: ( err ) => {
						throw err;
					}
				});
			}
		}
		
	}

	formatTableDataForChargesExport(data) {
		let tempArr = [...data]
		data = []
		for (let companyData of tempArr) {
			let tempMortgageArray = []
			if (companyData.mortgagesObj !== undefined && companyData.mortgagesObj !== null) {
				for (let charge of companyData.mortgagesObj) {
					let tempCharge = {};
					for (let key in charge) {
						if (key == "mortgageNumber") {
							// sortingArray.push(charge[key]);
							tempCharge["charge_number"] = charge[key];
						}
						else if (key == "createdDate") {
							if (charge[key] != null && charge[key] != undefined) {
								let createdDate = charge[key].split("/");
								tempCharge["created_on"] = charge[key];
							}
						}
						else if (key == "regDate") {
							if (charge[key] != null && charge[key] != undefined) {
								let regDate = charge[key].split("/");
								tempCharge["registered_on"] = charge[key];
							}
						}
						else if (key == "satisfiedDate") {
							if (charge[key] != null && charge[key] != undefined) {
								let satisfiedDate = charge[key].split("/");
								tempCharge["delivered_on"] = charge[key];
							}
						}
						else if (key == "memorandumNature") {
							if (["b", "f", "p", "r"].includes(charge[key])) {
								tempCharge["status"] = "Fully Satisfied";
								// satifiedCount++;
							}
							if (charge[key] == 's') {
								tempCharge["status"] = "Part Satisfied";
								// partialSatisfiedCount++;
							}
							if (["t", "u", "v", "w", "x", "y", "z", null, ""].includes(charge[key])) {
								tempCharge["status"] = "Outstanding";
								// outstandingCount++;
							}
						}
						else if (key == "mortgageDetails") {
							charge[key].forEach(details => {
								if (details.recordType == "persons entitled") {
									tempCharge["persons_entitled_raw"] = this.commonService.formatNameForPersonEntitled(details.description.split(";"));
									tempCharge["persons_entitled"] = this.commonService.formatNameForPersonEntitled(details.groupName.split(";"));
								}
								else if (details.recordType == "amount secured") {
									tempCharge["secured_details"] = details.description;
								}
								else if (details.recordType == "mortgage type") {
									tempCharge["classification"] = details.description;
								}
								else if (details.recordType == "mortgage detail") {
									tempCharge["particulars"] = details.description;
								}
							});

						}
						else {
							tempCharge[key] = charge[key]
						}
					}
					tempMortgageArray.push(tempCharge)

				}
			}
			companyData["mortgagesObj"] = tempMortgageArray
			data.push(companyData)

		}
		return data

	}

	formatWebsite(websiteParam) {

		if (!CustomUtils.isNullOrUndefined(websiteParam)) {
			let website = websiteParam;
			website = website.replace('https://', '');
			website = website.replace('http://', '');
			website = website.replace('www.', '');
			return website;
		}
		else return ""
	}

	dateForFileName() {
		let Fulldate = new Date();
		let date = Fulldate.getDate();
		let month = Fulldate.getMonth() + 1;
		let yearStr = Fulldate.getFullYear().toString();
		let hour = Fulldate.getHours();
		let minute = Fulldate.getMinutes();
		let second = Fulldate.getSeconds();
		let dateStr = '';
		let monthStr = '';
		let hourStr = '';
		let minuteStr = '';
		let secondStr = '';
		if (date < 10) {
			dateStr = '0' + date;
		}
		else {
			dateStr = date.toString();
		}

		if (month < 10) {
			monthStr = '0' + month;
		}
		else {
			monthStr = month.toString();
		}

		if (hour < 10) {
			hourStr = '0' + hour;
		}
		else {
			hourStr = hour.toString();
		}
		if (minute < 10) {
			minuteStr = '0' + minute;
		}
		else {
			minuteStr = minute.toString();
		}
		if (second < 10) {
			secondStr = '0' + second;
		}
		else {
			secondStr = second.toString();
		}

		let finalStr = dateStr + monthStr + yearStr + '_' + hourStr + minuteStr + secondStr;

		return finalStr;
	}

	formatDirectorFullName(rowData) {
		return rowData;
	}

	getMessage(event) {

		this.selectedCompany = [];

		if (event.status !== undefined && event.msgs !== undefined) {

			this.msgs = [];

			this.msgs.push({ severity: event.status, summary: event.msgs });

			setTimeout(() => {
				this.msgs = [];
			}, 4000);

		}

	}

	deleteCompanyInList() {

		for (let i = 0; i < this.selectedCompany.length; i++) {
			this.CompanyForAddList.push(this.selectedCompany[i].companyRegistrationNumber);
		}



		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['delete'],
			header: 'Delete Confirmation',
			icon: 'pi pi-info-circle',
			key: 'crmConfirmationForRecordList',
			accept: () => {

				if ( this.thisPage == 'workflowListPage' ) {
					this.tableOutputValues.emit( { companyNumbers: this.CompanyForAddList, type: 'deleteCompaniesFromList' } );
				} else {
					
					var obj = {
						listId: this.activeRoute.snapshot.queryParams['cListId'],
						companies: this.CompanyForAddList,
						deletePageName: this.activeRoute.snapshot.queryParams['listPageName']
					};

					let apiEndPoint = obj.deletePageName == 'contactListPage' ? 'updateUserContactCompaniesListById' : 'updateUserSaveCompaniesListById';
					this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', apiEndPoint, obj ).subscribe( res => {
						
						this.msgs = [];
						if (res.body.status === 200) {
							this.msgs.push({ severity: 'success', summary: "Companies In List Data deleted!!" });
							this.selectedCompany = []
							setTimeout(() => {
								this.msgs = [];
							}, 3000);
						} else {
							this.msgs.push({ severity: 'error', summary: "Companies In List Data not deleted!!" });
							setTimeout(() => {
								this.msgs = [];
							}, 3000);
						}
						let pageChangeEventObj = { page: 0, first: 0, rows: this.rows };
						this.pageChange(pageChangeEventObj);
					});

				}
			}
		});
	}

	syncDataToSalesforce() {
		let userId = this.userDetails?.dbID;

		if ( this.isLoggedIn ) {
			this.globalServerCommunication.globalServerRequestCall('get', 'DG_SALESFORCE', 'salesforceUserData', [ this.userDetails?.dbID ] ).subscribe(res => {
				let data = res.body;
				if (data.status === 200) {
					if (data.results[0]?.refreshToken) {
						let obj = {
							"refresh_token": data.results[0]?.refreshToken,
							"client_id": this.salesForceConstant.ClientId,
							"client_secret": this.salesForceConstant.SecrectKey,
							"filterData": this.activeRoute.snapshot.queryParams['cListId'] ? [] : this.appliedFilters,
							"sortOn": this.sortOn,
							"filterSearchArray": this.filterSearchArray,
							"listId": this.activeRoute.snapshot.queryParams['cListId'] || this.preparedPayloadBody.listId,
							"domain": data.results[0].domain,
							"apiKey": data.results[0].apiKey
						}
						this.globalServerCommunication.globalServerRequestCall('post', 'DG_SALESFORCE', 'syncSalesforceData', obj ).subscribe(res => {

							if (res.body.status === 200) {
								if (obj.listId) {
									let reqObj = {
										"listId": obj.listId,
										"userId": this.userDetails?.dbID
									}
									this.globalServerCommunication.globalServerRequestCall('post', 'DG_SALESFORCE', 'updateSalesforceBooleanApi', reqObj ).subscribe(response => {
										if (response.body.status === 200) {
											this.msgs = [];
											this.msgs = [{ severity: 'success', detail: res.body.access_token?.Message + "Warning! You can only transfer data from 'Live' status companies." }];
											setTimeout(() => {
												this.msgs = [];
											}, 7000);
										}
									});
								} else {
									this.selectedCompany = [];
									this.msgs = [];
									this.msgs = [{ severity: 'success', detail: res.body.access_token?.Message + "Warning! You can only transfer data from 'Live' status companies." }];
									setTimeout(() => {
										this.msgs = [];
									}, 7000);
								}
							} else {
								this.msgs = [];
								this.msgs = [{ severity: 'error', detail: 'Token has expired!!' }];
								setTimeout(() => {
									this.msgs = [];
								}, 4000);
							}
						});
					} else {
						this.msgs = [];
						this.msgs = [{ severity: 'info', detail: 'Please contact for salesforce integration!!' }];
						setTimeout(() => {
							this.msgs = [];
						}, 4000);
					}
				} else {
					this.msgs = [];
					this.msgs = [{ severity: 'info', detail: 'Please contact for salesforce integration!!' }];
					setTimeout(() => {
						this.msgs = [];
					}, 4000);
				}
			});
		} else {
			this.showLoginDialog = true;
		}
	}

	fetchByStringKey = function (o, s) {
		s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
		s = s.replace(/^\./, '');           // strip a leading dot
		var a = s.split('.');
		for (var i = 0, n = a.length; i < n; ++i) {
			var k = a[i];
			if (k in o) {
				o = o[k];
			} else {
				return;
			}
		}
		return o;
	}

	estimateStatusValue() {

		this.searchFiltersService.getStatsAggregation(this.appliedFilters, this.dissolvedIndex, false, this.rows, this.first, this.sortOn, this.filterSearchArray).then(data => {
			if (data['status'] == 200) {

				this.showEstimateTotalBox = true;

				this.estimated_turnover_total = this.toNumberSuffix.transform(data.results.estimated_turnover_total);
				this.netWorth_total = this.toNumberSuffix.transform(data.results.netWorth_total);
				this.turnover_total = this.toNumberSuffix.transform(data.results.turnover_total);
			}
		});
	}

	userTemplateChangeEvent(event) {
		this.selectTemplateJson = {};

		if (event.hasOwnProperty('checked') == true) {
			this.createTemplateBlock = false;
		}

	}

	closeDialogBox() {
		if (this.subscribedPlanModal['Valentine_Special'].includes(this.userDetails?.planId)) {
			this.resetFilters(this.recordListTable);
		}
	}

	//Success Message For Export
	successMessageForExport(event) {

		if (event) {
			this.sharedLoaderService.showLoader();

			this.msgs = [];
			this.msgs.push({ severity: event.severity, summary: event.message });

			setTimeout(() => {
				this.msgs = [];
				this.recordListTable.selection = [];
				this.sharedLoaderService.hideLoader();
			}, 5000);

			this.selectedCompany = [];

		}

	}

	thisPageExportTemplate(event) {
		this.thisPageExportTemplateBool = event;
	}

	showMessage(event) {
		this.msgs = [];
		this.msgs.push(event);

		setTimeout(() => {
			this.msgs = [];
		}, 3000);
	}

	unSelectList(event) {
		this.selectedCompany = event;
	}

	clickStatsButton(){
		if( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasFeaturePermission('Company Stats')){
			let url = this.router.serializeUrl(
				this.router.createUrlTree(['/company-search/stats-insights'],{ queryParams: this.statsListPageUrl } )
			);
			window.open( url, "_blank");
		}else if ( this.userAuthService.hasRolePermission( [ 'Client User' ] )){
			this.showUpgradePlanDialogForClientuser = true
		}else {
			this.showUpgradePlanDialog = true
		}
	}

	async checkCrmLimit( type: crmType ) {
		this.userLimit = await this.globalServerCommunication.getUserExportLimit();
		
		if ( this.userLimit.crmLimit > 0 ) {
			if ( this.selectedCompany.length <= this.userLimit.crmLimit ) {
				switch( type ){
					case 'hubspot':
						this.syncToHubSpot();
						break;
					
					// case 'salesforce':
					// 	this.syncDataToSalesforce();
					// 	break;
				}
			} else {
				this.msgs = [];
				this.msgs.push( { severity: 'info', summary: `You don't have enough CRM limit to push companies to ${type}. To upgrade limit please contact your administrator!` } );
				setTimeout(() => {
					this.msgs = [];
				}, 3000);
			}
		} else {
			this.msgs = [];
			this.msgs.push( { severity: 'info', summary: 'Your CRM limit is zero. To upgrade limit please contact your administrator!' } );
			setTimeout(() => {
				this.msgs = [];
			}, 3000);
		}
	}

	syncToHubSpot() {

		if ( this.userDetails?.isTrial ) {
			return;
		}

		let queryParam = [
			{ key: 'redirect_uri', value: `${ window.location.origin }/dg-authenticate` }
		];

		this.globalServerCommunication.globalServerRequestCall('get', 'HS_EXTENSION', 'checkToken', undefined, undefined, queryParam).subscribe(( res ) =>{

			if( res.body.status == 200 ) {
				// this.showDialog = true;

				if ( !this.activeRoute.snapshot.queryParams.cListId ) {
					this.showDialogForListName = true;
				}
				
				if( res.body.results['isAuthenticatedWithHubspot'] == true ) {
					
					this.isAuthenticatedWithHubspot = res.body.results['isAuthenticatedWithHubspot'];
					if ( this.activeRoute.snapshot.queryParams.cListId ) {
						this.pushCompaniesToHubSpot();
					}
				}

			} else if( res.body.status == 403 ) {
				if( res.body.results['isAuthenticatedWithHubspot'] == false ) {
					this.showDialog = true;
					setTimeout(() => {
						this.showDialog = false;
					}, 8000);
				}
			} else {
				this.sharedLoaderService.hideLoader();
			}
		});
		
	};

	pushCompaniesToHubSpot() {

		let responseData: PayloadFormationObj = {};
		
		let companiesToAdd = this.selectedCompany.map( company => company['companyRegistrationNumber'] || company['companyNumber'] );
		
		this.sharedLoaderService.showLoader();

		if ( this.isAuthenticatedWithHubspot == true ) {

			this.searchCompanyService.$apiPayloadBody.subscribe(res => {
				responseData = res;
			});

			responseData.filterData = responseData.filterData.filter((item) => item.chip_group != 'Status');
	
			let obj = {
				pageSize: this.rows ? this.rows : 25,
				startAfter: this.first ? this.first : 0,
				redirect_uri: `${ window.location.origin }/dg-authenticate`,
				filterData: responseData['filterData'],
				sourceType: this.listNameForHubSpot,
				isHubSpot: false
			}
	
			if ( responseData.listId || this.activeRoute.snapshot.queryParams.cListId ) {
				obj['filterSearchArray'] = responseData['filterSearchArray'];
				obj['sortOn'] = responseData['sortOn'];
				obj['startPlan'] = responseData['startPlan'];
				obj['listId'] = responseData.listId || this.activeRoute.snapshot.queryParams.cListId;
				obj['pageName'] = ListPageName[ this.searchCompanyService.getView() ]['outputPage'] || responseData.pageName;
				obj['companiesInList'] = companiesToAdd;
				obj['sourceType'] = this.activeRoute.snapshot.queryParams.listName;
			}
			
			if ( companiesToAdd.length ) {
				obj['companiesInList'] = companiesToAdd
			}
			
			this.globalServerCommunication.globalServerRequestCall('post', 'HS_EXTENSION', 'pushToHubSpot', obj).subscribe(( res ) =>{
				this.sharedLoaderService.hideLoader();
				
				if ( res.body.status == 200 ) {
					this.msgs = [];
					// this.importCompanyCounts = res.body.counts;
					this.showDialogForListName = false;
					this.listNameForHubSpot = '';
					this.msgs.push({ 
						severity: 'success', summary: `${ res.body.message } and it will take few minutes for reflecting your companies to your HubSpot account!`,
					});
					setTimeout(() => {
						this.msgs = [];
						// this.showDialogAfterImport = true;
					}, 3000);
				} else if ( res.body.status == 500 ) {
					this.msgs = [];
					this.msgs.push({ 
						severity: 'error', summary: 'Something went wrong. Companies not added!',
					});
					setTimeout(() => {
						this.msgs = [];
					}, 3000);
				} else {
					this.msgs = [];
					this.msgs.push({ 
						severity: 'error', summary: res.body.message,
					});
					setTimeout(() => {
						this.msgs = [];
					}, 3000);
				}
				this.selectedCompany = [];
			});
		}
	};

	checkPlanStatus( type: crmType ) {

		if ( this.checkPremiumPlan() ) {

			switch( type ) {
				case 'hubspot':
				    this.confirmationForCRMLimit( type );
				    break;
				
				// case 'salesforce':
				// 	this.checkCrmLimit( type );
				// 	break;
			}
		} else {
			this.showUpgradePlanDialog = true;
		}
	}

	pushLeasepath(){
		this.msgs = [];
		this.msgs.push({ 
			severity: 'success', summary:'Lead Pushed to Leasepath Successfully.',
		});
		setTimeout(() => {
			this.msgs = [];
		}, 3000);
	}

	checkPremiumPlan(): boolean {
		if ( this.subscribedPlanModal['Premium_Trial_48_Hours'].includes(this.userDetails.planId) ||  this.subscribedPlanModal['Premium_New_Monthly'].includes(this.userDetails.planId) || this.subscribedPlanModal['Premium_Annual_Two_Year'].includes(this.userDetails.planId) || this.subscribedPlanModal['Premium_Annual_One_Year'].includes(this.userDetails.planId) ) {
			return true;
		}

		return false;
	}

	confirmationForCRMLimit( type ) {
		this.confirmationService.confirm({
            message: `Your limit deduction will depends on how much companies will be imported to HubSpot!`,
            key: 'crmConfirmationForRecordList',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
				this.checkCrmLimit( type );
				// this.showDialogAfterImport = true;
            },
            reject: () => {
            }
        });
	};

	hideDialog(event) {
		this.showDialog = event;
	};

	openDiaglogueForScoreDashBoard( scoreData, columnClicked ) {

		this.companyNumberToGrowthInsights = scoreData.companyRegistrationNumber;		

		columnClicked == 'growthScore' ? ( this.scoreDisplayModal = true ) : ( this.mAndADisplayModal = true );

		this.activeModelForApiHit = columnClicked;

	}

	showGrowthAnalysis() {
		let url = this.router.serializeUrl(
			this.router.createUrlTree(['stats-analysis/growth-analysis'],{ queryParams: this.statsListPageUrl } )
		);
		window.open( url, "_blank");
	}
}
