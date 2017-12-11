import { createAsyncActionType } from '../helpers/stateHelpers';
import { getLookupAccountNames } from '../helpers/apiHelpers';

export const SEARCH_ASK_STEEM = createAsyncActionType('@search/SEARCH_ASK_STEEM');
export const AUTO_COMPLETE_SEARCH = createAsyncActionType('@search/AUTO_COMPLETE_SEARCH');

export const searchAskSteem = search => dispatch =>

  dispatch({
    type: SEARCH_ASK_STEEM.ACTION,
    payload: {
      promise: fetch(`https://api.asksteem.com/search?q=${search}*&types=user,post`)
        .then(res => res.json())
        .catch(() => dispatch({ type: SEARCH_ASK_STEEM.ERROR, error: true })),
    },
  });

export const searchAutoComplete = name => dispatch =>
  dispatch({
    type: AUTO_COMPLETE_SEARCH.ACTION,
    payload: {
      promise: getLookupAccountNames(name),
    },
  });
