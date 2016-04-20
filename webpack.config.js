var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    map: './es6/map.js',
    learnsidewalks: './es6/learnsidewalks.js'
  },
  output: {
    path: __dirname,
    filename: 'public/build/[name]-bundle.js',
    library: 'App',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js', '.jxs'],
    alias: {
      webworkify: 'webworkify-webpack'
    }
  },
  node: {
    console: true,
    fs: 'empty'
  },
  module: {
    loaders: [
      { test: /\.js$/,
        include: path.resolve(__dirname, 'node_modules/mapbox-gl/js/render/painter/use_program.js'),
        loader: 'transform/cacheable?brfs'
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'node_modules/webworkify/index.js'),
        loader: 'worker'
      },
      { test: path.join(__dirname, 'es6'),
        exclude: /node_modules/,
        loader: 'babel-loader' },
      { test: require.resolve('mapbox-gl-geocoder'),
        loader: 'imports?mapboxgl=>require("mapbox-gl")'
      },
      // json-loader required for mapbox.js' referral to its own package.json
      { test: /\.json$/,
        loader: 'json-loader' },
      { test: /\.css$/,
        loader: 'style-loader!css-loader' },
      { test: /\.png$/,
        loader: 'url-loader?limit=100000' }
    ]
  }
};
