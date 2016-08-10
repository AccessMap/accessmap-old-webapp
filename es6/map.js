// Leaflet (upon which mapbox.js is based) forces a global window.L
// variable, leading to all kinds of problems for modular development.
// As a result, none of the modules on npm work due to clobbering L.

import mapboxgl from 'mapbox-gl';
import '!style!css!mapbox-gl/dist/mapbox-gl.css';
import Geocoder from 'mapbox-gl-geocoder';
import '!style!css!mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import * as chroma from 'chroma-js';
import $ from 'jquery';
import debounce from 'debounce';


function App(mapbox_token) {
  // AccessMap uses a versioned API - which one are we using?
  const api = '/api/v2';

  // GeoJSON vs. vector tile background zoom level switch
  // const zoomChange = 15;
  const zoomChange = 14;

  // -- Styling --
  // Sidewalk color scale
  //
  let colorScale = chroma.scale(['lime', 'yellow', 'red']);

  // Line widths
  const lineWidth = 2;
  const shadowScale = 1.3;

  // Outline/shadow opacity
  const outlineOpacity = 0.8;

  // Map initialization
  mapboxgl.accessToken = mapbox_token;

  let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v8',
    center: [-122.334859, 47.607568],
    zoom: 15
  });

  map.on('load', function() {
    let bounds = map.getBounds().toArray();
    let bbox = bounds[0].concat(bounds[1]).join(',');

    // Sidewalks
    // TODO: when data-driven styling works for lines, reduce to one sidewalk
    // layer

    // This is a hack to ensure that tile requests are made to the main site's
    // /tiles subdirectory. Using just '/tiles/(...).mvt' results in
    // cross-origin errors
    if (!window.location.origin) {
      window.location.origin = window.location.protocol + "//"
        + window.location.hostname
        + (window.location.port ? ':' + window.location.port : '');
    }
    let tilesUrl = window.location.origin + '/tiles/seattle/{z}/{x}/{y}.mvt';

    map.addSource('seattle', {
      type: 'vector',
      tiles: [tilesUrl],
      attribution: '&copy; AccessMap'
    });
    map.addSource('osrm', {
      type: 'vector',
      tiles: ['http://localhost:5000/tile/v1/foot/tile({x},{y},{z}).mvt'],
      attribution: '&copy; AccessMap'
    });

    map.addLayer({
      id: 'sidewalks-high',
      type: 'line',
      source: 'seattle',
      'source-layer': 'sidewalks',
      paint: {
        'line-color': colorScale(1.0).hex(),
        'line-width': lineWidth
      },
      layout: {
        'line-cap': 'round',
        'line-opacity': 0.0
      },
      filter: ['>', 'grade', 0.08333],
    });
    map.addLayer({
      id: 'sidewalks-mid',
      type: 'line',
      source: 'seattle',
      'source-layer': 'sidewalks',
      paint: {
        'line-color': colorScale(0.5).hex(),
        'line-width': lineWidth,
        'line-opacity': 0.0
      },
      layout: {
        'line-cap': 'round'
      },
      filter: ['all', ['>=', 'grade', 0.05], ['<=', 'grade', 0.08333]],
    });
    map.addLayer({
      id: 'sidewalks-low',
      type: 'line',
      source: 'seattle',
      'source-layer': 'sidewalks',
      paint: {
        'line-color': colorScale(0).hex(),
        'line-width': lineWidth,
        'line-opacity': 0.0
      },
      layout: {
        'line-cap': 'round'
      },
      filter: ['<', 'grade', 0.05],
    });

    map.addLayer({
      id: 'sidewalks-osrm-0',
      type: 'line',
      source: 'osrm',
      'source-layer': 'speeds',
      paint: {
        'line-color': colorScale(1.0).hex(),
        'line-width': lineWidth
      },
      layout: {
        'line-cap': 'round'
      },
      filter: ['<', 'speed', 0.0001],
    });
    map.addLayer({
      id: 'sidewalks-osrm-0.1',
      type: 'line',
      source: 'osrm',
      'source-layer': 'speeds',
      paint: {
        'line-color': colorScale(0.5).hex(),
        'line-width': lineWidth
      },
      layout: {
        'line-cap': 'round'
      },
      filter: ['all', ['>=', 'speed', 0.0001], ['<=', 'speed', 0.1]],
    });
    map.addLayer({
      id: 'sidewalks-osrm-greater',
      type: 'line',
      source: 'osrm',
      'source-layer': 'speeds',
      paint: {
        'line-color': colorScale(0.0).hex(),
        'line-width': lineWidth
      },
      layout: {
        'line-cap': 'round'
      },
      filter: ['>', 'speed', 0.1],
    });


    // Crossings
    map.addLayer({
      id: 'crossings',
      type: 'line',
      source: 'seattle',
      'source-layer': 'crossings',
      filter: ['==', 'curbramps', true],
      paint: {
        'line-width': lineWidth
      },
      layout: {
        'line-opacity': 0.0
      },
      minzoom: zoomChange
    });
  });

  //
  // Map behavior - panning, clicking, etc
  //
  // Increase sidewalks + crossings width when zooming in
  map.on('zoom', function() {
    let zoom = map.getZoom();
    let width = lineWidth;
    let dropShadowOpacity = outlineOpacity;
    let lineOpacity = 1.0
    if (zoom > zoomChange) {
      width = lineWidth * Math.pow(zoom / zoomChange, 6);
    } else {
      dropShadowOpacity = outlineOpacity * Math.pow(zoom / zoomChange, 4);
    }
    let swLines = ['sidewalks-low', 'sidewalks-mid', 'sidewalks-high'];
    for (let swLine of swLines) {
      map.setPaintProperty(swLine, 'line-width', width);
    }
    map.setPaintProperty('crossings', 'line-width', width);
  });

  // Map controls
  map.addControl(new Geocoder());
  map.addControl(new mapboxgl.Navigation({position: 'top-left'}));
}

module.exports = App;
