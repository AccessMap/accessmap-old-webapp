function App(learn_url, mapbox_token, email) {
  L.mapbox.accessToken = mapbox_token;
  var map = L.map('map');
  map.setView([47.5719,-122.2186], 18);

  var tiles = L.mapbox.tileLayer('mapbox.streets', {
    maxZoom: 19
  });
  tiles.addTo(map);

  var polyline_options2 = {
    color: '#0D0'
  };

  var currentDat;
  // this gets the data
  jQuery.get(learn_url + '/getdata', function(data){
    // adds to the map the first feature
    L.geoJson(data.features[0]).addTo(map);
    L.geoJson(data.features[1]).addTo(map);
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
        email: email,
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
