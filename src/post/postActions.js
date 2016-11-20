import steemConnect from 'steemconnect';
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


export const getContent = (postAuthor, postPermlink) => {
  return (dispatch, getState, { steemAPI }) => {
    if (!postAuthor || !postPermlink) {
      return;
    }

    dispatch({
      type: GET_CONTENT,
      payload: {
        promise: steemAPI.getContentAsync(postAuthor, postPermlink),
      },
    });

  };
};

export const likePost = (postId) => {
  return (dispatch, getState) => {
    const { auth, posts } = getState();

    if (!auth.isAuthenticated) {
      return;
    }

    const voter = auth.user.name;

    dispatch({
      type: LIKE_POST,
      payload: {
        promise: steemConnect.vote(voter, posts[postId].author, posts[postId].permlink, 10000).then(
          (res) => {
            dispatch(
              getContent(posts[postId].author, posts[postId].permlink)
            );
            return res;
          }
        ),
      },
      meta: { postId, voter },
    });
  }
};
