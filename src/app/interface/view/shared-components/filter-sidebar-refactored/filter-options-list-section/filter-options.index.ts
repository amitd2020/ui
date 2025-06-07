// import { FilterOptionsType } from "../filter-option-types";


// const currentDate: Date = new Date();

// export const FilterOptionsIndex: FilterOptionsType = {
//     companySearch: {
//         basic: [
//             {
//                 key: 'companyType',
//                 label: 'Company Profile',
//                 countryAccess: [ 'uk', 'ie' ],
//                 selected: true,
//                 items: [
//                     { key: 'companyRegistrationNumber', label: 'Company Name', chipGroupLabel: 'Company Name/Number', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'string-search' ], componentFeatures: [ 'multi' ], additionalNote: '(Only for live companies)' },
//                     { key: 'companyStatus.keyword', label: 'Status', chipGroupLabel: 'Status', countryAccess: [ 'uk', 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] },
//                     { key: 'financials', label: 'Key Financials', chipGroupLabel: 'Key Financials', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'input-range' ] },
//                     { key: 'internationalScoreDescription.keyword', label: 'Credit Risk Bands', chipGroupLabel: 'Bands', countryAccess: [ 'uk', 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ], forcedFeatureAccess: true },
//                     { key: 'preferences', label: 'Preferences', chipGroupLabel: 'Preferences', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'preference-options' ] }
//                 ]
//             },
//             {
//                 key: 'industrySicCode',
//                 label: 'Industry',
//                 countryAccess: [ 'uk' ],
//                 selected: true,
//                 items: [
//                     { key: 'companyIndustry', label: 'SIC Codes', chipGroupLabel: 'SIC Codes', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getIndustries' }, componentTypes: [ 'tree-list' ], componentFeatures: [ 'exclude-selected' ] },
//                     { key: 'industryTagList.standardTags.keyword', label: 'Industry Tags', chipGroupLabel: 'Industry Tags', featureAccessKey: 'Industry', previousLabels: [ 'Industry', 'Standard Tags' ], countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by', 'exclude-selected' ] }
//                 ]
//             },
//             {
//                 key: 'location',
//                 label: 'Registered Location',
//                 countryAccess: [ 'uk' ],
//                 selected: true,
//                 items: [
//                     { key: 'RegAddress_Modified.postalCode.keyword', label: 'Post Code', chipGroupLabel: 'Post Code', group: 'Address Filter Search', filterSearchArrayKey:'RegAddress_ModifiedPostalCode', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, additionalNote: '*Note: Please note that the radius functionality is only available for a singular postcode!', componentTypes: [ 'radius-slider', 'list-box' ], componentFeatures: [ 'multi', 'custom-search', 'sort-by' ] },
//                     { key: 'RegAddress_Modified.district.keyword', label: 'Town / City', chipGroupLabel: 'Town / City', group: 'Address Filter Search', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'RegAddress_Modified.county.keyword', label: 'County', chipGroupLabel: 'County', group: 'Address Filter Search', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'RegAddress_Modified.region.keyword', label: 'Region', chipGroupLabel: 'Region', group: 'Address Filter Search', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] }
//                 ]
//             },
//             {
//                 key: 'personnel',
//                 label: 'Personnel Contact Information',
//                 addOnAccessKey: 'contactInformation',
//                 countryAccess: [ 'uk' ],
//                 selected: true,
//                 items: [
//                     { key: 'person_contact_info_latest.personPosition.keyword', label: 'Position', chipGroupLabel: 'Person Positions', addOnAccessKey: 'contactInformation', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'emailPreferences', label: 'Preferences', chipGroupLabel: 'Preferences', addOnAccessKey: 'contactInformation', countryAccess: [ 'uk' ], componentTypes: [ 'preference-options' ] }
//                 ]
//             },
//             {
//                 key: 'companyinformation',
//                 label: 'Company Contact Information',
//                 countryAccess: [ 'uk' ],
//                 selected: true,
//                 items: [
//                     { key: 'companyContactPreferences', label: 'Company', chipGroupLabel: 'Preferences', countryAccess: [ 'uk' ], componentTypes: [ 'preference-options' ] }
//                 ]
//             }
//         ],
//         advanced: [
//             {
//                 label: 'Saved Lists',
//                 chipGroupLabel: 'Saved Lists',
//                 countryAccess: [ 'uk', 'ie' ],
//                 componentTypes: [ 'list-box' ],
//                 componentFeatures: [ 'single', 'default-search' ],
//                 endPointForGetSavedList: { route: 'DG_LIST', endPoint: 'getUserListsByUserId', pageName: 'companySearch'  }
//             },
//             {
//                 key: 'companyType',
//                 label: 'Company Profile',
//                 countryAccess: [ 'uk', 'ie' ],
//                 selected: true,
//                 items: [
//                     { key: 'companyStatus.keyword', label: 'Status', chipGroupLabel: 'Status', countryAccess: [ 'uk', 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] },
//                     { key: 'companyRegistrationNumber', label: 'Company Name', chipGroupLabel: 'Company Name/Number', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'string-search' ], componentFeatures: [ 'multi' ], additionalNote: '(Only for live companies)' },
//                     { key: 'companyType.keyword', label: 'Category', chipGroupLabel: 'Category', countryAccess: [ 'uk', 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] },
//                     { key: 'companyAge', label: 'Company Age', chipGroupLabel: 'Company Age Filter', featureAccessKey: 'Company Age', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'input-range', 'list-box' ], componentFeatures: [ 'single' ] },
//                     { key: 'companyRegistrationDate', label: 'Company Age', chipGroupLabel: 'Company Age Filter', featureAccessKey: 'Company Age', countryAccess: [ 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'input-range', 'list-box' ], componentFeatures: [ 'single' ] },
//                     { key: 'IncorporationDate', label: 'Incorporation Date', chipGroupLabel: 'Incorporation Date', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'date-range' ], dateRange: { fromMaxDate: currentDate, toMaxDate: currentDate } },
//                     { key: 'statutoryAccounts.numberOfEmployees', label: 'Number of Employees', chipGroupLabel: 'Number of Employees', countryAccess: [ 'uk', 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'input-range', 'list-box' ], componentFeatures: [ 'single' ] },
//                     { key: 'msmeCategory.keyword', label: 'MSME Classification', chipGroupLabel: 'MSME Classification', countryAccess: [ 'uk' ], componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, forcedFeatureAccess: true  },
//                     { key: 'website', label: 'Website', chipGroupLabel: 'Website', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'string-search' ], componentFeatures: [ 'single' ] },
//                     { key: 'telephone', label: 'Telephone', chipGroupLabel: 'Telephone', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'string-search' ], componentFeatures: [ 'number' ] },
//                     { key: 'preferences', label: 'Preferences', chipGroupLabel: 'Preferences', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'preference-options' ] }
//                 ]
//             },
//             {
//                 key: 'industrySicCode',
//                 label: 'Industry',
//                 countryAccess: [ 'uk', 'ie' ],
//                 selected: false,
//                 items: [
//                     { key: 'companyIndustry', label: 'SIC Codes', chipGroupLabel: 'SIC Codes', countryAccess: [ 'uk', 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'getIndustries' }, componentTypes: [ 'tree-list' ], componentFeatures: [ 'exclude-selected' ] },
//                     // { key: 'sicCode07.SicNumber_1.keyword', label: 'SIC Codes', chipGroupLabel: 'SIC Codes', countryAccess: [ 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ] },
//                     { key: 'industryTagList.standardTags.keyword', label: 'Industry Tags', chipGroupLabel: 'Industry Tags', featureAccessKey: 'Industry', previousLabels: [ 'Industry', 'Standard Tags' ], countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by', 'exclude-selected' ] },
//                     { key: 'naceCodeInfo.naceCode.keyword', label: 'NACE Codes', chipGroupLabel: 'Nace Code', countryAccess: [ 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'getNaceCodes' }, componentTypes: [ 'tree-list' ],  componentFeatures: [ 'multi', 'default-search' ], forcedFeatureAccess: true }
//                     // { key: 'naceCodeInfo.naceCode.keyword', label: 'NACE Codes', chipGroupLabel: 'Nace Code', countryAccess: [ 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ],  componentFeatures: [ 'multi', 'default-search' ], forcedFeatureAccess: true }
//                 ]
//             },
//             {
//                 key: 'location',
//                 label: 'Registered Location',
//                 countryAccess: [ 'uk', 'ie' ],
//                 selected: false,
//                 items: [
//                     { key: 'RegAddress_Modified.postalCode.keyword', label: 'Post Code', chipGroupLabel: 'Post Code', group: 'Address Filter Search', filterSearchArrayKey:'RegAddress_ModifiedPostalCode', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, additionalNote: '*Note: Please note that the radius functionality is only available for a singular postcode!', componentTypes: [ 'radius-slider', 'list-box' ], componentFeatures: [ 'multi', 'custom-search', 'sort-by' ], forcedFeatureAccess: true },
//                     { key: 'RegAddress_Modified.postalCode.keyword', label: 'Post Code', chipGroupLabel: 'Post Code', group: 'Address Filter Search', filterSearchArrayKey:'RegAddress_ModifiedPostalCode', countryAccess: [ 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'custom-search', 'sort-by' ], forcedFeatureAccess: true },
//                     { key: 'RegAddress_Modified.eirCode.keyword', label: 'EIR Code', chipGroupLabel: 'EIR Code', group: 'Address Filter Search', countryAccess: [ 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'custom-search', 'sort-by' ], forcedFeatureAccess: true },
//                     { key: 'RegAddress_Modified.district.keyword', label: 'Town / City', chipGroupLabel: 'Town / City', group: 'Address Filter Search', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ], forcedFeatureAccess: true },
//                     { key: 'RegAddress_Modified.county.keyword', label: 'County', chipGroupLabel: 'County', group: 'Address Filter Search', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ], forcedFeatureAccess: true },
//                     { key: 'RegAddress_Modified.region.keyword', label: 'Region', chipGroupLabel: 'Region', group: 'Address Filter Search', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ], forcedFeatureAccess: true },
//                     { key: 'RegAddress_Modified.country.keyword', label: 'Country', chipGroupLabel: 'Country', group: 'Address Filter Search', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ], forcedFeatureAccess: true },
//                     { key: 'RegAddress_Modified.ward.keyword', label: 'Ward', chipGroupLabel: 'Ward', group: 'Address Filter Search', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ], forcedFeatureAccess: true },
//                     { key: 'RegAddress_Modified.constituency.keyword', label: 'Parliament Constituency', chipGroupLabel: 'Constituency', featureAccessKey: 'Parliament Constituency', group: 'Address Filter Search', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ], forcedFeatureAccess: true },
//                     { key: 'RegAddress_Modified.postcode_district.keyword', label: 'District Code', chipGroupLabel: 'District Code', group: 'Address Filter Search', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ], forcedFeatureAccess: true },
//                     { key: 'RegAddress_Modified.police_force.keyword', label: 'Police Forces', chipGroupLabel: 'Police Force', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ], forcedFeatureAccess: true },
//                     { key: 'RegAddress_Modified.local_authority_name.keyword', label: 'Local Authority Name', chipGroupLabel: 'Local Authority Name', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ], forcedFeatureAccess: true },
//                     { key: 'RegAddress_Modified.districtCouncil.keyword', label: 'District Council', chipGroupLabel: 'District Council', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ], forcedFeatureAccess: true },
//                     { key: 'RegAddress_Modified.countyCouncil.keyword', label: 'County Council', chipGroupLabel: 'County Council', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ], forcedFeatureAccess: true },
//                     { key: 'RegAddress_Modified.unitaryCouncil.keyword', label: 'Unitary Council', chipGroupLabel: 'Unitary Council', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ], forcedFeatureAccess: true },
//                     { key: 'RegAddress_Modified.metropolitanCouncil.keyword', label: 'Metropolitan Council', chipGroupLabel: 'Metropolitan Council', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ], forcedFeatureAccess: true },
//                     { key: 'RegAddress_Modified.londonBoroughsCouncil.keyword', label: 'London Boroughs Council', chipGroupLabel: 'London Boroughs Council', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ], forcedFeatureAccess: true },
//                 ]
//             },
//             {
//                 key: 'premiumFinancialFilters',
//                 label: 'Financial Profile',
//                 addOnAccessKey: 'specialFilter',
//                 countryAccess: [ 'uk', 'ie' ],
//                 selected: false,
//                 items: [
//                     { key: 'financials', label: 'Financials', chipGroupLabel: 'Advanced Key Financials', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'input-range' ], additionalNote: '*Maximum 5 rows can be added' },
//                     { key: '1yearGrowth', label: '1 Year Growth', chipGroupLabel: '1 Year Growth', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'input-range' ], additionalNote: '*Maximum 5 rows can be added' },
//                     { key: '3yearGrowth', label: '3 Years Growth', chipGroupLabel: '3 Years Growth', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'input-range' ], additionalNote: '*Maximum 5 rows can be added' },
//                     { key: '5yearGrowth', label: '5 Years Growth', chipGroupLabel: '5 Years Growth', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'input-range' ], additionalNote: '*Maximum 5 rows can be added' },
//                     { key: 'financialRatios', label: 'Financial Ratio', chipGroupLabel: 'Financial Ratio', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'input-range' ], additionalNote: '*Maximum 5 rows can be added' },
//                     { key: 'statutoryAccounts.accountType.keyword', label: 'Account Type', chipGroupLabel: 'Account Type', countryAccess: [ 'uk', 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] }
//                 ]
//             },
//             {
//                 key: 'personnel',
//                 label: 'Personnel Contact Information',
//                 addOnAccessKey: 'contactInformation',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'person_contact_info_latest.personPosition.keyword', label: 'Person Position', optionalLabel: 'Position', chipGroupLabel: 'Person Positions', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'emailPreferences', label: 'Preferences', chipGroupLabel: 'Preferences', countryAccess: [ 'uk' ], componentTypes: [ 'preference-options' ] }
//                 ]
//             },
//             {
//                 key: 'companyinformation',
//                 label: 'Company Contact Information',
//                 countryAccess: [ 'uk', 'ie' ],
//                 selected: false,
//                 items: [
//                     { key: 'companyContactPreferences', label: 'Company', chipGroupLabel: 'Preferences', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'preference-options' ] }
//                 ]
//             },
//             {
//                 key: 'directors',
//                 label: 'Directors',
//                 countryAccess: [ 'uk', 'ie' ],
//                 selected: false,
//                 items: [
//                     { key: 'directorsData.directorTitle.keyword', label: 'Director Salutation', optionalLabel: 'Salutation', chipGroupLabel: 'Director Salutation', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ] },
//                     { key: 'directorsData.directorGender.keyword', label: 'Director Gender', optionalLabel: 'Gender', chipGroupLabel: 'Director Gender', featureAccessKey: 'Gender', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] },
//                     { key: 'directorsName', label: 'Director Name', optionalLabel: 'Name', chipGroupLabel: 'Director Name', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'string-search' ], componentFeatures: [ 'multi' ] },
//                     { key: 'directorAge', label: 'Director Age', optionalLabel: 'Age', chipGroupLabel: 'Director Age', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'input-range' ] },
//                     { key: 'directorsData.detailedInformation.country.keyword', label: 'Director Country', optionalLabel: 'Country', chipGroupLabel: 'Director Country', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'directorsData.detailedInformation.nationality.keyword', label: 'Director Nationality', optionalLabel: 'Nationality', chipGroupLabel: 'Director Nationality', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'directorsData.directorJobRole.keyword', label: 'Director Occupation', optionalLabel: 'Occupation', chipGroupLabel: 'Director Occupation', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'directorsData.directorRole.keyword', label: 'Director Role', optionalLabel: 'Role', chipGroupLabel: 'Director Role', countryAccess: [ 'uk', 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ] },
//                     { key: 'directorshipCount', label: 'Total Directorships', chipGroupLabel: 'Total Directorships', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'input-range' ] },
//                     { key: 'directorAge', label: 'Active Directorships', chipGroupLabel: 'Active Directorships', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'input-range' ] },
//                     { key: 'active_directors_count', label: 'Active Directors', chipGroupLabel: 'Active Directors', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'input-range' ] }
//                 ]
//             },
//             {
//                 key: 'shareholdings',
//                 label: 'Shareholdings',
//                 countryAccess: [ 'uk', 'ie' ],
//                 selected: false,
//                 items: [
//                     { key: 'numShareHolder', label: 'Number of Shareholders', chipGroupLabel: 'Number of Shareholders', countryAccess: [ 'uk', 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'input-range', 'list-box' ], componentFeatures: [ 'single' ]  },
//                     { key: 'shareHoldingsCount', label: 'Number of Shareholdings', chipGroupLabel: 'Number of Shareholdings', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'input-range','list-box' ], componentFeatures: [ 'single' ]  },
//                 ]
//             },
//             {
//                 key: 'accounts',
//                 label: 'Filed Accounts',
//                 countryAccess: [ 'uk', 'ie' ],
//                 selected: false,
//                 items: [
//                     { key: 'accountsType.keyword', label: 'Accounts Category', chipGroupLabel: 'Accounts Category', countryAccess: [ 'uk', 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] },
//                     { key: 'accountSubmission', label: 'Accounts Submission Overdue', chipGroupLabel: 'Accounts Submission Overdue', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'input-range' ], componentFeatures: [ 'single-input' ], additionalNote: 'Enter the number of months (0 - 24)' },
//                     { key: 'accountsDueDate', label: 'Accounts Due Date', chipGroupLabel: 'Accounts Due Date', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'date-range' ], dateRange: { fromMaxDate: (new Date()).setFullYear(currentDate.getFullYear() + 20 ), fromMinDate: (new Date()).setFullYear(currentDate.getFullYear() - 2 ), toMaxDate:  (new Date()).setFullYear(currentDate.getFullYear() + 20 ) } },
//                     { key: 'accountsmadeupDate', label: 'Last Made Up Date', chipGroupLabel: 'Accounts Made Up Date', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'date-range' ], dateRange: { fromMaxDate: currentDate, fromMinDate: (new Date()).setFullYear(currentDate.getFullYear() - 5 ), toMaxDate: (new Date()).setFullYear(currentDate.getFullYear() + 2 ) } },
//                     { key: 'accountsFilingDate', label: 'Last Filing Date', chipGroupLabel: 'Last Filing Date', countryAccess: [ 'uk' ], componentTypes: [ 'date-range' ], dateRange: { fromMaxDate: currentDate, fromMinDate: (new Date()).setFullYear(currentDate.getFullYear() - 5 ), toMaxDate: (new Date()).setFullYear(currentDate.getFullYear() + 2 ) } },
//                     { key: 'confirmationStatement', label: 'Confirmation Statement', chipGroupLabel: 'Confirmation Statement', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'date-range' ], dateRange: { fromMaxDate: currentDate, fromMinDate: (new Date()).setFullYear(currentDate.getFullYear() - 5 ), toMaxDate:   (new Date()).setFullYear(currentDate.getFullYear() + 2 ) } }
//                 ]
//             },
//             {
//                 key: 'byFoundersFilter',
//                 label: 'By Owners',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'byFounders', label: 'Preferences', chipGroupLabel: 'Preferences', addOnAccessKey: 'femaleFounder', countryAccess: [ 'uk' ], componentTypes: [ 'preference-options' ] }
//                 ]
//             },
//             {
//                 key: 'riskPack',
//                 label: 'Corporate Risk',
//                 addOnAccessKey: 'riskFilter',
//                 countryAccess: [ 'uk', 'ie' ],
//                 selected: false,
//                 items: [
//                     { key: 'internationalScoreDescription.keyword', label: 'Credit Risk Bands', chipGroupLabel: 'Bands', countryAccess: [ 'uk', 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] },
//                     { key: 'amountBandsInPounds.keyword', label: 'Furlough Amount', chipGroupLabel: 'Furlough Amount Band (In Pounds)', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] },
//                     { key: 'companyEvents', label: 'Company Events', chipGroupLabel: 'Company Events', countryAccess: [ 'uk' ], componentTypes: [ 'date-range' ], dateRange: { fromMaxDate: currentDate, toMaxDate: currentDate } },
//                     { key: 'companyEvents.statusCodeDesc.keyword', label: 'Company Events Description', chipGroupLabel: 'Company Events Desc', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ] },
//                     { key: 'companyCommentary', label: 'Company Commentary', chipGroupLabel: 'Company Commentary', countryAccess: [ 'uk' ], componentTypes: [ 'date-range' ], dateRange: { fromMaxDate: currentDate, toMaxDate: currentDate } },
//                     { key: 'companycommentary.commentaryImpact.keyword', label: 'Company Commentary Impact', chipGroupLabel: 'Company Commentary Impact', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes:  [ 'list-box' ], componentFeatures: [ 'single' ] }
//                 ]
//             },
//             {
//                 key: 'tradingAddress',
//                 label: 'Trading Address',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'tradingAddress.postcode.keyword', label: 'Trading Post Code', optionalLabel: 'Post Code', chipGroupLabel: 'Trading Post Code', featureAccessKey: 'Post Code', group: 'Trading Address Filter Search', filterSearchArrayKey: 'tradingAddressPostCode', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, additionalNote: '*Note: Please note that the radius functionality is only available for a singular postcode!', componentTypes: [ 'radius-slider', 'list-box' ], componentFeatures: [ 'multi', 'custom-search', 'sort-by' ] },
//                     { key: 'tradingAddress.district.keyword', label: 'Trading Town / City', optionalLabel: 'Town / City', chipGroupLabel: 'Trading Town / City', featureAccessKey: 'Town / City', group: 'Trading Address Filter Search', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'tradingAddress.postcode_district.keyword', label: 'Trading District Code', optionalLabel: 'District Code', chipGroupLabel: 'Trading District Code', featureAccessKey: 'District Code', group: 'Trading Address Filter Search', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'tradingAddress.county.keyword', label: 'Trading County', optionalLabel: 'County', chipGroupLabel: 'Trading County', featureAccessKey: 'County', group: 'Trading Address Filter Search', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'tradingAddress.region.keyword', label: 'Trading Region', optionalLabel: 'Region', chipGroupLabel: 'Trading Region', featureAccessKey: 'Region', group: 'Trading Address Filter Search', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] },
//                     { key: 'tradingAddress.constituency.keyword', label: 'Trading Constituency', optionalLabel: 'Constituency', chipGroupLabel: 'Trading Constituency', featureAccessKey: 'Constituency', group: 'Trading Address Filter Search', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ] },
//                     { key: 'tradingAddress_count', label: 'Trading Count', optionalLabel: 'Count', chipGroupLabel: 'Trading Address Count', group: 'Trading Address Filter Search', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ] }
//                 ]
//             },
//             {
//                 key: 'ethnicityArray.keyword',
//                 label: 'Diversity',
//                 addOnAccessKey: 'ethnicityFilter',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'ethnicityArray.keyword', label: 'Ethnicity', chipGroupLabel: 'Ethnicity', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ] },
//                     { key: 'ethnicitySpecialTags.keyword', label: 'Diversity Special Tags', chipGroupLabel: 'Diversity Special Tags', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'sort-by', 'exclude-selected' ] },
//                     { key: 'preferences', label: 'Preferences', chipGroupLabel: 'Preferences', countryAccess: [ 'uk' ], componentTypes: [ 'preference-options' ] }
//                 ]
//             },
//             {
//                 key: 'ccj',
//                 label: 'County Court Judgment',
//                 countryAccess: [ 'uk', 'ie' ],
//                 selected: false,
//                 items: [
//                     { key: 'ccjStatus', label: 'CCJ Status', chipGroupLabel: 'CCJ Status', countryAccess: [ 'uk', 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] },
//                     { key: 'ccjDate', label: 'CCJ Date', chipGroupLabel: 'CCJ Date', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'date-range' ], dateRange: { fromMaxDate: currentDate, toMaxDate: currentDate } },
//                     { key: 'ccjCourt', label: 'Court', chipGroupLabel: 'Court', countryAccess: [ 'uk', 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'ccjAmount', label: 'CCJ Amount', chipGroupLabel: 'CCJ Amount', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'input-range' ] }
//                 ]
//             },
//             {
//                 key: 'adminFilters',
//                 label: 'Company Support Services',
//                 addOnAccessKey: 'specialFilter',
//                 countryAccess: [ 'uk', 'ie' ],
//                 selected: false,
//                 items: [
//                     { key: 'auditorsQualificationCodes.auditors.keyword', label: 'Auditor Name', chipGroupLabel: 'Auditor Name', countryAccess: [ 'uk', 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'auditorsQualificationCodes.accountantsName.keyword', label: 'Accountant Name', chipGroupLabel: 'Accountant Name', countryAccess: [ 'uk', 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'bankDetails.bankName.keyword', label: 'Bank Name', chipGroupLabel: 'Bank Name', countryAccess: [ 'uk', 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'bankDetails.sortCode.keyword', label: 'Bank Sort Code', chipGroupLabel: 'Bank Sort Code', countryAccess: [ 'uk', 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                 ]
//             },
//             {
//                 key: '',
//                 label: 'Innovate UK',
//                 addOnAccessKey: 'specialFilter',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'innovate_uk_funded_updated.competitionTitle.keyword', label: 'Competition Title', chipGroupLabel: 'Competition Title', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'innovate_uk_funded_updated.sector.keyword', label: 'Sector', chipGroupLabel: 'Sector', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ],  },
//                     { key: 'innovate_uk_funded_updated.competitionYear.keyword', label: 'Competition Year', chipGroupLabel: 'Competition Year', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'innovate_uk_funded_updated.participantName.keyword', label: 'Participant Name', chipGroupLabel: 'Participant Name', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'single', 'default-search', 'sort-by' ] },
//                     { key: 'innovate_uk_funded_updated.isLeadParticipant.keyword', label: 'Is Lead Participant', chipGroupLabel: 'IsLead Participant', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'single' ] },
//                     { key: 'Grant Offered', label: 'Grant Offered', chipGroupLabel: 'Grant Offered', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ] },
//                     { key: 'innovate_uk_funded_updated.enterpriseSize.keyword', label: 'Enterprise Size', chipGroupLabel: 'Enterprise Size', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'single', 'default-search' ] },
//                     { key: 'innovate_uk_funded_updated.postcode.keyword', label: 'Innovate Post Code', optionalLabel: 'Post Code', chipGroupLabel: 'Innovate Post Code', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'custom-search', 'sort-by' ] },
//                     { key: 'Project Start Date', label: 'Project Start Date', chipGroupLabel: 'Project Start Date', countryAccess: [ 'uk' ], componentTypes: [ 'date-range' ], dateRange: { fromMaxDate: currentDate, toMaxDate: currentDate } },
//                     { key: 'Project End Date', label: 'Project End Date', chipGroupLabel: 'Project End Date', countryAccess: [ 'uk' ], componentTypes: [ 'date-range' ], dateRange: { fromMaxDate: currentDate, toMaxDate: (new Date()).setFullYear(currentDate.getFullYear() + 70) } },
//                 ]
//             },
//             {
//                 key: 'patentAndTrade',
//                 label: 'Patent And Trade Marks',
//                 addOnAccessKey: 'specialFilter',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'patentData.caseStatus.keyword', label: 'Case Status', chipGroupLabel: 'Case Status', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'DateFiled', label: 'Filed Date', chipGroupLabel: 'Filed Date', countryAccess: [ 'uk' ], componentTypes: [ 'date-range' ], dateRange: { fromMaxDate: currentDate, toMaxDate: currentDate } }
//                 ]
//             },
//             {
//                 key: 'corporateLandFilters',
//                 label: 'Property Register',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'dateProprietorAdded', label: 'Proprietor Added Date', chipGroupLabel: 'Proprietor Added Date', countryAccess: [ 'uk' ], componentTypes: [ 'date-range' ], dateRange: { fromMaxDate: currentDate, toMaxDate: currentDate } },
//                     { key: 'Cost', label: 'Transaction Price', chipGroupLabel: 'Price', featureAccessKey: 'Transaction Price', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ] },
//                     { key: 'landCoporateDetails.tenure.keyword', label: 'Tenure', chipGroupLabel: 'Tenure', group: 'Corporate Land Filter Search', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'single' ] },
//                     { key: 'landCoporateDetails.postcode.keyword', label: 'Post Code', chipGroupLabel: 'landCoporateDetailsPostCode', featureAccessKey: 'Post Code', group: 'Corporate Land Filter Search', filterSearchArrayKey: 'Postal Code', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, additionalNote: '*Note: Please note that the radius functionality is only available for a singular postcode!', componentTypes: [ 'radius-slider', 'list-box' ], componentFeatures: [ 'multi', 'custom-search', 'sort-by' ] },
//                     { key: 'landCoporateDetails.district.keyword', label: 'District', chipGroupLabel: 'landCoporateDetailsPostTown', featureAccessKey: 'District', group: 'Corporate Land Filter Search', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'landCoporateDetails.county.keyword', label: 'County', chipGroupLabel: 'landCoporateDetailsCounty', featureAccessKey: 'County', group: 'Corporate Land Filter Search', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'landCoporateDetails.region.keyword', label: 'Region', chipGroupLabel: 'landCoporateDetailsRegion', featureAccessKey: 'Region', group: 'Corporate Land Filter Search', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] },
//                     { key: 'corporateLand_count', label: 'Property Count', chipGroupLabel: 'Property Count', group: 'Corporate Land Filter Search', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ] },
//                     { key: 'domestic.keyword', label: 'Property ( Domestic )', countryAccess: [ 'uk' ], chipGroupLabel: 'Property Type ( Domestic )', withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: ['list-box'], componentFeatures: [ 'multi' ], featureAccessKey: 'Property Type',  group: 'Corporate Land Filter Search' },
//                     { key: 'non-domestic.keyword', label: 'Property ( Non Domestic )', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam', }, componentTypes: [ 'list-box' ], chipGroupLabel: 'Property Type ( Non Domestic )', componentFeatures: [ 'multi', 'default-search' ], featureAccessKey: 'Property Type',  group: 'Corporate Land Filter Search' }
//                 ]
//             },
//             // {
//             //     label: 'EPC',
//             //     countryAccess: [ 'uk' ],
//             //     rolesAccess: [ 'Super Admin' ],
//             //     selected: false,
//             //     items: [
//             //         { key: 'propertiesOwned', label: 'Properties Owned', chipGroupLabel: 'Properties Owned', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ] },
//             //         { key: 'flatsOwned', label: 'Flats Owned', chipGroupLabel: 'Flats Owned', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ] },
//             //         { key: 'housesOwned', label: 'Houses Owned', chipGroupLabel: 'Houses Owned', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ] }
//             //     ]
//             // },
//             // {
//             //     key: 'valuationPack',
//             //     label: 'Business Valuation',
//             //     addOnAccessKey: 'valuationFilter',
//             //     countryAccess: [ 'uk' ],
//             //     selected: false,
//             //     items: [
//             //         { key: 'roePercent', label: 'Return on Equity', countryAccess: [ 'uk' ] },
//             //         { key: 'voScore_updated', label: 'Business Valuation', countryAccess: [ 'uk' ] }
//             //     ]
//             // },
//             {
//                 key: 'industryAnalysis',
//                 label: 'Industry Analysis',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'zScore.zScoreDescription.keyword', label: 'Z Score', chipGroupLabel: 'Z Score', addOnAccessKey: 'industryAnalysis', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'single' ] },
//                     { key: 'cagr.cagrRating.keyword', label: 'CAGR', chipGroupLabel: 'CAGR', addOnAccessKey: 'industryAnalysis', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'single' ] }
//                 ]
//             },
//             {
//                 key: 'writeOff',
//                 label: 'Write-offs',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'writeOffDate', label: 'Write-off Date', chipGroupLabel: 'Write-off Date', countryAccess: [ 'uk' ], componentTypes: [ 'date-range' ], dateRange: { fromMaxDate: currentDate, toMaxDate: currentDate } },
//                     { key: 'writeOffAmount', label: 'Write-off Amount', chipGroupLabel: 'Write-off Amount', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ] }
//                 ]
//             },
//             {
//                 key: 'enviromentAgencyRegd',
//                 label: 'Environment Agency Regd.',
//                 rolesAccess: [ 'Super Admin' ],
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'enviromentPreferences', label: 'Enviroment Preferences', optionalLabel: 'Preferences', chipGroupLabel: 'Preferences', countryAccess: [ 'uk' ], componentTypes: [ 'preference-options' ] },
//                     { key: 'environmentComplianceScore.compliance_rating.keyword', label: 'Compliance Band Score', chipGroupLabel: 'Compliance Band Score', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'single' ] },
//                     { key: 'environmentComplianceScoreCount', label: 'ECS Site', chipGroupLabel: 'ECS Site', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'single' ] }
//                 ]
//             },
//             {
//                 key: 'ultimateCompanyCountryList.ultimateCompanyCountry.keyword',
//                 label: 'Foreign UBO',
//                 addOnAccessKey: 'specialFilter',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'ultimateCompanyCountryList.ultimateCompanyCountry.keyword', label: 'Foreign UBO', chipGroupLabel: 'Foreign UBO', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'exclude-selected' ] }
//                 ]
//             },
//             {
//                 key: 'lending',
//                 label: 'Lending',
//                 addOnAccessKey: 'lendingLandscape',
//                 countryAccess: [ 'uk', 'ie' ],
//                 selected: false,
//                 items: [
//                     { key: 'chargesData.charge_details.persons_entitled.name.keyword', label: 'Charges Person Entitled', chipGroupLabel: 'Charges Person Entitled', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'custom-search', 'sort-by' ] },
//                     { key: 'mortgagesObj.mortgageDetails.persons_entitled_raw.description.keyword', label: 'Charges Person Entitled (Raw)', chipGroupLabel: 'Charges Person Entitled (Raw)', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'custom-search', 'sort-by' ] },
//                     { key: 'mortgagesObj.chargesPersonEntitledDetails.personEntitledName.keyword', label: 'Charges Person Entitled (Raw)', chipGroupLabel: 'Charges Person Entitled (Raw)', countryAccess: [ 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'custom-search', 'sort-by' ] },
//                     { key: 'mortgagesObj.mortgageDetails.tagName.keyword', label: 'Charges Tag', chipGroupLabel: 'Charges Tag', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] },
//                     { key: 'mortgagesObj.chargeTagsName.keyword', label: 'Charges Tag', chipGroupLabel: 'Charges Tag', countryAccess: [ 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] },
//                     { key: 'chargesData.charge_details.status.keyword', label: 'Charges Status', chipGroupLabel: 'Charges Status', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'single' ] },
//                     { key: 'mortgagesObj.statusCodeLookup.keyword', label: 'Charges Status', chipGroupLabel: 'Charges Status', countryAccess: [ 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ] },
//                     { key: 'chargeCode', label: 'Charge Code', chipGroupLabel: 'Charge Code', countryAccess: [ 'uk' ], componentTypes: [ 'string-search' ], componentFeatures: [ 'multi' ],  additionalNote: '(Insert numeric value only)' },
//                     { key: 'chargesData.charge_details.classification.description', label: 'Charges Classification', chipGroupLabel: 'Charges Classification', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'mortgagesObj.chargeTypeDescription.keyword', label: 'Charges Classification', chipGroupLabel: 'Charges Classification', countryAccess: [ 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'outstandingCount', label: 'Outstanding Charges Count', chipGroupLabel: 'Outstanding Charges Count', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'input-range' ] },		
//                     { key: 'chargesData.charge_details.registeredDate', label: 'Charges Create On', chipGroupLabel: 'Charges Create Date', optionalLabel: 'Charges Created On', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'date-range' ], dateRange: { fromMaxDate: currentDate, toMaxDate: currentDate } },
//                     { key: 'chargesData.charge_details.registeredDate', label: 'Charges Registered On', chipGroupLabel: 'Charges Registered Date', countryAccess: [ 'uk', 'ie' ], componentTypes: [ 'date-range' ], dateRange: { fromMaxDate: currentDate, toMaxDate: currentDate } },
//                     { key: 'mortgagesObj.createdDate', label: 'Charge Created Year', chipGroupLabel: 'Charge Year', countryAccess: [ 'uk', 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'range-selection' ] },
//                     { key: 'mortgagesObj.createdMonth.keyword', label: 'Charge Created Month', chipGroupLabel: 'Charge Month', countryAccess: [ 'uk', 'ie' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'range-selection' ] }
//                 ]
//             },
//             {
//                 key: 'importAndExport',
//                 label: 'International Trade',
//                 addOnAccessKey: 'internationalTradeFilter',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'commodityCodes', label: 'Commodity Code', chipGroupLabel: 'Commodity Code', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'commodityCode' }, componentTypes: [ 'tree-list' ] },
//                     { key: 'importDate', label: 'Import Date', chipGroupLabel: 'Import Date', countryAccess: [ 'uk' ], componentTypes: [ 'date-range' ], dateRange: { fromMaxDate: currentDate, toMaxDate: currentDate } },
//                     { key: 'exportDate', label: 'Export Date', chipGroupLabel: 'Export Date', countryAccess: [ 'uk' ], componentTypes: [ 'date-range' ], dateRange: { fromMaxDate: currentDate, toMaxDate: currentDate } },
//                     { key: 'exportAmount', label: 'Export Amount (in £)', chipGroupLabel: 'Export Amount (in £)', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ]  },
//                     { key: 'exchangeRateEffect', label: 'Exchange Rate Effect', chipGroupLabel: 'Exchange Rate Effect', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ] },
//                     { key: 'internationalTradeSpecialTag.keyword', label: 'Special Tags (Int. Trade)', chipGroupLabel: 'International Trade Special Tags', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'exclude-selected' ] },
//                     { key: 'exchangeRateEffectPreferences', label: 'Preferences', chipGroupLabel: 'Preferences', countryAccess: [ 'uk' ], componentTypes: [ 'preference-options' ] },
//                     { key: 'last12MonthsImports', label: 'Last 12 Months Imports', chipGroupLabel: 'Last 12 Months Imports', countryAccess: ['uk'], componentTypes: ['input-range'] },
//                     { key: 'last12MonthsExports', label: 'Last 12 Months Exports', chipGroupLabel: 'Last 12 Months Exports', countryAccess: ['uk'], componentTypes: ['input-range'] },
//                     { key: 'last60MonthsImports', label: 'Last 60 Months Imports', chipGroupLabel: 'Last 60 Months Imports', countryAccess: ['uk'], componentTypes: ['input-range'] },
//                     { key: 'last60MonthsExports', label: 'Last 60 Months Exports', chipGroupLabel: 'Last 60 Months Exports', countryAccess: ['uk'], componentTypes: ['input-range'] }
//                 ]
//             }
//         ]
//     },
//     // page name for commercial property( Property register)
//     landCorporate: {
//         advanced: [
//             { key: 'companyNumber', label: 'Company Name', chipGroupLabel: 'Company Name/Number', group: 'Land Registry Filter Search', countryAccess: [ 'uk' ], componentTypes: [ 'string-search' ], componentFeatures: [ 'multi' ], additionalNote: '(Only for live companies)' },
//             { key: 'titleNumber', label: 'Title Number', chipGroupLabel: 'Title Number', group: 'Land Registry Filter Search', countryAccess: [ 'uk' ], componentTypes: [ 'string-search' ], componentFeatures: [ 'multi' ] },
//             { key: 'Cost', label: 'Price', group: 'Land Registry Filter Search', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ] },
//             { key: 'propertyAddress', label: 'Property Address', chipGroupLabel: 'Property Address', group: 'Land Registry Filter Search', countryAccess: [ 'uk' ], componentTypes: [ 'string-search' ], componentFeatures: [ 'multi' ] },
//             { key: 'Region.keyword', label: 'Region', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_LAND_CORPORATE', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ] },
//             { key: 'Postcode.keyword', label: 'Post Code', chipGroupLabel: 'PostCode', group: 'Land Registry Filter Search', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_LAND_CORPORATE', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'custom-search', 'sort-by' ] },
//             { key: 'District.keyword', label: 'District', group: 'Land Registry Filter Search', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_LAND_CORPORATE', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'custom-search', 'sort-by' ] },
//             { key: 'County.keyword', label: 'County', group: 'Land Registry Filter Search', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_LAND_CORPORATE', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//             { key: 'Tenure.keyword', label: 'Tenure', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_LAND_CORPORATE', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'single' ] }
//         ]
//     },
//     // page name for residential property
//     landRegistry: {
//         advanced: [
//             { key: 'price', label: 'Price', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ] },
//             { key: 'paon', label: 'Building Name/Number', chipGroupLabel: 'Building Name/Number', countryAccess: [ 'uk' ], componentTypes: [ 'string-search' ], componentFeatures: [ 'multi' ] },
//             { key: 'saon', label: 'Secondary Name', chipGroupLabel: 'Secondary Name', countryAccess: [ 'uk' ], componentTypes: [ 'string-search' ], componentFeatures: [ 'multi' ] },
//             { key: 'street', label: 'Street', chipGroupLabel: 'Street', countryAccess: [ 'uk' ], componentTypes: [ 'string-search' ], componentFeatures: [ 'multi' ] },
//             { key: 'transferDate', label: 'Date', countryAccess: [ 'uk' ], componentTypes: [ 'date-range' ] },
//             { key: 'townOrCity', label: 'Town or City', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_LAND_REGISTRY', endpoint: 'searchApiAggregateByParam' }, componentTypes: ['list-box'], componentFeatures: [ 'multi', 'custom-search', 'sort-by'] },
//             { key: 'district', label: 'District', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_LAND_REGISTRY', endpoint: 'searchApiAggregateByParam' }, componentTypes: ['list-box'], componentFeatures: [ 'multi', 'custom-search', 'sort-by'] },
//             { key: 'postcode', label: 'PostCode', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_LAND_REGISTRY', endpoint: 'searchApiAggregateByParam' }, componentTypes: ['list-box'], componentFeatures: [ 'multi', 'default-search' ] },
//             { key: 'county', label: 'County', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_LAND_REGISTRY', endpoint: 'searchApiAggregateByParam' }, componentTypes: ['list-box'], componentFeatures: [ 'multi', 'default-search' ] },
//             { key: 'oldOrNew', label: 'Build Type', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_LAND_REGISTRY', endpoint: 'searchApiAggregateByParam' }, componentTypes: ['list-box'], componentFeatures: [ 'single' ] },
//             { key: 'duration', label: 'Land Tenure', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_LAND_REGISTRY', endpoint: 'searchApiAggregateByParam' }, componentTypes: ['list-box'], componentFeatures: [ 'single' ] },
//             { key: 'propertyType', label: 'Property Type', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_LAND_REGISTRY', endpoint: 'searchApiAggregateByParam' }, componentTypes: ['list-box'], componentFeatures: [ 'single' ] }
//         ]
//     },
//     lendingLandscapePage: {
//         advanced: [
//             { key: 'chargesData.charge_details.persons_entitled.name.keyword', label: 'Charges Person Entitled', countryAccess: [ 'uk' ], withAggregation: { reqBy: 'lendingScreen', route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'custom-search', 'sort-by' ] },
//             { key: 'mortgagesObj.mortgageDetails.persons_entitled_raw.description.keyword', label: 'Charges Person Entitled (Raw)', countryAccess: [ 'uk' ], withAggregation: { reqBy: 'lendingScreen', route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'custom-search', 'sort-by' ] },
//             { key: 'RegAddress_Modified.region.keyword', label: 'Region', countryAccess: [ 'uk' ], withAggregation: { reqBy: 'lendingScreen', route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] },
//             { key: 'industryLending', label: 'Industry', chipGroupLabel: 'SIC Industry', displayLabel: 'Industry', countryAccess: [ 'uk' ], withAggregation: { reqBy: 'lendingScreen', route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ]  },
//             { key: 'companyAge', label: 'Company Age', countryAccess: [ 'uk' ], chipGroupLabel: 'Company Age Filter', componentTypes: [ 'input-range' ] },
//             { key: 'internationalScoreDescription.keyword', label: 'Credit Risk Bands', displayLabel: 'Credit Risk Bands', chipGroupLabel: 'Bands', countryAccess: [ 'uk' ], withAggregation: { reqBy: 'lendingScreen', route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] },
//             { key: 'financials', label: 'Turnover', displayLabel: 'Turnover', chipGroupLabel: 'Key Financials', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ] },
//             { key: 'debtorDays', label: 'Debtor Days', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ] },
//             { key: 'tradeDebtors', label: 'Trade Debtors', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ] },
//             { key: 'mortgagesObj.createdDate', label: 'Charge Created Year', displayLabel: 'Charge Created Year', chipGroupLabel: 'Charge Year', countryAccess: [ 'uk' ], withAggregation: { reqBy: 'lendingScreen', route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'range-selection' ] },
//             { key: 'mortgagesObj.createdMonth.keyword', label: 'Charge Created Month', displayLabel: 'Charge Created Month', chipGroupLabel: 'Charge Month', countryAccess: [ 'uk' ], withAggregation: { reqBy: 'lendingScreen', route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'range-selection' ] },
//             { key: 'chargesData.charge_details.status.keyword', label: 'Charges Status', countryAccess: [ 'uk' ], withAggregation: { reqBy: 'lendingScreen', route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'single' ] },
//             { key: 'mortgagesObj.mortgageDetails.tagName.keyword', label: 'Charges Tag', countryAccess: [ 'uk' ], withAggregation: { reqBy: 'lendingScreen', route: 'DG_API', endpoint: 'searchApiAggregateByParam' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] },
//             { key: 'financials', label: 'Advanced Key Financials', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ], additionalNote: '*Maximum 5 rows can be added' }
//         ]
//     },
//     contractFinderPage: {
//         advanced: [
//             // {
//             //     key: 'Contract',
//             //     label: 'Contract',
//             //     countryAccess: [ 'uk', 'ie' ],
//             //     selected: true,
//             //     items: [
//                     { key: 'keywordSearch', label: 'Search Keyword', chipGroupLabel: 'Search Keyword', countryAccess: [ 'uk' ], componentTypes: [ 'string-search' ], componentFeatures: [ 'single', 'contract-finder-note' ] },
//                     { key: 'status.keyword', label: 'Contract Status', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamContractFinder' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] },
//                     { key: 'companyIndustry', label: 'CPV Industry Code', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getCpvCodes' }, componentTypes: [ 'tree-list' ] },
//                     { key: 'ojeu_contract_type.keyword', label: 'Contract Type', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamContractFinder' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] },
//                     { key: 'region.keyword', label: 'Contract Region', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamContractFinder' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ] },
//                     // { key: 'suppliers.name.keyword', label: 'Supplier Name', chipGroupLabel: 'Supplier Name', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamContractFinder' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'custom-search' ] },
//                     // { key: 'buyer_name.keyword', label: 'Buyer Name', chipGroupLabel: 'Buyer Name', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamContractFinder' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'custom-search' ] },
//                     // { key: 'ward.keyword', label: 'Buyer Ward', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamContractFinder' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ] },
//                     // { key: 'constituency.keyword', label: 'Buyer Constituency', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamContractFinder' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ] },
//                     // { key: 'county.keyword', label: 'Buyer County', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamContractFinder' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ] },
//                     // { key: 'postcode.keyword', label: 'Buyer Postcode', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamContractFinder' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ] },
//                     // { key: 'country.keyword', label: 'Buyer Country', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamContractFinder' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] },
//                     { key: 'closing_date', label: 'Contract Closing Date', countryAccess: [ 'uk' ], componentTypes: [ 'date-range' ], dateRange: { fromMaxDate: currentDate, toMaxDate:  (new Date()).setFullYear(currentDate.getFullYear() + 70) } },
//                     { key: 'contract_end_date', label: 'Contract End Date', countryAccess: [ 'uk' ], componentTypes: [ 'date-range' ], dateRange: { fromMaxDate: currentDate, toMaxDate:  (new Date()).setFullYear(currentDate.getFullYear() + 70) } },
//                     { key: 'awarded_date', label: 'Awarded Date', countryAccess: [ 'uk' ], componentTypes: [ 'date-range' ], dateRange: { fromMaxDate: currentDate, toMaxDate:  (new Date()).setFullYear(currentDate.getFullYear() + 70) } },
//                     { key: 'awarded_value', label: 'Awarded Value', chipGroupLabel: 'Awarded Value', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ], componentFeatures: [ 'single', 'contract-finder-note' ] },
//                 // ]
//             // },
//             { 
//                 key: 'Buyer',
//                 label: 'Buyer',
//                 countryAccess: [ 'uk', 'ie' ],
//                 selected: false,
//                 items: [
//                     { key: 'buyer_name.keyword', optionalLabel: 'Name', chipGroupLabel: 'Buyer Name', label: 'Buyer Name', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamContractFinder' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'custom-search' ], forcedFeatureAccess: true },
//                     { key: 'postcode.keyword', optionalLabel: 'Postcode', label: 'Buyer Postcode', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamContractFinder' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ], forcedFeatureAccess: true },
//                     { key: 'county.keyword', optionalLabel: 'County', label: 'Buyer County', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamContractFinder' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ], forcedFeatureAccess: true },
//                     { key: 'country.keyword', optionalLabel: 'Country', label: 'Buyer Country', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamContractFinder' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ], forcedFeatureAccess: true },
//                     { key: 'ward.keyword', optionalLabel: 'Ward', label: 'Buyer Ward', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamContractFinder' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ], forcedFeatureAccess: true },
//                     { key: 'constituency.keyword', optionalLabel: 'Constituency', label: 'Buyer Constituency', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamContractFinder' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ], forcedFeatureAccess: true }
//                 ]
//             },
//             { 
//                 key: 'Supplier',
//                 label: 'Supplier',
//                 countryAccess: [ 'uk', 'ie' ],
//                 selected: false,
//                 items:[
//                     { key: 'suppliers.name.keyword', optionalLabel: 'Name', label: 'Supplier Name', chipGroupLabel: 'Supplier Name', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamContractFinder' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'custom-search' ], forcedFeatureAccess: true },
//                     { key: 'suppliers.postcode.keyword', optionalLabel: 'Postcode', label: 'Supplier Postcode', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamContractFinder' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ], forcedFeatureAccess: true },
//                     { key: 'suppliers.county.keyword', optionalLabel: 'County', label: 'Supplier County', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamContractFinder' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ], forcedFeatureAccess: true },
//                     { key: 'suppliers.country.keyword', optionalLabel: 'Country', label: 'Supplier Country', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamContractFinder' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ], forcedFeatureAccess: true },
//                     { key: 'suppliers.ward.keyword', optionalLabel: 'Ward', label: 'Supplier Ward', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamContractFinder' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ], forcedFeatureAccess: true },
//                     { key: 'suppliers.constituency.keyword', optionalLabel: 'Constituency', label: 'Supplier Constituency', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamContractFinder' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ], forcedFeatureAccess: true },
//                 ]
//             }

//         ],
//     },
//     buyersDashboard: {
//         advanced: [
//             { key: 'buyerCpvIndustry', label: 'Buyer CPV Industry Code', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getCpvCodes' }, componentTypes: [ 'tree-list' ] },
//             { key: 'buyingDetails.ojeu_contract_type.keyword', label: 'Contract Type', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamBuyerSupplier' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] },
//             { key: 'buyingDetails.region.keyword', label: 'Contract Region', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamBuyerSupplier' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'custom-search' ] },
//             { key: 'buyingDetails.status.keyword', label: 'Contract Status', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamBuyerSupplier' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ]  },
//             { key: 'buyer_name.keyword', label: 'Buyer Name', chipGroupLabel: 'Buyer Name', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamBuyerSupplier' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'custom-search' ] },
//             { key: 'buyingDetails.ward.keyword', label: 'Buyer Ward', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamBuyerSupplier' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ] },
//             { key: 'buyingDetails.constituency.keyword', label: 'Buyer Constituency', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamBuyerSupplier' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ] },
//             { key: 'buyingDetails.county.keyword', label: 'Buyer County', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamBuyerSupplier' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ] },
//             { key: 'buyingDetails.postcode.keyword', label: 'Buyer Postcode', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamBuyerSupplier' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ] },
//             { key: 'buyingDetails.country.keyword', label: 'Buyer Country', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamBuyerSupplier' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ]  },
//             { key: 'awarded_value', label: 'Awarded Value', chipGroupLabel: 'Awarded Value', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ], componentFeatures: [ 'single', 'contract-finder-note' ] },
//         ]
//     },
//     suppliersDashboard: {
//         advanced: [
//             { key: 'supplierCpvIndustry', label: 'Supplier CPV Industry Code', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getCpvCodes' }, componentTypes: [ 'tree-list' ] },
//             { key: 'region.keyword', label: 'Supplier Region', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamBuyerSupplier' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ] },
//             { key: 'supplier_name.keyword', label: 'Supplier Name', chipGroupLabel: 'Supplier Name', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamBuyerSupplier' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'custom-search' ] },
//             { key: 'ward.keyword', label: 'Supplier Ward', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamBuyerSupplier' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ] },
//             { key: 'constituency.keyword', label: 'Supplier Constituency', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamBuyerSupplier' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ] },
//             { key: 'county.keyword', label: 'Supplier County', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamBuyerSupplier' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ] },
//             { key: 'postcode.keyword', label: 'Supplier Postcode', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamBuyerSupplier' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ] },
//             { key: 'country.keyword', label: 'Supplier Country', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getAggregateByParamBuyerSupplier' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ] },
//             { key: 'awarded_value', label: 'Awarded Value', chipGroupLabel: 'Awarded Value', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ], componentFeatures: [ 'single', 'contract-finder-note' ] },
//         ]
//     },
//     // esgIndex: {
//     //     advanced: [
//     //         { key: 'industryLending', label: 'SIC Industry', displayLabel: 'Industry', countryAccess: [ 'uk' ], withAggregation: true },
//     //         { key: 'statutoryAccounts.numberOfEmployees', label: 'Number of Employees', displayLabel: 'Employees', countryAccess: [ 'uk' ] },
//     //         { key: 'financials', label: 'Turnover', displayLabel: 'Turnover', chipGroupLabel: 'Key Financials' , countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ] }
//     //     ]
//     // },
//     accountSearch: {
//         advanced: [
//             {
//                 label: 'Saved Lists',
//                 chipGroupLabel: 'Saved Lists',
//                 countryAccess: [ 'uk', 'ie' ],
//                 componentTypes: [ 'list-box' ],
//                 componentFeatures: [ 'single', 'default-search' ],
//                 endPointForGetSavedList: { route: 'DG_LIST', endPoint: 'getUserListForAccountSearchScreen' }
//             },
//             {
//                 key: '',
//                 label: 'Keyword Search',
//                 countryAccess: [ 'uk' ],
//                 selected: true,
//                 items: [
//                     { key: 'companyRegistrationNumber', label: 'Search By Keyword', countryAccess: [ 'uk' ], forcedFeatureAccess: true, componentTypes: [ 'string-search' ], componentFeatures: [ 'multi', 'exclude-selected' ] },
//                 ]
//             },
//             {
//                 key: 'basicFilters',
//                 label: 'Company Profile',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'financials', label: 'Key Financials', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ] },
//                 ]
//             },
//             {
//                 key: 'address',
//                 label: 'Registered Location',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'RegAddress_Modified.postalCode.keyword', label: 'Post Code', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'aggQueryForAccountSearch', reqBy: 'accountSearch' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'custom-search', 'sort-by' ] },
//                     { key: 'RegAddress_Modified.district.keyword', label: 'Town / City', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'aggQueryForAccountSearch', reqBy: 'accountSearch' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi','default-search', 'sort-by' ]  },
//                     { key: 'RegAddress_Modified.county.keyword', label: 'County', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'aggQueryForAccountSearch', reqBy: 'accountSearch' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search' ,'sort-by' ]  },
//                     { key: 'RegAddress_Modified.region.keyword', label: 'Region', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'aggQueryForAccountSearch', reqBy: 'accountSearch' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ]  },
//                 ]
//             },
//             {
//                 key: 'industrySicCode',
//                 label: 'Industry',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'SicCodes', label: 'SIC Codes', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getIndustries' }, componentTypes: [ 'tree-list' ] },
//                     { key: 'industryTagList.keyword', label: 'Industry Tags', featureAccessKey: 'Industry', previousLabels: [ 'Industry', 'Standard Tags' ], countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'aggQueryForAccountSearch', reqBy: 'accountSearch' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] }
//                 ]
//             },
//             {
//                 key: 'accounts',
//                 label: 'Filed Accounts',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'accountsFilingDate', label: 'Last Filing Date', countryAccess: [ 'uk' ], dateRange: { fromMaxDate: currentDate, fromMinDate: (new Date()).setFullYear(currentDate.getFullYear() - 5 ), toMaxDate: (new Date()).setFullYear(currentDate.getFullYear() + 2 ) }, componentTypes: [ 'date-range' ] }
//                 ]
//             }
//         ]
//     },
//     chargesDescription: {
//         advanced: [
//             {
//                 key: '',
//                 label: 'Keyword Search',
//                 countryAccess: [ 'uk' ],
//                 selected: true,
//                 items: [
//                     { key: 'companyRegistrationNumber', label: 'Search By Keyword', countryAccess: [ 'uk' ], forcedFeatureAccess: true, componentTypes: [ 'string-search' ], componentFeatures: [ 'multi', 'exclude-selected' ] },
//                 ]
//             },
//             {
//                 key: 'basicFilters',
//                 label: 'Company Profile',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'financials', label: 'Key Financials', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ] },
//                 ]
//             },
//             {
//                 key: 'address',
//                 label: 'Registered Location',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'RegAddress_Modified.postalCode.keyword', label: 'Post Code', featureAccessKey: 'Post Code', countryAccess: [ 'uk' ], chipGroupLabel: 'Post Code', withAggregation: { route: 'DG_API', endpoint: 'aggQueryForAccountSearch', reqBy: 'chargesDescription' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'custom-search', 'sort-by' ] },
//                     { key: 'RegAddress_Modified.district.keyword', label: 'Town / City', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'aggQueryForAccountSearch', reqBy: 'chargesDescription' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'RegAddress_Modified.county.keyword', label: 'County', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'aggQueryForAccountSearch', reqBy: 'chargesDescription' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'RegAddress_Modified.region.keyword', label: 'Region', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'aggQueryForAccountSearch', reqBy: 'chargesDescription' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] },
//                 ]
//             },
//             {
//                 key: 'industrySicCode',
//                 label: 'Industry',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'SicCodes', label: 'SIC Codes', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getIndustries' }, componentTypes: [ 'tree-list' ] },
//                     { key: 'industryTagList.standardTags.keyword', label: 'Industry Tags', featureAccessKey: 'Industry', previousLabels: [ 'Industry', 'Standard Tags' ], countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'aggQueryForAccountSearch', reqBy: 'chargesDescription' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] }
//                 ]
//             },
//             {
//                 key: 'accounts',
//                 label: 'Filed Accounts',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'accountsFilingDate', label: 'Last Filing Date', countryAccess: [ 'uk' ], dateRange: { fromMaxDate: currentDate, fromMinDate: (new Date()).setFullYear(currentDate.getFullYear() - 5 ), toMaxDate: (new Date()).setFullYear(currentDate.getFullYear() + 2 ) }, componentTypes: [ 'date-range' ] }
//                 ]
//             }
//         ]
//     },
//     companyDescription: {
//         advanced: [
//             {
//                 key: '',
//                 label: 'Keyword Search',
//                 countryAccess: [ 'uk' ],
//                 selected: true,
//                 items: [
//                     { key: 'companyRegistrationNumber', label: 'Search By Keyword', countryAccess: [ 'uk' ], forcedFeatureAccess: true, componentTypes: [ 'string-search' ], componentFeatures: [ 'multi', 'exclude-selected' ] },
//                 ]
//             },
//             {
//                 key: 'basicFilters',
//                 label: 'Company Profile',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'financials', label: 'Key Financials', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ] },
//                 ]
//             },
//             {
//                 key: 'address',
//                 label: 'Registered Location',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'RegAddress_Modified.postalCode.keyword', label: 'Post Code',  featureAccessKey: 'Post Code', countryAccess: [ 'uk' ], chipGroupLabel: 'Post Code', withAggregation: { route: 'DG_API', endpoint: 'aggQueryForAccountSearch', reqBy: 'companyDescription' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'custom-search', 'sort-by' ] },
//                     { key: 'RegAddress_Modified.district.keyword', label: 'Town / City', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'aggQueryForAccountSearch', reqBy: 'companyDescription' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'RegAddress_Modified.county.keyword', label: 'County', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'aggQueryForAccountSearch', reqBy: 'companyDescription' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] },
//                     { key: 'RegAddress_Modified.region.keyword', label: 'Region', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'aggQueryForAccountSearch', reqBy: 'companyDescription' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi' ] },
//                 ]
//             },
//             {
//                 key: 'industrySicCode',
//                 label: 'Industry',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'SicCodes', label: 'SIC Codes', countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'getIndustries' }, componentTypes: [ 'tree-list' ] },
//                     { key: 'industryTagList.standardTags.keyword', label: 'Industry Tags', featureAccessKey: 'Industry', previousLabels: [ 'Industry', 'Standard Tags' ], countryAccess: [ 'uk' ], withAggregation: { route: 'DG_API', endpoint: 'aggQueryForAccountSearch', reqBy: 'companyDescription' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'default-search', 'sort-by' ] }
//                 ]
//             },
//             {
//                 key: 'accounts',
//                 label: 'Filed Accounts',
//                 countryAccess: [ 'uk' ],
//                 selected: false,
//                 items: [
//                     { key: 'accountsFilingDate', label: 'Last Filing Date', countryAccess: [ 'uk' ], dateRange: { fromMaxDate: currentDate, fromMinDate: (new Date()).setFullYear(currentDate.getFullYear() - 5 ), toMaxDate: (new Date()).setFullYear(currentDate.getFullYear() + 2 ) }, componentTypes: [ 'date-range' ] }
//                 ]
//             }
//         ]
//     },
//     companyLinkedIn: {
//         advanced: [
//             {
//                 label: 'Saved Lists',
//                 chipGroupLabel: 'Saved Lists',
//                 countryAccess: [ 'uk' ],
//                 componentTypes: [ 'list-box' ],
//                 componentFeatures: [ 'single', 'default-search' ],
//                 endPointForGetSavedList: { route: 'DG_LIST', endPoint: 'getUserListsByUserId', pageName: 'companyLinkedIn' }
//             },
//             {
//                 key: '',
//                 label: 'Keyword Search',
//                 countryAccess: [ 'uk' ],
//                 selected: true,
//                 items: [
//                     { key: 'companyRegistrationNumber', label: 'Search By Keyword', countryAccess: [ 'uk' ], forcedFeatureAccess: true, componentTypes: [ 'string-search' ], componentFeatures: [ 'multi', 'exact-search' ] },
//                 ]
//             }           
//         ]
//     },
//     personLinkedIn: {
//             advanced: [
//             {
//                 label: 'Saved Lists',
//                 chipGroupLabel: 'Saved Lists',
//                 countryAccess: [ 'uk' ],
//                 componentTypes: [ 'list-box' ],
//                 componentFeatures: [ 'single', 'default-search' ],
//                 endPointForGetSavedList: { route: 'DG_LIST', endPoint: 'getUserListsByUserId', pageName: 'personLinkedIn' }
//             },
//             {
//                 key: '',
//                 label: 'Person LinkedIn',
//                 countryAccess: [ 'uk' ],
//                 selected: true,
//                 items: [
//                     { key: 'companyRegistrationNumber', label: 'Search By Keyword', countryAccess: [ 'uk' ], forcedFeatureAccess: true, componentTypes: [ 'string-search' ], componentFeatures: [ 'multi', 'exact-search' ] },
//                     { key: 'companyRegistrationNumber', label: 'Search By Position', countryAccess: [ 'uk' ], forcedFeatureAccess: true, componentTypes: [ 'string-search' ], componentFeatures: [ 'multi', 'radio_button' ], additionalNote: '*Note: You can only add position either by search by position or choose from position filter' },
//                     { key: 'companyRegistrationNumber', label: 'Search By Institution Name', countryAccess: [ 'uk' ], forcedFeatureAccess: true, componentTypes: [ 'string-search' ], componentFeatures: [ 'multi' ] },
//                     { key: 'position.keyword', label: 'Position', optionalLabel: 'Position', chipGroupLabel: 'Person LinkedIn Position', countryAccess: [ 'uk' ], forcedFeatureAccess: true, withAggregation: { route: 'DG_API', endpoint: 'getAggDataForPersonLinkedIn', reqBy: 'personLinkedIn' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'multi', 'custom-search', 'sort-by' ], additionalNote: '*Note: You can only add position either by search by position or choose from position filter' },
//                     { key: 'education.start_time.keyword', label: 'Academics Start Year', optionalLabel: 'Academics Start Year', chipGroupLabel: 'Academics Start Year', countryAccess: [ 'uk' ], forcedFeatureAccess: true, withAggregation: { route: 'DG_API', endpoint: 'getAggDataForPersonLinkedIn', reqBy: 'personLinkedIn' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'default-search', 'sort-by' ] },
//                     { key: 'education.end_time.keyword', label: 'Academics End Year', optionalLabel: 'Academics End Year', chipGroupLabel: 'Academics End Year', countryAccess: [ 'uk' ], forcedFeatureAccess: true, withAggregation: { route: 'DG_API', endpoint: 'getAggDataForPersonLinkedIn', reqBy: 'personLinkedIn' }, componentTypes: [ 'list-box' ], componentFeatures: [ 'default-search', 'sort-by' ] },
//                     { key: 'numberOfEmployees', label: 'Number of Employees', optionalLabel: 'Number of Employees', chipGroupLabel: 'Number of Employees', countryAccess: [ 'uk' ], forcedFeatureAccess: true, withAggregation: { route: 'DG_API', endpoint: 'getAggDataForPersonLinkedIn', reqBy: 'personLinkedIn' }, componentTypes: [ 'input-range', 'list-box' ], componentFeatures: [ 'single' ] },
//                     { key: 'preferences', label: 'Preferences', chipGroupLabel: 'Preferences', countryAccess: [ 'uk' ], componentTypes: [ 'preference-options' ] },
//                     { key: 'financials', label: 'Turnover', optionalLabel: 'Key Financials', displayLabel: 'Key Financials', chipGroupLabel: 'Key Financials', countryAccess: [ 'uk' ], componentTypes: [ 'input-range' ] }
//                 ]
//             }           
//         ]
//     }
// }