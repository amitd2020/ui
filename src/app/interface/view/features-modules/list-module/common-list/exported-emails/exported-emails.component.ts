import { Component, OnInit } from '@angular/core';

import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-exported-emails',
	templateUrl: './exported-emails.component.html',
	styleUrls: ['./exported-emails.component.scss']
})
export class ExportedEmailsComponent implements OnInit {

	fetchedEmailsColumns: Array<any> = [];
	verifiedEmailsColumns: Array<any> = [];

	fetchedEmailListData: any[];
	verifiedEmailListData: any[];

	title: string;
	description: string;
	selectedGlobalCountry: string = 'uk';

	constructor(
		private userAuthService: UserAuthService,
		private seoService: SeoService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunicate: ServerCommunicationService

	) {
			
		// this.breadCrumbService.setItems([
		// 	{ label: 'Exported Emails' }
		// ]);
		this.title = "Exported Company Emails - DataGardener";
		this.description = "Export and download Company Emails you want to track status and background.";
		// this.canonicalService.setCanonicalURL();
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
		// this.seoService.setkeywords( this.keywords );
		// this.seoService.setRobots (this.robots );
		
	}

	ngOnInit() {
	   	this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';
		this.getExportToMailData();

		this.fetchedEmailsColumns = [
			{ field: 'exportEmailListName', header: 'File Name', minWidth: "240px", maxWidth: 'none', textAlign: "left" },
			{ field: 'exportEmailsCount', header: 'Email Counts', minWidth: "120px", maxWidth: '120px', textAlign: "right" },
			// { field: 'totalCompaniesCount', header: 'Company Counts', minWidth: "135px", maxWidth: '135px', textAlign: "right" },
			// { field: 'totalDomainsCount', header: 'Total Domains', minWidth: "120px", maxWidth: '120px', textAlign: "right" },
			// { field: 'companiesWithNoDomainsCount', header: 'Companies Without Domain', minWidth: "200px", maxWidth: '200px', textAlign: "right" },
			// { field: 'validcompanyDomainsCount', header: 'Valid Domains', minWidth: "120px", maxWidth: '120px', textAlign: "right" },
			// { field: 'inValidcompanyDomainsCount', header: 'Invalid Domains', minWidth: "135px", maxWidth: '135px', textAlign: "right" },
			// { field: 'exportEmailsDomainCount', header: 'Email Found Domains', minWidth: "160px", maxWidth: '160px', textAlign: "right" },
			{ field: 'exportedOn', header: 'Created On', minWidth: "150px", maxWidth: '150px', textAlign: "center" },
			{ field: 'actionDownloadButon', header: 'Action', minWidth: "120px", maxWidth: '120px', textAlign: "center" }
		];

		this.verifiedEmailsColumns = [
			{ field: 'exportEmailListName', header: 'File Name', minWidth: "240px", maxWidth: '600px', textAlign: "left" },
			{ field: 'exportEmailsCount', header: 'Email Counts', minWidth: "120px", maxWidth: '250px', textAlign: "right" },
			{ field: 'totalCompaniesCount', header: 'Company Counts', minWidth: "135px", maxWidth: '250px', textAlign: "right" },
			{ field: 'exportedOn', header: 'Created On', minWidth: "130px", maxWidth: '250px', textAlign: "center" },
			{ field: 'actionDownloadButon', header: 'Action', minWidth: "150px", maxWidth: '250px', textAlign: "center" }
		];
	}

	getExportToMailData() {

		this.sharedLoaderService.showLoader();

		// let userID = [ this.userAuthService?.getUserInfo('dbID') ];

		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'exportEmailsList' ).subscribe( res => {

			if (res.body.code == 200) {
	
				this.fetchedEmailListData = [];
				this.verifiedEmailListData = [];
	
				if (res.body["response"] && res.body['response'].length) {

					res.body["response"] = res.body.response.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()).reverse();
					this.fetchedEmailListData = res.body["response"];

					this.verifiedEmailListData = this.fetchedEmailListData.filter((emailListData) => emailListData['exportListName'].includes('DG_DBC'));

					this.fetchedEmailListData = this.fetchedEmailListData.filter((emailListData) => !emailListData['exportListName'].includes('DG_DBC'));

					for (let listData of res.body["response"]) {
						listData['exportedOn'] = listData['createdOn'];
						listData['exportEmailListName'] = listData['exportListName'];
						listData['exportEmailsCount'] = Number(listData['exportEmailsCount']);
						listData['totalCompaniesCount'] = Number(listData['totalCompaniesCount']);
						listData['exportEmailsDomainCount'] = Number(listData['exportEmailsDomainCount']);
						listData['validcompanyDomainsCount'] = Number(listData['validcompanyDomainsCount']);
						listData['inValidcompanyDomainsCount'] = Number(listData['inValidcompanyDomainsCount']);
						listData['companiesWithNoDomainsCount'] = Number(listData['companiesWithNoDomainsCount']);
						listData['categoryForExportList'] = listData['category'].replace(/_/g, " ");
						listData['totalDomainsCount'] = Number( listData['validcompanyDomainsCount'] + listData['inValidcompanyDomainsCount'] );
					}
				}
			} else if ( res.body.code == 404 ) {
	
				this.fetchedEmailListData = res.body["response"];
				this.verifiedEmailListData = res.body['response'];				
	
			}
			this.sharedLoaderService.hideLoader();
		});
		
	}

}
