import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';

import * as actions from './userProfileActions';

const initialState = {
  // Map<FilePublicId, File>
  files: {},
  // Whether a file is uploading.
  // Map<FileName, Bool>
  fileUploadIsLoading: {},
  fileUploadError: null,

  filesFetchError: null,
  filesFetchIsLoading: true,
};

export default function userProfileReducer(state = initialState, action) {
  switch (action.type) {
    case actions.UPLOAD_FILE_START: {
      return Object.assign({}, state, {
        fileUploadIsLoading: Object.assign({}, state.fileUploadIsLoading, {
          [`${action.meta.filename}`]: true,
        }),
        fileUploadError: null,
      });
    }

    case actions.UPLOAD_FILE_SUCCESS: {
      return Object.assign({}, state, {
        files: Object.assign({}, state.files, {
          [`${action.payload.public_id}`]: action.payload,
        }),
        fileUploadIsLoading: omit(state.fileUploadIsLoading, [
          action.meta.filename,
        ]),
        fileUploadError: null,
      });
    }

    case actions.UPLOAD_FILE_ERROR: {
      return Object.assign({}, state, {
        fileUploadIsLoading: omit(state.fileUploadIsLoading, [
          action.meta.filename,
        ]),
        fileUploadError: action.payload,
      });
    }

    case actions.FETCH_FILES_START: {
      return Object.assign({}, state, {
        filesFetchIsLoading: true,
        filesFetchError: null,
      });
    }

    case actions.FETCH_FILES_SUCCESS: {
      return Object.assign({}, state, {
        files: keyBy(action.payload, 'public_id'),
        filesFetchIsLoading: false,
        filesFetchError: null,
      });
    }

    case actions.FETCH_FILES_ERROR: {
      return Object.assign({}, state, {
        filesFetchIsLoading: false,
        filesFetchError: action.payload,
      });
    }

    default: {
      return state;
    }
  }
}
