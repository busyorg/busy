import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { replace } from 'react-router-redux';
import _ from 'lodash';
import 'url-search-params-polyfill';
import { injectIntl } from 'react-intl';
import uuidv4 from 'uuid/v4';
import improve from '../../helpers/improve';
import { createPostMetadata } from '../../helpers/postHelpers';
import { rewardsValues } from '../../../common/constants/rewards';
import LastDraftsContainer from './LastDraftsContainer';
import DeleteDraftModal from './DeleteDraftModal';

import {
  getAuthenticatedUser,
  getDraftPosts,
  getIsEditorLoading,
  getIsEditorSaving,
  getRewardSetting,
} from '../../reducers';

import { createPost, saveDraft, newPost } from './editorActions';
import Editor from '../../components/Editor/Editor';
import Affix from '../../components/Utils/Affix';

@injectIntl
@withRouter
@connect(
  (state, props) => ({
    user: getAuthenticatedUser(state),
    draftPosts: getDraftPosts(state),
    loading: getIsEditorLoading(state),
    saving: getIsEditorSaving(state),
    draftId: new URLSearchParams(props.location.search).get('draft'),
    rewardSetting: getRewardSetting(state),
  }),
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
    draftPosts: PropTypes.shape().isRequired,
    loading: PropTypes.bool.isRequired,
    intl: PropTypes.shape().isRequired,
    saving: PropTypes.bool,
    draftId: PropTypes.string,
    rewardSetting: PropTypes.string,
    newPost: PropTypes.func,
    createPost: PropTypes.func,
    saveDraft: PropTypes.func,
    replace: PropTypes.func,
  };

  static defaultProps = {
    saving: false,
    draftId: null,
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
      initialTitle: '',
      initialTopics: [],
      initialBody: '',
      initialReward: this.props.rewardSetting,
      initialBeneficiary: true,
      initialUpdatedDate: Date.now(),
      isUpdating: false,
      showModalDelete: false,
    };
  }

  // NOTE: To be replaced with getDerivedStateFromProps or refactored entirely after React 16.3
  componentWillMount() {
    this.props.newPost();
    const { draftPosts, draftId } = this.props;
    const draftPost = draftPosts[draftId];

    if (draftPost) {
      let tags = [];
      if (_.isArray(draftPost.jsonMetadata.tags)) {
        tags = draftPost.jsonMetadata.tags;
      }

      if (draftPost.permlink) {
        this.permlink = draftPost.permlink;
      }

      if (draftPost.originalBody) {
        this.originalBody = draftPost.originalBody;
      }

      this.setState({
        initialTitle: draftPost.title || '',
        initialTopics: tags || [],
        initialBody: draftPost.body || '',
        initialReward: draftPost.reward,
        initialBeneficiary:
          typeof draftPost.beneficiary !== 'undefined' ? draftPost.beneficiary : true,
        initialUpdatedDate: draftPost.lastUpdated || Date.now(),
        isUpdating: draftPost.isUpdating || false,
      });
    }

    if (draftId) {
      this.draftId = draftId;
    } else {
      this.draftId = uuidv4();
    }
  }

  componentWillReceiveProps(nextProps) {
    const newDraft = nextProps.draftId === null;
    const differentDraft = this.props.draftId !== nextProps.draftId;
    if (differentDraft && newDraft) {
      this.draftId = uuidv4();
      this.setState({
        initialTitle: '',
        initialTopics: [],
        initialBody: '',
        initialReward: rewardsValues.half,
        initialBeneficiary: true,
        initialUpdatedDate: Date.now(),
        isUpdating: false,
        showModalDelete: false,
      });
    } else if (differentDraft) {
      const { draftPosts, draftId } = nextProps;
      const draftPost = _.get(draftPosts, draftId, {});
      const initialTitle = _.get(draftPost, 'title', '');
      const initialBody = _.get(draftPost, 'body', '');
      const initialTopics = _.get(draftPost, 'jsonMetadata.tags', []);
      const initialReward = _.get(draftPost, 'reward', rewardsValues.half);
      const initialBeneficiary = _.get(draftPost, 'beneficiary', true);
      this.draftId = draftId;
      this.setState({
        initialTitle,
        initialBody,
        initialTopics,
        initialReward,
        initialBeneficiary,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (_.get(this.props, 'location.search') !== _.get(prevProps, 'location.search')) {
      this.saveDraft.cancel();
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
      beneficiary: form.beneficiary,
      lastUpdated: Date.now(),
    };

    data.parentAuthor = '';
    data.author = this.props.user.name || '';

    if (data.title && !this.permlink) {
      data.permlink = _.kebabCase(data.title);
    } else {
      data.permlink = this.permlink;
    }

    if (this.state.isUpdating) data.isUpdating = this.state.isUpdating;

    const oldMetadata =
      this.props.draftPosts[this.draftId] && this.props.draftPosts[this.draftId].jsonMetadata;

    data.parentPermlink = form.topics.length ? form.topics[0] : 'general';
    data.jsonMetadata = createPostMetadata(data.body, form.topics, oldMetadata);

    if (this.originalBody) {
      data.originalBody = this.originalBody;
    }

    return data;
  };

  handleCancelDeleteDraft = () => this.setState({ showModalDelete: false });

  saveDraft = _.debounce(form => {
    if (this.props.saving) return;

    const data = this.getNewPostData(form);
    const postBody = data.body;
    const id = this.props.draftId;
    // Remove zero width space
    const isBodyEmpty = postBody.replace(/[\u200B-\u200D\uFEFF]/g, '').trim().length === 0;

    if (isBodyEmpty) return;

    const redirect = id !== this.draftId;

    this.props.saveDraft({ postData: data, id: this.draftId }, redirect, this.props.intl);
  }, 2000);

  render() {
    const {
      initialTitle,
      initialTopics,
      initialBody,
      initialReward,
      initialBeneficiary,
    } = this.state;
    const { loading, saving, draftId } = this.props;

    return (
      <div className="shifted">
        <div className="post-layout container">
          <Affix className="rightContainer" stickPosition={77}>
            <div className="right">
              <LastDraftsContainer />
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
              beneficiary={initialBeneficiary}
              draftId={draftId}
              loading={loading}
              isUpdating={this.state.isUpdating}
              onUpdate={this.saveDraft}
              onSubmit={this.onSubmit}
              onDelete={this.onDelete}
            />
          </div>
          {this.state.showModalDelete && (
            <DeleteDraftModal
              draftIds={[draftId]}
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
