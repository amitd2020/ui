import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/api';
import { environment } from 'src/environments/environment';
import * as L from "leaflet";
import { ListPageName } from '../../features-modules/search-company/search-company.constant';
import { StatsAnalysisModule } from 'src/app/stats-analysis/stats-analysis.module';

type MapConfigType = {
	primaryMapId: string,
	primaryMapColorTheme: string,
	secondaryMapId: string,
	secondaryMapColorTheme: string,
}

@Component({
	selector: 'dg-lazy-leaflet-map',
	templateUrl: './lazy-leaflet-map.component.html',
	styleUrls: ['./lazy-leaflet-map.component.scss'],
	standalone: true,
	imports: [ CommonModule, StatsAnalysisModule ]
})
export class LazyLeafletMapComponent implements OnInit {

	@Input( { required: true } ) mapConfig: MapConfigType = {
		primaryMapId: '',
		primaryMapColorTheme: 'teal',
		secondaryMapId: '',
		secondaryMapColorTheme: 'cyan'
	};

	@Input() mapData: any;
	@Input() requiredData: any;
	@Input() itag: any;

	@Output() mapGeoJsonOutput = new EventEmitter<any>();

	currentYearMap: L.Map;
	previousYearMap: L.Map;
	mapGeoJson: any;
	unknownResultOnMap: Array<any> = [] 

	msgLogs: Message[] = []

	currentMonthMapTotal = 0;
	previousMonthMapTotal = 0;

	currentYearMapRegionArray: { label: string, value: any, html: string }[];
	previousYearMapRegionArray: { label: string, value: any, html: string }[];
	listId: string;
	listName: string;
	inputPageName: string = '';
	outputPageName: string = '';


	constructor(
		private http: HttpClient,
		private toCurrencyPipe: CurrencyPipe,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) { }

	ngOnInit() {

		if ( !( this.mapConfig.primaryMapId ) ) {
			throw new Error('Primary Map container ID is required!');
		}

		if ( this.mapData?.previousYearData && !( this.mapConfig.secondaryMapId ) ) {
			throw new Error('Secondary Map container ID is required!');
		}

		this.listId = this.activatedRoute.snapshot.queryParams['cListId'] != undefined ? this.activatedRoute.snapshot.queryParams['cListId'] : '';
		this.listName = this.activatedRoute.snapshot.queryParams['listName'] != undefined ? this.activatedRoute.snapshot.queryParams['listName'] : '';
		this.inputPageName = this.activatedRoute.snapshot.queryParams['listPageName'] ? this.activatedRoute.snapshot.queryParams['listPageName'] : this.activatedRoute.snapshot.queryParams['pageName'] ? this.activatedRoute.snapshot.queryParams['pageName'] : '';

		switch ( this.inputPageName.toLowerCase() ) {
			case ListPageName.company.inputPage.toLowerCase():
				this.outputPageName = ListPageName.company.outputPage;
				break;
			case ListPageName.charges.inputPage.toLowerCase():
				this.outputPageName = ListPageName.charges.outputPage;
				break;
			case ListPageName.trade.inputPage.toLowerCase():
				this.outputPageName = ListPageName.trade.outputPage;
				break;
			case ListPageName.diversityInclusion.inputPage.toLowerCase():
				this.outputPageName = ListPageName.diversityInclusion.outputPage;
				break;
			case ListPageName.businessMonitor.inputPage.toLowerCase():
				this.outputPageName = ListPageName.businessMonitor.outputPage;
				break;
			case ListPageName.businessMonitorPlus.inputPage.toLowerCase():
				this.outputPageName = ListPageName.businessMonitorPlus.outputPage;
				break;
			case ListPageName.businessWatch.inputPage.toLowerCase():
				this.outputPageName = ListPageName.businessWatch.outputPage;
				break;

			case ListPageName.company.outputPage.toLowerCase():
				this.outputPageName = ListPageName.company.outputPage;
				break;
			case ListPageName.charges.outputPage.toLowerCase():
				this.outputPageName = ListPageName.charges.outputPage;
				break;
			case ListPageName.trade.outputPage.toLowerCase():
				this.outputPageName = ListPageName.trade.outputPage;
				break;
			case ListPageName.diversityInclusion.outputPage.toLowerCase():
				this.outputPageName = ListPageName.diversityInclusion.outputPage;
				break;
			case ListPageName.businessMonitor.outputPage.toLowerCase():
				this.outputPageName = ListPageName.businessMonitor.outputPage;
				break;
			case ListPageName.businessMonitorPlus.outputPage.toLowerCase():
				this.outputPageName = ListPageName.businessMonitorPlus.outputPage;
				break;
			case ListPageName.businessWatch.outputPage.toLowerCase():
				this.outputPageName = ListPageName.businessWatch.outputPage;
				break;			
			case ListPageName.investorFinder.inputPage.toLowerCase():
			this.outputPageName = ListPageName.investorFinder.outputPage;
			break;	
			case ListPageName.investeeFinder.inputPage.toLowerCase():
				this.outputPageName = ListPageName.investeeFinder.outputPage;
				break;			
			default:
				this.outputPageName = '';
				break;
		}
		
        this.initializeMapJSON();
    }
	
    initializeMapJSON() {
		
		this.http.get(`${ environment.json }/uk_regions_map.json`).toPromise().then(data => {
			
			this.mapGeoJson = data;

			if ( ![ 'furloughInsights' ].includes( this.requiredData.thisPage ) ) {
				this.mapGeoJsonOutput.emit( this.mapGeoJson );
			}
			
            let regionWiseCounts = {};
            let regionWiseCounts2 = {};

			if ( Array.isArray( this.mapData.currentYearData ) &&  (this.requiredData.thisPage == 'statsInsights' || this.requiredData.thisPage == 'diversityCalculationStats') ){
				this.unknownResultOnMap = this.mapData.currentYearData.filter( res => res.month == 'not specified' );
			}
			
			if ( this.mapData ) {

				if ( [ 'statsInsights', 'furloughInsights','investorFinderPage', 'internationalTradePage', 'investeeFinderPage', 'lendingLandscapes', 'corporateRiskLandscape', 'hnwiLandscape', 'femaleFounders', 'ethnicDiversity', 'diversityCalculationStats', 'charities' ].includes( this.requiredData.thisPage ) ) {

					for ( let regionData of this.mapData.currentYearData ) {
						
						if ( [ 'statsInsights', 'femaleFounders', 'ethnicDiversity', 'diversityCalculationStats', 'charities'].includes( this.requiredData.thisPage ) ) {

							regionWiseCounts[regionData.month.split(' ').join('_')] = regionData.count;
							regionWiseCounts[regionData.month.split(' ').join('_') + '_percentage'] = parseFloat(regionData.count_percentage).toFixed(2);
							regionWiseCounts[regionData.month.split(' ').join('_') + '_totalSpends'] = parseFloat(regionData.spendTotal).toFixed(2);
							
						} else {
							
							regionWiseCounts[regionData.region.split(' ').join('_')] = regionData.count;
							
						}
						
					}
					this.setMap( this.mapConfig.primaryMapId, regionWiseCounts );
					
				} else if ( [ 'insightsYearly', 'insightsMonthly', 'esgIndex' ].includes( this.requiredData.thisPage ) ) {
					
					regionWiseCounts = this.mapData.currentYearData;
					regionWiseCounts2 = this.mapData.previousYearData;
					
					// this.setMap( 'currentYearMap', regionWiseCounts );
					// this.setMap( 'previousYearMap', regionWiseCounts2 );
					
					this.setMap( this.mapConfig.primaryMapId, regionWiseCounts );
					this.setMap( this.mapConfig.secondaryMapId, regionWiseCounts2 );

				}
				
			}

		});

    }

	setMap( mapId, inputMapData ) {	

		let mapZoomValue, innerWidth, setView;
		let selectedRegion = this.mapData.selectedRegionYearBand

		if ( mapId == this.mapConfig.secondaryMapId ) {

			for ( let key in inputMapData ) {
				this.previousMonthMapTotal += inputMapData[key];
			}

			let _this = this;

			function createUrlAndGoToThePage(e) {

				let navigateUrlParamObject = [],
					yearStartDateStr, yearEndDateStr;

				if ( [ 'company_liquidation_data', 'company_dissolved_data' ].includes( _this.requiredData.selectedInsightsCategory ) ) {
	
					if ( _this.msgLogs.length == 0 ) {
						_this.msgLogs.push({ severity: 'info', summary: 'Will be available soon.' });
						setTimeout(() => {
							_this.msgLogs = [];
						}, 4000);
					}
	
				} else {
		
					if ( _this.requiredData.thisPage == 'insightsYearly' ) {
	
						// For Previous Year Map
						if ( e.target._map._container.id == mapId ) {
							yearStartDateStr = `01-01-${_this.requiredData.previousYear}`;
							yearEndDateStr = `31-12-${_this.requiredData.previousYear}`;
						}
	
					} else if ( _this.requiredData.thisPage == 'insightsMonthly' ) {
	
						if ( e.target._map._container.id == mapId ) {
							
							if ( _this.requiredData.startMonth == "01" || _this.requiredData.startMonth == "03" || _this.requiredData.startMonth == "05" || _this.requiredData.startMonth == "07" || _this.requiredData.startMonth == "08" || _this.requiredData.startMonth == "10" ) {
								yearStartDateStr = `01-${_this.requiredData.startMonth}-${_this.requiredData.currentYear}`;
								yearEndDateStr = `31-${_this.requiredData.startMonth}-${_this.requiredData.currentYear}`;
							} else if (_this.requiredData.startMonth == "02") {
								yearStartDateStr = `01-${_this.requiredData.startMonth}-${_this.requiredData.currentYear}`;
								yearEndDateStr = `28-${_this.requiredData.startMonth}-${_this.requiredData.currentYear}`;
							} else if (_this.requiredData.startMonth == "12") {
								yearStartDateStr = `01-${_this.requiredData.startMonth}-${_this.requiredData.previousYear}`;
								yearEndDateStr = `31-${_this.requiredData.startMonth}-${_this.requiredData.previousYear}`;
							} else {
								yearStartDateStr = `01-${_this.requiredData.startMonth}-${_this.requiredData.currentYear}`;
								yearEndDateStr = `30-${_this.requiredData.startMonth}-${_this.requiredData.currentYear}`;
							}
						}

					}
	
					// Creating Filters Data Object For Param URL
					if ( _this.requiredData.thisPage !== 'esgIndex') {

						for ( let categoryObj of _this.requiredData.insightsCategoryOptions ) {
							if ( _this.requiredData.selectedInsightsCategory == categoryObj.value ) {
								if ( e.target.feature.properties.name.toLowerCase() == 'scotland' || e.target.feature.properties.name.toLowerCase() == 'wales' || e.target.feature.properties.name.toLowerCase() == 'northern ireland' ) {
									navigateUrlParamObject.push(
										{
											chip_group: categoryObj.chipGroup,
											chip_values: [
												[yearStartDateStr.replace(/-/gi, '/'), yearEndDateStr.replace(/-/gi, '/'), `From ${yearStartDateStr} to ${yearEndDateStr}`]
											]
										},
										{
											chip_group: 'Region',
											chip_values: [e.target.feature.properties.name.toLowerCase()]
										}
									);
								} else {
									navigateUrlParamObject.push(
										{
											chip_group: categoryObj.chipGroup,
											chip_values: [
												[yearStartDateStr.replace(/-/gi, '/'), yearEndDateStr.replace(/-/gi, '/'), `From ${yearStartDateStr} to ${yearEndDateStr}`]
											]
										},
										{
											chip_group: 'Region',
											chip_values: [e.target.feature.properties.name.toLowerCase()]
										}
									);
								}
							}
						}
		
						if ( _this.requiredData.selectedIndustryList ) {
							for ( let industryObj of _this.requiredData.industryListOptions ) {
								if ( _this.requiredData.selectedIndustryList == industryObj['value'] ) {
									navigateUrlParamObject.push(
										{
											chip_group: 'SIC Codes',
											chip_values: [industryObj['label']],
											chip_industry_sic_codes: [industryObj['value']]
										}
									);
								}
							}
						}
						
						navigateUrlParamObject["dgInsights"] = true;
						_this.router.navigate(['/company-search'], { queryParams: { chipData: JSON.stringify(navigateUrlParamObject), dgInsights: true } });
					} else {
						let requestParamFilterData: any = JSON.parse(JSON.stringify(_this.requiredData.globalFilterDataObject.filterData));

						requestParamFilterData.push({
							chip_group: 'esgIndexYearScore',
							chip_values: [ selectedRegion.previousBandYear, selectedRegion.currentBandKey
								, e.target.feature.properties.name.toLowerCase() ]
						});

						let urlStr: string = String(_this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(requestParamFilterData), showFullyOutstanding: false } }));
	
						window.open(urlStr, '_blank');

					}
	
				}
			}

			if ( this.previousYearMap ) {
				this.previousYearMap.off();
				this.previousYearMap.remove();
			}

			let geojson: L.GeoJSON;

			setTimeout(() => {

				this.previousYearMap = L.map(mapId, {
					scrollWheelZoom: false,
					touchZoom: false,
					doubleClickZoom: false,
					zoomControl: false
				}).setView([55, -3], 5);
				L.tileLayer("").addTo(this.previousYearMap);

				if ( [ 'insightsYearly', 'insightsMonthly', 'esgIndex' ].includes( this.requiredData.thisPage ) ) {

					this.previousYearMapRegionArray = [ // assets/layout/images/404.svg
						{ label: 'wales', value: [51.9, -7.8], html: `<span class="darkRegionText">Wales </span><span><img src="assets/layout/images/line_to_left.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_left_dark.svg" alt="Line" class="darkArrow"><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['wales'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['wales'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'london', value: [51.40, 0.2], html: `<span><img src="assets/layout/images/line_to_right_long.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_right_long_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> London <div  class="darkRegionText" style="margin-left: 139px;">${this.toCurrencyPipe.transform(inputMapData['london'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['london'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'south_east', value: [50.85, -0.8], html: `<span><img src="assets/layout/images/line_to_right_tilt_down.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_right_tilt_down_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> South East <div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['south_east'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['south_east'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'northern_ireland', value: [54.80, -13], html: `<span class="darkRegionText">Northern Ireland </span><span><img src="assets/layout/images/line_to_left.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_left_dark.svg" alt="Line" class="darkArrow"></span><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['northern_ireland'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['northern_ireland'], '', ' ', '1.0-0') : '0'}</div>` },
						{ label: 'south_west', value: [50.8, -8.5], html: `<span class="darkRegionText">South West </span><span><img src="assets/layout/images/line_to_left_tilt_down.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_left_tilt_down_dark.svg" alt="Line" class="darkArrow"><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['south_west'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['south_west'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'yorkshire_and_the_humber', value: [54.3, -1], html: `<span><img src="assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> Yorkshire and The Humber <div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['yorkshire_and_the_humber'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['yorkshire_and_the_humber'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'east_of_england', value: [52.35, 0.9999999], html: `<span><img src="assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> East of England <div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['east_of_england'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['east_of_england'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'west_midlands', value: [52.75, -11.90], html: `<span class="darkRegionText">West Midlands </span><span><img src="assets/layout/images/line_to_left_long.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_left_long_dark.svg" alt="Line" class="darkArrow"><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['west_midlands'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['west_midlands'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'east_midlands', value: [53.35, -0.3], html: `<span><img src="assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_right_dark.svg" alt="Line"  class="darkArrow"></span><span class="darkRegionText"> East Midlands <div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['east_midlands'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['east_midlands'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'north_west', value: [53.8, -7.5], html: `<span class="darkRegionText">North West </span><span><img src="assets/layout/images/line_to_left.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_left_dark.svg" alt="Line" class="darkArrow"></span><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['north_west'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['north_west'], '', ' ', '1.0-0') : '0'}</div>` },
						{ label: 'north_east', value: [55.50, -1.7], html: `<span><img src="assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> North East<div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['north_east'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['north_east'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'scotland', value: [57.186456, -2.50], html: `<span><img src="assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> Scotland<div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['scotland'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['scotland'], '', ' ', '1.0-0') : '0'}</div></span>` }
					];

				}

				for ( let regionDataObj of this.previousYearMapRegionArray ) {
					L.marker(regionDataObj['value'], {
						icon: L.divIcon({
							className: 'text-labels',
							html: regionDataObj['html']
						}),
						zIndexOffset: 1000
					}).addTo(this.previousYearMap)
				}

				let countArray2 = []

				for ( let key in inputMapData ) {
					if ( parseInt(inputMapData[key]) ) {
						countArray2.push(parseInt(inputMapData[key]));
					} else {
						countArray2.push(0);
					}
				}

				let mapDataQ1 = this.quantile(countArray2, 25);
				let mapDataQ2 = this.quantile(countArray2, 50);
				let mapDataQ3 = this.quantile(countArray2, 75);
				let mapDataQ4 = this.quantile(countArray2, 100);

				for ( let feature of this.mapGeoJson["features"] ) {
					feature["properties"]["previousYearDataQuartile"] = {
						Q1: mapDataQ1,
						Q2: mapDataQ2,
						Q3: mapDataQ3,
						Q4: mapDataQ4
					}
				}

				for ( let feature of this.mapGeoJson["features"] ) {
					let x = feature['properties']['name'].replace(/\s/g, "_").toLowerCase();
					let curentYearCount = inputMapData[x];
					feature['properties']['previousYearCount'] = curentYearCount;
				}

				geojson = L.geoJSON(this.mapGeoJson, {
					style: function (feature) {

						// let featureRegionFillColors = [ '#32565f', '#4f8a97', '#63acbd', '#82bdca', '#b1d6de' ],
						let featureRegionFillColors = [ `var( --${ _this.mapConfig.secondaryMapColorTheme }-700 )`, `var( --${ _this.mapConfig.secondaryMapColorTheme }-500 )`, `var( --${ _this.mapConfig.secondaryMapColorTheme }-400 )`, `var( --${ _this.mapConfig.secondaryMapColorTheme }-200 )`, `var( --${ _this.mapConfig.secondaryMapColorTheme }-100 )`],
						// featureOutlineColor = '#135260';
						featureOutlineColor = `var( --${ _this.mapConfig.secondaryMapColorTheme }-900 )`;

						if( feature['properties']['previousYearCount'] == undefined ) {
							featureOutlineColor = '#bbb';
							featureRegionFillColors = ['#f5f5f5', '#f5f5f5', '#f5f5f5', '#f5f5f5', '#f5f5f5'];
						}

						const ColorStyleConfigMeta = {
							color: featureOutlineColor,
							weight: 0.5,
							fillColor: featureRegionFillColors[4],
							fillOpacity: 1
						};
	
						if ( feature['properties']['previousYearCount'] > feature['properties']['previousYearDataQuartile']['Q4'] ) {
							return {
								...ColorStyleConfigMeta,
								fillColor: featureRegionFillColors[0]
							};
						} else if ( feature['properties']['previousYearCount'] <= feature['properties']['previousYearDataQuartile']['Q4'] && feature['properties']['previousYearCount'] > feature['properties']['previousYearDataQuartile']['Q3'] ) {
							return {
								...ColorStyleConfigMeta,
								fillColor: featureRegionFillColors[1]
							};
						} else if ( feature['properties']['previousYearCount'] <= feature['properties']['previousYearDataQuartile']['Q3'] && feature['properties']['previousYearCount'] > feature['properties']['previousYearDataQuartile']['Q2'] ) {
							return {
								...ColorStyleConfigMeta,
								fillColor: featureRegionFillColors[2]
							};
						} else if ( feature['properties']['previousYearCount'] <= feature['properties']['previousYearDataQuartile']['Q2'] && feature['properties']['previousYearCount'] > feature['properties']['previousYearDataQuartile']['Q1'] ) {
							return {
								...ColorStyleConfigMeta,
								fillColor: featureRegionFillColors[3]
							};
						} else if ( feature['properties']['previousYearCount'] <= feature['properties']['previousYearDataQuartile']['Q1'] ) {
							return {
								...ColorStyleConfigMeta
							};
						} else {
							return {
								...ColorStyleConfigMeta
							};
						}
					},
					onEachFeature: function onEachFeature(feature, layer: L.Layer) {
						if ( feature.properties.previousYearCount ) {
							layer.on({
								click: createUrlAndGoToThePage
							});
						}
					}
				}).addTo(this.previousYearMap);

			}, 1000);

		} else {

			for ( let key in inputMapData ) {
				this.currentMonthMapTotal += inputMapData[key];
			}

			if ( this.requiredData.thisPage == 'corporateRiskLandscape' ) {

				if ( !inputMapData ) {
					inputMapData = {
						east_midlands: 40593,
						east_of_england: 59119,
						london: 149166,
						north_east: 14910,
						north_west: 65768,
						northern_ireland: 13112,
						scotland: 36779,
						south_east: 91245,
						south_west: 47626,
						wales: 16010,
						west_midlands: 51680,
						yorkshire_and_the_humber: 45296
					};
				}

			}

			let createUrlAndGoToThePage: (event: any) => void;

			createUrlAndGoToThePage = (event) => {

				let _this = this;

				if ( [ 'furloughInsights' ].includes( _this.requiredData.thisPage ) ) {

					this.requiredData.selectedRegion = event.target.feature.properties.name;

					this.mapGeoJsonOutput.emit( this.requiredData.selectedRegion );

					this.setIndustryWiseFurloughCounts();

				} else if ( [ 'internationalTradePage', 'lendingLandscapes', 'corporateRiskLandscape', 'esgIndex', 'femaleFounders', 'ethnicDiversity', 'charities' ].includes( _this.requiredData.thisPage ) ) {

					let requestParamFilterData: any = JSON.parse(JSON.stringify(_this.requiredData.globalFilterDataObject.filterData));

					if (_this.requiredData.selectedRegionList && !_this.requiredData.selectedRegionList.filter(val => !val).length && _this.requiredData.selectedRegionList.length > 0) {

						for ( let filterObject of requestParamFilterData ) {

							if ( _this.requiredData.thisPage != 'esgIndex' ) {

								if (filterObject['chip_group'] == 'Region') {
									filterObject['chip_values'] = [ event.target.feature.properties.name.toLowerCase() ]
								}

							} else {

								if (filterObject['chip_group'] == 'esgIndexYearScore') {
									filterObject['chip_values'] = [ selectedRegion.currentBandYear, selectedRegion.currentBandKey
										, event.target.feature.properties.name.toLowerCase() ]
								}

							}

						}

					} else {

						if ( _this.requiredData.thisPage != 'esgIndex' ){

							requestParamFilterData.push({
								chip_group: 'Region',
								chip_values: [ event.target.feature.properties.name.toLowerCase() ]
							});

						} else {

							requestParamFilterData.push({
								chip_group: 'esgIndexYearScore',
								chip_values: [ selectedRegion.currentBandYear, selectedRegion.currentBandKey
									, event.target.feature.properties.name.toLowerCase() ]
							});

						}

					}

					let urlStr: string = String(_this.router.createUrlTree(['/company-search'], { queryParams: { chipData: JSON.stringify(requestParamFilterData), showFullyOutstanding: false } }));

					window.open(urlStr, '_blank');

				} else if ( [ 'insightsYearly', 'insightsMonthly' ].includes( _this.requiredData.thisPage ) ) {

					let navigateUrlParamObject = [],
						yearStartDateStr, yearEndDateStr;

					if ( [ 'company_liquidation_data', 'company_dissolved_data' ].includes( _this.requiredData.selectedInsightsCategory ) ) {

						if ( _this.msgLogs.length == 0 ) {
							_this.msgLogs.push({ severity: 'info', summary: 'Will be available soon.' });
							setTimeout(() => {
								_this.msgLogs = [];
							}, 4000);
						}
		
		
					} else {
				
						if ( [ 'insightsYearly' ].includes( _this.requiredData.thisPage ) ) {
		
							// For Current Year Map
							if ( event.target._map._container.id == this.mapConfig.primaryMapId ) {
								yearStartDateStr = `01-01-${_this.requiredData.currentYear}`;
								yearEndDateStr = `31-12-${_this.requiredData.currentYear}`;
							}
		
		
						} else if ( [ 'insightsMonthly' ].includes( _this.requiredData.thisPage ) ) {
			
							// For Current Year Map
							if ( event.target._map._container.id == this.mapConfig.primaryMapId ) {
								if ( _this.requiredData.endMonth == "01" || _this.requiredData.endMonth == "03" || _this.requiredData.endMonth == "05" || _this.requiredData.endMonth == "07" || _this.requiredData.endMonth == "08" || _this.requiredData.endMonth == "10" || _this.requiredData.endMonth == "12" ) {
									yearStartDateStr = `01-${_this.requiredData.endMonth}-${_this.requiredData.currentYear}`;
									yearEndDateStr = `31-${_this.requiredData.endMonth}-${_this.requiredData.currentYear}`;
								} else if (_this.requiredData.endMonth == "02") {
									yearStartDateStr = `01-${_this.requiredData.endMonth}-${_this.requiredData.currentYear}`;
									yearEndDateStr = `28-${_this.requiredData.endMonth}-${_this.requiredData.currentYear}`;
								} else {
									yearStartDateStr = `01-${_this.requiredData.endMonth}-${_this.requiredData.currentYear}`;
									yearEndDateStr = `30-${_this.requiredData.endMonth}-${_this.requiredData.currentYear}`;
								}
							}
		
						}
		
						// Creating Filters Data Object For Param URL
						for ( let categoryObj of _this.requiredData.insightsCategoryOptions ) {
							if ( _this.requiredData.selectedInsightsCategory == categoryObj.value ) {
								if ( event.target.feature.properties.name.toLowerCase() == 'scotland' || event.target.feature.properties.name.toLowerCase() == 'wales' || event.target.feature.properties.name.toLowerCase() == 'northern ireland' ) {
									navigateUrlParamObject.push(
										{
											chip_group: categoryObj.chipGroup,
											chip_values: [
												[yearStartDateStr.replace(/-/gi, '/'), yearEndDateStr.replace(/-/gi, '/'), `From ${yearStartDateStr} to ${yearEndDateStr}`]
											]
										},
										{
											chip_group: 'Region',
											chip_values: [event.target.feature.properties.name.toLowerCase()]
										}
									);
								} else {
									navigateUrlParamObject.push(
										{
											chip_group: categoryObj.chipGroup,
											chip_values: [
												[yearStartDateStr.replace(/-/gi, '/'), yearEndDateStr.replace(/-/gi, '/'), `From ${yearStartDateStr} to ${yearEndDateStr}`]
											]
										},
										{
											chip_group: 'Region',
											chip_values: [event.target.feature.properties.name.toLowerCase()]
										}
									);
								}
							}
						}
		
						if ( _this.requiredData.selectedIndustryList ) {
							for ( let industryObj of _this.requiredData.industryListOptions ) {
								if ( _this.requiredData.selectedIndustryList == industryObj['value'] ) {
									navigateUrlParamObject.push(
										{
											chip_group: 'SIC Codes',
											chip_values: [industryObj['label']],
											chip_industry_sic_codes: [industryObj['value']]
										}
									);
								}
							}
						}
						// , dgInsights: true
						navigateUrlParamObject["dgInsights"] = true;
						_this.router.navigate(['/company-search'], { queryParams: { chipData: JSON.stringify(navigateUrlParamObject), dgInsights: true } });
		
					}

				
				} else if ( [ 'statsInsights', 'investeeFinderPage', 'investorFinderPage', 'diversityCalculationStats' ].includes( _this.requiredData.thisPage ) ) {

					this.goToCompanyPage( event, undefined, _this.requiredData.globalFilterDataObject, _this.requiredData );

				}

			}

			if ( this.currentYearMap ) {
				this.currentYearMap.off();
				this.currentYearMap.remove();
			}

			let geojson: L.GeoJSON;

			setTimeout(() => {

				if ( [ 'furloughInsights' ].includes( this.requiredData.thisPage ) ) {
					setView = [54.9, -2];

					if ( innerWidth < 1024 ) {
						mapZoomValue = 4.5
					} else {
						mapZoomValue = 5.5;
					}

				} else if ( [ 'investorFinderPage', 'internationalTradePage', 'investeeFinderPage', 'lendingLandscapes', 'corporateRiskLandscape', 'hnwiLandscape' ].includes( this.requiredData.thisPage ) ) {

					setView = [54.9, -3];
					mapZoomValue = 4.5;

				} else if ( [ 'statsInsights', 'insightsYearly', 'insightsMonthly', 'esgIndex', 'femaleFounders', 'ethnicDiversity', 'diversityCalculationStats', 'charities' ].includes( this.requiredData.thisPage ) ) {

					setView = [55, -3];
					mapZoomValue = 5;

				}

				this.currentYearMap = L.map(mapId, {
					scrollWheelZoom: false,
					touchZoom: false,
					doubleClickZoom: false,
					zoomControl: false,
					dragging: true
				}).setView(setView, mapZoomValue);

				L.tileLayer("").addTo(this.currentYearMap);

				if (  [ 'statsInsights', 'femaleFounders', 'ethnicDiversity', 'charities' ].includes( this.requiredData.thisPage ) ) {

					this.currentYearMapRegionArray = [
						{ label: 'wales', value: [51.98, -8.5], html: `<span class="darkRegionText">Wales </span><span><img src="/assets/layout/images/line_to_left_dark.svg" alt="Line" class="darkArrow"><div class="darkRegionText" style="margin-left: -33px;">${this.toCurrencyPipe.transform(inputMapData['wales'], '', ' ', '1.0-0') !== null && inputMapData['wales_percentage'] ? this.toCurrencyPipe.transform(inputMapData['wales'], '', ' ', '1.0-0') + ' (' + inputMapData['wales_percentage'] + '%)' : '0'}</div></span>` },

						{ label: 'london', value: [51.45, 0.1], html: `<span><img src="/assets/layout/images/line_to_right_long_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> London <div class="darkRegionText" style="margin-left: 139px;">${this.toCurrencyPipe.transform(inputMapData['london'], '', ' ', '1.0-0') !== null && inputMapData['london_percentage'] ? this.toCurrencyPipe.transform(inputMapData['london'], '', ' ', '1.0-0') + ' (' + this.toCurrencyPipe.transform(inputMapData['london_percentage'], '', ' ', '1.0-2') + '%)' : '0'}</div></span>` },
						
						{ label: 'south_east', value: [50.85, 0.6], html: `<span><img src="/assets/layout/images/line_to_right_tilt_down_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> South East <div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['south_east'], '', ' ', '1.0-0') !== null && inputMapData['south_east_percentage'] ? this.toCurrencyPipe.transform(inputMapData['south_east'], '', ' ', '1.0-0') + ' (' + this.toCurrencyPipe.transform(inputMapData['south_east_percentage'], '', ' ', '1.0-2') + '%)' : '0'}</div></span>` },
						{ label: 'northern_ireland', value: [54.90, -13], html: `<span class="darkRegionText">Northern Ireland </span><span><img src="/assets/layout/images/line_to_left_dark.svg" alt="Line" class="darkArrow"></span><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['northern_ireland'], '', ' ', '1.0-0') !== null && inputMapData['northern_ireland_percentage'] ? this.toCurrencyPipe.transform(inputMapData['northern_ireland'], '', ' ', '1.0-0') + ' (' + this.toCurrencyPipe.transform(inputMapData['northern_ireland_percentage'], '', ' ', '1.0-2') + '%)' : '0'}</div>` },
						{ label: 'south_west', value: [50.38, -9.8], html: `<span class="darkRegionText">South West </span><span><img src="/assets/layout/images/line_to_left_tilt_down_dark.svg" alt="Line" class="darkArrow"><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['south_west'], '', ' ', '1.0-0') !== null && inputMapData['south_west_percentage'] ? this.toCurrencyPipe.transform(inputMapData['south_west'], '', ' ', '1.0-0') + ' (' + this.toCurrencyPipe.transform(inputMapData['south_west_percentage'], '', ' ', '1.0-2') + '%)' : '0'}</div></span>` },
						{ label: 'yorkshire_and_the_humber', value: [54.3, -1], html: `<span><img src="/assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> Yorkshire and The Humber <div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['yorkshire_and_the_humber'], '', ' ', '1.0-0') !== null && inputMapData['yorkshire_and_the_humber_percentage'] ? this.toCurrencyPipe.transform(inputMapData['yorkshire_and_the_humber'], '', ' ', '1.0-0') + ' (' + this.toCurrencyPipe.transform(inputMapData['yorkshire_and_the_humber_percentage'], '', ' ', '1.0-2') + '%)' : '0'}</div></span>` },
						{ label: 'east_of_england', value: [52.35, 0.9999999], html: `<span><img src="/assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> East of England <div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['east_of_england'], '', ' ', '1.0-0') !== null && inputMapData['east_of_england_percentage'] ? this.toCurrencyPipe.transform(inputMapData['east_of_england'], '', ' ', '1.0-0') + ' (' + this.toCurrencyPipe.transform(inputMapData['east_of_england_percentage'], '', ' ', '1.0-2') + '%)' : '0'}</div></span>` },
						{ label: 'west_midlands', value: [52.75, -12], html: `<span class="darkRegionText">West Midlands </span><span><img src="/assets/layout/images/line_to_left_long_dark.svg" alt="Line" class="darkArrow"><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['west_midlands'], '', ' ', '1.0-0') !== null && inputMapData['west_midlands_percentage'] ? this.toCurrencyPipe.transform(inputMapData['west_midlands'], '', ' ', '1.0-0') + ' (' + this.toCurrencyPipe.transform(inputMapData['west_midlands_percentage'], '', ' ', '1.0-2') + '%)' : '0'}</div></span>` },
						{ label: 'east_midlands', value: [53.35, -0.3], html: `<span><img src="/assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> East Midlands <div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['east_midlands'], '', ' ', '1.0-0') !== null && inputMapData['east_midlands_percentage'] ? this.toCurrencyPipe.transform(inputMapData['east_midlands'], '', ' ', '1.0-0') + ' (' + this.toCurrencyPipe.transform(inputMapData['east_midlands_percentage'], '', ' ', '1.0-2') + '%)' : '0'}</div></span>` },
						{ label: 'north_west', value: [53.9, -7.5], html: `<span class="darkRegionText">North West </span><span><img src="/assets/layout/images/line_to_left_dark.svg" alt="Line" class="darkArrow"></span><div class="darkRegionText" style="margin-left: -9px;">${this.toCurrencyPipe.transform(inputMapData['north_west'], '', ' ', '1.0-0') !== null && inputMapData['north_west_percentage'] ? this.toCurrencyPipe.transform(inputMapData['north_west'], '', ' ', '1.0-0') + ' (' + this.toCurrencyPipe.transform(inputMapData['north_west_percentage'], '', ' ', '1.0-2') + '%)' : '0'}</div>` },
						{ label: 'north_east', value: [55.50, -1.7], html: `<span><img src="/assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> North East<div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['north_east'], '', ' ', '1.0-0') !== null && inputMapData['north_east_percentage'] ? this.toCurrencyPipe.transform(inputMapData['north_east'], '', ' ', '1.0-0') + ' (' + this.toCurrencyPipe.transform(inputMapData['north_east_percentage'], '', ' ', '1.0-2') + '%)' : '0'}</div></span>` },
						{ label: 'scotland', value: [57.186456, -2.50], html: `<span><img src="/assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> Scotland<div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['scotland'], '', ' ', '1.0-0') !== null && inputMapData['scotland_percentage'] ? this.toCurrencyPipe.transform(inputMapData['scotland'], '', ' ', '1.0-0') + ' (' + this.toCurrencyPipe.transform(inputMapData['scotland_percentage'], '', ' ', '1.0-2') + '%)' : '0'}</div></span>` }
					];

				}
				if (  [ 'diversityCalculationStats' ].includes( this.requiredData.thisPage ) ) {

					// console.log(">>>", inputMapData)

					this.currentYearMapRegionArray = [
						{ label: 'wales', value: [51.98, -7.5], html: `
							<span class="darkRegionText"> Wales </span>
							<span>
								<img src="/assets/layout/images/line_to_left_dark.svg" alt="Line" class="darkArrow">
									<div class="darkRegionText"">Companies: ${this.toCurrencyPipe.transform(inputMapData['wales'], '', ' ', '1.0-0') !== null && inputMapData['wales'] ? this.toCurrencyPipe.transform(inputMapData['wales'], '', ' ', '1.0-0') : '0'}
									</div>
									<div style="margin-left:-25px">
										Spend: &pound${this.toCurrencyPipe.transform(inputMapData['wales_totalSpends'], '', ' ', '1.0-0') !== null && inputMapData['wales_totalSpends'] ? this.toCurrencyPipe.transform(inputMapData['wales_totalSpends'], '', ' ', '1.0-0') : '0'}
									</div>
							</span>
						` },
						{ label: 'london', value: [51.45, 0.1], html: `
							<span><img src="/assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span>
							<span class="darkRegionText"> London
								<div class="darkRegionText" style="margin-left: 56px;">
									Companies: ${this.toCurrencyPipe.transform(inputMapData['london'], '', ' ', '1.0-0') !== null && inputMapData['london_percentage'] ? this.toCurrencyPipe.transform(inputMapData['london'], '', ' ', '1.0-0') : '0'}
								</div>
								<div style="margin-left:55px">
									Spend: &pound${this.toCurrencyPipe.transform(inputMapData['london_totalSpends'], '', ' ', '1.0-0') !== null && inputMapData['london_totalSpends'] ? this.toCurrencyPipe.transform(inputMapData['london_totalSpends'], '', ' ', '1.0-0') : '0'}
								</div>
							</span>
						` },
						{ label: 'northern_ireland', value: [54.90, -13], html: `
							<span class="darkRegionText">Northern Ireland </span>
							<span>
								<img src="/assets/layout/images/line_to_left_dark.svg" alt="Line" class="darkArrow">
							</span>
							<div class="darkRegionText">
								Companies: ${this.toCurrencyPipe.transform(inputMapData['northern_ireland'], '', ' ', '1.0-0') !== null && inputMapData['northern_ireland_percentage'] ? this.toCurrencyPipe.transform(inputMapData['northern_ireland'], '', ' ', '1.0-0') : '0'}
							</div>
							<div>
								Spend: &pound${this.toCurrencyPipe.transform(inputMapData['northern_ireland_totalSpends'], '', ' ', '1.0-0') !== null && inputMapData['northern_ireland_totalSpends'] ? this.toCurrencyPipe.transform(inputMapData['northern_ireland_totalSpends'], '', ' ', '1.0-0') : '0'}
							</div>
						` },
						{ label: 'south_west', value: [50.38, -9.8], html: `
							<span class="darkRegionText">South West </span>
							<span>
								<img src="/assets/layout/images/line_to_left_tilt_down_dark.svg" alt="Line" class="darkArrow">
									<div class="darkRegionText">Companies: ${this.toCurrencyPipe.transform(inputMapData['south_west'], '', ' ', '1.0-0') !== null && inputMapData['south_west_percentage'] ? this.toCurrencyPipe.transform(inputMapData['south_west'], '', ' ', '1.0-0') : '0'}
									</div>
									<div>
										Spend: &pound${this.toCurrencyPipe.transform(inputMapData['south_west_totalSpends'], '', ' ', '1.0-0') !== null && inputMapData['south_west_totalSpends'] ? this.toCurrencyPipe.transform(inputMapData['south_west_totalSpends'], '', ' ', '1.0-0') : '0'}
									</div>
							</span>
						` },
						{ label: 'south_east', value: [50.85, 0.6], html: `
							<span class="htmlClass darkArrow">
								<img style="rotate: 50deg; position: relative; left: -45px" class="darkArrow" src="/assets/layout/images/line_to_right_tilt_down_dark.svg" alt="Line">
							</span>
							<span style="position: relative; top:32px; left: -96px">
								 South East
								<div style="margin-left: 55px;" class="darkRegionText">
									<span> Companies:</span>
									<span> ${this.toCurrencyPipe.transform(inputMapData['south_east'], '', ' ', '1.0-0') !== null && inputMapData['south_east_percentage'] ? this.toCurrencyPipe.transform(inputMapData['south_east'], '', ' ', '1.0-0') : '0'}
									</span>
								</div>
								<div style="margin-left:55px">
									Spend: &pound${this.toCurrencyPipe.transform(inputMapData['south_east_totalSpends'], '', ' ', '1.0-0') !== null && inputMapData['south_east_totalSpends'] ? this.toCurrencyPipe.transform(inputMapData['south_east_totalSpends'], '', ' ', '1.0-0') : '0'}
								</div>
							</span>
						` },
						{ label: 'yorkshire_and_the_humber', value: [54.3, -1], html: `
							<span><img src="/assets/layout/images/line_to_right_long_dark.svg" alt="Line" class="darkArrow"></span>
							<span class="darkRegionText"> Yorkshire and The Humber 
								<div style="margin-left: 154px" class="darkRegionText">
									Companies: ${this.toCurrencyPipe.transform(inputMapData['yorkshire_and_the_humber'], '', ' ', '1.0-0') !== null && inputMapData['yorkshire_and_the_humber_percentage'] ? this.toCurrencyPipe.transform(inputMapData['yorkshire_and_the_humber'], '', ' ', '1.0-0') : '0'}
								</div>
								<div style="margin-left: 155px;">
									Spend: &pound${this.toCurrencyPipe.transform(inputMapData['yorkshire_and_the_humber_totalSpends'], '', ' ', '1.0-0') !== null && inputMapData['yorkshire_and_the_humber_totalSpends'] ? this.toCurrencyPipe.transform(inputMapData['yorkshire_and_the_humber_totalSpends'], '', ' ', '1.0-0') : '0'}
								</div>
							</span>
						` },
						{ label: 'east_of_england', value: [52.35, 0.9999999], html: `
							<span>
								<img style="position: relative; top: 19px" src="/assets/layout/images/line_to_right_long_dark.svg" alt="Line" class="darkArrow">
							</span>
							<span class="darkRegionText"> East of England 
								<div style="margin-left: 141px;" class="darkRegionText">
									Companies: ${this.toCurrencyPipe.transform(inputMapData['east_of_england'], '', ' ', '1.0-0') !== null && inputMapData['east_of_england_percentage'] ? this.toCurrencyPipe.transform(inputMapData['east_of_england'], '', ' ', '1.0-0') : '0'}
								</div>
								<div style="margin-left: 141px;">
									Spend: &pound${this.toCurrencyPipe.transform(inputMapData['east_of_england_totalSpends'], '', ' ', '1.0-0') !== null && inputMapData['east_of_england_totalSpends'] ? this.toCurrencyPipe.transform(inputMapData['east_of_england_totalSpends'], '', ' ', '1.0-0') : '0'}
								</div>
							</span>
						` },
						{ label: 'west_midlands', value: [52.55, -12], html: `
							<span class="darkRegionText">West Midlands </span>
							<span>
								<img src="/assets/layout/images/line_to_left_long_dark.svg" alt="Line" class="darkArrow">
									<div class="darkRegionText">
										Companies: ${this.toCurrencyPipe.transform(inputMapData['west_midlands'], '', ' ', '1.0-0') !== null && inputMapData['west_midlands_percentage'] ? this.toCurrencyPipe.transform(inputMapData['west_midlands'], '', ' ', '1.0-0') : '0'}
									</div>
									<div style="margin-left: -26px">
										Spend: &pound${this.toCurrencyPipe.transform(inputMapData['west_midlands_totalSpends'], '', ' ', '1.0-0') !== null && inputMapData['west_midlands_totalSpends'] ? this.toCurrencyPipe.transform(inputMapData['west_midlands_totalSpends'], '', ' ', '1.0-0') : '0'}
									</div>
							</span>
						` },
						{ label: 'east_midlands', value: [53.35, -0.3], html: `
							<span><img src="/assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span>
							<span class="darkRegionText"> East Midlands 
								<div style="margin-left: 53px;" class="darkRegionText">
									Companies: ${this.toCurrencyPipe.transform(inputMapData['east_midlands'], '', ' ', '1.0-0') !== null && inputMapData['east_midlands_percentage'] ? this.toCurrencyPipe.transform(inputMapData['east_midlands'], '', ' ', '1.0-0') : '0'}
								</div>
								<div style="margin-left: 45px">
										Spend: &pound${this.toCurrencyPipe.transform(inputMapData['east_midlands_totalSpends'], '', ' ', '1.0-0') !== null && inputMapData['east_midlands_totalSpends'] ? this.toCurrencyPipe.transform(inputMapData['east_midlands_totalSpends'], '', ' ', '1.0-0') : '0'}
									</div>
							</span>
						` },
						{ label: 'north_west', value: [53.9, -7.5], html: `
							<span class="darkRegionText">North West </span>
							<span><img src="/assets/layout/images/line_to_left_dark.svg" alt="Line" class="darkArrow"></span>
							<div class="darkRegionText" style="margin-left: -9px;">
								Companies: ${this.toCurrencyPipe.transform(inputMapData['north_west'], '', ' ', '1.0-0') !== null && inputMapData['north_west_percentage'] ? this.toCurrencyPipe.transform(inputMapData['north_west'], '', ' ', '1.0-0') : '0'}
							</div>
							<div style="margin-left: -35px;">
								Spend: &pound${this.toCurrencyPipe.transform(inputMapData['north_west_totalSpends'], '', ' ', '1.0-0') !== null && inputMapData['north_west_totalSpends'] ? this.toCurrencyPipe.transform(inputMapData['north_west_totalSpends'], '', ' ', '1.0-0') : '0'}
							</div>
						` },
						{ label: 'north_east', value: [55.50, -1.7], html: `
							<span><img src="/assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span>
							<span class="darkRegionText"> North East
								<div style="margin-left: 55px;" class="darkRegionText">
									Companies: ${this.toCurrencyPipe.transform(inputMapData['north_east'], '', ' ', '1.0-0') !== null && inputMapData['north_east_percentage'] ? this.toCurrencyPipe.transform(inputMapData['north_east'], '', ' ', '1.0-0') : '0'}
								</div>
								<div style="margin-left: 55px;">
									Spend: &pound${this.toCurrencyPipe.transform(inputMapData['north_east_totalSpends'], '', ' ', '1.0-0') !== null && inputMapData['north_east_totalSpends'] ? this.toCurrencyPipe.transform(inputMapData['north_east_totalSpends'], '', ' ', '1.0-0') : '0'}
								</div>
							</span>
						` },
						{ label: 'scotland', value: [57.186456, -2.50], html: `
							<span><img src="/assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span>
							<span class="darkRegionText"> Scotland
								<div style="margin-left: 55px;" class="darkRegionText">
									Companies: ${this.toCurrencyPipe.transform(inputMapData['scotland'], '', ' ', '1.0-0') !== null && inputMapData['scotland_percentage'] ? this.toCurrencyPipe.transform(inputMapData['scotland'], '', ' ', '1.0-0') : '0'}
								</div>
								<div style="margin-left: 55px;">
									Spend: &pound${this.toCurrencyPipe.transform(inputMapData['scotland_totalSpends'], '', ' ', '1.0-0') !== null && inputMapData['scotland_totalSpends'] ? this.toCurrencyPipe.transform(inputMapData['scotland_totalSpends'], '', ' ', '1.0-0') : '0'}
								</div>
							</span>
						` }
					];

				}

				if ( [ 'furloughInsights' ].includes( this.requiredData.thisPage )  ) {

					if (mapZoomValue == 4.5) {
						this.currentYearMapRegionArray = [
							{ label: 'wales', value: [51.9, -6.8], html: `<span class="darkRegionText">Wales </span><span><img src="/assets/layout/images/line_to_left.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_left_dark.svg" alt="Line" class="darkArrow"><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['wales'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['wales'], '', ' ', '1.0-0') : '0'}</div></span>` },
							{ label: 'london', value: [51.40, 0.1], html: `<span><img src="/assets/layout/images/line_to_right_long.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_right_long_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> London <div  class="darkRegionText" style="margin-left: 139px;">${this.toCurrencyPipe.transform(inputMapData['london'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['london'], '', ' ', '1.0-0') : '0'}</div></span>` },
							{ label: 'south_east', value: [50.85, 0.5], html: `<span><img src="/assets/layout/images/line_to_right_tilt_down.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_right_tilt_down_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> South East <div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['south_east'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['south_east'], '', ' ', '1.0-0') : '0'}</div></span>` },
							{ label: 'northern_ireland', value: [54.90, -11], html: `<span class="darkRegionText">Northern Ireland </span><span><img src="/assets/layout/images/line_to_left.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_left_dark.svg" alt="Line" class="darkArrow"></span><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['northern_ireland'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['northern_ireland'], '', ' ', '1.0-0') : '0'}</div>` },
							{ label: 'south_west', value: [50.8, -6.8], html: `<span class="darkRegionText">South West </span><span><img src="/assets/layout/images/line_to_left_tilt_down.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_left_tilt_down_dark.svg" alt="Line" class="darkArrow"><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['south_west'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['south_west'], '', ' ', '1.0-0') : '0'}</div></span>` },
							{ label: 'yorkshire_and_the_humber', value: [54.3, -1], html: `<span><img src="/assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> Yorkshire and The Humber <div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['yorkshire_and_the_humber'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['yorkshire_and_the_humber'], '', ' ', '1.0-0') : '0'}</div></span>` },
							{ label: 'east_of_england', value: [52.35, 0.9999999], html: `<span><img src="/assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> East of England <div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['east_of_england'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['east_of_england'], '', ' ', '1.0-0') : '0'}</div></span>` },
							{ label: 'west_midlands', value: [52.75, -10], html: `<span class="darkRegionText">West Midlands </span><span><img src="/assets/layout/images/line_to_left_long.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_left_long_dark.svg" alt="Line" class="darkArrow"><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['west_midlands'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['west_midlands'], '', ' ', '1.0-0') : '0'}</div></span>` },
							{ label: 'east_midlands', value: [53.35, -0.3], html: `<span><img src="/assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_right_dark.svg" alt="Line"  class="darkArrow"></span><span class="darkRegionText"> East Midlands <div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['east_midlands'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['east_midlands'], '', ' ', '1.0-0') : '0'}</div></span>` },
							{ label: 'north_west', value: [53.9, -6.5], html: `<span class="darkRegionText">North West </span><span><img src="/assets/layout/images/line_to_left.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_left_dark.svg" alt="Line" class="darkArrow"></span><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['north_west'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['north_west'], '', ' ', '1.0-0') : '0'}</div>` },
							{ label: 'north_east', value: [55.50, -1.7], html: `<span><img src="/assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> North East<div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['north_east'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['north_east'], '', ' ', '1.0-0') : '0'}</div></span>` },
							{ label: 'scotland', value: [57.186456, -2.50], html: `<span><img src="/assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> Scotland<div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['scotland'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['scotland'], '', ' ', '1.0-0') : '0'}</div></span>` }
						];
					} else {
						this.currentYearMapRegionArray = [
							{ label: 'wales', value: [51.9, -6.8], html: `<span class="darkRegionText">Wales </span><span><img src="/assets/layout/images/line_to_left.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_left_dark.svg" alt="Line" class="darkArrow"><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['wales'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['wales'], '', ' ', '1.0-0') : '0'}</div></span>` },

							{ label: 'london', value: [51.40, 0.1], html: `<span><img src="/assets/layout/images/line_to_right_long.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_right_long_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> London <div  class="darkRegionText" style="margin-left: 139px;">${this.toCurrencyPipe.transform(inputMapData['london'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['london'], '', ' ', '1.0-0') : '0'}</div></span>` },

							{ label: 'south_east', value: [50.85, 0.5], html: `<span><img src="/assets/layout/images/line_to_right_tilt_down.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_right_tilt_down_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> South East <div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['south_east'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['south_east'], '', ' ', '1.0-0') : '0'}</div></span>` },
							{ label: 'northern_ireland', value: [54.90, -10], html: `<span class="darkRegionText">Northern Ireland </span><span><img src="/assets/layout/images/line_to_left.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_left_dark.svg" alt="Line" class="darkArrow"></span><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['northern_ireland'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['northern_ireland'], '', ' ', '1.0-0') : '0'}</div>` },
							{ label: 'south_west', value: [50.8, -6.8], html: `<span class="darkRegionText">South West </span><span><img src="/assets/layout/images/line_to_left_tilt_down.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_left_tilt_down_dark.svg" alt="Line" class="darkArrow"><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['south_west'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['south_west'], '', ' ', '1.0-0') : '0'}</div></span>` },
							{ label: 'yorkshire_and_the_humber', value: [54.3, -1], html: `<span><img src="/assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> Yorkshire and The Humber <div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['yorkshire_and_the_humber'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['yorkshire_and_the_humber'], '', ' ', '1.0-0') : '0'}</div></span>` },
							{ label: 'east_of_england', value: [52.35, 0.9999999], html: `<span><img src="/assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> East of England <div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['east_of_england'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['east_of_england'], '', ' ', '1.0-0') : '0'}</div></span>` },
							{ label: 'west_midlands', value: [52.75, -7], html: `<span class="darkRegionText">West Midlands </span><span><img src="/assets/layout/images/line_to_left_long.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_left_long_dark.svg" alt="Line" class="darkArrow"><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['west_midlands'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['west_midlands'], '', ' ', '1.0-0') : '0'}</div></span>` },
							{ label: 'east_midlands', value: [53.35, -0.3], html: `<span><img src="/assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_right_dark.svg" alt="Line"  class="darkArrow"></span><span class="darkRegionText"> East Midlands <div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['east_midlands'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['east_midlands'], '', ' ', '1.0-0') : '0'}</div></span>` },
							{ label: 'north_west', value: [53.9, -5.2], html: `<span class="darkRegionText">North West </span><span><img src="/assets/layout/images/line_to_left.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_left_dark.svg" alt="Line" class="darkArrow"></span><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['north_west'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['north_west'], '', ' ', '1.0-0') : '0'}</div>` },
							{ label: 'north_east', value: [55.50, -1.7], html: `<span><img src="/assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> North East<div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['north_east'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['north_east'], '', ' ', '1.0-0') : '0'}</div></span>` },
							{ label: 'scotland', value: [57.186456, -2.50], html: `<span><img src="/assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="/assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> Scotland<div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['scotland'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['scotland'], '', ' ', '1.0-0') : '0'}</div></span>` }
						];
					}

				}

				if ( [ 'investorFinderPage', 'internationalTradePage', 'investeeFinderPage', 'lendingLandscapes', 'corporateRiskLandscape', 'hnwiLandscape' ].includes( this.requiredData.thisPage ) ) {

					this.currentYearMapRegionArray = [
						{ label: 'wales', value: [51.9, -7.8], html: `<span class="darkRegionText ${inputMapData['wales'] ? '' : 'c-light'}">Wales </span><span><img src="assets/layout/images/line_to_left.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_left_dark.svg" alt="Line" class="darkArrow"><div class="darkRegionText ${inputMapData['wales'] ? '' : 'c-light'}">${this.toCurrencyPipe.transform(inputMapData['wales'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['wales'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'london', value: [51.40, 0.2], html: `<span><img src="assets/layout/images/line_to_right_long.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_right_long_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText ${inputMapData['london'] ? '' : 'c-light'}"> London <div  class="darkRegionText ${inputMapData['london'] ? '' : 'c-light'}" style="margin-left: 139px;">${this.toCurrencyPipe.transform(inputMapData['london'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['london'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'south_east', value: [50.85, -0.8], html: `<span><img src="assets/layout/images/line_to_right_tilt_down.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_right_tilt_down_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText ${inputMapData['south_east'] ? '' : 'c-light'}"> South East <div style="margin-left: 55px;" class="darkRegionText ${inputMapData['south_east'] ? '' : 'c-light'}">${this.toCurrencyPipe.transform(inputMapData['south_east'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['south_east'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'northern_ireland', value: [54.80, -13], html: `<span class="darkRegionText ${inputMapData['northern_ireland'] ? '' : 'c-light'}">Northern Ireland </span><span><img src="assets/layout/images/line_to_left.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_left_dark.svg" alt="Line" class="darkArrow"></span><div class="darkRegionText ${inputMapData['northern_ireland'] ? '' : 'c-light'}">${this.toCurrencyPipe.transform(inputMapData['northern_ireland'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['northern_ireland'], '', ' ', '1.0-0') : '0'}</div>` },
						{ label: 'south_west', value: [50.8, -8.5], html: `<span class="darkRegionText ${inputMapData['south_west'] ? '' : 'c-light'}">South West </span><span><img src="assets/layout/images/line_to_left_tilt_down.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_left_tilt_down_dark.svg" alt="Line" class="darkArrow"><div class="darkRegionText ${inputMapData['south_west'] ? '' : 'c-light'}">${this.toCurrencyPipe.transform(inputMapData['south_west'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['south_west'], '', ' ', '1.0-0') : '0'}</div></span>` },						
						{ label: 'yorkshire_and_the_humber', value: [54.3, -1],
						html: `
							<span>
								<img src="assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow">
							</span>
								<span class="darkRegionText ${inputMapData['yorkshire_and_the_humber'] ? '' : 'c-light'}"> Yorkshire and The Humber 
								<div style="margin-left: 55px;" class="darkRegionText ${inputMapData['yorkshire_and_the_humber'] ? '' : 'c-light'}">${this.toCurrencyPipe.transform(inputMapData['yorkshire_and_the_humber'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['yorkshire_and_the_humber'], '', ' ', '1.0-0') : '0'}
								</div>
							</span>
						` },
						{ label: 'east_of_england', value: [52.35, 0.9999999],
						html: `
							<span>
								<img src="assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow">
								<img src="assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow">
							</span>
							<span class="darkRegionText ${inputMapData['east_of_england'] ? '' : 'c-light'}"> East of England
								<div style="margin-left: 55px;" class="darkRegionText ${inputMapData['east_of_england'] ? '' : 'c-light'}">${this.toCurrencyPipe.transform(inputMapData['east_of_england'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['east_of_england'], '', ' ', '1.0-0') : '0'}
								</div>
							</span>
						` },
						{ label: 'west_midlands', value: [52.75, -11.90], html: `<span class="darkRegionText ${inputMapData['west_midlands'] ? '' : 'c-light'}">West Midlands </span><span><img src="assets/layout/images/line_to_left_long.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_left_long_dark.svg" alt="Line" class="darkArrow"><div class="darkRegionText ${inputMapData['west_midlands'] ? '' : 'c-light'}">${this.toCurrencyPipe.transform(inputMapData['west_midlands'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['west_midlands'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'east_midlands', value: [53.35, -0.3], html: `<span><img src="assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_right_dark.svg" alt="Line"  class="darkArrow"></span><span class="darkRegionText ${inputMapData['east_midlands'] ? '' : 'c-light'}"> East Midlands <div style="margin-left: 55px;" class="darkRegionText ${inputMapData['east_midlands'] ? '' : 'c-light'}">${this.toCurrencyPipe.transform(inputMapData['east_midlands'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['east_midlands'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'north_west', value: [53.8, -7.5], html: `<span class="darkRegionText ${inputMapData['north_west'] ? '' : 'c-light'}">North West </span><span><img src="assets/layout/images/line_to_left.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_left_dark.svg" alt="Line" class="darkArrow"></span><div class="darkRegionText ${inputMapData['north_west'] ? '' : 'c-light'}">${this.toCurrencyPipe.transform(inputMapData['north_west'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['north_west'], '', ' ', '1.0-0') : '0'}</div>` },
						{ label: 'north_east', value: [55.50, -1.7], html: `<span><img src="assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText ${inputMapData['north_east'] ? '' : 'c-light'}"> North East<div style="margin-left: 55px;" class="darkRegionText ${inputMapData['north_east'] ? '' : 'c-light'}">${this.toCurrencyPipe.transform(inputMapData['north_east'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['north_east'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'scotland', value: [57.186456, -2.50], html: `<span><img src="assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText }"> Scotland<div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['scotland'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['scotland'], '', ' ', '1.0-0') : '0'}</div></span>` }
					];

					if (this.requiredData['selectedRegionList'] !== '' && !this.requiredData['selectedRegionList'].filter(val => !val).length) {

						this.currentYearMapRegionArray = this.currentYearMapRegionArray.filter(value => this.requiredData.selectedRegionList.includes(value.label.replace(/_/gi, ' ')))

					}

				}

				if ( [ 'insightsYearly', 'insightsMonthly', 'esgIndex' ].includes( this.requiredData.thisPage ) ) {

					this.currentYearMapRegionArray = [
						{ label: 'wales', value: [51.9, -7.8], html: `<span class="darkRegionText">Wales </span><span><img src="assets/layout/images/line_to_left.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_left_dark.svg" alt="Line" class="darkArrow"><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['wales'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['wales'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'london', value: [51.40, 0.2], html: `<span><img src="assets/layout/images/line_to_right_long.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_right_long_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> London <div  class="darkRegionText" style="margin-left: 139px;">${this.toCurrencyPipe.transform(inputMapData['london'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['london'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'south_east', value: [50.85, -0.8], html: `<span><img src="assets/layout/images/line_to_right_tilt_down.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_right_tilt_down_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> South East <div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['south_east'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['south_east'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'northern_ireland', value: [54.80, -13], html: `<span class="darkRegionText">Northern Ireland </span><span><img src="assets/layout/images/line_to_left.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_left_dark.svg" alt="Line" class="darkArrow"></span><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['northern_ireland'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['northern_ireland'], '', ' ', '1.0-0') : '0'}</div>` },
						{ label: 'south_west', value: [50.8, -8.5], html: `<span class="darkRegionText">South West </span><span><img src="assets/layout/images/line_to_left_tilt_down.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_left_tilt_down_dark.svg" alt="Line" class="darkArrow"><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['south_west'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['south_west'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'yorkshire_and_the_humber', value: [54.3, -1], html: `<span><img src="assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> Yorkshire and The Humber <div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['yorkshire_and_the_humber'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['yorkshire_and_the_humber'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'east_of_england', value: [52.35, 0.9999999], html: `<span><img src="assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> East of England <div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['east_of_england'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['east_of_england'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'west_midlands', value: [52.75, -11.90], html: `<span class="darkRegionText">West Midlands </span><span><img src="assets/layout/images/line_to_left_long.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_left_long_dark.svg" alt="Line" class="darkArrow"><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['west_midlands'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['west_midlands'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'east_midlands', value: [53.35, -0.3], html: `<span><img src="assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_right_dark.svg" alt="Line"  class="darkArrow"></span><span class="darkRegionText"> East Midlands <div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['east_midlands'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['east_midlands'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'north_west', value: [53.8, -7.5], html: `<span class="darkRegionText">North West </span><span><img src="assets/layout/images/line_to_left.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_left_dark.svg" alt="Line" class="darkArrow"></span><div class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['north_west'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['north_west'], '', ' ', '1.0-0') : '0'}</div>` },
						{ label: 'north_east', value: [55.50, -1.7], html: `<span><img src="assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> North East<div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['north_east'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['north_east'], '', ' ', '1.0-0') : '0'}</div></span>` },
						{ label: 'scotland', value: [57.186456, -2.50], html: `<span><img src="assets/layout/images/line_to_right.svg" alt="Line" class="lightArrow"><img src="assets/layout/images/line_to_right_dark.svg" alt="Line" class="darkArrow"></span><span class="darkRegionText"> Scotland<div style="margin-left: 55px;" class="darkRegionText">${this.toCurrencyPipe.transform(inputMapData['scotland'], '', ' ', '1.0-0') !== null ? this.toCurrencyPipe.transform(inputMapData['scotland'], '', ' ', '1.0-0') : '0'}</div></span>` }
					];

				}

				for ( let regionDataObj of this.currentYearMapRegionArray ) {
					L.marker(regionDataObj['value'], {
						icon: L.divIcon({
							className: 'text-labels',
							html: regionDataObj['html']
						}),
						zIndexOffset: 1000
					}).addTo(this.currentYearMap)
				}

				let countArray2 = []

				for ( let key in inputMapData ) {
					if (parseInt(inputMapData[key])) {
						countArray2.push(parseInt(inputMapData[key]));
					} else {
						countArray2.push(0);
					}
				}

				let currentYearMapDataQ1 = this.quantile(countArray2, 25);
				let currentYearMapDataQ2 = this.quantile(countArray2, 50);
				let currentYearMapDataQ3 = this.quantile(countArray2, 75);
				let currentYearMapDataQ4 = this.quantile(countArray2, 100);

				for ( let feature of this.mapGeoJson["features"] ) {

					feature["properties"]["currentYearDataQuartile"] = {
						Q1: currentYearMapDataQ1,
						Q2: currentYearMapDataQ2,
						Q3: currentYearMapDataQ3,
						Q4: currentYearMapDataQ4
					}
				}

				for ( let feature of this.mapGeoJson["features"] ) {
					let x = feature['properties']['name'].replace(/\s/g, "_").toLowerCase();
					let curentYearCount = inputMapData[x];
					feature['properties']['currentYearCount'] = curentYearCount;
				}

				let _this = this;

				geojson = L.geoJSON(this.mapGeoJson, {
					style: function (feature) {

						// let featureRegionFillColors = [ '#11625b', '#1a9c91', '#21c3b5', '#4dcfc4', '#7adbd3'],
						let featureRegionFillColors = [ `var( --${ _this.mapConfig.primaryMapColorTheme }-700 )`, `var( --${ _this.mapConfig.primaryMapColorTheme }-500 )`, `var( --${ _this.mapConfig.primaryMapColorTheme }-400 )`, `var( --${ _this.mapConfig.primaryMapColorTheme }-200 )`, `var( --${ _this.mapConfig.primaryMapColorTheme }-100 )`],
							// featureOutlineColor = '#135260';
							featureOutlineColor = `var( --${ _this.mapConfig.primaryMapColorTheme }-900 )`;

						if( feature['properties']['currentYearCount'] == undefined ) {
							featureOutlineColor = '#bbb';
							featureRegionFillColors = ['#f5f5f5', '#f5f5f5', '#f5f5f5', '#f5f5f5', '#f5f5f5'];
						}

						if ( [ 'investorFinderPage', 'internationalTradePage', 'investeeFinderPage', 'lendingLandscapes', 'corporateRiskLandscape', 'hnwiLandscape' ].includes( _this.requiredData.thisPage ) ) {
							
							if ( feature['properties']['currentYearCount'] !== undefined ) {
	
								if ( _this.requiredData['selectedRegionList'] !== '' && !_this.requiredData['selectedRegionList'].filter(val => !val).length && !_this.requiredData['selectedRegionList'].includes( feature['properties']['name'].toLowerCase() ) ) {
									featureOutlineColor = '#bbb';
									featureRegionFillColors = ['#f5f5f5', '#f5f5f5', '#f5f5f5', '#f5f5f5', '#f5f5f5'];
								}
							}

						}

						const ColorStyleConfigMeta = {
							color: featureOutlineColor,
							weight: 0.5,
							fillColor: featureRegionFillColors[4],
							fillOpacity: 1
						};

						if ( feature['properties']['currentYearCount'] > feature['properties']['currentYearDataQuartile']['Q4'] ) {
							return {
								...ColorStyleConfigMeta,
								fillColor: featureRegionFillColors[0]
							};
						} else if ( feature['properties']['currentYearCount'] <= feature['properties']['currentYearDataQuartile']['Q4'] && feature['properties']['currentYearCount'] > feature['properties']['currentYearDataQuartile']['Q3'] ) {
							return {
								...ColorStyleConfigMeta,
								fillColor: featureRegionFillColors[1]
							};
						} else if ( feature['properties']['currentYearCount'] <= feature['properties']['currentYearDataQuartile']['Q3'] && feature['properties']['currentYearCount'] > feature['properties']['currentYearDataQuartile']['Q2'] ) {
							return {
								...ColorStyleConfigMeta,
								fillColor: featureRegionFillColors[2]
							};
						} else if ( feature['properties']['currentYearCount'] <= feature['properties']['currentYearDataQuartile']['Q2'] && feature['properties']['currentYearCount'] > feature['properties']['currentYearDataQuartile']['Q1'] ) {
							return {
								...ColorStyleConfigMeta,
								fillColor: featureRegionFillColors[3],
							};
						} else if ( feature['properties']['currentYearCount'] <= feature['properties']['currentYearDataQuartile']['Q1']) {
							return {
								...ColorStyleConfigMeta
							};
						} else {
							return {
								...ColorStyleConfigMeta,
							};
						}
					},
					onEachFeature: function onEachFeature(feature, layer: L.Layer) {

						if (feature.properties.currentYearCount) {
							layer.on({
								click: createUrlAndGoToThePage
							});
						}

					}
				}).addTo(this.currentYearMap);

			}, 1000);

		}

	}

	quantile( array, percentile ) {
		let result: any;
		array.sort(function (a, b) {
			return a - b;
		});
		let index = percentile / 100. * (array.length - 1);
		if (Math.floor(index) == index) {
			result = array[index];
		} else {
			let i = Math.floor(index)
			let fraction = index - i;
			result = array[i] + (array[i + 1] - array[i]) * fraction;
		}
		return result;
	}

	setIndustryWiseFurloughCounts() {

		for ( let dataObject of this.mapData.currentYearData ) {

			if (this.requiredData.selectedRegion.toLowerCase() == dataObject.region) {

				for (let dataIndustry of dataObject.industries) {

					for (let industry of this.requiredData.industryListData) {

						if (industry['value'] == dataIndustry['industry']) {
							industry['doc_count'] = dataIndustry['count'];
						}

					}

				}

			}

		}

	}

	goToCompanyPage( event, selectedRegion?, globalFilterData?, requiredData? ) {

		let navigateUrlParamObject: any = [];
		let urlStr: string;

		if( this.activatedRoute.snapshot.queryParams?.['chipData'] && JSON.parse(this.activatedRoute.snapshot.queryParams['chipData']).length ) {
			navigateUrlParamObject = JSON.parse( this.activatedRoute.snapshot.queryParams['chipData'] );
			navigateUrlParamObject = navigateUrlParamObject.filter( val => val.chip_group !== 'Region' );

		} else if ( ['investeeFinderPage', 'investorFinderPage', 'diversityCalculationStats'].includes( this.requiredData.thisPage ) ) { 
			navigateUrlParamObject = JSON.parse( JSON.stringify( globalFilterData.filterData ) );

	    } else if( ['businessCollaborators', 'procurementPartners', 'fiscalHoldings'].includes( this.mapData?.listDataParams?.listPageName ) ) {
			navigateUrlParamObject.push( { chip_group: 'Saved Lists', chip_values: [ this.mapData.listDataParams.displayName ] } );
		} else {
			if ( !this.mapData?.listDataParams?.listID ) {
				navigateUrlParamObject.push({
					chip_group: 'Status',
					chip_values: [ 'live' ]
				});
			}
		}
		
		navigateUrlParamObject.push(
			{
				chip_group: 'Region',
				chip_values: [ selectedRegion ?  selectedRegion : event.target.feature.properties.name.toLowerCase()]
			}
		);
		if( this.activatedRoute.snapshot.queryParams['listId'] ) {
			urlStr = String( this.router.createUrlTree( ['/company-search'], { queryParams: { chipData: JSON.stringify( navigateUrlParamObject ), listPageName: this.outputPageName, listId: this.activatedRoute.snapshot.queryParams['listId'] } }) );
		} else if( this.activatedRoute.snapshot.queryParams['cListId'] ) {
			urlStr = String( this.router.createUrlTree( ['/company-search'], { queryParams: { chipData: JSON.stringify( navigateUrlParamObject ), listPageName: this.inputPageName, cListId: this.listId, listName: this.listName } }) );
		} else if( this.activatedRoute.snapshot.queryParams['listPageName'] ) {
			urlStr = String( this.router.createUrlTree( ['/company-search'], { queryParams: { chipData: JSON.stringify( navigateUrlParamObject ), listPageName: this.outputPageName, cListId: this.listId } }) );
		} else if( this.mapData.listDataParams ) {
			urlStr = String( this.router.createUrlTree( ['/company-search'], { queryParams: { chipData: JSON.stringify( navigateUrlParamObject ), listPageName: this.mapData.listDataParams.listPageName, cListId: this.mapData.listDataParams.listID } }) );
		} else if( globalFilterData?.listId){
			urlStr = String( this.router.createUrlTree( ['/company-search'], { queryParams: { chipData: JSON.stringify( navigateUrlParamObject ), listPageName: globalFilterData.pageName, cListId: globalFilterData.listId, listName: globalFilterData.listName } }) );
		}
		else {
			urlStr = String( this.router.createUrlTree( ['/company-search'], { queryParams: { chipData: JSON.stringify( navigateUrlParamObject ) } }) );
		}

		window.open( urlStr, '_blank' );

	}

}
