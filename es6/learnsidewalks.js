import $ from 'jquery';

function App(learn_url, mapbox_token, user) {
  L.mapbox.accessToken = mapbox_token;
  var map = L.map('map');

  var layers = {
    streets: L.mapbox.tileLayer('mapbox.streets'),
    satellite: L.mapbox.tileLayer('mapbox.streets-satellite'),
  };

  layers.streets.addTo(map);
  var layersControl = L.control.layers(layers, null, {
    collapsed: false
  });
  layersControl.addTo(map);

  var polyline_options2 = {
    fillColor: '#FFF',
    color: '#0D0'
  };

  var currentDat;
  // this gets the data
  $.get(learn_url + '/getdata', function(data){
    // adds to the map the first feature
    function makePopup(feature, layer){
      if (feature.properties && (feature.properties.type === 'sw')) {
        var desc = '<p>' + feature.properties.desc + '</p>';
        var side = '<p>Side: ' + feature.properties.side + '</p';
        layer.bindPopup(desc + side);
      }
    }

    L.geoJson(data.features[0], {
      onEachFeature: makePopup
    }).addTo(map);
    L.geoJson(data.features[1], {
      onEachFeature: makePopup
    }).addTo(map);
    L.geoJson(data.features[2],polyline_options2).addTo(map);

    var LongLat = data.features[1].geometry.coordinates[1];
    map.setView([LongLat[1],LongLat[0]], 18);
    currentDat = data;
  });

  function submitResult(learn_url, geojson, classification) {
    $.ajax({
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      url: learn_url + '/submit',
      data: JSON.stringify({
        user: user,
        geojson: geojson,
        classification: classification
      })
    })
      .done(function() {
        location.reload();
      })
      .fail(function(e) {
        console.log('Error: ' + e);
      });
  }

  $('#conn').click(function() {
    submitResult(learn_url, currentDat, 1);
  });

  $('#Noconn').click(function() {
    submitResult(learn_url, currentDat, 0);
  });
}

export default App;
