import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { subscribedPlan } from 'src/environments/environment';
import { SharedLoaderService } from '../../shared-loader/shared-loader.service';
import { ExportAdminRecordlistService } from './format-data-export-admin-record-list.service';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';
import { SearchCompanyService } from '../../../features-modules/search-company/search-company.service';
import { ListPageName } from '../../../features-modules/search-company/search-company.constant';

@Component({
	selector: 'dg-export-admin-record-list',
	templateUrl: './export-admin-record-list.component.html',
	styleUrls: ['./export-admin-record-list.component.scss']
})
export class ExportAdminRecordListComponent implements OnInit {

	@Input() thisPage: any;
	@Input() adminRecordListTable: any;
	@Input() listDataValues: Array<any> = [];
	@Input() appliedFilters: any = undefined;
	@Input() selectedCompany: Array<any> = undefined;
	@Input() searchTotalCount: number;
	@Input() showExportFilterBtn: any;
	@Input() hideExportToAllButn: any;
	@Input() listId: string;

	@Output() successMessage = new EventEmitter<any>();
	@Output() resetFilters = new EventEmitter<any>();
	@Output() noRecordFoundMessageForExport = new EventEmitter<any>();

	exportData: any;
	dataCount: number;
	userDetails: Partial< UserInfoType > = {};
	customEmailId: string = undefined;
	cListId: string = '';
	newLimit: number = undefined;
	arrayForMonthFilterAfter: Array<any> = [];
	exportCSVDialogMessage: string = undefined;
	exportLimitmessage: string = undefined;
	subscribedPlanModal: any = subscribedPlan;
	constantMessages: any = UserInteractionMessages;

	exportListDynamicName: string = "DG_Export_Report_";

	exportAllButton: boolean = false;
	confirmationDialog: boolean = false;
	confirmationDialogEmail: boolean = false;
	customEmail: boolean = false;
	emailValidateBool: boolean = false;
	showFullyOutstanding: boolean = true;
	exportCondition: boolean = false;
	confirmationDialogCrmExportAll: boolean = false;
	exportDialogNoLimit: boolean = false;
	confirmationDialogExportAll: boolean = false;
	customEmailOrNotdialog: boolean = false;
	showUpgradePlanDialog: boolean = false;
	currentView: string;
	selectedGlobalCountry: string = 'uk';
	// sequenceColumnForExport = [
	// 	{ field: 'director_name', header: 'Director Name' },
	// 	{ field: 'fullName', header: 'Person Name' },
	// 	// { field: 'directorName', header: 'List Of Directors' },
	// 	{ field: 'companyName', header: 'Company Name' },
	// 	{ field: 'companyRegistrationNumber', header: 'Company Number' },
	// 	{ field: 'job_title', header: 'Job Title' },
	// 	{ field: 'position', header: 'Position' },
	// 	{ field: 'email_id', header: 'Email Id' },
	// 	{ field: 'linkedin_url', header: 'LinkedIn' },
	// 	{ field: 'otherFeatures', header: 'Social Media Links' },
	// 	{ field: 'otherFeatures', header: 'Features' }
	// ]

	// sequencingColumn = [
	// 	{ field : 'director_name', header: 'Director Name'},
	// 	{ field: 'email_id', header: 'Email' },
	// 	{ field: 'linkedin_url', header: 'LinkedIn' },
	// 	{ field: 'occupation', header: 'Occupation' },
	// 	{ field: 'status', header: 'Status' },
	// 	{ field: 'appointed_date', header: 'Appointment Date' },
	// 	{ field: 'directorAge', header: 'Director Age' }, 
	// 	{ field: 'companyName', header: 'Company Name' },
	// 	{ field: 'companyRegistrationNumber', header: 'Company Number' },
	// 	{ field: 'companyLinkUrl', header: 'Bussiness URL'}
	// ]

	sequenceColumnForContactScreen = [
		{ field: 'fullName', header: 'Person Name' },
		{ field: 'job_title', header: 'Position' },
		{ field: 'email', header: 'Email Id' },
		{ field: 'otherFeatures', header: 'LinkedIn' },
		{ field: 'otherFeaturesForEmails', header: 'Roles' },
		{ field: 'companyName', header: 'Company Name' },
		{ field: 'companyRegistrationNumber', header: 'Company Number' },
		{ field: 'companyStatus', header: 'Company Status'},
		{ field: 'website', header: 'Website' },
		{ field: 'companyLinkUrl', header: 'Bussiness URL' }
	]

	constructor(
		public toTitleCasePipe: TitleCasePipe,
		public activeRoute: ActivatedRoute,
		public userAuthService: UserAuthService,
		private changeDetectionService: ChangeDetectorRef,
		private formatCSVDataForAdminRecordListService: ExportAdminRecordlistService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService,
		public searchCompanyService: SearchCompanyService,
		private toCurrencyPipe: CurrencyPipe,
	) { }

	ngOnInit() {
		this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';
		this.userDetails = this.userAuthService?.getUserInfo();

		this.searchCompanyService.$templateView.subscribe( res => {
			this.currentView = res;
		});

	}

	async exportLimitCheck(event, tableData) {

		if ( ( [this.subscribedPlanModal['Monthly_Expand'], this.subscribedPlanModal['Expand_Annual_One_Year'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Expand_Annual_Two_Year'], this.subscribedPlanModal['Expand_New_Monthly'], this.subscribedPlanModal['Monthly_Expand_Paid_Test'], this.subscribedPlanModal['Monthly_Expand_Trial'], this.subscribedPlanModal['Expand_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Expand'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Annually_Expand_Trial'], this.subscribedPlanModal['Compliance_Plan']].includes( this.userDetails?.planId ) && this.userDetails?.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
			if ( this.userAuthService.hasAddOnPermission('defaultExportFeature') ) {

				let userData: any = await this.globalServerCommunication.getUserExportLimit();

				this.exportData = tableData;
				if (tableData.selection.length === 0) {
					this.exportCondition == false;
					this.dataCount = tableData.value.length;
					// if ( ['suppliersDashboard', 'buyersDashboard', 'contractFinderPage'].includes( this.thisPage ) ) {
					// 	this.dataCount = tableData.value.filter( item => !item.companyRegistrationNumber.includes('gb') ).length;
					// } else {
					// 	this.dataCount = tableData.value.length;
					// }
				} else if (tableData.selection.length > 0) {
					if(this.thisPage == "showContactScreen"){
						this.dataCount = tableData.selection.filter( val => val.email !== '' ).length;
					}
					else{
						this.dataCount = tableData.selection.length;
					}
				}
				// showContactScreen
				if (["customerWatchPage", "showDirectorScreenPage", "investorFinderPage", "investeeFinderPage", "showChargesTablePage", "companyListOfIServiceCategoryPage", "hnwiPage", "buyersDashboard", "esgWatchPage", "suppliersDashboard", "supplierDashboard", "contractFinderPage", 'user-management', 'showTradeTablePage'].includes(this.thisPage)) {
					if (this.dataCount <= userData.advancedLimit) {
						this.exportCondition = true;
						this.newLimit = userData.advancedLimit - this.dataCount;							
					} else {
						this.exportCondition = false
					}
				}
				if ([ "showContactScreen" ].includes(this.thisPage)) {
					if (this.dataCount <= userData.emailSpotterLimit) {
						this.exportCondition = true;
						this.newLimit = userData.emailSpotterLimit - this.dataCount;
					} else {
						this.exportCondition = false
					}
				}
				if (event.srcElement.innerText == "EXPORT") {

					if (this.exportCondition) {
						if( this.selectedCompany.length ){
							this.exportLimitmessage = this.toCurrencyPipe.transform(this.selectedCompany.length, '', ' ', '1.0-0').toString() + this.constantMessages['successMessage']['exportSelectedMessage'];
						}else{
							this.exportLimitmessage = this.toCurrencyPipe.transform(this.exportData?._value.length, '', ' ', '1.0-0').toString() + this.constantMessages['successMessage']['exportSelectedMessage'];
						}
						this.confirmationDialog = true;
					} else {
						this.exportDialogNoLimit = true;
						this.exportCSVDialogMessage = this.constantMessages['infoMessage']['noExportLimitMessage'];
					}
				} else if (["EXPORT TO EMAIL", 'SEND', 'NO', 'YES'].includes(event.srcElement.innerText)) {
					if ( ( [this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Compliance_Plan'] ].includes( this.userDetails?.planId ) && this.userDetails?.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
						this.exportCSVToMail();

					} else {
						this.showUpgradePlanDialog = true;
						this.customEmailOrNotdialog = false;
						this.confirmationDialogEmail = false;
					}
				}
			}
		} else {

			this.showUpgradePlanDialog = true;
			this.customEmailOrNotdialog = false;
		}

	}

	reduceExportLimit() {  //showContactScreen
		if (["showDirectorScreenPage", "investorFinderPage", "investeeFinderPage", "showChargesTablePage", "companyListOfIServiceCategoryPage", "showContactScreen", 'hnwiPage', 'buyersDashboard', 'suppliersDashboard', 'supplierDashboard', 'contractFinderPage', 'esgWatchPage', 'user-management', 'customerWatchPage', 'showTradeTablePage'].includes(this.thisPage)) {

			let obj = {
				userId: this.userDetails?.dbID,
				thisPage: this.thisPage,
				newLimit: this.newLimit
			}
			this.globalServerCommunication.reduceExportLimit(obj);

		}

	}

	uploadCsvToS3(exportobj) {
		this.sharedLoaderService.showLoader();
		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'uploadExportedCsv', exportobj ).subscribe( res => {
			if (res.body.status == 200) {
				this.sharedLoaderService.hideLoader();
			}
		});
	}

	exportCSV() {
		this.sharedLoaderService.showLoader();
		this.confirmationDialog = false
		let filteredEmailDataForExport;
		if (!(["companySearch", "landRegistry", "landCorporate"].includes(this.thisPage))) {
			this.exportCondition = true;
		}

		if (this.exportCondition) {

			// let obj = {
			// 	userId: this.userDetails?.dbID
			// }
			this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getUserExportLimit' ).subscribe( res => {
				let userData = res.body.results[0];
				
				if ( ( userData && userData['advancedLimit'] == 0 ) || ( userData && userData['advancedLimit'] == null ) ) {

					this.exportDialogNoLimit = true;
					this.exportCSVDialogMessage = this.constantMessages['infoMessage']['noExportLimitMessage'];

				} else {

					if ( this.selectedCompany && this.selectedCompany.length && this.thisPage == 'showContactScreen' ) {

						filteredEmailDataForExport = this.selectedCompany.filter( val => val.email !== '' );

						if ( filteredEmailDataForExport.length == 0 ) {

							this.confirmationDialog = false;
							this.successMessage.emit({ severity: 'info', message: 'No email found for Export' });
							return;
							
						}

					}
					
					const  tableData = this.exportData;
					const actualCols = JSON.parse(JSON.stringify(tableData.columns));
					const actualVals = JSON.parse(JSON.stringify(tableData.value));
					let colsTemp = [], dataTemp = [], dataSelectionTemp = [], dataFilteredTemp = [];

					//This object is for upload data to s3 object.
					let exportobj = {
						tableCols: undefined,
						userID: undefined,
						pageName: undefined,
						tableData: undefined,
						fileName:  ( this.selectedGlobalCountry == 'uk' ? this.exportListDynamicName : 'DG_Export_Report_Ireland_' ) + new Date().getTime()
					};
					for (let value of tableData.value) {
						if(value.internationalScoreDescription == "very low risk"){

							value.internationalScoreDescription ="Very Low Risk" 
							
						}
						if(value.internationalScoreDescription == "moderate risk"){

							value.internationalScoreDescription ="Moderate Risk" 
							
						}
						if(value.internationalScoreDescription == "high risk"){

							value.internationalScoreDescription ="High Risk" 
							
						}
						if(value.internationalScoreDescription == "low risk"){

							value.internationalScoreDescription ="Low Risk" 
							
						}
						if(value.internationalScoreDescription == "not scored / very high Risk"){

							value.internationalScoreDescription ="Not Scored / Very High Risk" 
							
						}
						if( value.suppliersName ) {
							value.suppliersName = value.suppliersName.map(val => val.name).filter(name => name);
							
						}
						if( value.cpvCode ) {
							let cpvCodeValue = []
							for (let cpvCode of value.cpvCode ) {
								cpvCodeValue.push(cpvCode.code + '-' + cpvCode.desc);
							}
							value.cpvCode = cpvCodeValue.filter(val => val)
							
						}

					}

					tableData.value = tableData.value.filter( ( val ) =>{
						if( val.hasOwnProperty ( 'companyRegistrationNumber' ) && !val.companyRegistrationNumber.includes('gb') ||  !val.hasOwnProperty( 'companyRegistrationNumber' ) ){
							return val;
						}
					} )

					for (let col of tableData.columns) {

						if ( ![ 'edit', 'notification', 'editDetails', 'changeToClient' ].includes( col.field ) ) {
							if(col.field == "exportAmount"){
								col.header = "Export Amount (in pounds)"
							}
							if (col.field == "shareHoldings") {
								col.field = 'shareHoldingTotalCount'
							}
							if (col.field == 'lastmade') {
								col.field = 'accountsMadeUpDate';
							}
							if (col.field == "CTPS") {
								col.field = 'CTPS Registered'
							}
							if ( ( col.field == "otherFeatures" ) && (this.thisPage == 'showDirectorScreenPage') ) {
								continue;
							}
							
							if (col.field == "otherFeaturesForEmails") {
								col.header = 'Roles';
								const tabcol = tableData.columns.find(o => o.field == 'otherFeatures');
								if (!tabcol) {
									tableData.columns.push({
										header: "LinkedIn",
										field: "otherFeatures"
									})
								}
							}

							if (col.field == "otherFeatures" && col.header == "Social Links") {
								if ( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasAddOnPermission('contactInformation') ) {
									colsTemp.push(
										{header: "LinkedIn", field: "linkedin_url"}
									);
								}
									
							}
							else {
								colsTemp.push(col);
							}
						}
					}

					if ( this.thisPage !== 'user-management' ) {

						let filterCompNum = tableData.value.filter( val => { return ( val.businessName || val.companyName || val.companyRegistrationNumber || val.CompanyNameOriginal ) } );

						if(this.currentView == 'contact'){
							colsTemp.push(
								{header: "Email Id", field: "email"},
								{header: "Website", field: "website"},
							);
						}
						if ( filterCompNum.length ) {
							colsTemp.push({ field: 'companyLinkUrl', header: 'Business URL',  textAlign: 'right', width: '110px' });
						}
						

					}

					if (this.showFullyOutstanding == false) {
						colsTemp = colsTemp.filter(obj => obj.field !== 'fullySatisfiedCount')
					}

					if (this.thisPage == 'hnwiPage') {
						colsTemp = colsTemp.filter(obj => obj.field !== 'shareholdingInformation')
					}

					if (this.thisPage == 'suppliersDashboard' || this.thisPage == 'buyersDashboard') {
						colsTemp = colsTemp.filter(obj => obj.field !== 'awardStatus')

					}

					if (this.thisPage == 'contractFinderPage') {
						colsTemp = colsTemp.filter(obj => obj.field !== 'suppliers')

					}
					if( this.thisPage == 'showContactScreen' ) {
						colsTemp = this.formatSequencingForContactScreen ( colsTemp );
					}
					
					//For selected row only
					if (tableData.selection.length > 0) {
						dataSelectionTemp = this.formatCSVDataForAdminRecordListService.formatDataForCSV(colsTemp, tableData.selection, this.thisPage);
						tableData['selection'] = dataSelectionTemp;
						exportobj.tableData = tableData['selection'];
					}
					//If No filter applied on Table
					else if ( tableData.filteredValue === undefined || tableData.filteredValue === null || tableData.filteredValue === "" || tableData.filteredValue.length ) {
						dataTemp = this.formatCSVDataForAdminRecordListService.formatDataForCSV(colsTemp, tableData.value, this.thisPage);
						tableData.value = dataTemp;
						exportobj.tableData = tableData.value;
					}
					// If any type of filter applied on Table
					else {
						dataFilteredTemp = this.formatCSVDataForAdminRecordListService.formatDataForCSV(colsTemp, tableData.filteredValue, this.thisPage);
						tableData['filteredValue'] = dataFilteredTemp;
						tableData.value = dataFilteredTemp;
						exportobj.tableData = tableData['filteredValue'];
					}

					if (tableData.value !== undefined && tableData.value.length > 0) {
						tableData.columns = colsTemp;
						if (this.selectedCompany.length > 0) {
							tableData.exportCSV({ selectionOnly: true });				
						} else {
							tableData.exportCSV();
						}

						this.confirmationDialog = false;
						if (this.thisPage === "customerWatchPage") {
							exportobj.pageName = "Client_Watch_Export";
						} else {
							exportobj.pageName = "Company_Search_Export";
						}
						exportobj.tableCols = tableData['columns'];
						exportobj.userID = this.userDetails?.dbID;
						tableData.columns = actualCols;

						tableData.value = actualVals;

						tableData.reset();
					}

					this.exportData = undefined;

					this.reduceExportLimit();
					if( !tableData.value.length ){
						this.confirmationDialog = false;
						this.successMessage.emit({ severity: 'info', message: 'Non-UK Companies Cannot be Exported'});
						setTimeout(() => {
							this.resetFilters.emit( this.adminRecordListTable );
						}, 2000);

					} else {
						this.selectedCompany = [];
						this.successMessage.emit({ severity: 'success', message: this.constantMessages['successMessage']['exportSuccess'] });
	
						setTimeout(() => {
							this.uploadCsvToS3(exportobj);
						}, 800);
	
						this.changeDetectionService.detectChanges();
					}

				}
			});

		}
	}

	exportAllCSV() {

		this.searchCompanyService.$apiPayloadBody.subscribe( res => {
			this.cListId = res.listId;
		});

		if ( this.userAuthService.hasAddOnPermission('defaultExportFeature') ) {

			let userId = this.userDetails?.dbID;
			
			if ( [ 'diversityCalculation', 'customerWatchPage', 'supplierResilience' ].includes( this.thisPage )  ) {

				let obj = {
					// userId: userId
				}

				if (this.thisPage === 'supplierResilience') {
					obj['exportOrigin'] = 'supplierResiliencePage';
				}

				this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getUserExportLimit' ).subscribe( res => {
					let userData = res.body.results[0];
					let exportLimit = userData['advancedLimit'];

					if (((userData && exportLimit == 0) || (userData && exportLimit == null)) || (userData && (exportLimit < obj["count"]))) {
						this.confirmationDialogExportAll = false;
						this.exportDialogNoLimit = true;
						this.exportCSVDialogMessage = this.constantMessages['infoMessage']['noExportLimitMessage'];
					} else {
						let endpoint,route
						if( this.listId ) {
							obj['listId'] = this.listId;
						}
						if( this.thisPage == 'customerWatchPage' ) {
							endpoint = 'exportCustomerWatchAll';
							route = 'DG_CBIL'
						} else if ( this.thisPage == 'diversityCalculation' || this.thisPage == 'supplierResilience' ) {
							endpoint = 'exportAllDiversityCalculation';
							route = 'DG_LIST'
						}
						this.globalServerCommunication.globalServerRequestCall( 'post', route, endpoint, obj ).subscribe( res => {
							if (res.body.status == 200) {
								this.successMessage.emit({ severity: 'success', message: this.thisPage == 'diversityCalculation' ? this.constantMessages['successMessage']['exportAllSuccess1'] : this.constantMessages['successMessage']['exportAllcustomerWatchPageSuccess'] });
							}
							this.confirmationDialogExportAll = false;
						});
					}
				});
				this.confirmationDialogExportAll = false;
			}

			if ( [ 'showChargesTablePage', 'showTradeTablePage', 'showMortgagesChargesTablePage', 'personLinkedIn', 'companyLinkedIn', 'showDirectorScreenPage' ].includes( this.thisPage )  ) {
				let obj = {}
				let apiEndPoint
				// obj["appliedFilters"] = this.appliedFilters;
				obj["userId"] = userId;
				// obj["exportCount"] = this.searchTotalCount;
				obj["userRole"] = this.userDetails?.userRole;
				obj['listId'] = '';
				if( this.userAuthService.hasAddOnPermission('developerFeatures') ) {
					obj["exportCount"] = this.searchTotalCount > 10000 ? 10000 : this.searchTotalCount 
				} else {
					obj["exportCount"] = this.searchTotalCount > 5000 ? 5000 : this.searchTotalCount
				}
				
				if ( this.thisPage == 'showMortgagesChargesTablePage' ) {
					obj["appliedFilters"] = this.appliedFilters;
					obj['pageName'] = '';
					obj["fileName"] = "DG_Charges_Description_Export_All";
					apiEndPoint = "exportAllChargesDescription";
				} else if( this.thisPage == 'showChargesTablePage' ){
					obj["appliedFilters"] = this.appliedFilters;
					obj['pageName'] = '';
					obj["fileName"] = "DG_ABL_Export_All";
					apiEndPoint = "exportAllCharges";
				} else if( this.thisPage == 'showTradeTablePage' ){
					obj["appliedFilters"] = this.appliedFilters;
					obj['pageName'] = 'tradeListPage';
					obj["fileName"] = "DG_TRADE_Export_All";
					apiEndPoint = "exportAllTrade";
				} else if( this.thisPage == 'personLinkedIn' ){
					obj["filterData"] = this.appliedFilters;
					obj['pageName'] = this.thisPage;
					obj["fileName"] = "DG_Person_LinkedIn_Export_All";
					apiEndPoint = "exportAllLinkedInPerson";
				}  else if( this.thisPage == 'companyLinkedIn' ){
					obj["appliedFilters"] = this.appliedFilters;
					obj['pageName'] = this.thisPage;
					obj["fileName"] = "DG_Company_LinkedIn_Export_All";
					apiEndPoint = "exportAllLinkedInCompany";
				} else if( this.thisPage == 'showDirectorScreenPage' ){
					obj["appliedFilters"] = this.appliedFilters;
					obj["fileName"] = "DG_DIRECTORS_Export_All.csv";
					apiEndPoint = "exportAllDirectors";
				}

				if ( this.showFullyOutstanding === false && ['showChargesTablePage'].includes( this.thisPage ) ) {
					obj["showFullyOutstanding"] = false;
				}
				if ( ( ( [ this.subscribedPlanModal['Monthly_Expand'], this.subscribedPlanModal['Expand_Annual_One_Year'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Expand_Annual_Two_Year'], this.subscribedPlanModal['Expand_New_Monthly'], this.subscribedPlanModal['Monthly_Expand_Paid_Test'], this.subscribedPlanModal['Monthly_Expand_Trial'], this.subscribedPlanModal['Expand_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Expand'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Compliance_Plan'] ].includes( this.userDetails?.planId ) && this.userDetails?.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) ) {

					// let reqobj = {
					// 	// userId: this.userDetails?.dbID
					// }

					this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getUserExportLimit' ).subscribe( res => {
						let userData = res.body.results[0];
						let exportLimit = userData['advancedLimit'];

						if (((userData && exportLimit == 0) || (userData && exportLimit == null)) || (userData && (exportLimit < obj["exportCount"]))) {
							this.confirmationDialogExportAll = false;
							this.exportDialogNoLimit = true;
							this.exportCSVDialogMessage = this.constantMessages['infoMessage']['noExportLimitMessage'];
						} else {
							if( this.activeRoute.snapshot?.queryParams?.cListId ) {
								obj['listId'] = this.activeRoute.snapshot.queryParams.cListId
							} else if ( this.cListId ) {
								obj['listId'] = this.cListId
							}
							this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', apiEndPoint, obj ).subscribe( res => {
								if (res.body.status == 200) {
									this.successMessage.emit({ severity: 'success', message: this.constantMessages['successMessage']['exportAllSuccess1'] });
								}
								this.confirmationDialogExportAll = false;
							});
							this.confirmationDialogExportAll = false;
						}
					});
				} else {
					this.showUpgradePlanDialog = true;
				}
			}


		}

	}

	exportCrmAll() {
		this.searchCompanyService.$apiPayloadBody.subscribe( res => {
			this.cListId = res.listId;
		});
		let obj = {}
		obj["appliedFilters"] = this.appliedFilters;
		obj["userId"] = this.userDetails?.dbID;
		obj["emailId"] = this.userDetails?.email;
		obj["thisPage"] = this.thisPage;
		if (this.thisPage == "companySearch") {
			this.exportListDynamicName = "DG_CRM_Export_" + new Date().getTime();
		}
		obj["fileName"] = this.exportListDynamicName + new Date().getTime();
		obj["count"] = this.searchTotalCount;

		// this.loadingData = true;
		this.sharedLoaderService.showLoader();
 		obj["listId"] = this.cListId;
		if ( ( ( [ this.subscribedPlanModal['Monthly_Expand'], this.subscribedPlanModal['Expand_Annual_One_Year'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Expand_Annual_Two_Year'], this.subscribedPlanModal['Expand_New_Monthly'], this.subscribedPlanModal['Monthly_Expand_Paid_Test'], this.subscribedPlanModal['Monthly_Expand_Trial'], this.subscribedPlanModal['Expand_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Expand'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Compliance_Plan']].includes( this.userDetails?.planId ) && this.userDetails?.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) ) {
			// let reqobj = {
			// 	userId: this.userDetails?.dbID
			// }
			this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getUserExportLimit' ).subscribe( res => {
				let userData = res.body.results[0];
				let exportLimit = userData['advancedLimit'];

				if (((userData && exportLimit == 0) || (userData && exportLimit == null)) || (userData && (exportLimit < obj["count"]))) {
					this.exportDialogNoLimit = true;
					this.exportCSVDialogMessage = this.constantMessages['infoMessage']['noExportLimitMessage'];
				} else {
					this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'exportAllCRM', obj ).subscribe( res => {
						if (res.body.status == 200) {
							this.successMessage.emit({ severity: 'success', message: this.constantMessages['successMessage']['crmExportAllSuccess'] });
						}
						this.confirmationDialogCrmExportAll = false;
					});
				}
			});
			// this.loadingData = false;
			this.sharedLoaderService.hideLoader();
		} else {
			this.showUpgradePlanDialog = true;
		}
	}

	exportCSVToMailDialog() {
		if ( this.checkExistUser() ) {
			this.customEmailOrNotdialog = true;
		} else {
			this.showUpgradePlanDialog = true;
		}
	}

	exportAllCSVDialog() {
		this.confirmationDialogExportAll = true;
	}

	exportAllCrmDialog() {
		this.confirmationDialogCrmExportAll = true;
	}

	async exportCSVToMail() {

		let filteredEmailDataForExport;

		this.customEmailOrNotdialog = false;
		this.confirmationDialogEmail = false;

		if (!(this.thisPage === "companySearch" || this.thisPage === "landRegistry" || this.thisPage === "landCorporate")) {
			this.exportCondition = true;
		}

		if (this.exportCondition) {

			let obj: any = {};
			if (this.emailValidateBool != false) {
				obj["email"] = this.customEmailId;
			}

			if ( this.selectedCompany && this.selectedCompany.length && this.thisPage == 'showContactScreen' ) {

				filteredEmailDataForExport = this.selectedCompany.filter( val => val.email !== '' );

				if ( filteredEmailDataForExport.length == 0 ) {

					this.confirmationDialog = false;
					this.successMessage.emit({ severity: 'info', message: 'No email found for Export' });
					return;
					
				}

			}

			// let reqobj = {
			// 	userId: this.userDetails?.dbID
			// }
			this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getUserExportLimit' ).subscribe(async res => {
				let userData = res.body.results[0];
				if ( ( userData && userData['advancedLimit'] <= 0 ) || ( userData && userData['advancedLimit'] == null ) || ( this.dataCount > userData.advancedLimit ) ) {
					this.exportDialogNoLimit = true;
					this.exportCSVDialogMessage = this.constantMessages['infoMessage']['noExportLimitMessage'];
				} else {
					const tableData = this.exportData;
					const actualCols = JSON.parse(JSON.stringify(tableData.columns));
					const actualVals = JSON.parse(JSON.stringify(tableData.value));

					let tableDataActualColumn = [];

					for (let value of tableData.value) {
						if(value.internationalScoreDescription == "very low risk"){

							value.internationalScoreDescription ="Very Low Risk" 
							
						}
						if(value.internationalScoreDescription == "moderate risk"){

							value.internationalScoreDescription ="Moderate Risk" 
							
						}
						if(value.internationalScoreDescription == "high risk"){

							value.internationalScoreDescription ="High Risk" 
							
						}
						if(value.internationalScoreDescription == "low risk"){

							value.internationalScoreDescription ="Low Risk" 
							
						}
						if(value.internationalScoreDescription == "Not Scored / Very High Risk"){

							value.internationalScoreDescription ="Not Scored / Very High Risk" 
							
						}

						
						if( value.suppliersName ) {
							value.suppliersName = value.suppliersName.map(val => val.name).filter(name => name);
						}
						if( value.cpvCode ) {
							let abc = []
							for (let cpvCode of value.cpvCode ) {
								abc.push(cpvCode.code + '-' + cpvCode.desc);
							}
							value.cpvCode = abc.filter(val => val)
						}
					}

					tableData.value = tableData.value.filter( ( val ) =>{
						if( val.hasOwnProperty ( 'companyRegistrationNumber' ) && !val.companyRegistrationNumber.includes('gb') ||  !val.hasOwnProperty( 'companyRegistrationNumber' ) ){
							return val;
						}
					} )

					if(this.currentView == 'contact'){
						tableDataActualColumn.push(
							{header: "Website", field: "website"},
							{header: "Email Id", field: "email"},
							{header: "Email Status", field: "emailStatus"},
							// {header: "Position", field: "position"},
							{header: "Telephone", field: "telephone"},

						);
					}
					// if (this.thisPage == 'showDirectorScreenPage') {
					// 	tableDataActualColumn.push(
					// 		{header: "LinkedIn", field: "linkedin_url"},
					// 		{header: "Email", field: "email_id"}
					// 	);
					// }
					for (let col of tableData.columns) {

						if ( ![ 'edit', 'notification', 'editDetails', 'changeToClient', 'safealertdescription' ].includes( col.field ) )  {
							
							if(col.field == "exportAmount"){
								col.header = "Export Amount (in pounds)"
							}
							if (col.field == "shareHoldings") {
								col.field = 'shareHoldingTotalCount'
							}
							if (col.field == 'lastmade') {
								col.field = 'accountsMadeUpDate';
							}
							if ( ['personEmail','personPhone','otherFeatures','telephone','email_id','ctps'].includes(col.field) ) {
								if ( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasAddOnPermission('contactInformation') ) {
									if ( [ 'email_id' ].includes(col.field) && this.thisPage != 'showDirectorScreenPage') {
										tableDataActualColumn.push(
											{header: "LinkedIn", field: "linkedin_url"}
										);
									}
									tableDataActualColumn.push(col);
								}
								continue;
							}

							else if (col.field == "otherFeaturesForEmails") {
								col.header = 'Features';
								tableDataActualColumn.push({
									header: "Linkedin",
									field: "otherFeatures",
									textAlign: 'left',
									width: '130px'
								})
							}
							
							if ( ( col.field == "otherFeatures" ) && (this.thisPage == 'showDirectorScreenPage') ) {
								continue;
							}

							if (col.field == "otherFeatures" && col.header == "Social Links") {

								tableDataActualColumn.push(
									{ header: "LinkedIn", field: "linkedin_url" },
								);

							} 
							 else {
								tableDataActualColumn.push(col);
							}

						}
					}

					if ( this.thisPage !== 'user-management' ) {

						let filterCompNum = tableData.value.filter( val => { return ( val.businessName || val.companyName || val.companyRegistrationNumber || val.CompanyNameOriginal ) } );
	
						if ( filterCompNum.length ) {
							tableDataActualColumn.push({ field: 'companyLinkUrl', header: 'Business URL',  textAlign: 'right', width: '110px' });
						}

					}

					if (this.thisPage == 'hnwiPage') {
						tableDataActualColumn = tableDataActualColumn.filter(obj => obj.field !== 'shareholdingInformation')
					}

					if (this.thisPage == 'suppliersDashboard' || this.thisPage == 'buyersDashboard') {
						tableDataActualColumn = tableDataActualColumn.filter(obj => obj.field !== 'awardStatus')
					}

					if (this.thisPage == 'contractFinderPage') {
						tableDataActualColumn = tableDataActualColumn.filter(obj => obj.field !== 'suppliers')
					}

					// tableDataActualColumn = this.formatColumnSequencing( tableDataActualColumn );
					// tableDataActualColumn = this.formatSequencing( tableDataActualColumn );

					if( this.thisPage == 'showContactScreen' ) {
						tableDataActualColumn = this.formatSequencingForContactScreen( this.sequenceColumnForContactScreen );
					}
					
					if (this.thisPage == 'showDirectorScreenPage') {
						tableDataActualColumn = tableDataActualColumn.filter((val) => val.header !=  'Features')
					}
					obj["tableCols"] = tableDataActualColumn;
					obj["userID"] = this.userDetails?.dbID;
					if (this.thisPage === "customerWatchPage") {
						obj["pageName"] = "Client_Watch_Export";
					} else if (this.thisPage === "showDirectorScreenPage") {
						obj["pageName"] = "Company Search Export Email";
					} else if (this.thisPage === "showChargesTablePage") {
						obj["pageName"] = "DG_CHARGES_EXPORT";
					} else if (this.thisPage === 'showTradeTablePage') {
						obj["pageName"] = "DG_TRADE_EXPORT";
					} else {
						obj["pageName"] = "DG_COMPANY_EXPORT";
					}
					if(obj["pageName"] == "DG_TRADE_EXPORT"){
						obj['fileName'] = 'DG_TRADE_EXPORT';
					}
					else{

						obj['fileName'] = this.exportListDynamicName + new Date().getTime();
					}
					if (tableData._selection.length > 0) {
						obj["tableData"] = this.formatCSVDataForAdminRecordListService.formatDataForCSV(tableDataActualColumn, tableData._selection, this.thisPage);
					}
					else if ( tableData.filteredValue === undefined || tableData.filteredValue === null || tableData.filteredValue === "" || tableData.filteredValue ) {
						if (this.arrayForMonthFilterAfter.length > 0) {
							obj["tableData"] = this.formatCSVDataForAdminRecordListService.formatDataForCSV(tableDataActualColumn, this.arrayForMonthFilterAfter, this.thisPage);

						} else {
							obj["tableData"] = this.formatCSVDataForAdminRecordListService.formatDataForCSV(tableDataActualColumn, tableData._value, this.thisPage);
						}
					} else {
						obj["tableData"] = this.formatCSVDataForAdminRecordListService.formatDataForCSV(tableDataActualColumn, tableData.filteredValue, this.thisPage);
					}
					let sendMail = await this.exportToMaiL(obj);
					tableData['selection'] = []
					tableData['filteredValue'] = [];
					if (this.thisPage == 'showContactScreen') {
						for (let obj of tableData.columns) {
							if (obj.field == 'otherFeatures' && obj.header == "LinkedIn") {
								tableData.columns.pop()
							}
						}
					}

					tableData.columns = actualCols;
					tableData.value = actualVals;
					tableData.reset();

					this.selectedCompany = [];
					this.reduceExportLimit();
					
					if (this.emailValidateBool != false) {
						this.successMessage.emit({ severity: 'success', message: this.constantMessages['successMessage']['exportToMailSuccess'] });
						this.emailValidateBool = false;
					} else {
						this.successMessage.emit({ severity: 'success', message: this.constantMessages['successMessage']['exportToRegisteredMailSuccess'] });
					}
					
					this.customEmailId = '';
					setTimeout(() => {
						this.resetFilters.emit(this.adminRecordListTable);
					}, 2000 )

				}
			});

		}

	}

	validateEmail(emailField) {
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if (reg.test(emailField) == false) {
			this.emailValidateBool = false;
		} else {
			this.emailValidateBool = true;
		}
	}

	exportToEmail(event){
		if( this.selectedCompany.length ){
			this.exportLimitmessage = this.toCurrencyPipe.transform(this.selectedCompany.length, '', ' ', '1.0-0').toString() + this.constantMessages['successMessage']['exportSelectedMessage'];
		}else{
			this.exportLimitmessage = this.toCurrencyPipe.transform(event?._value.length, '', ' ', '1.0-0').toString() + this.constantMessages['successMessage']['exportSelectedMessage'];
		}
		this.customEmailOrNotdialog = false
		this.confirmationDialogEmail = true
	}

	closeDialogBox() {
		if ( this.subscribedPlanModal['Valentine_Special'].includes( this.userDetails?.planId ) ) {
			this.resetFilters.emit( this.adminRecordListTable );
		}
	}
	
	// formatColumnSequencing( tableColumn ) {

	// 	let i = 0;

	// 	for ( let index in this.sequenceColumnForExport ) {
			
	// 		for ( let column in tableColumn ) {

	// 			if ( tableColumn[ column ].header == this.sequenceColumnForExport[ index ].header ) {

	// 				tableColumn.splice( i, 0, tableColumn[ column ] );
	// 				tableColumn.splice( parseInt(column) + 1, 1 );

	// 				i ++;

	// 			}
				
	// 		}
			
	// 	}


	// 	return tableColumn;          

	// }

	// formatSequencing( tableColumn ) {

	// 	let i = 0;

	// 	for ( let index in this.sequencingColumn ) {
			
	// 		for ( let column in tableColumn ) {

	// 			if ( tableColumn[ column ].header == this.sequencingColumn[ index ].header ) {

	// 				tableColumn.splice( i, 0, tableColumn[ column ] );
	// 				tableColumn.splice( parseInt(column) + 1, 1 );

	// 				i ++;

	// 			}
				
	// 		}
			
	// 	}

	// 	return tableColumn;      

	// }

	formatSequencingForContactScreen ( tableColumn ){
		let i = 0;

		for ( let index in this.sequenceColumnForContactScreen ) {
			
			for ( let column in tableColumn ) {

				if ( tableColumn[ column ].field == this.sequenceColumnForContactScreen[ index ].field ) {

					tableColumn.splice( i, 0, tableColumn[ column ] );
					tableColumn.splice( parseInt(column) + 1, 1 );

					i ++;

				}
				
			}
			
		}

		return tableColumn; 
	}	

	checkExistUser() {

		if ( ( ( [this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Compliance_Plan'] ].includes( this.userDetails?.planId ) && this.userDetails?.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) ) {
				
			return true;

		}

		return false;
		
	}

	exportToMaiL(obj: any) {
		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'exportCsvToEmail', obj ).subscribe( res => {});
		this.customEmailId = ''
	}

}
