/***
 * Get the path from URL and the API object of steem and return the correct API call based on path
 * @param path - as in URL like 'trending'
 * @param API - the { api } from steem npm package
 * @param query {Object} - the same query sending to Steem API
 * @param callback - The same callback giving to Steem API
 * @returns {function}
 */
export const getDiscussionsFromAPI = function (sortBy, query, callback) {
  const { steemAPI } = window;
  switch (sortBy) {
    case 'feed':
      return steemAPI.getDiscussionsByFeed(query, callback);
    case 'hot':
      return steemAPI.getDiscussionsByHot(query, callback);
    case 'cashout':
      return steemAPI.getDiscussionsByCashout(query, callback);
    case 'crated':
      return steemAPI.getDiscussionsByCreated(query, callback);
    case 'active':
      return steemAPI.getDiscussionsByActive(query, callback);
    case 'trending':
    default:
      return steemAPI.getDiscussionsByTrending(query, callback);
  }
};
