import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { subscribedPlan } from 'src/environments/environment';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';

import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../shared-loader/shared-loader.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';
import { SearchCompanyService } from '../../../features-modules/search-company/search-company.service';

@Component({
	selector: 'dg-crm-export',
	templateUrl: './crm-export.component.html',
	styleUrls: ['./crm-export.component.scss']
})
export class CrmExportComponent implements OnInit {

	@Input() tableData: any;
	@Input() appliedFilters: any = undefined;
	@Input() searchTotalCount: number;
	@Input() thisPage: string = '';

	@Output() successMessage = new EventEmitter<any>();

	constantMessages: any = UserInteractionMessages;
	subscribedPlanModal: any = subscribedPlan;

	msgs = [];

	userDetails: Partial< UserInfoType > = {};
	crmExportMessage: string= "";
	listId: string= "";
	exportCSVDialogMessage: string = undefined;
	exportListDynamicName: string;

	showLoginDialog: boolean = false;
	showUpgradePlanDialog: boolean = false;
	exportCondition: boolean = false;
	csvDialog: boolean = false;

	constructor(
		private userAuthService: UserAuthService,
		private activeRoute: ActivatedRoute,
		private sharedLoaderService: SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService,
		private searchCompanyService: SearchCompanyService
	) { }

	ngOnInit() {

		this.userDetails = this.userAuthService?.getUserInfo();

	}

	async crmLimitCheck() {

		this.sharedLoaderService.showLoader();

		// if ( this.authGuardService.isLoggedin() ) {

			if ( ( [this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], , this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Compliance_Plan'] ].includes( this.userDetails?.planId ) && this.userDetails.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) || ( this.userAuthService.hasAddOnPermission('crmExport') ) ) {

				this.crmExportMessage = " CRM";
				let userData: any = await this.globalServiceCommnunicate.getUserExportLimit();
				let dataCount: number = 0;
				let message: string = undefined;

				if (this.tableData.selection.length > 0) {
					dataCount = this.tableData.selection.length
				} else {
					if ( this.searchTotalCount >= 5000 ) {
						dataCount = 5000
					} else {
						dataCount = this.searchTotalCount;
					}
				}

				if ( dataCount <= userData.advancedLimit ) {
					this.exportCondition = true;
				} else {
					this.exportCondition = false
				}

				if ( this.exportCondition == true ) {
					message = this.constantMessages['confirmation']['crmExportAllConfirmation'];
					this.exportDialog( message );
				} else if ( this.exportCondition == false ) {
					message = this.constantMessages['infoMessage']['noExportLimitMessage'];
					this.exportDialog( message );
				}

			} else {
				this.showUpgradePlanDialog = true;
			}

		// } else {
		// 	this.showLoginDialog = true;
		// }

	}

	exportDialog( message ) {

		this.csvDialog = true;
		this.exportCSVDialogMessage = message
		this.sharedLoaderService.hideLoader();

	}

	exportAllCRM() {

		this.searchCompanyService.$apiPayloadBody.subscribe( res => {
			this.listId = res.listId;
		});

		this.csvDialog = false;
		this.crmExportMessage = "";
		let obj = {}

		obj["appliedFilters"] = this.appliedFilters;
		obj["userId"] = this.userDetails?.dbID;
		obj["emailId"] = this.userDetails?.email;
		obj["thisPage"] = this.thisPage;
		obj["userRole"] = this.userDetails?.userRole;
		obj["fileName"] = this.exportListDynamicName;
		if (this.thisPage == "companySearch") {
			this.exportListDynamicName = "DG_CRM_Export_" + new Date().getTime();
		}

		if ( this.searchTotalCount >= 5000 ) {
			obj["count"] = 5000;
		} else {
			obj["count"] = this.searchTotalCount;
		}
		obj["listId"] = this.listId;
		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'exportAllCRM', obj ).subscribe( res => {
			if ( res.body.status == 200 ) {

				this.successMessage.emit({ severity: 'success', message: '5000 credits will be deducted from your export limit.' });

			}
		});

	}

	closeExportDialog() {
		this.csvDialog = false;
		this.crmExportMessage = "";
	}

}
