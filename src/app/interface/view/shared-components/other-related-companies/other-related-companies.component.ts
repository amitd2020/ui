import { Component, OnInit } from '@angular/core';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../shared-loader/shared-loader.service';
import { AuthGuardService } from 'src/app/interface/auth-guard/auth-guard.guard';
import { ActivatedRoute } from '@angular/router';
import { ListPageName } from '../../features-modules/search-company/search-company.constant';
import { SearchCompanyService } from '../../features-modules/search-company/search-company.service';


@Component({
	selector: 'dg-other-related-companies',
	templateUrl: './other-related-companies.component.html',
	styleUrls: ['./other-related-companies.component.scss']
})
export class OtherRelatedCompaniesComponent implements OnInit {

	otherRelatedCompaniesDataColumn: any[];
	otherRelatedCompaniesData: Array<any>;
	relatedCompaniesCount: any;
	pageSizeValue: any;
	pageNumberValue: any;
	inputPageName: string;
	outputPageName: string;

	constructor(
		private globalServerCommunication: ServerCommunicationService,
		private sharedLoaderService: SharedLoaderService,
		public authGuardService: AuthGuardService,
		private _activatedRoute: ActivatedRoute,
		public searchCompanyService: SearchCompanyService
	) { }

	ngOnInit() {

		this.inputPageName = this._activatedRoute.snapshot.queryParams['listPageName'] ? this._activatedRoute.snapshot.queryParams['listPageName'] : '';
		switch ( this.inputPageName.toLowerCase() ) {
			case ListPageName.company.inputPage.toLowerCase():
				this.outputPageName = ListPageName.company.outputPage;
				break;
			case ListPageName.charges.inputPage.toLowerCase():
				this.outputPageName = ListPageName.charges.outputPage;
				break;
			case ListPageName.trade.inputPage.toLowerCase():
				this.outputPageName = ListPageName.trade.outputPage;
				break;
			case ListPageName.diversityInclusion.inputPage.toLowerCase():
				this.outputPageName = ListPageName.diversityInclusion.outputPage;
				break;
			case ListPageName.businessMonitor.inputPage.toLowerCase():
				this.outputPageName = ListPageName.businessMonitor.outputPage;
				break;
			case ListPageName.businessMonitorPlus.inputPage.toLowerCase():
				this.outputPageName = ListPageName.businessMonitorPlus.outputPage;
				break;
			case ListPageName.businessWatch.inputPage.toLowerCase():
				this.outputPageName = ListPageName.businessWatch.outputPage;
				break;

			case ListPageName.company.outputPage.toLowerCase():
				this.outputPageName = ListPageName.company.outputPage;
				break;
			case ListPageName.charges.outputPage.toLowerCase():
				this.outputPageName = ListPageName.charges.outputPage;
				break;
			case ListPageName.trade.outputPage.toLowerCase():
				this.outputPageName = ListPageName.trade.outputPage;
				break;
			case ListPageName.diversityInclusion.outputPage.toLowerCase():
				this.outputPageName = ListPageName.diversityInclusion.outputPage;
				break;
			case ListPageName.businessMonitor.outputPage.toLowerCase():
				this.outputPageName = ListPageName.businessMonitor.outputPage;
				break;
			case ListPageName.businessMonitorPlus.outputPage.toLowerCase():
				this.outputPageName = ListPageName.businessMonitorPlus.outputPage;
				break;
			case ListPageName.businessWatch.outputPage.toLowerCase():
				this.outputPageName = ListPageName.businessWatch.outputPage;
				break;
			case ListPageName.accountSearch.inputPage.toLowerCase():
				this.outputPageName = ListPageName.accountSearch.outputPage;
				break;
			case ListPageName.accountSearch.outputPage.toLowerCase():
				this.outputPageName = ListPageName.accountSearch.outputPage;
				break;
			case ListPageName.companyDescription.inputPage.toLowerCase():
				this.outputPageName = ListPageName.companyDescription.outputPage;
			break;
			case ListPageName.companyDescription.outputPage.toLowerCase():
				this.outputPageName = ListPageName.companyDescription.outputPage;
				break;
			case ListPageName.suppliers.inputPage.toLowerCase():
				this.outputPageName = ListPageName.suppliers.outputPage;
				break;	
			case ListPageName.buyers.inputPage.toLowerCase():
				this.outputPageName = ListPageName.buyers.outputPage;
				break;	
			case ListPageName.contractFinder.inputPage.toLowerCase():
				this.outputPageName = ListPageName.contractFinder.outputPage;
				break;	
			case ListPageName.otherRelatedCompanies.inputPage.toLowerCase():
				this.outputPageName = ListPageName.otherRelatedCompanies.outputPage;
				break;	
			case ListPageName.businessCollaborators.inputPage.toLowerCase():
				this.outputPageName = ListPageName.businessCollaborators.outputPage;
				break;

			case ListPageName.procurementPartners.inputPage.toLowerCase():
				this.outputPageName = ListPageName.procurementPartners.outputPage;
				break;

			case ListPageName.fiscalHoldings.inputPage.toLowerCase():
				this.outputPageName = ListPageName.fiscalHoldings.outputPage;
				break;

			case ListPageName.potentialLeads.inputPage.toLowerCase():
				this.outputPageName = ListPageName.potentialLeads.outputPage;
				break;

			case ListPageName.companyLinkedin.inputPage.toLowerCase():
				this.outputPageName = ListPageName.companyLinkedin.outputPage;
				break;

			case ListPageName.chargesDescription.inputPage.toLowerCase():
				this.outputPageName = ListPageName.chargesDescription.outputPage;
				break;

			case ListPageName.investeeFinder.inputPage.toLowerCase():
				this.outputPageName = ListPageName.investeeFinder.outputPage;
				break;

			case ListPageName.investorFinder.inputPage.toLowerCase():
				this.outputPageName = ListPageName.investorFinder.outputPage;
				break;

			default:
				this.outputPageName = '';
				break;
		}

		if ( this._activatedRoute['_routerState'].snapshot.url.includes('workflow') ) {
			this.searchCompanyService.showStatsButton = false;
		} else {
			this.searchCompanyService.showStatsButton = true;
		}

		this.otherRelatedCompaniesDataColumn = [
			{ field: 'mainRelatedCompanyName', header: 'Related Company', width: '220px', textAlign: 'left', visible: true },
			{ field: 'companyName', header: 'Company Name', width: '420px', textAlign: 'left', visible: true },
			{ field: 'companyNumber', header: 'Company Number', width: '150px', textAlign: 'left', visible: true },
			{ field: 'preFixed_linkedDirector_Name', header: 'Director Name', width: '280px', textAlign: 'left', visible: true },
			{ field: 'companyStatus', header: 'Status', width: '120px', textAlign: 'center', visible: true },
			{ field: 'incorporationDate', header: 'Incorporation', width: '130px', textAlign: 'center', visible: true },
			{ field: 'netWorth_latest', header: 'Networth', width: '150px', textAlign: 'right', visible: true },
			{ field: 'estimated_turnover', header: 'Estimated Turnover', width: '150px', textAlign: 'right', visible: false },
			{ field: 'turnover_latest', header: 'Turnover', width: '150px', textAlign: 'right', visible: true },
			{ field: 'sic_code', header: 'Sic Code', width: '350px', textAlign: 'left', visible: true },
			{ field: 'industryTag', header: 'Industry', width: '250px', textAlign: 'left', visible: true },
			// { field: 'category', header: 'Company Type', width: '250px', textAlign: 'left', visible: true }
		];

		// this.pageInput(event)
		this.fetchDataForOtherRelatedCompanies()

	}	

	fetchDataForOtherRelatedCompanies() {

		this.sharedLoaderService.showLoader();
		let paylodForOtherRelatedCompanies = {
			pageName: this.outputPageName,
			pageSize: this.pageSizeValue ? this.pageSizeValue : 25,
			pageNumber: this.pageNumberValue ? this.pageNumberValue : 1,
			listId: this._activatedRoute.snapshot.queryParams['cListId']
		}

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_API', 'otherRelatedCompaniesAPI', paylodForOtherRelatedCompanies ).subscribe({
			next: ( res ) => {
				
				this.relatedCompaniesCount = res.body?.totalLength;
				this.otherRelatedCompaniesData = res.body.result?.relatedCompanies;

				if ( this.otherRelatedCompaniesData?.length ) {
					this.otherRelatedCompaniesData.map( relatedCompany => {

						relatedCompany['turnover_latest'] = relatedCompany?.turnover || '-';
						if ( relatedCompany?.estimated_turnover ) {
							relatedCompany['estimated_turnover'] = Number( relatedCompany?.estimated_turnover.toFixed(2) ) || '-';
						}
						relatedCompany['netWorth_latest'] = relatedCompany?.netWorth;
						relatedCompany['preFixed_linkedDirector_Name'] = relatedCompany?.linkedDirectorTile + ' ' + relatedCompany?.linkedDirector;
						
						delete relatedCompany?.turnover;
						delete relatedCompany?.netWorth;
					});
				}

				setTimeout(() => {
					this.sharedLoaderService.hideLoader();
				}, 100);

			},
			error: ( err ) => {
				setTimeout(() => {
					this.sharedLoaderService.hideLoader();
				}, 100);
				console.log(err);
			}
		})
	}

	// pageInput( event ){
	// 	this.pageSizeValue = event.first
	// 	this.pageNumberValue = event.pageCount
	// 	this.fetchDataForOtherRelatedCompanies()
	// }

	getTableDataValues(event){
		this.pageSizeValue = event.rows,
		this.pageNumberValue = event.page + 1,
		this.fetchDataForOtherRelatedCompanies()
		
	}

}