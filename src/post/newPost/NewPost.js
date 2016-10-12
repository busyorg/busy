import React, { Component, PropTypes } from 'react';
import formSerialize from 'form-serialize';
import kebabCase from 'lodash/kebabCase';
import { Link, browserHistory } from 'react-router';

import '../../fonts/Karla.scss';
import '../../fonts/MaterialIcons.scss';
import './NewPost.scss';
import Header from '../../app/header';
import PostEditor from './PostEditor';

export class RawNewPost extends Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
    }),
    createPost: PropTypes.func,
  };

  onSubmit(e) {
    e.preventDefault();
    e.preventDefault();
    const data = formSerialize(e.target, {
      hash: true,
    });

    data.parentAuthor = '';
    const postBody = this.refs.editor.getContent();
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
      <div
        className="main-panel"
      >
        <Header menu="messages" />

        <div className="container">
          <form
            action="/write"
            method="post"
            onSubmit={this.onSubmit.bind(this)}
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
                  required
                  ref="editor"
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

Promise.promisifyAll(request.Request.prototype);

export const CREATE_POST = 'CREATE_POST';
export const CREATE_POST_START = 'CREATE_POST_START';
export const CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS';
export const CREATE_POST_ERROR = 'CREATE_POST_ERROR';

const requiredFields =
  'parentAuthor,parentPermlink,author,permlink,title,body,jsonMetadata'
  .split(',');
function createPost(body) {
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

const NewPost = connect((state) => ({
  user: state.auth.user,
}), {
  createPost,
})(RawNewPost);

export default NewPost;
