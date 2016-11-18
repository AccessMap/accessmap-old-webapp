import $ from 'jquery';
import * as d3 from 'd3';


function routingDemo(map, colorScale) {
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

    // Source to hold data - updates to this = rendering route line
    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    // Route outline - thicker line
    map.addLayer({
      id: 'route-outline',
      type: 'line',
      source: 'route',
      paint: {
        'line-width': 12,
        'line-color': '#ffffff',
        'line-opacity': 0.8
      }
    });

    // Route centerline - thinner line on top
    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      paint: {
        'line-width': 5,
        'line-color': '#0000ff',
        'line-opacity': 0.8
      }
    });

    //
    // Waypoints
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
        // let featureId = features[0].properties.routeId;
        // for (let i = 0; i < waypoints.features.length; i++) {
        //   let globalId = waypoints.features[i].properties.routeId;
        //   if (featureId === globalId) {
        //     dragPoint = i;
        //   }
        // }
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

  //
  // TODO: Build the cost plot (use d3) with control points, make it interact
  //       with map and store/retrieve settings in cookie.

  //
  // create plot
  //

  // create svg canvas
  let svg = d3.select('#costplot')
              .append('svg')
              .attr('width', 400)
              .attr('height', 200);
  let margin = 50;
  let w = svg.attr('width') - margin;
  let h = svg.attr('height') - margin;

  // set up d3 axes

  let g = svg.append('g')
    .attr('transform', 'translate(' + margin / 2 + ',' + margin / 2 + ')');

  let x = d3.scaleLinear()
    .domain([-10, 10])
    .range([0, w])
    .clamp(true);
  let y = d3.scaleLinear()
    .domain([0, 100])
    .range([h, 0])
    .clamp(true);

  g.append('g')
    .attr('class', 'axis axis-x')
    .attr('transform', 'translate(0,' + h + ')')
    .call(d3.axisBottom(x));

  g.append('g')
    .attr('class', 'axis axis-y')
    .call(d3.axisLeft(y));

  // * d3 place initial points
  //   TODO: grab from cookie, if available
  let data = [[-9, 100], [-5, 30], [-1, 0], [5, 30], [10, 100]];
  data = data.map(function (d, i) {
    return {x: d[0], y: d[1], id: i}
  });

  let line = d3.line()
    .x(function(d) { return x(d.x) })
    .y(function(d) { return y(d.y) });

  let lines = g.selectAll('lines')
    .data([data])
  .enter().append('path')
    .attr('class', 'lines')
    .attr('d', function(d) { return line(d) })
    .style('fill', 'none')
    .style('stroke', 'blue')
    .style('stroke-width', '2px');

  let pointGroup = g.append('g')
    .attr('class', 'points');

  let point = pointGroup.selectAll('points')
    .data(data)
  .enter().append('circle')
    .attr('cx', function(d) { return x(d.x) })
    .attr('cy', function(d) { return y(d.y) })
    .attr('r', 5)
    .style('fill', 'black')
    .call(d3.drag()
      .on('start drag', dragged));

//  point.append('circle')
//    .attr('cx', function(d) { return x(d.x) })
//    .attr('cy', function(d) { return y(d.y) })
//    .attr('r', 5)
//    .style('fill', 'black');

  function dragged(d) {
    // Using a linear scale + tracking drag events has some odd behavior -
    // It doesn't originate at a reasonable location. Have to hack around it
    // until we understand the proper transformations/settings
    // The hack: use dx and dy and convert manually to get setting. Likely
    // introduces some error

    // Note: can't modify cutoffs via control points

    let dx = d3.event.dx * (20 / w);
    let dy = -1 * d3.event.dy * (100 / h);

    if (d.id == 1 || d.id == 3) {
      // between control points
      d.x += dx;
      d.y += dy;

    } else {
      // Center control point - only left/right allowed
      d.x += dx;
    }

    // Update
    d3.select(this)
      .attr('cx', function(d) { return x(d.x) })
      .attr('cy', function(d) { return y(d.y) });

    lines
      .attr('d', line(data));

    updateColors();
  }

  function updateColors() {
    // Update coloring scheme for map
    // TODO: transform based on y value as well - should modify color scale
    let stops = map.getPaintProperty('sidewalks', 'line-color').stops;
    stops = data.map(function(d, i) {
      let x = 1e-2 * data[i].x;
      let y = colorScale(1e-2 * data[i].y).hex();
      return [x, y]
    });
    for (let i = (data.length - 1); i > 0; i--) {
      // Densify the color stops - Mapbox's interpolation seems to cause
      // darkening/gray-ing between values
      let midx = 1e-2 * (data[i - 1].x + data[i].x) / 2;
      let midy = colorScale(1e-2 * (data[i - 1].y + data[i].y) / 2).hex();
      stops.splice(i, 0, [midx, midy]);
    }

    map.setPaintProperty('sidewalks', 'line-color', {
      property: 'grade',
      colorSpace: 'lab',
      stops: stops
    });
  }

  map.on('load', updateColors);
}

module.exports = routingDemo;
