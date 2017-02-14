import Promise from 'bluebird';

import steemAPI from '../steemAPI';

/** *
 * Get the path from URL and the API object of steem and return the correct API call based on path
 * @param path - as in URL like 'trending'
 * @param API - the { api } from steem npm package
 * @param query {Object} - the same query sending to Steem API
 * @param callback - The same callback giving to Steem API
 * @returns {function}
 */
export const getDiscussionsFromAPI = function (sortBy, query, steemAPI, callback) {
  switch (sortBy) {
    case 'feed':
      return steemAPI.getDiscussionsByFeed(query, callback);
    case 'hot':
      return steemAPI.getDiscussionsByHot(query, callback);
    case 'cashout':
      return steemAPI.getDiscussionsByCashout(query, callback);
    case 'created':
      return steemAPI.getDiscussionsByCreated(query, callback);
    case 'active':
      return steemAPI.getDiscussionsByActive(query, callback);
    case 'trending':
      return steemAPI.getDiscussionsByTrending(query, callback);
    case 'blog':
      return steemAPI.getDiscussionsByBlog(query, callback);
    case 'comments':
      return steemAPI.getDiscussionsByComments(query, callback);
    default:
      throw new Error('There is not API endpoint defined for this sorting');
  }
};

export const getAccount = username =>
  steemAPI.getAccountsAsync([username])
    .then((result) => {
      if (result.length) {
        const userAccount = result[0];
        try {
          userAccount.json_metadata = JSON.parse(result[0].json_metadata);
        } catch (e) {
          userAccount.json_metadata = {};
        }
        return userAccount;
      }
      throw new Error('User Not Found');
    });

export const getFollowingCount = username =>
  steemAPI.getFollowCountAsync(username);

export const getAccountWithFollowingCount = username =>
  Promise.all([getAccount(username), getFollowingCount(username)])
    .then(([account, { following_count, follower_count }]) =>
      ({ ...account, following_count, follower_count }));

export const getFollowing = (username, startForm = '', type = 'blog', limit = 100) =>
  steemAPI.getFollowingAsync(username, startForm, type, limit)
    .then(result => result.map(user => user.following));

export const getFollowers = (username, startForm = '', type = 'blog', limit = 100) =>
  steemAPI.getFollowersAsync(username, startForm, type, limit)
    .then(result => result.map(user => user.follower));

export const getAllFollowing = username =>
  getFollowingCount(username)
    .get('following_count')
    .then((followingCount) => {
      const chunkSize = 100;
      const limitArray = Array.fill(Array(Math.ceil(followingCount / chunkSize)), chunkSize);
      return Promise.reduce(limitArray, (currentList, limit) => {
        const startForm = currentList[currentList.length - 1] || '';
        return getFollowing(username, startForm, 'blog', limit)
          .then(following => currentList.slice(0, currentList.length - 1).concat(following));
      }, []);
    });

export const getAllFollowers = username =>
  getFollowingCount(username)
    .get('follower_count')
    .then((followerCount) => {
      const chunkSize = 100;
      const limitArray = Array.fill(Array(Math.ceil(followerCount / chunkSize)), chunkSize);
      return Promise.reduce(limitArray, (currentList, limit) => {
        const startForm = currentList[currentList.length - 1] || '';
        return getFollowers(username, startForm, 'blog', limit)
          .then(following => currentList.slice(0, currentList.length - 1).concat(following));
      }, []);
    });

export const mapAPIContentToId = (apiRes) => {
  const listsById = {};
  Object.keys(apiRes.content).forEach((contentKey) => {
    listsById[apiRes.content[contentKey].id] = apiRes.content[contentKey];
  });
  return listsById;
};
