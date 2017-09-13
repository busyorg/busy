import * as authActions from '../../auth/authActions';
import * as editorActions from './editorActions';
import * as userActions from '../../user/userActions';

const defaultState = {
  loading: false,
  error: null,
  success: false,
  draftPosts: {},
  pendingDrafts: [],
};

const editor = (state = defaultState, action) => {
  switch (action.type) {
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
    case editorActions.SAVE_DRAFT_SUCCESS: {
      return {
        ...state,
        draftPosts: { ...state.draftPosts, [action.meta.postId]: action.payload },
      };
    }
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
export const getPendingDrafts = state => state.pendingDrafts;
