import * as authActions from '../../auth/authActions';
import * as editorActions from './editorActions';
import * as postActions from '../postActions';

const defaultState = {
  loading: false,
  error: null,
  success: false,
  saving: false,
  draftPosts: {},
  pendingDrafts: [],
  editedPosts: [],
  upvoteSetting: true,
  rewardSetting: '50',
};

const editor = (state = defaultState, action) => {
  switch (action.type) {
    case editorActions.ADD_EDITED_POST:
      return {
        ...state,
        editedPosts: [...state.editedPosts, action.payload],
      };
    case postActions.GET_CONTENT_SUCCESS:
      return {
        ...state,
        editedPosts: state.editedPosts.filter(post => post !== action.payload.permlink),
      };
    case editorActions.DELETE_EDITED_POST:
      return {
        ...state,
        editedPosts: state.editedPosts.filter(post => post !== action.payload),
      };
    case authActions.LOGIN_SUCCESS:
      return {
        ...state,
        draftPosts: action.payload.user_metadata.drafts || defaultState.draftPosts,
        upvoteSetting: action.payload.user_metadata.settings.upvoteSetting || false,
        rewardSetting: action.payload.user_metadata.settings.rewardSetting
          || defaultState.rewardSetting,
      };
    case editorActions.NEW_POST:
      return {
        ...state,
        loading: false,
        error: null,
        success: false,
        loadingImg: false,
      };
    case editorActions.CREATE_POST.START:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case editorActions.CREATE_POST.ERROR:
      return {
        ...state,
        error: action.payload.result,
        loading: false,
        success: false,
      };
    case editorActions.CREATE_POST.SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        success: true,
      };
    case editorActions.SAVE_DRAFT.START:
      return {
        ...state,
        saving: true,
      };
    case editorActions.SAVE_DRAFT.SUCCESS:
      return {
        ...state,
        draftPosts: { ...state.draftPosts, [action.meta.postId]: action.payload },
        saving: false,
      };
    case editorActions.SAVE_DRAFT.ERROR:
      return {
        ...state,
        saving: false,
      };
    case editorActions.DELETE_DRAFT.START:
      return {
        ...state,
        pendingDrafts: [...state.pendingDrafts, action.meta.id],
      };
    case editorActions.DELETE_DRAFT.SUCCESS: {
      return {
        ...state,
        draftPosts: action.payload,
        pendingDrafts: state.pendingDrafts.filter(id => id !== action.meta.id),
      };
    }
    case editorActions.DELETE_DRAFT.ERROR:
      return {
        ...state,
        pendingDrafts: state.pendingDrafts.filter(id => id !== action.meta.id),
      };
    case editorActions.UPDATE_LAST_SETTINGS.START:
      return {
        ...state,
        saving: true,
      };
    case editorActions.UPDATE_LAST_SETTINGS.SUCCESS:
      return {
        ...state,
        upvoteSetting: action.payload.upvoteSetting,
        rewardSetting: action.payload.rewardSetting,
        saving: false,
      };
    case editorActions.UPDATE_LAST_SETTINGS.ERROR:
      return {
        ...state,
        saving: false,
      };
    default:
      return state;
  }
};

export default editor;

export const getDraftPosts = state => state.draftPosts;
export const getIsEditorLoading = state => state.loading;
export const getIsEditorSaving = state => state.saving;
export const getPendingDrafts = state => state.pendingDrafts;
export const getIsPostEdited = (state, permlink) => state.editedPosts.includes(permlink);
export const getUpvoteSetting = state => state.upvoteSetting;
export const getRewardSetting = state => state.rewardSetting;
