import { createAsyncActionType } from '../helpers/stateHelpers';

export const SEARCH_ASK_STEEM = createAsyncActionType('@search/SEARCH_ASK_STEEM');

export const searchAskSteem = search => dispatch =>
  dispatch({
    type: SEARCH_ASK_STEEM.ACTION,
    payload: {
      promise: fetch(`https://api.asksteem.com/search?q=${search}&types=user,post`)
        .then(res => res.json())
        .catch(() => dispatch({ type: SEARCH_ASK_STEEM.ERROR, error: true })),
    },
  });
