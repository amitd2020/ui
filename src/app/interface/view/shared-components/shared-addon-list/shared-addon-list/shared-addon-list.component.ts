import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'dg-shared-addon-list',
	templateUrl: './shared-addon-list.component.html',
	styleUrls: ['./shared-addon-list.component.scss']
})
export class SharedAddonListComponent implements OnInit {
	@Input() showAddonList: string;
	@Input() isAdmin: boolean;
	@Input() addOnNgModel: any;
	@Input() editMode: boolean;

	addonList: Array<any> = []
	combineAddon: Array<any> = []

	@Output() AddonListCommunicator = new EventEmitter<any>();

	addOnDetails: Array<any> = [
		{ field: 'defaultExportFeature', label: 'Export Features', disable: true },
		{ field: 'specialFilter', label: 'Premium Filter' },
		// { field: 'valuationFilter', label: 'Valuation Filter', visibleOnlyForAdmin: true },
		{ field: 'riskFilter', label: 'Risk Filter' },
		{ field: 'crmExport', label: 'CRM Export' },
		// { field: 'ablFilter', label: 'Lending Intelligence' },
		{ field: 'industryAnalysis', label: 'Industry Analysis' },
		{ field: 'internationalTradeFilter', label: 'International Trade Filter' },
		{ field: 'companyMonitorPlus', label: 'Business Monitor Plus' },
		{ field: 'emailSpotter', label: 'Email Spotter' },
		// { field: 'accountType', label: 'Account Type',  },
		// { field: 'emailFilter', label: 'Email Filter',  disable: true },
		{ field: 'contactInformation', label: 'Contact Information' },
		{ field: 'ethnicityFilter', label: 'Ethnicity Filter' },
		{ field: 'epc', label: 'Energy Performance Certificate' },
		{ field: 'enterpriseReport', label: 'Enterprise Report' },
	];

	bussinessIntelligenceDetails: Array<any> = [
		{ field: 'corporateRiskLandscape', label: 'Corporate Risk' },
		{ field: 'internationalTradeLandscape', label: 'International Trade' },
		{ field: 'lendingLandscape', label: 'Lending', },
		{ field: 'investorInvesteeLandscape', label: 'Investor / Investee Finder' },
		{ field: 'hnwiLandscape', label: 'HNWI', },
		{ field: 'governmentEnabler', label: 'Government Procurement' },
		{ field: 'femaleFounder', label: 'Female Owners' },
		{ field: 'ethnicDiversity', label: 'Ethnic Diversity' },
		{ field: 'diversityAndInclusion', label: 'Responsible Procurement' },
		{ field: 'accountSearch', label: 'Account Search' },
		{ field: 'companyDescription', label: 'Company Description' },
		{ field: 'chargesDescription', label: 'Charges Description' },
		{ field: 'propertyIntelligence', label: 'Property Intelligence' },
		{ field: 'smartIntel', label: 'Smart Intel' },
		{ field: 'personLinkedIn', label: 'Person LinkedIn' },
		{ field: 'companyLinkedIn', label: 'Company LinkedIn' },
		{ field: 'webWiget', label: 'Web Widget' },
		{ field: 'diversityCalculation', label: 'Diversity Calculation' },
		{ field: 'charities', label: 'Charities' },
		{ field: 'developerFeatures', label: 'Developer Features' },
		{ field: 'statsComparison', label: 'Stats Comparison' },
		{ field: 'benchMarking', label: 'Benchmarking' },
		{ field: 'dataEnrichment', label: 'Data Enrichment' }

		// { field: 'companyLinkedIn', label: 'Company LinkedIn' },
		// { field: 'personLinkedIn', label: 'Person LinkedIn' }
	];

	constructor() { }

	ngOnInit() {
		this.combineAddon = [...this.addOnDetails, ...this.bussinessIntelligenceDetails]

		this.addonList = this.showAddonList == 'addOnDetails' ? this.addOnDetails : this.showAddonList == 'bussinessIntelligenceDetails' ? this.bussinessIntelligenceDetails : this.combineAddon
	}

	addonCheckCondition(addonList) {
		this.AddonListCommunicator.emit(addonList)
	}

}
