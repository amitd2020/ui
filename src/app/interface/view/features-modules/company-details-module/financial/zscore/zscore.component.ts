import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs';

import { CompaniesEligibleForDataWithoutLogin, subscribedPlan } from 'src/environments/environment';

import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-zscore',
	templateUrl: './zscore.component.html',
	styleUrls: ['./zscore.component.scss']
})
export class ZscoreComponent implements OnInit {

	@Input() companyData: any;

	isLoggedIn: boolean = false;
	subscribedPlanModal: any = subscribedPlan;
	currentPlan: unknown;

	zScoreData: any;
	zScoreIndustryPieChartData: any;

	companiesEligibleForDataWithoutLogin = CompaniesEligibleForDataWithoutLogin;

	constructor(
		public userAuthService: UserAuthService,
		private dataCommunicatorService: DataCommunicatorService,
		private sharedLoaderService: SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService

	) { }

	ngOnInit() {
		
		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => this.isLoggedIn = loggedIn );
		this.dataCommunicatorService.$dataCommunicatorVar.pipe( take(1) ).subscribe( ( res: any ) => this.companyData = res );
		
		if ( this.isLoggedIn || ( !this.isLoggedIn && this.companiesEligibleForDataWithoutLogin.includes( this.companyData?.companyRegistrationNumber ) ) ) {
			this.currentPlan = this.userAuthService?.getUserInfo('planId');
			this.getZScoreData();
		}
	}

	getZScoreData() {

		this.sharedLoaderService.showLoader();

		let reqobj = [ this.companyData?.companyRegistrationNumber ];
		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_ISCORE', 'companyZscore', reqobj ).subscribe( res => {
			this.sharedLoaderService.hideLoader();
			let industry = this.companyData.Industries && this.companyData.Industries.SicIndustry_1 ? this.companyData.Industries.SicIndustry_1 : ""

			this.zScoreData = res.body;

			if (industry !== (undefined || null || '')) {
				let obj = [ industry ];
				this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_API', 'zScoreIndustryPieChart', obj ).subscribe( res => {
					let pieChartData = res.body;
						if ( pieChartData["status"] === 200 ) {
							this.zScoreIndustryPieChartData = pieChartData["results"]
						} else {
							this.zScoreIndustryPieChartData = []
						}
						this.sharedLoaderService.hideLoader();
					}
					,err => {
						this.zScoreIndustryPieChartData = []
						this.sharedLoaderService.hideLoader();
					})
			}else{
				this.sharedLoaderService.hideLoader();
			}
		});
	}

}
