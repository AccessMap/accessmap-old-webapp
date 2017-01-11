// Buffers a lat-lon GeoJSON point geometry a given distance in meters

export default function bufferPoint(point, distance) {
  // Given GeoJSON Point geometry in lon-lat, create circular buffer
  // at a given distance in meters
  let coords = point.coordinates;

  function destinationPoint(latdeg, lngdeg, distInMeter, angleDeg) {
    function radians(degrees) {
      return degrees * Math.PI / 180;
    }
    function degrees(radians) {
      return radians * 180 / Math.PI;
    }
    function earthRadius(lat) {
        var An = 6378137.0 * 6378137.0 * Math.cos(lat);
        var Bn = 6356752.3 * 6356752.3 * Math.sin(lat);
        var Ad = 6378137.0 * Math.cos(lat);
        var Bd = 6356752.3 * Math.sin(lat);

        return Math.sqrt((An * An + Bn * Bn) / (Ad * Ad + Bd * Bd));
    }
    // Convert to radians
  	var θ = radians(angleDeg);
  	var δ = Number(distInMeter / earthRadius(latdeg));

    // Covert lat and lon to radians
  	var φ1 = radians(latdeg);
  	var λ1 = radians(lngdeg);

  	var φ2 = Math.asin(
  		Math.sin(φ1) * Math.cos(δ) +
  		Math.cos(φ1) * Math.sin(δ) * Math.cos(θ));
  	var λ2 = λ1 + Math.atan2(
  		Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
  		Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2));

  	// Normalise to -180..+180°.
  	λ2 = (λ2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;

  	return [degrees(φ2), degrees(λ2)];
  };

  let n = 100;
  let newCoords = [];
  for (let k = 1; k <= n; k++) {
    let angle = 360 * (k / n);
    let latlon = destinationPoint(coords[1],
                                  coords[0],
                                  distance,
                                  angle);
    newCoords.push([latlon[1], latlon[0]]);
  }

  let circle = {
    type: 'Polygon',
    coordinates: [newCoords]
  }

  return circle
}
