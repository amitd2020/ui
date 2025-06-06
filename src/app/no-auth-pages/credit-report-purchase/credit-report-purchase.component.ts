import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { StripeCardNumberComponent, StripeService } from 'ngx-stripe';
import { StripeCardElementOptions, StripeCardNumberElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { Router } from '@angular/router';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import CustomUtils from 'src/app/interface/custom-pipes/custom-utils/custom-utils.utils';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { take } from 'rxjs';

@Component({
	selector: 'dg-credit-report-purchase',
	templateUrl: './credit-report-purchase.component.html',
	styleUrls: ['./credit-report-purchase.component.scss']
})
export class CreditReportPurchaseComponent implements OnInit {

	@Input() selectedReportPlanDetails;
	@Input() componentView: string = 'inline';
	@Output() messageCommunicator = new EventEmitter<any>();

	@ViewChild(StripeCardNumberComponent, { static: false }) card: StripeCardNumberComponent;
	@ViewChild(NgForm, { static: false }) paymentForm: NgForm;

	isLoggedIn: boolean = false;
	fieldValidationCheck: boolean = true;
	userEmailAlreadyExists: boolean = false;
	show_refred_by_text: boolean = false;
	show_other_text: boolean = false;

	cardOptions: StripeCardElementOptions | StripeCardNumberElementOptions = {
		style: {
			base: {
				color: '#32325D',
				fontFamily: '"Roboto", Inter UI, Open Sans, Segoe UI, sans-serif',
				fontSize: '16px',
				fontWeight: '400',
				fontSmoothing: 'antialiased',

				'::placeholder': {
					fontWeight: '400',
					color: '#0e2031'
				}
			},
			invalid: {
				color: '#E25950'
			}
		}
	}

	cardNumberOptions = {
		...this.cardOptions,
		placeholder: 'Card Number',
		showIcon: true
	}
	queryString = window.location.search;
	elementsOptions: StripeElementsOptions = {
		fonts: [
			{ cssSrc: 'https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap' }
		],
		locale: 'auto'
	};

	msgs = [];
	reportPlanDetails = {
		stripePlanId: undefined,
		reportCount: undefined,
		costPerReport: undefined,
		sub_total_Amount: undefined,
		total_Amount: undefined,
	};

	sessionObject = {
		first_name: undefined,
		last_name: undefined,
		email: undefined,
		referredValue: undefined,
		referredData: undefined,
		refered_by: undefined,
		other: undefined,
		username: undefined
	};
	creditReportUsername: string = '';
	foundUsOptions = [
		{ label: 'Select an option', active: true },
		{ label: 'Google', value: 'Web - Google' },
		{ label: 'Bing', value: 'Web - Bing' },
		{ label: 'LinkedIn', value: 'linkedIn' },
		{ label: 'Instagram', value: 'instagram' },
		{ label: 'Pinterest', value: 'pinterest' },
		{ label: 'Google Ads', value: 'Web - Google Ads' },
		{ label: 'Referred By', value: 'referral' },
		{ label: 'Other', value: 'other' }
	];

	payment_done: boolean;
	paymentIntentClientSecret: string = undefined;
	creditReportPlanId: string = '';
	loginConfirmationDialog: boolean = false;

	constructor(
		public userAuthService: UserAuthService,
		private stripe: StripeService,
		private router: Router,
		private globalServiceCommnunicate: ServerCommunicationService,
		private sharedLoaderService: SharedLoaderService,

	) { }

	ngOnInit() {

		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => {
			this.isLoggedIn = loggedIn;

			if ( this.isLoggedIn && this.componentView == 'inline' ) {
				this.router.navigate(['/']);
			}
		});


		const urlParams = new URLSearchParams(this.queryString);
		
		if ( this.selectedReportPlanDetails === undefined ) {
			if (!CustomUtils.isNullOrUndefined(urlParams.get("planId"))) {
				this.creditReportPlanId = urlParams.get("planId");
				let reqobj = [ this.creditReportPlanId ];
				this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_PLANS', 'creditReportPlan', reqobj  ).subscribe( res => {
					let data = res.body;
					if(data.status === 200) {
						this.reportPlanDetails.costPerReport = data.results[0].costPerReport;
						this.reportPlanDetails.reportCount = data.results[0].reportCount;
						this.reportPlanDetails.stripePlanId = data.results[0].stripePlanId;
						this.reportPlanDetails.sub_total_Amount = (this.reportPlanDetails.reportCount * this.reportPlanDetails.costPerReport);
						this.reportPlanDetails.total_Amount = this.reportPlanDetails.sub_total_Amount + 20 * this.reportPlanDetails.sub_total_Amount / 100;
						
						this.getUserInfo();
					}
				})
			}
		} else {
			this.reportPlanDetails.costPerReport = this.selectedReportPlanDetails.costPerReport;
			this.reportPlanDetails.reportCount = this.selectedReportPlanDetails.reportCount;
			this.reportPlanDetails.stripePlanId = this.selectedReportPlanDetails.stripePlanId;
			this.reportPlanDetails.sub_total_Amount = (this.reportPlanDetails.reportCount * this.reportPlanDetails.costPerReport);
			this.reportPlanDetails.total_Amount = this.reportPlanDetails.sub_total_Amount + 20 * this.reportPlanDetails.sub_total_Amount / 100;
	
			this.getUserInfo();
		}
		
	}

	buyReports() {
		
		if ( this.userAuthService.hasRolePermission( ['Super Admin'] ) && this.sessionObject.first_name && this.sessionObject.email && this.sessionObject.referredValue ) {

			const emailPatternRegx = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/);

			if ( emailPatternRegx.test( this.sessionObject.email.toLowerCase() ) ) {
				this.fieldValidationCheck = true;
			} else {
				this.fieldValidationCheck = false;
				return;
			}

		} else if ( this.sessionObject.first_name && this.sessionObject.last_name && this.sessionObject.email && this.sessionObject.referredValue ) {
			const emailPatternRegx = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/);

			if ( emailPatternRegx.test( this.sessionObject.email.toLowerCase() ) ) {
				this.fieldValidationCheck = true;
			} else {
				this.fieldValidationCheck = false;
				return;
			}
		} else {
			this.fieldValidationCheck = false;
			return;
		}

		// Final Check
		if ( !this.fieldValidationCheck || this.userEmailAlreadyExists ) {
			return;
		}

		if( this.sessionObject.referredValue === "referral" ) {
			this.sessionObject.referredData = this.sessionObject.refered_by;
			this.sessionObject.other = undefined;

		} else if ( this.sessionObject.referredValue === "other" ) {
			this.sessionObject.referredData = this.sessionObject.other;
			this.sessionObject.refered_by = undefined;

		} else {
			this.sessionObject.other = undefined;
			this.sessionObject.refered_by = undefined;
		}

		let reqobj = {
			totalAmount: this.reportPlanDetails.total_Amount
		}

		this.sharedLoaderService.showLoader();

		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_PAYMENT', 'createPaymentIntent', reqobj ).subscribe( res => {
			if (res.body.status == 200) {

				this.paymentIntentClientSecret = res.body.clientSecret;
				this.stripe.confirmCardPayment(this.paymentIntentClientSecret, {
					payment_method: {
						card: this.card.element,
						billing_details: {
							name: this.sessionObject.first_name,
							email: this.sessionObject.email
						}
					}
				}).subscribe(result => {

					this.sharedLoaderService.hideLoader();
					
					if (result.error) {
						this.msgs = [];

						this.msgs.push({ severity: 'error', summary: result.error.message });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					} else {

						if (result.paymentIntent.status === 'succeeded') {
							this.payment_done = true;

							let obj;

							if ( this.isLoggedIn ) {
								obj = {
									dbID: this.userAuthService?.getUserInfo('dbID'),
									creditLimit: this.reportPlanDetails.reportCount
								}
							} else {
								obj = {
									creditLimit: this.reportPlanDetails.reportCount,
									userInfo : this.sessionObject
								}
							}

							this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_ADDON_API', 'updateCreditReportsLimit', obj ).subscribe( res => {
								if (res.body.status == 200) {
									if(res.body.userId !== undefined) {
										sessionStorage.setItem("userID", res.body.userId);
										localStorage.setItem("userToken", res.body.userToken)
									}

									this.msgs.push({ severity: 'success', summary: 'Payment Successfull' });
									setTimeout(() => {
										this.msgs = [];
									}, 6000);
									localStorage.setItem("userDetails", undefined);
									localStorage.removeItem('userDetails');
									
									if ( this.selectedReportPlanDetails === undefined ) {
										this.creditReportUsername = this.sessionObject.first_name + " " + this.sessionObject.last_name;
										this.sessionObject.first_name = null;
										this.sessionObject.last_name = null;
										this.sessionObject.email = null;
										this.sessionObject.referredValue =[];
										this.sessionObject.refered_by = null;
										this.loginConfirmationDialog = true;
										this.cardNumberOptions = null;
										this.cardOptions = null;

									} else {
										let obj;
	
										if ( this.isLoggedIn ) {
												obj = {
												status: 'success',
												loggedIn:'Yes',
												creditLimit: this.reportPlanDetails.reportCount
											}
										} else {
												obj = {
												status: 'success',
												loggedIn:'No',
												username: this.sessionObject.first_name + " " + this.sessionObject.last_name,
												creditLimit: this.reportPlanDetails.reportCount
											}
										}
										this.messageCommunicator.emit(obj);
									}

									this.reportPlanDetails.costPerReport = undefined;
									this.reportPlanDetails.reportCount = undefined;
									this.reportPlanDetails.stripePlanId = undefined;
									this.reportPlanDetails.sub_total_Amount = undefined;
									this.reportPlanDetails.total_Amount = undefined;
									this.paymentIntentClientSecret = undefined;
								}
							});

						}
					}
				})
			}

		});

	}

	checkIfUserEmailAlreadyExists( email: string ) {
		if ( email ) {

			let reqObj = [ email ];
			this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_USER_API', 'userEmailExistsCheck', reqObj ).subscribe( res => {
				if ( res.body['status'] == 200 ) {
					this.userEmailAlreadyExists = res.body['results'];
				} else {
					this.userEmailAlreadyExists = false;
				}
			});

		} else {
			this.userEmailAlreadyExists = false;
		}
	}

	getUserInfo() {

		if (localStorage.getItem('userDetails') !== undefined && localStorage.getItem('userDetails') !== null) {
			let upgradeFromFreePlanobj = JSON.parse(localStorage.getItem('userDetails'));
			this.sessionObject.first_name = this.userAuthService.hasRolePermission( ['Super Admin'] ) ? upgradeFromFreePlanobj.username : upgradeFromFreePlanobj.first_name;
			this.sessionObject.last_name = upgradeFromFreePlanobj.last_name;
			this.sessionObject.email = upgradeFromFreePlanobj.email;
		}
		localStorage.setItem("userDetails", undefined);
		localStorage.removeItem('userDetails');
	}

	closeIcon() {
		let obj = {
			status: 'close'
		};
		this.messageCommunicator.emit(obj);
	}

	selectedData(event: { value: string; }, referredOptions: any) {

		this.sessionObject.referredValue = referredOptions;

		if ( event.value === 'referral' ) {
			this.show_refred_by_text = true;
            this.show_other_text = false;

        } else if ( event.value === 'other' ) {
            this.show_other_text = true;
            this.show_refred_by_text = false;
			
        } else {
			this.sessionObject.referredData = referredOptions;
            this.show_refred_by_text = false;
            this.show_other_text = false;
        }
		
    }

}
