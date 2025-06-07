import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ConfirmationService } from 'primeng/api';

import { FileUpload } from 'primeng/fileupload';
import { NgxCSVParserError, NgxCsvParser } from 'ngx-csv-parser';

import { subscribedPlan } from 'src/environments/environment';
import { UserInteractionMessages } from '../../../../../../../assets/utilities/data/UserInteractionMessages.const';

import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';

import { AdminRecordListComponent } from 'src/app/interface/view/shared-components/shared-tables/admin-record-list/admin-record-list.component';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';

@Component({
	selector: 'dg-client-watch',
	templateUrl: './client-watch.component.html',
	styleUrls: ['./client-watch.component.scss']
})
export class ClientWatchComponent implements OnInit {

	@ViewChild('fileUploder', { static: false }) fileUpload: FileUpload;
	@ViewChild('customerWatchFormData', { static: false }) customerWatchFormData: NgForm;

	csvRecords: Array<any> = [];
	uploadedFiles: Array<any> = [];
	headersNotFoundinCSV: Array<any> = [];
	headersFoundinCSV: Array<any> = [];
	csvheaders: Array<any> = [];
	selectedPropValues: Array<any> = [];
	headersArray: Array<string> = ['regno', 'companyname', 'personfirstname', 'personlastname', 'email', 'phone', 'reference', 'description'];
	headersRequiredArray: Array<string> = ['RegNo', 'Company Name', 'Person First Name', 'Person Last Name', 'Email', 'Phone', 'Reference', 'Description'];

	uploadCbilUserData: boolean = false;
	display: boolean = false;
	uploadedCompaniesDialog: boolean = false;
	showErrorMessageForUploadCsv: boolean = false;
	msgs = [];
	fieldValidate: Boolean = false;
	totalNumberOfCorrectComapnies: any;

	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'

	customerWatchDataColumn: any[];
	selectedtableCols: Array<any>;
	userDataArray: Array<any> = [];
	cbilsSettingsShowHide: Boolean = false;
	companyNumber: string;
	companyName: string;
	personFirstName: string;
	personLastName: string;
	personEmail: string;
	personPhone: number;
	customerWatchReference: string;
	customerWatchDescription: string;
	cbilTable: any = [];
	customerWatchData: Array<any> = [];
	companyNameNumberSearchKey: any;
	uploadCompanyNameNumberSearchKey: string;
	filteredCompanyNameArray: any[];
	companyNameNumberSearch: string;
	filteredCompanyArray: any[];
	IncorporationDate: any;
	operatingTableElemnts: any;
	active_directors_count: any;
	RegAddress: any;
	commission: number;
	companyAge: any;
	lastMadeAccount: any;
	landingOption: string;
	funder: string;
	incorporationDate: Date;
	age: number;
	lastmadeAccount: number;
	directorCount: number;
	turnover: number;
	cap: number;
	eligibilityCheck: string;
	ccj: number;
	correctCompanies: any = [];
	correctCompanies2: any = [];
	companyNumberArray = [];
	customerWatchUploadDate: string;
	showDialog: Boolean = false;
	totalNoOfRecords: number = 0;
	userDetails: Partial< UserInfoType > = {};
	subscribedPlanModal: any = subscribedPlan;
	customerWatchNote: string;
	isDataLoading: boolean = false;
	constantMessages: any = UserInteractionMessages;

	constructor(
		private titlecasePipe: TitleCasePipe,
		private commonService: CommonServiceService,
		private ngxCsvParser: NgxCsvParser,
		private confirmationService: ConfirmationService,
		private seoService: SeoService,
		public userAuthService: UserAuthService,
        private adminRecordListComponent: AdminRecordListComponent,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngDoCheck() {
		if (this.uploadCbilUserData == false) {
			if (this.fileUpload) {
				this.fileUpload.files = [];
			}
		}
	}

	ngOnInit() {

		this.sharedLoaderService.showLoader();

		this.initBreadcrumbAndSeoMetaTags();

		this.userDetails = this.userAuthService?.getUserInfo();
		
		this.getCustomerWatchData();

		this.customerWatchDataColumn = [
			{ field: 'editDetails', header: 'Action', minWidth: '90px', maxWidth: '90px', textAlign: 'center', visible: true },
			{ field: 'notification', header: '', minWidth: '80px', maxWidth: '80px', textAlign: 'center', visible: true },
			{ field: 'companyNumber', header: 'Company Number', minWidth: '150px', maxWidth: 'none', textAlign: 'left', visible: true },
			{ field: 'businessName', header: 'Company Name', minWidth: '350px', maxWidth: '350px', textAlign: 'left', visible: true },
			{ field: 'companyStatus', header: 'Status', minWidth: '150px', maxWidth: '150px', textAlign: 'center', visible: true },
			{ field: 'lastChange', header: 'Last Change', minWidth: '200px', maxWidth: '200px', textAlign: 'left', visible: true },
			{ field: 'lastmade', header: 'Accounts Last Made', minWidth: '160px', maxWidth: '160px', textAlign: 'center', visible: true },
			{ field: 'personFirstName', header: 'Person First Name', minWidth: '160px', maxWidth: '160px', textAlign: 'left', visible: true },
			{ field: 'personLastName', header: 'Person Last Name', minWidth: '160px', maxWidth: '160px', textAlign: 'left', visible: true },
			{ field: 'IncorporationDate', header: 'Incorporation Date', minWidth: '160px', maxWidth: '160px', textAlign: 'center', visible: true },
			{ field: 'companyAge', header: 'Age', minWidth: '120px', maxWidth: '160px', textAlign: 'right', visible: true },
			{ field: 'filedDate', header: 'Status Filed Date', minWidth: '160px', maxWidth: '160px', textAlign: 'center', visible: true },
			{ field: 'registrationDate', header: 'Status Registration Date', minWidth: '160px', maxWidth: '160px', textAlign: 'center', visible: true },
			{ field: 'reference', header: 'Reference', minWidth: '250px', maxWidth: '250px', textAlign: 'left', visible: true },
			{ field: 'description', header: 'Description', minWidth: '250px', maxWidth: '250px', textAlign: 'left', visible: true },
			{ field: 'personPhone', header: 'Phone', minWidth: '170px', maxWidth: '170px', textAlign: 'right', visible: ( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasAddOnPermission['contactInformation'] ) },
			{ field: 'ctps', header: 'CTPS Registered', minWidth: '130px', maxWidth: '130px', textAlign: 'center', visible: ( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasAddOnPermission['contactInformation'] )  },
			{ field: 'personEmail', header: 'Email', minWidth: '260px', maxWidth: '260px', textAlign: 'left', visible: ( this.userAuthService.hasRolePermission( ['Super Admin'] ) || this.userAuthService.hasAddOnPermission['contactInformation'] )  },
			{ field: 'cWebsite', header: 'Website', minWidth: '220px', maxWidth: '220px', textAlign: 'left', visible: true  },
			{ field: 'note', header: 'Notes', minWidth: '220px', maxWidth: '220px', textAlign: 'left', visible: true  }

		];
	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems(
		// 	[
		// 		{ label: "Client Watch" }
		// 	]
		// )
		this.title = "Client Watch - DataGardener";
		this.description = " DataGardener provides upto date Client Watch alert facility with our platform.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
		// this.seoService.setkeywords( this.keywords );
		// this.seoService.setRobots (this.robots );
	
	}

	getCustomerWatchData( pageSize?: number, startAfter?: number ) {
		this.customerWatchData = [];
		let isCbil = false;
		// this.isDataLoading = true;
		this.sharedLoaderService.showLoader();

		let obj = {
			"userId": this.userDetails?.dbID,
			"isCbil": isCbil,
			'pageSize': pageSize ? pageSize : 25,
			'pageNumber': startAfter ? startAfter : 1
		}

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_CBIL', 'cbilsUserDataListTableData', obj).subscribe( res => {
			
			if ( res.body.status === 200 ) {
				
				this.totalNoOfRecords = res.body.totalRecords;

				res.body.results.forEach(element => {
					if (element.isCbil === false) {
						element['cbiladdress'] = element.RegAddress_Modified ? this.commonService.formatCompanyAddress(element.RegAddress_Modified) : "";
						
							element['cWebsite'] = element.companyContactInformation && element.companyContactInformation.website ? element.companyContactInformation.website : element.RegAddress_Modified && element.RegAddress_Modified.website ? element.RegAddress_Modified.website : "";
							
							element['personPhone'] =  element.companyContactInformation && element.companyContactInformation.tel_1 ? element.companyContactInformation.tel_1 : element.RegAddress_Modified && element.RegAddress_Modified.telephone ? element.RegAddress_Modified.telephone : "";
							
							element['ctps'] = element.companyContactInformation && element.companyContactInformation.tel_1 && element.companyContactInformation.ctps ? element.companyContactInformation.ctps : element.RegAddress_Modified && element.RegAddress_Modified.telephone && element.RegAddress_Modified.ctps ? element.RegAddress_Modified.ctps : "";
							
							element['IncorporationDate'] = element.companyRegistrationDate;
							
							element['companyAge'] = this.commonService.calculateAge(element.companyRegistrationDate);
							
							if ( element.hasOwnProperty( 'companyContactInformation' ) || element.hasOwnProperty( 'RegAddress_Modified' ) ) {
								
								let tempEmail = element.companyContactInformation && element.companyContactInformation.email_gen1 ? element.companyContactInformation.email_gen1 : element.companyContactInformation && element.companyContactInformation.email_gen2 ? element.companyContactInformation.email_gen2 : element.companyContactInformation && element.companyContactInformation.email_raw ? element.companyContactInformation.email_raw : "";
								
								element['personEmail'] =  tempEmail ? tempEmail : element.RegAddress_Modified && element.RegAddress_Modified.email ? element.RegAddress_Modified.email : "";
								
							}
							if( element.hasOwnProperty('changes')) {
								element['lastChange'] = element.changes[0].description ? element.changes[0].description : "";
								element['filedDate'] = element.changes[0].statusFiledDate ? element.changes[0].statusFiledDate : "";
								element['registrationDate'] = element.changes[0].statusRegistrationDate ? element.changes[0].statusRegistrationDate : "";
							}

						this.customerWatchData.push(element);
					}
				});

			}

			if ( res.body.status === 201 ) {
				
				this.totalNoOfRecords = res.totalRecords;

			}
			setTimeout(() => {				
				this.sharedLoaderService.hideLoader();
			}, 500);

		});
	}

	onSelectedFile(event) {
		for (let file of event.files) {
			this.uploadedFiles.push(file);
		}

		this.headersFoundinCSV = [];
		this.headersNotFoundinCSV = [];
		const files = event.files[0];
		const fileReader = new FileReader();
		fileReader.readAsText(files);
		let j = 0;
		let x = 0;
		fileReader.onload = (e) => {
			let csv: string = fileReader.result.toString();
			let allTextLines = csv.split(/\r|\n|\r/);
			this.csvheaders = allTextLines[0].split(',');
			// replace("\"", "");
			for (let i = 0; i < this.csvheaders.length; i++) {
				let word;
				if (this.csvheaders[i] !== undefined) {
					word = this.csvheaders[i].replace(/^"(.*)"$/, '$1').replace(/\s/g, "").toLowerCase();
				}
				if (this.headersArray.includes(word)) {
					this.headersFoundinCSV[x] = this.csvheaders[i];
					x++;
				}
				else {
					this.headersNotFoundinCSV[j] = this.csvheaders[i];
					j = j + 1;
				}
			}
			if (this.headersFoundinCSV.length == 8) {
				this.ngxCsvParser.parse(files, { header: true, delimiter: ',' }).pipe().subscribe((result: Array<any>) => {
					if (result !== null) {
						let csvRecords_temp = [];
						let incorrectCompaniesWithoutValidation = [];
						csvRecords_temp = result;
						this.csvRecords = [];
						this.companyNumberArray = [];
						// const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
						if (csvRecords_temp.length <= 500) {

							//remove duplicate entries from csv by Company number
							csvRecords_temp = Array.from(new Set(csvRecords_temp.map(a => a.RegNo)))
								.map(id => {
									return csvRecords_temp.find(a => a.RegNo === id)
								});

							for (let i = 0; i < csvRecords_temp.length; i++) {
								if (csvRecords_temp[i].RegNo) {
									if (csvRecords_temp[i].RegNo !== undefined && csvRecords_temp[i].RegNo !== null && csvRecords_temp[i].RegNo !== ""
										&& csvRecords_temp[i]['Company Name'] !== undefined && csvRecords_temp[i]['Company Name'] !== null && csvRecords_temp[i]['Company Name'] !== ""
									) {		
										if (csvRecords_temp[i].RegNo.length === 2) {
											csvRecords_temp[i].RegNo = '000000' + csvRecords_temp[i].RegNo.toString().toLowerCase();
										}
										if (csvRecords_temp[i].RegNo.length === 3) {
											csvRecords_temp[i].RegNo = '00000' + csvRecords_temp[i].RegNo.toString().toLowerCase();
										}								
										if (csvRecords_temp[i].RegNo.length === 4) {
											csvRecords_temp[i].RegNo = '0000' + csvRecords_temp[i].RegNo.toString().toLowerCase();
										}
										if (csvRecords_temp[i].RegNo.length === 5) {
											csvRecords_temp[i].RegNo = '000' + csvRecords_temp[i].RegNo.toString().toLowerCase();
										}
										if (csvRecords_temp[i].RegNo.length === 6) {
											csvRecords_temp[i].RegNo = '00' + csvRecords_temp[i].RegNo.toString().toLowerCase();
										}
										if (csvRecords_temp[i].RegNo.length === 7) {
											csvRecords_temp[i].RegNo = '0' + csvRecords_temp[i].RegNo.toString().toLowerCase();
										}
										this.companyNumberArray.push(csvRecords_temp[i].RegNo.toString().toLowerCase())
									} else {
										incorrectCompaniesWithoutValidation.push(csvRecords_temp[i].RegNo.toString().toLowerCase());
									}
								} else {
									incorrectCompaniesWithoutValidation.push(csvRecords_temp[i][0]);
								}
							}

							let obj = {
								selectedCompany: this.companyNumberArray,
								inputType: "companyNumber"
							};
							this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_UPLOADCSVAPI', 'validateUploadedCSV', obj).subscribe( res => {
								if (res.body['status'] == 200) {
									this.correctCompanies = res.body['results'].exactMatchCompanies;
									if ( this.correctCompanies.length ) {
										this.correctCompanies.forEach((element, index) => {
											this.correctCompanies2.push(element.companyRegistrationNumber);
										});
									}

									csvRecords_temp = csvRecords_temp.filter((o) => this.correctCompanies2.indexOf( (o.RegNo) ? o.RegNo.toString().toLowerCase() : o[0] ) > -1); //correct Companies with validation
									this.companyNumberArray = this.companyNumberArray.filter((o) => this.correctCompanies2.indexOf(o) === -1); // incorrect Companies with validation
									
									this.companyNumberArray = this.companyNumberArray.concat(incorrectCompaniesWithoutValidation); // Includes All companies with and withoutValidation									
									this.uploadCbilUserData = false;
									this.totalNumberOfCorrectComapnies = 0;
									this.totalNumberOfCorrectComapnies = csvRecords_temp.length;
									this.msgs = [];
									if (this.totalNumberOfCorrectComapnies === 0) {
										this.showErrorMessageForUploadCsv = true;
									} else {
										this.msgs.push({ severity: 'success', detail: 'Total Number of correct Companies - ' + this.totalNumberOfCorrectComapnies });
									}
									setTimeout(() => {
										this.msgs = [];
									}, 6000);
									for (let i = 0; i < csvRecords_temp.length; i++) {
										let obj = {
											userId: this.userDetails?.dbID,
											companyName: csvRecords_temp[i]['Company Name'] !== undefined && csvRecords_temp[i]['Company Name'] !== null ? csvRecords_temp[i]['Company Name'].toString().toLowerCase() : "-",
											companyNumber: csvRecords_temp[i].RegNo !== undefined && csvRecords_temp[i].RegNo !== null ? csvRecords_temp[i].RegNo.toString().toLowerCase() : "-",
											personFirstName: csvRecords_temp[i]['Person First Name'],
											personLastName: csvRecords_temp[i]['Person Last Name'],
											personPhone: csvRecords_temp[i].Phone,
											personEmail: csvRecords_temp[i].Email,
											reference: csvRecords_temp[i]['Reference'],
											description: csvRecords_temp[i]['Description'],
											isCbil: false
										}										
										this.csvRecords.push(obj);
									}
									if (this.csvRecords.length !== 0 || incorrectCompaniesWithoutValidation.length !== 0) {
										this.uploadedCompaniesDialog = true;
									}
									this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_CBIL', 'createUserData', this.csvRecords).subscribe( res => {
										if (res.body.status == 200) {
											this.getCustomerWatchData();
										}
									})
								}
							});
						} else {
							this.msgs = [];
							this.msgs.push({ severity: 'warn', summary: 'You can upload maximum 500 companies at a time' });
							setTimeout(() => {
								this.msgs = [];
							}, 3000);
							this.uploadCbilUserData = false;
						}
					}
				},
					(error: NgxCSVParserError) => {
						console.log('Error', error);
						this.msgs.push({ severity: 'danger', summary: 'message', detail: error });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					});
			}
			else {
				this.display = true;
			}
		}
	}

	filteredCompanyName(event, initialLoad) {
		
		if (event.length > 2) {
			let obj = {
					companyName: event.toString().toLowerCase(),
					companyStatus: "live"
				};
			this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_API', 'companyNameSuggestionsNew' , obj ).subscribe( res => {
				if (res !== undefined) {
					if (res.body.status == 200) {
						if (res.body['results'] !== undefined) {
							if (res.body['results']['hits']['total']['value'] == 0) {
								this.filteredCompanyNameArray = [];
								this.filteredCompanyArray = [];
							} else if (res.body['results']['hits']['total']['value'] > 0) {
								this.filteredCompanyNameArray = [];
								this.filteredCompanyArray = [];
								for (let val of res.body['results']['hits']['hits']) {
									this.filteredCompanyNameArray.push({ key: this.titlecasePipe.transform(val['_source']['businessName']) + " (" + val['_source']['companyRegistrationNumber'].toUpperCase() + ")" });
									this.filteredCompanyArray.push(val['_source']);
								}
							}
							if (initialLoad !== undefined) {
								let obj = {
									key: event + " (" + initialLoad + ")"
								}
								this.searchOnEnterCompany(obj, initialLoad);
							}
							this.fieldValidate = false;
						} else {
							this.filteredCompanyNameArray = [];
							this.filteredCompanyArray = [];
						}
					} else {
						this.filteredCompanyNameArray = [];
						this.filteredCompanyArray = [];
						this.companyNumber = undefined;
						this.fieldValidate = true;
					}
				}
			})
		}
		else {
			this.filteredCompanyNameArray = [];
			this.filteredCompanyArray = [];
		}
	}

	searchOnEnterCompany(event, initialLoad) {
		//Start Preapring String for Search
		// let stringg = event.target.value.replace(/[^\w\s]/gi, "").replace(/\b\w/g, (s) => s.toUpperCase()).trim();
		if (initialLoad == undefined) {
			let stringg;
			let stringcompany: Array<String> = [];
			stringg = event.target.value.trim();
			for (let i = 0; i < stringg.length; i++) {
				stringcompany[i] = stringg.charAt(i);
			}
			for (let z = 0; z < stringcompany.length; z++) {
				if (stringcompany[z] === " " && stringcompany[z + 1] === " ") {
					stringcompany.splice(z, z);
				}
			}
			let finalString = stringcompany.join("");

			if (event.target.value !== "") {
				this.companyNameNumberSearch = finalString;
			}
			if (event.keyCode == 13) {
				this.companyNameNumberSearch = finalString;
			}
		} else {
			this.companyNameNumberSearchKey = event;
			this.searchCompany(event);
		}
	}

	searchCompany(event) {
		for (let i = 0; i < this.filteredCompanyArray.length; i++) {
			if ( ( event?.value?.key?.toString().toLowerCase() || event?.key?.toString().toLowerCase() ) === this.filteredCompanyArray[i].businessName.toString().toLowerCase() + " (" + this.filteredCompanyArray[i]['companyRegistrationNumber'].toLowerCase() + ")") {
				this.companyNameNumberSearchKey.key = this.titlecasePipe.transform(this.filteredCompanyArray[i].businessName + " (" + this.filteredCompanyArray[i]['companyRegistrationNumber'].toLowerCase() + ")");
				this.companyName = this.titlecasePipe.transform(this.companyNameNumberSearchKey.key);
				this.companyNumber = this.filteredCompanyArray[i].companyRegistrationNumber.toUpperCase().toString();
				break;
			}
		}
	}

	calculateAge(dob) {
		return this.commonService.calculateAge(dob);
	}

	CbilSuiteValidation() {
		if ((this.companyName !== undefined && this.companyName !== null && this.companyName !== "")
			&& (this.companyNumber !== undefined && this.companyNumber !== null && this.companyNumber !== "")
		) {
			return true;
		} else {
			return false;
		}
	}

	submitCustomerWatchForm(formData) {
		if (this.CbilSuiteValidation() && formData.valid) {
			let obj = {
				userId: this.userDetails?.dbID,
				companyName: this.companyName.toString().toLowerCase(),
				companyNumber: this.companyNumber.toString().toLowerCase(),
				personFirstName: this.personFirstName,
				personLastName: this.personLastName,
				personPhone: this.personPhone,
				personEmail: this.personEmail,
				reference: this.customerWatchReference,
				description: this.customerWatchDescription,
				note: this.customerWatchNote,
				isCbil: false
			}
			this.userDataArray = [obj];
			this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_CBIL', 'createUserData', this.userDataArray).subscribe( res => {
				if (res.body.status == 200) {
					this.msgs = [];
					this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['customerEditSuccess'] });
					setTimeout(() => {
						this.msgs = [];
					}, 6000);
					this.fieldValidate = false;
				} else if (res.body.status == 201) {
					this.msgs = [];
					this.msgs.push({ severity: 'error', summary: this.constantMessages['errorMessage']['customerEditNotMessage'] });
					setTimeout(() => {
						this.msgs = [];
					}, 6000);
				}
				this.getCustomerWatchData();
				this.cancelCbilData();
			});
		} else {
			this.fieldValidate = true;
		}
	}

	cancelCbilData() {
		this.customerWatchFormData.reset();
		this.fieldValidate = false;
		this.companyName = undefined;
		this.companyNumber = undefined;
		this.personFirstName = undefined;
		this.personLastName = undefined;
		this.personPhone = undefined;
		this.personEmail = undefined;
		this.customerWatchReference = undefined;
		this.customerWatchDescription = undefined;
		this.customerWatchUploadDate = undefined;
		this.customerWatchNote = undefined;
		this.userDataArray = [];
	}

	uploadCsv() {
		this.uploadCbilUserData = true;
	}

	uploadClose() {
		this.uploadCbilUserData = false;
	}

	getCbilData(event) {
		this.filteredCompanyName(event.businessName, event.companyNumber);
		this.personFirstName = event.personFirstName;
		this.personLastName = event.personLastName;
		this.personPhone = event.personPhone;
		this.personEmail = event.personEmail;
		this.customerWatchReference = event.reference;
		this.customerWatchDescription = event.description;
		this.customerWatchNote = event.note;
	}

	deleteCustomerWatchData(event) {

		let tempCompanyNumberArray = [];
		
		for (let i = 0; i < event.selectedCompany.length; i++) {
			tempCompanyNumberArray.push(event.selectedCompany[i].companyNumber.toString().toLowerCase())
		}

		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['delete'],
			header: 'Delete Confirmation',
			icon: 'pi pi-info-circle',
			accept: () => {
				let obj = {
					userId: event.selectedCompany[0].userId,
					companyNumber: tempCompanyNumberArray
				}
				this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_CBIL', 'deleteCbilData' , obj ).subscribe( res => {
					if (res.body.status === 200) {
						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['customerDeletedSuccess'] });
						
						this.getCustomerWatchData( event.rows, event.page );

						this.adminRecordListComponent.resetFilters( this.operatingTableElemnts.adminRecordListTable );

						if ( this.operatingTableElemnts.recordListPaginator ) {
							this.operatingTableElemnts.recordListPaginator.rows = event.rows;
						}

						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					} else {
						this.msgs = [];
						this.msgs.push({ severity: 'error', summary: this.constantMessages['errorMessage']['customerNotDeletedMessage'] });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
						this.sharedLoaderService.hideLoader();
					}
				});
			}
		});

	}

	downloadSampleCsvTemplate() {
		let link = document.createElement("a");
		link.download = "Sample_Csv.csv";
		link.href = "/assets/utilities/data/Customer_Watch_Sample_CSV.csv";
		link.click();
	}

	getOperatingTable( event ) {

		if ( event ) {
			this.operatingTableElemnts = event;
		}

	}

	ngAfterViewInit(): void {
        setTimeout(() => {
            this.sharedLoaderService.hideLoader();
        }, 3000);
	}

}
