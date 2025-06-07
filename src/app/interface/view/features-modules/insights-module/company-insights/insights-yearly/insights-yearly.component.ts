import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { UIChart } from 'primeng/chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
// import { Month } from 'src/app/interface/view/shared-components/filter-sidebar/filter-sidebar.component';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { subscribedPlan } from 'src/environments/environment';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
enum Month {
	undefined, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
}

@Component({
	selector: 'dg-insights-yearly',
	templateUrl: './insights-yearly.component.html',
	styleUrls: ['../../insights-component.scss', './insights-yearly.component.scss']
})

export class InsightsYearlyComponent implements OnInit {

	@ViewChild( 'LazyLeafletMapContainer', { read: ViewContainerRef } ) LazyLeafletMapContainer: ViewContainerRef;

	@ViewChild('insightLineChart', { static: false }) public insightLineChart: UIChart;
	@ViewChild('insightBarChart', { static: false }) public insightBarChart: UIChart;

	ChartDataLabelsPlugin = [ChartDataLabels];

	ccjReverseBarData = {};
	chargesReverseBarData = {};
	registrationReverseBarData = {};
	insightsLayoutModeDark: boolean = false;
	lineData: any;
	barData: any;
	doughnutData: any;
	lineOptions: any;
	barOptions: any;
	doughnutOptions: any;
	ccjData: any = undefined;
	chargesData: any = undefined;
	companiesRegisteredData: any = undefined;
	companyLiquidationData: any = undefined;
	companyDissolvedData: any = undefined;
	mapData1: Array<any> = undefined;
	title: string = '';
	description: string = '';

	lineDataColumns: Array<any> = [
		{ field: 'label', header: 'Month', width: 'auto', textAlign: 'left' },
		{ field: 'count', header: 'Count', width: 'auto', textAlign: 'center' },
	];
	barDataColumns: Array<any> = [
		{ field: 'label', header: 'Year', width: 'auto', textAlign: 'left' },
		{ field: 'count', header: 'Count', width: 'auto', textAlign: 'center' },
	];
	industryTableColumns: Array<any> = [
		{ field: 'label', header: 'Industry', width: 'auto', textAlign: 'left' },
		{ field: 'count', header: 'Count', width: 'auto', textAlign: 'center' },
	];

	lineDataTableValues: Array<any> = undefined;
	barDataTableValues: Array<any> = undefined;
	industryTableValues: Array<any> = undefined;
	heading: string = "";
	activeTab: string = 'ccj';
	windowInnerWidth: number;

	insightsCategoryOptions: Array<any> = [
		{ label: 'Companies Registered', value: 'company_registration_data', chipGroup: 'Incorporation Date' },
		{ label: 'CCJ\'s Filed', value: 'ccj_data', chipGroup: 'CCJ Date' },
		{ label: 'Charges Registered', value: 'charges_data', chipGroup: 'Charges Registered Date' }
	];

	mapDataObj = {};
	mapData1Obj = new Map();

	mapDataTotal: number = 0
	mapData1Total: number = 0

	mapData: any = undefined;
	industry: any = undefined;
	highlighter: any = undefined;

	currentMapData: any = undefined;

	currentYear = new Date().getFullYear() - 1;
	previousYear = new Date().getFullYear() - 2;

	popUpProps: any;

	str: any;

	selectedInsightsCategory: any = 'company_registration_data';
	selectedIndustryList: any;
	selectedData: any;

	msgLogs: Message[] = [];

	subscribedPlanModal: any = subscribedPlan;
	currentPlan: unknown;

	industryListOptions: Array<object> = [
		{ label: 'Choose Industry', value: undefined },
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

	constructor(
		public userAuthService: UserAuthService,
		private seoService: SeoService,
		private toNumberSuffix: NumberSuffixPipe,
		private router: Router,
		private componentFactoryResolver: ComponentFactoryResolver,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunicate: ServerCommunicationService

	) {
		this.currentPlan = this.userAuthService?.getUserInfo('planId');
	}

	ngOnInit(): void {

		this.initBreadcrumbAndSeoMetaTags();
		
		this.getCCJData();
		this.getChargesData();
		this.getCompaniesRegisteredData();
		this.getliquidationData();
		this.getDissolvedData();

		this.sharedLoaderService.showLoader();

		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getMapDataNew').subscribe(res => {
			if (res.body.status == 200) {
				this.mapData = res.body.results;
				this.onCategoryIndustryChange(undefined, this.selectedInsightsCategory, this.selectedIndustryList);

			}
			this.sharedLoaderService.hideLoader();
		});

	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems([
		// 	{ label: 'Insights - Yearly', routerLink: ['/insights/insights-yearly'] }
		// ]);
		this.title = "DataGardener Insight - Automate your marketing workflows";
		this.description = "Get in-depth analytics of company CCJ, Charges, complaint registered against companies, dissolved and liquidation date.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setMetaTitle(this.title);
		this.seoService.setDescription(this.description);
	
	}

	onCategoryIndustryChange(event?: any, optCategory?: string, optIndustry?: string) {
		if(optIndustry && optIndustry['label'] =="Choose Industry" && optIndustry['value'] == undefined){
			optIndustry = undefined
		}
		let filteredCurrentYrData = {}, filteredPrevYrData = {}, graphChartData = {};

		/*=============================
		 For Maps
		=============================*/
		for (let prevYrKey in this.mapData['previousYearData']) {
			if (optCategory == prevYrKey) {

				for (let regionData of this.mapData['previousYearData'][prevYrKey]["result"]) {

					if (optIndustry) {
						for (let industryData of regionData['industries']) {

							if (optIndustry == industryData.industry) {
								filteredPrevYrData[regionData.region.split(' ').join('_')] = industryData.count;
							}

						}
					} else {
						filteredPrevYrData[regionData.region.split(' ').join('_')] = regionData.count;
					}

				}
			}

		}

		for (let currentYrKeys in this.mapData['currentYearData']) {

			if (optCategory == currentYrKeys) {
				for (let regionData of this.mapData['currentYearData'][currentYrKeys]["result"]) {

					if (optIndustry) {
						for (let industryData of regionData['industries']) {

							if (optIndustry == industryData.industry) {
								filteredCurrentYrData[regionData.region.split(' ').join('_')] = industryData.count;
							}

						}
					} else {
						filteredCurrentYrData[regionData.region.split(' ').join('_')] = regionData.count;
					}
				}
			}

		}

		this.initLeafletMapContainer( filteredPrevYrData, filteredCurrentYrData );

		/*=============================
		 For Charts
		=============================*/
		let chartLegendLabel;

		for (let val of this.insightsCategoryOptions) {
			if (val.value == optCategory) {
				chartLegendLabel = val.label;
			}
		}

		if (optCategory == 'ccj_data') {

			graphChartData['chartBarData'] = this.ccjReverseBarData['ccjReverseBarData'];
			graphChartData['chartLineDataCurrentYear'] = this.ccjData['ccjLineDataCurrentYear'];
			graphChartData['chartLineDataPreviousYear'] = this.ccjData['ccjLineDataPreviousYear'];

		} else if (optCategory == 'charges_data') {

			graphChartData['chartBarData'] = this.chargesReverseBarData['chargesReverseBarData'];
			graphChartData['chartLineDataCurrentYear'] = this.chargesData['chargesLineDataCurrentYear'];
			graphChartData['chartLineDataPreviousYear'] = this.chargesData['chargesLineDataPreviousYear'];

		} else if (optCategory == 'company_registration_data') {

			graphChartData['chartBarData'] = this.registrationReverseBarData['registrationReverseBarData'];
			graphChartData['chartLineDataCurrentYear'] = this.companiesRegisteredData['registrationLineDataCurrentYear'];
			graphChartData['chartLineDataPreviousYear'] = this.companiesRegisteredData['registrationLineDataPreviousYear'];

		} else if (optCategory == 'company_liquidation_data') {

			graphChartData['chartBarData'] = this.companyLiquidationData['liquidationBarData'].reverse();
			graphChartData['chartLineDataCurrentYear'] = this.companyLiquidationData['liquidationLineDataCurrentYear'];
			graphChartData['chartLineDataPreviousYear'] = this.companyLiquidationData['liquidationLineDataPreviousYear'];

		} else if (optCategory == 'company_dissolved_data') {

			graphChartData['chartBarData'] = this.companyDissolvedData['dissolvedBarData'].reverse();
			graphChartData['chartLineDataCurrentYear'] = this.companyDissolvedData['dissolvedLineDataCurrentYear'];
			graphChartData['chartLineDataPreviousYear'] = this.companyDissolvedData['dissolvedLineDataPreviousYear'];

		}

		this.setGraphData(graphChartData, chartLegendLabel);

		// if (this.insightsLayoutModeDark) {
		// 	this.darkLayout();
		// } else {
		// 	this.lightLayout();
		// }
	}

	async initLeafletMapContainer( previousYearData, currentYearData ) {

		const { LazyLeafletMapComponent } = await import('../../../../shared-components/lazy-leaflet-map/lazy-leaflet-map.component');

		this.LazyLeafletMapContainer.clear();

		const { instance } = this.LazyLeafletMapContainer.createComponent( LazyLeafletMapComponent );
		instance.mapConfig.primaryMapId = `insightsYearlyPrimaryMapContainer`;
		instance.mapConfig.secondaryMapId = `insightsYearlySecondaryMapContainer`;
		instance.mapData = { previousYearData: previousYearData, currentYearData: currentYearData };
		instance.requiredData = { 
			thisPage: 'insightsYearly', 
			insightsCategoryOptions: this.insightsCategoryOptions, 
			selectedInsightsCategory: this.selectedInsightsCategory, 
			industryListOptions: this.industryListOptions, 
			currentYear: this.currentYear, 
			previousYear: this.previousYear,
			selectedIndustryList: this.selectedIndustryList
		};
	}

	getCCJData() {
		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getCCJChartDataNew').subscribe(res => {
				
				if (res.body.status == 200) {
					this.ccjData = res.body.results;
					this.ccjReverseBarData['ccjReverseBarData'] = this.ccjData['ccjBarData'].reverse();
				}
			}
		)
	}

	getChargesData() {
		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getChargesChartDataNew').subscribe(res => {
				
				if (res.body.status == 200) {
					this.chargesData = res.body.results;
					this.chargesReverseBarData['chargesReverseBarData'] = this.chargesData['chargesBarData'].reverse();
				}
			}
		)
	}

	getCompaniesRegisteredData() {
		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getRegistrationChartDataNew').subscribe(res => {
			
				if (res.body.status == 200) {
					this.companiesRegisteredData = res.body.results;
					this.registrationReverseBarData['registrationReverseBarData'] = this.companiesRegisteredData['registrationBarData'].reverse();
				}
			}
		)
	}

	getliquidationData() {
		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getLiquidationChartData').subscribe(res => {
				
				if (res.body.status == 200) {
					this.companyLiquidationData = res.body.results;
				}
			}
		)
	}

	getDissolvedData() {
		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getDissolvedChartData').subscribe(res => {
			
				if (res.body.status == 200) {
					this.companyDissolvedData = res.body.results;
				}
			}
		)
	}

	formatDataForGraph(dataArray, src) {

		let tempArray = [];

		if (src == "label") {

			for (let dataVal of dataArray) {
				tempArray.push(dataVal.label);
			}

		} else if (src == "data") {

			for (let dataVal of dataArray) {

				if( this.selectedIndustryList && this.selectedIndustryList['label'] == "Choose Industry" && this.selectedIndustryList['value'] == undefined ) {
					this.selectedIndustryList = undefined;
				}
				if (this.selectedIndustryList) {

					for (let industryObj of dataVal.industries) {

						if (this.selectedIndustryList == industryObj.industry) {
							tempArray.push(industryObj.count);
						}

					}

				} else {
					tempArray.push(dataVal.count);
				}
			}

		}

		return tempArray;
	}

	setGraphData(graphData, chartFor) {
		let barLabels: Array<any> = undefined;
		let barDataset: Array<any> = undefined;
		let barText: string = undefined;

		let lineLabels: Array<any> = undefined;
		let lineDatasetCurrentYear: Array<any> = undefined;
		let lineDatasetPreviousYear: Array<any> = undefined;
		let lineText: string = undefined;

		barLabels = this.formatDataForGraph(graphData.chartBarData, "label");
		barDataset = this.formatDataForGraph(graphData.chartBarData, "data");
		barText = `${chartFor} in ${this.currentYear} VS ${this.previousYear} - Yearly`;

		lineLabels = this.formatDataForGraph(graphData.chartLineDataCurrentYear, "label");
		lineDatasetCurrentYear = this.formatDataForGraph(graphData.chartLineDataCurrentYear, "data");
		lineDatasetPreviousYear = this.formatDataForGraph(graphData.chartLineDataPreviousYear, "data");
		lineText = `${chartFor} in ${this.currentYear} VS ${this.previousYear} - Monthly`;

		this.barData = {
			labels: barLabels,
			datasets: [
				{
					backgroundColor: ["rgba(33, 195, 181, .5)", "rgba(99, 172, 189, .5)"],
					borderColor: ["rgba(33, 195, 181, 1)", "rgba(99, 172, 189, 1)"],
					borderWidth: 3,
					data: barDataset,
					datalabels: {
						backgroundColor: ( context ) => {
						  return context.dataset.borderColor;
						}
					}				
				}
			]
		}
		this.barOptions = {
			onHover: (event, elements) => {
				event.native.target.style.cursor = elements[0] ? "pointer" : "default";
			},
			onClick: (event) => {
				onBarChartClick(event.native)
			},
			plugins: {
				datalabels: {
					display: true,
					align: 'end',
					anchor: 'end',
					offset: 5,
					color: '#fff',
					font: { size: 15 },
					borderRadius: 3,
					padding: { top: 4, right: 5, bottom: 1, left: 5 },
					formatter: ( value, context ) => {
						value = this.toNumberSuffix.transform( +value, 2 );
						return value;
					}
				},
				legend: {
					display: false,
					labels: {
						usePointStyle: true
					}
				},
				tooltip: {
					callbacks: {
						label: function ( tooltipItem ) {
							return tooltipItem.formattedValue;
						}
					}
				},
				title: {
					display: true,
					text: barText,
					font: {
						family: 'Roboto',
						weight: 'bold',
						size: 14
					},
					color: '#000000',
					padding: 20
				},
			},
			scales: {
				y: {
					beginAtZero: true,       
					display: true,
					scaleLabel: {
						show: true,
					},
					ticks: {
						font: {
							family: 'Roboto',
							weight: 'bold'
						},
						color: '#000000',
						callback: (label) => {
							return this.toNumberSuffix.transform(label, 1);
						}
					},
					grid: {
						display: true,
						drawTicks: false,
						color: context => context.tick.value == 0 ? '#000000' : '#fff'
					}
				},
				x: {
					beginAtZero: 0,
					ticks: {
						font: {
							family: 'Roboto',
							weight: 'bold'
						},
						color: '#000000',
						padding: 10
					},
					grid: {
						display: true,
						drawTicks: false,
						color: context => context.index == 0 ? '#000000' : '#fff'
					}
				}
					
			}
	
		}

		this.lineData = {
			labels: lineLabels,
			datasets: [
				{
					data: lineDatasetCurrentYear,
					backgroundColor: "rgba(33, 195, 181, .5)",
					fill: 'origin',
					borderColor: '#1eb0a3',
					pointRadius: 4,
					pointBackgroundColor: '#21c3b5',
					borderWidth: 1,
					label: barLabels[0],
					pointStyle: 'circle',
					// tension: '0.2'
				},
				{
					data: lineDatasetPreviousYear,
					backgroundColor: "rgba(99, 172, 189, .5)",
					fill: 'origin',
					borderColor: '#599baa',
					pointRadius: 5,
					pointBackgroundColor: '#63acbd',
					borderWidth: 1,
					label: barLabels[1],
					pointStyle: 'rect',
					// tension: '0.2'
				}
			]
		}

		this.lineOptions = {
			onClick: (event) => {
				onLineChartClick(event.native)
			},
			onHover: (event, elements) => {
				event.native.target.style.cursor = elements[0] ? "pointer" : "default";
			},
			tension: 0.4,
			scales: {
				y: {
					beginAtZero: true,
					ticks: {
						font: {
							size: 10,
							family: 'Roboto',
							weight: "bold",

						},
						padding: 10,
						color: '#000000',
						callback: (val, index) => {
							return index % 2 === 0 ? this.toNumberSuffix.transform(val, 0) : '';
						}
					},
					grid: {
						offset: true,
						color: '#e6e6e6'
					}
				},
				x: {
					ticks: {
						font: {
							size: 10,
							family: 'Roboto',
							weight: "bold",

						},
						color: '#000000',
						padding: 5,
						callback: ( label ) => {
							return lineLabels[label].substring(0, 3).toUpperCase();
						}
					},
					grid: {
						offset: true,
						color: '#e6e6e6'
					}
				}
			},
			plugins: {
				datalabels: {
					display: false,
				},
				legend: {
					// onClick: (e) => e.stopPropagation(),
					onClick: (e) => null,
					display: true,
					labels: {
						color: '#000000',
						usePointStyle: true,
						// boxWidth: 30,
						padding: 25
					}
				},
				title: {
					display: true,
					text: lineText,
					font: {
						family: 'Roboto',
						weight: 'bold',
						size: 14
					},
					color: '#000000',
					padding: 20
				},
				tooltip: {
					callbacks: {
						label: function (tooltipItem, label) {
							return (tooltipItem.formattedValue)
						}
					}
				},
			}
			
		}

		let _this = this;
		function onBarChartClick(event) {

			const barPoints = _this.insightBarChart.chart.getElementsAtEventForMode(event, 'index', { intersect: true }, true);

			if (barPoints.length > 0) {
				if (["company_liquidation_data", "company_dissolved_data"].includes(_this.selectedInsightsCategory)) {
					if (_this.msgLogs.length == 0) {
						_this.msgLogs.push({
							severity: "info",
							summary: "Will be available soon.",
						});
						setTimeout(() => {
							_this.msgLogs = [];
						}, 4000);
					}
				} else {
					let navigateUrlParamObject = [],
						yearStartDateStr,
						yearEndDateStr;

					if (barPoints[0].index == 0) {
						yearStartDateStr = `01-01-${_this.currentYear}`;
						yearEndDateStr = `31-12-${_this.currentYear}`;
					} else if (barPoints[0].index == 1) {
						yearStartDateStr = `01-01-${_this.previousYear}`;
						yearEndDateStr = `31-12-${_this.previousYear}`;
					}

					for (let categoryObj of _this.insightsCategoryOptions) {
						if (_this.selectedInsightsCategory == categoryObj.value) {
							navigateUrlParamObject.push({
								chip_group: categoryObj.chipGroup,
								chip_values: [
									[
										yearStartDateStr.replace(/-/gi, "/"),
										yearEndDateStr.replace(/-/gi, "/"),
										`From ${yearStartDateStr} to ${yearEndDateStr}`,
									],
								],
							});
						}
					}

					if (_this.selectedIndustryList) {
						for (let industryObj of _this.industryListOptions) {
							if (_this.selectedIndustryList == industryObj["value"]) {
								navigateUrlParamObject.push({
									chip_group: "SIC Codes",
									chip_values: [industryObj["label"]],
									chip_industry_sic_codes: [industryObj["value"]],
								});
							}
						}
					}
					_this.router.navigate(["/company-search"], {
						queryParams: {
							chipData: JSON.stringify(navigateUrlParamObject),
							dgInsights: true
						},
					});
				}
			}
		}

		function onLineChartClick(event) {

			const linePoints = _this.insightLineChart.chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
	
			if (linePoints.length > 0) {
				if (["company_liquidation_data", "company_dissolved_data"].includes(_this.selectedInsightsCategory)) {
					if (_this.msgLogs.length == 0) {
						_this.msgLogs.push({
							severity: "info",
							summary: "Will be available soon.",
						});
						setTimeout(() => {
							_this.msgLogs = [];
						}, 4000);
					}
				} else {
					// To Check Months In A Year including leap year
				
					const toCheckCurrentYearForGraphOnPoint = _this.insightLineChart.data.datasets[ linePoints[0].datasetIndex ].label;
					const tocheckLeapYear = ( ( toCheckCurrentYearForGraphOnPoint % 4 === 0 && toCheckCurrentYearForGraphOnPoint % 100 > 0 ) || toCheckCurrentYearForGraphOnPoint % 400 == 0 ) ? 366 : 365;
					
					const monthEnum = { Jan: 31, Feb: tocheckLeapYear == 365 ? 28 : 29, Mar: 31, Apr: 30, May: 31, Jun: 30, Jul: 31, Aug: 31, Sep: 30, Oct: 31, Nov: 30, Dec: 31 };
					
					let navigateUrlParamObject = [],
						yearStartDateStr,
						yearEndDateStr;

					if (linePoints[0].datasetIndex == 0) {
						let clickedIndex = linePoints[0].index;
						if (clickedIndex < 9) {
							yearStartDateStr = `01-0${clickedIndex + 1}-${_this.currentYear}`;
							yearEndDateStr = `${ monthEnum[ Month[clickedIndex + 1] ] }-0${clickedIndex + 1}-${_this.currentYear}`;
						} else {
							yearStartDateStr = `01-${clickedIndex + 1}-${_this.currentYear}`;
							yearEndDateStr = `${ monthEnum[ Month[clickedIndex + 1] ] }-${clickedIndex + 1}-${_this.currentYear}`;
						}
					} else if (linePoints[0].datasetIndex == 1) {
						let clickedIndex = linePoints[0].index;
						if (clickedIndex < 9) {
							yearStartDateStr = `01-0${clickedIndex + 1}-${_this.previousYear}`;
							yearEndDateStr = `${ monthEnum[ Month[clickedIndex + 1] ] }-0${clickedIndex + 1}-${_this.previousYear}`;
						} else {
							yearStartDateStr = `01-${clickedIndex + 1}-${_this.previousYear}`;
							yearEndDateStr = `${ monthEnum[ Month[clickedIndex + 1] ] }-${clickedIndex + 1}-${_this.previousYear}`;
						}
					}

					for (let categoryObj of _this.insightsCategoryOptions) {
						if (_this.selectedInsightsCategory == categoryObj.value) {
							navigateUrlParamObject.push({
								chip_group: categoryObj.chipGroup,
								chip_values: [
									[
										yearStartDateStr.replace(/-/gi, "/"),
										yearEndDateStr.replace(/-/gi, "/"),
										`From ${yearStartDateStr} to ${yearEndDateStr}`,
									],
								],
							});
						}
					}

					if (_this.selectedIndustryList) {
						for (let industryObj of _this.industryListOptions) {
							if (_this.selectedIndustryList == industryObj["value"]) {
								navigateUrlParamObject.push({
									chip_group: "SIC Codes",
									chip_values: [industryObj["label"]],
									chip_industry_sic_codes: [industryObj["value"]],
								});
							}
						}
					}

					_this.router.navigate(["/company-search"], {
						queryParams: {
							chipData: JSON.stringify(navigateUrlParamObject),
							dgInsights: true
						},
					});
				}
			}
		}

		// setTimeout(() => {
		// 	this.insightLineChart.chart.config.options.animation['onComplete'] = function () {
		// 		let ctx = _this.insightLineChart.chart.ctx;
		// 		ctx.textAlign = 'center';
		// 		ctx.textBaseline = 'bottom';

		// 		this.data.datasets.forEach(function (dataset) {
		// 			for (let i = 11; i < dataset.data.length; i++) {
		// 				let model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;

		// 				ctx.fillStyle = '#000000';
		// 				ctx.font = "normal 11px Roboto";

		// 				let x_pos = model.x,
		// 					y_pos = model.y - 2;

		// 				if (dataset.label == '2021') {
		// 					ctx.fillText(2021, x_pos, y_pos);
		// 				}
		// 				if (dataset.label == '2020') {
		// 					ctx.fillText(2020, x_pos, y_pos);
		// 				}


		// 			}
		// 		});
		// 	}
		// 	this.insightBarChart.chart.config.options.animation['onComplete'] = function () {
		// 		var ctx = _this.insightBarChart.chart.ctx;
		// 		ctx.textAlign = 'center';
		// 		ctx.textBaseline = 'bottom';

		// 		this.data.datasets.forEach(function (dataset) {
		// 			for (var i = 0; i < dataset.data.length; i++) {
		// 				var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;

		// 				ctx.fillStyle = '#000000';
		// 				ctx.font = "normal 12px Roboto";
		// 				var y_pos = model.y + 1;

		// 				ctx.fillText(dataset.data[i].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(".00", ""), model.x, y_pos);
		// 			}
		// 		});
		// 	}
		// }, 0);

	}

	darkLayout() {
		let _this = this;
		setTimeout(() => {
			this.insightLineChart.chart.config.options.animation['onComplete'] = function () {
				let ctx = _this.insightLineChart.chart.ctx;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'bottom';

				this.data.datasets.forEach(function (dataset) {
					for (let i = 11; i < dataset.data.length; i++) {
						let model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;

						ctx.fillStyle = '#fff';
						ctx.font = "normal 11px Roboto";

						let x_pos = model.x,
							y_pos = model.y - 2;

						if (dataset.label == '2021') {
							ctx.fillText(2021, x_pos, y_pos);
						}
						if (dataset.label == '2020') {
							ctx.fillText(2020, x_pos, y_pos);
						}

					}
				});
			}
			this.insightBarChart.chart.config.options.animation['onComplete'] = function () {
				var ctx = _this.insightBarChart.chart.ctx;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'bottom';

				this.data.datasets.forEach(function (dataset) {
					for (var i = 0; i < dataset.data.length; i++) {
						var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;

						ctx.fillStyle = '#fff';
						ctx.font = "normal 12px Roboto";
						var y_pos = model.y + 1;

						ctx.fillText(dataset.data[i].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(".00", ""), model.x, y_pos);
					}
				});
			}

			this.insightsLayoutModeDark = true;

			this.insightBarChart.chart.config.options.title.fontColor = '#FFFFFF';
			this.insightBarChart.chart.config.options.scales.yAxes[0].ticks.fontColor = '#FFFFFF';
			this.insightBarChart.chart.config.options.scales.yAxes[0].ticks.major.fontColor = '#FFFFFF';
			this.insightBarChart.chart.config.options.scales.yAxes[0].ticks.minor.fontColor = '#FFFFFF';
			this.insightBarChart.chart.config.options.scales.yAxes[0].gridLines.color = '#FFFFFF';
			this.insightBarChart.chart.config.options.scales.xAxes[0].ticks.fontColor = '#FFFFFF';
			this.insightBarChart.chart.config.options.scales.xAxes[0].ticks.major.fontColor = '#FFFFFF';
			this.insightBarChart.chart.config.options.scales.xAxes[0].ticks.minor.fontColor = '#FFFFFF';
			this.insightBarChart.chart.config.options.scales.xAxes[0].gridLines.color = '#FFFFFF';

			this.insightBarChart.refresh();

			this.insightLineChart.chart.config.options.title.fontColor = '#FFFFFF';
			this.insightLineChart.chart.config.options.legend.labels.fontColor = '#FFFFFF';
			this.insightLineChart.chart.config.options.scales.yAxes[0].ticks.fontColor = '#FFFFFF';
			this.insightLineChart.chart.config.options.scales.yAxes[0].ticks.major.fontColor = '#FFFFFF';
			this.insightLineChart.chart.config.options.scales.yAxes[0].ticks.minor.fontColor = '#FFFFFF';
			this.insightLineChart.chart.config.options.scales.yAxes[0].gridLines.color = "rgba(255, 255, 255, .2)";
			this.insightLineChart.chart.config.options.scales.xAxes[0].ticks.fontColor = '#FFFFFF';
			this.insightLineChart.chart.config.options.scales.xAxes[0].ticks.major.fontColor = '#FFFFFF';
			this.insightLineChart.chart.config.options.scales.xAxes[0].ticks.minor.fontColor = '#FFFFFF';
			this.insightLineChart.chart.config.options.scales.xAxes[0].gridLines.color = "rgba(255, 255, 255, .2)";

			this.insightLineChart.refresh();

		}, 0);
	}

	lightLayout() {

		let _this = this;
		setTimeout(() => {
			this.insightLineChart.chart.config.options.animation['onComplete'] = function () {
				let ctx = _this.insightLineChart.chart.ctx;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'bottom';

				this.data.datasets.forEach(function (dataset) {
					for (let i = 11; i < dataset.data.length; i++) {
						let model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;

						ctx.fillStyle = '#000000';
						ctx.font = "normal 11px Roboto";

						let x_pos = model.x,
							y_pos = model.y - 2;

						if (dataset.label == '2021') {
							ctx.fillText(2021, x_pos, y_pos);
						}
						if (dataset.label == '2020') {
							ctx.fillText(2020, x_pos, y_pos);
						}

					}
				});
			}
			this.insightBarChart.chart.config.options.animation['onComplete'] = function () {
				var ctx = _this.insightBarChart.chart.ctx;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'bottom';

				this.data.datasets.forEach(function (dataset) {
					for (var i = 0; i < dataset.data.length; i++) {
						var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;

						ctx.fillStyle = '#000000';
						ctx.font = "normal 12px Roboto";
						var y_pos = model.y + 1;

						ctx.fillText(dataset.data[i].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(".00", ""), model.x, y_pos);
					}
				});
			}

			this.insightsLayoutModeDark = false;

			this.insightBarChart.chart.config.options.title.fontColor = '#000000';
			this.insightBarChart.chart.config.options.scales.yAxes[0].ticks.fontColor = '#000000';
			this.insightBarChart.chart.config.options.scales.yAxes[0].ticks.major.fontColor = '#000000';
			this.insightBarChart.chart.config.options.scales.yAxes[0].ticks.minor.fontColor = '#000000';
			this.insightBarChart.chart.config.options.scales.yAxes[0].gridLines.color = '#000000';
			this.insightBarChart.chart.config.options.scales.xAxes[0].ticks.fontColor = '#000000';
			this.insightBarChart.chart.config.options.scales.xAxes[0].ticks.major.fontColor = '#000000';
			this.insightBarChart.chart.config.options.scales.xAxes[0].ticks.minor.fontColor = '#000000';
			this.insightBarChart.chart.config.options.scales.xAxes[0].gridLines.color = '#000000';

			this.insightBarChart.refresh();

			this.insightLineChart.chart.config.options.title.fontColor = '#000000';
			this.insightLineChart.chart.config.options.legend.labels.fontColor = '#000000';
			this.insightLineChart.chart.config.options.scales.yAxes[0].ticks.fontColor = '#000000';
			this.insightLineChart.chart.config.options.scales.yAxes[0].ticks.major.fontColor = '#000000';
			this.insightLineChart.chart.config.options.scales.yAxes[0].ticks.minor.fontColor = '#000000';
			this.insightLineChart.chart.config.options.scales.yAxes[0].gridLines.color = '#e6e6e6';
			this.insightLineChart.chart.config.options.scales.xAxes[0].ticks.fontColor = '#000000';
			this.insightLineChart.chart.config.options.scales.xAxes[0].ticks.major.fontColor = '#000000';
			this.insightLineChart.chart.config.options.scales.xAxes[0].ticks.minor.fontColor = '#000000';
			this.insightLineChart.chart.config.options.scales.xAxes[0].gridLines.color = '#e6e6e6';

			this.insightLineChart.refresh();

		}, 0);
	}

}
