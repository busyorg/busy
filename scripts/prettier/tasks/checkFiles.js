const findFiles = require('../findFiles');

const checkFiles = require('..').checkFiles;

const onlyChanged = process.argv[2] !== 'all';

const files = findFiles(onlyChanged);
checkFiles(files);
