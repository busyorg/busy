import { createAction } from 'redux-actions';

var api = require('./steemAPI');

export const CONFIG_REQUEST = '@app/CONFIG_REQUEST';
export const CONFIG_SUCCESS = '@app/CONFIG_SUCCESS';
export const CONFIG_FAILURE = '@app/CONFIG_FAILURE';

export const FEED_REQUEST = '@app/FEED_REQUEST';
export const FEED_SUCCESS = '@app/FEED_SUCCESS';
export const FEED_FAILURE = '@app/FEED_FAILURE';
export const CONTENT_REQUEST = '@app/CONTENT_REQUEST';
export const CONTENT_SUCCESS = '@app/CONTENT_SUCCESS';
export const ACCOUNT_REQUEST = '@app/ACCOUNT_REQUEST';
export const ACCOUNT_SUCCESS = '@app/ACCOUNT_SUCCESS';

export const OPEN_POST_MODAL = '@app/OPEN_POST_MODAL';
export const CLOSE_POST_MODAL = '@app/CLOSE_POST_MODAL';

export const openPostModal = createAction(OPEN_POST_MODAL);
export const closePostModal = createAction(CLOSE_POST_MODAL);

export const getConfig = () => {
  return (dispatch, getState) => {
    var req = {type: CONFIG_REQUEST};
    dispatch(req);
    api.getConfig((err, config) => {
      var res = {
        type: CONFIG_SUCCESS,
        config: config,
      };
      dispatch(res);
    });
  };
};

export const SHOW_SIDEBAR = '@app/SHOW_SIDEBAR';
export const HIDE_SIDEBAR = '@app/HIDE_SIDEBAR';

export const showSidebar = () => {
  return (dispatch, getState) => {
    dispatch({type: SHOW_SIDEBAR});
  };
};

export const hideSidebar = () => {
  return (dispatch, getState) => {
    dispatch({type: HIDE_SIDEBAR});
  };
};

export const SET_LOCALE = '@app/SET_LOCALE';

export const setLocaleRequest = createAction(SET_LOCALE);

export const setLocale = (locale) => {
  return (dispatch) => {
    dispatch(setLocaleRequest({ locale }));
  };
};
