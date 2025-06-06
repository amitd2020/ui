import { Component, OnInit } from '@angular/core';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { industryListData } from '../../../interface/view/shared-components/stats-insights/stats-financial-index'
import { ActivatedRoute, Router } from '@angular/router';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import ChartDataLabels from "chartjs-plugin-datalabels";

@Component({
    selector: 'dg-benchmark-dashboard',
    templateUrl: './benchmark-dashboard.component.html',
    styleUrls: ['./benchmark-dashboard.component.scss'],
})
export class BenchmarkDashboardComponent implements OnInit {

	industryListData: Array<object> = JSON.parse( JSON.stringify( industryListData ) );
	ChartDataPlugins = [ ChartDataLabels ];

	tableColumnData: any[] = [
		{ field: 'averageScore', header: 'Avg Score', minWidth: '120px', maxWidth: '120px', textAlign: 'right' },
		{ field: 'performanceCount', header: 'Performance Based Company Count', minWidth: '300px', maxWidth: '', textAlign: 'center' },
	];
	globalDataPrepared: any[] = [];

	displayGraphCardArray: object = {
		industry: {  labels: [], datasets: [ { label: '', data: [], backgroundColor: '#4e5fbb' } ] },
		region: {  labels: [], datasets: [ { label: '', data: [], backgroundColor: '#4e5fbb' } ] },
		MSME: {  labels: [], datasets: [ { label: '', data: [], backgroundColor: '#4e5fbb' } ] },
		country: {  labels: [], datasets: [ { label: '', data: [], backgroundColor: '#4e5fbb' } ] }
	};
	barOptions: object = {};
	activeMap: object = {
		industry: 0,
		region: 0,
		MSME: 0,
		country: 0
	}

    constructor(
        private serverCommunicationService: ServerCommunicationService,
		private router: Router,
		private activeRoute: ActivatedRoute,
		private sharedLoaderService: SharedLoaderService,
		private toCurrencyPipe: CurrencyPipe,
		private toNumberSuffix: NumberSuffixPipe,
        private toTitleCasePipe: TitleCasePipe,
    ) {}

    ngOnInit() {

		let horXaix= {
			display: true,
			beginAtZero: true,
			ticks: {
				font: {
					family: 'Roboto',
					style: 'normal',
				},
				fontColor: '#bbb',
				padding: 10,
				// precision: 0,
				callback: (label) => {
					return this.toNumberSuffix.transform( label, 2 );
				}
			},
			grid: {
				display: true,
				drawBorder: false,
				drawTicks: false,
				tickLength: 0,
				// borderDash: [5, 10],
				borderDash: ( context ) => {
					if (   context.tick?.value && context.tick.value > 0 ) {
						return [5, 10]
					}
					return [1, 0];
				},
				color: context => context.index == 0 ? 'rgba(0, 0, 0, 0.2)' : '#bbb'
			},
			title: {
				show: false,
			}
		};

		let horYaxis = {
			ticks: {
				beginAtZero: true,
				font: {
					size: 12,
					family: 'Roboto',
					style: 'normal',
				},
				// color: '#bbb',
				padding: 3
			},
			grid: {
				display: false,
				color: '#bbb'
			}
		};

		this.barOptions = {
			indexAxis: 'x',
			layout: {
				padding: { top: 30, left: 10, right: 10 }
			},
			categoryPercentage: 1,
			barPercentage: 0.5,
			scales: {
				y: horXaix,
				x: horYaxis
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
						return value ? value : 'white';
					},
					font: { weight: 'bold' },
					borderColor: 'white',
					borderRadius: 25,
					borderWidth: 2,
					padding: { top: 4, right: 6, bottom: 3, left: 6 },
					anchor: 'end',
					// align: 'center',
					formatter: ( value ) => {
						value = this.toNumberSuffix.transform( value, 2 );;
						return value;
					}
				}
			},
			hover: {
				onHover: (event, elements) => {
					event.target.style.cursor = elements[0] ? "pointer" : "default";
				}
			},
			animation: {
				duration: 2000,
				easing: 'easeInOutQuad'
			},
			onClick: (event) => {
				// this.gotToSearchPage(event)
			},
		}

		let width
		this.activeRoute.snapshot.routeConfig.path != 'benchmarking-overview' ? width = '400px' : width = '500px';

		this.globalDataPrepared = [

			{ key: 'industry', header: 'Industry Analysis', tableColumn: [ { field: 'key', header: 'SIC Industry', minWidth: width, maxWidth: width, textAlign: 'left', chipGroup: 'SIC Codes' }, ...this.tableColumnData ], tableData: [], tableHandler: { tabeHeight: '30vh' }, fn: ( industryData: any[], item?: any ) => this.industryDataPrepared( industryData, item ), showGraphHeader: true, chartOptions: this.barOptions, borderColor: '#fff', chartType: 'bar' },
	
			{ key: 'region', header: 'Region', tableColumn: [ { field: 'key', header: 'Region', minWidth: width, maxWidth: width, textAlign: 'left', chipGroup: 'Region' }, ...this.tableColumnData ], tableData: [], tableHandler: { tabeHeight: '30vh' }, fn: ( regionData: any[], item?: any ) => this.regionDataPrepared( regionData, item ), showGraphHeader: false, chartOptions: this.barOptions, borderColor: '#fff', chartType: 'bar' },
	
			{ key: 'MSME', header: 'MSME', tableColumn: [ { field: 'key', header: 'MSME', minWidth: width, maxWidth: width, textAlign: 'left', chipGroup: 'MSME Classification'}, ...this.tableColumnData ], tableData: [], tableHandler: { tabeHeight: '30vh' }, fn: ( msmeData: any[], item?: any ) => this.msmeDataPrepared( msmeData, item ), showGraphHeader: false, chartOptions: this.barOptions, borderColor: '#fff', chartType: 'bar' },
	
			{ key: 'country', header: 'Country', tableColumn: [ { field: 'key', header: 'Country', minWidth: width, maxWidth: width, textAlign: 'left', chipGroup: 'Country' }, ...this.tableColumnData ], tableData: [], tableHandler: { tabeHeight: '30vh' }, fn: ( countryData: any[], item?: any ) => this.countryDataPrepared( countryData, item ), showGraphHeader: false, chartData: {  labels: ['Dynamic', 'Low'], datasets: [ { label: '', data: [1216, 1200], backgroundColor: '#4e5fbb' } ] }, chartOptions: this.barOptions, borderColor: '#fff', chartType: 'bar' }
	
		]

        this.fetchBenchmarkOverviewData();
    }

	private fetchBenchmarkOverviewData() {

		this.sharedLoaderService.showLoader();

		let apiHandler: object = { endpoint: 'getBenchmarkOverviewData', route: 'dg-futureGrowth' };

		if ( this.activeRoute.snapshot.routeConfig.path != 'benchmarking-overview' ) apiHandler = { endpoint: 'getPropensitykOverviewData', route: 'dg-prospensityGrowth' };
		
		this.serverCommunicationService.globalServerRequestCall( 'get', apiHandler['route'], apiHandler['endpoint'] ).subscribe( {
			next: ( res ) => {

				if ( res?.body &&  res?.body.status == 200 ) {
					let data = res.body.result;

					for ( let item of this.globalDataPrepared ) {
						item.fn( data[ item.key ], item )

					}

					this.sharedLoaderService.hideLoader();
				}

			},
			error: ( error ) => {
				console.log ( error );
				this.sharedLoaderService.hideLoader();
			}
		} )

	}

	private msmeDataPrepared( msmeDataArray: any[], item?: any ) {
		item.tableData = [];
		item.tableData = msmeDataArray;
		if ( msmeDataArray && msmeDataArray.length ) {
			this.graphDataPrepared( msmeDataArray[0], item );
		}
	}
	private regionDataPrepared( regionDataArray: any[], item?: any ) {
		item.tableData = [];
		item.tableData = regionDataArray;
		if ( regionDataArray && regionDataArray.length ) {
			this.graphDataPrepared( regionDataArray[0], item );
		}
	}
	private countryDataPrepared( countryDataArray: any[], item?: any ) {
		item.tableData = [];
		item.tableData = countryDataArray;

		if ( countryDataArray && countryDataArray.length ) {
			this.graphDataPrepared( countryDataArray[0], item );
		}
	}

	private industryDataPrepared( industryDataArray: any[], item?: any ) {

		item.tableData = [];

		if ( industryDataArray && industryDataArray.length ) {
			for (let i = 0; i < this.industryListData.length; i++) {

				for (let j = 0; j < industryDataArray.length; j++) {
					
					if ( this.industryListData[i]['value'] == industryDataArray[j]['key'] ) {

						this.industryListData[i]['averageScore'] = industryDataArray[j]['averageScore'] || 0;
						this.industryListData[i]['performanceCount'] = industryDataArray[j]['performanceCount'] || [];
						this.industryListData[i]['key'] = this.industryListData[i]['value'];
					}

				}

			}

			this.graphDataPrepared( industryDataArray[0], item );

		} else {
			this.industryListData = [];
		}

		item.tableData = this.industryListData;
		this.graphDataPrepared( industryDataArray[0], item );

	}

	private graphDataPrepared( dataArray, item?, index: number = 0 ) {

		let performanceArray = dataArray['performanceCount'];
		performanceArray = performanceArray.filter( obj => (obj.key != '' && obj.key != '0.5') );
		this.activeMap[ item['key'] ] = index;

		this.displayGraphCardArray[ item['key'] ] = {  labels: [], datasets: [ { label: '', data: [], backgroundColor: '#4e5fbb' } ] };
		this.displayGraphCardArray[ item['key'] ][ 'graphHeader' ] = this.toTitleCasePipe.transform( dataArray['key'] );

		performanceArray.forEach( element => {
			this.displayGraphCardArray[ item['key'] ]['labels'].push( this.toTitleCasePipe.transform( element['key'] ) );
			this.displayGraphCardArray[ item['key'] ]['datasets'][0]['data'].push( element['doc_count'] )
		});

	}

	gotToOtherPage( rowData, col, path ) {

		let selectedFilter: any[]= [ { chip_group: 'Status', chip_values: ["live"] } ];

		if( col.chipGroup == 'SIC Codes' ) {
			selectedFilter.push(
				{chip_group: col.chipGroup, chip_values: [rowData.key], filter_exclude: false, chip_industry_sic_codes: [rowData.key]}
			)
		} else (
			selectedFilter.push(
				{ chip_group: col.chipGroup, chip_values: [rowData.key] }
			)
		)
		
		let urlStr: string;
		urlStr = String( this.router.createUrlTree( [ path ], { queryParams: { chipData: JSON.stringify( selectedFilter )} } ) );
		window.open( urlStr, '_blank' );
	}

	viewAnalytics( rowData, item, index ) {

		this.graphDataPrepared( rowData, item, index );
	}

	resetTable( rowData, item, index ) {
		setTimeout(() => {
			
			( document.getElementById( item.key + index ) as HTMLElement ).scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });			

		}, 500);

		this.graphDataPrepared( rowData, item, index );
	}

	gotToSearchPage( rowData?, data?, chipGroup?){
		let performanceBasedCompanyChipGrp = this.activeRoute.snapshot.routeConfig.path == 'benchmarking-overview' ? 'Financial Performance' : 'Readiness';

		let selectedFilter = [];
		if( chipGroup == 'SIC Codes') {
			selectedFilter.push({chip_group: "Status", chip_values: ["live"]}, {chip_group: chipGroup, chip_values: [rowData.label], chip_industry_sic_codes: [rowData.key]}, {chip_group: performanceBasedCompanyChipGrp, chip_values: [data.key]})
		} else {
			selectedFilter.push({chip_group: "Status", chip_values: ["live"]}, {chip_group: chipGroup, chip_values: [rowData.key]}, {chip_group: performanceBasedCompanyChipGrp, chip_values: [data.key]})
		}

		let urlStr: string;
		urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(selectedFilter)} }));
	
		window.open( urlStr, '_blank' );
	  }
}
