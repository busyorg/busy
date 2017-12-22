import _ from 'lodash';
import * as searchActions from './searchActions';

const initialState = {
  loading: false,
  searchError: false,
  searchResults: [],
  autoCompleteSearchResults: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case searchActions.SEARCH_ASK_STEEM.START:
      return {
        ...state,
        loading: true,
        searchError: false,
      };
    case searchActions.SEARCH_ASK_STEEM.SUCCESS: {
      const askSteemResults = _.get(action.payload, 0, []);
      const steemLookupResults = _.get(action.payload, 1, []);
      const formattedSteemLookupResults = _.map(steemLookupResults, name => ({
        type: 'user',
        name,
      }));
      const searchResults = _.compact(_.concat(formattedSteemLookupResults, askSteemResults));
      return {
        ...state,
        searchResults,
        loading: false,
      };
    }
    case searchActions.SEARCH_ASK_STEEM.ERROR:
      return {
        ...state,
        searchResults: [],
        loading: false,
        searchError: true,
      };
    case searchActions.AUTO_COMPLETE_SEARCH.SUCCESS: {
      const { result, search } = action.payload;
      return {
        ...state,
        autoCompleteSearchResults: _.isEmpty(search) ? [] : result,
      };
    }
    default:
      return state;
  }
};

export const getSearchLoading = state => state.loading;
export const getSearchResults = state => state.searchResults;
export const getAutoCompleteSearchResults = state => state.autoCompleteSearchResults;
