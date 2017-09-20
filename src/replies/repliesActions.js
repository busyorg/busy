import { mapAPIContentToId } from '../helpers/apiHelpers';

export const GET_USER_REPLIES = '@user/GET_USER_REPLIES';
export const GET_USER_REPLIES_START = '@user/GET_USER_REPLIES_START';
export const GET_USER_REPLIES_SUCCESS = '@user/GET_USER_REPLIES_SUCCESS';
export const GET_USER_REPLIES_ERROR = '@user/GET_USER_REPLIES_ERROR';

export const GET_MORE_USER_REPLIES = '@user/GET_MORE_USER_REPLIES';
export const GET_MORE_USER_REPLIES_START = '@user/GET_MORE_USER_REPLIES_START';
export const GET_MORE_USER_REPLIES_SUCCESS = '@user/GET_MORE_USER_REPLIES_SUCCESS';
export const GET_MORE_USER_REPLIES_ERROR = '@user/GET_MORE_USER_REPLIES_ERROR';

export const getUserReplies = ({ username }) => (dispatch, getState, { steemAPI }) =>
  dispatch({
    type: GET_USER_REPLIES,
    payload: {
      promise: steemAPI
        .getStateAsync(`/@${username}/recent-replies`)
        .then(apiRes => mapAPIContentToId(apiRes)),
    },
    meta: { username },
  });

export const getMoreUserReplies = username => (dispatch, getState, { steemAPI }) => {
  const { feed, posts } = getState();
  const lastFetchedReplyId =
    feed.replies[username] && feed.replies[username].list[feed.replies[username].list.length - 1];

  if (!lastFetchedReplyId) {
    return Promise.reject('lastFetchedReplyId not found');
  }

  const startAuthor = posts.list[lastFetchedReplyId].author;
  const startPermlink = posts.list[lastFetchedReplyId].permlink;
  const limit = 10;

  return dispatch({
    type: GET_MORE_USER_REPLIES,
    payload: {
      // for "more content" 1 item is always repeated from previous result
      // and will be removed before returning the res
      promise: steemAPI
        .getRepliesByLastUpdateAsync(startAuthor, startPermlink, limit + 1)
        .then(apiRes => apiRes.slice(1)),
    },
    meta: { username, limit },
  });
};
