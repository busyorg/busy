
// TODO - Remove this from here
// Couldn't find your standard state and action management

import Promise from 'bluebird';
import assert from 'assert';
import request from 'superagent';
import SteemConnect from 'sc2-sdk';
import { push } from 'react-router-redux';
import { createAction } from 'redux-actions';
import { jsonParse } from '../../helpers/formatter';
import { createPermlink, getBodyPatchIfSmaller } from '../../helpers/steemitHelpers';

Promise.promisifyAll(request.Request.prototype);

export const CREATE_POST = '@editor/CREATE_POST';
export const CREATE_POST_START = '@editor/CREATE_POST_START';
export const CREATE_POST_SUCCESS = '@editor/CREATE_POST_SUCCESS';
export const CREATE_POST_ERROR = '@editor/CREATE_POST_ERROR';

export const NEW_POST = '@editor/NEW_POST';
export const newPost = createAction(NEW_POST);

export const SAVE_DRAFT = '@editor/SAVE_DRAFT';

export const DELETE_DRAFT = '@editor/DELETE_DRAFT';
export const deleteDraft = createAction(DELETE_DRAFT);

export const saveDraft = post =>
  (dispatch) => {
    dispatch(push(`/write?draft=${post.id}`));
    dispatch({
      type: SAVE_DRAFT,
      payload: {
        ...post,
      },
    });
  };

export const editPost = post =>
  (dispatch) => {
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

const requiredFields = 'parentAuthor,parentPermlink,author,permlink,title,body,jsonMetadata'.split(',');

export function createPost(postData) {
  requiredFields.forEach((field) => {
    assert(postData[field] != null, `Developer Error: Missing required field ${field}`);
  });

  return (dispatch) => {
    const { parentAuthor, parentPermlink, author, title, jsonMetadata, draftId, isUpdating } = postData;
    const getPremLink = isUpdating ?
      Promise.resolve(postData.permlink) :
      createPermlink(title, author, parentAuthor, parentPermlink);

    const body = isUpdating ? getBodyPatchIfSmaller(postData.originalBody, postData.body) : postData.body;

    dispatch({
      type: CREATE_POST,
      payload: {
        promise: getPremLink
          .then(permlink =>
            SteemConnect
              .comment(parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata)
              .then((result) => {
                if (result.errors) {
                  const error = new Error('SteemConnect API call failed');
                  error.errors = result.errors;
                  return Promise.reject(error);
                }
                if (draftId) { dispatch(deleteDraft(draftId)); }
                dispatch(push(`/${parentPermlink}/@${author}/${permlink}`));
                return result;
              })
          ),
      },
    });
  };
}
