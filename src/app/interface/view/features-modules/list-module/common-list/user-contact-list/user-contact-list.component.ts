import { Component, OnInit } from '@angular/core';

import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';

@Component({
	selector: 'dg-user-contact-list',
	templateUrl: './user-contact-list.component.html',
	styleUrls: ['./user-contact-list.component.scss']
})
export class UserContactListComponent implements OnInit {

	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'
	// loaderUserListData: boolean;
	tableCols: Array<any>;

	tableData = [];
	dataArr = [];

	totalNumOfRecords: number;

	constructor(

		private seoService: SeoService,
		public userAuthService: UserAuthService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit(): void {

		this.sharedLoaderService.showLoader();

		this.initBreadcrumbAndSeoMetaTags();
		this.getContactLists();

		this.tableCols = [
			{ field: 'listName', header: 'List Name', width: '250px', textAlign: 'left' },
			{ field: 'page', header: 'Page', width: '120px', textAlign: 'left' },
			{ field: 'companiesInList', header: 'Number of Records', width: '110px', textAlign: 'right' },
			{ field: 'createdAt', header: 'Created On', width: '100px', textAlign: 'center' },
			{ field: 'updatedAt', header: 'Updated On', width: '100px', textAlign: 'center' },
			{ field: 'edit', header: 'Action', width: '100px', textAlign: 'center' },
		];
	 
	}

	getContactLists( pageSize?, pageNumber? ) {
		this.sharedLoaderService.showLoader();

		let reqobj = [  pageSize ? pageSize : 25, pageNumber ? pageNumber : 1 ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'contactUserList', reqobj ).subscribe( res => {
		// this.companyListService.getContactLists( pageSize, pageNumber ).then(data => {
			let data = res.body;
			if ( data['code'] === 200 ) {
				// this.loaderUserListData = false;
				this.sharedLoaderService.hideLoader();
				this.totalNumOfRecords = data['count'];
				let tempArray = data['data'];
				this.dataArr = [];
				
				if( tempArray.length ) {
					for (let i = 0; i < tempArray.length; i++) {
						if(tempArray && tempArray[i]['page']) {
							let formatedPage = tempArray[i]['page'].replace(/([A-Z])/g, ' $1');
							tempArray[i]['page'] = formatedPage;
							this.dataArr.push(tempArray[i]);
						}
					}
				}
				this.tableData = this.dataArr;
			}
		});

		setTimeout(() => {
			this.sharedLoaderService.hideLoader();
		}, 1000);
	}

	getUpdateTableDataList( event ) {
		
		this.getContactLists( event.rows, event.page + 1 );

	}

	initBreadcrumbAndSeoMetaTags() {
		// this.breadCrumbService.setItems([
		// 	{ label: 'Contact List' }
		// ]);
		this.title = "Contact Lists - DataGardener";
		this.description = "Contact list in which you want to check record.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
	}

}
