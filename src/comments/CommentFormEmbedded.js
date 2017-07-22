import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { isSmall } from 'react-responsive-utils';
import _ from 'lodash';
import classNames from 'classnames';
import Textarea from 'react-textarea-autosize';
import Icon from '../widgets/Icon';
import * as commentActions from './commentsActions';
import Loading from '../widgets/Loading';
import { notify } from '../app/Notification/notificationActions';
import './CommentForm.scss';

@withRouter
@connect(
  state => ({
    comments: state.comments,
    posts: state.posts,
    auth: state.auth,
  }),
  dispatch => bindActionCreators({
    sendComment: (parentId) => commentActions.sendComment(parentId),
    updateCommentingDraft: commentActions.updateCommentingDraft,
    notify,
  }, dispatch)
)
export default class CommentFormEmbedded extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draftValue: '',
      loading: false,
    };
  }

  static PropTypes = {
    parentId: React.PropTypes.string.isRequired,
    isReplyToComment: React.PropTypes.bool,
  };

  static defaultProps = {
    isReplyToComment: false,
    focusOnMount: false,
  };

  componentDidMount() {
    const { parentId, posts, comments, isReplyToComment, isEditing, focusOnMount } = this.props;
    const content = isReplyToComment ? comments.comments[parentId] : posts[parentId];
    let payload;

    if (isEditing) {
      payload = {
        id: parentId,
        parentAuthor: content.parent_author,
        category: content.category,
        permlink: content.permlink,
        parentPermlink: content.parent_permlink,
        isReplyToComment: true,
        isEditing: true,
        body: content.body,
      };
    } else {
      payload = {
        id: parentId,
        body: '',
        parentAuthor: content.author,
        parentPermlink: content.permlink,
        category: content.category,
        isReplyToComment,
      };
    }

    if (focusOnMount) {
      this._input.focus();
    }

    this.props.updateCommentingDraft(payload);
    this.loadDraft();
  }

  componentWillReceiveProps(nextProps) {
    const { parentId, comments } = nextProps;
    const draftValue =
      (comments.commentingDraft[parentId] && comments.commentingDraft[parentId].body);

    this.setState({ draftValue });
  }

  updateDraft = _.debounce(() => {
    this.props.updateCommentingDraft({
      id: this.props.parentId,
      body: this.state.draftValue,
    });
  }, 1000);

  loadDraft() {
    const { parentId, comments } = this.props;
    const draftValue =
      (comments.commentingDraft[parentId] && comments.commentingDraft[parentId].body);

    this.setState({ draftValue });
  }

  handleSubmit(e) {
    e.stopPropagation();
    this.setState({ draftValue: '', loading: true });
    this.props.sendComment(this.props.parentId).then(() => {
      this.setState({ draftValue: '', loading: false });
      this.props.updateCommentingDraft({
        id: this.props.parentId,
        body: '',
      });
      this.props.notify('Comment submitted successfully', 'success');
      if (_.isFunction(this.props.onSubmit)) this.props.onSubmit();
    });
  }

  handleTextChange = (e) => {
    this.setState({ draftValue: e.target.value });
    this.updateDraft();
  };

  render() {
    const { comments, posts, isReplyToComment, parentId } = this.props;

    if (this.state.loading) {
      return <Loading />;
    }

    const commentsClass = classNames({
      CommentForm: true,
      'CommentForm--embedded': true,
      'py-1': true,
      mobile: isSmall(),
    });

    let parentTitle = '';
    const commentsData = comments.comments;

    if (isReplyToComment) {
      const replyingComment = commentsData[parentId];
      parentTitle = `${replyingComment.author} in ${replyingComment.root_title}`;
    } else {
      parentTitle = posts[parentId].title;
    }

    if (!this.props.auth.isAuthenticated) {
      return null;
    }

    return (
      <div className={commentsClass}>
        <div className="container">

          <div className="my-2">
            <i className="icon icon-sm material-icons">reply</i>
            {' '}<FormattedMessage id="reply_to" defaultMessage="Reply To" />{' '}
            <b>{parentTitle}</b>
          </div>

          <Textarea
            className="CommentForm__input my-2 p-2"
            placeholder={'Write a comment...'}
            value={this.state.draftValue}
            onChange={this.handleTextChange}
            id="BusyEmbeddedCommentForm"
            ref={(c) => { this._input = c }}
          />
          <button
            onClick={e => this.handleSubmit(e)}
            className="btn btn-success CommentForm__submit"
          >
            <Icon name="send" />
          </button>
        </div>
      </div>
    );
  }
}
