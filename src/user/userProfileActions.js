import Promise from 'bluebird';
import fetch from 'isomorphic-fetch';

import * as actionTypes from './userProfileActionTypes';

export const GET_USER_COMMENTS = 'GET_USER_COMMENTS';
export const GET_USER_COMMENTS_START = 'GET_USER_COMMENTS_START';
export const GET_USER_COMMENTS_SUCCESS = 'GET_USER_COMMENTS_SUCCESS';
export const GET_USER_COMMENTS_ERROR = 'GET_USER_COMMENTS_ERROR';

export const GET_MORE_USER_COMMENTS = 'GET_MORE_USER_COMMENTS';
export const GET_MORE_USER_COMMENTS_START = 'GET_MORE_USER_COMMENTS_START';
export const GET_MORE_USER_COMMENTS_SUCCESS = 'GET_MORE_USER_COMMENTS_SUCCESS';
export const GET_MORE_USER_COMMENTS_ERROR = 'GET_MORE_USER_COMMENTS_ERROR';

export const getUserComments = (username) => {
  return (dispatch, getState, { steemAPI }) => {
    const feed = getState().feed;
    if (feed.comments[username] && feed.comments[username].isLoaded) {
      return;
    }

    const steemGetState = Promise.promisify(steemAPI.getState, { context: steemAPI });

    dispatch({
      type: actionTypes.GET_USER_COMMENTS,
      payload: {
        promise: steemGetState(`@${username}/posts`),
      },
      meta: { username }
    });
  };
};

export const getMoreUserComments = (username, limit) => {
  return (dispatch, getState, { steemAPI }) => {
    const { feed, comments } = getState();
    if (feed.comments[username] && feed.comments[username].isLoaded) {
      return;
    }

    const getDiscussionsByComments = Promise.promisify(
        steemAPI.getDiscussionsByComments, { context: steemAPI });

    const userComments = getUserCommentsFromState(username, feed, comments);
    const startAuthor = userComments[userComments.length - 1].author;
    const startPermlink = userComments[userComments.length - 1].permlink;

    dispatch({
      type: actionTypes.GET_MORE_USER_COMMENTS,
      payload: {
        promise: getDiscussionsByComments({
          start_author: startAuthor,
          start_permlink: startPermlink,
          limit,
        }),
      },
      meta: { username }
    });
  };
};

/*!
 * busy-img actions
 */

const BUSY_IMG_HOST = process.env.BUSY_IMG_HOST || 'https://img.busy6.com';

export const UPLOAD_FILE = 'UPLOAD_FILE';
export const UPLOAD_FILE_START = 'UPLOAD_FILE_START';
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS';
export const UPLOAD_FILE_ERROR = 'UPLOAD_FILE_ERROR';

export function uploadFile({ username, file, fileInput }) {
  const formData = new FormData();
  const meta = {};

  if (file) {
    formData.append('file', file);
    meta.filename = file.name;
  } else if (fileInput) {
    formData.append('file', fileInput.files[0]);
    meta.filename = fileInput.files[0].name;
  } else {
    throw new TypeError('Missing one of `file` or `fileInput` to `uploadFile` call');
  }

  return (dispatch) => dispatch({
    meta,
    type: UPLOAD_FILE,
    payload: {
      promise: fetch(`${BUSY_IMG_HOST}/@${username}/uploads`, {
        method: 'post',
        body: formData,
        origin: true,
      }).then(res => res.json()),
    }
  });
}

export const FETCH_FILES = 'FETCH_FILES';
export const FETCH_FILES_START = 'FETCH_FILES_START';
export const FETCH_FILES_SUCCESS = 'FETCH_FILES_SUCCESS';
export const FETCH_FILES_ERROR = 'FETCH_FILES_ERROR';

export function fetchFiles({ username }) {
  return (dispatch) => dispatch({
    type: FETCH_FILES,
    payload: {
      promise: fetch(`${BUSY_IMG_HOST}/@${username}/uploads`)
        .then(res => res.json()),
    },
  });
}
