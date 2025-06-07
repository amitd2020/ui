import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { DataCommunicatorService } from '../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-documents',
	templateUrl: './documents.component.html',
	styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

	documentDataColumn: any[];
	companyDocuments: any;
	companyData: any;
	isLoggedIn: boolean = false;

	constructor(
		public userAuthService: UserAuthService,
		private dataCommunicatorService: DataCommunicatorService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit() {

		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => this.isLoggedIn = loggedIn );
		this.dataCommunicatorService.$dataCommunicatorVar.pipe( take(1) ).subscribe( ( res: any ) => this.companyData = res );

		this.sharedLoaderService.showLoader();

		this.documentDataColumn = [
			{ field: 'description', header: 'Description', minWidth: '300px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'category', header: 'Category', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
			{ field: 'date', header: 'Date', minWidth: '200px', maxWidth: '200px', textAlign: 'center' },
			{ field: 'pages', header: 'Pages', minWidth: '100px', maxWidth: '100px', textAlign: 'right' },
			{ field: 'download', header: 'Option', minWidth: '180px', maxWidth: '180px', textAlign: 'center' }
		];

		let compNo = [ this.companyData?.companyRegistrationNumber ];
		let apiEndPoint = this.isLoggedIn ? 'listOfCompanyDocuments' : 'listOfCompanyDocumentsPublic';

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_API', apiEndPoint, compNo ).subscribe( res => {
			let data = res.body;

			if ( data['status'] == 200 ) {
				if  ( data['companyDocuments'].items ) {
					this.parseDocument(data['companyDocuments']);
				}
			}
				
			this.sharedLoaderService.hideLoader();

		});

	}

	parseDocument(companyDocuments) {

		let download = {};
		let regexp = /-/g;

		for (let i = 0; i < companyDocuments["items"].length; i++) {

			if ( companyDocuments["items"][i].links == undefined ) {

				companyDocuments["items"][i].links = {
					document_metadata: undefined,
					self: undefined
				}
				
			}

			download = { companyNumber: this.companyData?.companyRegistrationNumber, description: companyDocuments["items"][i].description, metadata: companyDocuments["items"][i].links["document_metadata"] };
			companyDocuments["items"][i]['download'] = download;

			if (companyDocuments['items'][i].category === "confirmation-statement") {
				companyDocuments['items'][i].color = "#3dd177";
				companyDocuments['items'][i].icon = 'playlist_add_check';
			} else if (companyDocuments['items'][i].category === "accounts") {
				companyDocuments['items'][i].color = "#52a6ff";
				companyDocuments['items'][i].icon = "account_balance";
			} else if (companyDocuments['items'][i].category === "annual-return") {
				companyDocuments['items'][i].color = "#e66ecc";
				companyDocuments['items'][i].icon = "assignment";
			} else if (companyDocuments['items'][i].category === "officers") {
				companyDocuments['items'][i].color = "#ff5e52";
				companyDocuments['items'][i].icon = "people_outline";
			} else if (companyDocuments['items'][i].category === "incorporation") {
				companyDocuments['items'][i].color = "#0277bd";
				companyDocuments['items'][i].icon = "today";
			} else if (companyDocuments['items'][i].category === "persons-with-significant-control") {
				companyDocuments['items'][i].color = "#ff9800";
				companyDocuments['items'][i].icon = "people";
			} else if (companyDocuments['items'][i].category === "change-of-constitution") {
				companyDocuments['items'][i].color = "#2e7d32";
				companyDocuments['items'][i].icon = "description";
			} else if (companyDocuments['items'][i].category === "address") {
				companyDocuments['items'][i].color = "#00695c";
				companyDocuments['items'][i].icon = "location_on";
			} else if (companyDocuments['items'][i].category === "mortgage") {
				companyDocuments['items'][i].color = "#e91e63";
				companyDocuments['items'][i].icon = "business_center";
			} else if (companyDocuments['items'][i].category === "gazette") {
				companyDocuments['items'][i].color = "#92d417";
				companyDocuments['items'][i].icon = "insert_drive_file";
			} else if (companyDocuments['items'][i].category === "dissolution") {
				companyDocuments['items'][i].color = "#f92616";
				companyDocuments['items'][i].icon = "delete_forever";
			} else if (companyDocuments['items'][i].category === "capital") {
				companyDocuments['items'][i].color = "#0cab0f";
				companyDocuments['items'][i].icon = "work";
			} else if (companyDocuments['items'][i].category === "change-of-name") {
				companyDocuments['items'][i].color = "#ff9632";
				companyDocuments['items'][i].icon = "edit";
			} else if (companyDocuments['items'][i].category === "resolution") {
				companyDocuments['items'][i].color = "#c41155";
				companyDocuments['items'][i].icon = "folder_special";
			} else {
				companyDocuments['items'][i].color = "#92d417";
				companyDocuments['items'][i].icon = "folder_open";
			}

			companyDocuments['items'][i].category = "category" in companyDocuments['items'][i] ? companyDocuments['items'][i].category.toString().replace(regexp, " ") : "";
			companyDocuments['items'][i].description = "description" in companyDocuments['items'][i] ? companyDocuments['items'][i].description.toString().replace(regexp, " ") : "";
		}

		this.companyDocuments = companyDocuments;
	}

}
