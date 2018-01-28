import _ from 'lodash';

export function getFromMetadata(jsonMetadata, key) {
  const metadata = _.attempt(JSON.parse, jsonMetadata);
  if (_.isError(metadata)) return null;

  return _.get(metadata, key);
}

const imgRegex = /<img[^>]+src="([^">]+)"/g;
const hrefRegex = /<a[^>]+href="([^">]+)"/g;

function extract(body, regex) {
  const matches = [];

  let match;
  do {
    match = regex.exec(body);
    if (match) matches.push(match[1]);
  } while (match);

  return matches;
}

export function extractImages(body) {
  return extract(body, imgRegex);
}

export function extractLinks(body) {
  return extract(body, hrefRegex);
}

export default null;
