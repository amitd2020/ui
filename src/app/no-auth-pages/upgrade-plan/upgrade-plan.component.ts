import { Component, Input, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { subscribedPlan } from 'src/environments/environment';

@Component({
  selector: 'dg-upgrade-plan',
  templateUrl: './upgrade-plan.component.html',
  styleUrls: ['../no-auth-pages.component.scss']
})
export class UpgradePlanComponent implements OnInit {

	@Input() currentPlan: unknown;
	@Input() componentView: string = 'inline';
	@Input() buttonOnly: boolean = false;
	@Input() smallButton: boolean = false;
	@Input() thisPage: string;

	showUpgradePlanDialog: boolean = false;
	subscribedPlanModal: any = subscribedPlan;
	planMonthly: boolean = false;
	planAnnually1year: boolean = false;
	planAnnually2year: boolean = false;
	expandPlanPrice: number = 810;
	enterprisePlanPrice: number = 1620;
	choosenExpandPlanId: string = this.subscribedPlanModal['Expand_Annual_One_Year'];
	choosenEnterprisePlanId: string = this.subscribedPlanModal['Enterprise_Annual_One_Year'];
	showExpandUpgradeModal: boolean = false;
	showExpandAndEnterprisePlansModel: boolean = false;
	subscriptionPlanDialogModal: boolean = false;
 
	expandAndEnterprisePlans: any = {

		'Start': this.subscribedPlanModal['Start'],
		'Trial_48_Hours': this.subscribedPlanModal['Trial_48_Hours'],
		'Expand_Weekly_Trial': this.subscribedPlanModal['Expand_Weekly_Trial'],
		'Expand_Trial_48_Hours': this.subscribedPlanModal['Expand_Trial_48_Hours'],
		'Monthly_Expand_Trial': this.subscribedPlanModal['Monthly_Expand_Trial'],
		'Annually_Expand_Trial': this.subscribedPlanModal['Annually_Expand_Trial'],
		'Enterprise_Weekly_Trial': this.subscribedPlanModal['Enterprise_Weekly_Trial'],
		'Monthly_Enterprise_Trial': this.subscribedPlanModal['Monthly_Enterprise_Trial'],
		'Annually_Enterprise_Trial': this.subscribedPlanModal['Annually_Enterprise_Trial'],

	}
	
	constructor(
		public userAuthService: UserAuthService,
		private globalServiceCommnunicate: ServerCommunicationService,
		private sharedLoaderService: SharedLoaderService
	) { }

	ngOnInit() {

		this.currentPlan = this.userAuthService?.getUserInfo('planId');
		
		this.planAnnually1year = true;

	}

	switchPlanDuration(planDuration) {
		if (planDuration == 'monthly') {
			this.planMonthly = true;
			this.planAnnually1year = false;
			this.planAnnually2year = false;
			this.expandPlanPrice = 75;
			this.enterprisePlanPrice = 150;
			this.choosenExpandPlanId = this.subscribedPlanModal['Expand_New_Monthly'];
			this.choosenEnterprisePlanId = this.subscribedPlanModal['Enterprise_New_Monthly'];
		}
		else if (planDuration == 'annually_1year') {
			this.planMonthly = false;
			this.planAnnually1year = true;
			this.planAnnually2year = false;
			this.expandPlanPrice = 810;
			this.enterprisePlanPrice = 1620;
			this.choosenExpandPlanId = this.subscribedPlanModal['Expand_Annual_One_Year'];
			this.choosenEnterprisePlanId = this.subscribedPlanModal['Enterprise_Annual_One_Year'];
		} else if (planDuration == 'annually_2year') {
			this.planMonthly = false;
			this.planAnnually1year = false;
			this.planAnnually2year = true;
			this.expandPlanPrice = 1440;
			this.enterprisePlanPrice = 2880;
			this.choosenExpandPlanId = this.subscribedPlanModal['Expand_Annual_Two_Year'];
			this.choosenEnterprisePlanId = this.subscribedPlanModal['Enterprise_Annual_Two_Year'];
		}
	}

	selectPlanNGotoPayment(choosenPlanId) {

		let userId = [ this.userAuthService?.getUserInfo('dbID') ];

		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( planDetail => {

			if (planDetail.body.status == 200) {

				let currentPlanInfo = planDetail.body.results;

				if (currentPlanInfo.cost == 0) {

					this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_USER_API', 'getUserDetails' ).subscribe( res => {

						if (res.status == 200) {

							let obj = {
								planId: choosenPlanId
							};

							this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( planRes => {
								
								if (planRes.body.status == 200) {

									let obj = {
										choosenPlanId: choosenPlanId,
										currentUserId: userId,
										phoneNumber: res.body['phoneNumber'],
										username: res.body['username'],
										email: res.body['email'],
										amount_payment: String(planRes.body.results.cost),
										companyName: res.body['companyName'] ? res.body['companyName'] : "",
									};
									sessionStorage.setItem("upgradeFromFreeInfo", JSON.stringify(obj));
									// this.router.navigate(["/authentication/cardDetails"]);
									window.location.href = 'https://datagardener.com/free-trial/';

								}

							});

						}

					});

				}

			}

		});
	}
	
	/**
	 * @description
	 * Description: According to ticket no. DG-6457 - Now when user click on upgrade plan button no pop up will show for plan upgrade, only redirect to contact us screen on datagardener.com wesite
	 * 
	 * @author
	 * Atiq Shahab
	 * 
	 * @since
	 * 07-03-2022
	 */
	userMailSender() {

		this.sharedLoaderService.showLoader();

		// for (let key in this.subscribedPlanModal) {

		// 	if ( this.subscribedPlanModal[key].includes(this.currentPlan) ) {
				
		// 		if ( this.expandAndEnterprisePlans[ key ] == this.currentPlan ) {
		// 			this.showUpgradePlanDialog = true;
		// 			this.subscriptionPlanDialogModal = true;
		// 			if ( [ "Start", "Valentine_Special" ].includes( key ) ) {
		// 				this.showExpandUpgradeModal = true;
		// 			}
		// 		} else  {
		// 			this.showExpandAndEnterprisePlansModel = true;
		// 		}
		// 	}			

		// }

		let obj = {
			emailId: this.userAuthService?.getUserInfo('email'),
		};

		obj[ 'server' ] = window.location.host == 'app.datagardener.com' ? 'live' : '';

		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LOGIN', 'upgradePlanEmailNotification', obj ).subscribe({
			next: ( res ) => {
				this.sharedLoaderService.hideLoader();
				window.location.href = 'https://datagardener.com/contact';
			},
			error: ( err ) => {
				console.log(err);
			}
		});

	}

	checkPlansList() {

		let startAndTrialPlan = false;
		for (let key in this.subscribedPlanModal) {

			if ( this.subscribedPlanModal[key].includes(this.currentPlan) ) {
				
				if ( this.expandAndEnterprisePlans[ key ] == this.currentPlan ) {
					startAndTrialPlan = true;
					if ( [ "Start", "Valentine_Special" ].includes( key ) ) {
						this.showExpandUpgradeModal = true;
					}
				} else  {
					startAndTrialPlan = false;
				}
			}			

		}
		return startAndTrialPlan;
	}

}
