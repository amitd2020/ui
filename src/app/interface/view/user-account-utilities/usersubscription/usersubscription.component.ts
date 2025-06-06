import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { limit_data, subscription_data } from 'src/app/interface/models/subscription-model';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { subscribedPlan } from 'src/environments/environment';
import { SharedLoaderService } from '../../shared-components/shared-loader/shared-loader.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserAddOnType,  UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';

@Component({
	selector: 'dg-usersubscription',
	templateUrl: './usersubscription.component.html',
	styleUrls: ['./usersubscription.component.scss']
})
export class UsersubscriptionComponent implements OnInit {

	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'

	userDetails: Partial< UserInfoType > = {};
	subscribedPlanModal: any = subscribedPlan;

	limitData: limit_data[];
	subscriptionData: subscription_data[];
	limitcols: any[];
	subscriptioncols: any[];
	tempLimitDetails: any[];
	limit_obj_array: Array<any> = [];
	subscribtion_obj_array: Array<any> = [];
	user_active_plan_id = "";
	user_active_plan_name = "";
	user_active_plan_cost: Number;
	acceptedTermNCondition_Date: any;
	joinDate: string = undefined;
	paidPlanId: string = this.subscribedPlanModal['Monthly_Expand'];
	termsAndConditioncols: { field: string; header: string; width: string; textAlign: string; }[];
	selectedTermsAndConditionCols: { field: string; header: string; width: string; textAlign: string; }[];
	login_details: any;
	// dbId: string;

	termConditionArray = [{
		description: undefined,
		acceptedDate: undefined,
		pdfButton: undefined
	}];

	addOnNgModel: UserAddOnType = {};
	selectedGlobalCurrency: string = 'GBP';
	constructor(
		public userAuthService: UserAuthService,
		private datePipe: DatePipe,
		private router: Router,
		private seoService: SeoService,
		private commonService: CommonServiceService,
		private sharedLoaderService: SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService
	) { }

	ngOnInit() {
		
		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';

		this.sharedLoaderService.showLoader();
		// this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_LOGIN', 'userAuthorization' ).subscribe( res => {
		// 	if (res.status == 200){
		// 		this.dbId = res.body.results.dbID
		// 	}
		// });
		
		this.initBreadcrumbAndSeoMetaTags();
		
		this.userDetails = this.userAuthService?.getUserInfo();
		this.addOnNgModel = this.userAuthService?.getUserAddOnList;

		if ( !this.userAuthService.hasRolePermission( ['Client User', 'Team Admin'] ) ) {
			this.getSubscriptionDetails();
		}

		this.limitcols = [
			{ field: 'serialNum', header: 'Sr.No.', width: '20px', textAlign: 'center' },
			{ field: 'feature', header: 'Feature', width: '100px', textAlign: 'left' },
			{ field: 'total_Limit', header: 'Limit Granted', width: '70px', textAlign: 'right' },
			{ field: 'limit_Available', header: 'Limit Available', width: '70px', textAlign: 'right' },
		];

		this.subscriptioncols = [
			{ field: 'planName', header: 'Plan Name', width: '100px', textAlign: 'left' },
			{ field: 'planAmt', header: 'Plan Amount', width: '120px', textAlign: 'right' },
			{ field: 'startDate', header: 'Start Date', width: '120px', textAlign: 'center' },
			{ field: 'endDate', header: 'End Date', width: '120px', textAlign: 'center' },
			{ field: 'status', header: 'Status', width: '120px', textAlign: 'center' },
			{ field: 'invoice', header: 'Invoice', width: '120px', textAlign: 'center' },
			{ field: 'contractName', header: 'View/Download Contract Agreement', width: '170px', textAlign: 'center' }
		];

		this.termsAndConditioncols = [
			{ field: 'description', header: 'Description', width: '120px', textAlign: 'left' },
			{ field: 'acceptedDate', header: 'Accepted Date', width: '120px', textAlign: 'center' },
			{ field: 'pdfButton', header: 'View/Download PDF', width: '120px', textAlign: 'center' }
		];
		

		this.tempLimitDetails = [
			{ key: 'advancedLimit', header: 'Company Search Export' },
			{ key: 'landLimit', header: 'Land Registry Export' },
			{ key: 'corpLandLimit', header: 'Property Register Export' },
			{ key: 'companyReport', header: 'Company Report Download' },
			{ key: 'companyMonitorLimit', header: 'Business Monitor' },
			{ key: 'companyMonitorPlusLimit', header: 'Business Monitor Plus' },
			{ key: 'creditReportLimit', header: 'Credit Report' },
			{ key: 'directorMonitorLimit', header: 'Director Monitor' },
			{ key: 'directorReportLimit', header: 'Director Report' },
			{ key: 'contactInformationLimit', header: 'Contact Information Export' },
			{ key: 'pepAndSanctionHitLimit', header: 'Pep And Sanction Hit' },
			{ key: 'emailSpotterLimit', header: 'Email Spotter' },
			{ key: 'hits', header: 'API Hit' },
			{ key: 'titleRegisterHitLimit', header: 'Title Register Hit' },
			{ key: 'diversityLimit', header: 'Diversity Inclusion' },
			{ key: 'enterpriseReportLimit', header: 'Enterprise Report' },
			{ key: 'emailVerificationLimit', header: 'Email Verification Limit' },
			{ key: 'crmLimit', header: 'CRM Limit' }
		];

		// this.sharedLoaderService.hideLoader();

	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems(
		// 	[
		// 		{ label: 'Subscription' }
		// 	]
		// );
		this.title = "Subscription - DataGardener";
		this.description = "In subscription you can find your subscription details and limit details.";
		this.seoService.setPageTitle(this.title);
	
	}

	getSubscriptionDetails() {

		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_ADDON_API', 'getAddOnFilters' ).subscribe( res => {
			
			if (res.body.status == 200) {
				this.addOnNgModel = res.body.results
			}
			
		});
		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_SUBSCRIPTION', 'allSubscriptions' ).subscribe(res => {

			let subscription_data: any = res.body;

			if (subscription_data["length"] > 0) {
			
				subscription_data.sort( ( a, b ) => b.createdOn.localeCompare( a.createdOn ) );
				
				let count = 0;

				for (var i = 0; i < subscription_data["length"]; i++) {
					let obj = {
						feature: ""
					};
					count++;

					if (subscription_data[i].hasOwnProperty("name")) {

						obj["planName"] = subscription_data[i].name;

					}

					if ("planFeatures" in subscription_data[i]) {
						if (subscription_data[i].planFeatures.length > 0) {
							for (var j = 0; j < subscription_data[i].planFeatures.length; j++) {
								if (j === subscription_data[i].planFeatures.length - 1) {
									subscription_data[i].planFeatures[j].Name
									obj.feature += subscription_data[i].planFeatures[j].Name;
								} else {
									obj.feature += subscription_data[i].planFeatures[j].Name + ", ";
								}
							}
						}
					}
					if (subscription_data[i].hasOwnProperty("cost")) {
						obj["planAmt"] = subscription_data[i].cost;
					}

					if (subscription_data[i].hasOwnProperty("startDate")) {
						obj["startDate"] = this.datePipe.transform(subscription_data[i].startDate, 'dd-MM-yyyy');
					}

					if (subscription_data[i].hasOwnProperty("endDate")) {
						obj["endDate"] = this.datePipe.transform(subscription_data[i].endDate, 'dd-MM-yyyy');
					}

					if (subscription_data[i].hasOwnProperty("status")) {

						if (subscription_data[i].status === 1) {
							obj["status"] = "Active";
						} else {
							obj["status"] = "Inactive";
						}
						
					}

					this.user_active_plan_name = subscription_data[0].description.toLowerCase().replace('trial', '');
					// this.user_active_plan_name = res.body[0].name;

					this.user_active_plan_id = subscription_data[0].planID;

					obj["invoice"] = subscription_data[i]["invoice"];

					this.subscribtion_obj_array.push(obj);
				}

				if (subscription_data["length"] == count) {
					this.subscriptionData = this.subscribtion_obj_array;							
					this.getUserDetails();
				}
			}
		},error => {
				console.log(error);
			}
		);

	}

	getUserDetails() {

		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_USER_API', 'getUserDetails' ).subscribe(res => {

				if ( res.status === 200 ) {

					this.login_details = res.body;

					this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe(res => {

						if (res.body.status === 200) {
							let plan_details = res.body.results;
							for ( let values in  this.tempLimitDetails){
								let obj = {
										"serialNum": parseInt(values) + 1,
										"feature": this.tempLimitDetails[values].header,
										"total_Limit":  plan_details[ this.tempLimitDetails[values].key] || 0 ,
										"limit_Available" : this.login_details[ this.tempLimitDetails[values].key ] >=0 ? this.login_details[this.tempLimitDetails[values].key] : 0
									}
								this.limit_obj_array.push(obj);
							}
							if (this.login_details["createdOn"]) {
								this.joinDate = this.formatISODate(this.login_details["createdOn"]);
								this.acceptedTermNCondition_Date = this.formatISODate(this.login_details["createdOn"]);
							}

							this.limitData = this.limit_obj_array;
							this.getPaidPlanInfo(this.login_details, plan_details)
						}
					});
					setTimeout(() => {
						this.sharedLoaderService.hideLoader();
					}, 1000);

				}
			},
			error => {
				console.log(error);
				this.sharedLoaderService.hideLoader();
			}
		);

	}

	getPaidPlanInfo(login_details, plan_details) {

        let obj = {
            plan_payment: this.paidPlanId,
            id_payment: login_details["_id"],
            username: login_details["username"],
            email: login_details["email"],
            amount_payment: String(plan_details["cost"])
        };

    }

	upgradeToPaidPlan() {
		if (sessionStorage.getItem("_xxy_dex") !== undefined || sessionStorage.getItem("_xxy_dex") !== null) {
			this.router.navigate(["/cardDetails"]);
		}
	}

	openInvoice(e: Event, link) {
		e.stopPropagation();
		e.preventDefault();
		window.open(link, "_blank");
	}

	formatISODate(date) {
        return this.commonService.formatISODate(date);
    }

	viewTermConditionPdf() {
		let url = "assets/utilities/images/termsConditionPdf/DataGardener Service Terms.pdf"
		window.open(url, '_blank').focus();
	}

	downloadTermConditionPdf() {
		let url = "assets/utilities/images/termsConditionPdf/DataGardener Service Terms.pdf"
		var a = document.createElement("a");
		a.setAttribute("download", 'DataGardener Service Terms.pdf');
		a.setAttribute("href", url);
		document.body.appendChild(a);
		a.click();
	}

	downloadContractAgreement( ) {
		let reqobj = [ this.login_details['contractName'] ]
		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_USER_API', 'downloadContractPdf', reqobj ).subscribe(res => {
			let textString: any = res.body.result;
			const linkSource = 'data:application/pdf;base64,'  + textString;
			const downloadLink = document.createElement("a");
			const fileName = `DG_Contract_Agreement.pdf`;
	
			downloadLink.href = linkSource;
			downloadLink.download = fileName;
			downloadLink.click();
		},err => {
			console.log(err);
		});
	}

	viewContractAgreement() {
		
		let reqobj = [ this.login_details['contractName'] ]

		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_USER_API', 'downloadContractPdf', reqobj ).subscribe(res => {

			let textString: any = res.body.result;
			let pdfWindow = window.open("");

			pdfWindow.document.write(
				`
				<html lang="en">
					<head>
						<meta charset="UTF-8">
						<meta http-equiv="X-UA-Compatible" content="IE=edge">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<title>Contract_Agreement.pdf</title>
					</head>
					<body style="margin: 0; padding: 0;">
						<div><iframe width='100%' height='100%' style='border: 0;' src='data:application/pdf;base64,${ textString }'></iframe>
					</body>
				</html>
				`
			);

		},err => {
			console.log(err);
			
		});
	}

	returnZero() {
		return 0;
	}

}
