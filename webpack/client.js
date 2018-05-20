const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const CSSExtract = require('mini-css-extract-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackBar = require('webpackbar');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const paths = require('../scripts/paths');

const {
  CONTENT_PORT,
  MATCH_JS,
  MATCH_CSS_LESS,
  MATCH_FONTS,
  DEFINE_PLUGIN,
  POSTCSS_LOADER,
} = require('./configUtils');

module.exports = function createConfig(env = 'dev') {
  const IS_DEV = env === 'dev';
  const IS_PROD = !IS_DEV;

  const appPath = IS_DEV ? paths.build : paths.buildPublic;

  const config = {
    mode: IS_DEV ? 'development' : 'production',
    entry: [paths.client],
    output: {
      path: appPath,
      filename: IS_DEV ? 'bundle.js' : 'bundle-[name].[chunkhash].js',
      publicPath: IS_DEV ? `http://localhost:${CONTENT_PORT}/` : '/',
    },
    context: process.cwd(),
    plugins: [
      DEFINE_PLUGIN,
      new AssetsPlugin({
        path: paths.build,
        filename: 'assets.json',
      }),
      new WebpackBar({
        name: 'client',
        color: '#f56be2',
      }),
    ],
    module: {
      rules: [
        {
          test: MATCH_JS,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: MATCH_FONTS,
          loader: 'url-loader',
        },
        {
          test: MATCH_CSS_LESS,
          use: [
            IS_PROD ? CSSExtract.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                minimize: !IS_DEV,
              },
            },
            POSTCSS_LOADER,
            {
              loader: 'less-loader',
              options: {
                javascriptEnabled: true,
              },
            },
          ],
        },
      ],
    },
  };

  if (IS_DEV) {
    config.entry = ['webpack-dev-server/client', 'webpack/hot/dev-server', ...config.entry];
    config.plugins = [...config.plugins, new webpack.HotModuleReplacementPlugin()];
  }

  if (IS_PROD) {
    config.plugins = [
      ...config.plugins,
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new LodashModuleReplacementPlugin({
        collections: true,
        paths: true,
        shorthands: true,
        flattening: true,
      }),
      new CSSExtract({
        filename: '[name].[contenthash].css',
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: './statistics.html',
        openAnalyzer: false,
      }),
      new SWPrecacheWebpackPlugin({
        filepath: paths.sw,
        stripPrefix: appPath,
      }),
    ];
    config.optimization = {
      splitChunks: {
        chunks: 'initial',
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        cacheGroups: {
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
          },
          main: {
            name: 'main',
            minChunks: 2,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
      runtimeChunk: {
        name: 'manifest',
      },
    };
  }

  return config;
};
