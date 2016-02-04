// TODO: Use OO addTo method
// Request stops in an area
// Process the request data
// Add the markers to the map
import $ from 'jquery';


function requestStopsUpdate(layerGroup, map) {
  // Generates a layerGroup to add to / remove from map
  let OBA_URL = 'http://api.pugetsound.onebusaway.org/api/where/stops-for-location.json';
  let RADIUS = 800;
  let latlng = map.getCenter();
  let centerLat = latlng.lat;
  let centerLon = latlng.lng;

  let bounds = map.getBounds();
  let latlonspan = [Math.abs(bounds.getNorth() - bounds.getSouth()), Math.abs(bounds.getWest() - bounds.getEast())];

  let busIcon = L.icon({
    iconUrl: '../images/bus.png',
    iconSize: [30, 30],
    iconAnchor: [10, 0]
  });

  function requestStops(callback) {
    $.ajax({
      url: OBA_URL,
      dataType: 'jsonp',
      data: {
        key: '8e4402d8-6f8d-49fe-8e7c-d3d38098b4ef',
        lat: centerLat,
        lon: centerLon,
        latSpan: latlonspan[0],
        lonSpan: latlonspan[1],
        maxCount: 300
      },
      success: callback
    });
  }

  function addMarkers(request_data) {
    let data = request_data.data.list;
    // Destroy the layers in stopLayerGroup
    layerGroup.clearLayers();
    // Create the new ones
    for (var i = 0; i < data.length; i++) {
      let row = data[i];
      // Turn it into geoJSON
      let geoJSON = {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [row.lon, row.lat]
        },
        'properties': {
          'name': row.name,
          'direction': row.direction,
          'id': row.id,
          'routeIds': row.routeIds
        }
      };
      let marker = L.geoJson(geoJSON, {
        pointToLayer: function(feature, latlng) {
          return L.marker(latlng, {icon: busIcon});
        }
      });

      //Display info when user clicks on the bus stop
      let popup = L.popup().setContent("<b>Bus Stop at " + row.name + "</b>");
      marker.bindPopup(popup);

      layerGroup.addLayer(marker);
    }
  }

  requestStops(addMarkers);
}


export default requestStopsUpdate
