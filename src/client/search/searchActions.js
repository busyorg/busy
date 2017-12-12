import _ from 'lodash';
import { createAsyncActionType } from '../helpers/stateHelpers';
import { getLookupAccountNames, getAllSearchResultPages } from '../helpers/apiHelpers';

export const SEARCH_ASK_STEEM = createAsyncActionType('@search/SEARCH_ASK_STEEM');
export const AUTO_COMPLETE_SEARCH = createAsyncActionType('@search/AUTO_COMPLETE_SEARCH');

export const searchAskSteem = search => dispatch =>
  dispatch({
    type: SEARCH_ASK_STEEM.ACTION,
    payload: {
      promise: getAllSearchResultPages(search)
        .then((response) => {
          let mergedResults = [];
          _.each(response, (element) => {
            mergedResults = _.concat(mergedResults, element.results);
          });

          return _.reverse(_.sortBy(mergedResults, ['type', 'created']));
        })
        .catch(() => dispatch({ type: SEARCH_ASK_STEEM.ERROR, error: true })),
    },
  });

export const searchAutoComplete = search => dispatch =>
  dispatch({
    type: AUTO_COMPLETE_SEARCH.ACTION,
    payload: {
      promise: getLookupAccountNames(search).then(result => ({
        result,
        search,
      })),
    },
  });
