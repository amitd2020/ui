import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { DataCommunicatorService } from '../../data-communicator.service';

@Component({
	selector: 'dg-linkedin-profile',
	templateUrl: './linkedin-profile.component.html',
	styleUrls: ['./linkedin-profile.component.scss']
})
export class LinkedinProfileComponent implements OnInit {
	
	companyData: any;
	totalLinkedinUserDataCount: any;
	selectedRecordTableCols: any;
	linkedinUserData: any;
	companyNumber: string = '';

	constructor(
		private sharedLoaderService: SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService,
		public activatedRoute: ActivatedRoute,
		private dataCommunicatorService: DataCommunicatorService,
	){}

	ngOnInit() {
		this.sharedLoaderService.showLoader();

		this.getLinkedinProfilesData();
		this.selectedRecordTableCols = [
			{ field: 'linkedinPersonName', header: 'Person Name', minWidth: '220px', maxWidth: '220px', textAlign: 'left' },
			{ field: 'position', header: 'Person Position', minWidth: '450px', maxWidth: '450px', textAlign: 'left' },
			{ field: 'about_me', header: 'About', minWidth: '350px', maxWidth: 'none', textAlign: 'left' },
		];
	}

	getLinkedinProfilesData(){

		// let companyNumber = this._activatedRoute.params['_value']['companyNo'];

		this.dataCommunicatorService.$dataCommunicatorVar.subscribe((res: any) => {
			this.companyNumber = res.companyRegistrationNumber;
		});

		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_API', 'getPersonLinkedinByCmpNo', [ this.companyNumber ] ).subscribe({
			next: ( res ) => {
				if ( res.body.status ) {
					this.totalLinkedinUserDataCount = res?.body?.results?.length;
					this.linkedinUserData = res?.body?.results;					
				}
				this.sharedLoaderService.hideLoader();
			},
			error: ( err ) => {
				console.log("🚀 err:", err)
				this.sharedLoaderService.hideLoader();
			}
		})

	}

}
