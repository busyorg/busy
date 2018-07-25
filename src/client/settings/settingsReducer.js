import * as settingsTypes from './settingsActions';
import * as authTypes from '../auth/authActions';
import { rewardsValues } from '../../common/constants/rewards';

const initialState = {
  locale: 'auto',
  votingPower: 'auto',
  votePercent: 10000,
  showNSFWPosts: false,
  nightmode: false,
  rewriteLinks: false,
  loading: false,
  upvoteSetting: true,
  exitPageSetting: true,
  rewardSetting: rewardsValues.half,
  useBeta: false,
};

const settings = (state = initialState, action) => {
  switch (action.type) {
    case authTypes.LOGIN_SUCCESS:
    case authTypes.RELOAD_SUCCESS:
      if (action.meta && action.meta.refresh) return state;
      if (action.payload.user_metadata && action.payload.user_metadata.settings) {
        const {
          locale,
          votingPower,
          votePercent,
          showNSFWPosts,
          nightmode,
          rewriteLinks,
          upvoteSetting,
          exitPageSetting,
          rewardSetting,
          useBeta,
        } = action.payload.user_metadata.settings;
        return {
          ...state,
          locale: locale || initialState.locale,
          votingPower: votingPower || initialState.votingPower,
          votePercent: votePercent || initialState.votePercent,
          showNSFWPosts: showNSFWPosts || initialState.showNSFWPosts,
          nightmode: nightmode || initialState.nightmode,
          rewriteLinks:
            typeof rewriteLinks === 'boolean' ? rewriteLinks : initialState.rewriteLinks,
          upvoteSetting:
            typeof upvoteSetting === 'boolean' ? upvoteSetting : initialState.upvoteSetting,
          exitPageSetting:
            typeof exitPageSetting === 'boolean' ? exitPageSetting : initialState.exitPageSetting,
          rewardSetting: rewardSetting || initialState.rewardSetting,
          useBeta: typeof useBeta === 'boolean' ? useBeta : initialState.useBeta,
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
        showNSFWPosts: action.payload.showNSFWPosts,
        nightmode: action.payload.nightmode,
        rewriteLinks: action.payload.rewriteLinks,
        upvoteSetting: action.payload.upvoteSetting,
        exitPageSetting: action.payload.exitPageSetting,
        rewardSetting: action.payload.rewardSetting,
        useBeta: !!action.payload.useBeta,
      };
    case settingsTypes.SAVE_SETTINGS_ERROR:
      return {
        ...state,
        loading: false,
      };
    case settingsTypes.SET_LOCALE:
      return {
        ...state,
        locale: action.payload,
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
export const getShowNSFWPosts = state => state.showNSFWPosts;
export const getNightmode = state => state.nightmode;
export const getRewriteLinks = state => !!state.rewriteLinks;
export const getUpvoteSetting = state => state.upvoteSetting;
export const getExitPageSetting = state => state.exitPageSetting;
export const getRewardSetting = state => state.rewardSetting;
export const getUseBeta = state => state.useBeta;
