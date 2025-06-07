import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { CompaniesEligibleForDataWithoutLogin } from 'src/environments/environment';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-shareholders',
	templateUrl: './shareholders.component.html',
	styleUrls: ['./shareholders.component.scss']
})
export class ShareholdersComponent implements OnInit {

	isLoggedIn: boolean = false;
	companyNumber: any;
	shareHolderData: Array<any> = undefined;
	shareHolderDataColumn: any[];
	shareHolderDataLength: number = 0;
	companiesEligibleForDataWithoutLogin = CompaniesEligibleForDataWithoutLogin;

	constructor(
		public userAuthService: UserAuthService,
		private titlecasePipe: TitleCasePipe,
		private dataCommunicatorService: DataCommunicatorService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit() {

		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => { this.isLoggedIn = loggedIn; });
		this.dataCommunicatorService.$dataCommunicatorVar.pipe( take(1) ).subscribe( ( res: any ) => { this.companyNumber = res.companyRegistrationNumber; });

		if ( this.userAuthService.hasFeaturePermission( 'Shareholders' ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) || ( !this.isLoggedIn && this.companiesEligibleForDataWithoutLogin.includes( this.companyNumber ) ) ) {
			this.getShareHolderData();
		}

	}
	
	getShareHolderData() {
		this.sharedLoaderService.showLoader();

		let obj = [ this.companyNumber ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_COMPANY_DETAILS', 'shareDetails', obj ).subscribe(res => {
			
			this.shareHolderDataLength = res.body["results"].length;
			this.sharedLoaderService.hideLoader();
			this.shareHolderData = res.body["results"];
			this.shareHolderDataColumn = [
				{ field: 'full_name', header: 'Name', minWidth: '150px', maxWidth: 'none', textAlign: 'left', visible: true },
				// { field: 'shareHolderAsCompanyStatus', header: 'Status', minWidth: '150px', maxWidth: '150px', textAlign: 'center', visible: true },
				{ field: 'shareType', header: 'Share Type', minWidth: '160px', maxWidth: '160px', textAlign: 'left', visible: true },
				{ field: 'currency', header: 'Currency', minWidth: '150px', maxWidth: '150px', textAlign: 'left', visible: true },
				{ field: 'numberOfSharesIssued', header: 'Share Count', minWidth: '120px', maxWidth: '120px', textAlign: 'right', visible: true },
				{ field: 'percentage_share', header: '% of Total Share Count', minWidth: '120px', maxWidth: '120px', textAlign: 'right', visible: true },
				{ field: 'value', header: 'Nominal Value', minWidth: '90px', maxWidth: '90px', textAlign: 'right', visible: true },
				{ field: 'shareHolderEmail', header: 'Email', minWidth: '180px', maxWidth: '180px', textAlign: 'left', visible: ( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasAddOnPermission('contactInformation') ) }
			];


			for (let shareHolder of this.shareHolderData) {

				let full_name = "";
				let shareholder_Address = "";

				if (shareHolder.share_holders_details.shareholderForename) {

					full_name = shareHolder.share_holders_details.shareholderForename;

				}
				if (shareHolder.share_holders_details.shareholderSurname) {

					full_name += ' ' + shareHolder.share_holders_details.shareholderSurname;

				}
				if (shareHolder.share_holders_details.shareholderAddress1) {
					shareholder_Address += this.titlecasePipe.transform(shareHolder.share_holders_details.shareholderAddress1) + ', '
				}
				if (shareHolder.share_holders_details.shareholderAddress2) {
					shareholder_Address += this.titlecasePipe.transform(shareHolder.share_holders_details.shareholderAddress2) + ', '
				}
				if (shareHolder.share_holders_details.shareholderAddress3) {
					shareholder_Address += this.titlecasePipe.transform(shareHolder.share_holders_details.shareholderAddress3) + ', '
				}
				if (shareHolder.share_holders_details.shareholderAddress4) {
					shareholder_Address += this.titlecasePipe.transform(shareHolder.share_holders_details.shareholderAddress4) + ', '
				}
				if (shareHolder.share_holders_details.shareholderAddress5) {
					shareholder_Address += this.titlecasePipe.transform(shareHolder.share_holders_details.shareholderAddress5) + ', '
				}
				if (shareHolder.share_holders_details.shareholderPostcode) {
					shareholder_Address += shareHolder.share_holders_details.shareholderPostcode.toUpperCase();
				}
				if (shareHolder["value"]) {
					shareHolder["value"] = parseFloat(shareHolder["value"].toFixed(2));
				}

				// shareHolder["full_name"] = full_name;
				shareHolder["shareholder_Address"] = shareholder_Address;

				// let shareHolderNameObj = {
				// 	name: shareHolder.full_name,
				// 	link: shareHolder.share_holder_reg,
				// }

				// shareHolder['shareHolderName'] = shareHolderNameObj;
				shareHolder['full_name'] = full_name;
				shareHolder['shareHolderAsCompanyStatus'] = shareHolder['companyStatus'];
				shareHolder['percentage_share'] = parseFloat(shareHolder['percentage_share']).toFixed(2);
			}

		});
	}

}
