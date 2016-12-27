import { createAction } from 'redux-actions';
import * as localStorageHelpers from './helpers/localStorageHelpers';

const api = require('./steemAPI');

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

export const getConfig = () =>
  (dispatch) => {
    dispatch({ type: CONFIG_REQUEST });
    api.getConfig((err, config) => {
      dispatch({
        type: CONFIG_SUCCESS,
        config,
      });
    });
  };

export const SHOW_SIDEBAR = '@app/SHOW_SIDEBAR';
export const HIDE_SIDEBAR = '@app/HIDE_SIDEBAR';

export const showSidebar = () =>
  (dispatch) => {
    dispatch({ type: SHOW_SIDEBAR });
  };

export const hideSidebar = () =>
  (dispatch) => {
    dispatch({ type: HIDE_SIDEBAR });
  };

export const GET_LAYOUT = '@app/GET_LAYOUT';
export const SET_LAYOUT = '@app/SET_LAYOUT';
export const getLayoutRequest = createAction(GET_LAYOUT);
export const setLayoutRequest = createAction(SET_LAYOUT);

export const getLayout = () =>
  (dispatch) => {
    const layout = localStorageHelpers.getLayout();
    dispatch(getLayoutRequest({ layout }));
  };

export const setLayout = layout =>
  (dispatch) => {
    localStorageHelpers.setLayout(layout);
    dispatch(setLayoutRequest({ layout }));
  };

export const GET_LOCALE = '@app/GET_LOCALE';
export const SET_LOCALE = '@app/SET_LOCALE';
export const getLocaleRequest = createAction(GET_LOCALE);
export const setLocaleRequest = createAction(SET_LOCALE);

export const getLocale = () =>
  (dispatch) => {
    const locale = localStorageHelpers.getLocale();
    dispatch(getLocaleRequest({ locale }));
  };

export const setLocale = locale =>
  (dispatch) => {
    localStorageHelpers.setLocale(locale);
    dispatch(setLocaleRequest({ locale }));
  };
