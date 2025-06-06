import * as L from 'leaflet';

declare module 'leaflet' {
  namespace L {
    function heatLayer(latlngs: LatLngExpression[], options?: HeatLayerOptions): HeatLayer;
    
    interface HeatLayerOptions extends LayerOptions {
      radius?: number;
      blur?: number;
      maxZoom?: number;
      minOpacity?: number;
    }

    class HeatLayer extends Layer {}
  }
}
