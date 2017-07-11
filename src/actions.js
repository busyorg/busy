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

export const SET_LAYOUT = '@app/SET_LAYOUT';
export const setLayoutAction = createAction(SET_LAYOUT);

export const setLayout = layout =>
  (dispatch) => {
    dispatch(setLayoutAction({ layout }));
  };

export const SET_CURRENT_CONTENT = '@app/SET_CURRENT_CONTENT';
export const REMOVE_CURRENT_CONTENT = '@app/REMOVE_CURRENT_CONTENT';

export const setCurrentContent = content => (dispatch) => {
  dispatch({
    type: SET_CURRENT_CONTENT,
    payload: content,
  });
};

export const removeCurrentContent = () =>
  (dispatch) => {
    dispatch({
      type: REMOVE_CURRENT_CONTENT,
    });
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
    fetch('https://api.cryptonator.com/api/ticker/steem-usd')
      .then(res => res.json())
      .then((json) => {
        const rate = json.ticker.price;
        dispatch({
          type: RATE_SUCCESS,
          rate,
        });
      });
  };
