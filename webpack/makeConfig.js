
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
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
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        NODE_ENV: isDevelopment
          ? JSON.stringify('development')
          : JSON.stringify('production'),
        ENABLE_LOGGER: JSON.stringify(process.env.ENABLE_LOGGER),
        BUSYWS_HOST: JSON.stringify(process.env.BUSYWS_HOST || 'https://ws.busy.org'),
        STEEMCONNECT_IMG_HOST: JSON.stringify(process.env.STEEMCONNECT_IMG_HOST || 'https://img.steemconnect.com'),
        SENTRY_PUBLIC_DSN: isDevelopment
          ? null
          : JSON.stringify(process.env.SENTRY_PUBLIC_DSN),
        STEEMCONNECT_HOST: JSON.stringify(
          process.env.STEEMCONNECT_HOST ||
          'https://dev.steemconnect.com'
        ),
        STEEMCONNECT_REDIRECT_URL: JSON.stringify(
          process.env.STEEMCONNECT_REDIRECT_URL ||
          'http://localhost:3000'
        ),
        WS: JSON.stringify(
          process.env.WS ||
          'wss://steemd.steemit.com'
        ),
        IS_BROWSER: JSON.stringify(true),
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
        test: /\.s?[ac]ss$/,
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
      test: /\.s?[ac]ss$/,
      use: ExtractTextPlugin.extract({
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
      rules: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.(eot|ttf|woff|woff2)(\?.+)?$/,
          loader: 'url-loader',
          options: {
            name: '[name].[hash].[ext]',
            limit: 1,
          },
        },
        {
          test: /\.png$/,
          loader: 'file-loader',
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
