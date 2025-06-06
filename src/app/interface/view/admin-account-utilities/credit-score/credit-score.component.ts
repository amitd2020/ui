import { Component, OnInit } from '@angular/core';

import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../shared-components/shared-loader/shared-loader.service';

@Component({
	selector: 'dg-credit-score',
	templateUrl: './credit-score.component.html',
	styleUrls: ['./credit-score.component.scss']
})
export class CreditScoreComponent implements OnInit {

	title: string = '';
	description: string = '';

	creditScoreData: Array<any> = [];
	creditScoreDataColumn: any[];

	totalNumOfRecords: number;

	constructor(
		private seoService: SeoService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit() {
		
		this.initBreadcrumbAndSeoMetaTags();

		this.creditScoreDataColumn = [
			{ field: 'companyNumber', header: 'Company Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
			{ field: 'businessName', header: 'Company Name', minWidth: '280px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'currentLimit', header: 'Current Limit', minWidth: '120px', maxWidth: '120px', textAlign: 'right' },
			{ field: 'currentScore', header: 'Current Score', minWidth: '120px', maxWidth: '120px', textAlign: 'right' },
			{ field: 'previousLimit', header: 'Previous Limit', minWidth: '120px', maxWidth: '120px', textAlign: 'right' },
			{ field: 'previousScore', header: 'Previous Score', minWidth: '120px', maxWidth: '120px', textAlign: 'right' },
			{ field: 'currentLimitCurrency', header: 'Currency', minWidth: '120px', maxWidth: '120px', textAlign: 'left' },
			{ field: 'latestRatingChangeDate', header: 'Rating Change Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' }
		];

		this.getCreditScoreData();

	}

	getCreditScoreData( pageNumber?: number, pageSize?: number ) {

		this.sharedLoaderService.showLoader();
		let requestBody = {
			pageNumber: pageNumber ? pageNumber : 1,
			pageSize: pageSize ? pageSize : 25
		}

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'getCreditScoreData', requestBody ).subscribe ( res => {			
			if ( res.body.status == 200 ) {
				this.totalNumOfRecords = res.body.total;
				this.creditScoreData = res.body.results;
			}
			this.sharedLoaderService.hideLoader();
		});

	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems(
		// 	[
		// 		{ label: "Credit Score" }
		// 	]
		// );
		this.title = "Credit Score Check - DataGardener";
		this.description = "Check your latest Credit Score, & Report online in UK for Free ✓Credit Score ranges between 300 to 900.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
		// this.seoService.setkeywords( this.keywords );
		// this.seoService.setRobots (this.robots );

	}

	getUpdateTableDataList( event ) {
		this.getCreditScoreData( event.page + 1, event.rows );
	}

}
