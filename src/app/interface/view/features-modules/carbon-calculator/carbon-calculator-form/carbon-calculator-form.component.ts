import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { CanonicalURLService } from 'src/app/interface/service/canonical-url.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';

import { BusinessTravelCarbonCalculationFieldsModel, CarbonCalculationRatesConst, EnergyCarbonCalculationFieldsModel, FlightCarbonCalculationFieldsModel, materialUseCarbonCalculationFields, MaterialUseCarbonCalculationFieldsModel, wasteManagementCarbonCalculationFields, WasteManagementCarbonCalculationFieldsModel } from '../carbon-calculator.constant';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-carbon-calculator-form',
	templateUrl: './carbon-calculator-form.component.html',
	styleUrls: [ './carbon-calculator-form.component.scss' ]
})
export class CarbonCalculatorFormComponent implements OnInit {

	@ViewChild( 'carbonCalculatorForm', { static: false } ) carbonCalculatorForm: NgForm;

    title: string = '';

    carbonCalculationRatesConst = CarbonCalculationRatesConst;
    
    energyCarbonCalulatedFields: EnergyCarbonCalculationFieldsModel = {
        energyCarbonTotal: 0,
        energyCoal: 0,
        energyDiesel: 0,
        energyWaterConsumption: 0,
        energyElectricity: 0,
        energyHeatingOil: 0,
        energyLpg: 0,
        energyNaturalGas: 0,
        energyWood: 0,
    }
    businessTravelCarbonCalulatedFields: BusinessTravelCarbonCalculationFieldsModel = {
        businessTravelCarbonTotal: 0,
        busTrainUsageByOrgzDistLocalBus: 0,
        busTrainUsageByOrgzNationalCoach: 0,
        busTrainUsageByOrgzNationalRail: 0,
        busTrainUsageByOrgzTramLightRail: 0,
        busTrainUsageByOrgzUndergroundRail: 0,
        macLeaseVehicleDiesel: 0,
        macLeaseVehicleLpg: 0,
        macLeaseVehiclePetrol: 0,
        transportFuelToSiteDiesel: 0,
        transportFuelToSiteLpg: 0,
        transportFuelToSitePetrol: 0
    }
    flightCarbonCalulatedFields: FlightCarbonCalculationFieldsModel = {
        flightCarbonTotal: 0,
        totalFlyingHours: 0
    }

    materialUseCarbonCalculationFields = materialUseCarbonCalculationFields;

    wasteManagementCarbonCalculationFields = wasteManagementCarbonCalculationFields;

    materialTypeOptions: { label: string, method: string ,key: string, rate: number }[] = [];
    wasteManagementOptions: { label: string, method: string ,key: string, rate: number }[] = [];
    selectedMaterialType: any;
    selectedWasteManagementType: any;
    selectedMaterialValue: number;
    selectedWasteManagementValue: number;
    addedMaterialUseFields: { label: string, method: string, key: string, value: number, calculatedValue: number }[] = [];
    addedWasteManagementUseFields: { label: string, method: string, key: string, value: number, calculatedValue: number }[] = [];
    materialUseFieldsValidation: boolean = false;
    wasteManagementFieldsValidation: boolean = false;
    
    carbonCalulatedFields: EnergyCarbonCalculationFieldsModel & BusinessTravelCarbonCalculationFieldsModel & FlightCarbonCalculationFieldsModel & MaterialUseCarbonCalculationFieldsModel & WasteManagementCarbonCalculationFieldsModel = {
        ...this.energyCarbonCalulatedFields,
        ...this.businessTravelCarbonCalulatedFields,
        ...this.flightCarbonCalulatedFields,
        ...this.materialUseCarbonCalculationFields,
        ...this.wasteManagementCarbonCalculationFields
    };
    totalCarbonCalculatedValues: number = 0;

    carbonCalculationYearOrMonthWise: string = 'Annually';

    // formSubmittedSuccess: boolean = false;

	constructor(
        public userAuthService: UserAuthService,
        private seoService: SeoService,
        private canonicalService: CanonicalURLService,
        private router: Router,
        private sharedLoaderService: SharedLoaderService,
        private globalServerCommunication: ServerCommunicationService
    ) {}

	ngOnInit() {

        this.initBreadcrumbAndSeoMetaTags();

        for ( let material in this.materialUseCarbonCalculationFields ) {

            if ( material !== 'materialUseTotal' ) {
                
                this.materialTypeOptions.push({ 
                    label: this.materialUseCarbonCalculationFields[ material ].label, 
                    method: this.materialUseCarbonCalculationFields[ material ].method,
                    key: this.materialUseCarbonCalculationFields[ material ].key,
                    rate: this.carbonCalculationRatesConst[ material ] 
                });
            }
            
        }

        for ( let wasteManagement in this.wasteManagementCarbonCalculationFields ) {
            if ( wasteManagement !== 'wasteManagementTotal' ) {

                this.wasteManagementOptions.push({ 
                    label: this.wasteManagementCarbonCalculationFields[ wasteManagement ].label, 
                    method: this.wasteManagementCarbonCalculationFields[ wasteManagement ].method, 
                    key: this.wasteManagementCarbonCalculationFields[ wasteManagement ].key,
                    rate: this.carbonCalculationRatesConst[ wasteManagement ] 
                });

            }
        }

    }

    ngAfterViewInit() {

        setTimeout(() => {
            this.carbonCalculatorForm.reset();
        }, 10);

        setTimeout(() => {
            this.getLastFilledData( this.userAuthService?.getUserInfo('companyNumber') );
        }, 100);

    }

    initBreadcrumbAndSeoMetaTags() {
    
        // this.breadcrumbService.setItems(
        //     [
        //         { label: 'Carbon Calculator', routerLink: ['/carbon-calculator/dashboard'] }
        //     ]
        // );

        this.title = "Carbon Calculator - Let's go with The Net-Zero Solutions";
        
        this.seoService.setPageTitle(this.title);
        this.seoService.setMetaTitle(this.title);
        this.canonicalService.setCanonicalURL();
    
    }

    getLastFilledData( companyNumber ) {

		let reqParam = [ companyNumber ];
        
        this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_ESG_DETAILS', 'getCarbonCalculatorData', reqParam ).subscribe(  data => {

			let res = data.body;

            if ( res.status == 200 ) {

                let incomingSavedData = res.result;

                incomingSavedData.sort( ( a, b ) => b.dateOfCalculation.localeCompare( a.dateOfCalculation ) );

                this.carbonCalculatorForm.control.patchValue( incomingSavedData[0].carbonCalculatorInputValues );

                for ( let dataKey in incomingSavedData[0].carbonCalculatorInputValues ) {
                    
                    for ( let material in this.materialUseCarbonCalculationFields ) {
                        if ( this.materialUseCarbonCalculationFields[ material ].key == dataKey ) {

                            this.addedMaterialUseFields.push( { label: this.materialUseCarbonCalculationFields[ material ].label, method: this.materialUseCarbonCalculationFields[ material ].method, key: dataKey, value: incomingSavedData[0].carbonCalculatorInputValues[ dataKey ], calculatedValue: incomingSavedData[0].carbonCarculatorCalculatedValues[ dataKey ] } );

                        }

                    }

                    for ( let wasteManage in this.wasteManagementCarbonCalculationFields ) {
                        if ( this.wasteManagementCarbonCalculationFields[ wasteManage ].key == dataKey  ) {

                            this.addedWasteManagementUseFields.push( { label: this.wasteManagementCarbonCalculationFields[ wasteManage ].label, method: this.wasteManagementCarbonCalculationFields[ wasteManage ].method, key: dataKey, value: incomingSavedData[0].carbonCalculatorInputValues[ dataKey ], calculatedValue: incomingSavedData[0].carbonCarculatorCalculatedValues[ dataKey ] } )
                        
                        }
                    }
                    
                    this.calculateFieldValue( { value: incomingSavedData[0].carbonCalculatorInputValues[ dataKey ] }, dataKey );

                }

            }

        });

    }

    calculateFieldValue( event, fieldName ) {
        this.carbonCalculatorForm.value[ fieldName ] = event.target ? event.target.value : event.value;

        if ( this.carbonCalculatorForm.value[ fieldName ] && typeof this.carbonCalculatorForm.value[ fieldName ] == 'string' ) {
            this.carbonCalculatorForm.value[ fieldName ] = +this.carbonCalculatorForm.value[ fieldName ].replace( /,/g, '' );
        }

        // Calculating Values For Energy Carbon
        if ( this.energyCarbonCalulatedFields.hasOwnProperty( fieldName ) ) {
            
            this.energyCarbonCalulatedFields[ fieldName ] = this.carbonCalculatorForm.value[ fieldName ] * this.carbonCalculationRatesConst[ fieldName ];

            // Calculating Totals For energy Carbon
            this.energyCarbonCalulatedFields.energyCarbonTotal = 0;
            
            for ( let key in this.energyCarbonCalulatedFields ) {
                if ( key !== 'energyCarbonTotal' ) {
                    this.energyCarbonCalulatedFields.energyCarbonTotal += this.energyCarbonCalulatedFields[ key ];
                }
            }
        
        }

        // Calculating Values For Employee Commute Business Travel Carbon
        if ( this.businessTravelCarbonCalulatedFields.hasOwnProperty( fieldName ) ) {
            
            this.businessTravelCarbonCalulatedFields[ fieldName ] = this.carbonCalculatorForm.value[ fieldName ] * this.carbonCalculationRatesConst[ fieldName ];
        
            // Calculating Totals For Employee Commute Business Travel Carbon
            this.businessTravelCarbonCalulatedFields.businessTravelCarbonTotal = 0;
            
            for ( let key in this.businessTravelCarbonCalulatedFields ) {
                if ( key !== 'businessTravelCarbonTotal' ) {
                    this.businessTravelCarbonCalulatedFields.businessTravelCarbonTotal += this.businessTravelCarbonCalulatedFields[ key ];
                }
            }

        }

        // Calculating Values For Flight Carbon
        if ( this.flightCarbonCalulatedFields.hasOwnProperty( fieldName ) ) {

            this.flightCarbonCalulatedFields[ fieldName ] = this.carbonCalculatorForm.value[ fieldName ] * this.carbonCalculationRatesConst[ fieldName ];
        
            // Calculating Totals For Flight Carbon
            this.flightCarbonCalulatedFields.flightCarbonTotal = 0;
            
            for ( let key in this.flightCarbonCalulatedFields ) {
                if ( key !== 'flightCarbonTotal' ) {
                    this.flightCarbonCalulatedFields.flightCarbonTotal += this.flightCarbonCalulatedFields[ key ];
                }
            }

        }

        // Calculating Values For Material Use
        for ( let material in this.materialUseCarbonCalculationFields ) {

            if ( this.materialUseCarbonCalculationFields[ material ].key ==  fieldName ) {
    
                this.materialUseCarbonCalculationFields[ fieldName ].value = this.carbonCalculatorForm.value[ fieldName ] * this.carbonCalculationRatesConst[ fieldName ].rate;
    
                if ( this.addedMaterialUseFields.length ) {
                    for ( let material of this.addedMaterialUseFields ) {
                        if ( material.key == fieldName ) {
                            material.value = this.carbonCalculatorForm.value[ fieldName ];
                            material.calculatedValue = this.materialUseCarbonCalculationFields[ fieldName ].value;
                        }
                    }
                }
            
                // Calculating Totals For Material Use
                this.materialUseCarbonCalculationFields.materialUseTotal = 0;
                
                for ( let key in this.materialUseCarbonCalculationFields ) {
                    if ( key !== 'materialUseTotal' ) {
                        this.materialUseCarbonCalculationFields.materialUseTotal += this.materialUseCarbonCalculationFields[ key ].value;
                    }
                }
    
            }

        }

        // Calculating Values For Waste Management
        for ( let wasteManage in this.wasteManagementCarbonCalculationFields ) {

            if ( this.wasteManagementCarbonCalculationFields[ wasteManage ].key == fieldName ) {
    
                this.wasteManagementCarbonCalculationFields[ fieldName ].value = this.carbonCalculatorForm.value[ fieldName ] * this.carbonCalculationRatesConst[ fieldName ].rate;
    
                if ( this.addedWasteManagementUseFields.length ) {
                    for ( let wasteManagement of this.addedWasteManagementUseFields ) {
                        if ( wasteManagement.key == fieldName ) {
                            wasteManagement.value = this.carbonCalculatorForm.value[ fieldName ];
                            wasteManagement.calculatedValue = this.wasteManagementCarbonCalculationFields[ fieldName ].value;
                        }
                    }
                }
                
                this.wasteManagementCarbonCalculationFields.wasteManagementTotal = 0;
                
                for ( let key in this.wasteManagementCarbonCalculationFields ) {
                    if ( key !== 'wasteManagementTotal' ) {
                        this.wasteManagementCarbonCalculationFields.wasteManagementTotal += this.wasteManagementCarbonCalculationFields[ key ].value;
                    }
                }
    
            }

        }

        this.carbonCalulatedFields = {
            ...this.energyCarbonCalulatedFields,
            ...this.businessTravelCarbonCalulatedFields,
            ...this.flightCarbonCalulatedFields,
            ...this.materialUseCarbonCalculationFields,
            ...this.wasteManagementCarbonCalculationFields
        };

        // Calculating Totals Values
        this.totalCarbonCalculatedValues = 0;
        
        for ( let key in this.carbonCalulatedFields ) {
            if ( ![ 'energyCarbonTotal', 'businessTravelCarbonTotal', 'flightCarbonTotal', 'materialUseTotal', 'wasteManagementTotal' ].includes( key ) ) {
                if ( typeof this.carbonCalulatedFields[ key ] == 'object' ) {
                    this.totalCarbonCalculatedValues += this.carbonCalulatedFields[ key ].value;
                } else {
                    this.totalCarbonCalculatedValues += this.carbonCalulatedFields[ key ];
                }
            }
        }

    }

    saveCalculateCarbonValues( carbonCalculatorFormValues: NgForm ) {

        if ( this.totalCarbonCalculatedValues ) {

            for ( let formField in carbonCalculatorFormValues['value'] ) {

                if ( carbonCalculatorFormValues['value'][ formField ] || carbonCalculatorFormValues['value'][ formField ] !== null ) {
                    carbonCalculatorFormValues['value'][ formField ] = carbonCalculatorFormValues['value'][ formField ]
                } else {
                    carbonCalculatorFormValues['value'][ formField ] = 0;
                }

            }
            
            for ( let material of this.addedMaterialUseFields ) {

                if ( material.value ) {
                    carbonCalculatorFormValues['value'][ material.key ] = material.value;
                }

            }

            for ( let wasteManage of this.addedWasteManagementUseFields ) {
                
                if ( wasteManage.value ) {
                    carbonCalculatorFormValues['value'][ wasteManage.key ] = wasteManage.value;
                }

            }

            for ( let calculatedFields in this.carbonCalulatedFields ) {
                if ( typeof this.carbonCalulatedFields[ calculatedFields ] == 'object' ) {
                    this.carbonCalulatedFields[ calculatedFields ] = this.carbonCalulatedFields[ calculatedFields ].value;
                }
            }

            let dateObj = new Date();

            let requiredBodyObject = {
                companyNumber: this.userAuthService?.getUserInfo('companyNumber'),
                yearOrMonth: this.carbonCalculationYearOrMonthWise,
                dateOfCalculation: `${ dateObj.getDate().toString().padStart(2, "0") }-${ ( dateObj.getMonth() + 1 ).toString().padStart(2, "0") }-${ dateObj.getFullYear() }`,
                carbonCalculatorInputValues: carbonCalculatorFormValues['value'],
                carbonCarculatorCalculatedValues: this.carbonCalulatedFields
            };
    
            this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_ESG_DETAILS', 'saveCarbonCalculatorData', requiredBodyObject ).subscribe( res => {
            // this.carbonCalculatorService.saveCarbonCalculatorData( requiredBodyObject ).then( res => {
                
                // this.formSubmittedSuccess = true
                this.sharedLoaderService.showLoader();

                
                setTimeout(() => {
                    // this.formSubmittedSuccess = false;
                    this.sharedLoaderService.hideLoader();
                }, 4000);
                
                setTimeout(() => {
                    this.router.navigate( [ '/carbon-calculator/dashboard' ] );
                }, 5000);
                
            });

        }

    }

    // Method for adding field in Material Use
    addMaterialField() {

        if ( !this.selectedMaterialType || !this.selectedMaterialValue ) {
            this.materialUseFieldsValidation = true;

            setTimeout(() => {
                this.materialUseFieldsValidation = false;
            }, 4000);

            return;
        }

        // If Material already exists
        let materialAlreadyAdded = false;

        if ( this.addedMaterialUseFields.length ) {
            for ( let addedMaterial of this.addedMaterialUseFields ) {
                if ( ( addedMaterial.label == this.selectedMaterialType.label ) && ( addedMaterial.method == this.selectedMaterialType.method ) ) {

                    addedMaterial.value = this.selectedMaterialValue;
                    addedMaterial.calculatedValue = this.selectedMaterialValue * this.selectedMaterialType.rate.rate;
                    materialAlreadyAdded = true;

                }
            }
        }

        // Adding New Material
        if ( !materialAlreadyAdded ) {
            this.addedMaterialUseFields.push( { label: this.selectedMaterialType.label, method: this.selectedMaterialType.method, key: this.selectedMaterialType.key, value: this.selectedMaterialValue, calculatedValue: this.selectedMaterialValue * this.selectedMaterialType.rate.rate } );
        }

        this.calculateFieldValue( { value: this.selectedMaterialValue }, this.selectedMaterialType.key );

        // Reseting the placeholder fields
        this.selectedMaterialType = [];
        this.selectedMaterialValue = undefined;
    }

    // Method for removing field in Material Use
    removeMaterialField( fieldIndex, fieldObject ) {

        
        for ( let material in this.materialUseCarbonCalculationFields ) {

            if ( this.materialUseCarbonCalculationFields[ material ].key == fieldObject.key ) {
                this.materialUseCarbonCalculationFields[ material ].calculatedFields = 0;
                this.materialUseCarbonCalculationFields[ material ].value = 0;
            }

        }

        this.addedMaterialUseFields.splice( fieldIndex, 1 );

        this.calculateFieldValue( { value: 0 }, fieldObject.key );
        
    }
    
    // Method for adding field in Waste Management
    addWasteManagementField() {
        
        if ( !this.selectedWasteManagementType || !this.selectedWasteManagementValue ) {
            this.wasteManagementFieldsValidation = true;

            setTimeout(() => {
                this.wasteManagementFieldsValidation = false;
            }, 4000);

            return
        }

        let wasteManagementAlreadyAdded = false;

        // If Already Exists
        if ( this.addedWasteManagementUseFields.length ) {
            for ( let addedWasteManagement of this.addedWasteManagementUseFields ) {
                if ( ( addedWasteManagement.label == this.selectedWasteManagementType.label ) && ( addedWasteManagement.method == this.selectedWasteManagementType.method ) ) {

                    addedWasteManagement.value = this.selectedWasteManagementValue;
                    addedWasteManagement.calculatedValue = this.selectedWasteManagementValue * this.selectedWasteManagementType.rate.rate;
                    wasteManagementAlreadyAdded = true;

                }
            }

        }

        // Adding New Fields
        if ( !wasteManagementAlreadyAdded ) {
            this.addedWasteManagementUseFields.push( { label: this.selectedWasteManagementType.label, method: this.selectedWasteManagementType.method, key: this.selectedWasteManagementType.key, value: this.selectedWasteManagementValue, calculatedValue: this.selectedWasteManagementValue * this.selectedWasteManagementType.rate.rate } );
        }

        this.calculateFieldValue( { value: this.selectedWasteManagementValue }, this.selectedWasteManagementType.key );

        // Reseting the placeholder fields
        this.selectedWasteManagementType = [];
        this.selectedWasteManagementValue = undefined;

    }

    // Method for adding field in Waste Management
    removeWasteManagementField( fieldIndex, fieldObject ) {

        for ( let wasteManage in this.wasteManagementCarbonCalculationFields ) {

            if ( this.wasteManagementCarbonCalculationFields[ wasteManage ].key == fieldObject.key ) {
                this.wasteManagementCarbonCalculationFields[ wasteManage ].calculatedFields = 0;
                this.wasteManagementCarbonCalculationFields[ wasteManage ].value = 0;
            }

        }


        this.addedWasteManagementUseFields.splice( fieldIndex, 1 );

        this.calculateFieldValue( { value: 0 }, fieldObject.key );
        
    }

}
