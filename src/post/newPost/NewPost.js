import React, { PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';

import Header from './../../app/header';

export function RawNewPost({createPost, user}) {
  const author = user.name;
  return (
    <div
      className="main-panel"
    >
      <Header menu="messages" />

      <div className="container">
        <form
          action="/write"
          method="post"
          onSubmit={createPost}
        >
          <div>
            <fieldset className="form-group">
              <label htmlFor="title">
                Title
              </label>
              <input
                autoFocus
                name="title"
                type="text"
                className="form-control form-control-lg"
              />
            </fieldset>

            <fieldset className="form-group">
              <label htmlFor="body">Body</label>
              <textarea
                name="body"
                className="form-control form-control-lg"
              />
            </fieldset>

            <fieldset className="form-group">
              <label htmlFor="parentPermlink">Category</label>
              <input
                type="text"
                name="parentPermlink"
                className="form-control form-control-lg"
              />
            </fieldset>
          </div>

          <input
            name="authorPermlink"
            type="hidden"
            value=""
          />

          <input
            name="author"
            type="hidden"
            value={author || ''}
          />

          <div>
            <Link to="/">
              Cancel
            </Link>

            <button type="submit" className="btn btn-primary btn-lg">
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
RawNewPost.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
  }),
  createPost: PropTypes.func,
};

// TODO - Remove this from here
// Couldn't find your standard state and action management

import Promise from 'bluebird'; // eslint-disable-line import/imports-first
import assert from 'assert'; // eslint-disable-line import/imports-first
import formSerialize from 'form-serialize'; // eslint-disable-line import/imports-first
import request from 'superagent'; // eslint-disable-line import/imports-first
import _ from 'lodash'; // eslint-disable-line import/imports-first
import { connect } from 'react-redux'; // eslint-disable-line import/imports-first

Promise.promisifyAll(request.Request.prototype);

export const CREATE_POST = 'CREATE_POST';
export const CREATE_POST_START = 'CREATE_POST_START';
export const CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS';
export const CREATE_POST_ERROR = 'CREATE_POST_ERROR';

const requiredFields = 'parentAuthor,parentPermlink,author,permlink,title,body,jsonMetadata'
  .split(',');
function rawCreatePost(body) {
  requiredFields.forEach((field) => {
    assert(
      body[field] != null,
      `Developer Error: Missing required field ${field}`
    );
  });

  return () => ({
    type: CREATE_POST,
    payload: {
      promise: request.get('https://steemconnect.com/api/comment')
        .query(body)
        .withCredentials()
        .endAsync()
        .then((res) => res.body)
        .tap(() => {
          browserHistory.push(
            `/${body.parentPermlink}/@${body.author}/${body.permlink}`
          );
        }),
    },
  });
}

// TODO - Use `react-form` and keep form state in the Redux store
export function createPost(e) {
  e.preventDefault();
  const body = formSerialize(e.target, {
    hash: true,
  });
  body.parentAuthor = '';
  body.jsonMetadata = '';
  if (!body.permlink) {
    body.permlink = _.kebabCase(body.title);
  }
  return rawCreatePost(body);
}

const NewPost = connect((state) => ({
  user: state.auth.user,
}), {
  createPost,
})(RawNewPost);

export default NewPost;
