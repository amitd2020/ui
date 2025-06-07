import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, tap, catchError, throwError, take } from 'rxjs';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { DataCommunicatorService } from '../../data-communicator.service';

interface City {
	name: string,
	code: string
}

@Component({
	selector: 'dg-buyer',
	templateUrl: './buyer.component.html',
	styleUrls: ['./buyer.component.scss'],
})
export class BuyerComponent implements OnInit {

    constructor(
		private serverCommunicationService: ServerCommunicationService,
		private activateRouter: ActivatedRoute,
		private dataCommunicatorService: DataCommunicatorService,
	) {}

	tempData: object = {};
	optionForLineGraph: object = {};
	paymentsColumn: any[] = [];
	paymentsData: any[] = [];
	totalSearchCount: number;
	rows: number = 25;
	first: number = 0;
	yearDropdownHandler: Object = { key: 'year', option: [], selectionModel: "2024", header: 'Year' };
	monthDropdownHandler: Object = { key: 'month', option: [], selectionModel: [], header: 'Month' };
	activeCompany: string;
	summaryDataRes: any;

    ngOnInit() {
        
        this.optionForLineGraph = {

			title: {
				show: true,
				text: 'Spending Trends Over Time',
				textStyle: {
				  color: '#333',
				  fontStyle: 'normal',
				  fontWeight: 'bold',
				//   fontFamily: 'monospace',
				},
				subtext: '',
				subtextStyle: {
					fontWeight: 400,
					fontSize: 9
				},
				itemGap: 4

			},

			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					lineStyle: { color: '#ccc', width: 1, type: 'solid' },
					crossStyle: { color: '#2885BA' },
					shadowStyle: { color: 'rgba(0, 0, 0, 0.1)' },
				},
				formatter: function (params) {
					let result = params[0].name + '<br />';
					result +=
						'<strong>Total Spend:</strong> ' +
						params[0].value.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
					return result;
				},
			},

			toolbox: {
				feature: {
					dataView: {
						show: true,
						readOnly: true,
						title: 'Data View',
						lang: [ 'Data View', 'Close' ],
						optionToContent: function (opt) {
							const headers = ['Payment Date', 'Total Spend (£)'];
							const seriesData = opt.series[0].data;
							const xAxisData = opt.xAxis[0].data;

							let tableContent = `
                      <table style="width: 100%; border: 1px solid #ccc; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; margin-top: 10px;">
                        <thead>
                          <tr style="background-color: #f0f0f0; text-align: center; font-weight: bold;">
                    `;

							headers.forEach(header => {
								tableContent += `<th style="padding: 10px; border: 1px solid #ccc;">${header}</th>`;
							});

							tableContent += `</tr></thead><tbody>`;

							for (let i = 0; i < seriesData.length; i++) {
								const rowColor = i % 2 === 0 ? '#fff' : '#f9f9f9';
								tableContent += `
                        <tr style="background-color: ${rowColor}; text-align: center;">
                          <td style="padding: 8px; border: 1px solid #ccc;">${xAxisData[i]}</td>
                          <td style="padding: 8px; border: 1px solid #ccc;">£${seriesData[i].toLocaleString('en-GB')}</td>
                        </tr>
                      `;
							}

							tableContent += `</tbody></table>`;
							return tableContent;
						},
					},
					magicType: { show: true, type: ['line', 'bar'] },
					restore: { show: true },
					saveAsImage: { show: true },
				},
			},

			xAxis: {
				type: 'category',
				name: 'Payment Month',
				nameLocation: 'middle',
				nameTextStyle: { fontSize: 12, padding: 20 },
				data: [],
			},

            yAxis: {
              name: 'Total Spend (£)',
              nameLocation: 'middle',
              nameRotate: 90,
              nameTextStyle: { fontSize: 12, padding: 80 },
              axisLabel: { formatter: '£{value}' },
              splitLine: { lineStyle: { type: 'dashed', color: '#ccc' } },
            },

            series: [
              {
                data: [],
                type: 'line',
                smooth: true,
                lineStyle: { width: 2 },
                symbolSize: 6,
                symbol: 'emptyCircle'
              },
            ],
        };
		const { companyNo } = this.activateRouter?.snapshot?.params;
		this.activeCompany = companyNo;

		if ( !this.activeCompany ) {
			this.dataCommunicatorService.$dataCommunicatorVar.subscribe((res: any) => {
				this.activeCompany = res.companyRegistrationNumber;
			});
		}


		this.paymentsColumn = [
			{ field: 'department', header: 'Department', minWidth: '220px', maxWidth: '220px', textAlign: 'left', value: true },
			{ field: 'entity', header: 'Entity', minWidth: '160px', maxWidth: '160px', textAlign: 'left', value: true },
			{ field: 'paymentDate', header: 'Payment Date', minWidth: '150px', maxWidth: '150', textAlign: 'center', value: true },
			{ field: 'expenseType', header: 'Expense Type', minWidth: '180px', maxWidth: '180px', textAlign: 'left', value: true },
			{ field: 'expenseArea', header: 'Expense Area', minWidth: '200px', maxWidth: '200px', textAlign: 'left', value: true },
			{ field: 'supplierName', header: 'Supplier Name', minWidth: '190px', maxWidth: '190px', textAlign: 'left', value: true },
			{ field: 'supplierSitePostCode', header: 'Supplier Site PostCode', minWidth: '170px', maxWidth: '170px', textAlign: 'left', value: true },
			{ field: 'transactionNumber', header: 'Transaction Number', minWidth: '150px', maxWidth: '150px', textAlign: 'right', value: true },
			{ field: 'paymentDescription', header: 'Payment Description', minWidth: '200px', maxWidth: '200px', textAlign: 'left', value: true },
			{ field: 'total', header: 'Total', minWidth: '130px', maxWidth: '130px', textAlign: 'right', value: true }
		];

		this.getMonthYearData()
		this.extractDataFromAPI()
	}

	getMonthYearData() {
		let payloadForDropdown = { companyNumber: this.activeCompany }

		this.serverCommunicationService
		.globalServerRequestCall( 'post', 'DG_GOVTENABLER_API', 'getAllMonthYearForMOD', payloadForDropdown )
		.pipe(

			map( (response) => {
				if ( response?.status == 200 ) {
					return response.body;
				}
			} ),

			tap( ( { yearDropdown, monthDropdown } ) => {
				this.yearDropdownHandler['option'] = yearDropdown;
				this.monthDropdownHandler['option'] = monthDropdown;
			} ),

			catchError( err => {
				return throwError(() => err);
			} )
		)
		.subscribe({
			next: () => console.log('dropdown successfully'),
			error: (err) => console.error('Error Handler:', err),
		});
	}

	extractDataFromAPI() {

		if (  !this.yearDropdownHandler['selectionModel'].length ) {
			this.yearDropdownHandler['selectionModel'] = '2024';
		}

		let tempPayload = {
			"filterData": [
				{
					"chip_group": "Company Number",
					"label": "Company Number",
					"chip_values": [this.activeCompany]
				},
				{
					"chip_group": "MOD Year",
					"label": "Year",
					"chip_values":[ this.yearDropdownHandler['selectionModel']]
				}
				
			],
			"pageSize": this.rows ? this.rows : 25,
			"startAfter": this.first ? this.first : 0
		}

		if ( this.monthDropdownHandler['selectionModel'].length ) {
			tempPayload['filterData'].push({
				"chip_group": "MOD Month",
				"label": "Month",
				"chip_values": this.monthDropdownHandler['selectionModel']
			})
		}

		this.serverCommunicationService
			.globalServerRequestCall('post', 'DG_GOVTENABLER_API', 'modPaymentInfo', tempPayload)
			.pipe(

				map((response) => {
					if (response?.status == 200) {
						return response.body.results;
					}
				}),

			tap( ( { summaryCradData, tableData, totalResults, graphData } ) => {
				this.preparedSummaryCardData(summaryCradData);
				this.preparedTableData(tableData, totalResults);
				this.preparedGraphData( graphData );
			} ),

				catchError(err => {
					return throwError(() => err);
				})
			)
			.subscribe({
				next: () => console.log('completed successfully'),
				error: (err) => console.error('Error Handler:', err),
			});

	};

	preparedGraphData(graphDataArray: Array<any>) {

		let xAxisData = [], seriesData = [];

		if (graphDataArray && graphDataArray.length) {
			graphDataArray.forEach(item => {
				xAxisData.push(item.label);
				seriesData.push(item.count);
			})
		}

		this.optionForLineGraph['xAxis']['data'] = xAxisData;
		this.optionForLineGraph['series'][0]['data'] = seriesData;

		this.optionForLineGraph = { ...this.optionForLineGraph };

	};

	preparedMonthDropdownData(monthData?: Array<any>) { };

	preparedYearDropdownData(yearData?: Array<any>) { };

	preparedSummaryCardData(summaryData?: Array<any>) {

		this.summaryDataRes = summaryData.map( item => {
			if ( item?.percentageChangeInfo ) {
				let percentageDataForTotalSpend = item.percentageChangeInfo.find( val => val.year == this.yearDropdownHandler['selectionModel'] );
				item = { ...item, ...percentageDataForTotalSpend };
			}
			return item;
		} )

	};

	preparedTableData(tableData?: Array<any>, totalResults?: number) {
		this.paymentsData = tableData ?? [];
		this.totalSearchCount = totalResults;
	};

	updateTableAfterPagination(event) {
		this.first = event.startAfter ? event.startAfter : 0;
		this.rows = event.pageSize ? event.pageSize : 25;

		// this.sort = event.sortOn ? event.sortOn : [];
		// this.filterSearchArray = event.filterSearchArray ? event.filterSearchArray : [];

		this.extractDataFromAPI();
	}

	clickOnDropdown( ) {
		this.extractDataFromAPI();
	}
}