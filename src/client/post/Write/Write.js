import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { replace } from 'react-router-redux';
import kebabCase from 'lodash/kebabCase';
import debounce from 'lodash/debounce';
import isArray from 'lodash/isArray';
import 'url-search-params-polyfill';
import { injectIntl } from 'react-intl';
import uuidv4 from 'uuid/v4';
import { getHtml } from '../../components/Story/Body';
import improve from '../../helpers/improve';
import { extractImages, extractLinks } from '../../helpers/parser';
import { rewardsValues } from '../../../common/constants/rewards';
import DeleteDraftModal from './DeleteDraftModal';
import LastDraftsContainer from './LastDraftsContainer';

import {
  getAuthenticatedUser,
  getDraftPosts,
  getIsEditorLoading,
  getIsEditorSaving,
  getUpvoteSetting,
  getRewardSetting,
} from '../../reducers';

import { createPost, saveDraft, newPost } from './editorActions';
import Editor from '../../components/Editor/Editor';
import Affix from '../../components/Utils/Affix';

const version = require('../../../../package.json').version;

@injectIntl
@withRouter
@connect(
  (state, props) => {
    const draftId = new URLSearchParams(props.location.search).get('draft');

    const draftPost = getDraftPosts(state)[draftId] || {
      jsonMetadata: {},
    };

    let tags = [];
    if (isArray(draftPost.jsonMetadata.tags)) {
      tags = draftPost.jsonMetadata.tags;
    }

    return {
      draftId,
      user: getAuthenticatedUser(state),
      loading: getIsEditorLoading(state),
      saving: getIsEditorSaving(state),
      updating: draftPost.isUpdating,
      permlink: draftPost.permlink,
      initialTitle: draftPost.title,
      initialTopics: tags,
      initialBody: draftPost.body,
      originalBody: draftPost.originalBody,
      jsonMetadata: draftPost.jsonMetadata,
      upvoteSetting: getUpvoteSetting(state),
      rewardSetting: getRewardSetting(state),
    };
  },
  {
    createPost,
    saveDraft,
    newPost,
    replace,
  },
)
class Write extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    loading: PropTypes.bool.isRequired,
    saving: PropTypes.bool.isRequired,
    draftId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    updating: PropTypes.bool,
    permlink: PropTypes.string,
    initialTitle: PropTypes.string,
    initialTopics: PropTypes.arrayOf(PropTypes.string),
    initialBody: PropTypes.string,
    originalBody: PropTypes.string,
    jsonMetadata: PropTypes.shape(),
    upvoteSetting: PropTypes.bool,
    rewardSetting: PropTypes.string,
    newPost: PropTypes.func,
    createPost: PropTypes.func,
    saveDraft: PropTypes.func,
    replace: PropTypes.func,
  };

  static defaultProps = {
    draftId: null,
    updating: false,
    permlink: '',
    initialTitle: '',
    initialTopics: [],
    initialBody: '',
    originalBody: '',
    jsonMetadata: {},
    upvoteSetting: true,
    rewardSetting: rewardsValues.half,
    newPost: () => {},
    createPost: () => {},
    saveDraft: () => {},
    notify: () => {},
    replace: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      isUpdating: false,
      showModalDelete: false,
    };

    this.handleDraftDeleted = this.handleDraftDeleted.bind(this);
    this.handleDeleteDraftClick = this.handleDeleteDraftClick.bind(this);
    this.handleDeleteDraftCancel = this.handleDeleteDraftCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.getNewPostData = this.getNewPostData.bind(this);
  }

  componentDidMount() {
    this.props.newPost();
  }

  getNewPostData(form) {
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
    let matches;

    const postBody = data.body;

    // eslint-disable-next-line
    while ((matches = userRegex.exec(postBody))) {
      if (users.indexOf(matches[1]) === -1) {
        users.push(matches[1]);
      }
    }

    const parsedBody = getHtml(postBody, {}, 'text');

    const images = extractImages(parsedBody);
    const links = extractLinks(parsedBody);

    data.isUpdating = this.props.updating;
    data.permlink = this.props.permlink || kebabCase(data.title);
    if (this.props.originalBody) {
      data.originalBody = this.props.originalBody;
    }

    let metaData = {
      community: 'busy',
      app: `busy/${version}`,
      format: 'markdown',
    };

    // Merging jsonMetadata makes sure that users don't lose any metadata when they edit post using
    // Busy (like video data from DTube)
    if (this.props.jsonMetadata) {
      metaData = {
        ...metaData,
        ...this.props.jsonMetadata,
      };
    }

    if (tags.length) {
      metaData.tags = tags;
    }
    if (users.length) {
      metaData.users = users;
    }
    if (links.length) {
      metaData.links = links.slice(0, 10);
    }
    if (images.length) {
      metaData.image = images;
    }

    data.parentPermlink = tags.length ? tags[0] : 'general';
    data.jsonMetadata = metaData;

    return data;
  }

  handleDraftDeleted() {
    this.setState(
      {
        showModalDelete: false,
      },
      () => this.props.replace('/editor'),
    );
  }

  handleDeleteDraftCancel() {
    this.setState({ showModalDelete: false });
  }

  handleDeleteDraftClick() {
    this.setState({ showModalDelete: true });
  }

  handleSubmit(form) {
    const data = this.getNewPostData(form);
    data.body = improve(data.body);
    data.draftId = this.props.draftId;
    this.props.createPost(data);
  }

  handleDraftSave = debounce(form => {
    if (this.props.saving) return;

    const data = this.getNewPostData(form);
    const postBody = data.body;
    const id = this.props.draftId;
    // Remove zero width space
    const isBodyEmpty = postBody.replace(/[\u200B-\u200D\uFEFF]/g, '').trim().length === 0;

    if (isBodyEmpty) return;

    this.props.saveDraft({ postData: data, id: id || uuidv4() }, !!id);
  }, 2000);

  render() {
    const {
      loading,
      saving,
      updating,
      draftId,
      initialTitle,
      initialTopics,
      initialBody,
      upvoteSetting,
      rewardSetting,
    } = this.props;

    return (
      <div className="shifted">
        <div className="post-layout container">
          <div className="center">
            <Editor
              ref={this.setForm}
              saving={saving}
              title={initialTitle}
              topics={initialTopics}
              body={initialBody}
              upvote={upvoteSetting}
              reward={rewardSetting}
              draftId={draftId}
              loading={loading}
              isUpdating={updating}
              onUpdate={this.handleDraftSave}
              onSubmit={this.handleSubmit}
              onDelete={this.handleDeleteDraftClick}
            />
          </div>
          <Affix className="rightContainer" stickPosition={77}>
            <div className="right">
              <LastDraftsContainer />
            </div>
          </Affix>

          {this.state.showModalDelete && (
            <DeleteDraftModal
              draftIds={[draftId]}
              onDelete={this.handleDraftDeleted}
              onCancel={this.handleDeleteDraftCancel}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Write;
