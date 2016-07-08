// Leaflet (upon which mapbox.js is based) forces a global window.L
// variable, leading to all kinds of problems for modular development.
// As a result, none of the modules on npm work due to clobbering L.

import mapboxgl from 'mapbox-gl';
import '!style!css!mapbox-gl/dist/mapbox-gl.css';
import Geocoder from 'mapbox-gl-geocoder';
import '!style!css!mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import * as chroma from 'chroma-js';


function App(mapbox_token) {
  // AccessMap uses a versioned API - which one are we using?
  const api = '/api/v2';

  // GeoJSON vs. vector tile background zoom level switch
  // const zoomChange = 15;
  const zoomChange = 14;

  // -- Styling --
  // Sidewalk color scale
  // Original color scheme
  let colorScale = chroma.scale(['lime', 'yellow', 'red']);
  // Simple dark -> color scheme
  // let colorScale = chroma.scale(['grey', 'red']);
  // The yellow is more visible for this one
  // let colorScale = chroma.bezier(['lime', 'yellow', 'red']);

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

    // Sidewalks
    // Note: mapbox-gl-js does not yet have data-driven styling - when it
    // does, this should be updated
    // map.addSource('sidewalks', {
    //   type: 'geojson',
    //   data: api + '/sidewalks.geojson' + '?bbox=' + bbox
    // })
    // map.addLayer({
    //   id: 'sidewalks-high',
    //   type: 'line',
    //   source: 'sidewalks',
    //   paint: {
    //     'line-color': '#ff0000'
    //   },
    //   filter: ['>', 'grade', 0.08333],
    //   minzoom: zoomChange
    // });
    // map.addLayer({
    //   id: 'sidewalks-mid',
    //   type: 'line',
    //   source: 'sidewalks',
    //   paint: {
    //     'line-color': '#ffff00'
    //   },
    //   filter: ['all', ['>=', 'grade', 0.05], ['<=', 'grade', 0.08333]],
    //   minzoom: zoomChange
    // });
    // map.addLayer({
    //   id: 'sidewalks-low',
    //   type: 'line',
    //   source: 'sidewalks',
    //   paint: {
    //     'line-color': '#00ff00'
    //   },
    //   filter: ['<', 'grade', 0.05],
    //   minzoom: zoomChange
    // });

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
      minzoom: zoomChange
    });

    // Test vector tiles
    map.addSource('sidewalks-vt', {
      type: 'vector',
      tiles: ['http://dssg-db.cloudapp.net:3001/test_layer/{z}/{x}/{y}.mvt'],
      attribution: '&copy; AccessMap'
    });
    map.addLayer({
      id: 'sidewalks-vt-shadow',
      type: 'line',
      source: 'sidewalks-vt',
      'source-layer': 'vectile',
      paint: {
        'line-color': '#333333',
        'line-opacity': outlineOpacity,
        'line-width': shadowScale * lineWidth
        // 'line-translate': [1, 1]
      },
      layout: {
        'line-cap': 'round'
      },
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
        'line-width': 1.5,
        // Adds direction arrows to line, but then ignores line-color
        // Also, until data-driven styling works for lines, can't
        // make direction go according to elevation change, just coordinate
        // order
        // 'line-pattern': 'oneway-spaced-white-large'
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
      // map.getSource('sidewalks').setData(api + '/sidewalks.geojson' + '?bbox=' + bbox);
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
    // map.setPaintProperty('sidewalks-vt-shadow', 'line-width', width);
    map.setPaintProperty('sidewalks-vt-shadow', 'line-width', shadowScale * width);
    map.setPaintProperty('sidewalks-vt-shadow', 'line-opacity', dropShadowOpacity);
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
