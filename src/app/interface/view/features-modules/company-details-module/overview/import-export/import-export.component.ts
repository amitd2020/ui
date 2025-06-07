import { Component, OnInit, AfterViewInit } from '@angular/core';
import { take } from 'rxjs';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { subscribedPlan } from 'src/environments/environment';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';

export enum Month {
	undefined, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
}

@Component({
	selector: 'dg-import-export',
	templateUrl: './import-export.component.html',
	styleUrls: ['./import-export.component.scss']
})
export class ImportExportComponent implements OnInit, AfterViewInit {

	isLoggedIn: boolean = false;
	userDetails: Partial< UserInfoType > = {};
	subscribedPlanModal: any = subscribedPlan;

	companyExportData: any;
	companyImportData: any;

	companyData: any;
	lastOneYearExports: any;
	lastFiveYearExports: any;
	lastOneYearImports: any;
	lastFiveYearImports: any;
	lastImportMonthYear: any;
	lastExportMonthYear: any;

	companyImportExportColumns: any[];

	constructor(
		private dataCommunicatorService: DataCommunicatorService,
		public userAuthService: UserAuthService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit(): any {

		this.sharedLoaderService.showLoader();

		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( loggedIn => {
			this.isLoggedIn = loggedIn;

			if ( this.isLoggedIn && this.userAuthService.hasAddOnPermission('internationalTradeFilter') ) {

				this.userDetails = this.userAuthService?.getUserInfo();

				this.dataCommunicatorService.$dataCommunicatorVar.subscribe( (res: any) => this.companyData = res );
		
				this.companyImportExportColumns = [
					{ field: 'month', header: 'Month', minWidth: '150px', maxWidth: '150px', textAlign: 'center' },
					{ field: 'years_without_month', header: 'Year', minWidth: '150px', maxWidth: '150px', textAlign: 'center' },
					{ field: 'commodity_code', header: 'Commodity Code', minWidth: '200px', maxWidth: 'none', textAlign: 'left' }
				];
				
				let reqArr = [ this.companyData.companyRegistrationNumber ];
		
				this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_COMPANY_DETAILS', 'importExportData', reqArr ).subscribe( res => {
		
					let data = res.body;
		
					if ( res.body.status == 200 ) {
						this.companyExportData = data.companyExportData && data.companyExportData.length > 0 ? this.formatImportExportData(data.companyExportData) : undefined;
						this.lastOneYearExports = data.companyExportData && data.companyExportData.length > 0 ? data.lastOneYearExports : "-";
						this.lastFiveYearExports = data.companyExportData && data.companyExportData.length > 0 ? data.lastFiveYearExports : "-";
						this.lastExportMonthYear = data.companyExportData && data.companyExportData.length > 0 ? data.lastExportMonthYear : "-";
						this.companyImportData = data.companyImportData && data.companyImportData.length > 0 ? this.formatImportExportData(data.companyImportData) : undefined;
						this.lastOneYearImports = data.companyImportData && data.companyImportData.length > 0 ? data.lastOneYearImports : "-";
						this.lastFiveYearImports = data.companyImportData && data.companyImportData.length > 0 ? data.lastFiveYearImports : "-";
						this.lastImportMonthYear = data.companyImportData && data.companyImportData.length > 0 ? data.lastImportMonthYear : "-";
						this.formatImportExportData(this.companyExportData);
					}
		
				});
				
			}
		});

		
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.sharedLoaderService.hideLoader();
		}, 200);
	}

	formatImportExportData(dataArray) {
		let commodityCodeArray = ["commodity_code1", "commodity_code2", "commodity_code3", "commodity_code4", "commodity_code5", "commodity_code6", "commodity_code7", "commodity_code8", "commodity_code9", "commodity_code10", "commodity_code11", "commodity_code12", "commodity_code13", "commodity_code14", "commodity_code15", "commodity_code16", "commodity_code17", "commodity_code18", "commodity_code19", "commodity_code20", "commodity_code21", "commodity_code22", "commodity_code23", "commodity_code24", "commodity_code25", "commodity_code26", "commodity_code27", "commodity_code28", "commodity_code29", "commodity_code30", "commodity_code31", "commodity_code32", "commodity_code33", "commodity_code34", "commodity_code35", "commodity_code36", "commodity_code37", "commodity_code38", "commodity_code39", "commodity_code40", "commodity_code41", "commodity_code42", "commodity_code43", "commodity_code44", "commodity_code45", "commodity_code46", "commodity_code47", "commodity_code48", "commodity_code49", "commodity_code50"];
		let tempArray: Array<any> = [];
		if (dataArray) {
			dataArray.forEach((object) => {
				let tempObj = {};
				let commodityCodeDataArray = [];

				for (const key in object) {
					if (key == "month") {
						tempObj[key] = Month[parseInt(object[key])]
					} else if (commodityCodeArray.includes(key)) {
						if (object[key]) {
							commodityCodeDataArray.push(object[key])
						}
					} else if (key == "years_without_month" || key == "year") {
						tempObj[key] = parseInt(object[key]);
					}

				}
				tempObj["commodity_code"] = commodityCodeDataArray;
				tempArray.push(tempObj);
			});
			tempArray.sort((a, b) => b.year - a.year)
		}
		return tempArray;
	}

}
