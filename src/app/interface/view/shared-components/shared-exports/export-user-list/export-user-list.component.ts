import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { subscribedPlan } from 'src/environments/environment';

import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { SharedLoaderService } from '../../shared-loader/shared-loader.service';
import { FormatDataExportUserListService } from './format-data-export-user-list.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';

@Component({
	selector: 'dg-export-user-list',
	templateUrl: './export-user-list.component.html',
	styleUrls: ['./export-user-list.component.scss']
})
export class ExportUserListComponent implements OnInit {

	@Input() userListTableData: any;
	@Input() listDataValues: Array<any>;
	@Input() thisPage: string;
	@Input() dialogBoolean: Object;
	@Input() exportListDynamicName: string;
	@Input() selectedCompany: Array<any>;
	@Input() tableName: any;

	@Output() resetFilters = new EventEmitter<any>();
	@Output() successMessage = new EventEmitter<any>();

	subscribedPlanModal: any = subscribedPlan;
	constantMessages: any = UserInteractionMessages;

	userDetails: Partial< UserInfoType > = {};
	customEmailId: string = undefined;

	showUpgradePlanDialog: boolean = false;
	customEmailOrNotdialog: boolean = false;
	emailValidateBool: boolean = false;
	customEmail: boolean = false;

	dataCount: number;
	newLimit: number;

	sequenceColumnForExport = [
		{ field: 'dName', header: 'Name' },
		{ field: 'directorName', header: 'Director Name' },
		{ field: 'linkedDirector', header: 'Linked Director' },
		{ field: 'fullName', header: 'Person Name' },
		{ field: 'companyName', header: 'Company Name' },
		{ field: 'companyNumber', header: 'Company Number' },
		{ field: 'position', header: 'Position' },
		{ field: 'jobTitle', header: 'Job Title' },
		{ field: 'directorRole', header: 'Role' },
		{ field: 'email', header: 'Email' }
	];

	constructor(
		private userAuthService: UserAuthService,
		private formatData: FormatDataExportUserListService,
		private datePipe: DatePipe,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit() {
		this.userDetails = this.userAuthService?.getUserInfo();
		
		if ( this.thisPage == 'exportPageOnly' ) {
			this.exportListDynamicName = "DG_Export_Only_Report_";
		} else if ( this.thisPage == 'importExport') { 
			this.exportListDynamicName = "DG_Import_Only_Report_";
		} else {
			this.exportListDynamicName = "DG_Export_Report_";
		}	
	}

	async exportLimitCheck() {

		if ( ( ( [ this.subscribedPlanModal['Monthly_Expand'], this.subscribedPlanModal['Expand_Annual_One_Year'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Expand_Annual_Two_Year'], this.subscribedPlanModal['Expand_New_Monthly'], this.subscribedPlanModal['Monthly_Expand_Paid_Test'], this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Expand'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Annually_Expand_Trial'], this.subscribedPlanModal['Monthly_Expand_Trial'], this.subscribedPlanModal['Expand_Weekly_Trial'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Compliance_Plan'] ].includes( this.userDetails?.planId ) && this.userDetails?.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) ) {

			let userData: any = await this.globalServerCommunication.getUserExportLimit();
			
			if ( this.thisPage == 'personContactInfo' ) {
				if ( this.userListTableData.selection.length === 0 ) {
					this.dataCount = this.userListTableData.value.length;
				} else if ( this.userListTableData.selection.length > 0 ) {
					this.dataCount = this.userListTableData.selection.length;
				}
				
				if ( this.dataCount <= userData.contactInformationLimit ) {
					this.newLimit = userData.contactInformationLimit - this.dataCount;
					this.exportToExcel();
				} else {
					this.successMessage.emit({ severity: 'info', message: this.constantMessages['infoMessage']['noExportLimitMessage'] });
				}

			} else {
				this.exportToExcel();
			}


		} else {
			event.preventDefault();
			event.stopPropagation();
			this.showUpgradePlanDialog = true;
		}

	}

	exportToExcel() {

		const tableData = this.userListTableData;
		const actualCols = JSON.parse(JSON.stringify(tableData.columns));
		const actualVals = JSON.parse(JSON.stringify(tableData.value));
		let colsTemp = [], dataTemp = [], dataSelectionTemp = [], dataFilteredTemp = [];

		if (tableData.value) {
			for (let i = 0; i < tableData.value.length; i++) {

				if (tableData.value[i].chipData != undefined) {
					tableData.value[i].chipData = tableData.value[i].chipData[0].chip_group + ': ' + tableData.value[i].chipData[0].chip_values[0];
				}
				if (tableData.value[i].createdOn != undefined) {
					tableData.value[i].createdOn = this.datePipe.transform(tableData.value[i].createdOn, "dd/MM/yyyy")
				}
				
				if (tableData.value[i].updatedOn != undefined) {
					tableData.value[i].updatedOn = this.datePipe.transform(tableData.value[i].updatedOn, "dd/MM/yyyy")
				}
				if (tableData.value[i].created != undefined) {
					tableData.value[i].created = this.datePipe.transform(tableData.value[i].created, "dd/MM/yyyy")
				}
				if (tableData.value[i].lastUpdated != undefined) {
					tableData.value[i].lastUpdated = this.datePipe.transform(tableData.value[i].lastUpdated, "dd/MM/yyyy")
				}
			}
			for (let value of tableData.value) {
				if( value.cpvCodes ) {
					let cpvCodeValue = []
					for (let cpvCode of value.cpvCodes ) {
						cpvCodeValue.push(cpvCode.code + '-' + cpvCode.desc);
					}
					value.cpvCodes = cpvCodeValue.filter(val => val)
					
				}
				if( value.supplierName ) {
					value.supplierName = value.supplierName.map(val => val.supplierName).filter(name => name);
					
				}
			}
		}

		for (let col of tableData.columns) {
			if ( !["download", "otherFeatures", "otherRelations", "safealertdescription", "edit", "editDetails", "editSettingsDetails", 'userExportListDownload', 'link', 'checkSanctions', 'updateDirectorData', 'action', 'epcDetailsButton', 'deleteEpc', 'epcButton'].includes(col.field) ) {
				if (col.field == 'dAddress') {
					col.field = 'address1';
				}
				if (col.field == 'dAddress2') {
					col.field = 'address2';
				}
				else if (col.field == 'userExportListCreated') {
					col.field = 'created';
				} else if (col.field == 'userExportListCategory ') {
					col.field = 'category';
				} else if (col.field == 'monitorBoolean') {
					col.header = 'Monitoring';
				} else if ( this.userAuthService.hasAddOnPermission('epc') && ['epcButtonCurrent', 'epcButtonPotential'].includes(col.field)){
					colsTemp.push(col);
				} else if ( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasAddOnPermission('contactInformation') && ['shareHolderEmail','pscEmail', 'tradingTelephone','directorEmail','phoneContact1','phoneContact2','enquiryContact1','enquiryContact2','phoneNumber','email','ctps','tradingCTPSFlag'].includes(col.field)){
					colsTemp.push(col);
				} else { 
					if ( !['epcButtonCurrent', 'epcButtonPotential', 'shareHolderEmail','pscEmail','tradingTelephone','directorEmail','phoneContact1','phoneContact2','enquiryContact1','enquiryContact2','phoneNumber','email','ctps','tradingCTPSFlag'].includes(col.field) ) {
						colsTemp.push(col);
					}
				}
			}
			
		}

		let filterCompNum = tableData.value.filter(val => {
			if ( ![ 'directors', 'pscData', 'pscStatementControlPersonDetails', 'pscSuperSecurePersonDetails', 'shareHolders', 'importantEmails', 'tradingAddress' ].includes( this.thisPage ) ) {
				return val.businessName || val.companyName || val.CompanyNameOriginal || val.companyRegistrationNumber;
			}

		});

		if (filterCompNum.length) {
			colsTemp.push({ field: 'companyLinkUrl', header: 'Business URL',  textAlign: 'right', width: '110px'});
		}

		if (tableData.selection.length > 0) {
			dataSelectionTemp = this.formatData.formatDataForCSV( colsTemp, tableData.selection, this.thisPage, this.dialogBoolean );
		}
		else if ( tableData.filteredValue === undefined || tableData.filteredValue === null || tableData.filteredValue === "" || tableData.filteredValue.length == 0 ) {
			dataTemp = this.formatData.formatDataForCSV( colsTemp, tableData.value, this.thisPage, this.dialogBoolean );
		} else {
			dataFilteredTemp = this.formatData.formatDataForCSV( colsTemp, tableData.filteredValue, this.thisPage, this.dialogBoolean );
		}

		let exportobj = {
			tableCols: undefined,
			userID: undefined,
			pageName: undefined,
			tableData: undefined,
			fileName: this.exportListDynamicName + new Date().getTime()
		};
		
		colsTemp = this.formatColumnSequencing( colsTemp );

		if (tableData.value !== undefined && tableData.value.length > 0) {
			if ( this.selectedCompany.length > 0 ) {
				tableData['columns'] = colsTemp;
				tableData['selection'] = dataSelectionTemp;
				tableData.exportCSV({ selectionOnly: true });
				exportobj.tableCols = tableData['columns'];
				exportobj.userID = this.userDetails?.dbID;
				if (this.thisPage === "companySearch") {
					exportobj.pageName = "Company_Search_Export";
				} else if (this.thisPage === "landRegistry") {
					exportobj.pageName = "Land_Registry_Export";
				} else if (this.thisPage === "landCorporate") {
					exportobj.pageName = "Land_Corporate_Export";
				} else {
					exportobj.pageName = "Company_Search_Export";
				}
				exportobj.tableData = tableData['selection'];
				tableData.columns = actualCols;
				tableData.value = actualVals;
				tableData['selection'] = [];
				tableData.filter(null);
				if (this.thisPage !== "directors") {

					this.resetFilters.emit( this.userListTableData )

				}

			} else if (tableData.value !== undefined) {
				if ( tableData.filteredValue === undefined || tableData.filteredValue === null || tableData.filteredValue === "" || tableData.filteredValue.length == 0 ) {
					tableData.columns = colsTemp;
					tableData.value = dataTemp;
					tableData.exportCSV();
					exportobj.tableCols = tableData['columns'];
					exportobj.userID = this.userDetails?.dbID;
					if (this.thisPage === "companySearch") {
						exportobj.pageName = "Company_Search_Export";
					} else if (this.thisPage === "landRegistry") {
						exportobj.pageName = "Land_Registry_Export";
					} else if (this.thisPage === "landCorporate") {
						exportobj.pageName = "Land Corporate Export";
					} else {
						exportobj.pageName = "Company_Search_Export";
					}
					exportobj.tableData = tableData.value;
					tableData.columns = actualCols;
					tableData.value = actualVals;
					} else {
					tableData.columns = colsTemp;
					tableData['filteredValue'] = dataFilteredTemp;
					tableData.exportCSV();
					exportobj.tableCols = tableData['columns'];
					exportobj.userID = this.userDetails?.dbID;
					if (this.thisPage === "companySearch") {
						exportobj.pageName = "Company_Search_Export";
					} else if (this.thisPage === "landRegistry") {
						exportobj.pageName = "Land_Registry_Export";
					} else if (this.thisPage === "landCorporate") {
						exportobj.pageName = "Land Corporate Export";
					} else {
						exportobj.pageName = "Company_Search_Export";
					}
					exportobj.tableData = tableData['filteredValue'];
					tableData.columns = actualCols;
					
					tableData.value = actualVals;
					tableData.filter(null);
					if (this.thisPage !== "directors") {
						this.resetFilters.emit( this.userListTableData )
					}
				}
			}
		}

		this.selectedCompany = [];
	
		this.successMessage.emit({ severity: 'success', message: this.constantMessages['successMessage']['exportSuccess'] });
		this.reduceExportLimit();

		setTimeout(() => {
			this.uploadCsvToS3( exportobj )
		}, 5000);
	
	}

	async exportCSVToMailDialog() {

		if ( this.checkEmailExport() ) {

			let userData: any = await this.globalServerCommunication.getUserExportLimit();

			if ( this.thisPage == 'personContactInfo' ) {
				this.dataCount = this.selectedCompany.length ? this.selectedCompany.length : this.userListTableData.value.length;

				if ( this.dataCount <= userData.contactInformationLimit ) {
					this.newLimit = userData.contactInformationLimit - this.dataCount;
					this.customEmailOrNotdialog = true;
				} else {
					this.successMessage.emit({ severity: 'info', message: this.constantMessages['infoMessage']['noExportLimitMessage'] });
				}

			} else {
				this.customEmailOrNotdialog = true;
			}

		} else {
			this.showUpgradePlanDialog = true;
		}

	}

	async exportCSVToMail() {

		this.customEmailOrNotdialog = false;
		this.sharedLoaderService.showLoader();

		if ( this.checkEmailExport() ) {

			const tableData = this.userListTableData;		
			const tableDatacolumns = JSON.parse(JSON.stringify( tableData._columns ));

			let obj: any = {};
			let tableDataActualColumn = [];

			for (let col of tableData._columns) {
				if (( !['safealertdescription', 'monitorBoolean', 'link', 'checkSanctions', 'updateDirectorData', 'action', 'epcButton', 'epcButtonCurrent', 'epcButtonPotential', 'tradingTelephone', 'shareHolderEmail','pscEmail', 'tradingTelephone','directorEmail','phoneContact1','phoneContact2','enquiryContact1','enquiryContact2','phoneNumber','email','ctps','tradingCTPSFlag' ].includes( col.field ))) {
					tableDataActualColumn.push(col)
				} else if (col.field == 'monitorBoolean') {
					col.header = 'Monitoring';
					tableDataActualColumn.push(col)
				} else if (this.userAuthService.hasAddOnPermission('epc') && ['epcButtonCurrent', 'epcButtonPotential'].includes( col.field )){
					tableDataActualColumn.push(col)
				} else if ( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasAddOnPermission('contactInformation') && [ 'shareHolderEmail','pscEmail', 'tradingTelephone','directorEmail','phoneContact1','phoneContact2','enquiryContact1','enquiryContact2','phoneNumber','email','ctps','tradingCTPSFlag' ].includes( col.field )){
					tableDataActualColumn.push(col)
				}  else {
					if( !['epcButtonCurrent', 'epcButtonPotential', 'tradingTelephone', 'shareHolderEmail','pscEmail', 'tradingTelephone','directorEmail','phoneContact1','phoneContact2','enquiryContact1','enquiryContact2','phoneNumber','email','ctps','tradingCTPSFlag', 'safealertdescription'].includes(col.field) ) {
					   tableDataActualColumn.push(col)
					}   
				}
			}

			if( this.thisPage == 'personContactInfo') {
				let col = tableDataActualColumn.filter((item) => item.field !== 'action');
				tableDataActualColumn = col
			}

			let filterCompNum = tableData.value.filter(val => {

				if ( ![ 'directors', 'pscData', 'pscStatementControlPersonDetails', 'pscSuperSecurePersonDetails', 'shareHolders', 'tradingAddress' ].includes( this.thisPage )) {
					return val.businessName || val.companyName || val.CompanyNameOriginal || val.companyRegistrationNumber;
				}

			});

			for (let value of tableData.value) {
				if( value.cpvCodes ) {
					let cpvCodeValue = []
					for (let cpvCode of value.cpvCodes ) {
						cpvCodeValue.push(cpvCode.code + '-' + cpvCode.desc);
					}
					value.cpvCodes = cpvCodeValue.filter(val => val)
				}
				if( value.supplierName ) {
					value.supplierName = value.supplierName.map(val => val.supplierName).filter(name => name);
				}
			}

			if( filterCompNum.length ){
				tableDataActualColumn.push({ field: 'companyLinkUrl', header: 'Business URL', textAlign: 'right', width: '110px'});
			}
			
			obj["tableCols"] = tableDataActualColumn;
			obj["userID"] = this.userDetails?.dbID;

			if (this.thisPage === "companySearch") {

				obj["pageName"] = "Company_Search_Export";

			} else if (this.thisPage === "landRegistry") {

				obj["pageName"] = "Land_Registry_Export";

			} else if (this.thisPage === "landCorporate") {

				obj["pageName"] = "Land_Corporate_Export";

			} else {
				obj["pageName"] = "Company_Search_Export";

			}

			obj['fileName'] = this.exportListDynamicName + new Date().getTime();
			obj["email"] = this.customEmailId;

			tableDataActualColumn = this.formatColumnSequencing( tableDataActualColumn );
			
			if (tableData._selection.length > 0) {
				obj["tableData"] = this.formatData.formatDataForCSV( tableDataActualColumn, tableData._selection, this.thisPage, this.dialogBoolean );
				let sendMail = await this.exportToMaiL(obj);
			} else if ( tableData.filteredValue === undefined || tableData.filteredValue === null || tableData.filteredValue === "" || tableData.filteredValue.length == 0 ) {
				obj["tableData"] = this.formatData.formatDataForCSV( tableDataActualColumn, tableData._value, this.thisPage, this.dialogBoolean );
				let sendMail = await this.exportToMaiL(obj);

			} else {
				obj["tableData"] = this.formatData.formatDataForCSV( tableDataActualColumn, tableData.filteredValue, this.thisPage, this.dialogBoolean );
				tableData['filteredValue'] = [];
				let sendMail = await this.exportToMaiL(obj);
				this.resetFilters.emit( this.userListTableData );
			}

			tableData['selection'] = [];
			tableData['columns'] = tableDatacolumns;
			this.selectedCompany = [];

			if ( this.emailValidateBool != false ) {
				this.successMessage.emit({ severity: 'success', message: this.constantMessages['successMessage']['exportToMailSuccess'] });
				this.emailValidateBool = false;
			} else {
				this.successMessage.emit({ severity: 'success', message: 'File has been successfully exported to your registered email.' });
			}

			this.reduceExportLimit();

			setTimeout(() => {
				this.customEmailId = undefined;
			}, 5000);

			this.customEmailId = '';
			
			if( !['investeeFinderPage', 'investorFinderPage'].includes(this.tableName)) {
				this.resetFilters.emit( this.userListTableData );
			}
			this.selectedCompany = [];

		} else {
			event.preventDefault();
			event.stopPropagation();
			this.showUpgradePlanDialog = true;
			
		}
		
		this.customEmail = false;
		this.sharedLoaderService.hideLoader();

	}

	validateEmail(emailField) {

		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

		if (reg.test(emailField) == false) {
			this.emailValidateBool = false;
		} else {
			this.emailValidateBool = true;
		}
	}

	uploadCsvToS3( exportobj ) {

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'uploadExportedCsv', exportobj ).subscribe( res => {

		});

	}

	formatColumnSequencing( tableColumn ) {

		let i = 0;

		for ( let index in this.sequenceColumnForExport ) {

			for ( let column in tableColumn ) {
				
				if ( tableColumn[ column ].header == this.sequenceColumnForExport[ index ].header ) {

					tableColumn.splice( i, 0, tableColumn[ column ] );
					tableColumn.splice( parseInt(column) + 1, 1 );

					i ++;

				}
				
			}
			
		}

		return tableColumn;

	}

	checkEmailExport() {

		if ( ( ( [this.subscribedPlanModal['Monthly_Enterprise'], this.subscribedPlanModal['Enterprise_Annual_One_Year'], this.subscribedPlanModal['Enterprise_Annual_Two_Year'], this.subscribedPlanModal['Enterprise_New_Monthly'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Monthly_Enterprise_Paid_Test'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Enterprise'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Enterprise_Conversion_For_Ravi'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Premium_New_Monthly'], this.subscribedPlanModal['Premium_Annual_One_Year'], this.subscribedPlanModal['Premium_Trial_48_Hours'], this.subscribedPlanModal['Premium_Annual_Two_Year'], this.subscribedPlanModal['Compliance_Plan'] ].includes( this.userDetails?.planId ) && this.userDetails?.isSubscriptionActive ) || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) ) {

			return true;

		}

		return false;

	}

	exportToMaiL(obj: any) {
		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'exportCsvToEmail', obj ).subscribe( res => {});
	}

	reduceExportLimit() {
		if ( [ 'personContactInfo' ].includes( this.thisPage ) ) {

			let obj = {
				userId: this.userDetails?.dbID,
				thisPage: this.thisPage,
				newLimit: this.newLimit
			}
			this.globalServerCommunication.reduceExportLimit(obj);

		}

	}

}
