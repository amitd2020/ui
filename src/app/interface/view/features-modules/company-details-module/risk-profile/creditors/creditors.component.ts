import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-creditors',
	templateUrl: './creditors.component.html',
	styleUrls: ['./creditors.component.scss']
})
export class CreditorsComponent implements OnInit {

	isLoggedIn: boolean = false;
	companyData: any;

	creditorsInfoData: Array<any>;

	creditorsInfoDataColumn: { field: string; header: string; minWidth: string; maxWidth: string, textAlign: string; }[];

	companyDetails: any;

	creditorsCount: number;
	creditorsTotalAmount: number;

	constructor(
		public userAuthService: UserAuthService,
		private dataCommunicatorService: DataCommunicatorService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit() {

		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => this.isLoggedIn = loggedIn );
		this.dataCommunicatorService.$dataCommunicatorVar.pipe( take(1) ).subscribe( ( res: any ) => this.companyData = res );

		if ( this.isLoggedIn ) {
			this.getCreditorsInfoData();
		}

	}

	getCreditorsInfoData() {
		this.creditorsInfoDataColumn = [
			{ field: 'companyNumber', header: 'Company Number', minWidth: '250px', maxWidth: '250px', textAlign: 'center' },
			{ field: 'CompanyNameOriginal', header: 'Company Name', minWidth: '320px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'AMT', header: 'Amount', minWidth: '280px', maxWidth: '280px', textAlign: 'right' },
			{ field: 'DATES', header: 'Date', minWidth: '220px', maxWidth: '220px', textAlign: 'left' }
		];

		let obj = [ this.companyData.companyRegistrationNumber ];
		
		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_RISK_ASSESMENT', 'creditorsDetailInfo', obj ).subscribe( res => {
			if ( res.body['status'] == 200  || res.body['status'] == 404) {
				this.creditorsInfoData = res.body['results'];
				this.creditorsCount = this.creditorsInfoData.length;

				let tempNumber: number = 0;
				this.creditorsInfoData.forEach(element => {
					tempNumber = tempNumber + element.AMT;
				});
				this.creditorsTotalAmount = tempNumber;

			}
		});
	}

}
