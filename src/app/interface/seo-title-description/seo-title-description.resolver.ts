import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";

import { Observable } from "rxjs";
import { subscribedPlan } from 'src/environments/environment';
import { SeoService } from "../service/seo.service";


@Injectable({
	providedIn: 'root'
})
export class SeoTitleDescriptionResolver implements Resolve<any> {

	constructor(
		private seoService: SeoService,
	) { }

	queryString = window.location.search;
	planId: string = subscribedPlan['Start'];
	signUpType: string = "company";
	title: string = '';
	description: string = '';
	subscribedPlanModal: any = subscribedPlan;
	robots: string = 'index, follow'; // 'index, follow, noindex, nofollow'



	resolve(activatedRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<any> | Promise<any> | any {
		
		this.planId = activatedRoute.queryParams['planId'];

		if ( this.planId === this.subscribedPlanModal['Valentine_Special'] ) {
			this.title = 'Exclusive Valentine\'s Day Offer | DataGardener';
			this.description = 'Sign up for two weeks of free access to our Enterprise plan.';
		} else {
			this.title = 'SignUp to Access Companies and Directors Data | DataGardener';
			this.description = 'Sign Up as a Company or Individual and access the business information from the UK company database.';
		}

		this.seoService.setPageTitle(this.title);
		this.seoService.setMetaTitle(this.title);
		this.seoService.setDescription(this.description);
		this.seoService.setRobots(this.robots);

	}

}