import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { subscribedPlan } from 'src/environments/environment';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { Router, ActivatedRoute} from '@angular/router';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';

@Component({
	selector: 'dg-suppliers-dashboard',
	templateUrl: './suppliers-dashboard.component.html',
	styleUrls: ['./suppliers-dashboard.component.scss', '../government-enabler.component.scss']
})
export class SuppliersDashboardComponent implements OnInit {

	finalDataToDisplay: any;
	buyerDataColumn: any;
	buyerDashboardDataValues: any;
	contractsWonChartOptions: any;
	contractsWonChartData: any;
	contractsEndingChartOptions: any;
	contractsEndingChartData: any;
	pageChange: any;

	rightSideFilterBar: boolean = false;
	booleanForApplyFilter: boolean = false;
	reInitTableDataValuesForReset: boolean = true;
	resetAppliedFiltersBoolean: boolean = false;
	// isFilterSidebarShow: boolean = false;
    subscribedPlanModal: any = subscribedPlan;

	title: string = '';
	description: string = '';


	searchTotalCount: number = 0;

	barLabels: Array<any> = undefined;
	barDataSet: Array<any> = undefined;
	lineLabels: Array<any> = undefined;
	lineDataSet: Array<any> = undefined;

	globalFilterDataObject: any = {
        filterData: [
            { chip_group: "Preferences", preferenceOperator: [ { isSupplier: "true" } ] }
        ],
		pageSize: 25,
		startAfter: 0,
		userId: this.userAuthService?.getUserInfo('dbID')
    };
	selectedGlobalCurrency: string = 'GBP';
	constructor(
		private userAuthService: UserAuthService,
		public toNumberSuffix: NumberSuffixPipe,
		private seoService: SeoService,
        private router: Router,
		private location: Location,
		private activateRoute: ActivatedRoute,
		private sharedLoaderService:SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService,
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

		this.initBreadcrumbAndSeoMetaTags();

		this.buyerDataColumn = [

			{ field: 'supplierName', header: 'Supplier Name', minWidth: '270px', maxWidth: 'none', textAlign: 'left' },
			{ field: 'companyRegistrationNumber', header: 'Supplier Company Number', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'totalAwardValue', header: 'Total Contract Value', minWidth: '170px', maxWidth: '170px', textAlign: 'right' },
			{ field: 'totalContractsWon', header: 'Total Contracts Won', minWidth: '160px', maxWidth: '160px', textAlign: 'right' },
			{ field: 'supplierAddress', header: 'Supplier Address', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'country', header: 'Country', minWidth: '120px', maxWidth: '120px', textAlign: 'left' },
			{ field: 'constituency', header: 'Constituency', minWidth: '180px', maxWidth: '180px', textAlign: 'left' },
			{ field: 'county', header: 'County', minWidth: '120px', maxWidth: '120px', textAlign: 'left' },
			{ field: 'ward', header: 'Ward', minWidth: '120px', maxWidth: '120px', textAlign: 'left' },
			{ field: 'cpv_codes', header: 'CPV', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
			{ field: 'region', header: 'Region', minWidth: '250px', maxWidth: '250px', textAlign: 'left' },
			{ field: 'postcode', header: 'Post Code', minWidth: '150px', maxWidth: '150px', textAlign: 'left' }

		];

		this.getSupplierDataForDashboard();

	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems([
		// 	{ label: "Supplier Dashboard" }
		// ]);

		this.title = "DataGardener Buyers Details - Automate your marketing workflows";
		this.description = "Get in-depth analytics of Supplier, Supplier's";
		this.seoService.setPageTitle(this.title);
		this.seoService.setMetaTitle(this.title);
		this.seoService.setDescription(this.description);

	}

	getSupplierDataForDashboard() {

		this.sharedLoaderService.showLoader();
		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_GOVTENABLER_API', 'getSupplierDataForDashboard', this.globalFilterDataObject ).subscribe(res => {
			
			this.finalDataToDisplay = res.body.result;
			this.searchTotalCount = res.body['total'];

			this.buyerDashboardDataValues = this.finalDataToDisplay['tableData'];
			this.buyerDashboardDataValues.filter( ( val, index ) => {
				if (  val.companyRegistrationNumber.match('gb') != null ) {
					val['nonUkCompanyBool'] = true;
				} else {
					val['nonUkCompanyBool'] = false;
				}
				val['setIndexForCheckbox'] = index
				return val;
			} )
			// this.buyerDashboardDataValues.filter( val => val['nonUkCompanyBool'] =  val.companyRegistrationNumber.match('gb') != null ? true : false )
			this.getChartData( this.finalDataToDisplay );

			this.sharedLoaderService.hideLoader();

			this.reInitTableDataValuesForReset = true;

			this.resetAppliedFiltersBoolean = false;
		});

	}

	suppliersDashboardCommunicator( event ) {
		this.reInitTableDataValuesForReset = false;
		this.globalFilterDataObject['filterData'] = event.appliedFilters;
		this.globalFilterDataObject['filterSearchArray'] = event.filterSearchArray ? event.filterSearchArray : '';
		this.getSupplierDataForDashboard();
	}

	getChartData( inputData ) {

		this.lineLabels = this.formatDataForGraph( inputData.contractsEndingChartData, "year" );
		this.lineDataSet = this.formatDataForGraph( inputData.contractsEndingChartData, "count");
		
		this.contractsEndingChartOptions = {
			categoryPercentage: 0.3,
			barPercentage: 0.6,
			layout: {
				padding: { left: 10, right: 10 }
			},
			scales: {
				y: {
					ticks: {
						font: {
							family: 'Roboto',
							style: 'normal',
						},
						beginAtZero: true,
						color: '#bbb',
						padding: 10,
						callback: (label) => {
							return label ?  this.toNumberSuffix.transform(label, 0) : 0;
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
						callback: (label, index, labels) => {
							return label;
						}
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
					display: false
				},
				tooltip: {
					enabled: true,
					callbacks: {
						label: function (tooltipItem, label) {
							return ((tooltipItem.yLabel).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(".00", ""));
						}
					}
				},
				title: {
					display: false
				},
			},
			hover: {
				onHover: (event, elements) => {
					event.target.style.cursor = elements[0] ? "pointer" : "default";
				}
			}
		}

		this.contractsEndingChartData = {
			labels: this.barLabels,
			datasets: [
				{
					data: this.barDataSet,
					backgroundColor: "rgb(5, 89, 91, .5)", 
					fill: 'origin',
					borderColor: 'rgb(5, 89, 91, 1)',
					borderWidth: 1,
					pointStyle: 'circle',
					label: 'Contracts Won Trend'
				},
			]
		}

		this.contractsWonChartOptions = {
			layout: {
				padding: { left: 10, right: 10 }
			},
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
							size: 14
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
					display: false
				},
				tooltip: {
					callbacks: {
						label: function ( tooltipItem ) {
							return tooltipItem.formattedValue;
						}
					}
				},
				title: {
					display: false
				}
			},
			onHover: (event, elements) => {
				event.native.target.style.cursor = elements[0] ? "pointer" : "default";
			}
		}

		this.contractsWonChartData = {
			labels: this.lineLabels,
			datasets: [{
				data: this.lineDataSet,
				backgroundColor: "rgb(0, 134, 214, .5)",
				fill: 'origin',
				borderColor: "rgb(0, 134, 214, 1)",
				borderWidth: 1,
				pointStyle: 'circle',
				tension: 0.4
			}]
		}

	}

	closeSideBarPanel(event) {
		if(event == true) {
			this.rightSideFilterBar = false;
		}
	}

	getAfterAppliedData(event) {
		
		if ( event ) {

			this.finalDataToDisplay = event.data.result;
			this.booleanForApplyFilter = event.booleanForApplyFilter
			this.searchTotalCount = event.data.total;
			this.buyerDashboardDataValues = this.finalDataToDisplay['tableData'];

			this.getChartData(this.finalDataToDisplay);

		}
		
		this.rightSideFilterBar = false;
		
	}

	resetFilterCriteria( event ) {

		if ( event = true ) {

			this.getSupplierDataForDashboard();

		}

	}

	formatDataForGraph( dataArray, src ) {

		let tempArray = [];

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

	requestUpdateTableData(event) {

		if ( this.booleanForApplyFilter == false ) {
			this.globalFilterDataObject['pageSize'] = event.pageSize ? event.pageSize : 25;
			this.globalFilterDataObject['startAfter'] = event.startAfter ? event.startAfter : 0;
			this.globalFilterDataObject['filterSearchArray'] = event.filterSearchArray ? event.filterSearchArray : '';
			this.globalFilterDataObject['sortOn'] = event.sortOn ? event.sortOn : '';
			 
			this.getSupplierDataForDashboard();
		} else {
			this.pageChange = event;
		}
	}

	resetGovtEnablerFilters() {

		this.resetAppliedFiltersBoolean = true;
		this.globalFilterDataObject = {
			filterData: [
				{ chip_group: "Preferences", preferenceOperator: [ { isSupplier: "true" } ] }
			],
			pageSize: 25,
			startAfter: 0,
			userId: this.userAuthService?.getUserInfo('dbID')
		};
		this.getSupplierDataForDashboard();
		
	}

}
