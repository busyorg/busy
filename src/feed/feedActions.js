import { createAction } from 'redux-actions';
import Logger from 'js-logger';

import { getDiscussionsFromAPI } from '../helpers/apiHelpers';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getUserFeedLoadingFromState,
  getUserFeedContentFromState,
} from '../helpers/stateHelpers';

export const GET_FEED_CONTENT = '@feed/GET_FEED_CONTENT';
export const GET_FEED_CONTENT_SUCCESS = '@feed/GET_FEED_CONTENT_SUCCESS';

export const GET_MORE_FEED_CONTENT = '@feed/GET_MORE_FEED_CONTENT';
export const GET_MORE_FEED_CONTENT_SUCCESS = '@feed/GET_MORE_FEED_CONTENT_SUCCESS';

export const GET_USER_FEED_CONTENT = '@feed/GET_USER_FEED_CONTENT';
export const GET_USER_FEED_CONTENT_SUCCESS = '@feed/GET_USER_FEED_CONTENT_SUCCESS';

export const GET_MORE_USER_FEED_CONTENT = '@feed/GET_MORE_USER_FEED_CONTENT';
export const GET_MORE_USER_FEED_CONTENT_SUCCESS = '@feed/GET_MORE_USER_FEED_CONTENT_SUCCESS';

export const FEED_HAS_NO_MORE = '@feed/FEED_HAS_NO_MORE';

export const getFeedContentWithoutAPI = createAction(GET_FEED_CONTENT);
export const getFeedContentSuccess = createAction(GET_FEED_CONTENT_SUCCESS);

export const getMoreFeedContentWithoutAPI = createAction(GET_MORE_FEED_CONTENT);
export const getMoreFeedContentSuccess = createAction(GET_MORE_FEED_CONTENT_SUCCESS);

export const getUserFeedContentWithoutAPI = createAction(GET_USER_FEED_CONTENT);
export const getUserFeedContentSuccess = createAction(GET_USER_FEED_CONTENT_SUCCESS);

export const getMoreUserFeedContentWithoutAPI = createAction(GET_MORE_USER_FEED_CONTENT);
export const getMoreUserFeedContentSuccess = createAction(GET_MORE_USER_FEED_CONTENT_SUCCESS);

export const feedHasNoMore = createAction(FEED_HAS_NO_MORE);

export const getFeedContent = ({ sortBy, category, limit }) => (
  dispatch,
  getState,
  { steemAPI },
) => {
  dispatch(
    getFeedContentWithoutAPI({
      sortBy: sortBy || 'trending',
      category: category || 'all',
    }),
  );

  return getDiscussionsFromAPI(
    sortBy,
    {
      tag: category,
      limit,
    },
    steemAPI,
  )
    .then(postsData =>
      dispatch(
        getFeedContentSuccess({
          sortBy: sortBy || 'trending',
          category: category || 'all',
          postsData,
          limit,
        }),
      ),
    )
    .catch((err) => {
      Logger.error(`error while loading ${sortBy}/${category}`, err);
      throw err;
    });
};

export const getUserFeedContent = ({ username, limit, sortBy = 'feed' }) => (
  dispatch,
  getState,
  { steemAPI },
) => {
  dispatch(
    getUserFeedContentWithoutAPI({
      sortBy,
      username,
    }),
  );

  return getDiscussionsFromAPI(
    sortBy,
    {
      tag: username,
      limit,
    },
    steemAPI,
  )
    .then(postsData =>
      dispatch(
        getUserFeedContentSuccess({
          sortBy,
          username,
          postsData,
          limit,
        }),
      ),
    )
    .catch((err) => {
      Logger.error(`error while loading ${sortBy}/${username}`, err);
      throw err;
    });
};

export const getMoreFeedContent = ({ sortBy, category, limit }) => (
  dispatch,
  getState,
  { steemAPI },
) => {
  const feedContent =
    getFeedContentFromState(sortBy, category, getState().feed, getState().posts.list);
  const isLoading = getFeedLoadingFromState(sortBy, category, getState().feed);

  if (!feedContent.length || isLoading) {
    // exit early
    return null;
  }

  dispatch(
    getMoreFeedContentWithoutAPI({
      sortBy: sortBy || 'trending',
      category: category || 'all',
    }),
  );

  const startAuthor = feedContent[feedContent.length - 1].author;
  const startPermlink = feedContent[feedContent.length - 1].permlink;

  return getDiscussionsFromAPI(
    sortBy,
    {
      tag: category,
      limit: limit + 1,
      start_author: startAuthor,
      start_permlink: startPermlink,
    },
    steemAPI,
  )
    .then((postsData) => {
      // The feed is completely loaded
      if (postsData.length === 1) {
        return dispatch(
          feedHasNoMore({
            sortBy,
            category,
          }),
        );
      }

      return dispatch(
        getMoreFeedContentSuccess({
          sortBy: sortBy || 'trending',
          category: category || 'all',
          postsData,
          limit,
        }),
      );
    })
    .catch((err) => {
      Logger.error(`error while loading ${sortBy}/${category}`, err);
      throw err;
    });
};

export const getMoreUserFeedContent = ({ username, limit }) => (
  dispatch,
  getState,
  { steemAPI },
) => {
  const sortBy = 'feed';
  const { feed, posts } = getState();
  const feedContent = getUserFeedContentFromState(username, feed, posts.list);
  const isLoading = getUserFeedLoadingFromState(username, feed);

  if (!feedContent.length || isLoading) {
    // exit early
    return null;
  }

  dispatch(
    getMoreUserFeedContentWithoutAPI({
      sortBy,
      username,
    }),
  );

  const startAuthor = feedContent[feedContent.length - 1].author;
  const startPermlink = feedContent[feedContent.length - 1].permlink;

  return getDiscussionsFromAPI(
    sortBy,
    {
      tag: username,
      limit: limit + 1,
      start_author: startAuthor,
      start_permlink: startPermlink,
    },
    steemAPI,
  )
    .then((postsData) => {
      // The feed is completely loaded
      if (postsData.length === 1) {
        return dispatch(
          feedHasNoMore({
            sortBy,
            category: username,
          }),
        );
      }

      return dispatch(
        getMoreUserFeedContentSuccess({
          sortBy,
          username,
          postsData,
          limit,
        }),
      );
    })
    .catch((err) => {
      Logger.error(`error while loading ${sortBy}/${username}`, err);
      throw err;
    });
};
