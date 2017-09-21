import { getAuthenticatedUserName } from '../reducers';
import { mapToId, mapAPIContentToId } from '../helpers/apiHelpers';

export const GET_REPLIES = '@user/GET_REPLIES';
export const GET_REPLIES_START = '@user/GET_REPLIES_START';
export const GET_REPLIES_SUCCESS = '@user/GET_REPLIES_SUCCESS';
export const GET_REPLIES_ERROR = '@user/GET_REPLIES_ERROR';

export const GET_MORE_REPLIES = '@user/GET_MORE_REPLIES';
export const GET_MORE_REPLIES_START = '@user/GET_MORE_REPLIES_START';
export const GET_MORE_REPLIES_SUCCESS = '@user/GET_MORE_REPLIES_SUCCESS';
export const GET_MORE_REPLIES_ERROR = '@user/GET_MORE_REPLIES_ERROR';

export const getReplies = () => (dispatch, getState, { steemAPI }) => {
  const username = getAuthenticatedUserName(getState());
  dispatch({
    type: GET_REPLIES,
    payload: {
      promise: steemAPI
        .getStateAsync(`/@${username}/recent-replies`)
        .then(apiRes => mapAPIContentToId(apiRes)),
    },
    meta: { username },
  });
};

export const getMoreReplies = () => (dispatch, getState, { steemAPI }) => {
  const username = getAuthenticatedUserName(getState());
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
    type: GET_MORE_REPLIES,
    payload: {
      promise: steemAPI
        .getRepliesByLastUpdateAsync(startAuthor, startPermlink, limit + 1)
        .then(apiRes => apiRes.slice(1))
        .then(mapToId),
    },
    meta: { username, limit },
  });
};
