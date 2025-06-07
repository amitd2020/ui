import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';

@Component({
	selector: 'dg-api-section',
	templateUrl: './api-section.component.html',
	styleUrls: ['./api-section.component.scss']
})

export class ApiSectionComponent implements OnInit {

	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'

	companyDetail: any;
	companyDocument: Object;
	relatedCompaniesAndDirector: Object;
	financialData: any;
	companyCompleteInfo: any;

	constructor(
		private seoService: SeoService,
		private globalServiceCommnunicate: ServerCommunicationService,
		private sharedLoaderService: SharedLoaderService
	) { }

	ngOnInit() {
		this.sharedLoaderService.showLoader();
		this.initBreadcrumbAndSeoMetaTags();
		this.getJsonResponse();
	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems(
		// 	[
		// 		{ label: 'API Selection' }
		// 	]
		// );
		this.title = "API Selection - DataGardener";
		this.description = "Get Detailed analysis of a Company, Director or PSC with our API section.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);

	}

	getJsonResponse() {

		this.globalServiceCommnunicate.getDataFromJSON('companyDetail.json').subscribe(res => {
			this.companyDetail = res;
		});

		this.globalServiceCommnunicate.getDataFromJSON('companyDocuments.json').subscribe(res => {
			this.companyDocument = res;
		});

		this.globalServiceCommnunicate.getDataFromJSON('relatedCompaniesAndDirectors.json').subscribe(res => {
			this.relatedCompaniesAndDirector = res;
		});

		this.globalServiceCommnunicate.getDataFromJSON('simplifiedAccount.json').subscribe(res => {
			this.financialData = res;
		});

		this.globalServiceCommnunicate.getDataFromJSON('companyCompleteInfo.json').subscribe(res => {
			this.companyCompleteInfo = res;
		});

	}

	ngAfterViewInit(): void {
		setTimeout(() => {
			this.sharedLoaderService.hideLoader();
		}, 500);
	}
}
