import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { apiEndpoint } from 'src/apiBus/apiEndpointServiceConstants';
import { apiRoute } from 'src/apiBus/apiRouteConstants';

@Injectable()
export class ListServiceService {

	constructor(
		private http: HttpClient
	) { }
	
	exportAllExcel(obj, page?) {
		let countryCode = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';

		let endpoint = countryCode != 'uk' ? apiEndpoint.exportIreland  : obj?.sheetType == 'extended' ? apiEndpoint.exportExcelFileWithFetchEmail : apiEndpoint.exportExcelFile;
		
		if (  page == 'showContactScreen' ) {
			endpoint = countryCode != 'uk' ? apiEndpoint.contactsExportIr : apiEndpoint.contactsExport;
		}

		let apiRoutes = page == 'showContactScreen' ? apiRoute.contactScreenApi : obj?.sheetType == 'extended' ? apiRoute.apiWithFetchEmail  : apiRoute.api;
		
		
		if (environment.server == 'https://preprodapi.datagardener.com') {
			let url =  obj?.sheetType == 'extended' && page !== 'showContactScreen' ? apiRoute.preprod_exportsWithFetchMail : apiRoute.preprod_exports;
			return this.http.post<any>(url + "/" + apiRoutes + "/" + endpoint, obj)
			.toPromise()
			.then(res => res)
		} else if (environment.server == 'https://devapi.datagardener.com') {
			let url =  obj?.sheetType == 'extended' && page !== 'showContactScreen' ? apiRoute.dev_exportsWithFetchMail : apiRoute.dev_exports;
			return this.http.post<any>(url + "/" + apiRoutes + "/" + endpoint, obj)
			.toPromise()
			.then(res => res)
		} else if (environment.server == 'https://irapi.datagardener.com') {
			let url =  obj?.sheetType == 'extended' && page !== 'showContactScreen' ? apiRoute.preprod_exportsWithFetchMail : apiRoute.preprod_exports;
			return this.http.post<any>(url + "/" + apiRoutes + "/" + endpoint, obj)
			.toPromise()
			.then(res => res)
		} else {
			let url =  obj?.sheetType == 'extended' && page !== 'showContactScreen' ? apiRoute.live_exportsWithFetchMail : apiRoute.live_exports;
			return this.http.post<any>(url + "/" + apiRoutes + "/" + endpoint, obj)
			.toPromise()
			.then(res => res)
		}
	}

	getEsgIndex(reqObj: any) {
		return this.http.post<any>(`${environment.server}/${ apiRoute.DG_API }/${ apiEndpoint.getEsgIndexData }`, reqObj)
			.toPromise()
			.then(results => results)
	}

}