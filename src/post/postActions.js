import steemConnect from 'sc2-sdk';
import Promise from 'bluebird';
import { omit } from 'lodash/object';
import { setCurrentContent } from '../actions';

export const GET_CONTENT = 'GET_CONTENT';
export const GET_CONTENT_START = 'GET_CONTENT_START';
export const GET_CONTENT_SUCCESS = 'GET_CONTENT_SUCCESS';
export const GET_CONTENT_ERROR = 'GET_CONTENT_ERROR';

export const LIKE_POST = '@post/LIKE_POST';
export const LIKE_POST_START = '@post/LIKE_POST_START';
export const LIKE_POST_SUCCESS = '@post/LIKE_POST_SUCCESS';
export const LIKE_POST_ERROR = '@post/LIKE_POST_ERROR';

steemConnect.vote = Promise.promisify(steemConnect.vote, { context: steemConnect });

export const getContent = (
  { author: postAuthor, permlink: postPermlink, afterLike, omitAttributes = [] } = {}
) => (dispatch, getState, { steemAPI }) => {
  if (!postAuthor || !postPermlink) {
    return null;
  }
  return dispatch({
    type: GET_CONTENT,
    payload: {
      promise: steemAPI
        .getContentAsync(postAuthor, postPermlink)
        .then((postData) => {
          dispatch(setCurrentContent(postData));
          return omit(postData, omitAttributes);
        }),
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

  const voter = auth.user.name;

  return dispatch({
    type: LIKE_POST,
    payload: {
      promise: steemConnect
        .vote(voter, posts[postId].author, posts[postId].permlink, weight)
        .then((res) => {
          // Delay to make sure you get the latest data (unknown issue with API)
          setTimeout(
            () =>
              dispatch(
                getContent({
                  author: posts[postId].author,
                  permlink: posts[postId].permlink,
                  afterLike: true,
                })
              ),
            1000
          );
          return res;
        }),
    },
    meta: { postId, voter, weight },
  });
};
