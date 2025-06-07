import { HttpClient } from '@angular/common/http';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Message } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { environment, subscribedPlan } from 'src/environments/environment';

@Component({
	selector: 'dg-furlough-insights',
	templateUrl: './furlough-insights.component.html',
	styleUrls: ['../../insights-component.scss', './furlough-insights.component.scss']
})
export class FurloughInsightsComponent implements OnInit {

	@ViewChild('LazyLeafletMapContainer', { read: ViewContainerRef }) LazyLeafletMapContainer: ViewContainerRef;

	insightsLayoutModeDark: boolean = false;

	title: string = '';
	description: string = '';

	mapData: any = undefined;

	msgLogs: Message[] = [];

	selectedRegion: string = 'Scotland';
	furloughAmountBandListData: any;
	industryListData: Array<object> = [
		{ label: 'A - agriculture forestry and fishing', value: 'agriculture forestry and fishing' },
		{ label: 'B - mining and quarrying', value: 'mining and quarrying' },
		{ label: 'C - manufacturing', value: 'manufacturing' },
		{ label: 'D - electricity, gas, steam and air conditioning supply', value: 'electricity, gas, steam and air conditioning supply' },
		{ label: 'E - water supply, sewerage, waste management and remediation activities', value: 'water supply, sewerage, waste management and remediation activities' },
		{ label: 'F - construction', value: 'construction' },
		{ label: 'G - wholesale and retail trade; repair of motor vehicles and motorcycles', value: 'wholesale and retail trade; repair of motor vehicles and motorcycles' },
		{ label: 'H - transportation and storage', value: 'transportation and storage' },
		{ label: 'I - accommodation and food service activities', value: 'accommodation and food service activities' },
		{ label: 'J - information and communication', value: 'information and communication' },
		{ label: 'K - financial and insurance activities', value: 'financial and insurance activities' },
		{ label: 'L - real estate activities', value: 'real estate activities' },
		{ label: 'M - professional, scientific and technical activities', value: 'professional, scientific and technical activities' },
		{ label: 'N - administrative and support service activities', value: 'administrative and support service activities' },
		{ label: 'O - public administration and defence; compulsory social security', value: 'public administration and defence; compulsory social security' },
		{ label: 'P - education', value: 'education' },
		{ label: 'Q - human health and social work activities', value: 'human health and social work activities' },
		{ label: 'R - arts, entertainment and recreation', value: 'arts, entertainment and recreation' },
		{ label: 'S - other service activities', value: 'other service activities' },
		{ label: 'T - activities of households as employers; undifferentiated goods- and services-producing activities of households for own use', value: 'activities of households as employers; undifferentiated goods- and services-producing activities of households for own use' },
		{ label: 'U - activities of extraterritorial organisations and bodies', value: 'activities of extraterritorial organisations and bodies' }
	];

	subscribedPlanModal: any = subscribedPlan;
	currentPlan: unknown;

	constructor(
		public userAuthService: UserAuthService,
		private seoService: SeoService,
		private http: HttpClient,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunicate: ServerCommunicationService,
		private componentFactoryResolver: ComponentFactoryResolver,
	) {
		this.currentPlan = this.userAuthService?.getUserInfo('planId');
	}

	ngOnInit() {
		
		this.initBreadcrumbAndSeoMetaTags();

		this.sharedLoaderService.showLoader();

		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getFurloughMapData').subscribe(res => {
			if (res.body.status == 200) {

				this.mapData = res.body.results['furloughData'];

				this.initLeafletMapContainer( this.mapData );

				this.setIndustryWiseFurloughCounts();

			}
			this.sharedLoaderService.hideLoader();
		});

		this.getAggregateByParam()

	}

	async getAggregateByParam() {

		const res = await firstValueFrom( this.http.post<any>(`${environment.server}/dg-searchApi/getAggregateByParam`, { "aggregateBy": "amountBandsInPounds.keyword" }, { withCredentials: true }) );
		this.furloughAmountBandListData = res.distinct_categories.buckets;

	}
	
	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems([
		// 	{ label: 'Furlough Insights', routerLink: ['/insights/furlough-insights'] }
		// ]);
		this.title = "DataGardener Insight - Automate your marketing workflows";
		this.description = "Get in-depth analytics of Furlough Data of a company.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setMetaTitle(this.title);
		this.seoService.setDescription(this.description);
	
	}

	setIndustryWiseFurloughCounts() {

		for (let dataObject of this.mapData) {

			if (this.selectedRegion.toLowerCase() == dataObject.region) {

				for (let dataIndustry of dataObject.industries) {

					for (let industry of this.industryListData) {

						if (industry['value'] == dataIndustry['industry']) {
							industry['doc_count'] = dataIndustry['count'];
						}

					}

				}

			}

		}

	}

	async initLeafletMapContainer( currentYearData ) {
		
		const { LazyLeafletMapComponent } = await import('../../../../shared-components/lazy-leaflet-map/lazy-leaflet-map.component');

		this.LazyLeafletMapContainer.clear();
		
		const { instance } = this.LazyLeafletMapContainer.createComponent( LazyLeafletMapComponent );
		instance.mapConfig.primaryMapId = `furloughInsightsMapContainer`;
		instance.mapData = { currentYearData: currentYearData };
		instance.requiredData = { 
			thisPage: 'furloughInsights', 
			industryListData: this.industryListData, 
			selectedRegion: this.selectedRegion 
		};

		instance.mapGeoJsonOutput.subscribe(res => {
			this.selectedRegion = res;
		});

	}

}
