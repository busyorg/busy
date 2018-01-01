const findFiles = require('../findFiles');

const formatFiles = require('..').formatFiles;

const onlyChanged = process.argv[2] !== 'all';

const files = findFiles(onlyChanged);
formatFiles(files);
