import * as globalPropertiesActions from './globalPropertiesActions';

const initialState = {
  loadingGlobalProperties: true,
  totalVestingShares: '',
  totalVestingFundSteem: '',
  time: null,
};

export default function globalPropertiesReducer(state = initialState, action) {
  switch (action.type) {
    case globalPropertiesActions.GET_GLOBAL_PROPERTIES.START:
      return {
        ...state,
        loadingGlobalProperties: true,
      };
    case globalPropertiesActions.GET_GLOBAL_PROPERTIES.SUCCESS: {
      return {
        ...state,
        totalVestingFundSteem: action.payload.total_vesting_fund_steem,
        totalVestingShares: action.payload.total_vesting_shares,
        time: action.payload.time,
        loadingGlobalProperties: false,
      };
    }
    case globalPropertiesActions.GET_GLOBAL_PROPERTIES.ERROR: {
      return {
        ...state,
        loadingGlobalProperties: false,
      };
    }
    default:
      return state;
  }
}

export const getTotalVestingShares = state => state.totalVestingShares;
export const getTotalVestingFundSteem = state => state.totalVestingFundSteem;
export const getTime = state => state.time;
export const getLoadingGlobalProperties = state => state.loadingGlobalProperties;
