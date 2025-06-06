import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import CustomUtils from "../interface/custom-pipes/custom-utils/custom-utils.utils";
import { ServerCommunicationService } from "../interface/service/server-communication.service";

@Component({
    selector: 'dg-reset',
    templateUrl: './app.passwordReset.component.html',
    styleUrls: ['./no-auth-pages.component.scss']
  })

  export class PasswordResetComponent implements OnInit {

	isTokenValidate: boolean;
	email: any;
	passwordsMisMatch: boolean;
	passwordReset: boolean = false;
	message: string = ""
	response: number = undefined;
	tokenStatus: number = undefined;
	hide = true;
	hide2 = true;
	msgs = [];
	queryString = window.location.search;
  
	
	constructor(
		private router: Router,
		private globalServiceCommnunicate: ServerCommunicationService
	) { }
  
	ngOnInit() {
		const urlParams = new URLSearchParams(this.queryString); 
			if(!CustomUtils.isNullOrUndefined(urlParams.get('token'))) {
			let token = urlParams.get('token');
			this.validatedToken(token);
		} 
	}
  
	validatedToken(token) {
		if (token) {
			let reqObj = [ token];
			this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_USER_API', 'checkPageStatus', reqObj ).subscribe( res => {
				let data = res.body;
				if (data.status != undefined){
					this.tokenStatus = data.status;
				}
				if (data.status === 200) {
					this.isTokenValidate = true;
					this.email = data["userEmail"];
				}
				if (data.status === 201){
					
				}
			});
		}
	}
  
	resetPassword(formData: NgForm) {
  
		if (formData.value.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,}$/) || formData.value.confirm_password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,}$/)) {
		if (formData.value.password && formData.value.password !== formData.value.confirm_password) {
			this.passwordsMisMatch = false;
			this.msgs = [];
			this.msgs.push( { severity: 'error', summary: 'Password and Confirm Password does not match ',} );
					setTimeout(() => {
						this.msgs = [];
					}, 3000);
			
		} else if (this.isTokenValidate && formData.value.password === formData.value.confirm_password) {
			this.passwordsMisMatch = true;
  
			let obj = {
				email: this.email,
				password: formData.value.password
			};
			this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_USER_API', 'changePassword', obj ).subscribe( res => {
				if (res.body.status === 200) {
					this.passwordReset  = true;
					this.response = 200;
					this.message = "You have successfully reset the password for your DataGardener account."
					setTimeout(() => {
						this.router.navigate(["/authentication/login"]);                        
					}, 5500); 
				}
			}, error =>{
				this.passwordReset  = false;
				this.message = "Could Not Reset Password"
				this.response = 400;
			});
		}
		} else {
			this.msgs = [];
				this.msgs.push( { severity: 'error', summary: 'Password and Confirm Password must have a minimum of 8 characters with atleast one number,one small letter and one capital letter' } );
				setTimeout(() => {
					this.msgs = [];
				}, 9000);
		}
	}
  }