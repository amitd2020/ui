import { Component, OnInit } from '@angular/core';

import { ConfirmationService, MessageService } from 'primeng/api';

import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../shared-components/shared-loader/shared-loader.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-plan-features',
	templateUrl: './plan-features.component.html',
	styleUrls: ['./plan-features.component.scss']
})
export class PlanFeaturesComponent implements OnInit {

	allFeaturesList: Array<any> = [];
	planFeatureColumns: Array<any>;
	planFeatureData: Array<any>;
	tempCheckPlanFeatureData: any;

	title: string = '';

	constructor(
		private messageService: MessageService,
		private confirmationService: ConfirmationService,
		public userAuthService: UserAuthService,
		private seoService: SeoService,
		private commonService: CommonServiceService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit() {

		this.initBreadcrumbAndSeoMetaTags();

		this.planFeatureColumns = [
			{ field: 'featureGroup', header: 'Feature Group', minWidth: '200px', maxWidth: '200px', textAlign: 'left' },
			{ field: 'featureName', header: 'Feature Name', minWidth: '300px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'startPlan', header: 'Start', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
			{ field: 'expandPlan', header: 'Expand', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
			{ field: 'enterprisePlan', header: 'Enterprise', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
			{ field: 'premiumPlan', header: 'Premium', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
			{ field: 'Compliance', header: 'Compliance', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },
			{ field: 'Valentine', header: 'Grantify', minWidth: '120px', maxWidth: '120px', textAlign: 'center' },

		];

		this.getAllPlanFeaturesList();
	}

	getAllPlanFeaturesList() {

		this.sharedLoaderService.showLoader();
		
		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_FEATURES', 'allFeatures' ).subscribe ( res => {
		
			if ( res.body.status == 200 ) {
				this.planFeatureData = res.body['results'];
				this.tempCheckPlanFeatureData = JSON.stringify( res.body['results'] );

				this.allFeaturesList = [];

				for ( let planFeature of this.planFeatureData[0]['featuresObject'] ) {
					this.allFeaturesList.push( { group: planFeature['description'], name: planFeature['pageNameDescription'] } );
				}

				this.allFeaturesList.sort( ( a, b ) => a['group'].localeCompare( b['group'] ));

			}

            this.sharedLoaderService.hideLoader();

		});
	}

	updatePlanFeatures() {
		let updatedPlanFeaturesBody = [], updatedFeatures = [];

		if ( !this.commonService.comparingObjects( this.tempCheckPlanFeatureData, this.planFeatureData ) ) {

			for ( let updatedPlanObj of this.planFeatureData ) {
	
				for ( let updatedFeature of updatedPlanObj.featuresObject ) {
					
					if ( updatedFeature.featureEnabled ) {
						updatedFeatures.push( updatedFeature._id );
					}
	
				}
	
				if ( updatedFeatures.length ) {
	
					updatedPlanFeaturesBody.push({
						features: updatedFeatures,
						planName: updatedPlanObj.planName
					});
	
				}
	
				updatedFeatures = [];
	
			}
	
			this.confirmationService.confirm({
				message: "Do you want to update the plan's features?",
				accept: () => {

					this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_FEATURES', 'updatePlanFeaturesByName', updatedPlanFeaturesBody ).subscribe ( res => {

						
						if ( res['status'] == 200 ) {
		
							this.messageService.add( { severity: 'success', summary: 'Features has been updated successfully.' } );
							
							this.getAllPlanFeaturesList();
		
							setTimeout(() => {
								this.messageService.clear();
							}, 3000);
			
						} else {
			
							this.messageService.add( { severity: 'error', summary: 'Something went wrong.' } );
			
							setTimeout(() => {
								this.messageService.clear();
							}, 3000);
						}
					});
					
				},
				reject: () => {
					
					this.getAllPlanFeaturesList();
				}
			});

		} else {

			this.messageService.add( { severity: 'error', summary: 'No change found.' } );

			setTimeout(() => {
				this.messageService.clear();
			}, 3000);

		}

	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadCrumbService.setItems([
		// 	{ label: 'Plan Features' }
		// ]);

		this.title = "Plan Features - DataGardener";
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.title);
		// this.seoService.setkeywords( this.keywords );
		// this.seoService.setRobots (this.robots );
		
	}

	// selectFeatures(event,rowData, column){

	// 	for ( let updatedPlanObj of this.planFeatureData ){
	// 		if( column.header == updatedPlanObj.description){
	// 			for ( let updatedFeature of updatedPlanObj.featuresObject ){
	// 				if( event.checked == true){
	// 					if( updatedFeature.pageNameDescription == rowData.name){
	// 						updatedFeature.featureEnabled = true;
	// 					}
	// 				}
	// 				if( event.checked == false){
	// 					if( updatedFeature.pageNameDescription == rowData.name){
	// 						updatedFeature.featureEnabled = false;
	// 					}	
	// 				}
				
	// 			}
	// 		}
	// 	}
		
	// }

}
