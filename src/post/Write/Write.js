import React, { Component, PropTypes } from 'react';
import formSerialize from 'form-serialize';
import kebabCase from 'lodash/kebabCase';
import { Link, browserHistory } from 'react-router';

import './Write.scss';
import Header from '../../app/Header';
import PostEditor from './PostEditor';

export class RawNewPost extends Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
    }),
    createPost: PropTypes.func,
  };

  onSubmit = (e) => {
    e.preventDefault();
    e.preventDefault();
    const data = formSerialize(e.target, {
      hash: true,
    });


    data.parentAuthor = '';
    const postBody = this.editor.getContent();

    data.jsonMetadata = JSON.stringify({
      post: postBody,
    });
    data.body = postBody.markdown;

    if (!data.permlink) {
      data.permlink = kebabCase(data.title);
    }

    this.props.createPost(data);
  }

  render() {
    const {
      user,
    } = this.props;
    const author = user.name;

    return (
      <div className="main-panel">
        <Header menu="messages" />

        <div className="container">
          <form
            action="/write"
            method="post"
            onSubmit={this.onSubmit}
          >
            <div>
              <fieldset className="form-group">
                <label htmlFor="title">
                  Title
                </label>
                <input
                  autoFocus
                  name="title"
                  required
                  type="text"
                  className="form-control form-control-lg"
                />
              </fieldset>

              <fieldset className="form-group">
                <label htmlFor="body">Body</label>
                <PostEditor
                  user={this.props.user}
                  required
                  ref={
                    (c) => { this.editor = c && c.getWrappedInstance ? c.getWrappedInstance() : c; }
                  }
                />
                <hr />
              </fieldset>

              <fieldset className="form-group">
                <label htmlFor="parentPermlink">Category</label>
                <input
                  type="text"
                  name="parentPermlink"
                  required
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

            <div className="form-group">
              <div className="btn-group">
                <Link to="/" className="btn btn-default btn-lg">
                  Cancel
                </Link>

                <button type="submit" className="btn btn-primary btn-lg">
                  Post
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

// TODO - Remove this from here
// Couldn't find your standard state and action management

import Promise from 'bluebird'; // eslint-disable-line import/imports-first
import assert from 'assert'; // eslint-disable-line import/imports-first
import request from 'superagent'; // eslint-disable-line import/imports-first
import { connect } from 'react-redux'; // eslint-disable-line import/imports-first
import SteemConnect from 'steemconnect'; // eslint-disable-line import/imports-first

Promise.promisifyAll(SteemConnect);
Promise.promisifyAll(request.Request.prototype);

export const CREATE_POST = 'CREATE_POST';
export const CREATE_POST_START = 'CREATE_POST_START';
export const CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS';
export const CREATE_POST_ERROR = 'CREATE_POST_ERROR';

const requiredFields =
  'parentAuthor,parentPermlink,author,permlink,title,body,jsonMetadata'
    .split(',');
function createPost(postData) {
  requiredFields.forEach((field) => {
    assert(
      postData[field] != null,
      `Developer Error: Missing required field ${field}`
    );
  });
  const { parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata } = postData;
  return () => ({
    type: CREATE_POST,
    payload: {
      promise: SteemConnect
        .commentAsync(parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata)
        .then((result) => {
          if (result !== null) {
            throw new Error(result);
          } else {
            browserHistory.push(`/${parentPermlink}/@${author}/${permlink}`);
          }
        })
    },
  });
}

const NewPost = connect(state => ({
  user: state.auth.user,
}), {
  createPost,
})(RawNewPost);

export default NewPost;
