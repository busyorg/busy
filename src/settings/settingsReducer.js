import * as settingsTypes from './settingsActions';
import * as authTypes from '../auth/authActions';

const initialState = {
  locale: 'auto',
  votingPower: 'auto',
  loading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case authTypes.LOGIN_SUCCESS:
    case authTypes.RELOAD_SUCCESS:
      if (
        action.payload.user_metadata &&
        action.payload.user_metadata.settings &&
        action.payload.user_metadata.settings.locale &&
        action.payload.user_metadata.settings.votingPower
      ) {
        return {
          ...state,
          locale: action.payload.user_metadata.settings.locale,
          votingPower: action.payload.user_metadata.settings.votingPower,
        };
      }
      return state;

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

export const getIsLoading = state => state.loading;
export const getLocale = state => state.locale;
export const getVotingPower = state => state.votingPower;
