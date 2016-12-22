import mapboxgl from 'mapbox-gl';
import '!style!css!mapbox-gl/dist/mapbox-gl.css';
import * as chroma from 'chroma-js';

import bufferPoint from './bufferpoint';
import AccessMapRoutingControl from './AccessMapRoutingControl';
import AccessMapGradeControl from './AccessMapGradeControl';


function App(mapbox_token, routing) {
  // Zoom point at which map starts by default
  const zoomStart = 15;
  // Zoom point at which features (e.g. sidewalk) become clickable
  const clickable = 15;

  //
  // Styling
  //

  // Sidewalk color scale
  let colorScale = chroma.scale(['lime', 'yellow', 'red']).mode('lab');

  // Map initialization
  mapboxgl.accessToken = mapbox_token;

  let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v8',
    center: [-122.333592, 47.605628],
    zoom: zoomStart
  });

  map.on('load', function() {
    let bounds = map.getBounds().toArray();
    let bbox = bounds[0].concat(bounds[1]).join(',');

    // This is a hack to ensure that tile requests are made to the main site's
    // /tiles subdirectory. Using just '/tiles/(...).mvt' results in
    // cross-origin errors
    if (!window.location.origin) {
      window.location.origin = window.location.protocol + "//"
        + window.location.hostname
        + (window.location.port ? ':' + window.location.port : '');
    }
    let tilesUrl = window.location.origin + '/tiles/seattle/{z}/{x}/{y}.pbf';
    let liveUrl = window.location.origin + '/tiles/live/{z}/{x}/{y}.pbf';

    //
    // Data sources - used by layers to draw data
    //

    // Custom-rolled vector tiles
    map.addSource('seattle', {
      type: 'vector',
      tiles: [tilesUrl],
      attribution: '&copy; AccessMap'
    });

    map.addSource('live', {
      type: 'vector',
      tiles: [liveUrl]
    });

    // live
    // FIXME: tried using 'symbol' layer with roadblock-15 sprite, but it
    //        wouldn't render (though other symbols would)
    map.addLayer({
      id: 'construction-outline',
      type: 'circle',
      source: 'live',
      'source-layer': 'construction',
      paint: {
        'circle-color': '#000000',
        'circle-radius': {
          stops: [[10, 2], [15, 8], [20, 22]]
        },
        'circle-opacity': {
          stops: [[13, 0.3], [zoomStart, 0.5], [20, 1]]
        }
      },
      layout: {
        visibility: {
          stops: [[0, 'none'], [12, 'visible']]
        }
      }
    });

    map.addLayer({
      id: 'construction-fill',
      type: 'circle',
      source: 'live',
      'source-layer': 'construction',
      paint: {
        'circle-color': '#ffbb00',
        'circle-radius': {
          stops: [[10, 1], [15, 6], [20, 19]]
        }
      },
      layout: {
        visibility: {
          stops: [[0, 'none'], [12, 'visible']]
        }
      }
    });

    //
    // Layers - draw lines, dots, etc on map from source data
    //

    // Crossings
    map.addLayer({
      id: 'crossings-noramps',
      type: 'line',
      source: 'seattle',
      'source-layer': 'crossings',
      filter: ['!=', 'curbramps', true],
      paint: {
        'line-color': '#000000',
        'line-width': {
          stops: [[12, 0.5], [16, 2], [20, 20]]
        },
        'line-opacity': {
          stops: [[13, 0.0], [zoomStart, 0.05], [20, 0.15]]
        }
      },
      layout: {
        'line-cap': 'round'
      }
    }, 'bridge-path-bg');

    map.addLayer({
      id: 'crossings-ramps',
      type: 'line',
      source: 'seattle',
      'source-layer': 'crossings',
      filter: ['==', 'curbramps', true],
      paint: {
        'line-color': '#000000',
        'line-width': {
          stops: [[12, 0.5], [16, 2], [20, 20]]
        },
        'line-opacity': {
          stops: [[13, 0.0], [zoomStart, 0.3], [20, 0.3]]
        },
      },
      layout: {
        'line-cap': 'round'
      },
      minzoom: 14
    }, 'bridge-path-bg');

    // Sidewalks
    map.addLayer({
      id: 'sidewalks-outline',
      type: 'line',
      source: 'seattle',
      'source-layer': 'sidewalks',
      paint: {
        'line-color': '#000000',
        'line-width': {
          stops: [[12, 1], [zoomStart, 1.5], [20, 2]]
        },
        'line-opacity': {
          stops: [[13, 0.0], [zoomStart, 0.1], [20, 0.2]]
        },
        'line-gap-width': {
          stops: [[12, 0.5], [16, 3], [20, 30]]
        }
      },
      layout: {
        'line-cap': 'round'
      }
    }, 'bridge-path-bg');

    map.addLayer({
      id: 'sidewalks',
      type: 'line',
      source: 'seattle',
      'source-layer': 'sidewalks',
      paint: {
        'line-color': {
          colorSpace: 'lab',
          property: 'grade',
          stops: [
            [-0.08333, colorScale(1.0).hex()],
            [-0.05, colorScale(0.5).hex()],
            [0.0, colorScale(0.0).hex()],
            [0.05, colorScale(0.5).hex()],
            [0.08333, colorScale(1.0).hex()]
          ]
        },
        'line-width': {
          stops: [[12, 0.5], [16, 3], [20, 30]]
        },
        'line-opacity': {
          stops: [[8, 0.3], [zoomStart, 0.7], [20, 0.5]]
        }
      },
      layout: {
        'line-cap': 'round'
      }
    }, 'bridge-path-bg');

    //
    // Map controls
    //

    // Navigation - zooming and orientation
    map.addControl(new mapboxgl.NavigationControl());
    // Geolocation (surprising amount of boilerplate)
    map.addSource('geolocate', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });
    map.addSource('geolocate-error', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    map.addLayer({
      id: 'geolocate-error',
      source: 'geolocate-error',
      type: 'fill',
      paint: {
        'fill-color': '#007cbf',
        'fill-opacity': 0.2
      }
    });
    map.addLayer({
      id: 'geolocate-outline',
      source: 'geolocate',
      type: 'circle',
      paint: {
        'circle-radius': 10,
        'circle-color': '#ffffff'
      }
    });
    map.addLayer({
      id: 'geolocate-center',
      source: 'geolocate',
      type: 'circle',
      paint: {
        'circle-radius': 8,
        'circle-color': '#007cbf'
      }

    });

    let geolocator = new mapboxgl.GeolocateControl({
      position: 'top-left'
    });
    map.addControl(geolocator);

    function drawGeolocation(position) {
      let coords = [position.coords.longitude, position.coords.latitude];
      let location = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: coords
          }
        }]
      };
      map.getSource('geolocate').setData(location);

      // TODO: Replace bufferPoint with turf-buffer once it supports buffering
      // a lat-lon point a distance in meters - currently makes an oval due to
      // projection: https://github.com/Turfjs/turf-buffer/pull/33
      let buffered = bufferPoint(location.features[0].geometry,
                                 position.coords.accuracy);

      let errorCircle = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: buffered
        }]
      };

      map.getSource('geolocate-error').setData(errorCircle);
    }

    geolocator.on('geolocate', drawGeolocation);

    //
    // Map events - catch clicks, etc
    //
    map.on('click', function(e) {
      // Only allow clicks at high zoom levels
      if (map.getZoom() < clickable) {
        return;
      }

      // TODO: should probably use switch/case after detecting layers

      // If construction is clicked, show that
      let construction = map.queryRenderedFeatures(e.point, {
        layers: ['construction-outline']
      });

      if (construction.length) {
        let selected = construction[0];
        let props = selected.properties;
        let closed = props.closed === 'Y' ? 'Yes' : 'No';

        let permitNumber = props.permit_number;
        let permitsUrl = 'https://data.seattle.gov/resource/hyub-wfuv.json';
        permitsUrl += '?permit_no_num=' + permitNumber;
        let permitsMarkup = '<a href="' + permitsUrl + '">' + permitNumber + '</a>';

        let message = '<h4 style="text-align: center;"><b>Construction</b></h4>';
        message += '<h4><b>Sidewalk closed:</b> ' + closed + '</h4>';
        message += '<h4><b>Address:</b> ' + props.address + '</h4>';
        message += '<h4><b>Started:</b> ' + props.start_date + '</h4>';
        message += '<h4><b>Ends:</b> ' + props.end_date + '</h4>';
        message += '<h4><b>SDOT Permit:</b> ' + permitsMarkup + '</h4>';

        let popup = new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(message)
          .addTo(map);

        return;
      }

      // Display sidewalk/crossing info
      let sidewalks = map.queryRenderedFeatures(e.point, {
        layers: ['sidewalks']
      });

      if (sidewalks.length) {
        let path = sidewalks[0];

        let gradePercent = Math.abs((path.properties.grade * 100).toFixed(1));
        let message = '<h4 style="text-align: center;"><b>Sidewalk</b></h4>';
        message += '<h4><b>Steepness:</b> ' + gradePercent + '%</h4>';

        let popup = new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(message)
          .addTo(map);
      }

      let crossings = map.queryRenderedFeatures(e.point, {
        layers: ['crossings-ramps', 'crossings-noramps']
      });

      if (crossings.length) {
        let path = crossings[0];

        let props = path.properties;
        let gradePercent = Math.abs((props.grade * 100).toFixed(1));
        let curbRamps = props.curbramps ? 'Yes' : 'No';

        let message = '<h4 style="text-align: center;"><b>Crossing</b></h4>';
        message += '<h4><b>Steepness:</b> ' + gradePercent + '%</h4>';
        message += '<h4><b>Curbramps:</b> ' + curbRamps + '</h4>';

        let popup = new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(message)
          .addTo(map);
      }
    });

    // Make cursor into 'clicker' pointer when hovering over zoomStart elements
    map.on('mousemove', function(e) {
      // Only allow clicks at high zoom levels
      if (map.getZoom() < clickable) {
        return;
      }

      let clickables = map.queryRenderedFeatures(e.point, {
        layers: ['sidewalks', 'crossings-ramps', 'crossings-noramps',
                 'construction-outline']
      });

      map.getCanvas().style.cursor = (clickables.length) ? 'pointer': '';
    });

  });

  let gradeControl = new AccessMapGradeControl();
  map.addControl(gradeControl, 'bottom-right');

  if (routing) {
    let routingControl = new AccessMapRoutingControl({
      accessToken: mapbox_token,
      api: 'api/v2/route.json'
    });
    map.addControl(routingControl);
    map.on('load', function() {
      routingControl.getRoute([-122.336158, 47.606637],
                              [-122.330572, 47.603704]);
    });
  }
}

module.exports = App;
