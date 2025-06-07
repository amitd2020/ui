import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { CompaniesEligibleForDataWithoutLogin } from 'src/environments/environment';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-financials-info',
	templateUrl: './financials-info.component.html',
	styleUrls: ['./financials-info.component.scss']
})
export class FinancialsInfoComponent implements OnInit {

	isLoggedIn: boolean = false;
	currentPlan: unknown;
	companyData: any;

	finRatioChartData: any;
	financeData: any;
	cashArray: any;
	totalAssetsArray: any;
	turnoverArray: any;
	latestFinancialYear: any;
	creditorsArray: any;
	financeDataSorted: any;
	financialData: any;
	finstatutoryChartData: any;
	companyNumber: any;

	finRatioDataValues: Array<any>;
	selectedGlobalCurrency: string = 'GBP';

	cashData = [];
	financialYears = [];
	financialKeys = [];
	creditorsData = [];
	turnoverData = [];
	totalAssetsData = [];
	creditorDaysChartData = [];
	currentRatioChartData = [];
	totalDebtRatioChartData = [];
	equityRatioChartData = [];


	estimatedTurnoverBoolean: Boolean = false;
	hasFinancailRatios: boolean = false;

	companiesEligibleForDataWithoutLogin = CompaniesEligibleForDataWithoutLogin;

	chartOptions = {};
	chartOptions2 = {};
	finRatioTabChartData: any = {
		chartData1: {},
		chartData2: {}
	};
	financialCardDatasets: any = {
		statutoryAccounts: {
			estimated_turnover: {},
			estimated_turnover_AI: {},
			turnover: {},
			totalAssets: {},
			totalLiabilities: {},
			netWorth: {},
			profitBeforeTax: {},
			EBITDA: {},
			numberOfEmployees: {}
		}
	};

	cash = { value: undefined, status: undefined, percentage: undefined };
	totalAssets = { value: undefined, status: undefined, percentage: undefined };
	turnover = { value: undefined, status: undefined, percentage: undefined };
	creditors = { value: undefined, status: undefined, percentage: undefined };
	lineData: { labels: any; datasets: { label: string; data: any; fill: boolean; borderColor: string; }[]; };

	constructor(
		public userAuthService: UserAuthService,
		private commonService: CommonServiceService,
		private toNumberSuffix: NumberSuffixPipe,
		private toCurrencyPipe: CurrencyPipe,
        private dataCommunicatorService: DataCommunicatorService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit() {

		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';
		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => this.isLoggedIn = loggedIn );
		this.dataCommunicatorService.$dataCommunicatorVar.pipe( take(1) ).subscribe( ( res: any ) => this.companyData = res );
		this.companyNumber = this.companyData['companyRegistrationNumber'];
		if ( this.isLoggedIn || ( !this.isLoggedIn && this.companiesEligibleForDataWithoutLogin.includes( this.companyData.companyRegistrationNumber ) ) ) {

			this.currentPlan = this.userAuthService?.getUserInfo('planId');

			this.getFinancialData();
			
			if ( this.companyData['hasFinances'] && this.companyData['statutoryAccounts'] ) {
	
				let data = this.companyData.statutoryAccounts;
	
				let overviewFinancialObj = this.getFinancialOverviewDetails(data);
	
				this.finstatutoryChartData = overviewFinancialObj.chartData;
	
				if (this.companyData.financialRatios && this.companyData.financialRatios.length > 0) {
					this.getFinancialRatioData(this.companyData.financialRatios);
					this.finRatioDataValues = [this.finRatioDataValues];
					this.hasFinancailRatios = true;
				} else {
					this.finRatioDataValues = undefined;
					this.hasFinancailRatios = false;
				}
			}
	
			this.chartOptions = {
				tension: 0.4,
				scales: {
					x: {
						ticks: {
							font: {
								family: 'Roboto',
							},
							padding: 8
						}
					},
					y: {
						ticks: {
							font: {
								family: 'Roboto',
							},
							padding: 8,
							callback: (label, index, labels) => {
								return this.toNumberSuffix.transform(label, 0, this.selectedGlobalCurrency);
							}
						}
					}
				},
				
				plugins: {
					datalabels: {
						display: false
					},
					legend: {
						labels: {
							fontFamily: 'Roboto',
							padding: 15
						}
					},
					title: {
						fontFamily: 'Roboto',
					},
					tooltips: {
						titleFontFamily: 'Roboto',
						bodyFontFamily: 'Roboto',
						callbacks: {
							label: (tooltipItem, dataset) => {
								return `${dataset.datasets[tooltipItem.datasetIndex].label}: ${this.toCurrencyPipe.transform(tooltipItem.yLabel, this.selectedGlobalCurrency, 'symbol', '1.0-0')}`;
							}
						}
					},
				}
			}
	
			this.chartOptions2 = {
				legend: this.chartOptions['legend'],
				title: this.chartOptions['title'],
				tension: 0.4,
				scales: {
					x: {
						ticks: {
							font: {
								family: 'Roboto',
							},
							padding: 8
						}
					},
					y: {
						beginAtZero: true,
						ticks: {
							font: {
								family: 'Roboto',
							},
							padding: 8,
							callback: (label, index, labels) => {
								return Intl.NumberFormat().format(label);
							}
						}
					}
				},
				plugins: this.chartOptions['plugins']
			}

		}

		if (!this.companyData['has_estimated_turnover_ml']) {
            delete this.financialCardDatasets['statutoryAccounts'][
                'estimated_turnover_AI'
            ];
        }

		Object.keys(this.financialCardDatasets).map(parentKey => {

			Object.keys(this.financialCardDatasets[parentKey]).map(async childKey => {

				const finDataAll = await this.companyData[parentKey];
				if (finDataAll) finDataAll.sort((a, b) => a['yearEndDate'].split('/')[2] - b['yearEndDate'].split('/')[2])

				if (childKey !== 'revenue' && finDataAll) {

					if (finDataAll[finDataAll.length - 1]['turnover'] === 0 || finDataAll[finDataAll.length - 1]['turnover'] === null) {
						delete this.financialCardDatasets['statutoryAccounts']['turnover'];
					} else {
						delete this.financialCardDatasets['statutoryAccounts']['estimated_turnover'];
					}

					// this.overviewNoOfEmployeesData = finDataAll[finDataAll.length - 1]['numberOfEmployees'] ? finDataAll[finDataAll.length - 1]['numberOfEmployees'] : 0;

					let latestYearValue = finDataAll.length ? finDataAll[finDataAll.length - 1][childKey] ? parseFloat(finDataAll[finDataAll.length - 1][childKey]) : 0 : 0,

						previousYearValue = finDataAll.length > 1 ? finDataAll[finDataAll.length - 2][childKey] ? parseFloat(finDataAll[finDataAll.length - 2][childKey]) : 0 : 0;

					this.financialCardDatasets[parentKey][childKey] = {
						latestYearValue: latestYearValue,
						previousYearValue: previousYearValue,
						diffPercentageValue: this.checkPercentageDiff(latestYearValue, previousYearValue),
						chartDatasets: finDataAll && finDataAll.length ? this.createMiniLineChartDataset(finDataAll, childKey) : 0,
						valueType: this.selectedGlobalCurrency
					}

				}

			});

		});


	}

	createMiniLineChartDataset(inputValues, dataKey) {

		let outputDataset,
			colorRGBForChartPositive = '21 195 129',
			colorRGBForChartNegative = '176 0 32',
			barBgColors = [],
			chartLabels = inputValues.map(val => val['yearEndDate'].split('/')[2]),
			chartData = inputValues.map(val => val[dataKey] ? parseFloat(val[dataKey]) : 0);

		outputDataset = {
			labels: chartLabels.splice(-5),
			datasets: [
				{
					title: dataKey,
					data: chartData.splice(-5),
					backgroundColor: [],
					hoverBackgroundColor: [],
					borderWidth: 1,
					borderColor: [],
					hoverBorderColor: []
				}
			]
		}

		barBgColors = [];

		for (let { value, cagr } of inputValues) {
			if ((value || cagr) < 0) {
				barBgColors.push(`rgb( ${colorRGBForChartNegative} / 50% )`);
			} else {
				barBgColors.push(`rgb( ${colorRGBForChartPositive} / 50% )`);
			}
		}

		outputDataset.datasets[0]['backgroundColor'] = barBgColors;
		outputDataset.datasets[0]['hoverBackgroundColor'] = barBgColors.map(val => val.replace('/ 50%', ''));
		outputDataset.datasets[0]['borderColor'] = barBgColors.map(val => val.replace('/ 50%', ''));
		outputDataset.datasets[0]['hoverBorderColor'] = barBgColors.map(val => val.replace('/ 50%', ''));

		return outputDataset;
	}

	checkPercentageDiff(latestYearValue, previousYearValue): any {

		let increased = { increased: 0 },
			decreased = { decreased: 0 },
			equal = { equal: 0 };

		if (previousYearValue) {

			if (latestYearValue > previousYearValue) {
				increased.increased = ((latestYearValue - previousYearValue) / previousYearValue) * 100;
				increased.increased = increased.increased < 0 ? increased.increased * -1 : increased.increased;
				return increased;
			} else if (latestYearValue < previousYearValue) {
				decreased.decreased = ((previousYearValue - latestYearValue) / previousYearValue) * 100;
				decreased.decreased = decreased.decreased < 0 ? decreased.decreased * -1 : decreased.decreased;
				return decreased;
			}

			return equal;

		}

		return;

	}

	getFinancialData() {
		this.sharedLoaderService.showLoader();

		let reqArr = [ this.companyData.companyRegistrationNumber ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_COMPANY_DETAILS', 'statutoryAccountsNew', reqArr ).subscribe( res => {

			if (res.body.status == 200) {

				if ( this.financialCardDatasets['statutoryAccounts']?.['estimated_turnover_AI'] ) {
					this.financialCardDatasets['statutoryAccounts']['estimated_turnover_AI']['latestYearValue'] = res.body?.['estimated_turnover_AI']?.['est_turnover_ML'];
				}


				this.financeData = JSON.parse(JSON.stringify(res.body['results']));
				this.financeData = this.financeData.map( val => {
					if ( val.group == 'Miscellaneous' && val.keyName == 'numberOfEmployees' ) {
						for ( let key in val ) {
							val[key] = val[key]==null ? '-' : val[key] ;
						}
					}
					return val;
				} )
				let tempArr = this.financeData;
				
				this.financeDataSorted = tempArr.sort((a, b) => a.group < b.group ? -1 : a.group > b.group ? 1 : 0);
			}

			this.sharedLoaderService.hideLoader();

		});

	}

	getFinancialOverviewDetails(data) {
		let finOverviewDataValues = data;
		let chartData: any = undefined;
		let finOverviewChartYears = [];

		finOverviewDataValues = finOverviewDataValues.sort((a, b) => {
			let prevDate: any = this.commonService.changeToDate(a.yearEndDate),
				newDate: any = this.commonService.changeToDate(b.yearEndDate);
			return prevDate - newDate;
		});
		let overviewTurnoverData = [],
			overviewTotalAssetsData = [],
			overviewTotalLiabilitiesData = [],
			overviewNetWorthData = [],
			overviewNetAsstesData = [],
			overviewProfitBeforeTax = [],
			overviewEBITDA = [],
			overviewNoOfEmployeesData;

		for (let finOverData of finOverviewDataValues) {
			let finYear = new Date(this.commonService.changeToDate(finOverData.yearEndDate)).getFullYear();
			finOverviewChartYears.push(finYear);
			let EBITDA = 0;
			if (finOverData.turnover === 0 || finOverData.turnover === null) {
				this.estimatedTurnoverBoolean = true;
				overviewTurnoverData.push(finOverData.estimated_turnover ? finOverData.estimated_turnover : 0);
			} else {
				this.estimatedTurnoverBoolean = false;
				overviewTurnoverData.push(finOverData.turnover ? finOverData.turnover : 0);
			}
			overviewTotalAssetsData.push(finOverData.totalAssets ? finOverData.totalAssets : 0);
			overviewTotalLiabilitiesData.push(finOverData.totalLiabilities ? finOverData.totalLiabilities : 0);
			overviewNetWorthData.push(finOverData.netWorth ? finOverData.netWorth : 0);
			overviewNetAsstesData.push(finOverData.netAssets ? finOverData.netAssets : 0);
			overviewProfitBeforeTax.push(finOverData.profitBeforeTax ? finOverData.profitBeforeTax : 0);
			EBITDA = finOverData.EBITDA ? finOverData.EBITDA  : 0 ;
			overviewEBITDA.push(EBITDA);
			overviewNoOfEmployeesData = finOverData.numberOfEmployees ? finOverData.numberOfEmployees : 0;
		}
		chartData = {
			labels: finOverviewChartYears,
			datasets: [
				{
					label: this.estimatedTurnoverBoolean ? 'Turnover (Estimate +)' : 'Turnover',
					data: overviewTurnoverData,
					fill: false,
					borderColor: '#5b9bd5'
				},
				{
					label: 'Total Assets',
					data: overviewTotalAssetsData,
					fill: false,
					borderColor: '#ffc000'
				},
				{
					label: 'Total Liabilities',
					data: overviewTotalLiabilitiesData,
					fill: false,
					borderColor: '#ed7d31'
				},
				{
					label: 'Net Worth',
					data: overviewNetWorthData,
					fill: false,
					borderColor: '#60af60'
				},
				{
					label: 'Profit Before Tax',
					data: overviewProfitBeforeTax,
					fill: false,
					borderColor: '#ff69B4'
				},
				{
					label: 'EBITDA',
					data: overviewEBITDA,
					fill: false,
					borderColor: '#87ff00'
				}
			]

		};
		return {
			"chartData": chartData,
			"overviewTurnoverData": overviewTurnoverData,
			"overviewTotalAssetsData": overviewTotalAssetsData,
			"overviewTotalLiabilitiesData": overviewTotalLiabilitiesData,
			"overviewNetWorthData": overviewNetWorthData,
			"overviewNetAsstesData": overviewNetAsstesData,
			"overviewProfitBeforeTax": overviewProfitBeforeTax,
			"finOverviewDataValues": finOverviewDataValues,
			"overviewEBITDA": overviewEBITDA,
			"overviewNoOfEmployeesData": overviewNoOfEmployeesData
		};

	}

	getFinancialRatioData(data) {

		this.finRatioDataValues = data;

		let finRatioChartYears = [];

		this.finRatioDataValues = this.finRatioDataValues.sort((a, b) => {
			let prevDate: any = this.commonService.changeToDate(a.yearEndDate),
				newDate: any = this.commonService.changeToDate(b.yearEndDate);

			return prevDate - newDate;
		});

		for (let finOverData of this.finRatioDataValues) {
			let finYear = new Date(this.commonService.changeToDate(finOverData.yearEndDate)).getFullYear();

			finRatioChartYears.push(finYear);

			this.currentRatioChartData.push(finOverData.currentRatio ? finOverData.currentRatio : 0);
			this.totalDebtRatioChartData.push(finOverData.totalDebtRatio ? finOverData.totalDebtRatio : 0);
			this.equityRatioChartData.push(finOverData.equityInPercentage ? finOverData.equityInPercentage : 0);
			this.creditorDaysChartData.push(finOverData.creditorDays ? finOverData.creditorDays : 0);
		}

		this.finRatioChartData = {
			labels: finRatioChartYears,
			datasets: [
				{
					label: 'Current Ratio',
					data: this.currentRatioChartData,
					fill: false,
					borderColor: '#ffc000'
				},
				{
					label: 'Total Debt Ratio',
					data: this.totalDebtRatioChartData,
					fill: false,
					borderColor: '#5b9bd5'
				},
				{
					label: 'Creditor Days',
					data: this.creditorDaysChartData,
					fill: false,
					borderColor: '#60af60'
				},
				{
					label: 'Equity Ratio',
					data: this.equityRatioChartData,
					fill: false,
					borderColor: '#ed7d31'
				}
			]

		};

		this.finRatioTabChartData.chartData1 = {
			labels: finRatioChartYears,
			datasets: [
				{
					label: 'Current Ratio',
					data: this.currentRatioChartData,
					fill: 'origin',
					backgroundColor: 'rgba(255, 192, 0, 0.4)',
					borderColor: '#ffc000'
				},
				{
					label: 'Total Debt Ratio',
					data: this.totalDebtRatioChartData,
					fill: 'origin',
					backgroundColor: 'rgba(91, 155, 213, 0.4)',
					borderColor: '#5b9bd5'
				}
			]

		};

		this.finRatioTabChartData.chartData2 = {
			labels: finRatioChartYears,
			datasets: [
				{
					label: 'Creditor Days',
					data: this.creditorDaysChartData,
					fill: 'origin',
					backgroundColor: 'rgba(96, 175, 96, 0.4)',
					borderColor: '#60af60'
				},
				{
					label: 'Equity Ratio',
					data: this.equityRatioChartData,
					fill: 'origin',
					backgroundColor: 'rgba(237, 125, 49, 0.4)',
					borderColor: '#ed7d31'
				}
			]

		};

		let tempfinRatioDataValues = [...this.finRatioDataValues]
		this.finRatioDataValues = []
		tempfinRatioDataValues.forEach(ratioData => {
			let { startDate, startMonth, startYear, endDate, endMonth, endYear, ...tempRatioData } = ratioData
			this.finRatioDataValues.push(tempRatioData)
		});

	}

	returnZero() {
		return 0;
	}

}
