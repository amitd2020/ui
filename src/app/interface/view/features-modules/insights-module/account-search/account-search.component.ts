import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchCompanyService } from '../../search-company/search-company.service';
import { Location } from '@angular/common';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';
import { lastValueFrom, pluck } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
	selector: 'dg-account-search',
	templateUrl: './account-search.component.html',
	styleUrls: ['./account-search.component.scss']
})
export class AccountSearchComponent implements OnInit, OnDestroy, AfterViewInit {

	inputValue: string = '';
	accountSearchData: Array<any>  = [];
	selectedCompany: Array<any> = [];
	first: number = 0;
	rows: number = 25;
	totalDataValue: number = 0 ;
	totalSearchedDataValue: number = 0 ;
	errorMessageWhileNoSearchString = [];
	addAlltoListSucess = [];
	title: string = '';
	description: string = '';
	checkInputValue: string = '';
	resetAppliedFiltersBoolean: boolean = false;
	visibleFilterSidebar: boolean = false;
	reInitTableDataValuesForReset: boolean = true;
	selectedPropValues: Array<any> = [];
	apiPayloadObject: any
	payloadForChildApi;
	// saveFiltersName: any;
	// saveFiltersId: any;
	saveUpdateExisting: any;
	userDetails: Partial< UserInfoType > = {};
	selectedSavedListId: string = '';

	private apiPayloadSubscription: Subscription;

	accountSearchColumn: Array<any> = [
		{ field: 'companyRegistrationNumber', header: 'Company Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
		{ field: 'companyName', header: 'Company Name', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
		{ field: 'snapshot', header: 'Snapshot', minWidth: '160px', maxWidth: 'none', textAlign: 'left' },
		{ field: 'accountDate', header: 'Accounts date', minWidth: '140px', maxWidth: '140px', textAlign: 'right' },
		{ field: 'downloadFileLink', header: 'Accounts File', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
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
		if ( !this.userAuthService.hasRolePermission( ['Super Admin'] ) && !this.userAuthService.hasAddOnPermission('accountSearch') ) {
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

		this.searchCompanyService.resetPayload();

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

		this.apiPayloadSubscription = this.searchCompanyService.$apiPayloadBody.subscribe( res => {
            this.payloadForChildApi = res;
        });
		this.initBreadcrumbAndSeoMetaTags();
		const { chipData, listPageName, cListId } = JSON.parse(JSON.stringify( this.activeRoute.snapshot.queryParams ) );
		this.selectedSavedListId = cListId;

		if ( chipData ) {
			this.searchCompanyService.updatePayload( { filterData: JSON.parse( chipData ) } );
		}
		
		this.visibleFilterSidebar = true;
		this.getDataForAccountSearch();
	}
	
	ngAfterViewInit() {
		setTimeout(() => {
			// this.app.inputStyle = 'outlined';
		}, 200);
	}

	initBreadcrumbAndSeoMetaTags() {
		// this.breadcrumbService.setItems([ { label: 'Account Search' } ]);
		this.title = "DataGardener Account Search - Search Compnay by Account number";
		this.description = "Get in-depth analytics of Your searched keywords record.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setMetaTitle(this.title);
		this.seoService.setDescription(this.description);
	}

	ngOnDestroy() {
		// this.app.inputStyle = 'filled';
		this.layoutService.config.inputStyle = 'outlined';
		if (this.apiPayloadSubscription) {
			this.apiPayloadSubscription.unsubscribe();
		}
	}

	getDataForAccountSearch() {
		
		this.sharedLoaderService.showLoader();

		let { listId } = this.payloadForChildApi;

		if ( !JSON.stringify( this.payloadForChildApi.filterData ).includes( 'Saved Lists' )) {
			listId = '';
			this.selectedSavedListId = '';
		}

		let searchString = this.payloadForChildApi.filterData.filter( ({chip_group}) => chip_group == 'Search By Keyword' )
			let searchStringValue = searchString?.length ? searchString[0]['chip_values'] : '';
			this.inputValue = searchStringValue.toString()
			this.apiPayloadObject = {
			filterData: this.payloadForChildApi.filterData,
			skip: this.first ? this.first : 0,
			limit: this.rows ? this.rows : 25,
			listId: listId ? listId : this.selectedSavedListId,
			reqBy: "accountSearch"
		}
		// if(searchString?.length){
		// 	this.apiPayloadObject['exclude'] = searchString?.length ? searchString[0]['exclude'] : false
		// }

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_API', 'accountsData', this.apiPayloadObject )
			.pipe(
				map( val => val.body ),
				map( ({ data, total, totalSearched }) => {
					let rawData = [];
					for ( let dataObj of data ){
						let tempObj = {
							companyRegistrationNumber: dataObj['_source']['companyRegistrationNumber'],
							companyName: dataObj['_source']['companyName'],
							snapshot: dataObj && dataObj.highlight && dataObj.highlight["attachment.content"] && dataObj.highlight["attachment.content"].length ? dataObj.highlight["attachment.content"].join(' ') : "",
							accountDate: dataObj['_source']['accountsDate'],
							downloadFileLink: dataObj['_source']['file']
						};
						rawData.push( tempObj );
					}
					this.totalDataValue = total;
					this.totalSearchedDataValue = totalSearched ;

					return rawData;
				})
				
			)
			.subscribe({
			next: ( res ) => {
				this.accountSearchData = res;
				this.sharedLoaderService.hideLoader();

			},
			error: ( err ) => {
				console.log(err);
				this.sharedLoaderService.hideLoader();
			}

			
		})
		if ( this.activeRoute.snapshot.queryParams['chipData'] ) {
			this.location.replaceState('/insights/account-search');
			this.activeRoute.snapshot.queryParams = {};
		}
	}

	pageChange( event ) {	

		this.first = event.first;
		this.rows = event.rows;
		this.getDataForAccountSearch();

	}

	triggredKeywordSearch() {
		
		if ( this.inputValue ) {
			this.checkInputValue = this.inputValue;
			this.getDataForAccountSearch();
		}

	}

	downloadForAccountSearch ( downloadableAccountPDF ){
		const linkSource = 'data:application/html;base64,'+ downloadableAccountPDF;
		const downloadLink = document.createElement("a");
		const fileName = 'CompanyAccount.html';

		downloadLink.href = linkSource;
		downloadLink.download = fileName;
		downloadLink.click();
	}

	getMessage(e) {
		this.addAlltoListSucess = [];
		this.addAlltoListSucess.push({ severity: 'success', summary: e.msgs });
		setTimeout(() => {
			this.addAlltoListSucess = [];
		}, 2000);
		
		this.selectedCompany = [];
	}

	formatCompanyNameForUrl(companyName) {
        return this.commonService.formatCompanyNameForUrl( companyName );
    }

	highlightMatchedWords(realStr, toFindStr) {
 		// toFindStr = toFindStr.replace(/[`~!@#$%^&*()_|+\=?;:'".<>\{\}\[\]\\\/]/gi, '').split(' ');		
		// return realStr.replace(new RegExp(toFindStr.join('|'), 'gi'), (match) => `<b class='bg-yellow-300'>${match}</b>`);
	}


	highlightWords(inputText, wordsToHighlight) {
		const escapedWords = wordsToHighlight
			.split(/\s+/) 
			.map(word => word.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&'));  // Escape special characters

		// Create a pattern that matches the entire phrase exactly (case insensitive)
		const pattern = '\\b' + escapedWords.join('\\s+') + '\\b';  // Join words with space to form the phrase

		const regex = new RegExp(pattern, 'gi');

		return inputText.replace(regex, (match) => {
			return `<b class='bg-yellow-300'>${match}</b>`;
        });
	}

	accountSearchCommunicator( event ) {
		this.first = 0,
		this.rows = 25,
		this.reInitTableDataValuesForReset = false;
		this.selectedPropValues = event.appliedFilters;
		this.getDataForAccountSearch();
	}
}