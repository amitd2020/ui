import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonServiceService, IScoreLables } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-list-of-companies',
	templateUrl: './list-of-companies.component.html',
	styleUrls: ['./list-of-companies.component.scss']
})
export class ListOfCompaniesComponent implements OnInit {

	listOfCompaniesTableCols: Array<any>;
	listOfCompaniesTableData: Array<any> = [];
	industryType: string;

    operatingTableElemnts: any;

	choosenCategory: string;
	choosenYear: string;
	pageNumber: number;
	pageSize: number;
	totalNoOfRecords: number;

	portfolioListId: string;

	iScoreLabelsEnum: any = IScoreLables;

	// For Company Deatils Side Panel
	showCompanySideDetails: boolean = false;
	companySideDetailsParams: any = { companyNumber: undefined, companyName: undefined };
	corporateSideOverviewData: object;
	overviewName: string;

	constructor(
		private userAuthService: UserAuthService,
		private commonService: CommonServiceService,
		private activatedRoute: ActivatedRoute,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunicate: ServerCommunicationService
	) {
		this.commonService.createNestedBreadcrumbs([
			{ label: 'List Of Companies', routerLink: ['/list-of-companies'] }
		]);
	}

	ngOnInit() {

		this.listOfCompaniesTableCols = [
			{ field: 'companyRegistrationNumber', header: 'Company Number', minWidth: '150px', maxWidth: '150px', textAlign: 'center' },
			{ field: 'businessName', header: 'Company Name', minWidth: '320px', maxWidth: '320px', textAlign: 'left' },
			{ field: 'companyRegistrationDate', header: 'Incorporation Date', minWidth: '150px', maxWidth: '150px', textAlign: 'center' }
		];

		if ( this.activatedRoute.queryParams['value']['category'] ) {
			this.industryType = this.activatedRoute.queryParams['value']['industryType'];
			this.choosenCategory = this.activatedRoute.queryParams['value']['category'];
			this.choosenYear = this.activatedRoute.queryParams['value']['year'];
			this.pageNumber = this.activatedRoute.queryParams['value']['pageNumber'];
			this.pageSize = this.activatedRoute.queryParams['value']['pageSize'];

			this.getListByIServiceCategory();

		}

		if (this.activatedRoute.queryParams['value']['cListId']) {
			this.portfolioListId = this.activatedRoute.queryParams['value']['cListId'];

			this.listOfCompaniesTableCols = [
				...this.listOfCompaniesTableCols,
				{ field: 'industryType', header: 'Industry', minWidth: '180px', maxWidth: '180px', textAlign: 'left' }
			];

			this.getListOfCompaniesInPortfolio();
		}

		this.listOfCompaniesTableCols = [
            ...this.listOfCompaniesTableCols,
            { field: 'IScore_ALL', header: 'Main Score', minWidth: '130px', maxWidth:'130px', textAlign: 'right' },
            { field: 'Irating_category', header: 'I Rating Category', minWidth: '150px', maxWidth:'150px', textAlign: 'left' },
            { field: 'PRETAX_PROFIT_PERCENTAGE', header: `${ this.iScoreLabelsEnum['Iscore1'] }`, minWidth: '140px', maxWidth:'140px', textAlign: 'right' },
            { field: 'CURRENT_RATIO', header: `${ this.iScoreLabelsEnum['Iscore2'] }`, minWidth: '140px', maxWidth:'140px', textAlign: 'right' },
            { field: 'SALES_PER_NET_WORKING_CAPITAL', header: `${ this.iScoreLabelsEnum['Iscore3'] }`, minWidth: '180px', maxWidth:'180px', textAlign: 'right' },
            { field: 'GEARING_RATIO', header: `${ this.iScoreLabelsEnum['Iscore4'] }`, minWidth: '130px', maxWidth:'130px', textAlign: 'right' },
            { field: 'EQUITY_RATIO', header: `${ this.iScoreLabelsEnum['Iscore5'] }`, minWidth: '130px', maxWidth:'130px', textAlign: 'right' },
            { field: 'CREDITOR_DAYS', header: `${ this.iScoreLabelsEnum['Iscore6'] }`, minWidth: '140px', maxWidth:'140px', textAlign: 'right' },
            { field: 'DEBTOR_DAYS', header: `${ this.iScoreLabelsEnum['Iscore7'] }`, minWidth: '130px', maxWidth:'130px', textAlign: 'right' },
            { field: 'LIQUIDITY_TEST', header: `${ this.iScoreLabelsEnum['Iscore8'] }`, minWidth: '150px', maxWidth:'150px', textAlign: 'right' },
            { field: 'RETURN_CAPITAL_EMPLOYED', header: `${ this.iScoreLabelsEnum['Iscore9'] }`, minWidth: '130px', maxWidth:'130px', textAlign: 'right' },
            { field: 'RETURN_TOTAL_ASSETS', header: `${ this.iScoreLabelsEnum['Iscore10'] }`, minWidth: '130px', maxWidth:'130px', textAlign: 'right' },
            { field: 'DEBT_EQUITY', header: `${ this.iScoreLabelsEnum['Iscore11'] }`, minWidth: '150px', maxWidth:'150px', textAlign: 'right' },
            { field: 'RETURN_EQUITY', header: `${ this.iScoreLabelsEnum['Iscore12'] }`, minWidth: '150px', maxWidth:'150px', textAlign: 'right' },
            { field: 'RETURN_NET_ASSETS', header: `${ this.iScoreLabelsEnum['Iscore13'] }`, minWidth: '150px', maxWidth:'150px', textAlign: 'right' },
            { field: 'TOTAL_DEBT_RATIO', header: `${ this.iScoreLabelsEnum['Iscore14'] }`, minWidth: '150px', maxWidth:'150px', textAlign: 'right' }
        ];
		
	}

	getUpdatesFromTable(event) {
		if (event) {

			if (this.activatedRoute.queryParams['value']['category']) {
				this.getListByIServiceCategory( typeof event != 'boolean' ? event : null );
			}

			if (this.activatedRoute.queryParams['value']['cListId']) {
				this.getListOfCompaniesInPortfolio( typeof event != 'boolean' ? event : null);
			}

		}
	}

	getListByIServiceCategory( inputObjFromTable? ) {

		let inputObj = [
			this.industryType,
			this.choosenCategory,
			this.choosenYear,
			( inputObjFromTable && inputObjFromTable.pageSize ) ? inputObjFromTable.pageSize : this.pageSize,
			( inputObjFromTable && inputObjFromTable.pageNumber ) ? inputObjFromTable.pageNumber : this.pageNumber
		];

		this.sharedLoaderService.showLoader();
		
		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_ISCORE', 'listByIserviceCategory', inputObj ).subscribe(res => {

			if (res.body['status'] == 200) {
				this.listOfCompaniesTableData = res.body['results'];
				this.totalNoOfRecords = res.body['totalCount'];
				this.sharedLoaderService.hideLoader();
			}

		});
	}

	getListOfCompaniesInPortfolio( objToSendForPageSizeNumber? ) {
		
		this.sharedLoaderService.showLoader();

		let reqobj = {
			listId: this.portfolioListId,
			pageSize: ( objToSendForPageSizeNumber && objToSendForPageSizeNumber.pageSize ) ? objToSendForPageSizeNumber.pageSize : 25,
			startAfter: ( objToSendForPageSizeNumber && objToSendForPageSizeNumber.pageNumber ) ? (objToSendForPageSizeNumber.pageNumber - 1 ) * ( objToSendForPageSizeNumber.pageSize ) : 0,
		}

		this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_ISCORE', 'portfolioListCompaniesLatestYearData', reqobj ).subscribe(res => {

			if (res.body['status'] == 200) {
				this.listOfCompaniesTableData = res.body['results'];
				this.totalNoOfRecords = res.body['total'];
			}
			
			this.sharedLoaderService.hideLoader();

		}, err => {
			this.sharedLoaderService.hideLoader();
		});
	}

	getOperatingTable( event ) {
		if ( event.requestFor === 'SidePanel' ) {
            this.showCompanySideDetailsPanel( event.compNumber, event.compName, event.rowData );
        } else {
            this.operatingTableElemnts = event;
        }
	}

    showCompanySideDetailsPanel( compNumber, compName, rowData ) {

		this.showCompanySideDetails = true;

		if ( rowData == undefined ) {
			this.companySideDetailsParams.companyNumber = compNumber;
			this.companySideDetailsParams.companyName = compName;
			this.overviewName = "companyOverview";
		}
		else if ( rowData != undefined ) {
			this.corporateSideOverviewData = rowData;
			this.overviewName = "corporateOverview";
		}

	}

	getShowCompanySideDetailsOutputBoolValue($event) {
		this.showCompanySideDetails = $event;
	}

}