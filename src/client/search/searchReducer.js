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
      const results = _.get(action.payload, 'results', []);
      return {
        ...state,
        searchResults: results,
        loading: false,
      };
    }
    case searchActions.SEARCH_ASK_STEEM.ERROR:
      return {
        ...state,
        loading: false,
        searchError: true,
      };

    case searchActions.AUTO_COMPLETE_SEARCH.SUCCESS: {
      return {
        ...state,
        autoCompleteSearchResults: action.payload,
      };
    }
    default:
      return state;
  }
};

export const getSearchLoading = state => state.loading;
export const getSearchResults = state => state.searchResults;
export const getAutoCompleteSearchResults = state => state.autoCompleteSearchResults;
