// import { PreferenceOptionsType } from "../filter-option-types";

// export const PreferencesOptionIndex: PreferenceOptionsType[] = [
//     {
//         parentHeader: 'Company Profile',
//         options: [
//             {
//                 header: 'Risk Profile',
//                 items: [
//                     {
//                         label: 'CCJ',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasCCJInfo: 'true' },
//                                 outputLabel: 'Company Must Have CCJ.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasCCJInfo: 'false' },
//                                 outputLabel: 'Company Must Not Have CCJ.'
//                             }
//                         ],
//                         countryAccess: [ 'uk', 'ie' ]
//                     },
//                     {
//                         label: 'Charges Registered',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasCharges: 'true' },
//                                 outputLabel: 'Company Must Have Charges Details.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasCharges: 'false' },
//                                 outputLabel: 'Company Must Not Have Charges Details.'
//                             }
//                         ],
//                         countryAccess: [ 'uk', 'ie' ]
//                     },
//                     {
//                         label: 'Key Financials',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasFinances: 'true' },
//                                 outputLabel: 'Company Must Have Finances.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasFinances: 'false' },
//                                 outputLabel: 'Company Must Not Have Finances.'
//                             }
//                         ],
//                         countryAccess: [ 'uk', 'ie' ]
//                     },
//                     {
//                         label: 'Property Register Ownership',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasLandCorporate: 'true' },
//                                 outputLabel: 'Company Must Have Property Register Ownership.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasLandCorporate: 'false' },
//                                 outputLabel: 'Company Must Not Have Property Register Ownership.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'Furlough Staff',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasFurloughData: 'true' },
//                                 outputLabel: 'Company Must Have Furlough Data.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasFurloughData: 'false' },
//                                 outputLabel: 'Company Must Not Have Furlough Data.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'Disqualified Directors',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasDisqualifiedDirectors: 'true' },
//                                 outputLabel: 'Company Must Have Disqualified Directors.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasDisqualifiedDirectors: 'false' },
//                                 outputLabel: 'Company Must Not Have Disqualified Directors.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'Subsidiary',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { isSubsidiary: 'true' },
//                                 outputLabel: 'Company Must Be Subsidiary.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { isSubsidiary: 'false' },
//                                 outputLabel: 'Company Must Not Be Subsidiary.'
//                             }
//                         ],
//                         countryAccess: [ 'uk', 'ie' ]
//                     }
//                 ],
//                 countryAccess: [ 'uk', 'ie' ]
//             },
//             {
//                 header: 'Shareholdings',
//                 items: [
//                     {
//                         label: 'Shareholdings',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasShareholdings: 'true' },
//                                 outputLabel: 'Company Must Have Shareholdings.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasShareholdings: 'false' },
//                                 outputLabel: 'Company Must Not Have Shareholdings.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'HNWI',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasHNW1: 'true' },
//                                 outputLabel: 'Company Must Have HNW1.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasHNW1: 'false' },
//                                 outputLabel: 'Company Must Not Have HNW1.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'Is Shareholder Company',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { shareHolderType_company: 'true' },
//                                 outputLabel: 'Company Must Have Shareholder as Company.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { shareHolderType_company: 'false' },
//                                 outputLabel: 'Company Must Not Have Shareholder as Company.'
//                             }
//                         ],
//                         countryAccess: [ 'uk', 'ie' ]
//                     }
//                 ],
//                 countryAccess: [ 'uk', 'ie' ]
//             },
//             {
//                 header: 'Impacted Creditors and Write-offs',
//                 items: [
//                     {
//                         label: 'Impacted Creditors',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { isCreditor: 'true' },
//                                 outputLabel: 'Company Must Have Impacted Creditors.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { isCreditor: 'false' },
//                                 outputLabel: 'Company Must Not Have Impacted Creditors.'
//                             }
//                         ],
//                         countryAccess: [ 'uk', 'ie' ]
//                     },
//                     {
//                         label: 'Write-offs',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { isDebtor: 'true' },
//                                 outputLabel: 'Company Must Have Write-offs.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { isDebtor: 'false' },
//                                 outputLabel: 'Company Must Not Have Write-offs.'
//                             }
//                         ],
//                         countryAccess: [ 'uk', 'ie' ]
//                     }
//                 ],
//                 countryAccess: [ 'uk' ]
//             },
//             {
//                 header: 'PSC Information',
//                 items: [
//                     {
//                         label: 'PSC',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasPscData: 'true' },
//                                 outputLabel: 'Company Must Have PSC Information.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasPscData: 'false' },
//                                 outputLabel: 'Company Must Not Have PSC Information.'
//                             }
//                         ],
//                         countryAccess: [ 'uk', 'ie' ]
//                     }
//                 ],
//                 countryAccess: [ 'uk' ]
//             },
//             {
//                 header: 'Acquisitions',
//                 items: [
//                     {
//                         label: 'Acquired Company',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasAcquiredCompany: 'true' },
//                                 outputLabel: 'Company Must Have Acquired Company.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasAcquiredCompany: 'false' },
//                                 outputLabel: 'Company Must Not Have Acquired Company.'
//                             }
//                         ],
//                         countryAccess: [ 'uk', 'ie' ]
//                     },
//                     {
//                         label: 'Acquiring Company',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasAcquiringCompany: 'true' },
//                                 outputLabel: 'Company Must Have Acquiring.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasAcquiringCompany: 'false' },
//                                 outputLabel: 'Company Must Not Have Acquiring.'
//                             }
//                         ],
//                         countryAccess: [ 'uk', 'ie' ]
//                     }
//                 ],
//                 countryAccess: [ 'uk' ]
//             },
//             {
//                 header: 'Special Status',
//                 items: [
//                     {
//                         label: 'Dormant Companies',
//                         controllers: [
//                             {
//                                 label: 'Include',
//                                 value: false,
//                                 preferenceOperator: { dormant_status: 'include' },
//                                 outputLabel: 'Include dormant companies.'
//                             },
//                             {
//                                 label: 'Only',
//                                 value: false,
//                                 preferenceOperator: { dormant_status: 'only' },
//                                 outputLabel: 'Only dormant companies.'
//                             }
//                         ],
//                         countryAccess: [ 'uk', 'ie' ]
//                     }
//                 ],
//                 countryAccess: [ 'uk' ]
//             },
//             // {
//             //     header: 'Government Procurement',
//             //     items: [
//             //         {
//             //             label: 'Is Supplier',
//             //             controllers: [
//             //                 {
//             //                     label: 'Yes',
//             //                     value: false,
//             //                     preferenceOperator: { isSupplier: 'true' },
//             //                     outputLabel: 'Company Must Have Supplier.'
//             //                 },
//             //                 {
//             //                     label: 'No',
//             //                     value: false,
//             //                     preferenceOperator: { isSupplier: 'false' },
//             //                     outputLabel: 'Company Must Not Have Supplier.'
//             //                 }
//             //             ]
//             //         },
//             //         {
//             //             label: 'Is Buyer',
//             //             controllers: [
//             //                 {
//             //                     label: 'Yes',
//             //                     value: false,
//             //                     preferenceOperator: { isBuyer: 'true' },
//             //                     outputLabel: 'Company Must Have Buyer.'
//             //                 },
//             //                 {
//             //                     label: 'No',
//             //                     value: false,
//             //                     preferenceOperator: { isBuyer: 'false' },
//             //                     outputLabel: 'Company Must Not Have Buyer.'
//             //                 }
//             //             ]
//             //         }
//             //     ]
//             // },
//             {
//                 header: 'Assets',
//                 items: [
//                     {
//                         label: 'Patent Data',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasPatentData: 'true' },
//                                 outputLabel: 'Company Must Have Patent Data.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasPatentData: 'false' },
//                                 outputLabel: 'Company Must Not Have Patent Data.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'Innovate Data',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasInnovateData: 'true' },
//                                 outputLabel: 'Company Must Have Innovate Data.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasInnovateData: 'false' },
//                                 outputLabel: 'Company Must Not Have Innovate Data.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     }
//                 ],
//                 countryAccess: [ 'uk' ]
//             },
//             // {
//             //     header: 'Environment Agency Regd.',
//             //     items: [
//             //         {
//             //             label: 'ECS Data',
//             //             controllers: [
//             //                 {
//             //                     label: 'Yes',
//             //                     value: false,
//             //                     preferenceOperator: { hasEcsData: 'true' },
//             //                     outputLabel: 'Company Must Have ECS Data.'
//             //                 },
//             //                 {
//             //                     label: 'No',
//             //                     value: false,
//             //                     preferenceOperator: { hasEcsData: 'false' },
//             //                     outputLabel: 'Company Must Not Have ECS Data.'
//             //                 }
//             //             ]
//             //         }
//             //     ]
//             // },
//         ]
//     },
//     {
//         parentHeader: 'Personnel Contact Information',
//         options: [
//             {
//                 header: 'Employee Contact',
//                 items: [
//                     {
//                         label: 'Email',
//                         controlLabel: 'Employee Email',
//                         disabledCheck: true,
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasPersonEmail: 'true' },
//                                 outputLabel: 'Person Must Have Employee Email.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'LinkedIn',
//                         controlLabel: 'Employee LinkedIn',
//                         disabledCheck: true,
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasPersonLinkedIn: 'true' },
//                                 outputLabel: 'Person Must Have Employee LinkedIn.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     }
//                 ],
//                 countryAccess: [ 'uk' ]
//             },
//             {
//                 header: 'Director Contact',
//                 items: [
//                     {
//                         label: 'Email',
//                         controlLabel: 'Director Email',
//                         disabledCheck: true,
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasDirectorEmail: 'true' },
//                                 outputLabel: 'Person Must Have Director Email.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'LinkedIn',
//                         controlLabel: 'Director LinkedIn',
//                         disabledCheck: true,
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasDirectorLinkedIn: 'true' },
//                                 outputLabel: 'Person Must Have Director LinkedIn.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     }
//                 ],
//                 countryAccess: [ 'uk' ]
//             },
//             {
//                 header: 'Person With Significant Control Contact',
//                 items: [
//                     {
//                         label: 'Email',
//                         controlLabel: 'PSC Email',
//                         disabledCheck: true,
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasPSCEmail: 'true' },
//                                 outputLabel: 'Person Must Have PSC Email.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'LinkedIn',
//                         controlLabel: 'PSC LinkedIn',
//                         disabledCheck: true,
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasPSCLinkedIn: 'true' },
//                                 outputLabel: 'Person Must Have PSC LinkedIn.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     }
//                 ],
//                 countryAccess: [ 'uk' ]
//             }
//         ]
//     },
//     {
//         parentHeader: 'Company Contact Information',
//         options: [
//             {
//                 header: 'Company Contact Information',
//                 items: [
//                     {
//                         label: 'Website',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasWebsite: "true" },
//                                 outputLabel: 'Company Must Have A Website.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasWebsite: "false" },
//                                 outputLabel: 'Company Must Not Have A Website.'
//                             }
//                         ],
//                         countryAccess: [ 'uk', 'ie' ]
//                     },
//                     {
//                         label: 'Email Address',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasCompanyGenericMail: "true" },
//                                 outputLabel: 'Company Must Have A Generic Email Address.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasCompanyGenericMail: "false" },
//                                 outputLabel: 'Company Must Not Have A Generic Email Address.'
//                             }
//                         ],
//                         countryAccess: [ 'uk', 'ie' ]
//                     },
//                     {
//                         label: 'LinkedIn',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasCompanyLinkedIn: "true" },
//                                 outputLabel: 'Company Must Have LinkedIn.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasCompanyLinkedIn: "false" },
//                                 outputLabel: 'Company Must Not Have LinkedIn.'
//                             }
//                         ],
//                         countryAccess: [ 'uk', 'ie' ]
//                     },
//                     {
//                         label: 'Phone Number',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasContactNumber: "true" },
//                                 outputLabel: 'Company Must Have A Phone Number.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasContactNumber: "false" },
//                                 outputLabel: 'Company Must Not Have A Phone Number.'
//                             }
//                         ],
//                         countryAccess: [ 'uk', 'ie' ]
//                     },
//                     {
//                         label: 'Mobile Number',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasMobileNumber: "true" },
//                                 outputLabel: 'Company Must Have A Mobile Number.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasMobileNumber: "false" },
//                                 outputLabel: 'Company Must Not Have A Mobile Number.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'CTPS',
//                         controllers: [
//                             {
//                                 label: 'Include',
//                                 value: false,
//                                 preferenceOperator: { hasCtpsNumber: "true" },
//                                 outputLabel: 'Include CTPS.'
//                             },
//                             {
//                                 label: 'Exclude',
//                                 value: false,
//                                 preferenceOperator: { hasCtpsNumber: "false" },
//                                 outputLabel: 'Company Must Not Have CTPS.'
//                             }
//                         ],
//                         countryAccess: [ 'uk', 'ie' ]
//                     }
//                 ],
//                 countryAccess: [ 'uk', 'ie' ]
//             }
//         ]
//     },
//     {
//         parentHeader: 'By Owners',
//         options: [
//             {
//                 header: 'Owned By',
//                 items: [
//                     {
//                         label: 'Male',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { companyFoundedByMale: "true" },
//                                 outputLabel: 'Company Must Be Owned By Male.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'Female',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { companyFoundedByFemale: "true" },
//                                 outputLabel: 'Company Must Be Owned By Female.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     }
//                 ],
//                 countryAccess: [ 'uk' ]
//             }
//         ]
//     },
//     {
//         parentHeader: 'Diversity',
//         options: [
//             {
//                 header: 'Ethnic Minorities',
//                 items: [
//                     {
//                         label: 'All Ethnic Minorities',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { is_ethnic_ownership: "true" },
//                                 outputLabel: 'Company Must Be Ethnic Minorities.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { is_ethnic_ownership: "false" },
//                                 outputLabel: 'Company Must Not Be Ethnic Minorities.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'British Ethnic Minorities',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { is_british_owned: "true" },
//                                 outputLabel: 'Company Must Be British Ethnic Minorities.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { is_british_owned: "false" },
//                                 outputLabel: 'Company Must Not Be British Ethnic Minorities.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'Non-British Ethnic Minorities',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { is_non_british_owned: "true" },
//                                 outputLabel: 'Company Must Be Non-British Ethnic Minorities.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { is_non_british_owned: "false" },
//                                 outputLabel: 'Company Must Not Be Non-British Ethnic Minorities.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     }
//                 ],
//                 countryAccess: [ 'uk' ]
//             }
//         ]
//     },
//     {
//         parentHeader: 'Environment Agency Regd.',
//         options: [
//             {
//                 header: 'Environment Agency Regd.',
//                 items: [
//                     {
//                         label: 'Waste Carriers Brokers',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasWasteCarriersBrokers: "true" },
//                                 outputLabel: 'Company Must Have Waste Carriers Brokers.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasWasteCarriersBrokers: "false" },
//                                 outputLabel: 'Company Must Not Have Waste Carriers Brokers.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'Waste Exemptions',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasWastExemptions: "true" },
//                                 outputLabel: 'Company Must Have Waste Exemptions.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasWastExemptions: "false" },
//                                 outputLabel: 'Company Must Not Have Waste Exemptions.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'Scrap Metal Dealers',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasScrapMetalDealers: "true" },
//                                 outputLabel: 'Company Must Have Scrap Metal Dealers.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasScrapMetalDealers: "false" },
//                                 outputLabel: 'Company Must Not Have Scrap Metal Dealers.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'Enforcement Actions',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasEnforcementActions: "true" },
//                                 outputLabel: 'Company Must Have Enforcement Actions.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasEnforcementActions: "false" },
//                                 outputLabel: 'Company Must Not Have Enforcement Actions.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'Flood Risk Exemptions',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasFloodRiskExemptions: "true" },
//                                 outputLabel: 'Company Must Have Flood Risk Exemptions.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasFloodRiskExemptions: "false" },
//                                 outputLabel: 'Company Must Not Have Flood Risk Exemptions.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'Radioactive Substance',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasRadioactiveSubstance: "true" },
//                                 outputLabel: 'Company Must Have Radioactive Substance.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasRadioactiveSubstance: "false" },
//                                 outputLabel: 'Company Must Not Have Radioactive Substance.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'Industrial Installation',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasIndustrialInstallation: "true" },
//                                 outputLabel: 'Company Must Have Industrial Installation.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasIndustrialInstallation: "false" },
//                                 outputLabel: 'Company Must Not Have Industrial Installation.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'Waste Operations',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasWasteOperations: "true" },
//                                 outputLabel: 'Company Must Have Waste Operations.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasWasteOperations: "false" },
//                                 outputLabel: 'Company Must Not Have Waste Operations.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'End of Life Vehicles',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasEndOfLifeVehicles: "true" },
//                                 outputLabel: 'Company Must Have End Of Life Vehicles.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasEndOfLifeVehicles: "false" },
//                                 outputLabel: 'Company Must Not Have End Of Life Vehicles.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'Water Discharges',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasWaterDischarges: "true" },
//                                 outputLabel: 'Company Must Have Water Discharges.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasWaterDischarges: "false" },
//                                 outputLabel: 'Company Must Not Have Water Discharges.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'Compliance Score',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasComplianceScore: "true" },
//                                 outputLabel: 'Company Must Have Compliance Score.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasComplianceScore: "false" },
//                                 outputLabel: 'Company Must Not Have Compliance Score.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     }
//                 ],
//                 countryAccess: [ 'uk', 'ie' ]
//             }
//         ],
//         countryAccess: [ 'uk', 'ie' ]
//     },
//     {
//         parentHeader: 'International Trade',
//         options: [
//             {
//                 header: '',
//                 items: [
//                     {
//                         label: 'Exchange Rate Effect',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasExchangeRateEffect: "true" },
//                                 outputLabel: 'Company Must Have Exchange Rate Effect.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasExchangeRateEffect: "false" },
//                                 outputLabel: 'Company Must Not Have Exchange Rate Effect.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     }
//                 ],
//                 countryAccess: [ 'uk' ]
//             },
//             {
//                 header: '',
//                 items: [
//                     {
//                         label: 'Importers',
//                         controllers: [
//                             {
//                                 label: 'Only',
//                                 value: false,
//                                 preferenceOperator: { hasImportData: "true" },
//                                 outputLabel: 'Company Must Have Import Data.'
//                             },
//                             {
//                                 label: 'Exclude',
//                                 value: false,
//                                 preferenceOperator: { hasImportData: "false" },
//                                 outputLabel: 'Company Must Not Have Import Data.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'Exporters',
//                         controllers: [
//                             {
//                                 label: 'Only',
//                                 value: false,
//                                 preferenceOperator: { hasExportData: "true" },
//                                 outputLabel: 'Company Must Have Export Data.'
//                             },
//                             {
//                                 label: 'Exclude',
//                                 value: false,
//                                 preferenceOperator: { hasExportData: "false" },
//                                 outputLabel: 'Company Must Not Have Export Data.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     }
//                 ],
//                 countryAccess: [ 'uk' ]
//             }
//         ],
//         countryAccess: [ 'uk', 'ie' ]
//     },
//     {
//         parentHeader: 'Person LinkedIn',
//         options: [
//             {
//                 header: 'Preferences',
//                 items: [
//                     {
//                         label: 'Website',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasWebsite: "true" },
//                                 outputLabel: 'Company Must Have A Website.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasWebsite: "false" },
//                                 outputLabel: 'Company Must Not Have A Website.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     },
//                     {
//                         label: 'Company Number',
//                         controllers: [
//                             {
//                                 label: 'Yes',
//                                 value: false,
//                                 preferenceOperator: { hasCompanyNumber: "true" },
//                                 outputLabel: 'Company Must Have A Company Number.'
//                             },
//                             {
//                                 label: 'No',
//                                 value: false,
//                                 preferenceOperator: { hasCompanyNumber: "false" },
//                                 outputLabel: 'Company Must Not Have A Company Number.'
//                             }
//                         ],
//                         countryAccess: [ 'uk' ]
//                     }
//                 ],
//                 countryAccess: [ 'uk' ]
//             }
//         ]
//     }
// ]