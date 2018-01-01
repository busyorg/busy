import Cookie from 'js-cookie';
import { getIsAuthenticated, getAuthenticatedUserName } from '../reducers';
import { getAccount, getAllFollowers } from '../helpers/apiHelpers';
import { createAsyncActionType } from '../helpers/stateHelpers';

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
export const GET_AUTH_USER_FOLLOWERS = createAsyncActionType('@auth/GET_AUTH_USER_FOLLOWERS');

export const login = () => (dispatch, getState, { steemConnectAPI }) => {
  let promise = Promise.resolve(null);
  if (!steemConnectAPI.options.accessToken) {
    promise = Promise.reject(new Error('There is not accessToken present'));
  } else {
    promise = steemConnectAPI.me();
  }
  if (getIsAuthenticated(getState())) promise = Promise.resolve(null);

  return dispatch({
    type: LOGIN,
    payload: {
      promise,
    },
    meta: {
      refresh: getIsAuthenticated(getState()),
    },
  }).catch(() => {});
};

export const getAuthUserFollowers = () => (dispatch, getState) => {
  const state = getState();
  const getAuthUsername = getAuthenticatedUserName(state);
  dispatch({
    type: GET_AUTH_USER_FOLLOWERS.ACTION,
    payload: {
      promise: getAllFollowers(getAuthUsername),
    },
  });
};

export const reload = () => (dispatch, getState, { steemConnectAPI }) =>
  dispatch({
    type: RELOAD,
    payload: {
      promise: steemConnectAPI.me(),
    },
  });

export const logout = () => (dispatch, getState, { steemConnectAPI }) =>
  dispatch({
    type: LOGOUT,
    payload: {
      promise: steemConnectAPI.revokeToken().then(() => Cookie.remove('access_token')),
    },
  });

export const updateAuthUser = username => dispatch =>
  dispatch({
    type: UPDATE_AUTH_USER.ACTION,
    payload: {
      promise: getAccount(username),
    },
  });
