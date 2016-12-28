import * as editorActions from './EditorActions';

const defaultState = {
  __persist: ['draftPost'],
  loading: false,
  error: null,
  success: false,
  draftPost: {}
};

const editor = (state = defaultState, action) => {
  switch (action.type) {
    case editorActions.CREATE_POST_START:
      return { ...defaultState,
        loading: true
      };
    case editorActions.CREATE_POST_ERROR:
      return { ...defaultState,
        error: action.payload.result
      };
    case editorActions.CREATE_POST_SUCCESS:
      return { ...defaultState,
        success: true
      };
    case editorActions.SAVE_DRAFT:
      return { ...defaultState,
        draftPost: action.payload
      };
    default:
      return state;
  }
};

export default editor;
