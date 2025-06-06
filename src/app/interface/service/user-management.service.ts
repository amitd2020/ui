import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { UserAuthService } from '../auth-guard/user-auth/user-auth.service';



@Injectable()
export class UserManagementService {
	constructor(
		private http: HttpClient,
		private userAuthService: UserAuthService
	) { }


	addNewPlan(data) {
		let hit = 0;
		let priceph = 0;

		if (data.show === false) {
			hit = 0;
			priceph = 0;
		} else if (data.show === true) {
			hit = data.hits;
			priceph = data.priceperhit;
		}

		let obj = {
			name: data.name,
			features: data.features,
			description: data.description,
			status: 1,
			createdBy: this.userAuthService?.getUserInfo('dbID'),
			endDate: data.endDate,
			startDate: data.startDate,
			cost: data.cost,
			duration: data.duration,
			order: data.order,
			vat: 0,
			hits: hit,
			priceperhit: priceph,
			companyReport: data.companyReport ? data.companyReport : null,
			basicLimit: data.basicLimit ? data.basicLimit : null,
			advancedLimit: data.advancedLimit ? data.advancedLimit : null,
			landLimit: data.landLimit ? data.landLimit : null,
			corpLandLimit: data.corpLandLimit ? data.corpLandLimit : null,
			companyMonitorLimit: data.companyMonitorLimit ? data.companyMonitorLimit : null,
			directorMonitorLimit: data.directorMonitorLimit ? data.directorMonitorLimit : null,
			directorReportLimit: data.directorReportLimit ? data.directorReportLimit : null ,
			planType: data.planType
		};

		return this.http.post(environment.server + "dg-featuresApi", obj, {
			observe: "response"
		});
	}

	updatePlan(data) {
		var hit = 0;
		var priceph = 0;

		if (data.show === false) {
			hit = 0;
			priceph = 0;
		} else if (data.show === true) {
			hit = data.hits;
			priceph = data.priceperhit;
		}
		// if (isPlatformBrowser(this.platformId)) {
		//   let dbid = this.authGuardService.userAuthorizationDetails.dbID;
		// }
		let obj = {
			name: data.name,
			features: data.features,
			description: data.description,
			status: 1,
			createdBy: this.userAuthService?.getUserInfo('dbID'),
			endDate: data.endDate,
			startDate: data.startDate,
			cost: data.cost,
			order: data.order,
			vat: 0,
			hits: hit,
			priceperhit: priceph,
			companyReport: data.companyReport ? data.companyReport : null,
			basicLimit: data.basicLimit ? data.basicLimit : null,
			advancedLimit: data.advancedLimit ? data.advancedLimit : null,
			landLimit: data.landLimit ? data.landLimit : null,
			corpLandLimit: data.corpLandLimit ? data.corpLandLimit : null,
			companyMonitorLimit: data.companyMonitorLimit ? data.companyMonitorLimit : null,
			directorMonitorLimit: data.directorMonitorLimit ? data.directorMonitorLimit : null,
			directorReportLimit : data.directorReportLimit ? data.directorReportLimit : null ,
			planType: data.planType
		};

		return this.http.post(environment.server + "/dg-featuresApi/" + data._id, obj, {
			observe: "response"
		});
	}


	deletePlans(planId: string) {
		return this.http.delete(environment.server + "/dg-featuresApi/" + planId, {
			observe: "response"
		});
	}
}


