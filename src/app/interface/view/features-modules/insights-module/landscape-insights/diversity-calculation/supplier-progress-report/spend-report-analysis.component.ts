import { Component, ElementRef, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { MakePdfService } from 'src/app/shared-pdf-report/make-pdf.service';

@Component({
    selector: 'dg-spend-report-analysis',
    templateUrl: './spend-report-analysis.component.html',
    styleUrls: ['./spend-report-analysis.component.scss'],
})
export class SpendReportAnalysisComponent implements OnInit, OnChanges {

    @ViewChildren('chartContainer', { read: ElementRef }) chartContainers!: QueryList<ElementRef>;
    chartImages: object = [];
    chartsLoaded: boolean = true;
    pdfScreen: boolean = false;

    @Input() dataFromApi: any = {};
    optionForOverviewDoughnut: object = {};
    roseGraphMSME: object = {};
    optionForPieDiverse: object = {};
    optionForBarGraph: object = {};
    diverseColorObj: object =  {
		isEthnicOwnership: { bgColor: '#662e9b', header: 'Ethnic Minority Business' },
		femaleOwned: { bgColor: '#eb3b5a', header: 'Female Owned Business' },
		isMilitaryVeteran: { bgColor: '#23c3b5', header: 'Military Veterans' },
		isNetZeroTarget: { bgColor: '#3cd5ff', header: 'Net-Zero Target' },
		isBcorpCertification: { bgColor: '#91c73e', header: 'B Corp Certified Business' },
		isVcseCategory: { bgColor: '#47a5dc', header: 'VCSE Category' },
        isPpcCategory: { bgColor: '#6574c4', header: 'Prompt Payment Code' },
        micro: { bgColor: '#59ba9b', header: 'Micro' },
        small: { bgColor: '#ffcc00', header: 'Small' },
        medium: { bgColor: '#ee9512', header: 'Medium' },
        largeEnterprise: { bgColor: '#e1b12c', header: 'Large Enterprise' },
        unknown: { bgColor: '#aabbcc', header: 'Unknown' },
	};

	graphForDiverse: object = {
		ownership_diverse: { data: [], graphTitle: 'Segmentation By Ownership', itemArray: [ 'isEthnicOwnership', 'femaleOwned', 'isMilitaryVeteran' ] },
		mission_diverse: { data: [], graphTitle: 'Mission Spectrum', itemArray: [ 'isNetZeroTarget', 'isBcorpCertification', 'isVcseCategory', 'isPpcCategory' ] },
		msme_diverse: { data: [], graphTitle: 'MSME Distribution', itemArray: [ 'micro', 'small','medium', 'largeEnterprise', 'unknown' ] }
	}
	graphForDiverseTemp: object = {
		ownership_diverse: { data: [], graphTitle: 'Segmentation By Ownership', itemArray: [ 'isEthnicOwnership', 'femaleOwned', 'isMilitaryVeteran', 'isNetZeroTarget', 'isBcorpCertification', 'isVcseCategory', 'isPpcCategory', 'micro', 'small','medium', 'largeEnterprise', 'unknown' ] }
	}
	barGraphForDiverse: object = {};
    dataHandler: object = {};

    buttons = [
        { label: 'Segmentation By Ownership', key: 'ownership_diverse' },
        { label: 'Mission Spectrum', key: 'mission_diverse' },
    ];
    spendBreakDown: any[] = [
        { key: 'ownershipDiverseOverview', header: 'Segmentation By Ownership', class: 'text-teal-600' },
        { key: 'missionDiverseOverview', header: 'Mission Spectrum', class: 'text-indigo-600' },
    ]

	activeButtonKey: string =  'ownership_diverse';

    pieGraphForOwnershipDiverse: object = {};
    pieGraphForMissionDiverse: object = {};
    pieGraphForMSMEDiverse: object = {};

    constructor(
        private sharedLoaderService: SharedLoaderService,
        private makePdfService: MakePdfService
    ) {}

    ngOnInit() {
        // this.fetchDataFromDb();
    }

    ngAfterViewInit() {
        this.sharedLoaderService.showLoader();
        setTimeout(() => {
          this.captureCharts();
        }, 3000);
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.fetchDataFromDb();
    }

    fetchDataFromDb() {
        // this.dataHandler = this.dataFromApi;
        this.dataHandler = {
            "isEthnicOwnership": [
                {
                    "key": "2021",
                    "value": 11316208.870000001,
                    "percentage": null,
                    "type": "equal"
                },
                {
                    "key": "2022",
                    "value": 6897110.4,
                    "percentage": 39.05,
                    "type": "decrease"
                },
                {
                    "key": "2023",
                    "value": 7110918.630000001,
                    "percentage": 3.1,
                    "type": "increase"
                },
                {
                    "key": "total",
                    "value": 25324237.9,
                    "percentage": null,
                    "type": null
                }
            ],
            "femaleOwned": [
                {
                    "key": "2021",
                    "value": 17221421.49,
                    "percentage": null,
                    "type": "equal"
                },
                {
                    "key": "2022",
                    "value": 11257106.929999998,
                    "percentage": 34.63,
                    "type": "decrease"
                },
                {
                    "key": "2023",
                    "value": 18743687.52,
                    "percentage": 66.51,
                    "type": "increase"
                },
                {
                    "key": "total",
                    "value": 47222215.93999999,
                    "percentage": null,
                    "type": null
                }
            ],
            "isBcorpCertification": [
                {
                    "key": "2021",
                    "value": 8943531,
                    "percentage": null,
                    "type": "equal"
                },
                {
                    "key": "2022",
                    "value": 10870463.39,
                    "percentage": 21.55,
                    "type": "increase"
                },
                {
                    "key": "2023",
                    "value": 6263324.28,
                    "percentage": 42.38,
                    "type": "decrease"
                },
                {
                    "key": "total",
                    "value": 26077318.669999998,
                    "percentage": null,
                    "type": null
                }
            ],
            "isNetZeroTarget": [
                {
                    "key": "2021",
                    "value": 56877556.93999999,
                    "percentage": null,
                    "type": "equal"
                },
                {
                    "key": "2022",
                    "value": 4389269.12,
                    "percentage": 92.28,
                    "type": "decrease"
                },
                {
                    "key": "2023",
                    "value": 76813879.42999999,
                    "percentage": 1650.04,
                    "type": "increase"
                },
                {
                    "key": "total",
                    "value": 138080705.48999998,
                    "percentage": null,
                    "type": null
                }
            ],
            "isMilitaryVeteran": [
                {
                    "key": "2021",
                    "value": 74832,
                    "percentage": null,
                    "type": "equal"
                },
                {
                    "key": "2022",
                    "value": 0,
                    "percentage": 100,
                    "type": "decrease"
                },
                {
                    "key": "2023",
                    "value": 2293264,
                    "percentage": null,
                    "type": "equal"
                },
                {
                    "key": "total",
                    "value": 2368096,
                    "percentage": null,
                    "type": null
                }
            ],
            "isVcseCategory": [
                {
                    "key": "2021",
                    "value": 25295509.04,
                    "percentage": null,
                    "type": "equal"
                },
                {
                    "key": "2022",
                    "value": 9452076.85,
                    "percentage": 62.63,
                    "type": "decrease"
                },
                {
                    "key": "2023",
                    "value": 59762455.31,
                    "percentage": 532.27,
                    "type": "increase"
                },
                {
                    "key": "total",
                    "value": 94510041.19999997,
                    "percentage": null,
                    "type": null
                }
            ],
            "isPpcCategory": [
                {
                    "key": "2021",
                    "value": 50594160.7,
                    "percentage": null,
                    "type": "equal"
                },
                {
                    "key": "2022",
                    "value": 23800954.12,
                    "percentage": 52.96,
                    "type": "decrease"
                },
                {
                    "key": "2023",
                    "value": 19357002.92,
                    "percentage": 18.67,
                    "type": "decrease"
                },
                {
                    "key": "total",
                    "value": 93752117.73999998,
                    "percentage": null,
                    "type": null
                }
            ],
            "micro": [
                {
                    "key": "2021",
                    "value": 259043739.03000015,
                    "percentage": null,
                    "type": "equal"
                },
                {
                    "key": "2022",
                    "value": 158036567.01000002,
                    "percentage": 38.99,
                    "type": "decrease"
                },
                {
                    "key": "2023",
                    "value": 259675688.34000012,
                    "percentage": 64.31,
                    "type": "increase"
                },
                {
                    "key": "total",
                    "value": 676755994.38,
                    "percentage": null,
                    "type": null
                }
            ],
            "small": [
                {
                    "key": "2021",
                    "value": 337171860.49,
                    "percentage": null,
                    "type": "equal"
                },
                {
                    "key": "2022",
                    "value": 205276337.00999996,
                    "percentage": 39.12,
                    "type": "decrease"
                },
                {
                    "key": "2023",
                    "value": 363091421.8299999,
                    "percentage": 76.88,
                    "type": "increase"
                },
                {
                    "key": "total",
                    "value": 905539619.3300005,
                    "percentage": null,
                    "type": null
                }
            ],
            "medium": [
                {
                    "key": "2021",
                    "value": 225096050.41000003,
                    "percentage": null,
                    "type": "equal"
                },
                {
                    "key": "2022",
                    "value": 133676749.86000001,
                    "percentage": 40.61,
                    "type": "decrease"
                },
                {
                    "key": "2023",
                    "value": 329112020.43999994,
                    "percentage": 146.2,
                    "type": "increase"
                },
                {
                    "key": "total",
                    "value": 687884820.7099999,
                    "percentage": null,
                    "type": null
                }
            ],
            "largeEnterprise": [
                {
                    "key": "2021",
                    "value": 498616894.0899999,
                    "percentage": null,
                    "type": "equal"
                },
                {
                    "key": "2022",
                    "value": 408139453.04999995,
                    "percentage": 18.15,
                    "type": "decrease"
                },
                {
                    "key": "2023",
                    "value": 327787121.35,
                    "percentage": 19.69,
                    "type": "decrease"
                },
                {
                    "key": "total",
                    "value": 1234543468.4900002,
                    "percentage": null,
                    "type": null
                }
            ],
            "unknown": [
                {
                    "key": "2021",
                    "value": 47920498.919999994,
                    "percentage": null,
                    "type": "equal"
                },
                {
                    "key": "2022",
                    "value": 43150896.94,
                    "percentage": 9.95,
                    "type": "decrease"
                },
                {
                    "key": "2023",
                    "value": 8472177.87,
                    "percentage": 80.37,
                    "type": "decrease"
                },
                {
                    "key": "total",
                    "value": 99543573.72999999,
                    "percentage": null,
                    "type": null
                }
            ],
            "totalSpends": [
                {
                    "key": "2021",
                    "value": 1538172262.9800003,
                    "percentage": null,
                    "type": "equal"
                },
                {
                    "key": "2022",
                    "value": 1014946984.6800001,
                    "percentage": 34.02,
                    "type": "decrease"
                },
                {
                    "key": "2023",
                    "value": 1478482961.9199996,
                    "percentage": 45.67,
                    "type": "increase"
                },
                {
                    "key": "total",
                    "value": 4031602209.580001,
                    "percentage": null,
                    "type": null
                }
            ],
            "msmeCategory": [
                {
                    "key": "Micro",
                    "value": 676755994.38,
                    "percentage": null,
                    "type": "equal"
                },
                {
                    "key": "Small",
                    "value": 905539619.3300005,
                    "percentage": 33.81,
                    "type": "increase"
                },
                {
                    "key": "Medium",
                    "value": 687884820.7099999,
                    "percentage": 24.04,
                    "type": "decrease"
                },
                {
                    "key": "Large Enterprise",
                    "value": 1234543468.4900002,
                    "percentage": 79.47,
                    "type": "increase"
                },
                {
                    "key": "Unknown",
                    "value": 99543573.72999999,
                    "percentage": 91.94,
                    "type": "decrease"
                }
            ],
            "missionDiverseOverview": [
                {
                    "key": "Mission Specturm",
                    "total": 352420183.0999999,
                    "percentage": 8.74144235417298
                }
            ],
            "ownershipDiverseOverview": [
                {
                    "key": "Segmentation by ownership",
                    "total": 74914549.83999999,
                    "percentage": 1.8581830732701266
                }
            ]
        };

        let dataForOverview = this.preparedDataForGraph( ['ownershipDiverseOverview', 'missionDiverseOverview'], this.dataHandler );

        this.graphForDiverse['ownership_diverse']['data'] = this.preparedDataForGraph( this.graphForDiverse['ownership_diverse']['itemArray'], this.dataHandler, true );
        this.graphForDiverse['mission_diverse']['data'] = this.preparedDataForGraph(  this.graphForDiverse['mission_diverse']['itemArray'], this.dataHandler, true );
        this.graphForDiverse['msme_diverse']['data'] = this.preparedDataForGraph(  this.graphForDiverse['msme_diverse']['itemArray'], this.dataHandler, true );

        //this code related to pdf only
        this.dataHandler['ownership_diverse_key'] = this.graphForDiverse['ownership_diverse']['data'];
        this.dataHandler['mission_diverse_key'] = this.graphForDiverse['mission_diverse']['data'];

		this.graphForDiverse['ownership_diverse']['itemArray'].map( item => {
			let storeData = this.preparedDataForGraph( [item], this.dataHandler, false );
			this.preparedGraphForBar( storeData, item );

		} )
		this.graphForDiverse['mission_diverse']['itemArray'].map( item => {
			let storeData = this.preparedDataForGraph( [item], this.dataHandler, false );
			this.preparedGraphForBar( storeData, item );

		} )

		this.graphForDiverse['msme_diverse']['itemArray'].map( item => {
			let storeData = this.preparedDataForGraph( [item], this.dataHandler, false );
			this.preparedGraphForBar( storeData, item );

		} )


        this.graphForOverviewDiverse(dataForOverview);
        if(this.dataHandler['msmeCategory'] && this.dataHandler['msmeCategory'].length) this.graphForMSME(this.dataHandler['msmeCategory']);
        this.graphForDiverseKey( this.graphForDiverse[this.activeButtonKey]['data'] );

        this.pieGraphForOwnershipDiverse = this.graphForDiverseKeyPdf( this.graphForDiverse['ownership_diverse']['data'], this.graphForDiverse['ownership_diverse']['graphTitle'] )
        this.pieGraphForMissionDiverse = this.graphForDiverseKeyPdf( this.graphForDiverse['mission_diverse']['data'], this.graphForDiverse['mission_diverse']['graphTitle'] )
        this.pieGraphForMSMEDiverse = this.graphForDiverseKeyPdf( this.graphForDiverse['msme_diverse']['data'], this.graphForDiverse['msme_diverse']['graphTitle'] )

    }

    viewAnalytics( item ) {
        this.activeButtonKey = item['key'];
		this.graphForDiverseKey( this.graphForDiverse[this.activeButtonKey]['data'] );
    }

    captureCharts() {
        this.chartImages = {};
        this.chartContainers.forEach((chartElem, index) => {
          const canvas = chartElem?.nativeElement?.querySelector('canvas');
          const storeId = chartElem?.nativeElement?.id;
          if (canvas) {
            const dataUrl = canvas.toDataURL('image/png');
            this.chartImages[storeId] = dataUrl;
          } else {
            console.warn(`Canvas not found for chart ${index + 1}`);
          }
        });
        this.makePdfService.updateGraph( this.chartImages );
        this.chartsLoaded = false;
        this.pdfScreen = true;
        this.sharedLoaderService.hideLoader();
    }

    
    graphForOverviewDiverse( dataArray: any[] ) {
        let color = {
            'Mission Spectrum': '#5470C6',
            'Segmentation By Ownership': '#91CC75',
        };

        const chartData = dataArray.map((item) => ({
            value: item['value'] || item['total'],
            name: item['key'],
            itemStyle: { color: color[item['key']] },
        }));

        this.optionForOverviewDoughnut = {
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                	let result = params.name + '<br />';
					result +=
						'<strong>Spend:</strong> ' +
						params.value.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
					return result;
                }
            },
            toolbox: {
                show: true,
                left: '95%',
                top: '-1%',
                feature: {
                    mark: { show: true },
                    saveAsImage: { show: true },
                },
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                // left: 'right',
                right: 20,
                top: 'center',
                itemGap: 10,
            },
            series: [
                {
                    //   name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '80%'],
                    avoidLabelOverlap: false,
                    padAngle: 5,
                    itemStyle: {
                        borderRadius: 10,
                    },
                    label: {
                        show: true,
                        position: 'outside',
                        formatter: '{b}: ({d}%)',
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontWeight: 'bold',
                        },
                    },
                    labelLine: {
                        show: true,
                    },
                    data: chartData,
                },
            ],
            grid: {
                top: '0%',
                bottom: '0%',
                left: '0%',
                right: '0%',
            }
        };
    }
    graphForMSME( dataArray: any[] ) {
        const msmeStatusColor = {
            Micro: '#59ba9b',
            Small: '#ffcc00',
            Medium: '#ee9512',
            'Large Enterprise': '#e1b12c',
            Unknown: '#aabbcc',
        };

        const chartData = dataArray.map((item) => ({
            value: item['value'],
            name: item['key'],
            itemStyle: { color: msmeStatusColor[item['key']] },
        }));

        this.roseGraphMSME = this.preparedGraphPieAndRose(chartData, true);
    }
    graphForDiverseKey( dataArray: any[] ) {

        const chartData = dataArray.map((item) => ({
            value: item['value'],
            name: this.diverseColorObj[item['key']] ? this.diverseColorObj[item['key']]['header'] : item['key'],
            itemStyle: { color: this.diverseColorObj[ item['key']]['bgColor'] },
        }));

        this.optionForPieDiverse = this.preparedGraphPieAndRose(chartData, false, this.graphForDiverse[this.activeButtonKey]['graphTitle'] );
    }
    graphForDiverseKeyPdf( dataArray: any[], header? ) {

        const chartData = dataArray.map((item) => ({
            value: item['value'],
            name: this.diverseColorObj[item['key']] ? this.diverseColorObj[item['key']]['header'] : item['key'],
            itemStyle: { color: this.diverseColorObj[ item['key']]['bgColor'] },
        }));

        const graph = this.preparedGraphPiePdf(chartData, false, header );
        return graph;
    }
	preparedGraphForBar( dataArray: any[], key ) {

        const xAxisData = dataArray.map((item) => item.key);
        const yAxisData = dataArray.map((item) => Number(item.value));

        this.optionForBarGraph[key] = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: function (params) {
                	let result = params[0].name + '<br />';
					result +=
						'<strong>Spend:</strong> ' +
						params[0].value.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
					return result;
                }
            },
            grid: {
                left: '0%',
                right: '0%',
                top: '0%',
                bottom: '15%',
                containLabel: false,
            },
            xAxis: [
                {
                    type: 'category',
                    data: xAxisData,
                    axisTick: { alignWithLabel: true },
                },
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: { show: false },
                    splitLine: { show: false },
                },
            ],
            series: [
                {
                    name: 'Value',
                    type: 'bar',
                    barWidth: '30%',
                    data: yAxisData,
                },
            ],
        };
    }

    preparedGraphPieAndRose(data, isRoseChart: boolean = false, header: string = 'MSME Distribution' ) {
        let options = {
            title: {
                text: header,
                left: "3%",
                top: 'top',
                textStyle: {
                    fontSize: 14
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                // left: 'right',
                right: 20,
                top: 'bottom',
                itemGap: 10,
                itemWidth: 10,
            },
            toolbox: {
                left: '95%',
                top: '-1%',
                show: true,
                feature: {
                    mark: { show: true },
                    dataView: { show: false, readOnly: false },
                    saveAsImage: { show: true },
                },
            },
            series: [
                {
                    name: 'MSME Categories',
                    type: 'pie',
                    radius: isRoseChart ? [20, 90] : '80%',
                    center: ['50%', '50%'],
                    roseType: isRoseChart ? 'radius' : undefined,
                    itemStyle: {
                        borderRadius: isRoseChart ? 8 : 1,
                    },
                    label: {
                        show: true,
                        position: 'outside',
                        formatter: '{d}%',
                        // alignTo: 'labelLine',
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontWeight: 'bold',
                        },
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            const valueFormatted = new Intl.NumberFormat(
                                'en-GB',
                                {
                                    style: 'currency',
                                    currency: 'GBP',
                                    minimumFractionDigits: 0,
                                }
                            ).format(params.value);

                            return `${params.name}: ${valueFormatted}`;
                        },
                    },
                    data: data,
                },
            ],
        };

        return options;
    }

    preparedGraphPiePdf(data, isRoseChart: boolean = false, header: string = 'MSME Distribution' ) {
        let options = {
            // legend: {
            //     type: 'scroll',
            //     orient: 'vertical',
            //     right: 10,  // Reduced space on the right
            //     top: 'center',
            //     itemGap: 5,  // Decreased gap between legend items
            //     itemWidth: 8,  // Slightly wider for better visibility
            // },
            series: [
                {
                    name: 'MSME Categories',
                    type: 'pie',
                    radius: isRoseChart ? [25, 85] : '87%',
                    // center: ['35%', '50%'],
                    roseType: isRoseChart ? 'radius' : undefined,
                    itemStyle: {
                        borderRadius: isRoseChart ? 6 : 1,
                    },
                    label: {
                        show: true,
                        position: 'outside',
                        formatter: '{d}%',
                        distanceToLabelLine: 5, // Reduces space between label and line
                    },
                    data: data,
                },
            ],
        };

        return options;
    }

    preparedDataForGraph( fetchData: any[], totalStoreData: object, includeTotal: boolean = false ) {
        return fetchData.reduce((acc, key) => {
            if (totalStoreData[key]) {
                const filteredData = totalStoreData[key]
				.filter( ( item )  =>includeTotal ? item.key === 'total' : item.key !== 'total')
				.map( item => includeTotal ? { ...item, key: key } : item )
                return acc.concat(filteredData);
            }
            return acc;
        }, []);
    }
}
