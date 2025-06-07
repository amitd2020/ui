import { TitleCasePipe, DecimalPipe, Location } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CompanyDetailModel } from 'src/app/interface/models/company-data-model';

import { ConfirmationService, MenuItem, Message } from 'primeng/api';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab, faFacebook, faLinkedinIn, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

// Overview Tab Components
// import { AboutComponent, TradingAddressComponent, GroupStructureComponent, NotesComponent, LifeLineComponent, ImportExportComponent, PersonContactInfoComponent, EscComponent, EpcTabComponent } from './child-components.index';

// Risk Profile Tab Components
// import { RiskSummaryComponent, SafeAlertComponent, CcjsComponent, CommentryComponent, CompanyEventsComponent, CreditorsComponent, BadDeptsComponent, ChargesComponent } from './child-components.index';

// Financial Tab Components
// import { FinancialsInfoComponent, RatiosComponent, ShareholdingsComponent, AquisationMergerComponent, InnovateGrantComponent, CorporateLandComponent, BusinessValuationComponent, PatentTradeComponent, ZscoreComponent, CagrComponent, SustainabilityIndexComponent } from './child-components.index';

// Director/Shareholders Tab Components
// import { DirectorsInfoComponent, PscComponent, ShareholdersComponent, RelatedDirectorsComponent, RelatedCompaniesComponent } from './child-components.index';

// Sustainability Tab Components
// import { SustainEsgSummaryComponent, SustainEnvironmentComponent, SustainSocialComponent, SustainGovernanceComponent, SustainFinanceComponent } from './child-components.index';


// Document - News Feeds Tab Components
// import { DocumentsComponent, NewsFeedComponent } from './child-components.index';
// import { UkgaapIfrsInsuranceFinancialComponent } from './financial/ukgaap-ifrs-insurance-financial/ukgaap-ifrs-insurance-financial.component';

// Government Procurement Components

// import { BuyerComponent, SupplierComponent } from './child-components.index';

import CustomUtils from '../../../custom-pipes/custom-utils/custom-utils.utils';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { SharedLoaderService } from '../../shared-components/shared-loader/shared-loader.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { CanonicalURLService } from 'src/app/interface/service/canonical-url.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { DataCommunicatorService } from './data-communicator.service';
import { SalesForceConstant, subscribedPlan, CompaniesEligibleForDataWithoutLogin } from 'src/environments/environment';

import { UserInteractionMessages } from '../../../../../assets/utilities/data/UserInteractionMessages.const';
import { MetaContentSEO } from 'src/assets/utilities/data/metaContentSEO.constants';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { lastValueFrom, takeUntil } from 'rxjs';
import { UserAddOnType, UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';
import { UnsubscribeSubscription } from 'src/app/interface/service/unsubscribe.abstract';
import { ComponentsMenuConfig, ComponentsMenuType } from './child-compenents.config';

type crmType = 'hubspot' | 'salesforce';

const icons = [
    faLinkedinIn,
    faWhatsapp, 
];

library.add( fas, fab );
library.add( ...icons );

@Component({
	selector: 'dg-company-details-view',
	templateUrl: './company-details-view.component.html',
	styleUrls: ['./company-details-view.component.scss']
})
export class CompanyDetailsViewComponent extends UnsubscribeSubscription implements OnInit, OnChanges {

    @ViewChild( 'TabComponentViewContainer', { read: ViewContainerRef } ) TabComponentViewContainer!: ViewContainerRef;

	@Input() companyNumber: string;
	@Input() companyOriginalName: any;
	@Input() sidePanelView: boolean = false;
	@Input() tabNameToBeActive: string = '';

    tabMenuIndexList: ComponentsMenuType[] = ComponentsMenuConfig;
    mainMenuTabItems: ComponentsMenuType[] = [];
    subMenuTabItems: ComponentsMenuType[] = [];

    isLoggedIn: boolean = false;
    riskProfileDisabled: boolean = true;
    userDetails: Partial< UserInfoType > = {};
	selectedGlobalCountry: string = 'uk';
	selectedGlobalCurrency: string = 'GBP';

    fbIcon = faFacebook;
    whatsappIcon = faWhatsapp;

    companyNoteValue: string = '';
    nameOfCompany: string;
	companyAddress: string;
    typeCheckForBuyerSupplierParam: string;
    notesId: any = undefined;
    notesData: any = undefined;
    monitorPlusPopUpBool: boolean = false;
    monitorPopUpBool: boolean = false;
	contractFinderSuppliersDataValues: Array<any>;
	noticeIdentifierNo: any;
	contractFinderSupplierColumns: Array<any>;

    queryString = window.location.search;

    companyData: any;
    companyWebsites = [];
	msgs: Message[] = [];
    directorDetails: any = [];
	companyDetail: CompanyDetailModel[] = [];
    directorOverviewArray: Array<any> = undefined;
    disqualifiedDeletedExceptionDirectors: Array<any> = [];
    companiesEligibleForDataWithoutLogin = CompaniesEligibleForDataWithoutLogin;
    subscribedPlanModal: any = subscribedPlan;
    moreButtonListItems: MenuItem[];
    reportButtonItems: MenuItem[];
    iconObj = {
        monitor: 'pi pi-eye',
        monitorPlus: 'pi pi-eye'
    }
    newUrlForCompanyLogo: any;  //This variable will be removed after url updated from Backend and url will be received like : companyLogoUpdated insted of companylogoupdated
    premium_sub: boolean = false;
	companyNotExists: boolean = false;
    favouriteListStatus: boolean = false;
    favouritesListId: any;
    isFavourite: boolean = false;
    watchListStatus: boolean = false;
    watchListPlusStatus: boolean = false;
    supplierTabBoolean: boolean = false;
    buyerTabBoolean: boolean = false;
	infoDialogModal: boolean = false;
	showLoginDialog: boolean = false;
	showUpgradePlanDialog: boolean = false;
    isBuyerScreen: boolean = false;
    isSupplierScreen: boolean = false;
    showAddNoteModalBool: boolean = false;
	viewNoticeIndentifierModal: boolean = false;
    display: boolean = false;
    showDialog: boolean = false;
    isBuyerNonREGScreenDataValue: any;
    isSupplierNonREGScreenDataValue: any;
    isBuyerNonREGScreenDataColumns: any;
    isSupplierNonREGScreenDataColumns: any;
    buyerAndSupplierDetails: any;
    companyNumberForBuyerAndSupplier: any;
    noticeIndentifierSummaryData: any;
    buyerDetails: any;
    supplierDetails: any;
    creditLimitCheck: any;
	dateTimelineView: any[];

    disqualifiedDirectorsCount: number = 0;

	companyDocuments: Object;

    companydirectorStatusCounts: any = {
        total: 0,
        active: 0,
        resigned: 0,
        inactive: 0,
        activeSecretary: 0
    };
    salesForceConstant: any = SalesForceConstant;
	constantMessages: any = UserInteractionMessages;
    overallDoughnutOptions: any;
    overallDoughnutData: any;
	contractEndingTrendData: any;
	contractEndingTrendOptions: any;
	awardAmountDataSet: Array<any> = undefined;
	awardCountDataSet: Array<any> = undefined;
	barData: any;
	barOptions: any;
    barLabels: Array<any> = undefined;
	barDataset: Array<any> = undefined;
	lineLabels: Array<any> = undefined;
	lineDataSet: Array<any> = undefined;
	overviewChartData: any;
	lineOptions: any;
	lineData: any;
	overviewChartOptions: any;
    showFindEPCModalBool: boolean = false;
    enterpriseReportButton: boolean = false;
    companyReportButtonBool: boolean = false;
    fullCreditReportButtonBool: boolean = false;
    showDialogForListName: boolean = false;
	isAuthenticatedWithHubspot: boolean = false;
	listNameForHubSpot: string;
    userLimit: any
    msmeStatusColor = {
        'Micro': '#59ba9b',
        'Small': '#ffcc00',
        'Medium': '#ee9512',
        'Large Enterprise': '#e1b12c',
		'Unknown': '#aabbcc',
    }
    rightBarChartData: any;
	rightBarChartOptions: any;
    contractBarChartValData: any;
	contractBarChartOptions: any;
    dataForGraph: any;
    dataForSupplierGraph:any;
    supplierData: any = {};

	constructor(
		private router: Router,
		private seoService: SeoService,
		private commonService: CommonServiceService,
		private _activatedRoute: ActivatedRoute,
		public userAuthService: UserAuthService,
        private titleCasePipe: TitleCasePipe,
        private decimalPipe: DecimalPipe,
        private dataCommunicatorService: DataCommunicatorService,
        private canonicalService: CanonicalURLService,
		public toNumberSuffix: NumberSuffixPipe,
        private sharedLoaderService: SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService,
        private confirmationService: ConfirmationService,
        private _location: Location
	) {
        super();
		/*
			Do not enable the below code before discussing with Akmal.
			It reloads the `AppMainComponent`, which is the main
			layout container and parent for all of the Components/Modules.
			===============================================================
			this.router.routeReuseStrategy.shouldReuseRoute = () => false;
			===============================================================
		*/
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;

		if ( this._activatedRoute.snapshot.url && this._activatedRoute.snapshot.url.length ) {
            if (this._activatedRoute.snapshot.url[0].path !== 'company-search' && this._activatedRoute.snapshot.url[0].path !== 'notes-list' && this._activatedRoute.snapshot.url[0].path !== 'director') {
                this.canonicalService.setCanonicalURL();    
            }
        }

	}

    async ngOnChanges( changes: SimpleChanges ) {
        const { companyName, companyNumber } = changes;

        if ( ( companyName && companyName.currentValue ) || ( companyNumber && companyNumber.currentValue ) ) {

            if ( !( this.isLoggedIn ) ) {
                this.getInitialUserInfo();
            }

            await this.getCompanyDetail();
            this.tabMenuItemsInit();
        }
    }

    async ngOnInit() {

        let addons = JSON.parse(localStorage.getItem('addons'));

        if( !addons && !addons?.length ){
            this.globalServiceCommnunicate.globalServerRequestCall('get', 'DG_LOGIN', 'userAuthorizationNew').subscribe( res => {
                localStorage.setItem( 'filter', JSON.stringify(res.body.response.filters))
                localStorage.setItem( 'preferences', JSON.stringify(res.body.response.preferences))
                localStorage.setItem( 'sidebar', JSON.stringify(res.body.response.sidebar))
                localStorage.setItem( 'addons', JSON.stringify(res.body.response.addons))
                localStorage.setItem( 'types', JSON.stringify(res.body.response.types))
            } )
        }
        addons = JSON.parse(localStorage.getItem('addons'));
        
        let types = JSON.parse(localStorage.getItem('types'));

        this.typeCheckForBuyerSupplierParam = this._activatedRoute.snapshot.queryParams.companyType;
        

        this.tabMenuIndexList = this.deepFilter(this.tabMenuIndexList, types, addons);

        if ( !( this.isLoggedIn ) ) {
            this.getInitialUserInfo();
        }

        this.initBreadcrumbAndSeoMetaTags();

        this.contractFinderSupplierColumns = [
			{ field: 'name', header: 'Supplier Name', width: '160px', textAlign: 'left' },
			{ field: 'supplierReg', header: 'Company Number', width: '130px', textAlign: 'right' },
			{ field: 'address', header: 'Address', width: '130px', textAlign: 'left' },
			{ field: 'is_sme', header: 'Is SME', width: '90px', textAlign: 'left' },
			{ field: 'is_vcse', header: 'Is VCSE', width: '90px', textAlign: 'left' },
			{ field: 'postcode', header: 'Post Code', width: '120px', textAlign: 'left' },
			{ field: 'ward', header: 'Ward', width: '130px', textAlign: 'left' },
			{ field: 'constituency', header: 'Constituency', width: '90px', textAlign: 'left' },
			{ field: 'region', header: 'Region', width: '150px', textAlign: 'left' },
		];

		if (!this.typeCheckForBuyerSupplierParam) {

            this._activatedRoute.paramMap.pipe( takeUntil( this.unsubscribe$ ) ).subscribe( async params => {

                const { companyNo, companyName } = params?.['params'];
                const { queryParams } = this._activatedRoute.snapshot;
                
                if ( companyNo || companyName ) {
                    this.companyNumber = companyNo;
                    this.companyOriginalName = companyName.toLowerCase();
                }
                
                if ( queryParams?.type ) {
                    this.tabNameToBeActive = queryParams.type;
                    
                    // Removing the queryParam 'type'
                    let { type, ...restQueryParams } = queryParams;
                    let queryParamsToStr: string = '';
                    if ( Object.keys( restQueryParams ).length ) {
                        queryParamsToStr = Object.keys( restQueryParams ).map( ( key ) => `${ key }=${ restQueryParams[ key ] }` ).join('&');
                    }
                    this._location.replaceState( window.location.pathname, queryParamsToStr );

                }
                
                if ( companyNo || companyName || queryParams?.type ) {
                    await this.getCompanyDetail();
                    this.tabMenuItemsInit();
                }

            });
            
            // The below code should only work in case of navigating from the internal tab menu. ( eg: from the cards on the 'Risk Summary' tab )
            this.dataCommunicatorService.$childComponentDataCommunicator.pipe( takeUntil( this.unsubscribe$ ) ).subscribe( async tabRoute => {
                if ( tabRoute ) {
                    this.tabNameToBeActive = tabRoute;
                    this.tabMenuItemsInit();
                }
            });

		} else {

			this.companyNotExists = true;

			if (this.typeCheckForBuyerSupplierParam == 'isSupplier') {

                this.companyNumber =  this._activatedRoute.params['_value']['companyNo'];
                
				this.isSupplierScreen = true;

				this.getNonRegBuyerSupplierDataByCmpNo();

				this.isSupplierNonREGScreenDataColumns = [
                    { field: 'title', header: 'Title', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
                    { field: 'valueOfContract', header: 'Value of Contract', minWidth: '140px', maxWidth: 'none', textAlign: 'right' },
                    { field: 'contractStartDate', header: 'Contract Start Date', minWidth: '120px', maxWidth: 'none', textAlign: 'center' },
                    { field: 'contractEndDate', header: 'Contract End Date', minWidth: '120px', maxWidth: 'none', textAlign: 'center' },
                    { field: 'buyerName', header: 'Buyer Name', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
                    { field: 'procurementstage', header: 'Procurement Stage', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
                    { field: 'procurementType', header: 'Procurement Type', minWidth: '150px', maxWidth: 'none', textAlign: 'left' },
                    { field: 'locationOfContract', header: 'Region', minWidth: '200px', maxWidth: 'none', textAlign: 'left' },
                    { field: 'cpvCodes', header: 'CPV', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
                    // { field: 'notice_identifier', header: 'Notice Indentifier', minWidth: '180px', maxWidth: 'none', textAlign: 'left' },
                    // { field: 'status', header: 'Status', minWidth: '100px', maxWidth: 'none', textAlign: 'left' },
                    // { field: 'awarded_value', header: 'Award Value', minWidth: '140px', maxWidth: 'none', textAlign: 'right' },
                    // { field: 'awarded_date', header: 'Awarded', minWidth: '120px', maxWidth: 'none', textAlign: 'center' },
                    // { field: 'published_date', header: 'Published', minWidth: '120px', maxWidth: 'none', textAlign: 'center' },
                    // { field: 'closing_date', header: 'Closing Date', minWidth: '120px', maxWidth: 'none', textAlign: 'center' },
				];

				this.isBuyerNonREGScreenDataColumns = [
					{ field: 'title', header: 'Title', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'notice_identifier', header: 'Notice Indentifier', minWidth: '180px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'cpv_codes', header: 'CPV', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'status', header: 'Status', minWidth: '100px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'awarded_value', header: 'Award Value', minWidth: '140px', maxWidth: 'none', textAlign: 'right' },
					{ field: 'awarded_date', header: 'Awarded', minWidth: '120px', maxWidth: 'none', textAlign: 'center' },
					{ field: 'published_date', header: 'Published', minWidth: '120px', maxWidth: 'none', textAlign: 'center' },
					{ field: 'contract_start_date', header: 'Start Date', minWidth: '120px', maxWidth: 'none', textAlign: 'center' },
					{ field: 'contract_end_date', header: 'End Date', minWidth: '120px', maxWidth: 'none', textAlign: 'center' },
					{ field: 'closing_date', header: 'Closing Date', minWidth: '120px', maxWidth: 'none', textAlign: 'center' },
					{ field: 'ojeu_contract_type', header: 'Contract Type', minWidth: '150px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'region_array', header: 'Region', minWidth: '200px', maxWidth: 'none', textAlign: 'left' },
				];

			} else if (this.typeCheckForBuyerSupplierParam == 'isBuyer') {

                this.companyNumber =  this._activatedRoute.params['_value']['companyNo'];

				this.isBuyerScreen = true;

				this.getNonRegBuyerSupplierDataByCmpNo();

				this.isSupplierNonREGScreenDataColumns = [
                    { field: 'title', header: 'Title', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
                    { field: 'valueOfContract', header: 'Value of Contract', minWidth: '140px', maxWidth: 'none', textAlign: 'right' },
                    { field: 'contractStartDate', header: 'Contract Start Date', minWidth: '120px', maxWidth: 'none', textAlign: 'center' },
                    { field: 'contractEndDate', header: 'Contract End Date', minWidth: '120px', maxWidth: 'none', textAlign: 'center' },
                    { field: 'buyerName', header: 'Buyer Name', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
                    { field: 'procurementstage', header: 'Procurement Stage', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
                    { field: 'procurementType', header: 'Procurement Type', minWidth: '150px', maxWidth: 'none', textAlign: 'left' },
                    { field: 'locationOfContract', header: 'Region', minWidth: '200px', maxWidth: 'none', textAlign: 'left' },
                    { field: 'cpvCodes', header: 'CPV', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
                    // { field: 'notice_identifier', header: 'Notice Indentifier', minWidth: '180px', maxWidth: 'none', textAlign: 'left' },
                    // { field: 'status', header: 'Status', minWidth: '100px', maxWidth: 'none', textAlign: 'left' },
                    // { field: 'awarded_value', header: 'Award Value', minWidth: '140px', maxWidth: 'none', textAlign: 'right' },
                    // { field: 'awarded_date', header: 'Awarded', minWidth: '120px', maxWidth: 'none', textAlign: 'center' },
                    // { field: 'published_date', header: 'Published', minWidth: '120px', maxWidth: 'none', textAlign: 'center' },
                    // { field: 'closing_date', header: 'Closing Date', minWidth: '120px', maxWidth: 'none', textAlign: 'center' },
				];

				this.isBuyerNonREGScreenDataColumns = [
					{ field: 'title', header: 'Title', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'valueOfContract', header: 'Value of Contract', minWidth: '150px', maxWidth: 'none', textAlign: 'right' },
					{ field: 'contractStartDate', header: 'Contract start date', minWidth: '160px', maxWidth: 'none', textAlign: 'center' },
					{ field: 'contractEndDate', header: 'Contract end date', minWidth: '150px', maxWidth: 'none', textAlign: 'center' },
					{ field: 'supplierName', header: 'Supplier name', minWidth: '120px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'procurementstage', header: 'Procurement stage', minWidth: '120px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'procurementType', header: 'Procurement type', minWidth: '120px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'locationOfContract', header: 'Location of contract', minWidth: '120px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'cpvCodes', header: 'Industry (CPV codes)', minWidth: '180px', maxWidth: 'none', textAlign: 'left' },                    
					// { field: 'awarded_value', header: 'Buyer name', minWidth: '140px', maxWidth: 'none', textAlign: 'right' },
					// { field: 'ojeu_contract_type', header: 'Contract Type', minWidth: '150px', maxWidth: 'none', textAlign: 'left' },
					// { field: 'region_array', header: 'Region', minWidth: '200px', maxWidth: 'none', textAlign: 'left' },
				];

			}

		}

        if (this._activatedRoute.snapshot.queryParams['compNum']) {
			const params = { ...this._activatedRoute.snapshot.queryParams };

			this.downloadDocumentIntoNextPage(params.desc, params.metadata, params.compNum);

		}

        if ( this.selectedGlobalCountry == 'uk' ) {
            this.monitorAndMonitorPlusValueUpdate();
        }

	}

    deepFilter(array, requiredTypes, requiredAddons) {
        return array.reduce((acc, item) => {
            // Check if the current item has all the required types and addons
            const hasRequiredTypes = requiredTypes.some(type => item.types?.includes(type));
            const hasRequiredAddons = requiredAddons.some(addon => item.addons?.includes(addon));
    
            // Recursively filter items
            let filteredItems = [];
            if (item.items) {
                filteredItems = this.deepFilter(item.items, requiredTypes, requiredAddons);
            }
    
            // Only include the item if it meets the criteria or has valid filtered children
            if ((hasRequiredTypes && hasRequiredAddons) || filteredItems.length > 0) {
                // Include the current item and add filtered children if they exist
                acc.push({
                    ...item,
                    items: filteredItems.length > 0 ? filteredItems : undefined
                });
            }
    
            return acc;
        }, []);
    }

    getInitialUserInfo() {

        this.userAuthService.isLoggedInSubject$.pipe( takeUntil( this.unsubscribe$ ) ).subscribe( loggedIn => {
            this.isLoggedIn = loggedIn;

            if ( this.isLoggedIn ) {
                this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';
                this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';

                this.userDetails = this.userAuthService?.getUserInfo();

                if ( [ this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Premium_New_Monthly'] ].includes( this.userDetails?.planId ) ) {
                    this.premium_sub = true;
                }
            }

        });

    }

    tabMenuItemsInit() {

        let foundMenuItemByParamKey: { parentTabItem: ComponentsMenuType, parentLabel: string, childTabItem: ComponentsMenuType, childLabel: string } = {
            parentTabItem: undefined,
            parentLabel: '',
            childTabItem: undefined,
            childLabel: ''
        };

        this.tabMenuIndexList = this.filterTabMenusByCountry( this.tabMenuIndexList );
        this.tabMenuIndexList = this.filterTabMenusByPermissions( this.tabMenuIndexList );

        this.attachClickHandlerToMenuItems( this.tabMenuIndexList );
        let financialObject = this.tabMenuIndexList.find(item => item.label === 'Financial');
            if (financialObject && this.selectedGlobalCountry != 'uk') {
                financialObject.icon = 'pi pi-euro';
            }
        this.mainMenuTabItems = this.tabMenuIndexList.map( ( menuItem ) => {
            const { items, ...restMenuItems } = menuItem; // Ignoring the 'items' key fromt he object.
            if ( this.tabNameToBeActive && items && !( foundMenuItemByParamKey.childTabItem ) ) {
                let childIndx = items.findIndex( item => item?.routeParamKey === this.tabNameToBeActive );

                if ( childIndx >= 0 ) {
                    foundMenuItemByParamKey.childTabItem = ( items[ childIndx ]?.visible && !( items[ childIndx ]?.disabled ) ) ? items[ childIndx ] : undefined;
                    foundMenuItemByParamKey.parentTabItem = foundMenuItemByParamKey.childTabItem ? restMenuItems : undefined;
                    foundMenuItemByParamKey.childLabel = items[ childIndx ]?.label;
                    foundMenuItemByParamKey.parentLabel = restMenuItems.label;
                }
            }
            return restMenuItems;
        });

        if ( foundMenuItemByParamKey.parentTabItem && foundMenuItemByParamKey.childTabItem ) {
            this.parentTabMenuClickHandler( { item: foundMenuItemByParamKey.parentTabItem }, foundMenuItemByParamKey.childTabItem );
        } else {
            this.parentTabMenuClickHandler( { item: this.mainMenuTabItems[0] } );
        }

        if ( this.tabNameToBeActive ) {
            this.tabNameToBeActive = '';
            this.dataCommunicatorService.childComponentUpdateData( this.tabNameToBeActive );
        }

    }

    attachClickHandlerToMenuItems( menuItems: ComponentsMenuType[] ) {
        const RecurseMenuItems = ( inputArr: ComponentsMenuType[] ) => {
            for ( let item of inputArr ) {
                
                if ( !( item?.disabled ) ) {
                    if ( item?.component ) {
                        item.command = ( event ) => this.subTabMenuClickHandler( event );
                    }
                    
                    if ( item?.items?.length ) {
                        item.command = ( event ) => this.parentTabMenuClickHandler( event );
                        RecurseMenuItems( item.items );
                    }
                }

            }
        }

        RecurseMenuItems( menuItems );
    }

    parentTabMenuClickHandler( selectedItem, foundSubMenuItemByParamKey?: ComponentsMenuType ) {
        const ActiveTabClass = 'p-menuitem-link-active';
        const FoundMenuItem = this.tabMenuIndexList.find( val => val.label === selectedItem.item.label );
        let ActiveSubMenuTab: ComponentsMenuType = undefined;

        if ( selectedItem.item.styleClass === ActiveTabClass ) {
            return;
        }
        
        // Resetting the menu-active class
        for ( let mainTab of this.mainMenuTabItems ) {
            mainTab.styleClass = '';
        }
        selectedItem.item.styleClass = ActiveTabClass;
        
        if ( FoundMenuItem ) {
            this.subMenuTabItems = FoundMenuItem.items;
            // Resetting the menu-active class
            for ( let subTab of this.subMenuTabItems ) {
                subTab.styleClass = '';
            }

            if ( foundSubMenuItemByParamKey ) {
                ActiveSubMenuTab = foundSubMenuItemByParamKey;
            } else {
                const PropertyRegTabEnabled = this.subMenuTabItems.find( val => ( val.label == 'Property Register' ) && val?.visible && !( val?.disabled ) );
                const FirstEnabledTab = this.subMenuTabItems.find( val => val?.visible && !( val?.disabled ) );
    
                ActiveSubMenuTab = ( FoundMenuItem.label === 'Assets' && PropertyRegTabEnabled ) || FirstEnabledTab;
            }

            if ( ActiveSubMenuTab ) {
                ActiveSubMenuTab.styleClass = ActiveTabClass;
                this.setComponentToView( ActiveSubMenuTab.component );
            } else {
                this.TabComponentViewContainer.clear();
            }
            
        }

    }

    subTabMenuClickHandler( selectedItem ) {
        const ActiveTabClass = 'p-menuitem-link-active';
        const foundMenuItemInParent = this.mainMenuTabItems.find( val => val.label === selectedItem.item.label );

        if ( selectedItem.item.styleClass === ActiveTabClass ) {
            return;
        }
        
        if ( foundMenuItemInParent ) {
            // Resetting the menu-active class
            this.mainMenuTabItems.map( val => {
                val.styleClass = '';
            });
            this.subMenuTabItems = [];
        } else {
            // Resetting the menu-active class
            this.subMenuTabItems.map( val => {
                val.styleClass = '';
            });
        }

        selectedItem.item.styleClass = ActiveTabClass;

        this.setComponentToView( selectedItem.item.component );
    }

    async setComponentToView( componentCallback: Function ) {
        const ComponentMeta = await componentCallback();

        if ( this.TabComponentViewContainer ) {
            this.TabComponentViewContainer.clear();
            this.TabComponentViewContainer.createComponent( ComponentMeta );
        }
    }

    monitorAndMonitorPlusValueUpdate() {

        this.moreButtonListItems = [
            { label: 'Monitor Plus', icon: this.iconObj['monitorPlus'], command: () => { this.iconObj['monitorPlus'] == 'pi pi-eye' ? this.showAddToMonitorPlus() : this.removeFromWatchListPlus() }, disabled: !this.userAuthService.hasAddOnPermission('companyMonitorPlus') },
            { label: 'Monitor', icon: this.iconObj['monitor'] , command: () => { this.iconObj['monitor'] == 'pi pi-eye' ? this.showAddToMonitor() : this.removeFromWatchList() }, visible: ['admin', 'default'].includes( JSON.parse(localStorage.getItem('types'))[0] ) ? true : false },
            { label: 'Notes', icon: 'ui-icon-note-add', command: () => { this.showAddNoteModal(undefined) }, visible: true },
            { label: 'Push To Salesforce', icon: 'pi pi-cog', disabled: !this.isLoggedIn || this.userDetails?.isTrial, command: () => { this.syncSalesforce() }, visible: true },
            { label: 'Push To HubSpot', icon: 'pi pi-cog', disabled: !this.isLoggedIn || this.userDetails?.isTrial, command: () => { this.checkPlanStatus('hubspot') }, visible: true },            
            { label: 'Push to Leasepath', icon: 'pi pi-cog', disabled: !this.isLoggedIn || this.userDetails?.isTrial, command: () => { this.pushLeasepath() }, visible: true },
            { label: 'Compare', icon: 'ui-icon-compare', command: () => { this.compareDeatails(this.companyData) }, visible: !JSON.parse(localStorage.getItem('types')).includes('public') ? true: false }
        ];

        this.reportButtonItems = [
            { label: 'Company Report', icon:"pi pi-file-pdf", command: () => { this.companyReportButtonBool = true; } },
            { label: 'Full Credit Report', icon:"pi pi-file-pdf", command: () => { this.fullCreditReportButtonBool = true; } },
            { label: 'Enterprise Report', icon:"pi pi-file-pdf", command: () => { this.enterpriseReportButton = true }, visible: this.userAuthService.hasAddOnPermission('enterpriseReport') }
        ];

    }

    pushLeasepath(){
		this.msgs = [];
		this.msgs.push({ 
			severity: 'success', summary:'Lead Pushed to Leasepath Successfully.',
		});
		setTimeout(() => {
			this.msgs = [];
		}, 3000);
	}

    initBreadcrumbAndSeoMetaTags() {
        this.canonicalService.setCanonicalURL();    
    }

    filterTabMenusByCountry( inputTabMenuItems: ComponentsMenuType[] ): ComponentsMenuType[] {
        let filterdTabItems: ComponentsMenuType[] = [];

        filterdTabItems = inputTabMenuItems.filter( item => {
            if ( item?.items && item?.items.length ) {
                item.items = this.filterTabMenusByCountry( item.items );
            }
            return item.countryAccess.includes( this.selectedGlobalCountry );

        });

        return filterdTabItems;
    }

    filterTabMenusByPermissions( inputTabMenuItems: ComponentsMenuType[] ): ComponentsMenuType[] {

        inputTabMenuItems.map( item => {
    
            item.disabled = false;

            if ( item?.items && item?.items.length ) {
                item.items = this.filterTabMenusByPermissions( item.items );

                const checkIfAllSubItemsEnabled = item.items.filter( val => val.visible && !val.disabled );
                if ( checkIfAllSubItemsEnabled?.length === 0 ) {
                    item.disabled = true;
                }
            }

            if ( item?.state ) {
                
                if ( !( this.isLoggedIn ) && !( item?.isPublic ) ) {
                    item.disabled = true;
                } else {
        
                    if ( item.state?.visibilityCheck?.length ) {
                        item.visible = item.state.visibilityCheck.map( ( dataKey: string ) => !!( this.companyData && this.companyData?.[ dataKey ] ) )[0];
                    }
    
                    if ( item.visible ) {
                        if ( item.state?.addOnCheck ) {
                            item.disabled = item.state.addOnCheck.map( ( dataKey: keyof UserAddOnType ) =>  !( this.userAuthService.hasAddOnPermission( dataKey ) ) )[0];
                        }
            
                        if ( !( item?.disabled ) && item.state?.disabilityCheck ) {
                            item.disabled = !( this.userAuthService.hasFeaturePermission( item?.state?.disabilityCheck ) );
                        }
                    }
                    
                }
                
            }


        });

        return inputTabMenuItems;
    }

    getMessage(event) {
        
        if( event.hasOwnProperty('creditReportPdfLimit') ) {
            this.creditLimitCheck = event.creditReportPdfLimit;
        }
        
        if( event.status !== undefined && event.msgs !== undefined ) {

            this.msgs = [];
            this.msgs.push({ severity: event.status, summary: event.msgs });
            
            setTimeout(() => {
                this.msgs = [];
            }, 4000);

        }
        
    }

	async getCompanyDetail() {
        let apiEndPoint = ( this.isLoggedIn || CompaniesEligibleForDataWithoutLogin.includes( this.companyNumber )) ? 'companyOverview' : 'infoByCompanyNumberPublic';

        let obj = [ this.companyNumber ];

        const CompanyDetailsAPIRes = await lastValueFrom( this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_API', apiEndPoint, obj ) );

        if ( CompanyDetailsAPIRes ) {

            this.companyData = CompanyDetailsAPIRes?.body;

            if ( this.companyData?.amountBandsInPounds ) {
                this.companyData.amountBandsInPounds = this.furloughDataFormat( this.companyData.amountBandsInPounds );
            }

            this.nameOfCompany = this.titleCasePipe.transform( this.companyData.businessName );

            if ( this.companyData?.companyRegistrationNumber ) {
                this.companyAddress = this.commonService.formatCompanyAddress(this.companyData?.RegAddress_Modified);
            }

            if ( !this.sidePanelView ) {
                let regex =/-/g;
                
                MetaContentSEO.companyDetails.title = this.titleCasePipe.transform(this.companyOriginalName.replace(regex,' ')) + ' | ' + this.companyNumber.toString().toUpperCase() + ' | UK Business Information';

                this.seoService.setPageTitle( MetaContentSEO.companyDetails.title );
                this.seoService.setMetaTitle( MetaContentSEO.companyDetails.title );

                if ( this.companyData?.companyType ) {
                    MetaContentSEO.companyDetails.description = this.nameOfCompany + ' (' + this.companyNumber.toString().toUpperCase() + ') is a ' + this.companyData?.companyType.toString().toLowerCase() + ' company located in ' + this.companyAddress + '.';

                    this.seoService.setDescription( MetaContentSEO.companyDetails.description );
                }
            }
            
            if ( !( this.companyData?.companyRegistrationNumber ) ) {

                this.companyData = [];
                this.companyOriginalName = this.companyOriginalName.replace( /-/g, ' ' );
                this.companyNotExists = true;

            } else {
                
                this.newUrlForCompanyLogo = this.companyData['company_contact_info_latest']?.logo_url?.replace("companylogoupdated", "companyLogoUpdated");

                this.parseCompanyDetail(this.companyData, "Overview");
                
                if ( this.isLoggedIn ) {

                    if ( this.companyData['companyRegistrationNumber'] ) {
                        this.fetchFavouritesData( this.companyData['companyRegistrationNumber'].toString() );
                    }

                    if ( this.companyData['previousNames'] ) {
                        this.companyData['previousNames'] = this.companyData['previousNames'].sort((a, b): any => {
                            let prevDate: any = this.commonService.changeToDate(a.dateChanged),
                                newDate: any = this.commonService.changeToDate(b.dateChanged);

                            if (newDate < prevDate) return -1;
                            if (newDate > prevDate) return 1;
                        });
                    }

                    this.fetchWatchList();

                    this.fetchWatchListPlus();

                    this.saveInRecents();

                }

                this.dataCommunicatorService.updateData( this.companyData );
            }
            
        };
        
        if ( this.isLoggedIn ) {

            let userLimits = await this.globalServiceCommnunicate.getUserExportLimit();
            this.creditLimitCheck = userLimits && userLimits.creditReportLimit ? userLimits.creditReportLimit : 0;
            
        }
        
	}

    parseCompanyDetail(data, from): void {
        this.companyData = data;
        
        if ( this.companyData['directorsData'] && ['Overview', 'director'].includes(from) ) {

            if(this.companyData['companyStatus'] === 'dissolved') {
                this.companydirectorStatusCounts.total = this.companyData['totalDirectorsCount'];
                this.companydirectorStatusCounts.active = 0;
                this.companydirectorStatusCounts.inactive = this.companyData['activeDirectorsCount'];
                this.companydirectorStatusCounts.resigned = this.companyData['resignedDirectorsCount'];
            } else {
                this.companydirectorStatusCounts.total = this.companyData['totalDirectorsCount'];
                this.companydirectorStatusCounts.active = this.companyData['activeDirectorsCount'];
                this.companydirectorStatusCounts.inactive = 0;
                this.companydirectorStatusCounts.resigned = this.companyData['resignedDirectorsCount'];
            }

            this.directorDetails = this.companyData['directorsData'];

            this.directorDetails = this.directorDetails.sort( (a, b): any => {
                let prevResignedDate: any = this.commonService.changeToDate(a.fromDate),
                newResignedDate: any = this.commonService.changeToDate(b.fromDate);
                if (prevResignedDate < newResignedDate) return -1;
                if (prevResignedDate > newResignedDate) return 1;
            });

            this.directorDetails = this.directorDetails.sort( (a, b): any => {
                let prevResignedDate: any = this.commonService.changeToDate(a.toDate),
                newResignedDate: any = this.commonService.changeToDate(b.toDate);
                if (prevResignedDate < newResignedDate) return -1;
                if (prevResignedDate > newResignedDate) return 1;
            });

            for (let i = 0; i < this.directorDetails.length; i++) {
                if ((this.directorDetails[i].directorPnr)){
                    this.disqualifiedDeletedExceptionDirectors.push(this.directorDetails[i].directorPnr);
                }
            }

            if ( this.isLoggedIn ) {
                this.disqualifiedDirectorDetails();
            }

            this.directorOverviewArray = this.directorDetails.filter((obj) => obj.status == 'active')
            this.companyData['directorsData'] = this.directorDetails.sort((a,b) => (a.status > b.status) ? 1 : -1);

            if (from == "director") {
                return
            }
        }

        if ( this.companyData['RegAddress_Modified'] ) {
            
            this.companyData['companyAddress'] = this.commonService.formatCompanyAddress(this.companyData['RegAddress_Modified']);

            if (this.companyData['RegAddress_Modified'].website !== undefined && this.companyData['RegAddress_Modified'].website !== null &&
                !(this.companyWebsites.includes(this.companyData['RegAddress_Modified'].website.toLowerCase()))) {
                this.companyWebsites.push(this.companyData['RegAddress_Modified'].website.toLowerCase());
            }

            this.companyData['companyWebsites'] = this.companyWebsites;

        }

        if (this.companyData['landCorporateInfo']) {
            for (let i = 0; i < this.companyData['landCorporateInfo'].length; i++) {
                this.companyData['landCorporateInfo'][i] = Object.assign(this.companyData['landCorporateInfo'][i], this.companyData['landCorporateInfo'][i]._source);
                delete this.companyData['landCorporateInfo'][i]._source;
            }
        }

    }

    disqualifiedDirectorDetails() {
        let obj = { "pnr": this.disqualifiedDeletedExceptionDirectors }
        this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_DIRECTOR_DETAILS', 'disqualifiedDirectors', obj).subscribe(res => {
            if (res.body.status == 200) {
                if (res.body.results.length > 0) {

                    this.disqualifiedDirectorsCount = res.body.results.length;

                    for (let dirDetail of this.directorDetails) {

                        for (let disqualifiedDirDetail of res.body.results) {
                            if (dirDetail.directorPnr == disqualifiedDirDetail.PNR) {
                                dirDetail['disqualifiedDirectors'] = disqualifiedDirDetail;
                            }
                        }
                    }
                }
            }
        })
    }

	saveInRecents() {
		let obj = {
			userid: this.userDetails?.dbID,
			companyNumber: this.companyNumber,
			companyName: this.companyData['businessName']
		}
        this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'saveRecentCompanies', obj).subscribe(res => {});
	}

    showCompanyProfileShareOverlay( elmId, event ) {

        if ( this.userAuthService.hasFeaturePermission('Company Profile Social Share') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
            elmId.toggle(event);
        } else {
            this.showUpgradePlanDialog = true;
        }
    }

    furloughDataFormat(str){
        if (str) {
            let strArray = str.split(" ")
            strArray[0] = this.decimalPipe.transform( parseFloat(strArray[0]) )
            strArray[1] = this.titleCasePipe.transform( strArray[1] )
            strArray[2] = this.decimalPipe.transform( parseFloat(strArray[2]) )
            str = strArray.join("  ")
            return str
        } else {
            return str
        }
    }

	// Add / Remove Watchlist Methods Starts
	
    fetchWatchList() {
        let obj = {
            userid: this.userDetails?.dbID,
            companyNumber: this.companyData['companyRegistrationNumber'],
            companyName: this.companyData['businessName']
        }

        this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'checkCompanyInWatchList', obj).subscribe(res => {
            if (res.body.status == 200) {
                if (res.body['results'] == true) {
                    this.iconObj['monitor'] = 'pi pi-eye-slash'
                    this.watchListStatus = res.body['results'];
                    this.monitorAndMonitorPlusValueUpdate();
                }
            }
        });
    }

    fetchWatchListPlus() {
        let obj = {
            userid: this.userDetails?.dbID,
            companyNumber: this.companyData['companyRegistrationNumber'],
            companyName: this.companyData['businessName']
        }

        this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'checkCompanyInWatchListPlus', obj).subscribe(res => {
            if (res.body.status == 200) {
                if (res.body['results'] == true) {
                    this.iconObj['monitorPlus'] = 'pi pi-eye-slash';
                    this.watchListPlusStatus = res.body['results'];
                    this.monitorAndMonitorPlusValueUpdate();
                }
            }
        });
    }

    removeFromWatchList() {
        let obj = {
            userid: this.userDetails?.dbID,
            companyNumber: this.companyData['companyRegistrationNumber'],
            companyName: this.companyData['businessName']
        }

        this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'removeFromWatchList', obj).subscribe(res => {
            if (res.body.status == 200) {
                this.watchListStatus = false;
                this.iconObj['monitor'] = 'pi pi-eye';
                this.msgs = [{ severity: 'success', detail: this.constantMessages['successMessage']['companyMonitorRemovedSuccess'] }];
                setTimeout(() => {
					this.msgs = [];
				}, 2000);
                this.monitorAndMonitorPlusValueUpdate()
            } 
        });
    }

    removeFromWatchListPlus() {
        let obj = {
            userid: this.userDetails?.dbID,
            companyNumber: this.companyData['companyRegistrationNumber'],
            companyName: this.companyData['businessName']
        }

        this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'removeFromWatchListPlus', obj).subscribe(res => {
            
            if (res.body.status == 200) {
                this.msgs = [{ severity: 'success', detail: this.constantMessages['successMessage']['companyMonitorPlusRemovedSuccess'] }];
                this.watchListPlusStatus = false;
                this.iconObj['monitorPlus'] = 'pi pi-eye';
                setTimeout(() => {
					this.msgs = [];
				}, 2000);
                this.monitorAndMonitorPlusValueUpdate()
            }
        });
    }

    saveWatchList() {

        if ( this.isLoggedIn ) {

            if ( this.userAuthService.hasFeaturePermission('Company Monitor') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {

                let obj = {
                    userid: this.userDetails?.dbID,
                    companyNumber: this.companyData['companyRegistrationNumber'],
                    companyName: this.companyData['businessName']
                }
                let reqObj = {
                    // userId: this.userDetails?.dbID
                }
                this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getUserExportLimit').subscribe(res => {
                    let userData = res.body.results[0];

                    if ( userData && userData.companyMonitorLimit > 0 ) {
                        
                        this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'saveWatchListCompanies', obj).subscribe(res => {
                            let data = res.body
                            if ( data.status >= 200 && data.status < 300 ) {
                                this.monitorPopUpBool = false;
                                this.iconObj['monitor'] = 'pi pi-eye-slash';
                                this.msgs = [];
                                this.msgs.push({ severity: 'success', detail: data.message });
                                setTimeout(() => {
                                    this.msgs = [];
                                }, 2000);
                                this.monitorAndMonitorPlusValueUpdate()
                                this.watchListStatus = true;
                            }else {
                                this.monitorPopUpBool = false;
                                this.iconObj['monitor'] = 'pi pi-eye-slash';
                                this.msgs = [];
                                this.msgs.push({ severity: 'info', detail: data.message });
                                setTimeout(() => {
                                    this.msgs = [];
                                }, 2000);
                            }

                        });
                        
                    } else {
                        this.msgs = [];
                        this.msgs.push({ severity: 'info', detail: this.constantMessages['limitDeductionMessage']['noLimitMonitorMessage'] });
                        setTimeout(() => {
                            this.msgs = [];
                        }, 2000);
                    }
                });

            } else {
                this.showUpgradePlanDialog = true;
            }

        } else {
            this.showLoginDialog = true;
        }

    }

    showAddToMonitorPlus() {
        this.monitorPlusPopUpBool = true;
        this.monitorPopUpBool = false;
    }

    showAddToMonitor() {
        this.monitorPopUpBool = true;
        this.monitorPlusPopUpBool = false;
    }

    saveWatchListPlus() {
   
        if ( this.isLoggedIn ) {

            let obj = {
                userid: this.userDetails?.dbID,
                companyNumber: this.companyData['companyRegistrationNumber'],
                companyName: this.companyData['businessName']
            }
            // let reqObj = {
            //     // userId: this.userDetails?.dbID
            // }

            this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getUserExportLimit').subscribe(res => {

                let userData = res.body.results[0];
                if ( userData && userData.companyMonitorPlusLimit > 0 ) {
                    this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'saveWatchListCompaniesPlus', obj).subscribe(res => {
                        let data = res.body
                        if ( data.status >= 200 && data.status < 300) {
                            this.iconObj['monitorPlus'] = 'pi pi-eye-slash';
                            this.monitorPlusPopUpBool = false;
                            this.msgs = [];
                            this.msgs.push({ severity: 'success', detail: data.message });
                            setTimeout(() => {
                                this.msgs = [];
                            }, 2000);
                            this.monitorAndMonitorPlusValueUpdate();
                            this.watchListPlusStatus = true;
        
                        } else { 
                            this.iconObj['monitorPlus'] = 'pi pi-eye-slash';
                            this.monitorPlusPopUpBool = false;
                            this.msgs = [];
                            this.msgs.push({ severity: 'info', detail: data.message });
                            setTimeout(() => {
                                this.msgs = [];
                            }, 2000);
                        }
                    });

                } else {
                    this.msgs = [];
                    this.msgs.push({ severity: 'info', detail: this.constantMessages['limitDeductionMessage']['noLimitMonitorPlusMessage'] });
                    setTimeout(() => {
                        this.msgs = [];
                    }, 2000);
                }
            });

        } else {
            this.showLoginDialog = true;
        }

    }
	// Add / Remove Watchlist Methods End


	// Add / Remove Favourits Methods Starts

    addToFavouriteList() {

        if ( this.isLoggedIn ) {

            if ( this.favouritesListId === undefined ) {

                setTimeout(() => {
                    this.addToFavouriteList();
                }, 1000);

                return 
            }

            let obj = {
                companies: [ this.companyData['companyRegistrationNumber'] ],
                userId: this.userDetails?.dbID,
                _id: this.favouritesListId,
                listName: "Favourites"
            }

            this.favouriteListStatus = true;

            this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'editListOrAddCompanies', obj).subscribe(res => {

                this.msgs = [];
    
                this.msgs.push({ severity: 'success', detail: this.constantMessages['successMessage']['addedFavouriteSuccess'] });

                this.checkifFavouriteListIsOpenedOnBrowser();

                setTimeout(() => {
                    this.msgs = [];
                }, 2000);
    
            });

        } else {
            this.showLoginDialog = true;
        }
    }

    checkifFavouriteListIsOpenedOnBrowser() {
        const urlParams = new URLSearchParams(this.queryString);

        if ( urlParams.get('cListId') !== undefined ) {

            if( urlParams.get('cListId') == this.favouritesListId ) {

                let clistLength = +urlParams.get('cListLength') - 1;

                if ( !CustomUtils.isNullOrUndefined( urlParams.get('reload') ) ) {
                    this.router.navigate(['/company-search/Favourites'], { queryParams: { cListId : this.favouritesListId, cListLength: clistLength, listName: 'Favourites' } });
                } else {
                    this.router.navigate(['/company-search/Favourites'], { queryParams: { cListId : this.favouritesListId, cListLength: clistLength, reload : 'true', listName: 'Favourites' } });
                }
            }

        }
        
    }

    fetchFavouritesData(cmpNo) {
        let obj = {
            userid: this.userDetails?.dbID,
            listName: "Favourites",
            companyNo: cmpNo
        };
        
       let  selectobj = [  obj.listName, obj.companyNo ];
        this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getUserFavouritesLists', selectobj).subscribe(res => {
            if ( res.body && res.body.length > 0 ) {
                this.favouritesListId = res.body[0]._id;
                this.favouriteListStatus = res.body[0].companiesInList;
            }
        });
    }

    removeFromFavouriteList() {
        let obj = {
            CompanyNumber: this.companyData['companyRegistrationNumber'],
            listId: this.favouritesListId,
        }
        this.favouriteListStatus = false;
		
        this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'deleteCompaniesFromList', obj).subscribe(res => {
            if (res.body.status == 200) {
                this.isFavourite = false;

                this.msgs = [{ severity: 'success', detail: this.constantMessages['successMessage']['removeFavouriteSuccess'] }];

                this.checkifFavouriteListIsOpenedOnBrowser();

                setTimeout(() => {
                    this.msgs = [];
                }, 2000);
            }
        });
    }
	// Add / Remove Favourits Methods Ends
	
	
	// Add / Remove Notes Methods Starts

    getNotes() {
        let obj = {
            userid: this.userDetails?.dbID,
            companyNumber: this.companyData['companyRegistrationNumber']
        }
        this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'getNotes', obj).subscribe(res => {
            this.sharedLoaderService.hideLoader();

            if ( res.body['status'] == 200 ) {
                this.notesData = res.body['results'];
            }

        });
    }

    showAddNoteModal(data) {

        if ( this.isLoggedIn ) {

            if ( this.userAuthService.hasFeaturePermission('Company Notes') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {

				if (data !== undefined) {
					this.companyNoteValue = data.notes;
					this.notesId = data._id;
					this.showAddNoteModalBool = true;
				} else {
					this.showAddNoteModalBool = true;
				}
            } else {
                this.showUpgradePlanDialog = true;
            }

        } else {
            this.showLoginDialog = true;
        }
        
    }

    addNotes() {

        if ( this.isLoggedIn ) {
            
            let obj = {
                userid: this.userDetails?.dbID,
                notes: this.companyNoteValue,
                companyNumber: this.companyData['companyRegistrationNumber'],
                CompanyNameOriginal: this.companyData['businessName']
            }
            if (this.notesId !== undefined) {
                obj['notesId'] = this.notesId;
                this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'updateNotesCompany', obj).subscribe(res => {
                    if (res.body.status == 200) {
                        this.companyNoteValue = '';
                        this.notesId = undefined;
                        this.showAddNoteModalBool = false;
                        this.getNotes();
                    }
                });
            }
            else {
                obj["updatedOn"] = new Date().toISOString();
                this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'addNotesCompany', obj).subscribe(res => {
                    if (res.body.status == 200) {
                        this.companyNoteValue = '';
                        this.showAddNoteModalBool = false;
                        // this.getNotes();
                        /*
                        this.goToTab( NotesComponent );
                        */
                        this.msgs = [];
                        this.msgs.push({ severity:'success', summary:this.constantMessages['successMessage']['notesAddedSuccess'], detail:'' });
                        setTimeout(() => {
                            this.msgs = [];
                        }, 2000);
                    }
                });
            }

        } else {
            this.showLoginDialog = true;
        }

    }

    deleteNotes() {
        if (this.notesId !== undefined) {
            var notesID = this.notesId
        }
        let obj = {
            notesId: notesID
        }
        this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'deleteNotesCompany', obj).subscribe(res => {
            if (res.body.status == 200) {
                this.companyNoteValue = '';
                this.showAddNoteModalBool = false;
                this.getNotes();
                this.notesId = undefined;
            }
        })

    }

    cancelNotes() {
        this.companyNoteValue = '';
    }

	// Add / Remove Notes Methods Ends
	

	// Commom Feature Methods List Here

    reduceExportLimit(newLimit, thisPage) {
        let obj = {
            userId: this.userDetails?.dbID,
            thisPage: thisPage,
            newLimit: newLimit
        }

        this.globalServiceCommnunicate.reduceExportLimit(obj);
    }

    formatCompanyNameForUrl(companyName) {
        return this.commonService.formatCompanyNameForUrl( companyName );
    }

    formatDate(date) {
        return this.commonService.formatDate( date );
    }

    calculateAge(dob) {
        return this.commonService.calculateAge( dob );
    }

    calculateAccountOverduePeriod( overdueDate ) {
        let todayDate = new Date(),
            dueDate = this.commonService.changeToDate( overdueDate );
        
        return todayDate > dueDate;
    }

    getSICCodeInArrayFormat(SICCode) {
        return this.commonService.getSICCodeInArrayFormat(SICCode);
    }

    syncSalesforce() {

        let userId = [ this.userDetails?.dbID ];

        this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_SALESFORCE', 'salesforceUserData', userId).subscribe(res => {
            if( res.body.status === 200 ) {
                if( res.body.results[0]?.refreshToken ) {
                    let obj = {
                        "refresh_token": res.body.results[0]?.refreshToken,
                        "client_id": this.salesForceConstant.ClientId,
                        "client_secret": this.salesForceConstant.SecrectKey,
                        "companyNumber" : this.companyNumber,
                        "domain": res.body.results[0].domain,
                        "apiKey": res.body.results[0].apiKey
                    }

                    this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_SALESFORCE', 'syncSalesforceData', obj).subscribe(res => {
                        if(res.body.status === 200) {
                            if(this.companyData['companyStatus'] == 'dissolved'){
                                this.msgs = [];
                                this.msgs = [{ severity: 'error', detail: "Warning! You can only transfer data from 'Live' status companies." }];
                                setTimeout(() => {
                                    this.msgs = [];
                                }, 4000);
                            } else {
                                this.msgs = [];
                                this.msgs = [{ severity: 'success', detail: res.body.access_token.Message }];
                                setTimeout(() => {
                                    this.msgs = [];
                                }, 4000);
                            }
                        } else {
                            this.msgs = [];
							this.msgs = [{ severity: 'error', detail: 'Token has expired!!' }];
							setTimeout(() => {
								this.msgs = [];
							}, 4000);
                        }
                    });
                } else {
                    this.msgs = [];
					this.msgs = [{ severity: 'info', detail: 'Please contact for salesforce integration!!' }];
					setTimeout(() => {
						this.msgs = [];
					}, 4000);
                }

            } else {
                this.msgs = [];
				this.msgs = [{ severity: 'info', detail: 'Please contact for salesforce integration!!' }];
				setTimeout(() => {
				    this.msgs = [];
				}, 4000);
            }
        });       
    }

    downloadDocumentIntoNextPage(description, document_metadata, CompanyNumber) {

		let event: Event;

		if ( this.isLoggedIn ) {

			let document_name: string = description + CompanyNumber + ".pdf";

			if ( ( ( [ this.subscribedPlanModal['Start'], this.subscribedPlanModal['Monthly_Expand'], this.subscribedPlanModal['Expand_Annual_One_Year'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Expand_Annual_Two_Year'], this.subscribedPlanModal['Expand_New_Monthly'], this.subscribedPlanModal['Monthly_Expand_Paid_Test'], this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Expand'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Annually_Expand_Trial'], this.subscribedPlanModal['Monthly_Expand_Trial'], this.subscribedPlanModal['Expand_Weekly_Trial'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Compliance_Plan'] ].includes( this.userDetails?.planId ) && this.userDetails?.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) ) {

                let obj = {
                    metadata: document_metadata + '/content',
                    doc_name: document_name
                };

                this.globalServiceCommnunicate.globalServerRequestCall('post', 'DG_API', 'getDocument', obj).subscribe(res => {
                    if (res.status === 200) {
                        if (res.body["document_url"]) {
                            let url: string = res.body["document_url"];
                            this.downloadDocument(url, document_name);
                        }
                    }
                },
                    () => {
                    }
                );

			} else {
				event.preventDefault();
				event.stopPropagation();
				this.showUpgradePlanDialog = true;
			}

		} else {
			this.showLoginDialog = true;
		}
	}

    downloadDocument(document_url, document_name) {
		var link = document.createElement('a');
		link.href = document_url;
		link.download = document_name;
		link.click();
	}

    upgradeToPremiumPlan() {
        window.open(
            'https://datagardener.com/contact/', '_blank'
			// 'https://datagardener.com/premium-plan-request', '_blank'
		);
    }

    //Switch to Buyer Screen Table Data
    
    getNonRegBuyerSupplierDataByCmpNo() {
        let reqobj = [ this.companyNumber ];
        this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_GOVTENABLER_API', 'getNonRegBuyerSupplierDataByCmpNo', reqobj ).subscribe(res => {
        // this.companyService.getNonRegBuyerSupplierDataByCmpNo(this.companyNumber).then( data=> {

			if ( res.body['status'] == 200 ) {

				this.companyNumberForBuyerAndSupplier = res.body['companyRegistrationNumber'];
				this.supplierTabBoolean = res.body['isSupplier'];
				this.buyerTabBoolean = res.body['isBuyer'];
				this.buyerAndSupplierDetails = res.body['results'];
                this.supplierData = res.body?.results?.supplierDataObject || {};

                this.dataForGraph = this.buyerAndSupplierDetails?.['buyerDataObject']?.['procurementStatus'];
                this.procurementStageBarChartData( res.body['results']?.['buyerDataObject']?.['contractProcurementStage'] );
                this.contractBarChartData( res.body['results']?.['buyerDataObject']?.['contractType'] );
                // Non Reg Buyer Tab Charts Starts

				if ( this.buyerTabBoolean ) {

					this.buyerDetails = this.buyerAndSupplierDetails['buyerDataObject'];
					this.isBuyerNonREGScreenDataValue = this.buyerDetails['contractbuyerArray'];

                    // this.awardAmountDataSet = this.formatDataForGraph(this.buyerDetails.contractsProvidedChartData, "year");
                    // this.awardCountDataSet = this.formatDataForGraph(this.buyerDetails.contractsProvidedChartData, "count");

    
                    this.contractEndingTrendOptions = {
                        categoryPercentage: 0.3,
                        barPercentage: 0.6,
                        layout: {
                            padding: { left: 10, right: 10 }
                        },
                        scales: {
                            y: {
                                ticks: {
                                    beginAtZero: true,
                                    font: {
                                        family: 'Roboto',
                                        style: 'normal',
                                    },
                                    color: '#bbb',
                                    padding: 10
                                },
                                grid: {
                                    display: true,
                                    drawBorder: false,
                                    drawTicks: false,
                                    tickLength: 0,
                                    borderDash: function ( context ): any {
                                        if ( context.tick.value > 0 ) {
                                            return [5, 10]
                                        }
                                    },
                                    color: context => context.index == 0 ? 'rgba(0, 0, 0, 0.2)' : '#bbb'
                                },
                                display: true,
                                title: {
                                    show: true,
                                }
                            },
                            x: {
                                ticks: {
                                    font: {
                                        size: 14,
                                        family: 'Roboto',
                                        style: 'normal',
                                    },
                                    color: '#bbb',
                                    padding: 3
                                },
                                grid: {
                                    display: false,
                                    color: '#bbb'
                                }
                            }
                        },
                        plugins: {
                            datalabels: {
                                display: false,
                            },
                            legend: {
                                display: false,
                            },
                            title: {
                                fontFamily: 'Roboto',
                                text: 'Contract Trends',
                                display: true
                            },
                            tooltip: {
                                enables: true,
                                callbacks: {
                                    label: function (tooltipItem, label) {
                                        return ((tooltipItem.yLabel).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(".00", ""));
                                    }
                                }
                            },
                        },
                        hover: {
                            onHover: (event, elements) => {
                                event.target.style.cursor = elements[0] ? "pointer" : "default";
                            }
                        }
                    }
    
                    this.contractEndingTrendData = {
                        labels: this.awardAmountDataSet,
                        datasets: [
                            {
                                data: this.awardCountDataSet,
                                backgroundColor: '#42A5F5',
                                borderColor: ["rgba(33, 195, 181, 1)"],
                                borderWidth: 1,
                                fill: 'origin',
                                pointRadius: 4,
                                pointBackgroundColor: '#21c3b5',
                                label: 'Contracts Award Amout',
                                pointStyle: 'circle'
                            }
                        ]
                    }
    
                    this.overallDoughnutOptions = {
                        cutout: 40,
                        plugins: {
                            datalabels: {
                                display: false,
                            },
                            legend: {
                                display: false
                            },
                            tooltip: {
                                enabled: true
                            },
                            elements: {
                                arc: {
                                    borderWidth: 4
                                }
                            },
                        },
                        animation: {
                            duration: 3000,
                            easing: 'easeInOutQuad'
                        }
                    };
    
                    this.overallDoughnutData = {
                        labels: ['Awarded Count', 'Closed Count', 'Open Count'],
                        datasets: [
                            {
                                data: [ this.buyerDetails?.buyersContractAwardStatus?.awarded, this.buyerDetails?.buyersContractAwardStatus?.closed, this.buyerDetails?.buyersContractAwardStatus?.open ],
                                backgroundColor: [
                                    '#2cf9ad', '#1fae79', '#126445'
    
                                ]
                            }
                        ]
                    }

				}


                // Non Reg Buyer Tab Charts Ends

                // Non Reg Suppliers Tab Charts Starts

                if ( this.supplierTabBoolean ) {

					this.supplierDetails = this.buyerAndSupplierDetails['supplierDataObject'];
					this.isSupplierNonREGScreenDataValue = this.supplierData['contractSupplierArray'];

                    this.dataForSupplierGraph = this.supplierData?.['contractProcurementStatus'];
                    this.procurementStageBarChartData( this.supplierData?.['contractProcurementStage'] );
                    this.contractBarChartData( this.supplierData?.['contractType'] );
                    
                    // this.barLabels = this.formatDataForGraph( this.supplierDetails.contractsWonChartData, "year" );
                    // this.barDataset = this.formatDataForGraph(this.supplierDetails.contractsWonChartData, "count");
    
                    // this.lineLabels = this.formatDataForGraph( this.supplierDetails.contractsEndingChartData, "year" );
                    // this.lineDataSet = this.formatDataForGraph( this.supplierDetails.contractsEndingChartData, "count" );
    
                    this.barOptions = {
                        categoryPercentage: 0.3,
                        barPercentage: 0.6,
                        layout: {
                            padding: { left: 10, right: 10 }
                        },
                        scales: {
                            y: {
                                ticks: {
                                    beginAtZero: true,
                                    font: {
                                        family: 'Roboto',
                                        style: 'normal',
                                    },
                                    color: '#bbb',
                                    padding: 10,
                                    callback: (label) => {
                                        return label ?  this.toNumberSuffix.transform(label, 0) : 0;
                                    }
                                },
                                grid: {
                                    display: true,
                                    drawBorder: false,
                                    drawTicks: false,
                                    tickLength: 0,
                                    borderDash: function ( context ): any {
                                        if ( context.tick.value > 0 ) {
                                            return [5, 10]
                                        }
                                    },
                                    color: context => context.index == 0 ? 'rgba(0, 0, 0, 0.2)' : '#bbb'
                                },
                                display: true,
                                title: {
                                    show: true,
                                }
                            },
                            x: {
                                ticks: {
                                    font: {
                                        size: 14,
                                        family: 'Roboto',
                                        style: 'normal',
                                    },
                                    fontColor: '#bbb',
                                    padding: 3,
                                    callback: (label, index, labels) => {
                                        return label;
                                    }
                                },
                                grid: {
                                    display: false,
                                    color: '#bbb'
                                }
                            }
                        },
                        plugins: {
                            datalabels: {
                                display: false,
                            },
                            legend: {
                                display: true,
                                title: {
                                    padding:20
                                }
                            },
                            title: {
                                fontFamily: 'Roboto',
                                text: 'Contracts Won Trend',
                                display: true
                            },
                            tooltip: {
                                enabled: true,
                                callbacks: {
                                    label: function (tooltipItem, label) {
                                        return ((tooltipItem.yLabel).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(".00", ""));
                                    }
                                }
                            },
                        },
                        hover: {
                            onHover: (event, elements) => {
                                event.target.style.cursor = elements[0] ? "pointer" : "default";
                            }
                        }
                    }
    
                    this.barData = {
                        labels: this.barLabels,
                        datasets: [
                            {
                                backgroundColor: ["rgba(33, 195, 181, .5)", "rgba(99, 172, 189, .5)", "rgba(68, 122, 189, .5)", "rgba(55, 122, 153, .5)", "rgba(255, 2, 100, .5)", "rgba(95, 72, 13, .5)", "rgba(5, 12, 153, .5)"],
                                borderColor: ["rgba(33, 195, 181, 1)", "rgba(99, 172, 189, 1)", "rgba(68, 122, 189, 1)", "rgba(55, 122, 153, 1)", "rgba(255, 2, 100, 1)", "rgba(95, 72, 13, 1)", "rgba(5, 12, 153, 1)"],
                                borderWidth: 1,
                                data: this.barDataset
                            }
                        ]
                    };
    
                    this.lineOptions = {
                        categoryPercentage: 0.3,
                        barPercentage: 0.6,
                        layout: {
                            padding: { left: 10, right: 10 }
                        },
                        scales: {
                            y: {
                                ticks: {
                                    font: {
                                        family: 'Roboto',
                                        style: 'normal',
                                    },
                                    beginAtZero: true,
                                    color: '#bbb',
                                    padding: 10,
                                    callback: (label) => {
                                        return label ?  this.toNumberSuffix.transform(label, 0) : 0;
                                    }
                                },
                                grid: {
                                    display: true,
                                    drawBorder: false,
                                    drawTicks: false,
                                    tickLength: 0,
                                    borderDash: function ( context ): any {
                                        if ( context.tick.value > 0 ) {
                                            return [5, 10]
                                        }
                                    },
                                    color: context => context.index == 0 ? 'rgba(0, 0, 0, 0.2)' : '#bbb'
                                },
                                display: true,
                                scaleLabel: {
                                    show: true,
                                }
                            },
                            x: {
                                ticks: {
                                    font: {
                                        size: 14,
                                        family: 'Roboto',
                                        style: 'normal',
                                    },
                                    color: '#bbb',
                                    padding: 3,
                                    callback: (label, index, labels) => {
                                        return label;
                                    }
                                },
                                grid: {
                                    display: false,
                                    color: '#bbb'
                                }
                            }
                        },
                        plugins: {
                            datalabels: {
                                display: false,
                            },
                            legend: {
                                display: false,
                            },
                            title: {
                                fontFamily: 'Roboto',
                                text: 'Contracts Ending Trend',
                                display: true
                            },
                            tooltip: {
                                enabled: true,
                                callbacks: {
                                    label: function (tooltipItem, label) {
                                        return ((tooltipItem.yLabel).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(".00", ""));
                                    }
                                }
                            },
                        },
                        hover: {
                            onHover: (event, elements) => {
                                event.target.style.cursor = elements[0] ? "pointer" : "default";
                            }
                        }
                    }
    
                    this.lineData = {
                        labels: this.lineLabels,
                        datasets: [
                            {
                                data: this.lineDataSet,
                                backgroundColor: "rgba(33, 195, 181, .5)",
                                fill: 'origin',
                                borderColor: '#1eb0a3',
                                pointRadius: 4,
                                pointBackgroundColor: '#21c3b5',
                                borderWidth: 1,
                                label: 'Contracts Ending Chart Data',
                                pointStyle: 'circle'
                            }
                        ]
                    }
    
                    this.overviewChartOptions = {
                        legend: {
                            display: false
                        },
                        responsive: true,
                        scales: {
                            y: {
                                display: false
                            },
                            x: {
                                display: false
                            }
                        },
                        tooltips: {
                            callbacks: {
                                label: function (tooltipItem, label) {
                                    return ((tooltipItem.yLabel).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(".00", ""));
                                }
                            }
                        },
                        elements: {
                            point: {
                                radius: 0
                            }
                        },
                        plugins: {
                            datalabels: {
                                display: false,
                            }
                        },
                        hover: {
                            onHover: (event, elements) => {
                                event.target.style.cursor = elements[0] ? "pointer" : "default";
                            }
                        }
                    };
    
                    this.overviewChartData = {
                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
                        datasets: [
                            {
                                data: [50, 64, 32, 24, 18, 27, 20, 36, 30],
                                borderColor: [
                                    '#009688', 
                                ],
                                backgroundColor: [
                                    '#80CBC4',
                                ],
                                borderWidth: 2,
                                fill: true,
                                pointRadius: 0,
    
                            }
                        ]
                    };

				}
                // Non Reg Suppliers Tab Charts Starts
			}

        });

    }

    procurementStageBarChartData( stageData ) {

		let stageDataLabels = [], stageDatasData = [];
		
        if ( stageData ) {
            for (let keyValue of stageData) {
                
                stageDataLabels.push(this.titleCasePipe.transform(keyValue.key));
                stageDatasData.push(keyValue.doc_count);
            }
        }

		this.rightBarChartData = {
			labels: stageDataLabels,
			datasets: [
				{
					label: '', // Set this to an empty string or meaningful label
					backgroundColor: '#218c74',
					borderColor: '#B33771',
					data: stageDatasData,
					borderRadius:10,
				}
			]
		};

		this.rightBarChartOptions = {
			barPercentage: 0.6,
			indexAxis: 'y',
			maintainAspectRatio: false,
			scales: {
				x: {
					grid: {
						drawBorder: false, // Disable grid border
						display: false,    // Hide grid lines
					},
					ticks: {
						display: false,    // Disable ticks and labels
					}
				},
				y: {
					grid: {
						drawBorder: false, // Disable the border line
						display: false     // Completely hide horizontal grid lines
					},
					ticks: {
						color: 'text-500'  // Keep y-axis text color as is
					}
				}
			},
			plugins: {
				legend: {
					display: false,
					labels: {
						usePointStyle: false,
						// color: 'var(--surface-a)'
					}
				},
				title: {
					display: false,
				},
				
				datalabels: {
					display: (context) => {
						let dataset = context.dataset;
						let value = dataset.data[context.dataIndex];
						return value;
					},
					backgroundColor: function(context) {
						return context.dataset.backgroundColor;
					},
					color: function(context) {
						let value = context.dataset?.borderColor;
						return 'white';
					},
					font: { weight: 'bold' },
					borderColor: 'white',
					borderRadius: 25,
					borderWidth: 2,
					padding: { top: 4, right: 6, bottom: 3, left: 4 },
					anchor: 'end',
					// align: 'center',
					// formatter: ( value ) => {
					// 	value = this.toNumberSuffix.transform( value, 2 );;
					// 	return value;
					// }
				}
			}
		};
	}

    contractBarChartData( contractTypeData ) {

		let contractTypeLabels = [], contractTypesData = [];

        if ( contractTypeData ) {
            for (let keyValue of contractTypeData) {
    
                contractTypeLabels.push(this.titleCasePipe.transform(keyValue.key));
                contractTypesData.push(keyValue.doc_count);
    
            }
        }

		this.contractBarChartValData = {
			labels: contractTypeLabels,
			datasets: [
				{
					label: '', // Set this to an empty string or meaningful label
					backgroundColor: '#218c74',
					borderColor: '#B33771',
					data: contractTypesData,
					borderRadius:10
				}
			]
		};

		this.contractBarChartOptions = {
			indexAxis: 'y',
			barPercentage: 0.6,
			maintainAspectRatio: false,
			layout: {
				padding: { right:30 },
			},
			scales: {
				x: {
					grid: {
						drawBorder: false, // Disable grid border
						display: false,    // Hide grid lines
					},
					ticks: {
						display: false,    // Disable ticks and labels
					}
				},
				y: {
					grid: {
						drawBorder: false, // Disable the border line
						display: false     // Completely hide horizontal grid lines
					},
					ticks: {
						color: 'text-500'  // Keep y-axis text color as is
					}
				}
			},
			plugins: {
				legend: {
					display: false,
					labels: {
						usePointStyle: false
					}
				},
				title: {
					display: false,
				},
				
				datalabels: {
					display: (context) => {
						let dataset = context.dataset;
						let value = dataset.data[context.dataIndex];
						return value;
					},
					backgroundColor: function(context) {
						return context.dataset.backgroundColor;
					},
					color: function(context) {
						let value = context.dataset?.borderColor;
						return 'white';
					},
					font: { weight: 'bold' },
					borderColor: 'white',
					borderRadius: 25,
					borderWidth: 2,
					padding: { top: 4, right: 6, bottom: 3, left: 6 },
					anchor: 'end'
				}
			}
		};
	}

    getNoticeIndentifierData( event ) {

		this.noticeIdentifierNo = ['?noticeIdentifier=' + event];

        this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_GOVTENABLER_API', 'getContractHistory', this.noticeIdentifierNo ).subscribe(res => {
            
		// this.companyService.getNoticeIndentifierData( this.noticeIdentifierNo ).then(data => {
			
			if ( res.body['status'] == 200 ) {
				this.noticeIndentifierSummaryData = res.body['results'];
			}
            	
			this.dateTimelineView = [
				{ status: 'Published Date', date: this.noticeIndentifierSummaryData?.published_date },
				{ status: 'Closing Date', date: this.noticeIndentifierSummaryData?.closing_date },
				{ status: 'Awarded Date', date: this.noticeIndentifierSummaryData?.awarded_date },
				{ status: 'Contract Start Date', date: this.noticeIndentifierSummaryData?.contract_start_date },
				{ status: 'Contract End Date', date: this.noticeIndentifierSummaryData?.contract_end_date }
			];
			
			this.viewNoticeIndentifierModal = true;

		});

		this.supplierDataByNoticeIndentifier();

	}

	showText( descriptionTextElement: ElementRef ) {

		if ( descriptionTextElement['classList'].contains('limitTextHeight') ) {
			descriptionTextElement['classList'].remove('limitTextHeight');
			descriptionTextElement['nextElementSibling'].innerText = 'Read Less';
		} else {
			descriptionTextElement['classList'].add('limitTextHeight');
			descriptionTextElement['nextElementSibling'].innerText = 'Read More';

		}

	}

    supplierDataByNoticeIndentifier() {

        let reqobj = [ this.noticeIdentifierNo ];
        this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_GOVTENABLER_API', 'supplierDataByNoticeIndentifier', reqobj ).subscribe(res => {
			
			if (res.body['status'] == 200) {

				this.contractFinderSuppliersDataValues = res.body['results']
			}

		});

	}

    // formatDataForGraph( dataArray, src ) {

	// 	let tempArray = [];

	// 	if ( src == "year" ) {

	// 		for ( let dataVal of dataArray ) {
	// 			tempArray.push(dataVal.year);
	// 		}

	// 	} else  if( src == "count" ) {

	// 		for ( let dataVal of dataArray ) {
	// 			tempArray.push(dataVal.count);
	// 		}
	// 	}

	// 	return tempArray;
    // }
		
    async checkForeignCompany( companyNo: string, companyName: string ) {
		if (companyNo.match('#')) {

			this.infoDialogModal = true;

		} else {
            let apiEndPoint = ( this.isLoggedIn || CompaniesEligibleForDataWithoutLogin.includes( this.companyNumber )) ? 'companyOverview' : 'infoByCompanyNumberPublic';

            let reqObj = [ companyNo ];

            this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_API', apiEndPoint, reqObj).subscribe(res => {
				if (Object.keys(res.body).length === 0) {
					this.infoDialogModal = true;
					return false;
				} else {
					this.router.navigate([]).then(result => { window.open('/company/' + companyNo + '/' + this.formatCompanyNameForUrl(this.titleCasePipe.transform(companyName)), '_blank'); });
					return true;
				}
			});

		}
	}

    goToESGPlatform() {

        const url = "https://esgdev.datagardener.com/";
		window.open(url, '_blank');

    }
    
    compareDeatails( event ) {

        if ( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasFeaturePermission('Compare Companies') ) {

            let urlStr: string;
        
            urlStr = String( this.router.createUrlTree( ['/deep-insights/compare-company'], { queryParams: { businessName: event.businessName, companyRegistrationNumber: event.companyRegistrationNumber}} ) );
        
            window.open( urlStr, '_blank' ); 
        
        } else {
            this.showUpgradePlanDialog = true;
        }

    }

    async checkCrmLimit(type: crmType) {
		this.userLimit = await this.globalServiceCommnunicate.getUserExportLimit();
		
		if ( this.userLimit.crmLimit > 0 ) {
			if ( [ this.companyNumber ].length <= this.userLimit.crmLimit ) {
                switch( type ) {
                    case 'hubspot':
                        this.syncToHubSpot();
                        break;
                        
                    // case 'salesforce':
                    //     this.syncSalesforce();
                    //     break;
                }
            } else {
				this.msgs = [];
				this.msgs.push( { severity: 'error', summary: `You don't have enough CRM limit to push companies to ${type}. To upgrade limit please contact your administrator!` } );
				setTimeout(() => {
					this.msgs = [];
				}, 3000);
			}
		} else {
			this.msgs = [];
			this.msgs.push( { severity: 'info', summary: 'Your CRM limit is zero. To upgrade limit please contact your administrator!' } );
			setTimeout(() => {
				this.msgs = [];
			}, 3000);
		}
	}

    syncToHubSpot() {

        if( this.userDetails?.isTrial ) {
			return;
		}

		let queryParam = [
			{ key: 'redirect_uri', value: `${ window.location.origin }/dg-authenticate` }
		];

		this.globalServiceCommnunicate.globalServerRequestCall('get', 'HS_EXTENSION', 'checkToken', undefined, undefined, queryParam).subscribe(( res ) =>{

			if( res.body.status == 200 ) {
                this.showDialogForListName = true;

				if( res.body.results['isAuthenticatedWithHubspot'] == true ) {

                    this.isAuthenticatedWithHubspot = res.body.results['isAuthenticatedWithHubspot'];
				}

			} else if( res.body.status == 403 ) {
				if( res.body.results['isAuthenticatedWithHubspot'] == false ) {
					this.showDialog = true;
					setTimeout(() => {
						this.showDialog = false;
					}, 8000);
				}
			}
		});
    }

    pushCompaniesToHubSpot() {

        let obj = {
            pageSize: 25,
            startAfter: 0,
            filterData: [],
            redirect_uri: `${ window.location.origin }/dg-authenticate`,
            companiesInList: [this.companyNumber],
            sourceType: this.listNameForHubSpot,
            isHubSpot: false
        }

        this.globalServiceCommnunicate.globalServerRequestCall('post', 'HS_EXTENSION', 'pushToHubSpot', obj).subscribe(( res ) =>{
            
            if(res.body.status == 200) {
                this.msgs = [];
                // this.importCompanyCounts = res.body.counts;
                this.showDialogForListName = false;
                this.listNameForHubSpot = '';
                this.msgs.push({ 
                    severity: 'success', summary: `${ res.body.message } and it will take few minutes for reflecting your companies to your HubSpot account!`,
                });
                setTimeout(() => {
                    this.msgs = [];
                    // this.showDialogAfterImport = true;
                }, 3000);
            } else {
                this.msgs = [];
                this.msgs.push({ 
                    severity: 'error', summary: res.body.message,
                });
                setTimeout(() => {
                    this.msgs = [];
                }, 3000);
            }
        });
    }

    checkPlanStatus( type: crmType ) {

		if ( this.checkPremiumPlan() ) {
            switch( type ) {
                case 'hubspot':
                    this.confirmationForCRMLimit(type);
                    break;

                // case 'salesforce':
                //     this.checkCrmLimit(type);
                //     break;
                }
		} else {
			this.showUpgradePlanDialog = true;
		}
	}

    checkPremiumPlan(): boolean {
		if ( this.subscribedPlanModal['Premium_Trial_48_Hours'].includes(this.userDetails.planId) ||  this.subscribedPlanModal['Premium_New_Monthly'].includes(this.userDetails.planId) || this.subscribedPlanModal['Premium_Annual_Two_Year'].includes(this.userDetails.planId) || this.subscribedPlanModal['Premium_Annual_One_Year'].includes(this.userDetails.planId) ) {
			return true;
		}

		return false;
	}

    confirmationForCRMLimit(type) {
		this.confirmationService.confirm({
            message: `${ [this.companyNumber].length } limit will be deducted. Are you sure that you want to proceed?`,
            key: 'crmConfirmationForCompanyDetails',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
				// this.showDialogAfterImport = true;
				this.checkCrmLimit(type);
            },
            reject: () => {
            }
        });
	}

    hideDialog(event) {
		this.showDialog = event;
	}

}