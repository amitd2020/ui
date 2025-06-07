type colorTypesForStatsChips = 'Amber' | 'SkyBlue' | 'Violet' | 'LightGreen' | 'DarkBlue' | 'LightBlue' | 'Violet' | 'Blue';

export type statsNumberChipsType = {
    [ key: string ]: { color: colorTypesForStatsChips, header: string  }
}

type keyInPayloadType = {
    type: 'list' | 'filter',
    id: string | Array<object>
}

export type payloadForCompareType = {
    firstItem: keyInPayloadType,
    secondItem: keyInPayloadType,
    userId: string
}

const countryCode = localStorage.getItem( 'selectedGlobalCountry' );


export const statsFinancialChips: statsNumberChipsType =   {

    turnoverArray: { color: 'Amber', header: countryCode == 'uk' ? 'Turnover ( £ )' : 'Turnover ( € )'},
    turnoverPlusEstimatedTurnoverArray: { color: 'Blue', header: countryCode == 'uk' ? 'Turnover ( £ )' : 'Turnover ( € )'},
    turnoverGrowth1YearInfo: { color: 'Blue', header: 'Turnover Growth 1 Year'},
    turnoverGrowth3YearsInfo: { color: 'Blue', header: 'Turnover Growth 3 Years'},
    turnoverGrowth5YearsInfo: { color: 'Blue', header: 'Turnover Growth 5 Years'},

    netWorthArray: { color: 'SkyBlue', header: 'Net Worth'},
    netWorthGrowth1YearInfo: { color: 'SkyBlue', header: 'Net Worth Growth 1 Year'},
    netWorthGrowth3YearsInfo: { color: 'SkyBlue', header: 'Net Worth Growth 3 Years'},
    netWorthGrowth5YearsInfo: { color: 'SkyBlue', header: 'Net Worth Growth 5 Years'},

    totalAssetsArray: { color: 'Violet', header: 'Total Assets'},
    totalAssetsGrowth1YearInfo: { color: 'Violet', header: 'Total Assets Growth 1 Year'},
    totalAssetsGrowth3YearsInfo: { color: 'Violet', header: 'Total Assets Growth 3 Years'},
    totalAssetsGrowth5YearsInfo: { color: 'Violet', header: 'Total Assets Growth 5 Years'},

    tradeDebtorsArray: { color: 'LightGreen', header: 'Trade Debtors'},
    tradeDebtorsGrowth1YearInfo: { color: 'LightGreen', header: 'Trade Debtors Growth 1 Year'},
    tradeDebtorsGrowth3YearsInfo: { color: 'LightGreen', header: 'Trade Debtors Growth 3 Years'},
    tradeDebtorsGrowth5YearsInfo: { color: 'LightGreen', header: 'Trade Debtors Growth 5 Years'},

    profitBeforeTaxArray: { color: 'DarkBlue', header: 'Profit Before Tax'},
    profitBeforeTaxGrowth1YearInfo: { color: 'DarkBlue', header: 'Profit Before Tax Growth 1 Year'},
    profitBeforeTaxGrowth3YearsInfo: { color: 'DarkBlue', header: 'Profit Before Tax Growth 3 Years'},
    profitBeforeTaxGrowth5YearsInfo: { color: 'DarkBlue', header: 'Profit Before Tax Growth 5 Years'},

    totalLiabilitiesArray: { color: 'LightBlue', header: 'Total Liabilities'},	
    totalLiabilitiesGrowth1YearInfo: { color: 'LightBlue', header: 'Total Liabilities Growth 1 Year'},
    totalLiabilitiesGrowth3YearsInfo: { color: 'LightBlue', header: 'Total Liabilities Growth 3 Years'},
    totalLiabilitiesGrowth5YearsInfo: { color: 'LightBlue', header: 'Total Liabilities Growth 5 Years'},

    numberOfEmployeesArray: { color: 'Violet', header: 'Number of Employees'},
    numberOfEmployeesGrowth1YearInfo: { color: 'Violet', header: 'Number of Employees Growth 1 Year'},
    numberOfEmployeesGrowth3YearsInfo: { color: 'Violet', header: 'Number of Employees Growth 3 Years'},
    numberOfEmployeesGrowth5YearsInfo: { color: 'Violet', header: 'Number of Employees Growth 5 Years'}
}

export const headerOfEmployees = {
    noOfEmployeesArray: 'Number of Employees',
    noOfEmployeesArray1YearInfo: 'Number of Employees Growth 1 Year',
    noOfEmployeesArray3YearInfo: 'Number of Employees Growth 3 Years',
    noOfEmployeesArray5YearInfo: 'Number of Employees Growth 5 Years'
}

export const colorMSME = {
    'Micro': '#59ba9b',
    'Small': '#ffcc00',
    'Medium': '#ee9512',
    'Large Enterprise': '#e1b12c',
    'Unknown': '#aabbcc',
}

export const otherMiscArrayData: { field: string, label: string, count: number, count_percentage: number, countryAccess: Array<any> }[] = [
    { field: "newCCJ", label: "New CCJ's", count: 0, count_percentage: 0, countryAccess: [ 'uk','ie'] },
    { field: "ccj", label: "All CCJ's", count: 0, count_percentage: 0, countryAccess: [ 'uk','ie'] },
    { field: "patentData", label: "Companies With Patent", count: 0, count_percentage: 0, countryAccess: [ 'uk'] },
    { field: "innovateData", label: "Companies with Grants", count: 0, count_percentage: 0, countryAccess: [ 'uk'] },
    { field: "writeOff", label: "Write-offs", count: 0, count_percentage: 0, countryAccess: [ 'uk'] },
    { field: "landCoporateDetails", label: "Companies Land Ownerships", count: 0, count_percentage: 0, countryAccess: [ 'uk'] },
    { field: "shareholding", label: "Companies with Shareholdings", count: 0, count_percentage: 0, countryAccess: [ 'uk'] },
    { field: "ecsData", label: "Environment Agency Registered", count: 0, count_percentage: 0, countryAccess: [ 'uk'] },
    { field: "companWithCharges", label: "Company With Charges", count: 0, count_percentage: 0, countryAccess: [ 'uk','ie'] }
];

export const industryListData: Array<object> = [
    { label: 'A - agriculture forestry and fishing', value: 'agriculture forestry and fishing', count: 0, count_percentage: 0 },
    { label: 'B - mining and quarrying', value: 'mining and quarrying', count: 0, count_percentage: 0 },
    { label: 'C - manufacturing', value: 'manufacturing', count: 0, count_percentage: 0 },
    { label: 'D - electricity, gas, steam and air conditioning supply', value: 'electricity, gas, steam and air conditioning supply', count: 0, count_percentage: 0 },
    { label: 'E - water supply, sewerage, waste management and remediation activities', value: 'water supply, sewerage, waste management and remediation activities', count: 0, count_percentage: 0 },
    { label: 'F - construction', value: 'construction', count: 0, count_percentage: 0 },
    { label: 'G - wholesale and retail trade; repair of motor vehicles and motorcycles', value: 'wholesale and retail trade; repair of motor vehicles and motorcycles', count: 0, count_percentage: 0 },
    { label: 'H - transportation and storage', value: 'transportation and storage', count: 0, count_percentage: 0 },
    { label: 'I - accommodation and food service activities', value: 'accommodation and food service activities', count: 0, count_percentage: 0 },
    { label: 'J - information and communication', value: 'information and communication', count: 0, count_percentage: 0 },
    { label: 'K - financial and insurance activities', value: 'financial and insurance activities', count: 0, count_percentage: 0 },
    { label: 'L - real estate activities', value: 'real estate activities', count: 0, count_percentage: 0 },
    { label: 'M - professional, scientific and technical activities', value: 'professional, scientific and technical activities', count: 0, count_percentage: 0 },
    { label: 'N - administrative and support service activities', value: 'administrative and support service activities', count: 0, count_percentage: 0 },
    { label: 'O - public administration and defence; compulsory social security', value: 'public administration and defence; compulsory social security', count: 0, count_percentage: 0 },
    { label: 'P - education', value: 'education', count: 0, count_percentage: 0 },
    { label: 'Q - human health and social work activities', value: 'human health and social work activities', count: 0, count_percentage: 0 },
    { label: 'R - arts, entertainment and recreation', value: 'arts, entertainment and recreation', count: 0, count_percentage: 0 },
    { label: 'S - other service activities', value: 'other service activities', count: 0, count_percentage: 0 },
    { label: 'T - activities of households as employers; undifferentiated goods- and services-producing activities of households for own use', value: 'activities of households as employers; undifferentiated goods- and services-producing activities of households for own use', count: 0, count_percentage: 0 },
    { label: 'U - activities of extraterritorial organisations and bodies', value: 'activities of extraterritorial organisations and bodies', count: 0, count_percentage: 0 },
    { label: 'Not Specified', value: 'not specified', count: 0, count_percentage: 0 }
]