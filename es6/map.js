// Leaflet (upon which mapbox.js is based) forces a global window.L
// variable, leading to all kinds of problems for modular development.
// As a result, none of the modules on npm work due to clobbering L.

import $ from 'jquery';
import mapboxgl from 'mapbox-gl';
import '!style!css!mapbox-gl/dist/mapbox-gl.css';
import Geocoder from 'mapbox-gl-geocoder';
import '!style!css!mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

function App(api_url, mapbox_token) {
  // AccessMap uses a versioned API - which one are we using?
  const api_version = 'v2';
  const api = api_url.replace(/\/?$/, '/') + api_version;

  // GeoJSON vs. vector tile background zoom level switch
  const zoomChange = 15;

  // Map initialization
  mapboxgl.accessToken = mapbox_token;

  let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v8',
    center: [-122.308690, 47.652810],
    zoom: zoomChange
  });

  map.on('load', function() {
    let bounds = map.getBounds().toArray();
    let bbox = bounds[0].concat(bounds[1]).join(',');

    map.addSource('sidewalks', {
      type: 'geojson',
      data: api + '/sidewalks.geojson' + '?bbox=' + bbox
    })
    map.addLayer({
      id: 'sidewalks',
      type: 'line',
      source: 'sidewalks'
    });

    map.addSource('crossings', {
      type: 'geojson',
      data: api + '/crossings.geojson' + '?bbox=' + bbox
    })
    map.addLayer({
      id: 'crossings',
      type: 'line',
      source: 'crossings'
    });

  });


  // Map behavior - panning, clicking, etc
  map.on('moveend', function() {
    if (map.getZoom() >= zoomChange) {
      let bounds = map.getBounds().toArray();
      let bbox = bounds[0].concat(bounds[1]).join(',');
      map.getSource('sidewalks').setData(api + '/sidewalks.geojson' + '?bbox=' + bbox);
      map.getSource('crossings').setData(api + '/crossings.geojson' + '?bbox=' + bbox);
    }
  });

  // Swap GeoJSON overlay for pre-colored vector tiles when zoomed in
  map.on('zoom', function(data) {
    if (map.getZoom() >= zoomChange) {
      // Hide the overlays, show the vector tiles
      // TODO: add the vector tiles
      map.setLayoutProperty('sidewalks', 'visibility', 'visible');
      map.setLayoutProperty('crossings', 'visibility', 'visible');
    } else {
      // Hide the vector tiles, show the overlays
      // TODO: remove the vector tiles
      map.setLayoutProperty('sidewalks', 'visibility', 'none');
      map.setLayoutProperty('crossings', 'visibility', 'none');
    }
  });

  // Map controls
  map.addControl(new Geocoder());
  map.addControl(new mapboxgl.Navigation({position: 'top-left'}));
}

module.exports = App;
