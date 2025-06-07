import { Component, OnInit } from '@angular/core';

import ChartDataLabels from "chartjs-plugin-datalabels";
import { Subscription } from 'rxjs';

import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { DataCommunicatorService } from '../../data-communicator.service';

import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { BusinessTravelCarbonCalculationFieldsModel, BusinessTravelCarbonCalculationFieldsModelForTab, businessTravelCarbonCalulatedFields, EnergyCarbonCalculationFieldsModel, EnergyCarbonCalculationFieldsModelForTab, energyCarbonCalulatedFields, FlightCarbonCalculationFieldsModel, FlightCarbonCalculationFieldsModelForTab, flightCarbonCalulatedFields, materialUseCarbonCalculationFields, MaterialUseCarbonCalculationFieldsModel, wasteManagementCarbonCalculationFields, WasteManagementCarbonCalculationFieldsModel } from '../../../carbon-calculator/carbon-calculator.constant';

import { SustainEsgSummaryComponent, SustainFinanceComponent, SustainGovernanceComponent, SustainSocialComponent } from '../../child-components.index';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-environment',
	templateUrl: './environment.component.html',
	styleUrls: ['../sustainability-component.scss', './environment.component.scss']
})
export class SustainEnvironmentComponent implements OnInit {

	SustainEsgSummaryComponent = SustainEsgSummaryComponent;
	
	sustainEnvironmentalData: any;

	ChartDataLabelsPlugin = [ChartDataLabels];
	allGaugeChartPropertiesContainer: any = {};
	gaugeChartOptionsProps: any;
	gaugeChartPluginProps: any;
	esgYearWiseChartOptions: any;
	esgYearWiseChartData: any;
	showDescription: boolean = false;
	dialogBoxheader: string;
	childComponentCommunicationSubscription: Subscription;
	targetRouteComponents = {
		SustainEnvironmentComponent: SustainEnvironmentComponent,
		SustainSocialComponent: SustainSocialComponent,
		SustainGovernanceComponent: SustainGovernanceComponent,
		SustainFinanceComponent: SustainFinanceComponent
	}

	// Variables for Table start//

	enforcementActionColumns: any[];
	wasteOperationsColumns: any[];
	waterDischargesColumns: any[];
	industrialInstallationColumns: any[];
	wasteExemptionsColumns: any[];
	endOfLifeVehiclesColumns: any[];
	scrapMetalDealersColumns: any[];
	floodRiskExemptionsColumns: any[];
	radioactiveSubstanceColumns: any[];
	wasteCarriersBrokersColumns: any[];
    environmentComplianceScoreColumns: any[];

	gaugeAnimationProgressValue: number = 0;

	enforcementActionData: any;
	wasteOperationsData: any;
	waterDischargesData: any;
	industrialInstallationData: any;
	wasteExemptionsData: any;
	endOfLifeVehiclesData: any;
	scrapMetalDealersData: any;
	floodRiskExemptionsData: any;
	radioactiveSubstanceData: any;
	wasteCarriersBrokersData: any;
    environmentComplianceScoreData: any;
	gaugeNeedleCreationContext: any;
	companyNumber: string = '';

	// Variables for Table End//

	componentStyles: any;
	sustainEnvironmentThemeColors: { baseColor: string, darkColor_1: string, darkColor_2: string, darkColor_3: string, darkColor_4: string, darkColor_5: string, lightColor_1: string, lightColor_2: string, lightColor_3: string, lightColor_4: string, lightColor_5: string };

	constantMessages: any = UserInteractionMessages;
	msgs = [];

	energyCarbonCalulatedFields = energyCarbonCalulatedFields;

	businessTravelCarbonCalulatedFields = businessTravelCarbonCalulatedFields;

	flightCarbonCalulatedFields = flightCarbonCalulatedFields;

    materialUseCarbonCalculationFields = materialUseCarbonCalculationFields;

    wasteManagementCarbonCalculationFields = wasteManagementCarbonCalculationFields;

    savedCarbonCalculatedData: Array<any> = [];

	currentCarbonData: EnergyCarbonCalculationFieldsModel & BusinessTravelCarbonCalculationFieldsModel & FlightCarbonCalculationFieldsModel & MaterialUseCarbonCalculationFieldsModel & WasteManagementCarbonCalculationFieldsModel;
	previousCarbonData: EnergyCarbonCalculationFieldsModel & BusinessTravelCarbonCalculationFieldsModel & FlightCarbonCalculationFieldsModel & MaterialUseCarbonCalculationFieldsModel & WasteManagementCarbonCalculationFieldsModel;

	carbonCalulatedFields: EnergyCarbonCalculationFieldsModelForTab & BusinessTravelCarbonCalculationFieldsModelForTab & FlightCarbonCalculationFieldsModelForTab & MaterialUseCarbonCalculationFieldsModel & WasteManagementCarbonCalculationFieldsModel = {
        ...this.energyCarbonCalulatedFields,
        ...this.businessTravelCarbonCalulatedFields,
        ...this.flightCarbonCalulatedFields,
        ...this.materialUseCarbonCalculationFields,
        ...this.wasteManagementCarbonCalculationFields
    };

	currentCalculatedCarbonValue: { label: string, method: string, value: Number, icon: string }[] = [];
	
	constructor(
		public userAuthService: UserAuthService,
		private dataCommunicatorService: DataCommunicatorService,
		private toNumberSuffix: NumberSuffixPipe,
		public commonService: CommonServiceService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService


	) {

		this.childComponentCommunicationSubscription = this.dataCommunicatorService.$childComponentDataCommunicator.subscribe();

	}

	ngOnInit() {

		this.dataCommunicatorService.$dataCommunicatorVar.subscribe((res: any) => {
			this.companyNumber = res.companyRegistrationNumber;
            this.environmentComplianceScoreData = res.environmentComplianceScore;
		});

		this.componentStyles = getComputedStyle( document.getElementsByClassName('sustainEnvironmentContainer')[0] );

		this.sustainEnvironmentThemeColors = {
			baseColor: this.componentStyles.getPropertyValue('--sustain-environment-color'),
			darkColor_1: this.componentStyles.getPropertyValue('--sustain-environment-color-dark-1'),
			darkColor_2: this.componentStyles.getPropertyValue('--sustain-environment-color-dark-2'),
			darkColor_3: this.componentStyles.getPropertyValue('--sustain-environment-color-dark-3'),
			darkColor_4: this.componentStyles.getPropertyValue('--sustain-environment-color-dark-4'),
			darkColor_5: this.componentStyles.getPropertyValue('--sustain-environment-color-dark-5'),
			lightColor_1: this.componentStyles.getPropertyValue('--sustain-environment-color-light-1'),
			lightColor_2: this.componentStyles.getPropertyValue('--sustain-environment-color-light-2'),
			lightColor_3: this.componentStyles.getPropertyValue('--sustain-environment-color-light-3'),
			lightColor_4: this.componentStyles.getPropertyValue('--sustain-environment-color-light-4'),
			lightColor_5: this.componentStyles.getPropertyValue('--sustain-environment-color-light-5')
		}

		// Registering Multi-Bar Chart Options
		this.esgYearWiseChartOptions = {
			layout: {
				padding: { left: 10, right: 10 }
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
							size: 14,
							family: 'Roboto',
							style: 'normal',
						},
						color: '#bbb',
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
					display: false,
				},
				tooltip: {
					enabled: true,
					callbacks: {
						label: function ( tooltipItem ) {
							return tooltipItem.formattedValue;
						}
					}
				},
				title: {
					display: false
				},
				legend: {
					display: false,
				}
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

		this.environmentComplianceScoreColumns = [
            { field: 'site_name', header: 'Site', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
            { field: 'regulatory_sector', header: 'Sector', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
            { field: 'regulatory_sub_sector', header: 'Sub Sector', minWidth: '230px', maxWidth: '230px', textAlign: 'left' },
            { field: 'compliance_rating', header: 'Compliance Rating', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
        ];

		this.getEcsData();

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
		let obj = [ this.companyNumber, userId, 'E' ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_ESG_DETAILS', 'getESGData', obj ).subscribe( res => {
			
			if ( res.body['status'] == 200 ) {

				this.sustainEnvironmentalData = res.body['result'];
			
				this.initGaugeChart( 'environmentGaugeProperties', this.sustainEnvironmentalData['environmental']['ePercentage'] );

				if ( this.sustainEnvironmentalData['esgYearWiseData'] ) {

					let yearWiseChartLabels = [], yearWiseEChartDataValues = [], yearWiseSChartDataValues = [], yearWiseGChartDataValues = [];

					this.sustainEnvironmentalData['esgYearWiseData'].sort( ( a, b ) => a.year - b.year );

					for ( let esgBarChartData of this.sustainEnvironmentalData['esgYearWiseData'] ) {

						yearWiseChartLabels.push( esgBarChartData.year );
						yearWiseEChartDataValues.push( esgBarChartData.eKeyPercentage );
						yearWiseSChartDataValues.push( esgBarChartData.sKeyPercentage );
						yearWiseGChartDataValues.push( esgBarChartData.gKeyPercentage );
						
					}

					this.esgYearWiseChartData = {
						labels: yearWiseChartLabels,
						datasets: [
							{
								data: yearWiseEChartDataValues,
								backgroundColor: '#0fd569',
								borderWidth: 1,
							}
						]
					}

				}

				this.getSavedCarbonCalculatedData( this.companyNumber );

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

	getEcsData() {
		let obj = [ this.companyNumber ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getEcsData', obj ).subscribe( res => {
			let data = res.body;
			if ( data['results']['enforcementActionData'] ) {

				this.enforcementActionColumns = [
					{ field: 'registeredLink', header: 'Registered Link', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'offenderLink', header: 'Offender Link', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
					{ field: 'actionDate', header: 'Action Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'offenceLink', header: 'Offence Link', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
					{ field: 'offenceLegislationTitle', header: 'Offence Legislation Title', minWidth: '230px', maxWidth: '230px', textAlign: 'left' },
					{ field: 'offenceActionLink', header: 'Offence Action Link', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
					{ field: 'offenceActionLabel', header: 'Offence Action Label', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
					{ field: 'offenceAgencyFunctionLink', header: 'Offence Agency Function Link', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
					{ field: 'offenceAgencyFunctionLabel', header: 'Offence Agency Function Label', minWidth: '250px', maxWidth: '250px', textAlign: 'left' }
				];

				this.enforcementActionData = data['results']['enforcementActionData'];
			}

			if ( data['results']['wasteOperationsData'] ) {

				this.wasteOperationsColumns = [
					{ field: 'registeredLink', header: 'Registered Link', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'registrationNumber', header: 'Registration Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
					{ field: 'issuedDate', header: 'Issued Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'notation', header: 'Notation', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
					{ field: 'registerLabel', header: 'Rgistration Label', minWidth: '300px', maxWidth: '300px', textAlign: 'left' },
					{ field: 'statusComment', header: 'Status Comment', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
					{ field: 'wasteManagementLicenceNumber', header: 'Licence Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' }
				];

				this.wasteOperationsData = data['results']['wasteOperationsData'];

			}

			if ( data['results']['waterDischargesData'] ) {

				this.waterDischargesColumns = [
					{ field: 'registeredLink', header: 'Registered Link', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'registrationNumber', header: 'Registration Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
					{ field: 'effectiveDate', header: 'Effective Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'revocationDate', header: 'Revoation Date', minWidth: '120px', maxWidth: '120px', textAlign: 'left' },
					{ field: 'notation', header: 'Notation', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
					{ field: 'registerLabel', header: 'Register Label', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
					{ field: 'effluentTypeComment', header: 'Comment', minWidth: '200px', maxWidth: '200px', textAlign: 'left' }
				];

				this.waterDischargesData = data['results']['waterDischargesData'];

			}

			if ( data['results']['industrialInstallationData'] ) {

				this.industrialInstallationColumns = [
					{ field: 'registeredLink', header: 'Registered Link', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'registrationNumber', header: 'Registration Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
					{ field: 'registrationDate', header: 'Registration Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'notation', header: 'Notation', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
					{ field: 'registerLabel', header: 'Register Label', minWidth: '230px', maxWidth: '230px', textAlign: 'left' },
					{ field: 'activityComment', header: 'Activity Comment', minWidth: '350px', maxWidth: '350px', textAlign: 'left' },
					{ field: 'activity', header: 'Activity', minWidth: '350px', maxWidth: '350px', textAlign: 'left' }
				];

				this.industrialInstallationData = data['results']['industrialInstallationData'];

			}

			if ( data['results']['wasteExemptionsData'] ) {

				this.wasteExemptionsColumns = [
					{ field: 'registeredLink', header: 'Registered Link', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'registrationNumber', header: 'Registration Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
					{ field: 'exemptionExpiryDate', header: 'Exemption Expiry Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'exemptionRegistrationDate', header: 'Exemption Registered Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'exemptionRegistrationType', header: 'Exemption Registered Type', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
					{ field: 'exemptionRegistrationTypeNotation', header: 'Notation', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
					{ field: 'exemptionRegistrationTypeCodeCategoryPrefLabel', header: 'Exemption Registration Code Label', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
					{ field: 'exemptionRegistrationTypeprefLabel', header: 'Exemption Registration Label', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
					{ field: 'exemptionRegistrationTypeDescription', header: 'Description', minWidth: '200px', maxWidth: '200px', textAlign: 'left' }
				];

				this.wasteExemptionsData = data['results']['wasteExemptionsData'];

			}

			if ( data['results']['endOfLifeVehiclesData'] ) {

				this.endOfLifeVehiclesColumns = [
					{ field: 'eawmlNo', header: 'EAWML No.', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'eprPermitRef', header: 'Permit Reference', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
					{ field: 'dateIssued', header: 'Issued Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'siteName', header: 'Site Name', minWidth: '230px', maxWidth: '230px', textAlign: 'left' },
					{ field: 'telephone', header: 'Telephone', minWidth: '250px', maxWidth: '250px', textAlign: 'left' }
				];

				this.endOfLifeVehiclesData = data['results']['endOfLifeVehiclesData'];

			}

			if ( data['results']['scrapMetalDealersData'] ) {

				this.scrapMetalDealersColumns = [
					{ field: 'registeredLink', header: 'Registered Link', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'registrationNumber', header: 'Registration Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
					{ field: 'expiryDate', header: 'Expiry Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'notation', header: 'Notation', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
					{ field: 'registerLabel', header: 'Register Label', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
					{ field: 'registrationTypeLabel', header: 'Registration Type Label', minWidth: '130px', maxWidth: '130px', textAlign: 'left' }
				];

				this.scrapMetalDealersData = data['results']['scrapMetalDealersData'];

			}

			if ( data['results']['floodRiskExemptionsData'] ) {

				this.floodRiskExemptionsColumns = [
					{ field: 'registeredLink', header: 'Registered Link', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'registrationNumber', header: 'Registration Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
					{ field: 'registerLabel', header: 'Register Label', minWidth: '200px', maxWidth: '200px', textAlign: 'center' },
					{ field: 'registrationTypeNotation', header: 'Notation', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
					{ field: 'registrationTypePrefLabel', header: 'Registration Type Label', minWidth: '150px', maxWidth: '150px', textAlign: 'left' }
				];

				this.floodRiskExemptionsData = data['results']['floodRiskExemptionsData'];

			}

			if ( data['results']['radioactiveSubstanceData'] ) {

				this.radioactiveSubstanceColumns = [
					{ field: 'registeredLink', header: 'Registered Link', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'registrationNumber', header: 'Registration Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
					{ field: 'effectiveDate', header: 'Effective Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'registerLabel', header: 'Register Label', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'registrationTypeLabel', header: 'Registration Type Label', minWidth: '230px', maxWidth: '230px', textAlign: 'left' }
				];

				this.radioactiveSubstanceData = data['results']['radioactiveSubstanceData'];

			}

			if ( data['results']['wasteCarriersBrokersData'] ) {

				this.wasteCarriersBrokersColumns = [
					{ field: 'registeredLink', header: 'Registered Link', minWidth: '250px', maxWidth: 'none', textAlign: 'left' },
					{ field: 'registrationNumber', header: 'Registration Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
					{ field: 'registrationDate', header: 'Registration Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'expiryDate', header: 'Expiry Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
					{ field: 'registerLabel', header: 'Register Label', minWidth: '200px', maxWidth: '200px', textAlign: 'center' },
					{ field: 'registrationTypeLabel', header: 'Registration Type Label', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
					{ field: 'regimePrefLabel', header: 'Regime Preference Label', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
					{ field: 'applicantTypeprefLabel', header: 'Application Type Label', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
					{ field: 'tierLabel', header: 'Tier Label', minWidth: '130px', maxWidth: '130px', textAlign: 'left' }
				];

				this.wasteCarriersBrokersData = data['results']['wasteCarriersBrokersData'];

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

	getSavedCarbonCalculatedData( companyNumber ) {
		let obj = [companyNumber];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_ESG_DETAILS', 'getCarbonCalculatorData', obj ).subscribe( res => {

            if ( res.body.status == 200 ) {
                this.savedCarbonCalculatedData = res.body.result;

                if ( this.savedCarbonCalculatedData.length ) {

                    this.currentCarbonData = this.savedCarbonCalculatedData[0].carbonCarculatorCalculatedValues;

					if ( this.savedCarbonCalculatedData.length > 1 ) {
						this.previousCarbonData = this.savedCarbonCalculatedData[1].carbonCarculatorCalculatedValues;
                    } else {
						this.previousCarbonData = this.savedCarbonCalculatedData[0].carbonCarculatorCalculatedValues;
                    }
					
					for ( let calculateData in this.carbonCalulatedFields ) {

						for ( let key in this.currentCarbonData ) {

							if ( this.carbonCalulatedFields[ calculateData ].key == key ) {

								if ( ![ 'energyCarbonTotal', 'businessTravelCarbonTotal', 'flightCarbonTotal', 'materialUseTotal', 'wasteManagementTotal' ].includes( key ) && this.currentCarbonData[ key ] !== 0 ) {

									this.currentCalculatedCarbonValue.push({ label: this.carbonCalulatedFields[ calculateData ].label, method: this.carbonCalulatedFields[ calculateData ].method ? this.carbonCalulatedFields[ calculateData ].method : '', value: this.currentCarbonData[ key ], icon: this.carbonCalulatedFields[ calculateData ].icon });
									
								}

							}

						}

					}

                }

            }

        });

    }

}
