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
  const rootComments = Object.entries(apiRes.content).filter(([key, comment]) => {
    return comment.id === comment.root_comment;
  });
  return rootComments.map(([key, comment]) => {
    const nestedComments = [];
    if(comment.children > 0) {
      nestedComments.push(nestCommentsChildren(key, apiRes.content));
    }

    return nestedComments;
  });
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

export const getMoreComments = (postId) => {
  return (dispatch, getState, { steemAPI }) => {
    const { comments } = getState();

    const list = comments.lists[postId] ? comments.lists[postId].list : [];
    const show = comments.lists[postId] ? comments.lists[postId].show : 1;

    if (list.length === 0 || !comments.lists[postId].hasMore) {
      // Not possible to load more
      return;
    }

    if (list.length > show + 10) {
      // The next 10 comments are already loaded in state
      dispatch(showMoreComments(postId));
      return;
    }

    const lastCommentId = list[list.length - 1];
    const startAuthor = comments.comments[lastCommentId].author;
    const startPermlink = comments.comments[lastCommentId].permlink;

    dispatch({
      type: actionTypes.GET_MORE_COMMENTS,
      payload: {
        promise: steemAPI.getRepliesByLastUpdateAsync(startAuthor, startPermlink, 10),
      },
      meta: {
        id: postId,
      },
    }).then(() => dispatch(
        showMoreComments(postId)
      )
    );
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


