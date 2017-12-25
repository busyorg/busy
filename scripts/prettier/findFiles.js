const glob = require('glob');

const getChangedFiles = require('../utils/getChangedFiles');

const options = {
  patterns: ['**/*.js', '**/*.less'],
  ignore: ['node_modules/**', 'public/**', 'assets/**', 'webpack/**'],
};

function findFiles(onlyChanged) {
  const changedFiles = onlyChanged ? getChangedFiles() : null;
  const globPattern =
    options.patterns.length > 1 ? `{${options.patterns.join(',')}}` : options.patterns.join(',');
  return glob
    .sync(globPattern, { ignore: options.ignore })
    .filter(file => !onlyChanged || changedFiles.includes(file));
}

module.exports = findFiles;
