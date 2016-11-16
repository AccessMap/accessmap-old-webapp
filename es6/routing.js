import mapboxgl from 'mapbox-gl';
import '!style!css!mapbox-gl/dist/mapbox-gl.css';
import Geocoder from 'mapbox-gl-geocoder';
import '!style!css!mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import * as chroma from 'chroma-js';
import $ from 'jquery';
import debounce from 'debounce';


function routingDemo(map) {
  //
  // Routing
  //

  // TODO: Write a proper routing control that implements a UX-friendly
  // routing workflow

  // Initial data
  let waypoints = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-122.336158, 47.606637]
      },
      properties: {
        waypoint: 'origin'
      }
    }, {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-122.330572, 47.603704]
      },
      properties: {
       waypoint: 'destination'
      }
    }]
  };

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

  // Source to hold data - updates to this = rendering route line
  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  });

  // How to render the route line
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

  // Data source for waypoints - this is editing during dragging
  map.addSource('waypoints', {
    type: 'geojson',
    data: waypoints
  });

  // How to draw waypoints
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

  // Event handling - mouse dragging, etc
  let isCursorOverPoint = false;
  let isDragging = false;
  let dragPoint = null;
  let canvas = map.getCanvasContainer();

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

  function updateRoute(origin, destination) {
    // origin and destination need to be in lat-lon
    origin = origin.concat().reverse();
    destination = destination.concat().reverse();
    let coords = origin.concat(destination);
    // FIXME: send coords as data?
    let req = $.get('api/v2/route.json?waypoints=' + '[' + coords + ']');
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
          console.log(data);
        }
    });
  }
  updateRoute(waypoints.features[0].geometry.coordinates,
              waypoints.features[1].geometry.coordinates);
}

module.exports = routingDemo;
