import Promise from 'bluebird';
import steemConnect from 'steemconnect';
import request from 'superagent';
import { getFollowing } from '../user/userActions';

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

const requestLogin = () => ({ type: LOGIN_REQUEST });

const loginSuccess = (user, token) =>
  ({
    type: LOGIN_SUCCESS,
    user,
    token,
  });

const loginFail = () => ({ type: LOGIN_FAILURE });

export const login = () =>
  (dispatch, getState, { steemAPI }) => {
    dispatch(requestLogin());
    steemConnect.isAuthenticated((err, result) => {
      if (err || !result || !result.isAuthenticated) {
        dispatch(loginFail());
        return;
      }
      dispatch(getFollowing(result.username));
      steemAPI.getAccounts([result.username], (err, users) => { // eslint-disable-line no-shadow
        if (err || !users || !users[0]) {
          dispatch(loginFail());
          return;
        }
        dispatch(loginSuccess(users[0], result.token));
      });
    });
  };
