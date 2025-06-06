import { CurrencyPipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { SearchCompanyService } from 'src/app/interface/view/features-modules/search-company/search-company.service';

@Component({
    selector: 'dg-shared-echart',
    templateUrl: './shared-echart.component.html',
    styleUrls: ['./shared-echart.component.scss'],
})
export class SharedEchartComponent implements OnInit, OnChanges {

	@Input() doughnutChartDatasets: object = {};
	@Input() dataForGraph: any[] = [];
	@Input() totalCount: number = null;
	@Input() thisPage = '';
	@Input() donutChartHeight = '';
	@Input() internationalScoreBgColor: any;

    @Output() updateClickInChart = new EventEmitter<any>();

    eChartDoughnutData: any[] = [];
    doughnutChartOptions1: object = {};
    payloadForChildApi: any = {};
    graphData: any;

	constructor(
		private toTitleCasePipe: TitleCasePipe,
		public toNumberSuffix: NumberSuffixPipe,
        public decimalPipe: DecimalPipe,
        private router: Router,
        private searchCompanyService: SearchCompanyService,
        private currencyPipe: CurrencyPipe
	) { }

	ngOnInit() {}

    ngOnChanges(changes: SimpleChanges) {
        if ( changes && changes?.dataForGraph && changes?.dataForGraph?.currentValue ) {
            this.praparedGraphData()
        }

        this.searchCompanyService.$apiPayloadBody.subscribe( res => {
			this.payloadForChildApi = res;
        });
    }

    praparedGraphData() {
        this.eChartDoughnutData = [];
        this.eChartDoughnutData = this.dataForGraph.map( item => {
            item['value'] = item?.count ?? item.doc_count ?? item.counts ?? item.value;
            item['name'] =item?.name ?? item.name ?? this.toTitleCasePipe.transform(item.region) ?? (item?.label ?? this.toTitleCasePipe.transform(item.key) ?? this.toTitleCasePipe.transform(item.status));
            item['itemStyle'] = this.thisPage =='diversityCalculation' ? { color: this.internationalScoreBgColor?.[item.name.toLowerCase()] } : { color: item.colorCode };
            item['newVal'] =  item?.count ?? item.counts ?? this.decimalPipe.transform( item.doc_count, '1.0-0' );
            item['spendTotal'] = item.spendTotal ? this.currencyPipe.transform( item.spendTotal, 'GBP', 'symbol', '1.0-0' ) : undefined;
            return item;
        } )
        this.preparedDoughnut(this.eChartDoughnutData);
    }

    preparedDoughnut( data?, page: string = this.thisPage ) {

        let count = this.totalCount ?? 0;

        // this.doughnutChartOptions1 = {
        //     title: {
        //         show: false,
        //         text: 'Top Lenders',
        //         left: 'center',
        //     },
        //     tooltip: {
        //         trigger: 'item',
        //         formatter: function(params) {
                    
        //             const colorCircle = `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${params.color}; margin-right: 5px;"></span>`;
        //             return `${colorCircle}${params.name}: ${(params['data']['newVal'])}`;
        //         }
        //     },
        //     legend: {
        //         // top: 'center',
        //         // left: 'right',
        //         // orient: 'verticle',
        //         orient: this.thisPage =='diversityCalculation' ? 'verticle' : this.thisPage =='chargeSearchPage'|| 'investeeFinderPage' ? 'horizontal' : '', // Display legend vertically
        //         top: this.thisPage =='diversityCalculation' ? 'center' : this.thisPage =='chargeSearchPage' ? '80%' : 'bottom',
        //         left: this.thisPage =='diversityCalculation' ? 'right' : 'center',
        //         type: 'scroll',
        //         itemWidth: 20,
        //         itemHeight: 10,
        //         padding: this.thisPage =='chargeSearchPage' ? [10, 20, 10, 20] :  [0, 10, 0, 30],
        //         itemGap: 20,
        //         formatter: function (name) {
        //             const item = data?.find(entry => entry?.['name'] === name);
        //             return ( item && page == 'diversityCalculation' ) ? `${name}: ${item.spendTotal}` : name;
        //         },
        //         textStyle: {
        //             fontWeight: 'bold',
        //             fontSize: 16
        //         }

        //     },
        //     color: [ '#44bd32', '#45b39d', '#16a085', '#154360', '#e74c3c'],
        //     series: [
        //         {
        //             name: 'Data',
        //             type: 'pie',
        //             radius: this.thisPage =='chargeSearchPage' ? ['30%', '70%'] : ['30%', '90%'],
        //             center: ['50%', '50%'],
        //             avoidLabelOverlap: false,
        //             itemStyle: {
        //                 borderRadius: 10,
        //                 borderColor: '#fff',
        //                 borderWidth: 2,
        //             },

        //             label: {
        //                 show: false,
        //                 position:  this.thisPage =='chargeSearchPage' ? '' : 'center'
        //             },
        //             emphasis: {
        //                 label: {
        //                     show: false,
        //                     fontSize: '16',
        //                     fontWeight: 'bold',
        //                 },
        //             },
        //             labelLine: {
        //                 show: true,
        //             },
        //             data: this.eChartDoughnutData,
        //         },
        //     ],
        // };

        this.doughnutChartOptions1 = {
            title: {
                show: this.thisPage =='investeeFinderPage' ? true : false,
                text:  'Investors distribution across regions - A Donut chart analysis',
                left: 'center',
                top: 'top',
                textStyle: {
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#006266'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    const colorCircle = `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${params.color}; margin-right: 5px;"></span>`;
                    return `${colorCircle}${params.name}: ${(params['data']['newVal'])}`;
                }
            },
            legend: {
                orient: this.thisPage == 'diversityCalculation' ? 'vertical' : 'horizontal',
                top: this.thisPage == 'diversityCalculation' ? 'center'  : 'bottom',
                left: this.thisPage == 'diversityCalculation' ? 'right' : 'center',
                type: 'scroll',
                itemWidth: 20,
                itemHeight: 10,
                padding: [0, 10, 0, 30],
                itemGap: 20,
                textStyle: {
                    fontWeight: 'bold',
                    fontSize: 16
                }
            },
            color: [ '#44bd32', '#45b39d', '#16a085', '#154360', '#e74c3c', '#f39c12', '#8e44ad', '#3498db', '#2ecc71', '#c0392b', '#1abc9c', '#e67e22', '#d35400', '#7f8c8d', '#9b59b6' ],
            series: [
                {
                    name: 'Data',
                    type: 'pie',
                    radius:  ['40%', '80%'],
                    center: ['50%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2,
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: false,
                            fontSize: '16',
                            fontWeight: 'bold',
                        },
                    },
                    labelLine: {
                        show: true,
                    },
                    data: this.eChartDoughnutData,
                },
            ],
        };
    
    }

    onChartClick(event, pageName) {
        if ( !['contractFinderPage', 'buyerNonREGScreen', 'diversityCalculation', 'investeeFinderPage'].includes( pageName ) ) {
            let url;
            const requestedData = { ...this.payloadForChildApi };
            requestedData.filterData = requestedData.filterData.filter( item => item.chip_group != 'Charges Person Entitled' );
            requestedData.filterData.push( { chip_group: 'Charges Person Entitled', chip_values: [ event.data.key ] } );
            url = String( this.router.createUrlTree( ['company-search'], { queryParams: { chipData: JSON.stringify( requestedData.filterData ), showCharges: true, activeTab: 'Companies' } } ) );
            window.open( url, '_blank' );
        }

        if ( this.thisPage == 'diversityCalculation' ) {
            this.updateClickInChart.emit( event );
        }
    }

}
