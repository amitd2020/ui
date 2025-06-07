import { Component, OnInit } from '@angular/core';
import { SharedLoaderService } from '../../shared-loader/shared-loader.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';

@Component({
	selector: 'dg-monitored-contract-finder',
	templateUrl: './monitored-contract-finder.component.html',
	styleUrls: ['./monitored-contract-finder.component.scss']
})

export class MonitoredContractFinderComponent implements OnInit {

	selectedRecordTableCols: Array<any>;
	monitoredContractsListData: any;
	totalNumOfRecords: number = null;

	constructor(
		private sharedLoaderService:SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService
	) {}

	ngOnInit() {

		this.sharedLoaderService.showLoader();

		this.getMonitoredContractList()
		
		this.selectedRecordTableCols = [
			{ field: 'title', header: 'Title', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
			{ field: 'buyerName', header: 'Buyer Name', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'contractAmount', header: 'Contract Amount', minWidth: '80px', maxWidth: '80px', textAlign: 'center' },
			{ field: 'publishDate', header: 'Published Date', minWidth: '80px', maxWidth: '80px', textAlign: 'right' },
			{ field: 'contractStatus', header: 'Contract Status', minWidth: '80px', maxWidth: '80px', textAlign: 'center' },
			{ field: 'changesArray', header: 'Changes', minWidth: '180px', maxWidth: '180px', textAlign: 'center' },
			{ field: 'hasNotification', header: 'Notification', minWidth: '70px', maxWidth: '70px', textAlign: 'center' },
		];

	}

	getMonitoredContractList() {

		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'procurementMonitor' ).subscribe({

			next: (res) => {
				if (res.status == 200) {
					this.monitoredContractsListData = res.body['results'];
					this.totalNumOfRecords = res.body['totalrecords'];

					this.sharedLoaderService.hideLoader()
				}
			},

			error: (err) => {
				console.log('Here is Error Message>>', err);
				this.sharedLoaderService.hideLoader()
			}

		})
	}

}
