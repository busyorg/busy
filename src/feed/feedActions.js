import { createAction } from 'redux-actions';
import * as actionTypes from './feedActionTypes';
import { api } from './../steemAPI';

export const getFeedContentWithoutAPI = createAction(actionTypes.GET_FEED_CONTENT);
export const getFeedContentSuccess = createAction(actionTypes.GET_FEED_CONTENT_SUCCESS);

export const getFeedContent = (path) => {
  return (dispatch, getState) => {
    dispatch(getFeedContentWithoutAPI());

  };
};

