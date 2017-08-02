import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { isSmall } from 'react-responsive-utils';
import classNames from 'classnames';
import Textarea from 'react-textarea-autosize';
import keycode from 'keycode';
import Icon from '../widgets/Icon';
import Avatar from '../widgets/Avatar';
import * as commentActions from './commentsActions';
import { notify } from '../app/Notification/notificationActions';
import './CommentForm.less';

@withRouter
@connect(
  state => ({
    sidebarIsVisible: state.app.sidebarIsVisible,
    comments: state.comments,
    posts: state.posts,
    auth: state.auth,
  }),
  dispatch => bindActionCreators({
    sendComment: depth => commentActions.sendComment(depth),
    updateCommentingDraft: commentActions.updateCommentingDraft,
    closeCommentingDraft: commentActions.closeCommentingDraft,
    notify,
  }, dispatch)
)
export default class CommentForm extends Component {
  static PropTypes = {
    embedded: React.PropTypes.bool,
  };

  static defaultProps = {
    embedded: false,
  };

  componentWillUpdate(nextProps) {
    const { comments } = this.props;
    const shouldUpdateDraft =
      nextProps.comments.currentDraftId !== comments.currentDraftId &&
      nextProps.comments.isCommenting;

    if (shouldUpdateDraft) {
      this.updateDraft();
      this._input.focus();
    }
  }

  componentDidUpdate(prevProps) {
    const { comments } = this.props;
    const draftValue = comments.currentDraftId
      ? comments.commentingDraft[comments.currentDraftId].body
      : '';

    if (prevProps.comments.currentDraftId !== comments.currentDraftId) {
      // not using react value (controlled component) for performance reasons
      this._input.value = draftValue;
    }

    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.props.closeCommentingDraft();
    }
  }

  updateDraft() {
    this.props.updateCommentingDraft({
      id: this.props.comments.currentDraftId,
      body: this._input.value,
    });
  }

  handleKey(e) {
    if (keycode(e) === 'enter' && !e.shiftKey) {
      this.updateDraft();
    }
  }

  handlePageClick(e) {
    e.stopPropagation();
  }

  handleSubmit(e) {
    e.stopPropagation();
    this.updateDraft();
    this.props.sendComment().then(() => {
      this.props.notify('Comment submitted successfully', 'success');
    });
  }

  render() {
    const { comments, sidebarIsVisible, closeCommentingDraft, posts } = this.props;

    const commentsClass = classNames({
      CommentForm: true,
      'py-1': true,
      disappear: !comments.isCommenting,
      withSidebar: sidebarIsVisible,
      mobile: isSmall(),
    });

    let parentTitle = '';
    // will need depth in optimistic payload since it's used to style nested comments
    let commentDepth;

    const commentsData = comments.comments;
    const isReplyToComment = comments.currentDraftId
      ? comments.commentingDraft[comments.currentDraftId].isReplyToComment
      : false;

    if (comments.currentDraftId) {
      if (isReplyToComment) {
        const replyingComment = commentsData[comments.currentDraftId];
        parentTitle = `${replyingComment.author} in ${replyingComment.root_title}`;
        commentDepth = commentsData[comments.currentDraftId].depth + 1;
      } else {
        parentTitle = posts[comments.currentDraftId].title;
        commentDepth = 1;
      }
    }

    return (
      <div
        onClick={e => this.handlePageClick(e)}
        className={commentsClass}
      >
        <div className="container">
          <a className="pull-right" onClick={() => closeCommentingDraft()}>
            <Icon name="clear" />
          </a>

          {comments.currentDraftId &&
            <div className="my-2">
              <i className="icon icon-sm material-icons">reply</i>
              {' '}<FormattedMessage id="reply_to" defaultMessage="Reply To" />{' '}
              <b>{parentTitle}</b>
            </div>
          }
          <Textarea
            ref={(c) => { this._input = c; }}
            className="CommentForm__input my-2 p-2"
            onKeyDown={e => this.handleKey(e)}
            placeholder={'Write a comment...'}
          />
          <button
            onClick={e => this.handleSubmit(e, commentDepth)}
            className="btn btn-success CommentForm__submit"
          >
            <Icon name="send" />
          </button>
        </div>
      </div>
    );
  }
}
