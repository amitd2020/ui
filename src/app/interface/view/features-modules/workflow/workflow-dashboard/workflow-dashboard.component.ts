import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import ChartDataLabels from "chartjs-plugin-datalabels";
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import { Router } from '@angular/router';
import { WorkflowService } from '../workflow.service';
import { WorkflowPageType } from '../workflow-cards.index';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { colorMSME } from '../../../shared-components/stats-insights/stats-financial-index';

@Component({
	selector: 'dg-workflow-dashboard',
	templateUrl: './workflow-dashboard.component.html',
	styleUrls: ['./workflow-dashboard.component.scss']
})
export class WorkflowDashboardComponent implements OnInit {
	
	doughnutChartDatasets : any = {};
	doughnutChartOptions : any = {};
	ChartDataLabelsPlugins = [ ChartDataLabels ];
	@ViewChild( 'clients', { read: ViewContainerRef } ) clients: ViewContainerRef;
	@ViewChild( 'suppliers', { read: ViewContainerRef } ) suppliers: ViewContainerRef;
	@ViewChild( 'accounts', { read: ViewContainerRef } ) accounts: ViewContainerRef;
	@ViewChild( 'prospects', { read: ViewContainerRef } ) prospects: ViewContainerRef;
	workFlowData: Object = {};

	dashboardCardItems: Array<{ field: WorkflowPageType, header: Capitalize< WorkflowPageType >, routerLink: string, cardTheme: string, icon: string }> = [
		{ field: 'clients', header: 'Clients', routerLink: '/workflow/clients', cardTheme: 'cyan', icon: 'badge' },
		{ field: 'suppliers', header: 'Suppliers', routerLink: '/workflow/suppliers', cardTheme: 'indigo', icon: 'emoji_transportation' },
		// { field: 'prospects', header: 'Prospects', routerLink: '/workflow/prospects', cardTheme: 'purple', icon: 'fact_check' },
		{ field: 'accounts', header: 'Accounts', routerLink: '/workflow/accounts', cardTheme: 'orange', icon: 'manage_accounts' }
	]

	colorForWorkflowMsme = colorMSME;

	constructor(
		private toCurrencyPipe: CurrencyPipe,
		private router: Router,
		public commonService: CommonServiceService,
		private serverCommunicationService: ServerCommunicationService,
		private _sharedLoaderService: SharedLoaderService,
		private _workflowService: WorkflowService,
		private userAuthService: UserAuthService,
	) {}

	ngOnInit() {

		this.getWorflowData();
		let listIds = this.userAuthService.getUserInfo()?.['userCommercialIds'];
        
        listIds?.map( (val)=> {
            this._workflowService.updateListId( val.listName, val._id );
        });
	}

	getWorflowData() {

		this._sharedLoaderService.showLoader();

		this.serverCommunicationService.globalServerRequestCall( 'get', 'DG_CHART_API', 'workflowDashBoard' ).subscribe( {

			next: ( res ) => {
				if ( res.body.status == 200 ) {
					this.workFlowData = res.body.results;

					for ( let key in this.workFlowData ) {
			
						/* Prepare Data for Doughnut of Risk Profile */
						this.getRiskAnalysisData( this.workFlowData[ key ][ 'riskChartArray' ], key );
			
						/* Prepare Data for Map of Region*/
						if ( this.workFlowData?.[ key ]?.[ 'region' ] && this.workFlowData[ key ][ 'region' ].length ) {
							this.initLeafletMapContainer( this.workFlowData[ key ][ 'region' ], key as WorkflowPageType );
						}
			
					}
				}
				this._sharedLoaderService.hideLoader();
			},

			error: ( err ) => {
				setTimeout(() => {
					this._sharedLoaderService.hideLoader();
				}, 100);
				console.log(err);
			}
		} )

	}

	getRiskAnalysisData( riskArray?, chartFor? ) {

		let chartLabels = [], chartDataset = [], backgroudColor = [];

		this.doughnutChartOptions[ chartFor ] = {
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
						value = this.toCurrencyPipe.transform( value, '', '', '1.0-2' );
						return value;
					}
				},
				legend: {
					display: false,
				},
				tooltip: {
					enabled: true
				},
			},
			onHover: (event, elements) => {
				event.native.target.style.cursor = chartFor ? "pointer" : "default";
			},
			onClick: ( event, elements, chart ) => {
				onChartElementClick( event.native, elements, chart, chartFor );
			}
		}

		const onChartElementClick = ( event, elements, chart, chartFor ) => {
			
			let chartdetails = chart.config.data;
			this._workflowService.setActivePage = chartFor;
			let listDetail = this._workflowService.getActiveListParams;

			if ( chartdetails && elements && elements.length) {

				let	targetLabel = chartdetails.labels[ elements[0].index];

				let statsButtonVisible = true;
		
				if ( [ targetLabel ].includes( 'Not Specified' ) ) {
					statsButtonVisible = false;
				}

				let navigateUrlParamObject = [];
	
				let chipGroup = 'Bands';
				navigateUrlParamObject = navigateUrlParamObject.filter( val => val.chip_group !== 'Bands' );
	
				navigateUrlParamObject.push(
					{ chip_group: 'Saved Lists', chip_values: [ listDetail.displayName ] },
					{ chip_group: chipGroup, chip_values: [ targetLabel != 'Not Scored / Very High Risk' ? targetLabel.toLowerCase() : 'not scored' ] }
				);

				const { cListId, listName, listPageName } = listDetail;
	
				let urlStr: string;

				urlStr = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(navigateUrlParamObject), cListId: cListId, listPageName: listPageName, hideStatsButton: statsButtonVisible, listName: listName } }));

				window.open( urlStr, '_blank' );
			}
			
		}

		for ( let riskItem of riskArray ) {

			chartLabels.push( this.commonService.camelCaseToSentence( riskItem[ 'field' ].trim() ) );

			if ( riskItem[ 'field' ] == 'notSpecified' ) continue;
			chartDataset.push( riskItem[ 'count' ] );

			if ( riskItem[ 'field' ] == 'notSpecified' ) continue;
			backgroudColor.push(this.formatBgColorForPieChart( riskItem[ 'field' ] ));

		}

		chartLabels = JSON.parse(JSON.stringify(chartLabels));
		let indx = chartLabels.indexOf("Not Scored");
		indx != -1 ? chartLabels[indx] = "Not Scored / Very High Risk" : chartLabels;

		this.doughnutChartDatasets[ chartFor ] = {
			labels: chartLabels,
			datasets: [
				{
					data: chartDataset,
					backgroundColor: backgroudColor
				}
			]
		};
	}

	formatBgColorForPieChart( inputData ) {

		let finalResult = '';

		switch ( inputData ) {
			case 'veryLowRisk':
				finalResult = '#6DC470';
				break;

			case 'lowRisk':
				finalResult = '#59BA9B';
				break;

			case 'moderateRisk':
				finalResult = '#FFC201';
				break;

			case 'highRisk':
				finalResult = '#E4790F';
				break;
				
			case 'notScored':
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

	async initLeafletMapContainer( currentYearData: Array< { [key: string]: unknown } >, containerName: WorkflowPageType ) {
		
		const { LazyLeafletMapComponent } = await import('../../../shared-components/lazy-leaflet-map/lazy-leaflet-map.component');

		const MapContainerRef: ViewContainerRef = this[ containerName ]; // this[ containerName ] is same as like as 'this.clients | this.suppliers | ...'
		MapContainerRef.clear();

		const { cardTheme } = this.dashboardCardItems.find( item => item.field == containerName );

		const { instance } = MapContainerRef.createComponent( LazyLeafletMapComponent );
		instance.mapConfig.primaryMapId = `${ containerName }MapContainer`;
		instance.mapConfig.primaryMapColorTheme = cardTheme;
		instance.mapData = { currentYearData: currentYearData, listDataParams: { listID: this._workflowService.getListParamsForPage( containerName ).cListId, listPageName: this._workflowService.getListParamsForPage( containerName ).listPageName, listName: this._workflowService.getListParamsForPage( containerName ).listName, displayName: this._workflowService.getListParamsForPage( containerName ).displayName } };
		instance.requiredData = { thisPage: 'statsInsights' };
		
	}

	preventDefault() {
		return 0;
	}

}
