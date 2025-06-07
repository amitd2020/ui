import { Component, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { CanonicalURLService } from 'src/app/interface/service/canonical-url.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ActivatedRoute } from '@angular/router';
import { SearchCompanyService } from '../search-company.service';
import { SearchFiltersService } from 'src/app/interface/service/search-filter.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { lastValueFrom } from 'rxjs';

@Component({
	selector: 'dg-residential-property',
	templateUrl: './residential-property.component.html'
})
export class ResidentialPropertyComponent implements OnInit {

	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'

	// operatingTableElemnts: any;
	// appliedFilters: any;
	searchTotalCount: any;
	landRegistryTableCols: any[];
    defaultSearchData: Boolean = true;

	// selectedColumns: Array<any>;
	companyData: Array<any>;

	showExportButton: boolean = true;
	// isFilterSidebarShow: boolean = false;
	// subscribedPlanModal: any = subscribedPlan;

	payloadForChildApi: PayloadFormationObj;
	constantMessages: any = UserInteractionMessages;
	msgs: any[];

	constructor(
		private seoService: SeoService,
		private TitleCasePipe: TitleCasePipe,
		private canonicalService: CanonicalURLService,
		private activeRoute: ActivatedRoute,
		public searchCompanyService: SearchCompanyService,
		public searchFiltersService: SearchFiltersService,
		private globalServerCommunication: ServerCommunicationService,
		private sharedLoaderService: SharedLoaderService
	) {
		// this.breadcrumbService.setItems([
		// 	{ label: 'Residential Property' }
		// ]);
		this.title = "Residential Property Search by Advanced Filters - DataGardener";
		this.description = "Our Residential Property Search filter allows to find Registry by building Name/Number, property type, land tenure and town or city.";
		this.canonicalService.setCanonicalURL();
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
		// this.seoService.setkeywords( this.keywords );
		// this.seoService.setRobots (this.robots );
	}

	async ngOnInit() {

		if ( this.activeRoute['_futureSnapshot']['queryParams'].chipData?.length ) {
			this.defaultSearchData = false;
		}

		this.searchCompanyService.resetPayload();
        this.searchCompanyService.resetFilterData();

		this.landRegistryTableCols = [
			{ field: "propertyType", header: "Property Type", colunName: "Property Type", width: "160px", textAlign: "left", value: true, isSortable: true },
			{ field: "duration", header: "Land Tenure", colunName: "Land Tenure", width: "150px", textAlign: "left", value: true, isSortable: true },
			{ field: "price", header: "Price", colunName: "Price", width: "150px", textAlign: "right", value: true, isSortable: true },
			{ field: "oldOrNew", header: "Build Type", colunName: "Build Type", width: "170px", textAlign: "left", value: true, isSortable: true },
			{ field: "paon", header: "Building Name or Number", colunName: "Building Name or Number", width: "150px", textAlign: "left", value: true, isSortable: false },
			{ field: "saon", header: "Secondary Name ", colunName: "Secondary Name ", width: "170px", textAlign: "left", value: true, isSortable: true },
			{ field: "transferDate", header: "Date", colunName: "Date", width: "170px", textAlign: "center", value: true, isSortable: false },
			{ field: "street", header: "Street", colunName: "Street", width: "170px", textAlign: "left", value: true, isSortable: true },
			{ field: "locality", header: "Locality", colunName: "Locality", width: "170px", textAlign: "left", value: true, isSortable: true },
			{ field: "townOrCity", header: "Town or City", colunName: "Town or City", width: "150px", textAlign: "left", value: true, isSortable: true },
			{ field: "district", header: "District", colunName: "District", width: "170px", textAlign: "left", value: true, isSortable: true },
			{ field: "county", header: "County", colunName: "County", width: "170px", textAlign: "left", value: true, isSortable: true },
			{ field: "postcode", header: "Post Code", colunName: "Post Code", width: "150px", textAlign: "left", value: true, isSortable: true },
			{ field: "Address", header: "Address", colunName: "Address", width: "400px", textAlign: "left", value: true, isSortable: false }
		];
		// this.searchCompanyService.updatePayload( { filterData: [] } );
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
				this.getLandSearchResultsApiCall();
				this.searchCompanyService.updateFilterPanelApplyButtons();
			}
		} else {
			this.searchCompanyService.updatePayload( { filterData: [] } );
		}


		/*
		if ( this.userRoleAndFeatureAuthService.checkUserHasFeatureAccess( 'Global Filter' ) || this.userRoleAndFeatureAuthService.isAdmin() )  {
            this.isFilterSidebarShow = true;
        }
		*/

		const { chipData } = JSON.parse(JSON.stringify( this.activeRoute.snapshot.queryParams ) );

		if ( chipData ) {
			this.searchCompanyService.updatePayload( { filterData: JSON.parse( chipData ) } );
			this.getLandSearchResultsApiCall();
		}

		// this.getLandSearchResultsApiCall();

		// this.getResidentialPropertyCount();

	}

	/*
	getOperatingTable(event) {
		this.operatingTableElemnts = event;
	}
	*/

	getLandSearchResultsApiCall() {
		this.sharedLoaderService.showLoader();
		const { chipData } = JSON.parse(JSON.stringify( this.activeRoute.snapshot.queryParams ) );
		if(this.activeRoute.snapshot.queryParams['chipData']){
			this.searchCompanyService.updatePayload( { filterData: JSON.parse( chipData ) } );
		}
		
		this.globalServerCommunication.globalServerRequestCall('post', 'DG_LAND_REGISTRY', 'getLandSearchResults', this.payloadForChildApi ).subscribe( res => {

			this.companyData = [];
			this.searchTotalCount = ''
			
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

					this.companyData = dataArray;

					for (let i = 0; i < this.companyData?.length; i++) {
						this.companyData[i]['Address'] = this.TitleCasePipe.transform((this.companyData[i]["paon"] || '') + ' ' + (this.companyData[i]["street"] || '') + ' ' + (this.companyData[i]["locality"] || '' ) + ' ') + (this.companyData[i]["postcode"] || '').toUpperCase();		
					}

                }

            }

			if ( this.companyData.length === 0 ) {
				this.showExportButton = true;
			} else {
				this.showExportButton = false;
			}

			this.sharedLoaderService.hideLoader();

		})
	}

	getTableDataValues(event) {

        this.defaultSearchData = false;
		this.getLandSearchResultsApiCall();

		/*
		this.companyData = event.searchResult;
		this.appliedFilters = this.payloadForChildApi.filterData;

		if (this.companyData.length === 0) {
			this.showExportButton = true;
		} else {
			this.showExportButton = false;
		}
		for (let i = 0; i < this.companyData.length; i++) {
			this.companyData[i]['Address'] = this.TitleCasePipe.transform(this.companyData[i]["Building_Name_No"] + ' ' + this.companyData[i]["Street"] + ' ' + this.companyData[i]["Locality"] + ' ') + this.companyData[i]["PostCode"].toUpperCase();
			if (this.companyData[i].NewBuild == "n") {
				this.companyData[i].NewBuild = "Old Build"
			} else {
				this.companyData[i].NewBuild = "New Build"
			}

			if (this.companyData[i].EstateType == "f") {
				this.companyData[i].EstateType = "Freehold"
			} else {
				this.companyData[i].EstateType = "Leasehold"
			}

			if (this.companyData[i].PropertyType == "d") {
				this.companyData[i].PropertyType = "Detached"
			}
			else if (this.companyData[i].PropertyType == "s") {
				this.companyData[i].PropertyType = "Semi-detached"
			}
			else if (this.companyData[i].PropertyType == "f") {
				this.companyData[i].PropertyType = "Flat/maisonitte"
			}
			else if (this.companyData[i].PropertyType == "t") {
				this.companyData[i].PropertyType = "Terraced"
			} else {
				this.companyData[i].PropertyType = "Other"
			}

		}

		this.recordListComponent.resetFilters(this.operatingTableElemnts.recordListTable);
		if (this.operatingTableElemnts.recordListPaginator) {
			this.operatingTableElemnts.recordListPaginator.first = 0;
		}
		*/
	}

	/*
	getTotalCount(event) {
		this.searchTotalCount = event;
	}

	getResidentialPropertyCount() {

		let tempSelectedPropValues = [], obj;
		for ( let propVal of this.payloadForChildApi.filterData ) {
			if (propVal.chip_group == 'Price') {
				// tempSelectedPropValues.push( this.tempLandCostValueChipObject[ propVal.chip_group ]);
			} else {
				tempSelectedPropValues.push(propVal);
			}
		}

		this.appliedFilters = this.payloadForChildApi.filterData;

		obj['filterSearch'] = this.appliedFilters;
		obj['filterSearchType'] = "Land Registry";

		this.searchFiltersService.getLandRegFilteredResults(tempSelectedPropValues, this.startPlan).then(data => {
			// this.progressSpinner = false;
			if ( data.status == 200 ) {
				
				// this.totalFoundResultsCount = data.results.total.value;
				for (let resultData of data.results.hits) {
					dataArray.push(resultData._source);
				}
				if (dataArray.length == data.results.hits.length) {
					this.filteredResultsValues = dataArray;
					this.applySelectedFilters();
				}
				
			} else {
				this.filteredResultsValues = data.results;
				this.applySelectedFilters();
				this.sharedLoaderService.hideLoader();
			}
			
		});

		setTimeout(() => {						
			this.sharedLoaderService.hideLoader();
		}, 500);
			

	}
	*/

}
