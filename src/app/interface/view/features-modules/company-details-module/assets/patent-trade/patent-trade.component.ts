import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { CompaniesEligibleForDataWithoutLogin, subscribedPlan } from 'src/environments/environment';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-patent-trade',
	templateUrl: './patent-trade.component.html',
	styleUrls: ['./patent-trade.component.scss']
})
export class PatentTradeComponent implements OnInit {

	isLoggedIn: boolean;
	subscribedPlanModal: any = subscribedPlan;
	companyData: any;

	patentTradeColumns = [];

	patentTradeData: Array<any> = undefined;
	currentPlan: unknown;

	companiesEligibleForDataWithoutLogin = CompaniesEligibleForDataWithoutLogin;

	constructor(
		public userAuthService: UserAuthService,
		private dataCommunicatorService: DataCommunicatorService,
		private commonService: CommonServiceService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit() {

		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => this.isLoggedIn = loggedIn );
		this.dataCommunicatorService.$dataCommunicatorVar.pipe( take(1) ).subscribe( ( res: any ) => this.companyData = res );

		if ( this.userAuthService.hasAddOnPermission('specialFilter') || this.userAuthService.hasRolePermission( ['Super Admin'] ) || ( !this.isLoggedIn && this.companiesEligibleForDataWithoutLogin.includes( this.companyData?.companyRegistrationNumber ) ) || this.subscribedPlanModal['Valentine_Special'].includes( this.currentPlan ) ) {

			this.currentPlan = this.userAuthService?.getUserInfo('planId');
	
			this.patentTradeColumns = [
				{ field: 'ApplicationNo', header: 'Application No', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
				{ field: 'CaseID', header: 'Case Id', minWidth: '130px', maxWidth: '130px', textAlign: 'right' },
				{ field: 'CaseStatus', header: 'Case Status', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
				{ field: 'CountryOfIncorporation', header: 'Incorporated Country', minWidth: '220px', maxWidth: '220px', textAlign: 'left' },
				{ field: 'DateFiled', header: 'Filed Date', minWidth: '180px', maxWidth: '180px', textAlign: 'center' },
				{ field: 'Title', header: 'Title', minWidth: '250px', maxWidth: 'none', textAlign: 'left' }
			];
	
			this.getCompanyPatentData();

		}
		
	}
		
	getCompanyPatentData() {

		this.sharedLoaderService.showLoader();

		let cmpNo = [ this.companyData?.companyRegistrationNumber ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_COMPANY_DETAILS', 'companyPatentData', cmpNo ).subscribe( res => {
			
			if (res.body.status == 200) {
				this.patentTradeData = res.body.result;
				this.patentTradeData = this.patentTradeData.map((obj) => {
					obj.DateFiled = this.commonService.changeToDate(obj.DateFiled);
					return obj;
				});

				//date sorting
				this.patentTradeData = this.patentTradeData.sort((a, b): any => {
					let prevDate: any = a.DateFiled,
						newDate: any = b.DateFiled;
					if (prevDate < newDate) return 1;
					if (prevDate > newDate) return -1;
				});

			}

			this.sharedLoaderService.hideLoader();
		});
		

	}

}
