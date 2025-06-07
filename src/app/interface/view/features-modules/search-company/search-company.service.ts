import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FilterItemsFrom, ListPageName } from "./search-company.constant";
import { UserAuthService } from "src/app/interface/auth-guard/user-auth/user-auth.service";

@Injectable({
	providedIn: 'root'
})
export class SearchCompanyService {
	
	private userId: '';
	private listId: string = '';
	private pageName: string = '';

	private defaultPayloadState: PayloadFormationObj = {
		filterData: [ { chip_group: 'Status', chip_values: ['live'] } ],
		pageSize: 25,
		startAfter: 0,
		filterSearchArray: [],
		sortOn: [],
		startPlan: false
	}
	

	private apiPayloadBody = new BehaviorSubject( { ...this.defaultPayloadState } );
	$apiPayloadBody = this.apiPayloadBody.asObservable();

	private templateView = new BehaviorSubject( 'company' );
	$templateView = this.templateView.asObservable();

	private listViewTemplate: boolean = false;

	filterPanelApplyButtons = {
		company: true,
		director: false,
		charges: false,
		trade: false,
		contact: false,
		chargesDashboard: false
	}

	showStatsButton: boolean = false;

	constructor(
		private _userAuthService: UserAuthService
	) {}


	updatePayload( input: PayloadFormationObj ) {
		if ( this.listViewTemplate ) {
			input = { ...input, listId: this.listId, pageName: this.pageName };
		}

		if ( !this.listViewTemplate && ( this.apiPayloadBody.value.hasOwnProperty('listId') || this.apiPayloadBody.value.hasOwnProperty('pageName') ) ) {
			for ( let key in this.apiPayloadBody.value ) {
				if ( [ 'listId', 'pageName' ].includes( key ) ) {
					delete this.apiPayloadBody.value[ key ];
				}
			}
		}

		this.apiPayloadBody.next( { ...this.apiPayloadBody.value, ...input } );
	}

	getPayload() {
		return this.apiPayloadBody.value;
	}

	resetPagination() {
		this.updatePayload({
			pageSize: 25,
			startAfter: 0,
			filterSearchArray: [],
			sortOn: []
		});
	}

	resetFilterData() {
		this.updatePayload({
			filterData: [ { chip_group: 'Status', chip_values: ['live'] } ]
		});
	}

	resetPayload() {
		this.updateListViewTemplate( false );
		// this.resetFilterData();
		this.resetPagination();
		this.resetFilterPanelApplyButtons();
		// this.showStatsButton = false;
	}


	setCompanyView() {
		this.templateView.next( 'company' );
		this.pageName = ListPageName.company.outputPage;
	}
	setDirectorView() {
		this.templateView.next( 'director' );
	}
	setChargesView() {
		this.templateView.next( 'charges' );
		this.pageName = ListPageName.charges.outputPage;
	}
	setChargesDashboardView() {
		this.templateView.next( 'chargesDashboard' );
		this.pageName = ListPageName.chargesDashboard.outputPage;
	}
	setTradeView() {
		this.templateView.next( 'trade' );
		this.pageName = ListPageName.trade.outputPage;
	}
	setContactView() {
		this.templateView.next( 'contact' );
	}

	getView(): string {
		return this.templateView.value;
	}

	setPageName(pageName?){		
		this.pageName = pageName;
		this.updatePayload( { pageName : this.pageName } )
	}

	updateListViewTemplate( listViewBool: boolean, listId?: string, pageName?: string ) {
		this.listViewTemplate = listViewBool;
		this.listId = listViewBool ? listId : '';
		pageName = pageName ? pageName.replace(/\s/g, '').toLowerCase() : pageName;

		switch ( pageName ) {

			case ListPageName.company.inputPage.replace(/\s/g, '').toLowerCase():
				this.pageName = ListPageName.company.outputPage;
				this.filterPanelApplyButtons.company = true;
				break;

			case ListPageName.charges.inputPage.replace(/\s/g, '').toLowerCase():
				this.pageName = ListPageName.charges.outputPage;
				this.filterPanelApplyButtons.charges = true;
				this.filterPanelApplyButtons.company = false;
				break;

			case ListPageName.trade.inputPage.replace(/\s/g, '').toLowerCase():
				this.pageName = ListPageName.trade.outputPage;
				this.filterPanelApplyButtons.trade = true;
				this.filterPanelApplyButtons.company = false;
				break;

			case ListPageName.company.outputPage.replace(/\s/g, '').toLowerCase():
				this.pageName = ListPageName.company.outputPage;
				this.filterPanelApplyButtons.company = true;
				break;

			case ListPageName.charges.outputPage.replace(/\s/g, '').toLowerCase():
				this.pageName = ListPageName.charges.outputPage;
				this.filterPanelApplyButtons.charges = true;
				this.filterPanelApplyButtons.company = false;
				break;

			case ListPageName.trade.outputPage.replace(/\s/g, '').toLowerCase():
				this.pageName = ListPageName.trade.outputPage;
				this.filterPanelApplyButtons.trade = true;
				this.filterPanelApplyButtons.company = false;
				break;

			case ListPageName.diversityInclusion.outputPage.replace(/\s/g, '').toLowerCase():
				this.pageName = ListPageName.diversityInclusion.outputPage;
				break;

			case ListPageName.businessMonitor.outputPage.replace(/\s/g, '').toLowerCase():
				this.pageName = ListPageName.businessMonitor.outputPage;
				break;

			case ListPageName.businessMonitorPlus.outputPage.replace(/\s/g, '').toLowerCase():
				this.pageName = ListPageName.businessMonitorPlus.outputPage;
				break;

			case ListPageName.businessWatch.outputPage.replace(/\s/g, '').toLowerCase():
				this.pageName = ListPageName.businessWatch.outputPage;
				break;

			case ListPageName.diversityCalculation.outputPage.replace(/\s/g, '').toLowerCase():
				this.pageName = ListPageName.diversityCalculation.outputPage;
				break;

			case ListPageName.diversityCalculationStats.outputPage.replace(/\s/g, '').toLowerCase():
				this.pageName = ListPageName.diversityCalculationStats.outputPage;
				break;

			case ListPageName.accountSearch.inputPage.replace(/\s/g, '').toLowerCase():
				this.pageName = ListPageName.accountSearch.outputPage;
				this.filterPanelApplyButtons.company = true;
				break;

			case ListPageName.accountSearch.outputPage.replace(/\s/g, '').toLowerCase():
				this.pageName = ListPageName.accountSearch.outputPage;
				this.filterPanelApplyButtons.company = true;
				break;
		
			case ListPageName.companyDescription.inputPage.replace(/\s/g, '').toLowerCase():
				this.pageName = ListPageName.companyDescription.outputPage;
				this.filterPanelApplyButtons.company = true;
				break;

			case ListPageName.companyDescription.outputPage.replace(/\s/g, '').toLowerCase():
				this.pageName = ListPageName.companyDescription.outputPage;
				this.filterPanelApplyButtons.company = true;
				break;
				
			case ListPageName.businessCollaborators.outputPage.replace(/\s/g, '').toLowerCase():
				this.pageName = ListPageName.businessCollaborators.outputPage;
				this.filterPanelApplyButtons.company = true;
				break;

			case ListPageName.procurementPartners.outputPage.replace(/\s/g, '').toLowerCase():
				this.pageName = ListPageName.procurementPartners.outputPage;
				this.filterPanelApplyButtons.company = true;
				break;

			case ListPageName.fiscalHoldings.outputPage.replace(/\s/g, '').toLowerCase():
				this.pageName = ListPageName.fiscalHoldings.outputPage;
				this.filterPanelApplyButtons.company = true;
				break;

			case ListPageName.potentialLeads.outputPage.replace(/\s/g, '').toLowerCase():
				this.pageName = ListPageName.potentialLeads.outputPage;
				this.filterPanelApplyButtons.company = true;
				break;
			case ListPageName.govermentProcurement.outputPage.replace(/\s/g, '').toLowerCase():
				this.pageName = ListPageName.govermentProcurement.outputPage;
				this.filterPanelApplyButtons.company = true;
				break;
		
			default:
				break;

		}

	}

	updateFilterPanelApplyButtons( selectedPropValues?, countryAccess? ) {
		let filterData;
		if ( selectedPropValues ) {
			filterData = selectedPropValues;
		} else {
			filterData = this.apiPayloadBody.value.filterData;
		}

		const matchStr = ( inputStr: string ): boolean => {
			const filterDataStr = JSON.stringify( filterData ).toLowerCase().replace(/[`~!@#$%^&*()+\-=?;.<>\[\]\\\/]/gi, '');
			const strToBeMatched = FilterItemsFrom[ inputStr ].join('|').toLowerCase().replace(/[`~!@#$%^&*()+\-=?;.<>\[\]\\\/]/gi, '');

			let stringMatched = filterDataStr.match( new RegExp( strToBeMatched, 'g' ) );
			return stringMatched ? true : false;
		};
		
		
		if ( !this.listId || ( this.listId && !JSON.stringify( this.apiPayloadBody.value.filterData).includes('Saved Lists') ) ) {
			this.filterPanelApplyButtons.trade = matchStr( 'trade' ) && this._userAuthService.hasAddOnPermission('internationalTradeFilter');
			this.filterPanelApplyButtons.director = matchStr( 'director' );
			this.filterPanelApplyButtons.charges = matchStr( 'charges' ) && this._userAuthService.hasAddOnPermission('lendingLandscape');
			this.filterPanelApplyButtons.chargesDashboard = matchStr( 'chargesDashboard' ) && this._userAuthService.hasAddOnPermission('lendingLandscape') && countryAccess == 'uk';
			this.filterPanelApplyButtons.contact = matchStr( 'contact' ) && this._userAuthService.hasAddOnPermission('contactInformation');
		}

	}

	resetFilterPanelApplyButtons() {
		this.filterPanelApplyButtons.company = true;
		this.filterPanelApplyButtons.director = false;
		this.filterPanelApplyButtons.charges = false;
		this.filterPanelApplyButtons.trade = false;
		this.filterPanelApplyButtons.contact = false;
		this.filterPanelApplyButtons.chargesDashboard = false;
	}

}