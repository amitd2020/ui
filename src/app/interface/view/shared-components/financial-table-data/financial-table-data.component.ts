import { CurrencyPipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { UIChart } from 'primeng/chart';
import { Table } from 'primeng/table';

import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { subscribedPlan } from 'src/environments/environment';
import { SharedLoaderService } from '../shared-loader/shared-loader.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';
import { mkConfig, generateCsv, download } from "export-to-csv";

@Component({
	selector: 'dg-financial-table-data',
	templateUrl: './financial-table-data.component.html',
	styleUrls: ['./financial-table-data.component.scss']
})
export class FinancialTableDataComponent implements OnInit {

	ChartDataLabelsPlugin = [ChartDataLabels];
	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'
	Data: boolean = true;
	iTagMessage = 'Estimated Turnover = 7.3 times Trade Debtors.'

	@Input() showFinancialTableInput: boolean = false;
	@Input() showRatiosTableInput: boolean = false;
	@Input() showUkgaapIfrsInsuranceFinancialInput: boolean = false;
	@Input() financialSimpleAccntsData: any;
	@Input() financeStatutoryAccounts: any;
	@Input() requiredCompanyName: any;
	@Input() zScoreData: any;
	@Input() CAGRdata: any;
	@Input() pieChartZScore: any;
	@Input() ukgaapIfrsInsuranceFinancialData: any;
	@Input() UkgaapHeadingName: String;
	@Input() thisPage: string;

	@ViewChild('fullFinancialDataTable', { static: false }) public fullFinancialDataTable: Table;

	companyName: string = '';

	userDetails: Partial< UserInfoType > = {};
	subscribedPlanModal: any = subscribedPlan;
	showUpgradePlanDialog: boolean = false;

	financialTableCols: Array<any> = [];
	financialTableGroups: Array<any> = [];
	financialKeysToIgnore: Array<any> = ['keyName', 'group', 'order'];

	financialRatioTableCols: Array<any> = [];
	financialRatioRowHeader: Array<any> = [];
	financialRatioTableData: Array<any> = [];

	zScoreRowHeader: Array<any> = [];
	CAGRheader: Array<any> = [];
	zScoreTableCols: Array<any> = [];
	CAGRTableCols: Array<any> = [];
	zScoreTableData: Array<any> = [];
	CAGRTableData: Array<any> = [];
	avgCharDataValues = [];
	tempArry: Array<any> = [];
	tempArry1: Array<any> = [];

	handleDynamicColor: Array<any> = [];
	chartDataforColoring: Array<any> = [];
	financialSimpleAccntsTableCols: Array<any> = [];
	financialSimpleAccntsRowHeader: Array<any> = [];
	simpleAccntsRowHeaderToShow: Array<any> = ['netWorth', 'numberOfEmplyees', 'numberOfMonths', 'profitAfterTax', 'profitBeforeTax', 'totalAssets', 'totalCurrentAssets', 'totalCurrentLiabilities', 'totalLiabilities', 'totalShareholdersEquity', 'turnover'];
	financialSimpleAccntsTableData: Array<any> = [];

	rowGroupMetaData: any;
	showTable: boolean = false;
	showSimpleAccntsTable: boolean = false;
	// showRatioTable: boolean = false;
	showUkgaapIfrsTable: boolean = false;
	industryType: string;
	latestYear: string;
	selectedFinTabGroup: string;
	windowInnerWidth: number;
	hasZscoreData: boolean = false;
	hasCAGRData: boolean = false;
	hasFinancialRatios: boolean = false;

	ZData: any;
	industryLabel: any;
	ZscorePieChart: any;
	pieChartOptions: any;
	zScoringChartOptions: any;
	cagrScoringChartOptions: any;
	ukGaapIfrsInsuranceFinancialTableCols: Array<any> = [];
	ukGaapIfrsInsuranceFinancialRowHeader: Array<any> = [];
	ukGaapIfrsInsuranceFinancialTableData: Array<any> = [];
	hasUkgaapIfrsInsuranceFinancial: boolean = false;
	selectedGlobalCurrency: string = 'GBP';
	zScoreChartData = {
		Z1: {},
		Z2: {},
		Z3: {},
		Z4: {},
		Z5: {},
	}

	zMainScoreChartData = {
		Z: {}
	}
	cagrChartData = {
		CAGR: {}
	}

	CAGRmaxValue: number;
	maxValue: number = 0;

	industryList: Array<object> = [
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
		private commonService: CommonServiceService,
		private activeRoute: ActivatedRoute,
		private titlecasePipe: TitleCasePipe,
		private decimalPipe: DecimalPipe,
		private router: Router,
		private toCurrencyPipe: CurrencyPipe,
		private sharedLoaderService: SharedLoaderService
	) { }

	ngOnInit() {
		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';
		this.windowInnerWidth = window.innerWidth;
		if (this.activeRoute.snapshot.params['companyName']) {
			this.companyName = this.activeRoute.snapshot.params['companyName'];
		} else {
			this.companyName = this.titlecasePipe.transform(this.requiredCompanyName);
		}

		this.pieChartOptions = {
			onClick: (event, elements, chart) => {
				onPieChartClick(event.native, elements, chart);
			},
			onHover: (event, elements) => {
				event.native.target.style.cursor = elements[0] ? "pointer" : "default";
			},
			tooltips: {
				enabled: true
			},
			plugins: {
				datalabels: {
					// display: true,
					display: (context) => {
						let dataset = context.dataset;
						let value = dataset.data[context.dataIndex];
						return value;
					},
					backgroundColor: function(context) {
						return context.dataset.backgroundColor;
					},
					// display: true,
					color: '#fff',
					offset: 0,
					padding: 0,
					font: {
						family: 'Roboto',
						weight: 'bold'
					},
					formatter: ( value ) => {
						value = this.toCurrencyPipe.transform( value, '', '', '1.0-2' );
						return value;
					}
				},
				legend: {
					display: false
				},
				tooltip: {
					enabled: false
				},
			},
			// hover: {
			// 	onHover: (event, elements) => {
			// 		event.target.style.cursor = elements[0] ? "pointer" : "default";
			// 	}
			// },

			// onClick: (event, elements) => {
			// 	onPieChartClick(event, elements)
			// }


		};

		let _this = this;
		function onPieChartClick(event, elements, chart?) {
			let chartdetails = chart.config.data;
			
			for (let industry of _this.industryList) {
				if (industry['value'] == _this.industryType) {
					_this.industryLabel = industry['label']
				}
			}
			let selectedYear = event.target.parentElement.parentElement.previousSibling.innerText;
			let label: UIChart;
			label = chartdetails.labels[elements[0].index].toString().toLowerCase();
			let filterDataArray = [
				{
					chip_group: "Status",
					chip_values: [
						"live"
					]
				},
				{
					chip_group: "SIC Codes",
					chip_values: [
						_this.industryLabel
					],
					chip_industry_sic_codes: [
						_this.industryType
					]
				},
				{
					chip_group: "Z Score",
					chip_values: [
						label
					]
				},
				{
					chip_group: "Z Score (Year)",
					chip_values: [
						selectedYear
					]
				}
			]

			let urlStr: string = String(_this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(filterDataArray) } }));

			window.open(urlStr, '_blank');
		}

		this.userDetails = this.userAuthService?.getUserInfo();

		// this.companyName = this.activeRoute.snapshot.params['companyName'];

		// this.seoService.setPageTitle (this.title);
		// this.seoService.setDescription( this.description );
		// this.seoService.setkeywords( this.keywords );
		// this.seoService.setRobots (this.robots );

		if (this.financeStatutoryAccounts && this.showFinancialTableInput) {

			this.showRatiosTableInput = false;

			this.getFinancialData();

		}

		if (this.financialSimpleAccntsData && this.showRatiosTableInput) {

			this.showFinancialTableInput = false;

			this.getSimplifiedAccountsData(this.financialSimpleAccntsData['finOverviewDataValues'][0]);

			if (this.financialSimpleAccntsData['finRatioDataValues']) {

				this.getFinancialRatioData(this.financialSimpleAccntsData['finRatioDataValues'][0]);
				this.hasFinancialRatios = true;

			} else {
				this.hasFinancialRatios = false;
			}

		}

		if ( this.ukgaapIfrsInsuranceFinancialData && this.showUkgaapIfrsInsuranceFinancialInput ) {
			this.getUkgaapIfrsInsuranceFinancialData(this.ukgaapIfrsInsuranceFinancialData["ukGaapIfrsInsuranceFinancialDataValues"][0]);
			this.hasUkgaapIfrsInsuranceFinancial = true;
		} else {
			this.hasUkgaapIfrsInsuranceFinancial = false;
		}

		this.getZScoreData();
		this.getCagrData();

		this.zScoringChartOptions = {
			// layout: {
			// 	padding: { top: 18, left: 10, right: 10 }
			// },			
			barPercentage: 0.4,			
			scales: {
				y: {
					beginAtZero: true,
					ticks: {
						font: {
							size: 12,
							family: 'Roboto',
							style: 'normal',
							weight: 'bold'
						},
						color: '#000',			
						padding: 10,
						precision: 0
					},
					grid: {
						color: context => context.index == 0 ? '#000000' : 'rgba(0, 0, 0, 0.2)'
					}
				},
				x: {
					ticks: {
						font: {
							size: 12,
							family: 'Roboto',
							style: 'normal',
							weight: 'bold'
						},
						color: '#000',
						padding: 10
					},
					grid: {
						color: context => context.index == 0 ? '#000000' : 'rgba(0, 0, 0, 0.2)'
					}
				},
			},
			// tooltips: {
			// 	enabled: true,
			// },
			plugins: {
				datalabels: {
					display: true,
					align: 'end',
					anchor: 'end',
					font: {
						size: 14,
						weight: 'bold'
					}
				},
				legend: {
					display: false,
					style: 'bold',
					color: '#000000',
					labels: {
						fontColor: '#000000',
						fontStyle: "bold",
					},
				},
				title: {
					fontFamily: 'Roboto'
				},
			}
		}

		this.cagrScoringChartOptions = {

			barPercentage: 0.5,
			
			title: {
				fontFamily: 'Roboto'
			},
			scales: {
				y: {
					beginAtZero: true,
					ticks: {
						font:{
							size: 12,
							family: 'Roboto',
							style: 'normal',
							weight: 'bold'
						},
						color: '#000',
						padding: 10,
						precision: 0,
					},
					grid: {
						color: context => context.tick.label == 0 ? '#000000' : 'rgba(0, 0, 0, 0.2)'
					}
				},
				x: {
					ticks: {
						font:{
							size: 12,
							family: 'Roboto',
							style: 'normal',
							weight: 'bold'
						},
						color: '#000'
					}
				}
			},
			// tooltips: {
			// 	enabled: true
			// },
			plugins: {
				datalabels: {
					display: true,
					align: 'end',
					anchor: 'end',
					offset: 1,
					font: {
						size: 14,
						weight: 'bold'
					},
					padding: 1,
				},
				legend: {
					display: false,
					style: 'bold',
					color: '#000000',
					labels: {
						fontColor: '#000000',
						fontStyle: "bold",
					},
				},
			}
		}


		this.ZscorePieChart = {
			labels: ['A', 'B', 'C'],
			datasets: [
				{
					data: [300, 50, 100],
					backgroundColor: [
						// "#ff4500ab",
						"#ff4500",
						"#808080",
						// "#008000b8"
						"#008000"
					],
					hoverBackgroundColor: [
						// "#ff4500ab",
						"#ff4500",
						"#808080",
						// "#008000b8"
						"#008000"
					]
				}]
		};

	}


	getZScoreData() {
		if (this.zScoreData) {
			this.hasZscoreData = true;
			this.zScoreTableData = this.zScoreData.results;
			const ids = this.zScoreTableData.map(o => o.YEAR)
			const filtered = this.zScoreTableData.filter(({ YEAR }, index) => !ids.includes(YEAR, index + 1))
			this.zScoreTableData = filtered;

			if (this.zScoreTableData.length > 5) {
				this.zScoreTableData.sort((a,b) => a.YEAR - b.YEAR)
				this.zScoreTableData = this.zScoreTableData.filter((val, i) => i > (this.zScoreTableData.length - 6));
			}

			let temppiechart: Array<any> = [];
			temppiechart = this.zScoreTableData;

			if (this.zScoreData.results[0]) {

				if (this.zScoreData.results[0].industryType !== (undefined || null || "")) {
					this.industryType = this.zScoreData.results[0].industryType;
				}
			}

			for (let key in this.zScoreTableData[0]) {
				let excludeKeys = ['_id', 'companyRegistrationNumber', 'bussinessName', 'YEAR', 'Z1', 'Z2', 'Z3', 'Z4', 'Z5', 'AVG_YEAR', 'AVG_INDUSTRY_TYPE', 'industryType', 'AVG_ZSCORE'];

				if (!excludeKeys.includes(key)) {
					this.zScoreRowHeader.push({ keyName: key, keyLabel: key.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1).join(' ').replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); }) });
				}
			}

			var temp = [];
			var max: number;

			for (let row of this.zScoreTableData) {
				temp.push(row.Z);
				max = Math.max(...temp);
				this.maxValue = max + 10;

				if (max < 2) {
					this.maxValue = max + 0.5;
				} else if (max < 5) {
					this.maxValue = max + 2;
				} else if (max > 5 && max < 20) {
					this.maxValue = max + 5;
				} else if (max > 30) {
					this.maxValue = max + 25;
				}
				else if (max > 500) {
					this.maxValue = max + 200;
				}


				this.zScoreTableCols.push({ field: '', header: row.YEAR, minWidth: '160px', maxWidth: '160px', textAlign: 'right', responsiveDisplay: true });
			}
			this.createZscoreChart(this.zScoreTableData);
		}
	}

	getCagrData() {
		if (this.CAGRdata) {
			this.hasCAGRData = true;
			this.CAGRTableData = this.CAGRdata.results;

			const ids = this.CAGRTableData.map(o => o.YEAR)
			const filtered = this.CAGRTableData.filter(({ YEAR }, index) => !ids.includes(YEAR, index + 1))

			this.CAGRTableData = filtered;

			if (this.CAGRTableData.length > 5) {
				this.CAGRTableData.sort((a,b) => a.YEAR - b.YEAR)
				this.CAGRTableData = this.CAGRTableData.filter((val, i) => i > (this.CAGRTableData.length - 6));
			}
			if (this.CAGRdata.results[0]) {
				if (this.CAGRdata.results[0].industryType !== undefined) {
					this.industryType = this.CAGRdata.results[0].industryType;
				}
			}

			for (let key in this.CAGRTableData[0]) {
				let excludeKeys = ['_id', 'companyRegistrationNumber', 'bussinessName', 'YEAR', 'industryType', 'AVG_YEAR', 'AVG_INDUSTRY_TYPE', 'Istar_CAGR', 'AVG_CAGR'];

				if (!excludeKeys.includes(key)) {
					this.CAGRheader.push({ keyName: key, keyLabel: key.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1).join(' ').replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); }) });
				}
			}

			const sorter = (a, b) => {
				if (a.YEAR !== b.YEAR) {
					return a.YEAR - b.YEAR;
				} else {
					return this.CAGRTableData.indexOf(a.YEAR) - this.CAGRTableData.indexOf(b.YEAR);
				};
			};

			this.CAGRTableData.sort(sorter);

			for (let row of this.CAGRTableData) {

				this.CAGRTableCols.push({ field: '', header: row.YEAR, minWidth: '150px', maxWidth: '150px', textAlign: 'right', responsiveDisplay: true });
			}
			this.createChartData(this.CAGRTableData);
		}
	}

	returnZero() {
		return 0;
	}

	createChartData(inputData: Array<any>) {

		if (inputData) {
			let chartLabels = [], chartDataValues = [], CAGRtemp = [];

			if (inputData.length > 4) {
				inputData = inputData.filter((val, i) => i > (inputData.length - 5));
			}

			for (let i in inputData) {

				if (!chartLabels.includes(inputData[i].YEAR)) {
					chartLabels.push(inputData[i].YEAR);
				}
			}

			for (let CAGRkey of Object.keys(this.cagrChartData)) {

				chartDataValues = [];
				for (let i in inputData) {

					if (+i < 4) {
						CAGRtemp.push(inputData[i].CAGR);
                        let max = Math.max(...CAGRtemp);
                        this.CAGRmaxValue = max + 2;
						chartDataValues.push(this.decimalPipe.transform(inputData[i][CAGRkey], '1.0-2'));
					}
				}

				this.cagrChartData[CAGRkey] = {
					labels: chartLabels,
					datasets: [
						{
							label: 'This Company',
							data: chartDataValues,
							backgroundColor: this.getRandomColorforCAGRchart(inputData),
						},
					]
				}
			}
		}
	}	

	getRandomColorforCAGRchart(colorForCAGRdata) {

		let color = [];
		
		colorForCAGRdata.forEach(element => {
			
			if (element['CAGR'] < element['AVG_CAGR']) {
			  	color.push('#ff4500');
			}
			else if (element['CAGR'] > element['AVG_CAGR']) {
		 		color.push('#1ab394');
			}

		});

		return color;
	}

	createZscoreChart(inputData) {
		let chartLabels = [], chartDataValues = [], chartDataValues2 = [];

		if (inputData.length > 4) {
			inputData = inputData.filter((val, i) => i > (inputData.length - 5));
		}
		for (let i in inputData) {
			if (!chartLabels.includes(inputData[i].YEAR)) {
				chartLabels.push(inputData[i].YEAR);
			}
		}

		chartDataValues = [], chartDataValues2 = [];

		for (let i in inputData) {
			if (+i < 4) {
				chartDataValues.push((inputData[i]['Z']).toFixed(2));
				// chartDataValues2.push((inputData[i]['AVG_ZSCORE']).toFixed(2));
			}
		}

		this.handleDynamicColor = chartDataValues;

		this.ZData = {
			labels: chartLabels,
			datasets: [
				{
					label: 'This company',
					backgroundColor: this.getRandomColorHex(),
					data: chartDataValues,
				},
				// {
				//     label: 'AVERAGE ZSCORE',
				//     backgroundColor: '#5b9bd5',
				//     data: chartDataValues2
				// },
			]
		};
	}

	getRandomColorHex() {
		let color = [];
		this.handleDynamicColor.forEach(element => {
			if (element <= 1.8) {
				color.push('#ff4500');
			}
			else if ((element >= 1.8) && (element < 3)) {
				color.push('#808080');
			}
			else if (element > 3) {
				color.push('#008000');
			}
		});
		return color;
	}
    @HostListener('window:resize', ['$event'])
	onResize() {
		this.windowInnerWidth = window.innerWidth;
	}

	typeOfData(val) {
		return this.commonService.typeOfData(val);
	}

	// For Financial Table Data Start

	getFinancialData() {

		let uniqFinancialKeys = [], tempfinancialTableGroups = [];

		for (let tempData of this.financeStatutoryAccounts) {
			if (tempData.group === null || tempData.group === '') {
				tempData.group = 'Miscellaneous';
			}
		}

		// First Column For Key Names
		this.financialTableCols.push({ field: 'group', header: 'Group', minWidth: '220px', maxWidth: '220px', textAlign: 'left', responsiveDisplay: false, display: 'none' });
		this.financialTableCols.push({ field: 'keyToShowOnScreen', header: '', minWidth: '220px', maxWidth: 'none', textAlign: 'left', responsiveDisplay: true });

		for (let finDataKeys of this.financeStatutoryAccounts) {

			if (!tempfinancialTableGroups.includes(finDataKeys.group)) {
				tempfinancialTableGroups.push(finDataKeys.group);
			}

			for (let finObjDataKeys in finDataKeys) {
				if (!this.financialKeysToIgnore.includes(finObjDataKeys) && finObjDataKeys !== 'group' && finObjDataKeys !== 'keyToShowOnScreen' && !uniqFinancialKeys.includes(finObjDataKeys)) {

					uniqFinancialKeys.push(finObjDataKeys);

					if (finObjDataKeys.split('_').includes('percentage')) {
						this.financialTableCols.push({ field: finObjDataKeys, header: '%', minWidth: '130px', maxWidth: '130px', textAlign: 'right', responsiveDisplay: false });
					} else {
						this.financialTableCols.push({ field: finObjDataKeys, header: finObjDataKeys, minWidth: '160px', maxWidth: '160px', textAlign: 'right', responsiveDisplay: false });
					}
				}
			}

		}

		this.financialTableGroups = this.commonService.arrayElementPositionChange(tempfinancialTableGroups, tempfinancialTableGroups.length - 1, 1);

		this.selectedFinTabGroup = this.financialTableGroups[0];

		this.financialTableCols = this.financialTableCols.sort((a, b) => {
			let firstObj = a.field.split('_').reverse().splice(0, 1),
				secondObj = b.field.split('_').reverse().splice(0, 1);

			return secondObj - firstObj;
		});

		if (this.financialTableCols.length > 2) {
			this.financialTableCols[2].responsiveDisplay = true;
		}

		if (this.financialTableCols.length > 3) {
			this.financialTableCols[3].responsiveDisplay = true;
		}

	}

	// For Financial Table Data End

	// For Financial Ratio Table Data Start

	getSimplifiedAccountsData(dataObj) {
		let excludeKeys = ['id', 'yearStartDate', 'yearEndDate'];

		this.financialSimpleAccntsTableData = JSON.parse(JSON.stringify(dataObj));
		// this.financialSimpleAccntsTableData = dataObj;

		for (let key in this.financialSimpleAccntsTableData[0]) {
			if (!excludeKeys.includes(key)) {
				this.financialSimpleAccntsRowHeader.push({ keyName: key, keyLabel: key.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1).join(' ').replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); }) });
			}
		}

		this.financialSimpleAccntsTableData = this.financialSimpleAccntsTableData.sort((a, b) => {
			let prevDate: any = this.commonService.changeToDate(a.yearEndDate),
				newDate: any = this.commonService.changeToDate(b.yearEndDate);

			return newDate - prevDate;
		});

		for (let row of this.financialSimpleAccntsTableData) {
			let finYear = new Date(this.commonService.changeToDate(row.yearEndDate)).getFullYear();

			this.financialSimpleAccntsTableCols.push({ field: '', header: finYear, minWidth: '200px', maxWidth: '200px', textAlign: 'right' });
		}

		this.showSimpleAccntsTable = true;
	}

	// For Financial Ratio Table Data End

	// For Financial Ratio Table Data Start

	getFinancialRatioData(dataObj) {

		let excludeKeys = ['id', 'yearStartDate', 'yearEndDate', 'latestYearBoolean'];

		this.financialRatioTableData = JSON.parse(JSON.stringify(dataObj));

		for (let key in this.financialRatioTableData[0]) {

			if (!excludeKeys.includes(key)) {
				this.financialRatioRowHeader.push({ keyName: key, keyLabel: key.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1).join(' ').replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); }) });
			}
		}

		this.financialRatioTableData = this.financialRatioTableData.sort((a, b) => {
			let prevDate: any = this.commonService.changeToDate(a.yearEndDate),
				newDate: any = this.commonService.changeToDate(b.yearEndDate);

			return newDate - prevDate;
		});

		for (let row of this.financialRatioTableData) {
			let finYear = new Date(this.commonService.changeToDate(row.yearEndDate)).getFullYear();

			this.financialRatioTableCols.push({ field: '', header: finYear, minWidth: '200px', maxWidth: '200px', textAlign: 'right', responsiveDisplay: false });
		}

		if (this.financialRatioTableCols.length > 1) {
			this.financialRatioTableCols[1].responsiveDisplay = true;
		} else if (this.financialRatioTableCols.length == 1) {
			this.financialRatioTableCols[0].responsiveDisplay = true;
		}

		// this.showRatioTable = true;
		this.sharedLoaderService.showLoader();
	}

	// For Financial Ratio Table Data End

	exportTableToCSV(tableDataValues, type) {

		if ( ( ( [ this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Compliance_Plan'] ].includes( this.userDetails?.planId ) && this.userDetails?.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) ) {
			
			if ( this.userAuthService.hasAddOnPermission('defaultExportFeature') ) {
				if (type == 'allYearsData') {
					for (let column of tableDataValues.columns) {
						if (column.field == 'keyToShowOnScreen') {
							column.header = 'Key Names';
						}
					}

					tableDataValues.exportCSV();

					for (let column of tableDataValues.columns) {
						if (column.field == 'keyToShowOnScreen') {
							column.header = '';
						}
					}
				}
			}

		} else {
			event.preventDefault();
			event.stopPropagation();
			this.showUpgradePlanDialog = true;
		}
		
	}
	
	financialRatioDataExportToCsv(type) {

		if ( ( ( [ this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Compliance_Plan'] ].includes( this.userDetails?.planId ) && this.userDetails?.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) ) {

			if ( this.userAuthService.hasAddOnPermission('defaultExportFeature') ) {
				if (type === 'allYearsData') {
					var ratioData = [];
					let excludeKeys = ['companyRegistrationNumber'];
					for (let key of this.financialRatioRowHeader) {
						if (!excludeKeys.includes(key.keyName)) {

							let obj = {};
							obj["Group"] = key.keyLabel;
							for (let row of this.financialRatioTableData) {

								for (let tempkey in row) {

									if (tempkey == key.keyName) {

										let finYear = new Date(this.commonService.changeToDate(row.yearEndDate)).getFullYear() + " ";
										obj[finYear] = row[tempkey];
										obj[finYear] = row[tempkey] != null ? row[tempkey] !== "" ? row[tempkey] : "0" : "0";
									}
								}

							}
							ratioData.push(obj);
						}

					}
					const options = {
						fieldSeparator: ',',
						quoteStrings: true,
						decimalSeparator: '.',
						filename: 'DG_' + this.companyName + '-Ratios',
						useTextFile: false,
						useBom: true,
						useKeysAsHeaders: true
					};

					const csvExporter = mkConfig(options);

					if (ratioData.length > 0) {
						const csv = generateCsv(  csvExporter )( ratioData )
						download( csvExporter )( csv )
					}

				} else {
					var ratioData = [];
					let excludeKeys = ['companyRegistrationNumber'], csvHeaders = [], columnHeader = [];;

					for (let key of this.ukGaapIfrsInsuranceFinancialRowHeader) {
						
						if (!excludeKeys.includes(key.keyName) && key.keyName.split('_percentage').length != 2) {

							let obj = {};
							obj["Group"] = key.keyLabel;
							
							for (let row of this.ukGaapIfrsInsuranceFinancialTableData) {
								
								for (let tempkey in row) {
									
									if ( tempkey == 'accountStatus' ) {
										row[tempkey] = this.titlecasePipe.transform(row[tempkey])
									}
										
									if (tempkey == key.keyName) {

										let finYear = new Date(this.commonService.changeToDate(row.yearEndDate)).getFullYear() + " ";
										// obj[finYear] = row[tempkey];
										obj[finYear] = row[tempkey] != null ? row[tempkey] !== "" ? row[tempkey] : "0" : "0";

										if ( Object.keys(obj).length < this.ukGaapIfrsInsuranceFinancialTableData.length + 8 ) {

											obj[finYear + '%'] = row[tempkey + '_percentage'] != null ? row[tempkey + '_percentage'] !== "" ? row[tempkey + '_percentage'] : "" : "";
										}

									}
								}

							}

							csvHeaders = [];
							columnHeader = [];

							for ( let header in obj ) {
								if ( header.includes('%') ) {
									csvHeaders.push( '%' );
									columnHeader.push( { key: header, displayLabel: '%' } )
								} else {
									csvHeaders.push( header );
									columnHeader.push( { key: header, displayLabel: header } )
								}
							}
							
							ratioData.push(obj);
							csvHeaders.slice(-1).includes('%') ? csvHeaders.pop() : csvHeaders;
						}

					}

					const options = {
						fieldSeparator: ',',
						quoteStrings: true,
						decimalSeparator: '.',
						showLabels: true,
						filename: 'DG_' + this.companyName + '-' + this.UkgaapHeadingName,
						useTextFile: false,
						useBom: true,
						useKeysAsHeaders: false,
						columnHeaders: columnHeader

					};

					const csvExporter = mkConfig(options);
					if (ratioData.length > 0) {
						const csv = generateCsv(  csvExporter )( ratioData )
						download( csvExporter )( csv )
						
						// csvExporter.generateCsv(ratioData);
					}
				}
			}
		} else {
			
			event.preventDefault();
			event.stopPropagation();
			this.showUpgradePlanDialog = true;
			
		}

	}

	// For Mobile Responsiveness
	switchFinancialTabsData(finDataGrp) {
		this.selectedFinTabGroup = finDataGrp;
	}

	switchFinancialYear(colsData, toIndex) {
		let activeColIndex = 0;

		for (let colKey in colsData) {
			if (+colKey >= 2 && colsData[colKey].responsiveDisplay) {
				activeColIndex = +colKey;
				break;
			}
		}

		// Reseting 'responsiveDisplay' property
		for (let col of colsData) {
			if (!['group', 'keyToShowOnScreen'].includes(col.field)) {
				col.responsiveDisplay = false;
			}
		}
		// Reseting 'responsiveDisplay' property end

		if (toIndex == 'first') {
			colsData[2].responsiveDisplay = true;
			colsData[3].responsiveDisplay = true;
		}

		if (toIndex == 'prev') {
			if (activeColIndex > 2) {
				colsData[activeColIndex - 1].responsiveDisplay = true;
				colsData[activeColIndex - 2].responsiveDisplay = true;
			} else if (activeColIndex == 2) {
				colsData[2].responsiveDisplay = true;
				colsData[3].responsiveDisplay = true;
			}
		}

		if (toIndex == 'next') {
			if (!(activeColIndex > colsData.length) && activeColIndex !== colsData.length - 1) {
				colsData[activeColIndex + 2].responsiveDisplay = true;
				colsData[activeColIndex + 3].responsiveDisplay = true;
			} else if (activeColIndex == colsData.length - 1) {
				colsData[activeColIndex].responsiveDisplay = true;
			}
		}

		if (toIndex == 'last') {
			colsData[colsData.length - 1].responsiveDisplay = true;
		}

	}

	switchFinancialRatiosYear(colsData, toIndex) {
		let activeColIndex = 0;

		for (let colKey in colsData) {
			if (+colKey >= 2 && colsData[colKey].responsiveDisplay) {
				activeColIndex = +colKey;
				break;
			}
		}

		// Reseting 'responsiveDisplay' property
		for (let col of colsData) {
			col.responsiveDisplay = false;
		}
		// Reseting 'responsiveDisplay' property end

		if (toIndex == 'first') {
			colsData[2].responsiveDisplay = true;
		}

		if (toIndex == 'prev') {
			if (activeColIndex > 2) {
				colsData[activeColIndex - 1].responsiveDisplay = true;
			} else if (activeColIndex == 2) {
				colsData[2].responsiveDisplay = true;
			}
		}

		if (toIndex == 'next') {
			if (!(activeColIndex > colsData.length) && activeColIndex !== colsData.length - 1) {
				colsData[activeColIndex + 1].responsiveDisplay = true;
			} else if (activeColIndex == colsData.length - 1) {
				colsData[activeColIndex].responsiveDisplay = true;
			}
		}

		if (toIndex == 'last') {
			colsData[colsData.length - 1].responsiveDisplay = true;
		}

	}

	getUkgaapIfrsInsuranceFinancialData(dataObj) {
		
		let excludeKeys = ['id', 'yearStartDate', 'yearEndDate', 'latestYearBoolean'];		

		this.ukGaapIfrsInsuranceFinancialTableData = JSON.parse(JSON.stringify(dataObj));
		
		for (let key in this.ukGaapIfrsInsuranceFinancialTableData[0]) {
			
			if ( !excludeKeys.includes(key) && key.split('_percentage').length != 2) {
				this.ukGaapIfrsInsuranceFinancialRowHeader.push({ keyName: key, keyLabel: key.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1).join(' ').replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); }) });
			}			
		}

		this.ukGaapIfrsInsuranceFinancialTableData = this.ukGaapIfrsInsuranceFinancialTableData.sort((a, b) => {
			let prevDate: any = this.commonService.changeToDate(a.yearEndDate),
				newDate: any = this.commonService.changeToDate(b.yearEndDate);

			return newDate - prevDate;
		});

		for (let rowIndex in this.ukGaapIfrsInsuranceFinancialTableData) {
			
			let finYear = new Date(this.commonService.changeToDate(this.ukGaapIfrsInsuranceFinancialTableData[ rowIndex ].yearEndDate)).getFullYear();

			this.ukGaapIfrsInsuranceFinancialTableCols.push({ field: '', header: finYear, minWidth: '160px', maxWidth: '160px', textAlign: 'right', responsiveDisplay: false });
		}

		if (this.ukGaapIfrsInsuranceFinancialTableCols.length > 1) {
			this.ukGaapIfrsInsuranceFinancialTableCols[1].responsiveDisplay = true;
		} else if (this.ukGaapIfrsInsuranceFinancialTableCols.length == 1) {
			this.ukGaapIfrsInsuranceFinancialTableCols[0].responsiveDisplay = true;
		}
		this.showUkgaapIfrsTable = true;
	}

}
