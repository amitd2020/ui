import { NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { CurrencyPipe, TitleCasePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { ConfirmationService, MessageService } from "primeng/api";
import { mkConfig, generateCsv, download } from "export-to-csv";

import { UserInteractionMessages } from "src/assets/utilities/data/UserInteractionMessages.const";
import { exportPayloadConstant } from "src/export-payload/export-payload-constant";
import { subscribedPlan } from 'src/environments/environment';

import { ListServiceService } from "src/app/interface/service/list-service.service";
import { CommonServiceService } from "src/app/interface/service/common-service.service";
import { SharedLoaderService } from "../../shared-loader/shared-loader.service";
import { ServerCommunicationService } from "src/app/interface/service/server-communication.service";
import { ListPageName } from '../../../features-modules/search-company/search-company.constant';
import { UserAuthService } from "src/app/interface/auth-guard/user-auth/user-auth.service";

@Component({
	selector: 'dg-export-template',
	templateUrl: './export-template.component.html',
	styleUrls: ['./export-template.component.scss']
})
export class ExportTemplateComponent implements OnInit {

	@ViewChild('createUserTemplateForm', { static: false }) createUserTemplateForm: NgForm;

	@Input() tableData: any;
	@Input() selectedCompany: any;
	@Input() searchTotalCount: number = 0;
	@Input() disabledButton: boolean;
	@Input() tableName: any;
	@Input() thisPage: any;
	@Input() appliedFilters: any;
	@Input() filterSearchArray: any;
	@Input() showFullyOutstanding: boolean;
	@Input() exportFilteredDataBool: boolean = false;
	@Input() adminRecordListTable: any;
	@Input() listId: string;

	@Output() successMessage = new EventEmitter<any>();
	@Output() thisPageExportTemplate = new EventEmitter<any>();
	@Output() resetFilters = new EventEmitter<any>();

	template_name: string;
	template_id: string;
	userDefinedCompanyNumber: string;
	userDefinedCompanyName: string;
	exportCSVDialogMessage: string;
	exportListDynamicName: string;
	userID: string;
	inputPageName: string = '';
	outputPageName: string = '';
	constantMessages: any = UserInteractionMessages;

	exportData: any;
	searchTemplateName: any;
	currentPlan: any;
	editTemplateData: any;
	savedListArray: any;
	toBeExportedCount: any;
	templateMsgs: any[];
	createTempmsgs: any[];
	availableSourceData: any[];
	msgs: any[];
	msgs1: any[];
	templateJsonData: any[];
	templateJsonCols: Array<any> = [];
	appliedFiltersKeys: Array<any> = [];
	appliedFiltersDirectorsChipValuesArray: Array<any> = [];
	exportProgressData: Array<any> = [];
	excludedSavedListIdArray: Array<any> = [];

	userLimitCountForExport: number;
	newLimit: number;

	subscribedPlanModal: any = subscribedPlan;
	noSpecialCharacter: RegExp = /^[A-Za-z\d\_\s]+$/;

	// loadingData: boolean = false;
	exportAllButton: boolean = false;
	fieldValidateForm: boolean = false;
	exportAllCondition: boolean = false;
	createTemplateBlock: boolean = false;
	templateEditMode: boolean = false;
	exportDialogNoLimit: boolean = false;
	exportTemplateDialog: boolean = false;
	showUpgradePlanDialog: boolean = false;
	exportAllTemplateDialog: boolean = false;
	userTemplateLimitUpgrade: boolean = false;
	csvDialogCustomForUserTemplate: boolean = false;
	readMoreBoolean: boolean = false;
	resetCheckbox: boolean = false;
	fetchVerifyEmail: boolean = false;
	selectAllCheckBoxCard: boolean;

	windowInnerWidth: number;

	sendObjForUserTemplate: object = {};
	selectTemplateJson: {};
	templateJson: any[];
	selectedTemplateArr: any[];

	payload = exportPayloadConstant;

	allCheckBoxesForExport: any;

	constructor(
		public userAuthService: UserAuthService,
		public toCurrencyPipe: CurrencyPipe,
		private listService: ListServiceService,
		private messageService: MessageService,
		private confirmationService: ConfirmationService,
		public activeRoute: ActivatedRoute,
		private commonService: CommonServiceService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService,
		private titlecasePipe: TitleCasePipe
	) { }

	ngOnInit() {

		this.currentPlan = this.userAuthService?.getUserInfo()?.planId;
		this.userID = this.userAuthService?.getUserInfo()?.dbID;
		this.userDefinedCompanyName = this.userAuthService?.getUserInfo()?.companyName;
		this.userDefinedCompanyNumber = ( this.userAuthService?.getUserInfo()?.companyNumber && this.userAuthService?.getUserInfo()?.companyNumber != 'undefined' ) ? this.userAuthService?.getUserInfo()?.companyNumber : '';

		this.inputPageName = this.activeRoute.snapshot.queryParams['listPageName'] ? this.activeRoute.snapshot.queryParams['listPageName'] : "";

		switch ( this.inputPageName.toLowerCase() ) {
			case ListPageName.businessMonitor.outputPage.toLowerCase():
				this.outputPageName = ListPageName.businessMonitor.outputPage;
				break;
			case ListPageName.businessMonitorPlus.outputPage.toLowerCase():
				this.outputPageName = ListPageName.businessMonitorPlus.outputPage;
				break;
			case ListPageName.businessWatch.outputPage.toLowerCase():
				this.outputPageName = ListPageName.businessWatch.outputPage;
				break;
			default:
				this.outputPageName = this.thisPage;
				break;
		}

		this.windowInnerWidth = window.innerWidth;

		if ( this.windowInnerWidth <= 1536 ) {

			this.readMoreBoolean = true;

		}

		this.templateJsonCols = [
			{ field: 'downloadTemplate', header: 'Action', minWidth: '80px', maxWidth: '80px', textAlign: 'center' },
			{ field: 'templateName', header: 'Template Name', minWidth: '320px', maxWidth: '320px', textAlign: 'left' },
			{ field: 'templateJson', header: 'Fields', minWidth: '200px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'deleteTemplate', header: 'Action', minWidth: '220px', maxWidth: '220px', textAlign: 'center' },
		];
		
	}

	selectDataToExportDialog() {

		if ( this.userAuthService.hasFeaturePermission('Export Template') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {

			this.getUserList();
			this.getUserExportLimit();
			this.getTemplatesListData();

			this.createTemplateBlock = false;

			if ( this.appliedFilters && this.appliedFilters.length > 0 ) {

				for ( let i = 0; i < this.appliedFilters.length; i++ ) {

					if ( this.appliedFilters[i]['chip_group'] !== undefined ) {

						if ( !this.appliedFiltersKeys.includes( this.appliedFilters[i]['chip_group'] ) ) {
							this.appliedFiltersKeys.push(this.appliedFilters[i]['chip_group']);
						}

					}

				}

			}

			if (this.selectedCompany.length > 0) {
				this.exportAllCondition = false;

				this.exportData = this.tableData;
				if (this.exportData.selection.length === 0) {
					this.toBeExportedCount = this.exportData.value.length;

				} else if (this.exportData.selection.length > 0) {
					this.toBeExportedCount = this.exportData.selection.length;
				}
			} else {

				this.exportAllCondition = true;
				if (this.searchTotalCount >= 5000) {
					this.toBeExportedCount = 5000;
					setTimeout(() => {
						this.exportAllButton = false;
					}, 120000);

				} else if (this.searchTotalCount < 5000) {
					if (this.searchTotalCount < 1000) {
						this.toBeExportedCount = this.searchTotalCount;
						setTimeout(() => {
							this.exportAllButton = false;
						}, 30000);
					} else {
						this.toBeExportedCount = this.searchTotalCount;
						setTimeout(() => {
							this.exportAllButton = false;
						}, 120000);
					}
				}
			}

			this.exportTemplateDialog = true;
			this.fetchVerifyEmail = false;

		} else {

			this.showUpgradePlanDialog = true;

		}

	}

	getUserList() {

		let obj = [ 25, 1 ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getUserLists', obj ).subscribe( res =>  {
			
			this.savedListArray = res.body['results'];			
			
		});

	}

	getTemplatesListData() {
		
		let apiEndpoint, reqobj;
		if( this.thisPage == 'companySearch' || this.tableName == 'recordList') {
			apiEndpoint= 'getUserDefinedExportTemplateList';
		    // reqobj = [ this.userID];
		} else if ( ['personContactInfo', 'showContactScreen'].includes( this.thisPage ) || this.tableName == 'adminRecordList' ) {
			apiEndpoint = 'userDefinedContactTemplates';
		    // reqobj = [ this.userID];
		}
		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', apiEndpoint ).subscribe( res =>  {
			let userTemplateData = res.body;
			this.templateJsonData = [];
			
			if ( userTemplateData.status === 200 ) {
				
				this.templateJsonData = userTemplateData.results;
				
				for ( let tempdata of this.templateJsonData ) {

					let tempHeader = [];

					if ( tempdata['templateName'].toLowerCase().includes( 'ignite' ) || tempdata['templateName'].toLowerCase().includes( 'bespoke template' ) || tempdata['templateName'].toLowerCase().includes( 'mj capital' ) || tempdata['templateName'].toLowerCase().includes( 'abl advisory template' ) || tempdata['templateName'].toLowerCase().includes( 'customized template 1' ) || tempdata['templateName'].toLowerCase().includes( 'customized template 2' ) || tempdata['templateName'].toLowerCase().includes( 'customized template 3' ) || tempdata['templateName'].toLowerCase().includes( 'customized template 4' ) || tempdata['templateName'].toLowerCase().includes( 'bbx world' ) ) {

						tempdata['templateName'] = tempdata['templateName'].toLowerCase();
						tempdata['templateForIgniteAndMj'] = tempdata.templateJson.map((val) => ' ' + val.header);

					} else {

						if ( tempdata.templateJson && tempdata.templateJson.length && tempdata.templateJson != null && tempdata.templateJson != undefined ) {

							tempdata['templateJsonDataForm'] = tempdata.templateJson.map( (val) => ' ' + val.header );

						} else if ( tempdata.columns && tempdata.columns.length && tempdata.columns != null && tempdata.columns != undefined ) {

							for ( let columnData of tempdata.columns ) {
								for ( let key in columnData ) {
									for ( let value of columnData[ key ] ) {
										
										if ( value.userDefinedHeader ) {
											tempHeader.push(' ' + value.userDefinedHeader);
										} else {
											tempHeader.push(' ' + value.header);
										}
	
									}
								}
							}

							tempdata['templateJsonDataForm'] = tempHeader;

						}

					}

				}

				this.payload.columns.map( val => Object.keys( val ).map( key => val[ key ] = [] ) );
				
			}

			this.template_name = '';
			this.templateEditMode = false;

		});

	}

	async getUserExportLimit() {
		let userDataExportLimit = await this.globalServerCommunication.getUserExportLimit();
		this.userLimitCountForExport = userDataExportLimit.advancedLimit;
	}

	customExportLimitCheck( from: any ) {
		if ( this.thisPage == 'companySearch' ){
			this.getUserReduceExportLimit(from);
		}else { 

			if ( from == 'exportTemplate' ) {
				this.exportTemplateDialog = false;
	
				if (this.selectTemplateJson && this.selectTemplateJson['templateId']) {
					if ( [ 'customized template 1', 'customized template 2', 'customized template 3', 'customized template 4' ].includes( this.selectTemplateJson['templateName'] ) || ( this.selectTemplateJson['templateJson'] && this.selectTemplateJson['templateJson'].length ) ) {
	
						this.templateData(this.selectTemplateJson['templateJson']);
					} else {
	
						this.templateData(this.selectTemplateJson['columns']);
					}
					return;
				}
			} else if ( from == 'exportTemplateAll' ) {
	
				this.exportTemplateDialog = false;
				this.exportAllTemplateDialog = true;
	
			}
		}


	}

	getUserReduceExportLimit(form?){
		this.sharedLoaderService.showLoader();
		let idsavedListdata = this.appliedFilters?.length ? this.appliedFilters.map( ({saveListData}) => saveListData )[0] : [];
		let exportDataModified = []
		if ( this.selectedCompany.length > 0 ) {
			exportDataModified = this.selectedCompany.map((obj) => [ 'diversityInclusion' ].includes( this.thisPage ) ? obj.company_number : obj.companyRegistrationNumber.toLowerCase() );
		}
		let payload = 
			{
				"filterData": this.appliedFilters?.length ? this.appliedFilters : [],
				"listId": this.activeRoute.snapshot.queryParams['cListId'] && !this.appliedFilters.length ? this.activeRoute.snapshot.queryParams['cListId'] : [ 'diversityInclusion' ].includes( this.thisPage ) ? this.listId : this.listId ? this.listId : idsavedListdata ? idsavedListdata : '',
				"reqBy": this.activeRoute.snapshot.queryParams['reqBy'] ? this.activeRoute.snapshot.queryParams['reqBy'] : "",
				"pageName": this.thisPage,
				"selectedCompanyArray":  exportDataModified,
				"excludedListArray": this.excludedSavedListIdArray ? this.excludedSavedListIdArray : [],
				"developerFeatures": this.userAuthService.hasAddOnPermission('developerFeatures')
			}
				
			this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'getUserReduceExportLimit', payload ).subscribe( res => {
				if( res.body.status == 200 ) {
					this.toBeExportedCount = res.body.count
					if( this.toBeExportedCount == 0 ) {
						this.csvDialogCustomForUserTemplate = false;
						this.exportAllTemplateDialog = false;
						this.exportCSVDialogMessage = res.body.message;
						this.exportDialogNoLimit = true;
						this.sharedLoaderService.hideLoader();
						return
						
					} else if ( this.userLimitCountForExport < this.toBeExportedCount ) {
						this.exportTemplateDialog = false;
						this.userTemplateLimitUpgrade = true;
						this.sharedLoaderService.hideLoader();
					} 
					else {
						if( form == 'exportTemplate' ) {
							this.csvDialogCustomForUserTemplate = true
						}else if ( form == 'exportTemplateAll' ) {
							this.exportAllTemplateDialog = true;
						}
						this.exportTemplateDialog = false;
						this.sharedLoaderService.hideLoader();
					} 
				}else {
					console.log(res);
					this.sharedLoaderService.hideLoader();
				}
			});
	}

	selectedSource() {
		this.availableSourceData = this.availableSourceData.sort((a, b) => a.orderId - b.orderId);
	}

	selectedAllSource() {
		this.availableSourceData = this.availableSourceData.sort((a, b) => a.orderId - b.orderId);
	}

	return(event) {
		event.preventDefault();
		event.stopPropagation();
		return false;
	}

	templateData( templateJson ) {

		this.templateJson = [];
		this.templateJson = templateJson;
		let dataCount: number;
		if (this.exportData.selection.length === 0) {
			dataCount = this.exportData.value.length;

		} else if (this.exportData.selection.length > 0) {
			dataCount = this.exportData.selection.length;
		}

		// let reqobj = {
        //     userId: this.userID
        // }

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getUserExportLimit' ).subscribe( res =>  {
			let data = res.body.results[0];
			if ( dataCount <= data.advancedLimit ) {
				this.newLimit = data.advancedLimit - dataCount;
				this.csvDialogCustomForUserTemplate = true;
				this.exportCSVDialogMessage = this.toCurrencyPipe.transform(dataCount, '', ' ', '1.0-0').toString() + " credits will be deducted from your export limit";
			} else {
				this.csvDialogCustomForUserTemplate = false;
				this.userTemplateLimitUpgrade = true;
			}
		});

	}

	downloadUserTemplateCSV() {

		this.sharedLoaderService.showLoader();

		const tableData = this.exportData;
		let dataToExport: Array<any> = [];
		let csv_array = [];
		let igniteExportData: any;
		this.exportListDynamicName = 'DG_Export_Template_Export_' + new Date().getTime();
		const fileName = this.exportListDynamicName  + '.xlsx';

		if (tableData.selection.length > 0) {
			dataToExport = tableData.selection;
		} else {
			dataToExport = tableData.value;
		}

		if ( this.thisPage == 'diversityInclusion' ) {
			dataToExport = dataToExport.map( obj => obj.company_number );
		} else {
			dataToExport = dataToExport.map( obj => obj.companyRegistrationNumber );
		}
		let idsavedListdata = this.appliedFilters?.length ? this.appliedFilters.map( ({saveListData}) => saveListData )[0] : [];

		let obj = {};
		obj["appliedFilters"] = [];
		obj["exportSheetType"] = 'excel';
		obj["sheetType"] = 'extended';
		obj["exportType"] = 'template_selected';
		obj["exportEmail"] = false;
		obj["customEmailId"] = '';
		obj["userId"] = this.userID;
		obj["filterSearchArray"] = this.filterSearchArray;
		obj["fileName"] = "DG_Company_Search_Export_" + new Date().getTime();
		obj["thisPage"] = this.thisPage;
		obj["emailId"] = this.userAuthService?.getUserInfo()?.email;
		obj["clientAdminMasterEmail"] = this.userAuthService.hasRolePermission( [ 'Client Admin', 'Client User' ] ) ? this.userAuthService?.getUserInfo()?.clientAdminEmail : '';
		obj["selectedCompanyArray"] = dataToExport;
		obj["excludeList"] = this.excludedSavedListIdArray && this.excludedSavedListIdArray.length ? true : false;
		obj["excludedListArray"] = this.excludedSavedListIdArray ? this.excludedSavedListIdArray : [];
		obj["redirectURL"] = window.location.origin + '/list/exported-files';
		obj["listId"] = this.activeRoute.snapshot.queryParams['cListId'] && !this.appliedFilters.length && dataToExport.length == 0 ? this.activeRoute.snapshot.queryParams['cListId'] : this.listId ? this.listId : idsavedListdata ? idsavedListdata : '';
		
		if ( this.selectTemplateJson && this.selectTemplateJson['columns'] ) {

			obj["columns"] = this.selectTemplateJson['columns'];
			obj["templateName"] = this.selectTemplateJson['templateName'].toLowerCase();

		}
		
		obj["userRole"] = this.userAuthService?.getUserInfo()?.userRole;

		obj["exportCount"] = dataToExport.length;

		let igniteAndMJObj = {
			"exportType": "excel",
			"cmpNoArray": dataToExport,			
			"templateName": this.selectTemplateJson['templateName'],
			"userId": this.userID
		}

		if ( this.selectTemplateJson['templateName'].includes( 'ignite' ) || this.selectTemplateJson['templateName'].includes( 'bespoke template' ) || this.selectTemplateJson['templateName'].includes( 'mj capital' ) || this.selectTemplateJson['templateName'].includes( 'abl advisory template' ) || this.selectTemplateJson['templateName'].includes( 'customized template 1' ) || this.selectTemplateJson['templateName'].includes( 'customized template 2' ) || this.selectTemplateJson['templateName'].includes( 'customized template 3' ) || this.selectTemplateJson['templateName'].includes( 'customized template 4' )  || this.selectTemplateJson['templateName'].includes( 'bbx world' ) ) {

			this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_API', 'exportData', igniteAndMJObj ).subscribe( res =>  {

				if ( res.body.status == 200 ) {

					igniteExportData = res.body.results;

					for ( let mjCapitalObj of igniteExportData ) {
						// mjCapitalObj[ 'Email' ] = mjCapitalObj[ 'Email' ] || '';
						if ( mjCapitalObj.hasOwnProperty('Telephone') ) {
							mjCapitalObj['Telephone'] = mjCapitalObj['Telephone'] ? mjCapitalObj['Telephone'] : '';
						}
						if( [null].includes(mjCapitalObj?.Email) ) {
							mjCapitalObj.Email = ''
						}
						if( [null].includes(mjCapitalObj?.['Incorporation Date']) ) {
							mjCapitalObj['Incorporation Date'] = ''
						}
						csv_array.push( mjCapitalObj );

					}

				}

				const options = {
					fieldSeparator: ',',
					quoteStrings: true,
					decimalSeparator: '.',
					showLabels: true,
					filename: fileName,
					useTextFile: false,
					useBom: true,
					useKeysAsHeaders: true,
				};

				// const csvExporter = new ExportToCsv(options); 
				const csvExporter = mkConfig(options);

				if (csv_array.length > 0) {
					// csvExporter.generateCsv(csv_array);
					const csv = generateCsv(  csvExporter )( csv_array )
					download( csvExporter )( csv )
				}

				let tableCols = Object.keys(csv_array[0]).map(e => {
					let obj = {
						field: e,
						header: e
					}
					return obj
				});

				let exportobj = {
					tableCols: tableCols,
					userID: this.userID,
					pageName: "Template_Data_Export",
					tableData: csv_array,
					fileName: "DG_Company_Search_Export_" + new Date().getTime(),
					templateName: this.selectTemplateJson['templateName']
				};

				this.successMessage.emit({ severity: 'success' , message: this.constantMessages['successMessage']['exportSuccess'] });
	
				this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'uploadExportedCsv', exportobj ).subscribe( res =>  {});
				this.reduceExportLimit();

			});

		} else {

			if ( this.selectTemplateJson && this.selectTemplateJson['templateJson'] && this.selectTemplateJson['templateJson'].length ) {

				let _exportDataObj = {
					"exportType": "excel",
					"cmpNoArray": dataToExport,
					"columns": { },
					userId: this.userID
				}

				_exportDataObj["columns"]["tradingAddress"] = true;

				let checkContactField = this.selectTemplateJson['templateJson'].some(e => e.header === "Contact's Email Address");

				if(checkContactField) {
					_exportDataObj["columns"]["ContactInformationData"] = true;
				}	

				this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_API', 'exportData', _exportDataObj ).subscribe( res => {

					let data = res.body;

					if ( data.status == 200 ) {

						let newExportData = JSON.parse(JSON.stringify(this.formatData(data.results)));

						for (let i = 0; i < newExportData.length; i++) {
							let newObj = newExportData[i];
			
							newObj["tradingAddress"] = newObj["tradingAddressData"] && newObj["tradingAddressData"].length > 0 ? newObj["tradingAddressData"][0] : undefined
							newObj["companyRegistrationNumber"] = newObj["companyRegistrationNumber"].toUpperCase();
							newObj["businessName"] = this.titlecasePipe.transform( newObj["businessName"] );
							newObj["companyStatus"] = this.titlecasePipe.transform( newObj["companyStatus"] );
			
							if( newObj["Industries"] && newObj["Industries"]["SicIndustry_1"] ) {
								newObj["Industries"]["SicIndustry_1"] = this.titlecasePipe.transform( newObj["Industries"]["SicIndustry_1"] );
							}
			
							if( newObj["Industries"] && newObj["Industries"]["SicText_1"] ) {
								newObj["Industries"]["SicText_1"] = this.titlecasePipe.transform( newObj["Industries"]["SicText_1"] );
							}
			
							if( newObj["RegAddress_Modified"]["addressLine1"] ) {
								newObj["RegAddress_Modified"]["addressLine1"] = this.titlecasePipe.transform( newObj["RegAddress_Modified"]["addressLine1"] );
							}
			
							if( newObj["RegAddress_Modified"]["addressLine2"] ) {
								newObj["RegAddress_Modified"]["addressLine2"] = this.titlecasePipe.transform( newObj["RegAddress_Modified"]["addressLine2"] );
							}
			
							if( newObj["RegAddress_Modified"]["addressLine3"] ) {
								newObj["RegAddress_Modified"]["addressLine3"] = this.titlecasePipe.transform( newObj["RegAddress_Modified"]["addressLine3"] );
							}
			
							if( newObj["RegAddress_Modified"]["addressLine4"] ) {
								newObj["RegAddress_Modified"]["addressLine4"] = this.titlecasePipe.transform( newObj["RegAddress_Modified"]["addressLine4"] );
							}
			
							if( newObj["RegAddress_Modified"]["country"] ) {
								newObj["RegAddress_Modified"]["country"] = this.titlecasePipe.transform( newObj["RegAddress_Modified"]["country"] );
							}
			
							if( newObj["RegAddress_Modified"]["county"] ) {
								newObj["RegAddress_Modified"]["county"] = this.titlecasePipe.transform( newObj["RegAddress_Modified"]["county"] );
							}
			
							if( newObj["RegAddress_Modified"]["postalCode"] ) {
								newObj["RegAddress_Modified"]["postalCode"] = ( newObj["RegAddress_Modified"]["postalCode"] ).toUpperCase();
							}
			
							if (newObj["RegAddress_Modified"]["district"]) {
								newObj["RegAddress_Modified"]["district"] = this.titlecasePipe.transform( newObj["RegAddress_Modified"]["district"].replace(/,/g, ", ") );
							}
			
							if( newObj["tradingAddressData"] && newObj["tradingAddressData"].length ) {
								if ( newObj["tradingAddressData"][0]["tradingAddress1"] ) {
									newObj["tradingAddressData"][0]["tradingAddress1"] = this.titlecasePipe.transform( newObj["tradingAddressData"][0]["tradingAddress1"] );						
								}
								if ( newObj["tradingAddressData"][0]["tradingAddress2"] ) {
									newObj["tradingAddressData"][0]["tradingAddress2"] = this.titlecasePipe.transform( newObj["tradingAddressData"][0]["tradingAddress2"] );
								}
								if ( newObj["tradingAddressData"][0]["tradingAddress3"] ) {
									newObj["tradingAddressData"][0]["tradingAddress3"] = this.titlecasePipe.transform( newObj["tradingAddressData"][0]["tradingAddress3"] );
								}
								if ( newObj["tradingAddressData"][0]["tradingAddress4"] ) {
									newObj["tradingAddressData"][0]["tradingAddress4"] = this.titlecasePipe.transform( newObj["tradingAddressData"][0]["tradingAddress4"] );
								}
								if ( newObj["tradingAddressData"][0]["country"] ) {
									newObj["tradingAddressData"][0]["country"] = this.titlecasePipe.transform( newObj["tradingAddressData"][0]["country"] );
								}
								if  ( newObj["tradingAddressData"][0]["county"] ) {
									newObj["tradingAddressData"][0]["county"] = this.titlecasePipe.transform( newObj["tradingAddressData"][0]["county"] );
								}
								if(newObj["tradingAddressData"][0]["district"]) {
									newObj["tradingAddressData"][0]["district"] = this.titlecasePipe.transform( newObj["tradingAddressData"][0]["district"].replace(/,/g, ", ") );
								}
								if ( newObj["tradingAddressData"][0]["postalCode"] ) {
									newObj["tradingAddressData"][0]["postalCode"] = ( newObj["tradingAddressData"][0]["postalCode"] ).toUpperCase();
								}
								if ( newObj["tradingAddressData"][0]["region"] ) {
									newObj["tradingAddressData"][0]["region"] = this.titlecasePipe.transform( newObj["tradingAddressData"][0]["region"] );
								}
							}
			
							if( newObj["sicCode07"]["SicText_1"] ) {
								newObj["sicCode07"]["SicText_1"] = this.titlecasePipe.transform( newObj["sicCode07"]["SicText_1"] );
							}
			
							if( newObj["industryTag"] ) {
								newObj["industryTag"] = this.titlecasePipe.transform( newObj["industryTag"].replace(/,/g, ", ") );
							}
			
							if(newObj["auditorsQualificationCodes"]) {
								if ( newObj["auditorsQualificationCodes"][0]["auditors"] ) {
									newObj["auditorsQualificationCodes"][0]["auditors"] = this.titlecasePipe.transform( newObj["auditorsQualificationCodes"][0]["auditors"]);
								}
							}				
			
							if(newObj["bankDetails"]) {
								if(newObj["bankDetails"][0]["bankName"]) {
									newObj["bankDetails"][0]["bankName"] = this.titlecasePipe.transform(newObj["bankDetails"][0]["bankName"]);
								}
							}
			
						}
			
						newExportData.forEach(obj => {
							let tempObj = {};
							this.templateJson.forEach(key => {
								tempObj[key.header] = "";
								if ( key.field.includes(".") ) {
									if ( ["statutoryAccounts.turnover","statutoryAccounts.numberOfEmployees","statutoryAccounts.wagesAndSalaries","statutoryAccounts.netWorth","statutoryAccounts.tradeCreditors","statutoryAccounts.tradeDebtors", "auditorsQualificationCodes.auditors", "bankDetails.bankName", "statutoryAccounts.profitBeforeTax", "statutoryAccounts.totalCurrentAssets", "statutoryAccounts.grossProfit", "statutoryAccounts.export"].includes(key.field) ) {
										tempObj[key.header] = obj[key.field.split(".")[0]] && obj[key.field.split(".")[0]].length > 0 ? obj[key.field.split(".")[0]][0][key.field.split(".")[1]] ? obj[key.field.split(".")[0]][0][key.field.split(".")[1]] : "" : ""
									} 
									else if ( key.header === "Total Outstanding Charges") {
										let count = 0
										count = obj.mortgagesObj ? obj.mortgagesObj.filter(
											obj => obj.memorandumNature === ""
										).length : 0
										tempObj[key.header] = count 
									}
									else {
									
										tempObj[key.header] = obj[key.field.split(".")[0]] && obj[key.field.split(".")[0]][key.field.split(".")[1]] ? obj[key.field.split(".")[0]][key.field.split(".")[1]] : ""
									}
								} else {
									tempObj[key.header] = obj[key.field] ? obj[key.field] : ""
								}				
							});
							csv_array.push(tempObj);
						});
						if(checkContactField) {
							let tempCsvArray = csv_array;
							csv_array = [];
							let directorsDataHeaders = ["Contact's Title", "Contact's First Name", "Contact's Last Name", "Contact's Job title", "Contact's Email Address", "Contact's Linked-in Tag"];
							let directorTemplateJson = this.templateJson.filter (
								obj => directorsDataHeaders.includes(obj.header)
							);
							for(let obj of tempCsvArray) {
								csv_array.push(JSON.parse(JSON.stringify(obj)));
								let tempObj = JSON.parse(JSON.stringify(obj));
								let companyData = newExportData.filter(e => e.companyRegistrationNumber === obj["Company Number"]);
								if( companyData && companyData[0].directorsData && companyData[0].directorsData.length > 0) {
									for(let data of companyData[0].directorsData) {
										if (!data.toDate) {	
											directorTemplateJson.forEach(key => {
												if(['email', 'linked_url'].includes(key.field)) {
													obj[key.header] = this.fetchByStringKey(data, key.field) ? this.fetchByStringKey(data, key.field) : "";
												} else {										
													obj[key.header] = this.fetchByStringKey(data, key.field) ? this.titlecasePipe.transform(this.fetchByStringKey(data, key.field)) : "";
												}
											});  						
											csv_array.push(JSON.parse(JSON.stringify(obj)));
											obj = JSON.parse(JSON.stringify(tempObj));
										}
									}
								}      
							}
						}
						const options = {
							fieldSeparator: ',',
							quoteStrings: true,
							decimalSeparator: '.',
							showLabels: true,
							filename: fileName,
							useTextFile: false,
							useBom: true,
							useKeysAsHeaders: true,
						};
						// const csvExporter = new ExportToCsv(options);
						const csvExporter = mkConfig(options);
						if (csv_array.length > 0) {
							// csvExporter.generateCsv(csv_array);
							const csv = generateCsv(  csvExporter )( csv_array )
							download( csvExporter )( csv )							
						}

						this.successMessage.emit({ severity: 'success', message: this.constantMessages['successMessage']['exportSuccess'] });
						this.reduceExportLimit();

					}

				});

			} else {
				obj["listId"] = '';
				obj["thisPage"] = 'companyListWithCriteria';
				// this.globalServerCommunication.globalServerRequestCall( 'post', apiRoute,  apiEndpoint ).subscribe( res =>  {
				this.listService.exportAllExcel(obj).then(data => {

					if ( data.message == 'Exports are added to queue.' || data.message == 'Export Queue Triggered!' || data.message == 'Email Queue Triggered!' ) {
	
						this.successMessage.emit({ severity: 'success', message: this.constantMessages['successMessage']['exportSuccess'] });
						this.selectedCompany = [];
	
					}
	
				});

			}

		}

		this.csvDialogCustomForUserTemplate = false;
		this.sharedLoaderService.hideLoader();
		this.selectedCompany = [];
		this.selectTemplateJson = {};
		
	}

	exportAllTemplate() {
		let idsavedListdata = this.appliedFilters?.length ? this.appliedFilters.map( ({saveListData}) => saveListData )[0] : [];
		let obj = {}
		obj["appliedFilters"] = this.appliedFilters?.length ? this.appliedFilters : [];
		obj["exportSheetType"] = 'excel';
		obj["sheetType"] = 'extended';
		obj["exportType"] = 'template_all';
		obj["exportEmail"] = false;
		obj["customEmailId"] = '';
		obj["userId"] = this.userID;
		obj["filterSearchArray"] = this.filterSearchArray;
		obj["fileName"] = "DG_Company_Search_Export_" + new Date().getTime();
		obj["thisPage"] = this.listId || idsavedListdata ? 'companyListWithCriteria' : this.outputPageName  ? this.outputPageName : '';
		obj["emailId"] = this.userAuthService?.getUserInfo()?.email;
		obj["clientAdminMasterEmail"] = this.userAuthService.hasRolePermission( [ 'Client Admin', 'Client User' ] ) ? this.userAuthService?.getUserInfo()?.clientAdminEmail : '';
		obj["listId"] = this.activeRoute.snapshot.queryParams['cListId'] && !this.appliedFilters.length ? this.activeRoute.snapshot.queryParams['cListId'] : [ 'diversityInclusion' ].includes( this.thisPage ) ? this.listId : this.listId ? this.listId : idsavedListdata ? idsavedListdata : '';
		obj["selectedCompanyArray"] = this.selectedCompany;
		obj["excludeList"] = this.excludedSavedListIdArray && this.excludedSavedListIdArray.length ? true : false;
		obj["excludedListArray"] = this.excludedSavedListIdArray ? this.excludedSavedListIdArray : [];
		obj["redirectURL"] = window.location.origin + '/list/exported-files';
		obj["filterSearchArray"] = this.filterSearchArray;
		obj['fetchVerifyEmail'] = this.fetchVerifyEmail;
		
		if ( this.selectTemplateJson && this.selectTemplateJson['columns'] ) {
			for ( let selectedTemplate of this.selectTemplateJson['columns'] ) {

				for ( let templateArray in selectedTemplate ) {

					for ( let template of selectedTemplate[ templateArray ] ) {
						delete template.header
					}

				}

			}
			obj["columns"] = this.selectTemplateJson['columns'];
			obj["templateName"] = this.selectTemplateJson['templateName'].toLowerCase();
		}
		
		obj["userRole"] = this.userAuthService?.getUserInfo()?.userRole;

		if ( this.searchTotalCount >= 5000 ) {
			obj["exportCount"] = 5000;
		} else {
			obj["exportCount"] = this.searchTotalCount;
		}

		let igniteAndMJObjAll = {
			appliedFilters: this.appliedFilters?.length ? this.appliedFilters : [],
			userId: this.userID,
			filterSearchArray: this.filterSearchArray,
			fileName: "DG_Company_Search_Export_" + new Date().getTime(),
			thisPage:  this.outputPageName,
			emailId: this.userAuthService?.getUserInfo()?.email,
			exportFilteredDataBool: this.exportFilteredDataBool,
			listId: this.activeRoute.snapshot.queryParams['cListId'] && !this.appliedFilters.length ? this.activeRoute.snapshot.queryParams['cListId'] : [ 'diversityInclusion' ].includes( this.thisPage ) ? this.listId : this.listId ? this.listId : idsavedListdata ? idsavedListdata : '',
			selectTemplateJson: this.selectTemplateJson['templateJson'],
			templateName: this.selectTemplateJson['templateName'],
			userRole: this.userAuthService?.getUserInfo()?.userRole,
			fetchVerifyEmail: this.fetchVerifyEmail
		}

		if ( this.searchTotalCount >= 5000 ) {
			igniteAndMJObjAll["exportCount"] = 5000;
		} else {
			igniteAndMJObjAll["exportCount"] = this.searchTotalCount;
		}

		// let reqobj = {
        //     userId: this.userID
        // }

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getUserExportLimit' ).subscribe( res =>  {

			let userData = res.body.results[0];
			let exportLimit = userData['advancedLimit'];

			if ( ( (userData && exportLimit == 0) || (userData && exportLimit == null)) || (userData && (exportLimit < obj["exportCount"])) ) {

				this.exportAllTemplateDialog = false;
				this.exportDialogNoLimit = true;
				this.exportCSVDialogMessage = this.constantMessages['infoMessage']['noExportLimitMessage'];

			} else {
				if ( this.selectTemplateJson['templateName'].includes( 'ignite' ) || this.selectTemplateJson['templateName'].includes( 'bespoke template' ) || this.selectTemplateJson['templateName'].includes( 'mj capital' ) || this.selectTemplateJson['templateName'].includes( 'abl advisory template' ) || this.selectTemplateJson['templateName'].includes( 'customized template 1' ) || this.selectTemplateJson['templateName'].includes( 'customized template 2' ) || this.selectTemplateJson['templateName'].includes( 'customized template 3' ) || this.selectTemplateJson['templateName'].includes( 'customized template 4' ) || this.selectTemplateJson['templateName'].includes( 'bbx world' )) {

					this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'exportAllExcel', igniteAndMJObjAll ).subscribe( res =>  {
						if (res.body.status == 200) {
							this.exportAllTemplateDialog = false;
							this.fetchVerifyEmail = false;
							this.successMessage.emit({ severity: 'success', message: this.constantMessages['successMessage']['exportAllSuccess1'] });
						}
					});

				} else {

					if ( this.selectTemplateJson && this.selectTemplateJson['templateJson'] && this.selectTemplateJson['templateJson'].length ) {

						let _exportObjAll = {
							"appliedFilters": this.appliedFilters,
							"filterSearchArray": this.filterSearchArray,
							"userId": this.userID,
							"emailId": this.userAuthService?.getUserInfo()?.email,
							"thisPage": this.outputPageName,
							"exportCount": this.toBeExportedCount,
							"fileName": "DG_Company_Search_Export_" + new Date().getTime(),
							"exportFilteredDataBool": this.exportFilteredDataBool,
							"userRole": this.userAuthService?.getUserInfo()?.userRole,
							fetchVerifyEmail: this.fetchVerifyEmail
						}

						_exportObjAll["listId"] = this.activeRoute.snapshot.queryParams['cListId'] && !this.appliedFilters.length ? this.activeRoute.snapshot.queryParams['cListId'] : [ 'diversityInclusion' ].includes( this.thisPage ) ? this.listId : '';
						_exportObjAll["seletedTemplateJson"] = this.selectTemplateJson['templateJson'];
						_exportObjAll["templateName"] = this.selectTemplateJson['templateName'];

						this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'exportAllExcel', _exportObjAll ).subscribe(res => {

							let data = res.body;

							if (data.status == 200) {

								this.exportAllButton = true;
								this.fetchVerifyEmail = false;
								this.exportAllTemplateDialog = false;
								this.successMessage.emit({ severity: 'success', message: this.constantMessages['successMessage']['exportAllSuccess1'] });

							}

						});


					} else {

						this.listService.exportAllExcel(obj).then(data => {
							if ( data.message == "Exports are added to queue." || data.message == 'Export Queue Triggered!' || data.message == 'Email Queue Triggered!' ) {
	
								this.exportAllTemplateDialog = false;
								this.fetchVerifyEmail = false;
								this.successMessage.emit({ severity: 'success', message: this.constantMessages['successMessage']['exportAllSuccess1'] });
	
							}
						});

					}


				}

			}

		});	

	}
	
	reduceExportLimit() {

		let obj = {
			userId: this.userID,
			thisPage: this.thisPage,
			newLimit: this.newLimit
		}

		this.globalServerCommunication.reduceExportLimit(obj);

		// let reqobj = {
        //     userId: this.userID
        // }

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getUserExportLimit' ).subscribe( res => {
			this.userLimitCountForExport = res.body.results[0]['advancedLimit'];
		});

	}

	editUserTemplate(inputData) {
		
		this.editTemplateData = inputData;
		this.createTemplateBlock = true;
		
		setTimeout(() => {
			(document.getElementById('createTemplateAccordion') as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
			this.templateEditMode = true;
		}, 1000);

		this.template_name = inputData.templateName;
		this.template_id = inputData.templateId;

	}

	copyTemplate(inputData, templateName) {

		let obj = {};

		let matchingTemplate = inputData.filter(val => val.templateName.split('_copy').length ? val.templateName.split('_copy')[0] == templateName.split('_copy')[0] : false);
		let exactMatch = inputData.filter(val => val.templateName.split().length ? val.templateName.split()[0] == templateName.split()[0] : false);

		if ( templateName.includes( 'ignite' ) || templateName.includes( 'bespoke template' ) || templateName.includes( 'mj capital' ) || templateName.includes( 'abl advisory template' ) || templateName.includes( 'bbx world' ) ) {

			obj['template_json'] = matchingTemplate[0].templateJson;

		} else {

			obj['columns'] = exactMatch[0].columns.filter( val => Object.values(val)[0]['length']);

		}

		obj['companyNumber'] = this.userDefinedCompanyNumber?this.userDefinedCompanyNumber: "" ; 
		obj['companyName'] = this.userDefinedCompanyName?this.userDefinedCompanyName: "";
		obj['userId'] = this.userID;

		if (matchingTemplate.length == 1) {

			obj['template_name'] = matchingTemplate[0].templateName ? matchingTemplate[0].templateName + '_copy' : "";

		} else {

			obj['template_name'] = matchingTemplate[0].templateName ? `${matchingTemplate[matchingTemplate.length - 1].templateName}_copy (${matchingTemplate.length - 1})` : "";

		}

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'saveUserDefinedExportTemplate', obj ).subscribe( res =>  {
			let data = res.body;

			if (data.message == 'Template created successfully !!' || data.status == 201) {

				this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: data.message });

				this.getTemplatesListData();

			}

			// this.loadingData = false;

		});

	}

	submitUserTemplateInfo(formData: NgForm) {

		this.template_id = this.templateEditMode ? this.template_id : undefined;

		this.fieldValidateForm = true;

		let isDiversityColumn: boolean, diversityArrayKey = [];

		this.sendObjForUserTemplate = {
			columns: this.payload.columns.filter( val => Object.values( val )[0]['length'] ),
			template_name: this.template_name ? this.template_name : "",
			companyNumber: this.userDefinedCompanyNumber ? this.userDefinedCompanyNumber : ( formData.form.value.companyNumber ? formData.form.value.companyNumber : "" ),
			companyName: this.userDefinedCompanyName ? this.userDefinedCompanyName : ( formData.form.value.companyName ? formData.form.value.companyName : "") ,
			userId: this.userID,
			_id: this.template_id,
		}

		diversityArrayKey = this.payload.columns.filter( val => Object.values( val )[0]['length'] ).map( data => Object.keys( data )[0] );
		isDiversityColumn = diversityArrayKey.includes( 'diversityAndInclusionInformation' );

		this.sendObjForUserTemplate['addOn'] = {
			diversityAndInclusion: isDiversityColumn
		}

		if ( this.template_name && this.template_name != "" ) {

			// this.sharedLoaderService.showLoader();

			let apiEndpoint;

			apiEndpoint = ['personContactInfo', 'showContactScreen'].includes( this.thisPage ) ? 'saveUserDefinedContactTemplate' : 'saveUserDefinedExportTemplate';

			this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', apiEndpoint, this.sendObjForUserTemplate ).subscribe( res =>  {
				let data = res.body;

				if ( [ 'Template created successfully !!', 'Template updated successfully !!' ].includes( data.message ) || data.status == 201) {

					this.createTempmsgs = [];
					this.resetCheckbox = true;
					// this.createTempmsgs.push({ severity: 'success', summary: data.message });
					this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: data.message });
					
					setTimeout(() => {
						this.createTempmsgs = [];
						this.resetCheckbox = false;
					}, 2000);

				}

				setTimeout(() => {
					this.getTemplatesListData();
				}, 1000);
			});

			this.fieldValidateForm = false;
			formData.reset();

		} else {
			this.fieldValidateForm = true;
			
			this.msgs1 = [];
			this.msgs1.push({ severity: 'warn', summary: 'Please enter template name!' });

			setTimeout(() => {
				this.msgs1 = [];
			}, 2000);

		}
	}

	deleteUserTemplate(templateId) {

		this.thisPageExportTemplate.emit(true);

		this.confirmationService.confirm({
            message: 'Are you sure that you want to perform this action?',
            accept: () => {
				let apiEndpoint;
				if( this.thisPage == 'companySearch' || this.tableName == 'recordList' ) {
					apiEndpoint = 'deleteUserTemplate';
				}else if ( ['personContactInfo', 'showContactScreen'].includes( this.thisPage ) || this.tableName == 'adminRecordList' ) {
					apiEndpoint = 'deleteUserDefinedContactTemplate';
				}
				let reqObj = [ templateId ];
				this.globalServerCommunication.globalServerRequestCall('delete', 'DG_LIST', apiEndpoint, reqObj ).subscribe(res => {
					let data = res.body;
					if(data.status == 200 || data.message == 'Template deleted successfully') {
						
						this.msgs = [];
						this.msgs.push({ severity:'success', summary: data.message });

						setTimeout(() => {
							this.msgs = [];
						}, 7000);
						this.sharedLoaderService.hideLoader();
						this.getTemplatesListData();

					}
					
				});
            },
			reject: () => {
				this.msgs = [];
				this.msgs.push({ severity: 'warn', summary: 'Template Not Deleted!' });

				setTimeout(() => {
					this.msgs = [];
				}, 4000);
			}
        });
		
	}

	closeDialogBox() {
		if ( this.subscribedPlanModal['Valentine_Special'].includes( this.currentPlan ) ) {
			this.resetFilters.emit( this.adminRecordListTable );
		}
	}

	closeExportTemplateDialog() {

		this.searchTemplateName = '';
		this.editTemplateData = [];
		this.fieldValidateForm = false;
		this.createUserTemplateForm.controls['checkTemplate_name'].reset();

		this.exportTemplateDialog = false;;
		this.templateEditMode = false;

	}

	selectedCardForExport(event) {
		this.selectedTemplateArr = event;
	}

	createExportTemplate() {
		
		if( this.selectedTemplateArr['companyInformation'] && this.selectedTemplateArr['companyInformation'].length ) {
			this.formatExportColumnPayload( this.selectedTemplateArr['companyInformation'], 'companyInformation' );
		}
		
		if ( this.selectedTemplateArr['directorsInformation'] && this.selectedTemplateArr['directorsInformation'].length ) {
			this.formatExportColumnPayload( this.selectedTemplateArr['directorsInformation'], 'directorsInformation' );
		}

		if ( this.selectedTemplateArr['contactInformation'] && this.selectedTemplateArr['contactInformation'].length ) {
			this.formatExportColumnPayload( this.selectedTemplateArr['contactInformation'], 'contactInformation' );
		}

		if ( this.selectedTemplateArr['pscInformation'] && this.selectedTemplateArr['pscInformation'].length ) {

			let isSelectedPscName: number = this.selectedTemplateArr['pscInformation'].filter( val => val.key == 'pscName' ).length;

			if ( isSelectedPscName == 0 ) {

				this.selectedTemplateArr['pscInformation'].unshift({
					key: "pscName",
					header: "PSC Name",
					userDefinedHeader: "",
					cardName: "pscInformation",
					disabled: false,
					editInput: false
				});

			}

			this.formatExportColumnPayload( this.selectedTemplateArr['pscInformation'], 'pscInformation' );
			
		}

		if ( this.selectedTemplateArr['shareholderInformation'] && this.selectedTemplateArr['shareholderInformation'].length ) {
			this.formatExportColumnPayload( this.selectedTemplateArr['shareholderInformation'], 'shareholderInformation' );
		}

		if ( this.selectedTemplateArr['tradingAddressInformation'] && this.selectedTemplateArr['tradingAddressInformation'].length ) {
			this.formatExportColumnPayload( this.selectedTemplateArr['tradingAddressInformation'], 'tradingAddressInformation' );
		}

		if ( this.selectedTemplateArr['financialInformation'] && this.selectedTemplateArr['financialInformation'].length ) {
			this.formatExportColumnPayload( this.selectedTemplateArr['financialInformation'], 'financialInformation' );
		}

		if ( this.selectedTemplateArr['diversityAndInclusionInformation'] && this.selectedTemplateArr['diversityAndInclusionInformation'].length ) {
			this.formatExportColumnPayload( this.selectedTemplateArr['diversityAndInclusionInformation'], 'diversityAndInclusionInformation' );
		}
		
		if ( this.selectedTemplateArr['chargesInformation'] && this.selectedTemplateArr['chargesInformation'].length ) {
			this.formatExportColumnPayload( this.selectedTemplateArr['chargesInformation'], 'chargesInformation' );
		}

		if ( this.selectedTemplateArr['corporateLandInformation'] && this.selectedTemplateArr['corporateLandInformation'].length ) {
			this.formatExportColumnPayload( this.selectedTemplateArr['corporateLandInformation'], 'corporateLandInformation' );
		}
		this.selectAllCheckBoxCard = false

	}

	formatExportColumnPayload( selectedCard, cardName ) {

		if ( this.template_name && selectedCard && selectedCard.length ) {

			for ( let card of selectedCard ) {
			
				for ( let column of this.payload.columns ) {
						
					if ( column.hasOwnProperty( cardName ) ) {
						if ( card.editInput ) {

							column[ cardName ].push({ key: card.key, userDefinedHeader: '', header: card.header });

						} else {

							column[ cardName ].push({ key: card.key, userDefinedHeader: card.userDefinedHeader, header: card.header });
						}

						
					}
					
					
				}
				
			}

		}

	}

	checkStrLength( inputData ) {

		return inputData.toString().length;

	}

	cancelEditTemplate() {

		this.sharedLoaderService.showLoader();
		
		this.template_name = undefined;
		this.editTemplateData = [];
		
		this.createTempmsgs = [];
		this.resetCheckbox = true;
		this.createTempmsgs.push({ severity: 'success', summary: 'Edit Template Canceled' });
		
		setTimeout(() => {
			this.createTempmsgs = [];
			this.templateEditMode = false;
			this.resetCheckbox = false;
			this.sharedLoaderService.hideLoader();
		}, 2000);

	}

	selectedSavedListForExport( event ) {
		this.excludedSavedListIdArray = [];
		if ( event ) {
			this.excludedSavedListIdArray.push(...event) ;
		}
		
	}

	formatData(companiesData) {

		let searchedDirectorName: string = '', directorNameSearchCondition: string = '';

		// If Searched For Director From Header Search-bar or Filters

		if (this.appliedFilters.length) {
			for (let filterObj of this.appliedFilters) {
				if (filterObj.chip_group == 'Director Name') {
					directorNameSearchCondition = '';
					searchedDirectorName = filterObj.chip_values[0].toLowerCase();
					directorNameSearchCondition = filterObj.directorNameSearchAndOr;
				}
			}
		}


		let tempCompaniesData = [];
		
		if (companiesData) {

			companiesData.forEach(companyData => {

				companyData["total_directors_count"] = 0
				companyData["resigned_directors_count"] = 0;
				companyData["active_directors_count"] = 0;
				companyData["NumMortCharges"] = 0;

				if (companyData["companyRegistrationDate"] !== undefined) {
					if (companyData["companyRegistrationDate"] !== null) {
						companyData["companyRegistrationDate"] = this.commonService.formatDate(companyData["companyRegistrationDate"])
					}
				}

                if (companyData.companyContactDetails) {
                    let tempArray = [];
                    tempArray.push(companyData.companyContactDetails)
                    companyData["companyContactDetails"] = tempArray;
                }

				if (companyData['RegAddress_Modified']) {
					companyData['RegAddress'] = this.commonService.formatCompanyAddress(companyData['RegAddress_Modified']);
				}

				if (companyData["directorsData"] !== undefined) {
					if (companyData["directorsData"] !== null) {
						companyData["total_directors_count"] = companyData["totalDirectorsCount"];
						companyData["active_directors_count"] = companyData["activeDirectorsCount"];
						companyData["resigned_directors_count"] = companyData["resingedDirectorsCount"];
					}
				}

				if (companyData["mortgagesObj"] !== undefined) {
					if (companyData["mortgagesObj"] !== null) {
						companyData["NumMortCharges"] = companyData["mortgagesObj"].length;
					}
				}

				if (companyData["accountsMadeUpDate"] !== undefined) {
					if (companyData["accountsMadeUpDate"] !== null) {
						companyData["accountsMadeUpDate"] = this.changeToDate(this.commonService.formatDate(companyData["accountsMadeUpDate"]));
					}
				}

				if (companyData.ccjDetails) {
					companyData['CCJCount'] = companyData.ccjDetails.length;
				} else {
					companyData['CCJCount'] = '-';
				}

				// if (companyData.RegAddress_Modified.district_code) {
				//     companyData.RegAddress_Modified.district_code = companyData.RegAddress_Modified.district_code.toUpperCase();
				// }

				if (companyData.simplifiedAccounts) {
					if (companyData.simplifiedAccounts[0].turnover && companyData.simplifiedAccounts[0].turnover != "") {
						companyData['turnover_latest'] = companyData.simplifiedAccounts[0].turnover;
					} else {
						companyData['turnover_latest'] = "-";
					}
					if (companyData.simplifiedAccounts[0].estimated_turnover && companyData.simplifiedAccounts[0].estimated_turnover != "") {
						companyData['estimated_turnover'] =companyData.simplifiedAccounts[0].estimated_turnover;
					} else {
						companyData['estimated_turnover'] = "-";
					}
					if (companyData.simplifiedAccounts[0].totalAssets && companyData.simplifiedAccounts[0].totalAssets != "") {
						companyData['totalAssets_latest'] = companyData.simplifiedAccounts[0].totalAssets;
					} else {
						companyData['totalAssets_latest'] = "-";
					}
					if (companyData.simplifiedAccounts[0].totalLiabilities && companyData.simplifiedAccounts[0].totalLiabilities != "") {
						companyData['totalLiabilities_latest'] = companyData.simplifiedAccounts[0].totalLiabilities;
					} else {
						companyData['totalLiabilities_latest'] = "-";
					}
					if (companyData.simplifiedAccounts[0].netWorth && companyData.simplifiedAccounts[0].netWorth != "") {
						companyData['netWorth_latest'] = companyData.simplifiedAccounts[0].netWorth;
					} else {
						companyData['netWorth_latest'] = "-";
					}
					if (companyData.statutoryAccounts) {
						if (companyData.statutoryAccounts[0].grossProfit && companyData.statutoryAccounts[0].grossProfit != "") {
							companyData['grossProfit_latest'] = companyData.statutoryAccounts[0].grossProfit;
						}
						else {
							companyData['grossProfit_latest'] = '-';
						}
					} else {
						companyData['grossProfit_latest'] = '-';
					}
					if (companyData.simplifiedAccounts[0].numberOfEmployees) {
						companyData['numberOfEmployees'] = parseInt(companyData.simplifiedAccounts[0].numberOfEmployees);
					}
					// else {
					//     companyData['numberOfEmployees'] = "-";
					// }
				}
				// else {
				//     companyData['numberOfEmployees'] = "-";
				// }

				if (searchedDirectorName) {
					if (companyData.directorsData) {
						let tempDirectorArray = [];
						for (let j = 0; j < companyData.directorsData.length; j++) {
							let count = 0;
							for (let strToFind of searchedDirectorName.split(' ')) {
								if (companyData.directorsData[j].detailedInformation && companyData.directorsData[j].detailedInformation.fullName.trim().includes(strToFind)) {
									count++;
								}
							}
							if (directorNameSearchCondition === 'and') {
								if (count == searchedDirectorName.split(' ').length) {
									tempDirectorArray.push(companyData.directorsData[j]);
								}
							} else {
								if (count > 0) {
									tempDirectorArray.push(companyData.directorsData[j]);
								}
							}
						}
						companyData['searchedDirectorsData'] = tempDirectorArray;
					}

				}

				if (this.thisPage === "landRegistry") {
					companyData['Address'] = this.titlecasePipe.transform((companyData["paon"] || '') + ' ' + (companyData["street"] || '') + ' ' + (companyData["locality"] || '') + ' ') + (companyData["postcode"] || '').toUpperCase();
				}
				if (this.thisPage === "landCorporate") {
					companyData['companyno_1'] = companyData['Company_Registration_No_1'];
					companyData['companyno_2'] = companyData['Company_Registration_No_2'];
					companyData['companyno_3'] = companyData['Company_Registration_No_3'];
					companyData['companyno_4'] = companyData['Company_Registration_No_4'];
				}
				if (this.thisPage === "companySearch") {
					if (companyData["businessName"] !== undefined && companyData["businessName"] !== null && companyData["businessName"] !== "") {
						tempCompaniesData.push(companyData)
					}
				} else {
					tempCompaniesData.push(companyData)
				}

			});

		}
		companiesData = [];
		return (tempCompaniesData);
	}

	changeToDate(value: any): Date | null {
		if ((typeof value === 'string') && ((value.indexOf('-') > -1) || (value.indexOf('/') > -1))) {
			let str;

			if ((value.indexOf('-') > -1)) {
				str = value.split('-');
			} else if (value.indexOf('/') > -1) {
				str = value.split('/');
			}

			const year = Number(str[2]);
			const month = Number(str[1]) - 1;
			const date = Number(str[0]);

			return new Date(year, month, date);
		} else if ((typeof value === 'string') && value === '') {
			return new Date();
		}
		const timestamp = typeof value === 'number' ? value : Date.parse(value);
		return isNaN(timestamp) ? null : new Date(timestamp);
	}

	fetchByStringKey = function(o, s) {
		s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
		s = s.replace(/^\./, '');           // strip a leading dot
		var a = s.split('.');
		for (var i = 0, n = a.length; i < n; ++i) {
			var k = a[i];
			if (k in o) {
				o = o[k];
			} else {
				return;
			}
		}
		return o;
	}

}
