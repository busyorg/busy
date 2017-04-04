const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

module.exports = {

  entry: path.resolve(__dirname, './server/index.js'),

  output: {
    filename: 'app.bundle.js'
  },

  target: 'node',

  // keep node_module paths out of the bundle
  externals: fs.readdirSync(path.resolve(__dirname, 'node_modules'))
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

  module: {
    loaders: [
      {
        test: /\.(eot|ttf|woff|woff2)(\?.+)?$/,
        loader: 'url-loader',
        options: {
          name: '../fonts/[name].[ext]',
          // load fonts through data-url in development
          limit: 500000,
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
      'process.env': { IS_BROWSER: JSON.stringify(false), },
    }),
  ]

};
