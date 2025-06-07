import { Component, OnInit } from '@angular/core';

import * as ChartDataSets from "chartjs-plugin-datalabels";
import { Subscription } from 'rxjs';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { SustainEnvironmentComponent, SustainSocialComponent, SustainGovernanceComponent, SustainFinanceComponent } from '../../child-components.index';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-esg-summary',
	templateUrl: './esg-summary.component.html',
	styleUrls: ['./esg-summary.component.scss']
})
export class SustainEsgSummaryComponent implements OnInit {

	sustainEsgSummaryData: any;

	ChartDataLabelsPlugin = ChartDataSets;
	allGaugeChartPropertiesContainer: any = {};
	gaugeChartOptionsProps: any;
	gaugeChartPluginProps: any;
	gaugeNeedleCreationContext: any;

	gaugeAnimationProgressValue: number = 0;	

	companyNumber: string;
	
	esgYearWiseChartOptions: any;
	esgYearWiseChartData: any;
	
	showDescription: boolean = false;
	dialogBoxheader: string;
	constantMessages: any = UserInteractionMessages;
	msgs = [];

	childComponentCommunicationSubscription: Subscription;

	targetRouteComponents = {
		SustainEnvironmentComponent: SustainEnvironmentComponent,
		SustainSocialComponent: SustainSocialComponent,
		SustainGovernanceComponent: SustainGovernanceComponent,
		SustainFinanceComponent: SustainFinanceComponent,
	}

	constructor (
		public userAuthService: UserAuthService,
		private dataCommunicatorService: DataCommunicatorService,
		private toNumberSuffix: NumberSuffixPipe,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService

	) {

		this.childComponentCommunicationSubscription = this.dataCommunicatorService.$childComponentDataCommunicator.subscribe();

	}

	ngOnInit() {
		
		this.sharedLoaderService.showLoader();

		this.dataCommunicatorService.$dataCommunicatorVar.subscribe((res: any) => {
			this.companyNumber = res.companyRegistrationNumber;
		});

		// Registering Multi-Bar Chart Options
		this.esgYearWiseChartOptions = {
			categoryPercentage: 0.3,
			barPercentage: 0.6,
			layout: {
				padding: { left: 10, right: 10 }
			},
			scales: {
				y: {
					ticks: {
						font: {
							family: 'Roboto',
							style: 'normal',
						},
						beginAtZero: true,
						color: '#bbb',
						padding: 10,
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
							size: 14,
							family: 'Roboto',
							style: 'normal',
						},
						color: '#bbb',
						padding: 3,
						callback: (label, index, labels) => {
							return label;
						}
					},
					grid: {
						display: false,
						color: '#bbb'
					}
				}
			},
			plugins: {
				datalabels: {
					display: false,
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

		// // Registering Gauge Value Indicator Plugin
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

	getEsgData() {

		// this.spinnerBoolean = true;
		let userId = this.userAuthService?.getUserInfo('dbID');

		let obj = [ this.companyNumber, userId, 'ESG' ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_ESG_DETAILS', 'getESGData', obj ).subscribe( res => {
			
			if ( res.body['status'] == 200 ) {

				this.sustainEsgSummaryData = res.body['result'];

				this.initGaugeChart( 'currentESGGaugeProperties', this.sustainEsgSummaryData['esgPercentage'] );
				this.initGaugeChart( 'environmentGaugeProperties', this.sustainEsgSummaryData['environmental']['ePercentage'] );
				this.initGaugeChart( 'socialGaugeProperties', this.sustainEsgSummaryData['social']['sPercentage'] );
				this.initGaugeChart( 'governanceGaugeProperties', this.sustainEsgSummaryData['governance']['gPercentage'] );
				this.initGaugeChart( 'financeGaugeProperties', this.sustainEsgSummaryData['finance']['fPercentage'] );

				if ( this.sustainEsgSummaryData['esgYearWiseData'] ) {

					let yearWiseChartLabels = [], yearWiseEChartDataValues = [], yearWiseSChartDataValues = [], yearWiseGChartDataValues = [];

					this.sustainEsgSummaryData['esgYearWiseData'].sort( ( a, b ) => a.year - b.year );

					for ( let esgBarChartData of this.sustainEsgSummaryData['esgYearWiseData'] ) {

						yearWiseChartLabels.push( esgBarChartData.year );
						yearWiseEChartDataValues.push( esgBarChartData.eKeyPercentage );
						yearWiseSChartDataValues.push( esgBarChartData.sKeyPercentage );
						yearWiseGChartDataValues.push( esgBarChartData.gKeyPercentage );
						
					}

					this.esgYearWiseChartData = {
						labels:  yearWiseChartLabels,
						datasets: [
							{
								data: yearWiseEChartDataValues,
								backgroundColor: '#0fd569'
							},
							{
								data: yearWiseSChartDataValues,
								backgroundColor: '#1fcfeb'
							},
							{
								data: yearWiseGChartDataValues,
								backgroundColor: '#2a8ce1'
							}
						]
					}

				}

				setTimeout(() => {
					this.sharedLoaderService.hideLoader();
				}, 1000);
			}

		});
		

	}

	showDescriptionDialogBox(header) {

		if ( header == "Current ESG State" ) {
			this.dialogBoxheader = "Current ESG State";
		} else if ( header == "Environment" ) {
			this.dialogBoxheader = "Environment";
		} else if ( header == "Financial" ) {
			this.dialogBoxheader = "Financial";
		} else if ( header == "Social" ) {
			this.dialogBoxheader = "Social";
		} else if ( header == "Governance" ) {
			this.dialogBoxheader = "Governance";
		} else if ( header == "Finance" ) {
			this.dialogBoxheader = "Finance";
		}
		this.showDescription = true;
	}

	addToEsgWatchTable() {

		let obj = {
			userId: this.userAuthService?.getUserInfo('dbID'),
			companyNumber: this.companyNumber.toString().toLowerCase(),
			isExist: false
		}
	
		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_ESG_DETAILS', 'saveEsgWatchData', obj ).subscribe( res => {
			let data = res.body;
			if (data['status'] == 200) {
					
				this.msgs = [];
				this.msgs.push({ severity: 'info', summary: this.constantMessages['infoMessage']['companyAlreadyExistInEsgWatchList'] });
				
				this.getEsgData();

				setTimeout(() => {
					this.msgs = [];
				}, 6000);

			} else if (data['status'] == 202) {

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
