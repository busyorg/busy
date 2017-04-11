import steemConnect from 'steemconnect';
import Promise from 'bluebird';
import { omit } from 'lodash/object';

export const GET_CONTENT = 'GET_CONTENT';
export const GET_CONTENT_START = 'GET_CONTENT_START';
export const GET_CONTENT_SUCCESS = 'GET_CONTENT_SUCCESS';
export const GET_CONTENT_ERROR = 'GET_CONTENT_ERROR';

export const LIKE_POST = '@post/LIKE_POST';
export const LIKE_POST_START = '@post/LIKE_POST_START';
export const LIKE_POST_SUCCESS = '@post/LIKE_POST_SUCCESS';
export const LIKE_POST_ERROR = '@post/LIKE_POST_ERROR';

steemConnect.vote = Promise.promisify(steemConnect.vote, { context: steemConnect });

export const getContent = (postAuthor, postPermlink, omitAttributes = []) => {
  return (dispatch, getState, { steemAPI }) => {
    if (!postAuthor || !postPermlink) {
      return;
    }

    dispatch({
      type: GET_CONTENT,
      payload: {
        promise: steemAPI.getContentAsync(postAuthor, postPermlink).then(
          postData => omit(postData, omitAttributes)
        ),
      },
    });
  };
};

export const votePost = (postId, weight = 10000) => {
  return (dispatch, getState) => {
    const { auth, posts } = getState();

    if (!auth.isAuthenticated) {
      return;
    }

    const voter = auth.user.name;

    dispatch({
      type: LIKE_POST,
      payload: {
        promise: steemConnect.vote(voter, posts[postId].author, posts[postId].permlink, weight).then(
          (res) => {
            // Delay to make sure you get the latest data (unknown issue with API)
            setTimeout(() =>
              dispatch(
                getContent(posts[postId].author, posts[postId].permlink, ['net_votes', 'active_votes'])
              ),
              1000
            );
            return res;
          }
        ),
      },
      meta: { postId, voter, weight },
    });
  };
};
