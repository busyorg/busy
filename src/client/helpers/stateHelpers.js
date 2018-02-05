export const getFeedFromState = (sortBy, category = 'all', state) => {
  switch (sortBy) {
    case 'feed':
    case 'hot':
    case 'created':
    case 'active':
    case 'trending':
    case 'comments':
    case 'blog':
    case 'bookmarks':
    case 'replies':
    case 'promoted':
      return state[sortBy][category] ? state[sortBy][category].list : [];
    default:
      return [];
  }
};

export const getFeedContentFromState = (sortBy, category, feedState, postsState) => {
  const feedList = getFeedFromState(sortBy, category, feedState);
  return feedList.map(feedId => postsState[feedId]);
};

export const getUserCommentsFromState = (username, feedState, posts) => {
  const feedList = getFeedFromState('comments', username, feedState);
  return feedList.map(feedId => posts[feedId]);
};

export const getFeedLoadingFromState = (sortBy, category = 'all', feedState) => {
  switch (sortBy) {
    case 'feed':
    case 'hot':
    case 'created':
    case 'active':
    case 'trending':
    case 'comments':
    case 'blog':
    case 'bookmarks':
    case 'replies':
    case 'promoted':
      return (feedState[sortBy][category] && feedState[sortBy][category].isFetching) || false;
    default:
      return false;
  }
};

export const getFeedFetchedFromState = (sortBy, category = 'all', feedState) => {
  switch (sortBy) {
    case 'feed':
    case 'hot':
    case 'created':
    case 'active':
    case 'trending':
    case 'comments':
    case 'blog':
    case 'bookmarks':
    case 'replies':
    case 'promoted':
      return (feedState[sortBy][category] && feedState[sortBy][category].isLoaded) || false;
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
    case 'replies':
    case 'promoted':
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
  getFeedLoadingFromState('feed', username, feedState);

export const getUserFeedFetchedFromState = (username, feedState) =>
  getFeedLoadingFromState('feed', username, feedState);

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
      let compareRes = parseFloat(itemA.total_payout_value) - parseFloat(itemB.total_payout_value);
      if (compareRes === 0) {
        compareRes = itemA.net_votes - itemB.net_votes;
      }
      return compareRes;
    };
  } else if (sortBy === 'votes') {
    compareFunc = (itemA, itemB) => itemA.net_votes - itemB.net_votes;
  } else if (sortBy === 'new') {
    compareFunc = (itemA, itemB) => Date.parse(itemA.created) - Date.parse(itemB.created);
  }

  return newList
    .sort((item1, item2) =>
      compareFunc(commentsState.comments[item1], commentsState.comments[item2]),
    )
    .reverse();
};

export const createAsyncActionType = type => ({
  ACTION: type,
  START: `${type}_START`,
  SUCCESS: `${type}_SUCCESS`,
  ERROR: `${type}_ERROR`,
});
