import mapboxgl from 'mapbox-gl';
import '!style!css!mapbox-gl/dist/mapbox-gl.css';
import Geocoder from 'mapbox-gl-geocoder';
import * as chroma from 'chroma-js';
import $ from 'jquery';

import bufferPoint from './bufferpoint';
import routingDemo from './routing';


function App(mapbox_token, routing) {
  // Zoom point at which features (e.g. sidewalk) become clickable
  const clickable = 16;

  //
  // Styling
  //

  // Sidewalk color scale
  let colorScale = chroma.scale(['lime', 'yellow', 'red']);

  // Set the legend scale
  let gradientHTML = '';
  for (let i = 0; i <= 100; i++) {
    gradientHTML += '<span class="grad-step" style="background-color:';
    gradientHTML += colorScale(i / 100.);
    gradientHTML += '"></span>'
  }
  $('.gradient').append(gradientHTML);

  // Map initialization
  mapboxgl.accessToken = mapbox_token;

  let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v8',
    center: [-122.333592, 47.605628],
    zoom: 15
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
    let tilesUrl = window.location.origin + '/tiles/seattle/{z}/{x}/{y}.mvt';

    //
    // Data sources - used by layers to draw data
    //

    // Custom-rolled vector tiles
    map.addSource('seattle', {
      type: 'vector',
      tiles: [tilesUrl],
      attribution: '&copy; AccessMap'
    });

    //
    // Layers - draw lines, dots, etc on map from source data
    //

    // Crossings
    map.addLayer({
      id: 'crossings-outline',
      type: 'line',
      source: 'seattle',
      'source-layer': 'crossings',
//      filter: ['==', 'curbramps', true],
      paint: {
        'line-color': '#000000',
        'line-width': {
          stops: [[12, 1.5], [clickable, 5], [20, 12]]
        },
        'line-opacity': {
          stops: [[13, 0.0], [clickable, 0.1], [20, 0.2]]
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
        'line-color': '#222222',
        'line-width': {
          stops: [[12, 0.3], [clickable, 1], [20, 6]]
        },
        'line-opacity': 0.7
      },
      minzoom: 14
    }, 'bridge-path-bg');

    map.addLayer({
      id: 'crossings-notramps',
      type: 'line',
      source: 'seattle',
      'source-layer': 'crossings',
      filter: ['==', 'curbramps', false],
      paint: {
       'line-color': '#222222',
        'line-width': {
          stops: [[12, 0.3], [clickable, 1], [20, 6]]
        },
        'line-opacity': 0.3
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
          stops: [[12, 1.5], [clickable, 5], [20, 12]]
        },
        'line-opacity': {
          stops: [[13, 0.0], [clickable, 0.1], [20, 0.2]]
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
          type: 'exponential',
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
          stops: [[12, 0.5], [clickable, 2], [20, 8]]
        },
        'line-opacity': {
          stops: [[12, 0.5], [clickable, 1.0], [20, 1.0]]
        }
      },
      layout: {
        'line-cap': 'round'
      }
    }, 'bridge-path-bg');

    //
    // Map controls
    //

    // Geocoder (search by address/POI)
//    map.addControl(new Geocoder());
    // Navigation - zooming and orientation
    map.addControl(new mapboxgl.NavigationControl({position: 'top-left'}));
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

    // Default map state is an initial geolocation attempt
    if (!routing) {
      window.navigator.geolocation.getCurrentPosition(function(d) {
        drawGeolocation(d);
        map.flyTo({
          center: [d.coords.longitude, d.coords.latitude],
          zoom: 17,
          bearing: 0,
          pitch: 0
        });
      });
    }

    //
    // Map events - catch clicks, etc
    //
    map.on('click', function(e) {
      // Only allow clicks at high zoom levels
      if (map.getZoom() < clickable) {
        return;
      }

      // Display sidewalk/crossing info
      let gradePaths = map.queryRenderedFeatures(e.point, {
        layers: ['sidewalks', 'crossings-ramps', 'crossings-notramps']
      });

      if (!gradePaths.length) {
        return;_
      }

      // Select the first feature - how is order decided? Hopefully it's the
      // 'top' layer, i.e. most visible.
      let path = gradePaths[0];

      // Prepare the popup message
      let gradePercent = path.properties.grade * 100;
      let message = '<h4><b>Grade:</b> ' + gradePercent.toFixed(1) + '%</h4>';

      let popup = new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(message)
        .addTo(map);
    });

    // Make cursor into 'clicker' pointer when hovering over clickable elements
    map.on('mousemove', function(e) {
      // Only allow clicks at high zoom levels
      if (map.getZoom() < clickable) {
        return;
      }

      let gradePaths = map.queryRenderedFeatures(e.point, {
        layers: ['sidewalks', 'crossings-ramps', 'crossings-notramps']
      });

      map.getCanvas().style.cursor = (gradePaths.length) ? 'pointer': '';
    });

  });

  if (routing) {
    routingDemo(map, colorScale);
  }

}

module.exports = App;
