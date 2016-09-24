// TODO(p0o): use a selector for these
export const getFeedFromState = (sortBy = '', category = 'all', state) => {
  switch (sortBy) {
    case 'feed':
    case 'hot':
    case 'cashout':
    case 'crated':
    case 'active':
    case 'trending':
      return state[sortBy][tag] || [];
    default:
      return state.trending.all || [];
  }
};

export const getFeedContentFromState = (sortBy, category = 'all', feedState, postsState) => {
  const feedList = getFeedFromState(sortBy, category, feedState);
  return feedList.map(feedId => postsState[feedId]);
};
