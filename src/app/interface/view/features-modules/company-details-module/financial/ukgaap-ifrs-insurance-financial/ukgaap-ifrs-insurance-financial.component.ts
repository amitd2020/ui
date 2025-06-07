import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';

import { subscribedPlan } from 'src/environments/environment';

import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-ukgaap-ifrs-insurance-financial',
	templateUrl: './ukgaap-ifrs-insurance-financial.component.html',
	styleUrls: ['./ukgaap-ifrs-insurance-financial.component.scss']
})
export class UkgaapIfrsInsuranceFinancialComponent implements OnInit {

	companyData: any;
	ukGaapIfrsInsuranceFinancialDataValues: Array<any>;
	financialDataObject: Object = undefined;
	headingName: String;
	currentPlan: unknown;

	subscribedPlanModal: any = subscribedPlan;

	constructor(
		private userAuthService: UserAuthService,
		private dataCommunicateService: DataCommunicatorService,
		private sharedLoaderService: SharedLoaderService
	) { }

	ngOnInit() {
		
		this.sharedLoaderService.showLoader();

		this.dataCommunicateService.$dataCommunicatorVar.pipe( take(1) ).subscribe( ( res: any ) => this.companyData = res );

		this.currentPlan = this.userAuthService?.getUserInfo('planId');

		if ( this.companyData.accountTypeData && this.companyData.accountTypeData.length > 0 ) {
			this.ukGaapIfrsInsuranceFinancialDataValues = this.companyData.accountTypeData;
			this.ukGaapIfrsInsuranceFinancialDataValues = [this.ukGaapIfrsInsuranceFinancialDataValues];
			this.headingName = this.companyData.hasUkgaapData ? "UKGAAP" : this.companyData.hasIfrsData ? "International Financial Reporting Standards" : this.companyData.hasInsuranceData ? "Insurance" : this.companyData.hasFinancialAccountTypeData ? "UKGAAP Financial" : "";
		} else {
			this.ukGaapIfrsInsuranceFinancialDataValues = undefined;
		}

		this.financialDataObject = { 'ukGaapIfrsInsuranceFinancialDataValues': this.ukGaapIfrsInsuranceFinancialDataValues };

		this.checkPlanAndFeatures();

	}

	ngAfterViewInit() {
        setTimeout(() => {
            this.sharedLoaderService.hideLoader();
        }, 1000);
	}

	checkPlanAndFeatures() {

		if ( this.headingName == "International Financial Reporting Standards" ) {

			if ( ( ( [ this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Compliance_Plan'] ] ).includes( this.currentPlan ) ) || ( this.userAuthService.hasAddOnPermission('specialFilter') || this.userAuthService.hasAddOnPermission('internationalTradeFilter') ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {

				return true;

			}

		} else {

			if ( ( ( [ this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Compliance_Plan'] ] ).includes( this.currentPlan ) ) || ( this.userAuthService.hasAddOnPermission('specialFilter') ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {

				return true;

			}

		}

		return false;

	}

}
