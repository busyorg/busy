import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import formSerialize from 'form-serialize';
import kebabCase from 'lodash/kebabCase';
import _ from 'lodash';
import TagsInput from 'react-tagsinput';

import './Write.scss';
import Header from '../../app/Header';
import PostEditor from './PostEditor';
import { createPost, saveDraft } from './EditorActions';
import Icon from './../../widgets/Icon';

const version = require('../../../package.json').version;

const MAX_ALLOW_CATEGORIES = 5;

export class RawNewPost extends Component {
  constructor(props) {
    super(props);
    let tags = [];

    const { location: { query } } = props;

    const { draftPosts } = this.props.editor;
    const draftPost = draftPosts[query.draft];
    if (draftPost) {
      const { jsonMetadata } = draftPost.postData || {};
      tags = jsonMetadata.tags;
      if (!_.isArray(tags)) { tags = []; }
    }

    this.state = { tags };
  }

  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
    }),
    createPost: PropTypes.func,
  };

  componentDidMount() {
    const { draftPosts } = this.props.editor;
    const { location: { query } } = this.props;
    const draftPost = draftPosts[query.draft];
    if (draftPost) {
      const { title } = draftPost.postData || {};

      if (title && this.title) {
        this.title.value = title;
      }

      if (draftPost.rawBody) {
        this.editor.setRawContent(draftPost.rawBody);
      }
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    e.preventDefault();
    const data = this.getNewPostData();
    this.props.createPost(data);
  }

  getNewPostData = () => {
    const data = formSerialize(this.form, {
      hash: true,
    });

    data.parentAuthor = '';
    const postBody = this.editor.getContent();
    const image = [];
    _.each(postBody.raw.entityMap, (entity) => {
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

    // eslint-disable-next-line
    while (matches = userRegex.exec(postBody.markdown)) {
      if (users.indexOf(matches[1]) === -1) {
        users.push(matches[1]);
      }
    }

    // eslint-disable-next-line
    while (matches = linkRegex.exec(postBody.markdown)) {
      if (links.indexOf(matches[1]) === -1 && matches[1].search(/https?:\/\//) === 0) {
        links.push(matches[1]);
      }
    }

    if (data.title && !data.permlink) {
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
    data.parentPermlink = tags.length ? tags[0] : 'general';
    data.jsonMetadata = metaData;
    return data;
  }

  saveDraft = _.debounce(() => {
    const data = this.getNewPostData();
    const postBody = this.editor.getContent();
    const { location: { query } } = this.props;
    let id = query.draft;

    // Remove zero width space
    const isBodyEmpty = postBody.markdown.replace(/[\u200B-\u200D\uFEFF]/g, '').trim().length === 0;

    if (id === undefined && !isBodyEmpty) {
      id = Date.now().toString(16);
      this.props.router.push({ pathname: '/write', query: { draft: id } });
    }

    if (id !== undefined) {
      this.props.saveDraft({ postData: data, rawBody: postBody.raw, id });
    }
  }, 400);

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.query !== this.props.location.query
      && nextProps.location.query.draft === undefined) {
      this.resetEditor();
    }
  }

  componentWillUnmount() {
    this.saveDraft.cancel();
  }

  resetEditor = () => {
    this.title.value = '';
    this.editor.resetState();
    this.setState({ tags: [] });
  }

  onCategoryChange = (tags) => {
    this.setState({
      tags: tags.map(t => t.toLowerCase().trim())
    },
      () => {
        this.saveDraft();
      });
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
          <a onClick={() => onRemove(key)}>
            <Icon className={classNameRemove} name="close" xs />
          </a>
        }
      </span>
    );
  }

  render() {
    const { user: { name: author }, editor: { loading } } = this.props;
    const { tags } = this.state;
    const categoryInputDisabled = tags.length === MAX_ALLOW_CATEGORIES;

    return (
      <div className="main-panel">
        <Header />
        <div className="container my-5">
          <form
            action="/write"
            method="post"
            onSubmit={this.onSubmit}
            ref={(c) => { this.form = c; }}
          >
            <fieldset className="form-group">
              <input
                autoFocus
                name="title"
                placeholder="Title"
                required
                type="text"
                onChange={this.saveDraft}
                ref={(c) => { this.title = c; }}
                className="form-control form-control-xl"
              />
            </fieldset>

            <PostEditor
              user={this.props.user}
              onChange={this.saveDraft}
              placeholder="Write your story…"
              required
              ref={
                (c) => { this.editor = c && c.getWrappedInstance ? c.getWrappedInstance() : c; }
              }
            />

            <fieldset className="form-group">
              <TagsInput
                value={tags} onChange={this.onCategoryChange} addOnBlur onlyUnique inputProps={{
                  required: tags.length === 0,
                  type: 'text',
                  name: 'parentPermlink',
                  className: 'form-control form-control-lg categories-input',
                  disabled: categoryInputDisabled,
                  onKeyUp: this.onCategoryInputKeyUp,
                  placeholder: categoryInputDisabled ? '' : 'Category'
                }}
                tagProps={{
                  className: 'category',
                  classNameRemove: 'category-remove'
                }}
                className="categories-container"
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
}), { createPost, saveDraft })(RawNewPost);

export default NewPost;
