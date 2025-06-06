import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root',
})
export class GlobalServerComminicationService {
  constructor(private http: HttpClient) {}

  getSicCode(): Observable<any> {
      return this.http.get<any>(
          `${environment.server}/dg-searchApi/getIndustries`,
          {}
      );
  }

  getStatsSicCode(): Observable<any> {
      return this.http.post<any>(
          `${environment.server}/dg-searchApi/getIndustriesForStats`,
          {}
      );
  }

  getDataFromAggregateByParam(payloadData: object): Observable<any> {
      return this.http.post<any>(
          `${environment.server}/dg-searchApi/getAggregateByParam`,
          payloadData
      );
  }

  getSearchData(payloadData: object): Observable<any> {
      return this.http.post<any>(
          `${environment.server}/hs-extension/search`,
          payloadData
      );
  }

  setImportData(payloadData: object): Observable<any> {
      return this.http.post<any>(
          `${environment.server}/hs-extension/pushToHubSpot`,
          payloadData
      );
  }
  
  syncWithHubspot(redirect_uri: string, companyId: string, companyNumber: string): Observable<any> {
      return this.http.get<any>(
          `${environment.server}/hs-extension/company-update?redirect_uri=${redirect_uri}&companyId=${companyId}&company_number=${companyNumber}`
      );
  }

  getOverviewData(redirect_uri: string, companyId: string): Observable<any> {
      return this.http.get<any>(
          `${environment.server}/hs-extension/company-details?redirect_uri=${redirect_uri}&companyId=${companyId}`
      );
  }

  updateDetails(responseCode, companyId): Observable<any> {
    return this.http.get<any>(
        `https://preprodapi.datagardener.com/hs-extension/company-update?authResponseCode=${responseCode}&companyId=${companyId}&domain=datagardener.com`
    );
  }

  getLatLong(latLongData: object): Observable<any> {
    return this.http.post<any>(
        `${environment.server}/dg-searchApi/getLatLong`, 
        latLongData
    );
  }

  getUserExportLimit(): Observable<any> {
    return this.http.get<any>( `${environment.server}/dg-listApi/getUserExportLimit` );
}



//   generateToken(formData: object): Observable<any> {
//     let form = {
//         form: formData
//     }
//     return this.http.post<any>(
//         'https://api.hubapi.com/oauth/v1/token', 
//         form
//     );
//   }

  formatCompanyNameForUrl(companyName) {
    let regexp = /[&\/\\#,+()$~%'":*?<>{}|]/g;
    let regexpspace = / /g;
    if (companyName) {
        companyName = companyName
            .replace(regexp, '')
            .replace(regexpspace, '-');
        return companyName;
    } else {
        return ' ';
    }
  }
}
