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

export enum voAndRoeComments {
	'Within BOTTOM 25% of all UK companies by ',
	'Within BOTTOM 50% of all UK companies by ',
	'Within Top 25% of all UK companies by ',
	'Within Top 50% of all UK companies by '
}

@Component({
	selector: 'dg-business-valuation',
	templateUrl: './business-valuation.component.html',
	styleUrls: ['./business-valuation.component.scss']
})
export class BusinessValuationComponent implements OnInit {

	companyData: any;

	companyValuationsRoeData: Array<any>;

	allCompaniesRoeChartData: any;
	finstatutoryChartData: any;
	companyRoeChartOptions: any;
	companyValuationsChartOptions: any;
	allCompaniesValuationsChartData: any;
	companiesValuationsTurnoverChartData: any;
	companiesValuationsNetAssetsChartData: any;
	voAndRoeComments: any = voAndRoeComments;

	companiesEligibleForDataWithoutLogin = CompaniesEligibleForDataWithoutLogin;

	chartOptions = {}
	selectedGlobalCurrency: string = 'GBP';
	// spinnerBoolean: boolean;
	estimatedTurnoverBoolean: any;

	constructor(
		public userAuthService: UserAuthService,
		private commonService: CommonServiceService,
		private toNumberSuffix: NumberSuffixPipe,
		private toCurrenyPipe: CurrencyPipe,
		private dataCommunicatorService: DataCommunicatorService,
		private sharedLoaderService: SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService

	) { }

	ngOnInit() {
		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';
		if ( !this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {
			return;
		}
		
		this.dataCommunicatorService.$dataCommunicatorVar.pipe( take(1) ).subscribe( ( res: any ) => this.companyData = res );

		let data = this.companyData.statutoryAccounts;
		
		let overviewFinancialObj = this.getFinancialOverviewDetails(data);


		this.finstatutoryChartData = overviewFinancialObj.chartData;

		this.chartOptions = {
            legend: {
                labels: {
                    fontFamily: 'Roboto',
                    padding: 15
                }
            },
            title: {
                fontFamily: 'Roboto',
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
                            fontFamily: 'Roboto',
                            padding: 8,
                            callback: (label, index, labels) => {
                                return this.toNumberSuffix.transform( label, 0, this.selectedGlobalCurrency );
                            }
                        }
                    }
            },
            tooltips: {
                titleFontFamily: 'Roboto',
                bodyFontFamily: 'Roboto',
                callbacks: {
                    label: ( tooltipItem, dataset ) => {
                        return `${ dataset.datasets[ tooltipItem.datasetIndex ].label }: ${ this.toCurrenyPipe.transform( tooltipItem.yLabel, this.selectedGlobalCurrency, 'symbol', '1.0-0' ) }`;
                    }
                }
            },
            plugins: {
                datalabels: {
                    display: false
                }
            }
        }
		
		this.companyValuationsChartOptions = {
			legend: {
				display: false
			},
			title: {
				fontFamily: 'Roboto',
			},
			scales: {
				...this.chartOptions['scales']['x'],
				yAxes: [
					{
						ticks: {
							fontFamily: 'Roboto',
							padding: 8,
							callback: (label, index, labels) => {
								return this.toNumberSuffix.transform(label, 0, this.selectedGlobalCurrency);
							}
						}
					}
				]
			},
			tooltips: {
				titleFontFamily: 'Roboto',
				bodyFontFamily: 'Roboto',
				callbacks: {
					label: (tooltipItem, dataset) => {
						return this.toCurrenyPipe.transform(tooltipItem.yLabel, this.selectedGlobalCurrency, 'symbol', '1.0-0');
					}
				}
			},
			plugins: {
				datalabels: {
					display: false
				}
			}
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

		this.companyRoeChartOptions = {
			legend: this.companyValuationsChartOptions.legend,
			title: this.companyValuationsChartOptions.title,
			scales: {
				...this.companyValuationsChartOptions.scales.x,
				y: {
					ticks: {
						font: {
							family: 'Roboto',
						},
						padding: 8,
						callback: (label, index, labels) => {
							return `${label}%`;
						}
					}
				}
			},
			tooltips: {
				titleFontFamily: 'Roboto',
				bodyFontFamily: 'Roboto',
				callbacks: {
					label: (tooltipItem, dataset) => {
						return `${tooltipItem.yLabel.toFixed(2)}%`;
					}
				}
			},
			plugins: this.companyValuationsChartOptions.plugins
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

		this.getCompanyValuationsData();

	}

	getCompanyValuationsData() {
		
		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_VALUATION', 'companyValuations', this.companyData.companyRegistrationNumber ).subscribe( res => {
			if (res.body.status == 200) {
				this.companyValuationsRoeData = res.results[0];
				this.getCompanyValuationsHistoryData();
			}
		});

	}

	getCompanyValuationsHistoryData() {

		let tempAllCompaniesValuationsChartDataArr = { voScoreLabels: [], voScoreData: [], roePercentLabels: [], roePercentData: [] };

		const minimumYearsCount = 5;

		let obj = [ this.companyData.companyRegistrationNumber ];
		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_VALUATION', 'companyValuationsHistory', obj ).subscribe( res => {

			if (res.body.status == 200 && res.body.results.length) {

				let VoScoreDataArray = res.body.results[0]['VoSCOREArray'],
					hasVoScoreDataCheck = VoScoreDataArray.filter(value => value.yearArray.length);

				if (hasVoScoreDataCheck && hasVoScoreDataCheck.length) {

					if (VoScoreDataArray.length <= minimumYearsCount) {

						for (let VoScoreDataObj of VoScoreDataArray) {

							if (VoScoreDataArray.length == minimumYearsCount) {
								break;
							} else {

								VoScoreDataArray.sort((a, b) => {
									let dateA: any = this.commonService.changeToDate(a['yearArray'][a['yearArray'].length - 1]),
										dateB: any = this.commonService.changeToDate(b['yearArray'][b['yearArray'].length - 1]);

									return dateA - dateB;
								});

								let minYear = new Date(this.commonService.changeToDate(VoScoreDataArray[0]['yearArray'][VoScoreDataArray[0]['yearArray'].length - 1])).getFullYear() - 1;

								VoScoreDataArray.push({
									VoSCORE: 0,
									ROE_PERCENT: 0,
									yearArray: [`31/01/${minYear}`]
								});

							}

						}

					}

					const companyValuationChartData = VoScoreDataArray.sort((a, b) => {
						let dateA: any = this.commonService.changeToDate(a['yearArray'][a['yearArray'].length - 1]),
							dateB: any = this.commonService.changeToDate(b['yearArray'][b['yearArray'].length - 1]);

						return dateA - dateB;
					});

					for (let chartDataObj of companyValuationChartData) {

						let yearLabelStr = new Date(this.commonService.changeToDate(chartDataObj['yearArray'][chartDataObj['yearArray'].length - 1])).getFullYear();

						tempAllCompaniesValuationsChartDataArr.voScoreLabels.push(yearLabelStr);
						tempAllCompaniesValuationsChartDataArr.voScoreData.push(chartDataObj['VoSCORE']);
						tempAllCompaniesValuationsChartDataArr.roePercentLabels.push(yearLabelStr);
						tempAllCompaniesValuationsChartDataArr.roePercentData.push(chartDataObj['ROE_PERCENT']);
					}

					this.allCompaniesValuationsChartData = {
						labels: tempAllCompaniesValuationsChartDataArr.voScoreLabels,
						datasets: [
							{
								type: 'line',
								data: tempAllCompaniesValuationsChartDataArr.voScoreData,
								pointRadius: 4,
								pointBackgroundColor: '#287EAD',
								pointBorderColor: '#fff',
								pointBorderWidth: 1,
								fill: false,
								borderColor: 'rgba(0, 0, 0, 0)'
							},
							{
								data: tempAllCompaniesValuationsChartDataArr.voScoreData,
								backgroundColor: '#1F4286'
							},
							{
								type: 'line',
								data: tempAllCompaniesValuationsChartDataArr.voScoreData,
								pointRadius: 0,
								backgroundColor: 'rgba( 40, 126, 173, 0.2 )',
								borderColor: 'rgba( 40, 126, 173, 0.0 )'
							}
						]
					};

					this.allCompaniesRoeChartData = {
						labels: tempAllCompaniesValuationsChartDataArr.roePercentLabels,
						datasets: [
							{
								type: 'line',
								data: tempAllCompaniesValuationsChartDataArr.roePercentData,
								pointRadius: 4,
								pointBackgroundColor: '#287EAD',
								pointBorderColor: '#fff',
								pointBorderWidth: 1,
								fill: false,
								borderColor: 'rgba(0, 0, 0, 0)'
							},
							{
								data: tempAllCompaniesValuationsChartDataArr.roePercentData,
								backgroundColor: '#1F4286'
							},
							{
								type: 'line',
								data: tempAllCompaniesValuationsChartDataArr.roePercentData,
								pointRadius: 0,
								backgroundColor: 'rgba( 40, 126, 173, 0.2 )',
								borderColor: 'rgba( 40, 126, 173, 0.0 )'
							}
						]
					};

				}

				// this.spinnerBoolean = false;
				this.sharedLoaderService.hideLoader();


			} else {

				// this.spinnerBoolean = false;
				this.sharedLoaderService.hideLoader();

			}
		});

	}

	returnCommentAccordingToValue(valueToCheck, quartileData, valueFor) {
		let commentIndex = 0;
		if (valueToCheck > quartileData['Q3']) {
			commentIndex = 3;
		} else if (valueToCheck > quartileData['Q2']) {
			commentIndex = 2;
		} else if (valueToCheck > quartileData['Q1']) {
			commentIndex = 1;
		} else {
			commentIndex = 0;
		}

		return `${this.voAndRoeComments[commentIndex]} ${valueFor}`;
	}

	getFinancialOverviewDetails(data: any) {
		let finOverviewDataValues = data;
		let chartData: any = undefined;
		let finOverviewChartYears = [];

		if( finOverviewDataValues ) {
			finOverviewDataValues = finOverviewDataValues.sort((a, b) => {
				let prevDate: any = this.commonService.changeToDate(a.yearEndDate),
					newDate: any = this.commonService.changeToDate(b.yearEndDate);
				return prevDate - newDate;
			});
		}
		let overviewTurnoverData = [],
			overviewTotalAssetsData = [],
			overviewTotalLiabilitiesData = [],
			overviewNetWorthData = [],
			overviewNetAsstesData = [],
			overviewProfitBeforeTax = [],
			overviewEBITDA = [],
			overviewNoOfEmployeesData;

		if( finOverviewDataValues ) {
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
