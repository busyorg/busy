import Promise from 'bluebird';
import { createAction } from 'redux-actions';
import SteemConnect from 'steemconnect';
import * as actionTypes from './commentsActionTypes';
import { createCommentPermlink } from './../helpers/steemitHelpers';

SteemConnect.comment = Promise.promisify(SteemConnect.comment, { context: SteemConnect });

export const openCommentingDraft = createAction(actionTypes.OPEN_COMMENTING_DRAFT);
export const updateCommentingDraft = createAction(actionTypes.UPDATE_COMMENTING_DRAFT);
export const closeCommentingDraft = createAction(actionTypes.CLOSE_COMMENTING_DRAFT);

export const showMoreComments = createAction(
  actionTypes.SHOW_MORE_COMMENTS,
  () => null,
  meta => ({ id: meta, })
);

/**
 * Will recursively create a tree of comments with their children like this:
 * { id: '2.1.85555', children: [ { id: '2.1.55444', children: [...] ], }
 * @param commentKey - the key of rootComment we want to re-structure
 * @param allComments - all comments received from getState api (usually res.content)
 * @returns {{id: *, children: *}}
 */
const nestCommentsChildren = (commentKey, allComments) => {
  const currentComment = allComments[commentKey];
  return {
    id: currentComment.id,
    children: currentComment.children > 0
      ? currentComment.replies.map(childCommentKey => nestCommentsChildren(childCommentKey, allComments))
      : {},
  };
};

/**
 * Will restructure and sort comments with only id and its children
 * @param apiRes - The result of getState for an article full path with steemAPI
 */
const sortCommentsList = (apiRes) => {
  const rootComments = Object.keys(apiRes.content).filter((commentKey) => {
    return apiRes.content[commentKey].depth === 1;
  });

  return rootComments.map(key => nestCommentsChildren(key, apiRes.content));
};


export const getComments = (postId) => {
  return (dispatch, getState, { steemAPI }) => {
    const { posts } = getState();

    const { author, permlink, category } = posts[postId];

    dispatch({
      type: actionTypes.GET_COMMENTS,
      payload: {
        promise: steemAPI.getStateAsync(`/${category}/@${author}/${permlink}`).then((apiRes) => {
          return {
            list: sortCommentsList(apiRes),
            content: apiRes.content,
          };
        }),
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


