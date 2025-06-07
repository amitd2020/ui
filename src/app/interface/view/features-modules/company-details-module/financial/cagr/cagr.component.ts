import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { CompaniesEligibleForDataWithoutLogin, subscribedPlan } from 'src/environments/environment';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-cagr',
	templateUrl: './cagr.component.html',
	styleUrls: ['./cagr.component.scss']
})
export class CagrComponent implements OnInit {

	subscribedPlanModal: any = subscribedPlan;

	CAGRdata: any;
	isLoggedIn: boolean = false;
	companyData: any;

	// spinnerBoolean: boolean = false;
	currentPlan: unknown;

	companiesEligibleForDataWithoutLogin = CompaniesEligibleForDataWithoutLogin;

	constructor(
		private userAuthService: UserAuthService,
		private dataCommunicatorService: DataCommunicatorService,
		private sharedLoaderService: SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService

	) { }

	ngOnInit() {

		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => this.isLoggedIn = loggedIn );
		this.dataCommunicatorService.$dataCommunicatorVar.pipe( take(1) ).subscribe( ( res: any ) => this.companyData = res );
		
		if ( this.isLoggedIn || ( !this.isLoggedIn && this.companiesEligibleForDataWithoutLogin.includes( this.companyData?.companyRegistrationNumber ) ) ) {
		
			this.currentPlan = this.userAuthService?.getUserInfo('planId');

			this.sharedLoaderService.showLoader();

			let reqobj = [ this.companyData.companyRegistrationNumber ];

			this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_ISCORE', 'companyCagr', reqobj ).subscribe( res => {
				this.sharedLoaderService.hideLoader();
				this.CAGRdata = res.body;
			});

		}

	}

}
