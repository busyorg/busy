const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const DEFAULTS = {
  isDevelopment: process.env.NODE_ENV !== 'production',
  baseDir: path.resolve(__dirname, '..'),
};

function isVendor({ resource }) {
  return resource &&
    resource.indexOf('node_modules') >= 0 &&
    resource.match(/\.jsx?$/);
}

function makePlugins(options) {
  const isDevelopment = options.isDevelopment;

  let plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        NODE_ENV: isDevelopment ? JSON.stringify('development') : JSON.stringify('production'),
        ENABLE_LOGGER: JSON.stringify(process.env.ENABLE_LOGGER),
        BUSYWS_HOST: JSON.stringify(process.env.BUSYWS_HOST || 'https://ws.busy.org'),
        STEEMCONNECT_IMG_HOST: JSON.stringify(process.env.STEEMCONNECT_IMG_HOST || 'https://img.steemconnect.com'),
        SENTRY_PUBLIC_DSN: isDevelopment ? null : JSON.stringify(process.env.SENTRY_PUBLIC_DSN),
        STEEMCONNECT_HOST: JSON.stringify(process.env.STEEMCONNECT_HOST || 'https://steemconnect.com'),
        STEEMCONNECT_REDIRECT_URL: JSON.stringify(process.env.STEEMCONNECT_REDIRECT_URL || 'https://busy.org'),
        WS: JSON.stringify(process.env.WS || 'wss://steemd-int.steemit.com'),
        IS_BROWSER: JSON.stringify(true),
        PUSHPAD_PROJECT_ID: process.env.PUSHPAD_PROJECT_ID,
        BUSYPUSH_ENDPOINT: JSON.stringify(process.env.BUSYPUSH_ENDPOINT || 'https://busy-push.herokuapp.com'),
      },
    }),
    new LodashModuleReplacementPlugin({ collections: true, paths: true, shorthands: true }),
    new Visualizer({
      filename: './statistics.html'
    }),
  ];

  if (isDevelopment) {
    plugins = plugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    ]);
  } else {
    plugins = plugins.concat([
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks(module) {
          // this assumes your vendor imports exist in the node_modules directory
          return isVendor(module);
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
      new ExtractTextPlugin({
        filename: '../css/style.[contenthash].css',
      }),
      new HtmlWebpackPlugin({
        title: 'Busy',
        filename: '../index.html',
        template: path.join(options.baseDir, '/templates/index.html'),
      }),
    ]);
  }

  return plugins;
}

function makeStyleLoaders(options) {
  if (options.isDevelopment) {
    return [
      {
        test: /\.scss|.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1,
            },
          },
          {
            loader: 'autoprefixer-loader',
            options: {
              browsers: 'last 2 version',
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sourceMapContents: true,
            },
          },
        ],
      },
    ];
  }

  return [
    {
      test: /\.scss|.css$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'autoprefixer-loader',
            options: {
              browsers: 'last 2 version',
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      }),
    },
  ];
}

function makeConfig(options = {}) {
  _.defaults(options, DEFAULTS);

  const isDevelopment = options.isDevelopment;

  return {
    devtool: isDevelopment ? 'eval-source-map' : 'source-map',
    entry: {
      main: (isDevelopment ? [
        'webpack-hot-middleware/client?reload=true',
        'react-hot-loader/patch',
        // activate HMR for React
        'webpack/hot/only-dev-server',
        // bundle the client for hot reloading
        // only- means to only hot reload for successful updates
      ] : []).concat([
        path.join(options.baseDir, 'src/index.js')]
        ),
    },
    output: {
      path: path.join(options.baseDir, '/public/js'),
      filename: options.isDevelopment ? 'busyapp-[name].js' : 'busyapp-[name].[chunkhash].js',
      publicPath: '/js/'
    },
    plugins: makePlugins(options),
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          use: (options.isDevelopment ? [{ loader: 'react-hot-loader/webpack' }] : []).concat(
            [
              {
                loader: 'babel-loader',
              },
            ]
          )
        },
        {
          test: /\.(eot|ttf|woff|woff2)(\?.+)?$/,
          loader: 'url-loader',
          options: {
            name: '../fonts/[name].[ext]',
            // load fonts through data-url in development
            limit: options.isDevelopment ? 5000000 : 1,
          },
        },
        {
          test: /\.png$/,
          loader: 'file-loader',
        },
        {
          test: /\.html$/,
          loader: 'html-loader',
          options: {
            removeComments: false
          }
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
