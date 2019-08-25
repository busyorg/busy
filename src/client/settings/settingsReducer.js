import * as settingsTypes from './settingsActions';
import * as authTypes from '../auth/authActions';
import { rewardsValues } from '../../common/constants/rewards';
import { USER_METADATA_KEY } from '../helpers/constants';

const initialState = {
  locale: 'auto',
  votingPower: 'on', // due to initial voting setting loading problem, set to on.
  votePercent: 10000,
  showNSFWPosts: false,
  nightmode: false,
  rewriteLinks: false,
  loading: false,
  exitPageSetting: true,
  rewardSetting: rewardsValues.half,
  useBeta: false,
};

const settings = (state = initialState, action) => {
  switch (action.type) {
    case authTypes.LOGIN_SUCCESS:
      try {
        const {
          locale,
          votingPower,
          votePercent,
          showNSFWPosts,
          nightmode,
          rewriteLinks,
          exitPageSetting,
          rewardSetting,
          useBeta,
        } = JSON.parse(localStorage.getItem(USER_METADATA_KEY)).settings;
        return {
          ...state,
          locale: locale || initialState.locale,
          votingPower: votingPower || initialState.votingPower,
          votePercent: votePercent || initialState.votePercent,
          showNSFWPosts: showNSFWPosts || initialState.showNSFWPosts,
          nightmode: nightmode || initialState.nightmode,
          rewriteLinks:
            typeof rewriteLinks === 'boolean' ? rewriteLinks : initialState.rewriteLinks,
          exitPageSetting:
            typeof exitPageSetting === 'boolean' ? exitPageSetting : initialState.exitPageSetting,
          rewardSetting: rewardSetting || initialState.rewardSetting,
          useBeta: typeof useBeta === 'boolean' ? useBeta : initialState.useBeta,
        };
      } catch (error) {
        // this is due to localStorage hasn't been ready. Can be ignored. but reload is needed for VP settings.
        console.log(error);
        return state;
      }
    case authTypes.RELOAD_SUCCESS:
      if (action.meta && action.meta.refresh) return state;
      if (action.payload && action.payload.settings) {
        const {
          locale,
          votingPower,
          votePercent,
          showNSFWPosts,
          nightmode,
          rewriteLinks,
          exitPageSetting,
          rewardSetting,
          useBeta,
        } = action.payload.settings;
        return {
          ...state,
          locale: locale || initialState.locale,
          votingPower: votingPower || initialState.votingPower,
          votePercent: votePercent || initialState.votePercent,
          showNSFWPosts: showNSFWPosts || initialState.showNSFWPosts,
          nightmode: nightmode || initialState.nightmode,
          rewriteLinks:
            typeof rewriteLinks === 'boolean' ? rewriteLinks : initialState.rewriteLinks,
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
export const getExitPageSetting = state => state.exitPageSetting;
export const getRewardSetting = state => state.rewardSetting;
export const getUseBeta = state => state.useBeta;
