import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { CompaniesEligibleForDataWithoutLogin } from 'src/environments/environment';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-commentry',
	templateUrl: './commentry.component.html',
	styleUrls: ['./commentry.component.scss']
})
export class CommentryComponent implements OnInit {

	isLoggedIn: boolean = false;
	companyData: any;

	companyCommentryData: Array<any> = undefined;

	companiesEligibleForDataWithoutLogin = CompaniesEligibleForDataWithoutLogin;

	companyCommentaryColumn: { field: string; header: string; minWidth: string; maxWidth: string; textAlign: string; }[];

	commentry: any[];
	companyRegistrationNumber: any;

	constructor(
		public userAuthService: UserAuthService,
		private dataCommunicatorService: DataCommunicatorService,
		private sharedLoaderService: SharedLoaderService
	) { }

	ngOnInit() {

		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => this.isLoggedIn = loggedIn );
		this.dataCommunicatorService.$dataCommunicatorVar.subscribe( ( res: any ) => this.companyData = res );

		if ( this.companyData.hasCompanyCommentary ) {
			if ( this.isLoggedIn || ( !this.isLoggedIn && this.companiesEligibleForDataWithoutLogin.includes( this.companyData.companyRegistrationNumber ) ) ) {
				this.getCompanyCommentaryData( this.companyData.companyCommentary );
			}
		}

	}

	getCompanyCommentaryData(data) {
		
		this.sharedLoaderService.showLoader();

		this.companyCommentryData = data;
		this.commentry = this.companyCommentryData;
		this.companyCommentaryColumn = [
			{ field: 'commentaryText', header: 'Commentary', minWidth: '160px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'commentaryImpact', header: 'Impact', minWidth: '250px', maxWidth: '250px', textAlign: 'center' },
			{ field: 'dateLogged', header: 'Date', minWidth: '250px', maxWidth: '250px', textAlign: 'center' }
		];

		for (let i = 0; i < this.companyCommentryData.length; i++) {
			if (this.companyCommentryData[i]["commentaryText"] !== null || this.companyCommentryData[i]["commentaryText"] !== "") {
				this.companyCommentryData[i]['commentaryText'] = this.companyCommentryData[i]["commentaryText"].replace(/[!@#$%^&*()�,.?";:{}|<>]/g, "")
			}
		}
		
        setTimeout(() => {
            this.sharedLoaderService.hideLoader();
        }, 1000);

	}

}
