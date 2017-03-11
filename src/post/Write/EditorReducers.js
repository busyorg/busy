import _ from 'lodash';
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
        success: false
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
      const { postData, rawBody } = action.payload;
      const id = action.payload.id;
      return {
        ...state,
        draftPosts: { ...state.draftPosts, [id]: { postData, rawBody } }
      };
    }
    case editorActions.DELETE_DRAFT:
      return {
        ...state,
        draftPosts: _.omit(state.draftPosts, action.payload)
      };

    case userActions.UPLOAD_FILE_START:
      return { ...state, loading: true };

    case userActions.UPLOAD_FILE_ERROR:
    case userActions.UPLOAD_FILE_SUCCESS:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default editor;
