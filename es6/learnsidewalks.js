import $ from 'jquery';
import path from 'path';


function App(learn_url, api_url, user) {
  'use strict';
  let api = api_url.replace(/\/?$/, '/') + 'v1';
  let mapinfo = $.ajax({
      url: api + '/mapinfo',
      dataType: 'json'
  });

  mapinfo.done(function(mapdata) {
    L.mapbox.accessToken = mapdata.token;
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

    // Add score control
    let scoreControl = L.Control.extend({
      initialize: function(foo, options) {
        L.Util.setOptions(this, options);
      },
      options: {
        position: 'bottomleft'
      },
      onAdd: function(map) {
        this._container = L.DomUtil.create('div', 'leaflet-score-control leaflet-bar');
        this._container.innerHTML = 'Added: ';
        return this._container;
      },
      updateScore: function(score) {
        this._container.innerHTML = 'Added: ' + score;
      }
    });

    let sControl = new scoreControl();

    let currentDat;
    // this gets the data
    $.ajax({
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      url: '/getdata',
    })
    .done(function(data){
      // Parse FeatureCollection and username
      let fc = JSON.parse(data);
      let score = fc.features[2].properties.score;
      if (score === undefined) {
        let score = 'NA';
      }

      // adds to the map the first feature
      function makePopup(feature, layer) {
        if (feature.properties && (feature.properties.type === 'sw')) {
          let desc = '<p>' + feature.properties.desc + '</p>';
          let side = '<p>Side: ' + feature.properties.side + '</p';
          layer.bindPopup(desc + side);
        }
      }
      L.geoJson(fc.features[2], {
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

      L.geoJson(fc.features[2], {
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

      L.geoJson(fc.features[0], {
        opacity: 1,
        color: '#cdf',
        weight: 8,
        onEachFeature: makePopup
      }).addTo(map);
      L.geoJson(fc.features[0], {
        opacity: 0.9,
        weight: 4,
        onEachFeature: makePopup
      }).addTo(map);

      L.geoJson(fc.features[1], {
        opacity: 1,
        color: '#cdf',
        weight: 8,
        onEachFeature: makePopup
      }).addTo(map);
      L.geoJson(fc.features[1], {
        opacity: 0.9,
        weight: 4,
        onEachFeature: makePopup
      }).addTo(map);

      let LongLat = fc.features[1].geometry.coordinates[1];
      map.setView([LongLat[1],LongLat[0]], 18);
      currentDat = fc;

      // Update score control
      sControl.addTo(map);
      sControl.updateScore(score);
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
  });
}

export default App;
