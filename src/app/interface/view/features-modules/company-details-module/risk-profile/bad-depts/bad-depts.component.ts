import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { CompaniesEligibleForDataWithoutLogin, subscribedPlan } from 'src/environments/environment';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-bad-depts',
	templateUrl: './bad-depts.component.html',
	styleUrls: ['./bad-depts.component.scss']
})
export class BadDeptsComponent implements OnInit {

	isLoggedIn: boolean = false;
	companyData: any;

	debtorsInfoDataColumn: { field: string; header: string; minWidth: string; maxWidth: string; textAlign: string; }[];

	companyNumber: any;
	BadDebtsCount: any;
	debtorsInfoData: any;
	currentPlan: unknown;

	BadDebtsTotalAmount: number;

	companiesEligibleForDataWithoutLogin = CompaniesEligibleForDataWithoutLogin;
	subscribedPlanModal: any = subscribedPlan;

	constructor(
		public userAuthService: UserAuthService,
		private dataCommunicatorService: DataCommunicatorService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit() {

		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => this.isLoggedIn = loggedIn );
		this.dataCommunicatorService.$dataCommunicatorVar.subscribe( ( res: any ) => this.companyData = res );
		this.currentPlan = this.userAuthService?.getUserInfo('planId');

		this.companyNumber = this.companyData['companyRegistrationNumber'];
		
		if ( this.isLoggedIn || ( !this.isLoggedIn && this.companiesEligibleForDataWithoutLogin.includes( this.companyNumber ) ) ) {
			this.getDebtorsInfoData();
		}

	}

	getDebtorsInfoData() {
		this.sharedLoaderService.showLoader();

		this.debtorsInfoDataColumn = [
			{ field: 'companyNumber', header: 'Company Number', minWidth: '250px', maxWidth: '250px', textAlign: 'center' },
			{ field: 'CompanyNameOriginal', header: 'Company Name', minWidth: '320px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'AMT', header: 'Amount', minWidth: '280px', maxWidth: '280px', textAlign: 'right' },
			{ field: 'DATES', header: 'Date', minWidth: '220px', maxWidth: '220px', textAlign: 'left' }
		];

		let obj = [ this.companyData.companyRegistrationNumber ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_RISK_ASSESMENT', 'debtorsDetailInfo', obj ).subscribe( res => {
			
			if ( res.body['status'] == 200  || res.body['status'] == 404 ) {
				this.debtorsInfoData = res.body['results'];
				this.BadDebtsCount = this.debtorsInfoData.length;

				let tempNumber: number = 0;
				this.debtorsInfoData.forEach(element => {
					tempNumber = tempNumber + element.AMT;
				});
				this.BadDebtsTotalAmount = tempNumber;
			}

            this.sharedLoaderService.hideLoader();

		});

	}

}
