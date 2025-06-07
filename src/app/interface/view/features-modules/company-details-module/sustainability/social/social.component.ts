import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import ChartDataLabels from "chartjs-plugin-datalabels";
import { Subscription } from 'rxjs';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';

import { SustainEnvironmentComponent, SustainEsgSummaryComponent, SustainFinanceComponent, SustainGovernanceComponent } from '../../child-components.index';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-social',
	templateUrl: './social.component.html',
	styleUrls: ['./social.component.scss', '../sustainability-component.scss',]
})
export class SustainSocialComponent implements OnInit {

	SustainEsgSummaryComponent = SustainEsgSummaryComponent;

	sustainSocialData: any;

	ChartDataLabelsPlugins = [ ChartDataLabels ];
	allGaugeChartPropertiesContainer: any = {};
	gaugeChartOptionsProps: any;
	gaugeChartPluginProps: any;

	companyNumber: string;
	spinnerBoolean: boolean = false;
	
	esgYearWiseChartOptions: any;
	esgYearWiseChartData: any;
	noOfEmployeesYearWiseChartData: any;

	gaugeAnimationProgressValue: number = 0;
	
	showDescription: boolean = false;
	directorsRemunerationBool: boolean = false;
	dialogBoxheader: string;
	totalEmployees: any;
	totalDirectorsCount: any;
	activeDirectorsCount: any;
	activeSecretary: any;
	resignedDirectorsCount: any;
	directorPieChartData: any;
	doughnutChartOptions: any;
	pscData: any;
	pscPieChartData: any;
	pscChartOptions: any;
	directorsRemunerationYearWiseChartData: any;
	socialDiversityData: any = {};
	socialDiversityCharts: any = {};
	gaugeNeedleCreationContext: any;

	childComponentCommunicationSubscription: Subscription;

	targetRouteComponents = {
		SustainEnvironmentComponent: SustainEnvironmentComponent,
		SustainSocialComponent: SustainSocialComponent,
		SustainGovernanceComponent: SustainGovernanceComponent,
		SustainFinanceComponent: SustainFinanceComponent
	}

	componentStyles: any;
	sustainSocialThemeColors: { baseColor: string, darkColor_1: string, darkColor_2: string, darkColor_3: string, darkColor_4: string, darkColor_5: string, lightColor_1: string, lightColor_2: string, lightColor_3: string, lightColor_4: string, lightColor_5: string };

	constantMessages: any = UserInteractionMessages;
	msgs = [];

	constructor(
		private userAuthService: UserAuthService,
		private dataCommunicatorService: DataCommunicatorService,
		private toNumberSuffix: NumberSuffixPipe,
		private toTitleCasePipe: TitleCasePipe,
		private commonService: CommonServiceService,
		private globalServerCommunication: ServerCommunicationService
	) {
		this.childComponentCommunicationSubscription = this.dataCommunicatorService.$childComponentDataCommunicator.subscribe();
	}

	ngOnInit() {

		this.componentStyles = getComputedStyle( document.getElementsByClassName('sustainSocialContainer')[0] );

		this.sustainSocialThemeColors = {
			baseColor: this.componentStyles.getPropertyValue('--sustain-social-color'),
			darkColor_1: this.componentStyles.getPropertyValue('--sustain-social-color-dark-1'),
			darkColor_2: this.componentStyles.getPropertyValue('--sustain-social-color-dark-2'),
			darkColor_3: this.componentStyles.getPropertyValue('--sustain-social-color-dark-3'),
			darkColor_4: this.componentStyles.getPropertyValue('--sustain-social-color-dark-4'),
			darkColor_5: this.componentStyles.getPropertyValue('--sustain-social-color-dark-5'),
			lightColor_1: this.componentStyles.getPropertyValue('--sustain-social-color-light-1'),
			lightColor_2: this.componentStyles.getPropertyValue('--sustain-social-color-light-2'),
			lightColor_3: this.componentStyles.getPropertyValue('--sustain-social-color-light-3'),
			lightColor_4: this.componentStyles.getPropertyValue('--sustain-social-color-light-4'),
			lightColor_5: this.componentStyles.getPropertyValue('--sustain-social-color-light-5')
		}

		this.dataCommunicatorService.$dataCommunicatorVar.subscribe((res: any) => {
			this.companyNumber = res.companyRegistrationNumber;
		});

		// Doughnut Chart Options
		this.doughnutChartOptions = {
			cutout: 50,
			layout: {
				padding: 15
			},
			plugins: {
				datalabels: {
					display: function(context) {
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
					borderWidth: 4,
					padding: { top: 4, right: 7, bottom: 3, left: 7 },
					anchor: 'end'
				},
				legend: {
					display: false,
				},
				tooltip: {
					enabled: false
				},
			}
		};

		// Registering Multi-Bar Chart Options
		this.esgYearWiseChartOptions = {
			layout: {
				padding: { top: 25, left: 10, right: 10 }
			},
			categoryPercentage: 0.8,
			barPercentage: 0.7,
			scales: {
				y: {
					beginAtZero: true,
					ticks: {
						font: {
							family: 'Roboto',
							style: 'normal',
						},
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
						font:{ 
							size: 12,
							family: 'Roboto',
							style: 'normal',
						},
						padding: 3,
						color: '#bbb',
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
					backgroundColor: this.sustainSocialThemeColors.darkColor_2,
					borderRadius: 3,
					padding: { top: 3, right: 6, bottom: 2, left: 6 },
					formatter: ( value, context ) => {
						value = this.toNumberSuffix.transform( value );
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
					enabled: false
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

		this.spinnerBoolean = true;
		let userId = this.userAuthService?.getUserInfo('dbID');
		 let obj = [ this.companyNumber, userId, 'S' ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_ESG_DETAILS', 'getESGData', obj ).subscribe( res => {
			
			if ( res.body['status'] == 200 ) {

				this.sustainSocialData = res.body['result'];
				this.socialDiversityData = this.sustainSocialData['sCardDetails']['diversityData'];
				
				this.initGaugeChart( 'socialGaugeProperties', this.sustainSocialData['social']['sPercentage'] );

				if ( this.sustainSocialData['esgYearWiseData'] ) {

					let yearWiseChartLabels = [], yearWiseEChartDataValues = [], yearWiseSChartDataValues = [], yearWiseGChartDataValues = [];

					this.sustainSocialData['esgYearWiseData'].sort( ( a, b ) => a.year - b.year );

					for ( let esgBarChartData of this.sustainSocialData['esgYearWiseData'] ) {

						yearWiseChartLabels.push( esgBarChartData.year );
						yearWiseEChartDataValues.push( esgBarChartData.eKeyPercentage );
						yearWiseSChartDataValues.push( esgBarChartData.sKeyPercentage );
						yearWiseGChartDataValues.push( esgBarChartData.gKeyPercentage );
						
					}

					this.esgYearWiseChartData = {
						labels:  yearWiseChartLabels,
						datasets: [
							{
								data: yearWiseSChartDataValues,
								backgroundColor: '#1fcfeb'
							}
						]
					}
				}

				let noOfEmployeesChartLabels = [], noOfEmployeesChartDataValues = [], directorsRemunerationChartLabels = [], directorsRemunerationChartDataValues = []; 
				// No of Employees Details Data Starts //

				
				if ( this.sustainSocialData['sCardDetails'] && this.sustainSocialData['sCardDetails']['noOfEmployees'].length ) {
					
					this.totalEmployees = this.sustainSocialData['sCardDetails'] && this.sustainSocialData['sCardDetails']['noOfEmployees'].length ? this.sustainSocialData['sCardDetails']['noOfEmployees'][0]['value'] : 0;

					this.sustainSocialData['sCardDetails']['noOfEmployees'].sort( ( a, b ) => a.year - b.year );

					for( let numberofEmployeesBarChartData of  this.sustainSocialData['sCardDetails']['noOfEmployees']) {
						noOfEmployeesChartLabels.push( numberofEmployeesBarChartData.year );
						noOfEmployeesChartDataValues.push( numberofEmployeesBarChartData.value );
					}
				}
				
				this.noOfEmployeesYearWiseChartData = {
					labels:  noOfEmployeesChartLabels,
					datasets: [
						{
							data: noOfEmployeesChartDataValues,
							backgroundColor: this.sustainSocialThemeColors.baseColor,
							hoverBackgroundColor: this.sustainSocialThemeColors.darkColor_2
						}
					]
				}

				// No of Employees Details Data Ends //

				// Directors Remuneration Starts //

				if ( this.sustainSocialData['sCardDetails']['directorsRemuneration'] && this.sustainSocialData['sCardDetails']['directorsRemuneration'].filter(val => +val.value).length > 0 ) {

					this.directorsRemunerationBool = true;

					this.sustainSocialData['sCardDetails']['directorsRemuneration'].sort( ( a, b ) => a.year - b.year );

					for( let directorsRemunerationBarChartData of  this.sustainSocialData['sCardDetails']['directorsRemuneration']) {
						directorsRemunerationChartLabels.push( directorsRemunerationBarChartData.year );
						directorsRemunerationChartDataValues.push( directorsRemunerationBarChartData.value );
					}
					
					this.directorsRemunerationYearWiseChartData = {
						labels:  directorsRemunerationChartLabels,
						datasets: [
							{
								data: directorsRemunerationChartDataValues,
								backgroundColor: this.sustainSocialThemeColors.baseColor,
								hoverBackgroundColor: this.sustainSocialThemeColors.darkColor_2
							}
						]
					}
				} else {
					this.directorsRemunerationBool = false;
				}
				
				// Directors Remuneration Ends // 

				// No of Directors Details Data Starts //

				this.totalDirectorsCount = this.sustainSocialData['sCardDetails']['totalDirectorsCount'];
				
				if ( 'activeDirectorsCount' in this.sustainSocialData['sCardDetails'] ) {
					this.activeDirectorsCount = this.sustainSocialData['sCardDetails']['activeDirectorsCount'];
				}
				if ( 'resignedDirectorsCount' in this.sustainSocialData['sCardDetails']){
					this.resignedDirectorsCount = this.sustainSocialData['sCardDetails']['resignedDirectorsCount'];
				}
				if ( 'activeSecretary' in this.sustainSocialData['sCardDetails']){
					this.activeSecretary = this.sustainSocialData['sCardDetails']['activeSecretary'];
				}

				this.directorPieChartData = {
					labels: ['Active', 'Resigned', 'Secretary'],
					datasets: [
						{
							data: [ this.activeDirectorsCount, this.resignedDirectorsCount, this.activeSecretary ],
							backgroundColor: [ "#1ab394", "#b00020", "#03a9f4" ],
							hoverBackgroundColor: [ "#1ab394", "#b00020", "#03a9f4" ]
						}
					]    
				};

				// No of Directors Details Data Ends //

				// No of PSC Details Data Starts //

				this.pscData = this.sustainSocialData['sCardDetails']['pscData'];

				let pscChartLabels = [], pscChartDataset = [];

				for ( let pscKey in this.pscData ) {
					if ( pscKey !== 'noOfPsc' && this.pscData[ pscKey ] ) {
						pscChartLabels.push( this.commonService.camelCaseToTitleCaseStr( pscKey ) );
						pscChartDataset.push( this.pscData[ pscKey ] );
					}
				}

				this.pscPieChartData = {
					labels: pscChartLabels,
					datasets: [
						{
							data: pscChartDataset,
							backgroundColor: [ this.sustainSocialThemeColors.darkColor_2, this.sustainSocialThemeColors.darkColor_1, this.sustainSocialThemeColors.baseColor, this.sustainSocialThemeColors.lightColor_1, this.sustainSocialThemeColors.lightColor_2 ],
							hoverBackgroundColor: [ this.sustainSocialThemeColors.darkColor_3, this.sustainSocialThemeColors.darkColor_2, this.sustainSocialThemeColors.darkColor_1, this.sustainSocialThemeColors.baseColor, this.sustainSocialThemeColors.lightColor_1 ]
						}
					]    
				};

				// No of PSC Details Data Ends //
				
				// Diversity Chart Data Start //

				this.socialDiversityCharts['ageDiversity'] = {
					labels: [ 'Less Than 40', 'Between 40 T0 60', 'Greater Than 60' ],
					datasets: [
						{
							data: [ this.socialDiversityData.age.ageLessThan40, this.socialDiversityData.age.agebetween40to60, this.socialDiversityData.age.ageGreaterThen60, this.socialDiversityData.age.ageNA ],
							backgroundColor: [ this.sustainSocialThemeColors.darkColor_3, this.sustainSocialThemeColors.darkColor_2, this.sustainSocialThemeColors.baseColor, this.sustainSocialThemeColors.lightColor_2 ],
							hoverBackgroundColor: [ this.sustainSocialThemeColors.darkColor_4, this.sustainSocialThemeColors.darkColor_3, this.sustainSocialThemeColors.darkColor_2, this.sustainSocialThemeColors.lightColor_1 ]
						}
					]    
				};

				this.socialDiversityCharts['genderDiversity'] = {
					labels: [ 'Male', 'Female', 'Not Specified' ],
					datasets: [
						{
							data: [ this.socialDiversityData.maleDirector, this.socialDiversityData.femaleDirector, this.socialDiversityData.hasOwnProperty('unknownDirector') && this.socialDiversityData.unknownDirector ? this.socialDiversityData.unknownDirector : 0 ],
							backgroundColor: [ this.sustainSocialThemeColors.darkColor_2, this.sustainSocialThemeColors.baseColor, this.sustainSocialThemeColors.lightColor_2 ],
							hoverBackgroundColor: [ this.sustainSocialThemeColors.darkColor_3, this.sustainSocialThemeColors.darkColor_1, this.sustainSocialThemeColors.lightColor_1 ]
						}
					]    
				};

				let ethnicityDoughnutLabels = [], ethnicityDoughnutData = [], doughnutBgColor = [];

				for ( let ethnicity in this.socialDiversityData.nationality ) {

					if ( this.socialDiversityData.nationality[ ethnicity ] ) {
						
						if ( ethnicity == 'nationalityNA' ) {
							ethnicityDoughnutLabels.push( 'Not Specified' );
						} else {
							ethnicityDoughnutLabels.push( this.toTitleCasePipe.transform( ethnicity ) );
						}
						
						ethnicityDoughnutData.push( this.socialDiversityData.nationality[ ethnicity ] );
						doughnutBgColor.push( Object.values( this.sustainSocialThemeColors )[ Math.floor( Math.random() * Object.values( this.sustainSocialThemeColors ).length ) ] );

					}

				}

				this.socialDiversityCharts['ethnicityDiversity'] = {
					labels: ethnicityDoughnutLabels,
					datasets: [
						{
							data: ethnicityDoughnutData,
							backgroundColor: doughnutBgColor,
							hoverBackgroundColor: doughnutBgColor
						}
					]    
				};

				// Diversity Chart Data Ends //

			}

			this.spinnerBoolean = false;

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
