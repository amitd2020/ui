import { Component, OnInit } from '@angular/core';

import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { take } from 'rxjs';

@Component({
	selector: 'dg-notes',
	templateUrl: './notes.component.html',
	styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

	msgs: any[];
	companyData: any;
	notesData: any = undefined;
	notesId: any = undefined;

	notesTableCols: Array<any>;

	isLoggedIn: boolean = false;
    userDetails: Partial< UserInfoType > = {};
	companyNoteValue: string = '';

    showUpgradePlanDialog: boolean = false;
	showAddNoteModalBool: boolean = false;

	companyDetailsParams: any = { CompanyNumber: undefined, CompanyNameOriginal: undefined };
    constantMessages: any = UserInteractionMessages;

	constructor(
		private dataCommunicatorService: DataCommunicatorService,
		public userAuthService: UserAuthService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit() {

		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( loggedIn => {
			this.isLoggedIn = loggedIn;

			if ( this.isLoggedIn ) {
				this.userDetails = this.userAuthService?.getUserInfo();
		
				this.dataCommunicatorService.$dataCommunicatorVar.subscribe( (res: any) => {
					this.companyData = {
						companyRegistrationNumber : res.companyRegistrationNumber,
						businessName : res.businessName
					}
				});
		
				this.companyDetailsParams.CompanyNumber = this.companyData.companyRegistrationNumber;
				this.companyDetailsParams.CompanyNameOriginal = this.companyData.businessName;
		
				this.notesTableCols = [
					{ field: 'notes', header: 'Note ', width: '350px', textAlign: 'left' },
					{ field: 'createdOn', header: 'Created On', width: '100px', textAlign: 'center' },
					{ field: 'updatedOn', header: 'Updated On', width: '100px', textAlign: 'center' },
					{ field: 'createdBy', header: 'Added By User', width: '100px', textAlign: 'center' }
				];
		
				this.getNotes();
			}

		});


	}

	getNotes() {

		this.sharedLoaderService.showLoader();

		let obj = {
			userid: this.userDetails?.dbID,
			companyNumber: this.companyData.companyRegistrationNumber
		}

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'getNotes', obj ).subscribe( res => {
			if (res.body['status'] == 200) {
				if (res.body['results']) {
					this.notesData = res.body['results'];
				} else {
					this.notesData = []
				}
			} else {
				this.notesData = []
			}
		});

		setTimeout(() => {
			this.sharedLoaderService.hideLoader();
		}, 200);

	}

	showAddNoteModal(data) {

		if ( this.userAuthService.hasFeaturePermission('Company Notes') || this.userAuthService.hasRolePermission( ['Super Admin'] ) ) {

			if (data !== undefined) {
				this.companyNoteValue = data.notes;
				this.notesId = data._id;
				this.showAddNoteModalBool = true;
			} else {
				this.showAddNoteModalBool = true;
			}
				
		} else {
			this.showUpgradePlanDialog = true;
		}
        
    }

	deleteNotes() {

		if (this.notesId !== undefined) {
			var notesID = this.notesId
		}
		let obj = {
			notesId: notesID
		}

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'deleteNotesCompany', obj ).subscribe( res => {

			if (res.body.status == 200) {
				this.companyNoteValue = '';
				this.showAddNoteModalBool = false;
				this.getNotes();
				this.notesId = undefined;
			}

		});

	}

	addNotes() {

		let obj = {
			userid: this.userDetails?.dbID,
			notes: this.companyNoteValue,
			companyNumber: this.companyData.companyRegistrationNumber,
			CompanyNameOriginal: this.companyData.businessName
		}
		
		if (this.notesId !== undefined) {

			obj['notesId'] = this.notesId;

			this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'updateNotesCompany', obj ).subscribe( res => {
				if (res.body.status == 200) {
					this.companyNoteValue = '';
					this.notesId = undefined;
					this.showAddNoteModalBool = false;
					this.msgs = [];
					this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['notesUpdatedSuccess'], detail: '' });
					setTimeout(() => {
						this.msgs = [];
					}, 2000);
					this.getNotes();
				}
			});
		} else {

			obj["updatedOn"] = new Date().toISOString();
																																																																																																																																																																																																																					  
			this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'addNotesCompany', obj ).subscribe( res => {
				if (res.body.status == 200) {
					this.companyNoteValue = '';
					this.showAddNoteModalBool = false;
					this.msgs = [];
					this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['notesAddedSuccess'], detail: '' });
					setTimeout(() => {
						this.msgs = [];
					}, 2000);
					this.getNotes();
				}
			});
		}

	}

	cancelNotes() {
		this.companyNoteValue = '';
	}

	updateNotesList( event ) {
		if( event ) {
			setTimeout(() => {
				this.getNotes();
			}, 500);
		}
	}

}
