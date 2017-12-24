const chalk = require('chalk');
const CLIEngine = require('eslint').CLIEngine;

const getChangedFiles = require('../utils/getChangedFiles');
const intersect = require('../utils/intersect');

const patterns = ['**/*.js'];

const onlyChanged = process.argv[2] !== 'all';

function lintFiles() {
  const cli = new CLIEngine({
    configFile: `${__dirname}/eslintrc.js`,
  });
  const formatter = cli.getFormatter();

  const files = onlyChanged ? intersect(getChangedFiles(), patterns) : patterns;

  const report = cli.executeOnFiles(files);
  const output = formatter(report.results);

  if (output !== '') console.log(output);

  return report.warningCount === 0 && report.errorCount === 0;
}

console.log(onlyChanged ? 'Linting changed files...' : 'Linting files...');

if (lintFiles()) {
  console.log(chalk.green('Lint passed.'));
} else {
  console.log(chalk.red('Lint failed.'));
  process.exit(1);
}
