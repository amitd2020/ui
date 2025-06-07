import { Component, Input, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ServerCommunicationService } from "src/app/interface/service/server-communication.service";
import { SharedLoaderService } from "src/app/interface/view/shared-components/shared-loader/shared-loader.service";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { CommonServiceService } from "src/app/interface/service/common-service.service";
import { CurrencyPipe, TitleCasePipe } from "@angular/common";

@Component({
    templateUrl: './diversity-calculation-stats.html',
    selector: 'dg-diversity-calculation-stats',
    styleUrls: [ './diversity-calculation-stats.scss' ]
})

export class DiversityCalculationStats implements OnInit {
    
	@ViewChild( 'LazyLeafletMapContainer', { read: ViewContainerRef } ) LazyLeafletMapContainer: ViewContainerRef;
    localAuthorityArray: Array<any> = [];
    rows: number = 25;
    first: number = 0;
    totalCount: number = 0;
    statsDataForDiversityObj: any;
    msmeArray: [];
    internationalScoreDescriptionArray: [];
	diversitySaveList: Array<{}> = [];
	selectlist: object = {};
	doughnutChartDatasets : any = {};
	doughnutChartOptions : any = {};
    ChartDataLabelsPlugins = [ ChartDataLabels ];
	globalFilterDataObject: any;

	// @Input() listIdForDiversityStats: string;
	// @Input() globalFilterDataObject: any;

    msmeStatusColor = {
        'Micro': '#59ba9b',
        'Small': '#ffcc00',
        'Medium': '#ee9512',
        'Large Enterprise': '#e1b12c',
		'Unknown': '#aabbcc',
    }

    internationalScoreStatusColor = {
        'very low risk': '#6dc470',
        'low risk': '#59ba9b',
        'moderate risk': '#ffcc00',
        'high risk': '#ee9512',
		'not scored': '#D92727',
    }

    internationalScoreBgColor = {
        'very low risk': '#c9e9ca',
        'low risk': '#c9e8df',
        'moderate risk': '#fff0b3',
        'high risk': '#fadfb7',
		'not scored': '#f4bebe',
    }

    msmeStatusBgColor = {
        'Micro': '#cdeae1',
        'Small': '#fff0b3',
        'Medium': '#fadfb8',
        'Large Enterprise': '#f6e8c0',
		'Unknown': '#e6ebf0',
    }

    industryListData: Array<object> = [
		{ label: 'A - agriculture forestry and fishing', value: 'agriculture forestry and fishing', count: 0, spend_percentage: 0, totalSpendCount: 0 },
		{ label: 'B - mining and quarrying', value: 'mining and quarrying', count: 0, spend_percentage: 0, totalSpendCount: 0 },
		{ label: 'C - manufacturing', value: 'manufacturing', count: 0, spend_percentage: 0, totalSpendCount: 0 },
		{ label: 'D - electricity, gas, steam and air conditioning supply', value: 'electricity, gas, steam and air conditioning supply', count: 0, spend_percentage: 0, totalSpendCount: 0 },
		{ label: 'E - water supply, sewerage, waste management and remediation activities', value: 'water supply, sewerage, waste management and remediation activities', count: 0, spend_percentage: 0, totalSpendCount: 0 },
		{ label: 'F - construction', value: 'construction', count: 0, spend_percentage: 0, totalSpendCount: 0 },
		{ label: 'G - wholesale and retail trade; repair of motor vehicles and motorcycles', value: 'wholesale and retail trade; repair of motor vehicles and motorcycles', count: 0, spend_percentage: 0, totalSpendCount: 0 },
		{ label: 'H - transportation and storage', value: 'transportation and storage', count: 0, spend_percentage: 0, totalSpendCount: 0 },
		{ label: 'I - accommodation and food service activities', value: 'accommodation and food service activities', count: 0, spend_percentage: 0, totalSpendCount: 0 },
		{ label: 'J - information and communication', value: 'information and communication', count: 0, spend_percentage: 0, totalSpendCount: 0 },
		{ label: 'K - financial and insurance activities', value: 'financial and insurance activities', count: 0, spend_percentage: 0, totalSpendCount: 0 },
		{ label: 'L - real estate activities', value: 'real estate activities', count: 0, spend_percentage: 0, totalSpendCount: 0 },
		{ label: 'M - professional, scientific and technical activities', value: 'professional, scientific and technical activities', count: 0, spend_percentage: 0, totalSpendCount: 0 },
		{ label: 'N - administrative and support service activities', value: 'administrative and support service activities', count: 0, spend_percentage: 0, totalSpendCount: 0 },
		{ label: 'O - public administration and defence; compulsory social security', value: 'public administration and defence; compulsory social security', count: 0, spend_percentage: 0, totalSpendCount: 0 },
		{ label: 'P - education', value: 'education', count: 0, spend_percentage: 0, totalSpendCount: 0 },
		{ label: 'Q - human health and social work activities', value: 'human health and social work activities', count: 0, spend_percentage: 0, totalSpendCount: 0 },
		{ label: 'R - arts, entertainment and recreation', value: 'arts, entertainment and recreation', count: 0, spend_percentage: 0, totalSpendCount: 0 },
		{ label: 'S - other service activities', value: 'other service activities', count: 0, spend_percentage: 0, totalSpendCount: 0 },
		{ label: 'T - activities of households as employers; undifferentiated goods- and services-producing activities of households for own use', value: 'activities of households as employers; undifferentiated goods- and services-producing activities of households for own use', count: 0, spend_percentage: 0, totalSpendCount: 0 },
		{ label: 'U - activities of extraterritorial organisations and bodies', value: 'activities of extraterritorial organisations and bodies', count: 0, spend_percentage: 0, totalSpendCount: 0 },
		{ label: 'Not Specified', value: 'not specified', count: 0, spend_percentage: 0, totalSpendCount: 0 }
	];

    localAuthorityColumns: Array<any> = [
        { field: 'authority', isSortable: true, header: 'Authority', minwidth: '360px', maxWidth: 'none', textAlign: 'left' },
        { field: 'count', isSortable: true, header: 'Count', minwidth: '140px', maxWidth: '140px', textAlign: 'right'  },
        { field: 'spendTotal', isSortable: true, header: 'Spend', minwidth: '240px', maxWidth: '240px', textAlign: 'right'  },
        { field: 'spend_percentage', isSortable: true, header: 'Spend Percentage', minwidth: '180px', maxWidth: '180px', textAlign: 'right'  },
    ]

    industryListColumnArray: Array<any> = [
        { field: 'label', isSortable: true, header: 'SIC Industry', minwidth: '360px', maxWidth: 'none', textAlign: 'left' },
        { field: 'count', isSortable: true, header: 'Count', minwidth: '140px', maxWidth: '140px', textAlign: 'right'  },
        { field: 'totalSpendCount', isSortable: true, header: 'Spend', minwidth: '240px', maxWidth: '240px', textAlign: 'right'  },
        { field: 'spend_percentage', isSortable: true, header: 'Spend Percentage', minwidth: '180px', maxWidth: '180px', textAlign: 'right'  },
    ]

    constructor(        
		private globalServerCommunicate: ServerCommunicationService,
		private _sharedLoaderService: SharedLoaderService,
        private router: Router,       
		public activatedRoute: ActivatedRoute, 
		public _commonService: CommonServiceService,        
		private _toCurrencyPipe: CurrencyPipe,
        private titlecase: TitleCasePipe
    ) {}


    ngOnInit() {
		this.globalFilterDataObject = JSON.parse( this.activatedRoute.snapshot.queryParams['globalFilterDataObject'] );
        this.fetchStatsData(this.globalFilterDataObject['listId']);
        this._sharedLoaderService.showLoader();
    }
    
    fetchStatsData(listId) {
        let payloadObj = {
            "filterData": [],
            "listId": listId,
            "pageName": this.globalFilterDataObject.pageName
        }
        this.globalServerCommunicate.globalServerRequestCall( 'post', 'DG_API', 'diversityCalculationStats', payloadObj  ).subscribe({
            next: ( res ) => {

                if (res?.body && res.body?.code == 200) {
                    this.statsDataForDiversityObj = res.body.result;

                    let regionDataArray = this.statsDataForDiversityObj?.region || [];
                    this.msmeArray = this.statsDataForDiversityObj?.msmeStatus || [];
                    this.internationalScoreDescriptionArray = this.statsDataForDiversityObj?.internationalScoreDescription || [];
                    let industryArray = this.statsDataForDiversityObj?.industry || [];
                    this.localAuthorityArray = this.statsDataForDiversityObj?.localAuthority || [];

                    this.localAuthorityArray.sort((a, b) => b['spend_percentage'] - a['spend_percentage']);


                    if (regionDataArray.length) {
                        this.initLeafletMapContainer(regionDataArray);
                    }

                    if (industryArray.length) {
                        this.fetchIndustryData(industryArray);
                    }
                    setTimeout(() => {
                        this._sharedLoaderService.hideLoader();
                    }, 100);
                }

                this.diversityCalcChartData( this.internationalScoreDescriptionArray );

            },

            error: (err) => {
                console.log(err);
            }
        });
    }

    formatBgColorForPieChart( inputData ) {

		let finalResult = '';

		switch ( inputData ) {
			case 'very low risk':
				finalResult = '#6DC470';
				break;

			case 'low risk':
				finalResult = '#59BA9B';
				break;

			case 'moderate risk':
				finalResult = '#FFC201';
				break;

			case 'high risk':
				finalResult = '#E4790F';
				break;
				
			case 'not scored':
				finalResult = '#D92727';
				break;

			case 'not specified':
				finalResult = '#b4b4b4';
				break;
		
			default:
				break;
		}

		return finalResult;

	}

    diversityCalcChartData( calcAllData ) {
        let chartLabels = [], chartDataset = [], chartPercentage = [], backgroudColor: any = [];

        this.doughnutChartOptions = {
			cutout: 50,
			layout: {
				padding: 30
			},
			plugins: {
				datalabels: {
					display: (context) => {
						let dataset = context.dataset;
						let value = dataset.data[context.dataIndex];
						return value;
					},
					backgroundColor: function(context) {
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
					formatter: ( value ) => {
						value = this._toCurrencyPipe.transform( value, '', '', '1.0-2' );
						return value;
					}
				},
				legend: {
					display: false,
				},
				tooltip: {
					enabled: false
				},
			},
			onHover: (event, elements) => {
				event.native.target.style.cursor == 'cursor' ? "pointer" : "default";
			},
			onClick: ( event, elements, chart ) => {
				onChartElementClick( event.native, elements, chart );
			}
		}
        
        for ( let dataKey of calcAllData ) {
            let tileOfChart = this.titlecase.transform( dataKey[ 'key' ] )
            chartLabels.push( tileOfChart )
            chartDataset.push( dataKey[ 'doc_count' ] )
            backgroudColor.push( this.formatBgColorForPieChart( dataKey[ 'key' ] ) )

		}

		const onChartElementClick = ( event, elements, chart ) => {
			
			let chartdetails = chart.config.data;
	
			if ( chartdetails && elements && elements.length) {

				let	targetLabel = chartdetails.labels[ elements[0].index];
                targetLabel = targetLabel.toLowerCase() == 'not scored / very high risk' ? 'not scored' : targetLabel.toLowerCase();

				this.gotToSearchPage( {key: targetLabel }, 'Credit Risk Bands' )
			}
			
		}

		chartLabels = JSON.parse(JSON.stringify(chartLabels));
		let indx = chartLabels.indexOf("Not Scored");
		indx != -1 ? chartLabels[indx] = "Not Scored / Very High Risk" : chartLabels;

		this.doughnutChartDatasets = {
			labels: chartLabels,
			datasets: [
				{
					data: chartDataset,
					backgroundColor: backgroudColor
				}
			]
		};


    }

    fetchIndustryData( industryArray ) {
        for (let i = 0; i < this.industryListData.length; i++) {

            for (let j = 0; j < industryArray.length; j++) {
                
                if ( this.industryListData[i]['value'] == industryArray[j]['industry'] ) {

                    this.industryListData[i]['count'] = industryArray[j]['count'] || 0;
                    this.industryListData[i]['spend_percentage'] = industryArray[j]?.['spend_percentage'] || 0;
                    this.industryListData[i]['totalSpendCount'] = industryArray[j]['spendTotal'] || 0;
                    this.industryListData[i]['field'] = this.industryListData[i]['value'];
                }

            }

        }

        this.industryListData.sort( ( a, b ) => b['spend_percentage'] - a['spend_percentage'] );

    }


    async initLeafletMapContainer( currentYearData ) {
        this.globalFilterDataObject['filterData'] = []
		this.globalFilterDataObject['filterData'].push({ chip_group: 'Saved Lists', chip_values: [this.globalFilterDataObject['listName']] }, { chip_group: 'Preferences', chip_values: ['Include dormant companies'], "preferenceOperator": [{"dormant_status": "include"}]  } );
		const { LazyLeafletMapComponent } = await import('../../../../shared-components/lazy-leaflet-map/lazy-leaflet-map.component');

		this.LazyLeafletMapContainer.clear();
		
		const { instance } = this.LazyLeafletMapContainer.createComponent( LazyLeafletMapComponent );
        instance.mapConfig.primaryMapId = `statsInsightsMapContainer`;
		instance.mapData = { currentYearData: currentYearData };
		instance.requiredData = { thisPage: 'diversityCalculationStats',industryListData: this.industryListData, globalFilterDataObject: this.globalFilterDataObject };

    }

    gotToSearchPage( data, filterChipGroupName ) {
        
        if( filterChipGroupName == 'Credit Risk Bands' ){
			let filters = [];
			filters.push({ chip_group: 'Saved Lists', chip_values: [this.globalFilterDataObject['listName']], pageName: this.globalFilterDataObject.pageName }, { chip_group: 'Preferences', chip_values: ['Include dormant companies'], "preferenceOperator": [{"dormant_status": "include"}]  }, { chip_group: 'Bands', chip_values: [data.key], label: "Credit Risk Bands" } );
			let urlStr: string;
	
			urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(filters), cListId: this.globalFilterDataObject['listId'], listPageName: this.globalFilterDataObject['pageName'], listName: this.globalFilterDataObject['listName'] } }));
	
			window.open( urlStr, '_blank' );    
        } else if ( filterChipGroupName == 'Local Authority Name' ) {
            let filters = [];
			filters.push({ chip_group: 'Saved Lists', chip_values: [this.globalFilterDataObject['listName']], pageName: this.globalFilterDataObject.pageName }, { chip_group: 'Preferences', chip_values: ['Include dormant companies'], "preferenceOperator": [{"dormant_status": "include"}]  }, { chip_group: 'Local Authority Name', chip_values: [data.authority] } );
			let urlStr: string;
	
			urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(filters), cListId: this.globalFilterDataObject['listId'], listPageName: this.globalFilterDataObject['pageName'], listName: this.globalFilterDataObject['listName'] } }));
	
			window.open( urlStr, '_blank' );    
        } else if ( filterChipGroupName == 'SIC Codes' ) {
            let filters = [];
			filters.push({ chip_group: 'Saved Lists', chip_values: [this.globalFilterDataObject['listName']], pageName: this.globalFilterDataObject.pageName }, { chip_group: 'Preferences', chip_values: ['Include dormant companies'], "preferenceOperator": [{"dormant_status": "include"}]  }, { chip_group: 'SIC Codes', chip_values: [data.label], "chip_industry_sic_codes": [data.field], "filter_exclude": false } );
			let urlStr: string;
	
			urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(filters), cListId: this.globalFilterDataObject['listId'], listPageName: this.globalFilterDataObject['pageName'], listName: this.globalFilterDataObject['listName'] } }));
	
			window.open( urlStr, '_blank' );    
        }
	}


}