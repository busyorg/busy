import { getDiscussionsFromAPI } from '../helpers/apiHelpers';
import {
  createAsyncActionType,
  getFeedContentFromState,
  getUserCommentsFromState,
  getFeedLoadingFromState,
} from '../helpers/stateHelpers';
import {
  getAuthenticatedUserName,
  getFeed,
  getPosts,
  getBookmarks as getBookmarksSelector,
} from '../reducers';

export const GET_FEED_CONTENT = createAsyncActionType('@feed/GET_FEED_CONTENT');
export const GET_MORE_FEED_CONTENT = createAsyncActionType('@feed/GET_MORE_FEED_CONTENT');

export const GET_USER_COMMENTS = createAsyncActionType('@feed/GET_USER_COMMENTS');
export const GET_MORE_USER_COMMENTS = createAsyncActionType('@feed/GET_MORE_USER_COMMENTS');

export const GET_REPLIES = createAsyncActionType('@user/GET_REPLIES');
export const GET_MORE_REPLIES = createAsyncActionType('@user/GET_MORE_REPLIES');

export const GET_BOOKMARKS = createAsyncActionType('@bookmarks/GET_BOOKMARKS');

export const getFeedContent = ({ sortBy = 'trending', category, limit = 20 }) => (
  dispatch,
  getState,
  { steemAPI },
) =>
  dispatch({
    type: GET_FEED_CONTENT.ACTION,
    payload: getDiscussionsFromAPI(sortBy, { tag: category, limit }, steemAPI),
    meta: {
      sortBy,
      category: category || 'all',
      limit,
    },
  });

export const getMoreFeedContent = ({ sortBy, category, limit = 20 }) => (
  dispatch,
  getState,
  { steemAPI },
) => {
  const { feed, posts } = getState();
  const feedContent = getFeedContentFromState(sortBy, category, feed, posts.list);

  if (!feedContent.length) return Promise.resolve(null);

  const startAuthor = feedContent[feedContent.length - 1].author;
  const startPermlink = feedContent[feedContent.length - 1].permlink;

  return dispatch({
    type: GET_MORE_FEED_CONTENT.ACTION,
    payload: getDiscussionsFromAPI(
      sortBy,
      {
        tag: category,
        limit: limit + 1,
        start_author: startAuthor,
        start_permlink: startPermlink,
      },
      steemAPI,
    ).then(postsData => postsData.slice(1)),
    meta: {
      sortBy,
      category: category || 'all',
      limit,
    },
  });
};

export const getUserComments = ({ username, limit = 20 }) => (dispatch, getState, { steemAPI }) => {
  const feed = getFeed(getState());
  if (feed.comments[username] && feed.comments[username].isLoaded) {
    return null;
  }

  return dispatch({
    type: GET_USER_COMMENTS.ACTION,
    payload: steemAPI
      .sendAsync('get_discussions_by_comments', [{ start_author: username, limit }])
      .then(postsData => postsData),
    meta: { sortBy: 'comments', category: username, limit },
  });
};

export const getMoreUserComments = ({ username, limit = 20 }) => (
  dispatch,
  getState,
  { steemAPI },
) => {
  const feed = getFeed(getState());
  const posts = getPosts(getState());

  const feedContent = getUserCommentsFromState(username, feed, posts);
  const isLoading = getFeedLoadingFromState('comments', username, feed);

  if (!feedContent.length || isLoading) {
    return null;
  }

  const userComments = getUserCommentsFromState(username, feed, posts);
  const startAuthor = userComments[userComments.length - 1].author;
  const startPermlink = userComments[userComments.length - 1].permlink;

  return dispatch({
    type: GET_MORE_USER_COMMENTS.ACTION,
    payload: steemAPI
      .sendAsync('get_discussions_by_comments', [
        {
          start_author: startAuthor,
          start_permlink: startPermlink,
          limit: limit + 1,
        },
      ])
      .then(postsData => postsData.slice(1)),
    meta: { sortBy: 'comments', category: username, limit },
  });
};

export const getReplies = () => (dispatch, getState, { steemAPI }) => {
  const category = getAuthenticatedUserName(getState());
  dispatch({
    type: GET_REPLIES.ACTION,
    payload: steemAPI
      .sendAsync('get_state', [`/@${category}/recent-replies`])
      .then(apiRes => Object.values(apiRes.content).sort((a, b) => b.id - a.id)),
    meta: { sortBy: 'replies', category, limit: 50 },
  });
};

export const getMoreReplies = () => (dispatch, getState, { steemAPI }) => {
  const category = getAuthenticatedUserName(getState());
  const { feed, posts } = getState();
  const lastFetchedReplyId =
    feed.replies[category] && feed.replies[category].list[feed.replies[category].list.length - 1];

  if (!lastFetchedReplyId) {
    return null;
  }

  const startAuthor = posts.list[lastFetchedReplyId].author;
  const startPermlink = posts.list[lastFetchedReplyId].permlink;
  const limit = 10;

  return dispatch({
    type: GET_MORE_REPLIES.ACTION,
    payload: steemAPI
      .sendAsync('get_replies_by_last_update', [startAuthor, startPermlink, limit + 1])
      .then(postsData => postsData.slice(1)),
    meta: { sortBy: 'replies', category, limit },
  });
};

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
    type: GET_BOOKMARKS.ACTION,
    payload: getBookmarksData(bookmarks, steemAPI),
    meta: {
      sortBy: 'bookmarks',
      category: 'all',
      once: true,
    },
  });
};
