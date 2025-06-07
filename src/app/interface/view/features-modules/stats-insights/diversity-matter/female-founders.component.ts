import { CurrencyPipe } from "@angular/common";
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";

import { Table } from "primeng/table";

import ChartDataLabels from "chartjs-plugin-datalabels";

import { CommonServiceService } from "src/app/interface/service/common-service.service";
import { SeoService } from "src/app/interface/service/seo.service";
import { ServerCommunicationService } from "src/app/interface/service/server-communication.service";
import { SharedScreenshotService } from "src/app/interface/service/shared-screenshot.service";
import { SharedLoaderService } from "../../../shared-components/shared-loader/shared-loader.service";
import { UserAuthService } from "src/app/interface/auth-guard/user-auth/user-auth.service";
import { colorMSME } from "../../../shared-components/stats-insights/stats-financial-index";
import { NumberSuffixPipe } from "src/app/interface/custom-pipes/number-suffix/number-suffix.pipe";


@Component({
	selector: 'dg-female-founders',
	templateUrl: './female-founders.component.html',
	styleUrls: [ '../stats-insights-dashboard.component.scss', './female-founders.component.scss' ]
})
export class FemaleFoundersComponent implements OnInit {

	@ViewChild( 'LazyLeafletMapContainer', { read: ViewContainerRef } ) LazyLeafletMapContainer: ViewContainerRef;
	@ViewChild('femaleFoundersTable', { static: false }) public femaleFoundersTable: Table;

	ChartDataLabelsPlugins = [ ChartDataLabels ];

	title: string = '';
	description: string = '';
	femaleFoundersDataValue: any;
	genderCount: any;
	genderCountsArr: Array<any> = [];
	companiesByAgeCountArray: Array<any> = [];

	doughnutChartDatasets : any = {};
	doughnutChartOptions : any = {};

	tempIndustryTableData: any;

	checkEstimatedTurnover: boolean = false;
	isPSCchecked: boolean = false;
	isDirectorChecked: boolean = false;
	isSuperAdmin: boolean;

	genderCountArray: Array<any> = [
		{ count: 0, color: '#22a6b399', key: 'male', key_psc: 'male', key_director: 'male' },
		{ count: 0, color: '#eb3b5a99', key: 'female', key_psc: 'female_psc', key_director: 'female_director' },
		{ count: 0, color: '#07999299', key: 'unknown', key_psc: 'unknown', key_director: 'unknown' }
	]

	financialTurnoversArrayData: Array<{ field: string, label: string, value: Object, count: number, count_percentage: number }> = [
		{ field: '1to1M', label: '1 to 1M', value: { greaterThan: '1', lessThan: '1000000' }, count: 0, count_percentage: 0 },
		{ field: '1Mto5M', label: '1M to 5M', value: { greaterThan: '1000000', lessThan: '5000000' }, count: 0, count_percentage: 0 },
		{ field: '5Mto10M', label: '5M to 10M', value: { greaterThan: '5000000', lessThan: '10000000' }, count: 0, count_percentage: 0 },
		{ field: '10Mto100M', label: '10M to 100M', value: { greaterThan: '10000000', lessThan: '100000000' }, count: 0, count_percentage: 0 },
		{ field: '100Mto500M', label: '100M to 500M', value: { greaterThan: '100000000', lessThan: '500000000' }, count: 0, count_percentage: 0 },
		{ field: '500Mto1B', label: '500M to 1B', value: { greaterThan: '500000000', lessThan: '1000000000' }, count: 0, count_percentage: 0 },
		{ field: 'greaterThan1B', label: 'Greater Than 1B', value: { greaterThan: '1000000000', lessThan: undefined }, count: 0, count_percentage: 0 }
	];

	estimatedTurnoversArrayData: Array<{ field: string, label: string, value: Object, count: number, count_percentage: number }> = [
		{ field: '1to1M', label: '1 to 1M', value: { greaterThan: '1', lessThan: '1000000' }, count: 0, count_percentage: 0 },
		{ field: '1Mto5M', label: '1M to 5M', value: { greaterThan: '1000000', lessThan: '5000000' }, count: 0, count_percentage: 0 },
		{ field: '5Mto10M', label: '5M to 10M', value: { greaterThan: '5000000', lessThan: '10000000' }, count: 0, count_percentage: 0 },
		{ field: '10Mto100M', label: '10M to 100M', value: { greaterThan: '10000000', lessThan: '100000000' }, count: 0, count_percentage: 0 },
		{ field: '100Mto500M', label: '100M to 500M', value: { greaterThan: '100000000', lessThan: '500000000' }, count: 0, count_percentage: 0 },
		{ field: '500Mto1B', label: '500M to 1B', value: { greaterThan: '500000000', lessThan: '1000000000' }, count: 0, count_percentage: 0 },
		{ field: 'greaterThan1B', label: 'Greater Than 1B', value: { greaterThan: '1000000000', lessThan: undefined }, count: 0, count_percentage: 0 }
	];

	financialTotalAssetsArrayData: Array<{ field: string, label: string, value: Object, count: number, count_percentage: number }> = [
		{ field: '1to1M', label: '1 to 1M', value: { greaterThan: '1', lessThan: '1000000' }, count: 0, count_percentage: 0 },
		{ field: '1Mto5M', label: '1M to 5M', value: { greaterThan: '1000000', lessThan: '5000000' }, count: 0, count_percentage: 0 },
		{ field: '5Mto10M', label: '5M to 10M', value: { greaterThan: '5000000', lessThan: '10000000' }, count: 0, count_percentage: 0 },
		{ field: '10Mto100M', label: '10M to 100M', value: { greaterThan: '10000000', lessThan: '100000000' }, count: 0, count_percentage: 0 },
		{ field: '100Mto500M', label: '100M to 500M', value: { greaterThan: '100000000', lessThan: '500000000' }, count: 0, count_percentage: 0 },
		{ field: '500Mto1B', label: '500M to 1B', value: { greaterThan: '500000000', lessThan: '1000000000' }, count: 0, count_percentage: 0 },
		{ field: 'greaterThan1B', label: 'Greater Than 1B', value: { greaterThan: '1000000000', lessThan: undefined }, count: 0, count_percentage: 0 }
	];

	financialNetworthArrayData: Array<{ field: string, label: string, value: Object, count: number, count_percentage: number }> = [
		{ field: '1to1M', label: '1 to 1M', value: { greaterThan: '1', lessThan: '1000000' }, count: 0, count_percentage: 0 },
		{ field: '1Mto5M', label: '1M to 5M', value: { greaterThan: '1000000', lessThan: '5000000' }, count: 0, count_percentage: 0 },
		{ field: '5Mto10M', label: '5M to 10M', value: { greaterThan: '5000000', lessThan: '10000000' }, count: 0, count_percentage: 0 },
		{ field: '10Mto100M', label: '10M to 100M', value: { greaterThan: '10000000', lessThan: '100000000' }, count: 0, count_percentage: 0 },
		{ field: '100Mto500M', label: '100M to 500M', value: { greaterThan: '100000000', lessThan: '500000000' }, count: 0, count_percentage: 0 },
		{ field: '500Mto1B', label: '500M to 1B', value: { greaterThan: '500000000', lessThan: '1000000000' }, count: 0, count_percentage: 0 },
		{ field: 'greaterThan1B', label: 'Greater Than 1B', value: { greaterThan: '1000000000', lessThan: undefined }, count: 0, count_percentage: 0 }
	];

	employeesRangeArrayData: Array<{ field: string, label: string, count: number, count_percentage: number, rangeFrom: string, rangeTo: string }> = [
		{ field: '1-2', label: '1 to 2', count: 0, count_percentage: 0, rangeFrom: '1', rangeTo: '2' },
		{ field: '3-5', label: '3 to 5', count: 0, count_percentage: 0 , rangeFrom: '3', rangeTo: '5'},
		{ field: '6-10', label: '6 to 10', count: 0, count_percentage: 0, rangeFrom: '6', rangeTo: '10' },
		{ field: '11-25', label: '11 to 25', count: 0, count_percentage: 0, rangeFrom: '11', rangeTo: '25' },
		{ field: '26-50', label: '26 to 50', count: 0, count_percentage: 0, rangeFrom: '26', rangeTo: '50' },
		{ field: '51-100', label: '51 to 100', count: 0, count_percentage: 0, rangeFrom: '51', rangeTo: '100' },
		{ field: '101-250', label: '101 to 250',count: 0, count_percentage: 0, rangeFrom: '101', rangeTo: '250' },
		{ field: '251-500', label: '251 to 500' , count: 0, count_percentage: 0, rangeFrom: '251', rangeTo: '500' },
		{ field: '501-1000', label: '501 to 1000', count: 0, count_percentage: 0, rangeFrom: '501', rangeTo: '1000' },
		{ field: '1000+', label: '1000+',count: 0, count_percentage: 0, rangeFrom: '1001', rangeTo: '' }
	];

	encorporationDate:  Array<{ field: string, label: string, count: number, count_percentage: number, rangeFrom: string, rangeTo: string }> = [
		{ field: '0-1', label: '0 to 1', count: 0, count_percentage: 0, rangeFrom: '0', rangeTo: '1' },
		{ field: '1-2', label: '1 to 2', count: 0, count_percentage: 0, rangeFrom: '1', rangeTo: '2' },
		{ field: '3-5', label: '3 to 5', count: 0, count_percentage: 0, rangeFrom: '3', rangeTo: '5' },
		{ field: '5-7', label: '5 to 7', count: 0, count_percentage: 0 , rangeFrom: '5', rangeTo: '7' },
		{ field: '7-10', label: '7 to 10', count: 0, count_percentage: 0 , rangeFrom: '7', rangeTo: '10' },
		{ field: '10+', label: '10+', count: 0, count_percentage: 0, rangeFrom: '10', rangeTo: '' }
	];

	industryListColumn: Array<any> = [
		{ field: 'label',  header: 'SIC Industry', minWidth: '300px', maxWidth: 'none', textAlign: 'left', isSortable: false },
		{ field: 'count', header: 'Count', minWidth: '120px', maxWidth: '120px', textAlign: 'right', isSortable: true },
		{ field: 'count_percentage', header: '%', minWidth: '120px', maxWidth: '120px', textAlign: 'right', isSortable: false }
	];

	industryListData: Array<object> = [
		{ label: 'A - agriculture forestry and fishing', value: 'agriculture forestry and fishing' },
		{ label: 'B - mining and quarrying', value: 'mining and quarrying' },
		{ label: 'C - manufacturing', value: 'manufacturing' },
		{ label: 'D - electricity, gas, steam and air conditioning supply', value: 'electricity, gas, steam and air conditioning supply' },
		{ label: 'E - water supply, sewerage, waste management and remediation activities', value: 'water supply, sewerage, waste management and remediation activities' },
		{ label: 'F - construction', value: 'construction' },
		{ label: 'G - wholesale and retail trade; repair of motor vehicles and motorcycles', value: 'wholesale and retail trade; repair of motor vehicles and motorcycles' },
		{ label: 'H - transportation and storage', value: 'transportation and storage' },
		{ label: 'I - accommodation and food service activities', value: 'accommodation and food service activities' },
		{ label: 'J - information and communication', value: 'information and communication' },
		{ label: 'K - financial and insurance activities', value: 'financial and insurance activities' },
		{ label: 'L - real estate activities', value: 'real estate activities' },
		{ label: 'M - professional, scientific and technical activities', value: 'professional, scientific and technical activities' },
		{ label: 'N - administrative and support service activities', value: 'administrative and support service activities' },
		{ label: 'O - public administration and defence; compulsory social security', value: 'public administration and defence; compulsory social security' },
		{ label: 'P - education', value: 'education' },
		{ label: 'Q - human health and social work activities', value: 'human health and social work activities' },
		{ label: 'R - arts, entertainment and recreation', value: 'arts, entertainment and recreation' },
		{ label: 'S - other service activities', value: 'other service activities' },
		{ label: 'T - activities of households as employers; undifferentiated goods- and services-producing activities of households for own use', value: 'activities of households as employers; undifferentiated goods- and services-producing activities of households for own use' },
		{ label: 'U - activities of extraterritorial organisations and bodies', value: 'activities of extraterritorial organisations and bodies' }
	];

	otherMiscArrayData: { field: string, label: string, count: number, count_percentage: number }[] = [
		{ field: "ccj", label: "County Court Judgments", count: 0, count_percentage: 0 },
		{ field: "patentData", label: "Companies With Patent", count: 0, count_percentage: 0 },
		{ field: "innovateData", label: "Companies with Grants", count: 0, count_percentage: 0 },
		{ field: "writeOff", label: "Write-offs", count: 0, count_percentage: 0 },
		{ field: "landCoporateDetails", label: "Companies Land Ownerships", count: 0, count_percentage: 0 },
		{ field: "shareholding", label: "Companies with Shareholdings", count: 0, count_percentage: 0 },
		{ field: "ecsData", label: "Environment Agency Registered", count: 0, count_percentage: 0 }
	];

	femaleFoundersDataObject: any = {
		"filterData": [
			{
				"chip_group": "Status",
				"chip_values": [
					"live"
				]
			},
			{
				"chip_group": "Preferences",
				"chip_values": [
					"Company Must Be Owned By Female"
				],
				"preferenceOperator": [
					{
						"companyFoundedByFemale": "true"
					}
				]
			}
		]
	}

	msmeStatus: Array<any> = [];
	colorForWorkflowMsme = colorMSME;
	totalActiveDirectorCount: number;
	averageActiveDirectorCount: number;
	selectedGlobalCurrency: string = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';

	constructor(
        public userAuthService: UserAuthService,
		private router: Router,
		private seoService: SeoService,
		private componentFactoryResolver: ComponentFactoryResolver,
		private globalServerCommunication: ServerCommunicationService,
		private sharedLoaderService: SharedLoaderService,
		private toCurrencyPipe: CurrencyPipe,
		public commonService: CommonServiceService,
		private sharedScreenshotService: SharedScreenshotService,
		public toNumberSuffix: NumberSuffixPipe 
	) { 
        
        if ( !this.userAuthService.hasAddOnPermission('femaleFounder') && !this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
            this.router.navigate(['/']);
        }

	}

	ngOnInit() {
		this.isSuperAdmin= this.userAuthService.hasRolePermission( ['Super Admin'] )
		this.sharedLoaderService.showLoader();

		this.initBreadcrumbAndSeoMetaTags();
		this.getDiversityMatterData();
	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems([
		// 	{ label: 'Female Owned', routerLink: ['/stats-insights/female-owned'] }
		// ]);
		this.title = "DataGardener Female Owners - Automate your marketing workflows";
		this.description = "Get in-depth analytics of company CCJ, Charges, complaint registered against companies, dissolved and liquidation date.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setMetaTitle(this.title);
		this.seoService.setDescription(this.description);
	
	}

	getDiversityMatterData() {

		this.globalServerCommunication.globalServerRequestCall('post', 'DG_CHART_API', 'getDiversityStatsData', this.femaleFoundersDataObject ).subscribe(res => {
			
			if ( res.body.status == 200 ) {
				
				this.femaleFoundersDataValue = res.body.result;


				// Gender Counts
				this.genderCount = this.femaleFoundersDataValue?.['totalFoundersData'];

				this.genderCountArray = this.genderCountArray.filter( val => {
					let gender =  this.isPSCchecked ? val?.key_psc : this.isDirectorChecked ? val?.key_director : val?.key;
					val['count'] = this.genderCount?.[gender]?.companies;
					return val;
				}).sort((a, b) => {  return a.count - b.count });


				// Turonver Counts Start
				if ( this.femaleFoundersDataValue.financialTurnoversArray ) {

					for ( let turonver of this.financialTurnoversArrayData ) {

						for ( let statsFinTurnover of this.femaleFoundersDataValue.financialTurnoversArray ) {
	
							if ( turonver.field == statsFinTurnover.field ) {
	
								turonver.count = statsFinTurnover.count;
								turonver.count_percentage = statsFinTurnover.count_percentage;
	
							}
		
						}
	
					}

				}
				// Turonver Counts Ends

				// Estimated Turonver Counts Start
				if ( this.femaleFoundersDataValue.financialTurnoversPlusEstimatedTurnoversArray ) {

					for ( let finTurnover of this.estimatedTurnoversArrayData ) {
						
						for ( let estimatedStatsFinTurnover of this.femaleFoundersDataValue.financialTurnoversPlusEstimatedTurnoversArray ) {
	
							if ( finTurnover.field == estimatedStatsFinTurnover.field ) {
								finTurnover.count = estimatedStatsFinTurnover['count'];
								finTurnover.count_percentage = estimatedStatsFinTurnover['count_percentage'];
							}
	
						}
					}

				}
				// Estimated Turonver Counts Ends

				// Financial Total Assets Counts Start
				if ( this.femaleFoundersDataValue.financialTotalAssetsArray ) {

					for ( let totalAssets of this.financialTotalAssetsArrayData ) {
	
						for ( let statsFinTurnover of this.femaleFoundersDataValue.financialTotalAssetsArray ) {
	
							if ( totalAssets.field == statsFinTurnover.field ) {
	
								totalAssets.count = statsFinTurnover.count;
								totalAssets.count_percentage = statsFinTurnover.count_percentage;
	
							}
	
						}
	
					}

				}
				// Financial Total Assets Counts Ends

				// Financial Net Worth Counts Start
				if ( this.femaleFoundersDataValue.financialNetworthArray ) {

					for ( let netWorth of this.financialNetworthArrayData ) {
	
						for ( let statsFinTurnover of this.femaleFoundersDataValue.financialNetworthArray ) {
	
							if ( netWorth.field == statsFinTurnover.field ) {
	
								netWorth.count = statsFinTurnover.count;
								netWorth.count_percentage = statsFinTurnover.count_percentage;
	
							}
	
						}
	
					}

				}
				// Financial Net Worth Counts Ends

				// Number rof Employees Counts Start
				if ( this.femaleFoundersDataValue.noOfEmployeesArray ) {

					for ( let employeeKey of this.employeesRangeArrayData ) {
						
						for ( let employeeKeyRange of this.femaleFoundersDataValue.noOfEmployeesArray ) {
	
							if ( employeeKey.field == employeeKeyRange.field ) {
								employeeKey.count = employeeKeyRange['count'];
								employeeKey.count_percentage = employeeKeyRange['count_percentage'];
							}
	
						}
					}

				}
				// Numbe rof Employees Counts Ends

				// Other Stats Table Start
				if ( this.femaleFoundersDataValue.otherMisc ) {

					for ( let otherMiscObj of this.otherMiscArrayData ) {
						otherMiscObj.count = this.femaleFoundersDataValue.otherMisc[ otherMiscObj.field ];
						otherMiscObj.count_percentage = this.femaleFoundersDataValue.otherMisc[ `${ otherMiscObj.field }_percentage` ];
					}

				}
				// Other Stats Table Ends

				// SIC Industry Table Start
				for (let i = 0; i < this.industryListData.length; i++) {

					for (let j = 0; j < this.femaleFoundersDataValue.industry.length; j++) {
						
						if ( this.industryListData[i]['value'] == this.femaleFoundersDataValue.industry[j]['industry'] ) {

							this.industryListData[i]['count'] = this.femaleFoundersDataValue.industry[j]['count'];
							this.industryListData[i]['count_percentage'] = this.femaleFoundersDataValue.industry[j]['count_percentage'];
						}

					}

				}

				this.tempIndustryTableData = JSON.parse( JSON.stringify( this.industryListData ) );
				// SIC Industry Table Ends

				// Companies by Age Count Start
				if ( this.femaleFoundersDataValue.companyIncorporationInfo ) {

					for ( let employeeKey of this.encorporationDate ) {
						
						for ( let employeeKeyRange of this.femaleFoundersDataValue.companyIncorporationInfo ) {
	
							if ( employeeKey.field == employeeKeyRange.field ) {
								employeeKey.count = employeeKeyRange.count;
								employeeKey.count_percentage = employeeKeyRange.count_percentage;
							}
	
						}
					}

				}
				// Companies by Age Count Ends
					
				// Risk Analysis Chart Start
				if ( this.femaleFoundersDataValue.riskChart ) {

					this.initDoughnutChartContainer( this.femaleFoundersDataValue.riskChart, "riskChart" );
	
				}
				// Risk Analysis Chart Ends

				// Region Map Start
				this.initLeafletMapContainer( this.femaleFoundersDataValue.region );
				// Region Map Ends

				this.msmeStatus = this.femaleFoundersDataValue.msmeStatus;
				this.totalActiveDirectorCount = this.femaleFoundersDataValue.totalActiveDirectorCount;
				this.averageActiveDirectorCount = this.femaleFoundersDataValue.averageActiveDirectorCount;

			}
			setTimeout(() => {
				this.sharedLoaderService.hideLoader();
			}, 100);

		});

	}

	async initLeafletMapContainer( currentYearData ) {
		
		const { LazyLeafletMapComponent } = await import('../../../shared-components/lazy-leaflet-map/lazy-leaflet-map.component');

		this.LazyLeafletMapContainer.clear();
		
		const { instance } = this.LazyLeafletMapContainer.createComponent( LazyLeafletMapComponent );
        instance.mapConfig.primaryMapId = `femaleFoundersMapContainer`;
		instance.mapData = { currentYearData: currentYearData };
		instance.requiredData = {
			thisPage: 'femaleFounders',
			globalFilterDataObject: this.femaleFoundersDataObject
		};
		instance.itag = { icon: true, message: 'Categorises female-owned businesses across different regions in the UK, showing geographic distribution trends. Click on a region to explore business density and ownership patterns.'}
		
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

			if ( this.femaleFoundersDataValue[ chartFor ].hasOwnProperty( dataKey ) && dataKey.split('_').length < 2 ) {
				chartLabels.push( this.commonService.camelCaseToSentence( dataKey.trim() ) );

				chartDataset.push( this.femaleFoundersDataValue[ chartFor ][ dataKey ] );
				
				if ( chartFor == "riskChart" ) {
					backgroudColor.push(this.formatBgColorForPieChart( dataKey ));
					chartPercentage.push( this.femaleFoundersDataValue[ chartFor ][ dataKey + '_percentage' ] );
				} else {
					backgroudColor = [ "#2ab5cb", "#51bbe6", "#0b6876" ];
				}

			}


		}

		const onChartElementClick = ( event, elements, chart, chartFor ) => {

			let chartEvent = chart.config.data;
	
			if ( chartEvent && elements && elements.length ) {

				let	targetLabel = chartEvent.labels[ elements[0].index];
	
				let navigateUrlParamObject = JSON.parse( JSON.stringify( this.femaleFoundersDataObject.filterData ) );

				let chipGroup;

				if ( chartFor == 'riskChart' ) {
					chipGroup = 'Bands';
					navigateUrlParamObject = navigateUrlParamObject.filter( val => val.chip_group !== 'Bands' );
				}
	
				navigateUrlParamObject.push(
					{ chip_group: chipGroup, chip_values: [ targetLabel != 'Not Scored / Very High Risk' ? targetLabel.toLowerCase() : 'not scored' ] }
				);
	
				let urlStr: string;

				urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(navigateUrlParamObject) } }));

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

	gotToSearchPage( chipDataValueTo?, chipDataValueFrom?, from? ) {

		let obj = {
			0: ['Less than 1', "less"],
			1: ["Greater than 1 , Less than 2", 'between1To2'],
			3: ["Greater than 3 , Less than 5", 'between3To5'],
			5: ["Greater than 5 , Less than 7", 'between5To7'],
			7: ["Greater than 7 , Less than 10", 'between7To10'],
			10: ['Greater than 10', 'greater']
		}

		let navigateUrlParamObject = JSON.parse( JSON.stringify( this.femaleFoundersDataObject.filterData ) );

		if ( from == 'sicIndustry' ) {

			navigateUrlParamObject.push(
				{
					chip_group: "SIC Codes",
					chip_values: [ chipDataValueTo ],
					chip_industry_sic_codes: [ chipDataValueFrom ],
				}
			);

		}

		if ( from == 'fromTurnover' ) {

			navigateUrlParamObject.push(
				{
					chip_group: "Key Financials",
					chip_values: [
						{
							key: "turnover", 
							greater_than: chipDataValueTo ? chipDataValueTo : undefined,
							less_than: chipDataValueFrom ? chipDataValueFrom : undefined, 
							financialBoolean: true, 
							selected_year: "true" 
						}
					]
				}
			);

		} else if ( from == 'fromEstimatedTurnover' ) {
				
			navigateUrlParamObject.push(
				{
					chip_group: "Key Financials",
					chip_values: [
						{ key: "turnover", greater_than: chipDataValueTo ? chipDataValueTo : undefined, less_than: chipDataValueFrom ? chipDataValueFrom : undefined, financialBoolean: true, selected_year: "true" },
						{ key: "estimated_turnover", greater_than: chipDataValueTo ? chipDataValueTo : undefined, less_than: chipDataValueFrom ? chipDataValueFrom : undefined, financialBoolean: true, selected_year: "true" }
					]
				}
			);

		}

		if ( from == 'fromTotalAssets' ) {
				
			navigateUrlParamObject.push(
				{
					chip_group: "Key Financials",
					chip_values: [
						{
							key: "totalAssets", 
							greater_than: chipDataValueTo ? chipDataValueTo : undefined, 
							less_than: chipDataValueFrom ? chipDataValueFrom : undefined, 
							financialBoolean: true, 
							selected_year: "true" 
						}
					]
				}
			);

		} 

		if ( from == 'fromNetWorth' ) {
				
			navigateUrlParamObject.push(
				{
					chip_group: "Key Financials",
					chip_values: [
						{
							key: "netWorth", 
							greater_than: chipDataValueTo ? chipDataValueTo : undefined, 
							less_than: chipDataValueFrom ? chipDataValueFrom : undefined, 
							financialBoolean: true, 
							selected_year: "true" 
						}
					]
				}
			);

		}

		if ( from == 'fromEmployee' ) {
			navigateUrlParamObject.push(
				{
					chip_group: "Number of Employees",
					chip_values: [ [chipDataValueTo, chipDataValueFrom] ]
				}
			);
		}

		if ( from == 'fromDate' ) {
			
			navigateUrlParamObject.push(
				
				{
					chip_group: "Company Age Filter",
					label: "Company Age",
					chip_values: [ [ +chipDataValueTo, +chipDataValueFrom ] ], 
					ageOperator: [
						obj[chipDataValueTo][1],
						"fromFemaleFoundersPage"
					]
				}
			);
		}

		if ( from == 'genderCount' ) {

			navigateUrlParamObject.push(
				{
					chip_group: chipDataValueTo,
					chip_values: [ chipDataValueFrom ],
				}
			);

		}

		if ( [ 'fromMale', 'male' ].includes( from ) ) {

			navigateUrlParamObject.pop();

			navigateUrlParamObject.push(
				{
					chip_group: 'Preferences',
					chip_values: [ "Company Must Be Owned By Male" ],
					preferenceOperator: [{companyFoundedByMale: "true"}]
				}
			);

		}

		if ( [ 'fromUnknwon', 'unknown' ].includes( from ) ) {

			navigateUrlParamObject.pop();

			navigateUrlParamObject.push(
				{
					chip_group: 'Preferences',
					chip_values: [ "Company Must Be Owned By Unknown" ],
					preferenceOperator: [{companyFoundedByUnknown : "true"}]
				}
			);

		}

		if ( from == 'msme' ) {
			navigateUrlParamObject.push( { chip_group: 'MSME Classification', chip_values: [ chipDataValueTo ] } );
		}

		let urlStr: string;
		
		urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(navigateUrlParamObject) } }));

		window.open( urlStr, '_blank' );

	}

	goToSearchForMisc( miscName, miscValue? ) {
		
		let chipGroupName, preferenceObj, navigateUrlParamObject;


		navigateUrlParamObject = JSON.parse( JSON.stringify( this.femaleFoundersDataObject.filterData ) );
		
		if (miscName == 'Companies With Patent') { 
			chipGroupName = "company must have companies with patent";
			preferenceObj = { "hasPatentData": "true" };
		}

		if (miscName == 'Companies with Grants') { 
			chipGroupName = "company must have companies with grants";
			preferenceObj = { "hasInnovateData": "true" };
		}

		if (miscName == 'Environment Agency Registered') { 
			chipGroupName = "Company must have ecs data";
			preferenceObj = { "hasEcsData": "true" };
		}

		if (miscName == 'Companies with Shareholdings') { 
			chipGroupName = "Company must have shareholdings";
			preferenceObj = { "hasShareholdings": "true" };
		}

		if (miscName == 'Write-offs') { 
			chipGroupName = "Company must have write-offs";
			preferenceObj = { "isDebtor": "true" };
		}

		if (miscName == 'Companies Land Ownerships') { 
			chipGroupName = "Company must have corporate land";
			preferenceObj = { "hasLandCorporate": "true" };
		}

		if (miscName == 'County Court Judgments') { 
			chipGroupName = "Company must have CCJ";
			preferenceObj = { "hasCCJInfo": "true" };
		}

		if (miscName == 'All Ethnic Minorities') { 
			chipGroupName = "Company must be ethnic minorities";
			preferenceObj = { "is_ethnic_ownership": 'true' };
		}

		if ( miscName == 'Bands' ) {
			let selectedBand = miscValue.target.children[0].innerText.toLowerCase();
			selectedBand = selectedBand == 'not scored / very high risk' ? 'not scored': selectedBand;
			let filterData = { chip_group: miscName, chip_values: [selectedBand] };
			navigateUrlParamObject.push(filterData);
		}

		if ( miscName == 'Director Gender' ) {
			let filterData = { chip_group: miscName, chip_values: [miscValue] };
			navigateUrlParamObject.push(filterData);
		}

		if ( chipGroupName && preferenceObj ) {

			if ( JSON.stringify(navigateUrlParamObject).includes('Preferences') ) {
				
				for (let data of navigateUrlParamObject) {
					if (data.chip_group == 'Preferences') {
						let tempChipArray = chipGroupName.split(" ")
						let tempChipVal = tempChipArray[tempChipArray.length - 2] + " " + tempChipArray[tempChipArray.length - 1]
					
						data.chip_values.forEach((chipData, chipDataIndex) => {
							if (chipData.includes(tempChipVal)) {
								data.chip_values.splice(chipDataIndex, 1);
							}
						});
	
						data.preferenceOperator.forEach((chipData, chipDataIndex) => {
							let preferenceObjKey = Object.keys(preferenceObj)[0]
							if (chipData.hasOwnProperty(preferenceObjKey)) {
								data.preferenceOperator.splice(chipDataIndex, 1);
							}
						});
						
						data.chip_values.push(chipGroupName);
						data.preferenceOperator.push(preferenceObj);
					} 	
					
				}

			} else {
				let filterData = { chip_group: "Preferences", chip_values: [chipGroupName], preferenceOperator: [preferenceObj] };
				navigateUrlParamObject.push(filterData);
			}


		}

		let urlStr: string;
		
		urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(navigateUrlParamObject) } }));

		window.open( urlStr, '_blank' );

	}

	customSort( event, ethnicTable, field) {

		let value1, value2, result;
		let tableDomElement = this.femaleFoundersTable.el.nativeElement.children[0],
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
		
		this.tempIndustryTableData = JSON.parse( JSON.stringify(this.industryListData ) );

		table.filter(null);
		table.reset();

	}

	forEstimatedTurnover(event) {
		this.checkEstimatedTurnover = event.checked;
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
		
			default:
				break;
		}

		return finalResult;

	}

	getPscData(event) {
		
		if ( event.checked == true ) {

			this.isDirectorChecked = false;

			this.femaleFoundersDataObject['filterData'][1]['preferenceOperator'] = [];

			this.femaleFoundersDataObject['filterData'][1]['preferenceOperator'].push(
				{ "companyFoundedByFemale": "true" },
				{ "companyFoundedByFemalePsc": "true" }
			);
			
		} else if ( event.checked == false ) {

			this.femaleFoundersDataObject['filterData'][1]['preferenceOperator'].pop()

		}

		this.sharedLoaderService.showLoader();

		this.getDiversityMatterData();
		
	}

	getDirectorData( event ) {

		if ( event.checked == true ) {

			this.isPSCchecked = false;

			this.femaleFoundersDataObject['filterData'][1]['preferenceOperator'] = [];

			this.femaleFoundersDataObject['filterData'][1]['preferenceOperator'].push(
				{ "companyFoundedByFemale": "true" },
				{ "companyFoundedByFemaleDirector": "true" }
			);
			
		} else if ( event.checked == false ) {

			this.femaleFoundersDataObject['filterData'][1]['preferenceOperator'].pop()

		}

		this.sharedLoaderService.showLoader();

		this.getDiversityMatterData();

	}

	takeSnapshot( insightsChartViewContainerId ) {
		this.sharedScreenshotService.snapshotForStatsInsight(insightsChartViewContainerId, 'DG_Female_Founders.jpeg');
	}
	
}