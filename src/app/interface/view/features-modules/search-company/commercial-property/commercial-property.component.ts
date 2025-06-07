import { Component, OnInit } from '@angular/core';

import { corporateLand_data } from 'src/app/interface/models/subscription-model';
import { CanonicalURLService } from 'src/app/interface/service/canonical-url.service';
import { SeoService } from 'src/app/interface/service/seo.service';

import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { SearchCompanyService } from '../search-company.service';
import { ActivatedRoute } from '@angular/router';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { lastValueFrom, pluck } from 'rxjs';


@Component({
	selector: 'dg-commercial-property',
	templateUrl: './commercial-property.component.html'
})
export class CommercialPropertyComponent implements OnInit {

	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'

	selectedCorporateLandcols: Array<any>;
	corporateLandcols: any[];
	corporateLandData: corporateLand_data[];
	appliedFilters: any;
	// companyDetail: any;
	// recordTableCols: any;
	searchTotalCount: any;
	operatingTableElemnts: any;
	// isFilterSidebarShow: boolean = false;
	// subscribedPlanModal: any = subscribedPlan;

	showExportButton: boolean = true;
	showCompanySideDetails: boolean = false;
    defaultSearchData: Boolean = true;

	// For Company Deatils Side Panel
	companySideDetailsParams: any = { companyNumber: undefined, companyName: undefined };
	corporateSideOverviewData: object;
	overviewName: string;
	payloadForChildApi: PayloadFormationObj;
	constantMessages: any = UserInteractionMessages;
	msgs: any[];
	shareId: any;

	constructor(
		private seoService: SeoService,
		private canonicalService: CanonicalURLService,
		private globalServerCommunication: ServerCommunicationService,
		public searchCompanyService: SearchCompanyService,
		private sharedLoaderService: SharedLoaderService,
		private activeRoute: ActivatedRoute,
	) { }

	async ngOnInit() {
		if ( this.activeRoute['_futureSnapshot']['queryParams'].chipData?.length ) {
			this.defaultSearchData = false;
		}
		this.searchCompanyService.resetPayload();
        this.searchCompanyService.resetFilterData();
		// this.searchCompanyService.updatePayload( { filterData: [] } );

		this.corporateLandcols = [
			{ field: 'companyno_1', header: 'Company No.1', colunName: 'Company No.1', width: '130px', textAlign: 'left', value: true, isSortable: true },
			{ field: 'Proprietor_Name_1', header: 'Company Name', colunName: 'Company Name', width: '450px', textAlign: 'left', value: true, isSortable: true },
			{ field: 'Title_Number', header: 'Title Number', colunName: 'Title Number', width: '130px', textAlign: 'right', value: true, isSortable: true },
			{ field: 'Price_Paid', header: 'Price Paid', colunName: 'Price Paid', width: '150px', textAlign: 'right', value: true, isSortable: false },
			{ field: 'Tenure', header: 'Tenure', colunName: 'Tenure', width: '140px', textAlign: 'left', value: true, isSortable: true },
			{ field: 'Date_Proprietor_Added', header: 'Proprietor Added On', colunName: 'Proprietor Added On', width: '180px', textAlign: 'center', value: true, isSortable: false },
			{ field: 'Property_Address', header: 'Property Address', colunName: 'Property Address', width: '500px', textAlign: 'left', value: true, isSortable: false },
			{ field: 'Postcode', header: 'Post Code', colunName: 'Post Code', width: '130px', textAlign: 'left', value: true, isSortable: true },
			{ field: 'Region', header: 'Region', colunName: 'Region', width: '200px', textAlign: 'left', value: true, isSortable: true },
			{ field: 'District', header: 'District', colunName: 'District', width: '190px', textAlign: 'left', value: true, isSortable: true },
			{ field: 'County', header: 'County', colunName: 'County', width: '190px', textAlign: 'left', value: true, isSortable: true },
			{ field: 'companyno_2', header: 'Company No.2', colunName: 'Company No.2', width: '130px', textAlign: 'left', value: true, isSortable: true },
			{ field: 'companyno_3', header: 'Company No.3', colunName: 'Company No.3', width: '130px', textAlign: 'left', value: true, isSortable: true },
			{ field: 'companyno_4', header: 'Company No.4', colunName: 'Company No.4', width: '130px', textAlign: 'left', value: true, isSortable: true }
		];
		
		this.searchCompanyService.$apiPayloadBody.subscribe( res => {
            this.payloadForChildApi = res;
        });

		const { shareId } = this.activeRoute.snapshot?.queryParams;
		if( shareId ){
			let param = [ 
				{ key:'shareId', value: shareId }
			];
			const CompanyDetailAPIResponse = await lastValueFrom(this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getSharedCriteriaInfo', undefined, undefined, param ) )

			if ( CompanyDetailAPIResponse.body.status = 200 ) {
				this.defaultSearchData = false;
				this.searchCompanyService.updatePayload( { filterData: CompanyDetailAPIResponse.body.result.criteria  } );
				this.searchCompanyService.updateFilterPanelApplyButtons();
				this.getLandCorporateSearchResultsApiCall();
			}
		} else {
			this.searchCompanyService.updatePayload( { filterData: [] } );
		}

		const { chipData } = JSON.parse( JSON.stringify( this.activeRoute.snapshot.queryParams ) );

		if ( chipData ) {
			this.searchCompanyService.updatePayload( { filterData: JSON.parse( chipData ) } );
			this.getLandCorporateSearchResultsApiCall();
		}

		this.initBreadcrumbAndSeoMetaTags();
		
		
 		if( this.activeRoute.snapshot.queryParams.shareId ){

			 this.getLandCorporateSearchResultsApiCall();
		}
	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems(
		// 	[	
		// 		{ label: "Property Register", routerLink: ['company-search/property-register'] }
		// 	]
		// );
		this.title = "Property Register Search by Advanced Filters - DataGardener";
		this.description = "Our Corporate Land Search filter allows to find land Name/Number, Price Property Address, Region, PostCode, District, County, and Tenure.";
		this.canonicalService.setCanonicalURL();
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
		// this.seoService.setkeywords( this.keywords );
		// this.seoService.setRobots (this.robots );
	
	}

	getOperatingTable(event) {
		if ( event.requestFor === 'SidePanel' ) {
            this.showCompanySideDetailsPanel( event.compNumber, event.compName, event.rowData );
        } else {
            this.operatingTableElemnts = event;
        }
	}

	getLandCorporateSearchResultsApiCall(){

		this.sharedLoaderService.showLoader();
		
		const { chipData } = JSON.parse(JSON.stringify( this.activeRoute.snapshot.queryParams ) );

		if(this.activeRoute.snapshot.queryParams['chipData']){
			this.searchCompanyService.updatePayload( { filterData: JSON.parse( chipData ) } );
		}

		this.globalServerCommunication.globalServerRequestCall('post', 'DG_LAND_CORPORATE', 'getLandCorporateSearchResults', this.payloadForChildApi ).subscribe( res => {
			
			this.corporateLandData = [];
			
			if ( res.body.status == 200 ) {

                let dataArray = [];

                this.searchTotalCount = res.body.results?.total.value;

				this.msgs = [];
                this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['recordsFetched'] });
                setTimeout(() => {
                    this.msgs = [];
                }, 2000);

                for ( let resultData of res.body.results.hits )  {
                    dataArray.push( resultData._source );
                }
                
                if ( dataArray.length == res.body.results.hits.length ) {
					
					
					this.corporateLandData = dataArray;

					for (let i = 0; i < this.corporateLandData.length; i++) {
							this.corporateLandData[i]['companyno_1'] = this.corporateLandData[i]['Company_Registration_No_1'];
							this.corporateLandData[i]['companyno_2'] = this.corporateLandData[i]['Company_Registration_No_2'];
							this.corporateLandData[i]['companyno_3'] = this.corporateLandData[i]['Company_Registration_No_3'];
							this.corporateLandData[i]['companyno_4'] = this.corporateLandData[i]['Company_Registration_No_4'];
					}

                }

            }

			if ( this.corporateLandData.length === 0 ) {
				this.showExportButton = true;
			} else {
				this.showExportButton = false;
			}

			this.sharedLoaderService.hideLoader();
			

		},)

	}

	getTableDataValues(event) {
        this.defaultSearchData = false;
		this.getLandCorporateSearchResultsApiCall();
		// this.corporateLandData = event.searchResult;
		// this.appliedFilters = event.appliedFilters;

		// if (this.corporateLandData?.length === 0) {
		// 	this.showExportButton = true;
		// 	this.sampleLrmPdf = true;
		// } else {
		// 	this.showExportButton = false;
		// 	this.sampleLrmPdf = false;
		// }
		// for (let i = 0; i < this.corporateLandData?.length; i++) {
		// 	this.corporateLandData[i]['companyno_1'] = this.corporateLandData[i]['Company_Registration_No_1'];
		// 	this.corporateLandData[i]['companyno_2'] = this.corporateLandData[i]['Company_Registration_No_2'];
		// 	this.corporateLandData[i]['companyno_3'] = this.corporateLandData[i]['Company_Registration_No_3'];
		// 	this.corporateLandData[i]['companyno_4'] = this.corporateLandData[i]['Company_Registration_No_4'];
		// }

		// this.recordListComponent.resetFilters(this.operatingTableElemnts.recordListTable);
		// if (this.operatingTableElemnts.recordListPaginator) {
		// 	this.operatingTableElemnts.recordListPaginator.first = 0;
		// }
	}

	/*
	getTotalCount(event) {

		this.searchTotalCount = event;
	}
	*/

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
