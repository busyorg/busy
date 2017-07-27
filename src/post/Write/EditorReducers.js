import * as editorActions from './EditorActions';
import * as userActions from '../../user/userActions';

const defaultState = {
  loading: false,
  error: null,
  success: false,
  draftPosts: {}
};

const editor = (state = defaultState, action) => {
  switch (action.type) {
    case editorActions.NEW_POST:
      return {
        ...state,
        loading: false,
        error: null,
        success: false,
        loadingImg: false
      };
    case editorActions.CREATE_POST_START:
      return {
        ...state,
        loading: true,
        error: null,
        success: false
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
        success: true
      };
    case editorActions.SAVE_DRAFT: {
      const { postData } = action.payload;
      const id = action.payload.id;
      return {
        ...state,
        draftPosts: { ...state.draftPosts, [id]: { postData } },
      };
    }
    case editorActions.DELETE_DRAFT: {
      const draftPosts = state.draftPosts;
      delete draftPosts[action.payload];
      return {
        ...state,
        ...draftPosts
      };
    }
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
