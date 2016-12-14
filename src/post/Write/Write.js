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
    const images = [];
    const videos = [];
    each(postBody.raw.entityMap, (entity) => {
      if (entity.type === 'IMAGE') {
        images.push(entity.data.src);
      } else if (entity.type === 'VIDEO') {
        images.push(entity.data.src);
      }
    });

    if (!data.permlink) {
      data.permlink = kebabCase(data.title);
    }

    data.body = postBody.markdown;
    data.jsonMetadata = JSON.stringify({
      app: 'busy/0.1',
      format: 'markdown',
      tags: data.parentPermlink.trim().split(' '),
      users: [data.author],
      images,
      videos,
      canonical: `${global.location.origin}/${data.parentPermlink}/@${data.author}/${data.permlink}`
    });

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
