import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable()
export class SimilarCompanyService {


    constructor(
        private _router: Router
    ) { }


    navigateToSimilarCompanySearch(  outputPayloadFromSubFilters) {
		

		if ( !outputPayloadFromSubFilters.length ) {
			return;
		}
	
		let urlStr: string, statsButtonBool: boolean = true;
		
		for ( let filterItems of outputPayloadFromSubFilters ) {

			if ( JSON.stringify( filterItems['chip_values']).includes( 'not specified' ) ) {
				statsButtonBool = false;
			}

		};
		
		urlStr = String(this._router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify( outputPayloadFromSubFilters ), cListId: '', listPageName: '', hideStatsButton: statsButtonBool, listName: '' } }));
		window.open( urlStr, '_blank' );

	}

    navigateToFilteredCompanySearch( outputPayloadFromSubFilters, queryParamChipData, inputPageName, listId, listName ) {

		if ( !outputPayloadFromSubFilters.length ) {
			return;
		}

		let combinedPayload = [ ...queryParamChipData, ...outputPayloadFromSubFilters,  ];

		const mergedArray = combinedPayload.reduce((result, currentObject) => {

			const existingObject = result.find(
				(obj) => obj.chip_group === currentObject.chip_group
			);
			
			if (existingObject) {

				/*. DO NOT REMOVE THIS CODE UNTIL THE TICKET HAS BEEN DONE.

				if ( Array.isArray(existingObject.chip_values[0]) ) {
					chipVal =  [...new Set( [ ...currentObject.chip_values ] )]
				} else {
					
					chipVal =  [...new Set([...existingObject.chip_values, ...currentObject.chip_values])]
				}
				...*/

				existingObject.chip_values =  [...new Set([...currentObject.chip_values])];
				
			} else {
				
				result.push({ ...currentObject });
				
			}
			
			return result;
		}, []);
		
		let urlStr: string, statsButtonBool: boolean = true;
		
		for ( let filterItems of mergedArray ) {

			if ( JSON.stringify( filterItems['chip_values']).includes( 'not specified' ) ) {
				statsButtonBool = false;
			}

		}
		
		urlStr = String(this._router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify( mergedArray ), cListId: listId, listPageName: inputPageName, hideStatsButton: statsButtonBool, listName: listName } }));
		window.open( urlStr, '_blank' );

	}

}