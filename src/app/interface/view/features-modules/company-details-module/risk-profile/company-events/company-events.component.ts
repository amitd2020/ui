import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { DataCommunicatorService } from '../../data-communicator.service';

@Component({
	selector: 'dg-company-events',
	templateUrl: './company-events.component.html',
	styleUrls: ['./company-events.component.scss']
})
export class CompanyEventsComponent implements OnInit, AfterViewInit {

	companyData: any;

	companyEventsData: Array<any> = undefined;

	companyEventsColumns: { field: string; header: string; minWidth: string; maxWidth: string; textAlign: string; }[];

	constructor(
		private commonService: CommonServiceService,
		private dataCommunicatorService: DataCommunicatorService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit() {
		this.sharedLoaderService.showLoader();
		
		this.dataCommunicatorService.$dataCommunicatorVar.subscribe( ( res: any ) => this.companyData = res );

		this.companyEventsColumns = [
			{ field: 'statusFiledDate', header: 'Event Filed Date', minWidth: '200px', maxWidth: '200px', textAlign: 'center' },
			{ field: 'registeredDate', header: 'Event Registered Date', minWidth: '200px', maxWidth: '200px', textAlign: 'center' },
			{ field: 'statusCodeDesc', header: 'Event Description', minWidth: '200px', maxWidth: 'none', textAlign: 'left' }
		];

		this.getCompanyEventsData();
	}

	
	ngAfterViewInit() {
        setTimeout(() => {
            this.sharedLoaderService.hideLoader();
        }, 1000);
	}

	getCompanyEventsData() {
		
		let obj = [ this.companyData.companyRegistrationNumber ];

		this.globalServerCommunication.globalServerRequestCall('get', 'DG_COMPANY_DETAILS', 'companyStatus', obj).subscribe( res => {

			if (res.body.status == 200) {
				this.companyEventsData = res.body.results;
				this.companyEventsData = this.companyEventsData.map(obj => {
					let newObj = { ...obj };
					delete newObj['id'];
					delete newObj['companyRegistrationNumber'];
					delete newObj['statusCode'];
					newObj['statusFiledDate'] = this.commonService.changeToDate(newObj['statusFiledDate'])
					newObj['registeredDate'] = this.commonService.changeToDate(newObj['registeredDate'])
					return newObj;
				})
				this.companyEventsData.sort((a, b) => b.registeredDate - a.registeredDate)

			}
		});

	}

}
