import $ from 'jquery';


function App(learn_url, mapbox_token, user) {
  L.mapbox.accessToken = mapbox_token;
  let map = L.map('map');

  let layers = {
    streets: L.mapbox.tileLayer('mapbox.streets'),
    satellite: L.mapbox.tileLayer('mapbox.streets-satellite'),
  };

  layers.streets.addTo(map);
  let layersControl = L.control.layers(layers, null, {
    collapsed: false
  });
  layersControl.addTo(map);

  let currentDat;
  // this gets the data
  $.get(learn_url + '/getdata', function(data){
    // adds to the map the first feature
    function makePopup(feature, layer){
      if (feature.properties && (feature.properties.type === 'sw')) {
        let desc = '<p>' + feature.properties.desc + '</p>';
        let side = '<p>Side: ' + feature.properties.side + '</p';
        layer.bindPopup(desc + side);
      }
    }
    L.geoJson(data.features[2], {
      onEachFeature: function(feature, layer ) {
        L.polylineDecorator(layer, {
          patterns: [
            {offset: 0,
             repeat: 8,
             symbol: L.Symbol.dash({
              pixelSize: 1, pathOptions: {
                weight: 6,
                opacity: 1,
                color: '#0c0'
              }
             })}
          ]
        }).addTo(map);
      }
    });

    L.geoJson(data.features[2], {
      onEachFeature: function(feature, layer ) {
        L.polylineDecorator(layer, {
          patterns: [
            {offset: 0,
             repeat: 8,
             symbol: L.Symbol.dash({
              pixelSize: 1, pathOptions: {
                weight: 5,
                opacity: 1,
                color: '#0f0'
              }
             })}
          ]
        }).addTo(map);
      }
    });

    L.geoJson(data.features[0], {
      opacity: 1,
      color: '#cdf',
      weight: 8,
      onEachFeature: makePopup
    }).addTo(map);
    L.geoJson(data.features[0], {
      opacity: 0.9,
      weight: 4,
      onEachFeature: makePopup
    }).addTo(map);

    L.geoJson(data.features[1], {
      opacity: 1,
      color: '#cdf',
      weight: 8,
      onEachFeature: makePopup
    }).addTo(map);
    L.geoJson(data.features[1], {
      opacity: 0.9,
      weight: 4,
      onEachFeature: makePopup
    }).addTo(map);

    let LongLat = data.features[1].geometry.coordinates[1];
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
      .done(() => location.reload())
      .fail(e => console.log('Error: ' + e));
  }

  $('#conn').click(() => submitResult(learn_url, currentDat, 1));

  $('#Noconn').click(() => submitResult(learn_url, currentDat, 0));
}

export default App;
