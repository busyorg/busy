const AssetsPlugin = require('assets-webpack-plugin');
const WebpackBar = require('webpackbar');
const path = require('path');

const {
  MATCH_JS,
  MATCH_CSS_LESS,
  MATCH_FONTS,
  DEFINE_PLUGIN,
  POSTCSS_LOADER,
} = require('./configUtils');

const baseDir = path.resolve(__dirname, '..');

const buildDir = path.resolve(baseDir, './build');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: [
    require.resolve('webpack-dev-server/client'),
    path.resolve(baseDir, './src/client/index.js'),
  ],
  output: {
    path: buildDir,
    filename: 'bundle.js',
    publicPath: 'http://localhost:3001/',
  },
  context: process.cwd(),
  plugins: [
    DEFINE_PLUGIN,
    new AssetsPlugin({
      path: buildDir,
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
    ],
  },
  devServer: {
    compress: true,
    noInfo: true,
    historyApiFallback: {
      disableDotRule: true,
    },
  },
};
