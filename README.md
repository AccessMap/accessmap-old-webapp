AccessMap Web App
=================

This is the web app for AccessMap.com.

Our web app is based on NodeJS and can be set up using a standard npm install. It's currently running on Azure, but the only Azure-specific file is web.config, which shouldn't get in the way of any other deployments.

For the map to work correctly, these environment variables need to be set:

| ENV variable | Description |
| --- | --- |
| `MAPBOX_TOKEN` | The Mapbox user token  |
| `TILES_URL` | The vector tiles endpoint for serving sidewalk and crossing vector tiles. AccessMap uses the tilesplash server (see the accessmap-vt repo).

For the production website, these need to be set:
| ENV variable | Description |
| --- | --- |
| `API_URL` | The JSON endpoint (URL) that sends GeoJSON for sidewalks, curb ramps, etc - the AccessMap API |
| `DATABASE_URL` | A database connection string for storing user accounts/sessions - not required for development

There is a set_envs.sh_example included. To run the server in a dev environment, copy it to set_envs.sh, enter your information, and run `source set_envs.sh`. Then run `npm start` or `node server.js`.

To run in production, use the systemd service file example. Edit all fields
that have &lt; &gt; to match the set_envs.sh example above. You will need to
set an additional environment variable: `DATABASE_URL`. This should be a
connection string (ideally postgres) to a database that can store user sessions
(compatible with Sequelize).
