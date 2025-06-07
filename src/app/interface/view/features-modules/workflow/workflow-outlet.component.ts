import { Component, OnInit } from '@angular/core'; 
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { WorkflowService } from './workflow.service';

@Component({
    selector: 'dg-workflow-outlet',
    template: `
        <!-- <div class="card"> -->
            <dg-clients></dg-clients>
        <!-- </div> -->

        <router-outlet></router-outlet>
    `
})

export class WorkflowOutletComponent implements OnInit {
    
    constructor(
		private userAuthService: UserAuthService,
        private _workflowService: WorkflowService
    ) {}

    ngOnInit() {
        let listIds = this.userAuthService.getUserInfo()?.['userCommercialIds'];
        
        listIds?.map( (val)=> {
            this._workflowService.updateListId( val.listName, val._id );
        });
    }
    
}