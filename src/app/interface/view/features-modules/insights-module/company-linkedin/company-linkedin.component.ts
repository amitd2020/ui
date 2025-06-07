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
import CustomUtils from 'src/app/interface/custom-pipes/custom-utils/custom-utils.utils';
import { Message, MessageService } from 'primeng/api';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
	selector: 'dg-company-linkedin',
	templateUrl: './company-linkedin.component.html',
	styleUrls: ['./company-linkedin.component.scss']
})
export class CompanyLinkedinComponent implements OnInit {
	tableData: any;
	totalCount: number = 0;
	inputValue: any;
	companyLinkedinData: Array<any> = [];
	selectedCompany: Array<any> = [];
	first: number = 0;
	rows: number = 20;
	totalDataValue: number = 0 ;
	totalSearchedDataValue: number = 0 ;
	addAlltoListSucess = [];
	title: string = '';
	description: string = '';
	saveListId: string = '';
	listName: string = '';
	checkInputValue: string = '';
	resetAppliedFiltersBoolean: boolean = false;
	visibleFilterSidebar: boolean = false;
	employeeSizeBool: boolean = false;
	reInitTableDataValuesForReset: boolean = true;
	selectedPropValues: Array<any> = [];
	payloadForChildApi;
	apiPayloadObject: object={};
	saveUpdateExisting: any;
	employeeClickData: any[] = [];
	connectedEmpNotFoundBool: boolean = false;
	specialtiesToDisplay: string = '';
	searchTerm: string = undefined;
	value!: number;
	paymentOptions: any[] = [
        { name: ' highlight', value: 1 }
    ];
	highlightEnabled = false;
	// companyLinkedinColumn: Array<any> = [
	// 	{ field: 'companyRegistrationNumber', header: 'Company Number', minWidth: '100px', maxWidth: '100px', textAlign: 'left' },
	// 	{ field: 'companyName', header: 'Company Name', minWidth: '280px', maxWidth: '280px', textAlign: 'left' },
	// 	{ field: 'website', header: 'Website', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
	// 	{ field: 'about_us', header: 'About Us', minWidth: '270px', maxWidth: '270px', textAlign: 'left' },
	// 	{ field: 'internationalScoreDescription', header: 'Risk Band', minWidth: '160px', maxWidth: 'none', textAlign: 'left' },
	// 	{ field: 'statutoryAccounts', header: 'Turnover', minWidth: '160px', maxWidth: 'none', textAlign: 'right' },
	// 	{ field: 'snapshot', header: 'Highlight', minWidth: '250px', maxWidth: 'none', textAlign: 'left' }
	// ];

	constructor(
		private userAuthService: UserAuthService,
		private globalServerCommunication: ServerCommunicationService,
		private commonService: CommonServiceService,
		private sharedLoaderService: SharedLoaderService,
		private seoService: SeoService,
        private router: Router,
		private activeRoute: ActivatedRoute,
		private searchCompanyService: SearchCompanyService,
		private location: Location,
		private layoutService: LayoutService,
		private messageService: MessageService,
		private sanitizer: DomSanitizer,
		private titleCasePipe: TitleCasePipe
	) {
		// if ( !this.userAuthService.hasAddOnPermission('companyLinkedIn') ) {
        //     this.router.navigate(['/']);
        // }
	}

	async ngOnInit() {

		this.searchCompanyService.updatePayload( { filterData: [] } );
		this.searchCompanyService.$apiPayloadBody.subscribe( res => {
            this.payloadForChildApi = res;
        });

	
		this.saveListId = this.activeRoute.snapshot.queryParams['cListId'];
		this.listName = this.activeRoute.snapshot.queryParams['listName'];
		if( this.saveListId ){
			this.searchCompanyService.updatePayload( { filterData: [ { chip_group: 'Saved Lists', chip_values: [ this.listName ] } ], listId: this.saveListId } );              
		}

		const { chipData } = JSON.parse(JSON.stringify( this.activeRoute.snapshot.queryParams ) );
		if ( chipData ) {
			this.searchCompanyService.updatePayload( { filterData: JSON.parse( chipData ), listId: this.saveListId } );
		}

		this.visibleFilterSidebar = true;
		this.getDataForCompanyLinkedInSearch();
		
	}

	ngOnDestroy() {
		// this.app.inputStyle = 'filled';		
		this.layoutService.config.inputStyle = 'outlined';	
	}

	showText(descriptionTextElement?: ElementRef) {
		if (descriptionTextElement['classList'].contains('limitTextHeight')) {
			descriptionTextElement['classList'].remove('limitTextHeight');
			descriptionTextElement['nextElementSibling'].innerText = 'Read Less';
		} else {
			descriptionTextElement['classList'].add('limitTextHeight');
			descriptionTextElement['nextElementSibling'].innerText = 'Read More';

		}
	}

	getDataForCompanyLinkedInSearch() {
		this.sharedLoaderService.showLoader();
		this.listName = this.payloadForChildApi.listId ? this.listName : '';
		

		let searchString = this.payloadForChildApi.filterData.filter( ({chip_group}) => chip_group == 'Search By Keyword' )
		let searchStringValue = searchString?.length ? searchString[0]['chip_values'] : '';

		this.inputValue = searchStringValue.toString();
		this.inputValue = this.inputValue.toLowerCase();
		
		let endpoint = 'companyLinkedInData',
			route = 'DG_API',
			savedListCheck = this.payloadForChildApi.filterData.find(val => val.chip_group == 'Saved Lists');

		if (  this.payloadForChildApi?.['listId'] && !this.activeRoute.snapshot.queryParams['cListId'] ) {
			this.saveListId = this.payloadForChildApi?.['listId'];
		}

		if ( savedListCheck ) {
			this.apiPayloadObject['listId'] = this.saveListId;
			this.apiPayloadObject['pageName'] = 'companyLinkedIn';
		} else {
			this.apiPayloadObject['listId'] = '';
		}

		this.apiPayloadObject['filterData'] = this.payloadForChildApi.filterData,
		this.apiPayloadObject['skip'] = this.first ? this.first : 0,
		this.apiPayloadObject['limit'] = this.rows ? this.rows : 20,
		this.apiPayloadObject['reqBy'] = "companyLinkedIn"

		const itemObj = this.payloadForChildApi.filterData?.find( item => item.chip_group == 'Search By Keyword' );
		this.searchTerm = itemObj ? itemObj.chip_values[0] : undefined;

		if ( itemObj ) {
			this.value = 1;
			this.highlightEnabled = true;
		}
		
		
		this.globalServerCommunication.globalServerRequestCall( 'post', route, endpoint, this.apiPayloadObject )
			.subscribe({
			next: ( res ) => {
				this.companyLinkedinData = res.body.data;
				this.totalDataValue = res.body.total;
				this.totalSearchedDataValue =  res.body.totalSearched;
				this.sharedLoaderService.hideLoader();

			},
			error: ( err ) => {
				console.log(err);
				this.sharedLoaderService.hideLoader();
			}
		})
		if ( this.activeRoute.snapshot.queryParams['chipData'] ) {
			this.location.replaceState('/insights/company');
			// this.activeRoute.snapshot.queryParams = {};
		}

	}
	pageChange( event ) {	
		this.first = event.first;
		this.rows = event.rows;
		this.getDataForCompanyLinkedInSearch();

	}

	formatWebsite(websiteParam: any) {
	
		if (!CustomUtils.isNullOrUndefined(websiteParam)) {
			let website = websiteParam;
			website = website.replace('https://', '');
			website = website.replace('http://', '');
			website = website.replace('www.', '');
			return website.toLowerCase();
		}
		else return ""
	}

	formatCompanyNameForUrl( companyName ) {
		return this.commonService.formatCompanyNameForUrl( companyName );
	}

	companyLinkedInCommunicator( event ) {
		this.first = 0,
		this.rows = 20,
		this.selectedPropValues = event.appliedFilters;
		this.getDataForCompanyLinkedInSearch();
	}

	getMessage( e ){
		this.addAlltoListSucess = [];
		this.addAlltoListSucess.push({ severity: e.status, summary: e.msgs });
		setTimeout(() => {
			this.addAlltoListSucess = [];
		}, 2000);

		this.selectedCompany = [];
	}
	resetTable( ) {
		this.first = 0,
		this.rows = 20,
		this.getDataForCompanyLinkedInSearch();

	}
	
	employeeDetailFromPersonLinkedInAPI( e ) {
		this.sharedLoaderService.showLoader();
		this.employeeClickData = [];
		this.apiPayloadObject['company_id'] =  e;		
		
		this.globalServerCommunication.globalServerRequestCall('post', 'DG_API', 'personLinkedInData', this.apiPayloadObject)
		
		.subscribe({
			next: ( personLinkedInData ) => {
				if ( personLinkedInData.body.status == 404 ){
					this.connectedEmpNotFoundBool = true;
				} else {
					this.employeeClickData = personLinkedInData?.body?.data;
					this.employeeSizeBool = true;
				}
				this.sharedLoaderService.hideLoader();
			},
			error: ( err ) => {
				console.log(err);
				this.sharedLoaderService.hideLoader();
			}
		})

	}

	updateUrl(event) {
		if ( event?.target ) {
			event.target.src = "https://static.licdn.com/aero-v1/sc/h/244xhbkr7g40x6bsu4gi6q4ry";
		}
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
		
}
