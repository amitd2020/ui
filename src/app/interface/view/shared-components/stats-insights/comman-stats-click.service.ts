import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ListPageName } from '../../features-modules/search-company/search-company.constant'

@Injectable({
  providedIn: 'root'
})
export class CommanStatsClickService {
  constructor(
    private router: Router
  ) { }

  goToSearchForMisc( miscName, miscValue?, inputCountValue?, queryParamChipData?, listId?, inputPageName?, listName? ) {

		let statsButtonVisible = true;
		if ( inputCountValue && inputCountValue == 0 ) {
			return;
		}
		
		let chipGroupName, preferenceObj, navigateUrlParamObject = [], checkStatusCriteria;

		if ( queryParamChipData && queryParamChipData.length ) {
			navigateUrlParamObject = JSON.parse( JSON.stringify(queryParamChipData) )
		}

		if ( queryParamChipData && queryParamChipData.length ) {
			navigateUrlParamObject = JSON.parse( JSON.stringify(queryParamChipData) );
			checkStatusCriteria = navigateUrlParamObject.filter( ({chip_group}) => chip_group == 'Status' ).length;
		}

		// navigateUrlParamObject = navigateUrlParamObject.filter( ({chip_group}) => chip_group != 'Status' );

		if ( queryParamChipData && queryParamChipData.length ) {

			if ( ( JSON.parse( JSON.stringify(queryParamChipData) ).filter( ( { chip_group } ) => chip_group == 'Saved Lists' ).length == 0 ) && !checkStatusCriteria ) {
				
				navigateUrlParamObject.unshift({
					chip_group: 'Status',
					chip_values: ['live']
				});
	
			}
		} else {
			if ( !listId ) {
				navigateUrlParamObject.unshift({
					chip_group: 'Status',
					chip_values: ['live']
				});
			}
		}
		
		

			// if(this.pageName || this.activeRoute.snapshot.queryParams['cListId']) {
			// 	navigateUrlParamObject = [{
			// 		"chip_group": "Status",
			// 		"chip_values": ["live"]
			// 	}]
			// } else {
			// 	navigateUrlParamObject = JSON.parse( this.activeRoute.snapshot.queryParams['chipData'] )
			// }
		
		if (miscName == 'Companies With Patent') { 
			chipGroupName = "company must have companies with patent";
			preferenceObj = { "hasPatentData": "true" };
		}

		if (miscName == 'Companies with Grants') { 
			chipGroupName = "company must have companies with grants";
			preferenceObj = { "hasInnovateData": "true" };
		}

		if (miscName == 'Environment Agency Registered') { 
			chipGroupName = "Company must have ecs data";
			preferenceObj = { "hasEcsData": "true" };
		}

		if (miscName == 'Company With Charges') { 
			chipGroupName = "Company must have charges details";
			preferenceObj = { "hasCharges": "true" };
		}

		if (miscName == 'Companies with Shareholdings') { 
			chipGroupName = "Company must have shareholdings";
			preferenceObj = { "hasShareholdings": "true" };
		}

		if (miscName == 'Write-offs') { 
			chipGroupName = "Company must have write-offs";
			preferenceObj = { "isDebtor": "true" };
		}

		if (miscName == 'Companies Land Ownerships') { 
			chipGroupName = "Company must have corporate land";
			preferenceObj = { "hasLandCorporate": "true" };
		}

		if (miscName == "All CCJ's") { 
			chipGroupName = "Company must have CCJ";
			preferenceObj = { "hasCCJInfo": "true" };
		}

		if (miscName == 'All Ethnic Minorities') { 
			chipGroupName = "Company must be ethnic minorities";
			preferenceObj = { "is_ethnic_ownership": 'true' };
		}

		if (miscName == 'Female Owned') { 
			chipGroupName = "Company must be owned by Female";
			preferenceObj = { "companyFoundedByFemale": 'true' };
		}

		if ( miscName == 'Bands' ) {
			let selectedBand = miscValue.target.children[0].innerText.toLowerCase();

			navigateUrlParamObject = navigateUrlParamObject.filter( val => val.chip_group !== 'Bands' );
			
			if ( [ selectedBand ].includes( 'not specified' ) ){
				statsButtonVisible = false;
			}
			selectedBand = selectedBand == 'not scored / very high risk' ? 'not scored': selectedBand;
			let filterData = { chip_group: miscName, chip_values: [selectedBand] };
			navigateUrlParamObject.push(filterData);
		}

		if ( miscName == 'Director Gender' ) {
			let filterData = { chip_group: miscName, chip_values: [miscValue] };
			navigateUrlParamObject.push(filterData);
		}
		if ( miscName == "New CCJ's" ) {

			let findCcjChipGroup = queryParamChipData.filter(obj=> obj.chip_group == 'CCJ Status');

			if(!findCcjChipGroup.length){
				navigateUrlParamObject.push({ chip_group: 'CCJ Status', chip_values: ['new judgment'] });
			} else {
				queryParamChipData.filter(obj=> {
					if (obj.chip_group == 'CCJ Status') {
						obj.chip_values.includes('new judgment') ? obj.chip_values : obj.chip_values.push('new judgment');
					}
				} )

			}
		}	

		if (  miscName == 'Not Specified' ) {
			statsButtonVisible = false;
			let filterData = { chip_group: "Preferences", chip_values: ['not specified'], preferenceOperator: [ { otherMis: 'not specified' } ] };
			navigateUrlParamObject.push(filterData);
		}

		if ( chipGroupName && preferenceObj ) {

			if ( JSON.stringify(navigateUrlParamObject).includes('Preferences') ) {
				
				for (let data of navigateUrlParamObject) {
					if (data.chip_group == 'Preferences') {
						let tempChipArray = chipGroupName.split(" ")
						let tempChipVal = tempChipArray[tempChipArray.length - 2] + " " + tempChipArray[tempChipArray.length - 1]
					
						data.chip_values.forEach((chipData, chipDataIndex) => {
							if (chipData.includes(tempChipVal)) {
								data.chip_values.splice(chipDataIndex, 1);
							}
						});
	
						data.preferenceOperator.forEach((chipData, chipDataIndex) => {
							let preferenceObjKey = Object.keys(preferenceObj)[0]
							if (chipData.hasOwnProperty(preferenceObjKey)) {
								data.preferenceOperator.splice(chipDataIndex, 1);
							}
						});
						
						data.chip_values.push(chipGroupName);
						data.preferenceOperator.push(preferenceObj);
					} 	
					
				}

			} else {

				let filterData = { chip_group: "Preferences", chip_values: [chipGroupName], preferenceOperator: [preferenceObj] };
				navigateUrlParamObject.push(filterData);

			}

		}

		let urlStr: string;
		
		urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(navigateUrlParamObject), cListId: listId, listPageName: inputPageName, hideStatsButton: statsButtonVisible, listName: listName } }));

		window.open( urlStr, '_blank' );

	}

  goToCompanySearchBymsme( selectedChipValue, queryParamChipData?, listId?, inputPageName?, listName? ) {

		let navigateUrlParamObject = [], checkStatusCriteria;
		let statsButtonVisible = true;

		if ( [ selectedChipValue ].includes( 'unknown' ) ) {
			statsButtonVisible = false;
		}

		if ( queryParamChipData && queryParamChipData.length ) {
			navigateUrlParamObject = JSON.parse( JSON.stringify(queryParamChipData) );
			checkStatusCriteria = navigateUrlParamObject.filter( ({chip_group}) => chip_group == 'Status' ).length;
		}

		if ( queryParamChipData && queryParamChipData.length ) {
			if ( ( JSON.parse( JSON.stringify(queryParamChipData) ).filter( ( { chip_group } ) => chip_group == 'Saved Lists' ).length == 0 ) && !checkStatusCriteria ) {
				
				navigateUrlParamObject.unshift({
					chip_group: 'Status',
					chip_values: ['live']
				});
	
			}
		} else {
				
			navigateUrlParamObject.unshift({
				chip_group: 'Status',
				chip_values: ['live']
			});

		}

		navigateUrlParamObject = navigateUrlParamObject.filter( val => val.chip_group != 'MSME Classification' );
		
		navigateUrlParamObject.push({
			chip_group: 'MSME Classification',
			chip_values: [ selectedChipValue ],
			filter_exclude: false
		});

		let urlStr: string;
		
		urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(navigateUrlParamObject), cListId: listId, listPageName: inputPageName, hideStatsButton: statsButtonVisible, listName: listName } }));

		window.open( urlStr, '_blank' );

	}

  gotToSearchPage( chipDataValueTo, chipDataValueFrom, growthKey, from, label, queryParamChipData?, listId?, inputPageName?, listName?, checkEstimatedTurnover? ) {
    

		let statsButtonVisible = true;
		let financialObj = { 
			Array: 'Key Financials', 
			Growth3YearsInfo: '3 Years Growth', 
			Growth5YearsInfo: '5 Years Growth', 
			Growth1YearInfo: '1 Year Growth', 
		};
		from = financialObj.hasOwnProperty( from ) ? financialObj[from] : from;
		if ( [ '5 Years Growth', '3 Years Growth', '1 Year Growth' ].includes( from ) ) {
			if ( growthKey == 'numberOfEmployees' ) {
				growthKey = 'noOfEmployees'
			}
			growthKey = growthKey.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
		}

		if ( [ chipDataValueTo, chipDataValueFrom ].includes( 'not specified' ) ) {
			statsButtonVisible = false;
		}
		
		let navigateUrlParamObject = [], checkStatusCriteria;

		if ( queryParamChipData && queryParamChipData.length ) {
			navigateUrlParamObject = JSON.parse( JSON.stringify( queryParamChipData ) );
			checkStatusCriteria = navigateUrlParamObject.filter( ( val ) => val.chip_group == 'Status' ).length;
		}

		if ( queryParamChipData && queryParamChipData.length ) {
			
			if ( ( JSON.parse( JSON.stringify( queryParamChipData ) ).filter( ( { chip_group } ) => chip_group == 'Saved Lists' ).length == 0 ) && !checkStatusCriteria ) {
				
				navigateUrlParamObject.unshift({
					chip_group: 'Status',
					chip_values: ['live']
				});
	
			}
		} else {
				
			navigateUrlParamObject.unshift({
				chip_group: 'Status',
				chip_values: ['live']
			});

		}

		let outputValuesObjectStore = {
			Key_Financials: {
				chip_group: from,
				chip_values: [{
					key: growthKey,
					greater_than: chipDataValueTo ? chipDataValueTo : undefined,
					less_than: chipDataValueFrom ? chipDataValueFrom : undefined,
					financialBoolean: true,
					selected_year: "true"
				}]
			},
			Years_Growth: {
				chip_group: from,
				chip_values: [{
					key: growthKey,
					greater_than: chipDataValueTo ? chipDataValueTo : undefined,
					less_than: chipDataValueFrom ? chipDataValueFrom : undefined,
					suffix: '%'
				}]
			},
			Number_of_Employees: {
				chip_group: from,
				chip_values: chipDataValueFrom == 'not specified' ? [[ chipDataValueFrom ]] : [[ +chipDataValueTo, +chipDataValueFrom ]],
			},
			Company_Age_Filter: {
				chip_group: from,
				chip_values: chipDataValueTo == 'not specified' ? [[ chipDataValueTo ]] : [[ +chipDataValueTo, +chipDataValueFrom ]] ,
				label: label
			}
		};

		let storeKey = from.replace(/[0-9]\s/g, '').replace(/\s/g, '_');

		storeKey = +from[0] <= 1 ? storeKey.replace('Year', 'Years') : storeKey;

		if ( from == 'Key Financials' && checkEstimatedTurnover && growthKey == 'turnover' ) {
			outputValuesObjectStore[ storeKey ].chip_values.push({
				...outputValuesObjectStore[ storeKey ].chip_values[0],
				key: 'estimated_turnover'
			});
		}

		let checkbool = navigateUrlParamObject.map( val => val.chip_group).includes( from );

		if ( checkbool ) {
			
			navigateUrlParamObject.map( val => {

				if ( val.chip_group == from && from == 'Key Financials' ) {
					val.chip_values = outputValuesObjectStore[ storeKey ].chip_values;
				}
				
				if ( val.chip_group == from && val.chip_group !== 'Key Financials' ) {
					// val.chip_values.push( outputValuesObjectStore[ storeKey ].chip_values[0] );
					val.chip_values = ( outputValuesObjectStore[ storeKey ].chip_values );
				}
				
				return val;
			})

		} else {

			navigateUrlParamObject.push( outputValuesObjectStore[ storeKey ] );

		}

		let urlStr: string;

		urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(navigateUrlParamObject), cListId: listId, listPageName: inputPageName, hideStatsButton: statsButtonVisible, listName: listName } }));

		window.open( urlStr, '_blank' );

	}

  goToSearchForIndustry( industryName, industryValue, industryCode, queryParamChipData, listId, inputPageName, listName, selectedGlobalCountry ) {

		let statsButtonVisible = true;

		if ( [ industryValue ].includes( 'not specified' ) ) {
			statsButtonVisible = false;
		}

		let navigateUrlParamObject = [], checkStatusCriteria;

		if ( queryParamChipData && queryParamChipData.length ) {
			navigateUrlParamObject = JSON.parse( JSON.stringify(queryParamChipData) );
			checkStatusCriteria = navigateUrlParamObject.filter( ({chip_group}) => chip_group == 'Status' ).length;
		}
		// navigateUrlParamObject = navigateUrlParamObject.filter( ({chip_group}) => chip_group != 'Status' );

		if ( queryParamChipData && queryParamChipData.length ) {
			if ( ( JSON.parse( JSON.stringify(queryParamChipData) ).filter( ( { chip_group } ) => chip_group == 'Saved Lists' ).length == 0 ) && !checkStatusCriteria ) {
				
				navigateUrlParamObject.unshift({
					chip_group: 'Status',
					chip_values: ['live']
				});
	
			}
		} else {
				
			navigateUrlParamObject.unshift({
				chip_group: 'Status',
				chip_values: ['live']
			});

		}

		navigateUrlParamObject = navigateUrlParamObject.filter( val => val.chip_group !== 'SIC Codes' );

		navigateUrlParamObject.push(
			{
				chip_group: "SIC Codes",
				chip_values: selectedGlobalCountry == 'uk' ? [ industryName ] : [ `${ industryCode } - ${ industryValue }` ],
				chip_industry_sic_codes: selectedGlobalCountry == 'uk' ? [ industryValue ] : [ industryCode ],
			}
		);

		let urlStr: string;
		
		urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(navigateUrlParamObject), cListId: listId, listPageName: inputPageName, hideStatsButton: statsButtonVisible, listName: listName } }));

		window.open( urlStr, '_blank' );

	}

  goToSearchForIndustryTag( industryName, industryValue, queryParamChipData, listId?, inputPageName?, listName? ) {

		
		let statsButtonVisible = true;

		if ( [ industryValue ].includes( 'not specified' ) ) {
			statsButtonVisible = false;
		}

		let navigateUrlParamObject = [], checkStatusCriteria;

		if ( queryParamChipData && queryParamChipData.length ) {
			navigateUrlParamObject = JSON.parse( JSON.stringify(queryParamChipData) );
			checkStatusCriteria = navigateUrlParamObject.filter( ({chip_group}) => chip_group == 'Status' ).length;
		}
		// navigateUrlParamObject = navigateUrlParamObject.filter( ({chip_group}) => chip_group != 'Status' );

		if ( queryParamChipData && queryParamChipData.length ) {
			if ( ( JSON.parse( JSON.stringify(queryParamChipData) ).filter( ( { chip_group } ) => chip_group == 'Saved Lists' ).length == 0 ) && !checkStatusCriteria ) {
				
				navigateUrlParamObject.unshift({
					chip_group: 'Status',
					chip_values: ['live']
				});
	
			}
		} else {
				
			navigateUrlParamObject.unshift({
				chip_group: 'Status',
				chip_values: ['live']
			});

		}

		navigateUrlParamObject = navigateUrlParamObject.filter( val => val.chip_group != 'Industry' );
		
		navigateUrlParamObject.push({
			chip_group: 'Industry Tags',
			chip_values: [ industryName ],
			filter_exclude: false
		});

		let urlStr: string;
		
		urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(navigateUrlParamObject), cListId: listId, listPageName: inputPageName, hideStatsButton: statsButtonVisible, listName: listName } }));

		window.open( urlStr, '_blank' );
	}

	getOutputPage( inputPageName: string ) {
		let outputPageName = ''
		switch ( inputPageName.toLowerCase() ) {
			case ListPageName.company.inputPage.toLowerCase():
				outputPageName = ListPageName.company.outputPage;
				break;
			case ListPageName.charges.inputPage.toLowerCase():
				outputPageName = ListPageName.charges.outputPage;
				break;
			case ListPageName.trade.inputPage.toLowerCase():
				outputPageName = ListPageName.trade.outputPage;
				break;
			case ListPageName.diversityInclusion.inputPage.toLowerCase():
				outputPageName = ListPageName.diversityInclusion.outputPage;
				break;
			case ListPageName.businessMonitor.inputPage.toLowerCase():
				outputPageName = ListPageName.businessMonitor.outputPage;
				break;
			case ListPageName.businessMonitorPlus.inputPage.toLowerCase():
				outputPageName = ListPageName.businessMonitorPlus.outputPage;
				break;
			case ListPageName.businessWatch.inputPage.toLowerCase():
				outputPageName = ListPageName.businessWatch.outputPage;
				break;
			case ListPageName.company.outputPage.toLowerCase():
				outputPageName = ListPageName.company.outputPage;
				break;
			case ListPageName.charges.outputPage.toLowerCase():
				outputPageName = ListPageName.charges.outputPage;
				break;
			case ListPageName.trade.outputPage.toLowerCase():
				outputPageName = ListPageName.trade.outputPage;
				break;
			case ListPageName.diversityInclusion.outputPage.toLowerCase():
				outputPageName = ListPageName.diversityInclusion.outputPage;
				break;
			case ListPageName.businessMonitor.outputPage.toLowerCase():
				outputPageName = ListPageName.businessMonitor.outputPage;
				break;
			case ListPageName.businessMonitorPlus.outputPage.toLowerCase():
				outputPageName = ListPageName.businessMonitorPlus.outputPage;
				break;
			case ListPageName.businessWatch.outputPage.toLowerCase():
				outputPageName = ListPageName.businessWatch.outputPage;
				break;
			case ListPageName.accountSearch.inputPage.toLowerCase():
				outputPageName = ListPageName.accountSearch.outputPage;
				break;
			case ListPageName.accountSearch.outputPage.toLowerCase():
				outputPageName = ListPageName.accountSearch.outputPage;
				break;
			case ListPageName.companyDescription.inputPage.toLowerCase():
				outputPageName = ListPageName.companyDescription.outputPage;
				break;
			case ListPageName.companyDescription.outputPage.toLowerCase():
				outputPageName = ListPageName.companyDescription.outputPage;
				break;
			case ListPageName.suppliers.inputPage.toLowerCase():
				outputPageName = ListPageName.suppliers.outputPage;
				break;	
			case ListPageName.buyers.inputPage.toLowerCase():
				outputPageName = ListPageName.buyers.outputPage;
				break;	
			case ListPageName.contractFinder.inputPage.toLowerCase():
				outputPageName = ListPageName.contractFinder.outputPage;
				break;	
			case ListPageName.otherRelatedCompanies.inputPage.toLowerCase():
				outputPageName = ListPageName.otherRelatedCompanies.outputPage;
				break;	
			case ListPageName.companyLinkedIn.inputPage.toLowerCase():
				outputPageName = ListPageName.companyLinkedIn.outputPage;
				break;	
			case ListPageName.businessCollaborators.inputPage.toLowerCase():
				outputPageName = ListPageName.businessCollaborators.outputPage;
				break;

			case ListPageName.procurementPartners.inputPage.toLowerCase():
				outputPageName = ListPageName.procurementPartners.outputPage;
				break;

			case ListPageName.fiscalHoldings.inputPage.toLowerCase():
				outputPageName = ListPageName.fiscalHoldings.outputPage;
				break;

			case ListPageName.potentialLeads.inputPage.toLowerCase():
				outputPageName = ListPageName.potentialLeads.outputPage;
				break;	

			case ListPageName.companyLinkedin.inputPage.toLowerCase():
				outputPageName = ListPageName.companyLinkedin.outputPage;
				break;

			case ListPageName.investeeFinder.inputPage.toLowerCase():
				outputPageName = ListPageName.investeeFinder.outputPage;
				break;

			case ListPageName.investorFinder.inputPage.toLowerCase():
				outputPageName = ListPageName.investorFinder.outputPage;
				break;

			case ListPageName.diversityCalculation.inputPage.toLowerCase():
				outputPageName = ListPageName.diversityCalculation.outputPage;
				break;
				
			case ListPageName.supplierResilience.inputPage.toLowerCase():
				outputPageName = ListPageName.supplierResilience.outputPage;
				break;
			case ListPageName.connectPlusCompany.inputPage.toLowerCase():
				outputPageName = ListPageName.connectPlusCompany.outputPage;
				break;

			default:
				outputPageName = '';
				break;
		}

		return outputPageName;
	}

}
