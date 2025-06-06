import { Component, OnInit } from "@angular/core";
import CustomUtils from "../interface/custom-pipes/custom-utils/custom-utils.utils";
import { ServerCommunicationService } from "../interface/service/server-communication.service";

@Component({
	selector: 'dg-confirmation',
	templateUrl: './app.confirmation.component.html',
	styleUrls: ['./no-auth-pages.component.scss']
})

export class ConfirmationComponent implements OnInit {
	confirmationHeading: string = "Loading...";
	verificationText: string = undefined;
	queryString = window.location.search;
	engagebayCompanyId: any;

	constructor(
		private globalServiceCommnunicate: ServerCommunicationService
	) {
	}

	ngOnInit() {
		const urlParams = new URLSearchParams(this.queryString);
		if (!CustomUtils.isNullOrUndefined(urlParams.get('token'))) {
			let token = urlParams.get('token');
			this.validateEmail(token);
		}

	}

	validateEmail(token) {
		let reqObj = [ token ];
		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_LOGIN', 'verifyEmail', reqObj ).subscribe( res => {
				if (res.body.status === 200) {
					this.confirmationHeading = "Verified";
					this.verificationText =
						"Email verified successfully. Please login to avail benefits of DataGardener.";
					let userData = res.body['results'];

					if (!userData['username'].includes("Dgtest") && !userData['username'].includes("dg") && !userData['username'].includes("Dg") && !userData['username'].includes("dG") && !userData['username'].includes("DG")) {

						//this.uploadDataEngagebay(userData['email']);// this method is added for uploading the data to engagebay platform 
					}
				}
				if (res.body.status === 201) {
					this.confirmationHeading = "Expired";
					this.verificationText =
						"This link either does not exist or has expired.";
				}
			},
			error => {
				console.log(error);
			}
		);
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
}