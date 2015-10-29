var path = require('path');
module.exports = {
  entry: './es6/main.js',
  output: {
    path: __dirname,
    filename: 'public/javascripts/bundle.js',
    library: 'App',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      { test: path.join(__dirname, 'es6'),
        exclude: /node_modules/,
        loader: 'babel-loader' }
    ]
  }
};
