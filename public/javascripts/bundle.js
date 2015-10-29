(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["App"] = factory();
	else
		root["App"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	function App(tile_url, mapbox_token, geojson_api) {
	  'use strict';
	  var FEATUREZOOM = 17;
	  var map = L.map('map', { zoomControl: false });

	  var mapbox = L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}@2x.png?access_token=' + mapbox_token, {
	    attribution: 'Map data &copy;',
	    maxZoom: 18
	  });
	  mapbox.addTo(map);

	  var elevationTiles = L.mapbox.tileLayer(tile_url, {
	    accessToken: mapbox_token
	  });
	  elevationTiles.addTo(map);

	  var stops = L.featureGroup({ minZoom: 8 });
	  var elevationlayer = L.featureGroup({ minZoom: 8 });
	  var curbs = L.featureGroup({ minZoom: 8 });
	  var userData = L.featureGroup({ minZoom: 8 });
	  var elevators = L.featureGroup({ minZoom: 8 });
	  var permits = L.featureGroup({ minZoom: 8 });

	  //Create filter checkboxes for the overlays
	  var overlayMaps = {
	    "Bus Stops": stops,
	    "Curb Ramps": curbs,
	    "User Reported Data": userData,
	    "Elevators": elevators,
	    "Elevation Change": elevationlayer,
	    "Sidewalk Closure Permits": permits,
	    "User Reported Data": userData
	  };

	  // Read in data to increase speed later on (generate a promise)

	  var updateLayers = function updateLayers() {
	    requestStopsUpdate(stops, map);
	    requestElevationsUpdate(elevationlayer, map, geojson_api);
	    requestCurbsUpdate(curbs, map, geojson_api);
	    requestConstructionPermitUpdate(permits, map, geojson_api);
	    //requestUserDataUpdate(userData, map);
	    //requestElevatorUpdate(elevators, map);
	  };

	  map.on('load', function (e) {
	    updateLayers();
	    map.setView([47.609700, -122.324638], FEATUREZOOM);
	  });

	  map.on('moveend', function (e) {
	    if (map.getZoom() >= FEATUREZOOM) {
	      updateLayers();
	    }
	  });

	  map.on('zoomend', function () {
	    if (map.getZoom() < FEATUREZOOM) {
	      map.removeLayer(stops);
	      map.removeLayer(elevationlayer);
	      map.removeLayer(curbs);
	      map.removeLayer(permits);
	      //map.removeLayer(userData);
	      //map.removeLayer(elevators);
	      elevationTiles.addTo(map);
	    } else {
	      stops.addTo(map);
	      elevationlayer.addTo(map);
	      curbs.addTo(map);
	      permits.addTo(map);
	      //userData.addTo(map);
	      //elevators.addTo(map);
	      map.removeLayer(elevationTiles);
	    }
	  });

	  map.on('contextmenu', function (e) {
	    var popup = confirm("Do you want to report a new obstacle?");
	    if (popup == true) {
	      window.location.href = 'report?lat=' + e.latlng.lat + '&lon=' + e.latlng.lng;
	    }
	  });

	  map.setView([47.652810, -122.308690], FEATUREZOOM);

	  // Add geocoder
	  var geocoder = new google.maps.Geocoder();
	  function filterJSONCall(rawJson) {
	    var json = {},
	        key = [],
	        loc = [],
	        disp = [];

	    for (var item in rawJson) {
	      key = rawJson[item].formatted_address;
	      loc = L.latLng(rawJson[item].geometry.location.lat(), rawJson[item].geometry.location.lng());
	      json[key] = loc;
	    }

	    return json;
	  }
	  var searchControl = new L.Control.Search({
	    callData: function callData(text, callResponse) {
	      geocoder.geocode({ address: text,
	        componentRestrictions: {
	          country: 'US',
	          locality: 'Seattle'
	        }
	      }, callResponse);
	    },
	    filterJSON: filterJSONCall,
	    markerLocation: true,
	    autoType: false,
	    autoCollapse: true,
	    minLength: 2
	  });
	  // Add controls to map
	  map.addControl(searchControl);
	  new L.Control.Zoom().addTo(map);
	  L.control.locate().addTo(map);
	  L.control.layers(null, overlayMaps).addTo(map);
	}
	exports['default'] = App;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;