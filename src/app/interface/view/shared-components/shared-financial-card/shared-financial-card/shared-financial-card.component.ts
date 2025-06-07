import { Component, Input, OnInit } from '@angular/core';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { CommonServiceService } from 'src/app/interface/service/common-service.service';

import ChartDataLabels from "chartjs-plugin-datalabels";

// import { BadDeptsComponent, BuyerComponent, CagrComponent, CcjsComponent, ChargesComponent, CommentryComponent, CorporateLandComponent, CreditorsComponent, DirectorsInfoComponent, FinancialsInfoComponent, GroupStructureComponent, ImportExportComponent, InnovateGrantComponent, RatiosComponent, RelatedCompaniesComponent, SafeAlertComponent, ShareholdersComponent, SupplierComponent, ZscoreComponent } from '../../../features-modules/company-details-module/child-components.index';

import { DataCommunicatorService } from '../../../features-modules/company-details-module/data-communicator.service';

@Component({
	selector: 'dg-shared-financial-card',
	templateUrl: './shared-financial-card.component.html',
	styleUrls: ['./shared-financial-card.component.scss']
})
export class SharedFinancialCardComponent implements OnInit {

	@Input() cardData: any;
	@Input() financialBool: any;
	@Input() thisPage: any;

	ChartDataLabelsPlugins = [ ChartDataLabels ];
	miniBarChartOptions: any;

	numberTypeFinancialData: Array<any> = ['zScore', 'cagr', 'creditorDays', 'debtorDays', 'currentRatio', 'quickRatio', 'cashRatio', 'equityInPercentage', 'employeeYearWiseArray', 'equityInPercentage', 'gearingPercentage', 'returnOnCapital', 'returnOnTotalAssets', 'totalDebtRatio', 'grossMarginByTurnoverPercent', 'turnoverByNumberOfEmployees', 'profitBeforeTaxByTurnoverPercent', 'wagesAndSalariesByTurnoverPercent', 'grossMarginByNumberOfEmployees'];
	selectedGlobalCurrency: string = 'GBP';
	constructor(
		public commonService: CommonServiceService,
		public toNumberSuffix: NumberSuffixPipe,
		public dataCommunicatorService: DataCommunicatorService,
	) { }

	ngOnInit() {
		this.selectedGlobalCurrency = localStorage.getItem('selectedGlobalCurrency') ? localStorage.getItem('selectedGlobalCurrency') : 'GBP';

		this.miniBarChartOptions = {
			layout: {
				padding: { top: 8, right: 0, left: 0, bottom: 0 }
			},
			responsive: true,
			barPercentage: 0.6,
			scales: {
				y: {
					display: false,
					grid: {
						display: false,
						drawBorder: false
					}
				},
				x: {
					ticks: {
						font: {
							size: 8.5,
							family: 'Roboto',
							style: 'normal',
						},
						color: '#bbb',
						padding: 0
					},
					grid: {
						display: false,
						drawBorder: false,
					}
				}
			},
			plugins: {
				datalabels: {
					display: (ctx) => {
						return ctx.active ? true : false;
					},
					clamp: true,
					offset: 5,
					color: '#666',
					font: {
						family: 'Roboto',
						size: 13
					},
					backgroundColor: '#ffcc00',
					borderRadius: 4,
					padding: { top: 3, right: 5, left: 5, bottom: 0 },
					formatter: (value, ctx) => {
						return this.toNumberSuffix.transform(value, '2', this.numberTypeFinancialData.includes(ctx.dataset.title) ? '' : this.selectedGlobalCurrency);
					},
					align: (ctx) => {
						let labelPos = 'end';
						if ((ctx.dataset.data[ctx.dataIndex] < 0)) labelPos = 'start';
						if (ctx.dataIndex == 0 || ctx.dataset.data[ctx.dataIndex] == 0) labelPos = 'right';
						if (ctx.dataIndex == (ctx.dataset.data.length - 1)) labelPos = 'left';

						return labelPos;
					}
				},
				legend: {
					display: false
				},
				tooltip: {
					enabled: false
				},
			},
			hover: {
				intersect: false
			},
			animation: {
				duration: 4000,
				easing: 'easeInOutQuad'
			}
		};

	}

	isString(value: any): boolean {
		return typeof value === 'string';
	}

	goToTab( routes: string ) {
		this.dataCommunicatorService.childComponentUpdateData( routes );
	}

}
