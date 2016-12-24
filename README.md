# AccessMap Web App

This is the web app for AccessMapSeattle.com.

Our web app is based on NodeJS and can be set up using a standard npm install. It's currently running on Azure, but the only Azure-specific file is web.config, which shouldn't get in the way of any other deployments.

# Installation

Just run `npm install`

# Setup

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

There is a set_envs.sh_example included.

# Running the website

Make sure the npm modules are installed and environment variables are set
(note: the environment variables may need to be set again if you start a new
terminal).

### Running in development mode

This is the mode you probably want to use - it will automatically rebuild the
web app JavaScript code when the source files are changed.

`npm run dev`

This command just calls two other `npm run`: runs

- `npm run build-dev`: runs `webpack -w`)
- `npm run app`: runs `node server.js`

### Running in production mode

This mode is meant for running the main website, and only really differs from
development mode in that it minifies the client-size JavaScript and expects
a production-level database (`DATABASE_URL` environment variable). Any database
compatible with `sequelize` should work.

There is an `npm run` shortcut that builds the client-side JavaScript and runs
the server:

`NODE_ENV=production npm run prod`

This command just calls two other `npm run`: runs

- `npm run build-prod`: runs `webpack -p`)
- `npm run app`: runs `node server.js`

### Using the systemd service file

*We recommend using a systemd service if you're running on a VM*

This repo includes a systemd service file so that the accessmap server can run
as a daemon (so it's always running, even if the app crashes occasionally).

To use the service file:

#### 1. Copy to the systemd system services directory:

`sudo cp accessmap.service /etc/systemd/system/`

#### 2. Edit placeholder fields

- Edit all of the `Environment` fields
- Edit ExecStart to point to your node binary of choice
- Edit WorkingDirectory to point to the location of the clone of this repo
- Set User to the user you want to run this service. Do *not* use `root`.

#### 3. Register, enable, and run the service

- Register: `sudo systemctl daemon-reload`
- Enable: `sudo systemctl enable accessmap.service`
- Run: `sudo systemctl start accessmap.service`

To check the status of the server, run `sudo systemctl status accessmap`.

The client-side JavaScript will *not* be rebuilt when the daemon restarts, so
if you need to pull an update, you need to first rebuild the JavaScript (using
`npm run build-prod`), then restart the service (`sudo systemctl restart
accessmap`).
