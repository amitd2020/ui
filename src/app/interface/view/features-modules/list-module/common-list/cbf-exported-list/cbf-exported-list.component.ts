import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';

import { SeoService } from 'src/app/interface/service/seo.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-cbf-exported-list',
	templateUrl: './cbf-exported-list.component.html',
	styleUrls: ['./cbf-exported-list.component.scss']
})
export class CbfExportedListComponent implements OnInit {

	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'

	tableCols: Array<any>;
	selectedExportCols: Array<any>;
	exportCbfListData = [];
	dataArr = [];
	msgs = [];

	showDialog: boolean = false;
	constantMessages: any = UserInteractionMessages;

	constructor(
		private seoService: SeoService,
		private confirmationService: ConfirmationService,
		private userAuthService: UserAuthService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService

	) {
		// this.breadCrumbService.setItems([
		// 	{ label: 'CBF Exported Files' }
		// ]);
		this.title = "CBF Export Files - DataGardener";
		this.description = "CBF Export and download list you want to track status and background.";
		// this.canonicalService.setCanonicalURL();
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
		// this.seoService.setkeywords( this.keywords );
		// this.seoService.setRobots (this.robots );
	}

	ngOnInit() {

		this.getUserCBFExportedList();

		this.tableCols = [
			{ field: 'deleteExportList', header: 'Action', minWidth: "120px", maxWidth: '120px', textAlign: "center" },
			{ field: 'exportListName', header: 'File Name', minWidth: "150px", maxWidth: 'none', textAlign: "left" },
			{ field: 'exportCount', header: 'Count', minWidth: "180px", maxWidth: '180px', textAlign: "right" },
			{ field: 'exportedOn', header: 'Created On', minWidth: "220px", maxWidth: '220px', textAlign: "center" },
			{ field: 'userExportListDownload', header: 'Action', minWidth: "220px", maxWidth: '220px', textAlign: "center" }
		];

	}

	getUserCBFExportedList() {

		this.sharedLoaderService.showLoader();
		// let userID = [ this.userAuthService?.getUserInfo('dbID') ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getUserCbfExportFilesList' ).subscribe( res => {

			this.sharedLoaderService.hideLoader();

			if (res.body.status == 200) {

				this.exportCbfListData = [];

				if (res.body["results"] !== undefined) {
					if (res.body["results"].length > 0) {

						res.body["results"] = res.body.results.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()).reverse();
						this.exportCbfListData = res.body["results"];
						
						for (let listData of this.exportCbfListData) {

							listData['exportedOn'] = listData['created'];
							listData['exportCount'] = +listData['exportCount'];
							
						}

					}
				}

			}
		});

	}

	deleteCBfExportListData( event ) {
		
		this.confirmationService.confirm({

			message: this.constantMessages['confirmation']['delete'],
			header: 'Delete Confirmation',
			icon: 'pi pi-info-circle',
			accept: () => {


				let params = [ event[0].userId, event[0].exportListName ];

				this.globalServerCommunication.globalServerRequestCall( 'delete', 'DG_LIST', 'deleteCbfExportListByIdAndFileName', params ).subscribe( res => {
					this.sharedLoaderService.hideLoader();

					if (res.body.status == 200) {
						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['exportListDeletedSuccess'] });
						setTimeout(() => {
							this.getUserCBFExportedList();
							this.msgs = [];
						}, 3000);
					} else {
						this.msgs = [];
						this.msgs.push({ severity: 'error', summary: this.constantMessages['infoMessage']['listAlreadyExists'] });
						setTimeout(() => {
							this.getUserCBFExportedList();
							this.msgs = [];
						}, 3000);
					}

				});

			}

		});
	}

}
