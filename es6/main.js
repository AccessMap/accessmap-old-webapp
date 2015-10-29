import { requestElevationsUpdate } from './layers/elevation';
import { requestStopsUpdate } from './layers/busdata';
import { requestCurbsUpdate } from './layers/curbdata';
import { requestConstructionPermitUpdate } from './layers/construction-permits';
function App(tile_url, mapbox_token, geojson_api) {
  'use strict';

  let FEATUREZOOM = 17;
  let map = L.map('map', {zoomControl: false});

  let mapbox = L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}@2x.png?access_token=' + mapbox_token, {
    attribution: 'Map data &copy;',
    maxZoom: 18
  });
  mapbox.addTo(map);

  let elevationTiles = L.mapbox.tileLayer(tile_url, {
    accessToken: mapbox_token
  });
  elevationTiles.addTo(map);

  var stops = L.featureGroup({minZoom: 8});
  var elevationlayer = L.featureGroup({minZoom: 8});
  var curbs = L.featureGroup({minZoom: 8});
  var userData = L.featureGroup({minZoom: 8});
  var elevators = L.featureGroup({minZoom: 8});
  var permits = L.featureGroup({minZoom: 8});

  //Create filter checkboxes for the overlays
  var overlayMaps = {
    "Bus Stops": stops,
    "Curb Ramps": curbs,
    "User Reported Data":userData,
    "Elevators":elevators,
    "Elevation Change": elevationlayer,
    "Sidewalk Closure Permits": permits
  };

  // Read in data to increase speed later on (generate a promise)

  let updateLayers = function() {
    requestStopsUpdate(stops, map);
    requestElevationsUpdate(elevationlayer, map, geojson_api);
    requestCurbsUpdate(curbs, map, geojson_api);
    requestConstructionPermitUpdate(permits, map, geojson_api);
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
      map.removeLayer(stops);
      map.removeLayer(elevationlayer);
      map.removeLayer(curbs);
      map.removeLayer(permits);
      elevationTiles.addTo(map);
    } else {
      stops.addTo(map);
      elevationlayer.addTo(map);
      curbs.addTo(map);
      permits.addTo(map);
      map.removeLayer(elevationTiles);
    }
  });

  map.on('contextmenu', function(e) {
    var popup = confirm("Do you want to report a new obstacle?");
    if (popup === true) {
        window.location.href = 'report?lat=' + e.latlng.lat + '&lon=' + e.latlng.lng;
    }
  });

  map.setView([47.652810, -122.308690], FEATUREZOOM);

  // Add geocoder
  var geocoder = new google.maps.Geocoder();
  function filterJSONCall(rawJson) {
    var json = {},
        key  = [],
        loc  = [],
        disp = [];

    for (var item in rawJson) {
      key = rawJson[item].formatted_address;
      loc = L.latLng(rawJson[item].geometry.location.lat(), rawJson[item].geometry.location.lng());
      json[key] = loc;
    }

    return json;
  }
  let searchControl = new L.Control.Search({
                    callData: function(text, callResponse) {
                      geocoder.geocode({address: text,
                                        componentRestrictions: {
                                          country: 'US',
                                          locality: 'Seattle'
                                        }
                                       },
                                       callResponse);
                    },
                    filterJSON: filterJSONCall,
                    markerLocation: true,
                    autoType: false,
                    autoCollapse: true,
                    minLength: 2,
                  });
  // Add controls to map
  map.addControl(searchControl);
  new L.Control.Zoom().addTo(map);
  L.control.locate().addTo(map);
  L.control.layers(null, overlayMaps).addTo(map);
}
export default App;
