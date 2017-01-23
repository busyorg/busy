import Promise from 'bluebird';
import fetch from 'isomorphic-fetch';
import steemConnect from 'steemconnect';

import { getAllFollowing } from '../helpers/apiHelpers';

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

export const UPLOAD_FILE = 'UPLOAD_FILE';
export const UPLOAD_FILE_START = 'UPLOAD_FILE_START';
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS';
export const UPLOAD_FILE_ERROR = 'UPLOAD_FILE_ERROR';

export function uploadFile({ username, file, fileInput }) {
  const meta = {};
  const fileDetails = {};
  if (file) {
    fileDetails.file = file;
    fileDetails.name = file.name;
    fileDetails.type = file.type;
    meta.filename = file.name;
  } else if (fileInput) {
    fileDetails.file = fileInput.files[0];
    fileDetails.name = fileInput.files[0].name;
    fileDetails.type = fileInput.files[0].type;
    meta.filename = fileInput.files[0].name;
  } else {
    throw new TypeError('Missing one of `file` or `fileInput` to `uploadFile` call');
  }

  return (dispatch) => dispatch({
    meta,
    type: UPLOAD_FILE,
    payload: {
      promise: new Promise((resolve, reject) => {
        const request = new global.XMLHttpRequest();
        request.open('POST', `${process.env.STEEMCONNECT_IMG_HOST}/@${username}/uploads`, true);
        // Send the proper header information along with the request
        request.setRequestHeader('Content-Type', fileDetails.type);
        request.onreadystatechange = () => {
          if (request.readyState === 4 && request.status === 201) {
            return resolve(JSON.parse(request.response));
          } else if (request.status >= 400) {
            return reject(JSON.parse(request.response));
          }
        };
        request.send(fileDetails.file);
      }),
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
      promise: fetch(`${process.env.STEEMCONNECT_IMG_HOST}/@${username}/uploads`)
        .then(res => res.json()),
    },
  });
}

steemConnect.follow = Promise.promisify(steemConnect.follow, { context: steemConnect });
steemConnect.unfollow = Promise.promisify(steemConnect.unfollow, { context: steemConnect });

export const FOLLOW_USER = '@user/FOLLOW_USER';
export const FOLLOW_USER_START = '@user/FOLLOW_USER_START';
export const FOLLOW_USER_SUCCESS = '@user/FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_ERROR = '@user/FOLLOW_USER_ERROR';

export const followUser = (username) => {
  return (dispatch, getState) => {
    const { auth } = getState();
    if (!auth.isAuthenticated) {
      return;
    }

    dispatch({
      type: FOLLOW_USER,
      payload: {
        promise: steemConnect.follow(auth.user.name, username),
      },
      meta: {
        username
      }
    });
  }
};

export const UNFOLLOW_USER = '@user/UNFOLLOW_USER';
export const UNFOLLOW_USER_START = '@user/UNFOLLOW_USER_START';
export const UNFOLLOW_USER_SUCCESS = '@user/UNFOLLOW_USER_SUCCESS';
export const UNFOLLOW_USER_ERROR = '@user/UNFOLLOW_USER_ERROR';

export const unfollowUser = (username) => {
  return (dispatch, getState) => {
    const { auth } = getState();
    if (!auth.isAuthenticated) {
      return;
    }
    dispatch({
      type: UNFOLLOW_USER,
      payload: {
        promise: steemConnect.unfollow(auth.user.name, username),
      },
      meta: {
        username
      }
    });
  }
};

export const GET_FOLLOWING = '@user/GET_FOLLOWING';
export const GET_FOLLOWING_START = '@user/GET_FOLLOWING_START';
export const GET_FOLLOWING_SUCCESS = '@user/GET_FOLLOWING_SUCCESS';
export const GET_FOLLOWING_ERROR = '@user/GET_FOLLOWING_ERROR';


export const getFollowing = (userName = '') => {
  return (dispatch, getState) => {
    const { auth } = getState();

    if (!userName && !auth.isAuthenticated) {
      return;
    }

    const targetUsername = userName || auth.user.name;

    dispatch({
      type: GET_FOLLOWING,
      meta: targetUsername,
      payload: {
        promise: getAllFollowing(userName),
      }
    });
  };
};
