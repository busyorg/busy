import Promise from 'bluebird';
import * as actionTypes from './userProfileActionTypes';

export const getUserComments = (username) => {
  return (dispatch, getState, { steemAPI }) => {
    const feed = getState().feed;
    if (feed.comments[username] && feed.comments[username].isLoaded) {
      return;
    }

    const steemGetState = Promise.promisify(steemAPI.getState, { context: steemAPI });

    dispatch({
      type: actionTypes.GET_USER_COMMENTS,
      payload: {
        promise: steemGetState(`@${username}/posts`),
      },
      meta: { username }
    });
  };
};

export const getMoreUserComments = (username, limit) => {
  return (dispatch, getState, { steemAPI }) => {
    const { feed, comments } = getState();
    if (feed.comments[username] && feed.comments[username].isLoaded) {
      return;
    }

    const getDiscussionsByComments = Promise.promisify(
        steemAPI.getDiscussionsByComments, { context: steemAPI });

    const userComments = getUserCommentsFromState(username, feed, comments);
    const startAuthor = userComments[userComments.length - 1].author;
    const startPermlink = userComments[userComments.length - 1].permlink;

    dispatch({
      type: actionTypes.GET_MORE_USER_COMMENTS,
      payload: {
        promise: getDiscussionsByComments({
          start_author: startAuthor,
          start_permlink: startPermlink,
          limit,
        }),
      },
      meta: { username }
    });
  };
};

