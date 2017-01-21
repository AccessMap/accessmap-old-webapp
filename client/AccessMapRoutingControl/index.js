import * as d3 from 'd3';
import chroma from 'chroma-js';
import $ from 'jquery';
import extend from 'xtend';
import debounce from 'lodash.debounce';
import Typeahead from 'suggestions';
import MapboxClient from 'mapbox/lib/services/geocoding';
import turfBbox from '@turf/bbox';

import '!style!css!./AccessMapRoutingControl.css';

/**
 * A pedestrian routing control for Accessmap. Not yet suited for use away from
 * accessmapseattle.com
 * @class AccessMapRoutingControl
 *
 * @param {Object} options
 * @param {String} [options.api=null] routing API URL.
 */

// TODO: make use of es6 features (e.g. class constructor) function
function AccessMapRoutingControl(options) {
  this.options = extend({}, this.options, options);
}

AccessMapRoutingControl.prototype = {

  options: {
    api: null,
    zoom: 17,
    // control points for the elevation cost function
    maxdown: -0.1,
    ideal: -0.01,
    maxup: 0.0833,
    colorScale: chroma.scale(['lime', 'yellow', 'red'])
  },

  onAdd: function(map) {
    this._map = map;
    this._mapboxClient = new MapboxClient(this.options.accessToken);

    this._routingMode = false;

    // Bind this object to event-called functions
    this._onChange = this._onChange.bind(this);
    this._onChangeOrigin = this._onChangeOrigin.bind(this);
    this._onChangeDestination = this._onChangeDestination.bind(this);
    this._onKeyDownOrigin = this._onKeyDownOrigin.bind(this);
    this._onKeyDownDestination = this._onKeyDownDestination.bind(this);

    this._setupLayers();
    this._setupMouseInteraction();

    // FIXME: Add split screen, apply sidewalk layer coloring

    // Create div(s) to target with d3, input forms
    // To add things like icons, etc. create a span here with a specific
    // class and target with CSS
    let el = this.container = document.createElement('div');
    el.className = 'mapboxgl-ctrl-accessmaproutingcontrol mapboxgl-ctrl';

    let searchContainer = document.createElement('div');
    searchContainer.className = 'geocoder-container';

    let originEl = this._originEl = document.createElement('input');
    this._originEl.className = 'geocoder-input geocoder-input-origin';
    this._originEl.type = 'text';
    this._originEl.placeholder = 'Starting location';
    this._originEl.title = 'Starting location';
    this._originEl.style.display = 'none';
    this._originEl.addEventListener('keydown', this._onKeyDownOrigin);
    this._originEl.addEventListener('change', this._onChangeOrigin);

    let destinationEl = this._destinationEl = document.createElement('input');
    this._destinationEl.className = 'geocoder-input geocoder-input-destination';
    this._destinationEl.type = 'text';
    this._destinationEl.title = 'Destination location';
    this._destinationEl.placeholder = 'Search address';
    this._destinationEl.addEventListener('keydown', this._onKeyDownDestination);
    this._destinationEl.addEventListener('change', this._onChangeDestination);

    let originContainer = this._originContainer = document.createElement('div');
    this._originContainer.className = 'geocoder-origin-container';
    this._destinationContainer = document.createElement('div');
    this._destinationContainer.className = 'geocoder-destination-container';

    this._originContainer.appendChild(this._destinationEl);
    this._destinationContainer.appendChild(this._destinationEl);
    searchContainer.appendChild(this._originContainer);
    searchContainer.appendChild(this._destinationContainer);

    // TODO: Icon is bound to `this` to make clickable later
    let searchIcon = document.createElement('div');
    searchIcon.className = 'geocoder-icon geocoder-icon-search';

    let directionsIcon = document.createElement('div');
    directionsIcon.className = 'geocoder-icon geocoder-icon-directions';
    directionsIcon.title = 'Get directions (route, no text)';

    let settingsIcon = document.createElement('div');
    settingsIcon.className = 'geocoder-icon geocoder-icon-settings';
    settingsIcon.style.display = 'none';

    // TODO: fix the that-this hack using bind() and a separate function
    let that = this;
    directionsIcon.addEventListener('click', function() {
      // Toggle the presence of the 'origin' search box
      if (that._routingMode) {
        // switch to search-only mode
        originEl.style.display = 'none';
        settingsIcon.style.display = 'none';
        that._routingMode = false;
      } else {
        // switch to routing mode
        originEl.style.display = 'block';
        settingsIcon.style.display = 'inline-block';

        // Update the placeholder text
        destinationEl.placeholder = 'Destination location';
        destinationEl.title = 'Destination location';
        that._routingMode = true;
      }
    });

    settingsIcon.addEventListener('click', function() {
      if (typeof that.svgcontainer === 'undefined') {
        // Note: these are repetitive components - should at least make into
        // function
        let div = document.createElement('div');
        div.appendChild(document.createTextNode('Maximum uphill incline:'));
        that.container.appendChild(div);
        that.up = document.createElement('input');
        that.up.className = 'control-slider';
        that.up.setAttribute('type', 'range');
        that.up.setAttribute('min', 0);
        that.up.setAttribute('max', 10);
        that.up.setAttribute('step', 0.1);
        that.up.setAttribute('value', 8.3);
        that.container.appendChild(that.up);

        let div2 = document.createElement('div');
        div2.appendChild(document.createTextNode('Maximum downhill incline:'));
        that.container.appendChild(div2);
        that.down = document.createElement('input');
        that.down.className = 'control-slider';
        that.down.setAttribute('type', 'range');
        that.down.setAttribute('min', 0);
        that.down.setAttribute('max', 10);
        that.down.setAttribute('step', 0.1);
        that.down.setAttribute('value', 9);
        that.container.appendChild(that.down);

        // let div3 = document.createElement('div');
        // div3.appendChild(document.createTextNode('Ideal incline:'));
        // that.container.appendChild(div3);
        // that.ideal = document.createElement('input');
        // that.ideal.className = 'control-slider';
        // that.ideal.setAttribute('type', 'range');
        // that.ideal.setAttribute('min', -2);
        // that.ideal.setAttribute('max', 2);
        // that.ideal.setAttribute('step', 0.1);
        // that.ideal.setAttribute('value', -1);
        // that.container.appendChild(that.ideal);

        that._drawCostPlot();
      } else {
        that.container.removeChild(that.up);
        that.container.removeChild(that.svgcontainer);
        that.svgcontainer = undefined;
      }
    });

    originContainer.appendChild(originEl);
    el.appendChild(searchIcon);
    el.appendChild(searchContainer);
    el.appendChild(directionsIcon);
    el.appendChild(settingsIcon);

    this._originTypeahead = new Typeahead(originEl, [], { filter: false });
    this._originTypeahead.getItemValue = function(item) { return item.place_name; };

    this._destinationTypeahead = new Typeahead(destinationEl, [],
                                               { filter: false });
    this._destinationTypeahead.getItemValue = function(item) { return item.place_name; };

    return el;
  },

  _enableOrigin: function() {
    this._originTypeahead = new Typeahead(originEl, [], { filter: false });
    this._originTypeahead.getItemValue = function(item) { return item.place_name; };
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
          'line-color': '#000',
          'line-opacity': 0.5,
          'line-width': {
            stops: [
              [12, 6],
              [15, 11],
              [20, 20]
            ]
          }
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
          'line-color': {
            property: 'grade',
            type: 'interval',
            stops: [
              [-2, '#ff0000'],
              [that.options.maxdown, '#ffaa00'],
              [(that.options.maxdown + that.options.ideal) / 2, '#32adff'],
              [(that.options.ideal + that.options.maxup) / 2, '#ffaa00'],
              [that.options.maxup, '#ff0000'],
              [2, '#ff0000']
            ]
          },
          'line-width': {
            stops: [
              [12, 4],
              [15, 8],
              [20, 16]
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
          'line-color': '#8888ff',
          'line-opacity': 0.8,
          'line-width': {
            stops: [
              [12, 4],
              [15, 8],
              [20, 16]
            ]
          }
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
    let map = this._map;

    // create svg canvas
    this.svgcontainer = document.createElement('div');
    this.svgcontainer.className = 'svg-container';
    this.container.appendChild(this.svgcontainer);

    this.svg = d3.select(this.svgcontainer)
      .append('svg')
      .attr('width', this.svgcontainer.clientWidth)
      .attr('height', 150)
      .classed('svg-content', true);

    let margin = {top: 20, right: 10, bottom: 20, left: 60};
    let w = this.svg.attr('width') - margin.left - margin.right;
    let h = this.svg.attr('height') - margin.top - margin.bottom;

    // set up scales
    let x = d3.scaleLinear()
      .domain([-10, 10])
      .range([0, w])
      .clamp(true);

    let y = d3.scaleLinear()
      .domain([0, 100])
      .range([h, 0])
      .clamp(true);


    let g = this.svg.append('g')
      .attr('transform', 'translate(' + margin.left / 2 + ',' + margin.top / 2 + ')');

    g.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', 'translate(0,' + h + ')')
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'axis axis-y')
      .call(d3.axisLeft(y));

    // d3 place initial points
    // TODO: grab from cookie, if available
    let line = d3.line()
      .x(function(d) { return x(d.x) })
      .y(function(d) { return y(d.y) });

    let data = [{
      x: 100 * this.options.maxdown,
      y: 100,
      id: 'maxdown'
    }, {
      x: 100 * (this.options.maxdown + this.options.ideal) / 2,
      y: 10,
      id: 'low_mid'
    }, {
      x: 100 * this.options.ideal,
      y: 0,
      id: 'ideal'
    }, {
      x: 100 * (this.options.ideal + this.options.maxup) / 2,
      y: 10,
      id: 'high_mid'
    }, {
      x: 100 * this.options.maxup,
      y: 100,
      id: 'maxup'
    }];

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

    let points = pointGroup.selectAll('points')
      .data(data)
    .enter().append('circle')
      .attr('cx', function(d) { return x(d.x) })
      .attr('cy', function(d) { return y(d.y) })
      .attr('r', 5)
      .attr('class', function(d) { return 'point-' + d.id })
      .style('fill', 'black');

    function update() {
      // Recalculate midpoints
      data[1].x = (data[0].x + data[2].x) / 2
      data[3].x = (data[2].x + data[4].x) / 2

      // Clear all and redraw
      let points = pointGroup.selectAll('circle')
        .data([]);

      points.exit().remove();

      points
        .data(data)
      .enter().append('circle')
        .attr('cx', function(d) { return x(d.x) })
        .attr('cy', function(d) { return y(d.y) })
        .attr('r', 5)
        .style('fill', 'black');

      lines
        .attr('d', line(data));

      updateColors(data);
    }

    this.up.addEventListener('input', function(e) {
      let incline = e.target.valueAsNumber;
      data[4].x = incline;
      that.options.maxup = incline / 100;
      update();
    });

    this.down.addEventListener('input', function(e) {
      let incline = e.target.valueAsNumber;
      data[0].x = -incline;
      that.options.maxdown = -incline / 100;
      update();
    });

    // this.ideal.addEventListener('input', function(e) {
    //   let ideal = e.target.valueAsNumber;
    //   data[2].x = ideal;
    //   update();
    // });

    let that = this;
    function updateColors(data) {
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
        let y = that.options.colorScale(1e-2 * d.y).hex();
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

    // Prepare routing preferences
    // TODO: extract these from user interface
    let cost = {
      avoid: ['curbs', 'construction'].join('|'),
      maxdown: this.options.maxdown,
      ideal: this.options.ideal,
      maxup: this.options.maxup,
      origin: origin.reverse(),
      destination: destination.reverse()
    };

    // Convert unnested JSON to encoded GET querystring
    let paramArray = [];
    for (var c in cost) {
      if (cost.hasOwnProperty(c)) {
        paramArray.push(c + '=' + cost[c]);
      }
    }

    //
    // request route
    //

    let that = this;
    $.get(this.options.api + '?' + paramArray.join('&'))
    .done(function(data, status) {
      // Draw the route from origin to destination
      if (status === 'success') {
        if(data.code === 'Ok') {
          drawRoute(data);
        } else {
          // TODO: Update the control's UI with the error message, don't use
          // alert
          alert("No route from those locations.");
          console.log(data);
        }
      } else {
        // TODO: Update the control's UI with the error message, don't use
        // alert
        alert('Received status ' + status);
      }
    })
    .fail(function(data, text) {
      // TODO: Update the control's UI with the error message, don't use alert
      alert('Could not contact routing server');
    });

    function drawRoute(data) {
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

      // Zoom to the new route - route extent + 20%
      let bbox = turfBbox(map.getSource('route-path')._data);
      let dx = bbox[3] - bbox[1];
      let dy = bbox[2] - bbox[0];
      let zoomOut = 0.2;
      bbox = [bbox[0] - zoomOut * dy,
              bbox[1] - zoomOut * dx,
              bbox[2] + zoomOut * dy,
              bbox[3] + zoomOut * dx];

      map.fitBounds([[bbox[0], bbox[1]],[bbox[2], bbox[3]]]);
    }
  },

  _geocode: function(searchInput, target) {
    if (!searchInput) return;
    let request = this._mapboxClient.geocodeForward(searchInput, {
      // Bounding box for Seattle area
      bbox: [-122.4325535, 47.4837601, -122.2273287, 47.7390944],
      county: 'us'
    });

    request.then(function(response) {
      let res = response.entity;
      target.update(res.features);
    }.bind(this));
  },

  _onChange: function(target) {
    let selected = target.selected;
    if (!selected) return;

    function zoomToSelection(selected) {
      if (selected.bbox && selected.context && selected.context.length <= 3
          || selected.bbox && !selected.context) {
        let bbox = selected.bbox;
        this._map.fitBounds([[bbox[0], bbox[1]],[bbox[2], bbox[3]]]);
      } else {
        this._map.flyTo({
          center: selected.center,
          zoom: this.options.zoom
        });
      }
    }

    if (this._routingMode) {
      // Did the user select start and end locations?
      let originSelected = this._originTypeahead.selected;
      let destinationSelected = this._destinationTypeahead.selected;
      if ((originSelected !== null) && (destinationSelected !== null)) {
        this.getRoute(originSelected.center, destinationSelected.center);
      } else {
        // Only one has been selected - route to it
        zoomToSelection.call(this, selected);
      }
    } else {
      zoomToSelection.call(this, selected);
    }
  },

  // FIXME: these are redundant patterns (separate functions for
  // origin/destination) - fix that
  _onChangeOrigin: function() {
    this._onChange(this._originTypeahead);
  },

  _onChangeDestination: function() {
    this._onChange(this._destinationTypeahead);
  },

  _onKeyDownOrigin: debounce(function(e) {
    // Ignore tab, esc, left, right, enter, up, down
    if (e.metakey || [9, 27, 37, 39, 13, 38, 40].indexOf(e.keyCode) !== -1) {
      return;
    }
    this._geocode(e.target.value, this._originTypeahead);
  }, 200),

  _onKeyDownDestination: debounce(function(e) {
    // Ignore tab, esc, left, right, enter, up, down
    if (e.metakey || [9, 27, 37, 39, 13, 38, 40].indexOf(e.keyCode) !== -1) {
      return;
    }
    this._geocode(e.target.value, this._destinationTypeahead);
  }, 200)
};

module.exports = AccessMapRoutingControl;
