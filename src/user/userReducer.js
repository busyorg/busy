import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';

import * as actions from './userActions';

const initialState = {
  // Map<FilePublicId, File>
  files: {},
  // Whether a file is uploading.
  // Map<FileName, Bool>
  fileUploadIsLoading: {},
  fileUploadError: null,
  filesFetchError: null,
  filesFetchIsLoading: true,
  following: {
    list: [],
    pendingFollows: [],
    isFetching: false,
  },
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.UPLOAD_FILE_START: {
      return {
        ...state,
        fileUploadIsLoading: {
          ...state.fileUploadIsLoading,
          [action.meta.filename]: true,
        },
        fileUploadError: null,
      };
    }
    case actions.UPLOAD_FILE_SUCCESS: {
      return {
        ...state,
        files: {
          ...state.files,
          [action.payload.public_id]: action.payload,
        },
        fileUploadIsLoading: omit(state.fileUploadIsLoading, [action.meta.filename]),
        fileUploadError: null,
      };
    }
    case actions.UPLOAD_FILE_ERROR: {
      return {
        ...state,
        fileUploadIsLoading: omit(state.fileUploadIsLoading, [action.meta.filename]),
        fileUploadError: action.payload,
      };
    }
    case actions.FETCH_FILES_START: {
      return {
        ...state,
        filesFetchIsLoading: true,
        filesFetchError: null,
      };
    }
    case actions.FETCH_FILES_SUCCESS: {
      return {
        ...state,
        files: keyBy(action.payload, 'public_id'),
        filesFetchIsLoading: false,
        filesFetchError: null,
      };
    }
    case actions.FETCH_FILES_ERROR: {
      return {
        ...state,
        filesFetchIsLoading: false,
        filesFetchError: action.payload,
      };
    }
    case actions.GET_FOLLOWING_START:
      return {
        ...state,
        following: {
          ...state.following,
          list: [],
          isFetching: true,
        },
      };
    case actions.GET_FOLLOWING_ERROR:
      return {
        ...state,
        following: {
          ...state.following,
          list: [],
          isFetching: false,
        },
      };
    case actions.GET_FOLLOWING_SUCCESS:
      return {
        ...state,
        following: {
          ...state.following,
          list: action.payload,
          isFetching: false,
        },
      };
    case actions.FOLLOW_USER_START:
    case actions.UNFOLLOW_USER_START:
      return {
        ...state,
        following: {
          ...state.following,
          pendingFollows: [...state.following.pendingFollows, action.meta.username],
        },
      };
    case actions.FOLLOW_USER_SUCCESS:
      return {
        ...state,
        following: {
          ...state.following,
          list: [...state.following.list, action.meta.username],
          pendingFollows: state.following.pendingFollows.filter(
            user => user !== action.meta.username,
          ),
        },
      };
    case actions.UNFOLLOW_USER_SUCCESS:
      return {
        ...state,
        following: {
          ...state.following,
          list: state.following.list.filter(user => user !== action.meta.username),
          pendingFollows: state.following.pendingFollows.filter(
            user => user !== action.meta.username,
          ),
        },
      };

    case actions.FOLLOW_USER_ERROR:
    case actions.UNFOLLOW_USER_ERROR:
      return {
        ...state,
        following: {
          ...state.following,
          pendingFollows: state.following.pendingFollows.filter(
            user => user !== action.meta.username,
          ),
        },
      };
    default: {
      return state;
    }
  }
}

export const getFollowingList = state => state.following.list;
export const getPendingFollows = state => state.following.pendingFollows;
