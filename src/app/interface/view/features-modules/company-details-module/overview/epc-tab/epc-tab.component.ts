import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ConfirmationService } from 'primeng/api';

import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { DataCommunicatorService } from '../../data-communicator.service';

@Component({
	selector: 'dg-epc-tab',
	templateUrl: './epc-tab.component.html',
	styleUrls: ['./epc-tab.component.scss']
})
export class EpcTabComponent implements OnInit {

	epcDetails: any;
	companyData: any;
	mappedEpcDataValues: any;
	epcRecommendationData: any;

	msgs = [];
	recommendationFields: Array<any> = [];

	companyNumber: string;
	certificateType: string;

	epcCols: Array<any>;
	constantMessages: any = UserInteractionMessages;

	constructor(
		private dataCommunicatorService: DataCommunicatorService,
		private titlecasePipe: TitleCasePipe,
		private confirmationService: ConfirmationService,
		private router: Router,		
		private globalServerCommunication: ServerCommunicationService,
		private sharedLoaderService: SharedLoaderService
	) { }

	ngOnInit() {

		this.sharedLoaderService.showLoader();
		this.dataCommunicatorService.$dataCommunicatorVar.subscribe((res: any) => { 
			this.epcDetails = res.epcDetails[0];
			this.companyNumber = res.companyRegistrationNumber;
		});

		this.getEpcDetailsCertificate();
	}

	ngAfterViewInit() {
        setTimeout(() => {
            this.sharedLoaderService.hideLoader();
        }, 1000);
	}

	private getEpcDetailsCertificate() {

		this.certificateType = this.epcDetails.certificateType;
		this.epcRecommendationData = this.epcDetails.recommendation;

		if ( this.certificateType == 'domestic' ) {

			this.recommendationFields = [
				{ field: 'improvement_item', header: 'Improvement Item', width: '20px', textAlign: 'left' },
				{ field: 'improvement_id_text', header: 'Improvement Description', width: '100px', textAlign: 'left' },
				{ field: 'indicative_cost', header: 'Indicative Cost', width: '20px', textAlign: 'right' },
			];

		} else {

			this.recommendationFields = [
				{ field: 'recommendation', header: 'Recommendation', width: '180px', textAlign: 'left' },
				{ field: 'co2_impact', header: 'CO2 Impact', width: '40px', textAlign: 'center' },
				{ field: 'payback_type', header: 'Payback Type', width: '30px', textAlign: 'left' },
				{ field: 'recommendation_item', header: 'Recommendation Item', width: '50px', textAlign: 'center' },
				{ field: 'recommendation_code', header: 'Recommendation Code', width: '50px', textAlign: 'center' }
			];

		}
		
	}

	private getCompanyEpcLicenseByCompanyNumber() {

		let reqArr = [ this.companyNumber ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_EPC_API', 'getCompanyEpcLicenseByCompanyNumber', reqArr ).subscribe( res => {

			let data = res.body;

			if (data.status == 200) {
				if(data.result.epcCertificate) {

					this.mappedEpcDataValues = data.result.epcCertificate;
					
					for (let index = 0; index < this.mappedEpcDataValues.length; index++) {
						
						let data = this.mappedEpcDataValues[index];
						let address = '';
	
						if (data.address1 && data.address1 !== null && data.address1 !== '') {
								address = this.titlecasePipe.transform(data.address1);
						}
						if (data.address2 && data.address2 !== null && data.address2 !== '') {
							if(data.address1 && data.address1 != ''){
								address = address + ', ' + this.titlecasePipe.transform(data.address2);
							} else {
								address = address + this.titlecasePipe.transform(data.address2);
							}
						}
						if (data.address3 && data.address3 !== null && data.address3 !== '') {
							address = address + ', ' + this.titlecasePipe.transform(data.address3);
						}
						
						this.mappedEpcDataValues[index]['epcAddress'] = address;
	
					}
				} else {
					this.mappedEpcDataValues = []
				}


			}
		});
	}

	deleteEPCCertificateData(event) {
		let id = [ event._id ];
		
		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['delete'],
			header: 'Delete Confirmation',
			icon: 'pi pi-info-circle',
			key: 'epcTab',
			accept: () => {

				this.globalServerCommunication.globalServerRequestCall( 'delete', 'DG_EPC_API', 'deleteMappedEpcDataById', id ).subscribe( res => {
					if (res.body.status == 200) {
						this.msgs = [];
						this.msgs.push({key: 'epc', severity: 'success', summary: this.constantMessages['successMessage']['epcDeleteSuccess'] });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
						setTimeout(() => {
							const currentUrl = this.router.url;
							/*
								Do not enable the below code before discussing with Akmal.
								It reloads the `AppMainComponent`, which is the main
								layout container and parent for all of the Components/Modules.
								===============================================================
								this.router.routeReuseStrategy.shouldReuseRoute = () => false;
								===============================================================
							*/
							this.router.onSameUrlNavigation = 'reload';
							this.router.navigate([currentUrl]);
						}, 4000);
					} else {
						this.msgs = [];
						this.msgs.push({key: 'epc', severity: 'error', summary: this.constantMessages['errorMessage']['epcNotDeletedMessage'] });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					}
				})
			}
		});

	}

	toCheckStringType(val): boolean {
		return typeof val === 'string';
	}

}
