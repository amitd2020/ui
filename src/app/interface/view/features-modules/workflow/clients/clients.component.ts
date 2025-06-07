import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap  } from '@angular/router';
import { WorkflowService } from '../workflow.service';
import { WorkflowPageType } from '../workflow-cards.index';

@Component({
    selector: 'dg-clients',
    templateUrl: './clients.component.html',
    styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

    chipData: any;

    constructor(
        private _router: Router,
        public _workflowService: WorkflowService,
        private _activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        // let activePageName: WorkflowPageType = this._activatedRoute.snapshot.data.breadcrumb.toLowerCase();
        
        // this._workflowService.setActivePage = activePageName;
        this._workflowService.getWorkflowCards();

        let pageName;
        this._activatedRoute.paramMap.subscribe((params: ParamMap) => {
            pageName = params.get('screen');
            this._workflowService.setActivePage = params.get('screen') as WorkflowPageType;
        });

        this.chipData = JSON.stringify( [ { chip_group: 'Saved Lists', chip_values: [ this._workflowService?.uploadedNewListParams[pageName].displayName ] } ] );
    }

    goToNextPage( pageRoute:  { route?: string, cListId?: string, listPageName?: string } ) {
        let queryParamObj = {};

        if ( pageRoute?.cListId ) {
            queryParamObj['cListId'] = pageRoute.cListId;
        }

        if ( pageRoute?.listPageName ) {
            queryParamObj['listPageName'] = pageRoute.listPageName;
        }

        if ( Object.keys( queryParamObj ).length ) {
            this._router.navigate( [ pageRoute.route ], { queryParams: queryParamObj } );
        } else {
            this._router.navigate( [ pageRoute.route ] );
        }

    }

}
