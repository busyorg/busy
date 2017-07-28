import { createAction } from 'redux-actions';

export const GET_BOOKMARKS = '@bookmarks/GET_BOOKMARKS';
export const GET_BOOKMARKS_START = '@bookmarks/GET_BOOKMARKS_START';
export const GET_BOOKMARKS_SUCCESS = '@bookmarks/GET_BOOKMARKS_SUCCESS';
export const GET_BOOKMARKS_FAIL = '@bookmarks/GET_BOOKMARKS_FAIL';

export const ADD_BOOKMARK = '@bookmarks/ADD_BOOKMARK';
export const REMOVE_BOOKMARK = '@bookmarks/REMOVE_BOOKMARK';

export const addBookmark = createAction(ADD_BOOKMARK);
export const removeBookmark = createAction(REMOVE_BOOKMARK);

/**
 * Use async await to load all the posts of bookmarked from steemAPI and returns a Promise
 *
 * @param bookmarks from localStorage only contain author and permlink
 * @param steemAPI
 * @returns Promise - bookmarksData
 */
async function getBookmarksData(bookmarks, steemAPI) {
  const bookmarksData = [];
  for (let idx = 0; idx < Object.keys(bookmarks).length; idx++) {
    const postId = Object.keys(bookmarks)[idx];

    const postData = steemAPI.getContentAsync(
      bookmarks[postId].author,
      bookmarks[postId].permlink
    );
    bookmarksData.push(postData);
  }
  return Promise.all(bookmarksData.sort((a, b) => a.timestamp - b.timestamp).reverse());
}

export const getBookmarks = () => (dispatch, getState, { steemAPI }) => {
  const { auth, bookmarks } = getState();
  const user = auth.isAuthenticated ? auth.user.name : 'guest';

  const userBookmarks = bookmarks[user] || {};

  dispatch({
    type: GET_BOOKMARKS,
    payload: {
      promise: getBookmarksData(userBookmarks, steemAPI).then(
        bookmarksData => ({ postsData: bookmarksData })
      ),
      data: bookmarks,
    },
  });
};

export const toggleBookmark = (postId, author, permlink) => (dispatch, getState) => {
  const { auth, bookmarks } = getState();
  const user = auth.isAuthenticated ? auth.user.name : 'guest';

  if (bookmarks[user]
    && bookmarks[user].filter(bookmark => bookmark.id === postId).length > 0) {
    dispatch(removeBookmark({ user, postId }));
  } else {
    dispatch(addBookmark({ user, postId, author, permlink }));
  }
};
