import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SearchFiltersService } from 'src/app/interface/service/search-filter.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { ActivatedRoute } from '@angular/router';
import { SharedLoaderService } from '../../shared-loader/shared-loader.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { TitleCasePipe } from '@angular/common';

@Component({
	selector: 'dg-bulk-tag',
	templateUrl: './bulk-tag.component.html',
	styleUrls: ['./bulk-tag.component.scss']
})
export class BulkTagComponent implements OnInit,OnChanges {

	showOrHideIndustryModal: boolean = false;
	showOrHideNewCreateIndustryModal: boolean = false;
	searchName: string = "";
	newIndustryName: string = ""

	msgs: Array<any> = [];
	industryTagList: Array<any> = [];
	selectedIndustryTag: Array<any> = [];

	@Input() thisPage: String = ''
	@Input() multiple: boolean;
	@Input() companyData: any = {};
	@Input() selectedCompany: Array<any> = [];
	@Input() listId: any = '';
	@Input() updateTagPageName: any = '';
	@Input() updatedFieldsforBulkTag = {};
	@Output() deSelectList = new EventEmitter<any>();
	@Output() messageCommunicator = new EventEmitter<any>();

	constructor(
		public userAuthService: UserAuthService,
		public searchFilterService: SearchFiltersService,
		public globalServerCommunication: ServerCommunicationService,
		public activeRoute: ActivatedRoute,
		private sharedLoaderService: SharedLoaderService,
		public titlecase: TitleCasePipe
	) { }

	ngOnInit() {

		this.getTags();
	}

	ngOnChanges( changes: SimpleChanges ) {
		if( changes?.listId?.currentValue?.length ){
			this.selectTags();
			// this.getTags();
		}
	}


	getTags() {

		let searchFilters = [];
		this.industryTagList = [];

		// searchFilters.push({ chip_group: 'Status', chip_values: ['live'] });

		// this.searchFilterService.getAllFilterProps(searchFilters, 'industryTagList.keyword', ['Industry'], undefined, 'companySearch').then(data => {

		// 	if (data.distinct_categories && data.distinct_categories.buckets && data.distinct_categories.buckets.length > 0) {
		// 		for (let item of data.distinct_categories.buckets) {
		// 			if (item.key != 'lending') {
		// 				this.industryTagList.push({ label: item.key.replace(/(^|\s)\S/g, function (t) { return t.toUpperCase() }), key: item.key });
		// 			}
		// 		}
		// 	}
		// });

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_API', 'getAllTagsList' ).subscribe( res => {
			let data = res.body.tags
			for (let item of data) {
				if (item.key != 'lending') {
					this.industryTagList.push({ label: this.titlecase.transform( item.tagName ), key: item.tagName.toLowerCase() });
				}
			}
		});
	}

	selectTags() {
		let tempArray = [];

		if (this.companyData['industryTagList'] && !this.multiple) {
			for (let item of this.companyData['industryTagList']) {
				tempArray.push({ label: this.titlecase.transform( item ), key: item });
			}
			this.selectedIndustryTag = JSON.parse( JSON.stringify( tempArray ) );
		}
		this.showOrHideIndustryModal = true;
	}

	createNewIndustryTag(){
		this.showOrHideIndustryModal = false;
		this.showOrHideNewCreateIndustryModal = true;
	}

	CreateTags(){

		let obj = {
			"newTag": this.newIndustryName,
			"userId": this.userAuthService?.getUserInfo('dbID'),
		}
		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_HELPDESK', 'addNewTags', obj ).subscribe( res => {
			if (res.body.status == 200){
				this.showOrHideIndustryModal = true;
				this.msgs = [];
				this.messageCommunicator.emit({ severity: 'success', summary: res.body.message });
				this.showOrHideNewCreateIndustryModal = false;
				
				this.getTags();

			} else {
				this.msgs = [];
				this.messageCommunicator.emit({ severity: 'info', summary: res.body.message });
			}

		})

	}

	addTags() {

		this.sharedLoaderService.showLoader();

		let companiesArray = [], tempArray = [];
		for (let element of this.selectedIndustryTag) {
			tempArray.push(element.key);
		};

		let selectedIndustryTagString = tempArray.toString();

		for (let { companyRegistrationNumber, businessName } of this.selectedCompany) {
			companiesArray.push({ companyNumber: companyRegistrationNumber, companyName: businessName });
		};
		this.showOrHideIndustryModal = false;

		let industryObj = {
			userId: this.userAuthService?.getUserInfo('dbID'),
			selectedIndustryTagString: selectedIndustryTagString,
			isAdmin: true
		};

		if (this.multiple) {
			industryObj['companies'] = companiesArray;
		} else {
			industryObj['companyName'] = this.companyData.businessName;
			industryObj['companyNumber'] = this.companyData.companyRegistrationNumber;
		}

		// this.globalServerCommunication.globalServerRequestCall('post', 'DG_HELPDESK', 'updateIndustryTagMaster', industryObj).subscribe(res => {

		// 	if (res.body.status == 200) {
		// 		this.msgs = [];
		// 		this.messageCommunicator.emit({ severity: 'success', summary: "Confirmed Your data sent to the Admin for verification" });

		// 	} else {
		// 		this.msgs = [];
		// 		this.messageCommunicator.emit({ severity: 'error', summary: "Industry Tag Data Not Updated!!" });
		// 	}

		// 	this.selectedCompany = [];
		// 	this.selectedIndustryTag = [];
		// 	this.deSelectList.emit(this.selectedCompany);
		// });

		// let selectedIndustryTagString = this.selectedIndustryTag.toString();

		let obj = {
			userId: this.userAuthService?.getUserInfo('dbID'),
			selectedIndustryTagString: selectedIndustryTagString,
			listId: this.listId,
			companyNumber: this.companyData['companyRegistrationNumber'],
			companyName: this.companyData['businessName'],
			pageName: this.updateTagPageName
		}

		// if (this.multiple) {
		// 	obj['companies'] = companiesArray;
		// } else {
		// 	obj['companyName'] = this.companyData.businessName;
		// 	obj['companyNumber'] = this.companyData.companyRegistrationNumber;
		// }

		this.showOrHideIndustryModal = false;

		if ( this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {

			obj["isAdmin"] = true;

			this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_HELPDESK', 'updateIndustryTagMaster', obj ).subscribe( res => {
				
				// this.sharedLoaderService.showLoader();

				if ( res.body.status === 200 ) {

					if ( this.thisPage == 'user-saved-list' ) {

						// this.updatedFieldsforBulkTag => this object is received from dg-user-list -> user-saved-list -> till dg-bulk-tag component.

						this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'indexCompanyByListId', this.updatedFieldsforBulkTag ).subscribe(resFrom => {
							this.msgs = [];
							this.messageCommunicator.emit({ severity: 'success', summary: res.body.message });
						});

					}

					if( this.thisPage != 'user-saved-list' ) {
						let inputObj = [ this.companyData['companyRegistrationNumber'] ];
						
						this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'indexCompany', inputObj ).subscribe( res => {
	
							if (res.body.status == "200 ") {
								setTimeout(() => {
									this.msgs = [];
									this.sharedLoaderService.hideLoader();	
									this.messageCommunicator.emit({ severity: 'success', summary: res.body.message });
								}, 3000);

							} else {
								this.msgs = [];
								this.sharedLoaderService.hideLoader();	
								this.messageCommunicator.emit({ severity: 'success', summary: "Could Not Start Company Indexing" });
							}
	
						}, err => {
							this.msgs = [];
							this.sharedLoaderService.hideLoader();	
							this.messageCommunicator.emit({ severity: 'success', summary: "Could Not Start Company Indexing" });
						});
					}
					

				} else {
					this.msgs = [];
					this.messageCommunicator.emit({ severity: 'error', summary: "'Industry Tag Data Not Updated!!" });

					
					setTimeout(() => {
						this.sharedLoaderService.hideLoader();
						this.msgs = [];
					}, 3000);
				}

				this.selectedCompany = [];
				this.selectedIndustryTag = [];
				this.deSelectList.emit(this.selectedCompany);

			});

		} else {

			obj["isAdmin"] = false;
			
			this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_HELPDESK', 'insertUpdateUserSuggestionIndustrytag', obj ).subscribe( res => {
				this.sharedLoaderService.showLoader();
				if ( res ) {

					if ( res.body.status === 201 ) {
						this.msgs = [];
						this.messageCommunicator.emit({ severity: 'info', summary: "'Already a suggestion for this industry tag is there." });
					} else {
						this.msgs = [];
						this.messageCommunicator.emit({ severity: 'success', summary: "Confirmed Your data sent to the Admin for verification" });
					}

					setTimeout(() => {
						this.msgs = [];
						selectedIndustryTagString = undefined;
					}, 2000);

					this.selectedCompany = [];
					this.selectedIndustryTag = [];
					this.deSelectList.emit(this.selectedCompany);
				}
				this.sharedLoaderService.hideLoader();
			});

		}

	}

	CloseAddTags() {
		this.showOrHideIndustryModal = false;
		this.selectedIndustryTag = [];
		// this.industryTagList = [];
	}
	CloseCreateTags(){
		this.showOrHideIndustryModal = true;
		this.showOrHideNewCreateIndustryModal = false;
		this.getTags();
	}
	inputNewTag(event){
		this.newIndustryName = event.target.value;
	}
}