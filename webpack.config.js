var path = require('path');
module.exports = {
  entry: {
    map: './es6/map.js',
    learnsidewalks: './es6/learnsidewalks.js'
  },
  output: {
    path: __dirname,
    filename: 'public/javascripts/[name]-bundle.js',
    library: 'App',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      { test: path.join(__dirname, 'es6'),
        exclude: /node_modules/,
        loader: 'babel-loader' },
      // json-loader required for mapbox.js' referral to its own package.json
      { test: /\.json$/,
        loader: 'json' },
      { test: /\.css$/,
        loader: 'style-loader!css-loader' },
      { test: /\.png$/,
        loader: 'url-loader?limit=100000' }
    ]
  }
};
