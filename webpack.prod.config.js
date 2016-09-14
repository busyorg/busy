'use strict';

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: [
        path.join(__dirname, 'src/index.js')
    ],
    output: {
        path: path.join(__dirname, '/public/js'),
        filename: 'app.min.js',
        publicPath: '/js'
    },
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        compress: {
          warnings: false,
        }
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          // This has effect on the react lib size
          'NODE_ENV': JSON.stringify('production'),
        },
      }),
      new ExtractTextPlugin('../css/base.css'),
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
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css!autoprefixer-loader?browsers=last 2 version!sass'
        ),
      },
    ],
  },
};
