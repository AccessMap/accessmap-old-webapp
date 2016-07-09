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
        'line-width': 1.5,
      },
      layout: {
        'line-cap': 'round'
      },
      filter: ['<', 'grade', 0.05],
    });

    // Routing
    // TODO: Write a proper routing control that implements a UX-friendly
    // routing workflow
    let waypoints = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.310586, 47.655467]
        },
        properties: {
          waypoint: 'origin'
        }
      }, {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.318028, 47.658788]
        },
        properties: {
         waypoint: 'destination'
        }
      }]
    }

    // Add id to each waypoint because tracking them by location is a pain
    // Also add a 'text fill' property to label origin/destination
    for (let i = 0; i < waypoints.features.length; i++) {
      waypoints.features[i].properties['routeId'] = i;
      switch (waypoints.features[i].properties.waypoint) {
        case 'origin':
          waypoints.features[i].properties['textLabel'] = 'A';
          break;
        case 'destination':
          waypoints.features[i].properties['textLabel'] = 'B';
          break;
        default:
          waypoints.features[i].properties['textLabel'] = '';
      }
    }
    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });
    map.addLayer({
      id: 'route-outline',
      type: 'line',
      source: 'route',
      paint: {
        'line-width': 12,
        'line-color': '#ffffff'
      }
    });
    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      paint: {
        'line-width': 5,
        'line-color': '#0000ff'
      }
    });

    map.addSource('waypoints', {
      type: 'geojson',
      data: waypoints
    });

    map.addLayer({
      id: 'waypoints-outline',
      type: 'circle',
      source: 'waypoints',
      paint: {
        'circle-radius': 12,
        'circle-color': '#000'
      }
    });
    map.addLayer({
      id: 'waypoints',
      type: 'circle',
      source: 'waypoints',
      paint: {
        'circle-radius': 10,
        'circle-color': {
          property: 'waypoint',
          type: 'categorical',
          stops: [
            ['origin', '#00ff00'],
            ['intermediate', '#888888'],
            ['destination', '#ffff00']
          ]
        }
      }
    });
    map.addLayer({
      id: 'waypoints-text',
      type: 'symbol',
      source: 'waypoints',
      layout: {
        'text-field': '{textLabel}',
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold']
      }
    });

    let isCursorOverPoint = false;
    let isDragging = false;
    let dragPoint = null;
    let canvas = map.getCanvasContainer();
    // Routing mouse move behavior
    function onMouseMove(e) {
      let features = map.queryRenderedFeatures(e.point, {
        layers: ['waypoints']
      });
      if (features.length) {
        // Figure out which waypoint we're over and track it globally
        let featureId = features[0].properties.routeId;
        for (let i = 0; i < waypoints.features.length; i++) {
          let globalId = waypoints.features[i].properties.routeId;
          if (featureId === globalId) {
            dragPoint = i;
          }
        }
        // map.setPaintProperty('waypoints', 'circle-color', '#aaaaaa');
        canvas.style.cursor = 'move';
        isCursorOverPoint = true;
        map.dragPan.disable();
      } else {
        map.setPaintProperty('waypoints', 'circle-color', {
          property: 'waypoint',
          type: 'categorical',
          stops: [
            ['origin', '#00ff00'],
            ['intermediate', '#888888'],
            ['destination', '#ffff00']
          ]
        });

        canvas.style.cursor = '';
        isCursorOverPoint = false;
        map.dragPan.enable();
      }
    }
    map.on('mousemove', debounce(onMouseMove, 200));
    map.on('mousedown', function(e) {
      if (!isCursorOverPoint) return;

      isDragging = true;

      canvas.style.cursor = 'grab';

      map.on('mousemove', function(e) {
        if (!isDragging) return;

        let coords = e.lngLat;

        canvas.style.cursor = 'grabbing';

        waypoints.features[dragPoint].geometry.coordinates = [coords.lng, coords.lat];
        map.getSource('waypoints').setData(waypoints);
      });
      map.on('mouseup', function(e) {
        if (!isDragging) return;

        // Get the origin and destination coordinates
        let features = waypoints.features
        let origin = features[0].geometry.coordinates;
        let destination = features[features.length - 1].geometry.coordinates;
        updateRoute(origin, destination);

        canvas.style.cursor = '';
        isDragging = false;
      });
    });
    // Load an initial route
    function updateRoute(origin, destination) {
      // origin and destination need to be in lat-lon
      origin = origin.concat().reverse();
      destination = destination.concat().reverse();
      let coords = origin.concat(destination);
      // FIXME: send coords as data?
      let req = $.get(api + '/route.json?waypoints=' + '[' + coords + ']');
      req.done(function(data) {
          // Draw the route from origin to destination
          if(data.code === 'Ok') {
            let geometry = data.routes[0].geometry
            let fc = {
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                geometry: geometry,
                properties: {}
              }]
            }
            map.getSource('route').setData(fc);
          } else {
            console.log('Could not get route');
          }
      });
    }
    updateRoute(waypoints.features[0].geometry.coordinates,
                waypoints.features[1].geometry.coordinates);

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
