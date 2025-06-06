import { isPlatformBrowser, Location } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Output, PLATFORM_ID, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { environment, subscribedPlan } from 'src/environments/environment';
import { AuthGuardService } from '../interface/auth-guard/auth-guard.guard';
import { EncrDecrService } from '../interface/auth-guard/encryptAndDecrypt';
import { CanonicalURLService } from '../interface/service/canonical-url.service';
import { SeoService } from '../interface/service/seo.service';
import { ServerCommunicationService } from '../interface/service/server-communication.service';
import { linkedInCredentials } from '../interface/social-login-credentials/linkedin-constant';
import { SharedLoaderService } from '../interface/view/shared-components/shared-loader/shared-loader.service';
import { SocialLoginService } from '../interface/service/socialLogins.service';
import { MetaContentSEO } from 'src/assets/utilities/data/metaContentSEO.constants';
import { UserAuthService } from '../interface/auth-guard/user-auth/user-auth.service';
import { take } from 'rxjs';

@Component({
	selector: 'dg-login',
	templateUrl: './app.login.component.html',
	styleUrls: ['./no-auth-pages.component.scss']
})
export class AppLoginComponent {

	@ViewChild('loginForm', { static: false }) loginForm: NgForm;

	@Output() showLoginModal = new EventEmitter<any>();

	hide = true;
	progressSpinner: boolean = false;

	userId: string;
	msgs = [];
	message = [];
    value : any;
	loginConfirmation: boolean = false;
    inputEmail: string = '';
    showOtpForm = false;

	linkedinFirstName: string = '';
	linkedinlastNameName: string = '';
	linkedInUserEmail: string = '';
	loginType: string = '';
	access_token: string = '';
	linkedInData: any;

	loggedIn: boolean | undefined;
	planId: string = subscribedPlan['Start'];
	planDetails: any = {
		planid: undefined,
		planCost: 0,
		hits: 0,
		priceperhit: 0,
		companyReport: 0,
		basicLimit: 0,
		advancedLimit: 0,
		landLimit: 0,
		corpLandLimit: 0,
		chargesLimit: 0
	}

    otp: string[] = new Array(6).fill('');
    otpDigits = Array(6).fill(0);
    countdown: number = 0;
    timer: any;
    otpConfirmation: Boolean = false;
    @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;


	countrySelectionOptions: { name: string, countryCode: string, regionCode: string, currencyCode: string }[] = [
		{ name: 'United Kingdom', countryCode: 'uk', regionCode: 'GBR', currencyCode: 'GBP' },
		{ name: 'Ireland', countryCode: 'ie', regionCode: 'IRL', currencyCode: 'EUR' }
	];
	selectedGlobalCountry: Partial< { name: string, countryCode: string, regionCode: string, currencyCode: string } > = this.countrySelectionOptions[0];

    showProgressSpinner: boolean = false;
    showTemplate1: boolean = true;
    showTemplate2: boolean = false;
    showTemplate3: boolean = false;
    hasOtpFromApp: boolean = false;

    hasModesList: string[] = [];

	constructor(
        private router: Router,
        public authGuardService: AuthGuardService,
        @Inject(PLATFORM_ID) private platformId: object,
        private _encrypt: EncrDecrService,
        private seoService: SeoService,
        private canonicalService: CanonicalURLService,
        private _activatedRoute: ActivatedRoute,
        private sharedLoaderService: SharedLoaderService,
        private socialAuthService: SocialAuthService,
        private globalServiceCommnunicate: ServerCommunicationService,
		private location: Location,
        private socialLoginService: SocialLoginService,
        public userAuthService: UserAuthService
    ) {

        if ( this._activatedRoute.snapshot.url[0] ) {
            //If condition set seo services only on login page
            if ( this._activatedRoute.snapshot.url[0].path == 'login' ) {
                this.seoService.setPageTitle( MetaContentSEO.login.title );
                this.seoService.setMetaTitle( MetaContentSEO.login.title );
                this.seoService.setDescription( MetaContentSEO.login.description );
                this.seoService.setRobots( MetaContentSEO.login.robots );
                this.canonicalService.setCanonicalURL();
            }

        }

    }

	ngOnInit() {

        let linkedInCode;

        linkedInCode = this._activatedRoute.snapshot.queryParams['code'];

        if ( linkedInCode !== '' && linkedInCode != undefined ) {
            this.getLinkedInAccessToken( linkedInCode );
        }
    }

    onInput(event: any, index: number) {
        const input = event.target;
        const value = input.value;
    
        if (value.length > 1) {
          input.value = value.charAt(0);
        }
    
        if (value && index < 5) {
          this.focusInput(index + 1);
        }
    }

    onKeyDown(event: KeyboardEvent, index: number) {
        if (event.key === 'Backspace' && !this.otp[index] && index > 0) {
          this.focusInput(index - 1);
        }
    }
    
    focusInput(index: number) {
        const input = this.otpInputs.toArray()[index];
        input?.nativeElement.focus();
    }

    onPaste(event: ClipboardEvent) {
        event.preventDefault();
        const pasteData = event.clipboardData?.getData('text') || '';
        const digits = pasteData.replace(/\D/g, '').slice(0, this.otpDigits.length);
      
        for (let i = 0; i < digits.length; i++) {
          this.otp[i] = digits[i];
        }

        setTimeout(() => {
            const nextInput = document.getElementsByName(`otp${digits.length - 1}`)[0] as HTMLInputElement;
            nextInput?.focus();
        }, 0);
    }
      

    verifyOtp() {
        const otpCode = this.otp.join('');

        if (otpCode.length !== 6 ) {
            this.msgs = [{ severity: 'error', summary: 'Invalid OTP', detail: 'Please enter all 6 digits' }];
            setTimeout(() => {
                this.msgs = [];
            }, 2000);
            return;
        }
        let obj = {
            code: otpCode,
            email: this.inputEmail,
            regionCode: this.selectedGlobalCountry?.regionCode,
            platformType: "default"
        }

        this.globalServiceCommnunicate.globalServerRequestCall('post', 'DG_LOGIN', 'twoFactorAuthentication', obj).subscribe(
            {
                next: async ( res ) => {

                    if( res.body.code = 200){
                        this.loginAfterProcess()
                        this.otpConfirmation = false;
                    }
                },
                error: ( err ) => {    
                    this.showMessage( err );
                    console.log(err);
                     
                },
            }
        );
    }
    
    startCountdown() {
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.countdown = 60;
        this.timer = setInterval(() => {
          this.countdown--;
          if (this.countdown === 0) {
            clearInterval(this.timer);
          }
        }, 1000);
      }
    
    resendOtp() {
        this.otp = new Array(6).fill('');
        this.startCountdown();
        let obj = {
            email: this.inputEmail
        }

        if ( this.hasModesList.length && this.hasModesList?.[0] == 'emailOTP' ) {
            obj['modeType'] = 'emailOTP';
        }

        this.globalServiceCommnunicate.globalServerRequestCall('post', 'DG_LOGIN_API', 'resendMFACode', obj).subscribe(
            {
                next: async ( res ) => {
                    if( res.body.code = 200){
                        this.message = [];
                        this.message.push({ severity: 'success', summary: res.body.message });
                        
                        setTimeout(() => {
                            this.message = [];
                        }, 6000);
                    } else {
                        this.message = [];
                        this.message.push({ severity: 'error', summary: res.body.message });
                        
                        setTimeout(() => {
                            this.message = [];
                        }, 6000);
                    }
                }

            })
    }

    async loginAfterProcess(){
        if (isPlatformBrowser(this.platformId)) {
            // let obj = data['body']['result'];

            // let token = data['body']['token'];
            // const xToken = (obj['plan'] + ':' + obj['_id']);
            // // const dw = this._encrypt.set(xToken);
            // let firstLogin = obj["firstlogin"];

            // await this.authGuardService.store(token, dw);
            localStorage.setItem("dgExtensionDialog", 'login');
            // this.userId = obj["_id"];
            
            localStorage.setItem('isLoggedIn', 'true');
            await this.userAuthService.updateLoginStatus( true );

            if ( this.selectedGlobalCountry?.countryCode ) {
                localStorage.setItem( 'selectedGlobalCountry', this.selectedGlobalCountry?.countryCode );
                localStorage.setItem( 'selectedGlobalCurrency', this.selectedGlobalCountry?.currencyCode );
            }

            // if (firstLogin === true) {
            //     //Temporaily Commented
            //     // this.router.navigate(['authentication/user-account-preferences']);
            //     this.router.navigate(['/']);
            // } else {
                this.router.navigate(['/']);
            // }

            // setTimeout(() => {

            //     if ( !this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
            //         // this.updateUserDataToSalesforce();
            //         this.updateUserDataToHubspot(this.inputEmail);
            //     }

            // }, 1000);

            setTimeout(() => {
                this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => {
                    this.showLoginModal.emit( loggedIn );
                });
            }, 100);

            this.showProgressSpinner = false;
        }
    }

	loginUser( formData: NgForm, from? ) {

        let obj = {};
        
        const { email, password } = formData.value;
         obj['regionCode'] = this.selectedGlobalCountry?.regionCode;
         obj['platformType'] = "default";
         this.inputEmail = email

        const EncryptD = this._encrypt.set( JSON.stringify( { email, password } ) );
        obj['data'] = EncryptD;

        if ( from == 'formComfirmation' ) {
            obj['isAllLogout'] = true;
        }

        this.showProgressSpinner = true;
        this.globalServiceCommnunicate.globalServerRequestCall('post', 'DG_LOGIN', 'login', obj).subscribe(
            {
                next: async ( res ) => {
                    
                    let data = res;

                    // this.router.navigate(['/']);
                    // this.userAuthService.updateLoginStatus( true );
        
                    if (data.status === 200) {
        
                        if (data['body']['code'] === 401) {
        
                            this.msgs = [];
                            this.msgs.push({ severity: 'error', summary: data['body']['message'] });
                            setTimeout(() => {
                                this.msgs = [];
                            }, 3000);
                            setTimeout(() => {
                                this.loginConfirmation = true;
                                this.loginType = 'withOutSocialLogin';
                            }, 4000);
        
                        } else if ( data['body']['status'] == 498 ) {
        
                            this.loginConfirmation = true;
                            this.loginType = 'withOutSocialLogin';
        
                        } else {

                            if ( data.body.response?.[0]?.is2FAEnabled ) {
                                localStorage.setItem( "is2FAEnabled", JSON.stringify(data.body.response?.[0]?.is2FAEnabled) );
                            }

                            if ( data.body.response?.[0]?.modesList ) {
                                localStorage.setItem( "modesList", JSON.stringify(data.body.response?.[0]?.modesList) );
                                this.hasModesList = localStorage.getItem( 'modesList' ) ? JSON.parse( localStorage.getItem( 'modesList' ) ) : [];
                            }

                            if ( this.hasModesList.length && this.hasModesList?.[0] == 'emailOTP' ) {
                                this.hasOtpFromApp = true;
                            }

                            if( data.body.response?.[0]?.is2FAEnabled == true ){
                                // this.otpConfirmation = true;
                                this.startCountdown();
                                this.showOtpForm = true;

                                return;
                            }
                            this.loginAfterProcess();
                        }
        
                    } else if (data.status === 204) {
                        this.msgs = [];
                        this.msgs.push({ severity: 'error', summary: 'Email could not be found!' });
                        setTimeout(() => {
                            this.msgs = [];
                        }, 6000);
                    }
        
                },
                error: ( err ) => {
                    if ( err.code == 404 ) {
                        this.msgs = [];
                        this.showProgressSpinner = false;
                        this.msgs.push({ severity: 'error', summary: err.message });
                        setTimeout(() => {
                            this.msgs = [];
                        }, 2000);

                    } else if ( err.hasOwnProperty('error') && err?.error?.code == 404 ) {
                        this.msgs = [];
                        this.showProgressSpinner = false;
                        this.msgs.push({ severity: 'error', summary: err.error.message });
                        setTimeout(() => {
                            this.msgs = [];
                        }, 2000);

                    } else {
                        this.msgs = [];
                        this.showProgressSpinner = false;
                        this.msgs.push({ severity: 'error', summary: err.message });
                        setTimeout(() => {
                            this.msgs = [];
                        }, 2000);

                    }
                },
            }
        );
    }

    handleTryAnotherWay() {

        if ( this.hasModesList.length && this.hasModesList?.[0] == 'app2FA' ) {
            this.showTemplate1 = false;
            this.showTemplate2 = true;
            this.showTemplate3 = false;
        }

        if ( this.hasModesList.length && this.hasModesList?.[0] == 'emailOTP' ) {
            this.showTemplate1 = false;
            this.showTemplate2 = false;
            this.showTemplate3 = true;
            this.resendOtp();
        }
    }

    verifyOtpFromApp() {
        const otpCode = this.otp.join('');

        if (otpCode.length !== 6 ) {
            this.msgs = [{ severity: 'error', summary: 'Invalid OTP', detail: 'Please enter all 6 digits' }];
            setTimeout(() => { 
                this.msgs = [];
            }, 2000)
            return;
        }

        let obj = {
            code: otpCode,
            regionCode: this.selectedGlobalCountry?.regionCode,
            platformType: "default",
            email: this.inputEmail
        }

        this.globalServiceCommnunicate.globalServerRequestCall('post', 'DG_LOGIN', 'validateTOTP', obj).subscribe( {
            next: async ( res ) => {
                if ( res.body.code = 200 ) {
                    this.loginAfterProcess();
                    this.otpConfirmation = false;
                }
            },
            error: ( err ) => {  
                this.showMessage( err );  
                console.log(err);
            }
        });
    }

    showMessage( message ) {
		this.msgs = [];
		this.msgs.push( { severity: 'error', summary: message } );
		setTimeout(() => {
			this.msgs = [];
		}, 2000);
	}

	loginConfirm() {

        if ( this.loginType == 'withOutSocialLogin' ) {
            this.loginUser( this.loginForm, 'formComfirmation' );
        } else if ( this.loginType == 'google' || this.loginType == 'facebook' ) {
            this.socialSignIn( this.loginType, 'formComfirmation' );
        } else if ( this.loginType == 'linkedIn' ) {
            this.getLinkedInAccessToken( undefined, 'formComfirmation' );
        }

        this.loginConfirmation = false;

    }

    openInNewTab() {
        window.open('/authentication/forgotPassword', '_blank');
    }

	//Update Data to salesforce
	// updateUserDataToSalesforce() {
	// 	let obj = {
	// 		"email": this.userAuthService?.getUserInfo()?.email
	// 	}
	// 	this.globalServiceCommnunicate.globalServerRequestCall('put', 'DG_SALESFORCE', 'updateSalesforceLead', obj).subscribe(res => { });
	// }

    //Update Data to hubspot
	updateUserDataToHubspot(email: string) {
		let obj = {
			"email": email
		}
		this.globalServiceCommnunicate.globalServerRequestCall('post', 'HS_EXTENSION', 'updateHubspotContactForCRM', obj).subscribe(res => { });
	}

	formatUTCTime(d) {
        let utcTime = new Date(d)
        var dd = utcTime.getDate();
        var mm = utcTime.getMonth() + 1;
        var yyyy = utcTime.getFullYear();
        var hh = utcTime.getHours();
        var min = utcTime.getMinutes();
        var ss = utcTime.getSeconds();
        if (dd < 10) { dd = 0 + dd }
        if (mm < 10) { mm = 0 + mm };
        return dd + "/" + mm + "/" + yyyy + " " + hh + ":" + min + ":" + ss;
    }

	async socialSignIn( socialPlatform: string, from? ) {

        let socialResponse;
        
        if ( socialPlatform === 'facebook' ) {
            socialResponse = await this.socialLoginService.FaceBookAuth().then( res => res['user']['_delegate'] ).catch( error => {
                this.msgs = [];
                this.msgs.push({ severity: 'error', summary: 'An account already exists with the same email address but different sign-in credentials' });
                setTimeout(() => {
                    this.msgs = [];
                }, 4000);
            } );
            // socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
        } else if ( socialPlatform === 'google' ) {
            socialResponse = await this.socialLoginService.GoogleAuth().then( res => res['user']['_delegate'] ).catch( error => {
                this.msgs = [];
                this.msgs.push({ severity: 'error', summary: 'An account already exists with the same email address but different sign-in credentials' });
                setTimeout(() => {
                    this.msgs = [];
                }, 4000);
            } );
        }

        let obj = {
            first_name: socialResponse && socialResponse?.['displayName'] && socialResponse['displayName'].split(' ')[0],
            last_name: socialResponse && socialResponse?.['displayName'] && socialResponse['displayName'].split(' ')[1],
            referredData: "",
            refered_by: "",
            other: "",
            password: "",
            phoneNumber: "",
            email: socialResponse && socialResponse?.['email'] && socialResponse['email'],
            postal_code: "",
            isEmailVerified: true
        }

        let reqobj = {
            email: socialResponse.email 
        };

        this.showProgressSpinner = true;
        this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LOGIN', 'LoginWithSocialMedia', reqobj ).subscribe(
            {
                next: async ( socialLoginRes ) => {
                    if (socialLoginRes['body']['code'] === 200) {
                        this.sharedLoaderService.hideLoader();
                        if (isPlatformBrowser(this.platformId)) {
                            // let obj1 = socialLoginRes['body']['result'];
                            // let token = socialLoginRes['body']['token'];
                            // const xToken = (obj1['plan'] + ':' + obj1['_id']);
                            // const dw = this._encrypt.set(xToken);
                            // this.authGuardService.store(token, dw);
                            // this.userId = obj1["_id"];
                            // let firstLogin = obj1["firstlogin"];
                            // localStorage.setItem("dbID", obj1["_id"]);
                            // localStorage.setItem("email", data.results.email);
                            // localStorage.setItem("planId", data.results["plan"]);
                            // localStorage.setItem("isAdmin", data.results["IsAdmin"]);
                            // localStorage.setItem("username", data.results["username"]);
                            if (localStorage.getItem("isAdmin") !== undefined && localStorage.getItem("isAdmin") !== '1') {

                                // this.updateUserDataToEngagebayAfterPlanUpgrade();
                            }

                            await this.userAuthService.updateLoginStatus( true );

                            if ( this.selectedGlobalCountry?.countryCode ) {
                                localStorage.setItem( 'selectedGlobalCountry', this.selectedGlobalCountry?.countryCode );
                            }

                            // Check If User Subscription is Active
                            // setTimeout(() => {
                            //     let resobj = [ this.userId ];
                            //     this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_SUBSCRIPTION', 'allSubscriptions', resobj ).subscribe(allSubscriptionRes => {
                            //         if (allSubscriptionRes.status == 200) {
                            //             let subscriptionDetails: any = allSubscriptionRes.body,
                            //                 currentDate: Date = new Date(),
                            //                 subscriptionEndDate: Date;

                            //             for (let subscriptionObj of subscriptionDetails) {
                            //                 if (subscriptionObj.status) {
                            //                     subscriptionEndDate = new Date(subscriptionObj.endDate);
                            //                 }
                            //             }

                            //             this.userAuthService.updateUserAuthInfo( { isSubscriptionActive: ( currentDate < subscriptionEndDate ) } );

                            //             localStorage.setItem('isSubscriptionActive', JSON.stringify( this.userAuthService?.getUserInfo()?.isSubscriptionActive) );

                            //         }
                            //     });

                            // }, 100);

                            // End Check If User Subscription is Active
                            let tempString = "sociallogin";
                            localStorage.setItem("loginCheck", tempString);

                            let obj = {
                                email: socialResponse.email
                            }

                            //Reset password link send
                            this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_USER_API', 'sendForgotPasswordLink', obj ).subscribe();
                            //Reset password link send

                            this.router.navigate(['/']);
                            
                            setTimeout(() => {
                                this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => {
                                    this.showLoginModal.emit( loggedIn );
                                });
                            }, 100);
                            
                            this.showProgressSpinner = false;
                        }
                    } else {
                        this.sharedLoaderService.hideLoader();
                        this.msgs = [];
                        this.showProgressSpinner = false;
                        this.msgs.push({ severity: 'error', summary: socialLoginRes.body.message });
                        setTimeout(() => {
                            this.msgs = [];
                        }, 3000);
                    }
                },
                error: ( err ) => {
                    this.msgs = [];
                    this.showProgressSpinner = false;
                    this.msgs.push({ severity: 'error', summary: err.error.message });
                    setTimeout(() => {
                        this.msgs = [];
                    }, 6000);
                    this.sharedLoaderService.hideLoader();
                }
            }
        );

        // this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe(planData => {
        //     let data = planData.body;
        //     let isEmailVerified = false;
        //     if (data.status == 200) {
        //         this.planDetails.planId = data['results']._id;
        //         this.planDetails.planCost = data['results'].cost;
        //         this.planDetails.hits = data['results'].hits;
        //         this.planDetails.priceperhit = data['results'].priceperhit;
        //         this.planDetails.companyReport = data['results'].companyReport;
        //         this.planDetails.basicLimit = data['results'].basicLimit;
        //         this.planDetails.advancedLimit = data['results'].advancedLimit;
        //         this.planDetails.landLimit = data['results'].landLimit;
        //         this.planDetails.corpLandLimit = data['results'].corpLandLimit;
        //         this.planDetails.chargesLimit = data['results'].chargesLimit;

        //         if (obj.isEmailVerified) {
        //             isEmailVerified = true;
        //         }

        //         let reqPayload = {
        //             first_name: obj.first_name,
        //             last_name: obj.last_name,
        //             referredData: obj.referredData,
        //             refered_by: obj.refered_by,
        //             phoneNumber: obj.phoneNumber,
        //             other: obj.other,
        //             email: obj.email,
        //             Pages: [1, 2, 12, 4, 5, 6, 7, 8, 9],
        //             postalCode: obj.postal_code,
        //             plan: this.planDetails.planId,
        //             companyReport: this.planDetails.companyReport,
        //             basicLimit: this.planDetails.basicLimit,
        //             advancedLimit: this.planDetails.advancedLimit,
        //             landLimit: this.planDetails.landLimit,
        //             corpLandLimit: this.planDetails.corpLandLimit,
        //             chargesLimit: this.planDetails.chargesLimit,
        //             isEmailVerified: isEmailVerified,
        //             directorReportLimit: this.planDetails.directorReportLimit,
        //         };

        //         if (this.planDetails.hits === 0 && this.planDetails.priceperhit === 0) {
        //             reqPayload['hits'] == 0;
        //             reqPayload['priceperhit'] == 0;
        //         } else if (this.planDetails.hits != 0) {
        //             reqPayload['hits'] == this.planDetails.hits;
        //             reqPayload['priceperhit'] == this.planDetails.priceperhit;
        //         }
        //         reqPayload['api_access_token'] = Math.floor(Math.random() * 1000000000) + 1;
        //         if (obj['company_number']) reqPayload['company_number'] = obj['company_number'];
        //         if (obj['company_name']) reqPayload['company_name'] = obj['company_name'];
        //         if (obj['company_address']) reqPayload['company_address'] = obj['company_address'];
        //         if (obj['company_address_object']) reqPayload['company_address_object'] = obj['company_address_object'];

                // this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_USER_API', 'socialRegistration', reqPayload ).subscribe( socialRegisterRes => {
            
                //     if (socialRegisterRes.body.status === 200) {
                //         if (this.planDetails.planCost === 0) {
                //             let obj = {
                //                 userid: socialRegisterRes.body["results"]["_id"],
                //                 plan: socialRegisterRes.body["results"]["plan"],
                //                 description: "This is Free Test Plan"
                //             };
                //             this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_PAYMENT', 'freeSubscription', obj ).subscribe(r => {
                //                 if (r.status === 200) {
                //                     this.sharedLoaderService.showLoader();
                //                     let reqobj = {
                //                         email: socialResponse.email 
                //                     }
                //                     this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LOGIN', 'LoginWithSocialMedia', reqobj ).subscribe(
                //                         {
                //                             next: async ( socialLoginRes ) => {
                //                                 if (socialLoginRes['body']['status'] === 200) {
                //                                     this.sharedLoaderService.hideLoader();
                //                                     if (isPlatformBrowser(this.platformId)) {
                //                                         let obj1 = socialLoginRes['body']['result'];
                //                                         let token = socialLoginRes['body']['token'];
                //                                         const xToken = (obj1['plan'] + ':' + obj1['_id']);
                //                                         const dw = this._encrypt.set(xToken);
                //                                         // this.authGuardService.store(token, dw);
                //                                         this.userId = obj1["_id"];
                //                                         let firstLogin = obj1["firstlogin"];
                //                                         localStorage.setItem("dbID", obj1["_id"]);
                //                                         localStorage.setItem("email", data.results.email);
                //                                         localStorage.setItem("planId", data.results["plan"]);
                //                                         localStorage.setItem("isAdmin", data.results["IsAdmin"]);
                //                                         localStorage.setItem("username", data.results["username"]);
                //                                         if (localStorage.getItem("isAdmin") !== undefined && localStorage.getItem("isAdmin") !== '1') {
    
                //                                             // this.updateUserDataToEngagebayAfterPlanUpgrade();
                //                                         }

                //                                         await this.userAuthService.updateLoginStatus( true );

                //                                         if ( this.selectedGlobalCountry?.countryCode ) {
                //                                             localStorage.setItem( 'selectedGlobalCountry', this.selectedGlobalCountry?.countryCode );
                //                                         }
    
                //                                         // Check If User Subscription is Active
                //                                         setTimeout(() => {
                //                                             let resobj = [ this.userId ];
                //                                             this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_SUBSCRIPTION', 'allSubscriptions', resobj ).subscribe(allSubscriptionRes => {
                //                                                 if (allSubscriptionRes.status == 200) {
                //                                                     let subscriptionDetails: any = allSubscriptionRes.body,
                //                                                         currentDate: Date = new Date(),
                //                                                         subscriptionEndDate: Date;
    
                //                                                     for (let subscriptionObj of subscriptionDetails) {
                //                                                         if (subscriptionObj.status) {
                //                                                             subscriptionEndDate = new Date(subscriptionObj.endDate);
                //                                                         }
                //                                                     }
    
                //                                                     this.userAuthService.updateUserAuthInfo( { isSubscriptionActive: ( currentDate < subscriptionEndDate ) } );
    
                //                                                     localStorage.setItem('isSubscriptionActive', JSON.stringify( this.userAuthService?.getUserInfo()?.isSubscriptionActive) );
    
                //                                                 }
                //                                             });
    
                //                                         }, 100);
    
                //                                         // End Check If User Subscription is Active
                //                                         let tempString = "sociallogin";
                //                                         localStorage.setItem("loginCheck", tempString);

                //                                         let obj = {
                //                                             email: socialResponse.email
                //                                         }

                //                                         //Reset password link send
                //                                         this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_USER_API', 'sendForgotPasswordLink', obj ).subscribe();
                //                                         //Reset password link send

                //                                         this.router.navigate(['/']);

                //                                         setTimeout(() => {
                //                                             this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => {
                //                                                 this.showLoginModal.emit( loggedIn );
                //                                             });
                //                                         }, 100);
                //                                     }
                //                                 } else if (data.status === 204) {
                //                                     this.sharedLoaderService.hideLoader();
                //                                     this.msgs = [];
                //                                     this.msgs.push({ severity: 'error', summary: 'Email could not be found!' });
                //                                     setTimeout(() => {
                //                                         this.msgs = [];
                //                                     }, 6000);
                //                                 }
                //                             },
                //                             error: ( err ) => {
                //                                 this.msgs = [];
                //                                 this.msgs.push({ severity: 'error', summary: '"Wrong Email Or Password"' });
                //                                 setTimeout(() => {
                //                                     this.msgs = [];
                //                                 }, 6000);
                //                                 this.sharedLoaderService.hideLoader();
                //                             }
                //                         }
                //                     );
                //                 }

                //                 this.sharedLoaderService.hideLoader();

                //             });
                //         }
                //     }
                //     // if (socialRegisterRes.body.status === 201) {
                //     //     this.sharedLoaderService.showLoader();
                //     //     let obj = {
                //     //         email: socialResponse.email
                //     //     }

                //     //     if ( from == 'formComfirmation' ) {
                //     //         obj['isAllLogout'] = true;
                //     //     }

                //     //     this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LOGIN', 'LoginWithSocialMedia', obj ).subscribe(
                //     //         {

                //     //             next: async ( socialLoginRes ) => {
                //     //                 if (socialLoginRes['body']['status'] === 200) {
                //     //                     this.sharedLoaderService.hideLoader();
                //     //                 if (isPlatformBrowser(this.platformId)) {
                //     //                     let obj1 = socialLoginRes['body']['result'];

                //     //                     let token = socialLoginRes['body']['token'];
                //     //                     const xToken = (obj1['plan'] + ':' + obj1['_id']);
                //     //                     const dw = this._encrypt.set(xToken);
                //     //                     // this.authGuardService.store(token, dw);
                //     //                     this.userId = obj1["_id"];
                //     //                     let firstLogin = obj1["firstlogin"];
                //     //                     localStorage.setItem("dbID", obj1["_id"]);
                //     //                     localStorage.setItem("email", socialResponse.email);
                //     //                     localStorage.setItem("planId", obj1["plan"]);
                //     //                     localStorage.setItem("isAdmin", obj1["IsAdmin"]);
                //     //                     localStorage.setItem("username", obj1["username"]);
                //     //                     if (localStorage.getItem("isAdmin") !== undefined && localStorage.getItem("isAdmin") !== '1') {

                //     //                         // this.updateUserDataToEngagebayAfterPlanUpgrade();
                //     //                     }

                //     //                     await this.userAuthService.updateLoginStatus( true );

                //     //                     if ( this.selectedGlobalCountry?.countryCode ) {
                //     //                         localStorage.setItem( 'selectedGlobalCountry', this.selectedGlobalCountry?.countryCode );
                //     //                     }

                //     //                     // Check If User Subscription is Active

                //     //                     setTimeout(() => {
                //     //                         let reqobj = [ this.userId ];
                //     //                         this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_SUBSCRIPTION', 'allSubscriptions', reqobj ).subscribe(subscribtionRes => {
                //     //                             if (subscribtionRes.status == 200) {
                //     //                                 let subscriptionDetails: any = subscribtionRes.body,
                //     //                                     currentDate: Date = new Date(),
                //     //                                     subscriptionEndDate: Date;

                //     //                                 for (let subscriptionObj of subscriptionDetails) {
                //     //                                     if (subscriptionObj.status) {
                //     //                                         subscriptionEndDate = new Date(subscriptionObj.endDate);
                //     //                                     }
                //     //                                 }

                //     //                                 this.userAuthService.updateUserAuthInfo( { isSubscriptionActive: ( currentDate < subscriptionEndDate ) } );

                //     //                                 localStorage.setItem( 'isSubscriptionActive', JSON.stringify( this.userAuthService?.getUserInfo()?.isSubscriptionActive ) );

                //     //                             }
                //     //                         });

                //     //                     }, 100);

                //     //                     // End Check If User Subscription is Active
                                        
                //     //                     this.router.navigate(['/']);

                //     //                     let message = data.message;
                //     //                     if (message === 'Email Already Exists') {
                                            
                //     //                     }
                //     //                     else {
                //     //                         let tempString = "sociallogin";
                //     //                         localStorage.setItem("loginCheck", tempString);

                //     //                         let _reqObj = {
                //     //                             email: socialResponse.email
                //     //                         }

                //     //                         //Reset password link send
                //     //                         this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_USER_API', 'sendForgotPasswordLink', _reqObj ).subscribe();
                //     //                         //Reset password link send
                //     //                     }

                //     //                     setTimeout(() => {
                //     //                         this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => {
                //     //                             this.showLoginModal.emit( loggedIn );
                //     //                         });
                //     //                     }, 100);
                //     //                 }
                //     //             } else if ( socialLoginRes['body']['status'] === 498 ) {
                //     //                 this.loginConfirmation = true;
                //     //                 this.loginType = socialPlatform
                //     //             } 
                //     //             else if (data.status === 204) {
                //     //                     this.sharedLoaderService.hideLoader();
                //     //                 this.msgs = [];
                //     //                 this.msgs.push({ severity: 'error', summary: 'Email could not be found!' });
                //     //                 setTimeout(() => {
                //     //                     this.msgs = [];
                //     //                 }, 6000);
                //     //             }
                //     //             },
                //     //             error: ( err ) => {
                //     //                 this.msgs = [];
                //     //                 this.msgs.push({ severity: 'error', summary: '"Wrong Email Or Password"' });
                //     //                     this.sharedLoaderService.hideLoader();
                //     //                 setTimeout(() => {
                //     //                     this.msgs = [];
                //     //                 }, 6000);
                //     //                 // this.showLoader = false;
                //     //                 this.sharedLoaderService.hideLoader();

                //     //             }
                                
                //     //         }
                //     //     );

                //     //     this.sharedLoaderService.hideLoader();

                //     // }
                // });
            // }
        // });




        // this.socialAuthService.signIn(socialPlatformProvider).then((res) => {

        //     this.signOut();

        //     let obj = {
        //         first_name: res.firstName,
        //         last_name: res.lastName,
        //         referredData: "",
        //         refered_by: "",
        //         other: "",
        //         password: "",
        //         phoneNumber: "",
        //         email: res.email,
        //         postal_code: "",
        //         isEmailVerified: true
        //     }
            
        //     let reqobj = {
        //         planId: this.planId
        //     };
        //     this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_PLANS', 'planDetail', reqobj ).subscribe(planData => {
        //         let data = planData.body;
        //         let isEmailVerified = false;
        //         if (data.status == 200) {
        //             this.planDetails.planId = data['results']._id;
        //             this.planDetails.planCost = data['results'].cost;
        //             this.planDetails.hits = data['results'].hits;
        //             this.planDetails.priceperhit = data['results'].priceperhit;
        //             this.planDetails.companyReport = data['results'].companyReport;
        //             this.planDetails.basicLimit = data['results'].basicLimit;
        //             this.planDetails.advancedLimit = data['results'].advancedLimit;
        //             this.planDetails.landLimit = data['results'].landLimit;
        //             this.planDetails.corpLandLimit = data['results'].corpLandLimit;
        //             this.planDetails.chargesLimit = data['results'].chargesLimit;

        //             if (obj.isEmailVerified) {
        //                 isEmailVerified = true;
        //             }

        //             let reqPayload = {
        //                 first_name: obj.first_name,
        //                 last_name: obj.last_name,
        //                 referredData: obj.referredData,
        //                 refered_by: obj.refered_by,
        //                 phoneNumber: obj.phoneNumber,
        //                 other: obj.other,
        //                 email: obj.email,
        //                 Pages: [1, 2, 12, 4, 5, 6, 7, 8, 9],
        //                 postalCode: obj.postal_code,
        //                 plan: this.planDetails.planId,
        //                 companyReport: this.planDetails.companyReport,
        //                 basicLimit: this.planDetails.basicLimit,
        //                 advancedLimit: this.planDetails.advancedLimit,
        //                 landLimit: this.planDetails.landLimit,
        //                 corpLandLimit: this.planDetails.corpLandLimit,
        //                 chargesLimit: this.planDetails.chargesLimit,
        //                 isEmailVerified: isEmailVerified,
        //                 directorReportLimit: this.planDetails.directorReportLimit,
        //             };

        //             if (this.planDetails.hits === 0 && this.planDetails.priceperhit === 0) {
        //                 reqPayload['hits'] == 0;
        //                 reqPayload['priceperhit'] == 0;
        //             } else if (this.planDetails.hits != 0) {
        //                 reqPayload['hits'] == this.planDetails.hits;
        //                 reqPayload['priceperhit'] == this.planDetails.priceperhit;
        //             }
        //             reqPayload['api_access_token'] = Math.floor(Math.random() * 1000000000) + 1;
        //             if (obj['company_number']) reqPayload['company_number'] = obj['company_number'];
        //             if (obj['company_name']) reqPayload['company_name'] = obj['company_name'];
        //             if (obj['company_address']) reqPayload['company_address'] = obj['company_address'];
        //             if (obj['company_address_object']) reqPayload['company_address_object'] = obj['company_address_object'];

        //             this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_USER_API', 'socialRegistration', reqPayload ).subscribe( socialRegisterRes => {
                
        //                 if (socialRegisterRes.body.status === 200) {
        //                     if (this.planDetails.planCost === 0) {
        //                         let obj = {
        //                             userid: socialRegisterRes.body["results"]["_id"],
        //                             plan: socialRegisterRes.body["results"]["plan"],
        //                             description: "This is Free Test Plan"
        //                         };
        //                         this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_PAYMENT', 'freeSubscription', obj ).subscribe(r => {
        //                             if (r.status === 200) {
        //                                 this.sharedLoaderService.showLoader();
        //                                 let reqobj = {
        //                                     email: res.email 
        //                                 }
        //                                 this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LOGIN', 'LoginWithSocialMedia', reqobj ).subscribe(
        //                                     {
        //                                         next: async ( socialLoginRes ) => {
        //                                             if (socialLoginRes['body']['status'] === 200) {
        //                                                 this.sharedLoaderService.hideLoader();
        //                                                 if (isPlatformBrowser(this.platformId)) {
        //                                                     let obj1 = socialLoginRes['body']['result'];
        //                                                     let token = socialLoginRes['body']['token'];
        //                                                     const xToken = (obj1['plan'] + ':' + obj1['_id']);
        //                                                     const dw = this._encrypt.set(xToken);
        //                                                     this.authGuardService.store(token, dw);
        //                                                     this.userId = obj1["_id"];
        //                                                     let firstLogin = obj1["firstlogin"];
        //                                                     localStorage.setItem("dbID", obj1["_id"]);
        //                                                     localStorage.setItem("email", data.results.email);
        //                                                     localStorage.setItem("planId", data.results["plan"]);
        //                                                     localStorage.setItem("isAdmin", data.results["IsAdmin"]);
        //                                                     localStorage.setItem("username", data.results["username"]);
        //                                                     if (localStorage.getItem("isAdmin") !== undefined && localStorage.getItem("isAdmin") !== '1') {
        
        //                                                         // this.updateUserDataToEngagebayAfterPlanUpgrade();
        //                                                     }
        
        //                                                     // Check If User Subscription is Active
        //                                                     setTimeout(() => {
        //                                                         let resobj = [ this.userId ];
        //                                                         this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_SUBSCRIPTION', 'allSubscriptions', resobj ).subscribe(allSubscriptionRes => {
        //                                                             if (allSubscriptionRes.status == 200) {
        //                                                                 let subscriptionDetails: any = allSubscriptionRes.body,
        //                                                                     currentDate: Date = new Date(),
        //                                                                     subscriptionEndDate: Date;
        
        //                                                                 for (let subscriptionObj of subscriptionDetails) {
        //                                                                     if (subscriptionObj.status) {
        //                                                                         subscriptionEndDate = new Date(subscriptionObj.endDate);
        //                                                                     }
        //                                                                 }
        
        //                                                                 this.userRoleAndFeatureAuthService.userAuthorizationDetails.isSubscriptionActive = (currentDate < subscriptionEndDate);
        
        //                                                                 localStorage.setItem('isSubscriptionActive', JSON.stringify(this.userRoleAndFeatureAuthService.userAuthorizationDetails.isSubscriptionActive));
        
        //                                                             }
        //                                                         });
        
        //                                                     }, 100);
        
        //                                                     // End Check If User Subscription is Active
        //                                                     let tempString = "sociallogin";
        //                                                     localStorage.setItem("loginCheck", tempString);
    
        //                                                     let obj = {
        //                                                         email: res.email
        //                                                     }
    
        //                                                     //Reset password link send
        //                                                     this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_USER_API', 'sendForgotPasswordLink', obj ).subscribe();
        //                                                     //Reset password link send
    
        //                                                     this.router.navigate(['/']);
    
        //                                                     setTimeout(() => {
        //                                                         this.showLoginModal.emit(this.authGuardService.isLoggedin());
        //                                                     }, 100);
        //                                                 }
        //                                             } else if (data.status === 204) {
        //                                                 this.sharedLoaderService.hideLoader();
        //                                                 this.msgs = [];
        //                                                 this.msgs.push({ severity: 'error', summary: 'Email could not be found!' });
        //                                                 setTimeout(() => {
        //                                                     this.msgs = [];
        //                                                 }, 6000);
        //                                             }
        //                                         },
        //                                         error: ( err ) => {
        //                                             this.msgs = [];
        //                                             this.msgs.push({ severity: 'error', summary: '"Wrong Email Or Password"' });
        //                                                 this.sharedLoaderService.hideLoader();
        //                                             setTimeout(() => {
        //                                                 this.msgs = [];
        //                                             }, 6000);
        //                                             this.sharedLoaderService.hideLoader();
        //                                         }
        //                                     }
        //                                 );
        //                             }

        //                             this.sharedLoaderService.hideLoader();

        //                         });
        //                     }
        //                 }
        //                 if (socialRegisterRes.body.status === 201) {
        //                     this.sharedLoaderService.showLoader();
        //                     let obj = {
        //                         email: res.email
        //                     }

        //                     if ( from == 'formComfirmation' ) {
        //                         obj['isAllLogout'] = true;
        //                     }

        //                     this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LOGIN', 'LoginWithSocialMedia', obj ).subscribe(
        //                         {

        //                             next: async ( socialLoginRes ) => {
        //                                 if (socialLoginRes['body']['status'] === 200) {
        //                                     this.sharedLoaderService.hideLoader();
        //                                 if (isPlatformBrowser(this.platformId)) {
        //                                     let obj1 = socialLoginRes['body']['result'];
    
        //                                     let token = socialLoginRes['body']['token'];
        //                                     const xToken = (obj1['plan'] + ':' + obj1['_id']);
        //                                     const dw = this._encrypt.set(xToken);
        //                                     this.authGuardService.store(token, dw);
        //                                     this.userId = obj1["_id"];
        //                                     let firstLogin = obj1["firstlogin"];
        //                                     localStorage.setItem("dbID", obj1["_id"]);
        //                                     localStorage.setItem("email", res.email);
        //                                     localStorage.setItem("planId", obj1["plan"]);
        //                                     localStorage.setItem("isAdmin", obj1["IsAdmin"]);
        //                                     localStorage.setItem("username", obj1["username"]);
        //                                     if (localStorage.getItem("isAdmin") !== undefined && localStorage.getItem("isAdmin") !== '1') {
    
        //                                         // this.updateUserDataToEngagebayAfterPlanUpgrade();
        //                                     }
    
        //                                     // Check If User Subscription is Active
    
        //                                     setTimeout(() => {
        //                                         let reqobj = [ this.userId ];
        //                                         this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_SUBSCRIPTION', 'allSubscriptions', reqobj ).subscribe(subscribtionRes => {
        //                                             if (subscribtionRes.status == 200) {
        //                                                 let subscriptionDetails: any = subscribtionRes.body,
        //                                                     currentDate: Date = new Date(),
        //                                                     subscriptionEndDate: Date;
    
        //                                                 for (let subscriptionObj of subscriptionDetails) {
        //                                                     if (subscriptionObj.status) {
        //                                                         subscriptionEndDate = new Date(subscriptionObj.endDate);
        //                                                     }
        //                                                 }
    
        //                                                 this.userRoleAndFeatureAuthService.userAuthorizationDetails.isSubscriptionActive = (currentDate < subscriptionEndDate);
    
        //                                                 localStorage.setItem('isSubscriptionActive', JSON.stringify(this.userRoleAndFeatureAuthService.userAuthorizationDetails.isSubscriptionActive));
    
        //                                             }
        //                                         });
    
        //                                     }, 100);
    
        //                                     // End Check If User Subscription is Active
                                            
        //                                     this.router.navigate(['/']);

        //                                     let message = data.message;
        //                                     if (message === 'Email Already Exists') {
                                                
        //                                     }
        //                                     else {
        //                                         let tempString = "sociallogin";
        //                                         localStorage.setItem("loginCheck", tempString);

        //                                         let _reqObj = {
        //                                             email: res.email
        //                                         }

        //                                         //Reset password link send
        //                                         this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_USER_API', 'sendForgotPasswordLink', _reqObj ).subscribe();
        //                                         //Reset password link send
        //                                     }

        //                                     setTimeout(() => {
        //                                         this.showLoginModal.emit(this.authGuardService.isLoggedin());
        //                                     }, 100);
        //                                 }
        //                             } else if ( socialLoginRes['body']['status'] === 498 ) {
        //                                 this.loginConfirmation = true;
        //                                 this.loginType = socialPlatform
        //                             } 
        //                             else if (data.status === 204) {
        //                                     this.sharedLoaderService.hideLoader();
        //                                 this.msgs = [];
        //                                 this.msgs.push({ severity: 'error', summary: 'Email could not be found!' });
        //                                 setTimeout(() => {
        //                                     this.msgs = [];
        //                                 }, 6000);
        //                             }
        //                             },
        //                             error: ( err ) => {
        //                                 this.msgs = [];
        //                                 this.msgs.push({ severity: 'error', summary: '"Wrong Email Or Password"' });
        //                                     this.sharedLoaderService.hideLoader();
        //                                 setTimeout(() => {
        //                                     this.msgs = [];
        //                                 }, 6000);
        //                                 // this.showLoader = false;
        //                                 this.sharedLoaderService.hideLoader();
    
        //                             }
                                    
        //                         }
        //                     );

        //                     this.sharedLoaderService.hideLoader();

        //                 }
        //             });
        //         }
        //     }); 
        
        // }).catch(err => err)

    }

	signOut() {
        this.socialAuthService.signOut();
    }

	getPlanDetails( planId: any ) {

        this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe(res => {
            let data = res;

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

            }

        });

    }

	linkedInLogIn() {

        if ( window.location.pathname == '/' ) {
            this.router.navigate(['/authentication/login']);
            linkedInCredentials['redirectUrl'] = window.location.origin + '/authentication/login';
        } else {
            linkedInCredentials['redirectUrl'] = window.location.href;
        }
        
        let clientId = environment.server == 'https://main.datagardener.com' ? linkedInCredentials.productionClientId : environment.server == 'https://preprodapi.datagardener.com' ? linkedInCredentials.preprodClientId : environment.server == 'https://devapi.datagardener.com' ? linkedInCredentials.devClientId : linkedInCredentials.localClientId;

        window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${ clientId }&scope=${ linkedInCredentials.scope }&state=123456&redirect_uri=${ linkedInCredentials['redirectUrl'] }`;
        
    }

	getLinkedInAccessToken( linkedInCode, from? ) {

        this.sharedLoaderService.showLoader();
        let obj = {};

        if ( typeof linkedInCode == 'object' ) {
            linkedInCode = linkedInCode[1];
        }

        if ( from == 'formComfirmation' ) {
            obj['access_token'] = this.access_token;
            obj['isAllLogout'] = true;
        } else {
            obj['code'] = linkedInCode,
            obj['redirectURI'] = window.location.origin + window.location.pathname
        }

        this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_USER_API', 'linkedInAuth', obj ).subscribe(res => {

            this.linkedInData = res.body;
            
            if ( this.linkedInData.success == true ) {

                if ( !this.linkedInData.isMember ) {

                    this.linkedinFirstName = this.linkedInData['result']['profileResponse']['localizedFirstName'];
                    this.linkedinlastNameName = this.linkedInData['result']['profileResponse']['localizedLastName'];
                    this.linkedInUserEmail = this.linkedInData['result']['emailResponse']['elements'][0]['handle~']['emailAddress'];

                    let obj = {
                        first_name: this.linkedinFirstName,
                        last_name: this.linkedinlastNameName,
                        referredData: "",
                        refered_by: "",
                        other: "",
                        password: "",
                        phoneNumber: "",
                        email: this.linkedInUserEmail,
                        postal_code: "",
                        isEmailVerified: true
                    }
                    
                    this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_PLANS', 'planDetail' ).subscribe(planData => {
                        let data = planData.body;
                        let isEmailVerified = false;
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

                            if (obj.isEmailVerified) {
                                isEmailVerified = true;
                            }
        
                            let reqPayload = {
                                first_name: obj.first_name,
                                last_name: obj.last_name,
                                referredData: obj.referredData,
                                refered_by: obj.refered_by,
                                phoneNumber: obj.phoneNumber,
                                other: obj.other,
                                email: obj.email,
                                Pages: [1, 2, 12, 4, 5, 6, 7, 8, 9],
                                postalCode: obj.postal_code,
                                plan: this.planDetails.planId,
                                companyReport: this.planDetails.companyReport,
                                basicLimit: this.planDetails.basicLimit,
                                advancedLimit: this.planDetails.advancedLimit,
                                landLimit: this.planDetails.landLimit,
                                corpLandLimit: this.planDetails.corpLandLimit,
                                chargesLimit: this.planDetails.chargesLimit,
                                isEmailVerified: isEmailVerified,
                                directorReportLimit: this.planDetails.directorReportLimit,
                            };
        
                            if (this.planDetails.hits === 0 && this.planDetails.priceperhit === 0) {
                                reqPayload['hits'] == 0;
                                reqPayload['priceperhit'] == 0;
                            } else if (this.planDetails.hits != 0) {
                                reqPayload['hits'] == this.planDetails.hits;
                                reqPayload['priceperhit'] == this.planDetails.priceperhit;
                            }
                            reqPayload['api_access_token'] = Math.floor(Math.random() * 1000000000) + 1;
                            if (obj['company_number']) reqPayload['company_number'] = obj['company_number'];
                            if (obj['company_name']) reqPayload['company_name'] = obj['company_name'];
                            if (obj['company_address']) reqPayload['company_address'] = obj['company_address'];
                            if (obj['company_address_object']) reqPayload['company_address_object'] = obj['company_address_object'];

                            this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_USER_API', 'socialRegistration', reqPayload ).subscribe( socialRegisterRes => {                        
                                if (socialRegisterRes.body.status === 200) {
                                    if (this.planDetails.planCost === 0) {
                                        let obj = {
                                            userid: socialRegisterRes.body["results"]["_id"],
                                            plan: socialRegisterRes.body["results"]["plan"],
                                            description: "This is Free Test Plan"
                                        };
                                        this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_PAYMENT', 'freeSubscription', obj ).subscribe(r => {
                                            if (r.body.status === 200) {
                                                this.sharedLoaderService.showLoader();
                                                let reqobj ={
                                                    email: socialRegisterRes.body.results.email
                                                }
                                                this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LOGIN', 'LoginWithSocialMedia', reqobj ).subscribe(
                                                    {
                                                        next: async ( socialLoginRes ) => {
                                                            if (socialLoginRes['body']['status'] === 200) {
                                                                this.sharedLoaderService.hideLoader();
                                                                if (isPlatformBrowser(this.platformId)) {
                                                                    let obj1 = socialLoginRes['body']['result'];
                                                                    let token = socialLoginRes['body']['token'];
                                                                    const xToken = (obj1['plan'] + ':' + obj1['_id']);
                                                                    const dw = this._encrypt.set(xToken);
                                                                    // this.authGuardService.store(token, dw);
                                                                    this.userId = obj1["_id"];
                                                                    let firstLogin = obj1["firstlogin"];
                                                                    localStorage.setItem("dbID", obj1["_id"]);
                                                                    localStorage.setItem("email", data.results.email);
                                                                    localStorage.setItem("planId", data.results["plan"]);
                                                                    localStorage.setItem("isAdmin", data.results["IsAdmin"]);
                                                                    localStorage.setItem("username", data.results["username"]);
                                                                    if (localStorage.getItem("isAdmin") !== undefined && localStorage.getItem("isAdmin") !== '1') {
                
                                                                        // this.updateUserDataToEngagebayAfterPlanUpgrade();
                                                                    }

                                                                    await this.userAuthService.updateLoginStatus( true );

                                                                    if ( this.selectedGlobalCountry?.countryCode ) {
                                                                        localStorage.setItem( 'selectedGlobalCountry', this.selectedGlobalCountry?.countryCode );
                                                                    }
                
                                                                    // Check If User Subscription is Active
                                                                    setTimeout(() => {
                                                                        let reqobj = [ this.userId ];
                                                                        this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_SUBSCRIPTION', 'allSubscriptions', reqobj ).subscribe(allSubscriptionRes => {
                                                                            if (allSubscriptionRes.status == 200) {
                                                                                let subscriptionDetails: any = allSubscriptionRes.body,
                                                                                    currentDate: Date = new Date(),
                                                                                    subscriptionEndDate: Date;
                
                                                                                for (let subscriptionObj of subscriptionDetails) {
                                                                                    if (subscriptionObj.status) {
                                                                                        subscriptionEndDate = new Date(subscriptionObj.endDate);
                                                                                    }
                                                                                }
                
                                                                                this.userAuthService.updateUserAuthInfo( { isSubscriptionActive: ( currentDate < subscriptionEndDate ) } );
                
                                                                                localStorage.setItem( 'isSubscriptionActive', JSON.stringify( this.userAuthService?.getUserInfo()?.isSubscriptionActive ) );
                
                                                                            }
                                                                        });
                
                                                                    }, 100);
                
                                                                    // End Check If User Subscription is Active
                                                                    let tempString = "sociallogin";
                                                                    localStorage.setItem("loginCheck", tempString);
    
                                                                    let _reqObj = {
                                                                        email: this.linkedInUserEmail
                                                                    }
        
                                                                    //Reset password link send
                                                                    this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_USER_API', 'sendForgotPasswordLink', _reqObj ).subscribe();
                                                                    //Reset password link send
        
                                                                    // if (firstLogin === true) {
                                                                    //     this.router.navigate(['/authentication/user-account-preferences']);
                                                                    // } else {
                                                                        this.router.navigate(['/']);
                                                                    // }
                                                                    setTimeout(() => {
                                                                        this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => {
                                                                            this.showLoginModal.emit( loggedIn );
                                                                        });
                                                                    }, 100);
                                                                }
                                                            } else if (data.status === 204) {
                                                                this.sharedLoaderService.hideLoader();
                                                                this.msgs = [];
                                                                this.msgs.push({ severity: 'error', summary: 'Email could not be found!' });
                                                                setTimeout(() => {
                                                                    this.msgs = [];
                                                                }, 6000);
                                                            }
                                                        },
                                                        error: ( err ) => {
                                                            this.msgs = [];
                                                            this.msgs.push({ severity: 'error', summary: '"Wrong Email Or Password"' });
                                                            setTimeout(() => {
                                                                this.msgs = [];
                                                            }, 6000);
                                                            this.sharedLoaderService.hideLoader();        
                                                        }
                                                    }
                                                );
                                            }
                                        });
                                    }
                                }
                                if (socialRegisterRes.body.status === 201) {
                                    this.sharedLoaderService.showLoader();
                                    let obj = {
                                        email: socialRegisterRes.body.results.email 
                                    }
                                    this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LOGIN', 'LoginWithSocialMedia', obj ).subscribe(
                                        {
                                            next: async ( socialLoginRes ) => {
                                                if (socialLoginRes['body']['status'] === 200) {
                                                    this.sharedLoaderService.hideLoader();
                                                    if (isPlatformBrowser(this.platformId)) {
                                                        let obj1 = socialLoginRes['body']['result'];
                
                                                        let token = socialLoginRes['body']['token'];
                                                        const xToken = (obj1['plan'] + ':' + obj1['_id']);
                                                        const dw = this._encrypt.set(xToken);
                                                        // this.authGuardService.store(token, dw);
                                                        this.userId = obj1["_id"];
                                                        let firstLogin = obj1["firstlogin"];
                                                        localStorage.setItem("dbID", obj1["_id"]);
                                                        localStorage.setItem("email", res.email);
                                                        localStorage.setItem("planId", obj1["plan"]);
                                                        localStorage.setItem("isAdmin", obj1["IsAdmin"]);
                                                        localStorage.setItem("username", obj1["username"]);
                                                        if (localStorage.getItem("isAdmin") !== undefined && localStorage.getItem("isAdmin") !== '1') {
                
                                                            // this.updateUserDataToEngagebayAfterPlanUpgrade();
                                                        }

                                                        await this.userAuthService.updateLoginStatus( true );

                                                        if ( this.selectedGlobalCountry?.countryCode ) {
                                                            localStorage.setItem( 'selectedGlobalCountry', this.selectedGlobalCountry?.countryCode );
                                                        }
                
                                                        // Check If User Subscription is Active
                
                                                        setTimeout(() => {
                                                            let reqobj = [ this.userId ];
                                                            this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_SUBSCRIPTION', 'allSubscriptions', reqobj ).subscribe(res => {
                                                                if (res.status == 200) {
                                                                    let subscriptionDetails: any = res.body,
                                                                        currentDate: Date = new Date(),
                                                                        subscriptionEndDate: Date;
                
                                                                    for (let subscriptionObj of subscriptionDetails) {
                                                                        if (subscriptionObj.status) {
                                                                            subscriptionEndDate = new Date(subscriptionObj.endDate);
                                                                        }
                                                                    }
                
                                                                    this.userAuthService.updateUserAuthInfo( { isSubscriptionActive: ( currentDate < subscriptionEndDate ) } );
                
                                                                    localStorage.setItem( 'isSubscriptionActive', JSON.stringify( this.userAuthService?.getUserInfo()?.isSubscriptionActive ) );
                
                                                                }
                                                            });
                
                                                        }, 100);
                
                                                        // End Check If User Subscription is Active
                                                        // if (firstLogin === true) {
                                                        //     this.router.navigate(['/authentication/user-account-preferences']);
                                                        // } else {
                                                            this.router.navigate(['/']);
                                                        // }
        
                                                        let message = data.message;
                                                        if (message === 'Email Already Exists') {
                                                            
                                                        }
                                                        else {
                                                            let tempString = "sociallogin";
                                                            localStorage.setItem("loginCheck", tempString);
        
                                                            //Reset password link send
                                                            let obj = {
                                                                email: res.email
                                                            };
                                                            this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_USER_API', 'sendForgotPasswordLink', obj ).subscribe();
                                                            //Reset password link send
                                                        }
        
                                                        setTimeout(() => {
                                                            this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => {
                                                                this.showLoginModal.emit( loggedIn );
                                                            });
                                                        }, 100);
                                                    }
                                                } else if (data.status === 204) {
                                                    this.sharedLoaderService.hideLoader();
                                                    this.msgs = [];
                                                    this.msgs.push({ severity: 'error', summary: 'Email could not be found!' });
                                                    setTimeout(() => {
                                                        this.msgs = [];
                                                    }, 6000);
                                                }
                                            },
                                            error: ( err ) => {
                                                this.msgs = [];
                                                this.msgs.push({ severity: 'error', summary: '"Wrong Email Or Password"' });
                                                setTimeout(() => {
                                                    this.msgs = [];
                                                }, 6000);
                                                this.sharedLoaderService.hideLoader();
                                            }
                                        }
                                    );
                                    this.sharedLoaderService.hideLoader();
                                }
                            });
                        }
                    });

                }  else {
                    if (this.linkedInData['status'] === 401) {
    
                        this.msgs = [];
                        this.msgs.push({ severity: 'error', summary: this.linkedInData['msg'] });
                        
                        setTimeout(() => {
                            this.msgs = [];
                        }, 6000);
    
                        if ( this._activatedRoute.snapshot.queryParams['code'] ) {
                    
                            this.location.replaceState('/authentication/login');
                            this._activatedRoute.snapshot.queryParams = {}
            
                        }
    
                    } else if ( this.linkedInData['status'] == 498 ) {
    
                        this.loginConfirmation = true;
                        this.loginType = 'linkedIn';
                        this.access_token = this.linkedInData.access_token;
    
                    } else {
    
                        if (isPlatformBrowser(this.platformId)) {
    
                            let obj = this.linkedInData['result'];
        
                            let token = this.linkedInData['token'];
                            const xToken = (obj['plan'] + ':' + obj['_id']);
                            const dw = this._encrypt.set(xToken);
        
                            // this.authGuardService.store(token, dw);
                            localStorage.setItem("dgExtensionDialog", 'login');
                            this.userId = obj["_id"];
        
                            this.router.navigate(['/']);
        
                            setTimeout(() => {
        
                                if ( !this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
                                    // this.updateUserDataToSalesforce();
                                    this.updateUserDataToHubspot(this.linkedInUserEmail);
                                }
        
                            }, 1000);
        
                            setTimeout(() => {
                                this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => {
                                    this.showLoginModal.emit( loggedIn );
                                });
                            }, 100);
        
                        }
    
                    }

                }


            } else {

                if ( this.linkedInData['message'] == 'Unable to retrieve access token: appid/redirect uri/code verifier does not match authorization code.' ) {

                    if ( this._activatedRoute.snapshot.queryParams['code'] ) {
				
                        this.location.replaceState('/authentication/login');
                        this._activatedRoute.snapshot.queryParams = {}
        
                    }

                }
            }
			this.sharedLoaderService.hideLoader();
			
		});

	}

}
