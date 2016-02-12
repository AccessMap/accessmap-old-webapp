// Leaflet (upon which mapbox.js is based) forces a global window.L
// variable, leading to all kinds of problems for modular development.
// As a result, none of the modules on npm work due to clobbering L.

import { requestSidewalksUpdate } from './layers/sidewalks';
import { requestStopsUpdate } from './layers/busdata';
import { requestCurbsUpdate } from './layers/curbs';
import { requestPermitsUpdate } from './layers/permits';


function App(tile_url, mapbox_token, api_url) {
  'use strict';

  let rawdataUrl = api_url.replace(/\/?$/, '/');
  let routingUrl = api_url.replace(/\/?$/, '/');

  let FEATUREZOOM = 17;
  L.mapbox.accessToken = mapbox_token;
  let map = L.map('map', {
    zoomControl: false,
    maxZoom: 18
  });

  var tiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
   }).addTo(map);

  let elevationTiles = L.mapbox.tileLayer(tile_url);
  elevationTiles.addTo(map);

  let stops = L.featureGroup({minZoom: 8});
  let elevationlayer = L.featureGroup({minZoom: 8});
  let curbs = L.featureGroup({minZoom: 8});
  let userData = L.featureGroup({minZoom: 8});
  let elevators = L.featureGroup({minZoom: 8});
  let permits = L.featureGroup({minZoom: 8});

  //Create filter checkboxes for the overlays
  let overlayMaps = {
    "Bus Stops": stops,
    "Curb Ramps": curbs,
    "User Reported Data":userData,
    "Elevators":elevators,
    "Elevation Change": elevationlayer,
    "Sidewalk Closure Permits": permits
  };

  // Read in data to increase speed later on (generate a promise)

  let updateLayers = function() {
//    requestStopsUpdate(stops, map);
    requestSidewalksUpdate(elevationlayer, map, rawdataUrl);
//    requestCurbsUpdate(curbs, map, rawdataUrl);
//    requestPermitsUpdate(permits, map, rawdataUrl);
  };

  map.on('load', function(e) {
    updateLayers();
    map.setView([47.609700, -122.324638], FEATUREZOOM);
  });

  map.on('moveend', function(e) {
    if (map.getZoom() >= FEATUREZOOM) {
      updateLayers();
    }
  });

  map.on('zoomend', function() {
    if (map.getZoom() < FEATUREZOOM) {
//      map.removeLayer(stops);
      map.removeLayer(elevationlayer);
//      map.removeLayer(curbs);
//      map.removeLayer(permits);
      elevationTiles.addTo(map);
    } else {
//      stops.addTo(map);
      elevationlayer.addTo(map);
//      curbs.addTo(map);
//      permits.addTo(map);
      map.removeLayer(elevationTiles);
    }
  });

  map.on('contextmenu', function(e) {
    let popup = confirm("Do you want to report a new obstacle?");
    if (popup === true) {
        window.location.href = 'report?lat=' + e.latlng.lat + '&lon=' + e.latlng.lng;
    }
  });

  map.setView([47.652810, -122.308690], FEATUREZOOM);

  // Add geocoder
  map.addControl(L.mapbox.geocoderControl('mapbox.places'));
  // Add zoom buttons
  new L.Control.Zoom().addTo(map);

  // Routing (via leaflet-routing-machine and lrm-accessmap)
  let routingEndpoint = routingUrl + '/v2/route.json';
  L.Routing.control({
    waypoints: [
      L.latLng([47.606138, -122.335956]),
      L.latLng([47.603599, -122.330580])
    ],
    router: new L.Routing.AccessMap({'serviceUrl': routingEndpoint}),
    routeWhileDragging: true,
    lineOptions: {
      styles: [{color: 'black', opacity: 0.15, weight: 9},
               {color: 'white', opacity: 0.8, weight: 6},
               {color: 'blue', opacity: 1, weight: 2}]
    }
  }).addTo(map);

  L.control.layers(null, overlayMaps).addTo(map);
}
export default App;
