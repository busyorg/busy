
// TODO - Remove this from here
// Couldn't find your standard state and action management

import Promise from 'bluebird';
import assert from 'assert';
import request from 'superagent';
import SteemConnect from 'steemconnect';
import { browserHistory } from 'react-router';
import { createAction } from 'redux-actions';

import { createPermlink } from '../../helpers/steemitHelpers';

Promise.promisifyAll(SteemConnect);
Promise.promisifyAll(request.Request.prototype);

export const CREATE_POST = '@editor/CREATE_POST';
export const CREATE_POST_START = '@editor/CREATE_POST_START';
export const CREATE_POST_SUCCESS = '@editor/CREATE_POST_SUCCESS';
export const CREATE_POST_ERROR = '@editor/CREATE_POST_ERROR';

const requiredFields = 'parentAuthor,parentPermlink,author,permlink,title,body,jsonMetadata'.split(',');

export function createPost(postData) {
  requiredFields.forEach((field) => {
    assert(postData[field] != null, `Developer Error: Missing required field ${field}`);
  });

  return (dispatch) => {
    const { parentAuthor, parentPermlink, author, title, body, jsonMetadata } = postData;
    dispatch({
      type: CREATE_POST,
      payload: {
        promise: createPermlink(title, author, parentAuthor, parentPermlink)
          .then((permlink) => {
            SteemConnect
              .commentAsync(parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata)
              .then(({ result }) => {
                browserHistory.push(`/${parentPermlink}/@${author}/${permlink}`);
                return result;
              });
          }
          ).catch(err => err)
      },
    });
  };
}

export const SAVE_DRAFT = '@editor/SAVE_DRAFT';
export const saveDraft = createAction(SAVE_DRAFT);

export const DELETE_DRAFT = '@editor/DELETE_DRAFT';
export const deleteDraft = createAction(DELETE_DRAFT);
