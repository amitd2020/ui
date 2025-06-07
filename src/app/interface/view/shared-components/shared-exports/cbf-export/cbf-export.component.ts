import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { SharedLoaderService } from '../../shared-loader/shared-loader.service';
import { SearchCompanyService } from '../../../features-modules/search-company/search-company.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';

@Component({
	selector: 'dg-cbf-export',
	templateUrl: './cbf-export.component.html',
	styleUrls: ['./cbf-export.component.scss']
})
export class CbfExportComponent implements OnInit {

	@Input() tableData: any;
	@Input() appliedFilters: any = undefined;
	@Input() searchTotalCount: number;
	@Input() thisPage: string = '';

	@Output() successMessage = new EventEmitter<any>();

	userDetails: Partial< UserInfoType > = {};

	constantMessages: any = UserInteractionMessages;

	msgs = [];

	cbfExportMessage: string= "";
	exportCSVDialogMessage: string = undefined;
	exportListDynamicName: string;

	showLoginDialog: boolean = false;
	exportCondition: boolean = false;
	csvDialog: boolean = false;
	payloadForChildApi: PayloadFormationObj = {};

	constructor(
		private userAuthService: UserAuthService,
		private sharedLoaderService: SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService,
		private searchCompanyService: SearchCompanyService
	) { }

	ngOnInit() {
		this.searchCompanyService.$apiPayloadBody.subscribe( res => {
            this.payloadForChildApi = res;
        });

		this.userDetails = this.userAuthService?.getUserInfo();
	}

	async exportCbfLimitCheck() {

		this.sharedLoaderService.showLoader();

		// if ( this.authGuardService.isLoggedin() ) {

			this.cbfExportMessage = " CBF";
			let message: string = undefined;
			let userData: any = await this.globalServiceCommnunicate.getUserExportLimit();
			let dataCount: number = 0;

			if ( this.searchTotalCount >= 5000 ) {
				dataCount = 5000;
			} else {
				dataCount = this.searchTotalCount;
			}

			if ( dataCount <= userData.advancedLimit ) {
				this.exportCondition = true;
			} else {
				this.exportCondition = false;
			}

			if ( this.exportCondition == true ) {
				message = this.constantMessages['confirmation']['crmExportAllConfirmation'];
				this.exportDialog( message );
			} else if ( this.exportCondition == false ) {
				message = this.constantMessages['infoMessage']['noExportLimitMessage'];
				this.exportDialog( message );
			}

		// } else {
		// 	this.showLoginDialog = true;
		// }

	}

	exportDialog( message ){

		this.csvDialog = true;
		this.exportCSVDialogMessage = message;
		this.sharedLoaderService.hideLoader();

	}

	exportAllCBF() {

		this.csvDialog = false;
		this.cbfExportMessage = '';
		let obj = {};

		if ( this.thisPage == "companySearch" ) {
			this.exportListDynamicName = "DG_CBF_Export_" + new Date().getTime();
		}

		if ( this.payloadForChildApi?.filterData ) {
			obj['appliedFilters'] = this.payloadForChildApi?.filterData;
		}

		obj['userId'] = this.userDetails?.dbID;
		obj['emialId'] = this.userDetails?.email;
		obj['thisPage'] = this.thisPage;
		obj['fileName'] = this.exportListDynamicName;
		obj["listId"] = this.payloadForChildApi?.listId;
		obj["userRole"] = this.userDetails?.userRole;
		obj["userName"] =  this.userDetails?.username;
		
		if ( this.searchTotalCount >= 5000 ) {
			obj['count'] = 5000;
		} else {
			obj['count'] = this.searchTotalCount;
		}

		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'exportAllCBF', obj ).subscribe( res => {
			if ( res.body.status == 200 ) {

				this.successMessage.emit({ severity: 'success', message: 'The files are exported as per your export limit, Please check your mail.' });
				
			}
		});

	}

	closeExportDialog() {
		this.cbfExportMessage = '';
		this.csvDialog = false;
	}

}
