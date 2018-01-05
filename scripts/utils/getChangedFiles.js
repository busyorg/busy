// Based on by:
// https://github.com/facebook/react/blob/dd8b387b69d73f9e8ed4f995ccb3cd927c0d33e3/scripts/shared/listChangedFiles.js

const chalk = require('chalk');
const execFileSync = require('child_process').execFileSync;

function exec(command, args) {
  console.log(chalk.dim(`> ${[command].concat(args).join(' ')}`));
  const options = {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'pipe',
    encoding: 'utf-8',
  };
  return execFileSync(command, args, options);
}

function execGitCmd(args) {
  return exec('git', args)
    .trim()
    .toString()
    .split('\n');
}

function getChangedFiles() {
  const mergeBase = execGitCmd(['merge-base', 'HEAD', 'master']);
  return [
    ...execGitCmd(['diff', '--name-only', '--diff-filter=ACMRTUB', mergeBase]),
    ...execGitCmd(['ls-files', '--others', '--exclude-standard']),
  ];
}

module.exports = getChangedFiles;
