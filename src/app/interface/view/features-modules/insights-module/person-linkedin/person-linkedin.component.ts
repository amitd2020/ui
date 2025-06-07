import { Component, ElementRef, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchCompanyService } from '../../search-company/search-company.service';
import { map } from 'rxjs';
import { Location, TitleCasePipe } from '@angular/common';
import { lastValueFrom, pluck } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';


@Component({
	selector: 'dg-person-linkedin',
	templateUrl: './person-linkedin.component.html',
	styleUrls: ['./person-linkedin.component.scss']
})
export class PersonLinkedinComponent implements OnInit {

	inputValue: any;
	personLinkedinData: Array<any> = [];
	selectedCompany: Array<any> = [];
	first: number = 0;
	rows: number = 20;
	totalDataValue: number = 0;
	totalSearchedDataValue: number = 0;
	addAlltoListSucess = [];
	title: string = '';
	description: string = '';
	saveListId: string = '';
	listName: string = '';
	checkInputValue: string = '';
	resetAppliedFiltersBoolean: boolean = false;
	reInitTableDataValuesForReset: boolean = true;
	selectedPropValues: Array<any> = [];
	payloadForChildApi;
	apiPayloadObject: any = {};
	saveUpdateExisting: any;
	msgs: Array<any> = [];
	showCompanySideDetails: boolean = false;
	corporateSideOverviewData: object;
	companySideDetailsParams: any = { companyNumber: undefined, companyName: undefined, tabNameToBeActive: '' };
	overviewName: string;
	fetchedPersonEmail: string = '';
	fetchedEmailData: string = '';
	showUpgradePlanDialogForClientuser: boolean = false;
	visibleFilterSidebar: boolean = false;
	personEmailDialouge: boolean = false;
	personNoEmailDialouge: boolean = false;
	copySuccess: boolean = false;
	buttonDisable: boolean = false;
	emailVerifyIconBoolean: boolean = false;
	personLinkedinColumn: Array<any> = [
		{ field: 'company_number', header: 'Company Number', minWidth: '100px', maxWidth: '100px', textAlign: 'left' },
		{ field: 'company_name', header: 'Company Name', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
		{ field: 'website', header: 'Website', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
		{ field: 'personName', header: 'Person Name', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
		{ field: 'personPosition', header: 'Position', minWidth: '190px', maxWidth: '190px', textAlign: 'left' },
		{ field: 'internationalScoreDescription', header: 'Risk Band', minWidth: '140px', maxWidth: '140px', textAlign: 'left' },
		{ field: 'statutoryAccounts', header: 'Turnover', minWidth: '100px', maxWidth: '100px', textAlign: 'left' },
		{ field: 'about_me', header: 'About Us', minWidth: '250px', maxWidth: '270px', textAlign: 'left' },
		{ field: 'snapshot', header: 'Highlight', minWidth: '280px', maxWidth: 'none', textAlign: 'left' }
	];

	tableData: any[] = [
		{
			"full_name": "Valerie Wells",
			"position": "Investigation Support Officer",
			"location": "Newbury, England, United Kingdom",
			"social_connections": "386 connections",
			"social_url": "https://uk.linkedin.com/in/valerie-wells-382a4323",
			"country_code": "uk",
			"image_url": "https://img.freepik.com/free-photo/beautiful-woman-near-fireplace-looking-front_114579-85106.jpg?t=st=1735019110~exp=1735022710~hmac=8b63e563d64b390f2141cae570f082f607c7f629e4e2b16ddc6205e967c5ede1&w=740",
			"cover_image_url": "https://media.licdn.com/dms/image/C4E16AQG2ITmVkrnalw/profile-displaybackgroundimage-shrink_200_800/0/1647089349998?e=2147483647&v=beta&t=dYJigmDpylJJ4G6_UNgUSTUyeNcylBhBSJS1SWv0v98",
			"about_me": "A highly organised Administrator with HR professional experience. Ability to prioritise and work well in a demanding, high pressured environment. Strong customer service and quality standards. IT proficient with experience of negotiation, reporting, analysis and collation of highly sensitive data with total confidence. Focused on delivering results and managing workloads. A good communicator with all levels and able to work well in a team or individually.Currently new to role with TVP as an Investigation Support Officer.",
			"experience": [
			  {
				"social_url": "https://www.linkedin.com/company/thames-valley-police",
				"image_url": "https://media.licdn.com/dms/image/D4E0BAQFrTzBcfGeBhw/company-logo_100_100/0/1715069770104/thames_valley_police_logo?e=2147483647&v=beta&t=upcU4xbtN5UGLU1Fou1Ijs5Fv635JzhdjKxl6ET1MT0",
				"position": "Investigation Support Officer",
				"company_name": "Thames Valley Police",
				"start_time": "Jan 2023",
				"end_time": "Present",
				"duration": "1 year 5 months",
				"location": "Thames Valley",
				"job_description": null
			  }
			]
		},
    ];
	paymentOptions: any[] = [
        { name: ' highlight', value: 1 }
    ];
	highlightEnabled = false;
	searchTerm: string = undefined;
	value!: number;

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
		private layoutService: LayoutService,
		private titleCasePipe: TitleCasePipe
	) {
		if (!this.userAuthService.hasAddOnPermission('personLinkedIn')) {
			this.router.navigate(['/']);
		}
	}

	async ngOnInit() {

		// this.saveUpdateExisting = {
		// 	existingSaveFiltersName: this.activeRoute.snapshot.queryParams['saveFiltersName'],
		// 	existingSaveFiltersId: this.activeRoute.snapshot.queryParams['saveFiltersId']
		// }

		// const { chipData } = JSON.parse(JSON.stringify(this.activeRoute.snapshot.queryParams));
		

		// if (chipData) {
		// 	this.searchCompanyService.updatePayload({ filterData: JSON.parse(chipData) });
		// }

		this.searchCompanyService.updatePayload( { filterData: [] } );

		const { cListId, listName, pageName, chipData } = this.activeRoute.snapshot.queryParams;
		this.saveListId = cListId;
		if ( cListId ) {
			this.searchCompanyService.updatePayload( { filterData: [ { chip_group: 'Saved Lists', chip_values: [ listName ] } ], listId: cListId } ); 
		}

		if ( chipData ) {
		    this.searchCompanyService.updatePayload({ filterData: JSON.parse( chipData ) });
		}

		this.searchCompanyService.$apiPayloadBody.subscribe(res => {
			this.payloadForChildApi = res;
		});

		this.visibleFilterSidebar = true;
		this.initBreadcrumbAndSeoMetaTags();
		this.getDataForPersonLinkedInSearch();

		// const { shareId } = this.activeRoute.snapshot?.queryParams;
		// this.saveListId = this.activeRoute.snapshot?.queryParams['cListId'];
		// this.listName = this.activeRoute.snapshot?.queryParams['listName'];
		// if( shareId ){
		// 	let param = [ 
		// 		{ key:'shareId', value: shareId }
		// 	];
		// 	const CompanyDetailAPIResponse = await lastValueFrom(this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getSharedCriteriaInfo', undefined, undefined, param ) )

		// 	if ( CompanyDetailAPIResponse.body.status = 200 ) {
		// 		this.searchCompanyService.updatePayload( { filterData: CompanyDetailAPIResponse.body.result.criteria  } );
		// 		this.searchCompanyService.updateFilterPanelApplyButtons();
		// 	}
		// } else {
		// 	this.searchCompanyService.updatePayload( { filterData: [] } );
		// }

		// if( this.saveListId && !shareId){
		// 	this.searchCompanyService.updatePayload( { filterData: [ { chip_group: 'Saved Lists', chip_values: [ this.listName ] } ], listId: this.saveListId } );              
		// }
	}

	ngOnDestroy() {
		this.layoutService.config.inputStyle = 'outlined';	
	}

	initBreadcrumbAndSeoMetaTags() {
		this.title = "DataGardener Person LinkedIn - Find any Person LinkedIn ";
		this.description = "Get in-depth analytics of Your searched keywords records.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setMetaTitle(this.title);
		this.seoService.setDescription(this.description);
	}

	getDataForPersonLinkedInSearch() {
		this.sharedLoaderService.showLoader();

		let searchString = this.payloadForChildApi.filterData.filter(({ chip_group }) => chip_group == 'Search By Keyword')
		let searchStringValue = searchString?.length ? searchString[0]['chip_values'] : '';
		
		this.inputValue = searchStringValue.toString();
		this.inputValue = this.inputValue.toLowerCase();

		const itemObj = this.payloadForChildApi.filterData?.find( item => item.chip_group == 'Search By Keyword' );
		this.searchTerm = itemObj ? itemObj.chip_values[0] : undefined;

		if ( itemObj ) {
			this.value = 1;
			this.highlightEnabled = true;
		}

		// this.inputValue = this.inputValue.toLowerCase().split(' ');
		// this.inputValue = this.highlightKeyword( this.inputValue );

		// let savedListCheck = this.payloadForChildApi.filterData.find(val => val.chip_group == 'Saved Lists'),
		
		// if ( this.payloadForChildApi?.['listId'] ) {
		// 	this.saveListId = this.payloadForChildApi?.['listId'];
		// }
		
		// if( savedListCheck && this.saveListId ) {
		// 	this.searchCompanyService.updatePayload( { listId: this.saveListId, pageName: 'companyLinkedIn' } );
		// 	this.apiPayloadObject['listId'] = this.saveListId,
		// 	this.apiPayloadObject['pageName'] = 'personLinkedIn'
		// 	endpoint = 'getCompaniesInListTableData',
		// 	route = 'DG_LIST'
		// } else {
		// 	this.apiPayloadObject['listId'] = ''
		// }
		
		this.apiPayloadObject['filterData'] =  this.payloadForChildApi.filterData,
		this.apiPayloadObject['listId'] =  this.saveListId,
		this.apiPayloadObject['skip'] =  this.first ? this.first : 0,
		this.apiPayloadObject['limit'] =  this.rows ? this.rows : 20,
		this.apiPayloadObject['reqBy'] =  "personLinkedIn"

		this.globalServerCommunication.globalServerRequestCall('post', 'DG_API', 'personLinkedInData', this.apiPayloadObject)
			.subscribe({
				next: (res) => {
					this.personLinkedinData = res.body.data;
					this.totalDataValue = res.body.total;
					this.totalSearchedDataValue = res.body.totalSearched;
					this.sharedLoaderService.hideLoader();

				},
				error: (err) => {
					console.log(err);
					this.sharedLoaderService.hideLoader();
				}
			})
		if (this.activeRoute.snapshot.queryParams['chipData']) {
			this.location.replaceState('/insights/people');
			// this.activeRoute.snapshot.queryParams = {};
		}

	}

	pageChange(event) {
		this.selectedCompany = [];
		this.first = event.first;
		this.rows = event.rows;
		this.getDataForPersonLinkedInSearch();
	}

	formatCompanyNameForUrl(companyName) {
		return this.commonService.formatCompanyNameForUrl(companyName);
	}

	personLinkedInCommunicator(event) {
		this.first = 0,
		this.rows = 20,
		this.reInitTableDataValuesForReset = false;
		this.selectedPropValues = event.appliedFilters;
		let savedListData = this.payloadForChildApi.filterData.filter(item => item.chip_group == 'Saved Lists')[0];
		if ( !savedListData ) {
			this.saveListId = ''
		}
		this.getDataForPersonLinkedInSearch();
	}

	showText( descriptionTextElement?: ElementRef ) {
		if (descriptionTextElement['classList'].contains('limitTextHeight')) {
			descriptionTextElement['classList'].remove('limitTextHeight');
			descriptionTextElement['nextElementSibling'].innerText = 'Read Less';
		} else {
			descriptionTextElement['classList'].add('limitTextHeight');
			descriptionTextElement['nextElementSibling'].innerText = 'Read More';

		}
	}

	updateUrl(event) {
		if ( event?.target ) {
			event.target.src = "https://static.licdn.com/aero-v1/sc/h/244xhbkr7g40x6bsu4gi6q4ry";
		}
	}

	displayMessage(event) {
		this.msgs = [];
		this.selectedCompany = [];
		this.msgs = [ { severity: event.status, detail: event.msgs } ];
		setTimeout( () =>{
			this.msgs = [];
		}, 2000 );
	}

	resetTable() {
		this.first = 0;
		this.rows = 20;
		this.selectedCompany = [];
		this.getDataForPersonLinkedInSearch();
	}

	toggleHighlight() {
		this.highlightEnabled = !this.highlightEnabled;
	}

	highlightText(text: string): string {
		if (!text || !this.searchTerm || !this.highlightEnabled) return this.titleCasePipe.transform(text);
		const titleCasedText = this.titleCasePipe.transform(text);
		const regex = new RegExp(this.searchTerm, 'gi');
		return titleCasedText.replace(regex, (match) => `<span class="bg-yellow-300">${match}</span>`);
	}

	// highlightKeyword( inputArr ): string {
	// 	let indexStr: number;

	// 	if ( inputArr.includes('and') ) {
	// 		indexStr = inputArr.indexOf('and');
	// 		inputArr.splice( indexStr, 1 );
	// 		return inputArr.join(' ');

	// 	} else if ( inputArr.includes('or') ) {
	// 		indexStr = inputArr.indexOf('or');
	// 		inputArr.splice( indexStr, 1 );
	// 		return inputArr.join(' ');
	// 	}
	// 	return inputArr.join(' ');
	// }

	// showCompanySideDetailsPanel( compNumber, compName, rowData?, tabRoute? ) {

	// 	this.showCompanySideDetails = true;

	// 	if ( rowData == undefined ) {
	// 		this.companySideDetailsParams.companyNumber = compNumber;
	// 		this.companySideDetailsParams.companyName = compName;
	// 		this.overviewName = "companyOverview";
            
            
	// 	} else if ( rowData != undefined ) {
    //         this.corporateSideOverviewData = rowData;
	// 		this.overviewName = "corporateOverview";
	// 	}
        
    //     if ( tabRoute ) {
    //         this.companySideDetailsParams.tabNameToBeActive = tabRoute;
    //     }

	// }

	// checkSubscriptionAuth(conditionCheck, route) {

	// 	if (route) {
	// 		if (!conditionCheck) {
	// 			event.preventDefault();
	// 			event.stopPropagation();
	// 			if ( this.userAuthService.hasRolePermission( [ 'Client User' ] ) ) {
	// 				this.showUpgradePlanDialogForClientuser = true;
	// 			}
	// 		} else {
	// 			let routeUrl: any;

	// 			if (typeof route == 'string') {
	// 				routeUrl = route;
	// 			} else {
	// 				routeUrl = this.router.serializeUrl(this.router.createUrlTree(route));
	// 			}

	// 			window.open(routeUrl, '_blank');
	// 		}
	// 	}

	// }

	// getShowCompanySideDetailsOutputBoolValue($event) {
	// 	this.showCompanySideDetails = $event;
	// }

	// triggredKeywordSearch() {

	// 	if (this.inputValue) {
	// 		this.checkInputValue = this.inputValue;
	// 		this.getDataForPersonLinkedInSearch();
	// 	}

	// }

	// getMessage(e) {
	// 	this.addAlltoListSucess = [];
	// 	this.addAlltoListSucess.push({ severity: 'success', summary: e.msgs });
	// 	setTimeout(() => {
	// 		this.addAlltoListSucess = [];
	// 	}, 2000);

	// 	this.selectedCompany = [];
	// }

	// highlightMatchedWords(realStr, toFindStr) {
	// 	toFindStr = toFindStr.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').split(' ');
	// 	return realStr.replace(new RegExp(toFindStr.join('|'), 'gi'), (match) => `<b class='bg-yellow-300'>${match}</b>`);
	// }

	// highlightMatchedWordsAndOr(realStr, toFindStr) {
	// 	let phrasesToHighlight = [];
		
	// 	// Check if the input contains "and" or "or"
	// 	if (toFindStr.includes('and') || toFindStr.includes('or')) {
	// 		// Split the string based on "and" or "or"
	// 		phrasesToHighlight = toFindStr.split(/\b(?:and|or)\b/).map(phrase => phrase.trim());

	// 	} else {
	// 		// Treat the input as a single phrase
	// 		// phrasesToHighlight = [toFindStr];

	// 		toFindStr = toFindStr.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').split(' ');
	// 	    return realStr.replace(new RegExp(toFindStr.join('|'), 'gi'), (match) => `<b class='bg-yellow-300'>${match}</b>`);
	// 	}

	// 	// Remove any special characters from each phrase
	// 	// phrasesToHighlight = phrasesToHighlight.map(phrase => phrase.replace(/[^\w\s]/gi, ''));

	//     phrasesToHighlight = phrasesToHighlight.map(phrase => phrase.replace(/[`~!@#$%^&*()_|+\=?;:'".<>\{\}\[\]\\\/]/gi, ''));

	// 	// Highlight each phrase separately
	// 	let highlightedText = realStr;
	// 	phrasesToHighlight.forEach(phrase => {
	// 		const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
	// 		highlightedText = highlightedText.replace(regex, (match) => `<b class='bg-yellow-300'>${match}</b>`);
	// 	});

	// 	return highlightedText;
	// }

	// successMessageForExport( event ) {
	// 	if ( event.severity == 'success' ) {

	// 		this.addAlltoListSucess = [];
	// 		this.addAlltoListSucess.push({ severity: event.severity, summary: event.message });
			
	// 		setTimeout(() => {
	// 			this.addAlltoListSucess = [];
	// 		}, 3000);

	// 	}
	// }

	fetchPersonEmail( personFullName, personWebsite){

		this.sharedLoaderService.showLoader();
		
		let personLinkedinPayload = {
			"domain": personWebsite,
			"full_name": personFullName
		}
		
		this.globalServerCommunication.globalServerRequestCall('post', 'DG_LIST', 'getEmailsForConnectPlus', personLinkedinPayload)
		.subscribe({
			next: (res) => {	
				
				if ( res.body.status == 200 ){
					this.personNoEmailDialouge = false;
					this.personEmailDialouge = true;
					this.fetchedEmailData = res['body']['email'];
					console.log(this.fetchedEmailData['email_status']);
					this.emailVerifyIconBoolean = res?.['body']?.['email_status']=='verified' ? true : false;
					this.buttonDisable = true;
					this.sharedLoaderService.hideLoader();
				} else {
					this.personEmailDialouge = false;
					this.personNoEmailDialouge = true;
					this.sharedLoaderService.hideLoader();
				}
			},
			error: (err) => {
				console.log(err);
				this.sharedLoaderService.hideLoader();
			}
		})
		
	}

	copyEmailToClipboard(email: string): void {
		navigator.clipboard.writeText(email).then(() => {
		  this.copySuccess = true;
		  setTimeout(() => {
			this.copySuccess = false;
		  }, 2000); // Hide success message after 2 seconds
		}).catch(err => {
		  console.error('Failed to copy email:', err);
		});
	}
}
