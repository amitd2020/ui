import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { CompaniesEligibleForDataWithoutLogin } from 'src/environments/environment';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-ccjs',
	templateUrl: './ccjs.component.html',
	styleUrls: ['./ccjs.component.scss']
})
export class CcjsComponent implements OnInit {

	isLoggedIn: boolean = false;
	companyData: any;
	possibleCCJData: Array<any>;
	exactCCJData: Array<any>;
	companyRiskAssessmentAnalysisDataccjDetails: Array<any>;

	totalCCJValue: number = 0;

	exactCCJDataColumn: { field: string; header: string; minWidth: string; maxWidth: string; textAlign: string; }[];

	possibleCCJDataColumn: { field: string; header: string; minWidth: string; maxWidth: string; textAlign: string; }[];

	companiesEligibleForDataWithoutLogin = CompaniesEligibleForDataWithoutLogin;

	companyRegistrationNumber: any;
	companyRiskAssessmentAnalysisData: any;

	constructor(
		private commonService: CommonServiceService,
		public userAuthService: UserAuthService,
		private dataCommunicatorService: DataCommunicatorService,
		private sharedLoaderService: SharedLoaderService
	) { }

	ngOnInit() {

		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => this.isLoggedIn = loggedIn );
		this.dataCommunicatorService.$dataCommunicatorVar.pipe( take(1) ).subscribe( (res: any) => this.companyData = res );

		if ( this.companyData.hasPossibleCCJInfo ) {
			if ( this.isLoggedIn || ( !this.isLoggedIn && this.companiesEligibleForDataWithoutLogin.includes( this.companyData.companyRegistrationNumber ) ) ) {
				this.getPossibleCCJData();
			}
		}

		if ( this.companyData.hasCCJInfo ) {
			if ( this.isLoggedIn || ( !this.isLoggedIn && this.companiesEligibleForDataWithoutLogin.includes( this.companyData.companyRegistrationNumber ) ) ) {
				this.getExactCCJData(this.companyData['ccjDetails']);
			}
		}

	}

	getExactCCJData(data) {

		this.sharedLoaderService.showLoader();

		this.exactCCJData = data;

		if (this.exactCCJData && this.exactCCJData.length) {

			this.exactCCJData = this.exactCCJData.map((obj) => {
				obj.ccjDate = this.commonService.changeToDate(obj.ccjDate);
				if ( obj.ccjPaidDate != '' ) {
					obj.ccjPaidDate = this.commonService.changeToDate(obj.ccjPaidDate);
				}
				return obj;
			});
			//date sorting
			this.exactCCJData = this.exactCCJData.sort((a, b): any => {
				let prevDate: any = a.ccjDate,
					newDate: any = b.ccjDate;
				if (prevDate < newDate) return 1;
				if (prevDate > newDate) return -1;
			});
			// 
			this.exactCCJDataColumn = [
				{ field: 'ccjDate', header: 'Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
				{ field: 'court', header: 'Court', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
				{ field: 'ccjAmount', header: 'Amount', minWidth: '110px', maxWidth: '110px', textAlign: 'right' },
				{ field: 'ccjStatus', header: 'Status', minWidth: '130px', maxWidth: '130px', textAlign: 'center' },
				{ field: 'caseNumber', header: 'Case Number', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
				{ field: 'ccjPaidDate', header: 'Date Paid', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
				{ field: 'plantiffForeName', header: 'Plantiff ForeName', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
				{ field: 'plantiffSurName', header: 'Plantiff SurName', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
				{ field: 'plantiffName', header: 'Plantiff Name', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
				{ field: 'plantiffTelephone', header: 'Plantiff Telephone', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
				{ field: 'plantiffAddressLine1', header: 'Plantiff AddressLine1', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
				{ field: 'plantiffAddressLine2', header: 'Plantiff AddressLine2', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
				{ field: 'plantiffAddressLine3', header: 'Plantiff AddressLine3', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
				{ field: 'plantiffAddressLine4', header: 'Plantiff AddressLine4', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
				{ field: 'plantiffAddressLine5', header: 'Plantiff AddressLine5', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
				{ field: 'plantiffPostCode', header: 'Plantiff PostCode', minWidth: '150px', maxWidth: '150px', textAlign: 'left' }
			];

			if (this.exactCCJData && this.exactCCJData.length > 1) {
				this.totalCCJValue = this.exactCCJData.reduce((value1, value2) => (value1.ccjAmount ? value1.ccjAmount : value1) + value2.ccjAmount);
			} else if (this.exactCCJData && this.exactCCJData.length == 1) {
				this.totalCCJValue = this.exactCCJData[0].ccjAmount;
			}

			setTimeout(() => {
				this.sharedLoaderService.hideLoader();
			}, 1000);

		}

	}

	getPossibleCCJData() {

		this.sharedLoaderService.showLoader();

		if (this.companyData.possibleCCJDetails) {
			this.possibleCCJData = this.companyData.possibleCCJDetails;
			this.possibleCCJData = this.possibleCCJData.map((obj) => {
				obj.ccjDate = this.commonService.changeToDate(obj.ccjDate);
				obj.ccjPaidDate = this.commonService.changeToDate(obj.ccjPaidDate);
				return obj;
			})
			//date sorting
			this.possibleCCJData = this.possibleCCJData.sort((a, b): any => {
				let prevDate: any = a.ccjDate,
					newDate: any = b.ccjDate;
				if (prevDate < newDate) return 1;
				if (prevDate > newDate) return -1;
			});
			this.possibleCCJDataColumn = [
				{ field: 'ccjDate', header: 'Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
				{ field: 'court', header: 'Court', minWidth: '280px', maxWidth: 'none', textAlign: 'left' },
				{ field: 'ccjAmount', header: 'Amount', minWidth: '110px', maxWidth: '110px', textAlign: 'right' },
				{ field: 'ccjStatus', header: 'Status', minWidth: '150px', maxWidth: '150px', textAlign: 'center' },
				{ field: 'caseNumber', header: 'Case Number', minWidth: '110px', maxWidth: '110px', textAlign: 'center' },
				{ field: 'ccjPaidDate', header: 'Date Paid', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
				{ field: 'incomingRecordDetails', header: 'Registered CCJ Details', minWidth: '280px', maxWidth: '280px', textAlign: 'left' },
				{ field: 'plantiffForeName', header: 'Plantiff ForeName', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
				{ field: 'plantiffSurName', header: 'Plantiff SurName', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
				{ field: 'plantiffName', header: 'Plantiff Name', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
				{ field: 'plantiffTelephone', header: 'Plantiff Telephone', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
				{ field: 'plantiffAddressLine1', header: 'Plantiff AddressLine1', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
				{ field: 'plantiffAddressLine2', header: 'Plantiff AddressLine2', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
				{ field: 'plantiffAddressLine3', header: 'Plantiff AddressLine3', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
				{ field: 'plantiffAddressLine4', header: 'Plantiff AddressLine4', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
				{ field: 'plantiffAddressLine5', header: 'Plantiff AddressLine5', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
				{ field: 'plantiffPostCode', header: 'Plantiff PostCode', minWidth: '150px', maxWidth: '150px', textAlign: 'left' }
			];
		}

		setTimeout(() => {
			this.sharedLoaderService.hideLoader();
		}, 1000);
	}

}
