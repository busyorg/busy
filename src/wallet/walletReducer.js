import * as walletActions from './walletActions';

const initialState = {
  transferVisible: false,
  transferTo: '',
  totalVestingShares: '',
  totalVestingFundSteem: '',
  usersTransactions: {},
  usersEstAccountsValues: {},
  usersTransactionsLoading: true,
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
    case walletActions.GET_GLOBAL_PROPERTIES.SUCCESS: {
      return {
        ...state,
        totalVestingFundSteem: action.payload.total_vesting_fund_steem,
        totalVestingShares: action.payload.total_vesting_shares,
      };
    }
    case walletActions.GET_USER_TRANSACTIONS.START:
      return {
        ...state,
        usersTransactionsLoading: true,
      };
    case walletActions.GET_USER_TRANSACTIONS.SUCCESS: {
      const { username, transactions } = action.payload;
      return {
        ...state,
        usersTransactions: {
          ...state.usersTransactions,
          [username]: transactions,
        },
        usersTransactionsLoading: false,
      };
    }
    case walletActions.GET_USER_EST_ACCOUNT_VALUE.SUCCESS: {
      const { username, value } = action.payload;
      return {
        ...state,
        usersEstAccountsValues: {
          ...state.usersEstAccountsValues,
          [username]: value,
        },
      };
    }
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
export const getUsersTransactionsLoading = state => state.usersTransactionsLoading;
