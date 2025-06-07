import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserAuthService } from "src/app/interface/auth-guard/user-auth/user-auth.service";
import { subscribedPlan } from "src/environments/environment";

@Component({
	selector: 'dg-industry-analysis',
	templateUrl: './industry-analysis.component.html'
})

export class IndustryAnalysisComponent implements OnInit {

	currentPlan: unknown;
	subscribedPlanModal: any = subscribedPlan;

	constructor(
		public userAuthService: UserAuthService,
		private router: Router
	) {

		this.currentPlan = this.userAuthService?.getUserInfo('planId');

		if ( !this.userAuthService.hasAddOnPermission('industryAnalysis') && this.subscribedPlanModal['Valentine_Special'] !== this.currentPlan ) {
			this.router.navigate(['/']);
		}
	}

	ngOnInit() { }

}