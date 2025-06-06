import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

import { StripeCardElementOptions, StripeCardNumberElementOptions, StripeElementsOptions } from "@stripe/stripe-js";
import { StripeCardNumberComponent, StripeService } from "ngx-stripe";
import { SearchFiltersService } from "../interface/service/search-filter.service";
import { ServerCommunicationService } from "../interface/service/server-communication.service";
import { SharedLoaderService } from "../interface/view/shared-components/shared-loader/shared-loader.service";

@Component({
	selector: 'dg-cardDetails',
	templateUrl: './app.cardDetails.component.html',
	styleUrls: ['./no-auth-pages.component.scss']
})
export class CardDetailsComponent implements OnInit {

	@ViewChild(StripeCardNumberComponent, { static: false }) card: StripeCardNumberComponent;
	@ViewChild(NgForm, { static: false }) paymentForm: NgForm;

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

	elementsOptions: StripeElementsOptions = {
		fonts: [
			{ cssSrc: 'https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap' }
		],
		locale: 'auto'
	};

	msgs = [];
	temp_address_2;
	sessionObject = {
		username: undefined,
		email: undefined,
		phoneNumber: undefined,
		planCost: undefined,
		user_id: undefined,
		plan_id: undefined,
		postCode: undefined,
		existingCompany: true,
		referredValue: undefined,
		referredData: undefined
	};
	filteredPostalCodeArray: any[];
	planDetails: any = {};
	payment_done: boolean;
	showContactNumbMsg: boolean = false;
	location: string = undefined;
	showPrimaryAddress: boolean = false;
	windowInnerWidth: number;

	primary_address = {
		address_1: undefined,
		country: undefined,
		county: undefined,
		postalCode: undefined,
		postTown: undefined,
	};

	billing_address = {
		address_1: undefined,
		address_2: undefined,
		country: undefined,
		county: undefined,
		postalCode: undefined,
		postTown: undefined,
	};

	discountCoupon = "";
	discountApplied: Boolean = false;
	upgradeFromFree: Boolean = false;
	discountCouponName: string = "";
	discountPercentage: number;
	discountAmountOff: number;
	sub_total_Amount: number;
	total_Amount: number;
	toDate: Date;
	hasCompanyAddress: boolean = true;
	hasIndividualCompany: boolean = false;

	constructor(
		private searchFiltersService: SearchFiltersService,
		private stripeService: StripeService,
		private sharedLoaderService: SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService,
		private router: Router) { }


	ngOnInit() {
		this.getInfo();

		this.windowInnerWidth = window.innerWidth;
		if (this.windowInnerWidth <= 280) {
			this.cardOptions.style.base.fontSize = '12px';
		} else {
			this.cardOptions.style.base.fontSize = '16px';
		}

	}

	@HostListener('window:resize', ['$event'])
	onResize() {

		this.windowInnerWidth = window.innerWidth;

		if (this.windowInnerWidth <= 280) {
			this.cardOptions.style.base.fontSize = '12px';
		} else {
			this.cardOptions.style.base.fontSize = '16px';
		}
	}

	getInfo() {
		if (sessionStorage.getItem('upgradeFromFreeInfo') !== undefined && sessionStorage.getItem('upgradeFromFreeInfo') !== null) {

			this.upgradeFromFree = true;
			let upgradeFromFreePlanobj = JSON.parse(sessionStorage.getItem('upgradeFromFreeInfo'));
			this.sessionObject.username = upgradeFromFreePlanobj.username;
			this.sessionObject.email = upgradeFromFreePlanobj.email;
			this.sessionObject.phoneNumber = upgradeFromFreePlanobj.phoneNumber;
			this.sessionObject.planCost = upgradeFromFreePlanobj.amount_payment;
			this.sessionObject.user_id = upgradeFromFreePlanobj.currentUserId;
			this.sessionObject.plan_id = upgradeFromFreePlanobj.choosenPlanId;

			this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( res => {
				let data = res.body;
				if (data.status === 200) {
					if (data['results'] !== undefined && data['results'] !== null) {
						const planDescripiton = data['results'];
						this.planDetails['name'] = planDescripiton['name'];

						this.planDetails['description'] = planDescripiton['description'];
						this.planDetails['startDate'] = new Date();
						this.planDetails['endDate'] = this.getDuration(planDescripiton['duration']);
						this.planDetails['duration'] = planDescripiton['duration'];
						this.planDetails['cost'] = planDescripiton['cost'];
						this.planDetails['vat'] = planDescripiton['vat'];
						this.planDetails['stripeProductId'] = planDescripiton['stripeProductId'];

						if (this.discountApplied === false) {
							this.sub_total_Amount = this.planDetails['cost'];
							this.total_Amount = this.sub_total_Amount + 20 * this.sub_total_Amount / 100;
						}
					} else {
						// console.log('No Plan Details Found..!!');
					}
				} else {
					// console.log('Error While Fetching Plan Detials..!!');
				}
			}, () => {
				// console.log('Error Caught : ', error);
			});
		}

		if (sessionStorage.getItem('_xxy_dex') !== undefined && sessionStorage.getItem('_xxy_dex') !== null) {

			let obj = JSON.parse(sessionStorage.getItem('_xxy_dex'));
			this.sessionObject.username = obj.username;
			this.sessionObject.email = obj.email;
			this.sessionObject.phoneNumber = obj.phoneNumber;
			this.sessionObject.planCost = obj.amount_payment;
			this.sessionObject.user_id = obj.id_payment;
			this.sessionObject.plan_id = obj.plan_payment;
			this.sessionObject.existingCompany = obj.existingCompany;
			this.sessionObject.referredData = obj.referredData;
			this.sessionObject.referredValue = obj.referredValue;

			if (obj['type'] == 'company') {

			} else if (obj['type'] == 'individual') {
				this.showPrimaryAddress = true;
				this.hasIndividualCompany = true;
			}

			
			let reqobj = {
				planId: this.sessionObject.plan_id
			};
			this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( res => {
				let data = res.body;
				if (data.status === 200) {
					if (data['results'] !== undefined && data['results'] !== null) {
						const planDescripiton = data['results'];
						this.planDetails['name'] = planDescripiton['name'];
						this.planDetails['description'] = planDescripiton['description'];
						this.planDetails['startDate'] = new Date();
						this.planDetails['endDate'] = this.getDuration(planDescripiton['duration']);
						this.planDetails['duration'] = planDescripiton['duration'];
						this.planDetails['cost'] = planDescripiton['cost'];
						this.planDetails['vat'] = planDescripiton['vat']; 
						this.planDetails['stripeProductId'] = planDescripiton['stripeProductId']; 

						if (this.discountApplied === false) {
							this.sub_total_Amount = this.planDetails['cost'];
							this.total_Amount = this.sub_total_Amount + 20 * this.sub_total_Amount / 100;
						}
					} else {
						// console.log('No Plan Details Found..!!');
					}
				} else {
					// console.log('Error While Fetching Plan Detials..!!');
				}
			}, () => {
				// console.log('Error Caught : ', error);
			});
		} else {
			// console.log('In Get All Info Else Block');
			// this.router.navigate(['/pages/404']);
		}
	}

	getDuration(duration) {
		const newDate = this.addDays(new Date(), 30);
		return newDate;
	}

	addDays(theDate, days) {
		this.toDate = theDate;
		return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
	}

	filteredPostalCode(event) {
		if (event.query.length > 2) {
			this.searchFiltersService.getKeywordsPostCode('RegAddress_Modified.postalCode.keyword', 'keywordPostCode', event.query.toString().toLowerCase(), 'companySearch', undefined).then(data => {
				if (data !== undefined) {
					if (data.distinct_categories.buckets.length > 0) {
						this.filteredPostalCodeArray = [];
						for (let val of data.distinct_categories.buckets) {
							if (val.key === "Unknown") {
								this.filteredPostalCodeArray.push({ key: val.key });
							}
							else {
								this.filteredPostalCodeArray.push({ key: val.key.toUpperCase() });
							}
						}
					}
				}
			})
		} else {
			this.filteredPostalCodeArray = [];
		}
	}

	validatePaymentForm(paymentForm) {
		if (paymentForm !== undefined) {
			if (paymentForm.address !== undefined) {
				this.billing_address.address_1 = paymentForm.address;
			}
			if (paymentForm.country !== undefined) {
				this.billing_address.country = paymentForm.country;
			}
			if (paymentForm.county !== undefined) {
				this.billing_address.county = paymentForm.county;
			}
			if (paymentForm.postalCode !== undefined) {
				if (paymentForm.postalCode.key == undefined) {
					this.billing_address.postalCode = paymentForm.postalCode.toUpperCase();
				} else {
					this.billing_address.postalCode = paymentForm.postalCode.key.toUpperCase();
				}
			}
			if (paymentForm.postTown !== undefined) {
				this.billing_address.postTown = paymentForm.postTown;
			}

			if (
				paymentForm.address &&
				paymentForm.country &&
				paymentForm.county &&
				paymentForm.postTown
			)
            return true;
		}

        return false;
	}

	makePayment() {

		if (this.validatePaymentForm(this.paymentForm.value)) {
			if (this.upgradeFromFree == true) {
				this.sharedLoaderService.showLoader();
				this.payment_done = false;
				this.stripeService.createToken(this.card.element, {}).subscribe(result => {
					if (result.token) {
						if (this.sessionObject !== null) {
							if (this.sessionObject.user_id !== undefined && this.sessionObject.planCost !== undefined &&
								this.sessionObject.plan_id !== undefined && result.token.id !== undefined) {
								const obj = {};

								obj['userid'] = this.sessionObject.user_id[0];
								obj['description'] = 'User id ' + this.sessionObject.user_id + ' subscribed to the plan id ' + this.sessionObject.plan_id;
								obj['chargeCustomer'] = 'true';
								obj['amount'] = this.sessionObject.planCost;
								obj['plan'] = this.sessionObject.plan_id;
								obj['stripeToken'] = result.token.id;
								obj['recurringornot'] = true;

								//this check and method is used in individual user case
								if (this.hasCompanyAddress == false) {

									this.assignBillingAddressToPrimaryAddress(this.billing_address);
								}

								obj['primaryAdd'] = this.primary_address;
								obj['billingAdd'] = this.billing_address;

								if (this.discountApplied == true) {
									obj['discountCouponCode'] = this.discountCoupon.toString();
								}
								
								this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_PAYMENT', 'paidSubscription', obj ).subscribe( res => {
										let data = res.body;
										if (data.status === 200) {
											if(data.results.payment_intent_secret !== undefined) {
												this.stripeService.confirmCardPayment(data.results.payment_intent_secret, {
													payment_method: {
														card: this.card.element,
														billing_details: {
															name: this.sessionObject.username,
															email: this.sessionObject.email
														}
													}
												}).subscribe(result => {
													if (result.error) {
														this.sharedLoaderService.hideLoader();
														this.msgs.push({ severity: 'error', summary: "Payment Failed, Subscribing to Free Plan" });
														setTimeout(() => {
															this.msgs = [];
														}, 3000);
													}
													else {
														localStorage.setItem("planCost", this.sessionObject.planCost);
														localStorage.setItem("planId", obj['plan']);
														this.payment_done = true;
														sessionStorage.removeItem('upgradeFromFreeInfo');
														this.router.navigate(['authentication/successPlanUpgrade']);
													}
												})
											} else {
												localStorage.setItem("planCost", this.sessionObject.planCost);
												localStorage.setItem("planId", obj['plan']);
												this.payment_done = true;
												sessionStorage.removeItem('upgradeFromFreeInfo');
												this.router.navigate(['authentication/successPlanUpgrade']);
											}
										} else {
											this.sharedLoaderService.hideLoader();
											this.msgs.push({ severity: 'error', summary: "Payment Failed, Subscribing to Free Plan" });
											setTimeout(() => {
												this.msgs = [];
											}, 3000);
										}
									}, () => {
										this.payment_done = true;
										this.sharedLoaderService.hideLoader();
										this.msgs.push({ severity: 'error', summary: "Payment Failed, Subscribing to Free Plan " });
										setTimeout(() => {
											this.msgs = [];
										}, 3000);
									}
								);
							}
						}
					} else if (result.error) {
						this.sharedLoaderService.hideLoader();
						this.msgs = [];
						this.msgs.push({ severity: 'error', summary: result.error.message });
						setTimeout(() => {
							this.msgs = [];
						}, 4000);
					}
				});
			} else {

				this.sharedLoaderService.showLoader();
				this.payment_done = false;
				this.stripeService.createToken(this.card.element, {}).subscribe(result => {
					if (result.token) {
						if (this.sessionObject !== null) {
							if (this.sessionObject.user_id !== undefined && this.sessionObject.planCost !== undefined &&
								this.sessionObject.plan_id !== undefined && result.token.id !== undefined) {
								const obj = {};
								obj['userid'] = this.sessionObject.user_id;
								obj['description'] = 'User id ' + this.sessionObject.user_id + ' subscribed to the plan id ' + this.sessionObject.plan_id;
								obj['chargeCustomer'] = 'true';
								obj['amount'] = this.sessionObject.planCost;
								obj['plan'] = this.sessionObject.plan_id;
								obj['stripeToken'] = result.token.id;
								obj['recurringornot'] = true;

								//this check and method is used in individual user case
								if (this.hasIndividualCompany) {
									this.assignBillingAddressToPrimaryAddress(this.billing_address);
								}

								obj['primaryAdd'] = this.primary_address;
								obj['billingAdd'] = this.billing_address;
								if (this.discountApplied == true) {
									obj['discountCouponCode'] = this.discountCoupon.toString();
								}
								let salesforceObj = {
									email: this.sessionObject.email,
									referredValue: this.sessionObject.referredValue,
									referredData: this.sessionObject.referredData
								}
								this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_PAYMENT', 'paidSubscription', obj ).subscribe( res => {
									// data => {
										let data = res.body;
										if (data.status === 200) {	
											if(data.results.payment_intent_secret !== undefined) {
												this.stripeService.confirmCardPayment(data.results.payment_intent_secret, {
													payment_method: {
														card: this.card.element,
														billing_details: {
															name: this.sessionObject.username,
															email: this.sessionObject.email
														}
													}
												}).subscribe(result => {
													if (result.error) {
														this.sharedLoaderService.hideLoader();
														this.msgs.push({ severity: 'error', summary: "Payment Failed, Subscribing to Free Plan" });
														setTimeout(() => {
															this.msgs = [];
															this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_PAYMENT', 'paymentAuthFailedMoveUser', obj ).subscribe( res => {
																	if (res.body.status == 200) {
																		let reqobj = {
																			userId: obj['userid']
																		}
																		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LOGIN', 'emailVerificationLink', reqobj ).subscribe( res => {
																			if (res.body) {
																				if (!this.sessionObject.username.includes("Dgtest") && !this.sessionObject.username.includes("dg") && !this.sessionObject.username.includes("Dg") && !this.sessionObject.username.includes("dG") && !this.sessionObject.username.includes("DG")) {

																					this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_SALESFORCE', 'createSaleforceLead', salesforceObj ).subscribe( res => {
																					
																						if (res.status == 200) {
																							this.router.navigate(['authentication/freeSubscription']);
																						} else {
																							console.log("error in redirect",)
																						}
																					})
																				} else {
																					this.router.navigate(['authentication/freeSubscription']);
																				}
																			}
																		})
																	}
																}
															)
														}, 3000);
													} else {
														this.sharedLoaderService.hideLoader();
														if (result.paymentIntent.status === 'succeeded') {
															localStorage.setItem("planCost", this.sessionObject.planCost);
															localStorage.setItem("planId", obj['plan']);
															this.payment_done = true;
															sessionStorage.removeItem('_xxy_dex');	
															let reqobj = {
																userId: obj['userid']
															}
															this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LOGIN', 'emailVerificationLink', reqobj ).subscribe( res => {
																if (res.body) {
																	if (!this.sessionObject.username.includes("Dgtest") && !this.sessionObject.username.includes("dg") && !this.sessionObject.username.includes("Dg") && !this.sessionObject.username.includes("dG") && !this.sessionObject.username.includes("DG")) {
																		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_SALESFORCE', 'createSaleforceLead', salesforceObj ).subscribe( res => {	
																			if (data.status == 200) {
																				this.router.navigate(['authentication/freeSubscription']);
																			} else {
																				console.log("error in redirect",)
																			}
																		})
																	} else {
																		this.router.navigate(['authentication/freeSubscription']);
																	}
																}
															})
														}
													}
												})
											} else {
												localStorage.setItem("planCost", this.sessionObject.planCost);
												localStorage.setItem("planId", obj['plan']);
												this.payment_done = true;
												sessionStorage.removeItem('_xxy_dex');
												let reqobj = {
													userId: obj['userid']
												}	
												this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LOGIN', 'emailVerificationLink', reqobj ).subscribe( res => {
													if (res.body) {
														if (!this.sessionObject.username.includes("Dgtest") && !this.sessionObject.username.includes("dg") && !this.sessionObject.username.includes("Dg") && !this.sessionObject.username.includes("dG") && !this.sessionObject.username.includes("DG")) {

															this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_SALESFORCE', 'createSaleforceLead', salesforceObj ).subscribe( res => {	
																let data = res.body;
																if (data.status == 200) {
																	this.router.navigate(['authentication/freeSubscription']);
																} else {
																	console.log("error in redirect",)
																}
															})
														} else {
															this.router.navigate(['authentication/freeSubscription']);
														}
													}
												})	
											}								
										} else {
											this.sharedLoaderService.hideLoader();
											this.msgs.push({ severity: 'error', summary: "Payment Failed, Subscribing to Free Plan" });
											setTimeout(() => {
												this.msgs = [];
												this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_PAYMENT', 'paymentAuthFailedMoveUser', obj ).subscribe( res => {
														if (data.status == 200) {
															let reqobj = {
																userId: obj['userid']
															}
															this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LOGIN', 'emailVerificationLink', reqobj ).subscribe( res => {
																if (res.body) {
																	if (!this.sessionObject.username.includes("Dgtest") && !this.sessionObject.username.includes("dg") && !this.sessionObject.username.includes("Dg") && !this.sessionObject.username.includes("dG") && !this.sessionObject.username.includes("DG")) {
																		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_SALESFORCE', 'createSaleforceLead', salesforceObj ).subscribe( res => {
																			if (data.status == 200) {
																				this.router.navigate(['authentication/freeSubscription']);
																			} else {
																				console.log("error in redirect",)
																			}
																		})
																	} else {
																		this.router.navigate(['authentication/freeSubscription']);
																	}
																}
															})
														}
													}
												)
											}, 3000);
										}
									}, () => {
										this.sharedLoaderService.hideLoader();
										this.payment_done = true;
										this.msgs.push({ severity: 'error', summary: "Payment Failed, Subscribing to Free Plan " });
										setTimeout(() => {
											this.msgs = [];
											this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_PAYMENT', 'paymentAuthFailedMoveUser', obj ).subscribe( res => {
											
													if (res.body.status == 200) {
														let reqobj ={
															userId: obj['userid']
														}
														this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LOGIN', 'emailVerificationLink', reqobj ).subscribe( res => {
															if (res.body) {
																if (!this.sessionObject.username.includes("Dgtest") && !this.sessionObject.username.includes("dg") && !this.sessionObject.username.includes("Dg") && !this.sessionObject.username.includes("dG") && !this.sessionObject.username.includes("DG")) {
																	this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_SALESFORCE', 'createSaleforceLead', obj ).subscribe( res => {
																		if (res.body.status == 200) {
																			this.router.navigate(['authentication/freeSubscription']);
																		} else {
																			console.log("error in redirect",)
																		}
																	})
																} else {
																	this.router.navigate(['authentication/freeSubscription']);
																}
																sessionStorage.removeItem('_xxy_dex');
															}
														})
													}
												}
											)
										}, 3000);
									}
								);
							}
						}
					} else if (result.error) {
						this.sharedLoaderService.hideLoader();
						this.msgs = [];
						this.msgs.push({ severity: 'error', summary: result.error.message });
						setTimeout(() => {
							this.msgs = [];
						}, 4000);
					}
				});
			}
		}
	}


	contactNumOnly(event): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		if (charCode > 31 && charCode != 43 && charCode != 45 && (charCode < 48 || charCode > 57)) {
			this.showContactNumbMsg = true;
			return false;
		}
		this.showContactNumbMsg = false;
		return true;
	}

	applyDiscount() {
		if (this.discountCoupon.length > 0) {
			let reqobj = [ this.discountCoupon, this.planDetails.stripeProductId ]
			this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_PAYMENT', 'couponValidation', reqobj ).subscribe( res => {
				let data = res.body;
				
					if (data.status == 200) {
						this.discountApplied = true;

						let discountData = data.results,
							currentPlanCost = this.planDetails['cost'];
						this.discountCouponName = discountData.name.toUpperCase();
						this.discountPercentage = discountData.percent_off;
						this.discountAmountOff = discountData.amount_off;

						if (this.discountApplied === true) {
							if (this.discountPercentage) {

								this.sub_total_Amount = currentPlanCost - (this.discountPercentage * this.sessionObject.planCost / 100);
								this.total_Amount = this.sub_total_Amount + 20 * this.sub_total_Amount / 100;
								this.msgs = [];
								this.msgs.push({ severity: 'success', summary: data.results.name + ' Applied Successfully..!!' });
								setTimeout(() => {
									this.msgs = [];
								}, 3000);

							} else if (this.discountAmountOff) {

								if ((this.discountAmountOff / 100) > currentPlanCost || (this.discountAmountOff / 100) === currentPlanCost) {
									this.msgs = [];
									this.msgs.push({ severity: 'error', summary: 'This Coupon is not valid for this Plan' });
									setTimeout(() => {
										this.msgs = [];
									}, 3000);
									this.sub_total_Amount = currentPlanCost;
									this.total_Amount = this.sub_total_Amount + 20 * this.sub_total_Amount / 100;
								} else {
									this.sub_total_Amount = currentPlanCost - this.discountAmountOff / 100;
									this.total_Amount = this.sub_total_Amount + 20 * this.sub_total_Amount / 100;
									// console.log("amountcoupon",this.sub_total_Amount);

									this.msgs = [];
									this.msgs.push({ severity: 'success', summary: data.results.name + ' Applied Successfully..!!' });
									setTimeout(() => {
										this.msgs = [];
									}, 3000);
								}
							}
						}
					}
					if (data.status == 201) {
						this.discountApplied = false;
						this.discountCoupon = "";
						this.msgs = [];
						this.msgs.push({ severity: 'error', summary: data.results });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
						this.sub_total_Amount = this.planDetails['cost'];
						this.total_Amount = this.sub_total_Amount + 20 * this.sub_total_Amount / 100;
					}
				}
			)
		}
	}

	addressFunction() {
		if ((<HTMLInputElement>document.getElementById("same")).checked) {
			this.billing_address.address_1 = this.temp_address_2;
			this.billing_address.county = this.primary_address.county;
			this.billing_address.country = this.primary_address.country;
			this.billing_address.postTown = this.primary_address.postTown;
			this.billing_address.postalCode = this.sessionObject.postCode.toUpperCase();
		}
		else {
			this.billing_address.address_1 = "";
			this.billing_address.county = "";
			this.billing_address.country = "";
			this.billing_address.postTown = "";
			this.billing_address.postalCode = "";
		}
	}

	assignBillingAddressToPrimaryAddress(billingAddress) {

		if (billingAddress.address_1 != null && billingAddress.address_1 != undefined) {

			this.primary_address.address_1 = billingAddress.address_1;
		}
		if (billingAddress.country != null && billingAddress.country != undefined) {

			this.primary_address.country = billingAddress.country;
		}
		if (billingAddress.county != null && billingAddress.county != undefined) {

			this.primary_address.county = billingAddress.county;
		}
		if (billingAddress.postalCode != null && billingAddress.postalCode != undefined) {

			this.primary_address.postalCode = billingAddress.postalCode;
		}
		if (billingAddress.postTown != null && billingAddress.postTown != undefined) {

			this.primary_address.postTown = billingAddress.postTown;
		}
	}

	ngAfterViewInit() {
        setTimeout(() => {
            this.sharedLoaderService.hideLoader();
        }, 1000);
	}
}