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
  let colorScale = chroma.scale(['#3E60BD', '#FD4C51'])
                    .correctLightness();

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
    center: [-122.308690, 47.652810],
    zoom: 15
  });

  map.on('load', function() {
    let bounds = map.getBounds().toArray();
    let bbox = bounds[0].concat(bounds[1]).join(',');

    // Crossings
    map.addSource('crossings', {
      type: 'geojson',
      data: api + '/crossings.geojson' + '?bbox=' + bbox
    })
    map.addLayer({
      id: 'crossings',
      type: 'line',
      source: 'crossings',
      filter: ['==', 'curbramps', true],
      paint: {
        'line-width': lineWidth
      },
      minzoom: zoomChange
    });

    // Sidewalks
    // Note: mapbox-gl-js does not yet have data-driven styling - when it
    // does, this should be updated
    // Test vector tiles
    map.addSource('sidewalks-vt', {
      type: 'vector',
      tiles: ['http://dssg-db.cloudapp.net:3001/test_layer/{z}/{x}/{y}.mvt'],
      attribution: '&copy; AccessMap'
    });
    map.addLayer({
      id: 'sidewalks-vt-high',
      type: 'line',
      source: 'sidewalks-vt',
      'source-layer': 'vectile',
      paint: {
        'line-color': colorScale(1.0).hex(),
        'line-width': lineWidth
      },
      layout: {
        'line-cap': 'round'
      },
      filter: ['>', 'grade', 0.08333],
    });
    map.addLayer({
      id: 'sidewalks-vt-mid',
      type: 'line',
      source: 'sidewalks-vt',
      'source-layer': 'vectile',
      paint: {
        'line-color': colorScale(0.5).hex(),
        'line-width': lineWidth
      },
      layout: {
        'line-cap': 'round'
      },
      filter: ['all', ['>=', 'grade', 0.05], ['<=', 'grade', 0.08333]],
    });
    map.addLayer({
      id: 'sidewalks-vt-low',
      type: 'line',
      source: 'sidewalks-vt',
      'source-layer': 'vectile',
      paint: {
        'line-color': colorScale(0).hex(),
        'line-width': lineWidth,
      },
      layout: {
        'line-cap': 'round'
      },
      filter: ['<', 'grade', 0.05],
    });
  });

  // Map behavior - panning, clicking, etc
  map.on('moveend', function() {
    if (map.getZoom() >= zoomChange) {
      let bounds = map.getBounds().toArray();
      let bbox = bounds[0].concat(bounds[1]).join(',');
      map.getSource('crossings').setData(api + '/crossings.geojson' + '?bbox=' + bbox);
    }
  });

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
    let swLines = ['sidewalks-vt-low', 'sidewalks-vt-mid', 'sidewalks-vt-high'];
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
