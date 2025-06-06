import { Component } from '@angular/core';
import { ForgotPasswordService } from './forgot-password.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'dg-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [ForgotPasswordService]
})
export class ForgotPasswordComponent {

  mailSent: boolean = false;
  message: string = '';
  status: number = undefined;

  constructor( public forgotPasswordService: ForgotPasswordService ) {  }

  sendResetPasswordLink(formData: NgForm) {

    let emailObj = {
      email: formData.value.email
    };

    this.forgotPasswordService.setForgotPasswordCredentials(emailObj).subscribe(
		{
			next: (res) => {
				if (res.status === 200) {
					this.status = 200;
					this.mailSent = true;
					this.message = "Email Link Sent"
				}
			},
			error: (err) => {
				this.status = 400
				this.mailSent = false;
				if (err.status == 400) {
					this.message = err.error.message;
				} else {
					this.message = "Some Error Was Occured !"
				}
			}

		}
	);
    
  }

}
