import Promise from 'bluebird';
import { createAction } from 'redux-actions';
import SteemConnect from '../steemConnectAPI';
import { getFeed, getPosts } from '../reducers';
import { getUserCommentsFromState, getFeedLoadingFromState } from '../helpers/stateHelpers';
import { getAllFollowing } from '../helpers/apiHelpers';

export const GET_USER_COMMENTS = 'GET_USER_COMMENTS';
export const GET_USER_COMMENTS_START = 'GET_USER_COMMENTS_START';
export const GET_USER_COMMENTS_SUCCESS = 'GET_USER_COMMENTS_SUCCESS';
export const GET_USER_COMMENTS_ERROR = 'GET_USER_COMMENTS_ERROR';

export const GET_MORE_USER_COMMENTS = 'GET_MORE_USER_COMMENTS';
export const GET_MORE_USER_COMMENTS_START = 'GET_MORE_USER_COMMENTS_START';
export const GET_MORE_USER_COMMENTS_SUCCESS = 'GET_MORE_USER_COMMENTS_SUCCESS';
export const GET_MORE_USER_COMMENTS_ERROR = 'GET_MORE_USER_COMMENTS_ERROR';

export const getUserComments = ({ username, limit = 10 }) => (dispatch, getState, { steemAPI }) => {
  const feed = getFeed(getState());
  if (feed.comments[username] && feed.comments[username].isLoaded) {
    return null;
  }

  const getDiscussionsByComments = Promise.promisify(steemAPI.getDiscussionsByComments, {
    context: steemAPI,
  });

  return dispatch({
    type: GET_USER_COMMENTS,
    payload: {
      promise: getDiscussionsByComments({
        start_author: username,
        limit,
      }),
    },
    meta: { username, limit },
  });
};

export const getMoreUserComments = (username, limit) => (dispatch, getState, { steemAPI }) => {
  const feed = getFeed(getState());
  const posts = getPosts(getState());

  const feedContent = getUserCommentsFromState(username, feed, posts);
  const isLoading = getFeedLoadingFromState('comments', username, feed);

  if (!feedContent.length || isLoading) {
    return null;
  }

  const getDiscussionsByComments = Promise.promisify(steemAPI.getDiscussionsByComments, {
    context: steemAPI,
  });

  const userComments = getUserCommentsFromState(username, feed, posts);
  const startAuthor = userComments[userComments.length - 1].author;
  const startPermlink = userComments[userComments.length - 1].permlink;

  return dispatch({
    type: GET_MORE_USER_COMMENTS,
    payload: {
      promise: getDiscussionsByComments({
        start_author: startAuthor,
        start_permlink: startPermlink,
        limit,
      }),
    },
    meta: { username, limit },
  });
};

export const FOLLOW_USER = '@user/FOLLOW_USER';
export const FOLLOW_USER_START = '@user/FOLLOW_USER_START';
export const FOLLOW_USER_SUCCESS = '@user/FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_ERROR = '@user/FOLLOW_USER_ERROR';

export const followUser = username => (dispatch, getState) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) {
    return Promise.reject('User is not authenticated');
  }

  return dispatch({
    type: FOLLOW_USER,
    payload: {
      promise: SteemConnect.follow(auth.user.name, username),
    },
    meta: {
      username,
    },
  });
};

export const UNFOLLOW_USER = '@user/UNFOLLOW_USER';
export const UNFOLLOW_USER_START = '@user/UNFOLLOW_USER_START';
export const UNFOLLOW_USER_SUCCESS = '@user/UNFOLLOW_USER_SUCCESS';
export const UNFOLLOW_USER_ERROR = '@user/UNFOLLOW_USER_ERROR';

export const unfollowUser = username => (dispatch, getState) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) {
    return Promise.reject('User is not authenticated');
  }
  return dispatch({
    type: UNFOLLOW_USER,
    payload: {
      promise: SteemConnect.unfollow(auth.user.name, username),
    },
    meta: {
      username,
    },
  });
};

export const GET_FOLLOWING = '@user/GET_FOLLOWING';
export const GET_FOLLOWING_START = '@user/GET_FOLLOWING_START';
export const GET_FOLLOWING_SUCCESS = '@user/GET_FOLLOWING_SUCCESS';
export const GET_FOLLOWING_ERROR = '@user/GET_FOLLOWING_ERROR';

export const getFollowing = (userName = '') => (dispatch, getState) => {
  const { auth } = getState();

  if (!userName && !auth.isAuthenticated) {
    return Promise.reject('User is not authenticated');
  }

  const targetUsername = userName || auth.user.name;

  return dispatch({
    type: GET_FOLLOWING,
    meta: targetUsername,
    payload: {
      promise: getAllFollowing(userName),
    },
  });
};

export const UPDATE_RECOMMENDATIONS = '@user/UPDATE_RECOMMENDATIONS';
export const updateRecommendations = createAction(UPDATE_RECOMMENDATIONS);
