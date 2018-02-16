const chalk = require('chalk');
const fs = require('fs');
const prettier = require('prettier');
const options = require('../../.prettierrc.js');

function formatFile(file) {
  const input = fs.readFileSync(file, 'utf8');

  const formatOptions = {
    ...options,
    parser: file.endsWith('.less') ? 'less' : 'babylon',
  };

  const output = prettier.format(input, formatOptions);
  if (input !== output) {
    fs.writeFileSync(file, output, 'utf8');
  }
}

function formatFiles(files) {
  files.forEach(file => formatFile(file));
}

function checkFiles(files) {
  console.log('Checking files formatting.');

  let notFormattedFiles = [];
  files.forEach(file => {
    const formatOptions = {
      ...options,
      parser: file.endsWith('.less') ? 'less' : 'babylon',
    };
    const input = fs.readFileSync(file, 'utf-8');
    if (!prettier.check(input, formatOptions)) {
      notFormattedFiles = [...notFormattedFiles, file];
    }
  });

  if (notFormattedFiles.length !== 0) {
    console.log(
      `${chalk.red(
        'Please make sure you have up-to-date master branch and consider running',
      )} ${chalk.red.bold('yarn run prettier')} ${chalk.red('and then commit your changes')}`,
    );
    console.log('Files not formatted properly:');
    notFormattedFiles.forEach(file => console.log(chalk.dim(file)));
    process.exit(1);
  }
  console.log(chalk.green('All files formatted properly.'));
}

module.exports = {
  formatFile,
  formatFiles,
  checkFiles,
};
