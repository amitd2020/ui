import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-safe-alert',
	templateUrl: './safe-alert.component.html',
	styleUrls: ['./safe-alert.component.scss']
})
export class SafeAlertComponent implements OnInit {

	isLoggedIn: boolean = false;
	currentPlan: unknown;
	companyData: any;

	safeAlerts: any;
	
	safeAlertsColumn: any[];

	constructor(
		public userAuthService: UserAuthService,
		private dataCommunicatorService: DataCommunicatorService,
		private sharedLoaderService: SharedLoaderService
	) { }

	ngOnInit() {

		this.userAuthService.isLoggedInSubject$.pipe( take(1) ).subscribe( ( loggedIn: boolean ) => this.isLoggedIn = loggedIn );
		this.dataCommunicatorService.$dataCommunicatorVar.pipe( take(1) ).subscribe( ( res: any ) => this.companyData = res );

		if ( this.companyData.hasSafeAlerts && this.isLoggedIn ) {

			this.currentPlan = this.userAuthService?.getUserInfo('planId');

			for (let i = 0; i < this.companyData.safeAlerts.length; i++) {
				if (this.companyData.safeAlerts[i].alertCodeTitle == 'multiple key changes') {
					this.companyData.safeAlerts[i].alertCodeTitle = 'Multiple Indicators';
				}
			}
			this.getSafeAlertsData(this.companyData.safeAlerts);
		}
	}

	getSafeAlertsData(data: any) {
		this.sharedLoaderService.showLoader();

		this.safeAlerts = data;
		this.safeAlertsColumn = [
			{ field: 'alertCode', header: 'Alert Code', minWidth: '200px', maxWidth: '200px', textAlign: 'right', verticalAlign: 'top' },
			{ field: 'alertCodeTitle', header: 'Alert Code Title', minWidth: '250px', maxWidth: '250px', textAlign: 'left', verticalAlign: 'top' },
			{ field: 'alertDate', header: 'Alert Date', minWidth: '200px', maxWidth: '200px', textAlign: 'right', verticalAlign: 'center' },
			{ field: 'safealertdescription', header: 'Description', minWidth: '280px', maxWidth: 'none', textAlign: 'left' }
		];
        setTimeout(() => {
            this.sharedLoaderService.hideLoader();
        }, 1000);
	}

}
