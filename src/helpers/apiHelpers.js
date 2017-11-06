import Promise from 'bluebird';
import SteemAPI from '../steemAPI';
import { jsonParse } from '../helpers/formatter';
import * as accountHistoryConstants from '../constants/accountHistory';

/** *
 * Get the path from URL and the API object of steem and return the correct API call based on path
 * @param path - as in URL like 'trending'
 * @param API - the { api } from steem npm package
 * @param query {Object} - the same query sending to Steem API
 * @param steemAPI - The same giving to Steem API
 * @returns {function}
 */
export const getDiscussionsFromAPI = function getDiscussionsFromAPI(sortBy, query, steemAPI) {
  switch (sortBy) {
    case 'feed':
      return steemAPI.getDiscussionsByFeedAsync(query);
    case 'hot':
      return steemAPI.getDiscussionsByHotAsync(query);
    case 'created':
      return steemAPI.getDiscussionsByCreatedAsync(query);
    case 'active':
      return steemAPI.getDiscussionsByActiveAsync(query);
    case 'trending':
      return steemAPI.getDiscussionsByTrendingAsync(query);
    case 'blog':
      return steemAPI.getDiscussionsByBlogAsync(query);
    case 'comments':
      return steemAPI.getDiscussionsByCommentsAsync(query);
    case 'promoted':
      return steemAPI.getDiscussionsByPromotedAsync(query);
    default:
      throw new Error('There is not API endpoint defined for this sorting');
  }
};

export const getAccount = username =>
  SteemAPI.getAccountsAsync([username]).then((result) => {
    if (result.length) {
      const userAccount = result[0];
      userAccount.json_metadata = jsonParse(result[0].json_metadata);
      return userAccount;
    }
    throw new Error('User Not Found');
  });

export const getFollowingCount = username => SteemAPI.getFollowCountAsync(username);

export const getAccountWithFollowingCount = username =>
  Promise.all([getAccount(username), getFollowingCount(username)]).then(([
    account,
    { following_count, follower_count },
  ]) => ({
    ...account,
    following_count,
    follower_count,
  }));

export const getFollowing = (username, startForm = '', type = 'blog', limit = 100) =>
  SteemAPI.getFollowingAsync(username, startForm, type, limit).then(result =>
    result.map(user => user.following),
  );

export const getFollowers = (username, startForm = '', type = 'blog', limit = 100) =>
  SteemAPI.getFollowersAsync(username, startForm, type, limit).then(result =>
    result.map(user => user.follower),
  );

export const getAllFollowing = username =>
  getFollowingCount(username).get('following_count').then((followingCount) => {
    const chunkSize = 100;
    const limitArray = Array.fill(Array(Math.ceil(followingCount / chunkSize)), chunkSize);
    return Promise.reduce(
      limitArray,
      (currentList, limit) => {
        const startForm = currentList[currentList.length - 1] || '';
        return getFollowing(username, startForm, 'blog', limit).then(following =>
          currentList.slice(0, currentList.length - 1).concat(following),
        );
      },
      [],
    );
  });

export const getAllFollowers = username =>
  getFollowingCount(username).get('follower_count').then((followerCount) => {
    const chunkSize = 100;
    const limitArray = Array.fill(Array(Math.ceil(followerCount / chunkSize)), chunkSize);
    return Promise.reduce(
      limitArray,
      (currentList, limit) => {
        const startForm = currentList[currentList.length - 1] || '';
        return getFollowers(username, startForm, 'blog', limit).then(following =>
          currentList.slice(0, currentList.length - 1).concat(following),
        );
      },
      [],
    );
  });

export const mapToId = (content) => {
  const listById = {};
  Object.values(content).forEach((value) => {
    listById[value.id] = value;
  });
  return listById;
};

export const mapAPIContentToId = apiRes => mapToId(apiRes.content);

export const defaultAccountLimit = 500;

export const getAccountHistory = (account, from = -1, limit = defaultAccountLimit) =>
  SteemAPI.getAccountHistoryAsync(account, from, limit);

export const getDynamicGlobalProperties = () => SteemAPI.getDynamicGlobalPropertiesAsync();

export const isWalletTransaction = actionType =>
  actionType === accountHistoryConstants.TRANSFER ||
  actionType === accountHistoryConstants.TRANSFER_TO_VESTING ||
  actionType === accountHistoryConstants.CANCEL_TRANSFER_FROM_SAVINGS ||
  actionType === accountHistoryConstants.TRANSFER_FROM_SAVINGS ||
  actionType === accountHistoryConstants.TRANSFER_TO_SAVINGS ||
  actionType === accountHistoryConstants.DELEGATE_VESTING_SHARES ||
  actionType === accountHistoryConstants.CLAIM_REWARD_BALANCE;
