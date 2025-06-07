const ListPageName = {
	company: {
        inputPage: 'Company Search',
        outputPage: 'companyListPage'
    },
	director: {
        inputPage: 'Director Search', //temp added to remove console from dashboard while we are serching director from search bar, in this case not able to get input page. 
        outputPage: ''
    },
	charges: {
        inputPage: 'Company Charges-List',
        outputPage: 'companyChargesListPage'
    },
	chargesDashboard: {
        inputPage: 'ChargeDashBoard',
        outputPage: 'chargeDashboardPage'
    },
	trade: {
        inputPage: 'Company Trade-list',
        outputPage: 'tradeListPage'
    },
	diversityInclusion: {
        inputPage: 'diversityInclusion',
        outputPage: 'diversityInclusion'
    },
	businessMonitor: {
        inputPage: 'businessMonitor',
        outputPage: 'businessMonitor'
    },
	businessMonitorPlus: {
        inputPage: 'businessMonitorPlus',
        outputPage: 'businessMonitorPlus'
    },
	businessWatch: {
        inputPage: 'businessWatch',
        outputPage: 'businessWatch'
    },
    accountSearch: {
        inputPage: 'account Search',
        outputPage: 'accountSearch'
    },
    companyDescription: {
        inputPage: 'company Description',
        outputPage: 'companyDescription'
    },
    companyLinkedIn:{
        inputPage: 'company LinkedIn',
        outputPage: 'companyLinkedIn' 
    },
    personLinkedIn:{
        inputPage: 'person LinkedIn',
        outputPage: 'personLinkedIn'
    },
    buyers: {
        inputPage: 'buyers Dashboard',
        outputPage: 'companyListPage'
    },
    suppliers: {
        inputPage: 'suppliers Dashboard',
        outputPage: 'companyListPage'
    },
    contractFinder: {
        inputPage: 'contract Finder Page',
        outputPage: 'companyListPage' 
    },
    otherRelatedCompanies:{
        inputPage: 'otherRelatedCompanies',
        outputPage: 'otherRelatedCompanies' 
    },
    businessCollaborators:{
        inputPage: 'businessCollaborators',
        outputPage: 'businessCollaborators' 
    },
    procurementPartners:{
        inputPage: 'procurementPartners',
        outputPage: 'procurementPartners' 
    },
    fiscalHoldings:{
        inputPage: 'fiscalHoldings',
        outputPage: 'fiscalHoldings' 
    },
    potentialLeads:{
        inputPage: 'potentialLeads',
        outputPage: 'potentialLeads' 
    },
    companyLinkedin:{
        inputPage: 'Company LinkedIn',
        outputPage: 'companyLinkedIn' 
    },
    personLinkedin:{
        inputPage: 'person LinkedIn',
        outputPage: 'personLinkedIn'
    },
    chargesDescription:{
        inputPage: 'Charges Description',
        outputPage: 'chargesDescription' 
    },
    investeeFinder:{
        inputPage: 'investee Finder Page',
        outputPage: 'investeeFinderPage' 
    },
    investorFinder:{
        inputPage: 'investor Finder Page',
        outputPage: 'investorFinderPage' 
    },
    diversityCalculation:{
        inputPage: 'diversityCalculation',
        outputPage: 'diversityCalculation' 
    },
    diversityCalculationStats:{
        inputPage: 'diversityCalculationStats',
        outputPage: 'diversityCalculation' 
    },
    govermentProcurement:{
        inputPage: 'govermentProcurement',
        outputPage: 'govermentProcurement' 
    },
    supplierResilience: {
        inputPage: 'supplierResilience',
        outputPage: 'supplierResilience'
    },
    connectPlusCompany: {
        inputPage: 'connectPlusCompany',
        outputPage: 'companyListPage'
    }

}

const FilterItemsFrom = {
	director: [
        'Director Salutation',
        'Director Gender',
        'Director Name',
        'Director Age',
        'Director Country',
        'Director Nationality',
        'Director Occupation',
        'Director Role',
        'Total Directorships',
        'Active Directorships',
        'Director Joining Date'
        // 'Active Directors',
    ],
	charges: [
        'Charges Person Entitled',
        'Charges Person Entitled (Raw)',
        'Charges Tag',
        'Charges Status',
        'Charge Code',
        'Charges Classification',
        'Outstanding Charges Count',
        'Charges Create Date',
        'Charges Registered Date',
        'Charge Year',
        'Charge Month',

        // 'Charges Sector', // Not in use at the moment, it's commented in filter panel .ts - `lendingFilterProps: { key: 'chargesData.charge_details.charges_sector.name.keyword', label: 'Charges Sector' }`
        'Company must have charges details'
    ],
    chargesDashboard: [
        'Charges Person Entitled',
        'Charges Person Entitled (Raw)',
        'Charges Tag',
        'Charges Status',
        'Charge Code',
        'Charges Classification',
        'Outstanding Charges Count',
        'Charges Create Date',
        'Charges Registered Date',
        'Charge Year',
        'Charge Month',
        'Company must have charges details'
    ],
	trade: [
        'Commodity Code',
        'Import Date',
        'Export Date',
        'Export Amount (in £)',
        'Exchange Rate Effect',
        'hasExchangeRateEffect',
        'hasImportData',
        'hasExportData',
        'Last 12 Months Imports',
        'Last 12 Months Exports',
        'Last 60 Months Imports',
        'Last 60 Months Exports'
    ],
	contact: [
        'Senior Position',
        'Person Positions',
        'Search by Email',
        'Email Preferences',
        'Person Must Have Email',
        'Person Must Be PSC',
        'Person Must Be Director',
        'Person Must Be preferences_4', // as 'Person Must Be Possible Director'
        'Person Must Be preferences_1', // as 'Person Must Be Shareholders'
        'Person Must Be preferences_2', // as 'Person Must Be Highest Shareholders'
        'Person Must Be preferences_3',  // as 'Person Must Be Second Highest Shareholders'
        'Person must have employee email',
        'Person must have director email',
        'Person must have PSC email'

    ]
}

enum MonthsEnum {
	undefined, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
}

export { ListPageName, FilterItemsFrom, MonthsEnum };