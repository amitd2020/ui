import { TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { subscribedPlan } from 'src/environments/environment';
import { SharedLoaderService } from '../shared-loader/shared-loader.service';
import { SearchCompanyService } from '../../features-modules/search-company/search-company.service';
import { ListPageName } from '../../features-modules/search-company/search-company.constant';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';
import { lastValueFrom, takeUntil } from 'rxjs';
import { UnsubscribeSubscription } from 'src/app/interface/service/unsubscribe.abstract';
import { WorkflowService } from '../../features-modules/workflow/workflow.service';
import { WorkflowPageType } from '../../features-modules/workflow/workflow-cards.index';
import { Message } from 'primeng/api';

@Component({
	selector: 'dg-add-company-to-list',
	templateUrl: './add-company-to-list.component.html',
	styleUrls: ['./add-company-to-list.component.scss']
})
export class AddCompanyToListComponent extends UnsubscribeSubscription implements OnInit {

	@Input() selectedCompany: Array<any>;
	@Input() selectedCompanyData: String;
	@Input() thisPage: string = '';
	@Input() appliedFilters: Array<any> = [];
	@Input() searchTotalCount: any;
	@Input() disableButton: boolean = false;
	@Input() defaultSearchData: boolean = false;
	@Input() addAllListOfCompArr: any;
	@Input() selectedSavedListDataObj : any;
	@Input() searchQuery : any;
	@Input() filterSearchArray: any;
	@Input() queryId: String;
	@Output() messageCommunicator = new EventEmitter<any>();

	isLoggedIn: Boolean = false;
	userDetails: Partial< UserInfoType > = {};
	msgs = [];

	favList: any;
	listArrayData: any = [];
	referenceKeyword: string = '';
	addAllToList: Boolean = false;
	listArr: Array<any> = [];
	listArray: Array<any> = [];
	companyForAddList: Array<any> = [];
	companiesWithGbNumber: any[]  = [];
	noticeIdentifier: any[] = [];
	contractFinderTableValueId: any[] = [];
	activatedRoutePageName: any;
	preparedPayloadForAddList: PayloadFormationObj = {};
	showLoginDialog: boolean = false;
	displayListModal: boolean = false;
	WorkflowPageAddToListDialouge: boolean = false;
	listBoxReset: boolean = true;
	recordsAfterFilter: boolean = false;
	isDisabled: boolean = false;
	isFeatureAccessAddCompanyList: boolean = false;
	noSpecialCharacter: RegExp = /^[A-Za-z\d\_\s]+$/;

	newCreateListName: string = "";
	noteMessage: string = "";
	subscribedPlanModal: any = subscribedPlan;
	showUpgradePlanDialog: boolean = false;
	showUpgradePlanDialogForClientuser: boolean = false;
	constantMessages: any = UserInteractionMessages;
	alreadyExistsMsz: Message[] | undefined;

    constructor(
		public titleCase: TitleCasePipe,
		public userAuthService: UserAuthService,
		private sharedLoaderService: SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService,
		public activatedRoute: ActivatedRoute,
		private searchCompanyService: SearchCompanyService,
		private _workflowService: WorkflowService
    ) {
		super();
	}

	ngOnInit() {

		this.userAuthService.isLoggedInSubject$.pipe( takeUntil( this.unsubscribe$ ) ).subscribe( ( loggedIn: boolean ) => {
			
			this.isLoggedIn = loggedIn;
			
			if ( this.isLoggedIn ) {
				this.isFeatureAccessAddCompanyList = this.userAuthService.hasFeaturePermission('Add Company To The List');
				this.userDetails = this.userAuthService?.getUserInfo();
			}

		});

		this.searchCompanyService.$apiPayloadBody.subscribe( res => {
			this.preparedPayloadForAddList = res;
        });
		
    }

	addCompanyToListHandeler() {

		let fromWorkflow = this.activatedRoute.snapshot['_routerState'].url.split( '/' ).filter( val => val );

 		if ( fromWorkflow && fromWorkflow?.length && fromWorkflow[0] == 'workflow' ) {
			this.WorkflowPageAddToListDialouge = true;
		} else {
			this.addCompanyToList();
		}

	}

	async addCompaniesToWorkflowList() {

		let objForWorkflow = {
			"userId": this.userDetails?.dbID,
    		"listName": this._workflowService.getActiveListParams.listName,
    		"_id": this._workflowService.getActiveListParams.cListId,
    		"companies": this.addAllListOfCompArr,
    		"referenceName": this.referenceKeyword
		}

		if ( !objForWorkflow._id ) {
			const { listName } = objForWorkflow;
			const page = this._workflowService.getActiveListParams.listPageName;
			const AddNewListAPIres = await lastValueFrom( this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'addListForAUser', { listName, page } ) );
			objForWorkflow._id = AddNewListAPIres.body._id;

			this._workflowService.updateListId( listName, objForWorkflow._id )
		}

		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'editListOrAddCompanies', objForWorkflow ).subscribe( res => { 
			if(  typeof res.body == "string" ){
				this.referenceKeyword = ''
				this.WorkflowPageAddToListDialouge = false;
				this.alreadyExistsMsz = [{ severity: 'error', summary: res.body }];
				setTimeout(() => {
					this.alreadyExistsMsz=[];
				}, 3000);
			} else{
				this._workflowService.updateWorkflowList();	
			}			
		});
	}

    addCompanyToList() {

		this.listArrayData = [];
		this.listBoxReset = false;
		setTimeout(() => {
			this.listBoxReset = true;
		}, 100);

		this.addAllToList = false;

		if ( !this.isLoggedIn ) {
			this.showLoginDialog = true;
			return;
        }

		if ( this.userAuthService.hasFeaturePermission('Add Company To The List') || this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.thisPage == "companyListOfIServiceCategoryPage" ) {

			this.noteMessage = this.thisPage == 'showChargesTablePage' ? '*Note: Only 1,000 companies can be added at a time.' : '*Note: Only 10,000 companies can be added at a time.'

			// this.addAllToList = true;

			this.noteMessage = "";
			this.getList();
			
		} else {
			if ( this.userAuthService.hasRolePermission( ['Client User'] ) ) {
				this.showUpgradePlanDialogForClientuser = true;
			} else {
				this.showUpgradePlanDialog = true;
			}
		}

	}
	
	addAllCompanyToList() {

		this.listArrayData = [];
		this.listBoxReset = false;
		setTimeout(() => {
			this.listBoxReset = true;
		}, 100);

		if ( !this.isLoggedIn ) {
			this.showLoginDialog = true;
			return;
		}

		if ( this.userAuthService.hasFeaturePermission( 'Add Company To The List' ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {

			this.noteMessage = this.thisPage == 'showChargesTablePage' ? '*Note: Only 1,000 companies can be added at a time.' : '*Note: Only 10,000 companies can be added at a time.'

			this.addAllToList = true;

			this.getList();

		} else {
			if ( this.userAuthService.hasRolePermission( ['Client User'] ) ) {
				this.showUpgradePlanDialogForClientuser = true;
			} else {
				this.showUpgradePlanDialog = true;
			}
		}

	}

    async getList( pageSize?, pageNumber? ) {

		this.sharedLoaderService.showLoader();

		let apiRoute = 'DG_LIST', apiEndpoint, reqInput, getUserListAPIRequest;
		
		if ( this.thisPage == 'companyListOfIServiceCategoryPage' || this.thisPage == 'iScorePortfolioListPage' ) {

			apiRoute = 'DG_ISCORE';
			apiEndpoint = 'iscorePortfolioUserLists';
			// reqInput = [ this.userDetails?.dbID ];

		} else if ( this.thisPage == 'showChargesTablePage' ) {

			apiEndpoint = 'getAblChargesUserList';
			// reqInput = [ this.userDetails?.dbID ];
			
		} else if ( ['personContactInfo', 'showContactScreen'].includes( this.thisPage ) ) {
			
			apiEndpoint = 'contactUserList';
			reqInput = [  pageSize ? pageSize : 25, pageNumber ? pageNumber : 1 ];
			
		}  
		// else if ( [ 'personLinkedIn', 'personLinkedInCsv' ].includes( this.thisPage)) {
		// 	apiEndpoint = 'personLinkedInLists';
			
		// } 
		else if (  ['connectPlusPeople', 'connectPlusCompany', 'personLinkedInCsv', 'companyLinkedInCsv'].includes( this.thisPage) ) {	
			apiEndpoint = 'connectPlusLists';
			let pageName = this.thisPage;
			pageName = pageName == 'personLinkedInCsv' ? 'connectPlusPeople' : pageName == 'companyLinkedInCsv' ? 'connectPlusCompany' : pageName;
			reqInput = [  { key: 'pageName', value: pageName } ];

		} else if ( this.thisPage == 'contractFinderPage' ) {
			apiEndpoint = 'governmentProcurementLists';
		} else {
			// let pageName = this.activatedRoute.snapshot.queryParams['listPageName']

			if ( this.activatedRoute?.snapshot?.queryParams?.['listPageName'] ) {
				this.activatedRoutePageName = this.activatedRoute?.snapshot?.queryParams?.['listPageName'].replace(/\s/g,'');
			}
			if ( this.preparedPayloadForAddList?.pageName  || this.activatedRoutePageName ) {

				apiEndpoint = 'getUserListsByUserId';
				reqInput = [
					{ key: 'userId', value: this.userDetails?.dbID },
					{ key: 'pageName', value: this.activatedRoutePageName ? this.activatedRoutePageName : this.getOutputListPageName( this.preparedPayloadForAddList?.pageName ) },
					{ key: 'limit', value: pageSize ? pageSize : 25, },
					{ key: 'skip', value: pageNumber ? pageNumber : 0 }
				];

			} else {

				apiEndpoint = 'getUserLists';
				reqInput = [ pageSize ? pageSize : 25, pageNumber ? pageNumber : 1 ];

			}

		}

		if ( apiEndpoint === 'getUserListsByUserId' || apiEndpoint == 'connectPlusLists' ) {

			getUserListAPIRequest = await lastValueFrom( this.globalServiceCommnunicate.globalServerRequestCall( 'get', apiRoute, apiEndpoint, undefined, undefined, reqInput ) );

		} else if ( apiEndpoint === 'personLinkedInLists' ) {

			getUserListAPIRequest = await lastValueFrom( this.globalServiceCommnunicate.globalServerRequestCall( 'get', apiRoute, apiEndpoint ) );

		} else {
			getUserListAPIRequest = await lastValueFrom( this.globalServiceCommnunicate.globalServerRequestCall( 'get', apiRoute, apiEndpoint, reqInput ) );
		}

		if ( getUserListAPIRequest ) {

			if ( getUserListAPIRequest.status === 200 ) {
	
					if ( getUserListAPIRequest.hasOwnProperty("body") ) {
					
					  let listVal: any = [ 'companyListOfIServiceCategoryPage', 'showChargesTablePage' ].includes( this.thisPage ) ? getUserListAPIRequest.body : [ 'personLinkedIn','personLinkedInCsv', 'connectPlusPeople', 'connectPlusCompany', 'companyLinkedInCsv' ].includes( this.thisPage ) ?  getUserListAPIRequest.body.result : this.thisPage == 'contractFinderPage' ? getUserListAPIRequest.body.result :  getUserListAPIRequest.body.results;
	
					  if( listVal.length > 0 ) {
	
						this.listArr = [];
	
						for( let i = listVal.length; i > 0; i-- ) {
	
							let listName, id, created, lastUpdated = "", companiesInList = 0, companiesProfileIdInList = 0;
	
							if( listVal[i-1].hasOwnProperty("listName") ) {  
	
								listName = listVal[i-1]["listName"];
	
							} else {
								listName = "";
							}
	
							if( listVal[i-1].hasOwnProperty("_id") ) {
								
								id = listVal[i-1]["_id"];
	
							} else {
								id = "";
							}
	
							if( listVal[i-1].hasOwnProperty("created") ) {
	
								created = listVal[i-1]["created"];
	
							} else {
								created = "";
							}
	
							if( listVal[i-1].hasOwnProperty("lastUpdated") ) {
	
								lastUpdated = listVal[i-1]["lastUpdated"];
	
							} else {
								lastUpdated = "";
							}
	
							if( listVal[i-1].hasOwnProperty("companiesInList") ) {
	
								companiesInList = listVal[i-1]["companiesInList"];
	
							} else if( listVal[i-1].hasOwnProperty("companiesProfileIdInList") ) {
								companiesProfileIdInList = listVal[i-1]["companiesProfileIdInList"];
							}
							else {
								companiesInList = 0;
								companiesProfileIdInList = 0;

							}
	
							if( ![ "Exported Bucket", "exported bucket", "EXPORTED BUCKET", "Exported bucket", "Exported_bucket", "exported_Bucket", "EXPORTED_BUCKET", "EXPORTEDBUCKET", "exported_bucket", "exportedbucket", "exportedBucket", "Exportedbucket" ].includes( listVal[i-1]["listName"] ) ) {
	
								this.listArr.push({
									listName: listName,
									id: id,
									created: created,
									lastUpdated: lastUpdated,
									companiesInList: companiesInList,
									companiesProfileIdInList: companiesProfileIdInList

								});
	
								// let formatedPage = ['Company Trade-list','Company Charges-List'].includes( listVal[i-1]["page"] ) ? listVal[i-1]["page"] : listVal[i-1]["page"].replace(/([A-Z])/g, ' $1');
	
								// if ( this.activatedRoute.queryParams['_value'].listPageName == formatedPage ) {
	
								// }
							
							}
	
						}
						
						this.displayListValue();
						
					}
	
				}
	
			}
	
			this.newCreateListName = '';
			this.listArrayData = []
	
			this.displayListModal = true;
			
		}
		
		this.sharedLoaderService.hideLoader();

    }

    displayListValue() {

      	this.listArray = [];

		for( let i = 0 ; i <  this.listArr.length ; i++ ) {

			if( this.thisPage == 'showChargesTablePage' ) {
				
				this.listArray.push({
					"name": this.titleCase.transform(this.listArr[i].listName) + " (" + this.listArr[i].companiesInList.length + ")",
					"id": this.listArr[i].id, "listName": this.listArr[i].listName
				});
				
			} else if( [ 'personLinkedIn', 'personLinkedInCsv', 'contractFinderPage', 'connectPlusPeople', 'connectPlusCompany', 'companyLinkedInCsv' ].includes(this.thisPage)) {
				this.listArray.push({
					"name": this.listArr[i].listName + " (" + this.listArr[i].companiesProfileIdInList + ")",
					"id": this.listArr[i].id, "listName": this.listArr[i].listName
				});
			} else {
				this.listArray.push({
					"name": this.listArr[i].listName + " (" + this.listArr[i].companiesInList + ")",
					"id": this.listArr[i].id, "listName": this.listArr[i].listName
				});
			}

		}

      	this.favList = this.listArray;

    }

    keyupSearchList( event ) {

		this.newCreateListName = event.target.value;
    
		for ( let i = 0; i < this.listArray.length; i++ ) {

			let listName = this.listArray[i]["name"]

			if (listName.includes(this.newCreateListName) || [ "Exported Bucket", "exported bucket", "EXPORTED BUCKET", "Exported bucket", "Exported_bucket", "exported_Bucket", "EXPORTED_BUCKET", "EXPORTEDBUCKET", "exported_bucket", "exportedbucket", "exportedBucket", "Exportedbucket"].includes(this.newCreateListName)) {

				this.recordsAfterFilter = false;
				break;

			} else {

				this.recordsAfterFilter = true;
				
			}

		}

    }

    selectList( listArrData, msg? ) {

		let matchedList,
			listCount = 0;

		if ( listArrData && listArrData.length ) {

			matchedList = this.listArr.filter( list => listArrData.id == list.id )[0];
			listCount = matchedList.companiesInList && matchedList.companiesInList.length ? matchedList.companiesInList.length : 0;

		}


		this.listArrayData = [];
		this.companyForAddList = [];
		this.companiesWithGbNumber = [];
		
		if ( [ 'companySearch', 'showTradeTablePage', 'companyDescription', 'accountSearch', 'webWidgetPage', 'investorFinderPage', 'investeeFinderPage', 'promptSearchAi' ].includes( this.thisPage ) ) {
			
			for ( let data of this.selectedCompany ) {

				if ( data.companyRegistrationNumber ) {
					this.companyForAddList.push(data.companyRegistrationNumber);
				}

			}
			
		} else if ( [ 'personLinkedIn', 'connectPlusPeople'].includes(this.thisPage) ) {
			
			for ( let data of this.selectedCompany ) {

				if ( data?.profile_id ) {
					this.companyForAddList.push(data.profile_id);
				}

			}

		} else if ( [  'connectPlusCompany' ].includes(this.thisPage) ) {
			
			for ( let data of this.selectedCompany ) {

				if ( data?.profile_id ) {
					this.companyForAddList.push({ 'profileId': data.profile_id, 'company_reg': data.company_reg });
				}

			}

		} else if ( this.thisPage === 'company' ) {

			this.companyForAddList.push( this.selectedCompany );
			
		} else if (  ['showChargesTablePage', 'buyersDashboard','suppliersDashboard' ].includes( this.thisPage ) ) {
			
			if ( this.selectedCompanyData && typeof(this.selectedCompanyData) == "string" ) {

				this.companyForAddList.push(this.selectedCompanyData);

			} else {

				for ( let data of this.selectedCompany ) {
					if ( data.companyRegistrationNumber ) {
						this.companyForAddList.push( data.companyRegistrationNumber );
					}
				}

			}
			
		} else if ( this.thisPage === 'companyListOfIServiceCategoryPage' ) {

			if ( this.selectedCompanyData && typeof(this.selectedCompanyData) == "string") {

				this.companyForAddList.push(this.selectedCompanyData);

			} else {

				for ( let data of this.selectedCompany ) {
					if ( data.companyRegistrationNumber ) {
						this.companyForAddList.push( data.companyRegistrationNumber );
					}
				}

			}

		} else if ( [ 'uploadCsvPage', 'companyLinkedInCsv', 'personLinkedInCsv' ].includes(this.thisPage) ) {
			this.companyForAddList = this.addAllListOfCompArr;
		} else if ( [ 'otherRelatedCompanies' ].includes(this.thisPage) ) {
			
			for ( let data of this.selectedCompany ) {

				if ( data?.companyNumber ) {
					this.companyForAddList.push(data.companyNumber);
				}

			}

		}
		else if ( [ 'chargesDescription' ].includes(this.thisPage) ) {
			
			for ( let data of this.selectedCompany ) {

				if ( data?.companyRegistrationNumber ) {
					this.companyForAddList.push(data.companyRegistrationNumber);
				}

			}

		}
		else if ( this.thisPage == 'contractFinderPage' ) {
			this.noticeIdentifier = [];
			this.contractFinderTableValueId = [];
			this.companyForAddList = [];
			this.companiesWithGbNumber = [];
			for( let data of this.selectedCompany ) {
				if ( data.hasOwnProperty('notice_identifier')) {
					this.noticeIdentifier.push( data?.notice_identifier )
				}
				if ( data.hasOwnProperty('id')) {
					this.contractFinderTableValueId.push( data?.id )
				}
				if ( data.hasOwnProperty('organisationReg') ) {
					this.companyForAddList.push( data.organisationReg )
				} else if( data.hasOwnProperty('customOrganisationReg') ) {
					this.companiesWithGbNumber.push( data.customOrganisationReg );
				}
			}
		}
		
		if ( !this.addAllToList ) {

			let addCompanyListparam = this.activatedRoute.snapshot.queryParams
			let obj = {};
			
			if ( this.thisPage == 'companyListOfIServiceCategoryPage' ) {

				obj = {
					listName: ( listArrData && listArrData.listName ) ? listArrData.listName : this.newCreateListName,
					userId: this.userDetails?.dbID,
					page: "I-Service Category",
					companies: this.companyForAddList,
					industryType: addCompanyListparam.industryType,
					iservice_category: addCompanyListparam.category
				};

			} else if ( this.thisPage == 'showChargesTablePage' ) {

				let charges_chip_values = [];
			
				// charges_chip_values = this.appliedFilters[1].chip_values;

				obj = {
					listName: ( listArrData && listArrData.listName ) ? listArrData.listName : this.newCreateListName,
					userId: this.userDetails?.dbID,
					pageName: ListPageName.charges.inputPage,
					companies: this.companyForAddList,
					chargesPersonEntitled: this.preparedPayloadForAddList.filterData,
					_id: (listArrData && listArrData.id) ? listArrData.id : obj['_id']
				};

			} else {

				obj = {
					userId: this.userDetails?.dbID,
					listName: listArrData.listName ? listArrData.listName : this.newCreateListName,
					_id: (listArrData && listArrData.id) ? listArrData.id : obj['_id'],
					companies: this.companyForAddList
				};

				if ( this.thisPage == 'otherRelatedCompanies' ) {
					obj['reqBy'] = this.thisPage;
				}

			}
			if ( this.companyForAddList.length || this.companiesWithGbNumber.length ) {

				let apiRoute, apiEndpoint;

				if( ['companyListOfIServiceCategoryPage'].includes( this.thisPage ) ) { 
					apiRoute = 'DG_ISCORE',
					apiEndpoint = 'iscoreCompaniesPortfolioList';
				} else if ( this.thisPage == 'showChargesTablePage' ) {
					apiRoute = 'DG_LIST',
					apiEndpoint = 'addChargesCompaniesToList';
				} else if (['showContactScreen', 'personContactInfo'].includes( this.thisPage ) ) {
					apiRoute = 'DG_LIST',
					apiEndpoint = 'updateContactUserList';
				} else if ( this.thisPage == 'contractFinderPage' ) {
					apiRoute = 'DG_LIST';
					apiEndpoint = 'editListOrAddGovernmentProcurement';
					obj['customOrganisationReg'] = this.companiesWithGbNumber.length ? this.companiesWithGbNumber : [];
					obj['organisationReg'] = this.companyForAddList.length ? this.companyForAddList : [];
					obj['noticeIdentifier'] = this.noticeIdentifier;
					obj['id'] = this.contractFinderTableValueId;
				} 
				else {
					if( this.preparedPayloadForAddList && this.preparedPayloadForAddList?.pageName == "companyChargesListPage" ) { 
						apiRoute = 'DG_LIST',
						apiEndpoint = 'addChargesCompaniesToList';
						obj['pageName'] = "Company Charges-List"
						obj['chargesPersonEntitled'] = []
					} else if( [ 'personLinkedIn', 'personLinkedInCsv', 'connectPlusPeople', 'connectPlusCompany', 'companyLinkedInCsv' ].includes(this.thisPage) ){
						apiRoute = 'DG_LIST',
						apiEndpoint = 'editListOrAddLinkedinId';
						obj['profileId'] = this.companyForAddList;
						obj['companies'] = []
					} else {
						apiRoute = 'DG_LIST',
						apiEndpoint = 'editListOrAddCompanies';
					}
				}

				let listAddlistCount = listCount + this.companyForAddList.length;

				if ( listAddlistCount <= 50000 ) {

					obj = this.thisPage == 'webWidgetPage' ? { ...obj, companies: [ ...new Set( this.companyForAddList ) ] } : obj;

					this.globalServiceCommnunicate.globalServerRequestCall( 'post', apiRoute, apiEndpoint, obj ).subscribe(res => {
					
						this.companyForAddList = [];
						this.companiesWithGbNumber = [];
						this.newCreateListName = '';

						this.listBoxReset = false;
		
						setTimeout(() => {
							this.listBoxReset = true;
						}, 100);
		
						if (res.status === 200 || res.status === 202) {
		
							this.displayListModal = false;
		
							if (res.body["nModified"] === 0) {
		
								let msgs = 'Companies are already associated with this list';
		
								let obj = {
									msgs: msgs,
									status: "error"
								}
		
								this.messageCommunicator.emit(obj);
		
							} else if( res.body.status == 401 ) {
								let obj = {
									msgs: res.body.result,
									status: "info"
								}

								this.messageCommunicator.emit(obj);

							} else {
								
								let msgs: any;

								// if(this.thisPage == 'showChargesTablePage' ){
								// 	msgs = this.constantMessages['successMessage']['chargesListCreateSuccess'];
								// } else {
									msgs = this.thisPage == 'uploadCsvPage' ? this.constantMessages['successMessage']['addToListMessage'] + ' ' + '( ' + listArrData['listName'] + ' )' : this.constantMessages['successMessage'][msg];
								// }
								
		
								let obj = {
									msgs: msgs,
									status: "success"
								}

								this.messageCommunicator.emit(obj);
		
							}
		
						} else if (res.status === 201 ) {
		
							this.displayListModal = false;
		
							let msgs = this.constantMessages['errorMessage']['companyAlreadyExist'];
		
							let obj = {
								msgs: msgs,
								status: "error"
							}
		
							this.messageCommunicator.emit(obj);
		
						}
		
					}, error => {
						let msgs;

						if ( error.error.code === 409 ) {

							this.displayListModal = false;

							msgs = this.constantMessages['errorMessage']['companyAlreadyExist'];

						} else {

							msgs = 'Companies are not added!';
						}
				
						let obj = {
							msgs: msgs,
							status: "error"
						}
		
						this.messageCommunicator.emit(obj);
		
					});
				
				} else {

					this.displayListModal = false;
					let msgs = this.constantMessages['errorMessage']['companyAdded50000Only'];
					let obj = {
						msgs: msgs,
						status: "info"
					}

					this.messageCommunicator.emit(obj);

				};

			} else {
	
				this.displayListModal = false;

				let msgs = this.constantMessages['errorMessage']['selectCompanyToList'];

				let obj = {
					msgs: msgs,
					status: "error"
				}

				this.messageCommunicator.emit(obj);

			}

		} else {
			let apiRoute = 'DG_LIST'
			
			let obj = {
				userId: this.userDetails?.dbID,
				listName: listArrData && listArrData.listName,
				_id: listArrData && listArrData.id,
			},
			endpoint;

			if ( [ 'accountSearch', 'companyDescription' ].includes( this.thisPage ) ) {
				obj['q'] = this.searchQuery;
				endpoint = 'allCompaniesAddToList';
				obj['pageName'] =  this.thisPage
				
			} else if ( this.thisPage == 'showChargesTablePage' ) {
				endpoint = 'addChargesCompaniesToList';

				obj['filterData'] = this.appliedFilters;
				obj['listName']= ( listArrData && listArrData.listName ) ? listArrData.listName : this.newCreateListName;
				obj['userId']= this.userDetails?.dbID;
				obj['pageName']= ListPageName.charges.inputPage;
				obj['companies']= this.companyForAddList;
				obj['chargesPersonEntitled']= this.preparedPayloadForAddList.filterData;
				obj['listId'] = this.preparedPayloadForAddList?.listId ? this.preparedPayloadForAddList.listId : this.activatedRoute.snapshot.queryParams['cListId'] ? this.activatedRoute.snapshot.queryParams['cListId'] : '';

			} else if ( [ 'personLinkedIn', 'connectPlusPeople', 'connectPlusCompany' ].includes(this.thisPage) ) {
				obj['filterData'] = this.appliedFilters.length ? this.appliedFilters : this.preparedPayloadForAddList.filterData;
				obj['listId'] = this.preparedPayloadForAddList?.listId ? this.preparedPayloadForAddList.listId : this.activatedRoute.snapshot.queryParams['cListId'] ? this.activatedRoute.snapshot.queryParams['cListId'] : '';
				endpoint = 'companyLinkedInDataAddToList';
				obj['pageName'] =  this.thisPage

			} else if ( this.thisPage == 'contractFinderPage' ) {
				this.preparedPayloadForAddList.filterData.map( item => {
					if ( item['chip_industry_sic_codes'] ) {
						item['chip_industry_cpv_codes'] = JSON.parse( JSON.stringify( item['chip_industry_sic_codes'] ) );
						delete item['chip_industry_sic_codes'];
					}
					return item;
				});
				endpoint = 'govermentProcurementDataAddToList';
				obj['pageName'] = 'govermentProcurement';
				obj['filterData'] = this.preparedPayloadForAddList.filterData;
				obj['listId'] = this.preparedPayloadForAddList.listId;
			}  else if( this.thisPage == 'promptSearchAi' ) {
				endpoint = 'aiSearchList';
				apiRoute = 'DG-PROMPT-AI'
				obj['queryId'] = this.queryId;

			} else {
				obj['filterData'] = this.appliedFilters.length ? this.appliedFilters : this.preparedPayloadForAddList.filterData;
				obj['listId'] = this.preparedPayloadForAddList?.listId ? this.preparedPayloadForAddList.listId : this.activatedRoute.snapshot.queryParams['cListId'] ? this.activatedRoute.snapshot.queryParams['cListId'] : '';
				endpoint = 'addAllToList';
				obj['page'] =  this.thisPage;
			}

			this.globalServiceCommnunicate.globalServerRequestCall( 'post', apiRoute, endpoint, obj ).subscribe( res => {

				if (res.body.status === 200) {

					this.newCreateListName = "";
					this.displayListModal = false;

					let msgs = this.constantMessages['successMessage']['addToListMessage'];

					let obj = {
						msgs: msgs,
						status: "success"
					}
		
					this.listBoxReset = false;
		
					setTimeout(() => {
						this.listBoxReset = true;
					}, 100);

					this.messageCommunicator.emit(obj);

				} else if (res.body.status === 201) {

					this.displayListModal = false;

					let msgs = this.constantMessages['errorMessage']['companyAlreadyExist'];

					let obj = {
						msgs: msgs,
						status: "error"
					}

					this.messageCommunicator.emit(obj);

				} else if (res.body.status === 401) {

					this.displayListModal = false;

					let msgs =  res.body.result ? res.body.result : res.body.message;
 
					let obj = {
						msgs:  msgs,
						status: "info"
					}

					this.messageCommunicator.emit(obj);

				}
				else {
					this.displayListModal = false;
					let msgs = 'Companies are not added!';

					let obj = {
						msgs: msgs,
						status: "error"
					}

					this.messageCommunicator.emit(obj);

				}

			}, error => {

				let msgs = "You can't add more than 10000 comapnies in a list";

				let obj = {
					msgs: msgs,
					status: "error"
				}

				this.messageCommunicator.emit(obj);

			});
			return
		}
	}

    createNewList( msg ) {

		this.recordsAfterFilter = false;
		this.isDisabled = true;
		if ( this.thisPage == 'companyListOfIServiceCategoryPage' ) {
			this.selectList( this.listArrayData, msg );
			return;
		}
		if ( this.thisPage == 'showChargesTablePage' ) {
			this.selectList( this.listArrayData, msg );
			return;
		}
		// if ( this.selectedSavedListDataObj.listPageName != undefined ) {
		// 	this.thisPage = this.selectedSavedListDataObj.listPageName == 'companyListpage' ? 'Company Trade-list' : this.thisPage;
		// }

		if ( this.addAllToList ) {
			// let result = this.appliedFilters.find(item => item.chip_group === 'Saved Lists' );
			let apiRoute = 'DG_LIST';
			let obj = {
				userId: this.userDetails?.dbID,
				listName: this.newCreateListName,
				pageName: ['businessMonitor', 'businessMonitorPlus', 'businessWatch', 'diversityCalculation' ].includes(this.activatedRoute.snapshot.queryParams['listPageName']) ? this.activatedRoute.snapshot.queryParams['listPageName'] : this.thisPage == 'showTradeTablePage' ? 'Company Trade-list' : this.thisPage == 'otherRelatedCompanies' ? 'companySearch' : this.thisPage == 'contractFinderPage' ? 'govermentProcurement' : this.thisPage,
				_id: undefined,

			}, endpoint;

			if ( this.thisPage == 'otherRelatedCompanies' ) {
				obj['reqBy'] = this.thisPage;
			}

			if ( [ 'companyDescription' ].includes( this.thisPage ) ) {
				obj['filterData'] = this.appliedFilters;
				endpoint = 'allCompaniesAddToList';
				obj['pageName'] =  this.thisPage
				
			} else if ( this.thisPage == 'accountSearch' ) {
				obj['filterData'] = this.appliedFilters;
				endpoint = 'allCompaniesAddToList';
				obj['pageName'] =  this.thisPage;
				obj['listId'] = this.preparedPayloadForAddList.listId;
				
			} else if ( ['connectPlusCompany', 'personLinkedIn', 'connectPlusPeople' ].includes(this.thisPage) ) {
				obj['filterData'] = this.appliedFilters.length ? this.appliedFilters : this.preparedPayloadForAddList.filterData;
				endpoint = 'companyLinkedInDataAddToList';
				obj['pageName'] = this.thisPage,
				obj['listId'] = this.selectedSavedListDataObj?.cListId ? this.selectedSavedListDataObj.cListId : this.activatedRoute.snapshot.queryParams['cListId'] ? this.activatedRoute.snapshot.queryParams['cListId'] : this.preparedPayloadForAddList?.listId ? this.preparedPayloadForAddList.listId : '';

			} else if ( this.thisPage == 'contractFinderPage' ) {
				this.preparedPayloadForAddList.filterData.map( item => {
					if ( item['chip_industry_sic_codes'] ) {
						item['chip_industry_cpv_codes'] = JSON.parse( JSON.stringify( item['chip_industry_sic_codes'] ) );
						delete item['chip_industry_sic_codes'];
					}
					return item;
				});
				endpoint = 'govermentProcurementDataAddToList';
				obj['filterData'] = this.preparedPayloadForAddList.filterData;
				obj['listId'] = this.preparedPayloadForAddList.listId;
				obj['filterSearchArray'] = this.filterSearchArray;
 			} else if( this.thisPage == 'promptSearchAi' ) {
				endpoint = 'aiSearchList';
				apiRoute = 'DG-PROMPT-AI'
				obj['queryId'] = this.queryId;
				obj['listId'] = this.preparedPayloadForAddList.listId;

			} else {
				obj['filterData'] = this.appliedFilters;
				obj['listId'] = this.selectedSavedListDataObj?.cListId ? this.selectedSavedListDataObj.cListId : this.activatedRoute.snapshot.queryParams['cListId'] ? this.activatedRoute.snapshot.queryParams['cListId'] : this.preparedPayloadForAddList?.listId ? this.preparedPayloadForAddList.listId : '';
				endpoint = 'addAllToList';
			}

			this.globalServiceCommnunicate.globalServerRequestCall( 'post', apiRoute, endpoint, obj ).subscribe( res => {
				if ( res.body.status === 200 ) {

					this.displayListModal = false;

					let msgs = this.constantMessages['successMessage']['addToListMessage'];

					let obj = {
						msgs: msgs,
						status: "success"
					}

					this.messageCommunicator.emit(obj);

				} else if (res.body.status === 201) {

					this.displayListModal = false;

					let msgs = this.constantMessages['errorMessage']['companyAlreadyExist'];

					let obj = {
						msgs: msgs,
						status: "error"
					}

					this.messageCommunicator.emit(obj);

				} 
			}, error => {

				let msgs = 'Companies are not added!';

				let obj = {
					msgs: msgs,
					status: "error"
				}

				this.messageCommunicator.emit(obj);
				return
			});
	
			this.newCreateListName = "";

			this.listBoxReset = false;

			setTimeout(() => {
				this.listBoxReset = true;
			}, 100);

			this.displayListModal = false;
			if ( this.thisPage !== 'company' ) {
				this.selectedCompany = [];
			}
			// this.selectedCompany = [];

		}

		let obj = {
			listName: this.newCreateListName,
			userId: this.userDetails?.dbID,
			page: [ 'uploadCsvPage', 'otherRelatedCompanies', 'company' ].includes(this.thisPage) ? 'companySearch' : this.thisPage == 'showTradeTablePage' ? 'Company Trade-list' : this.thisPage == 'companyLinkedInCsv' ? 'connectPlusCompany' : this.thisPage == 'personLinkedInCsv' ? 'connectPlusPeople' : this.thisPage == 'contractFinderPage' ? 'govermentProcurement' : this.activatedRoute.snapshot.queryParams['listPageName'] == 'diversityCalculation' ? 'diversityCalculation' : this.thisPage
		}
		if ( this.thisPage == 'otherRelatedCompanies' ) {
			obj['reqBy'] = this.thisPage;
		}

		if ( !this.addAllToList ) {
			this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'addListForAUser', obj ).subscribe( res => {
				let data = res;
				if( data.status === 200 ) {
	
					this.listArr.unshift({
	
						listName: data['body']['listName'],
						id: data["body"]["_id"],
						created: data["body"]["created"],
						lastUpdated: data["body"]["lastUpdated"],
					});
	
					let objVal = {	
						listName: data["body"]["listName"],
						id: data["body"]["_id"]	
					}
	
					this.newCreateListName = "";
	
					this.selectList( objVal, msg );
	
					this.listBoxReset = false;
	
					setTimeout(() => {
						this.listBoxReset = true;
					}, 100);
	
					this.displayListModal = false;
					// this.selectedCompany = [];
					if ( ![ 'otherRelatedCompanies', 'company' ].includes( this.thisPage ) ) {
						this.selectedCompany = [];
					}
				}
			})

		}

    }

    clearFilterField() {
		this.listArrayData= [];
		this.listBoxReset = false;
		setTimeout(() => {
			this.listBoxReset = true;
		}, 100);

		this.newCreateListName = "";
		let obj = {
			msgs: undefined,
			status: undefined
		}

		this.messageCommunicator.emit( obj );

		this.recordsAfterFilter = false;
		this.displayListModal = false;

    }

	getOutputListPageName( inputPageName: string ): string {

		let outputPageName = '';

		switch ( inputPageName.toLowerCase() ) {
			case ListPageName.company.inputPage.toLowerCase():
				outputPageName = ListPageName.company.outputPage;
				break;
			case ListPageName.charges.inputPage.toLowerCase():
				outputPageName = ListPageName.charges.outputPage;
				break;
			case ListPageName.trade.inputPage.toLowerCase():
				outputPageName = ListPageName.trade.outputPage;
				break;
			case ListPageName.diversityInclusion.inputPage.toLowerCase():
				outputPageName = ListPageName.diversityInclusion.outputPage;
				break;
			case ListPageName.businessMonitor.inputPage.toLowerCase():
				outputPageName = ListPageName.businessMonitor.outputPage;
				break;
			case ListPageName.businessMonitorPlus.inputPage.toLowerCase():
				outputPageName = ListPageName.businessMonitorPlus.outputPage;
				break;
			case ListPageName.businessWatch.inputPage.toLowerCase():
				outputPageName = ListPageName.businessWatch.outputPage;
				break;

			case ListPageName.company.outputPage.toLowerCase():
				outputPageName = ListPageName.company.inputPage;
				break;
			case ListPageName.charges.outputPage.toLowerCase():
				outputPageName = ListPageName.charges.inputPage;
				break;
			case ListPageName.trade.outputPage.toLowerCase():
				outputPageName = ListPageName.trade.inputPage;
				break;
			case ListPageName.diversityInclusion.outputPage.toLowerCase():
				outputPageName = ListPageName.diversityInclusion.inputPage;
				break;
			case ListPageName.businessMonitor.outputPage.toLowerCase():
				outputPageName = ListPageName.businessMonitor.inputPage;
				break;
			case ListPageName.businessMonitorPlus.outputPage.toLowerCase():
				outputPageName = ListPageName.businessMonitorPlus.inputPage;
				break;
			case ListPageName.businessWatch.outputPage.toLowerCase():
				outputPageName = ListPageName.businessWatch.inputPage;
				break;
			case ListPageName.accountSearch.inputPage.toLowerCase():
				outputPageName = ListPageName.accountSearch.inputPage;
				break;
			case ListPageName.accountSearch.outputPage.toLowerCase():
				outputPageName = ListPageName.accountSearch.inputPage;
				break;
			case ListPageName.companyDescription.inputPage.toLowerCase():
				outputPageName = ListPageName.companyDescription.inputPage;
			break;
			case ListPageName.companyDescription.outputPage.toLowerCase():
				outputPageName = ListPageName.companyDescription.inputPage;
				break;
			case ListPageName.suppliers.inputPage.toLowerCase():
				outputPageName = ListPageName.suppliers.inputPage;
				break;	
			case ListPageName.buyers.inputPage.toLowerCase():
				outputPageName = ListPageName.buyers.inputPage;
				break;	
			case ListPageName.contractFinder.inputPage.toLowerCase():
				outputPageName = ListPageName.contractFinder.inputPage;
				break;	
			case ListPageName.otherRelatedCompanies.inputPage.toLowerCase():
				outputPageName = ListPageName.otherRelatedCompanies.inputPage;
				break;	
			default:
				outputPageName = '';
				break;
		}

		if ( outputPageName === 'Company Search' ) {
			outputPageName = outputPageName.toLowerCase().replace( /[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase() );
		}

		return outputPageName;

	}

}
