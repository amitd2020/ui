import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { SearchCompanyService } from '../../search-company/search-company.service';
import { Location } from '@angular/common';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';
import { lastValueFrom, pluck } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
@Component({
  selector: 'dg-charges-description',
  templateUrl: './charges-description.component.html',
  styleUrls: ['./charges-description.component.scss']
})

export class ChargesDescriptionComponent implements OnInit, OnDestroy, AfterViewInit {

	inputValue: string = '';
	userDetails: Partial< UserInfoType > = {};
	
	chargesDescriptionData: Array<any> = [];
	first: number = 0;
	rows: number = 25;
	totalDataValue: number = 0 ;
	totalSearchedDataValue: number = 0 ;
	resetAppliedFiltersBoolean: boolean = false;
	visibleFilterSidebar: boolean = false;
	reInitTableDataValuesForReset: boolean = true;
	selectedPropValues: Array<any> = [];
	payloadForChildApi;
	errorMessageWhileNoSearchString = [];
	addAlltoListSucess = [];
	title: string = '';
	description: string = '';
	checkInputValue: string = '';
	saveListId: string = '';
	listName: string = '';
	apiPayloadObject: object={};
	saveUpdateExisting: any;
	selectedCompany: Array<any> = [];
	chargesDescriptionColumn: Array<any> = [
		{ field: 'companyRegistrationNumber', header: 'Company Number', minWidth: '120px', maxWidth: '120px', textAlign: 'left' },
		{ field: 'businessName', header: 'Company Name', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
		{ field: 'mortgagePersonEntitled', header: 'Person Entitled', textAlign: 'left', minWidth: '200px', maxWidth: '200px', visible: true },
		{ field: 'snapshot', header: 'Snapshot', minWidth: '160px', maxWidth: '300px', textAlign: 'left' },
	];

	constructor(
		private userAuthService: UserAuthService,
		public globalServerCommunication: ServerCommunicationService,
		private commonService: CommonServiceService,
		private app: AppComponent,
		private sharedLoaderService: SharedLoaderService,
		private seoService: SeoService,
        private router: Router,
		private activeRoute: ActivatedRoute,
		public searchCompanyService: SearchCompanyService,
		private location: Location,
		private layoutService: LayoutService
	) {
		if ( !this.userAuthService.hasRolePermission( ['Super Admin'] ) && !this.userAuthService.hasAddOnPermission('chargesDescription') ) {
            this.router.navigate(['/']);
        }
	}

	async ngOnInit() {
		this.userDetails = this.userAuthService?.getUserInfo();
		this.saveUpdateExisting = {
			existingSaveFiltersName: this.activeRoute.snapshot.queryParams['saveFiltersName'],
			existingSaveFiltersId: this.activeRoute.snapshot.queryParams['saveFiltersId']
		}

		this.saveListId = this.activeRoute.snapshot.queryParams['cListId']
		this.listName = this.activeRoute.snapshot.queryParams['listName']
		// this.searchCompanyService.updatePayload( { filterData: [] } );

		const { shareId } = this.activeRoute.snapshot?.queryParams;
		if( shareId ){
			let param = [ 
				{ key:'shareId', value: shareId }
			];
			const CompanyDetailAPIResponse = await lastValueFrom(this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getSharedCriteriaInfo', undefined, undefined, param ) )

			if ( CompanyDetailAPIResponse.body.status = 200 ) {
				this.searchCompanyService.updatePayload( { filterData: CompanyDetailAPIResponse.body.result.criteria  } );
				this.searchCompanyService.updateFilterPanelApplyButtons();
			}
		} else if( this.saveListId){
			this.searchCompanyService.updatePayload( { filterData: [ { chip_group: 'Saved Lists', chip_values: [ this.listName ] } ] } );              
		} else {
			this.searchCompanyService.updatePayload( { filterData: [] } );
		}

		this.searchCompanyService.$apiPayloadBody.subscribe( res => {
            this.payloadForChildApi = res;
        });
		this.initBreadcrumbAndSeoMetaTags()
		const { chipData } = JSON.parse(JSON.stringify( this.activeRoute.snapshot.queryParams ) );
		if ( chipData ) {
			this.searchCompanyService.updatePayload( { filterData: JSON.parse( chipData ) } );
		}
		this.visibleFilterSidebar = true;
		this.getDataForChargesDescriptionSearch();
	}

	ngAfterViewInit() {
	}

	ngOnDestroy() {
		// this.app.inputStyle = 'filled';	
		this.layoutService.config.inputStyle = 'outlined';		
	}

	initBreadcrumbAndSeoMetaTags() {
		// this.breadcrumbService.setItems([ { label: 'Charges Description' } ]);
		this.title = "DataGardener Charges Description - Find any Charges Description ";
		this.description = "Get in-depth analytics of Your searched keywords records.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setMetaTitle(this.title);
		this.seoService.setDescription(this.description);
	}

	getDataForChargesDescriptionSearch() {
		let endpoint = 'chargesDescriptionSearch',
			route = 'DG_API'
		this.sharedLoaderService.showLoader();
		let searchString = this.payloadForChildApi.filterData.filter( ({chip_group}) => chip_group == 'Search By Keyword' )
		let searchStringValue = searchString?.length ? searchString[0]['chip_values'] : '';
		this.inputValue = searchStringValue?.toString();
		let savedListCheck = this.payloadForChildApi.filterData.find(val => val.chip_group == 'Saved Lists');
		if( savedListCheck ) {
			this.searchCompanyService.updatePayload( { listId: this.saveListId, pageName: 'chargesDescription' } );
			this.apiPayloadObject['listId'] = this.saveListId,
			this.apiPayloadObject['pageName'] = 'chargesDescription'
			endpoint = 'getCompaniesInListTableData',
			route = 'DG_LIST'
		}
			
		this.apiPayloadObject['filterData'] = this.payloadForChildApi.filterData
		this.apiPayloadObject['skip'] = this.first ? this.first : 0
		this.apiPayloadObject['limit'] = this.rows ? this.rows : 25
		this.apiPayloadObject['reqBy'] = "chargesDescription"
		// if(searchString?.length){
		// 	this.apiPayloadObject['exclude'] = searchString?.length ? searchString[0]['exclude'] : false
		// }

		this.globalServerCommunication.globalServerRequestCall( 'post', route, endpoint, this.apiPayloadObject )
			.pipe(
				map( val => val.body ),
				map( ({ data, total, totalSearched }) => {
					let rawData = [];
					for ( let dataObj of data ){
						let tempObj = {
							companyRegistrationNumber: dataObj['_source']['companyRegistrationNumber'],
							businessName: dataObj['_source']['businessName'],
							snapshot: dataObj && dataObj.highlight && dataObj.highlight["mortgagesObj.mortgageDetails.description"] && dataObj.highlight["mortgagesObj.mortgageDetails.description"].length ? dataObj.highlight["mortgagesObj.mortgageDetails.description"].join(' ') : "",
							mortgagePersonEntitled: this.extractPersonEntitled( dataObj['_source']['mortgagesObj'] ),
						};
						
						rawData.push( tempObj );
					}
					this.totalDataValue = total;
					this.totalSearchedDataValue =  totalSearched;

					return rawData;
				})
			)
			.subscribe({
			next: ( res ) => {
				this.chargesDescriptionData = res;
				this.sharedLoaderService.hideLoader();

			},
			error: ( err ) => {
				console.log(err);
				this.sharedLoaderService.hideLoader();
			}
		})
		if ( this.activeRoute.snapshot.queryParams['chipData'] ) {
			this.location.replaceState('/insights/charges-description');
			this.activeRoute.snapshot.queryParams = {};
		}
	}

	pageChange( event ) {	

		this.first = event.first;
		this.rows = event.rows;
		this.getDataForChargesDescriptionSearch();
	}

	triggredKeywordSearch() {
		
		if ( this.inputValue ) {
			this.checkInputValue = this.inputValue;
			this.getDataForChargesDescriptionSearch();
		}
	}

	getMessage( e ){
		this.addAlltoListSucess = [];
		this.addAlltoListSucess.push({ severity: 'success', summary: e.msgs });
		setTimeout(() => {
			this.addAlltoListSucess = [];
		}, 2000);

		this.selectedCompany = [];
	}

	highlightMatchedWords(realStr, toFindStr) {
		toFindStr = toFindStr?.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').split(' ');		
		return realStr.replace(new RegExp(toFindStr?.join('|'), 'gi'), (match) => `<b class='bg-yellow-300'>${match}</b>`);
   	}

	formatCompanyNameForUrl(companyName) {
        return this.commonService.formatCompanyNameForUrl( companyName );
	}

	extractPersonEntitled( mortgageArray ) {
		let personEntitledDataArray = [];

		for ( let mortgage of mortgageArray ) {

			const { mortgageDetails } = mortgage;
			let filteredMortgage = mortgageDetails.filter( item => item.recordType == 'persons entitled' );

			personEntitledDataArray.push( filteredMortgage.length ? filteredMortgage[0] : [] );

		}

		return personEntitledDataArray;
	}

	chargesDescriptionCommunicator( event ) {
		this.first = 0,
		this.rows = 25,
		this.reInitTableDataValuesForReset = false;
		this.selectedPropValues = event.appliedFilters;
		this.getDataForChargesDescriptionSearch();
	}

}
