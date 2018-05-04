#!/usr/bin/env node

process.env.NODE_ENV = 'development';

const webpack = require('webpack');
const DevServer = require('webpack-dev-server');

const clientConfig = require('../webpack/client');
const serverConfig = require('../webpack/server');

async function main() {
  const clientCompiler = webpack(clientConfig);
  const serverCompiler = webpack(serverConfig);

  clientCompiler.plugin('done', () => {
    serverCompiler.watch(null, () => {});
  });

  const clientDevServer = new DevServer(clientCompiler, clientConfig.devServer);

  const appPort = process.env.PORT || 3000;
  const staticPort = appPort + 1;

  clientDevServer.listen(staticPort, () => console.log('server started'));
}

main();
