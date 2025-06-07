import { Component, ElementRef, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { take } from 'rxjs';

import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { subscribedPlan } from 'src/environments/environment';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-buyers-dashboard',
	templateUrl: './buyers-dashboard.component.html',
	styleUrls: ['./buyers-dashboard.component.scss', '../government-enabler.component.scss']
})
export class BuyersDashboardComponent implements OnInit {

	lineData: any;
	lineOptions: any;
	countChartOptions: any;
	tableDataColumns: any;
	selectedRegionList: any;
	finalDataToDisplay: any;
	totalAwardChartData: any;
	tableListDataValues: any;
	totalAwardValueChartData: any;
	overallDoughnutOptions: any;
	contractsWonChartOptions: any;
	contractsWonChartData: any;
	govtEnablebChartOptions: any;
	totalContractValueChartData: any;
	totalContractsValueChartOptions: any;
	govtEnablerDashboardChartData: any;
	noticeIndentifierSummaryData: any;
	totalUnknownValue: any;
	pageChange: any;

    subscribedPlanModal: any = subscribedPlan;
	
	barLabels: Array<any> = undefined;
	barDataSet: Array<any> = undefined;
	lineLabels: Array<any> = undefined;
	totalContractDataValue: Array<any> = undefined;
	totalContractAmount: Array<any> = undefined;
	totalContractAmountData: Array<any> = undefined;
	regionListDropdownOptions: any[];
	
	searchTotalCount: number = 0;
	
	// isFilterSidebarShow: boolean = false;
	rightSideFilterBar: boolean = false;
	viewNoticeIndentifierModal: boolean = false;
	booleanForApplyFilter: boolean = false;
	reInitTableDataValuesForReset: boolean = true;
	resetAppliedFiltersBoolean: boolean = false;
	
	globalFilterDataObject: any = {
		filterData: [
			{ chip_group: "Preferences", preferenceOperator: [{ isBuyer: "true" }] }
		],
		pageSize: 25,
		startAfter: 0,
		userId: this.userAuthService?.getUserInfo('dbID') 
	};
	overallDoughnutData: { labels: string[]; datasets: { data: any[]; backgroundColor: string[]; }[]; };

	title: string = '';
	description: string = '';
	selectedGlobalCurrency: string = 'GBP';
	constructor(
		public userAuthService: UserAuthService,
		public toNumberSuffix: NumberSuffixPipe,
		private seoService: SeoService,
        private router: Router,
		private activateRoute: ActivatedRoute,
		private location: Location,
		public commonService: CommonServiceService,
		private sharedLoaderService: SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService

	) {
		if ( !this.userAuthService.hasAddOnPermission('governmentEnabler') ) {
            this.router.navigate(['/']);
        }
	}

	ngOnInit() {

		/*
		if ( this.userRoleAndFeatureAuthService.checkUserHasFeatureAccess( 'Global Filter' ) || this.userRoleAndFeatureAuthService.isAdmin() )  {
            this.isFilterSidebarShow = true;
        }
		*/
		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';

		this.initBreadcrumbAndSeoMetaTags()

		this.tableDataColumns = [
			{ field: 'buyer_name', header: 'Buyer Name', minWidth: '280px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'companyRegistrationNumber', header: 'Buyer Company Number', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
			{ field: 'cpvCodes', header: 'CPV', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
			{ field: 'total_contracts_published_value', header: 'Total Award Value', minWidth: '150px', maxWidth: '150px', textAlign: 'right' },
			{ field: 'suppliers_count', header: 'Supplier Count', minWidth: '100px', maxWidth: '100px', textAlign: 'right' },
			{ field: 'total_contract_presented', header: 'Total Contracts Published', minWidth: '150px', maxWidth: '150px', textAlign: 'right' },
			{ field: 'postcode', header: 'Post Code', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
			{ field: 'ward', header: 'Ward', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
			{ field: 'constituency', header: 'Constituency', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
			{ field: 'country', header: 'Country', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
			{ field: 'regions', header: 'Contract Published Region', minWidth: '150px', maxWidth: '150px', textAlign: 'left' },
			{ field: 'awardStatus', header: 'Award Status', minWidth: '150px', maxWidth: '150px', textAlign: 'left' }

		];

		this.getBuyerDataForDashboard();

	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems([
		// 	{ label: "Buyer Dashboard" }
		// ]);

		this.title = "DataGardener Buyer Details Dashboard - Automate your marketing workflows";
		this.description = "Get in-depth analytics of Buyer";
		this.seoService.setPageTitle(this.title);
		this.seoService.setMetaTitle(this.title);
		this.seoService.setDescription(this.description);

	}

	getBuyerDataForDashboard() {

		this.sharedLoaderService.showLoader();
		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_GOVTENABLER_API', 'getBuyerDataForDashboard', this.globalFilterDataObject ).subscribe(res => {
			
			this.finalDataToDisplay = res.body;
			this.tableListDataValues = res.body['result'];
			this.tableListDataValues.filter( ( val, index ) => {
				if (  val.companyRegistrationNumber.match('gb') != null ) {
					val['nonUkCompanyBool'] = true;
				} else {
					val['nonUkCompanyBool'] = false;
				}
				val['setIndexForCheckbox'] = index
				return val;
			} )
			this.searchTotalCount = res.body['totalBuyersCount'];
	
			this.getChartData( this.finalDataToDisplay );

			this.sharedLoaderService.hideLoader();

			this.reInitTableDataValuesForReset = true;

			this.resetAppliedFiltersBoolean = false;
			
		});

	}
	
	buyersDashboardCommunicator( event ) {
		this.reInitTableDataValuesForReset = false;
		this.globalFilterDataObject['filterData'] = event.appliedFilters;
		this.globalFilterDataObject['filterSearchArray'] = event?.filterSearchArray ? event?.filterSearchArray : '';
		this.getBuyerDataForDashboard();
	}

	formattedCamelCaseToSentence(str) {
		return this.commonService.formattedCamelCaseToSentence(str);
	}

	getChartData( inputData ) {
		
		this.lineLabels = this.formatDataForGraph( inputData['chartData'].closingDate, "year" );
		// Line chart starts
		this.govtEnablebChartOptions = {
			maintainAspectRatio: false,
			responsive: true,
			tension: 0.4,
			layout: {
				padding: { left: 10, right: 10 }
			},
			categoryPercentage: 0.3,
			barPercentage: 0.6,
			scales: {
				y: {
					beginAtZero: true,
					ticks: {
						font: {
							family: 'Roboto',
							style: 'normal',
						},
						color: '#bbb',
						padding: 10,
						callback: (label) => {
							return label ? this.toNumberSuffix.transform(label, 0) : 0;
						}
					},
					grid: {
						display: true,
						drawBorder: false,
						drawTicks: false,
						tickLength: 0,
						color: context => context.index == 0 ? '#fff' : '#ddd',
						borderDash: function ( context ): any {
							if ( context.tick.value > 0 ) {
								return [5, 10]
							}
						}
					},
					display: true,
					scaleLabel: {
						show: true,
					}
				},

				x: {
					ticks: {
						font: {
							family: 'Roboto',
							style: 'normal',
						},
						color: '#bbb',
						padding: 3
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
					display: true,
					labels: {
						usePointStyle: true
					}
				},
				tooltip: {
					callbacks: {
						label: function ( tooltipItem ) {
							return tooltipItem.formattedValue;
						}
					}
				},
			},
			onHover: (event, elements) => {
				event.native.target.style.cursor = elements[0] ? "pointer" : "default";
			}
		}

		this.govtEnablerDashboardChartData = {
			labels: this.lineLabels,
			datasets: [
				{
					data: this.formatDataForGraph( inputData['chartData'].closingDate, "awardCount"),
					backgroundColor: "rgba(77, 208, 225, 0.4)", 
					fill: true,
					borderColor: '#4DD0E1',
					borderWidth: 0.1,
					pointStyle: 'circle',
					label: 'Closing Date'
				},
				{
					data: this.formatDataForGraph( inputData['chartData'].publishedDate, "awardCount"),
					backgroundColor: "rgba(63, 81, 181, 0.6)", 
					fill: true,
					borderColor: '#3F51B5',
					borderWidth: 0.1,
					pointStyle: 'circle',
					label: 'Published Date'
				},
				{
					data: this.formatDataForGraph( inputData['chartData'].startDate, "awardCount"),
					backgroundColor: "rgb(0, 150, 136, 0.8)", 
					fill: 'origin',
					borderColor: '#32ab9f',
					borderWidth: 0.1,
					pointStyle: 'circle',
					label: 'Start Date'
				},
				{
					data: this.formatDataForGraph( inputData['chartData'].endDate, "awardCount"),
					backgroundColor: "rgb(21, 101, 192, 0.9)", 
					fill: 'origin',
					borderColor: 'rgb(8, 152, 204)',
					borderWidth: 0.1,
					pointStyle: 'circle',
					label: 'End Date'
				},
			]
		}
		
		// Line chart ends

		// Doughnut chart starts
		this.overallDoughnutOptions = {
			cutoutPercentage: 40,
			elements: {
				arc: {
					borderWidth: 4
				}
			},
			plugins: {
				datalabels: {
					display: false,
				},
				legend: {
					display: false,
					labels: {
						usePointStyle: true
					}
				},
				tooltip: {
					enabled: true
				}
			},
			animation: {
				duration: 2000,
				easing: 'easeInOutQuad'
			}
		};
		
		this.overallDoughnutData = {
			labels: ['Not Specified', 'Products', 'Services', 'Works'],
			datasets: [
				{
					data: [ inputData['counts']['totalContractTypeUnknown'], inputData['counts']['totalContractTypeProducts'], inputData['counts']['totalContractTypeServices'], inputData['counts']['totalContractTypeWorks'] ],
					backgroundColor: [
						'#7c7c7c', '#3a9b10', '#29b6f6', '#26a69a', 
					]
				}
			]
		}
		// Doughnut chart ends

		// Total Contract Graph starts
		this.countChartOptions = {
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
				pointElement: {
					radius: 0
				}
			},
			plugins: {
				datalabels: {
					display: false,
				},
				tooltips: {
					enabled: false
				},
				legend: {
					display: false
				},
			}
		};
		this.totalContractAmount = this.formatDataForGraph( inputData['totalContractAmountYearly'], "year" );
		this.totalContractAmountData = this.formatDataForGraph( inputData['totalContractAmountYearly'], "value" );

		this.totalAwardValueChartData = {
			labels: this.totalContractAmount,
			datasets: [
				{
					data: this.totalContractAmountData,
					borderColor: [
						'#1f4286',
					],
					backgroundColor: [
						'#627baa',
					],
					borderWidth: 2,
					fill: true
				}
			]
		};
		// Total Contract Graph ends

		//Total Contracts Graph starts
		this.totalAwardChartData = {
			labels: ['Closed Contract', 'Open Contract', 'Total Awarded Contract'],
			datasets: [
				{
					data: [inputData['counts']['totalClosedContractCount'], inputData['counts']['totalOpenContractCount'], inputData['counts']['totalAwardedContractCount']],
					borderColor: [
						'#009688',
					],
					backgroundColor: [
						'#80CBC4',
					],
					borderWidth: 2,
					fill: true
				}
			]
		};
		//Total Contracts Graph starts
		

		//Total Contract Value Bar Graph Starts

		this.totalContractsValueChartOptions = {
			layout: {
				padding: { left: 10, right: 10 }
			},
			categoryPercentage: 0.3,
			barPercentage: 0.6,
			scales: {
				y: {
					beginAtZero: true,
					ticks: {
						font: {
							family: 'Roboto',
							style: 'normal',
						},
						color: '#bbb',
						padding: 10,
						callback: (label) => {
							return label ? this.toNumberSuffix.transform(label, 0) : 0;
						}
					},
					grid: {
						display: true,
						drawBorder: false,
						drawTicks: false,
						tickLength: 0,
						color: context => context.index == 0 ? '#fff' : '#ddd',
						borderDash: function ( context ): any {
							if ( context.tick.value > 0 ) {
								return [5, 10]
							}
						}
						
					},
					display: true,
					title: {
						show: false,
					}
				},
				x: {
					ticks: {
						font: {
							family: 'Roboto',
							style: 'normal',
						},
						color: '#bbb',
						padding: 3
					},
					grid: {
						display: false,
						color: '#bbb'
					}
				}
			},
			plugins: {
				legend: {
					display: false
				},
			
				tooltip: {
					enabled:true,
					callbacks: {
						label: function ( tooltipItem ) {
							return tooltipItem.formattedValue;
						}
					}
				}
			},
			hover: {
				onHover: (event, elements) => {
					event.native.target.style.cursor = elements[0] ? "pointer" : "default";
				}
			}
		}

		this.totalContractValueChartData = {
			labels: this.totalContractAmount,
			datasets: [
				{
					data: this.totalContractAmountData,
					backgroundColor: "rgb(46, 116, 198, 1)", 
					fill: 'origin',
					borderColor: 'rgb(5, 89, 91, 1)',
					borderWidth: 1,
					pointStyle: 'circle',
					label: 'Contracts Won Trend'
				},
			]
		}

		//Total Contract Value Bar Graph Ends

	}

	closeSideBarPanel(event) {
		if(event == true) {
			this.rightSideFilterBar = false;
		}
	}

	getAfterAppliedData(event) {
		
		this.finalDataToDisplay = event.data
		this.tableListDataValues = this.finalDataToDisplay.result;
		this.booleanForApplyFilter = event.booleanForApplyFilter;
		this.searchTotalCount = this.finalDataToDisplay['totalBuyersCount'];
		this.getChartData(this.finalDataToDisplay);
		this.rightSideFilterBar = false;
		
	}

	resetFilterCriteria( event ) {

		if ( event = true ) {

			this.getBuyerDataForDashboard();

		}

	}

	requestUpdateTableData(event) {

		if ( this.booleanForApplyFilter == false ) {
			this.globalFilterDataObject['pageSize'] = event.pageSize ? event.pageSize : 25;
			this.globalFilterDataObject['startAfter'] = event.startAfter ? event.startAfter : 0;
			this.globalFilterDataObject['filterSearchArray'] = event.filterSearchArray ? event.filterSearchArray : '';
			this.globalFilterDataObject['sortOn'] = event.sortOn ? event.sortOn : '';
			 
			this.getBuyerDataForDashboard();
		} else {
			this.pageChange = event;
		}


	}

	formatDataForGraph( dataArray, src ) {
		
		let tempArray = [];
		
		if ( src == "year" ) {

			for (let dataVal of dataArray) {
				tempArray.push(dataVal.year);
			}

		} else if ( src == "awardCount" ) {

			for ( let dataVal of dataArray ) {
				tempArray.push(dataVal.awardCount);
			}

		} else if ( src == 'value') {
			for ( let dataVal of dataArray ) {
				tempArray.push(dataVal.value);
			}
		}

		return tempArray;

	}

	getNoticeIndentifierData( event ) {

		let noticeIdentifier = ['?noticeIdentifier=', event ];
		let obj = [ noticeIdentifier ];
		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_GOVTENABLER_API', 'getContractHistory', obj).subscribe(res => {
		// this.companyService.getNoticeIndentifierData( noticeIdentifier ).then(data => {
			if ( res.body['status'] == 200 ) {
				this.noticeIndentifierSummaryData = res.body['results'][0];
			}

			this.viewNoticeIndentifierModal = true;

		});

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

	resetGovtEnablerFilters() {
		
		this.resetAppliedFiltersBoolean = true;
		this.globalFilterDataObject = {
			filterData: [
				{ chip_group: "Preferences", preferenceOperator: [{ isBuyer: "true" }] }
			],
			pageSize: 25,
			startAfter: 0,
			userId: this.userAuthService?.getUserInfo('dbID')
		};
		this.getBuyerDataForDashboard();
		
	}

}
