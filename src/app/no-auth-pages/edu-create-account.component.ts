import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGuardService } from '../interface/auth-guard/auth-guard.guard';
import { SeoService } from '../interface/service/seo.service';
import { ServerCommunicationService } from '../interface/service/server-communication.service';
import { SharedLoaderService } from '../interface/view/shared-components/shared-loader/shared-loader.service';

@Component({
	selector: 'dg-edu-create-account',
	templateUrl: './edu-create-account.component.html',
	styleUrls: ['./no-auth-pages.component.scss']
})
export class EduCreateAccountComponent implements OnInit {

	@ViewChild('eduSignUpForm', { static: false }) signUpForm: NgForm;

	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = 'index, follow'; // 'index, follow, noindex, nofollow'

	// planId: string = '60583a9b7059320ed84d181d';

	fieldValidate: boolean = false;

	msgs = [];
	emailValue = '';

	signUpData: any = {
		first_name: undefined,
		last_name: undefined,
		email: undefined
	};

	constructor(
		private router: Router,
        public authGuardService: AuthGuardService,
		private activatedRouter: ActivatedRoute,
		private seoService: SeoService,
		private globalServiceCommnunicate: ServerCommunicationService,
		private sharedLoaderService: SharedLoaderService
	) {
		/*
			Do not enable the below code before discussing with Akmal.
			It reloads the `AppMainComponent`, which is the main
			layout container and parent for all of the Components/Modules.
			===============================================================
			this.router.routeReuseStrategy.shouldReuseRoute = () => false;
			===============================================================
		*/
		
		// Navigate To Dashboard When User is Logged In And Accessing Sign Up Page From Any Plan
		if ( this.authGuardService.isLoggedin() && (this.activatedRouter.snapshot.url.length && this.activatedRouter.snapshot.url[0].path == 'createAccount') )
		{
			setTimeout(() => {
				this.router.navigate(['/']);
			}, 0);
		}
		// Navigate To Dashboard When User is Logged In And Accessing Sign Up Page From Any Plan

		// if ( !( this.activatedRouter.snapshot.queryParams && this.activatedRouter.snapshot.queryParams.hasOwnProperty( 'planId' ) ) ) {

		// 	setTimeout(() => {
		// 		this.router.navigate(['/404']);
		// 	}, 0);

		// } else {

		// 	this.planId = this.activatedRouter.snapshot.queryParams.planId;

		// }

		this.title = 'SignUp to Access Companies and Directors Data | DataGardener';
		this.description = 'Sign Up as an Individual and access the business information from the UK company database.';

		this.seoService.setPageTitle(this.title);
		this.seoService.setMetaTitle(this.title);
		this.seoService.setDescription(this.description);
		this.seoService.setRobots(this.robots);
	}

	ngOnInit() {
	}

	eduSignUpUserFormSubmission( formData: NgForm ) {
		if ( this.validateForm( formData.value ) ) {

			this.sharedLoaderService.showLoader();
			let reqPayload = {
				email: this.signUpData.email,
				firstName: this.signUpData.first_name,
				lastName: this.signUpData.last_name,
				// planId: this.planId
			}

			this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LOGIN', 'signup', reqPayload ).subscribe(
				{
					next: ( res ) => {
						
						const data = res.body;

						if ( data.status == 200 ) {

							this.sharedLoaderService.hideLoader();

							this.msgs = [];
							this.msgs.push({ severity: 'success', summary: "Sign Up successfully!!" });

							setTimeout(() => {
								this.msgs = [];
							}, 2000);

							setTimeout(() => {
								this.router.navigate(['authentication/freeSubscription']);
							}, 1000);


						} else {
							this.msgs = [];

							this.msgs.push({ severity: 'error', summary: "Something went wrong!!" });

							setTimeout(() => {
								this.msgs = [];
							}, 2000);

						}

					},
					error: ( err ) => {

						this.msgs = [];
						this.msgs.push({ severity: 'error', summary: err.error.message });

						setTimeout(() => {
							this.msgs = [];
						}, 3000);

					}
				}
			)

		} else {	
			this.fieldValidate = true;
		}


	}

	validateForm( formData ) {

		this.signUpData.first_name = formData.first_name;
		this.signUpData.last_name = formData.last_name;
		this.signUpData.email = formData.email;

		if ( this.signUpData.first_name && this.signUpData.last_name && this.signUpData.email ) {

			return true;

		}

		return false;

	}

}
