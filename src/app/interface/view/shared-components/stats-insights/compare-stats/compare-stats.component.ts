import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../shared-loader/shared-loader.service';
import { CurrencyPipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SeoService } from 'src/app/interface/service/seo.service';
import { CanonicalURLService } from 'src/app/interface/service/canonical-url.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import ChartDataLabels from "chartjs-plugin-datalabels";
import { colorMSME, headerOfEmployees, statsFinancialChips, statsNumberChipsType, payloadForCompareType, otherMiscArrayData, industryListData } from '../stats-financial-index';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { SharedScreenshotService } from 'src/app/interface/service/shared-screenshot.service';

import { CommanStatsClickService } from '../comman-stats-click.service';

type compareItemType = {
	firstItem: Array<{ field: string, label: string, count?: number, count_percentage?: number, rangeFrom?: string, rangeTo?: string }>
	secondItem: Array<{ field: string, label: string, count?: number, count_percentage?: number, rangeFrom?: string, rangeTo?: string }>
}

@Component({
    selector: 'dg-compare-stats',
    templateUrl: './compare-stats.component.html',
    styleUrls: ['./compare-stats.component.scss'],
})
export class CompareStatsComponent implements OnInit, AfterViewInit {

	numberOfEmply = headerOfEmployees;
	ChartDataLabelsPlugins = [ ChartDataLabels ];
	colorForWorkflowMsme = colorMSME;

	standardIndustryTags: compareItemType = {} as compareItemType;
	encorporationDate: compareItemType = {} as compareItemType;
	employeesRangeArrayData: compareItemType = {} as compareItemType;
	financialTableStyle: statsNumberChipsType = {};
	statsChartDataValue: object  = {};
	doughnutChartDatasets : object = {};
	doughnutChartOptions : object = {};
	firstItemSelectiondDropdownVal: object = {};
	keyForFinancial: object = {};
	statsHeaderOptions: object = {};
	
	selectedGlobalCurrency: string = 'GBP';
	selectedGlobalCountry: string = 'uk';
    title: string = '';
    currentSection: string = '';
	dataForPdfReportComponent:any;
	snapshotButton: boolean = true;
	headerGraphbuttonText: string = 'Show Visualized Data';
	totalTurnoverData: any;
	averageTurnoverData: any;
	totalEmployeesData: any;
	averageEmployeesData: any;
    listName: string = '';
    firstListName: string = '';
    secondListName: string = '';

    listSelected: any;
    filterSelected: any;
	firstItemSelected: any;
	secondItemSelected: any;
	firstVisualizedDataBoolean: boolean = false;
	secondVisualizedDataBoolean: boolean = false;
	reportBoolean: boolean = false;
	chipData: any;
	firstChipData: any;
	secondChipData: any;

	spinnerBoolean: boolean = false;
	graphVisible: boolean = false;
	scrollingDisabled: boolean = false;

	messagefromCompareStatsComponent: Array<any> = [];

	listOrStatsDropdown: Array<object>= [
		{ name: 'Save List', endPoint: 'getStatsComparisonDataSaveLists', selection: 'listName', type: 'list' },
		{ name: 'Saved Searches', endPoint: 'getStatsComparisonFilteredLists', selection: 'filterName', type: 'filter' }
	];
	resetselectionlistItem: Array<object> = [
		{ key: 'firstItem', selectionTypengModel: {}, selectedListngModel: {}, selectionTypeOptions: this.listOrStatsDropdown, selectedListOptions: []  },
		{ key: 'secondItem', selectionTypengModel: {}, selectedListngModel: {}, selectionTypeOptions: this.listOrStatsDropdown, selectedListOptions: []  }
	]
	selectionListFilter: Array<object>= JSON.parse( JSON.stringify( this.resetselectionlistItem ) );
	dashboardCardItems: Array<{ field: string, header: Capitalize< string >, routerLink?: string, cardTheme: string, icon?: string }> = [
		{ field: 'firstItem', header: 'Clients', cardTheme: 'cyan', icon: 'badge' },
		{ field: 'secondItem', header: 'Suppliers', cardTheme: 'orange', icon: 'emoji_transportation' },
	];
	headerInformativeCard: Array<any> = [
		{ field: 'totalTurnover', header: 'Total Turnover', bgColor: 'greenCard', icon: 'badge', format: 'currency' },
		{ field: 'avgTurnover', header: 'Average Turnover', bgColor: 'blueCard', icon: 'badge', format: 'currency' },
		{ field: 'totalEmployees', header: 'Total Employees', bgColor: 'voiletCard', icon: 'badge', format: 'number' },
		{ field: 'avgEmployees', header: 'Average Employees', bgColor: 'greenCard', icon: 'badge', format: 'number' },
	];
	directorInformativeCard: Array<any> = [
		{ field: 'totalActiveDirectorCount', header: 'Total Active Director', cardTheme: 'cyan', icon: 'badge' },
		{ field: 'averageActiveDirectorCount', header: 'Average Active Director', cardTheme: 'indigo', icon: 'badge' }
	];
	riskChartLabel: Array<any> = [
		{ field: 'highRisk', label: 'High Risk', percentage: 'highRisk_percentage', bgColor: 'highRiskLegendBg', bckgColor: '#e4790f' },
		{ field: 'moderateRisk', label: 'Moderate Risk', percentage: 'moderateRisk_percentage', bgColor: 'moderateRiskLegendBg', bckgColor: '#ffc201' },
		{ field: 'lowRisk', label: 'Low Risk', percentage: 'lowRisk_percentage', bgColor: 'lowRiskLegendBg', bckgColor: '#59ba9b' },
		{ field: 'veryLowRisk', label: 'Very Low Risk', percentage: 'veryLowRisk_percentage', bgColor: 'veryLowRiskLegendBg', bckgColor: '#6dc470' },
		{ field: 'notScored', label: 'Not Scored / Very High Risk', percentage: 'notScored_percentage', bgColor: 'notScoredLegendBg', bckgColor: '#d92727' },

	]
	companiesOwnedField: Array<any> = [
		{ key: 'minority_companies', label: 'Ethnic Minority Community', payloadKey: 'All Ethnic Minorities' },
		{ key: 'femaleOwnedCompanies', label: 'Female Owned Community', payloadKey: 'Female Owned' }
	]
	msmeDataArrayForPDF: Array<any> = [
		{ label: 'Micro', bgColor: '#59ba9b', firstItem_count: 0, secondItem_count: 0 },
		{ label: 'Small', bgColor: '#ffcc00', firstItem_count: 0, secondItem_count: 0 },
		{ label: 'Medium', bgColor: '#ee9512', firstItem_count: 0, secondItem_count: 0 },
		{ label: 'Large Enterprise', bgColor: '#e1b12c', firstItem_count: 0, secondItem_count: 0 },
		{ label: 'Unknown', bgColor: '#aabbcc', firstItem_count: 0, secondItem_count: 0 },
	]

	financialDropdownOptions: object = {
		firstItem: [],
		secondItem: []
	}
	selectedFinancialKeys: Object = {
		firstItem: '',
		secondItem: ''
	}
	companiesOwnedObj: object = {
		firstItem: [],
		secondItem: []
	};
	estimatedTurnoverToggle: object = {
		firstItem: true,
		secondItem: true
	}
	headerGraphToggle: object = {
		firstItem: true,
		secondItem: true
	}
	otherMiscHandlerObj: object = {
		firstItem: JSON.parse( JSON.stringify( otherMiscArrayData ) ),
		secondItem:  JSON.parse( JSON.stringify( otherMiscArrayData ) )
	};
	compareIndustryListData: object = {
		firstItem: JSON.parse( JSON.stringify( industryListData ) ),
		secondItem:  JSON.parse( JSON.stringify( industryListData ) )
	};
	compareFinancialGraph: Array<any> = [
		{ currentYearKey: 'totalTurnover', previousYearKey: 'previousTotalTurnover', label: 'Total Turnover', labels: ['Previous Year', 'Current Year'], data: [], backgroundColor: 'rgb(24, 163, 135, 0.8)' },
		{ currentYearKey: 'avgTurnover', previousYearKey: 'previousAvgTurnover', label: 'Average Turnover', labels: ['Previous Year', 'Current Year'], data: [], backgroundColor: 'rgb(0, 134, 214, 0.8)' },
		{ currentYearKey: 'totalEmployees', previousYearKey: 'previousTotalEmployees', label: 'Total Employees', labels: ['Previous Year', 'Current Year'], data: [], backgroundColor: 'rgb(95, 82, 223, 0.8)' },
		{ currentYearKey: 'avgEmployees', previousYearKey: 'previousAvgEmployees', label: 'Average Employees', labels: ['Previous Year', 'Current Year'], data: [], backgroundColor: 'rgb(24, 163, 135, 0.8)' }
	]
	financialGraphComparison = {
		firstItem: JSON.parse( JSON.stringify( this.compareFinancialGraph ) ),
		secondItem: JSON.parse( JSON.stringify( this.compareFinancialGraph ) )
	}

	headerNav: Array<any> = [];
	payloadForCompare: payloadForCompareType = {
		firstItem: {
			type: '' as 'list',
			id: ''
		},
		secondItem: {
			type: '' as 'list',
			id: ''
		},
		userId: this.userAuthService?.getUserInfo('dbID') as string
	}

	constructor(
		private globalServerCommunication: ServerCommunicationService,
        private sharedLoaderService: SharedLoaderService,
		private toCurrencyPipe: CurrencyPipe,
		public commonService: CommonServiceService,
		private activeRoute: ActivatedRoute,
        private seoService: SeoService,
		public userAuthService: UserAuthService,
        private canonicalService: CanonicalURLService,
		public toNumberSuffix: NumberSuffixPipe,
		private titleCasePipe: TitleCasePipe,		
		private sharedScreenshotService: SharedScreenshotService,
		private decimalPipe: DecimalPipe,
		public commanStatsClickService: CommanStatsClickService,
		private router: Router,
	) {}
	ngAfterViewInit() {}

	ngOnInit() {
		if ( this.activeRoute.snapshot['_routerState']['url'].includes('/stats-compare') ) {
            this.initBreadcrumbAndSeoMetaTags();
        }

		this.financialTableStyle = statsFinancialChips;
		this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';
		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';
		this.formatHeader();

		// this.compareList()

	}

	takeSnapshot( statsCompareChartViewContainerId ) {
		this.sharedScreenshotService.snapshotForStatsInsight(statsCompareChartViewContainerId, 'DG_Compare_Stats.jpeg');
	}

	initBreadcrumbAndSeoMetaTags() {
		this.title = "Compare Stats from Your saved List or Saved Filters - Let's go with The DataGardener Stats Insights";		
		this.seoService.setPageTitle(this.title);
		this.seoService.setMetaTitle(this.title);
		this.canonicalService.setCanonicalURL();	
	}

	chooseListType( item? ) {
		this.reportBoolean = false;
		if( item.key == 'firstItem' ){
			this.firstItemSelected = '';
			this.firstVisualizedDataBoolean = false;
		} else if( item.key == 'secondItem' ){
			this.secondItemSelected = '';
			this.secondVisualizedDataBoolean = false;
		}
		const { endPoint } = item?.['selectionTypengModel'];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_CHART_API', endPoint ).subscribe({
			next: ( res ) => {
				item[ 'selectedListngModel' ] =  undefined;
				item[ 'selectedListOptions' ] =  res.body.results;
			},
			error: ( err ) => {
				console.log(err)
			}
		})

	}

	formatHeader() {
		this.headerNav = [
			{ key: 'summary', label: 'Summary', navId: 'nav_1', data_check: true },
			{ key: 'msme', label: 'MSME', navId: 'nav_2', data_check: true },
			{ key: 'riskAnalysis', label: 'Risk Analysis', navId: 'nav_3', data_check: true },
			{ key: 'director', label: 'Director', navId: 'nav_4', data_check: true },
			{ key: 'ownedBy', label: 'Companies Owned By', navId: 'nav_5', data_check: (this.statsChartDataValue[ 'firstItem' ] && this.statsChartDataValue[ 'firstItem' ].hasOwnProperty('minority_companies')) },
			{ key: 'otherStats', label: 'Other Stats', navId: 'nav_6', data_check: true },
			{ key: 'companiesbyAge', label: 'Companies by Age', navId: 'nav_7', data_check: ( this.encorporationDate?.[ 'firstItem' ]?.length ) },
			{ key: 'numberofEmployees', label: 'Number of Employees', navId: 'nav_8', data_check: (this.employeesRangeArrayData[ 'firstItem' ]?.length) },
			{ key: 'financial', label: 'Financial', navId: 'nav_9', data_check: true },
			{ key: 'sicIndustry', label: 'SIC Industry', navId: 'nav_10', data_check: 
				( this.compareIndustryListData?.[ 'firstItem' ]?.length && this.selectedGlobalCountry == 'uk' )
			 },
			{ key: 'industryTags', label: 'Industry Tags', navId: 'nav_11', data_check: ( this.standardIndustryTags?.[ 'firstItem' ]?.length ) }
		];
	}

	getDataForDropdownLists( item? ){

		const { key, selectionTypengModel, selectedListngModel } = item;
		
		this.reportBoolean = false;
		this.payloadForCompare[ key ][ 'type' ] = selectionTypengModel[ 'type' ];
		this.payloadForCompare[ key ][ 'id' ] = selectionTypengModel[ 'type' ] == 'list' ? selectedListngModel[ '_id' ] : selectedListngModel[ 'chipData' ];
		
		if ( item.key == 'firstItem' ) {
			this.firstListName = selectionTypengModel[ 'type' ] == 'list' ? selectedListngModel.listName : '';
			this.firstChipData = [{chip_group: "Saved Lists", chip_values: [this.firstListName]}]
			
			this.firstItemSelected = selectedListngModel;
			this.firstVisualizedDataBoolean = selectionTypengModel[ 'type' ] == 'list' ? true : false;
		} else if ( item.key == 'secondItem' ) {
			this.secondListName = selectionTypengModel[ 'type' ] == 'list' ? selectedListngModel.listName : '';
			this.secondChipData = [{chip_group: "Saved Lists", chip_values: [this.secondListName]}]

			this.secondItemSelected = selectedListngModel;
			this.secondVisualizedDataBoolean = selectionTypengModel[ 'type' ] == 'list' ? true : false;
		}
	}

	compareList() {
		this.reportBoolean = true;
		this.sharedLoaderService.showLoader();

		this.globalServerCommunication.globalServerRequestCall('post', 'DG_CHART_API', 'getStatsComparisonData', this.payloadForCompare ).subscribe( {

			next: ( res ) => {
				if ( res.body.status == 200 ) {

					this.statsChartDataValue['firstItem'] = res.body.firstItemData;
					this.statsChartDataValue['secondItem'] = res.body.secondItemData;
					let financialArray = [];
					this.companiesOwnedObj = {
						firstItem: [],
						secondItem: []
					}

					financialArray = res.body.dropdownList;

					for ( let key in this.statsChartDataValue ) {

						/* Prepare Data for Doughnut of Risk Profile */
						this.getRiskAnalysisData( this.statsChartDataValue[ key ][ 'riskChartArray' ], key );

						/**Header card data for ----pdf----- */
						this.headerInformativeCard = this.headerInformativeCard.map( val => {

							let countFormat;
							if ( ['currency'].includes(val.format) ) {
								countFormat = this.statsChartDataValue[ key ][ val.field ] ? this.toNumberSuffix.transform( this.statsChartDataValue[ key ][ val.field ], '0', this.selectedGlobalCurrency ) : 0;
							} else {
								countFormat = this.statsChartDataValue[ key ][ val.field ] ? this.decimalPipe.transform( this.statsChartDataValue[ key ][ val.field ], '1.0-0' ) : 0;
							}

							if ( key == 'firstItem' ) {
								val[ 'firstItem_count' ] = countFormat;
							} else {
								val[ 'secondItem_count' ] = countFormat;
							}

							return val;
						} )

						/**Risk data for ----pdf-----  */
						this.riskChartLabel = this.riskChartLabel.map( val => {

							let countFormat = this.statsChartDataValue[ key ][ 'riskChart' ][ val.field ] ? this.decimalPipe.transform( this.statsChartDataValue[ key ][ 'riskChart' ][ val.field ], '1.0-0' ) : 0;
							let countPercentageFormat = this.statsChartDataValue[ key ][ 'riskChart' ][ val.percentage ] ? this.decimalPipe.transform( this.statsChartDataValue[ key ][ 'riskChart' ][ val.percentage ], '1.0-2' ) : 0;

							if ( key == 'firstItem' ) {
								val[ 'firstItem_count' ] = countFormat;
								val[ 'firstItem_count_percentage' ] = countPercentageFormat;
							} else {
								val[ 'secondItem_count' ] = countFormat;
								val[ 'secondItem_count_percentage' ] = countPercentageFormat;
							}

							return val;
						} )

						/**MSME data for  ----pdf-----  */
						this.msmeDataArrayForPDF = this.msmeDataArrayForPDF.map( val => {

							for ( let item of this.statsChartDataValue[ key ][ 'msmeStatus' ] ) {

								if  ( item['key'] == val['label'] ) {
	
									let countFormat = item['doc_count'] ? this.decimalPipe.transform( item['doc_count'], '1.0-0' ) : '0';
									if ( key == 'firstItem' ) {
										val[ 'firstItem_count' ] = countFormat;
									} else {
										val[ 'secondItem_count' ] = countFormat;
									}
								}

							}

							return val;
						} )

						/* Prepare Company Age data */
						this.encorporationDate[key] = this.statsChartDataValue[key]?.companyIncorporationInfo;

						/* Number of employees */
						this.employeesRangeArrayData[key] = this.statsChartDataValue[key]?.noOfEmployeesArray;

						/* Companies Owned By */
						for ( let val of this.companiesOwnedField ) {
							this.companiesOwnedObj[ key ].push( { ...val, ...this.statsChartDataValue[ key ][ val.key ]  } ) 
						};

						/* Standard Industry Tags */
						this.standardIndustryTags[ key ] = this.statsChartDataValue[ key ]?.standard_industry_tag?.map( tag  =>{
							tag['label'] = tag['field'];
							return tag;
						});

						/* Misc Array Tags */
						for ( let otherMiscObj of this.otherMiscHandlerObj[ key ] ) {
							otherMiscObj.count = this.statsChartDataValue[ key ]?.otherMisc[ otherMiscObj.field ];
							otherMiscObj.count_percentage = this.statsChartDataValue[ key ]?.otherMisc[ `${ otherMiscObj.field }_percentage` ];
						};

						/* SIC industry table */
						if ( this.statsChartDataValue[ key ]?.industry && this.statsChartDataValue[ key ]?.industry.length ) {

							for (let i = 0; i < this.compareIndustryListData[ key ].length; i++) {
		
								for (let j = 0; j < this.statsChartDataValue[ key ]?.industry.length; j++) {
									
									if ( this.compareIndustryListData[ key ][i]['value'] == this.statsChartDataValue[ key ]?.industry[j]['industry'] ) {
		
										this.compareIndustryListData[ key ][i]['count'] = this.statsChartDataValue[ key ]?.industry[j]['count'] || 0;
										this.compareIndustryListData[ key ][i]['count_percentage'] = this.statsChartDataValue[ key ]?.industry[j]['count_percentage'] || 0;
										this.compareIndustryListData[ key ][i]['field'] = this.compareIndustryListData[ key ][i]['value'];
									}
		
								}
		
							}
		
						} else {
							this.compareIndustryListData[ key ] = [];
						}

						/***Financial Graph comparison data */
						for ( let item of this.financialGraphComparison[ key ] ){
							item[ 'data' ] = [ this.statsChartDataValue[ key ]?.[ item.previousYearKey ] ?? 0,  this.statsChartDataValue[ key ]?.[ item.currentYearKey ] || 0 ],
							item[ 'graphData' ] = {
								labels: item[ 'labels' ],
								datasets: [
									{
										label: item[ 'label' ],
										backgroundColor: item.backgroundColor,
										data: item.data
									}
								]
							}
						}

						/* prepare header graph options */
						this.prepareHeaderGraphData( key, 'y' );

					}

					/* Prepare Financial dropdown and card data  */
					if ( financialArray && financialArray.length ) {
						for ( let item of financialArray ) {
							this.financialDropdownOptions[ 'firstItem' ].push( { label: this.titleCasePipe.transform( item.replace(/([a-z])([A-Z])/g, '$1 $2') ), field: item } );
							this.financialDropdownOptions[ 'secondItem' ].push( { label: this.titleCasePipe.transform( item.replace(/([a-z])([A-Z])/g, '$1 $2') ), field: item } );
						}
					}

					this.selectedFinancialKeys[ 'firstItem' ] = 'turnover';
					this.selectedFinancialKeys[ 'secondItem' ] = 'turnover';
					this.selectFinancialKeys();
					this.formatHeader();

				}
				this.sharedLoaderService.hideLoader();
			},

			error: ( err ) => {
				setTimeout(() => {
					this.sharedLoaderService.hideLoader();
				}, 100);
				console.log(err);
			}


		});
	}

	resetCompareStats(){
		this.firstItemSelected = '';
		this.secondItemSelected = '';
		this.reportBoolean = false;
		this.firstVisualizedDataBoolean = false;
		this.secondVisualizedDataBoolean = false;
		this.statsChartDataValue = {};
		this.keyForFinancial = {};
		this.selectedFinancialKeys = {
			firstItem: '',
			secondItem: '' 
		};
		this.doughnutChartDatasets = {};
		this.companiesOwnedObj = {
			firstItem: [],
			secondItem: []
		}
		this.encorporationDate = {} as compareItemType;
		this.employeesRangeArrayData = {} as compareItemType;
		this.financialDropdownOptions = {
			firstItem: [],
			secondItem: []
		};
		this.keyForFinancial = {};
		this.standardIndustryTags = {} as compareItemType;
		this.compareIndustryListData = {
			firstItem: JSON.parse( JSON.stringify( industryListData ) ),
			secondItem:  JSON.parse( JSON.stringify( industryListData ) )
		};
		this.otherMiscHandlerObj = {
			firstItem: JSON.parse( JSON.stringify( otherMiscArrayData ) ),
			secondItem:  JSON.parse( JSON.stringify( otherMiscArrayData ) )
		};
		this.selectionListFilter = JSON.parse( JSON.stringify( this.resetselectionlistItem ) );
		this.formatHeader();
	}

	getRiskAnalysisData( riskArray?, chartFor? ) {

		let chartLabels = [], chartDataset = [], backgroudColor = [];

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
					enabled: true
				},
			},
			onHover: (event, elements) => {
				event.native.target.style.cursor = chartFor ? "pointer" : "default";
			},
			onClick: ( event, elements, chart ) => {
				onChartElementClick( event.native, elements, chart, chartFor );
			}
		}

		for ( let riskItem of riskArray ) {

			chartLabels.push( this.commonService.camelCaseToSentence( riskItem[ 'field' ].trim() ) );

			if ( riskItem[ 'field' ] == 'notSpecified' ) continue;
			chartDataset.push( riskItem[ 'count' ] );

			if ( riskItem[ 'field' ] == 'notSpecified' ) continue;
			backgroudColor.push(this.formatBgColorForPieChart( riskItem[ 'field' ] ));

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
				if ( !this.payloadForCompare[ chartFor ].id ) {
					this.payloadForCompare[ chartFor ].id.unshift({
						chip_group: 'Status',
						chip_values: ['live']
					});
				}

				let navigateUrlParamObject = this.payloadForCompare[ chartFor ].type != 'list' ? this.payloadForCompare[ chartFor ].id : [];
	
				let chipGroup;
	
				navigateUrlParamObject.push(
					{ chip_group: 'Bands', chip_values: [ targetLabel != 'Not Scored / Very High Risk' ? targetLabel.toLowerCase() : 'not scored' ] }
				);
	
				let urlStr: string;
				let listId = this.payloadForCompare[ chartFor ].type == 'list' ? this.payloadForCompare[ chartFor ].id : '';
				let pageName = this.payloadForCompare[ chartFor ].type == 'list' ? 'companyListPage' : '';
				let chipDataValue = this.payloadForCompare[ chartFor ] == 'firstItem' ? this.firstChipData : this.secondChipData;
				this.listName = this.payloadForCompare[ chartFor ] == 'firstItem' ? this.firstListName : this.secondListName;

				if ( this.payloadForCompare[ chartFor ].type == 'list' ) {
					urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(chipDataValue), cListId: listId, listPageName: pageName, hideStatsButton: statsButtonVisible, listName: this.listName } }));
				} else {
					urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(navigateUrlParamObject), cListId: listId, listPageName: pageName, hideStatsButton: statsButtonVisible, listName: this.listName } }));
				}
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

		this.doughnutChartDatasets = this.doughnutChartDatasets;
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

	selectFinancialKeys( selectedValue?: string, dissolvedIndex?: boolean, startPlan?: boolean, pageSize?: number, startAfter?: number, sortOn?: any[], filterSearchArray?: any[] ) {

		let payloadObj = JSON.parse( JSON.stringify( this.payloadForCompare ) );
		if ( selectedValue ) {
			this.selectedFinancialKeys[ 'firstItem' ] = selectedValue;
			this.selectedFinancialKeys[ 'secondItem' ] = selectedValue;
		}
		payloadObj[ 'financialKeys' ] = [ this.selectedFinancialKeys[ 'firstItem' ] ]

		this.spinnerBoolean = true;

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_CHART_API', 'getStatsComparisonPageFinancialCounts', payloadObj ).subscribe( ( res ) =>{
			if ( res.body.status == 200 ) {
				this.keyForFinancial[ 'firstItem' ] = res.body.firstItemDataFinancialsData;
				this.keyForFinancial[ 'secondItem' ] = res.body.secondItemDataFinancialsData;
				this.spinnerBoolean = false;
			}
		})

		this.dataForPdfReportComponent = {
			encorporationDate: this.encorporationDate,
			employeesRangeArrayData: this.employeesRangeArrayData,
			companiesOwnedObj: this.companiesOwnedObj,
			standardIndustryTags: this.standardIndustryTags,
			otherMiscHandlerObj: this.otherMiscHandlerObj,
			compareIndustryListData: this.compareIndustryListData,
			keyForFinancial: this.keyForFinancial,
			headerData: this.headerInformativeCard,
			msmeDataArrayForPDF: this.msmeDataArrayForPDF,
			riskChartLabel: this.riskChartLabel
		}
		
	}

	forEstimatedTurnover(event) {
		this.estimatedTurnoverToggle[ 'firstItem' ] = event.checked;
		this.estimatedTurnoverToggle[ 'secondItem' ] = event.checked;
	}

	forHeaderGraphToggle( event, field? ) {
		this.headerGraphToggle[ field ] = event.checked;
		this.prepareHeaderGraphData( field, this.headerGraphToggle[ field ] ? 'y' : 'x' );
	}

	goToSearchForIndustryTag( industryName, industryValue, item ) {
		this.listName = this.payloadForCompare[ item.field ] == 'firstItem' ? this.firstListName : this.secondListName;

		if ( this.payloadForCompare[ item.field ].type == 'list' ) {
			this.commanStatsClickService.goToSearchForIndustryTag( industryName, industryValue,  undefined, this.payloadForCompare[ item.field ].id, 'companyListPage', this.listName  );
		} else {
			this.commanStatsClickService.goToSearchForIndustryTag( industryName, industryValue, this.payloadForCompare[item.field].id );
		}

	}

	/***click event */

	goToSearchForMisc(  miscName, miscValue, item  ) {
		this.listName = this.payloadForCompare[ item.field ] == 'firstItem' ? this.firstListName : this.secondListName;
		if ( this.payloadForCompare[ item.field ].type == 'list' ) {
			this.commanStatsClickService.goToSearchForMisc( miscName, miscValue, undefined, this.chipData, this.payloadForCompare[ item.field ].id, 'companyListPage', this.listName  );
		} else {
			this.commanStatsClickService.goToSearchForMisc( miscName, miscValue, undefined, this.payloadForCompare[item.field].id );
		}
	}
	
	gotToSearchPage( chipDataValueTo: number | 'not specified', chipDataValueFrom: number | 'not specified', from: string, growthKey?: string, label?: string, item? ) {
		this.listName = this.payloadForCompare[ item.field ] == 'firstItem' ? this.firstListName : this.secondListName;
		if ( this.payloadForCompare[ item.field ].type == 'list' ) {
			this.commanStatsClickService.gotToSearchPage( chipDataValueTo, chipDataValueFrom, growthKey, from, label, this.chipData, this.payloadForCompare[ item.field ].id, 'companyListPage', this.listName, this.estimatedTurnoverToggle[ item.field] );
		} else {
			this.commanStatsClickService.gotToSearchPage( chipDataValueTo, chipDataValueFrom, growthKey, from, label, this.payloadForCompare[item.field].id, undefined, undefined, undefined, this.estimatedTurnoverToggle[ item.field] );
		}
	}
	
	goToSearchForIndustry( industryName, industryValue, industryCode?, item? ) {
		this.listName = this.payloadForCompare[ item.field ] == 'firstItem' ? this.firstListName : this.secondListName;
		if ( this.payloadForCompare[ item.field ].type == 'list' ) {
			this.commanStatsClickService.goToSearchForIndustry( industryName, industryValue, industryCode, this.chipData, this.payloadForCompare[ item.field ].id, 'companyListPage', this.listName, this.selectedGlobalCountry );
		} else {
			this.commanStatsClickService.goToSearchForIndustry( industryName, industryValue, industryCode, this.payloadForCompare[item.field].id, undefined, undefined, undefined, this.selectedGlobalCountry );
		}
	}

	goToCompanySearchBymsme( selectedChipValue, item ) {
		this.listName = this.payloadForCompare[ item.field ] == 'firstItem' ? this.firstListName : this.secondListName;
		if ( this.payloadForCompare[ item.field ].type == 'list' ) {
			this.commanStatsClickService.goToCompanySearchBymsme( selectedChipValue, this.chipData, this.payloadForCompare[ item.field ].id, 'companyListPage', this.listName);
		} else {
			this.commanStatsClickService.goToCompanySearchBymsme( selectedChipValue, this.payloadForCompare[item.field].id, undefined, undefined, undefined );
		}

	}

	headerGraphHandler() {
	  this.graphVisible = !this.graphVisible;
	  this.headerGraphbuttonText = this.graphVisible ? 'Hide Visualized Data' : 'Show Visualized Data';
	}

	messageOutPutForReportComponent( e ) {
		this.messagefromCompareStatsComponent = e;
	}

	prepareHeaderGraphData( field, axis? ) {

		let horXaix= {
			display: true,
			ticks: {
				beginAtZero: true,
				font: {
					family: 'Roboto',
					style: 'normal',
				},
				fontColor: '#bbb',
				padding: 10,
				precision: 0,
				callback: (label) => {
					return label ? this.toNumberSuffix.transform( label, 2 ) : 0;
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
			title: {
				show: false,
			}
		};

		let horYaxis = {
			ticks: {
				font: {
					size: 12,
					family: 'Roboto',
					style: 'normal',
				},
				// color: '#bbb',
				padding: 3,
			},
			grid: {
				display: false,
				color: '#bbb'
			}
		};

		let graphAxis = axis;
		let setXAxis, SetYAxis;

		if ( this.headerGraphToggle[ field ] ) {
			setXAxis = horXaix;
			SetYAxis = horYaxis;
		} else {
			setXAxis = horYaxis;
			SetYAxis = horXaix;
		}
		

		this.statsHeaderOptions[field] = {
			indexAxis: graphAxis,
			layout: {
				padding: { top: 18, left: 10, right: 10 }
			},
			categoryPercentage: 0.8,
			barPercentage: 0.6,
			scales: {
				x: setXAxis,
				y: SetYAxis
			},
			plugins: {
				legend: {
					display: true,
					labels: {
						usePointStyle: true,
						color: 'var(--surface-a)'
					}
				},
				title: {
					display: false
				}
			},
			hover: {
				onHover: (event, elements) => {
					event.target.style.cursor = elements[0] ? "pointer" : "default";
				}
			},
			animation: {
				duration: 2000,
				easing: 'easeInOutQuad'
			},
			onClick: (event) => {
				// onLineChartClick(event)
			},
		}
	}

	scrollToElement( id, navItem? ) {

		this.scrollingDisabled = true;
		// window.remove EventListener('scroll', this.onWindowScroll);
		const element = document.getElementById( id ) as HTMLElement;

		if ( element ) {
			element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });			
		}

		const links = document.querySelectorAll('.goToElementContainer .columns');
		links.forEach(link => link.classList.remove('bg-yellow-400', 'border-3'));

		const clickedLink = document.getElementById(navItem.navId);
		if (clickedLink) {
			clickedLink.classList.add('bg-yellow-400', 'border-3');
		}

		setTimeout(() => {
			this.scrollingDisabled = false;
			// window.addEventListener('scroll', this.onWindowScroll);
		}, 1000);

	}

	@HostListener('window:scroll', [])
	onWindowScroll() {

		if ( this.scrollingDisabled ) {
			return;
		}

		const links = document.querySelectorAll('.goToElementContainer .columns');
		links.forEach(link => link.classList.remove('bg-yellow-400', 'border-3'));
	}
	

}
