import { Component } from '@angular/core';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';

@Component({
  selector: 'dg-prompt-timeline',
  templateUrl: './prompt-timeline.component.html',
  styleUrls: ['./prompt-timeline.component.scss']
})

export class PromptTimelineComponent {

	userId: any;
	totalRecords: number = 0;
	msgs: any[] = [];
    tableCols: any[] = [];
	tableData: any[] = [];
	
	constructor( private serverCommunicationService: ServerCommunicationService, private userAuthService: UserAuthService ) {}
	
	ngOnInit() {
		this.tableCols = [
			{ field: 'user_prompt', header: 'User Prompt', minWidth: '300px', maxWidth: 'none', textAlign: 'left' },
			// { field: 'elastic_query', header: 'Query', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
			{ field: 'prompt_tokens', header: 'Prompt Tokens', minWidth: '100px', maxWidth: '150px', textAlign: 'right' },
			{ field: 'completion_tokens', header: 'Completion Tokens', minWidth: '100px', maxWidth: '150px', textAlign: 'right' },
			{ field: 'total_tokens', header: 'Total Tokens', minWidth: '100px', maxWidth: '150px', textAlign: 'right' },
			{ field: 'createdAt', header: 'Created On', minWidth: '200px', maxWidth: '200px', textAlign: 'center' },
			{ field: 'updatedAt', header: 'Updated On', minWidth: '200px', maxWidth: '200px', textAlign: 'center' },
			{ field: 'searchPrompt', header: 'Action', minWidth: '100px', maxWidth: '100px', textAlign: 'center' }
		];

		this.userId = this.userAuthService.getUserInfo('dbID');
		this.getPromptHistory();
    }

	getPromptHistory( rows = 25, first = 0 ) {
		let payload = { userId: this.userId, skip: first, limit: rows };

		this.serverCommunicationService.globalServerRequestCall('post', 'DG-PROMPT-AI', 'promptHistory', payload).subscribe( {
			next: (res) => {
				if ( res.status == 200 ) {
					this.msgs = [];
					this.msgs.push( { severity: 'success', summary: res.body?.message });
					this.tableData = res.body?.results;
					this.totalRecords = res.body.totalRecords;

					setTimeout(() => {
						this.msgs = [];
					}, 2000);
				}
			}, 
			error: (err) => {
				this.msgs = [];
				this.tableData = [];
				this.msgs.push( { severity: 'error', summary: err.message } );
			}
		})
	}

	getUpdateTableDataList( { event: { rows, first } } ) {
		this.getPromptHistory( rows, first );
	}
}
