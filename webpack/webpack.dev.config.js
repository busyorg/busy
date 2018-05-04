const path = require('path');
const {
  MATCH_JS,
  MATCH_CSS_LESS,
  MATCH_FONTS,
  DEFINE_PLUGIN,
  POSTCSS_LOADER,
} = require('./configUtils');

const baseDir = path.resolve(__dirname, '..');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: path.resolve(baseDir, './src/client/index.js'),
  output: {
    filename: 'bundle.js',
    publicPath: '/js/',
  },
  plugins: [DEFINE_PLUGIN],
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
