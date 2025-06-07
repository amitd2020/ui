import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { CompaniesEligibleForDataWithoutLogin, subscribedPlan } from 'src/environments/environment';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-innovate-grant',
	templateUrl: './innovate-grant.component.html',
	styleUrls: ['./innovate-grant.component.scss']
})
export class InnovateGrantComponent implements OnInit {

	@Input() companyData: any;
	
	isLoggedIn: boolean = false;
	currentPlan: unknown;

	innovateGrantData: Array<any> = undefined;

	innovateGrantColumns: { field: string; header: string; minWidth: string; maxWidth: string; textAlign: string; }[];
	companiesEligibleForDataWithoutLogin = CompaniesEligibleForDataWithoutLogin;
	subscribedPlanModal: any = subscribedPlan;
	companyNumber: any
	constructor(
		public userAuthService: UserAuthService,
		private commonService: CommonServiceService,
		private dataCommunicatorService: DataCommunicatorService,
		private sharedLoaderService: SharedLoaderService
	) { }

	ngOnInit() {

		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => this.isLoggedIn = loggedIn );
		this.dataCommunicatorService.$dataCommunicatorVar.pipe( take(1) ).subscribe( ( res: any ) => this.companyData = res );
		
		if ( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasAddOnPermission('specialFilter') || ( !this.isLoggedIn && this.companiesEligibleForDataWithoutLogin.includes( this.companyData?.companyRegistrationNumber ) ) ) {
		
			this.sharedLoaderService.showLoader();

			this.currentPlan = this.userAuthService?.getUserInfo('planId');
			
			this.innovateGrantData = this.companyData['innovate_uk_funded_updated'] ? this.companyData['innovate_uk_funded_updated'] : [];
	
			if ( this.innovateGrantData ) {
				for ( let innovateGrantDataObj of this.innovateGrantData ) {
					innovateGrantDataObj.projectStartDate = this.commonService.changeToDate(innovateGrantDataObj.projectStartDate);
					innovateGrantDataObj.projectEndDate = this.commonService.changeToDate(innovateGrantDataObj.projectEndDate);
					innovateGrantDataObj.projectNumber = +innovateGrantDataObj.projectNumber;
					innovateGrantDataObj.actualSpendToDate = +(innovateGrantDataObj?.actualSpendToDate);
				}
			}
	
			this.innovateGrantColumns = [
				{ field: 'competitionReference', header: 'Competition Reference', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
				{ field: 'competitionTitle', header: 'Competition Title', minWidth: '220px', maxWidth: '220px', textAlign: 'left' },
				{ field: 'programmeTitle', header: 'Programme Title', minWidth: '220px', maxWidth: '220px', textAlign: 'left' },
				{ field: 'sector', header: 'Sector', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
				{ field: 'applicationNumber', header: 'Application Number', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
				{ field: 'projectNumber', header: 'Project Number', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
				{ field: 'projectTitle', header: 'Project Title', minWidth: '220px', maxWidth: '220px', textAlign: 'left' },
				{ field: 'competitionYear', header: 'Competition Year', minWidth: '150px', maxWidth: '150px', textAlign: 'center' },
				{ field: 'innovateUKProductType', header: 'Product Type', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
				{ field: 'participantName', header: 'Participant Name', minWidth: '160px', maxWidth: 'none', textAlign: 'left' },
				{ field: 'isLeadParticipant', header: 'Is Lead Participant', minWidth: '180px', maxWidth: '180px', textAlign: 'center' },
				{ field: 'crn', header: 'CRN', minWidth: '130px', maxWidth: '130px', textAlign: 'center' },
				{ field: 'projectStartDate', header: 'Start Date', minWidth: '130px', maxWidth: '130px', textAlign: 'center' },
				{ field: 'projectEndDate', header: 'End Date', minWidth: '130px', maxWidth: '130px', textAlign: 'center' },
				{ field: 'grantOffered', header: 'Grant Offered', minWidth: '130px', maxWidth: 'none', textAlign: 'right' },
				{ field: 'totalCosts', header: 'Total Cost', minWidth: '130px', maxWidth: '130px', textAlign: 'right' },
				{ field: 'actualSpendToDate', header: 'Actual Spend To Date', minWidth: '130px', maxWidth: '130px', textAlign: 'right' },
				{ field: 'participantWithdrawnFromProject', header: 'Participant Withdrawn From Project', minWidth: '140px', maxWidth: '140px', textAlign: 'left' },
				{ field: 'projectStatus', header: 'Project Status', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
				{ field: 'enterpriseSize', header: 'Enterprise Size', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
				{ field: 'postcode', header: 'Post Code', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
				{ field: 'addressRegion', header: 'Address Region', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
				{ field: 'addressLEP', header: 'Address LEP', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
				{ field: 'inMultipleLEPs', header: 'In Multiple LEPs', minWidth: '160px', maxWidth: '160px', textAlign: 'left' },
				{ field: 'industrialStrategyChallengeFund', header: 'Industrial Strategy Challenge Fund', minWidth: '160px', maxWidth: '160px', textAlign: 'left' },
				{ field: 'publicDescription', header: 'Public Description', minWidth: '400px', maxWidth: 'none', textAlign: 'left' }
			];

			setTimeout( () => {
				this.sharedLoaderService.hideLoader();
			}, 1000);

		}
		this.companyNumber = this.companyData['companyRegistrationNumber'];
	}

}
