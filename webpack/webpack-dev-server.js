const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const postcssFlexbugs = require('postcss-flexbugs-fixes');
const configUtils = require('./configUtils');

const baseDir = path.resolve(__dirname, '..');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: path.resolve(baseDir, './src/client/index.js'),
  output: {
    filename: 'bundle.js',
    publicPath: '/js/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        ENABLE_LOGGER: JSON.stringify(process.env.ENABLE_LOGGER),
        STEEMCONNECT_CLIENT_ID: JSON.stringify(process.env.STEEMCONNECT_CLIENT_ID || 'busy.app'),
        STEEMCONNECT_REDIRECT_URL: JSON.stringify(
          process.env.STEEMCONNECT_REDIRECT_URL || 'http://localhost:3000/callback',
        ),
        STEEMCONNECT_HOST: JSON.stringify(
          process.env.STEEMCONNECT_HOST || 'https://steemconnect.com',
        ),
        STEEMJS_URL: JSON.stringify(process.env.STEEMJS_URL || 'https://api.steemit.com'),
        IS_BROWSER: JSON.stringify(true),
        SIGNUP_URL: JSON.stringify(process.env.SIGNUP_URL || 'https://signup.steemit.com/?ref=busy'),
      },
    }),
  ],
  module: {
    rules: [
      {
        test: configUtils.MATCH_JS_JSX,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg)(\?.+)?$/,
        loader: 'url-loader',
      },
      {
        test: configUtils.MATCH_CSS_LESS,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
              plugins: () => [
                postcssFlexbugs,
                autoprefixer({
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
  devServer: {
    port: 3000,
    contentBase: [path.resolve(baseDir, 'templates'), path.resolve(baseDir, 'assets')],
    historyApiFallback: {
      disableDotRule: true,
    },
    proxy: {
      '/callback': 'http://localhost:3001',
      '/i/**': 'http://localhost:3001',
    },
  },
};
