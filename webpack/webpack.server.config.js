const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { MATCH_JS, MATCH_CSS_LESS, DEFINE_PLUGIN } = require('./configUtils');

const baseDir = path.resolve(__dirname, '..');

module.exports = {
  entry: path.resolve(baseDir, './src/server/index.js'),
  output: {
    filename: 'busy.server.js',
  },
  target: 'node',
  externals: fs
    .readdirSync(path.resolve(baseDir, 'node_modules'))
    .map(module => ({ [module]: `commonjs ${module}` }))
    .reduce((a, b) => Object.assign({}, a, b), {}),
  node: {
    __filename: true,
    __dirname: true,
  },
  module: {
    loaders: [
      {
        test: MATCH_JS,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react', 'stage-2'],
            plugins: ['transform-decorators-legacy', 'transform-runtime', 'dynamic-import-node'],
            cacheDirectory: true,
          },
        },
      },
    ],
  },
  plugins: [
    DEFINE_PLUGIN,
    new webpack.NormalModuleReplacementPlugin(MATCH_CSS_LESS, 'identity-obj-proxy'),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
};
