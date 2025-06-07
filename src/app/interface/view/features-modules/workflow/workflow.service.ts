import { Injectable } from '@angular/core';
import { WorkflowCardIndex, WorkflowCardIndexType, WorkflowPageType } from './workflow-cards.index';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class WorkflowService {

    workflowCardItems = new BehaviorSubject< WorkflowCardIndexType[] >( [] );
    workflowCards: WorkflowCardIndexType[] = [];
    
    private activePageWorkflow = new BehaviorSubject< WorkflowPageType >( 'clients' );
	$activePageWorkflow = this.activePageWorkflow.asObservable();
    
    private activePage: WorkflowPageType = 'clients';
    totalSearchCount: number = 0;

    /*
        # For components used in workflow module have below page names:         
        -----------------------------------------------
           General Name  |   Name used in payloads
           
            Clients      >   Business Collaborators
            Suppliers    >   Procurement Partners
            Prospects    >   Potential Leads
            Accounts     >   Fiscal Holdings
    */

    uploadedNewListParams: { [K in WorkflowPageType]?: { cListId: string, listPageName: string, listName: string, displayName?: string } } = {
        clients: {
            cListId: '',
            listPageName: 'businessCollaborators',
            listName: 'Business Collaborators',
            displayName: 'Clients'
        },
        suppliers: {
            cListId: '',
            listPageName: 'procurementPartners',
            listName: 'Procurement Partners',
            displayName: 'Suppliers'
        },
        accounts: {
            cListId: '',
            listPageName: 'fiscalHoldings',
            listName: 'Fiscal Holdings',
            displayName: 'Accounts'
        },
        prospects: {
            cListId: '',
            listPageName: 'potentialLeads',
            listName: 'Potential Leads'
        }
    };

    constructor(
        private _router: Router
    ) {}

    updateListId( listName: string, listId: string  ) {
        const { clients, accounts, prospects, suppliers } = this.uploadedNewListParams;
        switch ( listName ) {
            case clients.listName:
                clients.cListId = listId;                    
                break;
            case accounts.listName:
                accounts.cListId = listId;                    
                break;
            case prospects.listName:
                prospects.cListId = listId;                    
                break;
            case suppliers.listName:
                suppliers.cListId = listId;                    
                break; 
        }
    }

    getWorkflowCards() {

        this.workflowCards = JSON.parse( JSON.stringify( WorkflowCardIndex ) );

        let filteredCards = this.workflowCards.filter( card => ( card.cardAccessibleFor.includes( this.activePage ) ) && ( card.cardCurrentState === "visible" ) );
        
        if ( this.getActiveListParams.cListId && this.totalSearchCount ) {
            filteredCards.map( card => {

                card.cardActiveState = true;

                if ( card?.buttonRoute.hasOwnProperty( 'cListId' ) ) {
                    card.buttonRoute.cListId = this.getActiveListParams.cListId; 
                }
                if ( card?.buttonRoute.hasOwnProperty( 'listPageName' ) ) {
                    card.buttonRoute.listPageName = this.getActiveListParams.listPageName; 
                }

            });
        }

        this.workflowCardItems.next( filteredCards );
    }

    updateWorkflowList() {
        this.getWorkflowCards();
        this._router.navigate( [ `/workflow/${this.activePage}` ], { queryParams: this.uploadedNewListParams } );
	}

    public set setActivePage( pageName: WorkflowPageType ) {
       
        if ( pageName !=  this.activePage ) {
            // this.activePageWorkflow.next( pageName );
            this.activePage = pageName;
            this.getWorkflowCards();
        }
    }

    public get getActiveListParams(): { cListId: string, listPageName: string, listName: string, displayName?: string } {
        return this.uploadedNewListParams[ this.activePage ];
    }

    public getListParamsForPage( pageName: WorkflowPageType ): { cListId: string, listPageName: string, listName: string, displayName?: string } {
        return this.uploadedNewListParams[ pageName ];
    }
    
    
}