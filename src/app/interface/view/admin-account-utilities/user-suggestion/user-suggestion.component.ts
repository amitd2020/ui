import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ConfirmationService } from 'primeng/api';

import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';

import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';

@Component({
	selector: 'dg-user-suggestion',
	templateUrl: './user-suggestion.component.html',
	styleUrls: ['./user-suggestion.component.scss']
})
export class UserSuggestionComponent implements OnInit {

	userDetailSuggestions: any;
	industryTagSuggestion: any;
	directorDetailSuggestions: any;
	contactInfoDetailSuggestions: any;
	title: string = '';
	description: string = '';

	selectedColumns: Array<any>;
	selectedDirectorColumns: Array<any>;
	industryTagColumn: Array<any>;
	selectedRecordTableCols: Array<any>;
	selectedDirectorRecordTableCols: Array<any>
	selectedIndustryTagTableCols: Array<any>
	contactInfoDataColumn: Array<any>;
	selectedContactInfoDataColumn: Array<any>;

	msgs = [];
	constantMessages: any = UserInteractionMessages;

	directorDataInfoObj: any = {
        userId: undefined,
        companyNumber: '',
        companyName: undefined,
        directorPNR: undefined,
        directorFirstName: undefined,
		directorMiddleName: undefined,
        directorLastName: undefined,
        directorEmail: undefined,
        directorJobTitle: undefined,
        directorTelephone: undefined,
        directorLinkedin: undefined,
    }

	contactInformationObj: any = {
		companyNumber: '',
		companyName: '',
		directorFirstName: '',
		directorLastName: '',
		directorEmail: '',
		directorJobTitle: '',
		directorLinkedin: '',
		contact_pnr: '',
	}

	constructor(
		private seoService: SeoService,
		private confirmationService: ConfirmationService,
		private globalServerCommunication: ServerCommunicationService,
		private activeRoute: ActivatedRoute
	) { }

	ngOnInit() {
		
		this.initBreadcrumbAndSeoMetaTags();
		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_HELPDESK', 'getSuggestRequest' ).subscribe( res => {
			this.userDetailSuggestions = res.body['result'];
		});

		this.selectedRecordTableCols = [
			{ field: 'company_name', header: 'Company Name', minWidth: '300px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'company_number', header: 'Company Number', minWidth: '160px', maxWidth: '160px', textAlign: 'left' },
			{ field: 'company_domain_link', header: 'Company Domain', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'company_phone_number', header: 'Company Phone', minWidth: '180px', maxWidth: '180px', textAlign: 'right' },
			{ field: 'company_email', header: 'Company Email', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'company_linkedin_link', header: 'Linkedin', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'company_tradingAs', header: 'Trading As', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'userSuggestionUpdate', header: 'Action', minWidth: '200px', maxWidth: '200px', textAlign: 'center' }
		];

		this.selectedColumns = this.selectedRecordTableCols;
		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_HELPDESK', 'getDirectorSuggestions' ).subscribe( res => {
			this.directorDetailSuggestions = res.body['result'];
		});

		this.selectedDirectorRecordTableCols = [
			{ field: 'company_name', header: 'Company Name', minWidth: '300px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'company_number', header: 'Company Number', minWidth: '150px', maxWidth: '150px', textAlign: 'right' },
			{ field: 'director_first_name', header: 'First Name', minWidth: '130px', maxWidth: '130px', textAlign: 'left' },
			{ field: 'director_job_title', header: 'Job Title', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
			{ field: 'director_phone_number', header: 'Director Phone No', minWidth: '180px', maxWidth: '180px', textAlign: 'center' },
			{ field: 'director_email', header: 'Director Email', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'director_linkedin_link', header: 'Linkedin', minWidth: '300px', maxWidth: '300px', textAlign: 'left' },
			{ field: 'userSuggestionUpdate', header: 'Action', minWidth: '200px', maxWidth: '200px', textAlign: 'center' }
		];

		this.selectedDirectorColumns = this.selectedDirectorRecordTableCols;
		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_HELPDESK', 'getSuggestedIndustryTagRequest' ).subscribe( res => {
			this.industryTagSuggestion = res.body['result'];
			for (let industryTag of this.industryTagSuggestion) {
				let industryTagListArray = [];
				industryTagListArray = industryTag['industry_tag'].split(",");
				industryTag['industry_tag_list'] = industryTagListArray;
			}
		});

		this.selectedIndustryTagTableCols = [
			{ field: 'company_name', header: 'Company Name', minWidth: '300px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'company_number', header: 'Company Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
			{ field: 'industry_tag', header: 'Industry Tag', minWidth: '500px', maxWidth: '500px', textAlign: 'left' },
			{ field: 'userSuggestionUpdate', header: 'Action', minWidth: '200px', maxWidth: '200px', textAlign: 'center' }
		];

		this.industryTagColumn = this.selectedIndustryTagTableCols;
		
		this.getSuggestedContactInfoData();

		this.selectedContactInfoDataColumn = [
			{ field: 'company_name', header: 'Company Name', minWidth: '210px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'company_number', header: 'Company Number', minWidth: '210px', maxWidth: '210px', textAlign: 'left' },
			{ field: 'fullName', header: 'Person Name', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'contact_email', header: 'Email', minWidth: '160px', maxWidth: '160px', textAlign: 'left' },
			{ field: 'contact_position', header: 'Position', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'contact_linkedin', header: 'Linkedin', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'userSuggestionUpdate', header: 'Action', minWidth: '200px', maxWidth: '200px', textAlign: 'center' }
		];

		this.contactInfoDataColumn = this.selectedContactInfoDataColumn;
	}

	getSuggestedContactInfoData() {

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_HELPDESK', 'getSuggestedOtherContactRequest' ).subscribe( res => {
			this.contactInfoDetailSuggestions = res.body['result'];
			
			for ( let contactInfo of this.contactInfoDetailSuggestions ) {

				let fullName = "";

				if ( contactInfo.contact_first_name && contactInfo.contact_first_name != "null" ) {
					fullName = contactInfo.contact_first_name + " ";
				}

				if ( contactInfo.contact_last_name && contactInfo.contact_last_name != "null" ) {
					fullName += contactInfo.contact_last_name + " ";
				}

				contactInfo['fullName'] = fullName ? fullName : '-';

			}
		});

	}


	initBreadcrumbAndSeoMetaTags(){

		// this.breadcrumbService.setItems([
		// 	{ label: 'User Suggestions' },
		// ]);
		this.title = "User Suggestions - DataGardener";
		this.description = "Use our User Suggestions dashboard fast and easy way.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
		// this.seoService.setkeywords( this.keywords );
		// this.seoService.setRobots (this.robots );
		
	}
	
	updateCompanyContactData(data) {
		
		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['performAction'],
			header: 'Approve Confirmation',
			icon: 'pi pi-info-circle',
			accept: () => {
				let obj = {
					domain: data.company_domain_link,
					email_address: data.company_email,
					linkedin_profile: data.company_linkedin_link,
					company_name: data.company_name,
					companyNumber: data.company_number,
					contact_number: data.company_phone_number,
					company_tradingAs: data.company_tradingAs,
					ctps: data.ctps == 'y' ? true : false
				}
				this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'updateCompanyContactInfoData', obj ).subscribe( res => {
					if (res.body.status === 200) {
						this.msgs = [];
						let companyNumber = [ obj.companyNumber];
						this.msgs.push({ severity: 'success', summary: "Confirmed Your data sent to the Admin for verification" });
						this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'indexCompany', companyNumber ).subscribe( res => {
								if (res.body.status == "200 ") {
									this.msgs = [];
									this.msgs.push({ severity: 'success', summary: "Company Indexing Started" })
								} else {
									this.msgs = [];
									this.msgs.push({ severity: 'success', summary: "Could Not Start Company Indexing" })
								}
							}, err => {
								if (err){
								this.msgs = [];
								this.msgs.push({ severity: 'success', summary: "Could Not Start Company Indexing" })
							}
						});	
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					} else {
						this.msgs = [];
						this.msgs.push({ severity: 'error', summary: "Company contact information not updated!!" });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					}
					this.userDetailSuggestions = [];
					this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_HELPDESK', 'getSuggestRequest' ).subscribe( res => {
						this.userDetailSuggestions = res.body['result'];
					});
				});
			}
		});
	}

	updateDirectorContactData(data) {

		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['performAction'],
			header: 'Approve Confirmation',
			icon: 'pi pi-info-circle',
			accept: () => {
				this.directorDataInfoObj.companyName = data.company_name,
				this.directorDataInfoObj.companyNumber = data.company_number,
				this.directorDataInfoObj.directorPNR = data.director_pnr,
				this.directorDataInfoObj.directorFirstName = data.director_first_name,
				this.directorDataInfoObj.directorMiddleName = data.director_middle_name ? data.director_middle_name : "",
				this.directorDataInfoObj.directorLastName = data.director_last_name,
				this.directorDataInfoObj.directorEmail = data.director_email,
				this.directorDataInfoObj.directorJobTitle = data.director_job_title,
				this.directorDataInfoObj.directorTelephone = data.director_phone_number,
				this.directorDataInfoObj.directorLinkedin = data.director_linkedin_link

				this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_HELPDESK', 'updateDirectorContactInfoData', this.directorDataInfoObj ).subscribe( res => {
				
					if (res.body.status === 200) {
						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: "Director contact information Updated!!" });

						let req = [ this.directorDataInfoObj.companyNumber ];
						this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'indexCompany', req ).subscribe( res => {
								if (res.body.status == "200 ") {
									this.msgs = [];
									this.msgs.push({ severity: 'success', summary: "Company Indexing Started" })
								} else {
									this.msgs = [];
									this.msgs.push({ severity: 'success', summary: "Could Not Start Company Indexing" })
								}
							}
							,err => {
								this.msgs = [];
								this.msgs.push({ severity: 'success', summary: "Could Not Start Company Indexing" })
							})
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					} else {
						this.msgs = [];
						this.msgs.push({ severity: 'error', summary: "Director contact information not updated!!" });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					}
					this.directorDetailSuggestions = [];
					this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_HELPDESK', 'getDirectorSuggestions' ).subscribe( res => {
						this.directorDetailSuggestions = res.body['result'];
					});
				});
			}
		});
	}

	rejectCompanyContactData(data) {

		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['performAction'],
			header: 'Reject Confirmation',
			icon: 'pi pi-info-circle',
			accept: () => {
				let obj = [ data.company_number ];
				this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_HELPDESK', 'rejectUserSuggestion', obj ).subscribe( res => {
					
					if (res.body.status == 200) {
						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: "User Suggestion rejected!!" });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					} else {
						this.msgs = [];
						this.msgs.push({ severity: 'error', summary: "User Suggestion not rejected!!" });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					}
					this.userDetailSuggestions = [];
					this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_HELPDESK', 'getSuggestRequest' ).subscribe( res => {
						this.userDetailSuggestions = res.body['result'];
					});
				});
			}
		});
	}

	rejectDirectorContactData(data) {
		
		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['performAction'],
			header: 'Reject Confirmation',
			icon: 'pi pi-info-circle',
			accept: () => {
				let obj = [data._id];
				this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_HELPDESK', 'rejectUserDirectorSuggestion', obj ).subscribe( res => {
					if (res.body.status == 200) {
						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: "User Suggestion rejected!!" });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					} else {
						this.msgs = [];
						this.msgs.push({ severity: 'error', summary: "User Suggestion not rejected!!" });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					}
					this.directorDetailSuggestions = [];
					this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_HELPDESK', 'getDirectorSuggestions' ).subscribe( res => {
						this.directorDetailSuggestions = res.body['result'];
					});
				});
			}
		});
	}

	updateIndustryTagData(data) {
		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['performAction'],
			header: 'Approve Confirmation',
			icon: 'pi pi-info-circle',
			accept: () => {
				let obj = {
					companyNumber: data.company_number,
					companyName: data.company_name,
					selectedIndustryTagString: data.industry_tag,
					listId: this.activeRoute.snapshot.queryParams['cListId'] ? this.activeRoute.snapshot.queryParams['cListId'] : ""
				}
				this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_HELPDESK', 'updateIndustryTagMaster', obj ).subscribe( res => {
					if (res.body.status === 200) {
						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: "Industry Tag Data Updated!!" });
						let reqobj = [ obj.companyNumber ];
						// this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'indexCompany', reqobj ).subscribe( res => {
						// 		if (res.status == "200 ") {
						// 			this.msgs = [];
						// 			this.msgs.push({ severity: 'success', summary: "Company Indexing Started" })
						// 		} else {
						// 			this.msgs = [];
						// 			this.msgs.push({ severity: 'success', summary: "Could Not Start Company Indexing" })
						// 		}
						// 	}
						// 	,err => {
						// 		this.msgs = [];
						// 		this.msgs.push({ severity: 'success', summary: "Could Not Start Company Indexing" })
						// 	})
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					} else {
						this.msgs = [];
						this.msgs.push({ severity: 'error', summary: "Industry Tag Data Not Updated!!" });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					}
					this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_HELPDESK', 'getSuggestedIndustryTagRequest' ).subscribe( res => {
						this.industryTagSuggestion = res.body['result'];
						for (let industryTag of this.industryTagSuggestion) {
							let industryTagListArray = [];
							industryTagListArray = industryTag['industry_tag'].split(",");
							industryTag['industry_tag_list'] = industryTagListArray;
						}
					});
				});
			}
		});
	}

	rejectIndustryTagData(data) {
		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['performAction'],
			header: 'Reject Confirmation',
			icon: 'pi pi-info-circle',
			accept: () => {
				let obj = [ data.company_number ];
				this.globalServerCommunication.globalServerRequestCall( 'get','DG_HELPDESK','rejectUserSuggestionIndustryTag' , obj ).subscribe( res => {
					
					if (res.body.status == 200) {
						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: "User Suggestion rejected!!" });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					} else {
						this.msgs = [];
						this.msgs.push({ severity: 'error', summary: "User Suggestion not rejected!!" });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					}
					this.industryTagSuggestion = [];
					this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_HELPDESK', 'getSuggestedIndustryTagRequest' ).subscribe( res => {
						this.industryTagSuggestion = res.body['result'];
						for (let industryTag of this.industryTagSuggestion) {
							let industryTagListArray = [];
							industryTagListArray = industryTag['industry_tag'].split(",");
							industryTag['industry_tag_list'] = industryTagListArray;
						}
					});
				});
			}
		});
	}

	updateContactInfoData( data ) {

		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['performAction'],
			header: 'Approve Confirmation',
			icon: 'pi pi-info-circle',
			accept: () => {
				this.contactInformationObj.userId = data.user_id,
				this.contactInformationObj.companyNumber = data.company_number;
				this.contactInformationObj.companyName = data.company_name;
				this.contactInformationObj.directorFirstName = data.contact_first_name;
				this.contactInformationObj.directorLastName = data.contact_last_name;
				this.contactInformationObj.directorEmail = data.contact_email;
				this.contactInformationObj.directorJobTitle = data.contact_position;
				this.contactInformationObj.directorLinkedin = data.contact_linkedin;
				this.contactInformationObj.contact_pnr = data.contact_pnr;

				this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_HELPDESK', 'updateDirectorContactInfoData', this.contactInformationObj ).subscribe( res => {
					if ( res.body.status === 200 ) {
						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: "Contact Information Updated!!" });

						let reqobj = [ this.contactInformationObj.companyNumber ];
						this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'indexCompany', reqobj ).subscribe( res => {
								if (res.status == "200 ") {
									this.msgs = [];
									this.msgs.push({ severity: 'success', summary: "Company Indexing Started" })
								} else {
									this.msgs = [];
									this.msgs.push({ severity: 'success', summary: "Could Not Start Company Indexing" })
								}
							},err => {
								this.msgs = [];
								this.msgs.push({ severity: 'success', summary: "Could Not Start Company Indexing" })
							})
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					} else {
						this.msgs = [];
						this.msgs.push({ severity: 'error', summary: "Contact Information not updated!!" });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					}
					this.directorDetailSuggestions = [];
					this.getSuggestedContactInfoData();
				});

			}
		});

	}

	rejectContactInfoData( data ) {
		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['performAction'],
			header: 'Reject Confirmation',
			icon: 'pi pi-info-circle',
			accept: () => {
				let obj = [ data._id ];
				this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_HELPDESK', 'rejectOtherContactSuggestion', obj ).subscribe( res => {
					if (res.body.status == 200) {
						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: "User Suggestion rejected!!" });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					} else {
						this.msgs = [];
						this.msgs.push({ severity: 'error', summary: "User Suggestion not rejected!!" });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					}
					this.contactInfoDetailSuggestions = [];
					this.getSuggestedContactInfoData();
				});
			}
		});
	}

}
