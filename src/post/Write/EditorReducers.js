import * as editorActions from './EditorActions';

const defaultState = {
  __persist: ['draftPosts'],
  loading: false,
  error: null,
  success: false,
  draftPosts: {}
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
    case editorActions.SAVE_DRAFT: {
      const { postData, rawBody } = action.payload;
      const id = action.payload.id || Date.now().toString(16);
      return { ...defaultState,
        draftPosts: Object.assign({}, state.draftPosts, { [id]: { postData, rawBody } })
      };
    }
    default:
      return state;
  }
};

export default editor;
