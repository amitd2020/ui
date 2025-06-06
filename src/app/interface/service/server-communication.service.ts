import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, Observable } from "rxjs";

import { apiEndpoint } from "src/apiBus/apiEndpointServiceConstants";
import { apiRoute } from "src/apiBus/apiRouteConstants";
import { environment as env } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ServerCommunicationService {

    constructor(
        private httpClient: HttpClient
    ) {}

    getDataFromJSON( JSONFileName ): Observable<any> {  
        if ( localStorage.getItem('selectedGlobalCountry') != 'uk' ) {
            return this.httpClient.get<any>( `${ env.json }/${ JSONFileName }?from_index=ie` , { observe: 'body' } );
        } else {
            return this.httpClient.get<any>( `${ env.json }/${ JSONFileName }` , { observe: 'body' } );
        }    
    }

    /**
     * Global Server API Method Calling Using One Single Method Passing the required parameters including API Method Type
     * 
     * @param methodType The HTTP method - ( 'get' | 'post' | 'put' | 'delete' ).
     * @param route The API route.
     * @param endPoint API endpoint route.
     * @param params The HTTP options to send with the request.
     * @param responseType Response type.
     * @returns An `Observable` of the response, with a response body of type string.
     * 
     * this._globalServerCommunication.globalServerRequestCall( 'yourMethod', 'YOURroute', 'endPoint' ).subscribe({
            next: ( res ) => {
                console.log(res);
            },
            error: ( err ) => {
                console.log(err);
            }
        })
    */

    globalServerRequestCall( methodType: string, route: string, endPoint: string, params?: any, responseType?:string, queryParams?: Array<any> ): Observable<any> {
        
        let apiPath = `${ env.server }/${ apiRoute[ route ] }/${ apiEndpoint[ endPoint ] }`;
        let searchParams = new HttpParams();
        
        const selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry');

        if ( selectedGlobalCountry && selectedGlobalCountry !== 'uk' ) {
            searchParams = searchParams.append( 'from_index', selectedGlobalCountry );
        }

        if ( queryParams && queryParams.length ) {

            for ( let key of queryParams ) {
                searchParams = searchParams.append( key.key, key.value );
            }

        }

        if( [ 'post', 'put' ].includes( methodType ) ) {

            if ( searchParams.keys().length ) {
                return this.httpClient[ methodType ]( apiPath, params, { observe: "response", withCredentials: true, params: searchParams } );
            }
            
            return this.httpClient[ methodType ]( apiPath, params, { observe: "response", withCredentials: true } );
            
        } else {

            if( params ) {

                apiPath = `${ apiPath }/${ params.join('/') }`;

            } else {
                apiPath;
            }
            
            if( responseType ) {
                if( searchParams?.['updates']?.length ) {
                    return this.httpClient[ methodType ]( apiPath, {
                        responseType: 'blob' as 'json', params: searchParams, withCredentials: true 
                    } );
                } else {
                    return this.httpClient[ methodType ]( apiPath, {
                        responseType: 'blob' as 'json', withCredentials: true 
                    } );
                }
            } else {
                return this.httpClient[ methodType ]( apiPath, { observe: "response", withCredentials: true, params: searchParams } );
            }

        }

    }

    /**
     * Global Method for the limits of User
     * 
     * @returns Data of an User Limits
     */

	async getUserExportLimit() {
        const res = await firstValueFrom( this.globalServerRequestCall('get', 'DG_LIST', 'getUserExportLimit') );
		return res.body.results[0];
	}

    async dataUrlImage(requestBodyObj) {

        const res = await firstValueFrom( this.globalServerRequestCall( 'post', 'DG_CHART_API', 'barCharApi', requestBodyObj) );
        return res.body.Url;

    }

    getPublicSuggestions( obj ): Observable<any> {
        return this.httpClient.post( `${env.server}/dg-publicAPIs/get-company-name-suggestions-new`, obj, { headers: new HttpHeaders().set('authorization', '677fc4ffcaf39ea042d3b939_909620046')});
    }


    /**
     * Method to reduce the limit of user
     * 
     * @param obj User Id, Page Name and New limit after reduced
     * @returns A success data of reduced user limit
     */
    
	async reduceExportLimit(obj: { thisPage: any; newLimit: any; titleRegisterHit?: string; }) {
        const res = await this.globalServerRequestCall( 'post', 'DG_LIST', 'reduceExportLimit', obj ).toPromise();
        return res;
	}

    // getOverviewData(redirect_uri: string, companyId: string): Observable<any> {
    //     return this.httpClient.get<any>(
    //         `${env.server}/hs-extension/company-details?redirect_uri=${redirect_uri}&companyId=${companyId}`
    //     );
    // }

    // syncWithHubspot(redirect_uri: string, companyId: string, companyNumber: string): Observable<any> {
    //     return this.httpClient.get<any>(
    //         `${env.server}/hs-extension/company-update?redirect_uri=${redirect_uri}&companyId=${companyId}&company_number=${companyNumber}`
    //     );
    // }

    // getSicCode(): Observable<any> {
    //     return this.httpClient.post<any>(
    //         `${env.server}/dg-searchApi/getIndustries`,
    //         {}
    //     );
    // }

    // getDataFromAggregateByParam(payloadData: object): Observable<any> {
    //     return this.httpClient.post<any>(
    //         `${env.server}/dg-searchApi/getAggregateByParam`,
    //         payloadData
    //     );
    // }
  
    // getSearchData(payloadData: object): Observable<any> {
    //     return this.httpClient.post<any>(
    //         `${env.server}/hs-extension/search`,
    //         payloadData
    //     );
    // }
  
    // setImportData(payloadData: object): Observable<any> {
    //     return this.httpClient.post<any>(
    //         `${env.server}/hs-extension/pushToHubSpot`,
    //         payloadData
    //     );
    // }

    // getLatLong(latLongData: object): Observable<any> {
    //     return this.httpClient.post<any>(
    //         `${env.server}/dg-searchApi/getLatLong`, 
    //         latLongData
    //     );
    // }

    // formatCompanyNameForUrl(companyName) {
    //     let regexp = /[&\/\\#,+()$~%'":*?<>{}|]/g;
    //     let regexpspace = / /g;
    //     if (companyName) {
    //         companyName = companyName
    //             .replace(regexp, '')
    //             .replace(regexpspace, '-');
    //         return companyName;
    //     } else {
    //         return ' ';
    //     }
    //   }


}

