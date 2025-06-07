import { TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Calendar } from 'primeng/calendar';

import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';

import { subscribedPlan } from 'src/environments/environment';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';

@Component({
	selector: 'dg-update-user-details',
	templateUrl: './update-user-details.component.html',
	styleUrls: ['./update-user-details.component.scss']
})
export class UpdateUserDetailsComponent implements OnInit {

	@ViewChild('subscription_EndDate', { static: false }) private subscription_EndDate: Calendar;
	@ViewChild('companyQuickInfoPopover', { static: false }) private companyQuickInfoPopover: ElementRef;

	@Input() thisPage: string;
	@Input() listColumns: Array<any>;

	@Output() updateTableAfterPagination = new EventEmitter<any>();
	@Input() updateUserDetailsTeamFeature: boolean = undefined;
	
	title: string = '';
	description: string = '';
	selectedTeamId: string = '';
	
	userAuthDetails: Partial< UserInfoType > = {};
	quickInfoData: any;
	emailAddress: any;
	subscriptionEndDate: any;
	updateUserTableCols: any;
	// selectedSubscriptionPlan: any;
	tempUserManagementRowData1: any;
	filteredDirectorArray: any[];
	filteredCompanyNameArray: any[];

	clientTeamList: Array<{ name: string, _id: string }> = [
		{ name: '', _id: '' }
	];

	userManagementRowData: any = {
		username: undefined,
		clientAdminEmail: undefined,
		email: undefined, 
		postCode: undefined,
		landLimit: undefined,
		postalCode: undefined,
		companyReport: undefined,
		directorReportLimit: undefined,
		creditReportLimit: undefined,
		titleRegisterHitLimit: undefined,
		contactInformationLimit: undefined,
		advancedLimit: undefined,
		corpLandLimit: undefined,
		companyMonitorLimit: undefined,
		companyMonitorPlusLimit: undefined,
		directorMonitorLimit: undefined,
		api_hits: undefined,
		pepAndSanctionHitLimit: undefined,
		paidUser: undefined,
		subs_endDate: undefined,
		emailSpotterLimit: undefined,
		salesforcePushDataLimit: undefined,
		activeLicenses: undefined,
		isMultipleDeviceLogin: false,
		enterpriseReportLimit: undefined,
	};

	listDataValuesBoolean: boolean = true;
	// userUpdateSpinner: boolean = false;
	showLoginDialog: boolean = false;
	viewClientUsersModal: boolean = false;
    userDetails: any;
	isClientAdminBool: number;
	corporateUserEditView: boolean = false;

	msgs = [];
	userData: any[];

	tempUserManagementRowData: Object = {};
	clientUserListDataForModal: Object | Array<any>;

	rows: number = 50;
	page: number = 0;
	
	planNamesArray: Array<any> = [
		{ label: "Expand", value: 'Expand' },
		{ label: "Enterprise", value: 'Enterprise' }
	];

	addOnNgModel: Object = {
		
		// add-on
		defaultExportFeature: false,
		specialFilter: false,
		valuationFilter: false,
		riskFilter: false,
		crmExport: false,
		// ablFilterAddOn: false,
		industryAnalysis: false,
		internationalTradeFilter: false,
		companyMonitorPlus: false,
		emailSpotter: false,
		// accountTypeAddOn: false,
		// emailFilter: false,
		contactInformation: false,
		diversityAndInclusion: false,
		ethnicityFilter: false,
		epc: false,
		enterpriseReport: false,

		// Bussiness Intelligence Add-on
		corporateRiskLandscape: false,
		internationalTradeLandscape: false,
		lendingLandscape: false,
		investorInvesteeLandscape: false,
		hnwiLandscape: false,
		governmentEnabler: false,
		femaleFounder: false,
		ethnicDiversity: false,
		companyDescription: false,
		accountSearch: false,
		chargesDescription: false,
		propertyIntelligence: false,
		webWiget: false,
		diversityCalculation: false,
		workflow: false,
		personLinkedIn: false,
		companyLinkedIn: false,
		developerFeatures: false,
		statsComparison: false,

	}

	clientAdminChangeBoolean: boolean = false;
	teamPageContainerAccordionBoolean: boolean = false;
	existingCompany: boolean = true;
	showCompanyNameFieldSuggestion: boolean = undefined;
	fieldValidate: boolean = false;
	companyNameField: any;
	userRoleFinal: any;
	tempexportTemplate: boolean = false;
	epcData: boolean = false;
	tempEpcData: boolean = false;
	subscribedPlanModal: any = subscribedPlan;
	currentPlanForUser: string;

	constructor(
		public userAuthService: UserAuthService,
		private router: Router,
		private seoService: SeoService,
		private activatedRoute: ActivatedRoute,
		private confirmationService: ConfirmationService,
		private changeDetectionService: ChangeDetectorRef,
		public commonService: CommonServiceService,
		private titlecasePipe: TitleCasePipe,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit() {

		this.initBreadcrumbAndSeoMetaTags();
		
		// this.planChangeSection = true;
		
		this.emailAddress = this.activatedRoute.snapshot.params['emailId'];
		
		this.userAuthDetails = this.userAuthService?.getUserInfo();
		
		if ( this.userAuthService.hasRolePermission( ['Client Admin'] ) ) {
			
			this.planNamesArray = [
				{ label: "Prospecting", value: 'Expand' },
				{ label: "Sales", value: 'Enterprise' }
			];
			
		}
		
		
		document.body.addEventListener('mouseover', (event: any) => {
			if (!event.currentTarget.classList.contains('infoName')) {
				this.hideCompanyQuickInfoPopover();
			}
		});

		this.getUserDetails();

		this.updateUserTableCols = [
			{ field: 'edit', header: 'Edit', minWidth: '65px', maxWidth: '65px', textAlign: 'center' },
			{ field: 'username', header: 'Name', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'phoneNumber', header: 'Phone Number', minWidth: '120px', maxWidth: '120px', textAlign: 'right' },
			{ field: 'email', header: 'Email', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
			{ field: 'teamName', header: 'Team', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
			{ field: 'logInTime', header: 'Last Login', minWidth: '110px', maxWidth: '110px', textAlign: 'center' },
			{ field: 'changeToClient', header: 'Action', minWidth: '250px', maxWidth: '250px', textAlign: 'center' },
		];

		if ( ( this.userAuthService.hasRolePermission( ['Super Admin'] ) && this.userManagementRowData.userRole == 'Client User' ) || this.userAuthService.hasRolePermission( ['Client Admin'] ) ) {

			this.userManagementRowData['teamId'] = undefined;
			this.userManagementRowData['teamAdmin'] = false;

		}
		
	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems(
		// 	[
		// 		{ label: "Update User" }
		// 	]
		// );
		this.title = "Update User Details";
		this.description = "Update User Details";
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
	}

	getUserDetails() {
		this.sharedLoaderService.showLoader()

		let requiredEmail;

		if ( this.activatedRoute.snapshot.params.hasOwnProperty('emailId') ) {
			requiredEmail = this.activatedRoute.snapshot.params['emailId'];

		} else if ( this.activatedRoute.snapshot.params.hasOwnProperty('companyName') ) {

			requiredEmail = localStorage.getItem("clientMasterEmail");

		}

		if ( this.activatedRoute.snapshot.params.hasOwnProperty('emailId') && this.activatedRoute.snapshot.params.hasOwnProperty('companyName') ) {
			this.corporateUserEditView = true;
		} else {
			this.corporateUserEditView = false;
		}

		let obj = [ requiredEmail ];
		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'userDetailsForSingleUser', obj ).subscribe( res => {
			this.userManagementRowData = res.body['userDetails'][0];
			
			this.tempUserManagementRowData1 = JSON.parse(JSON.stringify(this.userManagementRowData));
			this.tempUserManagementRowData = JSON.parse(JSON.stringify(this.userManagementRowData));
			this.companyNameField = this.userManagementRowData.companyName;
			this.userRoleFinal = this.userManagementRowData.userRole;
			this.currentPlanForUser = this.userManagementRowData.plan;
			this.userManagementRowData.subs_endDate = res.body['userDetails'][0]['subs_endDate'] ? new Date(res.body['userDetails'][0]['subs_endDate']) : '';
			this.tempUserManagementRowData['subs_endDate'] = res.body['userDetails'][0]['subs_endDate'] ? new Date(res.body['userDetails'][0]['subs_endDate']) : '';

			// let completeAddonArray = [...this.addOnDetails, ...this.bussinessIntelligenceDetails]

			for ( let val  in this.addOnNgModel){
				this.addOnNgModel[val] = this.userManagementRowData['add_On'][val];
			}

			this.getClientUsersList( 25, 1, this.userManagementRowData.email );

			this.getClientTeamsList();
			
		})
		setTimeout(() => {
			this.selectedTeamId = this.userManagementRowData.teamId
			this.sharedLoaderService.hideLoader()
		},3000)
		this.changeDetectionService.detectChanges();
	}

	updateUserData() {

		if ( !this.userManagementRowData['email'] ) {
			
			this.msgs = [];
			this.msgs.push({ severity: 'error', summary: 'Email cannot be updated.' });

			setTimeout(() => {
				this.msgs = [];
			}, 3000);

			return;

		}

		if( !this.companyNameField && this.clientAdminChangeBoolean  == true ) {
			this.msgs = [];
			this.msgs.push({ severity: 'error', summary: 'Please enter company name!' });
			window.scrollTo({ top: 0, behavior: 'smooth' });
			setTimeout(() => {
				this.msgs = [];
			}, 3000);

			return;
		}

		if ( this.clientAdminChangeBoolean == true ) {
			
			if(this.userManagementRowData['userRole'] == 'Individual') {
				this.userManagementRowData['userRole'] = 'Client Admin Master';
			} else if (this.userManagementRowData['userRole'] == 'Client User') {
				this.userManagementRowData['userRole'] = 'Client Admin';
			} else {
				if ( this.userManagementRowData['userRole'] != 'Client Admin' ){
					this.userManagementRowData['userRole'] = 'Client User';
				}
			}

		}
		
		this.userManagementRowData.teamId = this.selectedTeamId; 

		if ( this.commonService.comparingObjects( this.userManagementRowData, this.tempUserManagementRowData1 )){
			let count = 0;
			// let completeAddonArray = [...this.addOnDetails, ...this.bussinessIntelligenceDetails]
			for ( let val  in  this.addOnNgModel){
				if ( this.addOnNgModel[val] == this.userManagementRowData['add_On'][val] ){
					count++;
					if ( count == Object.keys(this.addOnNgModel).length) {

						this.msgs = [];
		
						this.msgs.push({ severity: 'error', summary: "No Changes found to update!" });
						window.scrollTo({ top: 0, behavior: 'smooth' });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
		
					}

				} else {
					this.elseCondition();
				}
			}
		} else {
			this.elseCondition();
		}

	}

	goBack() {

		window.history.back();
	}

	showCompanyQuickInfoPopover(event, inputRowData) {

		this.quickInfoData = inputRowData['loginDevices']

		if (event.currentTarget.classList.contains('infoName')) {

			let targetElm = event.currentTarget,
				elmPositions = targetElm.getBoundingClientRect();

			setTimeout(() => {
				this.companyQuickInfoPopover.nativeElement.style.visibility = 'visible';

				let popoverElm = this.companyQuickInfoPopover.nativeElement;

				if ((elmPositions.top + elmPositions.height) > (window.innerHeight - (window.innerHeight / 2))) {

					// Assigning Top Position
					popoverElm.style.top = (elmPositions.top - popoverElm.scrollHeight + elmPositions.height) + 'px';

					// Assigning Left Position
					if (elmPositions.left > (window.innerWidth - (window.innerWidth / 5))) {
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

	getClientUsersList( pageSize: number, startAfter: number, clientAdminEmail: string) {
		let reqBody = {
			'pageSize' : pageSize ? pageSize : 25,
			'startAfter' : startAfter ? startAfter : 1,
			'clientAdminEmail': clientAdminEmail != '' ? this.userManagementRowData.email : this.userAuthDetails?.clientAdminEmail,
			'isAdmin': this.userAuthService.hasRolePermission( ['Super Admin'] ),
			'email': this.userAuthDetails?.email
		}
			this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'clientUsersList', reqBody ).subscribe( res => {
			this.userDetails = res.body;
			
			for ( let res of this.userDetails.userDetails ) {
				res[ 'logInTime' ] = res.logInTime ?  this.dateFormatter(res.logInTime) : '';
			}

			for ( let tempUserDetails of this.userDetails.userDetails ) {

				if ( tempUserDetails.userRole == "Client Admin Master" || tempUserDetails.userRole == "Client Admin" ) {
					tempUserDetails['isClientAdminCheck'] = true;
				} else {
					tempUserDetails['isClientAdminCheck'] = false;
				}
				
			}	
			this.isClientAdminBool = this.userDetails.userDetails.filter( (val: any)=> val.isClientAdminCheck ).length;	

            this.changeDetectionService.detectChanges();

        });
        
    }

	dateFormatter(inputDate){
		if ( inputDate != '' ) {
			const dateObject = new Date(inputDate);
	
			const formattedDate = new Intl.DateTimeFormat('en-GB', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			timeZone: 'UTC'
			}).format(dateObject);
			
			return formattedDate;
		} else {
			return '';
		}
	}

	getClientTeamsList() {

		let clientAdminEmail = [this.userManagementRowData.clientAdminEmail ? this.userManagementRowData.clientAdminEmail : this.userManagementRowData.email];
		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_USER_API', 'teamNamesList', clientAdminEmail ).subscribe( res => {
			if ( res.body['status'] == 200 ) {

				this.clientTeamList = res.body['results'];
				
				this.clientTeamList.unshift( { name: 'Select Team', _id: '' } );

			}

		});
	}

    getUserUpdateData( event ) {

		this.getClientUsersList( event.pageSize, event.startAfter, this.userManagementRowData.email );
		
		// To open the Teams Accordion and scroll to it
        if ( event == 'goToTeamsPageContainer' ) {

			const teamsPageContainer = document.getElementById('teamPageContainerAccordion');

			this.teamPageContainerAccordionBoolean = true;

			window.scroll( { top: teamsPageContainer.offsetTop, behavior: 'smooth' } );
			
		}

    }

	onAccordionTabClose( event ) {
		if ( event.originalEvent.target.innerText == 'Teams' ) {
			this.teamPageContainerAccordionBoolean = false;
		}
	}

	checkIfTeamSelected( event ) {

		if ( !this.userManagementRowData.teamId && this.userManagementRowData.teamAdmin ) {

			if ( event.hasOwnProperty('checked') ) {

				this.msgs = [];
				this.msgs.push({ severity: 'error', summary: 'Please select a team.' });
				
				setTimeout(() => {
					this.msgs = [];
				}, 3000);

			}
			
			setTimeout(() => {
				this.userManagementRowData.teamAdmin = false;
			}, 100);

		}

	}

	checkforCompanyNameExist(event) {

		if(this.userManagementRowData.companyName) {
			if( event.hasOwnProperty('checked') == false ) {
				
				this.showCompanyNameFieldSuggestion = false;
			}

		} else if (event.checked == true) {
			
			this.showCompanyNameFieldSuggestion = true;

		} else if (event.checked == false && this.showCompanyNameFieldSuggestion == true) {
			this.showCompanyNameFieldSuggestion = false;
		}
		
	}

	filteredCompanyName(event, from?) {
		if (event.query.length > 2) {

			let obj = {};

		if(from == 'createAccount') {
			obj = {
				companyName: event.query.toString().toLowerCase(),
				companyStatus: "live"
			};
		} else {
			obj = {
				companyName: event.query.toString().toLowerCase()
			}
		}
			this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_API', 'companyNameSuggestionsNew', obj ).subscribe( res => {
				if (res.body !== undefined) {
					if (res.body.status == 200) {
						if (res.body['results'] !== undefined) {
							if (res.body['results']['hits']['total']['value'] == 0) {
								this.filteredCompanyNameArray = [];
							} else if (res.body['results']['hits']['total']['value'] > 0) {
								this.filteredCompanyNameArray = [];
								for (let val of res.body['results']['hits']['hits']) {
									
									this.filteredCompanyNameArray.push({ companyName: this.titlecasePipe.transform(val['_source']['businessName'])  });
									
								}
							}
							this.existingCompany = true;
						} else {
							this.filteredCompanyNameArray = [];
							this.existingCompany = false;
						}
					} else {
						this.filteredCompanyNameArray = [];
						this.existingCompany = false;
					}
				} else {
					this.filteredCompanyNameArray = [];
				}
			})
		} else {
			this.filteredCompanyNameArray = [];
		}
		this.companyNameField = event.query;
	}

	onSelectCompany(event) {
		this.companyNameField = event.companyName;
	}

	elseCondition(){
		this.changeDetectionService.detectChanges();
		this.confirmationService.confirm({
			message: 'Do you want to update the user details?',
			key: 'update-user-details',
			accept: () => {

				this.sharedLoaderService.showLoader();
				let loginModelKeys = [ 'username', 'email', 'postalCode', 'teamId', 'teamAdmin', 'advancedLimit', 'corpLandLimit', 'landLimit', 'companyReport', 'directorReportLimit', 'creditReportLimit', 'titleRegisterHitLimit', 'pepAndSanctionHitLimit', 'companyMonitorLimit', 'directorMonitorLimit', 'contactInformationLimit', 'api_hits', 'paid_User', 'userRole', 'emailSpotterLimit', 'companyMonitorPlusLimit', 'activeLicenses', 'isMultipleDeviceLogin', 'enterpriseReportLimit' ];
				// if (this.selectedSubscriptionPlan && this.selectedSubscriptionPlan.name)
				// 	this.userManagementRowData.subs_name = this.selectedSubscriptionPlan.name;
				
				let obj = {};
				obj["user_id"] = this.tempUserManagementRowData["_id"];
				obj["subs_id"] = this.tempUserManagementRowData["subs_id"];
				
				obj["companyName"] = this.companyNameField;


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

				if ( this.userManagementRowData.userRole == 'Client User' ) {
					obj['case'] = 1;
				}

				let addOnObj = {

					userId: this.tempUserManagementRowData["_id"],
					defaultExportFeature: this.addOnNgModel['defaultExportFeature'],
					specialFilter: this.addOnNgModel['specialFilter'],
					valuationFilter: this.addOnNgModel['valuationFilter'],
					riskFilter: this.addOnNgModel['riskFilter'],
					contactInformation: this.addOnNgModel['contactInformation'],
					diversityAndInclusion: this.addOnNgModel['diversityAndInclusion'],
					ethnicityFilter: this.addOnNgModel['ethnicityFilter'],
					crmExport: this.addOnNgModel['crmExport'],
					industryAnalysis : this.addOnNgModel['industryAnalysis'],
					internationalTradeFilter: this.addOnNgModel['internationalTradeFilter'],
					companyMonitorPlus: this.addOnNgModel['companyMonitorPlus'],
					emailSpotter: this.addOnNgModel['emailSpotter'],
					epc: this.addOnNgModel['epc'],
					enterpriseReport: this.addOnNgModel['enterpriseReport'],
					// ablFilter : this.addOnNgModel['ablFilterAddOn'],
					// accountType: this.addOnNgModel['accountTypeAddOn'],
					// emailFilter: this.addOnNgModel['emailFilter'],

					// Business Intelligence Add-Ons ( Landscape )					
					propertyIntelligence: this.addOnNgModel['propertyIntelligence'],
					corporateRiskLandscape: this.addOnNgModel['corporateRiskLandscape'],
					internationalTradeLandscape: this.addOnNgModel['internationalTradeLandscape'],
					lendingLandscape: this.addOnNgModel['lendingLandscape'],
					investorInvesteeLandscape: this.addOnNgModel['investorInvesteeLandscape'],
					hnwiLandscape: this.addOnNgModel['hnwiLandscape'],
					governmentEnabler: this.addOnNgModel['governmentEnabler'],
					femaleFounder: this.addOnNgModel['femaleFounder'],
					ethnicDiversity: this.addOnNgModel['ethnicDiversity'],
					accountSearch: this.addOnNgModel['accountSearch'],
					companyDescription: this.addOnNgModel['companyDescription'],
					chargesDescription: this.addOnNgModel['chargesDescription'],
					workflow: this.addOnNgModel['workflow'],
					personLinkedIn: this.addOnNgModel['personLinkedIn'],
					companyLinkedIn: this.addOnNgModel['companyLinkedIn'],
					webWiget: this.addOnNgModel['webWiget'],
					diversityCalculation: this.addOnNgModel['diversityCalculation'],
					developerFeatures: this.addOnNgModel['developerFeatures'],
					statsComparison: this.addOnNgModel['statsComparison'],
				}

				this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_USER_API', 'updateUser', obj ).subscribe( res => {

					if (res['status'] == 200) {
						this.msgs = [];
						
						if (this.userManagementRowData["paid_User"] !== this.tempUserManagementRowData["paid_User"]) {
							if (this.userManagementRowData["paid_User"] || !this.userManagementRowData["paid_User"]) {

								this.msgs.push({ severity: 'success', summary: "Paid user updated successfully!" });
								
								setTimeout(() => {
									this.msgs = [];
								}, 3000);
							}
						}
						
						//update addOnMaster service specialFilterAddOn
						// let completeAddonArray = [...this.addOnDetails, ...this.bussinessIntelligenceDetails]

						for ( let val in this.addOnNgModel){
							if ( this.addOnNgModel[val] !== this.userManagementRowData['add_On'][val] ){
								if (this.userManagementRowData["add_On"] || !this.userManagementRowData["add_On"]) {

									this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_ADDON_API', 'updateAddOnFilters', addOnObj ).subscribe( res => {
										if (res.body['status'] == 200) {
											this.msgs  = [];
											this.msgs.push({ severity: 'success', summary: "Add on updated successfully!" });
	
											this.getUserDetails();
	
											setTimeout(() => {
												this.msgs = [];
											}, 3000);
										}
	
									});
								}
								break;
							}
						}

						if ( this.userManagementRowData["advancedLimit"] !== this.tempUserManagementRowData["advancedLimit"] || this.userManagementRowData["corpLandLimit"] !== this.tempUserManagementRowData["corpLandLimit"] || this.userManagementRowData["landLimit"] !== this.tempUserManagementRowData["landLimit"] || this.userManagementRowData["companyReport"] !== this.tempUserManagementRowData["companyReport"] || this.userManagementRowData["directorReportLimit"] !== this.tempUserManagementRowData["directorReportLimit"] || this.userManagementRowData["creditReportLimit"] !== this.tempUserManagementRowData["creditReportLimit"] || this.userManagementRowData["titleRegisterHitLimit"] !== this.tempUserManagementRowData["titleRegisterHitLimit"] || this.userManagementRowData["companyMonitorLimit"] !== this.tempUserManagementRowData["companyMonitorLimit"] || this.userManagementRowData["directorMonitorLimit"] !== this.tempUserManagementRowData["directorMonitorLimit"] || this.userManagementRowData["contactInformationLimit"] !== this.tempUserManagementRowData["contactInformationLimit"] || this.userManagementRowData["api_hits"] !== this.tempUserManagementRowData["api_hits"] || this.userManagementRowData["pepAndSanctionHitLimit"] !== this.tempUserManagementRowData["pepAndSanctionHitLimit"] || this.userManagementRowData["emailSpotterLimit"] !== this.tempUserManagementRowData["emailSpotterLimit"] || this.userManagementRowData["companyMonitorPlusLimit"] !== this.tempUserManagementRowData["companyMonitorPlusLimit"] || this.userManagementRowData["activeLicenses"] !== this.tempUserManagementRowData["activeLicenses"] || this.userManagementRowData["isMultipleDeviceLogin"] !== this.tempUserManagementRowData["isMultipleDeviceLogin"] || this.userManagementRowData["enterpriseReportLimit"] !== this.tempUserManagementRowData["enterpriseReportLimit"] ) {

							this.msgs.push({ severity: 'success', summary: "Limits updated successfully!" });

							setTimeout(() => {
								this.msgs = [];
							}, 3000);
						}

						// Common Message
						this.msgs.push({ severity: 'success', summary: "User Details updated successfully!" });
						
						setTimeout(() => {
							this.msgs = [];
						}, 3000);

						this.getUserDetails();
						
						if (this.activatedRoute.snapshot.params.hasOwnProperty('emailId') && this.userRoleFinal == 'Individual') {
							if(this.clientAdminChangeBoolean == false){
								localStorage.setItem( "clientMasterEmail", this.userManagementRowData.email );
								this.router.navigate([ '/user-management/update-user', this.userManagementRowData.email] );
							} else {
								localStorage.setItem( "clientMasterEmail", this.userManagementRowData.email );
								this.router.navigate([ '/user-management/update-corporate', this.companyNameField ], { replaceUrl: true });
							}
						}
						this.updateUserDetailsTeamFeature = true;
					}
					this.changeDetectionService.detectChanges();
				});


				this.subscriptionEndDate = undefined;
				this.sharedLoaderService.hideLoader();
				this.changeDetectionService.detectChanges();

			},
			reject: () => {

				this.clientAdminChangeBoolean = false;
				this.showCompanyNameFieldSuggestion = false;
				this.userManagementRowData['userRole'] = this.tempUserManagementRowData1['userRole'];
				
			}
		});

	}
	addonDataList ( updateInAddon ) {
		this.addOnNgModel = updateInAddon;
	}

}
