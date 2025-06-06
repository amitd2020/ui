import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { CanonicalURLService } from "../interface/service/canonical-url.service";
import { ServerCommunicationService } from "../interface/service/server-communication.service";
import { SharedLoaderService } from "../interface/view/shared-components/shared-loader/shared-loader.service";

@Component({
    selector: 'dg-forgotPassword',
    templateUrl: './app.forgotPassword.component.html',
    styleUrls: [ './no-auth-pages.component.scss' ]
})

export class ForgotPasswordComponent implements OnInit{
    
    mailSent: boolean = false;
    message: string = '';
    msgs: object[];
    status: number = undefined;
    
    constructor ( 
        private canonicalService: CanonicalURLService,
        private sharedLoaderService: SharedLoaderService,
        private globalServiceCommnunicate: ServerCommunicationService

    ) { }

    ngOnInit () {
        this.canonicalService.setCanonicalURL();
    }

    sendResetPasswordLink (formData: NgForm) {
        this.sharedLoaderService.showLoader();
        let obj = {
            email: formData.value.email.toLowerCase()
        };

        this.globalServiceCommnunicate.globalServerRequestCall('post', 'DG_USER_API', 'sendForgotPasswordLink', obj).subscribe(
            {
                next: (res) => {
                    if (res.body.status === 200) {
                        this.status = 200;
                        this.sharedLoaderService.hideLoader();
                        this.mailSent = true;
                        this.message = "Email Link Sent"
                    }
                },
                error: (err) => {
                    this.status = 400
                    this.sharedLoaderService.hideLoader();
                    this.mailSent = false;
                    if (err.status == 400) {
                        this.msgs = [];
                        this.msgs.push({ severity: 'error', summary: err.error.message });
                        setTimeout(() => {
                            this.msgs = [];
                        }, 3000);
                        // this.message = err.error.message;
                    } else {
                        this.msgs = [];
                        this.msgs.push({ severity: 'error', summary: "Some Error Was Occured !" });
                        setTimeout(() => {
                            this.msgs = [];
                        }, 3000);
                        // this.message = "Some Error Was Occured !"
                    }
                }

            }
        );
    }

   
}