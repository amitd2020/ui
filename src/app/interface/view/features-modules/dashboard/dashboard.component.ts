import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { CanonicalURLService } from 'src/app/interface/service/canonical-url.service';
import { MetaContentSEO } from 'src/assets/utilities/data/metaContentSEO.constants';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { takeUntil } from 'rxjs';
import { UnsubscribeSubscription } from 'src/app/interface/service/unsubscribe.abstract';

@Component({
	templateUrl: './dashboard.component.html',
	styleUrls: [ './dashboard.component.scss' ]
})

export class DashboardComponent extends UnsubscribeSubscription implements OnInit {

	JSON = JSON;
	isLoggedIn: boolean = false;
	
	pageNamesForList ={
		'companySearch': 'Companies',
		'Company Charges-List': 'Charges',
		'Company Trade-list': 'Trade',
		'contractFinderPage': 'Contract Finder',
		'buyersDashboard': 'Buyers',
		'suppliersDashboard': 'Suppliers',
		'accountSearch': 'Account Search',
		'companyDescription': 'Company Description',
		'investeeFinder': 'Investee Finder',
		'investorFinder': 'Investor Finder',
		'companyLinkedIn': 'Company LinkedIn',
		'personLinkedIn': 'Person LinkedIn',
	}

	dataArr= [];
	msgs = [];
	filteredCompanyNameArray: any[];
	popularSearchesData: Array<any> = [];
	dashSearchData: Array<any> = [];
	dashRecentData: Array<any> = [];
	dashWatchlistData: Array<any> = [];
	dashWatchlistPlusData: Array<any> = [];
	dashUserlistData: Array<any> = [];
	notesTableData: Array<any> = [];
	
	titleDeedData: any;
	accountType: string;
	companyNameNumberSearchKey: string = '';
	directorNameSearchKey: any;
	timeout: any = null;
	selectedGlobalCountry: string = 'uk';
    displaydgExntensionPopUp: boolean = false;

	constructor( 
		private seoService: SeoService,
		private serverCommService: ServerCommunicationService,
		private router: Router,
		public commonService: CommonServiceService,
		private titlecasePipe: TitleCasePipe,
		private canonicalService: CanonicalURLService,
		public _activatedRoute: ActivatedRoute,
		public userAuthService: UserAuthService

	) {
		super();
	}

	ngOnInit() {

		this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';
		this.accountType = JSON.parse(localStorage.getItem('types'))[0];

		this.initBreadcrumbAndSeoMetaTags();

        this.userAuthService.isLoggedInSubject$.pipe( takeUntil( this.unsubscribe$ ) ).subscribe( ( loggedIn: boolean ) => {

			this.isLoggedIn = loggedIn;

			if ( this.isLoggedIn ) {
				
				if ( localStorage.getItem("loginCheck") != undefined ) {
					this.msgs = [];
					this.msgs.push({ severity: 'info', detail: 'Please check your mail for reset your password!' });
					setTimeout(() => {
						this.msgs = [];
						localStorage.removeItem("loginCheck");                    
					}, 4000);
				}  
	
				if ( localStorage.getItem("dgExtensionDialog") ) {
					this.displaydgExntensionPopUp = true;
					localStorage.removeItem("dgExtensionDialog");
				}

				const { dbID: userId, userRole } = this.userAuthService?.getUserInfo();

				this.getEasySearchCriteria();
				this.getRecentCompanies( userId );
				this.getWatchList( userId );
				this.getWatchListPlus( userId );
				this.getSavedFilterData( userId );
				this.getCompanyNotesData( userId );
				this.getUserListData( userId );
	
				if ( userRole == 'Super Admin' ) {
					this.getTitleDeedDetails();
				}

            }

		});

	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems( [ { label: "" } ] );
		
		this.seoService.setPageTitle( MetaContentSEO.dashboard.title );
		this.seoService.setMetaTitle( MetaContentSEO.dashboard.title );
		this.seoService.setDescription( MetaContentSEO.dashboard.description );
		this.seoService.setRobots ( MetaContentSEO.dashboard.robots );
		
		this.canonicalService.setCanonicalURL();
		
	}
	
	arraytoString(array) {
		return array.join(', ');
	}

	getEasySearchCriteria() {

		this.serverCommService.getDataFromJSON("easySearchCriteria.json").subscribe( res => {
			this.popularSearchesData = res.filter( ({ countryAccess }) => countryAccess.includes( this.selectedGlobalCountry )  );
		});

	}

	getSavedFilterData( userId: string ) {
		let params = [
			'25',
			'1'
		];

		this.serverCommService.globalServerRequestCall( 'get', 'DG_LIST', 'getSaveFilteredLists', params ).subscribe( res => {
			this.dashSearchData = res.body['results'];       
			if(typeof(this.dashSearchData) === 'string'){
				this.dashSearchData = [];
			}
		});
	}

	getRecentCompanies( userId: string ) {
		this.serverCommService.globalServerRequestCall( 'get', 'DG_LIST', 'getRecentsList' ).subscribe( res => {
			this.dashRecentData = res.body['results'];
		});
	}

	getWatchList( userId: string ) {
		this.serverCommService.globalServerRequestCall( 'get', 'DG_LIST', 'getWatchList' ).subscribe( res => {
			this.dashWatchlistData = res.body['results'];
		});
	}

	getWatchListPlus( userId: string ) {
		this.serverCommService.globalServerRequestCall( 'get', 'DG_LIST', 'getWatchListPlus' ).subscribe( res => {
			this.dashWatchlistPlusData = res.body['results'];
		});
	}

	getCompanyNotesData( userId: string ) {
		
		this.serverCommService.globalServerRequestCall( 'get', 'DG_LIST', 'notesList' ).subscribe(res => {

			if (res.status == 200) {
				
				let companyNotesData = res.body['results'];
				if (companyNotesData) {
					for (let notesObj of companyNotesData) {
						if (notesObj) {
							let obj = notesObj.data[0];
							if (obj && obj.notes != null) {
								obj.notes = obj.notes.replace(/<[^>]*>/g, ' ');
								this.notesTableData.push(obj)
							}
						};
					}
					this.notesTableData = this.sortNotes(this.notesTableData)
				};
			}
		});
		
	}

	getUserListData( userId: string ) {
		let param = [
			'25',
			'1'
		]
		this.serverCommService.globalServerRequestCall( 'get', 'DG_LIST', 'getUserLists', param ).subscribe( res => {
			
			const OriginalRes = res.body['results'];
			if( OriginalRes ){
				const FavList = OriginalRes.filter( val => val.listName == "Favourites" )[0];
				this.dashUserlistData = OriginalRes.filter( val => val.listName !== "Favourites" );
	
				this.dashUserlistData.unshift( FavList );
			}
		});
	}

	sortNotes(tempArr) {
		var len = tempArr.length,
			min;
		for (let i = 0; i < len; i++) {
			min = i;
			for (let j = i + 1; j < len; j++) {
				
				if (new Date(tempArr[j]["updatedOn"]) > new Date(tempArr[min]["updatedOn"])) {
					min = j;
				}
			}

			if (i != min) {
				this.swap(tempArr, i, min);
			}
		}
		return (tempArr)
	}

	showDetailChanges(name){
		let finalResult = '';

		switch ( name ) {
			case 'View Directors':
				finalResult = 'viewDirectors';
				break;

			case 'View Share Holders':
				finalResult = 'viewShareholders';
				break;

			case 'View Write Offs':
				finalResult = 'viewWrtieOffs';
				break;

			case 'View Import Data':
				finalResult = 'viewImportExport';
				break;
				
			case 'View Export Data':
				finalResult = 'viewImportExport';
				break;

			case 'View Corporate Land':
				finalResult = 'viewCorporateLand';
				break;

			case 'View Company Events':
				finalResult = 'viewCompanyEvents';
				break;

			case 'View Charges':
				finalResult = 'viewCharges';
				break;
				
			case 'View Trading Address':
				finalResult = 'viewTradingAddress';
				break;

			case 'View Patent Trade':
				finalResult = 'viewPatentTrade';
				break;

			case 'View Innovate Grant':
				finalResult = 'viewInnovateGrant';
				break;

			case 'View Finance Data':
				finalResult = 'viewFinancials';
				break;

			case 'View Finance Ratios':
				finalResult = 'viewFinancialRatios';
				break;

			case 'View Risk Assessment':
				finalResult = 'viewRiskSummary';
				break;
	
			default:
				break;
		}

		return finalResult;
	}

	swap(items, firstIndex, secondIndex){
		var temp = items[firstIndex];
		items[firstIndex] = items[secondIndex];
		items[secondIndex] = temp;
	}

	goToSearchPage( searchType, searchCriteria, listItem ) {
		let searchPagePath = '';
		
		if ( [ 'Company Search', 'Charges Search', 'Lending Landscape', 'Company Trade-list' ].includes( searchType ) ) {
			searchPagePath = '/company-search';
		} else if ( searchType == 'Land Registry' ) {
			searchPagePath = '/company-search/residential-property';
		} else if ( searchType == 'Property Register' ) {
			searchPagePath = '/company-search/property-register';
		} else if ( searchType == 'Investee Finder' ) {
			searchPagePath = '/insights/investee-finder';
		} else if ( searchType == 'person LinkedIn' ) {
			searchPagePath = '/insights/people';
		} else if ( searchType == 'company LinkedIn' ) {
			searchPagePath = '/insights/company';
		} 

		if(listItem.listId){
			this.router.navigate( [ searchPagePath ], { queryParams: { chipData: JSON.stringify( searchCriteria ), cListId: listItem.listId, listPageName: listItem.searchType } })
		}else{

			this.router.navigate( [ searchPagePath ], { queryParams: { chipData: JSON.stringify( searchCriteria )} })
		}
	}

	// For Company And Director Search //////////////////////////////////////////////////////////
	searchOnEnter(event, type) {

		let stringg = event.target.value;
		let stringcompany: Array<String> = [];
		let finalString = "";

		if ( type == 'company' ) {
			for (let i = 0; i < stringg.length; i++) {
				stringcompany[i] = stringg.charAt(i);
			}
			
			finalString = stringcompany.join("");
			
			if ( event.target.value !== "" ) {
				this.companyNameNumberSearchKey = finalString;
			}
		}

		if ( event.keyCode == 13 ) {
			if ( type == 'company' ) {
				this.companyNameNumberSearchKey = finalString;
				this.router.navigate(['/company-search'], { queryParams: { company: this.companyNameNumberSearchKey } });
			} else if ( type == 'director' ) {
				this.router.navigate(['/company-search'], { queryParams: { directorName: this.directorNameSearchKey } });
			}
		}
	}

	filteredCompanyName(event) {
		clearTimeout(this.timeout);
		let $this = this;

		let obj = {
			companyName: event.query.toString().toLowerCase()
		}

		this.timeout = setTimeout(function () {
			if (event.keyCode != 13) {
				if (event.query.length > 2) {

					this.globalServiceCommnunicate.globalServerRequestCall('post', 'DG_API', 'companyNameSuggestionsNew', obj).subscribe(res => {
						let data = res.body;

						if (data && data.status == 200) {

							if (data['results']) {

								let suggestedCompaniesData = data['results']['hits'];

								if (suggestedCompaniesData['total']['value'] == 0) {

									$this.filteredCompanyNameArray = [];

								} else if (suggestedCompaniesData['total']['value'] > 0) {

									$this.filteredCompanyNameArray = [];

									for (let val of suggestedCompaniesData['hits']) {

										let companyAddress;

										if (val['_source']['contactDetails'] || val['_source']['RegAddress_Modified']) {

											if (val['_source']['contactDetails'] && val['_source']['RegAddress_Modified']) {
												companyAddress = $this.commonService.formatCompanyAddress(val['_source']['contactDetails']);
											} else if ((!val['_source']['contactDetails']) && val['_source']['RegAddress_Modified']) {
												companyAddress = $this.commonService.formatCompanyAddress(val['_source']['RegAddress_Modified']);
											} else if (val['_source']['contactDetails'] && (!val['_source']['RegAddress_Modified'])) {
												companyAddress = $this.commonService.formatCompanyAddress(val['_source']['contactDetails']);
											}
										}

										$this.filteredCompanyNameArray.push({
											key: $this.titlecasePipe.transform(val['_source']['businessName']),
											companyNumber: $this.titlecasePipe.transform(val['_source']['companyRegistrationNumber']),
											companyAddress: companyAddress,
											companyStatus: $this.titlecasePipe.transform(val['_source']['companyStatus'])
										});
									}

								}

							} else {
								$this.filteredCompanyNameArray = [];
							}

						}

					});
				} else {
					$this.filteredCompanyNameArray = [];
				}
			}
		}, 1000);
	}

	getTitleDeedDetails() {

		this.serverCommService.globalServerRequestCall( 'get', 'DG_LRM', 'titleDeedHistory' ).subscribe( res => {

			this.titleDeedData;

			if (res.body.status == 200) {
				let tempData = res.body['results'];
				
				this.titleDeedData = tempData;
			  };
		});

	}

	formatCompanyNameForUrl(companyName) {
		return this.commonService.formatCompanyNameForUrl(companyName);
	}

	searchCompany(event) {
		this.router.navigate( [ '/company', event.companyNumber, this.formatCompanyNameForUrl(event.key) ] );
	}

	dgExtensioURL() {
        window.open(
			'https://chrome.google.com/webstore/detail/datagardener/lglclegdgfhpcagdfljfckhnmkceblfp?hl=en', '_blank'
		);
        this.displaydgExntensionPopUp = false;
    }

	dataFormatForTownCity( dataArray ) {
		return dataArray.toString().replace(/,/g, ', ');
	}

}
