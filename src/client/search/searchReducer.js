import _ from 'lodash';
import * as searchActions from './searchActions';
import formatter from '../helpers/steemitFormatter';

const initialState = {
  loading: true,
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
      const parsedSteemLookupResults = _.map(steemLookupResults, accountDetails => ({
        ...accountDetails,
        reputation: formatter.reputation(accountDetails.reputation),
        name: accountDetails.account,
        type: 'user',
      }));
      const sortedSteemLookupResults = _.sortBy(parsedSteemLookupResults, 'reputation').reverse();
      const searchResults = _.compact(_.concat(sortedSteemLookupResults, askSteemResults));
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
      const parsedResults = _.map(result, account => ({
        ...account,
        reputation: formatter.reputation(account.reputation),
      }));
      const sortedResults = _.compact(
        _.slice(
          _.map(
            _.sortBy(parsedResults, 'reputation').reverse(),
            accountDetails => accountDetails.account,
          ),
          0,
          5,
        ),
      );
      return {
        ...state,
        autoCompleteSearchResults: _.isEmpty(search) ? [] : sortedResults,
      };
    }
    default:
      return state;
  }
};

export const getSearchLoading = state => state.loading;
export const getSearchResults = state => state.searchResults;
export const getAutoCompleteSearchResults = state => state.autoCompleteSearchResults;
