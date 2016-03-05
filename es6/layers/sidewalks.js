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
        return {'color': '#FFFF00',
                'weight': 5,
                'opacity': 0.6};
      } else {
        return {'color': '#00FF00',
                'weight': 5,
                'opacity': 0.6};
      }
    }

    for (let i = 0; i < data.features.length; i++) {
      let feature = data.features[i];
      let line = L.geoJson(feature, {
        'style': setStyle
      });

      //Display info when user clicks on the line
      let grade = feature.properties.grade;
      let fid = feature.properties.id;
      let content = '<b>Sidewalk ID: ' + fid + '</b><br>' + '<b>Grade:</b> ' + (100 * grade).toFixed(2) + '%'
      let popup = L.popup().setContent(content);
      line.bindPopup(popup);

      layerGroup.addLayer(line);
    }
  }

let bounds = map.getBounds().toBBoxString();
// Request data
$.ajax({
  type: 'GET',
  url: api_url + '/sidewalks.geojson',
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
