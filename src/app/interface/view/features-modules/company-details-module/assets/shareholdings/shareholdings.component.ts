import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { CompaniesEligibleForDataWithoutLogin } from 'src/environments/environment';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-shareholdings',
	templateUrl: './shareholdings.component.html',
	styleUrls: ['./shareholdings.component.scss']
})
export class ShareholdingsComponent implements OnInit {

	isLoggedIn: boolean = false;
	currentPlan: unknown;
	companyData: any;
	companyNumber: any;
	shareholderDetailData: any;
	shareHoldingData: any = {
		companyName: undefined,
		companyNumber: undefined,
		companyRegDate: undefined,
		companyStatus: undefined,
		companySicCode: undefined,
		companyType: undefined
	}

	shareHolderData: Array<any> = undefined;
	shareHolderDetailsSummaryColumnsData: Array<any> = [];
	shareHolderDetailsSummaryColumns: Array<any> = [];
	companiesEligibleForDataWithoutLogin = CompaniesEligibleForDataWithoutLogin;
	
    queryString = window.location.search;

	constructor(
		public userAuthService: UserAuthService,
		private dataCommunicatorService: DataCommunicatorService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit() {
		
		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => this.isLoggedIn = loggedIn );
		this.dataCommunicatorService.$dataCommunicatorVar.pipe( take(1) ).subscribe( ( res: any ) => this.companyData = res );

		if ( this.userAuthService.hasFeaturePermission( 'Shareholdings' ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) || ( !this.isLoggedIn && this.companiesEligibleForDataWithoutLogin.includes( this.companyData?.companyRegistrationNumber ) ) ) {

			this.currentPlan = this.userAuthService?.getUserInfo('planId');
	
			this.shareHolderDetailsSummaryColumns = [
				{ field: 'shareHoldingCompanyName', header: 'Company Name', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
				{ field: 'companyRegistrationNumber', header: 'Company Number', minWidth: '140px', maxWidth: '140px', textAlign: 'right' },
				{ field: 'shareHoldingCompanyStatus', header: 'Company Status', minWidth: '150px', maxWidth: '150px', textAlign: 'center' },
				{ field: 'shareType', header: 'Share Type', minWidth: '170px', maxWidth: '170px', textAlign: 'left' },
				{ field: 'currency', header: 'Currency', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
				{ field: 'numberOfSharesIssued', header: 'Share Count', minWidth: '130px', maxWidth: '130px', textAlign: 'right' },
				{ field: 'share_percent', header: '% of Total Share Count', minWidth: '150px', maxWidth: '150px', textAlign: 'right' },
				{ field: 'value', header: 'Nominal Value', minWidth: '120px', maxWidth: '120px', textAlign: 'right' },
				{ field: 'sic_code', header: 'Sic Code', minWidth: '500px', maxWidth: 'none', textAlign: 'left' }
			];

			this.getCompanyShareholdings();

		}
		this.companyNumber = this.companyData['companyRegistrationNumber'];
	}

	getCompanyShareholdings() {

		this.sharedLoaderService.showLoader();
		
		let obj = [ this.companyData?.companyRegistrationNumber ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_COMPANY_DETAILS', 'companyShareHoldings', obj ).subscribe( res => {
			
			if ( res.body['status'] == 200 ) {
				this.shareholderDetailData = JSON.parse( JSON.stringify( res.body['results'] ) );
				this.shareholderDetailData = this.formatShareHoldingData( this.shareholderDetailData );
			}
			
			if ( this.shareholderDetailData && this.shareholderDetailData != undefined ) {

				if (this.shareholderDetailData.shareholdings && this.shareholderDetailData.shareholdings.length > 0 ) {
	
					this.shareHolderDetailsSummaryColumnsData = [];
	
					for ( let companyShareholdings of this.shareholderDetailData.shareholdings ) {
	
						this.shareHolderDetailsSummaryColumnsData.push( companyShareholdings );
					   
						if ( companyShareholdings["companyInformation"]["businessName"] !== null || companyShareholdings["companyInformation"]["businessName"] !== undefined || companyShareholdings["companyInformation"]["companyStatus"] !== null || companyShareholdings["companyInformation"]["companyStatus"] !== undefined ) {
							companyShareholdings['shareHoldingCompanyName'] = companyShareholdings["companyInformation"]["businessName"];
							companyShareholdings['shareHoldingCompanyStatus'] = companyShareholdings["companyInformation"]["companyStatus"];
						}
					}
					
					this.shareHoldingData["companyName"] = this.shareholderDetailData["businessName"];
					this.shareHoldingData["companyNumber"] = this.shareholderDetailData["companyRegistrationNumber"];
					this.shareHoldingData["companyRegDate"] = this.shareholderDetailData["companyRegistrationDate"];
					this.shareHoldingData["companyStatus"] = this.shareholderDetailData["companyStatus"];
					this.shareHoldingData["companyType"] = this.shareholderDetailData["companyType"];
					this.shareHoldingData["companySicCode"] = this.shareholderDetailData["sicCode07"];
					
				}

			}

			setTimeout(() => {
				this.sharedLoaderService.hideLoader();
			}, 1000);
		});

	}

	formatShareHoldingData(dataArray: { shareholdings: any[]; }) {


		dataArray.shareholdings.forEach(element => {

			if (element.totalShareCount !== undefined && element.totalShareCount !== null && element.totalShareCount > 0) {

				element["share_percent"] = ((element.numberOfSharesIssued * element.value) / element.totalShareCount) * 100
				element["share_percent"] = parseFloat(element["share_percent"]).toFixed(2);
			} else {
				element["share_percent"] = ""
			}
			if (element.companyInformation && element.companyInformation.sicCode07) {
				element['sic_code'] = element.companyInformation.sicCode07;
			}

		});		
		return dataArray;
	}

}
