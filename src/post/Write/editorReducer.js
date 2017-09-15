import * as authActions from '../../auth/authActions';
import * as editorActions from './editorActions';
import * as userActions from '../../user/userActions';

const defaultState = {
  loading: false,
  error: null,
  success: false,
  saving: false,
  draftPosts: {},
  pendingDrafts: [],
  editedPosts: [],
};

const editor = (state = defaultState, action) => {
  switch (action.type) {
    case editorActions.ADD_EDITED_POST:
      return {
        ...state,
        editedPosts: [
          ...state.editedPosts,
          action.payload,
        ],
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
      };
    case editorActions.NEW_POST:
      return {
        ...state,
        loading: false,
        error: null,
        success: false,
        loadingImg: false,
      };
    case editorActions.CREATE_POST_START:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case editorActions.CREATE_POST_ERROR:
      return {
        ...state,
        error: action.payload.result,
        loading: false,
        success: false,
      };
    case editorActions.CREATE_POST_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        success: true,
      };
    case editorActions.SAVE_DRAFT_START:
      return {
        ...state,
        saving: true,
      };
    case editorActions.SAVE_DRAFT_SUCCESS:
      return {
        ...state,
        draftPosts: { ...state.draftPosts, [action.meta.postId]: action.payload },
        saving: false,
      };
    case editorActions.SAVE_DRAFT_ERROR:
      return {
        ...state,
        saving: false,
      };
    case editorActions.DELETE_DRAFT_START:
      return {
        ...state,
        pendingDrafts: [
          ...state.pendingDrafts,
          action.meta.id,
        ],
      };
    case editorActions.DELETE_DRAFT_SUCCESS: {
      return {
        ...state,
        draftPosts: action.payload,
        pendingDrafts: state.pendingDrafts.filter(id => id !== action.meta.id),
      };
    }
    case editorActions.DELETE_DRAFT_ERROR:
      return {
        ...state,
        pendingDrafts: state.pendingDrafts.filter(id => id !== action.meta.id),
      };
    case userActions.UPLOAD_FILE_START:
      return { ...state, loadingImg: true };

    case userActions.UPLOAD_FILE_ERROR:
    case userActions.UPLOAD_FILE_SUCCESS:
      return { ...state, loadingImg: false };
    default:
      return state;
  }
};

export default editor;

export const getDraftPosts = state => state.draftPosts;
export const getIsEditorLoading = state => state.loading;
export const getIsEditorSaving = state => state.saving;
export const getPendingDrafts = state => state.pendingDrafts;
