import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as commentActions from './commentsActions';
import Textarea from 'react-textarea-autosize';
import keycode from 'keycode';

import './CommentForm.scss';

@connect(
  state => ({
    sidebarIsVisible: state.app.sidebarIsVisible,
    comments: state.comments,
  }),
  (dispatch) => bindActionCreators({
    sendComment: commentActions.sendComment,
    updateCommentingDraft: commentActions.updateCommentingDraft,
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

  handleKey(e) {
    if (keycode(e) === 'enter' && !e.shiftKey) {
      this.updateDraft();
      this.props.sendComment();
    }
  }

  componentDidUpdate(prevProps) {
    const { comments } = this.props;
    const draftValue = comments.currentDraftId
      ? comments.commentingDraft[comments.currentDraftId].body
      : '';

    if (prevProps.comments.isCommenting !== comments.isCommenting) {

      if (comments.isCommenting) {
        this._input.focus();
        // not using react value (controlled component) for performance reasons
        this._input.value = draftValue;
      }

      if (!comments.isCommenting) {
        this.updateDraft();
      }
    }
  }

  render() {
    const { comments, sidebarIsVisible } = this.props;

    let commentsClass = 'CommentForm';
    if (!comments.isCommenting) {
      commentsClass += ' disappear';
    }
    if (sidebarIsVisible) {
      commentsClass += ' withSidebar';
    }

    return (
      <div className={commentsClass}>
        <Textarea
          rows={1}
          ref={(c) => { this._input = c; }}
          className={'CommentForm__input'}
          onKeyDown={(e) => this.handleKey(e)}
          placeholder={'Write a comment...'}
        />
      </div>
    );
  }
}
