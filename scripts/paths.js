const fs = require('fs');
const path = require('path');

const root = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(root, relativePath);
const resolveRuntime = relativePath => path.resolve(fs.realpathSync(process.cwd()), relativePath);

module.exports = {
  app: resolveApp('.'),
  build: resolveApp('./build'),
  public: resolveApp('./public'),
  buildPublic: resolveApp('./build/public'),
  templates: resolveApp('./templates'),
  assets: resolveApp('./build/assets.json'),
  server: resolveApp('./src/server/index.js'),
  client: resolveApp('./src/client/index.js'),
  sw: resolveApp('./build/public/service-worker.js'),
  publicRuntime: () => resolveRuntime('./public'),
  buildPublicRuntime: () => resolveRuntime('./build/public'),
};
