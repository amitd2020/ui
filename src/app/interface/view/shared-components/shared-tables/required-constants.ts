export type DropdownOptionsType = { label: string, value: unknown };

export const RequiredConstant = {

    companyStatusOptions: <DropdownOptionsType[]>[
        { label: 'Dissolved', value: 'dissolved' },
        { label: 'Live', value: 'live' },
        { label: 'In Liquidation', value: 'in liquidation' },
        { label: 'Converted/closed', value: 'converted/closed' },
        { label: 'In Administration', value: 'in administration' },
        { label: 'In Receivership / Administration', value: 'in receivership / administration' },
        { label: 'Deleted', value: 'deleted' },
        { label: 'Not Specified', value: 'not specified' },
        { label: 'Removed', value: 'removed' },
        { label: 'In Receivership', value: 'in receivership' },
        { label: 'Voluntary Arrangement', value: 'voluntary arrangement' },
        { label: 'Administration Order', value: 'administration order' }
    ],
    PropertyTypeOptions: <DropdownOptionsType[]>[
        { label: 'Detached', value: 'Detached' },
        { label: 'Semi-detached', value: 'Semi-detached' },
        { label: 'Flats/maisonettes', value: 'Flats/maisonettes' },
        { label: 'Terraced', value: 'Terraced' },
        { label: 'Other', value: 'Other' }
    ],
    landTenureOptions: <DropdownOptionsType[]>[
        { label: 'Freehold', value: 'Freehold' },
        { label: 'Leasehold', value: 'Leasehold' },
        { label: 'Other', value: 'Other' }

    ],
    buildTypeOptions: <DropdownOptionsType[]>[
        { label: 'Established Residential Building', value: 'Established Residential Building' },
        { label: 'Newly Built Property', value: 'Newly Built Property' },
    ],
    savedListPageOptions: <DropdownOptionsType[]>[
        { label: 'Company Search', value: 'companySearch' },
        { label: 'Company  Charges- List', value: 'Company Charges-List' },
        { label: 'Company Trade-list', value: 'Company Trade-list' },
        { label: 'Account Search', value: 'accountSearch' },
        { label: 'Company Description', value: 'companyDescription' },
        { label: 'Charges Description', value: 'chargesDescription' },
        { label: 'Investor Finder', value: 'investorFinderPage' },
        { label: 'Investee Finder', value: 'investeeFinderPage' },
        // { label: 'Contract Finder Page', value: 'contractFinderPage' },
        // { label: 'Buyers Dashboard', value: 'buyersDashboard' },
        // { label: 'Suppliers Dashboard', value: 'suppliersDashboard' },
        // { label: 'Company LinkedIn', value: 'companyLinkedIn' },
        // { label: 'Person LinkedIn', value: 'personLinkedIn' },
    ],
    savedListPageOptionsforIrEland: <DropdownOptionsType[]>[
        { label: 'Company Search', value: 'companySearch' },
        { label: 'Company  Charges- List', value: 'Company Charges-List' }
    ],
    connectPlusListOptions: <DropdownOptionsType[]> [
        { label: 'Company', value: 'connectPlusCompany' },
        { label: 'People', value: 'connectPlusPeople' },
    ]

    
}

