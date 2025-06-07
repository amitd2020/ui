import { Component, OnInit } from '@angular/core';
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Subscription } from 'rxjs';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';

import { SustainEnvironmentComponent, SustainEsgSummaryComponent, SustainGovernanceComponent, SustainSocialComponent } from '../../child-components.index';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-finance',
	templateUrl: './finance.component.html',
	styleUrls: ['../sustainability-component.scss', './finance.component.scss']
})
export class SustainFinanceComponent implements OnInit {

	SustainEsgSummaryComponent = SustainEsgSummaryComponent;

	ChartDataLabelsPlugins = [ ChartDataLabels ];
	companyNumber: string;
	sustainFinanceData: any;

	esgYearWiseChartOptions: any;
	financialChartData: any;
	financialChartDatasets: any = {};
	
	allGaugeChartPropertiesContainer: any = {};
	gaugeChartOptionsProps: any;
	gaugeChartPluginProps: any;
	gaugeNeedleCreationContext: any;

	gaugeAnimationProgressValue: number = 0;

	dialogBoxheader: string;
	showDescription: boolean = false;

	childComponentCommunicationSubscription: Subscription;

	targetRouteComponents = {
		SustainEnvironmentComponent: SustainEnvironmentComponent,
		SustainSocialComponent: SustainSocialComponent,
		SustainGovernanceComponent: SustainGovernanceComponent,
		SustainFinanceComponent: SustainFinanceComponent
	}

	componentStyles: any;
	sustainFinanceThemeColors: { baseColor: string, darkColor_1: string, darkColor_2: string, darkColor_3: string, darkColor_4: string, darkColor_5: string, lightColor_1: string, lightColor_2: string, lightColor_3: string, lightColor_4: string, lightColor_5: string };
	
	constantMessages: any = UserInteractionMessages;
	msgs = [];
	
	constructor(
		private userAuthService: UserAuthService,
		private dataCommunicatorService: DataCommunicatorService,
		public commonService: CommonServiceService,
		private toNumberSuffix: NumberSuffixPipe,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) {

		this.childComponentCommunicationSubscription = this.dataCommunicatorService.$childComponentDataCommunicator.subscribe();

	}

	ngOnInit(): void {

		this.componentStyles = getComputedStyle( document.getElementsByClassName('sustainFinanceContainer')[0] );

		this.sustainFinanceThemeColors = {
			baseColor: this.componentStyles.getPropertyValue('--sustain-finance-color'),
			darkColor_1: this.componentStyles.getPropertyValue('--sustain-finance-color-dark-1'),
			darkColor_2: this.componentStyles.getPropertyValue('--sustain-finance-color-dark-2'),
			darkColor_3: this.componentStyles.getPropertyValue('--sustain-finance-color-dark-3'),
			darkColor_4: this.componentStyles.getPropertyValue('--sustain-finance-color-dark-4'),
			darkColor_5: this.componentStyles.getPropertyValue('--sustain-finance-color-dark-5'),
			lightColor_1: this.componentStyles.getPropertyValue('--sustain-finance-color-light-1'),
			lightColor_2: this.componentStyles.getPropertyValue('--sustain-finance-color-light-2'),
			lightColor_3: this.componentStyles.getPropertyValue('--sustain-finance-color-light-3'),
			lightColor_4: this.componentStyles.getPropertyValue('--sustain-finance-color-light-4'),
			lightColor_5: this.componentStyles.getPropertyValue('--sustain-finance-color-light-5')
		}

		this.dataCommunicatorService.$dataCommunicatorVar.subscribe((res: any) => {
			this.companyNumber = res.companyRegistrationNumber;
		});

		// Registering Multi-Bar Chart Options
		this.esgYearWiseChartOptions = {
			layout: {
				padding: { top: 18, left: 10, right: 10 }
			},
			categoryPercentage: 0.3,
			barPercentage: 0.6,
			scales: {
				y: {
					beginAtZero: true,
					ticks: {
						font: {
							family: 'Roboto',
							style: 'normal',
							color: '#bbb',
						},
						padding: 10,
						precision: 0,
						callback: (label) => {
							return label ?  this.toNumberSuffix.transform(label, 0) : 0;
						}
					},
					grid: {
						display: true,
						drawBorder: false,
						drawTicks: false,
						tickLength: 0,
						color: context => context.index == 0 ? 'rgba(0, 0, 0, 0.2)' : '#bbb',
						borderDash: function ( context ): any {
							if ( context.tick.value > 0 ) {
								return [5, 10]
							}
						}
					},
					display: true,
					title: {
						show: true,
					}
				},
				x: {
					ticks: {
						font: {
							size: 12,
							family: 'Roboto',
							style: 'normal',
							color: '#bbb',
						},
						padding: 3
					},
					grid: {
						display: false,
						color: '#bbb'
					}
				}
			},
			plugins: {
				datalabels: {
					display: true,
					align: 'end',
					anchor: 'end',
					offset: 5,
					color: '#fff',
					font: { size: 10 },
					backgroundColor: this.sustainFinanceThemeColors.lightColor_1,
					borderRadius: 3,
					padding: { top: 2, right: 5, bottom: 1, left: 5 },
					formatter: ( value, context ) => {
						value = this.toNumberSuffix.transform( +value, 2 );
						return value;
					}
				},
				legend: {
					display: false,
				},
				title: {
					display: false
				},
				tooltip: {
					enabled: true,
					callbacks: {
						label: function (tooltipItem, label) {
							return ((tooltipItem.yLabel).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(".00", ""));
						}
					}
				},
			},
			hover: {
				onHover: (event, elements) => {
					event.target.style.cursor = elements[0] ? "pointer" : "default";
				}
			},
			animation: {
				duration: 4000,
				easing: 'easeInOutQuad'
			}
		}

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
					display: false
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
		
		this.getEsgData();
	}

	goBack() {
		this.dataCommunicatorService.childComponentUpdateData( SustainEsgSummaryComponent );
	}

	goToTab( routes ) {
		this.dataCommunicatorService.childComponentUpdateData( routes );
    }

	initGaugeChart( chartFor, percentageValue ) {
		
		// Registering Gauge Chart Dataset Values
		let chartDatasetValues = {
			labels: [ '(0 - 60%)', '(61% - 80%)', '(81% - 100%)' ],
			datasets: [
				{
					data: [ 40, 60, 40 ],
					pointerValue: Math.round( percentageValue ),
					backgroundColor: [ '#f8bb32', '#92d050', '#00b050' ],
					hoverBackgroundColor: [ '#f8bb32', '#92d050', '#00b050' ],
					hoverBorderColor: [ '#fff', '#fff', '#fff' ],
					borderWidth: 2,
					borderColor: '#fff',
				}
			]
		};

		// Putting All Properties of Chart For Each [ ESG Total, Environment, Social, Governance, Financial ]
		this.allGaugeChartPropertiesContainer[ chartFor ] = { chartDataset: chartDatasetValues };

	}

	getEsgData() {

		// this.spinnerBoolean = true;
		this.sharedLoaderService.showLoader();

		let userId = this.userAuthService?.getUserInfo('dbID');

		let obj = [ this.companyNumber, userId, 'F' ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_ESG_DETAILS', 'getESGData', obj ).subscribe( res => {
		
			if ( res.body['status'] == 200 ) {

				this.sustainFinanceData = res.body['result'];

				this.initGaugeChart( 'financeGaugeProperties', this.sustainFinanceData['finance']['fPercentage'] );

				this.financialChartData = res.body['result']['charData'][0];

				this.createChartDatasets( this.financialChartData );

			}

			// this.spinnerBoolean = false;
			this.sharedLoaderService.hideLoader();

		});

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

	createChartDatasets( inputData ) {

		for ( let dataKey in inputData ) {

			let dataObj = inputData[ dataKey ];

			if ( typeof dataObj == 'object' && dataObj.length ) {

				let chartLabels = [], chartDataVals = [];

				if ( [ 'cagr', 'zScore' ].includes( dataKey ) ) {
					dataObj.sort( ( a, b ) => a.YEAR - b.YEAR );
				} else {
					dataObj.sort( ( a, b ) => a.year.localeCompare( b.year ) );
				}

				for ( let finData of dataObj ) {
					
					if ( [ 'cagr', 'zScore' ].includes( dataKey ) ) {
						finData[ dataKey ] = +finData[ dataKey ];
						chartLabels.push( finData.YEAR );
						chartDataVals.push( finData[ dataKey ].toFixed( 2 ) );
					} else {
						finData.value = +finData.value;
						chartLabels.push( finData.year );
						chartDataVals.push( finData.value.toFixed( 2 ) );
					}

				}

				if ( dataKey == 'zScore' ) {

					let zScoreBarColors = [];

					for ( let val of chartDataVals ) {
						if ( val <= 1.8 ) {
							zScoreBarColors.push('#ff4500');
						}
						else if ( ( val >= 1.8 ) && ( val < 3 ) ) {
							zScoreBarColors.push('#808080');
						}
						else if ( val > 3 ) {
							zScoreBarColors.push('#008000');
						}
					}

					this.financialChartDatasets[ dataKey ] = {
						labels: chartLabels,
						datasets: [
							{
								data: chartDataVals,
								backgroundColor: zScoreBarColors,
								hoverBackgroundColor: zScoreBarColors,
								datalabels: {
									backgroundColor: ( context ) => {
									  return context.dataset.backgroundColor;
									}
								}
							}
						]
					}

				} else {

					this.financialChartDatasets[ dataKey ] = {
						labels: chartLabels,
						datasets: [
							{
								data: chartDataVals,
								backgroundColor: this.sustainFinanceThemeColors.baseColor,
								hoverBackgroundColor: this.sustainFinanceThemeColors.lightColor_2
							},
							{
								type: 'line',
								data: chartDataVals,
								backgroundColor: `rgba( ${ this.commonService.hexToRgb( this.sustainFinanceThemeColors.lightColor_5.trim() ) }, 0.3 )`,
								borderColor: 'rgba(0, 0, 0, 0)',
								fill: 'origin',
								pointRadius: 0,
								datalabels: {
									labels: {
										display: false
									}
								}
							}
						]
					}

				}


			}


		}

	}

	showDescriptionDialogBox( header ) {
	
		this.dialogBoxheader = header;
		this.showDescription = true;
		
	}

	addToEsgWatchTable() {

		let obj = {
			userId: this.userAuthService?.getUserInfo('dbID'),
			companyNumber: this.companyNumber.toString().toLowerCase(),
			isExist: false
		}
		
		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_ESG_DETAILS', 'saveEsgWatchData', obj ).subscribe( res => {

			if (res.body['status'] == 200) {
					
				this.msgs = [];
				this.msgs.push({ severity: 'info', summary: this.constantMessages['infoMessage']['companyAlreadyExistInEsgWatchList'] });
				
				this.getEsgData();

				setTimeout(() => {
					this.msgs = [];
				}, 6000);

			} else if (res.body['status'] == 202) {

				this.msgs = [];
				this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['addToEsgWatchListSuccess'] });
				
				this.getEsgData();

				setTimeout(() => {
					this.msgs = [];
				}, 6000);
				
			}	
		});
	}

	removeFromEsgWatchTable() {

		let obj = {
			userId: this.userAuthService?.getUserInfo('dbID'),
			companyNumber: this.companyNumber.toString().toLowerCase(),
			isExist: false
		}

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_ESG_DETAILS', 'deleteEsgData', obj ).subscribe( res => {
			if (res.body.status === 200) {
				this.msgs = [];
				this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['removedFromEsgWatchListSuccess'] });
				
				this.getEsgData();

				setTimeout(() => {
					this.msgs = [];
				}, 3000);

			} else {
				this.msgs = [];
				this.msgs.push({ severity: 'error', summary: this.constantMessages['errorMessage']['customerNotDeletedMessage'] });
				setTimeout(() => {
					this.msgs = [];
				}, 3000);
			}
		});

	}

}
