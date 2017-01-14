import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { isSmall } from 'react-responsive-utils';
import classNames from 'classnames';
import Textarea from 'react-textarea-autosize';
import keycode from 'keycode';
import Icon from '../widgets/Icon';
import PostEditor from '../post/Write/PostEditor';
import * as commentActions from './commentsActions';
import './CommentForm.scss';

@connect(
  state => ({
    sidebarIsVisible: state.app.sidebarIsVisible,
    comments: state.comments,
    posts: state.posts,
    auth: state.auth
  }),
  dispatch => bindActionCreators({
    sendComment: depth => commentActions.sendComment(depth),
    updateCommentingDraft: commentActions.updateCommentingDraft,
    closeCommentingDraft: commentActions.closeCommentingDraft,
  }, dispatch)
)
export default class CommentForm extends Component {

  updateDraft() {
    // debugger;
    const body = this._input.getContent().markdown;
    this.props.updateCommentingDraft({
      id: this.props.comments.currentDraftId,
      body,
    });
  }

  handleKey(e, commentDepth) {
    console.log('handleKey');
    if (keycode(e) === 'enter' && !e.shiftKey) {
      this.updateDraft();
      this.props.sendComment(commentDepth);
    }
  }

  handlePageClick(e) {
    e.stopPropagation();
  }

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

  render() {
    const { comments, sidebarIsVisible, closeCommentingDraft, posts, auth } = this.props;
    const { user } = auth;

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
        parentTitle = `@${replyingComment.author} in ${replyingComment.root_title}`;
        commentDepth = commentsData[comments.currentDraftId].depth + 1;
      } else {
        parentTitle = posts[comments.currentDraftId].title;
        commentDepth = 1;
      }
    }

    return (
      <div onClick={e => this.handlePageClick(e)} className={commentsClass}>
        <div className="container">
          {comments.currentDraftId &&
            <div className="mb-1">
              <i className="icon icon-sm material-icons">reply</i>
              {' '}<FormattedMessage id="reply_to" />{' '}
              <b>
                {parentTitle}
              </b>
            </div>
          }
          <PostEditor
            user={user}
            className="CommentForm__input"
            placeholder={'Write a comment...'}
            onKeyDown={e => this.handleKey(e, commentDepth)}
            required
            ref={
              (c) => { this._input = c && c.getWrappedInstance ? c.getWrappedInstance() : c; }
            }
          />
          <a className="CommentForm__close" onClick={() => closeCommentingDraft()}>
            <Icon name="clear" />
          </a>
        </div>
      </div>
    );
  }
}
