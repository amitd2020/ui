import { Component, OnInit } from '@angular/core';
import { mapData } from '../stats-analysis/map-analysis/map-constant.index';
import { NumberSuffixPipe } from '../interface/custom-pipes/number-suffix/number-suffix.pipe';
import { ServerCommunicationService } from '../interface/service/server-communication.service';
import { CurrencyPipe } from '@angular/common';
import { Message } from 'primeng/api';
import { SharedLoaderService } from '../interface/view/shared-components/shared-loader/shared-loader.service';
interface TrendsType {
    key: string;
    data: object;
    options: object;
	label: string
}
@Component({
    selector: 'dg-stats-dashboard',
    templateUrl: './stats-dashboard.component.html',
    styleUrls: ['./stats-dashboard.component.scss'],
})
export class StatsDashboardComponent implements OnInit {
    // mapDataObj = mapData;

    employessTrends: any[] = [];
    turnoverTrends: any[] = [];
    newCompanyRegisteredTrends: any[] = [];

    graphTrendsHandler: { employees?: TrendsType; turnover?: TrendsType; newCompany: TrendsType; } = {
        employees: { key: 'yearly_employees', data: {}, options: {}, label: 'Employees' },
        turnover: { key: 'yearly_turnover', data: {}, options: {}, label: 'Turnover' },
        newCompany: { key: 'yearly_new_registered_company', data: {},options: {}, label: 'New Company Registered' },
    };

	graphOptions: object = {};
	mapDataObj: object = {};
	messages: Message[] | undefined;
	selectedFilter: any;

	constructor(
		private toNumberSuffix: NumberSuffixPipe,
		private serverCommunicationService: ServerCommunicationService,
		public toCurrencyPipe: CurrencyPipe,
		private sharedLoaderService: SharedLoaderService
	) {}

    ngOnInit() {

		this.graphOptions = {
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
                    display: true,
					labels: {
						font: {
							family: 'Roboto'
						},
						padding: 15,
						fill: true,
						color: '#4e5fbb',
						usePointStyle: true,
						pointStyle: 'rectRot'
					},
                },
				title: {
					fontFamily: 'Roboto',
				},
				tooltip: {
					enabled: true,
					titleFontFamily: 'Roboto',
					bodyFontFamily: 'Roboto',
					callbacks: {
						label: ( tooltipItem ) => {
							if ( tooltipItem?.dataset?.label != 'New Company Registered' ) {
								return ` Total ${ tooltipItem?.dataset?.label }: ${ this.toNumberSuffix.transform(tooltipItem.raw.sum, 2) } | Total Company: ${ this.toNumberSuffix.transform(tooltipItem.raw.companyCount, 2) } | Avg ${ tooltipItem?.dataset?.label }: ${ this.toNumberSuffix.transform( parseFloat( (tooltipItem.formattedValue).replace(/,/g, '') ), 2 ) }`;
							} else {
								return `${ tooltipItem?.dataset?.label }: ${ this.toNumberSuffix.transform( parseFloat( (tooltipItem.formattedValue).replace(/,/g, '') ), 2 ) }`;
							}
						}
					}
				},
				subtitle: {
					display: false,
					text: 'Custom Chart Subtitle'
				}
			}
		}

		this.graphOptions['plugins'].datalabels = {
			display: false,
			align: 'end',
			anchor: 'end',
			offset: 5,
			color: '#fff',
			font: { size: 10 },
			borderRadius: 3,
			padding: { top: 2, right: 5, bottom: 1, left: 5 },
			backgroundColor: '#6aa84f',
			formatter: ( value, context ) => {
				if ( context?.dataset?.label != 'New Company Registered' ) {
					return ` Total ${ context?.dataset?.label }: ${ this.toNumberSuffix.transform(value.sum, 2) } | Total Company: ${ this.toNumberSuffix.transform( value.companyCount, 2 ) } | Avg ${ context?.dataset?.label }: ${ this.toNumberSuffix.transform( value.y, 2 ) }`;
				} else {
					return `${ context?.dataset?.label }: ${ this.toNumberSuffix.transform( value.y ),2 }`;
				}
			}
		}

		let payload = {
			"filterData": [
                {
                  "chip_group": "Status",
                  "chip_values": [
                    "live"
                  ]
                },
				{chip_group: "Region", chip_values: ["london"]}
              ]
		}

		this.getDataForStats( payload )
    }

    preparedTrendsData() {

        for (const parentKey in this.graphTrendsHandler) {
            this.preparedDatasetForGraph( this.mapDataObj[this.graphTrendsHandler[parentKey]['key']], this.graphTrendsHandler[parentKey], parentKey );
        }

    }

    preparedDatasetForGraph( dataArray: any[], itemObj: TrendsType, parentKey? ) {

		let tempObj = {};
		tempObj = JSON.parse(JSON.stringify( itemObj ));
		this.graphTrendsHandler[parentKey] = {};

		tempObj['data']['labels'] = [];
		tempObj['data']['datasets'] = [
			{
				label: tempObj['label'],
				data: [],
				fill: true,
				borderColor: '#4e5fbb',
				backgroundColor: 'rgb(237, 239, 248, 0.5)',
				tension: 0.3,
				pointStyle: 'rectRot',
				pointBorderWidth: 1,
				pointBackgroundColor: '#CCCC00',
				pointRadius: 5,
			}
		];
		tempObj['options'] = this.graphOptions;
		
		dataArray.map( val => {
			tempObj['data']['labels'].push( val.year );
			tempObj['data']['datasets'][0]['data'].push( {
				x: val.year, 
				y: val.count ?? val.avg,
				companyCount: val?.companyCount,
				sum: val?.sum
			  } );
		} )

		this.graphTrendsHandler[parentKey] = { ...itemObj, ...tempObj };
	}

	getPayloadFromChild( payload: object ) {

		if ( payload['filterData'].length < 2 ) {
			this.messages = [];
			this.messages = [{ severity: 'info', summary: 'info', detail: 'Please specify at least one filter to see the content. The current view reflects the results of your previous search' }];
			setTimeout( () => {
				this.messages = [];
			}, 4000 )
			return;
		}


		this.getDataForStats( payload )
	}

	getDataForStats( payload ) {
		this.sharedLoaderService.showLoader()
		this.selectedFilter =  payload?.filterData
		this.serverCommunicationService.globalServerRequestCall( 'post', 'DG_CHART_API', 'getStatsDataNew', payload ).subscribe({
			next: ( res ) => {
				this.mapDataObj = res?.body?.result;
				this.preparedTrendsData();
				setTimeout( () => {
					this.sharedLoaderService.hideLoader();
				}, 1000 )
			},
			
			error: ( err ) => {
				console.log( err )
				this.sharedLoaderService.hideLoader();
			}
		})
	}
}
