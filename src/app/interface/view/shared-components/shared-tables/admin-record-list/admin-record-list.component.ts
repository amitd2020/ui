import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit, EventEmitter, Output, Input, ViewChild, DoCheck, AfterViewInit, SimpleChanges, ElementRef, ChangeDetectorRef } from '@angular/core';

import { Table } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmationService, FilterService, MenuItem, SortEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';

import { subscribedPlan } from 'src/environments/environment';

import { UserInteractionMessages } from '../../../../../../assets/utilities/data/UserInteractionMessages.const';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SearchFiltersService } from 'src/app/interface/service/search-filter.service';
import { SharedLoaderService } from '../../shared-loader/shared-loader.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import CustomUtils from 'src/app/interface/custom-pipes/custom-utils/custom-utils.utils';
import { SearchCompanyService } from '../../../features-modules/search-company/search-company.service';
import { ListPageName } from '../../../features-modules/search-company/search-company.constant';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';
import { DropdownOptionsType, RequiredConstant } from '../required-constants';

export enum MonthForChargesTable {
	undefined, "January", "February", "March ", "April", "May", "June", "July", "August", "September", "October", "November", "December"
}

@Component({
	selector: 'dg-admin-record-list',
	templateUrl: './admin-record-list.component.html',
	styleUrls: ['./admin-record-list.component.scss']
})
export class AdminRecordListComponent implements OnInit, AfterViewInit, DoCheck {

	@ViewChild('recordListPaginator', { static: false }) public recordListPaginator: Paginator;
	@ViewChild('chargesDataPopupOnHover', { static: false }) private chargesDataPopupOnHover: ElementRef;
	@ViewChild('adminRecordListTable', { static: false }) public adminRecordListTable: Table;
	@ViewChild('incorporationDatePicker', { static: false }) private incorporationDatePicker: CalendarModule;
	@ViewChild('companyRegDatePicker', { static: false }) private companyRegDatePicker: CalendarModule;
	@ViewChild('accountmadeUpDatePicker', { static: false }) private accountmadeUpDatePicker: CalendarModule;
	@ViewChild('appointedDataPicker', { static: false }) private appointedDataPicker: CalendarModule;
	@ViewChild('companyQuickInfoPopover', { static: false }) private companyQuickInfoPopover: ElementRef;
	@ViewChild('createUserTemplateForm', { static: false }) createUserTemplateForm: NgForm;
	@ViewChild('resetPickListFields', { static: false }) resetPickListFields: ElementRef;

	@Input() listColumns: Array<any>;
	@Input() listDataValues: Array<any>;
	@Input() companyStatusCount: Array<any>;
	@Input() companyTotalCount : number;
	@Input() thisPage: string;
	@Input() listId: string;
	@Input() totalNoOfRecords: number;
	@Input() AnalysisTotalNoOfRecords: number;
	@Input() searchTotalCount: number = 0;
	@Input() directorTotalCount: number = 0;
	@Input() totalContacts: number = 0;
	@Input() appliedFilters: any = undefined;
	@Input() userRoleInput: any;
	@Input() dissolvedIndex: boolean = false;
	@Input() firstPage: boolean = undefined;
	@Input() hideMonthFilterMultiSelect: boolean = false;
	// @Input() paginationResetForDI: boolean = false;
	@Input() monthAggArrayCount: Array<any>;
	@Input() isClientAdminBool: any;
	@Input() selectedSavedListDataObj: any;
	@Input() globalFilterDataObject: any;
	@Input() listName: any;
	@Input() queryId: string;

	@Output() deleteCustomerWatchData = new EventEmitter<any>();
	@Output() deleteEsgWatchData = new EventEmitter<any>();
	@Output() operatingTable = new EventEmitter<any>();
	@Output() cbilsData = new EventEmitter<any>();
	@Output() updateTableDataList = new EventEmitter<any>();
	@Output() updateTableAfterPagination = new EventEmitter<any>();
	@Output() getNoticeIndentifierData = new EventEmitter<any>();
	@Output() resetIntrntnltrade = new EventEmitter<any>();
	@Output() tableOutputValues = new EventEmitter<any>();

	selectedGlobalCountry: string = 'uk';
	selectedGlobalCurrency: string = 'GBP';
	selectedListIdForDiversityStats: string = '';

	subscribedPlanModal: any = subscribedPlan;
	JSON = JSON;

	exportListDynamicName: string = "DG_Export_Report_" + new Date().getTime();

	rows: number = 50;
	first: number = 0;
	page: number = 0;
	recordsCount: number = 0;
	monthCountTotalValue: number;
	shareHoldingLiveCount: number = 0;
	shareHoldingDissolvedCount: number = 0;
	dataCount: number;
	isClientAdminLength: number;
	companyStatusArray: Array<DropdownOptionsType> = RequiredConstant.companyStatusOptions;


	confermDilogBox: boolean = false;
	selectCompanyBoolean: boolean = false;
	customEmailOrNotdialog: boolean = false;
	customEmailId: string = undefined;
	customEmail: boolean = false;
	showUpgradePlanDialog: boolean = false;
	userTypeCompany: boolean = false;
	userTypeIndividual: boolean = false;
	planSelected: boolean = false;
	planNotSelected: boolean = false;
	emailValidateBool: boolean = false;
	userMgmtDetailsInfoDialogModal: boolean = false;
	showCompanySideDetails: boolean = false;
	createNewUserDialog: boolean = false;
	viewClientUsersModal: boolean = false;
	isDiversityReset: boolean = false;
	trade: boolean = false;
	thisPageExportTemplateBool: boolean = false;
	dataProviderInfoColumns: any
	newTableObj: any;
	othersContactData: any;
	companyName: any;
	// iTagMessage = 'Estimated Turnover = 7.8 times Accounts receivable.'
	dataProviderInfo: Array<any>;
	msgs = [];
	sortOn: Array<any> = [];
	selectedCompany: Array<any> = [];
	userDetails: Partial< UserInfoType > = {};
	customerWatchModel: string[];
	ethnicMinorityModel: string[];
	internationalScoreDescriptionModel: string[];
	msmeCategoryModel: string[];
	trueFalseModel: string[];
	isEthnicOwnershipModel: string[];
	isMilitaryVeteranModel: string[];
	femaleOwnedModel: string[];
	isVcseCategoryModel: string[];
	isNetZeroTargetModel: string[];
	net_zero_targetModel: string[];
	isPpcCertificationModel: string[];
	isRaceAtWork_Model: string[];
	
	companyStatusModel: string[];
	founderByModel: string[];
	founderByOptionsModel: string[];
	vcseByModel: string[];
	regionModel: string[];
	chargesFilterData: Array<any> = [];
	customerWatchOptions: Array<any> = []; 
	exportFiltertempArry = [];
	tradeSearcSortObj = {
		filterSearchingObj: [],
		sortingForTrade: []
	};
	ipAddressData: any

	ethnicMinorityOptions: Array<any> = [
		{ label: 'Yes', value: 'yes' },
		{ label: 'No', value: 'no' }
	];

	trueFalseOptions: Array<any> = [
		{ label: 'Yes', value: 'true' },
		{ label: 'No', value: 'false' }
	];

	trueFalseOptionsBoolean: Array<any> = [
		{ label: 'Yes', value: true },
		{ label: 'No', value: false }
	];

	trueFalseOptionsBooleanPPC: Array<any> = [
		{ label: 'Yes', value: 'true' },
		{ label: 'No', value: 'false' }
	];

	msmeCategoryOptions: Array<any> = [
		{ label: 'Micro', value: 'Micro' },
		{ label: 'Unknown', value: 'Unknown' },
		{ label: 'Small', value: 'Small' },
		{ label: 'Medium', value: 'Medium' },
		{ label: 'Large Enterprise', value: 'Large Enterprise' }
	];

	internationalScoreDescriptionOptions: Array<any> = [
		{ label: 'High Risk', value: 'high risk' },
		{ label: 'Very Low Risk', value: 'very low risk' },
		{ label: 'Low Risk', value: 'low risk' },
		{ label: 'Moderate Risk', value: 'moderate risk' },
		{ label: 'Not Scored/ Very High Risk', value: 'not scored' },
	];

	founderByOptions: Array<any> = [
		{ label: 'Yes', value: 'yes' },
		{ label: 'No', value: 'no' }
	];

	vcseByOptions: Array<any> = [
		{ label: 'Yes', value: 'yes' },
		{ label: 'No', value: 'no' }
	];

	companyStatusOptions: Array<any> = [
		{ label: 'Live', value: 'live' },
		{ label: 'Dissolved', value: 'dissolved' },
		{ label: 'In Liquidation', value: 'in liquidation' },
	];

	arrayForMonthFilterAfter: Array<any> = [];
	companyForAddList: Array<any> = [];
	monthArrayForCharges = [];
	mortageDesc = [];
	tagNameArr = [];
	userDetailsInfoDataColumn: Array<any> = [];
	userDetailsInfoData: Array<any> = [];
	templateJson: Array<any> = [];
	filterSearchArray: Array<any> = [];
	items: MenuItem[];
	tempSourceData: any[];
	createTempmsgs = [];
	selectedAvailableLists: any[];
	clientUserListDataForModal: Object | Array<any>;
	templateJsonData: any[];
	tagNameOptions = [];
	monthSortArr: Array<any> = [];
	userTemplateCols: { field: string; header: string; width: string; textAlign: string; }[];
	createTemplateFields: { field: string; header: string; orderId: number; }[];

	incorporationDatePickValue: Date;
	appointedDataPickValue: Date;
	companyRegDatePickValue: Date;
	accountmadeUpDatePickValue: Date;
	appointedDateValue: Date;
	todayDate = new Date();

	maxYear = this.todayDate.getFullYear() + 50;

	emailPattern = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$";
	companySideDetailsParams: any = { companyNumber: undefined, companyName: undefined };
	overviewName = "companyOverview";
	signUpType: string = "";
	corporateSideOverviewData: object;
	selectedPlanName: string = "";
	selectedPlan: any;
	limitTypeData: any;
	subscriptionEndDate: any;
	rowGroupMetadata: any;
	exportCSVDialogMessage: string = undefined;
	quickInfoData: any;
	constantMessages: any = UserInteractionMessages;
	userDefinedCompanyName: any;
	userDefinedCompanyNumber: any;
	selectTemplateJson: {};
	selectedSubscriptionPlan: any;
	exportData: any;
	titleRegisterHit: string = undefined;
	limitDisplayForCustomExport: any;
	btnLabel: string;
	recordsCountTotal: any;
	timeout: any;
	tempField: string;

	showExportFilterBtn: boolean = false;
	isPaginatorVisible: boolean = true;
	showListButton: boolean = false;
	showDeleteFromListButton: boolean = false;
	showLoginDialog: boolean = false;
	exportTemplateDialogBox: boolean = false;
	exportCondition: boolean = false;
	newLimit: number = undefined;
	showInputFieldMessage: boolean = false;
	planDetails: any = {
		planid: undefined,
		planCost: 0,
		hits: 0,
		priceperhit: 0,
		companyReport: 0,
		creditReportLimit: 0,
		titleRegisterHitLimit: 0,
		pepAndSanctionHitLimit: 0,
		contactInformationLimit: 0,
		basicLimit: 0,
		advancedLimit: 0,
		landLimit: 0,
		corpLandLimit: 0,
		chargesLimit: 0,
		companyMonitorLimit: 0,
		directorMonitorLimit: 0,
		directorReportLimit: 0
	};
	planNamesArray: Array<any> = [
		{ label: "Expand", value: 'Expand' },
		{ label: "Enterprise", value: 'Enterprise' },
		{ label: "Premium", value: 'Premium' }
	];
	chargeStatusCheck: boolean = false;
	chargeOnHoverData: any;
	companyNumber: any;

	shortParticular: string = undefined;
	chargeDescription: string = undefined;
	template_name: string;
	fieldName: string;
	tagNameData: any;
	chargeMonth: any;
	hideExportToAllButn: boolean = false;
	viewShareholdings: boolean = false;
	shareholderNShareholdingDetailsSummaryColumns: Array<any>;
	hnwiShareholdingDetailsSummaryColumns: Array<any>;
	hnwiShareholdingDetailsSummaryData: Array<any>;
	directorDetailsShareholdingsSummaryColumns: Array<any>;
	directorDetailsShareholdingsSummaryData: Array<any>;
	shareholderNShareholdingDetailsSummaryData: Array<any>;
	showFullyOutstanding: boolean = true;
	NewPopUpBool: boolean = false;

	contractFinderSupplierColumns: Array<any>;
	contractFinderSuppliersDataValues: Array<any>;
	cmnyNumberForStats: Array<string>;
	viewSuppliersTable: boolean = false;
	csvDialogCustomForUserTemplate: boolean = false;
	userTemplateLimitUpgrade: boolean = false;
	fieldValidateForm: boolean = false;
	exportAllCondition: boolean = false;
	createTemplateBlock: boolean = false;
	showUserCreateTemplate: boolean = false;
	exportDialogNoLimit: boolean = false;
	showInvestedCompany: boolean = false;
	preparedPayloadBody: PayloadFormationObj = {};
	showHeaderObj: object = {};
	initialData: Array<object> = [];
	eventOrder: number;
	formatSortField: object = {
		companyRegistrationDate: 'incorporationDate',
		shareHoldingsCountLive: 'totalShareholding',
		fullySatisfiedCount: 'fullySatisfied',
		totalAwardValue: 'totalContractValue'
	};

	msmeStatusColor = {
        'Micro': '#59ba9b',
        'Small': '#ffcc00',
        'Medium': '#ee9512',
        'Large Enterprise': '#e1b12c',
		'Unknown': '#aabbcc',
    }
	
	investedCompanyData: Array<any> = [];
	investedCompanyColumnData = [ 
		{ field: 'businessName', header: 'Company Name', colunName: 'Company Name', minWidth: '300px', maxWidth: 'none', textAlign: 'left' },
		{ field: 'companyRegistrationNumber', header: 'Company Number', colunName: 'Company Number', minWidth: '160px', maxWidth: '160px', textAlign: 'right' },
		{ field: 'companyStatus', header: 'Company Status', colunName: 'Company Status', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
		{ field: 'sic_code_description', header: 'SIC Code', colunName: 'SIC Code', minWidth: '140px', maxWidth: '140px', textAlign: 'left' },
	];
	
	messageCountForTable: number = null; 

	constructor(
		public userAuthService: UserAuthService,
		private titlecasePipe: TitleCasePipe,
		private commonService: CommonServiceService,
		private confirmationService: ConfirmationService,
		public activeRoute: ActivatedRoute,
		private searchFiltersService: SearchFiltersService,
		private router: Router,
		private filterService: FilterService,
		private changeDetectionService: ChangeDetectorRef,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService,
		private searchCompanyService: SearchCompanyService,
		private datePipe: DatePipe
	) { }

	ngOnInit() {
		this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';
		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';

		this.messageCountForTable = this.selectedGlobalCountry != 'uk' ? 1000 : 5000;

		this.dataProviderInfoColumns = [
			// { field: 'action', header: 'Action', minWidth: '80px', maxWidth: '80px', textAlign: 'center', visible: true },
			{ field: 'fullName', header: 'Person Name', minWidth: '220px', maxWidth: 'none', textAlign: 'left', visible: true, countryAccess: [ 'uk', 'ie' ] },
			// { field: 'phoneNumber', header: 'Phone Number', minWidth: '200px', maxWidth: '200px', textAlign: 'left', visible: (  this.authGuardService.isLoggedin() ? (this.userRoleAndFeatureAuthService.addOnFeaturesDataObject['contactInformation'] || this.userRoleAndFeatureAuthService.isAdmin()) : false   ) },
			{ field: 'email', header: 'Email', minWidth: '320px', maxWidth: '320px', textAlign: 'left', visible:  ( this.userAuthService.hasAddOnPermission('contactInformation') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ), countryAccess: [ 'uk', 'ie' ] },
			{ field: 'position', header: 'Position', minWidth: '350px', maxWidth: '350px', textAlign: 'left', visible: true, countryAccess: [ 'uk' ] },
			// { field: 'status', header: 'Status', minWidth: '180px', maxWidth: '180px', textAlign: 'left', visible: true }
		];
		this.dataProviderInfoColumns = this.dataProviderInfoColumns.filter( col => col.countryAccess.includes( this.selectedGlobalCountry ) );
		
        this.searchCompanyService.$apiPayloadBody.subscribe( res => {
			this.preparedPayloadBody = res;
        });

		this.trade = this.activeRoute.snapshot.queryParams['showTrade'] == 'true' ? true : false;

		if (this.activeRoute.snapshot.queryParams['showFullyOutstanding'] == 'false') {
			this.showFullyOutstanding = false;
		}

		this.userDetails = this.userAuthService?.getUserInfo();

		if ( ( this.userRoleInput && this.userRoleInput.userRole == 'Client Admin' ) || this.userAuthService.hasRolePermission( ['Client Admin'] ) ) {

			this.planNamesArray = [
				{ label: "Prospecting", value: 'Expand' },
				{ label: "Sales", value: 'Enterprise' }
			];
		}

		if (this.thisPage == 'customerWatchPage') {
			this.rows = 25;
		}
		else {
			this.rows = 25;
		}

		if (this.activeRoute.snapshot.queryParams['cListId'] && this.thisPage == 'companyListOfIServiceCategoryPage') {
			this.showDeleteFromListButton = true;
			this.showListButton = false;
		} else if(this.activeRoute.snapshot.queryParams['showTrade'] =='true' || (this.activeRoute.snapshot.queryParams['cListId'] && this.activeRoute.snapshot.queryParams['listPageName'] =='Company Trade-list' && this.thisPage =='showTradeTablePage')){
			this.showDeleteFromListButton = true;
		} else if( this.activeRoute.snapshot.queryParams['cListId'] && ( this.thisPage == 'investorFinderPage' || this.thisPage == 'investeeFinderPage' ) ) {
			this.showDeleteFromListButton = true;
		}
		 else {
			this.showDeleteFromListButton = false;
			this.showListButton = true;
		}

		if ( this.preparedPayloadBody.listId && this.thisPage == 'showChargesTablePage') {
			// if(this.authGuardService.isLoggedin()) {
				this.showListButton = false;
				this.hideMonthFilterMultiSelect = true;
				this.hideExportToAllButn = true;
				let pageChangeEventObj = { first: this.first, rows: this.rows, page: this.page };

				if( [ this.subscribedPlanModal['Start'], this.subscribedPlanModal['Valentine_Special'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Premium_Trial_48_Hours'] ].includes( this.userDetails?.planId ) ) {
					this.isPaginatorVisible = false;
				}
			// } else {
			// 	this.showLoginDialog = true;
			// }
		}

		if ( [ 'showChargesTablePage', 'showTradeTablePage', 'showContactScreen', 'showDirectorScreenPage', 'customerWatchPage', 'investeeFinderPage', 'corporateRiskPage', 'investorFinderPage', 'hnwiPage', 'buyersDashboard', 'suppliersDashboard', 'contractFinderPage', 'companyListOfIServiceCategoryPage' ].includes( this.thisPage ) ) {
			if( [ this.subscribedPlanModal['Start'], this.subscribedPlanModal['Valentine_Special'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Premium_Trial_48_Hours'] ].includes( this.userDetails?.planId ) ) {
				this.isPaginatorVisible = false;
			}
		}


		document.body.addEventListener('mouseover', (event: any) => {
			if (!event.currentTarget.classList.contains('infoName')) {
				this.hideOutstandingonHoverData();
			}
		});
		
		document.body.addEventListener('mouseover', (event: any) => {
			if (!event.currentTarget.classList.contains('infoName')) {
				this.hideCompanyQuickInfoPopover();
			}
		});

		if( this.thisPage == 'showContactScreen' ) {

			this.userTemplateCols = [
				{ field: 'downloadTemplate', header: 'Action', width: '15px', textAlign: 'center' },
				{ field: 'templateName', header: 'Template Name', width: '90px', textAlign: 'left' },
				{ field: 'templateJson', header: 'Fields', width: '200px', textAlign: 'left' },
				{ field: 'deleteTemplate', header: 'Delete', width: '15px', textAlign: 'center' },
			];

		}
		
        let { cListId, listName, listPageName } = JSON.parse( JSON.stringify( this.activeRoute.snapshot.queryParams ) );
		listPageName = listPageName != 'govermentProcurement' ? listPageName : 'Government Procurement';
		
		this.showHeaderObj = {
			listId: cListId,
			listName: listName,
			listPageName: listPageName ? listPageName : ListPageName[this.searchCompanyService.getView()] ? ListPageName[this.searchCompanyService.getView()]['inputPage'] : ''
		};

		// if ( this.thisPage == 'netZero' ) this.isPaginatorVisible = false;
		
	}

	getOthersContactInfoData() {

		let reqArr = [ this.companyNumber ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'othersContactInfo', reqArr ).subscribe( res => {
			
			if ( res.body['code'] == 200 ) {
				this.dataProviderInfo = []

				this.othersContactData = res.body['response'];

				this.othersContactData = this.othersContactData.sort( (a, b) => a.position !== '' ? -1 : 1 );

				if ( this.othersContactData ) {

					this.dataProviderInfo = this.othersContactData;

					for ( let tempDataProviderInfo of this.dataProviderInfo ) {

						if ( tempDataProviderInfo ) {

							let fullname = "";

							if ( tempDataProviderInfo.firstName && tempDataProviderInfo.firstName != "null" ) {
								fullname = tempDataProviderInfo.firstName + " ";

							} if ( tempDataProviderInfo.middleName && tempDataProviderInfo.middleName != "null" ) {
								fullname += tempDataProviderInfo.middleName + " ";

							} if ( tempDataProviderInfo.lastName && tempDataProviderInfo.lastName != "null" ) {
								fullname += tempDataProviderInfo.lastName + " ";

							}

							tempDataProviderInfo['fullName'] = fullname && fullname ? fullname : '-';

							if ( tempDataProviderInfo['position'] ) {

								tempDataProviderInfo['position'] = tempDataProviderInfo['position'].replace(/&amp;/g, '&');

							}

						}
					}

				}

			} else if ( res.body['code'] == 404 ) {

				this.dataProviderInfo = res.body['response'];
	
			}
			setTimeout(() => {
				this.sharedLoaderService.hideLoader();
			}, 1000);
			
		});

	}

	ngAfterViewInit() {
		let elementsToUse = { adminRecordListTable: this.adminRecordListTable, recordListPaginator: this.recordListPaginator }
		this.operatingTable.emit(elementsToUse);


		if (['showDirectorScreenPage'].includes(this.thisPage)) {

			this.shareholderNShareholdingDetailsSummaryColumns = [
				{ field: 'shareHoldingCompanyName', header: 'Company Name', width: '250px', textAlign: 'left' },
				{ field: 'companyRegistrationNumber', header: 'Company Number', width: '140px', textAlign: 'right' },
				{ field: 'shareHoldingCompanyStatus', header: 'Company Status', width: '150px', textAlign: 'center' },
				{ field: 'shareType', header: 'Share Type', width: '170px', textAlign: 'left' },
				{ field: 'currency', header: 'Currency', width: '150px', textAlign: 'left' },
				{ field: 'numberOfSharesIssued', header: 'Share Count', width: '130px', textAlign: 'right' },
				{ field: 'share_percent', header: '% of Total Share Count', width: '150px', textAlign: 'right' },
				{ field: 'value', header: 'Nominal Value', width: '120px', textAlign: 'right' },
				{ field: 'sic_code', header: 'Sic Code', width: '500px', textAlign: 'left' }
			];

		}

		if (['investorFinderPage'].includes(this.thisPage)) {

			this.shareholderNShareholdingDetailsSummaryColumns = [
				{ field: 'shareHoldingCompanyName', header: 'Company Name', width: '250px', textAlign: 'left' },
				{ field: 'shareHoldingCompanyStatus', header: 'Company Status', width: '130px', textAlign: 'center' },
				{ field: 'shareType', header: 'Share Type', width: '120px', textAlign: 'left' },
				{ field: 'numberOfSharesIssued', header: 'Share Count', width: '120px', textAlign: 'right' },
				{ field: 'share_percent', header: '% of Total Share Count', width: '120px', textAlign: 'right' },
				{ field: 'value', header: 'Nominal Value', width: '100px', textAlign: 'right' },
				{ field: 'sic_code', header: 'Sic Code', width: '350px', textAlign: 'left' }
			];

		}

		if (['investeeFinderPage'].includes(this.thisPage)) {

			this.shareholderNShareholdingDetailsSummaryColumns = [
				{ field: 'shareHolderName', header: 'Name', width: '200px', textAlign: 'left' },
				{ field: 'shareHolderAsCompanyStatus', header: 'Status', width: '100px', textAlign: 'center' },
				{ field: 'shareType', header: 'Share Type', width: '130px', textAlign: 'left' },
				{ field: 'currency', header: 'Currency', width: '150px', textAlign: 'left' },
				{ field: 'numberOfSharesIssued', header: 'Share Count', width: '90px', textAlign: 'right' },
				{ field: 'percentage_share', header: '% of Total Share Count', width: '140px', textAlign: 'right' },
				{ field: 'value', header: 'Nominal Value', width: '90px', textAlign: 'right' }
			];

		}

		if (['hnwiPage'].includes(this.thisPage)) {

			this.hnwiShareholdingDetailsSummaryColumns = [
				{ field: 'businessName', header: 'Company Name', width: '160px', textAlign: 'left' },
				{ field: 'share_percentage', header: 'Share Percentage', width: '130px', textAlign: 'right' },
				{ field: 'share_count', header: 'Share Count', width: '90px', textAlign: 'right' },
				{ field: 'turnover', header: 'Turnover', width: '90px', textAlign: 'right' },
				{ field: 'estimated_turnover', header: 'Turnover (Estimate+)', width: '130px', textAlign: 'right' },
				{ field: 'industryTagList', header: 'Industry', width: '120px', textAlign: 'left' },
				{ field: 'sic_code_description', header: 'SIC Code', width: '130px', textAlign: 'left' },
				{ field: 'companyStatus', header: 'Company Status', width: '90px', textAlign: 'center' },
				{ field: 'companyRegistrationDate', header: 'Incorporation Date', width: '150px', textAlign: 'center' },
				{ field: 'region', header: 'Region', width: '80px', textAlign: 'left' }
			];
		}

		if( ['contractFinderPage'].includes(this.thisPage) ) {

			this.contractFinderSupplierColumns = [
				{ field: 'name', header: 'Supplier Name', width: '160px', textAlign: 'left' },
				{ field: 'supplierReg', header: 'Company Number', width: '130px', textAlign: 'left' },
				{ field: 'address', header: 'Address', width: '130px', textAlign: 'left' },
				{ field: 'is_sme', header: 'Is SME', width: '90px', textAlign: 'left' },
				{ field: 'is_vcse', header: 'Is VCSE', width: '90px', textAlign: 'left' },
				{ field: 'postcode', header: 'Post Code', width: '120px', textAlign: 'left' },
				{ field: 'ward', header: 'Ward', width: '130px', textAlign: 'left' },
				{ field: 'constituency', header: 'Constituency', width: '90px', textAlign: 'left' },
				{ field: 'region', header: 'Region', width: '150px', textAlign: 'left' },
			];
		}

		setTimeout(() => {
			if ( this.adminRecordListTable ) {
				this.initialData = JSON.parse( JSON.stringify( this.adminRecordListTable._value ) );
			}
		}, 3000);
	} 

	ngOnChanges(changes: SimpleChanges) {

		if ( changes?.listName && changes?.listName?.previousValue != changes?.listName && changes?.listName?.currentValue ) {
			if ( this.thisPage == 'diversityCalculation' || this.thisPage == 'diversityInclusion' || this.thisPage == 'supplierResilience' ) {
				// this.resetFilters( this.adminRecordListTable );
				this.first = 0;
				this.rows = 25;
			}
		}
		
		if ( changes['listDataValues'] && changes['listDataValues']?.currentValue ) {

			if ( this.thisPage == 'showChargesTablePage' && this.preparedPayloadBody.hasOwnProperty('filterData') && this.preparedPayloadBody.filterData.length ) {
	
				if ( JSON.stringify( this.preparedPayloadBody.filterData ).includes("Charge Month") || JSON.stringify( this.preparedPayloadBody.filterData ).includes("chargesDataMonth") ) {
					let chargesMonthChipValues = this.preparedPayloadBody.filterData.filter( val => [ 'Charge Month', 'chargesDataMonth' ].includes( val.chip_group ) );
				}

			}

			if ( ![ 'corporateRiskPage', 'hnwiPage', 'buyersDashboard', 'suppliersDashboard', 'supplierDashboard', 'contractFinderPage', 'diversityInclusion', 'companyListOfIServiceCategoryPage', 'diversityCalculation', 'ppcPage', 'user-management', 'payments', 'promptSearchAi', 'supplierResilience'].includes(this.thisPage) ) {
				this.rows = this.preparedPayloadBody.pageSize;
				this.first = this.preparedPayloadBody.startAfter ? this.preparedPayloadBody.startAfter : 0;
			}
		}

		if ( this.thisPage == 'diversityCalculation' || this.thisPage == 'ppcPage' || this.thisPage == 'supplierResilience' ) {
			this.rows = this.rows ? this.rows : 25;
			this.first = this.first ? this.first : 0;
		}

		if (changes['appliedFilters'] && changes['appliedFilters'].currentValue) {

			this.showExportFilterBtn = false;
			this.isPaginatorVisible = true;

			if( [ 'showChargesTablePage', 'showContactScreen', 'showDirectorScreenPage', 'customerWatchPage', 'investeeFinderPage', 'corporateRiskPage', 'investorFinderPage', 'hnwiPage', 'buyersDashboard', 'suppliersDashboard', 'contractFinderPage', 'showTradeTablePage' ].includes( this.thisPage ) && [ this.subscribedPlanModal['Start'], this.subscribedPlanModal['Valentine_Special'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Premium_Trial_48_Hours'] ].includes( this.userDetails?.planId ) ) {
				this.isPaginatorVisible = false;
			}

			if ( this.thisPage == 'showChargesTablePage' && !this.userAuthService.hasAddOnPermission('lendingLandscape') ) {
				this.isPaginatorVisible = false;
			}

			if( this.thisPage == 'showDirectorScreenPage' && !this.userAuthService.hasFeaturePermission( 'View Director' )) {
				this.isPaginatorVisible = false;
			}
			
			this.selectedCompany = [];

			// To reset the table filters - Temporary Solution
			const temporaryHoldColumns = JSON.parse( JSON.stringify( this.listColumns ) );
			this.listColumns = [];
			
			setTimeout(() => {
				this.listColumns = temporaryHoldColumns;
			}, 100);
			// To reset the table filters
				
			if (!this.activeRoute.snapshot.queryParams['cListId'] && !this.activeRoute.snapshot.queryParams['pageName'] && this.thisPage == 'showChargesTablePage') {
				this.showListButton = true;
				this.hideMonthFilterMultiSelect = false;
				this.hideExportToAllButn = false;
			}

			if (this.recordListPaginator) {
				this.recordListPaginator.first = 0;
			}
		}
		
		if(changes['isClientAdminBool'] && changes['isClientAdminBool'].currentValue) {
			this.isClientAdminLength = changes['isClientAdminBool'].currentValue;
		}
		if ( !this.preparedPayloadBody.listId && this.thisPage == 'showChargesTablePage') {
			// if(this.authGuardService.isLoggedin()) {
				this.showListButton = true;
				this.hideExportToAllButn = false;
			// }
		} 

		if ( this.preparedPayloadBody.filterData && this.preparedPayloadBody.filterData.length ) {
			setTimeout(() => {
				for( let item of this.preparedPayloadBody.filterData ) {
					if ( ( item.chip_group != 'Saved Lists' && this.preparedPayloadBody.filterData.length >= 2 ) || ( item.chip_group == 'Saved Lists' ) ) {
						this.searchCompanyService.showStatsButton = true;
					} else {
						this.searchCompanyService.showStatsButton = false;
					}
				}
			}, 0);
		}
				
	}

	ngDoCheck() {
		
		if ( this.totalNoOfRecords > 10000 || this.searchTotalCount > 10000 || this.AnalysisTotalNoOfRecords ) {
			if (this.AnalysisTotalNoOfRecords !== undefined) {
				this.recordsCount = this.AnalysisTotalNoOfRecords;
			} else {
				this.recordsCount = 10000;
			}
		} else {
			if (this.searchTotalCount) {
				this.recordsCount = this.searchTotalCount;

			} else {
				this.recordsCount = this.totalNoOfRecords;
			}
		}

		if (this.firstPage) {

			this.firstPage = false;

		}

	}

	formatCompanyNameForUrl(companyName) {
		if (companyName !== undefined) {
			return this.commonService.formatCompanyNameForUrl(companyName);
		}
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

	calculateCompanyAge(dob) {
		return this.commonService.calculateAge(dob);
	}

	calculateAgeForLandscapes(dob) {
		return this.commonService.calculateAgeForLandscapes(dob);
	}

	deleteCompanyFromList( table?, page? ) {
      
        for (let selectedCompany of this.selectedCompany ) {
            this.companyForAddList.push( selectedCompany.companyRegistrationNumber );
        }

        let obj = {
            listId: this.activeRoute.snapshot.queryParams['cListId'],
            companies: this.companyForAddList,
		};
		
		if ( this.thisPage != 'companyListOfIServiceCategoryPage' ) {
			obj['deletePageName'] =  ['investorFinderPage', 'investeeFinderPage'].includes(page) ? page : this.activeRoute.snapshot.queryParams['listPageName'];
		}

        this.confirmationService.confirm({
            message: this.constantMessages['confirmation']['delete'],
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            key: this.thisPage.toString(),
            accept: () => {
				
				let apiEndPoint = this.thisPage == 'companyListOfIServiceCategoryPage' ? 'removeIscoreCompaniesPortfolioList' : 'updateUserSaveCompaniesListById';
				let apiRoute = this.thisPage == 'companyListOfIServiceCategoryPage' ? 'DG_ISCORE' : 'DG_LIST';

				this.globalServerCommunication.globalServerRequestCall( 'post', apiRoute, apiEndPoint, obj ).subscribe( res => {
                    this.msgs = [];

                    if ( res.body['status'] === 200 ) {
                        
                        this.msgs.push({ severity: 'success', summary: "Company removed from the list" });
                        setTimeout(() => {
                            this.msgs = [];
                        }, 3000);
 
                        this.selectedCompany = [];
						this.listDataValues = [];
						let obj = {
							pageSize: this.rows,
							pageNumber: this.page + 1
						}
                        this.thisPage == 'companyListOfIServiceCategoryPage' ? this.updateTableDataList.emit( obj ) : this.resetFilters(table)
                        
                    } else {

                        this.msgs.push({ severity: 'error', summary: "Companies In List Data not deleted!!" });
                        setTimeout(() => {
                            this.msgs = [];
                        }, 3000);

                    }
                    
                });
            }
        });
    }

	editCbilsDetails(cbilData) {
		this.cbilsData.emit(cbilData);

		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	fetchTableData(tableData) {
		this.newTableObj = tableData;
		this.adminRecordListTable = this.newTableObj;
	}

	deleteCustomerWatchRow() {
		this.deleteCustomerWatchData.emit( { selectedCompany: this.selectedCompany, rows: this.rows, page: this.page + 1 } );
		this.selectedCompany = [];
	}

	deleteEsgWatchRow() {
		this.deleteEsgWatchData.emit( { selectedCompany: this.selectedCompany, rows: this.rows, page: this.page + 1 } );
		this.selectedCompany = [];
	}

	ipAddress(data) {
		this.sharedLoaderService.showLoader();
		this.showLoginDialog = true
		let queryParam = [
			{ key: 'ip', value: data }
		];
		this.globalServerCommunication.globalServerRequestCall('get', 'webstats', 'searchCompanyIpAddress', undefined, undefined, queryParam).subscribe(res => {

			if (res.body.code == 200) {
				this.ipAddressData = res.body.response.data
			} else {
				this.showLoginDialog = false
			}
			setTimeout(() => {
				this.sharedLoaderService.hideLoader();
			}, 2000);


		})

	}

	searchCustomerNotifiation() {

		let obj = {
			field: "customerNotification",
			value: true
		}

		this.filterSearchArray.push(obj);

		let pageChangeEventObj = { first: this.first, rows: this.rows, page: this.page };
		this.pageChange(pageChangeEventObj);

	}

	pageChange( event, tableData? ) {
		this.getFilterTable();

		if (event.rows !== this.rows) {
			this.selectedCompany = [];
			this.rows = event.rows;
		}
		this.first = event.first;
		this.page = event.page;

		if (this.thisPage == 'customerWatchPage') {
			this.sharedLoaderService.showLoader();

			let reqobj = {
				"userId": this.userDetails?.dbID,
				"isCbil": false,
				'pageSize': this.rows,
				'pageNumber': event.page + 1,
				'filterSearchArray': this.filterSearchArray
			}
			this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_CBIL', 'cbilsUserDataListTableData', reqobj ).subscribe( res => {
			// this.cbilServiceService.getCbilUserTableData(userid, false, this.rows, event.page + 1, this.filterSearchArray).then(data => {

				this.listDataValues = [];
				if (res.body.status === 200) {
					res.body.results.forEach(element => {
						if (element.isCbil === false) {
							element['cbiladdress'] = element.RegAddress_Modified && this.commonService.formatCompanyAddress(element.RegAddress_Modified);
							element['cWebsite'] = element.RegAddress_Modified && element.RegAddress_Modified.website;
							element['IncorporationDate'] = element.companyRegistrationDate;
						
							if(element.hasOwnProperty('changes')) {
								element['lastChange'] = element.changes[0].description ? element.changes[0].description : "";
								element['filedDate'] = element.changes[0].statusFiledDate ? element.changes[0].statusFiledDate : "";
								element['registrationDate'] = element.changes[0].statusRegistrationDate ? element.changes[0].statusRegistrationDate : "";
							}
							this.listDataValues.push(element);
						}
					});
					this.totalNoOfRecords = res.body.totalRecords;
					this.page = event.page;

					this.sharedLoaderService.hideLoader();
				} else if ( res.body.status == 201 ) {

					this.totalNoOfRecords = res.body.totalRecords;
					this.sharedLoaderService.hideLoader();
					
				}
			});
		}

		if ( this.thisPage == 'showChargesTablePage' || this.thisPage == 'showTradeTablePage' ) {
			this.sharedLoaderService.showLoader();

			if (this.activeRoute.snapshot.queryParams['cListId'] && this.activeRoute.snapshot.queryParams['pageName']) {
				if (this.activeRoute.snapshot.queryParams['cListId']) {

					let listId = this.activeRoute.snapshot.queryParams['cListId'];
					// this.loadingData = true;
					this.searchFiltersService.getListOfCompaniesForAblCharges(listId, this.rows, event.page + 1, this.filterSearchArray, this.sortOn).then(data => {

						let dataArray = [];
						this.listDataValues = [];

						if (data.body['status'] == 200) {
							for (let resultData of data.body['results'].hits) {
								dataArray.push(resultData._source)
							}

							this.searchTotalCount = data.body['total'];
							// this.listDataValues = this.formatData(dataArray);
							this.sharedLoaderService.hideLoader();
						}

					});
				}
			} else {
				
				if (this.activeRoute.snapshot.queryParams['showTrade'] == 'true') {
					this.tradeSearcSortObj.filterSearchingObj = this.filterSearchArray
					this.resetIntrntnltrade.emit(this.tradeSearcSortObj)
				}

				this.searchCompanyService.updatePayload({
					pageSize: event.rows,
					startAfter: event.first,
					sortOn: this.sortOn ? this.sortOn : [],
					filterSearchArray: this.filterSearchArray ? this.filterSearchArray : []
				});

				this.tableOutputValues.emit( 'charges | Trade' );
				return;

			}

		}

		if (this.thisPage == 'companyListOfIServiceCategoryPage') {
			if (this.activeRoute.snapshot.queryParams['cListId'] || this.activeRoute.snapshot.queryParams['category']) {

				this.isPaginatorVisible = true;
				let obj = {
					pageSize: this.rows,
					pageNumber: event.first/this.rows + 1
				}
				this.updateTableDataList.emit(obj);
			}
		}

		if (this.thisPage == 'showDirectorScreenPage') {

			this.searchCompanyService.updatePayload({
				pageSize: event.rows,
				startAfter: event.first,
				sortOn: this.sortOn ? this.sortOn : [],
				filterSearchArray: this.filterSearchArray ? this.filterSearchArray : []
			});

			this.tableOutputValues.emit( 'director' );
			// this.resetTableSortState( tableData );
			return;

		}

		if ( this.thisPage == 'showContactScreen' ) {

			this.searchCompanyService.updatePayload({
				pageSize: event.rows,
				startAfter: event.first,
				sortOn: this.sortOn ? this.sortOn : [],
				filterSearchArray: this.filterSearchArray ? this.filterSearchArray : []
			});

			this.tableOutputValues.emit( 'contact' );
			return;

		}

		if (['investorFinderPage', 'investeeFinderPage', 'corporateRiskPage', 'hnwiPage', 'buyersDashboard', 'suppliersDashboard', 'supplierDashboard', 'contractFinderPage', 'diversityInclusion', 'ppcPage', 'payments'].includes(this.thisPage)) {

			let requestObject = {
				pageSize: this.rows,
				startAfter: event.page * this.rows,
				sortOn: this.sortOn,
				filterSearchArray: this.filterSearchArray,
				isDiversityReset: this.isDiversityReset
			};
			this.updateTableAfterPagination.emit(requestObject);
		}

		if (this.thisPage == 'user-management') {

			let requestObject = {
				pageSize: this.rows,
				startAfter: event.page * this.rows,
				sortOn: this.sortOn,
				filterSearchArray: this.filterSearchArray
			};

			this.updateTableAfterPagination.emit(requestObject);
		}

		if ( [ 'update-user'].includes(this.thisPage) ) {

			let requestObject = {
				pageSize: this.rows,
				startAfter: event.page * this.rows
			};

			this.updateTableAfterPagination.emit(requestObject);
		}

		if ([ 'buyerNonRegPage', 'supplierNonRegPage' ].includes(this.thisPage)) {
			let thisPageObj = { thisPage: this.thisPage, event: event }
			this.updateTableAfterPagination.emit( thisPageObj );
		}

		if (this.thisPage == 'esgWatchPage') {

			let requestObject = {
				pageSize: this.rows,
				pageNumber: event.page + 1
			};

			this.updateTableAfterPagination.emit(requestObject);

		}

		if( this.thisPage == 'webWidgetPage' ) {
			this.first = event.first;
			this.rows = event.rows
		}

		if( this.thisPage == 'diversityCalculation' || this.thisPage == 'supplierResilience'){
			let requestObject = {
				pageSize: event.rows,
				startAfter: this.page * this.rows,
				sortOn: this.sortOn ? this.sortOn : [],
				filterSearchArray: this.filterSearchArray ? this.filterSearchArray : [],
			};
			this.updateTableAfterPagination.emit(requestObject);
			// this.resetTableSortState( tableData );
		}

		if ( this.thisPage == 'promptSearchAi' ) {
			let requestObject = {
			    pageSize: this.rows,
				startAfter: event.page * this.rows,
				page: event.page
		    }
			this.updateTableAfterPagination.emit(requestObject);
		}
	}

	pageChanges(event, tableData) {	
		this.rows = event.rows;
		this.first = event.first;
		this.resetTableSortState( tableData );
	}

	resetTableSortState( tableData ) {
		tableData._sortField = null;
        tableData._sortOrder = 1;
        tableData._multiSortMeta = null;
        tableData.tableService.onSort(null);
		// tableData.value = this.initialData;
	}

	getSICCodeInArrayFormat(SICCode) {
		return this.commonService.getSICCodeInArrayFormat(SICCode);
	}

	filterDate() {
		let _self = this;

		// For filtering from calendar
		setTimeout(() => {
			this.filterService.filter['incorporationDatePickFilters'] = (value, filter): boolean => {
				let s = _self.incorporationDatePickValue[0].getTime(), e;
				let dateVal = new Date(this.changeToDate(value));
				if (_self.incorporationDatePickValue[1]) {
					e = _self.incorporationDatePickValue[1].getTime();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.filterService.filter['accountmadeUpDatePickFilters'] = (value, filter): boolean => {
				let s = _self.accountmadeUpDatePickValue[0].getTime(), e;
				let dateVal = new Date(this.changeToDate(value));
				if (_self.accountmadeUpDatePickValue[1]) {
					e = _self.accountmadeUpDatePickValue[1].getTime();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.filterService.filter['companyRegDatePickFilters'] = (value, filter): boolean => {
				let s = _self.companyRegDatePickValue[0].getTime(), e;
				let dateVal = new Date(this.changeToDate(value));
				if (_self.companyRegDatePickValue[1]) {
					e = _self.companyRegDatePickValue[1].getTime();
					// this.companyRegDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}



		}, 0);

	}

	validateSearchField(event, field): any {

		let tempSpecialChar = /[!@#$%^&*+/()]/g;
		let tempAlphabetValue = /[^a-zA-Z\s]+/g;

		this.tempField = field;
		const charCode = (event.which) ? event.which : event.keyCode;
		const specialChar = event.key;

		if (['outstandingCount', 'fullySatisfiedCount', 'turnover', 'estimated_turnover', 'netWorth', 'directorAge', 'active_directors_count', 'NumMortCharges', 'numberOfEmployees', 'turnover_latest', 'totalAssets_latest', 'totalLiabilities_latest', 'netWorth_latest', 'grossProfit_latest', 'total_contract_presented', 'total_contracts_published_value', 'suppliers_count', 'totalContractsWon', 'totalAwardValue'].includes(this.tempField)) {
			if (((charCode > 31 && charCode != 43 && charCode != 45) && (charCode < 48 || charCode > 57)) || specialChar.match(tempSpecialChar)) {
				this.showInputFieldMessage = true;
				return false;
			}
			this.showInputFieldMessage = false;
			return true;
		} else if (['director_name', 'occupation'].includes(this.tempField)) {
			if ( specialChar.match(tempAlphabetValue) && ![ 'occupation' ].includes(this.tempField) ) {
				this.showInputFieldMessage = true;
				return false;
			}
			this.showInputFieldMessage = false;
			return true;
		} else if (['companyRegistrationNumber'].includes(this.tempField)) {
			if (specialChar.match(tempSpecialChar)) {
				this.showInputFieldMessage = true;
				return false;
			}
			this.showInputFieldMessage = false;
			return true;
		}

	}


	applyFilter(event, tableData, field, matchMode, filterKey) {

		if ( this.subscribedPlanModal['Valentine_Special'].includes( this.userDetails?.planId ) ) {
			this.showUpgradePlanDialog = true;
		} else {

			clearTimeout(this.timeout);
			let $this = this;
			let obj = {};

			if ( field == 'buyerName' ) {
				field = 'buyer_name';
			}

			if ( tableData != undefined ) {
				if ( ['Company Name', 'Action', 'Base Year', 'Commitment Deadline', 'Commitment Type', 'Company Number', 'Company Temperature Alignment', 'Date Published', 'Location', 'Organization Type', 'Reason for commitment extension or removal', 'Region', 'Scope', 'Sector', 'Status', 'Sub-type', 'Target', 'Target Classification', 'Target Value', 'Target Wording', 'Target Year', 'Type', 'Year Type'].includes( field ) ) {
					tableData.filter( event.target.value, field, matchMode );
				}
			}

			if (filterKey !== undefined) {
				if (field == 'appointed_date' || field == 'companyRegistrationDate') {
					obj['value'] = this.commonService.formatDateSlash(event);
				} else {
					obj['value'] = event && event != "-" ? event : '';
				}
			} else {
				if (field == 'paiduser') {
					obj['value'] = this.listDataValues['paid'];
				} else if (field == 'freeuser') {
					obj['value'] = this.listDataValues['free'];
				} else {
					if (event.target.value.length > 0) {
						obj['value'] = event.target.value && event.target.value != "-" ? event.target.value : "";
					}
				}
			}
	
			if (JSON.stringify($this.filterSearchArray).includes(field)) {
				for (let i = 0; i < $this.filterSearchArray.length; i++) {
					if ($this.filterSearchArray[i]['field'] === field) {
						$this.filterSearchArray.splice(i, 1);
					}
				}
			}

			if ( obj.hasOwnProperty( 'value' ) && obj['value'].length ) {
				obj['field'] = field;
				this.filterSearchArray.push(obj);
			}

			this.timeout = setTimeout(function () {

				if ( $this.thisPage == 'diversityCalculation' || $this.thisPage == 'supplierResilience' ) {
					let requestObject = {
						pageSize: $this.rows,
						startAfter: 0,
						filterSearchArray: $this.filterSearchArray ? $this.filterSearchArray : [],
						search: true
					};
					$this.updateTableAfterPagination.emit(requestObject);
					
				} else {
					let pageChangeEventObj = { page: 0, first: 0, rows: $this.rows };
					$this.pageChange(pageChangeEventObj);
				}
			}, 1000);

		}

	}

	getFilterTable() {
		let tempArrCustomerWatchStatus = [], tempArrForRegion = [], tempArrForMonthDate = [];

		if (this.thisPage == 'companiesColumnListForTable') {

			setTimeout(() => {

				this.customerWatchOptions = [];
				this.listDataValues.forEach((value) => {
					tempArrCustomerWatchStatus.push(value.companyStatus);
				});

				tempArrCustomerWatchStatus.forEach((a, index) => {
					if (tempArrCustomerWatchStatus.indexOf(a) === index) {
						this.customerWatchOptions.push({ label: this.titlecasePipe.transform(a), value: a });
					}
				});
			}, 2000);
		}

		if (this.thisPage == 'showChargesTablePage' ) {

			tempArrForRegion = [];

			setTimeout(() => {

				this.listDataValues.forEach((value) => {
					tempArrForRegion.push(value.region);
				});

			}, 2000);

		}

		this.changeDetectionService.detectChanges();

	}
	showCompanySideDetailsPanel(e: Event, compNumber, compName, rowData?, tabRoute?, scrollToDivId?: string) {

		if( this.thisPage == 'webWidgetPage' || this.thisPage == 'ppc' ) {
			this.showCompanySideDetails = true;
			this.companySideDetailsParams.companyNumber = compNumber;
			this.companySideDetailsParams.companyName = compName;
			this.overviewName = "companyOverview";
			this.operatingTable.emit({ requestFor: 'SidePanel', compNumber: compNumber, compName: compName, rowData: rowData, tabRoute: tabRoute });
			
		} else {
			e.stopPropagation();
			e.preventDefault();
			localStorage.setItem( "scrollToDivId", scrollToDivId );
			this.operatingTable.emit({ requestFor: 'SidePanel', compNumber: compNumber, compName: compName, rowData: rowData, tabRoute: tabRoute });
		}
	}
	getShowCompanySideDetailsOutputBoolValue($event) {
		this.showCompanySideDetails = $event;
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

	resetFilters(tableData?) {
		let tableDomElement = tableData?.el?.nativeElement?.children[0],
		sortIcons = tableDomElement?.querySelectorAll('.p-datatable-wrapper .p-sortable-column-icon'),
		filterSearchRowInputFields = tableDomElement?.querySelectorAll('.p-datatable-wrapper .filterSearchRow input[type="text"]');

		tableData?.filter(null);
		tableData?.reset();
		this.tradeSearcSortObj.sortingForTrade = []

		// this.getMonthDataByConfirmButn = false;
		this.incorporationDatePickValue = null;
		this.accountmadeUpDatePickValue = null;
		this.companyRegDatePickValue = null;
		this.customerWatchModel = [];
		this.ethnicMinorityModel = [];
		this.internationalScoreDescriptionModel = [];
		this.msmeCategoryModel = [];
		this.isEthnicOwnershipModel = [];
		this.isMilitaryVeteranModel = [];
		this.femaleOwnedModel = [];
		this.isVcseCategoryModel = [];
		this.isNetZeroTargetModel = [];
		this.net_zero_targetModel = [];
		this.isPpcCertificationModel = [];
		this.isRaceAtWork_Model = [];
		this.companyStatusModel = [];
		this.founderByModel = [];
		this.founderByOptionsModel = [];
		this.vcseByModel = [];
		this.regionModel = [];
		this.selectedCompany = [];
		this.appointedDataPickValue = undefined;
		this.showInputFieldMessage = false;
		this.fieldName = '';

		for (let icon of sortIcons) {
			icon.classList.value = 'p-sortable-column-icon pi pi-fw pi-sort-alt';
		}

		for (let inputField of filterSearchRowInputFields) {
			inputField.value = "";
		}

		if ( this.thisPage == 'showChargesTablePage' ||  this.thisPage == 'showTradeTablePage'  ) {

			if (this.filterSearchArray && this.filterSearchArray.length > 0) {
				this.filterSearchArray = [];
			}
			if (this.sortOn && this.sortOn.length > 0) {
				this.sortOn = [];
			}

			if (this.activeRoute.snapshot.queryParams['cListId'] && this.activeRoute.snapshot.queryParams['pageName']) {
				if (this.activeRoute.snapshot.queryParams['cListId']) {

					this.page = 0;
					this.first = 0;
					this.rows = 25;

				}
			} else {

				this.page = 0;
				this.first = 0;
				this.rows = 25;

				// let chargesMonth = JSON.stringify(this.activeRoute.snapshot.queryParams.chipData).includes('chargesDataMonth');

				// let filterData = this.preparedPayloadBody.filterData.filter((item) => item.chip_group !== "Charge Month");
				// if( chargesMonth ){
				// 	filterData = JSON.parse(this.activeRoute.snapshot.queryParams.chipData);
				// }
				// this.searchCompanyService.updatePayload( { filterData: filterData } );

				if ( this.preparedPayloadBody.filterData && this.preparedPayloadBody.filterData.length ) {
					for ( let i = 0; i < this.preparedPayloadBody.filterData.length; i++ ) {
						if ( this.chargeStatusCheck ) {
							if ( this.preparedPayloadBody.filterData[i].chip_group == "Charges Status" ) {
								this.preparedPayloadBody.filterData.splice(i, 1);
								this.chargeStatusCheck = false;
							}
						}
					}

				}

			}

		}


		if (['investorFinderPage', 'investeeFinderPage', 'corporateRiskPage', 'showDirectorScreenPage', 'user-management', 'hnwiPage', 'buyersDashboard', 'suppliersDashboard', 'supplierDashboard','contractFinderPage', 'diversityInclusion', 'diversityCalculation', 'ppcPage', 'payments', 'promptSearchAi', 'supplierResilience'].includes(this.thisPage)) {
			this.page = 0;
			this.first = 0;
			this.rows = 25;

			if (this.filterSearchArray && this.filterSearchArray.length > 0) {
				this.filterSearchArray = [];
			}
			if (this.sortOn && this.sortOn.length > 0) {
				this.sortOn = [];
			}
		}

		if ( this.thisPage == "diversityInclusion") {
			this.isDiversityReset = true;
		}

		if (this.thisPage == "customerWatchPage") {

			this.page = 0;
			this.first = 0;
			this.rows = 25;

			if (this.filterSearchArray && this.filterSearchArray.length > 0) {
				this.filterSearchArray = [];
			}

		}

		if ( [ 'buyerNonRegPage', 'supplierNonRegPage', 'esgWatchPage' ].includes(this.thisPage) ) {
			this.page = 0;
			this.first = 0;
			this.rows = 25;
		}
		if ( [ 'diversityCalculation', 'supplierResilience' ].includes(this.thisPage) ) {
			let requestObject = {
				pageSize: 25,
				startAfter: 0,
				sortOn: [],
				filterSearchArray: [],
				pageNumber: 1,
				reset: true
			};
			this.updateTableAfterPagination.emit(requestObject);
			
		}

		this.searchCompanyService.updatePayload( { filterData: this.preparedPayloadBody.filterData } );

		let pageChangeEventObj = { first: this.first, rows: this.rows, page: this.page };
		this.pageChange(pageChangeEventObj);

		if ( this.thisPage == 'netZero' ) {
			this.resetTableSortState(tableData);
			tableData['_value'] = this.initialData;
		}

	}
	
	checkKey(obj, key) {
		return obj.hasOwnProperty(key)
	}

	removeHyphen(str) {
		if (!(str == "null" || str == undefined || str == null)) {
			return str;
		}
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

	exportCSVToMailDialog() {
		if ( this.userAuthService.hasAddOnPermission('defaultExportFeature') ) {
			this.customEmailOrNotdialog = true;
			this.btnLabel = undefined;
		}
	}
	exportFilterDialog(label) {
		this.customEmailOrNotdialog = true;
		this.btnLabel = label;
	}

	validateEmail(emailField) {
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if (reg.test(emailField) == false) {
			this.emailValidateBool = false;
		} else {
			this.emailValidateBool = true;
		}
	}

	turnOffNotification(tableRowData) {
		let requestBodyObject: any = {
			userId: tableRowData.userId,
			companyNumber: tableRowData.companyNumber,
			customerNotification: !tableRowData.customerNotification
		};

		this.globalServerCommunication.globalServerRequestCall( 'put', 'DG_CBIL', 'updateBooleanOnBellClick', requestBodyObject ).subscribe( res => {

			if (res.body.status == 200) {

				let pageChangeEventObj = { first: this.first, rows: this.rows, page: this.page };

				setTimeout(() => {

					this.selectedCompany = [];
					this.pageChange(pageChangeEventObj);

				}, 1000);

			}
		});
	}
	showDilog( rowData ){
		this.companyNumber = rowData.companyRegistrationNumber;
		this.companyName = rowData.companyName;
		this.confermDilogBox = true;
		this.getOthersContactInfoData();
	}
	

	GoogleURLCompanyURLwithoutWordCompany(companyName) {
		return this.commonService.GoogleURLCompanyURLwithoutWordCompany(companyName);
	}
	linkedinURLForCompany(companyName) {
		return this.commonService.linkedinURLForCompany(companyName);
	}
	GoogleURLCompanyURL(companyName) {
		return this.commonService.GoogleURLCompanyURL(companyName);
	}
	checkSubscriptionAuth(conditionCheck, route) {

		// if (this.authGuardService.isLoggedin()) {

			if (!conditionCheck) {
				event.preventDefault();
				event.stopPropagation();
				this.showUpgradePlanDialog = true;
			} else {
				let routeUrl: any;

				if (typeof route == 'string') {
					routeUrl = route;
				} else {
					routeUrl = this.router.serializeUrl(this.router.createUrlTree(route));
				}

				window.open(routeUrl, '_blank');
			}

		// } else {
		// 	event.preventDefault();
		// 	event.stopPropagation();
		// 	this.showLoginDialog = true;
		// }

	}
	/* For Charges Quick On Hover Data */
	showPersonOutstandingData(event, chargeData, prop) {

		this.chargeOnHoverData = [];
		this.monthArrayForCharges = [];
		let propVar = prop.toLowerCase().replace(/ *\([^)]*\) */g, "").trim();
		let chargeDescriptionName = [], shortParticularName = [];
		this.tagNameArr = [];

		this.chargeOnHoverData = chargeData;

		for (let charge of this.chargeOnHoverData) {

			for (let mortage of charge.mortgageDetails) {

				if (mortage.description == propVar) {

					this.monthArrayForCharges.push(MonthForChargesTable[parseInt(charge['createdMonth'])]);

					this.mortageDesc = charge.mortgageDetails.filter(obj => {

						if (obj.recordType === 'mortgage type') {
							chargeDescriptionName.push(obj.description);
						}

						if (obj.recordType === 'mortgage detail') {

							shortParticularName.push(obj.description);

							if (obj.tagName && obj.tagName.length > 0) {
								this.tagNameArr.push(obj.tagName)
							}
						}

						return chargeDescriptionName;
					});
				}
			}

		}

		let sortedMonth = this.monthArrayForCharges.filter(function (value, index, self) {
			return self.indexOf(value) === index;
		}).join(', ');

		this.chargeMonth = sortedMonth;


		let sortedDesc = chargeDescriptionName.filter(function (value, index, self) {
			return self.indexOf(value) === index;
		}).join(', ');
		this.chargeDescription = this.titlecasePipe.transform(sortedDesc);

		let sortedShortParticular = shortParticularName.filter(function (value, index, self) {
			return self.indexOf(value) === index;
		}).join(', ');

		this.shortParticular = this.titlecasePipe.transform(sortedShortParticular);


		let sortedTagNames: string = this.tagNameArr.filter(function (value, index, self) {
			return self.indexOf(value) === index;
		}).join(',');
		this.tagNameData = this.titlecasePipe.transform(sortedTagNames.replace(/,/g, ", "))

		if (event.currentTarget.classList.contains('infoName')) {


			let targetElm = event.currentTarget, elmPositions = targetElm.getBoundingClientRect();

			setTimeout(() => {

				this.chargesDataPopupOnHover.nativeElement.style.visibility = 'visible';

				let popoverElm = this.chargesDataPopupOnHover.nativeElement;

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

	hideOutstandingonHoverData() {
		if (this.chargesDataPopupOnHover) {
			this.chargesDataPopupOnHover.nativeElement.removeAttribute('style');
		}
	}

	reduceExportLimit() {
        if ( [ "showDirectorScreenPage", "investorFinderPage", "investeeFinderPage", "showChargesTablePage", "companyListOfIServiceCategoryPage", "showContactScreen", 'hnwiPage', 'buyersDashboard', 'suppliersDashboard', 'supplierDashboard', 'contractFinderPage', 'esgWatchPage', 'user-management' ].includes(this.thisPage)) {
			
            let obj = {
                userId: this.userDetails?.dbID,
                thisPage: this.thisPage,
                newLimit: this.newLimit
            }
            this.globalServerCommunication.reduceExportLimit(obj);

			// let resobj = {
			// 	userId: this.userDetails?.dbID
			// }
            
			this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST ', 'getUserExportLimit' ).subscribe( res => {
				
				this.limitDisplayForCustomExport = res.body['advancedLimit'];
				
            });
        }

    }

	showReadMoreLess(descriptionTextElement: ElementRef) {
		if (descriptionTextElement['classList'].contains('limitTextHeight')) {
			descriptionTextElement['classList'].remove('limitTextHeight');
			descriptionTextElement['nextElementSibling'].innerText = 'Read Less';
		} else {
			descriptionTextElement['classList'].add('limitTextHeight');
			descriptionTextElement['nextElementSibling'].innerText = 'Read More';

		}
	}

	viewShareholdingsData(rowData) {

		this.sharedLoaderService.showLoader();

		if (this.thisPage == 'showDirectorScreenPage') {
			let reqObj = [ rowData.pnr ];

			this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_COMPANY_DETAILS', 'shareholdingsForDirectorDetails', reqObj ).subscribe( res => {
				if (res['status'] == 200) {

					this.shareholderNShareholdingDetailsSummaryData = res['results']['shareholdings'];

					if ( [ this.subscribedPlanModal['Start'], this.subscribedPlanModal['Valentine_Special'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Premium_Trial_48_Hours'] ].includes( this.userDetails?.planId ) && this.shareholderNShareholdingDetailsSummaryData.length > 24 ) {
			
						this.shareholderNShareholdingDetailsSummaryData.length = 25;
			
					}

					this.shareholderNShareholdingDetailsSummaryData = this.extractShareholdingsData(this.shareholderNShareholdingDetailsSummaryData);

				}

				this.viewShareholdings = true;
				this.sharedLoaderService.hideLoader();
			});

		}

		if (this.thisPage == 'investorFinderPage') {
		let obj = [ rowData.companyRegistrationNumber ]
			this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_COMPANY_DETAILS', 'companyShareHoldings', obj ).subscribe( res => {

				// if (res.body['results'] == 200) {

					this.shareholderNShareholdingDetailsSummaryData = res.body['results']['shareholdings'];

					if ( [  this.subscribedPlanModal['Start'], this.subscribedPlanModal['Valentine_Special'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Premium_Trial_48_Hours'] ].includes( this.userDetails?.planId ) && this.shareholderNShareholdingDetailsSummaryData.length > 24 ) {
			
						this.shareholderNShareholdingDetailsSummaryData.length = 25;
			
					}

					this.shareholderNShareholdingDetailsSummaryData = this.extractShareholdingsData(this.shareholderNShareholdingDetailsSummaryData);
					
					this.shareholderNShareholdingDetailsSummaryData = this.shareholderNShareholdingDetailsSummaryData.filter(obj => obj.shareHoldingCompanyName !== undefined)

				// }

				this.viewShareholdings = true;
				this.sharedLoaderService.hideLoader();
			});

		}

		if (this.thisPage == 'investeeFinderPage') {
			let reqobj = [ rowData.companyRegistrationNumber ]
			this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_COMPANY_DETAILS', 'shareDetails', reqobj ).subscribe( res => {
				
				if (res.body['status'] == 200) {

					this.shareholderNShareholdingDetailsSummaryData = res.body['results'];

					if ( [  this.subscribedPlanModal['Start'], this.subscribedPlanModal['Valentine_Special'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Premium_Trial_48_Hours'] ].includes( this.userDetails?.planId ) && this.shareholderNShareholdingDetailsSummaryData.length > 24 ) {
			
						this.shareholderNShareholdingDetailsSummaryData.length = 25;
			
					}

					for (let shareHolder of this.shareholderNShareholdingDetailsSummaryData) {

						let full_name = "";
						let shareholder_Address = "";

						if (shareHolder.share_holders_details.shareholderForename) {

							full_name = shareHolder.share_holders_details.shareholderForename;

						}
						if (shareHolder.share_holders_details.shareholderSurname) {

							full_name += ' ' + shareHolder.share_holders_details.shareholderSurname;

						}
						if (shareHolder.share_holders_details.shareholderAddress1) {
							shareholder_Address += this.titlecasePipe.transform(shareHolder.share_holders_details.shareholderAddress1) + ', '
						}
						if (shareHolder.share_holders_details.shareholderAddress2) {
							shareholder_Address += this.titlecasePipe.transform(shareHolder.share_holders_details.shareholderAddress2) + ', '
						}
						if (shareHolder.share_holders_details.shareholderAddress3) {
							shareholder_Address += this.titlecasePipe.transform(shareHolder.share_holders_details.shareholderAddress3) + ', '
						}
						if (shareHolder.share_holders_details.shareholderAddress4) {
							shareholder_Address += this.titlecasePipe.transform(shareHolder.share_holders_details.shareholderAddress4) + ', '
						}
						if (shareHolder.share_holders_details.shareholderAddress5) {
							shareholder_Address += this.titlecasePipe.transform(shareHolder.share_holders_details.shareholderAddress5) + ', '
						}
						if (shareHolder.share_holders_details.shareholderPostcode) {
							shareholder_Address += shareHolder.share_holders_details.shareholderPostcode.toUpperCase();
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

				}
				
				this.cmnyNumberForStats = [];
				this.shareholderNShareholdingDetailsSummaryData.filter( res => {
					if ( res?.share_holder_reg ) {
						this.cmnyNumberForStats.push( res.share_holder_reg );
					}
				} )

				this.viewShareholdings = true;
				this.sharedLoaderService.hideLoader();
			});

		}

		if (this.thisPage == 'hnwiPage') {

			this.hnwiShareholdingDetailsSummaryData = [];

			setTimeout(() => {

				this.hnwiShareholdingDetailsSummaryData = rowData.shareholdingInformation;
				this.hnwiShareholdingDetailsSummaryData = this.hnwiShareholdingDetailsSummaryData.sort( a => a.companyStatus == 'live' ? -1 : 1 );

				if ( [  this.subscribedPlanModal['Start'], this.subscribedPlanModal['Valentine_Special'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Premium_Trial_48_Hours'] ].includes( this.userDetails?.planId ) && this.hnwiShareholdingDetailsSummaryData.length > 24 ) {
		
					this.hnwiShareholdingDetailsSummaryData.length = 25;
		
				}

				this.shareHoldingLiveCount = rowData.shareHoldingLiveCount;
				this.shareHoldingDissolvedCount = rowData.shareHoldingTotalCount - rowData.shareHoldingLiveCount;

				for (let shareholdings of this.hnwiShareholdingDetailsSummaryData) {

					if (shareholdings.statutoryAccounts) {
						shareholdings['turnover'] = shareholdings.statutoryAccounts[0].turnover
						shareholdings['estimated_turnover'] = shareholdings.statutoryAccounts[0].estimated_turnover
					}

					if (shareholdings.addressDetails) {
						shareholdings['postcode'] = shareholdings.addressDetails.postcode
						shareholdings['region'] = shareholdings.addressDetails.region
					}

					if (shareholdings.addressDetails) {
						shareholdings['postcode'] = shareholdings.addressDetails.postcode
					}
					if (shareholdings.industryTagList) {
						shareholdings['industryTagList'] = this.makeUpperCaseAfterCommas(shareholdings.industryTagList.toString());
					}
					if (shareholdings.sic_code_description) {
						shareholdings['sic_code_description'] = this.titlecasePipe.transform(shareholdings.sic_code_description);
					}
				}

				this.cmnyNumberForStats = [];
				this.hnwiShareholdingDetailsSummaryData.filter( res => {
					if ( res?.companyRegistrationNumber ) {
						this.cmnyNumberForStats.push( res.companyRegistrationNumber );
					}
				} )
				
				this.viewShareholdings = true;
				this.sharedLoaderService.hideLoader();

			}, 1000);


		}

	}

	extractShareholdingsData(inputData) {

		for (let shareholdings of inputData) {

			if (shareholdings["companyInformation"]["businessName"] !== null || shareholdings["companyInformation"]["businessName"] !== undefined || shareholdings["companyInformation"]["companyStatus"] !== null || shareholdings["companyInformation"]["companyStatus"] !== undefined) {
				shareholdings['shareHoldingCompanyName'] = shareholdings["companyInformation"]["businessName"];
				shareholdings['shareHoldingCompanyStatus'] = shareholdings["companyInformation"]["companyStatus"];
			}

			if (shareholdings['totalShareCount'] !== undefined && shareholdings['totalShareCount'] !== null && shareholdings['totalShareCount'] > 0) {
				shareholdings["share_percent"] = ((shareholdings['numberOfSharesIssued'] * shareholdings['value']) / shareholdings['totalShareCount']) * 100;
				shareholdings["share_percent"] = +shareholdings["share_percent"];
			} else {
				shareholdings["share_percent"] = "";
			}

			if (shareholdings.companyInformation && shareholdings.companyInformation.sicCode07) {
				shareholdings['sic_code'] = shareholdings.companyInformation.sicCode07;
			}
		}

		return inputData;

	}

	customTableSort(event: any, tableData, fieldName?: string) {	

		if ( this.subscribedPlanModal['Valentine_Special'].includes( this.userDetails?.planId ) ) {
			this.showUpgradePlanDialog = true;
		} else {

			tableData._sortField = fieldName;
			let sortOrder: string = 'asc',
			tempObj: any = {};

			sortOrder = event.order == 1 ? 'asc' : 'desc';
			fieldName = this.thisPage == 'ppcPage' ? fieldName : this.resetString( fieldName );
			fieldName = fieldName;
			tempObj[fieldName] = sortOrder;
	
			if (this.sortOn.length) {
				this.sortOn = [];
			}
	
			this.sortOn.push(tempObj);
	
			if ( this.thisPage == "showChargesTablePage" || this.thisPage == "showTradeTablePage" ) {
	
				this.sharedLoaderService.showLoader();
				this.eventOrder = event.order;
	
				if (this.activeRoute.snapshot.queryParams['cListId'] && this.activeRoute.snapshot.queryParams['pageName']) {
					if (this.activeRoute.snapshot.queryParams['cListId']) {
	
						let listId = this.activeRoute.snapshot.queryParams['cListId'];
						this.searchFiltersService.getListOfCompaniesForAblCharges(listId, this.rows, event.page + 1, this.filterSearchArray, this.sortOn).then(data => {
	
							let dataArray = [];
							this.listDataValues = [];
	
							if (data.body['status'] == 200) {
								for (let resultData of data.body['results'].hits) {
									dataArray.push(resultData._source)
								}
	
								this.searchTotalCount = data.body['total'];
								this.sharedLoaderService.hideLoader();
							}
	
						});
					}
				} else {
					if( this.activeRoute.snapshot.queryParams['showTrade'] == 'true' ){

						this.tradeSearcSortObj.sortingForTrade = this.sortOn
						this.resetIntrntnltrade.emit(this.tradeSearcSortObj)
						// this.eventOrder = event.order;
					}

					let pageChangeEventObj = { page: 0, first: 0, rows: this.rows };
					this.pageChange( pageChangeEventObj );
					return;
				}
	
			} else if ( this.thisPage == 'showDirectorScreenPage' ) {

				this.searchCompanyService.updatePayload({
					sortOn: this.sortOn ? this.sortOn : [],
					filterSearchArray: this.filterSearchArray ? this.filterSearchArray : []
				});
	
				this.tableOutputValues.emit( 'director' );
				this.eventOrder = event.order;
				return; 
	
			} else if (['investorFinderPage', 'investeeFinderPage', 'corporateRiskPage', 'user-management', 'hnwiPage', 'buyersDashboard','contractFinderPage', 'suppliersDashboard', 'diversityInclusion', 'diversityCalculation', 'ppcPage'].includes(this.thisPage)) {
				let requestObject = {
					pageSize: this.rows,
					startAfter: this.page * this.rows,
					sortOn: this.sortOn,
					filterSearchArray: this.filterSearchArray
				};
				this.updateTableAfterPagination.emit(requestObject);
				this.eventOrder = event.order;
	
			}

		}

	}

	defaultTableSort(event: any, tableData, field?) {
		
		if ( [ 'showChargesTablePage', 'showTradeTablePage', 'showDirectorScreenPage', 'investorFinderPage', 'investeeFinderPage', 'corporateRiskPage', 'user-management', 'hnwiPage', 'buyersDashboard','contractFinderPage', 'suppliersDashboard', 'diversityInclusion', 'diversityCalculation', 'ppcPage' ].includes(this.thisPage) ) {	
			
			if ( event.order != this.eventOrder || this.fieldName != event.field ) {
				this.customTableSort( event, tableData, event.field );
				this.fieldName = event.field;
			}

		} else {

			if ( event.field == "lastmade" ) {
				event.field = "accountsMadeUpDate";
			}
			
			let tempObj: any = event.order,
			tableVal: any;
	
			if (tableData.filteredValue && tableData.filteredValue.length) {
				tableVal = JSON.parse(JSON.stringify(tableData.filteredValue));
			} else {
				// tableVal = JSON.parse(JSON.stringify(tableData.value));
				tableVal = JSON.parse(JSON.stringify(event.data));
			}
	
			if (this.first === undefined) {
				this.first = tableData.first;
			}
	
			let arrToSort = [], firstArr = [], lastArr = [];
	
			if (['customerWatchPage', 'companyListOfIServiceCategoryPage'].includes(this.thisPage)) {
	
				arrToSort = tableVal;
	
			} else {
	
				if (this.first == 0) {
	
					firstArr = [];
	
					arrToSort = tableVal.slice(this.first, (this.first + this.rows));
	
					lastArr = tableVal.slice(this.first + this.rows);
	
				} else if ((this.first + this.rows) !== tableVal.length) {
	
					firstArr = tableVal.slice(0, this.first);
	
					arrToSort = tableVal.slice(this.first, (this.first + this.rows));
	
					lastArr = tableVal.slice(this.first + this.rows);
	
				} else {
	
					firstArr = tableVal.slice(0, this.first);
	
					arrToSort = tableVal.slice(this.first, (this.first + this.rows));
	
					lastArr = [];
	
				}
	
			}
	
			arrToSort.sort((data1, data2) => {
	
				let value1;
				let value2;
	
				value1 = data1[event.field];
				value2 = data2[event.field];
				
				let result = null;
	
				if (value1 == null && value2 != null) {
					result = -1;
				} else if (value1 != null && value2 == null) {
					result = 1;
				} else if (value1 == null && value2 == null) {
					result = 0;
				} else if ( ( event.field === 'accountsMadeUpDate' || event.field === 'IncorporationDate' || event.field == 'companyRegistrationDate' ) && value1 !== "" && value2 !== "" ) {
	
					value1 = value1.split('/').reverse().join('');
					value2 = value2.split('/').reverse().join('');
	
					result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
	
				} else if ( ( event.field === 'Date Published' || event.field == 'Commitment Deadline' ) && value1 !== "" && value2 !== "" ) {
	
					value1 = value1.split('-').reverse().join('');
					value2 = value2.split('-').reverse().join('');
	
					result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
	
				} else if( (event.field === 'cWebsite') && value1 !== "" && value2 !== "") {
					value1 = value1.replace(/www./g, '');
					value2 = value2.replace(/www./g, '');
					
					result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
					
				} else {
	
					result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
				}
	
				return (tempObj * result);
	
			});
	
			tableVal = firstArr.concat(arrToSort).concat(lastArr);
	
			if (tableData.filteredValue && tableData.filteredValue.length) {
				tableData.filteredValue = tableVal;
			} else {
				// tableData.value = tableVal;
				event.data = JSON.parse(JSON.stringify(tableVal));
				tableData.value = JSON.parse(JSON.stringify(event.data));
			}
			
			tableData['_first'] = this.first;
			return;
		}

	}

	resetString( inputStr ): string {

		if ( this.formatSortField.hasOwnProperty( inputStr ) ) {
			inputStr = this.formatSortField[ inputStr ];
		}
		const text = inputStr;
		const result = text.includes('_') ? text.replace(/([A-Z_])/g, " ").split(' ').map( char => char[0].toUpperCase() + char.slice(1) ).join(' ') : text.replace(/([A-Z])/g, " $1");
		const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
		return finalResult;
	}

	customSort(event: SortEvent) {
        event.data.sort((data1, data2) => {			
            let value1 = data1[event.field];
            let value2 = data2[event.field];
            let result = null;

            if (value1 == null && value2 != null) result = -1;
            else if (value1 != null && value2 == null) result = 1;
            else if (value1 == null && value2 == null) result = 0;
			else if( event.field == 'companyRegistrationDate' ) {
				value1 = value1.split('/').reverse().join('');
				value2 = value2.split('/').reverse().join('');
				result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
			}
            else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
            else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

            return event.order * result;
        });
    }

	deleteUserData(tableData, userData) {

		// if (this.authGuardService.isLoggedin()) {

			let obj = [];

			for (let data of userData) {
				obj.push(data._id);
			}

			this.confirmationService.confirm({
				message: this.constantMessages['confirmation']['delete'],
				header: 'Delete Confirmation',
				icon: 'pi pi-info-circle',
				key: this.thisPage.toString(),
				accept: () => {

						this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_USER_API', 'deleteUser', obj ).subscribe( res => {
						if (res.body.status == 200) {

							this.msgs = [];
							this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['userDeletedSuccess'] });
							setTimeout(() => {
								this.msgs = [];
							}, 5000);

							let requestObject = {
								pageSize: this.rows,
								startAfter: this.page * this.rows
							};

							this.updateTableAfterPagination.emit(requestObject);

						} else if (res.body.status == 201) {

							this.msgs = [];
							this.msgs.push({ severity: 'error', summary: this.constantMessages['errorMessage']['userNotDeletedMessage'] });

							setTimeout(() => {
								this.msgs = [];
							}, 5000);

						}

						this.resetFilters(tableData);

					});
				}
			});

		// } else {
		// 	this.showLoginDialog = true;
		// }
	}

	createNewUser() {
		this.userTypeCompany = false;
		this.userTypeIndividual = false;
		this.planSelected = false;

		this.createNewUserDialog = true;
	}

	cancelPlanDialogBox() {
		this.createNewUserDialog = false;
		this.planNotSelected = false;
		this.selectedPlanName = undefined;
	}

	choosePlanEvent() {
		if (this.selectedPlanName) {
			this.planNotSelected = false;
		} else {
			this.planNotSelected = true;
		}
	}

	selectPlan(planType) {

		if (this.selectedPlanName !== "" && this.selectedPlanName !== undefined) {
			this.planNotSelected = false;
			this.createNewUserDialog = false;
			this.planSelected = true;

			if (this.selectedPlanName == 'Premium' && this.selectedPlanName !== undefined) {
				if (planType == 'trial') {

					this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( res => {
						if (res.body.status == 200) {
							this.selectedPlan = res.body['results'];
							this.getPlanDetails(this.selectedPlan);
						}
					});
					this.planSelected = true;
				} else if (planType == 'monthly') {

					this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( res => {
						if (res.body.status == 200) {
							this.selectedPlan = res.body['results'];
							this.selectedPlan['cost'] = 0;
							this.getPlanDetails(this.selectedPlan);
						}
					});
					this.planSelected = true;

				} else if (planType == 'annualy') {
	
					this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( res => {
						if (res.body.status == 200) {
							this.selectedPlan = res.body['results'];
							this.selectedPlan['cost'] = 0;
							this.getPlanDetails(this.selectedPlan);
						}
					});
					this.planSelected = true;
				}
			} else if (this.selectedPlanName == 'Enterprise' && this.selectedPlanName !== undefined) {
				if (planType == 'weekly') {

					this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( res => {
						if (res.body.status == 200) {
							this.selectedPlan = res.body['results'];
							this.getPlanDetails(this.selectedPlan);
						}
					});
					this.planSelected = true;
				} else if (planType == 'trial') {

					this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( res => {
						if (res.body.status == 200) {
							this.selectedPlan = res.body['results'];
							this.getPlanDetails(this.selectedPlan);
						}
					});
					this.planSelected = true;
				} else if (planType == 'monthly') {

					this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( res => {
						if (res.body.status == 200) {
							this.selectedPlan = res.body['results'];
							this.getPlanDetails(this.selectedPlan);
						}
					});
					this.planSelected = true;

				} else if (planType == 'annualy') {

					this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( res => {
						if (res.body.status == 200) {
							this.selectedPlan = res.body['results'];
							this.getPlanDetails(this.selectedPlan);
						}
					});
					this.planSelected = true;
				}
			} else if (this.selectedPlanName == 'Expand' && this.selectedPlanName !== undefined) {
				if (planType == 'weekly') {

					this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( res => {
						if (res.body.status == 200) {
							this.selectedPlan = res.body['results'];
							this.getPlanDetails(this.selectedPlan);
						}
					});
					this.planSelected = true;
				} else if (planType == 'trial') {

					this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( res => {
						if (res.body.status == 200) {
							this.selectedPlan = res.body['results'];
							this.getPlanDetails(this.selectedPlan);
						}
					});
					this.planSelected = true;
				} else if (planType == 'monthly') {

					this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( res => {
						if (res.body.status == 200) {
							this.selectedPlan = res.body['results'];
							this.getPlanDetails(this.selectedPlan);
						}
					});
					this.planSelected = true;
				} else if (planType == 'annualy') {

					this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( res => {
						if (res.body.status == 200) {
							this.selectedPlan = res.body['results'];
							this.getPlanDetails(this.selectedPlan);
						}
					});
					this.planSelected = true;
				}
			}
			setTimeout(() => {
				this.createNewUserDialog = true;
			}, 1000);
		} else {
			this.planNotSelected = true;
		}
	}

	getPlanDetails(plan) {
		this.planDetails.planId = plan._id;
		this.planDetails.planCost = plan.cost;
		this.planDetails.hits = plan.hits;
		this.planDetails.priceperhit = plan.priceperhit;
		this.planDetails.companyReport = plan.companyReport;
		this.planDetails.creditReportLimit = plan.creditReportLimit;
		this.planDetails.titleRegisterHitLimit = plan.titleRegisterHitLimit;
		this.planDetails.pepAndSanctionHitLimit = plan.pepAndSanctionHitLimit;
		this.planDetails.companyMonitorLimit = plan.companyMonitorLimit;
		this.planDetails.directorMonitorLimit = plan.directorMonitorLimit;
		this.planDetails.directorReportLimit = plan.directorReportLimit;
		this.planDetails.contactInformationLimit = plan.contactInformationLimit;
		this.planDetails.basicLimit = plan.basicLimit;
		this.planDetails.advancedLimit = plan.advancedLimit;
		this.planDetails.landLimit = plan.landLimit;
		this.planDetails.corpLandLimit = plan.corpLandLimit;
		this.planDetails.chargesLimit = plan.chargesLimit;
	}

	getReturnedRequestFromSignUp(event) {
		if (event == 'goToTeamsPageContainer') {

			this.createNewUserDialog = false;

			this.updateTableAfterPagination.emit(event);

		} else if (event) {

			this.createNewUserDialog = false;

			let requestObject = {
				pageSize: this.rows,
				startAfter: event.page * this.rows
			};

			this.updateTableAfterPagination.emit(requestObject);

			this.msgs = [];
			this.msgs.push({ severity: 'success', summary: "User Created Successfully" });

			setTimeout(() => {
				this.msgs = [];
			}, 5000);

			setTimeout(() => {
				const currentUrl = this.router.url;
				this.router.onSameUrlNavigation = 'reload';
				this.router.navigate( [ currentUrl ] ); 
			}, 6000);

		}
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

	makeUpperCaseAfterCommas(str) {
		return this.titlecasePipe.transform(str).replace(/,\s*([a-z])/g, function (e) { return e.toUpperCase() });
	}

	changeToClientAdmin( rowData ) {
		this.sharedLoaderService.showLoader();
		let userRole;
	
		if(rowData.userRole == 'Client User'){

			userRole = rowData.isClientAdminCheck == true ? 'Client Admin' : 'Client User';

		} else if (rowData.userRole == 'Individual') {

			userRole = rowData.isClientAdminCheck == true ? 'Client Admin Master' : 'Client User';

		} else {
			userRole = rowData.isClientAdminCheck == true ? 'Client Admin' : 'Client User';
		}
		
		let obj = {
			user_id: rowData._id,
			case: 3,
			subs_id: rowData.subs_id,
			endDate: rowData.subs_endDate,
			userRole: userRole,
			previousUserRole: rowData.userRole,
			loginEmail: this.userDetails?.email,
			isAdmin: this.userAuthService.hasRolePermission( ['Super Admin'] )
		}
		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_USER_API', 'updateUser' , obj ).subscribe( res => {
			if ( res.status == 200 ) {

				this.msgs = [];

				this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['userUpdateSuccessMessage'] });

				setTimeout(() => {
					this.msgs = [];
				}, 2000);

				this.updateTableAfterPagination.emit( { pageSize: 25, startAfter: 1 } );

				this.sharedLoaderService.hideLoader();
				
			} else if ( res.status == 201 ) {
				
				rowData.isClientAdminCheck = false;

				this.msgs = [];
				this.msgs.push({ severity: 'info', summary: this.constantMessages['infoMessage']['errorInfoMessage'] });
				
				setTimeout(() => {
					this.msgs = [];
				}, 2000);
				
				this.sharedLoaderService.hideLoader();

			}
		});

	}

	formatSocialMediaLinks(route: any[]) {

		let routeUrl: any;
		if (typeof route == 'string') {
			routeUrl = route;
			if (routeUrl.includes('https://www.')) {
				routeUrl = routeUrl.replace('https://www.', '');
				routeUrl = 'https://www.' + routeUrl;
			} else if (routeUrl.includes('https://www.in.')) {
				routeUrl = routeUrl.replace('https://www.in.', '');
				routeUrl = 'https://in.' + routeUrl;
			} else if (routeUrl.includes('https://www.https://')) {
				routeUrl = routeUrl.replace('https://www.https://', '');
				routeUrl = 'https://' + routeUrl;
			} else if (routeUrl.includes('https://uk.')) {
				routeUrl = routeUrl.replace('https://uk.', '');
				routeUrl = 'https://uk.' + routeUrl;
			} else if (routeUrl.includes('https://')) {
				routeUrl = routeUrl;
			} else {
				routeUrl = 'https://' + routeUrl;
			}
		} else {
			routeUrl = this.router.serializeUrl(this.router.createUrlTree(route));
		}
		window.open(routeUrl, '_blank');
	}

	closeDialogBox() {
		if ( this.subscribedPlanModal['Valentine_Special'].includes( this.userDetails?.planId ) ) {
			this.resetFilters( this.adminRecordListTable );
		}
	}

	goToUserDetails(rowData) {
		
		if (this.thisPage == 'user-management') {
			
			if (rowData.userRole == 'Client Admin Master') {
				
				localStorage.setItem("clientMasterEmail", rowData.email);
				this.router.navigate(['/user-management/update-corporate', rowData.companyName]);

			} else {

				this.router.navigate(['/user-management/update-user', rowData.email]);
			}

		}

		if (this.thisPage == 'update-user') {

			let passCompanyName = this.activeRoute.snapshot.params['companyName'];

			this.router.navigate(['/user-management/update-corporate-user', passCompanyName, rowData.email]);

		}
	}

	selectedTableRoworHeader( selectedRow ) {
		let NonUkCompanies = []
		
		this.selectCompanyBoolean = false;
		
		if ( selectedRow.length ) {

			selectedRow.filter(val => {
				if ( val.userRole == 'Client Admin Master' ) {
					this.selectCompanyBoolean =  true;
				}
				// if ( val.hasOwnProperty('nonUkCompanyBool') && !val.nonUkCompanyBool  ) {
				// 	NonUkCompanies.push( val )
				// 	this.selectedCompany = NonUkCompanies
				// }
			});

		} else {
			this.selectCompanyBoolean = false;
		}
		
	}
	gotToSearchPage(data, pageNmae?){

		let filter = [];
		filter.push({ chip_group: 'Saved Lists', chip_values: [this.globalFilterDataObject['listName']], pageName: pageNmae }, { chip_group: 'Preferences', chip_values: ['Include dormant companies'], "preferenceOperator": [{"dormant_status": "include"}] }, { chip_group: 'Status', chip_values: [data.key] } );
			let urlStr: string;
	
			urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(filter), cListId: this.listId, listPageName: this.globalFilterDataObject['pageName'], listName: this.globalFilterDataObject['listName'] } }));
	
			window.open( urlStr, '_blank' );

	}

	toCheckStringType(val): boolean {
		return typeof val === 'string';
	}

	showNoticeIndentifier( inputData ) {
		inputData = inputData.trim();
		this.getNoticeIndentifierData.emit( inputData );
	}

	showText(descriptionTextElement: ElementRef) {
		if (descriptionTextElement['classList'].contains('limitTextHeight')) {
			descriptionTextElement['classList'].remove('limitTextHeight');
			descriptionTextElement['nextElementSibling'].innerText = 'Read Less';
		} else {
			descriptionTextElement['classList'].add('limitTextHeight');
			descriptionTextElement['nextElementSibling'].innerText = 'Read More';

		}
	}

	supplierDataByNoticeIndentifier(rowData) {

		let reqobj = [ rowData.notice_identifier ]

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_GOVTENABLER_API', 'supplierDataByNoticeIndentifier', reqobj ).subscribe( res => {
			
			if (res.body['status'] == 200) {

				this.contractFinderSuppliersDataValues = res.body['results']
			}

		});

		this.changeDetectionService.detectChanges();

		this.viewSuppliersTable = true;
	}


	formattedCamelCaseToSentence(str) {
		return this.commonService.formattedCamelCaseToSentence(str);
	}

	directorAddress(rowData){
		return this.commonService.directorAddress(rowData);
	}

	showUserinfoDialogBox(userId) {

		this.userDetailsInfoDataColumn = [
			{ field: 'previousLimit', header: 'Previous Limit', width: '140px', textAlign: 'left' },
			{ field: 'limitUsed', header: 'Limit Used', width: '80px', textAlign: 'left' },
			{ field: 'availableLimit', header: 'Available Limit', width: '150px', textAlign: 'left' },
			{ field: 'usedDate', header: 'Used Date', width: '180px', textAlign: 'center' },
			{ field: 'limitAdded', header: 'Limit Updated', width: '180px', textAlign: 'left' },
			{ field: 'updatedBy', header: 'Updated By', width: '160px', textAlign: 'center' },
			{ field: 'updatedDate', header: 'Updated Date', width: '180px', textAlign: 'center' },
		];

		let obj = [ userId ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_USER_API', 'getUserHistories', obj ).subscribe( res => {
			
			if ( res.body['status'] == 200 ) {

				this.userMgmtDetailsInfoDialogModal = true;
				this.userDetailsInfoData = res.body.data ? res.body.data : [];

				this.updateRowGroupMetaData();

			}

		})
	}

	updateRowGroupMetaData() {
        this.rowGroupMetadata = {};

        if (this.userDetailsInfoData) {

			this.userDetailsInfoData.sort( ( a, b ) => a['label'].localeCompare( b['label'] ));

            for (let i = 0; i < this.userDetailsInfoData.length; i++) {
				let rowData = this.userDetailsInfoData[i];
                let labelMetaData = rowData.label;
                
                if ( i == 0 ) {
                    this.rowGroupMetadata[ labelMetaData ] = { index: 0, size: 1 };
                }
                else {
                    let previousRowData = this.userDetailsInfoData[ i - 1 ];
                    let previousRowGroup = previousRowData.label;
					
                    if ( labelMetaData === previousRowGroup ) {
						
                        this.rowGroupMetadata[ labelMetaData ].size++;
						
					} else {
						
                        this.rowGroupMetadata[ labelMetaData ] = { index: i, size: 1 };


					}
                }

            }
        }
    }

	//Success Message For Export
	successMessageForExport( event ) {
		
		if ( event ) {

			this.msgs = [];
			this.msgs.push({ severity: event.severity, summary: event.message });
			
			setTimeout(() => {
				this.msgs = [];
				this.adminRecordListTable.selection = [];
			}, 2000);

			this.selectedCompany = [];

		}
		
	}

	// Reset Filter From Admin Record List Export 
	resetFilterTableFromExport( event ) {
		this.resetFilters( event );
	}

	goToStatsPage(screen?) {

		let routeLink
		if( screen == 'growthAnaysis' ) {
			routeLink = '/stats-analysis/growth-analysis'
		} else {
			routeLink = '/company-search/stats-insights'
		}
		let pageName: string, url;

		if( this.thisPage == 'showChargesTablePage' || this.thisPage == 'showTradeTablePage' ) {
			
			url = this.router.serializeUrl(
				this.router.createUrlTree(
					[routeLink],
					{
						queryParams: {
							chipData: JSON.stringify( this.preparedPayloadBody.filterData ),
							listPageName: ( this.thisPage == 'showChargesTablePage' && this.preparedPayloadBody.listId ) ? ListPageName.charges.outputPage : ( this.thisPage == 'showTradeTablePage' && this.preparedPayloadBody.listId ) ? ListPageName.trade.outputPage: '',
							cListId: this.preparedPayloadBody.listId,
							listName: this.showHeaderObj['listName']
						}
					}
				)
			);
			
		} else if ( this.thisPage == 'customerWatchPage' ) {
			// pageName = 'businessWatch';
			url = this.router.serializeUrl(
				this.router.createUrlTree([routeLink], { queryParams: { listPageName : ListPageName.businessWatch.outputPage } } )
			);
		} else if ( this.thisPage == 'companyListOfIServiceCategoryPage' ) {
			pageName = 'savedPortFolioPage';
			url = this.router.serializeUrl(
				this.router.createUrlTree([routeLink], { queryParams: { pageName : pageName, cListId: this.activeRoute.snapshot.queryParams['cListId'] } } )
			);
		} else if ( [ 'investorFinderPage', 'investeeFinderPage' ].includes( this.thisPage ) ) {
			// this.appliedFilters.filterData = this.appliedFilters.filterData.filter( item => item.chip_group == 'Saved Lists' );
			url = this.router.serializeUrl(
				this.router.createUrlTree([routeLink], { queryParams: { chipData: JSON.stringify(this.appliedFilters.filterData) , cListId: this.activeRoute.snapshot.queryParams['cListId'], listPageName: this.activeRoute.snapshot.queryParams['listPageName'], listName: this.activeRoute.snapshot.queryParams['listName'] } } )
			);
		} else if ( [ 'corporateRiskPage' ].includes( this.thisPage ) ) {
			url = this.router.serializeUrl(
				this.router.createUrlTree([routeLink], { queryParams: { chipData: JSON.stringify(this.appliedFilters.filterData) } } )
			);
		} else if ( [ 'diversityInclusion' ].includes( this.thisPage ) ) {
			let filterData = [];
			filterData.push( {chip_group: "Saved Lists", chip_values: [(this.globalFilterDataObject.listName)]})
			if( screen == 'growthAnaysis' ){
				url = this.router.serializeUrl(
					this.router.createUrlTree( [routeLink], { queryParams: { listPageName : 'diversityInclusion', cListId: this.globalFilterDataObject.listId, listName: this.globalFilterDataObject.listName } } )
				);
			} else {
				url = this.router.serializeUrl( this.router.createUrlTree( ['company-search/stats-insights'], { queryParams: { chipData: JSON.stringify(filterData), listPageName: 'diversityInclusion', cListId: this.globalFilterDataObject.listId, listName: this.globalFilterDataObject.listName} } ) );
			}



		} else if (  this.thisPage == 'diversityCalculation' || this.thisPage == 'supplierResilience' ) {
			let filterData = []
			filterData.push( {chip_group: "Saved Lists", chip_values: [JSON.stringify(this.globalFilterDataObject.listName)]})
			if( screen == 'growthAnaysis' ){
				url = this.router.serializeUrl( this.router.createUrlTree( ['/stats-analysis/growth-analysis'], { queryParams: { chipData: JSON.stringify(filterData), listPageName: this.thisPage, cListId: this.globalFilterDataObject.listId, listName: this.globalFilterDataObject.listName, diversityCalculationPage: true } } ) );
			} else if ( screen == 'localStatsScreen' ) {
				url = this.router.serializeUrl( this.router.createUrlTree( ['insights/diversity-stats'], { queryParams: { globalFilterDataObject: JSON.stringify(this.globalFilterDataObject) } } ) );
			} else {
				url = this.router.serializeUrl( this.router.createUrlTree( ['company-search/stats-insights'], { queryParams: { chipData: JSON.stringify(filterData), listPageName: this.thisPage, cListId: this.globalFilterDataObject.listId, listName: this.globalFilterDataObject.listName} } ) );
			}
		}

		window.open( url, "_blank");
		
	}

	checkAllRowDataCount( rowData ) {


		if ( rowData['belowTo30'] || rowData['50To65'] || rowData['30To50'] || rowData['aboveTo65'] ) {

			return true;

		}

		return false;

	}

	calculateBarWidth( rowData, directorAgeCount ) {

		let result;

		result = ( ( directorAgeCount / ( rowData['belowTo30'] + rowData['30To50'] + rowData['50To65'] + rowData['aboveTo65'] ) ) * 100 ) + '%';

		return result;

	}
	thisPageExportTemplate(event) {
		this.thisPageExportTemplateBool = event;
	}

	goToDiversityProgressReport( pageName ) {

		let url = this.router.serializeUrl(
			this.router.createUrlTree(['insights/progress-report'], { queryParams: { pageName: pageName } } )
		);
		window.open( url, "_blank");
	}

	showDetails( rowData ) {
		this.showInvestedCompany = true;
		this.investedCompanyData = rowData?.['investedCompany'] || [];
	}

}
