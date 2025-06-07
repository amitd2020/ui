import { MenuItem } from 'primeng/api';

type ExtendedProperties = {
    countryAccess: Array<string>;
    isPublic?: boolean;
    routeParamKey?: string;
    component?: () => Promise<any>;
};

export type ComponentsMenuType = ExtendedProperties &
    Omit<MenuItem, 'items' | 'state'> & {
        items?: ComponentsMenuType[];
        state?: {
            visibilityCheck?: Array<string>;
            disabilityCheck?: string;
            addOnCheck?: Array<string>;
        };
    };

export const ComponentsMenuConfig: ComponentsMenuType[] = [
    {
        label: 'Overview',
        icon: 'ui-icon-article',
        countryAccess: ['uk', 'ie'],
        types: ['admin', 'default', 'public', 'private', 'combined'],
        addons: ['default', 'internationalTradeFilter', 'contactInformation', 'propertyIntelligence'],
        items: [
            {
                label: 'About',
                icon: 'ui-icon-info',
                types: ['admin', 'default', 'public', 'private', 'combined'],
                addons: ['default'],
                isPublic: true,
                visible: true,
                countryAccess: ['uk', 'ie'],
                routeParamKey: 'viewAboutCompany',
                component: () =>
                    import('./overview/about/about.component').then(
                        (comp) => comp.AboutComponent
                    ),
            },
            {
                label: 'Trading Address',
                types: ['admin', 'default', 'public', 'private', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-home',
                visible: true,
                countryAccess: ['uk'],
                state: {
                    visibilityCheck: ['hasTradingAddress'],
                    disabilityCheck: 'Trading Address',
                },
                routeParamKey: 'viewTradingAddress',
                component: () =>
                    import(
                        './overview/trading-address/trading-address.component'
                    ).then((comp) => comp.TradingAddressComponent),
            },
            {
                label: 'Group Structure',
                types: ['admin', 'default', 'public', 'private', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-group-work',
                visible: true,
                countryAccess: ['uk'],
                state: {
                    visibilityCheck: ['hasGroupStructure'],
                    disabilityCheck: 'Group Structure',
                },
                routeParamKey: 'viewGroupStructure',
                component: () =>
                    import(
                        './overview/group-structure/group-structure.component'
                    ).then((comp) => comp.GroupStructureComponent),
            },
            {
                label: 'Notes',
                types: ['admin', 'default', 'public', 'private', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-insert-drive-file',
                visible: true,
                countryAccess: ['uk'],
                routeParamKey: 'viewNotes',
                component: () =>
                    import('./overview/notes/notes.component').then(
                        (comp) => comp.NotesComponent
                    ),
            },
            {
                label: 'Lifeline',
                types: ['admin', 'default', 'public', 'private', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-timeline',
                visible: true,
                countryAccess: ['uk'],
                state: { disabilityCheck: 'Lifeline' },
                component: () =>
                    import('./overview/life-line/life-line.component').then(
                        (comp) => comp.LifeLineComponent
                    ),
            },
            {
                label: 'Import & Export',
                types: ['admin', 'default', 'public', 'private', 'combined'],
                addons: ['internationalTradeFilter'],
                icon: 'ui-icon-import-export',
                visible: true,
                countryAccess: ['uk'],
                state: {
                    visibilityCheck: ['hasInternationTradeData'],
                    addOnCheck: ['internationalTradeFilter'],
                },
                routeParamKey: 'viewImportExport',
                component: () =>
                    import(
                        './overview/import-export/import-export.component'
                    ).then((comp) => comp.ImportExportComponent),
            },
            {
                label: 'Contact Information',
                types: ['admin', 'default', 'public', 'private', 'combined'],
                addons: ['contactInformation'],
                icon: 'ui-icon-contact-phone',
                visible: true,
                state: { addOnCheck: ['contactInformation'] },
                countryAccess: ['uk'],
                routeParamKey: 'viewContactInfo',
                component: () =>
                    import(
                        './overview/person-contact-info/person-contact-info.component'
                    ).then((comp) => comp.PersonContactInfoComponent),
            },
            // {
            //     label: 'LinkedIn Profile',
            //     types: ['admin', 'default', 'public', 'private', 'combined'],
            //     addons: ['default'],
            //     icon: 'ui-icon-contact-phone',
            //     visible: true,
            //     state: { addOnCheck: ['personLinkedIn'] },
            //     countryAccess: ['uk'],
            //     routeParamKey: 'viewLinkedinProfile',
            //     component: () =>
            //         import(
            //             './overview/linkedin-profile/linkedin-profile.component'
            //         ).then((comp) => comp.LinkedinProfileComponent),
            // },
            {
                label: 'EPC',
                types: ['admin', 'default', 'public', 'private', 'combined'],
                addons: ['propertyIntelligence'],
                icon: 'ui-icon-signal-cellular-alt',
                visible: true,
                countryAccess: ['uk'],
                state: { visibilityCheck: ['epcDetails'] },
                component: () =>
                    import('./overview/epc-tab/epc-tab.component').then(
                        (comp) => comp.EpcTabComponent
                    ),
            },
        ],
    },
    {
        label: 'Risk Profile',
        icon: 'ui-icon-manage-accounts',
        countryAccess: ['uk', 'ie'],
        types: ['admin', 'default', 'public', 'private', 'combined'],
        addons: ['riskFilter', 'lendingLandscape'],
        items: [
            {
                label: 'Risk Summary',
                types: ['admin', 'default', 'private', 'public', 'combined'],
                addons: ['riskFilter'],
                icon: 'ui-icon-security',
                visible: true,
                countryAccess: ['uk'],
                state: { disabilityCheck: 'Risk Summary' },
                routeParamKey: 'viewRiskSummary',
                component: () =>
                    import(
                        './risk-profile/risk-summary/risk-summary.component'
                    ).then((comp) => comp.RiskSummaryComponent),
            },
            {
                label: "CCJ's",
                types: ['admin', 'default', 'private', 'public', 'combined'],
                addons: ['riskFilter'],
                icon: 'ui-icon-gavel',
                visible: true,
                countryAccess: ['uk', 'ie'],
                state: {
                    visibilityCheck: ['hasCCJInfo'],
                    disabilityCheck: 'CCJs',
                },
                routeParamKey: 'viewCcj',
                component: () =>
                    import('./risk-profile/ccjs/ccjs.component').then(
                        (comp) => comp.CcjsComponent
                    ),
            },
            {
                label: 'Commentary',
                types: ['admin', 'default', 'private', 'public', 'combined'],
                addons: ['riskFilter'],
                icon: 'ui-icon-comment',
                visible: true,
                countryAccess: ['uk'],
                state: {
                    visibilityCheck: ['hasCompanyCommentary'],
                    disabilityCheck: 'Commentary',
                },
                routeParamKey: 'viewCommentary',
                component: () =>
                    import('./risk-profile/commentry/commentry.component').then(
                        (comp) => comp.CommentryComponent
                    ),
            },
            {
                label: 'Company Events',
                types: ['admin', 'default', 'private', 'public', 'combined'],
                addons: ['riskFilter'],
                icon: 'ui-icon-event-note',
                visible: true,
                countryAccess: ['uk'],
                state: {
                    visibilityCheck: ['hasCompanyEventsData'],
                    disabilityCheck: 'Company Events',
                },
                routeParamKey: 'viewCompanyEvents',
                component: () =>
                    import(
                        './risk-profile/company-events/company-events.component'
                    ).then((comp) => comp.CompanyEventsComponent),
            },
            {
                label: 'Impacted Creditors',
                types: ['admin', 'default', 'private', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-card-membership',
                visible: true,
                countryAccess: ['uk'],
                state: { visibilityCheck: ['hasCreditor'] },
                routeParamKey: 'viewImpactedCreditors',
                component: () =>
                    import('./risk-profile/creditors/creditors.component').then(
                        (comp) => comp.CreditorsComponent
                    ),
            },
            {
                label: 'Write-offs',
                types: ['admin', 'default', 'private', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-credit-card-off',
                visible: true,
                countryAccess: ['uk'],
                state: {
                    visibilityCheck: ['hasDebtor'],
                    disabilityCheck: 'Write Off',
                },
                routeParamKey: 'viewWrtieOffs',
                component: () =>
                    import('./risk-profile/bad-depts/bad-depts.component').then(
                        (comp) => comp.BadDeptsComponent
                    ),
            },
            {
                label: 'Charges',
                types: ['admin', 'default', 'private', 'public', 'combined'],
                addons: ['lendingLandscape'],
                icon: 'ui-icon-account-balance',
                visible: true,
                countryAccess: ['uk', 'ie'],
                state: {
                    visibilityCheck: ['hasCharges'],
                    disabilityCheck: 'Charges',
                },
                routeParamKey: 'viewCharges',
                component: () =>
                    import('./risk-profile/charges/charges.component').then(
                        (comp) => comp.ChargesComponent
                    ),
            },
        ],
    },
    {
        label: 'Financial',
        icon: 'ui-icon-currency-pound',
        countryAccess: ['uk', 'ie'],
        types: ['admin', 'default', 'public', 'private', 'combined'],
        addons: ['default'],
        items: [
            {
                label: 'Key Financials',
                types: ['admin', 'default', 'public', 'private', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-calculate',
                visible: true,
                countryAccess: ['uk', 'ie'],
                state: {
                    visibilityCheck: ['hasFinances'],
                    disabilityCheck: 'Key Financials',
                },
                routeParamKey: 'viewFinancials',
                component: () =>
                    import(
                        './financial/financials-info/financials-info.component'
                    ).then((comp) => comp.FinancialsInfoComponent),
            },
            {
                label: 'Ratios',
                types: ['admin', 'default', 'public', 'private', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-timelapse',
                visible: true,
                countryAccess: ['uk', 'ie'],
                state: {
                    visibilityCheck: ['hasFinances'],
                    disabilityCheck: 'Key Financials',
                },
                routeParamKey: 'viewFinancialRatios',
                component: () =>
                    import('./financial/ratios/ratios.component').then(
                        (comp) => comp.RatiosComponent
                    ),
            },
            {
                label: 'UKGAAP',
                types: ['admin', 'default', 'public', 'private', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-data-exploration',
                visible: true,
                countryAccess: ['uk', 'ie'],
                state: {
                    visibilityCheck: ['hasUkgaapData'],
                    addOnCheck: ['specialFilter'],
                },
                component: () =>
                    import(
                        './financial/ukgaap-ifrs-insurance-financial/ukgaap-ifrs-insurance-financial.component'
                    ).then(
                        (comp) => comp.UkgaapIfrsInsuranceFinancialComponent
                    ),
            },
            {
                label: 'IFRS',
                types: ['admin', 'default', 'public', 'private', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-data-exploration',
                visible: true,
                countryAccess: ['uk', 'ie'],
                state: {
                    visibilityCheck: ['hasIfrsData'],
                    addOnCheck: ['specialFilter', 'internationalTradeFilter'],
                },
                component: () =>
                    import(
                        './financial/ukgaap-ifrs-insurance-financial/ukgaap-ifrs-insurance-financial.component'
                    ).then(
                        (comp) => comp.UkgaapIfrsInsuranceFinancialComponent
                    ),
            },
            {
                label: 'Insurance',
                types: ['admin', 'default', 'public', 'private', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-data-exploration',
                visible: true,
                countryAccess: ['uk', 'ie'],
                state: {
                    visibilityCheck: ['hasInsuranceData'],
                    addOnCheck: ['specialFilter'],
                },
                component: () =>
                    import(
                        './financial/ukgaap-ifrs-insurance-financial/ukgaap-ifrs-insurance-financial.component'
                    ).then(
                        (comp) => comp.UkgaapIfrsInsuranceFinancialComponent
                    ),
            },
            {
                label: 'UKGAAP Financial',
                types: ['admin', 'default', 'public', 'private', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-data-exploration',
                visible: true,
                countryAccess: ['uk', 'ie'],
                state: {
                    visibilityCheck: ['hasFinancialAccountTypeData'],
                    addOnCheck: ['specialFilter'],
                },
                component: () =>
                    import(
                        './financial/ukgaap-ifrs-insurance-financial/ukgaap-ifrs-insurance-financial.component'
                    ).then(
                        (comp) => comp.UkgaapIfrsInsuranceFinancialComponent
                    ),
            },
            {
                label: 'Acquisition & Mergers',
                types: ['admin', 'default', 'public', 'private', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-view-carousel',
                visible: true,
                countryAccess: ['uk'],
                state: {
                    visibilityCheck: [
                        'hasAcquiredCompany',
                        'hasAcquiringCompany',
                    ],
                },
                routeParamKey: 'viewAquisitionAndMerger',
                component: () =>
                    import(
                        './financial/aquisation-merger/aquisation-merger.component'
                    ).then((comp) => comp.AquisationMergerComponent),
            },
            {
                label: 'Z Score',
                types: ['admin', 'default', 'public', 'private', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-score',
                visible: true,
                countryAccess: ['uk'],
                state: {
                    addOnCheck: ['industryAnalysis'],
                    visibilityCheck: ['hasZScore'],
                },
                routeParamKey: 'viewZscore',
                component: () =>
                    import('./financial/zscore/zscore.component').then(
                        (comp) => comp.ZscoreComponent
                    ),
            },
            {
                label: 'CAGR',
                types: ['admin', 'default', 'public', 'private', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-data-exploration',
                visible: true,
                countryAccess: ['uk'],
                state: {
                    addOnCheck: ['industryAnalysis'],
                    visibilityCheck: ['hasCAGR'],
                },
                routeParamKey: 'viewCagr',
                component: () =>
                    import('./financial/cagr/cagr.component').then(
                        (comp) => comp.CagrComponent
                    ),
            },
        ],
    },
    {
        label: 'Assets',
        icon: 'ui-icon-card-travel',
        countryAccess: ['uk'],
        types: ['admin', 'default', 'public', 'private', 'combined'],
        addons: ['default', 'specialFilter', 'propertyIntelligence'],
        items: [
            {
                label: 'Company Shareholdings',
                types: ['admin', 'default', 'private', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-contact-page',
                visible: true,
                countryAccess: ['uk'],
                state: {
                    visibilityCheck: ['hasShareHoldings'],
                    disabilityCheck: 'Shareholdings',
                },
                routeParamKey: 'viewShareholdings',
                component: () =>
                    import(
                        './assets/shareholdings/shareholdings.component'
                    ).then((comp) => comp.ShareholdingsComponent),
            },
            {
                label: 'Innovate Grant',
                types: ['admin', 'default', 'public', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-class',
                visible: true,
                countryAccess: ['uk'],
                state: {
                    visibilityCheck: ['hasInnovateData'],
                    addOnCheck: ['specialFilter'],
                },
                routeParamKey: 'viewInnovateGrant',
                component: () =>
                    import(
                        './assets/innovate-grant/innovate-grant.component'
                    ).then((comp) => comp.InnovateGrantComponent),
            },
            {
                label: 'Property Register',
                types: ['admin', 'default', 'private', 'public', 'combined'],
                addons: ['propertyIntelligence'],
                icon: 'ui-icon-class',
                visible: true,
                countryAccess: ['uk'],
                state: {
                    visibilityCheck: ['hasLandCorporate'],
                    addOnCheck: ['propertyIntelligence'],
                    disabilityCheck: 'Corporate Land',
                },
                routeParamKey: 'viewCorporateLand',
                component: () =>
                    import(
                        './assets/corporate-land/corporate-land.component'
                    ).then((comp) => comp.CorporateLandComponent),
            },
            {
                label: 'Patent And Trade',
                types: ['admin', 'default', 'public', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-stacked-bar-chart',
                visible: true,
                countryAccess: ['uk'],
                state: {
                    addOnCheck: ['specialFilter'],
                    visibilityCheck: ['hasPatentData'],
                },
                routeParamKey: 'viewPatentTrade',
                component: () =>
                    import('./assets/patent-trade/patent-trade.component').then(
                        (comp) => comp.PatentTradeComponent
                    ),
            },
        ],
    },
    {
        label: 'Directors/Shareholders',
        icon: 'ui-icon-people',
        countryAccess: ['uk', 'ie'],
        types: ['admin', 'default', 'private', 'combined'],
        addons: ['default'],
        items: [
            {
                label: 'Directors',
                types: ['admin', 'default', 'private', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-people-outline',
                isPublic: true,
                visible: true,
                countryAccess: ['uk', 'ie'],
                routeParamKey: 'viewDirectors',
                component: () =>
                    import(
                        './directors-shareholders/directors-info/directors-info.component'
                    ).then((comp) => comp.DirectorsInfoComponent),
            },
            {
                label: 'PSC',
                types: ['admin', 'default', 'private', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-supervisor-account',
                visible: true,
                countryAccess: ['uk'],
                state: { visibilityCheck: ['hasPscDetails'] },
                routeParamKey: 'viewPsc',
                component: () =>
                    import('./directors-shareholders/psc/psc.component').then(
                        (comp) => comp.PscComponent
                    ),
            },
            {
                label: 'Shareholders',
                types: ['admin', 'default', 'private', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-supervisor-account',
                visible: true,
                countryAccess: ['uk', 'ie'],
                state: {
                    visibilityCheck: ['hasShareHolders'],
                    disabilityCheck: 'Shareholders',
                },
                routeParamKey: 'viewShareholders',
                component: () =>
                    import(
                        './directors-shareholders/shareholders/shareholders.component'
                    ).then((comp) => comp.ShareholdersComponent),
            },
            {
                label: 'Related Directors',
                types: ['admin', 'default', 'private', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-connect-without-contact',
                visible: true,
                countryAccess: ['uk'],
                routeParamKey: 'viewRelatedDirectors',
                component: () =>
                    import(
                        './directors-shareholders/related-directors/related-directors.component'
                    ).then((comp) => comp.RelatedDirectorsComponent),
            },
            {
                label: 'Related Companies',
                types: ['admin', 'default', 'private', 'combined'],
                addons: ['default'],
                icon: 'ui-icon-corporate-fare',
                visible: true,
                countryAccess: ['uk'],
                routeParamKey: 'viewRelatedCompanies',
                component: () =>
                    import(
                        './directors-shareholders/related-companies/related-companies.component'
                    ).then((comp) => comp.RelatedCompaniesComponent),
            },
        ],
    },
    {
        label: 'Government Procurement',
        icon: 'ui-icon-account-balance',
        countryAccess: ['uk'],
        types: ['admin', 'default', 'public', 'private', 'combined'],
        addons: ['governmentEnabler'],
        items: [
            {
                label: 'Contracts',
                types: ['admin', 'default', 'public', 'private', 'combined'],
                addons: ['governmentEnabler'],
                icon: 'ui-icon-recycling',
                visible: true,
                countryAccess: ['uk'],
                state: { visibilityCheck: ['hasContractData'] },
                routeParamKey: 'viewGovernmentEnablerSupplier',
                component: () =>
                    import(
                        '../../shared-components/government-enabler/contract-finder/contract-finder.component'
                    ).then((comp) => comp.ContractFinderComponent),
            },
            {
                label: 'Payment',
                types: ['admin', 'default', 'public', 'private', 'combined'],
                addons: ['governmentEnabler'],
                icon: 'ui-icon-training',
                visible: true,
                countryAccess: ['uk'],
                state: { visibilityCheck: ['hasPaymentInfo'] },
                routeParamKey: 'viewGovernmentEnablerBuyer',
                component: () =>
                    import('./government-enabler/buyer/buyer.component').then(
                        (comp) => comp.BuyerComponent
                    ),
            },
        ],
    },
    {
        label: 'Documents',
        types: ['admin', 'default', 'public', 'private', 'combined'],
        addons: ['default'],
        icon: 'ui-icon-description',
        isPublic: true,
        countryAccess: ['uk'],
        component: () =>
            import('./documents/documents.component').then(
                (comp) => comp.DocumentsComponent
            ),
    },
    // {
    //     label: 'News Feeds',
    //     types: ['admin', 'default', 'public', 'private', 'combined'],
    //     addons: ['default'],
    //     icon: 'ui-icon-dvr',
    //     countryAccess: ['uk'],
    //     state: { disabilityCheck: 'News Feeds' },
    //     component: () =>
    //         import('./news-feed/news-feed.component').then(
    //             (comp) => comp.NewsFeedComponent
    //         ),
    // },
    {
        label: 'Benchmarking ',
        types: ['admin', 'default', 'public', 'private', 'combined'],
        icon: 'ui-icon-trending-up',
        state: { visibilityCheck: ['hasBenchMarking'] },
        addons: ['benchMarking'],
        countryAccess: ['uk'],
        component: () => import( '../../shared-components/benchmarking/benchmarking.component' ).then((comp) => comp.BenchmarkingComponent),
    },
    {
        label: 'M & A',
        types: ['admin', 'default', 'public', 'private', 'combined'],
        icon: 'ui-icon-move_up',
        state: { visibilityCheck: ['hasMarginalAndAccquisition'] },
        addons: ['benchMarking'],
        countryAccess: ['uk'],
        component: () => import( '../../shared-components/m-and-a/m-and-a.component' ).then((comp) => comp.MAndAComponent),
    },
    {
        label: 'Responsible Procurement',
        types: ['admin', 'default', 'public', 'private', 'combined'],
        icon: 'ui-icon-query_stats',
        addons: ['diversityAndInclusion'],
        state: {
            addOnCheck: ['diversityAndInclusion'],
        },
        visible: true,
        countryAccess: ['uk'],
        component: () => import( './responsible-procurement-diversity/responsible-procurement-diversity.component' ).then((comp) => comp.ResponsibleProcurementDiversityComponent),
    },
];
