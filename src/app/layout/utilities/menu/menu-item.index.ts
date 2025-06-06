// import { ExtendedMainMenuItems } from "src/app/interface/auth-guard/user-auth/user-info";

// const MenuItemConst: ExtendedMainMenuItems[] = [
//     {
//         label: 'Dashboard',
//         icon: 'home',
//         accessType: 'public',
//         items: [
//             {
//                 label: 'Dashboard',
//                 icon: 'home',
//                 routerLink: ['/'],
//                 accessType: 'public'
//             },
//             {
//                 label: 'Company Search',
//                 icon: 'search',
//                 routerLink: ['/company-search'],
//                 accessType: 'public'
//             },
//             {
//                 label: 'Search With AI',
//                 icon: 'travel_explore',
//                 routerLink: ['/ai-search'],
//                 accessType: 'restricted',
//                 addOnCheck: 'developerFeatures',
//             }
//         ]
//     },
//     {
//         label: 'Smart Intel',
//         icon: 'network_intelligence_history',
//         accessType: 'restricted',
//         countryAccess: [ 'uk' ],
//         addOnCheck: 'smartIntel',
//         items: [
//             {
//                 label: 'Dashboard',
//                 icon: 'dashboard',
//                 routerLink: ['/workflow/dashboard'],
//                 accessType: 'public'
//             },
//             {
//                 label: 'Clients',
//                 icon: 'badge',
//                 routerLink: ['/workflow/clients'],
//                 accessType: 'restricted'
//             },
//             {
//                 label: 'Suppliers',
//                 icon: 'emoji_transportation',
//                 routerLink: ['/workflow/suppliers'],
//                 accessType: 'restricted'
//             },
//             // {
//             //     label: 'Prospects',
//             //     icon: 'fact_check',
//             //     routerLink: ['/workflow/prospects'],
//             //     accessType: 'restricted'
//             // },
//             {
//                 label: 'Accounts',
//                 icon: 'manage_accounts',
//                 routerLink: ['/workflow/accounts'],
//                 accessType: 'restricted'
//             },
//             {
//                 label: 'Related Party Intel',
//                 icon: 'fact_check',
//                 routerLink: ['/workflow/related-party-intel'],
//                 accessType: 'restricted',
//                 addOnCheck: 'developerFeatures',
//             }
//         ]
//     },
//     {
//         label: 'My Folders',
//         icon: 'list',
//         accessType: 'restricted',
//         countryAccess: [ 'uk', 'ie' ],
//         items: [
//             {
//                 label: 'Saved Filters',
//                 icon: 'find_in_page',
//                 routerLink: ['list/saved-filters'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk', 'ie' ]
//             },
//             {
//                 label: 'Saved Lists',
//                 icon: 'list',
//                 routerLink: (['list/saved-lists']),
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk', 'ie' ]
//             },
//             {
//                 label: 'Favourites',
//                 icon: 'favorite',
//                 routerLink: ['company-search/Favourites'],
//                 listIdToken: 'userFavourite_id',
//                 queryParams: {
//                     listPageName: 'company Search',
//                     listName: 'Favourites'
//                 },
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ]
//             },
//             {
//                 label: 'Exported Bucket',
//                 icon: 'publish',
//                 routerLink: ['company-search/Exported Bucket'],
//                 listIdToken: 'exportedBucket_id',
//                 queryParams: {
//                     listPageName: 'exportedBucket',
//                     listName: 'Exported Bucket'
//                 },
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ]
//             },
//             {
//                 label: 'Upload CSV',
//                 icon: 'file_upload',
//                 styleClass: 'hidden lg:block',
//                 routerLink: ['common-features/upload-csv'],
//                 /*featureLockedBoolean: this.subscribedPlanModal['Valentine_Special'].includes( this.currentPlan ) ? true : false,*/
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ]
//             },
//             {
//                 label: 'Linkedin Upload CSV',
//                 icon: 'file_upload',
//                 styleClass: 'hidden lg:block',
//                 routerLink: ['common-features/linkedin-upload-csv'],
//                 /*featureLockedBoolean: this.subscribedPlanModal['Valentine_Special'].includes( this.currentPlan ) ? true : false,*/
//                 accessType: 'restricted',
//                 addOnCheck: 'developerFeatures',
//             },
//             {
//                 label: 'Contact Lists',
//                 icon: 'list',
//                 routerLink: ['list/contact-lists'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 roles: ['Under Development'],
//                 addOnCheck: 'contactInformation'
//             },
//             {
//                 label: 'Exported Files',
//                 icon: 'file_download',
//                 routerLink: ['list/exported-files'],
//                 styleClass: 'hidden lg:block',
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk', 'ie' ]
//             },
//             {
//                 label: 'CBF Exported Files',
//                 icon: 'file_download',
//                 routerLink: ['list/cbf-exported-files'],
//                 styleClass: 'hidden lg:block',
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 roles: ['Super Admin'],
//                 wildCardCheck: { companyNumber: '12351197' }
//             },
//             {
//                 label: 'Exported Emails',
//                 icon: 'mail',
//                 routerLink: ['list/exported-emails'],
//                 styleClass: 'hidden lg:block',
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk', 'ie' ],
//                 addOnCheck: 'emailSpotter'
//             },
//             {
//                 label: 'PDF Reports',
//                 icon: 'pi pi-file-pdf',
//                 routerLink: ['list/pdf-reports'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ]
//             },
//             {
//                 label: 'CRM',
//                 icon: 'file_download',
//                 routerLink: ['list/crm'],
//                 styleClass: 'hidden lg:block',
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'crmExport'
//             },
//             {
//                 label: 'Notes',
//                 icon: 'event_note',
//                 routerLink: ['list/notes'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ]
//             },
//             {
//                 label: 'Salesforce Sync',
//                 icon: 'sync',
//                 routerLink: ['list/salesforce-sync'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ]
//             }
//         ]
//     },
//     {
//         label: 'Business Intelligence',
//         icon: 'bar_chart',
//         accessType: 'restricted',
//         countryAccess: [ 'uk' ],
//         items: [
//             {
//                 label: 'Corporate Risk',
//                 icon: 'assured_workload',
//                 routerLink: ['insights/corporate-risk'],
//                 styleClass: 'hidden lg:block',
//                 /*featureLockedBoolean: this.subscribedPlanModal['Valentine_Special'].includes( this.currentPlan ) ? true : false,*/
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'corporateRiskLandscape'
//             },
//             {
//                 label: 'International Trade',
//                 icon: 'connecting_airports',
//                 routerLink: ['insights/international-trade'],
//                 styleClass: 'hidden lg:block',
//                 /*featureLockedBoolean: this.subscribedPlanModal['Valentine_Special'].includes( this.currentPlan ) ? true : false,*/
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'internationalTradeLandscape'
//             },
//             {
//                 label: 'Lending',
//                 icon: 'waterfall_chart',
//                 routerLink: ['insights/lending'],
//                 /*featureLockedBoolean: this.subscribedPlanModal['Valentine_Special'].includes( this.currentPlan ) ? true : false,*/
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'lendingLandscape'
//             }            
//         ]
//     },
//     {
//         label: 'Investment Research',
//         icon: 'present_to_all',
//         accessType: 'restricted',
//         countryAccess: [ 'uk' ],
//         items: [
//             {
//                 label: 'Investor Finder',
//                 icon: 'query_stats',
//                 routerLink: ['insights/investor-finder'],
//                 styleClass: 'hidden lg:block',
//                 /*featureLockedBoolean: this.subscribedPlanModal['Valentine_Special'].includes( this.currentPlan ) ? true : false,*/
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'investorInvesteeLandscape'
//             },
//             {
//                 label: 'Investee Finder',
//                 icon: 'query_stats',
//                 routerLink: ['insights/investee-finder'],
//                 styleClass: 'hidden lg:block',
//                 /*featureLockedBoolean: this.subscribedPlanModal['Valentine_Special'].includes( this.currentPlan ) ? true : false,*/
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'investorInvesteeLandscape'
//             },
//             {
//                 label: 'HNWI',
//                 icon: 'price_change',
//                 routerLink: ['insights/hnwi'],
//                 styleClass: 'hidden lg:block',
//                 /*featureLockedBoolean: this.subscribedPlanModal['Valentine_Special'].includes( this.currentPlan ) ? true : false,*/
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'hnwiLandscape'
//             }            
//         ]
//     },
//     {
//         label: 'Text Search Analysis',
//         icon: 'analytics',
//         accessType: 'restricted',
//         countryAccess: [ 'uk' ],
//         items: [
//             {
//                 label: 'Account Search',
//                 icon: 'person_search',
//                 routerLink: ['insights/account-search'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'accountSearch'
//             },
//             {
//                 label: 'Company Description',
//                 icon: 'fact_check',
//                 routerLink: ['insights/company-description'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'companyDescription'
//             },
//             {
//                 label: 'Charges Description',
//                 icon: 'gavel',
//                 routerLink: ['insights/charges-description'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'chargesDescription'
//             }            
//         ]
//     },
//     {
//         label: 'Linkedin Contact',
//         icon: 'dataset_linked',
//         accessType: 'restricted',
//         countryAccess: [ 'uk' ],
//         items: [
//             {
//                 label: 'Company LinkedIn',
//                 icon: 'real_estate_agent',
//                 routerLink: ['insights/company-LinkedIn'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'companyLinkedIn'
//             },
//             {
//                 label: 'Person LinkedIn',
//                 icon: 'pi pi-linkedin',
//                 routerLink: ['insights/person-LinkedIn'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'personLinkedIn'
//             }            
//         ]
//     },
//     {
//         label: 'Responsible Procurement',
//         icon: 'diversity_2',
//         accessType: 'restricted',
//         countryAccess: [ 'uk' ],
//         items: [
//             {
//                 label: 'Female Owned',
//                 icon: 'face_3',
//                 routerLink: ['stats-insights/female-owned'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'femaleFounder'
//             },
//             {
//                 label: 'Ethnic Diversity',
//                 icon: 'reduce_capacity',
//                 routerLink: ['stats-insights/ethnic-diversity'],
//                 styleClass: 'hidden lg:block',
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'ethnicDiversity'
//             },   
//             {
//                 label: 'Charities',
//                 icon: 'business',
//                 routerLink: ['stats-insights/charities'],
//                 styleClass: 'hidden lg:block',
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'charities'
//             },
//             {
//                 label: 'Military Veterans',
//                 icon: 'military_tech',
//                 routerLink: ['stats-insights/militaryVeterans'],
//                 styleClass: 'hidden lg:block',
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'developerFeatures'
//             },   
//             {
//                 label: 'B Corp Certified Business',
//                 icon: 'corporate_fare',
//                 routerLink: ['stats-insights/bCorpCertifiedBusiness'],
//                 styleClass: 'hidden lg:block',
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'developerFeatures'
//             },
//             {
//                 label: 'Net-Zero Commitments',
//                 icon: 'warehouse',
//                 routerLink: ['stats-insights/netZeroCommitments'],
//                 styleClass: 'hidden lg:block',
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'developerFeatures'
//             },
//             {
//                 label: 'Net-Zero Commitments List',
//                 icon: 'pi pi-slack',
//                 routerLink: ['insights/net-zero-target'],
//                 styleClass: 'hidden lg:block',
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'developerFeatures'
//             },
//             {
//                 label: 'Prompt Payment Code',
//                 icon: 'pi pi-code',
//                 routerLink: ['insights/promptPaymentCode'],
//                 styleClass: 'hidden lg:block',
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'developerFeatures'
//             },                          
//             {
//                 label: 'Responsible Procurement',
//                 icon: 'diversity_2',
//                 routerLink: ['insights/responsible-procurement'],
//                 styleClass: 'hidden lg:block',
//                 /*featureLockedBoolean: this.subscribedPlanModal['Valentine_Special'].includes( this.currentPlan ) ? true : false,*/
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'diversityAndInclusion'
//             },
//             {
//                 label: 'Diversity Calculation',
//                 icon: 'webhook',
//                 routerLink: ['insights/supplier-analytics'],
//                 styleClass: 'hidden lg:block',
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'diversityCalculation'
//             }      
//         ]
//     },
//     {
//         label: 'Deep Insights',
//         icon: 'auto_stories',
//         accessType: 'restricted',
//         countryAccess: [ 'uk' ],
//         items: [
//             {
//                 label: 'Compare Companies',
//                 icon: 'compare',
//                 routerLink: ['deep-insights/compare-company'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ]
//             },
//             {
//                 label: 'Related Party',
//                 icon: 'groups',
//                 routerLink: ['deep-insights/related-party'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//             },
//             {
//                 label: 'Stats Comparison',
//                 icon: 'auto_stories',
//                 routerLink: ['company-search/stats-compare'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'statsComparison',
//             }
//         ]
//     },
//     // {
//     //     label: 'Sustainability',
//     //     icon: 'ui-icon-people',
//     //     accessType: 'restricted',
//     //     countryAccess: [ 'uk' ],
//     //     roles: ['Super Admin'],
//     //     items: [
//     //         {
//     //             label: 'ESG Watch',
//     //             icon: 'ui-icon-business',
//     //             routerLink: ['esg/esg-watch'],
//     //             accessType: 'restricted',
//     //             countryAccess: [ 'uk' ],
//     //             roles: ['Super Admin']
//     //         },
//     //         {
//     //             label: 'ESG Index',
//     //             icon: 'ui-icon-business',
//     //             routerLink: ['esg/esg-sme-index'],
//     //             accessType: 'restricted',
//     //             countryAccess: [ 'uk' ],
//     //             roles: ['Super Admin']
//     //         }
//     //     ]
//     // },
//     {
//         label: 'Automations',
//         accessType: 'restricted',
//         countryAccess: [ 'uk' ],
//         roles: ['Under Development'],
//         items: [
//             {
//                 label: 'Automation Scheduler',
//                 icon: 'automation',
//                 routerLink: ['scheduler/automation-scheduler'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 roles: ['Under Development']
//             }
//         ]
//     },
//     {
//         label: 'Company Insights',
//         icon: 'analytics',
//         accessType: 'restricted',
//         countryAccess: [ 'uk' ],
//         items: [
//             {
//                 label: 'Insights - Yearly',
//                 icon: 'analytics',
//                 routerLink: ['insights/insights-yearly'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ]
//             },
//             {
//                 label: 'Insights - Monthly',
//                 icon: 'analytics',
//                 routerLink: ['insights/insights-monthly'],
//                 styleClass: 'hidden lg:block',
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ]
//             },
//             {
//                 label: 'Furlough Insights',
//                 icon: 'analytics',
//                 routerLink: ['insights/furlough-insights'],
//                 styleClass: 'hidden lg:block',
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ]
//             }
//         ]
//     },
//     {
//         label: 'Industry Analysis',
//         icon: 'domain',
//         styleClass: 'hidden lg:block',
//         accessType: 'restricted',
//         countryAccess: [ 'uk' ],
//         items: [
//             {
//                 label: 'Industry Sectors ',
//                 icon: 'domain',
//                 routerLink: ['industry-analysis/industry-sectors'],
//                 /*featureLockedBoolean: this.subscribedPlanModal['Valentine_Special'].includes( this.currentPlan ) ? true : false,*/
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'industryAnalysis'
//             },
//             {
//                 label: 'Saved Portfolios',
//                 icon: 'list',
//                 routerLink: ['industry-analysis/saved-portfolios'],
//                 /*featureLockedBoolean: this.subscribedPlanModal['Valentine_Special'].includes( this.currentPlan ) ? true : false,*/
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'industryAnalysis'
//             }
//         ]
//     },
//     {
//         label: 'Government Procurement',
//         icon: 'folder_shared',
//         accessType: 'restricted',
//         countryAccess: [ 'uk' ],
//         addOnCheck: 'governmentEnabler',
//         items: [
//             {
//                 label: 'Contract Finder',
//                 icon: 'content_paste_search',
//                 routerLink: ['company-search/contract-finder'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ]
//             },
//             // {
//             //     label: 'Buyer',
//             //     icon: 'account_balance',
//             //     routerLink: ['company-search/buyer-dashboard'],
//             //     accessType: 'restricted',
//             //     countryAccess: [ 'uk' ]
//             // },
//             // {
//             //     label: 'Supplier',
//             //     icon: 'model_training',
//             //     routerLink: ['company-search/supplier-dashboard'],
//             //     accessType: 'restricted',
//             //     countryAccess: [ 'uk' ]
//             // }
//         ]
//     },
//     {
//         label: 'Property Intelligence',
//         icon: 'map',
//         accessType: 'restricted',
//         countryAccess: [ 'uk' ],
//         addOnCheck: 'propertyIntelligence',
//         items: [
//             {
//                 label: 'Property Register',
//                 icon: 'map',
//                 routerLink: ['company-search/property-register'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ]
//             },
//             {
//                 label: 'Residential Property',
//                 icon: 'place',
//                 routerLink: ['company-search/residential-property'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ]
//             }
//         ]
//     },
//     {
//         label: 'Monitoring & Control',
//         icon: 'visibility',
//         accessType: 'restricted',
//         countryAccess: [ 'uk' ],
//         items: [
//             {
//                 label: 'Business Monitor',
//                 icon: 'visibility',
//                 routerLink: ['list/business-monitor'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ]
//             },
//             {
//                 label: 'Business Monitor Plus',
//                 icon: 'visibility',
//                 routerLink: ['list/business-monitor-plus'],
//                 styleClass: 'hidden lg:block',
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 addOnCheck: 'companyMonitorPlus'
//             },
//             {
//                 label: 'Client Watch',
//                 icon: 'business',
//                 routerLink: ['list/client-watch'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//             },
//             {
//                 label: 'Director Watch',
//                 icon: 'visibility',
//                 routerLink: ['list/director-watch'],
//                 styleClass: 'hidden lg:block',
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//             }
//         ]
//     },
//     {
//         label: 'Help Videos',
//         icon: 'ondemand_video',
//         accessType: 'public',
//         countryAccess: [ 'uk', 'ie' ],
//         items: [
//             {
//                 label: 'Videos',
//                 icon: 'ondemand_video',
//                 routerLink: ['common-features/videos'],
//                 accessType: 'public',
//                 countryAccess: [ 'uk', 'ie' ],
//             }
//         ]
//     },
//     {
//         label: 'User Group',
//         icon: 'feedback',
//         styleClass: 'hidden lg:block',
//         accessType: 'restricted',
//         countryAccess: [ 'uk' ],
//         items: [
//             {
//                 label: 'Feedback',
//                 icon: 'feedback',
//                 routerLink: ['common-features/feedback'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ]
//             }
//         ]
//     },
//     {
//         label: 'API',
//         icon: 'description',
//         accessType: 'restricted',
//         countryAccess: [ 'uk' ],
//         items: [
//             {
//                 label: 'API Selection',
//                 icon: 'description',
//                 routerLink: ['common-features/api-section'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ]
//             }
//         ]
//     },
//     {
//         label: 'Setup',
//         icon: 'file_upload',
//         accessType: 'restricted',
//         countryAccess: [ 'uk' ],
//         items: [
//             {
//                 label: 'DG Extension',
//                 icon: 'extension',
//                 // command: () => window.open('https://chrome.google.com/webstore/detail/datagardener/lglclegdgfhpcagdfljfckhnmkceblfp?hl=en', '_blank'),
//                 url: 'https://chrome.google.com/webstore/detail/datagardener/lglclegdgfhpcagdfljfckhnmkceblfp?hl=en',
//                 target: '_blank',
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ]
//             }
//         ]
//     },
//     {
//         label: 'Admin',
//         icon: 'manage_accounts',
//         accessType: 'restricted',
//         countryAccess: [ 'uk' ],
//         roles: ['Super Admin', 'Client Admin Master', 'Client Admin', 'Team Admin'],
//         items: [
//             {
//                 label: 'Credit Score',
//                 icon: 'card_membership',
//                 routerLink: ['admin-account/credit-score'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 roles: ['Super Admin']
//             },
//             {
//                 label: 'User Management',
//                 icon: 'manage_accounts',
//                 routerLink: ['user-management'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 roles: ['Client Admin Master', 'Client Admin', 'Team Admin']
//             },
//             {
//                 label: 'Team Management',
//                 icon: 'groups',
//                 routerLink: ['user-management/team-management'],
//                 accessType: 'restricted',
//                 countryAccess: [ 'uk' ],
//                 roles: ['Client Admin Master', 'Client Admin']
//             }
//         ]
//     }
// ];

// export class MenuItemIndex {

//     private menuItems: ExtendedMainMenuItems[] = MenuItemConst;

//     public get getMenuItemsFromIndex(): ExtendedMainMenuItems[] {
//         return JSON.parse( JSON.stringify( this.menuItems ) );
//     }

// }

export const sidebarMenuItemRoutes = {
    "Dashboard": {
        '/': '/',
        '/company-search': "/company-search",
        "/stats-analysis/map-dash": "/stats-analysis/map-dash",
        "/overview/benchmarking-overview": "/overview/benchmarking-overview",
        "/overview/merger-and-acquisition-overview": "/overview/merger-and-acquisition-overview"
    },
    "Smart Intel": {
        "/workflow/dashboard": "/workflow/dashboard",
        "/workflow/clients": "/workflow/clients",
        "/workflow/suppliers": "/workflow/suppliers",
        "/workflow/accounts": "/workflow/accounts",
        "/workflow/related-party-intel": "/workflow/related-party-intel"
    },
    "My Folders": {
        "/list/saved-filters": "/list/saved-filters",
        "/list/saved-lists": "/list/saved-lists",
        "/company-search/Favourites": "/company-search/Favourites",
        "/company-search/ExportedBucket": "/company-search/ExportedBucket",
        "/common-features/upload-csv": "/common-features/upload-csv",
        "/list/exported-files": "/list/exported-files",
        "/list/cbf-exported-files": "/list/cbf-exported-files",
        "/list/exported-emails": "/list/exported-emails",
        "/list/pdf-reports": "/list/pdf-reports",
        "/list/crm": "/list/crm",
        "/list/notes": "/list/notes",
        "/list/salesforce-sync": "/list/salesforce-sync"
    },
    "Business Intelligence": {
        "/insights/international-trade": "/insights/international-trade",
        "/insights/lending": "/insights/lending"
    },
    "Text Search Analysis": {
        "/insights/account-search": "/insights/account-search",
        "/insights/company-description": "/insights/company-description",
        "/insights/charges-description": "/insights/charges-description"
    },
    "Connect Plus": {
        "/insights/company": "/insights/company",
        "/insights/people": "/insights/people",
        "/list/connect-plus-saved-filters": "/list/connect-plus-saved-filters",
        "/list/connect-plus": "/list/connect-plus",
        "/common-features/upload-your-network": "/common-features/upload-your-network",
    }, 
    "Supply Chain Resilience": {
        // "Ownership Diverse": {
            "/stats-insights/female-owned": "/stats-insights/female-owned",
            "/stats-insights/ethnicity-spectrum": "/stats-insights/ethnicity-spectrum",
            "/stats-insights/militaryVeterans": "/stats-insights/militaryVeterans",
        // },
        // "Mission Diverse": {
            "/stats-insights/charities": "/stats-insights/charities",
            "/stats-insights/bCorpCertifiedBusiness": "/stats-insights/bCorpCertifiedBusiness",
            "/stats-insights/netZeroCommitments": "/stats-insights/netZeroCommitments",
            "/insights/promptPaymentCode": "/insights/promptPaymentCode",
            "/insights/net-zero-target": "/insights/net-zero-target",
        // },
        // "Size Diverse": {
            "/stats-insights/segmentation-by-size": "/stats-insights/segmentation-by-size",
        // },
        "/insights/responsible-procurement": "/insights/responsible-procurement",
        "/insights/supplier-analytics": "/insights/supplier-analytics"
    },
    "Deep Insights": {
        "/deep-insights/compare-company": "/deep-insights/compare-company",
        "/company-search/stats-compare": "/company-search/stats-compare"
    },
    "Company Insights": { 
        "/insights/insights-yearly": "/insights/insights-yearly",
        "/insights/insights-monthly": "/insights/insights-monthly",
    },
    "Government Procurement": {
        "/company-search/contract-finder": "/company-search/contract-finder",
        "/list/contract-finder-lists": "/list/contract-finder-lists",
        "/list/contract-finder-saved-filters": "/list/contract-finder-saved-filters",
    },
    "Property Intelligence": {
        "/company-search/property-register": "/company-search/property-register",
        "/company-search/residential-property": "/company-search/residential-property"
    },
    "Monitoring & Control": {
        "/list/business-monitor": "/list/business-monitor",
        "/list/business-monitor-plus": "/list/business-monitor-plus",
        "/list/client-watch": "/list/client-watch",
        "/list/director-watch": "/list/director-watch"
    },
    "Help Videos": {
        "/common-features/videos": "/common-features/videos"
    },
    "User Group": {
        "/common-features/feedback": "/common-features/feedback"
    },
    "API": {
        "/common-features/api-section": "/common-features/api-section"
    },
    "Setup": {
        "https://chrome.google.com/webstore/detail/datagardener/lglclegdgfhpcagdfljfckhnmkceblfp?hl=en": "https://chrome.google.com/webstore/detail/datagardener/lglclegdgfhpcagdfljfckhnmkceblfp?hl=en"
    },
    "Admin": {
        "/user-management": "/user-management",
        "/user-management/team-management": "/user-management/team-management"
    }
};