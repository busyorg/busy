import * as walletActions from './walletActions';

const initialState = {
  history: {},
};

const wallet = (state = initialState, action) => {
  switch (action.type) {
    case walletActions.GET_WALLET_SUCCESS:
      return {
        history: {
          [action.meta.username]: action.payload.history,
        },
      };
    default:
      return state;
  }
};

export default wallet;
