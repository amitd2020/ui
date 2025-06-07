import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-related-directors',
	templateUrl: './related-directors.component.html',
	styleUrls: ['./related-directors.component.scss']
})
export class RelatedDirectorsComponent implements OnInit {

	isLoggedIn: boolean = false;
	companyData: any;

	relatedDirectorsDataColumn: any[];

	relatedCompanies: Array<any>;
	relatedDirectors: Array<any>;

	sampleLrmPdf: boolean = true;
	showExportButton: boolean = true;
	relCompDirDataValueStatus: boolean = false;

	relatedDirectorsAndCompaniesCount: Number = 0;

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
			this.relatedDirectorsDataColumn = [
				{ field: 'directorName', header: 'Director Name', width: '280px', textAlign: 'left' },
				{ field: 'resignedStatus', header: 'Status', width: '100px', textAlign: 'center' },
				{ field: 'appointmentDate', header: 'Appointed on', width: '120px', textAlign: 'center' },
				{ field: 'linkedDirector', header: 'Linked Director', width: '280px', textAlign: 'left' },
				{ field: 'companyName', header: 'Company Name', width: '250px', textAlign: 'left' },
				{ field: 'companyStatus', header: 'Company Status', width: '120px', textAlign: 'center' },
				{ field: 'role', header: 'Role', width: '150px', textAlign: 'left' },
				{ field: 'nationality', header: 'Nationality', width: '120px', textAlign: 'left' },
				{ field: 'dAddress', header: 'Address1', width: '450px', textAlign: 'left' },
				{ field: 'dAddress2', header: 'Address2', width: '450px', textAlign: 'left' },
			];

		}


	}

	getRelatedCompaniesAndDirector(pageSize ?:number, startAfter ?: number, sortOn ?: any[]) {
		this.sharedLoaderService.showLoader();
		
		let pageName = "relatedDirectors";
		
		this.relCompDirDataValueStatus = true;
		this.relatedDirectorsAndCompaniesCount = 0;
		
		let obj = {
			"cmpNo": this.companyData?.companyRegistrationNumber,
			'pageName': pageName,
			'pageSize': pageSize ? pageSize : 25,
			'pageNumber': startAfter ? startAfter : 1,
			'sortOn': sortOn ? sortOn : undefined
		}
		
		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_API', 'relatedCompaniesAndDirectorsByCmpNoTableData', obj).subscribe(res => {
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
