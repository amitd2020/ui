import { TitleCasePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { take } from "rxjs";
import { subscribedPlan } from "src/environments/environment";
import CustomUtils from "../interface/custom-pipes/custom-utils/custom-utils.utils";
import { CanonicalURLService } from "../interface/service/canonical-url.service";
import { SearchFiltersService } from "../interface/service/search-filter.service";
import { SeoService } from "../interface/service/seo.service";
import { ServerCommunicationService } from "../interface/service/server-communication.service";
import { SharedLoaderService } from "../interface/view/shared-components/shared-loader/shared-loader.service";
import { MetaContentSEO } from "src/assets/utilities/data/metaContentSEO.constants";
import { UserAuthService } from "../interface/auth-guard/user-auth/user-auth.service";
import { UserInfoType } from "../interface/auth-guard/user-auth/user-info";

@Component({
	selector: 'dg-createAccount',
	templateUrl: './app.createAccount.component.html',
	styleUrls: ['./no-auth-pages.component.scss']
})
export class CreateAccountComponent implements OnInit {

	@Input() requestFormData: any;

	@Input() userRoleInput: any;

	@ViewChild('signUpForm', { static: false }) signUpForm: NgForm;


	@Output() requestReturnToPage = new EventEmitter<any>();

	isLoggedIn: boolean = false;
	userDetails: Partial< UserInfoType > = {};
	showLoader: boolean = false;
	acceptTermsCondition: any;
	showContactNumbMsg: boolean = false;
	show_refred_by_text: boolean = false;
	show_other_text: boolean = false;
	passwordMatch: boolean = false;
	queryString = window.location.search;
	msgs = [];
	filteredPostalCodeArray: any[];
	filteredCompanyNameArray: any[];
	filteredDirectorArray: any[];
	filteredDirectorDisplayArray: any[];
	planId: string = subscribedPlan['Start'];
	subscribedPlanModal: any = subscribedPlan;
	// progressSpinner: boolean = false;
	address: string = undefined;
	post_town: string = undefined;
	county: string = undefined;
	country: string = undefined;
	postal: any = undefined;
	selectedCars1: string[];
	signUpData: any = {
		first_name: undefined,
		last_name: undefined,
		phoneNumber: undefined,
		email: undefined,
		post_town: undefined,
		county: undefined,
		country: undefined,
		password: undefined,
		confirm_password: undefined,
		company_name: undefined,
		postal_code: undefined,
		company_address: undefined,
		company_address_object: undefined,
		referredData: undefined,
		refered_by: undefined,
		other: undefined,
		termsNconditon: undefined,
		paymentModeOffline: 'false'
	};
	referredValue: any;
	signUpPageHeader = "Sign Up";
	howDidYouFineHeader: string = 'How did you find us?'

	planDetails: any = {
		planId: undefined,
		planCost: 0,
		hits: 0,
		priceperhit: 0,
		companyReport: 0,
		basicLimit: 0,
		advancedLimit: 0,
		landLimit: 0,
		corpLandLimit: 0,
		chargesLimit: 0,
		companyMonitorLimit: 0,
		directorMonitorLimit: 0
	}
	hide = true;
	hide1 = true;
	foundUsOptions = [
		{ label: 'Select an option', active: true },
		{ label: 'Google',value: 'Web - Google'},
		{ label: 'Grantify',value: 'grantify'},
        { label: 'Bing',value: 'Web - Bing'},
		{ label: 'LinkedIn', value: 'linkedIn' },
		{ label: 'Facebook', value: 'facebook' },
		{ label: 'Instagram', value: 'instagram' },
		{ label: 'Twitter', value: 'twitter' },
		{ label: 'Pinterest', value: 'pinterest' },
		{ label: 'Google Ads',value: 'Web - Google Ads'},
		// { label: 'Referred By', value: 'refferedBy' },
		{ label: 'Other', value: 'other' }
	]
	existingCompany: boolean = true;
	fieldValidate: Boolean = false;
	planStatus: string;
	emailValue = '';
	
	clientTeamListOptions: Array<{ name: string, _id: string }> = [];

	constructor(
		public userAuthService: UserAuthService,
		private searchFiltersService: SearchFiltersService,
		private titlecasePipe: TitleCasePipe,
		private router: Router,
		private seoService: SeoService,
		private canonicalService: CanonicalURLService,
		private sharedLoaderService: SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService,
		private activatedRoute: ActivatedRoute
	) {
		/*
			Do not enable the below code before discussing with Akmal.
			It reloads the `AppMainComponent`, which is the main
			layout container and parent for all of the Components/Modules.
			===============================================================
			this.router.routeReuseStrategy.shouldReuseRoute = () => false;
			===============================================================
		*/

		setTimeout(() => {

			if ( !this.requestFormData ) {

				const urlParams = new URLSearchParams(this.queryString);
				this.planId = urlParams.get("planId");

				this.seoService.setPageTitle( MetaContentSEO.createAccount.title );
				this.seoService.setMetaTitle( MetaContentSEO.createAccount.title );
				this.seoService.setDescription( MetaContentSEO.createAccount.description );
				this.seoService.setRobots( MetaContentSEO.createAccount.robots );
				this.canonicalService.setCanonicalURL();

			}

		}, 100);

	}

	ngOnInit() {

		const urlParams = new URLSearchParams(this.queryString);
		this.planStatus = this.activatedRoute.snapshot.queryParams.planId;
		
		if( this.activatedRoute.snapshot.queryParams.planId != this.subscribedPlanModal['Valentine_Special'] && this.requestFormData?.thisPage != 'user-management' ){
			window.open('https://datagardener.com/contact/', "_self")
		}
		
		if( !urlParams.get("planId") && this.requestFormData?.thisPage != 'user-management') {
			window.open('https://datagardener.com/contact/', "_self")
		}
		
		if (!CustomUtils.isNullOrUndefined(urlParams.get("planId"))) {
			this.planId = urlParams.get("planId");
			if (this.planId === this.subscribedPlanModal['Trial_48_Hours']) {
				this.signUpPageHeader = 'Sign Up for a Trial';
			} else if ( this.planId === this.subscribedPlanModal['Valentine_Special'] ) {
				this.signUpPageHeader = 'SIGN UP FOR TWO WEEKS OF FREE ACCESS TO OUR ENTERPRISE PLAN';
				this.howDidYouFineHeader = 'How did you find our offer?'
			}else {
				this.signUpPageHeader = 'Sign Up';
			}
		};

		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => {
			this.isLoggedIn = loggedIn;

			if ( this.isLoggedIn ) {
				this.userDetails = this.userAuthService?.getUserInfo();
			}
		});

		if ( ( this.requestFormData && this.requestFormData.thisPage == 'user-management' && this.userAuthService.hasRolePermission( ['Client Admin Master', 'Client Admin', 'Team Admin'] ) ) || this.userRoleInput ) {
			
			this.signUpPageHeader = 'Create User';

			if ( !this.userAuthService.hasRolePermission( ['Team Admin'] ) ) {
				this.getClientTeamsList();
			}

			this.planId = this.userRoleInput ? this.userRoleInput.plan : this.userDetails?.planId;

			this.getPlanDetails( this.planId );
		}

		if ( !this.requestFormData ) {
			
			this.getPlanDetails( this.planId );

		}

	}

	selectedData(event, referredOptions) {

		this.referredValue = referredOptions;

		if (event.value === 'refferedBy') {
			this.show_refred_by_text = true;
			this.show_other_text = false;
		} else if (event.value === 'other') {
			this.show_other_text = true;
			this.show_refred_by_text = false;
		} else {
			this.show_refred_by_text = false;
			this.show_other_text = false;
		}

	}

	getClientTeamsList() {
		let clientAdminEmail = [ this.userRoleInput ? this.userRoleInput.email : this.userDetails?.email ];

		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_USER_API', 'teamNamesList', clientAdminEmail ).subscribe( res => {

			if ( res.body['status'] == 200 ) {

				this.clientTeamListOptions = res.body['results'];
				
				this.clientTeamListOptions.unshift( { name: 'Select Team', _id: '' } );

			}

		});
	}

	goToTeamManagementPage() {

		if ( this.userAuthService.hasRolePermission( ['Client Admin'] ) ) {
			this.router.navigate( ['/user-management/team-management'] );
		}

		if ( this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
			this.requestReturnToPage.emit('goToTeamsPageContainer');
		}

	}

	getPlanDetails( planId ) {

		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe( res => {
			let data = res.body;
			if (data.status == 200) {
				this.planDetails.planId = data['results']._id;
				this.planDetails.planCost = data['results'].cost;
				this.planDetails.hits = data['results'].hits;
				this.planDetails.priceperhit = data['results'].priceperhit;
				this.planDetails.companyReport = data['results'].companyReport;
				this.planDetails.basicLimit = data['results'].basicLimit;
				this.planDetails.advancedLimit = data['results'].advancedLimit;
				this.planDetails.landLimit = data['results'].landLimit;
				this.planDetails.corpLandLimit = data['results'].corpLandLimit;
				this.planDetails.chargesLimit = data['results'].chargesLimit;
				this.planDetails.companyMonitorLimit = data['results'].companyMonitorLimit;
				this.planDetails.directorMonitorLimit = data['results'].directorMonitorLimit;
				this.planDetails.directorReportLimit = data['results'].directorReportLimit;
			}
		});
	}

	signUpUserFormSubmission(formData: NgForm) {
		if (this.validateForm(formData.value)) {
			this.sharedLoaderService.showLoader();

			if (this.requestFormData && this.requestFormData.thisPage == 'user-management') {

				if ( this.userAuthService.hasRolePermission( ['Super Admin'] ) && !this.userRoleInput ) {

					this.planDetails = this.requestFormData.planDetails;
					// this.signUpData.password = undefined;
				}

				this.signUpData.isEmailVerified = true;
			}

			// let salesforceObj = {
			// 	email: this.signUpData.email,
			// 	referredValue: this.referredValue,
			// 	referredData: this.signUpData.referredData
			// }

			// let hubspotObj = {
			// 	email: this.signUpData.email,
			// 	referredValue: this.referredValue,
			// 	referredData: this.signUpData.referredData
			// }

			if ( ( this.requestFormData && this.requestFormData.thisPage == 'user-management' && this.userAuthService.hasRolePermission( ['Client Admin Master', 'Client Admin', 'Team Admin'] ) ) || this.userRoleInput ) {
				this.signUpData['clientAdminEmail'] = this.userRoleInput && this.userRoleInput.email ? this.userRoleInput.email : this.userDetails?.email;
				this.planDetails.planCost = 0;
				// this.signUpData.password = undefined;
			}

			if ( this.userAuthService.hasRolePermission( ['Team Admin'] ) ) {
				this.signUpData['teamId'] = this.userDetails?.teamId;
			}

			let isEmailVerified = false;

			if ( this.signUpData.isEmailVerified ) {
				isEmailVerified = true;
			}

			let reqPayload = {
				first_name: this.signUpData.first_name,
				last_name: this.signUpData.last_name,
				phoneNumber: this.signUpData.phoneNumber,
				email: this.signUpData.email.toLowerCase(),
				plan: this.planStatus || this.userAuthService.getUserInfo('planId'),
				_id: this.userAuthService.getUserInfo('dbID') || '5ae6e577b37318328c601208'
				// referredData: this.signUpData.referredData,
				// refered_by: this.signUpData.refered_by,
				// other: this.signUpData.other,
				// types: this.selectedType && this.selectedType?.name ? this.selectedType?.name : 'default'
				// Pages: [1, 2, 12, 4, 5, 6, 7, 8, 9],
				// postalCode: this.signUpData.postal_code,
				// companyReport: this.planDetails.companyReport,
				// basicLimit: this.planDetails.basicLimit,
				// advancedLimit: this.planDetails.advancedLimit,
				// landLimit: this.planDetails.landLimit,
				// corpLandLimit: this.planDetails.corpLandLimit,
				// chargesLimit: this.planDetails.chargesLimit,
				// companyMonitorLimit: this.planDetails.companyMonitorLimit,
				// directorMonitorLimit: this.planDetails.directorMonitorLimit,
				// directorReportLimit: this.planDetails.directorReportLimit,
				// isEmailVerified: isEmailVerified
			};

			// if ( this.signUpData.hasOwnProperty('password') ) {
			// 	reqPayload['password'] = this.signUpData.password;
			// }

			// if (this.planDetails.hits === 0 && this.planDetails.priceperhit === 0) {
			// 	reqPayload["hits"] = 0;
			// 	reqPayload["priceperhit"] = 0;
			// } else if (this.planDetails.hits !== 0) {
			// 	reqPayload["hits"] = this.planDetails.hits;
			// 	reqPayload["priceperhit"] = this.planDetails.priceperhit;
			// }

			// reqPayload["api_access_token"] = Math.floor(Math.random() * 1000000000) + 1;

			// if (this.signUpData.company_number) reqPayload["companyNumber"] = this.signUpData.company_number;
			if (this.signUpData.company_name) reqPayload["companyName"] = this.signUpData.company_name;
			// if (this.signUpData.company_address) reqPayload["companyAddress"] = this.signUpData.company_address;
			// if (this.signUpData.post_town) reqPayload["city"] = this.signUpData.post_town;
			// if (this.signUpData.county) reqPayload["county"] = this.signUpData.county;
			// if (this.signUpData.country) reqPayload["country"] = this.signUpData.country;

			if ( this.userAuthService.hasRolePermission( ['Client Admin Master', 'Team Admin'] ) ) {
				reqPayload["companyName"] = this.userDetails?.companyName;
				reqPayload['clientAdminEmail'] = this.userDetails?.clientAdminEmail;
				reqPayload['teamId'] = this.signUpData.teamId;
			} else if ( this.userAuthService.hasRolePermission( ['Team Admin'] ) ) {
				reqPayload['clientAdminEmail'] = this.userDetails?.clientAdminEmail;
				reqPayload["companyName"] = this.userDetails?.companyName;
				reqPayload['teamId'] = this.signUpData.teamId;
			} else if ( this.userRoleInput ) {
				reqPayload['clientAdminEmail'] = this.userRoleInput.email;
				reqPayload['teamId'] = this.signUpData.teamId;
			} else if ( this.signUpData.teamId ) {
				reqPayload['clientAdminEmail'] = this.userAuthService?.getUserInfo('clientAdminEmail');
				reqPayload['teamId'] = this.signUpData.teamId;
			}

			// if (  this.subscribedPlanModal['Valentine_Special'].includes( this.planDetails.planId ) ) {
			// 	reqPayload['regionCode'] = 'GBR';
			// 	reqPayload['platformType'] = 'default';
			// } else {
			// 	reqPayload['regionCode'] = [];
			// 	reqPayload['platformType'] = [];
			// }

			this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LOGIN', 'registration', reqPayload ).subscribe({
				next: ( res ) => {
				let data = res.body;
					if (data.code === 200) {
						formData.resetForm();
						this.requestReturnToPage.emit(true);
						this.sharedLoaderService.hideLoader();
						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: data.message });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);

						if ( this.planStatus ) {		
							setTimeout(() => {
								this.router.navigate(['authentication/login']);
							}, 4000);
						}

						/*if (this.planDetails.planCost === 0) {
							// let obj = {
							// 	userid: data["results"]["_id"],
							// 	plan: data["results"]["plan"],
							// 	description: "This is Free Test Plan"
							// };

							// if ( ( this.requestFormData && this.requestFormData.thisPage == 'user-management' ) && formData.value.paymentModeOfflineGroup === 'true') {
							// 	obj['payment_mode'] = formData.value.paymentModeOfflineGroup;
							// }

							// if ( ( this.requestFormData && this.requestFormData.thisPage == 'user-management' && this.userAuthService.hasRolePermission( ['Client Admin Master', 'Client Admin', 'Team Admin'] ) ) || ( this.userRoleInput && this.userRoleInput.userRole == 'Client Admin' ) ) {

							// 	this.requestReturnToPage.emit(true);

							// } 
							this.sharedLoaderService.hideLoader();
							// else {

							// 	this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_PAYMENT', 'freeSubscription', obj ).subscribe( res => {
							// 		if (res.body.status === 200) {
		
							// 			if (this.requestFormData && this.requestFormData.thisPage == 'user-management') {
		
							// 				this.signUpData.paymentModeOffline = false;
							// 				this.requestReturnToPage.emit(true);
		
							// 			} else {
		
							// 				let reqobj = {
							// 					userId: obj['userid']
							// 			   }
							// 				this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LOGIN', 'emailVerificationLink', reqobj ).subscribe( res => {
							// 					if (res.body) {
		
							// 						let userName = this.signUpData.first_name + " " + this.signUpData.last_name
		
							// 						if (!userName.includes("Dgtest") && !userName.includes("dg") && !userName.includes("Dg") && !userName.includes("dG") && !userName.includes("DG")) {
							// 							this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_SALESFORCE', 'createSaleforceLead', salesforceObj ).subscribe( res => {
							// 								if (res.body.status == 200) {
							// 									this.router.navigate(['authentication/freeSubscription']);
							// 								} else {
							// 									console.log("error in redirect",)
							// 								}
							// 							})
							// 						} else {
							// 							this.router.navigate(['authentication/freeSubscription']);
							// 						}
							// 					}
							// 				});
							// 			}
							// 		}
							// 	}, error => {
							// 		this.sharedLoaderService.hideLoader();
							// 		this.msgs.push({ severity: 'error', summary: "Can't SignUp, Mandatory Fields Are Not Filled" });
							// 		setTimeout(() => {
							// 			this.msgs = [];
							// 		}, 6000);
							// 		console.log(error);
							// 	});

							// }

						} else if (this.planDetails.planCost > 0) {
							let freeObj = {
								userid: data["results"]["_id"],
								plan: subscribedPlan['Start'],
								description: "This is Free Test Plan"
							};

							// this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_PAYMENT', 'freeSubscription', freeObj ).subscribe( res => {
							// 	let freeSubsData = res.body
							// 	if (freeSubsData.status === 200) {
							// 		let obj = {};

							// 		if (
							// 			data["results"].hasOwnProperty("username") && data["results"]["username"] !== undefined &&
							// 			(data["results"].hasOwnProperty("email") && data["results"]["email"] !== undefined) &&
							// 			(data["results"].hasOwnProperty("plan") && data["results"]["plan"] !== undefined) &&
							// 			(data["results"].hasOwnProperty("_id") && data["results"]["_id"] !== undefined) &&
							// 			this.planDetails.planCost > 0
							// 		) {
							// 			obj["plan_payment"] = data["results"]["plan"];
							// 			obj["id_payment"] = data["results"]["_id"];
							// 			obj["username"] = data["results"]["username"];
							// 			obj["email"] = data["results"]["email"];
							// 			obj["phoneNumber"] = this.signUpData["phoneNumber"];
							// 			// obj["postalCode"] = this.signUpData["postal_code"];
							// 			obj["amount_payment"] = String(this.planDetails.planCost);
							// 			obj["companyName"] = this.signUpData["company_name"];
							// 			obj["companyNumber"] = this.signUpData["company_number"];
							// 			obj["referredValue"] = this.referredValue,
							// 				obj["referredData"] = this.signUpData["referredData"]
							// 			// obj["county"] = data["results"]["county"];
							// 			// obj["local_authority_name"] = data["results"]["city"];

							// 			obj["existingCompany"] = this.existingCompany;

							// 			sessionStorage.setItem("_xxy_dex", JSON.stringify(obj));

							// 			if (sessionStorage.getItem("_xxy_dex") !== undefined || sessionStorage.getItem("_xxy_dex") !== null) {
							// 				//saleforce method
							// 				this.router.navigate(["authentication/cardDetails"]);
							// 			}

							// 		} else {
							// 			this.msgs = [];
							// 			this.msgs.push({ severity: 'error', summary: "Please fill your correct information and try again!" });
							// 			setTimeout(() => {
							// 				this.msgs = [];
							// 			}, 6000);
							// 		}
							// 	}
							// },
							// error => {
							// 	this.sharedLoaderService.hideLoader();
							// 	this.msgs = [];
							// 	this.msgs.push({ severity: 'error', summary: "Can't SignUp, Mandatory Fields Are Not Filled" });
							// 	setTimeout(() => {
							// 		this.msgs = [];
							// 	}, 6000);
							// 	console.log(error);
							// });

						}
						// this.msgs = [];
						// 				this.msgs.push({ severity: 'error', summary: "Please fill your correct information and try again!" });
						// 				setTimeout(() => {
						// 					this.msgs = [];
						// 				}, 6000);
						this.sharedLoaderService.hideLoader();*/

					} else if (data.status === 201) {
						this.msgs = [];
						this.sharedLoaderService.hideLoader();
						this.msgs.push({ severity: 'error', summary: "Can't SignUp, Email Already Exists" });
						setTimeout(() => {
							this.msgs = [];
						}, 6000);
					} 
					this.fieldValidate = false;
					this.sharedLoaderService.hideLoader();
				},
				error: ( err ) =>  {
					this.msgs = [];
						this.sharedLoaderService.hideLoader();
						this.msgs.push({ severity: 'error', summary: err.error.message });
						setTimeout(() => {
							this.msgs = [];
						}, 4000);
				}
			});


		} else {
			this.fieldValidate = true;
		}
	}

	validateForm(formData) {
		if( this.planStatus ) {
			const regex = new RegExp('^[a-zA-Z0-9._%+-]+@(?!gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com|mail\.com|aol\.com|zoho\.com|protonmail\.com|tutanota\.com|yandex\.com|rocketmail\.com|hotmail\.co\.uk|live\.com)(?!gmail\.)(?!outlook\.)(?!hotmail\.)(?!yahoo\.)(?!mail\.)(?!icloud\.)(?!live\.)(?!hotmail\.)(?!yandex\.)(?!protonmail\.)(?!tutanota\.)(?!zoho\.)(?!rocketmail\.)(?!yourcompany\.)(?!example\.)(?!businessmail\.)(?!businessdomain\.)(?!organization\.)(?!fastmail\.)(?!hushmail\.)(?!protonmail\.)(?!spectrum\.)(?!verizon\.)(?!att\.)(?!sbcglobal\.)(?!bellsouth\.)(?!ameritech\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
			if( regex.test(formData.email) ){
				this.signUpData.email = formData.email;
			}	
		} else {
			this.signUpData.email = formData.email;
		}
			
		
		this.signUpData.first_name = formData.first_name;
		this.signUpData.last_name = formData.last_name;
		this.signUpData.post_town = formData.post_town;
		this.signUpData.county = formData.county;
		this.signUpData.country = formData.country;
		this.signUpData.phoneNumber = formData.phoneNumber;
		this.signUpData.password = formData.password ? formData.password : "";
		this.signUpData.confirm_password = formData.confirm_password;
		this.signUpData.company_address_object = formData.company_name ? formData.company_name.address : '';
		this.signUpData.company_address = formData.address;

		if (this.referredValue == 'refferedBy') {
			this.signUpData.referredData = formData.refered_by;
		} else if (this.referredValue == 'other') {
			this.signUpData.referredData = formData.otherText;
		} else if (this.referredValue !== "refferedBy" || this.referredValue !== "other") {
			this.signUpData.referredData = this.referredValue;
		}
		if (formData.termsNconditon == "termsCondition") {
			this.signUpData.termsNconditon = true;
		} else {
			this.signUpData.termsNconditon = false;
		}
		if (typeof (formData.company_name) == "string") {
			this.signUpData.company_name = formData.company_name;
		} else {
			this.signUpData.company_number = formData.company_name ? formData.company_name.value : '';
			this.signUpData.company_name = formData.company_name ? formData.company_name.key : '';
		}

		if (formData.postal_code !== undefined) {
			if (formData.postal_code.key == undefined) {
				this.signUpData.postal_code = formData.postal_code;
			} else {
				this.signUpData.postal_code = formData.postal_code ? formData.postal_code.key.toLowerCase() : '';
			}
		}

		// if ( !this.isLoggedIn ) {
		// 	if (formData.confirm_password !== "" && formData.password !== "") {
		// 		if (this.signUpData.password !== this.signUpData.confirm_password) {
		// 			this.msgs = [];
		// 			this.msgs.push({ severity: 'error', summary: 'Password and Confirm Password does not match ' });
		// 			setTimeout(() => {
		// 				this.msgs = [];
		// 			}, 6000);
		// 		}
		// 	}
		// }

		if ( ( this.requestFormData && this.requestFormData.thisPage == 'user-management' && ( ( this.userAuthService.hasRolePermission( ['Super Admin'] ) && this.userRoleInput ) || this.userAuthService.hasRolePermission( ['Client Admin Master', 'Client Admin'] ) ) && !this.userAuthService.hasRolePermission( ['Team Admin'] ) ) ) {

			this.signUpData['teamId'] = formData.clientUserTeam;

			// if ( !this.signUpData['teamId'] ) {
			// 	return false;
			// }

		}

		if ( !this.signUpData.referredData && !this.requestFormData ) {
			return false;
		}

		if ( !this.isLoggedIn ) {

			if ( 
				this.signUpData.first_name && 
				this.signUpData.last_name && 
				this.signUpData.email
				// this.signUpData.phoneNumber &&
				// this.signUpData.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,}$/) && 
				// this.signUpData.confirm_password && 
				// this.signUpData.password === this.signUpData.confirm_password
			) {
				if (this.requestFormData && this.requestFormData.thisPage == 'user-management') {

					for ( let signUpDataKey in this.signUpData ) {
						if ( [ 'password', 'confirm_password' ].includes( signUpDataKey ) ) {
							delete this.signUpData[ signUpDataKey ];
						}
					}

					return true;
				} else if (this.signUpData.termsNconditon && this.signUpData.termsNconditon.length != 0 && !this.requestFormData) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}

		} else {

			if ( this.signUpData.first_name && this.signUpData.last_name && this.signUpData.email ) {
				if (this.requestFormData && this.requestFormData.thisPage == 'user-management') {

					for ( let signUpDataKey in this.signUpData ) {
						if ( [ 'password', 'confirm_password' ].includes( signUpDataKey ) ) {
							delete this.signUpData[ signUpDataKey ];
						}
					}

					return true;
				} else if (this.signUpData.termsNconditon && this.signUpData.termsNconditon.length != 0 && !this.requestFormData) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
			
		}
	}

	filteredPostalCode(event) {
		if (event.query.length > 2) {
			let query = event.query.replace(/\s/g, '');
			this.searchFiltersService.getKeywordsPostCode('RegAddress_Modified.postalCode.keyword', 'keywordPostCode', query.toString().toLowerCase(), 'companySearch', undefined).then(data => {
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
					} else {
						this.filteredPostalCodeArray = [];
					}
				}
			})
		} else {
			this.filteredPostalCodeArray = [];
		}
	}

	filteredCompanyName(event, from?) {
		if (event.query.length > 2) {
			let obj = {};

		if(from == 'createAccount') {
			obj = {
				companyName: event.query.toString().toLowerCase(),
				companyStatus: "live"
			};
		} else {
			obj = {
				companyName: event.query.toString().toLowerCase()
			}
		}
			this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_API', 'companyNameSuggestions' , obj ).subscribe( res => {
				let data = res.body;
				if (data !== undefined) {
					if (data.status == 200) {
						if (data['results'] !== undefined) {
							if (data['results']['hits']['total']['value'] == 0) {
								this.filteredCompanyNameArray = [];
							} else if (data['results']['hits']['total']['value'] > 0) {
								this.filteredCompanyNameArray = [];
								for (let val of data['results']['hits']['hits']) {
									let address = {
										"RegAddress": val['_source']['RegAddress_Modified'],
										"contactDetails": val['_source']['contactDetails']
									}
									this.filteredCompanyNameArray.push({ key: this.titlecasePipe.transform(val['_source']['businessName']), value: val['_source']['companyRegistrationNumber'], address: address, directors_data: val['_source']['directorsData'], postal: val['_source']['RegAddress_Modified'] && val['_source']['RegAddress_Modified']['postalCode'] ? val['_source']['RegAddress_Modified']['postalCode'] : "" });
								}
							}
							this.existingCompany = true;
						} else {
							this.filteredCompanyNameArray = [];
							this.existingCompany = false;
						}
					} else {
						this.filteredCompanyNameArray = [];
						this.existingCompany = false;
					}
				} else {
					this.filteredCompanyNameArray = [];
				}
			})
		} else {
			this.filteredCompanyNameArray = [];
		}
	}

	onSelectCompany(event) {
		this.fieldValidate = false;
		for (let key in this.signUpForm.form.controls) {
			if (['first_name', 'last_name', 'phoneNumber', 'postal_code', 'country', 'county', 'post_town', 'password', 'confirm_password', 'address'].includes(key) && this.signUpForm.form.controls[key].touched) {
				this.signUpForm.form.controls[key].reset()
			}
		}

		if (event !== undefined) {
			this.address = this.formatCompanyAddress(event.value.address);
			if (event.value.address["RegAddress"]) {
				this.post_town = undefined;
				this.country = undefined;
				this.county = undefined;
				if (event.value.address["RegAddress"]["district"]) {
					this.post_town = this.capitalize(event.value.address["RegAddress"]["district"]);
				} if (event.value.address["RegAddress"]["county"]) {
					this.county = this.capitalize(event.value.address["RegAddress"]["county"]);
				} if (event.value.address["RegAddress"]["country"]) {
					this.country = this.capitalize(event.value.address["RegAddress"]["country"]);
				}
			}

			if (this.postal) {
				this.postal = undefined;
			}
			if (event.postal) {
				this.postal = { "key": event.postal.toUpperCase() };
			}

			if (event.directors_data !== undefined) {
				if (event.directors_data.length > 0) {
					this.filteredDirectorArray = [];
					for (let val of event.directors_data) {
						if (val.detailedInformation !== undefined) {
							this.filteredDirectorArray.push({ key: this.formatDirectorName(val.detailedInformation) })
						}
					}
				} else {
					this.filteredDirectorArray = [];
				}
			} else {
				this.filteredDirectorArray = [];
			}
		} else {
			this.filteredDirectorArray = [];
		}
	}

	filteredDirector(event) {
		this.filteredDirectorDisplayArray = [];
		let filtered: any[] = [];
		if (this.filteredDirectorArray !== undefined) {
			for (let i = 0; i < this.filteredDirectorArray.length; i++) {
				let director_name = this.filteredDirectorArray[i];
				if (director_name.key.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
					filtered.push(director_name);
				}
			}
			this.filteredDirectorDisplayArray = filtered;
		}
	}

	formatCompanyAddress(address) {
		if (address === undefined) {
			return address;
		} else if (address === null) {
			return address;
		} else {
			if (address['contactDetails'] || address['RegAddress']) {
				if (address['contactDetails'] && address['RegAddress']) {
					return (this.formatCreateAccountCompanyAddress(address['RegAddress']));
				}
				else if ((!address['contactDetails']) && address['RegAddress']) {
					return (this.formatCreateAccountCompanyAddress(address['RegAddress']));
				}
				else if (address['contactDetails'] && (!address['RegAddress'])) {
					return (this.formatCreateAccountCompanyAddress(address['contactDetails']));
				}
			}
		}
	}

	formatCreateAccountCompanyAddress(address) {
		let str = "";
		if (address.addressLine1 != undefined && address.addressLine1 !== null) {
			if (address.addressLine1.length > 0 && address.addressLine1 !== "Not Provided") {
				str += this.titlecasePipe.transform(address.addressLine1) + ", ";
			} else if (address.addressLine1 === "Not Provided") {
				str += address.addressLine1.toLowerCase();
			}
		}
		if (address.addressLine2 != undefined && address.addressLine2 != null) {
			if (address.addressLine2.length > 0)
				str += this.titlecasePipe.transform(address.addressLine2) + ", ";
		}
		if (address.addressLine3 != undefined && address.addressLine3 != null) {
			if (address.addressLine3.length > 0)
				str += this.titlecasePipe.transform(address.addressLine3) + ", ";
		}
		if (address.addressLine4 != undefined && address.addressLine4 != null) {
			if (address.addressLine4.length > 0)
				str += this.titlecasePipe.transform(address.addressLine4);
		}
		var splitStr = str.split(" ");
		for (var i = 0; i < splitStr.length; i++) {
			// You do not need to check if i is larger than splitStr length, as your for does that for you
			// Assign it back to the array
			splitStr[i] =
				splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
		}
		// Directly return the joined string
		return splitStr.join(" ").replace(/,\s*$/, "");
	}

	directorNameConvert(name) {
		if (typeof (name) === "object") {
			return name.key;
		}
		else if (typeof (name) === "string") {
			return name;
		}
	}

	formatDirectorName(name) {
		let full_name = "";
		if (name.forename !== undefined && name.forename !== null) {
			full_name = name.forename;
		}
		if (name.middlename !== undefined && name.middlename !== null) {
			full_name += ' ' + name.middlename;
		}
		if (name.surname !== undefined && name.surname !== null) {
			full_name += ' ' + name.surname;
		}
		return (this.titlecasePipe.transform(full_name));
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
	

	formatSessionObjectAddress(address) {
		let str = "";
		if (address === undefined) {
			return address;
		} else if (address === null) {
			return address;
		} else {
			if (address['RegAddress']) {
				if (address['RegAddress'].addressLine1 != undefined && address['RegAddress'].addressLine1 !== null) {
					str += this.titlecasePipe.transform(address['RegAddress'].addressLine1) + ", ";
				}
				if (address['RegAddress'].addressLine2 != undefined && address['RegAddress'].addressLine2 != null) {
					str += this.titlecasePipe.transform(address['RegAddress'].addressLine2) + ", ";
				}
				if (address['RegAddress'].addressLine3 != undefined && address['RegAddress'].addressLine3 != null) {
					str += this.titlecasePipe.transform(address['RegAddress'].addressLine3) + ", ";
				}
				if (address['RegAddress'].addressLine4 != undefined && address['RegAddress'].addressLine4 != null) {
					str += this.titlecasePipe.transform(address['RegAddress'].addressLine4);
				}
			}
		}
		return str;
	}

	capitalize = (s) => {
		if (typeof s !== 'string') return ''
		else {
			var splitStr = s.split(" ");
			for (var i = 0; i < splitStr.length; i++) {
				splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
			}
			return splitStr.join(" ");
		}
	}
}