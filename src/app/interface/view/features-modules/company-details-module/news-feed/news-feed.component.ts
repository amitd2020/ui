import { Component, OnInit } from '@angular/core';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { DataCommunicatorService } from '../data-communicator.service';

@Component({
	selector: 'dg-news-feed',
	templateUrl: './news-feed.component.html',
	styleUrls: ['./news-feed.component.scss']
})
export class NewsFeedComponent implements OnInit {

	companyName: string = '';
	companyNumber: string = '';
	companyTradeAs: string = '';

	newsData: any;
	emotionGraph: any;
	newsDataOnly: any;
	emotionGraphData: any;
	emotionGraphOptions: any;
	newsFeedData: Array<any> = [];

	positiveLink: string = '';
	negativeLink: string = '';
	featuresLink: string = '';

	showSentiments: boolean = true;
	chartBool: boolean = false;
	showChartBlankMsg: boolean = false;

	constructor(
        private dataCommunicatorService: DataCommunicatorService,
		private sharedLoaderService: SharedLoaderService,
		private globalServiceCommnunicate: ServerCommunicationService
	) { }

	ngOnInit() {

		// this.sharedLoaderService.showLoader();

		this.dataCommunicatorService.$dataCommunicatorVar.subscribe( ( res: any ) => {
			this.companyName = res.businessName;
			this.companyNumber = res.companyRegistrationNumber;
			this.companyTradeAs = res.companyContactInformation[0].company_tradingAs;
		});

		// this.getNewsFeeds( this.companyName, this.companyNumber );
		// this.getNewsFeedsOnly( this.companyName )

	}

	getNewsFeeds(companyName: string, companyNumber: string) {

		companyName = companyName.replace(/\s/g, '-')

		let obj = [ companyName, companyNumber ];

		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_API', 'companyNews', obj ).subscribe(res => {
			
			this.newsData = res.body;
			if (this.newsData.length > 0) {
				this.emotionGraph = this.newsData[0]['emotionGraph'];
				this.positiveLink = this.newsData[0]['positiveLink'];
				this.negativeLink = this.newsData[0]['negativeLink'];
				this.featuresLink = this.newsData[0]['featuresLink'];
				if (Object.keys(this.emotionGraph).length > 0) {

					this.chartBool = true;

					let labels = [];
					let values = [];

					for (let key in this.emotionGraph) {
						labels.push(key)
						values.push(this.emotionGraph[key])
					}

					this.emotionGraphOptions = {
						legend: {
							display: false
						},
						maxBarThickness: 6,
						scales: {
							x: {
								ticks: {
									font: {
										size: 10
									}
								},
								grid: {
									display: false
								}
							},
							y: {
								ticks: {
									beginAtZero: true,
									fontSize: 10
								},
								grid: {
									display: false
								}
							}
						},
						plugins: {
							datalabels: {
								display: true,
								align: 'end',
								anchor: 'end',
								offset: 1,
								font: {
									size: 10
								}
							},
							layout: {
								padding: {
									top: 20
								}
							},
							title: {
								fontFamily: 'Roboto'
							},
							tooltip: {
								enabled: false
							}
						}
					}

					this.emotionGraphData = {
						labels: labels,
						datasets: [
							{
								data: values,
								backgroundColor: '#1F4286'
							}
						]
					}
				}
				if (Object.keys(this.emotionGraph).length == 0) {
					this.chartBool = true;
					this.showChartBlankMsg = true
				}
			} else {
				if ( this.companyTradeAs ) {

					this.getNewsFeedswithCmpTradeAs();
				}
			}
			setTimeout(() => {
				this.sharedLoaderService.hideLoader();
			}, 1000);
		});

	}

	getNewsFeedsOnly(companyName: string) {
		companyName = companyName.replace(/\s/g, '-');
		let obj = [ companyName ];
		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_API', 'companyNewsOnly', obj ).subscribe(res => {
			this.newsDataOnly = res.body;
			if (this.newsDataOnly.length > 0) {
				this.newsFeedData = this.newsDataOnly[0]['news'];
				// this.showNewsOnly = false;
				this.sharedLoaderService.hideLoader();
			} else {
				if ( this.companyTradeAs ) {

					this.getNewsFeedsOnlyWithCmpTradeAs();
				} else {

					// this.showNewsOnly = false;
					this.sharedLoaderService.hideLoader();
				}
			}
			setTimeout(() => {
				this.sharedLoaderService.hideLoader();
			}, 1000);

		});
	}

	getNewsFeedswithCmpTradeAs() {

		let obj = [ this.companyName, this.companyNumber ];

		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_API', 'companyNews', obj ).subscribe(res => {
			this.newsData = res.body;
			if (this.newsData.length > 0) {
				this.emotionGraph = this.newsData[0]['emotionGraph'];
				this.positiveLink = this.newsData[0]['positiveLink'];
				this.negativeLink = this.newsData[0]['negativeLink'];
				this.featuresLink = this.newsData[0]['featuresLink'];
				if (Object.keys(this.emotionGraph).length > 0) {

					this.chartBool = true;

					let labels = [];
					let values = [];

					for (let key in this.emotionGraph) {
						labels.push(key)
						values.push(this.emotionGraph[key])
					}

					this.emotionGraphOptions = {
						scales: {
							x: {
								ticks: {
									font: {
										size: 10
									},
								},
								grid: {
									display: false
								}
							},
							y: {
								ticks: {
									font: {
										size: 10
									},
									beginAtZero: true,
								},
								grid: {
									display: false
								}
							}
						},
						plugins: {
							datalabels: {
								maxBarThickness: 6,
								display: true,
								align: 'end',
								anchor: 'end',
								offset: 1,
								font: {
									size: 10
								}
							},
							tooltips: {
								enabled: false
							},
							legend: {
								display: false
							},
							title: {
								fontFamily: 'Roboto'
							},
						},
						layout: {
							padding: {
								top: 20
							}
						}
					}

					this.emotionGraphData = {
						labels: labels,
						datasets: [
							{
								data: values,
								backgroundColor: '#1F4286'
							}
						]
					}
				}
				if (Object.keys(this.emotionGraph).length == 0) {
					this.chartBool = true;
					this.showChartBlankMsg = true
				}
			} else {
				this.sharedLoaderService.hideLoader();
			}
		});

	}

	getNewsFeedsOnlyWithCmpTradeAs() {

		let obj = [ this.companyTradeAs ];
		this.globalServiceCommnunicate.globalServerRequestCall( 'get', 'DG_API', 'companyNewsOnly', obj ).subscribe(res => {

			this.newsDataOnly = res.body;
			if (this.newsDataOnly.length > 0) {
				this.newsFeedData = this.newsDataOnly[0]['news'];
			}
			this.sharedLoaderService.hideLoader();

		});
		
	}

	onImageLoad( imageLoader ) {
		for ( let spinnerElem of imageLoader.__ngContext__[0].children ) {
			if ( spinnerElem.classList.contains( 'fluidFixedLoader' ) ) {
				spinnerElem.classList.add( 'p-d-none' );
			}
		}
	}

}
