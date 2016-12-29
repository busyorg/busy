// TODO(p0o): use a selector for these
export const getFeedFromState = (sortBy, category = 'all', state) => {
  switch (sortBy) {
    case 'feed':
    case 'hot':
    case 'cashout':
    case 'created':
    case 'active':
    case 'trending':
    case 'comments':
    case 'blog':
    case 'bookmarks':
      return state[sortBy][category] ? state[sortBy][category].list : [];
    default:
      return [];
  }
};

export const getFeedContentFromState = (sortBy, category, feedState, postsState) => {
  const feedList = getFeedFromState(sortBy, category, feedState);
  return feedList.map(feedId => postsState[feedId]);
};

export const getUserCommentsFromState = (username, feedState, commentsState) => {
  const feedList = getFeedFromState('comments', username, feedState);
  return feedList.map(feedId => commentsState.comments[feedId]);
};

export const getFeedLoadingFromState = (sortBy, category = 'all', feedState) => {
  switch (sortBy) {
    case 'feed':
    case 'hot':
    case 'cashout':
    case 'created':
    case 'active':
    case 'trending':
    case 'comments':
    case 'blog':
    case 'bookmarks':
      return (feedState[sortBy][category] && feedState[sortBy][category].isFetching) || false;
    default:
      return false;
  }
};

export const getFeedHasMoreFromState = (sortBy, listName = 'all', feedState) => {
  switch (sortBy) {
    case 'feed':
    case 'hot':
    case 'cashout':
    case 'created':
    case 'active':
    case 'trending':
    case 'comments':
    case 'blog':
    case 'bookmarks':
      return (feedState[sortBy][listName] && feedState[sortBy][listName].hasMore) || false;
    default:
      return false;
  }
};

// returning the same function but different naming helps to understand the code's flow better
// and defines a pattern to scale this feature with reselect
export const getUserFeedContentFromState = (username, feedState, postsState) =>
  getFeedContentFromState('feed', username, feedState, postsState);

export const getUserFeedLoadingFromState = (username, feedState) =>
  (feedState.feed[username] && feedState.feed[username].isFetching) || false;


/**
 * Sort comments based on payout
 * @param {Array} list - list of IDs of comments
 * @param {Object} commentsState - state.comments in busy redux setup
 * @param {String} sortBy - how comments should be sorted
 * @returns {Array} - list of sorted IDs
 */
export const sortCommentsFromSteem = (list, commentsState, sortBy = 'trending') => {
  let compareFunc;
  const newList = [...list];

  if (sortBy === 'trending') {
    compareFunc = (itemA, itemB) => {
      if (itemA.net_rshares < 0) {
        return 1;
      } else if (itemB.net_rshares < 0) {
        return -1;
      }

      // Following this algorithm from steemit devs:
      // https://github.com/steemit/steemit.com/blob/34894d4da193e5d676295050e981a1b642acddc5/app/components/cards/Comment.jsx#L44
      return itemA.children_rshares2 - itemB.children_rshares2;
    };
  } else if (sortBy === 'votes') {
    compareFunc = (itemA, itemB) => itemA.net_votes - itemB.net_votes;
  } else if (sortBy === 'new') {
    compareFunc = (itemA, itemB) => {
      if (itemA.net_rshares < 0) {
        return 1;
      } else if (itemB.net_rshares < 0) {
        return -1;
      }

      return Date.parse(itemA.created) - Date.parse(itemB.created);
    };
  }

  return newList.sort((item1, item2) =>
    compareFunc(commentsState.comments[item1], commentsState.comments[item2])
  ).reverse();
};
