import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Message } from 'primeng/api';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedScreenshotService } from 'src/app/interface/service/shared-screenshot.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';

@Component({
  selector: 'dg-diversity-calc-progress-report',
  templateUrl: './diversity-calc-progress-report.component.html',
  styleUrls: ['./diversity-calc-progress-report.component.scss']
})
export class DiversityCalcProgressReportComponent implements OnInit{

	constructor(
		private toCurrencyPipe: CurrencyPipe,
		private serverCommunicationService: ServerCommunicationService,
		private sharedScreenshotService: SharedScreenshotService,
		private sharedLoaderService: SharedLoaderService,
		public userAuthService: UserAuthService,
		private activatedRoute: ActivatedRoute
	) {}

	ChartDataPlugins = [ ChartDataLabels ];
	view = 'new-report';

	apiResponseDataArray: object = {};
	barOptions: any;
	pieDoubnutOptions: any = {};
	lineGraphOptions: any = {};
	order = [ '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', 'total' ];
	order_reversed = [ '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', 'total' ];

	handlePieAndDoughnut: Object = {
		pieData: [
			{ field: 'isEthnicOwnership', header: 'Ethnic Minority Business', count: undefined, bgColor: '#662e9b' },
			{ field: 'femaleOwned', header: 'Female Owned Business', count: undefined, bgColor: '#eb3b5a' },
			{ field: 'isNetZeroTarget', header: 'Net-Zero Target', count: undefined, bgColor: '#3cd5ff' },
			{ field: 'isMilitaryVeteran', header: 'Military Veterans', count: undefined, bgColor: '#23c3b5' },
			{ field: 'isBcorpCertification', header: 'B Corp Certified Business', count: undefined, bgColor: '#91c73e' },
			{ field: 'isVcseCategory', header: 'VCSE Category', count: undefined, bgColor: '#47a5dc' },
			{ field: 'isPpcCategory', header: 'Prompt Payment Code', count: undefined, bgColor: '#6574c4' }
		],

		msmeCategory: [
			{ field: 'Micro', header: 'Micro', count: undefined, bgColor: '#59ba9b' },
			{ field: 'Small', header: 'Small', count: undefined, bgColor: '#ffcc00' },
			{ field: 'Medium', header: 'Medium', count: undefined, bgColor: '#ee9512' },
			{ field: 'Large Enterprise', header: 'Large Enterprise', count: undefined, bgColor: '#e1b12c' },
			{ field: 'Unknown', header: 'Unknown', count: undefined, bgColor: '#aabbcc' },
		]

	}

	headerCardArray: Array<any> = []
	barChartArray: Array<any> = [
		{ field: 'isEthnicOwnership', displayLabel: 'Ethnic Minority Business', totalCount: undefined, barData: { labels: [], datasets: [ { data: [], backgroundColor: '#d9cbe6 ', borderColor: '#662e9b', borderWidth: 1 } ] }, styleClass: 'purple' },
		{ field: 'femaleOwned', displayLabel: 'Woman Owned Business', totalCount: undefined, barData: { labels: [], datasets: [ { data: [], backgroundColor: '#faced6 ', borderColor: '#eb3b5a', borderWidth: 1 } ] }, styleClass: 'red' },
		{ field: 'isNetZeroTarget', displayLabel: 'Net-Zero Target', totalCount: undefined, barData: { labels: [], datasets: [ { data: [], backgroundColor: '#cef4ff ', borderColor: '#3cd5ff', borderWidth: 1 } ] }, styleClass: 'blue' },
		{ field: 'isMilitaryVeteran', displayLabel: 'Military Veterans', totalCount: undefined, barData: { labels: [], datasets: [ { data: [], backgroundColor: '#c8f0ec ', borderColor: '#23c3b5', borderWidth: 1 } ] }, styleClass: 'cyan' },
		{ field: 'isBcorpCertification', displayLabel: 'B Corp Certified Business', totalCount: undefined, barData: { labels: [], datasets: [ { data: [], backgroundColor: '#e3f1cf ', borderColor: '#91c73e', borderWidth: 1 } ] }, styleClass: 'green' },
		{ field: 'isVcseCategory', displayLabel: 'VCSE Category', totalCount: undefined, barData: { labels: [], datasets: [ { data: [], backgroundColor: '#d1e8f6 ', borderColor: '#47a5dc', borderWidth: 1 } ] }, styleClass: 'blue' },
		{ field: 'isPpcCategory', displayLabel: 'Prompt Payment Code', totalCount: undefined, barData: { labels: [], datasets: [ { data: [], backgroundColor: '#d8dcf0 ', borderColor: '#6574c4 ', borderWidth: 1 } ] }, styleClass: 'indigo' }
	]
	
	targetProducts: Array<any> = [];
	diversitySaveList: Array<{}> = [];
	diversityDataForNewReport: Array<{}> = [];

	displayHeaderCardArray: Array<any> = [];
	displayBarChartArray: Array<any> = [];
	msgs: Message[] = [];
	snapShotBoolean: boolean = false;
	pageName: string;
	

	ngOnInit() {

		this.pageName = this.activatedRoute.snapshot.queryParams?.['pageName'];

		this.pieDoubnutOptions = {
			layout: {
				padding: { top: 10, left: 1, right: 1, bottom: 10 }
			},
			plugins: {
				legend: {
					position: "right",
					labels: {
						usePointStyle: true,
					}
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
					color: 'white',
					font: { weight: 'bold' },
					borderColor: 'white',
					borderRadius: 30,
					borderWidth: 3,
					padding: { top: 4, right: 6, bottom: 3, left: 6 },
					anchor: 'end',
					align: 'center',
					formatter: ( value ) => {
						value = this.toCurrencyPipe.transform( value, 'GBP', 'symbol', '1.0-2' );
						return value;
					}
				}
			}
		}

		let horXaix= {
			display: true,
			beginAtZero: true,
			ticks: {
				font: {
					family: 'Roboto',
					style: 'normal',
					size: 10
				},
				fontColor: '#bbb',
				padding: 10,
				// precision: 0,
				callback: (label) => {
					// return this.toCurrencyPipe.transform( label, 'GBP', 'symbol', '1.0-0' );
					return  formatNumber( (label) );
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
				padding: 3,
			},
			grid: {
				display: false,
				color: '#bbb'
			}
		};

		
		this.lineGraphOptions = {
			indexAxis: 'x',
			layout: {
				padding: { top: 18, left: 10, right: 10 }
			},
			scales: {
				// x: horYaxis,
				y: horXaix
			},
			plugins: {
				legend: {
					display: false,
					labels: {
						usePointStyle: true,
						color: 'var(--surface-a)'
					}
				},
				title: {
					display: false
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
				// onLineChartClick(event)
			},
		}

		this.barOptions = {
			indexAxis: 'y',
			layout: {
				padding: { top: 30, left: 10, right: 10 }
			},
			categoryPercentage: 1,
			barPercentage: 0.6,
			scales: {
				y: horYaxis,
				x: horXaix
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
					font: { weight: 'bold', size: 10 },
					borderColor: 'white',
					borderRadius: 30,
					borderWidth: 5,
					padding: { top: 4, right: 6, bottom: 3, left: 6 },
					anchor: 'end',
					// align: 'center',
					formatter: ( value ) => {
						// value = this.toCurrencyPipe.transform( value, 'GBP', 'symbol', '1.0-0' );
						value = formatNumber( (value) );
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
				// onLineChartClick(event)
			},
		}

		function formatNumber(value) {
			if (value >= 1e9) {
			return (value / 1e9).toFixed(2) + 'B';
			} else if (value >= 1e6) {
			return (value / 1e6).toFixed(2) + 'M';
			} else if (value >= 1e3) {
			return (value / 1e3).toFixed(2) + 'K';
			} else {
			return value.toFixed(2);
			}
		}

		this.headerCardArray = [
			{ 
				field: 'pieData', header: 'Spending Distribution Across Business Attributes', styleClass: 'cyan', plugin: this.ChartDataPlugins, chartData: {  labels: [], datasets: [ { label: '', data: [], backgroundColor: [ ], hoverOffset: 4 } ] }, chartOptions: this.pieDoubnutOptions, borderColor: '#fff', chartType: 'pie' 
			},
			{ 
				field: 'totalSpends', header: 'Procurement Spend Trends', styleClass: 'yellow', plugin: undefined, chartData: { labels: [], datasets: [ { label: 'Diversity Data', data: [], borderColor: '#aabbcc', backgroundColor:  [ '#662e9b', '#eb3b5a', '#3cd5ff', '#23c3b5 ', '#91c73e ', '#47a5dc ', '#6574c4 ' ], hoverOffset: 4, tension: 0.2, pointRadius: 6, pointHoverRadius: 8, fill: false } ] }, chartOptions: this.lineGraphOptions, chartType: 'line' 
			},
			{
				 field: 'msmeCategory', header: 'MSME Distribution Overview', styleClass: 'indigo', plugin: this.ChartDataPlugins, chartData: { labels: [], datasets: [ { label: 'MSME', data: [], borderColor: '#fff', backgroundColor:  [], hoverOffset: 4 } ] }, chartOptions: this.pieDoubnutOptions, chartType: 'doughnut' 
			}
		],

		this.fetchListData();

		// this.dataFetchFromApi();

	}

	dataFetchFromApi() {
		this.sharedLoaderService.showLoader();

		let payload = {
			"listIds": this.targetProducts.map( val => val._id )
		}

		this.serverCommunicationService.globalServerRequestCall( 'post', 'DG_API', 'diversity_spends_new_stats', payload ).subscribe({
			next: (res) => {
				if ( res.body.status == 'success' ) {
					this.view = 'old-report'
					this.apiResponseDataArray = res.body.result;
					this.snapShotBoolean = true

					this.prepareBarData();
					this.prepareHeaderCardData();
					
					// this.scrollToElement( 'progressreportScreen' );


				}
			},
			error: ( err ) => {
				console.log( err )
			}
		})

		this.serverCommunicationService.globalServerRequestCall( 'post', 'DG_API', 'diversity-spends-new-stats-v2', payload ).subscribe({
			next: (res) => {
				if ( res.body.status == 'success' ) {
					this.diversityDataForNewReport = res.body.result;
					this.snapShotBoolean = true
					this.sharedLoaderService.hideLoader();
				}
			},
			error: ( err ) => {
				console.log( err )
			}
		})
	}

	fetchListData() {

		let queryParam = [ { key: 'pageName', value: this.pageName } ];

		this.sharedLoaderService.showLoader();
		
		this.serverCommunicationService.globalServerRequestCall( 'get', 'DG_API', 'diversityCalculationList', undefined, undefined, queryParam ).subscribe({
			next: (res) => {

				if (res.status === 200) {
					this.diversitySaveList = [];
					this.diversitySaveList = res.body.result;
					this.sharedLoaderService.hideLoader();
				}

			},
			error: (err) => {
				console.log(err);
			}
		})

	}

	scrollToElement( id ) {

		setTimeout(() => {
			
			( document.getElementById( id ) as HTMLElement ).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });			

		}, 500);

	}

	prepareBarData() {
		
		let tempObj = {};
		this.displayBarChartArray = JSON.parse( JSON.stringify( this.barChartArray ) );
		for ( let val of this.displayBarChartArray ) {

			for ( let key of Object.keys(this.apiResponseDataArray[ val.field ]).sort() ) {

				const value = this.apiResponseDataArray[ val.field ][key];
				if ( key != 'total' ) {
					val[ 'barData' ][ 'labels' ].push( key )
					val[ 'barData' ][ 'datasets' ][ 0 ][ 'data' ].push( value )
				} else {
					val[ 'totalCount' ] = value;
					tempObj[ val.field ] = value;
				}

			}
	
			this.apiResponseDataArray[ 'pieData' ] = tempObj;
		}

	}

	prepareHeaderCardData() {
		this.displayHeaderCardArray = JSON.parse( JSON.stringify( this.headerCardArray ) );

		for ( let val of this.displayHeaderCardArray ) {
			for ( const key of Object.keys(this.apiResponseDataArray[ val.field ]).sort()  ) {
				if( key == 'total' ) continue;
				const value = this.apiResponseDataArray[ val.field ]?.[key] || undefined;

				if ( ![ 'pieData', 'msmeCategory' ].includes( val.field ) ) {
					val[ 'chartData' ][ 'labels' ].push( key )
					val[ 'chartData' ][ 'datasets' ][ 0 ][ 'data' ].push( value )
				} else {
					val[ 'chartData' ][ 'labels' ] = [];
					val[ 'chartData' ][ 'datasets' ][ 0 ][ 'data' ] = [];
					val[ 'chartData' ][ 'datasets' ][ 0 ][ 'backgroundColor' ] = [];

					for ( let item of this.handlePieAndDoughnut[ val.field ] ) {
						val[ 'chartData' ][ 'labels' ].push( item[ 'header' ] )
						val[ 'chartData' ][ 'datasets' ][ 0 ][ 'data' ].push( this.apiResponseDataArray[ val.field ]?.[item.field] || 0 )
						val[ 'chartData' ][ 'datasets' ][ 0 ][ 'backgroundColor' ].push( item[ 'bgColor' ] )

					}

				}
				
			}
		}
	}

	moveToTarget( event ) {

		if ( this.targetProducts.length > 12 ) {
			this.msgs = [];
			this.msgs = [({ severity: 'info', summary: 'Note', detail: 'You may select a maximum of 12 lists.' })];
			setTimeout(() => {
				this.msgs = [];
			}, 3000);
			this.diversitySaveList.push(event.items[0]);
			this.targetProducts.splice(this.targetProducts.indexOf(event.items[0]), 1);
		}
	}
	
	takeSnapshot( progressreportScreenDataId ){
		this.sharedScreenshotService.snapshotForStatsInsight( progressreportScreenDataId,'DG_Diversity_Progress_Report.jpeg');
	}

}
