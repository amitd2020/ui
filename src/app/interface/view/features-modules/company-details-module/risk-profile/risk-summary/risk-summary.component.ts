import { Component, OnInit, ViewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';

import * as ChartDataSets from "chartjs-plugin-datalabels";
import { Subscription, take } from 'rxjs';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { DataCommunicatorService } from '../../data-communicator.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedScreenshotService } from 'src/app/interface/service/shared-screenshot.service';
// import { BadDeptsComponent, BuyerComponent, CcjsComponent, ChargesComponent, CommentryComponent, CorporateLandComponent, DirectorsInfoComponent, ImportExportComponent, InnovateGrantComponent, SafeAlertComponent, ShareholdersComponent, SupplierComponent } from '../../child-components.index';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';


@Component({
	selector: 'dg-risk-summary',
	templateUrl: './risk-summary.component.html',
	styleUrls: ['./risk-summary.component.scss']
})
export class RiskSummaryComponent implements OnInit {

	@ViewChild("riskGaugeChart") riskGaugeChart: UIChart;

	isLoggedIn: boolean = false;
	currentPlan: unknown;

	spinnerBoolean: boolean = false;
	hasZscore: boolean = false;
	hasCAGR: boolean = false;
	hasFinances: boolean = false;
	hasSafeAlerts: boolean = false;

	dirFailuresCodeTitle: Array<any> = [];
	addrChangesCodeTitle: Array<any> = [];
	companyData: any;
	companyRiskAssessmentAnalysisData: any;
	
	/*
	ChargesComponent = ChargesComponent;
	CCJsComponent = CcjsComponent;
	BadDeptsComponent = BadDeptsComponent;
	SafeAlertComponent = SafeAlertComponent;
	CommentryComponent = CommentryComponent;
	ImportExportComponent = ImportExportComponent;
	SupplierComponent = SupplierComponent;
	BuyerComponent = BuyerComponent;
	CorporateLandComponent = CorporateLandComponent;
	InnovateGrantComponent = InnovateGrantComponent;
	DirectorsInfoComponent = DirectorsInfoComponent;
	ShareholdersComponent = ShareholdersComponent;
	*/

	
	gaugeChartOptionsProps: any;
	gaugeChartPluginProps: any;
	gaugeAnimationProgressValue: number = 0;
	gaugeNeedleCreationContext: any;
	riskGaugeChartDataValues: any;
	ChartDataLabelsPlugin = ChartDataSets;
	selectedGlobalCurrency: string = 'GBP';
	miniBarChartOptions: any;
	financialBool: any  =  {};
	financialCardDatasets: any = {
		financials: {
			turnover: {},
			netWorth: {},
			operatingProfit: {},
			retainedProfit: {},
			bankOverdraft: {},
			otherShortTerm: {}

		},
		additionalCalculatedRatios: {
			grossMarginByTurnoverPercent: {},
			profitBeforeTaxByTurnoverPercent: {},
			wagesAndSalariesByTurnoverPercent: {},
			grossMarginByNumberOfEmployees: {},
			turnoverByNumberOfEmployees: {},
		},
		ratios: {
			zScore: {},
			cagr: {},
			EBITDA: {},
			gearingPercentage: {},
			creditorDays: {},
			debtorDays: {},
		},
		profitability: {
			grossProfit: {},
			profitBeforeTax: {},
			returnOnTotalAssets: {},
			returnOnCapital: {},
		},
		liquidity: {
			currentRatio: {},
			cashRatio: {},
			quickRatio: {},
			tradeCreditors: {},
			tradeDebtors: {},
		},
		solvency: {
			equityInPercentage: {},
			totalDebtRatio: {},
		},
		structural: {
			directorsRemunerationYearWiseArray: {},
			employeeYearWiseArray: {},
		},
	};
	numberTypeFinancialData: Array<any> = [ 'zScore', 'cagr', 'creditorDays', 'debtorDays', 'currentRatio', 'quickRatio', 'cashRatio', 'equityInPercentage', 'employeeYearWiseArray', 'equityInPercentage', 'gearingPercentage', 'returnOnCapital', 'returnOnTotalAssets', 'totalDebtRatio', 'grossMarginByTurnoverPercent', 'turnoverByNumberOfEmployees', 'profitBeforeTaxByTurnoverPercent', 'wagesAndSalariesByTurnoverPercent', 'grossMarginByNumberOfEmployees' ];
	
	riskValueMeasurements = {
		not_scored: 8,
		very_high_risk: 10,
		high_risk: 30,
		moderate_risk: 50,
		low_risk: 70,
		very_low_risk: 90
	}

	childComponentCommunicationSubscription: Subscription;

	constructor(
		public userAuthService: UserAuthService,
		private commonService: CommonServiceService,
		public toNumberSuffix: NumberSuffixPipe,
		private dataCommunicatorService: DataCommunicatorService,
		private sharedLoaderService: SharedLoaderService,
		private sharedScreenshotService: SharedScreenshotService,
		private globalServerCommunication: ServerCommunicationService

	) {
		this.childComponentCommunicationSubscription = this.dataCommunicatorService.$childComponentDataCommunicator.subscribe();
	}

	ngOnInit() {

		this.initGaugeOptionNPlugin();

		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';
		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => {
			this.isLoggedIn = loggedIn;

			if ( this.isLoggedIn ) {

				this.currentPlan = this.userAuthService?.getUserInfo('planId');

				this.dataCommunicatorService.$dataCommunicatorVar.subscribe( res => {
					this.companyData = res;
					this.hasZscore = res['hasZScore'];
					this.hasCAGR = res['hasCAGR'];
					this.hasFinances = res['hasFinances'];
					this.hasSafeAlerts = res['hasSafeAlerts'];
					this.financialBool = {
						hasZscore : this.hasZscore,
						hasCAGR : this.hasCAGR,
						hasFinances: this.hasFinances
					}
				});
				
				this.getRiskAssessmentAnalysisData();

			}

		});
		
	}

	getRiskAssessmentAnalysisData() {

		this.sharedLoaderService.showLoader();
		
		let companyNumberArr = [];
		companyNumberArr.push( this.companyData.companyRegistrationNumber );

		let obj = {
			companyNumbers: companyNumberArr
		}

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_RISK_ASSESMENT', 'riskAssesmentData', obj).subscribe( res => {

			if (res.body['status'] == 200) {

				let currentRiskValue;
				this.companyRiskAssessmentAnalysisData = res.body['result'][0];

				if ( this.companyData.internationalScoreDescription ) {

					currentRiskValue = this.companyData.internationalScoreDescription.trim().toLowerCase().split(' ').join('_');
				}

				this.riskGaugeChartDataValues = this.initGaugeChart( this.riskValueMeasurements[ currentRiskValue ] );

				// =======================================================================================
				// Mini Line Charts For Overall Details Card Start

				this.companyRiskAssessmentAnalysisData['financialDetails']['turnover'] = this.companyRiskAssessmentAnalysisData['financialDetails']['revenue'];

				let finDataSort = async ( inputArray ) => await inputArray.sort( ( a, b ) => {
					
					a['year'] = ( a['year'] || a['YEAR'] ).toString();
					b['year'] = ( b['year'] || b['YEAR'] ).toString();
					
					return a['year'].localeCompare( b['year'] );

				});

				Object.keys( this.companyRiskAssessmentAnalysisData['financialDetails'] ).map( async key => {
					if ( key == 'revenue' ) delete this.companyRiskAssessmentAnalysisData['financialDetails'][ key ];

					let finDataArray: any = this.companyRiskAssessmentAnalysisData['financialDetails'][ key ];
					finDataArray = finDataArray && finDataArray.length ? await finDataSort( finDataArray ) : [];
				});
				
				// Creating Financial Data Card Objects

				Object.keys( this.financialCardDatasets ).map( parentKey => {

					Object.keys( this.financialCardDatasets[ parentKey ] ).map( async childKey => {

						const finDataAll = await this.companyRiskAssessmentAnalysisData['financialDetails'];

						if ( childKey !== 'revenue' ) {

							let dataValueKey = [ 'cagr', 'zScore' ].includes( childKey ) ? childKey : 'value';

							let latestYearValue = finDataAll[ childKey ].length ? finDataAll[ childKey ][ finDataAll[ childKey ].length - 1 ][ dataValueKey ] ? parseFloat( finDataAll[ childKey ][ finDataAll[ childKey ].length - 1 ][ dataValueKey ] ) : 0 : 0,
								previousYearValue = finDataAll[ childKey ].length > 1 ? finDataAll[ childKey ][ finDataAll[ childKey ].length - 2 ][ dataValueKey ] ? parseFloat( finDataAll[ childKey ][ finDataAll[ childKey ].length - 2 ][ dataValueKey ] ) : 0 : 0;

							this.financialCardDatasets[ parentKey ][ childKey ] = {
								latestYearValue: latestYearValue,
								previousYearValue: previousYearValue,
								diffPercentageValue: this.checkPercentageDiff( latestYearValue, previousYearValue ),
								chartDatasets: finDataAll[ childKey ] && finDataAll[ childKey ].length ? this.createMiniLineChartDataset( finDataAll[ childKey ], childKey ) : 0,
								valueType: this.numberTypeFinancialData.includes( childKey ) ? '' : this.selectedGlobalCurrency
							}

						}

					});

				});

			}

			this.sharedLoaderService.hideLoader();

		});

	}

	initGaugeOptionNPlugin() {

		// Registering Gauge Chart Options
		this.gaugeChartOptionsProps = {
			layout: {
				padding: { bottom: 20 }
			},
			cutout: '80%',
			circumference: 180,
			rotation: -90,
			plugins: {
				datalabels: {
					display: false
				},
				tooltip: {
					enabled: false
				},
				legend: {
					position: 'right',
					align: 'center',
					labels: {
                        font: {
                            family: 'Roboto',
                            size: 13,
                            color: '#777',
                        },
						usePointStyle: true,
						pointStyle: 'circle',
						padding: 13
					}
				},
			},
			events: [],
			animation: {
				duration: 4000,
				easing: 'easeInOutQuad',
				onProgress: ( animation ) => {
					this.gaugeAnimationProgressValue = animation.currentStep / animation.numSteps;
					this.gaugeNeedleCreationContext = window.requestAnimationFrame( this.createGaugeNeedle );
				},
				onComplete: () => {
					window.cancelAnimationFrame( this.gaugeNeedleCreationContext );
				}
			}
		};

		// Registering Gauge Value Indicator Plugin
		this.gaugeChartPluginProps = [
			{
				afterDatasetDraw: ( chart, args, options ) => {

					const { ctx, config, data, width, height } = chart;
					let coloredArcs = chart.getDatasetMeta(0).data;

					ctx.save();
					
					const totalDataValues = data.datasets[0].data.reduce( ( a, b ) => a + b, 0 );
					const pointerValue = data.datasets[0].pointerValue;
					const gaugeAngle = Math.PI / 2 + ( 1 / totalDataValues * pointerValue * Math.PI );

					let needleCircleRadius = ( coloredArcs[0].innerRadius * 10 ) / 100;
					
					// Gauge Needle
					this.createGaugeNeedle( { ctx, coloredArcs, needleCircleRadius, gaugeAngle } )

				}
		
			}
		];
		
	}

	createGaugeNeedle( requiredValuesForNeedle ) {

		const { ctx, coloredArcs, needleCircleRadius, gaugeAngle } = requiredValuesForNeedle, baseGaugeAngle = 1.57;

		if ( ctx ) {

			let modifiedGaugeAngle = this.gaugeAnimationProgressValue * gaugeAngle,
				finalGaugeAngle = 0;

			finalGaugeAngle = modifiedGaugeAngle < baseGaugeAngle ? baseGaugeAngle : modifiedGaugeAngle;

			// Dashed inner gray line
			ctx.save();
			ctx.beginPath();
			ctx.setLineDash([ 6, 10 ]);
			ctx.arc( coloredArcs[0].x, coloredArcs[0].y, coloredArcs[0].innerRadius - 25, 0, Math.PI, true );
			ctx.strokeStyle = finalGaugeAngle > baseGaugeAngle ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0)';
			ctx.stroke();
			ctx.restore();
					
			// Needle bottom big dark circle
			ctx.save();
			ctx.beginPath();
			ctx.arc( coloredArcs[0].x, coloredArcs[0].y, needleCircleRadius, 0, Math.PI * 2, true );
			ctx.fillStyle = finalGaugeAngle > baseGaugeAngle ? '#777' : 'rgba(0, 0, 0, 0)';
			ctx.fill();
			ctx.restore();
					
			// Needle Triangle
			ctx.save();
			ctx.translate( coloredArcs[0].x, coloredArcs[0].y );
			ctx.rotate( finalGaugeAngle );
			ctx.beginPath();
			ctx.lineCap = 'round';
			ctx.moveTo( -needleCircleRadius, 2 );
			ctx.lineTo( 0, coloredArcs[0].innerRadius + 20 );
			ctx.lineTo( 2, coloredArcs[0].innerRadius + 20 );
			ctx.lineTo( needleCircleRadius, 2 );
			ctx.fillStyle = finalGaugeAngle > baseGaugeAngle ? '#777' : 'rgba(0, 0, 0, 0)';
			ctx.closePath();
			ctx.fill();
			ctx.restore();
					
			// Needle bottom small white circle
			ctx.save();
			ctx.beginPath();
			ctx.arc( coloredArcs[0].x, coloredArcs[0].y, needleCircleRadius/2.5, 0, Math.PI * 2, true );
			ctx.fillStyle = '#fff';
			ctx.fill();
			ctx.strokeStyle = finalGaugeAngle > baseGaugeAngle ? '#6e6e6e' : 'rgba(0, 0, 0, 0)';
			ctx.stroke();
			ctx.restore();
	
			this.gaugeNeedleCreationContext = window.requestAnimationFrame( this.createGaugeNeedle );

		}

	}

	initGaugeChart( inputValue ) {
		
		// Registering Gauge Chart Dataset Values
		let chartDatasetValues = {
			labels: [ 'Not scored /Very High Risk',  'High Risk', 'Moderate', 'Low Risk', 'Very Low Risk' ],
			datasets: [
				{
					data: [ 20, 20, 20, 20, 20 ],
					pointerValue: Math.round( inputValue ),
					backgroundColor: [ '#D92727', '#ee9512', '#ffcc00', '#59ba9b', '#6dc470' ],
					hoverBackgroundColor: [ '#D92727', '#ee9512', '#ffcc00', '#59ba9b', '#6dc470' ],
					borderWidth: 2,
					borderColor: '#fff',
					hoverBorderColor: [ '#D92727', '#ee9512', '#ffcc00', '#59ba9b', '#6dc470' ]
				}
			]
		};

		return chartDatasetValues;

	}

    createMiniLineChartDataset( inputValues, dataKey ) {

        let outputDataset,
			colorRGBForChartPositive = '21 195 129',
			colorRGBForChartNegative = '176 0 32',
			barBgColors = [],
			dataValueKey = [ 'cagr', 'zScore' ].includes( dataKey ) ? dataKey : 'value',
			chartLabels = inputValues.map( val => val['year'] ),
			chartData = inputValues.map( val => val[ dataValueKey ] ? parseFloat( val[ dataValueKey ] ) : 0 );

        outputDataset = {
			labels: chartLabels,
            datasets: [
				{
					title: dataKey,
                    data: chartData,
                    backgroundColor: [],
                    hoverBackgroundColor: [],
                    borderWidth: 1,
                    borderColor: [],
                    hoverBorderColor: []
                }
            ]
        };

		if ( dataKey == 'zScore' ) {

			barBgColors = [];
		
			for ( let { zScore } of inputValues ) {
				if ( zScore <= 1.8 ) {
					barBgColors.push('#ff4500');
				} else if ( ( zScore >= 1.8 ) && ( zScore < 3 ) ) {
					barBgColors.push('#808080');
				} else if ( zScore > 3 ) {
					barBgColors.push('#008000');
				}
			}

			outputDataset.datasets[0]['backgroundColor'] = barBgColors;
			outputDataset.datasets[0]['hoverBackgroundColor'] = barBgColors;
			outputDataset.datasets[0]['borderWidth'] = 0;
			outputDataset.datasets[0]['borderColor'] = 'rgba(0, 0, 0, 0)';
			outputDataset.datasets[0]['hoverBorderColor'] = 'rgba(0, 0, 0, 0)';
			
		} else {

			barBgColors = [];
		
			for ( let { value, cagr } of inputValues ) {
				if ( ( value || cagr ) < 0 ) {
					barBgColors.push( `rgb( ${ colorRGBForChartNegative } / 50% )` );
				} else {
					barBgColors.push( `rgb( ${ colorRGBForChartPositive } / 50% )` );
				}
			}

			outputDataset.datasets[0]['backgroundColor'] = barBgColors;
			outputDataset.datasets[0]['hoverBackgroundColor'] = barBgColors.map( val => val.replace( '/ 50%', '' ) );
			outputDataset.datasets[0]['borderColor'] = barBgColors.map( val => val.replace( '/ 50%', '' ) );
			outputDataset.datasets[0]['hoverBorderColor'] = barBgColors.map( val => val.replace( '/ 50%', '' ) );

		}

        return outputDataset;

    }

	checkPercentageDiff( latestYearValue, previousYearValue ): any {

		let increased = { increased: 0 },
			decreased = { decreased: 0 },
			equal = { equal: 0 };

		if ( previousYearValue ) {

			if ( latestYearValue > previousYearValue ) {
				increased.increased = ( ( latestYearValue - previousYearValue ) / previousYearValue ) * 100;
				increased.increased = increased.increased < 0 ? increased.increased * -1 : increased.increased;
				return increased;
			} else if ( latestYearValue < previousYearValue ) {
				decreased.decreased = ( ( previousYearValue - latestYearValue ) / previousYearValue ) * 100;
				decreased.decreased = decreased.decreased < 0 ? decreased.decreased * -1 : decreased.decreased;
				return decreased;
			}
	
			return equal;

		}

		return;

	}

	calculateAccountOverduePeriod(overdueDate) {
		let todayDate = new Date(),
			dueDate = this.commonService.changeToDate(overdueDate);

		return todayDate > dueDate;
	}

	calculateDays(inputDate) {
		let todayDate = new Date(),
			dueDate = this.commonService.changeToDate(inputDate),
			diffInTime, diffInDays;

		if( dueDate ) {
			if (todayDate > dueDate) {
			diffInTime = todayDate.getTime() - dueDate.getTime(),
				diffInDays = diffInTime / (1000 * 3600 * 24);
		}
		}

		return Math.round(diffInDays);
	}

	goToTab( routes: string ) {
		this.dataCommunicatorService.childComponentUpdateData( routes );
    }

	returnZero() {
		return 0;
	}
	
	takeSnapshot( companyRiskAnalysisContainerId){
		this.sharedScreenshotService.snapshotForRiskSummary( companyRiskAnalysisContainerId, 'DG_Risk_summary.jpeg' );
	}

}
