import { Component, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../shared-loader/shared-loader.service';
import { DataCommunicatorService } from '../../features-modules/company-details-module/data-communicator.service';

@Component({
	selector: 'dg-m-and-a',
	templateUrl: './m-and-a.component.html',
	styleUrls: ['./m-and-a.component.scss']
})
export class MAndAComponent {

	@Input() companyNumberToGrowthInsights: any;

	mAndAdataRes: object = {};	
	selectedScore: object = {};
	scoresByCountryData: Array<any> = [];
	scoresByMSMECategoryData: Array<any> = [];
	scoresByRegionData: Array<any> = [];
	scoresByIndustryData: Array<any> = [];
	initialiZedcompNum: any;
	compNum: any;
	companyData: any;
	selectedFilter: Array<any> = [];


	msmeColumnArray: any[] = [
		{ field: 'key', header: 'Tags', classToApply: 'font-semibold' },
		{ field: 'companyCurrentScore', header: 'Current', classToApply: '' },
		{ field: 'value', header: 'Average ( Industry )', classToApply: '' }
	]

	constructor(
		private globalServerCommunication: ServerCommunicationService,
		private activateRoute: ActivatedRoute,
        private sharedLoaderService: SharedLoaderService,
		private dataCommunicatorService: DataCommunicatorService,
	) {}

	ngOnChanges(changes: SimpleChanges) {

		this.initialiZedcompNum = changes.companyNumberToGrowthInsights.currentValue;

		if ( this.initialiZedcompNum )  this.getMandAdata();
	}
	
	ngOnInit() {
		this.dataCommunicatorService.$dataCommunicatorVar.subscribe((res: any) => this.companyData = res.companyRegistrationNumber);
		this.getMandAdata();
	}
	
	getMandAdata() {
		
		this.sharedLoaderService.showLoader();

		const { companyNo } = this.activateRoute.snapshot.params;
		
		this.compNum = companyNo ?? this.companyData ?? this.initialiZedcompNum;		
		
		this.globalServerCommunication.globalServerRequestCall('get', 'dg-prospensityGrowth', 'getCompanyProspensityGrowth', [ this.compNum ]).subscribe({
			
			next: ( res ) => {
				if ( res.body.status == 200 ) {
					this.mAndAdataRes = res.body.result;

					this.scoresByCountryData = this.mAndAdataRes['scoresByCountry']['countryScore'];
					this.scoresByMSMECategoryData = this.mAndAdataRes['scoresByMSMECategory']['estimatedScore'];
					this.scoresByRegionData = this.mAndAdataRes['scoresByRegion']['estimatedScore'];
					this.scoresByIndustryData = this.mAndAdataRes['scoresByIndustry']['estimatedScore'];
					this.selectedFilter.push({chip_group: "Status", chip_values: ["live"]}, {
						chip_group: "Readiness", label: "Readiness", chip_values: [this.mAndAdataRes?.['totalReadiness'].toLowerCase()]})


				}
				this.sharedLoaderService.hideLoader();
			},

			error: ( err ) => {
				console.log(err);
				this.sharedLoaderService.hideLoader();
			}

		});
	}

}
