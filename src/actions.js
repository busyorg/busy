import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch';

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

export const GET_LAYOUT = 'GET_LAYOUT';
export const GET_LOCALE = 'GET_LOCALE';

export const OPEN_POST_MODAL = '@app/OPEN_POST_MODAL';
export const CLOSE_POST_MODAL = '@app/CLOSE_POST_MODAL';

export const openPostModal = createAction(OPEN_POST_MODAL);
export const closePostModal = createAction(CLOSE_POST_MODAL);

export const getConfig = () =>
  (dispatch, getState, { steemAPI }) => {
    dispatch({ type: CONFIG_REQUEST });
    steemAPI.getConfig((err, config) => {
      dispatch({
        type: CONFIG_SUCCESS,
        config,
      });
    });
  };

export const SHOW_SIDEBAR = '@app/SHOW_SIDEBAR';
export const showSidebar = createAction(SHOW_SIDEBAR);

export const HIDE_SIDEBAR = '@app/HIDE_SIDEBAR';
export const hideSidebar = createAction(HIDE_SIDEBAR);

export const SET_LAYOUT = '@app/SET_LAYOUT';
export const setLayoutAction = createAction(SET_LAYOUT);

export const setLayout = layout =>
  (dispatch) => {
    dispatch(setLayoutAction({ layout }));
  };

export const SET_LOCALE = '@app/SET_LOCALE';
export const setLocaleAction = createAction(SET_LOCALE);

export const setLocale = locale =>
  (dispatch) => {
    dispatch(setLocaleAction({ locale }));
  };

export const RATE_REQUEST = '@app/RATE_REQUEST';
export const RATE_SUCCESS = '@app/RATE_SUCCESS';

export const getRate = () =>
  (dispatch) => {
    dispatch({ type: RATE_REQUEST });
    fetch('https://api.coinmarketcap.com/v1/ticker/steem/?convert=EUR')
      .then(res => res.json())
      .then((json) => {
        const rate = json[0].price_usd;
        dispatch({
          type: RATE_SUCCESS,
          rate,
        });
      });
  };

export const SIDEBAR_LOADING = '@app/SIDEBAR_LOADING';
export const sidebarLoading = createAction(SIDEBAR_LOADING);
export const SIDEBAR_LOADED = '@app/SIDEBAR_LOADED';
export const sidebarLoaded = createAction(SIDEBAR_LOADED);

export const getSidebarData = () => (dispatch, getState, { steemAPI }) => {
  dispatch(sidebarLoading());
  steemAPI.getState('trending/busy', (err, result) => {
    let categories = (result.category_idx && result.category_idx.trending)
        || (result.tag_idx && result.tag_idx.trending);
    categories = categories.filter(Boolean);
    dispatch(sidebarLoaded({ categories, props: result.props }));
  });
};
