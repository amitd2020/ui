import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SharedLoaderService } from '../../shared-loader/shared-loader.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SearchCompanyService } from '../../../features-modules/search-company/search-company.service';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { ActivatedRoute } from '@angular/router';
import { DataCommunicatorService } from '../../../features-modules/company-details-module/data-communicator.service';
import { ConfirmationService } from 'primeng/api';
import { UserInteractionMessages } from 'src/assets/utilities/data/UserInteractionMessages.const';
import { DatePipe } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { cg } from '@fullcalendar/core/internal-common';


@Component({
	selector: 'dg-contract-finder',
	templateUrl: './contract-finder.component.html',
	styleUrls: ['./contract-finder.component.scss' ]
})
export class ContractFinderComponent implements OnInit, OnChanges {

	@Input() rawSearchField;
	
	tableAttribute: object = {
		scrollHeight: '16rem'
	}
	rows: number = 25;
	first: number = 0;
	
	contractMessage: Array<any> = [];

	filterData = [{ "chip_group": "Contract Status", "chip_values": ["awarded", "closed", "open"] }];
	globalFilterDataObject: any = {
		pageSize: this.rows,
		startAfter: this.first,
		filterData: [],
		sortOn: [],
		userId: this.userAuthService?.getUserInfo('dbID')
	};
	payloadForContractMonitoring: object = {
		"buyer_name": "",
		"title": "",
		"published_date": "",
		"notice_identifier": "",
		"monitoringStatus": "",
		"contractAmount": "",
		"contractStatus": "",
		"contractLatestUpdate": "",
		"id":"",
	}
	preparedGraphData: any[] = [ 
		{ graphKey: 'closingDateForOpenContractsForNextTwelveMonths', headerContent: 'CLOSING DATE FOR OPEN CONTRACTS', iTagContent: 'The final submission deadline for proposals or bids under active procurement opportunities.', graphData: {}, graphOption: {}, height: '220px', meaningfulText: '' }, 
		{ graphKey: 'closingDateForAwardedContractsForNextTwelveMonths', headerContent: 'CONTRACT END DATE FOR AWARDED', iTagContent: 'The date when the obligations and terms of an awarded contract officially conclude.', graphData: {}, graphOption: {}, height: '220px', meaningfulText: '(Possibility of renewals)' } 
	];

	tableColumnData: any[] = [ 
		{ key: 'spendByIndustry', header: 'SPEND BY INDUSTRY', iTagContent: 'The allocation of financial expenditures categorized by specific sectors or industries.', tableColumn: [{ field: 'label', header: '', minWidth: '200px', maxWidth: '200px', textAlign: 'left', class: 'text-base' }, { field: 'doc_count', header: "Amount", minWidth: '80px', maxWidth: '80px', textAlign: 'right', class: 'font-semibold' }, { field: 'count_percentage', header: 'Amount %', minWidth: '140px', maxWidth: 'none', textAlign: 'right', showProgressBarWithPercentage: true, class: 'font-semibold' } ], tableData: [], colClass: '', showITagContent: true, meaningfulText: '' },

		{ key: 'spendByRegion', header: 'SPEND BY REGION', iTagContent: 'The distribution or allocation of financial expenditures across different geographic areas or regions.', tableColumn: [ { field: 'label', header: '', minWidth: '70px', maxWidth: 'none', textAlign: 'left', class: 'text-base' }, { field: 'doc_count', header: "Amount", minWidth: '80px', maxWidth: '80px', textAlign: 'right', class: 'font-semibold' }, { field: 'count_percentage', header: 'Amount %', minWidth: '140px', maxWidth: '140px', textAlign: 'right', showProgressBarWithPercentage: true, class: 'font-semibold'} ], tableData: [], colClass: '', showITagContent: true, meaningfulText: '' },

		{ key: 'top10Supplier', header: 'TOP 10 SUPPLIERS', iTagContent: '', tableColumn: [ { field: 'label', header: '', minWidth: '200px', maxWidth: '200px', textAlign: 'left', class: 'text-base' }, { field: 'doc_count', header: "Amount", minWidth: '80px', maxWidth: '80px', textAlign: 'right', class: 'font-semibold' }, { field: 'count_percentage', header: 'Amount %', minWidth: '140px', maxWidth: 'none', textAlign: 'right', showProgressBarWithPercentage: true, class: 'font-semibold' } ], tableData: [], colClass: '', showITagContent: false, meaningfulText: '(Supplier can be a partial or full contributor to this contract)' }
	];

	dataForChart: any = {};
	noticeIndentifierSummaryData: any;
	noticeIdentifierNo: any;
	dateTimelineView: any[];
	viewNoticeIndentifierModal: boolean = false;
	contractFinderSuppliersDataValues: Array<any>;
	contractFinderMonitorBool: boolean = false;
	contractMonitorApiEndPoint: string = ''
	payloadForChildApi;
	listPageName: string;
	listName: string;
	clickData: any;
	clickDataLabel: string;
	clickDataHeader: string;
	companyNumber: any;
	optionsForChart: any = {};
	tableColumn: any = [];
	buyerData: any = [];
	totalContractFinderColumns: any[];
	tableData: any[];
	changeTable: boolean = false;
	visibleFilterSidebar: boolean = false;
	selectedFilter: any;
	finalDataToDisplay: any;	
	searchTotalCount: number = 0;
	reInitTableDataValuesForReset: boolean = true;	
	resetAppliedFiltersBoolean: boolean = false;
	procurementSummary: any;
	summaryDataForcard: any;
	formattedsummaryDataForcard : any;
	booleanForApplyFilter: boolean = false;
	pageChange: any;
	apiEndPoint: string;
	selectedCompany: any[] = [];
	showHeaderCard: boolean = false;
	messages: any[] = [];
	constantMessages: any = UserInteractionMessages;
	
	constructor(		
		public userAuthService: UserAuthService,
		public toNumberSuffix: NumberSuffixPipe,
		public commonService: CommonServiceService,
		private sharedLoaderService: SharedLoaderService,		
		private searchCompanyService: SearchCompanyService,
		private globalServiceCommnunicate: ServerCommunicationService,
		public activateRouter: ActivatedRoute,
		private dataCommunicatorService: DataCommunicatorService,
		private confirmationService: ConfirmationService,
		private datePipe: DatePipe
		

	) {}
	selectedPeriodValue: { fromDate: Date, toDate: Date } = {
		fromDate: undefined,
		toDate: undefined
	};
	todayDate = new Date(); // Tracks if the date range is selected
	selectedRadio: string | null = null; // Tracks the currently selected radio button
	isButtonDisabled = true;
	startDate: string | null = null; // Stores the selected Start Date
  	endDate: string | null = null; // Stores the selected End Date


	selectedTimeframe: string = '';
	inputSearchKey: string | null = null;

	radioButtonArray: any[] = [
		{ lable: '3 Months', value: '3 Months', dateRange: { fromDate: new Date(new Date().setDate(new Date().getDate() - 90)), toDate: this.todayDate } },
		{ lable: '6 Months', value: '6 Months', dateRange: { fromDate: new Date(new Date().setDate(new Date().getDate() - 180)), toDate: this.todayDate } },
		{ lable: '12 Months', value: '12 Months', dateRange: { fromDate: new Date(new Date().setDate(new Date().getDate() - 365)), toDate: this.todayDate } }
	];
	selectedStatus: string | null = 'successful';

	async ngOnInit() {

		this.searchCompanyService.$apiPayloadBody.subscribe(res => {
			this.payloadForChildApi = res;
		});

		this.dataCommunicatorService.$dataCommunicatorVar.subscribe((res: any) => {
			this.companyNumber = res.companyRegistrationNumber;
		});

		const { cListId, listName, pageName, listPageName, chipData, shareId } = this.activateRouter.snapshot.queryParams;
		this.listPageName = pageName || listPageName;
		this.listName = listName;

		if ( this.activateRouter ) {
			
			const {  params, queryParams, routeConfig } =  this.activateRouter.snapshot;
			let companyNo = params?.companyNo ?? queryParams?.companyNo;

			if ( !['contract-finder', 'buyer', 'supplier'].includes( routeConfig?.path ) ) {
				this.visibleFilterSidebar = false;
				this.globalFilterDataObject['referenceNumber'] = companyNo ?? this.companyNumber;
				this.apiEndPoint = 'getContractFinderDataForReferenceNumber';
			} else {

				if ( routeConfig?.path == 'contract-finder' ) {
					this.visibleFilterSidebar = true;
				}

				this.apiEndPoint = 'getContractFinderDataRevamp';

				if( chipData ) {
					this.globalFilterDataObject['filterData'] = JSON.parse(chipData);
				} else if ( cListId ) {
					this.globalFilterDataObject.filterData.push({ chip_group: 'Saved Lists', chip_values: [listName] });
					this.searchCompanyService.updatePayload({ filterData: this.globalFilterDataObject.filterData });
				} else if( shareId ){
					let param = [
						{ key:'shareId', value: shareId }
					];
					const CompanyDetailAPIResponse = await lastValueFrom(this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getSharedCriteriaInfo', undefined, undefined, param ) )
		
					if ( CompanyDetailAPIResponse.body.status = 200 ) {
						this.globalFilterDataObject.filterData = CompanyDetailAPIResponse.body.result.criteria;
						this.searchCompanyService.updatePayload( { filterData: CompanyDetailAPIResponse.body.result.criteria  } );
						this.searchCompanyService.updateFilterPanelApplyButtons();
					} 
				} else {
					this.globalFilterDataObject['filterData'] = this.filterData;
				}
				
				if ( this.globalFilterDataObject?.referenceNumber ) {
					delete this.globalFilterDataObject?.referenceNumber
				}
				
			}
			this.showHeaderCard =  queryParams?.showDetailHeaderCard == 'true' ? true : false;
		}

			this.globalFilterDataObject.listId = cListId ? cListId : '';
			this.globalFilterDataObject.pageName = this.listPageName ? this.listPageName : '';
			if( this.globalFilterDataObject.listId ) {
				this.searchCompanyService.updateListViewTemplate( true, cListId, 'govermentProcurement' );
			}
			this.searchCompanyService.updatePayload({ filterData: this.globalFilterDataObject.filterData });

		this.getContractFinderData();
		
		this.totalContractFinderColumns = [
			{ field: 'title', header: 'Title', minWidth: '260px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'awarded_value', header: 'Value of contract', minWidth: '150px', maxWidth: '150px', textAlign: 'right' },
			{ field: 'contract_start_date', header: 'Contract start date', minWidth: '160px', maxWidth: '160px', textAlign: 'center' },
			{ field: 'contract_end_date', header: 'Contract end date', minWidth: '160px', maxWidth: '160px', textAlign: 'center' },
			{ field: 'buyer_name', header: 'Buyer name', minWidth: '220px', maxWidth: '220px', textAlign: 'left' },
			{ field: 'suppliers', header: 'Supplier name', minWidth: '220px', maxWidth: '220px', textAlign: 'left' },
			// { field: 'procurementStage', header: 'Procurement stage', minWidth: '170px', maxWidth: '170px', textAlign: 'left' },
			// { field: 'procurementType', header: 'Procurement type', minWidth: '170px', maxWidth: '170px', textAlign: 'left' },
			{ field: 'locationOfContract', header: 'Location of contract', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'code_desc_key', header: 'Industry (CPV codes)', minWidth: '220px', maxWidth: '220px', textAlign: 'left' }
		];

		this.optionsForChart = {
			maintainAspectRatio: false,
			aspectRatio: 0.8,
			scales: {
				x: {
					grid: {
						display: true,
						drawBorder: false,
						drawTicks: false,
						tickLength: 0,
						borderDash: function ( context ): any {
							if ( context.index == 0 ) {
								return [];
							} 
						},
						color: context => context.index == 0 ? '#e5e5e5' : '#fff'
					}
				},
				y: {
					grid: {
						display: true,
						drawBorder: false,
						drawTicks: false,
						tickLength: 0,
						borderDash: function ( context ): any {
							if ( context.tick.value > 0 && context.index != 0 ) {
								return [5, 10]
							}
						},
						color: context => context.index == 0 ? 'rgba(0, 0, 0, 0.2)' : '#bbb'
					}
				},
			},
			plugins: {
				legend: {
					display: false,
					position: 'top',
					align: 'end', 
					labels: {
						usePointStyle: true,
						boxWidth: 10, 
						boxHeight: 10,
						borderRadius: 50,
						padding: 15, 
						font: {
							size: 10, 
						},
						color: 'black',  
					}
				},
				title: {
					display: false,
				},
				datalabels: {
					display: (context) => {
						let dataset = context.dataset;
						let value = dataset.data[context.dataIndex];
						return value;
					},
					backgroundColor: function (context) {
						return context.dataset.backgroundColor;
					},
					color: function (context) {
						let value = context.dataset?.borderColor;
						return value ? value : 'white';
					},
					font: { weight: 'bold' },
					borderColor: 'white',
					borderRadius: 25,
					borderWidth: 2,
					padding: { top: 4, right: 6, bottom: 3, left: 6 },
					anchor: 'end',
				},
				tooltip: {
					enabled: true,
					titleFontFamily: 'Roboto',
					bodyFontFamily: 'Roboto',
					callbacks: {
						label: ( tooltipItem ) => {
							if ( tooltipItem?.raw?.monthlySpend ) {
								return `${ tooltipItem.formattedValue } | Spend: ${ this.toNumberSuffix.transform( tooltipItem.raw.monthlySpend, '0', 'GBP' ) }`;
							} else {
								return `${ tooltipItem.formattedValue }`;
							}
						}
					}
				},
			},
			onClick: (event, clickedElements) =>{
				let index = clickedElements[0].index;
				let key = event.chart.config._config.data.graphData[index].key;
				let label = event.chart.config._config.data.graphKey;
				let data = event.chart.config._config.data.graphData[index]
				let header = label == "closingDateForAwardedContractsForNextTwelveMonths" ? 'CONTRACT END DATE FOR AWARDED (Possibility of Renewals)' : 'CLOSING DATE FOR OPEN CONTRACTS'
				this.gotoTable( label, key, data, header)
				
			},
			onHover: (event) => {
				event.native.target.style.cursor = 'pointer';
			}
		};

		this.tableColumn = [
			{ field: 'label', header: '', minWidth: '200px', maxWidth: '200px', textAlign: 'left', class: 'text-base' },
			{ field: 'doc_count', header: "Amount", minWidth: '80px', maxWidth: '80px', textAlign: 'right', class: 'font-semibold' },
			{ field: 'count_percentage', header: 'Amount %', minWidth: '140px', maxWidth: 'none', textAlign: 'right', showProgressBarWithPercentage: true, class: 'font-semibold' },
		];
	}

	ngOnChanges(changes: SimpleChanges) {

		if ( changes?.rawSearchField?.currentValue ) {
			this.globalFilterDataObject.filterData = [];
			this.filterData = [ { chip_group: changes?.rawSearchField?.currentValue?.chipGroup, chip_values: [ changes?.rawSearchField?.currentValue?.chipValue ] } ];
			this.globalFilterDataObject.filterData = this.filterData;
			this.apiEndPoint = 'getContractFinderDataRevamp';
			this.getContractFinderData();
	    }
    }

	getContractFinderData( ) {

		this.sharedLoaderService.showLoader();

		this.listName = this.globalFilterDataObject.pageName;
		this.resetPagination();
		this.selectedCompany = [];
		this.selectedFilter = this.globalFilterDataObject.filterData;

		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_GOVTENABLER_API', this.apiEndPoint, this.globalFilterDataObject ).subscribe({

			next: ( res ) => {
				if ( res.status === 200 ) {
					this.clickDataLabel = '';
					this.clickDataHeader = '';
					this.finalDataToDisplay = res.body;
					this.tableData = [];
					this.tableData = this.finalDataToDisplay.tableData
					this.searchTotalCount = this.finalDataToDisplay.graphData.totalContractsCount;

					this.chartBarData( this.finalDataToDisplay.graphData );
					this.prepareTableData( this.finalDataToDisplay.graphData );
					this.buyerData = this.finalDataToDisplay.graphData.top10Buyer;
					
					this.reInitTableDataValuesForReset = true;
					this.sharedLoaderService.hideLoader();
					this.resetAppliedFiltersBoolean = false;
					this.procurementSummaryData( this.finalDataToDisplay );
				}
				this.sharedLoaderService.hideLoader()
			},

			error: ( err ) => {
				console.log( 'Here is Error Message>>', err );
				this.sharedLoaderService.hideLoader()
			}

		})
	}

	showText(descriptionTextElement?: ElementRef) {
		if (descriptionTextElement['classList'].contains('limitTextHeight')) {
			descriptionTextElement['classList'].remove('limitTextHeight');
			descriptionTextElement['nextElementSibling'].innerText = 'Read Less';
		} else {
			descriptionTextElement['classList'].add('limitTextHeight');
			descriptionTextElement['nextElementSibling'].innerText = 'Read More';

		}
	}

	contractFinderCommunicator( event ) {
		this.reInitTableDataValuesForReset = false;
		this.globalFilterDataObject['filterData'] = event.appliedFilters;
		this.globalFilterDataObject['filterSearchArray'] = event.filterSearchArray ? event.filterSearchArray : '';

		let savedListData = this.globalFilterDataObject.filterData.filter(item => item.chip_group == 'Saved Lists')[0];
		if (!savedListData) {
			this.globalFilterDataObject.listId = '';
			this.globalFilterDataObject.pageName = '';
		}

		this.getContractFinderData();
	}

	deleteCompanyInList() {
		let tableDataId = []
		for (let data of this.selectedCompany ) {
			tableDataId.push(data.id);
		}
		this.confirmationService.confirm({
			message: this.constantMessages['confirmation']['delete'],
			header: 'Delete Confirmation',
			icon: 'pi pi-info-circle',
			key: 'crmConfirmationForRecordList',
			accept: () => {

				var obj = {
					listId: this.activateRouter.snapshot.queryParams['cListId'],
					ids: tableDataId,
					deletePageName: 'govermentProcurement'
				};
				this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_LIST', 'deleteGovermentProcurmentIdsFromList', obj ).subscribe( res => {
					
					this.messages = [];
					if (res.body.status === 200) {
						this.messages.push({ severity: 'success', summary: "Companies In List Data deleted!!" });
						this.selectedCompany = []
						setTimeout(() => {
							this.messages = [];
						}, 3000);
					} else {
						this.messages.push({ severity: 'error', summary: "Companies In List Data not deleted!!" });
						setTimeout(() => {
							this.messages = [];
						}, 3000);
					}
					setTimeout(() => {
						this.getContractFinderData()
					}, 2000);
				});
	
			}
		});
	}

	getNoticeIndentifierData( event ) {
		
		// this.noticeIdentifierNo = ['?id=' + event];
		this.noticeIdentifierNo = [ { key: 'id', value:  event } ]

		this.globalServiceCommnunicate.globalServerRequestCall('get', 'DG_GOVTENABLER_API', 'getContractHistory', undefined, undefined, this.noticeIdentifierNo).subscribe(res => {

			if (res.body['status'] == 200) {
				this.noticeIndentifierSummaryData = res.body['results'];
			}

			this.payloadForContractMonitoring = {
				"buyer_name": this.noticeIndentifierSummaryData?.['buyer_name'],
				"title": this.noticeIndentifierSummaryData?.['title'],
				"published_date": this.noticeIndentifierSummaryData?.['published_date'],
				"notice_identifier": this.noticeIndentifierSummaryData?.['notice_identifier'],
				"monitoringStatus": this.noticeIndentifierSummaryData?.['isMonitor'],
				"contractAmount": this.noticeIndentifierSummaryData?.['awarded_value'],
				"contractStatus": this.noticeIndentifierSummaryData?.['status'],
				"contractLatestUpdate": this.noticeIndentifierSummaryData?.['status'],
				"id": event,
			}


			this.dateTimelineView = [
				{ status: 'Closing Date', date: this.noticeIndentifierSummaryData?.closing_date },
				{ status: 'Awarded Date', date: this.noticeIndentifierSummaryData?.awarded_date },
				{ status: 'Published Date', date: this.noticeIndentifierSummaryData?.published_date },
				{ status: 'Contract Start Date', date: this.noticeIndentifierSummaryData?.contract_start_date },
				{ status: 'Contract End Date', date: this.noticeIndentifierSummaryData?.contract_end_date }
			];

			this.viewNoticeIndentifierModal = true;

		});

		this.supplierDataByNoticeIndentifier();

	}

	monitorContract(){

		this.contractMonitorApiEndPoint = this.payloadForContractMonitoring['monitoringStatus'] ? 'removeContractFromProcurementMonitor' : 'saveContractForProcurementMonitor';

		this.globalServiceCommnunicate.globalServerRequestCall('post', 'DG_LIST', this.contractMonitorApiEndPoint, this.payloadForContractMonitoring ).subscribe( res => {

			this.payloadForContractMonitoring['monitoringStatus'] = res?.body?.['isMonitor'];

			this.messagePop( res?.['body']?.['message'] )

		});

	}

	messagePop ( msgResponse ) {

		this.contractMessage = [];
		this.contractMessage.push({ severity: 'success', summary: msgResponse });

		setTimeout(() => {
			this.contractMessage = [];
		}, 3000);

	}

	gotoTable( key?, value?, data?, header? ) {
		this.searchTotalCount = data?.value ? data?.value : data?.count ? data.count : data?.doc_count;
		this.clickDataLabel = data?.label;
		this.clickDataHeader = header;
		this.clickData = data
		
		this.globalFilterDataObject.filterSearchArray = ( key && value ) ? [{ field: key, value: value }] : [];

		this.getTabelResult();
	}

	getTabelResult() {
		this.sharedLoaderService.showLoader();
		this.globalServiceCommnunicate.globalServerRequestCall('post', 'DG_GOVTENABLER_API', 'getContractFinderTableRefreshData', this.globalFilterDataObject).subscribe(res => {

			if (res?.body.status == 200) {
				this.tableData = [];
				this.tableData = res?.body.tableData;
				let target = document.getElementById( 'tableView' );
				if ( target ) {
					target.scrollIntoView({ behavior: 'smooth' });
				}
			}
			setTimeout(() => {
				this.sharedLoaderService.hideLoader();
			}, 2000);
		});
	}

	updateTable(event){
		
		this.gotoTable( event.key, event.value, event.data, event.header)

	}

	formatCompanyNameForUrl( companyName ) {
		return this.commonService.formatCompanyNameForUrl(companyName);
	}

	supplierDataByNoticeIndentifier() {

		this.globalServiceCommnunicate.globalServerRequestCall('get', 'DG_GOVTENABLER_API', 'supplierDataByNoticeIndentifier', undefined, undefined, this.noticeIdentifierNo).subscribe(res => {

			if (res.body['status'] == 200) {
				this.contractFinderSuppliersDataValues = res.body['results']
			}

		});

	}

	changeTableView( event ) {
		if(event.srcElement.innerText == 'TABLE VIEW') {
			this.changeTable = true;
		} else {
			this.changeTable = false;
		}
	}

	chartBarData( rawData ) {
		for( let item of this.preparedGraphData ) {
			let graphData = this.additionalGraphData( rawData[item.graphKey], item.graphKey );
			item['graphData'] = graphData;
			item['graphOption'] = this.optionsForChart;
		}
	}

	additionalGraphData( chartData, graphKey ) {
		// let labels = chartData.map( item => item?.label );
		// let data = chartData.map( item => item?.doc_count );
		let labels = [], data = [];
		chartData.map( item => {
			labels.push( item?.label );
			data.push ( {
				x: item?.label,
				y: item?.doc_count,
				monthlySpend: item?.monthlySpend
			} )
		} )

		return {
			labels: labels,
			datasets: [ { label: '', backgroundColor: '#4e5fbb', data: data } ],
			graphKey: graphKey,
			graphData: chartData
		} 
	}

	prepareTableData( tableData ) {
		let classVal = this.tableColumnData.filter(data => tableData[data['key']]).length;
  		const colClass = classVal === 2 ? 'col-6' : 'col-4';
		
		for( let data of this.tableColumnData ) {
			data['tableData'] = tableData[data['key']];
			data['colClass'] = colClass;
		}

	}
	
	procurementSummaryData( apiResponseData ) {

		this.summaryDataForcard = apiResponseData?.['graphData'];

		const labels = {
			"totalBuyerCount": "Total Buyer's",
			"totalSupplierCount": "Total Supplier's",
			"totalAwardedValue": "Total Awarded Value",
			"totalOpenContractsCount": " Total Open Contract's"
		};

		const icons = {
			"totalBuyerCount": "emoji_events",
			"totalSupplierCount": "shopping_bag",
			"totalAwardedValue": "currency_pound",
			"totalOpenContractsCount": "inventory"
		};

		this.formattedsummaryDataForcard = Object.entries( this.summaryDataForcard?.['procurementSummary'] ).map(([key, value]) => ({
			key: key,
			doc_count: value,
			label: labels[key] || key,
			iconClass: icons[key] || key,
		}));

	}

	requestUpdateTableData(event) {
		if ( this.booleanForApplyFilter == false ) {
			this.globalFilterDataObject['pageSize'] = event.pageSize ? event.pageSize : 25;
			this.globalFilterDataObject['startAfter'] = event.startAfter ? event.startAfter : 0;
			this.globalFilterDataObject['filterSearchArray'] = event.filterSearchArray ? event.filterSearchArray : '';
			this.globalFilterDataObject['sortOn'] = event.sortOn ? event.sortOn : '';
			 
			this.getContractFinderData();
		} else {
			this.pageChange = event;
		}
	}

	onPageChange(event) {
		this.rows = event.rows;
		this.first = event.first;
		this.globalFilterDataObject['pageSize'] = event.rows;
		this.globalFilterDataObject['startAfter'] = event.first;
		this.getTabelResult();
	}

	resetPagination() {
		this.rows = 25;
		this.first = 0;
		this.globalFilterDataObject['pageSize'] = this.rows;
		this.globalFilterDataObject['startAfter'] = this.first;
	}

	displayMessage(event) {
		this.messages = [];
		this.selectedCompany = [];
		this.messages = [ { severity: event.status, detail: event.msgs } ];
		setTimeout( () =>{
			this.messages = [];
		}, 2000 );
	}

	updateStartDate() {

		this.selectedRadio = null;
		if (this.endDate && this.endDate && new Date(this.endDate) < new Date(this.startDate)) {
			this.endDate = null; 
		}
		if (this.startDate && this.endDate && new Date(this.startDate) > new Date(this.endDate)) {
			this.startDate = null;
		}
	}

	toggleRadio( ) {
		this.endDate = null;
		this.startDate = null;
	}

	onStatusChange() {
	}

	performSearch() {
		let fromDate = '', toDate = '', itemObj: object = {};

		if ( this.selectedRadio ) {
			itemObj = this.radioButtonArray.find( item => item.value == this.selectedRadio );
			fromDate = itemObj['dateRange']['fromDate'].toISOString().split('T')[0].replace(/-/g, '/');
			toDate = itemObj['dateRange']['toDate'].toISOString().split('T')[0].replace(/-/g, '/');
		}

		if ( this.startDate ) {
			fromDate = this.datePipe.transform(this.startDate, 'yyyy/MM/dd');
		}
		if ( this.endDate ) {
			toDate = this.datePipe.transform(this.endDate, 'yyyy/MM/dd');

		}

		this.inputSearchKey = this.inputSearchKey.trim();

		if (this.inputSearchKey) {
			// Construct the URL with the input text
			const url = `https://www.whatdotheyknow.com/list/${encodeURIComponent(this.selectedStatus)}?query=${encodeURIComponent(this.inputSearchKey)}&request_date_after=${encodeURIComponent(fromDate)}&request_date_before=${encodeURIComponent(toDate)}&commit=Search`;
			// Redirect to the constructed URL
			window.open(url);
		} else {
			alert('Please enter a search keyword.');
		}
	}

	resetFOI() {
		this.selectedRadio = null;
		this.startDate = null;
		this.endDate = null;
		this.inputSearchKey = null;
		this.selectedStatus = 'successful';
	}
}