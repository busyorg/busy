import { createAction } from 'redux-actions';
import * as actionTypes from './feedActionTypes';

import { getDiscussionsFromAPI } from './../helpers/apiHelpers';
import {
  getFeedFromState,
  getFeedContentFromState,
  getFeedLoadingFromState,
  getUserFeedLoadingFromState,
  getUserFeedContentFromState
} from './../helpers/stateHelpers';

export const getFeedContentWithoutAPI = createAction(actionTypes.GET_FEED_CONTENT);
export const getFeedContentSuccess = createAction(actionTypes.GET_FEED_CONTENT_SUCCESS);

export const getMoreFeedContentWithoutAPI = createAction(actionTypes.GET_MORE_FEED_CONTENT);
export const getMoreFeedContentSuccess = createAction(actionTypes.GET_MORE_FEED_CONTENT_SUCCESS);

export const getUserFeedContentWithoutAPI = createAction(actionTypes.GET_USER_FEED_CONTENT);
export const getUserFeedContentSuccess = createAction(actionTypes.GET_USER_FEED_CONTENT_SUCCESS);

export const getMoreUserFeedContentWithoutAPI = createAction(actionTypes.GET_MORE_USER_FEED_CONTENT);
export const getMoreUserFeedContentSuccess = createAction(actionTypes.GET_MORE_USER_FEED_CONTENT_SUCCESS);

export const feedHasNoMore = createAction(actionTypes.FEED_HAS_NO_MORE);

export const getFeedContent = ({ sortBy, category, limit }) => {
  return (dispatch, getState, { steemAPI }) => {
    const feed = getState().feed;
    if (feed[sortBy][category] && feed[sortBy][category].isLoaded) {
      return;
    }

    dispatch(getFeedContentWithoutAPI({
      sortBy: sortBy || 'trending',
      category: category || 'all',
    }));

    getDiscussionsFromAPI(sortBy, {
      tag: category,
      limit,
    },
    steemAPI,
    (err, postsData) => {
      if (err) {
        console.error(`error while loading ${sortBy}/${category}`, JSON.stringify(err));
        return;
      }

      dispatch(
        getFeedContentSuccess({
          sortBy: sortBy || 'trending',
          category: category || 'all',
          postsData,
        })
      );
    });
  };
};

export const getUserFeedContent = ({ username, limit }) => {
  return (dispatch, getState, { steemAPI }) => {
    const { feed } = getState();
    if (feed.feed[username] && feed.feed[username].isLoaded) {
      return;
    }

    const sortBy = 'feed';

    dispatch(getUserFeedContentWithoutAPI({
      sortBy,
      username,
    }));

    getDiscussionsFromAPI(sortBy, {
      tag: username,
      limit,
    },
    steemAPI,
    (err, postsData) => {
      if (err) {
        console.error(`error while loading ${sortBy}/${username}`, JSON.stringify(err));
        return;
      }

      dispatch(
        getUserFeedContentSuccess({
          sortBy,
          username,
          postsData,
        })
      );
    });
  };
};

export const getMoreFeedContent = ({ sortBy, category, limit }) => {
  return (dispatch, getState, { steemAPI }) => {
    const feedContent = getFeedContentFromState(
        sortBy, category, getState().feed, getState().posts);
    const isLoading = getFeedLoadingFromState(sortBy, category, getState().feed);

    if (!feedContent.length || isLoading) {
      // exit early
      return;
    }

    dispatch(getMoreFeedContentWithoutAPI({
      sortBy: sortBy || 'trending',
      category: category || 'all',
    }));

    const startAuthor = feedContent[feedContent.length - 1].author;
    const startPermlink = feedContent[feedContent.length - 1].permlink;

    getDiscussionsFromAPI(sortBy, {
      tag: category,
      limit: limit + 1,
      start_author: startAuthor,
      start_permlink: startPermlink,
    },
    steemAPI,
    (err, postsData) => {
      if (err) {
        console.error(`error while loading ${sortyBy}/${category}`, JSON.stringify(err));
        return;
      }

      // The feed is completely loaded
      if (postsData.length === 1) {
        dispatch(feedHasNoMore({
          sortBy,
          category,
        }));
      }

      dispatch(
        getMoreFeedContentSuccess({
          sortBy: sortBy || 'trending',
          category: category || 'all',
          postsData,
        })
      );
    });
  };
};

export const getMoreUserFeedContent = ({ username, limit }) => {
  return (dispatch, getState, { steemAPI }) => {
    const sortBy = 'feed';
    const { feed, posts } = getState();
    const feedContent = getUserFeedContentFromState(username, feed, posts);
    const isLoading = getUserFeedLoadingFromState(username, feed);

    if (!feedContent.length || isLoading) {
      // exit early
      return;
    }

    dispatch(getMoreUserFeedContentWithoutAPI({
      sortBy,
      username,
    }));

    const startAuthor = feedContent[feedContent.length - 1].author;
    const startPermlink = feedContent[feedContent.length - 1].permlink;

    getDiscussionsFromAPI(sortBy, {
      tag: username,
      limit: limit + 1,
      start_author: startAuthor,
      start_permlink: startPermlink,
      },
      steemAPI,
      (err, postsData) => {
        if (err) {
          console.error(`error while loading ${sortyBy} for ${username}`, JSON.stringify(err));
          return;
        }

        // The feed is completely loaded
        if (postsData.length === 1) {
          dispatch(feedHasNoMore({
            sortBy,
            category: username,
          }));
        }

        dispatch(
          getMoreUserFeedContentSuccess({
            sortBy,
            username,
            postsData,
          })
        );
      });
  };
};
