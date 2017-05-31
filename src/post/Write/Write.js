import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import formSerialize from 'form-serialize';
import kebabCase from 'lodash/kebabCase';
import _ from 'lodash';
import TagsInput from 'react-tagsinput';
import PostEditor from './PostEditor';
import { createPost, saveDraft, newPost } from './EditorActions';
import Icon from './../../widgets/Icon';
import Loading from './../../widgets/Loading';
import './Write.less';

const version = require('../../../package.json').version;

const MAX_ALLOW_CATEGORIES = 5;

export class RawNewPost extends Component {
  constructor(props) {
    super(props);
    let tags = [];
    const state = {};
    const { location: { query } } = props;

    const { draftPosts } = this.props.editor;
    const draftPost = draftPosts[query.draft];
    if (draftPost) {
      const { jsonMetadata, isUpdating } = draftPost.postData || {};
      tags = jsonMetadata.tags;
      if (!_.isArray(tags)) { tags = []; }
      state.isUpdating = isUpdating;
    }

    state.tags = tags;
    this.state = state;
  }

  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
    }),
    createPost: PropTypes.func,
  };

  componentDidMount() {
    this.props.newPost(); // reset loading, success and error flags
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
      } else if (_.has(draftPost.postData, 'body')) {
        this.editor.setMarkdown(draftPost.postData.body);
      }

      if (_.has(draftPost.postData, 'permlink')) {
        this.permlink.value = _.get(draftPost.postData, 'permlink');
      }
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { editor: { success } } = this.props;
    if (!success) {
      const { location: { query } } = this.props;
      const data = this.getNewPostData();
      data.draftId = query.draft;
      data.isUpdating = this.state.isUpdating;
      this.props.createPost(data);
    }
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
    if (this.state.isUpdating) { data.isUpdating = this.state.isUpdating; }

    const { draftPosts } = this.props.editor;
    const { location: { query } } = this.props;
    const id = query.draft;
    const draftPost = _.get(draftPosts, id, {});
    // originalBody need to preserved for update draft. They are used to create patch.
    if (_.has(draftPost, 'postData.originalBody')) {
      data.originalBody = draftPost.postData.originalBody;
    }
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
    this.permlink.value = '';
    this.editor.resetState();
    this.setState({ tags: [], isUpdating: undefined });
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
    const { user: { name: author }, editor: { loading, loadingImg, success } } = this.props;
    const { tags } = this.state;
    const categoryInputDisabled = tags.length === MAX_ALLOW_CATEGORIES;
    const publishText = success ? 'Continue' : 'Publish';
    const postText = this.state.isUpdating ? 'Update' : publishText;
    return (
      <div className="Write main-panel">
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
                spellCheck
                type="text"
                onChange={this.saveDraft}
                ref={(c) => { this.title = c; }}
                className="form-control form-control-xl title-input"
              />
            </fieldset>

            <PostEditor
              user={this.props.user}
              onChange={this.saveDraft}
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

            <input name="permlink" type="hidden" ref={(c) => { this.permlink = c; }} />
            <input name="author" type="hidden" value={author || ''} />

            <div className="form-group">
              <button type="submit" disabled={(!!loading || !!loadingImg)} className="btn btn-success btn-lg">
                {loading ? <Loading color="white" className="my-0" /> : postText}
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
}), { createPost, saveDraft, newPost })(RawNewPost);

export default NewPost;
