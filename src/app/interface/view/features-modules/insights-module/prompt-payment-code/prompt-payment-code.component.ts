import { Component, OnInit } from '@angular/core';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';

@Component({
	selector: 'dg-prompt-payment-code',
	templateUrl: './prompt-payment-code.component.html',
	styleUrls: ['./prompt-payment-code.component.scss']
})

export class PromptPaymentCodeComponent implements OnInit {

	totalCount: number;
	ppcDataColumn: Array<any> = [];
	ppcData: Array<any> = [];
	skip: 0;
	limit: 25;
	sort: [];
	filterSearchArray: []
	companySideDetailsParams: any = { companyNumber: undefined, companyName: undefined, tabNameToBeActive: '' };
	overviewName: string;
	showCompanySideDetails: boolean = false;
	corporateSideOverviewData: object;

	constructor(
		private globalServerCommunication: ServerCommunicationService,
		private sharedLoaderService: SharedLoaderService
	) { }

	ngOnInit() {

		this.ppcDataColumn = [
			{ field: 'companyName', header: 'Company Name', minWidth: '270px', maxWidth: 'none', textAlign: 'left', value: true },
			{ field: 'companyRegistrationNumber', header: 'Company No.', minWidth: '130px', maxWidth: '130px', textAlign: 'left', value: true },
			// { field: 'company_name', header: 'Company PPC Name', minWidth: '270px', maxWidth: 'none', textAlign: 'left', value: true },
			{ field: 'ceo', header: 'CEO', minWidth: '170px', maxWidth: '170px', textAlign: 'left', value: true },
			{ field: 'finance_director', header: 'Finance Director', minWidth: '150px', maxWidth: '150px', textAlign: 'left', value: true },
			{ field: 'industry_sector', header: 'Industry Sector', minWidth: '180px', maxWidth: '180px', textAlign: 'left', value: true },
			{ field: 'application_date', header: 'Application Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center', value: true },
			{ field: 'address', header: 'Address', minWidth: '180px', maxWidth: 'none', textAlign: 'left', value: true },
			{ field: 'area', header: 'Area', minWidth: '130px', maxWidth: '130px', textAlign: 'left', value: true },
			{ field: 'email_address', header: 'Email Address', minWidth: '220px', maxWidth: '220px', textAlign: 'left', value: true },
			{ field: 'telephone_number', header: 'Telephone', minWidth: '140px', maxWidth: '140px', textAlign: 'left', value: true }
		];

		this.getResultsForPPC();

	}

	getResultsForPPC() {
		this.sharedLoaderService.showLoader();
		let obj = {
			limit: this.limit ? this.limit : 25,
			skip: this.skip ? this.skip : 0,
			sort: this.sort ? this.sort : [],
			filterSearchArray: this.filterSearchArray ? this.filterSearchArray : []
		}
		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_CHART_API', 'getPpcCompaniesData', obj ).subscribe( res => {
			if ( res.body.status == 200 ) {
				this.sharedLoaderService.hideLoader();
				this.ppcData = res.body.tags;
				this.totalCount = res.body.total;
			}

		});
	}

	updateTableAfterPagination( event ) {

		this.skip = event.startAfter ? event.startAfter : 0;
		this.limit = event.pageSize ? event.pageSize : 25;
		this.sort = event.sortOn ? event.sortOn : [];
		this.filterSearchArray = event.filterSearchArray ? event.filterSearchArray : [];

		this.getResultsForPPC();
	}

	sidebarPanel( event ) {
		const { compNumber, compName } = event;
		// { requestFor: 'SidePanel', compNumber: compNumber, compName: compName, rowData: rowData, tabRoute: tabRoute }
		// { requestFor: 'SidePanel', compNumber: compNumber, compName: compName, rowData: rowData, tabRoute: tabRoute }
		if ( compNumber && compName ) {
			this.showCompanySideDetailsPanel( event.compNumber, event.compName, event?.rowData );
		}
	}

	showCompanySideDetailsPanel( compNumber, compName, rowData?, tabRoute? ) {

		this.showCompanySideDetails = true;

		if ( rowData == undefined ) {
			this.companySideDetailsParams.companyNumber = compNumber;
			this.companySideDetailsParams.companyName = compName;
			this.overviewName = "companyOverview";


		} else if ( rowData != undefined ) {
			this.corporateSideOverviewData = rowData;
			this.overviewName = "corporateOverview";
		}

		if ( tabRoute ) {
			this.companySideDetailsParams.tabNameToBeActive = tabRoute;
		}

	}

}