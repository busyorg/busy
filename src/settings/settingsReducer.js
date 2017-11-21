import * as settingsTypes from './settingsActions';
import * as authTypes from '../auth/authActions';

const initialState = {
  locale: 'auto',
  votingPower: 'auto',
  votePercent: 10000,
  loading: false,
};

const settings = (state = initialState, action) => {
  switch (action.type) {
    case authTypes.LOGIN_SUCCESS:
    case authTypes.RELOAD_SUCCESS:
      if (action.payload.user_metadata && action.payload.user_metadata.settings) {
        return {
          ...state,
          locale: action.payload.user_metadata.settings.locale || initialState.locale,
          votingPower:
            action.payload.user_metadata.settings.votingPower || initialState.votingPower,
          votePercent:
            action.payload.user_metadata.settings.votePercent || initialState.votePercent,
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
        votePercent: action.payload.votePercent,
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

export default settings;

export const getIsLoading = state => state.loading;
export const getLocale = state => state.locale;
export const getVotingPower = state => state.votingPower;
export const getVotePercent = state => state.votePercent;
