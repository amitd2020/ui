import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { Table } from 'primeng/table';
import { subscribedPlan } from 'src/environments/environment';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { CurrencyPipe } from '@angular/common';
import { ListServiceService } from 'src/app/interface/service/list-service.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { ActivatedRoute, Router } from '@angular/router';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { SearchCompanyService } from '../../../search-company/search-company.service';


@Component({
	selector: 'dg-esg-sme-index',
	templateUrl: './esg-sme-index.component.html',
	styleUrls: ['./esg-sme-index.component.scss']    
})

export class EsgSmeIndexComponent implements OnInit {

	@ViewChild('LazyLeafletMapContainer', { read: ViewContainerRef }) LazyLeafletMapContainer: ViewContainerRef;
	@ViewChild('pieChartStatsContainer', { static: false }) pieChartStatsContainer: UIChart;
	@ViewChild('lineChartStatsContainer', { static: false }) lineChartStatsContainer: UIChart;
	@ViewChild('esgTableData', { static: false }) public esgTableData: Table;

	ChartDataLabelsPlugin = [ChartDataLabels];

	title: any;
	description: any;

	IndexBands = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 };

	resetAppliedFiltersBoolean: boolean = false;
	changeDataLabels: boolean = false;

	esgIndexData: any;
	esgIndexMapData: any;
	esgIndexTableData: any;
	esgIndexBandOptions: any;
	esgIndexBandLineData: any;
	pieChartOptions: any;
	pieBandChartData: any;
	payloadForChildApi

	// isFilterSidebarShow: boolean = false;
	subscribedPlanModal: any = subscribedPlan;

	esgtable = [1,2,3,4,5]

	lineLabels: Array<any> = undefined;
	esgIndexListColumns: Array<object> = [];
	tableDataArray: Array<object> = [];
	tableDataObj: object = {
		industryName: '',
		// 2022: this.IndexBands,
		// 2021: this.IndexBands,
		// 2020: this.IndexBands,
		// 2019: this.IndexBands,
		// 2018: this.IndexBands,
		// 2017: this.IndexBands
	};

	selectedYearForCurrentMap = { bandyear: '2022' };
	selectedBand = { value: 'D', band: 'd' };
	selectedYearForPreviousMap = { bandyear: '2021' };

	esgYearMap = [];
	esgYearBand = [];

	esgFilterDataObject: any = {
		filterData: [
			{ chip_group: "Status", chip_values: ["live"] },
			{ chip_group: "Preferences", chip_values: ["Company must have esg details"], preferenceOperator: [{ hasEsgIndexScore: "true" }] }
		]
	};


	constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		public toNumberSuffix: NumberSuffixPipe,
		public toCurrencyPipe: CurrencyPipe,
		private listService: ListServiceService,
		private seoService: SeoService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private sharedLoaderService: SharedLoaderService,
		public searchCompanyService: SearchCompanyService
	) { }

	ngOnInit() {

		/*
		if ( this.userRoleAndFeatureAuthService.checkUserHasFeatureAccess( 'Global Filter' ) || this.userRoleAndFeatureAuthService.isAdmin() )  {
            this.isFilterSidebarShow = true;
        }
		*/

		for ( let bandKey in this.IndexBands ) {
			this.esgYearBand.push( { value: bandKey.toUpperCase(), band: bandKey } );
		}

		this.searchCompanyService.resetPayload();
        this.searchCompanyService.resetFilterData();
		this.searchCompanyService.updatePayload( { filterData: [] } );

		this.searchCompanyService.$apiPayloadBody.subscribe( res => {
            this.payloadForChildApi = res;
        });

		this.initBreadcrumbAndSeoMetaTags();

		this.getEsgIndexData();

		// this.esgIndexListColumns = [
		// 	{ field: 'a',  header: 'industryName', width: '55px', textAlign: 'right', color: '#6aa84f' },
		// 	{ field: 'b', header: '2021', width: '55px', textAlign: 'right', color: '#ff0000' },
		// 	{ field: 'c', header: '2020', width: '55px', textAlign: 'right', color: '#e6b8af' },
		// 	{ field: 'd', header: '2019', width: '55px', textAlign: 'right', color: '#cc4125' },
		// 	{ field: 'e', header: '2018', width: '55px', textAlign: 'right', color: '#ffd966' },
		// 	{ field: 'f', header: '2017', width: '55px', textAlign: 'right', color: '#b6d7a8' }
		// ];

	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems([
		// 	{ label: 'ESG Index', routerLink: ['/esg/esg-sme-index'] }
		// ]);

		this.title = "ESG Index - DataGardener";
		this.description = "Get in-depth analytics of company CCJ, Charges, complaint registered against companies, dissolved and liquidation date.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setMetaTitle(this.title);
		this.seoService.setDescription(this.description);
	
	}

	getEsgIndexData() {

		this.sharedLoaderService.showLoader();

		if ( this.activatedRoute.snapshot.queryParams['chipData'] ) {

			this.esgFilterDataObject.filterData = JSON.parse(this.activatedRoute.snapshot.queryParams['chipData']);

		}
		
		this.listService.getEsgIndex(this.esgFilterDataObject).then( res => {

			this.esgIndexData = res;
			this.esgIndexMapData = JSON.parse(JSON.stringify(this.esgIndexData.mapData));
			this.esgIndexTableData =  JSON.parse( JSON.stringify( this.esgIndexData.industriesTableData ) );


			this.esgIndexListColumns = [
				{ field: 'industryName', header: 'Industry Name', width: '180px', textAlign: 'left' }
			];
	
			for ( let key in this.esgIndexTableData[0] ) {
				
				for ( let bandYear in this.esgIndexTableData[0][ key ] ) {
					this.tableDataObj[ bandYear ] = { ...this.IndexBands };
		
					this.esgIndexListColumns.push(
						{ field: new Map( Object.entries( this.IndexBands ) ), header: bandYear, width: '55px', textAlign: 'right' }
					);
					
				}

			}

			this.esgIndexListColumns.sort( ( a: any, b: any ) => b.header.localeCompare( a.header ) );

			this.formatDataForTable( this.esgIndexTableData );

			this.getMapFilterData();
			
			this.initLineChartContainer( this.esgIndexData['lineChartDataYear'] );

			this.resetAppliedFiltersBoolean = false;
			this.esgYearMap =  [];

			// this.esgYearMap = this.esgIndexMapData[0]['northern ireland'];
			
			for ( let label in this.esgIndexMapData[0]['northern ireland'] ) {
				this.esgYearMap.push({ bandyear: label });
			}


			if ( this.activatedRoute.snapshot.queryParams['chipData'] ) {
				this.router.navigate( [], { queryParams: {} } );
			}

			setTimeout(() => {
				this.sharedLoaderService.hideLoader();
			}, 100);

		});

	}

	getMapFilterData( ){
		let currentBandYear = this.selectedYearForCurrentMap.bandyear, currentBandKey = this.selectedBand.band;
		let previousBandYear = this.selectedYearForPreviousMap.bandyear;

		let selectedRegionYearBand = {
			currentBandYear: currentBandYear,
			previousBandYear: previousBandYear,
			currentBandKey: currentBandKey
		}

		let filteredCurrentYrData = {}, filteredPrevYrData = {}

		this.esgIndexMapData.map( mapObject => {
			for ( let keyBand in mapObject ) {
				for ( let data of mapObject[keyBand][currentBandYear] ) {
					if ( data.key == currentBandKey ) {
						filteredCurrentYrData[keyBand.split(' ').join('_')] = data['doc_count'];
					}
				}
				for ( let data of mapObject[keyBand][previousBandYear] ) {
					if ( data.key == currentBandKey ) {
						filteredPrevYrData[keyBand.split(' ').join('_')] = data['doc_count'];
					}
				}
			}
		} )

		this.initLeafletMapContainer( filteredPrevYrData, filteredCurrentYrData, selectedRegionYearBand );

	}

	async initLeafletMapContainer( previousYearData, currentYearData, selectedRegionYearBand ) {
		
		const { LazyLeafletMapComponent } = await import('../../../../shared-components/lazy-leaflet-map/lazy-leaflet-map.component');
		const componentFactory = this.componentFactoryResolver.resolveComponentFactory( LazyLeafletMapComponent );
		this.LazyLeafletMapContainer.clear();
		const { instance } = this.LazyLeafletMapContainer.createComponent(componentFactory);

		instance.mapData = { previousYearData: previousYearData, currentYearData: currentYearData, selectedRegionYearBand: selectedRegionYearBand };
		instance.requiredData = {
			thisPage: 'esgIndex',
			selectedRegionList: '',
			globalFilterDataObject: this.esgFilterDataObject
		}

	}

	initLineChartContainer( lineChartData ) {

		this.lineLabels = this.formatDataForLineGraph( lineChartData, 'year' );

		this.esgIndexBandOptions = {
			layout: {
				padding: { top: 18, left: 10, right: 10 }
			},
			categoryPercentage: 0.8,
			barPercentage: 0.7,
			scales: {
				y: {
					display: true,
					ticks: {
						beginAtZero: true,
						font: {
							family: 'Roboto',
							style: 'normal',
						},
						fontColor: '#bbb',
						padding: 10,
						precision: 0,
						callback: (label) => {
							return label ? this.toNumberSuffix.transform(label, 0) : 0;
						}
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
					title: {
						show: true,
					}
				},
				x: {
					ticks: {
						font: {
							size: 12,
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
				legend: {
					display: true,
					labels: {
						usePointStyle: true
					}
				},
				title: {
					display: false
				},
				tooltips: {
					callbacks: {
						label: function (tooltipItem, label) {
							return (label.datasets[ tooltipItem.datasetIndex ].label + ': ' +(tooltipItem.yLabel).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(".00", ""));
						}
					}
				},
			},
			hover: {
				onHover: (event, elements) => {
					event.target.style.cursor = elements[0] ? "pointer" : "default";
				}
			},
			animation: {
				duration: 4000,
				easing: 'easeInOutQuad'
			},
			onClick: (event) => {
				onLineChartClick(event)
			},
		}

		if ( this.changeDataLabels ) {

			this.esgIndexBandOptions.plugins.datalabels = {
				display: true,
				align: 'end',
				anchor: 'end',
				offset: 5,
				color: '#fff',
				font: { size: 10 },
				borderRadius: 3,
				padding: { top: 2, right: 5, bottom: 1, left: 5 },
				backgroundColor: '#6aa84f',
				formatter: ( value, context ) => {
					value = this.toNumberSuffix.transform( +value, 2 );
					return value;
				}
			}

		} else {
			this.esgIndexBandOptions.plugins.datalabels = { display: false }
		}

		this.esgIndexBandLineData = {
			labels: this.lineLabels,
			datasets: [
				{
					data: this.formatDataForLineGraph( lineChartData, "count", 'a' ), 
					backgroundColor: '#6aa84f',
					borderColor: '#4a7637',
					borderWidth: 1,
					label: 'A',
					datalabels: {
						backgroundColor: ( context ) => {
						  return context.dataset.backgroundColor;
						}
					}
				},
				{
					data: this.formatDataForLineGraph( lineChartData, "count", 'b' ), 
					backgroundColor: '#b6d7a8',
					borderColor: '#7f9776',
					borderWidth: 1,
					label: 'B',
					datalabels: {
						backgroundColor: ( context ) => {
						  return context.dataset.backgroundColor;
						}
					}
				},
				{
					data: this.formatDataForLineGraph( lineChartData, "count", 'c' ), 
					backgroundColor: '#ffd966',
					borderColor: '#b39847',
					borderWidth: 1,
					label: 'C',
					datalabels: {
						backgroundColor: ( context ) => {
						  return context.dataset.backgroundColor;
						}
					}
				},
				{
					data: this.formatDataForLineGraph( lineChartData, "count", 'd' ), 
					backgroundColor: '#cc4125',
					borderColor: '#8f2e1a',
					borderWidth: 1,
					label: 'D',
					datalabels: {
						backgroundColor: ( context ) => {
						  return context.dataset.backgroundColor;
						}
					}
				},
				{
					data: this.formatDataForLineGraph( lineChartData, "count", 'e' ), 
					backgroundColor: '#e6b8af',
					borderColor: '#a1817a',
					borderWidth: 1,
					label: 'E',
					datalabels: {
						backgroundColor: ( context ) => {
						  return context.dataset.backgroundColor;
						}
					}
				},
				{
					data: this.formatDataForLineGraph( lineChartData, "count", 'f' ), 
					backgroundColor: '#ff0000',
					borderColor: '#b30000',
					borderWidth: 1,
					label: 'F',
					datalabels: {
						backgroundColor: ( context ) => {
						  return context.dataset.backgroundColor;
						}
					}
				},
			]
		}

		let _this = this;
		function onLineChartClick( event ) {

			if ( _this.lineChartStatsContainer.chart.getElementAtEvent( event ).length > 0 ) {

				let lineChartEvent = _this.lineChartStatsContainer.chart.getElementAtEvent( event )[0];
	
				let	targetLabel = lineChartEvent._chart.data.labels[ lineChartEvent._index ];
				let selectedBands = lineChartEvent._chart.data.datasets[ lineChartEvent._datasetIndex ].label;
	
				let navigateUrlParamObject = JSON.parse( JSON.stringify( _this.esgFilterDataObject.filterData ) );
	
				navigateUrlParamObject.push(
					{ chip_group: "esgIndexYearScore", chip_values: [ targetLabel, selectedBands.toLowerCase() ] }
				);
	
				let urlStr: string;
	
				urlStr = String(_this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(navigateUrlParamObject) }}));
	
				window.open( urlStr, '_blank' );
			}

		}

	}

	formatDataForLineGraph( inputData, src, labels? ) {

		let finalResult = [];

		for ( let key in inputData ) {

			if ( src == 'year' ) {

				finalResult.push( key );

			} else if ( src == 'count' ) {

				for ( let lineChart of inputData[ key ] ) {

					if ( lineChart.key == labels ) {
						finalResult.push( lineChart.doc_count );
					}

				}

			}

		}

		return finalResult;

	}

	formatDataForTable( tableData ) {

		this.tableDataArray = [];

		for ( let tblDtRow of tableData ) {

			for ( let industryName in tblDtRow ) {

				this.tableDataObj['industryName'] = industryName;

				for( let bandYear in tblDtRow[ industryName ] ) {

					tblDtRow[ industryName ][ bandYear ].map( ( val: { key: string, doc_count: number } ) => {
						this.tableDataObj[ bandYear ][ val.key ] = val.doc_count;
					});

				}

			}
			
			let finalObject = JSON.parse( JSON.stringify( this.tableDataObj ) );
			this.tableDataArray.push( finalObject );

		}

	}

	esgIndexDashboard( event ) {

		if ( !this.activatedRoute.snapshot.queryParams['chipData'] ) {
			this.esgFilterDataObject.filterData = [];
	
			this.esgFilterDataObject = {
				filterData: [
					{ chip_group: "Status", chip_values: ["live"] },
					{ chip_group: "Preferences", chip_values: ["Company must have esg details"], preferenceOperator: [{ hasEsgIndexScore: "true" } ] }
				]
			};
			
			if(event.appliedFilters != undefined){
				this.esgFilterDataObject.filterData.push(...event.appliedFilters)
			}
	
			//To Remove Duplicate chip group
			if (this.esgFilterDataObject.filterData && this.esgFilterDataObject.filterData.length) {
				const ids = this.esgFilterDataObject.filterData.map(o => o.chip_group);
				this.esgFilterDataObject.filterData = this.esgFilterDataObject.filterData.filter(({ chip_group }, index) => !ids.includes(chip_group, index + 1));
			}
			
			this.getEsgIndexData();
		}
	}

	goToESearchForEsg( tableYearHear, tableBandHeader, tableIndustryData ) {

		tableIndustryData = tableIndustryData.split(' - ')[1];

		let navigateUrlParamObject = JSON.parse( JSON.stringify( this.esgFilterDataObject.filterData ) );
			
		navigateUrlParamObject = navigateUrlParamObject.filter( val => !['SIC Codes'].includes(val.chip_group));

		let sicCodeObj = {
			chip_group: "SIC Industry",
			chip_values: [tableIndustryData]
		}

		navigateUrlParamObject.push(
			{ chip_group: "esgIndexYearScore", chip_values: [ tableYearHear, tableBandHeader.toLowerCase() ] },
			sicCodeObj
		);

		let urlStr: string;

		urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(navigateUrlParamObject) }}));

		window.open( urlStr, '_blank' );
	}

	resetAppliedFilters() {
		this.resetAppliedFiltersBoolean = true;
		this.esgFilterDataObject.filterData = [];

		this.selectedYearForCurrentMap = {bandyear: '2021' };
		this.selectedBand = { value: 'D', band: 'd' };
		this.selectedYearForPreviousMap = {bandyear: '2020' };

		this.esgFilterDataObject = {
			filterData: [
				{ chip_group: "Status", chip_values: ["live"] },
				{ chip_group: "Preferences", chip_values: ["Company must have esg details"], preferenceOperator: [{ hasEsgIndexScore: "true" } ] }
			]
		};

		this.getEsgIndexData();

	}

	customSort( event, esgTableData, selectedBand, selectedYear) {

		let value1, value2, result;
		let tableDomElement = this.esgTableData.el.nativeElement.children[0],
			sortIcons = tableDomElement.querySelectorAll('.p-datatable-wrapper .p-sortable-column-icon'),
			sortOrder: string = 'asc',
			tempObj: any,
			tableVal: any;

		if (event.target.classList.value == 'p-sortable-column-icon pi pi-fw pi-sort-alt' || event.target.classList.value == 'p-sortable-column-icon pi pi-fw pi-sort-amount-down') {

			for (let icon of sortIcons) {
				icon.classList.value = 'p-sortable-column-icon pi pi-fw pi-sort-alt';
			}

			event.target.classList.value = 'p-sortable-column-icon pi pi-fw pi-sort-amount-up-alt';
			sortOrder = 'asc';
			tempObj = 1;

		} else if (event.target.classList.value == 'p-sortable-column-icon pi pi-fw pi-sort-amount-up-alt') {

			for (let icon of sortIcons) {
				icon.classList.value = 'p-sortable-column-icon pi pi-fw pi-sort-alt';
			}

			event.target.classList.value = 'p-sortable-column-icon pi pi-fw pi-sort-amount-down';
			sortOrder = 'desc';
			tempObj = -1;

		}

		if (esgTableData.filteredValue && esgTableData.filteredValue.length) {
			tableVal = (esgTableData.filteredValue);
		} else {
			tableVal = (esgTableData.value);
		}

		tableVal.sort( ( data1, data2 ) => {
			value1 = data1[selectedYear][selectedBand]
			value2 = data2[selectedYear][selectedBand]

			result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
			return (tempObj * result);
		} )

		return esgTableData
	}

	resetFilters( ){

		let tableDomElement = this.esgTableData.el.nativeElement.children[0],
			sortIcons = tableDomElement.querySelectorAll('.p-datatable-wrapper .p-sortable-column-icon')

		for (let icon of sortIcons) {
			icon.classList.value = 'p-sortable-column-icon pi pi-fw pi-sort-alt';
		}
		
		this.listService.getEsgIndex(this.esgFilterDataObject).then( res => {

			this.esgIndexData = res;
			this.esgIndexTableData =  JSON.parse(JSON.stringify(this.esgIndexData.industriesTableData));

			this.formatDataForTable(this.esgIndexTableData)

		});
	}

	checkforDataLabels( event ) {

		if ( event.checked ) {
			this.changeDataLabels = true;
		} else {
			this.changeDataLabels = false;
		}

		this.initLineChartContainer( this.esgIndexData['lineChartDataYear'] );
		
	}
}
