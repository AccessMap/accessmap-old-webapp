AccessMap Web App
=================

This is the web app for AccessMap.com

It's currently running on Azure, but the only Azure-specific file is web.config, which shouldn't get in the way of any other deployments.

For the map to work correctly, these environment variables need to be set:

| ENV variable | Description |
| --- | --- |
| MAPBOX_TOKEN | The mapbox token for map tiles of sidewalks color-coded by steepness |
| SIDEWALKS_URL | The JSON endpoint (URL) that sends GeoJSON for sidewalks, curb ramps, etc - the AccessMap API |
