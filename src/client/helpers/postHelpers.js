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
 * @returns {*}
 */
export function getAppData(post) {
  let from;
  let version;
  try {
    const app = jsonParse(post.json_metadata).app.split('/');
    if (whiteListedApps[app[0]]) {
      from = app[0];
      version = app[1];
    }
  } catch (e) {
    return {};
  }
  return { from, version };
}

export default null;
