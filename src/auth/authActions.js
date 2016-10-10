import Promise from 'bluebird';
import extend from 'lodash/extend';
import steemConnect from 'steemconnect';
import broadcast from 'steem/lib/broadcast';

import * as actionTypes from './authActionTypes';
import api from '../steemAPI';

Promise.promisifyAll(steemConnect);

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
      promise: steemConnect.sendAsync('https://steemconnect.com/api/customJson', {
        json: JSON.stringify([
          'follow',
          {
            follower: getState().auth.user.name,
            following: username,
          },
        ]),
        requiredAuths: [],
        requiredPostingAuths: [
          getState().auth.user.name,
        ],
      }),
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
      promise: steemConnect.sendAsync('https://steemconnect.com/api/customJson', {
        json: JSON.stringify([
          'unfollow',
          {
            unfollower: getState().auth.user.name,
            unfollowing: username,
          },
        ]),
        requiredAuths: [],
        requiredPostingAuths: [
          getState().auth.user.name,
        ],
      }),
    }
  });
}

const requestLogin = () => {
  return {
    type: actionTypes.LOGIN_REQUEST
  };
};

const loginSuccess = (user) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    user
  };
};

const loginFail = () => {
  return {
    type: actionTypes.LOGIN_FAILURE
  };
};

export const login = () => {
  return (dispatch) => {
    dispatch(requestLogin());

    steemConnect.isAuthenticated((err, result) => {
      if (result.isAuthenticated) {
        dispatch(getFollowing({
          follower: result.username,
        }));

        api.getAccounts([result.username], (err, users) => {
          dispatch(loginSuccess(users[0]));
        });
      } else {
        dispatch(loginFail());
      }
    });
  };
};
