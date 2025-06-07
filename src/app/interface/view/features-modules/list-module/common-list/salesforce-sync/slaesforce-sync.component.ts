import { Component, OnInit } from '@angular/core';

import { SalesForceConstant } from 'src/environments/environment';

import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-salesforce-sync',
	templateUrl: './salesforce-sync.component.html',
	styleUrls: ['./salesforce-sync.component.scss']
})
export class SalesforceSyncComponent implements OnInit {

	queryString = window.location.search;

	msgs = [];

	userId: unknown = '';
	title: string;
	description: string;
	salesForceClientId: string;
	salesForceSecretKey: string;
	salesForceCode: string;
	salesForceConstant: any = SalesForceConstant;
	selectedSalesForceOrg: any;
	domainValue: any;
	showRequiredMessage: boolean = false;

	salesForceOrgValue: Array<any> = [
		{ label: 'Sandbox', value: 'Sandbox' },
		{ label: 'Production', value: 'Production'},
		{ label: 'Other', value: 'Other' }
	];

	constructor(
		private userAuthService: UserAuthService,
		private seoService: SeoService,
		private globalServerCommunication: ServerCommunicationService,
		private sharedLoaderService: SharedLoaderService,
	) {
		// this.breadCrumbService.setItems([
		// 	{ label: 'Salesforce Sync' }
		// ]);
		this.title = "Salesforce Sync - DataGardener";
		this.description = "Create seprate companies notes list for indvidual company status";
		// this.canonicalService.setCanonicalURL();
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
		// this.seoService.setkeywords( this.keywords );
		// this.seoService.setRobots (this.robots );
	}

	ngOnInit() {

		this.sharedLoaderService.showLoader();
		const salesForceUrlParams = new URLSearchParams(this.queryString);
		
		this.userId = this.userAuthService?.getUserInfo('dbID');

		if (salesForceUrlParams.get('code')) {
			this.salesForceCode = salesForceUrlParams.get('code');
			let obj = {
				"client_id": this.salesForceConstant.ClientId,
				"client_secret": this.salesForceConstant.SecrectKey,
				"code": this.salesForceCode,
				"callBackUrl": this.salesForceConstant.RedirectURL,
				"userId": this.userId
			}
			this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_SALESFORCE', 'salesforceRefreshTokenData', obj ).subscribe( res => {
				this.sharedLoaderService.showLoader();
				this.msgs = [];
				this.msgs = [{ severity: 'info', detail: 'Connection Established!!'}];
				this.sharedLoaderService.hideLoader();
				setTimeout(() => {
					this.msgs = [];
				}, 4000);
			});
		}
			
	}

	connectSalesforce(): any {

		if ( this.selectedSalesForceOrg == undefined ) {
			this.showRequiredMessage = true;
			return false;
		}
		if (this.domainValue.includes('https://')) {
			this.domainValue = this.domainValue.replace('https://', '');
		}
		let obj = {
			"userId": this.userId,
			"domain": this.domainValue
		}

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_SALESFORCE', 'saveSalesforceUserData', obj ).subscribe( res => {
			if (res.body.status === 200) {
				let url = "https://" + this.domainValue + "/services/oauth2/authorize?client_id=" + this.salesForceConstant.ClientId + "&redirect_uri=" + this.salesForceConstant.RedirectURL + "&response_type=code";
				window.open(url);
			}
		});	
	}

	revokeConnection(): any {

		if ( this.selectedSalesForceOrg == undefined ) {
			this.showRequiredMessage = true;
			return false;
		}

		let obj = {
			"userId" : this.userId
		}

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_SALESFORCE', 'removeTokenApi', obj ).subscribe( res => {
			if(res.body.status === 200) {
				this.msgs = [];
				this.msgs = [{ severity: 'info', detail: 'Connection has revoked!!'}];
				setTimeout(() => {
					this.msgs = [];
				}, 4000);
			}
		});
		
	}

	showDomain() {
		let tempTestValue;
		let tempProductionValue;
		if ( this.selectedSalesForceOrg == 'Sandbox' ) {
			tempTestValue = "test.salesforce.com";
			this.domainValue = tempTestValue;
		} else if ( this.selectedSalesForceOrg == 'Production' ) {
			tempProductionValue = "login.salesforce.com";
			this.domainValue = tempProductionValue
		} else if ( this.selectedSalesForceOrg == 'Other' ) {
			this.domainValue = '';
		}
	}
	
	ngAfterViewInit() {
        setTimeout(() => {
            this.sharedLoaderService.hideLoader();
        }, 1000);
	}

}
