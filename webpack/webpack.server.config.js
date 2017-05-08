const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const isDevelopment = process.env.NODE_ENV !== 'production';
const baseDir = path.resolve(__dirname, '..');
module.exports = {

  entry: path.resolve(baseDir, './server/index.js'),

  output: {
    filename: 'busy.server.js'
  },

  target: 'node',

  // keep node_module paths out of the bundle
  externals: fs.readdirSync(path.resolve(baseDir, 'node_modules'))
    .concat([
      'react-dom/server', 'react/addons',
    ]).reduce((ext, mod) => {
      ext[mod] = `commonjs ${mod}`; // eslint-disable-line
      return ext;
    }, {}),

  node: {
    __filename: true,
    __dirname: true
  },
  watch: isDevelopment,

  module: {
    loaders: [
      {
        test: /\.(eot|ttf|woff|woff2)(\?.+)?$/,
        loader: 'url-loader',
        options: {
          name: '../fonts/[name].[ext]',
          limit: isDevelopment ? 500000 : 1,
        },
      },
      {
        test: /\.png$/,
        loader: 'file-loader',
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react', 'stage-2'],
            plugins: ['transform-decorators-legacy', 'transform-runtime'],
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.scss|.css$/,
        use: ['isomorphic-style-loader', 'css-loader', 'autoprefixer-loader', 'sass-loader'],
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        BUSYWS_HOST: JSON.stringify(process.env.BUSYWS_HOST || 'https://ws.busy.org'),
        STEEMCONNECT_IMG_HOST: JSON.stringify(process.env.STEEMCONNECT_IMG_HOST || 'https://img.steemconnect.com'),
        STEEMCONNECT_HOST: JSON.stringify(
          process.env.STEEMCONNECT_HOST ||
          'https://steemconnect.com'
        ),
        STEEMCONNECT_REDIRECT_URL: JSON.stringify(
          process.env.STEEMCONNECT_REDIRECT_URL ||
          isDevelopment
            ? 'http://localhost:3000'
            : 'https://busy.org'
        ),
        WS: JSON.stringify(
          process.env.WS ||
          'wss://steemd.steemit.com'
        ),
        IS_BROWSER: JSON.stringify(false),
      },
    }),
  ]

};
