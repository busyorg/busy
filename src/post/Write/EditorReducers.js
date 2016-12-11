import * as editorActions from './EditorActions';

const defaultState = {
  loading: false,
  error: null,
  success: false
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
    default:
      return state;
  }
};

export default editor;
