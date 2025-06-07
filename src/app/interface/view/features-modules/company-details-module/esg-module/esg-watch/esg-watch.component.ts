import { NgForm } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';

import { ConfirmationService } from 'primeng/api';

import { subscribedPlan } from 'src/environments/environment';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { AdminRecordListComponent } from 'src/app/interface/view/shared-components/shared-tables/admin-record-list/admin-record-list.component';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-esg-watch',
	templateUrl: './esg-watch.component.html',
	styleUrls: ['./esg-watch.component.scss']
})
export class EsgWatchComponent implements OnInit {

	@ViewChild('esgWatchFormData', { static: false }) esgWatchFormData: NgForm;

	msgs = [];
	fieldValidate: Boolean = false;
	isSuperAdmin: Boolean;

	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'

	esgWatchDataColumn: any[];
	userDataArray: any[];
	companyNumber: unknown;
	companyName: string;
	esgWatchData: Array<any> = [];
	companyNameNumberSearchKey: any;
	filteredCompanyNameArray: any[];
	companyNameNumberSearch: string;
	filteredCompanyArray: any[];
	IncorporationDate: any;
	operatingTableElemnts: any;
	RegAddress: any;
	companyAge: any;
	// totalNoOfRecords: number = 0;
	currentPlan: unknown;
	subscribedPlanModal: any = subscribedPlan;
	customerWatchNote: string;
	isDataLoading: boolean = false;
	constantMessages: any = UserInteractionMessages;
	companyNameAndNumber: string = '';
	searchTotalCount: number = 0;

	constructor(
		public userAuthService: UserAuthService,
		private titlecasePipe: TitleCasePipe,
		private confirmationService: ConfirmationService,
		private seoService: SeoService,
		private adminRecordListComponent: AdminRecordListComponent,
		private globalServerCommunicate: ServerCommunicationService

	) { }

	ngOnInit() {

		this.isSuperAdmin= this.userAuthService.hasRolePermission( ['Super Admin'] )

		this.initBreadcrumbAndSeoMetaTags();

		this.currentPlan = this.userAuthService?.getUserInfo('planId');

		this.companyNumber = this.userAuthService?.getUserInfo('companyNumber');

		this.esgWatchDataColumn = [
			{ field: 'companyNumber', header: 'Company Number', minWidth: '140px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'businessName', header: 'Company Name', minWidth: '300px', maxWidth: '300px', textAlign: 'left' },
			{ field: 'companyAge', header: 'Company Age', minWidth: '150px', maxWidth: '150px', textAlign: 'right' },
			{ field: 'carbonCurrentTotal', header: 'Carbon Emission Current', minWidth: '200px', maxWidth: '200px', textAlign: 'right' },
			{ field: 'carbonPreviousTotal', header: 'Carbon Emission Previous', minWidth: '200px', maxWidth: '200px', textAlign: 'right' },
			{ field: 'esgCurrentPercentage', header: 'ESG Current', minWidth: '200px', maxWidth: '200px', textAlign: 'right' },
			{ field: 'esgPreviousPercentage', header: 'ESG Previous', minWidth: '200px', maxWidth: '200px', textAlign: 'right' },
			{ field: 'eCurrentPercentage', header: 'Environment Current', minWidth: '200px', maxWidth: '200px', textAlign: 'right' },
			{ field: 'ePreviousPercentage', header: 'Environment Previous', minWidth: '200px', maxWidth: '200px', textAlign: 'right' },
			{ field: 'sCurrentPercentage', header: 'Social Current', minWidth: '200px', maxWidth: '200px', textAlign: 'right' },
			{ field: 'sPreviousPercentage', header: 'Social Previous', minWidth: '200px', maxWidth: '200px', textAlign: 'right' },
			{ field: 'gCurrentPercentage', header: 'Governance Current', minWidth: '200px', maxWidth: '200px', textAlign: 'right' },
			{ field: 'gPreviousPercentage', header: 'Governance Previous', minWidth: '200px', maxWidth: '200px', textAlign: 'right' }
		];

		this.getEsgWatchTableData();

	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems(
		// 	[
		// 		{ label: "ESG Watch" }
		// 	]
		// )
		this.title = "ESG Watch - DataGardener";
		this.description = " DataGardener provides upto date Client Watch alert facility with our platform.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
		// this.seoService.setkeywords( this.keywords );
		// this.seoService.setRobots (this.robots );
	}

	getEsgWatchTableData(pageSize?: number, pageNumber?: number) {

		let obj = {
			pageSize: pageSize ? pageSize : 25,
			pageNumber: pageNumber ? pageNumber : 1,
			userId: this.userAuthService?.getUserInfo('dbID')
		}

		this.isDataLoading = true;

		this.globalServerCommunicate.globalServerRequestCall('post', 'DG_ESG_DETAILS', 'getEsgWatchData', obj).subscribe(res => {

			if (res.body['status'] === 200) {

				this.esgWatchData = res.body['results'];
				this.searchTotalCount = res.body['count'];

			}

			this.isDataLoading = false;

			// Calculating difference total values start

			let totalCarbondifference: number

			for (let keyValue of this.esgWatchData) {

				if (keyValue['carbonEmission']['carbonCurrentTotal'] === 0 && keyValue['carbonEmission']['carbonPreviousTotal'] === 0) {
					totalCarbondifference = keyValue['carbonEmission']['carbonCurrentTotal'] - keyValue['carbonEmission']['carbonPreviousTotal']
				} else {
					totalCarbondifference = ((keyValue['carbonEmission']['carbonCurrentTotal'] - keyValue['carbonEmission']['carbonPreviousTotal']) / keyValue['carbonEmission']['carbonCurrentTotal']) * 100;
				}
				keyValue['totalCarbondifference'] = totalCarbondifference;

				keyValue['totalEsgDifference'] = ((keyValue['esgScore']['esgCurrentPercentage'] - keyValue['esgScore']['esgPreviousPercentage']) / keyValue['esgScore']['esgCurrentPercentage']) * 100;

				keyValue['totalEdifference'] = ((keyValue['eScore']['eCurrentPercentage'] - keyValue['eScore']['ePreviousPercentage']) / keyValue['eScore']['eCurrentPercentage']) * 100;

				keyValue['totalSdifference'] = ((keyValue['sScore']['sCurrentPercentage'] - keyValue['sScore']['sPreviousPercentage']) / keyValue['sScore']['sCurrentPercentage']) * 100;

				keyValue['totalGdifference'] = ((keyValue['gScore']['gCurrentPercentage'] - keyValue['gScore']['gPreviousPercentage']) / keyValue['gScore']['gCurrentPercentage']) * 100
			}

		});

	}

	filteredCompanyName(event, initialLoad) {

		let obj = {
			companyName: event.toString().toLowerCase()
		};

		if (event.length > 2) {
			this.globalServerCommunicate.globalServerRequestCall('post', 'DG_API', 'companyNameSuggestionsNew', obj).subscribe(res => {
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
			});
		}
		else {
			this.filteredCompanyNameArray = [];
			this.filteredCompanyArray = [];
		}
	}

	searchOnEnterCompany(event, initialLoad) {

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
			if (event.key.toString().toLowerCase() === this.filteredCompanyArray[i].businessName.toString().toLowerCase() + " (" + this.filteredCompanyArray[i]['companyRegistrationNumber'].toLowerCase() + ")") {
				this.companyNameNumberSearchKey.key = this.titlecasePipe.transform(this.filteredCompanyArray[i].businessName + " (" + this.filteredCompanyArray[i]['companyRegistrationNumber'].toLowerCase() + ")");
				this.companyName = this.titlecasePipe.transform(this.companyNameNumberSearchKey.key);
				this.companyNumber = this.filteredCompanyArray[i].companyRegistrationNumber.toUpperCase().toString();
				break;
			}
		}
	}

	esgValidation() {

		if (this.companyName) {
			return true;
		} else {
			return false;
		}
	}

	submitEsgWatchForm(formData) {

		if (this.esgValidation() && formData.valid) {

			let obj = {
				userId: this.userAuthService?.getUserInfo('dbID'),
				companyNumber: this.companyNumber.toString().toLowerCase(),
				isExist: false
			}

			this.globalServerCommunicate.globalServerRequestCall('post', 'DG_ESG_DETAILS', 'saveEsgWatchData', obj).subscribe(res => {

				if (res.body['status'] == 200) {
					this.msgs = [];
					this.msgs.push({ severity: 'info', summary: this.constantMessages['infoMessage']['companyAlreadyExistInEsgWatchList'] });
					setTimeout(() => {
						this.msgs = [];
					}, 6000);
					this.fieldValidate = false;
				} else if (res.body['status'] == 202) {
					this.msgs = [];
					this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['addToEsgWatchListSuccess'] });
					setTimeout(() => {
						this.msgs = [];
					}, 6000);
				}

				this.getEsgWatchTableData();
				this.cancelEsgData();
			});
		} else {
			this.fieldValidate = true;
		}
	}

	cancelEsgData() {

		this.esgWatchFormData.reset();
		this.fieldValidate = false;
		this.companyName = undefined;
		this.companyNumber = undefined;
		this.customerWatchNote = undefined;
		this.userDataArray = [];
	}

	deleteEsgWatchData(event) {

		let tempCompanyNumberArray = [];

		for (let i = 0; i < event.selectedCompany.length; i++) {
			tempCompanyNumberArray.push(event.selectedCompany[i].companyNumber.toString().toLowerCase())
		}

		let obj = {
			userId: this.userAuthService?.getUserInfo('dbID'),
			companyNumber: tempCompanyNumberArray,
			isExist: false
		}

		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['delete'],
			header: 'Delete Confirmation',
			icon: 'pi pi-info-circle',
			accept: () => {
				this.globalServerCommunicate.globalServerRequestCall('post', 'DG_ESG_DETAILS', 'deleteEsgData', obj).subscribe(res => {
					if (res.body.status === 200) {
						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['removedFromEsgWatchListSuccess'] });

						this.getEsgWatchTableData(event.rows, event.page);

						this.adminRecordListComponent.resetFilters(this.operatingTableElemnts.adminRecordListTable);

						if (this.operatingTableElemnts.recordListPaginator) {
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
					}
				});
			}
		});

	}

	getOperatingTable(event) {

		if (event) {
			this.operatingTableElemnts = event;
		}

	}

	updateTableAfterPagination(event) {
		this.getEsgWatchTableData(event.pageSize, event.pageNumber)
	}

}
