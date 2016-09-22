// TODO(p0o): use a selector for these
export const getContentListFromState = (path, state) => {
  switch (path) {
    case 'feed':
    case 'hot':
    case 'cashout':
    case 'crated':
    case 'active':
    case 'trending':
      return state[path];
    default:
      return state['trending'];
  }
};
