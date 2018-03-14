import _ from 'lodash';
import { categoryRegex } from './regexHelpers';
import { jsonParse } from './formatter';
import whiteListedApps from './apps';

export const isPostDeleted = post => post.title === 'deleted' && post.body === 'deleted';

export const isPostTaggedNSFW = post => {
  if (post.parent_permlink === 'nsfw') return true;

  const postJSONMetaData = _.attempt(JSON.parse, post.json_metadata);

  if (_.isError(postJSONMetaData)) return false;

  return _.includes(postJSONMetaData.tags, 'nsfw');
};

export function dropCategory(url) {
  return url.replace(categoryRegex, '');
}

/**
 * Gets app data from a post.
 * Only Returns app info from apps whitelisted in apps.json
 * @param post
 * @returns An empty object if app is not valid otherwise an object with {appName: String, version: String}
 */
export function getAppData(post) {
  const jsonMetadata = jsonParse(post.json_metadata);
  const app = _.get(jsonMetadata, 'app', '');
  const appData = _.split(app, '/');
  const appKey = _.get(appData, 0, '');
  const version = _.get(appData, 1, '');

  if (whiteListedApps[appKey]) {
    return {
      appName: whiteListedApps[appKey],
      version: version,
    };
  }
  return {};
}

export default null;
