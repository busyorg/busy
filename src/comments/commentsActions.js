import Promise from 'bluebird';
import { createAction } from 'redux-actions';
import SteemConnect from 'steemconnect';
import * as actionTypes from './commentsActionTypes';
import { createCommentPermlink } from './../helpers/steemitHelpers';

SteemConnect.comment = Promise.promisify(SteemConnect.comment, { context: SteemConnect });

export const openCommentingDraft = createAction(actionTypes.OPEN_COMMENTING_DRAFT);
export const updateCommentingDraft = createAction(actionTypes.UPDATE_COMMENTING_DRAFT);
export const closeCommentingDraft = createAction(actionTypes.CLOSE_COMMENTING_DRAFT);


export const getComments = (postId) => {
  return (dispatch, getState, { steemAPI }) => {
    const { posts } = getState();

    const { author, permlink } = posts[postId];

    dispatch({
      type: actionTypes.GET_COMMENTS,
      payload: {
        promise: steemAPI.getContentRepliesAsync(author, permlink)
      },
      meta: {
        id: postId,
      },
    });
  };
};

export const sendComment = () => {
  return (dispatch, getState) => {
    const { auth, comments } = getState();

    if(!auth.isAuthenticated) {
      // dispatch error
      return;
    }

    const author = auth.user.name;
    const id = comments.currentDraftId;
    const { parentAuthor, parentPermlink, category, body } = comments.commentingDraft[id];

    const permlink = createCommentPermlink(parentAuthor, parentPermlink);
    const jsonMetadata = `{"tags": ["${category}"]}`;

    const optimisticData = {
      author,
      permlink,
      body
    };

    dispatch({
      type: actionTypes.SEND_COMMENT,
      payload: {
        promise: SteemConnect.comment(
          parentAuthor,
          parentPermlink,
          author,
          permlink,
          '',
          body,
          jsonMetadata
        ),
        data: optimisticData,
      }
    });
    dispatch(closeCommentingDraft());

  };
};

