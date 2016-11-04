import Promise from 'bluebird';
import request from 'superagent';

Promise.promisifyAll(request.Request.prototype);

export const REBLOG = '@post/REBLOG';

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
