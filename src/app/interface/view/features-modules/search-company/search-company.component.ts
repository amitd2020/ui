import { TitleCasePipe } from '@angular/common';
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, lastValueFrom, pluck, takeUntil } from 'rxjs';

import { CompanyDetailModel } from '../../../models/company-data-model';

import { SharedLoaderService } from '../../shared-components/shared-loader/shared-loader.service';
import { DataCommunicatorService } from '../company-details-module/data-communicator.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { CanonicalURLService } from 'src/app/interface/service/canonical-url.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';

import CustomUtils from 'src/app/interface/custom-pipes/custom-utils/custom-utils.utils';
import { subscribedPlan } from 'src/environments/environment';
import { RecordListComponent } from '../../shared-components/shared-tables/record-list/record-list.component';
import { AdminRecordListComponent } from '../../shared-components/shared-tables/admin-record-list/admin-record-list.component';
// import { AboutComponent, CcjsComponent, ChargesComponent, CorporateLandComponent, DirectorsInfoComponent, FinancialsInfoComponent, NotesComponent, PersonContactInfoComponent, PscComponent, SafeAlertComponent, ShareholdersComponent } from '../company-details-module/child-components.index';
import { SearchFiltersService } from 'src/app/interface/service/search-filter.service';
import { MetaContentSEO } from 'src/assets/utilities/data/metaContentSEO.constants';
import { Location } from '@angular/common';
import { SearchCompanyService } from './search-company.service';
import { Month } from 'src/assets/utilities/data/commonUtilities.constant';
import { ListPageName } from './search-company.constant';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UnsubscribeSubscription } from 'src/app/interface/service/unsubscribe.abstract';
import { MenuItem } from 'primeng/api';

@Component({
	selector: 'dg-search-company',
	templateUrl: './search-company.component.html',
	styleUrls: ['./search-company.component.scss']
})

export class SearchCompanyComponent extends UnsubscribeSubscription implements OnInit, OnDestroy, AfterViewInit {

    @Input() thisPage: string = '';

	selectedGlobalCountry: string = 'uk';
    defaultSearchData: Boolean = false;
    isFilterSidebarShow: boolean = false;

    operatingTableElemnts: any;
    ChargeDashdata: object = {};

    recordTableCols: any[];

    selectedRecordTableCols: any[] = [];

    selectedColumns: Array<any>;

    companyData: any[];
    companyDataForMortgages: any[];
    socialNetworkCounts: any[];

    companyOfListData: any;

    selectedCompany: any;
    companyDetail: CompanyDetailModel[] = [];
    listId = "";
    searchTotalCount: number = 0;
    totalContacts: number = 0;
    directorTotalCount: number = 0;
    appliedFilters: Array<any> = [];
    appliedFiltersForCharges: Array<any> = [];
    showExportButton: boolean = true;
    firstPage: boolean = false;
    dissolvedIndex : boolean = false;
    switchToChargesData : boolean = false;
    switchToTradeData : boolean = false;
    switchToDirectorScreen: boolean = false;
    switchToContactInformationScreen: boolean = false;
    showChargesDataColumns : any[];
    chargesDataColumnFormortgages : any[];
    showTradeDataColumns : any[];
    showdirectorscreenColumn: any [];
    showCompanyContactScreenColumns: any [];
    chargesFilterData: Array<any> = [];
    directorScreen: boolean = false;
    isAblScreen: boolean = false;
    ablScreen: boolean = false;
    hideMonthFilterMultiSelect: boolean = false;
    showTrade: boolean = false;
    showChargesTab: boolean = true;

    monthAggArrayCount: Array<any> = [];
    pageName: string;
    pageNameSaveList: string = '';
    listPageName: string;
    viewDirectorDetailsData: any;
    viewCompanyContactData: any;
    selectedSavedListDataObj: any;
	filterSearchArray: Array<any> = [];
	msgs = [];
    userLocation: any;
	msgcompanyDataForMortgagess = [];
    constantMessages: any = UserInteractionMessages;

    subscribedPlanModal: any = subscribedPlan;

    // For Company Deatils Side Panel
	showCompanySideDetails: boolean = false;
	companySideDetailsParams: any = { companyNumber: undefined, companyName: undefined, tabNameToBeActive: '' };
	corporateSideOverviewData: object;
	overviewName: string;

    // Child Components Variables To Navigate The Tabs
    // companyDetailsChildComponents = {
    //     SafeAlertComponent: SafeAlertComponent,
    //     CCJsComponent: CcjsComponent,
    //     CorporateLandComponent: CorporateLandComponent,
    //     ChargesComponent: ChargesComponent,
    //     FinancialsInfoComponent: FinancialsInfoComponent,
    //     NotesComponent: NotesComponent,
    //     AboutComponent: AboutComponent,
    //     PersonContactInfoComponent: PersonContactInfoComponent,
    //     DirectorsInfoComponent: DirectorsInfoComponent,
    //     PscComponent: PscComponent,
    //     ShareholdersComponent: ShareholdersComponent,
    //     DirectorDetailsComponent: DirectorDetailsComponent
    // }

	childComponentCommunicationSubscription: Subscription;
	payloadForChildApi;

    // dissolvedAndLiquidationToggleInput: Object = {};
    mortgagesPaginationObj: Object = { rows: 25, first: 0 };
    contactsCount: any;
    pageInQueryParam: string;
    formattingForPersonEntitledGroup: any;

    items: any = [];
    activeIndex: number = 0;
    tabMenuItem: MenuItem[] | undefined;
    activeItem: MenuItem | undefined;
    addOnPermission: boolean;
  
	constructor(
        private searchFiltersService: SearchFiltersService,
        private seoService: SeoService,
        private commonService: CommonServiceService,
        private recordListComponent: RecordListComponent,
        private adminRecordListComponent: AdminRecordListComponent,
        private titlecasePipe: TitleCasePipe,
		private activeRoute: ActivatedRoute,
		private dataCommunicatorService: DataCommunicatorService,
        private canonicalService: CanonicalURLService,
        private userAuthService: UserAuthService,
		private sharedLoaderService: SharedLoaderService,
        private globalServerCommunicate: ServerCommunicationService,
		private location: Location,
		public searchCompanyService: SearchCompanyService,
        private router: Router
	) {
        super();
        this.childComponentCommunicationSubscription = this.dataCommunicatorService.$childComponentDataCommunicator.subscribe();
    }
    
    override ngOnDestroy() {
        this.searchCompanyService.resetPayload();
        this.searchCompanyService.resetFilterData();
        this.searchCompanyService.setCompanyView();

        this.childComponentCommunicationSubscription.unsubscribe();
        
        super.ngOnDestroy();
    }

	queryString = window.location.search;

	ngOnInit() {

        this.initBreadcrumbAndSeoMetaTags();
        
        this.tabMenuItem = [
            { label: 'Companies' },
            { label: 'List of Charges' }
        ];

        this.activeItem = this.tabMenuItem[0];
        
        this.searchCompanyService.resetPayload();
        this.searchCompanyService.resetFilterData();

        const { cListId, cListLength, listName, listPageName, hideStatsButton, chipData, company: companyNameNumberParam, directorName, industryName, shareId, showCharges, activeTab, dgInsights } = JSON.parse( JSON.stringify( this.activeRoute.snapshot.queryParams ) );

        this.listPageName = listPageName;

        this.userAuthService.isLoggedInSubject$.pipe( takeUntil( this.unsubscribe$ ) ).subscribe( async( loggedIn: boolean ) => {
        
            this.sharedLoaderService.showLoader();
        
            this.searchCompanyService.$apiPayloadBody.subscribe( res => {
                this.payloadForChildApi = res;
            });

            this.addOnPermission = this.userAuthService.hasAddOnPermission('benchMarking');

            if ( companyNameNumberParam ) {
                let companyNameNumberParamModfd = companyNameNumberParam;
    
                if ( /^\d+$/.test( companyNameNumberParam ) ) {
                    companyNameNumberParamModfd = companyNameNumberParam.padStart(8, '0');
                }
    
                this.searchCompanyService.updatePayload({
                    filterData: [
                        { chip_group: 'Status', chip_values: [ 'live' ] },
                        { chip_group: 'Company Name/Number', chip_values: [ companyNameNumberParamModfd ], companySearchAndOr: 'or' }
                    ]
                });
                
            }
            
            if ( directorName ) {
                this.searchCompanyService.updatePayload({
                    filterData: [
                        { chip_group: 'Status', chip_values: [ 'live' ] },
                        { chip_group: 'Director Name', chip_values: [ directorName ], directorNameSearchAndOr: 'and' }
                    ]
                });
            }
            
            if ( industryName ) {
                this.searchCompanyService.updatePayload({
                    filterData: [
                        { chip_group: 'Status', chip_values: [ 'live' ] },
                        { chip_group: 'Industry', chip_values: typeof industryName == 'string' ? [ industryName ] : industryName }
                    ]
                });
            }

            if ( !loggedIn ) {
                // If User is not logged in
                this.searchCompanyService.setCompanyView();
                this.getTableDataValue( 'company' );
                
            } else {
                // If User is logged in
				this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';

                this.showChargesTab = true;

                this.pageInQueryParam = listPageName ? JSON.parse(JSON.stringify(listPageName)) : listPageName;

                if ( listPageName == 'exportedBucket' ) {
                    this.searchCompanyService.setPageName(listPageName) 
                }

                if ( hideStatsButton && JSON.parse( hideStatsButton ) ) {
                    this.searchCompanyService.showStatsButton = true;
                }

                if ( cListId ) {
                    this.showChargesTab = false;
                    this.searchCompanyService.updateListViewTemplate( true, cListId, listPageName );
        
                    this.searchCompanyService.updatePayload( { filterData: [ { chip_group: 'Saved Lists', chip_values: [ listName ] } ] } );
        
                    if ( !hideStatsButton ) {
                        this.searchCompanyService.showStatsButton = true;
                    }
                }

                if ( cListId == '' && listPageName && [ ListPageName.businessMonitor.inputPage, ListPageName.businessMonitorPlus.inputPage, ListPageName.businessWatch.inputPage ].includes( listPageName ) ) {
                    this.searchCompanyService.updateListViewTemplate( true, cListId, listPageName );
                }

                if ( chipData ) {
        
                    if ( !hideStatsButton ) {
                        this.searchCompanyService.showStatsButton = true;
                    }
        
                    this.searchCompanyService.updatePayload( { filterData: JSON.parse( chipData.replace(/%27/g, "'") ) } );
                    // this.searchCompanyService.updateFilterPanelApplyButtons();
                }
                if ( shareId ) {
                    let param = [ 
                        { key:'shareId', value: shareId }
                    ];

                    const CompanyDetailAPIResponse = await lastValueFrom( this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getSharedCriteriaInfo', undefined, undefined, param ).pipe( pluck( 'body' ) ) );

                    // this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getSharedCriteriaInfo', undefined, undefined, param ).subscribe( res => { 
                        if ( CompanyDetailAPIResponse.status = 200 ) {
                            this.searchCompanyService.showStatsButton = true;
                            this.searchCompanyService.updatePayload( { filterData: CompanyDetailAPIResponse.result.criteria } );

                            // this.searchCompanyService.updateFilterPanelApplyButtons();
                            // this.router.navigate( ['/company-search'], { queryParams: { chipData: JSON.stringify( CompanyDetailAPIResponse.result.criteria ) } } );
                        }
                    // })
                }

                if ( dgInsights ) this.searchCompanyService.resetFilterPanelApplyButtons();
         
                if ( ( cListId || chipData || shareId ) && !( listPageName && [ ListPageName.businessMonitor.inputPage, ListPageName.businessMonitorPlus.inputPage, ListPageName.businessWatch.inputPage, ListPageName.diversityInclusion.outputPage, ListPageName.businessCollaborators.outputPage, ListPageName.procurementPartners.outputPage, ListPageName.fiscalHoldings.outputPage, ListPageName.potentialLeads.outputPage, ListPageName.diversityCalculation.outputPage, ListPageName.diversityCalculationStats.inputPage ].includes( listPageName ) ) ) {
        
                    if ( Object.values( this.searchCompanyService.filterPanelApplyButtons ).filter( val => val ).length > 2 ) {
                        this.searchCompanyService.setCompanyView();
                    } else {
                        for ( let key in this.searchCompanyService.filterPanelApplyButtons ) {
                            if ( this.searchCompanyService.filterPanelApplyButtons[ key ] ) {
                                // Below line will trigger the setView method based on the key, eg: if the key is 'director' then it'll trigger: `setDirectorView()`.
                                this.searchCompanyService[`set${ key.replace( key[0], key[0].toUpperCase() ) }View`]();
                            }
                        }
                    }
        
                }
        
                if ( this.userAuthService.hasFeaturePermission( 'Global Filter' ) )  {
                    this.isFilterSidebarShow = true;
                }

                const urlParams = new URLSearchParams(this.queryString);

                if ( this.activeRoute.snapshot.queryParams?.listName == 'Exported Bucket' ) {
                    this.isFilterSidebarShow = false;
                }

                if ( showCharges ) {
                    this.searchCompanyService.setChargesView();
                    this.payloadForChildApi['filterData'] = JSON.parse( chipData );
                    this.activeItem = activeTab == 'Companies' ? this.tabMenuItem[0] : this.tabMenuItem[1];
                    this.getRecordForTable();
                    return;
                }

                if ( companyNameNumberParam ) {
                    this.searchCompanyService.setCompanyView();
                    this.searchCompanyService.updateFilterPanelApplyButtons();
                    this.getTableDataValue( 'company' );
                }
    
                if ( directorName ) {
                    this.searchCompanyService.setDirectorView();
                    this.searchCompanyService.updateFilterPanelApplyButtons();
                    this.getTableDataValue( 'director' );
                }
    
                if ( industryName ) {
                    this.searchCompanyService.setCompanyView();
                    this.searchCompanyService.updateFilterPanelApplyButtons();
                    this.getTableDataValue( 'company' );
                }
                if ( cListId ) {
                    if ( [ ListPageName.charges.inputPage, ListPageName.charges.outputPage ].includes( listPageName ) ) {
                        this.getCompaniesFromChargesList();
                    } else {
                        this.getCompaniesFromList();
                    }
                }

                if ( (chipData || shareId) && this.payloadForChildApi.filterData.length && !cListId ) {
                    this.getTableDataValue( this.searchCompanyService.getView() );
                }
    
    
                if ( urlParams.get('savedFilters') ) {
    
                    let param = [ urlParams.get('savedFilters') ];
    
                    this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'savedFiltersSearch', param ).subscribe( res => {
                        if(res.body.status == 200) {
                            window.location.href = res.body.url;
                        }
                        setTimeout(() => {
                            this.sharedLoaderService.hideLoader();
                        }, 100);
                    });
                    
                }
        
                if ( CustomUtils.isNullOrUndefined( urlParams.get('directorName') ) ) {
                    this.directorScreen = false;
                } else {
                    this.directorScreen = true;
                } 
        
                if ( urlParams.get('cListId') !== undefined ) {
                    
                    this.listId = urlParams.get('cListId');
                    this.searchTotalCount = urlParams.get('cListLength') ? (+urlParams.get('cListLength')) : 0;
                    this.pageName = urlParams.get('pageName') || urlParams.get('listPageName');
    
                    if ( ( CustomUtils.isNullOrUndefined(this.listId) ) && ( CustomUtils.isNullOrUndefined(urlParams.get('company')) ) && ( CustomUtils.isNullOrUndefined(urlParams.get('directorName')) ) && ( CustomUtils.isNullOrUndefined(urlParams.get('incorp_start')) ) && ( CustomUtils.isNullOrUndefined(urlParams.get('incorp_end')) ) && ( CustomUtils.isNullOrUndefined(urlParams.get('chipData')) ) && ( CustomUtils.isNullOrUndefined(urlParams.get('shareId')) ) && ( CustomUtils.isNullOrUndefined(urlParams.get('industryName')) ) ) {
    
                        this.sharedLoaderService.showLoader();
    
                        this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getDefaultSearchCompaniesData' ).subscribe( res => {
    
                            this.sharedLoaderService.hideLoader();
                            
                            let companyDataTemp = this.formatData(res.body['results']);
    
                            this.companyData = [];
                            this.companyData = companyDataTemp;
    
                            this.defaultSearchData = true;
                            this.searchTotalCount = res.body['results'].length;
        
                            if (this.companyData.length === 0) {
                                this.showExportButton = true;
                            } else {
                                this.showExportButton = false;
                            }
    
                        });
        
                    }
                }

            }

        });
 
        this.recordTableCols = [
            { field: 'companyRegistrationNumber', header: 'Company Number', colunName: 'Company Number', width: '150px', textAlign: 'left', value: true, sortOrder: 4, visible: true, countryAccess: [ 'uk', 'ie' ], isSortable: true, disabled: true },
            { field: 'businessName', header: 'Company Name', colunName: 'Company Name', width: '360px', textAlign: 'left', value: true, sortOrder: 1, visible: true, countryAccess: [ 'uk', 'ie' ], isSortable: true, disabled: true },
            // { field: 'directorName', header: 'Director Name', colunName: 'Director Name', width: '380px', textAlign: 'left', value: true, sortOrder: 2, visible: true },
            // { field: 'RegAddress', header: 'Registered Address', colunName: 'Registered Address', width: '380px', textAlign: 'left', value: true, sortOrder: 13, visible: true },
            { field: 'otherFeatures', header: 'Features', colunName: 'Features', width: '130px', textAlign: 'left', value: true, sortOrder: 3, visible: true, countryAccess: [ 'uk', 'ie' ], isSortable: false, disabled: false },
            { field: 'companyStatus', header: 'Company Status', colunName: 'Company Status', width: '160px', textAlign: 'center', value: true, sortOrder: 5, visible: true, countryAccess: [ 'uk', 'ie' ], isSortable: false, disabled: false },
            // { field: 'RegAddress_Modified', header: 'Website', colunName: 'Website', width: '190px', textAlign: 'left', value: false, sortOrder: 6, visible: true },
            // { field: 'RegAddress_Modified', header: 'Phone/Mobile', colunName: 'Phone', width: '120px', textAlign: 'right', value: false, sortOrder: 7, visible: (  this.authGuardService.isLoggedin() ? (this.userRoleAndFeatureAuthService.addOnFeaturesDataObject['contactInformation'] || this.userRoleAndFeatureAuthService.isAdmin()) : false   )  },
            // { field: 'RegAddress_Modified', header: 'CTPS Registered', colunName: 'CTPS Registered', width: '130px', textAlign: 'center', value: false, sortOrder: 8, visible: (  this.authGuardService.isLoggedin() ? (this.userRoleAndFeatureAuthService.addOnFeaturesDataObject['contactInformation'] || this.userRoleAndFeatureAuthService.isAdmin()) : false   )  },
            // { field: 'tradeDebtors', header: 'Trade Debtors', colunName: 'Trade Debtors', width: '150px', textAlign: 'right', value: true, sortOrder: 22, visible: true },
            { field: 'growth_scores', header: 'Benchmarking', colunName: 'Benchmarking', width: '140px', textAlign: 'right', value: true, sortOrder: 8, visible: this.addOnPermission ? true : false, countryAccess: [ 'uk' ], isSortable: false, disabled: false },
            { field: 'propensity_scores', header: 'M & A', colunName: 'M & A', width: '100px', textAlign: 'right', value: true, sortOrder: 9, visible: this.addOnPermission ? true : false, countryAccess: [ 'uk' ], isSortable: false, disabled: false },
            { field: 'internationalScoreDescription', header: 'Risk Band', colunName: 'Risk Band', width: '160px', textAlign: 'left', value: true, sortOrder: 9, visible: true, countryAccess: [ 'uk', 'ie' ], isSortable: false, disabled: false },
            // { field: 'companyRegistrationDate', header: 'Incorporation Date', colunName: 'Incorporation Date', width: '120px', textAlign: 'center', value: true, sortOrder: 12, visible: true },
            // { field: 'active_directors_count', header: 'Active Directors Count', colunName: 'Active Directors Count', width: '120px', textAlign: 'right', value: false, sortOrder: 16, visible: true },
            // { field: 'NumMortCharges', header: 'Mortgages Charge', colunName: 'Mortgages Charge', width: '120px', textAlign: 'right', value: false, sortOrder: 17, visible: true },
            // { field: 'CCJCount', header: 'CCJ Count', colunName: 'CCJ Count', width: '100px', textAlign: 'right', value: false, sortOrder: 18, visible: true },
            { field: 'numberOfEmployees', header: 'No. of Employees', colunName: 'No. of Employees', width: '120px',minWidth: '120px', mamaxWidth: '120px', textAlign: 'right', value: false, sortOrder: 19, visible: true, countryAccess: [ 'uk', 'ie' ], isSortable: false, disabled: false },
            { field: 'numLandCorporate', header: 'Property Owned Count', colunName: 'Property Owned Count', width: '180px',minWidth: '180px', mamaxWidth: '120px', value: true, textAlign: 'right', visible: true, countryAccess: [ 'uk'  ], isSortable: false, disabled: false },
            { field: 'latestFinancialYear', header: 'Latest Financial Year', colunName: 'Latest Financial Year', width: '140px',minWidth: '140px', mamaxWidth: '140px', value: true, textAlign: 'right', visible: true, countryAccess: [ 'uk'  ], isSortable: false, disabled: false },
            { field: 'turnover_latest', header: 'Turnover', colunName: 'Turnover', width: '200px', textAlign: 'right', value: false, sortOrder: 20, visible: true, countryAccess: [ 'uk', 'ie' ], isSortable: false, disabled: false },
            { field: 'companyAge', header: 'Age', colunName: 'Age', width: '80px',minWidth: '80px', mamaxWidth: '80px', textAlign: 'right', value: true, sortOrder: 11, visible: true, countryAccess: [ 'uk', 'ie' ], isSortable: false, disabled: false },
            // { field: 'companyType', header: 'Company Category', colunName: 'Company Category', width: '220px', textAlign: 'left', value: false, sortOrder: 10, visible: true },
            { field: 'naceCodeInfo', header: 'NACE Code', colunName: 'NACE Code', width: '380px', textAlign: 'left', value: true, sortOrder: 14, visible: true, countryAccess: [  'ie' ] },
            { field: 'sicCode07', header: 'SIC Code', colunName: 'SIC Code', width: '380px', textAlign: 'left', value: true, sortOrder: 14, visible: true, countryAccess: [ 'uk', 'ie' ], isSortable: false, disabled: false },
            { field: 'industryTag', header: 'Industry', colunName: 'Industry', width: '220px', textAlign: 'left', value: true, sortOrder: 15, visible: true, countryAccess: [ 'uk' ], isSortable: false, disabled: false }
            // { field: 'estimated_turnover', header: 'Turnover (Estimate+)', colunName: 'Turnover (Estimate+)', width: '220px', textAlign: 'right', value: false, sortOrder: 21, visible: true },
            // { field: 'totalAssets_latest', header: 'Total Assets', colunName: 'Total Assets', width: '150px', textAlign: 'right', value: false, sortOrder: 23, visible: true },
            // { field: 'totalLiabilities_latest', header: 'Total Liabilities', colunName: 'Total Liabilities', width: '150px', textAlign: 'right', value: false, sortOrder: 24, visible: true },
            // { field: 'netWorth_latest', header: 'Net Worth', colunName: 'Net Worth', width: '150px', textAlign: 'right', value: false, sortOrder: 25, visible: true },
            // { field: 'grossProfit_latest', header: 'Gross Profit', colunName: 'Gross Profit', width: '150px', textAlign: 'right', value: false, sortOrder: 26, visible: true }
        ];
        this.recordTableCols = this.recordTableCols.filter( col => col.countryAccess.includes( this.selectedGlobalCountry ) && col.visible );

        /* ABL Screen Columns */
        this.showChargesDataColumns = [
            { field: 'businessName', header: 'Company Name', textAlign: 'left', minWidth: '380px', maxWidth: 'none', visible: true, countryAccess: [ 'uk', 'ie' ] },
            { field: 'companyRegistrationNumber', header: 'Company Number', textAlign: 'left', minWidth: '160px', maxWidth: '160px', visible: true, countryAccess: [ 'uk', 'ie' ] },
            // { field: 'directorName', header: 'List Of Directors', textAlign: 'left', minWidth: '380px', maxWidth: '220px', visible: true, countryAccess: [ 'uk', 'ie' ] },
            { field: 'otherFeatures', header: 'Social Media Links', textAlign: 'left', minWidth: '160px', maxWidth: '160px', visible: ( this.userAuthService.hasAddOnPermission('contactInformation') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ), countryAccess: [ 'uk' ] },
            // { field: 'telephone', header: 'Phone', textAlign: 'right', minWidth: '120px', maxWidth: '120px', visible: ( this.userAuthService.hasAddOnPermission('contactInformation') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ), countryAccess: [ 'uk', 'ie' ] },
            // { field: 'ctps', header: 'CTPS Registered', textAlign: 'center', minWidth: '130px', maxWidth: '130px', visible: ( this.userAuthService.hasAddOnPermission('contactInformation') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ), countryAccess: [ 'uk', 'ie' ] },
            { field: 'internationalScoreDescription', header: 'Risk Band', minWidth: '220px', textAlign: 'center', maxWidth: '220px', visible: true, countryAccess: [ 'uk', 'ie' ] },
            // { field: 'website', header: 'Website', textAlign: 'left', minWidth: '190px', maxWidth: 'none', visible: true, countryAccess: [ 'uk', 'ie' ] },
            { field: 'turnover', header: 'Turnover', textAlign: 'right', minWidth: '160px', maxWidth: '160px', visible: true, countryAccess: [ 'uk', 'ie' ] },
            { field: 'sicCode07', header: 'Industry', textAlign: 'left', minWidth: '380px', maxWidth: '380px', visible: true, countryAccess: [ 'uk', 'ie' ] },
            { field: 'outstandingCount', header: 'Total Outstanding', textAlign: 'right', minWidth: '150px', maxWidth: '150px', visible: true, countryAccess: [ 'uk', 'ie' ] },
            { field: 'person_entile_outs', header: 'Person Entitled ( Not Fully Satisfied )', textAlign: 'left', minWidth: '550px', maxWidth: '550px', visible: true, countryAccess: [ 'uk' ] },
            { field: 'personEntitledGroup', header: 'Person Entitled Group', textAlign: 'left', minWidth: '550px', maxWidth: '550px', visible: false, countryAccess: [ 'uk' ] },
            { field: 'fullySatisfiedCount', header: 'Fully Satisfied', textAlign: 'right', minWidth: '130px', maxWidth: '130px', visible: true, countryAccess: [ 'uk', 'ie' ] },
            { field: 'classification', header: 'Charges Description', textAlign: 'left', minWidth: '550px', maxWidth: '550px', visible: true, countryAccess: [ 'uk', 'ie' ] },
            { field: 'chargeTagsName', header: 'Charges Tags', textAlign: 'left', minWidth: '550px', maxWidth: '550px', visible: true, countryAccess: [ 'ie' ] },
            { field: 'tagNameField', header: 'Charges Tags', textAlign: 'left', minWidth: '550px', maxWidth: '550px', visible: true, countryAccess: [ 'uk' ] },
            { field: 'dateMonthCount', header: 'Created On', textAlign: 'left', minWidth: '200px', maxWidth: '200px', visible: true, countryAccess: [ 'uk', 'ie' ] },
            { field: 'dateMonthCountForRegOn', header: 'Registered On', textAlign: 'left', minWidth: '200px', maxWidth: '200px', visible: true, countryAccess: [ 'uk', 'ie' ] },
            { field: 'estimated_turnover', header: 'Turnover (Estimate+)', textAlign: 'right', minWidth: '220px', maxWidth: '180px', visible: true, countryAccess: [ 'uk', 'ie' ] },
            { field: 'netWorth', header: 'NetWorth', textAlign: 'right', minWidth: '160px', maxWidth: '160px', visible: true, countryAccess: [ 'uk', 'ie' ] },
            { field: 'companyDOIAgeForCharges', header: 'Company Age', textAlign: 'right', minWidth: '130px', maxWidth: '130px', visible: true, countryAccess: [ 'uk', 'ie' ] },
            { field: 'RegAddress', header: 'Registered Address', textAlign: 'left', minWidth: '380px', maxWidth: '380px', visible: true, countryAccess: [ 'uk', 'ie' ] },
            { field: 'pscNameFd', header: 'Person With Significant Control', textAlign: 'left', minWidth: '350px', maxWidth: '350px', visible: true, countryAccess: [ 'uk' ] },
            { field: 'region', header: 'Region', textAlign: 'left', minWidth: '250px', maxWidth: '250px', visible: true, countryAccess: [ 'uk' ] },
            // { field: 'person_entile_fully', header: 'Person Entitled ( Fully Satisfied )', textAlign: 'left', width: '550px' },
        ];

        // Country wise filter the columns for the ABL Screen
        this.showChargesDataColumns = this.showChargesDataColumns.filter( col => col.countryAccess.includes( this.selectedGlobalCountry ) );
        // /Country wise filter the columns for the ABL Screen

        /* ABL Screen Columns End */

        this.chargesDataColumnFormortgages = [
            { field: 'reg', header: 'Company Number', textAlign: 'right', minWidth: '130px', maxWidth: 'none', visible: true },
            { field: 'companyName', header: 'Company Name', textAlign: 'left', minWidth: '220px', maxWidth: 'none', visible: true },
			// { field: 'mortgageNumber', header: 'Charge No.', minWidth: '130px', maxWidth: '130px', textAlign: 'right', visible: true },
			{ field: 'chargeCode', header: 'Charge Code', minWidth: '200px', maxWidth: '200px', textAlign: 'right', visible: true },
			{ field: 'personsEntitled', header: 'Person Entitled', minWidth: '300px', maxWidth: '300px', textAlign: 'left', visible: true },
			{ field: 'mortgageType', header: 'Charge-description', minWidth: '300px', maxWidth: '300px', textAlign: 'left', visible: true },
			{ field: 'status', header: 'Status', minWidth: '140px', maxWidth: '140px', textAlign: 'center', visible: true },
			{ field: 'createdOn', header: 'Created On', minWidth: '120px', maxWidth: '120px', textAlign: 'center', visible: true },
			{ field: 'registeredOn', header: 'Registered On', minWidth: '120px', maxWidth: '120px', textAlign: 'center', visible: true },
			{ field: 'satisfiedOn', header: 'Satisfied On', minWidth: '120px', maxWidth: '120px', textAlign: 'center', visible: true },
			{ field: 'amountSecured', header: 'Amount-secured', minWidth: '550px', maxWidth: 'none', textAlign: 'left', visible: true },
			{ field: 'mortgageDetail', header: 'Short-particulars', minWidth: '550px', maxWidth: 'none', textAlign: 'left', visible: true }
		];

        this.showTradeDataColumns = [
            { field: 'businessName', header: 'Company Name', textAlign: 'left', minWidth: '380px', maxWidth: 'none', visible: true },
            { field: 'companyRegistrationNumber', header: 'Company Number', minWidth: '120px', textAlign: 'left', maxWidth: '140px', visible: true},
            { field: 'internationalScoreDescription', header: 'Risk Band', minWidth: '160px', textAlign: 'center', maxWidth: '160px', visible: true },
            { field: 'exportAmount', header: 'Export Amount (in £)', textAlign: 'right', minWidth: '140px', maxWidth: '140px', visible: true },
            { field: 'exchangeRateEffect', header: 'Exchange Rate Effect', textAlign: 'right', minWidth: '130px', maxWidth: '130px', visible: true },
            { field: 'lastOneYearExports', header: 'Last 12 Months Exports', textAlign: 'right', minWidth: '200px', maxWidth: '200px', visible: true },
            { field: 'lastFiveYearExports', header: 'Last 60 Months Exports', textAlign: 'right', minWidth: '200px', maxWidth: '200px', visible: true },
            { field: 'lastOneYearImports', header: 'Last 12 Months Imports', textAlign: 'right', minWidth: '200px', maxWidth: '200px', visible: true },
            { field: 'lastFiveYearImports', header: 'Last 60 Months Imports', textAlign: 'right', minWidth: '200px', maxWidth: '200px', visible: true }
        ];

        /* Director Screen Columns */
        this.showdirectorscreenColumn = [
            { field: 'director_name', header: 'Director Name', textAlign: 'left', minWidth: '300px', maxWidth: 'none', visible: true, countryAccess: [ 'uk', 'ie' ] },
            { field: 'email_id', header: 'Email Id', textAlign: 'left', minWidth: '250px', maxWidth: '250px', visible: false, countryAccess: [ 'uk', 'ie' ] },
            { field: 'linkedin_url', header: 'LinkedIn', textAlign: 'left', minWidth: '160px', maxWidth: '160px', visible: false, countryAccess: [ 'uk', 'ie' ] },
            // { field: 'job_title', header: 'Job Title', textAlign: 'left', minWidth: '160px', maxWidth: '160px', visible: true },
            { field: 'occupation', header: 'Occupation', textAlign: 'left', minWidth: '160px', maxWidth: '160px', visible: true, countryAccess: [ 'uk' ] },
            { field: 'status', header: 'Status', textAlign: 'center', minWidth: '100px', maxWidth: '100px', visible: true, countryAccess: [ 'uk', 'ie' ] },
            { field: 'directorAge', header: 'Director Age', textAlign: 'right', minWidth: '120px', maxWidth: '120px', visible: true, countryAccess: [ 'uk', 'ie' ] }, 
            { field: 'otherFeatures', header: 'Features', colunName: 'Features', minWidth: '110px', maxWidth:'110px', textAlign: 'left', value: true, sortOrder: 3, visible: true, countryAccess: [ 'uk', 'ie' ] },
            { field: 'appointed_date', header: 'Appointment Date', textAlign: 'center', minWidth: '140px', maxWidth: '140px', visible: true, countryAccess: [ 'uk', 'ie' ] },
            { field: 'companyName', header: 'Company Name', textAlign: 'left', minWidth: '260px', maxWidth: '260px', visible: true, countryAccess: [ 'uk', 'ie' ] },
            { field: 'companyRegistrationNumber', header: 'Company Number', minWidth: '140px', textAlign: 'left', maxWidth: '140px', visible: true, countryAccess: [ 'uk', 'ie' ] },
            // { field: 'companyName', header: 'Company Name', textAlign: 'left', minWidth: '260px', maxWidth: '260px', visible: true },
            // { field: 'directorAddress', header: 'Director Address', textAlign: 'left', minWidth: '300px', maxWidth: '300px', visible: true }, 
            // { field: 'directorShipTotal', header: 'Total Directorships Count', textAlign: 'right', minWidth: '150px', maxWidth: '150px', visible: true }, 
            // { field: 'directorShipActive', header: 'Active Directorships Count', textAlign: 'right', minWidth: '150px', maxWidth: '150px', visible: true }, 
            // { field: 'otherFeatures', header: 'Social Links', textAlign: 'left', minWidth: '120px', maxWidth: '120px', visible: ( this.authGuardService.isLoggedin() ? (this.userRoleAndFeatureAuthService.addOnFeaturesDataObject['contactInformation'] || this.userRoleAndFeatureAuthService.isAdmin()) : false   ) },
        ];
        this.showdirectorscreenColumn = this.showdirectorscreenColumn.filter( col => col.countryAccess.includes( this.selectedGlobalCountry ) );

        /* Contact Screen Column*/
        this.showCompanyContactScreenColumns = [
            { field: 'fullName', header: 'Person Name', textAlign: 'left', minWidth: '200px', maxWidth: 'none', visible: true, countryAccess: [ 'uk', 'ie' ] },
            { field: 'job_title', header: 'Position', textAlign: 'left', minWidth: '160px', maxWidth: '160px', visible: true, countryAccess: [ 'uk' ] },
            { field: 'senior_position', header: 'Senior Position', textAlign: 'left', minWidth: '160px', maxWidth: '160px', visible: true, countryAccess: [ 'uk' ] },
            // { field: 'website', header: 'Website', textAlign: 'left', minWidth: '160px', maxWidth: '160px', visible: true },
            { field: 'otherFeaturesForEmails', header: 'Features', minWidth: '120px', textAlign: 'left', maxWidth: '120px', visible: ( this.userAuthService.hasAddOnPermission('contactInformation') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ), countryAccess: [ 'uk', 'ie' ] },
            { field: 'companyName', header: 'Company Name', textAlign: 'left', minWidth: '260px', maxWidth: '260px', visible: true, countryAccess: [ 'uk', 'ie' ] },
            { field: 'companyRegistrationNumber', header: 'Company Number', minWidth: '140px', textAlign: 'left', maxWidth: '140px', visible: true, countryAccess: [ 'uk', 'ie' ] },
            { field: 'companyStatus', header: 'Company Status', textAlign: 'center', minWidth: '120px', maxWidth: '120px', visible: true, countryAccess: [ 'uk', 'ie' ] },
            // { field: 'email', header: 'Email Id', textAlign: 'left', minWidth: '250px', maxWidth: '250px', visible: ( this.authGuardService.isLoggedin() ? (this.userRoleAndFeatureAuthService.addOnFeaturesDataObject['contactInformation'] || this.userRoleAndFeatureAuthService.isAdmin()) : false   ) },
            // { field: 'emailStatus', header: 'Email Status', textAlign: 'left', minWidth: '150px', maxWidth: '150px', visible: ( this.authGuardService.isLoggedin() ? (this.userRoleAndFeatureAuthService.addOnFeaturesDataObject['contactInformation'] || this.userRoleAndFeatureAuthService.isAdmin()) : false   ) },
            // { field: 'position', header: 'Position', textAlign: 'left', minWidth: '250px', maxWidth: '250px', visible: true },
            // { field: 'telephone', header: 'Telephone', textAlign: 'left', minWidth: '120px', maxWidth: '120px', visible: ( this.authGuardService.isLoggedin() ? (this.userRoleAndFeatureAuthService.addOnFeaturesDataObject['contactInformation'] || this.userRoleAndFeatureAuthService.isAdmin()) : false   ) }
        ];
        this.showCompanyContactScreenColumns = this.showCompanyContactScreenColumns.filter( col => col.countryAccess.includes( this.selectedGlobalCountry ) );
        
    }

    ngAfterViewInit() {
        this.sharedLoaderService.hideLoader();
    }

    chargesTabChange( event ) {
        this.activeItem = event
        this.mortgagesPaginationObj = { rows: 25, first: 0 };
        this.searchCompanyService.resetPagination();
        this.getRecordForTable();
    }

    getRecordForMortgages() {
        return this.companyDataForMortgages
    }

    initBreadcrumbAndSeoMetaTags() {
		/*
			Do not enable the below code before discussing with Akmal.
			It reloads the `AppMainComponent`, which is the main
			layout container and parent for all of the Components/Modules.
			===============================================================
			this.router.routeReuseStrategy.shouldReuseRoute = () => false;
			===============================================================
		*/
        // The below as been added as per discussion with Akmal Sir For the temporary solution only.
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;

        // this.breadcrumbService.setItems([
        //     { label: 'Company Search' }
        // ]);
        
        this.seoService.setPageTitle ( MetaContentSEO.companySearch.title );
        this.seoService.setMetaTitle ( MetaContentSEO.companySearch.title );
        this.seoService.setDescription( MetaContentSEO.companySearch.description );
        
        this.canonicalService.setCanonicalURL();
	
    }

	getOperatingTable( event ) {

        if ( event.requestFor === 'SidePanel' ) {
            this.showCompanySideDetailsPanel( event.compNumber, event.compName, event.rowData, event.tabRoute );
        
        } else {
            this.operatingTableElemnts = event;
        }
    }

    getTableDataValue( event ) {

        let savedListPageName = this.payloadForChildApi.filterData.find(a => a.pageName)
        if( savedListPageName && savedListPageName?.pageName ){
            this.payloadForChildApi['pageName'] = savedListPageName.pageName;
        }
        
        const { listId, pageName, filterData } = this.payloadForChildApi;
        this.defaultSearchData = false;
        this.showChargesTab = true;
        
        this.firstPage = true;

        if ( filterData && filterData.length ) {
            this.appliedFilters = JSON.parse( JSON.stringify( filterData ) );
        }
        
        if ( listId ) {
            this.showChargesTab = false;
            if ( [ ListPageName.charges.inputPage, ListPageName.charges.outputPage ].includes( pageName ) ) {
                this.getCompaniesFromChargesList();
                return;
            }

            this.getCompaniesFromList();
            return;
        }

        if ( [ 'company', 'trade', 'charges', 'chargesDashboard' ].includes( event ) ) {
            this.getRecordForTable();
            return;
        }

        if ( event == 'director' ) {
            this.getRecordForDirectorTable();
            return;
        }

        if ( event == 'contact' ) {
            this.getRecordForContactTable();
            return;
        }

        const urlParams1 = new URLSearchParams(this.queryString);
        let cmpNoArray = [];
        let companyContactCmpNoArr = [];
        let tempPersonEntitledArray = [];
        let tempPersonEntitledRawArray = []; 

        if(event.searchResult){
            for (let i = 0; i < event.searchResult.length; i++) {

                /* START: Preparing object for show charges table, to be send to user-list table */

                let obj = {};
                
                obj["businessName"] = event.searchResult[i].businessName;

                obj["companyDOIAgeForCharges"] = (this.commonService.calculateAge(event.searchResult[i]['companyRegistrationDate']));
                
                obj["companyRegistrationNumber"] = event.searchResult[i]['companyRegistrationNumber'] && event.searchResult[i]['companyRegistrationNumber'] != "" ? event.searchResult[i]['companyRegistrationNumber'] : "" ;
                
                obj["telephone"] = event.searchResult[i]["RegAddress_Modified"] && event.searchResult[i]["RegAddress_Modified"]["telephone"] && event.searchResult[i]["RegAddress_Modified"]["telephone"] != "" ? event.searchResult[i]["RegAddress_Modified"]["telephone"] : "";
                
                obj["website"] = event.searchResult[i]["RegAddress_Modified"] && event.searchResult[i]["RegAddress_Modified"]["website"] && event.searchResult[i]["RegAddress_Modified"]["website"] != "" ? event.searchResult[i]["RegAddress_Modified"]["website"] : "";
                
                obj["telephone"] = event.searchResult[i]["RegAddress_Modified"] && event.searchResult[i]["RegAddress_Modified"]["telephone"] && event.searchResult[i]["RegAddress_Modified"]["telephone"] != "" ? event.searchResult[i]["RegAddress_Modified"]["telephone"] : "";
                
                obj["ctps"] = event.searchResult[i]["RegAddress_Modified"] && event.searchResult[i]["RegAddress_Modified"]["ctps"] && event.searchResult[i]["RegAddress_Modified"]["ctps"] != "" ? event.searchResult[i]["RegAddress_Modified"]["ctps"] : "";
                
                obj["region"] = event.searchResult[i]["RegAddress_Modified"] && this.titlecasePipe.transform(event.searchResult[i]["RegAddress_Modified"]["region"]) && this.titlecasePipe.transform(event.searchResult[i]["RegAddress_Modified"]["region"]) != "" ? this.titlecasePipe.transform(event.searchResult[i]["RegAddress_Modified"]["region"]) : "";

                obj["sicCode07"] = event.searchResult[i]["sicCode07"];

                obj['RegAddress'] = event.searchResult[i]['RegAddress_Modified'] && this.commonService.formatCompanyAddress(event.searchResult[i]['RegAddress_Modified']);

                obj['companyContactDetails'] = event.searchResult[i]['companyContactDetails'];
                let tradeData = event.searchResult[i]

                if(Object.keys( tradeData ).includes('exportData') && Object.keys( tradeData ).includes('importData')){

                    obj['lastFiveYearExports'] =  Array.isArray( tradeData['exportData']['lastFiveYearExports'] ) ? null : tradeData['exportData']['lastFiveYearExports'];
                    obj['lastOneYearExports'] = Array.isArray( tradeData['exportData']['lastOneYearExports'] ) ? null : tradeData['exportData']['lastOneYearExports'];
                    obj['lastFiveYearImports'] = Array.isArray( tradeData['importData']['lastFiveYearImports'] ) ? null : tradeData['importData']['lastFiveYearImports'];
                    obj['lastOneYearImports'] = Array.isArray( tradeData['importData']['lastOneYearImports'] ) ? null : tradeData['importData']['lastOneYearImports'];
                    obj['exportAmount'] = tradeData['exportAmount'];
                    obj['exchangeRateEffect'] = tradeData['exchangeRateEffect'];
                    
                }
                obj['internationalScoreDescription'] = tradeData['internationalScoreDescription'];


                /* obj['directorsData'] = event.searchResult[i]['directorsData']; */

                let outstandingCount = 0,
                fullySatisfiedCount = 0,
                tempCharge = {},
                monthArray = [],
                monthArrayForRegOn = [],
                pscArray = [],
                directorNameArr = [],
                person_entiledArr = [],
                person_entiledArrForFs = [],
                person_entiledArrForPS = [],
                person_counts : string,
                person_countsfully : string,
                person_countspartial : string,
                mortgage_array =[],
                mortgageCount: string,
                person_array = [],
                person_array_fully = [],
                person_array_partial = [],
                replaceString = /Limited|limited|ltd|Ltd|[�]/g,
                newString : string,
                newStringForFS : string,
                newStringForPS : string,
                temchargeData = []


                if (event.searchResult[i]["chargesData"]) {
                    event.searchResult[i]["chargesData"].forEach(elementCharges => {
                        //  memorandumNatureArray.push(elementCharges['memorandumNature']);
                        /* Outstanding count */
                        if (["t", "u", "v", "w", "x", "y", "z", null, ""].includes(elementCharges['memorandumNature'])) {
                            temchargeData.push(elementCharges)
                            outstandingCount++;
                        }
                        /* Fully Satisfied count */

                        if(["b","f","p","r"].includes(elementCharges['memorandumNature'])){
                            fullySatisfiedCount++;      
                        }

                        /* For Month name to count number (Only Outstanding) */
                        if (["t", "u", "v", "w", "x", "y", "z", null, ""].includes(elementCharges['memorandumNature'])) {

                            if (elementCharges['createdDate']) {
                                let tempDate = elementCharges['createdDate'];
                                // monthArray.push(Month[parseInt(tempDate.split('/')[1])]);
                            }
                            if (elementCharges['regDate']) {
                                let tempDateForRegOn = elementCharges['regDate'];
                                // monthArrayForRegOn.push(Month[parseInt(tempDateForRegOn.split('/')[1])]);
                            }
                        }
                        if (elementCharges["mortgageDetails"] && elementCharges["mortgageDetails"].length > 0 ) {
                            elementCharges["mortgageDetails"].forEach(element => {
            
                                if (element.recordType == "mortgage type") {
                                    tempCharge["classification"] = this.titlecasePipe.transform(element.description);
                                    mortgage_array.push(tempCharge["classification"]);
                                }
                                // person entitled ( outstanding )
                                if (["t", "u", "v", "w", "x", "y", "z", null, ""].includes(elementCharges['memorandumNature'])) { 
                                    if( element.recordType == "persons entitled") {
        
                                        newString = element.description.replace(replaceString, (_match) => {
                                            return "";
                                        });
                                        
                                        tempCharge["person_entile_outs"] = this.titlecasePipe.transform(newString);
                                        person_entiledArr.push(tempCharge["person_entile_outs"]);
                                    
                                    }
                                }
                                //person entitled ( fully satisfied )
                                if(["b","f","p","r"].includes(elementCharges['memorandumNature'])) {
                                    if( element.recordType == "persons entitled" ) {
                                        newStringForFS = element.description.replace(replaceString, (_match) => {
                                            return "";
                                        });
                                        tempCharge["person_entile_fully"] = this.titlecasePipe.transform(newStringForFS);
                                        person_entiledArrForFs.push(tempCharge["person_entile_fully"])
                                    }
                                    
                                }
                                //person entitled ( partial satisfied )
                                if (["s"].includes(elementCharges['memorandumNature'])) {
                                    if (element.recordType == "persons entitled") {
                                        newStringForPS = element.description.replace(replaceString, (_match) => {
                                            return "";
                                        });
                                        tempCharge["person_entile_partial"] = this.titlecasePipe.transform(newStringForPS);
                                        person_entiledArrForPS.push(tempCharge["person_entile_partial"]);
                                    }
                                }

                                let countP = {};
                                let countM = {};
                                let countPFS = {};
                                let countPPS = {};

                                /* For Outstanding */
                                for(let countPerson of person_entiledArr){
                                    countP[countPerson] = 1 + ( countP[countPerson] || 0 )
                                }
                                person_counts = Object.keys(countP).map(function (key) {
                                    return " " + key +'('+ countP[key] + ')';
                
                                }).join(",");
                                /*  */

                                /* For Fully Satisfied */
                                for(let countPersonFuly of person_entiledArrForFs) {
                                    countPFS[countPersonFuly] = 1 + (countPFS[countPersonFuly] || 0 )
                                }
                                person_countsfully = Object.keys(countPFS).map(function (key) {
                                    return " " + key +'('+ countPFS[key] + ')';
                                }).join(",");
                                /*  */

                                /* For Partial Satisfied */
                                for(let countPersonPartial of person_entiledArrForPS) {
                                    countPPS[countPersonPartial] = 1 + (countPPS[countPersonPartial] || 0 )
                                }
                                person_countspartial = Object.keys(countPPS).map(function (key) {
                                    return " " + key +'('+ countPPS[key] + ')';
                                }).join(",");
                                /*  */


                                for(let countmortage of mortgage_array){
                                    countM[countmortage] = 1 + ( countM[countmortage] || 0 )
                                }
                                mortgageCount = Object.keys(countM).map(function (key) {
                                    return " " + key +'('+ countM[key] + ')';
                
                                }).join(",");
                            });
                        }
                    });
                }    

                if(event.searchResult[i]["pscName"]) {
                    event.searchResult[i]["pscName"].forEach(elemenPsc => {
                        if(elemenPsc){
                            pscArray.push(this.titlecasePipe.transform(' ' + elemenPsc));
                        }
                    });
                }

                if (event.searchResult[i]["personContactDetails"]) {
                    for (let person of event.searchResult[i]["personContactDetails"]) {
                        let personFullName = "";
                        if (person.middle_name) {
                            personFullName = person.first_name + ' '+ person.middle_name + ' ' + person.last_name;
                        }else{
                            personFullName = person.first_name + ' ' + person.last_name;
                        }
                    
                        if (personFullName.toLowerCase().includes(urlParams1.get('directorName'))) {
                        
                            event.searchResult[i]['directorLinkedIn'] = person.linkedin_url;
                            if (person.email_gen1 && person.email_gen1 !== " ") {
                                event.searchResult[i]['directorEmail'] = person.email_gen1;
                            } else if (person.email_1 && person.email_1 !== " ") {
                                event.searchResult[i]['directorEmail'] = person.email_1;
                            } else {
                                event.searchResult[i]['directorEmail'] = "-"
                            }
                            break;
                        }
                    }
                }
                if (event.searchResult[i]["directorsData"]) {
                    for (let director of event.searchResult[i]["directorsData"]) {

                        if(director["detailedInformation"] && director["detailedInformation"]["fullName"]){
                                
                            directorNameArr.push(this.titlecasePipe.transform(director["detailedInformation"]["fullName"]));
                            
                        }
                        
                        if (director.directorJobRole && director.directorJobRole !== " ") {
                            event.searchResult[i]['occupation'] = this.titlecasePipe.transform(director.directorJobRole);
                        }else {
                            event.searchResult[i]['occupation'] = "-"
                        }
                    }
                }

                obj["pscNameFd"] = pscArray;
                obj["outstandingCount"] = outstandingCount;
                obj["fullySatisfiedCount"] = fullySatisfiedCount;
                obj['chargesData'] = temchargeData;
               
                
                if (mortgageCount) {
                    obj['classification'] = mortgageCount.split(",");
                }
                if (person_counts) {
                    obj['person_entile_outs'] = person_counts.replace(/[\s;]+/g, " ").split(",");
                }
                if(person_countsfully){
                    obj['person_entile_fully'] = person_countsfully.replace(/[\s;]+/g," ").split(",");
                }
                if(person_countspartial){
                    obj['person_entile_partial'] = person_countspartial.replace(/[\s;]+/g," ").split(",");
                }
                
                person_array.push(obj['person_entile_outs']);  
                obj['person_entile_outs'] = person_array[0];

                person_array_fully.push(obj['person_entile_fully']);
                obj['person_entile_fully'] = person_array_fully[0];

                person_array_partial.push(obj['person_entile_partial']);
                obj['person_entile_partial'] = person_array_partial[0];
                        
                // obj['memorandumNature'] = memorandumNatureArray;
                
                /* START : For Month Count */
                var counts = {};
                for (let month of monthArray ) {
                    counts[month] = 1 + (counts[month] || 0);
                }
                /* END:  For Month Count */

                /* START : For Registered On Month Count */
                var regCounts = {};
                for ( let month of monthArrayForRegOn ) {
                    regCounts[ month ] = 1 + ( regCounts[ month ] || 0 );
                }
                /* END : For Registered On Month Count */

                /* START : Convertion of key pair object to String */

                let dateWithCounts = Object.keys(counts).map(function (key) {
                    return " " + key + " " +'('+ counts[key] + ')';

                }).join(",");

                /* END: Convertion of key pair object to String */

                /* START : Convertion of key pair object to String */
                let regDateWithCounts = Object.keys( regCounts ).map(function (key) {
                    return " " + key + " " +'('+ regCounts[ key ] + ')'
                }).join(",");
                /* END : Convertion of key pair object to String */

                obj["dateMonthCount"] =  dateWithCounts.split(",");

                obj["dateMonthCountForRegOn"] = regDateWithCounts.split(",");
                
                obj["personEntitled"] = tempPersonEntitledArray;

                obj["personEntitledRaw"] = tempPersonEntitledRawArray;
                    
                if (event.searchResult[i].simplifiedAccounts) {

                    if(event.searchResult[i].simplifiedAccounts[event.searchResult[i].simplifiedAccounts.length - 1].turnover && event.searchResult[i].simplifiedAccounts[event.searchResult[i].simplifiedAccounts.length - 1].turnover != ""){
                        event.searchResult[i]['turnover_latest'] = event.searchResult[i].simplifiedAccounts[event.searchResult[i].simplifiedAccounts.length - 1].turnover;
                        obj["turnover"] = event.searchResult[i].simplifiedAccounts[event.searchResult[i].simplifiedAccounts.length - 1].turnover;
                    } else {
                        event.searchResult[i]['turnover_latest'] = "-";
                        obj["turnover"] = undefined;
                    }
                    if(event.searchResult[i].simplifiedAccounts[event.searchResult[i].simplifiedAccounts.length - 1].estimated_turnover && event.searchResult[i].simplifiedAccounts[event.searchResult[i].simplifiedAccounts.length - 1].estimated_turnover != ""){
                        event.searchResult[i]['estimated_turnover'] = event.searchResult[i].simplifiedAccounts[event.searchResult[i].simplifiedAccounts.length - 1].estimated_turnover;                    
                        obj["estimated_turnover"] = event.searchResult[i].simplifiedAccounts[event.searchResult[i].simplifiedAccounts.length - 1].estimated_turnover;
                    } else {
                        event.searchResult[i]['estimated_turnover'] = "-";
                        obj["estimated_turnover"] = undefined;
                    }
                    if(event.searchResult[i].simplifiedAccounts[event.searchResult[i].simplifiedAccounts.length - 1].totalAssets && event.searchResult[i].simplifiedAccounts[event.searchResult[i].simplifiedAccounts.length - 1].totalAssets != ""){
                        event.searchResult[i]['totalAssets_latest'] = event.searchResult[i].simplifiedAccounts[event.searchResult[i].simplifiedAccounts.length - 1].totalAssets;
                    } else {
                        event.searchResult[i]['totalAssets_latest'] = "-";
                    }
                    if(event.searchResult[i].simplifiedAccounts[event.searchResult[i].simplifiedAccounts.length - 1].totalLiabilities && event.searchResult[i].simplifiedAccounts[event.searchResult[i].simplifiedAccounts.length - 1].totalLiabilities != ""){
                        event.searchResult[i]['totalLiabilities_latest'] = event.searchResult[i].simplifiedAccounts[event.searchResult[i].simplifiedAccounts.length - 1].totalLiabilities;
                    } else {
                        event.searchResult[i]['totalLiabilities_latest'] = "-";
                    }
                    if(event.searchResult[i].simplifiedAccounts[event.searchResult[i].simplifiedAccounts.length - 1].netWorth && event.searchResult[i].simplifiedAccounts[event.searchResult[i].simplifiedAccounts.length - 1].netWorth != ""){
                        event.searchResult[i]['netWorth_latest'] = event.searchResult[i].simplifiedAccounts[event.searchResult[i].simplifiedAccounts.length - 1].netWorth;
                        obj["netWorth"] = event.searchResult[i].simplifiedAccounts[event.searchResult[i].simplifiedAccounts.length - 1].netWorth;
                    } else {
                        event.searchResult[i]['netWorth_latest'] = "-";
                        obj["netWorth"] = undefined;
                    } 
                    if(event.searchResult[i].statutoryAccounts){
                        if(event.searchResult[i].statutoryAccounts[event.searchResult[i].simplifiedAccounts.length - 1].grossProfit && event.searchResult[i].statutoryAccounts[event.searchResult[i].simplifiedAccounts.length - 1].grossProfit != ""){
                            event.searchResult[i]['grossProfit_latest'] = event.searchResult[i].statutoryAccounts[event.searchResult[i].simplifiedAccounts.length - 1].grossProfit;
                        } else {
                            event.searchResult[i]['grossProfit_latest'] = '-';
                        }
                    } else {
                        event.searchResult[i]['grossProfit_latest'] = '-';
                    }

                    if (event.searchResult[i].simplifiedAccounts[0].numberOfEmployees) {
                        event.searchResult[i]['numberOfEmployees'] = parseInt(event.searchResult[i].simplifiedAccounts[0].numberOfEmployees);
                    }
                }
                if (event.searchResult[i].ccjDetails) {
                    event.searchResult[i]['CCJCount'] = event.searchResult[i].ccjDetails.length;
                    event.searchResult[i]['ccjDetails'] = event.searchResult[i].ccjDetails;
                }
                else {
                    event.searchResult[i]['CCJCount'] = '-';
                }
                if (event.searchResult[i].RegAddress_Modified.district_code) {
                    event.searchResult[i].RegAddress_Modified.district_code = event.searchResult[i].RegAddress_Modified.district_code.toUpperCase();
                }
                if (event.searchResult[i].hasShareHolders) {
                    cmpNoArray.push(event.searchResult[i].companyRegistrationNumber.toLowerCase());
                }
                if(event.searchResult[i].hasCompanyLinkedinUrl || event.searchResult[i].hasCompanyWebsite || event.searchResult[i].hasCompanyGenericMail ) {
                    companyContactCmpNoArr.push(event.searchResult[i].companyRegistrationNumber.toUpperCase());
                }
                this.chargesFilterData.push(obj);
            }
        }

        this.companyData = [];
        this.companyData = event.searchResult;

        if (this.companyData?.length === 0) {
            this.showExportButton = true;
        } else {
            this.showExportButton = false;
            this.companyData = [];
            this.companyData = this.formatData(this.companyData);
        }
        
        // this.firstPage = true;

        this.dissolvedIndex = event?.dissolvedIndex;

        if ( this.switchToChargesData || this.switchToDirectorScreen || this.switchToContactInformationScreen || this.switchToTradeData ) {
            if ( this.operatingTableElemnts != undefined ) {
                this.adminRecordListComponent.resetFilters( this.operatingTableElemnts.adminRecordListTable );
            }

            if (this.operatingTableElemnts?.recordListPaginator) {
                this.operatingTableElemnts.recordListPaginator.rows = 25;
            }
        } else {
            this.recordListComponent.resetFilters( this.operatingTableElemnts?.recordListTable );
        }

        if (this.operatingTableElemnts?.recordListPaginator) {
            this.operatingTableElemnts.recordListPaginator.first = 0;
        }
    }

    getRecordTableOutputValues( event ) {
        this.defaultSearchData = false;
        this.showChargesTab = true;

        const { listId, pageName } = this.payloadForChildApi;
        
        if ( listId ) {
            this.showChargesTab = false;
            
            if ( [ pageName, this.pageInQueryParam ].includes( ListPageName.charges.inputPage ) || [ pageName, this.pageInQueryParam ].includes( ListPageName.charges.outputPage ) ) {
                this.getCompaniesFromChargesList();
                return;
            }

            this.getCompaniesFromList();
            return;
        }

        if ( this.searchCompanyService.getView() == 'director' ) {

            this.getRecordForDirectorTable();

        } else if ( this.searchCompanyService.getView() == 'contact' ) {

            this.getRecordForContactTable();

        } else {

            this.getRecordForTable();

        }
        
    }

    getRecordForTable() {
        this.sharedLoaderService.showLoader();

        const RequestPayloadForDefault = { ...this.payloadForChildApi };

        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: this.constantMessages['infoMessage']['recordFetching'] });
        setTimeout(() => {
            this.msgs = [];
        }, 4000);

        this.appliedFiltersForCharges = RequestPayloadForDefault['filterData'];
        
        if( this.activeRoute.snapshot.queryParams?.dgInsights ){
            RequestPayloadForDefault['requestFor'] = 'company-insights';
        }

        this.searchFiltersService.getFilteredResults( RequestPayloadForDefault, this.dissolvedIndex ).then( data => {
            
            if ( data?.status == 200 ) {

                let dataArray = [];

                this.ChargeDashdata = data['results'];
                this.ChargeDashdata['chargesYearArray'] = data.chargesYearArray;

                // this.dataForChargeDashboard( data.results );

                this.searchTotalCount = data.results.total.value;
                
                this.msgs = [];
                this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['recordsFetched'] });
                setTimeout(() => {
                    this.msgs = [];
                }, 4000);

                for ( let resultData of data.results.hits)  {
                    dataArray.push(resultData._source);
                }
                
                if (dataArray.length == data.results.hits.length) {

                    this.companyData = [];

                    if ( [ 'trade', 'charges' ].includes( this.searchCompanyService.getView() ) ) {
                        this.companyData = this.chargesFormatData( dataArray );
                        this.companyDataForMortgages = JSON.parse(JSON.stringify(dataArray))
                    } else {
                        this.companyData = this.formatData(dataArray);
                    }

                }

            } else {
                this.sharedLoaderService.hideLoader();
                this.msgs = [];
                this.msgs.push({ severity: 'info', summary: data?.msg });
                setTimeout(() => {
                    this.msgs = [];
                }, 5000);
            }
            
            this.sharedLoaderService.hideLoader();

            this.searchFiltersService.getContactsCountResult( RequestPayloadForDefault, this.dissolvedIndex ).then( data => {
                this.socialNetworkCounts = data;
            });
        });
    }

    getRecordForDirectorTable() {

        const RequestPayloadForDirector = { ...this.payloadForChildApi };

        this.searchFiltersService.getDirectorFilteredResults( RequestPayloadForDirector, this.dissolvedIndex ).then( data => {

            if ( data.status == 200 ) {

                let dataArray = [];

                this.searchTotalCount = data.totalCount;
                this.directorTotalCount = data.totalDirectorCount;
                this.msgs = [];
                this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['recordsFetched'] });
                setTimeout(() => {
                    this.msgs = [];
                }, 3000);

                for ( let resultData of data.results ) {
                    resultData['job_title'] = resultData['job_title'].split(',').map(s => s.trim()).join(', ');
                    dataArray.push( resultData );
                }

                if ( dataArray.length == data.results.length ) {
                    this.companyData = [];
                    this.companyData = dataArray;
                }

            }

            this.sharedLoaderService.hideLoader();

        });

    }

    getRecordForContactTable() {

        const RequestPayloadForContact = { ...this.payloadForChildApi };

        this.searchFiltersService.getContactInformationFilteredResults( RequestPayloadForContact, this.dissolvedIndex ).then( data => {
            if ( data.status == 200 ) {
                let dataArray = [];

                this.searchTotalCount = data.paginationCount;
                this.totalContacts = data.contactsCount;
                this.msgs = [];
                this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['recordsFetched'] });
                setTimeout(() => {
                    this.msgs = [];
                }, 4000);
                
                for ( let resultData of data.results ) {
                    dataArray.push( resultData );
                }
                
                if ( dataArray.length == data.results.length ) {
                    this.companyData = [];
                    this.companyData = dataArray;
                }

            } else if( data.status == 400 ) {
                this.companyData = data.results;
                this.searchTotalCount = data.paginationCount
            }
        });

    }

    // dataForChargeDashboard( dataFromApi ){
    //     console.log("APIres>", dataFromApi );


    //     this.ChargeDashdata = dataFromApi,
    //     console.log("🚀 -->> dataForChargeDashboard -->> this.ChargeDashdata:", this.ChargeDashdata )
    // }

    getCompaniesFromList() {
        this.sharedLoaderService.showLoader();

        this.postCodeLatLong( )

        let filterPageNameExportedBucket = this.payloadForChildApi.filterData.filter((item)=> item?.chip_group == "Saved Lists" )

        if(this.activeRoute.snapshot.queryParams.listPageName == 'exportedBucket' || filterPageNameExportedBucket[0]?.chip_values?.[0] == "Exported Bucket" ){
            this.searchCompanyService.setPageName(this.listPageName) 
        }
        if( this.activeRoute?.snapshot?.queryParams['listPageName'] ){
			this.searchCompanyService.updatePayload( { pageName: this.activeRoute.snapshot.queryParams['listPageName'] } );
		}

        if ( ['businessCollaborators', 'procurementPartners', 'fiscalHoldings', 'diversityCalculation', 'supplierResilience'].includes(this.listPageName) ) {
            this.searchCompanyService.setPageName(this.listPageName);
        }

        if( this.listPageName == 'connectPlusCompany') {
            this.payloadForChildApi['reqBy'] =  'connectPlusCompany'
        } else {
            if ( this.payloadForChildApi['reqBy'] ==  'connectPlusCompany' ) {
                delete this.payloadForChildApi['reqBy']
            }
        }

        // const RequestPayloadForList = { ...this.payloadForChildApi };
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: this.constantMessages['infoMessage']['recordFetching'] });
        setTimeout(() => {
            this.msgs = [];
        }, 3000);

        setTimeout(() => {

            for( let item of this.payloadForChildApi.filterData ){
                if( ['Trading Post Code', 'Innovate Post Code', 'Post Code'].includes( item.chip_group ) ) {
                    item.chip_values =  item.chip_values
                    item['userLocation'] = this.userLocation;
                }
            }
            
            const RequestPayloadForList = JSON.parse(JSON.stringify(this.payloadForChildApi));
            
            this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_LIST', 'getCompaniesInListTableData', RequestPayloadForList ).subscribe( res => {
                
                let cmpNoArray = [], dataCompany = res.body && res.body['data'] ? res.body['data'] : [];
                this.sharedLoaderService.hideLoader();
                this.msgs = [];
                this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['recordsFetched'] });
                setTimeout(() => {
                    this.msgs = [];
                }, 4000);
            
                if ( dataCompany.length > 0 ) {
                    if ( this.searchCompanyService.getView() == 'trade' ) {
                        // this.getTableDataValue(dataCompany)
                        this.chargesFilterData = dataCompany.map( val => {
                            val['lastFiveYearExports'] =  Array.isArray( val['exportData']['lastFiveYearExports'] ) ? null : val['exportData']['lastFiveYearExports'];
                            val['lastOneYearExports'] = Array.isArray( val['exportData']['lastOneYearExports'] ) ? null : val['exportData']['lastOneYearExports'];
                            val['lastFiveYearImports'] = Array.isArray( val['importData']['lastFiveYearImports'] ) ? null : val['importData']['lastFiveYearImports'];
                            val['lastOneYearImports'] = Array.isArray( val['importData']['lastOneYearImports'] ) ? null : val['importData']['lastOneYearImports'];
                            val['exportAmount'] = val['exportAmount'];
                            val['exchangeRateEffect'] = val['exchangeRateEffect'];
                            val['internationalScoreDescription'] = val['internationalScoreDescription'];
                            return val;
                        })
                    }
    
                    for (let i = 0; i < dataCompany.length; i++) {
                        if (dataCompany[i].simplifiedAccounts) {
                            if(dataCompany[i].simplifiedAccounts[0].turnover && dataCompany[i].simplifiedAccounts[0].turnover != ""){
                                dataCompany[i]['turnover_latest'] = dataCompany[i].simplifiedAccounts[0].turnover;
                            } else {
                                dataCompany[i]['turnover_latest'] = "-";
                            }
                            if(dataCompany[i].simplifiedAccounts[0].estimated_turnover && dataCompany[i].simplifiedAccounts[0].estimated_turnover != ""){
                                dataCompany[i]['estimated_turnover'] = dataCompany[i].simplifiedAccounts[0].estimated_turnover;
                            } else {
                                dataCompany[i]['estimated_turnover'] = "-";
                            }
                            if(dataCompany[i].simplifiedAccounts[0].totalAssets && dataCompany[i].simplifiedAccounts[0].totalAssets != ""){
                                dataCompany[i]['totalAssets_latest'] = dataCompany[i].simplifiedAccounts[0].totalAssets;
                            } else {
                                dataCompany[i]['totalAssets_latest'] = "-";
                            }
                            if(dataCompany[i].simplifiedAccounts[0].totalLiabilities && dataCompany[i].simplifiedAccounts[0].totalLiabilities != ""){
                                dataCompany[i]['totalLiabilities_latest'] = dataCompany[i].simplifiedAccounts[0].totalLiabilities;
                            } else {
                                dataCompany[i]['totalLiabilities_latest'] = "-";
                            }
                            if(dataCompany[i].simplifiedAccounts[0].netWorth && dataCompany[i].simplifiedAccounts[0].netWorth != ""){
                                dataCompany[i]['netWorth_latest'] = dataCompany[i].simplifiedAccounts[0].netWorth;
                            } else {
                                dataCompany[i]['netWorth_latest'] = "-";
                            }
                            if(dataCompany[i].statutoryAccounts){
                                if(dataCompany[i].statutoryAccounts[0].grossProfit && dataCompany[i].statutoryAccounts[0].grossProfit != ""){
                                    dataCompany[i]['grossProfit_latest'] = dataCompany[i].statutoryAccounts[0].grossProfit;
                                }
                                else {
                                    dataCompany[i]['grossProfit_latest'] = '-';
                                }
                                } else {
                                    dataCompany[i]['grossProfit_latest'] = '-';
                                }
                            if (dataCompany[i].simplifiedAccounts[0].numberOfEmployees) {
                                dataCompany[i]['numberOfEmployees'] = parseInt(dataCompany[i].simplifiedAccounts[0].numberOfEmployees);
                            }
                            
                        }
                        if (dataCompany[i].ccjDetails) {
                            dataCompany[i]['CCJCount'] = dataCompany[i].ccjDetails.length;
                        }
                        else {
                            dataCompany[i]['CCJCount'] = '-';
                        }
                        if (dataCompany[i] && dataCompany[i].RegAddress_Modified && dataCompany[i].RegAddress_Modified.district_code) {
                            dataCompany[i].RegAddress_Modified.district_code = dataCompany[i].RegAddress_Modified.district_code.toUpperCase();
                        }
                        if (dataCompany[i].hasShareHolders) {
                            cmpNoArray.push(dataCompany[i].companyRegistrationNumber.toLowerCase());
                        }
                    
                    }
    
                    this.companyData = [];
                    this.companyData = this.formatData( dataCompany );
    
                    // this.socialNetworkCounts = res.body.contactsCount;
                    this.listId = this.listId;
                    this.searchTotalCount = +res.body['count'];
    
                    if (this.companyData.length === 0) {
                        this.showExportButton = true;
                    } else {
                        this.showExportButton = false;
                    }
                } else {
                    this.companyData = [];
                    this.companyData = this.formatData(dataCompany);
                    this.searchTotalCount = +res.body['count'];
                }
    
            });

            const RequestPayloadForDefault = { ...this.payloadForChildApi };
            
            this.searchFiltersService.getContactsCountResult( RequestPayloadForDefault, this.dissolvedIndex ).then( data => {
                this.socialNetworkCounts = data;
            });

        }, 1000);
        
    }

    async postCodeLatLong(){
        let searchFilters = this.payloadForChildApi?.filterData
        if ( JSON.stringify( searchFilters ).includes("Post Code") || JSON.stringify( searchFilters ).includes("Trading Post Code") || JSON.stringify( searchFilters ).includes("landCoporateDetailsPostCode") ) {
            let tempPostCode = ''
            for ( let filter of searchFilters ) {
                for (let key in filter) {
                    if (filter[key] == "Post Code" || filter[key] == "Trading Post Code" || filter[key] == "landCoporateDetailsPostCode") {
                        if (typeof (filter['chip_values'][0]) == 'object') {
                            filter['chip_values'][0] = filter['chip_values'][0][0]
                        }
                        if (parseInt(filter['chip_values'][0].split(" ")[2]) > 0) {
                            tempPostCode = filter['chip_values'][0].split(" ")[0]
                            let userLocation = {};
                            userLocation = await this.getLatLong(tempPostCode).then(data => data)
                            filter['chip_values'][0] = [filter['chip_values'][0]]
                            filter['userLocation'] = userLocation
                        }
                    }
                }
            }
        // this.searchCompanyService.updatePayload( searchFilters );
}
    }

    async getLatLong(tempPostCode) {
        let obj = {
                    'postcode': tempPostCode
                }
        this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_API', 'latLong', obj ).subscribe( data => {
            this.userLocation = data.body.results;
        });
        return this.userLocation;
    }

    getCompaniesFromChargesList() {

        this.postCodeLatLong()

        const RequestPayloadForChargesList = { ...this.payloadForChildApi };
        const { startAfter, pageSize } = RequestPayloadForChargesList;

        RequestPayloadForChargesList['pageNumber'] = startAfter ? ( ( startAfter / pageSize ) + 1 ) : startAfter + 1;

        // delete RequestPayloadForChargesList.filterData;
        delete RequestPayloadForChargesList.startAfter;
        delete RequestPayloadForChargesList.startPlan;

        setTimeout(() => {
            for( let item of RequestPayloadForChargesList.filterData ){
                if( ['Trading Post Code', 'Innovate Post Code', 'Post Code'].includes( item.chip_group ) ) {
                    item.chip_values =  item.chip_values  
                    item['userLocation'] = this.userLocation;
                }
            }
    
            this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_API', 'companiesByListId', RequestPayloadForChargesList ).subscribe( res => {
    
                if ( res.body['status'] == 200 ) {
                
                    let dataArray = [];
    
                    for ( let resultData of res.body['results'].hits ) {
                        dataArray.push( resultData._source );
                    }
    
                    this.searchTotalCount = res.body['total'];
                    this.companyData = [];
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['recordsFetched'] });
                    setTimeout(() => {
                        this.msgs = [];
                    }, 4000);
                    this.companyData = this.chargesFormatData( dataArray );
    
                    this.searchCompanyService.setChargesView();
    
                    // if ( Object.keys( this.activeRoute.snapshot.queryParams ).length ) {
                    //     this.location.replaceState('/company-search');
                    //     this.activeRoute.snapshot.queryParams = {};
                    // }
                }
                setTimeout(() => {
                    this.sharedLoaderService.hideLoader();
                }, 2000);
                
            });
            
        }, 1000);

    }

    getSICCodeInArrayFormat(SICCode) {
        return this.commonService.getSICCodeInArrayFormat(SICCode);
    }

    getTotalCount(event) {
        this.searchTotalCount = event;
    }

    getContactsCount(event) {
        this.contactsCount = event;
    }

    formatData( companiesData ) {

        let tempCompaniesData = [];
        companiesData?.forEach( companyData => {
            
            companyData["total_directors_count"] = 0
            companyData["resigned_directors_count"] = 0;
            companyData["active_directors_count"] = 0;
            companyData["NumMortCharges"] = 0;
            companyData["NumMortCharges"] = 0;
            companyData["latestFinancialYear"] = '';

            if ( companyData["statutoryAccounts"] ) {

                companyData["latestFinancialYear"] =  companyData.statutoryAccounts[0]?.['yearEndDate'] && companyData.statutoryAccounts[0]?.['yearEndDate'].split("/").pop() || '';

            }

            if (companyData["companyRegistrationDate"] !== undefined) {

                if (companyData["companyRegistrationDate"] !== null) {
                    companyData["IncorporationDate"] = this.formatDate(companyData["companyRegistrationDate"])
                }

            }

            if (companyData['RegAddress_Modified']) {
                companyData['RegAddress'] = this.commonService.formatCompanyAddress(companyData['RegAddress_Modified']);
            }

            if (companyData["directorsData"] !== undefined) {
                if (companyData["directorsData"] !== null) {
                    companyData["total_directors_count"] = companyData["directorsData"].length;
                    companyData["active_directors_count"] = companyData["activeDirectorsCount"];                   
                    companyData["resigned_directors_count"] = companyData["resignedDirectorsCount"];
                }
            }

            if (companyData["mortgagesObj"] !== undefined) {
                if (companyData["mortgagesObj"] !== null) {
                    companyData["NumMortCharges"] = companyData["mortgagesObj"].length;
                }
            }
            if (companyData["accountsMadeUpDate"] !== undefined) {
                if (companyData["accountsMadeUpDate"] !== null) {
                    companyData["accountsMadeUpDate"] = this.formatDate(companyData["accountsMadeUpDate"])
                }
            }
            if (companyData["businessName"] !== undefined && companyData["businessName"] !== null && companyData["businessName"] !== "") {
                tempCompaniesData.push(companyData)
            } else if (companyData["companyRegistrationNumber"] && companyData["buyer_name"] && companyData["businessName"]) {
                tempCompaniesData.push(companyData)
            }

            // Formatting financial data for table

            if (companyData.simplifiedAccounts) {
                if(companyData.simplifiedAccounts[0].turnover && companyData.simplifiedAccounts[0].turnover != ""){
                    companyData['turnover_latest'] = companyData.simplifiedAccounts[0].turnover;
                } else {
                    companyData['turnover_latest'] = "-";
                }
                if(companyData.simplifiedAccounts[0].estimated_turnover && companyData.simplifiedAccounts[0].estimated_turnover != ""){
                    companyData['estimated_turnover'] = companyData.simplifiedAccounts[0].estimated_turnover;
                } else {
                    companyData['estimated_turnover'] = "-";
                }                            
                if(companyData.simplifiedAccounts[0].totalAssets && companyData.simplifiedAccounts[0].totalAssets != ""){
                    companyData['totalAssets_latest'] = companyData.simplifiedAccounts[0].totalAssets;
                } else {
                    companyData['totalAssets_latest'] = "-";
                }
                if(companyData.simplifiedAccounts[0].totalLiabilities && companyData.simplifiedAccounts[0].totalLiabilities != ""){
                    companyData['totalLiabilities_latest'] = companyData.simplifiedAccounts[0].totalLiabilities;
                } else {
                    companyData['totalLiabilities_latest'] = "-";
                }
                if(companyData.simplifiedAccounts[0].netWorth && companyData.simplifiedAccounts[0].netWorth != ""){
                    companyData['netWorth_latest'] = companyData.simplifiedAccounts[0].netWorth;
                } else {
                    companyData['netWorth_latest'] = "-";
                }
                if(companyData.statutoryAccounts){
                    if(companyData.statutoryAccounts[0].grossProfit && companyData.statutoryAccounts[0].grossProfit != ""){
                        companyData['grossProfit_latest'] = companyData.statutoryAccounts[0].grossProfit;
                    }
                    else {
                        companyData['grossProfit_latest'] = '-';
                    }
                    } else {
                        companyData['grossProfit_latest'] = '-';
                    }
                if (companyData.simplifiedAccounts[0].numberOfEmployees) {
                    companyData['numberOfEmployees'] = parseInt(companyData.simplifiedAccounts[0].numberOfEmployees);
                }
            }
            if (companyData.ccjDetails) {
                companyData['CCJCount'] = companyData.ccjDetails.length;
            }
            else {
                companyData['CCJCount'] = '-';
            }
            if ( companyData.RegAddress_Modified && companyData.RegAddress_Modified?.district_code ) {
                companyData.RegAddress_Modified.district_code = companyData.RegAddress_Modified.district_code.toUpperCase();
            }
        });

        return (tempCompaniesData);

    }

    chargesFormatData(companiesData) {
		this.chargesFilterData = [];
		companiesData.forEach(element => {
			let obj = {};

			obj["businessName"] = element["businessName"];

			obj["companyRegistrationNumber"] = element["companyRegistrationNumber"] && element["companyRegistrationNumber"] ? element["companyRegistrationNumber"] : "";

			obj["companyDOIAgeForCharges"] = (this.commonService.calculateAge(element['companyRegistrationDate']));
			
			if ( element["companyContactInformation"] && element["companyContactInformation"][0] && element["companyContactInformation"][0]["tel_1"] && element["companyContactInformation"][0]["tel_1"] !== "" ) {

				obj["telephone"] = element["companyContactInformation"][0]["tel_1"];

			} else if ( element["RegAddress_Modified"] && element["RegAddress_Modified"]["telephone"] && element["RegAddress_Modified"]["telephone"] != "" ) {

				obj["telephone"] = element["RegAddress_Modified"]["telephone"];

			} else {

				obj["telephone"] = "";

			}

			if ( element["companyContactInformation"] && element["companyContactInformation"][0] && element["companyContactInformation"][0]["ctps"] && element["companyContactInformation"][0]["ctps"] !== "" ) {

				obj["ctps"] = element["companyContactInformation"][0]["ctps"];

			} else if ( element["RegAddress_Modified"] && element["RegAddress_Modified"]["ctps"] && element["RegAddress_Modified"]["ctps"] != "" ) {

				obj["ctps"] = element["RegAddress_Modified"]["ctps"];

			} else {

				obj["ctps"] = "";

			}

			if ( element["companyContactInformation"] && element["companyContactInformation"][0] && element["companyContactInformation"][0]["website"] && element["companyContactInformation"][0]["website"] !== "" ) {

				obj["website"] = element["companyContactInformation"][0]["website"];

			} else if ( element["RegAddress_Modified"] && element["RegAddress_Modified"]["website"] && element["RegAddress_Modified"]["website"] != "" ) {

				obj["website"] = element["RegAddress_Modified"]["website"];

			} else {

				obj["website"] = "";

			}

			obj["region"] = element["RegAddress_Modified"] && this.titlecasePipe.transform(element["RegAddress_Modified"]["region"]) && this.titlecasePipe.transform(element["RegAddress_Modified"]["region"]) != "" ? this.titlecasePipe.transform(element["RegAddress_Modified"]["region"]) : "";

			obj["sicCode07"] = element["sicCode07"];

			obj["turnover"] = element["simplifiedAccounts"] && element["simplifiedAccounts"][0]['turnover'] && element["simplifiedAccounts"][0]['turnover'] != "" ? element["simplifiedAccounts"][0]['turnover'] : "";

			obj["netWorth"] = element["simplifiedAccounts"] && element["simplifiedAccounts"][0]['netWorth'] && element["simplifiedAccounts"][0]['netWorth'] != "" ? element["simplifiedAccounts"][0]['netWorth'] : "";

			obj['RegAddress'] = element['RegAddress_Modified'] && this.commonService.formatCompanyAddress(element['RegAddress_Modified']);
			obj['RegAddress_Modified'] = element['RegAddress_Modified'];

			obj["estimated_turnover"] = element["simplifiedAccounts"] && element["simplifiedAccounts"][0]['estimated_turnover'] && element["simplifiedAccounts"][0]['estimated_turnover'] != "" ? element["simplifiedAccounts"][0]['estimated_turnover'] : "-";

			obj['companyContactDetails'] = element['companyContactDetails'];

			obj['directorsData'] = element['directorsData'];

			obj['tagNameField'] = element['tagNameField'];
            
			// obj['chargeTagsName'] = element['chargesData'][0]['chargeTagsName'];
            

            obj['internationalScoreDescription'] = element['internationalScoreDescription'];

			if(element['exportData']){
				obj['lastFiveYearExports'] = Array.isArray( element['exportData']['lastFiveYearExports'] ) ? null : element['exportData']['lastFiveYearExports'];
				obj['lastOneYearExports'] = Array.isArray( element['exportData']['lastOneYearExports'] ) ? null : element['exportData']['lastOneYearExports'];
				obj['lastFiveYearImports'] = Array.isArray( element['importData']['lastFiveYearImports'] ) ? null : element['importData']['lastFiveYearImports'];
				obj['lastOneYearImports'] = Array.isArray( element['importData']['lastOneYearImports'] ) ? null : element['importData']['lastOneYearImports'];
				obj['exportAmount'] = element['exportAmount'];
				obj['exchangeRateEffect'] = element['exchangeRateEffect'];
			}

			let outstandingCount = 0,
				fullySatisfiedCount = 0,
				tempCharge = {},
				monthArray = [],
				yearArray = [],
				monthArrayForRegOn = [],
				yearArrayForRegOn = [],
				pscArray = [],
				person_entiledArr = [],
				person_entiledArrForFs = [],
				person_entiledArrForPS = [],
				person_counts: string,
				person_countsfully: string,
				mortgage_array = [],
				tagname_array = [],
				mortgageCount: string,
				person_array = [],
				person_array_fully = [],
				person_array_partial = [],
				person_countspartial: string,
				temchargeData = [],
				trimedArr: any,
                tagDetail = []

			if ( element["chargesData"] ) {

                const { chargesData } = element;

                if ( this.selectedGlobalCountry === 'ie' ) {

                    for ( let charge of chargesData ) {
                        if ( charge?.status === 'Not Satisfied' ) {
                            outstandingCount++;
                        }
                        if ( charge?.status === 'Fully Satisfied' ) {
                            fullySatisfiedCount++;
                        }
                        if ( charge?.createdDate ) {
                            let tempDate = charge?.createdDate;
                            monthArray.push( Month[ parseInt( tempDate.split('/')[1] ) ] );
                            yearArray.push( tempDate.split('/')[2] );
                        }
                        if ( charge?.regDate ) {
                            let tempDateForRegOn = charge?.regDate;
                            monthArrayForRegOn.push( Month[ parseInt( tempDateForRegOn.split('/')[1] ) ] );
                            yearArrayForRegOn.push( parseInt( tempDateForRegOn.split('/')[2] ) );
                        }
                        if ( charge?.chargeTypeDescription ) {
                            let countM = {};

                            tempCharge["classification"] = this.titlecasePipe.transform( charge.chargeTypeDescription );
                            mortgage_array.push( tempCharge["classification"] );

                            for ( let countmortage of mortgage_array ) {
                                countM[ countmortage ] = 1 + ( countM[ countmortage ] || 0 );
                            }

                            mortgageCount = Object.keys( countM ).map( ( key ) => {
                                return " " + key + ' (' + countM[ key ] + ')';
                            }).join(",");
                        }
                        if ( charge?.chargeTagsName ) {
                            tagDetail.push(...charge.chargeTagsName)
                            obj['chargeTagsName'] = [ ...new Set( tagDetail ) ].map(tag => this.titlecasePipe.transform(tag));;

                        }
                    }


                } else {

                    chargesData.forEach( elementCharges => {
    
                        /* Outstanding count */
                        if (["t", "u", "v", "w", "x", "y", "z", null, ""].includes(elementCharges['memorandumNature'])) {
                            temchargeData.push(elementCharges)
                            outstandingCount++;
                        }
                        /* Fully Satisfied count */
    
                        if (["b", "f", "p", "r"].includes(elementCharges['memorandumNature'])) {
                            fullySatisfiedCount++;
                        }
    
                        /* For Month name to count number (Only Outstanding)  */
                        if (["t", "u", "v", "w", "x", "y", "z", null, ""].includes(elementCharges['memorandumNature'])) {
    
                            if (elementCharges['createdDate']) {
                                let tempDate = elementCharges['createdDate'];
                                monthArray.push(Month[parseInt(tempDate.split('/')[1])]);
                                yearArray.push( tempDate.split('/')[2] );
    
                            }
                            if (elementCharges['regDate']) {
                                let tempDateForRegOn = elementCharges['regDate'];
                                monthArrayForRegOn.push(Month[parseInt(tempDateForRegOn.split('/')[1])]);
                                yearArrayForRegOn.push(parseInt(tempDateForRegOn.split('/')[2]));
                            }
                        }

                        if (elementCharges["mortgageDetails"]) {
                            elementCharges["mortgageDetails"].forEach(element => {
    
                                if (element.recordType == "mortgage type") {
                                    tempCharge["classification"] = this.titlecasePipe.transform(element.description);
    
                                    mortgage_array.push(tempCharge["classification"]);
                                }
    
                                if (element.recordType == "mortgage detail") {
    
                                    if (element['tagName']) {
                                        tempCharge["tagNameField"] = element['tagName'];
                                    }
    
                                    tagname_array.push(tempCharge["tagNameField"]);
    
                                }
    
                                // person entitled ( outstanding )
                                if (["t", "u", "v", "w", "x", "y", "z", null, ""].includes(elementCharges['memorandumNature'])) {
                                    if (element.recordType == "persons entitled") {
    
    
                                        /* newString = element.description.replace(replaceString, (_match) => {
                                            return "";
                                        }); */
    
                                        tempCharge["person_entile_outs"] = this.titlecasePipe.transform(element.description);
                                        person_entiledArr.push(tempCharge["person_entile_outs"]);
    
                                    }
                                }
                                //person entitled ( fully satisfied )
                                if (["b", "f", "p", "r"].includes(elementCharges['memorandumNature'])) {
                                    if (element.recordType == "persons entitled") {
                                        /* newStringForFS = element.description.replace(replaceString, (_match) => {
                                            return "";
                                        }); */
                                        tempCharge["person_entile_fully"] = this.titlecasePipe.transform(element.description);
                                        person_entiledArrForFs.push(tempCharge["person_entile_fully"])
                                    }
    
                                }
    
                                //person entitled ( partial satisfied )
                                if (["s"].includes(elementCharges['memorandumNature'])) {
                                    if (element.recordType == "persons entitled") {
                                        /* newStringForPS = element.description.replace(replaceString, (_match) => {
                                            return "";
                                        }); */
                                        tempCharge["person_entile_partial"] = this.titlecasePipe.transform(element.description);
                                        person_entiledArrForPS.push(tempCharge["person_entile_partial"]);
                                    }
                                }
                                let countP = {}, countM = {}, countPFS = {}, countPPS = {};
    
                                /* For Outstanding */
                                for (let countPerson of person_entiledArr) {
                                    countP[countPerson] = 1 + (countP[countPerson] || 0)
                                }
                                person_counts = Object.keys(countP).map(function (key) {
                                    return " " + key + '(' + countP[key] + ')';
    
                                }).join(",");
                                /*  */
    
                                /* For Fully Satisfied */
                                for (let countPersonFuly of person_entiledArrForFs) {
                                    countPFS[countPersonFuly] = 1 + (countPFS[countPersonFuly] || 0)
                                }
                                person_countsfully = Object.keys(countPFS).map(function (key) {
                                    return " " + key + '(' + countPFS[key] + ')';
                                }).join(",");
                                /*  */
    
                                /* For Partial Satisfied */
                                for (let countPersonPartial of person_entiledArrForPS) {
                                    countPPS[countPersonPartial] = 1 + (countPPS[countPersonPartial] || 0)
                                }
                                person_countspartial = Object.keys(countPPS).map(function (key) {
                                    return " " + key + '(' + countPPS[key] + ')';
                                }).join(",");
                                /*  */
    
    
                                for (let countmortage of mortgage_array) {
                                    countM[countmortage] = 1 + (countM[countmortage] || 0)
                                }
                                mortgageCount = Object.keys(countM).map(function (key) {
                                    return " " + key + '(' + countM[key] + ')';
    
                                }).join(",");
                            });
                        }
    
                    });
                    
                }

			}

			if (element["pscName"]) {
				element["pscName"].forEach(elemenPsc => {
					if (elemenPsc) {
						pscArray.push(this.titlecasePipe.transform(' ' + elemenPsc));
					}
				});
			}

			if (element["directorsData"]) {
				for (let director of element["directorsData"]) {
					if (director.directorJobRole && director.directorJobRole !== " ") {
						element['occupation'] = director.directorJobRole;
					} else {
						element['occupation'] = "-"
					}
				}
			}

			obj["pscNameFd"] = pscArray;
			obj["outstandingCount"] = outstandingCount;
			obj["fullySatisfiedCount"] = fullySatisfiedCount;
			obj['chargesData'] = temchargeData;

			let new_tag_array = [];

			for (let tagData of tagname_array) {
				if (tagData) {
					for (let tagNameData of tagData) {
						new_tag_array.push(tagNameData);
					}
				}
			}

			let uniqueArray = new_tag_array.filter(function (item, pos) {
				return new_tag_array.indexOf(item) == pos;
			});

			uniqueArray = uniqueArray.map(tag => this.titlecasePipe.transform(tag));
			obj['tagNameField'] = uniqueArray;

			if (mortgageCount) {
				obj['classification'] = mortgageCount.split(",");
			}
            
            if (element["chargesData"] != undefined && element["chargesData"] != null) {
                
                let newPersonEntitledGroupCalc = [];
                element["chargesData"].filter( val => {
                    if ( val['mortgageDetails']?.length ) {
                        newPersonEntitledGroupCalc.push( ...val['mortgageDetails'] )
                    }
                })
                newPersonEntitledGroupCalc = newPersonEntitledGroupCalc.filter( val => val?.groupName );
                let tempObj = newPersonEntitledGroupCalc.reduce((accumulator, currentValue) => {
                    if ( currentValue.hasOwnProperty( 'groupName' ) ) {
                        accumulator[currentValue['groupName']] = ( ++accumulator[currentValue['groupName']] || 1 )
                            return accumulator
                    }
                }, {})

                let tempArray = []

                Object.keys( tempObj ).map( val => {
                    if ( val ) {
                        this.formattingForPersonEntitledGroup = this.titlecasePipe.transform(val) + '(' + tempObj[val] + ')';
                        tempArray.push( this.formattingForPersonEntitledGroup )
                    }
                } )

                if ( obj["outstandingCount"] == 0 ){
                    obj['personEntitledGroup'] = '';
                } else {

                    obj['personEntitledGroup'] = tempArray.join( ', ' );
                }

            }


            // if (element["mortgagesObj"] != undefined && element["mortgagesObj"] != null) {

            //     let test = element["mortgagesObj"].reduce((accumulator, currentValue) => {
            //         accumulator[currentValue['personEntitledGroup']] = ( ++accumulator[currentValue['personEntitledGroup']] || 1 )
            //             return accumulator
            //     }, {})

            //     let tempArray = []

            //     Object.keys( test ).map( val => {
            //         if ( val ) {
            //             this.formattingForPersonEntitledGroup = this.titlecasePipe.transform(val) + '(' + test[val] + ')';
            //             tempArray.push( this.formattingForPersonEntitledGroup )
            //         }
            //     } )

            //     if ( obj["outstandingCount"] == 0 ){
            //         obj['personEntitledGroup'] = '';
            //     } else {

            //         obj['personEntitledGroup'] = tempArray.join( ', ' );
            //     }

            // }

			if (person_counts) {
				obj['person_entile_outs'] = person_counts.replace(/[\s;]+/g, " ").split(",");
			}

			if (person_countsfully) {
				obj['person_entile_fully'] = person_countsfully.replace(/[\s;]+/g, " ").split(",");
			}
			if (person_countspartial) {
				obj['person_entile_partial'] = person_countspartial.replace(/[\s;]+/g, " ").split(",");
			}

			person_array.push(obj['person_entile_outs']);

			if (person_array[0]) {
				trimedArr = person_array[0].map(str => str.trim());
			}

			obj['person_entile_outs'] = trimedArr;


			person_array_fully.push(obj['person_entile_fully']);
			obj['person_entile_fully'] = person_array_fully[0];

			person_array_partial.push(obj['person_entile_partial']);
			obj['person_entile_partial'] = person_array_partial[0];

			/* START : For Month Count */
			var counts = {};
			for (let indx in monthArray) {
                let month = monthArray[indx] + "-" + yearArray[ indx ];
                counts[month] = 1 + (counts[month] || 0);
			}
			/* END:  For Month Count */

			/* START : For Registered On Month Count */
            var regCounts = {};
            for ( let indx in monthArrayForRegOn ) {
                let month = monthArrayForRegOn[indx] + "-" + yearArrayForRegOn[ indx ];
                regCounts[ month ] = 1 + ( regCounts[ month ] || 0 );
            }
            /* END : For Registered On Month Count */

			/* START : Convertion of key pair object to String */

			let dateWithCounts = Object.keys(counts).map(function (key, index) {
				return " " + key + " " + '(' + counts[key] + ')';

			}).join(",");

			/* END: Convertion of key pair object to String */

			/* START : Convertion of key pair object to String */
            let regDateWithCounts = Object.keys( regCounts ).map(function (key) {
                return " " + key + " " +'('+ regCounts[ key ] + ')'
            }).join(",");
            /* END : Convertion of key pair object to String */

			obj["dateMonthCount"] = dateWithCounts.split(",");

            obj["dateMonthCountForRegOn"] = regDateWithCounts.split(",");

			this.chargesFilterData.push(obj);
		});

		return this.chargesFilterData;

	}

    formatDate(date) {
        return this.commonService.formatDate( date );
    }
    
    isdirectorScreen(event) {
        
        if ( event ) {
            
            this.viewDirectorDetailsData = event.searchResult;
            this.appliedFilters = event.appliedFilters;
            
        }
        
    }

	showCompanySideDetailsPanel( compNumber, compName, rowData, tabRoute? ) {

		this.showCompanySideDetails = true;

		if ( rowData == undefined ) {
			this.companySideDetailsParams.companyNumber = compNumber;
			this.companySideDetailsParams.companyName = compName;
			this.companySideDetailsParams.tabNameToBeActive = '';
			this.overviewName = "companyOverview";
            
            
		} else if ( rowData != undefined ) {
            this.corporateSideOverviewData = rowData;
			this.overviewName = "corporateOverview";
		}
        
        if ( tabRoute ) {
            this.companySideDetailsParams.tabNameToBeActive = tabRoute;
            /*
            setTimeout(() => {
                // this.dataCommunicatorService.childComponentUpdateData( tabRoute );
                // for( let childCompKey in this.companyDetailsChildComponents ) {
                //     if( childCompKey == tabRoute ) {
                //         this.dataCommunicatorService.childComponentUpdateData( this.companyDetailsChildComponents[ childCompKey ] )
                //     }
                // }
            }, 2000);
            */
            
        }

	}

    resetFromInternational( event ){
        this.filterSearchArray = event.filterSearchingObj
        // this.forCompanyListPage( event )
    }

	getShowCompanySideDetailsOutputBoolValue($event) {
		this.showCompanySideDetails = $event;
	}

}