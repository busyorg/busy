import { createAction } from 'redux-actions';
import SteemConnect from 'sc2-sdk';
import { createCommentPermlink } from '../helpers/steemitHelpers';

const version = require('../../package.json').version;

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


export const openCommentingDraft = createAction(OPEN_COMMENTING_DRAFT);
export const updateCommentingDraft = createAction(UPDATE_COMMENTING_DRAFT);
export const closeCommentingDraft = createAction(CLOSE_COMMENTING_DRAFT);

export const LIKE_COMMENT = '@comments/LIKE_COMMENT';
export const LIKE_COMMENT_START = '@comments/LIKE_COMMENT_START';
export const LIKE_COMMENT_SUCCESS = '@comments/LIKE_COMMENT_SUCCESS';
export const LIKE_COMMENT_ERROR = '@comments/LIKE_COMMENT_ERROR';

export const showMoreComments = createAction(
  SHOW_MORE_COMMENTS,
  () => null,
  meta => ({ id: meta, })
);

export const RELOAD_EXISTING_COMMENT = '@comments/RELOAD_EXISTING_COMMENT';
export const reloadExistingComment = createAction(RELOAD_EXISTING_COMMENT);

const getRootCommentsList = (apiRes) => {
  return Object.keys(apiRes.content).filter((commentKey) => {
    return apiRes.content[commentKey].depth === 1;
  }).map(commentKey => apiRes.content[commentKey].id);
};


const getCommentsChildrenLists = (apiRes) => {
  let listsById = {};
  Object.keys(apiRes.content).forEach((commentKey) => {
    listsById[apiRes.content[commentKey].id] = apiRes.content[commentKey].replies.map(
      childKey => apiRes.content[childKey].id
    );
  });

  return listsById;
};

export const getComments = (postId, isFromAnotherComment = false) => {
  return (dispatch, getState, { steemAPI }) => {
    const { posts, comments } = getState();

    let content;
    if (isFromAnotherComment) {
      content = comments.comments[postId];
    } else {
      content = posts[postId];
    }

    const { category, author, permlink } = content;

    dispatch({
      type: GET_COMMENTS,
      payload: {
        promise: steemAPI.getStateAsync(`/${category}/@${author}/${permlink}`).then((apiRes) => {
          return {
            rootCommentsList: getRootCommentsList(apiRes),
            commentsChildrenList: getCommentsChildrenLists(apiRes),
            content: apiRes.content,
          };
        }),
      },
      meta: {
        id: postId,
        isReplyToComment: isFromAnotherComment,
      },
    });
  };
};

export const sendComment = (parentId = null) =>
  (dispatch, getState) => {
    const { auth, comments } = getState();

    if (!auth.isAuthenticated) {
      // dispatch error
      return;
    }

    const author = auth.user.name;
    const id = parentId || comments.currentDraftId;

    const {
      parentAuthor,
      parentPermlink,
      category,
      body,
      isReplyToComment,
      isEditing,
      } = comments.commentingDraft[id];

    const rootCommentId = isReplyToComment ? comments.comments[id].root_comment : id;

    const permlink = isEditing ? comments.commentingDraft[id].permlink :
      createCommentPermlink(parentAuthor, parentPermlink);
    const jsonMetadata = { tags: [category], app: `busy/${version}` };

    return dispatch({
      type: SEND_COMMENT,
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
      },
      meta: {
        parentId: id,
        isEditing,
        isReplyToComment,
      },
    }).then(() => dispatch(closeCommentingDraft()))
      .then(() => dispatch(getComments(rootCommentId)));
  };

export const likeComment = (commentId, weight = 10000, retryCount = 0) => {
  return (dispatch, getState, { steemAPI }) => {
    const { auth, comments } = getState();

    if (!auth.isAuthenticated) {
      return;
    }

    const voter = auth.user.name;
    const { author, permlink } = comments.comments[commentId];

    dispatch({
      type: LIKE_COMMENT,
      payload: {
        promise: SteemConnect.vote(voter, author, permlink, weight).then((res) => {
          // reload comment data to fetch payout after vote
          steemAPI.getContentAsync(author, permlink).then(data => {
            dispatch(reloadExistingComment(data));
            return data;
          });
          return res;
        }),
      },
      meta: { commentId, voter, weight, isRetry: retryCount > 0 },
    }).catch(err => {
      if (err.res && err.res.status === 500 && retryCount <= 5) {
        dispatch(likeComment(commentId, weight, retryCount + 1));
      }
    });
  }
};

