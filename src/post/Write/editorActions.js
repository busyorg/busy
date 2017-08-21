import Promise from 'bluebird';
import assert from 'assert';
import SteemConnect from 'sc2-sdk';
import ReactGA from 'react-ga';
import { push } from 'react-router-redux';
import { createAction } from 'redux-actions';
import { jsonParse } from '../../helpers/formatter';
import { createPermlink, getBodyPatchIfSmaller } from '../../vendor/steemitHelpers';

export const CREATE_POST = '@editor/CREATE_POST';
export const CREATE_POST_START = '@editor/CREATE_POST_START';
export const CREATE_POST_SUCCESS = '@editor/CREATE_POST_SUCCESS';
export const CREATE_POST_ERROR = '@editor/CREATE_POST_ERROR';

export const NEW_POST = '@editor/NEW_POST';
export const newPost = createAction(NEW_POST);

export const SAVE_DRAFT = '@editor/SAVE_DRAFT';

export const DELETE_DRAFT = '@editor/DELETE_DRAFT';
export const deleteDraft = createAction(DELETE_DRAFT);

export const saveDraft = (post, redirect) => (dispatch) => {
  dispatch({
    type: SAVE_DRAFT,
    payload: {
      ...post,
    },
  });

  if (redirect) {
    dispatch(push(`/write?draft=${post.id}`));
  }
};

export const editPost = post => (dispatch) => {
  const jsonMetadata = jsonParse(post.json_metadata);
  const draft = {
    ...post,
    originalBody: post.body,
    isUpdating: true,
    jsonMetadata,
    parentAuthor: post.parent_author,
    parentPermlink: post.parent_permlink,
  };
  dispatch(saveDraft({ postData: draft, id: post.id }));
  dispatch(push(`/write?draft=${post.id}`));
};

const requiredFields = 'parentAuthor,parentPermlink,author,permlink,title,body,jsonMetadata'.split(
  ',',
);

export const broadcastComment = (
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

  if (reward !== '50') {
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

  return SteemConnect.broadcast(operations);
};

export function createPost(postData) {
  requiredFields.forEach((field) => {
    assert(postData[field] != null, `Developer Error: Missing required field ${field}`);
  });

  return (dispatch) => {
    const {
      parentAuthor,
      parentPermlink,
      author,
      title,
      jsonMetadata,
      reward,
      upvote,
      draftId,
      isUpdating,
    } = postData;
    const getPremLink = isUpdating
      ? Promise.resolve(postData.permlink)
      : createPermlink(title, author, parentAuthor, parentPermlink);

    const body = isUpdating
      ? getBodyPatchIfSmaller(postData.originalBody, postData.body)
      : postData.body;

    dispatch({
      type: CREATE_POST,
      payload: {
        promise: getPremLink.then(permlink =>
          broadcastComment(
            parentAuthor,
            parentPermlink,
            author,
            title,
            body,
            jsonMetadata,
            reward,
            upvote,
            permlink,
          ).then((result) => {
            if (draftId) {
              dispatch(deleteDraft(draftId));
            }
            dispatch(push(`/${parentPermlink}/@${author}/${permlink}`));

            ReactGA.event({
              category: 'post',
              action: 'submit',
              value: 10,
            });
            return result;
          }),
        ),
      },
    });
  };
}
