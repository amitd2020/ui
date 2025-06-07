import { Component, ElementRef, OnInit } from '@angular/core';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { subscribedPlan } from 'src/environments/environment';
import { DataCommunicatorService } from '../../data-communicator.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-supplier',
	templateUrl: './supplier.component.html',
	styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {

	companyNumber: any;
	supplierData: any;
	barData: any;
	barOptions: any;
	value: any;
	lineData: any;
	lineOptions: any;
	overviewChartOptions: any;
	overviewChartData: any;
    noticeIndentifierSummaryData: any;
    tableViewModel: any;
	noticeIdentifierNo: any;
	totalRecord: any;
	dateTimelineView: any[];
	pageNumber: any;
	rows: any;

	currentPlan: unknown;

	subscribedPlanModal: any = subscribedPlan;
	
	supplierDataColumn: Array<any>;
	supplierDataValues: Array<any>;
	barLabels: Array<any> = undefined;
	barDataset: Array<any> = undefined;
	lineLabels: Array<any> = undefined;
	lineDataSet: Array<any> = undefined;
	cities: any[];

	viewNoticeIndentifierModal: boolean = false;
	changeTable: boolean = false;
	selectedGlobalCurrency: string = 'GBP';
	constructor(
		private userAuthService: UserAuthService,
		private dataCommunicatorService: DataCommunicatorService,
		public toNumberSuffix: NumberSuffixPipe,
		public commonService: CommonServiceService,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService
	) {}

	ngOnInit() {

		this.currentPlan = this.userAuthService?.getUserInfo('planId');
		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';
		this.dataCommunicatorService.$dataCommunicatorVar.subscribe((res: any) => {
			this.companyNumber = res.companyRegistrationNumber;
		});

		this.getSupplierDataForTab();

		this.supplierDataColumn = [
			{ field: 'title', header: 'Title', width: '250px', textAlign: 'left' },
			{ field: 'awarded_value', header: 'Award Value', width: '90px', textAlign: 'right' },
			{ field: 'awarded_date', header: 'Award Date', width: '100px', textAlign: 'center' },
			{ field: 'contract_start_date', header: 'Contract Start Date', width: '80px', textAlign: 'center' },
			{ field: 'contract_end_date', header: 'Contract Closing Date', width: '90px', textAlign: 'center' },
			{ field: 'cpv_codes', header: 'CPV', width: '100px', textAlign: 'left' },
			{ field: 'enterpriseCategory', header: 'Enterprise Category', width: '80px', textAlign: 'left' },
		];
	}

	getSupplierDataForTab() {

		this.sharedLoaderService.showLoader();	
		let obj = [ this.companyNumber ];

		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_GOVTENABLER_API', 'getSupplierDataForTab', obj ).subscribe( res => {

			if ( res.body['status'] == 200 && res.body['result'].length ) {

				this.supplierData = res.body['result'][0];
				this.supplierDataValues = this.supplierData['supplierData'];
				this.totalRecord = this.supplierData.supplierCount

				if ( [ this.subscribedPlanModal['Start'], this.subscribedPlanModal['Valentine_Special'], this.subscribedPlanModal['Expand_Weekly_Trial'], this.subscribedPlanModal['Monthly_Expand_Trial'], this.subscribedPlanModal['Annually_Expand_Trial'], this.subscribedPlanModal['Enterprise_Weekly_Trial'], this.subscribedPlanModal['Monthly_Enterprise_Trial'], this.subscribedPlanModal['Annually_Enterprise_Trial'], this.subscribedPlanModal['Trial_48_Hours'], this.subscribedPlanModal['Expand_Trial_48_Hours'], this.subscribedPlanModal['Premium_Trial_48_Hours'] ].includes( this.currentPlan ) && this.supplierDataValues && this.supplierDataValues.length > 24 ) {

					this.supplierDataValues.length = 25;

				}

				this.barLabels = this.formatDataForGraph( this.supplierData.contractsWonChartData, "year" );
				this.barDataset = this.formatDataForGraph(this.supplierData.contractsWonChartData, "count");

				this.lineLabels = this.formatDataForGraph( this.supplierData.contractsEndingChartData, "year" );
				this.lineDataSet = this.formatDataForGraph( this.supplierData.contractsEndingChartData, "count" );

				this.barOptions = {
					layout: {
						padding: { left: 10, right: 10 }
					},
					categoryPercentage: 0.3,
					barPercentage: 0.6,
					scales: {
						y: {
							ticks: {
								beginAtZero: true,
								font: {
									family: 'Roboto',
									style: 'normal',
								},
								color: '#bbb',
								padding: 10,
							},
							grid: {
								display: true,
								drawBorder: false,
								drawTicks: false,
								tickLength: 0,
								borderDash: function ( context ): any {
									if ( context.tick.value > 0 ) {
										return [5, 10]
									}
								},
								color: context => context.index == 0 ? 'rgba(0, 0, 0, 0.2)' : '#bbb'
							},
							display: true,
							title: {
								show: true,
							}
						},
						x: {
							ticks: {
								font: {
									size: 14,
									family: 'Roboto',
									style: 'normal',
								},
								color: '#bbb',
								padding: 3,
							},
							grid: {
								display: false,
								color: '#bbb'
							}
						}
					},
					plugins: {
						datalabels: {
							display: false,
						},
						legend: {
							display: false,
						},
						title: {
							fontFamily: 'Roboto',
							text: 'Contracts Won Trend',
							display: true
						},
						tooltip: {
							enabled: true,
							callbacks: {
								label: function (tooltipItem, label) {
									return ((tooltipItem.yLabel).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(".00", ""));
								}
							}
						},
					},
					hover: {
						onHover: (event, elements) => {
							event.target.style.cursor = elements[0] ? "pointer" : "default";
						}
					}
				}

				this.barData = {
					labels: this.barLabels,
					datasets: [
						{
							backgroundColor: ["rgba(33, 195, 181, .5)", "rgba(99, 172, 189, .5)", "rgba(68, 122, 189, .5)", "rgba(55, 122, 153, .5)", "rgba(255, 2, 100, .5)", "rgba(95, 72, 13, .5)", "rgba(5, 12, 153, .5)"],
							borderColor: ["rgba(33, 195, 181, 1)", "rgba(99, 172, 189, 1)", "rgba(68, 122, 189, 1)", "rgba(55, 122, 153, 1)", "rgba(255, 2, 100, 1)", "rgba(95, 72, 13, 1)", "rgba(5, 12, 153, 1)"],
							borderWidth: 1,
							data: this.barDataset
						}
					]
				};

				this.lineOptions = {
					layout: {
						padding: { left: 10, right: 10 }
					},
					categoryPercentage: 0.3,
					barPercentage: 0.6,
					tension: 0.4,
					scales: {
						y: {
							beginAtZero: true,
							ticks: {
								font: {
									family: 'Roboto',
									style: 'normal',
								},
								color: '#bbb',
								padding: 10
							},
							grid: {
								display: true,
								drawBorder: false,
								drawTicks: false,
								tickLength: 0,
								borderDash: function ( context ): any {
									if ( context.tick.value > 0 ) {
										return [5, 10]
									}
								},
								color: context => context.index == 0 ? 'rgba(0, 0, 0, 0.2)' : '#bbb'
							},
							display: true,
							scaleLabel: {
								show: true,
							}
						},
						x: {	
							ticks: {
								font: {
									size: 14,
									family: 'Roboto',
									style: 'normal',
								},
								color: '#bbb',
								padding: 3,
							},
							grid: {
								display: false,
								color: '#bbb'
							}
						}
					},
					plugins: {
						datalabels: {
							display: false,
						},
						legend: {
							display: false,
						},
						title: {
							fontFamily: 'Roboto',
							text: 'Contracts Ending Trend',
							display: true
						},
						tooltip: {
							enabled: true,
							callbacks: {
								label: function (tooltipItem, label) {
									return ((tooltipItem.yLabel).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(".00", ""));
								}
							}
						},
					},
					hover: {
						onHover: (event, elements) => {
							event.target.style.cursor = elements[0] ? "pointer" : "default";
						}
					}
				}

				this.lineData = {
					labels: this.lineLabels,
					datasets: [
						{
							data: this.lineDataSet,
							backgroundColor: "rgba(33, 195, 181, .5)",
							fill: 'origin',
							borderColor: '#1eb0a3',
							pointRadius: 4,
							pointBackgroundColor: '#21c3b5',
							borderWidth: 1,
							label: 'Contracts Ending Chart Data',
							pointStyle: 'circle'
						}
					]
				}

				this.overviewChartOptions = {
					legend: {
						display: false
					},
					responsive: true,
					scales: {
						y: {
							display: false
						},
						x: {
							display: false
						}
					},
					elements: {
						PointElement: {
							radius: 0
						}
					},
					plugins: {
						datalabels: {
							display: false,
						},
						tooltip: {
							enables: true,
							callbacks: {
								label: function (tooltipItem, label) {
									return ((tooltipItem.yLabel).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(".00", ""));
								}
							}
						},
					},
					hover: {
						onHover: (event, elements) => {
							event.target.style.cursor = elements[0] ? "pointer" : "default";
						}
					}
				};

				this.overviewChartData = {
					labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
					datasets: [
						{
							data: [50, 64, 32, 24, 18, 27, 20, 36, 30],
							borderColor: [
								'#009688', 
							],
							backgroundColor: [
								'#80CBC4',
							],
							borderWidth: 2,
							fill: true,
							pointRadius: 0,

						}
					]
				};

			}

			setTimeout(() => {
				this.sharedLoaderService.hideLoader();
			}, 1000);

		});

	}

	getNoticeIndentifierData( event ) {
		this.sharedLoaderService.showLoader();
		
		this.noticeIdentifierNo = ['?noticeIdentifier=' + event];

		let reqObj = [ this.noticeIdentifierNo ];
		this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_GOVTENABLER_API', 'getContractHistory', reqObj ).subscribe( res => {
			let data = res.body;
			if ( data['status'] == 200 ) {
				this.noticeIndentifierSummaryData = data['results'];
				
			}

			this.dateTimelineView = [
				{ status: 'Published Date', date: this.noticeIndentifierSummaryData?.published_date },
				{ status: 'Closing Date', date: this.noticeIndentifierSummaryData?.closing_date },
				{ status: 'Awarded Date', date: this.noticeIndentifierSummaryData?.awarded_date },
				{ status: 'Contract Start Date', date: this.noticeIndentifierSummaryData?.contract_start_date },
				{ status: 'Contract End Date', date: this.noticeIndentifierSummaryData?.contract_end_date }
			];
			
			this.viewNoticeIndentifierModal = true;
			this.sharedLoaderService.hideLoader();

		});
	}

	formatDataForGraph( dataArray, src ) {

		let tempArray = [];

		if ( !dataArray ) return tempArray;

		if ( src == "year" ) {

			for (let dataVal of dataArray) {
				tempArray.push(dataVal.year);
			}

		} else if ( src == "count" ) {

			for ( let dataVal of dataArray ) {
				tempArray.push(dataVal.count);
			}

		}

		return tempArray;

	}

	getUpdatesFromTable(event) {
		this.pageNumber= event.page + 1;
		this.rows= event.rows
		this.getSupplierDataForTab();
	}

	formatCompanyNameForUrl( companyName ) {
        return this.commonService.formatCompanyNameForUrl( companyName );
    }

	showText( descriptionTextElement: ElementRef ) {

		if ( descriptionTextElement['classList'].contains('limitTextHeight') ) {
			descriptionTextElement['classList'].remove('limitTextHeight');
			descriptionTextElement['nextElementSibling'].innerText = 'Read Less';
		} else {
			descriptionTextElement['classList'].add('limitTextHeight');
			descriptionTextElement['nextElementSibling'].innerText = 'Read More';

		}

	}

	changeTableView( event ) {
		
		if(event.srcElement.innerText == 'DATA VIEW') {
			
			this.changeTable = true;

		} else {
			this.changeTable = false;

		}

	}

}
