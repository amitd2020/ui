import { Component, OnInit } from '@angular/core';

import { ConfirmationService } from 'primeng/api';

import { UserInteractionMessages } from '../../../../../../../assets/utilities/data/UserInteractionMessages.const';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-pdf-export-list',
	templateUrl: './pdf-export-list.component.html',
	styleUrls: ['./pdf-export-list.component.scss']
})
export class PdfExportListComponent implements OnInit {

	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'

	pdfTableCols: Array<any>;
	selectedExportCols: Array<any>;
	pdfReportListData = [];
	dataArr = [];
	msgs = [];

	showDialog: boolean = false;
	// showLoaderData: boolean = false;
	constantMessages: any = UserInteractionMessages;

	constructor(
		private seoService: SeoService,
		private confirmationService: ConfirmationService,
		private userAuthService: UserAuthService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunicate: ServerCommunicationService

	) {
		// this.breadCrumbService.setItems([
		// 	{ label: 'PDF Reports' }
		// ]);
		this.title = "PDF Reports - DataGardener";
		this.description = "Download Company PDF Report List you want to track status and background.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
		// this.canonicalService.setCanonicalURL();
		// this.seoService.setkeywords( this.keywords );
		// this.seoService.setRobots (this.robots );
	}

	ngOnInit() {

		this.getuserPdfReportList();

		this.pdfTableCols = [
			{ field: 'deletePdfReportList', header: 'Action', minWidth: "100px", maxWidth: '100px', textAlign: "center" },
			{ field: 'pdfReportfileName', header: 'File Name', minWidth: "250px", maxWidth: 'none', textAlign: "left" },
			{ field: 'lastDownloadedReportType', header: 'Category', minWidth: "250px", maxWidth: '250px', textAlign: "left" },
			{ field: 'createdDate', header: 'Created On', minWidth: "250px", maxWidth: '250px', textAlign: "center" },
			{ field: 'userReportListDownload', header: 'Action', minWidth: "250px", maxWidth: '250px', textAlign: "center" }
		];
	}

	getuserPdfReportList() {

		this.sharedLoaderService.showLoader();
		// let userID = [ this.userAuthService?.getUserInfo('dbID') ];

		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_API', 'getUserPdfLists' ).subscribe( res => {

			this.sharedLoaderService.hideLoader();
			if (res.body.status == 200) {
				this.pdfReportListData = [];
				if (res.body["results"] !== undefined) {
					if (res.body["results"].length > 0) {
						res.body["results"] = res.body.results.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()).reverse();
						this.pdfReportListData = res.body["results"];
						for (let listData of this.pdfReportListData) {
							listData['reportType'] = listData['category'];
						}
					}
				}
			}

		});

	}

	deleteReportListData(event) {

		let params = [ event.pdfReportfileName ];

		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['delete'],
			header: 'Delete Confirmation',
			icon: 'pi pi-info-circle',
			accept: () => {

				this.sharedLoaderService.showLoader();

				this.globalServerCommunicate.globalServerRequestCall( 'delete', 'DG_API', 'deletePdfReportListByIdAndFileName', params ).subscribe( res => {
					this.sharedLoaderService.hideLoader();
					if (res.body.status == 200) {
						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['reportListDeletedSuccess'] });
						setTimeout(() => {
							this.getuserPdfReportList();
							this.msgs = [];
						}, 3000);
					}
					else {
						this.msgs = [];
						this.msgs.push({ severity: 'error', summary: this.constantMessages['errorMessage']['reportListNotDeletedMessage'] });
						setTimeout(() => {
							this.getuserPdfReportList();
							this.msgs = [];
						}, 3000);
					}
				});
				
			}
		});
	}

}
