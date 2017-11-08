import Promise from 'bluebird';
import steemConnect from 'sc2-sdk';
import Cookie from 'js-cookie';
import { getAccountWithFollowingCount } from '../helpers/apiHelpers';
import { getFollowing } from '../user/userActions';
import { initPushpad } from '../helpers/pushpadHelper';
import { createAsyncActionType } from '../helpers/stateHelpers';

Promise.promisifyAll(steemConnect);

export const LOGIN = '@auth/LOGIN';
export const LOGIN_START = '@auth/LOGIN_START';
export const LOGIN_SUCCESS = '@auth/LOGIN_SUCCESS';
export const LOGIN_ERROR = '@auth/LOGIN_ERROR';

export const RELOAD = '@auth/RELOAD';
export const RELOAD_START = '@auth/RELOAD_START';
export const RELOAD_SUCCESS = '@auth/RELOAD_SUCCESS';
export const RELOAD_ERROR = '@auth/RELOAD_ERROR';

export const LOGOUT = '@auth/LOGOUT';
export const LOGOUT_START = '@auth/LOGOUT_START';
export const LOGOUT_ERROR = '@auth/LOGOUT_ERROR';
export const LOGOUT_SUCCESS = '@auth/LOGOUT_SUCCESS';

export const UPDATE_AUTH_USER = createAsyncActionType('@auth/UPDATE_AUTH_USER');

export const login = () => (dispatch) => {
  dispatch({
    type: LOGIN,
    payload: {
      promise: steemConnect.me()
        .then((resp) => {
          dispatch(getFollowing(resp.user));
          initPushpad(resp.user, Cookie.get('access_token'));
          return resp;
        }),
    },
  });
};

export const reload = () => dispatch =>
  dispatch({
    type: RELOAD,
    payload: {
      promise: steemConnect.me(),
    },
  });

export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
    payload: {
      promise: steemConnect.revokeToken()
        .then(() => Cookie.remove('access_token')),
    },
  });
};

export const updateAuthUser = username => dispatch => dispatch({
  type: UPDATE_AUTH_USER.ACTION,
  payload: {
    promise: getAccountWithFollowingCount(username),
  },
});
