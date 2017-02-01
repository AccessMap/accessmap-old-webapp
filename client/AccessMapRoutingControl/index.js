import * as d3 from 'd3';
import chroma from 'chroma-js';
import $ from 'jquery';
import extend from 'xtend';
import debounce from 'lodash.debounce';
import Typeahead from 'suggestions';
import MapboxClient from 'mapbox/lib/services/geocoding';
import turfBbox from '@turf/bbox';
import mapboxgl from 'mapbox-gl';

import Slider from 'bootstrap-slider';
import '!style!css!bootstrap-slider/dist/css/bootstrap-slider.min.css';

import '!style!css!./AccessMapRoutingControl.css';

// FIXME: the Typeahead class fires an extra 'change' event on click. This
// is bad - it launches two route requests. This is a messy hack around
// that copied from version 1.3.1
Typeahead.prototype.value = function(value) {
  this.selected = value;
  this.el.value = this.getItemValue(value);
};

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

    this._mode = 'view';

    // Bind this object to event-called functions
    this._onChange = this._onChange.bind(this);
    this._onKeyDownOrigin = this._onKeyDownOrigin.bind(this);
    this._onKeyDownDestination = this._onKeyDownDestination.bind(this);

    this._setupLayers();
    let el = this._setupElements();
    this._contextMenu();

    return el;
  },

  _setupElements: function() {
    // Create div(s) to target with d3, input forms
    // To add things like icons, etc. create a span here with a specific
    // class and target with CSS
    let defaultStyle = this._defaultMapStyle.bind(this);

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
    this._originEl.addEventListener('change', () => {
      this._onChange(this._originTypeahead);
    });

    let destinationEl = this._destinationEl = document.createElement('input');
    this._destinationEl.className = 'geocoder-input geocoder-input-destination';
    this._destinationEl.type = 'text';
    this._destinationEl.title = 'Destination location';
    this._destinationEl.placeholder = 'Search address';
    this._destinationEl.addEventListener('keydown', this._onKeyDownDestination);
    this._destinationEl.addEventListener('change', () => {
      this._onChange(this._destinationTypeahead);
    });

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

    // Custom route controls
    // TODO: use proper components for this (React?)
    let customContainer = document.createElement('div');
    customContainer.style.display = 'none';
    customContainer.className = 'custom-container';
    this.container.appendChild(customContainer);

    let tabs = document.createElement('ul');
    tabs.className = 'nav nav-tabs';

    let upTab = document.createElement('li');
    upTab.className = 'active'
    let upTabLink = document.createElement('a');
    upTabLink.setAttribute('data-toggle', 'tab');
    upTabLink.setAttribute('href', '#upcontrol');
    upTabLink.innerHTML = 'Uphill';
    upTab.appendChild(upTabLink);
    tabs.appendChild(upTab);

    let map = this._map;
    let options = this.options;
    let colorScale = this.options.colorScale;
    function uphillUpdate() {
      // Modify map style to make everything uphill-shaded
      let mid = (options.maxup + options.ideal) / 2;
      // Need to solve linear equation to get x-intercept, which is equivalent
      // to 'b' in mx + b for equation for line from ideal to midpoint
      // b is in the domain [0, 0.01]
      let dy = 0.1;
      let dx = mid - options.ideal;
      let m = dy / dx;
      let b = 0.1 - m * mid;

      let stops = [
        [options.maxup * -1, colorScale(1).hex()],
        [mid * -1, colorScale(0.1).hex()],
        [0, colorScale(b).hex()],
        [mid, colorScale(0.1).hex()],
        [options.maxup, colorScale(1).hex()]
      ];

      map.setPaintProperty('sidewalks', 'line-color', {
        property: 'grade',
        colorSpace: 'lab',
        stops: stops
      });
    }

    upTabLink.addEventListener('click', uphillUpdate);

    let downTab = document.createElement('li');
    let downTabLink = document.createElement('a');
    downTabLink.setAttribute('data-toggle', 'tab');
    downTabLink.setAttribute('href', '#downcontrol');
    downTabLink.innerHTML = 'Downhill';
    downTab.appendChild(downTabLink);
    tabs.appendChild(downTab);

    // Barrier settings - checkboxes
    let barriersTab = document.createElement('li');
    let barriersTabLink = document.createElement('a');
    barriersTabLink.setAttribute('data-toggle', 'tab');
    barriersTabLink.setAttribute('href', '#barrierscontrol');
    barriersTabLink.innerHTML = 'Barriers';
    barriersTab.appendChild(barriersTabLink);
    tabs.appendChild(barriersTab);

    barriersTabLink.addEventListener('click', defaultStyle);

    function downhillUpdate() {
      // Modify map style to make everything uphill-shaded
      let mid = (options.maxdown + options.ideal) / 2;
      let stops = [
        [options.maxdown, colorScale(1).hex()],
        [mid, colorScale(0.1).hex()],
        [-0.01, colorScale(0).hex()],
        [0.01, colorScale(0).hex()],
        [mid * -1, colorScale(0.1).hex()],
        [options.maxdown * -1, colorScale(1).hex()]
      ];

      map.setPaintProperty('sidewalks', 'line-color', {
        property: 'grade',
        colorSpace: 'lab',
        stops: stops
      });
    }

    downTabLink.addEventListener('click', downhillUpdate);

    customContainer.appendChild(tabs);

    // Container for tab content
    let tabContent = document.createElement('div');
    tabContent.className = 'tab-content';
    tabContent.style.padding = '10px';

    //
    // Create input sliders
    //

    // Up slider
    let upContainer = document.createElement('div');
    upContainer.id = 'upcontrol';
    upContainer.className = 'tab-pane fade in active';
    tabContent.appendChild(upContainer);

    let upTitle = document.createElement('div');
    upTitle.innerHTML = 'Maximum uphill incline';
    upContainer.appendChild(upTitle);

    let upContainerControl = document.createElement('div');
    upContainer.appendChild(upContainerControl);

    let upMin = document.createElement('div')
    upMin.innerHTML = '1%';
    upMin.style.display = 'inline-block';
    upMin.style.margin = '0 10px 0 0';
    upContainerControl.appendChild(upMin);

    let upSliderContainer = document.createElement('div');
    upSliderContainer.style.display = 'inline-block';
    upContainerControl.appendChild(upSliderContainer);

    let upMax = document.createElement('div')
    upMax.innerHTML = '10%';
    upMax.style.display = 'inline-block';
    upMax.style.margin = '0 0 0 10px';
    upContainerControl.appendChild(upMax);

    let up = new Slider(upSliderContainer, {
      id: 'up-slider',
      min: 1,
      max: 10,
      step: 0.1,
      value: this.options.maxup * 100
    });

    // Down slider
    let downContainer = document.createElement('div');
    downContainer.id = 'downcontrol';
    downContainer.className = 'tab-pane fade';
    tabContent.appendChild(downContainer);

    let downTitle = document.createElement('div');
    downTitle.innerHTML = 'Maximum downhill incline';
    downContainer.appendChild(downTitle);

    let downContainerControl = document.createElement('div');
    downContainer.appendChild(downContainerControl);

    let downMin = document.createElement('div')
    downMin.innerHTML = (this.options.ideal * 100).toString() + '%';
    downMin.style.display = 'inline-block';
    downMin.style.margin = '0 10px 0 0';
    downContainerControl.appendChild(downMin);

    let downSliderContainer = document.createElement('div');
    downSliderContainer.style.display = 'inline-block';
    downContainerControl.appendChild(downSliderContainer);

    let downMax = document.createElement('div')
    downMax.innerHTML = '10%';
    downMax.style.display = 'inline-block';
    downMax.style.margin = '0 0 0 10px';
    downContainerControl.appendChild(downMax);

    let down = new Slider(downSliderContainer, {
      id: 'down-slider',
      min: this.options.ideal * 100 * -1,
      max: 10,
      step: 0.1,
      value: this.options.maxdown * 100 * -1
    });

    // Fix CSS issues with bootstrap-slider: initialized offset is wrong?
    let upTip = up.sliderElem.getElementsByClassName('tooltip-main')[0];
    let downTip = down.sliderElem.getElementsByClassName('tooltip-main')[0];
    upTip.style['margin-left'] = '-16px';
    downTip.style['margin-left'] = '-16px';

    up.on('slide', function(newVal) {
      options.maxup = newVal / 100;
      uphillUpdate();
    });

    down.on('slide', function(newVal) {
      options.maxdown = -newVal / 100;
      downhillUpdate();
    });

    function updateColors() {
      let data = [{
        x: 100 * options.maxdown,
        y: 100,
        id: 'maxdown'
      }, {
        x: 100 * (options.maxdown + options.ideal) / 2,
        y: 10,
        id: 'low_mid'
      }, {
        x: 100 * options.ideal,
        y: 0,
        id: 'ideal'
      }, {
        x: 100 * (options.ideal + options.maxup) / 2,
        y: 10,
        id: 'high_mid'
      }, {
        x: 100 * options.maxup,
        y: 100,
        id: 'maxup'
      }];
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
        let x = 0.01 * d.x;
        let y = options.colorScale(0.01 * d.y).hex();
        return [x, y]
      });

      map.setPaintProperty('sidewalks', 'line-color', {
        property: 'grade',
        colorSpace: 'lab',
        stops: stops
      });
    }

    // Barriers tab content - checkboxes for e.g. construction
    let barriersContainer = document.createElement('div');
    barriersContainer.id = 'barrierscontrol';
    barriersContainer.className = 'tab-pane fade';
    tabContent.appendChild(barriersContainer);

    // Form container for inputs
    let barriersForm = document.createElement('form');
    barriersContainer.appendChild(barriersForm);

    let constructionDiv = document.createElement('div');
    constructionDiv.className = 'checkbox';
    barriersForm.appendChild(constructionDiv);
    let constructionLabel = document.createElement('label');
    constructionDiv.appendChild(constructionLabel);
    let construction = this.construction = document.createElement('input');
    construction.type = 'checkbox';
    construction.checked = true;
    construction.value = '';
    constructionLabel.appendChild(construction);
    constructionLabel.appendChild(document.createTextNode('Avoid Construction'));

    let curbsDiv = document.createElement('div');
    curbsDiv.className = 'checkbox';
    barriersForm.appendChild(curbsDiv);
    let curbsLabel = document.createElement('label');
    curbsDiv.appendChild(curbsLabel);
    let curbs = this.curbs = document.createElement('input');
    curbs.type = 'checkbox';
    curbs.checked = true;
    curbs.value = '';
    curbsLabel.appendChild(curbs);
    curbsLabel.appendChild(document.createTextNode('Require curb ramps'));

    customContainer.appendChild(tabContent);

    settingsIcon.addEventListener('click', function() {
      // Toggle displaying custom controls
      if (customContainer.style.display === 'none') {
        customContainer.style.display = 'block';
        uphillUpdate();
      } else {
        customContainer.style.display = 'none';
        defaultStyle();
      }
    });

    let that = this;
    directionsIcon.addEventListener('click', function() {
      // Toggle the presence of the 'origin' search box
      if (that._mode === 'routing') {
        // switch to search-only mode
        originEl.style.display = 'none';
        settingsIcon.style.display = 'none';
        customContainer.style.display = 'none';
        that._mode = 'view';
        defaultStyle();
      } else {
        // switch to routing mode
        originEl.style.display = 'block';
        settingsIcon.style.display = 'inline-block';

        // Update the placeholder text
        destinationEl.placeholder = 'Destination location';
        destinationEl.title = 'Destination location';
        that._mode = 'routing';
      }
    });

    return el;
  },

  _defaultMapStyle: function() {
    let options = this.options;
    this._map.setPaintProperty('sidewalks', 'line-color', {
      property: 'grade',
      colorSpace: 'lab',
      stops: [
        [-0.1, options.colorScale(1).hex()],
        [-0.055, options.colorScale(0.1).hex()],
        [-0.01, options.colorScale(0).hex()],
        [0.0366, options.colorScale(0.1).hex()],
        [0.0833, options.colorScale(1).hex()]
      ]
    });
  },

  _contextMenu: function() {
    let map = this._map;
    let that = this;
    map.on('contextmenu', function(e) {
      let html = `
      <div id="contextmenu">
      <ul style="list-style-type: none; padding-left: 0;">
      <li id="origin">
        <a>Set Origin</a>
      </li>
      <li id="destination">
        <a>Set Destination</a>
      </li>
      </ul>
      </div>
      `;
      if (this._contextPopup) this._contextPopup.remove();
      this._contextPopup = new mapboxgl.Popup();
      this._contextPopup.setLngLat(e.lngLat)
        .setHTML(html)
        .addTo(map);

      // Set up choice listeners
      let originEl = document.getElementById('origin');
      let destinationEl = document.getElementById('destination');

      originEl.addEventListener('click', () => {
        that.getRoute([e.lngLat.lng, e.lngLat.lat], that._destination);
        this._contextPopup.remove();
      });

      destinationEl.addEventListener('click', () => {
        that.getRoute(that._origin, [e.lngLat.lng, e.lngLat.lat]);
        this._contextPopup.remove();
      });
    });
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

    this._originMarker.remove();
    this._destinationMarker.remove();
    this._map.removeLayer('route');
    this._map.removeLayer('route-outline');
    this._map.removeLayer('route-waypointpaths');

    return this;
  },

  _setupLayers: function() {
    // Store waypoint locations to share with drag operations
    // Add sources and layers for routing
    this._sources = ['route-path', 'route-segments', 'route-waypointpaths'];

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
        id: 'route-waypointpaths',
        type: 'line',
        source: 'route-waypointpaths',
        paint: {
          'line-color': '#000',
          'line-opacity': 0.6,
          'line-width': {
            stops: [
              [12, 4],
              [15, 6],
              [20, 16]
            ]
          },
          'line-dasharray': {
            stops: [
              [12, [0, 1]],
              [15, [0, 1.5]],
              [20, [0, 4]]
            ]
          }
        },
        layout: {
          'line-cap': 'round'
        }
      });

      map.addLayer({
        id: 'route-outline',
        type: 'line',
        source: 'route-path',
        paint: {
          'line-color': '#000',
          'line-opacity': 0.7,
          'line-gap-width': {
            stops: [
              [12, 3],
              [15, 7],
              [20, 23]
            ]
          },
          'line-width': {
            stops: [
              [12, 1.5],
              [15, 2],
              [20, 3]
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
              [that.options.maxdown, '#32adff'],
              [that.options.maxup, '#ff0000'],
              [2, '#ff0000']
            ]
          },
          'line-width': {
            stops: [
              [12, 4],
              [15, 8],
              [20, 24]
            ]
          }
        },
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        }
      });
    });
  },

  getRoute: function(origin, destination) {
    // Origin and destination are [lng, lat] arrays

    let map = this._map;

    //
    // handle marker state
    //

    // store new marker locations (copy values to be safe)
    this._origin = origin.slice();
    this._destination = destination.slice();

    let markerSVG = `
    <svg id="origin-marker" viewBox="0 0 400 600">
      <g>
    <path
       transform="translate(10,10)"
       d="m 182.9,551.7 c 0,0.1 0.2,0.3 0.2,0.3 0,0 175.2,-269 175.2,-357.4 C 358.3,64.5 269.5,7.9 182.9,7.7 96.3,7.9 7.5,64.5 7.5,194.6 7.5,283 182.8,552 182.8,552 c 0,0 0.1,-0.3 0.1,-0.3 z"
       fill="#00aeef"
       stroke="#000000"
       stroke-width="30px" />
        <text
          font-style="normal"
          font-weight="bold"
          font-size="40px"
          line-height="125%"
          font-family="sans-serif"
          word-spacing="0px"
          fill="#000000"
          x="109.15977"
          y="308.76724">
          <tspan x="109.15977" y="308.76724" font-size="245px">A</tspan>
        </text>
      </g>
    </svg>
    `;
    let markerNames = ['origin', 'destination']
    for (var i = 0; i < markerNames.length; i++) {
      let div = document.createElement('div');
      div.insertAdjacentHTML('beforeend', markerSVG);
      div.className = 'marker';

      let width = 30
      div.style.width = width + 'px';

      let fill = div.getElementsByTagName('path')[0];
      var name,
          coords,
          tspan;
      if (i === 0) {
        name = 'origin';
        coords = origin;
        tspan = div.getElementsByTagName('tspan')[0];
        tspan.innerHTML = 'A';
        fill.setAttribute('fill', '#ff88bb');
      } else {
        name = 'destination';
        coords = destination;
        tspan = div.getElementsByTagName('tspan')[0];
        tspan.innerHTML = 'B';
        fill.setAttribute('fill', '#bbaaff');
      }

      let markerVar = '_' + name + 'Marker';

      if (this[markerVar]) this[markerVar].remove();

      this[markerVar] = new mapboxgl.Marker(div, {
        offset: [-(width / 2), -(600 / 400) * (width)]
      });

      this[markerVar]
        .setLngLat(coords)
        .addTo(map);
    }

    // Prepare routing preferences
    // TODO: extract these from user interface
    let cost = {
      maxdown: this.options.maxdown,
      ideal: this.options.ideal,
      maxup: this.options.maxup,
      origin: origin.slice().reverse(),
      destination: destination.slice().reverse()
    };
    let avoid = [];
    if (this.curbs.checked) {
      avoid.push('curbs');
    }
    if (this.construction.checked) {
      avoid.push('construction');
    }
    cost['avoid'] = avoid.join('|');

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
      let originPath = [that._origin,
                        pathCoords[0]];
      let destPath = [pathCoords[pathCoords.length - 1],
                      that._destination];

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

    if (this._mode === 'routing') {
      // Did the user select start and end locations?
      let originSelected = this._originTypeahead.selected;
      let destSelected = this._destinationTypeahead.selected;
      if ((originSelected !== null) && (destSelected !== null)) {
        this.getRoute(originSelected.center, destSelected.center);
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
