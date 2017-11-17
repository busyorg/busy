const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const isDevelopment = process.env.NODE_ENV !== 'production';
const baseDir = path.resolve(__dirname, '..');
module.exports = {

  entry: path.resolve(baseDir, './src/server/index.js'),

  output: {
    filename: 'busy.server.js',
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
    __dirname: true,
  },
  watch: isDevelopment,

  module: {
    loaders: [
      {
        test: /\.(eot|ttf|woff|woff2|svg)(\?.+)?$/,
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
        loader: 'html-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react', 'stage-2'],
            plugins: ['transform-decorators-legacy', 'transform-runtime'],
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.css|.less$/,
        use: [
          'isomorphic-style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('autoprefixer')({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                }),
              ],
            },
          },
          'less-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        IMG_HOST: JSON.stringify(process.env.IMG_HOST || 'https://img.busy.org'),
        STEEMCONNECT_CLIENT_ID: JSON.stringify(process.env.STEEMCONNECT_CLIENT_ID || 'busy.app'),
        STEEMCONNECT_REDIRECT_URL: JSON.stringify(process.env.STEEMCONNECT_REDIRECT_URL || 'http://localhost:3000/callback'),
        STEEMCONNECT_HOST: JSON.stringify(process.env.STEEMCONNECT_HOST || 'https://v2.steemconnect.com'),
        STEEMJS_URL: JSON.stringify(process.env.STEEMJS_URL || 'https://api.steemit.com'),
        IS_BROWSER: JSON.stringify(false),
      },
    }),
  ],

};
