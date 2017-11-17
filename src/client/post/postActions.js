import steemConnect from 'sc2-sdk';
import Promise from 'bluebird';

export const GET_CONTENT = 'GET_CONTENT';
export const GET_CONTENT_START = 'GET_CONTENT_START';
export const GET_CONTENT_SUCCESS = 'GET_CONTENT_SUCCESS';
export const GET_CONTENT_ERROR = 'GET_CONTENT_ERROR';

export const LIKE_POST = '@post/LIKE_POST';
export const LIKE_POST_START = '@post/LIKE_POST_START';
export const LIKE_POST_SUCCESS = '@post/LIKE_POST_SUCCESS';
export const LIKE_POST_ERROR = '@post/LIKE_POST_ERROR';

steemConnect.vote = Promise.promisify(steemConnect.vote, { context: steemConnect });

export const getContent = (postAuthor, postPermlink, afterLike) => (
  dispatch,
  getState,
  { steemAPI },
) => {
  if (!postAuthor || !postPermlink) {
    return null;
  }
  return dispatch({
    type: GET_CONTENT,
    payload: {
      promise: steemAPI.getContentAsync(postAuthor, postPermlink),
    },
    meta: {
      afterLike,
    },
  });
};

export const votePost = (postId, author, permlink, weight = 10000) => (dispatch, getState) => {
  const { auth, posts } = getState();
  if (!auth.isAuthenticated) {
    return null;
  }

  const post = posts.list[postId];
  const voter = auth.user.name;

  return dispatch({
    type: LIKE_POST,
    payload: {
      promise: steemConnect.vote(voter, post.author, post.permlink, weight).then((res) => {
        if (window.analytics) {
          window.analytics.track('Vote', {
            category: 'vote',
            label: 'submit',
            value: 1,
          });
        }

        // Delay to make sure you get the latest data (unknown issue with API)
        setTimeout(() => dispatch(getContent(post.author, post.permlink, true)), 1000);
        return res;
      }),
    },
    meta: { postId, voter, weight },
  });
};
