import { Component, OnInit } from '@angular/core';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { WorkflowService } from '../workflow.service';
import { Message } from 'primeng/api';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SeoService } from 'src/app/interface/service/seo.service';

@Component({
	selector: 'dg-workflow-list',
	templateUrl: './workflow-list.component.html',
	styleUrls: ['./workflow-list.component.scss']
})
export class WorkflowListComponent implements OnInit {

	selectedGlobalCountry: string = 'uk';
	workflowListTableCols = [];
	workflowListTableVals = [];
	searchTotalCount: any;
	pageSize = 25;
	first = 0;
	pageNumber = 1;
    monitorPlusPopUpBool: boolean = false;
    monitorPopUpBool: boolean = false;
	
    iconObj = {
        monitor: 'pi pi-eye',
        monitorPlus: 'pi pi-eye'
    }

	listParams: { cListId: string, listPageName: string } = {
		cListId: '',
		listPageName: ''
	}

	msgs: Message[] = [];
	title: string = '';
	description: string = '';

	constructor(
		private _globalServerCommunication: ServerCommunicationService,
		private _workflowService: WorkflowService,
		private _sharedLoaderService: SharedLoaderService,
		private _activatedRoute: ActivatedRoute,
		private _seoService: SeoService,
	) {}

	ngOnInit() {

		this.initBreadcrumbAndSeoMetaTags();
		this._globalServerCommunication.globalServerRequestCall( 'get', 'DG_LOGIN', 'getUserCommercialId' ).subscribe( res => {
            if(res.body.status == 200) {
                let listIds = res.body.userCommercialIds;
                listIds?.map( (val)=> {
                    this._workflowService.updateListId( val.listName, val._id );
                });
				this._activatedRoute.paramMap.subscribe( ( params: ParamMap ) => {
					this.listParams = this._workflowService.getActiveListParams;
					this.pageNumber = 1;
					this.pageSize = 25;
					this.first = 0;
					if( this._workflowService.getActiveListParams && this._workflowService.getActiveListParams.cListId ) {
						this.fetchClientListData();
					}else{
						this.workflowListTableVals = [];
					}
				});
            }
        });

		this.selectedGlobalCountry = localStorage.getItem('selectedGlobalCountry') ? localStorage.getItem('selectedGlobalCountry') : 'uk';

		this.workflowListTableCols = [
			{ field: 'monitorForRecord', header: 'Monitor', colunName: 'Monitor', width: '70px', textAlign: 'center', value: true, countryAccess: ['uk'], icon: this.iconObj['monitor'], visible: true },
			{ field: 'companyRegistrationNumber', header: 'Company Number', colunName: 'Company Number', width: '150px', textAlign: 'left', value: true, visible: true, countryAccess: ['uk'] },
			{ field: 'businessName', header: 'Company Name', colunName: 'Company Name', width: '360px', textAlign: 'left', value: true, visible: true, countryAccess: ['uk', 'ie'] },
			{ field: 'companyStatus', header: 'Company Status', colunName: 'Company Status', width: '160px', textAlign: 'center', value: true, visible: true, countryAccess: ['uk', 'ie'] },
			{ field: 'internationalScoreDescription', header: 'Risk Band', colunName: 'Risk Band', width: '160px', textAlign: 'left', value: true, visible: true, countryAccess: ['uk', 'ie'] },
			{ field: 'numberOfEmployees', header: 'No. of Employees', colunName: 'No. of Employees', width: '120px', minWidth: '120px', mamaxWidth: '120px', textAlign: 'right', value: false, visible: true, countryAccess: ['uk', 'ie'] },
			{ field: 'turnover_latest', header: 'Turnover', colunName: 'Turnover', width: '200px', textAlign: 'right', value: false, visible: true, countryAccess: ['uk', 'ie'] },
			{ field: 'referenceName', header: 'List Refrence', colunName: 'List Refrence', width: '160px', textAlign: 'left', value: false, visible: true, countryAccess: ['uk'] },
			{ field: 'companyAge', header: 'Age', colunName: 'Age', width: '80px', minWidth: '80px', mamaxWidth: '80px', textAlign: 'right', value: true, visible: true, countryAccess: ['uk', 'ie'] },
			{ field: 'naceCodeInfo', header: 'NACE Code', colunName: 'NACE Code', width: '380px', textAlign: 'left', value: true, visible: true, countryAccess: ['ie'] },
			{ field: 'sicCode07', header: 'SIC Code', colunName: 'SIC Code', width: '380px', textAlign: 'left', value: true, visible: true, countryAccess: ['uk', 'ie'] },
			{ field: 'industryTag', header: 'Industry', colunName: 'Industry', width: '220px', textAlign: 'left', value: true, visible: true, countryAccess: ['uk'] },
		];

		this.workflowListTableCols = this.workflowListTableCols.filter( col => col.countryAccess.includes( this.selectedGlobalCountry ) );

	}

	initBreadcrumbAndSeoMetaTags() {		
		this.title = "Single Place for Upload CSV, Insights, Compare Companies & Monitor for Companies.";
		this.description = "Workflow: Easy Access to Download and Upload csv files at datagardener on Single Screen.";
		this._seoService.setPageTitle(this.title);
		this._seoService.setDescription(this.description)	
	}

	fetchClientListData() {

		this._sharedLoaderService.showLoader();

		let payloadForCompanyInList = {
			"filterData": [],
			"pageSize": this.pageSize,
			"filterSearchArray": [],
			"sortOn": [],
			"listId": this.listParams?.cListId,
			"pageName": this.listParams?.listPageName,
			"pageNumber": this.pageNumber
		}

		this._globalServerCommunication.globalServerRequestCall( 'post', 'DG_API', 'companiesByListId', payloadForCompanyInList ).subscribe({
			next: ( res ) => {

				if ( res.body['status'] == 200 ) {
                    let dataArray = [];
					this.workflowListTableVals = [];
    
					this.searchTotalCount = res.body['total'];

					this._workflowService.totalSearchCount = this.searchTotalCount;
					this._workflowService.updateWorkflowList();

					if ( this.searchTotalCount > 0 ) {
						for ( let resultData of res.body['results'].hits ) {
							dataArray.push( resultData._source );
						}
						
						// this.workflowListTableVals = [];
						this.workflowListTableVals =  dataArray;
						
						for (let i = 0; i < dataArray.length; i++) {
							if (dataArray[i].simplifiedAccounts) {
								if(dataArray[i].simplifiedAccounts[0].turnover && dataArray[i].simplifiedAccounts[0].turnover != ""){
									dataArray[i]['turnover_latest'] = dataArray[i].simplifiedAccounts[0].turnover;
								} else {
									dataArray[i]['turnover_latest'] = "-";
								}
								if(dataArray[i].simplifiedAccounts[0].estimated_turnover && dataArray[i].simplifiedAccounts[0].estimated_turnover != ""){
									dataArray[i]['estimated_turnover'] = dataArray[i].simplifiedAccounts[0].estimated_turnover;
								} else {
									dataArray[i]['estimated_turnover'] = "-";
								}
								if(dataArray[i].simplifiedAccounts[0].totalAssets && dataArray[i].simplifiedAccounts[0].totalAssets != ""){
									dataArray[i]['totalAssets_latest'] = dataArray[i].simplifiedAccounts[0].totalAssets;
								} else {
									dataArray[i]['totalAssets_latest'] = "-";
								}
								if(dataArray[i].simplifiedAccounts[0].totalLiabilities && dataArray[i].simplifiedAccounts[0].totalLiabilities != ""){
									dataArray[i]['totalLiabilities_latest'] = dataArray[i].simplifiedAccounts[0].totalLiabilities;
								} else {
									dataArray[i]['totalLiabilities_latest'] = "-";
								}
								if (dataArray[i].simplifiedAccounts[0].numberOfEmployees) {
									dataArray[i]['numberOfEmployees'] = parseInt(dataArray[i].simplifiedAccounts[0].numberOfEmployees);
								}
								
							}
						
						}
					}

                }

				setTimeout(() => {
					this._sharedLoaderService.hideLoader();
				}, 100);

			},
			error: ( err ) => {
				setTimeout(() => {
					this._sharedLoaderService.hideLoader();
				}, 100);
				console.log(err);
			}
		})
	}

	changePaginator( event: any ) {
		this.pageNumber = event.page + 1;
		this.pageSize = event.rows;
		this.first = event.first
		this.fetchClientListData();
	}

	deleteCompaniesFromList( companyNumbers: Array< string > ) {
		
		var obj = {
			listId: this.listParams.cListId,
			companies: companyNumbers,
			deletePageName: this.listParams.listPageName
		};

		this._globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'updateUserSaveCompaniesListById', obj ).subscribe( res => {
			
			this.msgs = [];
			
			if ( res.body.status === 200 ) {
				this.msgs.push({ severity: 'success', summary: "Companies In List Data deleted!!" });
				setTimeout(() => {
					this.msgs = [];
				}, 3000);

				this.fetchClientListData();

			} else {
				this.msgs.push({ severity: 'error', summary: "Companies In List Data not deleted!!" });
				setTimeout(() => {
					this.msgs = [];
				}, 3000);
			}
			
		});

	}

	tableOutputHandler( event: unknown ) {
		
		if ( event['monitorBoolean'] ) {

			let PayloadFromWorkflowMonitor = event;
			delete PayloadFromWorkflowMonitor['monitorBoolean'];
			PayloadFromWorkflowMonitor['listId'] = this.listParams?.cListId;
			// PayloadFromWorkflowMonitor['monitorActivation'] = event['isAllMonitor'];
			if ( event['isAllMonitor'] == false ) {
				PayloadFromWorkflowMonitor['monitorActivation'] = false;
			}

			this._globalServerCommunication.globalServerRequestCall( 'post', 'DG_LIST', 'workflowAddToMonitor', PayloadFromWorkflowMonitor ).subscribe({
                next: ( res ) => {
					this.fetchClientListData();
					if( res.body.code == 200 ) {
						this.msgs = [];
						this.msgs.push({ severity: 'success', summary: res.body.message });
						setTimeout(() => {
							this.msgs = [];
						}, 3000);
					}

				},
				error: ( err ) => {
					console.log(err);					
				}
			})

		} else {

			switch ( event['type'] ) {
				case 'deleteCompaniesFromList':
					this.deleteCompaniesFromList( event['companyNumbers'] );
					break;
			
				default:
					this.changePaginator( event );
					break;
			}
		}
		

		

		
	}

}
