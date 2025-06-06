import { TitleCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';

import { CompanyDetailModel } from 'src/app/interface/models/company-data-model';

import { CompaniesEligibleForDataWithoutLogin } from 'src/environments/environment';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { take } from 'rxjs';

@Component({
	selector: 'dg-company-details-dg-extn',
	templateUrl: './company-details-dg-extn.component.html',
	styleUrls: ['./company-details-dg-extn.component.scss']
})
export class CompanyDetailsDgExtnComponent implements OnInit {

	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'

	companyData: any[];
	companyDetail: CompanyDetailModel[] = [];
	@Input() companyNumber: string;
	@Input() companyOriginalName: any;

    @Input() overviewName: string;
	@Input() companySideDetailsParams: any;
	@Input() sidePanelView: any = false;
	
	isLoggedIn: boolean = false;
	loader: boolean = true;
	companyDocuments: Object;
	companyNotExists: boolean = false;
	nameOfCompany: string;   
	companyAddress: string;

	constructor(
		private userAuthService: UserAuthService,
		private seoService: SeoService,
		private commonService: CommonServiceService,
		private _activatedRoute: ActivatedRoute,
		private titleCasePipe: TitleCasePipe,
		private sharedLoaderService: SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService
	) {
		if (this._activatedRoute.snapshot.url[0].path !== 'company-search' && this._activatedRoute.snapshot.url[0].path !== 'notes' && this._activatedRoute.snapshot.url[0].path !== 'director') {
			// this.breadcrumbService.setItems([
			// 	// { label: '', routerLink: ['/'] },
			// 	{ label: 'Search Companies', routerLink: ['/company-search'] },
			// 	{ label: 'Company Details' }
			// ]);
			//this.canonicalService.setCanonicalURL();
			// this.seoService.setkeywords( this.keywords );
			// this.seoService.setRobots (this.robots );

		}

		if (this._activatedRoute.snapshot.params["companyNo"]) {
			this.companyNumber = this._activatedRoute.snapshot.params["companyNo"];
		}
		if (this._activatedRoute.snapshot.params["companyName"]) {
			this.companyOriginalName = this._activatedRoute.snapshot.params["companyName"].toLowerCase();
		}

		// if ( this.authService.isLoggedin() ) {
		//     this.authService.getUserPlanFeatures();
		//     this.authService.getUserAddOnFeatures();
		// }
	 }

	ngOnInit() {

		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => this.isLoggedIn = loggedIn );

		this.getCompanyDetail();
	}

	getCompanyDetail1() {
		this.sharedLoaderService.showLoader();
		let reqobj = [ this.companyNumber ];
		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_API', 'companyByCmpNo', reqobj ).subscribe( res => {
			this.companyData = res.body;
		})
		this.sharedLoaderService.hideLoader();
	}

	getCompanyDetail() {
		let apiEndPoint = ( this.isLoggedIn || CompaniesEligibleForDataWithoutLogin.includes( this.companyNumber ) ) ? 'companyOverview' : 'infoByCompanyNumberPublic';
		let reqobj = [ this.companyNumber ];
		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_API', apiEndPoint, reqobj ).subscribe( res => {
			let data = res.body;

			this.nameOfCompany = this.titleCasePipe.transform(data.businessName);
			if (data.companyRegistrationNumber) {
				this.companyAddress = this.commonService.formatCompanyAddress(data.RegAddress_Modified);
			}

			let regex = /-/g;
			this.title = this.titleCasePipe.transform(this.companyOriginalName.replace(regex, ' ')) + ' | Company Profile | DataGardener';
			this.seoService.setPageTitle(this.title);

			this.description = this.nameOfCompany + ' located in ' + this.companyAddress + '.' + ' Check ' + this.nameOfCompany + ' details, industry, shareholders, financials, contacts and other. ';

			this.seoService.setDescription(this.description);

			if (data.companyRegistrationNumber) {
				this.companyData = data;

				// this.getGroupStructure();

				if ( this.isLoggedIn ) {
					this.saveInRecents();
				}
			}
			else {
				this.companyData = [];
				this.companyNotExists = true;
			}
		})
	}

	getGroupStructure() {
		let reqobj = [ this.companyNumber ];
		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_COMPANY_DETAILS', 'companyGroupStructure', reqobj ).subscribe( res => {
			let results = res.body;
			if (results['status'] === 200) {
				this.companyData['groupStructureData'] = results['results'];
			}
		});
	}

	getCompanyDocuments() {
		let reqobj = [ this.companyNumber ];
		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_API', 'listOfCompanyDocuments', reqobj ).subscribe( res => {
			if (res.body['status'] == 200) {
				if (res.body['companyDocuments'].items) {
					this.parseDocument(res.body['companyDocuments']);
				}
			}
			// this.companyDocuments = data['companyDocuments'];
		})
	}

	parseDocument(companyDocuments) {
		let download = {};
		let regexp = /-/g;

		for (let i = 0; i < companyDocuments["items"].length; i++) {
			if (companyDocuments["items"][i].links == undefined) {
				companyDocuments["items"][i].links = {
					document_metadata: undefined,
					self: undefined
				}
				// companyDocuments["items"][i]['links']["document_metadata"] = undefined;
				// companyDocuments["items"][i]['links']["self"] = undefined;
			}

			download = { companyNumber: this.companyNumber, description: companyDocuments["items"][i].description, metadata: companyDocuments["items"][i].links["document_metadata"] };
			companyDocuments["items"][i]['download'] = download;

			if (companyDocuments['items'][i].category === "confirmation-statement") {
				companyDocuments['items'][i].color = "#3dd177";
				companyDocuments['items'][i].icon = 'playlist_add_check';
			}
			else if (companyDocuments['items'][i].category === "accounts") {
				companyDocuments['items'][i].color = "#52a6ff";
				companyDocuments['items'][i].icon = "account_balance";
			}
			else if (companyDocuments['items'][i].category === "annual-return") {
				companyDocuments['items'][i].color = "#e66ecc";
				companyDocuments['items'][i].icon = "assignment";
			}
			else if (companyDocuments['items'][i].category === "officers") {
				companyDocuments['items'][i].color = "#ff5e52";
				companyDocuments['items'][i].icon = "people_outline";
			}
			else if (companyDocuments['items'][i].category === "incorporation") {
				companyDocuments['items'][i].color = "#0277bd";
				companyDocuments['items'][i].icon = "today";
			}
			else if (companyDocuments['items'][i].category === "persons-with-significant-control") {
				companyDocuments['items'][i].color = "#ff9800";
				companyDocuments['items'][i].icon = "people";
			}
			else if (companyDocuments['items'][i].category === "change-of-constitution") {
				companyDocuments['items'][i].color = "#2e7d32";
				companyDocuments['items'][i].icon = "description";
			}
			else if (companyDocuments['items'][i].category === "address") {
				companyDocuments['items'][i].color = "#00695c";
				companyDocuments['items'][i].icon = "location_on";
			}
			else if (companyDocuments['items'][i].category === "mortgage") {
				companyDocuments['items'][i].color = "#e91e63";
				companyDocuments['items'][i].icon = "business_center";
			}
			else if (companyDocuments['items'][i].category === "gazette") {
				companyDocuments['items'][i].color = "#92d417";
				companyDocuments['items'][i].icon = "insert_drive_file";
			}
			else if (companyDocuments['items'][i].category === "dissolution") {
				companyDocuments['items'][i].color = "#f92616";
				companyDocuments['items'][i].icon = "delete_forever";
			}
			else if (companyDocuments['items'][i].category === "capital") {
				companyDocuments['items'][i].color = "#0cab0f";
				companyDocuments['items'][i].icon = "work";
			}
			else if (companyDocuments['items'][i].category === "change-of-name") {
				companyDocuments['items'][i].color = "#ff9632";
				companyDocuments['items'][i].icon = "edit";
			}
			else if (companyDocuments['items'][i].category === "resolution") {
				companyDocuments['items'][i].color = "#c41155";
				companyDocuments['items'][i].icon = "folder_special";
			}
			else {
				companyDocuments['items'][i].color = "#92d417";
				companyDocuments['items'][i].icon = "folder_open";
			}

			companyDocuments['items'][i].category = companyDocuments['items'][i].category.toString().replace(regexp, " ");
			companyDocuments['items'][i].description = companyDocuments['items'][i].description.toString().replace(regexp, " ");
		}

		this.companyDocuments = companyDocuments;
	}

	saveInRecents() {
		let obj = {
			userid: this.userAuthService?.getUserInfo('dbID'),
			companyNumber: this.companyNumber,
			companyName: this.companyData['businessName']
		}
		
		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'saveRecentCompanies', obj ).subscribe( res => {});
	}

}
