const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const isDevelopment = process.env.NODE_ENV !== 'production';

const MATCH_JS = /\.js$/i;
const MATCH_CSS_LESS = /\.(css|less)$/i;
const MATCH_FONTS = /\.(eot|ttf|woff|woff2|svg)(\?.+)?$/;

const POSTCSS_LOADER = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    plugins: () => [
      autoprefixer({
        browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
      }),
    ],
  },
};

const DEFINE_PLUGIN = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: isDevelopment ? JSON.stringify('development') : JSON.stringify('production'),
    STEEMCONNECT_CLIENT_ID: JSON.stringify(process.env.STEEMCONNECT_CLIENT_ID || 'busy.app'),
    STEEMCONNECT_REDIRECT_URL: JSON.stringify(
      process.env.STEEMCONNECT_REDIRECT_URL || 'http://localhost:3000/callback',
    ),
    STEEMCONNECT_HOST: JSON.stringify(process.env.STEEMCONNECT_HOST || 'https://steemconnect.com'),
    STEEMJS_URL: JSON.stringify(process.env.STEEMJS_URL || 'https://api.steemit.com'),
    SIGNUP_URL: JSON.stringify(process.env.SIGNUP_URL || 'https://signup.steemit.com/?ref=busy'),
  },
});

module.exports = {
  MATCH_JS,
  MATCH_CSS_LESS,
  MATCH_FONTS,
  POSTCSS_LOADER,
  DEFINE_PLUGIN,
};
