import { TitleCasePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';

import { subscribedPlan } from 'src/environments/environment';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';

@Component({
	selector: 'dg-related-party',
	templateUrl: './related-party.component.html',
	styleUrls: ['./related-party.component.scss']
})
export class RelatedPartyComponent implements OnInit, AfterViewInit {

	@ViewChild('getRelationData', { static: false }) getRelationData: NgForm;

	dropdownOption: Array<any> = [
		{ label: 'Company', value: 'c' },
		{ label: 'Director', value: 'd' }
	];

	userAuthInfo: Partial< UserInfoType > = {};
	directorOrCompany: string = undefined;
	sourceCompanyDirectorName: string = '';
	destinationCompanyDirectorName: string = '';
	companyNameNumberSearch: string = undefined;
	title: string = '';
	description: string = '';

	filteredCompanyArray: Array<any> = [];
	companyNameNumberSearchKey: any = null;
	companyName: string = '';
	companyNumber: string = '';
	destDirector: any;
	srcDirector: any;
	destcompanyNameNumberSearchKey: any = null;
	selectedDestCompany: any ;
	selectedSrcDirector: any = undefined;
	selectedDestDirector: any = undefined;
	subscribedPlanModal: any = subscribedPlan;
	selectedSrcCompany: any = undefined;

	tableCols: Array<any>;
	tableData: Array<any> = [];
	filteredCompanyNameArray: Array<any> = [];
	srcDirectorArray: Array<any> = undefined;
	destDirectorArray: Array<any> = undefined;
	msgs: Array<any> = [];

	userDetails: any = {};

	fieldValidate: boolean = false;

	constructor(
		private titlecasePipe: TitleCasePipe,
		public userAuthService: UserAuthService,
		private seoService: SeoService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService,
		private cd: ChangeDetectorRef

	) { }

	ngOnInit() {

		this.initBreadcrumbAndSeoMetaTags();

		this.userAuthInfo = this.userAuthService?.getUserInfo();

		this.tableCols = [
			{ field: 'source', header: 'Source Company', minWidth: '150px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'sourceDirector', header: 'Source Director', minWidth: '150px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'destination', header: 'Destination Company', minWidth: '150px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'destinationDirector', header: 'Destination Director', minWidth: '150px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'link', header: 'Link', minWidth: '200px', maxWidth: '200px', textAlign: 'center' }
		];

		
		this.getUserMeetMeRelations();
		this.getUserDetails();
		// setTimeout( () => {
		// }, 1000 )

	}

	ngAfterViewInit() {
        this.cd.detectChanges();
    }

	getRelation(formData: NgForm) {
		this.fieldValidate = true;
		if (this.validateForm() && formData.valid) {
			this.sharedLoaderService.showLoader();
			if (this.srcDirector !== undefined) {
				for (const tempSrcDirector of this.srcDirectorArray) {
					if (this.srcDirector === tempSrcDirector.value) {
						this.selectedSrcDirector = tempSrcDirector.label;
						break;
					}
				}
			}
			if (this.destDirector !== undefined) {
				for (const tempDestDirector of this.destDirectorArray) {
					if (this.destDirector === tempDestDirector.value) {
						this.selectedDestDirector = tempDestDirector.label;
						break;
					}
				}
			}
			let obj = {
				userId: this.userAuthInfo?.dbID,
				sourceCompanyNumber: this.selectedSrcCompany["companyRegistrationNumber"],
				sourceCompanyName: this.selectedSrcCompany["businessName"],
				option: this.directorOrCompany,
				sourceDirectorPnr: this.srcDirector,
				sourceDirectorName: this.selectedSrcDirector,
				destinationCompanyNumber: this.selectedDestCompany["companyRegistrationNumber"],
				destinationCompanyName: this.selectedDestCompany["businessName"],
				destinationDirectorPnr: this.destDirector,
				destinationDirectorName: this.selectedDestDirector,
			}

			this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'findRelation' , obj ).subscribe( res => {
				this.sharedLoaderService.hideLoader();
					if (res.body['status'] === 200) {
						this.tableData = [];
						this.getUserMeetMeRelations()
						this.selectedSrcCompany["companyRegistrationNumber"] = undefined;
						this.selectedSrcCompany["businessName"] = undefined;
						this.directorOrCompany = undefined;
						this.srcDirector = undefined;
						this.selectedSrcDirector = undefined;
						this.selectedDestCompany["companyRegistrationNumber"] = undefined;
						this.selectedDestCompany["businessName"] = undefined;
						this.destDirector = undefined;
						this.selectedDestDirector = undefined;
						this.destcompanyNameNumberSearchKey = null;
						this.companyNameNumberSearchKey = null;
						this.srcDirectorArray = undefined;
						this.destDirectorArray = undefined;
						this.msgs.push({ severity: 'info', summary: "The Link Is Added and Will Reflect in Sometime" });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
						this.getRelationData.reset();
						this.fieldValidate = false;
					} else {
						this.msgs.push({ severity: 'warn', summary: "Error Was Occured" });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					}
				}
			)

		} else {
			this.fieldValidate = true;
		}
	}

	validateForm() {
		if ( this.destcompanyNameNumberSearchKey !== null &&  this.companyNameNumberSearchKey !== null && this.srcDirectorArray.length !== 0) {
			return true;
		}
		return false;
	}

	searchOnEnterCompany(event, initialLoad, source) {
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
			this.searchCompany(event, source);
		}
	}

	searchCompany(event, source) {
		
		let selectedCompany;

		for (let i = 0; i < this.filteredCompanyArray.length; i++) {
			if ( event?.['value'].key && (event.value.key.toString().toLowerCase() === this.filteredCompanyArray[i].businessName.toString().toLowerCase() + " (" + this.filteredCompanyArray[i]['companyRegistrationNumber'].toLowerCase() + ")") ) {
				this.companyName = this.filteredCompanyArray[i].businessName;
				this.companyNumber = this.filteredCompanyArray[i].companyRegistrationNumber;
				selectedCompany = this.filteredCompanyArray[i];
				if (source == "fillDetails") {
					this.companyNameNumberSearchKey = { "key": this.titlecasePipe.transform(this.filteredCompanyArray[i].businessName) };
					this.directorOrCompany = "d";
				}
				break;
			}
		}
		if (source === "src" || source == "fillDetails") {
			this.selectedSrcCompany = selectedCompany;

			this.srcDirectorArray = this.getDirectorDropDown(selectedCompany.directorsData);

			if (source == "fillDetails") {
				if (this.srcDirectorArray) {
					for (const director of this.srcDirectorArray) {
						if (director.label.toLowerCase().replace(/ /g, '') == this.userDetails.name.toLowerCase().replace(/ /g, '')) {
							this.srcDirector = director.value
							break
						}
					}
				}
			}
		} else {
			this.selectedDestCompany = selectedCompany;
			this.destDirectorArray = this.getDirectorDropDown(selectedCompany.directorsData);
		}
	}

	filteredCompanyName(event, initialLoad, source) {

		if (event.length > 2) {
			
			let	obj = {
				companyName: event.toString().toLowerCase()
			}

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
									// this.filteredCompanyNameArray.push({key : this.titlecasePipe.transform(val['_source']['businessName'])});
									this.filteredCompanyNameArray.push({ key: this.titlecasePipe.transform(val['_source']['businessName'] + " (" + val['_source']['companyRegistrationNumber'].toUpperCase() + ")") });
									this.filteredCompanyArray.push(val['_source']);
								}
							}
							if (initialLoad === 'edit') {
								let obj = {
									key: event
								}
								this.searchOnEnterCompany(obj, initialLoad, source);
							}
							if (source == 'fillDetails') {
								let eventObj = {
									"key": this.titlecasePipe.transform(this.userDetails['companyName'].toLowerCase()) + " (" + this.userDetails['company_number'].toUpperCase() + ")"
								}
								this.searchCompany(eventObj, 'fillDetails')
							}

						} else {
							this.filteredCompanyNameArray = [];
							this.filteredCompanyArray = [];
						}
					}
				}
			});
		} else {
			this.filteredCompanyNameArray = [];
			this.filteredCompanyArray = [];
		}

	}

	getDirectorDropDown(directorArray) {

		let tempDirectorArray = [];
		if (directorArray !== undefined) {
			directorArray.forEach(director => {
				if (director.toDate === null || director.toDate === '' || director.toDate === undefined) {
					tempDirectorArray.push(
						{
							label: this.titlecasePipe.transform(director.detailedInformation.fullName) + "(" + this.titlecasePipe.transform(director.directorRole) + ")",
							value: director.directorPnr
						}
					)
				}
			});
		}
		
		return tempDirectorArray;

	}

	getUserDetails() {

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_USER_API', 'getUserDetails' ).subscribe( res => {
			let obj = res.body;
			this.userDetails["companyName"] = obj["companyName"];
			this.userDetails['company_number'] = obj["companyNumber"];
			this.userDetails['name'] = obj["username"];
		});

	}

	fillDetails() {
		this.filteredCompanyName(this.userDetails['company_number'], undefined, 'fillDetails');
	}


	refreshData() {
		this.tableData = [];
		this.getUserMeetMeRelations();
	}

	cancel() {
		this.getRelationData.reset();
		this.fieldValidate = false;
		this.directorOrCompany = undefined;
		this.srcDirector = undefined;
		this.destcompanyNameNumberSearchKey = null;
		this.destDirector = undefined;
		this.companyNameNumberSearchKey = undefined;
		this.srcDirectorArray = undefined;
		this.destDirectorArray = undefined;
	}

	getUserMeetMeRelations() {
		// let userId = this.userAuthInfo?.dbID
		// this.isDataLoading = true;
		this.sharedLoaderService.showLoader();
		// let obj = [ userId ]
		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getUserMeetMeRelations' ).subscribe( res => {
			// data => {
				// this.isDataLoading = false;
				this.sharedLoaderService.hideLoader();
				if (res.body.status == 200) {
					this.tableData = res.body.results;
					for (let i = 0; i < this.tableData.length; i++) {
						this.tableData[i]['options'] = this.tableData[i].option;
						this.tableData[i]["sourceDirector"] = this.tableData[i]["sourceDirectorName"];
						this.tableData[i]["sourceNumber"] = this.tableData[i]["sourceDirectorPnr"];
						this.tableData[i]["source"] = this.tableData[i]["sourceCompanyName"];
						this.tableData[i]["sourceNumber"] = this.tableData[i]["sourceCompanyNumber"];
						this.tableData[i]["destinationDirector"] = this.tableData[i]["destinationDirectorName"];
						this.tableData[i]["destinationNumber"] = this.tableData[i]["destinationDirectorPnr"];
						this.tableData[i]["destination"] = this.tableData[i]["destinationCompanyName"];
						this.tableData[i]["destinationNumber"] = this.tableData[i]["destinationCompanyNumber"];

						if (this.tableData[i].relation !== undefined) {
							if (this.tableData[i].relation.length !== undefined) {
								this.tableData[i]["relationData"] = this.tableData[i].relation;
							} else {
								this.tableData[i]["relationData"] = [this.tableData[i].relation];
							}

						}
					}
					this.fieldValidate = false;
				}
			}
		)
	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems([
		// 	{ label: 'Related Party' }
		// ]);
		this.title = "Related Party - DataGardener";
		this.description = "Related Party source helps to compaliveness check, ensuring the authenticity of millions of users.";
		// this.canonicalService.setCanonicalURL();
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
		// this.seoService.setkeywords( this.keywords );
		// this.seoService.setRobots (this.robots );

	}

}
