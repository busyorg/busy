import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { isSmall } from 'react-responsive-utils';
import classNames from 'classnames';
import Textarea from 'react-textarea-autosize';
import keycode from 'keycode';
import Icon from '../widgets/Icon';
import * as commentActions from './commentsActions';
import './CommentForm.scss';

@connect(
  state => ({
    sidebarIsVisible: state.app.sidebarIsVisible,
    comments: state.comments,
    posts: state.posts,
  }),
  (dispatch) => bindActionCreators({
    sendComment: depth => commentActions.sendComment(depth),
    updateCommentingDraft: commentActions.updateCommentingDraft,
    closeCommentingDraft: commentActions.closeCommentingDraft,
  }, dispatch)
)
export default class CommentForm extends Component {
  constructor(props) {
    super(props);
  }

  updateDraft() {
    this.props.updateCommentingDraft({
      id: this.props.comments.currentDraftId,
      body: this._input.value,
    });
  }

  handleKey(e, commentDepth) {
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

    if(shouldUpdateDraft) {
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
      <div onClick={e => this.handlePageClick(e)} className={commentsClass}>
        <div className="container">
          { comments.currentDraftId &&
            <div className="mb-1">
              <i className="icon icon-sm material-icons">reply</i>
              { ' ' }<FormattedMessage id="reply_to" />{ ' ' }
              <b>
                { parentTitle }
              </b>
            </div>
          }
          <Textarea
            ref={(c) => { this._input = c; }}
            className="CommentForm__input"
            onKeyDown={(e) => this.handleKey(e, commentDepth)}
            placeholder={'Write a comment...'}
          />
          <a className="CommentForm__close" onClick={() => closeCommentingDraft()}>
            <Icon name="clear" />
          </a>
        </div>
      </div>
    );
  }
}
