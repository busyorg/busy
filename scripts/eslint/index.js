const chalk = require('chalk');
const CLIEngine = require('eslint').CLIEngine;

const patterns = ['**/*.js'];

function lintFiles() {
  const cli = new CLIEngine({
    configFile: `${__dirname}/eslintrc.js`,
  });
  const formatter = cli.getFormatter();

  const report = cli.executeOnFiles(patterns);
  const output = formatter(report.results);

  if (output !== '') console.log(output);

  return report.warningCount === 0 && report.errorCount === 0;
}

console.log('Linting files...');
if (lintFiles()) {
  console.log(chalk.green('Lint passed.'));
} else {
  console.log(chalk.red('Lint failed.'));
  process.exit(1);
}
