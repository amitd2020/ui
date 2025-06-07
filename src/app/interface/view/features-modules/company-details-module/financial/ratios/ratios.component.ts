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
	selector: 'dg-ratios',
	templateUrl: './ratios.component.html',
	styleUrls: ['./ratios.component.scss']
})
export class RatiosComponent implements OnInit {

	isLoggedIn: boolean = false;
	currentPlan: unknown;
	companyData: any;
	companyNumber : any;

	finRatioChartData: any;
	finRatioTabChartData: any = {
		chartData1: {},
		chartData2: {}
	};

	finRatioDataValues: Array<any>;

	overviewEBITDA = [];
	overviewNetWorthData = [];
	overviewTurnoverData = [];
	overviewTotalAssetsData = [];
	overviewProfitBeforeTax = [];
	currentRatioChartData = [];
	totalDebtRatioChartData = [];
	equityRatioChartData = [];
	creditorDaysChartData = [];
	finstatutoryDataValues: any[];
	overviewTotalLiabilitiesData = [];

	finstatutoryChartData: any;

	hasFinancialRatios: boolean = false;
	estimatedTurnoverBoolean: boolean = false;

	overviewNoOfEmployeesData: number;

	chartOptions = {};
	chartOptions2 = {};
	financialDataObject: Object = undefined;

	financeData: any;
	financeDataSorted: any;
	companiesValuationsTurnoverChartData: any;
	companiesValuationsNetAssetsChartData: any;
	companiesEligibleForDataWithoutLogin = CompaniesEligibleForDataWithoutLogin;
	selectedGlobalCurrency: string = 'GBP';

	constructor(
		public userAuthService: UserAuthService,
		private commonService: CommonServiceService,
		private dataCommunicateService: DataCommunicatorService,
		private toNumberSuffix: NumberSuffixPipe,
		private toCurrencyPipe: CurrencyPipe,
		private sharedLoaderService: SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService
	) { }

	ngOnInit() {

		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';
		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => this.isLoggedIn = loggedIn );
		this.dataCommunicateService.$dataCommunicatorVar.pipe( take(1) ).subscribe( (res: any) => this.companyData = res );
		this.companyNumber = this.companyData['companyRegistrationNumber'];
		if ( this.isLoggedIn || ( !this.isLoggedIn && this.companiesEligibleForDataWithoutLogin.includes( this.companyData.companyRegistrationNumber ) ) ) {

			this.currentPlan = this.userAuthService?.getUserInfo('planId');
			
			this.getFinancialData();
	
			if ( this.companyData.hasFinances && this.companyData.statutoryAccounts ) {
				let data = this.companyData.statutoryAccounts;
				let overviewFinancialObj = this.getFinancialOverviewDetails(data);
				this.finstatutoryDataValues = overviewFinancialObj.finOverviewDataValues;
				this.finstatutoryChartData = overviewFinancialObj.chartData;
				this.overviewTurnoverData = overviewFinancialObj.overviewTurnoverData;
				this.overviewTotalAssetsData = overviewFinancialObj.overviewTotalAssetsData;
				this.overviewTotalLiabilitiesData = overviewFinancialObj.overviewTotalLiabilitiesData;
				this.overviewNetWorthData = overviewFinancialObj.overviewNetWorthData;
				this.overviewProfitBeforeTax = overviewFinancialObj.overviewProfitBeforeTax;
				this.overviewNoOfEmployeesData = overviewFinancialObj.overviewNoOfEmployeesData;
				this.overviewEBITDA = overviewFinancialObj.overviewEBITDA;
	
				if (this.companyData.financialRatios && this.companyData.financialRatios.length > 0) {
					this.getFinancialRatioData(this.companyData.financialRatios);
					this.finRatioDataValues = [this.finRatioDataValues];
					this.hasFinancialRatios = true;
				} else {
					this.finRatioDataValues = undefined;
					this.hasFinancialRatios = false;
				}
	
				this.companiesValuationsNetAssetsChartData = {
					labels: this.finstatutoryChartData['labels'],
					datasets: [
						{
							type: 'line',
							data: overviewFinancialObj.overviewNetAsstesData,
							pointRadius: 4,
							pointBackgroundColor: '#287EAD',
							pointBorderColor: '#fff',
							pointBorderWidth: 1,
							fill: false,
							borderColor: 'rgba(0, 0, 0, 0)'
						},
						{
							data: overviewFinancialObj.overviewNetAsstesData,
							backgroundColor: '#1F4286'
						},
						{
							type: 'line',
							data: overviewFinancialObj.overviewNetAsstesData,
							pointRadius: 0,
							backgroundColor: 'rgba( 40, 126, 173, 0.2 )',
							borderColor: 'rgba( 40, 126, 173, 0.0 )'
						}
					]
				};
	
				this.companiesValuationsTurnoverChartData = {
					labels: this.finstatutoryChartData['labels'],
					datasets: [
						{
							type: 'line',
							data: this.finstatutoryChartData['datasets'][0]['data'],
							pointRadius: 4,
							pointBackgroundColor: '#287EAD',
							pointBorderColor: '#fff',
							pointBorderWidth: 1,
							fill: false,
							borderColor: 'rgba(0, 0, 0, 0)'
						},
						{
							data: this.finstatutoryChartData['datasets'][0]['data'],
							backgroundColor: '#1F4286'
						},
						{
							type: 'line',
							data: this.finstatutoryChartData['datasets'][0]['data'],
							pointRadius: 0,
							backgroundColor: 'rgba( 40, 126, 173, 0.2 )',
							borderColor: 'rgba( 40, 126, 173, 0.0 )'
						}
					]
				};
	
				this.financialDataObject = { 'finOverviewDataValues': [this.finstatutoryDataValues], 'finRatioDataValues': this.finRatioDataValues };
			}
	
			//For Chart Options Start
			this.chartOptions = {
				legend: {
					labels: {
						fontFamily: 'Roboto',
						padding: 15
					}
				},
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
					tooltip: {
						titleFontFamily: 'Roboto',
						bodyFontFamily: 'Roboto',
						callbacks: {
							label: (tooltipItem, dataset) => {
								return `${dataset.datasets[tooltipItem.datasetIndex].label}: ${this.toCurrencyPipe.transform(tooltipItem.yLabel, this.selectedGlobalCurrency, 'symbol', '1.0-0')}`;
							}
						}
					},
					title: {
						fontFamily: 'Roboto',
					},
				}
			}
	
			this.chartOptions2 = {
				legend: this.chartOptions['legend'],
				title: this.chartOptions['title'],
				tension: 0.4,
				tooltips: {
					fonnt: {
						family: 'Roboto'
					}
				},
				scales: {
					x: {
						ticks: {
							fonnt: {
								family: 'Roboto'
							},
							padding: 8
						}
					},
					y: {
						beginAtZero: true,
						ticks: {
							fonnt: {
								family: 'Roboto'
							},
							padding: 8,
							beginAtZero: true,
							callback: (label, index, labels) => {
								return Intl.NumberFormat().format(label);
							}
						}
					}
				},
				plugins: this.chartOptions['plugins']
			}
			//For Chart Options End

		}

	}
	
	getFinancialData() {

		this.sharedLoaderService.showLoader();

		let obj = [ this.companyData.companyRegistrationNumber ]
		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_COMPANY_DETAILS', 'statutoryAccountsNew', obj ).subscribe( res => {
			if (res.body.status == 200) {
				this.financeData = JSON.parse(JSON.stringify(res.body['results']));
				let tempArr = this.financeData;

				this.financeDataSorted = tempArr.sort((a, b) => a.group < b.group ? -1 : a.group > b.group ? 1 : 0);
			}

			setTimeout(() => {
				this.sharedLoaderService.hideLoader();
			}, 1000);
		});
	}

	getFinancialRatioData(data: any[]) {

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

	getFinancialOverviewDetails(data: any) {
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
			EBITDA = (finOverData.profitBeforeTax ? finOverData.profitBeforeTax : 0) + (finOverData.interestExpense ? finOverData.interestExpense : 0) + (finOverData.depreciation ? finOverData.depreciation : 0);
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

}
