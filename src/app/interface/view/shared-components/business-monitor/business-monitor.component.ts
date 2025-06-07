import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfirmationService } from 'primeng/api';

import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';

import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UnsubscribeSubscription } from 'src/app/interface/service/unsubscribe.abstract';
import { takeUntil } from 'rxjs';

@Component({
	selector: 'dg-business-monitor',
	templateUrl: './business-monitor.component.html',
	styleUrls: ['./business-monitor.component.scss'],
})
export class BusinessMonitorComponent extends UnsubscribeSubscription implements OnInit {

	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'

	userId: unknown = '';
	tableCols: any[];
	watchlistData: any[];
	selectedtableCols: Array<any>;
	msgs: Array<any> = [];
	companyDetail: any;
	pageName: string;
	watchListLimitInfo: any = {};

	constantMessages: any = UserInteractionMessages;
	featureOrAddOnTemplateType: string = '';
	featureAccessKey: string = '';

	constructor(
		private seoService: SeoService,
		private router: Router,
		public userAuthService: UserAuthService,
		private globalServerCommunication: ServerCommunicationService,
		private sharedLoaderService: SharedLoaderService,
		private confirmationService: ConfirmationService,
		private activatedRoute: ActivatedRoute
	) {
		super();
	}

	ngOnInit() {

		this.userId = this.userAuthService?.getUserInfo('dbID');

		this.activatedRoute.data.pipe( takeUntil( this.unsubscribe$ ) ).subscribe( routeData => {
			this.featureAccessKey = routeData?.featureAccessKey || routeData?.addOnKey;

			if ( routeData?.featureAccessKey ) {
				this.featureOrAddOnTemplateType = 'feature';
			}
			if ( routeData?.addOnKey ) {
				this.featureOrAddOnTemplateType = 'addOn';
			}

		});

		this.initBreadcrumbAndSeoMetaTags();
		
		if (this.router.url.match('business-monitor-plus')) {
			this.pageName = 'businessMonitorPlus';
			this.tableCols = [
				{ field: 'deleteMonitorList', header: 'Action', minWidth: '100px', maxWidth: '100px', textAlign: 'center' },
				{ field: 'companyName', header: 'Company Name', minWidth: '350px', maxWidth: 'none', textAlign: 'left' },
				{ field: 'companyNumber', header: 'Company Number', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
				{ field: 'changesMonitorPlus', header: 'Changes', minWidth: '400px', maxWidth: '400px', textAlign: 'left' },
				{ field: 'notificationWatchlist', header: 'Notification', minWidth: '150px', maxWidth: '150px', textAlign: 'center' }
			];
			
			this.getCompanyMonitorPlusData();
			
		} else if (this.router.url.match('director-watch')) {
			this.pageName = 'directorWatch';
			this.tableCols = [
				{ field: 'deleteMonitorList', header: 'Action', minWidth: '100px', maxWidth: '100px', textAlign: 'center' },
				{ field: 'directorName', header: 'Director Name', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
				{ field: 'addressChanges', header: 'Address Changes', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
				{ field: 'directorshipChanges', header: 'Directorship Changes', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
				{ field: 'directorInfoChanges', header: 'Director Info Changes', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
				{ field: 'updatedDate', header: 'Update Date', minWidth: '150px', maxWidth: '150px', textAlign: 'center' },
				{ field: 'notificationWatchlist', header: 'Notification', minWidth: '100px', maxWidth: '100px', textAlign: 'center' }
			];

			this.getDirectorWatchListData();

		} else if (this.router.url.match('business-monitor')) {
			this.pageName = 'businessMonitor';
			this.tableCols = [
				{ field: 'deleteMonitorList', header: 'Action', minWidth: '100px', maxWidth: '100px', textAlign: 'center' },
				{ field: 'companyName', header: 'Company Name', minWidth: '350px', maxWidth: 'none', textAlign: 'left' },
				{ field: 'companyNumber', header: 'Company Number', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
				{ field: 'changesMonitorNew', header: 'Latest Change', minWidth: '350px', maxWidth: '350px', textAlign: 'left' },
				{ field: 'notificationWatchlist', header: 'Notification', minWidth: '150px', maxWidth: '150px', textAlign: 'center' }
			];

			this.getCompanyWatchListData();

		}

		this.selectedtableCols = this.tableCols;

	}

	initBreadcrumbAndSeoMetaTags() {

		if (this.router.url.match('business-monitor')) {

			// this.breadcrumbService.setItems(
			// 	[
			// 		{ label: "Business Monitor" }
			// 	]
			// );

			this.title = "Business Monitor - Monitoring competitor Status- DataGardener";
			this.description = "Business Monitor and download company report with DataGardener. Get advanced alerting option to track shareholders, company's financials, group structure.";
			this.seoService.setPageTitle(this.title);
			this.seoService.setDescription(this.description);
			// this.seoService.setkeywords( this.keywords );
			// this.seoService.setRobots (this.robots );

		} else if (this.router.url.match('director-watch')) {

			// this.breadcrumbService.setItems(
			// 	[
			// 		{ label: "Director Watch" }
			// 	]
			// );

			this.title = "Director Watch - Monitoring Competitor Status- DataGardener";
			this.description = "Director Monitor and download director report with DataGardener. Get advanced alerting option to track shareholders, company's financials, group structure.";
			this.seoService.setPageTitle(this.title);
			this.seoService.setDescription(this.description);
			// this.seoService.setkeywords( this.keywords );
			// this.seoService.setRobots (this.robots );
		} 
        
        if (this.router.url.match('business-monitor-plus')) {

			// this.breadcrumbService.setItems(
			// 	[
			// 		{ label: "Business Monitor Plus" }
			// 	]
			// );

			this.title = "Business Monitor Plus - Monitoring Competitor Status- DataGardener";
			this.description = "Business Monitor Plus and download business report with DataGardener. Get advanced alerting option to track shareholders, company's financials, group structure.";
			this.seoService.setPageTitle(this.title);
			this.seoService.setDescription(this.description);
		}
	
	}

	updateTableDataList(event) {

		if ( event && event.requestFor == 'resetTable' ) {

			if ( event.pageName ==  'businessMonitor' ) {
				this.getCompanyWatchListData();
			} else if ( event.pageName == 'businessMonitorPlus' ) {
				this.getCompanyMonitorPlusData();
			} else if ( event.pageName == 'directorWatch' ) {
				this.getDirectorWatchListData();
			}

		} else {
			this.ngOnInit();
			this.sharedLoaderService.hideLoader();
		}

	}

	getCompanyWatchListData( from?: string ) {
		this.sharedLoaderService.showLoader();

		let apiPayLoad = '';
		switch ( this.activatedRoute.queryParams['_value'].listPageName ) {
			
			case 'procurementPartners':
				apiPayLoad = 'procurementPartnersList';
				break;
			case 'businessCollaborators':
				apiPayLoad = 'businessCollaboratorsList';
				break;
			case 'potentialLeads':
				apiPayLoad = 'potentialLeadsList';
				break;
			case 'fiscalHoldings':
				apiPayLoad = 'fiscalHoldingsList';
				break;		
			default:
				apiPayLoad = 'getCompleteWatchList'
				break;
		}

		// let obj = { userId: this.userId }

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', apiPayLoad ).subscribe( res => {
			this.watchListLimitInfo = res.body['totalLimitInfo'];
			
			let tempData = res.body["results"];
			this.watchlistData = [];

			tempData.forEach(rowData => {
				if (rowData.companyNumber !== undefined && rowData.companyName !== undefined) {
					this.watchlistData.push(rowData);
				}
			});

			if ( from == 'changeNotification' ) {
				this.watchlistData = this.watchlistData.filter( (a) => a.changesMonitorNew && a.changesMonitorNew.length );
			}
			setTimeout(() => {
				this.sharedLoaderService.hideLoader();
			}, 1000);
		});

	}

	getDirectorWatchListData( from?: string ) {

		this.sharedLoaderService.showLoader();
		// let obj = { userId: this.userId }
		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getWatchListDirectors' ).subscribe( res => {

			if (res.body.status == 200) {
				this.watchlistData = res.body.results;
				this.watchListLimitInfo = res.body['totalLimitInfo'];
			}

			if ( from == 'changeDirector' ) {
				this.watchlistData = this.watchlistData.filter( (a) => ( a.directorServiceAddressChanges && a.directorServiceAddressChanges.length ) || ( a.directorshipChanges && a.directorshipChanges.length ) || ( a.directorInfoChanges && a.directorInfoChanges.length ) )
			}

			setTimeout(() => {
				this.sharedLoaderService.hideLoader();
			}, 1000);
		});
		// setTimeout(() => {
		// 	this.sharedLoaderService.hideLoader();
		// }, 500);

	}

	getCompanyMonitorPlusData( from?: string ) {

		this.sharedLoaderService.showLoader();


		// let obj = { userId: this.userId } 
		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getMonitorPlusData' ).subscribe( res => {

			let tempData = res.body["results"];
			this.watchListLimitInfo = res.body['totalLimitInfo'];
			this.watchlistData = [];

			tempData.forEach(rowData => {
				if (rowData.companyNumber !== undefined && rowData.companyName !== undefined) {
					this.watchlistData.push(rowData);
				}
			});

			if ( from == 'changePlusNotification' ) {
				this.watchlistData = this.watchlistData.filter( (a) => a.changesMonitorPlus && a.changesMonitorPlus.length );
			}

			setTimeout(() => {
				this.sharedLoaderService.hideLoader();
			}, 1000);

		});
		// setTimeout(() => {
		// 	this.sharedLoaderService.hideLoader();
		// }, 500);

	}

	searchChangeNotification( event ) {

		if ( event ) {
			if ( event.pageName == 'businessMonitor' ) {
				this.getCompanyWatchListData( 'changeNotification' );
			} else if ( event.pageName == 'businessMonitorPlus' ) {
				this.getCompanyMonitorPlusData( 'changePlusNotification' );
			} else if ( event.pageName = 'directorWatch' ) {
				this.getDirectorWatchListData( 'changeDirector' );
			}
		}

	}

	removeFromWatchList( event ) {

		let obj = {
            userid: this.userId,
            companyNumber: event.companyNumber,
            companyName: event.companyName,
			pageName: ['procurementPartners', 'businessCollaborators', 'potentialLeads', 'fiscalHoldings' ].includes( this.activatedRoute.queryParams['_value'].listPageName ) ? this.activatedRoute.queryParams['_value'].listPageName : ''
        }

		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['removeCompanyMonitorList'],
			header: 'Delete Confirmation',
			icon: 'pi pi-info-circle',
			accept: () => {
				this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'removeFromWatchList', obj ).subscribe( res => {
				// this.companyService.removeFromWatchList(obj).then(data => {
					if ( res.body.status == 200 ) {
		
						this.msgs = [{ severity: 'success', detail: this.constantMessages['successMessage']['companyMonitorRemovedSuccess'] }];

						setTimeout(() => {
							this.msgs = [];
							this.getCompanyWatchListData();
						}, 2000);

					} else {

						this.msgs = [{ severity: 'error', detail: this.constantMessages['infoMessage']['errorInfoMessage'] }];

						setTimeout(() => {
							this.msgs = [];
						}, 2000);

					} 

				});
			}
		});

	}

	removeFromWatchListPlus( event ) {

		let obj = {
            userid: this.userId,
            companyNumber: event.companyNumber,
            companyName: event.companyName
        }

		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['removeCompanyMonitorListPlus'],
			header: 'Delete Confirmation',
			icon: 'pi pi-info-circle',
			accept: () => {
				this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'removeFromWatchListPlus', obj ).subscribe( res => {
				// this.companyService.removeFromWatchListPlus(obj).then(data => {
					if ( res.body.status == 200 ) {
		
						this.msgs = [{ severity: 'success', detail: this.constantMessages['successMessage']['companyMonitorPlusRemovedSuccess'] }];

						setTimeout(() => {
							this.msgs = [];
							this.getCompanyMonitorPlusData();
						}, 2000);

					} else {

						this.msgs = [{ severity: 'error', detail: this.constantMessages['infoMessage']['errorInfoMessage'] }];

						setTimeout(() => {
							this.msgs = [];
						}, 2000);

					} 

				});
			}
		});

	}

	removeDirectorFromMonitor( event ) {

		let requestObject = {
			directorsList: [ event.directorPNR ],
			userId: this.userId
		};

		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['removeDirectorMonitorList'],
			header: 'Delete Confirmation',
			icon: 'pi pi-info-circle',
			accept: () => {

				this.globalServerCommunication.globalServerRequestCall('post', 'DG_LIST', 'removeFromDirectorWatchList', requestObject ).subscribe( res => {
					if ( res.status == 200 ) {

						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['directorMonitorRemoved'] });
						
						setTimeout( () => {
							this.msgs = [];
							this.getDirectorWatchListData();
						}, 3000);
					} else if ( res.status == 201 ) {
						if ( res.message == 'Directors Already removed' ) {
							this.msgs = [];
							this.msgs.push({ severity: 'info', summary: `Director has been already removed from the monitoring list.` });
						}
					}
				});

			}
		});

    }

}
