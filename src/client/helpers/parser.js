import _ from 'lodash';

export function getFromMetadata(jsonMetadata, key) {
  const metadata = _.attempt(JSON.parse, jsonMetadata);
  if (_.isError(metadata)) return null;

  return _.get(metadata, key);
}

const attrs = /(\w+=".*?")/g;
const attrElements = /^(\w+)="(.*?)"$/;
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
  return extract(body, imgTag).map(image => {
    const attributes = image.match(attrs);

    return attributes.reduce((a, b) => {
      const values = b.match(attrElements);

      if (_.size(values) === 3) {
        const key = _.get(values, 1);
        const value = _.get(values, 2);
        return {
          ...a,
          [key]: value,
        };
      }

      return a;
    }, {});
  });
}

export function extractLinks(body) {
  return extract(body, hrefRegex).map(_.unescape);
}

export default null;
