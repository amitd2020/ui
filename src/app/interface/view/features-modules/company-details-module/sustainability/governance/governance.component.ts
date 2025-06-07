import { Component, OnInit } from '@angular/core';

import ChartDataLabels from "chartjs-plugin-datalabels";
import { Subscription } from 'rxjs';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { subscribedPlan } from 'src/environments/environment';

import { SustainEnvironmentComponent, SustainEsgSummaryComponent, SustainFinanceComponent, SustainSocialComponent } from '../../child-components.index';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-governance',
	templateUrl: './governance.component.html',
	styleUrls: ['../sustainability-component.scss', './governance.component.scss']
})
export class SustainGovernanceComponent implements OnInit {

	SustainEsgSummaryComponent = SustainEsgSummaryComponent;

	sustainGovernanceData: any;

	ChartDataLabelsPlugins = [ ChartDataLabels ];
	allGaugeChartPropertiesContainer: any = {};
	gaugeChartOptionsProps: any;
	gaugeChartPluginProps: any;

	companyNumber: string;
	// spinnerBoolean: boolean = false;
	
	esgYearWiseChartOptions: any;
	
	showDescription: boolean = false;
	dialogBoxheader: string;
	totalCorporateLandCount: any;
	totalChargesCount:any;
	totalShareHolderCount:any;
	shareHolderPieChartData:any;
	shareHoldersChartOptions:any;
	totalCreditorsCount:any;
	totalCreditorsAmount:any;
	creditorsChartOptions:any;
	creditorsPieChartData:any;
	totalCCJCount:any;
	totalDebtorCount:any;
	totalDebtorAmount:any;
	auditorData:any;
	wagesAndSalariesData:any;
	wagesAndSalariesYearWiseChartData: any;
	gaugeNeedleCreationContext: any;
	wagesAndSalariesDataBool: boolean = false;

	gaugeAnimationProgressValue: number = 0;

	childComponentCommunicationSubscription: Subscription;

	targetRouteComponents = {
		SustainEnvironmentComponent: SustainEnvironmentComponent,
		SustainSocialComponent: SustainSocialComponent,
		SustainGovernanceComponent: SustainGovernanceComponent,
		SustainFinanceComponent: SustainFinanceComponent
	}

	//Variables for Table Start//
	companyData: any;
	companyCommentryData: Array<any> = undefined;
	companyCommentaryColumn: { field: string; header: string; minWidth: string; maxWidth: string; textAlign: string; }[];
	commentry: any[];
	companyRegistrationNumber: any;

	subscribedPlanModal: any = subscribedPlan;
	patentTradeColumns = [];
	patentTradeData: Array<any> = undefined;
	currentPlan: unknown;

	// @Input() companyData: any;

	innovateGrantData: Array<any> = undefined;
	innovateGrantColumns: { field: string; header: string;  minWidth: string; maxWidth: string; textAlign: string; }[];

	//Variables for Table End//

	componentStyles: any;
	sustainGovernanceThemeColors: { baseColor: string, darkColor_1: string, darkColor_2: string, darkColor_3: string, darkColor_4: string, darkColor_5: string, lightColor_1: string, lightColor_2: string, lightColor_3: string, lightColor_4: string, lightColor_5: string };
	
	constantMessages: any = UserInteractionMessages;
	msgs = [];
	selectedGlobalCurrency: string = 'GBP';

	constructor(
		public userAuthService: UserAuthService,
		private dataCommunicatorService: DataCommunicatorService,
		private toNumberSuffix: NumberSuffixPipe,
		private commonService: CommonServiceService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService

	) {

		this.childComponentCommunicationSubscription = this.dataCommunicatorService.$childComponentDataCommunicator.subscribe();

	}

	ngOnInit() {

		this.componentStyles = getComputedStyle( document.getElementsByClassName('sustainGovernanceContainer')[0] );
		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';
		
		this.sustainGovernanceThemeColors = {
			baseColor: this.componentStyles.getPropertyValue('--sustain-governance-color'),
			darkColor_1: this.componentStyles.getPropertyValue('--sustain-governance-color-dark-1'),
			darkColor_2: this.componentStyles.getPropertyValue('--sustain-governance-color-dark-2'),
			darkColor_3: this.componentStyles.getPropertyValue('--sustain-governance-color-dark-3'),
			darkColor_4: this.componentStyles.getPropertyValue('--sustain-governance-color-dark-4'),
			darkColor_5: this.componentStyles.getPropertyValue('--sustain-governance-color-dark-5'),
			lightColor_1: this.componentStyles.getPropertyValue('--sustain-governance-color-light-1'),
			lightColor_2: this.componentStyles.getPropertyValue('--sustain-governance-color-light-2'),
			lightColor_3: this.componentStyles.getPropertyValue('--sustain-governance-color-light-3'),
			lightColor_4: this.componentStyles.getPropertyValue('--sustain-governance-color-light-4'),
			lightColor_5: this.componentStyles.getPropertyValue('--sustain-governance-color-light-5')
		}

		this.dataCommunicatorService.$dataCommunicatorVar.subscribe( ( res: any ) => this.companyData = res );
		this.currentPlan = this.userAuthService?.getUserInfo('planId');
		this.companyNumber = this.companyData.companyRegistrationNumber;

		this.patentTradeColumns = [
			{ field: 'ApplicationNo', header: 'Application No', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'CaseID', header: 'Case Id', minWidth: '130px', maxWidth: '130px', textAlign: 'right' },
			{ field: 'CaseStatus', header: 'Case Status', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'CountryOfIncorporation', header: 'Incorporated Country', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
			{ field: 'DateFiled', header: 'Filed Date', minWidth: '180px', maxWidth: '180px', textAlign: 'center' },
			{ field: 'Title', header: 'Title', minWidth: '250px', maxWidth: 'none', textAlign: 'left' }
		];

		this.dataCommunicatorService.$dataCommunicatorVar.subscribe((res: any) => {
			this.companyNumber = res.companyRegistrationNumber;
		});

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
							color: '#bbb',
						},
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
					backgroundColor: this.sustainGovernanceThemeColors.darkColor_2,
					borderRadius: 3,
					padding: { top: 3, right: 6, bottom: 2, left: 6 },
					formatter: ( value, context ) => {
						value = this.toNumberSuffix.transform( value, 2 );
						return value;
					}
				},
				tooltip: {
					enabled: false
				},
				legend: {
					display: false,
				},
				title: {
					display: false
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

		this.innovateGrantColumns = [
			{ field: 'competitionReference', header: 'Competition Reference', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'competitionTitle', header: 'Competition Title', minWidth: '220px', maxWidth: '220px', textAlign: 'left' },
			{ field: 'programmeTitle', header: 'Programme Title', minWidth: '220px', maxWidth: '220px', textAlign: 'left' },
			{ field: 'sector', header: 'Sector', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'applicationNumber', header: 'Application Number', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
			{ field: 'projectNumber', header: 'Project Number', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
			{ field: 'projectTitle', header: 'Project Title', minWidth: '220px', maxWidth: '220px', textAlign: 'left' },
			{ field: 'competitionYear', header: 'Competition Year', minWidth: '100px', maxWidth: '100px', textAlign: 'center' },
			{ field: 'innovateUKProductType', header: 'Product Type', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'participantName', header: 'Participant Name', minWidth: '200px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'isLeadParticipant', header: 'Is Lead Participant', minWidth: '100px', maxWidth: '100px', textAlign: 'center' },
			{ field: 'crn', header: 'CRN', minWidth: '100px', maxWidth: '100px', textAlign: 'center' },
			{ field: 'projectStartDate', header: 'Start Date', minWidth: '100px', maxWidth: '100px', textAlign: 'center' },
			{ field: 'projectEndDate', header: 'End Date', minWidth: '100px', maxWidth: '100px', textAlign: 'center' },
			{ field: 'grantOffered', header: 'Grant Offered', minWidth: '120px', maxWidth: 'none', textAlign: 'right' },
			{ field: 'totalCosts', header: 'Total Cost', minWidth: '120px', maxWidth: '120px', textAlign: 'right' },
			{ field: 'actualSpendToDate', header: 'Actual Spend To Date', minWidth: '120px', maxWidth: '120px', textAlign: 'right' },
			{ field: 'participantWithdrawnFromProject', header: 'Participant Withdrawn From Project', minWidth: '110px', maxWidth: '110px', textAlign: 'left' },
			{ field: 'projectStatus', header: 'Project Status', minWidth: '110px', maxWidth: '110px', textAlign: 'left' },
			{ field: 'enterpriseSize', header: 'Enterprise Size', minWidth: '120px', maxWidth: '120px', textAlign: 'left' },
			{ field: 'postcode', header: 'Post Code', minWidth: '110px', maxWidth: '110px', textAlign: 'left' },
			{ field: 'addressRegion', header: 'Address Region', minWidth: '110px', maxWidth: '110px', textAlign: 'left' },
			{ field: 'addressLEP', header: 'Address LEP', minWidth: '110px', maxWidth: '110px', textAlign: 'left' },
			{ field: 'inMultipleLEPs', header: 'In Multiple LEPs', minWidth: '110px', maxWidth: '110px', textAlign: 'left' },
			{ field: 'industrialStrategyChallengeFund', header: 'Industrial Strategy Challenge Fund', minWidth: '110px', maxWidth: '110px', textAlign: 'left' },
			{ field: 'publicDescription', header: 'Public Description', minWidth: '400px', maxWidth: 'none', textAlign: 'left' }
		];

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

		let obj = [ this.companyNumber, userId, 'G' ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_ESG_DETAILS', 'getESGData', obj ).subscribe( res => {

			if (res.body['status'] == 200) {

				this.sustainGovernanceData = res.body['result'];

				this.initGaugeChart('governanceGaugeProperties', this.sustainGovernanceData['governance']['gPercentage']);

				this.innovateGrantData = this.sustainGovernanceData['gCardDetails']['innovateData'] ? this.sustainGovernanceData['gCardDetails']['innovateData'] : [];
								
				if (this.innovateGrantData) {
					for (let innovateGrantDataObj of this.innovateGrantData) {
						
						innovateGrantDataObj.projectStartDate = this.commonService.changeToDate(innovateGrantDataObj.projectStartDate);
						innovateGrantDataObj.projectEndDate = this.commonService.changeToDate(innovateGrantDataObj.projectEndDate);
						
					}
				}

				this.totalCorporateLandCount = this.sustainGovernanceData['gCardDetails']['corporateLandData'];
				this.totalChargesCount = this.sustainGovernanceData['gCardDetails']['chargesCount'];
				this.totalShareHolderCount = this.sustainGovernanceData['gCardDetails']['shareHolderCount'];
				this.totalCreditorsCount = this.sustainGovernanceData['gCardDetails']['creditorCount'];
				this.totalCreditorsAmount = this.sustainGovernanceData['gCardDetails']['creditorAmount'];
				this.totalCCJCount = this.sustainGovernanceData['gCardDetails']['CCJCount'];
				this.totalDebtorCount = this.sustainGovernanceData['gCardDetails']['debtorCount'];
				this.totalDebtorAmount = this.sustainGovernanceData['gCardDetails']['debtorAmount'];
				this.auditorData = this.sustainGovernanceData['gCardDetails'] && this.sustainGovernanceData['gCardDetails']['auditorData'] ? this.sustainGovernanceData['gCardDetails']['auditorData'][0] : "";
				this.wagesAndSalariesData = this.sustainGovernanceData['gCardDetails']['wagesAndSalaries'];


				// Wages and Salries Starts //

				let wagesAndSalariesChartLabels = [], wagesAndSalariesChartDataValues = [];
		
				if (this.sustainGovernanceData['gCardDetails'] && this.sustainGovernanceData['gCardDetails']['wagesAndSalaries'] && this.sustainGovernanceData['gCardDetails']['wagesAndSalaries'].length  ) {

					this.sustainGovernanceData['gCardDetails']['wagesAndSalaries'].sort((a, b) => a.year - b.year);

					for (let wagesAndSalariesBarChartData of this.sustainGovernanceData['gCardDetails']['wagesAndSalaries']) {

						this.sustainGovernanceData['gCardDetails']['wagesAndSalaries'].sort((a, b) => a.year - b.year);

						wagesAndSalariesChartLabels.push(wagesAndSalariesBarChartData.year);
						wagesAndSalariesChartDataValues.push(wagesAndSalariesBarChartData.value);

					}
				}
				
				if( this.wagesAndSalariesData && this.wagesAndSalariesData.filter(val => +val.value).length > 0 ) {

					this.wagesAndSalariesDataBool = true;

					this.wagesAndSalariesYearWiseChartData = {
						labels:  wagesAndSalariesChartLabels,
						datasets: [
							{
								data: wagesAndSalariesChartDataValues,
								backgroundColor: this.sustainGovernanceThemeColors.baseColor,
								hoverBackgroundColor: this.sustainGovernanceThemeColors.darkColor_2
							}
						]
					}
				} else {
					this.wagesAndSalariesDataBool = false;
				}

				// Wages and Salries Ends //

				// this.spinnerBoolean = false;
				this.sharedLoaderService.hideLoader();

				this.getCompanyPatentData();

				if ( this.companyData.hasCompanyCommentary ) {
		
					this.getCompanyCommentaryData(this.companyData.companyCommentary);
		
				}
				
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

	getCompanyCommentaryData(data) {

		this.sharedLoaderService.showLoader();

		this.companyCommentryData = data;
		this.commentry = this.companyCommentryData;
		this.companyCommentaryColumn = [
			{ field: 'commentaryText', header: 'Commentary', minWidth: '160px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'commentaryImpact', header: 'Impact', minWidth: '250px', maxWidth: '250px', textAlign: 'center' },
			{ field: 'dateLogged', header: 'Date', minWidth: '250px', maxWidth: '250px', textAlign: 'center' }
		];

		for (let i = 0; i < this.companyCommentryData.length; i++) {
			if (this.companyCommentryData[i]["commentaryText"] !== null || this.companyCommentryData[i]["commentaryText"] !== "") {
				this.companyCommentryData[i]['commentaryText'] = this.companyCommentryData[i]["commentaryText"].replace(/[!@#$%^&*()�,.?";:{}|<>]/g, "")
			}
		}
		this.sharedLoaderService.hideLoader();

	}

	getCompanyPatentData() {

		// this.spinnerBoolean = true;
		this.sharedLoaderService.showLoader();


		let cmpNo = [ this.companyData.companyRegistrationNumber ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_COMPANY_DETAILS', 'companyPatentData', cmpNo ).subscribe( res => {
			
			if (res.body.status == 200) {
				this.patentTradeData = res.body.result;
				this.patentTradeData = this.patentTradeData.map((obj) => {
					obj.DateFiled = this.commonService.changeToDate(obj.DateFiled);
					return obj;
				});
				//date sorting
				this.patentTradeData = this.patentTradeData.sort((a, b): any => {
					let prevDate: any = a.DateFiled,
						newDate: any = b.DateFiled;
					if (prevDate < newDate) return 1;
					if (prevDate > newDate) return -1;
				});
				// this.spinnerBoolean = false;
				this.sharedLoaderService.hideLoader();

			}
		});

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
