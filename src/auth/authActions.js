import * as actionTypes from './authActionTypes';
import steemConnect from 'steemconnect';
import api from '../steemAPI';

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
        api.getAccounts([result.username], (err, users) => {
          dispatch(loginSuccess(users[0]));
        });
      } else {
        dispatch(loginFail());
      }
    });
  };
};
