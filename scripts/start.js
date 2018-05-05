#!/usr/bin/env node

process.env.NODE_ENV = 'development';

const webpack = require('webpack');
const DevServer = require('webpack-dev-server');

const createClientConfig = require('../webpack/client');
const createServerConfig = require('../webpack/server');

async function main() {
  const clientConfig = createClientConfig('dev');

  const clientCompiler = webpack(clientConfig);
  const serverCompiler = webpack(createServerConfig('dev'));

  clientCompiler.plugin('done', () => {
    serverCompiler.watch(null, () => {});
  });

  const clientDevServer = new DevServer(clientCompiler, clientConfig.devServer);

  clientDevServer.listen(clientConfig.devServer.port, () => console.log('server started'));
}

main();
