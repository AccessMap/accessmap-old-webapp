import * as d3 from 'd3';
import * as chroma from 'chroma-js';
import $ from 'jquery';
import extend from 'xtend';

import '!style!css!./AccessMapCostControl.css';

// TODO: make use of es6 features (e.g. class constructor) function
// AccessMapCostControl(options) {
function AccessMapCostControl(options) {
  this.options = extend({}, this.options, options);
}

AccessMapCostControl.prototype = {

  options: {
    // Layer for which to control general appearance (colors, etc)
    api: 'api/v2/route.json',
    'layer': 'sidewalks',
    'layer-prop': 'grade',
    // control points for the elevation cost function
    a: [-10, 100],
    b: [-5, 30],
    c: [-1, 0],
    d: [4, 30],
    e: [8.33, 100]
  },

  onAdd: function(map) {
    this._map = map;

    // Bind any desired events here - e.g. keyboard interaction
    // this._onKeyDown = this._onKeyDown.bind(this);

    this._setupLayers();
    this._setupMouseInteraction();

    // FIXME: Add split screen, apply sidewalk layer coloring

    // Create div(s) to target with d3, input forms
    // To add things like icons, etc. create a span here with a specific
    // class and target with CSS
    let el = this.container = document.createElement('div');
    el.className = 'mapboxgl-ctrl-costcontrol mapboxgl-ctrl';

    this._originEl = document.createElement('input');
    this._originEl.type = 'text';
    this._originEl.placeholder = 'Search address';

    // TODO: Icon is bound to `this` to make clickable later
    this._searchIcon = document.createElement('span');
    this._searchIcon.className = 'geocoder-icon geocoder-icon-search';

    // let costplot = document.createElement('div');
    // costplot.className = 'costplot';

    // el.appendChild(costplot);

    // this._drawCostPlot();

    el.appendChild(this._originEl);
    el.appendChild(this._searchIcon);

    return el;
  },

  onRemove: function() {
    this._container.parentNode.removeChild(this.container);
    this._map = null;

    // Remove sources and layers added for routing
    for (var source of this._sources) {
      this._map.removeSource(source);
    }

    this._map.removeLayer('origin-outline');
    this._map.removeLayer('origin');
    this._map.removeLayer('origin-text');
    this._map.removeLayer('destination-outline');
    this._map.removeLayer('destination');
    this._map.removeLayer('destination-text');

    this._map.removeLayer('route');
    this._map.removeLayer('route-outline');
    this._map.removeLayer('route-waypointpaths');

    return this;
  },

  _setupLayers: function() {
    // Store waypoint locations to share with drag operations
    this._origin = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: []
        },
        properties: {
          label: 'A'
        }
      }]
    }

    this._destination = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: []
        },
        properties: {
          label: 'B'
        }
      }]
    }

    // Add sources and layers for routing
    this._sources = ['origin', 'destination', 'route-path', 'route-segments',
                     'route-waypointpaths'];

    //
    // Add sources
    //
    let that = this;
    this._map.on('load', function() {
      let map = that._map;
      for (var source of that._sources) {
        map.addSource(source, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });
      }

      //
      // Add layers
      //

      // Routing lines
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

      // waypoints
      map.addLayer({
        id: 'origin-outline',
        type: 'circle',
        source: 'origin',
        paint: {
          'circle-radius': 12,
          'circle-color': '#000'
        }
      });

      map.addLayer({
        id: 'destination-outline',
        type: 'circle',
        source: 'destination',
        paint: {
          'circle-radius': 12,
          'circle-color': '#000'
        }
      });

      map.addLayer({
        id: 'origin',
        type: 'circle',
        source: 'origin',
        paint: {
          'circle-radius': 10,
          'circle-color': '#aaaaff'
        }
      });

      map.addLayer({
        id: 'destination',
        type: 'circle',
        source: 'destination',
        paint: {
          'circle-radius': 10,
          'circle-color': '#ffff00'
        }
      });

      map.addLayer({
        id: 'origin-text',
        type: 'symbol',
        source: 'origin',
        layout: {
          'text-field': '{label}',
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold']
        }
      });

      map.addLayer({
        id: 'destination-text',
        type: 'symbol',
        source: 'destination',
        layout: {
          'text-field': '{label}',
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold']
        }
      });
    });
  },

  _setupMouseInteraction: function() {
    let map = this._map;
    //
    // Mouse interaction with waypoints - adapted from mapbox example
    //
    let canvas = map.getCanvasContainer();
    let isCursorOverPoint = false;
    let isDragging = false;
    this._dragging = null;

    let that = this;
    function mouseDown() {
      if (!isCursorOverPoint) return;

      isDragging = true;

      if (isCursorOverPoint == 'origin') {
        that._dragging = 'origin';
      } else {
        that._dragging = 'destination';
      }
      // Set a cursor indicator
      canvas.style.cursor = 'grab';

      // Mouse events
      map.on('mousemove', onMove);
      map.on('mouseup', onUp);
    }

    function onMove(e) {
      if (!isDragging) return;
      let coords = [e.lngLat.lng, e.lngLat.lat];

      // Set a UI indicator for dragging.
      canvas.style.cursor = 'grabbing';

      // Update the marker state + update source to trigger render
      if (that._dragging == 'origin') {
        that._origin.features[0].geometry.coordinates = coords;
        map.getSource('origin').setData(that._origin);
      } else {
        that._destination.features[0].geometry.coordinates = coords;
        map.getSource('destination').setData(that._destination);
      }
    }

    function onUp(e) {
      if (!isDragging) return;
      var coords = e.lngLat;

      canvas.style.cursor = '';
      isDragging = false;

      // Request a route
      that.getRoute(that._origin.features[0].geometry.coordinates,
                    that._destination.features[0].geometry.coordinates);
    }

    map.on('load', function(e) {
      map.on('mousemove', function(e) {
        var features = map.queryRenderedFeatures(e.point, {
          layers: ['origin-outline', 'destination-outline']
        });

        // Change point and cursor style as a UI indicator
        // and set a flag to enable other mouse events.
        if (features.length) {
          // Which feature are we over? This should be more sophisticated (e.g.
          // use click location to select overlapping ones). For now, if markers
          // overlap, select the index-0 one
          let feature = features[0]

          // Store source name for marker under the cursor
          isCursorOverPoint = feature.layer.source;
          canvas.style.cursor = 'move';
          map.dragPan.disable();
        } else {
          canvas.style.cursor = '';
          isCursorOverPoint = false;
          map.dragPan.enable();
        }
      });

      map.on('mousedown', mouseDown, true);
    });
  },

  _drawCostPlot: function() {
    let options = this.options;
    let map = this._map;
    // create svg canvas
    let svg = d3.select(this.container)
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
    let data = [options.a, options.b, options.c, options.d, options.e];
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
      let colorScale = chroma.scale(['lime', 'yellow', 'red']);
      // Update coloring scheme for map
      // TODO: have separate modes: uphill vs. downhill. Current method uses
      // line direction, which has no meaning on the map view
      function densify(arr) {
        arr = arr.slice();
        for (let i = (arr.length - 1); i > 0; i--) {
          arr.splice(i, 0, {
            x: (arr[i - 1].x + arr[i].x) / 2,
            y: (arr[i - 1].y + arr[i].y) / 2
          });
        }
        return arr;
      }

      let denseData = densify(densify(data));

      let stops = denseData.map(function(d) {
        let x = 1e-2 * d.x;
        let y = colorScale(1e-2 * d.y).hex();
        return [x, y]
      });

      map.setPaintProperty('sidewalks', 'line-color', {
        property: 'grade',
        colorSpace: 'lab',
        stops: stops
      });
    }
  },

  getRoute: function(origin, destination) {
    let map = this._map;

    //
    // handle marker state
    //

    // store new marker locations (copy values to be safe)
    this._origin.features[0].geometry.coordinates = origin.slice();
    this._destination.features[0].geometry.coordinates = destination.slice();

    // update marker sources (triggers redraw)
    map.getSource('origin').setData(this._origin);
    map.getSource('destination').setData(this._destination);

    //
    // request route
    //

    // origin and destination need to be in lat-lon for request (and
    // concatenated)
    let coords = origin.reverse().concat(destination.reverse());

    // Send request, handle data
    let that = this;
    let req = $.get(this.options.api + '?waypoints=' + '[' + coords + ']');
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

        // Path from origin/destination to route (e.g. dotted lines in gmaps)
        let pathCoords = path.features[0].geometry.coordinates;
        let originPath = [that._origin.features[0].geometry.coordinates,
                          pathCoords[0]];
        let destPath = [pathCoords[pathCoords.length - 1],
                        that._destination.features[0].geometry.coordinates];

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
};

module.exports = AccessMapCostControl;
