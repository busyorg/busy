import Promise from 'bluebird';
import extend from 'lodash/extend';
import steemConnect from 'steemconnect';
import request from 'superagent';

Promise.promisifyAll(steemConnect);
Promise.promisifyAll(request.Request.prototype);

export const LOGIN = '@auth/LOGIN';
export const LOGIN_REQUEST = '@auth/LOGIN_START';
export const LOGIN_SUCCESS = '@auth/LOGIN_SUCCESS';
export const LOGIN_FAILURE = '@auth/LOGIN_ERROR';
export const LOGOUT = '@auth/LOGOUT';
export const LOGOUT_START = '@auth/LOGOUT_START';
export const LOGOUT_ERROR = '@auth/LOGOUT_ERROR';
export const LOGOUT_SUCCESS = '@auth/LOGOUT_SUCCESS';

export const GET_FOLLOWING = 'GET_FOLLOWING';
export const GET_FOLLOWING_START = 'GET_FOLLOWING_START';
export const GET_FOLLOWING_SUCCESS = 'GET_FOLLOWING_SUCCESS';
export const GET_FOLLOWING_ERROR = 'GET_FOLLOWING_ERROR';

function getFollowing(opts) {
  return (dispatch, getState, { steemAPI }) => {
    const { auth } = getState();
    const currentUsername = auth.user && auth.user.name;
    const options = extend({
      follower: currentUsername,
      startFollowing: 0,
      followType: 'blog',
      limit: 100,
    }, opts);

    dispatch({
      type: GET_FOLLOWING,
      meta: options,
      payload: {
        promise: steemAPI.getFollowingWithAsync(options),
      }
    });
  };
}


const requestLogin = () => {
  return {
    type: LOGIN_REQUEST
  };
};

const loginSuccess = (user) => {
  return {
    type: LOGIN_SUCCESS,
    user
  };
};

const loginFail = () => {
  return {
    type: LOGIN_FAILURE
  };
};

export const login = () => {
  return (dispatch) => {
    dispatch(requestLogin());

    steemConnect.isAuthenticated((err, result) => {
      if (err || !result || !result.isAuthenticated) {
        dispatch(loginFail());
        return;
      }

      dispatch(getFollowing({
        follower: result.username,
      }));

      api.getAccounts([result.username], (err, users) => { // eslint-disable-line no-shadow
        if (err || !users || !users[0]) {
          dispatch(loginFail());
          return;
        }

        dispatch(loginSuccess(users[0]));
      });
    });
  };
};
