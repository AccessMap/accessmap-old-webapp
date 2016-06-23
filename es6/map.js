// Leaflet (upon which mapbox.js is based) forces a global window.L
// variable, leading to all kinds of problems for modular development.
// As a result, none of the modules on npm work due to clobbering L.

import mapboxgl from 'mapbox-gl';
import '!style!css!mapbox-gl/dist/mapbox-gl.css';
import Geocoder from 'mapbox-gl-geocoder';
import '!style!css!mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

function App(api_url, mapbox_token) {
  // AccessMap uses a versioned API - which one are we using?
  const api_version = 'v2';
  const api = api_url.replace(/\/?$/, '/') + api_version;

  // GeoJSON vs. vector tile background zoom level switch
  const zoomChange = 15;

  // Map initialization
  mapboxgl.accessToken = mapbox_token;

  let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v8',
    center: [-122.308690, 47.652810],
    zoom: zoomChange
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
      id: 'sidewalks-vt',
      type: 'line',
      source: 'sidewalks-vt',
      'source-layer': 'vectile',
      paint: {
        'line-opacity': 0.4,
        'line-translate': [1, 1]
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
        'line-color': '#ff0000'
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
        'line-color': '#ffff00'
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
        'line-color': '#00ff00'
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
    let thickness = 1;
    let dropShadowOpacity = 0.4;
    if (zoom > zoomChange) {
      thickness = Math.pow(zoom / 15, 10);
    } else {
      dropShadowOpacity = 0.4 * Math.pow(zoom / zoomChange, 4);
    }
    map.setPaintProperty('sidewalks-vt', 'line-width', thickness);
    map.setPaintProperty('sidewalks-vt', 'line-opacity', dropShadowOpacity);
    map.setPaintProperty('sidewalks-vt-low', 'line-width', thickness);
    map.setPaintProperty('sidewalks-vt-mid', 'line-width', thickness);
    map.setPaintProperty('sidewalks-vt-high', 'line-width', thickness);
    map.setPaintProperty('crossings', 'line-width', thickness);
  });

  // Map controls
  map.addControl(new Geocoder());
  map.addControl(new mapboxgl.Navigation({position: 'top-left'}));
}

module.exports = App;
