import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-all-user-list',
	templateUrl: './all-user-list.component.html',
	styleUrls: ['./all-user-list.component.scss']
})
export class AllUserListComponent implements OnInit {

	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'

	freeUser: any;
	paidUser: any;
	totalUser: any;
	userDetail: any;
    userDetails: any;
	selectedRecordTableCols: any;

	constructor(
		private userAuthService: UserAuthService,
		private seoService: SeoService,
		private changeDetectionService: ChangeDetectorRef,
		private sharedLoaderService:SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) {}

	ngOnInit() {

		this.initBreadcrumbAndSeoMetaTags();
		
		localStorage.removeItem("clientMasterEmail");

		localStorage.removeItem("clientMasterEmail");

		if ( this.userAuthService.hasRolePermission( ['Client Admin Master', 'Client Admin', 'Team Admin'] ) ) {

			this.selectedRecordTableCols = [
				{ field: 'edit', header: 'Edit', width: '65px', textAlign: 'center' },
				{ field: 'username', header: 'Name', width: '250px', textAlign: 'left' },
				{ field: 'phoneNumber', header: 'Phone Number', width: '120px', textAlign: 'right' },
				{ field: 'email', header: 'Email', width: '250px', textAlign: 'left' },
				{ field: 'teamName', header: 'Team', width: '200px', textAlign: 'left' },
				{ field: 'logInTime', header: 'Last Login', width: '110px', textAlign: 'center' },
				{ field: 'changeToClient', header: 'Action', width: '250px', textAlign: 'center' }
			];

			if (  this.userAuthService.hasRolePermission( ['Client Admin Master', 'Client Admin'] ) ) {
				this.getClientUsersList();
			}
			if (  this.userAuthService.hasRolePermission( ['Team Admin'] ) ) {
				this.getTeamUsersList();
			}

		}

	}

	getAllUsersList( pageSize?: number, startAfter?: number, filterSearchArray?: any[], sortOn?: any[] ) {

		let reqBody = {
			'pageSize' : pageSize ? pageSize : 25,
			'startAfter' : startAfter ? startAfter : 1,
			'filterSearchArray' : filterSearchArray ? filterSearchArray : [],
			'sortOn': sortOn ? sortOn : []
		}

		this.sharedLoaderService.showLoader();

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'allUsersList', reqBody ).subscribe( res => {

			this.userDetails = res.body;

			setTimeout(() => {
				this.sharedLoaderService.hideLoader();
			}, 1000);

			this.changeDetectionService.detectChanges();

		});

	}

	getClientUsersList( pageSize?: number, startAfter?: number , filterSearchArray?: any[], sortOn?: any[], clientAdminEmail?: string) {
		let reqBody = {
			'pageSize' : pageSize ? pageSize : 25,
			'startAfter' : startAfter ? startAfter : 1,
			'clientAdminEmail': clientAdminEmail ? clientAdminEmail : this.userAuthService?.getUserInfo('clientAdminEmail'),
			'isAdmin':  this.userAuthService.hasRolePermission( ['Super Admin'] ),
			'email': this.userAuthService?.getUserInfo('email'),
			'filterSearchArray' : filterSearchArray ? filterSearchArray : [],
			'sortOn': sortOn ? sortOn : []
		}
		
		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'clientUsersList', reqBody ).subscribe( res => {

			this.userDetails = res.body;

			for ( let res of this.userDetails.userDetails ) {
				res[ 'logInTime' ] = res.logInTime ?  this.dateFormatter(res.logInTime) : '';
			}

			for ( let tempUserDetails of this.userDetails.userDetails ) {

				if ( tempUserDetails.userRole == "Client Admin" || tempUserDetails.userRole == 'Client Admin Master') {
					tempUserDetails['isClientAdminCheck'] = true;
				} else {
					tempUserDetails['isClientAdminCheck'] = false;
				}
			}
			setTimeout(() => {
				this.sharedLoaderService.hideLoader();
			}, 1000);

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

	getTeamUsersList( pageSize?: number, startAfter?: number ,clientAdminEmail?: string) {
		let reqBody = {
			'pageSize' : pageSize ? pageSize : 25,
			'startAfter' : startAfter ? startAfter : 1,
			'clientAdminEmail': clientAdminEmail ? clientAdminEmail : this.userAuthService?.getUserInfo('email')
		}

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'teamUsersList', reqBody ).subscribe( res => {
			
			this.userDetails = res.body;

			setTimeout(() => {
				this.sharedLoaderService.hideLoader();
			}, 1000);

			this.changeDetectionService.detectChanges();

		});

	}

	getupdateDataAfterPagination(event) {

		if (  this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
			this.getAllUsersList(event.pageSize, event.startAfter, event.filterSearchArray, event.sortOn );
		}

		if (  this.userAuthService.hasRolePermission( ['Client Admin Master', 'Client Admin'] ) ) {
			this.sharedLoaderService.showLoader();
			this.getClientUsersList(event.pageSize, event.startAfter, event.filterSearchArray, event.sortOn);
		}

		if (  this.userAuthService.hasRolePermission( ['Team Admin'] ) ) {
			this.getTeamUsersList(event.pageSize, event.startAfter);
		}

	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems([
		// 	{ label: 'User Management' }
		// ]);
		this.title = "User Management - DataGardener";
		this.description = "Use our User Management dashboard and assign datagardener access to your team.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
		// this.seoService.setkeywords( this.keywords );
		// this.seoService.setRobots (this.robots );

	}

}
