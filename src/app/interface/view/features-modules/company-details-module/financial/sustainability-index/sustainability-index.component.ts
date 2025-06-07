import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import * as ChartDataSets from "chartjs-plugin-datalabels";
import { UIChart } from 'primeng/chart';

import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { DataCommunicatorService } from '../../data-communicator.service';

@Component({
	selector: 'dg-sustainability-index',
	templateUrl: './sustainability-index.component.html',
	styleUrls: ['./sustainability-index.component.scss']
})
export class SustainabilityIndexComponent implements OnInit {

	ChartDataLabelsPlugin = ChartDataSets;

	companyData: any;
	selectedDirectorName: any;
	selectedCompanyName: any;
	sustainabilityIndexGraphOptions: any;

	directorNameListOptions: Array<{ label: string, value: string }> = [];
	companyListOptions: Array<{ label: string, value: string }> = [];

	sustainIndexData: any;
	sustainabilityIndexChartDatasets: any = {};

	sustainIndexCardDefinitions: any = {
		debtServicingData: 'Repayment of obligations in a specific period of time.',
		earningPowerData: 'Capacity to transform assets into Sales.',
		internalAccrualsData: 'Earnings retained to finance the expansion.',
		healthOfBalanceSheetData: 'Amount of cash made available through various operations.',
		operationalEfficiencyData: 'Taping the enterprise value to generate cash flow through operations.',
		ValuationData: 'The financial capability of the company to amass market capitalisation using total assets available.'
	}

	constructor(
		public toNumberSuffix: NumberSuffixPipe,
		private dataCommunicatorService: DataCommunicatorService,
		private titlecasepipe: TitleCasePipe,
		public commonService: CommonServiceService,
		private sharedLoaderService: SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService

	) { }

	ngOnInit() {

		this.dataCommunicatorService.$dataCommunicatorVar.subscribe((res: any) => this.companyData = res);

		// Bar Chart Options ~Start//
		this.sustainabilityIndexGraphOptions = {
			layout: {
				padding: { top: 25, left: 10, right: 10 }
			},
			pointStyle: 'circle',
			plugins: {
				datalabels: {
					display: ( context ) => {
						return context.active ? true : false;
					},
					backgroundColor: ( context ) => {
						return context.dataset.backgroundColor;
					},
					borderColor: ( context ) => {
						return context.dataset.backgroundColor;
					},
					borderRadius: 0,
					borderWidth: 1,
					color: '#fff',
					font: {
						weight: 'bold'
					},
					align: 'end',
					offset: 5,
					padding: 5,
					textAlign: 'center'
				},
				legend: {
					display: false,
				},
				title: {
					display: false
				},
				tooltip: {
					mode: 'index',
					intersect: false,
					enabled: false
				}
			},
			elements: {
				line: {
					fill: false,
					tension: 0
				}
			},
			aspectRatio: 5 / 3,
			hover: {
				mode: 'nearest',
				intersect: false
			},
			animation: {
				duration: 4000,
				easing: 'easeInOutQuad'
			}
		}
		// Bar Chart Options ~End//
		this.sharedLoaderService.showLoader();

		this.getChartData( this.selectedCompanyName );
		
	}
	
	getChartData( selectedCompanyName ) {

		let sendCompObj = {
			"companyNumber": this.companyData['companyRegistrationNumber'],
			"comparingCompanyNumber": selectedCompanyName ? selectedCompanyName : ''
		}

		this.globalServiceCommnunicate.globalServerRequestCall( 'post', 'DG_COMPANY_DETAILS', 'getSustainabilityIndexData', sendCompObj ).subscribe( res => {
			
			if(res.body['status'] == 200) {

				this.sustainIndexData = res.body;

				if(this.sustainIndexData['directorsList'] && this.sustainIndexData['directorsList'].length) {

					let tempArrDirectorList = [];

					for( let val of this.sustainIndexData['directorsList'] ) {

						tempArrDirectorList.push( { label: this.titlecasepipe.transform( val.directorTitle ) + ' ' + this.titlecasepipe.transform( val.directorName.trim() ) + ' ' + '(' + this.titlecasepipe.transform( val.directorRole ) + ')' , value: val.directorPnr });

					}

					this.directorNameListOptions = tempArrDirectorList;

				}
				
				if ( !selectedCompanyName ) {

					this.createChartDataSets( this.sustainIndexData['parentCompanyChartData'][0], 'chartForParent' );

				} else {

					this.createChartDataSets( this.sustainIndexData['comparingCompanyChartData'][0], 'chartForComparingCompany' );

				}


			}
			this.sharedLoaderService.hideLoader();
			
		});

	}

	getCompanyListsByDirectorPnr( selectedDirectorName: number ) {

		this.sharedLoaderService.showLoader();
		
		let reqobj = [ this.companyData['companyRegistrationNumber'], selectedDirectorName ];
		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_COMPANY_DETAILS', 'getCompanyDetailsByDirectorPnr', reqobj ).subscribe( res => {
			let data = res.body;
			if(data['status'] == 200) {

				let tempCompaniesList = [];

				if(data['result'] && data['result'].length) {

					for(let compName of data['result']) {
						
						tempCompaniesList.push( { label: this.titlecasepipe.transform(compName.companyName), value: compName.companyNumber, noOfYears: compName.noOfYears, appointedDate: compName.directorData[0].fromDate, inactive: compName.hasFullAccounts == false });
						
					}

					this.companyListOptions = tempCompaniesList;
					
				}

			}

			this.sharedLoaderService.hideLoader();

		});

	}

	getOverAllData( selectedCompanyName: number ) {
		this.sharedLoaderService.showLoader();
		this.getChartData( selectedCompanyName );
	}

	createChartDataSets( incomingCompanyData, chartFor ) {
		this.sharedLoaderService.showLoader();
		
		for( let dataSet in incomingCompanyData ) {
			
			let parentDataObj = incomingCompanyData[ dataSet ];

			if ( typeof parentDataObj == 'object' && parentDataObj.length ) {

				let chartLabels = [], chartDatasetValues = [],
					chartDataset = {};

				parentDataObj.sort( ( a,b ) => a.year.localeCompare( b.year ));

				for ( let finData of parentDataObj ) {
					finData.value = +finData.value;
					chartLabels.push( finData.year );
					chartDatasetValues.push( finData.value.toFixed( 2 ) );
				}
				
				if ( chartFor == 'chartForParent' ) {

					chartDataset = {
						label: 'Parent Company',
						data: chartDatasetValues,
						backgroundColor: '#1f4286',
						borderColor: '#1f4286',
						fill: false
					}
					
					this.sustainabilityIndexChartDatasets[ dataSet ] = {
						labels: chartLabels,
						datasets: [
							chartDataset
						]
					}

				} else {
					
					chartDataset = {
						label: 'Related Company',
						data: chartDatasetValues,
						backgroundColor: '#00B4D8',
						borderColor: '#00B4D8',
						fill: false
					}
					
					this.sustainabilityIndexChartDatasets[ dataSet ].datasets.length = 1;

					const storeParenDatasets = JSON.stringify( this.sustainabilityIndexChartDatasets[ dataSet ].datasets[0] );

					this.sustainabilityIndexChartDatasets[ dataSet ].datasets = [];

					setTimeout(() => {
						this.sustainabilityIndexChartDatasets[ dataSet ].datasets.push( JSON.parse( storeParenDatasets ) );
						this.sustainabilityIndexChartDatasets[ dataSet ].datasets.push( chartDataset );
					}, 0);

				}

			}

		}
		
		this.sharedLoaderService.hideLoader();

	}

	preventDefaultSort() {
		return 0;
	}

}
