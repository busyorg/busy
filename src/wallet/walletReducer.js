import _ from 'lodash';
import * as walletActions from './walletActions';

const initialState = {
  transferVisible: false,
  transferTo: '',
  totalVestingShares: '',
  totalVestingFundSteem: '',
  usersTransactions: {},
  usersAccountHistory: {},
  usersEstAccountsValues: {},
  usersAccountHistoryLoading: true,
  loadingEstAccountValue: true,
  loadingGlobalProperties: true,
  loadingMoreUsersAccountHistory: false,
  accountHistoryFilter: [],
};

export default function walletReducer(state = initialState, action) {
  switch (action.type) {
    case walletActions.OPEN_TRANSFER:
      return {
        ...state,
        transferVisible: true,
        transferTo: action.payload,
      };
    case walletActions.CLOSE_TRANSFER:
      return {
        ...state,
        transferVisible: false,
      };
    case walletActions.GET_GLOBAL_PROPERTIES.START:
      return {
        ...state,
        loadingGlobalProperties: true,
      };
    case walletActions.GET_GLOBAL_PROPERTIES.SUCCESS: {
      return {
        ...state,
        totalVestingFundSteem: action.payload.total_vesting_fund_steem,
        totalVestingShares: action.payload.total_vesting_shares,
        loadingGlobalProperties: false,
      };
    }
    case walletActions.GET_GLOBAL_PROPERTIES.ERROR: {
      return {
        ...state,
        loadingGlobalProperties: false,
      };
    }
    case walletActions.GET_USER_ACCOUNT_HISTORY.START:
      return {
        ...state,
        usersAccountHistoryLoading: true,
      };
    case walletActions.GET_USER_ACCOUNT_HISTORY.SUCCESS:
      return {
        ...state,
        usersTransactions: {
          ...state.usersTransactions,
          [action.payload.username]: action.payload.userWalletTransactions,
        },
        usersAccountHistory: {
          ...state.usersAccountHistory,
          [action.payload.username]: action.payload.userAccountHistory,
        },
        usersAccountHistoryLoading: false,
      };
    case walletActions.GET_USER_ACCOUNT_HISTORY.ERROR:
      return {
        ...state,
        usersAccountHistoryLoading: false,
      };
    case walletActions.GET_MORE_USER_ACCOUNT_HISTORY.START:
      return {
        ...state,
        loadingMoreUsersAccountHistory: true,
      };
    case walletActions.GET_MORE_USER_ACCOUNT_HISTORY.SUCCESS: {
      const userCurrentWalletTransactions = state.usersTransactions[action.payload.username] || [];
      const userCurrentAccountHistory = state.usersAccountHistory[action.payload.username] || [];

      return {
        ...state,
        usersTransactions: {
          ...state.usersTransactions,
          [action.payload.username]: _.uniqBy(
            userCurrentWalletTransactions.concat(action.payload.userWalletTransactions),
            'actionCount',
          ),
        },
        usersAccountHistory: {
          ...state.usersAccountHistory,
          [action.payload.username]: _.uniqBy(
            userCurrentAccountHistory.concat(action.payload.userAccountHistory),
            'actionCount',
          ),
        },
        loadingMoreUsersAccountHistory: false,
      };
    }
    case walletActions.GET_MORE_USER_ACCOUNT_HISTORY.ERROR:
      return {
        ...state,
        loadingMoreUsersAccountHistory: false,
      };
    case walletActions.GET_USER_EST_ACCOUNT_VALUE.START:
      return {
        ...state,
        loadingEstAccountValue: true,
      };
    case walletActions.GET_USER_EST_ACCOUNT_VALUE.SUCCESS:
      return {
        ...state,
        usersEstAccountsValues: {
          ...state.usersEstAccountsValues,
          [action.payload.username]: action.payload.value,
        },
        loadingEstAccountValue: false,
      };
    case walletActions.GET_USER_EST_ACCOUNT_VALUE.ERROR:
      return {
        ...state,
        loadingEstAccountValue: false,
      };
    case walletActions.UPDATE_ACCOUNT_HISTORY_FILTER:
      return {
        ...state,
        accountHistoryFilter: action.payload,
      };
    default:
      return state;
  }
}

export const getIsTransferVisible = state => state.transferVisible;
export const getTransferTo = state => state.transferTo;
export const getTotalVestingShares = state => state.totalVestingShares;
export const getTotalVestingFundSteem = state => state.totalVestingFundSteem;
export const getUsersTransactions = state => state.usersTransactions;
export const getUsersEstAccountsValues = state => state.usersEstAccountsValues;
export const getUsersAccountHistoryLoading = state => state.usersAccountHistoryLoading;
export const getLoadingEstAccountValue = state => state.loadingEstAccountValue;
export const getLoadingGlobalProperties = state => state.loadingGlobalProperties;
export const getUsersAccountHistory = state => state.usersAccountHistory;
export const getLoadingMoreUsersAccountHistory = state => state.loadingMoreUsersAccountHistory;
export const getUserHasMoreAccountHistory = (state, username) => {
  const lastAction = _.last(state.usersAccountHistory[username]) || {};
  return lastAction.actionCount !== 0;
};
export const getAccountHistoryFilter = state => state.accountHistoryFilter;
