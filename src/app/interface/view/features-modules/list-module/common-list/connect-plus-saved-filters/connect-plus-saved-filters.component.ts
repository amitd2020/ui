import { Component, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { UserInfoType } from 'src/app/interface/auth-guard/user-auth/user-info';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';

import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
@Component({
  selector: 'dg-connect-plus-saved-filters',
  templateUrl: './connect-plus-saved-filters.component.html',
  styleUrls: ['./connect-plus-saved-filters.component.scss']
})

export class ConnectPlusSavedFiltersComponent implements OnInit {

  title: string = '';
  description: string = '';
  keywords: string = '';
  robots: string = ''; // 'index, follow, noindex, nofollow'

  userDetails: Partial< UserInfoType > = {};
  tableCols: Array<any>;
  tableData: Array<any>;
  totalNumOfRecords: number;
  
    actionCols: any;
    payloadObj: any;
    msgs: any;
  constantMessages: any = UserInteractionMessages;
  resetDisplayModelTable = {
    displayModal: true,
    resetTable: false,
  };

  constructor(
    private seoService: SeoService,
    private userAuthService: UserAuthService,
    private sharedLoaderService: SharedLoaderService,
    private serverCommunicate: ServerCommunicationService
  ) { }

  ngOnInit() {
    
    this.userDetails = this.userAuthService?.getUserInfo();

    this.sharedLoaderService.showLoader();
    this.getSavedFilterData();

    this.tableCols = [
      { field: 'filterName', header: 'Filter Name', minWidth: "400px", maxWidth: '400px', textAlign: "left" },
      { field: 'searchType', header: 'Page', minWidth: "150px", maxWidth: '150px', textAlign: "left" },
      { field: 'chipData', header: 'Filter Criteria', minWidth: "500px", maxWidth: 'none', textAlign: "left" },
      { field: 'createdOn', header: 'Created On', minWidth: "180px", maxWidth: '180px', textAlign: "center" },
      { field: 'updatedOn', header: 'Updated On', minWidth: "180px", maxWidth: '180px', textAlign: "center" },
      { field: 'edit', header: 'Action', minWidth: "100px", maxWidth: '100px', textAlign: "center" }
    ];
    this.actionCols = [ 'Edit', 'Delete' ];

  }
  ngAfterViewInit(): void {

    setTimeout(() => {
      this.sharedLoaderService.hideLoader();
    }, 1000);
  }

  getSavedFilterData( pageSize?, pageNumber? ) {

    let params = [
      pageSize ? pageSize : 25,
      pageNumber ? pageNumber : 1
    ];

    this.serverCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getConnectPlusSaveFilteredLists', params ).subscribe( res => {
      this.tableData = res.body['results'];
      this.totalNumOfRecords = res.body['count'];
      if ( typeof (this.tableData) === "string" || this.tableData == undefined ) {
        this.tableData = [];
      }

    });

  }

  getUpdateTableDataList( event ) {
    
    this.getSavedFilterData( event.rows, event.page + 1 );

  }

  getupdateActionField(event){

    this.payloadObj = event;
    switch(this.payloadObj.name) {
      case "edit":
        this.editFunction( event.filterName,event.userID,event._id );
        break;
      case "delete":
        this.deleteList();
        break;
      
    }
    
  }
  editFunction(filterName, userID , _id){
    let requestBody = { 
      filterName: this.payloadObj.filterName,
      userID: this.userDetails?.dbID,
      _id: this.payloadObj._id
    };

    this.serverCommunicate.globalServerRequestCall( 'post', 'DG_LIST', 'updateConnectPlusFilterName', requestBody ).subscribe(res => {
      if (res.body['status'] === 200) {
        this.resetDisplayModelTable.displayModal = false;
        this.getSavedFilterData();
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: this.constantMessages['successMessage']['listUpdateSuccess'] });
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      if (res.body['status'] === 201) {
        this.resetDisplayModelTable.displayModal = false;
        this.msgs = [];
        this.msgs.push({ severity: 'info', summary: res['message'] });
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      if (res.body['status'] === 202) {
        this.resetDisplayModelTable.displayModal = false;
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: res['body']['message'] });
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      if ( res.body['status'] === 409 ) {
        this.resetDisplayModelTable.displayModal = false;
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: this.constantMessages['infoMessage']['listNameAlreadyExistMsg'] });
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, err => {
      if ( err.body['status'] == 409 ) {
        this.resetDisplayModelTable.displayModal = false;
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: this.constantMessages['infoMessage']['listNameAlreadyExistMsg'] });
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    });
  }

  deleteList() {
    let requestBody = {
      userID : this.userDetails?.dbID,
      _id: this.payloadObj._id
    };
    this.serverCommunicate.globalServerRequestCall( 'post', 'DG_LIST', 'deleteConnectPlusUserFilterCriteria', requestBody ).subscribe( res => {
      this.resetDisplayModelTable.resetTable = true
      if (res) {
        this.getSavedFilterData();
      
        this.msgs = [{ severity: 'info', summary: this.constantMessages['successMessage']['recordDeletedSuccess'] }];

          setTimeout(() => {
            this.msgs = [];
        }, 3000);
      }
    })
              
  }
}

