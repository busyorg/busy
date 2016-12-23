import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import formSerialize from 'form-serialize';
import kebabCase from 'lodash/kebabCase';
import { Link } from 'react-router';
import { each } from 'lodash';
import TagsInput from 'react-tagsinput';

import './Write.scss';
import Header from '../../app/Header';
import PostEditor from './PostEditor';
import { createPost } from './EditorActions';
import Icon from './../../widgets/Icon';

const version = require('../../../package.json').version;

export class RawNewPost extends Component {
  constructor() {
    super();
    this.state = { tags: [], categoryInputDisabled: false };
  }

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
    const tags = this.state.tags;
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

  handleChange = (tags) => {
    const state = { categoryInputDisabled: false };
    state.tags = tags.map(t => t.toLowerCase().trim());

    if (tags.length === 5) {
      state.categoryInputDisabled = true;
    }
    this.setState(state);
  }

  onCategoryInputKeyUp = (event) => {
    const SPACE_KEYCODE = 32;
    if (event.keyCode === SPACE_KEYCODE && !event.shiftKey) {
      const tag = event.target.value.trim();
      if (this.categoryInput && tag.length) { this.categoryInput.addTag(tag); }
    }
  }

  renderTag = (props) => {
    const { tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, ...other } = props;
    return (
      <span key={key} {...other}>
        {getTagDisplayValue(tag)}
        {!disabled &&
          <Icon className={classNameRemove} onClick={() => onRemove(key)} name="close" />
        }
      </span>
    );
  }

  render() {
    const { user: { name: author }, editor: { loading } } = this.props;
    const { tags, categoryInputDisabled } = this.state;

    return (
      <div className="main-panel">
        <Header />
        <div className="container my-3">
          <form
            action="/write"
            method="post"
            onSubmit={this.onSubmit}
          >
            <fieldset className="form-group">
              <input
                autoFocus
                name="title"
                placeholder="Title"
                required
                type="text"
                className="form-control form-control-xl"
              />
            </fieldset>

            <PostEditor
              user={this.props.user}
              required
              ref={
                (c) => { this.editor = c && c.getWrappedInstance ? c.getWrappedInstance() : c; }
              }
            />

            <fieldset className="form-group">
              <TagsInput
                value={tags} onChange={this.handleChange} addOnBlur onlyUnique inputProps={{
                  required: tags.length === 0,
                  type: 'text',
                  name: 'parentPermlink',
                  className: 'form-control form-control-lg catergories-input',
                  disabled: categoryInputDisabled,
                  onKeyUp: this.onCategoryInputKeyUp,
                  placeholder: categoryInputDisabled ? 'Max 5 Category Allowed' : 'Category'
                }}
                tagProps={{
                  className: 'catergory', classNameRemove: 'catergory-remove'
                }}
                className="catergories-container"
                ref={(c) => { this.categoryInput = c; }}
                renderTag={this.renderTag}
              />
            </fieldset>

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
              <button type="submit" disabled={loading} className="btn btn-success btn-lg">
                Publish
              </button>
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
