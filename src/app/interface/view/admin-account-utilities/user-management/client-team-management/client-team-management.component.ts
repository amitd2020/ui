import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';

import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-client-team-management',
	templateUrl: './client-team-management.component.html',
	styleUrls: ['./client-team-management.component.scss']
})
export class ClientTeamManagementComponent implements OnInit, OnChanges {

	@Input() private userDetailsInput: any;
	@Input() public thisPage: string;
	@Input() updateUserDetailsTeamFeature: boolean;

	// teamManagementSpinner: boolean = false;

	allTeamFeaturesListColumns: Array<any> = [];
	allTeamFeaturesListData: Array<any> = [];
	startPlanFeatures: Array<any> = [];
	tempCheckTeamFeaturesListData: any;
	
	teamFeaturesList: Array<any> = [];

	addNewTeamModalDialog: boolean = false;
	addNewTeamFormData: any = {
		name: undefined
	};

	checkIfTeamAlreadyExistsBoolean: boolean = false;
	timeout: any = null;
	startPlanIds: Array<any>;

	constructor(
		public userAuthService: UserAuthService,
		private messageService: MessageService,
		private confirmationService: ConfirmationService,
		private commonService: CommonServiceService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit() {

		this.initBreadcrumbAndSeoMetaTags();

		this.allTeamFeaturesListColumns = [
			{ field: 'featureGroup', header: 'Feature Group', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
			{ field: 'featureName', header: 'Feature Name', minWidth: '300px', maxWidth: 'none', textAlign: 'left' }
		];

		this.getAllTeamFeaturesList();

	}

	ngOnChanges(changes: SimpleChanges) {
		if ( changes.updateUserDetailsTeamFeature && changes.updateUserDetailsTeamFeature.currentValue == true ) {
			this.getAllTeamFeaturesList();
		}
	}

	initBreadcrumbAndSeoMetaTags() {
		// this.breadCrumbService.setItems([
		// 	{ label: 'Team Features' }
		// ]);
	}

	getAllTeamFeaturesList() {

		let clientAdminEmail = [ this.userDetailsInput && this.userDetailsInput.clientAdminEmail ? this.userDetailsInput.clientAdminEmail : this.userAuthService?.getUserInfo('email') ];

		// this.teamManagementSpinner = true;
		this.sharedLoaderService.showLoader();

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_USER_API', 'teamFeaturesList', clientAdminEmail).subscribe( res => {

			if ( res.body['status'] == 200 && res.body['results'].length > 0) {

				this.allTeamFeaturesListData = res.body['results'];
				this.startPlanFeatures = [];
				this.teamFeaturesList = [];

				this.tempCheckTeamFeaturesListData = JSON.stringify( res.body['results'] );

				for ( let startFeatures of this.allTeamFeaturesListData[0]['startFeatures'] ) {
					if ( startFeatures && startFeatures['_id'] ) {
						this.startPlanFeatures.push(startFeatures['_id']);
					}
				}

				for ( let teamFeature of this.allTeamFeaturesListData[0]['featuresArray'] ) {
					this.teamFeaturesList.push( { group: teamFeature['description'], name: teamFeature['pageNameDescription'] } );
				}

				this.teamFeaturesList.sort( ( a, b ) => a['group'].localeCompare( b['group'] ));

				this.allTeamFeaturesListColumns = [
					{ field: 'featureGroup', header: 'Feature Group', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
					{ field: 'featureName', header: 'Feature Name', minWidth: '300px', maxWidth: 'none', textAlign: 'left' }
				];
				
				// To make string camelCase = string.toLowerCase().replace( /[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase() ) ===== Used below
				for ( let teamData of this.allTeamFeaturesListData ) {
					this.allTeamFeaturesListColumns.push( { field: teamData.description.toLowerCase().replace( /[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase() ), header: teamData.description, minWidth: '220px', maxWidth: '220px', textAlign: 'center', selectAllCheckBox: false } );
				}

				this.checkIfAllFeaturesEnabled();

			}
				
			// this.teamManagementSpinner = false;
			this.sharedLoaderService.hideLoader();

		});
	}

	updateTeamFeatures() {
		let updatedTeamFeaturesBody = [], updatedFeatures = [];

		if ( this.allTeamFeaturesListData && this.allTeamFeaturesListData.length && !this.commonService.comparingObjects( this.tempCheckTeamFeaturesListData, this.allTeamFeaturesListData ) ) {

			for ( let updatedTeamObj of this.allTeamFeaturesListData ) {
	
				for ( let updatedFeature of updatedTeamObj.featuresArray ) {
					
					if ( updatedFeature.featureEnabled ) {
						updatedFeatures.push( updatedFeature._id );
					}
	
				}
	
	
				updatedTeamFeaturesBody.push({
					id: updatedTeamObj.id,
					features: updatedFeatures
				});

				updatedFeatures = [];
	
			}
	
			this.confirmationService.confirm({
				message: "Do you want to update the team's features?",
				accept: () => {

					this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_USER_API', 'modifyTeamFeatures', updatedTeamFeaturesBody).subscribe( res => {
						if ( res.body['status'] == 200 ) {
		
							this.messageService.add( { severity: 'success', summary: 'Team Features has been updated successfully.', key: this.thisPage } );
							
							this.getAllTeamFeaturesList();
		
							setTimeout(() => {
								this.messageService.clear();
							}, 3000);
			
						} else {
			
							this.messageService.add( { severity: 'error', summary: 'Something went wrong.', key: this.thisPage } );
			
							setTimeout(() => {
								this.messageService.clear();
							}, 3000);
						}
					});
					
				},
				reject: () => {

					this.getAllTeamFeaturesList();
					
				}
			});

		} else {

			if ( this.allTeamFeaturesListData && !this.allTeamFeaturesListData.length ) {
				this.messageService.add( { severity: 'error', summary: 'No records available.', key: this.thisPage } );
			} else {
				this.messageService.add( { severity: 'error', summary: 'No change found.', key: this.thisPage } );
			}

			setTimeout(() => {
				this.messageService.clear();
			}, 3000);

		}

	}

	addNewTeam() {

		if ( this.addNewTeamFormData.name && !this.checkIfTeamAlreadyExistsBoolean ) {
			
			this.addNewTeamFormData['description'] = `${ this.addNewTeamFormData.name } Team`;
			this.addNewTeamFormData['clientAdminEmail'] = this.userDetailsInput ? this.userDetailsInput.clientAdminEmail : this.userAuthService?.getUserInfo('clientAdminEmail');

			this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_USER_API', 'createTeam', this.addNewTeamFormData ).subscribe( res => {
				if ( res.body['status'] == 200 ) {

					this.getAllTeamFeaturesList();

					this.addNewTeamModalDialog = false;

					this.messageService.add( { severity: 'success', summary: 'Team Added Successfully!', key: this.thisPage } );

					setTimeout(() => {
						this.messageService.clear();
					}, 3000);
				}
			});

		}

	}

	checkIfTeamAlreadyExists( teamName ) {

		clearTimeout( this.timeout );

		if ( teamName ) {

			this.timeout = setTimeout(() => {
				
				let matchedTeam = this.allTeamFeaturesListData.filter( val => val.description.toLowerCase() == ( `${ teamName.trim() } Team` ).toLowerCase() );
		
				if ( matchedTeam && matchedTeam.length > 0 ) {
					this.checkIfTeamAlreadyExistsBoolean = true;
				} else {
					this.checkIfTeamAlreadyExistsBoolean = false;
				}
	
			}, 1000);

		} else {
			this.checkIfTeamAlreadyExistsBoolean = false;
		}
		
	}
	
	closeAddNewTeamModalDialog( addNewTeamForm: NgForm ) {
		this.checkIfTeamAlreadyExistsBoolean = false;
		this.addNewTeamFormData.name = undefined;
		addNewTeamForm.reset();
		this.addNewTeamModalDialog = false;
	}

	selectAllTeamFeatures( event, header ) {

		if ( event.checked == true ) {
			
			for( let teamData of this.allTeamFeaturesListData ) {
				if ( teamData.description == header ) {

					for ( let teamFeatures of teamData.featuresArray ) {
						if ( !this.startPlanFeatures.includes( teamFeatures['_id'] ) ) {
							teamFeatures.featureEnabled = true;
							}  
					}

				}
			}

		} else {

			for( let teamData of this.allTeamFeaturesListData ) {
				if ( teamData.description == header ) {

					for ( let teamFeatures of teamData.featuresArray ) {
						if ( !this.startPlanFeatures.includes( teamFeatures['_id'] ) ) {
							teamFeatures.featureEnabled = false;
						}
					}

				}
			}

		}

	}

	checkIfAllFeaturesEnabled() {
		
		for ( let columnData of this.allTeamFeaturesListColumns ) {

			for( let teamFeatures of this.allTeamFeaturesListData ) {

				if ( columnData.header == teamFeatures.description ) {

					let allFeaturesCount = teamFeatures.featuresArray.length,
						checkedFeaturesCount = teamFeatures.featuresArray.filter( val => val.featureEnabled ).length;

					if ( allFeaturesCount == checkedFeaturesCount ) {
						columnData.selectAllCheckBox =  true;
					} else {
						columnData.selectAllCheckBox =  false;

					}

				}
				
			}

		}

	}

}
