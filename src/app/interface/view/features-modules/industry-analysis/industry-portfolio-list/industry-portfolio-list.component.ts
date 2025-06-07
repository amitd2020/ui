import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { subscribedPlan } from 'src/environments/environment';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-industry-portfolio-list',
	templateUrl: './industry-portfolio-list.component.html',
	styleUrls: ['./industry-portfolio-list.component.scss']
})
export class IndustryPortfolioListComponent implements OnInit {

	subscribedPlanModal: any = subscribedPlan;
	currentPlan: unknown;

	industryPortfolioListTableCols: Array<any>;
	industryPortfolioListTableData: any = [];
    actionCols: any;
    payloadObj: any;
    msgs: any;
	constantMessages: any = UserInteractionMessages;

	title: string;
	resetDisplayModelTable = {
		displayModal: true,
		resetTable: false,
	};

	constructor(
		public userAuthService: UserAuthService,
		private commonService: CommonServiceService,
		private seoService: SeoService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) {
		this.commonService.createNestedBreadcrumbs([]);
		this.title = "Saved Portfolios - DataGardener";
		this.seoService.setPageTitle( this.title );
	}

	ngOnInit() {
		
		this.currentPlan = this.userAuthService?.getUserInfo('planId');

		this.initBreadcrumbAndSeoMetaTags();

		this.getPortfolioList();

		this.industryPortfolioListTableCols = [
			{ field: 'listName', header: 'List Name', width: '250px', textAlign: 'left' },
			{ field: 'companiesInList', header: 'Number of Records', width: '100px', textAlign: 'right' },
			{ field: 'created', header: 'Created On', width: '100px', textAlign: 'center' },
			{ field: 'lastUpdated', header: 'Updated On', width: '100px', textAlign: 'center' },
			{ field: 'edit', header: 'Action', width: '100px', textAlign: 'center' }
		];
		this.actionCols = [ 'Edit', 'Delete' ];

	}

	initBreadcrumbAndSeoMetaTags() {
			
		// this.breadcrumbService.setItems([
		// 	{ label: 'Saved Portfolio' }
		// ]);
	}

	getPortfolioList() {
		
		this.sharedLoaderService.showLoader();

		// let ids = [ this.userAuthService?.getUserInfo('dbID') ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_ISCORE', 'iscorePortfolioUserLists' ).subscribe(res => {

			if ( res.status == 200 ) {

				if ( res.body ) {

					this.industryPortfolioListTableData = res.body;

					for (let listData of this.industryPortfolioListTableData) {
						listData['listName'] = listData['listName'].replace(/([A-Z])/g, ' $1');
					}

				}

			} else if ( res.status == 201 ) {
				this.industryPortfolioListTableData = [];
			}
			
			this.sharedLoaderService.hideLoader();

		});

	}

	getUpdatesFromTable(event) {

		if ( event ) {
			this.getPortfolioList();
		}

	}

	getupdateActionField(event){

		this.payloadObj = event;
		switch(this.payloadObj.name) {
			case "edit":
				this.editFunction( event.listName,event.userID,event._id );
				break;
			case "delete":
				this.deleteList();
				break;
			
		}
		
	}
	editFunction(listName, userID , _id){
		let requestBody = {
			listName: this.payloadObj.listName,
			userID: this.payloadObj.userID,
			_id: this.payloadObj._id
		};

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_ISCORE', 'updatePortfolioName', requestBody ).subscribe(res => {
			if (res.status === 200) {
				this.resetDisplayModelTable.displayModal = false;
				this.getPortfolioList();
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
				this.getPortfolioList();
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

	deleteList() {
		let requestBody = [ this.payloadObj._id ];
		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_ISCORE', 'removeIscorePortfolioList', requestBody ).subscribe( res => {

			if (res) {
				this.getPortfolioList();
			
				this.msgs = [{ severity: 'info', detail: this.constantMessages['successMessage']['recordDeletedSuccess'] }];

					setTimeout(() => {
						this.msgs = [];
				}, 3000);
			}
		})
							
	}

}