import $ from 'jquery';
import './geojsonajax.js';


L.GeoJSONBbox = L.GeoJSONAjax.extend({
  getData: function(map) {
    if (this._map) {
      let bounds = map.getBounds();
      // if (this.options.pad) {
      //   bounds = bounds.pad(this.options.pad);
      // }
      let bbox = bounds.toBBoxString();
      let that = this;
      let request = $.ajax({
        url: that.url,
        data: {
          bbox: bbox
        },
        dataType: 'json'
      });
      request.done(function(data) {
        that.clearLayers();
        that.addData(data);
      });
    }
  }
});

export default L.GeoJSONBbox;
