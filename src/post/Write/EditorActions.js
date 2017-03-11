
// TODO - Remove this from here
// Couldn't find your standard state and action management

import Promise from 'bluebird';
import assert from 'assert';
import request from 'superagent';
import SteemConnect from 'steemconnect';
import { browserHistory } from 'react-router';
import { createAction } from 'redux-actions';

import { createPermlink, getBodyPatchIfSmaller } from '../../helpers/steemitHelpers';

Promise.promisifyAll(request.Request.prototype);

export const CREATE_POST = '@editor/CREATE_POST';
export const CREATE_POST_START = '@editor/CREATE_POST_START';
export const CREATE_POST_SUCCESS = '@editor/CREATE_POST_SUCCESS';
export const CREATE_POST_ERROR = '@editor/CREATE_POST_ERROR';

export const NEW_POST = '@editor/NEW_POST';
export const newPost = createAction(NEW_POST);

export const SAVE_DRAFT = '@editor/SAVE_DRAFT';
export const saveDraft = createAction(SAVE_DRAFT);

export const DELETE_DRAFT = '@editor/DELETE_DRAFT';
export const deleteDraft = createAction(DELETE_DRAFT);

export const editPost = post =>
  (dispatch) => {
    let jsonMetadata = {};
    try { jsonMetadata = JSON.parse(post.json_metadata); } catch (e) { }
    const draft = {
      ...post,
      originalBody: post.body,
      isUpdating: true,
      jsonMetadata,
      parentAuthor: post.parent_author,
      parentPermlink: post.parent_permlink,
    };
    dispatch(saveDraft({ postData: draft, id: post.id }));
    browserHistory.push(`/write?draft=${post.id}`);
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
              .commentAsync(parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata)
              .then(({ result }) => {
                if (draftId) { dispatch(deleteDraft(draftId)); }
                browserHistory.push(`/${parentPermlink}/@${author}/${permlink}`);
                return result;
              })
          ).catch(err => err)
      },
    });
  };
}
