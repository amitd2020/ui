import { Component, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { SelectItemGroup } from 'primeng/api';
import { SeoService } from 'src/app/interface/service/seo.service';

@Component({
	selector: 'dg-related-party-intel',
	templateUrl: './related-party-intel.component.html',
	styleUrls: ['./related-party-intel.component.scss']
})
export class RelatedPartyIntelComponent implements OnInit {

	relatedIntelPartyCols = [];
	relatedIntelPartyVals = [];
	comparedListTotalCount = [];
	sourceList = {};
	destinationList = {};
	sourceGroupedLists: SelectItemGroup[];
	
	pageSize = 25;
	first = 0;
	pageNumber = 1;
	title: string = '';
	description: string = '';
	
	constructor(
		public userAuthService: UserAuthService,
		private sharedLoaderService: SharedLoaderService,
		public globalServiceCommnunicate: ServerCommunicationService,
		private _seoService: SeoService,
	) {}
	
	ngOnInit() {

		this.initBreadcrumbAndSeoMetaTags();
		this.getListsForComparison();

		this.relatedIntelPartyCols = [
			{ field: 'sourceCompanyRegistrationNumber', header: 'Source Company Number', colunName: 'Source Company Number', width: '150px', textAlign: 'left', value: true, sortOrder: 4, visible: true, countryAccess: ['uk'] },
			{ field: 'sourceBusinessName', header: 'Source Company Name', colunName: 'Source Company Name', width: '360px', textAlign: 'left', value: true, sortOrder: 1, visible: true, countryAccess: ['uk'] },
			{ field: 'relationDirectorName', header: 'Director Name', colunName: 'Director Name', width: '230px', textAlign: 'left', value: true, sortOrder: 3, visible: true, countryAccess: ['uk'] },
			{ field: 'destinationCompanyRegistrationNumber', header: 'Destination Company Number', colunName: 'Destination Company Number', width: '150px', textAlign: 'left', value: true, sortOrder: 14, visible: true, countryAccess: ['uk'] },
			{ field: 'destinationBusinessName', header: 'Destination Company Name', colunName: 'Destination Company Name', width: '380px', textAlign: 'left', value: true, sortOrder: 14, visible: true, countryAccess: ['uk'] }
		];
	}

	initBreadcrumbAndSeoMetaTags() {		
		this.title = "Compare Related Party List. i.e Client List | Supplier List | Accounts List | User List.";
		this.description = "Compare list between Client, Supplier Accounts and User Lists.";
		this._seoService.setPageTitle(this.title);
		this._seoService.setDescription(this.description)
	}

	getListsForComparison() {
		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_LIST', 'listsForComparison' ).subscribe(
			{
				next: ( res ) => {
					if ( res.body.code == 200 ) {
						this.sourceGroupedLists = res.body.result;
					}
					this.sharedLoaderService.hideLoader()
				},
				error: ( err ) => {
					console.log(err);
				}
			}
		);
	}

	getComparedWorkflowListData() {

		this.sharedLoaderService.showLoader()
	
		let selectedListInPayload = {
			"sourceListId": this.sourceList['_id'],
			"sourceListType": this.sourceList['listType'],
			"destinationListId": this.destinationList['_id'],
			"destinationListType": this.destinationList['listType']
		};

		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_API', 'compareRegsRelation', selectedListInPayload ).subscribe(
			{
				next: ( res ) => {
					if ( res.body.code == 200 ) {
						this.relatedIntelPartyVals = res.body.result;
						this.comparedListTotalCount = res.body.result.length;
					}
					this.sharedLoaderService.hideLoader()
				},
				error: ( err ) => {
					console.log(err);
				}
			}
		);

	}

	tableOutputHandler( event: unknown ) {

		this.changePaginator( event );

	}

	changePaginator( event: any ) {
		this.pageNumber = event.page + 1;
		this.pageSize = event.rows;
		this.first = event.first;
		this.getComparedWorkflowListData();
	}
}
