import {
  OPEN_TRANSFER,
  CLOSE_TRANSFER,
  GET_GLOBAL_PROPERTIES,
  GET_USER_TRANSACTIONS,
  GET_USER_EST_ACCOUNT_VALUE,
} from './walletActions';

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
    case OPEN_TRANSFER:
      return {
        ...state,
        transferVisible: true,
        transferTo: action.payload,
      };
    case CLOSE_TRANSFER:
      return {
        ...state,
        transferVisible: false,
      };
    case GET_GLOBAL_PROPERTIES.SUCCESS: {
      const { total_vesting_shares, total_vesting_fund_steem } = action.payload;
      return {
        ...state,
        totalVestingFundSteem: total_vesting_fund_steem,
        totalVestingShares: total_vesting_shares,
      };
    }
    case GET_USER_TRANSACTIONS.PENDING:
      return {
        ...state,
        usersTransactionsLoading: true,
      };
    case GET_USER_TRANSACTIONS.SUCCESS: {
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
    case GET_USER_EST_ACCOUNT_VALUE.SUCCESS: {
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
