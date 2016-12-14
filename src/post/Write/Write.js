import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import formSerialize from 'form-serialize';
import kebabCase from 'lodash/kebabCase';
import { Link } from 'react-router';
import { each } from 'lodash';

import './Write.scss';
import Header from '../../app/Header';
import PostEditor from './PostEditor';
import { createPost } from './EditorActions';

const version = require('../../../package.json').version;

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
    const image = [];
    each(postBody.raw.entityMap, (entity) => {
      if (entity.type === 'IMAGE') {
        image.push(entity.data.src);
      }
    });
    const tags = data.parentPermlink.trim().split(' ');
    const users = [];
    const userRegex = /@([a-zA-Z.0-9-]+)/g;
    const links = [];
    const linkRegex = /\[.+?]\((.*?)\)/g;
    let matches;

    while (matches = userRegex.exec(postBody.markdown)) {
      if (users.indexOf(matches[1]) === -1) {
        users.push(matches[1]);
      }
    }

    while (matches = linkRegex.exec(postBody.markdown)) {
      if (links.indexOf(matches[1]) === -1 && matches[1].search(/https?:\/\//) === 0) {
        links.push(matches[1]);
      }
    }

    if (!data.permlink) {
      data.permlink = kebabCase(data.title);
    }

    data.body = postBody.markdown;
    const metaData = {
      app: `busy/${version}`,
      format: 'markdown',
    };

    if (tags.length) { metaData.tags = tags; }
    if (users.length) { metaData.users = users; }
    if (links.length) { metaData.links = links; }
    if (image.length) { metaData.image = image; }

    data.jsonMetadata = JSON.stringify(metaData);
    this.props.createPost(data);
  }

  render() {
    const { user: { name: author }, editor: { loading } } = this.props;

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

                <button type="submit" disabled={loading} className="btn btn-primary btn-lg">
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

const NewPost = connect(state => ({
  user: state.auth.user, editor: state.editor
}), { createPost })(RawNewPost);

export default NewPost;
