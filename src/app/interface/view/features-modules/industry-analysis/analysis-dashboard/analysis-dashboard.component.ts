import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UIChart } from 'primeng/chart';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { subscribedPlan } from 'src/environments/environment';
import { SharedLoaderService } from '../../../shared-components/shared-loader/shared-loader.service';
import ChartDataLabels from "chartjs-plugin-datalabels";
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
@Component({
	selector: 'dg-analysis-dashboard',
	templateUrl: './analysis-dashboard.component.html',
	styleUrls: ['./analysis-dashboard.component.scss'],
	providers: [TitleCasePipe, CurrencyPipe]
})
export class AnalysisDashboardComponent implements OnInit {

	subscribedPlanModal: any = subscribedPlan;
	pieChartOptions: any;
	selectedIndustry: any = 'agriculture forestry and fishing';

	ChartDataLabelsPlugins = [ ChartDataLabels ];

	currentPlan: unknown;
	title: string;

	pageSize: number = 25;
	pageNumber: number = 1;

	industryWiseIServiceData: Array<any>;
	iServiceCategories: Array<any> = [];
	iServiceCategoriesChartData: Array<{ year: string, chartData: object }> = [];
	industryListOptions: Array<object> = [
		{ label: 'A - Agriculture Forestry And Fishing', value: 'agriculture forestry and fishing' },
		{ label: 'B - Mining And Quarrying', value: 'mining and quarrying' },
		{ label: 'C - Manufacturing', value: 'manufacturing' },
		{ label: 'D - Electricity, Gas, Steam And Air Conditioning Supply', value: 'electricity, gas, steam and air conditioning supply' },
		{ label: 'E - Water Supply, Sewerage, Waste Management And Remediation Activities', value: 'water supply, sewerage, waste management and remediation activities' },
		{ label: 'F - Construction', value: 'construction' },
		{ label: 'G - Wholesale And Retail Trade; Repair Of Motor Vehicles And Motorcycles', value: 'wholesale and retail trade; repair of motor vehicles and motorcycles' },
		{ label: 'H - Transportation And Storage', value: 'transportation and storage' },
		{ label: 'I - Accommodation And Food Service Activities', value: 'accommodation and food service activities' },
		{ label: 'J - Information And Communication', value: 'information and communication' },
		{ label: 'K - Financial And Insurance Activities', value: 'financial and insurance activities' },
		{ label: 'L - Real Estate Activities', value: 'real estate activities' },
		{ label: 'M - Professional, Scientific And Technical Activities', value: 'professional, scientific and technical activities' },
		{ label: 'N - Administrative And Support Service Activities', value: 'administrative and support service activities' },
		{ label: 'O - Public Administration And Defence; Compulsory Social Security', value: 'public administration and defence; compulsory social security' },
		{ label: 'P - Education', value: 'education' },
		{ label: 'Q - Human Health And Social Work Activities', value: 'human health and social work activities' },
		{ label: 'R - Arts, Entertainment And Recreation', value: 'arts, entertainment and recreation' },
		{ label: 'S - Other Service Activities', value: 'other service activities' },
		{ label: 'T - Activities Of Households As Employers; Undifferentiated Goods- And Services-Producing Activities Of Households For Own Use', value: 'activities of households as employers; undifferentiated goods- and services-producing activities of households for own use' },
		{ label: 'U - Activities Of Extraterritorial Organisations And Bodies', value: 'activities of extraterritorial organisations and bodies' }
	];
	industryAnalysisService: any;

	constructor(
		private userAuthService: UserAuthService,
		private router: Router,
		private seoService: SeoService,
		private sharedLoaderService: SharedLoaderService,
		private commonService: CommonServiceService,
		private globalServerCommunicate: ServerCommunicationService
	) {
		this.commonService.createNestedBreadcrumbs([]);
		this.title = "Industry Sectors - DataGardener";
        this.seoService.setPageTitle( this.title );
	}

	ngOnInit() {

		this.currentPlan = this.userAuthService?.getUserInfo('planId');
		this.getIndustryWiseIServiceData();

	}

	getIndustryWiseIServiceData() {

		this.sharedLoaderService.showLoader();

		let reqObj = [ this.selectedIndustry ];
		this.globalServerCommunicate.globalServerRequestCall( 'get', 'DG_ISCORE', 'iscoreDashboardValuations', reqObj ).subscribe( res => {
			if (res.body['status'] == 200) {
				if (res.body['results'].length) {

					this.industryWiseIServiceData = res.body['results'].sort((a, b) => b['year'] - a['year']);
					this.iServiceCategories = [];
					this.iServiceCategoriesChartData = [];

					let iServiceCategoryObjectModal = [
						{ iserviceCategory: "0", count: 0 },
						{ iserviceCategory: "Dynamic", count: 0 },
						{ iserviceCategory: "Runner", count: 0 },
						{ iserviceCategory: "Joining_League", count: 0 },
						{ iserviceCategory: "Under_Observation", count: 0 }
					]

					for (let iServiceDataObj of this.industryWiseIServiceData) {

						let tempCountsArray = [];

						// Mapping Categories With Model
						for (let iServiceCategory of iServiceDataObj['serviceCategory']) {

							iServiceCategoryObjectModal.every(value => {
								value['count'] = (value['iserviceCategory'] == iServiceCategory['iserviceCategory']) ? iServiceCategory['count'] : value['count'];
								return true;
							});

						}
						// Mapping Categories With Model End
						
						iServiceDataObj['serviceCategory'] = iServiceCategoryObjectModal;

						for (let iServiceCategory of iServiceDataObj['serviceCategory']) {

							if (!this.iServiceCategories.includes(iServiceCategory['iserviceCategory']) && iServiceCategory['iserviceCategory'] !== '0') {
								this.iServiceCategories.push(iServiceCategory['iserviceCategory']);
							}

							if (iServiceCategory['iserviceCategory'] !== '0') {
								tempCountsArray.push(iServiceCategory['count']);
							}

						}

						let checkDataValuesNotZero = tempCountsArray.filter(value => value > 0);

						if (checkDataValuesNotZero.length) {

							this.initPieChartContainer( iServiceDataObj, tempCountsArray );

						}

					}

				} else {
					this.industryWiseIServiceData = [];
					this.iServiceCategories = [];
					this.iServiceCategoriesChartData = [];
				}

			}

			this.sharedLoaderService.hideLoader();
		});
	}

	async initPieChartContainer( iServiceDataObj, countsArray ) {

		// let chartLayoutPadding = window.innerWidth < 1400 ? window.innerWidth < 1200 ? 30 : 40 : 50,
		// 	zoomOutPercentageValue = window.innerWidth < 1500 ? window.innerWidth < 1100 ? 60 : 50 : 40;

		this.pieChartOptions = {
			onClick: (event, elements, chart) => {
				onPieChartClick(event.native, elements, chart);
			},
			onHover: (event, elements) => {
				event.native.target.style.cursor = elements[0] ? "pointer" : "default";
			},
			cutout: 50,
			layout: {
				padding: 10
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
					align: 'center'
				},
				legend: {
					display: false,
				},
				tooltip: {
					enabled: false
				},
			},
		};

		let _this = this;

		function onPieChartClick(event, elements, chart) {
			let chartdetails = chart.config.data

		
			let selectedYear = chartdetails.datasets[0].title;
			let label: UIChart;

			if (elements[0]) {
				label = chartdetails.labels[elements[0].index];
			} else { 
				return;
			}
						
			if (selectedYear == undefined) {
				_this.router.navigate(['/industry-analysis/list-of-companies'], {
					queryParams: {
						industryType: _this.selectedIndustry,
						category: label,
						year: "2021",
						pageSize: _this.pageSize,
						pageNumber: _this.pageNumber
					}
				});
			}
			else {
				_this.router.navigate(['/industry-analysis/list-of-companies'], {
					queryParams: {
						industryType: _this.selectedIndustry,
						category: label,
						year: selectedYear,
						pageSize: _this.pageSize,
						pageNumber: _this.pageNumber
					}
				});
			}
			
		}

		_this.iServiceCategoriesChartData.push({
			year: iServiceDataObj['year'],
			chartData: {
				labels: this.iServiceCategories,
				datasets: [
					{
						data: countsArray,
						backgroundColor: ['#21c3b5', '#1F4286', '#673ab7', '#df2020'],
						title: iServiceDataObj['year']
					}
				]
			}
		});

	}

}