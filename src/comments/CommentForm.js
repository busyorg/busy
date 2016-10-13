import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as commentActions from './commentsActions';
import Textarea from 'react-textarea-autosize';
import keycode from 'keycode';

import './CommentForm.scss';

@connect(
  state => ({
    comments: state.comments
  }),
  (dispatch) => ({
    sendComment: bindActionCreators(commentActions.sendComment, dispatch)
  })
)
export default class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: ''
    };
  }

  static propTypes = {
    open: PropTypes.bool.isRequired,
    parentPermlink: PropTypes.string,
    parentAuthor: PropTypes.string,
    category: PropTypes.string,
  };

  handleChange = (e) => {
    this.setState({ comment: e.target.value });
  };

  handleKey(e) {
    if(keycode(e) === 'enter' && !e.shiftKey) {
      const { sendComment, parentAuthor, parentPermlink, category } = this.props;
      sendComment(category, parentAuthor, parentPermlink, e.target.value);
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.open !== this.props.open) {
      this._input.focus();
    }
  }

  render() {
    const { open } = this.props;

    return (
      <div className={open ? 'CommentForm' : 'CommentForm disappear'}>
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
