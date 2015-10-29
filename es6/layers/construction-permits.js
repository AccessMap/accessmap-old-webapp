export function requestConstructionPermitUpdate(layerGroup, map, api_url) {
  var constructionIcon = L.icon({
      iconUrl: '../images/construction.png',
      iconSize: [30, 30],
      iconAnchor: [10, 0]
  });

  function drawConstruction(data) {
    // TODO: turn this into map tiles for several zoom levels to speed
    // things up (slowness is due to drawing so many lines)
    layerGroup.clearLayers();
    var bounds = map.getBounds();

    function setIcon(feature, latlng) {
      return L.marker(latlng, {icon: constructionIcon});
    }

    for (let i = 0; i < data.features.length; i++) {
      var feature = data.features[i];
      var coord = feature.geometry.coordinates;
      var latlng = [coord[1], coord[0]];
      if (bounds.contains(latlng)) {
        let permitFeature = L.geoJson(feature, {
          pointToLayer: setIcon
        });

        //Display info when user clicks
        var props = feature.properties;
        var popup = L.popup().setContent("<b>Construction Permit</b><br>" +
                                          "Permit no. " + props.permit_no + "<br>" +
                                          "Mobility impact: " + props.mobility_impact_text);
        permitFeature.bindPopup(popup);

        layerGroup.addLayer(permitFeature);
      }
    }
  }

let bounds = map.getBounds().toBBoxString();
// Request data
$.ajax({
  type: 'GET',
  url: api_url + '/permits.geojson',
  data: {
    bbox: bounds
  },
  dataType: 'json',
  success: function(data) {
    drawConstruction(data);
  }
});
}
