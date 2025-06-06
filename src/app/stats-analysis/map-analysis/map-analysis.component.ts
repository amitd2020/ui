import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { GeoJsonObject, FeatureCollection, Point } from 'geojson';
import { ukRegions, geojsonFeature, mapLayerStoreData } from './map-constant.index';
import { environment } from 'src/environments/environment';
import 'leaflet.heat';
import 'leaflet.fullscreen';
import leafletImage from 'leaflet-image';
import { ContentContainer } from '@fullcalendar/core/internal';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { NumberSuffixPipe } from 'src/app/interface/custom-pipes/number-suffix/number-suffix.pipe';

type HeatmapDataPoint = [number, number, number?];

@Component({
    selector: 'dg-map-analysis',
    templateUrl: './map-analysis.component.html',
    styleUrls: ['./map-analysis.component.scss'],
})

export class MapAnalysisComponent implements AfterViewInit, OnChanges {
    private map: L.Map;
    private companiesMarkerArray: L.Marker[] = [];
    private countyCircleMarkerArray: L.CircleMarker[] = [];
    private councilCircleMarkerArray: L.CircleMarker[] = [];
    private postCodeCircleMarkerArray: L.CircleMarker[] = [];
    private geojsonLayer: L.GeoJSON;
    checked: boolean = false;

    private heatLayer: L.HeatLayer;

    @Input() mapData: any = {};
    @Input() selectedFilter: any = {};
    @Input() showMapCheckbox: boolean = false;
    @Input() mapId: string = '';
    @Input() globalFilterDataObject: any = {};
    @Input() thisPage: string = '';
    @Input() listName: string;
    @Input() listPageName: string;

    geojsonFeature: FeatureCollection<Point, { name: string }> = geojsonFeature;
    geoJsonPolygonData = [];
    mapLayer = mapLayerStoreData;

    mapNgmodelObj: Object = {
        companiesNgModel: true,
        postCodeNgModel: true,
        countyNgModel: true,
        councilNgModel: true,
    }

    mapCheckBoxHandler = [
        { label: 'County', inputId: 'county', disable: false, mapModel: 'countyNgModel', fn: ( state: boolean, layer?: any ) => { this.handleLayer( state, layer=this.countyLayerGroup) } },
        // { label: 'Post Code', inputId: 'postcode', mapModel: 'postCodeNgModel', fn: ( state: boolean, layer?: any ) => { this.handleLayer( state, layer=this.postCodeLayerGroup) } },
        { label: 'Council', inputId: 'council', disable: false, mapModel: 'councilNgModel', fn: ( state: boolean, layer?: any ) => { this.handleLayer( state, layer=this.councilLayerGroup) } },
        // { label: 'Companies', inputId: 'companies', mapModel: 'companiesNgModel', fn: ( state: boolean, layer?: any ) => { this.handleLayer( state, layer=this.companiesLayerGroup) } },
    ]

    private countyLayerGroup: L.LayerGroup;
    private postCodeLayerGroup: L.LayerGroup;
    private companiesLayerGroup: L.LayerGroup;
    private councilLayerGroup: L.LayerGroup;

    constructor(
		public toNumberSuffix: NumberSuffixPipe,
		private toTitleCasePipe: TitleCasePipe,
    ) {}

    ngOnChanges( changes: SimpleChanges ) {
        if ( changes && changes?.mapData ) {
            this.initMap();
        }
    }

    ngAfterViewInit() {
        this.initMap();
    }

    private async initMap() {

        const mapContainer = document.getElementById(this.mapId);

        if (!mapContainer) {
            console.error('Map container not found');
            return;
        }

        if ( this.map ) {
            this.map.remove();
        }

        //? Initialize the map
        this.map = L.map( this.mapId, {
            center: [53.4831, -2.2426],
            zoom: 5,
            fullscreenControl: true,
            fullscreenControlOptions: {
              position: 'topleft',
              title: 'Show fullscreen',
              titleCancel: 'Exit fullscreen',
              content: null,
              forceSeparateButton: true,
              forcePseudoFullscreen: true,
              fullscreenElement: false
            },
          });

        //? Define the base layers
        this.mapLayer.openStreetMapLayer.addTo(this.map);

        //? Create a layer control and add it to the map
        const baseLayers = {
            "OpenStreetMap": this.mapLayer.openStreetMapLayer,
            "Google Maps": this.mapLayer.googleMapsLayer,
            "Neighbourhood": this.mapLayer.Thunderforest_Neighbourhood,
            "Landscape": this.mapLayer.Landscape,
            "Transport": this.mapLayer.Transport
        };

        L.control.layers(baseLayers).addTo(this.map);

        //? Create layer groups
        this.countyLayerGroup = L.layerGroup().addTo(this.map);
        this.councilLayerGroup = L.layerGroup().addTo(this.map);
        this.postCodeLayerGroup = L.layerGroup().addTo(this.map);
        this.companiesLayerGroup = L.layerGroup().addTo(this.map);

        //? Remove marker on reset
        this.companiesMarkerArray.forEach((marker) => marker.remove());
        this.countyCircleMarkerArray.forEach((marker) => marker.remove());
        this.councilCircleMarkerArray.forEach((marker) => marker.remove());
        this.postCodeCircleMarkerArray.forEach((marker) => marker.remove());

        this.companiesMarkerArray = [];
        this.countyCircleMarkerArray = [];
        this.councilCircleMarkerArray = [];
        this.postCodeCircleMarkerArray = [];


        //? Load geojsonDAta
        await this.fetchGeoJsonData();

        //? Load and add GeoJSON data
        let { region } = this.mapData;
        if ( region && region.length ) {
            this.loadGeoJSONLayer( this.geoJsonPolygonData );
        }

        //? Add heatmap data
        // this.addHeatmapLayer();
 
        //? ADD MARKER
        this.addMarkerOnMap( this.mapData );
        
    }

    resetMap() {
        this.mapNgmodelObj = {
            companiesNgModel: true,
            postCodeNgModel: true,
            countyNgModel: true,
            councilNgModel: true,
        }
        this.initMap();
    }

    private async addHeatmapLayer() {
        // Prepare your heatmap data
        const heatmapData: HeatmapDataPoint[] = this.getHeatmapData();

        // if (this.heatLayer) {
        //     this.map.removeLayer(this.heatLayer);
        // }

        // setTimeout(() => {
        //     this.heatLayer = L.heatLayer(heatmapData, {
        //         radius: 25,
        //         blur: 15,
        //         maxZoom: 5
        //     }).addTo(this.map);
        // }, 100);
    }

    private getHeatmapData():  HeatmapDataPoint[] {
        return [
            [53.4831, -2.2426, 0.5],
            [53.4835, -2.2427, 0.8],
            [53.4840, -2.2430, 0.2]
        ];
    }

    async fetchGeoJsonData() {

        try {
            const data = await fetch( `${ environment.json }/uk_regions_map.json` ).then( res => res.json() );
            this.geoJsonPolygonData = data;
            
        } catch (error) {
            console.error('Error loading GeoJSON data:', error)
        }

    }

    private loadGeoJSONLayer( geoJsonData: any ) {
        let { region } = this.mapData;
        
        region = region.filter( item => item?.key != 'not specified' );

        const defaultStyle = {
            color: '#66B366',
            weight: 0,
            opacity: 0,
            fillOpacity: 0
        };

        const selectedStyle = {
            color: '#FF5722', // Color for selected region
            weight: 2,
            opacity: 1,
            fillOpacity: 0.6
        };

        let previouslySelectedLayer: L.Path  | null = null;
        const originalStyles = new Map<string, L.PathOptions>();
        const layerFeatureMap = new Map<L.Path, any>();

        this.geojsonLayer = L.geoJSON( geoJsonData, {

            style: ( feature ) => {

                let color = defaultStyle.color;
                let fillOpacity = defaultStyle.fillOpacity;
                let weight = defaultStyle.weight;
                let opacity = defaultStyle.opacity;

                region.forEach( item => {
                    if ( feature.properties && (feature.properties.name).toLowerCase() == item?.key ) {
                        feature['properties']['count'] = (this.toNumberSuffix.transform((item?.count || item?.doc_count), 1));
                        color =  '#009688';
                        fillOpacity = 0.4;
                        weight = 1;
                        opacity = 1;
                    }
                } )

                const featureKey = feature.properties?.name.toLowerCase();
                if (featureKey && !originalStyles.has(featureKey)) {
                    originalStyles.set(featureKey, { color, fillOpacity, weight, opacity });
                }

                return {
                    color: color,
                    weight: weight,
                    opacity: opacity,
                    fillOpacity: fillOpacity
                };

            },

            onEachFeature: (feature, layer) => {
                if (feature.properties && feature.properties.name) {

                    const leafletLayer = layer as L.Path;
                    layerFeatureMap.set(leafletLayer, feature);

                    if ( feature.properties?.count ) {
                        layer.bindPopup(`<b>${this.toTitleCasePipe.transform(feature.properties.name)}:<b> ${feature.properties?.count}`); 
                    } else {
                        layer.bindPopup(`<b>${this.toTitleCasePipe.transform(feature.properties.name)}</b>`);
                    }

                    if ( ( feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon' ) && feature.properties?.count ) {
                        
                        const centroid = this.calculateCentroid(feature.geometry);
    
                        const marker = L.marker(centroid, {
                            icon: L.divIcon({
                                className: 'text-label',
                                html: `<div style="
                                color: black;
                                font-size: 15px;
                                font-weight: bold; 
                                background-color: #e2b912;
                                min-width: 60px;
                                max-width: 80px;
                                border-radius: 20%;
                                padding: 1px;
                                border: 1px solid #ccc;
                            ">${  feature.properties?.count ? feature.properties?.count : ''}</div>`,
                            }),
                            zIndexOffset: 1000
                        }).addTo(this.map);

                        let route = this.thisPage == 'contractFinderPage' ? '/company-search/contract-finder' : '/company-search';

                        if ( this.globalFilterDataObject.listId || this.globalFilterDataObject.listName ) {

                            // if( this.globalFilterDataObject.diversityCalculationPage ) {
                            //     this.selectedFilter = this.selectedFilter = this.selectedFilter.filter(val => val.chip_group != 'Status');
                            //     this.selectedFilter.push({ chip_group: 'Status', chip_values: [ 'live' ] })
                            // }
                            this.selectedFilter = this.selectedFilter.filter(val => !['Region', 'Saved Lists', 'Contract Region'].includes(val.chip_group));

                            this.selectedFilter.push(
                                { chip_group: 'Saved Lists', chip_values: [ this.thisPage != 'contractFinderPage' ? this.globalFilterDataObject.listName : this.listName ] },
                                {chip_group: this.thisPage == 'contractFinderPage' ? 'Contract Region' : 'Region', chip_values: [feature.properties.name.toLowerCase()]})
                            let filterData = encodeURIComponent(JSON.stringify(this.selectedFilter)),
                                url = `${route}?chipData=${filterData}&cListId=${this.globalFilterDataObject.listId}&listPageName=${this.thisPage != 'contractFinderPage' ? this.globalFilterDataObject.listPageName : this.listPageName}&listName=${this.thisPage != 'contractFinderPage' ? this.globalFilterDataObject.listName : this.listName}`;
                            marker.bindPopup(`
                                <b>${this.toTitleCasePipe.transform(feature.properties.name)}</b><br>
                                Count: ${feature.properties.count || 'N/A'}<br>
                                <a href="${url}" id="link-${feature.properties.name}" target="_blank">Show Result</a>
                            `); 
                        } else if( this.selectedFilter.length  ) {
                            this.selectedFilter = this.selectedFilter.filter(val => !['Region', 'Contract Region'].includes(val.chip_group));
                            this.selectedFilter.push({chip_group: this.thisPage == 'contractFinderPage' ? 'Contract Region' : 'Region', chip_values: [feature.properties.name.toLowerCase()]})
                            let filterData = encodeURIComponent(JSON.stringify(this.selectedFilter))
                            let url = `${route}?chipData=${filterData}`;

                            marker.bindPopup(`
                                <b>${this.toTitleCasePipe.transform(feature.properties.name)}</b><br>
                                Count: ${feature.properties.count || 'N/A'}<br>
                                <a href="${url}" id="link-${feature.properties.name}" target="_blank">Show Result</a>
                            `);
                        } else {
                            marker.bindPopup(`
                                <b>${this.toTitleCasePipe.transform(feature.properties.name)}</b><br>
                                Count: ${feature.properties.count || 'N/A'}
                            `);
                        }
                          
                        marker.on('click', () => {
                            marker.openPopup();
                        });
                    }

                    leafletLayer.on('click', (e) => {
                        const clickedLayer = e.target as L.Path;
                        
                        if (previouslySelectedLayer === clickedLayer) {
                            const clickedFeature = layerFeatureMap.get(clickedLayer);
                            const clickedKey = clickedFeature?.properties?.name.toLowerCase();
                            if (clickedKey && originalStyles.has(clickedKey)) {
                                clickedLayer.setStyle(originalStyles.get(clickedKey)!);
                            }
                            previouslySelectedLayer = null;
                        } else {

                            if (previouslySelectedLayer) {
                                const previouslySelectedFeature = layerFeatureMap.get(previouslySelectedLayer);
                                const previouslySelectedKey = previouslySelectedFeature?.properties?.name.toLowerCase();
                                if (previouslySelectedKey && originalStyles.has(previouslySelectedKey)) {
                                    previouslySelectedLayer.setStyle(originalStyles.get(previouslySelectedKey)!);
                                }
                            }
                    
                            clickedLayer.setStyle(selectedStyle);
                            previouslySelectedLayer = clickedLayer;
                        }
                        // previouslySelectedLayer = clickedLayer;
                    });
                }

            },

        }).addTo(this.map);
    }

    private calculateCentroid(geometry: any): L.LatLng {
        let coords: [number, number][] = [];
    
        if (geometry.type === 'Polygon') {
            coords = geometry.coordinates[0];
        } else if (geometry.type === 'MultiPolygon') {
            // Take the first polygon of the MultiPolygon for simplicity
            coords = geometry.coordinates[0][0];
        }
    
        if (coords.length === 0) return L.latLng(0, 0); // Return a default value if no coordinates
    
        // Calculate average latitude and longitude
        const [lngSum, latSum] = coords.reduce((acc, coord) => {
            acc[0] += coord[0];
            acc[1] += coord[1];
            return acc;
        }, [0, 0]);
    
        const lngAvg = lngSum / coords.length;
        const latAvg = latSum / coords.length;
    
        return L.latLng(latAvg, lngAvg);
    }

	private addMarkerOnMap( mapData: any ) {

        const { county, postCode, result } = mapData;
        const { countyCouncil, districtCouncil, metropolitanCouncil, londonBoroughsCouncil, unitaryCouncil } = mapData;
        let councilData = [];

        for ( const [key, value] of Object.entries({ countyCouncil, districtCouncil, metropolitanCouncil, londonBoroughsCouncil, unitaryCouncil }) ) {
            if (Array.isArray(value) && value.length > 0) {
                councilData = value;
                break;
              }
        }
        
        //? disable value Hanlde checkbox on map
        this.mapCheckBoxHandler = this.mapCheckBoxHandler.map(item => {
            if (item.inputId === 'county') {
                return { ...item, disable: !(county && county.length) };
            } else if (item.inputId === 'council') {
                return { ...item, disable: !(councilData && councilData.length) };
            }
            return item;
        });

        //? disable value Hanlde checkbox on map
        this.mapCheckBoxHandler = this.mapCheckBoxHandler.map(item => {
            if (item.inputId === 'county') {
                return { ...item, disable: !(county && county.length) };
            } else if (item.inputId === 'council') {
                return { ...item, disable: !(councilData && councilData.length) };
            }
            return item;
        });

        if ( county && county.length ) {
            for (let val of county) {
    
                let options = {
                    color: '#3333FF',
                    fillColor: '#8080FF',
                    fillOpacity: 0.5,
                    radius: 6000
                }
                if( this.globalFilterDataObject.listId && this.globalFilterDataObject.listName ) {

                    // if( this.globalFilterDataObject.diversityCalculationPage ) {
                    //     this.selectedFilter = this.selectedFilter.filter(val => val.chip_group != 'Status');
                    //     this.selectedFilter.push({ chip_group: 'Status', chip_values: [ 'live' ] })
                    // }
                    this.selectedFilter = this.selectedFilter.filter(val => !['County', 'Saved Lists'].includes(val.chip_group));
                    this.selectedFilter.push(
                        { chip_group: 'Saved Lists', chip_values: [ this.globalFilterDataObject.listName ] },
                        {chip_group: 'County', chip_values: [val.field.toLowerCase()]})
                    let filterData = encodeURIComponent(JSON.stringify(this.selectedFilter));
                        
                    let url = `/company-search?chipData=${filterData}&cListId=${this.globalFilterDataObject.listId}&listPageName=${this.globalFilterDataObject.listPageName}&listName=${this.globalFilterDataObject.listName}`;
                    const popupContent = `<b>${this.toTitleCasePipe.transform(val.field)}</b><br>Count: ${val.count}<br><a href="${url}" id="link-${val.count}" target="_blank">Show Result</a>`;
                    const marker = L.circle( val.latLong, options )
                    .bindPopup(popupContent)
                    .addTo(this.countyLayerGroup);
                    this.countyCircleMarkerArray.push(marker);  
                } else if( this.selectedFilter.length  ) {

                    this.selectedFilter = this.selectedFilter.filter(val => val.chip_group != 'County');
                    this.selectedFilter.push({chip_group: 'County', chip_values: [val.field.toLowerCase()]})
                    let filterData = encodeURIComponent(JSON.stringify(this.selectedFilter));
                    let url = `/company-search?chipData=${filterData}`;
                    const popupContent = `<b>${this.toTitleCasePipe.transform(val.field)}</b><br>Count: ${val.count}<br><a href="${url}" id="link-${val.count}" target="_blank">Show Result</a>`;
                    const marker = L.circle( val.latLong, options )
                    .bindPopup(popupContent)
                    .addTo(this.countyLayerGroup);
                    this.countyCircleMarkerArray.push(marker);
                } else {
                    const popupContent = `<b>${this.toTitleCasePipe.transform(val.field)}</b><br>Count: ${val.count}`;
                      const marker = L.circle( val.latLong, options )
                          .bindPopup(popupContent)
                          .addTo(this.countyLayerGroup);
                          this.countyCircleMarkerArray.push(marker);
                }
            }
        }

        if ( councilData && councilData.length ) {
            for (let val of councilData) {
    
                let options = {
                    color: '#F9629F',
                    fillColor: '#FA81B2',
                    fillOpacity: 0.5,
                    radius: 4000
                }

                if( this.globalFilterDataObject.listId && this.globalFilterDataObject.listName ) {

                    let chipGrpName =this.selectedFilter.filter(val => [ 'County Council', 'Unitary Council', 'District Council', 'Metropolitan Council', 'London Boroughs Council' ].includes(val.chip_group));

                    // if( this.globalFilterDataObject.diversityCalculationPage ) {
                    //     this.selectedFilter = this.selectedFilter.filter(val => val.chip_group != 'Status');
                    //     this.selectedFilter.push({ chip_group: 'Status', chip_values: [ 'live' ] })
                    // }
                    this.selectedFilter = this.selectedFilter.filter(val => ![chipGrpName[0].chip_group, 'Saved Lists'].includes(val.chip_group));
                    this.selectedFilter.push(
                        { chip_group: 'Saved Lists', chip_values: [ this.globalFilterDataObject.listName ] },
                        {chip_group: chipGrpName[0].chip_group, chip_values: [val.field.toLowerCase()]})
                    let filterData = encodeURIComponent(JSON.stringify(this.selectedFilter));
                        
                    let url = `/company-search?chipData=${filterData}&cListId=${this.globalFilterDataObject.listId}&listPageName=${this.globalFilterDataObject.listPageName}&listName=${this.globalFilterDataObject.listName}`;
                    const popupContent = `<b>${this.toTitleCasePipe.transform(val.field)}</b><br>Count: ${val.count}<br><a href="${url}" id="link-${val.count}" target="_blank">Show Result</a>`;
                    if ( val.latLong[0] && val.latLong[1]  ) {
                    
                        const marker = L.circle( val.latLong, options )
                            .bindPopup(popupContent)
                            .addTo(this.councilLayerGroup);
            
                        this.councilCircleMarkerArray.push(marker);
                    }
                } else if( this.selectedFilter.length  ) {

                    let chipGrpName =this.selectedFilter.filter(val => [ 'County Council', 'Unitary Council', 'District Council', 'Metropolitan Council', 'London Boroughs Council' ].includes(val.chip_group));
                    
                    this.selectedFilter = this.selectedFilter.filter(val => val.chip_group != chipGrpName[0].chip_group);
                    this.selectedFilter.push({chip_group: chipGrpName[0].chip_group, chip_values: [val.field.toLowerCase()]})
                    let filterData = encodeURIComponent(JSON.stringify(this.selectedFilter));

                    let url = `/company-search?chipData=${filterData}`;
                    const popupContent = `<b>${this.toTitleCasePipe.transform(val.field)}</b><br>Count: ${val.count}<br><a href="${url}" id="link-${val.count}" target="_blank">Show Result</a>`;
                    if ( val.latLong[0] && val.latLong[1]  ) {
                    
                        const marker = L.circle( val.latLong, options )
                            .bindPopup(popupContent)
                            .addTo(this.councilLayerGroup);
            
                        this.councilCircleMarkerArray.push(marker);
                    }
                } else {
                    const popupContent = `<b>${this.toTitleCasePipe.transform(val.field)}</b><br>Count: ${val.count}`;
                    if ( val.latLong[0] && val.latLong[1]  ) {
                    
                        const marker = L.circle( val.latLong, options )
                            .bindPopup(popupContent)
                            .addTo(this.councilLayerGroup);
            
                        this.councilCircleMarkerArray.push(marker);
                    }
                }
            }
        }

        if ( postCode && postCode.length ) {
            for (let val of postCode) {
    
                let options = {
                    color: 'yellow',
                    fillColor: '#FFFF99',
                    fillOpacity: 0.5,
                    radius: 500
                }
    
                const popupContent = `<b>${val.field}</b><br>Count: ${this.toNumberSuffix.transform(val.count, 1)}`;
    
                const marker = L.circle( val.latLong, options )
                    .bindPopup(popupContent)
                    .addTo(this.postCodeLayerGroup);
                this.postCodeCircleMarkerArray.push(marker);
            }
        }

        if ( result && result.length ) {

            for (let val of result) {
    
                const popupContent = `<b>${val.companyContactInformation?.company_name}</b><br>Company No.: ${val.companyContactInformation?.company_reg}`;
    
                const marker = L.marker(val.latLong)
                    .bindPopup(popupContent)
                    .addTo(this.companiesLayerGroup);
                this.companiesMarkerArray.push(marker);
            }
        }

	}

    selectionCheckbox( event: any, item: any ) {
        item.fn( event.checked )
    }

    handleLayer( state: boolean, layer: any ) {

        if (state) {
            layer.addTo(this.map);
        } else {
            this.map.removeLayer(layer);
        }

    }

    public downloadMap(): void {
        // this.map.once('load', () => {
            leafletImage(this.map, (err, canvas) => {
              if (err) {
                console.error(err);
                return;
              }
      
              // Convert the canvas to a data URL
              const imgData = canvas.toDataURL('image/png');
      
              // Create a link element
              const link = document.createElement('a');
              link.href = imgData;
              link.download = 'map.png';
      
              // Trigger the download
              link.click();
            });
        // });;
    };

}
