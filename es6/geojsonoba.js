import $ from 'jquery';
import './geojsonajax.js';


L.GeoJSONOBA = L.GeoJSONAjax.extend({
  getData: function(map) {
    if (this._map) {
      let that = this;
      let bounds = map.getBounds();
      let center = bounds.getCenter();
      let request = $.ajax({
        url: that.url,
        data: {
          key: '8e4402d8-6f8d-49fe-8e7c-d3d38098b4ef',
          lat: center.lat,
          lon: center.lng,
          latSpan: Math.abs(bounds.getNorth() - bounds.getSouth()),
          lonSpan: Math.abs(bounds.getEast() - bounds.getWest()),
          maxCount: 300
        },
        dataType: 'jsonp'
      });
      request.done(function(data) {
        let featureCollection = {
          type: 'FeatureCollection',
          features: []
        };

        data.data.list.forEach(function(result) {
          let feature = {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [result.lon, result.lat]
            },
            'properties': {
              'name': result.name,
              'direction': result.direction,
              'id': result.id,
              'routeIds': result.routeIds
            }
          };
          featureCollection.features.push(feature);
        });
        that.clearLayers();
        that.addData(featureCollection);
      });
    }
  }
});

export default L.GeoJSONOBA;
