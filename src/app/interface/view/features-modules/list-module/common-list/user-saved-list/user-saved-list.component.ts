import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';

import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';

@Component({
	selector: 'dg-user-saved-list',
	templateUrl: './user-saved-list.component.html',
	styleUrls: ['./user-saved-list.component.scss']
})
export class UserSavedListComponent implements OnInit {

	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'

	userDetails: Partial< UserInfoType > = {};
	tableCols: Array<any>;
	limitsDetailsForEmailsCols: Array<any>;
	limitsDetailsForEmailsVerifyCols: Array<any>;
	payloadObj:any
	tableData = [];
	dataArr = [];
	outputPageName: string = '';

	totalNumOfRecords: number;
	displayModal: boolean
	updateTagsBoolean: boolean = false;
	bulklistId: any;
	updateTagPageName = ""
	msgs = [];
	actionCols : any;
	limitsDetailsForEmailsData : any;
	constantMessages: any = UserInteractionMessages;
	emailSpotterLimit: any 
	totalDomainCount: any 
	totalLimitToReduce: any 
	subscription_id : any 
	subscription_endDate : any 
	creditLimitForVerify : any 
	verifyEmailCreditLimit : any 
	limitsDetailsForEmailsVerifyData: any;
	obj: any;
	listParams: any;
	// resetDisplayModelTable: any;
	resetTable: boolean = false;

	resetDisplayModelTable = {
		displayModal: true,
		resetTable: false,
	};

	updatedFieldsforBulkTagObj: Object = {}

	constructor(
		private seoService: SeoService,
		private userAuthService: UserAuthService,
		private sharedLoaderService: SharedLoaderService,
		private serverCommunicate: ServerCommunicationService,
		public _activatedRoute: ActivatedRoute,
		private router: Router
	) {
		/*
			Do not enable the below code before discussing with Akmal.
			It reloads the `AppMainComponent`, which is the main
			layout container and parent for all of the Components/Modules.
			===============================================================
			this.router.routeReuseStrategy.shouldReuseRoute = () => false;
			===============================================================
		*/
	}

	ngOnInit() {

		this.userDetails = this.userAuthService?.getUserInfo();
		
		this.initBreadcrumbAndSeoMetaTags();
		this.listPageName();
		this.getCompanyListData();

		this.tableCols = [
			{ field: 'listName', header: 'List Name', minWidth: '500px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'page', header: 'Page', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
			{ field: 'companiesInList', header: 'Number of Records', minWidth: '200px', maxWidth: '200px', textAlign: 'right' },
			{ field: 'createdAt', header: 'Created On', minWidth: '250px', maxWidth: '250px', textAlign: 'center' },
			{ field: 'updatedAt', header: 'Updated On', minWidth: '250px', maxWidth: '250px', textAlign: 'center' },
			{ field: 'edit', header: 'Action', minWidth: '100px', maxWidth: '100px', textAlign: 'center' },
		];

		this.actionCols = [ 'Edit', 'Delete', 'Fetch email', 'Fetch other email', 'Verify email', 'Add to monitor', 'Add to monitor plus','Update Tags' , 'Responsible Procurement'];

		this.limitsDetailsForEmailsVerifyCols = [
			{ field: 'totalCompaniesCount', header: 'Total Companies', width: '80px', textAlign: 'center' },
			{ field: 'totalEmailsCount', header: 'Total Email Count', width: '80px', textAlign: 'center' },
			{ field: 'totalEmailsCreditCount', header: 'Total Email Credit Available', width: '80px', textAlign: 'center' },
			{ field: 'maximumTotalReduceLimitCount', header: 'Total Reduce Limit', width: '80px', textAlign: 'center' },
		]
	}

	listPageName() {
		let page = this._activatedRoute.snapshot?.params['pageName'] ? this._activatedRoute.snapshot?.params['pageName'] : "";
	
		switch(page) {
			case "companies": 
			    // page = 'companySearch';
			 	this.outputPageName = 'companySearch';
				break;
			case "Charges":
				page = 'Company Charges-List';
				this.outputPageName = page;
				break;
			case "Trade":
				page = 'Company Trade-list';
				this.outputPageName = page;
				break;
			case "contractFinder":
				page = 'contractFinderPage';
				this.outputPageName = page;
				break;
			case "Buyers":
				page = 'buyersDashboard';
				this.outputPageName = page;
				break;
			case "Suppliers":
				page = 'suppliersDashboard';
				this.outputPageName = page;
				break;
			case "accountSearch":
				page = 'accountSearch';
				this.outputPageName = page;
				break;
			case "companyDescription":
				page = 'companyDescription';
				this.outputPageName = page;
				break;
			case "chargesDescription":
				page = 'chargesDescription';
				this.outputPageName = page;
				break;
			case "investorFinder":
				page = 'investorFinder';
				this.outputPageName = page;
				break;
			case "investeeFinder":
				page = 'investeeFinder';
				this.outputPageName = page;
				break;
			default:
				this.outputPageName = '';
				break;
			
		}
	}

	getCompanyListData( pageSize?, pageNumber?, pageName? ) {

		this.sharedLoaderService.showLoader();

		// let params = [
		// 	this.userRoleAuth.userAuthorizationDetails.dbID,
		// 	pageSize ? pageSize : 25,
		// 	pageNumber ? pageNumber : 1
		// ];

		this.listParams = [
			// { key: 'userId', value: this.userDetails?.dbID },
			{ key: 'pageName', value: pageName ? pageName : '' },
			{ key: 'limit', value: pageSize ? pageSize : 25, },
			{ key: 'skip', value: pageNumber ? ( pageSize * pageNumber ) : 0 },
		];
		
		this.serverCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getUserListsByUserId', undefined, undefined, this.listParams ).subscribe( res => {

			this.totalNumOfRecords = res.body['totalCount'];
			let tempArray = res.body.results;

			this.dataArr = [];
			
			if( tempArray && tempArray.length ) {
				for (let i = 0; i < tempArray.length; i++) {
					if(tempArray && tempArray[i]['page']) {
						let formatedPage = ['Company Trade-list','Company Charges-List'].includes(tempArray[i]['page']) ? tempArray[i]['page'] : tempArray[i]['page'].replace(/([A-Z])/g, ' $1');			

						if ( ['company Linked In'].includes( formatedPage ) ) {
							formatedPage = 'Company LinkedIn';
						} else if ( [ 'person Linked In' ].includes( formatedPage ) ) {
							formatedPage = 'Person LinkedIn';
						}
						tempArray[i]['page'] = formatedPage;
						// if (tempArray[i].listName == "Favourites") {
						// 	this.dataArr.splice(0, 0, tempArray[i]);
						// 	continue;
						// }
						this.dataArr.push(tempArray[i]);
					}
				}
			}
			this.tableData = this.dataArr;
			this.sharedLoaderService.hideLoader();
		});

	}

	getUpdateTableDataList( event ) {
		this.obj = {
		limit: event.rows, 
		skip: event.page,
		pageName: event.pageName
		}
		
		this.getCompanyListData( event.rows, event.page, event.pageName );

	}

	initBreadcrumbAndSeoMetaTags() {
		// this.breadCrumbService.setItems([
		// 	{ label: 'Saved List' }
		// ]);
		this.title = "Saved Lists - DataGardener";
		this.description = "Saved companies list in which you want to check record.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
	}

	getUpdateActionField( event ) {

		this.bulklistId  = '';

		this.payloadObj = event;
		switch(this.payloadObj.name) {
			case "edit":
				this.editFunction( event.listName,event.userID,event._id, event.pageNameForUpdate );
				break;
			case "delete":
				this.deleteList( event.pageNameForDelete );
				break;
			case "emailExport":
				this.emailExport();
				break;
			case "saveWatchList":
				this.saveWatchList();
				break;
			case "saveWatchListPlus":
				this.saveWatchListPlus();
				break;
			case "fetchEmailStartProcess":
				this.saveEmailFileForSaveLists();
				break;
			case "verifyEmail":
				this.dialogBoxforVerifyEmail();
				break;
			case "verifyEmailStartProcess":
				this.checkVerifyEmail();
				break;
			case "updateTags":
				this.updateTagsBoolean = false;
				setTimeout( () => {
					this.updateTags(event);
				}, 100 )
				break;
		}
		
	}

	editFunction( listName, userID , _id, pageNameForUpdate ) {
		let requestBody = {
			listName: this.payloadObj.listName,
			userID: this.payloadObj.userID,
			_id: this.payloadObj._id
		}, endPoint, method;

		if ( pageNameForUpdate == 'Company Charges-List' ) {
			endPoint = 'editAblChargesUserList';
			method = 'put'
		} else if( [ 'Person LinkedIn' ].includes(pageNameForUpdate) ) {
			endPoint = 'editLinkedInUserList';
			method = 'put'
		} else {
			endPoint = 'updateListName';
			method = 'post'
		}

		this.serverCommunicate.globalServerRequestCall( method, 'DG_LIST', endPoint, requestBody ).subscribe(res => {
			if (res.status === 200) {
				
				this.resetDisplayModelTable.displayModal = false;
				this.resetDisplayModelTable.resetTable = true;
				
				// this.getCompanyListData();
				this.msgs = [];
				this.msgs.push({ severity: 'success', summary: listName + this.constantMessages['successMessage']['listNameSuccess'] });
				setTimeout(() => {
					this.msgs = [];
				}, 3000);
			} else if (res.status === 222) {
				this.resetDisplayModelTable.displayModal = false;
				this.msgs = [];
				this.msgs.push({ severity: 'info', summary: 'Duplicate Entries are not allowed!' });
				setTimeout(() => {
					this.msgs = [];
				}, 3000);
			} else if (res.status === 201) {
				this.resetDisplayModelTable.displayModal = false;
				this.msgs = [];
				this.msgs.push({ severity: 'warn', summary: 'Somthing bad happed, Please try later again1!' });
				setTimeout(() => {
					this.msgs = [];
				}, 3000);
			} else if (res.status === 202) {
				this.resetDisplayModelTable.displayModal = false;
				this.getCompanyListData();
				this.msgs = [];
				this.msgs.push({ severity: 'success', summary: listName + this.constantMessages['successMessage']['listNameSuccess'] });
				setTimeout(() => {
					this.msgs = [];
				}, 3000);
			} else if (res.status == 409) {
				this.resetDisplayModelTable.displayModal = false;
				this.msgs = [];
				this.msgs.push({ severity: 'info', summary: this.constantMessages['infoMessage']['listNameAlreadyExistMsg'] });
				setTimeout(() => {
					this.msgs = [];
				}, 3000);
			}
		}, err => {
			if ( err['status'] == 409 ) {
				this.resetDisplayModelTable.displayModal = false;
				this.msgs = [];
				this.msgs.push({ severity: 'info', summary: this.constantMessages['infoMessage']['listNameAlreadyExistMsg'] });
				setTimeout(() => {
					this.msgs = [];
				}, 3000);
			}
		});
	}

	deleteList( pageNameForUpdate? ) {
		let requestBody, method, endPoint;

		if ( pageNameForUpdate == 'Company Charges-List' ) {
			method = 'delete';
			endPoint = 'ablChargesUserList';
			requestBody = [ this.payloadObj._id, 'delete' ]
		} else if ( ['Person LinkedIn' ].includes(pageNameForUpdate) ){
			method = 'delete';
			endPoint = 'linkedInUserList';
			requestBody = [ this.payloadObj._id, 'delete'

			 ];
		} else {
			method = 'get';
			endPoint = 'deleteUserList';
			requestBody = [ this.payloadObj._id ];
		}

		this.serverCommunicate.globalServerRequestCall( method, 'DG_LIST', endPoint, requestBody ).subscribe( res => {
			this.resetDisplayModelTable.resetTable = true;
			if (res) {
				// this.getCompanyListData();
				
				this.msgs = [{ severity: 'info', detail: this.constantMessages['successMessage']['recordDeletedSuccess'] }];
				
				setTimeout(() => {
					this.msgs = [];
				}, 3000);
			}
		})
							
	}

	emailExport() {

		this.limitsDetailsForEmailsData = [];

		this.limitsDetailsForEmailsCols = [
			{ field: 'totalCompaniesCount', header: 'Total Companies', width: '80px', textAlign: 'center' },
			{ field: 'totaldomainsCount', header: 'Total Domains', width: '80px', textAlign: 'center' },
			{ field: 'companiesWithNoDomainsCount', header: 'Companies Without Domain', width: '80px', textAlign: 'center' },
			{ field: 'totalValidDomainsCount', header: 'Valid Domain', width: '80px', textAlign: 'center' },
			{ field: 'totalInvalidDomainsCount', header: 'Invalid Domain', width: '80px', textAlign: 'center' },
			{ field: 'totalEmailsCredit', header: 'Total Credit Limit', width: '80px', textAlign: 'center' },
			{ field: 'totalHitsReduceCount', header: 'Total Hits Reduce', width: '80px', textAlign: 'center' },
			{ field: 'startProcess', header: 'Action', width: '100px', textAlign: 'center' }
		]

		let requestBody = [this.payloadObj.cListId];
		this.serverCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getDetailsByListId', requestBody ).subscribe( res => {
			
			if ( res.body.code == 200 ) {

				this.limitsDetailsForEmailsData = JSON.parse(JSON.stringify(res.body.response));

				this.emailSpotterLimit = this.limitsDetailsForEmailsData[0]['totalEmailsCredit'];

				this.totalDomainCount = this.limitsDetailsForEmailsData[0]['totaldomainsCount'];

				this.totalLimitToReduce = this.limitsDetailsForEmailsData[0]['totalHitsReduceCount'];

				this.subscription_id = this.limitsDetailsForEmailsData[0]['subs_id'];

				this.subscription_endDate = this.limitsDetailsForEmailsData[0]['endData'];

				this.sharedLoaderService.hideLoader();

			}
		});
	}

	saveWatchList() {
		// if ( this.authGuardService.isLoggedin() ) {

			if ( this.userAuthService.hasFeaturePermission( 'Company Monitor' ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
				let addToMonitorObj = {
					userid: this.userDetails?.dbID,
					companyNumber: '',
					companyName: '',
					listId: this.payloadObj.inputData._id,
					listName: this.payloadObj.inputData.listName
				}

				// const userId = this.userDetails?.dbID;

				this.serverCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getUserExportLimit' ).subscribe( res => {
					let userData = res.body.results[0];
					let companyMonitorLimit = userData.companyMonitorLimit - this.payloadObj.inputData.companiesInList;

					if ( userData && userData.companyMonitorLimit > 0 && userData.companyMonitorLimit >= this.payloadObj.inputData.companiesInList ) {

						this.serverCommunicate.globalServerRequestCall( 'post', 'DG_LIST', 'saveWatchListCompanies', addToMonitorObj ).subscribe( res => {
							let data = res.body;
							if (data.status >= 200 && data.status < 300) {

								this.msgs = [];
								this.msgs.push({ severity: 'success', summary: data.message });
								setTimeout(() => {
									this.msgs = [];
								}, 2000);

								// let obj = {
								// 	userId: this.userRoleAuth.userAuthorizationDetails.dbID,
								// 	thisPage: "detailsPage",
								// 	newLimit: companyMonitorLimit
								// }

								// this.serverCommunicate.reduceExportLimit(obj);

							} else {
								this.msgs = [];
								this.msgs.push({ severity: 'info', summary: data.message });
								setTimeout(() => {
									this.msgs = [];
								}, 2000);

							}

						});

					} else {
						this.msgs = [];
						this.msgs.push({ severity: 'info', summary: this.constantMessages['limitDeductionMessage']['noLimitMonitorMessage'] });
						setTimeout(() => {
							this.msgs = [];
						}, 2000);
					}
				});

			}
		
		// }
	}

	updateTags(event) {
		this.updateTagsBoolean = true;
		this.bulklistId = this.payloadObj.inputData._id;
		this.updateTagPageName = event.pagename
	}

	showMessage( event ) {

		this.msgs = [];
		this.msgs.push( event );
		
		this.sharedLoaderService.hideLoader();
		setTimeout(() => {
			this.msgs = [];
		}, 2000);
	}

	saveWatchListPlus() {
		// if ( this.authGuardService.isLoggedin() ) {

			let addToMonitorPlusObj = {
				userid: this.userDetails?.dbID,
				companyNumber: '',
				companyName: '',
				listId: this.payloadObj.inputData._id,
				listName: this.payloadObj.inputData.listName
			}

			// const userId = this.userDetails?.dbID;

			this.serverCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getUserExportLimit' ).subscribe( res => {
				 let userData = res.body.results[0];
				let companyMonitorPlusLimit = userData.companyMonitorPlusLimit - this.payloadObj.inputData.companiesInList;

				if ( userData?.companyMonitorPlusLimit > 0 && userData?.companyMonitorPlusLimit >= this.payloadObj.inputData.companiesInList ) {

					this.serverCommunicate.globalServerRequestCall( 'post', 'DG_LIST', 'saveWatchListCompaniesPlus', addToMonitorPlusObj ).subscribe( res => {
						let data = res.body;
						
						if (data.status >= 200 && data.status < 300) {
							this.msgs = [];
							this.msgs.push({ severity: 'success', summary: data.message });
							setTimeout(() => {
								this.msgs = [];
							}, 2000);

							// let obj = {
							// 	userId: this.userRoleAuth.userAuthorizationDetails.dbID,
							// 	thisPage: "companyMonitorPlusLimit",
							// 	newLimit: companyMonitorPlusLimit
							// }

							// this.serverCommunicate.reduceExportLimit(obj);

						} else {

							this.msgs = [];
							this.msgs.push({ severity: 'info', summary: data.message });
							setTimeout(() => {
								this.msgs = [];
							}, 2000);

						}

					});

				} else {
					this.msgs = [];
					this.msgs.push({ severity: 'info', summary: this.constantMessages['limitDeductionMessage']['noLimitMonitorPlusMessage'] });
					setTimeout(() => {
						this.msgs = [];
					}, 2000);
				}
			});

		// } else {
		//     this.showUpgradePlanDialog = true;
		// }

		// } else {
		// 	// this.showLoginDialog = true;
		// }
	}

	checkEmailSpotterLimit( limitToReduce, totalLimit, domainCount ) {

		if ( domainCount > 0 ) {
			if ( totalLimit >= limitToReduce ) {
				return 'Success';
			} else {
				return 'Low_Limit';
			}
		} else {
			return 'No_Domain'
		}

	}

	saveEmailFileForSaveLists() {
		
		if ( this.checkEmailSpotterLimit( this.totalLimitToReduce, this.emailSpotterLimit, this.totalDomainCount ) === 'No_Domain' ) {

			// this.customEmailOrNotdialog = false;
			this.msgs = [];
			this.msgs.push({ severity: 'info', summary: `No domain found to start process!!` });
			setTimeout(() => {
				this.msgs = [];
			}, 3000);

		} else if ( this.checkEmailSpotterLimit( this.totalLimitToReduce, this.emailSpotterLimit, this.totalDomainCount ) === 'Low_Limit' ) {

			// this.customEmailOrNotdialog = false;
			this.msgs = [];
			this.msgs.push({ severity: 'info', summary: `Infsufficient Limit. You need minimum ${this.totalLimitToReduce} limit for this record` });
			setTimeout(() => {
				this.msgs = [];
			}, 3000);

		} else if ( this.checkEmailSpotterLimit( this.totalLimitToReduce, this.emailSpotterLimit, this.totalDomainCount ) === 'Success' ) {

			this.sharedLoaderService.showLoader();

			setTimeout(() => {
				this.sharedLoaderService.hideLoader();
				// this.customEmailOrNotdialog = false;
			}, 2000);
			
			setTimeout(() => {
				this.msgs = [];
				this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['emailExportListSuccess'] });
			}, 5000);

			let reducedLimit = this.emailSpotterLimit - this.totalLimitToReduce;

			// let obj = {
			// 	userId: this.userDetails?.dbID,
			// 	thisPage: "emailSpotter",
			// 	newLimit: reducedLimit
			// }

			// this.serverCommunicate.reduceExportLimit(obj);

			setTimeout(() => {
				this.msgs = [];
				this.msgs.push({ severity: 'info', summary: this.constantMessages['limitDeductionMessage']['emailSpotterLimitDeduction'] });
			}, 6000);

			setTimeout(() => {
				this.msgs = [];
			}, 8000);

			let reqobj = {
				file: '',
				userID: this.userDetails?.dbID,
				listID: [ this.payloadObj.listId ],
				isCSV: false,
				csvName: "",
				type: 'all',
				limit: 10,
				lastId: 0,
				positions: []
			}

			this.serverCommunicate.globalServerRequestCall( 'post', 'DG_LIST', 'emailsByCompanyDomain', reqobj ).subscribe({
				next: ( res ) => {
					if ( res['success'] == false ) {
						this.msgs = [];
						this.sharedLoaderService.hideLoader();
						// this.customEmailOrNotdialog = false;
	
						setTimeout(() => {
							this.msgs = [];
							this.msgs.push({ severity: 'warn', summary: this.constantMessages['errorMessage']['emailSpotterErrorMessage'] });
						}, 10000);
		
						setTimeout(() => {
							this.msgs = [];
						}, 11000);
					}
				},
				error: ( err ) => {
					this.msgs = [];
					this.msgs.push({ severity: 'warn', summary: this.constantMessages['errorMessage']['emailSpotterErrorMessage'] });
					this.sharedLoaderService.hideLoader();
					setTimeout(() => {
						this.msgs = [];
					}, 10000);

				}
			});

		}
	}

	dialogBoxforVerifyEmail() {
		// this.emailVerifyDialogBox = true;
		this.sharedLoaderService.showLoader();
		let obj = [ this.payloadObj.rowData._id ];
		// let limitsDetailsForEmailsVerifyData = [];
		this.serverCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'emailCountsByListID', obj ).subscribe( res => {
			if ( res.body.code == 200 ) {
				this.limitsDetailsForEmailsVerifyData = [ res.body.response ] 
				this.creditLimitForVerify = this.limitsDetailsForEmailsVerifyData[0].totalEmailsCreditCount;
				let maxReduceLimit = this.limitsDetailsForEmailsVerifyData[0].maximumTotalReduceLimitCount;
				this.verifyEmailCreditLimit = this.creditLimitForVerify >= maxReduceLimit ? false : true;
			}
			this.sharedLoaderService.hideLoader();
		} )
	}

	checkVerifyEmail() {
		
		let reqobj = {
			listID: this.payloadObj.listId,
			userID: this.userDetails?.dbID
		};

		this.serverCommunicate.globalServerRequestCall( 'post', 'DG_LIST', 'verifyEmailsByListID', reqobj ).subscribe( res => {

			if ( res.body['code'] == 200 ) {
				this.msgs = [];
				this.sharedLoaderService.hideLoader();
				// this.emailVerifyDialogBox = false;

				this.msgs = [];
				this.msgs.push({ severity: 'success', summary: "We are in the process of verifying your emails and they will appear under the Exported Emails folder shortly." })

				setTimeout(() => {
					this.msgs = [];
				}, 3000);
			}

		});

	}

	getUpdatedFieldsforBulkTag( event ) {
		this.updatedFieldsforBulkTagObj = event;
	}

}