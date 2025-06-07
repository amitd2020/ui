import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../shared-loader/shared-loader.service';
import { TitleCasePipe } from '@angular/common';
import { DataCommunicatorService } from '../../features-modules/company-details-module/data-communicator.service';

import ChartDataLabels from 'chartjs-plugin-datalabels';
import { industryListData } from '../stats-insights/stats-financial-index';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'dg-new-feature-growth',
	templateUrl: './benchmarking.component.html',
	styleUrls: ['./benchmarking.component.scss']
})
export class BenchmarkingComponent implements OnInit, OnChanges {
	
	@Input() companyNumberToGrowthInsights: any;
	@Input() benchmarkingDialog: boolean = false;
	
    ChartDataLabelsPlugins = [ChartDataLabels];	
	featureGrowthData: object = {};
	rankData: object = {};
	selectedScore: object = {};
	tabSic_codes: Array<any> = [];
	graphApidata: object = {};
	sicCode: string[] = [];
	selectedFilter: any;
	activeIndex: number = 0;	
	innerTabData: any;	
	compNum: any;	
	companyData: any;	
	initialiZedcompNum: any;
	selectedSicCode: string = '';
	selectedMenu: string = '';
	totalCount: number = null;
	positiveCommentsObj: Array<any> = []
	negativeCommentsObj: Array<any> = []
	benchMarkingHtml = {
		'hypersonic': 
		`<div class="m-3">
			<div class="hypersonic p-2 font-bold text-lg border-2 border-green-600 shadow-1">
				Hypersonic - Showing fast growth and strong financial performance, moving quickly in the market.
			</div>
			<div class="border-2 border-gray-600  p-3  border-top-none">
				<div class="acelerator p-1 mb-2">Accelerator – Driving faster growth and boosting financial performance.</div>
				<div class="momentum p-1 mb-2">Momentum – Building steady growth and strengthening financial performance.</div>
				<div class="drift p-1 mb-2">Drift - Experiencing steady growth while navigating evolving financial opportunities.</div>
				<div class="byte p-1 mb-2">Byte – Small but steady growth with potential for expansion </div>
			</div> 
		</div>`,
		'supersonic': `<div class="m-3">
			<div class="supersonic p-2 font-bold text-lg border-2 border-green-600 shadow-1">Supersonic – Growing fast with strong financial results.</div>
			<div class="border-2 border-gray-600  p-3  border-top-none">
				<div class="acelerator p-1 mb-2">Accelerator – Driving faster growth and boosting financial performance.</div>
				<div class="momentum p-1 mb-2">Momentum – Building steady growth and strengthening financial performance.</div>
				<div class="drift p-1 mb-2">Drift - Experiencing steady growth while navigating evolving financial opportunities.</div>
				<div class="byte p-1 mb-2">Byte – Small but steady growth with potential for expansion </div>
			</div> 
		</div>`,
		'transonic': `<div class="m-3">
			<div class="transonic p-2 font-bold text-lg border-2 border-green-600 shadow-1">Transonic – Steady growth with improving financial performance.</div>
			<div class="border-2 border-gray-600  p-3  border-top-none">
				<div class="acelerator p-1 mb-2">Accelerator – Driving faster growth and boosting financial performance.</div>
				<div class="momentum p-1 mb-2">Momentum – Building steady growth and strengthening financial performance.</div>
				<div class="drift p-1 mb-2">Drift - Experiencing steady growth while navigating evolving financial opportunities.</div>
				<div class="byte p-1 mb-2">Byte – Small but steady growth with potential for expansion </div>
			</div> 
		</div>`,
		'subsonic': `<div class="m-3">
			<div class="subsonic p-2 font-bold text-lg border-2 border-green-600 shadow-1">Subsonic – Gradual growth with stable financial performance.</div>
			<div class="border-2 border-gray-600  p-3  border-top-none">
				<div class="acelerator p-1 mb-2">Accelerator – Driving faster growth and boosting financial performance.</div>
				<div class="momentum p-1 mb-2">Momentum – Building steady growth and strengthening financial performance.</div>
				<div class="drift p-1 mb-2">Drift - Experiencing steady growth while navigating evolving financial opportunities.</div>
				<div class="byte p-1 mb-2">Byte – Small but steady growth with potential for expansion </div>
			</div> 
		</div>`
	};
	industryListData: Array<object> = JSON.parse( JSON.stringify( industryListData ) );
	companyCommentsData:any = {};
	innerTabs = [
		{ key: 'financialTotalScore', header: 'Financial Score' },
		{ key: 'totalDiverityScore', header: 'Diversity Score' },
		{ key: 'totalOthersScore', header: 'Others Score' },
		{ key: 'totalNonFinancialScore', header: 'Non Financial Score' }
	]
	industryTableData: any[] = [
		{ key: 'industryScoreBySicIndustryName', childKey: 'industryName', secondaryHeader: 'Average ( Industry )'  },
		{ key: 'industryScoresBySicCode', childKey: 'sicCode', secondaryHeader: 'Average ( SIC Code )' }
	]
	tableData: any[] = [
		{ name: 'Financial', current: 'financialTotalScore', average: 'financialTotalEstimatedValue' },
		// { name: 'Diversity', current: 'totalDiverityScore', average: 'diversityEstimatedValue' },
		// { name: 'Score', current: 'totalOthersScore', average: 'othersEstimatedValue' }
		{ name: 'Non Financial Score', current: 'totalNonFinancialScore', average: 'nonFinancialEstimatedValue' }
	];
	msmeTableDataHandler: any[] = [
		{ key: 'scoresByMSMECategoryByIndustryName', childKey: 'industryName', tableData: [], header: '', secondaryHeader: 'Average ( Industry )' },
		{ key: 'scoresByMSMECategoryBySicCode', childKey: 'sicCode', tableData: [], header: '', secondaryHeader: 'Average ( SIC Code )' }
	]
	msmeColumn : Array<any> = [
		{ field: 'tag', header: 'Tags', class: 'text-left' },
		{ field: 'current', header: 'Current', class: 'text-left' },
		{ field: 'estimate', header: 'Average', class: 'text-left' }
	]

	options = {
		plugins: {
		  legend: {
			display: false
		  },
		  subtitle: {
			display: true,
			text: '',
			padding: {
			  top: 10,
			  bottom: 20
			}
		  },
		}
	  };


	headerCardArray: any[] = [
		{ header: '', colorClass: 'bg-teal-50', key: 'scoresByCountryByIndustryName', childDivClass: 'bg-cyan-200' },
		{ header: '', colorClass: 'bg-orange-50', key: 'scoresByCountryBySicCode', childDivClass: 'bg-teal-300' }
	]
	regionArray: any[] = [
		{ header: 'Average ( Industry )', cardHeader: 'Region by Industry Scores' , colorClass: 'bg-teal-50', key: 'scoresByRegionByIndustryNAme', childKey: 'industryName', tableData: [] },
		{ header: 'Average ( SIC Code )', cardHeader: 'Region by SIC Codes',  colorClass: 'bg-orange-50', key: 'scoresByRegionBySicCode', childKey: 'sicCode', tableData: [] },
	]
	regionColumnArray: any[] = [
		{ field: 'key', header: 'Region' },
		{ field: 'current', header: 'Current' },
		{ field: 'count', header: 'Average ( Industry )' }
	]

	constructor(
		private http: HttpClient,
		private globalServerCommunication: ServerCommunicationService,
		private activateRoute: ActivatedRoute,
        private sharedLoaderService: SharedLoaderService,		
		private titlecase: TitleCasePipe,
		private dataCommunicatorService: DataCommunicatorService,
		
	) {
		this.sharedLoaderService.showLoader();
	}

	ngOnInit() {
		this.dataCommunicatorService.$dataCommunicatorVar.subscribe((res: any) => this.companyData = res.companyRegistrationNumber);
		this.getFeatureGrowthData();
	}

	ngOnChanges(changes: SimpleChanges) {

		this.initialiZedcompNum = changes.companyNumberToGrowthInsights.currentValue;

		this.getFeatureGrowthData()
	}

	getTruncatedText(text: string, wordLimit: number): { truncatedText: string, isTruncated: boolean } {
		const words = text.split(' ');
		if (words.length > wordLimit) {
		  return {
			truncatedText: words.slice(0, wordLimit).join(' ') + '...',
			isTruncated: true
		  };
		}
		return { truncatedText: text, isTruncated: false };
	}

	getFeatureGrowthData() {
		
		this.sharedLoaderService.showLoader();
		const { companyNo } = this.activateRoute.snapshot.params;
		
		this.compNum = companyNo ?? this.companyData ?? this.initialiZedcompNum;
		
		this.globalServerCommunication.globalServerRequestCall('get', 'dg-futureGrowth', 'getCompanyFutureGrowth', [ this.compNum ]).subscribe({
			
			next: ( res ) => {
				if ( res.body.status == 200 ) {

					this.featureGrowthData = res.body.result;
					this.sicCode = this.featureGrowthData?.['sic_codes']
					this.tabSic_codes = this.featureGrowthData?.['sic_codes'];
					this.innerTabData = this.featureGrowthData?.['scoresBySicCodes'];
					this.selectedScore = this.innerTabData?.[this.tabSic_codes?.[0]]
					// this.getRankData(this.sicCode?.[0])
					this.preparedGraphData( this.innerTabData?.[this.tabSic_codes?.[0]]?.['financialGrowthScoreArray'] );
					this.prepareMsmeData( this.selectedScore );
					this.prepareRegionData( this.selectedScore );
					this.onMenuClick( this.sicCode?.[0] )
				}
				setTimeout(() => {
					this.sharedLoaderService.hideLoader();
				}, 2000);
			},

			error: ( err ) => {
				console.log(err);
				this.sharedLoaderService.hideLoader();
			}

		});
	}

	getRankData(selectedSicCode, data){
		let calculateGrowthPayload= {
			companyNumber: this.compNum,
			sic_code: selectedSicCode,
			growth_Classification: data?.['financialPerformance'],
			total_score: data?.['totalGrowthScore']
		}

		this.globalServerCommunication.globalServerRequestCall('post', 'dg-futureGrowth', 'calculateGrowthScoreRanking', calculateGrowthPayload).subscribe({
			next: ( res ) => {
				if ( res.body.status == 200 ) {
					this.rankData = res.body.results
				}
			},
			error: ( err ) => {
				console.log(err);
			}

		});
	}

	prepareRegionData( regionArrayFromRes ) {

		let tempArray = JSON.parse( JSON.stringify( this.regionArray ) );
		this.regionArray = [];

		for ( let item of tempArray ) {
			let matchKey = regionArrayFromRes?.[ item?.['key'] ];
			let matchRegion = matchKey?.['companyRegion'];
			let matchScore = matchKey?.['currentScore'];
			item['tableData'] = [];
			item['tableData'] = matchKey?.['estimatedScore'].map( val => {
				val['current'] = '-';
				if ( val.key == matchRegion ) {
					val['current'] = matchScore
				}
				return val;
			})
		}
		this.regionArray = [...tempArray]
	}

	onMenuClick(menu: string) {
		this.selectedMenu = menu;
		this.selectedScore = this.innerTabData?.[menu];
		this.getRankData(menu, this.innerTabData?.[menu])
		this.graphTextDisplay();
		this.preparedGraphData(this.selectedScore?.['financialGrowthScoreArray'])
		this.prepareMsmeData(this.selectedScore);
		this.prepareRegionData(this.selectedScore);
		this.initializeCompanyCommentJSON( this.selectedScore?.['financialGrowthScoreArray'] );
		this.selectedFilter = [];
		const [code, description] = this.selectedMenu.split(' - ');
		let obj = this.industryDataPrepared(description);
		this.selectedFilter.push({ chip_group: "Status", chip_values: ["live"] }, { chip_group: "SIC Codes", chip_industry_sic_codes: [ code ], chip_values: [ `${code} - ${description}` ] })
	}

	initializeCompanyCommentJSON(financialGrowthResAPI) {

		const latestFinancialYearObject = financialGrowthResAPI.reduce((latest, current) => {
			// To find latest year Comment Object
			return current.financial_year > (latest.financial_year || 0) ? current : latest;
		}, {});

		this.http.get(`${environment.json}/benchmarkingComments.json`).toPromise().then(commentsFromJson => {

			this.companyCommentsData = commentsFromJson?.['results'];
			this.positiveCommentsObj = [], this.negativeCommentsObj = [];	

			for (const key in latestFinancialYearObject) {
				// Check if the key exists in positive or negative comments
				if ((this.companyCommentsData.positive_comments[key] && this.companyCommentsData.positive_comments[key]['mszValue']) || ( this.companyCommentsData.negative_comments[key] && this.companyCommentsData.negative_comments[key]['mszValue'])) {
					const value = latestFinancialYearObject[key];					
					if (value === 2 || value === 3) {
						// Add to positiveCommentsObj if value is 2 or 3
						this.positiveCommentsObj.push(this.companyCommentsData.positive_comments[key]);
					} else if (value === 1) {
						// Add to negativeCommentsObj if value is 1
						this.negativeCommentsObj.push( this.companyCommentsData.negative_comments[key]);
					}
				}
			}

			// console.log("Positive Comments:", this.positiveCommentsObj);
			// console.log("Negative Comments:", this.negativeCommentsObj);
		});
		
	}
	
	graphTextDisplay(){
		this.options = {
			plugins: {
			  legend: {
				display: false
			  },
			  subtitle: {
				display: true,
				text: this.titlecase.transform(this.selectedMenu),
				padding: {
					top: 10,
					bottom: 20
				  }
			  },
			}
		};
	}

	preparedGraphData( data ) {
		if ( data ) {
			this.graphApidata = {
				labels: data.map( item => item?.financial_year ),
				datasets: [
					{
						data: data.map( item => item?.financial_total ),
						type:'line',
						fill: false,
						borderColor: 'rgb(54, 162, 235)',
						tension: 0.4
					},
					{
						// label: " ",
						type: 'bar',
						data: data.map( item => item?.financial_total ),
						fill: false,
						backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)'],
						borderColor: ['rgb(54, 162, 235)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)'],
						borderWidth: 1,
						barThickness: 30
					}
				]
	
			};
		}
	}

	prepareMsmeData( dataArray ) {
		const msmeArray = JSON.parse(JSON.stringify(this.msmeTableDataHandler));
		this.msmeTableDataHandler = [];
		for ( let item of msmeArray ) {
			item['header'] = dataArray?.[ item?.[ 'key' ] ]?.[ item[ 'childKey' ] ];
			item[ 'tableData' ] = [];
			let categoryMatch = dataArray?.[ item?.[ 'key' ] ]?.['msmeCategory'];

			dataArray?.[ item?.[ 'key' ] ]?.[ 'estimatedScore' ].map( res => {
				let keyOfItem = Object.keys(res)[0];
				let tempCurrentScore = '-';

				if ( categoryMatch == keyOfItem ) {
					tempCurrentScore = dataArray?.[ item?.[ 'key' ] ]?.['currentScore'];
				}

				item[ 'tableData' ].push({ tag: keyOfItem, current: tempCurrentScore, estimate: res[keyOfItem] })
			} )
		}

		this.msmeTableDataHandler = [ ...msmeArray ];
	}

	private industryDataPrepared( industryDataArray: any ) {
		let industryData = {}
		if ( industryDataArray && industryDataArray.length ) {
			for (let i = 0; i < this.industryListData.length; i++) {

				for (let j = 0; j < industryDataArray.length; j++) {
					
					if ( this.industryListData[i]['value'] == industryDataArray ) {

						industryData = this.industryListData[i];
					}
				}
			}
		}
		return industryData;
	}
}
