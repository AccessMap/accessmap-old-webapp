import $ from 'jquery';


function routingDemo(map) {
  //
  // Routing
  //

  // TODO: Write a proper routing control that implements a UX-friendly
  // routing workflow
  //

  // Event handling global state - mouse dragging, etc
  let isCursorOverPoint = false;
  let isDragging = false;
  let dragPoint = null;
  let canvas = map.getCanvasContainer();

  // Given new start (origin) and end (destination) points, request a new
  // route and draw it
  function updateRoute(origin, destination) {
    // origin and destination need to be in lat-lon
    let originLonLat = origin.concat().reverse();
    let destLonLat = destination.concat().reverse();
    let coords = originLonLat.concat(destLonLat);
    // FIXME: send coords as data?
    let req = $.get('api/v2/route.json?waypoints=' + '[' + coords + ']');
    req.done(function(data) {
        // Draw the route from origin to destination
        if(data.code === 'Ok') {
          // Complete path of route returned by routing system
          let path = {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: data.routes[0].geometry
            }]
          };

          // Route segments - can be individually colored
          let segments = data.routes[0].segments;

          // Path from origin/destination to route (e.g. dotted lines)
          let pathCoords = path.features[0].geometry.coordinates;
          let originPath = [origin, pathCoords[0]];
          let destPath = [pathCoords[pathCoords.length - 1], destination];

          let waypointPaths = {
            type: 'FeatureCollection',
            features: []
          };

          for (var waypointPath of [originPath, destPath]) {
            waypointPaths.features.push({
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: waypointPath
              },
              properties: {}
            });
          }

          // Update the map data layers
          map.getSource('route-path').setData(path);
          map.getSource('route-segments').setData(segments);
          map.getSource('route-waypointpaths').setData(waypointPaths);
        } else {
          console.log('Could not get route');
          console.log(data);
        }
    });
  }

  function onMove(e) {
    if (!isDragging) return;

    let coords = e.lngLat;

    canvas.style.cursor = 'grabbing';

    waypoints.features[dragPoint].geometry.coordinates = [coords.lng, coords.lat];
    map.getSource('waypoints').setData(waypoints);
  }

  function onUp(e) {
    if (!isDragging) return;

    // Get a route
    let features = waypoints.features
    let origin = features[0].geometry.coordinates;
    let destination = features[features.length - 1].geometry.coordinates;
    updateRoute(origin, destination);

    // Reset the cursor
    canvas.style.cursor = '';
    isDragging = false;
  }

  // Global state holder for waypoints
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

  // Register map events to trigger routing + drawing route lines
  map.on('load', function() {
    //
    // Route display setup
    //

    // Sources to hold routing data - updates to these = rendering route line
    let emptyFeatureCollection = {
      type: 'FeatureCollection',
      features: []
    }

    let routeSources = ['route-path', 'route-segments', 'route-waypointpaths'];

    for (var routeSource of routeSources) {
      map.addSource(routeSource, {
        type: 'geojson',
        data: emptyFeatureCollection
      });
    }

    // Route outline - thicker line
    map.addLayer({
      id: 'route-outline',
      type: 'line',
      source: 'route-path',
      paint: {
        'line-width': 12,
        'line-color': '#000',
        'line-opacity': 0.8
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      }
    });

    // Route centerline - thinner line on top
    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route-segments',
      paint: {
        'line-width': 8,
        'line-color': {
          property: 'cost',
          stops: [
            [1e9, '#00ff00'],
            [5e9, '#ffff00'],
            [1e10, '#ff0000']
          ]
        }
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      }
    });

    map.addLayer({
      id: 'route-waypointpaths',
      type: 'line',
      source: 'route-waypointpaths',
      paint: {
        'line-width': 8,
        'line-color': '#8888ff',
        'line-opacity': 0.8
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      }
    });

    //
    // Waypoint controls
    //

    // Data source for waypoints - this is editing during dragging
    map.addSource('waypoints', {
      type: 'geojson',
      data: waypoints
    });

    // waypoint outline - black circle
    map.addLayer({
      id: 'waypoints-outline',
      type: 'circle',
      source: 'waypoints',
      paint: {
        'circle-radius': 12,
        'circle-color': '#000'
      }
    });

    // waypoint fill color
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

    // waypoint text + styling
    map.addLayer({
      id: 'waypoints-text',
      type: 'symbol',
      source: 'waypoints',
      layout: {
        'text-field': '{textLabel}',
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold']
      }
    });


    map.on('mousemove', function(e) {
      // Set cursor to 'dragging' if it's above a waypoint
      let features = map.queryRenderedFeatures(e.point, {
        layers: ['waypoints']
      });

      // Figure out which waypoint we're over and track it globally
      if (features.length) {
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
    });

    map.on('mousedown', function(e) {
      if (!isCursorOverPoint) return;

      // Find the waypoint under the mouse
      let features = map.queryRenderedFeatures(e.point, {
        layers: ['waypoints']
      });
      dragPoint = features[0].properties.routeId;

      isDragging = true;

      canvas.style.cursor = 'grab';

      map.on('mousemove', onMove);
      map.on('mouseup', onUp);
    }, true);

    updateRoute(waypoints.features[0].geometry.coordinates,
                waypoints.features[1].geometry.coordinates);
  });
}

module.exports = routingDemo;
