import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as commentActions from './commentsActions';
import Textarea from 'react-textarea-autosize';
import keycode from 'keycode';

import './CommentForm.scss';

@connect(
  state => ({
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

  handleChange = (e) => {
    this.props.updateCommentingDraft({
      id: this.props.comments.currentDraftId,
      body: e.target.value,
    });
  };

  handleKey(e) {
    if(keycode(e) === 'enter' && !e.shiftKey) {
      this.props.sendComment();
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.open !== this.props.open) {
      this._input.focus();
    }
  }

  render() {
    const { comments } = this.props;

    return (
      <div className={comments.isCommenting ? 'CommentForm' : 'CommentForm disappear'}>
        <Textarea
          rows={1}
          ref={(c) => { this._input = c; }}
          className={'CommentForm__input'}
          onKeyDown={(e) => this.handleKey(e)}
          onChange={this.handleChange}
          placeholder={'Write a comment...'}
        />
      </div>
    );
  }
}
