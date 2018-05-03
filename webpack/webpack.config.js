const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const {
  MATCH_JS,
  MATCH_CSS_LESS,
  MATCH_FONTS,
  DEFINE_PLUGIN,
  POSTCSS_LOADER,
} = require('./configUtils');

const isDevelopment = process.env.NODE_ENV !== 'production';
const baseDir = path.resolve(__dirname, '..');

function isVendor({ resource }) {
  return resource && resource.indexOf('node_modules') >= 0 && resource.match(/\.jsx?$/);
}

function makeStyleLoaders() {
  if (isDevelopment) {
    return [
      {
        test: MATCH_CSS_LESS,
        use: [
          'style-loader',
          'css-loader',
          POSTCSS_LOADER,
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      },
    ];
  }

  return [
    {
      test: MATCH_CSS_LESS,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          'css-loader',
          POSTCSS_LOADER,
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      }),
    },
  ];
}

module.exports = {
  devtool: isDevelopment ? 'eval-source-map' : 'source-map',
  entry: path.join(baseDir, 'src/client/index.js'),
  output: {
    path: path.join(baseDir, '/public/js'),
    filename: 'busyapp-[name].[chunkhash].js',
    publicPath: '/js/',
  },
  plugins: [
    DEFINE_PLUGIN,
    new LodashModuleReplacementPlugin({
      collections: true,
      paths: true,
      shorthands: true,
      flattening: true,
    }),
    new CleanWebpackPlugin([path.join(baseDir, '/public')], { allowExternal: true }),
    new CopyWebpackPlugin([
      {
        from: path.join(baseDir, '/assets'),
        to: path.join(baseDir, '/public'),
      },
    ]),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module) {
        return isVendor(module);
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new ExtractTextPlugin({
      allChunks: true,
      filename: '../css/style.[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      title: 'Busy',
      filename: '../index.html',
      template: path.join(baseDir, '/templates/production_index.html'),
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: './statistics.html',
      openAnalyzer: false,
    }),
    new SWPrecacheWebpackPlugin({
      filepath: path.resolve(baseDir, 'public/service-worker.js'),
      stripPrefix: path.resolve(baseDir, 'public'),
    }),
  ],
  module: {
    rules: [
      {
        test: MATCH_JS,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: MATCH_FONTS,
        loader: 'url-loader',
        options: {
          name: '../fonts/[name].[ext]',
          limit: isDevelopment ? 5000000 : 1,
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
          removeComments: false,
        },
      },
    ].concat(makeStyleLoaders()),
  },
};
