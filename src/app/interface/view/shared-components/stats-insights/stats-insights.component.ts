import { CurrencyPipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import ChartDataLabels from "chartjs-plugin-datalabels";

import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedScreenshotService } from 'src/app/interface/service/shared-screenshot.service';
import { SharedLoaderService } from '../shared-loader/shared-loader.service';
import { ListPageName } from '../../features-modules/search-company/search-company.constant';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { SimilarCompanyService } from './sub-filter/similar-company.services';
import { statsFinancialChips, statsNumberChipsType, headerOfEmployees, otherMiscArrayData, industryListData } from './stats-financial-index';
import { CommanStatsClickService } from './comman-stats-click.service';
import { Table } from 'primeng/table';

@Component({
	selector: 'dg-stats-insights',
	templateUrl: './stats-insights.component.html',
	styleUrls: ['./stats-insights.component.scss']
})
export class StatsInsightsComponent implements OnInit {

	@Input() selectedPropValues: any;
	@ViewChild( 'LazyLeafletMapContainer', { read: ViewContainerRef } ) LazyLeafletMapContainer: ViewContainerRef;
	@ViewChild('sicIndustryTable', { static: false }) public sicIndustryTable: Table;

	ChartDataLabelsPlugins = [ ChartDataLabels ];

	statsChartData: { labels: string[]; datasets: { data: any[]; backgroundColor: string[]; datalabels: any }[]; };
	
	pieChartOptions: any;
	statsChartDataValue: any;
	defaultChartDatalabelSettings: any;
	checkEstimatedTurnover: boolean = true;
	displayModal: boolean = false;
	thisPage: string;

	orgKeyFinancialObject: FilterDataTypes;
	isSicCodeIncluded: boolean = false;
	isIndustryTagIncluded: boolean = false;
	
	financialTurnoversArrayData: Array<{ field: string, label: string, value?: Object, count?: number, count_percentage?: number }> = [];
	employeesRangeArrayData: Array<{ field: string, label: string, count?: number, count_percentage?: number, rangeFrom?: string, rangeTo?: string }> = [];
	encorporationDate:  Array<{ field: string, label: string, count?: number, count_percentage?: number, rangeFrom?: string, rangeTo?: string }> = [];
	estimatedTurnoversArrayData: Array<{ field: string, label: string, value?: Object, count?: number, count_percentage?: number }> = [];
	turnoverGrowth3Years: {field: string, label: string, value?: Object, count?: number, count_percentage?: number }[] = [];
	tradeDebtorsGrowth3Years: {field: string, label: string, value?: Object, count?: number, count_percentage?: number }[] = [];
	netWorthGrowth3Years: {field: string, label: string, value?: Object, count?: number, count_percentage?: number }[] = [];

	riskProfile: {field: string, label: string, value?: Object, count?: number, count_percentage?: number }[] = [
		{ field: 'not specified', label: 'Not Specified', count: 0, count_percentage: 0 },
		{ field: 'moderate risk', label: 'Moderate Risk', count: 0, count_percentage: 0 },
		{ field: 'very low risk', label: 'Very Low Risk', count: 0, count_percentage: 0 },
		{ field: 'low risk', label: 'Low Risk', count: 0, count_percentage: 0 },
		{ field: 'high risk', label: 'High Risk', count: 0, count_percentage: 0 },
		{ field: 'not scored', label: 'Not Scored / Very High Risk', count: 0, count_percentage: 0 },
	];

	industryListColumn: Array<any> = [
		{ field: 'label',  header: 'SIC Industry', minWidth: '300px', maxWidth: 'none', textAlign: 'left', isSortable: true },
		{ field: 'count', header: 'Count', minWidth: '120px', maxWidth: '120px', textAlign: 'right', isSortable: false },
		{ field: 'count_percentage', header: '%', minWidth: '120px', maxWidth: '120px', textAlign: 'right', isSortable: false }
	];

	standardIndustryTags: { field: string, label: string, count: number, count_percentage: number }[] = [];
	// specialIndustryTags: { field: string, label: string, count: number, count_percentage: number }[] = [];
	
	viewCompanyHandler = [];
	regionListData = [];
	outputPayloadFromSubFilters = [];

	barData: any;
	statsDirectorsGender : any;
	barOptions: any;
	title: string = '';
	description: string = '';
	userId: string | unknown;
	listId: string;
	listName: string;
	inputPageName: string = '';
	outputPageName: string = '';
	doughnutChartOptions : any = {};
	doughnutChartDatasets : any = {};
	queryParamChipData: FilterDataTypes[] = [];
	statsCriteriaValues: Array<any> = [];
	lineLabels: Array<any> = undefined;
	landCoporateDetailsPurchased: Array<any> = undefined;
	landCoporateDetailsSold: Array<any> = undefined;
	selectedGlobalCountry: string = 'uk';
	selectedGlobalCurrency: string = 'GBP';
	estimatedTurover: boolean = true;
	msgs: any; 

	// spinnerBoolean: boolean = false;
	industryListData: Array<object> = JSON.parse( JSON.stringify( industryListData ) );
	getIdForCapture: any;

	financialKeys: Array<object> = [];
	selectedFinancialKeys: string = '';
	keyForFinancial: object = {};
	financialTableStyle: statsNumberChipsType = {};

	numberOfEmply = headerOfEmployees;
	otherMiscArrayData = otherMiscArrayData;
	
	companiesOwnedObj = {
		minority_companies: { label: 'Ethnic Minority Community', payloadKey: 'All Ethnic Minorities' },
		femaleOwnedCompanies: { label: 'Female Owned Community', payloadKey: 'Female Owned' }
	}

    msmeStatusColor = {
        'Micro': '#59ba9b',
        'Small': '#ffcc00',
        'Medium': '#ee9512',
        'Large Enterprise': '#e1b12c',
		'Unknown': '#aabbcc',
    }

	spinnerBoolean: boolean = false;

	constructor(
		private titleCasePipe: TitleCasePipe,
		public toNumberSuffix: NumberSuffixPipe,
		private router: Router,
		public activeRoute: ActivatedRoute,
		public commonService: CommonServiceService,
		private toCurrencyPipe: CurrencyPipe,
		private decimalPipe: DecimalPipe,
		private componentFactoryResolver: ComponentFactoryResolver,
		private seoService: SeoService,
        public userAuthService: UserAuthService,
		private sharedScreenshotService: SharedScreenshotService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService,
		public similarCompanyService: SimilarCompanyService,
		public commanStatsClickService: CommanStatsClickService
	) { }

	ngOnInit(): void {


		this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';
		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';
		this.queryParamChipData = this.activeRoute?.snapshot?.queryParams?.['chipData'] ? JSON.parse( this.activeRoute?.snapshot?.queryParams?.['chipData'] ) : [];
		this.listId = this.activeRoute?.snapshot?.queryParams['cListId'] != undefined ? this.activeRoute?.snapshot?.queryParams['cListId'] : '';
		this.inputPageName = this.activeRoute?.snapshot?.queryParams['listPageName'] ? this.activeRoute?.snapshot?.queryParams['listPageName'] : '';
		this.listName = this.activeRoute?.snapshot?.queryParams['listName'] ? this.activeRoute?.snapshot?.queryParams['listName'] : '';

		// if ( [ 'businessMonitor', 'businessMonitorPlus', 'businessWatch', 'diversityInclusion' ].includes( this.activeRoute.snapshot.queryParams['pageName'] ) ) {
		// 	this.inputPageName = this.activeRoute.snapshot.queryParams['pageName']
		// }

		this.financialTableStyle = statsFinancialChips;
		this.outputPageName = this.commanStatsClickService.getOutputPage( this.inputPageName.toLowerCase() );
		
		if ( this.queryParamChipData.length ) {
			this.statsCriteriaValues = this.formatChipValuesDisplay( this.queryParamChipData );
		} else {
			this.queryParamChipData = []
		}

		this.isSicCodeIncluded = this.statsCriteriaValues.some(filter => filter.chip_group === 'SIC Codes');
		this.isIndustryTagIncluded = this.statsCriteriaValues.some(filter => [ 'Industry Tags', 'Industry' ].includes( filter.chip_group ));

		if( this.inputPageName == 'companyListPage' ) {		
			this.userId = '';
		} 
		else {
			this.userId = this.userAuthService?.getUserInfo('dbID');
		}

		this.initBreadcrumbAndSeoMetaTags();
		this.getStatsData();
		this.thisPage = 'statsPage';
				
	}

	getMessage(event: any){
		this.msgs = event;
	}

	mappingTwoArrays( baseArray: Array<any>, sourceArray: Array<any>, keyToMatch: string, chpGrp?: string ) {

		const NewArray = [];

		if ( baseArray && baseArray.length && sourceArray && sourceArray.length ) {

			if ( chpGrp !== 'riskProfile' ) {
				for ( let indx = 0; indx < baseArray.length; indx++ ) {
					if ( (baseArray[ indx ]?.[ keyToMatch ] === sourceArray[ indx ]?.[ keyToMatch ] ) ) {
						// this.toCurrencyPipe(+baseArray[ indx ][ 'label' ],'en-GB',"$")
						sourceArray[ indx ][ 'displayLabel' ] = ( baseArray[ indx ][ 'label' ] ) + ' ('+ ( this.toNumberSuffix.transform(sourceArray[ indx ][ 'count' ],'2', '' ))  +')'
						if ( [ 'numberOfEmployees', 'companyByAge' ].includes( chpGrp )  ) {
							sourceArray[ indx ][ 'value' ] = { rangeFrom: baseArray[ indx ][ 'rangeFrom' ], rangeTo: baseArray[ indx ][ 'rangeTo' ] };
						}
						NewArray.push( { ...baseArray[ indx ], ...sourceArray[ indx ] } );
					}
				}
			} else {

				baseArray.map( val => {
					sourceArray.filter( srcObj => {
						if ( ( srcObj.field ).toLowerCase() == ( val.field.split(' ').join('') ) ) {
							val['count'] = srcObj['count'];
							val['count_percentage'] = srcObj['count_percentage'];
							NewArray.push( { ...val } );
						}
					} )
				} )
			}

		}

		return NewArray;

	}

	getStatsData( dissolvedIndex?: boolean, startPlan?: boolean, pageSize?: number, startAfter?: number, sortOn?: any[], filterSearchArray?: any[] ) {
		
		// this.spinnerBoolean = true;
		this.sharedLoaderService.showLoader();

		if ( [ 'investeeFinderPage', 'hnwiPage' ].includes( this.inputPageName ) ) {
			this.queryParamChipData = JSON.parse(localStorage.getItem('statsScreen'));
			this.statsCriteriaValues = this.formatChipValuesDisplay( this.queryParamChipData );
		}

		let obj = {
			
			'filterData': [ ...this.queryParamChipData ],
			'pageSize': pageSize ? pageSize : 25,
			'startAfter': startAfter ? startAfter : 0,
			'sortOn': sortOn ? sortOn : [],
			'filterSearchArray': filterSearchArray ? filterSearchArray : [],
			dissolvedIndex: dissolvedIndex ? dissolvedIndex : false,
			'startPlan': startPlan ? startPlan : false,
			'listId': this.listId,
			'pageName': this.outputPageName,
			'userId': this.userId != undefined ? this.userId : ""
		}

		if(!!this.activeRoute.snapshot?.queryParams['relatedStatsBoolean']){
	
			obj['relatedStatsBoolean']  = !!this.activeRoute.snapshot?.queryParams['relatedStatsBoolean']
		}

		this.globalServerCommunication.globalServerRequestCall('post', 'DG_CHART_API', 'getStatsData', obj ).subscribe(res => {
			if ( res.body.status == 200 ) {

				this.statsChartDataValue = res.body.result;;

				let financialArray = res.body.dropdownList;
				
				let landCorporatePurchasedChart = this.statsChartDataValue?.landCoporateDetailsPurchased;
				let landCorporateSoldChart = this.statsChartDataValue?.landCoporateDetailsSold;

				/*..>>>>>>.Mentioned Keys --> Handle by backened code ..<<<<<<<.*/
				this.financialTurnoversArrayData = this.statsChartDataValue?.financialTurnoversArray;
				this.estimatedTurnoversArrayData = this.statsChartDataValue?.financialTurnoversPlusEstimatedTurnoversArray;
				this.turnoverGrowth3Years = this.statsChartDataValue?.turnoverGrowth3YearsInfo;
				this.netWorthGrowth3Years = this.statsChartDataValue?.netWorthGrowth3YearsInfo;
				this.tradeDebtorsGrowth3Years = this.statsChartDataValue?.tradeDebtorsGrowth3YearsInfo;
				this.employeesRangeArrayData = this.statsChartDataValue?.noOfEmployeesArray;
				this.encorporationDate = this.statsChartDataValue?.companyIncorporationInfo;
				/*..>>>>>>END HERE..<<<<<<<.*/

				this.riskProfile = this.mappingTwoArrays( this.riskProfile, this.statsChartDataValue?.riskChartArray, 'field', 'riskProfile' );
				this.standardIndustryTags = this.statsChartDataValue?.standard_industry_tag?.map( tag  =>{
					tag['label'] = tag['field'];
					return tag;
				});

				this.regionListData = this.statsChartDataValue.region?.map( val => {
					val['label'] = val['month'];
					val['field'] = val['month'];
					return val;
				});

				if ( this.financialTurnoversArrayData.length && !this.estimatedTurnoversArrayData.length ) {
					this.checkEstimatedTurnover = false;
				}

				for ( let otherMiscObj of this.otherMiscArrayData ) {
					otherMiscObj.count = this.statsChartDataValue?.otherMisc[ otherMiscObj.field ];
					otherMiscObj.count_percentage = this.statsChartDataValue?.otherMisc[ `${ otherMiscObj.field }_percentage` ];
				}

				for ( let val in this.companiesOwnedObj ) {
					this.companiesOwnedObj[ val ] = { ...this.companiesOwnedObj[ val ], ...this.statsChartDataValue[ val ]  }
				}

				this.lineLabels = this.formatDataForGraph(landCorporatePurchasedChart, "month");

				this.landCoporateDetailsPurchased = this.formatDataForGraph(landCorporatePurchasedChart, "count");
				this.landCoporateDetailsSold = this.formatDataForGraph(landCorporateSoldChart, "count");
				
				if ( this.statsChartDataValue?.industry && this.statsChartDataValue?.industry.length ) {

					for (let i = 0; i < this.industryListData.length; i++) {

						for (let j = 0; j < this.statsChartDataValue?.industry.length; j++) {
							
							if ( this.industryListData[i]['value'] == this.statsChartDataValue?.industry[j]['industry'] ) {

								this.industryListData[i]['count'] = this.statsChartDataValue?.industry[j]['count'] || 0;
								this.industryListData[i]['count_percentage'] = this.statsChartDataValue?.industry[j]['count_percentage'] || 0;
								this.industryListData[i]['field'] = this.industryListData[i]['value'];
							}

						}

					}

				} else {
					this.industryListData = [];
				}
				
				if ( this.statsChartDataValue?.riskChart ) {
					this.initDoughnutChartContainer( this.statsChartDataValue?.riskChart, "riskChart" );
				}

				if ( this.statsChartDataValue?.region ) {
					this.initLeafletMapContainer( this.statsChartDataValue?.region );
				}

				if ( financialArray && financialArray.length ) {
					for ( let item of financialArray ) {
						this.financialKeys.push( { label: this.titleCasePipe.transform( item.replace(/([a-z])([A-Z])/g, '$1 $2') ), field: item } );
					}
				}
				this.selectedFinancialKeys = 'turnover';
				this.selectFinancialKeys();
				
			}

			this.viewCompanyHandler = [
				{ header: 'Region', items: this.regionListData, selectionMode: 'multi', selectAll: false, ngModelChck: [], chipGrp: 'Region', styleClass: 'col-3' },
				{ header: 'SIC Codes', items: this.industryListData, selectionMode: 'multi', selectAll: false, ngModelChck: [], chipGrp: 'SIC Codes', styleClass: 'col-3' },
				{ header: 'Industry Tags', items: this.statsChartDataValue.standard_industry_tag, selectionMode: 'multi', selectAll: false, ngModelChck: [], chipGrp: 'Industry', styleClass: 'col-3' },
				// { header: 'Special Tags', items: this.statsChartDataValue.special_industry_tag, selectionMode: 'multi', selectAll: false, ngModelChck: [], chipGrp: 'Industry', styleClass: 'col-3' },
				{ header: 'Companies By Age', items: this.encorporationDate, selectionMode: 'single', ngModelChck: {}, chipGrp: 'Company Age Filter', styleClass: 'col-3', rangeInput: { rangeFrom: undefined, rangeTo: undefined }, rangeType: [ 'rangeFrom', 'rangeTo' ] },
				{ header: 'Number Of Employees', items: this.employeesRangeArrayData, selectionMode: 'single', ngModelChck: {}, chipGrp: 'Number of Employees', styleClass: 'col-3', rangeInput: { rangeFrom: undefined, rangeTo: undefined }, rangeType: [ 'rangeFrom', 'rangeTo' ] },
				{ header: 'Credit Risk Bands', items: this.riskProfile, selectionMode: 'multi', selectAll: false, ngModelChck: [], chipGrp: 'Bands', styleClass: 'col-3' },
				{ header: 'Turnover (£)', items: this.financialTurnoversArrayData, selectionMode: 'single', ngModelChck: {}, chipGrp: 'Key Financials', styleClass: 'col-3', rangeInput: { greaterThan: undefined, lessThan: undefined }, rangeType: [ 'greaterThan', 'lessThan' ] },
				{ header: 'Turnover Growth 3 Years', items: this.turnoverGrowth3Years, selectionMode: 'single', ngModelChck: {}, chipGrp: '3 Years Growth', growthKey: 'turnover', styleClass: 'col-3', rangeInput: { greaterThan: undefined, lessThan: undefined }, rangeType: [ 'greaterThan', 'lessThan' ] },
				{ header: 'Net Worth Growth 3 Years', items: this.netWorthGrowth3Years, selectionMode: 'single', ngModelChck: {}, chipGrp: '3 Years Growth', growthKey: 'net_worth', styleClass: 'col-3', rangeInput: { greaterThan: undefined, lessThan: undefined }, rangeType: [ 'greaterThan', 'lessThan' ] },
				{ header: 'Trade Debtors Growth 3 Years', items: this.tradeDebtorsGrowth3Years, selectionMode: 'single', ngModelChck: {}, chipGrp: '3 Years Growth', growthKey: 'trade_debtors', styleClass: 'col-3', rangeInput: { greaterThan: undefined, lessThan: undefined }, rangeType: [ 'greaterThan', 'lessThan' ] }
			];

			// Sorting all of the the items on percentage for View Similar Companies.
			for ( let { items } of this.viewCompanyHandler ) {
				items = items?.sort( ( a, b ) => b?.count_percentage - a?.count_percentage );
			}
			// Sorting all of the the items on percentage....End.
			
			// this.spinnerBoolean = false;
			this.sharedLoaderService.hideLoader();

		});

	}

	stopSefaultSort() {
		return 0;
	}

	async initDoughnutChartContainer( chartData, chartFor ) {

		let chartLabels = [], chartDataset = [], chartPercentage = [], backgroudColor: any = [];

		this.doughnutChartOptions[ chartFor ] = {
			cutout: 50,
			layout: {
				padding: 30
			},
			plugins: {
				datalabels: {
					display: (context) => {
						let dataset = context.dataset;
						let value = dataset.data[context.dataIndex];
						return value;
					},
					backgroundColor: function(context) {
						return context.dataset.backgroundColor;
					},
					color: 'white',
					font: { weight: 'bold' },
					borderColor: 'white',
					borderRadius: 30,
					borderWidth: 3,
					padding: { top: 4, right: 6, bottom: 3, left: 6 },
					anchor: 'end',
					align: 'center',
					formatter: ( value ) => {
						value = this.toCurrencyPipe.transform( value, '', '', '1.0-2' );
						return value;
					}
				},
				legend: {
					display: false,
				},
				tooltip: {
					enabled: false
				},
			},
			onHover: (event, elements) => {
				event.native.target.style.cursor = chartFor ? "pointer" : "default";
			},
			onClick: ( event, elements, chart ) => {
				onChartElementClick( event.native, elements, chart, chartFor );
			}
		}

		for ( let dataKey in chartData ) {

			if ( this.statsChartDataValue[ chartFor ].hasOwnProperty( dataKey ) && dataKey.split('_').length < 2 ) {
				if ( ![ 'notSpecified', 'notSpecified_percentage' ].includes( dataKey )) {
					chartLabels.push( this.commonService.camelCaseToSentence( dataKey.trim() ) );
				}
				if( chartFor == 'directorGenderCounts' ) {
					chartDataset.push( this.statsChartDataValue[ chartFor ][ dataKey ].persons );
				} else {
					if ( dataKey == 'notSpecified' ) continue;
					chartDataset.push( this.statsChartDataValue[ chartFor ][ dataKey ] );
				}
				
				if ( chartFor == "riskChart" ){
					if ( dataKey == 'notSpecified' ) continue;
					backgroudColor.push(this.formatBgColorForPieChart( dataKey ));
					chartPercentage.push( this.statsChartDataValue[ chartFor ][ dataKey + '_percentage' ] );
				} else {
					backgroudColor = [ "#2ab5cb", "#51bbe6", "#0b6876" ];
				}

			}


		}

		const onChartElementClick = ( event, elements, chart, chartFor ) => {
			
			let chartdetails = chart.config.data;
	
			if ( chartdetails && elements && elements.length) {

				let	targetLabel = chartdetails.labels[ elements[0].index];

				let statsButtonVisible = true;
		
				if ( [ targetLabel ].includes( 'Not Specified' ) ) {
					statsButtonVisible = false;
				}
				
				// if condition implemented for client watch screen, go to stats and click on risk doubnut count is not matched without this object
				if ( !this.queryParamChipData.length && !this.listId ) {
					this.queryParamChipData.unshift({
						chip_group: 'Status',
						chip_values: ['live']
					});
				}

				let navigateUrlParamObject = this.queryParamChipData;
	
				let chipGroup;

				if ( chartFor == 'riskChart' ) {
					chipGroup = 'Bands';
					navigateUrlParamObject = navigateUrlParamObject.filter( val => val.chip_group !== 'Bands' );
				} else {
					chipGroup = 'Director Gender';
					navigateUrlParamObject = navigateUrlParamObject.filter( val => val.chip_group !== 'Director Gender' );
				}
	
				navigateUrlParamObject.push(
					{ chip_group: chipGroup, chip_values: [ targetLabel != 'Not Scored / Very High Risk' ? targetLabel.toLowerCase() : 'not scored' ] }
				);
	
				let urlStr: string;

				urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(navigateUrlParamObject), cListId: this.listId, listPageName: this.inputPageName, hideStatsButton: statsButtonVisible, listName: this.listName } }));

				window.open( urlStr, '_blank' );
			}
			
		}

		chartLabels = JSON.parse(JSON.stringify(chartLabels));
		let indx = chartLabels.indexOf("Not Scored");
		indx != -1 ? chartLabels[indx] = "Not Scored / Very High Risk" : chartLabels;

		this.doughnutChartDatasets[ chartFor ] = {
			labels: chartLabels,
			datasets: [
				{
					data: chartDataset,
					backgroundColor: backgroudColor
				}
			]
		};
		
	}
	
	async initLeafletMapContainer( currentYearData ) {
		
		const { LazyLeafletMapComponent } = await import('../lazy-leaflet-map/lazy-leaflet-map.component');

		this.LazyLeafletMapContainer.clear();
		
		const { instance } = this.LazyLeafletMapContainer.createComponent( LazyLeafletMapComponent );
        instance.mapConfig.primaryMapId = `statsInsightsMapContainer`;
		instance.mapData = { currentYearData: currentYearData };
		instance.requiredData = { thisPage: 'statsInsights' };
		
	}

	formatDataForGraph( dataArray, src ) {

		let tempArray = [];

		if ( dataArray ) {

			dataArray = dataArray.sort((a, b) =>a.month < b.month ? -1 : a.month > b.month ? 1 : 0);
	
			if (src == "month") {
	
				for (let dataVal of dataArray) {
					tempArray.push(this.commonService.monthName(dataVal.month));
				}
	
			} else if ( src == "count" ) {
	
				for ( let dataVal of dataArray ) {
					tempArray.push( dataVal.count );
				}
	
			}

		}

		return tempArray;

	}
	initBreadcrumbAndSeoMetaTags() {

		// this.breadCrumbService.setItems([
		// 	{ label: 'Stats Insights' }
		// ]);
		this.title = "Stats Insights - DataGardener";
		this.description = "In Stats Insights you can check details and records of stats insights";
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
		// this.seoService.setkeywords( this.keywords );
		// this.seoService.setRobots (this.robots );

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

	formatotherMiscDataLabel( field ) {

		let finalResult = '';

		switch ( field ) {

			case 'ccj':
				finalResult = 'CCJ';
				break;

			case 'patentData':
				finalResult = 'Patent Data';
				break;

			case 'innovateData':
				finalResult = 'Innovate Data';
				break;

			case 'writeOff':
				finalResult = 'Write-offs';
				break;

			case 'landCoporateDetails':
				finalResult = 'Land Corporate Details';
				break;

			case 'shareholding':
				finalResult = 'Shareholdings';
				break;

			case 'ecsData':
				finalResult = 'Environment Agency Regd.';
				break;
			case 'companWithCharges':
				finalResult = 'Company With Charges';
				break;
		
			default:
				break;
		}

		return finalResult;

	}

	formatChipValuesDisplay( statsCriteriaChips: Array<any> ) {

		return statsCriteriaChips;
		
	}

	convertDate(data) {
		let tempDate: Array<any> = [];
		for (let i = 0; i < data.length; i++) {
			var date = new Date(data[i]),
				mnth = ("0" + (date.getMonth() + 1)).slice(-2),
				day = ("0" + date.getDate()).slice(-2);

			tempDate.push([day, mnth, date.getFullYear()].join("/"));
		}
		return (tempDate);
	}

	gotToSearchPage( chipDataValueTo: number | 'not specified', chipDataValueFrom: number | 'not specified', from: string, growthKey?: string, label?: string ) {

		this.commanStatsClickService.gotToSearchPage( chipDataValueTo, chipDataValueFrom, growthKey, from, label, this.queryParamChipData, this.listId, this.inputPageName, this.listName, this.checkEstimatedTurnover  );

	}

	goToSearchForIndustry( industryName, industryValue, industryCode? ) {

		this.commanStatsClickService.goToSearchForIndustry( industryName, industryValue, industryCode, this.queryParamChipData, this.listId, this.inputPageName, this.listName, this.selectedGlobalCountry );
		
	}

	goToSearchForIndustryTag( industryName, industryValue, from ) {

		this.commanStatsClickService.goToSearchForIndustryTag( industryName, industryValue, this.queryParamChipData, this.listId, this.inputPageName, this.listName );

	}

	goToSearchForMisc( miscName, miscValue?, inputCountValue? ) {
		this.commanStatsClickService.goToSearchForMisc( miscName, miscValue, inputCountValue, this.queryParamChipData, this.listId, this.inputPageName, this.listName );

	}

	goToCompanySearchBymsme( selectedChipValue ) {

		this.commanStatsClickService.goToCompanySearchBymsme( selectedChipValue, this.queryParamChipData, this.listId, this.inputPageName, this.listName );
	}

	formatBgColorForPieChart( inputData ) {

		let finalResult = '';

		switch ( inputData ) {
			case 'veryLowRisk':
				finalResult = '#6DC470';
				break;

			case 'lowRisk':
				finalResult = '#59BA9B';
				break;

			case 'moderateRisk':
				finalResult = '#FFC201';
				break;

			case 'highRisk':
				finalResult = '#E4790F';
				break;
				
			case 'notScored':
				finalResult = '#D92727';
				break;

			case 'not specified':
				finalResult = '#b4b4b4';
				break;
		
			default:
				break;
		}

		return finalResult;

	}

	forEstimatedTurnover(event) {
		this.checkEstimatedTurnover = event.checked;
	}

	takeSnapshot( insightsChartViewContainerId ){
		this.sharedScreenshotService.snapshotForStatsInsight(insightsChartViewContainerId,'DataGardener__Stats_Insights.jpeg');
	}

	getOutputFromSubFilter( event ) {
		this.outputPayloadFromSubFilters = event;
	}

	navigateToSimilarCompanySearch( ) {

		this.similarCompanyService.navigateToSimilarCompanySearch( this.outputPayloadFromSubFilters );

	}

	navigateToFilteredCompanySearch() {

		this.similarCompanyService.navigateToFilteredCompanySearch( this.outputPayloadFromSubFilters, this.queryParamChipData, this.inputPageName, this.listId, this.listName )

	}

	selectFinancialKeys( dissolvedIndex?: boolean, startPlan?: boolean, pageSize?: number, startAfter?: number, sortOn?: any[], filterSearchArray?: any[] ) {

		this.spinnerBoolean = true;
		let financialKey = this.selectedFinancialKeys;

		let obj = {
			'filterData': [ ...this.queryParamChipData ],
			'pageSize': pageSize ? pageSize : 25,
			'startAfter': startAfter ? startAfter : 0,
			'sortOn': sortOn ? sortOn : [],
			'filterSearchArray': filterSearchArray ? filterSearchArray : [],
			dissolvedIndex: dissolvedIndex ? dissolvedIndex : false,
			'startPlan': startPlan ? startPlan : false,
			'listId': this.listId,
			'pageName': this.outputPageName,
			'userId': this.userId != undefined ? this.userId : "",
			'financialKeys': [financialKey]
		}
		
		if(!!this.activeRoute.snapshot?.queryParams['relatedStatsBoolean']){
			obj['relatedStatsBoolean']  = !!this.activeRoute.snapshot?.queryParams['relatedStatsBoolean']
		}

		this.globalServerCommunication.globalServerRequestCall('post', 'DG_CHART_API', 'statsPageFinancialCounts', obj).subscribe((res) =>{
			if ( res.body.status == 200 ) {
				this.keyForFinancial = res.body.result;
				this.spinnerBoolean = false;
			}
		})
		
	}

	customSort( event, ethnicTable, field) {

		let value1, value2, result;
		let tableDomElement = this.sicIndustryTable.el.nativeElement.children[0],
			sortIcons = tableDomElement.querySelectorAll('.p-datatable-wrapper .p-sortable-column-icon'),
			sortOrder: string = 'asc',
			tempObj: any,
			tableVal: any;

		if (event.target.classList.value == 'p-sortable-column-icon pi pi-fw pi-sort-alt' || event.target.classList.value == 'p-sortable-column-icon pi pi-fw pi-sort-amount-down') {

			for (let icon of sortIcons) {
				icon.classList.value = 'p-sortable-column-icon pi pi-fw pi-sort-alt';
			}

			event.target.classList.value = 'p-sortable-column-icon pi pi-fw pi-sort-amount-up-alt';
			sortOrder = 'asc';
			tempObj = 1;

		} else if (event.target.classList.value == 'p-sortable-column-icon pi pi-fw pi-sort-amount-up-alt') {

			for (let icon of sortIcons) {
				icon.classList.value = 'p-sortable-column-icon pi pi-fw pi-sort-alt';
			}

			event.target.classList.value = 'p-sortable-column-icon pi pi-fw pi-sort-amount-down';
			sortOrder = 'desc';
			tempObj = -1;

		}

		if (ethnicTable.filteredValue && ethnicTable.filteredValue.length) {
			tableVal = (ethnicTable.filteredValue);
		} else {
			tableVal = (ethnicTable.value);
		}

		tableVal.sort( ( data1, data2 ) => {
			value1 = data1[field]
			value2 = data2[field]

			result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
			return (tempObj * result);
		} )

		return ethnicTable
	}

	resetFilters( table ) {

		let tableDomElement = table.el.nativeElement.children[0],
			sortIcons = tableDomElement.querySelectorAll('.p-datatable-wrapper .p-sortable-column-icon');

		for (let icon of sortIcons) {
			icon.classList.value = 'p-sortable-column-icon pi pi-fw pi-sort-alt';
		}
		
		this.industryListData.sort( (a, b) => b['count'] - a['count'] );
		table._value = this.industryListData;

		table.filter(null);
		table.reset();

	}

}