import { TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { subscribedPlan } from 'src/environments/environment';
import { ListPageName } from '../../features-modules/search-company/search-company.constant';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';
import { take } from 'rxjs';

@Component({
	selector: 'dg-add-contact-to-list',
	templateUrl: './add-contact-to-list.component.html',
	styleUrls: ['./add-contact-to-list.component.scss']
})

export class AddContactToListComponent implements OnInit {

	@Input() selectedCompany: Array<any>;

	@Input() selectedCompanyData: String;

	@Input() thisPage: string = '';

	@Input() appliedFilters: any = '';

	@Input() searchTotalCount: any;

	@Input() disableButton: boolean = false;

	@Output() messageCommunicator = new EventEmitter<any>();

	msgs = [];

	userDetails: Partial< UserInfoType > = {};
	isLoggedIn: boolean = false;
	favList: any;
	listArrayData: any;
	addAllToList: Boolean = false;
	listArr: Array<any> = [];
	listArray: Array<any> = [];
	companyForAddList: Array<any> = [];

	showLoginDialog: boolean = false;
	displayListModal: boolean = false;
	listBoxReset: boolean = true;
	recordsAfterFilter: boolean = false;
	isDisabled: boolean = false;
	noSpecialCharacter: RegExp = /^[A-Za-z\d\_\s]+$/;

	newCreateListName: string = "";
	subscribedPlanModal: any = subscribedPlan;
	showUpgradePlanDialog: boolean = false;
	isFeatureAccessAddCompanyList: boolean;
	showUpgradePlanDialogForClientuser: boolean = false;
	constantMessages: any = UserInteractionMessages;

	constructor(
		public userAuthService: UserAuthService,
		public titleCase: TitleCasePipe,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit(): void {

		this.isFeatureAccessAddCompanyList= this.userAuthService.hasFeaturePermission('Add Company To The List')

		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => {
			this.isLoggedIn = loggedIn;

			if ( this.isLoggedIn ) {
				this.userDetails = this.userAuthService?.getUserInfo();
			}

		});

	}

	addCompanyToList() {
		this.addAllToList = false;

		if ( this.isLoggedIn ) {

			if ( this.userAuthService.hasFeaturePermission('Add Company To The List') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {

				this.getList();
				
			} else {
				if ( this.userAuthService.hasRolePermission( ['Client User'] ) ) {
					this.showUpgradePlanDialogForClientuser = true;
				} else {
					this.showUpgradePlanDialog = true;
				}
			}
			
        } else {
            this.showLoginDialog = true;
        }

	}
	
    getList( pageSize?, pageNumber? ): void {

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
		} else {
			apiRoute = 'DG_LIST',
			apiEndpoint = 'getUserLists',
			reqobj = [ pageSize ? pageSize : 25, pageNumber ? pageNumber : 1 ]
		}

		this.globalServerCommunication.globalServerRequestCall( 'get', apiRoute, apiEndpoint, reqobj ).subscribe( res => {

			let data = res;

			  if ( data.status === 200 ) {

           	 	if ( data.hasOwnProperty("body") ) {
              		let listVal: any =  data.body.data;

              		if ( listVal.length > 0 ) {

						this.listArr = [];

						for( let i = listVal.length; i > 0; i-- ) {
							let listName, id, created, lastUpdated = "", companiesInList = 0;

							if ( listVal[i-1].hasOwnProperty("listName") ) {  

								listName = listVal[i-1]["listName"];

							} else {
								listName = "";
							}

							if ( listVal[i-1].hasOwnProperty("_id") ) {
								
								id = listVal[i-1]["_id"];

							} else {
								id = "";
							}

							if ( listVal[i-1].hasOwnProperty("createdAt") ) {

								created = listVal[i-1]["createdAt"];

							} else {
								created = "";
							}

							if ( listVal[i-1].hasOwnProperty("updatedAt") ) {

								lastUpdated = listVal[i-1]["updatedAt"];

							} else {
								lastUpdated = "";
							}

							if ( listVal[i-1].hasOwnProperty("companiesInList") ) {

								companiesInList = listVal[i-1]["companiesInList"];

							} else {
								companiesInList = 0;
							}

							this.listArr.push({
								listName: listName,
								id: id,
								created: created,
								lastUpdated: lastUpdated,
								companiesInList: companiesInList
							})
						}

						this.displayListValue();
					}
            	}

			}

			this.displayListModal = true;

      	})

    }

    displayListValue() {

      	this.listArray = [];

		for( let i = 0 ; i <  this.listArr.length ; i++ ) {

			this.listArray.push({
				"name": this.listArr[i].listName + " (" + this.listArr[i].companiesInList + ")",
				"id": this.listArr[i].id, "listName": this.listArr[i].listName
			});

		}
      	this.favList = this.listArray;
    }

    keyupSearchList( event ) {

		this.newCreateListName = event._filterValue
		  
		for ( let i = 0; i < this.listArray.length; i++ ) {

			let listName = this.listArray[i]["name"]

			if (listName.includes(this.newCreateListName)) {

				this.recordsAfterFilter = false;
				break;

			} else {

				this.recordsAfterFilter = true;
				
			}

		}

    }

	selectList(listArrData) {
		
		this.listArrayData = [];
		this.companyForAddList = [];

		this.companyForAddList = this.selectedCompany.map( val => val.companyRegistrationNumber );

		let obj = {};

		obj = {
			userId: this.userDetails?.dbID,
			listName: listArrData.listName,
			_id: listArrData.id,
			companies: this.companyForAddList,
			page: this.thisPage
		};
		if (this.companyForAddList.length) {
				let apiRoute, apiEndpoint;
				if( this.thisPage == 'I-Service Category' ) { 
					apiRoute = 'DG_ISCORE',
					apiEndpoint = 'iscoreCompaniesPortfolioList';
				} else if ( this.thisPage == ListPageName.charges.inputPage ) {
					apiRoute = 'DG_LIST',
					apiEndpoint = 'ablChargesUserList';
				} else if (['showContactScreen', 'personContactInfo'].includes( this.thisPage ) ) {
					apiRoute = 'DG_LIST',
					apiEndpoint = 'updateContactUserList';
				} else {
					apiRoute = 'DG_LIST',
					apiEndpoint = 'editListOrAddCompanies';
				}
			
				this.globalServerCommunication.globalServerRequestCall( 'post', apiRoute, apiEndpoint, obj ).subscribe(res => {

				this.selectedCompany = [];
				this.companyForAddList = [];
				this.newCreateListName = '';

				this.listBoxReset = false;

				setTimeout(() => {
					this.listBoxReset = true;
				}, 0);

				if (res.status === 200 || res.status === 202) {

					this.displayListModal = false;

					if (res.body["nModified"] === 0) {

						let msgs = 'Companies are already associated with this list';

						let obj = {
							msgs: msgs,
							status: "error"
						}

						this.messageCommunicator.emit(obj);

					} else {

						let msgs: any;

							msgs = this.constantMessages['successMessage']['addToListMessage'];

						let obj = {
							msgs: msgs,
							status: "success"
						}

						this.messageCommunicator.emit(obj);

					}

				} else if (res.status === 201) {

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

				if (error.error.code === 409) {

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

			let msgs = this.constantMessages['errorMessage']['selectCompanyToList'];

			let obj = {
				msgs: msgs,
				status: "error"
			}

			this.messageCommunicator.emit(obj);

		}
	}

    createNewList() {

		this.recordsAfterFilter = false;
		this.isDisabled = true;

		let obj = {
			listName: this.newCreateListName,
			userId: this.userDetails?.dbID,
			page: this.thisPage,
		}

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'saveContactUserList', obj ).subscribe(res => {

			let data = res.body;
			if( data.status === 200 ) {

				this.listArr.unshift({
					listName: data['body']['data']['listName'],
					id: data["body"]['data']["_id"],
					created: data["body"]['data']["createdAt"],
					lastUpdated: data["body"]['data']["updatedAt"],
				});

				let objVal = {
					listName: data["body"]['data']["listName"],
					id: data["body"]['data']["_id"]
				}

				this.newCreateListName = "";

				this.selectList( objVal );

				this.listBoxReset = false;

				setTimeout(() => {
					this.listBoxReset = true;
				}, 0);

				this.displayListModal = false;
				this.selectedCompany = [];
				
			}
		})
    }


    clearFilterField() {
      
		let obj = {
			msgs: undefined,
			status: undefined
		}

		this.messageCommunicator.emit( obj );

		this.recordsAfterFilter = true;
		this.displayListModal = false;

    }

}
