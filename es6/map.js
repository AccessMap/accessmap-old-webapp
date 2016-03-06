// Leaflet (upon which mapbox.js is based) forces a global window.L
// variable, leading to all kinds of problems for modular development.
// As a result, none of the modules on npm work due to clobbering L.

import $ from 'jquery';
import 'leaflet.locatecontrol';
import '!style!css!leaflet.locatecontrol/dist/L.Control.Locate.min.css';
import L from 'mapbox.js';
import 'mapbox.js/theme/images/icons-ffffff@2x.png';
import '!style!css!mapbox.js/theme/style.css';
import './geojsonbbox.js';
import './geojsonoba.js';
// Permits disabled until data.seattle.gov data source is restored
// import { requestPermitsUpdate } from './layers/permits';

function App(api_url) {
  'use strict';
  let api = api_url.replace(/\/?$/, '/') + 'v2';
  let mapinfo = $.ajax({
      url: api + '/mapinfo',
      dataType: 'json'
  });

  mapinfo.done(function(mapdata) {
    let FEATUREZOOM = 17;
    // Initialize map and tile layers
    L.mapbox.accessToken = mapdata.token;
    let map = L.mapbox.map('map', 'mapbox.streets', {
      zoomControl: false,
      attribution: 'Map data &copy',
      maxZoom: 18
    });
    map.setView([47.652810, -122.308690], FEATUREZOOM);
    let sidewalkTiles = L.mapbox.tileLayer(mapdata.tiles);
    sidewalkTiles.addTo(map);

    // Initialize vector layers (e.g. GeoJSON)
    let crossings = new L.GeoJSONBbox(api + '/crossings.geojson');
    let sidewalks = new L.GeoJSONBbox(api + '/sidewalks.geojson', {
      style: function(feature, layer) {
        if (feature.properties.grade >= 0.0833) {
          return {'color': '#FF0000',
                  'weight': 5,
                  'opacity': 0.6};
        } else if (feature.properties.grade > 0.05) {
          return {'color': '#FFFF00',
                  'weight': 5,
                  'opacity': 0.6};
        } else {
          return {'color': '#00FF00',
                  'weight': 5,
                  'opacity': 0.6};
        }
      },
      onEachFeature: function(feature, layer) {
        let grade = feature.properties.grade;
        let fid = feature.properties.id;
        let content = '<b>Sidewalk ID: ' + fid + '</b><br>' +
                      '<b>Grade:</b> ' + (100 * grade).toFixed(2) + '%';
        layer.bindPopup(content);
      }
    });
    let stops = new L.GeoJSONOBA('http://api.pugetsound.onebusaway.org/api/where/stops-for-location.json', {
      onEachFeature: function(feature, layer) {
        let fid = feature.properties.id;
        let content = '<b>Bus stop ' + feature.properties.id + '</b><br>' +
                      feature.properties.name;
        layer.bindPopup(content);
      },
      pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {
           icon: L.icon({
             iconUrl: '../images/bus.png',
             iconSize: [24, 24],
           })
        });
      }
    });
    map.addLayer(crossings);
    map.addLayer(sidewalks);
    map.addLayer(stops);

    let featureGroups = {
      "Crossings": crossings,
      "Sidewalks": sidewalks,
      "Bus Stops": stops
    };

    map.on('zoomend', function() {
      if (map.getZoom() < FEATUREZOOM) {
        map.removeLayer(crossings);
        map.removeLayer(stops);
        map.removeLayer(sidewalks);
        sidewalkTiles.addTo(map);
      } else {
        crossings.addTo(map);
        stops.addTo(map);
        sidewalks.addTo(map);
        map.removeLayer(sidewalkTiles);
      }
    });

    // Add geocoder
    map.addControl(L.mapbox.geocoderControl('mapbox.places'));
    // Add zoom buttons
    new L.Control.Zoom().addTo(map);

    L.control.layers(null, featureGroups).addTo(map);
  });
}

export default App;
