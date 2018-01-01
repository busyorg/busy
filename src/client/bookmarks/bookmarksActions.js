import { toggleBookmarkMetadata } from '../helpers/metadata';
import { getBookmarks as getBookmarksSelector } from '../reducers';

export const GET_BOOKMARKS = '@bookmarks/GET_BOOKMARKS';
export const GET_BOOKMARKS_START = '@bookmarks/GET_BOOKMARKS_START';
export const GET_BOOKMARKS_SUCCESS = '@bookmarks/GET_BOOKMARKS_SUCCESS';
export const GET_BOOKMARKS_ERROR = '@bookmarks/GET_BOOKMARKS_ERROR';

export const TOGGLE_BOOKMARK = '@bookmarks/TOGGLE_BOOKMARK';
export const TOGGLE_BOOKMARK_START = '@bookmarks/TOGGLE_BOOKMARK_START';
export const TOGGLE_BOOKMARK_SUCCESS = '@bookmarks/TOGGLE_BOOKMARK_SUCCESS';
export const TOGGLE_BOOKMARK_ERROR = '@bookmarks/TOGGLE_BOOKMARK_ERROR';

/**
 * Use async await to load all the posts of bookmarked from steemAPI and returns a Promise
 *
 * @param bookmarks from localStorage only contain author and permlink
 * @param steemAPI
 * @returns Promise - bookmarksData
 */
async function getBookmarksData(bookmarks, steemAPI) {
  const bookmarksData = [];
  for (let idx = 0; idx < Object.keys(bookmarks).length; idx += 1) {
    const postId = Object.keys(bookmarks)[idx];

    const postData = steemAPI.sendAsync('get_content', [
      bookmarks[postId].author,
      bookmarks[postId].permlink,
    ]);
    bookmarksData.push(postData);
  }
  return Promise.all(bookmarksData.sort((a, b) => a.timestamp - b.timestamp).reverse());
}

export const getBookmarks = () => (dispatch, getState, { steemAPI }) => {
  const bookmarks = getBookmarksSelector(getState());

  dispatch({
    type: GET_BOOKMARKS,
    payload: {
      promise: getBookmarksData(bookmarks, steemAPI).then(bookmarksData => ({
        postsData: bookmarksData,
      })),
      data: bookmarks,
    },
  });
};

export const toggleBookmark = (postId, author, permlink) => dispatch =>
  dispatch({
    type: TOGGLE_BOOKMARK,
    payload: {
      promise: toggleBookmarkMetadata(postId, author, permlink),
    },
    meta: { id: postId },
  });
