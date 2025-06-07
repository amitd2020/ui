import { Component, ElementRef, OnInit } from '@angular/core';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import * as ChartDataSets from "chartjs-plugin-datalabels";
import { TitleCasePipe } from '@angular/common';
import { SharedLoaderService } from '../../shared-loader/shared-loader.service';
import { subscribedPlan } from 'src/environments/environment';
import { SeoService } from 'src/app/interface/service/seo.service';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { SearchCompanyService } from '../../../features-modules/search-company/search-company.service';
import { Scenerios } from './contract_finder.const'
import ChartDataLabels from 'chartjs-plugin-datalabels';

type displayScreen = 'default' | 'screen2' | 'screen3';


@Component({
	selector: 'dg-contract-finder',
	templateUrl: './contract-finder.component.html',
	styleUrls: ['./contract-finder.component.scss']
})
export class ContractFinderComponent implements OnInit {

	title: string = '';
	description: string = '';
	keywords: string = '';
	robots: string = ''; // 'index, follow, noindex, nofollow'
	totalContractFinderColumns: any[];
	contractFinderColumns: any[];
	contractFinderDataValues: any[];
	dateTimelineView: any[];
	selectedPropValues: any[];
	noticeIndentifierSummaryData: any;
	viewNoticeIndentifierModal: boolean = false;
	rightSideFilterBar: boolean = false;
	lineGraphOptions: any;
	totalChartData: any;
	ChartDataLabelsPlugin = ChartDataSets;
	reInitTableDataValuesForReset: boolean = true;
	booleanForApplyFilter: boolean = false;
	subscribedPlanModal: any = subscribedPlan;
	pageChange: any;
	contractFilterDataKeys: any;
	finalDataToDisplay: any;
	searchTotalCount: number = 0;
	contractFinderSupplierColumns: Array<any>;
	contractFinderSuppliersDataValues: Array<any>;
	noticeIdentifierNo: any;
	resetAppliedFiltersBoolean: boolean = false;
	payloadForChildApi;
	visibleFilterSidebar: boolean = false;
	rightBarChartData: object = {};
	rightBarChartOptions: any;
	contractBarChartValData: object = {};
	contractBarChartOptions: any;
	closingDateBarChartData: any;
	closingDateBarChartOptions: any;
	suitableSmeVcseChartData: any;
	suitableSmeVcseChartOptions: any;
	dataForGraph: any;
	mapDataVal: any;
	selectedFilter: any;
	backgroundColor = {
		'Services': '#2d98da',
		'Products': '#FFC312',
		'Works': '#218c74',
		'SME': '#008B8B',
		'VCSE': '#f39c12',
	}

	ChartDataLabelsPlugins = [ChartDataLabels];

	// isFilterSidebarShow: boolean = false;

	globalFilterDataObject: any = {
		pageSize: 25,
		startAfter: 0,
		filterData: [{ "chip_group": "Procurement Stage Status", "label": "Procurement Stage Status", "chip_values": ["awarded", "closed", "open"] }],
		sortOn: [],
		userId: this.userAuthService?.getUserInfo('dbID')
	};
	selectedGlobalCurrency: string = 'GBP';
	listPageName: string;
	listName: string;
	screenType: displayScreen = 'default';
	screenGraph: Array<any> = [];

	constructor(
		public userAuthService: UserAuthService,
		private seoService: SeoService,
		private router: Router,
		public activateRoute: ActivatedRoute,
		public commonService: CommonServiceService,
		public toNumberSuffix: NumberSuffixPipe,
		private toTitleCasePipe: TitleCasePipe,
		private sharedLoaderService: SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService,
		private searchCompanyService: SearchCompanyService

	) {
		if (!this.userAuthService.hasAddOnPermission('governmentEnabler')) {
			this.router.navigate(['/']);
		}
	}

	ngOnInit() {

		this.searchCompanyService.$apiPayloadBody.subscribe(res => {
			this.payloadForChildApi = res;
		});
		
		const { cListId, listName, listPageName, chipData } = this.activateRoute.snapshot.queryParams;
		this.listPageName = listPageName;
		this.listName = listName;

		if ( chipData ) {
			this.globalFilterDataObject.filterData = JSON.parse( chipData );
			this.globalFilterDataObject.listId = cListId;
			this.globalFilterDataObject.pageName = listPageName;
		} else if ( cListId ) {
			this.searchCompanyService.updatePayload({ filterData: this.globalFilterDataObject.filterData });
			this.globalFilterDataObject.filterData.push({ chip_group: 'Saved Lists', chip_values: [listName] });
			this.globalFilterDataObject.listId = cListId;
			this.globalFilterDataObject.pageName = listPageName;
		} else {
			this.searchCompanyService.updatePayload({ filterData: this.globalFilterDataObject.filterData });
		}

		/*
		if ( this.userRoleAndFeatureAuthService.checkUserHasFeatureAccess( 'Global Filter' ) || this.userRoleAndFeatureAuthService.isAdmin() )  {
			this.isFilterSidebarShow = true;
		}
		*/
		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';

		this.initBreadcrumbAndSeoMetaTags();

		this.totalContractFinderColumns = [
			{ field: 'title', header: 'Title', minWidth: '260px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'awardedValue', header: 'Value of contract', minWidth: '150px', maxWidth: '150px', textAlign: 'right' },
			{ field: 'contractStartDate', header: 'Contract start date', minWidth: '160px', maxWidth: '160px', textAlign: 'center' },
			{ field: 'contractEndDate', header: 'Contract end date', minWidth: '160px', maxWidth: '160px', textAlign: 'center' },
			{ field: 'buyerName', header: 'Buyer name', minWidth: '220px', maxWidth: '220px', textAlign: 'left' },
			{ field: 'suppliersName', header: 'Supplier name', minWidth: '220px', maxWidth: '220px', textAlign: 'left' },
			{ field: 'procurementStage', header: 'Procurement stage', minWidth: '170px', maxWidth: '170px', textAlign: 'left' },
			{ field: 'procurementType', header: 'Procurement type', minWidth: '170px', maxWidth: '170px', textAlign: 'left' },
			{ field: 'locationOfContract', header: 'Location of contract', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'cpvCode', header: 'Industry (CPV codes)', minWidth: '220px', maxWidth: '220px', textAlign: 'left' }
		];

		this.contractFinderSupplierColumns = [
			{ field: 'name', header: 'Supplier Name', width: '160px', textAlign: 'left' },
			{ field: 'supplierReg', header: 'Company Number', width: '130px', textAlign: 'right' },
			{ field: 'address', header: 'Address', width: '130px', textAlign: 'left' },
			{ field: 'is_sme', header: 'Is SME', width: '90px', textAlign: 'left' },
			{ field: 'is_vcse', header: 'Is VCSE', width: '90px', textAlign: 'left' },
			{ field: 'postcode', header: 'Post Code', width: '120px', textAlign: 'left' },
			{ field: 'ward', header: 'Ward', width: '130px', textAlign: 'left' },
			{ field: 'constituency', header: 'Constituency', width: '90px', textAlign: 'left' },
			{ field: 'region', header: 'Region', width: '150px', textAlign: 'left' },
		];
		this.visibleFilterSidebar = true;

		// horizontal graph option
		this.closingDateBarChartOptions = {
			maintainAspectRatio: false,
			aspectRatio: 0.8,
			scales: {
				x: {
					grid: {
						drawBorder: false, // Disable grid border
						display: false,    // Hide grid lines
					},
				},
			},
			plugins: {
				legend: {
					display: true,
					position: 'top', // Position the legend at the top
					align: 'end',    // Align the legend to the right
					labels: {
						usePointStyle: true, // Use round point style for legend
						boxWidth: 10,        // Adjust size of the legend icon
						boxHeight: 10,       // Ensure it's proportional for round icons
						borderRadius: 50,    // Make legend icons completely round
						padding: 15,         // Space between legend items
						font: {
							size: 10,        // Adjust font size
							// weight: 'bold'   // Make text bold for better visibility
						},
						color: 'black',       // Customize legend text color
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
				}
			}
		};

		// Vertical graph option
		this.rightBarChartOptions = {
			barPercentage: 0.6,
			indexAxis: 'y',
			layout: {
				padding: { left: 2, right: 30, top: 10, bottom: 10 }
			},
			scales: {
				x: {
					grid: {
						drawBorder: false,
						display: false,
					},
					ticks: {
						display: false,
					}
				},
				y: {
					grid: {
						drawBorder: false,
						display: false
					},
					ticks: {
						color: 'text-500'
					}
				}
			},
			plugins: {
				legend: {
					display: false,
					labels: {
						usePointStyle: false,
						// color: 'var(--surface-a)'
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
					backgroundColor: function(context) {
						return context.dataset.backgroundColor;
					},
					color: function(context) {
						let value = context.dataset?.borderColor;
						return 'white';
					},
					font: { size: '12px' },
					borderColor: 'white',
					borderRadius: 18,
					borderWidth: 2,
					padding: { top: 3, right: 2, bottom: 2, left: 3 },
					anchor: 'end',
					// align: 'center',
					// formatter: ( value ) => {
					// 	value = this.toNumberSuffix.transform( value, 2 );;
					// 	return value;
					// }
				}
			},
			onClick: () => {
				// let url = String(this.router.createUrlTree(['company-search/procurement-stage']));
				// window.open( url, "_blank" );
			}
		};

		this.getContractFinderData();
	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems(
		// 	[
		// 		{ label: "Contract Finder" }
		// 	]
		// )
		this.title = "Contract Finder - DataGardener";
		this.description = " DataGardener provides upto date Contract Finder alert facility with our platform.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setDescription(this.description);
		// this.seoService.setkeywords( this.keywords );
		// this.seoService.setRobots (this.robots );
	}

	getContractFinderData() {

		this.sharedLoaderService.showLoader();

		this.contractFinderColumns = this.columnHandler( this.globalFilterDataObject.filterData );

		this.selectedFilter = this.globalFilterDataObject.filterData;
		this.globalServiceCommnunicate.globalServerRequestCall('post', 'DG_GOVTENABLER_API', 'getContractFinderData', this.globalFilterDataObject).subscribe(res => {

			if (res.body['status'] == 200) {
				
				this.finalDataToDisplay = res.body['results'];
				
				this.reInitTableDataValuesForReset = true;
				
				if ( this.screenType == 'default' ) {

					this.dataPreparedForGraph( this.finalDataToDisplay.procurementStage, this.rightBarChartData );
					this.dataPreparedForGraph( this.finalDataToDisplay.contractType, this.contractBarChartValData );

					this.closingDateBarChartData = this.addColorInDatalabels( this.finalDataToDisplay.closingDate, 'closingDate' );
					this.suitableSmeVcseChartData = this.addColorInDatalabels( this.finalDataToDisplay.suitableForSMEandVCSE, 'suitableForSMEandVCSE' );
				}

				if ( this.screenType == 'screen3' ) {
					
					this.screenGraph.map( rowItem => {
						let graphData = this.addColorInDatalabels( this.finalDataToDisplay?.[ rowItem['graphKey'] ], rowItem['graphKey'] );
						rowItem['graphData'] = graphData;
					} );

					this.dataPreparedForGraph( this.finalDataToDisplay.contractType, this.contractBarChartValData );
				}

				if ( this.screenType == 'screen2' ) {
					
					this.screenGraph.map( rowItem => {

						rowItem['option'] = this.closingDateBarChartOptions;

						if ( rowItem?.fn ) {
							rowItem.fn( () => this.dataPreparedForGraph( this.finalDataToDisplay?.[ rowItem['graphKey'] ], rowItem ) );
						} else {
							let graphData = this.addColorInDatalabels( this.finalDataToDisplay?.[ rowItem['graphKey'] ], rowItem['graphKey'] );
							rowItem['graphData'] = graphData;
						}

						if ( rowItem?.graphOption == 'verticalGraph' ) {
							rowItem['option'] = this.rightBarChartOptions;
						}

					} )
				}

				this.dataForGraph = this.finalDataToDisplay?.['procurementStatus']
				this.mapDataVal = this.finalDataToDisplay.region

				this.contractFinderDataValues = this.finalDataToDisplay['tableData'];
				this.contractFinderDataValues.map(value => {
					if (value.hasOwnProperty('companyRegistrationNumber')) {
						value['nonUkCompanyBool'] = value.companyRegistrationNumber.includes('gb') ? true : false;
					}
					return value;
				});

				this.searchTotalCount = res.body['total'];

				// this.getChartData(this.finalDataToDisplay);

				this.sharedLoaderService.hideLoader();

				this.resetAppliedFiltersBoolean = false;
				// this.dataPreparedForGraph(res.body.results?.['procurementStage']);
				// this.dataPreparedForGraph(res.body.results?.['contractType']);
				// this.suitableSMEvcseData(res.body.results?.['suitableForSMEandVCSE']);

			}
			this.sharedLoaderService.hideLoader();
		});

	}

	columnHandler( filterData ) {

		let columns = [ ...this.totalContractFinderColumns ];
		let scenarios = Scenerios;
		this.screenType = 'default';

		for ( const scenario of scenarios ) {
			const isMatch = scenario.match.every( item => 
				filterData.some( filter => 
					filter.chip_group == item.chip_group &&
					filter.chip_values.length === item.chip_values.length &&
					filter.chip_values.every( value => item.chip_values.includes(value) )
					 
				) 
			);

			if ( isMatch ) {
				this.screenType = scenario?.screen ?? 'default';
				this.screenGraph = scenario?.graph ?? [];
				columns = [];
				let defaulttableColumn = JSON.parse(JSON.stringify(this.totalContractFinderColumns));
				if ( scenario?.addcolumn ) {
					defaulttableColumn = [ ...defaulttableColumn, ...scenario.addcolumn ]
				}
				scenario.include.forEach( field => {
					const column = defaulttableColumn.find(col => col.field === field);
					if (column && !columns.includes(column)) {
						columns.push(column);
					}
				} )
				break;
			}

		}

		return columns;
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

	getNoticeIndentifierData( event ) {

		this.noticeIdentifierNo = ['?noticeIdentifier=' + event];

		let reqObj = [this.noticeIdentifierNo];
		this.globalServiceCommnunicate.globalServerRequestCall('get', 'DG_GOVTENABLER_API', 'getContractHistory', reqObj).subscribe(res => {

			if (res.body['status'] == 200) {
				this.noticeIndentifierSummaryData = res.body['results'];
			}

			this.dateTimelineView = [
				{ status: 'Published Date', date: this.noticeIndentifierSummaryData?.published_date },
				{ status: 'Closing Date', date: this.noticeIndentifierSummaryData?.closing_date },
				{ status: 'Awarded Date', date: this.noticeIndentifierSummaryData?.awarded_date },
				{ status: 'Contract Start Date', date: this.noticeIndentifierSummaryData?.contract_start_date },
				{ status: 'Contract End Date', date: this.noticeIndentifierSummaryData?.contract_end_date }
			];

			this.viewNoticeIndentifierModal = true;

		});

		this.supplierDataByNoticeIndentifier();

	}

	formatCompanyNameForUrl( companyName ) {
		return this.commonService.formatCompanyNameForUrl(companyName);
	}

	showText( descriptionTextElement: ElementRef ) {

		if (descriptionTextElement['classList'].contains('limit-text')) {
			descriptionTextElement['classList'].remove('limit-text');
			descriptionTextElement['nextElementSibling'].innerText = 'Read Less';
		} else {
			descriptionTextElement['classList'].add('limit-text');
			descriptionTextElement['nextElementSibling'].innerText = 'Read More';

		}

	}

	requestUpdateTableData( event ) {

		if (this.booleanForApplyFilter == false) {
			this.globalFilterDataObject['pageSize'] = event.pageSize ? event.pageSize : 25;
			this.globalFilterDataObject['startAfter'] = event.startAfter ? event.startAfter : 0;
			this.globalFilterDataObject['filterSearchArray'] = event.filterSearchArray ? event.filterSearchArray : '';
			this.globalFilterDataObject['sortOn'] = event.sortOn ? event.sortOn : '';

			this.getContractFinderData();
		} else {
			this.pageChange = event;
		}


	}

	getAfterAppliedData( event ) {

		this.finalDataToDisplay = event.data['results'];

		this.contractFinderDataValues = this.finalDataToDisplay['tableData'];

		this.booleanForApplyFilter = event.booleanForApplyFilter;
		this.searchTotalCount = event.data['total'];
		// this.getChartData(this.finalDataToDisplay);
		this.rightSideFilterBar = false;

	}

	resetFilterCriteria( event ) {

		if (event = true) {

			this.getContractFinderData();

		}

	}

	closeSideBarPanel( event ) {
		if (event == true) {
			this.rightSideFilterBar = false;
		}
	}

	supplierDataByNoticeIndentifier() {

		let reqObj = [this.noticeIdentifierNo];
		this.globalServiceCommnunicate.globalServerRequestCall('get', 'DG_GOVTENABLER_API', 'supplierDataByNoticeIndentifier', reqObj).subscribe(res => {

			if (res.body['status'] == 200) {
				this.contractFinderSuppliersDataValues = res.body['results']
			}

		});

	}

	resetGovtEnablerFilters() {
		this.resetAppliedFiltersBoolean = true;
		this.searchCompanyService.resetPayload();
		this.globalFilterDataObject.filterData = [{ "chip_group": "Procurement Status", "label": "Procurement Status", "chip_values": ["awarded", "closed", "open"] }]
		this.selectedPropValues = [{ "chip_group": "Procurement Status", "label": "Procurement Status", "chip_values": ["awarded", "closed", "open"] }];
		this.getContractFinderData();
	}

	dataPreparedForGraph( stageData, graphItem? ) {

		let stageDataLabels = [], stageDatasData = [];
		
		for (let keyValue of stageData) {
			
			stageDataLabels.push(this.toTitleCasePipe.transform(keyValue.status));
			stageDatasData.push(keyValue.counts);
		}

		if ( graphItem ) {
			graphItem['graphData'] = {
				labels: stageDataLabels,
				datasets: [
					{
						label: '',
						backgroundColor: '#218c74',
						borderColor: '#B33771',
						data: stageDatasData,
						borderRadius:10,
					}
				]
			};
		}
	}

	addColorInDatalabels( dataSet, key? ) {

		dataSet?.['datasets'].map(val => {
			if ( !['suitableForSMEandVCSE', 'suitableForSMEandVCSEobjPreviousSixMonths' ].includes( key ) ) val.label = this.toTitleCasePipe.transform(val.label);
			val['backgroundColor'] = this.backgroundColor[ JSON.parse(JSON.stringify(val['label'])) ];
		});

		return dataSet;
	}
}
