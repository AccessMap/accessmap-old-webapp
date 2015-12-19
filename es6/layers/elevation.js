export function requestElevationsUpdate(layerGroup, map, api_url) {
  // Gradations
  var high = 0.0833;
  var mid = 0.05;

  function drawElevations(data) {
    layerGroup.clearLayers();
    let bounds = map.getBounds();

    function setStyle(f) {
      if (f.properties.grade >= high) {
        return {'color': '#FF0000',
                'weight': 5,
                'opacity': 0.6};
      } else if (f.properties.grade > mid) {
        steepness = "Moderate</b><br>(between " + (mid * 100).toFixed(2) + "% and " + (high * 100).toFixed(2) + "% grade)";
        return {'color': '#FFFF00',
                'weight': 5,
                'opacity': 0.6};
      } else {
        steepness = "Negligible</b><br>(less than " + (mid * 100).toFixed(2) + "% grade)";
        return {'color': '#00FF00',
                'weight': 5,
                'opacity': 0.6};
      }
    }

    for (let i = 0; i < data.features.length; i++) {
      var feature = data.features[i];
      var coords = feature.geometry.coordinates;
      var coord1 = [coords[0][1], coords[0][0]];
      var coord2 = [coords[1][1], coords[1][0]];
      var steepness = "Significant</b><br>(greater than " + (high * 100).toFixed(2) + "% grade)";
      if (bounds.contains(coord1) || bounds.contains(coord2)) {
        let line = L.geoJson(feature, {
          'style': setStyle
        });

        //Display info when user clicks on the line
        var popup = L.popup().setContent("<b>Elevation Change is " + steepness);
        line.bindPopup(popup);

        layerGroup.addLayer(line);
      }
    }
  }

let bounds = map.getBounds().toBBoxString();
// Request data
$.ajax({
  type: 'GET',
  url: api_url + '/raw-sidewalks.geojson',
  data: {
    bbox: bounds
  },
  dataType: 'json',
  success: function(data) {
    drawElevations(data);
    layerGroup.bringToBack();
  }
});
}
