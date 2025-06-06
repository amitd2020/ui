import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/api';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { ListPageName } from 'src/app/interface/view/features-modules/search-company/search-company.constant';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { CommanStatsClickService } from 'src/app/interface/view/shared-components/stats-insights/comman-stats-click.service';

interface TrendsType {
    key: string;
    data: object;
    options: object;
	label: string
}


@Component({
    selector: 'dg-growth-analysis',
    templateUrl: './growth-analysis.component.html',
    styleUrls: ['./growth-analysis.component.scss'],
})
export class GrowthAnalysisComponent implements OnInit {

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

	
	queryParamChipData: FilterDataTypes[] = [];
	listId: string;
	inputPageName: string = '';
	outputPageName: string = '';
	listName: string;
	statsCriteriaValues: Array<any> = [];
	userId: string | unknown;
	globalFilterDataObject: any = {
		listId: '',
		pageName: '',
		listPageName: '',
		diversityCalculationPage: false
	};


    constructor(
        private toNumberSuffix: NumberSuffixPipe,
        private serverCommunicationService: ServerCommunicationService,
        public toCurrencyPipe: CurrencyPipe,
		public activeRoute: ActivatedRoute,
        public userAuthService: UserAuthService,
		public commanStatsClickService: CommanStatsClickService,
		private sharedLoaderService: SharedLoaderService
    ) {}

	ngOnInit() {


		this.queryParamChipData = this.activeRoute?.snapshot?.queryParams?.['chipData'] ? JSON.parse( this.activeRoute?.snapshot?.queryParams?.['chipData'] ) : [];
		this.listId = this.activeRoute?.snapshot?.queryParams['cListId'] != undefined ? this.activeRoute?.snapshot?.queryParams['cListId'] : '';
		this.inputPageName = this.activeRoute?.snapshot?.queryParams['listPageName'] ? this.activeRoute?.snapshot?.queryParams['listPageName'] : '';
		this.listName = this.activeRoute?.snapshot?.queryParams['listName'] ? this.activeRoute?.snapshot?.queryParams['listName'] : '';
		this.globalFilterDataObject = {
			listId: this.listId,
			listName: this.listName,
			listPageName: this.inputPageName,
			diversityCalculationPage: this.activeRoute?.snapshot?.queryParams['diversityCalculationPage'] ? this.activeRoute?.snapshot?.queryParams['diversityCalculationPage'] : false
		}

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

		this.outputPageName = this.commanStatsClickService.getOutputPage( this.inputPageName.toLowerCase() );
	
		if ( this.queryParamChipData.length ) {
			this.statsCriteriaValues = this.formatChipValuesDisplay( this.queryParamChipData );
		} else {
			this.queryParamChipData = []
		}

		if( this.inputPageName == 'companyListPage' ) {		
			this.userId = '';
		} 
		else {
			this.userId = this.userAuthService?.getUserInfo('dbID');
		}

		let obj = {
			
			'filterData': [ ...this.queryParamChipData ],
			'pageSize':  25,
			'startAfter':  0,
			'sortOn':  [],
			'filterSearchArray': [],
			'dissolvedIndex':  false,
			'startPlan': false,
			'listId': this.listId,
			'pageName': this.outputPageName,
			'userId': this.userId != undefined ? this.userId : ""
		}

		this.getDataForStats( obj )
	}

	preparedTrendsData() {

        for (const parentKey in this.graphTrendsHandler) {
            this.preparedDatasetForGraph( this.mapDataObj[this.graphTrendsHandler[parentKey]['key']], this.graphTrendsHandler[parentKey], parentKey );
        }

    }

	formatChipValuesDisplay( statsCriteriaChips: Array<any> ) {

		return statsCriteriaChips;
		
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
		this.sharedLoaderService.showLoader();
		this.selectedFilter =  payload?.filterData;
		this.serverCommunicationService.globalServerRequestCall( 'post', 'DG_CHART_API', 'getStatsDataNew', payload ).subscribe({
			next: ( res ) => {
				this.mapDataObj = res?.body?.result;
				this.preparedTrendsData();
				this.sharedLoaderService.hideLoader();
			},
			
			error: ( err ) => {
				console.log( err )
				this.sharedLoaderService.hideLoader();
			}
		})
	}
}
