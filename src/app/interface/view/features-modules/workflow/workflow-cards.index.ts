export type WorkflowPageType = 'clients' | 'suppliers' | 'prospects' | 'accounts';

    /*
        # For components used in workflow module have below page names:         
        -----------------------------------------------
           General Name  |   Name used in payloads
           
            Clients      >   Business Collaborators
            Suppliers    >   Procurement Partners
            Prospects    >   Potential Leads
            Accounts     >   Fiscal Holdings
    */

export type WorkflowCardIndexType = {
    cardTitle: string;
    description: string;
    buttonTitle: string;
    buttonRoute: { route?: string, cListId?: string, listPageName?: string };
    cardActiveState: boolean;
    cardAccessibleFor: Array< WorkflowPageType >;
    cardCurrentState: 'visible' | 'hidden';
    cardIconClass?: string
}

export const WorkflowCardIndex: WorkflowCardIndexType[] = [
    {
        cardTitle: 'Upload CSV',
        description: 'This step will following the process for the Upload CSV.',
        buttonTitle: 'Start',
        buttonRoute: { route: 'upload-csv' },
        cardActiveState: true,
        cardAccessibleFor: ['clients', 'suppliers', 'accounts', 'prospects'],
        cardCurrentState: 'visible',
        cardIconClass: 'pi pi-upload'
    },
    {
        cardTitle: 'Stats Insights',
        description: 'This step will following the process for the Stats',
        buttonTitle: 'Start',
        buttonRoute: { route: 'stats-insights', cListId: '', listPageName: '' },
        cardActiveState: false,
        cardAccessibleFor: ['clients', 'suppliers', 'accounts', 'prospects'],
        cardCurrentState: 'visible',
        cardIconClass: 'pi pi-chart-line'
    },
    {
        cardTitle: 'Similar Companies',
        description: 'This step will following the process for the View Similar Companies',
        buttonTitle: 'Start',
        buttonRoute: { route: 'view-similar-company', cListId: '', listPageName: ''},
        cardActiveState: false,
        cardAccessibleFor: ['clients', 'suppliers', 'accounts'],
        cardCurrentState: 'visible',
        cardIconClass: 'pi pi-building'
    },
    {
        cardTitle: 'Related Companies',
        description: 'This step will following the process for the Other Related Companies',
        buttonTitle: 'Start',        
        buttonRoute: { route: 'other-related-companies', cListId: '', listPageName: '' },
        cardActiveState: false,
        cardAccessibleFor: ['clients'],
        cardCurrentState: 'visible',
        cardIconClass: 'pi pi-sitemap'
    },
    {
        cardTitle: 'Business Monitor',
        description: 'This step will following the process for the Business Monitor',
        buttonTitle: 'start',        
        buttonRoute: { route: 'business-monitor', cListId: '', listPageName: '' },
        cardActiveState: false,
        cardAccessibleFor: ['clients', 'suppliers', 'accounts', 'prospects'],
        cardCurrentState: 'visible',
        cardIconClass: 'pi pi-eye'
    },
    {
        cardTitle: 'Explore Upsell Opportunities',
        description: 'This step will following the process for the Upsell Opportunities',
        buttonTitle: 'Start',
        buttonRoute: {},
        cardActiveState: false,
        cardAccessibleFor: ['clients'],
        cardCurrentState: 'hidden'
    },
    {
        cardTitle: 'Know your RISK - Potential issues with the clients (Risk Assessment)',
        description: 'This step will following the process for the Risk Assessment',
        buttonTitle: 'Start',
        buttonRoute: {},
        cardActiveState: false,
        cardAccessibleFor: ['clients', 'suppliers'],
        cardCurrentState: 'hidden'
    },
    {
        cardTitle: 'Monthly report on the clients',
        description: 'This step will following the process for the Monthly Report',
        buttonTitle: 'Start',
        buttonRoute: {},
        cardActiveState: false,
        cardAccessibleFor: ['clients', 'suppliers', 'accounts', 'prospects'],
        cardCurrentState: 'hidden'
    },
    {
        cardTitle: 'AI Summary of the Clients',
        description: 'This step will following the process for the AI Summary',
        buttonTitle: 'Start',
        buttonRoute: {},
        cardActiveState: false,
        cardAccessibleFor: ['clients', 'suppliers', 'accounts', 'prospects'],
        cardCurrentState: 'hidden'
    },
    {
        cardTitle: 'Diversity Spend',
        description: 'This step will following the process for the Diversity',
        buttonTitle: 'Start',
        buttonRoute: {},
        cardActiveState: false,
        cardAccessibleFor: ['suppliers'],
        cardCurrentState: 'hidden'
    },
    {
        cardTitle: 'Priortise the accounts based on the details',
        description: 'This step will following the process for the Prioritise Account details',
        buttonTitle: 'Start',
        buttonRoute: {},
        cardActiveState: false,
        cardAccessibleFor: ['accounts'],
        cardCurrentState: 'hidden'
    },
    {
        cardTitle: 'Find the right people and account details',
        description: 'This step will following the process for the right people and account details',
        buttonTitle: 'Start',
        buttonRoute: {},
        cardActiveState: false,
        cardAccessibleFor: ['accounts'],
        cardCurrentState: 'hidden'
    },
    {
        cardTitle: 'Is there any pattern in Industry, location, size, personal',
        description: 'This step will following the process for the Industry, location, size, personal',
        buttonTitle: 'Start',
        buttonRoute: {},
        cardActiveState: false,
        cardAccessibleFor: ['prospects'],
        cardCurrentState: 'hidden'
    },
    {
        cardTitle: 'Cross verify with your Clients and Accounts List',
        description: 'This step will following the process for the Clients and Accounts List',
        buttonTitle: 'Start',
        buttonRoute: {},
        cardActiveState: false,
        cardAccessibleFor: ['prospects'],
        cardCurrentState: 'hidden'
    }
]