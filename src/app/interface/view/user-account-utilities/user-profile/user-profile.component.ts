import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { subscribedPlan } from 'src/environments/environment';
import { SharedLoaderService } from '../../shared-components/shared-loader/shared-loader.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';
import { Router } from '@angular/router';

@Component({
	selector: 'dg-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'

	userDetails: Partial< UserInfoType > = {};
	joinDate: string = undefined;
	location: string = undefined;
	// currentPlan: string;
	api_access_token: string = undefined;
	userRole: string = undefined;
	SuggestionsCompany_number: string = '';

	updateProfileData: any = {
		name: undefined,
		changed_name: undefined,
		email: undefined,
		company_name: undefined,
		company_number: undefined,
		city: undefined,
		postal_code: undefined,
		phone: undefined,
		created_on: undefined,
		_id: undefined,
		password1: undefined,
		old_password: undefined,
		password2: undefined,
		address_1: undefined,
		consolidatedEmailNotification: undefined,
		BillingAddress: {
			AddressLine1: undefined,
			Country: undefined,
			County: undefined,
			PostCode: undefined,
			PostTown: undefined
		}

	};

	tempActualData: any;
	companyNameNumberSearchKey: string = '';
	filteredCompanyNameArray: any[];
	SubscribtionValue: boolean;
	display: boolean = false;
	hide: boolean = true;
	hide1: boolean = true;
	hide2: boolean = true;
	displayPasswordDialog: boolean = false;
	showContactNumbMsg: boolean = false;
	showUpgradePlanDialog: boolean = false;
	updateCompanyNumber: string = '';
	alertMsgs: any[] = [];
	msgs: any[] = [];
	subscribedPlanModal: any = subscribedPlan;
	companyMonitorEmailOptions: Array<any> = [
		{ label: 'Consolidated', value: true },
		{ label: 'Separate', value: false }
	]
	constantMessages: any = UserInteractionMessages;
	validate: boolean = false;
	accountTypes: string[];
	isLogoAndCoverDisabled: boolean = false;

	constructor(
		public userAuthService: UserAuthService,
		private titlecasePipe: TitleCasePipe,
		private seoService: SeoService,
		public commonService: CommonServiceService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunicate: ServerCommunicationService,
		private router: Router,
	) {
		this.accountTypes = JSON.parse(localStorage.getItem('types')).toString();
	 }

	ngOnInit() {
		this.initBreadcrumbAndSeoMetaTags();

		this.userDetails = this.userAuthService?.getUserInfo();

		this.checkCompanyNumber();

		this.getUserDetails(undefined);

		this.sharedLoaderService.hideLoader();
		
	}
	filteredCompanyName(event) {
		if (event.query.length > 2) {
			let obj = {};
		
		} 
		let obj = { companyName: event.query.toString().toLowerCase() };
		
		this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_API', 'companyNameSuggestionsNew' , obj ).subscribe( res => {
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
								this.filteredCompanyNameArray.push( this.titlecasePipe.transform(val['_source']['companyRegistrationNumber']) + '-' + this.titlecasePipe.transform(val['_source']['businessName']) );
								// this.updateProfileData.company_name = this.titlecasePipe.transform(val['_source']['businessName']);
								// this.updateProfileData.company_number = val['_source']['companyRegistrationNumber'];
								this.SuggestionsCompany_number = val['_source']['companyRegistrationNumber'];
							}
						}
						// this.existingCompany = true;
					} else {
						this.filteredCompanyNameArray = [];
						// this.existingCompany = false;
					}
				} else {
					this.filteredCompanyNameArray = [];
					// this.existingCompany = false;
				}
			} else {
				this.filteredCompanyNameArray = [];
			}
			
		})
		
	}

	selectCompany( event ) {
		this.validate = true;
		if ( event.value ) {
			this.updateProfileData.company_number = '';
			this.updateProfileData.company_name = '';
			setTimeout(() => {
				this.updateProfileData.company_number = (event.value.split('-')[0]);
				this.updateCompanyNumber = (event.value.split('-')[0]);
				this.updateProfileData.company_name = (event.value.split('-')[1]);
			}, 0);
		}
	}

	searchCompanyNumber( event ) {
		this.updateProfileData.company_name = '';
		// this.updateProfileData.company_number = '';
		// this.validate = false;
	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadCrumbService.setItems([
		// 	{ label: 'Profile' }
		// ]);
		this.title = "User Profile - DataGardener";
		this.description = "In user profile you can see and update your own details.";
		this.seoService.setPageTitle(this.title);
	
	}

	updatePasswordButton() {
		this.displayPasswordDialog = true;
	}

	onNoPasswordClicked() {
		this.displayPasswordDialog = false;
	}

	updateProfileButton() {
		if(this.updateProfileData.company_number !== this.updateCompanyNumber){
			this.updateProfileData.company_number = ''
		}

		if ( this.commonService.comparingObjects(this.tempActualData, this.updateProfileData) ) {

			this.alertMsgs = [];
			this.alertMsgs.push({ severity: 'error', detail: 'Not changes detected!' });
			// this.router.navigate( ['user-account-info/user-profile'] );
			setTimeout(() => {
				this.alertMsgs = [];
			}, 2000);	

		} else {
			this.display = true;
			// this.router.navigate( ['user-account-info/user-profile'] );
		}

	}

	onNoButtonClicked() {
		this.display = false;
	}

	getUserDetails( from: string ) {
		
		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_USER_API', 'getUserDetails' ).subscribe( res => {
			
			if (res.status === 200) {
				let obj = res.body;

				this.updateProfileData._id = obj["_id"];

				if (obj["createdOn"]) {
					this.updateProfileData.created_on = obj["createdOn"];
				}
				if (obj["username"]) {
					this.updateProfileData.name = obj["username"];
					this.updateProfileData.name = obj["username"];
					if (from == "updateProfile") {
						localStorage.setItem("username", obj["username"])
					}
				}

				if (obj["email"]) {
					this.updateProfileData.email = obj["email"];
				}
				if (obj["phoneNumber"]) {
					this.updateProfileData.phone = obj["phoneNumber"];
				}
				if (obj["companyName"]) {
					if( obj["companyNumber"] == 'undefined' ) {
						this.updateProfileData.company_name = ''
					} else {
						this.updateProfileData.company_name = this.titlecasePipe.transform(obj["companyName"]);
					}
				}
				if (obj["companyNumber"]) {
					this.updateProfileData.company_number = obj["companyNumber"] == 'undefined' ? '' : obj["companyNumber"];
					this.validate = true;
				}
				
				if (obj["BillingAddress"] != undefined) {

					if (obj["BillingAddress"]["AddressLine1"]) {
						this.updateProfileData.BillingAddress.AddressLine1 = obj["BillingAddress"]["AddressLine1"];
					}
					if (obj["BillingAddress"]["Country"]) {
						this.updateProfileData.BillingAddress.Country = obj["BillingAddress"]["Country"];
					}
					if (obj["BillingAddress"]["County"]) {
						this.updateProfileData.BillingAddress.County = obj["BillingAddress"]["County"];
					}
					if (obj["BillingAddress"]["PostCode"]) {
						this.updateProfileData.BillingAddress.PostCode = obj["BillingAddress"]["PostCode"];
					}
					if (obj["BillingAddress"]["PostTown"]) {
						this.updateProfileData.BillingAddress.PostTown = obj["BillingAddress"]["PostTown"];
					}

				}

				if (obj["consolidatedEmailNotification"] !== undefined) {
					this.updateProfileData.consolidatedEmailNotification = obj["consolidatedEmailNotification"];
				}

				if (obj["createdOn"]) {
					this.joinDate = this.formatISODate(obj["createdOn"]);
				}
				if (obj['emailSubscription']) {
					this.SubscribtionValue = obj["emailSubscription"];
				}

				if ( obj['userRole'] ) {
					this.userRole = obj['userRole']
				}

				this.tempActualData = JSON.stringify(this.updateProfileData);
			}
		});
		
	}

	formatPostalCode() {
		if (this.updateProfileData.postal_code.key !== undefined) {
			this.updateProfileData.postal_code = this.updateProfileData.postal_code.key;
		}
	}

	removeSpaces(code) {
		let temp = "";
		for (let i = code.length; i >= 0; i--) {
			if (code.charAt(i) !== " ") temp = code.charAt(i) + temp;
		}
		return temp;
	}

	formatISODate(date) {
		return this.commonService.formatISODate(date);
	}

	updateProfile() {
		this.display = false;

		if (this.updateProfileData.name && this.updateProfileData.name.trim().length > 0) {

			let requestBody = {
				BillingAddress: this.updateProfileData.BillingAddress,
				companyName: this.updateProfileData.company_name,
				companyNumber: ( this.updateProfileData.company_number == ( this.SuggestionsCompany_number || this.updateCompanyNumber) ) ? this.updateProfileData.company_number : 'undefined',
				phoneNumber: this.updateProfileData.phone,
				username: this.updateProfileData.name,
				_id: this.updateProfileData._id,
				consolidatedEmailNotification: this.updateProfileData.consolidatedEmailNotification
			};

			this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_USER_API', 'editProfile', requestBody ).subscribe( res => {
				
				if (res.body.status === 200) {
					this.alertMsgs = [];
					this.alertMsgs.push({ severity: 'success', detail: this.constantMessages['successMessage']['updateProfileSuccess'] });
					this.alertMsgs = [];
					this.getUserDetails("updateProfile");
					// this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LOGIN', 'userAuthorization' ).subscribe( res => {});
					
					localStorage.removeItem('authInfo');
					this.userAuthService.updateLoginStatus( true );
					
					setTimeout(() => {
						this.checkCompanyNumber();	
						}, 1000);
					}

			}, error => {
				console.log(error);
				this.alertMsgs = [];
				this.alertMsgs.push({ severity: 'error', summary: 'Error !', detail: 'There was an error while updating your profile!' });
				setTimeout(() => {
					this.alertMsgs = [];
				}, 2000);

			});
		} else if ( this.updateProfileData.name && this.updateProfileData.name.trim().length === 0 ) {

			this.alertMsgs = [];
			this.alertMsgs.push({ severity: 'error', summary: 'Error !', detail: 'Please provide a valid name and try again!' });
			setTimeout(() => {
				this.alertMsgs = [];
			}, 2000);

		}
	}

	updatePassword(updatePasswordForm) {

		this.displayPasswordDialog = false;

		if ( this.updateProfileData.old_password && this.updateProfileData.password1 && this.updateProfileData.password1 === this.updateProfileData.password2 ) {

			let requestBody = {
				oldPassword: this.updateProfileData.old_password,
				newPassword: this.updateProfileData.password1,
				userId: this.updateProfileData._id
			};

			this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_USER_API', 'changeUserPassword', requestBody ).subscribe( res=> {
				
				if (res.body.status === 200) {
					this.alertMsgs = [];
					this.alertMsgs.push({ severity: 'success', detail: this.constantMessages['successMessage']['updatePasswordSuccess'] });
					setTimeout(() => {
						this.alertMsgs = [];
					}, 2000);

					updatePasswordForm.resetForm();
				} else if (res.body.status === 426) {

					this.alertMsgs = [];
					this.alertMsgs.push({ severity: 'error', summary: 'Error !', detail: 'User could not be found!' });
					setTimeout(() => {
						this.alertMsgs = [];
					}, 2000);
				} else if (res.body.status === 424) {
					this.alertMsgs = [];
					this.alertMsgs.push({ severity: 'error', detail: 'Current password is incorrect!' });
					setTimeout(() => {
						this.alertMsgs = [];
					}, 2000);
				}
			}, error => {
				if (error.status === 426) {
					this.alertMsgs = [];
					this.alertMsgs.push({ severity: 'error', summary: 'Error !', detail: 'User could not be found!' });
					setTimeout(() => {
						this.msgs = [];
					}, 2000);


				} else if (error.status === 424) {
					this.alertMsgs = [];
					this.alertMsgs.push({ severity: 'error', detail: 'Current password is incorrect!' });
					setTimeout(() => {
						this.alertMsgs = [];
					}, 2000);

				}
			});
		} else {
			if (this.updateProfileData.password1 !== undefined && this.updateProfileData.password2 !== undefined) {
				this.alertMsgs = [];
				this.alertMsgs.push({ severity: 'error', detail: 'New password and confirm password are not same!' });
				setTimeout(() => {
					this.alertMsgs = [];
				}, 2000);
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

	getAPIToken() {

		this.showUpgradePlanDialog = false;

		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_USER_API', 'getAPIAccessToken' ).subscribe( res => {
			if (res.body.status == 200) {
				this.api_access_token = res['body']['results'];
			}
		});

	}

	checkCompanyNumber() {
		this.userDetails = this.userAuthService.getUserInfo();
		if ( !this.userDetails?.companyNumber ) {
			this.isLogoAndCoverDisabled = true;
		} else {
			this.isLogoAndCoverDisabled = false;
		}
	}

}
