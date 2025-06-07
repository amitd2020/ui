import { Component, OnInit } from '@angular/core';

import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';

@Component({
	selector: 'dg-data-update-info',
	templateUrl: './data-update-info.component.html',
	styleUrls: ['./data-update-info.component.scss']
})
export class DataUpdateInfoComponent implements OnInit {

	dataUpdateTable: Array<any> = [];
	dataUpdateColumn: Array<any> = [];
	dataUpdateJsonData: Array<any> = [];

	constructor(
		private globalServiceCommnunicate: ServerCommunicationService
	) { }

	ngOnInit(): void {

		this.initBreadcrumbAndSeoMetaTags();
		this.getEasySearchCriteria();

		this.dataUpdateColumn = [
			{ field: 'serial_num', header: 'S. No', width: '70px', textAlign: 'center' },
			{ field: 'dataset_names', header: 'Dataset Name', width: '120px', textAlign: 'left' },
			{ field: 'source_of_data', header: 'Source Of Data', width: '250px', textAlign: 'left' },
			{ field: 'process_automation_mongo', header: 'Process Automation Mongo', width: '120px', textAlign: 'left' },
			{ field: 'process_automation_postgres', header: 'Process Automation Postgres', width: '120px', textAlign: 'left' },
			{ field: 'frequencies', header: 'Frequency', width: '100px', textAlign: 'left' },
			{ field: 'last_updated_mongo', header: 'Last Updated Mongo', width: '130px', textAlign: 'left' },
			{ field: 'last_updated_postgres', header: 'Last Updated Postgres', width: '130px', textAlign: 'left' },
			{ field: 'data_update_upto', header: 'Data Update Upto', width: '140px', textAlign: 'left' },
			{ field: 'next_updates', header: 'Next Update', width: '200px', textAlign: 'left' },
			{ field: 'data_locations', header: 'Location of Data in our System', width: '220px', textAlign: 'left' },
			{ field: 'copy_locations', header: 'Copy Location', width: '250px', textAlign: 'left' },
			{ field: 'task_owner_name', header: 'Task Owner', width: '120px', textAlign: 'left' },
		];

	}

	getEasySearchCriteria() {
		this.globalServiceCommnunicate.getDataFromJSON( 'dataUpdate').subscribe(res => {
			this.dataUpdateJsonData = res.results;
		});
	}

	initBreadcrumbAndSeoMetaTags() {
		// this.breadCrumbService.setItems([
		// 	{ label: 'Data Update Info' }
		// ]);
	}

}
