import { Component, OnInit } from '@angular/core';

import { ConfirmationService } from 'primeng/api';

import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { CanonicalURLService } from 'src/app/interface/service/canonical-url.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';

import { UserInteractionMessages } from '../../../../../../../assets/utilities/data/UserInteractionMessages.const';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-export-list',
	templateUrl: './export-list.component.html',
	styleUrls: ['./export-list.component.scss']
})
export class ExportListComponent implements OnInit {

	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'

	tableCols: Array<any>;
	totalNumOfRecords: number;
	totalNumOfRows: number;
	selectedExportCols: Array<any>;
	exportListData = [];
	dataArr = [];
	msgs = [];
	selectedGlobalCountry: string = 'uk';

	showDialog: boolean = false;
	// showLoaderData: boolean = false;
	constantMessages: any = UserInteractionMessages;

	constructor(
		private seoService: SeoService,
		private canonicalService: CanonicalURLService,
		private confirmationService: ConfirmationService,
		private userAuthService: UserAuthService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) {
		// this.breadCrumbService.setItems([
		// 	{ label: 'Exported Files' }
		// ]);
		this.title = "Exported Company Files - DataGardener";
		this.description = "Export and download Company Files you want to track status and background.";
		this.canonicalService.setCanonicalURL();
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
		// this.seoService.setkeywords( this.keywords );
		// this.seoService.setRobots (this.robots );
	}

	ngOnInit() {
		this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';

		this.getuserExportList();

		this.tableCols = [
			{ field: 'deleteExportList', header: 'Action', minWidth: "100px", maxWidth: '100px', textAlign: "center", countryAccess: [ 'uk', 'ie' ]  },
			{ field: 'exportListName', header: 'File Name', minWidth: "200px", maxWidth: 'none', textAlign: "left", countryAccess: [ 'uk', 'ie' ] },
			{ field: 'categoryForExportList', header: 'Category', minWidth: "250px", maxWidth: '250px', textAlign: "left", countryAccess: [ 'uk', 'ie' ] },
			{ field: 'exportCount', header: 'Count', minWidth: "100px", maxWidth: '100px', textAlign: "right", countryAccess: [ 'uk', 'ie' ] },
			{ field: 'exportedOn', header: 'Created On', minWidth: "200px", maxWidth: '200px', textAlign: "center", countryAccess: [ 'uk' ] },
			{ field: 'createdAt', header: 'Created On', minWidth: "200px", maxWidth: '200px', textAlign: "center", countryAccess: [ 'ie' ] },
			{ field: 'userExportListDownload', header: 'Action', minWidth: "200px", maxWidth: '200px', textAlign: "center", countryAccess: [ 'uk', 'ie' ] }
		];
		this.tableCols = this.tableCols.filter( col => col.countryAccess.includes( this.selectedGlobalCountry ) );
	}

	getuserExportList( pageSize?, pageNumber? ) { 

		this.sharedLoaderService.showLoader();

		let params = [ 
			// this.userAuthService?.getUserInfo('dbID'), 
			pageSize ? pageSize : 25,
			pageNumber ? pageNumber : 0
		];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getuserExportFilesList', params ).subscribe( res => {

			this.sharedLoaderService.hideLoader();
	
			if (res.body.status == 200) {
	
				this.exportListData = [];
	
				if (res.body["results"] !== undefined) {
					if (res.body["results"].length > 0) {
	
						res.body["results"] = res.body.results.sort((a, b) => {
							if ( this.selectedGlobalCountry == 'uk' ) {
								return new Date(a.created).getTime() - new Date(b.created).getTime();
							} else {
								return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
							}
						});
						
						this.exportListData = res.body["results"].reverse();
						this.totalNumOfRecords = res.body['totalCount'];
	                            
						for (let listData of this.exportListData) {
							listData['exportedOn'] = listData['created'];
							listData['exportCount'] = Number(listData['exportCount']);
							listData['categoryForExportList'] = listData['category'].replace(/_/g, " ");
						}
	
					}
				}
			}

		});

	}
	
	deleteExportListData(event) {

		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['delete'],
			header: 'Delete Confirmation',
			icon: 'pi pi-info-circle',
			accept: () => {
				this.sharedLoaderService.showLoader();

				let params = [ event[0].exportListName	];

				this.globalServerCommunication.globalServerRequestCall( 'delete', 'DG_LIST', 'deleteExportListByIdAndFileName', params ).subscribe( res => {
					this.sharedLoaderService.hideLoader();
					if ( res.body.message == "Export list data deleted !!" ) {

						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['exportListDeletedSuccess'] });

						setTimeout(() => {

							this.getuserExportList( this.totalNumOfRows );
							this.msgs = [];
							let tableDomElement = event[1].el.nativeElement.children[0],
								sortIcons = tableDomElement.querySelectorAll('.p-datatable-wrapper .p-sortable-column-icon'),
								filterSearchRowInputFields = tableDomElement.querySelectorAll('.p-datatable-wrapper .filterSearchRow input[type="text"]');
					
							for (let icon of sortIcons) {
								icon.classList.value = 'p-sortable-column-icon pi pi-fw pi-sort-alt';
							}
					
							for (let inputField of filterSearchRowInputFields) {
								inputField.value = "";
							}

						}, 3000);				
						
					} else {
						this.msgs = [];
						this.msgs.push({ severity: 'error', summary: this.constantMessages['errorMessage']['exportListNotDeletedMessage'] });
						setTimeout(() => {
							this.getuserExportList( this.totalNumOfRows );
							this.msgs = [];
						}, 3000);
					}
				});
			}
		});
		
	}
	
	getUpdateTableDataList( event ) {
		this.totalNumOfRows = event.rows;
		this.getuserExportList( event.rows, event.page );

	}

}
