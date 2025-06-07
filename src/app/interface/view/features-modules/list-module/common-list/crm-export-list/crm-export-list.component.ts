import { Component, OnInit } from '@angular/core';

import { ConfirmationService } from 'primeng/api';

import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';

import { UserInteractionMessages } from '../../../../../../../assets/utilities/data/UserInteractionMessages.const';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-crm-export-list',
	templateUrl: './crm-export-list.component.html',
	styleUrls: ['./crm-export-list.component.scss']
})
export class CrmExportListComponent implements OnInit {

	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'

	tableCols: Array<any>;
	selectedExportCols: Array<any>;
	exportListData = [];
	dataArr = [];
	msgs = [];

	showDialog: boolean = false;
	constantMessages: any = UserInteractionMessages;

	constructor(
		private seoService: SeoService,
		private confirmationService: ConfirmationService,
		private userAuthService: UserAuthService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunicate: ServerCommunicationService

	) {
		// this.breadCrumbService.setItems([
		// 	{ label: 'CRM' }
		// ]);
		this.title = "CRM Export List - DataGardener";
		this.description = "CRM Export and download list you want to track status and background.";
		// this.canonicalService.setCanonicalURL();
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
		// this.seoService.setkeywords( this.keywords );
		// this.seoService.setRobots (this.robots );
	}

	ngOnInit() {

		this.getUserCrmExportFilesList();

		this.tableCols = [
			{ field: 'deleteExportList', header: 'Action', minWidth: "150px", maxWidth: '150px', textAlign: "center" },
			{ field: 'exportListName', header: 'File Name', minWidth: "150px", maxWidth: 'none', textAlign: "left" },
			{ field: 'exportCount', header: 'Count', minWidth: "150px", maxWidth: '150px', textAlign: "right" },
			{ field: 'exportedOn', header: 'Created On', minWidth: "200px", maxWidth: '200px', textAlign: "center" },
			{ field: 'userExportListDownload', header: 'Action', minWidth: "250px", maxWidth: '250px', textAlign: "center" }
		];


	}

	getUserCrmExportFilesList() {

		this.sharedLoaderService.showLoader();

		// let params = [ this.userAuthService?.getUserInfo('dbID') ];

		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getUserCrmExportFilesList' ).subscribe( res => {
			this.sharedLoaderService.hideLoader();

			if (res.body.status == 200) {

				this.exportListData = [];

				if (res.body["results"] !== undefined) {
					if (res.body["results"].length > 0) {
						res.body["results"] = res.body.results.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()).reverse();
						this.exportListData = res.body["results"];
						
						for (let listData of this.exportListData) {
							listData['exportedOn'] = listData['created'];
							listData['exportCount'] = +listData['exportCount'];
						}
					}
				}

			}



		}, (err: any) => {
			if ( err ) {
			}
		});

	}

	deleteCrmExportListData( event ) {
		
		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['delete'],
			header: 'Delete Confirmation',
			icon: 'pi pi-info-circle',
			accept: () => {

				this.sharedLoaderService.showLoader();
				
				let params = [ event[0].userId, event[0].exportListName ];

				this.globalServerCommunicate.globalServerRequestCall( 'delete', 'DG_LIST', 'deleteCrmExportListByIdAndFileName', params ).subscribe( res => {
					this.sharedLoaderService.hideLoader();

					if (res.body.status == 200) {
						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['exportListDeletedSuccess'] });
						setTimeout(() => {
							this.getUserCrmExportFilesList();
							this.msgs = [];
						}, 3000);
					} else {
						this.msgs = [];
						this.msgs.push({ severity: 'error', summary: this.constantMessages['infoMessage']['listAlreadyExists'] });
						setTimeout(() => {
							this.getUserCrmExportFilesList();
							this.msgs = [];
						}, 3000);
					}
					
					
				}, (err: any) => {
					if ( err ) {
						
					}
				});

			}
			
		});
	}

}
