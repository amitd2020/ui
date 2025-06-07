import { Component, OnInit, Input, ViewChild, DoCheck, EventEmitter, Output, ElementRef, SimpleChanges, AfterViewInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, TitleCasePipe, DecimalPipe } from '@angular/common';
import { take } from 'rxjs';

import { ConfirmationService, MenuItem, SortEvent } from 'primeng/api';
import { Calendar } from 'primeng/calendar';
import { Table } from 'primeng/table';

import { subscribedPlan } from 'src/environments/environment';

import CustomUtils from 'src/app/interface/custom-pipes/custom-utils/custom-utils.utils';
import { UserInteractionMessages } from '../../../../../../assets/utilities/data/UserInteractionMessages.const';
import { DropdownOptionsType, RequiredConstant } from '../required-constants';
import { SharedLoaderService } from '../../shared-loader/shared-loader.service';
import { SearchFiltersService } from 'src/app/interface/service/search-filter.service';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { UserManagementService } from 'src/app/interface/service/user-management.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';
import { safeAlertColumns, safeAlertObj } from '../../../features-modules/company-details-module/overview/about/safeAlerts.const';

export enum Month {
	undefined, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
}

@Component({
	selector: 'dg-user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnChanges, OnInit, DoCheck, AfterViewInit {

	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'
	companyNumber: any;
	iTagMessage = 'Estimated Turnover = 7.3 times Trade Debtors.'
	initialData: Array<object> = [];

	@ViewChild('userListTable', { static: false }) private userListTable: Table;

	@ViewChild('subscription_EndDate', { static: false }) private subscription_EndDate: Calendar;
	@ViewChild('notesUpdatedDatePicker', { static: false }) private notesUpdatedDatePicker: Calendar;
	@ViewChild('userSavedListCreatedDatePicker', { static: false }) private userSavedListCreatedDatePicker: Calendar;
	@ViewChild('contactListCreatedDatePicker', { static: false }) private contactListCreatedDatePicker: Calendar;
	@ViewChild('contactListUpdatedDatePicker', { static: false }) private contactListUpdatedDatePicker: Calendar;
	@ViewChild('userSavedListUpdatedDatePicker', { static: false }) private userSavedListUpdatedDatePicker: Calendar;
	@ViewChild('userExportListCreatedDatePicker', { static: false }) private userExportListCreatedDatePicker: Calendar;
	@ViewChild('saveSearchesCreatedDatePicker', { static: false }) private saveSearchesCreatedDatePicker: Calendar;
	@ViewChild('updatedDatePicker', { static: false }) private updatedDatePicker: Calendar;
	@ViewChild('subscriptionDataStartDatePicker', { static: false }) private subscriptionDataStartDatePicker: Calendar;
	@ViewChild('subscriptionDataEndDatePicker', { static: false }) private subscriptionDataEndDatePicker: Calendar;
	@ViewChild('directorAppointedDatePicker', { static: false }) private directorAppointedDatePicker: Calendar;
	@ViewChild('deletedDirectorsDatePicker', { static: false }) private deletedDirectorsDatePicker: Calendar;
	@ViewChild('directorResignedDatePicker', { static: false }) private directorResignedDatePicker: Calendar;
	@ViewChild('chargesCreatedDatePicker', { static: false }) private chargesCreatedDatePicker: Calendar;
	@ViewChild('chargesRegisteredDatePicker', { static: false }) private chargesRegisteredDatePicker: Calendar;
	@ViewChild('chargesDeliveredDatePicker', { static: false }) private chargesDeliveredDatePicker: Calendar;
	@ViewChild('discriptionDatePicker', { static: false }) private discriptionDatePicker: Calendar;
	@ViewChild('ccjPaidDatePicker', { static: false }) private ccjPaidDatePicker: Calendar;
	@ViewChild('patentAndTradeDatePicker', { static: false }) private patentAndTradeDatePicker: Calendar;
	@ViewChild('ccjDatePicker', { static: false }) private ccjDatePicker: Calendar;
	@ViewChild('acquiredDatePicker', { static: false }) private acquiredDatePicker: Calendar;
	@ViewChild('companyRegistrationDatePicker', { static: false }) private companyRegistrationDatePicker: Calendar;
	@ViewChild('pscDateOfBirthDatePicker', { static: false }) private pscDateOfBirthDatePicker: Calendar;
	@ViewChild('safeAlertDatePicker', { static: false }) private safeAlertDatePicker: Calendar;
	@ViewChild('createNewPlansStartDatePicker', { static: false }) private createNewPlansStartDatePicker: Calendar;
	@ViewChild('createNewPlansEndDatePicker', { static: false }) private createNewPlansEndDatePicker: Calendar;
	@ViewChild('corporateLandDateProperietorPicker', { static: false }) private corporateLandDateProperietorPicker: Calendar;
	@ViewChild('relatedDirectorsAppointmentDatePicker', { static: false }) private relatedDirectorsAppointmentDatePicker: Calendar;
	@ViewChild('relatedDirectorsResignedDatePicker', { static: false }) private relatedDirectorsResignedDatePicker: Calendar;
	@ViewChild('companyCommentaryDateLoggedPicker', { static: false }) private companyCommentaryDateLoggedPicker: Calendar;
	@ViewChild('relatedCompaniesAppointedDatePicker', { static: false }) private relatedCompaniesAppointedDatePicker: Calendar;
	@ViewChild('relatedCompaniesIncorporationDatePicker', { static: false }) private relatedCompaniesIncorporationDatePicker: Calendar;
	@ViewChild('userLoginTimePicker', { static: false }) private userLoginTimePicker: Calendar;
	@ViewChild('creditScoreRatingChangeDatePicker', { static: false }) private creditScoreRatingChangeDatePicker: Calendar;
	@ViewChild('exportListCreatedOnDatePicker', { static: false }) private exportListCreatedOnDatePicker: Calendar;
	@ViewChild('statusFiledDatePicker', { static: false }) private statusFiledDatePicker: Calendar;
	@ViewChild('registeredDatePicker', { static: false }) private registeredDatePicker: Calendar;
	@ViewChild('projectStartDatePicker', { static: false }) private projectStartDatePicker: Calendar;
	@ViewChild('projectEndDatePicker', { static: false }) private projectEndDatePicker: Calendar;
	@ViewChild('creditorsDatePicker', { static: false }) private creditorsDatePicker: Calendar;
	@ViewChild('reportListCreatedOnDatePicker', { static: false }) private reportListCreatedOnDatePicker: Calendar;
	@ViewChild('create_dateDatePicker', { static: false }) private create_dateDatePicker: Calendar;
	@ViewChild('changeDatePicker', { static: false }) private changeDatePicker: Calendar;
	@ViewChild('issuedDatePicker', { static: false }) private issuedDatePicker: Calendar;
	@ViewChild('exemptionRegistrationDatePicker', { static: false }) private exemptionRegistrationDatePicker: Calendar;
	@ViewChild('pscNotifiedDatePicker', { static: false }) private pscNotifiedDatePicker: Calendar;
	@ViewChild('awardedDateDatePicker', { static: false }) private awardedDateDatePicker: Calendar;
	@ViewChild('closingDatePicker', { static: false }) private closingDatePicker: Calendar;
	@ViewChild('contractStartDatePicker', { static: false }) private contractStartDatePicker: Calendar;
	@ViewChild('contractEndDatePicker', { static: false }) private contractEndDatePicker: Calendar;
	@ViewChild('publishedDatePicker', { static: false }) private publishedDatePicker: Calendar;

	@ViewChild('planForm', { static: false }) planForm: NgForm;
	@ViewChild('checkSanctionsForm', { static: false }) checkSanctionsForm: NgForm;

	@ViewChild('companyQuickInfoPopover', { static: false }) private companyQuickInfoPopover: ElementRef;

	@Input() directorFailureData: any;
	@Input() listColumns: Array<any>;
	@Input() listDataValues: Array<any>;
	@Input() directorInfoComponentData: Array<any>;
	@Input() totalNumOfRecords: number;
	@Input() notesListDataValues: Array<any>;
	@Input() dashRecentDataValues: Array<any>;
	@Input() dashWatchlistDataValues: Array<any>;
	@Input() dashUserlistDataValues: Array<any>;
	@Input() dashSearchDataValues: Array<any>;
	@Input() cmnyNumberForStats: Array<string>;
	@Input() listPage: boolean = false;
	@Input() showFilterSearch: boolean = true;
	@Input() showRecordCount: boolean = true;
	@Input() dashboardPage: boolean = false;
	@Input() thisPage: string;
	@Input() dashNotesValues: Array<any>;
	@Input() detailPage: boolean = false;
	@Input() companyDetailsParams: any = {};
	@Input() showCheckBox: boolean = true;
	@Input() showExportButton: boolean = true;
	@Input() emailsListModalBoolean: boolean;
	@Input() freeUserCount: any;
	@Input() paidUserCount: any;
	@Input() totalUserCount: any;
	@Input() columnToggleData: Array<any>;
	@Input() tableName: string;
	@Input() sampleLrmPdf: boolean = false;
	@Input() searchTotalCount: number = 0;
	@Input() shareHoldingLiveCount: number = 0;
	@Input() shareHoldingDissolvedCount: number = 0;
	@Input() emailsForSingleCompanyDomain: Array<any>;
	@Input() creditLimitForEmailSpotter: any;
	@Input() confirmEmailsDialogBox: any;
	@Input() companyNumberForContactInfo: string;
	@Input() companyNameForContactInfo: string;
    @Input() serverSidePaginator: boolean = false;
	@Input() pageName: string;
	@Input() watchListLimitInfo: any;
	@Input() actionCols: any;
	@Input() limitsDetailsForEmailsColumns: any;
	@Input() limitsDetailsEmailsData: any;
	@Input() limitsDetailsForEmailsVerifyCols: any;
	@Input() limitsDetailsForEmailsVerifyDatas: any;
	@Input() verifyEmailCreditLimit: any;
	@Input() msgs: any;
	@Input() resetDisplayModelTable: any;
	@Input() compName: string = '';

	toAddNewEmailsCount: Array<any> = [
		{ label: '10', value: 10 },
		{ label: '20', value: 20 },
		{ label: '30', value: 30 },
		{ label: '40', value: 40 },
		{ label: '50', value: 50 },
		{ label: '60', value: 60 },
		{ label: '70', value: 70 },
		{ label: '80', value: 80 },
		{ label: '90', value: 90 },
		{ label: '100', value: 100 },
	];

	@Output() cbilDataSetting = new EventEmitter<any>();
	@Output() cbilsData = new EventEmitter<any>();
	@Output() deleteCustomerWatchData = new EventEmitter<any>();
	@Output() deleteExportListData = new EventEmitter<any>();
	@Output() updateCompanyContactData = new EventEmitter<any>();
	@Output() updateDirectorContactData = new EventEmitter<any>();
	@Output() rejectCompanyContactData = new EventEmitter<any>();
	@Output() rejectDirectorContactData = new EventEmitter<any>();
	@Output() updateTableDataList = new EventEmitter<any>();
	@Output() messageCommunicator = new EventEmitter<any>();
	@Output() directorDataInfo = new EventEmitter<any>();
	@Output() updateIndustryTagData = new EventEmitter<any>();
	@Output() rejectIndustryTagData = new EventEmitter<any>();
	@Output() deleteReportListData = new EventEmitter<any>();
	@Output() updateTableForPsc = new EventEmitter<any>();
	@Output() updateContactInfoData = new EventEmitter<any>();
	@Output() rejectContactInfoData = new EventEmitter<any>();
	@Output() showModalDialogForContact = new EventEmitter<any>();
	@Output() getNoticeIndentifierData = new EventEmitter<any>();
	@Output() deleteEPCCertificate = new EventEmitter<any>();
	@Output() updateNotesList = new EventEmitter<any>();
	@Output() searchChangeNotification = new EventEmitter<any>();
	@Output() removeFromWatchList = new EventEmitter<any>();
	@Output() removeFromWatchListPlus = new EventEmitter<any>();
	@Output() removeDirectorFromMonitor = new EventEmitter<any>();
	@Output() updateActionField = new EventEmitter<any>();
	@Output() updatedFieldsforBulkTag = new EventEmitter<any>();
	@Output() goToContractFinder = new EventEmitter<any>();

	isLoggedIn: boolean = false;
	userDetails: Partial< UserInfoType > = {};

	subscribedPlanModal: any = subscribedPlan;
	savedListName: any
	displayModal: boolean;
	hide: boolean = true;
	hide2: boolean = true;
	addPlanOrNot: boolean = true;
	fieldValidate: boolean = false;
	planNotSelected: boolean = false;
	dateFieldValidate: boolean = false;
	featureFieldValidate: boolean = false;
	showListButton: boolean = false;
	showCompanySideDetails: boolean = false;
	showAddNoteModalBool: boolean = false;
	pepAndSanctionsDialog: boolean = false;
	ConfirmPaswrd: boolean = true;
	no_show_user_management: boolean = true;
	exportCondition: boolean = false;
	showPepAndSanctionDialog: boolean = false;
	showBuyCreditPepSanctionDialog: boolean = false;
	userUpdateDialogBoolean: boolean = false;
	relatedCompaniesStatusBoolean: boolean = true;
	relatedDirectorsStatusBoolean: boolean = true;
	// listDataValuesBoolean: boolean = true;
	titileRegisterDialog: boolean = false;
	specialFilterAddOn: boolean = false;
	tempspecialFilterAddOn: boolean;
	tempvaluationFilterAddOn: boolean;
	valuationFilterAddOn: boolean = false;
	display: boolean = false;
	riskFilterAddOn: boolean = false;
	tempRiskFilterAddOn: boolean = false;
	emailFilterAddOn: boolean = false;
	tempEmailFilterAddOn: boolean = false;
	ethnicityFilterAddOn: boolean = false;
	tempEthnicityFilterAddOn: boolean = false;
	crmExportAddOn: boolean = false;
	ablFilterAddOn: boolean = false;
	tempCrmExportAddOn: boolean = false;
	tempAblFilterAddOn: boolean = false;
	planChangeSection: boolean = false;
	customEmailOrNotdialog: boolean = false;
	emailVerifyDialogBox: boolean = false;
	shareListDialog: boolean = false;
	emailExportDetailsModal: boolean = false;
	customEmailId: string = undefined;
	customEmail: boolean = false;
	hidePaswrd: boolean = true;
	emailValidateBool: boolean = false;
	planSelected: boolean = false;
	passwordMatch: boolean = false;
	showLoginDialog: boolean = false;
	userTypeCompany: boolean = false;
	hasAvailableCredit: boolean = false;
	disableData: boolean = true;
	// showLoader: boolean = false;
	expandData: boolean = true;
	acceptTermsCondition: any;
	showContactNumbMsg: boolean = false;
	show_refred_by_text: boolean = false;
	show_other_text: boolean = false;
	userTypeIndividual: boolean = false;
	createNewUserDialog: boolean = false;
	createNewPlanDialog: boolean = false;
	pepAndSanctionDialog: boolean = false;
	showUpgradePlanDialog: boolean = false;
	shareSavedFilterUrlPage: boolean = false;
	hideSubmitButton: boolean = false;
	industryAnalysisAddOn: boolean = false;
	viewShareholdingsModal: boolean = false;
	tempIndustryAnalysisAddOn: boolean = false;
	showDeleteFromListButton: boolean = false;
	pepAndSanctionHistoryView: boolean = false;
	showPepSanctionDialog: boolean = false;
	showInputFieldMessage: boolean = false;
	headersArray: Array<string> = ['regno', 'companyname', 'personfirstname', 'personlastname', 'email', 'phone', 'reference', 'description'];
	downloadEmalList: boolean = false
	inputEmailModalBoolean: boolean;
	showOrHideContactInfoModal: boolean = false;
	currentGrade: boolean = false;
	potentialGrade: boolean = false;
	// verifyEmailCreditLimit: boolean = true;

	ccjDatePickValue: Date;
	userLoginTimeValue: Date;
	ccjPaidDatePickValue: Date;
	discriptionDateValue: Date;
	statusFiledDateValue: Date;
	registeredDateValue: Date;
	projectStartDateValue: Date;
	projectEndDateValue: Date;
	creditorsDateValue: Date;
	create_dateDateValue: Date;
	notesUpdatedDateValue: Date;
	acquiredDatePickValue: Date;
	safeAlertDatePickValue: Date;
	chargesCreatedDateValue: Date;
	deletedDirectorsDateValue: Date;
	directorResignedDateValue: Date;
	chargesDeliveredDateValue: Date;
	directorAppointedDateValue: Date;
	chargesRegisteredDateValue: Date;
	patentAndTradeDatePickValue: Date;
	pscDateOfBirthDatePickValue: Date;
	saveSearchesCreatedDateValue: Date;
	updatedDateValue: Date;
	exportListCreatedOnDateValue: Date;
	reportListCreatedOnDateValue: Date;
	changeDateValue: Date;
	issuedDateValue: Date;
	exemptionRegistrationDateValue: Date;
	awardedDateDateValue: Date;
	closingDateValue: Date;
	contractStartDateValue: Date;
	contractEndDateValue: Date;
	publishedDateValue: Date;
	userSavedListCreatedDateValue: Date;
	contactListCreatedDateValue: Date;
	contactListUpdatedDateValue: Date;
	userSavedListUpdatedDateValue: Date;
	userExportListCreatedDateValue: Date;
	directorDateOfBirthDateValue: Date;
	subscriptionDataStartDateValue: Date;
	subscriptionDataEndDateValue: Date;
	createNewPlansEndDatePickValue: Date;
	createNewPlansStartDatePickValue: Date;
	companyRegistrationDatePickValue: Date;
	companyCommentaryDateLoggedValue: Date;
	creditScoreRatingChangeDateValue: Date;
	corporateLandDateProperietorPickValue: Date;
	relatedDirectorsResignedDatePickValue: Date;
	relatedCompaniesAppointedDatePickValue: Date;
	relatedDirectorsAppointmentDatePickValue: Date;
	relatedCompaniesIncorporationDatePickValue: Date;
	pscNotifiedDateValue: Date;
	pscNotifiedDateValues: Date;
	routePageName: string;
	obj: any = [];
	message = [];
	msgs1 = [];
	msgs_1 = [];
	msgs_2 = [];
	msgForDI =[];
	data = [];
	allPlans: [];
	daterange: Date[];
	arr: Array<any> = [];
	referredValues: any[];
	filteredDirectorArray: any[];
	filteredPostalCodeArray: any[];
	selectedCompany: Array<any> = [];
	subscriptionPlanNameOpts: Array<any> = [];
	subscriptionPlanTypeOpts: Array<any> = [];
	subscriptionNewPlanTypeOpts: Array<any> = [];
	tableDataValues: Array<any> = [];
	pepSanctionsTableCols: Array<any> = [];
	corporateLandTitleNoHistoryDataColumn: Array<any> = [];
	exportListData: Array<any>;
	emailexportData: Array<any>;
	directorListOfficerRole: Array<any> = [
		{ label: 'Director', value: 'director' },
		{ label: 'Company Secretary', value: 'company secretary' },
		{ label: 'Llp Designated Member', value: 'llp designated member' }
	];
	directorOccupationData: Array<any> = [];
	CountryOfIncorporationData: Array<any> = [];
	directorStatusData: Array<any> = [
		{ label: 'Active', value: 'active' },
		{ label: 'Inactive', value: 'inactive' },
		{ label: 'Resigned', value: 'resigned' }
	];
	
	fetchEmailDataArray = [		
		{ field: 'label' },
		{ field: 'value' },
	];

	tableData = [
		{ label: 'Safe to send', value: 'Deliverable'},
		{ label: 'Risky', value: 'Role/Person based Email address'},
		{ label: 'Invalid', value: 'Not Reachable'},
		{ label: 'Not Specified', value: 'Either bounced or not reachable'}
	];
	
	emailColumn = [
		{ field: 'name', header: 'Name', width: '100px', textAlign: 'left' },
		{ field: 'email', header: 'Email', width: '200px', textAlign: 'left' },
		// { field: 'emailStatus', header: 'Email Status', width: '80px', textAlign: 'center' },
	];
	emailFetchColumn = [
		{ field: 'name', header: 'Name', width: '200px', textAlign: 'left' },
		{ field: 'email', header: 'Email', width: '250px', textAlign: 'left' },
		// { field: 'position', header: 'Position', width: 'none', textAlign: 'left' },
		// { field: 'updatedDate', header: 'Last Update Date', width: '140px', textAlign: 'center' },
		// { field: 'emailStatus', header: 'Email Status', width: '80px', textAlign: 'center' },
	];

	// shareHoldingCompanyStatusOptions: Array<any> = [
	// 	{ label: 'Live', value: 'live' },
	// 	{ label: 'Dissolved', value: 'dissolved' }
	// ];
	relatedDirectorsStatus: Array<any> = [];
	resignedStatusOption: Array<any> = [];
	mailVerifiedOptions: Array<any> = [];
	emailSubscriptionOptions: Array<any> = [];
	paymentModeOptions: Array<any> = [];
	paidUserOptions: Array<any> = [];
	statusCodeDescDropdownOptions: Array<any> = [];
	pscListCountryOfResidence: Array<any> = [];
	relatedCompaniesCategoryRole: Array<any> = [];
	shareholdersCurrency: Array<any> = [];
	companyStatusData: Array<any> = [
		{ label: 'Live', value: 'live' },
		{ label: 'Dissolved', value: 'dissolved' },
		{ label: 'In Liquidation', value: 'in liquidation' },
	];
	pepAndSanctionData: Array<any> = [];
	pepAndSanctionDataHistory: Array<any> = [];
	pepAndSanctionAcceptedData: Array<any> = [];
	countryOption: Array<any> = [];
	nationalityOption: Array<any> = [];
	psc_statement_statusOption: Array<any> = [];
	directorListStatus: Array<any> = [];
	ccjStatus: Array<any> = [];
	ctpsValue: Array<any> = [];
	tempArrCorporateLandChangeIndicatorValue: Array<any> = [
		{ label: "Deleted", value: 'd' },
		{ label: "Added", value: 'a' }
	];
	corporateLandChangeIndicatorValue: Array<any> = [];
	categoryData: Array<any> = [];
	customerWatchOptions: Array<any> = [];
	relatedCompaniesStatusRole: Array<any> = [];
	relatedDirectorsRole: Array<any> = [];
	shareHolderStatusOptions: Array<any> = [];
	shareHoldingCompanyStatusOptions: Array<any> = [];
	companyForAddList: Array<any> = [];
	filteredCompanyNameArray: any[];
	filteredDirectorDisplayArray: any[];
	createdDateArray: Array<any> = [];
	allActiveFeatures: any = [];
	plansArray: any[] = [];
	selectedPlan: any;
	planNamesArray: Array<any> = [
		{ label: "Expand", value: 'Expand' },
		{ label: "Enterprise", value: 'Enterprise' }
	];
	pdfReportListData: Array<any>;
	AcceptedDateArray: Array<any> = []
	historyDataArray: Array<any> = [];
	selectedData: Array<any> = [];
	tableDataColsField: Array<any> = [];
	addedFeatureToCurrentPlan: any = [];
	shareholderNShareholdingDetailsSummaryColumns: Array<any>;
	shareholderNShareholdingDetailsSummaryData: Array<any>;
	creditorsInfoData: Array<any>;
	titleNoHistoryData: Array<any> = [];
	tempArray: Array<any> = [];
	addedImportantEmailsValue: Array<any>;
	inputDataForimportantEmailsList: Array<any>;
	creditorsInfoDataColumn: { field: string; header: string; width: string; textAlign: string; }[];
	creditorsTotalAmount: number;
	importantEmailsModal: boolean = false;	
	emailData: any[];


	directorEmailCompanyDirectorsData: any;
	sortBy: any;
	cListId: any;
	companiesInList: any;
	minYear: any;
	category: any;
	notesData: any;
	newTableObj: any;
	directorPnr: any;
	timeout: any = null;
	JSON: any = JSON;
	savedFilterURL: any;
	directorPnrNum: any;
	directorUserId: any;
	item_being_drag: any;
	tableScrollHeight: any;
	notesId: any = undefined;
	subscriptionEndDate: any;
	creditpepSanctionsPlan: any;
	tempsubscriptionEndDate: any;
	selectedSubscriptionPlan: any;
	completePepAndSanction_Id: any;
	tempUserManagementRowData1: any;
	selectedPepSanctionPlanDetails: any;
	tempListDataValues: any[];
	emailSpotterLimit: any;
	emailAddress: any;
	userDetailData: any;
	subscription_id: any;
	subscription_endDate: any;
	toAddNewEmailsCountModel: any;
	limit: any;
	limitsDetailsForEmailsData: any;
	limitsDetailsForEmailsVerifyData: any;
	limitsDetailsForEmailsCols: any;
	fetchEmailDataValue: any;
	fetchEmailCols: any;
	totalDomainCount: any;
	totalLimitToReduce: any;
	returnType: any = null;
	requestLimit: any;
	limitDeduct: any;
	personNameModel: any;
	emailModel: any;
	positionModel: any;
	quickInfoData: any;
	directorNewInfoData: any;
	importantFetchEmailsModal: boolean = false;


	selectedSearchesName: string;
	filterId: string;
	selectedSaveListName: string;
	listId: string;
	listName: string;
	listPageName: string;
	saveSearchListPageName: string;

	rows: number = 25;
	tabActiveIndex: number = 0;
	hasTitleRegisterLimit: number;
	first: number = 0;
	emailPattern = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$";
	pepAndSanctionCreditAvailable: number;
	count: number = 0;
	creditLimitForVerify: number = 0;

	todayDate = new Date();
	maxYear = this.todayDate.getFullYear() + 50;
	
	selectedGlobalCountry: string = 'uk';

	tempUserManagementRowData: Object = {};
	filterData = {
		_id: "",
		filterName: "",
		userID: ""
	}

	UpdateCompanyList = {
		listName: "",
		_id: "",
		userID: "",
		filterName: "",
		pageNameForUpdate: ""
	};

	postalCodeField: { key: any };
	checkSanctionFormValues: any = {
		firstName: undefined,
		middleName: undefined,
		lastName: undefined,
		dateOfBirth: undefined,
		profileName: undefined,
		street: undefined,
		city: undefined,
		countryCode: undefined,
		phoneNumber: undefined,
		postalCode: undefined
	};

	previousAddress1: any = {
		buildingName: undefined,
		buildingNum: undefined,
		organisation: undefined,
		street: undefined,
		city: undefined,
		postCode: undefined,
		countryCode: undefined
	};

	previousAddress2: any = {
		buildingName: undefined,
		buildingNum: undefined,
		organisation: undefined,
		street: undefined,
		city: undefined,
		postCode: undefined,
		countryCode: undefined
	};

	previousAddress3: any = {
		buildingName: undefined,
		buildingNum: undefined,
		organisation: undefined,
		street: undefined,
		city: undefined,
		postCode: undefined,
		countryCode: undefined
	};

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
	}

	dialogBoolean: Object = {

		viewHnwiShareholdingsModal: false,
		viewImpactedCreditorsModal: false,
		salePurchasePropertyDialog: false,
		viewShareholdingsModal: false

	};

	companyName: string;

	companySideDetailsParams: any = { companyNumber: undefined, companyName: undefined };
	overviewName = "companyOverview";

	companyNoteValue: string = '';
	directorListStatusModel: string[];
	directorListOfficerRoleModel: string[];
	directorOccupationDataModel: string[];
	CountryOfIncorporationDataModel: string[];
	pscListCountryOfResidenceModel: string[];
	tempProjectNumber: string;
	shareHoldingCompanyStatusModel: string[];
	relatedDirectorsStatusModel: string[];
	shareHolderStatusModel: string[];
	companyNum: string;
	resignedStatusModel: string[];
	mailVerifiedModel: string[];
	emailSubscriptionModel: string[];
	paymentOptionsModel: string[];
	directorGenderVal: string;
	subscriptionPlanTypeModel: string[];
	subscriptionNewPlanTypeModel: string[];
	paidUserOptionsModel: string[];
	statusCodeDescDropdownModel: string[];
	titleRegisterHit: string = undefined;
	subscriptionPlanNameModel: string[];
	CompanyStatusModel: string[];
	directorStatusModel: string[];
	signUpType: string = "";
	isAblScreen: string = 'true';
	paymentModeOffline: string = 'false';
	selectedCars1: string[];
	planId: string = subscribedPlan['Start'];
	ccjStatusModel: string[];
	pageModel:  string[];
	page: Array<DropdownOptionsType> = RequiredConstant.savedListPageOptions;
	pageIreland: Array<DropdownOptionsType> = RequiredConstant.savedListPageOptionsforIrEland;
	connectPlusListDropdown: Array<DropdownOptionsType> = RequiredConstant.connectPlusListOptions;
	filteredDropdownForUsers: any;
	ctpsModel: string[];
	categoryModel: string[];
	customerWatchModel: string[];
	corporateLandChangeIndicatorModel: string[];
	relatedCompaniesStatusModel: string[];
	relatedDirectorsRoleModel: string[];
	shareholdersCurrencyModel: string[];
	selectedPlanName: string = "";
	address: string = undefined;
	countryModel: string[];
	nationalityModel: string[];
	psc_statement_statusModel: string[];
	relatedCompaniesCategoryModel: string[];
	exportListDynamicName: string = "DG_Export_Report_" + new Date().getTime();
	tempField: string;
	noticeIdentifierNo: any;
	noticeIndentifierSummaryData: any;
	payloadForContractMonitoring: object = {
		"buyer_name": "",
		"title": "",
		"published_date": "",
		"notice_identifier": "",
		"monitoringStatus": "",
		"contractAmount": "",
		"contractStatus": "",
		"contractLatestUpdate": "",
	};
	viewNoticeIndentifierModal: boolean = false;
	contractFinderSuppliersDataValues: Array<any>;


	dateTimelineView: any[];


	corporateSideOverviewData: object;

	innovationGrantDropdownModel = { sector: [], projectStatus: [], innovateUKProductType: [], isLeadParticipant: [], participantWithdrawnFromProject: [], enterpriseSize: [], inMultipleLEPs: [], industrialStrategyChallengeFund: [] };
	userManagementRowData: any = { username: undefined, email: undefined, postCode: undefined, landLimit: undefined, postalCode: undefined, companyReport: undefined, directorReportLimit: undefined, creditReportLimit: undefined, titleRegisterHitLimit: undefined, contactInformationLimit: undefined, advancedLimit: undefined, corpLandLimit: undefined, companyMonitorLimit: undefined, directorMonitorLimit: undefined, api_hits: undefined, pepAndSanctionHitLimit: undefined, paidUser: undefined, subs_endDate: undefined };
	innovationGrantDropdownOptions = { sector: [], projectStatus: [], innovateUKProductType: [], isLeadParticipant: [], participantWithdrawnFromProject: [], enterpriseSize: [], inMultipleLEPs: [], industrialStrategyChallengeFund: [] };
	pscDropdownModel = { stat: [], countryOfResidence: [] };
	pscDropdownOptions = { stat: [], countryOfResidence: [] };

	defaultPlans: any = [
		{ name: 'Start', value: subscribedPlan['Start'] },
		{ name: 'Expand Weekly', value: subscribedPlan["Expand_Weekly_Trial"] },
		{ name: 'Expand Monthly', value: subscribedPlan["Monthly_Expand_Trial"] },
		{ name: 'Expand Annually', value: subscribedPlan["Annually_Expand_Trial"] },
		{ name: 'Enterprise Weekly', value: subscribedPlan["Enterprise_Weekly_Trial"] },
		{ name: 'Enterprise Monthly', value: subscribedPlan["Monthly_Enterprise_Trial"] },
		{ name: 'Enterprise Annually', value: subscribedPlan["Annually_Enterprise_Trial"] }
	];

	planTypeOption: Array<any> = [
		{ label: 'Free', value: 'Free' },
		{ label: 'Paid Weekly', value: 'Paid_Weekly' },
		{ label: 'Paid Monthly', value: 'Paid_Monthly' },
		{ label: 'Paid Annually', value: 'Paid_Annually' },
		{ label: 'Trial Weekly', value: 'Trial_Weekly' },
		{ label: 'Trial Monthly', value: 'Trial_Monthly' },
		{ label: 'Trial Annually', value: 'Trial_Annually' }
	];

	directorGenderArray: Array<any> = [
		{ label: "Male", value: 'Male' },
		{ label: "Female", value: 'Female' }
	];

	// limitsDetailsForEmailsVerifyCols = [
	// 	{ field: 'totalCompaniesCount', header: 'Total Companies', width: '80px', textAlign: 'center' },
	// 	{ field: 'totalEmailsCount', header: 'Total Email Count', width: '80px', textAlign: 'center' },
	// 	{ field: 'totalEmailsCreditCount', header: 'Total Email Credit Available', width: '80px', textAlign: 'center' },
	// 	{ field: 'maximumTotalReduceLimitCount', header: 'Total Reduce Limit', width: '80px', textAlign: 'center' },
	// ]

	queryString = window.location.search;

	createNewPlan: any = {
		name: undefined,
		features: [],
		description: undefined,
		status: undefined,
		createdBy: undefined,
		endDate: undefined,
		startDate: undefined,
		cost: undefined,
		vat: undefined,
		duration: undefined,
		_id: undefined,
		order: undefined,
		hits: undefined,
		priceperhit: undefined,
		show: false,
		companyReport: undefined,
		basicLimit: undefined,
		advancedLimit: undefined,
		landLimit: undefined,
		corpLandLimit: undefined,
		companyMonitorLimit: undefined,
		directorMonitorLimit: undefined,
		directorReportLimit: undefined,
		planType: undefined
	};
	totalEmailFetchedCount: any;

    hnwiShareholdingDetailsSummaryData: Array<any>;
    hnwiShareholdingDetailsSummaryColumns: Array<any>;
	constantMessages: any = UserInteractionMessages;
	appliedFiltersForSavedList: any[];
	items: MenuItem[];
	newSafeAlert = safeAlertObj;
	newSafeAlertColumn = safeAlertColumns;
	selectedGlobalCurrency: string = 'GBP';
	workflowBusinessMonitorStatsButtonBool: boolean = false;

	constructor(
		private router: Router,
		private searchFiltersService: SearchFiltersService,
		private confirmationService: ConfirmationService,
		private titlecasePipe: TitleCasePipe,
		private datePipe: DatePipe,
		public commonService: CommonServiceService,
		private activeRoute: ActivatedRoute,
		private userManagementService: UserManagementService,
		private userAuthService: UserAuthService,
		private decimalPipe: DecimalPipe,
		private changeDetection: ChangeDetectorRef,
		private sharedLoaderService: SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService
	) { }

	ngOnChanges(changes: SimpleChanges) {
		
		if ( ['fiscalHoldings', 'businessCollaborators', 'procurementPartners', 'potentialLeads'].includes( this.activeRoute.queryParams?.['_value'].listPageName ) ) this.workflowBusinessMonitorStatsButtonBool = true;

		if ( changes.listDataValues ) {
			this.listDataValues = changes?.listDataValues?.currentValue;
		}
		
		if (changes.emailsForSingleCompanyDomain && Object.keys(changes.emailsForSingleCompanyDomain.currentValue).length) {

			this.inputDataForimportantEmailsList = changes.emailsForSingleCompanyDomain.currentValue;

		}

		if (changes.emailsListModalBoolean && Object.keys(changes.emailsListModalBoolean.currentValue)) {

			this.inputEmailModalBoolean = changes.emailsListModalBoolean.currentValue;

			if (this.inputEmailModalBoolean == true) {
				this.msgs = [];
				this.msgs.push({ severity: 'info', summary: 1 + this.constantMessages['limitDeductionMessage']['importantEmailsLimitDeductionMsg'] });

				setTimeout(() => {
					this.msgs = [];
				}, 3000);

			}

			if (this.inputEmailModalBoolean == false) {

				this.totalEmailFetchedCount = null;
				this.toAddNewEmailsCountModel = undefined;

			}

		}

		if (this.userListTable) {


			if (this.thisPage == "importantEmails" || this.thisPage == "personContactInfo") {
				this.tempListDataValues = this.listDataValues;

			} else {
				this.tempListDataValues = JSON.parse(JSON.stringify(this.listDataValues));
				this.directorEmailCompanyDirectorsData = this.listDataValues.map(val=> val.directorEmail)
			}

			if ( ![ 'exportListPage', 'userFilterListPage', 'companyListPage', 'creditPage', 'directorDetails','contactListPage', 'watchListPage', 'notesListPage','contractFinderList', 'connectPlusList', 'connectPlusSavedFilter', 'contractFinderSavedList' ].includes( this.thisPage ) ) {
				this.resetFilters( this.userListTable, "ngOnChanges" );
			}
		}

		if ( [ 'directorDetails', 'shareHolders', 'shareHolderDetails' ].includes(this.thisPage) || [ 'investorFinderPage', 'investeeFinderPage' ].includes( this.tableName )  ) {
			if (changes['listDataValues'] && changes['listDataValues']['currentValue']) {
				this.getFilterTableData();
			}
		}

		if( this.thisPage == 'directorsInfo') {
			this.tempListDataValues = JSON.parse(JSON.stringify(this.listDataValues));
		}

		if ( ( changes.thisPage &&  Object.keys(changes.thisPage.currentValue).length && changes.thisPage.currentValue == 'contactFinderSuppliersPage' ) || ( changes.thisPage &&  Object.keys(changes.thisPage.currentValue).length && changes.thisPage.currentValue == 'buyerPage') || ( changes.thisPage &&  Object.keys(changes.thisPage.currentValue).length && changes.thisPage.currentValue == 'isSupplierNonREGScreen') || ( changes.thisPage &&  Object.keys(changes.thisPage.currentValue).length && changes.thisPage.currentValue == 'isBuyerNonREGScreen') ) {
			this.tempListDataValues = changes.listDataValues.currentValue;
		}
		
		this.changeDetection.detectChanges();
		this.initialData = this.userListTable?.value && JSON.parse( JSON.stringify( this.userListTable?.value ) );
	}

	ngOnInit() {

		// this.filteredDropdownForUsers = this.page.filter(item => item.value !== "personLinkedIn" && item.value !== "companyLinkedIn");
		// this.page = this.userAuthService.hasRolePermission( ['Super Admin'] ) ? this.page : this.filteredDropdownForUsers;

		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( loggedIn => {
			this.isLoggedIn = loggedIn;

			if ( this.isLoggedIn ) {
				this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';
				this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';
				this.userDetails = this.userAuthService?.getUserInfo();
			}
		});
	
		if ( ['companyCommentary', 'tradingAddress', 'companyEventsData', 'charges', 'corporateLand', 'shareHolders', 'companyDocumentsPage', 'patentTradeData', 'CCJ', 'debtorsInfoPage', 'innovateGrant', 'aquisitionMergerPage', 'escDataPage', 'importExport', 'exportPageOnly', 'showSuppliersInNoticeIdentifier'].includes(this.thisPage) ) {

			if ( this.listDataValues ) 
			    this.tempListDataValues = JSON.parse(JSON.stringify(this.listDataValues));

		} else if ( ['notesListPage', 'creditorsInfoPage', 'directorsInfo', 'hnwiPage', 'personContactInfo', 'shareholdings', 'safeAlerts', 'investeeFinderPage'].includes(this.thisPage) || ['investeeFinderPage', 'investorFinderPage'].includes(this.tableName) || ( this.thisPage == "directorDetails" && [ 'possibleCompanyTable', 'shareholdingSummaryTable', 'possibleShareholdingSummaryTable', 'companiesSummaryTable' ].includes( this.tableName ) ) || this.viewShareholdingsModal ) {

			this.tempListDataValues = this.listDataValues;

		}
		// this.seoService.setPageTitle (this.title);
		// this.seoService.setDescription( this.description );
		// this.seoService.setkeywords( this.keywords );
		// this.seoService.setRobots (this.robots );

		if ( this.thisPage !== 'directorDetails' ) {
			setTimeout(() => {
				this.getFilterTableData();
			}, 1600);
		}

		if (this.thisPage === "watchListPage") {
			this.showCheckBox = false;
		}

		if (this.thisPage === "meetMePage") {
			this.showCheckBox = true;
		}

		if (this.thisPage === 'user-management') {
			// this.no_show_user_management = false;
			this.rows = 100;
		}
		if ( this.thisPage == 'hnwiPage' ) {
			this.rows = 25;
		}
		
		if ( this.thisPage === 'importantEmails' ) {
			this.rows = 10;
		}

		if ( this.thisPage == 'directorDetails' && this.tableName == 'companiesSummaryTable' ) {
			this.rows = 10;
		}

		// Table Scroll Height
		if (this.thisPage == 'meetMePage') {
			this.tableScrollHeight = '40vh'
		} else {
			this.tableScrollHeight = '65vh'
		}

		// Only for documents download
		if (this.activeRoute.snapshot.queryParams['compNum'] && this.thisPage == 'companyDocumentsPage') {
			const params = { ...this.activeRoute.snapshot.queryParams };

			this.downloadDocumentIntoNextPage(params.desc, params.metadata, params.compNum);

			// this.router.navigate([]);
		}

		if (this.activeRoute.snapshot.queryParams['cListId'] && this.thisPage == 'companyListOfIServiceCategoryPage') {
			this.showDeleteFromListButton = true;
			this.showListButton = false;
		} else {
			this.showDeleteFromListButton = false;
			this.showListButton = true;
		}

		this.pepSanctionsTableCols = [
			{ field: 'country', header: 'Country', width: '120px', textAlign: 'left' },
			{ field: 'dateListed', header: 'Listed Date', width: '150px', textAlign: 'center' },
			{ field: 'dateOfBirth', header: 'Date of Birth', width: '150px', textAlign: 'center' },
			{ field: 'entityId', header: 'Entity ID', width: '150px', textAlign: 'left' },
			{ field: 'entityType', header: 'Type', width: '150px', textAlign: 'left' },
			{ field: 'firstName', header: 'First Name', width: '150px', textAlign: '' },
			{ field: 'lastName', header: 'Last Name', width: '150px', textAlign: 'left' },
			{ field: 'fullName', header: 'Full Name', width: '150px', textAlign: 'left' },
			// { field: 'name', header: 'Name', width: '150px', textAlign: 'left' },
			{ field: 'id', header: 'ID', width: '150px', textAlign: 'left' },
			{ field: 'matchScore', header: 'Match Score', width: '150px', textAlign: 'right' },
			{ field: 'reasonListed', header: 'Listed Reason', width: '150px', textAlign: 'left' },
			{ field: 'comments', header: 'Comments', width: '300px', textAlign: 'left' },
		];

		document.body.addEventListener('mouseover', (event: any) => {
			if (!event.currentTarget.classList.contains('infoName')) {
				this.hideCompanyQuickInfoPopover();
			}
		});

		if(this.thisPage == 'exportPageOnly'){
			this.exportListDynamicName = "DG_Export_Only_Report_" + new Date().getTime();
		} else if ( this.thisPage == 'importExport') { 
			this.exportListDynamicName = "DG_Import_Only_Report_" + new Date().getTime();
		} else {
			this.exportListDynamicName = "DG_Export_Report_" + new Date().getTime();
		}

		//Static Payload For Stats Page - BusinessMonitor && BusinessMonitorPlus 
		this.appliedFiltersForSavedList = [
			{
				"chip_group": "Status",
				"chip_values": [ "live" ]	
			}
		];
		
	}
	
	ngDoCheck() {
		if ((this.listDataValues ) || (this.notesListDataValues )) {
			this.tableDataValues = this.listDataValues;
			
			if ( this.tableDataValues !== null || this.tableDataValues !== undefined || this.tableDataValues.length !== 0 ) {
				this.disableData = false;
			}
		}
		
	}

	ngAfterViewInit() {

		if (this.thisPage == "notesListPage" || this.thisPage == 'hnwiPage') {
			setTimeout(() => {
				this.userListTable.reset();
			}, 1000);
		}

		if ( [ this.subscribedPlanModal['Start'], this.subscribedPlanModal['Valentine_Special'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Premium_Trial_48_Hours'] ].includes( this.userDetails?.planId ) && this.listDataValues && this.listDataValues.length > 24 ) {

			setTimeout(() => {
				this.listDataValues.length = 25;
			}, 500);

		}

		this.changeDetection.detectChanges();
		
		this.initialData = this.userListTable?.value && JSON.parse( JSON.stringify( this.userListTable?.value ) );

	}

	checkSubscriptionAuth(conditionCheck, route, data) {
		if (data !== undefined) {
			sessionStorage.setItem("relationData", JSON.stringify(data));
		}

		if ( this.isLoggedIn ) {

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

		} else {
			event.preventDefault();
			event.stopPropagation();
			this.showLoginDialog = true;
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

	resetFilters( tableData, from? ) {

		if (this.viewShareholdingsModal == true) {

			tableData.value = this.shareholderNShareholdingDetailsSummaryData;
			let tableDomElement = tableData.el.nativeElement.children[0],
				sortIcons = tableDomElement.querySelectorAll('.p-datatable-wrapper .p-sortable-column-icon')
			for (let icon of sortIcons) {
				icon.classList.value = 'p-sortable-column-icon pi pi-fw pi-sort-alt';
			}

		} if (this.dialogBoolean['viewHnwiShareholdingsModal'] == true) {

			tableData.value = this.hnwiShareholdingDetailsSummaryData;
			let tableDomElement = tableData.el.nativeElement.children[0],
				sortIcons = tableDomElement.querySelectorAll('.p-datatable-wrapper .p-sortable-column-icon')
			for (let icon of sortIcons) {
				icon.classList.value = 'p-sortable-column-icon pi pi-fw pi-sort-alt';
			}

		} else if (this.dialogBoolean['viewImpactedCreditorsModal'] == true) {

			tableData.value = this.creditorsInfoData;
			let tableDomElement = tableData.el.nativeElement.children[0],
				sortIcons = tableDomElement.querySelectorAll('.p-datatable-wrapper .p-sortable-column-icon')
			for (let icon of sortIcons) {
				icon.classList.value = 'p-sortable-column-icon pi pi-fw pi-sort-alt';
			}

		} else if (this.dialogBoolean['salePurchasePropertyDialog'] == true) {

			tableData.value = this.titleNoHistoryData;
			let tableDomElement = tableData.el.nativeElement.children[0],
				sortIcons = tableDomElement.querySelectorAll('.p-datatable-wrapper .p-sortable-column-icon')
			for (let icon of sortIcons) {
				icon.classList.value = 'p-sortable-column-icon pi pi-fw pi-sort-alt';
			}

		} else if (this.inputEmailModalBoolean == true) {

			if (!this.toAddNewEmailsCountModel) {

				tableData.value = this.listDataValues;
				let tableDomElement = tableData.el.nativeElement.children[0],
					sortIcons = tableDomElement.querySelectorAll('.p-datatable-wrapper .p-sortable-column-icon')
				for (let icon of sortIcons) {
					icon.classList.value = 'p-sortable-column-icon pi pi-fw pi-sort-alt';
				}

			} else {

				tableData.value = this.addedImportantEmailsValue;
				let tableDomElement = tableData.el.nativeElement.children[0],
					sortIcons = tableDomElement.querySelectorAll('.p-datatable-wrapper .p-sortable-column-icon')
				for (let icon of sortIcons) {
					icon.classList.value = 'p-sortable-column-icon pi pi-fw pi-sort-alt';
				}

			}


		} else if ( this.thisPage == 'notesListPage') {
			this.rows = 25;
			this.updateNotesList.emit( true );

		} else if ( [ 'pscData', 'pscStatementControlPersonDetails', 'pscSuperSecurePersonDetails' ].includes( this.thisPage ) ) {
			this.updateTableForPsc.emit({ requestFor: 'pscDataForTable' });
		} else if ( this.thisPage == 'watchListPage' && [ 'businessMonitorPlus', 'businessMonitor', 'directorWatch' ].includes( this.pageName ) ) {
			this.updateTableDataList.emit({ requestFor: 'resetTable', pageName: this.pageName });
		} else if ( this.thisPage == 'contractFinderList' || this.thisPage == 'connectPlusList' ) {
			this.updateTableDataList.emit(event);
		} else {
			if ( this.thisPage !== 'directors' && this.subscribedPlanModal['Valentine_Special'] !== this.userDetails?.planId ) {
				this.userListTable.value = this.tempListDataValues;
			}
			// if ( this.thisPage !== 'directorsInfo' && this.subscribedPlanModal['Valentine_Special'] !== this.userDetails?.planId ) {
			// 	this.userListTable.value = this.directorNewInfoData;
			// }
		}

		tableData.filters = {};
		tableData.clear();
		tableData.reset();

		this.first = 0;
		this.rows = 25;

		this.showInputFieldMessage = false;

		// Date Pickers and Models
		this.notesUpdatedDateValue = null;
		this.userSavedListCreatedDateValue = null;
		this.contactListCreatedDateValue = null;
		this.contactListUpdatedDateValue = null;
		this.userSavedListUpdatedDateValue = null;
		this.userExportListCreatedDateValue = null;
		this.saveSearchesCreatedDateValue = null;
		this.updatedDateValue = null;
		this.subscriptionDataStartDateValue = null;
		this.subscriptionDataEndDateValue = null;
		this.userLoginTimeValue = null;
		this.directorResignedDateValue = null;
		this.directorAppointedDateValue = null;
		this.deletedDirectorsDateValue = null;
		this.chargesCreatedDateValue = null;
		this.chargesDeliveredDateValue = null;
		this.discriptionDateValue = null;
		this.ccjPaidDatePickValue = null;
		this.patentAndTradeDatePickValue = null;
		this.pscDateOfBirthDatePickValue = null;
		this.ccjDatePickValue = null;
		this.corporateLandDateProperietorPickValue = null;
		this.companyCommentaryDateLoggedValue = null;
		this.relatedDirectorsAppointmentDatePickValue = null;
		this.relatedDirectorsResignedDatePickValue = null;
		this.safeAlertDatePickValue = null;
		this.acquiredDatePickValue = null;
		this.chargesRegisteredDateValue = null;
		this.companyRegistrationDatePickValue = null;
		this.createNewPlansEndDatePickValue = null;
		this.createNewPlansStartDatePickValue = null;
		this.relatedCompaniesAppointedDatePickValue = null;
		this.relatedCompaniesIncorporationDatePickValue = null;
		this.creditScoreRatingChangeDateValue = null;
		this.exportListCreatedOnDateValue = null;
		this.statusFiledDateValue = null;
		this.registeredDateValue = null;
		this.projectStartDateValue = null;
		this.projectEndDateValue = null;
		this.creditorsDateValue = null;
		this.create_dateDateValue = null;
		this.reportListCreatedOnDateValue = null;
		this.changeDateValue = null;
		this.issuedDateValue = null;
		this.exemptionRegistrationDateValue = null;
		this.awardedDateDateValue = null;
		this.closingDateValue = null;
		this.contractStartDateValue = null;
		this.contractEndDateValue = null;
		this.publishedDateValue = null;
		this.pscNotifiedDateValue = null;
		this.pscNotifiedDateValues = null;

		// Text Fields and Dropdown Models
		this.directorListOfficerRoleModel = [];
		this.directorOccupationDataModel = [];
		this.CountryOfIncorporationDataModel = [];
		this.CompanyStatusModel = [];
		this.directorStatusModel = [];
		this.directorListStatusModel = [];
		this.countryModel = [];
		this.nationalityModel = [];
		this.psc_statement_statusModel = [];
		this.ccjStatusModel = [];
		this.ctpsModel = [];
		this.categoryModel = [];
		this.customerWatchModel = [];
		this.shareHolderStatusModel = [];
		this.shareholdersCurrencyModel = [];
		this.pscListCountryOfResidenceModel = [];
		this.shareHoldingCompanyStatusModel = [];
		this.relatedCompaniesStatusModel = [];
		this.relatedCompaniesCategoryModel = [];
		this.relatedDirectorsRoleModel = [];
		this.relatedDirectorsStatusModel = [];
		this.subscriptionPlanNameModel = [];
		this.subscriptionPlanTypeModel = [];
		this.subscriptionNewPlanTypeModel = [];
		this.resignedStatusModel = [];
		this.corporateLandChangeIndicatorModel = [];
		this.statusCodeDescDropdownModel = [];
		this.selectedCompany = [];

		this.toAddNewEmailsCountModel = undefined;

		for (let optFieldKey in this.innovationGrantDropdownModel) {
			this.innovationGrantDropdownModel[optFieldKey] = [];
		}

		for (let optFieldsKey in this.pscDropdownModel) {
			this.pscDropdownModel[optFieldsKey] = [];
		}

		// Reset Sort Icon on Meet me page
		let tableDomElement = this.userListTable.el.nativeElement.children[0],
			sortIcons = tableDomElement.querySelectorAll('.p-datatable-wrapper .p-sortable-column-icon'),
			filterSearchRowInputFields = tableDomElement.querySelectorAll('.p-datatable-wrapper .filterSearchRow input[type="text"]');

		for (let icon of sortIcons) {
			icon.classList.value = 'p-sortable-column-icon pi pi-fw pi-sort-alt';
		}

		for (let inputField of filterSearchRowInputFields) {
			inputField.value = "";
		}

		if ( [ 'exportListPage', 'userFilterListPage', 'companyListPage', 'creditPage','contactListPage', 'connectPlusList' ].includes( this.thisPage ) ) {
			if ( from != 'actionCase' ){
				this.pageModel =  [];
				this.savedListName = '';
			}
			this.pageChange( { page: 0, first: 0, rows: this.rows }, tableData );
		}

		if ( this.thisPage == 'directorDetails' && this.tableName == 'companiesSummaryTable' ) {
		this.rows = 10;
		this.pageChange( { page: 0, first: 0, rows: this.rows }, tableData );
		}

	}

	downloadLrmSamplePdf() {

		this.globalServiceCommnunicate.getDataFromJSON( 'samplePdf.json' ).subscribe( res => {

			const linkSource = 'data:application/pdf;base64,' + res.pdf;
			const downloadLink = document.createElement("a");
			const fileName = "DG_SampleTitleRegister.pdf";

			downloadLink.href = linkSource;
			downloadLink.download = fileName;
			downloadLink.click();

		});
	}

	validateSearchField(event, field): any {

		let tempSpecialChar = /[!@#$%^&*+-/()]/g;
		let tempAlphabetValue = /[^a-zA-Z\s]+/g;

		this.tempField = field;
		const charCode = (event.which) ? event.which : event.keyCode;
		const specialChar = event.key;

		if (['companiesInList', 'exportCount', 'years_without_month', 'ccjAmount', 'AMT', 'charge_number', 'numberOfSharesIssued', 'projectNumber', 'crn', 'grantOffered', 'totalCosts', 'CaseID', 'age', 'pages'].includes(this.tempField)) {
			if (((charCode > 31 && charCode != 43 && charCode != 45) && (charCode < 48 || charCode > 57)) || specialChar.match(tempSpecialChar)) {
				this.showInputFieldMessage = true;
				return false;
			}
			this.showInputFieldMessage = false;
			return true;
		} else if (['searchType', 'categoryForExportList', 'lastDownloadedReportType', 'directorName', 'sourceDirector', 'destinationDirector', 'county', 'region', 'month', 'court', 'plantiffForeName', 'plantiffSurName', 'plantiffName', 'commentaryText', 'classification', 'shareType', 'projectTitle', 'participantName', 'addressRegion',  'CaseStatus', 'Title', 'dName', 'jobTitle', 'description', 'enquiryContact1', 'enquiryContact2'].includes(this.tempField)) {
			if (specialChar.match(tempAlphabetValue) && charCode != 45 ) {
				this.showInputFieldMessage = true;
				return false;
			}
			this.showInputFieldMessage = false;
			return true;
		} else if (['companyNumber', 'company_number', 'postalCode', 'caseNumber', 'plantiffPostCode', 'secured_details', 'companyRegistrationNumber', 'postcode', 'publicDescription', 'acquiringCompanyRegistrationNumber', 'acquiredCompanyRegistrationNumber', 'considerationPart1', 'considerationPart2', 'freeFormatComment','addressLEP', 'persons_entitled', 'chargeCode'].includes(this.tempField)) {
			if (specialChar.match(tempSpecialChar)) {
				this.showInputFieldMessage = true;
				return false;
			}
			this.showInputFieldMessage = false;
			return true;
		} else if (['company_phone_number', 'director_phone_number', 'tradingTelephone', 'plantiffTelephone', 'competitionYear', 'phoneContact1', 'phoneContact2'].includes(this.tempField)) {
			if ((charCode > 31 && charCode != 43 && charCode != 45) && (charCode < 48 || charCode > 57)) {
				this.showInputFieldMessage = true;
				return false;
			}
			this.showInputFieldMessage = false;
			return true;
		} else if (['percentage_share', 'share_percent', 'value'].includes(this.tempField)) {
			if (!(specialChar.match(tempAlphabetValue))) {
				this.showInputFieldMessage = true;
				return false;
			}
			this.showInputFieldMessage = false;
			return true;
		} else if (['district', 'tradingAddress4'].includes(this.tempField)) {
			if (!((charCode > 31 && charCode != 43 && charCode != 45) && (charCode < 48 || charCode > 57))) {
				this.showInputFieldMessage = true;
				return false;
			}
			this.showInputFieldMessage = false;
			return true;
		}

	}

	applyFilter(event, tableData, field, matchMode, filterKey) {
		this.savedListName = event
		if ( this.isLoggedIn ) {

			this.newTableObj = tableData;

			if ( ( [ this.subscribedPlanModal['Monthly_Expand'], this.subscribedPlanModal['Expand_Annual_One_Year'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Expand_Annual_Two_Year'], this.subscribedPlanModal['Expand_New_Monthly'], this.subscribedPlanModal['Monthly_Expand_Paid_Test'], this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Expand'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Annually_Expand_Trial'], this.subscribedPlanModal['Monthly_Expand_Trial'], this.subscribedPlanModal['Expand_Weekly_Trial'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Compliance_Plan'] ].includes( this.userDetails?.planId ) && this.userDetails?.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {

				this.filterDatesInTable();

				// this.updateTableDataList.emit(
				// 	{
				// 		rows: 25,
				// 		page: 0,
				// 		first: 0,
				// 		pageName: event
				// 	}
				// )
				if(this.thisPage == 'companyListPage' && field == 'page'){
					this.pageChange( { page: 0, first: 0, rows: this.rows }, tableData );
				}

				if ( this.thisPage == 'connectPlusList' && field == 'page' ){
					this.pageChange( { page: 0, first: 0, rows: this.rows }, tableData );
				}
				
				if(tableData != undefined){

					if (filterKey !== undefined) {
						if (field === "companyStatusCustomerWatch" || field === "shareHoldingCompanyStatus" || field === "shareHolderAsCompanyStatus") {
							tableData.filter(event, "companyStatus", filterKey);
						} 
						else if( ['statusCodeDesc', 'directorStatus', 'category', 'companyStatus'].includes( field ) ) {
							let selectLabel = event.map(a => a.value)
							tableData.filter( selectLabel, field, filterKey );
						} 
						else {
							tableData.filter(event, field, filterKey);
						}
	
					} else {
						if (field === "dName") {
							if (this.thisPage == "relatedPersonInfo" || this.thisPage == "personContactInfo") {
								tableData.filter(event.target.value.toString(), "dName", matchMode);
							} else {
								tableData.filter(event.target.value.toString(), "dName.name", matchMode);
							}
						} else if (field === "shareHolderName") {
							tableData.filter(event.target.value.toString(), "shareHolderName.name", matchMode);
						} else if (field === "pscName") {
							tableData.filter(event.target.value.toString(), "pscName.name", matchMode);
						} else if (field == 'share_percent') {
							tableData.filter(event.target.value, "share_percent", matchMode);
						} else if (field == 'internationalScoreDesc') {
							tableData.filter(event.target.value, "companyInformation.internationalScoreDescription", matchMode);
						} else if (field == 'person_entitled') {
							for ( let val of tableData._value){
								if ( val.hasOwnProperty('companyInformation')){
									tableData.filter(event.target.value, "companyInformation.person_entitled", matchMode);
									break;
								} else {
									tableData.filter(event.target.value, field, matchMode);
									break;
								}
							}
						} else {
	
							if ( field == 'estimated_turnover' ){
								tableData._value.filter( val => val.estimated_turnover = Math.round(val.estimated_turnover) )
							}
							tableData.filter(event.target.value, field, matchMode);
						}
					}
				}
			} else {
				this.showUpgradePlanDialog = true;

				setTimeout(() => {

					this.resetFilters(tableData);

					if (event.inputType == 'insertText') {
						event.srcElement.value = '';
					}

				}, 100);
					
			}

			if (this.listDataValues.length == 0) {
				// this.listDataValuesBoolean = false;
				this.sharedLoaderService.hideLoader()
			}

		} else {

			setTimeout(() => {

				this.resetFilters(tableData);

				if (event.inputType == 'insertText') {
					event.srcElement.value = '';
				}

			}, 100);

			this.showLoginDialog = true;
		}

	}

	fetchTableData(tableData) {
		this.newTableObj = tableData;
		this.userListTable = this.newTableObj;
	}


	getFilterTableData() {
		let tempArrStatus = [],
			tempArrOfficerRole = [],
			tempArrDirectorOccupation = [],
			tempArrCountryOfIncorporation = [],
			tempArrDirectorStatus = [],
			tempArrCompanyStatus = [],
			tempArrshareHoldingCompanyStatus = [],
			tempArrNationality = [],
			tempArrCountry = [],
			tempArrCCJStatus = [],
			temArrshareHoldersCurrency = [],
			tempArrCategory = [],
			tempArrPlanName = [], tempArrCustomerWatchStatus = [], tempArrPlanType = [], tempArrNewPlanType = [],
			tempArrVerifiedOption = [], tempArrEmailSubscriptionOptions = [],
			tempArrPaymentOfflineOptions = [], tempPaidUserOptions = [], tempArrCtps = [], tempArrCorporateLandChangeIndicatorValue = [];

		let tempShareholderStatusForInvestee = [];
		this.shareHolderStatusOptions = [];
		let tempShareholderStatusForInvestor = [];
		this.shareHoldingCompanyStatusOptions = [];

		if (this.thisPage == 'directorsInfo' || this.thisPage == 'directorDetails') {

			setTimeout(() => {

				// this.filterDate();
				if ( this.listDataValues ) {
					
					this.listDataValues.forEach((value) => {
						tempArrStatus.push(value.status);
						tempArrOfficerRole.push(value.directorRole);
						tempArrDirectorOccupation.push(value.directorJobRole);
						tempArrDirectorStatus.push(value.directorStatus);
						tempArrCompanyStatus.push(value.CompanyStatus);
						tempArrNationality.push(value.nationality);
						tempArrCountry.push(value.country);
						tempArrshareHoldingCompanyStatus.push(value.shareHoldingCompanyStatus)
						temArrshareHoldersCurrency.push(value.currency)
					});
				}

				this.directorListStatus = [];
				// this.directorListOfficerRole = [];
				// this.companyStatusData = [];
				this.directorOccupationData = [];
				// this.directorStatusData= [];
				this.countryOption = [];
				this.nationalityOption = [];

				tempArrStatus.forEach((a, i) => {
					if (tempArrStatus.indexOf(a) === i && a != undefined && a != "" && a != null) {
						this.directorListStatus.push({ label: a == '' ? '-' : this.titlecasePipe.transform(a), value: a });
					}
				});

				// tempArrOfficerRole.forEach((a, i) => {
				// 	if (tempArrOfficerRole.indexOf(a) === i && a !== undefined && a !== "") {
				// 		this.directorListOfficerRole.push({ label: a == '' ? '-' : this.titlecasePipe.transform(a), value: a })
				// 	}
				// });

				tempArrDirectorOccupation.forEach((a, i) => {
					if (tempArrDirectorOccupation.indexOf(a) === i && a !== undefined && a !== "") {
						this.directorOccupationData.push({ label: a == '' ? '-' : this.titlecasePipe.transform(a), value: a })
					}
				});

				// tempArrDirectorStatus.forEach((a, i) => {
				// 	if (tempArrDirectorStatus.indexOf(a) === i && a !== undefined && a !== "") {
				// 		this.directorStatusData.push({ label: a == '' ? '-' : this.titlecasePipe.transform(a), value: a })
				// 	}
				// });

				// tempArrCompanyStatus.forEach((a, i) => {
				// 	if (tempArrCompanyStatus.indexOf(a) === i && a !== undefined && a !== "") {
				// 		this.companyStatusData.push({ label: a == '' ? '-' : this.titlecasePipe.transform(a), value: a })
				// 	}
				// });

				// tempArrshareHoldingCompanyStatus.forEach((a, i) => {
				//     if(tempArrshareHoldingCompanyStatus.indexOf(a) === i && a !== undefined && a!== "") {
				//         this.shareHoldingCompanyStatusOptions.push({ label: a == '' ? '-' : this.titlecasePipe.transform(a), value: a })
				//     }
				// });

				temArrshareHoldersCurrency.forEach((key, index) => {
					if (temArrshareHoldersCurrency.indexOf(key) === index) {
						if (key) {
							this.shareholdersCurrency.push({ label: key == '' ? '-' : key.toString().toUpperCase(), value: key });
						}
					}
				});

				tempArrCountry.forEach((a, i) => {
					if (tempArrCountry.indexOf(a) === i && a !== undefined && a !== "") {
						if ( a ) {
							this.countryOption.push({ label: this.titlecasePipe.transform(a), value: a })
						}
					}
				});


				tempArrNationality.forEach((a, i) => {
					if (tempArrNationality.indexOf(a) === i && a !== undefined && a !== "") {
						if ( a ) {
							this.nationalityOption.push({ label: this.titlecasePipe.transform(a), value: a })
						}
					}
				});

			}, 0);
		}

		if (this.thisPage == "charges") {
			this.listDataValues.forEach((value) => {
				tempArrStatus.push(value.status);
				tempArrOfficerRole.push(value.officer_role);
			});

			tempArrStatus.forEach((a, i) => {
				if (tempArrStatus.indexOf(a) === i) {
					this.directorListStatus.push({ label: this.titlecasePipe.transform(a), value: a });
				}
			});
		}

		// if(this.thisPage == "create-new-plans") {
		//     this.listDataValues.forEach((value, key) => {
		//         value.status = value.status == 1 ? 'Active' : 'Inactive';
		//         tempArrStatus.push(value.status);
		//     });

		//     tempArrStatus.forEach((a, i) => {
		//         if (tempArrStatus.indexOf(a) === i) {
		//             this.directorListStatus.push({ label: this.titlecasePipe.transform(a), value: a });
		//         }
		//     });
		// }

		if (this.thisPage == 'CCJ') {
			this.listDataValues.forEach((value) => {
				tempArrCCJStatus.push(value.ccjStatus);
			});

			tempArrCCJStatus.forEach((a, i) => {
				if (tempArrCCJStatus.indexOf(a) === i && a !== undefined && a !== "") {
					this.ccjStatus.push({ label: a == '' ? '-' : this.titlecasePipe.transform(a), value: a });
				}
			});
		}

		if (this.thisPage == "tradingAddress") {
			this.listDataValues.forEach((value) => {
				if (value.tradingCTPSFlag == 't' || value.tradingCTPSFlag == 'b' || value.tradingCTPSFlag == 'c') {
					value.tradingCTPSFlag = ""
				}
				tempArrCtps.push(value.tradingCTPSFlag);
			});

			tempArrCtps.forEach((a, i) => {
				if (tempArrCtps.indexOf(a) === i && a !== undefined && a !== "" && a !== null) {
					this.ctpsValue.push({ label: a == '' ? '-' : this.titlecasePipe.transform(a == 'y' ? 'Yes' : 'No'), value: a });
				}
			});
		}

		// if (this.thisPage == "corporateLand") {

		// 	this.listDataValues.forEach((value) => {
		// 		tempArrCorporateLandChangeIndicatorValue.push(value.Change_Indicator);
		// 	});

		// 	tempArrCorporateLandChangeIndicatorValue.forEach((a, i) => {
		// 		if (tempArrCorporateLandChangeIndicatorValue.indexOf(a) === i && a !== undefined && a !== "" && a !== null) {
		// 			this.tempArrCorporateLandChangeIndicatorValue.push({ label: a == '' ? '-' : this.titlecasePipe.transform(a == 'a' ? 'Added' : 'Deleted'), value: a });
		// 		}
		// 	});
		// }

		if (this.thisPage == 'customerWatchPage') {
			this.customerWatchOptions = [];
			this.listDataValues.forEach((value) => {
				tempArrCustomerWatchStatus.push(value.companyStatus);
			});
			tempArrCustomerWatchStatus.forEach((a, index) => {
				if (tempArrCustomerWatchStatus.indexOf(a) === index) {
					// if(a === 'live'){
					//     this.customerWatchOptions.push({ label: this.titlecasePipe.transform('live'), value: 'live' });      
					// }
					// else {
					this.customerWatchOptions.push({ label: this.titlecasePipe.transform(a), value: a });
					// }                 
				}
			});
		}


		if (this.thisPage == 'companyDocumentsPage') {
			this.listDataValues.forEach((value) => {
				tempArrCategory.push(value.category);
			});

			tempArrCategory.forEach((a, i) => {
				if (tempArrCategory.indexOf(a) === i) {
					this.categoryData.push({ label: this.titlecasePipe.transform(a), value: a });
				}
			});
		}

		if (this.thisPage == 'pscStatementControlPersonDetails') {

			let tempArrPscStatus = [];
			for (let data of this.listDataValues) {
				if (data.psc_statement_status == 'current')
					data.psc_statement_status = 'active'
			}

			this.listDataValues.forEach((value) => {
				tempArrPscStatus.push(value.psc_statement_status);
			});

			tempArrPscStatus.forEach((a, i) => {
				if (tempArrPscStatus.indexOf(a) === i && a !== undefined && a !== "") {
					this.psc_statement_statusOption.push({ label: a == '' ? '-' : this.titlecasePipe.transform(a), value: a })
				}
			});
		}

		if (this.thisPage == 'user-management') {
			this.subscriptionPlanNameOpts = [];
			this.mailVerifiedOptions = [];
			this.emailSubscriptionOptions = [];
			this.listDataValues.forEach((value) => {
				tempArrPlanName.push(value.plan_name);
				tempArrVerifiedOption.push(value.isEmailVerified);
				tempArrEmailSubscriptionOptions.push(value.emailSubscription);
				// value.planType = value.subs_cost > 0 ? 'Paid' : 'Free';
				tempArrPlanType.push(value.plan_type);
				tempArrNewPlanType.push(value.plan_type_latest)
				tempArrPaymentOfflineOptions.push(value.payment_mode_offline);
				tempPaidUserOptions.push(value.paid_User);
			});

			tempArrPlanName.forEach((a, i) => {
				if (tempArrPlanName.indexOf(a) === i) {
					if (a !== null && a !== undefined && a !== '')
						this.subscriptionPlanNameOpts.push({ label: a, value: a });
				}
			});

			tempArrPlanType.forEach((a, i) => {
				if (tempArrPlanType.indexOf(a) === i) {
					if (a !== null && a !== undefined && a !== '')
						this.subscriptionPlanTypeOpts.push({ label: a, value: a });
				}
			});

			tempArrNewPlanType.forEach((a, i) => {
				if (tempArrNewPlanType.indexOf(a) === i) {
					if (a !== null && a !== undefined && a !== '')
						this.subscriptionNewPlanTypeOpts.push({ label: a, value: a });
				}
			});

			tempArrVerifiedOption.forEach((a, i) => {
				if (tempArrVerifiedOption.indexOf(a) === i) {
					if (a === true)
						this.mailVerifiedOptions.push({ label: "Verified", value: a });
					else
						this.mailVerifiedOptions.push({ label: "Not verified", value: a });
				}
			});
			tempArrEmailSubscriptionOptions.forEach((a, i) => {
				if (tempArrEmailSubscriptionOptions.indexOf(a) === i) {
					if (a === true)
						this.emailSubscriptionOptions.push({ label: "Subscribed", value: a });
					else
						this.emailSubscriptionOptions.push({ label: "Not subscribed", value: a });
				}
			});
			tempArrPaymentOfflineOptions.forEach((a, i) => {
				if (tempArrPaymentOfflineOptions.indexOf(a) === i) {
					if (a === 1)
						this.paymentModeOptions.push({ label: "Offline", value: a });
					else
						this.paymentModeOptions.push({ label: "Others", value: a });
				}
			});
			this.paidUserOptions = [];
			tempPaidUserOptions.forEach((a, i) => {
				if (tempPaidUserOptions.indexOf(a) === i) {
					if (a === true)
						this.paidUserOptions.push({ label: "Yes", value: a });
					else if (a === false)
						this.paidUserOptions.push({ label: "No", value: a });
				}
			});
		}

		if (this.thisPage == 'companyEventsData') {
			tempArrStatus = [];

			this.listDataValues.forEach((value) => {
				tempArrStatus.push(value.statusCodeDesc);
			});

			tempArrStatus.forEach((a, index) => {
				if (tempArrStatus.indexOf(a) === index) {
					this.statusCodeDescDropdownOptions.push({ label: this.titlecasePipe.transform(a), value: a });
				}
			});

			this.statusCodeDescDropdownOptions.sort((a, b) => a.label.localeCompare(b.label));

		}


		if (this.thisPage == 'innovateGrant') {

			for (let optFieldKey in this.innovationGrantDropdownOptions) {

				let tempArrDropdownOpts = [];

				this.listDataValues.forEach((value) => {
					tempArrDropdownOpts.push(value[optFieldKey]);
				});

				tempArrDropdownOpts.forEach((a, index) => {
					if (tempArrDropdownOpts.indexOf(a) === index) {
						this.innovationGrantDropdownOptions[optFieldKey].push({ label: this.titlecasePipe.transform(a), value: a });
					}
				});

				this.innovationGrantDropdownOptions[optFieldKey].sort((a, b) => a.label.localeCompare(b.label));

			}

		}

		if (this.thisPage == 'pscData') {

			for (let optFieldsKey in this.pscDropdownOptions) {


				let tempArrDropdownOptions = [];
				for (let data of this.listDataValues) {
					if (data.stat == 'current')
						data.stat = 'active'
				}
				this.listDataValues.forEach((value) => {
					tempArrDropdownOptions.push(value[optFieldsKey]);
					tempArrNationality.push(value.nationality);
				});

				tempArrDropdownOptions.forEach((a, index) => {
					if (tempArrDropdownOptions.indexOf(a) === index && a !== undefined && a !== "-" && a !== "" ) {
						this.pscDropdownOptions[optFieldsKey].push({ label: a == '' ? '-' : this.titlecasePipe.transform(a), value: a });
					}
				});


				this.pscDropdownOptions[optFieldsKey].sort((a, b) => a.label.localeCompare(b.label));
			}

			tempArrNationality.forEach((a, i) => {
				if (tempArrNationality.indexOf(a) === i && a !== undefined && a !== "") {
					this.nationalityOption.push({ label: a == '' ? '-' : this.titlecasePipe.transform(a), value: a })
				}
			});
		}

		if (this.thisPage == 'patentTradeData') {

			this.listDataValues.forEach((value) => {
				tempArrCountryOfIncorporation.push(value.CountryOfIncorporation);
			});
			tempArrCountryOfIncorporation.forEach((a, i) => {
				if (tempArrCountryOfIncorporation.indexOf(a) === i && a !== undefined && a !== "") {
					this.CountryOfIncorporationData.push({ label: a == '' ? '-' : this.titlecasePipe.transform(a), value: a })
				}
			});
		}
		
		if (this.thisPage == 'shareHolderDetails' || this.thisPage == 'shareHolders' ) {

			if (this.listDataValues && this.listDataValues.length > 0) {

				let tempArrCompaniesStatus = [], tempshareHolderStatus = [], temArrshareHoldersCurrency = [];
				// this.shareHoldingCompanyStatusOptions = [];
				this.shareholdersCurrency = [];

				// this.filterDate();

				this.listDataValues.forEach((value) => {
					tempArrCompaniesStatus.push(value.companyStatus);
					temArrshareHoldersCurrency.push(value.currency);

					if (value['share_holder_reg']) {
						tempshareHolderStatus.push(value.shareHolderAsCompanyStatus);
					}
				});

				// tempArrCompaniesStatus.forEach((a, i) => {
				//     if(tempArrCompaniesStatus.indexOf(a) === i && a !== null) {
				//         this.shareHoldingCompanyStatusOptions.push({ label: this.titlecasePipe.transform(a), value: a })
				//     }
				// });

				temArrshareHoldersCurrency.forEach((key, index) => {
					if (temArrshareHoldersCurrency.indexOf(key) === index) {
						if (key) {
							this.shareholdersCurrency.push({ label: key == '' ? '-' : key.toString().toUpperCase(), value: key });
						}
					}
				});

				// tempShareHoldingCompanyStatus.forEach((key, index) => {
				//     if( tempShareHoldingCompanyStatus.indexOf(key) === index ) {
				//         if( key ) {
				//             this.shareHoldingCompanyStatusOptions.push({ label: key == '' ? '-': this.titlecasePipe.transform(key), value: key });
				//         }
				//     }
				// });
			}
		}

		if ( this.listDataValues && this.listDataValues.length ) {

			this.listDataValues.forEach((value) => {
				tempShareholderStatusForInvestee.push(value.shareHolderAsCompanyStatus);
				tempShareholderStatusForInvestor.push(value.companyStatus);
			});

			tempShareholderStatusForInvestee.forEach((key, index) => {
				if (tempShareholderStatusForInvestee.indexOf(key) === index) {
					if (key) {
						this.shareHolderStatusOptions.push({ label: key == '' ? '-' : this.titlecasePipe.transform(key), value: key });
					}
				}
			});

			tempShareholderStatusForInvestor.forEach((key, index) => {
				if (tempShareholderStatusForInvestor.indexOf(key) === index) {
					if (key) {
						this.shareHoldingCompanyStatusOptions.push({ label: key == '' ? '-' : this.titlecasePipe.transform(key), value: key });
					}
				}
			});

		}

        // setTimeout(() => {
                    
        //     this.changeDetection.detectChanges();

        // }, 2000);

	}

	filterDatesInTable() {
		let _self = this;

		setTimeout(() => {

			this.userListTable.filterService.filters['safeAlertDatePickFilters'] = (value): boolean => {
				let s = _self.safeAlertDatePickValue[0].getTime(), e;
				let dateVal = new Date(this.changeToDate(value));
				if (_self.safeAlertDatePickValue[1]) {
					e = _self.safeAlertDatePickValue[1].getTime();
					this.safeAlertDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['createNewPlansStartDatePickFilters'] = (value): boolean => {
				let s = _self.createNewPlansStartDatePickValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));
				if (_self.createNewPlansStartDatePickValue[1]) {
					e = _self.createNewPlansStartDatePickValue[1].getTime();
					this.createNewPlansStartDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['acquiredDatePickFilters'] = (value): boolean => {
				let s = _self.acquiredDatePickValue[0].getTime(), e;
				let dateVal = new Date(this.changeToDate(value));
				if (_self.acquiredDatePickValue[1]) {
					e = _self.acquiredDatePickValue[1].getTime();
					this.acquiredDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['companyRegistrationDatePickFilters'] = (value): boolean => {
				let s = _self.companyRegistrationDatePickValue[0].getTime(), e;
				let dateVal = new Date(this.changeToDate(value));
				if (_self.companyRegistrationDatePickValue[1]) {
					e = _self.companyRegistrationDatePickValue[1].getTime();
					this.companyRegistrationDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['pscDateOfBirthDatePickFilters'] = (value): boolean => {
				let s = _self.pscDateOfBirthDatePickValue[0].getTime(), e;
				let dateVal = new Date(this.changeToDate(value));
				if (_self.pscDateOfBirthDatePickValue[1]) {
					e = _self.pscDateOfBirthDatePickValue[1].getTime();
					this.pscDateOfBirthDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['createNewPlansEndDatePickFilters'] = (value): boolean => {
				let s = _self.createNewPlansEndDatePickValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));
				if (_self.createNewPlansEndDatePickValue[1]) {
					e = _self.createNewPlansEndDatePickValue[1].getTime();
					this.createNewPlansEndDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['companyCommentaryDateLoggedFilters'] = (value): boolean => {
				let s = _self.companyCommentaryDateLoggedValue[0].getTime(), e;
				let dateVal = new Date(this.changeToDate(value));

				if (_self.companyCommentaryDateLoggedValue[1]) {
					e = _self.companyCommentaryDateLoggedValue[1].getTime();
					this.companyCommentaryDateLoggedPicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['ccjDatePickFilters'] = (value): boolean => {
				let s = _self.ccjDatePickValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.ccjDatePickValue[1]) {
					e = _self.ccjDatePickValue[1].getTime();
					this.ccjDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['ccjPaidDatePickFilters'] = (value): boolean => {
				let s = _self.ccjPaidDatePickValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');

				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.ccjPaidDatePickValue[1]) {
					e = _self.ccjPaidDatePickValue[1].getTime();
					this.ccjPaidDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['patentAndTradePickFilters'] = (value): boolean => {
				let s = _self.patentAndTradeDatePickValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.patentAndTradeDatePickValue[1]) {
					e = _self.patentAndTradeDatePickValue[1].getTime();
					this.patentAndTradeDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['corporateLandDateProperietorPickFilters'] = (value): boolean => {
				let s = _self.corporateLandDateProperietorPickValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.corporateLandDateProperietorPickValue[1]) {
					e = _self.corporateLandDateProperietorPickValue[1].getTime();
					this.corporateLandDateProperietorPicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['relatedCompaniesAppointedDatePickFilters'] = (value): boolean => {
				let s = _self.relatedCompaniesAppointedDatePickValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.relatedCompaniesAppointedDatePickValue[1]) {
					e = _self.relatedCompaniesAppointedDatePickValue[1].getTime();
					this.relatedCompaniesAppointedDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['relatedCompaniesIncorporationDatePickFilters'] = (value): boolean => {
				let s = _self.relatedCompaniesIncorporationDatePickValue[0].getTime(), e;
				let dateVal = new Date(this.changeToDate(value));

				if (_self.relatedCompaniesIncorporationDatePickValue[1]) {
					e = _self.relatedCompaniesIncorporationDatePickValue[1].getTime();
					this.relatedCompaniesIncorporationDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['relatedDirectorsResignedDatePickFilters'] = (value): boolean => {
				let s = _self.relatedDirectorsResignedDatePickValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.relatedDirectorsResignedDatePickValue[1]) {
					e = _self.relatedDirectorsResignedDatePickValue[1].getTime();
					this.relatedDirectorsResignedDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['relatedDirectorsAppointmentDatePickFilters'] = (value): boolean => {
				let s = _self.relatedDirectorsAppointmentDatePickValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.relatedDirectorsAppointmentDatePickValue[1]) {
					e = _self.relatedDirectorsAppointmentDatePickValue[1].getTime();
					this.relatedDirectorsAppointmentDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['discriptionDateFilters'] = (value): boolean => {
				let s = _self.discriptionDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.discriptionDateValue[1]) {
					e = _self.discriptionDateValue[1].getTime();
					this.discriptionDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['chargesCreatedDateFilters'] = (value): boolean => {
				let s = _self.chargesCreatedDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.chargesCreatedDateValue[1]) {
					e = _self.chargesCreatedDateValue[1].getTime();
					this.chargesCreatedDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['chargesRegisteredDateFilters'] = (value): boolean => {
				let s = _self.chargesRegisteredDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.chargesRegisteredDateValue[1]) {
					e = _self.chargesRegisteredDateValue[1].getTime();
					this.chargesRegisteredDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['chargesDeliveredDateFilters'] = (value): boolean => {
				let s = _self.chargesDeliveredDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.chargesDeliveredDateValue[1]) {
					e = _self.chargesDeliveredDateValue[1].getTime();
					this.chargesDeliveredDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['directorResignedDateFilters'] = (value): boolean => {
				let s = _self.directorResignedDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.directorResignedDateValue[1]) {
					e = _self.directorResignedDateValue[1].getTime();
					this.directorResignedDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['notesUpdatedDateFilters'] = (value): boolean => {
				let s = _self.notesUpdatedDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.notesUpdatedDateValue[1]) {
					e = _self.notesUpdatedDateValue[1].getTime();
					this.notesUpdatedDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['directorAppointedDateFilters'] = (value): boolean => {
				let s = _self.directorAppointedDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.directorAppointedDateValue[1]) {
					e = _self.directorAppointedDateValue[1].getTime();
					this.directorAppointedDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['deletedDirectorsDateFilters'] = (value): boolean => {
				let s = _self.deletedDirectorsDateValue[0].getTime(), e;
				let dateVal = new Date(this.changeToDate(value));

				if (_self.deletedDirectorsDateValue[1]) {
					e = _self.deletedDirectorsDateValue[1].getTime();
					this.deletedDirectorsDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['userSavedListCreatedDateFilters'] = (value): boolean => {
				let s = _self.userSavedListCreatedDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.userSavedListCreatedDateValue[1]) {
					e = _self.userSavedListCreatedDateValue[1].getTime();
					this.userSavedListCreatedDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['contactListCreatedDateFilters'] = (value): boolean => {
				let s = _self.contactListCreatedDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.contactListCreatedDateValue[1]) {
					e = _self.contactListCreatedDateValue[1].getTime();
					this.contactListCreatedDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['contactListUpdatedDateFilters'] = (value): boolean => {
				let s = _self.contactListUpdatedDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.contactListUpdatedDateValue[1]) {
					e = _self.contactListUpdatedDateValue[1].getTime();
					this.contactListUpdatedDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['userSavedListUpdatedDateFilters'] = (value): boolean => {
				let s = _self.userSavedListUpdatedDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.userSavedListUpdatedDateValue[1]) {
					e = _self.userSavedListUpdatedDateValue[1].getTime();
					this.userSavedListUpdatedDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['userExportListCreatedDateFilters'] = (value): boolean => {
				let s = _self.userExportListCreatedDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.userExportListCreatedDateValue[1]) {
					e = _self.userExportListCreatedDateValue[1].getTime();
					this.userExportListCreatedDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['saveSearchesCreatedDateFilters'] = (value): boolean => {
				let s = _self.saveSearchesCreatedDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.saveSearchesCreatedDateValue[1]) {
					e = _self.saveSearchesCreatedDateValue[1].getTime();
					this.saveSearchesCreatedDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['updatedDateFilters'] = (value): boolean => {
				let s = _self.updatedDateValue[0].getTime(), e;
				// dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(value));

				if (_self.updatedDateValue[1]) {
					e = _self.updatedDateValue[1].getTime();
					this.updatedDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}


			this.userListTable.filterService.filters['subscriptionDataStartDateFilter'] = (value): boolean => {
				let s = _self.subscriptionDataStartDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.subscriptionDataStartDateValue[1]) {
					e = _self.subscriptionDataStartDateValue[1].getTime();
					this.subscriptionDataStartDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['subscriptionDataEndDateFilter'] = (value): boolean => {
				let s = _self.subscriptionDataEndDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.subscriptionDataEndDateValue[1]) {
					e = _self.subscriptionDataEndDateValue[1].getTime();
					this.subscriptionDataEndDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['userLoginTimeFilter'] = (value): boolean => {
				let s = _self.userLoginTimeValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.userLoginTimeValue[1]) {
					e = _self.userLoginTimeValue[1].getTime();
					this.userLoginTimePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['creditScoreRatingChangeDateFilter'] = (value): boolean => {
				let s = _self.creditScoreRatingChangeDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.creditScoreRatingChangeDateValue[1]) {
					e = _self.creditScoreRatingChangeDateValue[1].getTime();
					this.creditScoreRatingChangeDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['exportListCreatedOnDateFilter'] = (value): boolean => {
				let s = _self.exportListCreatedOnDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.exportListCreatedOnDateValue[1]) {
					e = _self.exportListCreatedOnDateValue[1].getTime();
					this.exportListCreatedOnDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['statusFiledDateFilter'] = (value): boolean => {
				let s = _self.statusFiledDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.statusFiledDateValue[1]) {
					e = _self.statusFiledDateValue[1].getTime();
					this.statusFiledDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['registeredDateFilter'] = (value): boolean => {
				let s = _self.registeredDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.registeredDateValue[1]) {
					e = _self.registeredDateValue[1].getTime();
					this.registeredDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['projectStartDateFilter'] = (value): boolean => {
				let s = _self.projectStartDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.projectStartDateValue[1]) {
					e = _self.projectStartDateValue[1].getTime();
					this.projectStartDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['projectEndDateFilter'] = (value): boolean => {
				let s = _self.projectEndDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.projectEndDateValue[1]) {
					e = _self.projectEndDateValue[1].getTime();
					this.projectEndDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['creditorsDateFilter'] = (value): boolean => {
				let s = _self.creditorsDateValue[0].getTime(), e, dateStr;
				dateStr = value;
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.creditorsDateValue[1]) {
					e = _self.creditorsDateValue[1].getTime();
					this.creditorsDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['create_dateDateFilter'] = (value): boolean => {
				let s = _self.create_dateDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.create_dateDateValue[1]) {
					e = _self.create_dateDateValue[1].getTime();
					this.create_dateDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['reportListCreatedOnDateFilter'] = (value): boolean => {

				let s = _self.reportListCreatedOnDateValue[0].getTime(), e, dateStr;
				dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(dateStr));

				if (_self.reportListCreatedOnDateValue[1]) {
					e = _self.reportListCreatedOnDateValue[1].getTime();
					this.reportListCreatedOnDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['changeDateFilter'] = (value): boolean => {
				let s = _self.changeDateValue[0].getTime(), e;
				// dateStr = this.datePipe.transform(value, 'dd/MM/yyyy');
				let dateVal = new Date(this.changeToDate(value));

				if (_self.changeDateValue[1]) {
					e = _self.changeDateValue[1].getTime();
					this.changeDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['issuedDateFilter'] = (value): boolean => {
				let s = _self.issuedDateValue[0].getTime(), e;
				let dateVal = new Date(this.changeToDate(value));

				if (_self.issuedDateValue[1]) {
					e = _self.issuedDateValue[1].getTime();
					this.issuedDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['exemptionRegistrationDateFilter'] = (value): boolean => {
				let s = _self.exemptionRegistrationDateValue[0].getTime(), e;
				let dateVal = new Date(this.changeToDate(value));

				if (_self.exemptionRegistrationDateValue[1]) {
					e = _self.exemptionRegistrationDateValue[1].getTime();
					this.exemptionRegistrationDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['pscNotifiedDateFilter'] = (value): boolean => {
				let s = _self.pscNotifiedDateValue[0].getTime(), e;
				let dateVal = new Date(this.changeToDate(value));

				if (_self.pscNotifiedDateValue[1]) {
					e = _self.pscNotifiedDateValue[1].getTime();
					this.pscNotifiedDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}
			this.userListTable.filterService.filters['pscNotifiedDateFilters'] = (value): boolean => {
				let s = _self.pscNotifiedDateValues[0].getTime(), e;
				let dateVal = new Date(this.changeToDate(value));

				if (_self.pscNotifiedDateValues[1]) {
					e = _self.pscNotifiedDateValues[1].getTime();
					this.pscNotifiedDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['awardedDateDateFilter'] = (value): boolean => {
				let s = _self.awardedDateDateValue[0].getTime(), e;
				let dateVal = new Date(this.changeToDate(value));

				if (_self.awardedDateDateValue[1]) {
					e = _self.awardedDateDateValue[1].getTime();
					this.awardedDateDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['closingDateFilter'] = (value): boolean => {
				let s = _self.closingDateValue[0].getTime(), e;
				let dateVal = new Date(this.changeToDate(value));

				if (_self.closingDateValue[1]) {
					e = _self.closingDateValue[1].getTime();
					this.closingDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['contractStartDateFilter'] = (value): boolean => {
				let s = _self.contractStartDateValue[0].getTime(), e;
				let dateVal = new Date(this.changeToDate(value));

				if (_self.contractStartDateValue[1]) {
					e = _self.contractStartDateValue[1].getTime();
					this.contractStartDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['contractEndDateFilter'] = (value): boolean => {
				let s = _self.contractEndDateValue[0].getTime(), e;
				let dateVal = new Date(this.changeToDate(value));

				if (_self.contractEndDateValue[1]) {
					e = _self.contractEndDateValue[1].getTime();
					this.contractEndDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

			this.userListTable.filterService.filters['publishedDateFilter'] = (value): boolean => {
				let s = _self.publishedDateValue[0].getTime(), e;
				let dateVal = new Date(this.changeToDate(value));

				if (_self.publishedDateValue[1]) {
					e = _self.publishedDateValue[1].getTime();
					this.contractEndDatePicker.hideOverlay();
				} else {
					e = s;
				}
				return dateVal.getTime() >= s && dateVal.getTime() <= e;
			}

		}, 0);

	}

	showModalDialog(data, thisPage) {

		if ( this.isLoggedIn ) {

			this.displayModal = true;

			if ( ['userFilterListPage', 'connectPlusSavedFilter', 'contractFinderSavedList'].includes(thisPage)) {

				// this.filterData._id = data._id;
				// this.filterData.filterName = data.filterName;
				this.UpdateCompanyList._id = data._id;
				this.UpdateCompanyList.listName = data.filterName;


			} else if (['companyListPage', 'iScorePortfolioListPage', 'companyChargesListPage', 'contactListPage', 'contractFinderList', 'connectPlusList' ].includes(thisPage)) {

				this.UpdateCompanyList._id = data._id;
				this.UpdateCompanyList.listName = data.listName;
				this.UpdateCompanyList.userID = this.userDetails?.dbID;
				this.UpdateCompanyList.pageNameForUpdate = data?.page;
			}

		} else {
			this.showLoginDialog = true;
		}

	}

	dialogBoxforExportEmail( rowData, actionFor? ) {

		this.cListId = rowData._id;
		// this.limitsDetailsForEmailsData = [];
		this.fatchAndOtherEmail(rowData, actionFor)
		
		// this.sharedLoaderService.showLoader();
		// this.customEmailOrNotdialog = true;
		// this.updateActionField.emit({
		// 	name: 'emailExport',
		// 	cListId: rowData._id,
		// });
		// setTimeout(() => {
		// 	this.saveEmailFileForSaveLists();
		// }, 2000);

	}

	dialogBoxforVerifyEmail( rowData ) {
		this.cListId = rowData._id;
		this.updateActionField.emit({
			name: 'verifyEmail',
			rowData: rowData
		});
		this.emailVerifyDialogBox = true;

	}

	saveEmailFileForSaveLists() {
		this.updateActionField.emit({
			listId:  this.cListId,
			name: 'fetchEmailStartProcess',
			userID: this.userDetails?.planId,
		});
		setTimeout(() => {
			this.customEmailOrNotdialog = false;
		}, 1000);
	}

	checkVerifyEmail() {
		this.updateActionField.emit({
			name: 'verifyEmailStartProcess',
			listId: this.cListId
		});
		
		this.emailVerifyDialogBox = false;

	}


	downloadDocumentIntoNextPage(description, document_metadata, CompanyNumber) {

		let event: Event;

		if ( this.isLoggedIn ) {

			let document_name: string = description + CompanyNumber + ".pdf";

			if ( ( ( [ this.subscribedPlanModal['Start'], this.subscribedPlanModal['Valentine_Special'], this.subscribedPlanModal['Monthly_Expand'], this.subscribedPlanModal['Expand_Annual_One_Year'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Expand_Annual_Two_Year'], this.subscribedPlanModal['Expand_New_Monthly'], this.subscribedPlanModal['Monthly_Expand_Paid_Test'], this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Expand'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Annually_Expand_Trial'], this.subscribedPlanModal['Monthly_Expand_Trial'], this.subscribedPlanModal['Expand_Weekly_Trial'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Compliance_Plan'] ].includes( this.userDetails?.planId ) && this.userDetails?.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) ) {

				let obj = {
                    metadata: document_metadata + '/content',
                    doc_name: document_name
                };

				this.globalServiceCommnunicate.globalServerRequestCall('post', 'DG_API', 'getDocument', obj).subscribe(res => {
					if (res.status === 200) {
						if (res.body["document_url"]) {
							let url: string = res.body["document_url"];
							this.downloadDocument(url, document_name);
						}
					}
				},
					() => {
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

	editFunction(formData: NgForm, thisPage) {
		this.updateActionField.emit({
			name: 'edit',
			listName: this.UpdateCompanyList.listName,
			userID: this.UpdateCompanyList.userID,
			_id: this.UpdateCompanyList._id,
			filterName: this.UpdateCompanyList.listName,
			pageNameForUpdate: this.UpdateCompanyList.pageNameForUpdate
		});

		setTimeout(() => {
			if(  this.resetDisplayModelTable.displayModal == false || this.resetDisplayModelTable.resetTable ) {
				this.resetFilters(this.userListTable, 'actionCase');
				this.displayModal = false;
			}
		}, 800);
		

	}

	viewTransactionOfList(id) {
		this.router.navigate(['/trasactionOfList', id]);
		localStorage.setItem("tabIndex", this.tabActiveIndex.toString());
	}

	viewCompanyOfList(id) {
		this.router.navigate(['/company-search', id]);
		localStorage.setItem("tabIndex", this.tabActiveIndex.toString());
	}


	delete( _id, thisPage, pageNameForDelete?) {

		if ( this.isLoggedIn ) {
			
			// let requestBody = {
			// 	userID : this.userDetails?.dbID,
			// 	_id: _id
			// };

			this.confirmationService.confirm({
				message: this.constantMessages['confirmation']['delete'],
				header: 'Delete Confirmation',
				icon: 'pi pi-info-circle',
				key: this.thisPage.toString(),
				accept: () => {
					this.updateActionField.emit({
						name: 'delete',
						userID : this.userDetails?.dbID,
						_id: _id,
						pageNameForDelete: pageNameForDelete

					});
					setTimeout(() => {
						if(  this.resetDisplayModelTable.resetTable ) {
							this.resetFilters(this.userListTable, 'actionCase' );
						}
					}, 800);
				}	
			});
			
		} else {
			this.showLoginDialog = true;
		}
		
	}

	dataEnrichment( inputData ) {
        this.updateActionField.emit({
			name:'dataEnrichment',
			userid: this.userDetails?.dbID,
			inputData: inputData,
			_id: inputData._id,
			page: inputData.page
		});
	}

	calculateCompanyAge(dob) {
		return this.commonService.calculateAge(dob);
	}

	formatCompanyNameForUrl(companyName) {
		if (companyName !== undefined) {
			return this.commonService.formatCompanyNameForUrl(companyName);
		}
	}

	showCompanySideDetailsPanel(e: Event, compNumber, compName, rowData) {
		e.stopPropagation();
		e.preventDefault();
		// this.showCompanySideDetails = true;
		// this.companySideDetailsParams.companyNumber = compNumber;
		// this.companySideDetailsParams.companyName = compName;
		// this.overviewName = "companyOverview";
		this.showCompanySideDetails = true;
		if (rowData == undefined) {
			this.companySideDetailsParams.companyNumber = compNumber;
			this.companySideDetailsParams.companyName = compName;
			this.overviewName = "companyOverview";
		}
		else if (rowData != undefined) {
			this.corporateSideOverviewData = rowData;
			this.overviewName = "corporateOverview";
		}

	}

	linkedInUrlForDirector(director_name, userUID) {
		var FinalName = " ";

		if ( this.isLoggedIn ) {

			if ( ( this.userAuthService.hasAddOnPermission('contactInformation') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) ) {
				this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_API', 'relatedCompanyToDirector', [userUID] ).subscribe( res => {
					
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
								let url = "https://www.linkedin.com/search/results/people/?firstName=" + this.firstName(director_name) + "&lastName=" + this.lastName(director_name);
								window.open(url, "_blank").focus();
							}
						}
					}
				});

			} else {
				event.preventDefault();
				event.stopPropagation();
				this.showUpgradePlanDialog = true;
			}

		} else {
			this.showLoginDialog = true;
		}

	}

	linkedInUrlForPerson(name) {
		if ( this.isLoggedIn ) {
			if ( this.userAuthService.hasAddOnPermission('contactInformation') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
				let url = "https://www.linkedin.com/search/results/people/?firstName=" + this.firstName(name) + "&lastName=" + this.lastName(name);
				window.open(url, "_blank").focus();
			} else {
				event.preventDefault();
				event.stopPropagation();
				this.showUpgradePlanDialog = true;
			}
		} else {
			this.showLoginDialog = true;
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

	getShowCompanySideDetailsOutputBoolValue($event) {
		this.showCompanySideDetails = $event;
	}

	stripHTML(str) {
		if(str) {
			return str.replace(/<[^>]*>/g, ' ');
		}
	}

	formatDirectorNameForMeetMeUrl(directorName) {

		let dName = directorName.split('(').splice(0, 1).toString();
		return dName.replace(/ \([\s\S]*?\)/g, '');

	}

	showAddNoteModal(data) {

		if ( this.isLoggedIn ) {

			if (data !== undefined) {
				this.companyDetailsParams['CompanyNumber'] = data.companyNumber;
				this.companyDetailsParams['CompanyNameOriginal'] = data.CompanyNameOriginal;
				this.companyNoteValue = data.notes;
				this.notesId = data._id;
				this.showAddNoteModalBool = true;
			}
			else {
				this.showAddNoteModalBool = true;
			}

		} else {
			this.showLoginDialog = true;
		}
	}

	GoogleURLCompanyURLwithoutWordCompany(companyName) {
		return this.commonService.GoogleURLCompanyURLwithoutWordCompany(companyName);
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

	formatCompanyAddress2(address) {
		if (address === undefined) {
			return address;
		} else if (address === null) {
			return address;
		} else {
			if (address['contactDetails'] || address['RegAddress']) {
				if (address['contactDetails'] && address['RegAddress']) {
					return (this.commonService.formatCompanyAddress(address['RegAddress']));
				}
				else if ((!address['contactDetails']) && address['RegAddress']) {
					return (this.commonService.formatCompanyAddress(address['RegAddress']));
				}
				else if (address['contactDetails'] && (!address['RegAddress'])) {
					return (this.commonService.formatCompanyAddress(address['contactDetails']));
				}
			}
		}
	}

	formatDate(date) {
		return this.commonService.formatDate(date);
	}

	formatDirectorNameForUrl(directorName) {
		return this.commonService.formatDirectorNameForUrl(directorName);
	}

	formatDirectorName(name) {
		return this.commonService.formatDirectorName(name);
	}

	checkKey(obj, key) {
		return obj.hasOwnProperty(key)
	}

	removeHyphen(str) {
		if (!(str == "null" || str == undefined || str == null)) {
			return str;
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

	addNotes() {
		let obj = {
			userid: this.userDetails?.dbID,
			notes: this.companyNoteValue,
			companyNumber: this.companyDetailsParams.CompanyNumber,
			CompanyNameOriginal: this.companyDetailsParams.CompanyNameOriginal
		}
		if (this.notesId !== undefined) {
			obj['notesId'] = this.notesId;

			this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'updateNotesCompany', obj ).subscribe( res => {
				if (res.body.status == 200) {
					this.companyNoteValue = '';
					this.notesId = undefined;
					this.showAddNoteModalBool = false;
					this.msgs = [];
					this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['notesUpdatedSuccess'], detail: '' });
					setTimeout(() => {
						this.msgs = [];
					}, 2000);

					this.updateNotesList.emit(true);

				}
			});
		}
		else {
			obj["updatedOn"] = new Date().toISOString();
			this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'addNotesCompany', obj ).subscribe( res => {
				if (res.body.status == 200) {
					this.companyNoteValue = '';
					this.showAddNoteModalBool = false;
					this.updateNotesList.emit(true);
					this.getCompanyNotesData();
				}
			});
		}
	}

	deleteNotes() {
		if (this.notesId !== undefined) {
			var notesID = this.notesId;
		}
		let obj = {
			notesId: notesID
		}
		this.showAddNoteModalBool = false;
		this.confirmationService.confirm({	

			message: this.constantMessages['confirmation']['delete'],
			header: 'Delete Confirmation',
			icon: 'pi pi-info-circle',
			key: this.thisPage ? this.thisPage.toString() : undefined,
			accept: () => {
				this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'deleteNotesCompany', obj ).subscribe( res => {
					if (res.body.status == 200) {
						this.companyNoteValue = '';
						this.notesId = undefined;
						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['noteListDeletedSuccess'], detail: '' });
						setTimeout(() => {
							this.msgs = [];
						}, 2000);
						this.updateNotesList.emit(true);
					}
				});
			}
		});
	}

	cancelNotes() {
		this.companyNoteValue = '';
	}

	getCompanyNotesData() {

		this.listDataValues = [];
		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_LIST', 'notesList' ).subscribe( res => {
			if (res.body.status == 200) {
				let tempData = res.body['results'];
				if (this.listDataValues.length > 0) {
					this.listDataValues = [];
				}
				if (tempData) {
					for (let arrayData of tempData) {
						let obj = arrayData.data[0]
						this.listDataValues.push(obj)
					};
				}

				this.listDataValues = this.sortNotes(this.listDataValues)

			};

		})
	}

	sortNotes(tempArr) {
		var len = tempArr.length,
			min;
		for (let i = 0; i < len; i++) {
			min = i;
			for (let j = i + 1; j < len; j++) {
				if (new Date(tempArr[j]["updatedOn"]) > new Date(tempArr[min]["updatedOn"])) {
					min = j;
				}
			}

			if (i != min) {
				this.swap(tempArr, i, min);
			}
		}
		return (tempArr)
	}

	swap(items, firstIndex, secondIndex) {
		var temp = items[firstIndex];
		items[firstIndex] = items[secondIndex];
		items[secondIndex] = temp;
	}

	formatUserExportCategory(value) {
		return value.replace(/_/g, " ");
	}

	downloadUserExportList(documentName) {

		let documentFileName = [documentName];

		if ( this.isLoggedIn ) {
			if (this.thisPage == "crmExportListPage") {
				this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_LIST', 'downloadUserCrmExportList', documentFileName, 'blob' ).subscribe( res => {
					var downloadURL = window.URL.createObjectURL(res);
					var link = document.createElement('a');
					link.href = downloadURL;
					link.download = documentName;
					link.click();
				});
			} else if ( this.thisPage == "cbfExportListPage" )  {
				this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_LIST', 'downloadUserCbfExportList', documentFileName, 'blob' ).subscribe( (res: any) => {
					var downloadURL = window.URL.createObjectURL(res);
					var link = document.createElement('a');
					link.href = downloadURL;
					link.download = documentName;
					link.click();
				});
			} else {
				this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_LIST', 'downloadUserExportList', documentFileName, 'blob' ).subscribe( res => {
					var downloadURL = window.URL.createObjectURL(res);
					var link = document.createElement('a');
					link.href = downloadURL;
					link.download = documentName;
					link.click();
				});
			}

		} else {
			this.showLoginDialog = true;
		}
	}

	userUpdateDialog(rowData) {

		if ( this.isLoggedIn ) {

			this.userUpdateDialogBoolean = true;
			this.userManagementRowData = JSON.parse(JSON.stringify(rowData));

			this.userManagementRowData.subs_endDate = new Date(rowData['subs_endDate']);
			this.tempUserManagementRowData1 = JSON.parse(JSON.stringify(rowData));
			// if (subscribedPlan['Start'] == this.userManagementRowData["plan"] ){
			this.planChangeSection = true;
			// }
			if (this.userManagementRowData.stripePlanId) {
				this.subscription_EndDate.disabled = true;
			} else {
				this.subscription_EndDate.disabled = false;
			}
			this.specialFilterAddOn = this.userManagementRowData['add_On'].specialFilter;
			this.tempspecialFilterAddOn = this.specialFilterAddOn;
			this.valuationFilterAddOn = this.userManagementRowData['add_On'].valuationFilter;
			this.tempvaluationFilterAddOn = this.valuationFilterAddOn;
			this.riskFilterAddOn = this.userManagementRowData['add_On'].riskFilter;
			this.tempRiskFilterAddOn = this.riskFilterAddOn;
			// this.emailFilterAddOn = this.userManagementRowData['add_On'].emailFilter;
			this.ethnicityFilterAddOn = this.userManagementRowData['add_On'].ethnicityFilter;
			this.tempEmailFilterAddOn = this.emailFilterAddOn;
			this.tempEthnicityFilterAddOn = this.ethnicityFilterAddOn;
			this.crmExportAddOn = this.userManagementRowData['add_On'].crmExport;
			this.tempCrmExportAddOn = this.crmExportAddOn;
			this.ablFilterAddOn = this.userManagementRowData['add_On'].ablFilter;
			this.tempAblFilterAddOn = this.ablFilterAddOn;
			this.industryAnalysisAddOn = this.userManagementRowData['add_On'].industryAnalysis;
			this.tempIndustryAnalysisAddOn = this.industryAnalysisAddOn;

			this.tempUserManagementRowData = JSON.parse(JSON.stringify(rowData));
			this.tempUserManagementRowData['subs_endDate'] = new Date(rowData['subs_endDate']);
			// if (this.userManagementRowData.subs_endDate !== undefined){
			//     this.subscriptionEndDate = this.tempsubscriptionEndDate = new Date(this.userManagementRowData.subs_endDate);
			//     this.selectedSubscriptionPlan = { name: this.userManagementRowData.subs_name, value: this.userManagementRowData.subs_name };
			//     this.minYear = this.tempsubscriptionEndDate.getFullYear();
			// } else {
			//     let todayDate = new Date();
			//     this.minYear = todayDate.getFullYear();
			// }

		} else {
			this.showLoginDialog = true;
		}
	}

	closeuserUpdateDialog() {
		this.userUpdateDialogBoolean = false;
	}

	updateUserData() {
		if ( this.isLoggedIn ) {

			this.confirmationService.confirm({
				message: 'Do you want to update the user details?',
				key: this.thisPage.toString(),
				accept: () => {

					// Lastest Changes by Shivam Wadhwa, Date : 12/02/2021.
					this.userManagementRowData.pepAndSanctionHitLimit;
					let keys = Object.keys(this.userManagementRowData);
					let comparisionBool = true;

					for (let key of keys) {
						if (this.userManagementRowData[key] && this.tempUserManagementRowData1[key]) {
							if (this.userManagementRowData[key].toString().toLowerCase() !== this.tempUserManagementRowData1[key].toString().toLowerCase()) {
								comparisionBool = false;
								break
							} else {
								if (this.userManagementRowData[key] !== this.tempUserManagementRowData1[key]) {
									comparisionBool = false;
									break
								}
							}
						}
						comparisionBool = true;
					}

					if (comparisionBool && this.specialFilterAddOn === this.tempspecialFilterAddOn && this.valuationFilterAddOn === this.tempvaluationFilterAddOn && this.riskFilterAddOn === this.tempRiskFilterAddOn && this.crmExportAddOn === this.tempCrmExportAddOn && this.ablFilterAddOn === this.tempAblFilterAddOn && this.industryAnalysisAddOn === this.tempIndustryAnalysisAddOn && this.emailFilterAddOn === this.tempEmailFilterAddOn && this.ethnicityFilterAddOn === this.tempEthnicityFilterAddOn) {
						this.msgs = [];
						this.msgs.push({ severity: 'error', summary: "No Changes found to update!" });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);

						this.userUpdateDialogBoolean = false;
					} else {
						this.sharedLoaderService.showLoader();
						let loginModelKeys = ['username', 'email', 'postalCode', 'advancedLimit', 'corpLandLimit', 'landLimit', 'companyReport', 'creditReportLimit', 'directorReportLimit', 'titleRegisterHitLimit', 'pepAndSanctionHitLimit', 'companyMonitorLimit', 'directorMonitorLimit', 'contactInformationLimit', 'api_hits', 'paid_User'];
						// this.userManagementRowData.subs_endDate = this.subscriptionEndDate;
						if (this.selectedSubscriptionPlan && this.selectedSubscriptionPlan.name)
							this.userManagementRowData.subs_name = this.selectedSubscriptionPlan.name;
						let obj = {};
						obj["user_id"] = this.tempUserManagementRowData["_id"];
						obj["subs_id"] = this.tempUserManagementRowData["subs_id"];

						for (let key in this.userManagementRowData) {
							if (loginModelKeys.includes(key)) {
								if (this.userManagementRowData[key] !== this.tempUserManagementRowData[key]) {
									obj[key] = this.userManagementRowData[key];
								}
							} else if (key == "subs_endDate") {
								if (this.userManagementRowData[key].name !== undefined) {
									obj["name"] = this.userManagementRowData[key].name;
								}
								if (this.userManagementRowData[key] !== undefined) {
									obj["endDate"] = this.userManagementRowData[key];
								}
							}
						}

						if (obj.hasOwnProperty("endDate")) {
							obj['case'] = 2;
							loginModelKeys.forEach(key => {
								if (obj.hasOwnProperty(key)) {
									obj['case'] = 3;
								}
							});
						} else {
							obj['case'] = 1;
						}
						let addOnObj = {
							userId: this.tempUserManagementRowData["_id"],
							specialFilter: this.specialFilterAddOn,
							valuationFilter: this.valuationFilterAddOn,
							riskFilter: this.riskFilterAddOn,
							// emailFilter: this.emailFilterAddOn,
							ethnicityFilter: this.ethnicityFilterAddOn,
							crmExport: this.crmExportAddOn,
							ablFilter: this.ablFilterAddOn,
							industryAnalysis: this.industryAnalysisAddOn
						}

						this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_USER_API', 'updateUser', obj ).subscribe( res => {

							if (res['status'] == 200) {
								this.msgs = [];
								if (this.userManagementRowData["paid_User"] !== this.tempUserManagementRowData["paid_User"]) {
									if (this.userManagementRowData["paid_User"] || !this.userManagementRowData["paid_User"]) {
										this.msgs.push({ severity: 'success', summary: "Paid user updated successfully!" });
										setTimeout(() => {
											this.msgs = [];
										}, 7000);
									}
								}

								//update addOnMaster service
								if (this.userManagementRowData["add_On"]["riskFilter"] !== this.riskFilterAddOn || this.userManagementRowData["add_On"]["valuationFilter"] !== this.valuationFilterAddOn || this.userManagementRowData["add_On"]["crmExport"] !== this.crmExportAddOn || this.userManagementRowData["add_On"]["ablFilter"] !== this.ablFilterAddOn || this.userManagementRowData["add_On"]["specialFilter"] !== this.specialFilterAddOn || this.userManagementRowData["add_On"]["industryAnalysis"] !== this.industryAnalysisAddOn || this.userManagementRowData["add_On"]["emailFilter"] !== this.emailFilterAddOn || this.userManagementRowData["add_On"]["ethnicityFilter"] !== this.ethnicityFilterAddOn) {
									if (this.userManagementRowData["add_On"] || !this.userManagementRowData["add_On"]) {
										this.globalServiceCommnunicate.globalServerRequestCall('post', 'DG_ADDON_API', 'updateAddOnFilters', addOnObj ).subscribe( res => {

											if (res.body['status'] == 200) {
												this.msgs.push({ severity: 'success', summary: "Add on updated successfully!" });
												setTimeout(() => {
													this.msgs = [];
												}, 7000);
											}

										});
									}
								}
								if (this.userManagementRowData["advancedLimit"] !== this.tempUserManagementRowData["advancedLimit"] || this.userManagementRowData["username"] !== this.tempUserManagementRowData["username"] || this.userManagementRowData["email"] !== this.tempUserManagementRowData["email"] || this.userManagementRowData["postalCode"] !== this.tempUserManagementRowData["postalCode"] || this.userManagementRowData["corpLandLimit"] !== this.tempUserManagementRowData["corpLandLimit"] || this.userManagementRowData["landLimit"] !== this.tempUserManagementRowData["landLimit"] || this.userManagementRowData["companyReport"] !== this.tempUserManagementRowData["companyReport"] || this.userManagementRowData["directorReportLimit"] !== this.tempUserManagementRowData["directorReportLimit"] || this.userManagementRowData["creditReportLimit"] !== this.tempUserManagementRowData["creditReportLimit"] || this.userManagementRowData["titleRegisterHitLimit"] !== this.tempUserManagementRowData["titleRegisterHitLimit"] || this.userManagementRowData["companyMonitorLimit"] !== this.tempUserManagementRowData["companyMonitorLimit"] || this.userManagementRowData["directorMonitorLimit"] !== this.tempUserManagementRowData["directorMonitorLimit"] || this.userManagementRowData["contactInformationLimit"] !== this.tempUserManagementRowData["contactInformationLimit"] || this.userManagementRowData["api_hits"] !== this.tempUserManagementRowData["api_hits"] || this.userManagementRowData["pepAndSanctionHitLimit"] !== this.tempUserManagementRowData["pepAndSanctionHitLimit"]) {
									this.msgs.push({ severity: 'success', summary: "Limits updated successfully!" });
									setTimeout(() => {
										this.msgs = [];
									}, 7000);
								}
								// if(this.userManagementRowData["subs_endDate"] !== this.tempUserManagementRowData["subs_endDate"]) {
								//     this.msgs.push({ severity: 'success', summary: "Subscription Date updated successfully!" });
								//     setTimeout(() => {
								//         this.msgs = [];
								//     }, 7000);
								// }
							}

							this.getUserManagementTable();
						});

						this.userUpdateDialogBoolean = false;
						this.subscriptionEndDate = undefined;
						this.sharedLoaderService.hideLoader();
						this.getUserManagementTable();

					}

				},
				reject: () => {

					this.userUpdateDialogBoolean = false;

				}
			});

		} else {
			this.showLoginDialog = true;
		}
	}

	getUserManagementTable( pageSize?: number, startAfter?: number, filterSearchArray?: any[], sortOn?: any[] ) {
		let reqBody = {
			'pageSize' : pageSize ? pageSize : 25,
			'startAfter' : startAfter ? startAfter : 1,
			'filterSearchArray' : filterSearchArray ? filterSearchArray : [],
			'sortOn': sortOn ? sortOn : []
		}
		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'allUsersList', reqBody ).subscribe( res => {
			this.listDataValues = res.body['userDetails'];
			this.getFilterTableData();
		});
	}

	deleteUserData(tableData, userData) {

		if ( this.isLoggedIn ) {

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
					this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_USER_API', 'deleteUser', obj ).subscribe( res => {
						if (res.status == 200) {
							this.msgs = [];
							this.msgs.push({ severity: 'success', summary: "User Deleted Successfully" });
							setTimeout(() => {
								this.msgs = [];
							}, 5000);
							this.getUserManagementTable();
							tableData['filteredValue'] = [];
							this.resetFilters(tableData);
							this.selectedCompany = [];

						} else if (res.status == 201) {
							this.msgs = [];
							this.msgs.push({ severity: 'error', summary: "User Not Deleted" });
							setTimeout(() => {
								this.msgs = [];
							}, 5000);
							tableData['filteredValue'] = [];
							this.resetFilters(tableData);
						}
					});
				}
			});

		} else {
			this.showLoginDialog = true;
		}
	}

	deleteMeetMeRecord(meetMeTableData, selectedCompanyData) {

		if ( this.isLoggedIn ) {

			let obj = [];
			for (let data of selectedCompanyData) {
				obj.push(data._id);
			}
			let objTemp = {
				id: obj
			}
				
			this.confirmationService.confirm({
				message: this.constantMessages['confirmation']['delete'],
				header: 'Delete Confirmation',
				icon: 'pi pi-info-circle',
				key: this.thisPage.toString(),
				accept: () => {
					this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'deleteUserMeetMeRelation', 	objTemp	).subscribe( res => {
						if (res.status == 200) {
							this.msgs = [];
							this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['linkDeletedSuccess'] });

							setTimeout(() => {
								this.msgs = [];
							}, 5000);

							this.getUserMeetMeRelations();
							this.listDataValues = [];

							this.resetFilters(meetMeTableData);

							this.selectedCompany = [];

						} else if (res.status == 201) {
							this.msgs = [];
							this.msgs.push({ severity: 'error', summary: "Something went wrong, please try again." });

							setTimeout(() => {
								this.msgs = [];
							}, 5000);

							meetMeTableData['filteredValue'] = [];

							this.resetFilters(meetMeTableData);
						}
					});
				},
				reject: () => {
					this.msgs = [{ severity: 'info', summary: 'You have canceled' }];

					setTimeout(() => {
						this.msgs = [];
					}, 3000);

				}
			});

		} else {
			this.showLoginDialog = true;
		}
	}

	deleteCbilSettingsRow() {
		if ( this.isLoggedIn ) {
			this.confirmationService.confirm({
				message: this.constantMessages['confirmation']['delete'],
				header: 'Delete Confirmation',
				icon: 'pi pi-info-circle',
				key: this.thisPage.toString(),
			});
		} else {
			this.showLoginDialog = true;
		}
	}

	// pageChange(event) {
	//     if( this.thisPage == "user-management") {
	//         if (event.rows !== this.rows) {
	//             this.rows = event.rows;
	//             this.selectedCompany = [];
	//         }
	//     }
	// }

	createNewUserDialogBack() {
		this.userTypeCompany = false;
		this.userTypeIndividual = false;
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
		if (event) {

			this.sharedLoaderService.hideLoader();
			this.createNewUserDialog = false;

			this.getUserManagementTable();

			this.msgs = [];
			this.msgs.push({ severity: 'success', summary: "User Created Successfully" });

			setTimeout(() => {
				this.msgs = [];
			}, 5000);

		}
	}

	filteredPostalCode(event) {
		if (event.query.length > 2) {
			this.searchFiltersService.getKeywordsPostCode('RegAddress_Modified.postalCode.keyword', 'keywordPostCode', event.query.toString().toLowerCase(), 'companySearch', undefined).then(data => {
				if (data !== undefined) {
					if (data.distinct_categories.buckets.length > 0) {
						this.filteredPostalCodeArray = [];
						for (let val of data.distinct_categories.buckets) {
							if (val.key === "Unknown") {
								this.filteredPostalCodeArray.push({ key: val.key });
							}
							else {
								this.filteredPostalCodeArray.push({ key: val.key.toUpperCase() });
							}
						}
					}
				}
			})
		} else {
			this.filteredPostalCodeArray = [];
		}
	}

	filteredCompanyName(event) {

		clearTimeout(this.timeout);

		this.timeout = setTimeout(() => {

			let tempFilteredArray = [];

			if (event.query.length > 2) {
				let obj = {
					companyName: event.query.toString().toLowerCase(),
					companyStatus: "live"
				};
				this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_API', 'companyNameSuggestionsNew' , obj ).subscribe( res => {
					let data = res.body;
					if (data !== undefined) {
						if (data.status == 200) {
							if (data['results'] !== undefined) {
								if (data['results']['hits']['total']['value'] == 0) {
									this.filteredCompanyNameArray = [];
								} else if (data['results']['hits']['total']['value'] > 0) {
									this.filteredCompanyNameArray = [];

									for (let val of data['results']['hits']['hits']) {
										let address = {
											"RegAddress": val['_source']['RegAddress_Modified'],
											"contactDetails": val['_source']['contactDetails']
										}

										tempFilteredArray.push({
											key: this.titlecasePipe.transform(val['_source']['businessName']),
											value: val['_source']['companyRegistrationNumber'],
											address: address,
											directors_data: val['_source']['directorsData']
										});
									}

									this.filteredCompanyNameArray = tempFilteredArray;

								}
							} else {
								this.filteredCompanyNameArray = [];
							}
						}
					}
				})
			} else {
				this.filteredCompanyNameArray = [];
			}

		}, 1000);

	}

	onSelectCompany(event) {
		if (event !== undefined) {
			this.address = this.formatCompanyAddress2(event.address);
			this.postalCodeField = { key: event.address.RegAddress.postalCode.toUpperCase() };

			if (event.directors_data !== undefined) {
				if (event.directors_data.length > 0) {
					this.filteredDirectorArray = [];
					for (let val of event.directors_data) {
						if (val.detailedInformation !== undefined) {
							this.filteredDirectorArray.push({ key: this.formatDirectorName2(val.detailedInformation) })
						}
					}
				} else {
					this.filteredDirectorArray = [];
				}
			} else {
				this.filteredDirectorArray = [];
			}
		} else {
			this.filteredDirectorArray = [];
		}
	}

	filteredDirector(event) {
		this.filteredDirectorDisplayArray = [];
		let filtered: any[] = [];
		if (this.filteredDirectorArray !== undefined) {
			for (let i = 0; i < this.filteredDirectorArray.length; i++) {
				let director_name = this.filteredDirectorArray[i];
				if (director_name.key.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
					filtered.push(director_name);
				}
			}
			this.filteredDirectorDisplayArray = filtered;
		}
	}

	directorNameConvert(name) {
		if (typeof (name) === "object") {
			return name.key;
		}
		else if (typeof (name) === "string") {
			return name;
		}
	}

	formatDirectorName2(name) {
		let full_name = "";
		if (name.forename !== undefined && name.forename !== null) {
			full_name = name.forename;
		}
		if (name.middlename !== undefined && name.middlename !== null) {
			full_name += ' ' + name.middlename;
		}
		if (name.surname !== undefined && name.surname !== null) {
			full_name += ' ' + name.surname;
		}
		return (this.titlecasePipe.transform(full_name));
	}

	contactNumOnly(event): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		if (charCode > 31 && charCode != 43 && charCode != 45 && (charCode < 48 || charCode > 57)) {
			this.showContactNumbMsg = true;
			return false;
		}
		this.showContactNumbMsg = false;
		return true;
	}
	formatPhoneNumber(phoneNumberString) {
		var numberFormat = ('' + phoneNumberString).replace(/\D/g, '')
		var match = numberFormat.match(/^(\d{3})(\d{3})(\d{4})$/)
		if (match) {
			return '(' + match[1] + ') ' + match[2] + '-' + match[3];
		}
		return numberFormat
	}

	refreshData() {
		if (this.thisPage === 'meetMePage') {
			this.listDataValues = [];
			this.getUserMeetMeRelations();
		}
	}

	getUserMeetMeRelations() {
		// let userId = [ this.userDetails?.dbID ];
		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getUserMeetMeRelations' ).subscribe( res => {
				if (res.body.status == 200) {
					this.listDataValues = res.body.results;
					for (let i = 0; i < this.listDataValues.length; i++) {
						this.listDataValues[i]['options'] = this.listDataValues[i].option;
						this.listDataValues[i]["sourceDirector"] = this.listDataValues[i]["sourceDirectorName"];
						this.listDataValues[i]["sourceNumber"] = this.listDataValues[i]["sourceDirectorPnr"];
						this.listDataValues[i]["source"] = this.listDataValues[i]["sourceCompanyName"];
						this.listDataValues[i]["sourceNumber"] = this.listDataValues[i]["sourceCompanyNumber"];
						this.listDataValues[i]["destinationDirector"] = this.listDataValues[i]["destinationDirectorName"];
						this.listDataValues[i]["destinationNumber"] = this.listDataValues[i]["destinationDirectorPnr"];
						this.listDataValues[i]["destination"] = this.listDataValues[i]["destinationCompanyName"];
						this.listDataValues[i]["destinationNumber"] = this.listDataValues[i]["destinationCompanyNumber"];

						if (this.listDataValues[i].relation !== undefined) {
							if (this.listDataValues[i].relation !== undefined) {
								if (this.listDataValues[i].relation.length !== undefined) {
									this.listDataValues[i]["relationData"] = this.listDataValues[i].relation;
								} else {
									this.listDataValues[i]["relationData"] = [this.listDataValues[i].relation];
								}

							}
						}
					}
				}
			}
		)
	}

	formatControlType(controlType) {
		controlType = controlType.toString().split('-').join(' ');
		return controlType;
	}

	formatStatementDate(statementDate) {
		statementDate = statementDate.toString().split('/').join('-');
		return statementDate;
	}

	createNewUser() {
	
		// this.signUpService.getAllPlan().then(data => {
		//     if(data.status == 200) {
		//         for (let i = 0; i < data.results.length; i++) {
		//             if(data.results[i].cost == 0 && data.results[i].status == 1 && data.results[i].name != 'Start' && data.results[i].name != 'API Plan With Basic Access'){
		//                 this.plansArray.push(data.results[i]);
		//             }
		//         }                
		//     }
		// });
		this.userTypeCompany = false;
		this.userTypeIndividual = false;
		this.planSelected = false;
		this.createNewUserDialog = true;
		// this.planNotSelected = false;
	}

	userType(type) {
		this.createNewUserDialog = false;
		this.signUpType = type;
		if (type == 'company') {
			this.userTypeCompany = true;
		} else if (type == 'individual') {
			this.userTypeIndividual = true;
		}
		setTimeout(() => {
			this.createNewUserDialog = true;
		}, 100);
	}

	selectPlan(planType) {

		if (this.selectedPlanName !== "" && this.selectedPlanName !== undefined) {
			this.planNotSelected = false;
			this.createNewUserDialog = false;
			this.planSelected = true;

			

			if (this.selectedPlanName == 'Enterprise' && this.selectedPlanName !== undefined) {
				if (planType == 'weekly') {

					this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( res => {
						if (res.body.status == 200) {
							this.selectedPlan = res.body['results'];
							this.getPlanDetails(this.selectedPlan);
						}
					});
					this.planSelected = true;
				} else if (planType == 'monthly') {

					this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( res => {
						if (res.body.status == 200) {
							this.selectedPlan = res.body['results'];
							this.getPlanDetails(this.selectedPlan);
						}
					});
					this.planSelected = true;
				} else if (planType == 'annualy') {
					let reqobj = {
						planId: this.subscribedPlanModal['Annually_Enterprise_Trial']
					}
					this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( res => {
						if (res.body.status == 200) {
							this.selectedPlan = res.body['results'];
							this.getPlanDetails(this.selectedPlan);
						}
					});
					this.planSelected = true;
				}
			} else if (this.selectedPlanName == 'Expand' && this.selectedPlanName !== undefined) {
				if (planType == 'weekly') {

					this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( res => {
						if (res.body.status == 200) {
							this.selectedPlan = res.body['results'];
							this.getPlanDetails(this.selectedPlan);
						}
					});
					this.planSelected = true;
				} else if (planType == 'monthly') {
					let reqobj = {
						planId: this.subscribedPlanModal['Monthly_Expand_Trial']
					}
					this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( res => {
						if (res.body.status == 200) {
							this.selectedPlan = res.body['results'];
							this.getPlanDetails(this.selectedPlan);
						}
					});
					this.planSelected = true;
				} else if (planType == 'annualy') {
					let reqobj = {
						planId: this.subscribedPlanModal['Annually_Expand_Trial']
					}
					this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( res => {
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
			}, 100);
		} else {
			this.planNotSelected = true;
		}
	}

	editCbilsSettings(cbilSettingsData) {
		this.cbilDataSetting.emit(cbilSettingsData);
	}

	editCbilsDetails(cbilData) {
		this.cbilsData.emit(cbilData);
	}

	deleteCustomerWatchRow(customerWatchData) {
		this.deleteCustomerWatchData.emit(customerWatchData)
	}

	choosePlanEvent() {
		if (this.selectedPlanName) {
			this.planNotSelected = false;
		} else {
			this.planNotSelected = true;
		}
	}

	createPlan() {
		this.planForm.reset();

		this.createNewPlanDialog = true;
		this.addPlanOrNot = true;

		this.createNewPlan.name = undefined;
		this.createNewPlan.description = undefined;
		this.createNewPlan._id = undefined;
		this.daterange = undefined;
		this.createNewPlan.cost = undefined;
		this.createNewPlan.vat = undefined;
		this.createNewPlan.duration = undefined;
		this.createNewPlan.order = undefined;
		this.createNewPlan.hits = undefined;
		this.createNewPlan.priceperhit = undefined;
		this.createNewPlan.companyReport = undefined;
		this.createNewPlan.directorReportLimit = undefined;
		this.createNewPlan.basicLimit = undefined;
		this.createNewPlan.advancedLimit = undefined;
		this.createNewPlan.landLimit = undefined;
		this.createNewPlan.corpLandLimit = undefined;
		this.createNewPlan.show = false;
		this.fieldValidate = false;
		this.featureFieldValidate = false;

		for (let i = 0; i < this.allActiveFeatures.length; i++) {
			this.allActiveFeatures[i].isChecked = false;
		}

		this.addedFeatureToCurrentPlan = [];
		this.createNewPlan.features = [];
	}

	cancelPlanDialogBox() {
		this.createNewUserDialog = false;
		this.planNotSelected = false;
		this.selectedPlanName = undefined;
	}

	onSubmitPlansForm(data: NgForm) {
		if (this.addPlanOrNot === true) {
			this.addNewPlan(data.value);
		} else {
			this.updatePlan();
		}
	}

	addNewPlan(data) {
		this.fieldValidate = true;
		if (this.validateNewPlanEntry(data)) {
			this.createNewPlan.startDate = this.daterange[0]
			this.createNewPlan.endDate = this.daterange[1]
			this.createNewPlan.features = [];

			for (let i = 0; i < this.addedFeatureToCurrentPlan.length; i++) {
				this.createNewPlan.features.push(this.addedFeatureToCurrentPlan[i]._id);
			}
			// let hit = 0;
			// let priceph = 0;
	
			// if (data.show === false) {
			// 	hit = 0;
			// 	priceph = 0;
			// } else if (data.show === true) {
			// 	hit = data.hits;
			// 	priceph = data.priceperhit;
			// }

			// let obj = {
			// 	name: data.name,
			// 	features: data.features,
			// 	description: data.description,
			// 	status: 1,
			// 	createdBy: this.userDetails?.dbID,
			// 	endDate: data.endDate,
			// 	startDate: data.startDate,
			// 	cost: data.cost,
			// 	duration: data.duration,
			// 	order: data.order,
			// 	vat: 0,
			// 	hits: hit,
			// 	priceperhit: priceph,
			// 	companyReport: data.companyReport ? data.companyReport : null,
			// 	basicLimit: data.basicLimit ? data.basicLimit : null,
			// 	advancedLimit: data.advancedLimit ? data.advancedLimit : null,
			// 	landLimit: data.landLimit ? data.landLimit : null,
			// 	corpLandLimit: data.corpLandLimit ? data.corpLandLimit : null,
			// 	companyMonitorLimit: data.companyMonitorLimit ? data.companyMonitorLimit : null,
			// 	directorMonitorLimit: data.directorMonitorLimit ? data.directorMonitorLimit : null,
			// 	directorReportLimit: data.directorReportLimit ? data.directorReportLimit : null ,
			// 	planType: data.planType
			// };
			// this.globalServiceCommnunicate.globalServerRequestCall('post', 'DG_FEATURES', '', obj).subscribe(res => {
			this.userManagementService.addNewPlan(this.createNewPlan).subscribe(
				data => {
					if (data.body['status'] === 200) {
						this.fieldValidate = false;
						this.getAllPlans();
						this.createNewPlanDialog = false;
						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: 'Plan created successfully' });
						setTimeout(() => {
							this.msgs = [];
						}, 4000);

					} else if (data.body['status'] === 201) {
						this.msgs = [];
						this.msgs.push({ severity: 'error', summary: "Plan with this name already exists. Please provide a different name!" });
						setTimeout(() => {
							this.msgs = [];
						}, 6000);
						this.createNewPlanDialog = false;
						this.fieldValidate = false;
					}
				},
				error => console.log(error)
			);
		} else {
			this.showErrorMessage();
		}
	}

	updatePlan() {
		this.fieldValidate = true;
		if (this.validateNewPlanEntry(this.createNewPlan)) {
			this.createNewPlan.startDate = this.formatDate(this.daterange[0])
			this.createNewPlan.endDate = this.formatDate(this.daterange[1])
			//   this.createNewPlan.features = [];
			for (let i = 0; i < this.addedFeatureToCurrentPlan.length; i++) {
				this.createNewPlan.features.push(this.addedFeatureToCurrentPlan[i]._id);
			}


			// this.globalServiceCommnunicate.globalServerRequestCall('post', 'DG_FEATURES', 'data._id', obj).subscribe(
			// 	res => {
			this.userManagementService.updatePlan(this.createNewPlan).subscribe(
				data => {
					// let data = res.body;
					if (data.status === 200 && data.body["results"]["nModified"] === 1) {
						this.getAllPlans();
						this.createNewPlanDialog = false;
						this.fieldValidate = false;
						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: "Plan details updated successfully" });
						setTimeout(() => {
							this.msgs = [];
						}, 6000);
					} else if (data.body["status"] === 201) {
						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: "Plan not found" });
						setTimeout(() => {
							this.msgs = [];
						}, 6000);
						this.createNewPlanDialog = false;
					}
				},
				error => console.log(error)
			);
		} else {
			this.showErrorMessage();
		}
	}

	getAllPlans() {
		this.globalServiceCommnunicate.globalServerRequestCall('get', 'DG_FEATURES', 'all').subscribe( res => {
			this.listDataValues = res.body['results'];
		});
	}

	getAllActiveFeatures() {
		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'featuresApi', 'activeFeatures' ).subscribe( res => {
				this.allActiveFeatures = res.body['results'];
				let obj: any = [];
				obj = res.body;
				for (let i = 0; i < obj.length; i++) obj[i].isChecked = false;
			},
			error => console.log(error)
		);
	}

	updatePlanOpenModal(item) {
		this.addPlanOrNot = false;
		this.fieldValidate = false;
		this.featureFieldValidate = false;
		this.createNewPlanDialog = true;
		this.createNewPlan.name = item.name;
		this.createNewPlan.description = item.description;
		this.createNewPlan._id = item._id;
		this.createNewPlan.cost = item.cost;
		this.createNewPlan.vat = item.vat;
		this.createNewPlan.order = item.order;
		this.createNewPlan.duration = item.duration;
		this.createNewPlan.companyReport = item.companyReport;
		this.createNewPlan.creditReportLimit = item.creditReportLimit;
		this.createNewPlan.titleRegisterHitLimit = item.titleRegisterHitLimit;
		this.createNewPlan.pepAndSanctionHitLimit = item.pepAndSanctionHitLimit;
		this.createNewPlan.companyMonitorLimit = item.companyMonitorLimit;
		this.createNewPlan.directorMonitorLimit = item.directorMonitorLimit;
		this.createNewPlan.directorReportLimit = item.directorReportLimit;
		this.createNewPlan.contactInformationLimit = item.contactInformationLimit;
		this.createNewPlan.basicLimit = item.basicLimit;
		this.createNewPlan.advancedLimit = item.advancedLimit;
		this.createNewPlan.landLimit = item.landLimit;
		this.createNewPlan.corpLandLimit = item.corpLandLimit;
		this.addedFeatureToCurrentPlan = [];
		this.createNewPlan.features = item.features;
		this.createNewPlan.planType = item.planType;
		this.manageCurrentFeatures(item);

		if (item.hits === 0 || item.hits === undefined) {
			this.createNewPlan.hits = undefined;
			this.createNewPlan.show = false;
		} else if (item.hits > 0) {
			this.createNewPlan.show = true;
			this.createNewPlan.hits = item.hits;
		}

		if (item.priceperhit === 0 || item.priceperhit === undefined) {
			this.createNewPlan.priceperhit = undefined;
		} else if (item.priceperhit > 0) {
			this.createNewPlan.priceperhit = item.priceperhit;
			this.createNewPlan.show = true;
		}
	}

	manageCurrentFeatures(item) {
		for (let i = 0; i < this.allActiveFeatures.length; i++) {
			this.allActiveFeatures[i].isChecked = false;
		}

		for (let i = 0; i < item.features.length; i++) {
			for (let j = 0; j < this.allActiveFeatures.length; j++) {
				if (this.allActiveFeatures[j]._id === item.features[i]) {
					this.addedFeatureToCurrentPlan.push(this.allActiveFeatures[j]);
					this.allActiveFeatures[j].isChecked = true;
					break;
				}
			}
		}

		let date1 = new Date(item.startDate);
		let date2 = new Date(item.endDate);
		this.daterange = [date1, date2];
	}

	deletePlan(planIdDeleted) {
		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['delete'],
			header: 'Delete Confirmation',
			icon: 'pi pi-info-circle',
			key: this.thisPage.toString(),
			accept: () => {

				// this.globalServiceCommnunicate.globalServerRequestCall('delete', 'DG_FEATURES', 'all').subscribe( res => {
				this.userManagementService.deletePlans(planIdDeleted).subscribe(
					() => {
						this.getAllPlans();
						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: 'Plan deleted succesfully' });
						setTimeout(() => {
							this.msgs = [];
						}, 4000);
					},
					error => {
						console.log(error);
						this.msgs = [];
						this.msgs.push({ severity: 'error', summary: 'Plan not deleted' });
						setTimeout(() => {
							this.msgs = [];
						}, 4000);
					}
				);
			}
		});
	}

	closePlansDialog() {
		this.createNewPlanDialog = false;
		this.fieldValidate = false;
		this.featureFieldValidate = false;
	}

	doSelect(event, feature) {
		if (event.target.checked === true) {
			this.addedFeatureToCurrentPlan.push(feature);
			this.featureFieldValidate = false;
		} else {
			this.removeFeature(this.addedFeatureToCurrentPlan, feature);
			this.featureFieldValidate = false;
		}
	}

	removeFeature(addedFeatureToCurrentPlan, feature) {
		for (let i = 0; i < addedFeatureToCurrentPlan.length; i++) {
			if (addedFeatureToCurrentPlan[i]._id === feature._id) {
				addedFeatureToCurrentPlan.splice(i, 1);
				break;
			}
		}
	}

	Toggle(feature) {
		if (feature.Name === "API Plan Detail") {
			if (feature.isChecked === true) {
				this.createNewPlan.show = false;
			}

			if (feature.isChecked === false) {
				this.createNewPlan.show = true;
			}
		}
	}

	onDragStart(event, data) {
		event.dataTransfer.setData("data", data);
		this.item_being_drag = data;
	}

	onDrop(event, data) {
		event.preventDefault();

		let index1: number;
		let index2: number;

		for (let i = 0; i < this.addedFeatureToCurrentPlan.length; i++) {
			if (this.addedFeatureToCurrentPlan[i]._id === this.item_being_drag._id) {
				index1 = i;
			} else if (this.addedFeatureToCurrentPlan[i]._id === data._id) {
				index2 = i;
			}
		}
		this.swapArrayElements(this.addedFeatureToCurrentPlan, index1, index2);
	}

	allowDrop(event) {
		event.preventDefault();
	}

	swapArrayElements(addedFeatureToCurrentPlan, index1, index2) {
		let temp: any = addedFeatureToCurrentPlan[index1];
		addedFeatureToCurrentPlan[index1] = addedFeatureToCurrentPlan[index2];
		addedFeatureToCurrentPlan[index2] = temp;
	}

	validateNewPlanEntry(formData) {
		if (this.createNewPlan.show === false) {
			if (
				this.createNewPlan.name &&
				this.createNewPlan.description &&
				this.createNewPlan.cost >= 0 &&
				this.createNewPlan.duration > 0 &&
				this.daterange.length === 2 &&
				this.createNewPlan.order >= 1 &&
				this.daterange[0] &&
				this.daterange[1] &&
				this.createNewPlan.planType
			) {
				this.fieldValidate = false
				return true
			}
		} else if (this.createNewPlan.show === true) {
			if (
				this.createNewPlan.name &&
				this.createNewPlan.description &&
				this.createNewPlan.cost >= 0 &&
				this.createNewPlan.duration > 0 &&
				this.daterange.length === 2 &&
				this.createNewPlan.order >= 1 &&
				this.daterange[0] &&
				this.daterange[1] &&
				this.createNewPlan.planType
			) {
				if ((this.createNewPlan.hits !== undefined || this.createNewPlan.hits > 0) && (this.createNewPlan.priceperhit !== undefined || this.createNewPlan.priceperhit > 0)) {
					this.fieldValidate = false
					return true;
				}
			}
		}
		return false;
	}

	showErrorMessage() {
		if (this.createNewPlan.duration < 1) {
			this.msgs1 = [];
			this.msgs1.push({ severity: 'error', summary: 'Duration must be atleast 1 day long!' });
			setTimeout(() => {
				this.msgs1 = [];
			}, 4000);

		} else if (this.createNewPlan.cost < 0) {
			this.msgs1 = [];
			this.msgs1.push({ severity: 'error', summary: 'Cost must be atleast 0!' });
			setTimeout(() => {
				this.msgs1 = [];
			}, 4000);

		} else if (this.createNewPlan.order <= 0) {
			this.msgs1 = [];
			this.msgs1.push({ severity: 'error', summary: 'Order must be greater than 0!' });
			setTimeout(() => {
				this.msgs1 = [];
			}, 4000);

		} else if (this.daterange && (!this.daterange[0] || !this.daterange[1])) {
			this.msgs1 = [];
			this.msgs1.push({ severity: 'error', summary: 'Plan duration must be start and end date' });
			setTimeout(() => {
				this.msgs1 = [];
			}, 4000);

		} else {
			this.msgs1 = [];
			this.featureFieldValidate = false;
			this.msgs1.push({ severity: 'error', summary: 'Please provide all required fields!' });
			setTimeout(() => {
				this.msgs1 = [];
			}, 4000);
		}
	}

	watchlistNotification(rowData) {

		if (rowData.directorPNR) {
			let obj = { id: rowData._id }
			this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'directorWatchlistNotification', obj ).subscribe( res => {
				if (res.status == 200) {
					this.updateTableDataList.emit();
				}
			});
		} else if (rowData.hasOwnProperty("changesMonitorPlus")) {
			let obj= { id: rowData._id }
			this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'monitorPlusNotification', obj).subscribe( res => {
				if (res.status == 200) {
					this.updateTableDataList.emit();
				}
			});
		} else {
			let obj= { id: rowData._id }
			this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'watchlistNotification', obj).subscribe( res => {
				if (res.status == 200) {
					this.updateTableDataList.emit();
				}
			});
		}

	}

	getCheckbox(data) {

		if (this.thisPage == "watchListPage") {
			this.obj = data._id;
		} else {
			this.obj = data.id;
		}
	}
	getSICCodeInArrayFormat(SICCode) {
		return this.commonService.getSICCodeInArrayFormat(SICCode);
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

	arraytoString(array) {
		return array.join(', ');
	}

	deleteExportListRow(exportListData: any, tableData?) {
		this.deleteExportListData.emit([exportListData, tableData]);
	}

	formatExportListCategory(rowData) {
		return rowData.replace(/_/g, " ");
	}

	// formatExporInnovateGrant(rowData) {
	// 	return rowData.replace(/[^\w\s]/g, ' ');
	// }

	pageChange(event, tableData) {
		
		this.sharedLoaderService.showLoader();

		if ( this.viewShareholdingsModal == true || this.dialogBoolean['viewImpactedCreditorsModal'] == true || this.dialogBoolean['viewHnwiShareholdingsModal'] == true || this.dialogBoolean['salePurchasePropertyDialog'] == true ) {
			let tableDomElement = tableData.el.nativeElement.children[0],
				sortIcons = tableDomElement.querySelectorAll('.p-datatable-wrapper .p-sortable-column-icon');
			this.first = event.first;
			if (event.rows !== this.rows) {
				this.selectedCompany = [];
				this.rows = event.rows;
			}

			for (let icon of sortIcons) {
				icon.classList.value = 'p-sortable-column-icon pi pi-fw pi-sort-alt';
			}
		} else {
			let tableDomElement = this.userListTable.el.nativeElement.children[0],
				sortIcons = tableDomElement.querySelectorAll('.p-datatable-wrapper .p-sortable-column-icon');

			this.first = event.first;
			
			if (event.rows !== this.rows) {
				this.selectedCompany = [];
				this.rows = event.rows;
			}

			for (let icon of sortIcons) {
				// icon.classList.value = 'p-sortable-column-icon pi pi-fw pi-sort-alt';
				icon.classList.value = 'p-icon p-sortable-column-icon';
			}
		}

		if ( [ 'exportListPage', 'userFilterListPage', 'creditPage', 'contactListPage', 'connectPlusSavedFilter' ].includes( this.thisPage ) ) {
			this.updateTableDataList.emit( event );
			this.resetTableSortState( tableData );
		}
		if(this.thisPage == 'companyListPage'){
			let obj = {
				pageName: this.savedListName,
				first: event.first,
				page: event.page,
				pageCount: event.pageCount, 
				rows: event.rows
			}
			this.updateTableDataList.emit( obj );
			this.resetTableSortState( tableData );
		}
		if ( this.thisPage == 'directorDetails' && this.tableName == 'companiesSummaryTable' ) {
			
			let obj = {
				"event": event,
				'first': event.first,
				'rows': event.rows,
				"thisPage" : "directorDetails",
				"tableName": this.tableName
			}

			this.updateTableDataList.emit( obj );
			this.resetTableSortState( tableData );

		}
		if ( ['contractFinderList', 'contractFinderSavedList', 'connectPlusList', 'promptTimeline'].includes( this.thisPage)) {
			this.updateTableDataList.emit( { event: event, pageName: this.savedListName } );
			this.resetTableSortState( tableData );
		}
		
		setTimeout(() => {
			this.sharedLoaderService.hideLoader()
		}, 3000);

		if ( !['watchListPage', 'exportedEmails', 'pdfReportListPage', 'crmExportListPage', 'viewShareholdingsPage', 'hnwiPage', 'shareHolders', 'cbfExportListPage', 'notesListPage', 'directorsInfo', 'personContactInfo', 'debtorsInfoPage','iScorePortfolioListPage', 'meetMePage', 'isBuyerNonREGScreen', 'supplierPage', 'buyerPage', 'shareHolderDetails', 'showSuppliersInNoticeIdentifier', 'corporateLand' ].includes(this.thisPage) ) {
			this.resetTableSortState( tableData );
		}
		
	}

	resetTableSortState( tableData ) {
		if ( tableData ) {
			tableData._sortField = null;
			tableData._sortOrder = 1;
			tableData._multiSortMeta = null;
			tableData.tableService.onSort(null);
			tableData.value = this.initialData;
		}
	}

	customSort(event: any, tableData?, field?) {

		if(event.field == 'companyStatusHnwi'){
			event.field = 'companyStatus'
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
		arrToSort = tableVal;

		if(['userFilterListPage','dataUpdateInfo','environmentComplianceScoreTable','creditorsInfoPage','environmentComplianceScoreTable','exportListPage','companyListPage','directorDetails', 'contactListPage'].includes(this.thisPage)) {
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

			if (this.thisPage == 'watchListPage' && event.field == 'changes') {

				if (data1[event.field].length) {
					value1 = data1[event.field][0]['description'];
					value2 = data2[event.field][0]['description'];
				}

			} else if (this.thisPage == 'directorDetails' && event.field == 'internationalScoreDesc') {

				if (data1['companyInformation'] ) {
					value1 = data1['companyInformation']['internationalScoreDescription'];
					value2 = data2['companyInformation']['internationalScoreDescription'];
				}

			} else {
				value1 = data1[event.field];
				value2 = data2[event.field];
			}
			
			let result = null;

			if (value1 == null && value2 != null) {
				result = -1;
			} else if (value1 != null && value2 == null) {
				result = 1;
			} else if (value1 == null && value2 == null) {
				result = 0;
			} else if (typeof value1 === 'string' && typeof value2 === 'string') {

				if ((event.field === 'logInTime' || event.field === 'exportedOn') && value1 !== "" && value2 !== "") {


					result = (new Date(value1).getTime() < new Date(value2).getTime()) ? -1 : (new Date(value1).getTime() > new Date(value2).getTime()) ? 1 : 0;

				} else if (event.field === 'Date_Proprietor_Added' && value1 !== "" && value2 !== "") {

					value1 = value1.split('-').reverse().join('');
					value2 = value2.split('-').reverse().join('');

					result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
				} else if ( ['Change_Date', 'appointedOn', 'dateOfJoining', 'dateOfResigning'].includes(event.field) && value1 !== "" && value2 !== "" ) {

					value1 = value1.split('-').reverse().join('');
					value2 = value2.split('-').reverse().join('');

					result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

				} else if ( [ 'DATES', 'awarded_date', 'published_date', 'contract_start_date', 'contract_end_date', 'closing_date', 'companyRegistrationDate' ].includes(event.field) && value1 !== "" && value2 !== "") {

					value1 = value1.split('/').reverse().join('');
					value2 = value2.split('/').reverse().join('');

					result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

				} else if (event.field === 'actualSpendToDate') {
					value1 = value1 == "" ? 0 : parseInt(value1);
					value2 = value2 == "" ? 0 : parseInt(value2);
					result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
			    } else {
					result = value1.localeCompare(value2);
				}

			} else if (typeof value1 === 'object' && typeof value2 === 'object') {

				if (["shareHolderName", "dName", "pscName"].includes(event.field)) {
					result = (value1.name.trim() < value2.name.trim()) ? -1 : (value1.name.trim() > value2.name.trim()) ? 1 : 0;
				} else if (["tradingFlags", "persons_entitled"].includes(event.field)) {
					result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
				}
			} else if (event.field === 'date_of_birth') {
				value1 = this.commonService.changeToDate(value1);
				value2 = this.commonService.changeToDate(value2);
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
			event.data = JSON.parse(JSON.stringify(tableVal));
			tableData.value = JSON.parse(JSON.stringify(event.data));
		}

		tableData.first = this.first;
		return;

	}

	defaultSort(event: SortEvent) {		

		event.data.sort((data1, data2) => {

			let value1 = data1[event.field];
			let value2 = data2[event.field];
			let result = null;

			if ( event.field == 'shareHolderName' ) {
				value1 = data1[event.field]['name'];
				value2 = data2[event.field]['name'];
			}
		
			if (value1 == null && value2 != null) result = -1;
			else if (value1 != null && value2 == null) result = 1;
			else if (value1 == null && value2 == null) result = 0;
			else if ( event.field === 'appointedOn' ) {
				value1 = value1.split('-').reverse().join('');
				value2 = value2.split('-').reverse().join('');
				result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
			} 
			else if (typeof value1 === 'string' && typeof value2 === 'string')
				result = value1.localeCompare(value2);
			else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
		
			return event.order * result;
		});
	}

	planUpgrade() {

		let obj = new Object;
		obj["userId"] = this.userManagementRowData["_id"];
		obj["plan"] = this.selectedSubscriptionPlan["value"];
		obj["createdBy"] = this.userDetails?.dbID;
		this.userUpdateDialogBoolean = false;
		// this.listDataValuesBoolean = true;

		if (this.selectedSubscriptionPlan["value"] == this.userManagementRowData["plan"]) {

			this.msgs.push({ severity: 'warn', summary: "You are already on the same plan, please select different plan." });

			setTimeout(() => {
				this.msgs = [];
				this.sharedLoaderService.hideLoader()
			}, 3000);

		} else {
			this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_USER_API', 'userPlanUpgrade', obj).subscribe( res => {
				// this.listDataValuesBoolean = false;
				if (res.status == 200) {
					this.msgs.push({ severity: 'info', summary: "Plan Upgraded Successfully" });
					setTimeout(() => {
						this.msgs = [];
						this.getUserManagementTable();
					}, 3000);

				} else {
					this.msgs.push({ severity: 'warn', summary: "Could Not Upgrade Plan , Try Again" });
					setTimeout(() => {
						this.msgs = [];
					}, 3000);
				}
				
			});
			setTimeout(() => {
				this.sharedLoaderService.hideLoader()
			}, 1000);
		}
	}

	updateUserSuggestion(data) {
		this.updateCompanyContactData.emit(data);
		this.updateDirectorContactData.emit(data);
		this.updateIndustryTagData.emit(data);
		this.updateContactInfoData.emit(data);
	}

	rejectUserSuggestion(data) {
		this.rejectCompanyContactData.emit(data);
		this.rejectDirectorContactData.emit(data);
		this.rejectIndustryTagData.emit(data);
		this.rejectContactInfoData.emit(data);
	}

	shareSavedFlterUrlDialog( page, queryParams, rowData? ) {
		
		this.listPageNameChange( rowData?.searchType )

		this.filterId = rowData?._id
		this.selectedSearchesName = rowData?.filterName;
		this.savedFilterURL = '';
		this.shareSavedFilterUrlPage = true;
		this.customEmailOrNotdialog = true;
		this.listId = rowData?.listId;
		this.listName = rowData?.listName;
		this.listPageName = this.saveSearchListPageName;
		this.savedFilterURL = `${window.location.origin}${page}?chipData=${ encodeURIComponent( queryParams["chipData"].replace(/'/g, "%27") ) }`;
		this.routePageName = page;
	}
	
	listPageNameChange( pageName ){

		switch ( pageName ) {
			case 'Company Search' : this.saveSearchListPageName = 'companyListPage';
				break;
			case 'Charges Search': this.saveSearchListPageName = 'companyChargesListPage';
				break;
			case 'Company Trade-list' : this.saveSearchListPageName = 'tradeListPage' ;
				break;
			case 'person LinkedIn' : this.saveSearchListPageName = 'personLinkedIn' ;
				break;
			case 'people' : this.saveSearchListPageName = 'personLinkedIn' ;
				break;
			case 'company' : this.saveSearchListPageName = 'companyLinkedIn' ;
				break;
			case 'Person LinkedIn' : this.saveSearchListPageName = 'personLinkedIn' ;
				break;
			case 'Charges Description' : this.saveSearchListPageName = 'chargesDescription' ;
				break;
			case 'Company Charges-List': this.saveSearchListPageName = 'companyChargesListPage';
				break;
			default:
				this.saveSearchListPageName = 'companyListPage' ;
				break;
		}

	}

	shareSavedListFlterUrlDialog(page, queryParams, rowData? ) {

		this.listPageNameChange( rowData?.searchType )

		this.selectedSearchesName = rowData?.filterName;
		this.savedFilterURL = '';
		this.shareSavedFilterUrlPage = true;
		this.customEmailOrNotdialog = true;
		this.filterId = rowData?._id;
		this.listId = rowData?.listId;
		this.listName = rowData?.listName;
		this.listPageName = this.saveSearchListPageName;
		this.routePageName = page;
		this.savedFilterURL = `${window.location.origin}${page}?cListId=${ queryParams["cListId"]}&listPageName=${ queryParams["listPageName"] }&listName=${ queryParams["listName"]}&chipData=${encodeURIComponent(queryParams["chipData"].replace(/'/g, "%27") )}`;
	}

	shareSavedListUrlDialog( page, queryParams ) {
		this.savedFilterURL = '';
		this.shareListDialog = true;
		this.savedFilterURL = `${window.location.origin}${page}?cListId=${ queryParams["cListId"] }&cListLength=${ queryParams["cListLength"] }&listPageName=${ queryParams["listPageName"] }&listName=${ queryParams["listName"] }&showTrade=${ queryParams["showTrade"] }`;
		this.selectedSaveListName = queryParams["listName"];
	}

	goToCompanySearch( rowData ) {
		// { cListId : rowData._id, cListLength: rowData['companiesInList'], listPageName: rowData.page , listName: rowData.listName, showTrade: rowData.page == 'Company Trade-list' ? true : false  }
		let queryParam = { queryParams: { cListId : rowData._id, cListLength: rowData['companiesInList'], listPageName: rowData.page , listName: rowData.listName, reqBy: rowData.page, showTrade: rowData.page == 'Company Trade-list' ? true : false } }; 
		const url = this.router.serializeUrl(
			this.router.createUrlTree(['/company-search'], queryParam )
		);
		window.open( url, "_blank");
	}

	async shareSavedFilterUrl() {
		this.customEmailOrNotdialog = false;
		this.shareListDialog = false;
		if ( this.isLoggedIn ) {

			if ( ( ( [ this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Compliance_Plan'] ].includes( this.userDetails?.planId ) && this.userDetails?.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) ) {

				let obj: any = {};
				if( ['userFilterListPage', 'contractFinderSavedList'].includes( this.thisPage) ) {	
					obj['route'] = this.routePageName ? this.routePageName.replace('/', '') : 'company-search';
					obj['email'] = this.customEmailId;
					obj['filterId'] = this.filterId;
					obj['userID'] = this.userDetails?.dbID;
					if( this.listId ){
						obj['listId'] = this.listId;
						obj['listName'] = this.listName;
						obj['listPageName'] = this.listPageName;
					}
				} else {
					obj['url'] = this.savedFilterURL;
					obj["email"] = this.customEmailId;
					obj["filterName"] = this.selectedSearchesName;
					obj["userID"] = this.userDetails?.dbID;
					console.log(this.thisPage);
					
					if ( ['companyListPage', 'contractFinderList'].includes( this.thisPage ) ) {
						obj['listType'] = 'Saved List';
						obj['listName'] = this.selectedSaveListName;
					}
				}


				let sendMail = await this.shareSavedFilterUrlToEmail(obj);

				if (this.emailValidateBool != false) {
					this.msgs = [];
					this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['urlLinkSuccess'] });
					this.emailValidateBool = false;
				} else {
					this.msgs = [];
					this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['urlLinkSuccess'] });
				}
				setTimeout(() => {
					this.msgs = [];
					this.customEmailId = undefined;
				}, 5000);
				this.customEmailId = '';
			} else {
				this.showUpgradePlanDialog = true;
			}
		} else {
			this.showLoginDialog = true;
		}
		this.customEmail = false;
	}

	shareSavedFilterUrlToEmail(obj: any) {
		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'shareSavedFilterUrlToEmail', obj ).subscribe( res => {});
	}

	validateEmail(emailField) {

		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

		if (reg.test(emailField) == false) {
			this.emailValidateBool = false;
		} else {
			this.emailValidateBool = true;
		}
	}


	getcreditLimit(event, tableData) {

		this.hasAvailableCredit = true;

		// let obj = {
        //     userId: this.userDetails?.dbID
        // }

		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getUserExportLimit' ).subscribe( res => {
		
			this.pepAndSanctionCreditAvailable = res.body.pepAndSanctionHitLimit;
			localStorage.setItem("userDetails", JSON.stringify(res.body));

			this.sharedLoaderService.hideLoader();
			if (this.pepAndSanctionCreditAvailable > 0) {
				this.pepAndSanctionsDialog = true;
				this.showPepAndSanctionDialog = false;
				this.directorPnrNum = tableData['directorPnr'];
				this.companyNum = tableData['companyNum'];

				this.checkSanctionFormValues = {
					firstName: this.titlecasePipe.transform(tableData.detailedInformation['forename']),
					middleName: this.titlecasePipe.transform(tableData.detailedInformation['middlename']),
					lastName: this.titlecasePipe.transform(tableData.detailedInformation['surname']),
					dateOfBirth: tableData.detailedInformation['birthdDate'],
					profileName: "AML",
					street: this.titlecasePipe.transform(tableData.detailedInformation.addressLine1),
					city: this.titlecasePipe.transform(tableData.detailedInformation.addressLine3),
					postalCode: this.titlecasePipe.transform(tableData.detailedInformation.postalCode).toString().toUpperCase(),

				}
			}

			if (this.pepAndSanctionCreditAvailable == 0) {
				// this.increaseCredit();

				this.sharedLoaderService.hideLoader();
				this.pepAndSanctionsDialog = true;
				this.showPepAndSanctionDialog = false;
				this.directorPnrNum = tableData['directorPnr'];
				this.companyNum = tableData['companyNum'];

				this.checkSanctionFormValues = {
					firstName: this.titlecasePipe.transform(tableData.detailedInformation['forename']),
					middleName: this.titlecasePipe.transform(tableData.detailedInformation['middlename']),
					lastName: this.titlecasePipe.transform(tableData.detailedInformation['surname']),
					dateOfBirth: tableData.detailedInformation['birthdDate'],
					profileName: "AML",
					street: this.titlecasePipe.transform(tableData.detailedInformation.addressLine1),
					city: this.titlecasePipe.transform(tableData.detailedInformation.addressLine3),
					postalCode: this.titlecasePipe.transform(tableData.detailedInformation.postalCode).toString().toUpperCase(),

				}
			}
			this.sharedLoaderService.hideLoader();
		});
	}

	checkSanctions(tableData) {
		this.sharedLoaderService.showLoader();
		// let userid = this.userDetails?.dbID;
		let directorPnr = tableData['pnr'];

		let obj = [ directorPnr ];
		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_PEP_SANCTIONS', 'pepAndSanctionsData', obj ).subscribe( res => {
			this.sharedLoaderService.hideLoader();
			let data = res.body;
			if (data['status'] == 200) {
				this.pepAndSanctionsDialog = true;
				this.showPepSanctionDialog = true;
				this.pepAndSanctionData = data.results[0].data;
				this.directorUserId = data.results[0]['userId'];
				this.directorPnr = data.results[0]['directorPnr'];
				this.completePepAndSanction_Id = data.results[0]['_id'];

				for (let data of this.pepAndSanctionData) {
					data['country'] = data.addresses[0]['country'];
				}

			} else if (data['status'] == 201) {
				this.pepAndSanctionsDialog = false;
				this.msgs = [];
				this.msgs.push({ severity: 'warn', summary: "No data available" });

				setTimeout(() => {
					this.msgs = [];
				}, 3000);
			}
		}, () => {
			this.sharedLoaderService.hideLoader();
		});
	}

	increaseCredit() {
		this.hasAvailableCredit = false;
		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_PLANS', 'pepAndSanctionPlan' ).subscribe( res => {
			if (res.status == 200) {
				this.creditpepSanctionsPlan = res.results;
				this.creditpepSanctionsPlan.reverse();
				this.sharedLoaderService.hideLoader();
				this.pepAndSanctionsDialog = false;
				this.showPepAndSanctionDialog = true;
			} else {
				this.sharedLoaderService.hideLoader();
			}
		})
	}

	buyCredit(pepSanctionsPlan) {
		this.selectedPepSanctionPlanDetails = pepSanctionsPlan;
		this.showPepAndSanctionDialog = false;
		setTimeout(() => {
			this.showBuyCreditPepSanctionDialog = true;
		}, 100);
	}

	hideDialogBox(event) {
		if (event.status == 'success') {
			this.showBuyCreditPepSanctionDialog = false;
			let msgs = "Payment Successfull";

			let obj = {
				msgs: msgs,
				status: 'success'
			};
			this.messageCommunicator.emit(obj);
		}
		else if (event.status == 'close') {
			this.showBuyCreditPepSanctionDialog = false;
		}
	}

	pepAndSanctionHistory(tableData) {
		this.sharedLoaderService.showLoader();
		// let userid = this.userDetails?.dbID;
		let directorPnr = tableData['pnr'];
		this.pepAndSanctionDataHistory = [];
		// this.showPepSanctionDialog = true;

		let obj = [ directorPnr ];

		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_PEP_SANCTIONS', 'userAcceptedPepAndSanctions', obj ).subscribe( res => {
			let data = res.body;

			if (data['status'] == 200) {
				this.AcceptedDateArray = [];
				this.pepAndSanctionAcceptedData = data['results'][0].data;
				for (let i = 0; i < data['results'].length; i++) {
					if (i < 3) {
						this.AcceptedDateArray.push(this.datePipe.transform(data['results'][i].created, 'dd-MM-yyyy, HH:mm'));
					}
				}
			}
		});


		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_PEP_SANCTIONS', 'pepAndSanctionHistory', obj ).subscribe( res => {
			this.sharedLoaderService.hideLoader();
			let data = res.body;
			if (data['status'] == 200) {
				this.pepAndSanctionsDialog = true;
				this.pepAndSanctionHistoryView = true;
				this.createdDateArray = [];
				for (let i = 0; i < data['results'].length; i++) {
					// this.createdDateArray.push(this.commonService.formatDate(data['results'][i].created));
					this.createdDateArray.push(this.datePipe.transform(data['results'][i].created, 'dd-MM-yyyy, HH:mm'));
					this.pepAndSanctionDataHistory = data['results'][i].data;
				}
			} else {
				this.pepAndSanctionsDialog = true;
				this.pepAndSanctionHistoryView = true;
			}
		});
	}

	submitSanctionsForm(formData: NgForm) {

		// let obj = {
        //     userId: this.userDetails?.dbID
        // }

		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getUserExportLimit' ).subscribe( res => {

		// this.companyService.getUserExportLimit().then(data => {

			this.pepAndSanctionCreditAvailable = res.body['pepAndSanctionHitLimit'];

			if (this.pepAndSanctionCreditAvailable == 0) {
				this.pepAndSanctionDialog = true;
				this.pepAndSanctionsDialog = false;
			}
			else {
				this.pepAndSanctionDialog = false;

				this.sharedLoaderService.showLoader();
				// this.showPepSanctionDialog = true;
				let sanctionsFormData = formData.value;
				let userid = this.userDetails?.dbID;

				let obj: any = {

					userId: userid,
					companyNumber: this.companyNum,
					directorPnr: this.directorPnrNum,
					profileName: sanctionsFormData.profileName,
					houseName: sanctionsFormData.houseName,
					houseNo: sanctionsFormData.houseNo,
					street: sanctionsFormData.street,
					// organisation: sanctionsFormData.organisation,
					city: sanctionsFormData.city,
					postCode: sanctionsFormData.postalCode,
					countryCode: sanctionsFormData.countryCode,
					firstName: sanctionsFormData.firstName,
					middleName: sanctionsFormData.middleName,
					lastName: sanctionsFormData.lastName,
					gender: sanctionsFormData.gender,
					dateOfBirth: sanctionsFormData.dateOfBirth,
					phoneNo: sanctionsFormData.phoneNumber,
				}

				this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_PEP_SANCTIONS', 'updatePepAndSanctionsData', obj ).subscribe( res => {
					this.pepAndSanctionsDialog = false;
					this.sharedLoaderService.hideLoader();
					if (res.body['status'] == 200) {
						let obj = {
							dbID: this.userDetails?.dbID,
							pepAndSanctionCreditAvailable: this.pepAndSanctionCreditAvailable
						}
						this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_PEP_SANCTIONS', 'reducePepAndSanctionHitLimit', obj ).subscribe( res => {});
						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: "Data updated successfully" });
						setTimeout(() => {
							this.msgs = [];
						}, 2000);
					} else {
						this.msgs = [];
						this.msgs.push({ severity: 'warn', summary: "Something went wrong. Please contact admin" });
						setTimeout(() => {
							this.msgs = [];
						}, 2000);
					}

				}, () => {
					this.sharedLoaderService.hideLoader();
					this.msgs = [];
					this.msgs.push({ severity: 'warn', summary: "Something went wrong. Please contact admin" });
				});
			}
		});
	}

	cancelSanctions() {
		this.pepAndSanctionsDialog = false;
		this.showPepSanctionDialog = false;
		this.pepAndSanctionDataHistory = [];
		this.pepAndSanctionHistoryView = false;
		this.directorGenderVal = undefined;
		this.selectedData = [];
		this.sharedLoaderService.hideLoader();
		this.checkSanctionFormValues = {
			firstName: undefined,
			middleName: undefined,
			lastName: undefined,
			dateOfBirth: undefined,
			profileName: undefined,
			street: undefined,
			city: undefined,
			countryCode: undefined,
			phoneNumber: undefined,
			postalCode: undefined
		}
	}

	acceptedDataToDialog() {
		this.sharedLoaderService.showLoader();
		let accepetdData = [];

		for (let data of this.selectedData) {
			let obj = {
				data_id: data['id'],
				completePepAndSanction_id: this.completePepAndSanction_Id
			};
			accepetdData.push(obj);
		}

		let bodyObj = {
			directorPnr: this.directorPnr,
			userId: this.directorUserId,
			accepted_Data: accepetdData
		};

		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_PEP_SANCTIONS', 'acceptedPepAndSanctions', bodyObj ).subscribe( res => {
			if (res.body['status'] == 200) {
				this.pepAndSanctionsDialog = false;
				this.sharedLoaderService.hideLoader();
				this.selectedData = [];
				this.msgs = [];
				this.msgs.push({ severity: 'success', summary: "Data Saved" });

				setTimeout(() => {
					this.msgs = [];
				}, 3000);
			}
		});

	}

	addDirectorToWatchList(tableRowData) {

		if ( this.isLoggedIn ) {

			if ( this.userAuthService.hasFeaturePermission('Director Monitor') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {

				let requestObject = {
					directorsList: [],
					userId: this.userDetails?.dbID
				};

				if (tableRowData.length) {

					let checkIfAllAlreadyExistCount = 0;

					for (const directorObj of tableRowData) {
						if (!directorObj.monitorBoolean) {
							requestObject.directorsList.push(
								{
									directorPnr: directorObj.pnr,
									directorName: directorObj.directorFullName,
									companyNumber: directorObj.companyNumber,
								}
							);
						} else {
							checkIfAllAlreadyExistCount++;
						}
					}

					if (tableRowData.length == checkIfAllAlreadyExistCount) {
						this.selectedCompany = [];

						this.msgs = [];
						this.msgs.push({ severity: 'error', summary: this.constantMessages['successMessage']['directorAlreadyMonitoring'] });

						setTimeout(() => {
							this.msgs = [];
						}, 3000);

						return;
					}

				} else {
					requestObject.directorsList.push(
						{
							directorPnr: tableRowData.pnr,
							directorName: tableRowData.directorFullName,
							companyNumber: tableRowData.companyNumber,
						}
					);
				}

				this.confirmationService.confirm({
					message: this.constantMessages['confirmation']['addDirectorMonitorList'],
					header: 'Confirmation',
					icon: 'pi pi-exclaimation-triangle',
					key: this.thisPage.toString(),
					accept: () => {

						// let obj = {
						// 	userId: this.userDetails?.dbID
						// }

						this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getUserExportLimit' ).subscribe( res => {
						// this.companyService.getUserExportLimit().then(userData => {
							let userData = res.body.results[0];
							if (userData && userData.directorMonitorLimit > 0) {

								this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'saveWatchListDirectors', requestObject ).subscribe( res => {
									if (res.body.status == 200) {
										this.updateTableDataList.emit({ thisPage: this.thisPage });
										this.selectedCompany = [];

										this.msgs = [];
										this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['directorMonitorSuccess'] });

										setTimeout(() => {
											this.msgs = [];
										}, 3000);
									} else {
										this.selectedCompany = [];

										this.msgs = [];
										this.msgs.push({ severity: 'error', summary: `${res.body.message ? res.body.message : 'Something went wrong.'}` });

										setTimeout(() => {
											this.msgs = [];
										}, 3000);
									}
								});
								let directorMonitorLimit = userData.directorMonitorLimit - requestObject.directorsList.length;
								this.reduceExportLimit(directorMonitorLimit);
							} else {
								this.msgs = [];
								this.msgs.push({ severity: 'info', detail: this.constantMessages['limitDeductionMessage']['directorMonitorLimit'] });
								setTimeout(() => {
									this.msgs = [];
								}, 2000);
							}
						});
					}
				});
			} else {
				this.showUpgradePlanDialog = true;
			}


		} else {
			event.preventDefault();
			event.stopPropagation();
			this.showLoginDialog = true;
		}

	}

	removeDirectorFromWatchList(tableRowData) {

		if ( this.isLoggedIn ) {

			let requestObject = {
				directorsList: [],
				userId: this.userAuthService.getUserInfo( 'dbID' )
			};

			if (tableRowData.length) {


				let checkIfAllAlreadyExistCount = 0;

				for (const directorObj of tableRowData) {
					if (directorObj.monitorBoolean) {
						requestObject.directorsList.push(directorObj.pnr);
					} else {
						checkIfAllAlreadyExistCount++;
					}
				}

				if (tableRowData.length == checkIfAllAlreadyExistCount) {
					this.selectedCompany = [];

					this.msgs = [];
					this.msgs.push({ severity: 'error', summary: `Director${tableRowData.length > 1 ? 's' : ''} does not exist in the monitoring list.` });

					setTimeout(() => {
						this.msgs = [];
					}, 3000);

					return;
				}

			} else {
				requestObject.directorsList.push(tableRowData.pnr);
			}

			this.confirmationService.confirm({
				message: this.constantMessages['confirmation']['removeDirectorMonitorList'],
				header: 'Confirmation',
				icon: 'pi pi-exclaimation-triangle',
				key: this.thisPage.toString(),
				accept: () => {

					this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'removeFromDirectorWatchList', requestObject ).subscribe( res => {
						if (res.status == 200) {
							this.updateTableDataList.emit({ thisPage: this.thisPage });
							this.selectedCompany = [];

							this.msgs = [];
							this.msgs.push({ severity: 'success', summary: `Director${requestObject.directorsList.length > 1 ? 's have' : ' has'} been removed from the monitoring list successfully.` });

							setTimeout(() => {
								this.msgs = [];
							}, 3000);
						} else {
							this.selectedCompany = [];

							this.msgs = [];
							this.msgs.push({ severity: 'error', summary: `${res.message ? res.message : 'Something went wrong.'}` });

							setTimeout(() => {
								this.msgs = [];
							}, 3000);
						}
					});

				},
				reject: () => {

					this.selectedCompany = [];
				}
			});

		} else {
			event.preventDefault();
			event.stopPropagation();
			this.showLoginDialog = true;
		}

	}

	reduceExportLimit(newLimit) {
		let obj = {
			userId: this.userDetails?.dbID,
			thisPage: "directorMonitorLimit",
			newLimit: newLimit
		}
		this.globalServiceCommnunicate.reduceExportLimit(obj);
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

	deleteCompanyFromList() {

		for (let selectedCompany of this.selectedCompany) {
			this.companyForAddList.push(selectedCompany.companyRegistrationNumber);
		}

		var obj = {
			listId: this.activeRoute.snapshot.queryParams['cListId'],
			companies: this.companyForAddList
		};

		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['delete'],
			header: 'Delete Confirmation',
			icon: 'pi pi-info-circle',
			key: this.thisPage.toString(),
			accept: () => {
				this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_ISCORE ', 'removeIscoreCompaniesPortfolioList', obj ).subscribe( res => {
					this.msgs = [];

					if (res.body['status'] === 200) {

						this.msgs.push({ severity: 'success', summary: "Companies In List Data deleted!!" });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);

						this.resetFilters(this.userListTable);
						this.updateTableDataList.emit(true);

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

	updateSanction(e, data) {
		this.sharedLoaderService.showLoader();
		if (data?.detailedInformation?.['forename'] === '') {
			// this.hideSubmitButton =true;
			this.sharedLoaderService.hideLoader();
			this.pepAndSanctionsDialog = false;
			this.msgs = [];
			this.msgs.push({ severity: 'warn', summary: "Currently we are not updating data for company as a director" });

			setTimeout(() => {
				this.msgs = [];
			}, 3000);
		} else {
			// this.hideSubmitButton =false;
			this.getcreditLimit(e, data);
		}
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

	onTitleNumber(rowData) {

		// let obj = {
		// 	// userId: this.userDetails?.dbID
		// }

		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getUserExportLimit' ).subscribe( res => {
		// this.companyService.getUserExportLimit().then(data => {
			const data = res.body.results[0];
			
			this.hasTitleRegisterLimit = data['titleRegisterHitLimit'];
			if (this.hasTitleRegisterLimit == 0 || this.hasTitleRegisterLimit == null) {
				this.titileRegisterDialog = true;
			} else {
				this.titileRegisterDialog = false;
				let titleNumber = rowData['Title_Number'];
				let propertyDescription = rowData['Property_Address'];
				let name = rowData['Proprietor_Name_1'];


				if (titleNumber != "" || titleNumber != null || titleNumber != undefined
					&& propertyDescription != "" || propertyDescription != null || propertyDescription != undefined
					&& name != "" || name != null || name != undefined) {

					this.titleRegisterHit = "title_register_hit";

					let obj = {
						userId: this.userDetails?.dbID,
						titleNumber: titleNumber,
						propertyDescription: propertyDescription,
						name: name
					}

					this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LRM', 'officialCopyTitleKnown', obj ).subscribe( res => {
					// this.companyService.getTitleRegisterPdf(obj).then(res => {
					
						if ( res.status == 404 ) {

							this.msgs = [];
							this.msgs.push({ severity: 'info', summary: this.constantMessages['infoMessage']['noDataFound'] });
							setTimeout(() => {
								this.msgs = [];
							}, 5000);

						} else {
 
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
	
							let obj = {
								userId: this.userDetails?.dbID,
								thisPage: 'landCorporate',
								newLimit: this.hasTitleRegisterLimit - 1,
								titleRegisterHit: this.titleRegisterHit
							}
	
							this.globalServiceCommnunicate.reduceExportLimit(obj);

						}

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

	updateDirectorDataEvent(rowData) {

		const { directorLinkedin, linkedin_url, companyRegistrationNumber, companyName,companyNumber, businessName, pnr, directorPnr } = rowData;

		let directorDataObj = {
			'userId': this.userAuthService.getUserInfo('dbID'),
			"companyNumber": companyNumber || companyRegistrationNumber,
			"companyName": companyName || businessName,
			"directorPnr": pnr || directorPnr,
			"directorFirstName": rowData.firstName,
			// "middleName": rowData.detailedInformation.middlename,
			"directorLastName": rowData.lastName,
			"directorEmail": rowData.directorEmail,
			// "tel_1": rowData.tel_1,
			"directorJobTitle": rowData.directorRole,
			"linkedin_url": directorLinkedin || linkedin_url,
		}
		this.directorDataInfo.emit(directorDataObj);
	}

	deletePdfListRow(pdfReportListData) {
		this.deleteReportListData.emit(pdfReportListData);
	}

	downloadPdfFromS3(documentName) {
		if ( this.isLoggedIn ) {
			let reqObj = [ documentName ];
			this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_API', 'downloadPdfFromS3', reqObj, 'blob' ).subscribe( res => {
				var downloadURL = window.URL.createObjectURL(res);
				var link = document.createElement('a');
				link.href = downloadURL;
				link.download = documentName;
				link.click();
			});
		}
	}

	downloadExportedEmailFromS3(exportedEmailFileName) {
		if ( this.isLoggedIn ) {
			let exportedEmailFileNameTemp = [ exportedEmailFileName ];
			this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_LIST', 'exportEmailsCSVDownload', exportedEmailFileNameTemp ).subscribe( res => {
				var downloadURL = 'data:application/csv;base64,' + res.body['response'];
				var link = document.createElement('a');
				link.href = downloadURL;
				link.download = exportedEmailFileName;
				link.click();
			});
		}
	}

	viewShareholdingsData(rowData,companyNumber: any) {

		this.sharedLoaderService.showLoader();
		this.msgs = [];

		this.shareholderNShareholdingDetailsSummaryColumns = [
			{ field: 'shareHoldingCompanyName', header: 'Company Name', width: '250px', textAlign: 'left', visible: true },
			{ field: 'shareHoldingCompanyStatus', header: 'Company Status', width: '130px', textAlign: 'center', visible: true },
			{ field: 'shareType', header: 'Share Type', width: '120px', textAlign: 'left', visible: true },
			{ field: 'numberOfSharesIssued', header: 'Share Count', width: '120px', textAlign: 'right', visible: true },
			{ field: 'share_percent', header: '% of Total Share Count', width: '120px', textAlign: 'right', visible: true },
			{ field: 'value', header: 'Nominal Value', width: '100px', textAlign: 'right', visible: true },
			{ field: 'sic_code', header: 'Sic Code', width: '350px', textAlign: 'left', visible: true }
		];

		let obj = [ rowData.shareHolderName.link, companyNumber ];
		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_COMPANY_DETAILS', 'companyShareHoldings', obj ).subscribe( res => {

			if (res.body['status'] == 200) {

				this.shareholderNShareholdingDetailsSummaryData = res.body['results']['shareholdings'];

				this.shareholderNShareholdingDetailsSummaryData = this.shareholderNShareholdingDetailsSummaryData.filter(obj => obj.companyStatus !== 'dissolved' && obj.companyStatus !== 'converted/closed');

				for (let shareholdings of this.shareholderNShareholdingDetailsSummaryData) {

					if (shareholdings["companyInformation"]["businessName"]) {
						shareholdings['shareHoldingCompanyName'] = shareholdings["companyInformation"]["businessName"];
					}

					if (shareholdings['companyInformation']['companyStatus']) {
						shareholdings['shareHoldingCompanyStatus'] = shareholdings["companyInformation"]["companyStatus"];
					}

					if (shareholdings['totalShareCount'] !== undefined && shareholdings['totalShareCount'] !== null && shareholdings['totalShareCount'] > 0) {
						shareholdings["share_percent"] = ((shareholdings['numberOfSharesIssued'] * shareholdings['value']) / shareholdings['totalShareCount']) * 100;
						shareholdings["share_percent"] = parseFloat(shareholdings["share_percent"]).toFixed(2);
					} else {
						shareholdings["share_percent"] = "";
					}

					if (shareholdings.companyInformation && shareholdings.companyInformation.sicCode07) {
						shareholdings['sic_code'] = shareholdings.companyInformation.sicCode07;
					}

				}

			}

			this.viewShareholdingsModal = true;
			this.sharedLoaderService.hideLoader();

			this.changeDetection.detectChanges();
		});
    

	}

	viewHnwiShareholdingsData(pnr) {

		this.sharedLoaderService.showLoader();
		this.msgs = [];

        this.hnwiShareholdingDetailsSummaryColumns = [
            { field: 'businessName', header: 'Company Name', width: '160px', textAlign: 'left', visible: true },
            { field: 'share_percentage', header: 'Share Percentage', width: '130px', textAlign: 'center', visible: true  },
            { field: 'share_count', header: 'Share Count', width: '90px', textAlign: 'center', visible: true  },
            { field: 'turnover', header: 'Turnover', width: '90px', textAlign: 'right', visible: true  },
            { field: 'estimated_turnover', header: 'Turnover (Estimate+)', width: '220px', textAlign: 'right', visible: true  },
            { field: 'industryTagList', header: 'Industry', width: '120px', textAlign: 'left', visible: true  },
            { field: 'sic_code_description', header: 'SIC Code', width: '130px', textAlign: 'left', visible: true  },
            { field: 'companyStatusHnwi', header: 'Company Status', width: '90px', textAlign: 'center', visible: true  },
            { field: 'companyRegistrationDate', header: 'Incorporation Date', width: '150px', textAlign: 'center', visible: true  },
            { field: 'region', header: 'Region', width: '80px', textAlign: 'left', visible: true  }
        ];

		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_API', 'getHnwiShareholdingsByPnr', pnr ).subscribe( res => {

			if (res['status'] == 200) {

                this.hnwiShareholdingDetailsSummaryData = res['results'];
                
                for ( let shareholdings of this.hnwiShareholdingDetailsSummaryData ) {
							
                    if ( shareholdings.statutoryAccounts ) {
                        shareholdings['turnover'] = shareholdings.statutoryAccounts[0].turnover
                        shareholdings['estimated_turnover'] = shareholdings.statutoryAccounts[0].estimated_turnover
                    }
                    
                    if ( shareholdings.addressDetails ) {
                        shareholdings['postcode'] = shareholdings.addressDetails.postcode
                        shareholdings['region'] = shareholdings.addressDetails.region
                    }
    
                    if ( shareholdings.addressDetails ) {
                        shareholdings['postcode'] = shareholdings.addressDetails.postcode
                    }
					if( shareholdings.industryTagList ) {
						shareholdings['industryTagList'] = this.makeUpperCaseAfterCommas( shareholdings.industryTagList.toString() );
					}
					if ( shareholdings.sic_code_description ) {
						shareholdings['sic_code_description'] = this.titlecasePipe.transform( shareholdings.sic_code_description );
					}
                }

			}

			this.dialogBoolean['viewHnwiShareholdingsModal'] = true;
			this.sharedLoaderService.hideLoader();
			this.changeDetection.detectChanges();
		});

	}

	unSubscribeViewShareholdingsModal() {
		this.shareholderNShareholdingDetailsSummaryColumns = [];
		this.shareholderNShareholdingDetailsSummaryData = [];
	}

	unSubscribeViewHnwiShareholdingsModal() {
		this.hnwiShareholdingDetailsSummaryData = [];
		this.hnwiShareholdingDetailsSummaryColumns = [];
	}

	viewImpactedCreditorsData(rowData) {

		this.sharedLoaderService.showLoader();

		this.creditorsInfoDataColumn = [
			{ field: 'companyNumber', header: 'Company Number', width: '120px', textAlign: 'center' },
			{ field: 'CompanyNameOriginal', header: 'Company Name', width: '320px', textAlign: 'left' },
			{ field: 'AMT', header: 'Amount', width: '180px', textAlign: 'right' },
			{ field: 'DATES', header: 'Date', width: '120px', textAlign: 'left' }
		];

		let obj = [ rowData.companyNumber ];

		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_RISK_ASSESMENT', 'creditorsDetailInfo', obj ).subscribe( res => {
			
			if (res.body['status'] == 200) {
				this.creditorsInfoData = res.body['results'];

				let tempNumber: number = 0;
				this.creditorsInfoData.forEach(element => {
					tempNumber = tempNumber + element.AMT;
				});
				this.creditorsTotalAmount = tempNumber;

			}

			this.dialogBoolean['viewImpactedCreditorsModal'] = true;
			this.changeDetection.detectChanges();
			this.sharedLoaderService.hideLoader();
		});
		
		this.changeDetection.detectChanges();
	}

	unSubscribeViewImpactedCreditorsModal() {
		this.creditorsInfoData = [];
		this.creditorsInfoDataColumn = [];
	}


	furloughDataFormat(array) {

		if (typeof (array) === "string") {
			return array
		}
		array = array.map(str => {
			let strArray = str.split(" ")
			strArray[0] = this.decimalPipe.transform(parseFloat(strArray[0]))
			strArray[1] = this.titlecasePipe.transform(strArray[1])
			strArray[2] = this.decimalPipe.transform(parseFloat(strArray[2]))
			str = strArray.join("  ")
			return str
		})
		return array.join(", ");

	}

	getLandCorporateDataByTitleNumber(titleNumber) {

		this.sharedLoaderService.showLoader();

		this.corporateLandTitleNoHistoryDataColumn = [
			{ field: 'Proprietor_Name_1', header: 'Company Name', width: '280px', textAlign: 'left' },
			// { field: 'Title_Number', header: 'Title Number', width: '120px', textAlign: 'left' },
			{ field: 'Price_Paid', header: 'Price Paid', width: '130px', textAlign: 'right' },
			{ field: 'Property_Address', header: 'Address', width: '400px', textAlign: 'left' },
			{ field: 'Postcode', header: 'Post Code', width: '180px', textAlign: 'left' },
			{ field: 'Tenure', header: 'Tenure', width: '130px', textAlign: 'left' },
			{ field: 'Date_Proprietor_Added', header: 'Proprietor Added Date', width: '180px', textAlign: 'center' },
			{ field: 'Change_Indicator', header: 'Change Indicator', width: '180px', textAlign: 'center' },
			{ field: 'Change_Date', header: 'Changed Date', width: '180px', textAlign: 'center' }
		];

		let obj = [ titleNumber ];

		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_API', 'getLandCorporateDataByTitleNumber', obj ).subscribe( res => {

			if (res.body["status"] == 200) {
				this.titleNoHistoryData = res.body['results'].map((obj) => obj._source);
			}
				
			this.dialogBoolean['salePurchasePropertyDialog'] = true;
			this.sharedLoaderService.hideLoader();
			
		});
		this.changeDetection.detectChanges();


	}

	unSubscribeViewImpactedCreditorsModalViewTitleHistoryModal() {
		this.titleNoHistoryData = [];
		this.corporateLandTitleNoHistoryDataColumn = [];
	}

	addMoreImportantEmails() {
				
		this.inputDataForimportantEmailsList['count']++;

		if ( this.totalEmailFetchedCount ) {

			this.limit = this.toAddNewEmailsCountModel + this.totalEmailFetchedCount;
			
			this.requestLimit = this.toAddNewEmailsCountModel;		
			
			if ( this.limit > this.inputDataForimportantEmailsList['totalEmailsOnSnov'] && this.inputDataForimportantEmailsList['totalEmailsOnSnov'] > this.totalEmailFetchedCount ) {
				
				this.limit = this.totalEmailFetchedCount + ( this.inputDataForimportantEmailsList['totalEmailsOnSnov'] - this.totalEmailFetchedCount );

				this.requestLimit = this.inputDataForimportantEmailsList['totalEmailsOnSnov'] - this.totalEmailFetchedCount;
				
			}
			
		} else {
			
			this.limit = this.toAddNewEmailsCountModel + this.inputDataForimportantEmailsList['limit'];

			this.requestLimit = this.toAddNewEmailsCountModel;

			if ( this.limit > this.inputDataForimportantEmailsList['totalEmailsOnSnov'] && this.inputDataForimportantEmailsList['totalEmailsOnSnov'] > this.inputDataForimportantEmailsList['resultFound'] ) {
				
				this.limit = this.inputDataForimportantEmailsList['resultFound'] + ( this.inputDataForimportantEmailsList['totalEmailsOnSnov'] - this.inputDataForimportantEmailsList['resultFound'] );

				this.requestLimit = this.inputDataForimportantEmailsList['totalEmailsOnSnov'] - this.inputDataForimportantEmailsList['resultFound'];
				
			}
			
		}

		let obj = {
			userId: this.userDetails?.dbID,
			companyNumber: this.inputDataForimportantEmailsList['companyNumber'],
			companyName: this.inputDataForimportantEmailsList['companyName'],
			companyDomain: this.inputDataForimportantEmailsList['companyDomain'],
			type: "all",
			limit: this.limit,
			lastId: this.inputDataForimportantEmailsList['lastId'],
			count: this.inputDataForimportantEmailsList['count'],
			requestLimit: this.requestLimit,
			oldLimit: this.totalEmailFetchedCount ? this.totalEmailFetchedCount : this.inputDataForimportantEmailsList['resultFound']
		}

		if ( this.checkEmailLimit() === 'All_fetched' ) {

			this.msgs = [];
			this.msgs.push({ severity: 'info', summary: this.constantMessages['infoMessage']['allRecordFetchedMessage'] });

			setTimeout(() => {
				this.msgs = [];
			}, 3000);

			this.toAddNewEmailsCountModel = undefined;

		} else if ( this.checkEmailLimit() === 'No_Limit' ) {

			this.msgs = [];
			this.msgs.push({ severity: 'info', summary: 'Insufficient credit limit. ' + this.constantMessages['infoMessage']['upgradeLimitMessage'] });

			setTimeout(() => {
				this.msgs = [];
			}, 3000);

			this.toAddNewEmailsCountModel = undefined;

		} else if ( this.checkEmailLimit() === 'Count_Exceed' ) {

			this.msgs = [];
			this.msgs.push({ severity: 'info', summary: this.constantMessages['infoMessage']['toReduceRequestEmailCountLimit'] });

			setTimeout(() => {
				this.msgs = [];
			}, 3000);

			this.toAddNewEmailsCountModel = undefined;

		} else if ( this.checkEmailLimit() === 'Success' ) {

			this.sharedLoaderService.showLoader();
			
			this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'getEmailsFromSingleCompanyDomain', obj ).subscribe( res => {
				if ( res.body.code == 200 ) {

					this.listDataValues = [];
					
					this.addedImportantEmailsValue = JSON.parse(JSON.stringify(res.body.response['companyEmails']));
					this.addedImportantEmailsValue = this.addedImportantEmailsValue.sort( (a, b) => a.position && a.position !== '' ? -1 : 1 )

					this.listDataValues = this.addedImportantEmailsValue;
					
					this.totalEmailFetchedCount = res.body.response['resultFound'];
					
					this.emailAddress = this.userDetails?.email
					
					this.limitDeduct = res.body.response['limitDeduct'];

					this.sharedLoaderService.hideLoader();
					
					this.msgs = [];

					if ( this.limitDeduct == 0 ) {

						this.msgs.push({ severity: 'info', summary: this.limitDeduct + this.constantMessages['infoMessage']['importantEmailAllFetchedMsg'] });

					} else {

						this.msgs.push({ severity: 'info', summary: this.limitDeduct + this.constantMessages['limitDeductionMessage']['importantEmailsLimitDeductionMsg'] });

					}

					setTimeout(() => {
						this.msgs = [];
					}, 2000);

				}


			});

		}

	}

	fatchAndOtherEmail(selectedData, action?) {
		this.sharedLoaderService.showLoader();
		let payload;
		payload = {
			listID: [selectedData._id],
			userID: selectedData.userId,
			isFavourite: true,
			isOther: action == 'Fetch email' ? false : true
		}
		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_PUBLIC', 'fetchListEmail', payload ).subscribe ({
			next: ( res ) => {
				if (res.body.status == 200) {
					this.message = []
					this.message.push({ severity: 'success', summary: res.body.message});
					this.sharedLoaderService.hideLoader();
					setTimeout(() => {
						this.message = [];
					}, 4000);
				} else {
					this.sharedLoaderService.hideLoader();
					this.message = []
					this.message.push({ severity: 'error', summary: res.body.message});
					setTimeout(() => {
						this.message = [];
					}, 4000);
				}
			},
			error: ( err ) => {
				this.message = []
					this.message.push({ severity: 'error', summary: err.error.message});
					setTimeout(() => {
						this.message = [];
					}, 4000);
				console.log(err);
			}
		});
	}

	dialogBoxForImpotantEmails(selectedData, page?){
		this.sharedLoaderService.showLoader();
		this.importantFetchEmailsModal = true;
		let payload;
		if( page == 'directorsInfo') {
			const filteredData = selectedData.map(({ firstName, middleName, lastName, pnr, directorStatus }) => ({ firstName, middleName, lastName, pnr, directorStatus }));
			payload = {
				persons: filteredData,
				companyNumber: selectedData[0].companyNumber,
			};
		} 

		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'fetchAndVerifyDirectorsEmail', payload ).subscribe ({
			next: ( res ) => {
				if (res.body.status == 200) {
					this.selectedCompany = []
					this.emailData = res.body.data;
					this.sharedLoaderService.hideLoader();
				} else {
					this.sharedLoaderService.hideLoader();
					this.selectedCompany = []
					this.importantFetchEmailsModal = false;
					this.message = []
					this.message.push({ severity: 'error', summary: res.body.message});
					setTimeout(() => {
						this.message = [];
					}, 4000);
				}
			},
			error: ( err ) => {
				this.importantFetchEmailsModal = false;
				this.sharedLoaderService.hideLoader();
				this.message = []
					this.message.push({ severity: 'error', summary: err.error.message});
					setTimeout(() => {
						this.message = [];
					}, 4000);
				console.log(err);
			}
		});

		// this.globalServiceCommnunicate.globalServerRequestCall('post', route, endpoint, payload).subscribe(res => {
		// 	if (res.body.status == 200) {
		// 		this.selectedCompany = []
		// 		this.emailData = res.body.data;
		// 		this.sharedLoaderService.hideLoader();
		// 	} else {
		// 		this.sharedLoaderService.hideLoader();
		// 		this.selectedCompany = []
		// 		this.message = []
		// 		this.message.push({ severity: 'error', summary: res.body.message});
		// 		setTimeout(() => {
		// 			this.message = [];
		// 		}, 4000);
		// 	}
			
		// });
		

	}

	// dialogBoxForImpotantEmails(selectedData) {
	// 	this.sharedLoaderService.showLoader();
		
	// 	this.emailAddress = [ this.userDetails?.email ];

	// 	this.importantEmailsModal = true;

	// 	this.globalServiceCommnunicate.globalServerRequestCall('get', 'DG_LIST', 'fetchDirectorEmail', [this.compName]).subscribe(res => {

	// 		if (res.body.status == 200) {
	// 			this.emailData = res.body.data;
	// 		}
	// 		this.sharedLoaderService.hideLoader();

	// 	});

	// }

	checkEmailLimit() {
		
		let actualLimit = this.creditLimitForEmailSpotter;
		let requestLimit = this.toAddNewEmailsCountModel / 10;
		let totalEmailsCount = this.searchTotalCount;

		if ( totalEmailsCount >= this.limit ) {
			if ( actualLimit >= requestLimit ) {
				if ( this.limit <= totalEmailsCount ) {
					return 'Success';
				} else {
					return 'Count_Exceed'
				}
			} else {
				return 'No_Limit';
			}
		} else {
			return 'All_fetched';
		}

	}

    makeUpperCaseAfterCommas(str) {
		return this.titlecasePipe.transform(str).replace(/,\s*([a-z])/g, function(e) { return e.toUpperCase() });
	}

	dataFormatForTownCity( dataArray ) {
		return dataArray.toString().replace(/,/g, ', ');
	}

	formatSocialMediaLinks( route: any[] ) {
		
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

	updateDataForContactInfo( rowData ) {

		let contactInformationObj = {
			"companyNumber": this.companyNumberForContactInfo,
			"companyName": this.companyNameForContactInfo,
			"email": rowData.email,
			"position": rowData.position,
			"sourcePage": rowData.sourcePage,
			"firstName": rowData.firstName,
			"lastName": rowData.lastName,
			"contact_pnr": rowData.contact_pnr,
			"id": rowData.id,
		}

		this.showModalDialogForContact.emit(contactInformationObj);

	}

	typeOf (value) {
		return typeof value; 
	}

	showNoticeIndentifier( inputData ) {
		inputData = inputData.trim();
		this.getNoticeIndentifierData.emit( inputData );
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

	deleteEPCCertificateData(epcMappedData) {
		this.deleteEPCCertificate.emit(epcMappedData)
	}

	resetFilterFromExport( event ) {

		if ( event ) {
			this.resetFilters( event );
		}

	}

	successMessageForExport( event ) {

		if ( event ) {

			this.msgs = [];
			this.msgs.push({ severity: event.severity, summary: event.message });

			this.changeDetection.detectChanges();

			setTimeout(() => {
				this.msgs = [];
			}, 5000);

		}
		
	}

	goToStatsPage( requestID?, screenName? ) {
		
		if ( this.userAuthService.hasFeaturePermission( 'Company Stats' ) ) {

			let queryParam, pageForStats;
			// pageForStats = ['Company Trade-list', 'tradeListPage'].includes( requestID?.page ) ? 'tradeListPage' : 'companyListPage';

			if ( requestID != undefined ){
				if ( requestID.listName ) {
					let chipData = [];
					chipData.push( { chip_group: 'Saved Lists', "chip_values": [ requestID.listName ] } );
					if ( requestID.page == 'investor Finder Page' || requestID.page == 'investee Finder Page' ) {
						chipData.push( { chip_group: 'Status', chip_values: ['live'] }, { chip_group: 'Preferences', chip_values: ['estimated turnover included'], preferenceOperator: [{ hasEstimatedTurnover: true }] } );
					}
					if ( requestID.page == "diversity Calculation"){
						queryParam = { queryParams: { chipData: JSON.stringify( chipData ), cListId: requestID._id, listPageName: "company Search", listName: requestID.listName } }
					} else {
						queryParam = { queryParams: { chipData: JSON.stringify( chipData ), cListId: requestID._id, listPageName: requestID.page, listName: requestID.listName } }
					}
				} else {
					queryParam = { queryParams: { cListId: requestID._id, listPageName: requestID.page } }
				}
			} else {
				queryParam = { queryParams: { listPageName : this.pageName } }
			}

			this.appliedFiltersForSavedList = [
				{
					"chip_group": "Status",
					"chip_values": [ "live" ]	
				}
			]

			if ( this.pageName == 'investeeFinderPage' ) {
				this.appliedFiltersForSavedList.push( 
					{
						chip_group: 'Investor Company Name/Number',
						chip_values: this.cmnyNumberForStats,
						investorCompanySearchAndOr: 'or'
					}
				)
				queryParam = { queryParams: { chipData:  JSON.stringify( this.appliedFiltersForSavedList ), listPageName : this.pageName } }; 
			}

			if ( this.pageName == 'hnwiPage' ) {
				this.appliedFiltersForSavedList.push( 
					{
						chip_group: 'Company Name/Number',
						chip_values: this.cmnyNumberForStats,
						companySearchAndOr: "and",
						filter_exclude: false
					}
				)
				queryParam = { queryParams: { chipData:  JSON.stringify( this.appliedFiltersForSavedList ), listPageName : this.pageName } }; 
			}

			localStorage.setItem( 'statsScreen', JSON.stringify(this.appliedFiltersForSavedList) )
			if( screenName == 'growthAnaysis' ){
				const url = this.router.serializeUrl(
					this.router.createUrlTree(['/stats-analysis/growth-analysis'], queryParam )
				);
				window.open( url, "_blank");
			} else {
				const url = this.router.serializeUrl(
					this.router.createUrlTree(['/company-search/stats-insights'], queryParam )
				);
				window.open( url, "_blank");
			}

		} else {

			this.showUpgradePlanDialog = true;

		}

	}

	goToOtherRelatedCompanies(e) {
		if( e.page == 'diversity Calculation' ){
			let queryParam = { queryParams: { cListId: e._id, listPageName: 'company Search', listName: e.listName, showStatsButton: true} }
			this.router.navigate(['/company-search/other-related-companies'], queryParam  )
		} else {
			let queryParam = { queryParams: { cListId: e._id, listPageName: e.page, listName: e.listName, showStatsButton: true} }
			this.router.navigate(['/company-search/other-related-companies'], queryParam  )
		}
		
	}

	actionOnClick(e: any, data: any, thisPage: any, menu: { toggle: (arg0: any) => void; }) {

		menu.toggle(e);

		let result = [];

		for(let item of this.actionCols){
			if(this.selectedGlobalCountry == 'uk'){
				if(data.page == 'Company Charges-List'){
					switch(item) {
						case 'Edit':
							result.push({
								label: item, 
								icon: 'pi pi-pencil',
								command: () => {
									this.showModalDialog(data, thisPage)
								}
							});
							break;
	
						case 'Delete':
							result.push({
								label: item,
								icon: 'ui-icon-delete',
								command: () => {
									this.delete(data._id, thisPage, data.page)
								}
							});
							break;
						case 'Update Tags':
							result.push({
								label: item,
								icon: 'ui-icon-edit',
								// visible: this.userAuthService.hasAddOnPermission('developerFeatures'),
								visible: this.userAuthService.hasRolePermission(['Super Admin']),
								command: () => {
									this.updateTags(data)
								}
							});
							break
					}
				} else if( ['company Search', 'investor Finder Page', 'investee Finder Page'].includes( data.page ) ){
					switch(item) {
						case 'Edit':
							result.push({
								label: item, 
								icon: 'pi pi-pencil',
								command: () => {
									this.showModalDialog(data, thisPage)
								}
							});
							break;
	
						case 'Delete':
							result.push({
								label: item,
								icon: 'ui-icon-delete',
								command: () => {
									this.delete(data._id, thisPage)
								}
							});
							break;
						case 'Fetch email':
							result.push({
								label: item,
								icon: 'ui-icon-email',
								visible: this.userAuthService.hasRolePermission(['Super Admin']),
								command: () => {
									this.dialogBoxforExportEmail(data, 'Fetch email')
								}
							});
							break;
						case 'Fetch other email':
							result.push({
								label: item,
								icon: 'ui-icon-email',
								visible: this.userAuthService.hasRolePermission(['Super Admin']),
								command: () => {
									this.dialogBoxforExportEmail(data, 'Fetch other email')
								}
							});
							break;
						// case 'Verify email':
						// 	result.push({
						// 		label: item,
						// 		icon: 'ui-icon-email',
						// 		command: () => {
						// 			this.dialogBoxforVerifyEmail(data)
						// 		}
						// 	});
						// 	break;
						case 'Add to monitor':
							result.push({
								label: item,
								icon: 'ui-icon-visibility',
								visible: ['admin', 'default'].includes( JSON.parse( localStorage.getItem('types') )[0] ),
								command: () => {
									this.saveWatchList(data)
								}
							});
							break;
						case 'Add to monitor plus':
							result.push({
								label: item,
								icon: 'ui-icon-visibility',
								visible: this.userAuthService.hasAddOnPermission('companyMonitorPlus'),
								command: () => {
									this.saveWatchListPlus(data)
								}
							});
							break;
						case 'Update Tags':
							result.push({
								label: item,
								icon: 'ui-icon-edit',
								// visible: this.userAuthService.hasAddOnPermission('developerFeatures'),
								visible: this.userAuthService.hasRolePermission(['Super Admin']),
								command: () => {
									this.updateTags(data)
								}
							});
							break;
						case 'Responsible Procurement':
							result.push({
								label: item,
								disabled: data?.companiesInList > 1000,
								icon: 'ui-icon-diversity-2',
								visible: this.userAuthService.hasAddOnPermission('developerFeatures'),
								command: () => {
									this.diversityInclusion( data)
								}

							});
							break;
					}
				} else if(data.page ==  'Person LinkedIn'){
					switch(item) {
						case 'Edit':
							result.push({
								label: item, 
								icon: 'pi pi-pencil',
								command: () => {
									this.showModalDialog(data, thisPage)
								}
							});
							break;
	
						case 'Delete':
							result.push({
								label: item,
								icon: 'ui-icon-delete',
								command: () => {
									this.delete(data._id, thisPage, data.page)
								}
							});
							break;
						case 'Update Tags':
							result.push({
								label: item,
								icon: 'ui-icon-edit',
								// visible: this.userAuthService.hasAddOnPermission('developerFeatures'),
								visible: this.userAuthService.hasRolePermission(['Super Admin']),
								command: () => {
									this.updateTags(data)
								}
							});
							break
					}
				}
				else{
					switch(item) {
						case 'Edit':
							result.push({
								label: item, 
								icon: 'pi pi-pencil',
								command: () => {
									this.showModalDialog(data, thisPage)
								}
							});
							break;
	
						case 'Delete':
							result.push({
								label: item,
								icon: 'ui-icon-delete',
								command: () => {
									this.delete(data._id, thisPage)
								}
							});
							break;
						case 'Fetch email':
							result.push({
								label: item,
								icon: 'ui-icon-email',
								visible: this.userAuthService.hasRolePermission(['Super Admin']),
								command: () => {
									this.dialogBoxforExportEmail(data, 'Fetch email')
								}
							});
							break;
						case 'Fetch other email':
							result.push({
								label: item,
								icon: 'ui-icon-email',
								visible: this.userAuthService.hasRolePermission(['Super Admin']),
								command: () => {
									this.dialogBoxforExportEmail(data, 'Fetch other email')
								}
							});
							break;
						// case 'Verify email':
						// 	result.push({
						// 		label: item,
						// 		icon: 'ui-icon-email',
						// 		command: () => {
						// 			this.dialogBoxforVerifyEmail(data)
						// 		}
						// 	});
						// 	break;
						case 'Add to monitor':
							result.push({
								label: item,
								icon: 'ui-icon-visibility',
								visible: ['admin', 'default'].includes( JSON.parse( localStorage.getItem('types') )[0] ),
								command: () => {
									this.saveWatchList(data)
								}
							});
							break;
						case 'Update Tags':
							result.push({
								label: item,
								icon: 'ui-icon-edit',
								// visible: this.userAuthService.hasAddOnPermission('developerFeatures'),
								visible: this.userAuthService.hasRolePermission(['Super Admin']),
								command: () => {
									this.updateTags(data)
								}
							});
							break;
						case 'Add to monitor plus':
							result.push({
								label: item,
								icon: 'ui-icon-visibility',
								visible: this.userAuthService.hasAddOnPermission('companyMonitorPlus'),
								command: () => {
									this.saveWatchListPlus(data)
								}
							});
							break;
							case 'Data Enrichment':
								result.push({
									label: item,
									icon: 'ui-icon-visibility',
									visible: ['connectPlusPeople'].includes( data.page ),
									command: () => {
										this.dataEnrichment(data)
									}
								});
								break;

					}
				}
			}else if(this.selectedGlobalCountry != 'uk'){
				switch(item) {
					case 'Edit':
						result.push({
							label: item, 
							icon: 'pi pi-pencil',
							command: () => {
								this.showModalDialog(data, thisPage)
							}
						});
						break;

					case 'Delete':
						result.push({
							label: item,
							icon: 'ui-icon-delete',
							command: () => {
								this.delete(data._id, thisPage, data.page)
							}
						});
						break;

					case 'Fetch email':
						result.push({
							label: item,
							icon: 'ui-icon-email',
							visible: this.userAuthService.hasRolePermission(['Super Admin']),
							command: () => {
								this.dialogBoxforExportEmail(data, 'Fetch email')
							}
						});
						break;
					case 'Fetch other email':
						result.push({
							label: item,
							icon: 'ui-icon-email',
							visible: this.userAuthService.hasRolePermission(['Super Admin']),
							command: () => {
								this.dialogBoxforExportEmail(data, 'Fetch other email')
							}
						});
						break;
				}
			}
		}

		this.items = [{
			label: 'Options & Controls', 
			items: result
		}];
	}

	saveWatchList( inputData ) {
		this.updateActionField.emit({
			name:'saveWatchList',
			userid: this.userDetails?.dbID,
			inputData: inputData,
		});
    }

	updateTags(data) {
		
		this.listPageNameChange(data.page)

		this.updateActionField.emit({
			name:'updateTags',
			userid: this.userDetails?.dbID,
			inputData: data,
			pagename: this.saveSearchListPageName
		});


		this.updatedFieldsforBulkTag.emit({ //this object is sent till Bulk-tag component via user saved list
			listId: data._id,
			listName: data.listName,
			userId: data.userId,
			pageName: this.saveSearchListPageName,
			hasDiversityCheck : false
		})

	}

	diversityInclusion( data?, page?, thisPage? ){

		this.sharedLoaderService.showLoader();

		let diversityApiObject = {
			userId : this.userDetails?.dbID,
			listId : data._id,
			pageName : data.page == 'investor Finder Page' ? 'investorFinderPage' : data.page == 'investee Finder Page' ? 'investeeFinderPage' : 'companySearch'
		}

		let payloadForDI = {
			userId : this.userDetails?.dbID,
			listId : data._id,
			pageName : data.page == 'investor Finder Page' ? 'investorFinderPage' : data.page == 'investee Finder Page' ? 'investeeFinderPage' : 'companySearch',
			listName : data.listName,
			hasDiversityCheck : true
		}
		
		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_API', 'getDiversityAndInclusion', diversityApiObject ).subscribe ({
			next: ( res ) => {
				if ( res.body.status == 200 ) {
					this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'indexCompanyByListId', payloadForDI ).subscribe(resFrom => {
						this.sharedLoaderService.hideLoader();
						this.msgForDI = []
						this.msgForDI.push({ severity: 'success', summary: resFrom.body.message });
						setTimeout(() => {
							this.msgForDI = [];
						}, 3000);
					});
				} else {
					this.sharedLoaderService.hideLoader();
					this.msgForDI = []
					this.msgForDI.push({ severity: 'error', summary: res.body.message });
					setTimeout(() => {
						this.msgForDI = [];
					}, 3000);
				}
			},
			error: ( err ) => {
				this.sharedLoaderService.hideLoader();
				console.log(err);
			}
		});
	}

	saveWatchListPlus( inputData ) {
        this.updateActionField.emit({
			name:'saveWatchListPlus',
			userid: this.userDetails?.dbID,
			inputData: inputData,
		});
	}

	changeNotification() {
		this.searchChangeNotification.emit({ pageName: this.pageName });
	}

	deleteMonitorList( inputData, pageName ) {

		if ( pageName == 'businessMonitor' ) {
			this.removeFromWatchList.emit( inputData );
		} else if ( pageName == 'businessMonitorPlus' ) {
			this.removeFromWatchListPlus.emit( inputData );
		} else if ( pageName == 'directorWatch' ) {
			this.removeDirectorFromMonitor.emit( inputData );
		}
		
	}

	getPromptResults( rowData ) {
		let url;
		url = String(this.router.createUrlTree(['prompt-ai-search'], { queryParams: { searchedPrompt: rowData['user_prompt'] } }));
		window.open( url, '_blank' );
	}

	getRawData( rowData, field ) {
		this.goToContractFinder.emit( { rowData, field } );
	}

	getNotificationStatus( rowId ){

		let notificationId = {"_id" : rowId?.['_id']}

		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'clearProcurementNotification', notificationId ).subscribe(notiFicationStatus => {
			console.log('notiFicationStatus', notiFicationStatus);
		})
	}

	contractHistory( event ) {
		
		this.noticeIdentifierNo = [ { key: 'id', value:  event } ]

		this.globalServiceCommnunicate.globalServerRequestCall('get', 'DG_GOVTENABLER_API', 'getContractHistory', undefined, undefined, this.noticeIdentifierNo).subscribe(res => {

			if (res.body['status'] == 200) {
				this.noticeIndentifierSummaryData = res.body['results'];
			}

			this.payloadForContractMonitoring = {
				"buyer_name": this.noticeIndentifierSummaryData?.['buyer_name'],
				"title": this.noticeIndentifierSummaryData?.['title'],
				"published_date": this.noticeIndentifierSummaryData?.['published_date'],
				"notice_identifier": this.noticeIndentifierSummaryData?.['notice_identifier'],
				"monitoringStatus": this.noticeIndentifierSummaryData?.['isMonitor'],
				"contractAmount": this.noticeIndentifierSummaryData?.['awarded_value'],
				"contractStatus": this.noticeIndentifierSummaryData?.['status'],
				"contractLatestUpdate": this.noticeIndentifierSummaryData?.['status'],
			}


			this.dateTimelineView = [
				{ status: 'Closing Date', date: this.noticeIndentifierSummaryData?.closing_date },
				{ status: 'Awarded Date', date: this.noticeIndentifierSummaryData?.awarded_date },
				{ status: 'Published Date', date: this.noticeIndentifierSummaryData?.published_date },
				{ status: 'Contract Start Date', date: this.noticeIndentifierSummaryData?.contract_start_date },
				{ status: 'Contract End Date', date: this.noticeIndentifierSummaryData?.contract_end_date }
			];

			this.viewNoticeIndentifierModal = true;

		});

		this.supplierDataByNoticeIndentifier();

	}

	supplierDataByNoticeIndentifier() {

		this.globalServiceCommnunicate.globalServerRequestCall('get', 'DG_GOVTENABLER_API', 'supplierDataByNoticeIndentifier', undefined, undefined, this.noticeIdentifierNo).subscribe(res => {

			if (res.body['status'] == 200) {
				this.contractFinderSuppliersDataValues = res.body['results']
			}

		});

	}
}