'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, 'src/index.js')
  ],
  output: {
    path: path.join(__dirname, '/js'),
    filename: 'app.min.js',
    publicPath: '/js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        NODE_ENV: JSON.stringify('development'),
        ENABLE_LOGGER: JSON.stringify(process.env.ENABLE_LOGGER),
        BUSYWS_HOST: JSON.stringify(process.env.BUSYWS_HOST || 'http://localhost:3001'),
        IS_BROWSER: JSON.stringify(true),
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /\.json?$/,
        loader: 'json',
      },
      {
        test: /\.s[ac]ss$/,
        loaders: [
          'style',
          'css?sourceMap',
          'autoprefixer-loader?browsers=last 2 version',
          'sass?sourceMap&sourceMapContents',
        ],
      },
    ],
  },
};
