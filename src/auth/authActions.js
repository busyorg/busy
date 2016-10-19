import Promise from 'bluebird';
import extend from 'lodash/extend';
import steemConnect from 'steemconnect';
import request from 'superagent';

import api from '../steemAPI';

Promise.promisifyAll(steemConnect);
Promise.promisifyAll(request.Request.prototype);

export const LOGIN = 'LOGIN';
export const LOGIN_REQUEST = 'LOGIN_START';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_ERROR';
export const LOGOUT = 'LOGOUT';
export const LOGOUT_START = 'LOGOUT_START';
export const LOGOUT_ERROR = 'LOGOUT_ERROR';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export const GET_FOLLOWING = 'GET_FOLLOWING';
export const GET_FOLLOWING_START = 'GET_FOLLOWING_START';
export const GET_FOLLOWING_SUCCESS = 'GET_FOLLOWING_SUCCESS';
export const GET_FOLLOWING_ERROR = 'GET_FOLLOWING_ERROR';

function getFollowing(opts) {
  return (dispatch, getState) => {
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
        promise: api.getFollowingWithAsync(options),
      }
    });
  };
}

export const FOLLOW_USER = 'FOLLOW_USER';
export const FOLLOW_USER_START = 'FOLLOW_USER_START';
export const FOLLOW_USER_SUCCESS = 'FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_ERROR = 'FOLLOW_USER_ERROR';

export function followUser(username) {
  return (dispatch, getState) => dispatch({
    type: FOLLOW_USER,
    payload: {
      promise: request.get(`${process.env.STEEMCONNECT_API_HOST}/follow`)
        .withCredentials()
        .query({
          follower: getState().auth.user.name,
          following: username,
        })
        .endAsync(),
    }
  });
}

export const UNFOLLOW_USER = 'UNFOLLOW_USER';
export const UNFOLLOW_USER_START = 'UNFOLLOW_USER_START';
export const UNFOLLOW_USER_SUCCESS = 'UNFOLLOW_USER_SUCCESS';
export const UNFOLLOW_USER_ERROR = 'UNFOLLOW_USER_ERROR';

export function unfollowUser(username) {
  return (dispatch, getState) => dispatch({
    type: UNFOLLOW_USER,
    payload: {
      promise: request.get(`${process.env.STEEMCONNECT_API_HOST}/unfollow`)
        .withCredentials()
        .query({
          unfollower: getState().auth.user.name,
          unfollowing: username,
        })
        .endAsync(),
    }
  });
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
