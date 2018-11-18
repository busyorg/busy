#!/usr/bin/env node
require('dotenv').config()

process.env.NODE_ENV = 'development';


const webpack = require('webpack');
const DevServer = require('webpack-dev-server');

const createClientConfig = require('../webpack/client');
const createServerConfig = require('../webpack/server');

const { CONTENT_PORT } = require('../webpack/configUtils');

async function main() {
  const clientConfig = createClientConfig('dev');

  const clientCompiler = webpack(clientConfig);
  const serverCompiler = webpack(createServerConfig('dev'));

  clientCompiler.plugin('done', () => {
    serverCompiler.watch(null, () => {});
  });

  const clientDevServer = new DevServer(clientCompiler, {
    port: parseInt(CONTENT_PORT)+1,
    hot: true,
    compress: true,
    noInfo: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: {
      disableDotRule: true,
		},
		disableHostCheck: true
  });

  clientDevServer.listen(parseInt(CONTENT_PORT)+1, () => console.log('server started'));
}

main();
