import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CanonicalURLService } from 'src/app/interface/service/canonical-url.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { BusinessTravelCarbonCalculationFieldsModel, EnergyCarbonCalculationFieldsModel, FlightCarbonCalculationFieldsModel, MaterialUseCarbonCalculationFieldsModel, WasteManagementCarbonCalculationFieldsModel } from '../carbon-calculator.constant';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-carbon-calculator-dashboard',
	templateUrl: './carbon-calculator-dashboard.component.html',
	styleUrls: [ './carbon-calculator-dashboard.component.scss' ]
})
export class CarbonCalculatorDashboardComponent implements OnInit {

	@Input() compactView: boolean = false;
    @Input() companyNumber: unknown;
    
    companyName: unknown;

    title: string = '';

    savedCarbonCalculatedData: Array<any> = [];
    currentCarbonData: EnergyCarbonCalculationFieldsModel & BusinessTravelCarbonCalculationFieldsModel & FlightCarbonCalculationFieldsModel & MaterialUseCarbonCalculationFieldsModel & WasteManagementCarbonCalculationFieldsModel;
    previousCarbonData: EnergyCarbonCalculationFieldsModel & BusinessTravelCarbonCalculationFieldsModel & FlightCarbonCalculationFieldsModel & MaterialUseCarbonCalculationFieldsModel & WasteManagementCarbonCalculationFieldsModel;

    totalCarbonCalculatedCurrent: number = 0;
    totalCarbonCalculatedPrevious: number = 0;
    totalDiffIncrsDcrs: number = 0;

    lightVehiclesTotal: any = { current: 0, previous: 0 };
    heavyVehiclesTotal: any = { current: 0, previous: 0 };
    busTrainVehiclesTotal: any = { current: 0, previous: 0 };

    overallComapreDoughnutChartOptions: any;
    overallComapreDoughnutChartData: any;

    overallValuesSmallOptions: any;
    overallValuesSmallData: any = {}

	constructor(
        private activeRoute: ActivatedRoute,
        private seoService: SeoService,
        private canonicalService: CanonicalURLService,
        public userAuthService: UserAuthService,
        private globalServiceCommnunicate: ServerCommunicationService
    ) {}

	ngOnInit() {

        if ( this.activeRoute.snapshot['_routerState']['url'].includes('/carbon-calculator') ) {
            this.initBreadcrumbAndSeoMetaTags();
        }

        this.overallComapreDoughnutChartOptions = {
            cutout: 40,	
            elements: {
                arc: {
                    borderWidth: 4
                }
            },
            plugins: {
				datalabels: {
					display: false,
				},
				tooltip: {
					enabled: false
				},
				legend: {
					display: false
				},
			},
			animation: {
				duration: 4000,
				easing: 'easeInOutQuad'
			}
		};

        this.overallValuesSmallOptions = {
            responsive: true,
            scales: {
                y: {
                    display: false
                },
                x: {
                    display: false
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            },
            plugins: {
				datalabels: {
					display: false,
				},
				legend: {
					display: false
				},
				tooltip: {
					enabled: false
				},
			},
			animation: {
				duration: 4000,
				easing: 'easeInOutQuad'
			}
        }

        if ( !this.companyNumber ) {
            this.companyNumber = this.userAuthService?.getUserInfo('companyNumber');
        }
        
        this.companyName = this.userAuthService?.getUserInfo('companyName');
        
        this.getSavedCarbonCalculatedData( this.companyNumber );

    }

    initBreadcrumbAndSeoMetaTags() {
    
        // this.breadcrumbService.setItems(
        //     [
        //         { label: 'Carbon Calculator', routerLink: ['/carbon-calculator'] }
        //     ]
        // );

        this.title = "Carbon Calculator - Let's go with The Net-Zero Solutions";
        
        this.seoService.setPageTitle(this.title);
        this.seoService.setMetaTitle(this.title);
        this.canonicalService.setCanonicalURL();
    
    }

    getSavedCarbonCalculatedData( companyNumber ) {

        let obj = [ this.companyNumber ];
        this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_ESG_DETAILS', 'getCarbonCalculatorData', obj ).subscribe( res => {
            if ( res.body.status == 200 ) {
                this.savedCarbonCalculatedData = res.body.result;

                if ( this.savedCarbonCalculatedData.length ) {
    
                    this.currentCarbonData = this.savedCarbonCalculatedData[0].carbonCarculatorCalculatedValues;

                    if ( this.savedCarbonCalculatedData.length > 1 ) {
                        this.previousCarbonData = this.savedCarbonCalculatedData[1].carbonCarculatorCalculatedValues;
                    } else {
                        this.previousCarbonData = this.savedCarbonCalculatedData[0].carbonCarculatorCalculatedValues;
                    }

                    // Adding total values
                    this.totalCarbonCalculatedCurrent = ( this.currentCarbonData.energyCarbonTotal + this.currentCarbonData.businessTravelCarbonTotal + this.currentCarbonData.flightCarbonTotal + this.currentCarbonData.materialUseTotal + this.currentCarbonData.wasteManagementTotal ) / 1000;
                    this.totalCarbonCalculatedPrevious = ( this.previousCarbonData.energyCarbonTotal + this.previousCarbonData.businessTravelCarbonTotal + this.previousCarbonData.flightCarbonTotal + this.previousCarbonData.materialUseTotal + this.previousCarbonData.wasteManagementTotal) / 1000;
                    // Adding total values
                    
                    // Calculating difference total values start
                    this.totalDiffIncrsDcrs = ( ( this.totalCarbonCalculatedCurrent - this.totalCarbonCalculatedPrevious ) / this.totalCarbonCalculatedCurrent ) * 100
    
                    this.overallComapreDoughnutChartData = {
                        labels: [ 'Energy', 'Business Travel', 'Flight' ],
                        datasets: [
                            {
                                data: [ this.currentCarbonData.energyCarbonTotal, this.currentCarbonData.businessTravelCarbonTotal, this.currentCarbonData.flightCarbonTotal ],
                                backgroundColor: [ '#2cf9ad', '#1fae79', '#126445' ]
                            }
                        ]
                    };
                    // Calculating difference total values start


                    this.lightVehiclesTotal.current = this.currentCarbonData.macLeaseVehiclePetrol + this.currentCarbonData.macLeaseVehicleDiesel + this.currentCarbonData.macLeaseVehicleLpg;
                    this.lightVehiclesTotal.previous = this.previousCarbonData.macLeaseVehiclePetrol + this.previousCarbonData.macLeaseVehicleDiesel + this.previousCarbonData.macLeaseVehicleLpg;

                    this.heavyVehiclesTotal.current = this.currentCarbonData.transportFuelToSitePetrol + this.currentCarbonData.transportFuelToSiteDiesel + this.currentCarbonData.transportFuelToSiteLpg;
                    this.heavyVehiclesTotal.previous = this.previousCarbonData.transportFuelToSitePetrol + this.previousCarbonData.transportFuelToSiteDiesel + this.previousCarbonData.transportFuelToSiteLpg;

                    this.busTrainVehiclesTotal.current = this.currentCarbonData.busTrainUsageByOrgzDistLocalBus + this.currentCarbonData.busTrainUsageByOrgzNationalCoach + this.currentCarbonData.busTrainUsageByOrgzNationalRail + this.currentCarbonData.busTrainUsageByOrgzUndergroundRail + this.currentCarbonData.busTrainUsageByOrgzTramLightRail;
                    this.busTrainVehiclesTotal.previous = this.previousCarbonData.busTrainUsageByOrgzDistLocalBus + this.previousCarbonData.busTrainUsageByOrgzNationalCoach + this.previousCarbonData.busTrainUsageByOrgzNationalRail + this.previousCarbonData.busTrainUsageByOrgzUndergroundRail + this.previousCarbonData.busTrainUsageByOrgzTramLightRail;


                    // =======================================================================================
                    // Mini Line Charts For Overall Details Card Start

                    let createMiniLineChartInputObj;
                    
                    createMiniLineChartInputObj = {
                        chartFor: 'energyCarbonTotal',
                        dataForChart: this.savedCarbonCalculatedData,
                        colorRGBForChart: '44 249 173'
                    };

                    this.overallValuesSmallData['energy'] = this.createMiniLineChartDataset( createMiniLineChartInputObj );

                    createMiniLineChartInputObj.chartFor = 'businessTravelCarbonTotal';
                    createMiniLineChartInputObj.colorRGBForChart = '31 174 121';
    
                    this.overallValuesSmallData['businessTravel'] = this.createMiniLineChartDataset( createMiniLineChartInputObj );

                    createMiniLineChartInputObj.chartFor = 'flightCarbonTotal';
                    createMiniLineChartInputObj.colorRGBForChart = '18 100 69';
    
                    this.overallValuesSmallData['flight'] = this.createMiniLineChartDataset( createMiniLineChartInputObj );

                    // Mini Line Charts For Overall Details Card End
                    // =======================================================================================

                }


            }
        });

    }

    createMiniLineChartDataset( inputValues ) {

        let outputDataset, chartLabels = [], chartData = [];

        for ( let dataKeys in inputValues.dataForChart ) {

            chartLabels.push( dataKeys + 1 );
            chartData.push( inputValues.dataForChart[ dataKeys ]['carbonCarculatorCalculatedValues'][ inputValues.chartFor ] );

        }

        chartData.reverse();

        outputDataset = {
            labels: chartLabels,
            datasets: [
                {
                    data: chartData,
                    backgroundColor: `rgb( ${ inputValues.colorRGBForChart } / 50%)`,
                    borderColor: `rgb( ${ inputValues.colorRGBForChart })`,
                    borderWidth: 2,
					fill: 'origin',
                }
            ]
        };

        return outputDataset;

    }

}
