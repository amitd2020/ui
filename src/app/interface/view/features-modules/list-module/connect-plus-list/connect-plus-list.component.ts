import { Component, OnInit } from '@angular/core';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';

@Component({
  selector: 'dg-connect-plus-list',
  templateUrl: './connect-plus-list.component.html',
  styleUrls: ['./connect-plus-list.component.scss']
})

export class ConnectPlusListComponent implements OnInit {

    totalNumOfRecords: number; 
    constantMessages: any = UserInteractionMessages;

    resetDisplayModelTable = {
        displayModal: true,
        resetTable: false,
    };
    
    tableCols: any[] = [];
    tableData: any[] = [];
    actionCols: any[] = [];
    listParams: any[] = [];
    msgs: any[] = [];

	constructor( private serverCommunicate: ServerCommunicationService, private sharedLoaderService: SharedLoaderService) {}

	ngOnInit() {

		this.tableCols = [
            { field: 'listName', header: 'List Name', minWidth: '500px', maxWidth: 'none', textAlign: 'left' },
            { field: 'page', header: 'Page', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
            { field: 'companiesProfileIdInList', header: 'Number of Records', minWidth: '200px', maxWidth: '200px', textAlign: 'right' },
            { field: 'createdAt', header: 'Created On', minWidth: '250px', maxWidth: '250px', textAlign: 'center' },
            { field: 'updatedAt', header: 'Updated On', minWidth: '250px', maxWidth: '250px', textAlign: 'center' },
            { field: 'edit', header: 'Action', minWidth: '100px', maxWidth: '100px', textAlign: 'center' }
        ];

        this.actionCols = [ 'Edit', 'Delete', 'Data Enrichment' ];

        this.getConnectPlusListData();
	}

	getConnectPlusListData( pageSize?, pageNumber?, pageName? ) {

        this.sharedLoaderService.showLoader();

        this.listParams = [
			{ key: 'pageName', value: pageName ? pageName : '' },
            { key: 'limit', value: pageSize ? pageSize : 25, },
            { key: 'skip', value: pageNumber ? ( pageSize * pageNumber ) : 0 },
        ];
        
        this.serverCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'connectPlusLists', undefined, undefined, this.listParams ).subscribe( res => {

            this.totalNumOfRecords = res.body['totalCount'];
            this.tableData = res.body.result;

            this.sharedLoaderService.hideLoader();
        });

    }

    getUpdateActionField( event ) {

		switch( event.name ) {
			case "edit":
				this.editFunction( event.listName, event.userID, event._id );
				break;
            case "delete":
                this.deleteList( event._id );
                break;
            case "dataEnrichment":
                this.dataEnrichmentList( event._id, event.page );
                break;
		}
		
	}

	dataEnrichmentList ( id, pageName ) {
		this.sharedLoaderService.showLoader();

		let requestBody = {
			pageName: pageName,
			listId: id
		};

		this.serverCommunicate.globalServerRequestCall( 'post', 'DG_LOGIN', 'enrichDataPerson', requestBody ).subscribe(res => {
			
			if (res.status === 200) {
				this.msgs = [];
				this.msgs.push({ severity: 'success', summary: res.body.message });
				setTimeout(() => {
					this.msgs = [];
				}, 4000);
				this.sharedLoaderService.hideLoader();
				
            }
		}, err => {
			this.msgs = [];
				this.msgs.push({ severity: 'error', summary: err.error.message });
				setTimeout(() => {
					this.msgs = [];
				}, 4000);
				this.sharedLoaderService.hideLoader();

		});
	}

    editFunction( listName, userID , id ) {
		let requestBody = {
			listName: listName,
			userID: userID,
			_id: id
		};

		this.serverCommunicate.globalServerRequestCall( 'post', 'DG_LIST', 'updateConnectListName', requestBody ).subscribe(res => {
			if (res.status === 200) {
				
				this.resetDisplayModelTable.displayModal = false;
				this.resetDisplayModelTable.resetTable = true;
				
				this.msgs = [];
				this.msgs.push({ severity: 'success', summary: listName + this.constantMessages['successMessage']['listNameSuccess'] });
				setTimeout(() => {
					this.msgs = [];
				}, 2000);
            }

            this.getConnectPlusListData();


			// else if (res.status === 222) {
			// 	this.resetDisplayModelTable.displayModal = false;
			// 	this.msgs = [];
			// 	this.msgs.push({ severity: 'info', summary: 'Duplicate Entries are not allowed!' });
			// 	setTimeout(() => {
			// 		this.msgs = [];
			// 	}, 3000);
			// } else if (res.status === 201) {
			// 	this.resetDisplayModelTable.displayModal = false;
			// 	this.msgs = [];
			// 	this.msgs.push({ severity: 'warn', summary: 'Somthing bad happed, Please try later again1!' });
			// 	setTimeout(() => {
			// 		this.msgs = [];
			// 	}, 3000);
			// } else if (res.status === 202) {
			// 	this.resetDisplayModelTable.displayModal = false;
			// 	this.getCompanyListData();
			// 	this.msgs = [];
			// 	this.msgs.push({ severity: 'success', summary: listName + this.constantMessages['successMessage']['listNameSuccess'] });
			// 	setTimeout(() => {
			// 		this.msgs = [];
			// 	}, 3000);
			// } else if (res.status == 409) {
			// 	this.resetDisplayModelTable.displayModal = false;
			// 	this.msgs = [];
			// 	this.msgs.push({ severity: 'info', summary: this.constantMessages['infoMessage']['listNameAlreadyExistMsg'] });
			// 	setTimeout(() => {
			// 		this.msgs = [];
			// 	}, 3000);
			// }
		}, err => {
			if ( err['status'] == 409 ) {
				this.resetDisplayModelTable.displayModal = false;
				this.msgs = [];
				this.msgs.push({ severity: 'info', summary: this.constantMessages['infoMessage']['listNameAlreadyExistMsg'] });
				setTimeout(() => {
					this.msgs = [];
				}, 3000);
			}
		});
	}

    deleteList( id ) {

		this.serverCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'deleteConnectListByListId', [ id ] ).subscribe( res => {
			this.resetDisplayModelTable.resetTable = true;
			if (res) {
				this.getConnectPlusListData();
				
				this.msgs = [{ severity: 'info', detail: this.constantMessages['successMessage']['recordDeletedSuccess'] }];
				
				setTimeout(() => {
					this.msgs = [];
				}, 3000);
			}
		})
							
	}

    getUpdateTableDataList( updatedData ) {
		this.getConnectPlusListData( updatedData.event.rows, updatedData.event.page, updatedData.pageName );
	}
}
