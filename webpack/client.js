const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const CSSExtract = require('mini-css-extract-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackBar = require('webpackbar');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const paths = require('../scripts/paths');

const {
  MATCH_JS,
  MATCH_CSS_LESS,
  MATCH_FONTS,
  DEFINE_PLUGIN,
  POSTCSS_LOADER,
} = require('./configUtils');

module.exports = function createConfig(env = 'dev') {
  const IS_DEV = env === 'dev';
  const PORT = process.env.PORT || 3000;

  const appPath = IS_DEV ? paths.build : paths.buildPublic;

  const config = {
    mode: IS_DEV ? 'development' : 'production',
    entry: [paths.client],
    output: {
      path: appPath,
      filename: IS_DEV ? 'bundle.js' : 'bundle-[name].[chunkhash].js',
      publicPath: IS_DEV ? `http://localhost:${PORT + 1}/` : '/',
    },
    context: process.cwd(),
    plugins: [
      DEFINE_PLUGIN,
      new AssetsPlugin({
        path: paths.build,
        filename: 'assets.json',
      }),
      new CSSExtract({
        filename: '[name].css',
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
            CSSExtract.loader,
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
      ],
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        name: true,
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
          main: {
            chunks: 'all',
            minChunks: 2,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
      runtimeChunk: {
        name: 'manifest',
      },
    },
    devServer: {
      compress: true,
      noInfo: true,
      historyApiFallback: {
        disableDotRule: true,
      },
    },
  };

  if (!IS_DEV) {
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
  }

  return config;
};
