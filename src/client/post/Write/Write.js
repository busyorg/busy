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

    return {
      draftId,
      draftPost: getDraftPosts(state)[draftId],
      user: getAuthenticatedUser(state),
      loading: getIsEditorLoading(state),
      saving: getIsEditorSaving(state),
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
    draftPost: PropTypes.shape(),
    loading: PropTypes.bool.isRequired,
    saving: PropTypes.bool,
    draftId: PropTypes.string,
    upvoteSetting: PropTypes.bool,
    rewardSetting: PropTypes.string,
    newPost: PropTypes.func,
    createPost: PropTypes.func,
    saveDraft: PropTypes.func,
    replace: PropTypes.func,
  };

  static defaultProps = {
    draftPost: null,
    saving: false,
    draftId: null,
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
      initialTitle: '',
      initialTopics: [],
      initialBody: '',
      initialReward: this.props.rewardSetting,
      initialUpvote: this.props.upvoteSetting,
      initialUpdatedDate: Date.now(),
      isUpdating: false,
      showModalDelete: false,
    };

    this.draftId = uuidv4();

    this.loadPost = this.loadPost.bind(this);
  }

  componentDidMount() {
    this.props.newPost();
    const { draftPost, draftId } = this.props;
    if (draftPost) {
      this.loadPost(draftPost);
    }

    if (draftId) {
      this.draftId = draftId;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.loaded && this.props.draftId === nextProps.draftId) return;

    if (nextProps.draftPost) {
      this.loadPost(nextProps.draftPost);
      if (nextProps.draftId) {
        this.draftId = nextProps.draftId;
      }
    }
  }

  onDeleteDraft = () => this.props.replace('/editor');

  onDelete = () => this.setState({ showModalDelete: true });

  onSubmit = form => {
    const data = this.getNewPostData(form);
    data.body = improve(data.body);
    if (this.props.draftId) {
      data.draftId = this.props.draftId;
    }
    this.props.createPost(data);
  };

  getNewPostData = form => {
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

    if (data.title && !this.permlink) {
      data.permlink = kebabCase(data.title);
    } else {
      data.permlink = this.permlink;
    }

    if (this.state.isUpdating) data.isUpdating = this.state.isUpdating;

    let metaData = {
      community: 'busy',
      app: `busy/${version}`,
      format: 'markdown',
    };

    // Merging jsonMetadata makes sure that users don't lose any metadata when they edit post using
    // Busy (like video data from DTube)
    if (this.props.draftPost && this.props.draftPost.jsonMetadata) {
      metaData = {
        ...metaData,
        ...this.props.draftPost.jsonMetadata,
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

    if (this.originalBody) {
      data.originalBody = this.originalBody;
    }

    return data;
  };

  loadPost(draftPost) {
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
      loaded: true,
      initialTitle: draftPost.title || '',
      initialTopics: tags || [],
      initialBody: draftPost.body || '',
      initialReward: draftPost.reward,
      initialUpvote: draftPost.upvote,
      initialUpdatedDate: draftPost.lastUpdated || Date.now(),
      isUpdating: draftPost.isUpdating || false,
    });
  }

  handleCancelDeleteDraft = () => this.setState({ showModalDelete: false });

  saveDraft = debounce(form => {
    if (this.props.saving) return;

    const data = this.getNewPostData(form);
    const postBody = data.body;
    const id = this.props.draftId;
    // Remove zero width space
    const isBodyEmpty = postBody.replace(/[\u200B-\u200D\uFEFF]/g, '').trim().length === 0;

    if (isBodyEmpty) return;

    const redirect = id !== this.draftId;

    this.props.saveDraft({ postData: data, id: this.draftId }, redirect);
  }, 2000);

  render() {
    const { initialTitle, initialTopics, initialBody, initialReward, initialUpvote } = this.state;
    const { loading, saving, draftId } = this.props;

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
              reward={initialReward}
              upvote={initialUpvote}
              draftId={draftId}
              loading={loading}
              isUpdating={this.state.isUpdating}
              onUpdate={this.saveDraft}
              onSubmit={this.onSubmit}
              onDelete={this.onDelete}
            />
          </div>
          <Affix className="rightContainer" stickPosition={77}>
            <div className="right">
              <LastDraftsContainer />
            </div>
          </Affix>

          {this.state.showModalDelete && (
            <DeleteDraftModal
              draftId={draftId}
              onDelete={this.onDeleteDraft}
              onCancel={this.handleCancelDeleteDraft}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Write;
