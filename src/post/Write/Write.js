import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { replace } from 'react-router-redux';
import marked from 'marked';
import kebabCase from 'lodash/kebabCase';
import debounce from 'lodash/debounce';
import isArray from 'lodash/isArray';
import 'url-search-params-polyfill';
import { injectIntl } from 'react-intl';
import GetBoost from '../../components/Sidebar/GetBoost';
import DeleteDraftModal from './DeleteDraftModal';

import {
  getAuthenticatedUser,
  getDraftPosts,
  getIsEditorLoading,
  getIsEditorSaving,
} from '../../reducers';

import { createPost, saveDraft, newPost } from './editorActions';
import { notify } from '../../app/Notification/notificationActions';
import Editor from '../../components/Editor/Editor';
import Affix from '../../components/Utils/Affix';

const version = require('../../../package.json').version;

@injectIntl
@withRouter
@connect(
  (state, props) => ({
    user: getAuthenticatedUser(state),
    draftPosts: getDraftPosts(state),
    loading: getIsEditorLoading(state),
    saving: getIsEditorSaving(state),
    draftId: new URLSearchParams(props.location.search).get('draft'),
  }),
  {
    createPost,
    saveDraft,
    newPost,
    notify,
    replace,
  },
)
class Write extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    draftPosts: PropTypes.shape().isRequired,
    loading: PropTypes.bool.isRequired,
    saving: PropTypes.bool,
    newPost: PropTypes.func,
    createPost: PropTypes.func,
    saveDraft: PropTypes.func,
    notify: PropTypes.func,
    replace: PropTypes.func,
    draftId: PropTypes.string,
  };

  static defaultProps = {
    saving: false,
    newPost: () => {},
    createPost: () => {},
    saveDraft: () => {},
    notify: () => {},
    replace: () => {},
    draftId: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      initialTitle: '',
      initialTopics: [],
      initialBody: '',
      initialReward: '50',
      initialUpvote: true,
      initialUpdatedDate: Date.now(),
      isUpdating: false,
      showModalDelete: false,
    };
  }

  componentDidMount() {
    this.props.newPost();
    const { draftPosts, draftId } = this.props;
    const draftPost = draftPosts[draftId];
    if (draftPost) {
      let tags = [];
      if (isArray(draftPost.jsonMetadata.tags)) {
        tags = draftPost.jsonMetadata.tags;
      }

      if (draftPost.permlink) {
        this.permlink = draftPost.permlink;
      }

      if (draftPost.originalBody) {
        this.originalBody = draftPost.originalBody;
      }

      // eslint-disable-next-line
      this.setState({
        initialTitle: draftPost.title || '',
        initialTopics: tags || [],
        initialBody: draftPost.body || '',
        initialReward: draftPost.reward || '50',
        initialUpvote: draftPost.upvote,
        initialUpdatedDate: draftPost.lastUpdated || Date.now(),
        isUpdating: draftPost.isUpdating || false,
      });
    }
  }

  onDeleteDraft = () => {
    this.props.replace('/write');
    this.setState({
      initialTitle: '',
      initialTopics: [],
      initialBody: '',
      initialReward: '50',
      initialUpvote: true,
      initialUpdatedDate: Date.now(),
      isUpdating: false,
      showModalDelete: false,
    });
  };

  onDelete = () => {
    this.setState({ showModalDelete: true });
  }

  onSubmit = (form) => {
    const data = this.getNewPostData(form);
    if (this.props.draftId) {
      data.draftId = this.props.draftId;
    }
    this.props.createPost(data);
  };

  getNewPostData = (form) => {
    const data = {
      body: form.body,
      title: form.title,
      reward: form.reward,
      upvote: form.upvote,
      lastUpdated: Date.now(),
    };

    data.parentAuthor = '';
    data.author = this.props.user.name || '';

    const tags = form.topics;
    const users = [];
    const userRegex = /@([a-zA-Z.0-9-]+)/g;
    const links = [];
    const images = [];
    let matches;

    const postBody = data.body;

    // eslint-disable-next-line
    while ((matches = userRegex.exec(postBody))) {
      if (users.indexOf(matches[1]) === -1) {
        users.push(matches[1]);
      }
    }

    const renderer = new marked.Renderer();

    renderer.link = (href) => {
      links.push(href);
      return marked.Renderer.prototype.link.apply(renderer, arguments);
    };

    renderer.image = (href) => {
      images.push(href);
      return marked.Renderer.prototype.image.apply(renderer, arguments);
    };

    marked(postBody || '', { renderer });

    if (data.title && !this.permlink) {
      data.permlink = kebabCase(data.title);
    } else {
      data.permlink = this.permlink;
    }

    if (this.state.isUpdating) data.isUpdating = this.state.isUpdating;

    const metaData = {
      community: 'busy',
      app: `busy/${version}`,
      format: 'markdown',
    };

    if (tags.length) {
      metaData.tags = tags;
    }
    if (users.length) {
      metaData.users = users;
    }
    if (links.length) {
      metaData.links = links;
    }
    if (images.length) {
      metaData.image = images;
    }

    data.parentPermlink = tags.length ? tags[0] : 'general';
    data.jsonMetadata = metaData;

    if (this.originalBody) {
      data.originalBody = this.originalBody;
    }

    return data;
  };

  handleImageInserted = (blob, callback, errorCallback) => {
    const { formatMessage } = this.props.intl;
    this.props.notify(
      formatMessage({ id: 'notify_uploading_image', defaultMessage: 'Uploading image' }),
      'info',
    );
    const formData = new FormData();
    formData.append('files', blob);

    fetch(`https://busy-img.herokuapp.com/@${this.props.user.name}/uploads`, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(res => callback(res.secure_url, blob.name))
      .catch(() => {
        errorCallback();
        this.props.notify(
          formatMessage({
            id: 'notify_uploading_iamge_error',
            defaultMessage: "Couldn't upload image",
          }),
          'error',
        );
      });
  };

  saveDraft = debounce((form) => {
    const data = this.getNewPostData(form);
    const postBody = data.body;
    let id = this.props.draftId;
    // Remove zero width space
    const isBodyEmpty = postBody.replace(/[\u200B-\u200D\uFEFF]/g, '').trim().length === 0;

    if (isBodyEmpty) return;

    let redirect = false;

    if (id === null) {
      id = Date.now().toString(16);
      redirect = true;
    }

    this.props.saveDraft({ postData: data, id }, redirect);
  }, 400);

  render() {
    const { initialTitle, initialTopics, initialBody, initialReward, initialUpvote } = this.state;
    const { loading, saving, draftId } = this.props;

    return (
      <div className="shifted">
        <div className="post-layout container">
          <Affix className="rightContainer" stickPosition={77}>
            <div className="right">
              <GetBoost />
            </div>
          </Affix>
          <div className="center">
            <Editor
              ref={this.setForm}
              saving={saving}
              title={initialTitle}
              topics={initialTopics}
              body={initialBody}
              reward={initialReward}
              upvote={initialUpvote}
              draftId={draftId}
              loading={loading}
              isUpdating={this.state.isUpdating}
              onUpdate={this.saveDraft}
              onSubmit={this.onSubmit}
              onDelete={this.onDelete}
              onImageInserted={this.handleImageInserted}
            />
          </div>
          {this.state.showModalDelete && (
            <DeleteDraftModal
              draftId={draftId}
              onDelete={this.onDeleteDraft}
              onCancel={() => {
                this.setState({ showModalDelete: false });
              }}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Write;
