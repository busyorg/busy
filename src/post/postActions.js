import Promise from 'bluebird';
import request from 'superagent';

Promise.promisifyAll(request.Request.prototype);

export const REBLOG = '@post/REBLOG';

export const GET_CONTENT = 'GET_CONTENT';
export const GET_CONTENT_START = 'GET_CONTENT_START';
export const GET_CONTENT_SUCCESS = 'GET_CONTENT_SUCCESS';
export const GET_CONTENT_ERROR = 'GET_CONTENT_ERROR';


export const reblog = (query) => {
  return (dispatch, getState) => {
    const { auth } = getState();

    if (!auth.isAuthenticated || auth.user.name !== query.author) {
      return;
    }

    dispatch({
      type: REBLOG,
      payload: {
        promise: request.get(`${process.env.STEEMCONNECT_API_HOST}/reblog`)
          .query(query)
          .withCredentials()
          .endAsync(),
      }
    });
  }
};


export const getContent = (postAuthor, postPermlink) => {
  return (dispatch, getState, { steemAPI }) => {
    if (!postAuthor || !postPermlink) {
      return;
    }

    dispatch({
      type: GET_CONTENT,
      payload: {
        promise: steemAPI.getContentWithAsync(postAuthor, postPermlink),
      },
    });

  };
};
