import { Component, OnInit } from '@angular/core';

import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-aquisation-merger',
	templateUrl: './aquisation-merger.component.html',
	styleUrls: ['./aquisation-merger.component.scss']
})
export class AquisationMergerComponent implements OnInit {

	aquisitionMergerDataColumn: any[];
	aquisitionMergerData: Array<any> = [];

	aquisitionMergersReportData: any;
	companyData: any;

	constructor(
		public userAuthService: UserAuthService,
		private dataCommunicatorService: DataCommunicatorService,
		private commonService: CommonServiceService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService,
	) { }

	ngOnInit() {
		this.dataCommunicatorService.$dataCommunicatorVar.subscribe((res: any) => this.companyData = res);
		this.getAquisitionMergersData();
	}

	getAquisitionMergersData() {
		this.sharedLoaderService.showLoader();

		this.aquisitionMergerDataColumn = [
			{ field: 'acquiringCompanyRegistrationNumber', header: 'Acquiring Company Number', minWidth: '100px', maxWidth: '100px', textAlign: 'left', visible: true },
			{ field: 'acquiringCompanyName', header: 'Acquiring Company', minWidth: '220px', maxWidth: '220px', textAlign: 'left', visible: true },
			{ field: 'acquiredCompanyRegistrationNumber', header: 'Acquired Company Number', minWidth: '130px', maxWidth: '130px', textAlign: 'left', visible: true },
			{ field: 'acquiredCompanyName', header: 'Acquired Company', minWidth: '220px', maxWidth: '220px', textAlign: 'left', visible: true },
			{ field: 'acquiredDate', header: 'Acquired Date', minWidth: '100px', maxWidth: '100px', textAlign: 'center', visible: true },
			{ field: 'considerationPart1', header: 'Consideration Part 1', minWidth: '140px', maxWidth: '140px', textAlign: 'right', visible: true },
			{ field: 'considerationPart2', header: 'Consideration Part 2', minWidth: '140px', maxWidth: '140px', textAlign: 'right', visible: true },
			{ field: 'enquiryContact1', header: 'Enquiry Contact 1', minWidth: '150px', maxWidth: '150px', textAlign: 'left', visible: ( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasAddOnPermission('contactInformation') ) },
			{ field: 'phoneContact1', header: 'Phone Contact 1', minWidth: '130px', maxWidth: '130px', textAlign: 'center', visible: ( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasAddOnPermission('contactInformation') ) },
			{ field: 'enquiryContact2', header: 'Enquiry Contact 2', minWidth: '150px', maxWidth: '150px', textAlign: 'left', visible: ( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasAddOnPermission('contactInformation') ) },
			{ field: 'phoneContact2', header: 'Phone Contact 2', minWidth: '130px', maxWidth: '130px', textAlign: 'center', visible: ( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasAddOnPermission('contactInformation') ) },
			{ field: 'freeFormatComment', header: 'Additional Details', minWidth: '260px', maxWidth: 'none', textAlign: 'left', visible: true }
		];

		let companyNumber = [ this.companyData.companyRegistrationNumber ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_COMPANY_DETAILS', 'acquisitonMergerInformation', companyNumber).subscribe( res => {

			if (res.body["status"] === 200 && res.body["results"].length) {

				this.sharedLoaderService.hideLoader();
				this.aquisitionMergerData = res.body["results"];

				this.aquisitionMergerData = this.aquisitionMergerData.sort((a, b): any => {
					let prevDate: any = this.commonService.changeToDate(a.acquiredDate),
						newDate: any = this.commonService.changeToDate(b.acquiredDate);
					if (prevDate < newDate) return 1;
					if (prevDate > newDate) return -1;
				});

				this.aquisitionMergersReportData = this.aquisitionMergerData;				

				for (let i = 0; i < this.aquisitionMergerData.length; i++) {
					
					if (this.aquisitionMergerData[i]["considerationPart1"]) {
						this.aquisitionMergerData[i]["considerationPart1"] = this.aquisitionMergerData[i]["considerationPart1"].replace(/ /g, "").replace("million", "000000").replace("m", "000000").replace("billion", "000000000").replace(/,/g, "").replace(/us/gi, "");
					}
					if (this.aquisitionMergerData[i]["considerationPart2"]) {
						this.aquisitionMergerData[i]["considerationPart2"] = this.aquisitionMergerData[i]["considerationPart2"].replace(/ /g, "").replace("million", "000000").replace("m", "000000").replace("billion", "000000000").replace(/,/g, "").replace(/us/gi, "");
					}
				}
			} else {
				this.sharedLoaderService.hideLoader();
				this.aquisitionMergerData = [];
			}
		}, err => {
			this.sharedLoaderService.hideLoader();
			this.aquisitionMergerData =[];
			throw err;
		});
	}

}
