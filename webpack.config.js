var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: path.join(__dirname, 'es6'),
  entry: {
    map: './map.js',
    isochrones: './isochrones.js'
  },
  output: {
      path: path.join(__dirname, 'public', 'build'),
      filename: './[name]-bundle.js',
      library: 'App'
  },
  resolve: {
      extensions: ['', '.js'],
      alias: {
          webworkify: 'webworkify-webpack',
          'mapbox-gl$': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl-dev.js')
          // TODO: switch between -dev and non-dev on production vs. not
          // 'mapbox-gl$': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
      }
  },
  node: {
    console: true,
    net: 'empty',
    tls: 'empty'
  },
  module: {
      loaders: [{
          test: /\.json$/,
          loader: 'json-loader'
      }, {
          test: path.join(__dirname, 'es6'),
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            presets: ['es2015'],
            plugins: ['transform-flow-strip-types']
          }
      }, {
          test: /\.js$/,
          include: path.resolve('node_modules/mapbox-gl-shaders/index.js'),
          loader: 'transform/cacheable?brfs'
      }, {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
      }, {
          test: require.resolve('mapbox-gl-geocoder'),
          loader: 'imports?mapboxgl=mapbox-gl'
      }],
      // postLoaders: [{
      //     includes: [
      //       /node_modules\/mapbox-gl-shaders/,
      //       /node_modules\/request/
      //     ],
      //     loader: 'transform',
      //     query: 'brfs'
      // }],
      noParse: /node_modules\/json-schema\/lib\/validate\.js/
  },
  plugins: [
    new webpack.OldWatchingPlugin()
  ]
}
