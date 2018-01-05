import _ from 'lodash';

export function getFromMetadata(jsonMetadata, key) {
  const metadata = _.attempt(JSON.parse, jsonMetadata);
  if (_.isError(metadata)) return null;

  return _.get(metadata, key);
}

export default null;
