/***
 * Get the path from URL and the API object of steem and return the correct API call based on path
 * @param path - as in URL like 'trending'
 * @param API - the { api } from steem npm package
 * @returns {function}
 */
export const getAPIFromPath = (path, API = {}) => {
  switch (path) {
    case 'feed':
      return API.getDiscussionsByFeed;
    case 'hot':
      return API.getDiscussionsByHot;
    case 'cashout':
      return API.getDiscussionsByCashout;
    case 'crated':
      return API.getDiscussionsByCreated;
    case 'active':
      return API.getDiscussionsByActive;
    case 'trending':
    default:
      return API.getDiscussionsByTrending;
  }
};
