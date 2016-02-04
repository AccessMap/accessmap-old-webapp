import $ from 'jquery';


function requestSidewalksUpdate(layerGroup, map, api_url) {
  // Gradations
  let high = 0.0833;
  let mid = 0.05;

  function drawElevations(data) {
    layerGroup.clearLayers();
    let bounds = map.getBounds();

    function setStyle(f) {
      if (f.properties.grade >= high) {
        return {'color': '#FF0000',
                'weight': 5,
                'opacity': 0.6};
      } else if (f.properties.grade > mid) {
        let steepness = "Moderate</b><br>(between " + (mid * 100).toFixed(2) + "% and " + (high * 100).toFixed(2) + "% grade)";
        return {'color': '#FFFF00',
                'weight': 5,
                'opacity': 0.6};
      } else {
        let steepness = "Negligible</b><br>(less than " + (mid * 100).toFixed(2) + "% grade)";
        return {'color': '#00FF00',
                'weight': 5,
                'opacity': 0.6};
      }
    }

    for (let i = 0; i < data.features.length; i++) {
      let feature = data.features[i];
      let coords = feature.geometry.coordinates;
      let coord1 = [coords[0][1], coords[0][0]];
      let coord2 = [coords[1][1], coords[1][0]];
      let steepness = "Significant</b><br>(greater than " + (high * 100).toFixed(2) + "% grade)";
      if (bounds.contains(coord1) || bounds.contains(coord2)) {
        let line = L.geoJson(feature, {
          'style': setStyle
        });

        //Display info when user clicks on the line
        let popup = L.popup().setContent("<b>Elevation Change is " + steepness);
        line.bindPopup(popup);

        layerGroup.addLayer(line);
      }
    }
  }

let bounds = map.getBounds().toBBoxString();
// Request data
$.ajax({
  type: 'GET',
  url: api_url + '/v1/sidewalks.geojson',
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

export default requestSidewalksUpdate;
