import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { MessageService } from 'primeng/api';

import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { DataCommunicatorService } from '../../data-communicator.service';

interface Epc{
    address: string,
    rating: string,
    lmk_key: string,
    inspectiondate: string,
    postcode: string
}

@Component({
	selector: 'dg-epc',
	templateUrl: './epc.component.html',
	styleUrls: ['./epc.component.scss']
})
export class EpcComponent implements OnInit {

	@Input() selectedCompany: Array<any>;
    @Input() selectedTradeAddress: Array<any>;
    @Input() selectedEPCLMK: Array<any>;
	@Input() thisPage: string = '';
    @Input() epcDetails: any;
    @Input() category: any;
    @Input() listColumns: Array<any>;
    @Input() currentGrade: boolean;
    @Input() potentialGrade: boolean;


	@Output() messageCommunicator = new EventEmitter<any>();

    displayEPCModal: boolean = false;
    displayEPCDetailsModal: boolean = false;

    epcListData: any;
    companyNumber: string;
	epcCertificateType: string;
	tradingAddressCols: any;
    recommendationFields: any[];

    epcRecommendationData: Array<any> = [];

    selectedEpc: Epc;
    
    certificateDetails = {
        ac_inspection_commissioned: undefined,
        address: undefined,
        address1: undefined,
        address2: undefined,
        address3: undefined,
        aircon_kw_rating: undefined, 
        aircon_present: undefined, 
        asset_rating: undefined,
        asset_rating_band: undefined,
        building_emissions: undefined,
        building_environment: undefined,
        building_level: undefined,
        building_reference_number: undefined,
        constituency: undefined,
        constituency_label: undefined,
        county: undefined,
        estimated_aircon_kw_rating: undefined,
        existing_stock_benchmark: undefined,
        floor_area: undefined,
        inspection_date: undefined,
        lmk_key: undefined,
        local_authority: undefined,
        local_authority_label: undefined,
        lodgement_date: undefined,
        lodgement_datetime: undefined,
        main_heating_fuel: undefined,
        new_build_benchmark: undefined,
        other_fuel_desc: undefined,
        postcode: undefined,
        posttown: undefined,
        primary_energy_value: undefined,
        property_type: undefined,
        renewable_sources: undefined,
        special_energy_uses: undefined,
        standard_emissions: undefined,
        target_emissions: undefined,
        transaction_type: undefined,
        typical_emissions: undefined,
        uprn: undefined,
        uprn_source: undefined,
        valid_till: undefined
    }
    lmk_Key: any;
    hideButtonOnEPCTab: boolean = true;
    confirmDisplay: boolean = false;

	constructor(
		private messageService: MessageService,
		private dataCommunicatorService: DataCommunicatorService,
		private globalServerCommunication: ServerCommunicationService,
	) { }

	ngOnInit() {

        this.dataCommunicatorService.$dataCommunicatorVar.subscribe((res: any) => { 
			this.companyNumber = res.companyRegistrationNumber;
		});
        
        // if (this.thisPage == 'company') {
        //     this.getCompanyEpcLicenseByCompanyNumber();
        // }
        // this.sharedLoaderService.hideLoader();
        
    }
    energyPerformanceCertificate(){

        let temp = [];
        if (this.thisPage == 'company') {
            if( this.epcListData && this.epcListData.epcCertificate.length > 0 ) {
                    for (let index = 0; index < this.epcListData.epcCertificate.length; index++) {
                        const element = this.epcListData.epcCertificate[index];
                        let obj = {
                            address: element['address'] ? element['address'] : element['address1'] + " " + element['address2'] + " " + element['address3'] + " " + element['postcode'],
                            rating: element['asset_rating_band'] ? element['asset_rating_band'] : "",
                            lmk_key: element['lmk_key'],
                            inspectiondate: element['inspection_date'] ? element['inspection_date'] : "",
                            postcode: element['postcode']
                        }
                        temp.push(obj);
                    }
                    this.epcDetails = temp;
                    this.displayEPCModal = true;
            } else {
                this.epcDetails = [];
                this.displayEPCModal = true;
            }

        } else if ( [ 'tradingAddress', 'corporateLand' ].includes( this.thisPage ) ) {
            
            this.displayEPCDetailsModal = true;
            this.certificateDetails = this.epcDetails;
            this.epcCertificateType = this.category;

            this.epcRecommendationData = this.epcDetails.recommendation;            
            
            if( this.epcCertificateType == 'domestic' ) {

                this.epcRecommendationData = this.epcRecommendationData.sort((a, b) => a.improvement_item < b.improvement_item ? -1 : a.improvement_item > b.improvement_item ? 1 : 0);
                
                this.recommendationFields = [
                    { field: 'improvement_item', header: 'Improvement Item', width: '20px', textAlign: 'left' },
                    { field: 'improvement_descr_text', header: 'Improvement Description', width: '100px', textAlign: 'left' },
                    { field: 'indicative_cost', header: 'Indicative Cost', width: '20px', textAlign: 'right' },
                ];
            } else {

                this.epcRecommendationData = this.epcRecommendationData.sort((a, b) => a.recommendation_item < b.recommendation_item ? -1 : a.recommendation_item > b.recommendation_item ? 1 : 0);

                this.recommendationFields = [
                    { field: 'recommendation', header: 'Recommendation', width: '180px', textAlign: 'left' },
                    { field: 'co2_impact', header: 'CO2 Impact', width: '40px', textAlign: 'center' },
                    { field: 'payback_type', header: 'Payback Type', width: '30px', textAlign: 'left' },
                    { field: 'recommendation_item', header: 'Recommendation Item', width: '50px', textAlign: 'center' },
                    { field: 'recommendation_code', header: 'Recommendation Code', width: '50px', textAlign: 'center' },
                ];
            }

        }
        
    }
    resetOnHideDialog() {
        this.lmk_Key = undefined;
    }

    addYearsToDate(date, noOfYears) {
        date = new Date(date);
        var yearFromDate = date.getFullYear();
        var monthFromYear = date.getMonth();
        var dayFromYear = date.getDate();
        var newDate = new Date(yearFromDate + noOfYears, monthFromYear, dayFromYear);
        let newDateString = newDate.getFullYear()+"-"+newDate.getMonth()+"-"+newDate.getDate();
        return newDateString;
    }
 
    confirmSaveData() {
        let obj = {
            companyNumber: this.selectedCompany,
            lmk_key: this.certificateDetails.lmk_key,
            postcode: this.certificateDetails.postcode,
            address1: this.certificateDetails.address1,
            address2: this.certificateDetails.address2,
            address3: this.certificateDetails.address3,
            assestRatingBand: this.certificateDetails.asset_rating_band,
            assestRating: this.certificateDetails.asset_rating,
        }
        //Actual logic to perform a confirmation
        this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_EPC_API', 'mapEpcCertificateDatawithCompanyNumber', obj ).subscribe( res => {
            if(res.body.status == 201)
            this.confirmDisplay = false;
            this.messageService.add({key: 'tc', severity:'success', summary:'Service Message', detail:'Company mapped sucessfully'});
        })

    }

    toCheckStringType(val): boolean {
		return typeof val === 'string';
	}

}
