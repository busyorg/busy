// TODO(p0o): use a selector for these
export const getFeedFromState = (sortBy = '', category = 'all', state) => {
  switch (sortBy) {
    case 'feed':
    case 'hot':
    case 'cashout':
    case 'crated':
    case 'active':
    case 'trending':
      return state[sortBy][category] ? state[sortBy][category].list : [];
    default:
      return state.trending.all ? state.trending.all.list : [];
  }
};

export const getFeedContentFromState = (sortBy, category = 'all', feedState, postsState) => {
  const feedList = getFeedFromState(sortBy, category, feedState);
  return feedList.map(feedId => postsState[feedId]);
};

export const getFeedLoadingFromState = (sortBy, category = 'all', feedState) => {
  switch (sortBy) {
    case 'feed':
    case 'hot':
    case 'cashout':
    case 'crated':
    case 'active':
    case 'trending':
      return (feedState[sortBy][category] && feedState[sortBy][category].loading) || false;
    default:
      return (feedState.trending.all && feedState.trending.all.loading) || false;
  }
};
