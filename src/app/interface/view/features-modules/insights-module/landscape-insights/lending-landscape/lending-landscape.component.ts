import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/api';
import { UIChart } from 'primeng/chart';
import { MultiSelect } from 'primeng/multiselect';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';
import { SeoService } from 'src/app/interface/service/seo.service';
import { ServerCommunicationService } from 'src/app/interface/service/server-communication.service';
import { SharedLoaderService } from 'src/app/interface/view/shared-components/shared-loader/shared-loader.service';
import { subscribedPlan } from 'src/environments/environment';
import { SearchCompanyService } from '../../../search-company/search-company.service';
import { UserAuthService } from 'src/app/interface/auth-guard/user-auth/user-auth.service';
import { lastValueFrom, pluck } from 'rxjs';

export enum Month {
	undefined, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
}

@Component({
	selector: 'dg-lending-landscape',
	templateUrl: './lending-landscape.component.html',
	styleUrls: ['../../insights-component.scss', './lending-landscape.component.scss']
})
export class LendingLandscapeComponent implements OnInit, OnDestroy {

	@ViewChild('LazyLeafletMapContainer', { read: ViewContainerRef }) LazyLeafletMapContainer: ViewContainerRef;

	@ViewChild('ablInsightsLineChart', { static: false }) public ablInsightsLineChart: UIChart;
	@ViewChild('multiSelectLenders', { static: false }) public multiSelectLenders: MultiSelect;
	@ViewChild('multiSelectTags', { static: false }) public multiSelectTags: MultiSelect;
	@ViewChild('multiSelectYears', { static: false }) public multiSelectYears: MultiSelect;
	@ViewChild('multiSelectMonths', { static: false }) public multiSelectMonths: MultiSelect;
	@ViewChild('multiSelectIndustry', { static: false }) public multiSelectIndustry: MultiSelect;
	@ViewChild('multiSelectRegion', { static: false }) public multiSelectRegion: MultiSelect;
	@ViewChild('multiSelectTurnover', { static: false }) public multiSelectTurnover: MultiSelect;

	subscribedPlanModal: any = subscribedPlan;
	currentPlan: unknown;

	title: any;
	lineOptions: any;
	description: any;
	selectedTagsName: any;
	selectedRegionList: any;
	selectedTurnoverList: any;
	ablInsightsMapData: any;
	selectedChargeStatus: any;
	selectedYearOfCharge: any;
	selectedMonthOfCharge: any;
	selectedIndustryList: any;
	selectedOrganizationName: any;
	ablInsightsLineChartData: any;
	monthsEnum: any = Month;
	companyAgeLessThanOrGreaterThan: string = 'less';
	checkEstimatedTurnover: string = 'true';
	nameOrNumberValue: number;
	mapGeoJSON: any = { type: "FeatureCollection", features: [] };
	labelForMap: any;

	turnoverGreaterThan: number;
	turnoverLessThan: number;
	// isFilterSidebarShow: boolean = false;

	resetAppliedFiltersBoolean: boolean = false;

	fullListOfOrganizationOptions: Array<{ label: string, value: string }> = [];
	fullListOfTagsOptions: Array<{ label: string, value: string }> = [];
	listOfOrganizationOptions: Array<{ label: string, value: string }> = [];
	listOfTagsOptions: Array<{ label: string, value: string }> = [];

	listOfChargeStatusOptions: Array<{ label: string, value: string }> = [
		{ label: 'Select All Status', value: '' }
	];
	chargeStatusDataCounts: Array<{ label: string, count: string }> = [
		{ label: 'Outstanding', count: '' },
		{ label: 'Part Satisfied', count: '' },
		{ label: 'Fully Satisfied', count: '' }
	];

	listOfChargeYearOptions: Array<{ label: string, value: string }> = [
		{ label: 'Select All Years', value: '' }
	];

	listOfChargeMonthOptions: Array<{ label: string, value: string }> = [
		{ label: 'Select All Months', value: '' }
	];

	industryListDropdownOptions: Array<object> = [
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

	regionListDropdownOptions: Array<{ label: string, value: string }>;

	industryListColumns: Array<object> = [];
	industryListData: Array<object> = [
		{ industryName: 'A - agriculture forestry and fishing', industrySicCodeValue: 'agriculture forestry and fishing' },
		{ industryName: 'B - mining and quarrying', industrySicCodeValue: 'mining and quarrying' },
		{ industryName: 'C - manufacturing', industrySicCodeValue: 'manufacturing' },
		{ industryName: 'D - electricity, gas, steam and air conditioning supply', industrySicCodeValue: 'electricity, gas, steam and air conditioning supply' },
		{ industryName: 'E - water supply, sewerage, waste management and remediation activities', industrySicCodeValue: 'water supply, sewerage, waste management and remediation activities' },
		{ industryName: 'F - construction', industrySicCodeValue: 'construction' },
		{ industryName: 'G - wholesale and retail trade; repair of motor vehicles and motorcycles', industrySicCodeValue: 'wholesale and retail trade; repair of motor vehicles and motorcycles' },
		{ industryName: 'H - transportation and storage', industrySicCodeValue: 'transportation and storage' },
		{ industryName: 'I - accommodation and food service activities', industrySicCodeValue: 'accommodation and food service activities' },
		{ industryName: 'J - information and communication', industrySicCodeValue: 'information and communication' },
		{ industryName: 'K - financial and insurance activities', industrySicCodeValue: 'financial and insurance activities' },
		{ industryName: 'L - real estate activities', industrySicCodeValue: 'real estate activities' },
		{ industryName: 'M - professional, scientific and technical activities', industrySicCodeValue: 'professional, scientific and technical activities' },
		{ industryName: 'N - administrative and support service activities', industrySicCodeValue: 'administrative and support service activities' },
		{ industryName: 'O - public administration and defence; compulsory social security', industrySicCodeValue: 'public administration and defence; compulsory social security' },
		{ industryName: 'P - education', industrySicCodeValue: 'education' },
		{ industryName: 'Q - human health and social work activities', industrySicCodeValue: 'human health and social work activities' },
		{ industryName: 'R - arts, entertainment and recreation', industrySicCodeValue: 'arts, entertainment and recreation' },
		{ industryName: 'S - other service activities', industrySicCodeValue: 'other service activities' },
		{ industryName: 'T - activities of households as employers; undifferentiated goods- and services-producing activities of households for own use', industrySicCodeValue: 'activities of households as employers; undifferentiated goods- and services-producing activities of households for own use' },
		{ industryName: 'U - activities of extraterritorial organisations and bodies', industrySicCodeValue: 'activities of extraterritorial organisations and bodies' }
	];
	industryListMonthsTotal = {};

	msgLogs: Message[] = [];

	globalFilterDataObject: any = {
		filterData: [
			{ chip_group: "Status", chip_values: ["live"] },
			{ chip_group: "Preferences", chip_values: ["Company must have charges details"], preferenceOperator: [{ hasCharges: "true" }] }
		]
	};

	listOfTurnOver: Array<{ label: string, value: Object }> = [
		{ label: '< 1M', value: { greaterThan: undefined, lessThan: '1000000' } },
		{ label: '1M - 5M', value: { greaterThan: '1000000', lessThan: '5000000' } },
		{ label: '5M -10M', value: { greaterThan: '5000000', lessThan: '10000000' } },
		{ label: '10M - 100M', value: { greaterThan: '10000000', lessThan: '100000000' } },
		{ label: '100M - 500M', value: { greaterThan: '100000000', lessThan: '500000000' } },
		{ label: '500M - 1BN', value: { greaterThan: '500000000', lessThan: '1000000000' } },
		{ label: '1BN - 10BN', value: { greaterThan: '1000000000', lessThan: '10000000000' } },
		{ label: '> 10BN', value: { greaterThan: '10000000000', lessThan: undefined } }
	];

	selectedTurnOver: any = { greaterThan: undefined, lessThan: undefined };

	showInputFieldMessage: boolean = false;
	visibleFilterSidebar: boolean = false;
	chartSwitchType = 'yearly';
	selectSICCodeIndustry: any;

	ablLineBarGraphData = { yearlyData: [], monthlyData: [] };
	contactsCount: any;

	constructor(
		private userAuthService: UserAuthService,
		private seoService: SeoService,
		private toNumberSuffix: NumberSuffixPipe,
		private router: Router,
		private componentFactoryResolver: ComponentFactoryResolver,
		private sharedLoaderService: SharedLoaderService,
		private globalServerCommunication: ServerCommunicationService,
		private searchCompanyService: SearchCompanyService,
		private activeRoute: ActivatedRoute,
	) {

		this.currentPlan = this.userAuthService?.getUserInfo('planId');

		if ( !this.userAuthService.hasAddOnPermission('lendingLandscape') && this.subscribedPlanModal['Valentine_Special'] !== this.currentPlan ) {
            this.router.navigate(['/']);
        }

	}
	
	ngOnDestroy() {
        this.searchCompanyService.resetPayload();
        this.searchCompanyService.resetFilterData();
	}

	async ngOnInit() {

		/*
		if ( this.userRoleAndFeatureAuthService.checkUserHasFeatureAccess( 'Global Filter' ) || this.userRoleAndFeatureAuthService.isAdmin() )  {
            this.isFilterSidebarShow = true;
        }
		*/
		const { shareId } = this.activeRoute.snapshot?.queryParams;
		if( shareId ){
			let param = [ 
				{ key:'shareId', value: shareId }
			];
			const CompanyDetailAPIResponse = await lastValueFrom(this.globalServerCommunication.globalServerRequestCall( 'get', 'DG_LIST', 'getSharedCriteriaInfo', undefined, undefined, param ) )

			if ( CompanyDetailAPIResponse.body.status = 200 ) {
				this.searchCompanyService.updatePayload( { filterData: CompanyDetailAPIResponse.body.result.criteria  } );
				this.searchCompanyService.showStatsButton = true;
				this.searchCompanyService.updateFilterPanelApplyButtons();
			}
		}

		this.visibleFilterSidebar = true;
		this.initBreadcrumbAndSeoMetaTags();

		this.selectedYearOfCharge = [''];
		this.selectedMonthOfCharge = [''];

		// Map API Calling
		this.getChargesAblInsightsData();
		// Map API Calling

		this.industryListColumns = [
			{ field: 'industryName', header: 'Industry Name', minWidth: '280px',maxWidth: 'none', textAlign: 'left' },
			{ field: `${this.monthsEnum[1]}`, header: `${this.monthsEnum[1]}`, minWidth: '80px', maxWidth:'80px', textAlign: 'right' },
			{ field: `${this.monthsEnum[2]}`, header: `${this.monthsEnum[2]}`, minWidth: '80px', maxWidth:'80px', textAlign: 'right' },
			{ field: `${this.monthsEnum[3]}`, header: `${this.monthsEnum[3]}`, minWidth: '80px', maxWidth:'80px', textAlign: 'right' },
			{ field: `${this.monthsEnum[4]}`, header: `${this.monthsEnum[4]}`, minWidth: '80px', maxWidth:'80px', textAlign: 'right' },
			{ field: `${this.monthsEnum[5]}`, header: `${this.monthsEnum[5]}`, minWidth: '80px', maxWidth:'80px', textAlign: 'right' },
			{ field: `${this.monthsEnum[6]}`, header: `${this.monthsEnum[6]}`, minWidth: '80px', maxWidth:'80px', textAlign: 'right' },
			{ field: `${this.monthsEnum[7]}`, header: `${this.monthsEnum[7]}`, minWidth: '80px', maxWidth:'80px', textAlign: 'right' },
			{ field: `${this.monthsEnum[8]}`, header: `${this.monthsEnum[8]}`, minWidth: '80px', maxWidth:'80px', textAlign: 'right' },
			{ field: `${this.monthsEnum[9]}`, header: `${this.monthsEnum[9]}`, minWidth: '80px', maxWidth:'80px', textAlign: 'right' },
			{ field: `${this.monthsEnum[10]}`, header: `${this.monthsEnum[10]}`, minWidth: '80px', maxWidth:'80px', textAlign: 'right' },
			{ field: `${this.monthsEnum[11]}`, header: `${this.monthsEnum[11]}`, minWidth: '80px', maxWidth:'80px', textAlign: 'right' },
			{ field: `${this.monthsEnum[12]}`, header: `${this.monthsEnum[12]}`, minWidth: '80px', maxWidth:'80px', textAlign: 'right' },
			{ field: 'totalValues', header: 'Total', minWidth: '80px', maxWidth: '80px', textAlign: 'right' }
		];

	}
	
	initBreadcrumbAndSeoMetaTags() {

		// this.breadcrumbService.setItems([
		// 	{ label: 'Lending Landscape', routerLink: ['/insights/lending'] }
		// ]);

		this.title = "Lending - Automate your marketing workflows";
		this.description = "Get in-depth analytics of company CCJ, Charges, complaint registered against companies, dissolved and liquidation date.";
		this.seoService.setPageTitle(this.title);
		this.seoService.setMetaTitle(this.title);
		this.seoService.setDescription(this.description);
	
	}

	resetInsightCriteria() {
		this.selectedTagsName = [];
		this.selectedOrganizationName = [];
		this.selectedChargeStatus = undefined;
		this.selectedYearOfCharge = [''];
		this.selectedMonthOfCharge = [''];
		this.selectedIndustryList = undefined;
		this.selectedRegionList = undefined;
		this.selectedTurnoverList = undefined;
		this.checkEstimatedTurnover = "true";
		this.selectedTurnOver = undefined;
		this.companyAgeLessThanOrGreaterThan = undefined;
		this.nameOrNumberValue = undefined;
		this.showInputFieldMessage = false;

		this.getChargesAblInsightsData();

		this.multiSelectLenders.filterValue = null;
		this.multiSelectIndustry.filterValue = null;
		this.multiSelectRegion.filterValue = null;
		this.multiSelectTurnover.filterValue = null;
		this.multiSelectTags.filterValue = null;
		this.multiSelectYears.filterValue = null;
		this.multiSelectMonths.filterValue = null;
	}

	getRegionsData( mapGeoJSON ) {

		this.regionListDropdownOptions = [];

		for (let featureObj of mapGeoJSON.features) {
			if (!JSON.stringify(this.regionListDropdownOptions).includes(featureObj.properties.name)) {
				this.regionListDropdownOptions.push({ label: featureObj.properties.name, value: featureObj.properties.name.toLowerCase() });
			}
		}

		this.regionListDropdownOptions.sort((a, b) => a.label.localeCompare(b.label));

		this.regionListDropdownOptions.unshift({ label: 'All', value: null });

	}

	async initLeafletMapContainer( currentYearData ) {

		const { LazyLeafletMapComponent } = await import('../../../../shared-components/lazy-leaflet-map/lazy-leaflet-map.component');

		this.LazyLeafletMapContainer.clear();

		let mapColorTheme = 'teal';

		if ( this.selectedChargeStatus == 'Outstanding' ) {
			mapColorTheme = 'cyan';
		}

		if ( this.selectedChargeStatus == 'Part Satisfied' ) {
			mapColorTheme = 'purple';
		}
		
		const { instance } = this.LazyLeafletMapContainer.createComponent( LazyLeafletMapComponent );
        instance.mapConfig.primaryMapId = `lendingLandscapesMapContainer`;
        instance.mapConfig.primaryMapColorTheme = mapColorTheme;
		instance.mapData = { currentYearData: currentYearData };
		instance.requiredData = {
			thisPage: 'lendingLandscapes',
			selectedRegionList: this.selectedRegionList ? this.selectedRegionList : '',
			selectedTurnoverList: this.selectedTurnoverList ? this.selectedTurnoverList : '',
			// selectedChargeStatus: this.selectedChargeStatus ? this.selectedChargeStatus : '',
			globalFilterDataObject: this.globalFilterDataObject,
			selectedYearOfCharge: this.selectedYearOfCharge,
            selectedMonthOfCharge: this.selectedMonthOfCharge
		}

		instance.mapGeoJsonOutput.subscribe( res => {

			this.getRegionsData( res );
		} );

	}

	async getChargesAblInsightsData() {

		this.sharedLoaderService.showLoader();
		this.showInputFieldMessage = false;

		let ablDataObj = { ...this.globalFilterDataObject };

		//To Remove Duplicate chip group
		if (this.globalFilterDataObject.filterData && this.globalFilterDataObject.filterData.length) {
			const ids = this.globalFilterDataObject.filterData.map(o => o.chip_group);
			this.globalFilterDataObject.filterData = this.globalFilterDataObject.filterData.filter(({ chip_group }, index) => !ids.includes(chip_group, index + 1));
		}

		ablDataObj.filterData = ablDataObj.filterData.filter( item => item.chip_group != 'Status' && item.chip_group != 'Preferences');
		ablDataObj['reqBy'] = 'lendingScreen';

		this.globalServerCommunication.globalServerRequestCall('post', 'DG_API', 'ablData', ablDataObj ).subscribe(async data => {
			let res = data.body;
			if (res.status == 200) {

                this.ablLineBarGraphData['yearlyData'] = res.pieDataYear;
                this.ablLineBarGraphData['monthlyData'] = res.pieData;
				// this.contactsCount = res.contactsCount;
				this.chargeStatusDataCounts[0].count = res.outstanding_count ? res.outstanding_count : 0;
				this.chargeStatusDataCounts[1].count = res.patially_satisfied_count ? res.patially_satisfied_count : 0;
				this.chargeStatusDataCounts[2].count = res.fully_satisfied_count ? res.fully_satisfied_count : 0;

				if (res.mapData) {
					
					this.ablInsightsMapData = res.mapData;
					if ( ![ this.subscribedPlanModal['Valentine_Special'] ].includes( this.currentPlan ) ) {

						this.initLeafletMapContainer( this.ablInsightsMapData );

					}

				}
				
                if ( this.chartSwitchType == 'monthly') {
                    
                    if (this.ablLineBarGraphData['monthlyData']) {
                        await this.setGraphData(this.ablLineBarGraphData['monthlyData']);
                    }
                    
                } else {
                    
                    if (this.ablLineBarGraphData['yearlyData']) {
                        await this.setGraphData(this.ablLineBarGraphData['yearlyData']);
                    }

                }

				if (res.industriesTableData) {
					let industriesTableDataSorted = {};

					for (let industryMonths in this.industryListMonthsTotal) {
						this.industryListMonthsTotal[industryMonths] = 0;
					}

					for (let industryData of res.industriesTableData) {
						for (let industryDataKey in industryData) {
							industriesTableDataSorted[industryDataKey] = industryData[industryDataKey];
						}
					}

					for (let listData of this.industryListData) {

						for (let listKey in listData) {
							if (!['industryName', 'industrySicCodeValue'].includes(listKey)) {
								listData[listKey] = undefined;
							}
						}

						listData['totalValues'] = 0;

						for (let industryDataSortedKey in industriesTableDataSorted) {

							if (listData['industryName'] == industryDataSortedKey) {

								for (let innerIndustryData of industriesTableDataSorted[industryDataSortedKey]) {

									if (this.selectedIndustryList && this.selectedIndustryList.length > 0 && !this.selectedIndustryList.includes(listData['industrySicCodeValue'])) {

										listData['totalValues'] = 0;
										listData[this.monthsEnum[+innerIndustryData.month]] = 0;

									} else {

										listData['totalValues'] += innerIndustryData.count;
										listData[this.monthsEnum[+innerIndustryData.month]] = innerIndustryData.count;

									}

									if (this.industryListMonthsTotal[this.monthsEnum[+innerIndustryData.month]]) {

										this.industryListMonthsTotal[this.monthsEnum[+innerIndustryData.month]] += listData[this.monthsEnum[+innerIndustryData.month]];

									} else {

										this.industryListMonthsTotal[this.monthsEnum[+innerIndustryData.month]] = listData[this.monthsEnum[+innerIndustryData.month]];

									}

								}

							}

						}

					}

				}

			}
			this.resetAppliedFiltersBoolean = false;
			this.sharedLoaderService.hideLoader();

		});
		this.globalServerCommunication.globalServerRequestCall( 'post', 'DG_API', 'searchContactsCountResult', this.globalFilterDataObject).subscribe( res => {
			this.contactsCount = res.body;
		});
	}

	setGraphData(graphData) {

        if ( this.chartSwitchType == 'monthly' && graphData.length ) {

            let lineLabels: Array<any> = [],
                lineChartDataset: Array<any> = [],
                graphDataSorted = graphData.sort((a, b) => +a.month - +b.month);

            if (graphDataSorted && graphDataSorted.length < 3) {
                for (let labels of graphDataSorted) {
                    if (graphDataSorted.length < 3) {
                        if (+graphDataSorted[0].month > 3) {
                            graphDataSorted.unshift({ month: (+graphDataSorted[0].month - 1).toString(), count: 0 });
                        }
                        if (+graphDataSorted[0].month < 3) {
                            graphDataSorted.push({ month: (+graphDataSorted[graphDataSorted.length - 1].month + 1).toString(), count: 0 });
                        }
                    }
                }
            }

            if ( this.selectedMonthOfCharge && this.selectedMonthOfCharge[0] ) {
                graphDataSorted = graphDataSorted.filter( (obj) => obj.month && this.selectedMonthOfCharge.includes(obj.month) )
            }

            for (let graphObj of graphDataSorted) {
                lineLabels.push(this.monthsEnum[+graphObj.month]);
                lineChartDataset.push(graphObj.count);
            }

            this.ablInsightsLineChartData = {
                labels: lineLabels,
                datasets: [
                    {
                        data: lineChartDataset,
                        backgroundColor: "rgba(33, 195, 181, .5)",
                        fill: 'origin',
                        borderColor: '#1eb0a3',
                        pointRadius: 4,
                        pointBackgroundColor: '#21c3b5',
                        borderWidth: 1,
                        pointStyle: 'circle',
						tension: 0.4
                    }
                ]
            }

            this.lineOptions = {
                onClick: (event) => {
                    onLineChartClick(event.native)
                },
                hover: {
                    onHover: (event, elements) => {
                        event.target.style.cursor = elements[0] ? "pointer" : "default";
                    }
                },
                scales: {
                    y: {
						beginAtZero: true,
						ticks: {
							font: {
								size: 10,
								family: 'Roboto',
								weight: "bold"
							},
							color: '#000000',
							callback: (label) => {
								return label ?  this.toNumberSuffix.transform(label, 0) : 0;
							}
						},
						grid: {
							offset: true,
							color: '#e6e6e6'
						}
					},
                    x: {
						ticks: {
							font: {
								size: 10,
								family: 'Roboto',
								weight: "bold"
							},
							color: '#000000',
							padding: 5,
						},
						grid: {
							offset: true,
							color: '#e6e6e6'
						}
					}
                },
                plugins: {
                    datalabels: {
                        display: false
                    },
					legend: {
						display: false
					},
					title: {
						display: true,
						fontFamily: 'Roboto',
						fontSize: 14,
						fontColor: '#000000',
						padding: 20
					},
					tooltip: {
						enabled: true,
						callbacks: {
							label: function (tooltipItem) {
								return tooltipItem.formattedValue;
							}
						}
					},
                }
            }
            let _this = this;
            function onLineChartClick(event) {

				const monthlyPoints = _this.ablInsightsLineChart.chart.getElementsAtEventForMode(event, 'index', { intersect: true }, true)

                if (monthlyPoints.length > 0) {

                    if (lineChartDataset[monthlyPoints[0].index]) {

                        let selectedMonth = lineLabels[monthlyPoints[0].index], selectedMonthIndx;

                        for (let monthIndx in _this.monthsEnum) {
                            if (selectedMonth == _this.monthsEnum[monthIndx]) {
                                selectedMonthIndx = monthIndx.length < 2 ? ('0' + monthIndx) : monthIndx;
                            }
                        }
						
						let chargeMonthArr = JSON.parse( JSON.stringify( _this.globalFilterDataObject.filterData ) ),
                        chargeMonthObj = {
                            chip_group: "Charge Month",
                            chip_values: [selectedMonthIndx],
                        }

                        if (chargeMonthArr.length === 0) {
                            chargeMonthArr.push(chargeMonthObj);
                        } else {
                            let tempArray = chargeMonthArr.filter(obj => obj.chip_group === "Charge Month")
                            if (tempArray.length === 0) {
                                chargeMonthArr.push(chargeMonthObj)
                            } else {
                                let index = chargeMonthArr.indexOf(tempArray[0]);
                                chargeMonthArr.splice(index, 1)
                                chargeMonthArr.push(chargeMonthObj)
                            }

                        }
						
                        let urlStr: string = String(_this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(chargeMonthArr), chargesMonth: selectedMonthIndx.toString(), showFullyOutstanding: false } }));

                        window.open(urlStr, '_blank');

                    };
                    return;
                }
            }

            setTimeout(() => {
                this.ablInsightsLineChart.refresh();
            }, 1000);

        } else {

            let lineLabels = [],
                lineChartDataset: Array<any> = [];
				
            for (let graphObj of graphData) {
				if ( typeof this.labelForMap != 'undefined' ) {
					if( this.labelForMap.includes( graphObj.year ) ) {
						lineLabels.push( graphObj.year );
						graphObj.count = +graphObj.count;
						lineChartDataset.push( graphObj.count.toFixed(2) );
		
					}
				} else {
					lineLabels.push( graphObj.year );
					graphObj.count = +graphObj.count;
					lineChartDataset.push( graphObj.count.toFixed(2) );
						
				}

			}

			lineLabels.sort( ( a, b ) => a - b );
			lineChartDataset.reverse();
			
            this.ablInsightsLineChartData = {
                labels: lineLabels,
                datasets: [
                    {
                        data: lineChartDataset,
                        backgroundColor: "rgba(33, 195, 181, .5)",
                        fill: 'origin',
                        borderColor: '#1eb0a3',
                        pointRadius: 4,
                        pointBackgroundColor: '#21c3b5',
                        borderWidth: 1,
                        pointStyle: 'circle',
						tension: 0.4
                    }
                ]
            }

            this.lineOptions = {
                onClick: (event) => {
                    onLineChartClick(event.native)
                },
				onHover: (event, elements) => {
					event.native.target.style.cursor = elements[0] ? "pointer" : "default";
				},
                scales: {
                    y: {
						beginAtZero: true,
						ticks: {
							font: {
								family: 'Roboto',
								weight: "bold",
	
							},
							color: '#000000',
							callback: (label) => {
								return label ?  this.toNumberSuffix.transform(label, 0) : 0;
							}
						},
						grid: {
							offset: true,
							color: '#e6e6e6'
						}
					},
                    x: {
						ticks: {
							font: {
								size: 10,
								family: 'Roboto',
								weight: "bold"
								
							},
							padding: 5,
							color: '#000000'
						},
						grid: {
							offset: true,
							color: '#e6e6e6'
						}
					}
                },
                plugins: {
                    datalabels: {
                        display: false
                    },
					legend: {
						display: false
					},
					title: {
						display: true,
						font: {
							family: 'Roboto',
							size: 14
						},
						color: '#000000',
						padding: 20
					},
					tooltips: {
						callbacks: {
							label: function (tooltipItem, label) {
								return tooltipItem.formattedValue;
							}
						}
					},
                },
                animation: {
                    duration: 4000,
                    easing: 'easeInOutQuad'
                }

            }

            let _this = this;

            function onLineChartClick(event) {

				const yearlyPoints = _this.ablInsightsLineChart.chart.getElementsAtEventForMode(event, 'index', { intersect: true }, true);
			
                if (yearlyPoints.length > 0) {

                    if (lineChartDataset[ yearlyPoints ] != 0) {
                        
                        let selectedYear = lineLabels[ yearlyPoints[0].index ];
						
                        let chargeYearArr = JSON.parse( JSON.stringify( _this.globalFilterDataObject.filterData ) ),
                        chargeYearObj = {
                            chip_group: "Charge Year",
                            chip_values: [selectedYear],
                        }

                        if (chargeYearArr.length === 0) {
                            chargeYearArr.push(chargeYearObj);
                        } else {
                            let tempArray = chargeYearArr.filter(obj => obj.chip_group === "Charge Year")
                            if (tempArray.length === 0) {
                                chargeYearArr.push(chargeYearObj)
                            } else {
                                let index = chargeYearArr.indexOf(tempArray[0]);
                                chargeYearArr.splice(index, 1)
                                chargeYearArr.push(chargeYearObj)
                            }

                        }

                        let urlStr: string = String(_this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(chargeYearArr), chargeYearArr: chargeYearArr, showFullyOutstanding: false } }));
                        
                        window.open(urlStr, '_blank');

                    };

                    return;

                }

            }

        }

	}

	goToSearchAblForIndustry(industryName, industryValue, chargesMonth, chargeStatus) {
		
		if (industryName == undefined && industryValue == undefined && chargesMonth == undefined) {
			let tampArray = JSON.parse(JSON.stringify(this.globalFilterDataObject.filterData))
			tampArray.push(
				{
					chip_group: "Charges Status",
					chip_values: [chargeStatus]
				}
			);
			
			//To Remove Duplicate chip group
			if (tampArray && tampArray.length) {
				const ids = tampArray.map(o => o.chip_group);
				tampArray = tampArray.filter(({ chip_group }, index) => !ids.includes(chip_group, index + 1));
			}
			let urlStr: string = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(tampArray), showFullyOutstanding: false } }));

			window.open(urlStr, '_blank');

		} else {
			chargesMonth = chargesMonth.toString().padStart(2,'0');

			let industryFilterArray = JSON.parse(JSON.stringify(this.globalFilterDataObject.filterData))
			
			industryFilterArray = industryFilterArray.filter( val => !['SIC Codes', 'Charge Month'].includes(val.chip_group));

			let sicCodeObj = {
				chip_group: "SIC Industry",
				chip_values: [industryValue]
			}
			
			if (industryFilterArray.length === 0) {
				industryFilterArray.push(sicCodeObj);
			} else {
				let tempArray = industryFilterArray.filter(obj => obj.chip_group === "SIC Industry")
				if (tempArray.length === 0) {
					industryFilterArray.push(sicCodeObj)
				} else {
					let index = industryFilterArray.indexOf(tempArray[0]);
					industryFilterArray.splice(index, 1)
					industryFilterArray.push(sicCodeObj)
				}

			}

			let monthObj = {
				chip_group: "Charge Month",
				chip_values: [chargesMonth]
			}
			if (industryFilterArray.length === 0) {
				industryFilterArray.push(monthObj);
			} else {
				let tempArray = industryFilterArray.filter(obj => obj.chip_group === "chargesDataMonth")
				if (tempArray.length === 0) {
					industryFilterArray.push(monthObj)
				} else {
					let index = industryFilterArray.indexOf(tempArray[0]);
					industryFilterArray.splice(index, 1)
					industryFilterArray.push(monthObj)
				}

			}			
			let urlStr: string = String(this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(industryFilterArray), industryFilterArray: industryFilterArray.toString(), showFullyOutstanding: false } }));

			window.open(urlStr, '_blank');
		}
	}

	validateInputField( inputValue ) {

		if ( inputValue > 999 ) {
			this.showInputFieldMessage = true;
		} else {
            this.showInputFieldMessage = false;
        }
		
	}

	resetAppliedFilters() {
		
		this.resetAppliedFiltersBoolean = true;
		this.selectedChargeStatus = '';
		this.selectedRegionList = '';
		this.selectSICCodeIndustry = [];
		this.selectedMonthOfCharge = [];
		this.labelForMap = undefined
		
		this.globalFilterDataObject = {
			filterData: [
				{ chip_group: "Status", chip_values: ["live"] },
				// { chip_group: "Preferences", chip_values: ["Company must have charges details"], preferenceOperator: [{ hasCharges: "true" },{ hasEstimatedTurnover: "true" }] }
				{ chip_group: "Preferences", chip_values: ["Company must have charges details"], preferenceOperator: [ { hasCharges: "true" } ] }
			]
		};
		this.getChargesAblInsightsData();
		
	}

	lendingLandscapeCommunicator( event ) {
		this.globalFilterDataObject.filterData = [];

		this.globalFilterDataObject.filterData.push({ chip_group: "Status", chip_values: ["live"] },
		{ chip_group: "Preferences", chip_values: ["Company must have charges details"], preferenceOperator: [{ hasCharges: "true" } ] })
		
		this.getSelectedChargeStatus( event.selectedChargeStatus );
		
		this.getSelectedChipValues( event.appliedFilters )
		this.globalFilterDataObject.filterData.push(...event.appliedFilters);
		this.getChargesAblInsightsData();
	}

	getSelectedChargeStatus(event) {

		this.selectedChargeStatus = '';
		
		if(event && event.length > 0) {
			this.selectedChargeStatus = event[0].chip_values[0];
		}
	}

	getSelectedChipValues( event ) {
		this.selectSICCodeIndustry = [];
		this.selectedMonthOfCharge = []
		this.selectedRegionList = '';
		for( let val of event ) {
			if( val.chip_group == 'SIC Industry') {
				this.selectSICCodeIndustry = val.chip_values;
			} else if( val.chip_group == 'Region') {
				this.selectedRegionList = val.chip_values;
			} else if( val.chip_group == 'Charge Month') {

				this.selectedMonthOfCharge = val.chip_values;
				
				// if ( this.selectedMonthOfCharge.length > 1 ) {

					// let min = parseInt(this.selectedMonthOfCharge[0]);
					// let max = parseInt(this.selectedMonthOfCharge[1]);
					
					// let allMonths = [];
					// for (var i = min; i <= max; i++) {
					// 	if (i < 10) {
					// 		allMonths.push("0" + i.toString());
					// 	} else {
					// 		allMonths.push(i.toString());
					// 	}
					// }
					
					// this.selectedMonthOfCharge = allMonths;
					
				// }
				
			} else if( val.chip_group == 'Charge Year' ) {
				this.labelForMap = val.chip_values;
				// if( this.labelForMap.length>1 ) {
				// 	this.labelForMap.sort( ( a , b ) => a - b )
				// 	let min = parseInt(this.labelForMap[0]);
				// 	let max = parseInt(this.labelForMap[1]);
				// 	let allYear = [];
	
				// 	for (var i = min; i <= max; i++) {
				// 		allYear.push(i.toString());
				// 	}
				// 	this.labelForMap = allYear;	
				// }
			}
		}
	}

    chartSwitch( switchParam ) {
        this.chartSwitchType = switchParam;
        this.setGraphData( this.ablLineBarGraphData[ switchParam + 'Data' ] );
    }

}
