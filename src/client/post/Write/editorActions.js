import Promise from 'bluebird';
import assert from 'assert';
import { push } from 'react-router-redux';
import { createAction } from 'redux-actions';
import { addDraftMetadata, deleteDraftMetadata, saveUpvoteRewardsSettingsMetadata } from '../../helpers/metadata';
import { jsonParse } from '../../helpers/formatter';
import { createPermlink, getBodyPatchIfSmaller } from '../../vendor/steemitHelpers';
import { createAsyncActionType } from '../../helpers/stateHelpers';

export const CREATE_POST = createAsyncActionType('@editor/CREATE_POST');

export const NEW_POST = '@editor/NEW_POST';
export const newPost = createAction(NEW_POST);

export const SAVE_DRAFT = createAsyncActionType('@editor/SAVE_DRAFT');

export const DELETE_DRAFT = createAsyncActionType('@editor/DELETE_DRAFT');

export const ADD_EDITED_POST = '@editor/ADD_EDITED_POST';
export const addEditedPost = createAction(ADD_EDITED_POST);

export const DELETE_EDITED_POST = '@editor/DELETE_EDITED_POST';
export const deleteEditedPost = createAction(DELETE_EDITED_POST);

export const UPDATE_LAST_SETTINGS = createAsyncActionType('@editor/UPDATE_LAST_SETTINGS');

export const saveDraft = (post, redirect) => (dispatch) => {
  if (redirect) dispatch(push(`/editor?draft=${post.id}`));
  return dispatch({
    type: SAVE_DRAFT.ACTION,
    payload: {
      promise: addDraftMetadata(post),
    },
    meta: { postId: post.id },
  });
};

export const deleteDraft = draftId => dispatch =>
  dispatch({
    type: DELETE_DRAFT.ACTION,
    payload: {
      promise: deleteDraftMetadata(draftId),
    },
    meta: { id: draftId },
  });

export const editPost = post => (dispatch) => {
  const jsonMetadata = jsonParse(post.json_metadata);
  const draft = {
    ...post,
    originalBody: post.body,
    jsonMetadata,
    isUpdating: true,
  };
  dispatch(saveDraft({ postData: draft, id: post.id })).then(() =>
    dispatch(push(`/editor?draft=${post.id}`)),
  );
};

const requiredFields = 'parentAuthor,parentPermlink,author,permlink,title,body,jsonMetadata'.split(
  ',',
);

const broadcastComment = (
  steemConnectAPI,
  parentAuthor,
  parentPermlink,
  author,
  title,
  body,
  jsonMetadata,
  reward,
  upvote,
  permlink,
) => {
  const operations = [];

  const commentOp = [
    'comment',
    {
      parent_author: parentAuthor,
      parent_permlink: parentPermlink,
      author,
      permlink,
      title,
      body,
      json_metadata: JSON.stringify(jsonMetadata),
    },
  ];
  operations.push(commentOp);

  const commentOptionsConfig = {
    author,
    permlink,
    allow_votes: true,
    allow_curation_rewards: true,
  };

  if (reward === '0') {
    commentOptionsConfig.max_accepted_payout = '0.000 SBD';
    commentOptionsConfig.percent_steem_dollars = 10000;
  } else if (reward === '100') {
    commentOptionsConfig.max_accepted_payout = '1000000.000 SBD';
    commentOptionsConfig.percent_steem_dollars = 0;
  }

  if (reward === '0' || reward === '100') {
    operations.push(['comment_options', commentOptionsConfig]);
  }

  if (upvote) {
    operations.push([
      'vote',
      {
        voter: author,
        author,
        permlink,
        weight: 10000,
      },
    ]);
  }

  return steemConnectAPI.broadcast(operations);
};

export function createPost(postData) {
  requiredFields.forEach((field) => {
    assert(postData[field] != null, `Developer Error: Missing required field ${field}`);
  });

  return (dispatch, getState, { steemConnectAPI }) => {
    const {
      parentAuthor,
      parentPermlink,
      author,
      title,
      body,
      jsonMetadata,
      reward,
      upvote,
      draftId,
      isUpdating,
    } = postData;
    const getPermLink = isUpdating
      ? Promise.resolve(postData.permlink)
      : createPermlink(title, author, parentAuthor, parentPermlink);

    const newBody = isUpdating ? getBodyPatchIfSmaller(postData.originalBody, body) : body;

    dispatch({
      type: UPDATE_LAST_SETTINGS.ACTION,
      payload: {
        promise: saveUpvoteRewardsSettingsMetadata(upvote, reward),
      },
    });

    dispatch({
      type: CREATE_POST.ACTION,
      payload: {
        promise: getPermLink.then(permlink =>
          broadcastComment(
            steemConnectAPI,
            parentAuthor,
            parentPermlink,
            author,
            title,
            newBody,
            jsonMetadata,
            !isUpdating && reward,
            !isUpdating && upvote,
            permlink,
          ).then((result) => {
            if (draftId) {
              dispatch(deleteDraft(draftId));
              dispatch(addEditedPost(permlink));
            }
            dispatch(push(`/${parentPermlink}/@${author}/${permlink}`));

            if (window.analytics) {
              window.analytics.track('Post', {
                category: 'post',
                label: 'submit',
                value: 10,
              });
            }

            return result;
          }),
        ),
      },
    });
  };
}
