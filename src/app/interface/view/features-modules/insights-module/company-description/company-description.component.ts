import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchCompanyService } from '../../search-company/search-company.service';
import { Location } from '@angular/common';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';
import { lastValueFrom, pluck } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
	selector: 'dg-company-description',
	templateUrl: './company-description.component.html',
	styleUrls: ['./company-description.component.scss']
})

export class CompanyDescriptionComponent implements OnInit, OnDestroy, AfterViewInit {

	inputValue: string = '';
	companyDescriptionData: Array<any> = [];
	selectedCompany: Array<any> = [];
	first: number = 0;
	rows: number = 25;
	totalDataValue: number = 0 ;
	totalCount: number = 0 ;
	totalSearchedDataValue: number = 0 ;
	userDetails: Partial< UserInfoType > = {};

	errorMessageWhileNoSearchString = [];
	addAlltoListSucess = [];
	title: string = '';
	description: string = '';
	checkInputValue: string = '';
	resetAppliedFiltersBoolean: boolean = false;
	visibleFilterSidebar: boolean = false;
	reInitTableDataValuesForReset: boolean = true;
	selectedPropValues: Array<any> = [];
	payloadForChildApi;
	apiPayloadObject: any;
	saveUpdateExisting: any
	companyDescriptionColumn: Array<any> = [
		{ field: 'companyRegistrationNumber', header: 'Company Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
		{ field: 'companyName', header: 'Company Name', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
		{ field: 'snapshot', header: 'Snapshot', minWidth: '160px', maxWidth: 'none', textAlign: 'left' }
	];


	constructor(
		private userAuthService: UserAuthService,
		private globalServerCommunication: ServerCommunicationService,
		private commonService: CommonServiceService,
		private app: AppComponent,
		private sharedLoaderService: SharedLoaderService,
		private seoService: SeoService,
        private router: Router,
		private activeRoute: ActivatedRoute,
		private searchCompanyService: SearchCompanyService,
		private location: Location,
		private layoutService: LayoutService
	) {
		if ( !this.userAuthService.hasRolePermission( ['Super Admin'] ) && !this.userAuthService.hasAddOnPermission('companyDescription') ) {
            this.router.navigate(['/']);
        }
	}

	async ngOnInit() {
		this.userDetails = this.userAuthService?.getUserInfo();
		this.saveUpdateExisting = {
			existingSaveFiltersName: this.activeRoute.snapshot.queryParams['saveFiltersName'],
			existingSaveFiltersId: this.activeRoute.snapshot.queryParams['saveFiltersId']
		}
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
		} else {
			this.searchCompanyService.updatePayload( { filterData: [] } );
		}

		this.searchCompanyService.$apiPayloadBody.subscribe( res => {
            this.payloadForChildApi = res;
			// const data = this.payloadForChildApi?.filterData?.filter( val => val.chip_group != 'Status' );
			// if ( data.length ){
			// 	this.getDataForCompanyDescriptionSearch();
			// }
			
        });
		this.initBreadcrumbAndSeoMetaTags()
		const { chipData } = JSON.parse(JSON.stringify( this.activeRoute.snapshot.queryParams ) );
		if ( chipData ) {
			this.searchCompanyService.updatePayload( { filterData: JSON.parse( chipData ) } );
		}
		this.visibleFilterSidebar = true;
		this.getDataForCompanyDescriptionSearch();
	}

	ngAfterViewInit() {
	}

	ngOnDestroy() {
		// this.app.inputStyle = 'filled';	
		this.layoutService.config.inputStyle = 'outlined';	
	}

	initBreadcrumbAndSeoMetaTags() {
		// this.breadcrumbService.setItems([ { label: 'Company Description' } ]);
		this.title = "DataGardener Company Description - Find any Company Description ";
		this.description = "Get in-depth analytics of Your searched keywords records.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setMetaTitle(this.title);
		this.seoService.setDescription(this.description);
	}

	async getDataForCompanyDescriptionSearch() {
		this.sharedLoaderService.showLoader();
		let searchString = this.payloadForChildApi.filterData.filter( ({chip_group}) => chip_group == 'Search By Keyword' )
			let searchStringValue = searchString?.length ? searchString[0]['chip_values'] : '';
			this.inputValue = searchStringValue.toString()

			this.apiPayloadObject = {
			filterData: this.payloadForChildApi.filterData,
			skip: this.first ? this.first : 0,
			limit: this.rows ? this.rows : 25,
			reqBy: "companyDescription"
			}
			// if(searchString?.length){
			// 	this.apiPayloadObject['exclude'] = searchString?.length ? searchString[0]['exclude'] : false
			// }

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_API' , 'companiesData' , this.apiPayloadObject )
			.pipe(
				map( val => val.body ),
				map( ({ data, total, totalSearched }) => {
					let rawData = [];
					for ( let dataObj of data ){
						let tempObj = {
							companyRegistrationNumber: dataObj['_source']['companyRegistrationNumber'],
							companyName: dataObj['_source']['companyName'],
							snapshot: dataObj && dataObj.highlight && dataObj.highlight["companyAboutUs"] && dataObj.highlight["companyAboutUs"].length ? dataObj.highlight["companyAboutUs"].join(' ') : ""
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
				this.companyDescriptionData = res;
				this.sharedLoaderService.hideLoader();

			},
			error: ( err ) => {
				console.log(err);
				this.sharedLoaderService.hideLoader();
			}
		})
		if ( this.activeRoute.snapshot.queryParams['chipData'] ) {
			this.location.replaceState('/insights/company-description');
			this.activeRoute.snapshot.queryParams = {};
		}

	}

	pageChange( event ) {	

		this.first = event.first;
		this.rows = event.rows;
		this.getDataForCompanyDescriptionSearch();

	}

	triggredKeywordSearch() {
		
		if ( this.inputValue ) {
			this.checkInputValue = this.inputValue;
			this.getDataForCompanyDescriptionSearch();
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
		toFindStr = toFindStr.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').split(' ');		
		return realStr.replace(new RegExp(toFindStr.join('|'), 'gi'), (match) => `<b class='bg-yellow-300'>${match}</b>`);
   	}

	formatCompanyNameForUrl(companyName) {
        return this.commonService.formatCompanyNameForUrl( companyName );
    }

	companyDescriptionCommunicator( event ) {
		this.first = 0,
		this.rows = 25,
		this.reInitTableDataValuesForReset = false;
		this.selectedPropValues = event.appliedFilters;
		this.getDataForCompanyDescriptionSearch();
	}
 
}
