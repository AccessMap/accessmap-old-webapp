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

  // GeoJSON vs. vector tile background zoom level switch
  // const zoomChange = 15;
  const zoomChange = 14;

  // -- Styling --
  // Sidewalk color scale
  //
  let colorScale = chroma.scale(['lime', 'yellow', 'red']);

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
      id: 'sidewalks-high',
      type: 'line',
      source: 'seattle',
      'source-layer': 'sidewalks',
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
      id: 'sidewalks-mid',
      type: 'line',
      source: 'seattle',
      'source-layer': 'sidewalks',
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
      id: 'sidewalks-low',
      type: 'line',
      source: 'seattle',
      'source-layer': 'sidewalks',
      paint: {
        'line-color': colorScale(0).hex(),
        'line-width': lineWidth,
      },
      layout: {
        'line-cap': 'round'
      },
      filter: ['<', 'grade', 0.05],
    });

    // Crossings
    map.addLayer({
      id: 'crossings',
      type: 'line',
      source: 'seattle',
      'source-layer': 'crossings',
      filter: ['==', 'curbramps', true],
      paint: {
        'line-width': lineWidth
      },
      minzoom: zoomChange
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
  });

  //
  // Map behavior - panning, clicking, etc
  //
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
    let swLines = ['sidewalks-low', 'sidewalks-mid', 'sidewalks-high'];
    for (let swLine of swLines) {
      map.setPaintProperty(swLine, 'line-width', width);
    }
    map.setPaintProperty('crossings', 'line-width', width);
  });

}

module.exports = App;
