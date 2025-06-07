import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-related-companies',
	templateUrl: './related-companies.component.html',
	styleUrls: ['./related-companies.component.scss']
})
export class RelatedCompaniesComponent implements OnInit {

	isLoggedIn: boolean = false;
	companyData: any;

	relatedCompaniesDataColumn: any[];

	relatedDirectors: Array<any>;
	relatedCompanies: Array<any>;

	relatedDirectorsAndCompaniesCount: Number = 0;

	sampleLrmPdf: boolean = true;
	showExportButton: boolean = true;
	relCompDirDataValueStatus: boolean = false;

	constructor(
		public userAuthService: UserAuthService,
		private dataCommunicatorService: DataCommunicatorService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) { }

	ngOnInit() {

		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => { this.isLoggedIn = loggedIn; });
		this.dataCommunicatorService.$dataCommunicatorVar.pipe( take(1) ).subscribe( ( res: any ) => { this.companyData = res; });
		
		if ( this.isLoggedIn ) {
			
			this.getRelatedCompaniesAndDirector();
			this.relatedCompaniesDataColumn = [
				{ field: 'companyName', header: 'Company Name', width: '450px', textAlign: 'left' },
				{ field: 'companyNumber', header: 'Company Number', width: '150px', textAlign: 'left' },
				{ field: 'linkedDirector', header: 'Linked Director', width: '240px', textAlign: 'left' },
				{ field: 'companyStatus', header: 'Status', width: '120px', textAlign: 'center' },
				{ field: 'totalDirectors', header: 'No. of Directors', width: '130px', textAlign: 'right' },
				{ field: 'appointedOn', header: 'Appointed on', width: '120px', textAlign: 'right' },
				{ field: 'chargesCount', header: 'Charges', width: '100px', textAlign: 'right' },
				{ field: 'incorporationDate', header: 'Incorporation', width: '130px', textAlign: 'right' },
				{ field: 'category', header: 'Category', width: '350px', textAlign: 'left' },
				{ field: 'sic_code', header: 'Sic Code', width: '500px', textAlign: 'left' },
				{ field: 'address', header: 'Address', width: '500px', textAlign: 'left' }
			];

		}

	}

	getRelatedCompaniesAndDirector( pageSize?: number, startAfter?: number, sortOn?: any[] ) {
		this.sharedLoaderService.showLoader();

		let pageName = "relatedCompanies";

		this.relCompDirDataValueStatus = true;
		this.relatedDirectorsAndCompaniesCount = 0;

		let obj = {
			"cmpNo": this.companyData?.companyRegistrationNumber,
			'pageName': pageName,
			'pageSize': pageSize ? pageSize : 25,
			'pageNumber': startAfter ? startAfter : 1,
			'sortOn': sortOn ? sortOn : undefined
		}

		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_API', 'relatedCompaniesAndDirectorsByCmpNoTableData', obj ).subscribe( res => {
			let data = res.body;
			this.sharedLoaderService.hideLoader();
			if (data['status'] == 200) {

				this.showExportButton = false;
				this.sampleLrmPdf = false;
				this.relCompDirDataValueStatus = false;

				if (data['result'].relatedCompanies) {
					this.relatedCompanies = data['result'].relatedCompanies;
					this.relatedDirectors = [];
				}
				if (data['result'].relatedDirectors) {
					this.relatedDirectors = data['result'].relatedDirectors;
					this.relatedCompanies = [];
				} else {
					this.relCompDirDataValueStatus = false;
				}

				this.relatedDirectorsAndCompaniesCount = data['totalLength'];

				if (this.relatedDirectors === undefined) {
					this.relatedDirectors = [];
					this.showExportButton = true;
					this.sampleLrmPdf = true;
					this.relCompDirDataValueStatus = false;
				}
				if (this.relatedCompanies === undefined) {
					this.relatedCompanies = [];
					this.showExportButton = true;
					this.sampleLrmPdf = true;
					this.relCompDirDataValueStatus = false;
				}

			}
			else if (data['status'] == 404) {
				this.showExportButton = true;
				this.sampleLrmPdf = true;
				this.relatedCompanies = [];
				this.relatedDirectors = [];
				this.relCompDirDataValueStatus = false;
			}
		});

	}

}
