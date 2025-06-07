import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SearchCompanyService } from '../search-company.service';
import { Router } from '@angular/router';
import { MonthsEnum } from '../search-company.constant';

@Component({
	selector: 'dg-charge-dashboard',
	templateUrl: './charge-dashboard.component.html',
	styleUrls: ['./charge-dashboard.component.scss']
})


export class ChargeDashboardComponent implements OnChanges, OnInit {

	@Input() listDataValues: any;

	dropdownYearForBarGraphFully: Array<any> = [];
	dropdownYearForBarGraphOutstanding: Array<any> = [];
	topLendersData: object = {};
	topLendersOptions: any;
	yearBardataFully: any;
	yearBardataOutstanding: any;
	yearBarOptions: any;	
    ChartDataLabelsPlugins = [ChartDataLabels];
	dashboardCards = [
		{ cardIcon: 'pi pi-building', cardNumber: '', cardText: 'Total Companies', textColor:'text-blue-700', paddingYAxis: 'py-6', activeTab: 'Companies', isCardClickable: true },
		{ cardIcon: 'ui-icon-monetization-on', cardNumber: '', cardText: 'Total Charges', textColor:'text-red-800', paddingYAxis: 'py-5', activeTab: 'List of Charges', isCardClickable: true },
		{ cardIcon: 'pi pi-check-square', cardNumber: '', cardText: 'Satisfied Charges', textColor:'text-teal-700',  paddingYAxis: 'py-6', activeTab: 'List of Charges', chipVal: 'Fully Satisfied', isCardClickable: true },
		{ cardIcon: 'ui-icon-money-off', cardNumber: '', cardText: 'Outstanding Charges', textColor:'text-orange-600', paddingYAxis: 'py-5', activeTab: 'List of Charges', chipVal: 'Outstanding', isCardClickable: true },
	];
	
	cities: Array<any> = [];

	selectedChartYearFully: any;
	selectedChartYearOutstanding: any;
	payloadForChildApi:any;
	fullySatisfiedChartData: any;
	outstandingChartData: any;
	hasChargesYear: boolean = false;
	
	constructor(
		private toTitleCasePipe: TitleCasePipe,
		private toNumberSuffix: NumberSuffixPipe,		
		private router: Router,
		private globalServerCommunication: ServerCommunicationService,
		public searchCompanyService: SearchCompanyService,
		private decimalPipe: DecimalPipe
	) { }

	ngOnInit() {
		if ( this.selectedChartYearFully ) this.apiCallForFullySatisfiedChartData();
	}

	ngOnChanges( ) {
		
		this.searchCompanyService.$apiPayloadBody.subscribe( res => {
			this.payloadForChildApi = res;
        });

		this.dropdownYearForBarGraphFully = this.listDataValues['chargesYearArray'];
		this.dropdownYearForBarGraphOutstanding = this.listDataValues['chargesYearArray'];
		
		let chargesYear: any = {};
		chargesYear = this.payloadForChildApi.filterData.find( item => item?.chip_group == 'Charge Year' );
		
		if ( chargesYear && Object.keys( chargesYear ).length ) { 
			this.hasChargesYear = true;
			this.selectedChartYearFully = chargesYear.chip_values[0];
			this.selectedChartYearOutstanding = chargesYear.chip_values[0];
		} else {
			this.hasChargesYear = false;
			this.selectedChartYearFully = undefined;
			this.selectedChartYearOutstanding = undefined;
		}

		if ( Object.keys(this.listDataValues).length > 0 ) {
			this.apiCallForFullySatisfiedChartData();	
			this.apiCallForOutstandingChartData();		
		}

		// for (const property in this.listDataValues?.['outstandingWithPartialFinal']) {
		// 	this.dropdownYearForBarGraphOutstanding.push( property )
		// }
		// this.selectedChartYearOutstanding = this.dropdownYearForBarGraphOutstanding[0];
		
		this.dashboardCards.forEach( dashCardVal => {
			switch ( dashCardVal.cardText) {
				case 'Total Companies':
					dashCardVal.cardNumber = this.listDataValues?.total?.value;
					break;
				case 'Total Charges':
					dashCardVal.cardNumber = this.listDataValues?.totalChargeCount;
					break;
				case 'Satisfied Charges':
					dashCardVal.cardNumber = this.listDataValues?.satisFiedChargeCount;
					dashCardVal.isCardClickable = this.listDataValues?.satisFiedChargeCount > 0 ? true : false;
					break;
				case 'Outstanding Charges':
					dashCardVal.cardNumber = this.listDataValues?.outStandingChargeCount;
					dashCardVal.isCardClickable = this.listDataValues?.outStandingChargeCount > 0 ? true : false;
					break;
			}
		});

		this.listDataValues['topLenders'] = this.listDataValues['topLenders']?.map( item => {			
			item['key'] = this.toTitleCasePipe.transform(item['key']);
			return item;
		} )
		
		this.yearBarOptions = {
			layout: {
				padding: { top: 30, left: 10, right: 10 }
			},
			tension: 0.4,
			scales: {
				x: {
					ticks: {
						font: {
							family: 'Roboto',
						},
						padding: 8
					}
				},
				y:  {
					ticks: {
						font: {
							family: 'Roboto',
						},
						padding: 8,
						callback: (label, index, labels) => {
							return this.toNumberSuffix.transform( label, 2 );
						}
					},
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
				}
			},
			plugins: {
				legend: {
                    display: false,
				// 	labels: {
				// 		font: {
				// 			family: 'Roboto'
				// 		},
				// 		padding: 15,
				// 		fill: true,
				// 		color: '#4e5fbb',
				// 		usePointStyle: true,
				// 		pointStyle: 'rectRot'
				// 	},
                },
				title: {
					fontFamily: 'Roboto',
				},
				tooltip: {
					enabled: true,
					titleFontFamily: 'Roboto',
					bodyFontFamily: 'Roboto',
				},
				subtitle: {
					display: false,
					text: 'Custom Chart Subtitle'
				}
			},
			onClick: ( event, clickedElements ) => {
				let index = clickedElements[0].index, label = event.chart.config._config.data.datasets[0].label, month, year;
				month = event.chart.config._config.data.labels[index].split('-')[0];
				year = event.chart.config._config.data.labels[index].split('-')[1];
				let modifiedMonth = String( parseInt( MonthsEnum[ month ] ) ).padStart(2, '0');
				this.onChartElementClick( label, modifiedMonth, year );
			},
			onHover: (event) => {
				event.native.target.style.cursor = 'pointer';
			}
		}

		this.yearBarOptions['plugins'].datalabels = {
			display: true,
			align: 'end',
			anchor: 'end',
			offset: 5,
			color: '#fff',
			font: { size: 12 },
			borderRadius: 5,
			padding: { top: 4, right: 10, bottom: 4, left: 10 },
			backgroundColor: '#2874a6',
			formatter: ( value ) => {
				return value > 0 ? `${ this.decimalPipe.transform(value, '1.0-0') }` : null;
			}
		}
		
	}	

	apiCallForFullySatisfiedChartData() {

		let requestedPayload = { ...this.payloadForChildApi };
		requestedPayload['fullySatisfiedYear'] = this.selectedChartYearFully;
		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_API', 'getFullySatisfiedCount', requestedPayload ).subscribe({
		
			next: res => {
				this.fullySatisfiedChartData = res?.body
				// this.dropdownYearForBarGraphFully = res?.body?.chargesYearArray;
				this.chargeFullyChartData();
			},
			error: err => {
				console.log(err);
			}
		})
		// this.apiCallForOutstandingChartData();		
	}

	fullyReset() {

		let requestedPayload = { ...this.payloadForChildApi };
		requestedPayload['fullySatisfiedYear'] = '';		
		this.selectedChartYearFully = undefined
		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_API', 'getFullySatisfiedCount', requestedPayload ).subscribe({
		
			next: res => {
				this.fullySatisfiedChartData = res?.body
				// this.dropdownYearForBarGraphFully = res?.body?.chargesYearArray;
				this.chargeFullyChartData();
			},
			error: err => {
				console.log(err);
			}
		})
		// this.apiCallForOutstandingChartData();		
	}

	apiCallForOutstandingChartData() {

		let requestedPayload = { ...this.payloadForChildApi };
		requestedPayload['outstandingWithPartialyear'] = this.selectedChartYearOutstanding;
		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_API', 'getOutstandingWithPartialCount', requestedPayload ).subscribe({
		
			next: res => {
				this.outstandingChartData = res?.body;
				this.chargeOutstandingChartData()
			},
			error: err => {
                console.log(err);
			}
		})
	}

	outstandingReset() {

		let requestedNewPayload = { ...this.payloadForChildApi };
		requestedNewPayload['outstandingWithPartialyear'] = '';
		this.selectedChartYearOutstanding = undefined
		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_API', 'getOutstandingWithPartialCount', requestedNewPayload ).subscribe({
		
			next: res => {
				this.outstandingChartData = res?.body;
				this.chargeOutstandingChartData()
			},
			error: err => {
				console.log(err);
			}
		})

	}

	chargeFullyChartData() {

		let lables = [], datasets = [], fullySatisfiedLabels = [], fullySatisfiedData = [], outstandingLables = [], outstandingData = [];

		this.fullySatisfiedChartData?.['fullysatisfied']?.map( fullyItem => {
			if ( fullyItem.hasOwnProperty('year') ) {
				fullySatisfiedLabels.push( this.toTitleCasePipe.transform( `${fullyItem?.['month']}-${fullyItem?.['year']}` ) );  
			} else {
				fullySatisfiedLabels.push( this.toTitleCasePipe.transform(fullyItem?.['month'] ) ); 
			}
			fullySatisfiedData.push( fullyItem?.['value'] );
		} )

		this.yearBardataFully = {
			labels: fullySatisfiedLabels,
			datasets: [
				{
					label: 'Fully Satisfied',
					data: fullySatisfiedData,
					borderRadius: 10,
					backgroundColor: ['#0c2461'],
					hoverBackgroundColor: ['#6a89cc' ]
				}
			]
		};

	}

	chargeOutstandingChartData() {

		let outstandingLables = [], outstandingData = [];

		this.outstandingChartData?.['outstandingWithPartial']?.map( outItem => {
			if ( outItem.hasOwnProperty('year') ) {
				outstandingLables.push( this.toTitleCasePipe.transform( `${outItem?.['month']}-${outItem?.['year']}` ) );  
			} else {
				outstandingLables.push( this.toTitleCasePipe.transform(outItem?.['month'] ) ); 
			}
			outstandingData.push( outItem?.['value'] );
		} )

		this.yearBardataOutstanding = {
			labels: outstandingLables,
			datasets: [
				{
					label: 'Outstanding',
					data: outstandingData,
					borderRadius: 10,
					backgroundColor: ['#2874a6'],
					hoverBackgroundColor: ['#3498db' ]
				}
			]
		};

	}

	getYearfromDropdownFully(){
		if ( this.selectedChartYearFully ) this.apiCallForFullySatisfiedChartData();
	}

	getYearfromDropdownOutstanding() {
		if ( this.selectedChartYearOutstanding ) this.apiCallForOutstandingChartData();
	}

	gotToChargesView( recentTab, chipValue, cardText ) {
		let url;
		const requestedPayload = JSON.parse(JSON.stringify(this.payloadForChildApi));
		if ( chipValue ) {
			let chipval = this.payloadForChildApi?.filterData.find(item => item?.chip_group == "Charges Status");

			requestedPayload.filterData = requestedPayload.filterData.filter( item => item.chip_group != 'Charges Status' );
			if( chipval ) {
				if( chipValue == 'Fully Satisfied' ) {
					requestedPayload.filterData.push( { chip_group: 'Charges Status', chip_values: [ 'Fully Satisfied' ] });
				} else {
					let outstandingDataValues = chipval?.chip_values.filter(item => item !== 'Fully Satisfied');
					requestedPayload.filterData.push( { chip_group: 'Charges Status', chip_values: outstandingDataValues });
				}
			} else {
				if ( chipValue == 'Fully Satisfied' ) {
					requestedPayload.filterData.push( { chip_group: 'Charges Status', chip_values: [ 'Fully Satisfied' ] });
				} else {
					requestedPayload.filterData.push( { chip_group: 'Charges Status', chip_values: [ 'Part Satisfied', 'Outstanding' ] });
				}
			}
		}
		url = String( this.router.createUrlTree( ['company-search'], { queryParams: { chipData: JSON.stringify(requestedPayload.filterData), showCharges: true, activeTab: recentTab } } ) );
		window.open(url, '_blank');
	}

	onChartElementClick( chartLabel, monthStatus, yearStatus ) {
		let url;
		const requestedData = JSON.parse(JSON.stringify(this.payloadForChildApi));

		requestedData.filterData = requestedData.filterData.filter( item => item.chip_group != 'Charge Month' && item.chip_group != 'Charge Year' && item.chip_group != 'Charges Status' );

		if ( chartLabel ) {
			let chipval = this.payloadForChildApi?.filterData.find(item => item?.chip_group == "Charges Status");

			requestedData.filterData = requestedData.filterData.filter( item => item.chip_group != 'Charges Status' );
			if( chipval ) {
				if( chartLabel == 'Fully Satisfied' ) {
					requestedData.filterData.push( { chip_group: 'Charges Status', chip_values: [ 'Fully Satisfied' ] });
				} else {
					let outstandingDataValues = chipval?.chip_values.filter(item => item !== 'Fully Satisfied');
					requestedData.filterData.push( { chip_group: 'Charges Status', chip_values: outstandingDataValues });
				}
			} else {
				if ( chartLabel == 'Fully Satisfied' ) {
					requestedData.filterData.push( { chip_group: 'Charges Status', chip_values: [ 'Fully Satisfied' ] });
				} else {
					requestedData.filterData.push( { chip_group: 'Charges Status', chip_values: [ 'Part Satisfied', 'Outstanding' ] });
				}
			}
		}

		// requestedData.filterData.push( { chip_group: 'Charges Status', chip_values: [ chartLabel ] } );
		requestedData.filterData.push( { chip_group: 'Charge Year', chip_values: [ yearStatus ], label: "Charge Created Year" } );
		requestedData.filterData.push( { chip_group: 'Charge Month', chip_values: [ monthStatus ], label: "Charge Created Month" } );

		url = String( this.router.createUrlTree( ['company-search'], { queryParams: { chipData: JSON.stringify(requestedData.filterData), showCharges: true, activeTab: 'List of Charges' } } ) );
		window.open(url, '_blank');

	}

}