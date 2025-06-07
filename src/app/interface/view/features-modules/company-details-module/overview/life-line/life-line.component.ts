import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { CompaniesEligibleForDataWithoutLogin, subscribedPlan } from 'src/environments/environment';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';
import { take } from 'rxjs';

@Component({
	selector: 'dg-life-line',
	templateUrl: './life-line.component.html',
	styleUrls: ['./life-line.component.scss']
})
export class LifeLineComponent implements OnInit {

	userDetails: Partial< UserInfoType > = {};
	companyDocuments: any;

	companyNumber: any;
	companyDocumentsLifeLine: { status: string; date: string; icon: string; color: string; description: string; }[];

	companiesEligibleForDataWithoutLogin = CompaniesEligibleForDataWithoutLogin;

	subscribedPlanModal: any = subscribedPlan;

	showUpgradePlanDialog: boolean = false;

	constructor(
		public userAuthService: UserAuthService,
		private dataCommunicatorService: DataCommunicatorService,
		private titleCasePipe: TitleCasePipe,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit() {

		this.sharedLoaderService.showLoader();
		
		this.userDetails = this.userAuthService?.getUserInfo();

		this.dataCommunicatorService.$dataCommunicatorVar.pipe( take(1) ).subscribe( ( res: any ) => {
			this.companyNumber = res.companyRegistrationNumber;
		});
		
		this.getCompanyDocuments( this.companyNumber );

	}

	getCompanyDocuments( compNo ) {

		let reqArr = [ compNo ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_API', 'listOfCompanyDocuments', reqArr ).subscribe( res => {

			if ( res.body['status'] == 200 ) {

				if ( res.body['companyDocuments'].items ) {

					this.companyDocuments = res.body['companyDocuments'];

					for ( let document of this.companyDocuments['items'] ) {

						let downloadLinkObj = { companyNumber: this.companyNumber, description: document.description, metadata: document.links ? document.links["document_metadata"] : "" };
						
						document['downloadLink'] = downloadLinkObj;

						if (document.category === "confirmation-statement") {
							document.color = "#3dd177";
							document.icon = 'playlist_add_check';
						} else if (document.category === "accounts") {
							document.color = "#52a6ff";
							document.icon = "account_balance";
						} else if (document.category === "annual-return") {
							document.color = "#e66ecc";
							document.icon = "assignment";
						} else if (document.category === "officers") {
							document.color = "#ff5e52";
							document.icon = "people_outline";
						} else if (document.category === "incorporation") {
							document.color = "#0277bd";
							document.icon = "today";
						} else if (document.category === "persons-with-significant-control") {
							document.color = "#ff9800";
							document.icon = "people";
						} else if (document.category === "change-of-constitution") {
							document.color = "#2e7d32";
							document.icon = "description";
						} else if (document.category === "address") {
							document.color = "#00695c";
							document.icon = "location_on";
						} else if (document.category === "mortgage") {
							document.color = "#e91e63";
							document.icon = "business_center";
						} else if (document.category === "gazette") {
							document.color = "#92d417";
							document.icon = "insert_drive_file";
						} else if (document.category === "dissolution") {
							document.color = "#f92616";
							document.icon = "delete_forever";
						} else if (document.category === "capital") {
							document.color = "#0cab0f";
							document.icon = "work";
						} else if (document.category === "change-of-name") {
							document.color = "#ff9632";
							document.icon = "edit";
						} else if (document.category === "resolution") {
							document.color = "#c41155";
							document.icon = "folder_special";
						} else {
							document.color = "#92d417";
							document.icon = "folder_open";
						}
						if ((document.category && document.category != undefined) || (document.description && document.description != undefined)) {
							document.category = this.titleCasePipe.transform( document.category.toString().replace( /-/g, " ") );
							document.description = this.titleCasePipe.transform( document.description.toString().replace( /-/g, " ") );
						}

					}

				}

			}

			// this.spinnerBoolean = false;
			this.sharedLoaderService.hideLoader();

		});

	}

	downloadDocumentRequest( description, document_metadata ) {

		let document_name: string = description + this.companyNumber + ".pdf";

		if ( ( ( [ this.subscribedPlanModal['Monthly_Expand'], this.subscribedPlanModal['Expand_Annual_One_Year'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Expand_Annual_Two_Year'], this.subscribedPlanModal['Expand_New_Monthly'], this.subscribedPlanModal['Monthly_Expand_Paid_Test'],this.subscribedPlanModal['Monthly_Expand_Trial'],this.subscribedPlanModal['Expand_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Expand'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Annually_Expand_Trial'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Valentine_Special'], this.subscribedPlanModal['Compliance_Plan'] ].includes( this.userDetails?.planId ) && this.userDetails?.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) ) {

			let obj = {
				metadata: document_metadata + '/content',
				doc_name: document_name
			};

			this.sharedLoaderService.showLoader();

			this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_API', 'getDocument', obj ).subscribe( res => {
					if ( res.status === 200 ) {
						if ( res.body["document_url"] ) {
							let url: string = res.body["document_url"];
							this.downloadDocument( url, document_name );
						}
					}
					// this.spinnerBoolean = false;
					this.sharedLoaderService.hideLoader();
				},
				error => {
					console.log( error );
					this.sharedLoaderService.hideLoader();
				}
			);

		} else {
			event.preventDefault();
			event.stopPropagation();
			this.showUpgradePlanDialog = true;
		}

	}

    downloadDocument(document_url, document_name) {
        var link = document.createElement('a');
        link.href = document_url;
        link.download = document_name;
        link.click();
    }

}
