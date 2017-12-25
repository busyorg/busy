const minimatch = require('minimatch');

function intersect(files, patterns) {
  let intersection = [];
  patterns.forEach(pattern => {
    intersection = [...intersection, ...minimatch.match(files, pattern, { matchBase: true })];
  });

  return intersection;
}

module.exports = intersect;
