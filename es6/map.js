import mapboxgl from 'mapbox-gl';
import '!style!css!mapbox-gl/dist/mapbox-gl.css';
import Geocoder from 'mapbox-gl-geocoder';
import '!style!css!mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import * as chroma from 'chroma-js';
import $ from 'jquery';
import debounce from 'debounce';

import bufferPoint from './bufferpoint';


function App(mapbox_token) {
  // AccessMap uses a versioned API - which one are we using?
  const api = '/api/v2';

  // Zoom point at which features (e.g. sidewalk) become clickable
  const clickable = 16;

  // -- Styling --
  // Sidewalk color scale
  //
  let colorScale = chroma.scale(['lime', 'yellow', 'red']);

  // Line widths
  const lineWidthStops = [[10, 0.5], [15, 2], [20, 8]];
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

    // Sidewalks
    // TODO: when data-driven styling works for lines, reduce to one sidewalk
    // layer

    // This is a hack to ensure that tile requests are made to the main site's
    // /tiles subdirectory. Using just '/tiles/(...).mvt' results in
    // cross-origin errors
    if (!window.location.origin) {
      window.location.origin = window.location.protocol + "//"
        + window.location.hostname
        + (window.location.port ? ':' + window.location.port : '');
    }
    let tilesUrl = window.location.origin + '/tiles/seattle/{z}/{x}/{y}.mvt';

    map.addSource('seattle', {
      type: 'vector',
      tiles: [tilesUrl],
      attribution: '&copy; AccessMap'
    });
    map.addLayer({
      id: 'sidewalks',
      type: 'line',
      source: 'seattle',
      'source-layer': 'sidewalks',
      paint: {
        'line-color': {
          property: 'grade',
          stops: [
            [0.0, colorScale(0.0).hex()],
            [0.05, colorScale(0.5).hex()],
            [0.08333, colorScale(1.0).hex()]
          ]
        },
        'line-width': {
          stops: lineWidthStops
        }
      },
      layout: {
        'line-cap': 'round'
      }
    });
    // Crossings
    map.addLayer({
      id: 'crossings',
      type: 'line',
      source: 'seattle',
      'source-layer': 'crossings',
      filter: ['==', 'curbramps', true],
      paint: {
        'line-width': {
          stops: lineWidthStops
        }
      },
      minzoom: 14
    });

    //
    // Map controls
    //

    // Geocoder (search by address/POI)
    map.addControl(new Geocoder());
    // Navigation - zooming and orientation
    map.addControl(new mapboxgl.Navigation({position: 'top-left'}));
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

    let geolocator = new mapboxgl.Geolocate({position: 'top-left'});
    map.addControl(geolocator);

    geolocator.on('geolocate', function(position) {
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
    });

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
        layers: ['sidewalks', 'crossings']
      });

      if (!gradePaths.length) {
        return;
      }

      // Select the first feature - how is order decided? Hopefully it's the
      // 'top' layer, i.e. most visible.
      let path = gradePaths[0];

      // Prepare the popup message
      let gradePercent = path.properties.grade * 100;
      let message = '<p>Grade: ' + gradePercent.toFixed(1) + '%';

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
        layers: ['sidewalks', 'crossings']
      });

      map.getCanvas().style.cursor = (gradePaths.length) ? 'pointer': '';
    });
  });

}

module.exports = App;
