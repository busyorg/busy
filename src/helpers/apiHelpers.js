/***
 * Get the path from URL and the API object of steem and return the correct API call based on path
 * @param path - as in URL like 'trending'
 * @param API - the { api } from steem npm package
 * @param query {Object} - the same query sending to Steem API
 * @param callback - The same callback giving to Steem API
 * @returns {function}
 */
export const getDiscussionsFromAPI = function (sortBy, API = {}, query, callback) {
  switch (sortBy) {
    case 'feed':
      return API.getDiscussionsByFeed(query, callback);
    case 'hot':
      return API.getDiscussionsByHot(query, callback);
    case 'cashout':
      return API.getDiscussionsByCashout(query, callback);
    case 'crated':
      return API.getDiscussionsByCreated(query, callback);
    case 'active':
      return API.getDiscussionsByActive(query, callback);
    case 'trending':
    default:
      return API.getDiscussionsByTrending(query, callback);
  }
};
