import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { latLongModel } from '../models/company-data-model';

import { apiEndpoint } from "src/apiBus/apiEndpointServiceConstants";
import { apiRoute } from "src/apiBus/apiRouteConstants";
import { catchError, firstValueFrom, lastValueFrom, map, takeUntil } from "rxjs";
import { SearchCompanyService } from "../view/features-modules/search-company/search-company.service";
import { ServerCommunicationService } from "./server-communication.service";
import { UserAuthService } from "../auth-guard/user-auth/user-auth.service";
import { UnsubscribeSubscription } from "./unsubscribe.abstract";
import { APIPathParamsType } from "../view/shared-components/filter-sidebar-refactored/filter-option-types";

@Injectable()
export class SearchFiltersService extends UnsubscribeSubscription {
	appliedFilters: any;
	isLoggedIn: boolean = false;
	selectedGlobalCountry: string = 'uk';
	postCodeMilesmsg: any

	constructor(
		private http: HttpClient,
		private userAuthService: UserAuthService,
		private searchCompanyService: SearchCompanyService,
		public serverCommmunicationService: ServerCommunicationService
	) {
		super();
		this.userAuthService.isLoggedInSubject$.pipe( takeUntil( this.unsubscribe$ ) ).subscribe( ( loggedIn: boolean ) => this.isLoggedIn = loggedIn );
		this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';
	}

	async getAllFilterProps( searchFilters, param, paramType, paramVal, page, inputPayloadObject? ) {
		
		// let savedfilter = searchFilters.map( ({chip_group}) => chip_group ).includes( 'Saved Lists' )
		// let idsavedListdata = searchFilters.map( ({saveListData}) => saveListData )[0]
		let response;


		if ( JSON.stringify( searchFilters ).includes("Post Code") || JSON.stringify( searchFilters ).includes("Trading Post Code") || JSON.stringify( searchFilters ).includes("landCoporateDetailsPostCode") ) {
					let tempPostCode = ''
					for ( let filter of searchFilters ) {
						for (let key in filter) {
							if (filter[key] == "Post Code" || filter[key] == "Trading Post Code" || filter[key] == "landCoporateDetailsPostCode") {
								if (typeof (filter['chip_values'][0]) == 'object') {
									filter['chip_values'][0] = filter['chip_values'][0][0]
								}
								if (parseInt(filter['chip_values'][0].split(" ")[2]) > 0) {
									tempPostCode = filter['chip_values'][0].split(" ")[0]
									let userLocation = {};
									userLocation = await this.getLatLong(tempPostCode).then(data => data)
									filter['chip_values'][0] = [filter['chip_values'][0]]
									filter['userLocation'] = userLocation
								}
							}
						}
					}
				// this.searchCompanyService.updatePayload( searchFilters );
		}
		
		if ( page == 'companySearch' || page == 'companyDetailsPage' || page == 'insightsSearch' || page == 'lendingLandscapePage'  || page == 'esgIndex' || page == 'investor-finder' ) {
			if ( paramType == 'SIC Codes' ) {

				let obj = {};
				if( this.selectedGlobalCountry == 'uk'){

					response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'getIndustries', obj ) )
					return response.body;

					// return response = await lastValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_API }/${ apiEndpoint.getIndustries }`, obj) );
				} else {
					obj['aggregateBy'] =  'sicCode07.SicNumber_1.keyword' ;
					obj['filterData'] = searchFilters;
					obj['userId'] = this.userAuthService?.getUserInfo('dbID')

					response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'searchApiAggregateByParam', obj ) )
					return response.body;
	
					// return response = await lastValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_API }/${ apiEndpoint.searchApiAggregateByParam }?from_index=ie`, obj) )
				}
				

			} else if ( paramType == 'Commodity Code' ) {

				// let obj = {};

				response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'commodityCode' ) )
				return response.body;

				// return response = await lastValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_API }/${ apiEndpoint.commodityCode }`, { withCredentials: true }) );

			} else {

				let obj = {};
				
				if ( searchFilters !== undefined && searchFilters.length > 0 ) {
					obj['filterData'] = searchFilters;
					// let searchData = await this.identifyLongitude( { filterData: searchFilters } ).then( val => val );
					// console.log(searchData)
					// obj['filterData'] = searchData
				}
				
				if ( Array.isArray(paramType) || paramType == 'Status' || paramType == 'Category' || paramType == 'Accounts Category' || paramType == 'createdMonth' || paramType == 'Person Positions' || paramType == 'Number of Employees' || paramType == 'Months' || paramType == 'Years' ) {

					obj['aggregateBy'] = param;
					obj['ethnicAddOn'] = ( this.userAuthService.hasAddOnPermission('ethnicDiversity') && this.userAuthService.hasAddOnPermission('femaleFounder') );

					// obj['listId'] = savedfilter && list == undefined ? this.activeRoute.snapshot.queryParams['cListId'] : (savedfilter && list)  ? list : idsavedListdata ,
					// obj['pageName'] = savedfilter && list == undefined ? this.activeRoute.snapshot.queryParams['listPageName'] :  (savedfilter && list)  ? 'companyListPage' : '',

					// obj['listId'] = idsavedListdata ? idsavedListdata : savedfilter && list == undefined ? this.activeRoute.snapshot.queryParams['cListId'] : savedfilter && list  ? list : '' ,
					// obj['pageName'] = idsavedListdata ? 'companyListPage' : savedfilter && list == undefined ? this.activeRoute.snapshot.queryParams['listPageName'] :  savedfilter && list  ? 'companyListPage' : '',
					obj['listId'] = inputPayloadObject ? inputPayloadObject?.listId : '';
					obj['pageName'] = inputPayloadObject ? inputPayloadObject?.pageName : '';
					obj['userId'] = this.userAuthService?.getUserInfo('dbID')

				} else if ( paramType == 'Industry' || paramType == 'Investment SicCode' || paramType == 'Investment Industry Tags' || paramType == 'Investor SicCode') {
					obj[param] = paramVal;
					obj['listId'] = inputPayloadObject ? inputPayloadObject?.listId : '';
					obj['pageName'] = inputPayloadObject ? inputPayloadObject?.pageName : '';

				} else {

					obj[param] = paramVal;
				}

				// return response = await lastValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_API }/${ apiEndpoint.searchApiAggregateByParam }`, obj) );
				if ( paramVal ==  "Company Age Filter" && this.selectedGlobalCountry !== 'uk' ) {
					obj['aggregateBy'] = "companyRegistrationDate"
				}
				response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'searchApiAggregateByParam', obj ) )
					.catch( ( err: HttpErrorResponse ) => {
						console.log( err );
						throw new Error( err.error.message );
					});

				return response.body;

			}
		}

		else if (page == 'landRegistry') {

			let obj = {};
			if (searchFilters !== undefined && searchFilters.length > 0) {
				obj['filterData'] = searchFilters;
			}

			if (Array.isArray(paramType)) {
				obj['aggregateBy'] = param;
			} else {
				obj[param] = paramVal;
			}

			// return response = await lastValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_LAND_REGISTRY }/${ apiEndpoint.searchApiAggregateByParam }`, obj) );
			
			response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_LAND_REGISTRY', 'searchApiAggregateByParam', obj) )
				return response.body;

		}

		else if (page == 'landCorporate' ) {
			let obj = {};
			if (searchFilters !== undefined && searchFilters.length > 0) {
				obj['filterData'] = searchFilters;
			}

			if (Array.isArray(paramType)) {
				obj['aggregateBy'] = param;
			} else {
				obj[param] = paramVal;
			}

			// return response = await lastValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_LAND_CORPORATE}/${ apiEndpoint.searchApiAggregateByParam }`, obj) );

			response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_LAND_CORPORATE', 'searchApiAggregateByParam', obj) )
				return response.body;
		}

		else if (['accountSearch', 'companyDescription', 'chargesDescription'].includes(page)  ) {
			let obj = {};
			if (searchFilters !== undefined && searchFilters.length > 0) {
				obj['filterData'] = searchFilters;
			}

			if (Array.isArray(paramType)) {
				obj['aggregateBy'] = param;
				obj['reqBy'] = page
			} else {
				obj[param] = paramVal;
			}

			if (paramType == 'SIC Codes') {
				let obj = {};
				// return response = await lastValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_API }/${ apiEndpoint.getIndustries }`, obj) );

				response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'getIndustries', obj) )
				return response.body;

			}

			// return response = await lastValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_API}/${ apiEndpoint.aggQueryForAccountSearch }`, obj) );

			response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'aggQueryForAccountSearch', obj) )
			return response.body;

			
		}

        else if (page == 'contractFinderPage') {
            let obj = {};
			if (searchFilters !== undefined && searchFilters.length > 0) {
				obj['filterData'] = searchFilters;
			}

			if (Array.isArray(paramType)) {
				obj['aggregateBy'] = param;
			} else {
				obj[param] = paramVal;
			}

			if (paramType == 'CPV Industry Code') {
				let obj = {};
				// return response = await lastValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_API }/${ apiEndpoint.getCpvCodes }`, obj) );

				response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'getCpvCodes', obj) )
				return response.body;

			}

            // return response = await lastValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_API}/${ apiEndpoint.getAggregateByParamContractFinder }`, obj) );

			response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'getAggregateByParamContractFinder', obj) )
			return response.body;
        }

        else if (page == 'buyersDashboard' || page == 'suppliersDashboard') {
			
            let obj = {};
			if (searchFilters !== undefined && searchFilters.length > 0) {
				obj['filterData'] = searchFilters;
			}

			if (Array.isArray(paramType)) {
				obj['aggregateBy'] = param;
			} else {
				obj[param] = paramVal;
			}

			if ( page == 'buyersDashboard' ) {

				if (paramType == 'Buyer CPV Industry Code') {
					let obj = {};

					response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'getCpvCodes', obj) )
					return response.body;
					// return response = await lastValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_API }/${ apiEndpoint.getCpvCodes }`, obj) )
	
				}
			} else if ( page == 'suppliersDashboard' ) {

				if (paramType == 'Supplier CPV Industry Code') {
					let obj = {};

					response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'getCpvCodes', obj) )
					return response.body;
					// return response = await lastValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_API }/${ apiEndpoint.getCpvCodes }`, obj) );
	
				}
			}

			// return response = await lastValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_API}/${ apiEndpoint.getAggregateByParamBuyerSupplier }`, obj) );
			response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'getAggregateByParamBuyerSupplier', obj) )
			return response.body;
        }
		
	}

	async getAggregateValues( apiPathParams: APIPathParamsType, inputAggrByKey: string, selectedFilterCriteria?: PayloadFormationObj, searchKeywordsReqStr?: string, pageName?: string ): Promise<any> {

		let requestBody: { [ key: string ]: unknown } = {
			aggregateBy: inputAggrByKey,
			userId: this.userAuthService.getUserInfo('dbID')
		};

		if ( selectedFilterCriteria ) {
			if ( selectedFilterCriteria?.filterData?.length ) {
				
				if ( pageName == 'buyersDashboard') {
					selectedFilterCriteria.filterData.map(obj => {
						if ( 'chip_industry_sic_codes' in obj ) {
						  obj['chip_industry_buyerCpv_codes'] = obj['chip_industry_sic_codes'];
						  delete obj['chip_industry_sic_codes'];
						}
					  });
				} else if ( pageName == 'suppliersDashboard') {
					selectedFilterCriteria.filterData.map(obj => {
						if ( 'chip_industry_sic_codes' in obj ) {
						  obj['chip_industry_supplierCpv_codes'] = obj['chip_industry_sic_codes'];
						  delete obj['chip_industry_sic_codes'];
						}
					  });
				} else if ( pageName == 'contractFinderPage') {
					selectedFilterCriteria.filterData.map(obj => {
						if ( 'chip_industry_sic_codes' in obj ) {
						  obj['chip_industry_cpv_codes'] = obj['chip_industry_sic_codes'];
						  delete obj['chip_industry_sic_codes'];
						}
					  });
				}

				requestBody = { ...requestBody, filterData: selectedFilterCriteria.filterData };
			}
			if ( selectedFilterCriteria?.listId ) {
				requestBody = {
					...requestBody,
					pageName: selectedFilterCriteria.pageName,
					listId: selectedFilterCriteria.listId
				};
			}
		}

		if ( searchKeywordsReqStr && searchKeywordsReqStr.length ) {
			requestBody = {
				...requestBody,
				searchKeyword: searchKeywordsReqStr.toLowerCase().trim()
			};
		}

		if ( apiPathParams?.reqBy ) {
			requestBody['reqBy'] = apiPathParams.reqBy;
		}

		if ( apiPathParams?.aggRequest ) {
			requestBody['aggRequest'] = apiPathParams.aggRequest;
		}

		const AggregateAPIResponse = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', apiPathParams.route, apiPathParams.endpoint, requestBody )
			.pipe(
				map( ( aggrResponse ) => {
					const { code, distinct_year, distinct_categories } = aggrResponse?.body;

					if ( code && code === 404 ) {
						throw new Error( 'Something went wrong.' );
					}

					if ( distinct_year?.distinct_categories?.buckets ) {
						return distinct_year?.distinct_categories?.buckets;
					}
					
					if ( distinct_categories?.buckets ) {
						return distinct_categories?.buckets;
					}

				}),
				catchError( ( err: HttpErrorResponse ) => {
					console.log( err.message );
					throw new Error( err.message );
				})
			)
		);

		return AggregateAPIResponse;
		
	}

	async getAggregateIndustryCodeValues( apiPathParams: APIPathParamsType ): Promise<any> {

		const AggregateAPIResponse = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'get', apiPathParams.route, apiPathParams.endpoint )
			.pipe(
				map( ( aggrResponse ) => aggrResponse?.body?.result ),
				catchError( ( err: HttpErrorResponse ) => {
					console.log( err.message );
					throw new Error( err.message );
				})
			)
		);

		return AggregateAPIResponse;
		
	}

	async getAllFilterPropsHNWI( searchFilters, param, paramType, paramVal, page ) {

		let response;

		if ( page == 'companySearch' ) {

			let obj = {};
			if ( searchFilters !== undefined && searchFilters.length > 0 ) {
				obj['filterData'] = searchFilters;
			}

			obj[param] = paramVal;

			response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'searchApiAggregateByParamHNWI', obj) )
			return response.body;

			// return response = await lastValueFrom(this.http.post<any>(`${environment.server}/${apiRoute.DG_API}/${apiEndpoint.searchApiAggregateByParamHNWI}`, obj));

		}

	}

	async getKeywordsPersonEntitled(aggregateBy, chip_group, chip_value, page, appliedFilters) {

		if ( [ 'companySearch', 'lendingLandscapePage' ].includes( page ) ) {

			let obj = {};

			obj['aggregateBy'] = aggregateBy;
			if (appliedFilters !== undefined) {
				appliedFilters.push(
				{ 
					chip_group: "Status",
					chip_values: ["live"] 
				},
				{
				chip_group: chip_group,
				chip_values: chip_value
				});
			} else {
				appliedFilters = [
				{
					chip_group: chip_group,
					chip_values: chip_value
				}
			];
			}
			obj['filterData'] = appliedFilters
			if( this.selectedGlobalCountry == 'uk' ){
				const result = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'aggregateByParamChargesPersonEntitled', obj) )
				return result.body;
				// const result = await firstValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_API }/${ apiEndpoint.aggregateByParamChargesPersonEntitled }`, obj) );
				// return result;

			} else if( this.selectedGlobalCountry != 'uk' ){
				const result = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'aggregateByParamChargesPersonEntitled', obj) )
				return result.body;
				// const result = await firstValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_API }/${ apiEndpoint.aggregateByParamChargesPersonEntitled }?from_index=ie`, obj) );
				// return result;
			}


			// return this.http.post<any>(`${environment.server}/${ apiRoute.DG_API }/${ apiEndpoint.aggregateByParamChargesPersonEntitled }`, obj)
			// 	.toPromise()
			// 	.then(res => res);

		}

		return '';

	}

	async getKeywordsPostTown(aggregateBy, chip_group, chip_value, page, appliedFilters) {

		let response;
		if (page == 'companySearch') {

			let obj = {};
			obj['aggregateBy'] = aggregateBy;
			if (appliedFilters !== undefined) {
				appliedFilters.push({
					chip_group: chip_group,
					chip_values: chip_value
				})
			} else {
				appliedFilters = [{
					chip_group: chip_group,
					chip_values: chip_value
				}];
			}
			obj['filterData'] = appliedFilters

			response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'searchApiAggregateByParam', obj) )
			return response.body;
			// return response = await lastValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_API }/${ apiEndpoint.searchApiAggregateByParam }`, obj) )

		}

	}

	async getKeywordsPostCode(aggregateBy, chip_group, chip_value, page, appliedFilters, filterSearchArray?: any[] ) {

		let response;

		if (appliedFilters !== undefined) {

			appliedFilters.push({
				chip_group: chip_group,
				chip_values: chip_value
			})
		} else {
			appliedFilters = [{
				chip_group: chip_group,
				chip_values: chip_value
			}];
		}

		if ( [ 'companySearch'].includes( page ) ) {
			let obj = {};
			obj['aggregateBy'] = aggregateBy;
			obj['filterData'] = appliedFilters;
			obj['filterSearchArray'] = filterSearchArray
			response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'searchApiAggregateByParam', obj) )
			return response.body;
			// return response = await lastValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_API }/${ apiEndpoint.searchApiAggregateByParam }`, obj) )
			
		} else if ( [ 'accountSearch', 'companyDescription', 'chargesDescription' ].includes( page ) ) {
			let obj = {};
			obj['aggregateBy'] = aggregateBy;
			obj['filterData'] = appliedFilters;
			obj['filterSearchArray'] = filterSearchArray

			response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'aggQueryForAccountSearch', obj) )
			return response.body;
			// return response = await lastValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_API }/${ apiEndpoint.aggQueryForAccountSearch }`, obj) )
			
		} else if (page == 'landRegistry') {
			let obj = {}
			obj['aggregateBy'] = "postcode";
			obj['filterData'] = appliedFilters

			response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_LAND_REGISTRY', 'searchApiAggregateByParam', obj) )
			return response.body;
			// return response = await lastValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_LAND_REGISTRY }/${ apiEndpoint.searchApiAggregateByParam }`, obj) )

		} else if (page === "landCorporate") {
			let obj = {}
			obj['aggregateBy'] = "Postcode.keyword";
			obj['filterData'] = appliedFilters
			
			response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_LAND_CORPORATE', 'searchApiAggregateByParam', obj) )
			return response.body;
			// return response = await lastValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_LAND_CORPORATE}/${ apiEndpoint.searchApiAggregateByParam }`, obj) )
		}

	}

	// async identifyLongitude( params ){

	// 	if ( JSON.stringify( params.filterData ).includes("Post Code") || JSON.stringify( params.filterData ).includes("Trading Post Code") || JSON.stringify( params.filterData ).includes("landCoporateDetailsPostCode") ) {
	// 		let tempPostCode = ''
	// 		for ( let filter of params.filterData ) {
	// 			for (let key in filter) {
	// 				if (filter[key] == "Post Code" || filter[key] == "Trading Post Code" || filter[key] == "landCoporateDetailsPostCode") {
	// 					if (typeof (filter['chip_values'][0]) == 'object') {
	// 						filter['chip_values'][0] = filter['chip_values'][0][0]
	// 					}
	// 					if (parseInt(filter['chip_values'][0].split(" ")[2]) > 0) {
	// 						tempPostCode = filter['chip_values'][0].split(" ")[0]
	// 						let userLocation = {};
	// 						userLocation = await this.getLatLong(tempPostCode).then(data => data)
	// 						filter['chip_values'][0] = [filter['chip_values'][0]]
	// 						filter['userLocation'] = userLocation
	// 					}
	// 				}
	// 			}
	// 		}
	// 		this.searchCompanyService.updatePayload( params );
	// 	}
	// 	return params.filterData

	// }

	async getFilteredResults( params, dissolvedIndex?: boolean ) {

		if ( JSON.stringify( params.filterData ).includes("Post Code") || JSON.stringify( params.filterData ).includes("Trading Post Code") || JSON.stringify( params.filterData ).includes("landCoporateDetailsPostCode") ) {
			let tempPostCode = '', userLocation = {};

			for ( let filter of params.filterData ) {
				for (let key in filter) {
					if (filter[key] == "Post Code" || filter[key] == "Trading Post Code" || filter[key] == "landCoporateDetailsPostCode") {
						if (typeof (filter['chip_values'][0]) == 'object') {
							filter['chip_values'][0] = filter['chip_values'][0][0]
						}
						if (parseInt(filter['chip_values'][0].split(" ")[2]) > 0) {
							tempPostCode = filter['chip_values'][0].split(" ")[0]
							userLocation = await this.getLatLong(tempPostCode).then(data => data)
							filter['chip_values'][0] = [filter['chip_values'][0]]
							filter['userLocation'] = userLocation
						}
					}
				}
			}

			if ( !userLocation ) {
				return( { status: 201, msg: this.postCodeMilesmsg  } );
			}

			this.searchCompanyService.updatePayload( params );
		}

		let obj = params;

		obj['dissolvedIndex'] = dissolvedIndex;
		if( !params?.requestFor){
			obj['requestFor'] = this.searchCompanyService.getView();
		}
		
		let response;
		
		if ( this.isLoggedIn ) {
			
			// obj['fullySatisfiedYear'] = this.userAuthService?.getUserInfo('dbID');
			obj['userId'] = this.userAuthService?.getUserInfo('dbID');

			if( this.searchCompanyService.getView() == 'chargesDashboard') {

				response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'getChargesDashboard', obj ) )
								.catch( ( err: HttpErrorResponse ) => {
									console.log( err );
									throw new Error( err.error.message );
								});
	
				return response.body;

			} else {
				response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'searchResults', obj ) )
								.catch( ( err: HttpErrorResponse ) => {
									console.log( err );
									throw new Error( err.error.message );
								});
	
				return response.body;

			}

		} else {
			obj['pageSize'] = 10;

			response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'searchResultsPublic', obj ) )
							.catch( err => console.log( err ) );

			return response.body;
		}

	}

	async getLandRegFilteredResultsPublic(params, sortOn?: any[]) {
		let obj = {
			'filterData': params,
			'sortOn': sortOn ? sortOn : []
		}
		const response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_LAND_REGISTRY', 'getLandSearchResultsPublic', obj) )
		return response.body;
	}

	async getCorporateLandFilteredResultsPublic(params, sortOn?: any[]) {

		let obj = {
			'filterData': params,
			'sortOn': sortOn ? sortOn : [],
			userId: this.userAuthService?.getUserInfo('dbID')
		}
		const response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_LAND_CORPORATE', 'getLandCorporateSearchResultsPublic', obj) )
		return response.body;

	}

	async getLatLong(tempPostCode: string) {

		let obj = {
			'postcode': tempPostCode
		}

		const response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'latLong', obj) )
		if( response.body['status'] == 201 ){
			this.postCodeMilesmsg = response.body['message']
			return;
		} else {
			return response.body['results'];
		}

	}

	// Charges List
	async getListOfCompaniesForAblCharges( listId, pageSize?: number, startAfter?: number, filterSearchArray?: any[], sortOn?: any[] ) {
		let obj = {
			'listId': listId,
			'pageSize': pageSize ? pageSize : 25,
			'pageNumber': startAfter ? startAfter : 1,
			'filterSearchArray': filterSearchArray ? filterSearchArray : [],
			'sortOn': sortOn ? sortOn : []
		}
		
		// const response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'companiesByListId', obj,{ observe: "response" }) )
		// return response.body;
		const response = await lastValueFrom( this.http.post(`${environment.server}/${ apiRoute.DG_API }/${ apiEndpoint.companiesByListId }`, obj,
		{ observe: "response" }) );

		return response;

	}
	// Get Director Search Details / View Director

	async getDirectorFilteredResults( params, dissolvedIndex?: boolean ) {

		let obj = params;

		obj['dissolvedIndex'] = dissolvedIndex;

		if ( this.selectedGlobalCountry == 'uk'){
			const response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'directorSearchResults', obj) )
			return response.body;

			// const response = await lastValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_API }/${ apiEndpoint.directorSearchResults }`, obj,{ withCredentials: true}) );
			// return response;
		} else {

			const response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'directorSearchResults', obj) )
			return response.body;

			// const response = await lastValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_API }/${ apiEndpoint.directorSearchResults }?from_index=ie`, obj) );
			// return response;
		}
	}
	
	// For Email Screen Details Page / View Email

	async getContactInformationFilteredResults( params, dissolvedIndex?: boolean ) {

		// let obj = {
		// 	'filterData': params,
		// 	'pageSize': pageSize ? pageSize : 25,
		// 	'startAfter': startAfter ? startAfter : 0,
		// 	'sortOn': sortOn ? sortOn : [],
		// 	'filterSearchArray': filterSearchArray ? filterSearchArray : [],
		// 	dissolvedIndex: dissolvedIndex ? dissolvedIndex : false,
		// 	'startPlan': startPlan ? startPlan : false
		// }

		let obj = params;

		obj['dissolvedIndex'] = dissolvedIndex;

		const response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'contactInformationResults', obj) )
		return response.body;

		// const response = await lastValueFrom( this.http.post<any>(`${ environment.server }/${ apiRoute.DG_API }/${ apiEndpoint.contactInformationResults }`, obj) );
		
		// return response;

	}

	async getStatsAggregation(params, dissolvedIndex?: boolean, startPlan?: boolean, pageSize?: number, startAfter?: number, sortOn?: any[], filterSearchArray?: any[], statsAggregation?: number) {

		let response;

		if ( this.isLoggedIn ) {

			let obj = {
				'filterData': params,
				'pageSize': pageSize ? pageSize : 25,
				'startAfter': startAfter ? startAfter : 0,
				'sortOn': sortOn ? sortOn : [],
				'filterSearchArray': filterSearchArray ? filterSearchArray : [],
				dissolvedIndex: dissolvedIndex ? dissolvedIndex : false,
				'startPlan': startPlan ? startPlan : false,
				'statsAggregation': statsAggregation ? statsAggregation : true
			}
			
			const response = await lastValueFrom( this.serverCommmunicationService.globalServerRequestCall( 'post', 'DG_API', 'statsAggregation', obj) )
			return response.body;
			// response = await lastValueFrom( this.http.post<any>(`${environment.server}/${ apiRoute.DG_API }/${ apiEndpoint.statsAggregation }`, obj) );
			
		}

		// return response;
	}

	async getContactsCountResult(params, dissolvedIndex?: boolean) {
		if (JSON.stringify(params.filterData).includes("Post Code") || JSON.stringify(params.filterData).includes("Trading Post Code") || JSON.stringify(params.filterData).includes("landCoporateDetailsPostCode")) {
			let tempPostCode = '', userLocation = {};
			for (let filter of params.filterData) {
				for (let key in filter) {
					if (filter[key] == "Post Code" || filter[key] == "Trading Post Code" || filter[key] == "landCoporateDetailsPostCode") {
						if (typeof (filter['chip_values'][0]) == 'object') {
							filter['chip_values'][0] = filter['chip_values'][0][0]
						}
						if (parseInt(filter['chip_values'][0].split(" ")[2]) > 0) {
							tempPostCode = filter['chip_values'][0].split(" ")[0]
							userLocation = await this.getLatLong(tempPostCode).then(data => data)
							filter['chip_values'][0] = [filter['chip_values'][0]]
							filter['userLocation'] = userLocation
						}
					}
				}
			}
			if( !userLocation ) {
				return;
			}
			this.searchCompanyService.updatePayload(params);
		}

		let obj = params;

		obj['dissolvedIndex'] = dissolvedIndex;
		obj['requestFor'] = this.searchCompanyService.getView();

		let response;

		if ( this.isLoggedIn && this.selectedGlobalCountry == 'uk' ) {

			obj['userId'] = this.userAuthService?.getUserInfo('dbID');

			response = await lastValueFrom(this.serverCommmunicationService.globalServerRequestCall('post', 'DG_API', 'searchContactsCountResult', obj))
				.catch((err: HttpErrorResponse) => {
					console.log(err);
					throw new Error(err.error.message);
				});
			return response.body;
		}
	}
}