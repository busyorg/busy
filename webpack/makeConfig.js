'use strict';
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');

const DEFAULTS = {
  isDevelopment: process.env.NODE_ENV !== 'production',
  baseDir: path.join(__dirname, '..'),
};

function makePlugins(options) {
  const isDevelopment = options.isDevelopment;

  let plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        NODE_ENV: isDevelopment
          ? JSON.stringify('development')
          : JSON.stringify('production'),
        ENABLE_LOGGER: JSON.stringify(process.env.ENABLE_LOGGER),
        BUSYWS_HOST: JSON.stringify(process.env.BUSYWS_HOST || 'https://ws.busy6.com'),
        IS_BROWSER: JSON.stringify(true),
      },
    }),
    new Visualizer({
      filename: './statistics.html'
    }),
  ];

  if (isDevelopment) {
    plugins = plugins.concat([
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ]);
  } else {
    plugins = plugins.concat([
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        compress: {
          warnings: false,
        }
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
      new ExtractTextPlugin('../css/base.css'),
    ]);
  }

  return plugins;
}

function makeStyleLoaders(options) {
  if (options.isDevelopment) {
    return [
      {
        test: /\.s[ac]ss$/,
        loaders: [
          'style',
          'css?sourceMap',
          'autoprefixer-loader?browsers=last 2 version',
          'sass?sourceMap&sourceMapContents',
        ],
      },
    ];
  }

  return [
    {
      test: /\.s[ac]ss$/,
      loader: ExtractTextPlugin.extract(
        'style-loader',
        'css!autoprefixer-loader?browsers=last 2 version!sass'
      ),
    },
  ];
}

function makeConfig(options) {
  if (!options) options = {};
  _.defaults(options, DEFAULTS);

  const isDevelopment = options.isDevelopment;

  return {
    devtool: isDevelopment ? 'cheap-eval-source-map' : 'source-map',
    entry: (isDevelopment ? [
      'webpack-hot-middleware/client?reload=true',
    ] : []).concat([
      path.join(options.baseDir, 'src/index.js')
    ]),
    output: {
      path: path.join(options.baseDir, '/public/js'),
      filename: 'app.min.js',
      publicPath: '/js/'
    },
    plugins: makePlugins(options),
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
      ].concat(makeStyleLoaders(options)),
    },
  };
}

if (!module.parent) {
  console.log(makeConfig({
    isDevelopment: process.env.NODE_ENV !== 'production',
  }));
}

exports = module.exports = makeConfig;
exports.DEFAULTS = DEFAULTS;
