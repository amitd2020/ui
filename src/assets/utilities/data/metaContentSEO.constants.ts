type MetaContentTypes = {
    [ key: string ]: {
        title?: string
        description?: string
        keywords?: string
        robots?: string
    }
};

export const MetaContentSEO: MetaContentTypes = {
    login: {
        title: 'Log In | Product | DataGardener',
        description: 'Login to access business information through your DataGardener profile.',
        keywords: '',
        robots: 'index, follow'
    },
    createAccount: {
        title: 'SignUp to Access Companies and Directors Data | DataGardener',
        description: 'Sign Up to access the business information from the UK company database.',
        keywords: '',
        robots: 'noindex, nofollow'
    },
    dashboard: {
        title: 'DataGardener- Get Free company information from Companies House',
        description: 'Get company detailed information from Companies House including financial report, registered business address, accounts, charges, annual return, directors offices etc',
        keywords: '',
        robots: 'index, follow'
    },
    companySearch: {
        title: 'Search Companies by Advanced Filters - DataGardener',
        description: 'Our Companies search filter allows to find by Company Name/Number, Industry, Category, Age, Incorporation Date, Key Financials, Address, and Special Filters.',
        keywords: '',
        robots: ''
    },
    companyDetails: {
        title: '',
        description: '',
        keywords: '',
        robots: ''
    },
    directorDetails: {
        title: '',
        description: '',
        keywords: '',
        robots: ''
    },
}