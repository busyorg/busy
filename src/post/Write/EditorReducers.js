import _ from 'lodash';
import * as editorActions from './EditorActions';

const defaultState = {
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
      const id = action.payload.id;
      return { ...defaultState,
        draftPosts: { ...state.draftPosts, [id]: { postData, rawBody } }
      };
    }
    case editorActions.DELETE_DRAFT:
      return { ...defaultState,
        draftPosts: _.omit(state.draftPosts, action.payload)
      };
    default:
      return state;
  }
};

export default editor;
