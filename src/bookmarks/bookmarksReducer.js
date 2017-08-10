import * as bookmarksActions from './bookmarksActions';

const initialState = {};

const bookmarks = (state = initialState, action) => {
  switch (action.type) {
    case bookmarksActions.ADD_BOOKMARK:
      if (state[action.payload.user]) {
        return {
          ...state,
          [action.payload.user]: [
            ...state[action.payload.user],
            {
              id: action.payload.postId,
              author: action.payload.author,
              permlink: action.payload.permlink,
            },
          ],
        };
      }
      return {
        ...state,
        [action.payload.user]: [
          {
            id: action.payload.postId,
            author: action.payload.author,
            permlink: action.payload.permlink,
          },
        ],
      };
    case bookmarksActions.REMOVE_BOOKMARK:
      return {
        ...state,
        [action.payload.user]: state[action.payload.user].filter(
          bookmark => bookmark.id !== action.payload.postId,
        ),
      };
    default:
      return state;
  }
};

export default bookmarks;
