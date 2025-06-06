import { Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { SharedScreenshotService } from 'src/app/interface/service/shared-screenshot.service';

@Component({
    selector: 'dg-shared-trend-analysis-component',
    templateUrl: './shared-trend-analysis-component.component.html',
    styleUrls: ['./shared-trend-analysis-component.component.scss'],
})
export class SharedTrendAnalysisComponentComponent implements OnChanges {
    @Input() header: string;
    @Input() graphType: string = 'lineGraph';
    @Input() trendsData: object = {};

    @ViewChild('chartContainer') chartContainer: ElementRef;

    constructor(
        private renderer: Renderer2,
        private sharedScreenshotService: SharedScreenshotService
    ){}

    ngOnChanges(changes: SimpleChanges) {
        if ( changes && changes?.trendsData && changes?.trendsData?.currentValue ) {
            this.trendsData = changes.trendsData.currentValue;
        }
    }

    downloadChart() {

        const trendsDataJSON = JSON.stringify(this.trendsData).replace(/</g, '\\u003c');

        const chartCSS = `
            <style>
                #chart  {
                    width: 680px;
                    height: 500px;
                    position: relative;
                }
                body {
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
            </style>
        `;
        
        const chartJS = `
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <script>

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

                document.addEventListener('DOMContentLoaded', function () {

                    if (typeof Chart === 'undefined') {
                        console.error('Chart.js is not loaded.');
                        return;
                    }

                    const trendsData = JSON.parse('${trendsDataJSON}');
                   
                    var ctx = document.querySelector('#chart canvas').getContext('2d');
                    new Chart(ctx, {
                      type: 'line',
                      data: trendsData.data,
                      options: {
                        responsive: true,
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
                            tooltip: {
                                enabled: true,
                                callbacks: {
                                    label: function ( tooltipItem ) {

                                        if (tooltipItem.dataset && tooltipItem.dataset.label != 'New Company Registered') {
                                            
                                            return \`Total \${ tooltipItem.dataset.label }: \${formatNumber(tooltipItem.raw.sum)} | Total Company: \${formatNumber(tooltipItem.raw.companyCount)} | Avg \${tooltipItem.dataset.label}: \${ formatNumber(( parseFloat( (tooltipItem.formattedValue).replace(/,/g, '') ))) } \`;
                                        } else {
                                            return \`\${ tooltipItem.dataset.label }: \${ formatNumber( parseFloat( (tooltipItem.formattedValue).replace(/,/g, '') ) ) }\`;
                                        }


                                    }
                                }
                            }
                        },
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: 'Years'
                            }
                          },
                          y: {
                            title: {
                              display: false,
                              text: 'Average'
                            },
                            ticks: {
                                font: {
                                    family: 'Roboto',
                                },
                                padding: 8,
                                callback: (label, index, labels) => {
                                    return \`\${formatNumber( label )}\`;
                                }
                            },
                            beginAtZero: true
                          }
                        }
                      }
                    });
                });
            </script>
        `;

    
        // Construct the full HTML content
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
                        <p style="text-align: center; color: #666666;"><strong>${JSON.parse(trendsDataJSON).label} Count Year-over-Year</strong></p>
                        <canvas id="myChart" width="680" height="400"></canvas>
                    </div>
                    ${chartJS}
                </body>
            </html>
        `;
    
        // Create a Blob object with the HTML content
        const blob = new Blob([htmlContent], { type: 'text/html' });
        
        // Create a link element
        const link = this.renderer.createElement('a');
        this.renderer.setAttribute(link, 'href', URL.createObjectURL(blob));
        this.renderer.setAttribute(link, 'download', 'chart.html');
        
        // Append the link to the body and trigger a click to start the download
        this.renderer.appendChild(document.body, link);
        link.click();
        
        // Remove the link from the body
        this.renderer.removeChild(document.body, link);
    }

    takeScreenshot( containerId? ) {
        this.sharedScreenshotService.snapshotForRiskSummary( containerId.nativeElement, this.header );
    }
}
