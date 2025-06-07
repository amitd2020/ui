import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { exportPayloadConstant } from 'src/export-payload/export-payload-constant';
import { subscribedPlan } from 'src/environments/environment';

import { ListServiceService } from 'src/app/interface/service/list-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { SharedLoaderService } from '../../shared-loader/shared-loader.service';
import { FormatDataRecordListService } from './format-data-export-record-list.service';
import { SearchCompanyService } from '../../../features-modules/search-company/search-company.service';
import { ListPageName } from '../../../features-modules/search-company/search-company.constant';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { take } from 'rxjs';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';
import { v4 as uuidv4 } from 'uuid';

@Component({
	selector: 'dg-export-record-list',
	templateUrl: './export-record-list.component.html',
	styleUrls: ['./export-record-list.component.scss']
})
export class ExportRecordListComponent implements OnInit {

	@Input() tableData: any;
	@Input() appliedFilters: Array<any> = [];
	@Input() selectedCompany: Array<any> = undefined;
	@Input() listDataValues: Array<any> = [];
	@Input() filterSearchArray: Array<any> = [];
	@Input() searchTotalCount: number;
	@Input() newCompanyCount: number;
	@Input() companyTotalCount: number;
	@Input() thisPage: string = '';
	@Input() listId: string = '' ;
	@Input() exportListDynamicName: any;

	@Output() successMessage = new EventEmitter<any>();

	isLoggedIn: boolean = false;
	userDetails: Partial< UserInfoType > = {}

	subscribedPlanModal: any = subscribedPlan;
	constantMessages: any = UserInteractionMessages;

	selectedExportArr: any[];
	exportData: any;
	inputPayload: any
	savedListArray: any;
	customExportType: any;
	toBeExportedCount: any;
	limitDisplayForCustomExport: any;
	exportListId: any;

	exportListDynamicNameCustom: string;
	exportCSVDialogMessage: string = undefined;
	customEmailId: string = "";
	toMail: string = "";
	newId: string = "";
	preparedPayloadExport : PayloadFormationObj = {};
	
	showLoginDialog: boolean = false;
	exportCompanyDataDialog: boolean = false;
	exportAllCondition: boolean = false;
	exportAllButton: boolean = false;
	showEstimateTotalBox: boolean = false;
	exportFilteredDataBool: boolean = false;
	showUpgradePlanDialog: boolean = false;
	customName: boolean = false;
	exportCondition: boolean = false;
	fileNameError: boolean = false;
	csvDialogCustom: boolean = false;
	customEmailOrNotdialog: boolean = false;
	customEmail: boolean = false;
	customEmailBoolYes: boolean = false;
	emailValidateBool: boolean = false;
	showHideCustomNameField: boolean = false;
	qualifiedData: boolean = false;
	fetchVerifyEmail: boolean = false;
	// loadingData: boolean = false;
	inputPageName: string = '';
	outputPageName: string = '';

	noSpecialCharacter: RegExp = /^[A-Za-z\d\_\s]+$/;

	appliedFiltersKeys: Array<any> = [];
	exportProgressData: Array<any> = [];
	excludedSavedListIdArray: Array<any> = [];
	appliedFiltersDirectorsChipValuesArray: Array<any> = [];
	sequenceColumnForExport: Array<any> = [
		{ field: 'directorName', header: 'Director Name' },
		{ field: 'linkedDirector', header: 'Linked Director' },
		{ field: 'companyName', header: 'Company Name' },
		{ field: 'companyno_1', header: 'Company No.1' },
		{ field: 'companyno_2', header: 'Company No.2' },
		{ field: 'companyno_3', header: 'Company No.3' },
		{ field: 'companyno_4', header: 'Company No.4' }
	];

	newLimit: number = undefined;
	payload = exportPayloadConstant;
	commonInputforExportCards = {};
	selectTypeSheet: any;
	subscriptionInActive: boolean;
	showSubscriptionInActiveDialog: boolean = false;
	selectedGlobalCountry: string = 'uk';

	constructor(
		public userAuthService: UserAuthService,
		public activeRoute: ActivatedRoute,
		private toCurrencyPipe: CurrencyPipe,
		private listService: ListServiceService,
		private formatData: FormatDataRecordListService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService,
		private searchCompanyService: SearchCompanyService,
	) { }

	ngOnInit() {

		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => {
			this.isLoggedIn = loggedIn;

			if ( this.isLoggedIn ) {
				this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';
				this.userDetails = this.userAuthService?.getUserInfo();
				this.subscriptionInActive = this.userDetails['isSubscriptionActive'];

				this.inputPageName = this.activeRoute.snapshot.queryParams['listPageName'] ? this.activeRoute.snapshot.queryParams['listPageName'] : "";
		
				switch ( this.inputPageName.toLowerCase() ) {
					case ListPageName.businessMonitor.outputPage.toLowerCase():
						this.outputPageName = ListPageName.businessMonitor.outputPage;
						break;
					case ListPageName.businessMonitorPlus.outputPage.toLowerCase():
						this.outputPageName = ListPageName.businessMonitorPlus.outputPage;
						break;
					case ListPageName.businessWatch.outputPage.toLowerCase():
						this.outputPageName = ListPageName.businessWatch.outputPage;
						break;
					default:
						this.outputPageName = this.thisPage;
						break;
				}
		
				this.exportListId =  this.activeRoute.snapshot.queryParams.cListId;
			}

		});

		this.searchCompanyService.$apiPayloadBody.subscribe( res => {
			this.preparedPayloadExport = res;
		});

	}

	sendingMailOnExportButtonClick() {
		let params = [
			{ key : 'emailId', value: this.userDetails.email }
		];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_PUBLIC', 'sendEmailForExports',undefined, undefined, params ).subscribe(res =>{
			// console.log(res);
		}), err=>{
			console.log(err);
		}
	}

	async selectDataToExportDialog( event ) {

		if ( !this.isLoggedIn ) {
			this.showLoginDialog = true;
			return;
		}

		if ( ( this.isLoggedIn && !this.subscriptionInActive ) ) {
			this.showSubscriptionInActiveDialog = !this.subscriptionInActive;
			return;
		}
		if ( !this.checkExistUser() ) {
			this.showUpgradePlanDialog = true;
			return;
		}

		if ( [ 'companySearch', 'diversityInclusion', 'showContactScreen'].includes( this.thisPage ) ) {

			this.exportListDynamicName = this.selectedGlobalCountry == 'uk' ? "DG_Company_Search_Export_" + this.formatData.dateForFileName() : "DG_Company_Search_Export_Ireland_" + this.formatData.dateForFileName();

			if ( this.appliedFilters && this.appliedFilters.length > 0) {
				for (let i = 0; i < this.appliedFilters.length; i++) {
					if (this.appliedFilters[i]['chip_group'] !== undefined) {
						if (!this.appliedFiltersKeys.includes(this.appliedFilters[i]['chip_group'])) {
							this.appliedFiltersKeys.push(this.appliedFilters[i]['chip_group']);
						}
					}
				}
			}
			
			this.exportFilteredDataBool = false;
			this.customEmail = false;
			this.customEmailId = '';
			this.customName = false;
			this.showHideCustomNameField = false;
			this.fetchVerifyEmail = false;
			this.exportListDynamicNameCustom = '';

			this.payload.columns.map( val => Object.keys( val ).map( key => val[ key ] = [] ) );

			// if ( this.authGuardService.isLoggedin() ) {

				this.sendingMailOnExportButtonClick();
				this.getUserList();

				// if ( this.userRoleAndFeatureAuthService.addOnFeaturesDataObject == undefined || ( this.userRoleAndFeatureAuthService.addOnFeaturesDataObject && this.userRoleAndFeatureAuthService.addOnFeaturesDataObject['defaultExportFeature'] ) ) {

					let userData: any = await this.globalServerCommunication.getUserExportLimit();
					this.limitDisplayForCustomExport = userData.advancedLimit;
					
					this.exportCompanyDataDialog = true;

					if ( this.selectedCompany.length > 0 ) {

						this.exportAllCondition = false;
						this.exportData = this.tableData;

						if ( this.exportData.selection.length === 0 ) {
							this.toBeExportedCount = this.exportListId ? this.exportData.value.filter( val => val.id ).length : this.exportData.value.length;
							// this.toBeExportedCount = this.exportData.value.length;

						} else if ( this.exportData.selection.length > 0 ) {
							// this.exportData.selection.filter( val => val.id )
							this.toBeExportedCount = this.exportListId ? this.exportData.selection.filter( val => val.id ).length : this.exportData.selection.length;
							// this.toBeExportedCount = this.exportData.selection.length;

						}
					} else {

						this.exportAllCondition = true;

						if ( this.thisPage == 'showContactScreen' ) {

							// this.toBeExportedCount = this.searchTotalCount;

						} else if ( ( this.searchTotalCount >= 5000 && this.selectedGlobalCountry == 'uk' ) || ( this.searchTotalCount >= 1000 && this.selectedGlobalCountry != 'uk' ) ) {
							if( this.selectedGlobalCountry == 'uk' ) {
								if( this.userAuthService.hasAddOnPermission('developerFeatures') ) {
									// this.toBeExportedCount = 10000;
									this.toBeExportedCount = this.searchTotalCount > 10000 ? 10000 : this.searchTotalCount
								} else {
									this.toBeExportedCount = this.searchTotalCount > 5000 ? 5000 : this.searchTotalCount;
								}
							} else {
								this.toBeExportedCount = this.searchTotalCount > 1000 ? 1000 : this.searchTotalCount;
							}
							// this.selectedGlobalCountry == 'uk' ? this.toBeExportedCount = 5000 : this.toBeExportedCount = 1000;
							setTimeout(() => {
								this.exportAllButton = false;
							}, 120000);

						} else if ( this.searchTotalCount < 5000 ) {

							if ( this.searchTotalCount < 1000 ) {
								if(['diversityInclusion' ].includes( this.thisPage )){
									this.toBeExportedCount = this.companyTotalCount;
								}else{

									this.toBeExportedCount = this.searchTotalCount;
									setTimeout(() => {
										this.exportAllButton = false;
									}, 30000);
								}
							} else {
								if(['diversityInclusion' ].includes( this.thisPage )){
									this.toBeExportedCount = this.companyTotalCount;
								}else{
									this.toBeExportedCount = this.searchTotalCount;

								}

								setTimeout(() => {
									this.exportAllButton = false;
								}, 120000);

							}

						}

					}

				// }

			// } else {
			// 	this.showLoginDialog = true;
			// }

		} else if ( [ 'landCorporate', 'landRegistry' ].includes( this.thisPage ) ) {

			this.customExportType = '';

			let userData: any = await this.globalServerCommunication.getUserExportLimit();
			let dataCount: number;
			let message: string = undefined;

			this.formatColumnSequencing( this.tableData.columns );

			this.exportData = this.tableData;

			if ( this.tableData.selection.length === 0 ) {

				this.exportCondition == false;
				dataCount = this.tableData.value.length;

			} else if ( this.tableData.selection.length > 0 ) {

				dataCount = this.tableData.selection.length;

			}

			if ( ( [ this.subscribedPlanModal['Monthly_Expand'], this.subscribedPlanModal['Expand_Annual_One_Year'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Expand_Annual_Two_Year'], this.subscribedPlanModal['Expand_New_Monthly'], this.subscribedPlanModal['Monthly_Expand_Paid_Test'], this.subscribedPlanModal['Monthly_Expand_Trial'], this.subscribedPlanModal['Expand_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Expand'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Annually_Expand_Trial'], this.subscribedPlanModal['Compliance_Plan'] ].includes( this.userDetails.planId ) && this.userAuthService?.getUserInfo()?.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {

				// if ( this.userRoleAndFeatureAuthService.addOnFeaturesDataObject == undefined || ( this.userRoleAndFeatureAuthService.addOnFeaturesDataObject && this.userRoleAndFeatureAuthService.addOnFeaturesDataObject['defaultExportFeature'] ) ) {
					
					if ( [ 'landRegistry', 'landCorporate' ].includes( this.thisPage ) ) {
						
						this.customExportType = 'exportForLandCorporate';

						if ( this.thisPage == 'landCorporate' ) {

							if ( dataCount <= userData.corpLandLimit ) {

								this.exportCondition = true;
								this.newLimit = userData.corpLandLimit - dataCount;

							} else {
								this.exportCondition = false
							}

						} else {

							if ( dataCount <= userData.landLimit ) {

								this.exportCondition = true;
								this.newLimit = userData.landLimit - dataCount;

							} else {
								this.exportCondition = false
							}

						}

						if ( this.thisPage == 'landCorporate' ) {
							this.exportListDynamicName = "DG_Property_Register_Export_" + new Date().getTime();
						} else if ( this.thisPage == 'landRegistry' ) {
							this.exportListDynamicName = "DG_Land_Registry_Export_" + new Date().getTime();
						}

						if ( this.exportCondition == true ) {
							this.customEmailOrNotdialog = false;
							message = this.toCurrencyPipe.transform(dataCount, '', ' ', '1.0-0').toString() + this.constantMessages['successMessage']['exportSelectedMessage'];
							this.exportDialog(event, message)
						} if ( this.exportCondition == false ) {
							message = this.constantMessages['infoMessage']['noExportLimitMessage'];
							this.exportDialog(event, message)
						}

					}

				// }

			} else {
				this.showUpgradePlanDialog = true;
			}

		} else {
			if ( event.srcElement.innerText == "EXPORT" ) {
				this.exportListDynamicName = this.selectedGlobalCountry == 'uk' ? "DG_Company_Search_Export_" : "DG_Company_Search_Export_Ireland_" +  new Date().getTime();
				let userData: any = await this.globalServerCommunication.getUserExportLimit();
				let dataCount: number;
				this.exportData = this.tableData;
				if ( this.tableData.selection.length === 0 ) {
	
					this.exportCondition == false;
					dataCount = this.tableData.value.length;
	
				} else if ( this.tableData.selection.length > 0 ) {
	
					dataCount = this.tableData.selection.length;
	
				}
				if ( dataCount <= userData.advancedLimit ) {
					this.exportCondition = true;
					this.newLimit = userData.advancedLimit - dataCount;
				} else {
					this.exportCondition = false
				}
				this.customExportType = 'exportForLandCorporate';
				this.exportExcel();

			} else if ( [ "EXPORT TO EMAIL", 'SEND', 'NO' ].includes( event.srcElement.innerText ) ) {

				if (([this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Compliance_Plan']].includes(this.userDetails.planId) && this.userAuthService?.getUserInfo()?.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
					this.exportListDynamicName = this.selectedGlobalCountry == 'uk' ? "DG_Company_Search_Export_" : "DG_Company_Search_Export_Ireland_" +  new Date().getTime();
				let userData: any = await this.globalServerCommunication.getUserExportLimit();
				let dataCount: number;
					this.exportData = this.tableData;
				if ( this.tableData.selection.length === 0 ) {
	
					this.exportCondition == false;
					dataCount = this.tableData.value.length;
	
				} else if ( this.tableData.selection.length > 0 ) {
	
					dataCount = this.tableData.selection.length;
	
				}
				if ( dataCount <= userData.landLimit ) {
					this.exportCondition = true;
					this.newLimit = userData.landLimit - dataCount;
				} else {
					this.exportCondition = false
				}
					this.exportListDynamicName = this.selectedGlobalCountry == 'uk' ? "DG_Company_Search_Export_" : "DG_Company_Search_Export_Ireland_" +  new Date().getTime();
					this.exportCSVToMail();

				} else {
					this.showUpgradePlanDialog = true;
					this.customEmailOrNotdialog = false;
					this.customEmailId = '';
					this.customEmail = false;
				}

			}
		};

		// let userEmail = [ this.userRoleAndFeatureAuthService.userAuthorizationDetails.email ]

		// let params = [{
		// 	emailId : userEmail
		// }];

		// this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_PUBLIC', 'sendEmailForExports', params ).subscribe(res =>{
		// 	console.log(res);
		// }), err=>{
		// 	console.log(err);
		// }
		
	

	}

	generateUUID(){
  		this.newId = uuidv4();			 
	}

	async customExportLimitCheck( type ) {	
	
		this.sharedLoaderService.showLoader();
		this.customExportType = type;

		if ( this.customName && (!this.exportListDynamicNameCustom || this.exportListDynamicNameCustom == '') ) {

			this.fileNameError = true;
			return;

		} else {
			this.fileNameError = false;
		}

		if ( !( [this.subscribedPlanModal['Monthly_Expand'], this.subscribedPlanModal['Expand_Annual_One_Year'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Expand_Annual_Two_Year'], this.subscribedPlanModal['Expand_New_Monthly'], this.subscribedPlanModal['Monthly_Expand_Paid_Test'], this.subscribedPlanModal['Monthly_Expand_Trial'], this.subscribedPlanModal['Expand_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Expand'], this.subscribedPlanModal['Annually_Expand_Trial'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Compliance_Plan'] ].includes( this.userDetails.planId ) && this.userAuthService?.getUserInfo()?.isSubscriptionActive ) && !this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
			
			this.exportCompanyDataDialog = false;
			this.showUpgradePlanDialog = true;
			this.selectedCompany = [];
			this.sharedLoaderService.hideLoader();
			return;

		}

		if ( this.customEmail ) {
			if ( !this.customEmailId ) {
				this.customEmailOrNotdialog = false;
				this.successMessage.emit({ severity: 'warn', message: 'Please Provide Proper Details to Export Data to Email.' });
				this.sharedLoaderService.hideLoader();
				return;
			}
		}

		let userData: any = await this.globalServerCommunication.getUserExportLimit();
		let dataCount: number;
		let message: string = undefined;
		let exportDataModified
		if ( this.exportData?.selection?.length > 0 ) {
			exportDataModified = this.exportData.selection;
			exportDataModified = exportDataModified.map((obj) => [ 'diversityInclusion' ].includes( this.thisPage ) ? obj.company_number : obj.companyRegistrationNumber.toLowerCase() );
		}
		 if( [ 'companySearch' ].includes( this.thisPage )) {
			
			 let payload = 
				 {
					 "filterData": this.appliedFilters?.length ? this.appliedFilters : [],
					 "listId":  exportDataModified ? "" : this.activeRoute.snapshot.queryParams['cListId'] ? this.activeRoute.snapshot.queryParams['cListId'] : this.listId ? this.listId : this.preparedPayloadExport.listId,
					 "reqBy": this.activeRoute.snapshot.queryParams['reqBy'] ? this.activeRoute.snapshot.queryParams['reqBy'] : "",
					 "pageName": this.thisPage,
					 "selectedCompanyArray":  exportDataModified,
					 "excludedListArray": this.excludedSavedListIdArray ? this.excludedSavedListIdArray : [],
					 "developerFeatures": this.userAuthService.hasAddOnPermission('developerFeatures')
				 }
					 
			await this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'getUserReduceExportLimit', payload ).subscribe({
				next: ( res ) => {
		
					if( res.body.status == 200 ) {
						this.toBeExportedCount = res.body.count;
						if( this.toBeExportedCount <= userData.advancedLimit && this.toBeExportedCount > 0  ) {
							this.exportCondition = true
							this.newLimit = userData.advancedLimit - this.toBeExportedCount;
							this.customExportDialog();
							this.sharedLoaderService.hideLoader();
						} else if ( this.toBeExportedCount >= userData.advancedLimit ) {
							this.exportCondition = false
							this.customExportDialog(this.constantMessages['infoMessage']['noExportLimitMessage']);
							this.sharedLoaderService.hideLoader();
						} else {
							this.exportCondition = false
							this.customExportDialog(res.body.message);
							this.sharedLoaderService.hideLoader();
						}
					}else {
						console.log(res);
						this.sharedLoaderService.hideLoader();
					}
					if ( this.customName ) {
						this.exportListDynamicName = this.exportListDynamicNameCustom + '_' + this.formatData.dateForFileName();
					}
				}, error: ( err ) => {
					this.sharedLoaderService.hideLoader();
				}
			});
			 
		} else {
			
			if ( !this.exportAllCondition ) {
				if ( this.exportData.selection.length === 0 ) {
					dataCount = this.exportListId ? this.exportData.value.filter( val => val.id ).length : this.exportData.value.length;
	
				} else if ( this.exportData.selection.length > 0 ) {
					this.exportData.selection.filter( val => val.id )
					dataCount = this.exportListId ? this.exportData.selection.filter( val => val.id ).length : this.exportData.selection.length;
					// dataCount = this.exportData.selection.filter( val => val.id ).length;
				}
			} else if ( this.exportAllCondition ) {
				dataCount = this.thisPage != 'showContactScreen' ? this.toBeExportedCount : this.searchTotalCount;
			}
	
			if ( dataCount <= userData.advancedLimit ) {
				this.exportCondition = true;
				this.newLimit = userData.advancedLimit - dataCount;
			} else {
				this.exportCondition = false
			}
	
			if (this.exportCondition == true) {
				message = this.toCurrencyPipe.transform(dataCount, '', ' ', '1.0-0').toString() + this.constantMessages['successMessage']['exportSelectedMessage'];
				this.customExportDialog(message)
			} 
			if (this.exportCondition == false) {
				message = this.constantMessages['infoMessage']['noExportLimitMessage'];
				this.customExportDialog(message)
			}
			if ( this.customName ) {
				this.exportListDynamicName = this.exportListDynamicNameCustom + '_' + this.formatData.dateForFileName();
			}
			this.sharedLoaderService.hideLoader();
		}

		 

	}

	customExportDialog(message?) {
		this.customEmailOrNotdialog = false;
		this.exportCompanyDataDialog = false;
		this.csvDialogCustom = true;
		this.exportCSVDialogMessage = message

	}

	customEmailOrNot( event? ) {

		if ( this.checkExistUser() ) {
			if (this.customName && (!this.exportListDynamicNameCustom || this.exportListDynamicNameCustom == '')) {
				this.fileNameError = true;
				return;
			} else {
				this.fileNameError = false;
			}
			this.exportCompanyDataDialog = false;
			this.customEmailOrNotdialog = true;
			
		} else {
			this.showUpgradePlanDialog = true;
		}
	}

	async exportExcel() {
		this.generateUUID()

		// if ( ![ 'landCorporate', 'landRegistry', 'related_Directors', 'related_Companies', 'otherRelatedCompanies' ].includes( this.thisPage ) ) {

		// 	if ( this.selectedExportArr['companyInformation'] && this.selectedExportArr['companyInformation'].length ) {
		// 		this.formatExportColumnPayload( this.selectedExportArr['companyInformation'], 'companyInformation' );
		// 	}
	
		// 	if ( this.selectedExportArr['directorsInformation'] && this.selectedExportArr['directorsInformation'].length ) {
		// 		this.formatExportColumnPayload( this.selectedExportArr['directorsInformation'], 'directorsInformation' );
		// 	}
	
		// 	if ( this.selectedExportArr['contactInformation'] && this.selectedExportArr['contactInformation'].length ) {
		// 		this.formatExportColumnPayload( this.selectedExportArr['contactInformation'], 'contactInformation' );
		// 	}
	
		// 	if ( this.selectedExportArr['pscInformation'] && this.selectedExportArr['pscInformation'].length ) {

		// 		let isSelectedPscName: number = this.selectedExportArr['pscInformation'].filter( val => val.key == 'pscName' ).length;

		// 		if ( isSelectedPscName == 0 ) {

		// 			this.selectedExportArr['pscInformation'].unshift({
		// 				key: "pscName",
		// 				header: "PSC Name",
		// 				userDefinedHeader: "",
		// 				cardName: "pscInformation",
		// 				disabled: false,
		// 				editInput: false
		// 			});

		// 		}

		// 	this.formatExportColumnPayload( this.selectedExportArr['pscInformation'], 'pscInformation' );

		// 	}
	
		// 	if ( this.selectedExportArr['shareholderInformation'] && this.selectedExportArr['shareholderInformation'].length ) {
		// 		this.formatExportColumnPayload( this.selectedExportArr['shareholderInformation'], 'shareholderInformation' );
		// 	}
	
		// 	if ( this.selectedExportArr['tradingAddressInformation'] && this.selectedExportArr['tradingAddressInformation'].length ) {
		// 		this.formatExportColumnPayload( this.selectedExportArr['tradingAddressInformation'], 'tradingAddressInformation' );
		// 	}
	
		// 	if ( this.selectedExportArr['financialInformation'] && this.selectedExportArr['financialInformation'].length ) {
		// 		this.formatExportColumnPayload( this.selectedExportArr['financialInformation'], 'financialInformation' );
		// 	}
	
		// 	if ( this.selectedExportArr['diversityAndInclusionInformation'] && this.selectedExportArr['diversityAndInclusionInformation'].length ) {
		// 		this.formatExportColumnPayload( this.selectedExportArr['diversityAndInclusionInformation'], 'diversityAndInclusionInformation' );
		// 	}
			
		// 	if ( this.selectedExportArr['chargesInformation'] && this.selectedExportArr['chargesInformation'].length ) {
		// 		this.formatExportColumnPayload( this.selectedExportArr['chargesInformation'], 'chargesInformation' );
		// 	}

		// 	if ( this.selectedExportArr['personContactInformation'] && this.selectedExportArr['personContactInformation'].length ) {
		// 		this.formatExportColumnPayload( this.selectedExportArr['personContactInformation'], 'personContactInformation' );
		// 	}

		// 	if ( this.selectedExportArr['corporateLandInformation'] && this.selectedExportArr['corporateLandInformation'].length ) {
		// 		this.formatExportColumnPayload( this.selectedExportArr['corporateLandInformation'], 'corporateLandInformation' );
		// 	}

		// }

		let appliedData = this.thisPage == 'showContactScreen' ? 'filterData' : 'appliedFilters';
		if ( this.exportCondition && this.exportAllCondition && this.customExportType == 'all' ) {
			let pageName = this.thisPage;
			this.csvDialogCustom = false;
			let savedListId = ""
			if( this.activeRoute.snapshot.queryParams['cListId'] && this.appliedFilters.length  ){
				pageName = 'companyListWithCriteria'
				savedListId = this.activeRoute.snapshot.queryParams['cListId']
			} else {
				savedListId = this.activeRoute.snapshot.queryParams['cListId'] ? this.activeRoute.snapshot.queryParams['cListId'] : [ 'diversityInclusion' ].includes( this.thisPage ) ? this.listId : ''
			}
			let idsavedListdata = this.appliedFilters?.length ? this.appliedFilters.map( ({saveListData}) => saveListData )[0] : [];
			let payloadObj = {
				[appliedData]: this.appliedFilters?.length ? this.appliedFilters : [],
				"exportSheetType": 'excel',
				"sheetType": this.selectTypeSheet == 'qualifiedData' ? 'extended' : this.selectTypeSheet,
				"exportType": 'all',
				"exportEmail": false,
				"customEmailId": '',
				"userId": this.userDetails.dbID,
				"emailId": this.userDetails.email,
				"clientAdminMasterEmail": this.userAuthService.hasRolePermission( [ 'Client Admin', 'Client User' ] ) ? this.userDetails.clientAdminEmail : '',
				"fileName": this.exportListDynamicName,
				"exportCount": this.toBeExportedCount,
				"listId": savedListId ? savedListId : idsavedListdata ? idsavedListdata : this.listId ? this.listId : this.preparedPayloadExport.listId,
				"userRole": this.userDetails.userRole,
				"columns": this.selectedExportArr,
				"selectedCompanyArray": [],
				"templateName": '',
				"thisPage": this.listId && ( this.activeRoute.snapshot.queryParams['listPageName'] == 'diversityCalculation' ) ? 'diversityCalculation' : ( this.listId || idsavedListdata ) ? 'companyListWithCriteria' : this.outputPageName == 'showContactScreen' ? 'companySearch' : this.outputPageName,
				"excludeList": this.excludedSavedListIdArray && this.excludedSavedListIdArray.length ? true : false,
				"excludedListArray": this.excludedSavedListIdArray ? this.excludedSavedListIdArray : [],
				"redirectURL": window.location.origin + '/list/exported-files',
				"filterSearchArray": this.filterSearchArray,
				"isQualifiedData": this.qualifiedData,
				fetchVerifyEmail: this.fetchVerifyEmail,
				"newId": this.newId
			};

			if ( ['businessCollaborators', 'procurementPartners', 'fiscalHoldings'].includes( this.inputPageName ) ) {
				payloadObj['thisPage'] = ListPageName[this.inputPageName].outputPage;
			}

			this.listService.exportAllExcel( payloadObj, this.thisPage ).then( data => {
				if ( data.message == "Exports are added to queue."  || data == "Exports are added to queue." || data.message == 'Email Queue Triggered!' || data.message == 'Export Queue Triggered!' ) {
	
					this.exportAllButton = true;
					this.fetchVerifyEmail = false;
					this.successMessage.emit({ severity: 'success', message: this.constantMessages['successMessage']['exportAllSuccess1'] });

					setTimeout(() => {
						this.exportAllButton = false;
					}, 2000);
	
				}
			});

		}
		
		if ( this.exportCondition && !this.exportAllCondition && this.customExportType == 'export' ) {
			let pageName = this.thisPage;
			this.csvDialogCustom = false;
			let exportDataModified;
			
			if ( this.exportData.selection.length > 0 ) {
				exportDataModified = this.exportData.selection;
				exportDataModified = exportDataModified.map((obj) => [ 'diversityInclusion' ].includes( this.thisPage ) ? obj.company_number : obj.companyRegistrationNumber.toLowerCase() );
			} else if ( this.exportData.selection.length == 0 ) {
				exportDataModified = this.exportData.value;
				exportDataModified = exportDataModified.map((obj) => [ 'diversityInclusion' ].includes( this.thisPage ) ? obj.company_number : obj.companyRegistrationNumber.toLowerCase() );
			}
			if( this.activeRoute.snapshot.queryParams['cListId'] && this.appliedFilters.length  ){
				pageName = 'companyListWithCriteria'
			}

			let payloadObj = {
				[appliedData]: this.thisPage == 'companyListWithCriteria' && exportDataModified.length == 0 ? this.appliedFilters : [],
				"exportSheetType": 'excel',
				"sheetType": this.selectTypeSheet == 'qualifiedData' ? 'extended' : this.selectTypeSheet,
				"exportType": 'selected',
				"exportEmail": false,
				"customEmailId": '',
				"userId": this.userDetails.dbID,
				"emailId": this.userDetails.email,
				"clientAdminMasterEmail": this.userAuthService.hasRolePermission( [ 'Client Admin', 'Client User' ] ) ? this.userDetails.clientAdminEmail : '',
				"fileName": this.exportListDynamicName,
				"exportCount": this.toBeExportedCount,
				"listId": exportDataModified  ? '' : this.activeRoute.snapshot.queryParams['cListId'] ? this.activeRoute.snapshot.queryParams['cListId'] : this.listId,
				"userRole": this.userDetails.userRole,
				"columns": this.selectedExportArr,
				"selectedCompanyArray": exportDataModified,
				"templateName": '',
				"thisPage": this.activeRoute.snapshot.queryParams['cListId'] && ( this.activeRoute.snapshot.queryParams['listPageName'] == 'diversityCalculation' ) ? 'diversityCalculation' : this.activeRoute.snapshot.queryParams['cListId'] && this.appliedFilters.length ? 'companyListWithCriteria' : this.outputPageName,
				
				"excludeList": this.excludedSavedListIdArray && this.excludedSavedListIdArray.length ? true : false,
				"excludedListArray": this.excludedSavedListIdArray ? this.excludedSavedListIdArray : [],
				"redirectURL": window.location.origin + '/list/exported-files',
				"isQualifiedData": this.qualifiedData,
				fetchVerifyEmail: this.fetchVerifyEmail,
				"newId": this.newId
				
			};

			if ( ['businessCollaborators', 'procurementPartners', 'fiscalHoldings'].includes( this.inputPageName ) ) {
				payloadObj['thisPage'] = ListPageName[this.inputPageName].outputPage;
			}

			if ( this.thisPage == 'showContactScreen' ) {
				payloadObj['selectedCompanyArray'] = this.selectedCompany.map( company => company.id );
			};
			
			this.listService.exportAllExcel(payloadObj, this.thisPage).then(data => {
				if ( data.message == "Exports are added to queue." || data == "Exports are added to queue." || data.message == 'Export Queue Triggered!' || data.message == 'Email Queue Triggered!' ) {
	
					this.exportAllButton = true;
					this.fetchVerifyEmail = false;
					this.successMessage.emit({ severity: 'success', message: this.constantMessages['successMessage']['exportAllSuccess1'] });

					setTimeout(() => {
						this.exportAllButton = false;
					}, 2000);
	
				}
			});

		}
		
		if ( this.exportCondition && !this.exportAllCondition && [ 'email' ].includes( this.customExportType ) ) {
			let pageName = this.thisPage;
			// this.loadingData = true;
			this.sharedLoaderService.showLoader();			
			this.csvDialogCustom = false;
			let exportDataModified;

			if (this.exportData.selection.length > 0) {
				exportDataModified = this.exportData.selection;
				if (  this.thisPage == 'diversityInclusion' ) {
					exportDataModified = exportDataModified.map((obj) => obj.company_number.toLowerCase());
				} else {
					exportDataModified = exportDataModified.map((obj) => obj.companyRegistrationNumber.toLowerCase());

				}
			} else if (this.exportData.selection.length == 0) {
				exportDataModified = this.exportData.value;
				exportDataModified = exportDataModified.map((obj) => obj.companyRegistrationNumber.toLowerCase());
			}
			let savedListId = ''

			if( this.activeRoute.snapshot.queryParams['cListId'] && this.appliedFilters.length  ){
				pageName = 'companyListWithCriteria'
				savedListId = this.activeRoute.snapshot.queryParams['cListId']
			} else {
				savedListId = this.activeRoute.snapshot.queryParams['cListId'] && !this.appliedFilters.length && exportDataModified.length == 0 ? this.activeRoute.snapshot.queryParams['cListId'] : ''
			}

			let exportSelectedpayloadObj = {
				[appliedData] : this.thisPage == 'companyListWithCriteria' ? this.appliedFilters : [],
				"exportSheetType" : 'excel',
				"sheetType" : this.selectTypeSheet == 'qualifiedData' ? 'extended' : this.selectTypeSheet,
				"exportType": 'selected',
				"exportEmail": true,
				"userId" : this.userDetails.dbID,
				"emailId" : this.userDetails.email,
				"clientAdminMasterEmail": this.userAuthService.hasRolePermission( [ 'Client Admin', 'Client User' ] ) ? this.userDetails.clientAdminEmail : '',
				"fileName" : this.exportListDynamicName,
				"exportCount" : exportDataModified.length,
				"listId" : savedListId ? savedListId : this.listId,
				"userRole" : this.userDetails.userRole,
				// "columns" : this.payload.columns.filter( val => Object.values(val)[0]['length'] ),
				"columns" : this.selectedExportArr,
				"selectedCompanyArray": exportDataModified,
				"templateName": '',
				"thisPage": this.listId && ( this.activeRoute.snapshot.queryParams['listPageName'] == 'diversityCalculation' ) ? 'diversityCalculation' :  this.listId ? 'companyListWithCriteria' : this.outputPageName,
				"excludeList": this.excludedSavedListIdArray && this.excludedSavedListIdArray.length ? true : false,
				"excludedListArray": this.excludedSavedListIdArray ? this.excludedSavedListIdArray : [],
				"redirectURL": window.location.origin + '/list/exported-files',
				"isQualifiedData": this.qualifiedData,
				fetchVerifyEmail: this.fetchVerifyEmail,
				"newId": this.newId
			};

			if ( ['businessCollaborators', 'procurementPartners', 'fiscalHoldings'].includes( this.inputPageName ) ) {
				exportSelectedpayloadObj['thisPage'] = ListPageName[this.inputPageName].outputPage;
			}

			if ( this.thisPage == 'showContactScreen' ) {
				exportSelectedpayloadObj['selectedCompanyArray'] = this.selectedCompany.map( company => company.id );
			};

			exportSelectedpayloadObj["customEmailId"] = ( this.customEmail || this.customEmailBoolYes ) && this.customEmailId !== '' ? this.customEmailId : '';

			this.listService.exportAllExcel( exportSelectedpayloadObj, this.thisPage ).then(data => {
				
				if ( data.message == 'Exports are added to queue.' || data == "Exports are added to queue." || data.message == 'Export Queue Triggered!' || data.message == 'Email Queue Triggered!' ) {

					if ( this.emailValidateBool != false ) {
						this.successMessage.emit({ severity: 'success', message: this.constantMessages['successMessage']['exportToMailSuccess'] });
						this.emailValidateBool = false;
					} else {
						this.successMessage.emit({ severity: 'success', message: this.constantMessages['successMessage']['exportToRegisteredMailSuccess'] });
					}
					this.fetchVerifyEmail = false;
				}
				
				// this.loadingData = false;
				this.sharedLoaderService.hideLoader();
				this.customEmailBoolYes = false;
				
			});

		}

		if ( this.customExportType == 'exportForLandCorporate' ) {
			
			if ( ![ "companySearch", 'landRegistry', 'landCorporate' ].includes( this.thisPage ) ) {
				this.exportCondition = true;
			}

			if (this.exportCondition) {

				const tableData = this.exportData;
				
				const actualCols = JSON.parse(JSON.stringify(tableData.columns));
				const actualVals = JSON.parse(JSON.stringify(tableData.value));
				
				let colsTemp = [], dataTemp = [], dataSelectionTemp = [];
	
				for (let col of tableData.columns) {
					if (!(col.field == "download" || col.field == "otherFeatures" || col.field == "otherRelations")) {
						
						if (col.field == 'dAddress') {
							col.field = 'address1';
						}
						if (col.field == 'dAddress2') {
							col.field = 'address2';
						}
						colsTemp.push(col);
					}
				}

				let filterCompNum = tableData.value.filter( val => { return ( val.businessName || val.companyName || val.companyRegistrationNumber || val.CompanyNameOriginal || val.Company_Registration_No_1 ) } );

				if (filterCompNum.length) {
					colsTemp.push({ field: 'companyLinkUrl', header: 'Business URL',  textAlign: 'right', width: '110px'});
				}
				
				if (tableData.selection.length > 0) {
					dataSelectionTemp = this.formatData.formatDataForCSV( colsTemp, tableData.selection, this.thisPage );
				} else {
					dataTemp = this.formatData.formatDataForCSV( colsTemp, actualVals, this.thisPage );
				}
				
				let exportobj = {
					tableCols: undefined,
					userID: undefined,
					pageName: undefined,
					tableData: undefined,
					fileName: this.exportListDynamicName
				};
	
				if (tableData.value !== undefined && tableData.value.length > 0) {
					if (this.selectedCompany.length > 0) {

						this.formatColumnSequencing( colsTemp );
						
						tableData['columns'] = colsTemp;
						tableData['selection'] = dataSelectionTemp;
						tableData.exportCSV({ selectionOnly: true });
						exportobj.tableCols = tableData['columns'];
						exportobj.userID = this.userDetails.dbID;
						if (this.thisPage === "companySearch") {
							exportobj.pageName = "Company_Search_Export";
						} else if (this.thisPage === "landRegistry") {
							exportobj.pageName = "Land_Registry_Export";
						} else if (this.thisPage === "landCorporate") {
							exportobj.pageName = "Land_Corporate_Export";
						} else {
							exportobj.pageName = "Company_Search_Export";
						}
						exportobj.tableData = tableData['selection'];
						tableData.columns = actualCols;
						tableData.value = actualVals;
						tableData['selection'] = []
	
					} else if (tableData.value !== undefined) {

						this.formatColumnSequencing( colsTemp );

						tableData.columns = colsTemp;
						tableData.value = dataTemp;
						tableData.exportCSV();
						exportobj.tableCols = tableData['columns'];
						exportobj.userID = this.userDetails.dbID;
						if (this.thisPage === "companySearch") {
							exportobj.pageName = "Company_Search_Export";
						} else if (this.thisPage === "landRegistry") {
							exportobj.pageName = "Land_Registry_Export";
						} else if (this.thisPage === "landCorporate") {
							exportobj.pageName = "Land Corporate Export";
						} else {
							exportobj.pageName = "Company_Search_Export";
						}
						exportobj.tableData = tableData.value;
						tableData.columns = actualCols;
						tableData.value = actualVals;
					}
				}

				this.exportData = undefined;
				this.csvDialogCustom = false;
				this.selectedCompany = [];
				this.reduceExportLimit();

				this.successMessage.emit({ severity: 'success', message: this.constantMessages['successMessage']['exportSuccess'] });

				setTimeout(() => {
					this.uploadCsvToS3(exportobj, undefined)
				}, 5000);

			}

		}

		this.exportCompanyDataDialog = false;
		this.exportFilteredDataBool = false;
		this.customEmail = false;
		this.customName = false;
		this.showHideCustomNameField = false;
		this.exportListDynamicNameCustom = '';
		this.selectedCompany = [];

	}

	async exportCSVToMail() {
		if (!(this.thisPage === "companySearch" || this.thisPage === "landRegistry" || this.thisPage === "landCorporate")) {
			this.exportCondition = true;
		}

		if (this.exportCondition) {

			const tableData = this.exportData;
			let obj: any = {};
			
			obj["tableCols"] =  JSON.parse(JSON.stringify(tableData.columns));
			obj["userID"] = this.userDetails.dbID;
			if (this.thisPage === "companySearch") {
				obj["pageName"] = "Company_Search_Export";
			} else if (this.thisPage === "landRegistry") {
				this.customEmail = true;
				obj["pageName"] = "Land_Registry_Export";
			} else if (this.thisPage === "landCorporate") {
				this.customEmail = true;
				obj["pageName"] = "Land_Corporate_Export";
			} else {
				obj["pageName"] = "Company_Search_Export";
			}

			obj['fileName'] = this.exportListDynamicName;

			if (this.customEmail && this.customEmailId) {
				obj["email"] = this.customEmailId;
			}

			let filterCompNum = tableData.value.filter( val => { return ( val.businessName || val.companyName || val.companyRegistrationNumber || val.CompanyNameOriginal || val.Proprietor_Name_1 || val.Company_Registration_No_1 ) } );

			if (filterCompNum.length) {
				obj["tableCols"].push({ field: 'companyLinkUrl', header: 'Business URL',  textAlign: 'right', width: '110px'});
			}

			this.formatColumnSequencing( obj["tableCols"] );

			if (tableData.selection.length > 0) {
				obj["tableData"] = this.formatData.formatDataForCSV( obj["tableCols"], tableData.selection, this.thisPage );
				let sendMail = await this.exportToMaiL(obj);
			} else {
				obj["tableData"] = this.formatData.formatDataForCSV( obj["tableCols"],  tableData.value, this.thisPage );
				let sendMail = await this.exportToMaiL(obj);
			}
			tableData['selection'] = []
			this.selectedCompany = [];
			this.csvDialogCustom = false;
			this.customEmailOrNotdialog = false;
			this.customEmail = false;
			this.reduceExportLimit();
			if (this.emailValidateBool != false) {
				this.successMessage.emit({ severity: 'success', message: this.constantMessages['successMessage']['exportToMailSuccess'] });
				this.emailValidateBool = false;
			} else {
				this.successMessage.emit({ severity: 'success', message: this.constantMessages['successMessage']['exportToRegisteredMailSuccess'] });
			}
			setTimeout(() => {
				this.customEmailId = '';
			}, 2000);

		}
	}

	uploadCsvToS3(exportobj, exportType) {

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'uploadExportedCsv', exportobj ).subscribe( res => {

		});

	}
	
	exportDialog( event, message ) {

		if (event.srcElement.innerText == "EXPORT") {
			this.toMail = '';
			this.csvDialogCustom = true;
			if (this.exportCondition) {
				this.exportCSVDialogMessage = message

			} else {
				this.exportCSVDialogMessage = message
			}

		} else if ( ["EXPORT TO EMAIL", 'SEND', 'NO'].includes(event.srcElement.innerText) ) {

			if (([this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Compliance_Plan']].includes(this.userDetails.planId) && this.userDetails.isSubscriptionActive) || this.userAuthService.hasRolePermission( ['Super Admin'] )) {
				this.toMail = 'TO EMAIL';
				this.csvDialogCustom = true;
				if (this.exportCondition) {
					this.exportCSVDialogMessage = message;
				} else {
					this.exportCSVDialogMessage = message;
				}

			} else {
				this.showUpgradePlanDialog = true;
			}

		}

	}

	validateEmail( emailField ) {

		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if ( reg.test( emailField ) == false ) {
			this.emailValidateBool = false;
		} else {
			this.emailValidateBool = true;
		}

	}

	reduceExportLimit() {
		
		let obj = {
			userId: this.userDetails.dbID,
			thisPage: this.thisPage,
			newLimit: this.newLimit
		}

		this.globalServerCommunication.reduceExportLimit(obj);

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getUserExportLimit' ).subscribe( res => {
			this.limitDisplayForCustomExport = res.body['advancedLimit'];
		});

	}

	formatColumnSequencing( tableColumn ) {

		let i = 0;

		for ( let index in this.sequenceColumnForExport ) {

			for ( let column in tableColumn ) {
				
				if ( tableColumn[ column ].header == this.sequenceColumnForExport[ index ].header ) {

					tableColumn.splice( i, 0, tableColumn[ column ] );
					tableColumn.splice( parseInt(column) + 1, 1 );

					i ++;

				}
				
			}
			
		}

		return tableColumn;

	}

	formatExportColumnPayload( selectedCard, cardName ) {

		if ( selectedCard && selectedCard.length ) {

			for ( let card of selectedCard ) {
			
				for ( let column of this.payload.columns ) {

					if ( column.hasOwnProperty( cardName ) ) {

						column[ cardName ].push({ key: card.key, userDefinedHeader: '' });

					}
					
					
				}
				
			}

		}

	}

	selectedCardForExport( event ) {
		this.selectedExportArr = [];

		for ( let key in event ) {
			this.selectedExportArr.push( { [ key ]: event[ key ]  } )
		}

		// this.selectedExportArr = event;

		// if ( this.selectTypeSheet != 'compressed' && this.selectedExportArr?.['personContactInformation'] ) {
		// 	delete this.selectedExportArr[ 'personContactInformation' ]
		// }
	}

	selectedSavedListForExport( event ) {
		this.excludedSavedListIdArray = [];
		if ( event ) {
			this.excludedSavedListIdArray.push( ...event );
		}
		
	}

	checkExistUser() {

		if ( ( ( [this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Compliance_Plan'] ].includes( this.userDetails.planId ) && this.userDetails.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] )) ) {
				
			return true;

		}

		return false;
		
	}
	
	getSheetType( event ) {
		this.selectTypeSheet = event.value;
		if(this.selectTypeSheet == "qualifiedData"){
			this.qualifiedData = true
		}else{
			this.qualifiedData = false
		}
	}

	exportToMaiL(obj: any) {
		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'exportCsvToEmail', obj ).subscribe( res => {});
	}

	getUserList() {

		let obj = [ 25, 1 ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getUserLists', obj ).subscribe( res =>  {
			this.savedListArray = res.body['results'];
		});
		
	}
}
