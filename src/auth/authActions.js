import Promise from 'bluebird';
import extend from 'lodash/extend';
import steemConnect from 'steemconnect';

import * as actionTypes from './authActionTypes';
import api from '../steemAPI';

Promise.promisifyAll(steemConnect);

export const GET_FOLLOWING = 'GET_FOLLOWING';
export const GET_FOLLOWING_START = 'GET_FOLLOWING_START';
export const GET_FOLLOWING_SUCCESS = 'GET_FOLLOWING_SUCCESS';
export const GET_FOLLOWING_ERROR = 'GET_FOLLOWING_ERROR';

function getFollowing(opts) {
  return (dispatch, getState) => api.startP.then(() => {
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
  return (dispatch) => api.startP.then(() => {
    dispatch(requestLogin());

    steemConnect.isAuthenticated((err, result) => {
      console.log(err, result);
      if (result.isAuthenticated) {
        dispatch(getFollowing({
          follower: result.username,
        }));

        api.getAccounts([result.username], (err, users) => {
          console.log(err, users);
          dispatch(loginSuccess(users[0]));
        });
      } else {
        dispatch(loginFail());
      }
    });
  });
};
