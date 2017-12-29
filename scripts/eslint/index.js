const chalk = require('chalk');
const CLIEngine = require('eslint').CLIEngine;
const getChangedFiles = require('../utils/getChangedFiles');
const intersect = require('../utils/intersect');

// This message comes from eslint if we try to run eslint on file that is ignored.
// We filter those warnings away.
const ignoreMessage =
  'File ignored because of a matching ignore pattern. Use "--no-ignore" to override.';

const patterns = ['**/*.js'];

const onlyChanged = process.argv[2] !== 'all';

function lintFiles() {
  const cli = new CLIEngine({
    configFile: `${__dirname}/eslintrc.js`,
  });
  const formatter = cli.getFormatter();

  const files = onlyChanged ? intersect(getChangedFiles(), patterns) : patterns;

  const report = cli.executeOnFiles(files);
  const messages = report.results.filter(
    item => !(item.messages[0] && item.messages[0].message === ignoreMessage),
  );

  const output = formatter(messages);
  if (output !== '') console.log(output);

  const ignoredMessageCount = report.results.length - messages.length;
  return report.warningCount - ignoredMessageCount === 0 && report.errorCount === 0;
}

console.log(onlyChanged ? 'Linting changed files...' : 'Linting files...');

if (lintFiles()) {
  console.log(chalk.green('Lint passed.'));
} else {
  console.log(chalk.red('Lint failed.'));
  process.exit(1);
}
