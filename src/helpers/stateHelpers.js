// TODO(p0o): use a selector for these
export const getFeedFromState = (path, tag = 'all', state) => {
  switch (path) {
    case 'feed':
    case 'hot':
    case 'cashout':
    case 'crated':
    case 'active':
    case 'trending':
      return state.feed[path][tag];
    default:
      return state.feed['trending']['all'];
  }
};
