import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Message } from 'primeng/api';
import { UIChart } from 'primeng/chart';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { subscribedPlan } from 'src/environments/environment';

@Component({
	selector: 'dg-insights-monthly',
	templateUrl: './insights-monthly.component.html',
	styleUrls: ['../../insights-component.scss', './insights-monthly.component.scss']
})
export class InsightsMonthlyComponent implements OnInit {

	@ViewChild( 'LazyLeafletMapContainer', { read: ViewContainerRef } ) LazyLeafletMapContainer: ViewContainerRef;

	@ViewChild('insightLineChart', { static: false }) public insightLineChart: UIChart;
	@ViewChild('insightBarChart', { static: false }) public insightBarChart: UIChart;

	insightsLayoutModeDark: boolean = false;
	lineData: any;
	barData: any;
	doughnutData: any;
	lineOptions: any;
	barOptions: any;
	doughnutOptions: any;
	ccjData: any = undefined;
	chargesData: any = undefined;
	companiesRegisteredData: any = undefined;
	companyLiquidationData: any = undefined;
	companyDissolvedData: any = undefined;
	mapData1: Array<any> = undefined;
	title: string = '';
	description: string = '';

	lineDataColumns: Array<any> = [
		{ field: 'label', header: 'Month', width: 'auto', textAlign: 'left' },
		{ field: 'count', header: 'Count', width: 'auto', textAlign: 'center' },
	];
	barDataColumns: Array<any> = [
		{ field: 'label', header: 'Year', width: 'auto', textAlign: 'left' },
		{ field: 'count', header: 'Count', width: 'auto', textAlign: 'center' },
	];
	industryTableColumns: Array<any> = [
		{ field: 'label', header: 'Industry', width: 'auto', textAlign: 'left' },
		{ field: 'count', header: 'Count', width: 'auto', textAlign: 'center' },
	];

	lineDataTableValues: Array<any> = undefined;
	barDataTableValues: Array<any> = undefined;
	industryTableValues: Array<any> = undefined;
	heading: string = "";
	activeTab: string = 'ccj';
	windowInnerWidth: number;

	insightsCategoryOptions: Array<any> = [
		{ label: 'Companies Registered', value: 'company_registration_data', chipGroup: 'Incorporation Date' },
		{ label: 'CCJ\'s Filed', value: 'ccj_data', chipGroup: 'CCJ Date' },
		{ label: 'Charges Registered', value: 'charges_data', chipGroup: 'Charges Registered Date' }
	];

	mapDataObj = {};
	mapData1Obj = new Map();

	mapData: any = undefined;
	industry: any = undefined;
	highlighter: any = undefined;

	currentMapData: any = undefined;

	currentYear;
	previousYear;

	popUpProps: any;

	str: any;

	selectedInsightsCategory: any = 'company_registration_data';
	selectedIndustryList: any;
	selectedData: any;

	msgLogs: Message[] = [];

	subscribedPlanModal: any = subscribedPlan;
	currentPlan: unknown;

	industryListOptions: Array<object> = [
		{ label: 'Choose Industry', value: undefined },
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

	monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	currentDate = new Date();
	currentMonthName: any;
	previousMonthName: any;
	previousEndMonthAgo: any;
	previousEndMonth: any;

	constructor(
		public userAuthService: UserAuthService,
		private seoService: SeoService,
		private componentFactoryResolver: ComponentFactoryResolver,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunicate: ServerCommunicationService
	) {
		this.currentPlan = this.userAuthService?.getUserInfo('planId');
	}

	ngOnInit() {

		this.initBreadcrumbAndSeoMetaTags();
		
		let currentMonthIndex = this.currentDate.getMonth();
		let getFullYearValue = new Date().getFullYear();

		this.currentYear = currentMonthIndex == 0 ? (getFullYearValue - 1) : getFullYearValue;
		this.previousYear = [ 0, 1 ].includes( currentMonthIndex ) ? (getFullYearValue - 1) : getFullYearValue;
			
		this.currentMonthName = this.monthNames[ ( currentMonthIndex == 0 ? 12 : currentMonthIndex ) - 1 ];
		this.previousMonthName = this.monthNames[ ( currentMonthIndex == 0 ? 12 : currentMonthIndex == 1 ? 13 : currentMonthIndex ) - 2 ];
		
		this.previousEndMonth =  ( currentMonthIndex == 0 ? 12 : currentMonthIndex );
		this.previousEndMonthAgo = ( currentMonthIndex == 0 ? 12 : currentMonthIndex == 1 ? 13 : currentMonthIndex ) - 1 ;

		if (this.previousEndMonthAgo < 10) {
			this.previousEndMonthAgo = "0" + this.previousEndMonthAgo.toString();
		}
		if (this.previousEndMonth < 10) {
			this.previousEndMonth = "0" + this.previousEndMonth.toString();
		}

		this.getCCJDataMonthly();
		this.getChargesDataMonthly();
		this.getCompaniesRegisteredDataMonthly();

		// Map API Calling
		this.sharedLoaderService.showLoader();
		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getMapDataNew').subscribe(res => {
			if (res.body.status == 200) {
				this.mapData = res.body.results;

				this.onCategoryIndustryChange(undefined, this.selectedInsightsCategory, this.selectedIndustryList);
			}
			this.sharedLoaderService.hideLoader();
		})
		// Map API Calling

	}

	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems([
		// 	{ label: 'Insights - Monthly', routerLink: ['/insights/insights-monthly'] }
		// ]);
		this.title = "DataGardener Insight - Automate your marketing workflows";
		this.description = "Get in-depth analytics of company CCJ, Charges, complaint registered against companies, dissolved and liquidation date.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setMetaTitle(this.title);
		this.seoService.setDescription(this.description);
	
	}

	onCategoryIndustryChange(event?: any, optCategory?: string, optIndustry?: string) {
		if(optIndustry && optIndustry['label'] =="Choose Industry" && optIndustry['value'] == undefined){
			optIndustry = undefined
		}
		let filteredCurrentYrData = {}, filteredPrevYrData = {}, graphChartData = {};

		/*=============================
		 For Maps
		=============================*/
		if( this.mapData['previousMonthData'] ) {

			for (let prevYrKey in this.mapData['previousMonthData']) {
	
				if (optCategory == prevYrKey) {
					for (let regionData of this.mapData['previousMonthData'][prevYrKey]["result"]) {
	
						if (optIndustry) {
							for (let industryData of regionData['industries']) {
	
								if (optIndustry == industryData.industry) {
									filteredPrevYrData[regionData.region.split(' ').join('_')] = industryData.count;
								}
	
							}
						} else {
							filteredPrevYrData[regionData.region.split(' ').join('_')] = regionData.count;
						}
	
					}
				}
	
			}

		}

		if( this.mapData['currentMonthData'] ) {

			for (let currentYrKeys in this.mapData['currentMonthData']) {
	
				if (optCategory == currentYrKeys) {
					for (let regionData of this.mapData['currentMonthData'][currentYrKeys]["result"]) {
	
						if (optIndustry) {
							for (let industryData of regionData['industries']) {
	
								if (optIndustry == industryData.industry) {
									filteredCurrentYrData[regionData.region.split(' ').join('_')] = industryData.count;
								}
	
							}
						} else {
							filteredCurrentYrData[regionData.region.split(' ').join('_')] = regionData.count;
						}
					}
				}
	
			}

		}

		this.initLeafletMapContainer( filteredPrevYrData, filteredCurrentYrData );

		/*=============================
		 For Charts
		=============================*/
		let chartLegendLabel;

		for (let val of this.insightsCategoryOptions) {
			if (val.value == optCategory) {
				chartLegendLabel = val.label;
			}
		}

		if (optCategory == 'ccj_data') {

			let x = new Map();

			for (let industry of this.industryListData) {
				x.set(industry["value"], 0);
			}

			if( this.mapData.previousMonthData && this.mapData.previousMonthData.ccj_data['result'] ) {

				for (let dataObject of this.mapData.previousMonthData.ccj_data['result']) {
					for (let dataIndustry of dataObject.industries) {
						let tempCount = 0;
						tempCount = x.get(dataIndustry.industry);
						tempCount += dataIndustry.count;
						x.set(dataIndustry.industry, tempCount);
					}
				}

			}

			this.industryListData.forEach((e) => {
				let tempCount = x.get(e["value"]);
				e["doc_count_previous_month"] = tempCount;
			});

			let y = new Map();

			for (let industry of this.industryListData) {
				y.set(industry["value"], 0);
			}

			if( this.mapData.currentMonthData && this.mapData.currentMonthData.ccj_data['result'] ) {

				for (let dataObject of this.mapData.currentMonthData.ccj_data['result']) {
					for (let dataIndustry of dataObject.industries) {
						let tempCount = 0;
						tempCount = y.get(dataIndustry.industry);
						tempCount += dataIndustry.count;
						y.set(dataIndustry.industry, tempCount);
					}
				}

			}

			this.industryListData.forEach((e) => {
				let tempCount = y.get(e["value"]);
				e["doc_count_current_month"] = tempCount;
			});

		} else if (optCategory == 'charges_data') {

			let x = new Map();

			for (let industry of this.industryListData) {
				x.set(industry["value"], 0);
			}

			if( this.mapData.previousMonthData && this.mapData.previousMonthData.charges_data['result'] ) {
				
				for (let dataObject of this.mapData.previousMonthData.charges_data['result']) {
					for (let dataIndustry of dataObject.industries) {
						let tempCount = 0;
						tempCount = x.get(dataIndustry.industry);
						tempCount += dataIndustry.count;
						x.set(dataIndustry.industry, tempCount);
					}
				}

			}

			this.industryListData.forEach((e) => {
				let tempCount = x.get(e["value"]);
				e["doc_count_previous_month"] = tempCount;
			});

			let y = new Map();

			for (let industry of this.industryListData) {
				y.set(industry["value"], 0);
			}

			if( this.mapData.currentMonthData && this.mapData.currentMonthData.charges_data['result'] ) {

				for (let dataObject of this.mapData.currentMonthData.charges_data['result']) {
					for (let dataIndustry of dataObject.industries) {
						let tempCount = 0;
						tempCount = y.get(dataIndustry.industry);
						tempCount += dataIndustry.count;
						y.set(dataIndustry.industry, tempCount);
					}
				}
				
			}

			this.industryListData.forEach((e) => {
				let tempCount = y.get(e["value"]);
				e["doc_count_current_month"] = tempCount;
			});

		} else if (optCategory == 'company_registration_data') {

			let x = new Map();

			for (let industry of this.industryListData) {
				x.set(industry["value"], 0);
			}

			if ( this.mapData.previousMonthData ) {

				for (let dataObject of this.mapData.previousMonthData.company_registration_data['result']) {
					for (let dataIndustry of dataObject.industries) {
						let tempCount = 0;
						tempCount = x.get(dataIndustry.industry);
						tempCount += dataIndustry.count;
						x.set(dataIndustry.industry, tempCount);
					}
				}

			}


			this.industryListData.forEach((e) => {
				let tempCount = x.get(e["value"]);
				e["doc_count_previous_month"] = tempCount;
			});

			let y = new Map();

			for (let industry of this.industryListData) {
				y.set(industry["value"], 0);
			}

			if ( this.mapData.currentMonthData ) {

				for (let dataObject of this.mapData.currentMonthData.company_registration_data['result']) {
					for (let dataIndustry of dataObject.industries) {
						let tempCount = 0;
						tempCount = y.get(dataIndustry.industry);
						tempCount += dataIndustry.count;
						y.set(dataIndustry.industry, tempCount);
					}
				}

			}

			this.industryListData.forEach((e) => {
				let tempCount = y.get(e["value"]);
				e["doc_count_current_month"] = tempCount;
			});

		}

		if (this.insightsLayoutModeDark) {
			this.darkLayout();
		} else {
			this.lightLayout();
		}
	}

	async initLeafletMapContainer( previousYearData, currentYearData ) {

		const { LazyLeafletMapComponent } = await import('../../../../shared-components/lazy-leaflet-map/lazy-leaflet-map.component');

		this.LazyLeafletMapContainer.clear();

		const { instance } = this.LazyLeafletMapContainer.createComponent( LazyLeafletMapComponent );
		instance.mapConfig.primaryMapId = `insightsMonthlyPrimaryMapContainer`;
		instance.mapConfig.secondaryMapId = `insightsMonthlySecondaryMapContainer`;
		instance.mapData = { previousYearData: previousYearData, currentYearData: currentYearData };
		instance.requiredData = { 
			thisPage: 'insightsMonthly', 
			insightsCategoryOptions: this.insightsCategoryOptions, 
			selectedInsightsCategory: this.selectedInsightsCategory, 
			industryListOptions: this.industryListOptions, 
			currentMonthName: this.currentMonthName, 
			previousMonthName: this.previousMonthName, 
			currentYear: this.currentYear, 
			previousYear: this.previousYear,
			startMonth: this.previousEndMonthAgo,
			endMonth: this.previousEndMonth,
			selectedIndustryList: this.selectedIndustryList
		};

	}

	getCCJDataMonthly() {
		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getCCJChartDataMonthly').subscribe(res => {
				if (res.body.status == 200) {
					this.ccjData = res.body.results;
				}
			}
		)
	}

	getChargesDataMonthly() {
		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getChargesChartDataMonthly').subscribe(res => {
				if (res.body.status == 200) {
					this.chargesData = res.body.results;
				}
			}
		)
	}

	getCompaniesRegisteredDataMonthly() {
		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_LIST', 'getRegistrationChartDataMonthly').subscribe(res => {
				if (res.body.status == 200) {
					this.companiesRegisteredData = res.body.results;
				}
			}
		)
	}


	formatDataForGraph(dataArray, src) {

		let tempArray = [];

		if (dataArray) {

			if (src == "label") {

				for (let dataVal of dataArray) {
					tempArray.push(dataVal.label);
				}

			} else if (src == "data") {

				for (let dataVal of dataArray) {

					if (this.selectedIndustryList) {

						for (let industryObj of dataVal.industries) {

							if (this.selectedIndustryList == industryObj.industry) {
								tempArray.push(industryObj.count);
							}

						}

					} else {
						tempArray.push(dataVal.count);
					}
				}

			}

		}

		return tempArray;
	}

	darkLayout() {
		let _this = this;
		setTimeout(() => {
			this.insightsLayoutModeDark = true;
		}, 0);
	}

	lightLayout() {

		let _this = this;
		setTimeout(() => {;
			this.insightsLayoutModeDark = false;
		}, 0);
	}

}
