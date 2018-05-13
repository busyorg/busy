import _ from 'lodash';
import { categoryRegex } from './regexHelpers';
import { jsonParse } from './formatter';
import DMCA from '../../common/constants/dmca.json';
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
  try {
    const jsonMetadata = jsonParse(post.json_metadata);
    const appDetails = _.get(jsonMetadata, 'app', '');
    const appData = _.split(appDetails, '/');
    const appKey = _.get(appData, 0, '');
    const version = _.get(appData, 1, '');

    if (whiteListedApps[appKey]) {
      return {
        appName: whiteListedApps[appKey],
        version,
      };
    }
    return {};
  } catch (error) {
    return {};
  }
}

export const isBannedPost = post => {
  const bannedAuthors = _.get(DMCA, 'authors', []);
  const bannedPosts = _.get(DMCA, 'posts', []);
  const postURL = `${post.author}/${post.permlink}`;

  return _.includes(bannedAuthors, post.author) || _.includes(bannedPosts, postURL);
};

export const validateTopics = intl => (rule, value, callback) => {
  if (!value || value.length < 1 || value.length > 5) {
    callback(
      intl.formatMessage({
        id: 'topics_error_count',
        defaultMessage: 'You have to add 1 to 5 topics.',
      }),
    );
  }

  value
    .map(topic => ({ topic, valid: /^[a-z0-9]+(-[a-z0-9]+)*$/.test(topic) }))
    .filter(topic => !topic.valid)
    .map(topic =>
      callback(
        intl.formatMessage(
          {
            id: 'topics_error_invalid_topic',
            defaultMessage: 'Topic {topic} is invalid.',
          },
          {
            topic: topic.topic,
          },
        ),
      ),
    );

  callback();
};
