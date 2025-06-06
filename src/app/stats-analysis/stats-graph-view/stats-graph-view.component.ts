import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
    selector: 'dg-stats-graph-view',
    templateUrl: './stats-graph-view.component.html',
    styleUrls: ['./stats-graph-view.component.scss'],
})
export class StatsGraphViewComponent implements OnInit, OnChanges {
    ChartDataLabelsPlugins = [ChartDataLabels];
    @Input() graphType: 'doughnutGraph' | 'barGraph' | 'lineGraph' = 'doughnutGraph';
    @Input() doughnutChartDatasets: object = {};
    @Input() data:  object = {};
    @Input() options:  object = {};
    @Input() chipDataArray: Array<any> = [];
    @Input() selectedFilter: any;
    @Input() additionalAttributForTable: object = {}

    @ViewChild('chartContainer') chartContainer: ElementRef;

    doughnutChartOptions: any = {};
    listId: string;
    inputPageName: string;
    listName: string;

    constructor(
        private toCurrencyPipe: CurrencyPipe,
        private renderer: Renderer2,
        private router: Router,
        public activeRoute: ActivatedRoute
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if ( changes && changes?.chipDataArray && changes?.chipDataArray?.currentValue && changes?.chipDataArray?.currentValue.length ) {
            this.chipDataArray = changes?.chipDataArray?.currentValue;
        }
        if ( changes && changes?.doughnutChartDatasets && changes?.doughnutChartDatasets?.currentValue ) {
            this.doughnutChartDatasets = changes?.doughnutChartDatasets?.currentValue;
        }
    }

    ngOnInit() {
        this.listId = this.activeRoute?.snapshot?.queryParams['cListId'] != undefined ? this.activeRoute?.snapshot?.queryParams['cListId'] : '';
		this.inputPageName = this.activeRoute?.snapshot?.queryParams['listPageName'] ? this.activeRoute?.snapshot?.queryParams['listPageName'] : '';
		this.listName = this.activeRoute?.snapshot?.queryParams['listName'] ? this.activeRoute?.snapshot?.queryParams['listName'] : '';

        this.doughnutChartOptions = {
            cutout: 50,
            layout: {
                padding: 30,
            },
            plugins: {
                datalabels: {
                    display: (context) => {
                        let dataset = context.dataset;
                        let value = dataset.data[context.dataIndex];
                        return value;
                    },
                    backgroundColor: function (context) {
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
                    formatter: (value) => {
                        value = this.toCurrencyPipe.transform(
                            value,
                            '',
                            '',
                            '1.0-2'
                        );
                        return value;
                    },
                },
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: true,
                },
            },
            onHover: (event, elements) => {
                event.native.target.style.cursor = 'pointer';
                // event.native.target.style.cursor ? 'pointer' : 'default';
            },
            onClick: (event, elements, chart) => {
                if (elements.length > 0) {
                    const element = elements[0];
                    const dataIndex = element.index;
                    const label = chart.data.labels[dataIndex];
                    this.gotToSearchPage( label );
                }
                
            },
        };
        

    }
    // const ctx = document.getElementById('chart').getContext('2d');

    downloadChart() {

        const chartHTML  = this.chartContainer.nativeElement.innerHTML;
    
        const chartCSS = `
            <style>
                #chart  {
                    width: 380px;
                    height: 300px;
                    position: relative;
                }
                // #chart canvas {
                //     width: 100% !important;
                //     height: 100% !important;
                // }
            </style>
        `;
        const chartJS = `
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <script>
                document.addEventListener('DOMContentLoaded', function () {

                    if (typeof Chart === 'undefined') {
                        console.error('Chart.js is not loaded.');
                        return;
                    }                    
                   
                    var ctx = document.querySelector('#chart canvas').getContext('2d');
                    new Chart(ctx, {
                      type: 'line',
                      data: {
                        labels: ['A', 'B', 'C'],
                        datasets: [{
                          label: 'Sample Dataset',
                          data: [1, 2, 3],
                          borderColor: 'rgb(75, 192, 192)',
                          fill: false
                        }]
                      },
                      options: {
                        responsive: true,
                        plugins: {
                          legend: {
                            display: true
                          },
                          tooltip: {
                            enabled: true
                          }
                        },
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: 'X Axis'
                            }
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Y Axis'
                            },
                            beginAtZero: true
                          }
                        }
                      }
                    });
                });
            </script>
        `;

    
        //? Construct the full HTML content
        const htmlContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>Chart</title>
                    ${chartCSS}
                </head>
                <body>
                    <div id="chart" class="p-chart">
                        <canvas id="myChart" width="380" height="300"></canvas>
                    </div>
                    ${chartJS}
                </body>
            </html>
        `;
    
        const blob = new Blob([htmlContent], { type: 'text/html' });
        
        //? Create a link element
        const link = this.renderer.createElement('a');
        this.renderer.setAttribute(link, 'href', URL.createObjectURL(blob));
        this.renderer.setAttribute(link, 'download', 'chart.html');
        
        this.renderer.appendChild(document.body, link);
        link.click();

        this.renderer.removeChild(document.body, link);
    }

    gotToSearchPage( item ) {

        this.selectedFilter = this.selectedFilter.filter(val => val.chip_group != this.additionalAttributForTable['chipGroupName'])

        this.selectedFilter.push({chip_group: this.additionalAttributForTable['chipGroupName'], chip_values: [item.toLowerCase()]})

        let urlStr: string;

        urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(this.selectedFilter), cListId: this.listId, listPageName: this.inputPageName, listName: this.listName } }));

        window.open( urlStr, '_blank' );
        
    }
}
