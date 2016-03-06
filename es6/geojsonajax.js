// This class should not be used directly - it is missing the getData
// function.
L.GeoJSONAjax = L.GeoJSON.extend({
  initialize: function(url, options){
    this.url = url;
    L.GeoJSON.prototype.initialize.call(this, null, options);
  },
  onAdd: function(map) {
    this._map = map;
    L.GeoJSON.prototype.onAdd.call(this, map);
    this.getData(this._map);
    let that = this;
    map.on('moveend', function(e) {
      that.getData(that._map);
    });
  }
});

export default L.GeoJSONAjax;
