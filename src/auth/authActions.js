import Promise from 'bluebird';
import steemConnect from 'sc2-sdk';
import Cookie from 'js-cookie';
import request from 'superagent';
import { getFollowing } from '../user/userActions';
import { initPushpad } from './pushpadHelper';

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
  (dispatch) => {
    dispatch(requestLogin());
    steemConnect.me((err, result) => {
      if (err || !result || !result.name) {
        dispatch(loginFail());
        return;
      }
      dispatch(getFollowing(result.name));

      const accessToken = Cookie.get('access_token');
      dispatch(loginSuccess(result, accessToken));
      // init pushpad
      initPushpad(result.name, accessToken);
    });
  };
