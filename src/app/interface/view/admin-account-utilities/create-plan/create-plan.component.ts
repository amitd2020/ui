import { AfterViewInit, Component, OnInit } from '@angular/core';

import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../shared-components/shared-loader/shared-loader.service';

@Component({
	selector: 'dg-create-plan',
	templateUrl: './create-plan.component.html',
	styleUrls: ['./create-plan.component.scss']
})
export class CreatePlanComponent implements OnInit, AfterViewInit {

	createNewPlansData: any;

	title: string = '';
	description: string = '';

	selectedRecordTableCols: Array<any>;
	selectedColumns: Array<any>;

	constructor(
		private seoService: SeoService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit() {

		this.sharedLoaderService.showLoader();

		this.initBreadcrumbAndSeoMetaTags();
		
		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_FEATURES', 'all' ).subscribe( res => {
			this.createNewPlansData = res.body['results'];
		});

		this.selectedRecordTableCols = [
			{ field: 'name', header: 'Plan Name', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'description', header: 'Description', minWidth: '180px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'order', header: 'Order', minWidth: '110px', maxWidth: '110px', textAlign: 'right' },
			{ field: 'startDate', header: 'Start Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
			{ field: 'endDate', header: 'End Date', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
			{ field: 'cost', header: 'Cost', minWidth: '100px', maxWidth: '100px', textAlign: 'right' },
			{ field: 'vat', header: 'Vat', minWidth: '120px', maxWidth: '120px', textAlign: 'right' },
			{ field: 'status', header: 'Status', minWidth: '140px', maxWidth: '140px', textAlign: 'center' },
			{ field: 'updatePlanDetails', header: 'Action', minWidth: '140px', maxWidth: '140px', textAlign: 'center' }
		];

		this.selectedColumns = this.selectedRecordTableCols;
	}

	ngAfterViewInit(): void {
        setTimeout(() => {
            this.sharedLoaderService.hideLoader();
        }, 1000);
	}

	initBreadcrumbAndSeoMetaTags() {
		// this.breadcrumbService.setItems([
		// 	{ label: 'Plans' },
		// ]);
		this.title = "Choose and Create New Plans - DataGardener";
		this.description = "Choose and create our enterprise, expand, start, and API Plan with basic access according to your requirement. ";
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
		// this.seoService.setkeywords( this.keywords );
		// this.seoService.setRobots (this.robots );
	}

}
