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
/***/ function(module, exports, __webpack_require__) {

	// Leaflet (upon which mapbox.js is based) forces a global window.L
	// variable, leading to all kinds of problems for modular development.
	// As a result, none of the modules on npm work due to clobbering L.

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _layersSidewalks = __webpack_require__(1);

	var _layersBusdata = __webpack_require__(2);

	var _layersCurbs = __webpack_require__(3);

	var _layersPermits = __webpack_require__(4);

	function App(tile_url, mapbox_token, api_url) {
	  'use strict';

	  var rawdataUrl = api_url.replace(/\/?$/, '/');
	  var routingUrl = api_url.replace(/\/?$/, '/');

	  var FEATUREZOOM = 17;
	  L.mapbox.accessToken = mapbox_token;
	  var map = L.map('map', {
	    zoomControl: false,
	    maxZoom: 18
	  });

	  var tiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
	  }).addTo(map);

	  // var tiles = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
	  //   attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	  // }).addTo(map);

	  var elevationTiles = L.mapbox.tileLayer(tile_url);
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
	    "Sidewalk Closure Permits": permits
	  };

	  // Read in data to increase speed later on (generate a promise)

	  var updateLayers = function updateLayers() {
	    //    requestStopsUpdate(stops, map);
	    (0, _layersSidewalks.requestSidewalksUpdate)(elevationlayer, map, rawdataUrl);
	    //    requestCurbsUpdate(curbs, map, rawdataUrl);
	    //    requestPermitsUpdate(permits, map, rawdataUrl);
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

	  map.on('contextmenu', function (e) {
	    var popup = confirm("Do you want to report a new obstacle?");
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
	  var routingEndpoint = routingUrl + '/v2/route.json';
	  L.Routing.control({
	    waypoints: [L.latLng([47.606138, -122.335956]), L.latLng([47.603599, -122.330580])],
	    router: new L.Routing.AccessMap({ 'serviceUrl': routingEndpoint }),
	    routeWhileDragging: true,
	    lineOptions: {
	      styles: [{ color: 'black', opacity: 0.15, weight: 9 }, { color: 'white', opacity: 0.8, weight: 6 }, { color: 'blue', opacity: 1, weight: 2 }]
	    }
	  }).addTo(map);

	  L.control.layers(null, overlayMaps).addTo(map);
	}
	exports['default'] = App;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.requestSidewalksUpdate = requestSidewalksUpdate;

	function requestSidewalksUpdate(layerGroup, map, api_url) {
	  // Gradations
	  var high = 0.0833;
	  var mid = 0.05;

	  function drawElevations(data) {
	    layerGroup.clearLayers();
	    var bounds = map.getBounds();

	    function setStyle(f) {
	      if (f.properties.grade >= high) {
	        return { 'color': '#FF0000',
	          'weight': 5,
	          'opacity': 0.6 };
	      } else if (f.properties.grade > mid) {
	        steepness = "Moderate</b><br>(between " + (mid * 100).toFixed(2) + "% and " + (high * 100).toFixed(2) + "% grade)";
	        return { 'color': '#FFFF00',
	          'weight': 5,
	          'opacity': 0.6 };
	      } else {
	        steepness = "Negligible</b><br>(less than " + (mid * 100).toFixed(2) + "% grade)";
	        return { 'color': '#00FF00',
	          'weight': 5,
	          'opacity': 0.6 };
	      }
	    }

	    for (var i = 0; i < data.features.length; i++) {
	      var feature = data.features[i];
	      var coords = feature.geometry.coordinates;
	      var coord1 = [coords[0][1], coords[0][0]];
	      var coord2 = [coords[1][1], coords[1][0]];
	      var steepness = "Significant</b><br>(greater than " + (high * 100).toFixed(2) + "% grade)";
	      if (bounds.contains(coord1) || bounds.contains(coord2)) {
	        var line = L.geoJson(feature, {
	          'style': setStyle
	        });

	        //Display info when user clicks on the line
	        var popup = L.popup().setContent("<b>Elevation Change is " + steepness);
	        line.bindPopup(popup);

	        layerGroup.addLayer(line);
	      }
	    }
	  }

	  var bounds = map.getBounds().toBBoxString();
	  // Request data
	  $.ajax({
	    type: 'GET',
	    url: api_url + '/v2/sidewalks.geojson',
	    data: {
	      bbox: bounds
	    },
	    dataType: 'json',
	    success: function success(data) {
	      drawElevations(data);
	      layerGroup.bringToBack();
	    }
	  });
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	// TODO: Use OO addTo method
	// Request stops in an area
	// Process the request data
	// Add the markers to the map
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.requestStopsUpdate = requestStopsUpdate;

	function requestStopsUpdate(layerGroup, map) {
	  // Generates a layerGroup to add to / remove from map
	  var OBA_URL = 'http://api.pugetsound.onebusaway.org/api/where/stops-for-location.json';
	  var RADIUS = 800;
	  var latlng = map.getCenter();
	  var centerLat = latlng.lat;
	  var centerLon = latlng.lng;

	  var bounds = map.getBounds();
	  var latlonspan = [Math.abs(bounds.getNorth() - bounds.getSouth()), Math.abs(bounds.getWest() - bounds.getEast())];

	  var busIcon = L.icon({
	    iconUrl: '../images/bus.png',
	    iconSize: [30, 30],
	    iconAnchor: [10, 0]
	  });

	  function requestStops(callback) {
	    $.ajax({
	      url: OBA_URL,
	      dataType: 'jsonp',
	      data: {
	        key: '8e4402d8-6f8d-49fe-8e7c-d3d38098b4ef',
	        lat: centerLat,
	        lon: centerLon,
	        latSpan: latlonspan[0],
	        lonSpan: latlonspan[1],
	        maxCount: 300
	      },
	      success: callback
	    });
	  }

	  function addMarkers(request_data) {
	    var data = request_data.data.list;
	    // Destroy the layers in stopLayerGroup
	    layerGroup.clearLayers();
	    // Create the new ones
	    for (var i = 0; i < data.length; i++) {
	      var row = data[i];
	      // Turn it into geoJSON
	      var geoJSON = {
	        'type': 'Feature',
	        'geometry': {
	          'type': 'Point',
	          'coordinates': [row.lon, row.lat]
	        },
	        'properties': {
	          'name': row.name,
	          'direction': row.direction,
	          'id': row.id,
	          'routeIds': row.routeIds
	        }
	      };
	      var marker = L.geoJson(geoJSON, {
	        pointToLayer: function pointToLayer(feature, latlng) {
	          return L.marker(latlng, { icon: busIcon });
	        }
	      });

	      //Display info when user clicks on the bus stop
	      var popup = L.popup().setContent("<b>Bus Stop at " + row.name + "</b>");
	      marker.bindPopup(popup);

	      layerGroup.addLayer(marker);
	    }
	  }

	  requestStops(addMarkers);
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.requestCurbsUpdate = requestCurbsUpdate;

	function requestCurbsUpdate(layerGroup, map, api_url) {
	  function drawCurbs(data) {
	    layerGroup.clearLayers();
	    var bounds = map.getBounds();

	    function make_circle(feature, latlon) {
	      var coords = feature.geometry.coordinates;
	      return L.circleMarker(latlon, {
	        'radius': 3,
	        'color': '#0000FF'
	      });
	    }

	    for (var i = 0; i < data.features.length; i++) {
	      var feature = data.features[i];
	      var coord = feature.geometry.coordinates;
	      var latlng = [coord[1], coord[0]];
	      if (bounds.contains(latlng)) {
	        var point = L.geoJson(feature, { pointToLayer: make_circle });

	        //Display info when user clicks on the curb marker
	        var popup = L.popup().setContent("<b>Curb Ramp</b>");
	        point.bindPopup(popup);

	        layerGroup.addLayer(point);
	      }
	    }
	  }

	  var bounds = map.getBounds().toBBoxString();
	  // Request data
	  $.ajax({
	    type: 'GET',
	    url: api_url + '/raw-curbs.geojson',
	    data: {
	      bbox: bounds
	    },
	    dataType: 'json',
	    success: function success(data) {
	      drawCurbs(data);
	    }
	  });
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.requestPermitsUpdate = requestPermitsUpdate;

	function requestPermitsUpdate(layerGroup, map, api_url) {
	  var constructionIcon = L.icon({
	    iconUrl: '../images/construction.png',
	    iconSize: [30, 30],
	    iconAnchor: [10, 0]
	  });

	  function drawConstruction(data) {
	    // TODO: turn this into map tiles for several zoom levels to speed
	    // things up (slowness is due to drawing so many lines)
	    layerGroup.clearLayers();
	    var bounds = map.getBounds();

	    function setIcon(feature, latlng) {
	      return L.marker(latlng, { icon: constructionIcon });
	    }

	    for (var i = 0; i < data.features.length; i++) {
	      var feature = data.features[i];
	      var coord = feature.geometry.coordinates;
	      var latlng = [coord[1], coord[0]];
	      if (bounds.contains(latlng)) {
	        var permitFeature = L.geoJson(feature, {
	          pointToLayer: setIcon
	        });

	        //Display info when user clicks
	        var props = feature.properties;
	        var popup = L.popup().setContent("<b>Construction Permit</b><br>" + "Permit no. " + props.permit_no + "<br>" + "Mobility impact: " + props.mobility_impact_text);
	        permitFeature.bindPopup(popup);

	        layerGroup.addLayer(permitFeature);
	      }
	    }
	  }

	  var bounds = map.getBounds().toBBoxString();
	  // Request data
	  $.ajax({
	    type: 'GET',
	    url: api_url + '/raw-permits.geojson',
	    data: {
	      bbox: bounds
	    },
	    dataType: 'json',
	    success: function success(data) {
	      drawConstruction(data);
	    }
	  });
	}

/***/ }
/******/ ])
});
;