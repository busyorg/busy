import _ from 'lodash';

export function getFromMetadata(jsonMetadata, key) {
  const metadata = _.attempt(JSON.parse, jsonMetadata);
  if (_.isError(metadata)) return null;

  return _.get(metadata, key);
}

const attr = /(\w+)="(.*?)"/;
const imgTag = /<img(.*)\/>/g;
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

export function extractImageTags(body) {
  const imageTags = extract(body, imgTag);

  return imageTags.map(image => {
    const pairs = image.trim().split(' ');

    return pairs.reduce((a, b) => {
      const matches = b.match(attr);
      return {
        ...a,
        [matches[1]]: matches[2],
      };
    }, {});
  });
}

export function extractLinks(body) {
  return extract(body, hrefRegex);
}

export default null;
