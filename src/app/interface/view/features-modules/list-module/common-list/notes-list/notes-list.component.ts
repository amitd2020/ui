import { Component, OnInit } from '@angular/core';

import { SeoService } from 'src/app/interface/service/seo.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-notes-list',
	templateUrl: './notes-list.component.html',
	styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent implements OnInit {

	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'

	tableCols: Array<any>;
	tableData: Array<any> = [];
	// isDataLoading: boolean = false;

	constructor(
		private seoService: SeoService,
		private userAuthService: UserAuthService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunicate: ServerCommunicationService
	) {
		// this.breadCrumbService.setItems([
		// 	{ label: 'Notes' }
		// ]);
		this.title = "Notes List - DataGardener";
		this.description = "Create seprate companies notes list for indvidual company status";
		// this.canonicalService.setCanonicalURL();
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
		// this.seoService.setkeywords( this.keywords );
		// this.seoService.setRobots (this.robots );
	}

	ngOnInit() {

		this.sharedLoaderService.showLoader();

		this.getCompanyNotesData();

		this.tableCols = [
			{ field: 'CompanyNameOriginal', header: 'Latest Note For', minWidth: '500px', maxWidth: '500px', textAlign: 'left' },
			{ field: 'notes', header: 'Note ', minWidth: '300px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'updatedOn', header: 'Updated On', minWidth: '300px', maxWidth: '300px', textAlign: 'center' },
			{ field: 'createdBy', header: 'Added By User', minWidth: '300px', maxWidth: '300px', textAlign: 'center' }
		];
	}

	getCompanyNotesData() {

		this.sharedLoaderService.showLoader();
		this.tableData = [];
		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'notesList').subscribe( res => {
			if ( res.status == 200 && res.body['results'] ) {
				let tempData = res.body['results'];
				for (let arrayData of tempData) {
					arrayData.data[0]['createdBy'] = arrayData['_id']['userName'] || ''
					let obj = arrayData.data[0]
					this.tableData.push(obj)
				};
				this.tableData = this.sortNotes(this.tableData)
			};
			this.sharedLoaderService.hideLoader();
		});
	}

	sortNotes(tempArr) {
		var len = tempArr.length,
			min;
		for (let i = 0; i < len; i++) {
			min = i;
			for (let j = i + 1; j < len; j++) {
				if (new Date(tempArr[j]["updatedOn"]) > new Date(tempArr[min]["updatedOn"])) {
					min = j;
				}
			}

			if (i != min) {
				this.swap(tempArr, i, min);
			}
		}
		return (tempArr)
	}

	swap(items, firstIndex, secondIndex) {
		var temp = items[firstIndex];
		items[firstIndex] = items[secondIndex];
		items[secondIndex] = temp;
	}

	updateNotesList( event ) {
		if( event ) {
			setTimeout(() => {
				this.getCompanyNotesData();
			}, 500);
		}
	}
}
