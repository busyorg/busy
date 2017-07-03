import steemConnect from 'sc2-sdk';
import { omit, assign } from 'lodash/object';
import { createCommentPermlink } from '../helpers/steemitHelpers'


export const GET_COMMENTS = 'GET_COMMENTS';
export const GET_COMMENTS_START = 'GET_COMMENTS_START';
export const GET_COMMENTS_SUCCESS = 'GET_COMMENTS_SUCCESS';
export const GET_COMMENTS_ERROR = 'GET_COMMENTS_ERROR';

export const SHOW_MORE_COMMENTS = 'SHOW_MORE_COMMENTS';

export const SEND_COMMENT = 'SEND_COMMENT';
export const SEND_COMMENT_START = 'SEND_COMMENT_START';
export const SEND_COMMENT_SUCCESS = 'SEND_COMMENT_SUCCESS';
export const SEND_COMMENT_ERROR = 'SEND_COMMENT_ERROR';

export const OPEN_COMMENTING_DRAFT = 'OPEN_COMMENTING_DRAFT';
export const UPDATE_COMMENTING_DRAFT = 'UPDATE_COMMENTING_DRAFT';
export const CLOSE_COMMENTING_DRAFT = 'CLOSE_COMMENTING_DRAFT';

export const LIKE_COMMENT = '@comments/LIKE_COMMENT';
export const LIKE_COMMENT_START = '@comments/LIKE_COMMENT_START';
export const LIKE_COMMENT_SUCCESS = '@comments/LIKE_COMMENT_SUCCESS';
export const LIKE_COMMENT_ERROR = '@comments/LIKE_COMMENT_ERROR';

export const getContentReplies = (
  { author: postAuthor, permlink: postPermlink, postId, omitAttributes = [] } = {}
) => (dispatch, getState, { steemAPI }) => {
  if (!postAuthor || !postPermlink) {
    return null;
  }
  return dispatch({
    type: GET_COMMENTS,
    payload: steemAPI
      .getContentRepliesAsync(postAuthor, postPermlink)
      .then(repliesData => assign(
        {},
        { parent_post_id: postId },
        { replies: omit(repliesData, omitAttributes) }
      )),
  });
};
