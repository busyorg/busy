import { toggleBookmarkMetadata } from '../helpers/metadata';

export const TOGGLE_BOOKMARK = '@bookmarks/TOGGLE_BOOKMARK';
export const TOGGLE_BOOKMARK_START = '@bookmarks/TOGGLE_BOOKMARK_START';
export const TOGGLE_BOOKMARK_SUCCESS = '@bookmarks/TOGGLE_BOOKMARK_SUCCESS';
export const TOGGLE_BOOKMARK_ERROR = '@bookmarks/TOGGLE_BOOKMARK_ERROR';

export const toggleBookmark = (postId, author, permlink) => dispatch =>
  dispatch({
    type: TOGGLE_BOOKMARK,
    payload: {
      promise: toggleBookmarkMetadata(postId, author, permlink),
    },
    meta: { id: postId },
  });
