import * as settingsTypes from './settingsActions';

const initialState = {
  locale: 'auto',
  votingPower: 'auto',
  loading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case settingsTypes.SAVE_SETTINGS_START:
      return {
        ...state,
        loading: true,
      };
    case settingsTypes.SAVE_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        locale: action.payload.locale,
        votingPower: action.payload.votingPower,
      };
    case settingsTypes.SAVE_SETTINGS_ERROR:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};
