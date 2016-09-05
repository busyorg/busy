'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'eval-source-map',
    entry: [
        'webpack-hot-middleware/client?reload=true',
        path.join(__dirname, 'src/index.js')
    ],
    output: {
        path: path.join(__dirname, '/js'),
        filename: 'app.min.js',
        publicPath: '/js'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                // This has effect on the react lib size
                'NODE_ENV': JSON.stringify('development'),
            }
        })
    ],
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                "presets": ["react", "es2015", "stage-0", "react-hmre"]
            }
        }, {
                test: /\.json?$/,
                loader: 'json'
            }, {
                test: /\.css$/,
                loader: 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]'
            }]
    }
};
